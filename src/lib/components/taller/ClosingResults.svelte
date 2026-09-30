<script lang="ts">
	import {
		CASES,
		Q1,
		zone,
		mean,
		POCKET_QUESTIONS,
		type ClosingResults
	} from '$lib/content/talleres/quienTieneLaCabeza';

	let { results, personal = false }: { results: ClosingResults; personal?: boolean } = $props();

	const rows = $derived(
		CASES.map((c) => {
			const s = results.summary.find((r) => r.id === c.id);
			return {
				title: c.title,
				group: s && s.scales.length ? zone(mean(s.scales)) : '—',
				mineChoice: s?.mine?.choice != null ? Q1[s.mine.choice] : '—',
				mineScale: s?.mine?.scale != null ? zone(s.mine.scale) : '—'
			};
		})
	);
</script>

<div class="panel">
	<h4>{personal ? 'Tu recorrido' : 'El recorrido del grupo'}</h4>
	<div class="tablewrap">
		<table>
			<thead>
				<tr>
					<th>Caso</th>
					{#if personal}<th>¿Lo has hecho?</th><th>Tu lectura</th>{/if}
					<th>El grupo</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as r (r.title)}
					<tr>
						<td><strong>{r.title}</strong></td>
						{#if personal}<td>{r.mineChoice}</td><td>{r.mineScale}</td>{/if}
						<td>{r.group}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="panel">
	<h4>Las vueltas del grupo</h4>
	<span class="meta">{results.vueltas.length} {results.vueltas.length === 1 ? 'respuesta' : 'respuestas'} · anónimas</span>
	{#if results.vueltas.length}
		<ul class="vueltas">
			{#each results.vueltas as v, i (i)}
				<li>{v}</li>
			{/each}
		</ul>
	{:else}
		<p class="tl-muted">Nadie escribió todavía.</p>
	{/if}
</div>

<div class="panel pocket">
	<h3>Tres preguntas de bolsillo</h3>
	<ol>
		{#each POCKET_QUESTIONS as q (q)}<li>{q}</li>{/each}
	</ol>
</div>

<style>
	.panel {
		display: grid;
		gap: 10px;
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

	.tablewrap {
		overflow-x: auto;
		border: 1px solid var(--tl-line);
		border-radius: 12px;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.94rem;
	}

	th,
	td {
		text-align: left;
		padding: 10px 14px;
		border-bottom: 1px solid var(--tl-line);
		vertical-align: top;
	}

	tr:last-child td {
		border-bottom: 0;
	}

	th {
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tl-fg-3);
		font-weight: 500;
		background: var(--tl-surface);
	}

	td {
		color: var(--tl-fg-2);
	}

	td strong {
		color: var(--tl-fg);
		font-weight: 500;
	}

	.vueltas {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 12px;
	}

	.vueltas li {
		background: var(--tl-surface);
		border: 1px solid var(--tl-line);
		border-left: 3px solid var(--tl-purple);
		border-radius: 10px;
		padding: 14px 16px;
		font-size: 0.96rem;
		white-space: pre-wrap;
	}

	.pocket ol {
		margin: 0;
		padding-left: 1.3em;
		display: grid;
		gap: 8px;
		font-size: 1.05rem;
	}
</style>
