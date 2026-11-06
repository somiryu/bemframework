<script lang="ts">
	// Cuenta regresiva de 3 s antes de una revelación (carta «Resolución de expectativa»).
	// `elapsed` son los milisegundos desde que empezó la fase, según el servidor.
	let { elapsed, label = 'Resolución de expectativa' }: { elapsed: number; label?: string } =
		$props();
	const n = $derived(Math.max(1, 3 - Math.floor(elapsed / 1000)));
	const progress = $derived(Math.min(1, elapsed / 3000));
</script>

{#if elapsed < 3200}
	<div class="countdown" aria-live="polite">
		<div class="box">
			<svg viewBox="0 0 100 100" aria-hidden="true">
				<circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" stroke-width="3" />
				<circle
					cx="50"
					cy="50"
					r="44"
					fill="none"
					stroke="var(--brass)"
					stroke-width="3"
					pathLength="1"
					stroke-dasharray="1"
					stroke-dashoffset={progress}
				/>
			</svg>
			{#key n}<span class="n">{n}</span>{/key}
			<span class="lbl">{label}</span>
		</div>
	</div>
{/if}

<style>
	.countdown {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, var(--stage) 94%, transparent);
		z-index: 6;
	}
	.box {
		position: relative;
		width: min(16cqw, 40vw);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	svg circle:last-child {
		transition: stroke-dashoffset 0.25s linear;
	}
	.n {
		font-family: var(--f-display);
		font-size: min(7cqw, 18vw);
		font-weight: 700;
		color: var(--brass);
		animation: num 0.9s ease both;
	}
	@keyframes num {
		0% {
			opacity: 0;
			transform: scale(1.5);
		}
		20% {
			opacity: 1;
			transform: scale(1);
		}
	}
	.lbl {
		position: absolute;
		bottom: -2.6em;
		white-space: nowrap;
		font-family: var(--f-mono);
		font-size: 0.8em;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
</style>
