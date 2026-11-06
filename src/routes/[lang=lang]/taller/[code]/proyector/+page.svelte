<script lang="ts">
	import { onMount } from 'svelte';
	import SalaProjector from '$lib/components/sala/SalaProjector.svelte';
	import SalaFonts from '$lib/components/sala/SalaFonts.svelte';
	import { createTallerLive } from '$lib/utils/tallerLive.svelte';
	import '$lib/components/sala/sala.css';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const live = createTallerLive<any>(data.code, data.view, 'host');
	onMount(() => live.start());

	let fs = $state(false);
	async function fullscreen() {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await document.documentElement.requestFullscreen();
		} catch {
			// Sin pantalla completa disponible: la vista igual se ajusta a la ventana.
		}
	}
	onMount(() => {
		const on = () => (fs = !!document.fullscreenElement);
		document.addEventListener('fullscreenchange', on);
		return () => document.removeEventListener('fullscreenchange', on);
	});
</script>

<svelte:head>
	<title>Proyector · Sala {data.code}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<SalaFonts />
<div class="sala screen">
	<div class="fit">
		<SalaProjector view={live.view} qrSvg={data.qr} joinUrl={data.joinUrl} />
	</div>
	{#if !fs}<button class="fsbtn" type="button" onclick={fullscreen}>Pantalla completa</button>{/if}
</div>

<style>
	.screen {
		height: 100vh;
		height: 100dvh;
		display: grid;
		place-items: center;
		overflow: hidden;
		position: relative;
	}
	/* El proyector ocupa el mayor 16:9 que cabe en la ventana. */
	.fit {
		width: min(100vw, calc(100vh * 16 / 9));
		width: min(100vw, calc(100dvh * 16 / 9));
	}
	.fsbtn {
		position: fixed;
		right: 12px;
		bottom: 12px;
		border: 1px solid var(--line);
		background: var(--panel);
		border-radius: 6px;
		padding: 6px 10px;
		font-size: 12px;
		opacity: 0.4;
	}
	.fsbtn:hover {
		opacity: 1;
	}
</style>
