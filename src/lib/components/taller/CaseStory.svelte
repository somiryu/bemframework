<script lang="ts">
	import type { TallerCase } from '$lib/content/talleres/quienTieneLaCabeza';

	let {
		c,
		index,
		total,
		label = 'Interacción',
		showImage = false
	}: { c: TallerCase; index: number; total: number; label?: string; showImage?: boolean } = $props();
</script>

<!-- While voting the illustration stays hidden but is fetched ahead, so it's
     on screen the instant the facilitator reveals the results. -->
<svelte:head>
	{#if !showImage && c.image}
		<link rel="preload" as="image" href={c.image} />
	{/if}
</svelte:head>

<header class="head">
	<span class="kind">Caso {index + 1} de {total} · {label}</span>
	<span class="who">{c.who}</span>
</header>
<h2>{c.title}</h2>

<!-- Results only: each illustration draws the protagonist as centaur or
     inverted centaur, so showing it while the group votes would give away a reading. -->
{#if showImage && c.image}
	<div class="case-art">
		<img src={c.image} alt={c.title} width="1376" height="768" />
	</div>
{/if}

<p class="story">{c.story}</p>

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
		align-items: baseline;
	}

	.kind {
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: var(--tl-purple-soft);
		color: var(--tl-purple-ink);
		padding: 4px 12px;
		border-radius: 99px;
	}

	.who {
		color: var(--tl-fg-3);
		font-size: 0.95rem;
	}

	.case-art {
		margin: 12px 0 16px;
		max-width: 68ch;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--tl-line);
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
		background: #111;
	}

	.case-art img {
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
	}

	.story {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 68ch;
		color: var(--tl-fg);
	}
</style>
