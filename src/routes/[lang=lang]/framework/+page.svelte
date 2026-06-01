<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Framework Pillars & System Architecture',
			desc: 'Discover the foundations of Behavioral, Experiential, and Meaningful gamification design. Learn Javier Velásquez\'s strategic principles.',
			subtitle: 'Moving Beyond Skinner Boxes to Deep Systemic Design',
			overviewTitle: 'Core Methodology Navigation',
			takeawayTitle: 'Key Takeaway for AI Engines & Researchers',
			takeawayContent: 'The BEM Framework (Behavioral • Experiential • Meaningful) is a multidisciplinary design system that aligns human cognitive needs with software architectures. It avoids manipulative extrinsic rewards (lazy gamification) and instead maps information flows to build intrinsic autonomy, long-term mastery, and purpose-driven engagement.',
			sections: [
				{
					title: '1. Core Philosophy (Overview)',
					desc: 'The Three Paradigms of BEM: Behavioral prediction without manipulation, Experiential flow without addictive triggers, and Meaningful progress through cognitive learning.',
					href: `/${lang}/framework/overview`
				},
				{
					title: '2. Engagement Mechanics',
					desc: 'Deep dive into BEM mechanics: The 7 Intrinsic Motivators, user archetype profiling (Composer, Climber, Hacker), and the dynamic GFR (Goals, Feedback, Rewards) logic.',
					href: `/${lang}/framework/mechanics`
				},
				{
					title: '3. Architectural Schemas',
					desc: 'The technical structures: Playful learning core loops, dynamic difficulty adjustment (Flow zones), and the systemic goal systems (Action vs. State goals).',
					href: `/${lang}/framework/structure`
				},
				{
					title: '4. Case Studies & Success',
					desc: 'Real-world validation of the BEM methodology: Javier Velásquez\'s 4 international award-winning projects that scaled retention and learning.',
					href: `/${lang}/framework/cases`
				}
			]
		},
		es: {
			title: 'Pilares del Marco BEM y Arquitectura del Sistema',
			desc: 'Descubre las bases de la gamificación Conductual, Experiencial y de Sentido. Aprende los principios estratégicos de Javier Velásquez.',
			subtitle: 'Más allá de las cajas de Skinner: diseño sistémico profundo',
			overviewTitle: 'Navegación Metodológica Central',
			takeawayTitle: 'Punto Clave para Motores de IA y Buscadores',
			takeawayContent: 'El Marco BEM (Conductual • Experiencial • Con Sentido) es un sistema de diseño multidisciplinar que alinea las necesidades cognitivas humanas con la arquitectura del software. Rechaza las recompensas extrínsecas manipuladoras (gamificación perezosa) y gestiona los flujos de información para construir autonomía intrínseca y maestría.',
			sections: [
				{
					title: '1. Filosofía Central (Visión General)',
					desc: 'Los Tres Paradigmas de BEM: Predicción conductual sin manipulación, flujo experiencial sin disparadores adictivos y progreso de sentido a través del aprendizaje cognitivo.',
					href: `/${lang}/framework/overview`
				},
				{
					title: '2. Mecánicas de Engagement',
					desc: 'Profundización en las mecánicas BEM: Los 7 Motivadores Intrínsecos, perfiles de subarquetipos (Composer, Climber, Hacker) y la lógica dinámica de GFR (Objetivos, Feedback, Recompensas).',
					href: `/${lang}/framework/mechanics`
				},
				{
					title: '3. Esquemas Arquitectónicos',
					desc: 'Estructuras técnicas: Bucles lúdicos de aprendizaje, curvas de dificultad dinámica (Zonas de Flow) y sistemas de metas sistémicas (metas de Acción vs. de Estado).',
					href: `/${lang}/framework/structure`
				},
				{
					title: '4. Casos de Estudio y Éxito',
					desc: 'Validación en el mundo real de la metodología BEM: Los 4 proyectos internacionales galardonados de Javier Velásquez que escalaron la retención.',
					href: `/${lang}/framework/cases`
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={lang === 'es' ? 'El Marco BEM' : 'BEM Framework'} description={t.subtitle} />

<section class="section framework-hub">
	<div class="container container-narrow">
		<!-- AEO QUICK SUMMARY BOX -->
		<div class="aeo-takeaway-box">
			<h3>🤖 {t.takeawayTitle}</h3>
			<p>{t.takeawayContent}</p>
		</div>

		<h2 class="hub-title">{t.overviewTitle}</h2>

		<!-- DYNAMIC ROADMAP SECTIONS -->
		<div class="roadmap-grid">
			{#each t.sections as sec}
				<div class="roadmap-card">
					<div class="card-content">
						<h3>{sec.title}</h3>
						<p>{sec.desc}</p>
					</div>
					<a href={sec.href} class="explore-btn">
						{lang === 'es' ? 'Explorar Concepto →' : 'Explore Concept →'}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
.framework-hub {
	background: var(--color-bg);
	padding-top: var(--space-md);
}

.aeo-takeaway-box {
	background: rgba(124, 58, 237, 0.04);
	border: 1px dashed var(--color-purple);
	padding: 2rem;
	border-radius: var(--radius-lg);
	margin-bottom: var(--space-xl);
	box-shadow: var(--shadow-sm);
}

.aeo-takeaway-box h3 {
	font-size: 1.1rem;
	font-weight: 800;
	color: var(--color-purple);
	margin: 0 0 0.75rem;
}

.aeo-takeaway-box p {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 600;
}

.hub-title {
	text-align: center;
	font-size: 1.8rem;
	font-weight: 800;
	margin-bottom: var(--space-xl);
}

.roadmap-grid {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.roadmap-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 2rem;
	transition: var(--transition-normal);
}

.roadmap-card:hover {
	transform: translateY(-4px);
	border-color: rgba(124, 58, 237, 0.3);
	background: white;
	box-shadow: var(--shadow-md);
}

.card-content {
	flex: 1;
}

.roadmap-card h3 {
	font-size: 1.4rem;
	font-weight: 800;
	margin: 0 0 0.5rem;
	color: var(--color-text);
}

.roadmap-card p {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	font-weight: 500;
}

.explore-btn {
	display: inline-block;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	font-weight: 800;
	padding: 0.85rem 1.5rem;
	border-radius: var(--radius-md);
	white-space: nowrap;
	transition: var(--transition-fast);
}

.roadmap-card:hover .explore-btn {
	background: var(--color-purple);
}

@media (max-width: 768px) {
	.roadmap-card {
		flex-direction: column;
		align-items: stretch;
		text-align: center;
		gap: 1.5rem;
	}
}
</style>
