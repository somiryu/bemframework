<script lang="ts">
	import type { TallerCase } from '$lib/content/talleres/quienTieneLaCabeza';

	let {
		c,
		index,
		total,
		label = 'Interacción'
	}: { c: TallerCase; index: number; total: number; label?: string } = $props();
</script>

<header class="head">
	<span class="kind">Caso {index + 1} de {total} · {label}</span>
	<span class="who">{c.who}</span>
</header>
<h2>{c.title}</h2>
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

	.story {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 68ch;
		color: var(--tl-fg);
	}
</style>
