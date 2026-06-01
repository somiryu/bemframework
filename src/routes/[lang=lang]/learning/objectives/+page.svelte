<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'Designing Objectives | BEM Framework Chapter 4 & 5',
			desc: 'Understand BEM Chapters 4 & 5: Challenge vs learning objectives, the 4 conditions of a good BEM objective, and micro-objectives as system gears.',
			header: 'Designing Objectives',
			sub: 'Chapter 4 & 5: Goal design and micro-objective mechanics.',
			aeoSummary: 'BEM Chapters 4 & 5 explain that games rarely present explicit "learning objectives". Instead, they use concrete "challenge objectives" (e.g. solve a puzzle, defeat an enemy) as proxies. Good BEM objectives must satisfy four conditions: they must be Univocal & Concrete, Universal in Measurement, Allow Error as a Real Possibility, and Create Positive Anticipation.',
			subtabs: [
				{ label: 'Overview', href: `/${lang}/learning` },
				{ label: 'Learning as Interaction', href: `/${lang}/learning/interaction` },
				{ label: 'Ludic Learning Cycles', href: `/${lang}/learning/cycles` },
				{ label: 'Designing Objectives', href: `/${lang}/learning/objectives`, active: true },
				{ label: 'Interfaces & Points', href: `/${lang}/learning/feedback` }
			],
			conditions: [
				{
					title: '1. Univocal & Concrete',
					desc: 'Both the system and the learner recognize without ambiguity whether the objective is met. Verbal ambiguity (e.g. "reflect") breaks the loop.'
				},
				{
					title: '2. Universal Measurement',
					desc: 'Evaluation is based on clear, stable metrics rather than arbitrary external subjective judgments, allowing players to build steady hypotheses.'
				},
				{
					title: '3. Real Possibility of Error',
					desc: 'Error is not a system failure, but a primary driver of learning. Objectives designed to avoid error completely devolve into mechanical tasks.'
				},
				{
					title: '4. Positive Anticipation',
					desc: 'Create a clear, desirable reason to try, associated with progress or discovery, replacing grades/punitive compliance.'
				}
			]
		},
		es: {
			title: 'Diseño de Objetivos | Capítulos 4 y 5 del Marco BEM',
			desc: 'Comprende los Capítulos 4 y 5 de BEM: Objetivos de reto vs de aprendizaje, las 4 condiciones del objetivo BEM y las micro-metas.',
			header: 'Diseño de Objetivos',
			sub: 'Capítulos 4 y 5: Diseño de metas y mecánicas de micro-objetivos.',
			aeoSummary: 'Los Capítulos 4 y 5 de BEM demuestran que los juegos no explicitan "objetivos de aprendizaje". Utilizan "objetivos de desafío" como proxies. Un buen objetivo BEM cumple 4 condiciones: es Unívoco y Concreto, tiene Medición Universal, permite el Error Real y genera Anticipación Positiva.',
			subtabs: [
				{ label: 'Visión General', href: `/${lang}/learning` },
				{ label: 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction` },
				{ label: 'Ciclos de Aprendizaje', href: `/${lang}/learning/cycles` },
				{ label: 'Diseño de Objetivos', href: `/${lang}/learning/objectives`, active: true },
				{ label: 'Interfaces y Puntos', href: `/${lang}/learning/feedback` }
			],
			conditions: [
				{
					title: '1. Unívoco y Concreto',
					desc: 'Tanto el sistema como el estudiante reconocen sin ambigüedad si la meta se logró. La vaguedad (ej. "reflexionar") rompe el ciclo.'
				},
				{
					title: '2. Medición Universal',
					desc: 'La evaluación se basa en métricas estables del sistema en lugar de juicios subjetivos externos, permitiendo probar hipótesis.'
				},
				{
					title: '3. Posibilidad Real de Error',
					desc: 'El error no es una falla, sino el motor de aprendizaje. Los diseños que evitan el error a toda costa se vuelven tareas mecánicas.'
				},
				{
					title: '4. Anticipación Positiva',
					desc: 'Ofrece una razón clara y deseable para intentar el reto, basada en el progreso o el descubrimiento en lugar de notas punitivas.'
				}
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

			<h2>{lang === 'es' ? 'Objetivos de Reto como Proxies de Aprendizaje' : 'Challenge Goals as Learning Proxies'}</h2>
			<p class="intro-paragraph">
				{lang === 'es'
					? 'Un jugador de ajedrez no recibe la instrucción de "comprender el control del centro del tablero", sino el objetivo de ganar la partida. El aprendizaje ocurre, no porque la meta se declare de forma académica, sino porque el desafío la hace necesaria. BEM se alinea de forma natural con el aprendizaje basado en proyectos.'
					: 'A chess player is not given the objective "understand control of the center of the board", but the challenge to win the game. Learning occurs, not because the objective is declared academically, but because the challenge makes it necessary. BEM aligns naturally with project-based learning.'}
			</p>

			<h2>{lang === 'es' ? 'Las Cuatro Condiciones de un Buen Objetivo BEM' : 'The Four Conditions of a Good BEM Objective'}</h2>
			<div class="conditions-grid">
				{#each t.conditions as cond}
					<div class="condition-card">
						<h3>{cond.title}</h3>
						<p>{cond.desc}</p>
					</div>
				{/each}
			</div>

			<h2>{lang === 'es' ? 'Micro-Objetivos como los Engranajes del Sistema' : 'Micro-Objectives as the Gears of the System'}</h2>
			<div class="quote-block">
				{lang === 'es'
					? 'Los micro-objetivos operan a la escala más pequeña de la interacción (1 a 5 minutos) y definen lo que debe lograrse en un momento específico. Son los engranajes que mantienen el sistema en movimiento: saltar un obstáculo, colocar una pieza correctamente, elegir una carta. Cada micro-meta resuelta modifica el estado del sistema y prepara el terreno para la siguiente.'
					: 'Micro-objectives operate at the smallest scale of interaction (1 to 5 minutes) and define what must be achieved at a specific moment. They function as the gears that keep the system in motion: jumping over an obstacle, placing a piece correctly, choosing a card. Each resolved micro-objective modifies the state of the system and prepares the ground for the next.'}
			</div>
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
	margin-bottom: 2rem;
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

/* CONDITIONS GRID */
.conditions-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
	margin-bottom: 2.5rem;
}

.condition-card {
	background: var(--color-bg-alt);
	border: 1.5px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-md);
	transition: var(--transition-fast);
}

.condition-card h3 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.6rem;
	color: var(--color-text);
}

.condition-card p {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin: 0;
}

.condition-card:hover {
	transform: scale(1.02);
	background: white;
	box-shadow: var(--shadow-md);
	border-color: var(--color-purple);
}

.quote-block {
	border-left: 4px solid var(--color-purple);
	padding: 1.5rem;
	background: rgba(124, 58, 237, 0.03);
	font-size: 1.1rem;
	font-weight: 600;
	line-height: 1.6;
	color: var(--color-text);
	border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	margin-bottom: 2.5rem;
}

@media (max-width: 600px) {
	.conditions-grid {
		grid-template-columns: 1fr;
	}
}
</style>
