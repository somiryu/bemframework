<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import FacilitatorControlPanel from '$lib/components/workshop/FacilitatorControlPanel.svelte';
	import GameUIWrapper from '$lib/components/workshop/GameUIWrapper.svelte';
	import MentorExplain from '$lib/components/games/MentorExplain.svelte';

	import { world4WorkshopSlides } from '$lib/content/world4WorkshopData';
	import confetti from 'canvas-confetti';

	// Templates
	import GoalsWorkshopRatingTemplate from '../workshop/goals/GoalsWorkshopRatingTemplate.svelte';
	import GoalsWorkshopPriorityTemplate from '../workshop/goals/GoalsWorkshopPriorityTemplate.svelte';
	import GoalsWorkshopClassificationTemplate from '../workshop/goals/GoalsWorkshopClassificationTemplate.svelte';
	import GoalsWorkshopClassificationRatingTemplate from '../workshop/goals/GoalsWorkshopClassificationRatingTemplate.svelte';

	let {
		player: initialPlayer,
		instance,
		onComplete
	}: {
		player: any;
		instance: any;
		onComplete: () => void;
	} = $props();

	// Initialize the shared workshop session for World 4
	const session = createWorkshopSession(initialPlayer, instance, 4, onComplete);

	// Slide navigation states
	let currentSlideIndex = $state(1);
	let activeMode = $state<'actividad' | 'feedback' | 'final_feedback'>('actividad');

	// Class-wide answers for the current slide
	let classVotes = $state<Record<string, any>>({});

	// Student's local input state for the current slide
	let localVotes = $state<Record<string, any>>({});
	let hasSubmittedLocalVote = $state(false);

	const currentSlide = $derived(
		world4WorkshopSlides.find(s => s.id === currentSlideIndex) || world4WorkshopSlides[0]
	);

	// Total submissions count
	const submittedCount = $derived(Object.keys(classVotes).length);

	// Total points or rating helpers
	const categoriesForSlide = $derived(currentSlide?.categories || []);
	const metaListForSlide = $derived(currentSlide?.metaList || []);

	// Synchronize votes on slide index or mode changes for all users (to see averages)
	$effect(() => {
		if (currentSlideIndex && activeMode) {
			loadClassVotes(currentSlideIndex);
		}
	});

	// Celebrate with confetti on the summary slide
	$effect(() => {
		if (currentSlideIndex === 15) {
			try {
				confetti({
					particleCount: 150,
					spread: 80,
					origin: { y: 0.6 }
				});
				setTimeout(() => {
					confetti({
						particleCount: 100,
						spread: 100,
						origin: { y: 0.7 }
					});
				}, 400);
			} catch (e) {
				console.error('Confetti failed to run:', e);
			}
		}
	});

	onMount(() => {
		session.loadAllClassPlayers();

		session.initConnection(async (event, payload) => {
			if (event === 'slide-sync') {
				currentSlideIndex = payload.slideIndex;
				activeMode = payload.mode;
				classVotes = {};

				// Sync local submission state
				const savedAnswer = session.player.game_state?.[4]?.workshop_answers?.[payload.slideIndex];
				if (savedAnswer) {
					localVotes = JSON.parse(JSON.stringify(savedAnswer));
					const slideData = world4WorkshopSlides.find(s => s.id === payload.slideIndex);
					if (slideData?.type === 'classification') {
						// Only lock submission if all cards are classified
						const allSorted = slideData?.metaList?.every(m => typeof localVotes[m.id] === 'string' && localVotes[m.id] !== '');
						hasSubmittedLocalVote = !!allSorted;
					} else if (slideData?.type === 'classification_rating') {
						// Lock submission if all cards are classified and rated
						const allSorted = slideData?.metaList?.every(m => {
							const vote = localVotes[m.id];
							return vote && typeof vote.category === 'string' && vote.category !== '' && typeof vote.rating === 'number' && vote.rating > 0;
						});
						hasSubmittedLocalVote = !!allSorted;
					} else {
						const submitted = session.player.game_state?.[4]?.workshop_submitted?.[payload.slideIndex];
						hasSubmittedLocalVote = !!submitted;
					}
				} else {
					localVotes = {};
					hasSubmittedLocalVote = false;
				}
			} else if (event === 'student-answer') {
				classVotes = {
					...classVotes,
					[payload.studentId]: payload.answers
				};
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
					if (!state[4]) state[4] = {};
					state[4].workshop_completed = true;

					await session.updatePlayerGameState(state, {
						coins: session.player.coins + 25 // Award +25 BEM Coins for completing the workshop
					});
				}
				onComplete();
			} else if (event === 'workshop-reset') {
				currentSlideIndex = 1;
				activeMode = 'actividad';
				classVotes = {};
				localVotes = {};
				hasSubmittedLocalVote = false;
			}
		});

		// Fetch existing instance state if it exists on load
		if (supabase) {
			supabase
				.from('course_instances')
				.select('current_workshop_state')
				.eq('code', instance.code)
				.single()
				.then(({ data: inst }) => {
					if (inst?.current_workshop_state && inst.current_workshop_state.world_id === 4) {
						const state = inst.current_workshop_state;
						currentSlideIndex = state.slide_index || 1;
						activeMode = state.mode || 'actividad';

						const savedAnswer = session.player.game_state?.[4]?.workshop_answers?.[currentSlideIndex];
						if (savedAnswer) {
							localVotes = JSON.parse(JSON.stringify(savedAnswer));
							const slideData = world4WorkshopSlides.find(s => s.id === currentSlideIndex);
							if (slideData?.type === 'classification') {
								const allSorted = slideData?.metaList?.every(m => typeof localVotes[m.id] === 'string' && localVotes[m.id] !== '');
								hasSubmittedLocalVote = !!allSorted;
							} else if (slideData?.type === 'classification_rating') {
								const allSorted = slideData?.metaList?.every(m => {
									const vote = localVotes[m.id];
									return vote && typeof vote.category === 'string' && vote.category !== '' && typeof vote.rating === 'number' && vote.rating > 0;
								});
								hasSubmittedLocalVote = !!allSorted;
							} else {
								const submitted = session.player.game_state?.[4]?.workshop_submitted?.[currentSlideIndex];
								hasSubmittedLocalVote = !!submitted;
							}
						} else {
							localVotes = {};
							hasSubmittedLocalVote = false;
						}
					}
				});
		}
	});

	// Load class votes from database for a specific slide
	async function loadClassVotes(slideIdx: number) {
		if (!supabase) return;
		const { data: players } = await supabase
			.from('course_players')
			.select('id, game_state')
			.eq('instance_code', instance.code);

		if (players) {
			const votesMap: Record<string, any> = {};
			players.forEach(p => {
				const answer = p.game_state?.[4]?.workshop_answers?.[slideIdx];
				if (answer) {
					votesMap[p.id] = answer;
				}
			});
			classVotes = votesMap;
		}
	}

	// Host slide change broadcast
	async function changeSlide(index: number, mode: 'actividad' | 'feedback' | 'final_feedback') {
		currentSlideIndex = index;
		activeMode = mode;
		classVotes = {};

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'slide-sync',
				payload: { slideIndex: index, mode }
			});

			if (supabase) {
				await supabase
					.from('course_instances')
					.update({
						current_workshop_state: {
							world_id: 4,
							slide_index: index,
							mode,
							votes: {}
						}
					})
					.eq('code', instance.code);
			}
		}
	}

	// Auto-save and broadcast votes in real time
	async function saveAndBroadcastVotes() {
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[4]) state[4] = {};
		if (!state[4].workshop_answers) state[4].workshop_answers = {};
		
		state[4].workshop_answers[currentSlideIndex] = localVotes;
		session.player.game_state = state;

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'student-answer',
				payload: {
					studentId: session.player.id,
					answers: localVotes
				}
			});
		}

		classVotes = {
			...classVotes,
			[session.player.id]: localVotes
		};

		await session.updatePlayerGameState(state);
	}

	// Submit student answer
	async function submitAnswer() {
		hasSubmittedLocalVote = true;

		// Persist explicit submission status
		const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
		if (!state[4]) state[4] = {};
		if (!state[4].workshop_submitted) state[4].workshop_submitted = {};
		state[4].workshop_submitted[currentSlideIndex] = true;
		session.player.game_state = state;

		await saveAndBroadcastVotes();
	}

	// Handle individual updates from templates
	async function handleVoteChange(key: string, value: any) {
		localVotes = {
			...localVotes,
			[key]: value
		};

		// Auto-save and broadcast in real time for all slides
		await saveAndBroadcastVotes();

		// Check if all cards are classified to lock submission
		if (currentSlide?.type === 'classification') {
			const allClassified = currentSlide?.metaList?.every(m => typeof localVotes[m.id] === 'string' && localVotes[m.id] !== '');
			if (allClassified) {
				hasSubmittedLocalVote = true;
			}
		}
	}

	async function handleVoteChangeClassificationRating(metaId: string, category: string, rating: number) {
		localVotes = {
			...localVotes,
			[metaId]: { category, rating }
		};

		// Auto-save and broadcast in real time for all slides
		await saveAndBroadcastVotes();

		// Check if all cards are classified and rated to lock submission
		if (currentSlide?.type === 'classification_rating') {
			const allSorted = currentSlide?.metaList?.every(m => {
				const vote = localVotes[m.id];
				return vote && typeof vote.category === 'string' && vote.category !== '' && typeof vote.rating === 'number' && vote.rating > 0;
			});
			if (allSorted) {
				hasSubmittedLocalVote = true;
				
				// Mark as submitted in game state to persist the lock state
				const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
				if (!state[4]) state[4] = {};
				if (!state[4].workshop_submitted) state[4].workshop_submitted = {};
				state[4].workshop_submitted[currentSlideIndex] = true;
				session.player.game_state = state;
				
				await session.updatePlayerGameState(state);
			}
		}
	}

	// Facilitator control triggers
	async function handleReset() {
		if (confirm('¿Estás seguro de que deseas reiniciar el taller del Mundo 4?')) {
			if (session.channel) {
				await session.channel.send({ type: 'broadcast', event: 'workshop-reset', payload: {} });
				if (supabase) {
					await supabase
						.from('course_instances')
						.update({ current_workshop_state: { world_id: 4, slide_index: 1, mode: 'actividad' } })
						.eq('code', instance.code);
				}
			}
			currentSlideIndex = 1;
			activeMode = 'actividad';
			classVotes = {};
			localVotes = {};
			hasSubmittedLocalVote = false;
		}
	}

	function handlePrev() {
		if (currentSlideIndex > 1) {
			changeSlide(currentSlideIndex - 1, 'actividad');
		}
	}

	function handleNext() {
		if (currentSlideIndex < 15) {
			changeSlide(currentSlideIndex + 1, 'actividad');
		} else if (currentSlideIndex === 15) {
			changeSlide(currentSlideIndex, 'final_feedback');
		}
	}

	function handleToggleMode(mode: 'actividad' | 'feedback') {
		changeSlide(currentSlideIndex, mode);
	}

	async function handleComplete() {
		if (session.channel) {
			await session.channel.send({ type: 'broadcast', event: 'workshop-complete', payload: {} });
			// Clear instance workshop state in the DB
			if (supabase) {
				await supabase
					.from('course_instances')
					.update({ current_workshop_state: null })
					.eq('code', instance.code);
			}
		}
		
		if (session.isHost) {
			const state = session.player.game_state ? JSON.parse(JSON.stringify(session.player.game_state)) : {};
			if (!state[4]) state[4] = {};
			state[4].workshop_completed = true;
			await session.updatePlayerGameState(state);
		}
		onComplete();
	}
</script>

<div class="world4-workshop-container flex flex-col items-center w-full">
	<!-- HOST CONTROL PANEL -->
	<FacilitatorControlPanel
		isHost={session.isHost}
		onlineCount={session.onlinePlayers.length}
		submittedCount={submittedCount}
		isFirstStep={currentSlideIndex === 1}
		isLastStep={currentSlideIndex === 15}
		activeMode={activeMode}
		onReset={handleReset}
		onPrev={handlePrev}
		onNext={handleNext}
		onToggleMode={handleToggleMode}
		onComplete={handleComplete}
		coinsLabel="+25 BEM Coins"
		stepLabel="Slide"
	/>

	<GameUIWrapper maxWidth="900px">
		<!-- MENTOR DIALOG -->
		<MentorExplain
			mentorName="Kira"
			mentorAvatar="/learn_resources/characters/char_kira_animated.gif"
			titlePrefix="Misión 4"
			instructions="<strong>Slide {currentSlideIndex} de 15</strong><br/><br/>{currentSlide.concept || ''}"
		/>

		<!-- SECTION SUBHEADER TITLE -->
		{#if currentSlide.type !== 'summary'}
			<div class="slide-section-title-card glass-card">
				<span class="part-badge">
					{#if currentSlide.part === 1}
						Parte 1: Calibración de Expectativas
					{:else if currentSlide.part === 2}
						Parte 2: Matriz Quiero/Tengo
					{:else if currentSlide.part === 3}
						Parte 3: Tipos de Metas
					{:else}
						Parte {currentSlide.part}
					{/if}
				</span>
				<h2>{currentSlide.title}</h2>
			</div>
		{/if}

		<!-- ACTIVE SLIDE RENDER -->
		<div class="slide-content-wrapper mt-4">
			{#if currentSlide.type === 'rating'}
				<GoalsWorkshopRatingTemplate
					isHost={session.isHost}
					activeMode={activeMode === 'actividad' ? 'actividad' : 'feedback'}
					concept={currentSlide.concept || ''}
					minLabel={currentSlide.minLabel}
					maxLabel={currentSlide.maxLabel}
					metaList={metaListForSlide}
					votes={classVotes}
					localVotes={localVotes}
					onVoteChange={handleVoteChange}
					onSubmit={submitAnswer}
					hasSubmittedLocalVote={hasSubmittedLocalVote}
					explanation={currentSlide.explanation}
				/>
			{:else if currentSlide.type === 'priority'}
				<GoalsWorkshopPriorityTemplate
					isHost={session.isHost}
					activeMode={activeMode === 'actividad' ? 'actividad' : 'feedback'}
					concept={currentSlide.concept || ''}
					categories={categoriesForSlide}
					votes={classVotes}
					localVotes={localVotes}
					onVoteChange={handleVoteChange}
					onSubmit={submitAnswer}
					hasSubmittedLocalVote={hasSubmittedLocalVote}
				/>
			{:else if currentSlide.type === 'classification'}
				<GoalsWorkshopClassificationTemplate
					isHost={session.isHost}
					activeMode={activeMode === 'actividad' ? 'actividad' : 'feedback'}
					concept={currentSlide.concept || ''}
					categories={categoriesForSlide}
					metaList={metaListForSlide}
					votes={classVotes}
					localVotes={localVotes}
					onVoteChange={handleVoteChange}
					onSubmit={submitAnswer}
					hasSubmittedLocalVote={hasSubmittedLocalVote}
				/>
			{:else if currentSlide.type === 'classification_rating'}
				<GoalsWorkshopClassificationRatingTemplate
					isHost={session.isHost}
					activeMode={activeMode === 'actividad' ? 'actividad' : 'feedback'}
					concept={currentSlide.concept || ''}
					categories={categoriesForSlide}
					minLabel={currentSlide.minLabel}
					maxLabel={currentSlide.maxLabel}
					metaList={metaListForSlide}
					votes={classVotes}
					localVotes={localVotes}
					onVoteChange={handleVoteChangeClassificationRating}
					onSubmit={submitAnswer}
					hasSubmittedLocalVote={hasSubmittedLocalVote}
					explanation={currentSlide.explanation}
				/>
			{:else if currentSlide.type === 'summary'}
				<div class="summary-slide-card glass-card" in:fade>
					<div class="shining-star-container">
						<svg class="shining-star" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
						</svg>
						<div class="star-glow"></div>
					</div>

					<h3 class="summary-title">¡Taller de Metas Completado!</h3>
					<p class="summary-subtitle">
						Has calibrado con éxito las variables de expectativa, la Matriz Quiero/Tengo y clasificado los tipos de objetivos junto a tu clase. ¡El Faro de la Orientación brilla ahora con toda su fuerza!
					</p>

					<div class="concepts-summary-grid">
						<div class="concept-summary-card">
							<span class="concept-icon">🧭</span>
							<h4>Expectativas</h4>
							<p>7 Variables clave calibradas: Deseabilidad, Progreso, Dificultad, Plazo, Medición, Agencia y Esfuerzo.</p>
						</div>
						<div class="concept-summary-card">
							<span class="concept-icon">📊</span>
							<h4>Matriz Quiero/Tengo</h4>
							<p>Estructura de metas de aprendizaje según estado y acción: Adquisición, Mantenimiento, Eliminación y Prevención.</p>
						</div>
						<div class="concept-summary-card">
							<span class="concept-icon">🎯</span>
							<h4>Tipos de Metas</h4>
							<p>Alineación de objetivos: Metas Narrativas integradas, Principales (Aproximación/Evasión) y Secundarias voluntarias.</p>
						</div>
					</div>
					
					{#if !session.isHost}
						<div class="award-badge-box">
							<span class="award-subtitle">Medalla de Participación Desbloqueada</span>
							<h4 class="award-title">🏅 Arquitecto de Metas</h4>
							<p class="award-desc">¡Has recibido <strong>+25 BEM Coins</strong> por tu participación activa!</p>
						</div>
					{/if}

					{#if session.isHost}
						<button
							type="button"
							class="btn-solar-primary summary-btn"
							onclick={handleComplete}
						>
							✓ Finalizar Taller para la Clase
						</button>
					{:else}
						<div class="waiting-host-box">
							<p class="waiting-text">
								Esperando a que el mentor finalice el taller de forma oficial...
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</GameUIWrapper>
</div>

<style>
	.world4-workshop-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.summary-slide-card {
		border-radius: var(--radius-solar-lg, 24px);
		background: rgba(255, 255, 255, 0.85);
		border: 1.5px solid var(--color-solar-card-border);
		box-shadow: var(--shadow-solar-md);
		max-width: 680px;
		margin: 2rem auto;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.5rem;
		box-sizing: border-box;
	}

	.slide-section-title-card {
		border-radius: var(--radius-solar-md, 20px);
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
		padding: 1.25rem 1.5rem;
		margin-top: 1rem;
		margin-bottom: 1.5rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		box-sizing: border-box;
	}

	.slide-content-wrapper {
		margin-top: 0;
		width: 100%;
	}

	.part-badge {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3d8f68);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: inline-block;
	}

	.slide-section-title-card h2 {
		margin: 0;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.15rem;
		font-weight: 850;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.3;
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: var(--radius-solar-md, 20px);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
	}

	/* Shining Star Animations & Styles */
	.shining-star-container {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
		animation: containerPulse 2s infinite ease-in-out;
		width: 100px;
		height: 100px;
	}

	.shining-star {
		width: 80px;
		height: 80px;
		color: #ffd700;
		filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
		animation: starRotate 10s infinite linear;
		z-index: 2;
	}

	.star-glow {
		position: absolute;
		width: 100px;
		height: 100px;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0) 70%);
		border-radius: 50%;
		animation: glowPulse 2s infinite ease-in-out;
		z-index: 1;
	}

	@keyframes containerPulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.12);
		}
	}

	@keyframes starRotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes glowPulse {
		0%, 100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	/* Summary Title & Subtitle Styling */
	.summary-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.85rem;
		font-weight: 900;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0;
	}

	.summary-subtitle {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--color-solar-text-muted, #555);
		max-width: 580px;
		margin: 0;
	}

	/* Concepts Summary Grid & Cards */
	.concepts-summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.25rem;
		width: 100%;
		margin: 1rem 0;
		box-sizing: border-box;
	}

	.concept-summary-card {
		background: rgba(255, 255, 255, 0.65);
		border: 1px solid rgba(0, 0, 0, 0.06);
		border-radius: var(--radius-solar-md, 16px);
		padding: 1.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-sizing: border-box;
		transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
	}

	.concept-summary-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-sm, 0 4px 12px rgba(0,0,0,0.05));
		background: rgba(255, 255, 255, 0.85);
		border-color: var(--color-solar-green-medium, #3d8f68);
	}

	.concept-icon {
		font-size: 1.5rem;
		display: inline-block;
	}

	.concept-summary-card h4 {
		margin: 0;
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.concept-summary-card p {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--color-solar-text-muted, #555);
	}

	/* Award Badge Box Premium Styling */
	.award-badge-box {
		background: linear-gradient(135deg, rgba(250, 240, 215, 0.9) 0%, rgba(253, 224, 71, 0.2) 100%);
		border: 1.5px solid rgba(234, 179, 8, 0.35);
		border-radius: var(--radius-solar-md, 18px);
		padding: 1.25rem 2rem;
		max-width: 460px;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		box-shadow: 0 4px 15px rgba(234, 179, 8, 0.08);
		margin-top: 0.5rem;
	}

	.award-subtitle {
		font-size: 0.65rem;
		font-weight: 800;
		color: #b45309;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.award-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.25rem;
		font-weight: 900;
		color: #78350f;
		margin: 0.1rem 0;
	}

	.award-desc {
		font-size: 0.75rem;
		color: #92400e;
		margin: 0;
	}

	/* Action Buttons & Mentor Waiting Boxes */
	.summary-btn {
		font-weight: 750;
		padding: 0.85rem 2rem;
		font-size: 0.95rem;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.waiting-host-box {
		padding: 1rem 1.5rem;
		border: 1px dashed rgba(61, 143, 104, 0.35);
		background: rgba(61, 143, 104, 0.03);
		border-radius: var(--radius-solar-md, 14px);
		max-width: 480px;
		width: 100%;
		box-sizing: border-box;
		margin-top: 0.5rem;
	}

	.waiting-text {
		font-size: 0.8rem;
		color: var(--color-solar-green-medium, #3d8f68);
		font-weight: 600;
		margin: 0;
		animation: pulseText 2s infinite ease-in-out;
	}

	@keyframes pulseText {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}
</style>
