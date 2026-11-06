<script lang="ts">
	// Gráfica de líneas en SVG que se dibuja al aparecer. Índice con «antes» = 100.
	interface Series {
		values: number[];
		color: string;
		label: string;
		dash?: boolean;
		width?: number;
	}
	let {
		series,
		labels,
		ymax = 240,
		w = 640,
		h = 260,
		right = 110,
		delay = '0s'
	}: {
		series: Series[];
		labels: string[];
		ymax?: number;
		w?: number;
		h?: number;
		right?: number;
		delay?: string;
	} = $props();

	const L = 46;
	const T = 14;
	const B = 30;
	const iw = $derived(w - L - right);
	const ih = $derived(h - T - B);
	const x = (i: number) => L + (i * iw) / Math.max(1, labels.length - 1);
	const y = (v: number) => T + ih - (Math.min(v, ymax) / ymax) * ih;
	const grid = [0, 50, 100, 150, 200];

	const ends = $derived.by(() => {
		const e = series.map((s) => ({
			y: y(s.values[s.values.length - 1]),
			label: s.label,
			color: s.color
		}));
		e.sort((a, b) => a.y - b.y);
		for (let i = 1; i < e.length; i++) if (e[i].y - e[i - 1].y < 14) e[i].y = e[i - 1].y + 14;
		return e;
	});
</script>

<svg
	viewBox="0 0 {w} {h}"
	width="100%"
	height="100%"
	preserveAspectRatio="xMidYMid meet"
	role="img"
	aria-label="Gráfica de uso por mes"
>
	{#each grid.filter((v) => v <= ymax) as v (v)}
		<line x1={L} x2={L + iw} y1={y(v)} y2={y(v)} stroke="var(--line)" />
		<text x={L - 8} y={y(v) + 4} text-anchor="end" font-size="11" fill="var(--faint)">{v}</text>
	{/each}
	<line x1={L} x2={L + iw} y1={y(100)} y2={y(100)} stroke="var(--muted)" stroke-dasharray="4 4" />
	<text x={L + iw + 6} y={y(100) + 4} font-size="11" fill="var(--muted)">antes</text>
	{#each labels as l, i (i)}
		<text x={x(i)} y={h - 8} text-anchor="middle" font-size="11" fill="var(--muted)">{l}</text>
	{/each}
	{#each series as s, k (s.label)}
		<path
			d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
			pathLength="1"
			class="drawp"
			style="--d: calc({delay} + {k * 0.15}s)"
			fill="none"
			stroke={s.color}
			stroke-width={s.width ?? 2.8}
			stroke-dasharray={s.dash ? '6 5' : undefined}
			stroke-linejoin="round"
			stroke-linecap="round"
		/>
		<circle
			class="popin"
			style="--d: calc({delay} + 1.6s)"
			cx={x(s.values.length - 1)}
			cy={y(s.values[s.values.length - 1])}
			r="4.5"
			fill={s.color}
		/>
	{/each}
	{#each ends as e (e.label)}
		<text x={L + iw + 12} y={e.y + 4} font-size="11.5" fill={e.color}>{e.label}</text>
	{/each}
</svg>

<style>
	svg text {
		font-family: var(--f-mono);
	}
</style>
