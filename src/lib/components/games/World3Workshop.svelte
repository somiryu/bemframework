<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import FacilitatorControlPanel from '$lib/components/workshop/FacilitatorControlPanel.svelte';
	import GameUIWrapper from '$lib/components/workshop/GameUIWrapper.svelte';

	let { 
		player, 
		instance, 
		onComplete 
	}: { 
		player: any; 
		instance: any; 
		onComplete: () => void 
	} = $props();

	// Initialize session
	const session = createWorkshopSession(player, instance, 3, onComplete);

	// Phase state: 1 = Submission, 2 = Classification (Voting), 3 = Feedback (Host mapping), 4 = Final feedback
	let activePhase = $state<1 | 2 | 3 | 4>(1);
	let roundIndex = $state(1);
	
	// Class state
	let submittedIdeas = $state<{ id: string; text: string; studentId: string; studentAlias: string }[]>([]);
	let studentVoteMap = $state<Record<string, Record<string, number>>>({}); // studentId -> { ideaId: slotNum (1-6, or 0 for Ninguna) }
	let mentorAssignments = $state<Record<string, number>>({}); // ideaId -> slotNum
	let timer = $state(30);
	let timerInterval = $state<any>(null);
	let collectiveScore = $state(0);

	interface RoundData {
		round: number;
		ideas: { id: string; text: string; studentId: string; studentAlias: string }[];
		votes: Record<string, Record<string, number>>;
		mentorAssignments: Record<string, number>;
		score: number;
	}
	let roundHistory = $state<RoundData[]>([]);

	// Local input
	let localIdeaText = $state('');
	let localVotes = $state<Record<string, number>>({}); // ideaId -> slotIndex
	let selectedIdeaForClassification = $state<string | null>(null);
	let canSubmitMultipleIdeas = $derived(session.onlinePlayers.length < 5);
	let hasSubmittedLocalIdea = $derived(
		canSubmitMultipleIdeas
			? false
			: submittedIdeas.some(i => i.studentId === session.player.id)
	);

	// Derived counts
	const submittedCount = $derived(
		activePhase === 1 
			? submittedIdeas.length 
			: Object.keys(studentVoteMap).length
	);

	// Internal slot titles (not visible to students, only shown to mentor / reveal)
	const slotInfo = [
		{ index: 1, name: 'Meta' },
		{ index: 2, name: 'Llamado a la acción / estímulo' },
		{ index: 3, name: 'Evaluación cognitiva' },
		{ index: 4, name: 'Acción disparadora' },
		{ index: 5, name: 'Evaluación del juego' },
		{ index: 6, name: 'Retroalimentación y cambio de estado' }
	];

	onMount(() => {
		session.loadAllClassPlayers();

		session.initConnection(async (event, payload) => {
			if (event === 'phase-change') {
				activePhase = payload.phase;
				roundIndex = payload.round;
				submittedIdeas = payload.ideas || [];
				studentVoteMap = payload.votes || {};
				mentorAssignments = payload.mentorAssignments || {};
				collectiveScore = payload.score || 0;
				roundHistory = payload.rounds || [];
				
				if (activePhase === 2) {
					startLocalTimer(payload.timeLeft || 30);
				} else {
					stopTimer();
				}
			} else if (event === 'idea-submitted') {
				submittedIdeas = [...submittedIdeas, payload.idea];
				if (submittedIdeas.length >= 5 && session.isHost && activePhase === 1) {
					changePhase(2);
				}
			} else if (event === 'vote-cast') {
				studentVoteMap = {
					...studentVoteMap,
					[payload.studentId]: payload.votes
				};
			} else if (event === 'mentor-assigned') {
				mentorAssignments = {
					...mentorAssignments,
					[payload.ideaId]: payload.slot
				};
				collectiveScore = payload.score;
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
					if (!state[3]) state[3] = {};
					state[3].workshop_completed = true;
					state[3].workshop_score = collectiveScore;
					
					await session.updatePlayerGameState(state, {
						coins: session.player.coins + 25 // Award 25 coins for completing workshop
					});
				}
				onComplete();
			} else if (event === 'workshop-reset') {
				activePhase = 1;
				roundIndex = 1;
				submittedIdeas = [];
				studentVoteMap = {};
				mentorAssignments = {};
				collectiveScore = 0;
				roundHistory = [];
				localIdeaText = '';
				localVotes = {};
				stopTimer();
			}
		});

		// Fetch existing instance state if it exists
		if (supabase) {
			supabase
				.from('course_instances')
				.select('current_workshop_state')
				.eq('code', instance.code)
				.single()
				.then(({ data: inst }) => {
					if (inst?.current_workshop_state && inst.current_workshop_state.world_id === 3) {
						const state = inst.current_workshop_state;
						activePhase = state.phase || 1;
						roundIndex = state.round || 1;
						submittedIdeas = state.ideas || [];
						studentVoteMap = state.votes || {};
						mentorAssignments = state.mentorAssignments || {};
						collectiveScore = state.score || 0;
						roundHistory = state.rounds || [];
					}
				});
		}
	});

	onDestroy(() => {
		stopTimer();
	});

	function startLocalTimer(seconds: number) {
		stopTimer();
		timer = seconds;
		timerInterval = setInterval(() => {
			if (timer > 0) {
				timer--;
			} else {
				stopTimer();
			}
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	// Host logic to sync state
	async function changePhase(phaseNum: 1 | 2 | 3 | 4) {
		activePhase = phaseNum;
		if (phaseNum === 2) {
			startLocalTimer(30);
		} else {
			stopTimer();
		}

		const payload = {
			phase: activePhase,
			round: roundIndex,
			ideas: submittedIdeas,
			votes: studentVoteMap,
			mentorAssignments,
			score: collectiveScore,
			timeLeft: phaseNum === 2 ? 30 : null,
			rounds: roundHistory
		};

		await saveWorkshopState();

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'phase-change',
				payload
			});
		}
	}

	async function saveWorkshopState() {
		await supabase
			.from('course_instances')
			.update({
				current_workshop_state: {
					world_id: 3,
					phase: activePhase,
					round: roundIndex,
					ideas: submittedIdeas,
					votes: studentVoteMap,
					mentorAssignments,
					score: collectiveScore,
					timeLeft: activePhase === 2 ? timer : null,
					rounds: roundHistory
				}
			})
			.eq('code', instance.code);
	}

	// Student submitting ideas
	async function submitIdea() {
		if (!localIdeaText.trim()) return;
		const idea = {
			id: 'idea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
			text: localIdeaText.trim(),
			studentId: session.player.id,
			studentAlias: session.player.alias
		};

		localIdeaText = '';

		submittedIdeas = [...submittedIdeas, idea];
		await saveWorkshopState();

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'idea-submitted',
				payload: { idea }
			});
		}

		// Check auto-advance if we hit 5 ideas
		if (submittedIdeas.length >= 5 && session.isHost && activePhase === 1) {
			changePhase(2);
		}
	}

	// Student casting votes
	async function voteIdeaSlot(ideaId: string, slotIndex: number) {
		localVotes = {
			...localVotes,
			[ideaId]: slotIndex
		};

		studentVoteMap = {
			...studentVoteMap,
			[session.player.id]: localVotes
		};
		await saveWorkshopState();

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'vote-cast',
				payload: {
					studentId: session.player.id,
					votes: localVotes
				}
			});
		}
	}

	// Host assigns correct slot, calculating score
	async function assignMentorSlot(ideaId: string, slotIndex: number) {
		mentorAssignments = {
			...mentorAssignments,
			[ideaId]: slotIndex
		};

		// Re-calculate class collective score
		// Carry over cumulative score from completed rounds
		let newScore = roundHistory.length > 0 ? roundHistory[roundHistory.length - 1].score : 0;
		// Add current round's correct matches
		Object.keys(studentVoteMap).forEach((studId) => {
			const studVotes = studentVoteMap[studId] || {};
			Object.keys(mentorAssignments).forEach((idId) => {
				const assignedSlot = mentorAssignments[idId];
				if (studVotes[idId] === assignedSlot) {
					newScore++;
				}
			});
		});

		collectiveScore = newScore;

		await saveWorkshopState();

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'mentor-assigned',
				payload: {
					ideaId,
					slot: slotIndex,
					score: collectiveScore
				}
			});
		}
	}

	async function nextRound() {
		const archivedRound: RoundData = {
			round: roundIndex,
			ideas: [...submittedIdeas],
			votes: JSON.parse(JSON.stringify(studentVoteMap)),
			mentorAssignments: { ...mentorAssignments },
			score: collectiveScore
		};
		roundHistory = [...roundHistory, archivedRound];

		submittedIdeas = [];
		studentVoteMap = {};
		mentorAssignments = {};
		localVotes = {};
		selectedIdeaForClassification = null;
		roundIndex++;
		await changePhase(1);
	}

	async function handleResetWorkshop() {
		if (confirm('¿Estás seguro de reiniciar el taller del Mundo 3? Se borrarán todas las respuestas.')) {
			// Clear all students game_state world 3 data
			const { data: players } = await supabase
				.from('course_players')
				.select('id, game_state')
				.eq('instance_code', instance.code);

			if (players) {
				for (const p of players) {
					const newState = p.game_state || {};
					delete newState[3];
					await supabase
						.from('course_players')
						.update({ game_state: newState })
						.eq('id', p.id);
				}
			}

			if (session.channel) {
				await session.channel.send({
					type: 'broadcast',
					event: 'workshop-reset',
					payload: {}
				});
			}

			activePhase = 1;
			roundIndex = 1;
			submittedIdeas = [];
			studentVoteMap = {};
			mentorAssignments = {};
			collectiveScore = 0;
			roundHistory = [];
			localIdeaText = '';
			localVotes = {};
			stopTimer();

			await saveWorkshopState();
		}
	}

	async function finalizeWorkshop() {
		const archivedRound: RoundData = {
			round: roundIndex,
			ideas: [...submittedIdeas],
			votes: JSON.parse(JSON.stringify(studentVoteMap)),
			mentorAssignments: { ...mentorAssignments },
			score: collectiveScore
		};
		roundHistory = [...roundHistory, archivedRound];
		await saveWorkshopState();

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'workshop-complete',
				payload: {}
			});
		}

		// Save completed state for host
		const state = session.player.game_state || {};
		if (!state[3]) state[3] = {};
		state[3].workshop_completed = true;
		state[3].workshop_score = collectiveScore;
		await session.updatePlayerGameState(state);

		onComplete();
	}

	// Helper to count votes for a slot and an idea
	function getVotesForIdeaSlot(ideaId: string, slotNum: number): number {
		let count = 0;
		Object.values(studentVoteMap).forEach((vMap: any) => {
			if (vMap[ideaId] === slotNum) {
				count++;
			}
		});
		return count;
	}

	function getTotalVotesForSlot(slotNum: number): number {
		let total = 0;
		Object.values(studentVoteMap).forEach((vMap: any) => {
			Object.values(vMap as Record<string, number>).forEach((voteSlot) => {
				if (voteSlot === slotNum) total++;
			});
		});
		return total;
	}
</script>

<div class="workshop-container">
	<!-- Facilitator Controls Bar -->
	<FacilitatorControlPanel
		isHost={session.isHost}
		onlineCount={session.onlinePlayers.length}
		submittedCount={submittedCount}
		isFirstStep={activePhase === 1}
		isLastStep={activePhase === 4}
		activeMode={activePhase === 3 || activePhase === 4 ? 'feedback' : 'actividad'}
		onReset={handleResetWorkshop}
		onPrev={() => changePhase((activePhase - 1) as any)}
		onNext={() => changePhase((activePhase + 1) as any)}
		onToggleMode={() => {}}
		onComplete={finalizeWorkshop}
		coinsLabel="+25 BEM Coins"
		stepLabel="Fase"
	>
		{#if activePhase === 1}
			<button
				type="button"
				class="btn-solar-accent btn-sm font-bold animate-solar-pulse"
				onclick={() => changePhase(2)}
			>
				📢 Cambiar a fase de votación
			</button>
		{/if}
	</FacilitatorControlPanel>

	<GameUIWrapper maxWidth="1200px">
		<!-- Rounds Tracker Header -->
		<header class="rounds-tracker">
			<div class="tracker-left">
				<span class="m-badge">⚙️ MUNDO 3 · WORKSHOP</span>
				<span class="round-label">Ronda {roundIndex}</span>
				<span class="phase-label">
					{#if activePhase === 1}
						📥 Recolección de Ideas ({submittedIdeas.length}/5)
					{:else if activePhase === 2}
						⏱️ Votación en Progreso — {timer}s
						{#if timer === 0}
							<span class="timer-expired-label">(Tiempo agotado)</span>
						{/if}
					{:else if activePhase === 3}
						🔍 Asignación y Retroalimentación
					{:else}
						📢 Retroalimentación Final
					{/if}
				</span>
			</div>
			<div class="score-pill team">🎯 Puntaje Clase: {collectiveScore} pts</div>
		</header>

		<!-- Mentor Card (small, like World 2) -->
		<div class="mentor-card glass-card">
			<img src="/learn_resoruces/characters/char_wilkins.png" alt="Wilkins" class="mentor-avatar" />
			<div class="mentor-info">
				<h5 class="mentor-name">Mentor John Wilkins</h5>
				<p class="mentor-bubble-text">
					{#if activePhase === 1}
						Mis estimados agentes, envíen ideas de actividades de clase a la Caja. Necesitamos exactamente 5 engranajes para armar el ciclo de interactividad.
					{:else if activePhase === 2}
						¡Tiempo de clasificar! Seleccionen cada idea de la izquierda y ubíquenla en la casilla del ciclo que crean correcta. Tienen {timer} segundos.
					{:else if activePhase === 3}
						Veamos cómo encaja cada engranaje en la relojería educativa. Voy a revelar la ubicación correcta de cada idea.
					{:else}
						Observen el tablero completo con los nombres de cada etapa del ciclo de interactividad. ¡Excelente trabajo, agentes!
					{/if}
				</p>
			</div>
		</div>

		<!-- Two-Column Workspace Layout -->
		<div class="clockwork-workspace-layout">

			<!-- LEFT: IDEAS BOX -->
			<div class="ideas-panel">
				<div class="ideas-card glass-card">
					<div class="ideas-header">
						<h4 class="ideas-title">📥 Caja de Ideas</h4>
						<span class="badge-count">{submittedIdeas.length}/5</span>
					</div>

				<p class="ideas-desc">
					{#if activePhase === 1}
						Escriban frases/ideas de actividades de clase. Máximo 5 totales.
					{:else if activePhase === 2}
						Haz clic en una idea y clasifícala en una de las 6 casillas.
					{:else if activePhase === 3}
						El mentor Wilkins está mapeando el ciclo real de estas ideas.
					{:else}
						Revisión final del ciclo completo de interactividad.
					{/if}
				</p>

					<!-- Submission Form for Students -->
					{#if activePhase === 1 && !session.isHost}
						{#if hasSubmittedLocalIdea}
							<div class="status-msg status-success">
								✓ Ya enviaste tu propuesta para esta ronda
							</div>
						{:else if submittedIdeas.length >= 5}
							<div class="status-msg status-locked">
								🔒 Caja llena. Esperando votación.
							</div>
						{:else}
							<div class="submit-idea-box">
								<input 
									type="text" 
									placeholder="Agrega una Idea" 
									class="idea-input"
									bind:value={localIdeaText}
									maxlength="100"
								/>
								<button 
									type="button" 
									class="btn-solar-primary btn-submit-idea"
									disabled={!localIdeaText.trim()}
									onclick={submitIdea}
								>
									Enviar a la Caja 📤
								</button>
							</div>
						{/if}
					{/if}

					<!-- Ideas List -->
					<div class="ideas-scroll">
						{#if submittedIdeas.length === 0}
							<div class="empty-ideas-state">
								Caja vacía. Esperando propuestas...
							</div>
						{:else}
							{#each submittedIdeas as idea}
								{@const hasVotedThis = localVotes[idea.id] !== undefined}
								{@const mentorAssignedVal = mentorAssignments[idea.id]}
								
								<button 
									type="button"
									class="idea-item-card"
									class:active-sel={selectedIdeaForClassification === idea.id}
									class:greyed-out={activePhase === 2 && hasVotedThis}
									onclick={() => {
										if (activePhase === 2 && !session.isHost) {
											selectedIdeaForClassification = idea.id;
										} else if (activePhase === 3) {
											selectedIdeaForClassification = idea.id;
										}
									}}
								>
									<span class="idea-author">Propuesta por {idea.studentAlias}</span>
									<p class="idea-text">"{idea.text}"</p>

									{#if activePhase === 2 && hasVotedThis}
										<div class="voted-tag">
											Casilla {localVotes[idea.id] === 0 ? 'Ninguna' : localVotes[idea.id]} ✓
										</div>
									{/if}

									{#if activePhase === 3 && mentorAssignedVal !== undefined}
										<div class="voted-tag mentor-tag">
											Ubicada en: {mentorAssignedVal === 0 ? 'Ninguna' : 'Etapa ' + mentorAssignedVal}
										</div>
									{/if}
								</button>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- RIGHT: CLOCKWORK SLOTS GRID -->
			<div class="slots-panel">
				<div class="slots-card glass-card">
					<div class="slots-header">
						<h4 class="slots-title">⚙️ Ciclo de Interactividad</h4>
						<p class="slots-desc">
							{#if activePhase === 1}
								Esperando que la Caja de Ideas se llene de engranajes...
							{:else if activePhase === 2}
								Selecciona una idea a la izquierda y presiona una casilla aquí.
							{:else if activePhase === 3}
								Revisa cómo encaja cada engranaje en la relojería educativa.
							{:else}
								Estos son los nombres reales de cada etapa del ciclo de interactividad.
							{/if}
						</p>
					</div>

					<!-- 6 Slot Grid (3 columns × 2 rows) -->
					<div class="slots-grid">
						{#each slotInfo as slot}
							{@const isSelectedIdea = selectedIdeaForClassification !== null}
							{@const voteCountOnThis = selectedIdeaForClassification ? getVotesForIdeaSlot(selectedIdeaForClassification, slot.index) : 0}
							{@const totalSlotVotes = getTotalVotesForSlot(slot.index)}
							{@const isClassifiedByMentor = Object.values(mentorAssignments).includes(slot.index)}
							{@const assignedIdeas = submittedIdeas.filter(i => mentorAssignments[i.id] === slot.index)}
							{@const historicalAssignedIdeas = roundHistory.flatMap(r =>
								r.ideas
									.filter(i => r.mentorAssignments[i.id] === slot.index)
									.map(i => ({ ...i, round: r.round }))
							)}
							
							<button 
								type="button"
								class="slot-card"
								class:slot-glow={activePhase === 2 && isSelectedIdea && localVotes[selectedIdeaForClassification ?? ''] === undefined}
								class:slot-assigned={activePhase === 3 && assignedIdeas.length > 0}
								onclick={() => {
									if (activePhase === 2 && selectedIdeaForClassification) {
										voteIdeaSlot(selectedIdeaForClassification, slot.index);
									} else if (activePhase === 3 && session.isHost && selectedIdeaForClassification) {
										assignMentorSlot(selectedIdeaForClassification, slot.index);
									}
								}}
							>
								<span class="slot-number">{slot.index}</span>
							{#if activePhase === 4}
								<span class="slot-concept">{slot.name}</span>
							{:else}
								<span class="slot-mystery">?</span>
							{/if}

								{#if activePhase >= 2}
									<div class="vote-badges-corner">
										{#if isSelectedIdea}
											<span class="vote-badge vote-badge-idea" in:scale title="Votos para esta idea">
												{voteCountOnThis}
											</span>
										{/if}
										<span class="vote-badge vote-badge-total" in:scale title="Total de votos en esta casilla">
											{totalSlotVotes}
										</span>
									</div>
								{/if}

								{#if historicalAssignedIdeas.length > 0}
									<div class="slot-assigned-ideas">
										<div class="slot-history-label">Rondas anteriores</div>
										{#each historicalAssignedIdeas as ha}
											<div class="assigned-idea-chip history">
												<span class="assigned-round-badge">R{ha.round}</span>
												<span class="assigned-idea-text">"{ha.text}"</span>
												<span class="assigned-idea-author">— {ha.studentAlias}</span>
											</div>
										{/each}
									</div>
								{/if}

								{#if activePhase === 3 && assignedIdeas.length > 0}
									<div class="slot-assigned-ideas">
										<div class="slot-current-label">Ronda actual</div>
										{#each assignedIdeas as aidea}
											<div class="assigned-idea-chip">
												<span class="assigned-idea-text">"{aidea.text}"</span>
												<span class="assigned-idea-author">— {aidea.studentAlias}</span>
											</div>
										{/each}
									</div>
								{/if}
							</button>
						{/each}
					</div>

					<!-- None Option -->
					{#if activePhase >= 2}
						{@const voteCountNone = selectedIdeaForClassification ? getVotesForIdeaSlot(selectedIdeaForClassification, 0) : 0}
						{@const totalVotesNone = getTotalVotesForSlot(0)}
						<div class="none-option-box">
							<div class="none-option-info">
								<h5 class="none-title">Opción: Ninguna casilla</h5>
								<p class="none-desc">Si la idea no aplica a ninguna etapa del ciclo.</p>
								<span class="none-total-votes">Total: {totalVotesNone} votos</span>
							</div>

							<button 
								type="button" 
								class="btn-solar-secondary btn-none"
								onclick={() => {
									if (activePhase === 2 && selectedIdeaForClassification) {
										voteIdeaSlot(selectedIdeaForClassification, 0);
									} else if (activePhase === 3 && session.isHost && selectedIdeaForClassification) {
										assignMentorSlot(selectedIdeaForClassification, 0);
									}
								}}
							>
								🚫 Ninguna

								{#if selectedIdeaForClassification}
									<span class="vote-count-badge-inline">{voteCountNone}</span>
								{/if}
							</button>
						</div>
					{/if}

					{#if activePhase === 2 && timer === 0 && session.isHost}
						<button 
							type="button" 
							class="btn-solar-accent btn-next-round font-bold animate-solar-pulse"
							onclick={() => changePhase(3)}
						>
							📢 Activar Fase de Retroalimentación
						</button>
					{/if}

					<!-- Round advancement controls for Host in Phase 3 -->
					{#if activePhase === 3 && session.isHost}
						<button 
							type="button" 
							class="btn-solar-primary btn-next-round"
							onclick={nextRound}
						>
							🔄 Cambiar de Ronda (Reiniciar Tablero)
						</button>
						<button 
							type="button" 
							class="btn-solar-accent btn-next-round font-bold animate-solar-pulse"
							onclick={() => changePhase(4)}
						>
							📢 Retroalimentación Final
						</button>
					{/if}
				</div>
			</div>

		</div>
	</GameUIWrapper>
</div>

<style>
	/* ========================================
	   WORKSHOP CONTAINER
	   ======================================== */
	.workshop-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
	}

	/* ========================================
	   ROUNDS TRACKER HEADER
	   ======================================== */
	.rounds-tracker {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 16px;
		padding: 1rem 1.5rem;
		margin-bottom: 1.25rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.tracker-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.m-badge {
		font-size: 0.65rem;
		font-weight: 800;
		background: var(--color-solar-sky-light, #e0f2fe);
		color: var(--color-solar-sky, #0ea5e9);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.04em;
	}

	.round-label {
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.phase-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-solar-text-muted, #6b7280);
	}

	.timer-expired-label {
		color: var(--color-solar-terracotta, #e11d48);
		font-weight: 800;
		margin-left: 0.3rem;
	}

	.score-pill {
		font-size: 0.85rem;
		font-weight: 750;
		padding: 0.45rem 1rem;
		border-radius: 10px;
	}

	.score-pill.team {
		background: #e0f2fe;
		color: #0369a1;
	}

	/* ========================================
	   MENTOR CARD (Small, like World 2)
	   ======================================== */
	.mentor-card {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 1rem 1.25rem;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 16px;
		box-shadow: var(--shadow-solar-sm);
		text-align: left;
		margin-bottom: 1.5rem;
	}

	.mentor-avatar {
		width: 48px;
		height: 48px;
		object-fit: contain;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid var(--color-solar-green-medium, #3d8f68);
		flex-shrink: 0;
	}

	.mentor-info {
		flex: 1;
		min-width: 0;
	}

	.mentor-name {
		font-weight: 800;
		font-size: 0.88rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.2rem 0;
	}

	.mentor-bubble-text {
		font-size: 0.82rem;
		line-height: 1.4;
		color: #4b5563;
		margin: 0;
		font-style: italic;
	}

	/* ========================================
	   TWO-COLUMN WORKSPACE LAYOUT
	   ======================================== */
	.clockwork-workspace-layout {
		display: grid;
		grid-template-columns: 4fr 8fr;
		gap: 1.5rem;
		width: 100%;
		align-items: start;
	}

	@media (max-width: 1024px) {
		.clockwork-workspace-layout {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}
	}

	/* ========================================
	   LEFT: IDEAS PANEL
	   ======================================== */
	.ideas-card {
		padding: 1.5rem;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 20px;
		box-shadow: var(--shadow-solar-sm);
		display: flex;
		flex-direction: column;
		height: 100%;
		text-align: left;
	}

	.ideas-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.ideas-title {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0;
	}

	.badge-count {
		font-family: monospace;
		font-size: 0.75rem;
		font-weight: 800;
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		color: var(--color-solar-green-medium, #3d8f68);
		padding: 0.2rem 0.6rem;
		border-radius: 99px;
	}

	.ideas-desc {
		font-size: 0.78rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0 0 1rem 0;
		line-height: 1.4;
	}

	/* Status messages */
	.status-msg {
		padding: 0.75rem;
		border-radius: 10px;
		font-size: 0.78rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 1rem;
	}

	.status-success {
		background: rgba(61, 143, 104, 0.08);
		border: 1px solid rgba(61, 143, 104, 0.2);
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.status-locked {
		background: rgba(239, 68, 68, 0.06);
		border: 1px solid rgba(239, 68, 68, 0.15);
		color: var(--color-solar-terracotta, #e11d48);
	}

	/* Submit idea form */
	.submit-idea-box {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(61, 143, 104, 0.04);
		border: 1.5px dashed rgba(61, 143, 104, 0.25);
		border-radius: 12px;
		margin-bottom: 1rem;
	}

	.idea-input {
		width: 100%;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.82rem;
		padding: 0.6rem 0.75rem;
		border: 1.5px solid rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		outline: none;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
	}

	.idea-input:focus {
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.1);
	}

	.btn-submit-idea {
		font-size: 0.78rem;
		font-weight: 750;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		text-align: center;
	}

	/* Ideas scroll list */
	.ideas-scroll {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 380px;
		scrollbar-width: thin;
	}

	.empty-ideas-state {
		text-align: center;
		padding: 2rem 1rem;
		color: #9ca3af;
		font-size: 0.78rem;
		font-style: italic;
	}

	/* Idea Cards */
	.idea-item-card {
		background: rgba(255, 255, 255, 0.8);
		border: 1.5px solid rgba(0, 0, 0, 0.06);
		border-radius: 14px;
		padding: 0.85rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-solar-sm);
		position: relative;
	}

	.idea-item-card:hover {
		transform: translateY(-1px);
		border-color: var(--color-solar-sky, #0ea5e9);
		background: #ffffff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	.idea-item-card.active-sel {
		border-color: var(--color-solar-sky, #0ea5e9) !important;
		background: var(--color-solar-sky-light, #e0f2fe) !important;
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
	}

	.idea-item-card.greyed-out {
		opacity: 0.55;
		background: #f3f4f6;
		border-color: #e5e7eb;
	}

	.idea-author {
		display: block;
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0ea5e9);
		letter-spacing: 0.02em;
	}

	.idea-text {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-solar-text, #1f2937);
		margin: 0.25rem 0 0 0;
		line-height: 1.35;
	}

	.voted-tag {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
		font-size: 0.6rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3d8f68);
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
	}

	.voted-tag.mentor-tag {
		color: #ffffff;
		background: var(--color-solar-green-medium, #3d8f68);
	}

	/* ========================================
	   RIGHT: CLOCKWORK SLOTS PANEL
	   ======================================== */
	.slots-card {
		padding: 1.5rem;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 20px;
		box-shadow: var(--shadow-solar-sm);
		text-align: left;
	}

	.slots-header {
		margin-bottom: 1.25rem;
	}

	.slots-title {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 1.1rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.25rem 0;
	}

	.slots-desc {
		font-size: 0.78rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0;
		line-height: 1.4;
	}

	/* 3×2 Grid of Slot Cards */
	.slots-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	@media (max-width: 768px) {
		.slots-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.slot-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 1.25rem 0.75rem;
		background: rgba(249, 250, 251, 0.8);
		border: 2px solid #e5e7eb;
		border-radius: 16px;
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: var(--shadow-solar-sm);
		position: relative;
		min-height: 90px;
		text-align: center;
	}

	.slot-card:hover {
		background: #ffffff;
		border-color: var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}

	.slot-card.slot-glow {
		border: 2px dashed var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 12px rgba(61, 143, 104, 0.25);
		animation: pulse-glow-green 1.5s infinite;
	}

	.slot-card.slot-assigned {
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		border-color: var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		box-shadow: 0 0 14px rgba(61, 143, 104, 0.2);
	}

	.slot-number {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 900;
		font-size: 1.25rem;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1;
	}

	.slot-mystery {
		font-size: 0.85rem;
		font-weight: 600;
		color: #9ca3af;
	}

	.slot-concept {
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--color-solar-green-medium, #3d8f68);
		line-height: 1.2;
		max-width: 120px;
		text-align: center;
	}

	.vote-badges-corner {
		position: absolute;
		top: 0.35rem;
		right: 0.35rem;
		display: flex;
		gap: 0.2rem;
		z-index: 1;
	}

	.vote-badge {
		font-size: 0.6rem;
		font-weight: 900;
		padding: 0.1rem 0.35rem;
		border-radius: 99px;
		min-width: 1rem;
		text-align: center;
		line-height: 1.2;
	}

	.vote-badge-idea {
		background: var(--color-solar-sky, #0ea5e9);
		color: #ffffff;
		box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
	}

	.vote-badge-total {
		background: var(--color-solar-green-dark, #1e4533);
		color: #ffffff;
	}

	.slot-assigned-ideas {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.4rem;
		width: 100%;
	}

	.assigned-idea-chip {
		background: rgba(61, 143, 104, 0.1);
		border: 1px solid rgba(61, 143, 104, 0.2);
		border-radius: 6px;
		padding: 0.2rem 0.4rem;
		text-align: left;
	}

	.assigned-idea-text {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--color-solar-green-dark, #1e4533);
		display: block;
		line-height: 1.2;
		word-break: break-word;
	}

	.assigned-idea-author {
		font-size: 0.5rem;
		font-weight: 700;
		color: var(--color-solar-sky, #0ea5e9);
	}

	.slot-history-label,
	.slot-current-label {
		font-size: 0.5rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.1rem;
	}

	.slot-history-label {
		color: var(--color-solar-sky, #0ea5e9);
	}

	.slot-current-label {
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.assigned-idea-chip.history {
		background: rgba(14, 165, 233, 0.08);
		border-color: rgba(14, 165, 233, 0.2);
	}

	.assigned-round-badge {
		font-size: 0.45rem;
		font-weight: 800;
		background: var(--color-solar-sky, #0ea5e9);
		color: #ffffff;
		padding: 0.05rem 0.3rem;
		border-radius: 3px;
		margin-right: 0.2rem;
		display: inline-block;
	}

	/* None Option Box */
	.none-option-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.85rem 1.25rem;
		background: #f9fafb;
		border: 1.5px solid #e5e7eb;
		border-radius: 14px;
		margin-bottom: 1rem;
	}

	.none-title {
		font-weight: 750;
		font-size: 0.8rem;
		color: var(--color-solar-text, #1f2937);
		margin: 0;
	}

	.none-desc {
		font-size: 0.68rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0.15rem 0 0 0;
	}

	.none-total-votes {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-green-medium, #3d8f68);
		margin-top: 0.25rem;
		display: inline-block;
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		padding: 0.1rem 0.5rem;
		border-radius: 99px;
	}

	.btn-none {
		font-size: 0.78rem;
		font-weight: 800;
		padding: 0.45rem 0.85rem;
		border-radius: 10px;
		position: relative;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.vote-count-badge-inline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.6rem;
		font-weight: 900;
		background: var(--color-solar-sky, #0ea5e9);
		color: #ffffff;
		padding: 0.05rem 0.35rem;
		border-radius: 99px;
		min-width: 0.9rem;
		margin-left: 0.35rem;
	}

	/* Next round button */
	.btn-next-round {
		width: 100%;
		text-align: center;
		justify-content: center;
		font-weight: 750;
		font-size: 0.88rem;
		padding: 0.75rem 1.5rem;
		border-radius: 12px;
	}

	/* ========================================
	   ANIMATIONS
	   ======================================== */
	@keyframes pulse-glow-green {
		0%, 100% { box-shadow: 0 0 12px rgba(61, 143, 104, 0.25); }
		50% { box-shadow: 0 0 4px rgba(61, 143, 104, 0.08); }
	}
</style>

