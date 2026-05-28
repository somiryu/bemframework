<script lang="ts">
	import HeroSection from './HeroSection.svelte';
	let { 
		title, 
		description, 
		longExplanation = undefined, 
		color 
	}: {
		title: string;
		description: string;
		longExplanation?: string[];
		color: string;
	} = $props();
</script>

<div class={`driver-page ${color}`}>
	<HeroSection {title} {description} />
	
	<section class="section explanation">
		<div class="container container-narrow">
			<div class="explanation-content">
				{#if longExplanation}
					{#each longExplanation as paragraph}
						<p>{paragraph}</p>
					{/each}
				{:else}
					<p class="placeholder">Content coming soon...</p>
				{/if}
			</div>
		</div>
	</section>
</div>

<style>
.driver-page {
	min-height: 100vh;
}

.explanation-content {
	font-size: 1.25rem;
	line-height: 1.8;
	color: var(--color-text);
}

.explanation-content p {
	margin-bottom: var(--space-lg);
}

.placeholder {
	text-align: center;
	color: var(--color-text-muted);
	font-style: italic;
	padding: var(--space-2xl) 0;
}
</style>
