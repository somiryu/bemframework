<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	let {
		isHost,
		activeMode,
		concept,
		minLabel = '1',
		maxLabel = '5',
		metaList = [],
		votes = {}, // studentId -> { metaId: rating }
		localVotes = {}, // metaId -> rating
		onVoteChange,
		onSubmit,
		hasSubmittedLocalVote = false,
		explanation
	}: {
		isHost: boolean;
		activeMode: 'actividad' | 'feedback';
		concept: string;
		minLabel?: string;
		maxLabel?: string;
		metaList: { id: string; text: string }[];
		votes: Record<string, Record<string, number>>;
		localVotes: Record<string, number>;
		onVoteChange: (metaId: string, value: number) => void;
		onSubmit: () => void;
		hasSubmittedLocalVote: boolean;
		explanation?: { positive: string; negative: string };
	} = $props();

	// Calculate class averages in real time
	const averages = $derived.by(() => {
		const sums: Record<string, number> = {};
		const counts: Record<string, number> = {};
		metaList.forEach(m => {
			sums[m.id] = 0;
			counts[m.id] = 0;
		});

		Object.values(votes).forEach((userVoteMap) => {
			if (userVoteMap) {
				Object.keys(userVoteMap).forEach(metaId => {
					if (typeof sums[metaId] !== 'undefined') {
						sums[metaId] += userVoteMap[metaId] || 0;
						counts[metaId]++;
					}
				});
			}
		});

		const results: Record<string, number> = {};
		metaList.forEach(m => {
			results[m.id] = counts[m.id] > 0 ? Number((sums[m.id] / counts[m.id]).toFixed(1)) : 0;
		});
		return results;
	});

	// Check if all metas have been rated
	const isComplete = $derived(
		metaList.every(m => typeof localVotes[m.id] === 'number')
	);
</script>

<div class="rating-template-container">
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
		<div class="ratings-active-grid">
			{#each metaList as meta}
				{@const currentVal = localVotes[meta.id] !== undefined ? localVotes[meta.id] : 3}
				{@const sliderPct = ((currentVal - 1) / 4) * 100}
				<div class="meta-rating-card glass-card">
					<div class="meta-details">
						<p class="meta-text">{meta.text}</p>
					</div>

					<div class="slider-wrapper">
						<span class="slider-boundary-label">{minLabel}</span>
						<div class="solar-slider-container">
							<input
								type="range"
								min="1"
								max="5"
								step="1"
								disabled={hasSubmittedLocalVote}
								value={currentVal}
								oninput={(e) => onVoteChange(meta.id, parseInt((e.target as HTMLInputElement).value, 10))}
								class="solar-slider"
								style="background: linear-gradient(to right, var(--color-solar-green-medium, #3d8f68) 0%, var(--color-solar-green-medium, #3d8f68) {sliderPct}%, #e2e8f0 {sliderPct}%, #e2e8f0 100%);"
							/>
							<span class="slider-val">
								{localVotes[meta.id] !== undefined ? localVotes[meta.id] : '—'}
							</span>
						</div>
						<span class="slider-boundary-label">{maxLabel}</span>
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
					✓ Enviar Calificaciones
				</button>
			</div>
		{/if}
	{:else}
		<!-- FEEDBACK / HOST VIEW / SUBMITTED STUDENT VIEW -->
		<div class="ratings-feedback-layout" in:fade>
			{#if activeMode === 'actividad' && !isHost && hasSubmittedLocalVote}
				<div class="submission-success-banner">
					<span>✓ Calificaciones enviadas con éxito. Viendo respuestas parciales del grupo en tiempo real...</span>
				</div>
			{/if}
			{#each metaList as meta}
				{@const avg = averages[meta.id] || 0}
				{@const pct = (avg / 5) * 100}
				{@const myVal = localVotes[meta.id] || null}
				{@const myPct = myVal ? (myVal / 5) * 100 : 0}

				<div class="meta-feedback-card glass-card">
					<p class="meta-feedback-text">{meta.text}</p>

					<div class="chart-track-wrapper">
						<!-- Class Average Bar -->
						<div class="bar-group">
							<div class="bar-meta-info">
								<span class="bar-label">Promedio de la Clase</span>
								<span class="bar-value-pill green">{avg} / 5</span>
							</div>
							<div class="bar-track">
								<div
									class="bar-fill class-avg-fill"
									style="width: {pct}%;"
								></div>
							</div>
						</div>

						<!-- Student's Own Rating -->
						{#if myVal}
							<div class="bar-group" in:slide>
								<div class="bar-meta-info">
									<span class="bar-label">Tu Calificación</span>
									<span class="bar-value-pill sky">{myVal} / 5</span>
								</div>
								<div class="bar-track student-track">
									<div
										class="bar-fill student-fill"
										style="width: {myPct}%;"
									></div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.rating-template-container {
		width: 100%;
		display: flex;
		flex-direction: column;
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

	.glass-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: var(--radius-solar-md, 20px);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		box-shadow: var(--shadow-solar-sm, 0 2px 8px rgba(0,0,0,0.04));
		padding: 1.5rem;
	}

	.ratings-active-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.meta-rating-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		border-radius: var(--radius-solar-sm, 16px);
		background: rgba(255, 255, 255, 0.75);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.meta-rating-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md, 0 4px 12px rgba(0,0,0,0.08));
		border-color: rgba(61, 143, 104, 0.2);
	}

	.meta-details {
		flex: 1;
		text-align: left;
	}

	.meta-text {
		margin: 0;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
	}

	.slider-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		min-width: 340px;
		flex-shrink: 0;
	}

	.slider-boundary-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-text-muted, #777777);
		text-transform: uppercase;
		letter-spacing: 0.02em;
		width: 90px;
		text-align: center;
		flex-shrink: 0;
		line-height: 1.2;
	}

	.solar-slider-container {
		position: relative;
		flex-grow: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.solar-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		border-radius: 4px;
		outline: none;
		transition: background 0.3s ease;
		cursor: pointer;
	}

	.solar-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 22px;
		height: 22px;
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
		transform: none;
	}

	.slider-val {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 900;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, #d1f5e3);
		border: 1px solid rgba(61, 143, 104, 0.2);
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		min-width: 1.75rem;
		text-align: center;
		box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
		flex-shrink: 0;
	}

	.submit-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.5rem;
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

	/* FEEDBACK / HOST SCATTER STYLES */
	.ratings-feedback-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.meta-feedback-card {
		border-radius: var(--radius-solar-sm, 16px);
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
	}

	.meta-feedback-text {
		margin: 0 0 1rem 0;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1e4533);
		line-height: 1.5;
		text-align: left;
	}

	.chart-track-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.bar-group {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.bar-meta-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.35rem;
	}

	.bar-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-text-muted, #777777);
	}

	.bar-value-pill {
		font-size: 0.7rem;
		font-weight: 850;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
	}

	.bar-value-pill.green {
		background: var(--color-solar-green-light, #d1f5e3);
		color: var(--color-solar-green-dark, #1e4533);
	}

	.bar-value-pill.sky {
		background: var(--color-solar-sky-light, #e0f2fe);
		color: var(--color-solar-sky, #0369a1);
	}

	.bar-track {
		width: 100%;
		height: 14px;
		background: rgba(0, 0, 0, 0.05);
		border-radius: 9999px;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(0,0,0,0.03);
	}

	.bar-track.student-track {
		height: 10px;
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
		background: linear-gradient(90deg, #a7f3d0 0%, var(--color-solar-green-medium, #3d8f68) 100%);
		box-shadow: 0 0 6px rgba(61, 143, 104, 0.25);
	}

	.student-fill {
		background: linear-gradient(90deg, #bae6fd 0%, var(--color-solar-sky, #0284c7) 100%);
		box-shadow: 0 0 6px rgba(2, 132, 199, 0.2);
	}

	/* Mobile responsive overrides */
	@media (max-width: 768px) {
		.meta-rating-card {
			flex-direction: column;
			align-items: stretch;
			gap: 1.25rem;
			padding: 1.25rem;
		}

		.slider-wrapper {
			min-width: 100%;
		}
	}
</style>

