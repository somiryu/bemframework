<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');
	const content = {
		en: { title: 'Workshops', desc: 'Training and facilitator services for your team.' },
		es: { title: 'Talleres', desc: 'Servicios de capacitación y facilitación para tu equipo.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
