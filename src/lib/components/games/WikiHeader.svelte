<script lang="ts">
	let { 
		title, 
		badge, 
		description, 
		onComplete 
	}: { 
		title: string; 
		badge: string; 
		description: string; 
		onComplete: () => void; 
	} = $props();
</script>

<header class="wiki-header">
	<div class="header-content text-left">
		<div class="header-badges">
			<span class="lock-badge">📊 {badge}</span>
		</div>
		<h3>{title}</h3>
		<p class="text-xs text-solar-text-muted">{description}</p>
	</div>
	<button type="button" class="btn-solar-secondary btn-exit" onclick={onComplete}>
		✕ Salir del Canvas
	</button>
</header>

<style>
	.wiki-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		padding-bottom: 1.25rem;
		margin-bottom: 1.5rem;
		width: 100%;
		box-sizing: border-box;
	}

	.header-content {
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

	.wiki-header h3 {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0.25rem 0;
	}

	.btn-exit {
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 750;
		border-radius: 12px;
		transition: all 0.2s ease;
	}

	.btn-exit:hover {
		background: var(--color-solar-bg-hover, rgba(0, 0, 0, 0.05));
	}
</style>
