<script lang="ts">
	import World1Design from './World1Design.svelte';
	import World2Design from './World2Design.svelte';
	import World3Design from './World3Design.svelte';
	import World4Design from './World4Design.svelte';
	import World5Design from './World5Design.svelte';
	import World6Design from './World6Design.svelte';

	let { 
		world, 
		canvasAnswers = $bindable() 
	}: { 
		world: any; 
		canvasAnswers: any; 
	} = $props();
</script>

<div class="world-canvas world-{world.id}-canvas">
	{#if world.id === 1}
		<World1Design {world} bind:canvasAnswers />
	{:else if world.id === 2}
		<World2Design bind:canvasAnswers />
	{:else if world.id === 3}
		<World3Design bind:canvasAnswers />
	{:else if world.id === 4}
		<World4Design bind:canvasAnswers />
	{:else if world.id === 5}
		<World5Design bind:canvasAnswers />
	{:else if world.id === 6}
		<World6Design bind:canvasAnswers />
	{/if}
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

	.world-4-canvas, .world-6-canvas {
		background: radial-gradient(120% 120% at 50% 0%, #ffffff 0%, var(--color-solar-bg, #FAF9F6) 100%);
		padding: 2rem 2.5rem;
		border: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.05));
		border-radius: 24px;
	}

	@media (max-width: 768px) {
		.world-1-canvas, .world-2-canvas, .world-3-canvas, .world-4-canvas, .world-6-canvas {
			padding: 1rem;
		}
	}
</style>
