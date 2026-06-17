<script lang="ts">
	import { slide } from 'svelte/transition';
	import DesignAddRowButton from './DesignAddRowButton.svelte';

	let { 
		canvasAnswers = $bindable() 
	}: { 
		canvasAnswers: any[]; 
	} = $props();

	// Add new cycle
	function addCycle() {
		canvasAnswers = [...canvasAnswers, { 
			id: Date.now(), 
			meta: '', 
			llamado: '', 
			eval_cognitiva: '', 
			accion_disparadora: '', 
			eval_juego: '', 
			retroalimentacion: '' 
		}];
	}

	// Remove cycle
	function removeCycle(id: number) {
		if (canvasAnswers.length > 1) {
			canvasAnswers = canvasAnswers.filter(c => c.id !== id);
		} else {
			// Clear single remaining cycle
			canvasAnswers = [{ 
				id: Date.now(), 
				meta: '', 
				llamado: '', 
				eval_cognitiva: '', 
				accion_disparadora: '', 
				eval_juego: '', 
				retroalimentacion: '' 
			}];
		}
	}
</script>

<div class="rows-container">
	{#each canvasAnswers as cycle, index (cycle.id)}
		<article class="design-row-card p-6" transition:slide>
			<div class="row-header mb-4">
				<div class="row-header-left flex items-center gap-2">
					<span class="row-num-badge">Ciclo de Diseño #{index + 1}</span>
					{#if cycle.meta.trim().length >= 15 &&
						 cycle.llamado.trim().length >= 15 &&
						 cycle.eval_cognitiva.trim().length >= 15 &&
						 cycle.accion_disparadora.trim().length >= 15 &&
						 cycle.eval_juego.trim().length >= 15 &&
						 cycle.retroalimentacion.trim().length >= 15}
						<span class="row-valid-badge">✓ Ciclo Completo</span>
					{/if}
				</div>
				{#if canvasAnswers.length > 1}
					<button type="button" class="btn-remove-row" onclick={() => removeCycle(cycle.id)}>
						🗑️ Eliminar Ciclo
					</button>
				{/if}
			</div>

			<div class="canvas-grid">
				
				<!-- 1. META -->
				<div class="col-field meta-col" class:field-valid={cycle.meta.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge meta-badge">1. META</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.meta}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.meta.trim().length >= 15}>
							{cycle.meta.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 2. LLAMADO -->
				<div class="col-field called-col" class:field-valid={cycle.llamado.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge called-badge">2. ESTÍMULO</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.llamado}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.llamado.trim().length >= 15}>
							{cycle.llamado.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 3. COGNITIVA -->
				<div class="col-field cognitive-col" class:field-valid={cycle.eval_cognitiva.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge cognitive-badge">3. EVAL. COGNITIVA</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.eval_cognitiva}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.eval_cognitiva.trim().length >= 15}>
							{cycle.eval_cognitiva.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 4. ACCION -->
				<div class="col-field action-col" class:field-valid={cycle.accion_disparadora.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge action-badge">4. ACCIÓN</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.accion_disparadora}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.accion_disparadora.trim().length >= 15}>
							{cycle.accion_disparadora.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 5. EVAL JUEGO -->
				<div class="col-field rules-col" class:field-valid={cycle.eval_juego.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge rules-badge">5. EVAL. JUEGO</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.eval_juego}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.eval_juego.trim().length >= 15}>
							{cycle.eval_juego.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 6. RETRO -->
				<div class="col-field feedback-col" class:field-valid={cycle.retroalimentacion.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge feedback-badge">6. RETROALIMENTACIÓN</span>
					</div>
					<textarea 
						placeholder="" 
						class="subject-input h-24"
						bind:value={cycle.retroalimentacion}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={cycle.retroalimentacion.trim().length >= 15}>
							{cycle.retroalimentacion.trim().length}/15 caracteres
						</span>
					</div>
				</div>

			</div>
		</article>
	{/each}
</div>

<DesignAddRowButton text="➕ Agregar Fila de Ciclo" onclick={addCycle} />

<style>
	.rows-container {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
		box-sizing: border-box;
	}

	.design-row-card {
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(12px);
		border-radius: var(--radius-solar-md, 18px);
		box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.75rem;
	}

	.design-row-card:hover {
		box-shadow: 0 12px 36px -8px rgba(0, 0, 0, 0.06);
		border-color: rgba(61, 143, 104, 0.25);
	}

	.row-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.row-header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.row-num-badge {
		font-family: var(--font-solar-header, inherit);
		font-weight: 800;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		padding: 0.3rem 0.85rem;
		border-radius: 99px;
		letter-spacing: 0.02em;
	}

	.row-valid-badge {
		font-size: 0.72rem;
		font-weight: 700;
		color: #10b981;
		background: rgba(16, 185, 129, 0.1);
		padding: 0.3rem 0.85rem;
		border-radius: 99px;
	}

	.btn-remove-row {
		background: none;
		border: none;
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-terracotta, #e11d48);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		transition: all 0.2s ease;
	}

	.btn-remove-row:hover {
		text-decoration: underline;
		transform: scale(1.02);
	}

	/* Desktop 6-Column Grid */
	.canvas-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
	}

	@media (max-width: 1200px) {
		.canvas-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	@media (max-width: 768px) {
		.canvas-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	/* Column Fields */
	.col-field {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: rgba(255, 255, 255, 0.55);
		padding: 1.25rem;
		border-radius: 14px;
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.meta-col.field-valid { background: rgba(225, 29, 72, 0.04); border-color: rgba(225, 29, 72, 0.15); }
	.called-col.field-valid { background: rgba(234, 88, 12, 0.04); border-color: rgba(234, 88, 12, 0.15); }
	.cognitive-col.field-valid { background: rgba(202, 138, 4, 0.04); border-color: rgba(202, 138, 4, 0.15); }
	.action-col.field-valid { background: rgba(22, 163, 74, 0.04); border-color: rgba(22, 163, 74, 0.15); }
	.rules-col.field-valid { background: rgba(3, 105, 161, 0.04); border-color: rgba(3, 105, 161, 0.15); }
	.feedback-col.field-valid { background: rgba(107, 33, 168, 0.04); border-color: rgba(107, 33, 168, 0.15); }

	.field-title-row {
		display: flex;
		align-items: center;
	}

	.field-badge {
		font-size: 0.65rem;
		font-weight: 850;
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		letter-spacing: 0.06em;
		display: inline-block;
	}

	.meta-badge { background: #ffe4e6; color: #e11d48; }
	.called-badge { background: #ffedd5; color: #ea580c; }
	.cognitive-badge { background: #fef9c3; color: #ca8a04; }
	.action-badge { background: #dcfce7; color: #16a34a; }
	.rules-badge { background: #e0f2fe; color: #0369a1; }
	.feedback-badge { background: #f3e8ff; color: #6b21a8; }

	.subject-input {
		width: 100%;
		resize: none;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.85rem;
		line-height: 1.5;
		font-weight: 550;
		color: var(--color-solar-text, #1f2937);
		background: #ffffff;
		border: 1.5px solid rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		padding: 0.85rem;
		outline: none;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	/* Focus colors */
	.meta-col .subject-input:focus { border-color: #e11d48; box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15); }
	.called-col .subject-input:focus { border-color: #ea580c; box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.15); }
	.cognitive-col .subject-input:focus { border-color: #ca8a04; box-shadow: 0 0 0 4px rgba(202, 138, 4, 0.15); }
	.action-col .subject-input:focus { border-color: #16a34a; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15); }
	.rules-col .subject-input:focus { border-color: #0369a1; box-shadow: 0 0 0 4px rgba(3, 105, 161, 0.15); }
	.feedback-col .subject-input:focus { border-color: #6b21a8; box-shadow: 0 0 0 4px rgba(107, 33, 168, 0.15); }

	/* Scrollbars */
	.subject-input::-webkit-scrollbar {
		width: 6px;
	}
	.subject-input::-webkit-scrollbar-track {
		background: transparent;
	}
	.subject-input::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.12);
		border-radius: 4px;
	}
	.subject-input::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.22);
	}

	/* Validation Helpers styling */
	.validation-helpers {
		display: flex;
		justify-content: flex-end;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.helper-chars {
		color: var(--color-solar-terracotta, #e11d48);
		transition: all 0.2s ease;
	}

	.helper-chars.valid {
		color: #10b981;
	}
</style>
