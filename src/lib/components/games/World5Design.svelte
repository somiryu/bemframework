<script lang="ts">
	import { slide } from 'svelte/transition';
	import DesignAddRowButton from './DesignAddRowButton.svelte';

	let { 
		canvasAnswers = $bindable() 
	}: { 
		canvasAnswers: any[]; 
	} = $props();

	// Add a new notification card
	function addNotification() {
		canvasAnswers = [...canvasAnswers, { 
			id: Date.now(), 
			accion: '', 
			senal: '', 
			intensidad: 3, 
			coherencia: 3, 
			timing: 3 
		}];
	}

	// Remove notification card
	function removeNotification(id: number) {
		if (canvasAnswers.length > 1) {
			canvasAnswers = canvasAnswers.filter(n => n.id !== id);
		} else {
			// Reset single remaining card
			canvasAnswers = [{ 
				id: Date.now(), 
				accion: '', 
				senal: '', 
				intensidad: 3, 
				coherencia: 3, 
				timing: 3 
			}];
		}
	}
</script>

<div class="rows-container">
	{#each canvasAnswers as item, index (item.id)}
		<article class="design-row-card" transition:slide>
			<div class="row-header">
				<div class="row-header-left">
					<span class="row-num-badge">Diseño de Alerta #{index + 1}</span>
					{#if item.accion.trim().length >= 15 && item.senal.trim().length >= 15}
						<span class="row-valid-badge">✓ Señal Calibrada</span>
					{/if}
				</div>
				{#if canvasAnswers.length > 1}
					<button type="button" class="btn-remove-row" onclick={() => removeNotification(item.id)}>
						🗑️ Eliminar Señal
					</button>
				{/if}
			</div>

			<div class="canvas-grid-split">
				<!-- LADO IZQUIERDO: TEXTOS -->
				<div class="fields-section">
					<!-- 1. ACCION -->
					<div class="col-field" class:field-valid={item.accion.trim().length >= 15}>
						<div class="field-title-row">
							<span class="field-badge action-badge">🎯 1. COMPORTAMIENTO DESEADO</span>
						</div>
						<p class="field-hint">¿Qué hábito, acción o comportamiento específico buscas gatillar en el alumno?</p>
						<textarea 
							placeholder="Ej: Completar la lectura previa de circuitos eléctricos antes del taller presencial del martes..." 
							class="subject-input"
							bind:value={item.accion}
							required
						></textarea>
						<div class="validation-helpers">
							<span class="helper-chars" class:valid={item.accion.trim().length >= 15}>
								{item.accion.trim().length}/15 caracteres
							</span>
						</div>
					</div>

					<!-- 2. SENAL -->
					<div class="col-field mt-4" class:field-valid={item.senal.trim().length >= 15}>
						<div class="field-title-row">
							<span class="field-badge signal-badge">📢 2. DISEÑO DE LA ALERTA (SEÑAL PUSH)</span>
						</div>
						<p class="field-hint">¿Cómo es la señal? Describe el canal, sonido, texto, urgencia y disparador visual.</p>
						<textarea 
							placeholder="Ej: Notificación push corta por WhatsApp 24 horas antes del taller, con link directo al PDF y tono suave..." 
							class="subject-input"
							bind:value={item.senal}
							required
						></textarea>
						<div class="validation-helpers">
							<span class="helper-chars" class:valid={item.senal.trim().length >= 15}>
								{item.senal.trim().length}/15 caracteres
							</span>
						</div>
					</div>
				</div>

				<!-- LADO DERECHO: SLIDERS -->
				<div class="sliders-section">
					<span class="sliders-header-title">📊 Calibración de Parámetros (GIOCHI)</span>
					<p class="sliders-hint-desc">Define el espectro de atención de tu notificación en base a los criterios de diseño:</p>

					<!-- Slider 1: Intensidad -->
					<div class="slider-field">
						<div class="slider-header-row">
							<span class="slider-title-label">💥 Intensidad Emocional</span>
							<span class="slider-value-display val-{item.intensidad}">{item.intensidad} / 5</span>
						</div>
						<input 
							type="range" 
							min="1" 
							max="5" 
							class="range-slider intensity-bar" 
							bind:value={item.intensidad}
						/>
						<div class="slider-labels-row">
							<span>1: Sutil / Inerte</span>
							<span>5: Agresivo / Alarma</span>
						</div>
					</div>

					<!-- Slider 2: Coherencia -->
					<div class="slider-field mt-4">
						<div class="slider-header-row">
							<span class="slider-title-label">🌀 Coherencia de Estímulo</span>
							<span class="slider-value-display val-{item.coherencia}">{item.coherencia} / 5</span>
						</div>
						<input 
							type="range" 
							min="1" 
							max="5" 
							class="range-slider coherence-bar" 
							bind:value={item.coherencia}
						/>
						<div class="slider-labels-row">
							<span>1: Desalineado</span>
							<span>5: Integrado</span>
						</div>
					</div>

					<!-- Slider 3: Timing -->
					<div class="slider-field mt-4">
						<div class="slider-header-row">
							<span class="slider-title-label">⏱️ Timing y Ritmo (Frecuencia)</span>
							<span class="slider-value-display val-{item.timing}">{item.timing} / 5</span>
						</div>
						<input 
							type="range" 
							min="1" 
							max="5" 
							class="range-slider timing-bar" 
							bind:value={item.timing}
						/>
						<div class="slider-labels-row">
							<span>1: Desfasado / Spam</span>
							<span>5: Oportuno / Just-in-Time</span>
						</div>
					</div>
				</div>
			</div>
		</article>
	{/each}
</div>

<DesignAddRowButton text="➕ Diseñar Otra Alerta" onclick={addNotification} />

<style>
	.rows-container {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
		box-sizing: border-box;
	}

	.design-row-card {
		background: var(--color-solar-card, #ffffff);
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 20px;
		padding: 1.75rem;
		box-sizing: border-box;
		box-shadow: var(--shadow-solar-sm, 0 4px 12px rgba(30,69,51,0.04));
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.row-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		padding-bottom: 0.75rem;
	}

	.row-header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.row-num-badge {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 0.8rem;
		color: var(--color-solar-green-dark, #1e4533);
		background: var(--color-solar-green-light, #d2f5e3);
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.row-valid-badge {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 800;
		font-size: 0.7rem;
		color: #166534;
		background: #d1f5e3;
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
	}

	.btn-remove-row {
		background: none;
		border: none;
		color: var(--color-solar-terracotta, #e11d48);
		cursor: pointer;
		font-weight: 750;
		font-size: 0.8rem;
		transition: all 0.2s ease;
	}

	.btn-remove-row:hover {
		transform: scale(1.05);
		text-shadow: 0 1px 2px rgba(0,0,0,0.1);
	}

	.canvas-grid-split {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 2rem;
		width: 100%;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		.canvas-grid-split {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	.fields-section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.col-field {
		display: flex;
		flex-direction: column;
		text-align: left;
		background: #FAF9F6;
		padding: 1.25rem;
		border-radius: 16px;
		border: 1.5px solid transparent;
		transition: all 0.2s ease;
	}

	.col-field.field-valid {
		border-color: rgba(61, 143, 104, 0.2);
		background: rgba(240, 253, 244, 0.3);
	}

	.field-title-row {
		display: flex;
		align-items: center;
		margin-bottom: 0.35rem;
	}

	.field-badge {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 850;
		font-size: 0.7rem;
		letter-spacing: 0.03em;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
	}

	.action-badge {
		background: rgba(225, 29, 72, 0.1);
		color: var(--color-solar-terracotta, #e11d48);
	}

	.signal-badge {
		background: rgba(3, 105, 161, 0.1);
		color: var(--color-solar-sky, #188db5);
	}

	.field-hint {
		font-size: 0.72rem;
		color: var(--color-solar-text-muted, #666666);
		margin: 0 0 0.75rem 0;
		line-height: 1.3;
	}

	.subject-input {
		width: 100%;
		min-height: 90px;
		background: white;
		border: 1.5px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		border-radius: 10px;
		padding: 0.75rem;
		font-size: 0.85rem;
		color: var(--color-solar-text, #333333);
		font-family: var(--font-solar-body, sans-serif);
		resize: vertical;
		transition: all 0.2s ease;
		box-sizing: border-box;
	}

	.subject-input:focus {
		border-color: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.15);
		outline: none;
	}

	.validation-helpers {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.4rem;
	}

	.helper-chars {
		font-size: 0.65rem;
		color: #991b1b;
		font-weight: 700;
	}

	.helper-chars.valid {
		color: #15803d;
	}

	/* SLIDERS SECTION STYLES */
	.sliders-section {
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.06));
		border-radius: 18px;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		text-align: left;
		box-sizing: border-box;
	}

	.sliders-header-title {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.9rem;
		font-weight: 850;
		color: var(--color-solar-green-dark, #1e4533);
		display: block;
		margin-bottom: 0.25rem;
	}

	.sliders-hint-desc {
		font-size: 0.7rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 1.25rem 0;
	}

	.slider-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.slider-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.slider-title-label {
		font-size: 0.78rem;
		font-weight: 800;
		color: var(--color-solar-text);
	}

	.slider-value-display {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 0.75rem;
		font-weight: 850;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
	}

	.slider-value-display.val-1, .slider-value-display.val-2 {
		background: #e0f2fe;
		color: #0369a1;
	}
	.slider-value-display.val-3 {
		background: #d1f5e3;
		color: #15803d;
	}
	.slider-value-display.val-4, .slider-value-display.val-5 {
		background: #fee2e2;
		color: #b91c1c;
	}

	.range-slider {
		-webkit-appearance: none;
		width: 100%;
		height: 6px;
		border-radius: 9999px;
		background: #e5e7eb;
		outline: none;
		margin: 0.25rem 0;
	}

	.range-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.1s ease;
	}

	.range-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	/* Intensity color (reddish/terracotta) */
	.intensity-bar::-webkit-slider-thumb {
		background: var(--color-solar-terracotta, #e11d48);
		box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.2);
	}

	/* Coherence color (green) */
	.coherence-bar::-webkit-slider-thumb {
		background: var(--color-solar-green-medium, #3d8f68);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.2);
	}

	/* Timing color (sky blue) */
	.timing-bar::-webkit-slider-thumb {
		background: var(--color-solar-sky, #188db5);
		box-shadow: 0 0 0 3px rgba(24, 141, 181, 0.2);
	}

	.slider-labels-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.65rem;
		color: var(--color-solar-text-muted);
		font-weight: 600;
	}

	.mt-4 { margin-top: 1rem; }
</style>
