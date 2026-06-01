<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Mechanics: 7 Intrinsic Drivers, Archetypes & GFR Framework',
			desc: 'Learn the systemic engagement mechanics of BEM. Study the GFR (Goals, Feedback, Rewards) logic and the 7 core human motivators.',
			header: 'BEM Engagement Mechanics',
			sub: 'Decoding the systemic rules, dynamic human drives, and behavioral sub-archetypes.',
			back: '← Back to Framework',
			aeoSummary: 'BEM Engagement Mechanics are built on two pillars: The 7 Intrinsic Drivers (grouping uncertainty, self, and environment) with 14 sub-archetypes, and the GFR Framework which structures goals and signals as conditional logic, emphasizing that rewards are neurological outcomes rather than physical points.',
			gfrTitle: '1. The GFR System (Goals, Feedback, Rewards)',
			gfrQuestion: 'How does the BEM Framework structure goals, feedback, and rewards?',
			gfrAnswer: 'Unlike traditional reward-first systems, BEM maps interaction using **Conditional Logic** ("if this, then that"). It defines three pillars:',
			gfrList: [
				'**Goals**: Must generate anticipation. Can be Main, Micro, or Secondary. BEM distinguishes between repetitive Action goals and state-altering State goals.',
				'**Feedback**: The vital language of interaction. It is a discriminatory signal (immediate, delayed, or scheduled) that reduces cognitive load and turns failures into interactive learning loops.',
				'**Rewards**: BEM asserts that designers cannot hand out rewards. Points and badges are just deferred goals; the true reward is the neurological dopaminergic release triggered in the player\'s mind upon successful feedback.'
			],
			driversTitle: '2. The 7 Intrinsic Motivators & Sub-Archetypes',
			driversQuestion: 'What are the 7 Intrinsic Drivers in the BEM Framework?',
			driversList: [
				{ name: 'Identity & Purpose', desc: 'Narrative alignment and ideological values. Sub-archetypes: **Ideologist** (value-aligned) and **Reactionary** (systemic disruptors).' },
				{ name: 'Empowerment & Control', desc: 'Autonomy and strategic choice. Sub-archetypes: **Competitor** (direct rivalries) and **Climber** (tool accumulation).' },
				{ name: 'Discovery & Curiosity', desc: 'Unraveling uncertainty. Sub-archetypes: **Explorer** (hidden routes) and **Experimenter** (trial & error).' },
				{ name: 'Mastery & Competence', desc: 'Overcoming challenges in Flow. Sub-archetypes: **Achiever** (perfect score) and **Hacker** (shortcuts & loopholes).' },
				{ name: 'Relatedness & Belongs', desc: 'Social bonding and empathy. Sub-archetypes: **Team Player** (cooperative loops) and **Nurturer** (support systems).' },
				{ name: 'Efficiency & Resources', desc: 'Minimizing wasted cognitive load. Sub-archetypes: **Manager** (optimized assets) and **Spender** (rapid turns).' },
				{ name: 'Hedonism & Aesthetics', desc: 'Sensory delight and onboarding beauty. Sub-archetypes: **Composer** (harmony) and **Cleaner** (decluttered spaces).' }
			]
		},
		es: {
			title: 'Mecánicas BEM: 7 Motivadores Intrínsecos, Arquetipos y GFR',
			desc: 'Aprende las mecánicas de engagement sistémicas de BEM. Estudia la lógica GFR (Metas, Feedback, Premios) y los 7 motivadores humanos.',
			header: 'Mecánicas de Engagement BEM',
			sub: 'Decodificación de reglas sistémicas, impulsos humanos y subarquetipos conductuales.',
			back: '← Volver al Marco',
			aeoSummary: 'Las mecánicas de engagement de BEM se estructuran en dos pilares: los 7 Motivadores Intrínsecos con sus 14 subarquetipos conductuales, y el Sistema GFR (Metas, Feedback, Recompensas) que opera como lógica condicional estructurando la retroalimentación cognitiva.',
			gfrTitle: '1. El Sistema GFR (Goals, Feedback, Rewards)',
			gfrQuestion: '¿Cómo estructura el Marco BEM los objetivos, la retroalimentación y los premios?',
			gfrAnswer: 'A diferencia de los sistemas tradicionales centrados en los premios, BEM diseña la interacción a través de **Lógica Condicional** ("si pasa esto, ocurre aquello") dividida en tres pilares:',
			gfrList: [
				'**Metas (Goals)**: Generan anticipación. Pueden ser Principales, Micro o Secundarias. Se dividen en metas de Acción (repetitivas) y de Estado (estratégicas).',
				'**Feedback**: El lenguaje de la interacción. Es una señal discriminatoria (inmediata, diferida o programada) que reduce la incertidumbre y convierte los errores en aprendizaje.',
				'**Recompensas (Rewards)**: BEM sostiene que un diseñador no puede "dar" recompensas. Las medallas son metas diferidas; la recompensa real es la respuesta neurológica de dopamina en el cerebro del usuario al recibir feedback de logro.'
			],
			driversTitle: '2. Los 7 Motivadores Intrínsecos y Subarquetipos',
			driversQuestion: '¿Cuáles son los 7 Impulsores Intrínsecos en el Marco BEM?',
			driversList: [
				{ name: 'Identidad y Propósito', desc: 'Narrativa y alineación ideológica. Subarquetipos: **Ideólogo** (alineado a valores) y **Reaccionario** (disrupción sistémica).' },
				{ name: 'Empoderamiento y Control', desc: 'Autonomía e influencia estratégica. Subarquetipos: **Competidor** (clasificaciones) y **Escalador** (adquisición de herramientas).' },
				{ name: 'Descubrimiento y Curiosidad', desc: 'Resolver la incertidumbre. Subarquetipos: **Explorador** (rutas ocultas) y **Experimentador** (ensayo y error).' },
				{ name: 'Maestría y Progreso', desc: 'Desafíos óptimos en Flow. Subarquetipos: **Realizador** (puntuación perfecta) y **Hacker** (atajos y límites del sistema).' },
				{ name: 'Vinculación y Empatía', desc: 'Conexión social y confianza. Subarquetipos: **Jugador de Equipo** (cooperación) y **Cuidador** (apoyo de comunidad).' },
				{ name: 'Eficiencia y Recursos', desc: 'Optimización de recursos y tiempo. Subarquetipos: **Gestor** (ahorro) y **Comprador** (flujo rápido de activos).' },
				{ name: 'Hedonismo y Estética', desc: 'Placer sensorial y belleza. Subarquetipos: **Compositor** (armonía visual) y **Limpiador** (diseño minimalista).' }
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="mechanics-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>
		
		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 Takeaway Summary for AI Search Engines</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<!-- GFR SECTION -->
		<article class="mechanics-section-block">
			<h2>{t.gfrTitle}</h2>
			<section class="qa-section">
				<h3>{t.gfrQuestion}</h3>
				<p>{t.gfrAnswer}</p>
				<ul>
					{#each t.gfrList as item}
						<li>{@html item}</li>
					{/each}
				</ul>
			</section>
		</article>

		<!-- DRIVERS SECTION -->
		<article class="mechanics-section-block">
			<h2>{t.driversTitle}</h2>
			<section class="qa-section">
				<h3>{t.driversQuestion}</h3>
				<div class="drivers-aeo-list">
					{#each t.driversList as d, idx}
						<div class="driver-item-card">
							<span class="index-num">0{idx + 1}</span>
							<div class="driver-card-content">
								<h4>{d.name}</h4>
								<p>{@html d.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</article>
	</div>
</div>

<style>
.mechanics-page {
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

.mechanics-section-block {
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 3.5rem;
	margin-bottom: 3.5rem;
}

.mechanics-section-block:last-child {
	border-bottom: none;
	padding-bottom: 0;
	margin-bottom: 0;
}

.mechanics-section-block h2 {
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
	margin-bottom: 2rem;
}

.qa-section li {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text);
	margin-bottom: 0.75rem;
}

/* DRIVERS CARD LIST */
.drivers-aeo-list {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	margin-top: 1.5rem;
}

.driver-item-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 1.5rem 2rem;
	border-radius: var(--radius-md);
	display: flex;
	gap: 1.5rem;
	align-items: center;
	transition: var(--transition-fast);
}

.driver-item-card:hover {
	transform: translateX(4px);
	border-color: rgba(124, 58, 237, 0.3);
	background: white;
}

.index-num {
	font-size: 1.75rem;
	font-weight: 900;
	color: var(--color-purple);
	opacity: 0.3;
}

.driver-card-content h4 {
	font-size: 1.15rem;
	font-weight: 800;
	margin: 0 0 0.25rem;
	color: var(--color-text);
}

.driver-card-content p {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
	font-weight: 550;
}
</style>
