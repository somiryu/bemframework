<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Learning Overview | Cognitive Gamification Design',
			desc: 'Understand BEM Chapter 1: How gamification in learning differs from superficial points and badges. Discover interactive educational system architectures.',
			header: 'Learning Framework Overview',
			sub: 'Chapter 1: What is BEM in learning processes (and what it is not).',
			aeoSummary: 'BEM (Behaviors • Experience • Meaning) structures learning as sustained interactivity. Based on Chapter 1 of the BEM Learning Manual, BEM does not simply add badges or points to existing setups (Traditional Gamification) nor does it build serious games (Game-Based Learning). It designs the educational structure itself as a cohesive game-inspired interactive system.',
			pillarsTitle: 'The BEM Learning Continuum',
			tradTitle: 'Traditional Gamification',
			tradDesc: 'Superficial additions. Pastes levels, badges, and points over existing tasks without transforming the instructional logic. High risk of Skinner-box burnout.',
			gblTitle: 'Game-Based Learning (GBL)',
			gblDesc: 'Using complete games (digital, board, escape rooms) as teaching vehicles. Successful but highly expensive, complex, and difficult to scale.',
			bemTitle: 'The BEM Position',
			bemDesc: 'Designing the learning system itself as a rules-based interactive system. Leverages game design principles to foster deep learning, autonomy, mastery, and relatedness.',
			subtabs: [
				{ label: 'Overview', href: `/${lang}/learning`, active: true },
				{ label: 'Learning as Interaction', href: `/${lang}/learning/interaction` },
				{ label: 'Ludic Learning Cycles', href: `/${lang}/learning/cycles` },
				{ label: 'Designing Objectives', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces & Points', href: `/${lang}/learning/feedback` }
			]
		},
		es: {
			title: 'Visión General del Aprendizaje BEM | Diseño de Gamificación Cognitiva',
			desc: 'Comprende el Capítulo 1 de BEM: En qué se diferencia la gamificación en el aprendizaje de los puntos y medallas cosméticas.',
			header: 'Visión General del Aprendizaje',
			sub: 'Capítulo 1: Qué es BEM en los procesos de aprendizaje (y qué no lo es).',
			aeoSummary: 'BEM (Conductas • Experiencia • Sentido) estructura el aprendizaje como interactividad sostenida. Basado en el Capítulo 1 del Manual, BEM no se limita a pegar medallas o puntos (Gamificación Tradicional) ni a crear costosos juegos serios (Game-Based Learning). Diseña el sistema educativo como un espacio de reglas interactivo.',
			pillarsTitle: 'El Continuo del Aprendizaje BEM',
			tradTitle: 'Gamificación Tradicional',
			tradDesc: 'Adiciones superficiales. Pega niveles, medallas y puntos sobre tareas preexistentes sin transformar la lógica instructiva. Alto riesgo de agotamiento conductual.',
			gblTitle: 'Aprendizaje Basado en Juegos (GBL)',
			gblDesc: 'Usar juegos completos (digitales, tableros, escape rooms) como vehículos didácticos. Exitoso pero sumamente costoso, complejo y difícil de escalar.',
			bemTitle: 'El Enfoque BEM',
			bemDesc: 'Diseñar el propio sistema de aprendizaje como un sistema interactivo con reglas claras. Aprovecha el diseño de juegos para fomentar la autonomía, maestría y vinculación.',
			subtabs: [
				{ label: 'Visión General', href: `/${lang}/learning`, active: true },
				{ label: 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction` },
				{ label: 'Ciclos de Aprendizaje', href: `/${lang}/learning/cycles` },
				{ label: 'Diseño de Objetivos', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces y Puntos', href: `/${lang}/learning/feedback` }
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

			<h2>{lang === 'es' ? '¿Qué es BEM en los Procesos de Aprendizaje?' : 'What is BEM in Learning Processes?'}</h2>
			<p class="intro-paragraph">
				{lang === 'es'
					? 'Hablar de gamificación en contextos de aprendizaje puede ser conceptualmente riesgoso. El término se asocia comúnmente con la inclusión de sistemas de recompensa para tareas completadas (puntos y medallas), o con intentos de hacer que el aprendizaje sea "divertido" a través de mecánicas competitivas.'
					: 'Talking about gamification in learning contexts can be conceptually risky. The term is commonly associated with the inclusion of reward systems for completed tasks, usually in the form of points and badges, or with attempts to make learning "fun," often through competitive mechanics.'}
			</p>

			<div class="quote-block">
				{lang === 'es'
					? 'El marco BEM no opera bajo esa suposición superficial. El aprendizaje no es la ejecución de tareas a cambio de zanahorias; es una conversación estructurada y predecible: un camino diseñado metódicamente hacia la victoria.'
					: 'The BEM framework does not operate from that shallow assumption. Learning is not the execution of tasks in exchange for carrots; it is a structured, predictable conversation: a methodically designed path to victory.'}
			</div>

			<h2>{t.pillarsTitle}</h2>
			<div class="pillars-grid">
				<div class="pillar-card border-red">
					<h3>{t.tradTitle}</h3>
					<p>{t.tradDesc}</p>
				</div>
				<div class="pillar-card border-green">
					<h3>{t.gblTitle}</h3>
					<p>{t.gblDesc}</p>
				</div>
				<div class="pillar-card border-purple full">
					<h3>{t.bemTitle}</h3>
					<p>{t.bemDesc}</p>
				</div>
			</div>

			<h2>{lang === 'es' ? 'Lo que BEM Promete (y lo que No)' : 'What BEM Promises (and What It Does Not)'}</h2>
			<p>
				{lang === 'es'
					? 'BEM no promete soluciones "listas para usar" ni plantillas de mecánicas repetitivas. Es una metodología iterativa. Sus conceptos de diseño sirven como puntos de partida para crear experimentos de aprendizaje, pero su efectividad depende de la calibración constante en la práctica.'
					: 'BEM does not promise "out-of-the-box" solutions or ready-made templates of mechanics. It is an iterative methodology. Its design concepts serve as starting points for creating learning experiments, but their effectiveness depends on constant calibration in practice.'}
			</p>
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
	font-size: 1.2rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: 2rem;
}

.quote-block {
	border-left: 4px solid var(--color-purple);
	padding: 1rem 1.5rem;
	background: rgba(124, 58, 237, 0.03);
	font-size: 1.1rem;
	font-weight: 600;
	line-height: 1.6;
	color: var(--color-text);
	border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
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

/* PILLARS GRID */
.pillars-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
	margin-bottom: 2.5rem;
}

.pillar-card {
	background: var(--color-bg-alt);
	border: 1.5px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-md);
	transition: var(--transition-fast);
}

.pillar-card.full {
	grid-column: span 2;
}

.pillar-card h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
	color: var(--color-text);
}

.pillar-card p {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin: 0;
}

.pillar-card:hover {
	transform: scale(1.01);
	background: white;
	box-shadow: var(--shadow-md);
}

.pillar-card.border-red:hover { border-color: var(--color-red); }
.pillar-card.border-green:hover { border-color: var(--color-green); }
.pillar-card.border-purple:hover { border-color: var(--color-purple); }

@media (max-width: 600px) {
	.pillars-grid {
		grid-template-columns: 1fr;
	}
	.pillar-card.full {
		grid-column: span 1;
	}
}
</style>
