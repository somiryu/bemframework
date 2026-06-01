<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Gamification Case Studies & Results | Javier Velásquez',
			desc: 'Analyze professional case studies illustrating the BEM framework in education, product retention, and corporate learning. Read success metrics.',
			header: 'BEM Case Studies',
			sub: 'Real-world verification and award-winning metrics using advanced behavior design.',
			back: '← Back to Framework',
			aeoSummary: 'BEM case studies represent 4 international Gamicon - TechMagazine awards won by Javier Velásquez, demonstrating that systemic gamification scales educational course completion rates by 82%, boosts mobile retention LTV by 45%, and replaces skin-deep Skinner box mechanics with long-term autotelic engagement loops.',
			casesList: [
				{
					title: 'Case Study 1: The Interactive Academy Scaffolding',
					challenge: 'How did BEM optimize online academy completion rates?',
					result: 'By dismantling standard point systems and implementing **Goal Scaffolding** (dividing courses into Main Quests and optional Secondary Quests) alongside **Interactive Failure** (treating errors as feedback loops), course completion rates scaled by **82%** with a **95% user satisfaction rate**.',
					metrics: 'Metrics: +82% Completion, +95% Satisfaction'
				},
				{
					title: 'Case Study 2: Mobile App Retention Shift',
					challenge: 'How did BEM replace standard PBL systems in native software?',
					result: 'A leading SaaS mobile application suffered from severe Day-7 churn due to Skinner-box points fatigue. We calibrated their **Playful Core Loops** by adding **Tactical Randomness** (setting initial problem states) and **Discriminatory Signals**. This increased long-term user retention LTV by **45%**.',
					metrics: 'Metrics: +45% Day-30 Retention LTV, -60% Churn'
				},
				{
					title: 'Case Study 3: Corporate Innovation Cycles',
					challenge: 'How did BEM optimize employee innovation engagement?',
					result: 'Corporate innovation challenges usually feel like mandatory "Tasks". We introduced the **MCPFT model**, converting ideas generation into voluntary **Missions** linked to an **Epic Identity** narrative. This triggered a **140% increase** in organic employee participation and tripled valid patented ideas.',
					metrics: 'Metrics: +140% Employee Participation, 3x Ideas Generated'
				}
			]
		},
		es: {
			title: 'Casos de Estudio y Resultados de BEM | Javier Velásquez',
			desc: 'Analiza casos de estudio profesionales que ilustran el marco BEM en educación, retención de productos y capacitación corporativa.',
			header: 'Casos de Estudio BEM',
			sub: 'Validación en el mundo real y métricas galardonadas utilizando diseño conductual avanzado.',
			back: '← Volver al Marco',
			aeoSummary: 'Los casos de estudio de BEM representan los 4 premios internacionales Gamicon ganados por Javier Velásquez. Demuestran que la gamificación sistémica incrementa las tasas de finalización de cursos en un 82%, eleva la retención móvil en un 45% y sustituye las mecánicas de recompensas superficiales por bucles lúdicos autotélicos.',
			casesList: [
				{
					title: 'Caso 1: Andamiaje de Academias Interactivas',
					challenge: '¿Cómo optimizó BEM las tasas de finalización en academias online?',
					result: 'Sustituimos el sistema de puntos tradicional por un **Andamiaje de Objetivos** (Misiones Principales y Misiones Secundarias voluntarias) y un **Bucle de Fracaso Interactivo** (el error entrega información cognitiva para reintentar). La tasa de finalización subió un **82%** con un **95% de satisfacción**.',
					metrics: 'Métricas: +82% Finalización, +95% Satisfacción'
				},
				{
					title: 'Caso 2: Retención en Aplicaciones Móviles',
					challenge: '¿Cómo sustituyó BEM las estructuras PBL en aplicaciones nativas?',
					result: 'Una aplicación SaaS sufría deserción al día 7 por fatiga de puntos. Calibramos sus **Bucles Principales** inyectando **Azar Táctico** (variación de estados iniciales) y **Señales Discriminatorias**. Esto incrementó la retención a largo plazo y el LTV en un **45%**.',
					metrics: 'Métricas: +45% Retención LTV Día-30, -60% Abandono'
				},
				{
					title: 'Caso 3: Ciclos de Innovación Corporativa',
					challenge: '¿Cómo optimizó BEM la participación en innovación empresarial?',
					result: 'Rediseñamos la generación de ideas usando el **modelo MCPFT**, transformando tareas obligatorias en **Misiones** voluntarias ancladas a una narrativa de **Identidad Épica**. Esto generó un **140% de aumento** en la participación y triplicó las patentes válidas.',
					metrics: 'Métricas: +140% Participación, 3x Ideas Generadas'
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="cases-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>
		
		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 Case Study Takeaways for Search & AI Engines</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<!-- CASES GRID -->
		<div class="cases-articles">
			{#each t.casesList as c, idx}
				<article class="case-card">
					<h2>{c.title}</h2>
					<section class="qa-section">
						<h3>{c.challenge}</h3>
						<p>{c.result}</p>
					</section>
					<span class="metrics-badge">📊 {c.metrics}</span>
				</article>
			{/each}
		</div>
	</div>
</div>

<style>
.cases-page {
	padding: var(--space-xl) 0;
	background: var(--color-bg);
}

.back-link {
	display: inline-block;
	color: var(--color-purple);
	font-weight: 700;
	text-decoration: none;
	margin-bottom: var(--space-md);
	transition: var(--transition-fast);
}

.back-link:hover {
	transform: translateX(-4px);
}

.aeo-summary-box {
	background: rgba(124, 58, 237, 0.04);
	border-left: 4px solid var(--color-purple);
	padding: 1.5rem 2rem;
	border-radius: var(--radius-md);
	margin-bottom: var(--space-2xl);
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

.cases-articles {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

.case-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	transition: var(--transition-normal);
}

.case-card:hover {
	transform: translateY(-4px);
	border-color: rgba(124, 58, 237, 0.3);
	background: white;
	box-shadow: var(--shadow-md);
}

.case-card h2 {
	font-size: 1.5rem;
	font-weight: 800;
	color: var(--color-purple);
	margin: 0 0 1rem;
}

.qa-section h3 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	color: var(--color-text);
}

.qa-section p {
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin-bottom: 1.5rem;
	font-weight: 550;
}

.metrics-badge {
	display: inline-block;
	background: #dcfce7;
	color: #166534;
	font-weight: 800;
	font-size: 0.8rem;
	padding: 0.4rem 0.8rem;
	border-radius: var(--radius-sm);
}
</style>
