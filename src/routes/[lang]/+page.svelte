<script lang="ts">
	import type { PageData } from './$types';
	import { bemContent, type Lang } from '$lib/content/bem';
	import { triviaData } from '$lib/content/trivia';

	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	import TextSection from '$lib/components/sections/TextSection.svelte';
	import ArchitectureSection from '$lib/components/sections/ArchitectureSection.svelte';
	import GameDesignSection from '$lib/components/sections/GameDesignSection.svelte';
	import ParadigmsSection from '$lib/components/sections/ParadigmsSection.svelte';
	import DriversSection from '$lib/components/sections/DriversSection.svelte';
	import CreatorSection from '$lib/components/sections/CreatorSection.svelte';
	import DisciplineSection from '$lib/components/sections/DisciplineSection.svelte';
	import TriviaCard from '$lib/components/sections/TriviaCard.svelte';
	import BEMCard from '$lib/components/BEMCard.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as Lang);
	const content = $derived(bemContent[lang]);
</script>

<SEO {...content.seo} {lang} />
<HeroSection {...content.hero} />
<TextSection {...content.positioning} />
<BEMCard {lang} />
<ArchitectureSection {...content.architecture} />
<BEMCard {lang} />
<GameDesignSection {...content.gameDesign} />
<BEMCard {lang} />
<ParadigmsSection {...content.paradigms} />
<BEMCard {lang} />
<DriversSection {...content.drivers} {lang} />
<BEMCard {lang} />
<DisciplineSection {...content.discipline} />
<BEMCard {lang} />
<CreatorSection {...content.creator} />
<TriviaCard questions={triviaData[lang].landing} {lang} />
