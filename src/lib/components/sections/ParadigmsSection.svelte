<script lang="ts">
	let { title, intro, items } = $props();
</script>

<section class="section paradigms">
	<div class="container">
		<h2>{title}</h2>
		
		{#if intro}
			<div class="container-narrow">
				<p class="intro">{intro}</p>
			</div>
		{/if}
		
		<div class="paradigm-grid">
			{#each items as item}
				<div class="paradigm-card">
					<h3>{item.title}</h3>
					<p>{item.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
.paradigms {
	background: var(--color-bg-alt);
}

h2 {
	text-align: center;
	margin-bottom: var(--space-md);
}

.intro {
	text-align: center;
	font-size: 1.25rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin-bottom: var(--space-xl);
	max-width: 800px;
	margin-left: auto;
	margin-right: auto;
}

.paradigm-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2.5rem;
}

.paradigm-card {
	background: white;
	padding: 3rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-sm);
	transition: var(--transition-normal);
	border: 1px solid var(--color-border);
}

.paradigm-card:hover {
	transform: translateY(-8px);
	box-shadow: var(--shadow-lg);
}

.paradigm-card h3 {
	margin-bottom: var(--space-sm);
	color: var(--color-purple);
}

.paradigm-card p {
	margin: 0;
	font-size: 1.1rem;
}
</style>
