<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { goalsTriviaQuestions, type GoalsTriviaQuestion } from '$lib/content/goalsTrivia';
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

		if (supabase && player.id) {
			await supabase
				.from('course_players')
				.update({ game_state: state })
				.eq('id', player.id);
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
			onGameComplete({ totalCorrect, totalIncorrect });
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
				<div class="feedback-response-box glass-card" class:correct={isCorrect} in:fade={{ duration: 300 }}>
					<div class="feedback-title flex items-center gap-2 text-lg font-bold pb-2 border-b border-black/5">
						{#if isCorrect}
							<span class="text-solar-green-dark">🌟 ¡Calibración Correcta! (+1 Punto)</span>
						{:else}
							<span class="text-solar-terracotta">❌ Desalineación de Metas (+0 Puntos)</span>
						{/if}
					</div>

					<div class="user-selection-summary my-2 p-3 rounded bg-white/40 border border-black/5">
						<p class="text-xs text-solar-text-muted">Tu respuesta:</p>
						<p class="text-sm font-semibold" class:text-solar-green-dark={isCorrect} class:text-solar-terracotta={!isCorrect}>
							{selectedAnswer}
						</p>
						{#if !isCorrect}
							<p class="text-xs text-solar-text-muted mt-2">Respuesta correcta:</p>
							<p class="text-sm font-bold text-solar-green-dark">{currentQ.correct}</p>
						{/if}
					</div>

					<!-- Mentor Mini Portrait -->
					<div class="mentor-feedback-row flex gap-4 items-start my-4">
						<img 
							src="/learn_resoruces/characters/char_kira.png" 
							alt="Kira" 
							class="mentor-portrait"
						/>
						<div class="explanation-box flex-1">
							<span class="mentor-label text-[10px] font-extrabold text-solar-green-medium uppercase tracking-wider">Kira Yamada</span>
							<p class="explanation-text text-sm leading-relaxed text-solar-text mt-0.5">
								"{currentQ.explanation}"
							</p>
						</div>
					</div>

					<div class="action-row-feedback mt-6">
						<button type="button" class="btn-solar-primary w-full justify-center" onclick={nextQuestion}>
							Siguiente Pregunta 🧭
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

	.feedback-title {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 1.2rem;
		letter-spacing: -0.01em;
	}

	.explanation-text {
		font-size: 0.85rem;
		line-height: 1.5;
		font-weight: 600;
	}

	.action-row-feedback {
		margin-top: 2.25rem !important;
	}

	.w-full { width: 100%; }
	.items-start { align-items: flex-start; }
	.justify-between { justify-content: space-between; }
	.flex { display: flex; }
	.flex-shrink-0 { flex-shrink: 0; }
	.object-cover { object-fit: cover; }
	.gap-2 { gap: 0.5rem; }
	.gap-4 { gap: 1rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
	.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
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

	.mentor-portrait {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid var(--color-solar-green-medium, #3d8f68);
		background-color: #ffffff;
		flex-shrink: 0;
		object-fit: cover;
	}
</style>
