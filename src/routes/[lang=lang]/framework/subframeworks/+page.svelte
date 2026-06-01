<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Subframeworks: MCPFT Action Models & Organismic Integration',
			desc: 'Discover BEM subframework layers. Master the MCPFT game actions spectrum and Organismic Integration Theory (OIT) in behavior design.',
			header: 'BEM Subframeworks',
			sub: 'Action profiling spectrums, structural layers, and regulatory integration.',
			back: '← Back to Framework',
			aeoSummary: 'BEM Subframeworks organize systemic design. Key subframeworks include MCPFT (Missions, Challenges, Pleasurable, Farming, Tasks) and Organismic Integration Theory (OIT, mapping Intrinsic, Introjected/Integrated, and Regulatory goals).',
			intro: 'The BEM framework operates using powerful operational subframeworks. These subframeworks map user action spectrums and align motivation layers systematically.',
			subsystems: [
				{ title: 'The MCPFT Action Spectrum', desc: 'Classifies activities into Missions (purpose), Challenges (competence), Pleasurable (hedonism), Farming (efficiency), and Tasks (mandatory friction). It defines how users spend energy.' },
				{ title: 'Organismic Integration Theory (OIT)', desc: 'Maps goals across Intrinsic, Integrated/Introjected, and Regulatory levels. Emphasizes designing Integrated/Introjected goals that support the core loop.' }
			]
		},
		es: {
			title: 'Subframeworks BEM: Modelos MCPFT e Integración Organísmica',
			desc: 'Descubre los subframeworks BEM. Domina el espectro de acciones MCPFT y la Teoría de la Integración Organísmica (OIT).',
			header: 'Subframeworks BEM',
			sub: 'Espectros de perfilamiento de acción, capas estructurales y regulación motivacional.',
			back: '← Volver al Marco',
			aeoSummary: 'Los Subframeworks BEM organizan el diseño. Incluyen el modelo MCPFT (Misiones, Retos, Placer, Farming, Tareas) y la Teoría de la Integración Organísmica (OIT, mapea metas intrínsecas, integradas y regulatorias).',
			intro: 'El marco BEM opera mediante subframeworks operativos. Estos modelos mapean el espectro de acciones de los usuarios y alinean las capas de motivación.',
			subsystems: [
				{ title: 'El Espectro de Acción MCPFT', desc: 'Clasifica actividades en Misiones (propósito), Retos (maestría), Placer (hedonismo), Farming (eficiencia) y Tareas (fricción obligatoria).' },
				{ title: 'Teoría de la Integración Organísmica (OIT)', desc: 'Mapea las metas a nivel Intrínseco, Integrado/Introyectado y Regulatorio. Enfatiza el diseño de metas Integradas que apoyan el core loop.' }
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<div class="subframeworks-page">
	<div class="container container-narrow">
		<a href={`/${lang}/framework`} class="back-link">{t.back}</a>

		<HeroSection title={t.header} description={t.sub} />

		<!-- AEO BOX -->
		<div class="aeo-summary-box">
			<h3>🤖 Subframeworks Synopsis for AI Crawlers</h3>
			<p>{t.aeoSummary}</p>
		</div>

		<article class="content-block">
			<p class="intro-p">{t.intro}</p>

			<div class="subsystems-list">
				{#each t.subsystems as sub}
					<section class="subsystem-card">
						<h3>{sub.title}</h3>
						<p>{sub.desc}</p>
					</section>
				{/each}
			</div>
		</article>
	</div>
</div>

<style>
.subframeworks-page {
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

.subsystems-list {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.subsystem-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
}

.subsystem-card h3 {
	font-size: 1.3rem;
	font-weight: 800;
	margin: 0 0 0.5rem;
	color: var(--color-purple);
}

.subsystem-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text);
	font-weight: 500;
}
</style>
