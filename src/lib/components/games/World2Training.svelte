<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { fade, slide, fly, scale } from 'svelte/transition';
	import { trainingCards, type GFRCard } from '$lib/content/gfrCards';
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

	// Gameplay states
	let gameStateStep = $state('intro'); // 'intro', 'quiz', 'summary'
	let currentRoundIndex = $state(0);
	let activeTrainingCards = $state<GFRCard[]>([]);

	// State to track liked ideas locally
	let likedIdeas = $state<string[]>(player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(card: GFRCard) {
		let currentLiked = [...likedIdeas];
		
		// Create safe deep copy of game_state
		const state = { ...player.game_state };
		if (!state.ideas) {
			state.ideas = [];
		}

		if (currentLiked.includes(card.id)) {
			// Remove it
			currentLiked = currentLiked.filter(id => id !== card.id);
			state.ideas = state.ideas.filter((i: any) => i.id !== card.id);
		} else {
			// Add it
			currentLiked.push(card.id);
			state.ideas.push({
				id: card.id,
				driver: `${card.rii.toUpperCase()} - ${card.gfr.toUpperCase()}`,
				scenario: card.text,
				explanation: card.explanation,
				likedAt: new Date().toISOString()
			});
		}
		
		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;
		player.game_state = state;

		// Trigger onUpdateCoins to notify parent component and update local player state
		onUpdateCoins(player.coins, state);

		// Save to Supabase in the background
		if (supabase && player.id) {
			await supabase
				.from('course_players')
				.update({ game_state: state })
				.eq('id', player.id);
		}
	}

	let selectedCol = $state<'meta' | 'retroalimentacion' | 'recompensa' | null>(null);
	let selectedRow = $state<'regulatorio' | 'integrado' | 'intrinseco' | null>(null);
	let isAnswered = $state(false);

	let totalCorrectCols = $state(0);
	let totalCorrectRows = $state(0);
	let totalPerfectRounds = $state(0);
	let personalScore = $state(0); // Max 20 points (10 rounds * 2)

	let isSubmitting = $state(false);

	// Scroll to top on step change
	$effect(() => {
		gameStateStep;
		currentRoundIndex;
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
		});
	});

	// Secure Coins and Star Proportions
	const starsCount = $derived.by(() => {
		if (personalScore >= 18) return 5;
		if (personalScore >= 14) return 4;
		if (personalScore >= 10) return 3;
		if (personalScore >= 6) return 2;
		if (personalScore >= 1) return 1;
		return 0;
	});
	const coinsEarned = $derived(starsCount * 5);

	// Lifetime Coins tracker
	const lifetimeCoinsEarned = $derived(player.game_state?.[world.id]?.training_coins_gained || 0);
	const remainingToCap = $derived(Math.max(0, 50 - lifetimeCoinsEarned));
	const actualCoinsAwarded = $derived(Math.min(remainingToCap, coinsEarned));

	// Select 10 random cards from training cards pool
	function startTraining() {
		const shuffled = [...trainingCards];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		activeTrainingCards = shuffled.slice(0, 10);

		gameStateStep = 'quiz';
		currentRoundIndex = 0;
		totalCorrectCols = 0;
		totalCorrectRows = 0;
		totalPerfectRounds = 0;
		personalScore = 0;
		resetRoundState();
	}

	function resetRoundState() {
		selectedCol = null;
		selectedRow = null;
		isAnswered = false;
	}

	const activeCard = $derived(activeTrainingCards[currentRoundIndex] || null);

	function checkSelection(row: 'regulatorio' | 'integrado' | 'intrinseco', col: 'meta' | 'retroalimentacion' | 'recompensa') {
		if (isAnswered || !activeCard) return;

		selectedRow = row;
		selectedCol = col;
		isAnswered = true;

		const isColCorrect = col === activeCard.gfr;
		const isRowCorrect = row === activeCard.rii;

		let pointsEarned = 0;
		if (isColCorrect && isRowCorrect) {
			pointsEarned = 2;
			totalPerfectRounds++;
			totalCorrectCols++;
			totalCorrectRows++;
		} else {
			if (isColCorrect) {
				pointsEarned = 1;
				totalCorrectCols++;
			}
			if (isRowCorrect) {
				pointsEarned = 1;
				totalCorrectRows++;
			}
		}

		personalScore += pointsEarned;
	}

	function nextRound() {
		if (currentRoundIndex < activeTrainingCards.length - 1) {
			currentRoundIndex++;
			resetRoundState();
		} else {
			gameStateStep = 'summary';
		}
	}

	const rowLabels = {
		regulatorio: 'Regulatorio',
		integrado: 'Integrado',
		intrinseco: 'Intrínseco'
	};

	const colLabels = {
		meta: 'Meta (Goal)',
		retroalimentacion: 'Retroalimentación (Feedback)',
		recompensa: 'Recompensa (Reward)'
	};
</script>

<div class="training-game-wrapper">
	{#if gameStateStep === 'intro'}
		<div class="intro-screen glass-card-premium" in:fly={{ y: 30, duration: 500 }}>
			<div class="giochi-avatar-container animate-float">
				<div class="giochi-bot">
					<div class="giochi-eyes">
						<div class="eye"></div>
						<div class="eye"></div>
					</div>
					<div class="giochi-body"></div>
					<div class="giochi-antenna"></div>
				</div>
			</div>

			<span class="agency-tag-premium font-bold">OMIE SIMULADOR GFR</span>
			<h3 class="game-title">
				Entrenamiento de Clasificación GFR
			</h3>
			
			<div class="speech-box-premium">
				<p class="intro-text">¡Bienvenido, Agente! Este módulo calibrará tus habilidades para distinguir los componentes del diseño gamificado bajo el modelo GFR (Goal, Feedback, Reward) y la Teoría de la Autodeterminación (RII):</p>
				<ul class="solar-bullets">
					<li><strong>10 Casos de Estudio:</strong> Clasificarás 10 tarjetas aleatorias en la cuadrícula de 3x3.</li>
					<li><strong>Reglas de Puntaje:</strong> Obtienes <strong>+2 puntos</strong> por ubicar perfectamente la tarjeta. Si solo aciertas en un eje (ya sea la columna GFR o la fila de regulación RII), recibes <strong>+1 punto</strong>.</li>
					<li><strong>Calibración de Estrellas:</strong> Dependiendo de tus aciertos, ganarás hasta 5 estrellas de calibración. Cada estrella te otorga <strong>+5 BEM Coins</strong>.</li>
					<li><strong>Capa Máxima de 50 Monedas:</strong> Puedes practicar cuantas veces lo necesites para dominar el modelo, acumulando hasta un total de 50 monedas en este entrenamiento.</li>
				</ul>
			</div>

			<button type="button" class="btn-solar-primary-premium animate-solar-pulse" onclick={startTraining}>
				🧠 Iniciar Simulador GFR
			</button>
		</div>
	{/if}

	{#if gameStateStep === 'quiz' && activeCard}
		<div class="quiz-screen" in:fly={{ y: 20, duration: 400 }}>
			
			<!-- Game Header / Scoreboard Panel -->
			<div class="quiz-header glass-card-premium">
				<div class="header-left">
					<span class="q-progress">
						TARJETA <strong class="highlight-green">{currentRoundIndex + 1}</strong> DE 10
					</span>
					<div class="progress-bar-container">
						<div class="progress-bar-fill" style="width: {(currentRoundIndex + 1) * 10}%"></div>
					</div>
				</div>
				<div class="header-right">
					<span class="net-score-indicator">
						PUNTAJE: <strong class="highlight-green">{personalScore} / 20 PTS</strong>
					</span>
				</div>
			</div>

			<!-- Active holographic game card OR feedback dialog -->
			{#if !isAnswered}
				{#key currentRoundIndex}
					<div class="active-flashcard" in:scale={{ start: 0.95, duration: 300 }}>
						<div class="card-inner-glow"></div>
						<div class="flashcard-layout">
							<div class="flashcard-avatar-container">
								<img src="/learn_resoruces/characters/char_kira_animated.gif" alt="Kira" class="flashcard-char-avatar" />
							</div>
							<div class="flashcard-content">
								<div class="card-tag">TARJETA DE EVALUACIÓN</div>
								<div class="card-quote">
									"{activeCard.text}"
								</div>
								<div class="card-hint">Haz clic en la casilla correspondiente del tablero para clasificar esta tarjeta</div>
								
								<!-- LIKE IDEA BUTTON -->
								<div class="idea-btn-container">
									<button
										type="button"
										class="btn-like-idea"
										class:liked={isIdeaLiked(activeCard.id)}
										onclick={() => toggleIdea(activeCard)}
									>
										{#if isIdeaLiked(activeCard.id)}
											💡 ¡Es una Idea en mi Bitácora!
										{:else}
											💡 Me gusta. Volver una Idea
										{/if}
									</button>
								</div>
							</div>
						</div>
					</div>
				{/key}
			{:else}
				<div 
					class="feedback-dialog-premium" 
					class:correct={selectedCol === activeCard.gfr && selectedRow === activeCard.rii} 
					class:partial={(selectedCol === activeCard.gfr || selectedRow === activeCard.rii) && !(selectedCol === activeCard.gfr && selectedRow === activeCard.rii)} 
					in:fly={{ y: 20, duration: 400 }}
				>
					<div class="feedback-title-row">
						{#if selectedCol === activeCard.gfr && selectedRow === activeCard.rii}
							<div class="feedback-title correct">
								<span class="icon">✨</span> ¡Calibración Perfecta! (+2 pts)
							</div>
						{:else if selectedCol === activeCard.gfr || selectedRow === activeCard.rii}
							<div class="feedback-title partial">
								<span class="icon">⚡</span> Calibración Parcial (+1 pt)
							</div>
						{:else}
							<div class="feedback-title wrong">
								<span class="icon">⚠️</span> Calibración Incorrecta (+0 pts)
							</div>
						{/if}
					</div>

					<div class="feedback-card-text">
						<span class="feedback-card-label">Tarjeta evaluada:</span>
						<p class="feedback-quote">"{activeCard.text}"</p>
					</div>

					<div class="solution-and-expl flex gap-4">
						<div class="location-solution">
							Ubicación esperada: <strong>{rowLabels[activeCard.rii]}</strong> &bull; <strong>{colLabels[activeCard.gfr]}</strong>
						</div>
						{#if selectedCol && selectedRow}
							<div class="location-user" class:correct-loc={selectedCol === activeCard.gfr && selectedRow === activeCard.rii} class:wrong-loc={selectedCol !== activeCard.gfr || selectedRow !== activeCard.rii}>
								Tu respuesta: <strong>{rowLabels[selectedRow]}</strong> &bull; <strong>{colLabels[selectedCol]}</strong>
							</div>
						{/if}
					</div>

					<div class="explanation-box">
						<span class="explanation-label">Explicación teórica:</span>
						<p class="explanation-text">{activeCard.explanation}</p>
					</div>

					<div class="action-footer">
						<!-- LIKE IDEA BUTTON IN FEEDBACK -->
						<button
							type="button"
							class="btn-like-idea"
							class:liked={isIdeaLiked(activeCard.id)}
							onclick={() => toggleIdea(activeCard)}
							style="margin-right: auto;"
						>
							{#if isIdeaLiked(activeCard.id)}
								💡 ¡Es una Idea!
							{:else}
								💡 Volver una Idea
							{/if}
						</button>
						<button type="button" class="btn-solar-primary-premium btn-sm" onclick={nextRound}>
							{currentRoundIndex === 9 ? 'Ver Resultados Finales ➜' : 'Siguiente Tarjeta ➜'}
						</button>
					</div>
				</div>
			{/if}

			<!-- Board slot matrix grid layout -->
			<div class="board-matrix-container glass-card-premium">
				<div class="board-grid">
					
					<!-- Column Headers Row -->
					<div class="grid-header-row">
						<div class="corner-header"></div>
						<div class="col-header">
							<div class="header-pill meta">Meta (Goal)</div>
						</div>
						<div class="col-header">
							<div class="header-pill feedback">Retroalimentación (Feedback)</div>
						</div>
						<div class="col-header">
							<div class="header-pill reward">Recompensa (Reward)</div>
						</div>
					</div>

					<!-- Matrix Rows -->
					{#each ['regulatorio', 'integrado', 'intrinseco'] as r}
						<div class="grid-row">
							<div class="row-header">
								<span class="row-badge {r}">{rowLabels[r]}</span>
							</div>

							{#each ['meta', 'retroalimentacion', 'recompensa'] as c}
								{@const isCorrectCell = activeCard.rii === r && activeCard.gfr === c}
								{@const isChosenCell = selectedRow === r && selectedCol === c}
								
								<div class="grid-cell">
									<button
										type="button"
										class="matrix-slot-btn"
										class:cell-unanswered={!isAnswered}
										class:correct-cell={isAnswered && isCorrectCell}
										class:wrong-cell={isAnswered && isChosenCell && !isCorrectCell}
										class:missed-cell={isAnswered && isCorrectCell && !isChosenCell}
										disabled={isAnswered}
										onclick={() => checkSelection(r, c)}
									>
										<span class="slot-text-rii">{rowLabels[r]}</span>
										<span class="slot-text-gfr">{colLabels[c].split(' ')[0]}</span>
										
										{#if isAnswered}
											{#if isCorrectCell}
												<span class="status-badge correct">✅ Correcto</span>
											{:else if isChosenCell}
												<span class="status-badge wrong">❌ Incorrecto</span>
											{/if}
										{:else}
											<span class="hover-action-text">Ubicar aquí</span>
										{/if}
									</button>
								</div>
							{/each}
						</div>
					{/each}

				</div>
			</div>
		</div>
	{/if}

	{#if gameStateStep === 'summary'}
		<div class="summary-screen glass-card-premium" in:fly={{ y: 30, duration: 500 }}>
			<div class="trophy-badge animate-float">🏅</div>
			<h3 class="game-title">Entrenamiento Completado</h3>
			<p class="summary-desc">Has concluido la calibración de tu simulador de diseño gamificado GFR.</p>

			<!-- Premium Stars rating with animated SVG shapes -->
			<div class="stars-display">
				{#each Array(5) as _, i}
					<div 
						class="star-wrapper" 
						class:active={i < starsCount}
						in:scale={{ delay: i * 150, duration: 300 }}
					>
						<svg class="star-svg" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
						</svg>
					</div>
				{/each}
			</div>

			<!-- Performance stats card -->
			<div class="score-card-stats-premium">
				<div class="score-stat-row">
					<span class="stat-label">Aciertos de Categoría (Goal, Feedback, Reward)</span>
					<span class="stat-value">{totalCorrectCols} / 10</span>
				</div>
				<div class="score-stat-row">
					<span class="stat-label">Aciertos de Regulación (Teoría RII)</span>
					<span class="stat-value">{totalCorrectRows} / 10</span>
				</div>
				<div class="score-stat-row">
					<span class="stat-label">Ubicaciones Perfectas (Matriz 3x3)</span>
					<span class="stat-value highlight-green">{totalPerfectRounds} / 10</span>
				</div>
				<div class="score-stat-row total">
					<span class="stat-label">Puntaje Final</span>
					<span class="stat-value highlight-green">{personalScore} / 20 pts</span>
				</div>
			</div>

			<!-- Coins award summary -->
			<div class="coins-earned-summary-premium">
				{#if remainingToCap > 0}
					<span class="coin-badge-label">Monedas obtenidas en este intento</span>
					<h2 class="coin-awarded-amount">🪙 +{actualCoinsAwarded} BEM Coins</h2>
					
					<!-- Progress meter toward 50 coin cap -->
					<div class="coin-cap-progress-container">
						<div class="progress-labels">
							<span>Monedas acumuladas en este entrenamiento</span>
							<span>{lifetimeCoinsEarned + actualCoinsAwarded} / 50</span>
						</div>
						<div class="coin-cap-bar-bg">
							<div class="coin-cap-bar-fill" style="width: {Math.min(100, ((lifetimeCoinsEarned + actualCoinsAwarded) / 50) * 100)}%"></div>
						</div>
					</div>
				{:else}
					<span class="coin-badge-label capped">Entrenamiento al Máximo</span>
					<h2 class="coin-awarded-amount capped">🪙 +0 BEM Coins</h2>
					<div class="capped-alert-box">
						¡Ya has alcanzado el límite máximo de 50 monedas otorgadas por entrenamientos de este mundo!
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="summary-actions">
				<button type="button" class="btn-solar-secondary-premium" onclick={startTraining}>
					🔄 Volver a Calibrar
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

					<button type="submit" class="btn-solar-primary-premium" disabled={isSubmitting}>
						{#if isSubmitting}
							📨 Registrando bitácora...
						{:else}
							🚪 Guardar & Volver al Mapa
						{/if}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.training-game-wrapper {
		max-width: 840px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		font-family: var(--font-solar-body), sans-serif;
	}

	/* Solarpunk Glassmorphism Premium Cards */
	.glass-card-premium {
		background: #ffffff;
		border: 2px solid var(--color-solar-green-medium);
		border-radius: var(--radius-solar-lg);
		padding: 2.5rem;
		box-shadow: 
			0 15px 35px rgba(30, 69, 51, 0.08),
			inset 0 1px 3px rgba(255, 255, 255, 0.9);
		margin-bottom: 2rem;
		text-align: center;
	}

	.giochi-avatar-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.agency-tag-premium {
		display: inline-block;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		color: var(--color-solar-green-dark);
		background: var(--color-solar-green-light);
		padding: 0.4rem 1.2rem;
		border-radius: var(--radius-solar-full);
		border: 1.5px solid rgba(61, 143, 104, 0.2);
		margin-bottom: 1rem;
	}

	.game-title {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 2.2rem;
		color: var(--color-solar-green-dark);
		margin: 0.5rem 0 1.5rem;
		line-height: 1.2;
	}

	.speech-box-premium {
		background: var(--color-solar-yellow-light);
		border: 1.5px solid rgba(255, 209, 102, 0.4);
		padding: 1.75rem;
		border-radius: var(--radius-solar-md);
		text-align: left;
		margin-bottom: 2rem;
	}

	.intro-text {
		font-weight: 600;
		color: var(--color-solar-green-dark);
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.solar-bullets {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.solar-bullets li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.solar-bullets li::before {
		content: '⚡';
		position: absolute;
		left: 0;
		top: 2px;
		font-size: 0.85rem;
	}

	/* Game Interactive Header */
	.quiz-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 2rem;
		border: 2px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		background: #ffffff;
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex: 1;
	}

	.q-progress {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		color: var(--color-solar-text-muted);
		white-space: nowrap;
	}

	.highlight-green {
		color: var(--color-solar-green-medium);
	}

	.progress-bar-container {
		height: 8px;
		background: var(--color-solar-green-light);
		border-radius: 99px;
		overflow: hidden;
		flex: 1;
		max-width: 250px;
	}

	.progress-bar-fill {
		height: 100%;
		background: var(--color-solar-green-medium);
		border-radius: 99px;
		transition: width 0.3s ease;
	}

	.net-score-indicator {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		color: var(--color-solar-text-muted);
	}

	/* holographic Flashcard */
	.active-flashcard {
		background: linear-gradient(135deg, #FFFCF5 0%, #FFF4D9 100%);
		border: 2.5px solid var(--color-solar-yellow);
		border-radius: var(--radius-solar-md);
		padding: 2.5rem 2rem;
		margin-bottom: 2rem;
		text-align: center;
		position: relative;
		overflow: hidden;
		box-shadow: 
			0 12px 28px rgba(255, 209, 102, 0.25),
			inset 0 1px 3px #ffffff;
	}

	.flashcard-layout {
		display: flex;
		align-items: center;
		gap: 2rem;
		text-align: left;
		position: relative;
		z-index: 2;
	}

	.flashcard-avatar-container {
		flex-shrink: 0;
		width: 110px;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.7);
		border: 3px solid var(--color-solar-yellow);
		border-radius: 50%;
		box-shadow: var(--shadow-solar-sm);
		overflow: hidden;
	}

	.flashcard-char-avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.flashcard-content {
		flex-grow: 1;
	}

	.card-inner-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%);
		pointer-events: none;
		z-index: 1;
	}

	.card-tag {
		position: relative;
		z-index: 10;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.2em;
		color: hsl(20, 80%, 40%);
		margin-bottom: 1rem;
		text-transform: uppercase;
	}

	.card-quote {
		position: relative;
		z-index: 10;
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.6rem;
		color: var(--color-solar-green-dark);
		line-height: 1.4;
		max-width: 680px;
		margin: 0 auto 1.5rem;
	}

	.card-hint {
		position: relative;
		z-index: 10;
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		font-weight: 600;
		font-style: italic;
	}

	/* Board Grid Matrix Style */
	.board-matrix-container {
		background: #ffffff;
		border: 2.5px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-lg);
		padding: 2rem;
		box-shadow: var(--shadow-solar-md);
		margin-bottom: 2rem;
		overflow-x: auto;
	}

	.board-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 720px;
	}

	.grid-header-row {
		display: grid;
		grid-template-columns: 160px repeat(3, 1fr);
		gap: 0.75rem;
		align-items: center;
	}

	.corner-header {
		height: 10px;
	}

	.col-header {
		display: flex;
		justify-content: center;
	}

	.header-pill {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 0.85rem;
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-solar-sm);
		text-align: center;
		white-space: nowrap;
		box-shadow: var(--shadow-solar-sm);
		border: 1.5px solid rgba(0, 0, 0, 0.05);
	}

	.header-pill.meta { background: #ffe4e6; color: #b91c1c; }
	.header-pill.feedback { background: #e0f2fe; color: #0369a1; }
	.header-pill.reward { background: #f3e8ff; color: #6b21a8; }

	.grid-row {
		display: grid;
		grid-template-columns: 160px repeat(3, 1fr);
		gap: 0.75rem;
		align-items: center;
	}

	.row-header {
		display: flex;
		justify-content: flex-end;
		padding-right: 1rem;
	}

	.row-badge {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 0.85rem;
		padding: 0.4rem 1rem;
		border-radius: var(--radius-solar-sm);
		background: #f3f4f6;
		color: var(--color-solar-green-dark);
		border: 1.5px solid rgba(0, 0, 0, 0.05);
		width: 100%;
		text-align: center;
	}

	.row-badge.regulatorio { background: #fff1f2; color: #be123c; }
	.row-badge.integrado { background: #f0fdf4; color: #15803d; }
	.row-badge.intrinseco { background: #f0f9ff; color: #0369a1; }

	/* Interactive Card Button Inside Matrix */
	.matrix-slot-btn {
		width: 100%;
		min-height: 110px;
		padding: 1.25rem 1rem;
		border-radius: var(--radius-solar-md);
		border: 2px dashed rgba(61, 143, 104, 0.25);
		background: rgba(250, 249, 246, 0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		outline: none;
	}

	.matrix-slot-btn:disabled {
		cursor: not-allowed;
	}

	.slot-text-rii {
		font-size: 0.6rem;
		text-transform: uppercase;
		font-weight: 700;
		opacity: 0.5;
	}

	.slot-text-gfr {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
	}

	.hover-action-text {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.matrix-slot-btn:hover:not(:disabled) {
		background: #ffffff;
		border-color: var(--color-solar-green-medium);
		box-shadow: var(--shadow-solar-md);
		transform: translateY(-3px);
	}

	.matrix-slot-btn:hover:not(:disabled) .hover-action-text {
		opacity: 1;
	}

	/* Matrix Response State Cards */
	.correct-cell {
		background: rgba(209, 245, 227, 0.8) !important;
		border: 2.5px solid var(--color-solar-green-medium) !important;
		box-shadow: 0 8px 16px rgba(16, 185, 129, 0.12);
	}

	.correct-cell .slot-text-gfr {
		color: var(--color-solar-green-dark);
	}

	.wrong-cell {
		background: rgba(254, 226, 226, 0.85) !important;
		border: 2.5px solid var(--color-solar-terracotta) !important;
		box-shadow: 0 8px 16px rgba(239, 68, 68, 0.12);
		animation: shake 0.4s ease-in-out;
	}

	.wrong-cell .slot-text-gfr {
		color: #991b1b;
	}

	.missed-cell {
		background: rgba(255, 255, 255, 0.2) !important;
		border: 2.5px solid rgba(0, 0, 0, 0.05) !important;
		opacity: 0.45;
	}

	.missed-cell .slot-text-gfr {
		color: var(--color-solar-text-muted);
	}

	.status-badge {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.2rem 0.6rem;
		border-radius: var(--radius-solar-full);
		color: white;
		margin-top: 0.25rem;
	}

	.status-badge.correct { background: var(--color-solar-green-medium); }
	.status-badge.wrong { background: var(--color-solar-terracotta); }

	/* Feedback dialogue block */
	.feedback-dialog-premium {
		background: #ffffff;
		border-radius: var(--radius-solar-md);
		padding: 2rem;
		border: 2px solid var(--color-solar-card-border);
		box-shadow: var(--shadow-solar-md);
		text-align: left;
	}

	.feedback-dialog-premium.correct { border-left: 6px solid var(--color-solar-green-medium); }
	.feedback-dialog-premium.partial { border-left: 6px solid var(--color-solar-sky); }
	.feedback-dialog-premium:not(.correct):not(.partial) { border-left: 6px solid var(--color-solar-terracotta); }

	.feedback-title-row {
		margin-bottom: 0.75rem;
	}

	.feedback-title {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.35rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.feedback-title.correct { color: var(--color-solar-green-medium); }
	.feedback-title.partial { color: var(--color-solar-sky); }
	.feedback-title.wrong { color: var(--color-solar-terracotta); }

	.location-solution {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		background: #f9fafb;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		display: inline-block;
		font-weight: 600;
	}

	.feedback-card-text {
		margin-bottom: 1.25rem;
		background: #fffcf4;
		border: 1.5px solid rgba(255, 209, 102, 0.25);
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius-solar-sm);
	}

	.feedback-card-label {
		display: block;
		font-size: 0.65rem;
		font-weight: 800;
		color: hsl(20, 80%, 40%);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.feedback-quote {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.25rem;
		color: var(--color-solar-green-dark);
		line-height: 1.4;
		margin: 0;
	}

	.solution-and-expl {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.location-user {
		font-size: 0.8rem;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		display: inline-block;
		font-weight: 600;
	}

	.location-user.correct-loc {
		color: var(--color-solar-green-medium);
		background: #ecfdf5;
	}

	.location-user.wrong-loc {
		color: var(--color-solar-terracotta);
		background: #fdf2f2;
	}

	.explanation-box {
		background: var(--color-solar-bg);
		border-radius: var(--radius-solar-sm);
		padding: 1.25rem;
		border: 1px solid var(--color-solar-card-border);
		margin-bottom: 1.5rem;
	}

	.explanation-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.35rem;
	}

	.explanation-text {
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 0;
		color: var(--color-solar-text);
		font-weight: 550;
	}

	.action-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* LIKE IDEA BUTTON STYLES */
	.idea-btn-container {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
		width: 100%;
	}

	.btn-like-idea {
		background: #ffffff;
		border: 2px solid var(--color-solar-green-medium);
		color: var(--color-solar-green-dark);
		cursor: pointer;
		padding: 0.4rem 0.8rem;
		border-radius: var(--radius-solar-md);
		font-weight: 700;
		font-size: 0.75rem;
		font-family: var(--font-solar-body), sans-serif;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
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
		50% { transform: scale(1.15); }
		100% { transform: scale(1); }
	}

	/* Summary Results screen */
	.summary-screen {
		text-align: center;
		padding: 3rem 2rem;
	}

	.trophy-badge {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.summary-desc {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 2rem 0;
		font-weight: 550;
	}

	.stars-display {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 2.5rem;
	}

	.star-wrapper {
		transform: scale(1);
		transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.star-wrapper.active {
		transform: scale(1.15);
	}

	.star-svg {
		width: 4rem;
		height: 4rem;
		color: #e5e7eb;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
		transition: all 0.3s ease;
	}

	.star-wrapper.active .star-svg {
		color: var(--color-solar-yellow);
		filter: drop-shadow(0 0 15px rgba(255, 209, 102, 0.85));
	}

	.score-card-stats-premium {
		background: #ffffff;
		border: 2px solid var(--color-solar-card-border);
		border-radius: var(--radius-solar-md);
		padding: 1.5rem;
		max-width: 500px;
		margin: 0 auto 2rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.score-stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 0.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.score-stat-row:last-child {
		border-bottom: none;
	}

	.score-stat-row.total {
		font-size: 1.15rem;
		font-weight: 800;
		padding-top: 1.25rem;
		margin-top: 0.5rem;
		border-top: 2px solid var(--color-solar-card-border);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		font-weight: 600;
		text-align: left;
	}

	.stat-value {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-solar-green-dark);
		white-space: nowrap;
	}

	/* Coins Panel & cap */
	.coins-earned-summary-premium {
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border: 2px solid var(--color-solar-green-medium);
		border-radius: var(--radius-solar-md);
		padding: 2rem;
		max-width: 500px;
		margin: 0 auto 2.5rem;
		box-shadow: 0 10px 25px rgba(22, 163, 74, 0.08);
	}

	.coin-badge-label {
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-solar-green-medium);
	}

	.coin-badge-label.capped {
		color: var(--color-solar-terracotta);
	}

	.coin-awarded-amount {
		font-family: var(--font-solar-header);
		font-weight: 850;
		font-size: 2rem;
		margin: 0.5rem 0 1rem;
		color: var(--color-solar-green-dark);
	}

	.coin-awarded-amount.capped {
		color: var(--color-solar-terracotta);
	}

	.coin-cap-progress-container {
		text-align: left;
	}

	.progress-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--color-solar-text-muted);
		margin-bottom: 0.35rem;
	}

	.coin-cap-bar-bg {
		height: 8px;
		background: rgba(61, 143, 104, 0.15);
		border-radius: 99px;
		overflow: hidden;
	}

	.coin-cap-bar-fill {
		height: 100%;
		background: var(--color-solar-green-medium);
		border-radius: 99px;
		transition: width 0.6s ease;
	}

	.capped-alert-box {
		font-size: 0.75rem;
		font-weight: 700;
		color: #991b1b;
		background: #fee2e2;
		border: 1.5px solid #fca5a5;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-top: 0.5rem;
	}

	.summary-actions, .btn-solar-primary-premium, .btn-solar-secondary-premium {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.btn-solar-primary-premium {
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 1rem;
		color: #ffffff;
		background: linear-gradient(135deg, var(--color-solar-green-medium), var(--color-solar-green-dark));
		border: none;
		border-radius: var(--radius-solar-md);
		padding: 0.9rem 2rem;
		box-shadow: 0 4px 15px rgba(61, 143, 104, 0.25);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		text-align: center;
	}

	.btn-solar-primary-premium:hover:not(:disabled) {
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 8px 24px rgba(61, 143, 104, 0.4);
	}

	.btn-solar-primary-premium:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-solar-secondary-premium {
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-solar-green-dark);
		background: var(--color-solar-green-light);
		border: 2px solid rgba(61, 143, 104, 0.2);
		border-radius: var(--radius-solar-md);
		padding: 0.9rem 2rem;
		cursor: pointer;
		transition: all 0.25s ease;
		text-align: center;
	}

	.btn-solar-secondary-premium:hover {
		background: #ffffff;
		border-color: var(--color-solar-green-medium);
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
	}

	/* Shake Animation for Wrong Cell */
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20%, 60% { transform: translateX(-6px); }
		40%, 80% { transform: translateX(6px); }
	}

	/* Responsive tweaks */
	@media (max-width: 768px) {
		.flashcard-layout {
			flex-direction: column;
			text-align: center;
			gap: 1.25rem;
		}
		.flashcard-avatar-container {
			width: 95px;
			height: 95px;
		}
		.grid-header-row, .grid-row {
			grid-template-columns: 120px repeat(3, 1fr);
		}
		.row-badge {
			font-size: 0.75rem;
			padding: 0.3rem 0.5rem;
		}
		.matrix-slot-btn {
			min-height: 90px;
			padding: 0.75rem 0.5rem;
		}
		.slot-text-gfr {
			font-size: 0.8rem;
		}
		.card-quote {
			font-size: 1.3rem;
		}
	}
</style>
