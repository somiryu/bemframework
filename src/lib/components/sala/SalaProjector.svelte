<script lang="ts">
	import Portrait from './Portrait.svelte';
	import MentorFigure from './MentorFigure.svelte';
	import Countdown from './Countdown.svelte';
	import LineChart from './LineChart.svelte';
	import FlowChart from './FlowChart.svelte';
	import { createStageClock } from './stage.svelte';
	import {
		GUILDS,
		CABECERA,
		MENTORS,
		OPTION_LETTERS as L,
		type GuildId
	} from '$lib/content/talleres/salaDeCrisis';

	// Vista colectiva para el proyector: 16:9, se escala con el ancho disponible.
	// Solo lee la vista del facilitador; no tiene controles.
	let {
		view,
		qrSvg = '',
		joinUrl = ''
	}: { view: any; qrSvg?: string; joinUrl?: string } = $props();

	const clock = createStageClock(() => view);
	// Las animaciones de revelación arrancan cuando termina la cuenta regresiva del
	// servidor, aunque la vista haya llegado tarde: se fija al montar cada fase.
	let revealDelay = $state(`${Math.max(0, 3200 - initialAge()) / 1000}s`);
	function initialAge() {
		return view.stageAge;
	}
	let seenStep = view.state.step;
	$effect(() => {
		if (view.state.step !== seenStep) {
			seenStep = view.state.step;
			revealDelay = `${Math.max(0, 3200 - clock.elapsed) / 1000}s`;
		}
	});
	const d = $derived(view.data ?? {});
	const G = Object.fromEntries(GUILDS.map((g) => [g.id, g]));
	const fam = (id: GuildId | null | undefined) => (id ? `var(--${G[id].fam})` : 'var(--steel)');
	const pct = (v: number | null | undefined) => (v == null ? '—' : `${Math.round(v * 100)}%`);
	const EL = (i: number) => String.fromCharCode(65 + i);

	const PHASE: Record<string, string> = {
		lobby: 'Enganche',
		guild: 'Enganche',
		exp0: 'Tensión',
		exp0r: 'Tensión',
		vote: 'Descubrimiento',
		case: 'Descubrimiento',
		mirror: 'Descubrimiento',
		reveal: 'Descubrimiento',
		budget: 'Secuencia final',
		budgetr: 'Secuencia final',
		integ: 'Integración',
		close: 'Cierre'
	};
	const total = $derived(Math.max(1, view.participantCount));
	const respPct = $derived(Math.min(100, (view.responseCount / total) * 100));

	// Radar del lobby: un punto por cadete, repartidos en tres anillos.
	const radarDots = Array.from({ length: 48 }, (_, i) => {
		const r = [34, 41, 48][i % 3];
		const a = i * 2.399;
		return { cx: 50 + Math.cos(a) * r, cy: 50 + Math.sin(a) * r, fam: GUILDS[i % 4].fam };
	});
</script>

<div class="proj-wrap">
	<div class="proj">
		<div class="pj">
			<header class="pj-head">
				<span class="brand">
					<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" aria-hidden="true">
						<circle cx="12" cy="12" r="10" fill="none" stroke="var(--brass)" stroke-width="1.5" />
						<g class="spin-slow"
							><path
								d="M12 12 L12 3"
								stroke="var(--brass)"
								stroke-width="2"
								stroke-linecap="round"
							/></g
						>
						<circle cx="12" cy="12" r="2" fill="var(--brass)" />
					</svg>
					OMIE · SALA DE CRISIS
				</span>
				<span class="meta">
					<span>{PHASE[view.stage]}</span>
					{#if ['vote', 'case', 'mirror', 'reveal'].includes(view.stage)}<span
							>Ronda <b>{view.round + 1}</b></span
						>{/if}
					<span>Sala <b>{view.code}</b></span>
					<span>Cadetes <b>{view.participantCount}</b></span>
				</span>
			</header>

			<div class="pj-body" style="--rv:{revealDelay}">
				{#key view.state.step}
					{#if view.stage === 'lobby'}
						<div class="row grow center" style="gap:3.5cqw">
							<div class="radar">
								<svg viewBox="0 0 100 100" aria-hidden="true">
									<circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" />
									<circle
										cx="50"
										cy="50"
										r="41"
										fill="none"
										stroke="var(--line)"
										stroke-dasharray="1 2"
									/>
									<circle cx="50" cy="50" r="34" fill="none" stroke="var(--line)" />
									<g class="sweep"
										><path
											d="M50 50 L50 2 A48 48 0 0 1 84 16 Z"
											fill="var(--brass)"
											opacity=".12"
										/><line
											x1="50"
											y1="50"
											x2="50"
											y2="2"
											stroke="var(--brass)"
											stroke-width=".6"
										/></g
									>
									{#each radarDots as p, i (i)}
										<circle
											class="cadet"
											class:on={i < view.participantCount}
											cx={p.cx}
											cy={p.cy}
											r="1.6"
											fill="var(--{p.fam})"
										/>
									{/each}
								</svg>
								<!-- SVG generado en el servidor por la librería qrcode a partir del enlace de la sala. -->
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class="qr">{@html qrSvg}</div>
							</div>
							<div class="grow col" style="gap:1.1cqw">
								<span class="eyebrow">Turno de admisión</span>
								<h2>Escanea y entra a la sala</h2>
								<p class="url">
									{joinUrl.replace(/^https?:\/\//, '').replace(/\/[^/]+$/, '/')}<b>{view.code}</b>
								</p>
								<div class="row base" style="gap:.8em">
									<span class="big">{view.participantCount}</span><span class="muted"
										>cadetes en el radar</span
									>
								</div>
								<div class="row center" style="gap:1em">
									<Portrait mentor="giochi" size="5.5em" />
									<div class="bubble grow">
										<span class="who">GIOCHI</span>Bip-bop. Hoy llegan expedientes de sistemas que
										funcionaron y luego se averiaron. Ustedes votan cuál abrir, lo resuelven y lo
										discuten en gremio.
									</div>
								</div>
								{#if d.aliases?.length}
									<div class="chips">
										{#each d.aliases.slice(-16) as a, i (i)}<span class="chip rise"
												>{a.alias ?? 'Cadete'}</span
											>{/each}
									</div>
								{/if}
							</div>
						</div>
					{:else if view.stage === 'guild'}
						<div class="split">
							<div>
								<span class="eyebrow">Paso 1 · Gremio y mentor de cabecera</span>
								<h2>Cuatro gremios, cuatro mentores</h2>
							</div>
							<span class="sm muted" style="max-width:34ch"
								>El gremio es tu mesa de deliberación. El mentor te habla en el celular después de
								cada caso.</span
							>
						</div>
						<div class="guilds">
							{#each GUILDS as g, i (g.id)}
								<div class="guild flipin" style="--d:{i * 0.12}s; background-image:url('{g.img}')">
									<div>
										<div class="cnt">{d.guilds?.[g.id] ?? 0}</div>
										<h3>{g.name}</h3>
										<div class="sm muted">{g.motive}</div>
										<div class="bar" style="margin-top:.6em">
											<i
												style="width:{Math.min(
													100,
													((d.guilds?.[g.id] ?? 0) / Math.max(1, total / 4)) * 50
												)}%; background:var(--{g.fam})"
											></i>
										</div>
									</div>
								</div>
							{/each}
						</div>
						<div class="mentors">
							{#each CABECERA as k, i (k)}
								<div class="mcard rise" style="--d:{0.4 + i * 0.1}s">
									<div class="mimg" style="background-image:url('{MENTORS[k].img}')"></div>
									<div class="mtxt">
										<span class="mcnt">{d.mentors?.[k] ?? 0}</span>
										<b>{MENTORS[k].name}</b>
										<span>{MENTORS[k].role}</span>
									</div>
								</div>
							{/each}
						</div>
					{:else if view.stage === 'exp0'}
						<div class="row grow" style="gap:3cqw">
							<div class="grow col" style="gap:1.2cqw">
								<span class="eyebrow">Expediente 0 · caso hipotético</span>
								<h2>La app que funcionó</h2>
								<p class="lead">
									Una app de hábitos de estudio agregó puntos por cada sesión, medallas semanales y
									un ranking global de todos sus usuarios. En el primer mes, las sesiones diarias se
									duplicaron.
								</p>
								<p class="muted">
									La Agencia Brillo, que la diseñó, la presenta como caso de éxito.
								</p>
								<div class="row center" style="margin-top:auto; gap:1em">
									<Portrait mentor="giochi" size="4.6em" />
									<div class="bubble grow">
										<span class="who">GIOCHI</span>En su celular: ¿qué tan exitoso fue este diseño,
										de 0 a 100? No hay respuesta correcta.
									</div>
								</div>
							</div>
							<div class="col side">
								<span class="eyebrow">Respuestas</span>
								<span class="big"
									>{view.responseCount}<small> / {view.participantCount}</small></span
								>
								<div class="bar"><i style="width:{respPct}%"></i></div>
								<span class="sm faint">La distribución se revela al cerrar.</span>
							</div>
						</div>
					{:else if view.stage === 'exp0r'}
						{@const mx = Math.max(1, ...(d.bins ?? [1]))}
						<div class="row grow" style="gap:2.2cqw">
							<div class="col" style="flex:0 0 31%; gap:.9cqw">
								<span class="eyebrow">Lo que pensó la sala</span>
								<div class="row base" style="gap:.5em">
									<span class="big">{d.avg ?? '—'}</span><span class="muted"
										>de éxito, en promedio</span
									>
								</div>
								<svg
									viewBox="0 0 200 70"
									width="100%"
									role="img"
									aria-label="Distribución de respuestas"
								>
									{#each d.bins ?? [] as n, i (i)}
										<rect
											class="growy"
											style="--d:calc(var(--rv) + {i * 0.08}s)"
											x={i * 40 + 4}
											y={60 - (n / mx) * 54}
											width="32"
											height={(n / mx) * 54}
											rx="2"
											fill="var(--steel)"
										/>
										<text
											x={i * 40 + 20}
											y="69"
											text-anchor="middle"
											font-size="7"
											fill="var(--faint)">{i * 20}–{i * 20 + 20}</text
										>
									{/each}
								</svg>
								<div class="g2">
									{#each GUILDS as g (g.id)}
										<span class="sm muted row center" style="gap:.4em"
											><span class="dot" style="background:var(--{g.fam})"></span>{g.name.split(
												' '
											)[0]} <b class="paper">{d.guilds?.[g.id] ?? '—'}</b></span
										>
									{/each}
								</div>
								<div class="card rise" style="margin-top:auto; --d:calc(var(--rv) + 1.6s)">
									<span class="eyebrow">Giro</span>
									<p class="paper" style="margin-top:.3em">
										En el mes 3 las sesiones cayeron por debajo del inicio. Los primeros en irse
										fueron los de abajo del ranking.
									</p>
								</div>
							</div>
							<div class="grow col" style="gap:.5cqw; min-height:0">
								<span class="eyebrow"
									>Sesiones diarias · índice, antes = 100 · datos ilustrativos</span
								>
								<div style="flex:1; min-height:0">
									<LineChart
										labels={['Antes', 'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4']}
										series={[
											{
												values: [100, 205, 160, 78, 52],
												color: 'var(--brass)',
												label: 'App Brillo'
											}
										]}
										delay="var(--rv)"
									/>
								</div>
								<p class="sm faint">
									El barniz de puntos, medallas y ranking produce engagement efímero y extinción de
									la conducta. Hoy vamos a ver por qué.
								</p>
							</div>
						</div>
						<Countdown elapsed={clock.elapsed} />
					{:else if view.stage === 'vote'}
						<div class="split">
							<div>
								<span class="eyebrow"
									>Ronda {view.round + 1} · Votación de expediente · {d.options.length} en concurso</span
								>
								<h2>¿Qué expediente abre la sala?</h2>
							</div>
							<div class="row center" style="gap:.8em">
								<Portrait mentor="giochi" size="3.8em" /><span
									class="paper"
									style="max-width:26ch; font-size:.85em"
									>Gana la mayoría y toda la sala juega el mismo. Si hay empate, lanzo la moneda.</span
								>
							</div>
						</div>
						<div
							class="vgrid grow"
							class:many={d.options.length > 3}
							style="--n:{Math.min(d.options.length, 3)}"
						>
							{#each d.options as id, i (id)}
								{@const e = d.expedientes.find((x: any) => x.id === id)}
								{@const n = d.votes[id] ?? 0}
								<div class="vfold rise" style="--d:{i * 0.12}s">
									<div
										class="vimg"
										style="background-image:url('{MENTORS[e.mentor as keyof typeof MENTORS].img}')"
									>
										<span>Lo presenta<b>{MENTORS[e.mentor as keyof typeof MENTORS].name}</b></span>
									</div>
									<div class="vbody">
										<span class="eyebrow"
											>EXP · {EL(i)} · {e.kind} · caso {e.caseNo} de {e.total}</span
										>
										<span class="t">{e.name}</span>
										<span class="desc">{e.teaser}</span>
										<span class="vcnt">{n}</span>
										<div class="bar" style="height:.75em">
											<i style="width:{(n / total) * 100}%"></i>
										</div>
									</div>
								</div>
							{/each}
						</div>
						<div class="pool">
							{#each d.expedientes as e (e.id)}
								<div class="pchip {e.status}">
									<span
										>{e.status === 'closed'
											? `✓ Cerrado · ${e.total}/${e.total}`
											: e.status === 'open'
												? `En concurso · caso ${e.caseNo} de ${e.total}`
												: `🔒 Ronda ${e.unlockRound}`}</span
									>
									<b>{e.name}</b>
								</div>
							{/each}
						</div>
					{:else if view.stage === 'case'}
						{@const cs = d.case}
						<div class="row" style="gap:1.6cqw; flex:0 0 auto">
							<MentorFigure mentor={cs.exp.mentor} />
							<div class="grow col" style="gap:.6cqw">
								<div class="split">
									<div>
										<span class="eyebrow"
											>Ronda {view.round + 1} · {cs.exp.name} · caso {cs.idx + 1} de {cs.total} · presentado
											por {MENTORS[cs.exp.mentor as keyof typeof MENTORS].name}</span
										>
										<h2>
											{cs.title}<span class="stamp"
												>{d.pick.tie
													? 'EMPATE · MONEDA DE GIOCHI'
													: `ELEGIDO · ${d.pick.votes[d.pick.exp] ?? 0} VOTOS`}</span
											>
										</h2>
									</div>
									<div class="right">
										<span class="big" style="font-size:2.2em">{view.responseCount}</span>
										<div class="sm faint">respuestas</div>
									</div>
								</div>
								<div class="bubble" style="font-size:.95em">{cs.setup}</div>
							</div>
						</div>
						<div class="row grow" style="gap:1.6cqw">
							<div class="col" style="flex:0 0 34%; gap:.6cqw">
								<span class="eyebrow">Ficha del caso</span>
								<div class="ficha">
									{#each cs.ficha as f, i (i)}<div class="rise" style="--d:{0.3 + i * 0.1}s">
											<b>{f[0]}</b>{f[1]}
										</div>{/each}
								</div>
							</div>
							<div class="grow col" style="gap:.7cqw">
								<b style="font-size:1.15em">{cs.q}</b>
								<div class="optgrid">
									{#each cs.options as o, i (i)}<div class="popt rise" style="--d:{0.5 + i * 0.1}s">
											<span class="letter">{L[i]}</span><span>{o}</span>
										</div>{/each}
								</div>
								<div class="bar" style="margin-top:auto"><i style="width:{respPct}%"></i></div>
							</div>
						</div>
					{:else if view.stage === 'mirror'}
						{@const cs = d.case}
						{@const top = d.args
							.map((a: any, i: number) => ({ ...a, i }))
							.filter((a: any) => a.count > 0)
							.sort((a: any, b: any) => b.count - a.count)
							.slice(0, 3)}
						<div class="split">
							<div>
								<span class="eyebrow">Ronda {view.round + 1} · Espejo de la sala · {cs.title}</span>
								<h2>Así respondió la sala. Todavía no hay respuesta correcta.</h2>
							</div>
							<div class="row center" style="gap:.8em">
								<svg
									viewBox="0 0 44 44"
									width="4.2em"
									height="4.2em"
									aria-hidden="true"
									style="transform:rotate(-90deg)"
								>
									<circle
										cx="22"
										cy="22"
										r="19"
										fill="none"
										stroke="var(--line)"
										stroke-width="3"
									/>
									<circle
										cx="22"
										cy="22"
										r="19"
										fill="none"
										stroke="var(--brass)"
										stroke-width="3"
										pathLength="1"
										stroke-dasharray="1"
										style="animation: sala-ring 60s linear forwards"
									/>
								</svg>
								<div>
									<b class="disp">60 s</b>
									<div class="sm faint">deliberación<br />en gremio</div>
								</div>
							</div>
						</div>
						<div class="row grow" style="gap:2cqw">
							<div class="grow col" style="gap:.9cqw; justify-content:center">
								{#each [0, 1, 2, 3] as i (i)}
									{@const n = d.args[i].count}
									<div class="mrow rise" style="--d:{i * 0.12}s">
										<span class="letter">{L[i]}</span>
										<div style="min-width:0">
											<div
												class="sm paper ell"
												style="margin-bottom:.25em"
												title="{L[i]}. {cs.options[i]}"
											>
												{cs.options[i]}
											</div>
											<div class="stack growx" style="--d:{0.3 + i * 0.12}s">
												{#each GUILDS as g (g.id)}
													{@const k = d.dist[i][g.id] ?? 0}
													{#if k}<i
															style="width:{(k / Math.max(1, d.total)) *
																100}%; background:var(--{g.fam})"
														></i>{/if}
												{/each}
											</div>
										</div>
										<b class="disp" style="font-size:1.4em; text-align:right">{n}</b>
										<div>
											<div class="confdots">
												{#each [1, 2, 3, 4, 5] as k (k)}<i class:on={k <= Math.round(d.conf[i])}
													></i>{/each}
											</div>
											<span class="sm faint">seguridad</span>
										</div>
									</div>
								{/each}
								<div class="row" style="gap:1.2em; flex-wrap:wrap">
									{#each GUILDS as g (g.id)}<span class="sm muted row center" style="gap:.35em"
											><span class="dot" style="background:var(--{g.fam})"></span>{g.name}</span
										>{/each}
								</div>
							</div>
							<div class="col" style="flex:0 0 36%; gap:.8cqw">
								<span class="eyebrow">Argumentos de la sala</span>
								{#each top as a, j (a.i)}
									{@const q = a.quotes[a.quotes.length - 1]}
									{#if q}
										<div class="quote rise" style="--d:{0.6 + j * 0.15}s">
											<small
												><span class="letter mini" title="{L[a.i]}. {cs.options[a.i]}"
													>{L[a.i]}</span
												>{#if q.guild}<span class="dot" style="background:{fam(q.guild)}"></span>un
													cadete de {G[q.guild].name}{:else}argumento frecuente{/if}</small
											>
											«{q.text}»
										</div>
									{/if}
								{/each}
								<div class="sm faint" style="margin-top:auto">
									Segundo voto en los celulares: <b class="paper">{view.responseCount}</b> / {d.total}
								</div>
							</div>
						</div>
					{:else if view.stage === 'reveal'}
						{@const cs = d.case}
						{@const s = d.summary}
						{@const a1 = s.n ? s.v1[s.correct] / s.n : 0}
						{@const a2 = s.n ? s.v2[s.correct] / s.n : 0}
						{@const moved = s.flow.reduce(
							(acc: number, row: number[], i: number) =>
								acc + (i === s.correct ? 0 : row[s.correct]),
							0
						)}
						{@const ranked = (Object.entries(s.guilds) as [GuildId, any][])
							.map(([id, g]) => ({ id, ...g, gain: g.a2 - g.a1 }))
							.sort((x, y) => y.gain - x.gain)}
						<div class="split">
							<div>
								<span class="eyebrow">Ronda {view.round + 1} · Revelación · {cs.title}</span>
								<h2>{L[cs.correct]}. {cs.options[cs.correct]}</h2>
							</div>
							<div class="right">
								<span class="big" style="font-size:2.4em">{pct(a1)} → {pct(a2)}</span>
								<div class="sm faint">de la sala acertó, antes y después de deliberar</div>
							</div>
						</div>
						<div class="row grow" style="gap:2cqw">
							<div class="grow col" style="gap:.5cqw; min-height:0">
								<span class="eyebrow"
									>Cómo se movió la sala · {moved}
									{moved === 1 ? 'cadete cambió' : 'cadetes cambiaron'} hacia la respuesta</span
								>
								<div style="flex:1; min-height:0">
									{#if s.n}<FlowChart
											flow={s.flow}
											options={cs.options}
											correct={s.correct}
											delay="var(--rv)"
										/>{:else}<p class="muted">Nadie respondió en esta ronda.</p>{/if}
								</div>
							</div>
							<div class="col" style="flex:0 0 40%; gap:.9cqw">
								<div class="row rise" style="gap:1em; --d:calc(var(--rv) + .5s)">
									<MentorFigure
										mentor={cs.exp.mentor}
										width="7.5em"
										minHeight="8em"
										label={MENTORS[cs.exp.mentor as keyof typeof MENTORS].name.split(' ')[0]}
									/>
									<div class="bubble grow" style="font-size:.92em">
										<span class="who">{MENTORS[cs.exp.mentor as keyof typeof MENTORS].name}</span
										>{cs.explain}
									</div>
								</div>
								<div class="card rise" style="--d:calc(var(--rv) + 1s)">
									<span class="eyebrow">Mejor deliberación</span>
									{#each ranked as g, i (g.id)}
										<div class="delib" class:first={g.id === s.best}>
											<span class="row center" style="gap:.4em"
												><span class="dot" style="background:{fam(g.id)}"></span>{G[g.id]
													.name}</span
											>
											<span class="sm faint right">{pct(g.a1)}</span>
											<div class="bar">
												<i
													class="growx"
													style="--d:calc(var(--rv) + 1.2s + {i * 0.1}s); width:{g.a2 *
														100}%; background:{fam(g.id)}"
												></i>
											</div>
											<span class="mono"
												>{g.gain >= 0 ? '+' : ''}{Math.round(g.gain * 100)} pts</span
											>
										</div>
									{/each}
									<div class="sm faint" style="margin-top:.5em">
										{s.best
											? `+4 XP para cada miembro del gremio ${G[s.best].name}.`
											: 'Ningún gremio mejoró al deliberar en esta ronda.'}
									</div>
								</div>
							</div>
						</div>
						<Countdown elapsed={clock.elapsed} />
					{:else if view.stage === 'budget'}
						<div class="row grow" style="gap:3cqw">
							<div class="grow col" style="gap:1.1cqw">
								<span class="eyebrow">Bucle de gremio · decisión interdependiente</span>
								<h2>Reparen la app de la Agencia Brillo</h2>
								<p class="lead">
									Cada gremio reparte 10 Puntos de Recurso entre cuatro reparaciones. La propuesta
									del gremio es el promedio de sus miembros. Las consecuencias aparecen meses
									después.
								</p>
								<div class="g2">
									{#each d.options as o, i (o.id)}<div class="card rise" style="--d:{i * 0.1}s">
											{o.name}
										</div>{/each}
								</div>
							</div>
							<div class="col side">
								<span class="eyebrow">Propuestas recibidas</span>
								<span class="big">{view.responseCount}</span>
								<div class="bar"><i style="width:{respPct}%"></i></div>
								<div class="row center" style="gap:.6em">
									<Portrait mentor="wilkins" size="3.4em" /><span class="sm faint"
										>Hablen en el gremio antes de enviar.</span
									>
								</div>
							</div>
						</div>
					{:else if view.stage === 'budgetr'}
						{@const withData = d.guilds.filter((g: any) => g.curve)}
						{@const best = [...withData].sort((a: any, b: any) => b.curve[3] - a.curve[3])[0]}
						<div class="split">
							<div>
								<span class="eyebrow">Consecuencias · simulación con las reglas del caso</span>
								<h2>Cuatro meses después</h2>
							</div>
							<span class="sm faint" style="max-width:40ch"
								>Las medallas suben rápido y se apagan. Las metas opcionales y el feedback del error
								sostienen.</span
							>
						</div>
						<div class="row grow" style="gap:2cqw; min-height:0">
							<div class="grow" style="min-height:0">
								{#if withData.length}
									<LineChart
										labels={['Antes', 'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4']}
										series={withData.map((g: any) => ({
											values: [100, ...g.curve],
											color: fam(g.guild),
											label: G[g.guild].name.split(' ')[0]
										}))}
										delay="var(--rv)"
									/>
								{:else}<p class="muted">Ningún gremio envió propuesta.</p>{/if}
							</div>
							<div class="col" style="flex:0 0 27%; gap:.7cqw">
								{#each d.guilds as g, i (g.guild)}
									<div
										class="card rise"
										style="--d:calc(var(--rv) + .2s + {i * 0.1}s); padding:.55em .8em"
									>
										<div class="row center" style="gap:.5em">
											<span class="dot" style="background:{fam(g.guild)}"></span><b
												style="font-size:.9em">{G[g.guild].name}</b
											><span class="sm faint" style="margin-left:auto"
												>{g.n} {g.n === 1 ? 'voto' : 'votos'}</span
											>
										</div>
										{#if g.avg}
											<div class="alloc">
												{#each ['a', 'b', 'c', 'd'] as k, j (k)}<i
														style="width:{g.avg[k] * 10}%; background:{[
															'var(--steel)',
															'var(--paper)',
															'var(--brass)',
															'var(--faint)'
														][j]}"
													></i>{/each}
											</div>
										{/if}
									</div>
								{/each}
								<div class="sm faint row" style="flex-wrap:wrap; gap:.2em .8em">
									<span><i class="dot" style="background:var(--steel)"></i> Tabla</span><span
										><i class="dot" style="background:var(--paper)"></i> Metas</span
									><span><i class="dot" style="background:var(--brass)"></i> Error</span><span
										><i class="dot" style="background:var(--faint)"></i> Medallas</span
									>
								</div>
								{#if best}<div class="sm faint">
										Mejor mes 4: <b class="paper">{G[best.guild].name}</b>
									</div>{/if}
							</div>
						</div>
						<Countdown elapsed={clock.elapsed} label="Pasan cuatro meses" />
					{:else if view.stage === 'integ'}
						<div class="split">
							<div>
								<span class="eyebrow">Integración · anónimo</span>
								<h2>Mañana, en tu clase o tu trabajo, cambiarías…</h2>
							</div>
							<Portrait mentor="kira" size="3.6em" />
						</div>
						<div class="wall">
							{#each (d.wall ?? []).slice(-12) as t, i (i)}<div class="card rise paper">
									{t}
								</div>{/each}
							{#if !d.wall?.length}<p class="muted">
									Las frases aparecen aquí a medida que llegan.
								</p>{/if}
						</div>
					{:else if view.stage === 'close'}
						<div class="split">
							<div>
								<span class="eyebrow">Ceremonia de cierre</span>
								<h2>Podios de la Sala de Crisis</h2>
							</div>
						</div>
						<div class="podiums">
							{#each d.podiums as p, i (i)}
								<div class="card podium" style="animation-delay:{0.2 + i * 0.25}s">
									<svg viewBox="0 0 60 60" width="3.4em" height="3.4em" aria-hidden="true">
										<path
											d="M20 2 L30 22 L40 2"
											fill="none"
											stroke={p.kind === 'guild' && p.who ? fam(p.who) : 'var(--steel)'}
											stroke-width="6"
										/>
										<circle cx="30" cy="38" r="19" fill="var(--brass)" />
										<circle
											cx="30"
											cy="38"
											r="14"
											fill="none"
											stroke="var(--brass-hi)"
											stroke-width="2"
										/>
										<text
											x="30"
											y="44"
											text-anchor="middle"
											font-size="16"
											font-weight="700"
											fill="var(--ink)">{i + 1}</text
										>
									</svg>
									<span class="eyebrow">{p.title}</span>
									<b class="disp" style="font-size:1.4em; line-height:1.1"
										>{p.who ? (p.kind === 'guild' ? `Gremio ${G[p.who].name}` : p.who) : '—'}</b
									>
									<span class="sm faint">{p.note}</span>
								</div>
							{/each}
						</div>
						<div class="row" style="gap:1.2cqw">
							{#each d.guilds as g, i (g.id)}
								<div class="card grow rise" style="--d:{1.1 + i * 0.1}s">
									<div class="row center" style="gap:.5em">
										<span class="dot" style="background:{fam(g.id)}"></span><b
											style="font-size:.9em">{G[g.id].name}</b
										>
									</div>
									<div class="sm faint" style="margin:.3em 0">
										Acierto tras deliberar · {pct(g.acc)}
									</div>
									<div class="bar">
										<i
											class="growx"
											style="--d:{1.3 + i * 0.1}s; width:{(g.acc ?? 0) * 100}%; background:{fam(
												g.id
											)}"
										></i>
									</div>
								</div>
							{/each}
						</div>
						<div class="row rise" style="--d:1.5s; margin-top:auto; gap:1.2cqw">
							{#each ['sara', 'wilkins', 'kira', 'emma', 'giochi'] as k (k)}
								<MentorFigure mentor={k as keyof typeof MENTORS} width="18%" minHeight="6.5em" />
							{/each}
						</div>
					{/if}
				{/key}
			</div>
		</div>
	</div>
</div>

<style>
	.proj-wrap {
		width: 100%;
		container-type: inline-size;
	}
	.proj {
		aspect-ratio: 16 / 9;
		width: 100%;
		background: var(--stage);
		border: 1px solid var(--line);
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		container-type: inline-size;
	}
	.proj::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				ellipse at 85% -10%,
				color-mix(in srgb, var(--brass) 10%, transparent),
				transparent 55%
			),
			repeating-linear-gradient(
				0deg,
				transparent 0 3.2cqw,
				color-mix(in srgb, var(--line) 35%, transparent) 3.2cqw calc(3.2cqw + 1px)
			);
		pointer-events: none;
	}
	.pj {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		font-size: clamp(8px, 1.42cqw, 28px);
		padding: 2cqw 2.4cqw;
	}
	.pj-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2cqw;
		border-bottom: 1px solid var(--line);
		padding-bottom: 1cqw;
		margin-bottom: 1.4cqw;
		position: relative;
	}
	.brand {
		font-family: var(--f-display);
		font-weight: 700;
		letter-spacing: 0.12em;
		font-size: 1.1em;
		color: var(--brass);
		display: flex;
		align-items: center;
		gap: 0.6em;
	}
	.meta {
		display: flex;
		gap: 2cqw;
		font-family: var(--f-mono);
		font-size: 0.82em;
		color: var(--muted);
	}
	.meta b {
		color: var(--paper);
		font-weight: 500;
	}
	.pj-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 1.2cqw;
		position: relative;
	}
	h2 {
		font-size: 2.15em;
		line-height: 1.05;
	}
	.big {
		font-family: var(--f-display);
		font-size: 3.8em;
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.big small {
		font-size: 0.4em;
		color: var(--muted);
	}
	.disp {
		font-family: var(--f-display);
	}
	.mono {
		font-family: var(--f-mono);
		font-size: 0.9em;
	}
	.lead {
		color: var(--paper);
		font-size: 1.12em;
		max-width: 54ch;
	}
	.paper {
		color: var(--paper);
	}
	.sm {
		font-size: 0.78em;
	}
	.right {
		text-align: right;
	}
	.ell {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.row {
		display: flex;
		gap: 1.6cqw;
		min-height: 0;
	}
	.row.center {
		align-items: center;
	}
	.row.base {
		align-items: baseline;
	}
	.col {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.grow {
		flex: 1;
		min-width: 0;
	}
	.side {
		flex: 0 0 28%;
		gap: 1cqw;
		justify-content: center;
	}
	.split {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2cqw;
	}
	.card {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.6em;
		padding: 0.9em 1em;
		min-width: 0;
	}
	.bubble {
		position: relative;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.8em;
		padding: 0.9em 1.1em;
		color: var(--paper);
		animation: sala-rise 0.6s ease both;
	}
	.who {
		font-family: var(--f-mono);
		font-size: 0.72em;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brass);
		display: block;
		margin-bottom: 0.35em;
	}
	.g2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6em;
	}

	/* Lobby */
	.radar {
		position: relative;
		flex: 0 0 38%;
		aspect-ratio: 1;
		max-height: 100%;
	}
	.radar svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.sweep {
		transform-origin: 50% 50%;
		animation: sala-spin 5s linear infinite;
	}
	.qr {
		position: absolute;
		inset: 27%;
		background: var(--paper);
		border-radius: 0.5em;
		padding: 0.5em;
		box-shadow: 0 0 0 0.3em var(--stage);
	}
	.qr :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
	.cadet {
		opacity: 0;
		transform: scale(0.2);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.4s,
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.cadet.on {
		opacity: 1;
		transform: scale(1);
	}
	.url {
		font-family: var(--f-mono);
		color: var(--paper);
		font-size: 1.25em;
	}
	.url b {
		color: var(--brass);
		font-weight: 500;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4em;
	}
	.chip {
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 0.15em 0.7em;
		font-size: 0.8em;
		color: var(--muted);
	}

	/* Gremios y mentores */
	.guilds {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.1cqw;
		flex: 1;
		min-height: 0;
	}
	.guild {
		position: relative;
		border-radius: 0.6em;
		overflow: hidden;
		border: 1px solid var(--line);
		background-size: cover;
		background-position: center 30%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: 0;
	}
	.guild::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			transparent 10%,
			color-mix(in srgb, var(--ink) 94%, transparent) 70%
		);
	}
	.guild > div {
		position: relative;
		padding: 0.9em;
	}
	.guild h3 {
		font-size: 1.25em;
	}
	.guild .cnt {
		font-family: var(--f-display);
		font-size: 2.5em;
		font-weight: 700;
		line-height: 1;
	}
	.mentors {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.1cqw;
		flex: 0 0 26%;
	}
	.mcard {
		display: flex;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.6em;
		overflow: hidden;
		min-height: 0;
	}
	.mimg {
		flex: 0 0 42%;
		background-size: cover;
		background-position: center 15%;
	}
	.mtxt {
		flex: 1;
		min-width: 0;
		padding: 0.6em 0.8em;
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		justify-content: center;
	}
	.mtxt b {
		font-size: 0.95em;
		line-height: 1.15;
	}
	.mtxt span:last-child {
		font-size: 0.75em;
		color: var(--muted);
	}
	.mcnt {
		font-family: var(--f-display);
		font-size: 1.9em;
		font-weight: 700;
		line-height: 1;
	}

	/* Votación */
	.vgrid {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		grid-auto-rows: minmax(0, 1fr);
		gap: 1.4cqw;
		min-height: 0;
	}
	.vfold {
		display: flex;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.7em;
		overflow: hidden;
		min-height: 0;
	}
	.vimg {
		flex: 0 0 40%;
		background-size: cover;
		background-position: center 12%;
		position: relative;
	}
	.vimg span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1.6em 0.8em 0.6em;
		background: linear-gradient(transparent, color-mix(in srgb, var(--ink) 92%, transparent));
		font-size: 0.85em;
		color: var(--paper);
	}
	.vimg b {
		display: block;
		font-family: var(--f-display);
		font-size: 1.25em;
	}
	.vbody {
		flex: 1;
		min-width: 0;
		padding: 1.1em 1.2em;
		display: flex;
		flex-direction: column;
		gap: 0.55em;
	}
	.vbody .t {
		font-family: var(--f-display);
		font-size: 1.7em;
		font-weight: 600;
		line-height: 1.05;
	}
	.vbody .desc {
		font-size: 1.02em;
		color: var(--paper);
		line-height: 1.35;
	}
	.vcnt {
		font-family: var(--f-display);
		font-size: 3.4em;
		font-weight: 700;
		line-height: 1;
		margin-top: auto;
		font-variant-numeric: tabular-nums;
	}
	.vgrid.many .vbody .t {
		font-size: 1.2em;
	}
	.vgrid.many .vbody .desc {
		display: none;
	}
	.vgrid.many .vcnt {
		font-size: 2.2em;
	}
	.vgrid.many .vbody {
		padding: 0.7em 0.8em;
	}
	.pool {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.7cqw;
	}
	.pchip {
		border: 1px solid var(--line);
		border-radius: 0.45em;
		padding: 0.45em 0.6em;
		font-size: 0.78em;
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		min-width: 0;
	}
	.pchip b {
		font-weight: 600;
		color: var(--paper);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.pchip span {
		font-family: var(--f-mono);
		font-size: 0.85em;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.pchip.open {
		border-color: var(--brass);
	}
	.pchip.open span {
		color: var(--brass);
	}
	.pchip.closed {
		opacity: 0.6;
	}
	.pchip.closed span {
		color: var(--muted);
	}
	.pchip.locked {
		border-style: dashed;
	}
	.pchip.locked b,
	.pchip.locked span {
		color: var(--faint);
	}

	/* Caso */
	.stamp {
		display: inline-block;
		vertical-align: middle;
		margin-left: 0.8em;
		font-family: var(--f-display);
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--brass-hi);
		border: 0.15em solid var(--brass-hi);
		border-radius: 0.3em;
		padding: 0.1em 0.5em;
		font-size: 0.42em;
		white-space: nowrap;
		animation: sala-stamp 0.55s ease 0.2s both;
	}
	.ficha {
		display: grid;
		gap: 0.7cqw;
	}
	.ficha div {
		border-left: 2px solid var(--brass);
		padding: 0.15em 0 0.15em 0.7em;
		font-size: 0.85em;
		color: var(--muted);
	}
	.ficha b {
		color: var(--paper);
		font-weight: 600;
		display: block;
	}
	.optgrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.8cqw;
	}
	.popt {
		display: flex;
		gap: 0.7em;
		align-items: flex-start;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.5em;
		padding: 0.7em 0.8em;
		font-size: 0.95em;
		line-height: 1.3;
	}

	/* Espejo */
	.mrow {
		display: grid;
		grid-template-columns: 2em minmax(0, 1fr) 3em 4.4em;
		gap: 0.7em;
		align-items: center;
		font-size: 0.92em;
	}
	.stack {
		display: flex;
		height: 1.25em;
		border-radius: 0.3em;
		overflow: hidden;
		background: var(--panel-2);
	}
	.stack i {
		display: block;
		height: 100%;
	}
	.confdots {
		display: flex;
		gap: 0.18em;
	}
	.confdots i {
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background: var(--line);
	}
	.confdots i.on {
		background: var(--steel);
	}
	.quote {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 0.6em;
		padding: 0.7em 0.9em;
		font-size: 0.9em;
		color: var(--paper);
		display: flex;
		flex-direction: column;
		gap: 0.3em;
	}
	.quote small {
		font-family: var(--f-mono);
		font-size: 0.78em;
		color: var(--muted);
		display: flex;
		align-items: center;
		gap: 0.4em;
	}
	.letter.mini {
		width: 1.4em;
		height: 1.4em;
		font-size: 0.95em;
	}

	/* Revelación */
	.delib {
		display: grid;
		grid-template-columns: 1fr 3.4em 1fr 3.8em;
		gap: 0.5em;
		align-items: center;
		margin-top: 0.45em;
		font-size: 0.88em;
	}
	.delib.first > span:first-child {
		color: var(--brass-hi);
		font-weight: 600;
	}

	/* Consecuencias */
	.alloc {
		display: flex;
		height: 0.6em;
		margin-top: 0.4em;
		border-radius: 0.2em;
		overflow: hidden;
		background: var(--panel-2);
	}
	.alloc i {
		display: block;
		height: 100%;
	}

	/* Integración */
	.wall {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1cqw;
		align-content: start;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	/* Cierre */
	.podiums {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.2cqw;
	}
	.podium {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		align-items: flex-start;
		animation: medal 0.8s ease both;
	}
	@keyframes medal {
		from {
			transform: rotateY(90deg) scale(0.6);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	svg text {
		font-family: var(--f-mono);
	}
</style>
