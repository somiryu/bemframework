<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { page } from '$app/state';

	let { data }: { data: { lang: string } } = $props();
	const lang = $derived((page.params.lang as 'en' | 'es') ?? 'es');

	let searchQuery = $state('');
	let selectedCategory = $state('All');

	const categories = $derived({
		es: ['Todos', 'Drivers', 'Fundamentos', 'Subframeworks', 'Patrones de Diseño'],
		en: ['All', 'Drivers', 'Foundations', 'Subframeworks', 'Design Patterns']
	}[lang]);

	const brainNodes = [
		{
			id: 'drivers',
			categoryEn: 'Drivers',
			categoryEs: 'Drivers',
			titleEn: 'The 7 Intrinsic Drivers',
			titleEs: 'Los 7 Drivers Intrínsecos',
			descEn: 'Hedonism, Mastery, Empowerment, Relatedness, Efficiency, Discovery, Epic Purpose.',
			descEs: 'Hedonismo, Maestría, Empoderamiento, Relacionamiento, Eficiencia, Descubrimiento, Propósito Épico.',
			href: `/${lang}/framework`
		},
		{
			id: 'mda-v2',
			categoryEn: 'Foundations',
			categoryEs: 'Fundamentos',
			titleEn: 'MDA V2 & Game Schemas',
			titleEs: 'MDA V2 y Esquemas de Juego',
			descEn: 'Mechanics, Dynamics, and Aesthetics re-architected for voluntary behavioral intent.',
			descEs: 'Mecánicas, Dinámicas y Estética re-arquitectadas para la intención conductual voluntaria.',
			href: `/${lang}/framework/foundations`
		},
		{
			id: 'points-design',
			categoryEn: 'Subframeworks',
			categoryEs: 'Subframeworks',
			titleEn: 'Points & Scoreboard Subframework',
			titleEs: 'Subframework de Puntos y Marcadores',
			descEn: 'Moving beyond operant conditioning into informational and expressive scoring.',
			descEs: 'Superando el condicionamiento operante hacia una puntuación informativa y expresiva.',
			href: `/${lang}/framework/subframeworks`
		},
		{
			id: 'fail-smart',
			categoryEn: 'Subframeworks',
			categoryEs: 'Subframeworks',
			titleEn: 'Fail Smart Subframework',
			titleEs: 'Subframework Fail Smart',
			descEn: 'The 5 pillars of designing failure as a psychological learning mechanism.',
			descEs: 'Los 5 pilares para diseñar el fallo como mecanismo de aprendizaje psicológico.',
			href: `/${lang}/learning`
		},
		{
			id: 'sugarcoating',
			categoryEn: 'Design Patterns',
			categoryEs: 'Patrones de Diseño',
			titleEn: 'Narrative Sugarcoating Pattern',
			titleEs: 'Patrón de Sugarcoating Narrativo',
			descEn: 'Using narrative framing to lower cognitive resistance in complex learning tasks.',
			descEs: 'Uso del enmarcado narrativo para reducir la resistencia cognitiva en tareas complejas.',
			href: `/${lang}/blog`
		}
	];

	const filteredNodes = $derived(
		brainNodes.filter((node) => {
			const cat = lang === 'es' ? node.categoryEs : node.categoryEn;
			const title = lang === 'es' ? node.titleEs : node.titleEn;
			const desc = lang === 'es' ? node.descEs : node.descEn;

			const matchesCategory =
				selectedCategory === 'All' || selectedCategory === 'Todos' || cat === selectedCategory;
			const matchesSearch =
				title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				desc.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesCategory && matchesSearch;
		})
	);
</script>

<SEO
	title={lang === 'es' ? 'BEM Brain Explorer | Nodos y Conceptos' : 'BEM Brain Explorer | Nodes & Concepts'}
	description={lang === 'es' ? 'Explorador atómico de la base de conocimientos BEM: Drivers, Subframeworks y Patrones.' : 'Atomic explorer for the BEM knowledge base: Drivers, Subframeworks, and Patterns.'}
	{lang}
/>

<HeroSection
	title={lang === 'es' ? 'BEM Brain Explorer' : 'BEM Brain Explorer'}
	description={lang === 'es' ? 'Visualizador atómico de la vault de conocimiento del Framework BEM. Conecta teoría, patrones y aplicaciones.' : 'Atomic explorer for the BEM Framework knowledge vault. Connect theory, patterns, and applications.'}
/>

<section class="brain-explorer-section">
	<div class="container">
		<div class="controls-bar card glass-card">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={lang === 'es' ? 'Buscar concepto en el Brain...' : 'Search concept in the Brain...'}
				class="search-input"
			/>

			<div class="category-pills">
				{#each categories as cat}
					<button
						class="pill-btn"
						class:active={selectedCategory === cat}
						onclick={() => (selectedCategory = cat)}
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<div class="nodes-grid">
			{#each filteredNodes as node}
				<a href={node.href} class="node-card card glass-card">
					<span class="node-tag">{lang === 'es' ? node.categoryEs : node.categoryEn}</span>
					<h3>{lang === 'es' ? node.titleEs : node.titleEn}</h3>
					<p>{lang === 'es' ? node.descEs : node.descEn}</p>
					<span class="node-link-action">
						{lang === 'es' ? 'Explorar Nodo →' : 'Explore Node →'}
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.brain-explorer-section {
		padding: 3rem 0 6rem 0;
	}

	.controls-bar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		margin-bottom: 3rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.search-input {
		width: 100%;
		padding: 0.85rem 1.25rem;
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #fff;
		font-size: 1rem;
	}

	.category-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.pill-btn {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: var(--text-muted, #ccc);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill-btn.active, .pill-btn:hover {
		background: var(--color-primary, #6366f1);
		color: #fff;
		border-color: transparent;
	}

	.nodes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.node-card {
		padding: 2rem;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.08);
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: transform 0.2s ease, border-color 0.2s ease;
	}

	.node-card:hover {
		transform: translateY(-4px);
		border-color: rgba(99, 102, 241, 0.5);
	}

	.node-tag {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-primary, #818cf8);
		font-weight: 600;
	}

	.node-card h3 {
		font-size: 1.35rem;
		margin: 0;
	}

	.node-card p {
		color: var(--text-muted, #aaa);
		font-size: 0.95rem;
		line-height: 1.5;
		flex-grow: 1;
	}

	.node-link-action {
		font-size: 0.9rem;
		font-weight: 600;
		color: #fff;
		margin-top: 0.5rem;
	}
</style>
