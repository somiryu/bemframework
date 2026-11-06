// Reloj de fase compartido por las vistas: cuánto lleva la fase actual según el
// servidor (stageAge), corregido con el tiempo transcurrido desde que llegó la vista.
import { onMount } from 'svelte';

export const REVEAL_MS = 3200;

export function createStageClock(getView: () => { state: { step: number }; stageAge: number }) {
	let now = $state(Date.now());
	let start = $state(Date.now() - getView().stageAge);
	let lastStep = getView().state.step;

	onMount(() => {
		const t = setInterval(() => (now = Date.now()), 250);
		return () => clearInterval(t);
	});

	$effect(() => {
		const v = getView();
		// Solo se recalcula al cambiar de fase: los sondeos no deben mover el reloj.
		if (v.state.step !== lastStep) {
			lastStep = v.state.step;
			start = Date.now() - v.stageAge;
		}
	});

	return {
		get elapsed() {
			return now - start;
		},
		get revealed() {
			return now - start >= REVEAL_MS;
		}
	};
}
