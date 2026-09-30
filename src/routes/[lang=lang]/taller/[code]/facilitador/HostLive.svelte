<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import IntroSlide from '$lib/components/taller/IntroSlide.svelte';
	import CaseStory from '$lib/components/taller/CaseStory.svelte';
	import CaseResults from '$lib/components/taller/CaseResults.svelte';
	import ClosingResults from '$lib/components/taller/ClosingResults.svelte';
	import StepDots from '$lib/components/taller/StepDots.svelte';
	import {
		SLIDES,
		CASES,
		Q1,
		type TallerView,
		type CaseResults as CaseResultsT,
		type ClosingResults as ClosingResultsT
	} from '$lib/content/talleres/quienTieneLaCabeza';
	import { createTallerLive } from '$lib/utils/tallerLive.svelte';

	let {
		code,
		initialView,
		role,
		initialHostCode = null
	}: {
		code: string;
		initialView: TallerView;
		role: 'admin' | 'cohost';
		initialHostCode?: string | null;
	} = $props();

	const isAdmin = $derived(role === 'admin');

	// svelte-ignore state_referenced_locally
	const live = createTallerLive<TallerView>(code, initialView, 'host');
	onMount(() => live.start());

	const view = $derived(live.view);
	const step = $derived(view.state.step);
	const phase = $derived(view.state.phase);
	const slide = $derived(SLIDES[step]);
	const votable = $derived(slide.kind !== 'intro');
	const isLast = $derived(step === SLIDES.length - 1);

	const lang = $derived(page.params.lang ?? 'es');
	// Short link served by routes/[code] — easier to dictate on a call.
	const joinUrl = $derived(`${page.url.origin}/${code.toLowerCase()}`);
	const joinUrlShort = $derived(joinUrl.replace(/^https?:\/\//, ''));

	// Designer's reading stays hidden by default — this screen is usually shared.
	let showNotes = $state(false);
	let busy = $state(false);

	// ---- co-facilitator code (main facilitator only) ----
	// Masked by default for the same reason as the notes: this screen is shared.
	// svelte-ignore state_referenced_locally
	let hostCode = $state<string | null>(initialHostCode);
	let showHostCode = $state(false);
	let hostCodeMsg = $state<string | null>(null);
	const controlsUrl = $derived(`${page.url.origin}/${lang}/taller/${code}/facilitador`);

	async function setHostCode(action: 'generate' | 'revoke') {
		if (action === 'revoke' && !confirm('¿Revocar el código? El co-facilitador pierde el acceso de inmediato.')) return;
		if (action === 'generate' && hostCode && !confirm('¿Generar un código nuevo? El actual deja de funcionar.')) return;
		const res = await fetch(`/api/taller/${code}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ type: 'hostCode', action })
		});
		if (!res.ok) {
			hostCodeMsg = 'No se pudo actualizar el código.';
			return;
		}
		hostCode = (await res.json()).hostCode;
		showHostCode = false;
		hostCodeMsg = action === 'revoke' ? 'Código revocado.' : 'Código nuevo listo. Cópialo para enviarlo.';
	}

	async function copyHostInvite() {
		if (!hostCode) return;
		try {
			await navigator.clipboard.writeText(`Controles del taller: ${controlsUrl}\nCódigo de co-facilitador: ${hostCode}`);
			hostCodeMsg = 'Enlace y código copiados.';
		} catch {
			showHostCode = true;
			hostCodeMsg = 'No se pudo copiar; cópialo a mano.';
		}
	}

	async function setState(nextStep: number, nextPhase: 'vote' | 'results') {
		if (busy) return;
		busy = true;
		await live.post({ type: 'state', step: nextStep, phase: nextPhase });
		busy = false;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function reveal() {
		return setState(step, 'results');
	}
	function reopen() {
		return setState(step, 'vote');
	}
	function next() {
		if (!isLast) return setState(step + 1, 'vote');
	}
	function prev() {
		if (step === 0) return;
		const target = SLIDES[step - 1];
		return setState(step - 1, target.kind === 'intro' ? 'vote' : 'results');
	}

	// Arrow right walks the whole deck: vote → results → next slide.
	function advance() {
		if (votable && phase === 'vote') return reveal();
		return next();
	}

	async function reset() {
		if (!confirm(`¿Reiniciar la sala ${code}? Se borran todos los participantes y sus respuestas, y la sala vuelve a la apertura. No se puede deshacer.`)) return;
		busy = true;
		await live.post({ type: 'reset' });
		busy = false;
	}

	function onKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		if (e.key === 'ArrowRight' || e.key === 'PageDown') {
			e.preventDefault();
			advance();
		} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			e.preventDefault();
			prev();
		}
	}

	const pct = $derived(
		view.participantCount ? Math.round((view.responseCount / view.participantCount) * 100) : 0
	);
</script>

<svelte:window onkeydown={onKey} />

<TallerFrame {code} badge={isAdmin ? 'Facilitador' : 'Co-facilitador'} wide>
	<div class="tl-stack">
		<div class="toolbar tl-card" role="toolbar" aria-label="Controles del facilitador">
			<div class="tb-left">
				<StepDots {step} />
				<span class="tb-label">
					{#if slide.kind === 'intro'}Apertura
					{:else if slide.kind === 'case'}Caso {slide.index + 1} de {CASES.length} · {phase === 'vote' ? 'votación abierta' : 'resultados'}
					{:else}Cierre · {phase === 'vote' ? 'escribiendo' : 'resultados'}{/if}
				</span>
			</div>

			<div class="tb-count" aria-live="polite">
				<strong>{view.participantCount}</strong> en la sala
				{#if votable}· <strong>{view.responseCount}</strong> respondieron{/if}
			</div>

			<div class="tb-buttons">
				<button class="tl-btn ghost" type="button" onclick={prev} disabled={busy || step === 0}>◀ Anterior</button>
				{#if votable && phase === 'vote'}
					<button class="tl-btn" type="button" onclick={reveal} disabled={busy}>Mostrar resultados</button>
				{:else if votable}
					<button class="tl-btn ghost" type="button" onclick={reopen} disabled={busy}>Reabrir votación</button>
				{/if}
				{#if !isLast && !(votable && phase === 'vote')}
					<button class="tl-btn" type="button" onclick={next} disabled={busy}>
						{step === 0 ? 'Empezar ▶' : 'Siguiente ▶'}
					</button>
				{/if}
			</div>

			<div class="tb-extra">
				<label class="toggle"><input type="checkbox" bind:checked={showNotes} /> Notas de facilitación</label>
				{#if isAdmin}
					<a href="/{lang}/taller" class="tb-link">Salas</a>
					<a href="/api/taller/{code}/export" class="tb-link">Descargar CSV</a>
					<button type="button" class="tb-link danger" onclick={reset} disabled={busy}>Reiniciar sala</button>
				{/if}
				<span class="tl-muted kbd">Flechas ← → para avanzar</span>
			</div>

			{#if isAdmin}
				<details class="cohost">
					<summary>Co-facilitador{hostCode ? ' · activo' : ''}</summary>
					<div class="cohost-body">
						{#if hostCode}
							<p class="tl-muted">
								Quien tenga este código maneja solo esta sala desde
								<strong>{controlsUrl.replace(/^https?:\/\//, '')}</strong>. No puede reiniciarla ni descargar el CSV.
							</p>
							<div class="cohost-row">
								<code class="cohost-code">{showHostCode ? hostCode : '••••••••'}</code>
								<button type="button" class="tb-link" onclick={() => (showHostCode = !showHostCode)}>
									{showHostCode ? 'Ocultar' : 'Mostrar'}
								</button>
								<button type="button" class="tb-link" onclick={copyHostInvite}>Copiar enlace y código</button>
								<button type="button" class="tb-link" onclick={() => setHostCode('generate')}>Generar otro</button>
								<button type="button" class="tb-link danger" onclick={() => setHostCode('revoke')}>Revocar</button>
							</div>
						{:else}
							<p class="tl-muted">
								Genera un código para que otra persona maneje esta sala contigo, sin darle una cuenta de
								administrador.
							</p>
							<div><button type="button" class="tl-btn ghost" onclick={() => setHostCode('generate')}>Generar código</button></div>
						{/if}
						{#if hostCodeMsg}<p class="cohost-msg" aria-live="polite">{hostCodeMsg}</p>{/if}
					</div>
				</details>
			{/if}
			{#if live.error}<p class="tl-error">{live.error}</p>{/if}
		</div>

		{#if slide.kind === 'intro'}
			<IntroSlide />
			<div class="join tl-card">
				<span class="tl-eyebrow">Entra al taller</span>
				<p class="join-url">{joinUrlShort}</p>
				<p class="tl-muted">o en <strong>{page.url.host}/{lang}/taller</strong> con el código <strong class="big-code">{code}</strong></p>
			</div>
		{:else if slide.kind === 'case'}
			{#if phase === 'vote'}
				<CaseStory c={slide.case} index={slide.index} total={CASES.length} />
				<div class="preview">
					<div>
						<span class="qn">1</span> ¿Has usado la IA de esta forma?
						<span class="opts">{Q1.join(' · ')}</span>
					</div>
					<div>
						<span class="qn">2</span> ¿Dónde ubicas este uso?
						<span class="opts"><span class="hum">Centauro</span> ←→ <span class="mac">Centauro invertido</span></span>
					</div>
				</div>
				<div class="progress">
					<div class="progress-bar"><div style:width="{pct}%"></div></div>
					<span><strong>{view.responseCount}</strong> de {view.participantCount} respondieron</span>
				</div>
				{#if showNotes}
					<div class="facil">
						<span class="tl-eyebrow">Nota de facilitación · lectura del diseñador · {slide.case.leanText}</span>
						<p>{slide.case.read}</p>
					</div>
				{/if}
			{:else}
				<CaseStory c={slide.case} index={slide.index} total={CASES.length} label="Lo que dijo el grupo" showImage />
				{#if view.results}
					{@const r = view.results as CaseResultsT}
					<CaseResults c={slide.case} counts={r.counts} scales={r.scales} {showNotes} />
				{/if}
			{/if}
		{:else if slide.kind === 'closing'}
			<header class="closing-head">
				<span class="tl-eyebrow">Cierre</span>
				<h2>Dale la vuelta</h2>
			</header>
			{#if phase === 'vote'}
				<p class="story">
					Piensa en algo que ya hagas con IA en tu trabajo docente. Escribe cómo sería si la cabeza fuera tuya:
					qué idea pones tú y qué trabajo le dejas a la máquina.
				</p>
				<div class="progress">
					<div class="progress-bar"><div style:width="{pct}%"></div></div>
					<span><strong>{view.responseCount}</strong> de {view.participantCount} escribieron</span>
				</div>
			{:else if view.results}
				<ClosingResults results={view.results as ClosingResultsT} />
			{/if}
		{/if}
	</div>
</TallerFrame>

<style>
	.toolbar {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px 20px;
		align-items: center;
		padding: 14px 18px;
		position: sticky;
		top: 8px;
		z-index: 10;
		background: rgba(247, 246, 251, 0.96);
		backdrop-filter: blur(6px);
	}

	.tb-left {
		display: grid;
		gap: 8px;
	}

	.tb-label {
		font-weight: 500;
		color: var(--tl-purple-ink);
	}

	.tb-count {
		font-size: 0.95rem;
		color: var(--tl-fg-2);
		text-align: right;
	}

	.tb-count strong {
		color: var(--tl-fg);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.tb-buttons {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.tb-buttons .tl-btn {
		white-space: nowrap;
	}

	.tb-extra {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		font-size: 0.85rem;
	}

	.toggle {
		display: flex;
		gap: 6px;
		align-items: center;
		cursor: pointer;
		color: var(--tl-fg-2);
	}

	.toggle input {
		accent-color: var(--tl-purple);
	}

	.tb-link {
		color: var(--tl-purple-ink);
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		cursor: pointer;
		text-decoration: underline;
	}

	.tb-link.danger {
		color: #b42318;
	}

	.kbd {
		font-size: 0.8rem;
	}

	.cohost {
		grid-column: 1 / -1;
		font-size: 0.88rem;
		border-top: 1px solid var(--tl-line);
		padding-top: 8px;
	}

	.cohost summary {
		cursor: pointer;
		color: var(--tl-purple-ink);
		font-weight: 500;
	}

	.cohost-body {
		display: grid;
		gap: 8px;
		padding-top: 8px;
	}

	.cohost-row {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		align-items: center;
	}

	.cohost-code {
		font-size: 1.05rem;
		letter-spacing: 0.16em;
		font-weight: 600;
		background: #fff;
		border: 1px solid var(--tl-line);
		border-radius: 8px;
		padding: 4px 10px;
	}

	.cohost-msg {
		color: #067647;
	}

	.join {
		text-align: center;
		display: grid;
		gap: 6px;
		justify-items: center;
	}

	.join-url {
		font-size: clamp(1.3rem, 3.2vw, 2.2rem);
		font-weight: 600;
		color: var(--tl-purple);
		word-break: break-all;
	}

	.big-code {
		letter-spacing: 0.12em;
		color: var(--tl-fg);
	}

	.preview {
		display: grid;
		gap: 10px;
		border: 1px dashed var(--tl-line);
		border-radius: 12px;
		padding: 16px 18px;
		font-weight: 500;
	}

	.qn {
		display: inline-grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--tl-purple);
		color: #fff;
		font-size: 0.8rem;
		margin-right: 6px;
	}

	.opts {
		display: block;
		font-weight: 300;
		color: var(--tl-fg-2);
		margin: 2px 0 0 32px;
		font-size: 0.95rem;
	}

	.progress {
		display: grid;
		gap: 8px;
		font-size: 1.05rem;
	}

	.progress-bar {
		height: 12px;
		background: var(--tl-surface);
		border: 1px solid var(--tl-line);
		border-radius: 99px;
		overflow: hidden;
	}

	.progress-bar div {
		height: 100%;
		background: var(--tl-purple);
		transition: width 0.4s ease;
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

	.closing-head {
		display: grid;
		gap: 6px;
	}

	.story {
		font-size: 1.15rem;
		line-height: 1.7;
		max-width: 68ch;
	}

	/* Laptop-width screens: the secondary links drop to their own row so the
	   main buttons stay on one line and the sticky bar stays short. */
	@media (max-width: 1100px) {
		.tb-extra {
			grid-column: 1 / -1;
			justify-content: flex-start;
		}
	}

	@media (max-width: 760px) {
		.toolbar {
			grid-template-columns: 1fr;
			position: static;
		}
		.tb-count,
		.tb-extra {
			text-align: left;
			justify-content: flex-start;
		}
	}
</style>
