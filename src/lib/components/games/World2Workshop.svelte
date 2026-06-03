<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { workshopCards, type GFRCard } from '$lib/content/gfrCards';
	import confetti from 'canvas-confetti';

	function generateRandomOrder(length: number): number[] {
		const arr = Array.from({ length }, (_, i) => i);
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	let { 
		player, 
		instance, 
		onComplete 
	}: { 
		player: any; 
		instance: any; 
		onComplete: () => void 
	} = $props();

	// Host check
	const isHost = $derived(player.email === 'javier@f2p.co');

	// Real-time synchronization
	let currentRound = $state(0); // 0 to 11
	let activeMode = $state<'actividad' | 'feedback'>('actividad'); // 'actividad' = voting, 'feedback' = explanation
	let channel: any = null;
	let onlinePlayers = $state<any[]>([]);
	let allClassPlayers = $state<any[]>([]);

	// Student selection state for current round
	let selectedCol = $state<'meta' | 'retroalimentacion' | 'recompensa' | null>(null);
	let selectedRow = $state<'regulatorio' | 'integrado' | 'intrinseco' | null>(null);
	let hasVotedThisRound = $state(false);
	let lastSelectTime = 0;

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
		if (!supabase) return;
		const { data: players } = await supabase
			.from('course_players')
			.select('id, alias, game_state')
			.eq('instance_code', instance.code);
		if (players) {
			allClassPlayers = players;
		}
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
		loadAllClassPlayers();

		const existingState = player.game_state?.[2] || {};
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

		if (supabase) {
			const channelId = `workshop_session_omie_w2_${instance.code}`;
			channel = supabase.channel(channelId, {
				config: { presence: { key: player.id } }
			});

			channel.on('broadcast', { event: 'round-sync' }, async (payload: any) => {
				const data = payload.payload;
				currentRound = data.roundIndex;
				activeMode = data.mode;
				if (data.cardOrder) {
					cardOrder = data.cardOrder;
				}
				
				const savedState = player.game_state?.[2]?.workshop_completed_rounds?.[currentRound];
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
				await loadAllClassPlayers();
			});

			channel.on('broadcast', { event: 'student-vote' }, async (payload: any) => {
				const vote = payload.payload;
				classVotes = {
					...classVotes,
					[vote.playerId]: { col: vote.col, row: vote.row, alias: vote.alias }
				};
				await loadAllClassPlayers();
			});

			channel.on('broadcast', { event: 'workshop-complete' }, () => {
				onComplete();
			});

			channel.on('broadcast', { event: 'workshop-reset' }, (payload: any) => {
				personalScore = 0;
				selectedCol = null;
				selectedRow = null;
				hasVotedThisRound = false;
				classVotes = {};
				currentRound = 0;
				activeMode = 'actividad';
				allClassPlayers = [];
				if (payload?.payload?.cardOrder) {
					cardOrder = payload.payload.cardOrder;
				}
				if (player.game_state) {
					delete player.game_state['2'];
					delete player.game_state[2];
				}
			});

			channel.on('presence', { event: 'sync' }, () => {
				const state = channel.presenceState();
				const list: any[] = [];
				Object.keys(state).forEach((key) => {
					const user = state[key][0];
					if (user) list.push(user);
				});
				onlinePlayers = list;
			});

			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await channel.track({
						playerId: player.id,
						name: player.name,
						alias: player.alias,
						email: player.email
					});

					const { data: inst } = await supabase
						.from('course_instances')
						.select('current_workshop_state')
						.eq('code', instance.code)
						.single();

					if (inst?.current_workshop_state && inst.current_workshop_state.world_id === 2) {
						currentRound = inst.current_workshop_state.round_index ?? 0;
						activeMode = inst.current_workshop_state.mode ?? 'actividad';
						if (inst.current_workshop_state.card_order) {
							cardOrder = inst.current_workshop_state.card_order;
						} else if (isHost) {
							const newOrder = generateRandomOrder(workshopCards.length);
							cardOrder = newOrder;
							await supabase
								.from('course_instances')
								.update({
									current_workshop_state: {
										...inst.current_workshop_state,
										card_order: newOrder
									}
								})
								.eq('code', instance.code);
						}
						
						const savedState = player.game_state?.[2]?.workshop_completed_rounds?.[currentRound];
						if (savedState) {
							selectedCol = savedState.col;
							selectedRow = savedState.row;
							hasVotedThisRound = true;
						}
						await loadClassVotes(currentRound);
					} else {
						await loadClassVotes(0);
					}
				}
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
					loadAllClassPlayers();
					if (payload.new && payload.new.id === player.id) {
						player.game_state = payload.new.game_state;
						player.coins = payload.new.coins;
						player.avatar = payload.new.avatar;

						const pState = player.game_state?.[2] || {};
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

			return () => {
				supabase.removeChannel(channel);
				supabase.removeChannel(playersChannel);
			};
		}
	});

	// Host broadcast sync triggers
	async function changeRound(index: number, mode: 'actividad' | 'feedback') {
		const isNewRound = index !== currentRound;
		currentRound = index;
		activeMode = mode;
		if (isNewRound || mode === 'actividad') {
			classVotes = {};
		}
		
		if (isHost) {
			const state = player.game_state ? JSON.parse(JSON.stringify(player.game_state)) : {};
			if (!state[2]) state[2] = {};
			state[2].workshop_team_points = teamScore;
			player.game_state = state;
			
			await supabase
				.from('course_players')
				.update({ game_state: state })
				.eq('id', player.id);
		}
		
		if (channel) {
			await channel.send({
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

		const payloadData = {
			playerId: player.id,
			alias: player.alias,
			col: selectedCol,
			row: selectedRow,
			round: currentRound
		};

		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'student-vote',
				payload: payloadData
			});
		}

		classVotes = {
			...classVotes,
			[player.id]: { col: selectedCol, row: selectedRow, alias: player.alias }
		};

		// Calculate scores
		const isColCorrect = selectedCol === activeCard.gfr;
		const isRowCorrect = selectedRow === activeCard.rii;
		let pointsEarned = 0;
		if (isColCorrect && isRowCorrect) pointsEarned = 2;
		else if (isColCorrect || isRowCorrect) pointsEarned = 1;

		personalScore += pointsEarned;

		// Persist round results in player game_state
		const state = player.game_state ? JSON.parse(JSON.stringify(player.game_state)) : {};
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
		player.game_state = state;

		await supabase
			.from('course_players')
			.update({ game_state: state })
			.eq('id', player.id);
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
			total += getCourseScoreForRound(i, allClassPlayers);
		}
		return total;
	});

	// Classroom aggregate performance score (for super_user/host display)
	const totalClassroomPerformanceScore = $derived.by(() => {
		let total = 0;
		allClassPlayers.forEach(p => {
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
				confetti({
					particleCount: 120,
					spread: 80,
					origin: { y: 0.6 }
				});
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

			if (channel) {
				await channel.send({
					type: 'broadcast',
					event: 'workshop-reset',
					payload: { cardOrder: newOrder }
				});
			}

			await changeRound(0, 'actividad');
		}
	}

	async function finalizeWorkshop() {
		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'workshop-complete',
				payload: {}
			});
		}

		const state = player.game_state ? JSON.parse(JSON.stringify(player.game_state)) : {};
		if (!state[2]) state[2] = {};
		state[2].workshop_completed = true;
		state[2].workshop_team_points = teamScore; // Make sure host saves final teamScore
		player.game_state = state;

		await supabase
			.from('course_players')
			.update({ 
				game_state: state,
				coins: player.coins + 5
			})
			.eq('id', player.id);

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
</script>

<div class="workshop-container">
	{#if isHost}
		<!-- Host controller banner -->
		<div class="host-controls-banner">
			<div class="host-title">
				<span>👑 MENTOR ORQUESTADOR (JAVIER)</span>
			</div>
			
			<div class="host-actions-row">
				<div class="host-buttons-group">
					<button type="button" class="btn-solar-danger btn-sm" onclick={handleResetWorkshop}>
						🔄 Reiniciar
					</button>

					<button 
						type="button" 
						class="btn-solar-secondary btn-sm"
						disabled={currentRound === 0}
						onclick={() => changeRound(currentRound - 1, 'actividad')}
					>
						◀ Anterior
					</button>

					{#if activeMode === 'actividad'}
						<button 
							type="button" 
							class="btn-solar-accent btn-sm animate-solar-pulse font-bold"
							onclick={() => changeRound(currentRound, 'feedback')}
						>
							📢 Revelar Votación y Activar Feedback
						</button>
					{:else}
						<button 
							type="button" 
							class="btn-solar-secondary btn-sm font-bold"
							onclick={() => changeRound(currentRound, 'actividad')}
						>
							✏️ Reabrir Votación
						</button>
					{/if}
					
					{#if currentRound < 11}
						<button 
							type="button" 
							class="btn-solar-primary btn-sm font-bold"
							onclick={() => changeRound(currentRound + 1, 'actividad')}
						>
							Siguiente Ronda ▶
						</button>
					{:else}
						<button 
							type="button" 
							class="btn-solar-primary btn-sm font-bold"
							onclick={finalizeWorkshop}
						>
							✓ Finalizar Taller (+5 BEM Coins)
						</button>
					{/if}
				</div>

				<div class="presence-tag">
					🟢 Conectados: <strong>{onlinePlayers.length}</strong> | Votos: <strong>{Object.keys(classVotes).length}</strong> | Puntaje Salón: <strong>{teamScore} pts</strong>
				</div>
			</div>
		</div>
	{/if}

	<!-- Rounds Tracker -->
	<header class="rounds-tracker">
		<div class="tracker-left">
			<span class="m-badge">Ronda {currentRound + 1} de 12</span>
			<h4>GFR Live Board</h4>
		</div>
		<div class="tracker-right">
			<div class="score-pill personal">
				{#if isHost}
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
													{@const courseScore = roundIdx !== undefined ? getCourseScoreForRound(roundIdx, allClassPlayers) : 0}
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
													<div class="cell-votes-bubble" in:fade>
														🗳️ {votesForThisCell.length}
													</div>
												{/if}
											{/if}

											<!-- Selection overlay button -->
											{#if !isHost && !hasVotedThisRound && activeMode === 'actividad'}
												<button 
													type="button" 
													class="select-cell-btn" 
													class:confirm-btn={isSelected}
													class:animate-solar-pulse={isSelected}
													onclick={() => {
														const now = Date.now();
														if (isSelected) {
															if (now - lastSelectTime > 300) {
																submitVote();
															}
														} else {
															selectedRow = r;
															selectedCol = c;
															lastSelectTime = now;
														}
													}}
												>
													{isSelected ? 'Confirmar 🗳️' : 'Elegir'}
												</button>
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
				<img src="/learn_resoruces/characters/char_kira.png" alt="Kira" class="mentor-avatar" />
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

					{#if activeMode === 'actividad'}
						{#if !isHost}
							{#if hasVotedThisRound}
								<div class="waiting-box" in:fade>
									<span class="waiting-icon">⏳</span>
									<h5 class="waiting-title">Voto Registrado</h5>
									<p class="waiting-subtitle">Ubicado en <strong>{rowLabels[selectedRow!] || ''} - {colLabels[selectedCol!] || ''}</strong>. Espera la revelación del mentor.</p>
								</div>
							{:else}
								<div class="voting-actions">
									{#if selectedCol && selectedRow}
										<p class="selected-text">
											Ubicación elegida:<br/>
											<strong class="selected-highlight">{rowLabels[selectedRow]} • {colLabels[selectedCol]}</strong>
										</p>
										<p class="helper-text-select-confirm">Toca "Confirmar 🗳️" en la celda seleccionada para enviar tu voto.</p>
									{:else}
										<p class="helper-text-select">Selecciona una celda en la matriz para colocar la tarjeta.</p>
									{/if}
								</div>
							{/if}
						{/if}
					{:else}
						<!-- Feedback Explanation Mode -->
						<div class="explanation-box" class:correct={!isHost && selectedCol === activeCard.gfr && selectedRow === activeCard.rii} class:wrong={!isHost && (selectedCol !== activeCard.gfr || selectedRow !== activeCard.rii)}>
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
</style>
