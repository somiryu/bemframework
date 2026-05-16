<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'The BEM Framework', desc: 'A systemic approach to behavior design, experiential depth, and meaningful engagement.' },
		es: { title: 'El Marco BEM', desc: 'Un enfoque sistémico para el diseño de comportamiento, profundidad experiencial y compromiso significativo.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
