<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Get a Quote', desc: 'Request a custom service proposal for your project.' },
		es: { title: 'Solicitar Cotización', desc: 'Solicita una propuesta de servicio personalizada para tu proyecto.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
