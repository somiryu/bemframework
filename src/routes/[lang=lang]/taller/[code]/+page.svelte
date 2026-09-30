<script lang="ts">
	import { enhance } from '$app/forms';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import ParticipantLive from './ParticipantLive.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let joining = $state(false);
</script>

<svelte:head>
	<title>{data.title} · Sala {data.code}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if data.view}
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
				<button class="tl-btn" type="submit" disabled={joining}>{joining ? 'Entrando…' : 'Entrar al taller'}</button>
				<p class="tl-muted">
					Lo usamos para guardar tus respuestas durante el taller y enviarte el recetario después. Tus respuestas
					se muestran al grupo sin tu nombre.
				</p>
			</form>
		</div>
	</TallerFrame>
{/if}

<style>
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
