<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'Fractional Engagement Director | BEM Framework',
			desc: 'Bring Javier Velásquez into your product or organizational structure as a fractional Director of Engagement to orchestrate behavior design and systemic retention.',
			subtitle: 'Co-Architecting Your Platform Retention',
			lead: 'Launching an app or educational program requires deep, long-term mastery. As a Fractional Engagement Director, Javier joins your executive or product leadership team part-time to align developers, designers, and marketers under the BEM system.',
			phasesTitle: 'Our Strategic Collaboration Model',
			quoteCTA: 'Request Fractional Scope Estimate',
			phases: [
				{
					title: 'Phase 1: Deep Core Alignment',
					desc: 'Establish the initial hypothesis. We host multi-disciplinary workshops, defining the KBIs, KEIs, and KLIs required to connect strategic intent with developmental engineering.'
				},
				{
					title: 'Phase 2: Sprint-Based Architecture',
					desc: 'Construct the loops. Javier participates in weekly sprints, drafting the structural mechanics (Booster packs, random difficulty, sandbox modules) and auditing active visual UX feedback cycles.'
				},
				{
					title: 'Phase 3: Metric Refinement (Iterative Loop)',
					desc: 'Scientific optimization. We track engagement metrics in real-time, performing cognitive and heuristic analysis to smooth friction and prevent Skinner-burnout.'
				}
			]
		},
		es: {
			title: 'Director de Engagement Fraccional | BEM Framework',
			desc: 'Incorpora a Javier Velásquez en tu estructura de producto u organización como Director de Compromiso Fraccional para orquestar la retención sistémica.',
			subtitle: 'Co-Arquitecto de la Retención de tu Plataforma',
			lead: 'Lanzar una aplicación o programa educativo de alto impacto requiere maestría continua. Como Director de Compromiso Fraccional, Javier se une a tu junta o equipo de liderazgo para alinear desarrolladores, diseñadores y directores bajo el sistema BEM.',
			phasesTitle: 'Modelo de Colaboración Estratégica',
			quoteCTA: 'Solicitar Estimación Fraccional',
			phases: [
				{
					title: 'Fase 1: Alineación Profunda del Núcleo',
					desc: 'Establecemos la hipótesis inicial. Realizamos talleres multidisciplinarios para definir los KBIs, KEIs y KLIs que conectarán la intención del negocio con el código.'
				},
				{
					title: 'Fase 2: Arquitectura Basada en Sprints',
					desc: 'Construimos los bucles. Javier participa en sprints semanales, diseñando las mecánicas estructurales (booster packs, azar táctico, sandbox) y auditando el UX interactivo.'
				},
				{
					title: 'Fase 3: Refinamiento de Métricas',
					desc: 'Optimización científica. Analizamos los datos de interacción en tiempo real, realizando análisis heurísticos para eliminar la fricción y prevenir el desgaste conductual.'
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={lang === 'es' ? 'Director de Compromiso' : 'Engagement Director'} description={t.subtitle} />

<section class="section engagement-details">
	<div class="container container-narrow">
		<p class="lead-paragraph">{t.lead}</p>

		<h2 class="section-title">{t.phasesTitle}</h2>
		
		<div class="phases-grid">
			{#each t.phases as phase, idx}
				<div class="phase-card">
					<div class="phase-header">
						<span class="phase-idx">0{idx + 1}</span>
						<h3>{phase.title}</h3>
					</div>
					<p>{phase.desc}</p>
				</div>
			{/each}
		</div>

		<div class="cta-row">
			<a href={`/${lang}/services/quote`} class="quote-btn">{t.quoteCTA}</a>
		</div>
	</div>
</section>

<style>
.engagement-details {
	background: var(--color-bg);
}

.lead-paragraph {
	font-size: 1.35rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	text-align: center;
	margin-bottom: var(--space-xl);
	font-weight: 500;
}

.section-title {
	text-align: center;
	font-size: 2.2rem;
	font-weight: 800;
	margin-bottom: var(--space-xl);
}

.phases-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
	margin-bottom: var(--space-xl);
}

.phase-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
	transition: var(--transition-normal);
}

.phase-card:hover {
	transform: translateY(-5px);
	border-color: rgba(124, 58, 237, 0.3);
	background: white;
	box-shadow: var(--shadow-md);
}

.phase-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
}

.phase-idx {
	font-size: 1.5rem;
	font-weight: 900;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.1);
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-full);
}

.phase-card h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin: 0;
	color: var(--color-text);
}

.phase-card p {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	font-weight: 500;
}

.cta-row {
	display: flex;
	justify-content: center;
	margin-top: var(--space-xl);
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
</style>
