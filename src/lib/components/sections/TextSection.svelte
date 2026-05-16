<script lang="ts">
	let { title, paragraphs } = $props();
</script>

<section class="section">
	<div class="container narrow">
		<h2>{title}</h2>
		{#each paragraphs as p}
			<p>{p}</p>
		{/each}
	</div>
</section>
<style>
.section {
	padding: var(--space-xl) 0;
}

h2 {
	margin-bottom: var(--space-lg);
	position: relative;
	display: inline-block;
	font-size: 2.5rem;
	letter-spacing: -0.02em;
}

h2::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: -10px;
	width: 60px;
	height: 4px;
	background: var(--color-purple);
	border-radius: var(--radius-full);
}

p {
	font-size: 1.25rem;
	max-width: 780px;
	line-height: 1.8;
	color: var(--color-text-muted);
}
</style>
