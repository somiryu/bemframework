<script lang="ts">
	import { SLIDES } from '$lib/content/talleres/quienTieneLaCabeza';

	let { step }: { step: number } = $props();
</script>

<div class="steps" aria-label="Paso {step + 1} de {SLIDES.length}" role="img">
	{#each SLIDES as s, i (s.id)}
		<span class:done={i < step} class:now={i === step}></span>
	{/each}
</div>

<style>
	.steps {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	span {
		width: 28px;
		height: 6px;
		border-radius: 3px;
		background: var(--tl-line);
	}

	span.done {
		background: #c9b3ff;
	}

	span.now {
		background: var(--tl-purple);
	}
</style>
