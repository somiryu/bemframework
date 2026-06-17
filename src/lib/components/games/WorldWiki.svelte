<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import MentorExplain from './MentorExplain.svelte';

	let { 
		world, 
		player, 
		onComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onComplete: () => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	// Config details per world
	const wikiConfigs: Record<number, {
		title: string;
		badge: string;
		description: string;
		tip: string;
	}> = {
		1: {
			title: 'Biblioteca Opcional OMIE',
			badge: 'BIBLIOTECA OMIE',
			description: 'Intercambia monedas por guías teóricas avanzadas.',
			tip: '¡Bienvenido a la Bóveda del Conocimiento de la OMIE! Los mentores han depositado guías de campo, videos de bucles y artículos sobre el marco BEM. Desbloquear cada recurso requiere <strong>BEM Coins</strong> (obtenidos en el Training mode). Una vez desbloqueados, aparecerán guardados para siempre en tu <strong>Libro Bitácora flotante</strong>.'
		},
		2: {
			title: 'Biblioteca de Recursos GFR',
			badge: 'RECURSOS GFR',
			description: 'Intercambia monedas por guías teóricas avanzadas y videos.',
			tip: '¡Bienvenido de nuevo, agente! En esta bóveda encontrarás lecturas del modelo GFR y la teoría de la autodeterminación. Canjea tus <strong>BEM Coins</strong> acumuladas en los entrenamientos para desbloquear estos recursos y agregarlos de forma permanente en tu <strong>Bitácora Flotante</strong>.'
		},
		3: {
			title: 'Relojería de la Interactividad',
			badge: 'RELOJERÍA DE INTERACTIVIDAD',
			description: 'Manuales teóricos avanzados de bucles y ciclos interactivos.',
			tip: '¡Saludos, agente! Actualmente los mentores de la OMIE están digitalizando y curando los manuales teóricos avanzados sobre la relojería de la interactividad. ¡Vuelve más tarde para canjear tus BEM Coins aquí!'
		},
		4: {
			title: 'Bóveda de Metas y Expectativas',
			badge: 'RECURSOS DE METAS',
			description: 'Desbloquea documentos de arquitectura de metas y guías teóricas.',
			tip: '¡Saludos, agente! En esta sección de la biblioteca puedes canjear tus BEM Coins por recursos avanzados y detallados sobre el diseño y la estructuración de metas de aprendizaje. Al desbloquearlos, quedarán archivados para siempre en tu Bitácora.'
		}
	};

	const config = $derived(wikiConfigs[world.id] || {
		title: 'Biblioteca de Recursos',
		badge: 'BIBLIOTECA',
		description: 'Canjea tus monedas por recursos teóricos avanzados.',
		tip: '¡Saludos, agente! Puedes desbloquear recursos y materiales de apoyo en este módulo.'
	});

	const wikiResources = $derived(world.wiki_modules || []);
	const worldState = $derived(player.game_state?.[world.id] || {});
	const unlockedResourcesList = $derived(worldState.unlocked_resources || []);

	let selectedArticleToRead = $state<any>(null);
	let isUnlockingId = $state<string | null>(null);
</script>

<div class="wiki-game-wrapper text-center" in:fade>
	<!-- Reusable MentorExplain component with GIOCHI bot -->
	<MentorExplain 
		mentorName="GIOCHI" 
		mentorAvatar="/learn_resoruces/characters/char_giochi.gif" 
		instructions={config.tip} 
		titlePrefix="Biblioteca" 
	/>

	<!-- Wiki header section -->
	<div class="wiki-header-title text-left flex justify-between items-center mb-6">
		<div class="info">
			<span class="lock-badge">📊 {config.badge}</span>
			<h3 class="mt-2">{config.title}</h3>
			<p class="text-xs text-solar-text-muted">{config.description}</p>
		</div>
		
		<div class="coin-badge-display animate-solar-pulse">
			🪙 <strong>{player.coins} BEM Coins</strong>
		</div>
	</div>

	<!-- ACTIVE ARTICLE READER POPUP -->
	{#if selectedArticleToRead}
		<div class="article-reader-view glass-card text-left mb-6" in:slide>
			<div class="reader-header flex justify-between items-center pb-2 border-b">
				<span class="res-type-badge article">ARTÍCULO</span>
				<button type="button" class="btn-solar-secondary btn-sm" onclick={() => selectedArticleToRead = null}>
					✕ Cerrar Artículo
				</button>
			</div>
			<h4 class="mt-4 font-bold text-solar-green-dark text-lg">{selectedArticleToRead.title}</h4>
			<p class="text-xs text-solar-text-muted mt-1">📍 Fuente: Biblioteca de la OMIE</p>
			
			<div class="article-body mt-4 font-semibold text-solar-text leading-relaxed">
				{selectedArticleToRead.content}
			</div>
		</div>
	{/if}

	<!-- RESOURCES GRID / EMPTY STATE -->
	{#if wikiResources.length > 0}
		<div class="resources-wiki-grid text-left">
			{#each wikiResources as r}
				{@const isUnlocked = unlockedResourcesList.includes(r.id)}
				{@const canAfford = player.coins >= r.cost}

				<div class="wiki-resource-card glass-card" class:unlocked={isUnlocked}>
					<div class="card-top-row flex justify-between items-center mb-2">
						<span class="res-type-badge {r.type}">{r.type.toUpperCase()}</span>
						{#if isUnlocked}
							<span class="unlocked-text-tag">✓ Adquirido</span>
						{:else}
							<span class="coin-cost-tag">🪙 {r.cost} Coins</span>
						{/if}
					</div>

					<h4>{r.title}</h4>
					<p class="resource-desc-text">{r.desc}</p>

					<hr class="separator-line my-3" />

					<div class="card-action-row mt-auto">
						{#if isUnlocked}
							{#if r.type === 'article'}
								<button type="button" class="btn-solar-primary btn-sm w-full justify-center" onclick={() => selectedArticleToRead = r}>
									📖 Leer Artículo Completo
								</button>
							{:else}
								<a href={r.url} target="_blank" rel="noopener noreferrer" class="btn-solar-primary btn-sm w-full justify-center">
									📥 Abrir {r.type.toUpperCase()}
								</a>
							{/if}
						{:else}
							<form
								method="POST"
								action="?/unlockWikiResource"
								use:enhance={() => {
									isUnlockingId = r.id;
									return async ({ result, update }) => {
										isUnlockingId = null;
										if (result.type === 'success' && result.data) {
											onUpdateCoins(result.data.coins, result.data.game_state);
										}
										await update();
									};
								}}
							>
								<input type="hidden" name="world_id" value={world.id} />
								<input type="hidden" name="resource_id" value={r.id} />
								<input type="hidden" name="cost" value={r.cost} />

								<button 
									type="submit" 
									class="btn-solar-accent btn-sm w-full justify-center font-bold"
									disabled={!canAfford || isUnlockingId === r.id}
								>
									{#if isUnlockingId === r.id}
										🔑 Canjeando...
									{:else if !canAfford}
										❌ Monedas Insuficientes
									{:else}
										🔓 Desbloquear por {r.cost} Coins
									{/if}
								</button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty Library Panel -->
		<div class="empty-library-panel glass-card p-8 text-center border-dashed border-2 border-gray-200">
			<span class="text-4xl block mb-2">📚</span>
			<h4 class="font-extrabold text-solar-green-dark">Biblioteca Temporalmente Vacía</h4>
			<p class="text-xs text-solar-text-muted mt-1 max-w-md mx-auto">
				No hay manuales o videos disponibles para desbloquear en este momento. Sigue acumulando BEM Coins en el Entrenamiento y el Canvas de Diseño.
			</p>

			<button type="button" class="btn-solar-primary mt-6 px-6 font-bold text-xs" onclick={onComplete}>
				Regresar al Mapa Principal
			</button>
		</div>
	{/if}
</div>

<style>
	.wiki-game-wrapper {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	.lock-badge {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0369a1);
		background: var(--color-solar-sky-light, #e0f2fe);
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
		display: inline-block;
	}

	.wiki-header-title h3 {
		font-family: var(--font-solar-header);
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0 0;
	}

	.coin-badge-display {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		font-family: var(--font-solar-header);
		font-weight: 850;
		font-size: 0.95rem;
		box-shadow: var(--shadow-solar-sm);
		flex-shrink: 0;
	}

	/* ARTICLE VIEW */
	.article-reader-view {
		border: 2px solid var(--color-solar-green-medium);
		padding: 2rem;
		border-radius: 24px;
		background: #ffffff;
	}

	.article-body {
		font-size: 0.95rem;
		line-height: 1.7;
	}

	/* RESOURCES GRID */
	.resources-wiki-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	@media (max-width: 640px) {
		.resources-wiki-grid {
			grid-template-columns: 1fr;
		}
	}

	.wiki-resource-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 24px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.25s ease;
	}

	.wiki-resource-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
	}

	.wiki-resource-card.unlocked {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-bg);
	}

	.wiki-resource-card h4 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0.5rem 0;
	}

	.resource-desc-text {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
		font-weight: 550;
	}

	.res-type-badge {
		font-size: 0.6rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		color: white;
		text-transform: uppercase;
	}

	.res-type-badge.pdf { background: #ef4444; }
	.res-type-badge.video { background: #3b82f6; }
	.res-type-badge.article { background: #10b981; }

	.coin-cost-tag {
		font-size: 0.75rem;
		font-weight: 800;
		color: #B28200;
		background: #FFFBEB;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
		border: 1.5px solid #FEF3C7;
	}

	.unlocked-text-tag {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		background: #D1F5E3;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;
	}

	.separator-line {
		border: none;
		border-top: 1px solid var(--color-solar-card-border);
		margin: 0.5rem 0;
	}

	.empty-library-panel {
		background: rgba(255, 255, 255, 0.5);
	}

	.my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1rem; }
	.mt-6 { margin-top: 1.5rem; }
	.mt-auto { margin-top: auto; }
	.w-full { width: 100%; }
	.justify-center { justify-content: center; }
	.text-left { text-align: left; }
	.flex { display: flex; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.text-xs { font-size: 0.75rem; }
	.font-bold { font-weight: 700; }
	.pb-2 { padding-bottom: 0.5rem; }
	.border-b { border-bottom: 1px solid #E5E7EB; }
</style>
