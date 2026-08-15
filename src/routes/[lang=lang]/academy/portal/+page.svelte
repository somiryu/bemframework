<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';
	import { supabase } from '$lib/supabase';
	
	// Layout components
	import WorldNavigator from '$lib/components/WorldNavigator.svelte';
	import NarrativeComponent from '$lib/components/NarrativeComponent.svelte';
	import ModeSelector from '$lib/components/ModeSelector.svelte';
	import JournalComponent from '$lib/components/JournalComponent.svelte';
	import FeedbackQuestionnaire from '$lib/components/FeedbackQuestionnaire.svelte';
	import MapIcon from '$lib/components/icons/MapIcon.svelte';

	// Game components
	import World1Workshop from '$lib/components/games/World1Workshop.svelte';
	import WorldTraining from '$lib/components/games/WorldTraining.svelte';
	import WorldDesign from '$lib/components/games/WorldDesign.svelte';
	import WorldWiki from '$lib/components/games/WorldWiki.svelte';
	import World2Workshop from '$lib/components/games/World2Workshop.svelte';

	import { page } from '$app/state';
	import { learnTranslations } from '$lib/content/learn';

	let { data }: { data: PageData } = $props();

	const lang = $derived((page.params.lang as 'es' | 'en') ?? 'es');
	const t = $derived(learnTranslations[lang].dashboard);

	// Reactive Player State copies for client-side fluid modifications
	let localPlayer = $state(data.player);
	let localGameState = $derived(localPlayer?.game_state || {});
	let localCoins = $derived(localPlayer?.coins || 0);
	const isHost = $derived(localPlayer?.email === 'javier@f2p.co');

	// Safe lists
	const worldsList = $derived(data.worlds || []);
	const classmatesData = $derived(data.classmates || []);

	// Navigation & Modal triggers
	let selectedWorld = $state<any>(null);
	let showModeSelector = $state(false);
	
	// Active narrative dialog arrays
	let activeNarrativeDialogue = $state<any[]>([]);
	let showNarrativeOverlay = $state(false);
	let narrativeTriggerType = $state<'intro' | 'outro'>('intro');

	// Active gameplay states
	let activeGameMode = $state<string | null>(null); // 'workshop', 'training', 'design', 'wiki'
	let showJournal = $state(false);
	let showFeedbackOverlay = $state(false);

	// Real-time peer listeners
	let classmatesList = $state(classmatesData);

	// Load narrative automatically on first load if not seen
	onMount(() => {
		// Check for unviewed narrative outros first (e.g. returning from workshop)
		let triggeredOutro = false;
		for (const world of worldsList) {
			const wState = localGameState[world.id] || localGameState[String(world.id)];
			if (wState?.workshop_completed && !wState?.narrative_outro_viewed) {
				selectedWorld = world;
				triggerNarrative(world, 'outro');
				triggeredOutro = true;
				break;
			}
		}

		if (!triggeredOutro) {
			const world1 = worldsList.find((w: any) => w.id === 1);
			const w1State = localGameState[1] || localGameState['1'];
			if (world1 && !w1State?.narrative_intro_viewed) {
				triggerNarrative(world1, 'intro');
			}
		}

		if (supabase && data.instance) {
			// Real-time listener to sync classmates roster updates!
			const channel = supabase
				.channel('classmates_roster_' + data.instance.code)
				.on('postgres_changes', { 
					event: 'UPDATE', 
					schema: 'public', 
					table: 'course_players',
					filter: `instance_code=eq.${data.instance.code}`
				}, (payload: any) => {
					const updated = payload.new;
					if (classmatesList) {
						classmatesList = classmatesList.map(c => c.id === updated.id ? { ...c, ...updated } : c);
					}
					if (updated.id === localPlayer.id) {
						localPlayer = { ...localPlayer, ...updated };
					}
				})
				.subscribe();

			return () => {
				if (supabase) supabase.removeChannel(channel);
			};
		}
	});

	function triggerNarrative(world: any, type: 'intro' | 'outro') {
		selectedWorld = world;
		narrativeTriggerType = type;
		
		const rawDialogue = type === 'intro' ? world.narrative_intro : world.narrative_outro;
		
		const processedDialogue = (rawDialogue || []).map((step: any) => {
			const charName = step.character || '';
			if (
				charName.includes('Sara') ||
				charName.includes('Wilkins') ||
				charName.includes('John') ||
				charName.includes('Kira') ||
				charName.includes('Emma')
			) {
				return { ...step, imageType: 'animated' };
			}
			return step;
		});

		if (world.id === 1 && type === 'intro') {
			activeNarrativeDialogue = [
				{
					character: 'GIOCHI',
					locationKey: 'omie',
					text: 'Academia OMIE, 2027. Han sido reclutados como agentes de la Organización Mundial de la Innovación Educativa. Hoy es su primer día de inducción.'
				},
				...processedDialogue
			];
		} else {
			activeNarrativeDialogue = processedDialogue;
		}
		
		showNarrativeOverlay = true;
	}

	async function handleNarrativeComplete() {
		showNarrativeOverlay = false;
		
		if (!localPlayer) return;

		// Save narrative viewed in player gameState
		const worldId = selectedWorld.id;
		const state = localPlayer.game_state ? JSON.parse(JSON.stringify(localPlayer.game_state)) : {};
		if (!state[worldId]) state[worldId] = {};

		if (narrativeTriggerType === 'intro') {
			state[worldId].narrative_intro_viewed = true;
			localPlayer.game_state = state;
			
			// Save via server action to bypass client RLS restrictions
			const formData = new FormData();
			formData.append('world_id', worldId.toString());
			formData.append('type', 'intro');
			const res = await fetch('?/setNarrativeViewed', {
				method: 'POST',
				body: formData
			});
			if (!res.ok) {
				console.error('Failed to save narrative view state:', res.status, await res.text());
			}

			// Open mode selector after intro completes!
			showModeSelector = true;
		} else {
			// Outro finished! World is fully unlocked/finished
			state[worldId].narrative_outro_viewed = true;
			localPlayer.game_state = state;

			const formData = new FormData();
			formData.append('world_id', worldId.toString());
			formData.append('type', 'outro');
			const res = await fetch('?/setNarrativeViewed', {
				method: 'POST',
				body: formData
			});
			if (!res.ok) {
				console.error('Failed to save narrative view state:', res.status, await res.text());
			}

			if (!isHost && state[worldId].workshop_completed && !state[worldId].workshop_feedback_submitted) {
				showFeedbackOverlay = true;
			} else {
				selectedWorld = null;
			}
		}
	}

	function handleSelectWorld(world: any) {
		selectedWorld = world;
		
		// If intro narrative has not been viewed yet, trigger narrative first!
		const wState = localGameState[world.id] || localGameState[String(world.id)];
		if (!wState?.narrative_intro_viewed) {
			triggerNarrative(world, 'intro');
		} else {
			showModeSelector = true;
		}
	}

	function handleSelectMode(mode: string) {
		showModeSelector = false;
		if (mode === 'workshop') {
			window.location.href = `/${lang}/learn/workshop/${data.instance.code}/${selectedWorld.id}`;
			return;
		}
		activeGameMode = mode;
	}

	function handleCloseGame() {
		activeGameMode = null;
		showModeSelector = true;
	}

	async function handleWorkshopSuccess() {
		activeGameMode = null;
		
		// Mark workshop completed locally
		const state = { ...localGameState };
		const worldState = state[selectedWorld.id] || {};
		worldState.workshop_completed = true;
		state[selectedWorld.id] = worldState;
		localPlayer.game_state = state;

		// Trigger narrative outro first!
		triggerNarrative(selectedWorld, 'outro');
	}

	function handleFeedbackSubmitted() {
		showFeedbackOverlay = false;
		
		// Refresh player profile locally
		const state = { ...localGameState };
		const worldState = state[selectedWorld.id] || {};
		worldState.workshop_feedback_submitted = true;
		state[selectedWorld.id] = worldState;
		localPlayer.game_state = state;

		// Open mode selector back
		showModeSelector = true;
	}

	// Dynamic triggers from components
	function handleCoinsUpdated(newCoinsCount: number, newState: any) {
		localPlayer.coins = newCoinsCount;
		localPlayer.game_state = newState;
	}
</script>

<div class="learn-shell">
	<!-- OPTIMISTIC HEADER -->
	<header class="learn-header solar-glass">
		<div class="header-content container">
			<div class="agency-brand">
				<span class="solar-glow">🌱</span>
				<div class="brand-text">
					<h3>OMIE ACADEMIA BEM</h3>
					<span class="inst-code">{t.activeClass} <strong>{data.instance.code}</strong></span>
				</div>
			</div>

			<div class="user-stats-bar">
				<div class="user-profile-preview">
					<span class="badge-role">{t.roleBadge}</span>
					<strong>{localPlayer.name}</strong> 
					<span class="alias-name">"{localPlayer.alias}"</span>
				</div>

				<div class="coin-balance-pill" onclick={() => showJournal = true}>
					🪙 <strong>{localCoins} {t.coins}</strong>
				</div>
				
				<button type="button" class="btn-solar-primary" onclick={() => showJournal = true}>
					📔 {t.journalBtn}
				</button>

				<form method="POST" action="?/logout" class="inline-form">
					<button type="submit" class="btn-solar-secondary btn-logout" aria-label="Cerrar Sesión">
						🚪 {lang === 'es' ? 'Salir' : 'Log Out'}
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="learn-body container">
		<!-- Narrative intro / outro overlay -->
		{#if showNarrativeOverlay}
			<NarrativeComponent 
				dialogue={activeNarrativeDialogue} 
				onComplete={handleNarrativeComplete} 
			/>
		{/if}

		<!-- Pearl vine vertical course maps -->
		<div class="course-map-section">
			<div class="section-onboarding text-center mb-6">
				<h2>{t.misionesTitle}</h2>
				<p>{t.misionesDesc}</p>
			</div>
			
			<WorldNavigator 
				worlds={data.worlds} 
				unlockedWorldIds={data.instance.unlocked_worlds} 
				playerGameState={localGameState}
				onSelectWorld={handleSelectWorld}
			/>
		</div>

		<!-- Mode selection popup -->
		{#if showModeSelector && selectedWorld}
			<ModeSelector 
				world={selectedWorld} 
				playerGameState={localGameState}
				onClose={() => { showModeSelector = false; selectedWorld = null; }}
				onSelectMode={handleSelectMode}
				onReplayIntro={() => {
					showModeSelector = false;
					triggerNarrative(selectedWorld, 'intro');
				}}
			/>
		{/if}

		<!-- Floating travel diary book button -->
		<button 
			type="button" 
			class="floating-journal-btn animate-float" 
			class:highlight-badge={localCoins > 5}
			onclick={() => showJournal = true}
			title={t.floatingJournalTip}
		>
			📔
			{#if localCoins > 0}
				<span class="coin-bubble">{localCoins}</span>
			{/if}
		</button>

		<!-- Journal Overlay -->
		{#if showJournal}
			<JournalComponent 
				player={localPlayer} 
				classmates={classmatesList} 
				worlds={data.worlds}
				onCloseJournal={() => showJournal = false}
			/>
		{/if}

		<!-- Feedback Questionnaire Overlay -->
		{#if showFeedbackOverlay && selectedWorld}
			<FeedbackQuestionnaire 
				world={selectedWorld} 
				player={localPlayer}
				lang={lang}
				onSubmitted={handleFeedbackSubmitted}
			/>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- GAME MODES RENDER VIEWS                             -->
		<!-- ---------------------------------------------------- -->
		{#if activeGameMode && selectedWorld}
			<div class="active-game-viewport" transition:fade>
				<div class="viewport-card glass-card">
					<div class="viewport-header">
						<div class="meta-row">
							<span class="m-badge">{lang === 'es' ? 'MUNDO' : 'WORLD'} {selectedWorld.order_index} • {activeGameMode.toUpperCase()}</span>
							<h3>{selectedWorld.title}</h3>
						</div>
						<button type="button" class="btn-solar-secondary btn-sm flex items-center gap-1.5" onclick={handleCloseGame}>
							<MapIcon size={16} /> {t.backToMap}
						</button>
					</div>

					<hr class="separator-line" />

					<div class="viewport-body">
						{#if activeGameMode === 'workshop'}
							{#if selectedWorld.id === 1}
								<World1Workshop 
									player={localPlayer} 
									instance={data.instance}
									onComplete={handleWorkshopSuccess}
								/>
							{:else if selectedWorld.id === 2}
								<World2Workshop 
									player={localPlayer} 
									instance={data.instance}
									onComplete={handleWorkshopSuccess}
								/>
							{:else}
								<div class="empty-list">
									{#if lang === 'es'}
										Workshop para el Mundo {selectedWorld.id} {t.emptyMode}
									{:else}
										Workshop for World {selectedWorld.id} {t.emptyMode}
									{/if}
								</div>
							{/if}
						{:else if activeGameMode === 'training'}
							<WorldTraining 
								world={selectedWorld}
								player={localPlayer}
								onComplete={handleCloseGame}
								onUpdateCoins={handleCoinsUpdated}
							/>
						{:else if activeGameMode === 'design'}
							<WorldDesign 
								world={selectedWorld}
								player={localPlayer}
								onComplete={handleCloseGame}
								onUpdateCoins={handleCoinsUpdated}
							/>
						{:else if activeGameMode === 'wiki'}
							<WorldWiki 
								world={selectedWorld}
								player={localPlayer}
								onComplete={handleCloseGame}
								onUpdateCoins={handleCoinsUpdated}
							/>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.learn-shell {
		background-color: var(--color-solar-bg, #FAF9F6);
		min-height: 100vh;
		position: relative;
		padding-bottom: 8rem;
		font-family: var(--font-solar-body);
	}

	.learn-header {
		position: sticky;
		top: 0;
		z-index: 1000;
		box-shadow: var(--shadow-solar-sm);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
	}

	.agency-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.solar-glow {
		font-size: 2.2rem;
		filter: drop-shadow(0 0 10px rgba(255, 209, 102, 0.4));
	}

	.brand-text h3 {
		font-family: var(--font-solar-header);
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
		letter-spacing: -0.01em;
	}

	.inst-code {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted);
	}

	.user-stats-bar {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.user-profile-preview {
		display: flex;
		flex-direction: column;
		text-align: right;
		font-size: 0.85rem;
	}

	@media (max-width: 640px) {
		.user-profile-preview {
			display: none;
		}
	}

	.badge-role {
		font-size: 0.6rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.05em;
	}

	.alias-name {
		color: var(--color-solar-green-medium);
		font-style: italic;
		font-weight: 700;
	}

	.coin-balance-pill {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		font-family: var(--font-solar-header);
		font-weight: 850;
		font-size: 0.95rem;
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		cursor: pointer;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.2s ease;
	}

	.coin-balance-pill:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
	}

	.btn-logout {
		color: #b91c1c !important;
		border-color: rgba(185, 28, 28, 0.15) !important;
		background: transparent !important;
		padding: 0.4rem 0.75rem !important;
		font-size: 0.75rem !important;
		height: auto !important;
		display: inline-flex !important;
		align-items: center !important;
		gap: 0.25rem;
		border-radius: 8px !important;
	}
	.btn-logout:hover {
		background: #fee2e2 !important;
		border-color: #b91c1c !important;
	}

	.learn-body {
		padding-top: 2rem;
	}

	.section-onboarding h2 {
		font-family: var(--font-solar-header);
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0 0 0.5rem;
	}

	.section-onboarding p {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		max-width: 600px;
		margin: 0 auto;
		font-weight: 550;
		line-height: 1.5;
	}

	/* FLOATING DIARY BUTTON */
	.floating-journal-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 72px;
		height: 72px;
		background: linear-gradient(135deg, var(--color-solar-green-medium), var(--color-solar-green-dark));
		border: 4px solid var(--color-solar-green-light);
		color: white;
		border-radius: 50%;
		font-size: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 5000;
		box-shadow: var(--shadow-solar-lg);
		transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.floating-journal-btn:hover {
		transform: translateY(-8px) scale(1.06);
		box-shadow: 0 16px 36px rgba(30, 69, 51, 0.25), 0 0 20px rgba(61, 143, 104, 0.4);
	}

	.coin-bubble {
		position: absolute;
		top: -6px;
		right: -6px;
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		font-size: 0.75rem;
		font-weight: 800;
		min-width: 24px;
		height: 24px;
		border-radius: 12px;
		border: 2px solid white;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-solar-sm);
	}

	/* ACTIVE GAME VIEWPORT WINDOW */
	.active-game-viewport {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.4);
		backdrop-filter: blur(14px);
		z-index: 20000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	@media (max-width: 640px) {
		.active-game-viewport {
			padding: 0.75rem;
		}
	}

	.viewport-card {
		max-width: 1100px;
		width: 100%;
		height: 90vh;
		background: white;
		border-radius: var(--radius-solar-lg, 32px);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		border: 1.5px solid var(--color-solar-green-medium);
		box-shadow: var(--shadow-solar-lg);
	}

	@media (max-width: 640px) {
		.viewport-card {
			height: 96vh;
			padding: 1.25rem 1rem;
		}
	}

	.viewport-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.meta-row {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-align: left;
	}

	.meta-row h3 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.3rem;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.m-badge {
		align-self: flex-start;
		font-size: 0.65rem;
		font-weight: 800;
		background: var(--color-solar-sky-light);
		color: var(--color-solar-sky);
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		letter-spacing: 0.05em;
	}

	.separator-line {
		border: none;
		border-top: 1px solid var(--color-solar-card-border);
		margin: 0 0 1.5rem 0;
	}

	.viewport-body {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.empty-list {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--color-solar-text-muted);
		font-weight: 700;
	}
</style>
