<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import { trainingQuestionsPool as staticTrainingQuestionsPool, type TrainingQuestion } from '$lib/content/trivia';

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
	const trainingQuestionsPool: TrainingQuestion[] = world.training_modules?.questions?.length
		? world.training_modules.questions
		: staticTrainingQuestionsPool;

	// State to track liked ideas locally
	let likedIdeas = $state<string[]>(player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(question: any) {
		let currentLiked = [...likedIdeas];
		
		// Create safe deep copy of game_state
		const state = { ...player.game_state };
		if (!state.ideas) {
			state.ideas = [];
		}

		if (currentLiked.includes(question.id)) {
			// Remove it
			currentLiked = currentLiked.filter(id => id !== question.id);
			state.ideas = state.ideas.filter((i: any) => i.id !== question.id);
		} else {
			// Add it
			currentLiked.push(question.id);
			state.ideas.push({
				id: question.id,
				driver: question.driver,
				scenario: question.scenario,
				explanation: question.explanation,
				likedAt: new Date().toISOString()
			});
		}
		
		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;
		player.game_state = state;

		// Trigger onUpdateCoins to notify parent component and update local player state
		onUpdateCoins(player.coins, state);

		// Save via server action — the browser no longer writes course_players directly
		if (player.id) {
			const formData = new FormData();
			formData.append('game_state', JSON.stringify(state));
			await fetch('?/syncPlayerState', { method: 'POST', body: formData });
		}
	}

	// Local gameplay states
	let gameStateStep = $state('quiz'); // directly start in quiz
	let currentQuestionIndex = $state(0);
	
	let selectedAnswer = $state<string | null>(null);
	let isAnswered = $state(false);
	let isCorrect = $state(false);

	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);

	let isSubmitting = $state(false);
	let activeQuestions = $state<TrainingQuestion[]>([]);

	// 7 BEM Motivators Karma state tracking
	let driverStats = $state<Record<string, { correct: number; wrong: number }>>({
		Hedonismo: { correct: 0, wrong: 0 },
		Eficiencia: { correct: 0, wrong: 0 },
		Relacionamiento: { correct: 0, wrong: 0 },
		Maestría: { correct: 0, wrong: 0 },
		Descubrimiento: { correct: 0, wrong: 0 },
		Empoderamiento: { correct: 0, wrong: 0 },
		Propósito: { correct: 0, wrong: 0 }
	});

	// Automatically generate questions on load
	generateRandomizedQuestions();

	// Reactive scroll-to-top on state transitions
	$effect(() => {
		gameStateStep;
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

	// Secure Coins and Star Proportions
	const netScore = $derived(totalCorrect - totalIncorrect);
	const starsCount = $derived.by(() => {
		if (netScore >= 18) return 5;
		if (netScore >= 12) return 4;
		if (netScore >= 6) return 3;
		if (netScore >= 1) return 2;
		if (netScore >= -5) return 1;
		return 0;
	});
	const coinsEarned = $derived(starsCount * 5);

	// Lifetime Coins tracker from cookies/db
	const lifetimeCoinsEarned = $derived(player.game_state?.[world.id]?.training_coins_gained || 0);
	const remainingToCap = $derived(Math.max(0, 50 - lifetimeCoinsEarned));
	const actualCoinsAwarded = $derived(Math.min(remainingToCap, coinsEarned));

	// Randomization logic: Select 3 random questions for each of the 7 drivers, giving exactly 21 questions.
	function generateRandomizedQuestions() {
		const grouped: Record<string, TrainingQuestion[]> = {
			Hedonismo: [],
			Eficiencia: [],
			Relacionamiento: [],
			Maestría: [],
			Descubrimiento: [],
			Empoderamiento: [],
			Propósito: []
		};

		// Populate groups
		trainingQuestionsPool.forEach(q => {
			if (grouped[q.driver]) {
				grouped[q.driver].push(q);
			}
		});

		const selected: TrainingQuestion[] = [];

		// For each group, shuffle and pick exactly 3
		Object.keys(grouped).forEach(driver => {
			const list = [...grouped[driver]];
			// Fisher-Yates shuffle
			for (let i = list.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[list[i], list[j]] = [list[j], list[i]];
			}
			// Add 3 to final selected, cloning the question and its options array
			list.slice(0, 3).forEach(q => {
				const clonedQ = {
					...q,
					options: [...q.options]
				};
				// Fisher-Yates shuffle on options
				for (let k = clonedQ.options.length - 1; k > 0; k--) {
					const l = Math.floor(Math.random() * (k + 1));
					[clonedQ.options[k], clonedQ.options[l]] = [clonedQ.options[l], clonedQ.options[k]];
				}
				selected.push(clonedQ);
			});
		});

		// Shuffle the final 21 questions so they appear in a fully random order
		for (let i = selected.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[selected[i], selected[j]] = [selected[j], selected[i]];
		}

		activeQuestions = selected;
	}

	function startTraining() {
		generateRandomizedQuestions();
		gameStateStep = 'quiz';
		currentQuestionIndex = 0;
		totalCorrect = 0;
		totalIncorrect = 0;
		
		// Reset driver statistics
		driverStats = {
			Hedonismo: { correct: 0, wrong: 0 },
			Eficiencia: { correct: 0, wrong: 0 },
			Relacionamiento: { correct: 0, wrong: 0 },
			Maestría: { correct: 0, wrong: 0 },
			Descubrimiento: { correct: 0, wrong: 0 },
			Empoderamiento: { correct: 0, wrong: 0 },
			Propósito: { correct: 0, wrong: 0 }
		};

		resetQuestionState();
	}

	function resetQuestionState() {
		selectedAnswer = null;
		isAnswered = false;
	}

	function checkAnswer(option: string) {
		if (isAnswered) return;

		selectedAnswer = option;
		isAnswered = true;
		
		const currentQ = activeQuestions[currentQuestionIndex];
		isCorrect = option === currentQ.correct;

		// Correct BEM Driver name
		const correctDriver = currentQ.driver;

		if (isCorrect) {
			totalCorrect++;
			if (driverStats[correctDriver]) {
				driverStats[correctDriver].correct++;
			}
		} else {
			totalIncorrect++;
			
			// Penalize the correct driver because they missed it
			if (driverStats[correctDriver]) {
				driverStats[correctDriver].wrong++;
			}
			
			// Penalize the misapplied chosen driver as well
			if (driverStats[option]) {
				driverStats[option].wrong++;
			}
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < activeQuestions.length - 1) {
			currentQuestionIndex++;
			resetQuestionState();
		} else {
			onGameComplete({ totalCorrect, totalIncorrect, driverStats });
		}
	}

	// Karma visual dot placement calculation: clamp between -3 and +3
	function getKarmaPercentage(correct: number, wrong: number) {
		const score = correct - wrong;
		const clamped = Math.max(-3, Math.min(3, score));
		return ((clamped + 3) / 6) * 100;
	}
</script>

<div class="quiz-screen text-left" in:fade>
	<div class="quiz-header flex justify-between items-center mb-4 p-2 glass-card">
		<span class="q-progress">Escenario <strong>{currentQuestionIndex + 1}</strong> de {activeQuestions.length}</span>
		<span class="net-score-indicator" class:negative={netScore < 0}>
			Puntaje Neto: <strong>{netScore}</strong>
		</span>
	</div>

	{#if !isAnswered}
		<!-- Question Card -->
		<div class="question-card glass-card mb-6" in:fly={{ y: 20, duration: 400 }}>
			<span class="q-label">CASO DE ESTUDIO</span>
			<blockquote class="scenario-text mt-2">
				"{activeQuestions[currentQuestionIndex].scenario}"
			</blockquote>
			
			<div class="idea-btn-container">
				<button 
					type="button" 
					class="btn-like-idea"
					class:liked={isIdeaLiked(activeQuestions[currentQuestionIndex].id)}
					onclick={() => toggleIdea(activeQuestions[currentQuestionIndex])}
				>
					{#if isIdeaLiked(activeQuestions[currentQuestionIndex].id)}
						💡 ¡Es una Idea en mi Bitácora!
					{:else}
						💡 Me gusta. Volver una Idea
					{/if}
				</button>
			</div>
		</div>

		<!-- Choices Grid -->
		<div class="choices-grid">
			{#each activeQuestions[currentQuestionIndex].options as opt}
				<button
					type="button"
					class="choice-btn"
					onclick={() => checkAnswer(opt)}
				>
					<span class="choice-indicator">•</span>
					<span class="choice-text">{opt}</span>
				</button>
			{/each}
		</div>
	{:else}
		<!-- Feedback dialog replacing the question -->
		<div class="feedback-response-box glass-card" class:correct={isCorrect} in:fade={{ duration: 300 }}>
			<div class="feedback-title flex items-center gap-2 text-lg font-bold pb-2 border-b border-black/5">
				{#if isCorrect}
					<span class="text-solar-green-dark">🤖 ¡Bip-bip! ¡Espectro Correcto! (+1 Karma)</span>
				{:else}
					<span class="text-solar-terracotta">🤖 ¡Bup! Calibración Incorrecta (-1 Karma)</span>
				{/if}
			</div>

			<!-- Scenario Feedback Card -->
			<div class="scenario-feedback-card">
				<div class="scenario-header-row">
					<div class="scenario-text-desc">
						<strong>Escenario:</strong> "{activeQuestions[currentQuestionIndex].scenario}"
					</div>
					<div class="flex-shrink-0">
						<button 
							type="button" 
							class="btn-like-idea"
							class:liked={isIdeaLiked(activeQuestions[currentQuestionIndex].id)}
							onclick={() => toggleIdea(activeQuestions[currentQuestionIndex])}
						>
							{#if isIdeaLiked(activeQuestions[currentQuestionIndex].id)}
								💡 ¡Es una Idea!
							{:else}
								💡 Volver una Idea
							{/if}
						</button>
					</div>
				</div>
			</div>

			<div class="explanation-box">
				<h6 class="font-bold text-xs uppercase tracking-wider text-solar-green-dark mb-1">Análisis BEM:</h6>
				<p class="explanation-text">
					{activeQuestions[currentQuestionIndex].explanation}
				</p>
			</div>

			<!-- Live Karma Feedback Sliders -->
			<div class="live-karma-feedback mt-4 p-4 rounded-xl bg-white/60 border border-black/5 shadow-inner">
				<h5 class="text-xs font-bold uppercase tracking-wider text-solar-green-dark mb-3 text-center">
					🔮 Calibración de Karma en Vivo
				</h5>
				<div class="flex flex-col gap-3">
					{#each Object.keys(driverStats) as driver}
						{@const correct = driverStats[driver].correct}
						{@const wrong = driverStats[driver].wrong}
						{@const karma = correct - wrong}
						{@const pct = getKarmaPercentage(correct, wrong)}
						
						<div class="karma-bar-item flex items-center justify-between gap-3">
							<span class="driver-name font-bold text-solar-green-dark text-[11px] w-28 truncate">{driver}</span>
							
							<div class="karma-track-wrapper flex-1 flex items-center gap-2">
								<span class="track-limit wrong text-[10px] font-bold text-solar-terracotta">-3</span>
								<div class="karma-track relative w-full h-2.5 bg-gray-200/80 rounded-full">
									<!-- Zero Center Marker -->
									<div class="karma-mid-line absolute left-1/2 top-0 w-0.5 h-full bg-gray-400/50 z-10"></div>

									<!-- Sliding Dot -->
									<div 
										class="karma-dot absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow transition-all duration-500 z-20" 
										style="left: {pct}%" 
										class:red={karma < 0} 
										class:green={karma > 0}
										class:neutral={karma === 0}
									></div>
								</div>
								<span class="track-limit correct text-[10px] font-bold text-solar-green-medium">+3</span>
							</div>

							<span class="score-indicator-pill text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[50px] text-center" class:red={karma < 0} class:green={karma > 0}>
								{karma > 0 ? '+' : ''}{karma}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="action-row-feedback mt-8 flex justify-end">
				<button type="button" class="btn-solar-primary btn-sm animate-solar-pulse" onclick={nextQuestion}>
					{currentQuestionIndex === activeQuestions.length - 1 ? 'Ver Evaluación Final ➜' : 'Siguiente Escenario ➜'}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>





	.quiz-screen {
		max-width: 680px;
		margin: 0 auto;
	}

	.q-progress {
		font-size: 0.85rem;
		font-weight: 850;
		color: var(--color-solar-green-medium);
	}

	.net-score-indicator {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
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
		background: var(--color-solar-bg);
		border: 1px solid rgba(0,0,0,0.03);
	}

	.q-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.scenario-text {
		font-family: var(--font-solar-header);
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.5rem 0 0 0;
		line-height: 1.5;
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
		border: 2px solid var(--color-solar-card-border);
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
		border-color: var(--color-solar-green-medium);
		box-shadow: var(--shadow-solar-sm);
	}

	.choice-indicator {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-solar-bg);
		border: 1.5px solid var(--color-solar-card-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
	}

	.choice-text {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-text);
	}

	/* Choice submission feedback states */





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
		border-top: 4px solid var(--color-solar-green-medium);
		box-shadow: 
			inset 0 0 20px rgba(61, 143, 104, 0.05),
			0 10px 30px rgba(61, 143, 104, 0.08);
	}

	.feedback-response-box:not(.correct) {
		background: rgba(255, 251, 235, 0.85);
		border-top: 4px solid var(--color-solar-terracotta);
		box-shadow: 
			inset 0 0 20px rgba(224, 122, 95, 0.05),
			0 10px 30px rgba(224, 122, 95, 0.08);
	}

	.feedback-title {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.2rem;
		letter-spacing: -0.01em;
	}

	.explanation-text {
		font-size: 0.85rem;
		line-height: 1.5;
		font-weight: 600;
	}

	/* STARS DISPLAY */




	/* Dynamic sequential delays for stars count */

	@keyframes star-entrance {
		from {
			transform: scale(0) rotate(-45deg);
			opacity: 0;
		}
		to {
			transform: scale(1.15) rotate(8deg);
			opacity: 1;
		}
	}

	@keyframes solar-glow-pulse {
		0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
		50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
	}

	/* SUMMARY SCREEN */









	/* KARMA INTERACTIVE PROGRESS BARS */


	.karma-bar-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		border-bottom: 1px dashed rgba(0, 0, 0, 0.04);
		padding-bottom: 0.75rem;
	}

	.karma-bar-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.driver-name {
		font-size: 0.85rem;
		width: 130px;
		color: var(--color-solar-green-dark);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.karma-track-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.track-limit {
		font-size: 0.7rem;
		font-weight: 800;
		width: 15px;
	}

	.track-limit.wrong { color: var(--color-solar-terracotta); text-align: right; }
	.track-limit.correct { color: var(--color-solar-green-medium); text-align: left; }

	.karma-track {
		flex: 1;
		height: 12px;
		background: #E5E7EB;
		border-radius: 9999px;
		position: relative;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
	}

	.karma-mid-line {
		position: absolute;
		left: 50%;
		top: 0;
		width: 2px;
		height: 100%;
		background: rgba(0, 0, 0, 0.25);
		z-index: 10;
	}




	.karma-dot {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition: left 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
		box-shadow: 0 3px 6px rgba(0,0,0,0.25);
		z-index: 20;
	}

	/* Dynamic dot colors based on Karma state */
	.karma-dot.neutral {
		background: #cbd5e1;
		border: 2px solid #94a3b8;
		box-shadow: 0 0 6px rgba(148, 163, 184, 0.4);
	}

	.karma-dot.green {
		background: var(--color-solar-green-medium);
		border: 2px solid var(--color-solar-green-dark);
		box-shadow: 0 0 12px rgba(61, 143, 104, 0.7);
	}

	.karma-dot.red {
		background: var(--color-solar-terracotta);
		border: 2px solid #b91c1c;
		box-shadow: 0 0 12px rgba(224, 122, 95, 0.7);
	}

	.score-indicator-pill {
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.25rem 0.75rem;
		border-radius: 8px;
		text-align: center;
		background: #F3F4F6;
		color: var(--color-solar-text-muted);
		min-width: 80px;
		display: inline-block;
	}

	.action-row-feedback {
		margin-top: 2.25rem !important;
	}

	.score-indicator-pill.green { background: var(--color-solar-green-light); color: var(--color-solar-green-dark); }
	.score-indicator-pill.red { background: #fee2e2; color: #b91c1c; }



	/* GIOCHI Bot Portrait styling */








	.w-full { width: 100%; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.flex-col { flex-direction: column; }
	.gap-2 { gap: 0.5rem; }
	.gap-3 { gap: 0.75rem; }
	.mb-3 { margin-bottom: 0.75rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1rem; }

	/* LIKE IDEA BUTTON STYLES */
	.idea-btn-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.25rem;
		width: 100%;
	}

	.btn-like-idea {
		background: #ffffff;
		border: 2px solid var(--color-solar-card-border);
		color: var(--color-solar-green-dark);
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: 12px;
		font-weight: 750;
		font-size: 0.8rem;
		font-family: var(--font-solar-body), sans-serif;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		outline: none;
	}

	.btn-like-idea:hover {
		transform: translateY(-2px);
		border-color: var(--color-solar-yellow);
		background: #FFFDF4;
		box-shadow: var(--shadow-solar-md);
	}

	.btn-like-idea.liked {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		border-color: var(--color-solar-yellow);
		box-shadow: 0 4px 12px rgba(255, 209, 102, 0.4);
		animation: idea-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes idea-pop {
		0% { transform: scale(1); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	/* PREMIUM FEEDBACK CARD STYLES */
	.flex { display: flex; }
	.flex-shrink-0 { flex-shrink: 0; }

	.scenario-feedback-card {
		margin-top: 1rem;
		padding: 1.25rem 1.5rem;
		border-radius: 20px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	.scenario-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
	}

	@media (max-width: 640px) {
		.scenario-header-row {
			flex-direction: column;
			align-items: flex-end;
		}
	}

	.scenario-text-desc {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-solar-text-muted);
		font-style: italic;
		font-weight: 550;
	}

	.explanation-box {
		margin-top: 1.5rem;
		padding-left: 1.25rem;
		border-left: 3px solid var(--color-solar-green-medium);
	}
</style>
