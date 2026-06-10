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

	// Load existing canvas data if available
	const existingCanvas = $derived(player.game_state?.[world.id]?.design_canvas || null);

	// Canvas state holds an array of design rows representing a 6-phase cycle
	interface DesignCycle {
		id: number;
		meta: string;
		llamado: string;
		eval_cognitiva: string;
		accion_disparadora: string;
		eval_juego: string;
		retroalimentacion: string;
	}

	let cycles = $state<DesignCycle[]>([]);

	// Prefill cycles
	if (existingCanvas && Array.isArray(existingCanvas)) {
		cycles = existingCanvas.map((c: any, idx: number) => ({
			id: c.id ?? idx,
			meta: c.meta || '',
			llamado: c.llamado || '',
			eval_cognitiva: c.eval_cognitiva || '',
			accion_disparadora: c.accion_disparadora || '',
			eval_juego: c.eval_juego || '',
			retroalimentacion: c.retroalimentacion || ''
		}));
	} else {
		// Start with 1 empty cycle
		cycles = [{ 
			id: Date.now(), 
			meta: '', 
			llamado: '', 
			eval_cognitiva: '', 
			accion_disparadora: '', 
			eval_juego: '', 
			retroalimentacion: '' 
		}];
	}

	let isSubmitting = $state(false);

	// Add new cycle
	function addCycle() {
		cycles = [...cycles, { 
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
		if (cycles.length > 1) {
			cycles = cycles.filter(c => c.id !== id);
		} else {
			// Clear single remaining cycle
			cycles = [{ 
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

	// Validation rule: All fields in all cycles must be at least 15 characters
	const isCanvasValid = $derived.by(() => {
		if (cycles.length === 0) return false;
		return cycles.every(c => {
			return c.meta.trim().length >= 15 &&
				   c.llamado.trim().length >= 15 &&
				   c.eval_cognitiva.trim().length >= 15 &&
				   c.accion_disparadora.trim().length >= 15 &&
				   c.eval_juego.trim().length >= 15 &&
				   c.retroalimentacion.trim().length >= 15;
		});
	});
</script>

<div class="design-canvas-wrapper" in:fade>
	<!-- Top Bar -->
	<header class="canvas-top-bar flex justify-between items-center p-4 bg-white border-b shadow-sm">
		<div class="canvas-header-title">
			<div class="header-badges flex gap-2">
				<span class="lock-badge text-xs font-bold px-2 py-0.5 rounded bg-solar-green-light text-solar-green-medium">⚙️ CANVAS DE INTERACTIVIDAD</span>
				<span class="version-badge text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">Mundo 3</span>
			</div>
			<h3 class="text-lg font-black text-solar-green-dark mt-1">Canvas de Relojería Lúdica</h3>
			<p class="canvas-subtitle text-xs text-solar-text-muted">Diseña un ciclo interactivo completo de 6 etapas para tus clases.</p>
		</div>
		<button type="button" class="btn-solar-secondary btn-exit" onclick={onComplete}>
			✕ Salir del Canvas
		</button>
	</header>

	<!-- Guideline Speech bubble with John Wilkins (adapted from World 2 Kira) -->
	<section class="giochi-speech-bubble max-w-4xl mx-auto mt-6" in:fade>
		<div class="bubble-layout">
			<img src="/learn_resoruces/characters/char_wilkins.png" alt="Wilkins" class="char-avatar" />
			<div class="bubble-content">
				<h4 class="bubble-title">Directriz de Diseño (John Wilkins):</h4>
				<p class="bubble-text">
					Para que una interactividad funcione con precisión, conecta las 6 piezas de la relojería.
					Cada casilla representa un engranaje y requiere al menos <strong>15 caracteres</strong> de descripción detallada. No dejes engranajes sueltos.
				</p>
			</div>
		</div>
	</section>

	<form
		method="POST"
		action="?/submitDesignCanvas"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'success' && result.data) {
					onUpdateCoins(player.coins, result.data.game_state);
					onComplete();
				}
				await update();
			};
		}}
		class="design-canvas-form p-6 max-w-7xl mx-auto"
	>
		<input type="hidden" name="world_id" value={world.id} />
		<input type="hidden" name="canvas_data" value={JSON.stringify(cycles)} />

		<div class="rows-container">
			{#each cycles as cycle, index (cycle.id)}
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
						{#if cycles.length > 1}
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
								placeholder="Ej: El estudiante domina el cálculo mental de sumas de dos dígitos." 
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
								placeholder="Ej: Se proyecta una carta con un número flotante y un contador de 5 segundos." 
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
								placeholder="Ej: El alumno recupera la regla de suma rápida y estima el resultado final." 
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
								placeholder="Ej: Presiona el botón del resultado correcto antes de que el contador llegue a cero." 
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
								placeholder="Ej: El software compara si el ID de la opción presionada corresponde al valor exacto." 
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
								placeholder="Ej: Suena una campanilla, se ilumina en dorado y se avanza la barra de combo multiplicador." 
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

		<button type="button" class="btn-solar-secondary btn-add-row" onclick={addCycle}>
			➕ Agregar Fila de Ciclo
		</button>

		<!-- Bottom Sticky Actions Bar -->
		<footer class="submit-row glass-card sticky-bottom mt-6">
			<div class="status-indicator-box">
				<div class="status-dot" class:dot-valid={isCanvasValid}></div>
				<span class="lock-tip" class:valid={isCanvasValid}>
					{isCanvasValid ? '✓ ¡Canvas completo y válido!' : '⚠ Asegúrate de que todas las casillas de cada ciclo tengan al menos 15 caracteres.'}
				</span>
			</div>
			<button 
				type="submit" 
				class="btn-solar-primary btn-submit-premium" 
				disabled={!isCanvasValid || isSubmitting}
			>
				{#if isSubmitting}
					💾 Guardando...
				{:else}
					💾 Guardar en Bitácora de Viaje
				{/if}
			</button>
		</footer>
	</form>
</div>

<style>
	.design-canvas-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: radial-gradient(120% 120% at 50% 0%, #ffffff 0%, var(--color-solar-bg, #FAF9F6) 100%);
		z-index: 99999;
		display: flex;
		flex-direction: column;
		padding: 2.5rem 3.5rem;
		overflow-y: auto;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		.design-canvas-wrapper {
			padding: 1.5rem 1rem;
		}
	}

	.design-canvas-form {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
		box-sizing: border-box;
	}

	.rows-container {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
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

	/* Action Buttons */
	.btn-add-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.95rem;
		background: white;
		border: 1.5px dashed var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #2b664a);
		border-radius: 12px;
		font-weight: 750;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		box-sizing: border-box;
		margin-top: 1.5rem;
	}

	.btn-add-row:hover {
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.08));
		transform: translateY(-1px);
	}

	/* Bottom Sticky bar */
	.submit-row {
		position: sticky;
		bottom: 0;
		background: rgba(255, 255, 255, 0.95);
		border-top: 1.5px solid rgba(0, 0, 0, 0.08);
		z-index: 10;
		border-radius: 16px;
		padding: 1.25rem 1.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 -8px 24px -6px rgba(0, 0, 0, 0.04);
		width: 100%;
		box-sizing: border-box;
	}

	.status-indicator-box {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #e11d48;
		box-shadow: 0 0 8px rgba(225, 29, 72, 0.5);
		transition: all 0.3s ease;
	}

	.status-dot.dot-valid {
		background: #10b981;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
	}

	.lock-tip {
		font-weight: 700;
		font-size: 0.78rem;
		color: var(--color-solar-terracotta, #e11d48);
		transition: all 0.2s ease;
		text-align: left;
	}

	.lock-tip.valid {
		color: #10b981;
	}

	.btn-submit-premium {
		background: var(--color-solar-green-medium, #3d8f68);
		color: white;
		padding: 0.85rem 1.75rem;
		border-radius: 12px;
		font-weight: 750;
		font-size: 0.9rem;
		border: none;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(61, 143, 104, 0.20);
		transition: all 0.3s ease;
	}

	.btn-submit-premium:hover:not(:disabled) {
		background: var(--color-solar-green-dark, #2b664a);
		box-shadow: 0 6px 16px rgba(61, 143, 104, 0.35);
		transform: translateY(-1px);
	}

	.btn-submit-premium:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		box-shadow: none;
	}

	/* Speech Bubble Design with Avatar */
	.giochi-speech-bubble {
		background: #FFFDF4;
		border: 1px solid rgba(61, 143, 104, 0.2);
		padding: 1.25rem 1.75rem;
		border-radius: 16px;
		box-shadow: var(--shadow-solar-sm);
		margin-bottom: 2rem;
		width: 100%;
		box-sizing: border-box;
	}

	.bubble-layout {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		text-align: left;
	}

	.char-avatar {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid var(--color-solar-green-medium);
		flex-shrink: 0;
	}

	.bubble-content {
		flex: 1;
	}

	.bubble-title {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.35rem 0;
	}

	.bubble-text {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-solar-text);
		margin: 0;
	}
</style>
