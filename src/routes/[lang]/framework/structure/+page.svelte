<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'System Structure', desc: 'The architectural schemas used in the framework.' },
		es: { title: 'Estructura del Sistema', desc: 'Los esquemas arquitectónicos utilizados en el marco.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
