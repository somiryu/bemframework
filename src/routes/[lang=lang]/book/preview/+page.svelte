<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');
	const content = {
		en: { title: 'Book Preview', desc: 'Take a sneak peek inside Beyond Mechanics.' },
		es: { title: 'Vista Previa del Libro', desc: 'Echa un vistazo al interior de Beyond Mechanics.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
