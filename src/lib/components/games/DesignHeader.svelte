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

<header class="canvas-top-bar">
	<div class="canvas-header-title">
		<div class="header-badges">
			<span class="lock-badge">📊 {badge}</span>
			<span class="version-badge">Premium v2.1</span>
		</div>
		<h3>{title}</h3>
		<p class="canvas-subtitle">{description}</p>
	</div>
	<button type="button" class="btn-solar-secondary btn-exit" onclick={onComplete}>
		✕ Salir del Canvas
	</button>
</header>

<style>
	/* Top Bar layout */
	.canvas-top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		padding-bottom: 1.25rem;
		margin-bottom: 1.75rem;
		width: 100%;
		box-sizing: border-box;
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
		transition: all 0.2s ease;
	}

	.btn-exit:hover {
		background: var(--color-solar-bg-hover, rgba(0, 0, 0, 0.05));
	}
</style>
