<script lang="ts">
	import { slide } from 'svelte/transition';

	let { 
		world, 
		canvasAnswers = $bindable() 
	}: { 
		world: any; 
		canvasAnswers: Record<string, string>; 
	} = $props();

	const designConfig = $derived(world.design_modules || {});
	const fields = $derived(designConfig.fields || []);
</script>

<div class="canvas-grid text-left">
	{#each fields as field}
		{@const len = canvasAnswers[field.driver]?.trim().length ?? 0}
		<div class="canvas-field-card glass-card {field.driver.toLowerCase()}" in:slide>
			<div class="field-header flex items-center justify-between mb-2">
				<span class="driver-tag driver-{field.driver.toLowerCase()}">{field.driver.toUpperCase()}</span>
				<label for="driver-{field.driver}" class="field-title">{field.label}</label>
			</div>
			
			<div class="form-group mt-2">
				<textarea
					id="driver-{field.driver}"
					bind:value={canvasAnswers[field.driver]}
					placeholder={field.placeholder}
					rows="4"
					class="subject-input"
					required
				></textarea>
				
				<!-- Word counter helper -->
				<div class="word-counter text-xs text-right mt-1" class:valid={len >= 10}>
					{len}/10 caracteres mínimos {len >= 10 ? '✓' : '✗'}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	/* TRUE CANVAS GRID SYSTEM LAYOUT (3 Columns & Rows) */
	.canvas-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		width: 100%;
		align-items: stretch;
		box-sizing: border-box;
	}

	.canvas-field-card {
		padding: 1.5rem;
		border-radius: 24px;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.canvas-field-card:hover {
		transform: translateY(-2px);
		background: #ffffff;
		box-shadow: var(--shadow-solar-md);
		border-color: var(--color-solar-green-medium);
	}

	/* Specific placements for a premium Business Model Canvas vibe */
	.canvas-field-card.hedonismo { grid-column: 1; grid-row: 1; }
	.canvas-field-card.relacion { grid-column: 1; grid-row: 2; }

	.canvas-field-card.maestria { grid-column: 2; grid-row: 1; }
	.canvas-field-card.descubrimiento { grid-column: 2; grid-row: 2; }

	.canvas-field-card.empoderamiento { grid-column: 3; grid-row: 1; }
	.canvas-field-card.proposito { grid-column: 3; grid-row: 2; }

	.canvas-field-card.eficiencia { 
		grid-column: 1 / span 3; 
		grid-row: 3; 
	}

	@media (max-width: 1024px) {
		.canvas-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.canvas-field-card.eficiencia { grid-column: 1 / span 2; grid-row: auto; }
		.canvas-field-card.hedonismo { grid-column: auto; grid-row: auto; }
		.canvas-field-card.relacion { grid-column: auto; grid-row: auto; }
		.canvas-field-card.maestria { grid-column: auto; grid-row: auto; }
		.canvas-field-card.descubrimiento { grid-column: auto; grid-row: auto; }
		.canvas-field-card.empoderamiento { grid-column: auto; grid-row: auto; }
		.canvas-field-card.proposito { grid-column: auto; grid-row: auto; }
	}

	@media (max-width: 768px) {
		.canvas-grid {
			grid-template-columns: 1fr;
		}
		.canvas-field-card.eficiencia { grid-column: 1; }
	}

	.field-header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.03);
		padding-bottom: 0.5rem;
	}

	.driver-tag {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
	}

	/* Color categories for Drivers matching Solarpunk visual system */
	.driver-tag.driver-hedonismo { background: #ffe4e6; color: #e11d48; }
	.driver-tag.driver-eficiencia { background: #fee2e2; color: #b91c1c; }
	.driver-tag.driver-relacion { background: #ffedd5; color: #d97706; }
	.driver-tag.driver-maestria { background: #e0f2fe; color: #0369a1; }
	.driver-tag.driver-descubrimiento { background: #d2f5e3; color: #1e4533; }
	.driver-tag.driver-empoderamiento { background: #f3e8ff; color: #6b21a8; }
	.driver-tag.driver-proposito { background: #fef3c7; color: #b45309; }

	.field-title {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
		flex: 1;
		text-align: right;
	}

	/* STYLISH TEXTAREAS 100% WIDTH */
	.subject-input {
		width: 100% !important;
		min-height: 100px;
		resize: vertical;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.9rem;
		font-weight: 550;
		color: var(--color-solar-text);
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid rgba(61, 143, 104, 0.15);
		border-radius: 12px;
		padding: 0.75rem;
		outline: none;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);
		box-sizing: border-box;
	}

	.subject-input:hover {
		border-color: rgba(61, 143, 104, 0.35);
		background: #ffffff;
	}

	.subject-input:focus {
		background: #ffffff;
		border-color: var(--color-solar-green-medium);
		box-shadow: 
			0 0 0 4px rgba(61, 143, 104, 0.12),
			var(--shadow-solar-sm);
	}

	.word-counter {
		color: hsl(20, 70%, 55%);
		font-weight: 600;
	}

	.word-counter.valid {
		color: var(--color-solar-green-medium);
	}

	/* Helpers */
	.text-left { text-align: left; }
	.flex { display: flex; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.text-xs { font-size: 0.75rem; }
	.text-right { text-align: right; }
	.mt-1 { margin-top: 0.25rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mb-2 { margin-bottom: 0.5rem; }
</style>
