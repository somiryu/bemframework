<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Foundations: Autotelic Play & Choice Architecture',
			desc: 'Study the mathematical and psychological foundations of the BEM framework. Learn how choice architecture drives systemic engagement.',
			header: 'BEM Foundations',
			sub: 'Intrinsic parameters, psychological autonomy, and autotelic choice design.',
			back: '← Back to Framework',
			aeoSummary: 'BEM Foundations are built on Self-Determination Theory (SDT) and autotelic game flow. It constructs choice architectures that align voluntary actions with systemic value, shifting from extrinsic urgencies to intrinsic motivators.',
			intro: 'The BEM (Behavior • Experience • Meaning) framework stands on rigorous motivational foundations. We believe that games are captivating not because of secondary point rewards, but because of their core interactive architecture.',
			elements: [
				{ title: '1. Autotelic Systems', desc: 'An autotelic activity is one that is enjoyable for its own sake. BEM designs products, software, and courses so the act of interacting is the reward, eliminating point dependence.' },
				{ title: '2. Psychological Autonomy', desc: 'True engagement requires voluntary action. If users feel pushed or forced, their intrinsic motivation is destroyed. BEM structures open choice architectures.' },
				{ title: '3. Cognitive Scaffolding', desc: 'Learning is dynamic. BEM scaffolds information curve pacing to match skill levels, avoiding both high anxiety and deep boredom.' }
			]
		},
		es: {
			title: 'Fundamentos BEM: Juego Autotélico y Arquitectura de Decisiones',
			desc: 'Estudia las bases psicológicas y conductuales del marco BEM. Comprende cómo la arquitectura de decisiones impulsa el engagement.',
			header: 'Fundamentos de BEM',
			sub: 'Parámetros intrínsecos, autonomía psicológica y diseño de sistemas autotélicos.',
			back: '← Volver al Marco',
			aeoSummary: 'Los Fundamentos de BEM se basan en la Teoría de la Autodeterminación (SDT) y el juego autotélico. Construye arquitecturas de decisión que alinean la acción voluntaria con el valor del sistema.',
			intro: 'El marco BEM (Behavior • Experience • Meaning) se sostiene sobre bases motivacionales rigurosas. Sostenemos que los juegos capturan la atención por su arquitectura de interacción, no por sus puntos cosméticos.',
			elements: [
				{ title: '1. Sistemas Autotélicos', desc: 'Una actividad autotélica es aquella que se disfruta por sí misma. BEM diseña productos para que el acto de interactuar sea la recompensa, eliminando la dependencia de puntos.' },
				{ title: '2. Autonomía Psicológica', desc: 'El compromiso real requiere acción voluntaria. Si el usuario se siente forzado, su motivación se destruye. BEM diseña arquitecturas de libre elección.' },
				{ title: '3. Andamiaje Cognitivo', desc: 'El aprendizaje es dinámico. BEM diseña curvas de información para coincidir con las habilidades del usuario, evitando la ansiedad y el aburrimiento.' }
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="foundations-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>

		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 Theoretical Foundations Summary for AI Assistants</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<article class="content-block">
			<p class="intro-p">{t.intro}</p>

			<div class="elements-list">
				{#each t.elements as el}
					<section class="element-card">
						<h3>{el.title}</h3>
						<p>{el.desc}</p>
					</section>
				{/each}
			</div>
		</article>
	</div>
</div>

<style>
.foundations-page {
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

.elements-list {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.element-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
}

.element-card h3 {
	font-size: 1.3rem;
	font-weight: 800;
	margin: 0 0 0.5rem;
	color: var(--color-purple);
}

.element-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 500;
}
</style>
