<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Case Studies', desc: 'Real-world applications and results of the BEM framework.' },
		es: { title: 'Casos de Estudio', desc: 'Aplicaciones en el mundo real y resultados del marco BEM.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
