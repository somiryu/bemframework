<script lang="ts">
	import { onMount } from 'svelte';
	import Portrait from './Portrait.svelte';
	import RankBadge from './RankBadge.svelte';
	import LineChart from './LineChart.svelte';
	import { createStageClock } from './stage.svelte';
	import { createTallerLive } from '$lib/utils/tallerLive.svelte';
	import {
		GUILDS,
		CABECERA,
		MENTORS,
		RANKS,
		BUDGET,
		EXP0_MENTOR,
		BUDGET_MENTOR,
		CLOSE_MENTOR,
		OPTION_LETTERS as L,
		type CabeceraKey,
		type GuildId,
		type MentorKey
	} from '$lib/content/talleres/salaDeCrisis';

	// Vista privada del cadete en su celular.
	let { code, initialView }: { code: string; initialView: any } = $props();

	// svelte-ignore state_referenced_locally
	const live = createTallerLive<any>(code, initialView, 'participant');
	onMount(() => live.start());

	const view = $derived(live.view);
	const me = $derived(view.me);
	const d = $derived(view.data ?? {});
	const clock = createStageClock(() => live.view);
	const G = Object.fromEntries(GUILDS.map((g) => [g.id, g]));
	const fam = (id: GuildId | null | undefined) => (id ? `var(--${G[id].fam})` : 'var(--steel)');
	const pct = (v: number) => `${Math.round(v * 100)}%`;
	const EL = (i: number) => String.fromCharCode(65 + i);
	const myMentor = $derived((me.mentor ?? 'sara') as CabeceraKey);
	const countdownStages = ['exp0r', 'reveal', 'budgetr'];
	const waitingReveal = $derived(countdownStages.includes(view.stage) && !clock.revealed);

	// --- Borradores locales (se reinician al cambiar de fase) -----------------
	let exp0Draft = $state(62);
	let v1 = $state<number | null>(null);
	let conf = $state<number | null>(null);
	let why = $state('');
	let v2 = $state<number | null>(null);
	let budget = $state<Record<'a' | 'b' | 'c' | 'd', number>>({ a: 0, b: 0, c: 0, d: 0 });
	let integ = $state('');
	let editing = $state(false);
	let sending = $state(false);
	let showPts = $state(false);
	let changing = $state<null | 'guild' | 'mentor'>(null);
	let toast = $state<number | null>(null);

	let lastStep = -1;
	$effect(() => {
		const step = view.state.step;
		if (step === lastStep) return;
		lastStep = step;
		const m = view.data?.mine;
		v1 = m?.v1 ?? null;
		conf = m?.conf ?? null;
		why = m?.why ?? '';
		v2 = view.stage === 'mirror' ? (m?.v2 ?? m?.v1 ?? null) : null;
		if (view.stage === 'exp0' && Number.isInteger(m)) exp0Draft = m;
		if (view.stage === 'budget' && m) budget = { ...m };
		if (view.stage === 'integ') integ = m ?? '';
		editing = false;
		changing = null;
		if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	// Al terminar la cuenta regresiva, se pide la vista fresca para que la XP ya cuente.
	let refreshedFor = -1;
	$effect(() => {
		if (
			countdownStages.includes(view.stage) &&
			clock.revealed &&
			refreshedFor !== view.state.step
		) {
			refreshedFor = view.state.step;
			live.refresh();
		}
	});

	// Ceremonia de rango: aparece cuando el rango sube.
	// svelte-ignore state_referenced_locally
	let lastRank = initialView.me.rank;
	$effect(() => {
		const r = me.rank;
		if (r > lastRank && RANKS[r].unlock) {
			toast = r;
			setTimeout(() => (toast = null), 5500);
		}
		lastRank = r;
	});

	async function send(body: Record<string, unknown>) {
		sending = true;
		let ok = false;
		try {
			ok = await live.post(body);
		} finally {
			sending = false;
		}
		if (ok) {
			editing = false;
			changing = null;
		}
		return ok;
	}
	const answer = (slot: string, extra: Record<string, unknown> = {}) =>
		send({ type: 'answer', slot, ...extra });

	const used = $derived(budget.a + budget.b + budget.c + budget.d);
	function bump(k: 'a' | 'b' | 'c' | 'd', delta: number) {
		const next = budget[k] + delta;
		if (next < 0 || (delta > 0 && used >= 10)) return;
		budget = { ...budget, [k]: next };
	}

	const nextRank = $derived(RANKS[me.rank + 1] ?? null);
	const rankProgress = $derived(
		nextRank ? (me.xp - RANKS[me.rank].min) / (nextRank.min - RANKS[me.rank].min) : 1
	);
</script>

<div class="phone">
	<header class="status">
		<div class="who">
			{#if me.guild}<span class="dot" style="background:{fam(me.guild)}"></span>{/if}
			<b>{me.alias ?? 'Cadete'}</b>
			{#if me.mentor}<Portrait mentor={me.mentor} size="22px" ring={false} />{/if}
		</div>
		<button
			class="ptsbtn"
			type="button"
			aria-expanded={showPts}
			onclick={() => (showPts = !showPts)}
		>
			{RANKS[me.rank].name}
			{showPts ? '▴' : '▾'}<br /><span>{me.xp} XP · mis puntos</span>
		</button>
	</header>

	{#if showPts}
		<div class="ptspanel" role="dialog" aria-label="Mis puntos">
			<div class="row" style="gap:12px; align-items:center">
				<RankBadge rank={me.rank} size={48} />
				<div style="flex:1">
					<h4>XP · experiencia</h4>
					<div class="xp">{me.xp}</div>
					<span class="faint" style="font-size:11.5px">Nunca se pierde.</span>
				</div>
			</div>
			<div>
				<div class="ln">
					<span>Rango {RANKS[me.rank].name}</span><span
						>{nextRank ? `${nextRank.name} en ${nextRank.min} XP` : 'Rango máximo'}</span
					>
				</div>
				<div class="bar" style="height:7px; margin-top:5px">
					<i style="width:{rankProgress * 100}%"></i>
				</div>
				{#if nextRank}<div class="muted" style="font-size:11.5px; margin-top:4px">
						Desbloquea: {nextRank.unlock}
					</div>{/if}
			</div>
			<h4>De dónde viene tu XP</h4>
			{#each me.breakdown as b, i (i)}<div class="ln">
					<span>{b.label}</span><b>+{b.xp}</b>
				</div>{:else}<div class="ln">
					<span>Todavía nada. La primera XP llega al revelar el expediente 0.</span>
				</div>{/each}
			<h4>Marcadores</h4>
			<div class="ln">
				<span>Calibración<br /><small>tu seguridad frente a tu acierto</small></span><b
					>{me.markers.cal ?? '—'}</b
				>
			</div>
			<div class="ln">
				<span>Deliberación<br /><small>veces que la sala te acercó a la respuesta</small></span><b
					>{me.markers.moved} de {me.markers.wrong}</b
				>
			</div>
			<div class="ln">
				<span>Argumentos aportados<br /><small>frases que leyó tu gremio</small></span><b
					>{me.markers.args}</b
				>
			</div>
			<button class="ghost" type="button" onclick={() => (showPts = false)}>Cerrar</button>
		</div>
	{/if}

	<main class="body">
		{#if live.error}<p class="error" role="alert">{live.error}</p>{/if}

		{#if view.stage === 'lobby'}
			<div class="waiting">
				<Portrait mentor="giochi" size="96px" />
				<h3>Estás en el radar</h3>
				<p class="muted">Bip-bop. Mira la pantalla: el facilitador abrirá la sala en un momento.</p>
			</div>
		{:else if !me.guild || changing === 'guild'}
			<span class="eyebrow">Paso 1 de 2</span>
			<h3>Elige tu gremio</h3>
			<p class="muted">Deliberarás con él después de cada caso.</p>
			{#each GUILDS as g (g.id)}
				<button
					class="opt guildopt"
					type="button"
					disabled={sending}
					onclick={() => send({ type: 'profile', guild: g.id })}
				>
					<span class="gimg" style="background-image:url('{g.img}')"></span>
					<span class="gtxt"
						><b>{g.name}</b><span class="muted">{g.motive}</span><span
							class="gbar"
							style="background:var(--{g.fam})"
						></span></span
					>
				</button>
			{/each}
		{:else if !me.mentor || changing === 'mentor'}
			<span class="eyebrow">Paso 2 de 2</span>
			<h3>Elige a tu mentor de cabecera</h3>
			<p class="muted">Te hablará después de cada caso, con su propia mirada.</p>
			{#each CABECERA as k (k)}
				<button
					class="opt"
					type="button"
					style="align-items:center"
					disabled={sending}
					onclick={() => send({ type: 'profile', mentor: k })}
				>
					<Portrait mentor={k} size="52px" ring={false} />
					<span
						><b>{MENTORS[k].name}</b><br /><span class="role">{MENTORS[k].role}</span><br /><span
							class="muted">{MENTORS[k].desc}</span
						></span
					>
				</button>
			{/each}
		{:else if view.stage === 'guild'}
			<div class="waiting">
				<Portrait mentor={me.mentor} size="96px" />
				<h3>Gremio {G[me.guild].name}</h3>
				<p class="muted">
					{MENTORS[me.mentor as MentorKey].name} será tu mentor de cabecera. Mira cómo se reparte la sala.
				</p>
				<button class="ghost" type="button" onclick={() => (changing = 'guild')}
					>Cambiar de gremio</button
				>
				<button class="ghost" type="button" onclick={() => (changing = 'mentor')}
					>Cambiar de mentor</button
				>
			</div>
		{:else if view.stage === 'exp0'}
			{#if d.mine == null || editing}
				<span class="eyebrow">Expediente 0 · Termómetro</span>
				<h3>La app que funcionó</h3>
				<p class="muted">
					Puntos por sesión, medallas semanales y ranking global. En el primer mes, las sesiones
					diarias se duplicaron.
				</p>
				<label for="exp0" class="eyebrow faint">¿Qué tan exitoso fue el diseño?</label>
				<div class="row" style="justify-content:space-between; align-items:baseline">
					<span class="muted sm">Fracaso</span><b class="disp big">{exp0Draft}</b><span
						class="muted sm">Éxito total</span
					>
				</div>
				<input id="exp0" type="range" min="0" max="100" bind:value={exp0Draft} />
				<p class="muted sm">No hay respuesta correcta. Es tu lectura.</p>
				<button
					class="cta"
					type="button"
					disabled={sending}
					onclick={() => answer('exp0', { value: exp0Draft })}>Enviar</button
				>
			{:else}
				<div class="waiting">
					<Portrait mentor="giochi" size="96px" />
					<h3>Respuesta enviada: {d.mine}</h3>
					<p class="muted">El facilitador revelará lo que pensó la sala.</p>
					<button class="ghost" type="button" onclick={() => (editing = true)}
						>Cambiar mi respuesta</button
					>
				</div>
			{/if}
		{:else if view.stage === 'exp0r'}
			{#if waitingReveal}
				<div class="waiting">
					<Portrait mentor="giochi" size="96px" />
					<h3>Mira la pantalla</h3>
					<p class="muted">Algo pasó en el mes 3…</p>
				</div>
			{:else}
				<span class="eyebrow">El giro</span>
				<h3>En el mes 3 cayó por debajo del inicio</h3>
				<div class="card">
					<div class="ln"><span>Tu lectura</span><b class="brass">{d.mine ?? '—'}</b></div>
					<div class="ln"><span>Tu gremio</span><b>{d.guild ?? '—'}</b></div>
					<div class="ln"><span>Toda la sala</span><b>{d.room ?? '—'}</b></div>
				</div>
				<p class="muted">
					{d.mine != null && d.mine >= 60
						? 'Pensaste como la mayoría: un mes de números altos parece éxito. Ese es el atractivo del barniz de puntos, medallas y ranking.'
						: 'Desconfiaste del primer mes. Hoy vas a poder nombrar por qué.'}
				</p>
				{@render mentorSay(EXP0_MENTOR[myMentor], myMentor)}
				{#if d.mine != null}<div class="pe"><span>XP · experiencia</span><b>+10</b></div>{/if}
			{/if}
		{:else if view.stage === 'vote'}
			<span class="eyebrow">Ronda {view.round + 1} · Votación</span>
			<h3>¿Qué expediente abre la sala?</h3>
			<p class="muted">
				Gana la mayoría y toda la sala juega el mismo. Puedes cambiar tu voto hasta que cierre.
			</p>
			{#each d.options as id, i (id)}
				{@const e = d.expedientes.find((x: any) => x.id === id)}
				<button
					class="catcard"
					class:sel={d.mine === id}
					type="button"
					disabled={sending}
					onclick={() => answer('vote', { exp: id })}
				>
					<span class="cimg" style="background-image:url('{MENTORS[e.mentor as MentorKey].img}')"
					></span>
					<span class="ctxt">
						<span class="k">EXP · {EL(i)} · caso {e.caseNo} de {e.total}</span>
						<b>{e.name}</b>
						<span class="muted">{e.teaser}</span>
						<span class="faint sm">Lo presenta {MENTORS[e.mentor as MentorKey].name}</span>
					</span>
					{#if d.mine === id}<span class="tag ok voted">Tu voto</span>{/if}
				</button>
			{/each}
			<span class="eyebrow faint">Todos los expedientes</span>
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
			<span class="eyebrow"
				>Ronda {view.round + 1} · {d.tie
					? 'Empate: ganó por la moneda de GIOCHI'
					: d.votedWinner
						? 'La sala votó como tú'
						: 'Lo eligió la sala'} · caso {cs.idx + 1} de {cs.total}</span
			>
			<h3>{cs.title}</h3>
			{@render mentorSay(cs.setup, cs.exp.mentor)}
			<details class="card" open>
				<summary>Ficha del caso</summary>
				{#each cs.ficha as f, i (i)}<div class="fic"><b>{f[0]}</b>{f[1]}</div>{/each}
			</details>
			{#if d.hint}<div class="card hint">
					{@render mentorSay(`Pista: ${d.hint}`, myMentor)}
				</div>{/if}
			{#if d.mine.v1 != null && !editing}
				<div class="card">
					<span class="eyebrow">Tu respuesta</span>
					<p class="paper"><b>{L[d.mine.v1]}.</b> {cs.options[d.mine.v1]}</p>
					<p class="muted sm">Seguridad {d.mine.conf}{d.mine.why ? ` · «${d.mine.why}»` : ''}</p>
				</div>
				<p class="muted">
					Cuando el facilitador muestre el espejo verás cómo pensó la sala y podrás votar de nuevo.
				</p>
				<button class="ghost" type="button" onclick={() => (editing = true)}
					>Cambiar mi respuesta</button
				>
			{:else}
				<b class="q">{cs.q}</b>
				{#each cs.options as o, i (i)}
					<button class="opt" class:sel={v1 === i} type="button" onclick={() => (v1 = i)}
						><span class="letter">{L[i]}</span><span>{o}</span></button
					>
				{/each}
				<span class="eyebrow">¿Qué tan seguro estás?</span>
				<div class="bets">
					{#each [1, 3, 5] as k (k)}
						{@const locked = k === 5 && !me.canFive}
						<button
							class="bet"
							class:sel={conf === k}
							class:locked
							type="button"
							aria-disabled={locked}
							onclick={() => !locked && (conf = k)}
						>
							<b>{locked ? '🔒' : k}</b>
							<small
								>{k === 1
									? 'Lo intuyo'
									: k === 3
										? 'Bastante'
										: locked
											? 'Rango Analista'
											: 'Seguro'}</small
							>
						</button>
					{/each}
				</div>
				<label for="why" class="eyebrow faint">¿Por qué? Una frase, opcional (+2 XP)</label>
				<input
					id="why"
					class="field"
					maxlength="160"
					placeholder="Tu argumento para el gremio"
					bind:value={why}
				/>
				<button
					class="cta"
					type="button"
					disabled={v1 == null || !conf || sending}
					onclick={() => answer('v1', { option: v1, conf, why })}
				>
					{sending ? 'Enviando…' : 'Enviar respuesta'}
				</button>
			{/if}
		{:else if view.stage === 'mirror'}
			{@const cs = d.case}
			{#if d.mine.v1 == null}
				<span class="eyebrow">Espejo de la sala</span>
				<h3>No alcanzaste a responder</h3>
				<p class="muted">
					Mira en la pantalla cómo respondió la sala y escucha a tu gremio. En la revelación verás
					la respuesta.
				</p>
				{@render dist(d.room, -1, 'Toda la sala')}
			{:else}
				{@const same = d.guild[d.mine.v1] - 1}
				<span class="eyebrow">Espejo de la sala · todavía sin respuesta correcta</span>
				<h3>
					{same > 0
						? `${same} de tu gremio pensaron como tú`
						: 'Nadie más de tu gremio eligió lo mismo'}
				</h3>
				{@render dist(d.guild, d.mine.v1, `Gremio ${G[me.guild].name}`)}
				{@render dist(d.room, d.mine.v1, 'Toda la sala')}
				<span class="eyebrow">Argumentos de quienes eligieron distinto</span>
				{#each d.args as a, i (i)}
					{#if i !== d.mine.v1 && a.quotes.length}
						<div class="card quote">
							<span class="eyebrow faint">Quienes eligieron {L[i]} dicen</span>
							{#each a.quotes as q, j (j)}<p class="paper">«{q.text}»</p>{/each}
						</div>
					{/if}
				{/each}
				<div class="card revote">
					<b>Delibera con tu gremio y vota de nuevo</b>
					<p class="muted sm">
						Puedes mantener tu respuesta o cambiarla. Cambiar de opinión no resta nada.
					</p>
					{#each cs.options as o, i (i)}
						<button class="opt" class:sel={v2 === i} type="button" onclick={() => (v2 = i)}
							><span class="letter">{L[i]}</span><span>{o}</span></button
						>
					{/each}
					<button
						class="cta"
						type="button"
						disabled={v2 == null || sending}
						onclick={() => answer('v2', { option: v2 })}
					>
						{d.mine.v2 != null && d.mine.v2 === v2
							? 'Voto enviado ✓'
							: v2 === d.mine.v1
								? `Mantengo ${L[d.mine.v1]}`
								: `Cambio a ${L[v2 ?? 0]}`}
					</button>
				</div>
			{/if}
		{:else if view.stage === 'reveal'}
			{@const cs = d.case}
			{@const s = d.summary}
			{@const c = cs.correct}
			{#if waitingReveal}
				<div class="waiting">
					<Portrait mentor={cs.exp.mentor} size="96px" />
					<h3>Revelando…</h3>
					<p class="muted">Mira la pantalla.</p>
				</div>
			{:else}
				<span class="eyebrow">Revelación · ronda {view.round + 1}</span>
				<h3>{L[c]}. {cs.options[c]}</h3>
				{#if d.answer.v1 == null}
					{@render mentorSay(cs.explain, cs.exp.mentor)}
					<p class="muted">No enviaste respuesta en esta ronda.</p>
				{:else}
					{@const a = d.answer}
					{@const fin = a.v2 ?? a.v1}
					{@const ok = fin === c}
					{@const changed = fin !== a.v1}
					{@const gr = s.guilds[me.guild]}
					<div class="card">
						<div class="row" style="gap:8px; align-items:center">
							<span class="tag {ok ? 'ok' : 'rev'}">{ok ? 'Acierto' : 'A revisar'}</span><span
								class="muted sm">tu recorrido</span
							>
						</div>
						<svg viewBox="0 0 300 52" width="100%" aria-hidden="true">
							<line
								x1="40"
								y1="26"
								x2="260"
								y2="26"
								stroke="var(--line)"
								stroke-width="2"
								stroke-dasharray="4 4"
							/>
							<path
								d="M40 26 L260 26"
								stroke={ok ? 'var(--brass)' : 'var(--steel)'}
								stroke-width="2.5"
								pathLength="1"
								class="drawp"
								style="--d:.3s"
							/>
							<circle
								cx="40"
								cy="26"
								r="16"
								fill="var(--panel-2)"
								stroke={a.v1 === c ? 'var(--brass)' : 'var(--steel)'}
								stroke-width="2"
							/>
							<text
								x="40"
								y="31"
								text-anchor="middle"
								font-size="14"
								font-weight="700"
								fill="var(--paper)">{L[a.v1]}</text
							>
							<circle
								class="popin"
								style="--d:1.6s"
								cx="260"
								cy="26"
								r="16"
								fill={ok ? 'var(--brass)' : 'var(--panel-2)'}
								stroke={ok ? 'var(--brass-hi)' : 'var(--steel)'}
								stroke-width="2"
							/>
							<text
								x="260"
								y="31"
								text-anchor="middle"
								font-size="14"
								font-weight="700"
								fill={ok ? 'var(--ink)' : 'var(--paper)'}>{L[fin]}</text
							>
							<text x="150" y="14" text-anchor="middle" font-size="9" fill="var(--muted)"
								>{changed ? 'cambiaste' : 'mantuviste'}</text
							>
							<text x="40" y="50" text-anchor="middle" font-size="8" fill="var(--faint)"
								>1er voto · seg. {a.conf}</text
							>
							<text x="260" y="50" text-anchor="middle" font-size="8" fill="var(--faint)"
								>2.º voto</text
							>
						</svg>
						<p class="paper sm">
							{#if changed}
								{ok
									? `Cambiaste de ${L[a.v1]} a ${L[fin]} después de escuchar a la sala, y acertaste. Eso es deliberar.`
									: `Cambiaste de ${L[a.v1]} a ${L[fin]}. Esta vez la sala te alejó de la respuesta: pasa, y es información.`}
							{:else}
								{ok
									? `Mantuviste ${L[fin]} y era la respuesta.`
									: `Mantuviste ${L[fin]}. La respuesta era ${L[c]}.`}
							{/if}
						</p>
					</div>
					<div class="card">
						<span class="eyebrow faint">Lo que hizo la sala</span>
						{#if gr}<div class="ln">
								<span>Tu gremio acertó</span><b>{pct(gr.a1)} → {pct(gr.a2)}</b>
							</div>{/if}
						<div class="ln">
							<span>Toda la sala acertó</span><b
								>{pct(s.v1[c] / Math.max(1, s.n))} → {pct(s.v2[c] / Math.max(1, s.n))}</b
							>
						</div>
						{#if s.best === me.guild}
							<p class="brass sm">Tu gremio fue el que mejor deliberó: +4 XP para cada miembro.</p>
						{:else if s.best}
							<p class="muted sm">Mejor deliberación: gremio {G[s.best].name}.</p>
						{/if}
						{#if !ok}<p class="muted sm">
								{s.n - s.v2[c] - 1 > 0
									? `${s.n - s.v2[c] - 1} cadetes más tampoco llegaron a ${L[c]}.`
									: ''} Es justo el punto que vale revisar.
							</p>{/if}
					</div>
					{@render mentorSay(cs.explain, cs.exp.mentor)}
					{@render mentorSay(d.mentorLine, myMentor)}
					<p class="sm">
						<b class="paper">Para el próximo caso:</b> <span class="muted">{cs.next}</span>
					</p>
					<div class="card">
						<span class="eyebrow">XP de esta ronda</span>
						{#each d.lines as l, i (i)}<div class="ln">
								<span class="muted">{l[0]}</span><b>+{l[1]}</b>
							</div>{/each}
						<div class="pe">
							<span>Total</span><b
								>+{d.lines.reduce((acc: number, l: [string, number]) => acc + l[1], 0)}</b
							>
						</div>
					</div>
				{/if}
			{/if}
		{:else if view.stage === 'budget'}
			{#if d.mine && !editing}
				<div class="waiting">
					<Portrait mentor="wilkins" size="96px" />
					<h3>Propuesta enviada</h3>
					<p class="muted">
						Tu gremio {G[me.guild].name} está decidiendo. Las consecuencias se verán en pantalla.
					</p>
					<button class="ghost" type="button" onclick={() => (editing = true)}
						>Cambiar mi propuesta</button
					>
				</div>
			{:else}
				<span class="eyebrow">Gremio {G[me.guild].name} · Reparación</span>
				<h3>Reparte 10 Puntos de Recurso</h3>
				<p class="muted">
					Conversa con tu gremio. La propuesta del gremio será el promedio de todos.
				</p>
				{#each BUDGET as b (b.id)}
					<div class="card stepper">
						<span>{b.name}</span>
						<button
							class="bet sq"
							type="button"
							aria-label="Quitar a {b.name}"
							onclick={() => bump(b.id, -1)}>−</button
						>
						<b class="disp">{budget[b.id]}</b>
						<button
							class="bet sq"
							type="button"
							aria-label="Agregar a {b.name}"
							disabled={used >= 10}
							onclick={() => bump(b.id, 1)}>+</button
						>
					</div>
				{/each}
				<div class="pe"><span>Disponibles</span><b>{10 - used}</b></div>
				<button
					class="cta"
					type="button"
					disabled={used !== 10 || sending}
					onclick={() =>
						answer('budget', { budget: [budget.a, budget.b, budget.c, budget.d].join(',') })}
					>Enviar propuesta</button
				>
			{/if}
		{:else if view.stage === 'budgetr'}
			{#if waitingReveal}
				<div class="waiting">
					<Portrait mentor="wilkins" size="96px" />
					<h3>Pasan cuatro meses…</h3>
					<p class="muted">Mira la pantalla.</p>
				</div>
			{:else if d.guild?.curve}
				<span class="eyebrow">Consecuencias</span>
				<h3>Tu gremio en el mes 4: {Math.round(d.guild.curve[3])}</h3>
				<div class="card chart">
					<LineChart
						labels={['0', 'M1', 'M2', 'M3', 'M4']}
						w={330}
						h={200}
						right={64}
						series={[
							{ values: [100, ...d.guild.curve], color: fam(me.guild), label: 'Gremio' },
							...(d.mineCurve
								? [
										{
											values: [100, ...d.mineCurve],
											color: 'var(--paper)',
											label: 'Tú',
											dash: true,
											width: 1.8
										}
									]
								: [])
						]}
					/>
				</div>
				<p class="muted">
					{d.mineCurve
						? d.mineCurve[3] > d.guild.curve[3]
							? 'Tu propuesta sola habría sostenido más que la del gremio. Vale la pena contarles por qué.'
							: 'La propuesta del gremio sostuvo mejor o igual que la tuya. Pregunta qué vieron los demás.'
						: 'No enviaste propuesta: la curva es la de tu gremio.'}
				</p>
				{@render mentorSay(BUDGET_MENTOR[myMentor], myMentor)}
				{#if d.mine}<div class="pe"><span>XP · experiencia</span><b>+10</b></div>{/if}
			{:else}
				<h3>Tu gremio no envió propuesta</h3>
				<p class="muted">Mira en la pantalla las curvas de los demás gremios.</p>
			{/if}
		{:else if view.stage === 'integ'}
			{#if d.mine && !editing}
				<div class="waiting">
					<Portrait mentor="kira" size="96px" />
					<h3>Enviado de forma anónima</h3>
					<p class="muted">Tu frase aparece en la pantalla con las de los demás.</p>
					<button class="ghost" type="button" onclick={() => (editing = true)}
						>Editar mi frase</button
					>
				</div>
			{:else}
				<span class="eyebrow">Integración</span>
				<h3>¿Qué cambiarías mañana en tu clase o tu trabajo?</h3>
				{@render mentorSay(
					'Una sola frase, concreta. Lo descubierto que no se aplica se evapora.',
					'kira'
				)}
				<label for="integ" class="eyebrow faint">Tu cambio</label>
				<textarea
					id="integ"
					class="field"
					maxlength="200"
					placeholder="Ej. Quitar el ranking global del curso"
					bind:value={integ}
				></textarea>
				<button
					class="cta"
					type="button"
					disabled={!integ.trim() || sending}
					onclick={() => answer('integ', { text: integ })}>Enviar</button
				>
			{/if}
		{:else if view.stage === 'close'}
			{@const traj = d.trajectory ?? []}
			{@const changedOk = traj.filter((t: any) => t.v2 !== t.v1 && t.v2 === t.correct).length}
			{@const heldOk = traj.filter((t: any) => t.v2 === t.v1 && t.v2 === t.correct).length}
			<span class="eyebrow">Ceremonia de cierre</span>
			<div class="card row" style="align-items:center; gap:14px">
				<RankBadge rank={me.rank} size={72} />
				<div>
					<h3>Rango {RANKS[me.rank].name}</h3>
					<p class="muted">{me.xp} XP · nunca se pierden</p>
				</div>
			</div>
			<div class="card">
				<span class="eyebrow">Tu recorrido</span>
				{#if traj.length}
					<svg viewBox="0 0 300 {30 + traj.length * 46}" width="100%" aria-hidden="true">
						{#each traj as t, i (t.round)}
							{@const yy = 24 + i * 46}
							{@const ok = t.v2 === t.correct}
							<text x="0" y={yy - 10} font-size="9" fill="var(--muted)"
								>R{t.round + 1} · {t.title}</text
							>
							<line
								x1="20"
								y1={yy + 6}
								x2="150"
								y2={yy + 6}
								stroke={ok ? 'var(--brass)' : 'var(--steel)'}
								stroke-width="2"
								pathLength="1"
								class="drawp"
								style="--d:{0.3 + i * 0.2}s"
							/>
							<circle cx="20" cy={yy + 6} r="10" fill="var(--panel-2)" stroke="var(--steel)" />
							<text x="20" y={yy + 10} text-anchor="middle" font-size="10" fill="var(--paper)"
								>{L[t.v1]}</text
							>
							<circle
								class="popin"
								style="--d:{0.9 + i * 0.2}s"
								cx="150"
								cy={yy + 6}
								r="10"
								fill={ok ? 'var(--brass)' : 'var(--panel-2)'}
								stroke={ok ? 'var(--brass-hi)' : 'var(--steel)'}
							/>
							<text
								x="150"
								y={yy + 10}
								text-anchor="middle"
								font-size="10"
								fill={ok ? 'var(--ink)' : 'var(--paper)'}>{L[t.v2]}</text
							>
							<text x="172" y={yy + 10} font-size="9" fill="var(--muted)"
								>seguridad {t.conf} · {t.v2 !== t.v1 ? 'cambió' : 'mantuvo'}</text
							>
						{/each}
					</svg>
				{/if}
				<p class="paper">
					{changedOk
						? 'Sabes escuchar: cambiaste de opinión cuando la sala tenía mejores argumentos.'
						: traj.length && heldOk === traj.length
							? 'Sostienes tus lecturas con criterio: acertaste sin necesitar cambiar.'
							: 'Hoy exploraste más de lo que acertaste: tus marcadores muestran qué revisar primero.'}
				</p>
			</div>
			{@render mentorSay(CLOSE_MENTOR[myMentor], myMentor)}
			<div class="card">
				<div class="ln"><span>Gremio</span><b>{G[me.guild].name}</b></div>
				<div class="ln"><span>Argumentos escritos</span><b>{me.markers.args}</b></div>
				<div class="ln"><span>Calibración</span><b>{me.markers.cal ?? '—'}</b></div>
			</div>
		{/if}
	</main>

	{#if toast != null}
		<div class="toast" role="status">
			<RankBadge rank={toast} size={52} />
			<div><b>Nuevo rango: {RANKS[toast].name}</b>Desbloqueas: {RANKS[toast].unlock}</div>
		</div>
	{/if}
</div>

{#snippet mentorSay(text: string, key: MentorKey)}
	<div class="mini-m">
		<Portrait mentor={key} size="44px" ring={false} />
		<div class="say"><small>{MENTORS[key].name}</small>{text}</div>
	</div>
{/snippet}

{#snippet dist(counts: number[], mine: number, label: string)}
	{@const n = Math.max(
		1,
		counts.reduce((a, b) => a + b, 0)
	)}
	<div class="card">
		<span class="eyebrow faint">{label}</span>
		{#each counts as k, i (i)}
			<div class="mbar" class:me={i === mine}>
				<b class="disp">{L[i]}</b>
				<div class="t"><i class="growx" style="--d:{i * 0.08}s; width:{(k / n) * 100}%"></i></div>
				<span class="mono">{k}</span>
			</div>
		{/each}
	</div>
{/snippet}

<style>
	.phone {
		max-width: 520px;
		margin: 0 auto;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
		font-size: 14px;
	}
	.status {
		position: sticky;
		top: 0;
		z-index: 4;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: calc(10px + env(safe-area-inset-top, 0px)) 16px 10px;
		background: var(--stage);
		border-bottom: 1px solid var(--line);
		font-size: 12px;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
	}
	.who b {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 14px;
	}
	.ptsbtn {
		border: 1px solid var(--line);
		background: var(--panel);
		border-radius: 8px;
		padding: 4px 8px;
		font-family: var(--f-mono);
		font-size: 11px;
		color: var(--brass);
		text-align: right;
		line-height: 1.25;
	}
	.ptsbtn span {
		color: var(--muted);
	}
	.ptspanel {
		position: absolute;
		left: 10px;
		right: 10px;
		top: 62px;
		z-index: 5;
		background: var(--panel-2);
		border: 1px solid var(--brass);
		border-radius: 14px;
		padding: 13px;
		display: flex;
		flex-direction: column;
		gap: 9px;
		box-shadow: 0 18px 40px -12px #000;
		animation: sala-rise 0.3s ease both;
	}
	.ptspanel h4 {
		margin: 0;
		font-family: var(--f-mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--brass);
		font-weight: 500;
	}
	.ptspanel small {
		color: var(--faint);
		font-size: 10.5px;
	}
	.xp {
		font-family: var(--f-display);
		font-size: 30px;
		color: var(--brass);
		line-height: 1;
	}
	.body {
		flex: 1;
		padding: 16px max(16px, env(safe-area-inset-left, 0px))
			calc(28px + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.body > :global(*) {
		flex-shrink: 0;
	}
	h3 {
		font-size: 22px;
	}
	.q {
		font-size: 15px;
	}
	.sm {
		font-size: 12.5px;
	}
	.mono {
		font-family: var(--f-mono);
		text-align: right;
	}
	.disp {
		font-family: var(--f-display);
	}
	.big {
		font-size: 34px;
		color: var(--brass);
	}
	.brass {
		color: var(--brass-hi);
	}
	.paper {
		color: var(--paper);
	}
	.row {
		display: flex;
	}
	.error {
		background: color-mix(in srgb, var(--steel) 18%, transparent);
		border: 1px solid var(--steel);
		border-radius: 10px;
		padding: 10px 12px;
		color: var(--paper);
	}
	.waiting {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 12px;
		min-height: 55vh;
	}
	.card {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 13px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.card.hint,
	.card.revote {
		border-color: var(--brass);
	}
	.card.chart {
		padding: 8px;
		height: 210px;
	}
	.ln {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 13px;
	}
	.ln span {
		color: var(--muted);
	}
	.opt {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		text-align: left;
		width: 100%;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 10px 11px;
		font-size: 14px;
		line-height: 1.35;
	}
	.opt:hover {
		border-color: var(--faint);
	}
	.opt.sel {
		border-color: var(--brass);
		background: var(--panel-2);
	}
	.opt :global(.letter) {
		font-size: 13px;
		width: 24px;
		height: 24px;
	}
	.opt.sel :global(.letter) {
		background: var(--brass);
		color: #1a1405;
	}
	.role {
		color: var(--brass);
		font-size: 11.5px;
		font-family: var(--f-mono);
	}
	.guildopt {
		padding: 0;
		overflow: hidden;
		align-items: stretch;
	}
	.gimg {
		flex: 0 0 76px;
		background-size: cover;
		background-position: center 30%;
	}
	.gtxt {
		padding: 11px 12px 11px 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.gbar {
		height: 4px;
		width: 44px;
		border-radius: 9px;
	}
	.cta {
		width: 100%;
		border: 0;
		border-radius: 10px;
		padding: 14px;
		background: var(--brass);
		color: #1a1405;
		font-weight: 600;
		font-size: 15px;
	}
	.cta:disabled {
		background: var(--panel-2);
		color: var(--faint);
		cursor: not-allowed;
	}
	.ghost {
		width: 100%;
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 11px;
		background: transparent;
		color: var(--paper);
		font-weight: 500;
	}
	.field {
		width: 100%;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 11px;
		color: var(--paper);
		font: inherit;
		font-size: 16px;
	}
	textarea.field {
		min-height: 90px;
		resize: vertical;
	}
	input[type='range'] {
		width: 100%;
		accent-color: var(--brass);
	}
	.bets {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}
	.bet {
		border: 1px solid var(--line);
		background: var(--panel);
		border-radius: 10px;
		padding: 8px 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.bet b {
		font-family: var(--f-display);
		font-size: 21px;
		line-height: 1;
	}
	.bet small {
		font-size: 10.5px;
		color: var(--muted);
	}
	.bet.sel {
		border-color: var(--brass);
		background: var(--panel-2);
	}
	.bet.sel b {
		color: var(--brass);
	}
	.bet.locked {
		border-style: dashed;
		opacity: 0.6;
		cursor: not-allowed;
	}
	.bet.sq {
		width: 38px;
		padding: 6px;
		font-size: 18px;
	}
	.stepper {
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
	}
	.stepper > span {
		flex: 1;
		font-size: 13px;
	}
	.stepper b {
		font-size: 20px;
		width: 22px;
		text-align: center;
	}
	details.card summary {
		cursor: pointer;
		font-family: var(--f-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brass);
		list-style: none;
		display: flex;
		justify-content: space-between;
	}
	details.card summary::after {
		content: '＋';
	}
	details.card[open] summary::after {
		content: '－';
	}
	.fic {
		border-left: 2px solid var(--brass);
		padding-left: 9px;
		font-size: 13px;
		color: var(--muted);
	}
	.fic b {
		color: var(--paper);
		display: block;
	}
	.catcard {
		display: flex;
		gap: 12px;
		text-align: left;
		width: 100%;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 0;
		position: relative;
		overflow: hidden;
	}
	.catcard.sel {
		border-color: var(--brass);
		background: var(--panel-2);
	}
	.cimg {
		flex: 0 0 92px;
		background-size: cover;
		background-position: center 15%;
	}
	.ctxt {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 12px 12px 0;
	}
	.ctxt .k {
		font-family: var(--f-mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brass);
	}
	.ctxt b {
		font-size: 15px;
	}
	.ctxt span {
		font-size: 13px;
	}
	.voted {
		position: absolute;
		right: 10px;
		bottom: 10px;
	}
	.pool {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.pchip {
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 8px 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 12px;
	}
	.pchip span {
		font-family: var(--f-mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
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
	.pchip.locked {
		border-style: dashed;
		color: var(--faint);
	}
	.mbar {
		display: grid;
		grid-template-columns: 18px minmax(0, 1fr) 30px;
		gap: 7px;
		align-items: center;
		font-size: 12px;
	}
	.mbar b {
		color: var(--muted);
	}
	.mbar.me b {
		color: var(--brass);
	}
	.mbar .t {
		height: 9px;
		border-radius: 9px;
		background: var(--panel-2);
		overflow: hidden;
	}
	.mbar .t i {
		display: block;
		height: 100%;
		background: var(--steel);
		border-radius: 9px;
	}
	.mbar.me .t i {
		background: var(--brass);
	}
	.quote p {
		font-size: 13.5px;
	}
	.mini-m {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.say {
		flex: 1;
		font-size: 13.5px;
		color: var(--paper);
	}
	.say small {
		display: block;
		font-family: var(--f-mono);
		font-size: 10.5px;
		color: var(--brass);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 2px;
	}
	.pe {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--panel-2);
		border-radius: 10px;
		padding: 10px 12px;
		font-size: 13px;
	}
	.pe b {
		font-family: var(--f-display);
		font-size: 20px;
		color: var(--brass);
	}
	.toast {
		position: fixed;
		left: 12px;
		right: 12px;
		bottom: calc(14px + env(safe-area-inset-bottom, 0px));
		max-width: 496px;
		margin: 0 auto;
		background: var(--panel-2);
		border: 1px solid var(--brass);
		border-radius: 14px;
		padding: 12px;
		z-index: 6;
		box-shadow: 0 10px 30px -10px #000;
		font-size: 13px;
		display: flex;
		gap: 12px;
		align-items: center;
		animation: sala-rise 0.5s ease both;
	}
	.toast b {
		font-family: var(--f-display);
		font-size: 17px;
		display: block;
		color: var(--brass-hi);
	}
	svg text {
		font-family: var(--f-mono);
	}
</style>
