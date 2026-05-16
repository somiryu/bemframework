<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Engagement Director', desc: 'Innovation team management and design tools.' },
		es: { title: 'Director de Compromiso', desc: 'Gestión de equipos de innovación y herramientas de diseño.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
