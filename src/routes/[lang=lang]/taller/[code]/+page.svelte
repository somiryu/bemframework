<script lang="ts">
	import { enhance } from '$app/forms';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import ParticipantLive from './ParticipantLive.svelte';
	import SalaPlayer from '$lib/components/sala/SalaPlayer.svelte';
	import SalaFonts from '$lib/components/sala/SalaFonts.svelte';
	import Portrait from '$lib/components/sala/Portrait.svelte';
	import '$lib/components/sala/sala.css';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let joining = $state(false);
</script>

<svelte:head>
	<title>{data.title} · Sala {data.code}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if data.workshop === 'sala'}
	<SalaFonts />
	<div class="sala">
		{#if data.salaView}
			<SalaPlayer code={data.code} initialView={data.salaView} />
		{:else}
			<div class="sjoin">
				<Portrait mentor="giochi" size="84px" />
				<span class="eyebrow">Sala {data.code}</span>
				<h1>Turno de admisión de la OMIE</h1>
				<p class="muted">
					Bip-bop. Escribe tu nombre de cadete. Lo verán tus compañeros en los podios.
				</p>
				<form
					method="POST"
					action="?/join"
					use:enhance={() => {
						joining = true;
						return async ({ update }) => {
							await update();
							joining = false;
						};
					}}
				>
					<label for="alias" class="eyebrow faint">Nombre de cadete</label>
					<input
						id="alias"
						name="alias"
						class="sfield"
						maxlength="24"
						autocomplete="nickname"
						placeholder="Ej. Cadete Rivera"
						value={form?.alias ?? ''}
						required
					/>
					<label for="semail" class="eyebrow faint">Tu email</label>
					<input
						id="semail"
						name="email"
						type="email"
						class="sfield"
						autocomplete="email"
						inputmode="email"
						placeholder="nombre@correo.com"
						value={form?.email ?? ''}
						required
					/>
					{#if form?.error}<p class="serr" role="alert">{form.error}</p>{/if}
					<button class="scta" type="submit" disabled={joining}
						>{joining ? 'Entrando…' : 'Entrar a la sala'}</button
					>
					<p class="faint small">
						El email solo sirve para guardar tus respuestas durante la sesión. En pantalla se ve tu
						nombre de cadete, nunca tu email.
					</p>
				</form>
			</div>
		{/if}
	</div>
{:else if data.view}
	<ParticipantLive code={data.code} initialView={data.view} />
{:else}
	<TallerFrame code={data.code}>
		<div class="tl-stack join">
			<h1>{data.title}</h1>
			<p class="lead">Para entrar a la sala solo necesitamos tu email. No hay contraseña.</p>
			<form
				method="POST"
				action="?/join"
				class="tl-card form"
				use:enhance={() => {
					joining = true;
					return async ({ update }) => {
						await update();
						joining = false;
					};
				}}
			>
				<label for="email" class="tl-eyebrow">Tu email</label>
				<input
					id="email"
					name="email"
					type="email"
					class="tl-input"
					autocomplete="email"
					inputmode="email"
					placeholder="nombre@uniandes.edu.co"
					value={form?.email ?? ''}
					required
				/>
				{#if form?.error}<p class="tl-error">{form.error}</p>{/if}
				<button class="tl-btn" type="submit" disabled={joining}
					>{joining ? 'Entrando…' : 'Entrar al taller'}</button
				>
				<p class="tl-muted">
					Lo usamos para guardar tus respuestas durante el taller y enviarte el recetario después.
					Tus respuestas se muestran al grupo sin tu nombre.
				</p>
			</form>
		</div>
	</TallerFrame>
{/if}

<style>
	.sjoin {
		max-width: 460px;
		margin: 0 auto;
		min-height: 100dvh;
		padding: 32px 16px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 12px;
	}
	.sjoin h1 {
		font-size: 26px;
	}
	.sjoin form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 6px;
	}
	.sfield {
		width: 100%;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 12px;
		color: var(--paper);
		font: inherit;
		font-size: 16px;
	}
	.scta {
		border: 0;
		border-radius: 10px;
		padding: 14px;
		background: var(--brass);
		color: #1a1405;
		font-weight: 600;
		font-size: 15px;
	}
	.serr {
		color: var(--paper);
		border-left: 3px solid var(--steel);
		padding-left: 10px;
	}
	.small {
		font-size: 12px;
	}

	.join {
		max-width: 560px;
		margin: 0 auto;
	}

	.lead {
		font-size: 1.12rem;
		color: var(--tl-fg-2);
	}

	.form {
		display: grid;
		gap: 12px;
	}
</style>
