<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import { trainingQuestionsPool, type TrainingQuestion } from '$lib/content/trivia';

	let { 
		world, 
		player, 
		onComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onComplete: () => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	// Local gameplay states
	let gameStateStep = $state('intro'); // 'intro', 'quiz', 'summary'
	let currentQuestionIndex = $state(0);
	
	let selectedAnswer = $state<string | null>(null);
	let isAnswered = $state(false);
	let isCorrect = $state(false);

	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);

	// Reactive scroll-to-top on state transitions
	$effect(() => {
		// Subscriptions
		gameStateStep;
		currentQuestionIndex;
		isAnswered;

		tick().then(() => {
			// Find scrollable layout elements in OMIE learning framework
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
			// Also reset top-level browser scrolls
			window.scrollTo({ top: 0, behavior: 'instant' });
		});
	});

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
			// Add 3 to final selected
			selected.push(...list.slice(0, 3));
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
			gameStateStep = 'summary';
		}
	}

	// Karma visual dot placement calculation: clamp between -3 and +3
	function getKarmaPercentage(correct: number, wrong: number) {
		const score = correct - wrong;
		const clamped = Math.max(-3, Math.min(3, score));
		return ((clamped + 3) / 6) * 100;
	}
</script>

<div class="training-game-wrapper text-center">
	{#if gameStateStep === 'intro'}
		<!-- INTRO SCREEN -->
		<div class="intro-screen glass-card" in:fade>
			<div class="giochi-avatar-container animate-float mb-4">
				<div class="giochi-bot">
					<div class="giochi-eyes">
						<div class="eye"></div>
						<div class="eye"></div>
					</div>
					<div class="giochi-body"></div>
					<div class="giochi-antenna"></div>
				</div>
			</div>

			<span class="agency-tag">OMIE SIMULADOR</span>
			<h3 class="font-bold text-solar-green-dark">Entrenamiento de Reconocimiento BEM</h3>
			
			<div class="speech-box mt-4 text-left p-4">
				<p>¡Bienvenido de nuevo, Agente en entrenamiento! Los mentores han preparado un desafío riguroso para calibrar tus instintos de diseño motivacional:</p>
				<ul class="solar-bullets mt-2">
					<li><strong>21 Escenarios Aleatorios:</strong> Responderás un flujo dinámico de casos seleccionados al azar (3 por cada uno de los 7 drivers).</li>
					<li><strong>Sistema de Karma en Vivo:</strong> Tus aciertos mueven la barra hacia el éxito (azul/verde), pero equivocarte (o aplicar mal un driver) empuja el indicador hacia atrás (rojo).</li>
					<li><strong>Estrellas de Calibración:</strong> Al final, se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!</li>
					<li><strong>Copa Máxima de 50 Monedas:</strong> Puedes entrenar y repetir cuantas veces quieras para calibrar tu karma, acumulando hasta un máximo de 50 monedas de por vida en este módulo.</li>
				</ul>
			</div>

			<button type="button" class="btn-solar-primary mt-6 justify-center w-full animate-solar-pulse" onclick={startTraining}>
				🧠 Iniciar Simulador BEM
			</button>
		</div>
	{/if}

	{#if gameStateStep === 'quiz'}
		<!-- QUIZ ACTIVE QUESTIONS -->
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

					<div class="scenario-context-pill mt-3 p-3 rounded-lg bg-black/5 text-xs text-solar-text-muted italic">
						<strong>Escenario:</strong> "{activeQuestions[currentQuestionIndex].scenario}"
					</div>

					<div class="explanation-box mt-3 text-sm">
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
	{/if}

	{#if gameStateStep === 'summary'}
		<!-- SUMMARY SCREEN AND SAVE ACTION -->
		<div class="summary-screen glass-card p-6" in:fade>
			<span class="success-badge animate-solar-pulse">🎓</span>
			<h3>Evaluación de Calibración Completada</h3>
			<p class="summary-desc">Revisa tus barras de Karma BEM y reclama tus BEM Coins acumuladas.</p>

			<!-- STARS RATING INTERFACE -->
			<div class="stars-display flex justify-center gap-2 mb-6">
				{#each Array(5) as _, i}
					<span class="star-shape" class:active={i < starsCount}>★</span>
				{/each}
			</div>

			<!-- DETAILS SCORE BOARD -->
			<div class="score-card-stats glass-card mb-6">
				<div class="score-row">
					<span>Aciertos:</span>
					<span class="score-val correct">{totalCorrect}</span>
				</div>
				<div class="score-row">
					<span>Errores:</span>
					<span class="score-val wrong">{totalIncorrect}</span>
				</div>
				<div class="score-row border-t pt-2 mt-2">
					<span>Puntaje Neto final:</span>
					<span class="score-val font-bold">{netScore} pts</span>
				</div>
			</div>

			<!-- KARMA PROGRESS BARS (7 DRIVERS) -->
			<div class="karma-section text-left mb-6 p-6 glass-card">
				<h4 class="karma-title text-center mb-4">🔮 ALINEACIÓN DE TU KARMA BEM</h4>
				<p class="text-xs text-center text-solar-text-muted mb-6">
					El Karma inicia al centro (0). Los aciertos lo mueven a la derecha (+ verde) y los errores o respuestas incorrectas cruzadas lo mueven a la izquierda (- rojo).
				</p>
				
				<div class="karma-bars-list flex flex-col gap-5">
					{#each Object.keys(driverStats) as driver}
						{@const correct = driverStats[driver].correct}
						{@const wrong = driverStats[driver].wrong}
						{@const karma = correct - wrong}
						{@const pct = getKarmaPercentage(correct, wrong)}
						
						<div class="karma-bar-item flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pb-4 border-b border-dashed border-solar-card-border">
							<span class="driver-name font-bold text-solar-green-dark text-sm">{driver}</span>
							
							<div class="karma-track-wrapper flex-1 flex items-center gap-3">
								<span class="track-limit wrong text-xs font-bold text-solar-terracotta">-3</span>
								<div class="karma-track relative w-full h-3 bg-gray-200 rounded-full">
									<!-- Zero Center Marker -->
									<div class="karma-mid-line absolute left-1/2 top-0 w-0.5 h-full bg-gray-400 z-10"></div>

									<!-- Sliding Dot -->
									<div 
										class="karma-dot absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md transition-all duration-500 z-20" 
										style="left: {pct}%" 
										class:red={karma < 0} 
										class:green={karma > 0}
										class:neutral={karma === 0}
									></div>
								</div>
								<span class="track-limit correct text-xs font-bold text-solar-green-medium">+3</span>
							</div>

							<span class="score-indicator-pill text-xs font-bold px-2 py-1 rounded" class:red={karma < 0} class:green={karma > 0}>
								{karma > 0 ? '+' : ''}{karma} Karma
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- REWARDS SUMMARY -->
			<div class="coins-earned-summary p-4 glass-card mb-6 text-center">
				{#if remainingToCap > 0}
					<span class="coin-badge-label">Monedas Ganadas en este intento:</span>
					<h2 class="text-solar-green-medium mt-1">🪙 +{actualCoinsAwarded} BEM Coins</h2>
					{#if coinsEarned > actualCoinsAwarded}
						<p class="text-xs text-solar-terracotta font-bold mt-1">
							(Llegaste al límite máximo. Monedas acumuladas de entrenamiento: {lifetimeCoinsEarned + actualCoinsAwarded}/50)
						</p>
					{:else}
						<p class="text-xs text-solar-text-muted mt-1">
							(Monedas acumuladas en este módulo: {lifetimeCoinsEarned + actualCoinsAwarded}/50)
						</p>
					{/if}
				{:else}
					<span class="coin-badge-label">Balance de Entrenamiento Completado:</span>
					<h3 class="text-solar-green-medium mt-1">🪙 +0 BEM Coins</h3>
					<p class="text-xs text-solar-terracotta font-bold mt-1">
						¡Has alcanzado el límite máximo de 50 monedas para este entrenamiento! Aún puedes repetir el quiz para mejorar tu Karma, pero no se sumarán nuevas monedas.
					</p>
				{/if}
			</div>

			<!-- ACTIONS ROWS -->
			<div class="flex flex-col gap-3">
				<button type="button" class="btn-solar-secondary justify-center w-full" onclick={startTraining}>
					🔄 Volver a Intentar Entrenamiento
				</button>

				<form
					method="POST"
					action="?/completeTrainingTrivia"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'success' && result.data) {
								onUpdateCoins(result.data.coins, result.data.game_state);
								onComplete();
							}
							await update();
						};
					}}
				>
					<input type="hidden" name="world_id" value={world.id} />
					<input type="hidden" name="coins" value={actualCoinsAwarded} />

					<button type="submit" class="btn-solar-primary w-full justify-center" disabled={isSubmitting}>
						{#if isSubmitting}
							📨 Archivando resultados en Roster...
						{:else}
							🚪 Registrar Resultados & Salir del Entrenamiento
						{/if}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.training-game-wrapper {
		max-width: 720px;
		margin: 0 auto;
		padding: 1rem;
	}

	.agency-tag {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-sky);
		background: var(--color-solar-sky-light);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.speech-box {
		background: var(--color-solar-bg);
		border-radius: 16px;
		border: 1px solid rgba(0,0,0,0.05);
	}

	.solar-bullets {
		padding-left: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.85rem;
		color: var(--color-solar-text);
		line-height: 1.5;
	}

	.solar-bullets li {
		list-style-type: circle;
	}

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
	.choice-btn.selected {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
	}

	.choice-btn.correct-feed {
		border-color: var(--color-solar-green-medium) !important;
		background: #D1F5E3 !important;
	}

	.choice-btn.correct-feed .choice-indicator {
		background: var(--color-solar-green-medium);
		border-color: var(--color-solar-green-dark);
		color: white;
	}

	.choice-btn.wrong-feed {
		border-color: var(--color-solar-terracotta) !important;
		background: #FEE2E2 !important;
	}

	.choice-btn.wrong-feed .choice-indicator {
		background: var(--color-solar-terracotta);
		border-color: var(--color-solar-terracotta);
		color: white;
	}

	/* FEEDBACK EXPLANATION BOX */
	.feedback-response-box {
		padding: 1.5rem;
		border-radius: 20px;
		border-left: 5px solid;
	}

	.feedback-response-box.correct {
		background: #F0FDF4;
		border-color: var(--color-solar-green-medium);
		color: #166534;
	}

	.feedback-response-box:not(.correct) {
		background: #FFFBEB;
		border-color: var(--color-solar-yellow);
		color: #92400E;
	}

	.feedback-title {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.05rem;
	}

	.explanation-text {
		font-size: 0.85rem;
		line-height: 1.5;
		font-weight: 600;
	}

	/* STARS DISPLAY */
	.stars-display {
		font-size: 3rem;
		line-height: 1;
	}

	.star-shape {
		color: #E5E7EB;
		text-shadow: 0 1px 2px rgba(0,0,0,0.05);
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.star-shape.active {
		color: var(--color-solar-yellow);
		text-shadow: 0 0 12px var(--color-solar-yellow);
		transform: scale(1.1) rotate(5deg);
	}

	/* SUMMARY SCREEN */
	.success-badge {
		font-size: 4rem;
		margin-bottom: 0.5rem;
	}

	.summary-screen h3 {
		font-family: var(--font-solar-header);
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.summary-desc {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		margin: 0.25rem 0 1.5rem 0;
		font-weight: 550;
	}

	.score-card-stats {
		max-width: 360px;
		margin: 0 auto;
		padding: 1.25rem 1.5rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid var(--color-solar-card-border);
	}

	.score-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-text-muted);
	}

	.score-val {
		font-size: 1.1rem;
		color: var(--color-solar-text);
	}

	.score-val.correct { color: var(--color-solar-green-medium); }
	.score-val.wrong { color: var(--color-solar-terracotta); }

	/* KARMA INTERACTIVE PROGRESS BARS */
	.karma-section {
		background: rgba(255,255,255,0.7);
		border-radius: 24px;
		border: 1px solid var(--color-solar-card-border);
	}

	.karma-title {
		font-family: var(--font-solar-header);
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		letter-spacing: 0.05em;
	}

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

	.karma-fill {
		top: 0;
		height: 100%;
		border-radius: 9999px;
		z-index: 5;
		transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.negative-fill {
		background: linear-gradient(to left, rgba(224, 122, 95, 0.6), var(--color-solar-terracotta));
	}

	.positive-fill {
		background: linear-gradient(to right, rgba(61, 143, 104, 0.6), var(--color-solar-green-medium));
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

	.coins-earned-summary {
		background: rgba(255, 209, 102, 0.08);
		border: 1px solid rgba(255, 209, 102, 0.25);
		border-radius: 20px;
	}

	.coin-badge-label {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* GIOCHI Bot Portrait styling */
	.giochi-avatar-container {
		display: flex;
		justify-content: center;
	}

	.giochi-bot {
		width: 80px;
		height: 70px;
		background: var(--color-solar-sky-light, #e1f4fc);
		border: 3px solid var(--color-solar-sky, #188db5);
		border-radius: 22px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: var(--shadow-solar-md);
	}

	.giochi-eyes {
		display: flex;
		gap: 0.5rem;
	}

	.giochi-eyes .eye {
		width: 16px;
		height: 16px;
		background: var(--color-solar-green-dark, #1e4533);
		border-radius: 50%;
		border: 2.5px solid white;
		position: relative;
	}

	.giochi-eyes .eye::after {
		content: '';
		width: 4px;
		height: 4px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
	}

	.giochi-body {
		width: 40px;
		height: 8px;
		background: var(--color-solar-yellow, #ffd166);
		border-radius: 4px;
		position: absolute;
		bottom: -4px;
		border: 2.5px solid var(--color-solar-sky, #188db5);
	}

	.giochi-antenna {
		width: 4px;
		height: 14px;
		background: var(--color-solar-sky, #188db5);
		position: absolute;
		top: -14px;
		border-radius: 2px;
	}

	.giochi-antenna::before {
		content: '';
		width: 10px;
		height: 10px;
		background: var(--color-solar-yellow, #ffd166);
		border-radius: 50%;
		position: absolute;
		top: -8px;
		left: -3px;
		box-shadow: 0 0 8px var(--color-solar-yellow, #ffd166);
	}

	.w-full { width: 100%; }
	.justify-center { justify-content: center; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.flex-col { flex-direction: column; }
	.gap-2 { gap: 0.5rem; }
	.gap-3 { gap: 0.75rem; }
	.gap-4 { gap: 1rem; }
	.mb-3 { margin-bottom: 0.75rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mt-1 { margin-top: 0.25rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1rem; }
	.mt-6 { margin-top: 1.5rem; }
	.border-t { border-top: 1px solid var(--color-solar-card-border); }
	.pt-2 { padding-top: 0.5rem; }
</style>
