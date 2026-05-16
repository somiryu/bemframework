<script lang="ts">
	let { title, description, summary, image } = $props();
</script>

<section class="section architecture">
	<div class="container container-narrow">
		<div class="arch-content">
			<span class="label">Structure</span>
			<h2>{title}</h2>
			<p>{description}</p>
			{#if summary}
				<p class="summary">{summary}</p>
			{/if}
		</div>
	</div>
	
	{#if image}
		<div class="container">
			<div class="image-wrapper">
				<img src={image} alt="BEM System Architecture" />
			</div>
		</div>
	{/if}
</section>

<style>
.architecture {
	padding: var(--space-xl) 0;
	position: relative;
	background: white;
}

.arch-content {
	text-align: left;
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

p {
	font-size: 1.4rem;
	line-height: 1.6;
	margin-bottom: var(--space-md);
}

.summary {
	font-size: 1.1rem;
	color: var(--color-text-muted);
	border-left: 3px solid var(--color-purple);
	padding-left: var(--space-md);
	margin-top: var(--space-lg);
}

.image-wrapper {
	margin-top: var(--space-xl);
	background: white;
	padding: var(--space-lg);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	border: 1px solid var(--color-border);
}

.image-wrapper img {
	width: 100%;
	height: auto;
	display: block;
}
</style>
