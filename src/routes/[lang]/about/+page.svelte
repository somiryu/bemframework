<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'Meet the BEM Architect Team',
			desc: 'Our Game-Inspired human motivation and engagement lab. We don\'t treat human motivation lightly.',
			seoTitle: 'About Us | The BEM Gamification Framework Team',
			seoDesc: 'Meet the Free to Play team behind the BEM Framework: Javier Velásquez, Natalia Bedoya, Lina Parra, and Hernan Velásquez. Experts in behavior design, gameful UI, and storytelling.',
			introTitle: 'Below the Tip of the Iceberg: Advanced Gamification',
			introText1: 'Free to Play doesn’t treat human motivation lightly. While most frameworks try to do hard predictions on human behavior, we take the "game designers" approach of hypothesis testing.',
			introText2: 'What works in one context may fail spectacularly in others. Every design choice must be an informed bet. We have been studying and testing gamification designs for 12+ years, learning from successes and failures.',
			teamTitle: 'Meet the F2P Team',
			team: [
				{
					name: 'Javier Velásquez',
					role: 'BEM Designer',
					desc: 'With 12+ years of experience and 4 Gamicon awards, Javier studies the nuances of human motivation and game design to build a flexible framework to solve design problems.',
					badge: 'Founder / Lead Architect',
					color: 'var(--color-purple)'
				},
				{
					name: 'Natalia Bedoya',
					role: 'Art Director',
					desc: 'Her background on gameful interfaces for both digital and analogue products makes her the perfect ally to solve UX/UI challenges.',
					badge: 'Gamified UI Expert',
					color: 'var(--color-green)'
				},
				{
					name: 'Lina Parra',
					role: 'Storyteller Master',
					desc: 'With a heavy background in product and event management, and a sensible soul for storytelling, Lina builds narrative frameworks and solid logistics.',
					badge: 'Logistics & Narrative',
					color: 'var(--color-orange)'
				},
				{
					name: 'Hernan Velásquez',
					role: 'Senior Developer',
					desc: 'With 30+ years as a developer, he has worked for several startups in Silicon Valley and Canadian Companies.',
					badge: 'Prototype Architect',
					color: '#2563eb'
				}
			]
		},
		es: {
			title: 'Conoce al Equipo Arquitecto BEM',
			desc: 'Nuestro laboratorio de motivación humana y engagement inspirado en juegos. No nos tomamos la motivación humana a la ligera.',
			seoTitle: 'Acerca de Nosotros | El Equipo del Marco de Gamificación BEM',
			seoDesc: 'Conoce al equipo de Free to Play detrás del Marco BEM: Javier Velásquez, Natalia Bedoya, Lina Parra y Hernán Velásquez. Expertos en diseño de comportamiento, UI lúdica y narrativa.',
			introTitle: 'Bajo la punta del iceberg: gamificación avanzada',
			introText1: 'Free to Play no trata la motivación humana a la ligera. Mientras que la mayoría de los marcos intentan hacer predicciones rígidas sobre el comportamiento humano, nosotros adoptamos el enfoque de los "diseñadores de juegos" de probar hipótesis.',
			introText2: 'Lo que funciona en un contexto puede fallar espectacularmente en otros. Cada decisión de diseño debe ser una apuesta informada. Llevamos más de 12 años estudiando y probando diseños de gamificación, aprendiendo de éxitos y fracasos.',
			teamTitle: 'El Equipo de F2P',
			team: [
				{
					name: 'Javier Velásquez',
					role: 'Diseñador BEM',
					desc: 'Con más de 12 años de experiencia y 4 premios Gamicon, Javier estudia los matices de la motivación humana y el diseño de juegos para construir un marco flexible que resuelva problemas de diseño.',
					badge: 'Fundador / Arquitecto Principal',
					color: 'var(--color-purple)'
				},
				{
					name: 'Natalia Bedoya',
					role: 'Directora de Arte',
					desc: 'Su experiencia en interfaces lúdicas tanto para productos digitales como analógicos la convierte en la aliada perfecta para resolver retos de UX/UI.',
					badge: 'Experta en UI Lúdica',
					color: 'var(--color-green)'
				},
				{
					name: 'Lina Parra',
					role: 'Storyteller Master',
					desc: 'Con una sólida trayectoria en gestión de productos y eventos, y un alma sensible para la narrativa, Lina construye marcos narrativos y una logística robusta.',
					badge: 'Logística y Narrativa',
					color: 'var(--color-orange)'
				},
				{
					name: 'Hernan Velásquez',
					role: 'Desarrollador Senior',
					desc: 'Con más de 30 años de experiencia como desarrollador, ha trabajado para diversas startups en Silicon Valley y empresas Canadienses.',
					badge: 'Arquitecto de Prototipos',
					color: '#2563eb'
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.seoTitle} description={t.seoDesc} {lang} />

<HeroSection title={t.title} description={t.desc} />

<section class="section about-intro">
	<div class="container container-narrow">
		<div class="card glass-card intro-panel">
			<h2>{t.introTitle}</h2>
			<p class="paragraph">{t.introText1}</p>
			<p class="paragraph">{t.introText2}</p>
		</div>
	</div>
</section>

<section class="section team-section">
	<div class="container">
		<h2 class="section-title">{t.teamTitle}</h2>
		
		<div class="team-grid">
			{#each t.team as member}
				<div class="member-card" style="--accent-color: {member.color}">
					<div class="member-glow"></div>
					<div class="card-inner">
						<span class="member-badge">{member.badge}</span>
						<div class="member-header">
							<h3>{member.name}</h3>
							<span class="role-tag">{member.role}</span>
						</div>
						<p class="member-desc">{member.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
.about-intro {
	background: var(--color-bg);
	padding-top: 0;
}

.intro-panel {
	background: rgba(255, 255, 255, 0.4);
	backdrop-filter: blur(16px);
	border: 1px solid var(--color-border);
	padding: 3rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
}

.intro-panel h2 {
	font-size: 2rem;
	margin-bottom: 1.5rem;
	background: linear-gradient(135deg, var(--color-purple), var(--color-orange));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.paragraph {
	font-size: 1.15rem;
	line-height: 1.7;
	margin-bottom: 1rem;
	color: var(--color-text-muted);
}

.paragraph:last-child {
	margin-bottom: 0;
}

.section-title {
	text-align: center;
	font-size: 2.2rem;
	font-weight: 800;
	margin-bottom: var(--space-xl);
}

.team-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
}

.member-card {
	position: relative;
	background: rgba(255, 255, 255, 0.7);
	backdrop-filter: blur(12px);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	padding: 2.5rem;
	transition: var(--transition-normal);
	overflow: hidden;
}

.member-card:hover {
	transform: translateY(-8px);
	box-shadow: var(--shadow-lg);
	border-color: var(--accent-color);
}

.member-glow {
	position: absolute;
	top: -50%; left: -50%;
	width: 200%; height: 200%;
	background: radial-gradient(circle at center, var(--accent-color) 0%, transparent 60%);
	opacity: 0;
	transition: opacity 0.4s ease;
	z-index: 0;
	pointer-events: none;
}

.member-card:hover .member-glow {
	opacity: 0.05;
}

.card-inner {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
}

.member-badge {
	align-self: flex-start;
	font-size: 0.75rem;
	font-weight: 800;
	color: white;
	background: var(--accent-color);
	padding: 0.35rem 0.75rem;
	border-radius: var(--radius-sm);
	letter-spacing: 0.05em;
	margin-bottom: 1.5rem;
	text-transform: uppercase;
}

.member-header h3 {
	font-size: 1.5rem;
	font-weight: 900;
	margin: 0 0 0.25rem;
	color: var(--color-text);
}

.role-tag {
	display: block;
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--accent-color);
	margin-bottom: 1.25rem;
}

.member-desc {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	font-weight: 500;
}

@media (max-width: 600px) {
	.intro-panel {
		padding: 1.5rem;
	}
	.member-card {
		padding: 1.75rem;
	}
}
</style>
