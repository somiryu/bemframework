<script lang="ts">
	import { fade } from 'svelte/transition';

	interface World {
		id: number;
		order_index: number;
		title: string;
		narrative_place: string;
		narrative_mentor: string;
		narrative_objective: string;
	}

	let { 
		worlds = [], 
		unlockedWorldIds = [], 
		playerGameState = {}, 
		onSelectWorld 
	}: { 
		worlds: World[]; 
		unlockedWorldIds: number[]; 
		playerGameState: any; 
		onSelectWorld: (world: World) => void 
	} = $props();
</script>

<div class="navigator-container">
	<!-- Green dashed vine connecting worlds -->
	<div class="pearl-vine"></div>

	<div class="worlds-trail">
		{#each worlds as world, idx}
			{@const isUnlocked = unlockedWorldIds.includes(world.id)}
			{@const isCompleted = playerGameState[world.id]?.workshop_feedback_submitted && playerGameState[world.id]?.training_completed && playerGameState[world.id]?.design_completed}
			{@const hasStarted = playerGameState[world.id]?.workshop_completed || playerGameState[world.id]?.training_completed}

			<!-- Alternating offsets to make it a wavy trail (Duolingo style) -->
			{@const offsetClass = idx % 2 === 0 ? 'offset-left' : 'offset-right'}

			<div class="world-node-wrapper {offsetClass}" transition:fade>
				<button
					type="button"
					class="world-pearl-btn"
					class:locked={!isUnlocked}
					class:unlocked={isUnlocked}
					class:completed={isCompleted}
					disabled={!isUnlocked}
					onclick={() => onSelectWorld(world)}
				>
					<div class="pearl-content">
						{#if isCompleted}
							🌟
						{:else if !isUnlocked}
							🔒
						{:else}
							🌱
						{/if}
					</div>
					
					<!-- Ring spinner pulse for active unlocked but incomplete world -->
					{#if isUnlocked && !isCompleted}
						<div class="pearl-ring-pulse animate-solar-pulse"></div>
					{/if}
				</button>

				<!-- World Title and details box -->
				<div class="world-info-card" class:locked-text={!isUnlocked} onclick={() => isUnlocked && onSelectWorld(world)}>
					<div class="node-header">
						<span class="world-number">MUNDO {world.order_index}</span>
						{#if isCompleted}
							<span class="status-badge completed">Finalizado</span>
						{:else if isUnlocked && hasStarted}
							<span class="status-badge in-progress">En Progreso</span>
						{:else if isUnlocked}
							<span class="status-badge unlocked">Disponible</span>
						{:else}
							<span class="status-badge locked">Bloqueado</span>
						{/if}
					</div>
					<h4 class="node-title">{world.title}</h4>
					<p class="node-desc">📍 {world.narrative_place} • Mentor: {world.narrative_mentor}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.navigator-container {
		position: relative;
		max-width: 680px;
		margin: 3rem auto;
		padding: 4rem 1.5rem;
		min-height: 500px;
	}

	.worlds-trail {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 5rem;
	}

	.world-node-wrapper {
		display: flex;
		align-items: center;
		gap: 2rem;
		width: 100%;
		position: relative;
	}

	/* Alternating layout offset */
	.offset-left {
		flex-direction: row;
	}

	.offset-right {
		flex-direction: row-reverse;
		text-align: right;
	}

	.offset-right .world-info-card {
		align-items: flex-end;
	}

	@media (max-width: 580px) {
		.world-node-wrapper {
			flex-direction: column !important;
			text-align: center !important;
			gap: 1rem;
		}
		.world-info-card {
			align-items: center !important;
		}
	}

	/* THE PEARL BUTTON */
	.world-pearl-btn {
		width: 84px;
		height: 84px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.2rem;
		box-shadow: var(--shadow-solar-md);
		position: relative;
		z-index: 100;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.world-pearl-btn.locked {
		background: #E5E7EB;
		color: #9CA3AF;
		border: 4px solid #D1D5DB;
		cursor: not-allowed;
		box-shadow: none;
	}

	.world-pearl-btn.unlocked {
		background: linear-gradient(135deg, var(--color-solar-yellow), #FFB703);
		color: var(--color-solar-green-dark);
		border: 4px solid white;
	}

	.world-pearl-btn.completed {
		background: linear-gradient(135deg, var(--color-solar-green-medium), var(--color-solar-green-dark));
		color: white;
		border: 4px solid var(--color-solar-green-light);
	}

	.world-pearl-btn:hover:not(.locked) {
		transform: translateY(-5px) scale(1.08);
		box-shadow: var(--shadow-solar-lg), 0 0 16px rgba(255, 209, 102, 0.5);
	}

	.pearl-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.pearl-ring-pulse {
		position: absolute;
		top: -8px;
		left: -8px;
		right: -8px;
		bottom: -8px;
		border: 2px solid var(--color-solar-yellow);
		border-radius: 50%;
		pointer-events: none;
	}

	/* TITLE CARD PANEL */
	.world-info-card {
		flex: 1;
		background: white;
		border: 1px solid var(--color-solar-card-border);
		padding: 1.25rem 1.75rem;
		border-radius: var(--radius-solar-md, 20px);
		box-shadow: var(--shadow-solar-sm);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.world-info-card:hover:not(.locked-text) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
		border-color: rgba(61, 143, 104, 0.2);
	}

	.locked-text {
		opacity: 0.65;
		cursor: not-allowed;
		background: #FAF9F6;
	}

	.node-header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.world-number {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.05em;
	}

	.status-badge {
		font-size: 0.6rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.status-badge.unlocked {
		background: var(--color-solar-sky-light);
		color: var(--color-solar-sky);
	}

	.status-badge.in-progress {
		background: var(--color-solar-yellow-light);
		color: #B28200;
	}

	.status-badge.completed {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
	}

	.status-badge.locked {
		background: #E5E7EB;
		color: #6B7280;
	}

	.node-title {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.node-desc {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-solar-text-muted);
		margin: 0;
	}
</style>
