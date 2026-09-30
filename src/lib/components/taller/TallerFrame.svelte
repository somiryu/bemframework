<script lang="ts">
	import type { Snippet } from 'svelte';

	// Slide frame from the Uniandes deck: white canvas, violet titles, and the
	// violet footer band with the Los Andes · Educación · HUB IA logos.
	let {
		code = null,
		badge = null,
		wide = false,
		children
	}: {
		code?: string | null;
		badge?: string | null;
		wide?: boolean;
		children: Snippet;
	} = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="taller-root">
	<header class="tl-top">
		<span class="tl-brand">¿Quién tiene la cabeza?</span>
		<span class="tl-top-right">
			{#if badge}<span class="tl-badge">{badge}</span>{/if}
			{#if code}<span class="tl-code">Sala <strong>{code}</strong></span>{/if}
		</span>
	</header>

	<main class="tl-main" class:wide>
		{@render children()}
	</main>

	<footer class="tl-footer">
		<img
			src="/taller/footer-logos.png"
			alt="Universidad de los Andes · Facultad de Educación · HUB Innovación Educativa con IA"
		/>
	</footer>
</div>

<style>
	.taller-root {
		--tl-purple: #8c52ff;
		--tl-purple-ink: #6a35e0;
		--tl-purple-soft: #efe7ff;
		--tl-bg: #ffffff;
		--tl-surface: #f7f6fb;
		--tl-line: #e2dfec;
		--tl-fg: #1f1d2b;
		--tl-fg-2: #4a4760;
		--tl-fg-3: #767390;
		--tl-human: #c2690a;
		--tl-human-soft: #f8ead9;
		--tl-machine: #008fa3;
		--tl-machine-soft: #d9eff2;
		--tl-gray: #a4a1b3;
		--tl-font: 'Lexend', system-ui, -apple-system, 'Segoe UI', sans-serif;

		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--tl-bg);
		color: var(--tl-fg);
		font-family: var(--tl-font);
		font-weight: 300;
		font-size: 17px;
		line-height: 1.55;
		color-scheme: light;
	}

	.tl-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 14px clamp(16px, 4vw, 40px);
		border-bottom: 1px solid var(--tl-line);
	}

	.tl-brand {
		font-weight: 600;
		color: var(--tl-purple-ink);
		font-size: 0.95rem;
	}

	.tl-top-right {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 0.85rem;
		color: var(--tl-fg-3);
	}

	.tl-code strong {
		color: var(--tl-fg);
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.tl-badge {
		background: var(--tl-purple-soft);
		color: var(--tl-purple-ink);
		font-weight: 500;
		padding: 3px 10px;
		border-radius: 99px;
		font-size: 0.78rem;
	}

	.tl-main {
		flex: 1;
		width: 100%;
		max-width: 880px;
		margin: 0 auto;
		padding: clamp(20px, 4vw, 44px) 16px 48px;
		box-sizing: border-box;
	}

	.tl-main.wide {
		max-width: 1200px;
	}

	.tl-footer {
		background: var(--tl-purple);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 16px;
	}

	.tl-footer img {
		display: block;
		height: clamp(34px, 5vw, 52px);
		width: auto;
		max-width: 100%;
		object-fit: contain;
	}

	/* ---------- shared slide vocabulary (used by all taller components) ---------- */

	.taller-root :global(h1),
	.taller-root :global(h2),
	.taller-root :global(h3) {
		font-family: var(--tl-font);
		color: var(--tl-purple);
		font-weight: 600;
		line-height: 1.15;
		margin: 0;
		text-wrap: balance;
	}

	.taller-root :global(h1) {
		font-size: clamp(2rem, 5vw, 3.2rem);
	}
	.taller-root :global(h2) {
		font-size: clamp(1.6rem, 3.6vw, 2.4rem);
	}
	.taller-root :global(h3) {
		font-size: 1.2rem;
	}

	.taller-root :global(p) {
		margin: 0;
	}

	.taller-root :global(.tl-eyebrow) {
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--tl-fg-3);
	}

	.taller-root :global(.tl-stack) {
		display: grid;
		gap: 22px;
	}

	.taller-root :global(.tl-btn) {
		font: 500 1rem var(--tl-font);
		border-radius: 10px;
		padding: 12px 20px;
		cursor: pointer;
		border: 1px solid var(--tl-purple);
		background: var(--tl-purple);
		color: #fff;
		min-height: 46px;
	}

	.taller-root :global(.tl-btn:hover:not(:disabled)) {
		background: var(--tl-purple-ink);
		border-color: var(--tl-purple-ink);
	}

	.taller-root :global(.tl-btn.ghost) {
		background: transparent;
		color: var(--tl-purple-ink);
		border-color: var(--tl-line);
	}

	.taller-root :global(.tl-btn.ghost:hover:not(:disabled)) {
		background: var(--tl-purple-soft);
		border-color: var(--tl-purple-soft);
	}

	.taller-root :global(.tl-btn:disabled) {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.taller-root :global(.tl-input) {
		font: 400 1.05rem var(--tl-font);
		padding: 12px 14px;
		border-radius: 10px;
		border: 1px solid var(--tl-line);
		background: #fff;
		color: var(--tl-fg);
		width: 100%;
		box-sizing: border-box;
		min-height: 48px;
	}

	.taller-root :global(textarea.tl-input) {
		min-height: 120px;
		resize: vertical;
		line-height: 1.5;
	}

	.taller-root :global(.tl-input:focus-visible),
	.taller-root :global(button:focus-visible),
	.taller-root :global(input[type='range']:focus-visible) {
		outline: 2px solid var(--tl-purple);
		outline-offset: 2px;
	}

	.taller-root :global(.tl-card) {
		background: var(--tl-surface);
		border: 1px solid var(--tl-line);
		border-radius: 14px;
		padding: clamp(18px, 3vw, 28px);
	}

	.taller-root :global(.tl-muted) {
		color: var(--tl-fg-3);
		font-size: 0.92rem;
	}

	.taller-root :global(.tl-error) {
		color: #b42318;
		background: #fef3f2;
		border: 1px solid #fecdca;
		border-radius: 10px;
		padding: 10px 14px;
		font-size: 0.92rem;
	}

	.taller-root :global(.hum) {
		color: var(--tl-human);
	}
	.taller-root :global(.mac) {
		color: var(--tl-machine);
	}
</style>
