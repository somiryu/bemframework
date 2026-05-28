<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');
	const content = {
		en: { title: 'Buy the Book', desc: 'Get your copy of Beyond Mechanics today.' },
		es: { title: 'Comprar el Libro', desc: 'Consigue tu copia de Beyond Mechanics hoy mismo.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
