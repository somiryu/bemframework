<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import { SLIDES, WORKSHOP_TITLE } from '$lib/content/talleres/quienTieneLaCabeza';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const lang = $derived(page.params.lang ?? 'es');
	// svelte-ignore state_referenced_locally
	let showHostLogin = $state(data.showHostLogin);

	function stepLabel(step: number, phase: string) {
		const s = SLIDES[step];
		if (!s) return '';
		if (s.kind === 'intro') return 'Apertura';
		if (s.kind === 'closing') return phase === 'results' ? 'Cierre · resultados' : 'Cierre';
		return `Caso ${s.index + 1} · ${phase === 'results' ? 'resultados' : 'votación'}`;
	}
</script>

<svelte:head>
	<title>{WORKSHOP_TITLE} · Taller en vivo</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<TallerFrame>
	<div class="tl-stack entry">
		<div class="entry-cover">
			<img src="/taller/portada.webp" alt="Un centauro y un centauro invertido frente a un tablero de ajedrez" width="1376" height="768" />
		</div>
		<h1>{WORKSHOP_TITLE}</h1>
		<p class="lead">
			Un taller en vivo sobre creatividad e IA. Escribe el código de sala que te dieron los facilitadores.
		</p>

		<form method="POST" action="?/join" class="tl-card join" use:enhance>
			<label for="code" class="tl-eyebrow">Código de sala</label>
			<div class="row">
				<input
					id="code"
					name="code"
					class="tl-input code"
					autocomplete="off"
					autocapitalize="characters"
					placeholder="Ej.: K7M2Q"
					value={form?.code ?? data.prefillCode}
					required
				/>
				<button class="tl-btn" type="submit">Entrar</button>
			</div>
			{#if form?.joinError}<p class="tl-error">{form.joinError}</p>{/if}
		</form>

		{#if data.hostEmail}
			<section class="tl-stack host">
				<div class="host-head">
					<h2>Salas</h2>
					<form method="POST" action="?/hostLogout" use:enhance>
						<span class="tl-muted">{data.hostEmail}</span>
						<button class="linkish" type="submit">Salir</button>
					</form>
				</div>

				<form method="POST" action="?/create" class="tl-card create" use:enhance>
					<h3>Nueva sala</h3>
					<div class="grid2">
						<label>
							<span class="tl-eyebrow">Nombre (opcional)</span>
							<input name="title" class="tl-input" placeholder="Webinar docentes · octubre" />
						</label>
						<label>
							<span class="tl-eyebrow">Código (opcional)</span>
							<input name="code" class="tl-input" placeholder="Se genera solo" autocapitalize="characters" />
						</label>
					</div>
					{#if form?.createError}<p class="tl-error">{form.createError}</p>{/if}
					<div><button class="tl-btn" type="submit">Crear sala y abrir controles</button></div>
				</form>

				{#if data.sessions.length}
					<ul class="sessions">
						{#each data.sessions as s (s.code)}
							<li class="tl-card">
								<div>
									<strong class="scode">{s.code}</strong>
									<span>{s.title}</span>
									<span class="tl-muted">{stepLabel(s.state.step, s.state.phase)} · {new Date(s.created_at).toLocaleDateString('es-CO')}</span>
								</div>
								<div class="links">
									<a class="tl-btn" href="/{lang}/taller/{s.code}/facilitador">Controles</a>
									<a class="tl-btn ghost" href="/api/taller/{s.code}/export">CSV</a>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="tl-muted">Todavía no hay salas.</p>
				{/if}
			</section>
		{:else if showHostLogin}
			<form method="POST" action="?/hostLogin" class="tl-card hostlogin" use:enhance>
				<h3>Entrar como facilitador</h3>
				<input name="email" type="email" class="tl-input" placeholder="Correo" autocomplete="username" required />
				<input name="password" type="password" class="tl-input" placeholder="Contraseña" autocomplete="current-password" required />
				{#if form?.hostError}<p class="tl-error">{form.hostError}</p>{/if}
				<div><button class="tl-btn" type="submit">Entrar</button></div>
			</form>
		{:else}
			<button class="linkish facil-link" type="button" onclick={() => (showHostLogin = true)}>Soy facilitador</button>
		{/if}
	</div>
</TallerFrame>

<style>
	.entry {
		max-width: 640px;
		margin: 0 auto;
	}

	.lead {
		font-size: 1.15rem;
		color: var(--tl-fg-2);
	}

	.entry-cover {
		max-width: 580px;
		margin: 0 auto 8px;
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid var(--tl-line);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.entry-cover img {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.join,
	.create,
	.hostlogin {
		display: grid;
		gap: 12px;
	}

	.row {
		display: flex;
		gap: 10px;
	}

	.code {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 500;
	}

	.host {
		margin-top: 12px;
	}

	.host-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
	}

	.host-head form {
		display: flex;
		gap: 8px;
		align-items: baseline;
	}

	.grid2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.grid2 label {
		display: grid;
		gap: 6px;
	}

	.sessions {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}

	.sessions li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		padding: 14px 18px;
	}

	.sessions li > div:first-child {
		display: grid;
		gap: 2px;
	}

	.scode {
		letter-spacing: 0.1em;
		font-weight: 600;
		color: var(--tl-purple-ink);
	}

	.links {
		display: flex;
		gap: 8px;
	}

	.links a {
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.linkish {
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		color: var(--tl-purple-ink);
		text-decoration: underline;
		cursor: pointer;
	}

	.facil-link {
		justify-self: start;
		font-size: 0.9rem;
		color: var(--tl-fg-3);
	}

	@media (max-width: 560px) {
		.row,
		.grid2 {
			grid-template-columns: 1fr;
			flex-direction: column;
		}
	}
</style>
