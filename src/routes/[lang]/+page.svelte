<script lang="ts">
	import type { PageData } from './$types';
	import { bemContent, type Lang } from '$lib/content/bem';
	import { triviaData } from '$lib/content/trivia';
	import { gameState } from '$lib/gameStore';

	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import IntroductionSection from '$lib/components/sections/IntroductionSection.svelte';
	import TextSection from '$lib/components/sections/TextSection.svelte';
	import ArchitectureSection from '$lib/components/sections/ArchitectureSection.svelte';
	import GameDesignSection from '$lib/components/sections/GameDesignSection.svelte';
	import ParadigmsSection from '$lib/components/sections/ParadigmsSection.svelte';
	import DriversSection from '$lib/components/sections/DriversSection.svelte';
	import CreatorSection from '$lib/components/sections/CreatorSection.svelte';
	import DisciplineSection from '$lib/components/sections/DisciplineSection.svelte';
	import TriviaCard from '$lib/components/sections/TriviaCard.svelte';
	import BEMCard from '$lib/components/BEMCard.svelte';
	import { fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as Lang);
	const content = $derived(bemContent[lang]);

	// Card discovery state
	const discoveredCount = $derived($gameState.discoveredLandingSlots?.length ?? 0);
	const percentDiscovered = $derived((discoveredCount / 6) * 100);
</script>

<SEO {...content.seo} {lang} />

<HeroSection {...content.hero} />

<IntroductionSection {...content.introduction} />
<BEMCard {lang} slotIndex={1} />

<TextSection {...content.positioning} />
<BEMCard {lang} slotIndex={2} />

<ArchitectureSection {...content.architecture} />
<BEMCard {lang} slotIndex={3} />

<GameDesignSection {...content.gameDesign} />
<BEMCard {lang} slotIndex={4} />

<ParadigmsSection {...content.paradigms} />
<BEMCard {lang} slotIndex={5} />

<DriversSection {...content.drivers} {lang} />
<BEMCard {lang} slotIndex={6} />

<DisciplineSection {...content.discipline} />
<BEMCard {lang} />

<CreatorSection {...content.creator} />
<TriviaCard questions={triviaData[lang].landing} {lang} />

<!-- FLOATING CARD DISCOVERY GAME HUD -->
{#if discoveredCount > 0}
	<div class="discovery-hud-wrapper" transition:fade>
		<div class="discovery-hud">
			<div class="hud-content">
				<span class="hud-emoji">🔍</span>
				<div class="hud-text">
					{#if discoveredCount < 6}
						<strong>{lang === 'es' ? '¡Buscador de Cartas Activo!' : 'Card Hunter Active!'}</strong>
						<span>{lang === 'es' ? `Has descubierto ${discoveredCount} de 6 cartas en esta página` : `Discovered ${discoveredCount} of 6 cards on this page`}</span>
					{:else}
						<strong class="success-glow">{lang === 'es' ? '🎉 ¡Juego Completado!' : '🎉 Game Completed!'}</strong>
						<span>{lang === 'es' ? '¡Descubriste todas las cartas! +200 XP ganados' : 'Discovered all cards! +200 XP awarded'}</span>
					{/if}
				</div>
			</div>
			
			<div class="hud-progress-bar">
				<div class="hud-progress-fill" style="width: {percentDiscovered}%" class:complete={percentDiscovered === 100}></div>
			</div>
		</div>
	</div>
{/if}

<style>
.discovery-hud-wrapper {
	position: fixed;
	bottom: var(--space-md);
	left: 50%;
	transform: translateX(-50%);
	z-index: 100;
	width: 90%;
	max-width: 460px;
	pointer-events: none;
}

.discovery-hud {
	background: rgba(17, 24, 39, 0.85);
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.15);
	padding: 1rem 1.5rem;
	border-radius: var(--radius-md);
	box-shadow: 0 10px 30px rgba(0,0,0,0.3);
	pointer-events: auto;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.hud-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.hud-emoji {
	font-size: 1.5rem;
}

.hud-text {
	display: flex;
	flex-direction: column;
	color: white;
}

.hud-text strong {
	font-size: 0.95rem;
	font-weight: 800;
}

.hud-text .success-glow {
	color: var(--color-green);
	text-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.hud-text span {
	font-size: 0.8rem;
	color: rgba(255, 255, 255, 0.7);
	font-weight: 600;
}

.hud-progress-bar {
	width: 100%;
	height: 6px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: var(--radius-full);
	overflow: hidden;
}

.hud-progress-fill {
	height: 100%;
	background: var(--color-purple);
	border-radius: var(--radius-full);
	transition: width 0.4s ease;
}

.hud-progress-fill.complete {
	background: var(--color-green);
}
</style>
