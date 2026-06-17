<script lang="ts">
	import { tick } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { trainingCards, type GFRCard } from '$lib/content/gfrCards';
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

	// Initialize 10 random cards from training cards pool on load
	const shuffled = [...trainingCards];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	let activeTrainingCards = $state<GFRCard[]>(shuffled.slice(0, 10));

	// Gameplay states
	let currentRoundIndex = $state(0);
	let selectedCol = $state<'meta' | 'retroalimentacion' | 'recompensa' | null>(null);
	let selectedRow = $state<'regulatorio' | 'integrado' | 'intrinseco' | null>(null);
	let isAnswered = $state(false);

	let totalCorrectCols = $state(0);
	let totalCorrectRows = $state(0);
	let totalPerfectRounds = $state(0);
	let personalScore = $state(0); // Max 20 points (10 rounds * 2)

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

	// Scroll to top on step/round change
	$effect(() => {
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
			window.scrollTo({ top: 0, behavior: 'instant' });
		});
	});

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
			onGameComplete({ totalCorrectCols, totalCorrectRows, totalPerfectRounds, personalScore });
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

<div class="training-game-wrapper" in:fade>
	{#if activeCard}
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
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-solar-primary-premium:hover:not(:disabled) {
		transform: translateY(-3px) scale(1.02);
		box-shadow: 0 8px 24px rgba(61, 143, 104, 0.4);
	}

	.btn-solar-primary-premium:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.flex { display: flex; }
	.gap-4 { gap: 1rem; }

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
