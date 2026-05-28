<script lang="ts">
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { cardsData } from '$lib/content/cards';
	import { gameState, gameActions, userLevel } from '$lib/gameStore';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	// Local state
	let leaderboardList = $state<{ name: string; xp: number; cards: number; date: string }[]>([]);
	let nicknameInput = $state('');
	let isSubmitting = $state(false);
	let rolledCard = $state<any>(null);
	let boosterError = $state('');

	const cards = $derived(cardsData[lang] || []);
	const unlockedIds = $derived($gameState.unlockedCardIds);
	const activeState = $derived($gameState);

	// Localized UI COPY
	const t = $derived({
		en: {
			title: 'BEM Strategic Resources & Card Album',
			desc: 'Download design sheets, track your BEM Card collections, roll booster packs, and enter the BEM Disciple Leaderboard.',
			downloadsTitle: 'Download Strategic Materials',
			downloadsSub: 'Equip yourself with the tools Javier Velásquez uses to design award-winning gamification systems. Downloading awards +75 XP!',
			albumTitle: 'Your BEM Card Album',
			albumSub: 'Discover BEM concepts by exploring the website, answering trivia, and rolling packs. Costs 100 XP to roll a booster pack!',
			rollBoosterBtn: 'Roll Card Booster Pack (100 XP)',
			leaderboardTitle: 'BEM Disciple Hall of Fame',
			leaderboardSub: 'Live ranking of the world\'s top behavior designers.',
			submitScoreBtn: 'Submit My Score',
			placeholderName: 'Your Nickname',
			rank: 'Rank',
			name: 'Name',
			xp: 'XP Score',
			collected: 'Cards Unlocked',
			noXpError: 'Insufficient XP. You need 100 XP to roll a booster pack!',
			alreadySubmitted: 'Score already published to Hall of Fame!',
			rollSuccess: 'Booster Pack Unlocked!',
			unlockedStatus: 'Unlocked',
			lockedStatus: 'Locked',
			materials: [
				{ id: 'canvas', title: 'BEM Design Canvas (PDF)', size: '2.4 MB', desc: 'A spatial framework sheet to map out your product intent, player emotions, and scaffolding phases.' },
				{ id: 'sheet', title: 'Behavioral Metrics Calculator (XLS)', size: '1.2 MB', desc: 'Pre-formatted sheet to trace and compute KBIs, KEIs, and KLIs efficiently.' },
				{ id: 'guide', title: 'Invisible Gamification Quickstart (PDF)', size: '4.8 MB', desc: 'The introductory guide on BEM invisible game architectures and tactile feedback design.' }
			]
		},
		es: {
			title: 'Recursos Estratégicos y Álbum de Cartas BEM',
			desc: 'Descarga herramientas de diseño, gestiona tu colección de cartas BEM, abre sobres sorpresa y compite en la tabla de clasificación.',
			downloadsTitle: 'Descarga de Materiales Estratégicos',
			downloadsSub: 'Equípate con las herramientas que Javier utiliza en sus proyectos de gamificación galardonados. ¡Cada descarga te premia con +75 XP!',
			albumTitle: 'Tu Álbum de Cartas BEM',
			albumSub: 'Descubre conceptos BEM explorando la web, respondiendo preguntas y abriendo sobres. ¡Cuesta 100 XP abrir un sobre sorpresa!',
			rollBoosterBtn: 'Abrir Sobre de Cartas (100 XP)',
			leaderboardTitle: 'Salón de la Fama de Discípulos BEM',
			leaderboardSub: 'Ránking en tiempo real de los mejores diseñadores de comportamiento del mundo.',
			submitScoreBtn: 'Publicar Mi Puntuación',
			placeholderName: 'Tu Apodo',
			rank: 'Rango',
			name: 'Nombre',
			xp: 'Puntuación XP',
			collected: 'Cartas Desbloqueadas',
			noXpError: 'XP Insuficiente. ¡Necesitas 100 XP para abrir un sobre!',
			alreadySubmitted: '¡Tu puntuación ya ha sido publicada en el Salón de la Fama!',
			rollSuccess: '¡Sobre Sorpresa Abierto!',
			unlockedStatus: 'Desbloqueada',
			lockedStatus: 'Bloqueada',
			materials: [
				{ id: 'canvas', title: 'BEM Design Canvas (PDF)', size: '2.4 MB', desc: 'Plantilla de mapeo para estructurar el propósito, las emociones y el andamiaje interactivo de tu producto.' },
				{ id: 'sheet', title: 'Calculadora de Métricas Conductuales (XLS)', size: '1.2 MB', desc: 'Documento interactivo pre-diseñado para calcular KBIs, KEIs y KLIs de manera simple.' },
				{ id: 'guide', title: 'Guía de Inicio Rápido: Gamificación Invisible (PDF)', size: '4.8 MB', desc: 'Guía sobre arquitecturas de juego invisibles, bucles lúdicos de aprendizaje y señales de feedback.' }
			]
		}
	}[lang]);

	onMount(() => {
		loadLeaderboard();
	});

	const loadLeaderboard = () => {
		// Mock scoreboard with fallback logic built in. 
		leaderboardList = [
			{ name: 'GamerGod_BEM', xp: 950, cards: 18, date: 'May 20, 2026' },
			{ name: 'ScaffoldingMaster', xp: 750, cards: 14, date: 'May 24, 2026' },
			{ name: 'KLI_Guru', xp: 620, cards: 11, date: 'May 26, 2026' },
			{ name: 'IntentionArchitect', xp: 480, cards: 9, date: 'May 27, 2026' }
		];

		// If user has local scores, let's inject them at the proper sorting position
		const storedScores = localStorage.getItem('bem_local_scores');
		if (storedScores) {
			try {
				const parsed = JSON.parse(storedScores);
				leaderboardList = [...parsed, ...leaderboardList].sort((a, b) => b.xp - a.xp);
			} catch (e) {
				console.error(e);
			}
		}
	};

	const downloadMaterial = (id: string, name: string) => {
		// Award XP
		gameActions.addXP(75, `download_resource_${id}`);
		
		// Simulate download trigger safely
		const link = document.createElement('a');
		link.href = '#';
		link.setAttribute('download', name);
		document.body.appendChild(link);
		// Not clicking to prevent actual page reloads, just show visual reward!
		document.body.removeChild(link);
	};

	const rollBoosterPack = () => {
		boosterError = '';
		rolledCard = null;

		if (activeState.xp < 100) {
			boosterError = t.noXpError;
			return;
		}

		// Deduct 100 XP
		gameActions.addXP(-100, `booster_pack_cost_${Date.now()}`);

		// Pick a locked card if possible, otherwise any card
		const lockedPool = cards.filter((c) => !unlockedIds.includes(c.id));
		const selectPool = lockedPool.length > 0 ? lockedPool : cards;

		if (selectPool.length > 0) {
			const selected = selectPool[Math.floor(Math.random() * selectPool.length)];
			gameActions.unlockCard(selected.id, selected.title);
			rolledCard = selected;
		}
	};

	const submitLeaderboardScore = (e: Event) => {
		e.preventDefault();
		if (!nicknameInput.trim() || isSubmitting) return;

		isSubmitting = true;

		// Save score locally with fallbacks
		const myScore = {
			name: nicknameInput.trim(),
			xp: activeState.xp,
			cards: unlockedIds.length,
			date: 'Today'
		};

		let currentLocals = [];
		try {
			const saved = localStorage.getItem('bem_local_scores');
			if (saved) currentLocals = JSON.parse(saved);
		} catch (e) {
			console.error(e);
		}

		currentLocals.push(myScore);
		localStorage.setItem('bem_local_scores', JSON.stringify(currentLocals));

		gameActions.setLeaderboardSubmitted();
		loadLeaderboard();
		isSubmitting = false;
		nicknameInput = '';
	};
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={lang === 'es' ? 'Recursos y Gamificación' : 'Resources & Collection'} description={t.desc} />

<!-- DOWNLOADS SECTION -->
<section class="section downloads">
	<div class="container">
		<h2 class="section-title">{t.downloadsTitle}</h2>
		<p class="section-subtitle">{t.downloadsSub}</p>

		<div class="materials-grid">
			{#each t.materials as mat}
				<div class="mat-card">
					<div class="mat-icon">📄</div>
					<div class="mat-info">
						<h3>{mat.title}</h3>
						<span class="file-size">{mat.size}</span>
						<p>{mat.desc}</p>
					</div>
					<button onclick={() => downloadMaterial(mat.id, mat.title)} class="download-btn">
						{lang === 'es' ? 'Descargar' : 'Download'}
					</button>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CARD ALBUM SECTION -->
<section class="section album">
	<div class="container">
		<h2 class="section-title">{t.albumTitle}</h2>
		<p class="section-subtitle">{t.albumSub}</p>

		<!-- BOOSTER PACK BUTTON -->
		<div class="booster-row">
			<button onclick={rollBoosterPack} class="booster-btn" class:disabled={activeState.xp < 100}>
				🎮 {t.rollBoosterBtn}
			</button>
			{#if boosterError}
				<span class="error-msg" in:fade>{boosterError}</span>
			{/if}
		</div>

		<!-- BOOSTER PACK RESULTS DOCK -->
		{#if rolledCard}
			<div class="booster-result-glow" in:slide>
				<span class="glow-title">✨ {t.rollSuccess}</span>
				<div class={`mini-unlocked-card rarity-${rolledCard.rarity.toLowerCase()}`}>
					<span class="rarity-badge">{rolledCard.rarity}</span>
					<span class="card-type">{rolledCard.type}</span>
					<h3>{rolledCard.title}</h3>
					<p>{rolledCard.description}</p>
				</div>
			</div>
		{/if}

		<!-- CARDS GRID -->
		<div class="album-grid">
			{#each cards as card}
				{@const isUnlocked = unlockedIds.includes(card.id)}
				<div class="album-slot" class:locked={!isUnlocked} class:unlocked={isUnlocked}>
					{#if isUnlocked}
						<div class={`card-face-view rarity-${card.rarity.toLowerCase()}`}>
							<span class="badge-rarity">{card.rarity}</span>
							<span class="type-tag">{card.type}</span>
							<h3>{card.title}</h3>
							<p>{card.description}</p>
							{#if card.rarity === 'Epic' || card.rarity === 'Legendary'}
								<div class="sparkles"></div>
							{/if}
						</div>
					{:else}
						<div class="card-locked-view">
							<div class="padlock">🔒</div>
							<span class="locked-lbl">{t.lockedStatus}</span>
							<span class="mystery-idx">Card #{card.id}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- LEADERBOARD SALON DE LA FAMA -->
<section class="section leaderboard-ranking">
	<div class="container container-narrow">
		<h2 class="section-title">{t.leaderboardTitle}</h2>
		<p class="section-subtitle">{t.leaderboardSub}</p>

		<!-- LEADERBOARD TABLE -->
		<div class="leaderboard-table-wrapper">
			<table class="leaderboard-table">
				<thead>
					<tr>
						<th>{t.rank}</th>
						<th>{t.name}</th>
						<th>{t.xp}</th>
						<th>{t.collected}</th>
					</tr>
				</thead>
				<tbody>
					{#each leaderboardList as user, idx}
						<tr class:highlight={user.name === nicknameInput}>
							<td>
								{#if idx === 0}🥇
								{:else if idx === 1}🥈
								{:else if idx === 2}🥉
								{:else}{idx + 1}
								{/if}
							</td>
							<td><strong>{user.name}</strong></td>
							<td class="xp-score">{user.xp} XP</td>
							<td>{user.cards} / {cards.length}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- LEAD SUBMISSION FORM -->
		{#if !activeState.hasSubmittedLeaderboard}
			{#if unlockedIds.length >= 1}
				<form onsubmit={submitLeaderboardScore} class="leaderboard-submit-form" in:fade>
					<input 
						type="text" 
						placeholder={t.placeholderName} 
						required 
						bind:value={nicknameInput}
						class="nick-input"
					/>
					<button type="submit" class="submit-btn" disabled={isSubmitting}>
						{t.submitScoreBtn}
					</button>
				</form>
			{:else}
				<p class="locked-leaderboard-tip">
					⚠️ {lang === 'es' 
						? 'Desbloquea al menos 1 Carta BEM explorando la web para poder unirte al Salón de la Fama.' 
						: 'Unlock at least 1 BEM Card by exploring the site to submit your score to the Hall of Fame.'}
				</p>
			{/if}
		{:else}
			<p class="submitted-score-banner">✓ {t.alreadySubmitted}</p>
		{/if}
	</div>
</section>

<style>
.downloads {
	background: var(--color-bg);
	padding-top: var(--space-md);
}

.section-title {
	text-align: center;
	font-size: 2.2rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
}

.section-subtitle {
	text-align: center;
	color: var(--color-text-muted);
	font-size: 1.1rem;
	margin-bottom: var(--space-xl);
	font-weight: 500;
}

.materials-grid {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.mat-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
	display: flex;
	align-items: center;
	gap: 2rem;
	transition: var(--transition-normal);
}

.mat-card:hover {
	transform: scale(1.01);
	border-color: rgba(124, 58, 237, 0.3);
	background: white;
	box-shadow: var(--shadow-md);
}

.mat-icon {
	font-size: 2.5rem;
	opacity: 0.8;
}

.mat-info {
	flex: 1;
}

.mat-info h3 {
	font-size: 1.25rem;
	font-weight: 850;
	margin: 0 0 0.25rem;
}

.file-size {
	font-size: 0.75rem;
	font-weight: 800;
	color: var(--color-purple);
	background: rgba(124, 58, 237, 0.1);
	padding: 0.2rem 0.6rem;
	border-radius: var(--radius-sm);
}

.mat-info p {
	font-size: 0.95rem;
	color: var(--color-text-muted);
	margin: 0.75rem 0 0;
	font-weight: 500;
}

.download-btn {
	background: #1a1a1a;
	color: white;
	border: none;
	padding: 0.8rem 1.6rem;
	border-radius: var(--radius-md);
	font-weight: 800;
	cursor: pointer;
	transition: var(--transition-fast);
}

.download-btn:hover {
	background: var(--color-purple);
	transform: translateY(-2px);
}

@media (max-width: 700px) {
	.mat-card {
		flex-direction: column;
		text-align: center;
		gap: 1rem;
	}
	
	.download-btn {
		width: 100%;
	}
}

/* CARD ALBUM GRID */
.album {
	background: var(--color-bg-alt);
}

.booster-row {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 3rem;
}

.booster-btn {
	background: linear-gradient(135deg, var(--color-purple) 0%, #4c1d95 100%);
	color: white;
	border: none;
	padding: 1rem 2rem;
	border-radius: var(--radius-full);
	font-weight: 800;
	font-size: 1.05rem;
	cursor: pointer;
	box-shadow: var(--shadow-md);
	transition: var(--transition-fast);
}

.booster-btn:hover:not(.disabled) {
	transform: translateY(-3px) scale(1.03);
	box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
}

.booster-btn.disabled {
	opacity: 0.5;
	cursor: not-allowed;
	box-shadow: none;
}

.error-msg {
	color: var(--color-red);
	font-weight: 700;
	font-size: 0.85rem;
}

/* BOOSTER RESULTS */
.booster-result-glow {
	max-width: 380px;
	margin: 0 auto 3rem;
	padding: 2rem;
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid var(--color-border);
	box-shadow: var(--shadow-lg);
	border-radius: var(--radius-lg);
	text-align: center;
	animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
}

.glow-title {
	display: block;
	font-weight: 800;
	font-size: 1.1rem;
	color: var(--color-green);
	margin-bottom: 1rem;
}

.mini-unlocked-card {
	padding: 1.5rem;
	border-radius: var(--radius-md);
	color: white !important;
	text-align: left;
	position: relative;
	min-height: 220px;
}

.mini-unlocked-card h3 {
	font-size: 1.3rem;
	margin: 0.5rem 0 1rem;
	font-weight: 800;
	color: white !important;
}

.mini-unlocked-card p {
	font-size: 0.9rem;
	margin: 0;
	color: rgba(255, 255, 255, 0.95) !important;
}

.mini-unlocked-card .card-type {
	color: rgba(255, 255, 255, 0.75) !important;
}

/* ALBUM GRID */
.album-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 1.5rem;
}

.album-slot {
	aspect-ratio: 5 / 7;
	border-radius: var(--radius-lg);
	overflow: hidden;
	box-shadow: var(--shadow-sm);
	transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25);
}

.album-slot.unlocked:hover {
	transform: translateY(-5px) scale(1.02);
	box-shadow: var(--shadow-lg);
}

/* LOCKED SLOT */
.card-locked-view {
	width: 100%; height: 100%;
	background: linear-gradient(135deg, #111 0%, #222 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #444;
	border: 6px solid #2d2d2d;
	border-radius: var(--radius-lg);
}

.padlock {
	font-size: 2rem;
	margin-bottom: 0.5rem;
}

.locked-lbl {
	font-size: 0.75rem;
	text-transform: uppercase;
	font-weight: 800;
	letter-spacing: 0.1em;
}

.mystery-idx {
	font-size: 0.7rem;
	opacity: 0.6;
	margin-top: 0.25rem;
}

/* UNLOCKED CARD */
.card-face-view {
	width: 100%; height: 100%;
	padding: 1.5rem;
	color: white !important;
	display: flex;
	flex-direction: column;
	border: 6px solid white;
	border-radius: var(--radius-lg);
	position: relative;
	overflow: hidden;
}

.badge-rarity {
	position: absolute;
	top: 0.75rem; right: 0.75rem;
	font-size: 0.65rem;
	font-weight: 800;
	background: rgba(0,0,0,0.3);
	padding: 0.15rem 0.5rem;
	border-radius: 10px;
	text-transform: uppercase;
	color: white !important;
}

.type-tag {
	font-size: 0.75rem;
	text-transform: uppercase;
	opacity: 0.8;
	color: rgba(255, 255, 255, 0.75) !important;
}

.card-face-view h3 {
	font-size: 1.2rem;
	margin: 0.5rem 0 1rem;
	font-weight: 800;
	line-height: 1.2;
	color: white !important;
}

.card-face-view p {
	font-size: 0.85rem;
	margin: 0;
	line-height: 1.4;
	opacity: 0.95;
	flex-grow: 1;
	color: rgba(255, 255, 255, 0.95) !important;
}

/* RARITY GRADIENTS */
.rarity-common { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); }
.rarity-rare { background: linear-gradient(135deg, #eab308 0%, #854d0e 100%); }
.rarity-epic { background: linear-gradient(135deg, #22c55e 0%, #166534 100%); }
.rarity-legendary { background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); }

.rarity-epic, .rarity-legendary { position: relative; }
.sparkles {
	position: absolute;
	top: 0; left: 0; right: 0; bottom: 0;
	background-image: 
		radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 1px, transparent 1px),
		radial-gradient(circle at 90% 80%, rgba(255,255,255,0.4) 1px, transparent 1px);
	background-size: 50px 50px;
	animation: sparklesAnim 4s linear infinite;
	pointer-events: none;
}

@keyframes sparklesAnim {
	from { background-position: 0 0; }
	to { background-position: 50px 50px; }
}

/* LEADERBOARD TABLE */
.leaderboard-ranking {
	background: var(--color-bg);
}

.leaderboard-table-wrapper {
	background: white;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-md);
	overflow: hidden;
	margin-bottom: 2.5rem;
}

.leaderboard-table {
	width: 100%;
	border-collapse: collapse;
	text-align: left;
}

.leaderboard-table th, .leaderboard-table td {
	padding: 1.25rem 1.5rem;
	font-size: 0.95rem;
}

.leaderboard-table th {
	background: var(--color-bg-alt);
	font-weight: 800;
	color: var(--color-text);
	border-bottom: 1px solid var(--color-border);
}

.leaderboard-table td {
	border-bottom: 1px solid var(--color-border);
	font-weight: 550;
}

.leaderboard-table tr:last-child td {
	border-bottom: none;
}

.leaderboard-table tr.highlight {
	background: rgba(124, 58, 237, 0.05);
}

.xp-score {
	color: var(--color-purple);
	font-weight: 800;
}

/* SUBMIT SCORE FORM */
.leaderboard-submit-form {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.nick-input {
	padding: 0.85rem 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-bg-alt);
	font-size: 0.95rem;
	font-weight: 600;
	width: 260px;
}

.nick-input:focus {
	outline: none;
	border-color: var(--color-purple);
	background: white;
}

.submit-btn {
	background: var(--color-purple);
	color: white;
	border: none;
	padding: 0.85rem 1.5rem;
	font-weight: 800;
	border-radius: var(--radius-md);
	cursor: pointer;
	transition: var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(124, 58, 237, 0.25);
}

.submit-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.locked-leaderboard-tip {
	text-align: center;
	font-weight: 700;
	color: var(--color-text-muted);
	font-size: 0.95rem;
}

.submitted-score-banner {
	text-align: center;
	font-weight: 800;
	color: var(--color-green);
	font-size: 1.05rem;
}
</style>
