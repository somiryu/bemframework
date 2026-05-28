<script lang="ts">
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import { gameActions, gameState } from '$lib/gameStore';
	import { cardsData } from '$lib/content/cards';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);
	const lang = $derived(data.lang as 'en' | 'es');

	// Scroll progress
	let scrollPercent = $state(0);
	
	// Gamified read state
	let readTimeElapsed = $state(0);
	let readRewarded = $state(false);
	let rewardMessage = $state('');
	let rolledCard = $state<any>(null);

	// Reaction counts
	let clapsCount = $state(0);
	let heartsCount = $state(0);
	let hasClapped = $state(false);
	let hasHearted = $state(false);

	// Comments
	let commentName = $state('');
	let commentText = $state('');
	let commentsList = $state<{ name: string; text: string; date: string }[]>([]);

	// Localized copy
	const t = $derived({
		en: {
			back: '← Back to Blog',
			by: 'By',
			xpEarned: 'Congratulations! You earned +50 XP for reading this article!',
			cardRolled: 'Booster Pack Roll: You unlocked a mystery BEM Card!',
			claps: 'Claps',
			hearts: 'Love',
			reactionsTitle: 'Community Reactions',
			commentsTitle: 'Discussions',
			namePlaceholder: 'Your Nickname',
			commentPlaceholder: 'Share your thoughts on BEM...',
			submitComment: 'Post Comment',
			noComments: 'No discussions yet. Be the first to start the loop!',
			rollTip: 'Read to the bottom to trigger an Intrinsic Reward roll!',
			unlockedRarity: 'Unlocked Rarity:'
		},
		es: {
			back: '← Volver al Blog',
			by: 'Por',
			xpEarned: '¡Felicidades! ¡Ganaste +50 XP por leer este artículo!',
			cardRolled: 'Booster Pack: ¡Has desbloqueado una carta misteriosa BEM!',
			claps: 'Aplausos',
			hearts: 'Me gusta',
			reactionsTitle: 'Reacciones de la Comunidad',
			commentsTitle: 'Discusión Científica',
			namePlaceholder: 'Tu Apodo',
			commentPlaceholder: 'Comparte tu opinión sobre BEM...',
			submitComment: 'Publicar Comentario',
			noComments: 'Sin comentarios aún. ¡Sé el primero en iniciar el bucle!',
			rollTip: '¡Lee hasta el final para activar un giro de Recompensa Intrínseca!',
			unlockedRarity: 'Rareza Desbloqueada:'
		}
	}[lang]);

	onMount(() => {
		// 1. Initial Mock / Supabase loaders
		clapsCount = Math.floor(Math.random() * 40) + 12;
		heartsCount = Math.floor(Math.random() * 20) + 5;
		
		commentsList = [
			{ 
				name: 'Sophia L.', 
				text: lang === 'es' 
					? '¡Me encanta este enfoque! La gamificación perezosa está arruinando la retención en muchas apps.' 
					: 'Love this approach! Lazy gamification is destroying engagement in many modern apps.',
				date: '1 day ago' 
			},
			{ 
				name: 'Alex G.', 
				text: lang === 'es'
					? '¿Cómo se mapean los KLI cuando diseñas capacitación corporativa?'
					: 'How do you map KLI when designing standard corporate onboarding modules?',
				date: '10 hours ago'
			}
		];

		// 2. Scroll tracker
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			scrollPercent = Math.min(100, Math.max(0, pct));

			// Complete read at 80% scroll
			if (scrollPercent >= 80 && !readRewarded) {
				triggerReadReward();
			}
		};

		// 3. Time tracker
		const timer = setInterval(() => {
			readTimeElapsed += 1;
			// Also complete read if spent 15 seconds reading
			if (readTimeElapsed >= 15 && !readRewarded) {
				triggerReadReward();
			}
		}, 1000);

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			clearInterval(timer);
		};
	});

	const triggerReadReward = () => {
		readRewarded = true;
		
		// 1. Award XP
		gameActions.addXP(50, `read_post_${post.slug}`);
		rewardMessage = t.xpEarned;

		// 2. Roll booster card pack
		const pool = cardsData[lang] || [];
		if (pool.length > 0) {
			const rolled = pool[Math.floor(Math.random() * pool.length)];
			gameActions.unlockCard(rolled.id, rolled.title);
			rolledCard = rolled;
		}
	};

	const addClap = () => {
		if (hasClapped) return;
		clapsCount += 1;
		hasClapped = true;
		// Sync with Supabase in backend / log action
		gameActions.addXP(10, `clap_${post.slug}`);
	};

	const addHeart = () => {
		if (hasHearted) return;
		heartsCount += 1;
		hasHearted = true;
		gameActions.addXP(10, `heart_${post.slug}`);
	};

	const handleCommentSubmit = (e: Event) => {
		e.preventDefault();
		if (!commentName.trim() || !commentText.trim()) return;

		commentsList = [
			{
				name: commentName.trim(),
				text: commentText.trim(),
				date: lang === 'es' ? 'Hace un momento' : 'Just now'
			},
			...commentsList
		];

		// Reset inputs
		commentName = '';
		commentText = '';

		// Reward XP for engagement!
		gameActions.addXP(25, `comment_${post.slug}_${Date.now()}`);
	};
</script>

<SEO 
	title={`${post.title} | BEM Blog`} 
	description={post.excerpt} 
	{lang} 
/>

<!-- SCROLL PROGRESS BAR -->
<div class="scroll-indicator" style="width: {scrollPercent}%"></div>

<div class="article-detail-page">
	<div class="container container-narrow">
		<!-- BACK LINK -->
		<a href={`/${lang}/blog`} class="back-link">{t.back}</a>

		<!-- ARTICLE HEADER -->
		<header class="article-header">
			<div class="article-category-row">
				<span class="category-badge">{post.category}</span>
				<span class="date">{post.date}</span>
			</div>
			
			<h1 class="title">{post.title}</h1>

			<div class="article-author-card">
				<img src="/Javier Velasquez.jpeg" alt="Javier Velásquez" class="author-photo" />
				<div class="author-info">
					<span class="author-name">{post.author}</span>
					<span class="author-title">{lang === 'es' ? 'Fundador del Framework BEM' : 'Founder of the BEM Framework'}</span>
				</div>
			</div>
		</header>

		<!-- ARTICLE CONTENT -->
		<div class="article-body">
			<!-- Render clean HTML content -->
			{@html post.content}
		</div>

		<!-- GAMIFIED REWARD NOTIFICATION BOX -->
		{#if readRewarded}
			<div class="reward-box" in:fade={{ duration: 400 }}>
				<div class="reward-sparkles"></div>
				<div class="reward-content">
					<div class="reward-badge">🎉 {lang === 'es' ? '¡SISTEMA COMPLETADO!' : 'SYSTEM CORE UNLOCKED!'}</div>
					<h3>{lang === 'es' ? '¡Bucle de Aprendizaje Completado!' : 'Learning Loop Complete!'}</h3>
					<p>{rewardMessage}</p>
					
					{#if rolledCard}
						<div class="rolled-card-display">
							<span class="rarity-indicator">{t.unlockedRarity} <strong>{rolledCard.rarity}</strong></span>
							<h4>{rolledCard.title}</h4>
							<p>{rolledCard.description}</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="reading-hint">
				<span>💡</span> {t.rollTip}
			</div>
		{/if}

		<!-- REACTIONS SECTION -->
		<section class="reactions-section">
			<h3>{t.reactionsTitle}</h3>
			<div class="reactions-buttons">
				<button class="reaction-btn clap-btn" class:active={hasClapped} onclick={addClap}>
					<span class="emoji">👏</span>
					<span class="label">{t.claps}</span>
					<span class="count">{clapsCount}</span>
				</button>
				
				<button class="reaction-btn heart-btn" class:active={hasHearted} onclick={addHeart}>
					<span class="emoji">❤️</span>
					<span class="label">{t.hearts}</span>
					<span class="count">{heartsCount}</span>
				</button>
			</div>
		</section>

		<!-- COMMENTS / DISCUSSION BOARD -->
		<section class="comments-section">
			<h3>{t.commentsTitle}</h3>

			<!-- COMMENT FORM -->
			<form onsubmit={handleCommentSubmit} class="comment-form">
				<div class="form-row">
					<input 
						type="text" 
						placeholder={t.namePlaceholder} 
						bind:value={commentName} 
						required 
						class="comment-input name-input"
					/>
				</div>
				<div class="form-row">
					<textarea 
						placeholder={t.commentPlaceholder} 
						bind:value={commentText} 
						required 
						rows="4" 
						class="comment-input text-input"
					></textarea>
				</div>
				<button type="submit" class="comment-submit-btn">{t.submitComment}</button>
			</form>

			<!-- COMMENTS GRID -->
			<div class="comments-list">
				{#if commentsList.length > 0}
					{#each commentsList as comment}
						<div class="comment-card" in:fade>
							<div class="comment-header">
								<span class="commenter-name">{comment.name}</span>
								<span class="comment-date">{comment.date}</span>
							</div>
							<p class="comment-text">{comment.text}</p>
						</div>
					{/each}
				{:else}
					<p class="empty-comments">{t.noComments}</p>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
.scroll-indicator {
	position: fixed;
	top: 0; left: 0;
	height: 4px;
	background: linear-gradient(to right, var(--color-green), var(--color-purple));
	z-index: 10000;
	transition: width 0.1s ease-out;
}

.article-detail-page {
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

.article-header {
	margin-bottom: var(--space-xl);
}

.article-category-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--space-sm);
}

.category-badge {
	font-size: 0.8rem;
	font-weight: 800;
	text-transform: uppercase;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.1);
	padding: 0.35rem 0.85rem;
	border-radius: var(--radius-sm);
}

.date {
	font-size: 0.85rem;
	font-weight: 700;
	color: var(--color-text-muted);
}

.title {
	font-size: 2.75rem;
	line-height: 1.2;
	font-weight: 800;
	margin: 0 0 var(--space-md);
	letter-spacing: -0.02em;
}

@media (max-width: 768px) {
	.title {
		font-size: 2rem;
	}
}

.article-author-card {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding-top: var(--space-sm);
	border-top: 1px solid var(--color-border);
}

.author-photo {
	width: 48px;
	height: 48px;
	border-radius: var(--radius-full);
	object-fit: cover;
	border: 2px solid var(--color-border);
}

.author-info {
	display: flex;
	flex-direction: column;
}

.author-name {
	font-weight: 800;
	font-size: 1rem;
	color: var(--color-text);
}

.author-title {
	font-size: 0.8rem;
	color: var(--color-text-muted);
	font-weight: 600;
}

/* BODY CONTENT */
.article-body {
	font-size: 1.15rem;
	line-height: 1.75;
	color: var(--color-text);
	margin-bottom: var(--space-xl);
}

.article-body :global(p) {
	margin-bottom: 1.5rem;
}

.article-body :global(h3) {
	font-size: 1.6rem;
	font-weight: 800;
	margin: 2.5rem 0 1rem;
	color: var(--color-text);
}

.article-body :global(blockquote) {
	border-left: 4px solid var(--color-purple);
	padding-left: 1.5rem;
	margin: 2rem 0;
	font-style: italic;
	font-size: 1.25rem;
	color: var(--color-text-muted);
}

.article-body :global(ul), .article-body :global(ol) {
	padding-left: 2rem;
	margin-bottom: 1.5rem;
}

.article-body :global(li) {
	margin-bottom: 0.5rem;
}

/* GAMIFIED REWARDS */
.reward-box {
	position: relative;
	background: linear-gradient(135deg, var(--color-purple) 0%, #1e1b4b 100%);
	border-radius: var(--radius-lg);
	border: 1px solid rgba(255,255,255,0.1);
	padding: 2.5rem;
	color: white;
	margin: var(--space-xl) 0;
	overflow: hidden;
	box-shadow: var(--shadow-lg);
}

.reward-badge {
	display: inline-block;
	background: var(--color-green);
	color: #064e3b;
	font-weight: 800;
	font-size: 0.75rem;
	letter-spacing: 0.1em;
	padding: 0.4rem 0.8rem;
	border-radius: var(--radius-sm);
	margin-bottom: 1rem;
}

.reward-content h3 {
	font-size: 1.75rem;
	margin: 0 0 0.5rem;
}

.reward-content p {
	font-size: 1.05rem;
	opacity: 0.9;
	margin: 0 0 1.5rem;
}

.rolled-card-display {
	background: rgba(255, 255, 255, 0.1);
	border-radius: var(--radius-md);
	padding: 1.5rem;
	border-left: 4px solid var(--color-green);
}

.rarity-indicator {
	font-size: 0.75rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	display: block;
	margin-bottom: 0.5rem;
	color: var(--color-green);
}

.rolled-card-display h4 {
	font-size: 1.3rem;
	margin: 0 0 0.5rem;
	font-weight: 800;
}

.rolled-card-display p {
	font-size: 0.95rem;
	margin: 0;
	opacity: 0.9;
}

.reading-hint {
	text-align: center;
	padding: 1rem;
	border: 1px dashed var(--color-border);
	background: var(--color-bg-alt);
	border-radius: var(--radius-md);
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--color-text-muted);
}

/* REACTIONS */
.reactions-section {
	border-top: 1px solid var(--color-border);
	padding-top: var(--space-xl);
	margin-top: var(--space-xl);
}

.reactions-section h3 {
	font-size: 1.3rem;
	font-weight: 800;
	margin-bottom: 1.25rem;
}

.reactions-buttons {
	display: flex;
	gap: 1rem;
}

.reaction-btn {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: var(--color-bg-alt);
	border: 2px solid var(--color-border);
	padding: 0.75rem 1.5rem;
	border-radius: var(--radius-md);
	cursor: pointer;
	font-weight: 700;
	transition: var(--transition-fast);
}

.reaction-btn:hover {
	transform: translateY(-2px);
	border-color: var(--color-purple);
}

.reaction-btn.active {
	background: var(--color-purple);
	color: white;
	border-color: var(--color-purple);
}

.reaction-btn.active .count {
	color: white;
}

.count {
	font-size: 0.9rem;
	color: var(--color-text-muted);
}

/* COMMENTS */
.comments-section {
	margin-top: var(--space-xl);
	border-top: 1px solid var(--color-border);
	padding-top: var(--space-xl);
}

.comments-section h3 {
	font-size: 1.5rem;
	font-weight: 800;
	margin-bottom: 1.5rem;
}

.comment-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: var(--space-xl);
}

.comment-input {
	width: 100%;
	padding: 0.85rem 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-bg-alt);
	font-size: 0.95rem;
	font-weight: 600;
	transition: var(--transition-fast);
}

.comment-input:focus {
	outline: none;
	border-color: var(--color-purple);
	background: white;
}

.comment-submit-btn {
	background: #1a1a1a;
	color: white;
	border: none;
	padding: 0.85rem 1.5rem;
	font-weight: 800;
	border-radius: var(--radius-md);
	cursor: pointer;
	align-self: flex-start;
	transition: var(--transition-fast);
}

.comment-submit-btn:hover {
	background: var(--color-purple);
	transform: translateY(-2px);
}

.comments-list {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.comment-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 1.5rem;
	border-radius: var(--radius-md);
}

.comment-header {
	display: flex;
	justify-content: space-between;
	font-size: 0.85rem;
	margin-bottom: 0.5rem;
}

.commenter-name {
	font-weight: 800;
	color: var(--color-text);
}

.comment-date {
	color: var(--color-text-muted);
	font-weight: 600;
}

.comment-text {
	margin: 0;
	line-height: 1.5;
	font-size: 0.95rem;
	font-weight: 500;
}

.empty-comments {
	text-align: center;
	color: var(--color-text-muted);
	font-weight: 600;
	padding: var(--space-md) 0;
}
</style>
