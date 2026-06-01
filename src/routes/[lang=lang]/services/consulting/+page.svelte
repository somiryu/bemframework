<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Advanced Gamification Consulting',
			desc: 'Systemic behavior design, gameful decision architecture, and sprint-based motivation engineering.',
			seoTitle: 'Gamification Consulting Services | BEM Framework',
			seoDesc: 'Professional behavior design diagnostics, decision architecture mapping, and iterative sprint engagement by Javier Velásquez and the F2P team.',
			lead: 'We do not sell badges and points. We analyze your product ecosystem and design structural learning loops, information feedback systems, and autonomy frameworks that scale customer retention organically.',
			quoteCTA: 'Configure Your Scope & Get Quote',
			
			// Journey Section
			journeyTitle: 'The BEM Step-by-Step Iterative Journey',
			journeySub: 'How we align your goals with human behavior in 3 sprint-based phases:',
			phases: [
				{
					num: '01',
					title: 'Diagnosis and Architecture',
					tagline: "Let's build something better",
					desc: 'We run your current design through several frameworks to define key opportunities of improvement. We define solid core loops and powerful feedback systems before committing development time.'
				},
				{
					num: '02',
					title: 'Experiment Design',
					tagline: 'Diverse Hypothesis',
					desc: 'Engagement is built through secondary missions and side questing. We create a battery of ideas and test them to see what sticks. Placing all bets on "one idea" leads to post-mortem failures; we design controlled, scientific test cycles.'
				},
				{
					num: '03',
					title: 'Prototyping & Review',
					tagline: 'NOT A MOCKUP!',
					desc: 'Mockups are exciting... for designers. We validate simple gamification systems first using existing tools and analogue boardgame prototypes before committing your full UX/UI and development team.'
				}
			],

			// Paradigm Section
			paradigmTitle: 'Human & System Centered Balance',
			paradigmSub: 'Diapositiva 8: Sustainable Behavioral Alignment',
			paradigmDesc: 'Giving the user what they want can lead to long-term systemic decay, but doing the best for the system can create apathy and demotivation. We balance internal wants with external needs to create the best scenario for sustainable growth.',
			internalMot: 'Internal Motivation',
			internalDesc: 'Autonomous choices, personal mastery, hedonic discovery, and self-identity.',
			externalPres: 'External Pressures',
			externalDesc: 'System rewards, scarcity rules, risk rules, and cooperative social loops.',
			feedbackLoops: 'Sustainable Feedback Loops',
			feedbackDesc: 'Connecting strategic decisions and automatic choices into continuous loops that prevent Skinner-box burnout.'
		},
		es: {
			title: 'Consultoría en Gamificación Avanzada BEM',
			desc: 'Diseño de comportamiento sistémico, arquitectura de decisiones lúdicas e ingeniería de motivación basada en sprints.',
			seoTitle: 'Servicios de Consultoría en Gamificación | BEM Framework',
			seoDesc: 'Diagnósticos profesionales de diseño conductual, mapeo de arquitectura de decisiones e interacción basada en sprints por Javier Velásquez y el equipo de F2P.',
			lead: 'No vendemos puntos y medallas. Analizamos tu ecosistema de producto para diseñar bucles de aprendizaje estructurales, sistemas de feedback claros y marcos de autonomía que escalan la retención de forma orgánica.',
			quoteCTA: 'Configurar Alcance y Obtener Cotización',

			// Journey Section
			journeyTitle: 'El Journey Iterativo Paso a Paso BEM',
			journeySub: 'Cómo alineamos tus objetivos de negocio con el comportamiento humano en 3 fases de sprints:',
			phases: [
				{
					num: '01',
					title: 'Diagnóstico y Arquitectura',
					tagline: 'Construyamos algo mejor',
					desc: 'Pasamos tu diseño actual por múltiples marcos metodológicos para definir oportunidades clave. Diseñamos bucles centrales sólidos y sistemas de feedback potentes antes de comprometer horas de desarrollo.'
				},
				{
					num: '02',
					title: 'Diseño de Experimentos',
					tagline: 'Hipótesis Diversas',
					desc: 'El engagement se construye a través de misiones secundarias y side-quests. Creamos una batería de ideas para validar lo que realmente funciona. Apostar todo a una "sola idea" suele fallar; nosotros diseñamos ciclos de prueba científicos.'
				},
				{
					num: '03',
					title: 'Prototipado y Revisión',
					tagline: '¡NO SOLO MOCKUPS!',
					desc: 'Los mockups son emocionantes... solo para los diseñadores. Validamos sistemas de gamificación simples primero con herramientas existentes y prototipos analógicos antes de comprometer a tu equipo de desarrollo y UX/UI.'
				}
			],

			// Paradigm Section
			paradigmTitle: 'Balance Centrado en el Humano y el Sistema',
			paradigmSub: 'Diapositiva 8: Alineación Conductual Sostenible',
			paradigmDesc: 'Darle al usuario todo lo que quiere puede llevar a una decadencia sistémica a largo plazo, pero hacer solo lo que beneficia al sistema crea apatía y desmotivación. Equilibramos los deseos internos con las necesidades externas para el crecimiento sostenible.',
			internalMot: 'Motivación Interna',
			internalDesc: 'Decisiones autónomas, maestría personal, descubrimiento hedonista e identidad propia.',
			externalPres: 'Presiones Externas',
			externalDesc: 'Recompensas del sistema, reglas de escasez, reglas de riesgo y loops sociales cooperativos.',
			feedbackLoops: 'Loops de Feedback Sostenibles',
			feedbackDesc: 'Conectamos decisiones estratégicas y elecciones automáticas en bucles continuos que evitan el desgaste por cajas de Skinner.'
		}
	}[lang]);
</script>

<SEO title={t.seoTitle} description={t.seoDesc} {lang} />

<HeroSection title={t.title} description={t.desc} />

<section class="section lead-section">
	<div class="container container-narrow">
		<p class="lead-paragraph">{t.lead}</p>
	</div>
</section>

<!-- STEP BY STEP JOURNEY -->
<section class="section journey-section">
	<div class="container">
		<div class="section-header">
			<h2>{t.journeyTitle}</h2>
			<p>{t.journeySub}</p>
		</div>

		<div class="journey-timeline">
			{#each t.phases as phase}
				<div class="journey-node">
					<div class="node-badge">
						<span class="num">{phase.num}</span>
					</div>
					<div class="node-card">
						<span class="node-tagline">{phase.tagline}</span>
						<h3>{phase.title}</h3>
						<p>{phase.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- HUMAN VS SYSTEM BALANCE PARADIGM -->
<section class="section paradigm-section">
	<div class="container container-narrow">
		<div class="paradigm-header">
			<span class="pill">BEM Core Philosophy</span>
			<h2>{t.paradigmTitle}</h2>
			<p class="sub">{t.paradigmSub}</p>
			<p class="desc">{t.paradigmDesc}</p>
		</div>

		<div class="paradigm-grid">
			<div class="paradigm-card border-purple">
				<div class="card-glow"></div>
				<h3>{t.internalMot}</h3>
				<p>{t.internalDesc}</p>
			</div>
			
			<div class="paradigm-card border-green">
				<div class="card-glow"></div>
				<h3>{t.externalPres}</h3>
				<p>{t.externalDesc}</p>
			</div>

			<div class="paradigm-card border-orange full-width">
				<div class="card-glow"></div>
				<h3>{t.feedbackLoops}</h3>
				<p>{t.feedbackDesc}</p>
			</div>
		</div>

		<div class="cta-row">
			<a href={`/${lang}/services/quote`} class="quote-btn">{t.quoteCTA}</a>
		</div>
	</div>
</section>

<style>
.lead-section {
	background: var(--color-bg);
	padding-bottom: 0;
}

.lead-paragraph {
	font-size: 1.4rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	text-align: center;
	font-weight: 500;
}

/* JOURNEY TIMELINE */
.journey-section {
	background: var(--color-bg-alt);
}

.section-header {
	text-align: center;
	margin-bottom: var(--space-xl);
}

.section-header h2 {
	font-size: 2.2rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
}

.section-header p {
	font-size: 1.2rem;
	color: var(--color-text-muted);
	margin: 0 auto;
}

.journey-timeline {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	position: relative;
	max-width: 900px;
	margin: 0 auto;
}

.journey-timeline::before {
	content: '';
	position: absolute;
	top: 0; bottom: 0; left: 28px;
	width: 4px;
	background: var(--color-border);
	z-index: 0;
}

.journey-node {
	display: flex;
	gap: 2rem;
	align-items: flex-start;
	position: relative;
	z-index: 1;
}

.node-badge {
	width: 60px;
	height: 60px;
	border-radius: var(--radius-full);
	background: white;
	border: 4px solid var(--color-purple);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	box-shadow: var(--shadow-sm);
}

.node-badge .num {
	font-size: 1.25rem;
	font-weight: 900;
	color: var(--color-purple);
}

.node-card {
	background: white;
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-md);
	flex-grow: 1;
	transition: var(--transition-normal);
}

.node-card:hover {
	transform: translateX(8px);
	border-color: var(--color-purple);
}

.node-tagline {
	display: inline-block;
	font-size: 0.75rem;
	font-weight: 800;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.08);
	padding: 0.25rem 0.6rem;
	border-radius: var(--radius-sm);
	margin-bottom: 0.75rem;
	text-transform: uppercase;
}

.node-card h3 {
	font-size: 1.4rem;
	font-weight: 800;
	margin: 0 0 0.5rem;
}

.node-card p {
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	max-width: none;
}

/* PARADIGM GRID */
.paradigm-section {
	background: var(--color-bg);
}

.paradigm-header {
	text-align: center;
	margin-bottom: var(--space-xl);
}

.pill {
	display: inline-block;
	font-size: 0.75rem;
	font-weight: 800;
	color: var(--color-purple);
	border: 1.5px solid var(--color-purple);
	padding: 0.35rem 0.8rem;
	border-radius: var(--radius-full);
	text-transform: uppercase;
	margin-bottom: 1rem;
}

.paradigm-header h2 {
	font-size: 2.2rem;
	font-weight: 800;
	margin-bottom: 0.25rem;
}

.paradigm-header .sub {
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--color-orange);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-bottom: 1.5rem;
}

.paradigm-header .desc {
	font-size: 1.2rem;
	color: var(--color-text-muted);
	line-height: 1.6;
	margin: 0 auto;
}

.paradigm-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	margin-bottom: var(--space-xl);
}

.paradigm-card {
	position: relative;
	background: var(--color-bg-alt);
	border: 2px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	transition: var(--transition-normal);
	overflow: hidden;
}

.paradigm-card.full-width {
	grid-column: span 2;
}

.paradigm-card:hover {
	transform: translateY(-5px);
	background: white;
	box-shadow: var(--shadow-lg);
}

.paradigm-card.border-purple:hover { border-color: var(--color-purple); }
.paradigm-card.border-green:hover { border-color: var(--color-green); }
.paradigm-card.border-orange:hover { border-color: var(--color-orange); }

.card-glow {
	position: absolute;
	top: -50%; left: -50%;
	width: 200%; height: 200%;
	background: radial-gradient(circle at center, var(--color-purple) 0%, transparent 60%);
	opacity: 0;
	transition: opacity 0.4s ease;
	pointer-events: none;
}

.paradigm-card.border-green .card-glow { background: radial-gradient(circle at center, var(--color-green) 0%, transparent 60%); }
.paradigm-card.border-orange .card-glow { background: radial-gradient(circle at center, var(--color-orange) 0%, transparent 60%); }

.paradigm-card:hover .card-glow {
	opacity: 0.03;
}

.paradigm-card h3 {
	font-size: 1.35rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
}

.paradigm-card p {
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	max-width: none;
}

.cta-row {
	display: flex;
	justify-content: center;
}

.quote-btn {
	display: inline-block;
	background: var(--color-purple);
	color: white;
	text-decoration: none;
	font-weight: 800;
	padding: 1.1rem 2.2rem;
	border-radius: var(--radius-md);
	transition: var(--transition-fast);
	box-shadow: var(--shadow-md);
}

.quote-btn:hover {
	transform: translateY(-3px);
	box-shadow: var(--shadow-lg);
	filter: brightness(1.1);
}

@media (max-width: 768px) {
	.journey-timeline::before {
		left: 20px;
	}
	.node-badge {
		width: 44px;
		height: 44px;
		border-width: 3px;
	}
	.node-badge .num {
		font-size: 1rem;
	}
	.node-card {
		padding: 1.5rem;
	}
	.paradigm-grid {
		grid-template-columns: 1fr;
	}
	.paradigm-card.full-width {
		grid-column: span 1;
	}
}
</style>
