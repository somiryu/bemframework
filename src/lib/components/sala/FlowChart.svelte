<script lang="ts">
	// Flujo del 1.er al 2.º voto (tipo Sankey). Las cintas que llegan a la respuesta
	// correcta van en latón; las demás, en acero. Aparece con un barrido.
	let {
		flow,
		correct,
		options = [],
		w = 520,
		h = 250,
		small = false,
		delay = '0s'
	}: {
		flow: number[][];
		correct: number;
		/** Texto de cada opción: aparece al pasar el cursor sobre su letra. */
		options?: string[];
		w?: number;
		h?: number;
		small?: boolean;
		delay?: string;
	} = $props();

	const L = ['A', 'B', 'C', 'D'];
	const layout = $derived.by(() => {
		const n = Math.max(
			1,
			flow.flat().reduce((a, b) => a + b, 0)
		);
		const gap = 8;
		const colH = h - gap * 3 - 20;
		const x0 = small ? 38 : 70;
		const x1 = w - (small ? 38 : 70);
		const nw = small ? 10 : 14;
		const c1 = flow.map((row) => row.reduce((a, b) => a + b, 0));
		const c2 = [0, 1, 2, 3].map((j) => flow.reduce((a, row) => a + row[j], 0));
		const pos = (counts: number[]) => {
			let y = 10;
			return counts.map((cn) => {
				const hh = Math.max(2, (cn / n) * colH);
				const p = { y, h: hh };
				y += hh + gap;
				return p;
			});
		};
		const p1 = pos(c1);
		const p2 = pos(c2);
		const off1 = p1.map((p) => p.y);
		const off2 = p2.map((p) => p.y);
		const ribbons: { d: string; color: string; op: number }[] = [];
		for (let i = 0; i < 4; i++)
			for (let j = 0; j < 4; j++) {
				const k = flow[i][j];
				if (!k) continue;
				const hh = (k / n) * colH;
				const ya = off1[i];
				const yb = off2[j];
				off1[i] += hh;
				off2[j] += hh;
				const xa = x0 + nw;
				const xb = x1;
				const mx = (xa + xb) / 2;
				ribbons.push({
					d: `M${xa},${ya} C${mx},${ya} ${mx},${yb} ${xb},${yb} L${xb},${yb + hh} C${mx},${yb + hh} ${mx},${ya + hh} ${xa},${ya + hh} Z`,
					color: j === correct ? 'var(--brass)' : 'var(--steel)',
					op: i === j ? 0.22 : j === correct ? 0.7 : 0.4
				});
			}
		return { x0, x1, nw, c1, c2, p1, p2, ribbons, fs: small ? 10 : 12 };
	});
</script>

<svg
	viewBox="0 0 {w} {h}"
	width="100%"
	height="100%"
	preserveAspectRatio="xMidYMid meet"
	role="img"
	aria-label="Cómo cambió la sala entre el primer y el segundo voto"
>
	<text x={layout.x0} y={h - 2} font-size={layout.fs} fill="var(--faint)">1.er voto</text>
	<text
		x={layout.x1 + layout.nw}
		y={h - 2}
		text-anchor="end"
		font-size={layout.fs}
		fill="var(--faint)">2.º voto</text
	>
	<g class="wipe" style="--d: {delay}">
		{#each layout.ribbons as r, i (i)}<path d={r.d} fill={r.color} opacity={r.op} />{/each}
	</g>
	{#each [0, 1, 2, 3] as i (i)}
		{@const ok = i === correct}
		<rect
			x={layout.x0}
			y={layout.p1[i].y}
			width={layout.nw}
			height={layout.p1[i].h}
			rx="2"
			fill={ok ? 'var(--brass)' : 'var(--steel)'}
		/>
		<rect
			x={layout.x1}
			y={layout.p2[i].y}
			width={layout.nw}
			height={layout.p2[i].h}
			rx="2"
			fill={ok ? 'var(--brass)' : 'var(--steel)'}
		/>
		<text
			x={layout.x0 - 6}
			y={layout.p1[i].y + layout.p1[i].h / 2 + 4}
			text-anchor="end"
			font-size={layout.fs}
			fill={ok ? 'var(--brass-hi)' : 'var(--muted)'}
			>{#if options[i]}<title>{L[i]}. {options[i]}</title>{/if}{L[i]}
			{layout.c1[i]}</text
		>
		<text
			x={layout.x1 + layout.nw + 6}
			y={layout.p2[i].y + layout.p2[i].h / 2 + 4}
			font-size={layout.fs}
			fill={ok ? 'var(--brass-hi)' : 'var(--muted)'}
			>{#if options[i]}<title>{L[i]}. {options[i]}</title>{/if}{L[i]}
			{layout.c2[i]}</text
		>
	{/each}
</svg>

<style>
	svg text {
		font-family: var(--f-mono);
	}
</style>
