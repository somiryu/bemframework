<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Blog', desc: 'Articles and insights on gamification and behavior design.' },
		es: { title: 'Blog', desc: 'Artículos e ideas sobre gamificación y diseño de comportamiento.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
