<script lang="ts">
	import { fade, slide, scale } from 'svelte/transition';

	let {
		isHost,
		activeMode,
		concept,
		categories = [],
		metaList = [],
		votes = {}, // studentId -> { metaId: category }
		localVotes = {}, // metaId -> category
		onVoteChange,
		onSubmit,
		hasSubmittedLocalVote = false
	}: {
		isHost: boolean;
		activeMode: 'actividad' | 'feedback';
		concept: string;
		categories: string[];
		metaList: { id: string; text: string; correctCategory?: string }[];
		votes: Record<string, Record<string, string>>;
		localVotes: Record<string, string>;
		onVoteChange: (metaId: string, category: string) => void;
		onSubmit: () => void;
		hasSubmittedLocalVote: boolean;
	} = $props();

	// Shuffle metaList to randomize order for each student
	const shuffledMetaList = isHost 
		? metaList 
		: [...metaList].sort(() => Math.random() - 0.5);

	// Active single card to classify
	const activeMeta = $derived(
		shuffledMetaList.find(m => !localVotes[m.id] || localVotes[m.id] === '') || null
	);

	// Count of classified cards
	const classifiedCount = $derived(
		metaList.filter(m => localVotes[m.id] && localVotes[m.id] !== '').length
	);

	// Group classified cards by category
	const classifiedByCategory = $derived.by(() => {
		const groups: Record<string, typeof metaList> = {};
		categories.forEach(cat => {
			groups[cat] = [];
		});
		metaList.forEach(m => {
			const cat = localVotes[m.id];
			if (cat && groups[cat]) {
				groups[cat].push(m);
			}
		});
		return groups;
	});

	// Calculate collective statistics for feedback
	const stats = $derived.by(() => {
		const cardStats: Record<string, { total: number; counts: Record<string, number>; percentages: Record<string, number> }> = {};
		
		metaList.forEach(m => {
			cardStats[m.id] = {
				total: 0,
				counts: {},
				percentages: {}
			};
			categories.forEach(cat => {
				cardStats[m.id].counts[cat] = 0;
				cardStats[m.id].percentages[cat] = 0;
			});
		});

		Object.values(votes).forEach(userVotes => {
			if (userVotes) {
				Object.entries(userVotes).forEach(([metaId, cat]) => {
					if (cardStats[metaId] && cardStats[metaId].counts[cat] !== undefined) {
						cardStats[metaId].counts[cat]++;
						cardStats[metaId].total++;
					}
				});
			}
		});

		metaList.forEach(m => {
			const cs = cardStats[m.id];
			if (cs.total > 0) {
				categories.forEach(cat => {
					cs.percentages[cat] = Math.round((cs.counts[cat] / cs.total) * 100);
				});
			}
		});

		return cardStats;
	});

	function handleAssignCategory(category: string) {
		if (!activeMeta || hasSubmittedLocalVote) return;
		onVoteChange(activeMeta.id, category);
	}
</script>

<div class="classification-template-container">
	<div class="concept-box glass-card">
		<span class="concept-tag">🧭 Concepto de Clasificación</span>
		<p class="concept-text">{concept}</p>
	</div>

	{#if activeMode === 'actividad' && !hasSubmittedLocalVote && !isHost}
		<!-- STUDENT RUNTIME PLAYING (1-by-1 Flow) -->
		<div class="classification-split-layout">
			<!-- Left Column: Active Card -->
			<div class="active-card-column">
				{#if activeMeta}
					<div class="active-card-container glass-card" in:scale>
						<span class="active-card-progress">Tarjeta {classifiedCount + 1} de {metaList.length}</span>
						<div class="active-card-content">
							<p class="active-card-text">📄 {activeMeta.text}</p>
						</div>
						<div class="active-card-hint">
							<span>Selecciona uno de los 4 cuadrantes a la derecha para clasificar esta meta.</span>
						</div>
					</div>
				{:else}
					<div class="all-sorted-banner">
						<p class="all-sorted-text">🎉 ¡Has clasificado todas las metas! Tu respuesta ha sido enviada.</p>
					</div>
				{/if}
			</div>

			<!-- Right Column: 4 Quadrants Matrix -->
			<div class="matrix-column">
				{#each categories as cat}
					{@const list = classifiedByCategory[cat] || []}
					<button
						type="button"
						class="matrix-quadrant glass-card"
						class:mantenimiento={cat.includes('Mantenimiento') || cat === 'Principal'}
						class:eliminacion={cat.includes('Eliminación')}
						class:adquisicion={cat.includes('Adquisición') || cat === 'Secundaria'}
						class:prevencion={cat.includes('Prevención') || cat === 'Narrativa'}
						class:interactive-quadrant={activeMeta !== null}
						onclick={() => handleAssignCategory(cat)}
					>
						<span class="quadrant-title">
							📥 {cat}
						</span>

						<div class="assigned-items-list">
							{#each list as item}
								<div class="assigned-item-pill" onclick={(e) => e.stopPropagation()}>
									<span class="assigned-text">📄 {item.text}</span>
								</div>
							{/each}
							{#if list.length === 0}
								<span class="quadrant-placeholder">
									Vacío
								</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<!-- FEEDBACK / HOST VIEW / SUBMITTED STUDENT VIEW -->
		<div class="classification-feedback-layout" in:fade>
			{#if activeMode === 'actividad' && !isHost && hasSubmittedLocalVote}
				<div class="submission-success-banner">
					<span>✓ Clasificación enviada con éxito. Viendo respuestas parciales del grupo en tiempo real...</span>
				</div>
			{/if}

			{#each metaList as meta}
				{@const cardStats = stats[meta.id] || { total: 0, percentages: {} }}
				
				<div class="feedback-meta-card glass-card">
					<div class="feedback-meta-card-header">
						<p class="feedback-meta-text">{meta.text}</p>
						<span class="total-votes-badge">🗳️ {cardStats.total} {cardStats.total === 1 ? 'voto' : 'votos'}</span>
					</div>

					{#if meta.correctCategory && activeMode === 'feedback'}
						<div class="correct-category-tag">
							<span class="star-icon">⭐</span>
							<span class="correct-label">Respuesta Correcta:</span>
							<span class="correct-val">{meta.correctCategory}</span>
						</div>
					{/if}

					<div class="class-voting-breakdown">
						<span class="breakdown-title">Distribución de Votos de la Clase:</span>
						
						{#each categories as cat}
							{@const pct = cardStats.percentages[cat] || 0}
							{@const isCorrectCat = cat === meta.correctCategory}
							{@const userChoseThis = localVotes[meta.id] === cat}

							<div class="breakdown-row">
								<span class="cat-label" class:font-bold={isCorrectCat && activeMode === 'feedback'}>
									{cat} {isCorrectCat && activeMode === 'feedback' ? '✅' : ''} {userChoseThis ? '👤 (Tú)' : ''}
								</span>
								
								<div class="breakdown-track">
									<div
										class="breakdown-fill"
										style="width: {pct}%; background: {isCorrectCat && activeMode === 'feedback' ? 'linear-gradient(90deg, #d1f5e3, var(--color-solar-green-medium, #3d8f68))' : userChoseThis ? 'linear-gradient(90deg, #e0f2fe, var(--color-solar-sky, #0284c7))' : 'linear-gradient(90deg, #cbd5e1, #94a3b8)'}; box-shadow: {isCorrectCat && activeMode === 'feedback' ? '0 0 6px rgba(61, 143, 104, 0.2)' : userChoseThis ? '0 0 6px rgba(2, 132, 199, 0.2)' : '0 0 4px rgba(148, 163, 184, 0.15)'};"
									></div>
								</div>

								<span class="pct-val">{pct}%</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.classification-template-container {
		width: 100%;
		display: flex;
		flex-direction: column;
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

	.submission-success-banner {
		background: rgba(61, 143, 104, 0.1);
		border: 1px dashed var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	/* STUDENT RUNTIME SPLIT LAYOUT (Double Column on Desktop) */
	.classification-split-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
		width: 100%;
		align-items: start;
	}

	@media (max-width: 900px) {
		.classification-split-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	/* Active Card Styling (Left Column) */
	.active-card-column {
		position: sticky;
		top: 2rem;
		width: 100%;
	}

	.active-card-container {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: linear-gradient(135deg, white 0%, var(--color-solar-green-light, #eefdf5) 100%);
		border: 2px solid var(--color-solar-green-medium, #3d8f68);
		box-shadow: var(--shadow-solar-md, 0 6px 16px rgba(61, 143, 104, 0.1));
		padding: 2rem;
		text-align: center;
		min-height: 240px;
		justify-content: space-between;
	}

	.active-card-progress {
		font-size: 0.75rem;
		font-weight: 900;
		text-transform: uppercase;
		color: var(--color-solar-green-medium, #3d8f68);
		letter-spacing: 0.08em;
	}

	.active-card-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		padding: 1rem 0;
	}

	.active-card-text {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
		text-align: center;
	}

	.active-card-hint {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #777777);
		line-height: 1.4;
	}

	.all-sorted-banner {
		background: var(--color-solar-green-light, #d1f5e3);
		border: 1px solid rgba(61, 143, 104, 0.25);
		padding: 2rem;
		border-radius: 20px;
		text-align: center;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
	}

	.all-sorted-text {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
	}

	/* Matrix Column (Right Column) */
	.matrix-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		width: 100%;
	}

	.matrix-quadrant {
		border-radius: var(--radius-solar-sm, 16px);
		background: rgba(255, 255, 255, 0.65);
		border: 2px dashed var(--color-solar-card-border, rgba(0,0,0,0.08));
		padding: 1rem 1.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 0.5rem;
		min-height: 100px;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
		width: 100%;
		box-sizing: border-box;
	}

	/* Matrix Quadrants specific colors */
	.matrix-quadrant.interactive-quadrant {
		cursor: pointer;
	}
	.matrix-quadrant.interactive-quadrant:hover {
		transform: scale(1.015);
		border-color: var(--color-solar-green-medium, #3d8f68);
	}

	.matrix-quadrant.mantenimiento {
		background: rgba(61, 143, 104, 0.02);
	}
	.matrix-quadrant.mantenimiento.interactive-quadrant {
		cursor: pointer;
	}
	.matrix-quadrant.mantenimiento.interactive-quadrant:hover {
		border-color: var(--color-solar-green-medium, #3d8f68);
		background: rgba(61, 143, 104, 0.06);
		transform: scale(1.015);
	}

	.matrix-quadrant.eliminacion {
		background: rgba(239, 68, 68, 0.01);
	}
	.matrix-quadrant.eliminacion.interactive-quadrant {
		cursor: pointer;
	}
	.matrix-quadrant.eliminacion.interactive-quadrant:hover {
		border-color: #f87171;
		background: rgba(239, 68, 68, 0.04);
		transform: scale(1.015);
	}

	.matrix-quadrant.adquisicion {
		background: rgba(2, 132, 199, 0.01);
	}
	.matrix-quadrant.adquisicion.interactive-quadrant {
		cursor: pointer;
	}
	.matrix-quadrant.adquisicion.interactive-quadrant:hover {
		border-color: var(--color-solar-sky, #0284c7);
		background: rgba(2, 132, 199, 0.04);
		transform: scale(1.015);
	}

	.matrix-quadrant.prevencion {
		background: rgba(168, 85, 247, 0.01);
	}
	.matrix-quadrant.prevencion.interactive-quadrant {
		cursor: pointer;
	}
	.matrix-quadrant.prevencion.interactive-quadrant:hover {
		border-color: #a855f7;
		background: rgba(168, 85, 247, 0.04);
		transform: scale(1.015);
	}

	.quadrant-title {
		font-weight: 800;
		font-size: 0.75rem;
		color: var(--color-solar-green-dark, #1e4533);
		letter-spacing: 0.05em;
		text-transform: uppercase;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.35rem;
		display: block;
		width: 100%;
	}

	.assigned-items-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: 100%;
		margin-top: 0.25rem;
	}

	.assigned-item-pill {
		background: white;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 2px rgba(0,0,0,0.02);
		cursor: default;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		transition: all 0.2s ease;
	}

	.feedback-meta-card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.5rem;
		width: 100%;
	}

	.total-votes-badge {
		font-size: 0.72rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		background: rgba(61, 143, 104, 0.08);
		border: 1px solid rgba(61, 143, 104, 0.15);
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.assigned-text {
		flex: 1;
		line-height: 1.4;
	}

	.quadrant-placeholder {
		font-size: 0.7rem;
		color: var(--color-solar-text-muted, #777777);
		font-style: italic;
		display: block;
		padding: 0.5rem 0;
		text-align: center;
		width: 100%;
	}

	/* FEEDBACK / HOST VIEW STYLES */
	.classification-feedback-layout {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}

	.feedback-meta-card {
		padding: 1.25rem 1.5rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.feedback-meta-text {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
	}

	.correct-category-tag {
		background: var(--color-solar-green-light, #d1f5e3);
		border: 1px solid rgba(61, 143, 104, 0.2);
		color: var(--color-solar-green-dark, #1e4533);
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.35rem 0.75rem;
		border-radius: 8px;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		align-self: flex-start;
		box-shadow: 0 1px 2px rgba(0,0,0,0.02);
	}

	.correct-label {
		color: var(--color-solar-text-muted, #777777);
	}

	.correct-val {
		text-transform: uppercase;
		font-weight: 900;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.class-voting-breakdown {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
		border-top: 1px dashed rgba(0,0,0,0.06);
		padding-top: 0.75rem;
	}

	.breakdown-title {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #777777);
		font-weight: 700;
		display: block;
		margin-bottom: 0.25rem;
	}

	.breakdown-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.75rem;
		gap: 1rem;
	}

	.cat-label {
		font-weight: 600;
		color: var(--color-solar-green-dark, #1e4533);
		min-width: 180px;
		width: 180px;
		flex-shrink: 0;
	}

	.breakdown-track {
		background: rgba(0, 0, 0, 0.05);
		flex-grow: 1;
		height: 10px;
		border-radius: 9999px;
		overflow: hidden;
		position: relative;
		border: 1px solid rgba(0,0,0,0.02);
	}

	.breakdown-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		border-radius: 9999px;
		transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.pct-val {
		font-weight: 900;
		color: var(--color-solar-green-medium, #3d8f68);
		width: 3rem;
		text-align: right;
		flex-shrink: 0;
	}
</style>
