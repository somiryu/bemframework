<script lang="ts">
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');
</script>

<SEO 
	title={lang === 'es' ? 'Portal de Aprendizaje Interactivo' : 'Interactive Learning Gateway'} 
	description={lang === 'es' ? 'Accede a las herramientas de perfilado BEM y la teoría del Capítulo 2.' : 'Access the BEM motivator profiling tools and Chapter 2 pedagogical theory.'} 
	{lang} 
/>

<HeroSection 
	title={lang === 'es' ? 'Portal de Interactividad BEM' : 'BEM Interactivity Hub'} 
	description={lang === 'es' ? 'Hemos expandido el ecosistema BEM para separar las herramientas prácticas de la teoría conductual.' : 'We have expanded the BEM ecosystem to separate hands-on design tools from core theory.'} 
/>

<section class="section gateway-view">
	<div class="container broad-layout">
		<div class="gateway-grid">
			<!-- CARD 1: THE THEORY (Chapter 2) -->
			<div class="gateway-card card glass-card border-green">
				<h3>📘 {lang === 'es' ? '1. Teoría del Aprendizaje Interactivo' : '1. Interactive Learning Theory'}</h3>
				<p>{lang === 'es' ? 'Estudia el Capítulo 2 del manual de aprendizaje BEM, explicando por qué los juegos enseñan sin profesores mediante la interactividad.' : 'Study Chapter 2 of the BEM learning manual, explaining why games teach without human mediation.'}</p>
				<a href={`/${lang}/learning/interaction`} class="nav-btn">{lang === 'es' ? 'Leer Teoría →' : 'Read Theory →'}</a>
			</div>

			<!-- CARD 2: THE TOOL (Profiler & SVG Radar) -->
			<div class="gateway-card card glass-card border-purple">
				<h3>🛠️ {lang === 'es' ? '2. Perfilador de Motivadores BEM' : '2. BEM Motivator Profiler Tool'}</h3>
				<p>{lang === 'es' ? 'Nuestra herramienta interactiva insignia con gráfico de radar SVG en tiempo real para auditar el balance motivacional de tu producto.' : 'Our flagship interactive profiling tool featuring a live SVG radar spider chart to audit product motivation.'}</p>
				<a href={`/${lang}/resources/tools`} class="nav-btn btn-purple">{lang === 'es' ? 'Ir al Perfilador →' : 'Go to Profiler →'}</a>
			</div>
		</div>
	</div>
</section>

<style>
.gateway-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	max-width: 900px !important;
	margin: 0 auto;
}

.gateway-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

@media (max-width: 600px) {
	.gateway-grid {
		grid-template-columns: 1fr;
	}
}

.glass-card {
	background: white;
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	transition: var(--transition-normal);
}

.glass-card:hover {
	transform: translateY(-5px);
}

.gateway-card h3 {
	font-size: 1.35rem;
	font-weight: 800;
	color: var(--color-text);
	margin-bottom: 0.75rem;
}

.gateway-card p {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin-bottom: 2rem;
}

.nav-btn {
	display: inline-block;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	font-weight: 800;
	padding: 0.85rem 1.5rem;
	border-radius: var(--radius-md);
	text-align: center;
	transition: var(--transition-fast);
}

.nav-btn:hover {
	background: var(--color-green);
}

.btn-purple:hover {
	background: var(--color-purple);
}

.border-green { border-top: 4px solid var(--color-green); }
.border-purple { border-top: 4px solid var(--color-purple); }
</style>
