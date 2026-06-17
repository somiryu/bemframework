<script lang="ts">
	import { scale, fade } from 'svelte/transition';

	let {
		worldId,
		totalCorrect,
		totalIncorrect,
		netScore,
		starsCount,
		actualCoinsAwarded,
		lifetimeCoinsEarned,
		remainingToCap,
		isSubmitting,
		onRetry,
		children,
		// optional custom rows to render in stats board
		customStats = []
	}: {
		worldId: number;
		totalCorrect: number;
		totalIncorrect: number;
		netScore: number;
		starsCount: number;
		actualCoinsAwarded: number;
		lifetimeCoinsEarned: number;
		remainingToCap: number;
		isSubmitting: boolean;
		onRetry: () => void;
		children?: any;
		customStats?: { label: string; value: string | number; highlight?: boolean }[];
	} = $props();
</script>

<div class="summary-screen glass-card p-6" in:fade>
	<div class="trophy-badge animate-float">🏅</div>
	<h3 class="game-title">Entrenamiento Completado</h3>
	<p class="summary-desc">Has concluido la calibración de tu simulador de aprendizaje.</p>

	<!-- Premium Stars rating with animated SVG shapes -->
	<div class="stars-display flex justify-center gap-2 mb-6">
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
	<div class="score-card-stats-premium mb-6">
		{#if customStats.length > 0}
			{#each customStats as stat}
				<div class="score-stat-row" class:total={stat.highlight}>
					<span class="stat-label">{stat.label}</span>
					<span class="stat-value" class:highlight-green={stat.highlight}>{stat.value}</span>
				</div>
			{/each}
		{:else}
			<div class="score-stat-row">
				<span class="stat-label">Aciertos:</span>
				<span class="stat-value correct">{totalCorrect}</span>
			</div>
			<div class="score-stat-row">
				<span class="stat-label">Errores:</span>
				<span class="stat-value wrong">{totalIncorrect}</span>
			</div>
			<div class="score-stat-row total border-t pt-2 mt-2">
				<span class="stat-label">Puntaje Neto Final</span>
				<span class="stat-value highlight-green">{netScore} pts</span>
			</div>
		{/if}
	</div>

	<!-- Coins award summary -->
	<div class="coins-earned-summary-premium mb-6 p-4 glass-card text-center">
		{#if remainingToCap > 0}
			<span class="coin-badge-label">Monedas obtenidas en este intento:</span>
			<h2 class="coin-awarded-amount mt-1 text-solar-green-medium font-bold">🪙 +{actualCoinsAwarded} BEM Coins</h2>
			
			<!-- Progress meter toward 50 coin cap -->
			<div class="coin-cap-progress-container mt-3">
				<div class="progress-labels flex justify-between text-xs text-solar-text-muted mb-1">
					<span>Monedas acumuladas en este entrenamiento:</span>
					<strong>{lifetimeCoinsEarned + actualCoinsAwarded} / 50</strong>
				</div>
				<div class="coin-cap-bar-bg">
					<div class="coin-cap-bar-fill" style="width: {Math.min(100, ((lifetimeCoinsEarned + actualCoinsAwarded) / 50) * 100)}%"></div>
				</div>
			</div>
		{:else}
			<span class="coin-badge-label capped font-bold text-solar-terracotta">Entrenamiento al Máximo</span>
			<h2 class="coin-awarded-amount capped mt-1 text-solar-green-medium font-bold">🪙 +0 BEM Coins</h2>
			<div class="capped-alert-box mt-2 text-xs text-solar-terracotta font-semibold">
				¡Ya has alcanzado el límite máximo de 50 monedas otorgadas por entrenamientos de este mundo! Aún puedes repetir para mejorar tu puntaje.
			</div>
		{/if}
	</div>

	<!-- Extra slot/children content (e.g. World 1 Karma bars) -->
	{#if children}
		<div class="extra-summary-content mb-6">
			{@render children()}
		</div>
	{/if}

	<!-- Actions -->
	<div class="summary-actions flex flex-col gap-3">
		<button type="button" class="btn-solar-secondary justify-center w-full" onclick={onRetry}>
			🔄 Volver a Intentar Entrenamiento
		</button>

		<input type="hidden" name="world_id" value={worldId} />
		<input type="hidden" name="coins" value={actualCoinsAwarded} />

		<button type="submit" class="btn-solar-primary w-full justify-center" disabled={isSubmitting}>
			{#if isSubmitting}
				💾 Archivando resultados en Roster...
			{:else}
				🚪 Registrar Resultados & Salir
			{/if}
		</button>
	</div>
</div>

<style>
	.summary-screen {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
		box-sizing: border-box;
	}

	.trophy-badge {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	.game-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.5rem;
		font-weight: 850;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.5rem 0;
	}

	.summary-desc {
		font-size: 0.88rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0 0 1.5rem 0;
	}

	/* Stars Display */
	.star-wrapper {
		display: inline-block;
		width: 36px;
		height: 36px;
		color: #e5e7eb;
		transition: all 0.3s ease;
	}

	.star-wrapper.active {
		color: var(--color-solar-yellow, #ffd166);
		filter: drop-shadow(0 0 4px rgba(255, 209, 102, 0.6));
	}

	.star-svg {
		width: 100%;
		height: 100%;
	}

	/* Stats board styling */
	.score-card-stats-premium {
		background: rgba(255, 255, 255, 0.65);
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		box-sizing: border-box;
	}

	.score-stat-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--color-solar-text, #4b5563);
		font-weight: 600;
	}

	.score-stat-row.total {
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.stat-value {
		font-weight: 800;
	}

	.stat-value.correct {
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.stat-value.wrong {
		color: var(--color-solar-terracotta, #e11d48);
	}

	.highlight-green {
		color: var(--color-solar-green-medium, #3d8f68) !important;
	}

	/* Actions and coins styling */
	.coin-badge-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #6b7280);
	}

	.coin-awarded-amount {
		font-size: 1.5rem;
	}

	.coin-awarded-amount.capped {
		color: var(--color-solar-terracotta, #e11d48);
	}

	.coin-cap-bar-bg {
		background-color: #e5e7eb;
		width: 100%;
		height: 8px;
		border-radius: 9999px;
		overflow: hidden;
	}

	.coin-cap-bar-fill {
		height: 100%;
		background-color: var(--color-solar-green-medium, #3d8f68);
		border-radius: 9999px;
		transition: width 0.4s ease-out;
	}

	.flex { display: flex; }
	.flex-col { flex-direction: column; }
	.justify-between { justify-content: space-between; }
	.justify-center { justify-content: center; }
	.gap-2 { gap: 0.5rem; }
	.gap-3 { gap: 0.75rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mt-1 { margin-top: 0.25rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-3 { margin-top: 0.75rem; }
	.w-full { width: 100%; }
	.h-2 { height: 0.5rem; }
	.overflow-hidden { overflow: hidden; }

	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-4px); }
		100% { transform: translateY(0px); }
	}
	.animate-float {
		animation: float 4s ease-in-out infinite;
	}
</style>
