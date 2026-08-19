<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	let {
		isHost,
		activeMode,
		concept,
		categories = [],
		minLabel = '1',
		maxLabel = '5',
		metaList = [],
		votes = {}, // studentId -> { metaId: { category, rating } }
		localVotes = {}, // metaId -> { category, rating }
		onVoteChange,
		onSubmit,
		hasSubmittedLocalVote = false,
		explanation
	}: {
		isHost: boolean;
		activeMode: 'actividad' | 'feedback';
		concept: string;
		categories: string[];
		minLabel?: string;
		maxLabel?: string;
		metaList: { id: string; text: string; correctCategory?: string; correctRating?: number }[];
		votes: Record<string, Record<string, { category: string; rating: number }>>;
		localVotes: Record<string, { category: string; rating: number }>;
		onVoteChange: (metaId: string, category: string, rating: number) => void;
		onSubmit: () => void;
		hasSubmittedLocalVote: boolean;
		explanation?: { positive: string; negative: string };
	} = $props();

	let activePreviewMetaId = $state<string | null>(metaList[0]?.id || null);

	// Class average calculations
	const averages = $derived.by(() => {
		const results: Record<string, { category: string; rating: number }> = {};
		
		metaList.forEach(m => {
			const categoryVotes: Record<string, number> = {};
			categories.forEach(c => { categoryVotes[c] = 0; });
			
			let ratingSum = 0;
			let ratingCount = 0;

			Object.values(votes).forEach(userVotes => {
				const vote = userVotes?.[m.id];
				if (vote) {
					if (categoryVotes[vote.category] !== undefined) {
						categoryVotes[vote.category]++;
					}
					ratingSum += vote.rating || 0;
					ratingCount++;
				}
			});

			// Resolve majority category
			let majorityCategory = categories[0];
			let maxVotes = -1;
			categories.forEach(c => {
				if (categoryVotes[c] > maxVotes) {
					maxVotes = categoryVotes[c];
					majorityCategory = c;
				}
			});

			const avgRating = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(1)) : 3;
			results[m.id] = { category: majorityCategory, rating: avgRating };
		});
		
		return results;
	});

	// Check if student completed all entries
	const isComplete = $derived(
		metaList.every(m => localVotes[m.id] && localVotes[m.id].category && typeof localVotes[m.id].rating === 'number')
	);

	function handleCategorySelect(metaId: string, category: string) {
		if (hasSubmittedLocalVote) return;
		const currentVal = localVotes[metaId] || { category: '', rating: 3 };
		onVoteChange(metaId, category, currentVal.rating);
	}

	function handleRatingChange(metaId: string, rating: number) {
		if (hasSubmittedLocalVote) return;
		const currentVal = localVotes[metaId] || { category: categories[0] || '', rating: 3 };
		onVoteChange(metaId, currentVal.category, rating);
	}
</script>

<div class="class-rating-template-container">
	<div class="concept-box glass-card">
		<span class="concept-tag">🧭 Concepto de Calibración</span>
		<p class="concept-text">{concept}</p>
	</div>

	{#if explanation && activeMode === 'actividad' && !hasSubmittedLocalVote && !isHost}
		<div class="explanation-box glass-card">
			<span class="explanation-tag">💡 Guía de Calibración</span>
			<div class="explanation-content">
				<p class="explanation-desc positive"><strong>✅ {explanation.positive}</strong></p>
				<p class="explanation-desc negative"><strong>❌ {explanation.negative}</strong></p>
			</div>
		</div>
	{/if}

	{#if activeMode === 'actividad' && !hasSubmittedLocalVote && !isHost}
		<!-- STUDENT RUNTIME FILLING -->
		<div class="cards-layout">
			{#each metaList as meta, idx}
				{@const val = localVotes[meta.id] || { category: '', rating: 3 }}
				{@const sliderPct = ((val.rating - 1) / 4) * 100}
				<div class="meta-item-card glass-card">
					<div class="meta-info">
						<span class="index-badge">
							Meta #{idx + 1}
						</span>
						<p class="meta-text">{meta.text}</p>
					</div>

					<div class="meta-item-controls">
						<!-- Classification pills -->
						<div class="classification-pills">
							<span class="pills-label">Clasificación:</span>
							{#each categories as cat}
								<button
									type="button"
									class="pill-btn"
									class:active={val.category === cat}
									disabled={hasSubmittedLocalVote}
									onclick={() => handleCategorySelect(meta.id, cat)}
								>
									{cat}
								</button>
							{/each}
						</div>

						<!-- Slider selection -->
						<div class="rating-slider">
							<span class="rating-slider-label">{minLabel}</span>
							<div class="slider-track-container">
								<input
									type="range"
									min="1"
									max="5"
									step="1"
									disabled={hasSubmittedLocalVote}
									value={val.rating}
									oninput={(e) => handleRatingChange(meta.id, parseInt((e.target as HTMLInputElement).value, 10))}
									class="solar-slider"
									style="background: linear-gradient(to right, var(--color-solar-green-medium, #3d8f68) 0%, var(--color-solar-green-medium, #3d8f68) {sliderPct}%, rgba(0, 0, 0, 0.08) {sliderPct}%, rgba(0, 0, 0, 0.08) 100%);"
								/>
								<span class="slider-value-badge">
									{val.rating}
								</span>
							</div>
							<span class="rating-slider-label">{maxLabel}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if !hasSubmittedLocalVote}
			<div class="submit-actions">
				<button
					type="button"
					class="btn-solar-primary"
					disabled={!isComplete}
					onclick={onSubmit}
				>
					✓ Enviar Respuestas
				</button>
			</div>
		{/if}
	{:else}
		<!-- FEEDBACK / HOST SCATTER PLOT VIEW / SUBMITTED STUDENT VIEW -->
		<div class="feedback-scatter-layout" in:fade>
			{#if activeMode === 'actividad' && !isHost && hasSubmittedLocalVote}
				<div class="submission-success-banner">
					<span>✓ Respuestas enviadas con éxito. Viendo mapa de calibración del grupo en tiempo real...</span>
				</div>
			{/if}
			
			<!-- Interactive Grid / Scatter Plot -->
			<div class="scatter-plot-card glass-card">
				<h4 class="plot-title">
					Mapa de Calibración de la Clase
				</h4>

				<div class="grid-plot-wrapper blueprint-canvas">
					<!-- Y Axis Labels -->
					<div class="y-axis-labels">
						<span>5 (Alto)</span>
						<span>4</span>
						<span>3</span>
						<span>2</span>
						<span>1 (Bajo)</span>
					</div>

					<!-- Grid Columns Overlay -->
					<div class="columns-grid-overlay" style="grid-template-columns: repeat({categories.length}, 1fr);">
						{#each categories as cat}
							<div class="col-track-border"></div>
						{/each}
					</div>

					<!-- Plot Area (Placement of Bubbles) -->
					<div class="plot-area-grid" style="grid-template-columns: repeat({categories.length}, 1fr);">
						{#each categories as cat, colIdx}
							<div class="col-track">
								{#each metaList as meta, idx}
									{@const avg = averages[meta.id] || { category: '', rating: 3 }}
									{#if avg.category === cat}
										{@const bottomPct = ((avg.rating - 1) / 4) * 100}
										<!-- Position bubble randomly slightly left/right within column to avoid overlap if ratings are equal -->
										{@const leftOffset = 20 + ((idx * 7) % 60)} 
										<button
											type="button"
											class="plot-bubble"
											class:selected={activePreviewMetaId === meta.id}
											class:correct={activeMode === 'feedback' && (!meta.correctCategory || avg.category === meta.correctCategory)}
											class:wrong={activeMode === 'feedback' && meta.correctCategory && avg.category !== meta.correctCategory}
											style="bottom: {bottomPct}%; left: {leftOffset}%;"
											onclick={() => activePreviewMetaId = meta.id}
										>
											{idx + 1}
										</button>
									{/if}
								{/each}
							</div>
						{/each}
					</div>

					<!-- X Axis Labels -->
					<div class="x-axis-labels-grid" style="grid-template-columns: repeat({categories.length}, 1fr);">
						{#each categories as cat}
							<span class="x-axis-label">{cat}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Labeled detail of selected card -->
			{#if activePreviewMetaId}
				{@const meta = metaList.find(m => m.id === activePreviewMetaId)}
				{@const idx = metaList.findIndex(m => m.id === activePreviewMetaId)}
				{@const avg = averages[activePreviewMetaId]}
				{@const myVal = localVotes[activePreviewMetaId]}

				{#if meta}
					<div class="preview-details-card glass-card" in:slide>
						<div class="preview-header">
							<span class="preview-title-badge">
								Meta #{idx + 1} Seleccionada
							</span>
							{#if meta.correctCategory && activeMode === 'feedback'}
								<span class="correct-answer-badge">
									<span>⭐ Respuesta Correcta:</span>
									<span class="correct-category-val">{meta.correctCategory}</span>
								</span>
							{/if}
						</div>

						<p class="preview-meta-text">"{meta.text}"</p>

						<div class="preview-stats-grid">
							<div class="stat-pill">
								<span class="stat-label">Mayoría de la Clase</span>
								<span class="stat-val">{avg.category} <span class="stat-val-sub">(★ {avg.rating})</span></span>
							</div>

							{#if myVal}
								<div class="stat-pill border-left-divider">
									<span class="stat-label">Tu Respuesta</span>
									<span class="stat-val text-sky">{myVal.category} <span class="stat-val-sub text-sky">(★ {myVal.rating})</span></span>
								</div>
							{/if}

							{#if activeMode === 'feedback'}
								<div class="stat-pill border-left-divider">
									<span class="stat-label">Clasificación Correcta</span>
									<span class="stat-val text-green">
										{meta.correctCategory || 'N/A'}
									</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.class-rating-template-container {
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

	.explanation-box {
		margin-bottom: 1.5rem;
		text-align: left;
		border-left: 4px solid var(--color-solar-green-medium, #3d8f68);
		background: rgba(255, 255, 255, 0.9);
		padding: 1.25rem;
		box-sizing: border-box;
	}

	.explanation-tag {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3d8f68);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.5rem;
	}

	.explanation-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.explanation-desc {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.explanation-desc.positive {
		color: var(--color-solar-green-dark, #1e4533);
	}

	.explanation-desc.negative {
		color: #9f1239;
	}

	.cards-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.meta-item-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.25rem;
		box-sizing: border-box;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		transition: all 0.3s ease;
	}

	.meta-item-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md, 0 4px 12px rgba(0,0,0,0.06));
	}

	.meta-info {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		text-align: left;
	}

	.index-badge {
		background: var(--color-solar-green-light, #d1f5e3);
		color: var(--color-solar-green-dark, #1e4533);
		font-size: 0.72rem;
		font-weight: 900;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		white-space: nowrap;
	}

	.meta-text {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 650;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
	}

	.meta-item-controls {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		border-top: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding-top: 1rem;
		flex-wrap: wrap;
	}

	.classification-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.pills-label {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #777777);
		font-weight: 700;
		margin-right: 0.25rem;
	}

	.pill-btn {
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		background: white;
		color: var(--color-solar-text-muted, #777777);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill-btn:hover {
		border-color: var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
	}

	.pill-btn.active {
		background: var(--color-solar-green-light, #d1f5e3);
		border-color: var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		box-shadow: 0 2px 6px rgba(61, 143, 104, 0.15);
	}

	.rating-slider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 320px;
		flex-grow: 1;
		justify-content: flex-end;
	}

	.rating-slider-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #777777);
	}

	.slider-track-container {
		position: relative;
		flex-grow: 1;
		display: flex;
		align-items: center;
	}

	.solar-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 9999px;
		outline: none;
		transition: background 0.3s ease;
		cursor: pointer;
	}

	.solar-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-solar-green-medium, #3d8f68);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 6px rgba(0,0,0,0.15);
		transition: transform 0.2s ease;
	}

	.solar-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}

	.solar-slider:disabled::-webkit-slider-thumb {
		background: #94a3b8;
		cursor: not-allowed;
	}

	.slider-value-badge {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 900;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: rgba(61, 143, 104, 0.08);
		border: 1px solid rgba(61, 143, 104, 0.15);
		padding: 0.25rem 0.6rem;
		border-radius: 9999px;
		min-width: 1.5rem;
		text-align: center;
		margin-left: 0.75rem;
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
	}

	.submit-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.5rem;
	}

	/* FEEDBACK / GALAXY VIEW (SCATTER PLOT) */
	.feedback-scatter-layout {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	.submission-success-banner {
		background: rgba(61, 143, 104, 0.1);
		border: 1px dashed var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #1e4533);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		text-align: left;
	}

	.scatter-plot-card {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.plot-title {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.grid-plot-wrapper {
		position: relative;
		width: 100%;
		max-width: 750px;
		aspect-ratio: 4/3;
		border-radius: 16px;
		border: 1px solid rgba(61, 143, 104, 0.2);
		padding: 1rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		margin-left: 2.5rem;
	}

	.blueprint-canvas {
		background-color: #FAF9F6;
		background-image: 
			linear-gradient(rgba(61, 143, 104, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(61, 143, 104, 0.05) 1px, transparent 1px);
		background-size: 20px 20px;
		box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.04);
	}

	.y-axis-labels {
		position: absolute;
		left: -3rem;
		top: 1rem;
		bottom: 3.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		font-size: 0.65rem;
		color: var(--color-solar-text-muted, #777777);
		font-weight: 700;
		user-select: none;
	}

	.columns-grid-overlay {
		position: absolute;
		inset: 0;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		bottom: 3rem;
		display: grid;
	}

	.col-track-border {
		border-right: 1px dashed rgba(0, 0, 0, 0.08);
		height: 100%;
	}

	.col-track-border:last-child {
		border-right: none;
	}

	.plot-area-grid {
		position: absolute;
		inset: 0;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		bottom: 3rem;
		display: grid;
	}

	.col-track {
		position: relative;
		height: 100%;
	}

	.plot-bubble {
		position: absolute;
		width: 2rem;
		height: 2rem;
		transform: translate(-50%, 50%);
		border-radius: 50%;
		border: 2px solid white;
		color: white;
		background: linear-gradient(135deg, var(--color-solar-sky, #0284c7), #0369a1);
		font-weight: 900;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: var(--shadow-solar-md, 0 4px 10px rgba(0,0,0,0.12));
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		z-index: 10;
		padding: 0;
	}

	.plot-bubble.correct {
		background: linear-gradient(135deg, var(--color-solar-green-medium, #3d8f68), var(--color-solar-green-dark, #1e4533));
		box-shadow: 0 4px 10px rgba(61, 143, 104, 0.3);
	}

	.plot-bubble.wrong {
		background: linear-gradient(135deg, var(--color-solar-terracotta, #e11d48), #9f1239);
		box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3);
	}

	.plot-bubble:hover {
		transform: translate(-50%, 50%) scale(1.15);
		box-shadow: 0 6px 15px rgba(0,0,0,0.15);
	}

	.plot-bubble.selected {
		box-shadow: 0 0 15px rgba(255, 209, 102, 0.8);
		transform: translate(-50%, 50%) scale(1.3) !important;
		border-color: var(--color-solar-yellow, #ffd166) !important;
		z-index: 20;
	}

	.x-axis-labels-grid {
		display: grid;
		padding-left: 1rem;
		padding-right: 1rem;
		height: 2.5rem;
		align-items: center;
		text-align: center;
		border-top: 1px solid rgba(61, 143, 104, 0.15);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		user-select: none;
		margin-top: 0.5rem;
	}

	.x-axis-label {
		text-transform: uppercase;
		letter-spacing: 0.02em;
		line-height: 1.2;
	}

	/* PREVIEW DETAIL CARD */
	.preview-details-card {
		border-left: 4px solid var(--color-solar-green-medium, #3d8f68);
		padding: 1.25rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: 100%;
	}

	.preview-title-badge {
		background: var(--color-solar-green-light, #d1f5e3);
		color: var(--color-solar-green-dark, #1e4533);
		font-size: 0.72rem;
		font-weight: 850;
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
	}

	.correct-answer-badge {
		background: rgba(255, 209, 102, 0.15);
		border: 1px solid rgba(255, 209, 102, 0.3);
		color: var(--color-solar-green-dark, #1e4533);
		font-size: 0.72rem;
		font-weight: 700;
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		box-shadow: 0 1px 2px rgba(0,0,0,0.02);
	}

	.correct-category-val {
		text-transform: uppercase;
		font-weight: 850;
		color: var(--color-solar-green-medium, #3d8f68);
	}


	.preview-meta-text {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
	}

	.preview-stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		border-top: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding-top: 0.85rem;
	}

	@media (max-width: 768px) {
		.grid-plot-wrapper {
			margin-left: 0;
			aspect-ratio: 1;
		}

		.y-axis-labels {
			position: static;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.preview-stats-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.border-left-divider {
			border-left: none !important;
			padding-left: 0 !important;
			border-top: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
			padding-top: 0.75rem;
		}

		.meta-item-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.rating-slider {
			min-width: 100%;
		}
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.65rem;
		color: var(--color-solar-text-muted, #777777);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-val {
		font-size: 0.8rem;
		font-weight: 850;
		color: var(--color-solar-green-dark, #1e4533);
		text-transform: uppercase;
	}

	.stat-val-sub {
		color: var(--color-solar-green-medium, #3d8f68);
		font-weight: 600;
	}

	.stat-val.text-sky {
		color: var(--color-solar-sky, #0284c7);
	}

	.stat-val-sub.text-sky {
		color: var(--color-solar-sky, #0284c7);
	}

	.stat-val.text-green {
		color: var(--color-solar-green-medium, #3d8f68);
	}

	.border-left-divider {
		border-left: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.06));
		padding-left: 1rem;
	}
</style>
