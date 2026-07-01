<script lang="ts">
	import { slide } from 'svelte/transition';
	import DesignAddRowButton from './DesignAddRowButton.svelte';

	let { 
		canvasAnswers = $bindable() 
	}: { 
		canvasAnswers: any[]; 
	} = $props();

	// Static definition of heuristic categories
	const heuristics = [
		{ id: 'disponibilidad', name: 'Heurística de Disponibilidad', description: 'Evaluar probabilidades basado en la facilidad de recordar ejemplos recientes.' },
		{ id: 'decoy', name: 'Efecto Señuelo (Decoy)', description: 'Presentar una opción asimétrica peor para empujar hacia la opción deseada.' },
		{ id: 'loss_aversion', name: 'Aversión a la Pérdida', description: 'La tendencia psicológica a evitar pérdidas antes que obtener ganancias equivalentes.' },
		{ id: 'sunk_cost', name: 'Falacia del Costo Hundido', description: 'Persistir en una tarea o inversión fallida por los recursos ya invertidos.' },
		{ id: 'present_bias', name: 'Sesgo del Presente', description: 'Sobrevalorar recompensas inmediatas frente a utilidades futuras diferidas.' },
		{ id: 'control_illusion', name: 'Ilusión de Control', description: 'Creer que se influye en resultados azarosos mediante acciones personales.' }
	];

	// Static definition of game strategy categories
	const gameStrategies = [
		{ id: 'blind_choice', name: 'Elección Ciega', description: 'Obligar a elegir sin información previa sobre riesgos y consecuencias.' },
		{ id: 'dominant_strategy', name: 'Estrategia Dominante', description: 'Una opción óptima que anula el dilema estratégico de decidir.' },
		{ id: 'meaningful_choice', name: 'Elección Significativa', description: 'Elección informada con impacto claro en el juego y trade-offs equilibrados.' },
		{ id: 'cosmetic_agency', name: 'Agencia Cosmética / Decorativa', description: 'Personalizar o expresar identidad sin alterar las reglas del juego.' },
		{ id: 'fake_choice', name: 'Elección Falsa / Ilusión de Agencia', description: 'Ofrecer opciones que conducen inevitablemente al mismo resultado.' }
	];

	// Add a new row to the canvas
	function addRow() {
		canvasAnswers = [...canvasAnswers, { 
			id: Date.now() + Math.random(),
			heuristicId: heuristics[0].id,
			heuristicIdea: '',
			strategyId: gameStrategies[0].id,
			strategyIdea: ''
		}];
	}

	// Remove row from the canvas
	function removeRow(id: number) {
		if (canvasAnswers.length > 1) {
			canvasAnswers = canvasAnswers.filter(r => r.id !== id);
		} else {
			// Reset single remaining card
			canvasAnswers = [{ 
				id: Date.now() + Math.random(),
				heuristicId: heuristics[0].id,
				heuristicIdea: '',
				strategyId: gameStrategies[0].id,
				strategyIdea: ''
			}];
		}
	}
</script>

<div class="rows-container">
	{#each canvasAnswers as item, index (item.id)}
		{@const heuristicValid = item.heuristicIdea.trim().length >= 15}
		{@const strategyValid = item.strategyIdea.trim().length >= 15}
		{@const cardValid = heuristicValid && strategyValid}

		<article class="design-row-card" transition:slide>
			<div class="row-header">
				<div class="row-header-left">
					<span class="row-num-badge">Matriz de Diseño #{index + 1}</span>
					{#if cardValid}
						<span class="row-valid-badge">✓ Matriz Calibrada</span>
					{/if}
				</div>
				{#if canvasAnswers.length > 1}
					<button type="button" class="btn-remove-row" onclick={() => removeRow(item.id)}>
						🗑️ Eliminar Fila
					</button>
				{/if}
			</div>

			<div class="canvas-grid-split">
				<!-- COLUMNA IZQUIERDA: HEURÍSTICA CONDUCTUAL -->
				<div class="col-field" class:field-valid={heuristicValid}>
					<div class="field-title-row">
						<span class="field-badge heuristic-badge">🧠 1. SESGO / HEURÍSTICA CONDUCTUAL</span>
					</div>
					
					<label for="heuristic-select-{item.id}" class="field-hint block mb-1">Selecciona el principio cognitivo a aplicar:</label>
					<select 
						id="heuristic-select-{item.id}"
						class="dropdown-select mb-3"
						bind:value={item.heuristicId}
					>
						{#each heuristics as h}
							<option value={h.id}>{h.name}</option>
						{/each}
					</select>

					<label for="heuristic-idea-{item.id}" class="field-hint block mb-1"><strong>Idea de Aplicación en el Aula:</strong> ¿Cómo activarás o mitigarás esta heurística en tus alumnos?</label>
					<textarea 
						id="heuristic-idea-{item.id}"
						placeholder="Ej: Para mitigar el Sesgo del Presente, estructuraremos entregas de borradores semanales con bonos menores inmediatos en lugar de un gran proyecto final..." 
						class="subject-input"
						bind:value={item.heuristicIdea}
						required
					></textarea>
					
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={heuristicValid}>
							{item.heuristicIdea.trim().length}/15 caracteres
						</span>
					</div>
				</div>

				<!-- COLUMNA DERECHA: ESTRATEGIA DE JUEGO -->
				<div class="col-field" class:field-valid={strategyValid}>
					<div class="field-title-row">
						<span class="field-badge strategy-badge">🎮 2. ESTRATEGIA DE DISEÑO DE JUEGO</span>
					</div>

					<label for="strategy-select-{item.id}" class="field-hint block mb-1">Selecciona la dinámica de elección lúdica:</label>
					<select 
						id="strategy-select-{item.id}"
						class="dropdown-select mb-3"
						bind:value={item.strategyId}
					>
						{#each gameStrategies as s}
							<option value={s.id}>{s.name}</option>
						{/each}
					</select>

					<label for="strategy-idea-{item.id}" class="field-hint block mb-1"><strong>Idea de Aplicación en el Aula:</strong> ¿Cómo estructurarás esta elección (ciega, cosmética, significativa, etc.)?</label>
					<textarea 
						id="strategy-idea-{item.id}"
						placeholder="Ej: Integraremos Agencia Cosmética permitiendo que cada grupo elija la insignia heráldica y el nombre de fantasía de su equipo para incentivar la identidad..." 
						class="subject-input"
						bind:value={item.strategyIdea}
						required
					></textarea>
					
					<div class="validation-helpers">
						<span class="helper-chars" class:valid={strategyValid}>
							{item.strategyIdea.trim().length}/15 caracteres
						</span>
					</div>
				</div>
			</div>
		</article>
	{/each}

	<div class="add-row-action mt-6">
		<DesignAddRowButton 
			onclick={addRow} 
			text="Agregar Nueva Fila de Calibración" 
		/>
	</div>
</div>

<style>
	.rows-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		text-align: left;
	}

	.design-row-card {
		background: #ffffff;
		border: 1.5px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		border-radius: 24px;
		padding: 1.5rem;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.25s ease;
	}

	.design-row-card:hover {
		box-shadow: var(--shadow-solar-md);
		border-color: var(--color-solar-green-medium);
	}

	.row-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1.5px dashed rgba(0, 0, 0, 0.06);
		padding-bottom: 0.75rem;
		margin-bottom: 1rem;
	}

	.row-header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.row-num-badge {
		font-family: var(--font-solar-header), sans-serif;
		font-weight: 850;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, #d1f5e3);
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
	}

	.row-valid-badge {
		font-size: 0.7rem;
		font-weight: 800;
		color: #15803d;
		background: #dcfce7;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
	}

	.btn-remove-row {
		background: none;
		border: none;
		color: #b91c1c;
		font-size: 0.75rem;
		font-weight: 800;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		transition: background 0.15s ease;
	}

	.btn-remove-row:hover {
		background: #fee2e2;
	}

	.canvas-grid-split {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.canvas-grid-split {
			grid-template-columns: 1fr 1fr;
		}
	}

	.col-field {
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid rgba(0, 0, 0, 0.04);
		padding: 1.25rem;
		border-radius: 18px;
		display: flex;
		flex-direction: column;
		transition: all 0.2s ease;
	}

	.col-field.field-valid {
		border-color: #86efac;
		background: rgba(240, 253, 244, 0.30);
	}

	.field-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.field-badge {
		font-family: var(--font-solar-header), sans-serif;
		font-weight: 850;
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.02em;
	}

	.heuristic-badge {
		background: #dbeafe;
		color: #1e40af;
	}

	.strategy-badge {
		background: #faf5ff;
		color: #6b21a8;
	}

	.field-hint {
		font-size: 0.7rem;
		color: var(--color-solar-text-muted, #7c8b82);
		line-height: 1.4;
		margin-bottom: 0.75rem;
	}

	.dropdown-select {
		width: 100%;
		padding: 0.5rem;
		border: 1.5px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 700;
		background-color: white;
		color: var(--color-solar-green-dark);
		outline: none;
		cursor: pointer;
	}

	.subject-input {
		width: 100%;
		min-height: 90px;
		padding: 0.75rem;
		border: 1.5px solid var(--color-solar-card-border, rgba(0,0,0,0.08));
		border-radius: 10px;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark);
		background: white;
		resize: vertical;
		outline: none;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
	}

	.subject-input:focus {
		border-color: var(--color-solar-green-medium);
	}

	.validation-helpers {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.35rem;
	}

	.helper-chars {
		font-size: 0.65rem;
		font-weight: 800;
		color: #ef4444;
	}

	.helper-chars.valid {
		color: #16a34a;
	}
</style>
