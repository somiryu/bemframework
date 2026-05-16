<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'BEM Mechanics', desc: 'Deep dive into the Behavioral Engagement Mechanics.' },
		es: { title: 'Mecánicas BEM', desc: 'Profundización en las Mecánicas de Compromiso Conductual.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
