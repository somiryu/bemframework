<script lang="ts">
	import { fade } from 'svelte/transition';

	let { 
		mentorName, 
		mentorAvatar, 
		instructions,
		titlePrefix = 'Directriz'
	}: { 
		mentorName: string; 
		mentorAvatar: string; 
		instructions: string; 
		titlePrefix?: string;
	} = $props();
</script>

<section class="giochi-speech-bubble" in:fade>
	<div class="bubble-layout">
		<div class="char-avatar-container">
			<div class="gear-backdrop">⚙️</div>
			<img src={mentorAvatar} alt={mentorName} class="char-avatar" />
		</div>
		<div class="bubble-content">
			<h4 class="bubble-title">{titlePrefix} ({mentorName}):</h4>
			<p class="bubble-text">
				{@html instructions}
			</p>
		</div>
	</div>
</section>

<style>
	/* Speech Bubble Design with Avatar */
	.giochi-speech-bubble {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.3);
		padding: 1.25rem 1.75rem;
		border-radius: 16px;
		box-shadow: 0 4px 20px -2px rgba(255, 209, 102, 0.15);
		margin-bottom: 2rem;
		width: 100%;
		box-sizing: border-box;
	}

	.bubble-layout {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		text-align: left;
	}

	.char-avatar-container {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.gear-backdrop {
		position: absolute;
		font-size: 5rem;
		opacity: 0.15;
		color: var(--color-solar-green-medium, #3d8f68);
		z-index: 1;
		animation: spin 16s linear infinite;
		pointer-events: none;
	}

	.char-avatar {
		width: 72px;
		height: 72px;
		object-fit: cover; /* Fill the circle entirely without bars */
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		border: 3px solid var(--color-solar-yellow, #ffd166);
		z-index: 2;
		box-shadow: var(--shadow-solar-sm);
		animation: float 4s ease-in-out infinite;
	}

	.bubble-content {
		flex: 1;
	}

	.bubble-title {
		font-weight: 800;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0 0 0.35rem 0;
	}

	.bubble-text {
		font-size: 0.88rem;
		line-height: 1.5;
		color: #4b5563;
		margin: 0;
	}

	/* Animations */
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-4px); }
		100% { transform: translateY(0px); }
	}
</style>
