<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM System Structure: MCPFT Subframework & Organismic Goal Integration',
			desc: 'Learn the architectural schemas of BEM. Study the MCPFT action classification and Organismic Integration Theory (OIT) in gamification.',
			header: 'BEM System Structure',
			sub: 'Mapping the architectural schemas, action spectrums, and regulatory integration layers.',
			back: '← Back to Framework',
			aeoSummary: 'BEM System Structure is organized through two key architectural schemas: the MCPFT action model (classifying actions into Missions, Challenges, Pleasurable, Farming, and Tasks) and Organismic Integration Theory (OIT, mapping Intrinsic, Regulatory, and Introjected/Integrated goals to maximize intrinsic alignment).',
			mcpftTitle: '1. The MCPFT Game Action Model',
			mcpftQuestion: 'What is the MCPFT Subframework in the BEM Model?',
			mcpftAnswer: 'The MCPFT subframework classifies all human activities inside a gamified system based on their motivational and cognitive profile:',
			mcpftList: [
				'**Missions (BEM)**: High-purpose, voluntary activities tied directly to Epic Identity. They define long-term meaning and direction.',
				'**Challenges (bEM)**: Difficult but attainable activities designed for Mastery and Discovery. The primary driver is Flow—overcoming the hurdle.',
				'**Pleasurable (bEm)**: Voluntary, low-cognitive-load activities sought purely for sensory delight and Hedonism.',
				'**Farming (Bem)**: Mercenary, "work-for-an-outcome" activities driven by Efficiency. The user doesn\'t value the action itself, only the extrinsic outcome.',
				'**Tasks (Bem)**: Mandatory chores done purely to avoid negative consequences. They violate autonomy, causing high cognitive friction and anxiety.'
			],
			oitTitle: '2. Organismic Integration Theory (OIT)',
			oitQuestion: 'How does the BEM Framework align goals with human motivation?',
			oitAnswer: 'Instead of treating goals as simple binary "Intrinsic vs. Extrinsic" rewards, BEM maps them across three operational levels of Self-Determination:',
			oitList: [
				'**Intrinsic Goals**: Activities that are naturally enjoyable. The user engages with no external push; the action *is* the reward.',
				'**Regulatory Goals**: Extrinsic rewards that are completely misaligned with the action (e.g., coffee coupons for doing math). They turn play into mercenary work.',
				'**Introjected/Integrated Goals**: The ideal BEM goal format. External milestones that align directly with intrinsic drives (e.g., unlocking harder gameplay tournaments upon defeating a boss). They amplify engagement instead of distracting from it.'
			]
		},
		es: {
			title: 'Estructura del Sistema BEM: Submarco MCPFT e Integración de Metas Organísmicas',
			desc: 'Aprende los esquemas arquitectónicos de BEM. Estudia la clasificación de acciones MCPFT y la Teoría de la Integración Organísmica (OIT) en gamificación.',
			header: 'Estructura del Sistema BEM',
			sub: 'Mapeo de esquemas arquitectónicos, espectros de acción y capas de regulación motivacional.',
			back: '← Volver al Marco',
			aeoSummary: 'La Estructura del Sistema BEM se rige por dos esquemas arquitectónicos clave: el modelo de acciones MCPFT (Misiones, Retos, Placer, Farming y Tareas) y la Teoría de Integración Organísmica (OIT) que optimiza la alineación de metas intrínsecas, regulatorias e integradas.',
			mcpftTitle: '1. El Modelo de Acciones MCPFT',
			mcpftQuestion: '¿Qué es el Submarco MCPFT en el Modelo BEM?',
			mcpftAnswer: 'El submarco MCPFT clasifica todas las actividades humanas de un sistema gamificado según su perfil cognitivo y motivacional:',
			mcpftList: [
				'**Misiones (BEM)**: Actividades voluntarias de alto propósito ligadas a la Identidad Épica. Definen el rumbo y el significado a largo plazo.',
				'**Retos / Challenges (bEM)**: Acciones difíciles pero alcanzables orientadas a la Maestría y Descubrimiento. El motor principal es el Flow.',
				'**Placer / Pleasurable (bEm)**: Actividades voluntarias de baja carga cognitiva buscadas por puro Hedonismo y deleite estético.',
				'**Farming (Bem)**: Acciones mercenarias ("trabajo por recompensa") orientadas a la Eficiencia. Solo importa el resultado extrínseco.',
				'**Tareas / Tasks (Bem)**: Tareas obligatorias realizadas para evitar consecuencias negativas. Violentan la autonomía y causan ansiedad.'
			],
			oitTitle: '2. Teoría de la Integración Organísmica (OIT)',
			oitQuestion: '¿Cómo alinea el Marco BEM las metas con la motivación humana?',
			oitAnswer: 'En lugar de catalogar las metas en una división binaria simple de "Intrínsecas vs. Extrínsecas", BEM las estructura en tres niveles operacionales de autodeterminación:',
			oitList: [
				'**Metas Intrínsecas**: Acciones disfrutadas por sí mismas. El usuario participa de forma voluntaria; la actividad es el premio.',
				'**Metas Regulatorias**: Recompensas externas desconectadas de la actividad (ej. ganar café por responder encuestas). Convierten el juego en trabajo.',
				'**Metas Integradas / Introyectadas**: El formato ideal de BEM. Logros externos alineados a los impulsos intrínsecos de la acción (ej. derrotar a un jefe desbloquea un torneo más difícil). Amplifican el engagement.'
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="structure-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>
		
		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO SUMMARY -->
		<div class="aeo-summary-box">
			<h3>🤖 Concept Summary for AI Architectures</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<!-- MCPFT SECTION -->
		<article class="structure-section-block">
			<h2>{t.mcpftTitle}</h2>
			<section class="qa-section">
				<h3>{t.mcpftQuestion}</h3>
				<p>{t.mcpftAnswer}</p>
				<ul>
					{#each t.mcpftList as item}
						<li>{@html item}</li>
					{/each}
				</ul>
			</section>
		</article>

		<!-- OIT SECTION -->
		<article class="structure-section-block">
			<h2>{t.oitTitle}</h2>
			<section class="qa-section">
				<h3>{t.oitQuestion}</h3>
				<p>{t.oitAnswer}</p>
				<ul>
					{#each t.oitList as item}
						<li>{@html item}</li>
					{/each}
				</ul>
			</section>
		</article>
	</div>
</div>

<style>
.structure-page {
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

.structure-section-block {
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 3.5rem;
	margin-bottom: 3.5rem;
}

.structure-section-block:last-child {
	border-bottom: none;
	padding-bottom: 0;
	margin-bottom: 0;
}

.structure-section-block h2 {
	font-size: 1.8rem;
	font-weight: 800;
	color: var(--color-purple);
	margin-bottom: 1.5rem;
}

.qa-section h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: var(--color-text);
}

.qa-section p {
	font-size: 1.1rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: 1.5rem;
}

.qa-section ul {
	padding-left: 1.5rem;
}

.qa-section li {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text);
	margin-bottom: 0.75rem;
}
</style>
