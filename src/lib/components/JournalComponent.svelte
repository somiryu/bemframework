<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let { 
		player = {}, 
		classmates = [], 
		worlds = [],
		onCloseJournal
	}: { 
		player: any; 
		classmates: any[]; 
		worlds: any[];
		onCloseJournal: () => void 
	} = $props();

	let activeJournalTab = $state('canvas'); // 'canvas', 'wiki', 'achievements', 'roster'

	const gameState = $derived(player.game_state || {});

	// Calculate earned achievements based on player state!
	const achievementsList = $derived.by(() => {
		const achievements = [
			{ id: 'registered', title: 'Agente OMIE Oficial', desc: 'Registrar tu perfil RPG de entrenamiento en la agencia.', date: player.created_at, unlocked: true, icon: '🌱' }
		];

		// Check if any training trivia completed
		let totalTrainingDone = 0;
		let totalCanvasDone = 0;
		let totalWikiUnlocked = 0;

		worlds.forEach((w) => {
			if (gameState[w.id]?.training_completed) totalTrainingDone++;
			if (gameState[w.id]?.design_completed) totalCanvasDone++;
			if (gameState[w.id]?.unlocked_resources?.length > 0) totalWikiUnlocked += gameState[w.id].unlocked_resources.length;
		});

		if (totalTrainingDone > 0) {
			achievements.push({
				id: 'trivia_newbie',
				title: 'Analista de Drivers',
				desc: 'Superar tu primera trivia de reconocimiento de motivadores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🧠'
			});
		}

		if (totalCanvasDone > 0) {
			achievements.push({
				id: 'canvas_completed',
				title: 'Arquitecto del Aprendizaje',
				desc: 'Diseñar actividades serias para los 7 drivers BEM en tu bitácora.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📝'
			});
		}

		if (totalWikiUnlocked > 0) {
			achievements.push({
				id: 'wiki_scholar',
				title: 'Coleccionista de Sabiduría',
				desc: 'Canjear BEM Coins para desbloquear recursos teóricos opcionales de la Wiki.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📚'
			});
		}

		if (player.coins >= 30) {
			achievements.push({
				id: 'coin_wealth',
				title: 'Emprendedor de Monedas',
				desc: 'Acumular un balance de 30 o más BEM Coins.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🪙'
			});
		}

		return achievements;
	});
</script>

<div class="journal-overlay" transition:fade>
	<div class="journal-notebook glass-card" in:fly={{ y: 50, duration: 450 }}>
		<!-- Close Button -->
		<button type="button" class="btn-close" onclick={onCloseJournal} aria-label="Cerrar bitácora">
			✕
		</button>

		<div class="notebook-header">
			<div class="header-main">
				<span class="solar-ornament">📔 BITÁCORA DEL AGENTE</span>
				<h2>Diario de Viaje de {player.name}</h2>
				<p class="alias-tag">Código de Agente: <strong>{player.alias}</strong> • Rango: Agente en entrenamiento</p>
			</div>
			
			<div class="stats-pills">
				<div class="stat-badge coin-count animate-solar-pulse">
					🪙 <strong>{player.coins} BEM Coins</strong>
				</div>
			</div>
		</div>

		<!-- Notebook Tabs -->
		<div class="notebook-tabs-menu">
			<button 
				class="n-tab" 
				class:active={activeJournalTab === 'canvas'} 
				onclick={() => activeJournalTab = 'canvas'}
			>
				📝 Bitácora de Diseños
			</button>
			<button 
				class="n-tab" 
				class:active={activeJournalTab === 'wiki'} 
				onclick={() => activeJournalTab = 'wiki'}
			>
				📚 Biblioteca Desbloqueada
			</button>
			<button 
				class="n-tab" 
				class:active={activeJournalTab === 'achievements'} 
				onclick={() => activeJournalTab = 'achievements'}
			>
				🏆 Logros Obtenidos
			</button>
			<button 
				class="n-tab" 
				class:active={activeJournalTab === 'roster'} 
				onclick={() => activeJournalTab = 'roster'}
			>
				👥 Roster OMIE
			</button>
		</div>

		<hr class="n-separator" />

		<div class="notebook-body max-h-96 overflow-y-auto">
			<!-- TAB: CANVAS DESIGNS -->
			{#if activeJournalTab === 'canvas'}
				<div class="tab-content" in:fade>
					<h3>✏️ Actividades de Aprendizaje Guardadas</h3>
					<p class="section-desc">Aquí se compilan todos los Canvas de diseño de clase que has enviado en tus misiones.</p>

					{#if typeof worlds === 'object'}
						{@const canvasWorlds = worlds.filter(w => gameState[w.id]?.design_canvas)}
						{#if canvasWorlds.length > 0}
							<div class="accordion-canvases">
								{#each canvasWorlds as w}
									{@const canvas = gameState[w.id].design_canvas}
									<div class="canvas-saved-block">
										<h4 class="world-title-saved">Mundo {w.order_index}: {w.title}</h4>
										<div class="canvas-grid-display">
											{#each Object.entries(canvas) as [driver, answer]}
												<div class="driver-item-saved">
													<span class="d-label">{driver.toUpperCase()}:</span>
													<p class="d-answer">"{answer}"</p>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="empty-notebook-state">
								<span class="empty-icon">🤖</span>
								<div class="empty-text">
									<strong>Bitácora en Blanco</strong>
									<p>GIOCHI reporta: ¡Bip-bup! No detecto diseños de canvas en tus registros. Dirígete a la ruta del curso, haz clic en el Mundo 1, selecciona "Modo Diseño" y redacta tus propuestas motivacionales.</p>
								</div>
							</div>
						{/if}
					{/if}
				</div>
			{/if}

			<!-- TAB: WIKI / RESOURCES -->
			{#if activeJournalTab === 'wiki'}
				{@const unlockedResources = worlds.reduce((acc, w) => {
					const res = gameState[w.id]?.unlocked_resources || [];
					const worldWiki = w.wiki_modules || [];
					const matched = worldWiki.filter((r: any) => res.includes(r.id));
					return [...acc, ...matched.map((r: any) => ({ ...r, worldTitle: w.title }))];
				}, [] as any[])}
				<div class="tab-content" in:fade>
					<h3>📚 Biblioteca de Recursos Desbloqueados</h3>
					<p class="section-desc">Materiales teóricos opcionales que has adquirido canjeando BEM Coins en la Wiki.</p>

					{#if unlockedResources.length > 0}
						<div class="resources-unlocked-grid">
							{#each unlockedResources as r}
								<div class="resource-unlocked-card">
									<div class="res-badge-row">
										<span class="res-type-badge {r.type}">{r.type.toUpperCase()}</span>
										<span class="res-world">{r.worldTitle}</span>
									</div>
									<h4>{r.title}</h4>
									<p class="res-desc">{r.desc}</p>
									
									{#if r.type === 'article'}
										<div class="article-content-box">
											<p>{r.content}</p>
										</div>
									{:else}
										<a href={r.url} target="_blank" rel="noopener noreferrer" class="btn-solar-primary btn-sm mt-3">
											📥 Descargar / Ver {r.type.toUpperCase()}
										</a>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="empty-notebook-state">
							<span class="empty-icon">📚</span>
							<div class="empty-text">
								<strong>Biblioteca Vacía</strong>
								<p>No has desbloqueado ningún recurso de mentor opcional. Gana BEM Coins resolviendo trivias de entrenamiento en solitario y gástalas en la pestaña Wiki de cada mundo.</p>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- TAB: ACHIEVEMENTS -->
			{#if activeJournalTab === 'achievements'}
				<div class="tab-content" in:fade>
					<h3>🏆 Logros e Insignias de Agente</h3>
					<p class="section-desc">Hitos alcanzados a lo largo de tu viaje en la academia de gamificación OMIE.</p>

					<div class="achievements-list-layout">
						{#each achievementsList as ach}
							<div class="achievement-row-card" class:locked={!ach.unlocked}>
								<div class="ach-icon">{ach.icon}</div>
								<div class="ach-info">
									<h4>{ach.title}</h4>
									<p>{ach.desc}</p>
								</div>
								<div class="ach-date">
									{#if ach.unlocked}
										<span class="date-unlocked">Otorgado</span>
										<span class="date-val">{ach.date ? new Date(ach.date).toLocaleDateString() : ''}</span>
									{:else}
										<span class="date-locked">Bloqueado</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- TAB: ROSTER CLASSMATES -->
			{#if activeJournalTab === 'roster'}
				<div class="tab-content" in:fade>
					<h3>👥 Roster de Agentes de la Clase</h3>
					<p class="section-desc">Navega y compara tus estadísticas de personaje RPG con tus compañeros de clase activos.</p>

					<div class="roster-grid-layout">
						{#each classmates as mate}
							{@const mateState = mate.game_state || {}}
							{@const world1Stats = mateState['1']?.rpg_character?.drivers ?? null}

							<div class="roster-classmate-card">
								<div class="mate-card-header">
									<div class="m-badge group">{mate.avatar ? mate.avatar.replace('-', ' ') : 'Agente'}</div>
									<div class="mate-card-meta">🪙 {mate.coins} Coins</div>
								</div>
								
								<div class="mate-card-body flex gap-3 mt-2">
									<div class="mate-avatar-circle">{mate.name.substring(0,2).toUpperCase()}</div>
									<div class="mate-details">
										<strong>{mate.name}</strong>
										<span class="mate-alias">"{mate.alias}"</span>
										
										{#if world1Stats}
											<div class="mate-rpg-preview text-xs mt-2 font-semibold">
												🛡️ RPG Stats BEM:
												<div class="grid grid-cols-2 gap-1 text-xxs-font bg-white p-sm-pad rounded mt-1 border">
													{#each Object.entries(world1Stats) as [driver, points]}
														<div>{driver.substring(0,5)}: <strong>{points}</strong></div>
													{/each}
												</div>
											</div>
										{:else}
											<span class="text-xs text-gray-400 block mt-2">RPG sin configurar</span>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.journal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.4);
		backdrop-filter: blur(10px);
		z-index: 50000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overflow-y: auto;
	}

	.journal-notebook {
		max-width: 880px;
		width: 100%;
		background: #ffffff;
		border-radius: var(--radius-solar-lg, 32px);
		border: 1px solid var(--color-solar-green-medium);
		padding: 3rem;
		position: relative;
		box-shadow: var(--shadow-solar-lg);
		background-image: 
			radial-gradient(var(--color-solar-bg) 20%, transparent 20%),
			radial-gradient(var(--color-solar-bg) 20%, transparent 20%);
		background-size: 8px 8px;
		background-position: 0 0, 4px 4px;
		max-height: 90vh;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.journal-notebook {
			padding: 2rem 1.5rem;
		}
	}

	.btn-close {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		background: var(--color-solar-bg);
		border: 1px solid rgba(0,0,0,0.05);
		font-size: 1.1rem;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-solar-text-muted);
		transition: all 0.2s ease;
		z-index: 1000;
	}

	.btn-close:hover {
		background: #E5E7EB;
		color: var(--color-solar-text);
	}

	.notebook-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.solar-ornament {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.1em;
	}

	.notebook-header h2 {
		font-family: var(--font-solar-header);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0.15rem 0;
	}

	.alias-tag {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		font-weight: 550;
	}

	.stat-badge {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 0.95rem;
		box-shadow: var(--shadow-solar-sm);
	}

	/* TABS MENU */
	.notebook-tabs-menu {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--color-solar-card-border);
		padding-bottom: 0.1rem;
	}

	.n-tab {
		background: transparent;
		border: none;
		color: var(--color-solar-text-muted);
		font-weight: 700;
		font-size: 0.9rem;
		padding: 0.75rem 1.25rem;
		cursor: pointer;
		position: relative;
		transition: all 0.2s ease;
	}

	.n-tab:hover {
		color: var(--color-solar-green-dark);
	}

	.n-tab.active {
		color: var(--color-solar-green-dark);
	}

	.n-tab.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 3px;
		background: var(--color-solar-green-medium);
		border-radius: 3px 3px 0 0;
	}

	.n-separator {
		border: none;
		margin: 0 0 2rem 0;
	}

	.notebook-body {
		min-height: 300px;
		max-height: 480px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 1.5rem;
		font-weight: 550;
	}

	/* ACCORDION CANVAS SAVED */
	.canvas-saved-block {
		background: var(--color-solar-bg);
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.world-title-saved {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0 0 1rem;
	}

	.canvas-grid-display {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.driver-item-saved {
		background: white;
		border: 1px solid rgba(0,0,0,0.05);
		border-radius: 12px;
		padding: 0.75rem 1rem;
	}

	.driver-item-saved .d-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.25rem;
	}

	.driver-item-saved .d-answer {
		margin: 0;
		font-size: 0.85rem;
		font-style: italic;
		line-height: 1.4;
	}

	/* EMPTY STATE */
	.empty-notebook-state {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		background: var(--color-solar-yellow-light);
		border: 1px solid rgba(255, 209, 102, 0.3);
		padding: 1.5rem;
		border-radius: 20px;
	}

	.empty-icon {
		font-size: 2.5rem;
	}

	.empty-text h4 {
		font-family: var(--font-solar-header);
		font-size: 1rem;
		font-weight: 800;
		margin: 0 0 0.25rem;
		color: var(--color-solar-green-dark);
	}

	.empty-text p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		font-weight: 600;
	}

	/* WIKI RESOURCES UNLOCKED */
	.resources-unlocked-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	@media (max-width: 640px) {
		.resources-unlocked-grid {
			grid-template-columns: 1fr;
		}
	}

	.resource-unlocked-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.res-badge-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.res-type-badge {
		font-size: 0.6rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		color: white;
	}

	.res-type-badge.pdf { background: #ef4444; }
	.res-type-badge.video { background: #3b82f6; }
	.res-type-badge.article { background: #10b981; }

	.res-world {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-text-muted);
	}

	.resource-unlocked-card h4 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.res-desc {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.article-content-box {
		background: var(--color-solar-bg);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		font-size: 0.8rem;
		font-style: italic;
		line-height: 1.4;
		border-left: 3px solid var(--color-solar-green-medium);
		margin-top: 0.5rem;
	}

	/* ACHIEVEMENTS INSIGNIAS */
	.achievements-list-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.achievement-row-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1rem 1.25rem;
		display: grid;
		grid-template-columns: 48px 1fr 140px;
		gap: 1.5rem;
		align-items: center;
		box-shadow: var(--shadow-solar-sm);
	}

	@media (max-width: 600px) {
		.achievement-row-card {
			grid-template-columns: 48px 1fr;
		}
		.ach-date {
			grid-column: span 2;
			text-align: left !important;
		}
	}

	.ach-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--color-solar-yellow-light);
		border: 2px solid var(--color-solar-yellow);
		font-size: 1.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ach-info h4 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--color-solar-green-dark);
		margin: 0 0 0.15rem 0;
	}

	.ach-info p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		font-weight: 550;
	}

	.ach-date {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.date-unlocked {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		text-transform: uppercase;
	}

	.date-val {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-text);
	}

	/* CLASS ROSTER */
	.roster-grid-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.roster-grid-layout {
			grid-template-columns: 1fr;
		}
	}

	.roster-classmate-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.mate-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.35rem;
	}

	.mate-card-meta {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-green-medium);
	}

	.mate-avatar-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
	}

	.mate-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.mate-details strong {
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
	}

	.mate-alias {
		font-size: 0.75rem;
		color: var(--color-solar-green-medium);
		font-style: italic;
		font-weight: 700;
	}

	.mt-3 { margin-top: 0.75rem; }
	.text-xxs-font { font-size: 10px; }
	.p-sm-pad { padding: 0.375rem; }
	.rounded { border-radius: 0.25rem; }
	.border { border: 1px solid #E5E7EB; }
</style>
