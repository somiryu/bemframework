<script lang="ts">
	import {
		Q1,
		zone,
		mean,
		readings,
		type TallerCase
	} from '$lib/content/talleres/quienTieneLaCabeza';

	let {
		c,
		counts,
		scales,
		mine = null,
		showNotes = false
	}: {
		c: TallerCase;
		counts: number[];
		scales: number[];
		mine?: { choice: number | null; scale: number | null } | null;
		showNotes?: boolean;
	} = $props();

	const total = $derived(counts.reduce((x, y) => x + y, 0));
	const avg = $derived(mean(scales));
	const [r1, r2] = $derived(readings(counts, scales));

	// Strip plot geometry (viewBox units).
	const W = 600;
	const H = 164;
	const L = 16;
	const R = 16;
	const Y0 = 70;
	const x = (v: number) => L + ((W - L - R) * v) / 100;
	// Dots that would touch (same or near-same value) stack in rows around the
	// center line instead of landing on top of each other, so the number of
	// dots you can see matches the number of answers. Sorted first so the
	// layout is stable no matter what order the rows come back in.
	const ROWS = [0, -13, 13, -26, 26, -6, 6, -19, 19, -32, 32];
	const dots = $derived.by(() => {
		const placed: { v: number; cy: number }[] = [];
		for (const v of [...scales].sort((a, b) => a - b)) {
			const near = placed.filter((p) => Math.abs(x(p.v) - x(v)) < 12).length;
			placed.push({ v, cy: Y0 + ROWS[near % ROWS.length] });
		}
		return placed;
	});
	const clampLabel = (px: number, pad: number) => Math.min(Math.max(px, pad), W - pad);
</script>

<div class="fbgrid">
	<div class="panel">
		<h4>¿Has usado la IA de esta forma?</h4>
		<span class="meta">{total} {total === 1 ? 'respuesta' : 'respuestas'}</span>
		<div class="bars">
			{#each counts as n, i (i)}
				{@const pct = total ? Math.round((n / total) * 100) : 0}
				<div class="bar" title="{Q1[i]}: {n} de {total} ({pct}%)">
					<span class="lab">
						{Q1[i]}
						{#if mine?.choice === i}<span class="you">tú</span>{/if}
					</span>
					<span class="val">{n} · {pct}%</span>
					<!-- Bar length is the share of all answers, so it always matches the % shown. -->
					<div class="tr"><div class="fill" style:width="{total ? (n / total) * 100 : 0}%"></div></div>
				</div>
			{/each}
		</div>
	</div>

	<div class="panel">
		<h4>¿Dónde lo ubica el grupo?</h4>
		<span class="meta">cada punto es una persona</span>
		{#if scales.length}
			<svg
				viewBox="0 0 {W} {H}"
				width="100%"
				role="img"
				aria-label="Distribución del grupo. Promedio {Math.round(avg)} de 100, {zone(avg)}.{mine?.scale != null
					? ` Tu respuesta: ${zone(mine.scale)}.`
					: ''}"
			>
				<defs>
					<linearGradient id="tl-grad-{c.id}" x1="0" x2="1">
						<stop offset="0" stop-color="var(--tl-human)" />
						<stop offset=".5" stop-color="var(--tl-gray)" />
						<stop offset="1" stop-color="var(--tl-machine)" />
					</linearGradient>
				</defs>
				<rect x={L} y={Y0 + 34} width={W - L - R} height="6" rx="3" fill="url(#tl-grad-{c.id})" />
				{#each [0, 50, 100] as t (t)}
					<line x1={x(t)} x2={x(t)} y1={Y0 - 30} y2={Y0 + 32} stroke="var(--tl-line)" stroke-width="1" />
				{/each}
				{#each dots as { v, cy }, i (i)}
					<circle
						cx={x(v)}
						{cy}
						r="6"
						fill="var(--tl-purple)"
						fill-opacity=".55"
						stroke="#fff"
						stroke-width="2"
					>
						<title>{zone(v)} ({v}/100)</title>
					</circle>
				{/each}
				<line x1={x(avg)} x2={x(avg)} y1={Y0 - 40} y2={Y0 + 40} stroke="var(--tl-fg)" stroke-width="2" />
				<text x={clampLabel(x(avg), 60)} y={Y0 - 46} text-anchor="middle" font-size="13" fill="var(--tl-fg)">
					promedio
				</text>
				{#if mine?.scale != null}
					<!-- "tú" sits under the bar, pointing up at the value, so it never
					     hides another person's dot (your own dot is drawn with the rest). -->
					<g>
						<title>Tu respuesta: {zone(mine.scale)}</title>
						<path
							d="M {x(mine.scale)} {Y0 + 44} l -7 11 h 14 z"
							fill="var(--tl-fg)"
						/>
						<text
							x={clampLabel(x(mine.scale), 14)}
							y={Y0 + 72}
							text-anchor="middle"
							font-size="13"
							font-weight="600"
							fill="var(--tl-fg)">tú</text
						>
					</g>
				{/if}
				<text x={L} y={H - 4} font-size="13" fill="var(--tl-human)">Centauro</text>
				<text x={W / 2} y={H - 4} font-size="13" text-anchor="middle" fill="var(--tl-fg-3)">Zona gris</text>
				<text x={W - R} y={H - 4} font-size="13" text-anchor="end" fill="var(--tl-machine)">Invertido</text>
			</svg>
		{:else}
			<p class="tl-muted">Todavía no hay respuestas para este caso.</p>
		{/if}
	</div>
</div>

{#if total > 0}
	<div class="verdicts">
		<div class="verdict"><b>{r1[0]}</b><p>{r1[1]}</p></div>
		<div class="verdict"><b>{r2[0]}</b><p>{r2[1]}</p></div>
	</div>
{/if}

<div class="panel">
	<h4>La misma idea, dos cabezas</h4>
	<div class="twoheads">
		<div class="h"><span class="tl-eyebrow">Como centauro</span><p>{c.human}</p></div>
		<div class="m"><span class="tl-eyebrow">Como centauro invertido</span><p>{c.machine}</p></div>
	</div>
</div>

{#if c.mic}<p class="mic">{c.mic}</p>{/if}

{#if showNotes}
	<div class="facil">
		<span class="tl-eyebrow">Nota de facilitación · lectura del diseñador · {c.leanText}</span>
		<p>{c.read}</p>
	</div>
{/if}

<style>
	.fbgrid {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 24px;
	}

	.panel {
		display: grid;
		gap: 10px;
		align-content: start;
		min-width: 0;
	}

	h4 {
		margin: 0;
		font-weight: 500;
		font-size: 1.02rem;
	}

	.meta {
		font-size: 0.8rem;
		color: var(--tl-fg-3);
	}

	.bars {
		display: grid;
		gap: 12px;
	}

	.bar {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 4px 10px;
		align-items: center;
	}

	.lab {
		font-size: 0.95rem;
		color: var(--tl-fg-2);
		display: flex;
		gap: 6px;
		align-items: center;
		flex-wrap: wrap;
	}

	.val {
		font-size: 0.88rem;
		color: var(--tl-fg-2);
		font-variant-numeric: tabular-nums;
	}

	.tr {
		grid-column: 1 / -1;
		height: 14px;
		background: var(--tl-surface);
		border-radius: 0 4px 4px 0;
	}

	.fill {
		height: 100%;
		background: var(--tl-purple);
		border-radius: 0 4px 4px 0;
		min-width: 2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.fill {
			transition: width 0.5s ease;
		}
	}

	.you {
		font-size: 0.7rem;
		padding: 1px 7px;
		border-radius: 99px;
		border: 1px solid var(--tl-fg);
		color: var(--tl-fg);
	}

	svg text {
		font-family: var(--tl-font);
	}

	.verdicts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.verdict {
		border-radius: 12px;
		padding: 16px 18px;
		background: var(--tl-purple-soft);
		display: grid;
		gap: 4px;
		align-content: start;
	}

	.verdict b {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--tl-purple-ink);
	}

	.verdict p {
		color: var(--tl-fg-2);
		font-size: 0.95rem;
	}

	.twoheads {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border: 1px solid var(--tl-line);
		border-radius: 12px;
		overflow: hidden;
	}

	.twoheads > div {
		padding: 16px 18px;
		display: grid;
		gap: 6px;
		align-content: start;
		min-width: 0;
	}

	.twoheads .h {
		background: var(--tl-human-soft);
	}
	.twoheads .m {
		background: var(--tl-machine-soft);
	}

	.twoheads p {
		font-size: 0.96rem;
	}

	.mic {
		font-size: clamp(1.2rem, 2.6vw, 1.5rem);
		font-weight: 500;
		color: var(--tl-purple);
		max-width: 50ch;
		text-wrap: balance;
	}

	.facil {
		border-left: 3px solid var(--tl-purple);
		padding: 4px 0 4px 14px;
		display: grid;
		gap: 4px;
	}

	.facil p {
		color: var(--tl-fg-2);
		font-size: 0.95rem;
	}

	@media (max-width: 760px) {
		.fbgrid,
		.verdicts,
		.twoheads {
			grid-template-columns: 1fr;
		}
	}
</style>
