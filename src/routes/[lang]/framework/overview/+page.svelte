<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Framework Overview', desc: 'Core philosophy and the BEM methodology.' },
		es: { title: 'Visión General del Marco', desc: 'Filosofía central y la metodología BEM.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
