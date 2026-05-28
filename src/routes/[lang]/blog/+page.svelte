<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { blogData } from '$lib/content/blogData';
	import { gameState } from '$lib/gameStore';
	import { fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	// Local state
	let selectedCategory = $state<string>('All');
	let searchQuery = $state<string>('');

	// Dynamic localized titles
	const t = $derived({
		en: {
			title: 'BEM Insights & Articles | Behaviour Experience Meaning',
			desc: 'Scientific insights, strategies, and case studies on systemic gamification design and intrinsic motivation.',
			searchPlaceholder: 'Search articles...',
			all: 'All',
			readTime: 'min read',
			readLabel: 'Read Complete',
			readProgress: 'Read & claim +50 XP',
			by: 'By'
		},
		es: {
			title: 'Artículos e Ideas BEM | Behavior Experience Meaning',
			desc: 'Perspectivas científicas, estrategias y casos de estudio sobre diseño de gamificación sistémica y motivación intrínseca.',
			searchPlaceholder: 'Buscar artículos...',
			all: 'Todos',
			readTime: 'min de lectura',
			readLabel: 'Completado',
			readProgress: 'Lee y reclama +50 XP',
			by: 'Por'
		}
	}[lang]);

	const articles = $derived(blogData[lang] || []);
	
	// Get unique categories
	const categories = $derived([
		t.all,
		...Array.from(new Set(articles.map((a) => a.category)))
	]);

	// Filtered articles
	const filteredArticles = $derived(
		articles.filter((article) => {
			const matchesCategory =
				selectedCategory === t.all || article.category === selectedCategory;
			const matchesSearch =
				article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.category.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		})
	);

	// Derived from gameState to mark read status
	const isRead = $derived((slug: string) => {
		return $gameState.xpHistory.some((h) => h.reason === `read_post_${slug}`);
	});
</script>

<SEO 
	title={t.title} 
	description={t.desc} 
	{lang} 
/>

<HeroSection title="BEM Blog" description={t.desc} />

<section class="section blog-hub">
	<div class="container">
		<!-- FILTERS & SEARCH ROW -->
		<div class="filter-search-container">
			<div class="categories-list">
				{#each categories as category}
					<button
						class="category-btn"
						class:active={selectedCategory === category || (category === t.all && selectedCategory === 'All')}
						onclick={() => selectedCategory = category === t.all ? 'All' : category}
					>
						{category}
					</button>
				{/each}
			</div>

			<div class="search-input-wrapper">
				<input
					type="text"
					placeholder={t.searchPlaceholder}
					bind:value={searchQuery}
					class="search-input"
				/>
				<span class="search-icon">🔍</span>
			</div>
		</div>

		<!-- ARTICLES GRID -->
		{#if filteredArticles.length > 0}
			<div class="articles-grid">
				{#each filteredArticles as article (article.slug)}
					<article class="article-card" class:completed-read={isRead(article.slug)} in:fade={{ duration: 300 }}>
						<div class="card-glow-bg"></div>
						<div class="card-inner">
							<div class="article-meta">
								<span class="category-badge">{article.category}</span>
								<span class="read-time">{article.readTime} {t.readTime}</span>
							</div>

							<h3 class="article-title">
								<a href={`/${lang}/blog/${article.slug}`}>{article.title}</a>
							</h3>

							<p class="article-excerpt">{article.excerpt}</p>

							<div class="article-footer">
								<span class="author-label">{t.by} <strong>{article.author}</strong></span>
								
								{#if isRead(article.slug)}
									<span class="read-status done">✓ {t.readLabel}</span>
								{:else}
									<span class="read-status pending">+50 XP</span>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="no-articles">
				<p>{lang === 'es' ? 'No se encontraron artículos que coincidan con la búsqueda.' : 'No articles found matching your criteria.'}</p>
			</div>
		{/if}
	</div>
</section>

<style>
.blog-hub {
	background: var(--color-bg);
	padding-top: var(--space-md);
}

.filter-search-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 2rem;
	margin-bottom: var(--space-xl);
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 2rem;
}

@media (max-width: 900px) {
	.filter-search-container {
		flex-direction: column;
		align-items: stretch;
		gap: 1.5rem;
	}
}

.categories-list {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.category-btn {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	color: var(--color-text-muted);
	padding: 0.6rem 1.25rem;
	font-weight: 700;
	font-size: 0.9rem;
	border-radius: var(--radius-full);
	cursor: pointer;
	transition: var(--transition-fast);
}

.category-btn:hover, .category-btn.active {
	background: var(--color-purple);
	border-color: var(--color-purple);
	color: white;
	transform: translateY(-1px);
}

.search-input-wrapper {
	position: relative;
	width: 320px;
}

@media (max-width: 900px) {
	.search-input-wrapper {
		width: 100%;
	}
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem 0.75rem 2.5rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-bg-alt);
	font-size: 0.95rem;
	font-weight: 600;
	transition: var(--transition-fast);
}

.search-input:focus {
	outline: none;
	border-color: var(--color-purple);
	background: white;
	box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.search-icon {
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	font-size: 0.95rem;
	opacity: 0.5;
}

/* ARTICLES GRID & CARDS */
.articles-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
	gap: 2.5rem;
}

@media (max-width: 500px) {
	.articles-grid {
		grid-template-columns: 1fr;
	}
}

.article-card {
	position: relative;
	border-radius: var(--radius-lg);
	background: white;
	border: 1px solid var(--color-border);
	box-shadow: var(--shadow-sm);
	transition: all var(--transition-normal);
	overflow: hidden;
	height: 100%;
}

.article-card:hover {
	transform: translateY(-6px);
	box-shadow: var(--shadow-lg);
	border-color: rgba(124, 58, 237, 0.3);
}

.article-card.completed-read {
	border-color: rgba(34, 197, 94, 0.2);
}

.card-glow-bg {
	position: absolute;
	top: -50%; left: -50%; width: 200%; height: 200%;
	background: radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%);
	pointer-events: none;
}

.card-inner {
	padding: 2rem;
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	z-index: 2;
}

.article-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.25rem;
}

.category-badge {
	font-size: 0.75rem;
	font-weight: 800;
	text-transform: uppercase;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.1);
	padding: 0.3rem 0.75rem;
	border-radius: var(--radius-sm);
}

.read-time {
	font-size: 0.8rem;
	font-weight: 700;
	color: var(--color-text-muted);
}

.article-title {
	font-size: 1.4rem;
	font-weight: 800;
	line-height: 1.3;
	margin: 0 0 1rem;
}

.article-title a {
	color: var(--color-text);
	text-decoration: none;
	transition: var(--transition-fast);
}

.article-title a:hover {
	color: var(--color-purple);
}

.article-excerpt {
	font-size: 0.95rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0 0 2rem;
	flex-grow: 1;
}

.article-footer {
	border-top: 1px solid var(--color-border);
	padding-top: 1.25rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.85rem;
}

.author-label {
	color: var(--color-text-muted);
}

.author-label strong {
	color: var(--color-text);
}

.read-status {
	font-weight: 800;
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 0.05em;
	padding: 0.25rem 0.65rem;
	border-radius: var(--radius-sm);
}

.read-status.done {
	background: #dcfce7;
	color: #166534;
}

.read-status.pending {
	background: var(--color-bg-alt);
	color: var(--color-purple);
	border: 1px dashed var(--color-purple);
}

.no-articles {
	text-align: center;
	padding: var(--space-2xl) 0;
	font-weight: 700;
	color: var(--color-text-muted);
	font-size: 1.2rem;
}
</style>
