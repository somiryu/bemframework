<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { attentionTriviaQuestions as staticAttentionTriviaQuestions, type AttentionTriviaQuestion } from '$lib/content/attentionTrivia';

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

	// Content lives in course_worlds.training_modules; the static import is
	// only a fallback for an instance this DB hasn't been migrated on yet.
	const attentionTriviaQuestions: AttentionTriviaQuestion[] = world.training_modules?.questions?.length
		? world.training_modules.questions
		: staticAttentionTriviaQuestions;

	// Shuffle the 21 questions on load
	const shuffled = [...attentionTriviaQuestions];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	let activeQuestions = $state<AttentionTriviaQuestion[]>(shuffled);

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

	async function toggleIdea(question: AttentionTriviaQuestion) {
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
				driver: `Mundo 5: ${question.blockName}`,
				scenario: question.scenario,
				explanation: question.explanation,
				likedAt: new Date().toISOString()
			});
		}
		
		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;
		player.game_state = state;

		onUpdateCoins(player.coins, state);

		// Save via server action — the browser no longer writes course_players directly
		if (player.id) {
			const formData = new FormData();
			formData.append('game_state', JSON.stringify(state));
			await fetch('?/syncPlayerState', { method: 'POST', body: formData });
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
							<span class="q-label text-[10px] tracking-widest opacity-80">CATEGORÍA DE ATENCIÓN</span>
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
										{currentQ.correctText}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Mentor Speech Card -->
					<div class="mentor-speech-card-premium flex gap-4 items-start mb-6 shadow-sm">
						<div class="mentor-avatar-container">
							<img 
								src="/learn_resources/characters/char_sara_animated.gif" 
								alt="Sara" 
								class="mentor-portrait-circle-premium"
							/>
							<div class="mentor-avatar-glow"></div>
						</div>
						<div class="speech-bubble-body">
							<div class="flex items-center gap-2 mb-1">
								<span class="mentor-name-tag">Sara Arbeláez</span>
								<span class="mentor-role-tag">Mentora de Atención</span>
							</div>
							<p class="speech-text">
								"{currentQ.explanation}"
							</p>
						</div>
					</div>

					<!-- Bookmark bitácora -->
					<div class="idea-btn-container border-t pt-4 border-dashed border-black/[0.08]">
						<button 
							type="button" 
							class="btn-like-idea" 
							class:liked={isIdeaLiked(currentQ.id)}
							onclick={() => toggleIdea(currentQ)}
						>
							{isIdeaLiked(currentQ.id) ? '⭐ Guardado en Bitácora' : '☆ Guardar Idea en Bitácora'}
						</button>
					</div>

					<div class="action-row-feedback mt-6">
						<button type="button" class="btn-solar-primary w-full justify-center shadow-md" onclick={nextQuestion}>
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
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0.5rem 0 0 0;
		line-height: 1.5;
	}

	.question-text-prompt {
		font-size: 1rem;
		line-height: 1.4;
	}

	.choices-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-btn {
		width: 100%;
		text-align: left;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		border: 2px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		padding: 1rem 1.25rem;
		border-radius: 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		outline: none;
	}

	.choice-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
	}

	.choice-btn.selected {
		border-color: var(--color-solar-green-medium, #3d8f68);
		background: var(--color-solar-green-light, #d2f5e3);
	}

	.choice-indicator {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-solar-bg, #FAF9F6);
		border: 1.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.95rem;
		font-weight: 800;
	}

	.choice-btn.selected .choice-indicator {
		background: var(--color-solar-green-medium, #3d8f68);
		color: white;
		border-color: var(--color-solar-green-medium, #3d8f68);
	}

	.choice-text {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-text, #333333);
	}

	/* FEEDBACK EXPLANATION BOX */
	.feedback-response-box {
		padding: 2rem;
		border-radius: 28px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 10px 30px rgba(30, 69, 51, 0.05),
			var(--shadow-solar-md);
	}

	.feedback-response-box.correct {
		background: rgba(240, 253, 244, 0.85);
		border-left: 5px solid var(--color-solar-green-medium, #3d8f68);
	}

	.feedback-response-box.incorrect {
		background: rgba(254, 242, 242, 0.85);
		border-left: 5px solid var(--color-solar-terracotta, #e11d48);
	}


	.correct-badge {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
	}

	.incorrect-badge {
		background: #fee2e2;
		color: #991b1b;
	}

	/* ESCENARIO DESTACADO */
	.scenario-highlight-card {
		background: white;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding: 1.25rem;
		border-radius: 18px;
		box-shadow: var(--shadow-solar-sm);
		margin-bottom: 1.25rem !important;
	}

	.scenario-highlight-card .sub-title {
		font-size: 0.6rem;
		font-weight: 800;
		color: var(--color-solar-text-muted);
		letter-spacing: 0.08em;
		display: block;
		margin-bottom: 0.35rem;
	}

	.scenario-quote {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark);
		line-height: 1.5;
		margin: 0;
		font-style: italic;
	}

	/* COMPARADOR DE RESPUESTAS */
	.comparison-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.25rem !important;
	}




	.user-correct {
		background: hsla(142, 70%, 90%, 0.4);
		border-color: hsla(142, 70%, 45%, 0.25);
		color: var(--color-solar-green-dark);
	}

	.user-wrong {
		background: hsla(0, 80%, 93%, 0.4);
		border-color: hsla(0, 80%, 60%, 0.25);
		color: #991b1b;
	}

	.giochi-correct {
		background: hsla(196, 70%, 93%, 0.4);
		border-color: hsla(196, 70%, 50%, 0.25);
		color: hsl(196, 75%, 25%);
	}

	/* MENTOR SPEECH CARD */


	.speech-bubble-body {
		text-align: left;
	}

	.mentor-name-tag {
		font-family: var(--font-solar-header);
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		display: block;
		margin-bottom: 0.25rem;
	}

	.speech-bubble-body .speech-text {
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--color-solar-text);
		margin: 0;
		font-style: italic;
	}

	.feedback-badge-premium {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.75rem;
		font-weight: 850;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.35rem 0.85rem;
		border-radius: 10px;
	}

	.response-pill-premium {
		padding: 1.25rem;
		border-radius: 20px;
		border: 1px solid transparent;
		background: var(--color-solar-card, #ffffff);
	}

	.response-pill-premium.user-correct {
		background: linear-gradient(135deg, rgba(240, 253, 244, 0.9), rgba(255, 255, 255, 0.95));
		border: 1.5px solid var(--color-solar-green-medium, #3d8f68);
	}

	.response-pill-premium.user-wrong {
		background: linear-gradient(135deg, rgba(254, 242, 242, 0.9), rgba(255, 255, 255, 0.95));
		border: 1.5px solid var(--color-solar-terracotta, #e11d48);
	}

	.response-pill-premium.giochi-correct {
		background: linear-gradient(135deg, rgba(224, 242, 254, 0.9), rgba(255, 255, 255, 0.95));
		border: 1.5px solid var(--color-solar-sky, #188db5);
	}

	.pill-badge {
		font-size: 0.65rem;
		font-weight: 850;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
		letter-spacing: 0.03em;
	}

	.user-correct-badge {
		background: rgba(74, 222, 128, 0.2);
		color: #166534;
	}

	.user-wrong-badge {
		background: rgba(248, 113, 113, 0.2);
		color: #991b1b;
	}

	.giochi-correct-badge {
		background: rgba(56, 189, 248, 0.25);
		color: #0369a1;
	}

	.letter-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		font-weight: 800;
		font-size: 0.85rem;
		flex-shrink: 0;
		background: var(--color-solar-bg);
		border: 1px solid var(--color-solar-card-border);
		color: var(--color-solar-text);
	}

	.user-wrong .letter-badge {
		background: #fee2e2;
		color: #b91c1c;
		border-color: rgba(185, 28, 28, 0.2);
	}

	.user-correct .letter-badge {
		background: #d1f5e3;
		color: #1e4533;
		border-color: rgba(30, 69, 51, 0.2);
	}

	.giochi-letter {
		background: #e0f2fe;
		color: #0369a1;
		border-color: rgba(3, 105, 161, 0.2);
	}

	.mentor-speech-card-premium {
		background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(249, 250, 251, 0.85));
		border: 1px solid rgba(0, 0, 0, 0.05);
		padding: 1.5rem;
		border-radius: 24px;
		box-sizing: border-box;
		margin-bottom: 1.5rem !important;
	}

	.mentor-portrait-circle-premium {
		width: 58px;
		height: 58px;
		border-radius: 50%;
		border: 3px solid var(--color-solar-green-medium);
		object-fit: cover;
		z-index: 2;
		position: relative;
	}

	.mentor-avatar-container {
		position: relative;
		flex-shrink: 0;
	}

	.mentor-avatar-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--color-solar-green-medium);
		opacity: 0.15;
		filter: blur(8px);
		z-index: 1;
	}

	.mentor-role-tag {
		font-size: 0.65rem;
		font-weight: 700;
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
	}

	.action-row-feedback {
		margin-top: 2rem !important;
	}

	.w-full { width: 100%; }
	.justify-between { justify-content: space-between; }
	.flex { display: flex; }
	.gap-4 { gap: 1rem; }
	.mb-5 { margin-bottom: 1.25rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mt-6 { margin-top: 1.5rem; }

	.btn-solar-primary {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 700;
		font-size: 1rem;
		color: #ffffff;
		background: linear-gradient(135deg, var(--color-solar-green-medium, #3d8f68), var(--color-solar-green-dark, #1e4533));
		border: none;
		border-radius: 12px;
		padding: 0.9rem 2rem;
		box-shadow: 0 4px 15px rgba(61, 143, 104, 0.25);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* LIKE IDEA BUTTON STYLES */
	.idea-btn-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.25rem;
		width: 100%;
	}

	.btn-like-idea {
		background: #ffffff;
		border: 2px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		color: var(--color-solar-green-dark, #1e4533);
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 12px;
		font-weight: 750;
		font-size: 0.8rem;
		font-family: var(--font-solar-body, sans-serif), sans-serif;
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		outline: none;
	}

	.btn-like-idea:hover {
		transform: translateY(-2px);
		border-color: var(--color-solar-yellow, #ffd166);
		background: #FFFDF4;
		box-shadow: var(--shadow-solar-md, 0 4px 12px rgba(0,0,0,0.08));
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
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	.board-footer {
		margin-top: 1.75rem !important;
	}
</style>
