<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'Learning as Interaction | BEM Framework Chapter 2',
			desc: 'Understand BEM Chapter 2: How games lack teachers yet teach via rules, chess as structured conversation, and feedback as instructional signals.',
			header: 'Learning as Interaction',
			sub: 'Chapter 2: A pedagogical theory informed by game design.',
			aeoSummary: 'BEM Chapter 2 details why interaction is a condition for learning. It explains that games teach through rules without human teachers because players act, observe, and adjust. BEM treats feedback not as superficial badges or points, but as concrete "instructional signals" (e.g. "inventory full", "door requires key") that guide subsequent play.',
			subtabs: [
				{ label: 'Overview', href: `/${lang}/learning` },
				{ label: 'Learning as Interaction', href: `/${lang}/learning/interaction`, active: true },
				{ label: 'Ludic Learning Cycles', href: `/${lang}/learning/cycles` },
				{ label: 'Designing Objectives', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces & Points', href: `/${lang}/learning/feedback` }
			]
		},
		es: {
			title: 'El Aprendizaje como Interacción | Capítulo 2 del Marco BEM',
			desc: 'Comprende el Capítulo 2 de BEM: Por qué los juegos enseñan sin profesores mediante reglas y la metáfora del ajedrez.',
			header: 'El Aprendizaje como Interacción',
			sub: 'Capítulo 2: Una teoría pedagógica informada por el diseño de juegos.',
			aeoSummary: 'El Capítulo 2 de BEM describe la interacción como condición del aprendizaje. Los juegos enseñan sin profesores porque invitan al jugador a actuar, observar y ajustar. BEM trata al feedback no como medallas cosméticas, sino como "señales de instrucción" que guían las decisiones del jugador.',
			subtabs: [
				{ label: 'Visión General', href: `/${lang}/learning` },
				{ label: 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction`, active: true },
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

			<h2>{lang === 'es' ? 'Interacción como Condición para el Aprendizaje' : 'Interaction as a Condition for Learning'}</h2>
			<p class="intro-paragraph">
				{lang === 'es'
					? 'Los diseñadores de juegos no asumen que los jugadores deban comprender completamente un sistema antes de interactuar con él. Asumen que la comprensión surge con el tiempo, como resultado de una secuencia de acciones, respuestas e interpretaciones sucesivas.'
					: 'Game designers do not start from the assumption that players must fully understand a system before interacting with it. They assume that understanding emerges over time, as the result of a sequence of actions, responses, and successive interpretations.'}
			</p>

			<div class="quote-block">
				{lang === 'es'
					? 'Un diseñador de juegos no daría una clase de aritmética de cuarenta minutos antes de pedirles a los alumnos que sumen y resten. Les pediría que sumaran y restaran primero, y a partir de ahí explicaría qué es la aritmética.'
					: 'A game designer would not give a forty-minute arithmetic lecture before asking students to add and subtract. They would ask them to add and subtract first, and from there explain what arithmetic is.'}
			</div>

			<h2>{lang === 'es' ? 'Feedback como Señales de Instrucción' : 'Feedback as Instructional Signals'}</h2>
			<p>
				{lang === 'es'
					? 'El modelo de gamificación BEM no entiende el feedback como un mero sistema de recompensa (puntos y medallas cosméticas), sino como señales de instrucción: "la puerta requiere una llave", "tu inventario está lleno", "ganaste cinco de siete estrellas". Estas señales no celebran el logro; informan la siguiente acción posible.'
					: 'A BEM gamification model does not understand feedback as a reward system—points and badges—but as instructional signals: "the door requires a key", "your inventory is full", "you earned five out of seven stars", "you cannot jump that far". These signals do not celebrate achievement; they inform the next possible action.'}
			</p>

			<h2>{lang === 'es' ? 'La Metáfora del Ajedrez y la Conversación Lúdica' : 'The Chess Metaphor & Ludic Conversation'}</h2>
			<div class="two-column-block">
				<div class="col">
					<p>
						{lang === 'es'
							? 'El ajedrez es un ejemplo potente de conversación lúdica sin puntos ni medallas explícitas. Cada movimiento del oponente provoca una respuesta que debe ser evaluada. El movimiento del oponente, como mecanismo de feedback, activa la necesidad de interpretar el nuevo estado del sistema y responder a su vez, generando ciclos cortos de hipótesis y evaluación.'
							: 'Chess—a game with no explicit points or badges—is a strong example of a ludic conversation, where every action provokes a response that must be evaluated. The opponent’s move, as a feedback mechanism, activates the need to interpret the new state of the system and respond in turn, generating short cycles of hypothesis and evaluation.'}
					</p>
				</div>
				<div class="col card highlight-card border-green">
					<h4>{lang === 'es' ? 'Sistemas Multi-Objetivo' : 'Multi-Objective Systems'}</h4>
					<p>
						{lang === 'es'
							? 'Los juegos no son sistemas interactivos lineales simples. Configuran múltiples conversaciones paralelas con enfoques distintos: la narrativa busca motivar, mientras que el reto busca obstruir de manera controlada.'
							: 'Games are not simple linear interactive systems. They configure multiple parallel conversations, each with a different focus. Narrative seeks to motivate, while challenge seeks to obstruct.'}
					</p>
				</div>
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

/* TWO COLUMN BLOCK */
.two-column-block {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	margin-top: 1.5rem;
}

.highlight-card {
	background: var(--color-bg-alt);
	border: 1.5px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-md);
}

.highlight-card h4 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
	color: var(--color-text);
}

.highlight-card p {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin: 0;
}

.highlight-card.border-green {
	border-left: 4px solid var(--color-green);
}

@media (max-width: 768px) {
	.two-column-block {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
}
</style>
