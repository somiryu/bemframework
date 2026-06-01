<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { 
		world, 
		player, 
		onComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onComplete: () => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	const designConfig = $derived(world.design_modules || {});
	const fields = $derived(designConfig.fields || []);

	// Local canvas state prefilled from existing design canvas if available
	const existingCanvas = $derived(player.game_state?.[world.id]?.design_canvas || {});

	let canvasAnswers = $state<Record<string, string>>({
		Hedonismo: existingCanvas.Hedonismo || '',
		Eficiencia: existingCanvas.Eficiencia || '',
		Relacion: existingCanvas.Relacion || '',
		Maestria: existingCanvas.Maestria || '',
		Descubrimiento: existingCanvas.Descubrimiento || '',
		Empoderamiento: existingCanvas.Empoderamiento || '',
		Proposito: existingCanvas.Proposito || ''
	});

	let isSubmitting = $state(false);

	// Check if all fields are completed
	const isCanvasFullyFilled = $derived(
		Object.values(canvasAnswers).every(val => val.trim().length > 10) // Min 10 chars per activity for high quality serious designs!
	);
</script>

<div class="design-canvas-wrapper" in:fade>
	<!-- TOP HEADER BAR -->
	<div class="canvas-top-bar flex items-center justify-between mb-4">
		<div class="canvas-header-title text-left">
			<span class="lock-badge">📊 CANVAS DE DISEÑO BEM</span>
			<h3>{designConfig.title || 'Canvas de Actividades de Aprendizaje BEM'}</h3>
			<p class="text-xs text-solar-text-muted">{designConfig.description || 'Define para cada uno de los 7 Drivers una actividad seria aplicable en tu clase.'}</p>
		</div>
		<button type="button" class="btn-solar-secondary btn-sm flex items-center gap-1" onclick={onComplete}>
			✕ Salir del Canvas
		</button>
	</div>

	<!-- GIOCHI AI Bot Design Advice Banner -->
	<div class="giochi-speech-bubble text-left mb-6" in:fade>
		<div class="bubble-title">🤖 GIOCHI Directriz de Diseño:</div>
		<p>¡Atención, Agente en entrenamiento! En el modelo BEM <strong>no diseñamos juegos</strong> superficiales. En su lugar, pensamos como diseñadores de juegos para crear <strong>sistemas serios de aprendizaje</strong>. Completa una propuesta seria para cada driver para archivar tu bitácora de viaje.</p>
	</div>

	<form
		method="POST"
		action="?/submitDesignCanvas"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'success' && result.data) {
					onUpdateCoins(player.coins, result.data.game_state); // No coins gained for canvas, but finalizes design_completed!
					onComplete();
				}
				await update();
			};
		}}
		class="design-canvas-form flex flex-col gap-6"
	>
		<input type="hidden" name="world_id" value={world.id} />
		<input type="hidden" name="canvas_data" value={JSON.stringify(canvasAnswers)} />

		<!-- THE VISUAL CANVAS GRID SYSTEM (Columns & Rows) -->
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

		<!-- BOTTOM ACTION ROW -->
		<div class="submit-row flex justify-between items-center mt-4 p-4 glass-card sticky-bottom">
			<span class="lock-tip text-xs text-solar-text-muted" class:valid={isCanvasFullyFilled}>
				{isCanvasFullyFilled ? '✓ ¡Canvas completo y listo para archivar!' : '⚠ Completa todos los campos (mínimo 10 caracteres) para habilitar el guardado.'}
			</span>
			<button 
				type="submit" 
				class="btn-solar-primary" 
				disabled={!isCanvasFullyFilled || isSubmitting}
			>
				{#if isSubmitting}
					💾 Archivando en Bitácora...
				{:else}
					💾 Guardar en Bitácora de Viaje
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.design-canvas-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--color-solar-bg, #FAF9F6);
		z-index: 99999;
		display: flex;
		flex-direction: column;
		padding: 2rem 3rem;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.design-canvas-wrapper {
			padding: 1rem;
		}
	}

	.canvas-top-bar {
		border-bottom: 1px solid var(--color-solar-card-border);
		padding-bottom: 1rem;
	}

	.lock-badge {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-sky);
		background: var(--color-solar-sky-light);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.05em;
	}

	/* SPEECH BUBBLE */
	.giochi-speech-bubble {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.4);
		padding: 1.25rem 1.5rem;
		border-radius: 20px;
		position: relative;
		box-shadow: var(--shadow-solar-sm);
	}

	.bubble-title {
		font-weight: 800;
		font-size: 0.85rem;
		color: var(--color-solar-green-dark);
		margin-bottom: 0.25rem;
	}

	.giochi-speech-bubble p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		font-weight: 600;
		color: var(--color-solar-text);
	}

	.canvas-header-title h3 {
		font-family: var(--font-solar-header);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0;
	}

	/* TRUE CANVAS GRID SYSTEM LAYOUT (3 Columns & Rows) */
	.canvas-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		width: 100%;
		align-items: stretch;
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

	.lock-tip {
		font-weight: 600;
		color: hsl(20, 70%, 55%);
	}

	.lock-tip.valid {
		color: var(--color-solar-green-medium);
	}

	.sticky-bottom {
		position: sticky;
		bottom: 0;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		z-index: 10;
	}

	/* Helpers */
	.text-left { text-align: left; }
	.flex { display: flex; }
	.flex-col { flex-direction: column; }
	.gap-1 { gap: 0.25rem; }
	.gap-2 { gap: 0.5rem; }
	.gap-6 { gap: 1.5rem; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.text-xs { font-size: 0.75rem; }
	.text-right { text-align: right; }
	.mt-1 { margin-top: 0.25rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.w-full { width: 100%; }
</style>
