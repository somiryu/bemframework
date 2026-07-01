<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import DesignHeader from './DesignHeader.svelte';
	import MentorExplain from './MentorExplain.svelte';
	import WorldCanvas from './WorldCanvas.svelte';
	import DesignSubmitFooter from './DesignSubmitFooter.svelte';

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
			mentorAvatar: '/learn_resources/characters/char_sara.png',
			instructions: '¡Atención, Agente en entrenamiento! En el modelo BEM <strong>no diseñamos juegos</strong> superficiales. En su lugar, pensamos como diseñadores de juegos para crear <strong>sistemas serios de aprendizaje</strong>. Completa una propuesta seria para cada driver para archivar tu bitácora de viaje.'
		},
		2: {
			title: 'Canvas de Diseño GFR Integrado',
			description: 'Alinea la Meta (Goal), Retroalimentación (Feedback) y Recompensa (Reward) en un ciclo motivacional continuo.',
			badge: 'CANVAS DE DISEÑO GFR',
			mentorName: 'Kira',
			mentorAvatar: '/learn_resources/characters/char_kira.png',
			instructions: 'Para cada fila, describe una <strong>Meta</strong>, su <strong>Retroalimentación</strong> correspondiente y la <strong>Recompensa</strong> esperada. Las tres deben estar <strong>integradas y alinedas</strong> con la actividad principal (sin recurrir a sobornos extrínsecos). Escríbelas en formato de condicional: <code class="code-highlight">"Si [acción/condición], entonces [consecuencia/estado]"</code> (Mínimo 15 caracteres por celda).'
		},
		3: {
			title: 'Canvas de Relojería Lúdica',
			description: 'Diseña un ciclo interactivo completo de 6 etapas para tus clases.',
			badge: 'CANVAS DE INTERACTIVIDAD',
			mentorName: 'John Wilkins',
			mentorAvatar: '/learn_resources/characters/char_wilkins.png',
			instructions: 'Para que una interactividad funcione con precisión, conecta las 6 piezas de la relojería. Cada casilla representa un engranaje y requiere al menos <strong>15 caracteres</strong> de descripción detallada. No dejes engranajes sueltos.'
		},
		4: {
			title: 'Canvas de Arquitectura de Metas',
			description: 'Diseña metas de aprendizaje aplicando las 7 variables de expectativa, la Matriz Quiero/Tengo y los tipos de objetivos.',
			badge: 'CANVAS DE METAS',
			mentorName: 'Kira Yamada',
			mentorAvatar: '/learn_resources/characters/char_kira.png',
			instructions: 'Para cada meta de aprendizaje que diseñes, debes completar 4 dimensiones: <strong>la meta en sí</strong>, <strong>su tipo de objetivo</strong> (Narrativa, Principal o Secundaria), <strong>el perfil de expectativas</strong> (Deseabilidad, Progreso, Dificultad, Plazo, Medición, Agencia y Esfuerzo) y <strong>su cuadrante en la Matriz Quiero/Tengo</strong> (Adquisición, Mantenimiento, Eliminación o Prevención). Cada campo requiere al menos <strong>15 caracteres</strong>.'
		},
		5: {
			title: 'Canvas de Notificadores Educativos BEM',
			description: 'Diseña llamados a la acción para mejorar las rutinas de tus estudiantes y califica sus parámetros.',
			badge: 'CANVAS DE ATENCIÓN',
			mentorName: 'Sara Arbeláez',
			mentorAvatar: '/learn_resources/characters/char_sara_animated.gif',
			instructions: 'Como diseñador de motivación, debes estructurar llamados a la acción precisos. Describe la <strong>Acción/Comportamiento</strong> deseado en el estudiante y define el <strong>Diseño de la Alerta/Señal</strong> (mínimo 15 caracteres cada uno). Luego, califica con los sliders su <strong>Intensidad</strong>, <strong>Coherencia</strong> y <strong>Timing</strong> (escala 1 a 5).'
		},
		6: {
			title: 'Canvas de Heurísticas y Decisiones Lúdicas',
			description: 'Diseña y mapea heurísticas conductuales junto a estrategias de toma de decisiones en el aula.',
			badge: 'CANVAS DE DECISIONES BEM',
			mentorName: 'Sara Arbeláez',
			mentorAvatar: '/learn_resources/characters/char_sara.png',
			instructions: 'Como diseñador de incentivos, debes alinear el comportamiento del estudiante con las dinámicas de juego. Por cada fila, selecciona una <strong>Heurística o Sesgo Conductual</strong> y define su idea de aplicación. Luego, selecciona una <strong>Estrategia de Diseño de Juego</strong> correspondiente y detalla su implementación lúdica (Mínimo 15 caracteres por descripción).'
		}
	};

	const config = $derived(worldConfigs[world.id] || {
		title: 'Canvas de Diseño',
		description: 'Completa tu propuesta seria para archivar tu bitácora de viaje.',
		badge: 'CANVAS DE DISEÑO',
		mentorName: 'Mentor',
		mentorAvatar: '/learn_resources/characters/char_sara.png',
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
		} else if (world.id === 4) {
			if (existingCanvas && Array.isArray(existingCanvas)) {
				canvasAnswers = existingCanvas.map((g: any, idx: number) => ({
					id: g.id ?? idx,
					meta: g.meta || '',
					tipo: g.tipo || '',
					expectativa: g.expectativa || '',
					cuadrante: g.cuadrante || ''
				}));
			} else {
				canvasAnswers = [{ 
					id: Date.now(), 
					meta: '', 
					tipo: '', 
					expectativa: '', 
					cuadrante: '' 
				}];
			}
		} else if (world.id === 5) {
			if (existingCanvas && Array.isArray(existingCanvas)) {
				canvasAnswers = existingCanvas.map((n: any, idx: number) => ({
					id: n.id ?? idx,
					accion: n.accion || '',
					senal: n.senal || '',
					intensidad: n.intensidad ?? 3,
					coherencia: n.coherencia ?? 3,
					timing: n.timing ?? 3
				}));
			} else {
				canvasAnswers = [{ 
					id: Date.now(), 
					accion: '', 
					senal: '', 
					intensidad: 3, 
					coherencia: 3, 
					timing: 3 
				}];
			}
		} else if (world.id === 6) {
			if (existingCanvas && Array.isArray(existingCanvas)) {
				canvasAnswers = existingCanvas.map((r: any, idx: number) => ({
					id: r.id ?? idx,
					heuristicId: r.heuristicId || 'disponibilidad',
					heuristicIdea: r.heuristicIdea || '',
					strategyId: r.strategyId || 'blind_choice',
					strategyIdea: r.strategyIdea || ''
				}));
			} else {
				canvasAnswers = [{ 
					id: Date.now(),
					heuristicId: 'disponibilidad',
					heuristicIdea: '',
					strategyId: 'blind_choice',
					strategyIdea: ''
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
		} else if (world.id === 4) {
			if (!Array.isArray(canvasAnswers) || canvasAnswers.length === 0) return false;
			return canvasAnswers.every(g => {
				return g.meta.trim().length >= 15 &&
					   g.tipo.trim().length >= 15 &&
					   g.expectativa.trim().length >= 15 &&
					   g.cuadrante.trim().length >= 15;
			});
		} else if (world.id === 5) {
			if (!Array.isArray(canvasAnswers) || canvasAnswers.length === 0) return false;
			return canvasAnswers.every(n => {
				return n.accion.trim().length >= 15 &&
					   n.senal.trim().length >= 15 &&
					   n.intensidad >= 1 && n.intensidad <= 5 &&
					   n.coherencia >= 1 && n.coherencia <= 5 &&
					   n.timing >= 1 && n.timing <= 5;
			});
		} else if (world.id === 6) {
			if (!Array.isArray(canvasAnswers) || canvasAnswers.length === 0) return false;
			return canvasAnswers.every(r => {
				return r.heuristicId && r.heuristicIdea.trim().length >= 15 &&
					   r.strategyId && r.strategyIdea.trim().length >= 15;
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
		} else if (world.id === 4) {
			return 'Asegúrate de que los 4 campos de cada meta (Meta, Tipo, Expectativa, Cuadrante) tengan al menos 15 caracteres.';
		} else if (world.id === 5) {
			return 'Asegúrate de describir la acción y el diseño de la señal (mínimo 15 caracteres) y ajustar los sliders.';
		} else if (world.id === 6) {
			return 'Asegúrate de describir tu idea para la heurística y la estrategia de juego (mínimo 15 caracteres cada una).';
		}
		return 'Completa todos los campos.';
	});
</script>

<!-- Note for Future AI Developers:
     CRITICAL: This component implements `saveToJournal` by submitting design canvas data.
     Always verify that JournalComponent.svelte is structured to read this matching serialized structure:
     - World 1: Record<string, string> (driver mapping)
     - World 2: Array of { id, meta, retroalimentacion, recompensa }
     - World 3: Array of { id, meta, llamado, eval_cognitiva, accion_disparadora, eval_juego, retroalimentacion }
     - World 4: Array of { id, meta, tipo, expectativa, cuadrante }
     If you change the structure here, you MUST update the visualization in JournalComponent.svelte!
-->

<div class="world-design-fullscreen" in:fade>
	<div class="design-content-container">
		<DesignHeader 
			title={config.title} 
			badge={config.badge} 
			description={config.description} 
			onComplete={onComplete} 
		/>

		<MentorExplain 
			mentorName={config.mentorName} 
			mentorAvatar={config.mentorAvatar} 
			instructions={config.instructions} 
			titlePrefix="Directriz de Diseño"
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
				class="design-submit-form"
			>
				<input type="hidden" name="world_id" value={world.id} />
				<input type="hidden" name="canvas_data" value={JSON.stringify(canvasAnswers)} />

				<WorldCanvas {world} bind:canvasAnswers />

				<DesignSubmitFooter 
					isValid={isCanvasValid} 
					isSubmitting={isSubmitting} 
					warningText={warningText} 
				/>
			</form>
		{/if}
	</div>
</div>

<style>
	.world-design-fullscreen {
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

	.design-content-container {
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
		.design-content-container {
			padding: 1.5rem 1rem;
		}
	}

	.design-submit-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		flex: 1;
	}
</style>
