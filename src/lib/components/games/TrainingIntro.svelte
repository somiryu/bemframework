<script lang="ts">
	import { fade } from 'svelte/transition';
	import MentorExplain from './MentorExplain.svelte';

	let { 
		mentorName, 
		mentorAvatar, 
		title, 
		tip, 
		instructions,
		onStart 
	}: { 
		mentorName: string; 
		mentorAvatar: string; 
		title: string; 
		tip: string; 
		instructions: string[]; 
		onStart: () => void; 
	} = $props();
</script>

<div class="intro-screen glass-card p-6" in:fade>
	<span class="agency-tag">OMIE SIMULADOR</span>
	<h3 class="font-bold text-solar-green-dark mb-6">{title}</h3>

	<!-- Reused MentorExplain component to separate mentor tip from instructions -->
	<MentorExplain 
		mentorName={mentorName} 
		mentorAvatar={mentorAvatar} 
		instructions={tip} 
		titlePrefix="Mentor" 
	/>
	
	<!-- Instruction card with yellow glassmorphism background from World 2 -->
	<div class="instructions-box mt-4 text-left">
		<h4 class="font-bold text-solar-green-dark mb-3">📋 INSTRUCCIONES DEL SIMULADOR:</h4>
		<ul class="solar-bullets flex flex-col gap-3">
			{#each instructions as bullet}
				<li>{@html bullet}</li>
			{/each}
		</ul>
	</div>

	<button type="button" class="btn-solar-primary mt-8 justify-center w-full animate-solar-pulse" onclick={onStart}>
		🧠 Iniciar Simulador
	</button>
</div>

<style>
	.intro-screen {
		max-width: 680px;
		margin: 0 auto;
		text-align: center;
		box-sizing: border-box;
	}

	.agency-tag {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-sky, #0369a1);
		background: var(--color-solar-sky-light, #e0f2fe);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.font-bold {
		font-weight: 800;
	}

	.text-solar-green-dark {
		color: var(--color-solar-green-dark, #1e4533);
	}

	/* Instruction card styling from World 2 (yellow glassmorphic) */
	.instructions-box {
		background: var(--color-solar-yellow-light, #fffcf4);
		border: 1.5px solid rgba(255, 209, 102, 0.4);
		padding: 1.75rem;
		border-radius: 16px;
		box-shadow: 
			0 10px 25px rgba(255, 209, 102, 0.08),
			inset 0 1px 3px rgba(255, 255, 255, 0.9);
		box-sizing: border-box;
	}

	.instructions-box h4 {
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		margin: 0 0 1rem 0;
	}

	.solar-bullets {
		margin: 0;
		padding-left: 0;
		list-style: none;
	}

	.solar-bullets li {
		position: relative;
		padding-left: 1.5rem;
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--color-solar-text, #374151);
	}

	.solar-bullets li::before {
		content: '⚡';
		position: absolute;
		left: 0;
		top: 2px;
		font-size: 0.85rem;
	}

	.flex { display: flex; }
	.flex-col { flex-direction: column; }
	.gap-3 { gap: 0.75rem; }
	.justify-center { justify-content: center; }
	.w-full { width: 100%; }
	.mt-4 { margin-top: 1rem; }
	.mt-8 { margin-top: 2rem; }
	.mb-6 { margin-bottom: 1.5rem; }
</style>
