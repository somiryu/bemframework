<script lang="ts">
	// Insignia hexagonal: una franja por rango, con un brillo que la recorre.
	let { rank, size = 64 }: { rank: number; size?: number } = $props();
</script>

<span class="badge" style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
		<polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="var(--brass)" class="popin" />
		<polygon
			points="50,12 85,31 85,69 50,88 15,69 15,31"
			fill="none"
			stroke="var(--brass-hi)"
			stroke-width="2"
		/>
		<circle cx="50" cy="34" r="7" fill="var(--ink)" />
		{#each Array.from({ length: rank + 1 }, (_v, k) => k) as i (i)}
			<path
				d="M30 {70 - i * 9} L50 {60 - i * 9} L70 {70 - i * 9}"
				fill="none"
				stroke="var(--ink)"
				stroke-width="4"
				stroke-linecap="round"
			/>
		{/each}
	</svg>
</span>

<style>
	.badge {
		position: relative;
		overflow: hidden;
		border-radius: 10px;
		flex: none;
		display: inline-block;
	}
	.badge::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 30%;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--paper) 30%, transparent),
			transparent
		);
		animation: sala-shine 2.4s ease-in-out 0.6s infinite;
	}
</style>
