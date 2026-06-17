<script lang="ts">
	import { slide } from 'svelte/transition';
	import DesignAddRowButton from './DesignAddRowButton.svelte';

	let { 
		canvasAnswers = $bindable() 
	}: { 
		canvasAnswers: any[]; 
	} = $props();

	// Add new row
	function addRow() {
		canvasAnswers = [...canvasAnswers, { id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
	}

	// Remove row
	function removeRow(id: number) {
		if (canvasAnswers.length > 1) {
			canvasAnswers = canvasAnswers.filter(r => r.id !== id);
		} else {
			// Clear single remaining row
			canvasAnswers = [{ id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
		}
	}

	// Formats validation (optional helpers for UI highlight)
	function startsWithSi(str: string) {
		const clean = str.trim().toLowerCase();
		return clean.startsWith('si ') || clean.startsWith('si,') || clean.startsWith('si\n');
	}

	function containsEntonces(str: string) {
		const clean = str.trim().toLowerCase();
		return clean.includes('entonces');
	}
</script>

<div class="rows-container">
	{#each canvasAnswers as r, index (r.id)}
		<article class="design-row-card" transition:slide>
			<div class="row-header">
				<div class="row-header-left">
					<span class="row-num-badge">Fila de Diseño #{index + 1}</span>
					{#if startsWithSi(r.meta) && containsEntonces(r.meta) && r.meta.length >= 15 &&
						 startsWithSi(r.retroalimentacion) && containsEntonces(r.retroalimentacion) && r.retroalimentacion.length >= 15 &&
						 startsWithSi(r.recompensa) && containsEntonces(r.recompensa) && r.recompensa.length >= 15}
						<span class="row-valid-badge">✓ Fila Completa</span>
					{/if}
				</div>
				{#if canvasAnswers.length > 1}
					<button type="button" class="btn-remove-row" onclick={() => removeRow(r.id)}>
						🗑️ Eliminar Fila
					</button>
				{/if}
			</div>

			<div class="canvas-grid">
				
				<!-- Goal (Meta) Column -->
				<div class="col-field meta-col" class:field-valid={startsWithSi(r.meta) && containsEntonces(r.meta) && r.meta.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge meta-badge">META (GOAL)</span>
					</div>
					<textarea
						bind:value={r.meta}
						placeholder="Ej: Si completo la entrega del ensayo científico el lunes, entonces el sistema me otorga la medalla de Investigador."
						rows="4"
						class="subject-input"
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-format" class:valid={startsWithSi(r.meta) && containsEntonces(r.meta)}>
							{startsWithSi(r.meta) && containsEntonces(r.meta) ? '✓ Formato Si/Entonces' : '✗ Debe usar Si... entonces...'}
						</span>
						<span class="helper-chars" class:valid={r.meta.trim().length >= 15}>
							{r.meta.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- Feedback Column -->
				<div class="col-field feedback-col" class:field-valid={startsWithSi(r.retroalimentacion) && containsEntonces(r.retroalimentacion) && r.retroalimentacion.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge feedback-badge">RETROALIMENTACIÓN (FEEDBACK)</span>
					</div>
					<textarea
						bind:value={r.retroalimentacion}
						placeholder="Ej: Si recibo la medalla, entonces la plataforma me muestra un desglose de mi desempeño y un reporte de errores."
						rows="4"
						class="subject-input"
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-format" class:valid={startsWithSi(r.retroalimentacion) && containsEntonces(r.retroalimentacion)}>
							{startsWithSi(r.retroalimentacion) && containsEntonces(r.retroalimentacion) ? '✓ Formato Si/Entonces' : '✗ Debe usar Si... entonces...'}
						</span>
						<span class="helper-chars" class:valid={r.retroalimentacion.trim().length >= 15}>
							{r.retroalimentacion.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- Reward Column -->
				<div class="col-field reward-col" class:field-valid={startsWithSi(r.recompensa) && containsEntonces(r.recompensa) && r.recompensa.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge reward-badge">RECOMPENSA (REWARD)</span>
					</div>
					<textarea
						bind:value={r.recompensa}
						placeholder="Ej: Si leo mi reporte de desempeño detallado, entonces experimento auto-eficacia al resolver mis dudas."
						rows="4"
						class="subject-input"
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-format" class:valid={startsWithSi(r.recompensa) && containsEntonces(r.recompensa)}>
							{startsWithSi(r.recompensa) && containsEntonces(r.recompensa) ? '✓ Formato Si/Entonces' : '✗ Debe usar Si... entonces...'}
						</span>
						<span class="helper-chars" class:valid={r.recompensa.trim().length >= 15}>
							{r.recompensa.trim().length}/15 caracteres
						</span>
					</div>
				</div>

			</div>
		</article>
	{/each}
</div>

<DesignAddRowButton text="➕ Agregar Fila de Diseño" onclick={addRow} />

<style>
	:root {
		--meta-accent-color: #f43f5e;
		--meta-accent-glow: rgba(244, 63, 94, 0.12);
		--meta-accent-bg: rgba(244, 63, 94, 0.03);

		--feedback-accent-color: #0ea5e9;
		--feedback-accent-glow: rgba(14, 165, 233, 0.12);
		--feedback-accent-bg: rgba(14, 165, 233, 0.03);

		--reward-accent-color: #a855f7;
		--reward-accent-glow: rgba(168, 85, 247, 0.12);
		--reward-accent-bg: rgba(168, 85, 247, 0.03);

		--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

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
		transition: var(--transition-smooth);
		padding: 1.75rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
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
		gap: 0.75rem;
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
		transition: var(--transition-smooth);
	}

	.btn-remove-row:hover {
		text-decoration: underline;
		transform: scale(1.02);
	}

	/* Responsive 3-Column Grid */
	.canvas-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
	}

	@media (max-width: 1024px) {
		.canvas-grid {
			grid-template-columns: 1fr;
			gap: 1.25rem;
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
		transition: var(--transition-smooth);
		box-sizing: border-box;
	}

	.meta-col.field-valid { background: var(--meta-accent-bg); border-color: rgba(244, 63, 94, 0.15); }
	.feedback-col.field-valid { background: var(--feedback-accent-bg); border-color: rgba(14, 165, 233, 0.15); }
	.reward-col.field-valid { background: var(--reward-accent-bg); border-color: rgba(168, 85, 247, 0.15); }

	.field-title-row {
		display: flex;
		align-items: center;
	}

	.field-badge {
		font-size: 0.7rem;
		font-weight: 850;
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		letter-spacing: 0.06em;
		display: inline-block;
	}

	.meta-badge { background: #ffe4e6; color: #e11d48; }
	.feedback-badge { background: #e0f2fe; color: #0369a1; }
	.reward-badge { background: #f3e8ff; color: #6b21a8; }

	.subject-input {
		width: 100%;
		resize: none;
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.88rem;
		line-height: 1.5;
		font-weight: 550;
		color: var(--color-solar-text, #1f2937);
		background: #ffffff;
		border: 1.5px solid rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		padding: 0.85rem;
		outline: none;
		transition: var(--transition-smooth);
		box-sizing: border-box;
	}

	/* Focus colors */
	.meta-col .subject-input:focus {
		border-color: var(--meta-accent-color);
		box-shadow: 0 0 0 4px var(--meta-accent-glow);
	}

	.feedback-col .subject-input:focus {
		border-color: var(--feedback-accent-color);
		box-shadow: 0 0 0 4px var(--feedback-accent-glow);
	}

	.reward-col .subject-input:focus {
		border-color: var(--reward-accent-color);
		box-shadow: 0 0 0 4px var(--reward-accent-glow);
	}

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
		justify-content: space-between;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.helper-format, .helper-chars {
		color: var(--color-solar-terracotta, #e11d48);
		transition: var(--transition-smooth);
	}

	.helper-format.valid, .helper-chars.valid {
		color: #10b981;
	}
</style>
