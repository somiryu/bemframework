<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { workshopCards, type GFRCard } from '$lib/content/gfrCards';
	import confetti from 'canvas-confetti';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import FacilitatorControlPanel from '$lib/components/workshop/FacilitatorControlPanel.svelte';
	import GameUIWrapper from '$lib/components/workshop/GameUIWrapper.svelte';

	function generateRandomOrder(length: number): number[] {
		const arr = Array.from({ length }, (_, i) => i);
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function isSequential(arr: number[]): boolean {
		if (!arr || arr.length === 0) return false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] !== i) return false;
		}
		return true;
	}

	let { 
		player: initialPlayer, 
		instance, 
		onComplete 
	}: { 
		player: any; 
		instance: any; 
		onComplete: () => void 
	} = $props();

	// Initialize the shared workshop session
	const session = createWorkshopSession(initialPlayer, instance, 2, onComplete);

	// Real-time synchronization
	let currentRound = $state(0); // 0 to 11
	let activeMode = $state<'actividad' | 'feedback' | 'final_feedback'>('actividad'); // 'actividad' = voting, 'feedback' = explanation, 'final_feedback' = final summary

	// Student selection state for current round
	let selectedCol = $state<'meta' | 'retroalimentacion' | 'recompensa' | null>(null);
	let selectedRow = $state<'regulatorio' | 'integrado' | 'intrinseco' | null>(null);
	let hasVotedThisRound = $state(false);
	let lastSelectTime = 0;

	// State to track liked ideas locally
	let likedIdeas = $state<string[]>(session.player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(card: GFRCard) {
		let currentLiked = [...likedIdeas];
		
		// Create safe deep copy of game_state to avoid Svelte 5 proxy serialization errors
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state.ideas) {
			state.ideas = [];
		}

		if (currentLiked.includes(card.id)) {
			// Remove it
			currentLiked = currentLiked.filter(id => id !== card.id);
			state.ideas = state.ideas.filter((i: any) => i.id !== card.id);
		} else {
			// Add it
			currentLiked.push(card.id);
			state.ideas.push({
				id: card.id,
				driver: `${card.rii.toUpperCase()} - ${card.gfr.toUpperCase()}`,
				scenario: card.text,
				explanation: card.explanation,
				likedAt: new Date().toISOString()
			});
		}
		
		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;

		await session.updatePlayerGameState(state);
	}

	// Class submissions and votes for current round
	let classVotes = $state<Record<string, { col: string; row: string; alias: string }>>({});
	
	// Previous cards successfully placed on the board (correct locations)
	let cardOrder = $state<number[]>(Array.from({ length: workshopCards.length }, (_, i) => i));

	const cardRoundMap = $derived.by(() => {
		const map = new Map<string, number>();
		cardOrder.forEach((cardIdx, roundIdx) => {
			const card = workshopCards[cardIdx];
			if (card) {
				map.set(card.id, roundIdx);
			}
		});
		return map;
	});

	let placedCards = $derived.by(() => {
		const list: Record<string, GFRCard[]> = {};
		const cols = ['meta', 'retroalimentacion', 'recompensa'];
		const rows = ['regulatorio', 'integrado', 'intrinseco'];
		rows.forEach(r => {
			cols.forEach(c => {
				list[`${r}-${c}`] = [];
			});
		});

		const limit = activeMode === 'feedback' ? currentRound + 1 : currentRound;
		for (let i = 0; i < limit; i++) {
			const cardIdx = cardOrder[i];
			const card = workshopCards[cardIdx];
			if (card) {
				const key = `${card.rii}-${card.gfr}`;
				if (list[key]) {
					list[key].push(card);
				}
			}
		}
		return list;
	});

	// Derived error analytics from student performance
	const errorStatistics = $derived.by(() => {
		const colErrors: Record<string, number> = { meta: 0, retroalimentacion: 0, recompensa: 0 };
		const rowErrors: Record<string, number> = { regulatorio: 0, integrado: 0, intrinseco: 0 };
		let totalVotesCount = 0;

		session.allClassPlayers.forEach(p => {
			if (p.email === 'javier@f2p.co') return;
			const rounds = p.game_state?.[2]?.workshop_completed_rounds;
			if (rounds) {
				Object.keys(rounds).forEach((roundIdxStr) => {
					const roundIndex = parseInt(roundIdxStr, 10);
					const vote = rounds[roundIndex];
					const card = workshopCards[cardOrder[roundIndex]];
					if (vote && card) {
						totalVotesCount++;
						if (vote.col !== card.gfr) {
							colErrors[card.gfr] = (colErrors[card.gfr] || 0) + 1;
						}
						if (vote.row !== card.rii) {
							rowErrors[card.rii] = (rowErrors[card.rii] || 0) + 1;
						}
					}
				});
			}
		});

		// Sort columns by mistakes
		const sortedCols = Object.entries(colErrors).sort((a, b) => b[1] - a[1]);
		// Sort rows by mistakes
		const sortedRows = Object.entries(rowErrors).sort((a, b) => b[1] - a[1]);

		return {
			colErrors,
			rowErrors,
			sortedCols,
			sortedRows,
			totalVotesCount
		};
	});

	// Active card for current round
	const activeCard = $derived(workshopCards[cardOrder[currentRound]] || null);

	// Personal performance points
	let personalScore = $state(0);

	// Calculate majority vote score for a given round based on all players' votes
	function getCourseScoreForRound(roundIndex: number, playersList: any[]): number {
		if (playersList.length === 0) return 0;
		const card = workshopCards[cardOrder[roundIndex]];
		if (!card) return 0;

		const counts: Record<string, number> = {};
		playersList.forEach(p => {
			const vote = p.game_state?.[2]?.workshop_completed_rounds?.[roundIndex];
			if (vote) {
				const key = `${vote.row}-${vote.col}`;
				counts[key] = (counts[key] || 0) + 1;
			}
		});

		let maxCount = 0;
		let bestCells: string[] = [];

		Object.keys(counts).forEach(key => {
			if (counts[key] > maxCount) {
				maxCount = counts[key];
				bestCells = [key];
			} else if (counts[key] === maxCount) {
				bestCells.push(key);
			}
		});

		if (bestCells.length === 0) return 0;

		// Resolve ties
		let bestCell = bestCells[0];
		if (bestCells.length > 1) {
			let maxPoints = -1;
			bestCells.forEach(cell => {
				const [rowVal, colVal] = cell.split('-');
				const isColCorrect = colVal === card.gfr;
				const isRowCorrect = rowVal === card.rii;
				let pts = 0;
				if (isColCorrect && isRowCorrect) pts = 2;
				else if (isColCorrect || isRowCorrect) pts = 1;

				if (pts > maxPoints) {
					maxPoints = pts;
					bestCell = cell;
				}
			});
		}

		const [rowVal, colVal] = bestCell.split('-');
		const isColCorrect = colVal === card.gfr;
		const isRowCorrect = rowVal === card.rii;
		if (isColCorrect && isRowCorrect) return 2;
		if (isColCorrect || isRowCorrect) return 1;
		return 0;
	}

	async function loadAllClassPlayers() {
		await session.loadAllClassPlayers();
	}

	// Load class votes from database for a specific round to preserve state on reload
	async function loadClassVotes(roundIndex: number) {
		if (!supabase) return;
		const { data: players } = await supabase
			.from('course_players')
			.select('id, alias, game_state')
			.eq('instance_code', instance.code);

		if (players) {
			const votes: Record<string, { col: string; row: string; alias: string }> = {};
			players.forEach(p => {
				const roundState = p.game_state?.[2]?.workshop_completed_rounds?.[roundIndex];
				if (roundState) {
					votes[p.id] = {
						col: roundState.col,
						row: roundState.row,
						alias: p.alias || 'Estudiante'
					};
				}
			});
			classVotes = votes;
		}
	}

	// Load initial state
	onMount(() => {
		session.loadAllClassPlayers();

		const existingState = session.player.game_state?.[2] || {};
		if (existingState.workshop_performance_points) {
			personalScore = existingState.workshop_performance_points;
		}
		if (existingState.workshop_completed_rounds) {
			const currentRoundState = existingState.workshop_completed_rounds[currentRound];
			if (currentRoundState) {
				selectedCol = currentRoundState.col;
				selectedRow = currentRoundState.row;
				hasVotedThisRound = true;
			}
		}

		session.initConnection(async (event, payload) => {
			if (event === 'round-sync') {
				const isNewRound = payload.roundIndex !== currentRound;
				currentRound = payload.roundIndex;
				activeMode = payload.mode;
				if (isNewRound || activeMode === 'actividad') {
					classVotes = {};
				}
				if (payload.cardOrder) {
					cardOrder = payload.cardOrder;
				}
				
				const savedState = session.player.game_state?.[2]?.workshop_completed_rounds?.[currentRound];
				if (savedState) {
					selectedCol = savedState.col;
					selectedRow = savedState.row;
					hasVotedThisRound = true;
				} else {
					selectedCol = null;
					selectedRow = null;
					hasVotedThisRound = false;
				}
				await loadClassVotes(currentRound);
				await session.loadAllClassPlayers();
			} else if (event === 'student-vote') {
				classVotes = {
					...classVotes,
					[payload.playerId]: { col: payload.col, row: payload.row, alias: payload.alias }
				};
				if (payload.gameState) {
					session.allClassPlayers = session.allClassPlayers.map(p => {
						if (p.id === payload.playerId) {
							return { ...p, game_state: payload.gameState };
						}
						return p;
					});
				} else if (session.isHost) {
					await session.loadAllClassPlayers();
				}
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
					if (!state[2]) state[2] = {};
					state[2].workshop_completed = true;
					state[2].workshop_performance_points = personalScore;

					await session.updatePlayerGameState(state, {
						coins: session.player.coins + 5
					});
				}
				onComplete();
			} else if (event === 'workshop-reset') {
				personalScore = 0;
				selectedCol = null;
				selectedRow = null;
				hasVotedThisRound = false;
				classVotes = {};
				currentRound = 0;
				activeMode = 'actividad';
				session.allClassPlayers = [];
				if (payload?.cardOrder) {
					cardOrder = payload.cardOrder;
				}
				if (session.player.game_state) {
					const newState = { ...session.player.game_state };
					delete newState['2'];
					delete newState[2];
					session.player.game_state = newState;
				}
			}
		});

		if (supabase) {
			supabase
				.from('course_instances')
				.select('current_workshop_state')
				.eq('code', instance.code)
				.single()
				.then(async ({ data: inst }) => {
					let currentWorkshopState = inst?.current_workshop_state;

					// If state is not initialized for World 2, or card_order is missing, or it's sequential, the host creates/resets it!
					if (session.isHost && (!currentWorkshopState || currentWorkshopState.world_id !== 2 || !currentWorkshopState.card_order || isSequential(currentWorkshopState.card_order))) {
						const newOrder = generateRandomOrder(workshopCards.length);
						cardOrder = newOrder;
						currentRound = 0;
						activeMode = 'actividad';

						currentWorkshopState = {
							world_id: 2,
							round_index: 0,
							mode: 'actividad',
							card_order: newOrder
						};

						await supabase
							.from('course_instances')
							.update({ current_workshop_state: currentWorkshopState })
							.eq('code', instance.code);
					} else if (currentWorkshopState && currentWorkshopState.world_id === 2) {
						currentRound = currentWorkshopState.round_index ?? 0;
						activeMode = currentWorkshopState.mode ?? 'actividad';
						if (currentWorkshopState.card_order) {
							cardOrder = currentWorkshopState.card_order;
						}
					}

					const savedState = session.player.game_state?.[2]?.workshop_completed_rounds?.[currentRound];
					if (savedState) {
						selectedCol = savedState.col;
						selectedRow = savedState.row;
						hasVotedThisRound = true;
					}
					await loadClassVotes(currentRound);
				});

			// Sync and listen to any student state updates (e.g. database change)
			const playersChannel = supabase
				.channel(`course_players_sync_w2_${instance.code}`)
				.on('postgres_changes', {
					event: '*',
					schema: 'public',
					table: 'course_players',
					filter: `instance_code=eq.${instance.code}`
				}, (payload: any) => {
					if (session.isHost) {
						session.loadAllClassPlayers();
					}
					if (payload.new && payload.new.id === session.player.id) {
						session.player.game_state = payload.new.game_state;
						session.player.coins = payload.new.coins;
						session.player.avatar = payload.new.avatar;
						likedIdeas = session.player.game_state?.liked_ideas || [];

						const pState = session.player.game_state?.[2] || {};
						personalScore = pState.workshop_performance_points || 0;
						
						const roundState = pState.workshop_completed_rounds?.[currentRound];
						if (roundState) {
							selectedCol = roundState.col;
							selectedRow = roundState.row;
							hasVotedThisRound = true;
						} else {
							selectedCol = null;
							selectedRow = null;
							hasVotedThisRound = false;
						}
					}
				})
				.subscribe();

			// Fallback: Sync and listen to course_instances changes (host round updates) in case WebSocket broadcast fails in production
			const instancesChannel = supabase
				.channel(`course_instances_sync_w2_${instance.code}`)
				.on('postgres_changes', {
					event: 'UPDATE',
					schema: 'public',
					table: 'course_instances',
					filter: `code=eq.${instance.code}`
				}, (payload: any) => {
					const instState = payload.new?.current_workshop_state;
					if (instState && instState.world_id === 2) {
						currentRound = instState.round_index ?? 0;
						activeMode = instState.mode ?? 'actividad';
						if (instState.card_order) {
							cardOrder = instState.card_order;
						}
						
						const savedState = session.player.game_state?.[2]?.workshop_completed_rounds?.[currentRound];
						if (savedState) {
							selectedCol = savedState.col;
							selectedRow = savedState.row;
							hasVotedThisRound = true;
						} else {
							selectedCol = null;
							selectedRow = null;
							hasVotedThisRound = false;
						}
					}
				})
				.subscribe();

			return () => {
				supabase.removeChannel(playersChannel);
				supabase.removeChannel(instancesChannel);
			};
		}
	});

	// Host broadcast sync triggers
	async function changeRound(index: number, mode: 'actividad' | 'feedback' | 'final_feedback') {
		const isNewRound = index !== currentRound;
		currentRound = index;
		activeMode = mode;
		if (isNewRound || mode === 'actividad') {
			classVotes = {};
		}
		
		if (session.isHost) {
			const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
			if (!state[2]) state[2] = {};
			state[2].workshop_team_points = teamScore;
			session.player.game_state = state;
			
			await session.updatePlayerGameState(state);
		}
		
		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'round-sync',
				payload: { roundIndex: index, mode, cardOrder }
			});

			await supabase
				.from('course_instances')
				.update({
					current_workshop_state: { 
						world_id: 2, 
						round_index: index, 
						mode,
						card_order: cardOrder
					}
				})
				.eq('code', instance.code);
		}
	}

	// Submit student vote
	async function submitVote() {
		if (!selectedCol || !selectedRow || !activeCard) return;

		hasVotedThisRound = true;

		// Calculate scores
		const isColCorrect = selectedCol === activeCard.gfr;
		const isRowCorrect = selectedRow === activeCard.rii;
		let pointsEarned = 0;
		if (isColCorrect && isRowCorrect) pointsEarned = 2;
		else if (isColCorrect || isRowCorrect) pointsEarned = 1;

		personalScore += pointsEarned;

		// Persist round results in player game_state
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[2]) {
			state[2] = {
				workshop_completed_rounds: {},
				workshop_performance_points: 0,
				workshop_team_points: 0
			};
		}
		if (!state[2].workshop_completed_rounds) {
			state[2].workshop_completed_rounds = {};
		}

		state[2].workshop_completed_rounds[currentRound] = {
			col: selectedCol,
			row: selectedRow,
			points: pointsEarned
		};
		state[2].workshop_performance_points = personalScore;
		session.player.game_state = state;

		const payloadData = {
			playerId: session.player.id,
			alias: session.player.alias,
			col: selectedCol,
			row: selectedRow,
			round: currentRound,
			gameState: state
		};

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'student-vote',
				payload: payloadData
			});
		}

		classVotes = {
			...classVotes,
			[session.player.id]: { col: selectedCol, row: selectedRow, alias: session.player.alias }
		};

		await session.updatePlayerGameState(state);
	}

	// Evaluate team score based on majority vote
	function getMajorityVoteCell() {
		const votes = Object.values(classVotes);
		if (votes.length === 0) return null;

		const counts: Record<string, number> = {};
		votes.forEach(v => {
			const key = `${v.row}-${v.col}`;
			counts[key] = (counts[key] || 0) + 1;
		});

		let maxCount = 0;
		let bestCells: string[] = [];

		Object.keys(counts).forEach(key => {
			if (counts[key] > maxCount) {
				maxCount = counts[key];
				bestCells = [key];
			} else if (counts[key] === maxCount) {
				bestCells.push(key);
			}
		});

		// Resolve ties
		if (bestCells.length > 1 && activeCard) {
			let bestCell = bestCells[0];
			let maxPoints = -1;
			bestCells.forEach(cell => {
				const [r, c] = cell.split('-');
				const isColCorrect = c === activeCard.gfr;
				const isRowCorrect = r === activeCard.rii;
				let pts = 0;
				if (isColCorrect && isRowCorrect) pts = 2;
				else if (isColCorrect || isRowCorrect) pts = 1;

				if (pts > maxPoints) {
					maxPoints = pts;
					bestCell = cell;
				}
			});
			return bestCell;
		}

		return bestCells[0] || null;
	}

	// Dynamic values for UI
	const majorityCell = $derived(getMajorityVoteCell());
	const teamPointsEarnedThisRound = $derived.by(() => {
		if (!majorityCell || !activeCard) return 0;
		const [r, c] = majorityCell.split('-');
		const isColCorrect = c === activeCard.gfr;
		const isRowCorrect = r === activeCard.rii;
		if (isColCorrect && isRowCorrect) return 2;
		if (isColCorrect || isRowCorrect) return 1;
		return 0;
	});

	// Team points (derived dynamically from the class players' votes for revealed rounds)
	const teamScore = $derived.by(() => {
		let total = 0;
		const limit = activeMode === 'feedback' ? currentRound + 1 : currentRound;
		for (let i = 0; i < limit; i++) {
			total += getCourseScoreForRound(i, session.allClassPlayers);
		}
		return total;
	});

	// Classroom aggregate performance score (for super_user/host display)
	const totalClassroomPerformanceScore = $derived.by(() => {
		let total = 0;
		session.allClassPlayers.forEach(p => {
			if (p.email !== 'javier@f2p.co') {
				const pScore = p.game_state?.[2]?.workshop_performance_points || 0;
				total += pScore;
			}
		});
		return total;
	});

	let lastSignaledRoundFeedback = $state(-1);
	$effect(() => {
		if (activeMode === 'feedback' && currentRound !== lastSignaledRoundFeedback) {
			lastSignaledRoundFeedback = currentRound;
			if (teamPointsEarnedThisRound === 2) {
				try {
					confetti({
						particleCount: 120,
						spread: 80,
						origin: { y: 0.6 }
					});
				} catch (e) {
					console.error('Confetti failed to run:', e);
				}
			}
		}
	});

	async function handleResetWorkshop() {
		if (confirm('¿Estás seguro de reiniciar el taller del Mundo 2? Esto borrará todas las respuestas del Mundo 2 en todos los estudiantes.')) {
			const { data: players } = await supabase
				.from('course_players')
				.select('id, game_state')
				.eq('instance_code', instance.code);

			if (players) {
				const updatePromises = players.map(p => {
					const newState = p.game_state ? { ...p.game_state } : {};
					delete newState['2'];
					delete newState[2];
					return supabase
						.from('course_players')
						.update({ game_state: newState })
						.eq('id', p.id);
				});
				await Promise.all(updatePromises);
			}

			const newOrder = generateRandomOrder(workshopCards.length);
			cardOrder = newOrder;

			personalScore = 0;
			selectedCol = null;
			selectedRow = null;
			hasVotedThisRound = false;
			classVotes = {};

			if (session.channel) {
				await session.channel.send({
					type: 'broadcast',
					event: 'workshop-reset',
					payload: { cardOrder: newOrder }
				});
			}

			await changeRound(0, 'actividad');
		}
	}

	async function finalizeWorkshop() {
		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'workshop-complete',
				payload: {}
			});
		}

		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[2]) state[2] = {};
		state[2].workshop_completed = true;
		state[2].workshop_team_points = teamScore; // Make sure host saves final teamScore

		await session.updatePlayerGameState(state, {
			coins: session.player.coins + 5
		});

		onComplete();
	}

	const colLabels = {
		meta: 'Meta (Goal)',
		retroalimentacion: 'Retroalimentación (Feedback)',
		recompensa: 'Recompensa (Reward)'
	};

	const rowLabels = {
		regulatorio: 'Regulatorio',
		intrinseco: 'Intrínseco',
		integrado: 'Integrado'
	};

	function handleNextStep() {
		if (currentRound < 11) {
			changeRound(currentRound + 1, 'actividad');
		} else if (activeMode === 'feedback') {
			changeRound(currentRound, 'final_feedback');
		}
	}
</script>

<div class="workshop-container">
	<FacilitatorControlPanel
		isHost={session.isHost}
		onlineCount={session.onlinePlayers.length}
		submittedCount={Object.keys(classVotes).length}
		teamScore={teamScore}
		isFirstStep={currentRound === 0}
		isLastStep={currentRound === 11 && activeMode === 'final_feedback'}
		activeMode={activeMode}
		onReset={handleResetWorkshop}
		onPrev={() => changeRound(currentRound - 1, 'actividad')}
		onNext={handleNextStep}
		onToggleMode={(mode) => changeRound(currentRound, mode)}
		onComplete={finalizeWorkshop}
		coinsLabel="+5 BEM Coins"
		stepLabel="Ronda"
	>
		{#if currentRound === 11 && activeMode === 'final_feedback'}
			<button 
				type="button" 
				class="btn-solar-secondary btn-sm"
				onclick={() => changeRound(currentRound, 'feedback')}
			>
				◀ Reabrir Feedback de Ronda
			</button>
		{/if}
	</FacilitatorControlPanel>

	<GameUIWrapper maxWidth="1400px">
		<!-- Rounds Tracker -->
		<header class="rounds-tracker">
			<div class="tracker-left">
				<span class="m-badge">Ronda {currentRound + 1} de 12</span>
				<h4>GFR Live Board</h4>
			</div>
			<div class="tracker-right">
				<div class="score-pill personal">
					{#if session.isHost}
						🏆 Desempeño Clase: <strong>{totalClassroomPerformanceScore} pts</strong>
					{:else}
						🏆 Desempeño: <strong>{personalScore} pts</strong>
					{/if}
				</div>
				<div class="score-pill team">
					👥 Salón: <strong>{teamScore} pts</strong>
				</div>
			</div>
		</header>

	{#if activeMode === 'final_feedback'}
		<div class="final-feedback-container glass-card" in:fade>
			<!-- Header / Qualification Title -->
			<div class="final-feedback-header">
				<div class="medal-icon">🏆</div>
				<h3>Taller Completado: Calibración Final del Salón</h3>
				<p class="subtitle">Evaluación agregada de las 12 tarjetas de diseño GFR</p>
			</div>

			<!-- Progress bar of class score -->
			<div class="class-score-section">
				<div class="score-meta">
					<span>Puntaje Colectivo del Salón</span>
					<span class="score-value"><strong>{teamScore}</strong> / 24 PTS</span>
				</div>
				<div class="score-bar-bg">
					<div class="score-bar-fill" style="width: {(teamScore / 24) * 100}%"></div>
				</div>
				<div class="qualification-badge-wrapper">
					{#if teamScore >= 17}
						<span class="badge gold">🌟 Maestros del Gamification GFR</span>
					{:else if teamScore >= 9}
						<span class="badge silver">📡 Agentes Calibrados GFR</span>
					{:else}
						<span class="badge bronze">🛠️ Diseñadores Principiantes GFR</span>
					{/if}
				</div>
			</div>

			<!-- Final Matrix Board Display -->
			<div class="final-board-wrapper" style="margin-top: 2rem; margin-bottom: 2rem;">
				<h5 style="text-align: left; font-family: var(--font-solar-header); font-weight: 800; color: var(--color-solar-green-dark); margin-bottom: 1rem;">🗺️ Tablero Final de Clasificación del Salón</h5>
				<table class="gfr-matrix-table">
					<thead>
						<tr>
							<th class="corner-cell"></th>
							<th class="col-header">Meta (Goal)</th>
							<th class="col-header">Retroalimentación (Feedback)</th>
							<th class="col-header">Recompensa (Reward)</th>
						</tr>
					</thead>
					<tbody>
						{#each ['regulatorio', 'integrado', 'intrinseco'] as r}
							<tr>
								<td class="row-header">{rowLabels[r]}</td>
								{#each ['meta', 'retroalimentacion', 'recompensa'] as c}
									{@const cellKey = `${r}-${c}`}
									<td class="matrix-cell">
										<div class="cell-content">
											<div class="placed-cards-list">
												{#each placedCards[cellKey] as card}
													{@const roundIdx = cardRoundMap.get(card.id)}
													{@const courseScore = roundIdx !== undefined ? getCourseScoreForRound(roundIdx, session.allClassPlayers) : 0}
													<div class="placed-card-pill-wrapper">
														<div class="placed-card-pill score-{courseScore}">
															📄 {card.text.substring(0, 24)}...
														</div>
														<div class="card-tooltip glass-card">
															<p class="tooltip-text"><strong>Tarjeta:</strong> "{card.text}"</p>
															<hr class="tooltip-sep" />
															<p class="tooltip-feedback"><strong>Retroalimentación:</strong> {card.explanation}</p>
														</div>
													</div>
												{/each}
											</div>
										</div>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="feedback-grid">
				<!-- Left Card: Concept Review -->
				<div class="feedback-card concepts-review">
					<h5>📘 Conceptos Clave GFR & Teoría de la Autodeterminación (SDT)</h5>
					
					<div class="concept-group-title" style="font-weight: 800; color: var(--color-solar-green-dark); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Eje GFR: Componentes del Juego</div>
					<div class="concept-item">
						<strong>Meta (Goal):</strong> Define los objetivos del jugador dentro del sistema y guía su alineación.
					</div>
					<div class="concept-item">
						<strong>Retroalimentación (Feedback):</strong> Mide e informa el progreso del jugador en tiempo real para facilitar la calibración.
					</div>
					<div class="concept-item">
						<strong>Recompensa (Reward):</strong> Ofrece incentivos instrumentales, estatus o reconocimiento para reforzar la acción.
					</div>

					<hr style="border: 0; border-top: 1px solid rgba(0, 0, 0, 0.08); margin: 1rem 0;" />

					<div class="concept-group-title" style="font-weight: 800; color: var(--color-solar-green-dark); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Eje SDT (RII): Tipos de Regulación de la Motivación</div>
					<div class="concept-item">
						<strong>Regulatorio (Extrínseco):</strong> Motivación basada puramente en recompensas externas, castigos o presiones directas de terceros.
					</div>
					<div class="concept-item">
						<strong>Integrado:</strong> La persona asimila el objetivo y lo asocia a su sistema de valores personales y metas de identidad.
					</div>
					<div class="concept-item">
						<strong>Intrínseco (Autónomo):</strong> La actividad se realiza por el puro disfrute, el reto inherente o el deseo natural de aprender.
					</div>
				</div>

				<!-- Right Card: Error breakdown -->
				<div class="feedback-card analytics-errors">
					<h5>📊 Diagnóstico de Clasificación del Salón</h5>
					<p class="analytics-sub">Análisis de los conceptos con mayor porcentaje de error durante el taller:</p>
					
					{#if errorStatistics.totalVotesCount > 0}
						<div class="errors-list">
							<div class="error-group">
								<span class="error-group-title">Eje GFR (Columnas)</span>
								{#each errorStatistics.sortedCols as [col, val]}
									<div class="error-stat-bar-row">
										<span class="stat-lbl">{colLabels[col as 'meta' | 'retroalimentacion' | 'recompensa']}</span>
										<div class="stat-bar-container">
											<div class="stat-bar-fill error-fill" style="width: {Math.min(100, (val / errorStatistics.totalVotesCount) * 100)}%"></div>
										</div>
										<span class="stat-val-count">{val} fallos</span>
									</div>
								{/each}
							</div>

							<div class="error-group">
								<span class="error-group-title">Eje RII / Autodeterminación (Filas)</span>
								{#each errorStatistics.sortedRows as [row, val]}
									<div class="error-stat-bar-row">
										<span class="stat-lbl">{rowLabels[row as 'regulatorio' | 'intrinseco' | 'integrado']}</span>
										<div class="stat-bar-container">
											<div class="stat-bar-fill error-fill" style="width: {Math.min(100, (val / errorStatistics.totalVotesCount) * 100)}%"></div>
										</div>
										<span class="stat-val-count">{val} fallos</span>
									</div>
								{/each}
							</div>
						</div>
					{:else}
						<p class="no-data-text">No hay suficientes votos registrados para generar el diagnóstico.</p>
					{/if}
				</div>
			</div>

			{#if session.isHost}
				<div class="final-actions-row" style="margin-top: 2rem; display: flex; justify-content: center;">
					<button type="submit" class="btn-solar-primary font-bold shadow-solar-md" onclick={finalizeWorkshop}>
						✓ Finalizar Taller y Guardar Resultados (+5 BEM Coins)
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Two-column workspace layout -->
		<div class="gfr-workspace-layout">
			
			<!-- Left Column: Matrix Grid Board -->
			<div class="board-grid-container glass-card">
				<div class="board-grid-wrapper">
					<table class="gfr-matrix-table">
						<thead>
							<tr>
								<th class="corner-cell"></th>
								<th class="col-header">Meta (Goal)</th>
								<th class="col-header">Retroalimentación (Feedback)</th>
								<th class="col-header">Recompensa (Reward)</th>
							</tr>
						</thead>
						<tbody>
							{#each ['regulatorio', 'integrado', 'intrinseco'] as r}
								<tr>
									<td class="row-header">{rowLabels[r]}</td>
									{#each ['meta', 'retroalimentacion', 'recompensa'] as c}
										{@const cellKey = `${r}-${c}`}
										{@const isSelected = selectedRow === r && selectedCol === c}
										{@const isCorrectCell = activeCard && activeCard.rii === r && activeCard.gfr === c}
										<td 
											class="matrix-cell" 
											class:selected={isSelected} 
											class:reveal-correct={activeMode === 'feedback' && isCorrectCell}
											class:reveal-wrong={activeMode === 'feedback' && isSelected && !isCorrectCell}
										>
											<div class="cell-content">
												<div class="placed-cards-list">
													{#each placedCards[cellKey] as card}
														{@const roundIdx = cardRoundMap.get(card.id)}
														{@const courseScore = roundIdx !== undefined ? getCourseScoreForRound(roundIdx, session.allClassPlayers) : 0}
														<div class="placed-card-pill-wrapper">
															<div class="placed-card-pill score-{courseScore}">
																📄 {card.text.substring(0, 24)}...
															</div>
															<div class="card-tooltip glass-card">
																<p class="tooltip-text"><strong>Tarjeta:</strong> "{card.text}"</p>
																<hr class="tooltip-sep" />
																<p class="tooltip-feedback"><strong>Retroalimentación:</strong> {card.explanation}</p>
															</div>
														</div>
													{/each}
												</div>

												<!-- Interactive Vote Count inside cell -->
												{#if activeMode === 'actividad'}
													{@const votesForThisCell = Object.values(classVotes).filter(v => v.row === r && v.col === c)}
													{#if votesForThisCell.length > 0}
														<div class="cell-votes-count-badge" in:scale>
															🗳️ {votesForThisCell.length}
														</div>
													{/if}
													
													{#if !session.isHost && !hasVotedThisRound}
														<button 
															type="button" 
															class="select-cell-btn" 
															class:confirm-btn={isSelected}
															onclick={() => {
																selectedRow = r;
																selectedCol = c;
															}}
														>
															{isSelected ? 'Seleccionado ✓' : 'Elegir'}
														</button>
													{/if}
												{/if}
											</div>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Right Column: Card prompt & mentor -->
			<aside class="panel-container">
				<!-- Mentor card -->
				<div class="mentor-card glass-card">
					<img src="/learn_resources/characters/char_kira.png" alt="Kira" class="mentor-avatar" />
					<div class="mentor-info">
						<h5 class="mentor-name">Mentora Kira</h5>
						<p class="mentor-bubble-text">
							{#if activeMode === 'actividad'}
								"Agente, analiza la tarjeta del prompt activo y colócala en la celda correcta de la matriz GFR."
							{:else}
								"¡Excelente análisis de la clase! Revisa la retroalimentación a continuación."
							{/if}
						</p>
					</div>
				</div>

				<!-- Card active prompt -->
				{#if activeCard}
					<div class="card-prompt-panel glass-card" in:fly={{ x: 20 }}>
						<span class="m-badge-card">Tarjeta Activa de la Ronda</span>
						<div class="card-text-box">
							<p class="card-quote">"{activeCard.text}"</p>
						</div>

						{#if !session.isHost}
							<div class="idea-btn-container" style="margin-bottom: 1rem;">
								<button
									type="button"
									class="btn-like-idea"
									class:liked={isIdeaLiked(activeCard.id)}
									onclick={() => toggleIdea(activeCard)}
								>
									{#if isIdeaLiked(activeCard.id)}
										💡 ¡Es una Idea en mi Bitácora!
									{:else}
										💡 Me gusta. Volver una Idea
									{/if}
								</button>
							</div>
						{/if}

						{#if activeMode === 'actividad'}
							{#if !session.isHost}
								{#if hasVotedThisRound}
									<div class="waiting-box" in:fade>
										<span class="waiting-icon">⏳</span>
										<h5 class="waiting-title">Voto Registrado</h5>
										<p class="waiting-subtitle">Ubicado en <strong>{rowLabels[selectedRow!] || ''} - {colLabels[selectedCol!] || ''}</strong>. Espera la revelación del mentor.</p>
									</div>
								{:else}
									<div class="voting-actions">
										{#if selectedCol && selectedRow}
											<p class="selected-text" style="margin-bottom: 0.75rem;">
												Ubicación elegida:<br/>
												<strong class="selected-highlight">{rowLabels[selectedRow]} • {colLabels[selectedCol]}</strong>
											</p>
											<button
												type="button"
												class="btn-solar-primary w-full py-2.5 font-bold shadow-solar-sm"
												style="width: 100%;"
												onclick={submitVote}
											>
												Confirmar Voto 🗳️
											</button>
										{:else}
											<p class="helper-text-select">Selecciona una celda en la matriz para colocar la tarjeta.</p>
										{/if}
									</div>
								{/if}
							{/if}
						{:else}
							<!-- Feedback Explanation Mode -->
							<div class="explanation-box" class:correct={!session.isHost && selectedCol === activeCard.gfr && selectedRow === activeCard.rii} class:wrong={!session.isHost && (selectedCol !== activeCard.gfr || selectedRow !== activeCard.rii)}>
								<h5 class="explanation-header">Retroalimentación del Mentor:</h5>
								<p class="explanation-text">{activeCard.explanation}</p>

								<div class="team-result-box">
									<div>🎯 Ubicación Correcta: <strong>{rowLabels[activeCard.rii]} - {colLabels[activeCard.gfr]}</strong></div>
									<div>👥 Mayoría del Salón: <strong>{majorityCell ? rowLabels[majorityCell.split('-')[0]] + ' - ' + colLabels[majorityCell.split('-')[1]] : 'Ninguno'}</strong> (+{teamPointsEarnedThisRound} pts)</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Live activity logs -->
				<div class="live-activity-feed glass-card">
					<h5 class="activity-feed-header">Actividad de Votación</h5>
					<div class="activity-logs">
						{#each Object.values(classVotes) as vote}
							<div class="vote-log-item" in:slide>
								<span>👤 {vote.alias}</span>
								<strong>{rowLabels[vote.row]} - {colLabels[vote.col]}</strong>
							</div>
						{:else}
							<p class="no-votes-text">Esperando votos de los estudiantes...</p>
						{/each}
					</div>
				</div>
			</aside>

		</div>
	{/if}
	</GameUIWrapper>
</div>

<style>
	/* HOST BANNER */
	.host-controls-banner {
		background: linear-gradient(135deg, hsl(150, 45%, 6%) 0%, hsl(152, 40%, 10%) 100%) !important;
		border: 1.5px solid var(--color-solar-yellow) !important;
		color: white !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 1rem !important;
		border-radius: 10px !important;
		gap: 1.5rem !important;
		text-align: left;
		margin-bottom: 0.75rem;
		box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
		width: 100%;
		box-sizing: border-box;
	}

	.host-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.host-title span {
		font-size: 0.65rem;
		font-weight: 900;
		color: var(--color-solar-yellow);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.host-actions-row {
		align-items: center;
		gap: 1.5rem !important;
	}

	.host-buttons-group {
		gap: 0.75rem !important;
		align-items: center;
	}

	.host-controls-banner button {
		padding: 0.25rem 0.65rem !important;
		font-size: 0.75rem !important;
		border-radius: 6px !important;
		font-weight: 800 !important;
		height: auto !important;
		min-height: unset !important;
		margin: 0 0.25rem !important;
		border: 1px solid rgba(255, 255, 255, 0.15) !important;
	}

	.presence-tag {
		font-size: 0.8rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 0.4rem 0.85rem;
		border-radius: 8px;
		font-weight: 600;
	}

	/* Rounds Tracker Header */
	.rounds-tracker {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 16px;
		padding: 1.25rem 1.75rem;
		margin-bottom: 2rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.tracker-left {
		text-align: left;
	}

	.tracker-left h4 {
		margin: 0.25rem 0 0 0;
		font-family: var(--font-solar-header, sans-serif);
		color: var(--color-solar-green-dark, #1e4533);
		font-weight: 800;
	}

	.tracker-right {
		display: flex;
		gap: 0.75rem;
	}

	.score-pill {
		font-size: 0.85rem;
		font-weight: 750;
		padding: 0.45rem 1rem;
		border-radius: 10px;
	}

	.score-pill.personal {
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		color: var(--color-solar-green-dark, #2b664a);
	}

	.score-pill.team {
		background: #e0f2fe;
		color: #0369a1;
	}

	/* Two-column Layout */
	.gfr-workspace-layout {
		display: grid;
		grid-template-columns: 8fr 4fr;
		gap: 2rem;
		width: 100%;
		box-sizing: border-box;
		align-items: start;
	}

	@media (max-width: 1024px) {
		.gfr-workspace-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	/* Left Column matrix board */
	.board-grid-container {
		padding: 2rem;
		background: #ffffff;
		box-shadow: var(--shadow-solar-sm);
		border-radius: 20px;
		box-sizing: border-box;
	}

	.board-grid-wrapper {
		width: 100%;
		overflow: visible;
	}

	.gfr-matrix-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	.col-header {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		padding: 1.25rem 0.75rem;
		text-align: center;
		border-bottom: 2.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		font-size: 0.9rem;
	}

	.row-header {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		width: 130px;
		text-align: right;
		padding-right: 1.25rem;
		font-size: 0.9rem;
		border-right: 2.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
	}

	.matrix-cell {
		border: 1.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		background: rgba(255, 255, 255, 0.5);
		transition: all 0.25s ease;
		vertical-align: top;
		padding: 0.5rem;
	}

	.matrix-cell.selected {
		background: rgba(255, 209, 102, 0.12);
		border-color: var(--color-solar-yellow, #ffd166);
	}

	.matrix-cell.reveal-correct {
		background: rgba(209, 245, 227, 0.55) !important;
		border-color: var(--color-solar-green-medium, #3d8f68) !important;
	}

	.matrix-cell.reveal-wrong {
		background: rgba(254, 226, 226, 0.55) !important;
		border-color: var(--color-solar-terracotta, #e11d48) !important;
	}

	.cell-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		min-height: 110px;
		box-sizing: border-box;
	}

	.placed-cards-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		overflow: visible;
	}

	/* Dynamic Placed Card Colors based on Score class */
	.placed-card-pill {
		font-size: 0.68rem;
		font-weight: 700;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.placed-card-pill.score-0 {
		background: #fee2e2 !important;
		color: #991b1b !important;
		border: 1px solid #fca5a5 !important;
	}

	.placed-card-pill.score-1 {
		background: #fef3c7 !important;
		color: #92400e !important;
		border: 1px solid #fcd34d !important;
	}

	.placed-card-pill.score-2 {
		background: #d1f5e3 !important;
		color: #1e4533 !important;
		border: 1px solid #a7f3d0 !important;
	}

	/* Card Tooltip Styling */
	.placed-card-pill-wrapper {
		position: relative;
		display: inline-block;
		width: 100%;
		cursor: pointer;
	}

	.card-tooltip {
		display: none;
		position: absolute;
		bottom: 125%;
		left: 50%;
		transform: translateX(-50%);
		width: 270px;
		background: rgba(255, 255, 255, 0.98);
		border: 1.5px solid var(--color-solar-green-medium, #3d8f68);
		border-radius: 12px;
		padding: 0.75rem;
		box-shadow: 0 10px 25px rgba(0,0,0,0.15);
		z-index: 999999;
		backdrop-filter: blur(8px);
		box-sizing: border-box;
		pointer-events: none;
	}

	.placed-card-pill-wrapper:hover .card-tooltip {
		display: block;
	}

	.tooltip-text {
		font-size: 0.72rem;
		line-height: 1.4;
		margin: 0;
		color: var(--color-solar-text, #1f2937);
		text-align: left;
	}

	.tooltip-sep {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		margin: 0.5rem 0;
	}

	.tooltip-feedback {
		font-size: 0.7rem;
		line-height: 1.4;
		margin: 0;
		color: #4b5563;
		text-align: left;
		font-style: italic;
	}

	.cell-votes-bubble {
		align-self: flex-end;
		font-size: 0.72rem;
		font-weight: 800;
		background: var(--color-solar-sky, #0ea5e9);
		color: #ffffff;
		padding: 0.15rem 0.45rem;
		border-radius: 99px;
	}

	.select-cell-btn {
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		border: 1px solid var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #2b664a);
		padding: 0.3rem 0.5rem;
		border-radius: 8px;
		font-size: 0.72rem;
		font-weight: 750;
		cursor: pointer;
		width: 100%;
		margin-top: auto;
		transition: var(--transition-smooth);
	}

	.select-cell-btn:hover {
		background: var(--color-solar-green-medium, #3d8f68);
		color: white;
	}

	.select-cell-btn.confirm-btn {
		background: var(--color-solar-yellow, #ffd166) !important;
		border-color: var(--color-solar-yellow, #ffd166) !important;
		color: var(--color-solar-green-dark, #1e4533) !important;
		box-shadow: 0 0 12px rgba(255, 209, 102, 0.4) !important;
	}

	.select-cell-btn.confirm-btn:hover {
		background: #ffc43d !important;
		border-color: #ffc43d !important;
		box-shadow: 0 0 16px rgba(255, 209, 102, 0.6) !important;
	}

	/* Right Column Panel */
	.panel-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-sizing: border-box;
	}

	/* Mentor Card Styling */
	.mentor-card {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 1.25rem;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 16px;
		box-shadow: var(--shadow-solar-sm);
		text-align: left;
	}

	.mentor-avatar {
		width: 52px;
		height: 52px;
		object-fit: contain;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid var(--color-solar-yellow, #ffd166);
		flex-shrink: 0;
	}

	.mentor-info {
		flex: 1;
	}

	.mentor-name {
		font-weight: 800;
		font-size: 0.88rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.25rem 0;
	}

	.mentor-bubble-text {
		font-size: 0.82rem;
		line-height: 1.4;
		color: #4b5563;
		margin: 0;
		font-style: italic;
	}

	/* Card Active Prompt Panel */
	.card-prompt-panel {
		padding: 1.5rem;
		background: #ffffff;
		box-shadow: var(--shadow-solar-sm);
		border-radius: 20px;
		text-align: left;
	}

	.m-badge-card {
		font-size: 0.65rem;
		font-weight: 800;
		background: var(--color-solar-yellow-light, #fff9e6);
		color: var(--color-solar-green-dark, #1e4533);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.02em;
	}

	.card-text-box {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.25);
		padding: 1.25rem;
		border-radius: 14px;
		margin: 1rem 0;
		text-align: center;
	}

	.card-quote {
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.45;
		margin: 0;
	}

	/* Waiting box style */
	.waiting-box {
		text-align: center;
		padding: 0.75rem;
	}

	.waiting-icon {
		display: inline-block;
		font-size: 1.75rem;
		animation: float 2.5s infinite ease-in-out;
	}

	.waiting-title {
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-solar-green-medium, #3d8f68);
		margin: 0.5rem 0 0.25rem 0;
	}

	.waiting-subtitle {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0;
	}

	.voting-actions {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.selected-text {
		font-size: 0.8rem;
		text-align: center;
		margin: 0;
	}

	.selected-highlight {
		color: var(--color-solar-green-dark, #1e4533);
		font-size: 0.9rem;
	}

	.helper-text-select, .helper-text-select-confirm {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #6b7280);
		font-style: italic;
		text-align: center;
		margin: 0;
	}

	.helper-text-select-confirm {
		font-weight: 600;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	/* Feedback Explanation Panel */
	.explanation-box {
		padding: 1.25rem;
		border-radius: 14px;
		margin-top: 0.75rem;
		text-align: left;
		background: rgba(255, 255, 255, 0.4);
		border: 1px solid var(--color-solar-card-border, #e5e7eb);
	}

	.explanation-box.correct {
		background: rgba(209, 245, 227, 0.35) !important;
		border-left: 4px solid var(--color-solar-green-medium, #3d8f68) !important;
		border-top: none !important;
		border-right: none !important;
		border-bottom: none !important;
	}

	.explanation-box.wrong {
		background: rgba(254, 226, 226, 0.35) !important;
		border-left: 4px solid var(--color-solar-terracotta, #e11d48) !important;
		border-top: none !important;
		border-right: none !important;
		border-bottom: none !important;
	}

	.explanation-header {
		font-weight: 800;
		font-size: 0.82rem;
		text-transform: uppercase;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.02em;
	}

	.explanation-text {
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 0 0 1rem 0;
		color: #374151;
	}

	.team-result-box {
		background: rgba(255, 255, 255, 0.75);
		padding: 0.75rem;
		border-radius: 10px;
		font-size: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border: 1px solid rgba(0, 0, 0, 0.03);
	}

	/* Live activity feed */
	.live-activity-feed {
		padding: 1.25rem;
		background: #ffffff;
		border-radius: 16px;
		box-shadow: var(--shadow-solar-sm);
		max-height: 260px;
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	.activity-feed-header {
		font-weight: 800;
		font-size: 0.85rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.75rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		padding-bottom: 0.5rem;
	}

	.activity-logs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.vote-log-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		background: rgba(0, 0, 0, 0.02);
		padding: 0.45rem 0.65rem;
		border-radius: 6px;
	}

	.no-votes-text {
		font-size: 0.72rem;
		color: var(--color-solar-text-muted, #6b7280);
		font-style: italic;
		text-align: center;
		padding: 1.5rem 0;
		margin: 0;
	}

	/* Helpers */
	.m-badge {
		font-size: 0.65rem;
		font-weight: 800;
		background: var(--color-solar-sky-light, #e0f2fe);
		color: var(--color-solar-sky, #0ea5e9);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.02em;
	}

	.flex { display: flex; }
	.gap-2 { gap: 0.5rem; }
	.gap-4 { gap: 1rem; }
	.w-full { width: 100%; }
	.justify-center { justify-content: center; }
	.mb-4 { margin-bottom: 1rem; }

	.btn-solar-danger {
		background: #ef4444 !important;
		color: white !important;
		border: 1px solid #dc2626 !important;
	}

	.btn-solar-danger:hover {
		background: #dc2626 !important;
		transform: translateY(-1px);
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}

	/* LIKE IDEA BUTTON STYLES */
	.idea-btn-container {
		display: flex;
		justify-content: center;
		margin-top: 0.5rem;
		width: 100%;
	}

	.btn-like-idea {
		background: #ffffff;
		border: 2px solid var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		cursor: pointer;
		padding: 0.4rem 0.8rem;
		border-radius: 12px;
		font-weight: 700;
		font-size: 0.75rem;
		font-family: var(--font-solar-body, sans-serif);
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		outline: none;
	}

	.btn-like-idea:hover {
		transform: translateY(-2px);
		border-color: var(--color-solar-yellow, #ffd166);
		background: #FFFDF4;
		box-shadow: var(--shadow-solar-md);
	}

	.btn-like-idea.liked {
		background: var(--color-solar-yellow, #ffd166);
		color: var(--color-solar-green-dark, #1e4533);
		border-color: var(--color-solar-yellow, #ffd166);
		box-shadow: 0 4px 12px rgba(255, 209, 102, 0.4);
		animation: idea-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes idea-pop {
		0% { transform: scale(1); }
		50% { transform: scale(1.15); }
		100% { transform: scale(1); }
	}

	/* Final Feedback Screen Styles */
	.final-feedback-container {
		max-width: 900px;
		margin: 1.5rem auto;
		padding: 2.5rem;
		background: #ffffff;
		border-radius: 24px;
		box-shadow: var(--shadow-solar-lg, 0 20px 40px rgba(0,0,0,0.06));
		text-align: center;
	}

	.final-feedback-header {
		margin-bottom: 2rem;
	}

	.final-feedback-header h3 {
		font-family: var(--font-solar-header), sans-serif;
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0.5rem 0;
	}

	.final-feedback-header .subtitle {
		font-size: 0.9rem;
		color: var(--color-solar-text-muted, #6b7280);
	}

	.medal-icon {
		font-size: 3rem;
	}

	.class-score-section {
		background: var(--color-solar-yellow-light, #FFFDF4);
		padding: 1.5rem;
		border-radius: 16px;
		border: 1px solid rgba(255, 209, 102, 0.3);
		margin-bottom: 2.5rem;
	}

	.score-meta {
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin-bottom: 0.75rem;
	}

	.score-value {
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.score-bar-bg {
		height: 14px;
		background: #e5e7eb;
		border-radius: 99px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.score-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-solar-green-medium, #3d8f68) 0%, var(--color-solar-green-dark, #1e4533) 100%);
		border-radius: 99px;
		transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.qualification-badge-wrapper {
		display: flex;
		justify-content: center;
	}

	.qualification-badge-wrapper .badge {
		padding: 0.5rem 1.25rem;
		border-radius: 99px;
		font-weight: 800;
		font-size: 0.85rem;
	}

	.qualification-badge-wrapper .badge.gold {
		background: #FEF3C7;
		color: #92400E;
		border: 1.5px solid #F59E0B;
	}

	.qualification-badge-wrapper .badge.silver {
		background: #F3F4F6;
		color: #374151;
		border: 1.5px solid #9CA3AF;
	}

	.qualification-badge-wrapper .badge.bronze {
		background: #EFF6FF;
		color: #1E40AF;
		border: 1.5px solid #3B82F6;
	}

	.feedback-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		text-align: left;
	}

	@media (max-width: 768px) {
		.feedback-grid {
			grid-template-columns: 1fr;
		}
	}

	.feedback-card {
		background: rgba(250, 249, 246, 0.6);
		border: 1px solid var(--color-solar-card-border, #e5e7eb);
		padding: 1.5rem;
		border-radius: 18px;
	}

	.feedback-card h5 {
		font-family: var(--font-solar-header), sans-serif;
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 1rem 0;
	}

	.concept-item {
		font-size: 0.82rem;
		line-height: 1.5;
		margin-bottom: 1rem;
		color: var(--color-solar-text, #374151);
	}

	.concept-item:last-child {
		margin-bottom: 0;
	}

	.analytics-sub {
		font-size: 0.82rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin-bottom: 1rem;
	}

	.errors-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.error-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error-group-title {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-solar-green-dark, #1e4533);
		letter-spacing: 0.05em;
	}

	.error-stat-bar-row {
		display: grid;
		grid-template-columns: 100px 1fr 60px;
		align-items: center;
		gap: 0.5rem;
	}

	.error-stat-bar-row .stat-lbl {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-solar-text, #374151);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.error-stat-bar-row .stat-bar-container {
		height: 8px;
		background: #f3f4f6;
		border-radius: 99px;
		overflow: hidden;
	}

	.error-stat-bar-row .error-fill {
		height: 100%;
		background: var(--color-solar-terracotta, #e11d48);
		border-radius: 99px;
	}

	.error-stat-bar-row .stat-val-count {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-solar-terracotta, #e11d48);
		text-align: right;
	}
</style>
