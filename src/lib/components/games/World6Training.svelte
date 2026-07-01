<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { decisionsTriviaQuestions, type DecisionsTriviaQuestion } from '$lib/content/decisionsTrivia';
	import { supabase } from '$lib/supabase';

	let { 
		world, 
		player, 
		onGameComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onGameComplete: (results: any) => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	// Shuffle the 15 questions on load
	const shuffled = [...decisionsTriviaQuestions];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	let activeQuestions = $state<DecisionsTriviaQuestion[]>(shuffled);

	// Local gameplay states
	let currentQuestionIndex = $state(0);
	let selectedAnswer = $state<string | null>(null);
	let isAnswered = $state(false);
	let isCorrect = $state(false);

	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);
	let blockCorrect = $state({ A: 0, B: 0, C: 0 });

	// State to track liked ideas locally
	let likedIdeas = $state<string[]>(player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(question: DecisionsTriviaQuestion) {
		let currentLiked = [...likedIdeas];
		
		const state = { ...player.game_state };
		if (!state.ideas) {
			state.ideas = [];
		}

		if (currentLiked.includes(question.id)) {
			currentLiked = currentLiked.filter(id => id !== question.id);
			state.ideas = state.ideas.filter((i: any) => i.id !== question.id);
		} else {
			currentLiked.push(question.id);
			state.ideas.push({
				id: question.id,
				driver: `Mundo 6: ${question.blockName}`,
				scenario: question.scenario,
				explanation: question.explanation,
				likedAt: new Date().toISOString()
			});
		}
		
		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;
		player.game_state = state;

		onUpdateCoins(player.coins, state);

		if (supabase && player.id) {
			await supabase
				.from('course_players')
				.update({ game_state: state })
				.eq('id', player.id);
		}
	}

	// Scroll-to-top effect on slide transition
	$effect(() => {
		currentQuestionIndex;
		isAnswered;

		tick().then(() => {
			const scrollContainers = [
				document.querySelector('.viewport-body'),
				document.querySelector('.viewport-card'),
				document.querySelector('.training-game-wrapper')
			];
			scrollContainers.forEach(container => {
				if (container) {
					container.scrollTop = 0;
				}
			});
			window.scrollTo({ top: 0, behavior: 'instant' });
		});
	});

	const netScore = $derived(totalCorrect - totalIncorrect);
	const currentQ = $derived(activeQuestions[currentQuestionIndex]);

	function selectOption(optionIndex: number) {
		if (isAnswered) return;
		const letter = ['A', 'B', 'C', 'D'][optionIndex];
		selectedAnswer = letter;
	}

	function submitAnswer() {
		if (!selectedAnswer || isAnswered) return;

		isAnswered = true;
		isCorrect = selectedAnswer === currentQ.correct;

		if (isCorrect) {
			totalCorrect++;
			blockCorrect[currentQ.block]++;
		} else {
			totalIncorrect++;
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < activeQuestions.length - 1) {
			currentQuestionIndex++;
			selectedAnswer = null;
			isAnswered = false;
		} else {
			onGameComplete({
				totalCorrect,
				totalIncorrect,
				blockCorrect
			});
		}
	}
</script>

<div class="training-game-wrapper" in:fade>
	<!-- Progress meter -->
	<div class="flex justify-between items-center mb-4">
		<span class="q-progress">
			Pregunta {currentQuestionIndex + 1} de {activeQuestions.length}
		</span>
		<div class="flex items-center gap-2">
			<span class="text-xs font-bold text-solar-text-muted">CALIBRACIÓN DE KARMA:</span>
			<span class="net-score-indicator" class:negative={netScore < 0}>
				{netScore >= 0 ? '+' : ''}{netScore} NETO
			</span>
		</div>
	</div>

	<!-- Progress Track -->
	<div class="w-full bg-gray-200 h-2 rounded-full mb-6 overflow-hidden">
		<div 
			class="training-progress-fill h-full"
			style="width: {((currentQuestionIndex) / activeQuestions.length) * 100}%"
		></div>
	</div>

	<!-- Main Question Board -->
	{#if currentQ}
		<div class="quiz-screen">
			{#if !isAnswered}
				<div class="question-card text-left" in:fade>
					<span class="q-label">{currentQ.blockName}</span>
					<h3 class="scenario-text">"{currentQ.scenario}"</h3>
					
					<p class="question-text-prompt text-solar-text font-medium mt-4 mb-6">
						{currentQ.question}
					</p>

					<div class="choices-grid">
						{#each currentQ.options as option, idx}
							{@const optLetter = ['A', 'B', 'C', 'D'][idx]}
							<button
								type="button"
								class="choice-btn"
								class:selected={selectedAnswer === optLetter}
								onclick={() => selectOption(idx)}
							>
								<span class="choice-indicator">{optLetter}</span>
								<span class="choice-text">{option}</span>
							</button>
						{/each}
					</div>

					<div class="board-footer flex justify-end mt-6 border-t pt-4 border-gray-100">
						<button
							type="button"
							class="btn-solar-accent"
							disabled={!selectedAnswer}
							onclick={submitAnswer}
						>
							Validar Elección ➔
						</button>
					</div>
				</div>
			{:else}
				<!-- Answer Feedback Screen -->
				<div class="feedback-response-box text-left" class:correct={isCorrect} class:incorrect={!isCorrect} in:fly={{ y: 20, duration: 400 }}>
					<!-- Top header -->
					<div class="flex justify-between items-center border-b border-black/[0.08] pb-3 mb-5">
						<div class="flex flex-col gap-0.5">
							<span class="q-label text-[10px] tracking-widest opacity-80">CATEGORÍA DE DECISIÓN</span>
							<span class="block-name-highlight text-sm font-extrabold text-solar-green-dark">{currentQ.blockName}</span>
						</div>
						<span class="feedback-badge-premium shadow-sm" class:correct-badge={isCorrect} class:incorrect-badge={!isCorrect}>
							{isCorrect ? '✓ Calibración Alineada' : '✗ Calibración Desalineada'}
						</span>
					</div>

					<!-- Escenario Destacado -->
					<div class="scenario-highlight-card mb-5">
						<span class="sub-title">CASO DE ESTUDIO / NARRATIVA</span>
						<p class="scenario-quote">"{currentQ.scenario}"</p>
					</div>

					<!-- Comparador de Respuestas -->
					<div class="comparison-grid gap-4 mb-5">
						<div class="response-pill-premium shadow-sm" class:user-wrong={!isCorrect} class:user-correct={isCorrect}>
							<div class="pill-header flex items-center gap-2 mb-2">
								<span class="pill-badge" class:user-wrong-badge={!isCorrect} class:user-correct-badge={isCorrect}>
									{isCorrect ? '✓' : '✗'} TU ELECCIÓN
								</span>
							</div>
							<div class="pill-body flex items-start gap-2">
								<span class="letter-badge">{selectedAnswer}</span>
								<p class="pill-text font-medium">
									{currentQ.options[['A', 'B', 'C', 'D'].indexOf(selectedAnswer || '')]}
								</p>
							</div>
						</div>

						{#if !isCorrect}
							<div class="response-pill-premium giochi-correct shadow-sm">
								<div class="pill-header flex items-center gap-2 mb-2">
									<span class="pill-badge giochi-correct-badge">
										⭐ ALINEACIÓN CON GIOCHI
									</span>
								</div>
								<div class="pill-body flex items-start gap-2">
									<span class="letter-badge giochi-letter">{currentQ.correct}</span>
									<p class="pill-text font-semibold">
										{currentQ.options[['A', 'B', 'C', 'D'].indexOf(currentQ.correct)]}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Mentor Speech Card -->
					<div class="mentor-speech-card-premium flex gap-4 items-start mb-6 shadow-sm">
						<div class="mentor-avatar-container">
							<img 
								src="/learn_resources/characters/char_sara.png" 
								alt="Sara" 
								class="mentor-portrait-circle-premium w-12 h-12 rounded-full border bg-white"
							/>
							<div class="mentor-avatar-glow"></div>
						</div>
						<div class="speech-bubble-body">
							<div class="flex items-center gap-2 mb-1">
								<span class="mentor-name-tag text-xs font-bold text-solar-green-dark">Sara Arbeláez</span>
								<span class="mentor-role-tag text-[9px] bg-sky-100 text-sky-700 px-1 rounded font-bold uppercase">Mentora de Decisiones</span>
							</div>
							<p class="speech-text text-xs leading-relaxed text-solar-green-dark">
								"{currentQ.explanation}"
							</p>
						</div>
					</div>

					<!-- Bookmark bitácora -->
					<div class="idea-btn-container border-t pt-4 border-dashed border-black/[0.08]">
						<button 
							type="button" 
							class="btn-like-idea text-xs font-bold flex items-center gap-1 text-sky-700 hover:text-sky-800" 
							class:liked={isIdeaLiked(currentQ.id)}
							onclick={() => toggleIdea(currentQ)}
						>
							{isIdeaLiked(currentQ.id) ? '⭐ Guardado en Bitácora' : '☆ Guardar Idea en Bitácora'}
						</button>
					</div>

					<div class="action-row-feedback mt-6">
						<button type="button" class="btn-solar-primary w-full justify-center shadow-md font-bold py-2.5 rounded-lg" onclick={nextQuestion}>
							{currentQuestionIndex < activeQuestions.length - 1 ? 'Siguiente Pregunta 🧭' : 'Finalizar Entrenamiento 🏆'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.training-game-wrapper {
		max-width: 720px;
		margin: 0 auto;
		padding: 1rem;
		font-family: var(--font-solar-body), sans-serif;
	}

	.quiz-screen {
		max-width: 680px;
		margin: 0 auto;
	}

	.q-progress {
		font-size: 0.85rem;
		font-weight: 850;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.net-score-indicator {
		background: var(--color-solar-green-light, #d1f5e3);
		color: var(--color-solar-green-dark, #1e4533);
		font-weight: 800;
		font-size: 0.8rem;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		transition: all 0.2s ease;
	}

	.net-score-indicator.negative {
		background: #fee2e2;
		color: #b91c1c;
	}

	.training-progress-fill {
		background: linear-gradient(90deg,
			var(--color-solar-green-medium, #3d8f68),
			var(--color-solar-sky, #188db5)
		);
		border-radius: var(--radius-solar-full, 9999px);
		transition: width 400ms ease;
	}

	.question-card {
		padding: 2rem 1.5rem;
		border-radius: 24px;
		background: var(--color-solar-card, #ffffff);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.05));
		box-shadow: var(--shadow-solar-sm);
	}

	.q-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3d8f68);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.scenario-text {
		font-family: var(--font-solar-header), sans-serif;
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.4;
		margin-top: 0.5rem;
	}

	.choices-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-btn {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 0.85rem 1.25rem;
		border: 1.5px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		border-radius: 12px;
		background: #ffffff;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.1);
	}

	.choice-btn:hover {
		border-color: var(--color-solar-green-medium, #3d8f68);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(61,143,104,0.08);
	}

	.choice-btn.selected {
		border-color: var(--color-solar-green-medium, #3d8f68);
		background: var(--color-solar-green-light, #e8fbf1);
		box-shadow: 0 4px 12px rgba(61,143,104,0.12);
	}

	.choice-indicator {
		font-family: var(--font-solar-header), sans-serif;
		font-weight: 850;
		font-size: 0.85rem;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: var(--color-solar-green-medium, #3d8f68);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.choice-btn.selected .choice-indicator {
		background: var(--color-solar-green-dark, #1e4533);
	}

	.choice-text {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		flex: 1;
	}

	/* Feedback Screen styles */
	.feedback-response-box {
		padding: 2rem 1.5rem;
		border-radius: 24px;
		background: #ffffff;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.05));
		box-shadow: var(--shadow-solar-md);
	}

	.feedback-badge-premium {
		font-family: var(--font-solar-header), sans-serif;
		font-weight: 900;
		font-size: 0.65rem;
		padding: 0.35rem 0.75rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.feedback-badge-premium.correct-badge {
		background: #d1f5e3;
		color: #166534;
	}

	.feedback-badge-premium.incorrect-badge {
		background: #fee2e2;
		color: #b91c1c;
	}

	.scenario-highlight-card {
		padding: 1.25rem;
		border-radius: 16px;
		background: var(--color-solar-bg, #FAF9F6);
		border-left: 4px solid var(--color-solar-green-medium, #3d8f68);
		margin-bottom: 1.25rem !important;
	}

	.scenario-highlight-card .sub-title {
		font-size: 0.6rem;
		font-weight: 850;
		color: var(--color-solar-text-muted, #7c8b82);
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.35rem;
	}

	.scenario-quote {
		font-family: var(--font-solar-header), sans-serif;
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.45;
		margin: 0;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 1.25rem !important;
	}
	@media (min-width: 600px) {
		.comparison-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.response-pill-premium {
		padding: 1rem;
		border-radius: 16px;
		background: #ffffff;
		border: 1.5px solid #f3f4f6;
		display: flex;
		flex-direction: column;
	}

	.response-pill-premium.user-correct {
		border-color: #10b981;
		background: #f0fdf4;
	}

	.response-pill-premium.user-wrong {
		border-color: #ef4444;
		background: #fdf2f2;
	}

	.response-pill-premium.giochi-correct {
		border-color: var(--color-solar-green-medium, #3d8f68);
		background: var(--color-solar-green-light, #e8fbf1);
	}

	.pill-badge {
		font-size: 0.55rem;
		font-weight: 900;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		letter-spacing: 0.05em;
	}

	.pill-badge.user-correct-badge { background: #d1f5e3; color: #166534; }
	.pill-badge.user-wrong-badge { background: #fca5a5; color: #991b1b; }
	.pill-badge.giochi-correct-badge { background: #d2f5e3; color: var(--color-solar-green-dark, #1e4533); }

	.letter-badge {
		width: 20px;
		height: 20px;
		border-radius: 4px;
		background: #e5e7eb;
		color: #374151;
		font-family: var(--font-solar-header), sans-serif;
		font-weight: 900;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	.user-correct .letter-badge { background: #10b981; color: #ffffff; }
	.user-wrong .letter-badge { background: #ef4444; color: #ffffff; }
	.giochi-letter { background: var(--color-solar-green-medium, #3d8f68); color: #ffffff; }

	.pill-text {
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0;
		text-align: left;
		line-height: 1.4;
	}

	.mentor-speech-card-premium {
		background: radial-gradient(120% 120% at 50% 0%, #ffffff 0%, var(--color-solar-bg, #FAF9F6) 100%);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding: 1.25rem;
		border-radius: 20px;
		margin-bottom: 1.5rem !important;
	}

	.mentor-name-tag {
		font-size: 0.75rem;
		font-weight: 850;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.mentor-role-tag {
		font-size: 0.55rem;
		font-weight: 900;
		color: #1e3a8a;
		background: #dbeafe;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.speech-text {
		font-size: 0.75rem;
		color: var(--color-solar-text, #3a4b40);
		line-height: 1.5;
		margin: 0;
	}

	.btn-like-idea {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-solar-body), sans-serif;
		transition: all 0.2s ease;
	}
	.btn-like-idea:hover {
		transform: scale(1.03);
	}

	.board-footer {
		margin-top: 1.75rem !important;
	}
</style>
