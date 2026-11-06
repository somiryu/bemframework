<script lang="ts">
	import { MENTORS, type MentorKey } from '$lib/content/talleres/salaDeCrisis';

	let {
		mentor,
		size = '48px',
		ring = true
	}: { mentor: MentorKey; size?: string; ring?: boolean } = $props();
	const m = $derived(MENTORS[mentor]);
</script>

<span class="portrait" style:width={size} style:height={size}>
	<img src={m.img} alt={m.name} loading="lazy" />
	{#if ring}
		<svg viewBox="0 0 100 100" aria-hidden="true">
			<circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" stroke-width="1.2" />
			<g class="spin-slow">
				<circle
					cx="50"
					cy="50"
					r="48"
					fill="none"
					stroke="var(--brass)"
					stroke-width="1.6"
					stroke-dasharray="20 9 4 9"
				/>
			</g>
		</svg>
	{/if}
</span>

<style>
	.portrait {
		position: relative;
		flex: none;
		display: inline-block;
		border-radius: 50%;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 18%;
		border-radius: 50%;
		display: block;
		background: var(--panel-2);
	}
	svg {
		position: absolute;
		inset: -8%;
		width: 116%;
		height: 116%;
		overflow: visible;
	}
</style>
