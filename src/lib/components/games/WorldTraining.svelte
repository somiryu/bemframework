<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import TrainingIntro from './TrainingIntro.svelte';
	import TrainingSummary from './TrainingSummary.svelte';
	
	// Import specific inner training game components
	import World1Training from './World1Training.svelte';
	import World2Training from './World2Training.svelte';
	import World3Training from './World3Training.svelte';
	import World4Training from './World4Training.svelte';
	import World5Training from './World5Training.svelte';

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

	// Mentor and world training configurations
	const trainingConfigs: Record<number, {
		title: string;
		mentorName: string;
		mentorAvatar: string;
		tip: string;
		instructions: string[];
	}> = {
		1: {
			title: 'Entrenamiento de Reconocimiento BEM',
			mentorName: 'Sara',
			mentorAvatar: '/learn_resources/characters/char_sara_animated.gif',
			tip: '¡Bienvenido de nuevo, Agente en entrenamiento! Los mentores han preparado un desafío riguroso para calibrar tus instintos de diseño motivacional:',
			instructions: [
				'<strong>21 Escenarios Aleatorios:</strong> Responderás un flujo dinámico de casos seleccionados al azar (3 por cada uno de los 7 drivers).',
				'<strong>Sistema de Karma en Vivo:</strong> Tus aciertos mueven la barra hacia el éxito (azul/verde), pero equivocarte (o aplicar mal un driver) empuja el indicador hacia atrás (rojo).',
				'<strong>Estrellas de Calibración:</strong> Al final, se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!',
				'<strong>Copa Máxima de 50 Monedas:</strong> Puedes entrenar y repetir cuantas veces quieras para calibrar tu karma, acumulando hasta un máximo de 50 monedas de por vida en este módulo.'
			]
		},
		2: {
			title: 'Entrenamiento de Clasificación GFR',
			mentorName: 'Kira',
			mentorAvatar: '/learn_resources/characters/char_kira.png',
			tip: '¡Bienvenido, Agente! Este módulo calibrará tus habilidades para distinguir los componentes del diseño gamificado bajo el modelo GFR (Goal, Feedback, Reward) y la Teoría de la Autodeterminación (RII):',
			instructions: [
				'<strong>10 Casos de Estudio:</strong> Clasificarás 10 tarjetas aleatorias en la cuadrícula de 3x3.',
				'<strong>Reglas de Puntaje:</strong> Obtienes <strong>+2 puntos</strong> por ubicar perfectamente la tarjeta. Si solo aciertas en un eje (ya sea la columna GFR o la fila de regulación RII), recibes <strong>+1 punto</strong>.',
				'<strong>Calibración de Estrellas:</strong> Dependiendo de tus aciertos, ganarás hasta 5 estrellas de calibración. Cada estrella te otorga <strong>+5 BEM Coins</strong>.',
				'<strong>Copa Máxima de 50 Monedas:</strong> Puedes practicar cuantas veces lo necesites para dominar el modelo, acumulando hasta un total de 50 monedas en este entrenamiento.'
			]
		},
		3: {
			title: 'Relojería de la Interactividad',
			mentorName: 'John Wilkins',
			mentorAvatar: '/learn_resources/characters/char_wilkins_animated.gif',
			tip: 'Para construir un aprendizaje lúdico y fluido, la meta, la acción del estudiante y el feedback de retorno deben encajar con la precisión de un cronógrafo. Calibremos tu exactitud con 10 escenarios reales de clase:',
			instructions: [
				'<strong>Clasifica el tamaño del ciclo:</strong> Determina si el bucle es <strong>Corto</strong> (segundos a minutos), <strong>Medio</strong> (1-3 días), o <strong>Largo</strong> (1 semana o más).',
				'<strong>Puntuación Neta:</strong> Cada acierto suma <strong>+1 punto</strong> y cada fallo resta <strong>-1 punto</strong>.',
				'<strong>Monedas BEM:</strong> Desbloquea hasta 5 estrellas de precisión. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!'
			]
		},
		4: {
			title: 'Arquitectura de Metas y Expectativas',
			mentorName: 'Kira Yamada',
			mentorAvatar: '/learn_resources/characters/char_kira.png',
			tip: 'Bienvenido de nuevo, Agente. Kira ha diseñado una simulación con 21 escenarios para evaluar cómo calibras la matriz de expectativas y estructuras las metas principales y secundarias:',
			instructions: [
				'<strong>21 Preguntas de Calibración:</strong> Resolverás los 3 bloques temáticos de 7 preguntas cada uno.',
				'<strong>Criterio de Estrellas:</strong> Se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas.',
				'<strong>Tabla de Conversión:</strong> 18+ netos = 5 estrellas, 12+ netos = 4 estrellas, 6+ netos = 3 estrellas, 1+ netos = 2 estrellas, -5+ netos = 1 estrella.',
				'<strong>Monedas BEM:</strong> Cada estrella obtenida te otorga <strong>+5 BEM Coins</strong>, acumulando hasta un máximo de 50 de por vida en este entrenamiento.'
			]
		},
		5: {
			title: 'Llamados a la Acción y Capturadores de Atención',
			mentorName: 'Sara Arbeláez',
			mentorAvatar: '/learn_resources/characters/char_sara_animated.gif',
			tip: 'Bienvenido, Agente. Sara ha diseñado una simulación con 21 escenarios de la vida real para calibrar tus instintos sobre cómo capturar la atención de tus estudiantes mediante llamados conductuales correctos:',
			instructions: [
				'<strong>3 Bloques de Atención (21 preguntas):</strong> Evaluarás casos sobre Hábitos (Bloque A), Timing y Ritmo (Bloque B) e Impacto Emocional y Ansiedad (Bloque C).',
				'<strong>Calibración de Calidad:</strong> El sistema calculará tu puntuación neta (Aciertos menos Errores) para determinar tus estrellas de calibración.',
				'<strong>Conversión de Estrellas:</strong> 18+ netos = 5 estrellas, 12+ netos = 4 estrellas, 6+ netos = 3 estrellas, 1+ netos = 2 estrellas, -5+ netos = 1 estrella.',
				'<strong>Monedas BEM:</strong> Obtén hasta 5 estrellas. Cada una te otorga <strong>+5 BEM Coins</strong> (máximo 50 de por vida en este entrenamiento).'
			]
		}
	};

	const config = $derived(trainingConfigs[world.id] || {
		title: 'Entrenamiento del Simulador',
		mentorName: 'Mentor',
		mentorAvatar: '/learn_resources/characters/char_sara.png',
		tip: 'Calibra tus instintos completando este simulador interactivo.',
		instructions: []
	});

	// Session states
	let gameStateStep = $state<'intro' | 'game' | 'summary'>('intro');
	let isSubmitting = $state(false);
	let retryKey = $state(0);

	// Score and metrics states
	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);
	let netScore = $state(0);
	let starsCount = $state(0);
	let customStats = $state<any[]>([]);

	// World 1 specific karma tracking
	let driverStats = $state<any>(null);
	let blockCorrect = $state<any>(null);

	// Lifetime Cap progress tracking
	const lifetimeCoinsEarned = $derived(player.game_state?.[world.id]?.training_coins_gained || 0);
	const remainingToCap = $derived(Math.max(0, 50 - lifetimeCoinsEarned));
	const actualCoinsAwarded = $derived.by(() => {
		const coinsEarned = starsCount * 5;
		return Math.min(remainingToCap, coinsEarned);
	});

	const scoreScales: Record<number, (results: any, correct: number, incorrect: number) => {
		netScore: number;
		starsCount: number;
		customStats: any[];
		driverStats?: any;
		blockCorrect?: any;
	}> = {
		1: (results, correct, incorrect) => {
			const net = correct - incorrect;
			return {
				netScore: net,
				starsCount: net >= 18 ? 5 : (net >= 12 ? 4 : (net >= 6 ? 3 : (net >= 1 ? 2 : (net >= -5 ? 1 : 0)))),
				driverStats: results.driverStats,
				customStats: []
			};
		},
		2: (results, correct, incorrect) => {
			const net = results.personalScore || 0;
			return {
				netScore: net,
				starsCount: net >= 18 ? 5 : (net >= 14 ? 4 : (net >= 10 ? 3 : (net >= 6 ? 2 : (net >= 1 ? 1 : 0)))),
				customStats: [
					{ label: 'Aciertos de Categoría (Goal, Feedback, Reward)', value: `${results.totalCorrectCols || 0} / 10` },
					{ label: 'Aciertos de Regulación (Teoría RII)', value: `${results.totalCorrectRows || 0} / 10` },
					{ label: 'Ubicaciones Perfectas (Matriz 3x3)', value: `${results.totalPerfectRounds || 0} / 10`, highlight: true },
					{ label: 'Puntaje Final', value: `${results.personalScore || 0} / 20 pts`, highlight: true }
				]
			};
		},
		3: (results, correct, incorrect) => {
			const net = correct - incorrect;
			return {
				netScore: net,
				starsCount: net >= 9 ? 5 : (net >= 6 ? 4 : (net >= 3 ? 3 : (net >= 1 ? 2 : (net >= -2 ? 1 : 0)))),
				customStats: [
					{ label: 'Aciertos:', value: correct },
					{ label: 'Errores:', value: incorrect },
					{ label: 'Puntaje Neto Final', value: `${net} pts`, highlight: true }
				]
			};
		},
		4: (results, correct, incorrect) => {
			const net = correct - incorrect;
			return {
				netScore: net,
				starsCount: net >= 18 ? 5 : (net >= 12 ? 4 : (net >= 6 ? 3 : (net >= 1 ? 2 : (net >= -5 ? 1 : 0)))),
				blockCorrect: results.blockCorrect,
				customStats: [
					{ label: 'Aciertos:', value: correct },
					{ label: 'Errores:', value: incorrect },
					{ label: 'Puntaje Neto Final', value: `${net} pts`, highlight: true }
				]
			};
		},
		5: (results, correct, incorrect) => {
			const net = correct - incorrect;
			return {
				netScore: net,
				starsCount: net >= 18 ? 5 : (net >= 12 ? 4 : (net >= 6 ? 3 : (net >= 1 ? 2 : (net >= -5 ? 1 : 0)))),
				blockCorrect: results.blockCorrect,
				customStats: [
					{ label: 'Aciertos:', value: correct },
					{ label: 'Errores:', value: incorrect },
					{ label: 'Puntaje Neto Final', value: `${net} pts`, highlight: true }
				]
			};
		}
	};

	function handleStartGame() {
		gameStateStep = 'game';
	}

	function handleGameComplete(results: any) {
		totalCorrect = results.totalCorrect || 0;
		totalIncorrect = results.totalIncorrect || 0;
		
		const scorer = scoreScales[world.id];
		if (scorer) {
			const scoreRes = scorer(results, totalCorrect, totalIncorrect);
			netScore = scoreRes.netScore;
			starsCount = scoreRes.starsCount;
			customStats = scoreRes.customStats;
			driverStats = scoreRes.driverStats || null;
			blockCorrect = scoreRes.blockCorrect || null;
		}

		gameStateStep = 'summary';
	}

	function handleRetry() {
		retryKey++;
		gameStateStep = 'game';
	}

	// Karma visual dot placement calculation for World 1
	function getKarmaPercentage(correct: number, wrong: number) {
		const score = correct - wrong;
		const clamped = Math.max(-3, Math.min(3, score));
		return ((clamped + 3) / 6) * 100;
	}
</script>

<div class="world-training-fullscreen" in:fade>
	<div class="training-content-container">
		<!-- HEADER BAR -->
		<div class="training-top-bar flex items-center justify-between mb-6">
			<div class="training-header-title text-left">
				<span class="agency-tag-sm">📚 ENTRENAMIENTO OMIE</span>
				<h3>{config.title}</h3>
			</div>
			<button type="button" class="btn-solar-secondary btn-sm flex items-center gap-1" onclick={onComplete}>
				✕ Salir del Simulador
			</button>
		</div>

		{#if gameStateStep === 'intro'}
			<TrainingIntro 
				mentorName={config.mentorName} 
				mentorAvatar={config.mentorAvatar} 
				title={config.title} 
				tip={config.tip} 
				instructions={config.instructions} 
				onStart={handleStartGame} 
			/>
		{/if}

		{#if gameStateStep === 'game'}
			{#key retryKey}
				{#if world.id === 1}
					<World1Training 
						world={world} 
						player={player} 
						onGameComplete={handleGameComplete} 
						onUpdateCoins={onUpdateCoins} 
					/>
				{:else if world.id === 2}
					<World2Training 
						world={world} 
						player={player} 
						onGameComplete={handleGameComplete} 
						onUpdateCoins={onUpdateCoins} 
					/>
				{:else if world.id === 3}
					<World3Training 
						world={world} 
						player={player} 
						onGameComplete={handleGameComplete} 
						onUpdateCoins={onUpdateCoins} 
					/>
				{:else if world.id === 4}
					<World4Training 
						world={world} 
						player={player} 
						onGameComplete={handleGameComplete} 
						onUpdateCoins={onUpdateCoins} 
					/>
				{:else if world.id === 5}
					<World5Training 
						world={world} 
						player={player} 
						onGameComplete={handleGameComplete} 
						onUpdateCoins={onUpdateCoins} 
					/>
				{/if}
			{/key}
		{/if}

		{#if gameStateStep === 'summary'}
			<form
				method="POST"
				action="?/completeTrainingTrivia"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success' && result.data) {
							onUpdateCoins(result.data.coins, result.data.game_state);
							onComplete();
						}
						await update();
					};
				}}
			>
				{#if blockCorrect}
					<input type="hidden" name="block_correct_a" value={blockCorrect.A} />
					<input type="hidden" name="block_correct_b" value={blockCorrect.B} />
					<input type="hidden" name="block_correct_c" value={blockCorrect.C} />
				{/if}
				<TrainingSummary 
					worldId={world.id}
					totalCorrect={totalCorrect}
					totalIncorrect={totalIncorrect}
					netScore={netScore}
					starsCount={starsCount}
					actualCoinsAwarded={actualCoinsAwarded}
					lifetimeCoinsEarned={lifetimeCoinsEarned}
					remainingToCap={remainingToCap}
					isSubmitting={isSubmitting}
					onRetry={handleRetry}
					customStats={customStats}
				>
					{#if world.id === 1 && driverStats}
						<div class="karma-section text-left mb-6 p-6 glass-card">
							<h4 class="karma-title text-center mb-4">🔮 ALINEACIÓN DE TU KARMA BEM</h4>
							<p class="text-xs text-center text-solar-text-muted mb-6">
								El Karma inicia al centro (0). Los aciertos lo mueven a la derecha (+ verde) y los errores o respuestas incorrectas cruzadas lo mueven a la izquierda (- rojo).
							</p>
							
							<div class="karma-bars-list flex flex-col gap-5">
								{#each Object.keys(driverStats) as driver}
									{@const correct = driverStats[driver].correct}
									{@const wrong = driverStats[driver].wrong}
									{@const karma = correct - wrong}
									{@const pct = getKarmaPercentage(correct, wrong)}
									
									<div class="karma-bar-item flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pb-4 border-b border-dashed border-solar-card-border">
										<span class="driver-name font-bold text-solar-green-dark text-sm">{driver}</span>
										
										<div class="karma-track-wrapper flex-1 flex items-center gap-3">
											<span class="track-limit wrong text-xs font-bold text-solar-terracotta">-3</span>
											<div class="karma-track relative w-full h-3 bg-gray-200 rounded-full">
												<!-- Zero Center Marker -->
												<div class="karma-mid-line absolute left-1/2 top-0 w-0.5 h-full bg-gray-400 z-10"></div>

												<!-- Sliding Dot -->
												<div 
													class="karma-dot absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md transition-all duration-500 z-20" 
													style="left: {pct}%" 
													class:red={karma < 0} 
													class:green={karma > 0}
													class:neutral={karma === 0}
												></div>
											</div>
											<span class="track-limit correct text-xs font-bold text-solar-green-medium">+3</span>
										</div>

										<span class="score-indicator-pill text-xs font-bold px-2 py-1 rounded" class:red={karma < 0} class:green={karma > 0}>
											{karma > 0 ? '+' : ''}{karma} Karma
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</TrainingSummary>
			</form>
		{/if}
		<div class="training-bottom-spacer"></div>
	</div>
</div>

<style>
	.training-bottom-spacer {
		height: 5rem;
		width: 100%;
		flex-shrink: 0;
	}

	.world-training-fullscreen {
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

	.training-content-container {
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
		.training-content-container {
			padding: 1.5rem 1rem;
		}
	}

	.training-top-bar {
		border-bottom: 1px solid var(--color-solar-card-border, rgba(0, 0, 0, 0.08));
		padding-bottom: 1rem;
	}

	.agency-tag-sm {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0369a1);
		background: var(--color-solar-sky-light, #e0f2fe);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.05em;
	}

	.training-header-title h3 {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0.25rem 0 0;
	}

	.btn-solar-secondary {
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 750;
		border-radius: 12px;
	}

	.flex { display: flex; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.gap-1 { gap: 0.25rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.text-left { text-align: left; }

	/* Karma Bars specific styles (World 1 summary override) */
	.karma-section {
		background: rgba(255, 255, 255, 0.75);
		border-radius: 24px;
		border: 1px solid rgba(0,0,0,0.05);
	}
	.karma-title {
		font-size: 0.95rem;
		font-weight: 850;
		letter-spacing: 0.02em;
	}
	.driver-name {
		width: 120px;
		flex-shrink: 0;
	}
	.karma-dot.red { background: var(--color-solar-terracotta, #e11d48); box-shadow: 0 0 6px rgba(225,29,72,0.5); }
	.karma-dot.green { background: var(--color-solar-green-medium, #3d8f68); box-shadow: 0 0 6px rgba(61,143,104,0.5); }
	.karma-dot.neutral { background: #9ca3af; }
	.score-indicator-pill.red { background: #fee2e2; color: #b91c1c; }
	.score-indicator-pill.green { background: #d1f5e3; color: #1e4533; }
</style>
