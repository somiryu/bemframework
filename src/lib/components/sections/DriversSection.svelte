<script lang="ts">
	let { title, intro, items, lang } = $props();
</script>

<section class="section drivers-section">
	<div class="container">
		<h2>{title}</h2>
		
		{#if intro}
			<div class="container-narrow">
				<p class="intro">{intro}</p>
			</div>
		{/if}

		<div class="drivers">
			{#each items as d}
				<a href={`/${lang}/drivers/${d.slug}`} class={`driver-card ${d.color}`}>
					<strong>{d.title}</strong>
					<p>{d.description}</p>
					<span class="btn-text">{lang === 'en' ? 'Learn more' : 'Saber más'} →</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
.drivers-section h2 {
	text-align: center;
	margin-bottom: var(--space-md);
}

.intro {
	text-align: center;
	font-size: 1.15rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: var(--space-xl);
}

.drivers {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 2rem;
}

.driver-card {
	padding: 2.5rem;
	background: white;
	border-radius: var(--radius-lg);
	border: 1px solid var(--color-border);
	border-top: 5px solid var(--color-border);
	transition: all var(--transition-normal);
	display: flex;
	flex-direction: column;
	text-decoration: none;
	color: inherit;
}

.driver-card:hover {
	transform: translateY(-8px);
	box-shadow: var(--shadow-lg);
	background: var(--color-bg-alt);
}

.driver-card strong {
	display: block;
	margin-bottom: 0.75rem;
	font-size: 1.4rem;
	font-weight: 800;
	letter-spacing: -0.01em;
}

.driver-card.purple { border-top-color: var(--color-purple); }
.driver-card.green { border-top-color: var(--color-green); }
.driver-card.orange { border-top-color: var(--color-orange); }
.driver-card.red { border-top-color: var(--color-red); }

.driver-card.purple strong { color: var(--color-purple); }
.driver-card.green strong { color: var(--color-green); }
.driver-card.orange strong { color: var(--color-orange); }
.driver-card.red strong { color: var(--color-red); }

.driver-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	flex-grow: 1;
}

.btn-text {
	display: inline-block;
	margin-top: var(--space-lg);
	font-weight: 800;
	font-size: 0.85rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	opacity: 0.7;
	transition: opacity 0.2s;
}

.driver-card:hover .btn-text {
	opacity: 1;
	color: var(--color-purple);
}
</style>
