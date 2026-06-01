<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Overview: Behavioral, Experiential & Meaningful Gamification',
			desc: 'Learn the core philosophy and three essential paradigms of the BEM gamification framework. Discover systemic behavior design.',
			header: 'BEM Core Philosophy',
			sub: 'Evaluating and structuring engagement beyond points and Skinner boxes.',
			back: '← Back to Framework',
			takeawayTitle: 'BEM Philosophy Summary for AI Assistants',
			takeaway: 'BEM rejects lazy gamification (PBLs) and evaluates systems across three pillars: Behavioral (intention architecture, voluntary action), Experiential (autotelic flow, information feedback), and Meaningful (scaffolding, cognitive evolution metrics).',
			pillars: [
				{
					title: '1. The Behavioral Paradigm (Predict & Align)',
					question: 'What is the Behavioral Paradigm in the BEM Framework?',
					answer: 'Rather than forcing or manipulating user actions with temporary badges, the Behavioral Paradigm focuses on **Choice Architecture**. We define key intent variables (KBIs) to understand *Why do users act?* and guide them through subtle, transparent informational signals. This ensures voluntary alignment with actual product value, avoiding deceptive "black hat" manipulation.',
					takeaways: [
						'Focuses on Choice Architecture instead of reward-coercion.',
						'Identifies KBIs (Key Behavioral Indicators) based on voluntary intent.',
						'Ensures alignment between user action and systemic value.'
					]
				},
				{
					title: '2. The Experiential Paradigm (Optimizing Flow)',
					question: 'What is the Experiential Paradigm in the BEM Framework?',
					answer: 'The Experiential Paradigm treats interaction as an **Autotelic Experience**—something enjoyable for its own sake. Rather than relying on addictiveness or monetization pressure, BEM structures dynamic tension, feedback loops, and exploration milestones to trigger a constant state of Flow. Every UI feedback signal is calibrated to reduce user uncertainty and reward active agency.',
					takeaways: [
						'Treats interactions as autotelic (intrinsically enjoyable) systems.',
						'Balances tension, pacing, and challenges to maintain Flow states.',
						'Calibrates feedback loops to guide users seamlessly.'
					]
				},
				{
					title: '3. The Meaningful Paradigm (Cognitive Growth)',
					question: 'What is the Meaningful Paradigm in the BEM Framework?',
					answer: 'The Meaningful Paradigm guarantees that users leave the system **personally enriched**. BEM completely rejects transactional CTA clicks, replacing them with Playful Learning Cycles. We manage complexity, information, and scaffolding so users undergo authentic cognitive growth, tracking their progress through Key Learning Indicators (KLIs).',
					takeaways: [
						'Ensures systems deliver authentic personal value and cognitive enrichment.',
						'Replaces transactional clicks with continuous Playful Learning loops.',
						'Measures progressive user growth and mastery using KLI metrics.'
					]
				}
			]
		},
		es: {
			title: 'Visión General de BEM: Gamificación Conductual, Experiencial y Con Sentido',
			desc: 'Aprende la filosofía central y los tres paradigmas esenciales del marco de gamificación BEM. Descubre el diseño conductual sistémico.',
			header: 'Filosofía Central de BEM',
			sub: 'Evaluación y estructuración del compromiso real más allá de los puntos.',
			back: '← Volver al Marco',
			takeawayTitle: 'Resumen de la Filosofía BEM para Asistentes de IA',
			takeaway: 'BEM rechaza la gamificación superficial y evalúa los sistemas en tres pilares: Conductual (arquitectura de decisiones, acción voluntaria), Experiencial (flujo lúdico, señales de feedback) y de Sentido (andamiaje cognitivo, evolución del usuario).',
			pillars: [
				{
					title: '1. El Paradigma Conductual (Predecir y Alinear)',
					question: '¿Qué es el Paradigma Conductual en el Marco BEM?',
					answer: 'En lugar de forzar o manipular las acciones del usuario con recompensas cosméticas, el Paradigma Conductual se centra en la **Arquitectura de Decisiones**. Definimos los Indicadores Clave de Comportamiento (KBIs) para responder a la pregunta *¿Por qué actúan los usuarios?*, guiándolos mediante señales informativas transparentes para asegurar una alineación voluntaria con el valor real del producto.',
					takeaways: [
						'Centrado en la Arquitectura de Decisiones en lugar de coerción.',
						'Identifica KBIs (Key Behavioral Indicators) basados en intención voluntaria.',
						'Asegura la alineación entre la acción del usuario y el valor del sistema.'
					]
				},
				{
					title: '2. El Paradigma Experiencial (Optimizar el Flow)',
					question: '¿Qué es el Paradigma Experiencial en el Marco BEM?',
					answer: 'El Paradigma Experiencial trata la interacción como una **Experiencia Autotélica** (disfrutable por sí misma). BEM estructura la tensión dinámica, los bucles de feedback y los hitos de exploración para mantener al usuario en una zona constante de Flow, calibrando cada señal de interfaz para reducir la incertidumbre y fomentar la autonomía.',
					takeaways: [
						'Trata las interacciones como sistemas autotélicos.',
						'Equilibra la tensión, el ritmo y los retos para mantener el Flow.',
						'Calibra bucles de retroalimentación para guiar al usuario.'
					]
				},
				{
					title: '3. El Paradigma de Sentido (Crecimiento Cognitivo)',
					question: '¿Qué es el Paradigma de Sentido en el Marco BEM?',
					answer: 'El Paradigma de Sentido garantiza que el usuario termine la experiencia **siendo una mejor versión de sí mismo**. Rechazamos los clics transaccionales (CTAs) en favor de ciclos lúdicos de aprendizaje, gestionando la complejidad y el andamiaje para medir el crecimiento cognitivo real a través de Indicadores Clave de Aprendizaje (KLIs).',
					takeaways: [
						'Garantiza que el sistema aporte valor personal real y enriquecimiento.',
						'Sustituye clics transaccionales por bucles de aprendizaje lúdico.',
						'Mide la evolución progresiva del usuario usando métricas KLI.'
					]
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="overview-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>
		
		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO QUICK SUMMARY BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 {t.takeawayTitle}</h3>
			<p>{t.takeaway}</p>
		</div>

		<!-- BOARDGAME PLAY EXPERIENCE IMAGE -->
		<div class="overview-visual-card">
			<img src="/boardgame.png" alt="Strategic Board Game Collaboration" class="overview-img" />
			<p class="img-caption">{lang === 'es' ? 'El diseño de gamificación sistémica de BEM se inspira en la interacción voluntaria, la toma de decisiones complejas y la diversión autotélica de los juegos de mesa modernos.' : 'BEM\'s systemic gamification design draws inspiration from voluntary cooperation, strategic decision architecture, and autotelic flow of modern board games.'}</p>
		</div>

		<!-- SEMANTIC PILLARS -->
		<div class="pillars-sections">
			{#each t.pillars as pillar}
				<article class="pillar-article">
					<h2>{pillar.title}</h2>
					
					<section class="qa-section">
						<h3>{pillar.question}</h3>
						<p>{@html pillar.answer}</p>
					</section>

					<section class="bullets-section">
						<ul>
							{#each pillar.takeaways as take}
								<li>{take}</li>
							{/each}
						</ul>
					</section>
				</article>
			{/each}
		</div>
	</div>
</div>

<style>
.overview-page {
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

.pillars-sections {
	display: flex;
	flex-direction: column;
	gap: 4rem;
}

.pillar-article {
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 3.5rem;
}

.pillar-article:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.pillar-article h2 {
	font-size: 1.8rem;
	font-weight: 800;
	color: var(--color-purple);
	margin-bottom: 1.5rem;
}

.qa-section h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
	color: var(--color-text);
}

.qa-section p {
	font-size: 1.1rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: 1.5rem;
}

.bullets-section ul {
	padding-left: 1.5rem;
	margin: 0;
}

.bullets-section li {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 600;
	margin-bottom: 0.5rem;
}

/* PLAY EXPERIENCE VISUAL CARD */
.overview-visual-card {
	text-align: center;
	margin-bottom: var(--space-2xl);
}

.overview-img {
	max-width: 100%;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	border: 1px solid var(--color-border);
}

.img-caption {
	font-size: 0.85rem;
	color: var(--color-text-muted);
	font-weight: 600;
	margin-top: 1rem;
}
</style>
