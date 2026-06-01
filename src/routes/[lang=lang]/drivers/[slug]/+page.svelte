<script lang="ts">
	import type { PageData } from './$types';
	import { bemContent } from '$lib/content/bem';
	import DriverLanding from '$lib/components/sections/DriverLanding.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang);
	const slug = $derived(data.slug);
	
	// Find the driver data
	const driver = $derived.by(() => {
		const drivers = bemContent[lang as 'en' | 'es'].drivers.items;
		return drivers.find(d => d.slug === slug);
	});
</script>

{#if driver}
	<DriverLanding 
		title={driver.title} 
		description={driver.description} 
		color={driver.color}
	/>
{:else}
	<div class="container section">
		<h1>Driver not found</h1>
		<a href={`/${lang}`}>Back to home</a>
	</div>
{/if}
