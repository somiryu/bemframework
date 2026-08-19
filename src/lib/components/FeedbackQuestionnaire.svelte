<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide, fade } from 'svelte/transition';
	import { learnTranslations } from '$lib/content/learn';

	let { 
		world, 
		player,
		lang = 'es',
		onSubmitted 
	}: { 
		world: any; 
		player: any;
		lang?: 'es' | 'en';
		onSubmitted: () => void 
	} = $props();

	const t = $derived(learnTranslations[lang].feedback);

	let ratingEngagement = $state(5);
	let ratingDifficulty = $state(3);
	let ratingPace = $state(4);
	let ratingRelevance = $state(5);
	
	let comment = $state('');
	let allowPublic = $state(true);
	let isSubmitting = $state(false);

	function setEngagement(val: number) { ratingEngagement = val; }
	function setDifficulty(val: number) { ratingDifficulty = val; }
	function setPace(val: number) { ratingPace = val; }
	function setRelevance(val: number) { ratingRelevance = val; }
</script>

<div class="feedback-overlay" transition:fade>
	<div class="feedback-container glass-card" in:slide={{ duration: 400 }}>
		<div class="feedback-header">
			<span class="solar-ornament">
				{lang === 'es' ? '💬 EVALUACIÓN DE SESIÓN' : '💬 SESSION EVALUATION'}
			</span>
			<h2>{t.title} {world.displayNumber ?? world.order_index}</h2>
			<p>{t.subtitle}</p>
		</div>

		<form
			method="POST"
			action="?/submitWorkshopFeedback"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update, result }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						onSubmitted();
					}
					await update();
				};
			}}
			class="feedback-form"
		>
			<input type="hidden" name="world_id" value={world.id} />
			<input type="hidden" name="player_name" value={player.name} />
			<input type="hidden" name="rating_engagement" value={ratingEngagement} />
			<input type="hidden" name="rating_difficulty" value={ratingDifficulty} />
			<input type="hidden" name="rating_pace" value={ratingPace} />
			<input type="hidden" name="rating_relevance" value={ratingRelevance} />
			<input type="hidden" name="allow_public" value={allowPublic ? 'true' : 'false'} />

			<div class="ratings-sliders-grid">
				<!-- Metric 1: Engagement -->
				<div class="metric-rating-row">
					<div class="metric-info">
						<span class="m-title">{t.metrics.engagement.label}</span>
						<p class="m-desc">{t.metrics.engagement.desc}</p>
					</div>
					<div class="stars-selector">
						{#each Array(5) as _, i}
							<button 
								type="button" 
								class="star-btn" 
								class:active={i < ratingEngagement} 
								onclick={() => setEngagement(i + 1)}
							>
								★
							</button>
						{/each}
						<span class="rating-label-num">({ratingEngagement}/5)</span>
					</div>
				</div>

				<!-- Metric 2: Difficulty -->
				<div class="metric-rating-row">
					<div class="metric-info">
						<span class="m-title">{t.metrics.difficulty.label}</span>
						<p class="m-desc">{t.metrics.difficulty.desc}</p>
					</div>
					<div class="stars-selector">
						{#each Array(5) as _, i}
							<button 
								type="button" 
								class="star-btn" 
								class:active={i < ratingDifficulty} 
								onclick={() => setDifficulty(i + 1)}
							>
								★
							</button>
						{/each}
						<span class="rating-label-num">({ratingDifficulty}/5)</span>
					</div>
				</div>

				<!-- Metric 3: Pace -->
				<div class="metric-rating-row">
					<div class="metric-info">
						<span class="m-title">{t.metrics.pace.label}</span>
						<p class="m-desc">{t.metrics.pace.desc}</p>
					</div>
					<div class="stars-selector">
						{#each Array(5) as _, i}
							<button 
								type="button" 
								class="star-btn" 
								class:active={i < ratingPace} 
								onclick={() => setPace(i + 1)}
							>
								★
							</button>
						{/each}
						<span class="rating-label-num">({ratingPace}/5)</span>
					</div>
				</div>

				<!-- Metric 4: Relevance -->
				<div class="metric-rating-row">
					<div class="metric-info">
						<span class="m-title">{t.metrics.relevance.label}</span>
						<p class="m-desc">{t.metrics.relevance.desc}</p>
					</div>
					<div class="stars-selector">
						{#each Array(5) as _, i}
							<button 
								type="button" 
								class="star-btn" 
								class:active={i < ratingRelevance} 
								onclick={() => setRelevance(i + 1)}
							>
								★
							</button>
						{/each}
						<span class="rating-label-num">({ratingRelevance}/5)</span>
					</div>
				</div>
			</div>

			<hr class="separator-line" />

			<!-- Testimonial Text Area -->
			<div class="form-group text-left">
				<label for="comment-box">{t.testimonyLabel}</label>
				<textarea
					id="comment-box"
					name="comment"
					bind:value={comment}
					placeholder={t.testimonyPlaceholder}
					rows="4"
					class="subject-input"
				></textarea>
			</div>

			<!-- Public testimonies opt-out checkbox -->
			<div class="checkbox-row text-left">
				<label class="checkbox-container">
					<input 
						type="checkbox" 
						bind:checked={allowPublic}
					/>
					<span class="checkmark"></span>
					<div class="checkbox-label">
						<strong>{t.allowPublicLabel}</strong>
						<p class="text-xs text-solar-text-muted mt-0.5">
							{#if lang === 'es'}
								Permitir que la OMIE muestre mi alias y testimonio en la página de inicio o folletos para futuros estudiantes.
							{:else}
								Allow OMIE to display my alias and testimony on the homepage or brochures for future students.
							{/if}
						</p>
					</div>
				</label>
			</div>

			<button 
				type="submit" 
				class="btn-solar-primary w-full justify-center mt-6 animate-solar-pulse"
				disabled={isSubmitting}
			>
				{#if isSubmitting}
					{t.submitting}
				{:else}
					{t.submitBtn}
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.feedback-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.45);
		backdrop-filter: blur(8px);
		z-index: 60000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overflow-y: auto;
	}

	.feedback-container {
		max-width: 680px;
		width: 100%;
		background: #ffffff;
		border-radius: var(--radius-solar-lg, 32px);
		border: 1px solid var(--color-solar-green-medium);
		padding: 2.5rem;
		box-shadow: var(--shadow-solar-lg);
		max-height: 90vh;
		overflow-y: auto;
	}

	@media (max-width: 640px) {
		.feedback-container {
			padding: 1.5rem;
		}
	}

	.feedback-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.solar-ornament {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.1em;
	}

	.feedback-header h2 {
		font-family: var(--font-solar-header);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0.5rem 0;
	}

	.feedback-header p {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
		font-weight: 550;
	}

	.feedback-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.ratings-sliders-grid {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.metric-rating-row {
		display: grid;
		grid-template-columns: 1fr 180px;
		gap: 1rem;
		align-items: center;
		background: var(--color-solar-bg);
		padding: 1rem 1.25rem;
		border-radius: 16px;
		border: 1px solid var(--color-solar-card-border);
		text-align: left;
	}

	@media (max-width: 580px) {
		.metric-rating-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
	}

	.metric-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.m-title {
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark);
	}

	.m-desc {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.3;
		font-weight: 550;
	}

	.stars-selector {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		justify-content: flex-end;
	}

	@media (max-width: 580px) {
		.stars-selector {
			justify-content: flex-start;
		}
	}

	.star-btn {
		background: transparent;
		border: none;
		font-size: 1.6rem;
		color: #D1D5DB;
		cursor: pointer;
		transition: transform 0.15s ease, color 0.15s ease;
		padding: 0;
	}

	.star-btn:hover {
		transform: scale(1.2);
	}

	.star-btn.active {
		color: var(--color-solar-yellow);
	}

	.rating-label-num {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-solar-text);
		margin-left: 0.5rem;
		min-width: 32px;
	}

	.separator-line {
		border: none;
		border-top: 1px solid var(--color-solar-card-border);
		margin: 0.5rem 0;
	}

	.text-left { text-align: left; }

	.form-group label {
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark);
		display: block;
		margin-bottom: 0.5rem;
	}

	/* CUSTOM CHECKBOX */
	.checkbox-row {
		margin-top: 0.5rem;
	}

	.checkbox-container {
		display: flex;
		position: relative;
		padding-left: 2.25rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-container input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		top: 2px;
		left: 0;
		height: 22px;
		width: 22px;
		background-color: var(--color-solar-bg);
		border: 1.5px solid var(--color-solar-green-medium);
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.checkbox-container:hover input ~ .checkmark {
		background-color: #E5E7EB;
	}

	.checkbox-container input:checked ~ .checkmark {
		background-color: var(--color-solar-green-medium);
		border-color: var(--color-solar-green-dark);
	}

	.checkmark::after {
		content: "";
		position: absolute;
		display: none;
	}

	.checkbox-container input:checked ~ .checkmark::after {
		display: block;
	}

	.checkbox-container .checkmark::after {
		left: 7px;
		top: 3px;
		width: 6px;
		height: 11px;
		border: solid white;
		border-width: 0 2.5px 2.5px 0;
		transform: rotate(45deg);
	}

	.checkbox-label {
		display: flex;
		flex-direction: column;
	}

	.checkbox-label strong {
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
	}
</style>
