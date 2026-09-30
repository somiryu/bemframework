<script lang="ts">
	import { onMount } from 'svelte';
	import TallerFrame from '$lib/components/taller/TallerFrame.svelte';
	import IntroSlide from '$lib/components/taller/IntroSlide.svelte';
	import CaseStory from '$lib/components/taller/CaseStory.svelte';
	import CaseVote from '$lib/components/taller/CaseVote.svelte';
	import CaseResults from '$lib/components/taller/CaseResults.svelte';
	import ClosingResults from '$lib/components/taller/ClosingResults.svelte';
	import StepDots from '$lib/components/taller/StepDots.svelte';
	import {
		SLIDES,
		CASES,
		VUELTA_PLACEHOLDER,
		type TallerView,
		type CaseResults as CaseResultsT,
		type ClosingResults as ClosingResultsT
	} from '$lib/content/talleres/quienTieneLaCabeza';
	import { createTallerLive } from '$lib/utils/tallerLive.svelte';

	let { code, initialView }: { code: string; initialView: TallerView } = $props();

	// svelte-ignore state_referenced_locally
	const live = createTallerLive<TallerView>(code, initialView, 'participant');
	onMount(() => live.start());

	const view = $derived(live.view);
	const slide = $derived(SLIDES[view.state.step]);
	const phase = $derived(view.state.phase);

	// Scroll to the top whenever the facilitator moves the room.
	let lastKey = '';
	$effect(() => {
		const key = `${view.state.step}:${phase}`;
		if (lastKey && key !== lastKey) window.scrollTo({ top: 0, behavior: 'smooth' });
		lastKey = key;
	});

	// svelte-ignore state_referenced_locally
	let vuelta = $state(initialView.mine?.text ?? '');
	let sendingVuelta = $state(false);

	async function sendCase(slideId: string, choice: number, scale: number) {
		return live.post({ type: 'answer', slideId, choice, scale });
	}

	async function sendVuelta() {
		sendingVuelta = true;
		await live.post({ type: 'answer', slideId: 'vuelta', text: vuelta });
		sendingVuelta = false;
	}
</script>

<TallerFrame {code}>
	<div class="tl-stack">
		<StepDots step={view.state.step} />

		{#if live.error}<p class="tl-error" role="alert">{live.error}</p>{/if}

		{#if slide.kind === 'intro'}
			<IntroSlide compact />
			<p class="waiting">Ya estás en la sala. El taller empieza cuando los facilitadores pasen al primer caso.</p>
		{:else if slide.kind === 'case'}
			{#if phase === 'vote'}
				<CaseStory c={slide.case} index={slide.index} total={CASES.length} />
				{#key slide.id}
					<CaseVote
						caseId={slide.id}
						initial={view.mine}
						onSubmit={(choice, scale) => sendCase(slide.id, choice, scale)}
					/>
				{/key}
			{:else}
				<CaseStory c={slide.case} index={slide.index} total={CASES.length} label="Lo que dijo el grupo" />
				{#if view.results}
					{@const r = view.results as CaseResultsT}
					<CaseResults c={slide.case} counts={r.counts} scales={r.scales} mine={view.mine} />
				{/if}
			{/if}
		{:else if slide.kind === 'closing'}
			<header class="closing-head">
				<span class="tl-eyebrow">Cierre</span>
				<h2>Dale la vuelta</h2>
			</header>
			{#if phase === 'vote'}
				<p class="story">
					Piensa en algo que ya hagas con IA en tu trabajo docente. Escribe cómo sería si la cabeza fuera
					tuya: qué idea pones tú y qué trabajo le dejas a la máquina.
				</p>
				<textarea class="tl-input" bind:value={vuelta} placeholder={VUELTA_PLACEHOLDER} maxlength="2000"
				></textarea>
				<div class="actions">
					{#if view.mine?.text && view.mine.text === vuelta.trim()}
						<span class="ok">✓ Enviada. Puedes editarla hasta que se muestren las respuestas.</span>
					{:else}
						<span></span>
					{/if}
					<button
						class="tl-btn"
						type="button"
						disabled={!vuelta.trim() || sendingVuelta || view.mine?.text === vuelta.trim()}
						onclick={sendVuelta}
					>
						{sendingVuelta ? 'Enviando…' : view.mine?.text ? 'Actualizar' : 'Enviar'}
					</button>
				</div>
			{:else if view.results}
				<ClosingResults results={view.results as ClosingResultsT} personal />
			{/if}
		{/if}
	</div>
</TallerFrame>

<style>
	.waiting {
		text-align: center;
		color: var(--tl-purple-ink);
		background: var(--tl-purple-soft);
		border-radius: 12px;
		padding: 14px 18px;
		font-weight: 400;
	}

	.closing-head {
		display: grid;
		gap: 6px;
	}

	.story {
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: space-between;
		align-items: center;
	}

	.ok {
		color: #067647;
		font-size: 0.92rem;
	}
</style>
