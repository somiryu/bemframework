<script lang="ts">
	import MapIcon from '$lib/components/icons/MapIcon.svelte';

	let {
		instanceCode,
		worldTitle,
		backLabel = 'Volver al Mapa',
		onBack
	}: {
		instanceCode: string;
		worldTitle: string;
		backLabel?: string;
		onBack: () => void;
	} = $props();
</script>

<header class="workshop-header glass-card">
	<div class="header-left">
		<span class="w-badge">LIVE WORKSHOP (SALA: {instanceCode})</span>
		<h1 class="header-title">{worldTitle}</h1>
	</div>
	<div class="header-right">
		<button type="button" class="btn-solar-secondary btn-sm flex items-center gap-1.5" onclick={onBack}>
			<MapIcon size={16} /> {backLabel}
		</button>
	</div>
</header>

<style>
	.workshop-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 2rem;
		border-radius: var(--radius-solar-md, 20px);
		border: 1px solid var(--color-solar-card-border);
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		box-shadow: var(--shadow-solar-sm);
		margin-bottom: 1.5rem;
		width: 100%;
		box-sizing: border-box;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		text-align: left;
	}

	.w-badge {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
	}

	.header-title {
		font-family: var(--font-solar-header);
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.header-right {
		display: flex;
		align-items: center;
	}
</style>
