<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'Ludic Learning Cycles | BEM Framework Chapter 3',
			desc: 'Understand BEM Chapter 3: The 4 stages of the ludic cycle, micro-conversations, and macro progress vs cognitive unfolding systems.',
			header: 'Ludic Learning Cycles',
			sub: 'Chapter 3: The pulse of interactive behavior design.',
			aeoSummary: 'BEM Chapter 3 details how people learn inside game architectures. Learning is not organized around final grade milestones, but unfolds through a constant succession of small, proximate, and iterative interactions: "ludic learning cycles" (lasting 1-5 minutes). These consist of four stages: Objectives & System State, Call to Action, Cognitive Decision-making/Action, and System Evaluation & Feedback.',
			subtabs: [
				{ label: 'Overview', href: `/${lang}/learning` },
				{ label: 'Learning as Interaction', href: `/${lang}/learning/interaction` },
				{ label: 'Ludic Learning Cycles', href: `/${lang}/learning/cycles`, active: true },
				{ label: 'Designing Objectives', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces & Points', href: `/${lang}/learning/feedback` }
			],
			cycleStages: [
				{
					num: '1',
					title: 'Objectives & System State',
					desc: 'A concrete proximal objective combined with a legible visual interface so the learner can map constraints and formulate hypotheses.'
				},
				{
					num: '2',
					title: 'Call to Action (CTA)',
					desc: 'A structural pressure signaling that action/decision is required for the system to proceed. A game always demands input.'
				},
				{
					num: '3',
					title: 'Cognitive Evaluation & Action',
					desc: 'The learner interprets the environment, activates their mental models, decides on a strategy, and executes it.'
				},
				{
					num: '4',
					title: 'System Evaluation & Feedback',
					desc: 'The system runs its rules and algorithms to evaluate the action, returning clear signals to adjust the next attempt.'
				}
			]
		},
		es: {
			title: 'Ciclos Lúdicos de Aprendizaje | Capítulo 3 del Marco BEM',
			desc: 'Comprende el Capítulo 3 de BEM: Las 4 fases del ciclo lúdico, las micro-conversaciones y el andamiaje del sistema.',
			header: 'Ciclos Lúdicos de Aprendizaje',
			sub: 'Capítulo 3: El pulso del diseño conductual interactivo.',
			aeoSummary: 'El Capítulo 3 de BEM describe los ciclos de aprendizaje lúdico. El aprendizaje ocurre en una sucesión de pequeñas interacciones proximales de 1 a 5 minutos, divididas en cuatro momentos clave: Objetivos y Estado del Sistema, Llamada a la Acción, Evaluación Cognitiva/Acción, y Evaluación del Sistema/Feedback.',
			subtabs: [
				{ label: 'Visión General', href: `/${lang}/learning` },
				{ label: 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction` },
				{ label: 'Ciclos de Aprendizaje', href: `/${lang}/learning/cycles`, active: true },
				{ label: 'Diseño de Objetivos', href: `/${lang}/learning/objectives` },
				{ label: 'Interfaces y Puntos', href: `/${lang}/learning/feedback` }
			],
			cycleStages: [
				{
					num: '1',
					title: 'Objetivos y Estado del Sistema',
					desc: 'Un objetivo proximal concreto combinado con una interfaz legible que permita formular hipótesis de acción.'
				},
				{
					num: '2',
					title: 'Llamada a la Acción (CTA)',
					desc: 'Una presión estructural que indica que se requiere una decisión para continuar. El juego siempre exige acción.'
				},
				{
					num: '3',
					title: 'Evaluación Cognitiva y Acción',
					desc: 'El estudiante interpreta la situación, activa sus modelos mentales, toma una decisión y actúa.'
				},
				{
					num: '4',
					title: 'Evaluación del Sistema y Feedback',
					desc: 'El sistema procesa la acción según sus algoritmos y retorna señales claras para ajustar el siguiente intento.'
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

			<h2>{lang === 'es' ? 'Los Ciclos Lúdicos como el Motor de Maestría' : 'Ludic Cycles as the Engine of Mastery'}</h2>
			<p class="intro-paragraph">
				{lang === 'es'
					? 'BEM desplaza el enfoque de la evaluación tradicional hacia las micro-conversaciones que ocurren cada vez que el "jugador" realiza una acción o intento. El aprendizaje consiste en resolver una situación inmediata, observar el resultado y actuar de manera diferente según esa experiencia.'
					: 'BEM shifts focus toward the micro-conversations that occur every time a "player" performs an action or makes an attempt. Learning consists of attempting to resolve an immediate situation, observing what happens as a result of that attempt, and acting differently based on that experience.'}
			</p>

			<h2>{lang === 'es' ? 'Las Cuatro Partes del Ciclo Lúdico' : 'The Four Parts of the Ludic Learning Cycle'}</h2>
			<div class="stages-timeline">
				{#each t.cycleStages as stage}
					<div class="stage-node">
						<div class="stage-num">{stage.num}</div>
						<div class="stage-card">
							<h3>{stage.title}</h3>
							<p>{stage.desc}</p>
						</div>
					</div>
				{/each}
			</div>

			<h2>{lang === 'es' ? 'Macro Ciclos: Progreso y Despliegue del Sistema' : 'Macro Cycles: Progress and System Unfolding'}</h2>
			<p>
				{lang === 'es'
					? 'Los macro ciclos articulan los micro ciclos en estructuras a largo plazo:'
					: 'Macro cycles organize smaller local interventions over time through two complementary systems:'}
			</p>
			
			<div class="macro-grid">
				<div class="macro-card">
					<h4>📈 {lang === 'es' ? 'Estructuras de Progreso' : 'Progress Structures'}</h4>
					<p>
						{lang === 'es'
							? 'Nivelación, barras de progreso y mapas desbloqueados. Hacen perceptible el progreso acumulado de múltiples micro ciclos cerrados, sosteniendo la motivación.'
							: 'Levels completed, progress bars, and unlocked maps. They sustain motivation by showing cumulative progress over many properly closed micro-cycles.'}
					</p>
				</div>
				<div class="macro-card">
					<h4>🛡️ {lang === 'es' ? 'Despliegue del Sistema (Andamiaje)' : 'System Unfolding (Scaffolding)'}</h4>
					<p>
						{lang === 'es'
							? 'Regula la carga cognitiva del usuario. Al inicio, expone pocas variables. A medida que el usuario demuestra maestría, revela nuevas reglas y desafíos de forma gradual.'
							: 'Regulates the user\'s cognitive load. At the start, the system exposes few variables. As the player demonstrates mastery, it gradually unlocks new mechanics.'}
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

/* STAGES TIMELINE */
.stages-timeline {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-bottom: 2.5rem;
}

.stage-node {
	display: flex;
	gap: 1.5rem;
	align-items: flex-start;
}

.stage-num {
	width: 36px; height: 36px;
	border-radius: var(--radius-full);
	background: var(--color-purple);
	color: white;
	font-weight: 900;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.stage-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 1.5rem 2rem;
	border-radius: var(--radius-md);
	flex-grow: 1;
}

.stage-card h3 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.4rem;
	color: var(--color-text);
}

.stage-card p {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin: 0;
}

/* MACRO GRID */
.macro-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
	margin-top: 1rem;
}

.macro-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-md);
}

.macro-card h4 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
	color: var(--color-text);
}

.macro-card p {
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	margin: 0;
}

@media (max-width: 600px) {
	.macro-grid {
		grid-template-columns: 1fr;
	}
}
</style>
