<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import HostLive from './HostLive.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const lang = $derived(page.params.lang ?? 'es');
</script>

<svelte:head>
	<title>Facilitador · Sala {data.code}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if data.role && data.view}
	<HostLive code={data.code} initialView={data.view} role={data.role} initialHostCode={data.hostCode} />
{:else}
	<TallerFrame code={data.code} badge="Facilitador">
		<div class="tl-stack gate">
			<h1>Controles de la sala</h1>
			<p class="lead">Escribe el código de co-facilitador que te dio el facilitador principal.</p>
			<form method="POST" action="?/cohostLogin" class="tl-card form" use:enhance>
				<label for="hostCode" class="tl-eyebrow">Código de co-facilitador</label>
				<input
					id="hostCode"
					name="hostCode"
					class="tl-input code"
					autocomplete="off"
					autocapitalize="characters"
					spellcheck="false"
					placeholder="Ej.: K7M2QX9A"
					required
				/>
				{#if form?.error}<p class="tl-error">{form.error}</p>{/if}
				<button class="tl-btn" type="submit">Entrar a los controles</button>
			</form>
			<p class="tl-muted">
				¿Eres el facilitador principal? <a href="/{lang}/taller?facilitador">Entra con tu cuenta</a>.
			</p>
		</div>
	</TallerFrame>
{/if}

<style>
	.gate {
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

	.code {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-weight: 500;
	}

	a {
		color: var(--tl-purple-ink);
	}
</style>
