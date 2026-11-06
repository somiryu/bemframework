<script lang="ts">
	import { MENTORS, type MentorKey } from '$lib/content/talleres/salaDeCrisis';

	// La ilustración del mentor a sangre, en formato vertical: así se aprovecha el arte del personaje.
	let {
		mentor,
		label = null,
		width = '9.5em',
		minHeight = '9.5em'
	}: { mentor: MentorKey; label?: string | null; width?: string; minHeight?: string } = $props();
	const m = $derived(MENTORS[mentor]);
</script>

<div
	class="mfig flipin"
	style:flex-basis={width}
	style:min-height={minHeight}
	style:background-image="url('{m.img}')"
	role="img"
	aria-label={m.name}
>
	<span>{label ?? m.name}</span>
</div>

<style>
	.mfig {
		flex: 0 0 auto;
		align-self: stretch;
		border-radius: 0.6em;
		border: 1px solid var(--line);
		background-size: cover;
		background-position: center 12%;
		position: relative;
		overflow: hidden;
	}
	span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1.4em 0.7em 0.5em;
		background: linear-gradient(transparent, color-mix(in srgb, var(--ink) 92%, transparent));
		font-family: var(--f-mono);
		font-size: 0.72em;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--brass-hi);
	}
</style>
