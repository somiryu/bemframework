<script lang="ts">
	import { Q1, zone } from '$lib/content/talleres/quienTieneLaCabeza';

	let {
		caseId,
		initial,
		onSubmit
	}: {
		caseId: string;
		initial: { choice: number | null; scale: number | null } | null;
		onSubmit: (choice: number, scale: number) => Promise<boolean>;
	} = $props();

	// Local draft; seeded from what the server already has for this case so a
	// reload doesn't wipe a vote that was already sent.
	// svelte-ignore state_referenced_locally
	let choice = $state<number | null>(initial?.choice ?? null);
	// svelte-ignore state_referenced_locally
	let scale = $state<number>(initial?.scale ?? 50);
	// svelte-ignore state_referenced_locally
	let touched = $state(initial?.scale != null);
	let sending = $state(false);
	// svelte-ignore state_referenced_locally
	let sent = $state(initial?.choice != null);

	const dirty = $derived(!sent || choice !== initial?.choice || scale !== initial?.scale);
	const ready = $derived(choice !== null && touched && !sending);

	async function submit() {
		if (choice === null || !touched) return;
		sending = true;
		const ok = await onSubmit(choice, scale);
		sending = false;
		if (ok) sent = true;
	}
</script>

<div class="q">
	<span class="qlabel" id="q1-{caseId}"><span class="qnum">1</span>¿Has usado la IA de esta forma?</span>
	<div class="choices" role="group" aria-labelledby="q1-{caseId}">
		{#each Q1 as label, i (i)}
			<button type="button" class="choice" aria-pressed={choice === i} onclick={() => (choice = i)}>
				{label}
			</button>
		{/each}
	</div>
</div>

<div class="q">
	<label class="qlabel" for="sl-{caseId}"><span class="qnum">2</span>¿Dónde ubicas este uso?</label>
	<div class="ends">
		<span class="hum"><b>Centauro</b><br /><small>la cabeza es humana</small></span>
		<span class="mac"><b>Centauro invertido</b><br /><small>la cabeza es de la máquina</small></span>
	</div>
	<div class="gradbar" aria-hidden="true"></div>
	<input
		id="sl-{caseId}"
		type="range"
		min="0"
		max="100"
		bind:value={scale}
		oninput={() => (touched = true)}
		aria-valuetext={zone(scale)}
	/>
	<div class="slideval">{touched ? zone(scale) : 'Mueve el deslizador'}</div>
</div>

<div class="actions">
	{#if sent && !dirty}
		<span class="ok">✓ Respuesta enviada. Puedes cambiarla hasta que se muestren los resultados.</span>
	{:else}
		<span class="tl-muted">{ready ? '' : 'Responde las dos preguntas para enviar.'}</span>
	{/if}
	<button type="button" class="tl-btn" disabled={!ready || !dirty} onclick={submit}>
		{sending ? 'Enviando…' : sent ? 'Actualizar respuesta' : 'Enviar respuesta'}
	</button>
</div>

<style>
	.q {
		display: grid;
		gap: 10px;
	}

	.qlabel {
		font-weight: 500;
		font-size: 1.05rem;
	}

	.qnum {
		display: inline-grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--tl-purple);
		color: #fff;
		font-size: 0.8rem;
		margin-right: 8px;
		font-weight: 600;
	}

	.choices {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}

	.choice {
		font: 400 1rem var(--tl-font);
		text-align: left;
		padding: 14px 16px;
		border-radius: 12px;
		border: 1px solid var(--tl-line);
		background: #fff;
		color: var(--tl-fg);
		cursor: pointer;
		min-height: 54px;
	}

	.choice:hover {
		border-color: var(--tl-purple);
	}

	.choice[aria-pressed='true'] {
		border-color: var(--tl-purple);
		box-shadow: inset 0 0 0 1px var(--tl-purple);
		background: var(--tl-purple-soft);
		color: var(--tl-purple-ink);
		font-weight: 500;
	}

	.ends {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 0.92rem;
	}

	.ends span {
		max-width: 48%;
	}
	.ends span:last-child {
		text-align: right;
	}
	.ends b {
		font-weight: 600;
	}

	.gradbar {
		height: 8px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--tl-human), var(--tl-gray) 50%, var(--tl-machine));
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--tl-purple);
		height: 32px;
		margin: 0;
	}

	.slideval {
		text-align: center;
		font-size: 0.95rem;
		color: var(--tl-fg-2);
		font-weight: 500;
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
		flex: 1 1 240px;
	}

	@media (max-width: 640px) {
		.choices {
			grid-template-columns: 1fr;
		}
		.actions .tl-btn {
			width: 100%;
		}
	}
</style>
