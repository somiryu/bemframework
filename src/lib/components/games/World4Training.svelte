<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { goalsTriviaQuestions as staticGoalsTriviaQuestions, type GoalsTriviaQuestion } from '$lib/content/goalsTrivia';

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
	const goalsTriviaQuestions: GoalsTriviaQuestion[] = world.training_modules?.questions?.length
		? world.training_modules.questions
		: staticGoalsTriviaQuestions;

	// Shuffle the 21 questions on load
	const shuffled = [...goalsTriviaQuestions];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	let activeQuestions = $state<GoalsTriviaQuestion[]>(shuffled);

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

	async function toggleIdea(question: GoalsTriviaQuestion) {
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
				driver: `Mundo 4: ${question.blockName}`,
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

	// Reactive scroll-to-top on state transitions
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

	function checkAnswer(option: string) {
		if (isAnswered) return;

		selectedAnswer = option;
		isAnswered = true;
		
		const currentQ = activeQuestions[currentQuestionIndex];
		isCorrect = option === currentQ.correct;

		if (isCorrect) {
			totalCorrect++;
			if (currentQ.block === 'A' || currentQ.block === 'B' || currentQ.block === 'C') {
				blockCorrect[currentQ.block]++;
			}
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
			onGameComplete({ totalCorrect, totalIncorrect, blockCorrect });
		}
	}
</script>

<div class="training-game-wrapper text-center" in:fade>
	{#if activeQuestions.length > 0}
		{@const currentQ = activeQuestions[currentQuestionIndex]}
		<!-- QUIZ SCREEN -->
		<div class="quiz-screen text-left">
			<div class="quiz-header flex justify-between items-center mb-4 p-2 glass-card">
				<span class="q-progress">
					Bloque <strong>{currentQ.block}</strong>: {currentQ.blockName} &bull; Pregunta <strong>{currentQuestionIndex + 1}</strong> de {activeQuestions.length}
				</span>
				<span class="net-score-indicator" class:negative={netScore < 0}>
					Puntaje Neto: <strong>{netScore}</strong>
				</span>
			</div>

			{#if !isAnswered}
				<!-- Question Card -->
				<div class="question-card glass-card mb-6" in:fly={{ y: 20, duration: 400 }}>
					<span class="q-label">CASO DE ESTUDIO</span>
					<blockquote class="scenario-text mt-2">
						"{currentQ.scenario}"
					</blockquote>
					<p class="question-text-prompt mt-4 font-bold text-solar-green-dark">
						{currentQ.question}
					</p>

					<div class="idea-btn-container">
						<button 
							type="button" 
							class="btn-like-idea"
							class:liked={isIdeaLiked(currentQ.id)}
							onclick={() => toggleIdea(currentQ)}
						>
							{#if isIdeaLiked(currentQ.id)}
								💡 ¡Es una Idea en mi Bitácora!
							{:else}
								💡 Me gusta. Volver una Idea
							{/if}
						</button>
					</div>
				</div>

				<!-- Choices Grid -->
				<div class="choices-grid">
					{#each currentQ.options as opt}
						<button
							type="button"
							class="choice-btn"
							onclick={() => checkAnswer(opt)}
						>
							<span class="choice-indicator">
								👉
							</span>
							<span class="choice-text">{opt}</span>
						</button>
					{/each}
				</div>
			{:else}
				<!-- Feedback Dialog -->
				<div class="feedback-response-box text-left" class:correct={isCorrect} class:incorrect={!isCorrect} in:fade={{ duration: 300 }}>
					<!-- Top header -->
					<div class="flex justify-between items-center border-b border-black/[0.08] pb-3 mb-5">
						<div class="flex flex-col gap-0.5">
							<span class="q-label text-[10px] tracking-widest opacity-80">CATEGORÍA DE METAS</span>
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
								<span class="letter-badge">{['A', 'B', 'C', 'D'][currentQ.options.indexOf(selectedAnswer || '')]}</span>
								<p class="pill-text font-medium">
									{selectedAnswer}
								</p>
							</div>
						</div>

						{#if !isCorrect}
							<div class="response-pill-premium giochi-correct shadow-sm">
								<div class="pill-header flex items-center gap-2 mb-2">
									<span class="pill-badge giochi-correct-badge">
										⭐ RESPUESTA ALINEADA
									</span>
								</div>
								<div class="pill-body flex items-start gap-2">
									<span class="letter-badge giochi-letter">{['A', 'B', 'C', 'D'][currentQ.options.indexOf(currentQ.correct)]}</span>
									<p class="pill-text font-semibold">
										{currentQ.correct}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Mentor Speech Card -->
					<div class="mentor-speech-card-premium flex gap-4 items-start mb-6 shadow-sm">
						<div class="mentor-avatar-container">
							<img 
								src="/learn_resources/characters/char_kira.png" 
								alt="Kira" 
								class="mentor-portrait-circle-premium"
							/>
							<div class="mentor-avatar-glow"></div>
						</div>
						<div class="speech-bubble-body">
							<div class="flex items-center gap-2 mb-1">
								<span class="mentor-name-tag">Kira Yamada</span>
								<span class="mentor-role-tag">Mentora de Metas</span>
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

	.question-card {
		padding: 2rem 1.5rem;
		border-radius: 24px;
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid rgba(0,0,0,0.03);
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
	}

	.choice-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
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
	}

	.choice-text {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-text, #333333);
	}

	/* FEEDBACK EXPLANATION BOX */
	.feedback-response-box {
		padding: 2.25rem 2rem;
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
		border-top: 4px solid var(--color-solar-green-medium, #3d8f68);
		box-shadow: 
			inset 0 0 20px rgba(61, 143, 104, 0.05),
			0 10px 30px rgba(61, 143, 104, 0.08);
	}

	.feedback-response-box:not(.correct) {
		background: rgba(254, 242, 242, 0.85);
		border-top: 4px solid var(--color-solar-terracotta, #e11d48);
		box-shadow: 
			inset 0 0 20px rgba(225, 29, 72, 0.05),
			0 10px 30px rgba(225, 29, 72, 0.08);
	}



	.action-row-feedback {
		margin-top: 2.25rem !important;
	}

	.w-full { width: 100%; }
	.items-start { align-items: flex-start; }
	.justify-between { justify-content: space-between; }
	.flex { display: flex; }
	.gap-2 { gap: 0.5rem; }
	.gap-4 { gap: 1rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1rem; }
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


	.feedback-badge-premium {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.75rem;
		font-weight: 850;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.35rem 0.85rem;
		border-radius: 10px;
	}

	.correct-badge {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
	}

	.incorrect-badge {
		background: #fee2e2;
		color: #991b1b;
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
</style>
