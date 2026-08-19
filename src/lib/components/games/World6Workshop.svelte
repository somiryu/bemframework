<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import { world6WorkshopSlides as staticWorld6WorkshopSlides, type WorkshopSlide6 } from '$lib/content/world6WorkshopData';
	import confetti from 'canvas-confetti';
	import MentorExplain from './MentorExplain.svelte';

	let {
		player: initialPlayer,
		instance,
		world = null,
		onComplete
	}: {
		player: any;
		instance: any;
		world?: any;
		onComplete: () => void;
	} = $props();

	// Content lives in course_worlds.workshop_modules; the static import is
	// only a fallback for an instance this DB hasn't been migrated on yet.
	const world6WorkshopSlides: WorkshopSlide6[] = world?.workshop_modules?.slides?.length ? world.workshop_modules.slides : staticWorld6WorkshopSlides;

	// Shared workshop session (World 6)
	const session = createWorkshopSession(initialPlayer, instance, 6, onComplete);

	// Taller State
	let currentPhase = $state<number>(1); // 1: Economía Conductual, 2: Diseño de Juegos, 3: Decisiones en Educación, 4: Cierre/Podio
	let currentSlideId = $state<number>(1);
	let activeMode = $state<'bet' | 'answer' | 'feedback' | 'final_feedback'>('bet');
	let visitedSlideIds = $state<number[]>([]);
	let isPaused = $state(false);
	let countdown = $state(0);
	let countdownInterval: any;

	// Class-wide answers loaded from course_players in real-time
	let classVotes = $state<Record<string, { bet: Record<string, number>; choice: string }>>({});
	
	// Student's local inputs
	let localBet = $state<Record<string, number>>({});
	let localChoice = $state<string | null>(null);
	let hasSubmittedBet = $state(false);
	let hasSubmittedChoice = $state(false);

	let dbWriteTimeout: any;

	// Current active slide object
	const currentSlide = $derived(
		world6WorkshopSlides.find(s => s.id === currentSlideId) || world6WorkshopSlides[0]
	);

	// Phase name helpers
	const phaseNames: Record<number, string> = {
		1: 'Fase 1: Economía Conductual (Micro-Experimentos)',
		2: 'Fase 2: Diseño de Juegos (Dilemas Tácticos)',
		3: 'Fase 3: Decisiones en Educación (Aula Real)',
		4: 'Fase 4: Podio y Cierre del Taller'
	};

	// Determine class percentages and deciles for the current slide
	const currentSlideStats = $derived.by(() => {
		if (!currentSlide) return { total: 0, counts: {}, percentages: {}, deciles: {} };

		const stats = {
			total: 0,
			counts: {} as Record<string, number>,
			percentages: {} as Record<string, number>,
			deciles: {} as Record<string, number[]> // optionId -> [decileCount0..9]
		};

		currentSlide.options.forEach(opt => {
			stats.counts[opt.id] = 0;
			stats.percentages[opt.id] = 0;
			stats.deciles[opt.id] = Array(10).fill(0);
		});

		Object.values(classVotes).forEach(vote => {
			if (vote.choice) {
				stats.counts[vote.choice] = (stats.counts[vote.choice] || 0) + 1;
				stats.total++;
			}
			if (vote.bet) {
				Object.entries(vote.bet).forEach(([optId, betVal]) => {
					if (stats.deciles[optId]) {
						const idx = Math.min(9, Math.floor(betVal / 10));
						stats.deciles[optId][idx]++;
					}
				});
			}
		});

		currentSlide.options.forEach(opt => {
			stats.percentages[opt.id] = stats.total > 0 ? Math.round((stats.counts[opt.id] / stats.total) * 100) : 0;
		});

		return stats;
	});

	// Calculate live leaderboard with deltas
	const leaderboard = $derived.by(() => {
		const scoredSlideIds = visitedSlideIds.filter(id => {
			if (id === currentSlideId) {
				return activeMode === 'feedback';
			}
			return true;
		});

		// Build class-wide answers cache for all completed slides
		const slideStatsCache: Record<number, Record<string, number>> = {};
		scoredSlideIds.forEach(slideId => {
			const slideData = world6WorkshopSlides.find(s => s.id === slideId);
			if (!slideData) return;

			let total = 0;
			const counts: Record<string, number> = {};
			slideData.options.forEach(o => counts[o.id] = 0);

			session.allClassPlayers.forEach(p => {
				const ans = p.game_state?.[6]?.workshop_answers?.[slideId];
				if (ans && ans.choice) {
					counts[ans.choice] = (counts[ans.choice] || 0) + 1;
					total++;
				}
			});

			slideStatsCache[slideId] = {};
			slideData.options.forEach(o => {
				slideStatsCache[slideId][o.id] = total > 0 ? Math.round((counts[o.id] / total) * 100) : 0;
			});
		});

		// Helper to calculate score for a specific list of slide IDs
		function calculatePlayerScoreForSlides(p: any, slideIds: number[]) {
			let score = 10; // 10 points base
			slideIds.forEach(slideId => {
				const slideData = world6WorkshopSlides.find(s => s.id === slideId);
				const ans = p.game_state?.[6]?.workshop_answers?.[slideId];
				const stats = slideStatsCache[slideId];
				if (!slideData || !ans || !stats) return;

				let slideScore = 0;
				// 1. Selection points (+5 if correct)
				if (slideData.correctOption && ans.choice === slideData.correctOption) {
					slideScore += 5;
				}
				// 2. Bet points
				if (ans.bet) {
					slideData.options.forEach(opt => {
						const actualPct = stats[opt.id] ?? 0;
						const betPct = ans.bet[opt.id] ?? 0;
						const D = actualPct - betPct;
						if (D < 0) {
							slideScore -= 1;
						} else if (D >= 0 && D <= 10) {
							slideScore += (12 - D);
						} else {
							slideScore += 1;
						}
					});
				}
				score += slideScore;
			});
			return score < 0 ? 0 : score;
		}

		// Calculate scores and slide deltas
		const playersData = session.allClassPlayers
			.filter(p => {
				const isSuper = p.game_state?.is_super_user === true;
				return !isSuper;
			})
			.map(p => {
				const previousSlideIds = scoredSlideIds.filter(id => id !== currentSlideId);
				const currentScore = calculatePlayerScoreForSlides(p, scoredSlideIds);
				const previousScore = calculatePlayerScoreForSlides(p, previousSlideIds);
				const currentSlideDelta = currentScore - previousScore;

				return {
					id: p.id,
					alias: p.alias || 'Anónimo',
					currentScore,
					previousScore,
					currentSlideDelta,
					isOnline: session.onlinePlayers.some(op => op.playerId === p.id)
				};
			});

		// Sort by previous score to get previous ranks
		const sortedByPrevious = [...playersData].sort((a, b) => b.previousScore - a.previousScore);
		const previousRanks: Record<string, number> = {};
		sortedByPrevious.forEach((p, idx) => {
			previousRanks[p.id] = idx + 1; // 1-indexed rank
		});

		// Sort by current score to get current ranks
		const sortedByCurrent = [...playersData].sort((a, b) => b.currentScore - a.currentScore);
		
		return sortedByCurrent.map((p, idx) => {
			const currentRank = idx + 1;
			const previousRank = previousRanks[p.id] ?? currentRank;
			const rankDelta = previousRank - currentRank; // positive means rank improved (moved up)

			return {
				id: p.id,
				alias: p.alias,
				score: p.currentScore,
				isOnline: p.isOnline,
				slideDelta: p.currentSlideDelta,
				rankDelta
			};
		});
	});

	// Determine the effective mode for rendering (especially for students)
	const effectiveMode = $derived.by(() => {
		if (session.isHost) {
			return activeMode;
		}
		// If host has revealed feedback, show feedback
		if (activeMode === 'feedback' || activeMode === 'final_feedback') {
			return activeMode;
		}
		// Host is in 'bet' mode (activity is active)
		if (!hasSubmittedBet) {
			return 'bet';
		}
		// If bet is submitted, let them answer
		return 'answer';
	});

	// Calculated score for the local student on the active slide
	const currentSlideScore = $derived.by(() => {
		if (activeMode !== 'feedback' || !currentSlide) return null;

		let choicePoints = 0;
		if (currentSlide.correctOption && localChoice === currentSlide.correctOption) {
			choicePoints = 5;
		}

		let betPoints = 0;
		const betBreakdown: Record<string, number> = {};

		currentSlide.options.forEach(opt => {
			const actualPct = currentSlideStats.percentages[opt.id] ?? 0;
			const betPct = localBet[opt.id] ?? 0;
			const D = actualPct - betPct;
			let points = 0;
			if (D < 0) {
				points = -1;
			} else if (D >= 0 && D <= 10) {
				points = 12 - D;
			} else {
				points = 1;
			}
			betPoints += points;
			betBreakdown[opt.id] = points;
		});

		return {
			choicePoints,
			betPoints,
			total: choicePoints + betPoints,
			betBreakdown
		};
	});

	// Count who has submitted in active mode
	const submittedBetCount = $derived(
		Object.values(classVotes).filter(v => v.bet && Object.keys(v.bet).length > 0).length
	);
	const submittedChoiceCount = $derived(
		Object.values(classVotes).filter(v => v.choice).length
	);

	// Synchronize class answers on slide/mode changes
	$effect(() => {
		if (currentSlideId && activeMode) {
			loadClassAnswers(currentSlideId);
		}
	});

	// Handle Podio Celebrations
	$effect(() => {
		if (currentPhase === 4 || activeMode === 'final_feedback') {
			try {
				confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
				setTimeout(() => {
					confetti({ particleCount: 100, spread: 100, origin: { y: 0.7 } });
				}, 450);
			} catch (e) {
				console.error(e);
			}
		}
	});

	onMount(() => {
		session.loadAllClassPlayers();

		// Subscribe to real-time events and channel broadcasts
		session.initConnection(async (event, payload) => {
			if (event === 'slide-sync') {
				syncFromDatabaseState(payload);
				await session.loadAllClassPlayers();
			} else if (event === 'student-answer') {
				classVotes = {
					...classVotes,
					[payload.studentId]: payload.answers
				};
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					await awardWorkshopCoins();
				}
				onComplete();
			} else if (event === 'countdown-sync') {
				countdown = payload.countdown;
				startLocalCountdown();
			} else if (event === 'workshop-reset') {
				if (!session.isHost) {
					await clearStudentLocalAndDbState();
				}
			}
		});

		// Fetch initial instance state
		session.fetchInitialWorkshopState().then((instState) => {
			if (instState && instState.world_id === 6) {
				syncFromDatabaseState(instState);
			} else if (session.isHost) {
				handleResetWorkshop();
			}
		});

		// Subscribe to database instance updates (fallback if broadcast is missed)
		session.subscribeToInstanceState((instState) => {
			syncFromDatabaseState(instState);
		});
	});

	onDestroy(() => {
		session.cleanup();
		clearInterval(countdownInterval);
		clearTimeout(dbWriteTimeout);
	});

	function getStudentLeaderboardScore(playerId: string) {
		const found = leaderboard.find(p => p.id === playerId);
		return found ? found.score : 10;
	}

	function checkAndClearStalePlayerState() {
		if (session.isHost) return;

		const state = session.player.game_state;
		if (!state || !state[6] || !state[6].workshop_answers) return;

		const firstSlide = world6WorkshopSlides.find(s => s.part === 1) || world6WorkshopSlides[0];
		const isAtStart = currentSlideId === firstSlide.id && currentPhase === 1 && activeMode === 'bet' && visitedSlideIds.length === 1;

		if (isAtStart) {
			clearStudentLocalAndDbState();
		}
	}

	async function clearStudentLocalAndDbState() {
		localBet = {};
		localChoice = null;
		hasSubmittedBet = false;
		hasSubmittedChoice = false;
		betValidationError = null;
		isSubmittingBet = false;
		isSubmittingChoice = false;

		if (currentSlide) {
			currentSlide.options.forEach(o => {
				localBet[o.id] = 0;
			});
		}

		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (state[6]) {
			delete state[6];
		}
		session.player.game_state = state;
		await session.updatePlayerGameState(state);
	}

	let hasAwardedCoins = $state(false);

	$effect(() => {
		if (!session.isHost && (currentPhase === 4 || activeMode === 'final_feedback')) {
			if (!hasAwardedCoins) {
				hasAwardedCoins = true;
				awardWorkshopCoins();
			}
		}
	});

	async function awardWorkshopCoins() {
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[6]) state[6] = {};
		
		// If they already completed it, don't double award!
		if (state[6].workshop_completed) return;
		
		state[6].workshop_completed = true;
		state[6].workshop_score = getStudentLeaderboardScore(session.player.id);

		// Determine leaderboard position and reward coins
		const rank = leaderboard.findIndex(p => p.id === session.player.id);
		let coinsReward = 15;
		if (rank === 0) coinsReward = 30; // 1st
		else if (rank === 1) coinsReward = 25; // 2nd
		else if (rank === 2) coinsReward = 20; // 3rd

		await session.updatePlayerGameState(state, {
			coins: session.player.coins + coinsReward
		});
	}

	function syncFromDatabaseState(state: any) {
		if (state.phase !== undefined) currentPhase = state.phase;
		if (state.currentSlideId !== undefined) currentSlideId = state.currentSlideId;
		if (state.mode !== undefined) activeMode = state.mode;
		if (state.visitedSlideIds !== undefined) visitedSlideIds = state.visitedSlideIds;
		if (state.isPaused !== undefined) isPaused = state.isPaused;

		checkAndClearStalePlayerState();

		// Load local student answers for this slide
		const savedAnswer = session.player.game_state?.[6]?.workshop_answers?.[state.currentSlideId];
		if (savedAnswer) {
			localBet = savedAnswer.bet ? { ...savedAnswer.bet } : {};
			localChoice = savedAnswer.choice || null;
			hasSubmittedBet = savedAnswer.bet && Object.keys(savedAnswer.bet).length > 0;
			hasSubmittedChoice = !!savedAnswer.choice;
		} else {
			localBet = {};
			localChoice = null;
			hasSubmittedBet = false;
			hasSubmittedChoice = false;
			if (currentSlide) {
				currentSlide.options.forEach(o => {
					localBet[o.id] = 0;
				});
			}
		}
	}

	async function loadClassAnswers(slideId: number) {
		if (!supabase) return;
		const { data: players } = await supabase
			.from('course_players')
			.select('id, email, game_state')
			.eq('instance_code', instance.code);

		if (players) {
			const votes: Record<string, any> = {};
			players.forEach(p => {
				const isSuper = p.game_state?.is_super_user === true;
				if (isSuper) return;

				const ans = p.game_state?.[6]?.workshop_answers?.[slideId];
				if (ans) {
					votes[p.id] = ans;
				}
			});
			classVotes = votes;
		}
	}

	function writeToDatabaseState(state: any) {
		if (!session.isHost) return;

		// Broadcast state-sync to clients
		session.safeSend('slide-sync', state);

		// Host should also reload players to recalculate the host-side leaderboard
		session.loadAllClassPlayers();

		clearTimeout(dbWriteTimeout);
		dbWriteTimeout = setTimeout(() => {
			session.syncWorkshopState(state);
		}, 1000);
	}

	// Local timer countdown
	function startLocalCountdown() {
		clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			if (countdown > 0) {
				countdown--;
			} else {
				clearInterval(countdownInterval);
			}
		}, 1000);
	}

	// Host Operations
	function handleResetWorkshop() {
		if (!session.isHost) return;
		if (!confirm('¿Estás seguro de que deseas reiniciar el taller? Esto borrará todo el progreso actual de la sesión.')) return;
		
		const firstSlide = world6WorkshopSlides.find(s => s.part === 1) || world6WorkshopSlides[0];
		const newState = {
			world_id: 6,
			phase: 1,
			currentSlideId: firstSlide.id,
			mode: 'bet' as const,
			visitedSlideIds: [firstSlide.id],
			isPaused: false
		};
		visitedSlideIds = [firstSlide.id];
		currentPhase = 1;
		currentSlideId = firstSlide.id;
		activeMode = 'bet';
		writeToDatabaseState(newState);

		session.safeSend('workshop-reset', {});
	}

	function handleTriggerCountdown(seconds: number) {
		if (!session.isHost) return;
		countdown = seconds;
		startLocalCountdown();

		session.safeSend('countdown-sync', { countdown: seconds });
	}

	function handleAdvanceToAnswer() {
		if (!session.isHost) return;
		activeMode = 'answer';
		const newState = {
			world_id: 6,
			phase: currentPhase,
			currentSlideId,
			mode: 'answer' as const,
			visitedSlideIds,
			isPaused
		};
		writeToDatabaseState(newState);
	}

	function handleRevealFeedback() {
		if (!session.isHost) return;
		activeMode = 'feedback';
		const newState = {
			world_id: 6,
			phase: currentPhase,
			currentSlideId,
			mode: 'feedback' as const,
			visitedSlideIds,
			isPaused
		};
		writeToDatabaseState(newState);
	}

	function handleNextSlide() {
		if (!session.isHost) return;

		// Reset countdown
		countdown = 0;
		clearInterval(countdownInterval);

		// Select random unvisited slide from the current phase pool
		const phaseSlides = world6WorkshopSlides.filter(s => s.part === currentPhase);
		const unvisited = phaseSlides.filter(s => !visitedSlideIds.includes(s.id));

		if (unvisited.length === 0) {
			// Phase is completed, auto-advance phase
			handleNextPhase();
			return;
		}

		const randomIndex = Math.floor(Math.random() * unvisited.length);
		const selectedSlide = unvisited[randomIndex];

		const updatedVisited = [...visitedSlideIds, selectedSlide.id];
		visitedSlideIds = updatedVisited;
		currentSlideId = selectedSlide.id;
		activeMode = 'bet';

		const newState = {
			world_id: 6,
			phase: currentPhase,
			currentSlideId: selectedSlide.id,
			mode: 'bet' as const,
			visitedSlideIds: updatedVisited,
			isPaused
		};
		writeToDatabaseState(newState);
	}

	function handleNextPhase() {
		if (!session.isHost) return;

		// Reset countdown
		countdown = 0;
		clearInterval(countdownInterval);

		if (currentPhase < 3) {
			const nextP = currentPhase + 1;
			currentPhase = nextP;

			// Pick first slide randomly in the new phase
			const phaseSlides = world6WorkshopSlides.filter(s => s.part === nextP);
			const randomIndex = Math.floor(Math.random() * phaseSlides.length);
			const selectedSlide = phaseSlides[randomIndex];

			const updatedVisited = [...visitedSlideIds, selectedSlide.id];
			visitedSlideIds = updatedVisited;
			currentSlideId = selectedSlide.id;
			activeMode = 'bet';

			const newState = {
				world_id: 6,
				phase: nextP,
				currentSlideId: selectedSlide.id,
				mode: 'bet' as const,
				visitedSlideIds: updatedVisited,
				isPaused
			};
			writeToDatabaseState(newState);
		} else {
			// Complete workshop, transition to podio
			currentPhase = 4;
			activeMode = 'final_feedback';
			const newState = {
				world_id: 6,
				phase: 4,
				currentSlideId,
				mode: 'final_feedback' as const,
				visitedSlideIds,
				isPaused
			};
			writeToDatabaseState(newState);
		}
	}

	function handleForceFinish() {
		if (!session.isHost) return;

		// Reset countdown
		countdown = 0;
		clearInterval(countdownInterval);

		currentPhase = 4;
		activeMode = 'final_feedback';
		const newState = {
			world_id: 6,
			phase: 4,
			currentSlideId,
			mode: 'final_feedback' as const,
			visitedSlideIds,
			isPaused
		};
		writeToDatabaseState(newState);
	}

	async function handleCompleteWorkshop() {
		session.safeSend('workshop-complete', {});

		if (session.isHost) {
			await session.syncWorkshopState({ world_id: 6, completed: true });
		}
		onComplete();
	}

	// Student Actions and submitting locks
	let isSubmittingBet = $state(false);
	let isSubmittingChoice = $state(false);
	let betValidationError = $state<string | null>(null);

	async function submitBet() {
		if (hasSubmittedBet || isSubmittingBet) return;

		// Validation: check that all options have numbers between 0 and 100
		const allValid = currentSlide.options.every(o => {
			const v = localBet[o.id];
			return typeof v === 'number' && v >= 0 && v <= 100;
		});

		if (!allValid) {
			betValidationError = 'Por favor ingresa un porcentaje válido entre 0% y 100% para cada opción.';
			return;
		}

		betValidationError = null;
		isSubmittingBet = true;

		try {
			hasSubmittedBet = true;

			// Save local answers to student player game_state
			const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
			if (!state[6]) state[6] = {};
			if (!state[6].workshop_answers) state[6].workshop_answers = {};
			state[6].workshop_answers[currentSlideId] = {
				bet: { ...localBet },
				choice: localChoice
			};
			session.player.game_state = state;

			session.safeSend('student-answer', {
				studentId: session.player.id,
				answers: state[6].workshop_answers[currentSlideId]
			});

			await session.updatePlayerGameState(state);
			await loadClassAnswers(currentSlideId);
		} catch (error) {
			console.error('Error submitting bet:', error);
			hasSubmittedBet = false;
		} finally {
			isSubmittingBet = false;
		}
	}

	async function submitChoice(choiceId: string) {
		if (!hasSubmittedBet || hasSubmittedChoice || isSubmittingChoice) return;

		isSubmittingChoice = true;

		try {
			localChoice = choiceId;
			hasSubmittedChoice = true;

			// Save local answers to student player game_state
			const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
			if (!state[6]) state[6] = {};
			if (!state[6].workshop_answers) state[6].workshop_answers = {};
			state[6].workshop_answers[currentSlideId] = {
				bet: { ...localBet },
				choice: choiceId
			};
			session.player.game_state = state;

			session.safeSend('student-answer', {
				studentId: session.player.id,
				answers: state[6].workshop_answers[currentSlideId]
			});

			await session.updatePlayerGameState(state);
			await loadClassAnswers(currentSlideId);
		} catch (error) {
			console.error('Error submitting choice:', error);
			hasSubmittedChoice = false;
			localChoice = null;
		} finally {
			isSubmittingChoice = false;
		}
	}
</script>

<!-- HOST/FACILITATOR BANNER -->
{#if session.isHost}
	<div class="facilitator-banner" transition:slide>
		<div class="fac-header">
			<span class="fac-host-tag">👑 FACILITADOR OMIE (ORQUESTADOR)</span>
			<div class="fac-presence-tag">
				🟢 Conectados: <strong>{session.onlinePlayers.length}</strong>
				| Bets: <strong class="fac-bets">{submittedBetCount}</strong>
				| Choices: <strong class="fac-choices">{submittedChoiceCount}</strong>
			</div>
		</div>

		<div class="fac-actions-row">
			<div class="fac-buttons-group">
				<button type="button" class="fac-btn fac-btn-danger" onclick={handleResetWorkshop}>
					🔄 Reiniciar
				</button>
				
				{#if activeMode === 'bet' || activeMode === 'answer'}
					<button type="button" class="fac-btn fac-btn-accent fac-btn-pulse" onclick={handleRevealFeedback} disabled={submittedChoiceCount === 0}>
						📢 Revelar Feedback
					</button>
				{:else if activeMode === 'feedback'}
					<button type="button" class="fac-btn fac-btn-primary" onclick={handleNextSlide}>
						Siguiente Slide ➔
					</button>
					<button type="button" class="fac-btn fac-btn-secondary" onclick={handleNextPhase}>
						Saltar Fase ↷
					</button>
				{/if}

				{#if currentPhase < 4}
					<button type="button" class="fac-btn fac-btn-finish" onclick={handleForceFinish}>
						🏁 Ir al Podio
					</button>
				{/if}
			</div>

			<div class="fac-timers">
				<span class="fac-timer-label">⏱ TIMER:</span>
				<button type="button" class="fac-btn fac-btn-timer" onclick={() => handleTriggerCountdown(10)}>10s</button>
				<button type="button" class="fac-btn fac-btn-timer" onclick={() => handleTriggerCountdown(30)}>30s</button>
				<button type="button" class="fac-btn fac-btn-timer" onclick={() => handleTriggerCountdown(45)}>45s</button>
				<button type="button" class="fac-btn fac-btn-timer" onclick={() => handleTriggerCountdown(60)}>60s</button>
			</div>
		</div>
	</div>
{/if}

<!-- WORKSHOP CONTAINER -->
<div class="workshop-layout-grid mt-4">
	<!-- COLUMNA IZQUIERDA: JUEGO / SLIDE INTERACTIVO -->
	<section class="game-column glass-panel">
		{#if currentPhase === 4 || activeMode === 'final_feedback'}
			<!-- PANTALLA DE CIERRE / PODIO -->
			<div class="podium-screen" in:fade>
				<div class="podium-header">
					<span class="section-badge">🏆 PODIO FINAL DE LA OMIE</span>
					<h2>¡Taller Completado con Éxito!</h2>
					<p class="desc-text">
						Has analizado las bifurcaciones y tomado decisiones heurísticas bajo incertidumbre en el laberinto.
					</p>
				</div>

				{#if leaderboard.length === 0}
					<div class="empty-podium-state">
						<span>🏅</span>
						<p>No hay participantes registrados en este taller.</p>
					</div>
				{:else}
					<div class="podium-visuals">
						<!-- 1ST PLACE (DOM first for a11y, visually centered via CSS order) -->
						{#if leaderboard[0]}
							<div class="podium-step step-1">
								<span class="step-medal">🥇</span>
								<span class="step-alias">{leaderboard[0].alias}</span>
								<span class="step-score">{leaderboard[0].score} pts</span>
								<div class="pillar"></div>
							</div>
						{/if}

						<!-- 2ND PLACE -->
						{#if leaderboard[1]}
							<div class="podium-step step-2">
								<span class="step-medal">🥈</span>
								<span class="step-alias">{leaderboard[1].alias}</span>
								<span class="step-score">{leaderboard[1].score} pts</span>
								<div class="pillar"></div>
							</div>
						{/if}

						<!-- 3RD PLACE -->
						{#if leaderboard[2]}
							<div class="podium-step step-3">
								<span class="step-medal">🥉</span>
								<span class="step-alias">{leaderboard[2].alias}</span>
								<span class="step-score">{leaderboard[2].score} pts</span>
								<div class="pillar"></div>
							</div>
						{/if}
					</div>

					<!-- Full leaderboard below podium -->
					{#if leaderboard.length > 3}
						<div class="podium-rest-list">
							{#each leaderboard.slice(3) as entry, i}
								<div class="podium-rest-row" class:self-row={entry.id === session.player.id}>
									<span class="rest-rank">#{i + 4}</span>
									<span class="rest-alias">{entry.alias}</span>
									<span class="rest-score">{entry.score} pts</span>
								</div>
							{/each}
						</div>
					{/if}
				{/if}

				<!-- COINS BANNER -->
				{#if session.isHost}
					<div class="coins-earned-banner host">
						<span class="coins-label">Rol: Facilitador</span>
						<div class="coins-amount">
							<span>🎓</span>
							<span>Guía del Taller</span>
						</div>
						<p class="coins-note">Presiona el botón para cerrar la sesión de todos los jugadores.</p>
					</div>
				{:else}
					{@const rank = leaderboard.findIndex(p => p.id === session.player.id)}
					{@const coinsReward = rank === 0 ? 30 : (rank === 1 ? 25 : (rank === 2 ? 20 : 15))}
					{@const rankLabel = rank === 0 ? '🥇 1er Lugar' : (rank === 1 ? '🥈 2do Lugar' : (rank === 2 ? '🥉 3er Lugar' : `#${rank + 1}`))}
					<div class="coins-earned-banner" class:top3={rank >= 0 && rank <= 2}>
						<span class="coins-label">Monedas ganadas · {rankLabel}</span>
						<div class="coins-amount">
							<span>🪙</span>
							<span>+{coinsReward} BEM Coins</span>
						</div>
						<p class="coins-note">Ya acreditadas a tu cuenta. ¡Buen trabajo!</p>
					</div>
				{/if}

				<div class="podium-actions">
					{#if session.isHost}
						<button type="button" class="btn-solar-primary podium-action-btn" onclick={handleCompleteWorkshop}>
							Finalizar Taller para Todos ➔
						</button>
					{:else}
						<button type="button" class="btn-solar-primary podium-action-btn" onclick={onComplete}>
							Regresar al Mapa Principal ➔
						</button>
					{/if}
				</div>
			</div>
		{:else if currentSlide}
			<!-- ESCENARIO ACTIVO -->
			<div class="slide-screen" in:fade>
				<header class="slide-header">
					<div class="slide-phase-meta">
						<span class="phase-badge">{phaseNames[currentPhase]}</span>
						<!-- Title shown ONLY in feedback mode! Hidden in bet and answer modes! -->
						{#if effectiveMode === 'feedback'}
							<h4 class="slide-title">{currentSlide.title}</h4>
						{/if}
					</div>

					{#if countdown > 0}
						<div class="countdown-badge shadow-sm animate-pulse" class:critical={countdown <= 10}>
							⏱️ {countdown}s
						</div>
					{/if}
				</header>

				<!-- CASE SCENARIO (Always visible) -->
				<div class="scenario-quote-card">
					<span class="scenario-label">🗂 CASO / ESCENARIO DE DILEMA</span>
					<p class="scenario-text">{currentSlide.scenario}</p>
				</div>

				{#if effectiveMode === 'bet'}
					<!-- 1. MODO BET -->
					<div class="interaction-block" in:fade>
						<div class="mode-header">
							<span class="mode-icon">🎲</span>
							<div class="mode-title-group">
								<span class="mode-title">MODO BET: Predice la respuesta colectiva</span>
								<p class="mode-desc">
									Ingresa qué porcentaje (0% a 100%) de tus compañeros de clase crees que elegirá cada opción. La suma no tiene que ser 100%.
								</p>
							</div>
						</div>

						<div class="betting-options">
							{#each currentSlide.options as opt, idx}
								<div class="bet-row" class:bet-submitted={hasSubmittedBet}>
									<label for="bet-input-{opt.id}" class="opt-label">
										<span class="opt-letter">{opt.letter}</span>
										<span class="opt-text">{opt.text}</span>
									</label>
									<div class="opt-input-group">
										<input 
											id="bet-input-{opt.id}"
											type="number" 
											min="0" 
											max="100" 
											class="bet-pct-input"
											bind:value={localBet[opt.id]}
											disabled={hasSubmittedBet || session.isHost}
											aria-label="Apuesta para opción {opt.letter} (%)"
										/>
										<span class="pct-symbol">%</span>
									</div>
								</div>
							{/each}
						</div>

						<div class="submit-action">
							{#if betValidationError}
								<span class="status-alert status-error" role="alert">⚠ {betValidationError}</span>
							{/if}

							{#if session.isHost}
								<span class="status-alert status-waiting-host">
									👑 El Facilitador está esperando respuestas de los estudiantes.
								</span>
							{:else if hasSubmittedBet}
								<span class="status-alert status-success">
									✓ Predicción enviada. Esperando a que el mentor habilite la votación.
								</span>
							{:else}
								<button type="button" class="btn-solar-accent font-bold" onclick={submitBet}>
									📤 Enviar Predicciones
								</button>
							{/if}
						</div>
					</div>

				{:else if effectiveMode === 'answer'}
					<!-- 2. MODO ANSWER -->
					<div class="interaction-block" in:fade>
						<div class="mode-header">
							<span class="mode-icon">✏️</span>
							<div class="mode-title-group">
								<span class="mode-title">MODO ANSWER: ¿Tú qué elegirías?</span>
								<p class="mode-desc">Escoge la alternativa que seleccionarías tú personalmente ante el dilema planteado.</p>
							</div>
						</div>

						<div class="answering-options">
							{#each currentSlide.options as opt}
								<button 
									type="button" 
									class="answer-btn"
									class:selected={localChoice === opt.id}
									class:disabled={hasSubmittedChoice || !hasSubmittedBet || session.isHost}
									disabled={hasSubmittedChoice || !hasSubmittedBet || session.isHost}
									onclick={() => submitChoice(opt.id)}
								>
									<span class="opt-letter">{opt.letter}</span>
									<p class="opt-text">{opt.text}</p>
								</button>
							{/each}
						</div>

						<div class="submit-action">
							{#if session.isHost}
								<span class="status-alert status-waiting-host">
									👑 El Facilitador está esperando elecciones de los estudiantes.
								</span>
							{:else if !hasSubmittedBet}
								<span class="status-alert status-error">
									⚠ Primero debes enviar tus predicciones en el Modo Bet.
								</span>
							{:else if hasSubmittedChoice}
								<span class="status-alert status-success">
									✓ Tu elección ha sido enviada. Esperando a la fase de retroalimentación.
								</span>
							{/if}
						</div>
					</div>

				{:else if effectiveMode === 'feedback'}
					<!-- 3. MODO FEEDBACK -->
					<div class="interaction-block" in:fade>
						<MentorExplain 
							mentorName="Sara" 
							mentorAvatar="/learn_resources/characters/char_sara.png" 
							instructions={currentSlide.giochiFeedback} 
							titlePrefix="Retroalimentación"
						/>

						<span class="block-action-title text-sm font-extrabold text-solar-green-dark mb-4 block">📊 Distribución de Respuestas de la Clase</span>
 
						<div class="results-breakdown flex flex-col gap-5">
							{#each currentSlide.options as opt}
								{@const actualPct = currentSlideStats.percentages[opt.id] ?? 0}
								{@const optBet = localBet[opt.id] ?? 0}
								{@const isCorrectOpt = currentSlide.correctOption === opt.id}
								{@const wasChosen = localChoice === opt.id}
 
								<div class="result-option-card"
									class:correct-border={isCorrectOpt}
									class:chosen-border={wasChosen && !isCorrectOpt}
								>
									<div class="card-top flex items-center justify-between gap-4">
										<div class="opt-label">
											<span class="opt-letter">{opt.letter}</span>
											<p class="opt-text">{opt.text}</p>
										</div>
										<div class="stats-badges flex items-center gap-1.5 flex-shrink-0">
											{#if isCorrectOpt}
												<span class="tag-correct text-[9px] font-extrabold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">Correcta</span>
											{/if}
											{#if wasChosen}
												<span class="tag-chosen text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">Tu Voto</span>
											{/if}
										</div>
									</div>

									<!-- Class Answers Percentage Graphical Bar -->
									<div class="class-pct-graphical-container">
										<div class="bar-header">
											<span>Respuestas de la clase:</span>
											<span class="class-pct-value">{actualPct}%</span>
										</div>
										<div class="class-pct-bar-bg">
											<div class="class-pct-bar-fill" 
												style="width: {actualPct}%"
												class:correct-bar={isCorrectOpt}
												class:chosen-bar={wasChosen && !isCorrectOpt}
											></div>
										</div>
									</div>

									{#if !session.isHost}
										<!-- Score feedback for this option -->
										{@const optPoints = currentSlideScore?.betBreakdown[opt.id] ?? 0}
										<div class="personal-bet-banner">
											<span class="personal-bet-label">Tu Predicción:</span>
											<div class="personal-bet-badges">
												<span class="bet-value-pill">
													Apuesta: {optBet}%
													{#if optBet > actualPct}
														<span class="arrow-indicator red-arrow">▲</span>
													{:else if actualPct - optBet <= 10}
														<span class="arrow-indicator green-arrow">▼</span>
													{:else}
														<span class="arrow-indicator yellow-arrow">▼</span>
													{/if}
												</span>
												<span class="bet-points-pill" 
													class:positive={optPoints > 0} 
													class:negative={optPoints < 0}
													class:neutral={optPoints === 0}
												>
													{optPoints >= 0 ? '+' : ''}{optPoints} pts
												</span>
											</div>
										</div>
									{/if}

									<!-- Decile Histogram for Bets -->
									<div class="deciles-histogram-container">
										<span class="hist-label">Distribución de Apuestas de la Clase:</span>
										<div class="hist-bars">
											{#each currentSlideStats.deciles[opt.id] as decVal, decIdx}
												{@const heightPct = Math.min(100, Math.max(10, (decVal / (currentSlideStats.total || 1)) * 100))}
												<div 
													class="hist-bar w-full rounded-t-sm"
													class:highlight-bar={optBet >= decIdx*10 && (optBet < (decIdx+1)*10 || (decIdx === 9 && optBet === 100))}
													style="height: {heightPct}%"
													title="{decIdx*10}-{(decIdx+1)*10}%: {decVal} votos"
												></div>
											{/each}
										</div>
										<div class="hist-labels-row">
											{#each Array(10) as _, i}
												<span>{i * 10}%</span>
											{/each}
										</div>
									</div>
								</div>
							{/each}
						</div>

						{#if !session.isHost && currentSlideScore}
							<!-- Slide Summary Banner -->
							<div class="slide-score-summary-banner">
								<div class="summary-banner-left">
									<span class="summary-banner-title">Resumen de Slide</span>
									<span class="summary-banner-desc">
										Selección ({currentSlide.correctOption ? 'Correcta = +5' : 'Puro Experimento = +0'}): <strong>+{currentSlideScore.choicePoints} pts</strong>
										| Apuestas: <strong>{currentSlideScore.betPoints >= 0 ? '+' : ''}{currentSlideScore.betPoints} pts</strong>
									</span>
								</div>
								<div class="summary-banner-points">
									{currentSlideScore.total >= 0 ? '+' : ''}{currentSlideScore.total} PTS
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="empty-slide-state flex flex-col items-center justify-center h-full gap-4 text-solar-text-muted py-12" in:fade>
				<span class="text-4xl animate-pulse">⏳</span>
				<p class="text-sm font-semibold">Esperando al facilitador...</p>
			</div>
		{/if}
	</section>

	<!-- COLUMNA DERECHA: TABLA DE LÍDERES INTEGRADA -->
	<aside class="state-column">
		<!-- LEADERBOARD -->
		<div class="leaderboard-card glass-panel flex-1 flex flex-col">
			<div class="leaderboard-header">
				<span class="leaderboard-icon">🏆</span>
				<div class="leaderboard-title-group">
					<h4 class="leaderboard-title">Tabla de Líderes</h4>
					<p class="leaderboard-subtitle">Puntajes y participación en tiempo real</p>
				</div>
			</div>
			
			<div class="leaderboard-list">
				{#each leaderboard as row, idx}
					{@const isSelf = row.id === session.player.id}
					{@const vote = classVotes[row.id]}
					{@const hasBet = vote && vote.bet && Object.keys(vote.bet).length > 0}
					{@const hasChoice = vote && vote.choice}
					
					<div class="leaderboard-row"
						class:self-row={isSelf}
						class:podium-row={idx < 3}
						class:offline-row={!row.isOnline}
					>
						<div class="row-left">
							<!-- Rank Badge / Medal -->
							<div class="rank-badge-container">
								{#if idx === 0}
									<span class="rank-medal gold">🥇</span>
								{:else if idx === 1}
									<span class="rank-medal silver">🥈</span>
								{:else if idx === 2}
									<span class="rank-medal bronze">🥉</span>
								{:else}
									<span class="rank-number">{idx + 1}</span>
								{/if}
							</div>

							<!-- Online/Offline Status Indicator -->
							<div class="status-dot-container" title={row.isOnline ? 'En línea' : 'Desconectado'}>
								<span class="status-dot" class:online={row.isOnline}></span>
							</div>

							<!-- Player Name and Deltas -->
							<span class="player-alias" class:self-name={isSelf}>
								<span class="alias-text">{row.alias}</span>
								{#if isSelf}
									<span class="self-tag">(Tú)</span>
								{/if}
								
								<!-- Deltas (ONLY in feedback mode) -->
								{#if activeMode === 'feedback'}
									<span class="delta-badge-group">
										<span class="delta-score-pill">({row.slideDelta >= 0 ? '+' : ''}{row.slideDelta}pts)</span>
										{#if row.rankDelta > 0}
											<span class="delta-rank-pill rank-up">▲ +{row.rankDelta}</span>
										{:else if row.rankDelta < 0}
											<span class="delta-rank-pill rank-down">▼ {Math.abs(row.rankDelta)}</span>
										{/if}
									</span>
								{/if}
							</span>
						</div>

						<div class="row-right">
							<!-- Submission state icons -->
							<div class="submission-indicators">
								<span 
									class="indicator-badge bet-indicator" 
									class:active={hasBet}
									title={hasBet ? 'Predicción enviada' : 'Pendiente de predicción'}
								>
									🪙
								</span>
								<span 
									class="indicator-badge choice-indicator" 
									class:active={hasChoice}
									title={hasChoice ? 'Elección enviada' : 'Pendiente de elección'}
								>
									✅
								</span>
							</div>

							<!-- Score -->
							<div class="player-score">
								<span class="score-value">{row.score}</span>
								<span class="score-unit">pts</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</aside>
</div>

<style>
	/* ============================================
	   GAME PANEL — Slide Screen Layout
	   ============================================ */
	.workshop-layout-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 1.5rem;
		width: 100%;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
		margin-top: 1.25rem;
	}

	@media (max-width: 900px) {
		.workshop-layout-grid {
			grid-template-columns: 1fr;
		}
	}

	.glass-panel {
		background: white;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		border-radius: var(--radius-solar-md, 24px);
		padding: 1.75rem;
		box-shadow: var(--shadow-solar-sm, 0 4px 12px rgba(30,69,51,0.03));
		box-sizing: border-box;
	}

	/* Columns */
	.game-column {
		min-height: 480px;
		box-sizing: border-box;
	}

	.state-column {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* ============================================
	   FACILITATOR BANNER — World 6 Premium Panel
	   ============================================ */
	.facilitator-banner {
		background: linear-gradient(135deg, hsl(150, 45%, 6%) 0%, hsl(152, 40%, 10%) 100%);
		border: 1.5px solid var(--color-solar-yellow, #eab308);
		color: white;
		border-radius: 20px;
		box-shadow: 0 4px 20px rgba(0,0,0,0.3);
		width: 100%;
		box-sizing: border-box;
		padding: 0.65rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.fac-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.fac-host-tag {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 900;
		color: var(--color-solar-yellow, #eab308);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.fac-presence-tag {
		font-size: 0.72rem;
		font-weight: 700;
		background: rgba(0, 0, 0, 0.4);
		padding: 0.2rem 0.65rem;
		border-radius: 6px;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.12);
		white-space: nowrap;
	}

	.fac-presence-tag .fac-bets {
		color: #7dd3fc;
	}

	.fac-presence-tag .fac-choices {
		color: #6ee7b7;
	}

	.fac-actions-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.fac-buttons-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.fac-timers {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.fac-timer-label {
		font-size: 0.65rem;
		font-weight: 800;
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* Facilitator button base */
	.fac-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 0.72rem;
		padding: 0.3rem 0.7rem;
		border-radius: 7px;
		border: 1px solid rgba(255,255,255,0.15);
		cursor: pointer;
		transition: all 0.2s ease;
		line-height: 1.4;
		white-space: nowrap;
	}

	.fac-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		transform: none !important;
	}

	.fac-btn:not(:disabled):hover {
		transform: translateY(-1.5px);
		filter: brightness(1.1);
	}

	.fac-btn-primary {
		background: linear-gradient(135deg, var(--color-solar-green-medium, #3d8f68), var(--color-solar-green-dark, #1e4533));
		color: white;
		border-color: rgba(255,255,255,0.2);
	}

	.fac-btn-secondary {
		background: rgba(255,255,255,0.12);
		color: #e2e8f0;
		border-color: rgba(255,255,255,0.18);
	}

	.fac-btn-accent {
		background: var(--color-solar-yellow, #eab308);
		color: hsl(150, 45%, 8%);
		border-color: transparent;
		font-weight: 900;
	}

	.fac-btn-danger {
		background: linear-gradient(135deg, #ef4444, #b91c1c);
		color: white;
		border-color: rgba(255,255,255,0.15);
	}

	.fac-btn-finish {
		background: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
		border-color: rgba(239, 68, 68, 0.3);
	}

	.fac-btn-finish:not(:disabled):hover {
		background: rgba(239, 68, 68, 0.25);
		color: #fecaca;
	}

	.fac-btn-timer {
		background: rgba(255,255,255,0.08);
		color: #cbd5e1;
		border-color: rgba(255,255,255,0.12);
		padding: 0.2rem 0.5rem;
		font-size: 0.65rem;
	}

	@keyframes fac-pulse {
		0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.5); }
		50% { box-shadow: 0 0 0 6px rgba(234, 179, 8, 0); }
	}

	.fac-btn-pulse {
		animation: fac-pulse 1.8s ease-in-out infinite;
	}

	/* Countdown timer */
	.countdown-badge {
		font-family: var(--font-solar-header);
		font-weight: 900;
		font-size: 0.8rem;
		background: #eff6ff;
		color: #1d4ed8;
		border: 1.5px solid #bfdbfe;
		padding: 0.3rem 0.65rem;
		border-radius: 8px;
	}
	.countdown-badge.critical {
		background: #fef2f2;
		color: #b91c1c;
		border-color: #fca5a5;
	}

	/* Custom histogram bar chart */
	.hist-bar {
		background: #cbd5e1;
		transition: height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2);
	}
	.hist-bar.highlight-bar {
		background: var(--color-solar-green-medium, #3d8f68) !important;
	}

	.answer-btn {
		width: 100%;
		background: white;
		border: 1.5px solid #f1f5f9;
		border-radius: 12px;
		padding: 0.85rem 1.25rem;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		text-align: left;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(30, 69, 51, 0.03);
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
		box-sizing: border-box;
		appearance: none;
		-webkit-appearance: none;
	}
	.answer-btn:hover:not(:disabled) {
		border-color: var(--color-solar-green-medium, #3d8f68);
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(30, 69, 51, 0.07);
	}
	.answer-btn.selected {
		border-color: var(--color-solar-green-medium, #3d8f68) !important;
		background: color-mix(in srgb, var(--color-solar-green-light, #d2f5e3) 45%, #ffffff) !important;
		outline: 2px solid var(--color-solar-green-medium, #3d8f68) !important;
	}
	.answer-btn.disabled {
		cursor: not-allowed;
		opacity: 0.85;
	}

	/* Result cards styling */
	.result-option-card {
		background: white;
		border: 1.5px solid #f1f5f9;
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		box-shadow: 0 2px 6px rgba(30, 69, 51, 0.03);
		transition: all 0.25s ease;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	.opt-label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		min-width: 0;
		flex: 1;
	}

	.opt-letter {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.75rem;
		font-weight: 900;
		background: var(--color-solar-green-dark, #1e4533);
		color: white;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.opt-text {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.4;
		margin: 0;
		text-align: left;
	}

	.stats-badges {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.tag-correct {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
		color: #065f46;
		border: 1px solid rgba(16, 185, 129, 0.25);
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: 0 2px 4px rgba(16, 185, 129, 0.08);
		display: inline-flex;
		align-items: center;
	}

	.tag-chosen {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
		color: #1e40af;
		border: 1px solid rgba(59, 130, 246, 0.25);
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.08);
		display: inline-flex;
		align-items: center;
	}

	.result-option-card.correct-border {
		border-color: #10b981 !important;
		background: linear-gradient(135deg, #f0fdf4 0%, white 100%) !important;
		box-shadow: 0 4px 15px rgba(16, 185, 129, 0.06);
	}

	.result-option-card.chosen-border {
		border-color: #3b82f6 !important;
		background: linear-gradient(135deg, #eff6ff 0%, white 100%) !important;
		box-shadow: 0 4px 15px rgba(59, 130, 246, 0.06);
	}

	/* Graphical Class Progress Bar */
	.class-pct-graphical-container {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		width: 100%;
		box-sizing: border-box;
	}

	.bar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #64748b);
	}

	.class-pct-value {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.78rem;
		font-weight: 900;
		color: #1e40af;
	}

	.class-pct-bar-bg {
		background: #f1f5f9;
		height: 10px;
		width: 100%;
		border-radius: 999px;
		overflow: hidden;
		position: relative;
	}

	.class-pct-bar-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, #ffe066, #f7a35c);
		transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.1);
	}

	.class-pct-bar-fill.correct-bar {
		background: linear-gradient(90deg, #34d399, #059669);
	}

	.class-pct-bar-fill.chosen-bar {
		background: linear-gradient(90deg, #60a5fa, #2563eb);
	}

	/* Decile histogram styling */
	.deciles-histogram-container {
		background: #f8fafc;
		border: 1px dashed #e2e8f0;
		padding: 0.75rem 1rem;
		border-radius: 10px;
	}

	.hist-label {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.5rem;
	}

	.hist-bars {
		display: flex;
		align-items: end;
		gap: 4px;
		height: 2.25rem;
		justify-content: space-between;
	}

	.hist-bar {
		flex: 1;
		background: #cbd5e1;
		border-radius: 3px 3px 0 0;
		min-width: 4px;
		transition: height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15);
	}

	.hist-bar.highlight-bar {
		background: var(--color-solar-green-medium, #3d8f68) !important;
		box-shadow: 0 -2px 6px rgba(61, 143, 104, 0.2);
	}

	.results-breakdown {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hist-labels-row {
		display: flex;
		justify-content: space-between;
		gap: 4px;
		width: 100%;
		box-sizing: border-box;
		margin-top: 0.45rem;
	}

	.hist-labels-row span {
		flex: 1;
		text-align: center;
		font-size: 0.55rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #64748b);
		opacity: 0.65;
	}

	.personal-bet-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #f8fafc;
		border: 1px solid #f1f5f9;
		border-radius: 10px;
		padding: 0.55rem 0.85rem;
		box-sizing: border-box;
		width: 100%;
	}

	.personal-bet-label {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.68rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-solar-text-muted, #64748b);
	}

	.personal-bet-badges {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.bet-value-pill {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		background: #eff6ff;
		color: #1e40af;
		padding: 0.2rem 0.5rem;
		border-radius: 5px;
		border: 1px solid rgba(59, 130, 246, 0.15);
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.arrow-indicator {
		font-size: 0.65rem;
		font-weight: 900;
		line-height: 1;
	}

	.arrow-indicator.red-arrow {
		color: #ef4444;
	}

	.arrow-indicator.green-arrow {
		color: #22c55e;
	}

	.arrow-indicator.yellow-arrow {
		color: #eab308;
	}

	.bet-points-pill {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.2rem 0.5rem;
		border-radius: 5px;
		text-transform: uppercase;
	}

	.bet-points-pill.positive {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid rgba(16, 185, 129, 0.15);
	}

	.bet-points-pill.negative {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid rgba(239, 68, 68, 0.15);
	}

	.bet-points-pill.neutral {
		background: #f1f5f9;
		color: #475569;
		border: 1px solid rgba(100, 116, 139, 0.15);
	}

	/* ============================================
	   STUDENT SUMMARY BANNER — Premium Styles
	   ============================================ */
	.slide-score-summary-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
		border: 1.5px solid #bae6fd;
		border-radius: 14px;
		padding: 1rem 1.25rem;
		margin-top: 1.5rem;
		box-shadow: 0 4px 12px rgba(186, 230, 253, 0.15);
		text-align: left;
		box-sizing: border-box;
		width: 100%;
	}

	.summary-banner-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.summary-banner-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #0369a1;
	}

	.summary-banner-desc {
		font-size: 0.8rem;
		font-weight: 600;
		color: #0c4a6e;
		line-height: 1.4;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.summary-banner-desc strong {
		color: #0284c7;
		font-weight: 800;
	}

	.summary-banner-points {
		font-family: var(--font-solar-header, sans-serif);
		background: #0284c7;
		color: white;
		font-weight: 900;
		font-size: 0.85rem;
		padding: 0.35rem 0.8rem;
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* ============================================
	   INTEGRATED LEADERBOARD — Premium Styles
	   ============================================ */
	.leaderboard-card {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		height: 100%;
		box-sizing: border-box;
	}

	.leaderboard-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		border-bottom: 2px solid var(--color-solar-green-light, #d2f5e3);
		padding-bottom: 0.75rem;
	}

	.leaderboard-icon {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.leaderboard-title-group {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-align: left;
	}

	.leaderboard-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.85rem;
		font-weight: 900;
		color: var(--color-solar-green-dark, #1e4533);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin: 0;
	}

	.leaderboard-subtitle {
		font-size: 0.72rem;
		color: var(--color-solar-text-muted, #64748b);
		margin: 0;
		line-height: 1.4;
	}

	.leaderboard-list {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		overflow-y: auto;
		flex: 1;
		padding-right: 0.25rem;
	}

	.leaderboard-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: white;
		border: 1.5px solid #f1f5f9;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(30, 69, 51, 0.02);
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1);
	}

	.leaderboard-row:hover {
		transform: translateY(-1.5px);
		box-shadow: 0 4px 12px rgba(30, 69, 51, 0.06);
		border-color: rgba(61, 143, 104, 0.15);
	}

	/* Self Player Highlight */
	.leaderboard-row.self-row {
		background: linear-gradient(135deg,
			color-mix(in srgb, var(--color-solar-green-light, #d2f5e3) 25%, white) 0%,
			white 100%);
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 4px 15px rgba(61, 143, 104, 0.08);
	}

	/* Podium Row Colors */
	.leaderboard-row.podium-row {
		background: #fbfdfc;
	}

	/* Offline Row Styling */
	.leaderboard-row.offline-row {
		opacity: 0.65;
	}

	/* Row left (Rank, Status dot, Name) */
	.row-left {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}

	.rank-badge-container {
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.rank-medal {
		font-size: 1.25rem;
		line-height: 1;
	}

	.rank-number {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-text-muted, #64748b);
		background: #f1f5f9;
		width: 1.35rem;
		height: 1.35rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.status-dot-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		background: #cbd5e1;
		border-radius: 50%;
		transition: all 0.3s ease;
	}

	.status-dot.online {
		background: #10b981;
		box-shadow: 0 0 6px #10b981;
		animation: pulse-green 2s infinite;
	}

	@keyframes pulse-green {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
		}
	}

	.player-alias {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		display: flex;
		align-items: center;
		gap: 0.4rem;
		min-width: 0;
	}

	.alias-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100px;
	}

	.player-alias.self-name {
		font-weight: 800;
	}

	.self-tag {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-green-medium, #3d8f68);
		opacity: 0.8;
	}

	.delta-badge-group {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.delta-score-pill {
		font-size: 0.65rem;
		font-weight: 700;
		color: #0284c7;
	}

	.delta-rank-pill {
		font-size: 0.6rem;
		font-weight: 800;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		line-height: 1;
		font-family: var(--font-solar-header, sans-serif);
	}

	.delta-rank-pill.rank-up {
		background: #d1fae5;
		color: #065f46;
	}

	.delta-rank-pill.rank-down {
		background: #fef2f2;
		color: #991b1b;
	}

	/* Row right (Indicators, Score) */
	.row-right {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	.submission-indicators {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.indicator-badge {
		font-size: 0.85rem;
		opacity: 0.25;
		filter: grayscale(1);
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.indicator-badge.active {
		opacity: 1;
		filter: none;
		transform: scale(1.15);
	}

	.player-score {
		display: flex;
		align-items: baseline;
		gap: 0.1rem;
		min-width: 3rem;
		justify-content: flex-end;
	}

	.score-value {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.85rem;
		font-weight: 900;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.score-unit {
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #64748b);
		text-transform: uppercase;
	}

	/* ============================================
	   PODIO — Panel de Cierre Premium
	   ============================================ */
	.podium-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem 1.5rem;
		text-align: center;
		width: 100%;
		box-sizing: border-box;
	}

	.podium-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		max-width: 480px;
	}

	.podium-header h2 {
		font-size: 1.4rem;
		font-weight: 900;
		margin: 0;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.podium-header .desc-text {
		font-size: 0.82rem;
		color: var(--color-solar-text-muted, #64748b);
		margin: 0;
		line-height: 1.5;
	}

	.empty-podium-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 2rem;
		color: var(--color-solar-text-muted, #64748b);
		font-size: 0.85rem;
		font-weight: 600;
	}

	.step-medal {
		font-size: 1.8rem;
		line-height: 1;
		margin-bottom: 0.15rem;
	}

	.step-alias {
		font-size: 0.78rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		max-width: 90px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.step-1 .step-alias {
		font-size: 0.9rem;
		color: #92400e;
	}

	.step-score {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.72rem;
		font-weight: 900;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.step-1 .step-score {
		font-size: 0.82rem;
	}

	/* Jugadores debajo del Top 3 */
	.podium-rest-list {
		width: 100%;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.podium-rest-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		background: #f8fafc;
		border: 1px solid #f1f5f9;
	}

	.podium-rest-row.self-row {
		background: #eff6ff;
		border-color: rgba(59, 130, 246, 0.2);
	}

	.rest-rank {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 900;
		color: var(--color-solar-text-muted, #64748b);
		min-width: 28px;
	}

	.rest-alias {
		flex: 1;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		text-align: left;
	}

	.rest-score {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.72rem;
		font-weight: 900;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	/* Coins Banner */
	.coins-earned-banner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border: 1.5px solid rgba(34, 197, 94, 0.25);
		border-radius: 16px;
		padding: 1rem 1.5rem;
		width: 100%;
		max-width: 360px;
		box-sizing: border-box;
		box-shadow: 0 4px 16px rgba(34, 197, 94, 0.08);
	}

	.coins-earned-banner.host {
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-color: rgba(100, 116, 139, 0.2);
		box-shadow: none;
	}

	.coins-earned-banner.top3 {
		background: linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%);
		border-color: rgba(234, 179, 8, 0.3);
		box-shadow: 0 4px 16px rgba(234, 179, 8, 0.1);
	}

	.coins-label {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-solar-text-muted, #64748b);
	}

	.coins-amount {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.6rem;
		font-weight: 900;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.coins-note {
		font-size: 0.72rem;
		color: var(--color-solar-text-muted, #64748b);
		margin: 0;
		line-height: 1.4;
	}

	.podium-actions {
		display: flex;
		justify-content: center;
	}

	.podium-action-btn {
		padding: 0.7rem 1.8rem;
		font-size: 0.9rem;
		font-weight: 800;
		border-radius: 12px;
	}

	/* Podio visuals and pillars */

	.podium-visuals {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 1.5rem;
		margin-top: 2rem;
		max-width: 480px;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	}

	.podium-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		width: 110px;
		text-align: center;
	}

	.podium-step.step-1 {
		order: 2;
	}
	.podium-step.step-2 {
		order: 1;
	}
	.podium-step.step-3 {
		order: 3;
	}





	.pillar {
		width: 100%;
		border-radius: 12px 12px 0 0;
		margin-top: 0.5rem;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
		position: relative;
		overflow: hidden;
		transition: all 0.5s ease;
	}

	.pillar::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: rgba(255, 255, 255, 0.35);
	}

	.step-1 .pillar {
		height: 120px;
		background: linear-gradient(185deg, #fbbf24 0%, #d97706 100%);
		box-shadow: 0 6px 20px rgba(217, 119, 6, 0.15);
	}

	.step-2 .pillar {
		height: 85px;
		background: linear-gradient(185deg, #cbd5e1 0%, #64748b 100%);
		box-shadow: 0 4px 15px rgba(100, 116, 139, 0.12);
	}

	.step-3 .pillar {
		height: 55px;
		background: linear-gradient(185deg, #d97706 0%, #b45309 100%);
		box-shadow: 0 4px 15px rgba(180, 83, 9, 0.12);
	}

	/* ============================================
	   SLIDE SCREEN — Premium Visual Hierarchy
	   ============================================ */
	.slide-screen {
		display: block;
		text-align: left;
		width: 100%;
	}

	.slide-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding-bottom: 0.85rem;
		margin-bottom: 1.25rem;
		border-bottom: 2px solid var(--color-solar-green-light, #d2f5e3);
	}

	.slide-phase-meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.phase-badge {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-solar-green-medium, #3d8f68);
		background: color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 8%, transparent);
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 20%, transparent);
		display: inline-block;
		width: fit-content;
	}

	.slide-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.95rem;
		font-weight: 900;
		color: var(--color-solar-green-dark, #1e4533);
		margin-top: 0.35rem;
	}

	/* SCENARIO CARD */
	.scenario-quote-card {
		background: linear-gradient(135deg,
			color-mix(in srgb, var(--color-solar-green-light, #d2f5e3) 20%, white) 0%,
			white 100%);
		border: 1.5px solid color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 18%, transparent);
		border-left: 5px solid var(--color-solar-green-medium, #3d8f68);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 15px rgba(30, 69, 51, 0.04);
	}

	.scenario-label {
		display: block;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.65rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-solar-green-medium, #3d8f68);
		margin-bottom: 0.5rem;
	}

	.scenario-text {
		font-size: 0.92rem;
		line-height: 1.7;
		color: var(--color-solar-green-dark, #1e4533);
		font-weight: 500;
		font-style: italic;
		margin: 0;
	}

	/* INTERACTION BLOCK */
	.interaction-block {
		display: block;
		width: 100%;
	}

	/* Mode header with icon */
	.mode-header {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		background: color-mix(in srgb, var(--color-solar-yellow, #ffd166) 8%, white);
		border: 1.5px solid color-mix(in srgb, var(--color-solar-yellow, #ffd166) 30%, transparent);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		margin-bottom: 1.25rem;
		box-shadow: 0 2px 8px rgba(30, 69, 51, 0.03);
	}

	.mode-icon {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
		padding-top: 0.1rem;
	}

	.mode-title-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mode-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.85rem;
		font-weight: 900;
		color: var(--color-solar-green-dark, #1e4533);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.mode-desc {
		font-size: 0.78rem;
		color: var(--color-solar-text-muted, #64748b);
		line-height: 1.55;
		margin: 0;
	}

	/* BETTING OPTIONS */
	.betting-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.bet-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		padding: 0.85rem 1.25rem;
		background: white;
		border: 1.5px solid #f1f5f9;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(30, 69, 51, 0.03);
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.15);
	}

	.bet-row:hover {
		border-color: color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 35%, transparent);
		box-shadow: 0 4px 15px rgba(30, 69, 51, 0.07);
		transform: translateY(-1px);
	}

	.bet-row.bet-submitted {
		background: color-mix(in srgb, var(--color-solar-green-light, #d2f5e3) 12%, white);
		border-color: color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 25%, transparent);
		pointer-events: none;
	}

	.opt-label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
		cursor: pointer;
	}

	.opt-letter {
		flex-shrink: 0;
		width: 1.85rem;
		height: 1.85rem;
		background: var(--color-solar-green-dark, #1e4533);
		color: white;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.8rem;
		font-weight: 900;
		box-shadow: 0 2px 4px rgba(30, 69, 51, 0.1);
	}

	.opt-text {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.45;
		margin: 0;
		padding-top: 0.18rem;
	}

	.opt-input-group {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-shrink: 0;
	}

	.bet-pct-input {
		width: 4.2rem;
		text-align: center;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.92rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		padding: 0.35rem 0.45rem;
		outline: none;
		transition: all 0.2s ease;
		background: #f8fafc;
	}

	.bet-pct-input:focus {
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-solar-green-medium, #3d8f68) 18%, transparent);
		background: white;
		transform: scale(1.02);
	}

	.bet-pct-input:disabled {
		opacity: 0.65;
		cursor: not-allowed;
		background: #e2e8f0;
		border-color: #cbd5e1;
	}

	.pct-symbol {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-text-muted, #64748b);
	}

	/* ANSWER BUTTONS */
	.answering-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	/* SUBMIT ACTION AREA */
	.submit-action {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.65rem;
		padding-top: 1.25rem;
		border-top: 1.5px dashed #e2e8f0;
		margin-top: 0.75rem;
	}

	/* STATUS ALERTS */
	.status-alert {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-weight: 800;
		padding: 0.6rem 1.1rem;
		border-radius: 10px;
		line-height: 1.45;
		box-shadow: 0 2px 6px rgba(0,0,0,0.02);
	}

	.status-alert.status-waiting-host {
		background: color-mix(in srgb, #f59e0b 12%, white);
		color: #92400e;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	.status-alert.status-success {
		background: color-mix(in srgb, #10b981 12%, white);
		color: #065f46;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.status-alert.status-error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}
</style>
