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

	// Canvas state holds an array of design rows
	interface DesignRow {
		id: number;
		meta: string;
		retroalimentacion: string;
		recompensa: string;
	}

	let rows = $state<DesignRow[]>([]);

	// Prefill rows
	if (existingCanvas && Array.isArray(existingCanvas)) {
		rows = existingCanvas.map((r: any, idx: number) => ({
			id: r.id ?? idx,
			meta: r.meta || '',
			retroalimentacion: r.retroalimentacion || '',
			recompensa: r.recompensa || ''
		}));
	} else {
		// Start with 1 empty row
		rows = [{ id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
	}

	let isSubmitting = $state(false);

	// Add new row
	function addRow() {
		rows = [...rows, { id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
	}

	// Remove row
	function removeRow(id: number) {
		if (rows.length > 1) {
			rows = rows.filter(r => r.id !== id);
		} else {
			// Clear single remaining row
			rows = [{ id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
		}
	}

	// Formats validation
	function startsWithSi(str: string) {
		const clean = str.trim().toLowerCase();
		return clean.startsWith('si ') || clean.startsWith('si,') || clean.startsWith('si\n');
	}

	// Contains "entonces"
	function containsEntonces(str: string) {
		const clean = str.trim().toLowerCase();
		return clean.includes('entonces');
	}

	// Validation rule: All fields in all rows must be at least 15 characters,
	// and follow the "Si X, entonces Y" format (must start with 'Si' and contain 'entonces').
	const isCanvasValid = $derived.by(() => {
		if (rows.length === 0) return false;
		return rows.every(r => {
			const m = r.meta.trim();
			const f = r.retroalimentacion.trim();
			const w = r.recompensa.trim();

			return m.length >= 15 && startsWithSi(m) && containsEntonces(m) &&
				   f.length >= 15 && startsWithSi(f) && containsEntonces(f) &&
				   w.length >= 15 && startsWithSi(w) && containsEntonces(w);
		});
	});
</script>

<div class="design-canvas-wrapper" in:fade>
	<!-- Top Bar -->
	<header class="canvas-top-bar">
		<div class="canvas-header-title">
			<div class="header-badges">
				<span class="lock-badge">📊 CANVAS DE DISEÑO GFR</span>
				<span class="version-badge">Premium v2.1</span>
			</div>
			<h3>Canvas de Diseño GFR Integrado</h3>
			<p class="canvas-subtitle">Alinea la Meta (Goal), Retroalimentación (Feedback) y Recompensa (Reward) en un ciclo motivacional continuo.</p>
		</div>
		<button type="button" class="btn-solar-secondary btn-exit" onclick={onComplete}>
			✕ Salir del Canvas
		</button>
	</header>

	<!-- Guideline speech bubble with Kira -->
	<section class="giochi-speech-bubble" in:fade>
		<div class="bubble-layout">
			<img src="/learn_resoruces/characters/char_kira.png" alt="Kira" class="char-avatar" />
			<div class="bubble-content">
				<h4 class="bubble-title">Directriz de Diseño (Kira):</h4>
				<p class="bubble-text">
					Para cada fila, describe una <strong>Meta</strong>, su <strong>Retroalimentación</strong> correspondiente y la <strong>Recompensa</strong> esperada.
					Las tres deben estar <strong>integradas y alineadas</strong> con la actividad principal (sin recurrir a sobornos extrínsecos).
					Escríbelas en formato de condicional: <code class="code-highlight">"Si [acción/condición], entonces [consecuencia/estado]"</code> (Mínimo 15 caracteres por celda).
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
		class="design-canvas-form"
	>
		<input type="hidden" name="world_id" value={world.id} />
		<input type="hidden" name="canvas_data" value={JSON.stringify(rows)} />

		<div class="rows-container">
			{#each rows as r, index (r.id)}
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
						{#if rows.length > 1}
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

		<button type="button" class="btn-solar-secondary btn-add-row" onclick={addRow}>
			➕ Agregar Fila de Diseño
		</button>

		<!-- Submit action row -->
		<footer class="submit-row glass-card sticky-bottom">
			<div class="status-indicator-box">
				<div class="status-dot" class:dot-valid={isCanvasValid}></div>
				<span class="lock-tip" class:valid={isCanvasValid}>
					{isCanvasValid ? '✓ ¡Canvas completo y válido!' : '⚠ Asegúrate de que todas las filas tengan al menos 15 caracteres y el formato "Si..., entonces...".'}
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

	/* Top Bar layout */
	.canvas-top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		padding-bottom: 1.25rem;
		margin-bottom: 1.75rem;
		width: 100%;
	}

	.canvas-header-title {
		text-align: left;
	}

	.header-badges {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.35rem;
	}

	.lock-badge {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0369a1);
		background: var(--color-solar-sky-light, #e0f2fe);
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
	}

	.version-badge {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #2b664a);
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.12));
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
	}

	.canvas-header-title h3 {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0.25rem 0;
	}

	.canvas-subtitle {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0;
	}

	.btn-exit {
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 750;
		border-radius: 12px;
	}

	/* Speech Bubble Design with Avatar */
	.giochi-speech-bubble {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.3);
		padding: 1.25rem 1.75rem;
		border-radius: 16px;
		box-shadow: 0 4px 20px -2px rgba(255, 209, 102, 0.15);
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
		width: 52px;
		height: 52px;
		object-fit: contain;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 2.5px solid var(--color-solar-yellow, #ffd166);
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
		font-size: 0.88rem;
		line-height: 1.5;
		color: #4b5563;
		margin: 0;
	}

	.code-highlight {
		background: rgba(0, 0, 0, 0.05);
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-family: monospace;
		font-weight: 600;
		color: #1f2937;
	}

	/* Design Form and Rows */
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
		transition: var(--transition-smooth);
		width: 100%;
		box-sizing: border-box;
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
		margin-top: 2rem;
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
		transition: var(--transition-smooth);
	}

	.status-dot.dot-valid {
		background: #10b981;
		box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
	}

	.lock-tip {
		font-weight: 700;
		font-size: 0.78rem;
		color: var(--color-solar-terracotta, #e11d48);
		transition: var(--transition-smooth);
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
		transition: var(--transition-smooth);
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
</style>
