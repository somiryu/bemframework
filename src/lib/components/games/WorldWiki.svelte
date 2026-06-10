<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import WikiHeader from './WikiHeader.svelte';
	import WikiMentorExplain from './WikiMentorExplain.svelte';
	import WorldCanvas from './WorldCanvas.svelte';
	import WikiSubmitFooter from './WikiSubmitFooter.svelte';
	
	// Import specific inner wiki canvas components
	import World1Wiki from './World1Wiki.svelte';
	import World2Wiki from './World2Wiki.svelte';
	import World3Wiki from './World3Wiki.svelte';

	let { 
		world, 
		player, 
		onComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onComplete: () => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	// Mentor and world configurations
	const worldConfigs: Record<number, {
		title: string;
		description: string;
		badge: string;
		mentorName: string;
		mentorAvatar: string;
		instructions: string;
	}> = {
		1: {
			title: 'Canvas de Actividades de Aprendizaje BEM',
			description: 'Define para cada uno de los 7 Drivers una actividad seria aplicable en tu clase.',
			badge: 'CANVAS DE DISEÑO BEM',
			mentorName: 'Sara',
			mentorAvatar: '/learn_resoruces/characters/char_sara.png',
			instructions: '¡Atención, Agente en entrenamiento! En el modelo BEM no diseñamos juegos superficiales. En su lugar, pensamos como diseñadores de juegos para crear sistemas serios de aprendizaje. Completa una propuesta seria para cada driver para archivar tu bitácora de viaje.'
		},
		2: {
			title: 'Canvas de Diseño GFR Integrado',
			description: 'Alinea la Meta (Goal), Retroalimentación (Feedback) y Recompensa (Reward) en un ciclo motivacional continuo.',
			badge: 'CANVAS DE DISEÑO GFR',
			mentorName: 'Kira',
			mentorAvatar: '/learn_resoruces/characters/char_kira.png',
			instructions: 'Para cada fila, describe una Meta, su Retroalimentación correspondiente y la Recompensa esperada. Las tres deben estar integradas y alineadas con la actividad principal (sin recurrir a sobornos extrínsecos). Escríbelas en formato de condicional: "Si [acción/condición], entonces [consecuencia/estado]" (Mínimo 15 caracteres por celda).'
		},
		3: {
			title: 'Canvas de Relojería Lúdica',
			description: 'Diseña un ciclo interactivo completo de 6 etapas para tus clases.',
			badge: 'CANVAS DE INTERACTIVIDAD',
			mentorName: 'John Wilkins',
			mentorAvatar: '/learn_resoruces/characters/char_wilkins.png',
			instructions: 'Para que una interactividad funcione con precisión, conecta las 6 piezas de la relojería. Cada casilla representa un engranaje y requiere al menos 15 caracteres de descripción detallada. No dejes engranajes sueltos.'
		}
	};

	const config = $derived(worldConfigs[world.id] || {
		title: 'Canvas de Diseño',
		description: 'Completa tu propuesta seria para archivar tu bitácora de viaje.',
		badge: 'CANVAS DE DISEÑO',
		mentorName: 'Mentor',
		mentorAvatar: '/learn_resoruces/characters/char_sara.png',
		instructions: 'Por favor completa los campos indicados.'
	});

	// Canvas Answers state managed centrally
	let canvasAnswers = $state<any>(null);
	let isSubmitting = $state(false);

	// Prefill state
	$effect(() => {
		if (canvasAnswers !== null) return;
		
		const existingCanvas = player.game_state?.[world.id]?.design_canvas || null;
		
		if (world.id === 1) {
			const answers = existingCanvas || {};
			canvasAnswers = {
				Hedonismo: answers.Hedonismo || '',
				Eficiencia: answers.Eficiencia || '',
				Relacion: answers.Relacion || '',
				Maestria: answers.Maestria || '',
				Descubrimiento: answers.Descubrimiento || '',
				Empoderamiento: answers.Empoderamiento || '',
				Proposito: answers.Proposito || ''
			};
		} else if (world.id === 2) {
			if (existingCanvas && Array.isArray(existingCanvas)) {
				canvasAnswers = existingCanvas.map((r: any, idx: number) => ({
					id: r.id ?? idx,
					meta: r.meta || '',
					retroalimentacion: r.retroalimentacion || '',
					recompensa: r.recompensa || ''
				}));
			} else {
				canvasAnswers = [{ id: Date.now(), meta: '', retroalimentacion: '', recompensa: '' }];
			}
		} else if (world.id === 3) {
			if (existingCanvas && Array.isArray(existingCanvas)) {
				canvasAnswers = existingCanvas.map((c: any, idx: number) => ({
					id: c.id ?? idx,
					meta: c.meta || '',
					llamado: c.llamado || '',
					eval_cognitiva: c.eval_cognitiva || '',
					accion_disparadora: c.accion_disparadora || '',
					eval_juego: c.eval_juego || '',
					retroalimentacion: c.retroalimentacion || ''
				}));
			} else {
				canvasAnswers = [{ 
					id: Date.now(), 
					meta: '', 
					llamado: '', 
					eval_cognitiva: '', 
					accion_disparadora: '', 
					eval_juego: '', 
					retroalimentacion: '' 
				}];
			}
		}
	});

	// Helper validation functions
	const startsWithSi = (str: string) => {
		const clean = str.trim().toLowerCase();
		return clean.startsWith('si ') || clean.startsWith('si,') || clean.startsWith('si\n');
	};

	const containsEntonces = (str: string) => {
		const clean = str.trim().toLowerCase();
		return clean.includes('entonces');
	};

	// Validation logic derived centrally
	const isCanvasValid = $derived.by(() => {
		if (!canvasAnswers) return false;
		
		if (world.id === 1) {
			return Object.values(canvasAnswers).every((val: any) => val.trim().length >= 10);
		} else if (world.id === 2) {
			if (!Array.isArray(canvasAnswers) || canvasAnswers.length === 0) return false;
			return canvasAnswers.every(r => {
				const m = r.meta.trim();
				const f = r.retroalimentacion.trim();
				const w = r.recompensa.trim();
				return m.length >= 15 && startsWithSi(m) && containsEntonces(m) &&
					   f.length >= 15 && startsWithSi(f) && containsEntonces(f) &&
					   w.length >= 15 && startsWithSi(w) && containsEntonces(w);
			});
		} else if (world.id === 3) {
			if (!Array.isArray(canvasAnswers) || canvasAnswers.length === 0) return false;
			return canvasAnswers.every(c => {
				return c.meta.trim().length >= 15 &&
					   c.llamado.trim().length >= 15 &&
					   c.eval_cognitiva.trim().length >= 15 &&
					   c.accion_disparadora.trim().length >= 15 &&
					   c.eval_juego.trim().length >= 15 &&
					   c.retroalimentacion.trim().length >= 15;
			});
		}
		return false;
	});

	// Helper text warning
	const warningText = $derived.by(() => {
		if (world.id === 1) {
			return 'Completa todos los campos (mínimo 10 caracteres) para habilitar el guardado.';
		} else if (world.id === 2) {
			return 'Asegúrate de que todas las filas tengan al menos 15 caracteres y el formato "Si..., entonces...".';
		} else if (world.id === 3) {
			return 'Asegúrate de que todas las casillas de cada ciclo tengan al menos 15 caracteres.';
		}
		return 'Completa todos los campos.';
	});
</script>

<!-- Note for Future AI Developers:
     CRITICAL: This component implements `saveToJournal` to serialize the design canvas data.
     Always verify that JournalComponent.svelte is structured to read this matching serialized structure:
     - World 1: Record<string, string> (driver mapping)
     - World 2: Array of { id, meta, retroalimentacion, recompensa }
     - World 3: Array of { id, meta, llamado, eval_cognitiva, accion_disparadora, eval_juego, retroalimentacion }
     If you change the structure here, you MUST update the visualization in JournalComponent.svelte!
-->

<div class="world-wiki-fullscreen" in:fade>
	<div class="wiki-content-container">
		<WikiHeader 
			title={config.title} 
			badge={config.badge} 
			description={config.description} 
			onComplete={onComplete} 
		/>

		<WikiMentorExplain 
			mentorName={config.mentorName} 
			mentorAvatar={config.mentorAvatar} 
			instructions={config.instructions} 
		/>

		{#if canvasAnswers}
			<form
				method="POST"
				action="?/submitDesignCanvas"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success' && result.data) {
							onUpdateCoins(player.coins, result.data.game_state);
							onComplete();
						}
						await update();
					};
				}}
				class="wiki-submit-form"
			>
				<input type="hidden" name="world_id" value={world.id} />
				<input type="hidden" name="canvas_data" value={JSON.stringify(canvasAnswers)} />

				<WorldCanvas worldId={world.id}>
					{#if world.id === 1}
						<World1Wiki world={world} bind:canvasAnswers />
					{:else if world.id === 2}
						<World2Wiki bind:canvasAnswers />
					{:else if world.id === 3}
						<World3Wiki bind:canvasAnswers />
					{/if}
				</WorldCanvas>

				<WikiSubmitFooter 
					isValid={isCanvasValid} 
					isSubmitting={isSubmitting} 
					warningText={warningText} 
				/>
			</form>
		{/if}
	</div>
</div>

<style>
	.world-wiki-fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--color-solar-bg, #FAF9F6);
		z-index: 99999;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.wiki-content-container {
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem 3rem;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-height: 100%;
	}

	@media (max-width: 768px) {
		.wiki-content-container {
			padding: 1.5rem 1rem;
		}
	}

	.wiki-submit-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		flex: 1;
	}
</style>
