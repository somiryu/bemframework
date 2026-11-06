<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import SalaProjector from './SalaProjector.svelte';
	import { createTallerLive } from '$lib/utils/tallerLive.svelte';
	import { OPTION_LETTERS as L } from '$lib/content/talleres/salaDeCrisis';

	// Controles del facilitador: avanzar fases, cerrar las rondas y ver en
	// miniatura lo que muestra el proyector. Pensado para el portátil del docente.
	let {
		code,
		initialView,
		role,
		initialHostCode = null,
		qrSvg,
		joinUrl
	}: {
		code: string;
		initialView: any;
		role: 'admin' | 'cohost';
		initialHostCode?: string | null;
		qrSvg: string;
		joinUrl: string;
	} = $props();

	// svelte-ignore state_referenced_locally
	const live = createTallerLive<any>(code, initialView, 'host');
	onMount(() => live.start());

	const view = $derived(live.view);
	const lang = $derived(page.params.lang ?? 'es');
	const isAdmin = $derived(role === 'admin');
	const inRound = $derived(['vote', 'case', 'mirror', 'reveal'].includes(view.stage));
	const inFinal = $derived(['budget', 'budgetr', 'integ', 'close'].includes(view.stage));
	let busy = $state(false);

	const STAGE: Record<string, string> = {
		lobby: 'Entrada',
		guild: 'Gremio y mentor',
		exp0: 'Expediente 0',
		exp0r: 'El giro',
		vote: 'Votación de expediente',
		case: 'Caso',
		mirror: 'Espejo de la sala',
		reveal: 'Revelación',
		budget: 'Gremio repara',
		budgetr: 'Consecuencias',
		integ: 'Integración',
		close: 'Cierre'
	};

	const nextLabel = $derived.by(() => {
		switch (view.stage) {
			case 'lobby':
				return 'Abrir gremios';
			case 'guild':
				return 'Abrir expediente 0';
			case 'exp0':
				return 'Cerrar y revelar';
			case 'exp0r':
				return 'Votar expediente · ronda 1';
			case 'vote':
				return 'Abrir el expediente ganador';
			case 'case':
				return 'Mostrar espejo de la sala';
			case 'mirror':
				return 'Cerrar y revelar';
			case 'reveal':
				return view.data?.hasMore
					? `Votar expediente · ronda ${view.round + 2}`
					: 'No quedan casos · abrir Gremio repara';
			case 'budget':
				return 'Ver consecuencias';
			case 'budgetr':
				return 'Abrir integración';
			case 'integ':
				return 'Ir al cierre';
			default:
				return null;
		}
	});

	async function move(to: 'next' | 'prev' | 'final') {
		busy = true;
		await live.post({ type: 'advance', to });
		busy = false;
	}

	// Avanzar con la barra espaciadora o la flecha derecha (útil con un presentador inalámbrico).
	function onKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (busy || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
		if ((e.key === 'ArrowRight' || e.key === 'PageDown') && nextLabel) {
			e.preventDefault();
			move('next');
		} else if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && view.stage !== 'lobby') {
			e.preventDefault();
			move('prev');
		}
	}

	// ---- Código de co-facilitador y reinicio (solo facilitador principal) ----
	// svelte-ignore state_referenced_locally
	let hostCode = $state<string | null>(initialHostCode);
	let showHostCode = $state(false);
	let confirmReset = $state(false);
	let msg = $state<string | null>(null);

	async function setHostCode(action: 'generate' | 'revoke') {
		const res = await fetch(`/api/taller/${code}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ type: 'hostCode', action })
		});
		if (!res.ok) {
			msg = 'No se pudo actualizar el código.';
			return;
		}
		hostCode = (await res.json()).hostCode;
		showHostCode = action === 'generate';
		msg = action === 'revoke' ? 'Código revocado.' : 'Código nuevo listo.';
	}

	async function reset() {
		confirmReset = false;
		await live.post({ type: 'reset' });
		msg = 'Sala reiniciada: sin cadetes ni respuestas.';
	}

	const correctNote = $derived.by(() => {
		const cs = view.data?.case;
		if (!cs || !['case', 'mirror'].includes(view.stage)) return null;
		return `${L[cs.correct]}. ${cs.options[cs.correct]}`;
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="host">
	<header class="bar">
		<div class="left">
			<span class="brand">OMIE · Sala de Crisis</span>
			<span class="pill">Sala <b>{code}</b></span>
			<span class="pill">{STAGE[view.stage]}{inRound ? ` · ronda ${view.round + 1}` : ''}</span>
			<span class="pill"><b>{view.participantCount}</b> cadetes</span>
			{#if ['guild', 'exp0', 'case', 'mirror', 'vote', 'budget', 'integ'].includes(view.stage)}
				<span class="pill"><b>{view.responseCount}</b> respuestas</span>
			{/if}
		</div>
		<a class="btn ghost" href="/{lang}/taller/{code}/proyector" target="_blank" rel="noopener"
			>Abrir proyector ↗</a
		>
	</header>

	<div class="controls">
		<button
			class="btn"
			type="button"
			disabled={busy || view.stage === 'lobby'}
			onclick={() => move('prev')}>← Anterior</button
		>
		<button
			class="btn primary"
			type="button"
			disabled={busy || !nextLabel}
			onclick={() => move('next')}>{nextLabel ? `${nextLabel} →` : 'Fin de la sesión'}</button
		>
		<button
			class="btn"
			type="button"
			disabled={busy || inFinal}
			onclick={() => move('final')}
			title="Cierra las rondas y abre la secuencia final hasta el cierre"
			>Ir a Gremio repara ⇥</button
		>
		{#if live.error}<span class="err" role="alert">{live.error}</span>{/if}
	</div>

	{#if correctNote}
		<p class="note">Solo para ti · respuesta: <b>{correctNote}</b></p>
	{/if}

	<SalaProjector {view} {qrSvg} {joinUrl} />

	<p class="hint">
		Atajos: → o Av Pág avanza, ← o Re Pág retrocede. El proyector se abre en otra ventana y se
		sincroniza solo.
	</p>

	<section class="admin">
		<div class="block">
			<span class="eyebrow">Enlace de la sala</span>
			<code>{joinUrl}</code>
		</div>
		{#if isAdmin}
			<div class="block">
				<span class="eyebrow">Co-facilitador</span>
				{#if hostCode}
					<span>Código: <code>{showHostCode ? hostCode : '••••••••'}</code></span>
					<button class="link" type="button" onclick={() => (showHostCode = !showHostCode)}
						>{showHostCode ? 'Ocultar' : 'Mostrar'}</button
					>
					<button class="link" type="button" onclick={() => setHostCode('generate')}
						>Generar otro</button
					>
					<button class="link" type="button" onclick={() => setHostCode('revoke')}>Revocar</button>
				{:else}
					<button class="link" type="button" onclick={() => setHostCode('generate')}
						>Generar código</button
					>
				{/if}
			</div>
			<div class="block">
				<span class="eyebrow">Datos</span>
				<a class="link" href="/api/taller/{code}/export">Descargar CSV</a>
				{#if confirmReset}
					<span class="warn">Se borran todos los cadetes y respuestas.</span>
					<button class="link danger" type="button" onclick={reset}>Sí, reiniciar</button>
					<button class="link" type="button" onclick={() => (confirmReset = false)}>Cancelar</button
					>
				{:else}
					<button class="link" type="button" onclick={() => (confirmReset = true)}
						>Reiniciar sala</button
					>
				{/if}
			</div>
		{/if}
		{#if msg}<p class="muted">{msg}</p>{/if}
	</section>
</div>

<style>
	.host {
		max-width: 1400px;
		margin: 0 auto;
		padding: 16px max(16px, env(safe-area-inset-left, 0px)) 40px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-size: 14px;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.left {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	.brand {
		font-family: var(--f-display);
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--brass);
		font-size: 18px;
		margin-right: 6px;
	}
	.pill {
		border: 1px solid var(--line);
		border-radius: 99px;
		padding: 3px 10px;
		font-family: var(--f-mono);
		font-size: 12px;
		color: var(--muted);
	}
	.pill b {
		color: var(--paper);
		font-weight: 500;
	}
	.controls {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 8px;
	}
	.btn {
		border: 1px solid var(--line);
		background: var(--panel-2);
		border-radius: 6px;
		padding: 9px 14px;
		font-weight: 500;
		text-decoration: none;
		color: var(--paper);
	}
	.btn:hover:not(:disabled) {
		border-color: var(--brass);
	}
	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.btn.primary {
		background: var(--brass);
		border-color: var(--brass);
		color: #1a1405;
		font-weight: 600;
	}
	.btn.ghost {
		background: transparent;
	}
	.err {
		color: var(--steel);
	}
	.note {
		font-size: 13px;
		color: var(--muted);
		border-left: 3px solid var(--brass);
		padding-left: 10px;
	}
	.note b {
		color: var(--paper);
	}
	.hint {
		font-size: 12px;
		color: var(--faint);
	}
	.admin {
		display: grid;
		gap: 10px;
		border-top: 1px solid var(--line);
		padding-top: 14px;
	}
	.block {
		display: flex;
		gap: 10px;
		align-items: center;
		flex-wrap: wrap;
	}
	code {
		font-family: var(--f-mono);
		color: var(--paper);
		background: var(--panel);
		padding: 2px 6px;
		border-radius: 4px;
		word-break: break-all;
	}
	.link {
		background: none;
		border: 0;
		padding: 0;
		color: var(--brass-hi);
		text-decoration: underline;
		font-size: 13px;
	}
	.link.danger,
	.warn {
		color: var(--steel);
	}
</style>
