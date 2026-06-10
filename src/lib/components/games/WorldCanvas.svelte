<script lang="ts">
	let { 
		worldId, 
		children 
	}: { 
		worldId: number; 
		children: any; 
	} = $props();
</script>

<div class="world-canvas world-{worldId}-canvas">
	{@render children()}
</div>

<style>
	.world-canvas {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-radius: var(--radius-solar-md, 18px);
	}
	
	.world-1-canvas {
		background: var(--color-solar-bg, #FAF9F6);
		padding: 1.5rem 2rem;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		border-radius: 24px;
	}
	
	.world-2-canvas {
		background: radial-gradient(120% 120% at 50% 0%, #ffffff 0%, var(--color-solar-bg, #FAF9F6) 100%);
		padding: 2rem 2.5rem;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		border-radius: 24px;
	}
	
	.world-3-canvas {
		background: radial-gradient(120% 120% at 50% 0%, #ffffff 0%, var(--color-solar-bg, #FAF9F6) 100%);
		padding: 2rem 2.5rem;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		border-radius: 24px;
	}

	@media (max-width: 768px) {
		.world-1-canvas, .world-2-canvas, .world-3-canvas {
			padding: 1rem;
		}
	}
</style>
