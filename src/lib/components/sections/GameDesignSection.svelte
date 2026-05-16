<script lang="ts">
	let { title, intro, description, footer, items } = $props();
</script>

<section class="section game-design">
	<div class="container container-narrow">
		<span class="label">The Method</span>
		<h2>{title}</h2>
		<p class="intro"><strong>{intro}</strong></p>
		<p class="desc">{description}</p>
		<p class="footer-text">{footer}</p>
	</div>
	
	<div class="container">
		<div class="items-grid">
			{#each items as item}
				<div class="item-card">
					<h3>{item.title}</h3>
					<p>{item.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
.game-design {
	background: var(--color-bg-alt);
}

.label {
	display: inline-block;
	font-weight: 800;
	text-transform: uppercase;
	font-size: 0.85rem;
	letter-spacing: 0.2em;
	color: var(--color-purple);
	margin-bottom: var(--space-sm);
}

h2 {
	margin-bottom: var(--space-lg);
}

.intro {
	font-size: 1.5rem;
	line-height: 1.6;
	color: var(--color-text);
	margin-bottom: var(--space-md);
}

.desc {
	font-size: 1.25rem;
	color: var(--color-text-muted);
	margin-bottom: var(--space-lg);
}

.footer-text {
	font-size: 1.1rem;
	font-weight: 600;
	margin-bottom: var(--space-xl);
}

.items-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2.5rem;
}

.item-card {
	background: white;
	padding: 3rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-sm);
	transition: var(--transition-normal);
	border: 1px solid var(--color-border);
}

.item-card:hover {
	transform: translateY(-8px);
	box-shadow: var(--shadow-lg);
}

.item-card h3 {
	margin-bottom: var(--space-sm);
	color: var(--color-purple);
}

.item-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.7;
}

@media (max-width: 768px) {
	.intro { font-size: 1.25rem; }
}
</style>
