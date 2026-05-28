<script lang="ts">
	import { onMount } from 'svelte';
	import { gameState, userLevel, gameActions } from '$lib/gameStore';
	import { cardsData } from '$lib/content/cards';
	import { page } from '$app/state';

	const lang = $derived(page.params.lang ?? 'en');

	let levelInfo = $derived($userLevel);
	let activeState = $derived($gameState);

	let totalCards = $derived(cardsData[lang]?.length ?? 20);
	let collectedCardsCount = $derived(activeState.unlockedCardIds.length);

	// Notification toasts
	let toasts = $state<{ id: number; message: string; amount?: number; type: 'xp' | 'card' }[]>([]);
	let toastId = 0;

	// Widget state
	let isExpanded = $state(false);
	let xpPulse = $state(false);
	let levelUpTriggered = $state(false);
	let prevLevel = $state(1);

	onMount(() => {
		prevLevel = levelInfo.level;

		// Listen to custom XP gain events
		const handleXpGain = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			xpPulse = true;
			setTimeout(() => (xpPulse = false), 600);

			// Add Toast
			const id = toastId++;
			const cleanReason = getLocalizedReason(detail.reason);
			toasts = [...toasts, {
				id,
				message: cleanReason,
				amount: detail.amount,
				type: 'xp'
			}];

			setTimeout(() => {
				toasts = toasts.filter((t) => t.id !== id);
			}, 4000);
		};

		// Listen to card unlocks
		const handleCardUnlock = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			const id = toastId++;
			toasts = [...toasts, {
				id,
				message: lang === 'es' 
					? `¡Nueva Carta Desbloqueada: ${detail.title}!` 
					: `New Card Unlocked: ${detail.title}!`,
				type: 'card'
			}];

			setTimeout(() => {
				toasts = toasts.filter((t) => t.id !== id);
			}, 4000);
		};

		window.addEventListener('bem-xp-gain', handleXpGain);
		window.addEventListener('bem-card-unlock', handleCardUnlock);

		return () => {
			window.removeEventListener('bem-xp-gain', handleXpGain);
			window.removeEventListener('bem-card-unlock', handleCardUnlock);
		};
	});

	// Level-up detector
	$effect(() => {
		if (levelInfo.level > prevLevel) {
			levelUpTriggered = true;
			const id = toastId++;
			toasts = [...toasts, {
				id,
				message: lang === 'es' 
					? `¡FELICIDADES! Has subido al Nivel ${levelInfo.level} 🎉` 
					: `CONGRATS! You reached Level ${levelInfo.level} 🎉`,
				type: 'card'
			}];
			setTimeout(() => {
				levelUpTriggered = false;
				toasts = toasts.filter((t) => t.id !== id);
			}, 6000);
			prevLevel = levelInfo.level;
		}
	});

	const getLocalizedReason = (reason: string): string => {
		if (reason.startsWith('trivia_')) {
			return lang === 'es' ? 'Trivia BEM Respondida Correctamente' : 'BEM Trivia Answered Correctly';
		}
		if (reason.startsWith('card_discovered_')) {
			return lang === 'es' ? 'Secreto BEM Descubierto' : 'BEM Secret Unlocked';
		}
		if (reason.startsWith('read_post_')) {
			return lang === 'es' ? 'Lectura de Artículo de Blog' : 'Blog Article Read Complete';
		}
		if (reason.startsWith('quote_generated')) {
			return lang === 'es' ? 'Cotización y Lead Completado' : 'Interactive Quote Requested';
		}
		if (reason.startsWith('download_resource_')) {
			return lang === 'es' ? 'Recurso Descargado' : 'Resource Downloaded';
		}
		return reason;
	};
</script>

<!-- FLOATING TOASTS NOTIFICATIONS -->
<div class="bem-toast-container">
	{#each toasts as toast (toast.id)}
		<div class="bem-toast" class:card-toast={toast.type === 'card'}>
			<div class="toast-icon">
				{#if toast.type === 'xp'}
					<span>+</span>
				{:else}
					<span>🏆</span>
				{/if}
			</div>
			<div class="toast-content">
				<p class="toast-desc">{toast.message}</p>
				{#if toast.amount}
					<span class="toast-xp">+{toast.amount} XP</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<!-- FLOATING DISCIPLE WIDGET -->
<div class="disciple-widget-wrapper" class:expanded={isExpanded}>
	<!-- DOCK TRIGGERS -->
	<button 
		class="widget-trigger" 
		onclick={() => isExpanded = !isExpanded} 
		aria-label="Toggle Disciple Progress"
		class:pulse={xpPulse}
		class:levelup={levelUpTriggered}
	>
		<div class="circular-progress" style="--percent: {levelInfo.progressPercent}">
			<div class="avatar-ring">
				<span class="disciple-lvl">Lvl {levelInfo.level}</span>
			</div>
		</div>
	</button>

	<!-- EXPANDED PANEL -->
	{#if isExpanded}
		<div class="widget-panel">
			<div class="panel-header">
				<h4>{lang === 'es' ? 'Rango Discípulo BEM' : 'BEM Disciple Rank'}</h4>
				<span class="badge-rank">
					{#if levelInfo.level <= 1} {lang === 'es' ? 'Novato' : 'Novice'}
					{:else if levelInfo.level <= 3} {lang === 'es' ? 'Iniciado' : 'Initiate'}
					{:else if levelInfo.level <= 5} {lang === 'es' ? 'Diseñador' : 'Designer'}
					{:else} {lang === 'es' ? 'Maestro' : 'Master'}
					{/if}
				</span>
			</div>

			<div class="panel-body">
				<!-- XP PROGRESS -->
				<div class="xp-progress-bar-container">
					<div class="xp-labels">
						<span>XP: {activeState.xp}</span>
						<span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpForNextLevel}</span>
					</div>
					<div class="xp-bar-track">
						<div class="xp-bar-fill" style="width: {levelInfo.progressPercent}%"></div>
					</div>
				</div>

				<!-- CARDS STATS -->
				<div class="widget-stat-row">
					<span>{lang === 'es' ? 'Colección de Cartas' : 'Card Album'}</span>
					<strong>{collectedCardsCount} / {totalCards}</strong>
				</div>

				<a 
					href={`/${lang}/resources`} 
					class="view-album-btn"
					onclick={() => isExpanded = false}
				>
					{lang === 'es' ? 'Ver Álbum & Recursos' : 'Open Album & Resources'}
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
.bem-toast-container {
	position: fixed;
	bottom: 5.5rem;
	right: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	z-index: 9999;
	pointer-events: none;
}

.bem-toast {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: rgba(26, 26, 26, 0.95);
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	padding: 0.85rem 1.25rem;
	border-radius: var(--radius-md);
	color: white;
	min-width: 280px;
	max-width: 380px;
	pointer-events: auto;
	animation: slideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.bem-toast.card-toast {
	background: linear-gradient(135deg, var(--color-purple) 0%, #312e81 100%);
	border-color: rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
	from { opacity: 0; transform: translateY(20px) scale(0.95); }
	to { opacity: 1; transform: translateY(0) scale(1); }
}

.toast-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: var(--radius-full);
	background: var(--color-purple);
	color: white;
	font-weight: 800;
	font-size: 0.85rem;
}

.card-toast .toast-icon {
	background: rgba(255, 255, 255, 0.2);
}

.toast-content {
	flex: 1;
}

.toast-desc {
	margin: 0;
	font-size: 0.85rem;
	font-weight: 700;
}

.toast-xp {
	font-size: 0.75rem;
	color: var(--color-green);
	font-weight: 800;
}

/* WIDGET TRIGGER CONTAINER */
.disciple-widget-wrapper {
	position: fixed;
	bottom: 1.5rem;
	right: 1.5rem;
	z-index: 9998;
	font-family: var(--font-sans);
}

.widget-trigger {
	width: 64px;
	height: 64px;
	border-radius: var(--radius-full);
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(10px);
	border: 2px solid var(--color-purple);
	box-shadow: var(--shadow-lg);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	padding: 0;
	transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	position: relative;
}

.widget-trigger:hover {
	transform: scale(1.08) rotate(3deg);
	box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
}

.widget-trigger.pulse {
	animation: bounceXp 0.5s ease;
}

.widget-trigger.levelup {
	animation: spinLvlUp 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
	border-color: var(--color-green);
}

@keyframes bounceXp {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.2) translateY(-8px); border-color: var(--color-green); }
}

@keyframes spinLvlUp {
	0%, 100% { transform: scale(1) rotate(0deg); }
	25% { transform: scale(1.15) rotate(-15deg); }
	75% { transform: scale(1.15) rotate(15deg); }
}

/* CIRCULAR PROGRESS */
.circular-progress {
	width: 58px;
	height: 58px;
	border-radius: var(--radius-full);
	background: conic-gradient(var(--color-purple) calc(var(--percent) * 1%), var(--color-border) 0);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.avatar-ring {
	width: 48px;
	height: 48px;
	border-radius: var(--radius-full);
	background: #1a1a1a;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
}

.disciple-lvl {
	font-weight: 800;
	font-size: 0.75rem;
	letter-spacing: -0.02em;
	text-transform: uppercase;
}

/* WIDGET PANEL */
.widget-panel {
	position: absolute;
	bottom: 80px;
	right: 0;
	width: 300px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	border: 1px solid var(--color-border);
	box-shadow: var(--shadow-lg);
	border-radius: var(--radius-lg);
	overflow: hidden;
	animation: panelOpen 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards;
}

@keyframes panelOpen {
	from { opacity: 0; transform: translateY(15px) scale(0.9); }
	to { opacity: 1; transform: translateY(0) scale(1); }
}

.panel-header {
	background: linear-gradient(135deg, var(--color-purple) 0%, #4c1d95 100%);
	padding: 1.25rem;
	color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.panel-header h4 {
	margin: 0;
	font-size: 0.95rem;
	font-weight: 800;
}

.badge-rank {
	font-size: 0.7rem;
	font-weight: 800;
	text-transform: uppercase;
	background: rgba(255,255,255,0.2);
	padding: 0.25rem 0.6rem;
	border-radius: var(--radius-sm);
}

.panel-body {
	padding: 1.25rem;
}

.xp-progress-bar-container {
	margin-bottom: 1.25rem;
}

.xp-labels {
	display: flex;
	justify-content: space-between;
	font-size: 0.8rem;
	font-weight: 700;
	color: var(--color-text-muted);
	margin-bottom: 0.35rem;
}

.xp-bar-track {
	height: 8px;
	background: var(--color-border);
	border-radius: var(--radius-full);
	overflow: hidden;
}

.xp-bar-fill {
	height: 100%;
	background: var(--color-purple);
	border-radius: var(--radius-full);
	transition: width 0.4s ease-out;
}

.widget-stat-row {
	display: flex;
	justify-content: space-between;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--color-text);
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 0.75rem;
	margin-bottom: 1.25rem;
}

.widget-stat-row strong {
	color: var(--color-purple);
}

.view-album-btn {
	display: block;
	text-align: center;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	font-weight: 800;
	padding: 0.75rem;
	border-radius: var(--radius-md);
	font-size: 0.85rem;
	transition: var(--transition-fast);
}

.view-album-btn:hover {
	background: var(--color-purple);
	transform: translateY(-2px);
}
</style>
