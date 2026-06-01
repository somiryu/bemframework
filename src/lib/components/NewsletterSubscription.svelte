<script lang="ts">
	import { gameState, gameActions } from '$lib/gameStore';
	import { fade, slide } from 'svelte/transition';

	let { lang = 'en' }: { lang?: 'en' | 'es' } = $props();

	// Local states
	let email = $state('');
	let honeypot = $state(''); // Hidden field to trap spam bots
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let responseMessage = $state('');

	const alreadySubscribedXp = $derived(
		$gameState.xpHistory.some((h) => h.reason === 'newsletter_subscription')
	);

	const t = $derived({
		en: {
			title: 'Join the Vanguard of Behavior Design',
			desc: 'Subscribe to our newsletter to receive strategic insights, exclusive tools, and BEM systemic gamification case studies.',
			placeholder: 'Your professional email',
			btnSubscribe: 'Subscribe to Newsletter',
			btnLoading: 'Securing Connection...',
			successTitle: 'Welcome to the Loop!',
			successText: 'Successfully subscribed! You have unlocked your intrinsic reward of +50 XP! Keep exploring.',
			errorTitle: 'Submission Error',
			alreadyHaveXp: '⭐ You have already claimed your +50 XP for subscribing!'
		},
		es: {
			title: 'Únete a la Vanguardia del Diseño',
			desc: 'Suscríbete para recibir artículos científicos, herramientas exclusivas y casos de estudio sobre gamificación sistémica BEM.',
			placeholder: 'Tu correo electrónico profesional',
			btnSubscribe: 'Suscribirme al Newsletter',
			btnLoading: 'Asegurando Conexión...',
			successTitle: '¡Bienvenido al Bucle!',
			successText: '¡Suscripción exitosa! Has desbloqueado tu recompensa intrínseca de +50 XP. Sigue explorando.',
			errorTitle: 'Error de Suscripción',
			alreadyHaveXp: '⭐ ¡Ya has reclamado tus +50 XP por suscribirte!'
		}
	}[lang]);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!email.trim() || status === 'loading') return;

		status = 'loading';
		responseMessage = '';

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					honeypot: honeypot.trim()
				})
			});

			const data = await res.json();

			if (res.ok && data.success) {
				status = 'success';
				responseMessage = data.message;
				
				// Award +50 XP only if not already awarded
				if (!alreadySubscribedXp) {
					gameActions.addXP(50, 'newsletter_subscription');
				}
				email = '';
			} else {
				status = 'error';
				responseMessage = data.message || t.errorTitle;
			}
		} catch (err) {
			console.error('Subscription form submit error:', err);
			status = 'error';
			responseMessage = lang === 'es' 
				? 'Error de conexión. Inténtalo de nuevo más tarde.' 
				: 'Connection error. Please try again later.';
		}
	}
</script>

<div class="newsletter-subscription-box" class:success-active={status === 'success'}>
	<div class="glow-layer"></div>
	<div class="box-content">
		{#if status === 'success'}
			<div class="success-view" in:fade={{ duration: 300 }}>
				<div class="success-icon">✨ ✉️ ✨</div>
				<h3 class="success-title">{t.successTitle}</h3>
				<p class="success-desc">{responseMessage}</p>
				<p class="xp-banner">{t.successText}</p>
				
				<div class="xp-pill animate-bounce">
					+50 XP
				</div>
			</div>
		{:else}
			<div class="form-view">
				<div class="envelope-badge">✉️ NEWSLETTER</div>
				<h3 class="box-title">{t.title}</h3>
				<p class="box-desc">{t.desc}</p>

				{#if alreadySubscribedXp}
					<span class="xp-earned-badge" in:fade>{t.alreadyHaveXp}</span>
				{/if}

				<form onsubmit={handleSubmit} class="subscription-form">
					<!-- HONEYPOT FIELD: Invisibly styled for screen readers and hidden to users -->
					<div class="hidden-field" aria-hidden="true">
						<input
							type="text"
							name="b_username"
							bind:value={honeypot}
							tabindex="-1"
							autocomplete="off"
							placeholder="Spam bot trap"
						/>
					</div>

					<div class="input-wrapper">
						<input
							type="email"
							bind:value={email}
							placeholder={t.placeholder}
							required
							disabled={status === 'loading'}
							class="email-input"
						/>
						<button 
							type="submit" 
							disabled={status === 'loading'}
							class="subscribe-btn"
							class:loading={status === 'loading'}
						>
							{#if status === 'loading'}
								<span class="spinner"></span>
								{t.btnLoading}
							{:else}
								{t.btnSubscribe}
							{/if}
						</button>
					</div>

					{#if status === 'error'}
						<div class="error-banner" in:slide>
							<span>⚠️</span> {responseMessage}
						</div>
					{/if}
				</form>
			</div>
		{/if}
	</div>
</div>

<style>
	.newsletter-subscription-box {
		position: relative;
		background: linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(10, 10, 10, 0.9) 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-lg);
		padding: 3rem 2.5rem;
		margin: 4rem auto 2rem;
		max-width: 800px;
		overflow: hidden;
		box-shadow: var(--shadow-xl), 
		            0 0 25px rgba(124, 58, 237, 0.05),
		            inset 0 1px 0 rgba(255, 255, 255, 0.05);
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
	}

	.newsletter-subscription-box.success-active {
		border-color: rgba(34, 197, 94, 0.35);
		box-shadow: var(--shadow-xl), 
		            0 0 35px rgba(34, 197, 94, 0.15),
		            inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.glow-layer {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%);
		pointer-events: none;
		z-index: 0;
	}

	.newsletter-subscription-box.success-active .glow-layer {
		background: radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%);
	}

	.box-content {
		position: relative;
		z-index: 2;
	}

	.envelope-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		background: rgba(124, 58, 237, 0.1);
		color: var(--color-purple);
		border: 1px solid rgba(124, 58, 237, 0.2);
		padding: 0.35rem 0.85rem;
		border-radius: var(--radius-sm);
		margin-bottom: 1.25rem;
	}

	.box-title {
		font-size: 2.1rem;
		font-weight: 850;
		line-height: 1.2;
		color: white;
		margin: 0 0 0.75rem;
		letter-spacing: -0.02em;
	}

	.box-desc {
		font-size: 1.05rem;
		color: var(--color-text-muted);
		margin: 0 0 2rem;
		line-height: 1.6;
	}

	.xp-earned-badge {
		display: block;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-green);
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.15);
		padding: 0.5rem 1rem;
		border-radius: var(--radius-sm);
		margin-bottom: 1.5rem;
	}

	/* FORM STYLES */
	.subscription-form {
		width: 100%;
	}

	.hidden-field {
		position: absolute;
		left: -5000px;
		top: -5000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
	}

	.input-wrapper {
		display: flex;
		gap: 1rem;
		width: 100%;
	}

	@media (max-width: 650px) {
		.input-wrapper {
			flex-direction: column;
		}
	}

	.email-input {
		flex: 1;
		background: rgba(0, 0, 0, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		padding: 1rem 1.25rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: var(--radius-md);
		transition: all 0.25s ease;
	}

	.email-input:focus {
		outline: none;
		border-color: var(--color-purple);
		background: rgba(0, 0, 0, 0.5);
		box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15);
	}

	.email-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.subscribe-btn {
		background: linear-gradient(135deg, var(--color-purple) 0%, #6d28d9 100%);
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 800;
		border-radius: var(--radius-md);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
		transition: all 0.25s ease;
		white-space: nowrap;
	}

	.subscribe-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(124, 58, 237, 0.35);
		filter: brightness(1.1);
	}

	.subscribe-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.error-banner {
		margin-top: 1.25rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.25);
		color: #f87171;
		font-weight: 700;
		font-size: 0.9rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* SUCCESS VIEW STYLES */
	.success-view {
		text-align: center;
		padding: 1rem 0;
	}

	.success-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-title {
		font-size: 2.2rem;
		font-weight: 850;
		color: white;
		margin: 0 0 1rem;
		letter-spacing: -0.015em;
	}

	.success-desc {
		font-size: 1.15rem;
		color: #4ade80;
		font-weight: 750;
		margin: 0 0 1.25rem;
	}

	.xp-banner {
		font-size: 1.05rem;
		color: var(--color-text-muted);
		max-width: 550px;
		margin: 0 auto var(--space-xl);
		line-height: 1.6;
		font-weight: 550;
	}

	.xp-pill {
		display: inline-block;
		background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
		color: white;
		font-weight: 850;
		font-size: 1.15rem;
		padding: 0.6rem 1.75rem;
		border-radius: var(--radius-full);
		box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
		border: 2px solid white;
	}

	/* CSS Spinner */
	.spinner {
		width: 18px;
		height: 18px;
		border: 2.5px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: translateY(-8px);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
