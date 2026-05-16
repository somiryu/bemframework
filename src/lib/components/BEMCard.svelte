<script lang="ts">
	import { cardsData, type BEMCardData, type CardRarity } from '$lib/content/cards';
	import { onMount } from 'svelte';

	let { lang } = $props();
 
	let cardId = $state<number | null>(null);
	let revealed = $state(false);
 
	const card = $derived.by(() => {
		if (cardId === null) return null;
		return cardsData[lang]?.find((c) => c.id === cardId) || null;
	});
 
	onMount(() => {
		const roll = Math.random();
		if (roll < 0.7) return; // 70% chance of nothing
 
		const cardRoll = Math.random();
		let targetRarity: CardRarity = 'Common';
 
		// Probabilities within the 30% drop rate
		if (cardRoll < 0.05) targetRarity = 'Legendary';
		else if (cardRoll < 0.2) targetRarity = 'Epic';
		else if (cardRoll < 0.5) targetRarity = 'Rare';
		else targetRarity = 'Common';
 
		const pool = cardsData[lang]?.filter((c) => c.rarity === targetRarity) || [];
		if (pool.length > 0) {
			const selected = pool[Math.floor(Math.random() * pool.length)];
			cardId = selected.id;
		}
	});

	const flip = () => {
		if (card && !revealed) revealed = true;
	};
</script>

{#if card}
	<div class="card-section">
		<div class="container card-layout">
			<div class="unlocked-message">
				<div class="unlocked-badge">{lang === 'es' ? '¡NUEVO HALLAZGO!' : 'NEW FIND!'}</div>
				<h2>{lang === 'es' ? '¡Carta Misteriosa desbloqueada!' : 'Mystery Card unlocked!'}</h2>
				<p>{lang === 'es' ? 'Has descubierto un concepto clave del marco BEM mientras explorabas.' : 'You have discovered a key BEM framework concept while exploring.'}</p>
			</div>
			
			<div class="card-container" class:revealed onclick={flip} onkeydown={(e) => e.key === 'Enter' && flip()} role="button" tabindex="0">
				<div class="card-inner">
					<!-- FACE DOWN -->
					<div class="card-face card-front">
						<div class="card-pattern"></div>
						<div class="card-content">
							<div class="bem-logo">BEM</div>
							<span class="tap-text">{lang === 'es' ? 'Click para revelar' : 'Click to reveal'}</span>
						</div>
					</div>

					<!-- FACE UP -->
					<div class={`card-face card-back rarity-${card.rarity.toLowerCase()}`}>
						<div class="rarity-badge">{card.rarity}</div>
						<div class="card-header">
							<span class="type-label">{card.type}</span>
							<h3>{card.title}</h3>
						</div>
						<div class="card-body">
							<p>{card.description}</p>
						</div>
						{#if card.rarity === 'Epic' || card.rarity === 'Legendary'}
							<div class="sparkles"></div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
.card-section {
	padding: var(--space-2xl) 0;
	background: linear-gradient(to right, var(--color-bg), var(--color-bg-alt));
	border-y: 1px solid var(--color-border);
}

.card-layout {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 4rem;
}

.unlocked-message {
	flex: 1;
}

.unlocked-badge {
	display: inline-block;
	background: var(--color-purple);
	color: white;
	padding: 0.5rem 1rem;
	border-radius: var(--radius-sm);
	font-weight: 800;
	font-size: 0.8rem;
	letter-spacing: 0.1em;
	margin-bottom: var(--space-md);
}

.unlocked-message h2 {
	font-size: 2.5rem;
	margin-bottom: var(--space-md);
	line-height: 1.1;
}

.unlocked-message p {
	font-size: 1.25rem;
	color: var(--color-text-muted);
	line-height: 1.6;
}

.card-container {
	width: 320px;
	height: 450px;
	cursor: pointer;
}

.card-inner {
	position: relative;
	width: 100%;
	height: 100%;
	transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	transform-style: preserve-3d;
}

.card-container.revealed .card-inner {
	transform: rotateY(180deg);
}

.card-face {
	position: absolute;
	width: 100%;
	height: 100%;
	backface-visibility: hidden;
	border-radius: var(--radius-lg);
	overflow: hidden;
	box-shadow: var(--shadow-lg);
	border: 8px solid white;
}

/* FRONT (BACK OF CARD) */
.card-front {
	background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}

.card-pattern {
	position: absolute;
	top: 0; left: 0; right: 0; bottom: 0;
	background-image: radial-gradient(rgba(255,255,255,0.1) 2px, transparent 2px);
	background-size: 20px 20px;
}

.bem-logo {
	font-size: 4rem;
	font-weight: 900;
	letter-spacing: -0.05em;
	background: linear-gradient(to bottom, var(--color-purple), var(--color-green));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 1rem;
}

.tap-text {
	display: block;
	text-align: center;
	font-size: 0.9rem;
	text-transform: uppercase;
	letter-spacing: 0.2em;
	opacity: 0.6;
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 0.4; }
	50% { opacity: 0.8; }
}

/* BACK (CONTENT OF CARD) */
.card-back {
	transform: rotateY(180deg);
	display: flex;
	flex-direction: column;
	padding: 2rem;
	color: white;
}

.rarity-badge {
	position: absolute;
	top: 1rem;
	right: 1rem;
	padding: 0.25rem 0.75rem;
	border-radius: 20px;
	font-size: 0.7rem;
	font-weight: 800;
	text-transform: uppercase;
	background: rgba(0,0,0,0.3);
}

.type-label {
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	opacity: 0.8;
}

h3 {
	font-size: 1.8rem;
	margin: 0.5rem 0 1.5rem;
	line-height: 1.2;
}

.card-body {
	background: white;
	padding: 1.5rem;
	border-radius: var(--radius-md);
	color: #1a1a1a;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.card-body p {
	font-size: 1rem;
	line-height: 1.5;
	margin: 0;
	font-weight: 500;
}

/* RARITY COLORS */
.rarity-common { background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); }
.rarity-rare { background: linear-gradient(135deg, #eab308 0%, #854d0e 100%); }
.rarity-epic { background: linear-gradient(135deg, #22c55e 0%, #166534 100%); }
.rarity-legendary { background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%); }

/* SPECIAL EFFECTS */
.rarity-epic, .rarity-legendary {
	position: relative;
}

.sparkles {
	position: absolute;
	top: 0; left: 0; right: 0; bottom: 0;
	background-image: 
		radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1px, transparent 1px),
		radial-gradient(circle at 80% 40%, rgba(255,255,255,0.4) 1.5px, transparent 1.5px),
		radial-gradient(circle at 40% 80%, rgba(255,255,255,0.4) 1px, transparent 1px),
		radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 2px, transparent 2px);
	background-size: 100px 100px;
	animation: sparkle 4s linear infinite;
	pointer-events: none;
}

@keyframes sparkle {
	from { background-position: 0 0; }
	to { background-position: 100px 100px; }
}

.rarity-legendary::after {
	content: '';
	position: absolute;
	top: -50%; left: -50%; width: 200%; height: 200%;
	background: linear-gradient(
		45deg,
		transparent 45%,
		rgba(255,255,255,0.1) 50%,
		transparent 55%
	);
	animation: shine 3s infinite;
}

@keyframes shine {
	0% { transform: translateX(-100%) translateY(-100%); }
	100% { transform: translateX(100%) translateY(100%); }
}

@media (max-width: 900px) {
	.card-layout {
		flex-direction: column;
		text-align: center;
		gap: 2rem;
	}
	
	.card-container {
		width: 100%;
		max-width: 320px;
	}
}

@media (max-width: 600px) {
	.card-face { padding: 1.5rem; }
}
</style>
