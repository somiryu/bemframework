<script lang="ts">
	let {
		maxWidth = '840px',
		children
	}: {
		maxWidth?: string;
		children: any;
	} = $props();
</script>

<div class="game-ui-wrapper" style="max-width: {maxWidth}">
	{@render children()}
</div>

<style>
	.game-ui-wrapper {
		width: 100%;
		margin: 0 auto;
		padding: 1.5rem;
		box-sizing: border-box;
		font-family: var(--font-solar-body), sans-serif;
	}
</style>
