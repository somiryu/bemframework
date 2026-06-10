<script lang="ts">
	import { slide } from 'svelte/transition';

	let {
		isHost,
		onlineCount,
		submittedCount = 0,
		teamScore = null,
		isFirstStep,
		isLastStep,
		activeMode,
		onReset,
		onPrev,
		onNext,
		onToggleMode,
		onComplete,
		coinsLabel = '+25 BEM Coins',
		stepLabel = 'Paso',
		children
	}: {
		isHost: boolean;
		onlineCount: number;
		submittedCount?: number;
		teamScore?: number | null;
		isFirstStep: boolean;
		isLastStep: boolean;
		activeMode: string;
		onReset: () => void;
		onPrev: () => void;
		onNext: () => void;
		onToggleMode: (mode: any) => void;
		onComplete: () => void;
		coinsLabel?: string;
		stepLabel?: string;
		children?: any;
	} = $props();
</script>

{#if isHost}
	<div class="host-controls-banner" in:slide>
		<div class="host-title">
			<span>👑 MENTOR ORQUESTADOR (JAVIER)</span>
		</div>
		
		<div class="host-actions-row">
			<div class="host-buttons-group">
				<button type="button" class="btn-solar-danger btn-sm font-bold" onclick={onReset}>
					🔄 Reiniciar
				</button>

				<button 
					type="button" 
					class="btn-solar-secondary btn-sm"
					disabled={isFirstStep}
					onclick={onPrev}
				>
					◀ Anterior
				</button>

				{#if activeMode === 'actividad'}
					<button 
						type="button" 
						class="btn-solar-accent btn-sm font-bold animate-solar-pulse"
						onclick={() => onToggleMode('feedback')}
					>
						📢 Revelar y Activar Feedback
					</button>
				{:else if activeMode === 'feedback'}
					<button 
						type="button" 
						class="btn-solar-secondary btn-sm font-bold"
						onclick={() => onToggleMode('actividad')}
					>
						✏️ Reabrir Votación / Actividad
					</button>
				{/if}

				{#if children}
					{@render children()}
				{/if}
				
				{#if !isLastStep}
					<button 
						type="button" 
						class="btn-solar-primary btn-sm font-bold"
						onclick={onNext}
					>
						Siguiente {stepLabel} ▶
					</button>
				{:else if activeMode === 'feedback' || activeMode === 'final_feedback'}
					<button 
						type="button" 
						class="btn-solar-primary btn-sm font-bold animate-solar-pulse"
						onclick={onComplete}
					>
						✓ Finalizar Taller ({coinsLabel})
					</button>
				{/if}
			</div>

			<div class="presence-tag">
				🟢 Conectados: <strong>{onlineCount}</strong>
				| Enviados: <strong>{submittedCount}</strong>
				{#if teamScore !== null}
					| Puntaje Grupal: <strong>{teamScore} pts</strong>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.host-controls-banner {
		background: linear-gradient(135deg, hsl(150, 45%, 6%) 0%, hsl(152, 40%, 10%) 100%) !important;
		border: 1.5px solid var(--color-solar-yellow, #eab308) !important;
		color: white !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.25rem !important;
		border-radius: var(--radius-solar-md, 20px) !important;
		gap: 1.5rem !important;
		text-align: left;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
		width: 100%;
		box-sizing: border-box;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.host-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.host-title span {
		font-size: 0.65rem;
		font-weight: 900;
		color: var(--color-solar-yellow, #eab308);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.host-actions-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-grow: 1;
		gap: 1.5rem !important;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.host-buttons-group {
		display: flex;
		gap: 0.75rem !important;
		align-items: center;
		flex-wrap: wrap;
	}

	.host-controls-banner :global(button) {
		padding: 0.25rem 0.65rem !important;
		font-size: 0.75rem !important;
		border-radius: 6px !important;
		font-weight: 800 !important;
		height: auto !important;
		min-height: unset !important;
		margin: 0 0.25rem !important;
		border: 1px solid rgba(255, 255, 255, 0.15) !important;
	}

	.presence-tag {
		font-size: 0.75rem;
		font-weight: 700;
		background: rgba(0, 0, 0, 0.5);
		padding: 0.25rem 0.75rem;
		border-radius: 6px;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.15);
		white-space: nowrap;
	}
</style>
