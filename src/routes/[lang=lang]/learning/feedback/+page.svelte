<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { slide, fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	let selectedScoreId = $state<string | null>(null);

	const t = $derived({
		en: {
			title: 'Interfaces & Points as Grammar | BEM Framework Chapter 6',
			desc: 'Understand BEM Chapter 6: Interface design, noise vs signal, and the 12 BEM score taxonomies representing the grammar of motivation.',
			header: 'Interfaces & Points as Grammar',
			sub: 'Chapter 6: Tokenizing information, reducing noise, and designing gamified feedback economies.',
			aeoSummary: 'BEM Chapter 6 establishes that points/scores are not just external rewards, but the "grammar" of the system. An interface is any channel that transmits state information. The BEM designer reduces cognitive load by eliminating noisy signals and "tokenizing" domain knowledge into dashboards, chips, and a strict taxonomy of BEM point types.',
			subtabs: [
				{ label: 'Overview', href: `/${lang}/learning` },
				{ label: 'Learning as Interaction', href: `/${lang}/learning/interaction` },
				{ label: 'Ludic Learning Cycles', href: `/${lang}/learning/cycles` },
				{ label: 'Designing Objectives', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces & Points', href: `/${lang}/learning/feedback`, active: true }
			],
			cabinetTitle: 'Points Taxonomy: Click a Card to Explore',
			scores: [
				{ id: 'xp', name: 'Experience Points (XP)', driver: 'Mastery & Progress', desc: 'Used to pace progress and make long-term milestones visible. Unlike other systems, XP should never be deducted to punish errors.', eg: 'A programming track where completing functions fills a cumulative level bar.' },
				{ id: 'ps', name: 'Performance Scores (PS)', driver: 'Mastery & Progress', desc: 'Longitudinal, informative indicators of competence. Replaces static grade averages with trend readings to encourage reattempts.', eg: 'Unlocking "Three Crowns" representing successful runs over time.' },
				{ id: 'ks', name: 'Skill Scores (KS)', driver: 'Mastery & Progress', desc: 'Differentiates complex dimensions of capability, preventing progress from being perceived as linear or monolithic.', eg: 'In art class, tracking "Color Theory Score" vs "Composition Score" separately.' },
				{ id: 'es', name: 'Endurance Scores (ES)', driver: 'Mastery & Progress', desc: 'Tracks attempts to explicitly reframe error not as failure, but as cumulative evidence of active persistence.', eg: 'A complex puzzle displaying "Attempts: 12" to normalize difficulty.' },
				{ id: 'cp', name: 'Currency Points (CP)', driver: 'Efficiency & Productivity', desc: 'Enables micro-economies and strategic choices, allowing players to buy hints, select challenges, and manage risk.', eg: 'Spending accumulated CP to unlock advanced coaching case studies.' },
				{ id: 'bp', name: 'Bet Points (BP)', driver: 'Discovery & Creativity', desc: 'Forces learners to make their metacognitive confidence level explicit by wagering points under uncertainty.', eg: 'Wagering 1, 3, or 5 points on a multiple-choice chemistry prediction.' },
				{ id: 'xs', name: 'Exploration Scores (XS)', driver: 'Discovery & Creativity', desc: 'Maps the breadth of the non-linear experience, activating the need for completion by revealing hidden optional paths.', eg: 'A course map showing: "60% of BEM subframeworks explored".' },
				{ id: 'us', name: 'Unlock Scores (US)', driver: 'Discovery & Creativity', desc: 'Threshold counters that automatically trigger system state transitions once a milestone is crossed.', eg: 'Gathering 6 "theory fragments" to unlock the final sandbox project.' },
				{ id: 'fs', name: 'Focus Scores (FS)', driver: 'Discovery & Creativity', desc: 'High-contrast notifications and sensory triggers designed specifically to capture immediate attentional focus.', eg: 'A glowing alert indicating: "2 new premium coding exercises available".' },
				{ id: 'rp', name: 'Resource Points (RP)', driver: 'Empowerment & Control', desc: 'Represents limited functional materials that are consumed to enable concrete game actions and build mental models.', eg: 'Using "Chemical Reagent Tokens" to conduct digital lab experiments.' },
				{ id: 'ss', name: 'Social Scores (SS)', driver: 'Bonding & Empathy', desc: 'Captures social consensus, group votes, or peer ratings, distributing the evaluative load beyond a single instructor.', eg: 'Workgroups voting on the clarity and elegance of peer presentations.' },
				{ id: 'bs', name: 'Beauty Scores (BS)', driver: 'Bonding & Empathy', desc: 'Evaluates qualitative, subjective beauty and elegance, showing that learning is not just functional but autotelic.', eg: 'Assigning scores for the "mathematical elegance" of a physics proof.' }
			]
		},
		es: {
			title: 'Interfaces y Puntos como Gramática | BEM Framework Capítulo 6',
			desc: 'Comprende el Capítulo 6 de BEM: Diseño de interfaces, señal vs ruido y las 12 taxonomías de puntos que estructuran la motivación.',
			header: 'Interfaces y Puntos como Gramática',
			sub: 'Capítulo 6: Tokenización, reducción de ruido y diseño de economías de feedback.',
			aeoSummary: 'El Capítulo 6 de BEM define a los puntos como la "gramática" del sistema interactivo. El diseñador reduce la carga cognitiva eliminando el ruido visual y "tokenizando" los conocimientos en indicadores, fichas y una taxonomía de tipos de puntos.',
			subtabs: [
				{ label: 'Visión General', href: `/${lang}/learning` },
				{ label: 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction` },
				{ label: 'Ciclos de Aprendizaje', href: `/${lang}/learning/cycles` },
				{ label: 'Diseño de Objetivos', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces y Puntos', href: `/${lang}/learning/feedback`, active: true }
			],
			cabinetTitle: 'Taxonomía de Puntos: Haz clic en una Tarjeta',
			scores: [
				{ id: 'xp', name: 'Puntos de Experiencia (XP)', driver: 'Maestría y Progreso', desc: 'Miden el avance a largo plazo y marcan hitos. En BEM, las XP son acumulativas y nunca se restan para penalizar.', eg: 'Llenar un medidor de nivel al completar ejercicios de código.' },
				{ id: 'ps', name: 'Puntajes de Rendimiento (PS)', driver: 'Maestría y Progreso', desc: 'Indicadores informativos que muestran tendencias de desempeño longitudinales, separando el error del castigo.', eg: 'Obtener "Tres Coronas" tras completar un módulo sin errores críticos.' },
				{ id: 'ks', name: 'Puntajes de Habilidad (KS)', driver: 'Maestría y Progreso', desc: 'Representan sistemas complejos de competencia en múltiples dimensiones independientes.', eg: 'Medir por separado la habilidad en "Teoría del Color" vs "Composición".' },
				{ id: 'es', name: 'Puntajes de Resistencia (ES)', driver: 'Maestría y Progreso', desc: 'Monitorean el número de intentos para reencuadrar el error como persistencia activa (estilo Celeste).', eg: 'Mostrar "Intentos Realizados: 12" para normalizar la dificultad del reto.' },
				{ id: 'cp', name: 'Puntos de Divisa (CP)', driver: 'Eficiencia y Productividad', desc: 'Habilitan mercados lúdicos internos y decisiones autónomas (comprar pistas, elegir misiones secundarias).', eg: 'Gastar CP acumuladas para desbloquear tutorías personalizadas.' },
				{ id: 'bp', name: 'Puntos de Apuesta (BP)', driver: 'Descubrimiento y Curiosidad', desc: 'Obligan a explicitar la confianza metacognitiva, apostando puntos sobre predicciones bajo incertidumbre.', eg: 'Apostar 1, 3 o 5 puntos al elegir una hipótesis en física.' },
				{ id: 'xs', name: 'Puntajes de Exploración (XS)', driver: 'Descubrimiento y Curiosidad', desc: 'Miden el ancho del mapa de aprendizaje, activando el deseo de completitud al revelar rutas ocultas.', eg: 'Un mapa curricular mostrando: "60% de los subframeworks BEM explorados".' },
				{ id: 'us', name: 'Puntajes de Desbloqueo (US)', driver: 'Descubrimiento y Curiosidad', desc: 'Contadores de umbral que alteran automáticamente el estado del sistema cuando se cruza una meta.', eg: 'Reunir 6 "fragmentos teóricos" para desbloquear el proyecto integrador.' },
				{ id: 'fs', name: 'Puntajes de Foco (FS)', driver: 'Descubrimiento y Curiosidad', desc: 'Notificaciones de alto contraste visual diseñadas para dirigir la atención inmediata a zonas críticas.', eg: 'Un indicador parpadeante: "Nuevos desafíos semanales disponibles".' },
				{ id: 'rp', name: 'Puntos de Recursos (RP)', driver: 'Empoderamiento y Control', desc: 'Materiales consumibles que habilitan acciones lúdicas concretas y construyen metáforas de dominio.', eg: 'Usar "Fichas de Reactivo" para activar simulaciones en química.' },
				{ id: 'ss', name: 'Puntajes Sociales (SS)', driver: 'Vinculación y Empatía', desc: 'Capturan juicios colectivos y co-evaluaciones de pares, distribuyendo el peso de la evaluación de forma comunitaria.', eg: 'Grupos votando la elegancia y simplicidad del código de sus compañeros.' },
				{ id: 'bs', name: 'Puntajes de Belleza (BS)', driver: 'Vinculación y Empatía', desc: 'Miden la calidad estética y elegancia de una solución, mostrando que el aprendizaje es una experiencia autotélica.', eg: 'Asignar puntos a la "elegancia matemática" de una demostración de física.' }
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={t.header} description={t.sub} />

<section class="section learning-layout-view">
	<div class="container broad-layout">
		<!-- SIDEBAR NAVIGATION -->
		<aside class="sidebar-nav card glass-card">
			<h3>{lang === 'es' ? 'Capítulos BEM' : 'BEM Chapters'}</h3>
			<nav>
				{#each t.subtabs as sub}
					<a href={sub.href} class="nav-sublink" class:active={sub.active}>
						{sub.label}
					</a>
				{/each}
			</nav>
		</aside>

		<!-- MAIN READING CONTENT -->
		<main class="main-content card glass-card">
			<!-- AEO BOX -->
			<div class="aeo-summary-box">
				<h3>🤖 AI Engine Educational Synopsis</h3>
				<p>{t.aeoSummary}</p>
			</div>

			<h2>{lang === 'es' ? 'La Interfaz y la Modelación de la Información' : 'Interface Design & Information Modeling'}</h2>
			<p class="intro-paragraph">
				{lang === 'es'
					? 'Una interfaz no se limita a pantallas o botones. Es cualquier canal de transmisión de información. En BEM, el diseñador "tokeniza" la información para reducir la carga cognitiva extraneous, transformando el conocimiento en tableros, fichas y un lenguaje de puntos.'
					: 'An interface is not limited to screens or physical boards. It is any channel for information transmission that enables interaction. Under BEM, the designer "tokenizes" knowledge to reduce extraneous cognitive load, transforming information into dashboards, tokens, and a points grammar.'}
			</p>

			<h2>{t.cabinetTitle}</h2>
			
			<!-- INTERACTIVE POINTS TAXONOMY GRID -->
			<div class="scores-grid">
				{#each t.scores as score}
					<button 
						class="score-card-btn" 
						class:active={selectedScoreId === score.id}
						onclick={() => selectedScoreId = (selectedScoreId === score.id ? null : score.id)}
					>
						<div class="score-card-inner">
							<span class="driver-tag">{score.driver}</span>
							<h4>{score.name}</h4>
							<span class="click-reveal-text">{lang === 'es' ? 'Click para detalles' : 'Click for details'}</span>
						</div>
					</button>
				{/each}
			</div>

			<!-- EXPANDED DETAIL VIEW -->
			{#if selectedScoreId}
				{@const activeScore = t.scores.find(s => s.id === selectedScoreId)}
				{#if activeScore}
					<div class="score-detail-panel" transition:slide>
						<h3>📘 {activeScore.name}</h3>
						<span class="detail-driver">🎯 {lang === 'es' ? 'Motivador Principal:' : 'Main Driver:'} {activeScore.driver}</span>
						<p class="detail-desc">{activeScore.desc}</p>
						<div class="example-box">
							<strong>💡 {lang === 'es' ? 'Aplicación en Educación (BEM):' : 'BEM Educational Example:'}</strong>
							<p>{activeScore.eg}</p>
						</div>
					</div>
				{/if}
			{/if}
		</main>
	</div>
</section>

<style>
.learning-layout-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	max-width: 1280px !important;
	display: grid;
	grid-template-columns: 280px 1fr;
	gap: 3rem;
	align-items: start;
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

.sidebar-nav {
	padding: 2rem;
}

.sidebar-nav h3 {
	font-size: 1.1rem;
	font-weight: 800;
	margin-bottom: 1.5rem;
	color: var(--color-text);
	text-transform: uppercase;
}

.sidebar-nav nav {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.nav-sublink {
	padding: 0.75rem 1rem;
	font-weight: 700;
	font-size: 0.95rem;
	border-radius: var(--radius-sm);
	color: var(--color-text-muted);
	transition: var(--transition-fast);
}

.nav-sublink:hover {
	background: var(--color-bg-alt);
	color: var(--color-purple);
}

.nav-sublink.active {
	background: rgba(124, 58, 237, 0.08);
	color: var(--color-purple);
}

/* MAIN CONTENT */
.main-content h2 {
	font-size: 1.8rem;
	font-weight: 850;
	margin: 2.5rem 0 1rem;
}

.main-content h2:first-of-type {
	margin-top: 0;
}

.intro-paragraph {
	font-size: 1.25rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: 2.5rem;
}

.aeo-summary-box {
	background: rgba(124, 58, 237, 0.04);
	border-left: 4px solid var(--color-purple);
	padding: 1.5rem 2rem;
	border-radius: var(--radius-md);
	margin-bottom: 2.5rem;
}

.aeo-summary-box h3 {
	font-size: 1.05rem;
	font-weight: 800;
	color: var(--color-purple);
	margin: 0 0 0.5rem;
}

.aeo-summary-box p {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 600;
}

/* INTERACTIVE GRID */
.scores-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1.5rem;
	margin-bottom: 3rem;
}

.score-card-btn {
	background: var(--color-bg-alt);
	border: 2px solid var(--color-border);
	padding: 1.5rem;
	border-radius: var(--radius-md);
	cursor: pointer;
	text-align: left;
	transition: var(--transition-normal);
	display: block;
	width: 100%;
}

.score-card-btn:hover, .score-card-btn.active {
	border-color: var(--color-purple);
	background: white;
	transform: translateY(-3px);
	box-shadow: var(--shadow-md);
}

.score-card-inner {
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-between;
}

.driver-tag {
	font-size: 0.7rem;
	font-weight: 800;
	color: var(--color-purple);
	text-transform: uppercase;
	margin-bottom: 0.5rem;
}

.score-card-inner h4 {
	font-size: 1rem;
	font-weight: 800;
	color: var(--color-text);
	margin: 0 0 1rem;
	line-height: 1.25;
}

.click-reveal-text {
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--color-text-muted);
	text-transform: uppercase;
	opacity: 0.6;
}

/* DETAIL PANEL */
.score-detail-panel {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	border-left: 5px solid var(--color-purple);
	padding: 2.5rem;
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-lg);
	margin-top: 2rem;
}

.score-detail-panel h3 {
	font-size: 1.5rem;
	font-weight: 850;
	margin: 0 0 0.5rem;
	color: var(--color-text);
}

.detail-driver {
	display: inline-block;
	font-size: 0.85rem;
	font-weight: 800;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.08);
	padding: 0.35rem 0.75rem;
	border-radius: var(--radius-sm);
	margin-bottom: 1.5rem;
	text-transform: uppercase;
}

.detail-desc {
	font-size: 1.1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin-bottom: 1.5rem;
}

.example-box {
	background: white;
	border: 1px solid var(--color-border);
	padding: 1.5rem;
	border-radius: var(--radius-sm);
}

.example-box strong {
	font-size: 0.95rem;
	color: var(--color-text);
	display: block;
	margin-bottom: 0.5rem;
}

.example-box p {
	font-size: 0.95rem;
	color: var(--color-text-muted);
	margin: 0;
	line-height: 1.5;
}
</style>
