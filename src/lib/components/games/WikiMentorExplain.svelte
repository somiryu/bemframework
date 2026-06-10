<script lang="ts">
	let { 
		mentorName, 
		mentorAvatar, 
		instructions 
	}: { 
		mentorName: string; 
		mentorAvatar: string; 
		instructions: string; 
	} = $props();
</script>

<section class="wiki-mentor-explain">
	<div class="bubble-layout">
		<img src={mentorAvatar} alt={mentorName} class="char-avatar" />
		<div class="bubble-content">
			<h4 class="bubble-title">Directriz de Diseño ({mentorName}):</h4>
			<p class="bubble-text">
				{instructions}
			</p>
		</div>
	</div>
</section>

<style>
	.wiki-mentor-explain {
		background: #FFFDF4;
		border: 1px solid rgba(61, 143, 104, 0.2);
		padding: 1rem 1.5rem;
		border-radius: 16px;
		box-shadow: var(--shadow-solar-sm);
		margin-bottom: 1.5rem;
		width: 100%;
		box-sizing: border-box;
	}

	.bubble-layout {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		text-align: left;
	}

	.char-avatar {
		width: 52px;
		height: 52px;
		object-fit: contain;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 2px solid var(--color-solar-green-medium, #3d8f68);
		flex-shrink: 0;
	}

	.bubble-content {
		flex: 1;
	}

	.bubble-title {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.25rem 0;
	}

	.bubble-text {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-solar-text, #1f2937);
		margin: 0;
	}

	@media (max-width: 640px) {
		.bubble-layout {
			flex-direction: row;
			align-items: flex-start;
		}
	}
</style>
