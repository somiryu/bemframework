<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Consulting', desc: 'Diagnostic and strategy services to boost engagement.' },
		es: { title: 'Consultoría', desc: 'Servicios de diagnóstico y estrategia para potenciar el compromiso.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
