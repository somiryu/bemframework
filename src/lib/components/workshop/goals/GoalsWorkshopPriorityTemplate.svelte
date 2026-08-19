<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	let {
		isHost,
		activeMode,
		concept,
		categories = [],
		votes = {}, // studentId -> { category: points }
		localVotes = {}, // category -> points
		onVoteChange,
		onSubmit,
		hasSubmittedLocalVote = false
	}: {
		isHost: boolean;
		activeMode: 'actividad' | 'feedback';
		concept: string;
		categories: string[];
		votes: Record<string, Record<string, number>>;
		localVotes: Record<string, number>;
		onVoteChange: (category: string, value: number) => void;
		onSubmit: () => void;
		hasSubmittedLocalVote: boolean;
	} = $props();

	// Total points distributed
	const MAX_POINTS = 15;

	const totalSpent = $derived(
		categories.reduce((sum, cat) => sum + (localVotes[cat] || 0), 0)
	);
	const pointsRemaining = $derived(MAX_POINTS - totalSpent);

	// Class average calculations
	const averages = $derived.by(() => {
		const sums: Record<string, number> = {};
		const counts: Record<string, number> = {};
		categories.forEach(cat => {
			sums[cat] = 0;
			counts[cat] = 0;
		});

		Object.values(votes).forEach(userPriorityMap => {
			if (userPriorityMap) {
				categories.forEach(cat => {
					sums[cat] += userPriorityMap[cat] || 0;
					counts[cat]++;
				});
			}
		});

		const results: Record<string, number> = {};
		categories.forEach(cat => {
			results[cat] = counts[cat] > 0 ? Number((sums[cat] / counts[cat]).toFixed(1)) : 0;
		});
		return results;
	});

	// Helper to display clean titles
	const categoryLabels: Record<string, string> = {
		deseabilidad: '🌟 Deseabilidad',
		progresoVisible: '📊 Progreso Visible',
		dificultad: '🎯 Probabilidad / Dificultad',
		plazo: '⏱️ Plazo / Término',
		consistencia: '⚖️ Consistencia de Medición',
		agencia: '🎲 Agencia vs Incertidumbre',
		esfuerzo: '💪 Esfuerzo Requerido'
	};

	const categoryDetails: Record<string, { desc: string; tip: string }> = {
		deseabilidad: {
			desc: 'Interés inicial y atracción que siente el estudiante por la meta propuesta.',
			tip: 'Conecta metas con narrativas inmersivas (juegos de rol, desafíos prácticos reales) en lugar de tareas teóricas abstractas.'
		},
		progresoVisible: {
			desc: 'Claridad e inmediatez con la que el alumno percibe su avance paso a paso hacia el objetivo.',
			tip: 'Usa barras de energía, mapas interactivos o auto-calificadores de código en tiempo real para dar retroalimentación constante.'
		},
		dificultad: {
			desc: 'Balance de reto y desafío óptimo; la meta debe percibirse retadora pero superable (Zona de Desarrollo Próximo).',
			tip: 'Permite reintentos con bajas penalizaciones y provee pistas adaptativas automáticas cuando el alumno se equivoque.'
		},
		plazo: {
			desc: 'Cercanía temporal percibida del logro de la meta. Los plazos largos reducen el enfoque y promueven la postergación.',
			tip: 'Segmenta proyectos semestrales extensos en micro-retos semanales con metas a corto plazo (ej. rachas de aprendizaje).'
		},
		consistencia: {
			desc: 'Transparencia, objetividad y claridad de las reglas y criterios de evaluación desde el inicio.',
			tip: 'Publica rúbricas visuales detalladas con ejemplos de trabajos previos para que el alumno sepa exactamente cómo será calificado.'
		},
		agencia: {
			desc: 'Nivel de autonomía y control que tiene el alumno sobre el camino o métodos para alcanzar el objetivo.',
			tip: 'Ofrece rutas alternativas: deja que elijan entre diferentes formatos de entrega, o exploren un mapa de aprendizaje libremente.'
		},
		esfuerzo: {
			desc: 'Carga cognitiva y física percibida. La sobrecarga mental produce fatiga, desmotivación y posterior deserción.',
			tip: 'Alterna tareas de alta carga (redacción, síntesis profunda) con actividades más ligeras y lúdicas (infografías, breves trivias).'
		}
	};

	function handleAdjust(category: string, amount: number) {
		if (hasSubmittedLocalVote) return;
		const currentVal = localVotes[category] || 0;
		const newVal = currentVal + amount;
		if (newVal >= 0 && newVal <= MAX_POINTS && (amount < 0 || pointsRemaining >= amount)) {
			onVoteChange(category, newVal);
		}
	}
</script>

<div class="priority-template-container">
	<div class="concept-box glass-card">
		<span class="concept-tag">🧭 Concepto de Priorización</span>
		<p class="concept-text">{concept}</p>
	</div>

	{#if activeMode === 'actividad' && !hasSubmittedLocalVote && !isHost}
		<!-- STUDENT INTERFACE -->
		<div class="priority-display-header glass-card">
			<div class="priority-header-row">
				<div class="pool-title">
					<span class="pool-title-main">Distribución de Presupuesto</span>
					<span class="pool-title-sub">Distribuye exactamente {MAX_POINTS} puntos en total</span>
				</div>
				<div class="pool-indicator">
					<span class="pool-indicator-label">Puntos Disponibles:</span>
					<span class="points-circle" class:excess={pointsRemaining < 0} class:correct={pointsRemaining === 0} class:under={pointsRemaining > 0}>
						{pointsRemaining}
					</span>
				</div>
			</div>
			<div class="budget-progress-track">
				<div 
					class="budget-progress-fill"
					class:correct-fill={pointsRemaining === 0}
					class:under-fill={pointsRemaining > 0}
					class:excess-fill={pointsRemaining < 0}
					style="width: {Math.min((totalSpent / MAX_POINTS) * 100, 100)}%;"
				></div>
			</div>
		</div>

		<div class="priority-items-grid">
			{#each categories as cat}
				{@const val = localVotes[cat] || 0}
				<div class="priority-item-card glass-card">
					<div class="category-info">
						<span class="category-name">{categoryLabels[cat] || cat}</span>
					</div>

					<div class="visual-indicator-wrapper">
						{#each Array(MAX_POINTS) as _, i}
							<div class="pip" class:active={i < val}></div>
						{/each}
					</div>

					<div class="controls-wrapper">
						<button
							type="button"
							class="btn-solar-secondary btn-circle btn-sm"
							disabled={hasSubmittedLocalVote || val <= 0}
							onclick={() => handleAdjust(cat, -1)}
						>
							-
						</button>
						<span class="points-val">
							{val}
						</span>
						<button
							type="button"
							class="btn-solar-secondary btn-circle btn-sm"
							disabled={hasSubmittedLocalVote || pointsRemaining <= 0}
							onclick={() => handleAdjust(cat, 1)}
						>
							+
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="submit-actions">
			<button
				type="button"
				class="btn-solar-primary"
				disabled={pointsRemaining !== 0}
				onclick={onSubmit}
			>
				✓ Enviar Priorización
			</button>
		</div>
	{:else}
		<!-- FEEDBACK / HOST VIEW / SUBMITTED STUDENT VIEW -->
		<div class="priority-feedback-layout" in:fade>
			{#if activeMode === 'actividad' && !isHost && hasSubmittedLocalVote}
				<div class="submission-success-banner">
					<span>✓ Priorización enviada con éxito. Viendo respuestas parciales del grupo en tiempo real...</span>
				</div>
			{/if}

			<div class="feedback-subtitle">
				<h4 class="feedback-subtitle-text">Distribución Promedio de la Clase (Total {MAX_POINTS} pts)</h4>
			</div>

			{#each categories as cat}
				{@const avg = averages[cat] || 0}
				{@const pct = (avg / MAX_POINTS) * 100}
				{@const myVal = localVotes[cat] || null}

				<div class="priority-feedback-card glass-card">
					<div class="feedback-card-header">
						<span class="category-name-feedback">{categoryLabels[cat] || cat}</span>
						<div class="feedback-badges-row">
							{#if myVal !== null}
								<span class="badge-tu">Tú: {myVal} pts</span>
							{/if}
							<span class="badge-clase">Clase: {avg} pts</span>
						</div>
					</div>

					<div class="bar-track">
						<!-- Class Average Fill -->
						<div
							class="bar-fill class-avg-fill"
							style="width: {pct}%;"
						></div>

						<!-- Student's Own Choice Marker -->
						{#if myVal !== null}
							{@const myPct = (myVal / MAX_POINTS) * 100}
							<div
								class="my-val-marker"
								style="left: calc({myPct}% - 3px);"
								title="Tu prioridad"
							></div>
						{/if}
					</div>

					<!-- Definition and Educational Tip -->
					<div class="category-extra-info">
						<p class="category-desc"><strong>Definición:</strong> {categoryDetails[cat]?.desc}</p>
						<div class="category-tip-box">
							<span class="tip-icon">💡</span>
							<p class="category-tip"><strong>Tip de Aula:</strong> {categoryDetails[cat]?.tip}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.priority-template-container {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.submission-success-banner {
		background: rgba(61, 143, 104, 0.1);
		border: 1px dashed var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 1rem;
		text-align: left;
	}

	.category-extra-info {
		margin-top: 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-top: 1px dashed rgba(61, 143, 104, 0.12);
		padding-top: 0.85rem;
		text-align: left;
	}

	.category-desc {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-solar-text, #1e293b);
		line-height: 1.5;
	}

	.category-tip-box {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		background: rgba(61, 143, 104, 0.04);
		border-left: 3px solid var(--color-solar-green-medium, #3d8f68);
		padding: 0.6rem 0.8rem;
		border-radius: 0 8px 8px 0;
	}

	.tip-icon {
		font-size: 0.9rem;
		line-height: 1.2;
	}

	.category-tip {
		margin: 0;
		font-size: 0.78rem;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.45;
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: var(--radius-solar-md, 20px);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
		padding: 1.5rem;
		box-sizing: border-box;
	}

	.concept-box {
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.concept-tag {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3d8f68);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.25rem;
	}

	.concept-text {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--color-solar-text, #1e293b);
		font-weight: 500;
	}

	.priority-display-header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		padding: 1.25rem 1.5rem;
	}

	.priority-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 1rem;
	}

	.pool-title {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.pool-title-main {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.pool-title-sub {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #777777);
	}

	.pool-indicator {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.pool-indicator-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #777777);
	}

	.points-circle {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 900;
		font-size: 1.1rem;
		color: white;
		transition: all 0.3s ease;
	}

	.points-circle.correct {
		background: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 10px rgba(61, 143, 104, 0.3);
	}

	.points-circle.under {
		background: #fbbf24;
		box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
	}

	.points-circle.excess {
		background: #ef4444;
		box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
	}

	.budget-progress-track {
		width: 100%;
		height: 8px;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 9999px;
		overflow: hidden;
		position: relative;
		border: 1px solid rgba(0,0,0,0.02);
	}

	.budget-progress-fill {
		height: 100%;
		border-radius: 9999px;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.budget-progress-fill.correct-fill {
		background: var(--color-solar-green-medium, #3d8f68);
	}

	.budget-progress-fill.under-fill {
		background: #fbbf24;
	}

	.budget-progress-fill.excess-fill {
		background: #ef4444;
	}

	.priority-items-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.priority-item-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem 1.5rem;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.75);
		transition: all 0.3s ease;
	}

	.priority-item-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md, 0 4px 12px rgba(0,0,0,0.08));
		border-color: rgba(61, 143, 104, 0.2);
	}

	.category-info {
		flex: 1;
		text-align: left;
	}

	.category-name {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.visual-indicator-wrapper {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.pip {
		width: 7px;
		height: 16px;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0,0,0,0.01);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.pip.active {
		background: linear-gradient(180deg, #d1f5e3 0%, var(--color-solar-green-medium, #3d8f68) 100%);
		box-shadow: 0 0 6px rgba(61, 143, 104, 0.35);
	}

	.controls-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.btn-circle {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 !important;
		border-radius: 50% !important;
		font-size: 1.1rem !important;
		font-weight: 700 !important;
		line-height: 1 !important;
	}

	.points-val {
		font-weight: 900;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, #d1f5e3);
		border: 1px solid rgba(61, 143, 104, 0.15);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		min-width: 1.5rem;
		text-align: center;
	}

	.submit-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.5rem;
	}



	/* FEEDBACK / HOST VIEW STYLES */
	.priority-feedback-layout {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.feedback-subtitle {
		text-align: left;
		margin-bottom: 0.5rem;
	}

	.feedback-subtitle-text {
		color: var(--color-solar-green-dark, #1e4533);
		font-weight: 800;
		font-size: 1rem;
		margin: 0;
	}

	.priority-feedback-card {
		padding: 1.25rem 1.5rem;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.feedback-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.category-name-feedback {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
	}

	.feedback-badges-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge-tu {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0284c7);
		background: var(--color-solar-sky-light, #e0f2fe);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.badge-clase {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, #d1f5e3);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.bar-track {
		width: 100%;
		height: 16px;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 9999px;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(0,0,0,0.03);
	}

	.bar-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		border-radius: 9999px;
		transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.class-avg-fill {
		background: linear-gradient(90deg, #d1f5e3 0%, var(--color-solar-green-medium, #3d8f68) 100%);
		box-shadow: 0 0 6px rgba(61, 143, 104, 0.25);
	}

	.my-val-marker {
		position: absolute;
		top: 0;
		width: 3px;
		height: 100%;
		background-color: var(--color-solar-sky, #0284c7);
		box-shadow: 0 0 6px rgba(2, 132, 199, 0.95);
		transition: left 1s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
	}

	/* Responsive overrides */
	@media (max-width: 640px) {
		.priority-item-card {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.visual-indicator-wrapper {
			display: none;
		}

		.controls-wrapper {
			justify-content: space-between;
			width: 100%;
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: .5; }
	}
</style>
