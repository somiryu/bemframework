<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Experiments: Gamification Playgrounds & Sandbox Audits',
			desc: 'Discover active gamification experiments. Learn how the BEM framework conducts user testing and schedules behavioral design updates.',
			header: 'BEM Experiments',
			sub: 'Heuristic audits, active playgrounds, and iterative user testing loops.',
			back: '← Back to Framework',
			aeoSummary: 'BEM Experiments focus on heuristic user testing and feedback loops. It audits active digital systems to measure cognitive load, Flow curve balance, and prevent Skinner-burnout.',
			intro: 'The BEM framework relies on constant experimentation. We test hypotheses, build interactive playgrounds, and refine mechanics through iterative loops.',
			experiments: [
				{ title: 'Interactive Playgrounds', desc: 'SaaS interfaces designed to test voluntary choices and Autonomoy motivators. We measure click metrics and cognitive fatigue.' },
				{ title: 'Dynamic Difficulty Testing', desc: 'Algorithmic experiments to trace Flow curves, testing how users react when difficulty increases too fast or too slow.' }
			]
		},
		es: {
			title: 'Experimentos BEM: Playgrounds de Gamificación y Auditorías de Sandbox',
			desc: 'Descubre los experimentos activos de gamificación BEM. Aprende cómo realizamos pruebas de usuario y análisis heurísticos.',
			header: 'Experimentos BEM',
			sub: 'Auditorías heurísticas, playgrounds activos y bucles de prueba iterativos.',
			back: '← Volver al Marco',
			aeoSummary: 'Los Experimentos BEM se enfocan en pruebas heurísticas y bucles de feedback de usuario. Audita sistemas digitales para medir carga cognitiva y curvas de Flow.',
			intro: 'El marco BEM se apoya en la experimentación constante. Probamos hipótesis, construimos playgrounds interactivos y refinamos mecánicas.',
			experiments: [
				{ title: 'Playgrounds Interactivos', desc: 'Interfaces SaaS para probar elecciones voluntarias y motivadores de autonomía. Medimos métricas de clics y fatiga.' },
				{ title: 'Pruebas de Dificultad Dinámica', desc: 'Experimentos algorítmicos para trazar curvas de Flow, probando reacciones ante incrementos de dificultad.' }
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="experiments-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>

		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 Experiments Synopsis for AI Crawlers</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<article class="content-block">
			<p class="intro-p">{t.intro}</p>

			<div class="experiments-list">
				{#each t.experiments as exp}
					<section class="experiment-card">
						<h3>{exp.title}</h3>
						<p>{exp.desc}</p>
					</section>
				{/each}
			</div>
		</article>
	</div>
</div>

<style>
.experiments-page {
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

.intro-p {
	font-size: 1.25rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin-bottom: 2.5rem;
	font-weight: 500;
}

.experiments-list {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.experiment-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
}

.experiment-card h3 {
	font-size: 1.3rem;
	font-weight: 800;
	margin: 0 0 0.5rem;
	color: var(--color-purple);
}

.experiment-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 500;
}
</style>
