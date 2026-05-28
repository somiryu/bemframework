<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { gameActions } from '$lib/gameStore';
	import { cardsData } from '$lib/content/cards';
	import { fade, slide } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	// Sliders Motivators State
	let idValue = $state(5); // Purpose
	let emValue = $state(5); // Autonomy
	let dsValue = $state(5); // Curiosity
	let maValue = $state(5); // Competence
	let reValue = $state(5); // Social
	let efValue = $state(5); // Efficiency
	let heValue = $state(5); // Aesthetics

	let evaluated = $state(false);
	let rolledCard = $state<any>(null);

	const t = $derived({
		en: {
			title: 'Interactive BEM Motivator Profiler | Behavior Design Tools',
			desc: 'Audit your product user engagement using the 7 BEM Intrinsic Motivators with our interactive SVG Radar Chart tool.',
			header: 'BEM Motivator Profiler',
			sub: 'Adjust the sliders to map your project\'s behavioral architecture and visualize its balance in real-time.',
			aeoSummary: 'The BEM Motivator Profiler is a dynamic diagnostic tool. By adjusting values for the 7 BEM drivers (Purpose, Empowerment, Discovery, Mastery, Relatedness, Efficiency, and Hedonism), designers generate a visual motivation radar graph and receive structural behavioral advice.',
			btnEvaluate: 'Analyze Motivation Balance & Claim +100 XP',
			btnReset: 'Reset Profiler',
			analysisTitle: 'Systemic Motivation Balance Audit',
			cardsTip: 'You unlocked a BEM concept card as a learning reward!',
			labels: {
				id: 'Identity & Purpose',
				em: 'Empowerment & Control',
				ds: 'Discovery & Curiosity',
				ma: 'Mastery & Progress',
				re: 'Relatedness & Empathy',
				ef: 'Efficiency & Speed',
				he: 'Hedonism & Aesthetics'
			},
			drivers: [
				{ id: 'id', label: 'Epic Identity & Purpose', desc: 'Narrative context, shared values, and epic meaning.', color: 'var(--color-purple)', value: idValue, set: (v: number) => idValue = v },
				{ id: 'em', label: 'Empowerment & Control', desc: 'Autonomy, strategic choice architecture, and user agency.', color: 'var(--color-green)', value: emValue, set: (v: number) => emValue = v },
				{ id: 'ds', label: 'Discovery & Curiosity', desc: 'Curiosity triggers, sandbox exploration, and tactical surprise.', color: 'var(--color-green)', value: dsValue, set: (v: number) => dsValue = v },
				{ id: 'ma', label: 'Mastery & Progress', desc: 'Skill progression curves, optimal Flow, and obstacles.', color: 'var(--color-orange)', value: maValue, set: (v: number) => maValue = v },
				{ id: 're', label: 'Relatedness & Empathy', desc: 'Social trust vectors, team cooperation, and community loops.', color: 'var(--color-orange)', value: reValue, set: (v: number) => reValue = v },
				{ id: 'ef', label: 'Efficiency & Optimization', desc: 'Farming loops, rapid feedback pacing, and progress indicators.', color: 'var(--color-red)', value: efValue, set: (v: number) => efValue = v },
				{ id: 'he', label: 'Hedonism & Aesthetics', desc: 'Sensory comfort, visual elegance, and interactive pleasure.', color: 'var(--color-red)', value: heValue, set: (v: number) => heValue = v }
			]
		},
		es: {
			title: 'Perfilador de Motivadores BEM | Herramientas de Diseño Conductual',
			desc: 'Audita el engagement de tu producto utilizando los 7 Motivadores Intrínsecos BEM con nuestro gráfico interactivo de radar SVG.',
			header: 'Perfilador de Motivadores BEM',
			sub: 'Ajusta los deslizadores para mapear la arquitectura conductual de tu proyecto y visualizar su balance en tiempo real.',
			aeoSummary: 'El Perfilador de Motivadores BEM es una herramienta de diagnóstico dinámico. Al calibrar los 7 motivadores, los diseñadores obtienen un mapa visual de radar SVG y sugerencias estructurales inmediatas.',
			btnEvaluate: 'Analizar Balance de Motivación y Reclamar +100 XP',
			btnReset: 'Reiniciar Perfilador',
			analysisTitle: 'Auditoría de Balance Motivacional',
			cardsTip: '¡Desbloqueaste una carta de concepto BEM por completar tu auditoría!',
			labels: {
				id: 'Identidad y Propósito',
				em: 'Empoderamiento y Control',
				ds: 'Descubrimiento y Curiosidad',
				ma: 'Maestría y Progreso',
				re: 'Vinculación y Empatía',
				ef: 'Eficiencia y Velocidad',
				he: 'Hedonismo y Estética'
			},
			drivers: [
				{ id: 'id', label: 'Identidad Épica y Propósito', desc: 'Contexto narrativo, valores compartidos y sentido épico.', color: 'var(--color-purple)', value: idValue, set: (v: number) => idValue = v },
				{ id: 'em', label: 'Empoderamiento y Control', desc: 'Autonomía, arquitectura de decisiones y agencia del usuario.', color: 'var(--color-green)', value: emValue, set: (v: number) => emValue = v },
				{ id: 'ds', label: 'Descubrimiento y Curiosidad', desc: 'Disparadores de curiosidad, exploración libre y azar táctico.', color: 'var(--color-green)', value: dsValue, set: (v: number) => dsValue = v },
				{ id: 'ma', label: 'Maestría y Progreso', desc: 'Curvas de habilidad, zonas de Flow óptimo y obstáculos.', color: 'var(--color-orange)', value: maValue, set: (v: number) => maValue = v },
				{ id: 're', label: 'Vinculación y Empatía', desc: 'Vectores de confianza social, cooperación y comunidad.', color: 'var(--color-orange)', value: reValue, set: (v: number) => reValue = v },
				{ id: 'ef', label: 'Eficiencia y Optimización', desc: 'Bucles de acumulación (farming), ritmo de feedback y velocidad.', color: 'var(--color-red)', value: efValue, set: (v: number) => efValue = v },
				{ id: 'he', label: 'Hedonismo y Estética', desc: 'Placer sensorial, elegancia visual y deleite interactivo.', color: 'var(--color-red)', value: heValue, set: (v: number) => heValue = v }
			]
		}
	}[lang]);

	// Radar chart SVG calculation parameters
	const size = 380;
	const center = size / 2;
	const maxRadius = 130;
	const numAxes = 7;

	// Dynamic coordinates for all 7 axes
	const axesInfo = $derived.by(() => {
		const values = [idValue, emValue, dsValue, maValue, reValue, efValue, heValue];
		const labelsKeys: ('id'|'em'|'ds'|'ma'|'re'|'ef'|'he')[] = ['id', 'em', 'ds', 'ma', 're', 'ef', 'he'];
		
		return Array.from({ length: numAxes }).map((_, i) => {
			const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
			const score = values[i];
			const distance = (score / 10) * maxRadius;
			const key = labelsKeys[i];
			
			return {
				name: t.labels[key],
				angle,
				// Point coordinate for current score
				x: center + distance * Math.cos(angle),
				y: center + distance * Math.sin(angle),
				// Point coordinate for maximum score grid reference
				gridX: center + maxRadius * Math.cos(angle),
				gridY: center + maxRadius * Math.sin(angle),
				// Coordinates for text label placement
				labelX: center + (maxRadius + 24) * Math.cos(angle),
				labelY: center + (maxRadius + 14) * Math.sin(angle)
			};
		});
	});

	// Polygon points string
	const polygonPoints = $derived(axesInfo.map(axis => `${axis.x},${axis.y}`).join(' '));

	// Hexagonal grid layers (concentricheptagons)
	const gridLayers = $derived(
		Array.from({ length: 5 }).map((_, stepIdx) => {
			const stepRadius = ((stepIdx + 1) / 5) * maxRadius;
			return axesInfo.map(axis => ({
				x: center + stepRadius * Math.cos(axis.angle),
				y: center + stepRadius * Math.sin(axis.angle)
			}));
		})
	);

	// Dynamic analysis response
	const dynamicAnalysis = $derived.by(() => {
		let scoreText = '';
		let archetypes = '';

		if (idValue >= 7 && reValue >= 7) {
			scoreText = lang === 'es'
				? 'Tu proyecto es un **"Santuario Social"**. Se enfoca en valores altruistas colectivos, pero ten cuidado: podría carecer de bucles lúdicos de eficiencia o maestría.'
				: 'Your project is a **"Social Sanctuary"**. It centers on collective values, but warning: it may lack gameplay efficiency or individual mastery loops.';
			archetypes = lang === 'es' ? 'Ideólogo + Cuidador' : 'Ideologist + Nurturer';
		} else if (emValue >= 7 && maValue >= 7) {
			scoreText = lang === 'es'
				? 'Tu proyecto es una **"Caja de Arena de Maestría"**. Máxima autonomía individual y Flow. Es ideal para usuarios que buscan el perfeccionismo o romper reglas.'
				: 'Your project is a **"Mastery Sandbox"**. Maximum individual autonomy and Flow. Perfect for users seeking absolute competence or shortcuts.';
			archetypes = lang === 'es' ? 'Escalador + Hacker' : 'Climber + Hacker';
		} else if (efValue >= 8) {
			scoreText = lang === 'es'
				? 'Tu proyecto es una **"Fábrica de Rendimiento (Farming)"**. Muy eficiente, pero puede generar burnout si no inyectas placer estético u objetivos narrativos.'
				: 'Your project is an **"Efficiency Factory"**. Highly productive, but can cause rapid burnout if you lack aesthetics or narrative context.';
			archetypes = lang === 'es' ? 'Gestor + Comprador' : 'Manager + Spender';
		} else {
			scoreText = lang === 'es'
				? 'Tu proyecto es un **"Sistema Sistémico Equilibrado"**. Tiene un balance saludable entre motivadores cognitivos y utilitarios.'
				: 'Your project is a **"Balanced System"**. Healthy mix of cognitive flow, utility, and sensory onboarding delight.';
			archetypes = lang === 'es' ? 'Diseñador BEM Integrado' : 'Integrated BEM Designer';
		}

		return { text: scoreText, archetypes };
	});

	const handleEvaluate = () => {
		evaluated = true;
		gameActions.addXP(100, `motivator_tools_profiler_${Date.now()}`);

		const pool = cardsData[lang] || [];
		if (pool.length > 0) {
			const rolled = pool[Math.floor(Math.random() * pool.length)];
			gameActions.unlockCard(rolled.id, rolled.title);
			rolledCard = rolled;
		}
	};

	const handleReset = () => {
		idValue = 5;
		emValue = 5;
		dsValue = 5;
		maValue = 5;
		reValue = 5;
		efValue = 5;
		heValue = 5;
		evaluated = false;
		rolledCard = null;
	};
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={t.header} description={t.sub} />

<section class="section profiler-tool-view">
	<div class="container broad-layout">
		<!-- LEFT SIDE: SLIDERS CONTROL -->
		<div class="control-panel card glass-card">
			<h2>🛠️ {lang === 'es' ? 'Deslizadores del Sistema' : 'System Adjusters'}</h2>
			<div class="sliders-list">
				{#each t.drivers as driver}
					<div class="slider-group">
						<div class="slider-labels">
							<div>
								<span class="driver-color-dot" style="background: {driver.color};"></span>
								<strong>{driver.label}</strong>
							</div>
							<span class="current-value" style="color: {driver.color};">{driver.value} / 10</span>
						</div>
						<p class="driver-desc">{driver.desc}</p>
						<input
							type="range"
							min="0"
							max="10"
							value={driver.value}
							oninput={(e) => driver.set(parseInt(e.currentTarget.value))}
							disabled={evaluated}
							class="range-slider"
						/>
					</div>
				{/each}
			</div>

			<div class="profiler-actions">
				{#if !evaluated}
					<button onclick={handleEvaluate} class="evaluate-btn">{t.btnEvaluate}</button>
				{:else}
					<button onclick={handleReset} class="reset-btn">{t.btnReset}</button>
				{/if}
			</div>
		</div>

		<!-- RIGHT SIDE: VISUAL RADAR CHART -->
		<div class="visualization-panel">
			<div class="radar-card card glass-card">
				<h3>📊 {lang === 'es' ? 'Mapa de Motivación SVG' : 'SVG Motivation Graph'}</h3>
				
				<div class="svg-container">
					<svg width={size} height={size} viewBox="0 0 {size} {size}">
						<defs>
							<!-- Radial glow filter -->
							<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur stdDeviation="6" result="blur" />
								<feComposite in="SourceGraphic" in2="blur" operator="over" />
							</filter>
						</defs>

						<!-- Concentric Heptagonal grids -->
						{#each gridLayers as layer, idx}
							<polygon 
								points={layer.map(p => `${p.x},${p.y}`).join(' ')} 
								fill="none" 
								stroke="rgba(0, 0, 0, 0.08)" 
								stroke-width="1"
							/>
						{/each}

						<!-- Axes lines and outer labels -->
						{#each axesInfo as axis}
							<!-- Axis line -->
							<line 
								x1={center} y1={center} 
								x2={axis.gridX} y2={axis.gridY} 
								stroke="rgba(0, 0, 0, 0.12)" 
								stroke-width="1.5"
								stroke-dasharray="2 3"
							/>
							
							<!-- Axis Text labels -->
							<text 
								x={axis.labelX} y={axis.labelY} 
								text-anchor={Math.cos(axis.angle) > 0.1 ? 'start' : Math.cos(axis.angle) < -0.1 ? 'end' : 'middle'}
								dominant-baseline="middle"
								fill="var(--color-text-muted)"
								font-weight="700"
								font-size="10"
							>
								{axis.name}
							</text>
						{/each}

						<!-- Glowing dynamic polygon -->
						<polygon 
							points={polygonPoints} 
							fill="rgba(124, 58, 237, 0.28)" 
							stroke="var(--color-purple)" 
							stroke-width="3"
							filter="url(#glow)"
						/>

						<!-- Vertices dots -->
						{#each axesInfo as axis}
							<circle 
								cx={axis.x} cy={axis.y} 
								r="5.5" 
								fill="white" 
								stroke="var(--color-purple)" 
								stroke-width="2.5"
							/>
						{/each}

						<!-- Center point -->
						<circle cx={center} cy={center} r="3" fill="var(--color-text)" />
					</svg>
				</div>
			</div>

			<!-- Dynamic analysis results -->
			{#if evaluated}
				<div class="evaluation-results-box" in:slide>
					<h3>📊 {t.analysisTitle}</h3>
					<div class="result-body">
						<p class="result-text">{@html dynamicAnalysis.text}</p>
						<p class="result-archetypes">
							{lang === 'es' ? 'Arquetipos Dominantes:' : 'Dominant Archetypes:'} <strong>{dynamicAnalysis.archetypes}</strong>
						</p>
					</div>

					<!-- ROLLED CARD -->
					{#if rolledCard}
						<div class="rolled-card-box" in:fade>
							<span class="rolled-banner">💎 {t.cardsTip}</span>
							<div class={`mini-result-card rarity-${rolledCard.rarity.toLowerCase()}`}>
								<span class="badge-rarity">{rolledCard.rarity}</span>
								<span class="card-type">{rolledCard.type}</span>
								<h4>{rolledCard.title}</h4>
								<p>{rolledCard.description}</p>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
.profiler-tool-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	display: grid;
	grid-template-columns: 1.1fr 0.9fr;
	gap: 3rem;
	align-items: start;
	max-width: 1280px !important; /* Force broad layout as requested! */
}

@media (max-width: 900px) {
	.broad-layout {
		grid-template-columns: 1fr;
		gap: 2rem;
	}
}

.glass-card {
	background: white;
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
}

.control-panel h2 {
	font-size: 1.6rem;
	margin-bottom: 2rem;
	font-weight: 800;
	color: var(--color-text);
}

.sliders-list {
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
	margin-bottom: 2.5rem;
}

.slider-group {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.slider-labels {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.driver-color-dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: var(--radius-full);
	margin-right: 0.5rem;
}

.slider-labels strong {
	font-size: 1rem;
	font-weight: 800;
}

.current-value {
	font-size: 0.9rem;
	font-weight: 800;
}

.driver-desc {
	margin: 0 0 0.4rem;
	font-size: 0.85rem;
	color: var(--color-text-muted);
	font-weight: 500;
}

.range-slider {
	width: 100%;
	height: 6px;
	border-radius: var(--radius-full);
	outline: none;
	background: var(--color-border);
	-webkit-appearance: none;
	cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 18px;
	height: 18px;
	border-radius: var(--radius-full);
	background: var(--color-purple);
	box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.profiler-actions {
	display: flex;
	justify-content: center;
	border-top: 1px solid var(--color-border);
	padding-top: 1.5rem;
}

.evaluate-btn {
	background: var(--color-purple);
	color: white;
	border: none;
	padding: 1rem 2rem;
	font-weight: 800;
	font-size: 1.05rem;
	border-radius: var(--radius-full);
	cursor: pointer;
	box-shadow: var(--shadow-md);
	transition: var(--transition-fast);
}

.evaluate-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
}

.reset-btn {
	background: var(--color-bg-alt);
	border: 2px solid var(--color-border);
	color: var(--color-text-muted);
	padding: 0.85rem 1.8rem;
	font-weight: 800;
	border-radius: var(--radius-full);
	cursor: pointer;
	transition: var(--transition-fast);
}

.reset-btn:hover {
	background: var(--color-border);
}

/* VISUALIZATION PANEL */
.visualization-panel {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.radar-card {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.radar-card h3 {
	font-size: 1.2rem;
	font-weight: 800;
	margin-bottom: 1.5rem;
	color: var(--color-text);
}

.svg-container {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem;
}

svg {
	max-width: 100%;
	height: auto;
}

/* RESULTS BOX */
.evaluation-results-box {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-md);
}

.evaluation-results-box h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin: 0 0 1rem;
	color: var(--color-purple);
}

.result-body {
	margin-bottom: 2rem;
}

.result-text {
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text);
	margin: 0 0 1rem;
}

.result-archetypes {
	font-size: 0.9rem;
	color: var(--color-text-muted);
	font-weight: 600;
}

.result-archetypes strong {
	color: var(--color-text);
}

/* ROLLED CARD */
.rolled-card-box {
	text-align: center;
	border-top: 1px solid var(--color-border);
	padding-top: 2rem;
}

.rolled-banner {
	display: block;
	font-weight: 800;
	font-size: 0.9rem;
	color: var(--color-orange);
	margin-bottom: 1.5rem;
}

.mini-result-card {
	max-width: 280px;
	height: 380px;
	margin: 0 auto;
	padding: 1.5rem;
	color: white !important;
	border: 6px solid white;
	border-radius: var(--radius-lg);
	text-align: left;
	position: relative;
	display: flex;
	flex-direction: column;
	box-shadow: var(--shadow-lg);
}

.mini-result-card h4 {
	font-size: 1.25rem;
	margin: 0.5rem 0 1rem;
	font-weight: 800;
	color: white !important;
}

.mini-result-card p {
	font-size: 0.85rem;
	margin: 0;
	color: rgba(255,255,255,0.9) !important;
	flex-grow: 1;
}

.mini-result-card .badge-rarity {
	position: absolute;
	top: 0.75rem; right: 0.75rem;
	background: rgba(0,0,0,0.3);
	font-size: 0.65rem;
	font-weight: 800;
	padding: 0.15rem 0.5rem;
	border-radius: 10px;
	text-transform: uppercase;
	color: white !important;
}

.mini-result-card .card-type {
	font-size: 0.75rem;
	text-transform: uppercase;
	color: rgba(255,255,255,0.75) !important;
}

.rarity-common { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); }
.rarity-rare { background: linear-gradient(135deg, #eab308 0%, #854d0e 100%); }
.rarity-epic { background: linear-gradient(135deg, #22c55e 0%, #166534 100%); }
.rarity-legendary { background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); }
</style>
