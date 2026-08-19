<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { resolveCharacterByName } from '$lib/content/characters';
	import type { DisplayWorld } from '$lib/utils/worldMapper';

	interface World {
		id: number;
		order_index: number;
		title: string;
		narrative_place: string;
		narrative_mentor: string;
		narrative_objective: string;
		displayNumber?: number;
		displayWorldNumber?: string;
		displayTitle?: string;
		[key: string]: any;
	}

	let { 
		world, 
		playerGameState = {}, 
		onClose, 
		onSelectMode,
		onReplayIntro
	}: { 
		world: World | DisplayWorld | any; 
		playerGameState: any; 
		onClose: () => void; 
		onSelectMode: (mode: string) => void;
		onReplayIntro: () => void;
	} = $props();

	const worldState = $derived(playerGameState[world.id] || {});
	const isWorkshopDone = $derived(worldState.workshop_feedback_submitted || false);
	const isTrainingDone = $derived(worldState.training_completed || false);
	const isDesignDone = $derived(worldState.design_completed || false);

	// Get mentor bio details based on world mentor
	const mentorDetails = $derived.by(() => {
		if (world.narrative_mentor?.includes('Sara')) {
			return {
				avatar: '✿',
				colorClass: 'sara',
				role: 'Psicóloga & Antropóloga OMIE',
				bio: 'Sara se especializa en la motivación intrínseca de los estudiantes, comprendiendo sus impulsos internos y el Hedonismo, Relación y Propósito de BEM.'
			};
		} else if (world.narrative_mentor?.includes('Wilkins') || world.narrative_mentor?.includes('John')) {
			return {
				avatar: '⚙️',
				colorClass: 'john',
				role: 'Diseñador de Sistemas & Mecánicas OMIE',
				bio: 'John diseña las rules del juego. Se enfoca en crear sistemas eficientes, bucles de retroalimentación coherentes y retos de Maestría.'
			};
		} else {
			return {
				avatar: '👑',
				colorClass: 'kira',
				role: 'Diseñadora de Objetivos OMIE',
				bio: 'Kira se enfoca en que cada actividad de clase tenga una dirección épica, metas alineadas y un fuerte sentido de autonomía y Empoderamiento.'
			};
		}
	});

	const character = $derived(resolveCharacterByName(world.narrative_mentor));
</script>

<div class="mode-overlay" transition:fade>
	<div class="mode-popup glass-card" in:fly={{ y: 50, duration: 450 }}>
		<!-- Close Button -->
		<button type="button" class="btn-close" onclick={onClose} aria-label="Cerrar modal">
			✕
		</button>

		<div class="popup-grid">
			<!-- LEFT COLUMN: SETTING & MENTOR -->
			<div class="sidebar-details">
				<span class="m-badge">{world.displayWorldNumber ?? `MUNDO ${world.order_index}`}</span>
				<h2 class="w-title">{world.displayTitle ?? world.title}</h2>
				
				<div class="detail-item">
					<div class="lbl">📍 Lugar de Juego</div>
					<div class="val">{world.narrative_place}</div>
				</div>

				<div class="detail-item">
					<div class="lbl">🎯 Objetivo Central</div>
					<div class="val objective-text">{world.narrative_objective}</div>
				</div>

				<button 
					type="button" 
					class="btn-solar-secondary btn-sm w-full justify-center mt-2" 
					onclick={onReplayIntro}
				>
					🎬 Ver Introducción de Mentores
				</button>

				<hr class="div-line" />

				<!-- Mentor Profile -->
				<div class="mentor-brief-card {mentorDetails.colorClass}">
					<div class="m-avatar">
						{#if character}
							<img src={character.images.base} alt={character.name} class="m-avatar-img" />
						{:else}
							{mentorDetails.avatar}
						{/if}
					</div>
					<div class="m-info">
						<span class="m-role">{mentorDetails.role}</span>
						<h4 class="m-name">{world.narrative_mentor}</h4>
						<p class="m-bio">"{mentorDetails.bio}"</p>
					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN: MODES PLAY SELECTOR -->
			<div class="modes-choices">
				<h3>🚀 Selecciona tu Actividad</h3>
				<p class="section-subtitle">Completa los tres módulos del mundo para dominar esta unidad.</p>

				<div class="choices-list">
					<!-- 1. WORKSHOP MODE (Synchronous multiplayer) - ALWAYS FIRST -->
					<div class="mode-item-card workshop" class:done={isWorkshopDone}>
						<div class="mode-icon-box">🎬</div>
						<div class="mode-main">
							<div class="mode-title-row">
								<h4>Modo Workshop</h4>
								{#if isWorkshopDone}
									<span class="m-badge done">✓ Terminado</span>
								{:else}
									<span class="m-badge group">Multijugador</span>
								{/if}
							</div>
							<p class="mode-desc">Sesión interactiva en real-time con tus compañeros. Diseña tu personaje RPG y debate con otros agentes.</p>
							<button type="button" class="btn-solar-primary btn-sm" onclick={() => onSelectMode('workshop')}>
								{isWorkshopDone ? 'Reingresar a Sesión' : 'Iniciar Workshop ➜'}
							</button>
						</div>
					</div>

					<!-- 2. TRAINING MODE (Solo game) -->
					<div class="mode-item-card training" class:done={isTrainingDone}>
						<div class="mode-icon-box">🧠</div>
						<div class="mode-main">
							<div class="mode-title-row">
								<h4>Modo Entrenamiento</h4>
								{#if isTrainingDone}
									<span class="m-badge done">✓ Superado</span>
								{:else}
									<span class="m-badge solo">Solo Quiz</span>
								{/if}
							</div>
							<p class="mode-desc">Pon a prueba tu mente. Identifica drivers en metas educativas y gana <strong>BEM Coins</strong> por tus aciertos.</p>
							<button type="button" class="btn-solar-secondary btn-sm" onclick={() => onSelectMode('training')}>
								{isTrainingDone ? 'Volver a Jugar' : 'Iniciar Entrenamiento ➜'}
							</button>
						</div>
					</div>

					<!-- 3. DESIGN MODE (Canvas bitácora) -->
					<div class="mode-item-card design" class:done={isDesignDone}>
						<div class="mode-icon-box">📝</div>
						<div class="mode-main">
							<div class="mode-title-row">
								<h4>Modo Diseño</h4>
								{#if isDesignDone}
									<span class="m-badge done">✓ Guardado</span>
								{:else}
									<span class="m-badge design">Canvas</span>
								{/if}
							</div>
							<p class="mode-desc">Completa tu bitácora de aprendizaje. Diseña actividades motivacionales alineadas con el marco BEM.</p>
							<button type="button" class="btn-solar-secondary btn-sm" onclick={() => onSelectMode('design')}>
								{isDesignDone ? 'Editar Canvas' : 'Abrir Bitácora de Diseño ➜'}
							</button>
						</div>
					</div>

					<!-- 4. WIKI MODE (Optional content) -->
					<div class="mode-item-card wiki">
						<div class="mode-icon-box">📚</div>
						<div class="mode-main">
							<div class="mode-title-row">
								<h4>Biblioteca OMIE</h4>
								<span class="m-badge optional">Opcional</span>
							</div>
							<p class="mode-desc">Explora artículos, videos y esquemas de los mentores. Desbloquea contenidos opcionales usando BEM Coins.</p>
							<button type="button" class="btn-solar-secondary btn-sm" onclick={() => onSelectMode('wiki')}>
								Explorar Biblioteca ➜
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.mode-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.35);
		backdrop-filter: blur(8px);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overflow-y: auto;
	}

	.mode-popup {
		max-width: 960px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		background: white;
		border-radius: var(--radius-solar-lg, 32px);
		border: 1px solid var(--color-solar-card-border);
		padding: 3rem;
		position: relative;
	}

	@media (max-width: 860px) {
		.mode-popup {
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

	/* GRID SYSTEM */
	.popup-grid {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: 3rem;
		align-items: start;
	}

	@media (max-width: 768px) {
		.popup-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	/* LEFT DETS */
	.sidebar-details {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.m-badge {
		align-self: flex-start;
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.w-title {
		font-family: var(--font-solar-header);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
		line-height: 1.2;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.detail-item .lbl {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-text-muted);
		text-transform: uppercase;
	}

	.detail-item .val {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.objective-text {
		line-height: 1.5;
		color: var(--color-solar-text);
	}

	.div-line {
		border: none;
		border-top: 1px solid var(--color-solar-card-border);
		margin: 0.5rem 0;
	}

	/* MENTOR CARD */
	.mentor-brief-card {
		display: flex;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 20px;
		border: 1px solid rgba(0,0,0,0.05);
	}

	.mentor-brief-card.sara { background: #fdf2f8; border-color: #fbcfe8; }
	.mentor-brief-card.john { background: #f0fdfa; border-color: #99f6e4; }
	.mentor-brief-card.kira { background: #fffbeb; border-color: #fde68a; }

	.m-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		box-shadow: var(--shadow-solar-sm);
		overflow: hidden;
		flex-shrink: 0;
		border: 2.5px solid var(--color-solar-green-medium);
		transition: all 0.3s ease;
	}

	.mentor-brief-card.sara .m-avatar {
		border-color: #ec4899;
		box-shadow: 0 0 10px rgba(236, 72, 153, 0.4);
	}
	.mentor-brief-card.john .m-avatar {
		border-color: #0d9488;
		box-shadow: 0 0 10px rgba(13, 148, 136, 0.4);
	}
	.mentor-brief-card.kira .m-avatar {
		border-color: #d97706;
		box-shadow: 0 0 10px rgba(217, 119, 6, 0.4);
	}

	.m-avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.m-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.m-role {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-text-muted);
		text-transform: uppercase;
	}

	.m-name {
		font-family: var(--font-solar-header);
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.m-bio {
		font-size: 0.8rem;
		font-style: italic;
		color: var(--color-solar-text);
		margin: 0.25rem 0 0 0;
		line-height: 1.4;
	}

	/* RIGHT CHOICES */
	.modes-choices {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.modes-choices h3 {
		font-family: var(--font-solar-header);
		font-size: 1.4rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.section-subtitle {
		font-size: 0.9rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 0.5rem;
		font-weight: 550;
	}

	.choices-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.mode-item-card {
		display: flex;
		gap: 1.5rem;
		padding: 1.5rem;
		border-radius: 20px;
		background: var(--color-solar-bg);
		border: 1px solid var(--color-solar-card-border);
		transition: all 0.25s ease;
	}

	.mode-item-card:hover {
		transform: translateY(-2px);
		background: white;
		box-shadow: var(--shadow-solar-sm);
	}

	.mode-item-card.done {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
	}

	.mode-icon-box {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.8rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.mode-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mode-title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.mode-title-row h4 {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.mode-desc {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 0.25rem;
		line-height: 1.4;
		font-weight: 550;
	}

	.m-badge.group { background: #e0f2fe; color: #0369a1; }
	.m-badge.solo { background: #fef3c7; color: #b45309; }
	.m-badge.design { background: #f3e8ff; color: #6b21a8; }
	.m-badge.optional { background: #f1f5f9; color: #475569; }
	.m-badge.done { background: var(--color-solar-green-medium); color: white; }

	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		border-radius: 8px;
		align-self: flex-start;
	}
</style>
