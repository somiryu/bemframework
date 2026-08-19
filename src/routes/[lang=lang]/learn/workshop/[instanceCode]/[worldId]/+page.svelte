<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import World1Workshop from '$lib/components/games/World1Workshop.svelte';
	import World2Workshop from '$lib/components/games/World2Workshop.svelte';
	import World3Workshop from '$lib/components/games/World3Workshop.svelte';
	import World4Workshop from '$lib/components/games/World4Workshop.svelte';
	import World5Workshop from '$lib/components/games/World5Workshop.svelte';
import World6Workshop from '$lib/components/games/World6Workshop.svelte';
import World7Workshop from '$lib/components/games/World7Workshop.svelte';
import WorkshopHeader from '$lib/components/workshop/WorkshopHeader.svelte';
	import { page } from '$app/state';
	import { learnTranslations } from '$lib/content/learn';

	let { data }: { data: PageData } = $props();

	const lang = $derived((page.params.lang as 'es' | 'en') ?? 'es');
	const t = $derived(learnTranslations[lang].dashboard);

	async function handleBackToMap() {
		await goto(`/${lang}/learn`);
		window.scrollTo({ top: 0, behavior: 'instant' });
	}
</script>

<div class="fullscreen-workshop-layout" transition:fade>
	<WorkshopHeader
		instanceCode={data.instance.code}
		worldTitle={data.world.displayTitle ?? data.world.title}
		backLabel={t.backToMap}
		onBack={handleBackToMap}
	/>

	<main class="workshop-body">
		{#if data.world.id === 1}
			<World1Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 2}
			<World2Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 3}
			<World3Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 4}
			<World4Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 5}
			<World5Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 6}
			<World6Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else if data.world.id === 7}
			<World7Workshop
				player={data.player}
				instance={data.instance}
				world={data.world}
				onComplete={handleBackToMap}
			/>
		{:else}
			<div class="empty-list glass-card">
				<h3>Workshop para el Mundo {data.world.id}</h3>
				<p>El workshop de este mundo aún no está configurado.</p>
				<button type="button" class="btn-solar-primary mt-4" onclick={handleBackToMap}>
					Regresar al Mapa Principal
				</button>
			</div>
		{/if}
	</main>
</div>

<style>
	.fullscreen-workshop-layout {
		min-height: 100vh;
		width: 100%;
		background: radial-gradient(circle at 10% 20%, rgba(98, 189, 141, 0.08) 0%, rgba(255, 255, 255, 0) 90%), var(--color-solar-bg, #FAF9F6);
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		box-sizing: border-box;
	}

	.workshop-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 120px);
		overflow-y: auto;
	}

	@media (max-width: 900px) {
		.workshop-body {
			height: auto;
			overflow-y: visible;
		}
	}

	.empty-list {
		max-width: 600px;
		margin: 4rem auto;
		padding: 3rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 24px;
		border: 1px solid var(--color-solar-card-border);
		background: white;
	}

	.empty-list h3 {
		font-family: var(--font-solar-header);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0 0 1rem 0;
	}

	.empty-list p {
		color: var(--color-solar-text-muted);
		margin: 0 0 1.5rem 0;
	}
</style>
