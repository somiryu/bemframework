<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import FacilitatorControlPanel from '$lib/components/workshop/FacilitatorControlPanel.svelte';
	import { world5WorkshopSlides, type WorkshopSlide5 } from '$lib/content/world5WorkshopData';
	import confetti from 'canvas-confetti';

	let {
		player: initialPlayer,
		instance,
		onComplete
	}: {
		player: any;
		instance: any;
		onComplete: () => void;
	} = $props();

	// Session management helper
	const session = createWorkshopSession(initialPlayer, instance, 5, onComplete);

	// State records mapped per playerId
	let playerChallenges = $state<Record<string, number>>({}); // playerId -> slideId
	let playerAnswers = $state<Record<string, any>>({}); // playerId -> localAnswer
	let playerSubmitted = $state<Record<string, boolean>>({}); // playerId -> boolean
	let activationCounts = $state<Record<string, number>>({}); // playerId -> activation count
	let dbWriteTimeout: any;

	// Taller state
	let currentPhase = $state<1 | 2 | 3>(1);
	let visitedSlideIds = $state<number[]>([]);
	let isPaused = $state(false);

	// Active and transition players
	let activePlayers = $state<string[]>([]); // Player IDs currently answering
	let nextPlayerId = $state<string | null>(null); // Chosen player preparing for the next turn
	let cedingPlayerId = $state<string | null>(null); // Player who has ceded turn but is displayed during transition

	// Timers
	let transitionTimer = $state(15);
	let transitionInterval: any;

	// Alignment Bar (GIOCHI)
	let alignmentScore = $state(50); // Starts at 50%

	// Toast notification system
	let toasts = $state<{ id: string; text: string; type: 'phase' | 'turn' }[]>([]);

	// Phase-filtered questions
	const phaseSlides = $derived(world5WorkshopSlides.filter(s => s.part === currentPhase));

	// Check if this client is currently an active player
	const isPlayerActive = $derived(activePlayers.includes(session.player.id));
	// Only show the player's own card if they are an active player, otherwise show all active players to spectators/hosts
	const displayedPlayers = $derived(isPlayerActive ? [session.player.id] : activePlayers);
	// Check if this client is the designated next player preparing
	const isPlayerPrep = $derived(nextPlayerId === session.player.id);
	// Count how many active players have submitted
	const submittedCount = $derived(activePlayers.filter(pId => playerSubmitted[pId]).length);

	let lastScrollTime = 0;
	$effect(() => {
		// Read states to establish reactivity
		const _answers = { ...playerAnswers };
		const _submitted = { ...playerSubmitted };

		if (isPlayerActive) return;

		const now = Date.now();
		if (now - lastScrollTime < 2000) return;

		setTimeout(() => {
			const targetEl = document.querySelector('.w5-option-card.selected') ||
			                 document.querySelector('.w5-option-card.active-selection');
			if (targetEl) {
				const card = targetEl.closest('.w5-scenario-card') || targetEl;
				card.scrollIntoView({ behavior: 'smooth', block: 'center' });
				lastScrollTime = Date.now();
			}
		}, 150);
	});

	function isPlayerAnswerAligned(playerId: string, playerCh: any) {
		const submitted = playerSubmitted[playerId];
		const answer = playerAnswers[playerId];
		if (!submitted || answer === null || answer === undefined) return false;
		
		if (playerCh.type === 'selection') {
			return answer === playerCh.correctOption;
		} else if (playerCh.type === 'sorting') {
			let correctCount = 0;
			let totalItems = playerCh.sortingItems?.length || 1;
			playerCh.sortingItems?.forEach((item: any) => {
				const basket = answer.sortingBaskets?.[item.correctCategory] || [];
				if (basket.some((b: any) => b.id === item.id)) {
					correctCount++;
				}
			});
			return correctCount === totalItems;
		} else if (playerCh.type === 'slider') {
			return answer === playerCh.correctIntensity;
		}
		return false;
	}

	function pickRandomItems(items: any[], count: number) {
		const shuffled = [...items].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	function getSortingData(activePlayerId: string, playerCh: any) {
		const existing = playerAnswers[activePlayerId];
		if (existing && typeof existing === 'object' && existing.sortingBaskets) {
			return existing;
		}
		const allItems = playerCh.sortingItems ? JSON.parse(JSON.stringify(playerCh.sortingItems)) : [];
		return {
			dragItems: pickRandomItems(allItems, 2),
			sortingBaskets: { push: [], digest: [], silence: [] }
		};
	}

	function ensureSortingDataInitialized() {
		for (const pId of activePlayers) {
			const chId = playerChallenges[pId];
			if (chId == null) continue;
			const ch = world5WorkshopSlides.find(s => s.id === chId);
			if (ch?.type !== 'sorting') continue;
			if (playerAnswers[pId] && typeof playerAnswers[pId] === 'object' && playerAnswers[pId].sortingBaskets) continue;
			const allItems = ch.sortingItems ? JSON.parse(JSON.stringify(ch.sortingItems)) : [];
			playerAnswers[pId] = {
				dragItems: pickRandomItems(allItems, 2),
				sortingBaskets: { push: [], digest: [], silence: [] }
			};
		}
	}

	// Toast Helper
	function addToast(text: string, type: 'phase' | 'turn') {
		const id = Math.random().toString(36).substr(2, 9);
		toasts = [...toasts, { id, text, type }];
		setTimeout(() => {
			toasts = toasts.filter(t => t.id !== id);
		}, 4000);
	}

	onMount(() => {
		session.loadAllClassPlayers();

		if (supabase) {
			// Query initial state
			supabase
				.from('course_instances')
				.select('current_workshop_state')
				.eq('code', instance.code)
				.single()
				.then(({ data: inst }) => {
					const instState = inst?.current_workshop_state;
					if (instState && instState.world_id === 5) {
						syncFromDatabaseState(instState);
					} else if (session.isHost) {
						handleResetWorkshop(); // Initialize fresh state for World 5
					}
				});

			// Subscribe to course_instances changes
			const instanceChannel = supabase
				.channel(`course_instance_sync_w5_${instance.code}`)
				.on('postgres_changes', {
					event: 'UPDATE',
					schema: 'public',
					table: 'course_instances',
					filter: `code=eq.${instance.code}`
				}, (payload: any) => {
					const instState = payload.new?.current_workshop_state;
					if (instState && instState.world_id === 5) {
						syncFromDatabaseState(instState);
					}
				})
				.subscribe();
		}

		session.initConnection(async (event, payload) => {
			if (event === 'state-sync') {
				syncFromDatabaseState(payload);
			} else if (event === 'toast') {
				addToast(payload.text, payload.type);
			} else if (event === 'cede-turn') {
				if (session.isHost) {
					handleCedeTurn(payload.cedingPlayerId, payload.targetStudentId);
				}
			} else if (event === 'presence-leave') {
				if (session.isHost && payload.playerId && activePlayers.includes(payload.playerId)) {
					activePlayers = activePlayers.filter(p => p !== payload.playerId);
					delete playerChallenges[payload.playerId];
					delete playerAnswers[payload.playerId];
					delete playerSubmitted[payload.playerId];
					
					// Find a new candidate spectator and activate them immediately without countdown
					const candidates = session.onlinePlayers.filter(
						p => p.email !== 'javier@f2p.co' && p.playerId !== payload.playerId && !activePlayers.includes(p.playerId)
					);
					if (candidates.length > 0) {
						const chosen = candidates[Math.floor(Math.random() * candidates.length)];
						activePlayers = [...activePlayers, chosen.playerId];
						activationCounts[chosen.playerId] = (activationCounts[chosen.playerId] || 0) + 1;

						const phaseSlides = world5WorkshopSlides.filter(s => s.part === currentPhase);
						let slideCandidates = phaseSlides.filter(s => !visitedSlideIds.includes(s.id));
						if (slideCandidates.length === 0) {
							slideCandidates = phaseSlides;
							visitedSlideIds = visitedSlideIds.filter(id => !phaseSlides.some(s => s.id === id));
						}
						const randomSlide = slideCandidates[Math.floor(Math.random() * slideCandidates.length)];

						playerChallenges[chosen.playerId] = randomSlide.id;
						visitedSlideIds = [...visitedSlideIds, randomSlide.id];
						playerAnswers[chosen.playerId] = null;
						playerSubmitted[chosen.playerId] = false;
						addToast(`⚠️ Jugador desconectado. Turno cedido a ${chosen.alias || chosen.name} automáticamente.`, 'turn');
					} else {
						addToast(`⚠️ Jugador desconectado. Su turno ha sido liberado.`, 'turn');
					}
					broadcastSync();
				}
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
					if (!state[5]) state[5] = {};
					state[5].workshop_completed = true;
					await session.updatePlayerGameState(state, {
						coins: session.player.coins + 30 // Award +30 Coins
					});
				}
				onComplete();
			}
		});

		// Start timers
		startTimerLoops();
	});

	onDestroy(() => {
		clearInterval(transitionInterval);
		clearTimeout(dbWriteTimeout);
	});

	function syncFromDatabaseState(state: any) {
		currentPhase = state.phase;
		isPaused = state.isPaused;
		activePlayers = state.activePlayers || [];
		nextPlayerId = state.nextPlayerId;
		cedingPlayerId = state.cedingPlayerId || null;
		alignmentScore = state.alignmentScore ?? 50;
		visitedSlideIds = state.visitedSlideIds || [];
		activationCounts = state.activationCounts || {};
		playerChallenges = state.playerChallenges || {};
		playerAnswers = state.playerAnswers || {};
		playerSubmitted = state.playerSubmitted || {};
		
		if (!session.isHost) {
			transitionTimer = state.transitionTimer;
		}
	}

	function broadcastSync() {
		ensureSortingDataInitialized();
		const currentState = {
			world_id: 5,
			phase: currentPhase,
			isPaused,
			activePlayers,
			nextPlayerId,
			cedingPlayerId,
			alignmentScore,
			transitionTimer,
			visitedSlideIds,
			activationCounts: $state.snapshot(activationCounts),
			playerChallenges: $state.snapshot(playerChallenges),
			playerAnswers: $state.snapshot(playerAnswers),
			playerSubmitted: $state.snapshot(playerSubmitted)
		};

		if (session.channel) {
			session.channel.send({
				type: 'broadcast',
				event: 'state-sync',
				payload: currentState
			});
		}

		if (session.isHost && supabase) {
			clearTimeout(dbWriteTimeout);
			dbWriteTimeout = setTimeout(() => {
				supabase
					.from('course_instances')
					.update({ current_workshop_state: currentState })
					.eq('code', instance.code)
					.then(() => {});
			}, 2000);
		}
	}

	function startTimerLoops() {
		// Prep modal transition countdown timer loop
		transitionInterval = setInterval(() => {
			if (isPaused || !nextPlayerId) return;
			if (transitionTimer > 0) {
				transitionTimer--;
				if (transitionTimer === 0) {
					promotePrepPlayer();
				}
			}
		}, 1000);
	}

	// Host actions
	function handleAddActivePlayer() {
		if (!session.isHost) return;
		const candidates = session.onlinePlayers.filter(
			p => p.email !== 'javier@f2p.co' && !activePlayers.includes(p.playerId)
		);
		if (candidates.length === 0) {
			addToast('No hay estudiantes espectando en vivo actualmente.', 'phase');
			return;
		}
		const lucky = candidates[Math.floor(Math.random() * candidates.length)];
		activePlayers = [...activePlayers, lucky.playerId];
		activationCounts[lucky.playerId] = (activationCounts[lucky.playerId] || 0) + 1;

		const phaseSlides = world5WorkshopSlides.filter(s => s.part === currentPhase);
		let slideCandidates = phaseSlides.filter(s => !visitedSlideIds.includes(s.id));
		if (slideCandidates.length === 0) {
			slideCandidates = phaseSlides;
			visitedSlideIds = visitedSlideIds.filter(id => !phaseSlides.some(s => s.id === id));
		}
		const randomSlide = slideCandidates[Math.floor(Math.random() * slideCandidates.length)];

		playerChallenges[lucky.playerId] = randomSlide.id;
		visitedSlideIds = [...visitedSlideIds, randomSlide.id];
		playerAnswers[lucky.playerId] = null;
		playerSubmitted[lucky.playerId] = false;

		addToast(`¡Estudiante ${lucky.alias} activado en vivo!`, 'turn');
		broadcastSync();
	}

	function handleTogglePause() {
		isPaused = !isPaused;
		broadcastSync();
	}

	function handlePhaseChange(phaseNum: 1 | 2 | 3) {
		currentPhase = phaseNum;
		visitedSlideIds = [];
		
		if (session.channel) {
			session.channel.send({
				type: 'broadcast',
				event: 'toast',
				payload: {
					text: `🔔 El facilitador ha iniciado la Fase ${phaseNum}: ${
						phaseNum === 1 ? 'Hábitos' : phaseNum === 2 ? 'Timing' : 'Ansiedad'
					}`,
					type: 'phase'
				}
			});
		}
		broadcastSync();
	}

	function handleNextRandomChallenge() {
		if (!session.isHost) return;
		if (activePlayers.length === 0) {
			addToast('No hay jugadores activos para asignarles un nuevo reto.', 'phase');
			return;
		}

		const phaseSlides = world5WorkshopSlides.filter(s => s.part === currentPhase);
		
		activePlayers.forEach(pId => {
			let slideCandidates = phaseSlides.filter(s => !visitedSlideIds.includes(s.id));
			if (slideCandidates.length === 0) {
				slideCandidates = phaseSlides;
				visitedSlideIds = visitedSlideIds.filter(id => !phaseSlides.some(s => s.id === id));
			}
			const randomSlide = slideCandidates[Math.floor(Math.random() * slideCandidates.length)];
			playerChallenges[pId] = randomSlide.id;
			visitedSlideIds = [...visitedSlideIds, randomSlide.id];
			playerAnswers[pId] = null;
			playerSubmitted[pId] = false;
		});

		addToast('🎲 Nuevos retos aleatorios cargados para jugadores activos.', 'turn');
		broadcastSync();
	}

	function handleResetWorkshop() {
		if (!session.isHost) return;
		
		currentPhase = 1;
		visitedSlideIds = [];
		playerChallenges = {};
		playerAnswers = {};
		playerSubmitted = {};
		activationCounts = {};

		isPaused = false;
		activePlayers = [];
		nextPlayerId = null;
		cedingPlayerId = null;
		transitionTimer = 15;
		alignmentScore = 50;
		
		addToast('🔄 Taller reiniciado al estado inicial.', 'phase');
		broadcastSync();
	}

	function promotePrepPlayer() {
		if (!nextPlayerId) return;
		if (cedingPlayerId) {
			activePlayers = activePlayers.filter(p => p !== cedingPlayerId);
			delete playerChallenges[cedingPlayerId];
			delete playerAnswers[cedingPlayerId];
			delete playerSubmitted[cedingPlayerId];
			cedingPlayerId = null;
		}

		activePlayers = [...activePlayers, nextPlayerId];
		activationCounts[nextPlayerId] = (activationCounts[nextPlayerId] || 0) + 1;

		const phaseSlides = world5WorkshopSlides.filter(s => s.part === currentPhase);
		let slideCandidates = phaseSlides.filter(s => !visitedSlideIds.includes(s.id));
		if (slideCandidates.length === 0) {
			slideCandidates = phaseSlides;
			visitedSlideIds = visitedSlideIds.filter(id => !phaseSlides.some(s => s.id === id));
		}
		const randomSlide = slideCandidates[Math.floor(Math.random() * slideCandidates.length)];

		playerChallenges[nextPlayerId] = randomSlide.id;
		visitedSlideIds = [...visitedSlideIds, randomSlide.id];
		playerAnswers[nextPlayerId] = null;
		playerSubmitted[nextPlayerId] = false;

		nextPlayerId = null;
		if (session.isHost) broadcastSync();
	}

	async function handleEndWorkshop() {
		if (supabase) {
			await supabase
				.from('course_instances')
				.update({ current_workshop_state: { world_id: 5, completed: true } })
				.eq('code', instance.code);
		}
		if (session.channel) {
			session.channel.send({
				type: 'broadcast',
				event: 'workshop-complete',
				payload: {}
			});
		}
		// Also complete for the host
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[5]) state[5] = {};
		state[5].workshop_completed = true;
		await session.updatePlayerGameState(state, {
			coins: session.player.coins + 30
		});
		onComplete();
	}

	// Student/Client actions
	function handleSelectOption(activePlayerId: string, optId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		playerAnswers[activePlayerId] = optId;
		broadcastSync();
	}

	// Drag & Drop event handlers (Fase 2)
	function onDragStart(e: DragEvent, itemId: string, activePlayerId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) {
			e.preventDefault();
			return;
		}
		e.dataTransfer?.setData('text/plain', itemId);
	}

	function onDragOver(e: DragEvent, activePlayerId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		e.preventDefault();
	}

	function onDrop(e: DragEvent, basketKey: 'push' | 'digest' | 'silence', activePlayerId: string) {
		e.preventDefault();
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		const itemId = e.dataTransfer?.getData('text/plain');
		if (!itemId) return;

		const playerCh = world5WorkshopSlides.find(s => s.id === playerChallenges[activePlayerId]);
		const data = getSortingData(activePlayerId, playerCh);

		data.dragItems = data.dragItems.filter((i: any) => i.id !== itemId);
		for (const key of Object.keys(data.sortingBaskets)) {
			data.sortingBaskets[key] = data.sortingBaskets[key].filter((i: any) => i.id !== itemId);
		}

		const itemDetail = playerCh?.sortingItems?.find((i: any) => i.id === itemId);
		if (itemDetail) {
			data.sortingBaskets[basketKey] = [...data.sortingBaskets[basketKey], itemDetail];
		}

		playerAnswers[activePlayerId] = data;
		broadcastSync();
	}

	function handleResetSorting(activePlayerId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		const current = playerAnswers[activePlayerId];
		if (!current || typeof current !== 'object') return;
		const allItems = [
			...(current.dragItems || []),
			...(current.sortingBaskets?.push || []),
			...(current.sortingBaskets?.digest || []),
			...(current.sortingBaskets?.silence || [])
		];
		playerAnswers[activePlayerId] = {
			dragItems: allItems,
			sortingBaskets: { push: [], digest: [], silence: [] }
		};
		broadcastSync();
	}

	function handleSliderChange(e: Event, activePlayerId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		const target = e.target as HTMLInputElement;
		playerAnswers[activePlayerId] = parseInt(target.value);
		broadcastSync();
	}

	function handleSubmitAnswer(activePlayerId: string) {
		if (activePlayerId !== session.player.id || playerSubmitted[activePlayerId]) return;
		
		const playerChId = playerChallenges[activePlayerId];
		const playerCh = world5WorkshopSlides.find(s => s.id === playerChId);
		if (!playerCh) return;

		let delta = 0;
		const localAns = playerAnswers[activePlayerId];

		if (playerCh.type === 'selection') {
			if (localAns === playerCh.correctOption) {
				delta = 8;
				try { confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } }); } catch (e) {}
			} else {
				delta = -6;
			}
		} else if (playerCh.type === 'sorting') {
			const data = getSortingData(activePlayerId, playerCh);
			let correctCount = 0;
			let totalItems = playerCh.sortingItems?.length || 1;
			playerCh.sortingItems?.forEach((item: any) => {
				const basket = data.sortingBaskets[item.correctCategory] || [];
				if (basket.some((b: any) => b.id === item.id)) {
					correctCount++;
				}
			});
			if (correctCount === totalItems) {
				delta = 12;
				try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch (e) {}
			} else {
				delta = -8;
			}
		} else if (playerCh.type === 'slider') {
			const val = localAns !== null && localAns !== undefined ? localAns : (playerCh.initialIntensity || 5);
			const diff = Math.abs(val - (playerCh.correctIntensity || 2));
			if (diff === 0) {
				delta = 10;
				try { confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } }); } catch (e) {}
			} else if (diff === 1) {
				delta = 5;
			} else {
				delta = -8;
			}
		}

		playerSubmitted[activePlayerId] = true;
		alignmentScore = Math.max(10, Math.min(90, alignmentScore + delta));

		// Set workshop_participated flag in game state
		if (activePlayerId === session.player.id) {
			const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
			if (!state[5]) state[5] = {};
			state[5].workshop_participated = true;
			session.updatePlayerGameState(state);
		}

		addToast('Respuesta enviada. Cede el turno a un compañero', 'turn');
		broadcastSync();
	}

	function handleCedeTurn(cedingPlayerIdParam: string, targetStudentId: string) {
		if (!session.isHost) return;
		nextPlayerId = targetStudentId;
		transitionTimer = 15;
		cedingPlayerId = cedingPlayerIdParam;
		
		const targetPlayer = session.onlinePlayers.find(p => p.playerId === targetStudentId);
		const aliasName = targetPlayer ? (targetPlayer.alias || targetPlayer.name) : 'Compañero';

		if (session.channel) {
			session.channel.send({
				type: 'broadcast',
				event: 'toast',
				payload: {
					text: `⏳ Siguiente Turno: ${aliasName} está preparándose para resolver el reto.`,
					type: 'turn'
				}
			});
		}
		broadcastSync();
	}
</script>

<!-- Toast Container -->
<div class="w5-toast-container">
	{#each toasts as toast (toast.id)}
		<div class="w5-toast {toast.type === 'phase' ? 'phase-change' : 'turn-change'}" transition:slide>
			<span>{toast.text}</span>
		</div>
	{/each}
</div>

<!-- Modal de Preparación -->
{#if isPlayerPrep && !isPaused}
	<div class="w5-prep-modal-backdrop" transition:fade>
		<div class="w5-prep-modal">
			<h2>🎯 Te toca a ti</h2>
			<p>El jugador activo te ha cedido el turno. Prepárate, serás activado en:</p>
			<div class="countdown-number">{transitionTimer}s</div>
		</div>
	</div>
{/if}

<!-- Host Control HUD -->
{#if session.isHost}
	<FacilitatorControlPanel 
		isHost={session.isHost}
		onlineCount={session.onlinePlayers.filter(p => p.email !== 'javier@f2p.co').length}
		submittedCount={submittedCount}
		isFirstStep={true}
		isLastStep={true}
		activeMode="final_feedback"
		onReset={handleResetWorkshop} 
		onPrev={() => {}}
		onNext={() => {}}
		onToggleMode={() => {}}
		onComplete={handleEndWorkshop}
		coinsLabel="+30 BEM Coins"
		stepLabel="Reto"
	>
		<div class="w5-phase-toggle ml-3">
			<button type="button" class:active-phase={currentPhase === 1} onclick={() => handlePhaseChange(1)}>
				Fase 1 (Hábitos)
			</button>
			<button type="button" class:active-phase={currentPhase === 2} onclick={() => handlePhaseChange(2)}>
				Fase 2 (Timing)
			</button>
			<button type="button" class:active-phase={currentPhase === 3} onclick={() => handlePhaseChange(3)}>
				Fase 3 (Ansiedad)
			</button>
		</div>
		<button type="button" class="btn-solar-primary ml-3" onclick={handleAddActivePlayer}>
			⚡ + Activo
		</button>
		<button type="button" class="btn-solar-accent ml-3 font-bold" onclick={handleNextRandomChallenge}>
			🎲 Siguiente Reto Aleatorio
		</button>
		<button type="button" class="btn-solar-warning ml-3" onclick={handleTogglePause}>
			{isPaused ? '▶ Reanudar' : '⏸ Pausar'}
		</button>
	</FacilitatorControlPanel>
{/if}

{#if isPlayerActive}
	<div class="w5-active-player-banner" transition:slide>
		<span class="banner-icon">🎯</span>
		<div class="banner-text">
			<strong class="font-extrabold uppercase">¡Es tu turno de actuar!</strong>
			<span class="text-xs opacity-90 block md:inline md:ml-2">Eres el jugador activo. Resuelve el reto asignado abajo y luego cede tu turno.</span>
		</div>
	</div>
{/if}

<!-- Layout General -->
<div class="w5-workshop-layout">
	<!-- Panel Principal -->
	<div class="w5-main-panel">
		{#if activePlayers.length === 0}
			<div class="w5-scenario-card text-center p-8">
				<div class="text-4xl mb-4">👑</div>
				<h3 class="font-bold text-lg text-stone-700">Taller Sincrónico: Llamados a la Acción</h3>
				<p class="text-sm text-stone-500 mt-2">Esperando a que el facilitador asigne al primer Jugador Activo...</p>
			</div>
		{:else}
			<div class="w5-challenges-grid">
				{#each displayedPlayers as activePlayerId (activePlayerId)}
					{@const activePlayerObj = session.onlinePlayers.find(p => p.playerId === activePlayerId)}
					{@const playerChId = playerChallenges[activePlayerId]}
					{@const playerCh = world5WorkshopSlides.find(s => s.id === playerChId) || world5WorkshopSlides[0]}
					{@const isMe = activePlayerId === session.player.id}
					{@const isPlayerChSubmitted = playerSubmitted[activePlayerId]}
					{@const playerChLocalAnswer = playerAnswers[activePlayerId]}
					{@const isChAnswerAligned = isPlayerAnswerAligned(activePlayerId, playerCh)}

					<div class="w5-scenario-card relative {!isMe ? 'w5-spectator-overlay' : ''}" data-player-id={activePlayerId}>
						<div class="w5-scenario-header">
							<div class="w5-header-left">
								<span class="w5-player-avatar">👤</span>
								<span class="w5-player-name">{activePlayerObj?.alias || activePlayerObj?.name || 'Estudiante'}</span>
								<span class="w5-header-divider">/</span>
								<span class="w5-challenge-title">{playerCh.title}</span>
							</div>
							<div class="w5-header-right">
								{#if !isMe}
									<span class="w5-status-badge status-observando">
										<span class="badge-dot"></span> 👁️ OBSERVANDO
									</span>
								{:else}
									<span class="w5-status-badge status-active">
										<span class="badge-dot"></span> 🎯 TU RETO
									</span>
								{/if}
							</div>
						</div>
						
						<p class="font-bold text-md mb-2">{playerCh.concept}</p>
						<p class="text-sm bg-stone-50 p-3 rounded border border-stone-200/60 mb-4">{playerCh.scenario}</p>

						<!-- Reto Fase 1: Selección del Disparador -->
						{#if playerCh.type === 'selection' && playerCh.options}
							<div class="w5-options-grid">
								{#each playerCh.options as opt}
									<button 
										type="button" 
										class="w5-option-card text-left {playerChLocalAnswer === opt.id ? 'selected' : ''} {(isPlayerChSubmitted && playerChLocalAnswer === opt.id) ? 'active-selection' : ''}"
										onclick={() => handleSelectOption(activePlayerId, opt.id)}
										disabled={isPlayerChSubmitted || !isMe}
									>
										<span class="w5-option-letter">{opt.letter}</span>
										<span>{opt.text}</span>
									</button>
								{/each}
							</div>
						{/if}

						<!-- Reto Fase 2: Semáforo de Notificaciones -->
						{#if playerCh.type === 'sorting'}
							{@const sortData = getSortingData(activePlayerId, playerCh)}
							<div class="flex flex-col gap-4 mt-2">
								{#if isMe && !isPlayerChSubmitted}
									<div class="flex flex-wrap gap-2 p-2 bg-stone-100 rounded border min-h-[50px] items-center">
										{#each sortData.dragItems as item}
											<div 
												class="w5-draggable-alert bg-white" 
												draggable="true" 
												ondragstart={(e) => onDragStart(e, item.id, activePlayerId)}
											>
												{item.text}
											</div>
										{/each}
										{#if sortData.dragItems.length === 0}
											<span class="text-xs text-stone-400">Arrastra todos los elementos a continuación</span>
										{/if}
									</div>
								{/if}

								<div class="w5-semaforo-container">
									<!-- Zona Push (🔴) -->
									<div 
										class="w5-drop-zone zone-push" 
										ondragover={(e) => onDragOver(e, activePlayerId)} 
										ondrop={(e) => onDrop(e, 'push', activePlayerId)}
									>
										<span class="w-zone-label text-rose-700">🔴 Inmediata (Push)</span>
										{#each sortData.sortingBaskets.push as item}
											<div class="w5-draggable-alert bg-white text-xs">{item.text}</div>
										{/each}
									</div>

									<!-- Zona Digest (🟡) -->
									<div 
										class="w5-drop-zone zone-digest" 
										ondragover={(e) => onDragOver(e, activePlayerId)} 
										ondrop={(e) => onDrop(e, 'digest', activePlayerId)}
									>
										<span class="w-zone-label text-amber-700">🟡 Consolidada (Digest)</span>
										{#each sortData.sortingBaskets.digest as item}
											<div class="w5-draggable-alert bg-white text-xs">{item.text}</div>
										{/each}
									</div>

									<!-- Zona Silence (🟢) -->
									<div 
										class="w5-drop-zone zone-silence" 
										ondragover={(e) => onDragOver(e, activePlayerId)} 
										ondrop={(e) => onDrop(e, 'silence', activePlayerId)}
									>
										<span class="w-zone-label text-emerald-700">🟢 Silenciada</span>
										{#each sortData.sortingBaskets.silence as item}
											<div class="w5-draggable-alert bg-white text-xs">{item.text}</div>
										{/each}
									</div>
								</div>

								{#if isMe && !isPlayerChSubmitted}
									<button type="button" class="btn-solar-secondary self-end text-xs" onclick={() => handleResetSorting(activePlayerId)}>
										🔄 Reiniciar Clasificación
									</button>
								{/if}
							</div>
						{/if}

						<!-- Reto Fase 3: Dial de Intensidad (Slider) -->
						{#if playerCh.type === 'slider'}
							{@const currentLevel = playerChLocalAnswer !== null && playerChLocalAnswer !== undefined ? playerChLocalAnswer : playerCh.initialIntensity}
							<div class="flex flex-col gap-4 mt-2">
								<div class="w5-intensity-simulator" data-level={currentLevel}>
									<h4 class="text-sm font-bold uppercase mb-1">
										Simulador de Urgencia: Alerta Alumno
									</h4>
									<p class="text-xs text-stone-600 mb-2">
										Moderen el slider para encontrar la saliencia visual justa de la advertencia.
									</p>
									<div class="text-3xl font-extrabold my-2 text-emerald-950">
										Nivel {currentLevel}
									</div>
								</div>

								<div class="flex flex-col gap-1">
									<input 
										type="range" 
										min="1" 
										max="5" 
										class="w5-intensity-slider"
										value={currentLevel}
										oninput={(e) => handleSliderChange(e, activePlayerId)}
										disabled={isPlayerChSubmitted || !isMe}
									/>
									<div class="flex justify-between text-[10px] text-stone-500 font-bold px-1 mt-1">
										<span>{playerCh.minLabel}</span>
										<span>{playerCh.maxLabel}</span>
									</div>
								</div>
							</div>
						{/if}

						<!-- Submit Panel (only for active players) -->
						{#if isMe && !isPlayerChSubmitted}
							<div class="w5-submit-panel" transition:fade>
								<button type="button" class="btn-solar-primary text-sm px-6 py-2" onclick={() => handleSubmitAnswer(activePlayerId)}>
									📤 Enviar Respuesta
								</button>
							</div>
						{/if}

						<!-- Feedback de GIOCHI -->
						{#if isPlayerChSubmitted}
							<div class="w5-giochi-feedback" transition:slide>
								<div class="w5-giochi-header">
									<div class="w5-giochi-avatar">
										<img src="/learn_resources/characters/char_giochi.gif" alt="GIOCHI" class="w5-giochi-avatar-img" />
									</div>
									<span class="w5-giochi-name">GIOCHI — Auditor de Diseño</span>
									{#if isPlayerChSubmitted}
										<span class="w5-giochi-alignment-tag {isChAnswerAligned ? 'aligned' : 'misaligned'}">
											{isChAnswerAligned ? 'Alineado' : 'Desalineado'}
										</span>
									{:else}
										<span class="w5-giochi-alignment-tag aligned">
											Postura Oficial GIOCHI
										</span>
									{/if}
								</div>
								<p class="w5-giochi-body">{playerCh.giochiFeedback}</p>
							</div>
						{/if}

						{#if isMe && isPlayerChSubmitted}
							<div class="mt-3 p-3 bg-amber-50 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-2 border border-amber-200/50" transition:slide>
								<span>🎯</span>
								<span>¡Respuesta enviada! Por favor, cede tu turno a un compañero usando los botones <strong>Ceder ➜</strong> en la lista de conectados a la derecha.</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Sidebar Panel -->
	<div class="w5-sidebar">
		<!-- Barra de Alineación -->
		<div class="w5-alignment-bar-container">
			<div class="w5-alignment-bar-label">Alineación colectiva con GIOCHI</div>
			<div class="w5-alignment-bar-track">
				<div class="w5-alignment-needle" style="left: {alignmentScore}%"></div>
			</div>
			<div class="w5-alignment-extremes">
				<span>DESALINEADO (0%)</span>
				<span>CENTRO</span>
				<span>ALINEADO (100%)</span>
			</div>
		</div>

		<!-- Roster de Conectados -->
		<div class="w5-roster">
			<div class="w5-roster-title">
				Conectados ({session.onlinePlayers.filter(p => p.email !== 'javier@f2p.co').length})
			</div>
			{#each session.onlinePlayers.filter(p => p.email !== 'javier@f2p.co') as p}
				<div class="w5-roster-item">
					<div class="w5-roster-dot {activePlayers.includes(p.playerId) ? 'active' : (nextPlayerId === p.playerId ? 'next' : 'spectator')}"></div>
					<span class="truncate">{p.alias || p.name} {activationCounts[p.playerId] ? `(${activationCounts[p.playerId]}×)` : ''}</span>
					
					{#if activePlayers.includes(p.playerId)}
						<span class="w5-roster-badge active">⚡ Activo</span>
					{:else if nextPlayerId === p.playerId}
						<span class="w5-roster-badge next">⏳ Preparando</span>
					{:else}
						{@const isSpectator = !activePlayers.includes(p.playerId) && nextPlayerId !== p.playerId}
						{@const canCedeToThisPlayer = isSpectator && (
							(session.isHost && activePlayers.length > 0) ||
							(activePlayers.includes(session.player.id) && playerSubmitted[session.player.id])
						)}
						{#if canCedeToThisPlayer}
							<button 
								type="button" 
								class="w5-cede-btn text-[10px] py-0.5 px-2 ml-auto"
								onclick={() => {
									if (session.isHost) {
										handleCedeTurn(activePlayers[0], p.playerId);
									} else {
										// Set workshop_participated flag in game state
										const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
										if (!state[5]) state[5] = {};
										state[5].workshop_participated = true;
										session.updatePlayerGameState(state);

										if (session.channel) {
											session.channel.send({ 
												type: 'broadcast', 
												event: 'cede-turn', 
												payload: { cedingPlayerId: session.player.id, targetStudentId: p.playerId } 
											});
										}
									}
								}}
							>
								Ceder ➜
							</button>
						{:else}
							<span class="w5-roster-badge spectator">💤 Observando</span>
						{/if}
					{/if}
				</div>
			{/each}
		</div>

		<!-- Historial Reciente -->
		{#if Object.keys(playerSubmitted).filter(pId => playerSubmitted[pId]).length > 0}
			<div class="w5-roster mt-2" transition:slide>
				<div class="w5-roster-title">Historial Reciente</div>
				<div class="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
					{#each Object.keys(playerSubmitted).filter(pId => playerSubmitted[pId]).slice(-5).reverse() as pId}
						{@const pObj = session.onlinePlayers.find(p => p.playerId === pId)}
						{@const chSlide = world5WorkshopSlides.find(s => s.id === playerChallenges[pId])}
						{#if pObj && chSlide}
							<div class="w5-roster-item">
								<div class="w5-roster-dot active"></div>
								<span class="truncate text-xs flex-1">{pObj.alias || pObj.name}</span>
								<span class="w5-roster-badge {isPlayerAnswerAligned(pId, chSlide) ? 'active' : 'spectator'}">
									{isPlayerAnswerAligned(pId, chSlide) ? '✅' : '❌'}
								</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.w5-scenario-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.w5-header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.w5-player-avatar {
		font-size: 1.1rem;
		opacity: 0.85;
	}

	.w5-player-name {
		font-weight: 800;
		color: #1e293b;
		letter-spacing: -0.01em;
	}

	.w5-header-divider {
		color: #94a3b8;
		font-weight: 300;
	}

	.w5-challenge-title {
		font-weight: 600;
		color: #475569;
	}

	.w5-status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.65rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.w5-status-badge.status-observando {
		background: #f1f5f9;
		color: #475569;
		border: 1px solid #e2e8f0;
	}

	.w5-status-badge.status-observando .badge-dot {
		width: 6px;
		height: 6px;
		background-color: #94a3b8;
		border-radius: 50%;
	}

	.w5-status-badge.status-active {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fee2e2;
		animation: badge-pulse 1.5s infinite ease-in-out;
	}

	.w5-status-badge.status-active .badge-dot {
		width: 6px;
		height: 6px;
		background-color: #ef4444;
		border-radius: 50%;
	}

	@keyframes badge-pulse {
		0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
		50% { transform: scale(1.03); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
	}

	.w5-submit-panel {
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		display: flex;
		justify-content: flex-end;
	}

	.w5-active-player-banner {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		color: white;
		padding: 1rem 1.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -4px rgba(16, 185, 129, 0.2);
		animation: pulse-border 2s infinite ease-in-out;
		text-align: left;
	}

	.w5-active-player-banner .banner-icon {
		font-size: 1.5rem;
		animation: bounce-icon 1s infinite alternate ease-in-out;
		line-height: 1;
	}

	.w5-active-player-banner .banner-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	@keyframes bounce-icon {
		0% { transform: translateY(0) scale(1); }
		100% { transform: translateY(-4px) scale(1.15); }
	}

	@keyframes pulse-border {
		0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
		50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
	}

	.w5-workshop-layout {
		display: flex;
		gap: 1.5rem;
		width: 100%;
		min-height: calc(100vh - 180px);
		box-sizing: border-box;
	}

	.w5-main-panel {
		flex: 7;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.w5-challenges-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.5rem;
		width: 100%;
	}

	.w5-sidebar {
		flex: 3;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 320px;
		min-width: 260px;
	}

	.w5-scenario-card {
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		padding: 2rem;
		box-shadow: var(--shadow-solar-sm);
		text-align: left;
	}

	.w5-options-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	.w5-option-card {
		background: white;
		border: 2px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-sm);
		padding: 1.25rem;
		cursor: pointer;
		transition: all 250ms ease;
		font-size: 0.85rem;
		line-height: 1.5;
		display: flex;
		align-items: center;
		color: var(--color-solar-text);
	}

	.w5-option-card:hover:not(:disabled) {
		border-color: var(--color-solar-green-medium);
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md), 0 0 0 3px rgba(61, 143, 104, 0.1);
	}

	.w5-option-card.selected {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
	}

	.w5-option-letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		font-weight: 800;
		font-size: 0.75rem;
		margin-right: 0.75rem;
		flex-shrink: 0;
	}

	.w5-option-card.selected .w5-option-letter {
		background: var(--color-solar-green-medium);
		color: white;
	}

	.w5-spectator-overlay {
		pointer-events: none !important;
	}

	.w5-spectator-overlay .w5-option-card {
		pointer-events: none;
		opacity: 0.8;
	}

	.w5-spectator-overlay .w5-option-card.active-selection {
		opacity: 1;
		border-color: var(--color-solar-yellow);
		background: var(--color-solar-yellow-light);
	}

	/* Phase 2 Sorting */
	.w5-semaforo-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	.w5-drop-zone {
		border: 2px dashed var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		transition: all 250ms ease;
		min-height: 220px;
	}

	.w5-drop-zone.zone-push { border-color: hsl(0, 70%, 75%); background: hsla(0, 70%, 95%, 0.4); }
	.w5-drop-zone.zone-digest { border-color: hsl(43, 80%, 65%); background: hsla(43, 80%, 95%, 0.4); }
	.w5-drop-zone.zone-silence { border-color: hsl(142, 50%, 65%); background: hsla(142, 50%, 95%, 0.4); }

	.w-zone-label {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
	}

	.w5-draggable-alert {
		border: 1px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-sm);
		padding: 0.75rem;
		font-size: 0.8rem;
		cursor: grab;
		box-shadow: var(--shadow-solar-sm);
		transition: box-shadow 200ms ease;
		user-select: none;
		text-align: left;
		line-height: 1.4;
	}

	.w5-draggable-alert:active {
		cursor: grabbing;
		box-shadow: var(--shadow-solar-lg);
	}

	/* Phase 3 Slider */
	.w5-intensity-simulator {
		border-radius: var(--radius-solar-md);
		padding: 2rem;
		text-align: center;
		transition: all 400ms ease;
	}

	.w5-intensity-simulator[data-level="5"] {
		background: hsl(0, 85%, 95%);
		border: 2px solid hsl(0, 70%, 65%);
		animation: alarm-flash 0.8s ease-in-out infinite alternate;
	}

	.w5-intensity-simulator[data-level="4"] {
		background: hsl(25, 90%, 94%);
		border: 2px solid hsl(25, 70%, 60%);
		animation: alarm-flash 1.5s ease-in-out infinite alternate;
	}

	.w5-intensity-simulator[data-level="3"] {
		background: hsl(43, 80%, 95%);
		border: 2px solid hsl(43, 60%, 55%);
	}

	.w5-intensity-simulator[data-level="2"] {
		background: hsl(148, 40%, 95%);
		border: 2px solid hsl(148, 35%, 70%);
	}

	.w5-intensity-simulator[data-level="1"] {
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border);
	}

	@keyframes alarm-flash {
		from { opacity: 1; }
		to { opacity: 0.65; }
	}

	.w5-intensity-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: var(--radius-full);
		background: linear-gradient(
			to right,
			var(--color-solar-green-medium) 0%,
			var(--color-solar-yellow) 50%,
			var(--color-solar-terracotta) 100%
		);
		outline: none;
		cursor: pointer;
	}

	.w5-intensity-slider:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.w5-intensity-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: white;
		border: 3px solid var(--color-solar-green-dark);
		box-shadow: var(--shadow-solar-sm);
		cursor: inherit;
		transition: transform 150ms ease;
	}

	.w5-intensity-slider:not(:disabled)::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}

	/* UI / HUD */
	.w5-prep-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(30, 69, 51, 0.6);
		backdrop-filter: blur(6px);
		z-index: 150;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.w5-prep-modal {
		background: white;
		border: 2px solid var(--color-solar-yellow);
		border-radius: var(--radius-solar-lg);
		padding: 2.5rem 3rem;
		text-align: center;
		box-shadow: var(--shadow-solar-lg);
		max-width: 420px;
	}

	.countdown-number {
		font-size: 3.5rem;
		font-weight: 800;
		color: var(--color-solar-yellow);
		margin-top: 0.5rem;
		animation: countdown-heartbeat 0.6s ease-in-out infinite;
	}

	.w5-alignment-bar-container {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		padding: 1.25rem 1rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.w5-alignment-bar-label {
		font-size: 0.65rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-solar-text-muted);
		margin-bottom: 0.75rem;
		text-align: center;
		letter-spacing: 0.05em;
	}

	.w5-alignment-bar-track {
		width: 100%;
		height: 12px;
		border-radius: var(--radius-full);
		background: linear-gradient(
			to right,
			var(--color-solar-terracotta) 0%,
			var(--color-solar-yellow) 50%,
			hsl(148, 60%, 45%) 100%
		);
		position: relative;
	}

	.w5-alignment-needle {
		position: absolute;
		top: -4px;
		width: 6px;
		height: 20px;
		background: var(--color-solar-green-dark);
		border-radius: 3px;
		box-shadow: 0 0 8px rgba(30, 69, 51, 0.4);
		transition: left 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.w5-alignment-extremes {
		display: flex;
		justify-content: space-between;
		margin-top: 0.5rem;
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--color-solar-text-muted);
	}

	.w5-roster {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		padding: 1rem;
		box-shadow: var(--shadow-solar-sm);
		max-height: 240px;
		overflow-y: auto;
		text-align: left;
	}

	.w5-roster-title {
		font-size: 0.65rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-solar-text-muted);
		margin-bottom: 0.5rem;
		letter-spacing: 0.05em;
	}

	.w5-roster-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.5rem;
		border-radius: var(--radius-solar-xs);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.w5-roster-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.w5-roster-dot.active {
		background: var(--color-solar-green-medium);
		box-shadow: 0 0 6px rgba(61, 143, 104, 0.5);
		animation: dot-pulse 1.5s infinite;
	}

	.w5-roster-dot.next {
		background: var(--color-solar-yellow);
		box-shadow: 0 0 6px rgba(255, 209, 102, 0.5);
		animation: dot-pulse 1.2s infinite;
	}

	.w5-roster-dot.spectator {
		background: #ccc;
	}

	@keyframes dot-pulse {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.3); opacity: 0.6; }
	}

	.w5-roster-badge {
		font-size: 0.55rem;
		font-weight: 800;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		margin-left: auto;
	}

	.w5-roster-badge.active { background: var(--color-solar-green-light); color: var(--color-solar-green-dark); }
	.w5-roster-badge.next { background: var(--color-solar-yellow-light); color: hsl(35, 60%, 30%); }
	.w5-roster-badge.spectator { background: #eee; color: #666; }

	.w5-cede-turn-section {
		margin-top: 1rem;
		padding-top: 0.5rem;
		border-top: 1px dashed rgba(0,0,0,0.1);
	}
	.w5-cede-btn {
		background: #f5f5f5;
		border: 1px solid rgba(0,0,0,0.1);
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		color: #555;
		font-weight: 700;
		cursor: pointer;
		transition: all 150ms ease;
	}
	.w5-cede-btn:hover {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		border-color: rgba(0,0,0,0.15);
	}

	.w5-countdown-bar-container {
		width: 100%;
		padding: 1rem;
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		box-shadow: var(--shadow-solar-sm);
	}

	.w5-countdown-track {
		width: 100%;
		height: 8px;
		border-radius: var(--radius-full);
		background: var(--color-solar-green-light);
		overflow: hidden;
	}

	.w5-countdown-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-solar-green-medium), var(--color-solar-sky));
		transition: width 1s linear;
	}

	.w5-countdown-fill.warning {
		background: linear-gradient(90deg, var(--color-solar-yellow), var(--color-solar-terracotta));
	}

	.w5-countdown-text {
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin-top: 0.5rem;
	}

	.w5-countdown-text.critical {
		color: var(--color-solar-terracotta);
		animation: countdown-heartbeat 0.6s ease-in-out infinite;
	}

	@keyframes countdown-heartbeat {
		0%, 100% { transform: scale(1); }
		25% { transform: scale(1.1); }
		50% { transform: scale(1); }
		75% { transform: scale(1.05); }
	}

	.w5-screen-glint {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 100;
		border: 4px solid transparent;
		animation: glint-border 1.2s ease-in-out infinite;
	}

	@keyframes glint-border {
		0%, 100% { border-color: transparent; }
		50% { border-color: rgba(255, 209, 102, 0.4); }
	}

	.w5-toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 200;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		pointer-events: none;
		max-width: 320px;
	}

	.w5-toast {
		pointer-events: auto;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(8px);
		border: 1px solid var(--color-solar-card-border);
		border-left: 4px solid var(--color-solar-green-medium);
		border-radius: var(--radius-solar-sm);
		padding: 0.75rem 1rem;
		box-shadow: var(--shadow-solar-md);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-solar-text);
		text-align: left;
	}

	.w5-toast.phase-change { border-left-color: var(--color-solar-yellow); }
	.w5-toast.turn-change { border-left-color: var(--color-solar-sky); }

	.w5-giochi-feedback {
		background: linear-gradient(135deg, hsl(196, 70%, 96%), hsl(148, 50%, 96%));
		border: 1px solid hsl(196, 50%, 85%);
		border-radius: var(--radius-solar-md);
		padding: 1.25rem;
		text-align: left;
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.w5-giochi-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.w5-giochi-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--color-solar-sky-light);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1.5px solid var(--color-solar-sky);
	}

	.w5-giochi-avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.w5-giochi-name {
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-solar-sky);
		letter-spacing: 0.04em;
	}

	.w5-giochi-body {
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--color-solar-text);
	}

	.w5-phase-toggle {
		display: inline-flex;
		border-radius: 6px;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.w5-phase-toggle button {
		padding: 0.35rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 800;
		border: none;
		background: #f5f5f5;
		color: #666;
		cursor: pointer;
		transition: all 200ms ease;
	}

	.w5-phase-toggle button.active-phase {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
	}

	.w5-phase-toggle button:not(:last-child) {
		border-right: 1px solid rgba(0, 0, 0, 0.05);
	}

	@media (max-width: 768px) {
		.w5-workshop-layout {
			flex-direction: column;
		}
		.w5-sidebar {
			max-width: 100%;
		}
		.w5-options-grid {
			grid-template-columns: 1fr;
		}
		.w5-semaforo-container {
			grid-template-columns: 1fr;
		}
	}
</style>
