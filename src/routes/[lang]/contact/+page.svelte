<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const content = {
		en: { title: 'Contact Us', desc: 'Get in touch for inquiries or collaborations.' },
		es: { title: 'Contáctanos', desc: 'Ponte en contacto para consultas o colaboraciones.' }
	};
</script>

<HeroSection title={content[lang].title} description={content[lang].desc} />
