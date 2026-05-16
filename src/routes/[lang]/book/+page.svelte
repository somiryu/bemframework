<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Beyond Mechanics', desc: 'The definitive book on the BEM framework.' },
		es: { title: 'Beyond Mechanics', desc: 'El libro definitivo sobre el marco BEM.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
