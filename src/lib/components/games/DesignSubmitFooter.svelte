<script lang="ts">
	let { 
		isValid, 
		isSubmitting, 
		warningText 
	}: { 
		isValid: boolean; 
		isSubmitting: boolean; 
		warningText: string;
	} = $props();
</script>

<footer class="submit-row glass-card sticky-bottom">
	<div class="status-indicator-box">
		<div class="status-dot" class:dot-valid={isValid}></div>
		<span class="lock-tip" class:valid={isValid}>
			{isValid ? '✓ ¡Canvas completo y válido!' : `⚠ ${warningText}`}
		</span>
	</div>
	<button 
		type="submit" 
		class="btn-solar-primary btn-submit-premium" 
		disabled={!isValid || isSubmitting}
	>
		{#if isSubmitting}
			💾 Guardando...
		{:else}
			💾 Guardar en Bitácora de Viaje
		{/if}
	</button>
</footer>

<style>
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
		transition: all 0.3s ease;
		flex-shrink: 0;
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
</style>
