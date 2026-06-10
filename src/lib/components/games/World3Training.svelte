<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import { interactivityQuestions, type InteractivityQuestion } from '$lib/content/interactivityTrivia';
	import { supabase } from '$lib/supabase';

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
	
	let selectedAnswer = $state<'Corto' | 'Medio' | 'Largo' | null>(null);
	let isAnswered = $state(false);
	let isCorrect = $state(false);

	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);

	// State to track liked ideas locally
	let likedIdeas = $state<string[]>(player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(question: any) {
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
				driver: 'Ciclo: ' + question.correct,
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

	let isSubmitting = $state(false);
	let activeQuestions = $state<InteractivityQuestion[]>([]);

	// Secure Coins and Star Proportions
	const netScore = $derived(totalCorrect - totalIncorrect);
	const starsCount = $derived.by(() => {
		if (netScore >= 9) return 5;
		if (netScore >= 6) return 4;
		if (netScore >= 3) return 3;
		if (netScore >= 1) return 2;
		if (netScore >= -2) return 1;
		return 0;
	});
	const coinsEarned = $derived(starsCount * 5);

	// Lifetime Coins tracker
	const lifetimeCoinsEarned = $derived(player.game_state?.[world.id]?.training_coins_gained || 0);
	const remainingToCap = $derived(Math.max(0, 50 - lifetimeCoinsEarned));
	const actualCoinsAwarded = $derived(Math.min(remainingToCap, coinsEarned));

	function startTraining() {
		const shuffled = [...interactivityQuestions];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		activeQuestions = shuffled;
		gameStateStep = 'quiz';
		currentQuestionIndex = 0;
		totalCorrect = 0;
		totalIncorrect = 0;
		resetQuestionState();
	}

	function resetQuestionState() {
		selectedAnswer = null;
		isAnswered = false;
	}

	function checkAnswer(option: 'Corto' | 'Medio' | 'Largo') {
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
			resetQuestionState();
		} else {
			gameStateStep = 'summary';
		}
	}
</script>

<div class="training-game-wrapper text-center animate-fade">
	{#if gameStateStep === 'intro'}
		<!-- INTRO SCREEN -->
		<div class="intro-screen glass-card p-6" in:fade>
			<!-- Wilkins Mentor Profile Picture (GIOCHI layout adaptation) -->
			<div class="mentor-avatar-container animate-float mb-4 flex justify-center">
				<div class="mentor-bot-card">
					<div class="gear-backdrop animate-spin-slow">⚙️</div>
					<img 
						src="/learn_resoruces/characters/char_wilkins_animated.gif" 
						alt="John Wilkins" 
						class="mentor-bot-img"
						onerror={(e) => { e.currentTarget.src = '/learn_resoruces/characters/char_wilkins.png'; }}
					/>
				</div>
			</div>

			<span class="agency-tag">OMIE SIMULADOR</span>
			<h3 class="font-bold text-solar-green-dark">Relojería de la Interactividad</h3>
			
			<div class="speech-box mt-4 text-left">
				<p class="font-bold text-solar-green-dark mb-2">John Wilkins (El Relojero):</p>
				<p>"Para construir un aprendizaje lúdico y fluido, la meta, la acción del estudiante y el feedback de retorno deben encajar con la precisión de un cronógrafo. Calibremos tu exactitud con 10 escenarios reales de clase:"</p>
				<ul class="solar-bullets mt-3 flex flex-col gap-2">
					<li><strong>Clasifica el tamaño del ciclo:</strong> Determina si el bucle es <strong>Corto</strong> (segundos a minutos), <strong>Medio</strong> (1-3 días), o <strong>Largo</strong> (1 semana o más).</li>
					<li><strong>Puntuación Neta:</strong> Cada acierto suma <strong>+1 punto</strong> y cada fallo resta <strong>-1 punto</strong>.</li>
					<li><strong>Monedas BEM:</strong> Desbloquea hasta 5 estrellas de precisión. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!</li>
				</ul>
			</div>

			<button type="button" class="btn-solar-primary mt-6 justify-center w-full animate-solar-pulse" onclick={startTraining}>
				⚙️ Iniciar Calibrador de Ciclos
			</button>
		</div>
	{/if}

	{#if gameStateStep === 'quiz'}
		{@const currentQ = activeQuestions[currentQuestionIndex]}
		<!-- QUIZ SCREEN -->
		<div class="quiz-screen text-left animate-fade">
			<div class="quiz-header flex justify-between items-center mb-4 p-2 glass-card">
				<span class="q-progress">Escenario <strong>{currentQuestionIndex + 1}</strong> de {activeQuestions.length}</span>
				<span class="net-score-indicator" class:negative={netScore < 0}>
					Puntaje Neto: <strong>{netScore}</strong>
				</span>
			</div>

			{#if !isAnswered}
				<!-- Question Card -->
				<div class="question-card glass-card mb-6" in:fly={{ y: 20, duration: 400 }}>
					<span class="q-label">CASO DE ESTUDIO - MUNDO 3</span>
					<blockquote class="scenario-text mt-2">
						"{currentQ.scenario}"
					</blockquote>

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
								{opt === 'Corto' ? '⚡' : opt === 'Medio' ? '📅' : '⏳'}
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
							<span class="text-solar-green-dark">⚙️ ¡Engranaje Ajustado! (+1 Punto)</span>
						{:else}
							<span class="text-solar-terracotta">⚙️ Desalineación Detectada (-1 Punto)</span>
						{/if}
					</div>

					<!-- Mentor Mini Portrait -->
					<div class="mentor-feedback-row flex gap-4 items-center my-4">
						<img 
							src="/learn_resoruces/characters/char_wilkins.png" 
							alt="Wilkins" 
							class="w-12 h-12 rounded-full border-2 border-solar-green-medium bg-white"
						/>
						<div class="explanation-box flex-1">
							<p class="explanation-text text-sm leading-relaxed text-solar-text">
								{currentQ.explanation}
							</p>
						</div>
					</div>

					<div class="action-row-feedback mt-6">
						<button type="button" class="btn-solar-primary w-full justify-center" onclick={nextQuestion}>
							Siguiente Escenario ⚙️
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if gameStateStep === 'summary'}
		<!-- SUMMARY SCREEN -->
		<div class="summary-screen glass-card p-6" in:fade>
			<div class="success-badge">🏆</div>
			<h3>Entrenamiento Completado</h3>
			<p class="summary-desc">Has calibrado con éxito los ciclos del Mundo 3</p>

			<!-- STARS DISPLAY -->
			<div class="stars-display flex justify-center gap-2">
				{#each Array(5) as _, i}
					<span class="star-shape" class:active={i < starsCount}>★</span>
				{/each}
			</div>

			<!-- METRICS GRID -->
			<div class="score-card-stats">
				<div class="score-row">
					<span>Correctas</span>
					<span class="score-val correct">+{totalCorrect}</span>
				</div>
				<div class="score-row">
					<span>Incorrectas</span>
					<span class="score-val wrong">-{totalIncorrect}</span>
				</div>
				<div class="score-row">
					<span>Puntaje Net</span>
					<span class="score-val">{netScore}</span>
				</div>
			</div>

			<!-- REWARDS SUMMARY -->
			<div class="coins-earned-summary p-4 glass-card mb-6 text-center">
				{#if remainingToCap > 0}
					<span class="coin-badge-label font-bold text-xs text-solar-text-muted block">Monedas Ganadas en este intento:</span>
					<h2 class="text-solar-green-medium mt-1 text-2xl font-black">🪙 +{actualCoinsAwarded} BEM Coins</h2>
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
					<span class="coin-badge-label font-bold text-xs text-solar-text-muted block">Balance de Entrenamiento Completado:</span>
					<h3 class="text-solar-green-medium mt-1 text-xl">🪙 +0 BEM Coins</h3>
					<p class="text-xs text-solar-terracotta font-bold mt-1">
						¡Has alcanzado el límite máximo de 50 monedas para este entrenamiento! Aún puedes repetir el quiz, pero no se sumarán nuevas monedas.
					</p>
				{/if}
			</div>

			<!-- ACTIONS ROWS -->
			<div class="flex flex-col gap-3">
				<button type="button" class="btn-solar-secondary justify-center w-full" onclick={startTraining}>
					🔄 Volver a Calibrar Ciclos
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
							📨 Registrando Resultados...
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

	/* Mentor Avatar Card styling matching GIOCHI bot box model */
	.mentor-bot-card {
		width: 100px;
		height: 100px;
		background: #FFFDF4;
		border: 3.5px solid var(--color-solar-green-medium);
		border-radius: 50%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: var(--shadow-solar-md);
		overflow: hidden;
	}

	.mentor-bot-img {
		width: 90%;
		height: 90%;
		object-fit: cover;
		border-radius: 50%;
		z-index: 2;
	}

	.gear-backdrop {
		position: absolute;
		font-size: 5rem;
		opacity: 0.15;
		color: var(--color-solar-green-medium);
		z-index: 1;
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
		text-transform: uppercase;
		margin-bottom: 0.5rem;
	}

	.speech-box {
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		box-shadow: var(--shadow-solar-sm);
		padding: 1.5rem;
	}

	.solar-bullets li {
		list-style-type: circle;
		margin-left: 1rem;
		font-size: 0.85rem;
		color: var(--color-solar-text);
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
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-solar-bg);
		border: 1.5px solid var(--color-solar-card-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.95rem;
	}

	.choice-text {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-text);
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
	.stars-display {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin: 2rem 0;
		position: relative;
	}

	.stars-display::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 150px;
		height: 150px;
		background: radial-gradient(circle, rgba(255, 209, 102, 0.25) 0%, transparent 70%);
		z-index: 1;
		pointer-events: none;
		animation: solar-glow-pulse 4s ease-in-out infinite;
	}

	.star-shape {
		font-size: 3.5rem;
		color: #E5E7EB;
		position: relative;
		z-index: 2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.star-shape.active {
		color: var(--color-solar-yellow);
		text-shadow: 
			0 0 15px rgba(255, 209, 102, 0.6),
			0 0 30px rgba(255, 209, 102, 0.3);
		transform: scale(1.15) rotate(8deg);
		animation: star-entrance 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
	}

	/* Dynamic sequential delays for stars count */
	.star-shape.active:nth-child(1) { animation-delay: 0.1s; }
	.star-shape.active:nth-child(2) { animation-delay: 0.2s; }
	.star-shape.active:nth-child(3) { animation-delay: 0.3s; }
	.star-shape.active:nth-child(4) { animation-delay: 0.4s; }
	.star-shape.active:nth-child(5) { animation-delay: 0.5s; }

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
		max-width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin: 2rem 0;
		padding: 0;
		background: transparent;
		border: none;
		box-shadow: none;
	}

	.score-row {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1.25rem 1rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid var(--color-solar-card-border);
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.3s ease;
	}

	.score-row:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
		background: white;
	}

	.score-row span:first-child {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 800;
		margin-bottom: 0.35rem;
	}

	.score-val {
		font-family: var(--font-solar-header);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-solar-text);
	}

	.score-val.correct { color: var(--color-solar-green-medium); }
	.score-val.wrong { color: var(--color-solar-terracotta); }

	.action-row-feedback {
		margin-top: 2.25rem !important;
	}

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

	.animate-spin-slow {
		animation: spin 16s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
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
</style>
