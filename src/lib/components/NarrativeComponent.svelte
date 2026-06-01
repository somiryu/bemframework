<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { resolveCharacterByName, locationRegistry, characterRegistry } from '$lib/content/characters';

	interface DialogueStep {
		character?: string;
		characterKey?: string;
		imageType?: string;
		locationKey?: string;
		location?: string;
		text: string;
	}

	let { 
		dialogue = [], 
		onComplete 
	}: { 
		dialogue: DialogueStep[]; 
		onComplete: () => void 
	} = $props();

	let currentStep = $state(0);
	let displayedText = $state('');
	let isTypewriterFinished = $state(false);
	let intervalId: any = null;

	const activeStepData = $derived(dialogue[currentStep] || null);

	const resolvedLocation = $derived.by(() => {
		if (!activeStepData) return null;
		const key = activeStepData.locationKey || activeStepData.location;
		if (key && locationRegistry[key]) {
			return locationRegistry[key];
		}
		return null;
	});

	const resolvedCharacter = $derived.by(() => {
		if (!activeStepData) return null;
		// If there is a location image, we don't display the character!
		if (resolvedLocation) return null;
		
		if (activeStepData.characterKey && characterRegistry[activeStepData.characterKey]) {
			return characterRegistry[activeStepData.characterKey];
		}
		return resolveCharacterByName(activeStepData.character || '');
	});

	let persistedLocation = $state<any>(null);

	$effect(() => {
		if (resolvedLocation) {
			persistedLocation = resolvedLocation;
		}
	});

	// Start typewriter effect
	function runTypewriter(text: string) {
		clearInterval(intervalId);
		displayedText = '';
		isTypewriterFinished = false;
		
		let index = 0;
		// Simple HTML tag strip and print to avoid breaking tags mid-typewriter
		// For safety and smooth rendering, we do a character interval.
		// If it hits a tag '<', we skip until '>' to print formatting instantly!
		intervalId = setInterval(() => {
			if (index < text.length) {
				if (text[index] === '<') {
					const closeIndex = text.indexOf('>', index);
					if (closeIndex !== -1) {
						displayedText += text.substring(index, closeIndex + 1);
						index = closeIndex + 1;
						return;
					}
				}
				displayedText += text[index];
				index++;
			} else {
				clearInterval(intervalId);
				isTypewriterFinished = true;
			}
		}, 20); // 20ms per character - super fluid!
	}

	function handleNext() {
		if (!isTypewriterFinished) {
			// Skip typewriter, show full text immediately
			clearInterval(intervalId);
			displayedText = dialogue[currentStep].text;
			isTypewriterFinished = true;
			return;
		}

		if (currentStep < dialogue.length - 1) {
			currentStep++;
			runTypewriter(dialogue[currentStep].text);
		} else {
			clearInterval(intervalId);
			onComplete();
		}
	}

	function handleSkip() {
		clearInterval(intervalId);
		onComplete();
	}

	onMount(() => {
		if (dialogue.length > 0) {
			runTypewriter(dialogue[currentStep].text);
		} else {
			onComplete();
		}
		return () => clearInterval(intervalId);
	});
</script>

{#if dialogue.length > 0}
	<div 
		class="narrative-overlay" 
		transition:fade 
		style={persistedLocation ? `background-image: linear-gradient(rgba(30, 69, 51, 0.45), rgba(30, 69, 51, 0.75)), url('${persistedLocation.images.base}'); background-size: cover; background-position: center;` : ''}
	>
		<div class="narrative-container glass-card" in:fly={{ y: 50, duration: 500 }}>
			<!-- CHARACTER/LOCATION VIEWPORTS -->
			<div class="character-viewport">
				{#if resolvedLocation}
					<div class="location-holder" in:fade>
						<img src={resolvedLocation.images.base} alt={resolvedLocation.name} class="location-img" />
					</div>

					<div class="identity-badge mt-2">
						<span class="character-title">📍 LOCACIÓN</span>
						<h3 class="character-name">{resolvedLocation.name}</h3>
					</div>
				{:else if resolvedCharacter}
					<div class="avatar-holder premium-avatar" in:fade>
						<img src={resolvedCharacter.images[activeStepData.imageType || 'base']} alt={resolvedCharacter.name} class="character-img" />
					</div>

					<div class="identity-badge">
						<span class="character-title">MENTOR OMIE</span>
						<h3 class="character-name">{resolvedCharacter.name}</h3>
					</div>
				{:else}
					<div class="avatar-holder">
						{#if dialogue[currentStep].character === 'GIOCHI'}
							<!-- VECTOR GIOCHI (Blinking bot) -->
							<div class="giochi-bot-portrait" in:fade>
								<div class="bot-head animate-float">
									<div class="bot-antenna"></div>
									<div class="bot-eyes">
										<div class="eye blinking"></div>
										<div class="eye blinking"></div>
									</div>
									<div class="bot-mouth"></div>
								</div>
								<div class="bot-neck"></div>
								<div class="bot-wheels"></div>
							</div>
						{:else if dialogue[currentStep].character === 'Sara Arbelaez'}
							<!-- VECTOR SARA (Kind Psychologist) -->
							<div class="mentor-portrait sara" in:fade>
								<div class="mentor-head">
									<div class="glasses green"></div>
									<div class="wreath">✿</div>
									<div class="smile"></div>
								</div>
								<div class="mentor-shoulders"></div>
							</div>
						{:else if dialogue[currentStep].character === 'John Wilkins'}
							<!-- VECTOR JOHN (Strict Mechanist) -->
							<div class="mentor-portrait john" in:fade>
								<div class="mentor-head">
									<div class="glasses monocle"></div>
									<div class="hair gray"></div>
									<div class="strict-mouth"></div>
								</div>
								<div class="mentor-shoulders"></div>
							</div>
						{:else if dialogue[currentStep].character === 'Kira Yamada'}
							<!-- VECTOR KIRA (Purpose Architect) -->
							<div class="mentor-portrait kira" in:fade>
								<div class="mentor-head">
									<div class="hair black"></div>
									<div class="crown yellow">👑</div>
									<div class="focused-eyes"></div>
								</div>
								<div class="mentor-shoulders"></div>
							</div>
						{/if}
					</div>

					<div class="identity-badge">
						<span class="character-title">MENTOR OMIE</span>
						<h3 class="character-name">{dialogue[currentStep].character || 'GIOCHI'}</h3>
					</div>
				{/if}
			</div>

			<!-- DIALOGUE CONTENT -->
			<div class="dialogue-box">
				<div class="speech-content typewriter-cursor">
					{@html displayedText}
				</div>
				
				<div class="navigation-controls">
					<button type="button" class="btn-skip" onclick={handleSkip}>
						Omitir escena ⏩
					</button>
					<button type="button" class="btn-solar-primary" onclick={handleNext}>
						{#if currentStep === dialogue.length - 1 && isTypewriterFinished}
							Comenzar Aventura 🌱
						{:else}
							Continuar ➜
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.narrative-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.4);
		backdrop-filter: blur(12px);
		z-index: 99999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overflow-y: auto;
	}

	.narrative-container {
		max-width: 820px;
		width: 100%;
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		padding: 2.5rem;
		background: rgba(255, 255, 255, 0.95);
		border-radius: var(--radius-solar-lg, 32px);
		border: 1px solid rgba(61, 143, 104, 0.2);
		box-shadow: var(--shadow-solar-lg);
		max-height: 90vh;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.narrative-container {
			grid-template-columns: 1fr;
			padding: 1.5rem;
			gap: 1.5rem;
		}
	}

	/* CHARACTER PORTRAIT PORT */
	.character-viewport {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--color-solar-bg, #FAF9F6);
		border-radius: var(--radius-solar-md, 20px);
		padding: 1.5rem;
		border: 1px solid var(--color-solar-card-border);
		text-align: center;
	}

	.avatar-holder {
		width: 160px;
		height: 160px;
		background: white;
		border-radius: 50%;
		border: 4px solid var(--color-solar-green-medium);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		box-shadow: var(--shadow-solar-sm);
		margin-bottom: 1.25rem;
		position: relative;
	}

	.identity-badge {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.character-title {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.1em;
	}

	.character-name {
		font-family: var(--font-solar-header);
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	/* VECTOR PORTRAITS SPECIFICS */
	/* GIOCHI Bot */
	.giochi-bot-portrait {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.bot-head {
		width: 80px;
		height: 64px;
		background: var(--color-solar-sky-light, #e1f4fc);
		border: 3px solid var(--color-solar-sky, #188db5);
		border-radius: 18px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.bot-antenna {
		width: 4px;
		height: 10px;
		background: var(--color-solar-sky);
		position: absolute;
		top: -10px;
	}

	.bot-antenna::after {
		content: '';
		width: 8px;
		height: 8px;
		background: var(--color-solar-yellow);
		border-radius: 50%;
		position: absolute;
		top: -6px;
		left: -2px;
	}

	.bot-eyes {
		display: flex;
		gap: 8px;
	}

	.bot-eyes .eye {
		width: 18px;
		height: 18px;
		background: var(--color-solar-green-dark);
		border-radius: 50%;
		border: 2px solid white;
		position: relative;
	}

	.bot-eyes .eye::after {
		content: '';
		width: 4px;
		height: 4px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 3px;
		left: 3px;
	}

	@keyframes blink-eye {
		0%, 90%, 100% { transform: scaleY(1); }
		95% { transform: scaleY(0.1); }
	}

	.blinking {
		animation: blink-eye 4s infinite;
	}

	.bot-mouth {
		width: 16px;
		height: 4px;
		background: var(--color-solar-yellow);
		border-radius: 2px;
		margin-top: 8px;
	}

	.bot-neck {
		width: 20px;
		height: 8px;
		background: #cbd5e1;
		border-radius: 2px;
	}

	.bot-wheels {
		width: 60px;
		height: 14px;
		background: #475569;
		border-radius: 6px;
	}

	/* Mentors */
	.mentor-portrait {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		position: relative;
	}

	.mentor-head {
		width: 84px;
		height: 84px;
		border-radius: 50%;
		position: relative;
		border: 3px solid;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mentor-shoulders {
		width: 120px;
		height: 50px;
		border-radius: 32px 32px 0 0;
		border: 3px solid;
		border-bottom: none;
	}

	/* Sara (Green / Earthy Warm) */
	.sara .mentor-head {
		background: #fdf2f8;
		border-color: var(--color-solar-green-medium);
	}

	.sara .mentor-shoulders {
		background: var(--color-solar-green-light);
		border-color: var(--color-solar-green-medium);
	}

	.sara .glasses {
		position: absolute;
		width: 54px;
		height: 20px;
		border: 2.5px solid var(--color-solar-green-dark);
		border-radius: 4px;
		top: 36px;
		display: flex;
	}

	.sara .glasses::before, .sara .glasses::after {
		content: '';
		flex: 1;
		border: 2px solid var(--color-solar-green-dark);
		border-radius: 50%;
	}

	.sara .wreath {
		position: absolute;
		top: 4px;
		font-size: 1.5rem;
		color: #10b981;
	}

	.sara .smile {
		position: absolute;
		bottom: 12px;
		width: 24px;
		height: 12px;
		border-bottom: 3px solid var(--color-solar-green-dark);
		border-radius: 0 0 12px 12px;
	}

	/* John (Gray / Structural Blue) */
	.john .mentor-head {
		background: #f0fdfa;
		border-color: var(--color-solar-sky);
	}

	.john .mentor-shoulders {
		background: var(--color-solar-sky-light);
		border-color: var(--color-solar-sky);
	}

	.john .hair {
		position: absolute;
		top: 0px;
		width: 80px;
		height: 24px;
		background: #94a3b8;
		border-radius: 40px 40px 0 0;
	}

	.john .glasses {
		position: absolute;
		width: 24px;
		height: 24px;
		border: 3px solid var(--color-solar-green-dark);
		border-radius: 50%;
		top: 30px;
		left: 18px;
		box-shadow: inset 0 0 4px rgba(24, 141, 181, 0.4);
	}

	.john .strict-mouth {
		position: absolute;
		bottom: 18px;
		width: 20px;
		height: 3px;
		background: var(--color-solar-green-dark);
		border-radius: 2px;
	}

	/* Kira (Crown / Bold Red) */
	.kira .mentor-head {
		background: #fffbeb;
		border-color: var(--color-solar-terracotta);
	}

	.kira .mentor-shoulders {
		background: #ffedd5;
		border-color: var(--color-solar-terracotta);
	}

	.kira .hair {
		position: absolute;
		top: 0px;
		width: 84px;
		height: 48px;
		background: #1e293b;
		border-radius: 42px 42px 0 0;
	}

	.kira .crown {
		position: absolute;
		top: -18px;
		font-size: 1.3rem;
	}

	.kira .focused-eyes {
		position: absolute;
		width: 44px;
		height: 12px;
		border-bottom: 3px solid var(--color-solar-text);
		top: 32px;
	}

	/* DIALOGUE FRAME */
	.dialogue-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 1rem;
	}

	.speech-content {
		font-size: 1.15rem;
		line-height: 1.7;
		font-weight: 550;
		color: var(--color-solar-text);
		min-height: 140px;
		max-height: 200px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.speech-content :global(strong) {
		color: var(--color-solar-green-dark);
		font-weight: 800;
	}

	.speech-content :global(span.highlight) {
		background: var(--color-solar-yellow-light);
		border-bottom: 2px dashed var(--color-solar-yellow);
		padding: 0 0.15rem;
	}

	.navigation-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.5rem;
		border-top: 1px solid var(--color-solar-card-border);
		padding-top: 1.25rem;
	}

	.btn-skip {
		background: transparent;
		border: none;
		color: var(--color-solar-text-muted);
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-skip:hover {
		color: var(--color-solar-text);
	}

	/* PREMIUM IMAGES & LOCATIONS */
	.premium-avatar {
		border-color: var(--color-solar-green-medium);
		background: linear-gradient(135deg, #ffffff, var(--color-solar-bg));
		box-shadow: 0 0 20px rgba(61, 143, 104, 0.25);
		transition: all 0.3s ease;
	}

	.character-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.location-holder {
		width: 100%;
		height: 160px;
		border-radius: var(--radius-solar-md, 20px);
		border: 3px solid var(--color-solar-green-medium);
		overflow: hidden;
		box-shadow: var(--shadow-solar-md);
		margin-bottom: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	.location-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: transform 0.5s ease;
	}

	.location-holder:hover .location-img {
		transform: scale(1.05);
	}
</style>
