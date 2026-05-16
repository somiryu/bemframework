<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Javier Velásquez', desc: 'Award-winning gamification designer and BEM founder.' },
		es: { title: 'Javier Velásquez', desc: 'Diseñador de gamificación galardonado y fundador de BEM.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
