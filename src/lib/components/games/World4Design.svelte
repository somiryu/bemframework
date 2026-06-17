<script lang="ts">
	import { slide } from 'svelte/transition';
	import DesignAddRowButton from './DesignAddRowButton.svelte';

	let { 
		canvasAnswers = $bindable() 
	}: { 
		canvasAnswers: any[]; 
	} = $props();

	// Add new goal row
	function addGoal() {
		canvasAnswers = [...canvasAnswers, { 
			id: Date.now(), 
			meta: '', 
			tipo: '', 
			expectativa: '', 
			cuadrante: '' 
		}];
	}

	// Remove goal row
	function removeGoal(id: number) {
		if (canvasAnswers.length > 1) {
			canvasAnswers = canvasAnswers.filter(g => g.id !== id);
		} else {
			// Clear single remaining goal
			canvasAnswers = [{ 
				id: Date.now(), 
				meta: '', 
				tipo: '', 
				expectativa: '', 
				cuadrante: '' 
			}];
		}
	}
</script>

<div class="rows-container">
	{#each canvasAnswers as goal, index (goal.id)}
		<article class="design-row-card" transition:slide>
			<div class="row-header">
				<div class="row-header-left">
					<span class="row-num-badge">Meta de Aprendizaje #{index + 1}</span>
					{#if goal.meta.trim().length >= 15 &&
						 goal.tipo.trim().length >= 15 &&
						 goal.expectativa.trim().length >= 15 &&
						 goal.cuadrante.trim().length >= 15}
						<span class="row-valid-badge">✓ Meta Completa</span>
					{/if}
				</div>
				{#if canvasAnswers.length > 1}
					<button type="button" class="btn-remove-row" onclick={() => removeGoal(goal.id)}>
						🗑️ Eliminar Meta
					</button>
				{/if}
			</div>

			<div class="canvas-grid">
				
				<!-- 1. META -->
				<div class="col-field meta-col" class:field-valid={goal.meta.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge meta-badge">1. META</span>
					</div>
					<p class="field-hint">Describe la meta de aprendizaje: ¿qué quieres que logren los estudiantes?</p>
					<textarea 
						placeholder="Ej: Dominar las reglas de acentuación para textos formales..." 
						class="subject-input"
						bind:value={goal.meta}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={goal.meta.trim().length >= 15}>
							{goal.meta.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 2. TIPO -->
				<div class="col-field tipo-col" class:field-valid={goal.tipo.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge tipo-badge">2. TIPO DE OBJETIVO</span>
					</div>
					<p class="field-hint">Clasifica: ¿es una meta Narrativa Integrada, Principal (Aproximación o Evasión) o Secundaria?</p>
					<textarea 
						placeholder="Ej: Meta Principal de Aproximación, porque busca que el estudiante adquiera..." 
						class="subject-input"
						bind:value={goal.tipo}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={goal.tipo.trim().length >= 15}>
							{goal.tipo.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 3. EXPECTATIVA -->
				<div class="col-field expectativa-col" class:field-valid={goal.expectativa.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge expectativa-badge">3. EXPECTATIVA</span>
					</div>
					<p class="field-hint">Describe los valores esperados de las 7 variables: Deseabilidad, Progreso, Dificultad, Plazo, Medición, Agencia, Esfuerzo.</p>
					<textarea 
						placeholder="Ej: Alta deseabilidad por la dinámica de juego; progreso visible con badges; dificultad media..." 
						class="subject-input tall-input"
						bind:value={goal.expectativa}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={goal.expectativa.trim().length >= 15}>
							{goal.expectativa.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- 4. CUADRANTE -->
				<div class="col-field cuadrante-col" class:field-valid={goal.cuadrante.trim().length >= 15}>
					<div class="field-title-row">
						<span class="field-badge cuadrante-badge">4. CUADRANTE Q/T</span>
					</div>
					<p class="field-hint">Ubica en la Matriz Quiero/Tengo: Adquisición, Mantenimiento, Eliminación o Prevención. Justifica.</p>
					<textarea 
						placeholder="Ej: Adquisición — El estudiante no tiene el hábito y quiere obtenerlo, por lo tanto..." 
						class="subject-input"
						bind:value={goal.cuadrante}
						required
					></textarea>
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={goal.cuadrante.trim().length >= 15}>
							{goal.cuadrante.trim().length}/15 caracteres
						</span>
					</div>
				</div>

			</div>
		</article>
	{/each}
</div>

<DesignAddRowButton text="➕ Agregar Meta de Aprendizaje" onclick={addGoal} />

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

	/* Desktop 4-Column Grid */
	.canvas-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
	}

	@media (max-width: 1200px) {
		.canvas-grid {
			grid-template-columns: repeat(2, 1fr);
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
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.55);
		padding: 1.25rem;
		border-radius: 14px;
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	/* Valid field accents */
	.meta-col.field-valid { background: rgba(107, 33, 168, 0.04); border-color: rgba(107, 33, 168, 0.15); }
	.tipo-col.field-valid { background: rgba(3, 105, 161, 0.04); border-color: rgba(3, 105, 161, 0.15); }
	.expectativa-col.field-valid { background: rgba(22, 163, 74, 0.04); border-color: rgba(22, 163, 74, 0.15); }
	.cuadrante-col.field-valid { background: rgba(234, 88, 12, 0.04); border-color: rgba(234, 88, 12, 0.15); }

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

	.meta-badge { background: #f3e8ff; color: #6b21a8; }
	.tipo-badge { background: #e0f2fe; color: #0369a1; }
	.expectativa-badge { background: #dcfce7; color: #16a34a; }
	.cuadrante-badge { background: #ffedd5; color: #ea580c; }

	.field-hint {
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--color-solar-text-muted, #777);
		margin: 0;
		font-weight: 500;
	}

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
		min-height: 96px;
	}

	.tall-input {
		min-height: 130px;
	}

	/* Focus colors */
	.meta-col .subject-input:focus { border-color: #6b21a8; box-shadow: 0 0 0 4px rgba(107, 33, 168, 0.15); }
	.tipo-col .subject-input:focus { border-color: #0369a1; box-shadow: 0 0 0 4px rgba(3, 105, 161, 0.15); }
	.expectativa-col .subject-input:focus { border-color: #16a34a; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15); }
	.cuadrante-col .subject-input:focus { border-color: #ea580c; box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.15); }

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
