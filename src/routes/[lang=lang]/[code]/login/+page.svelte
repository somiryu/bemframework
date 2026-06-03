<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { learnTranslations } from '$lib/content/learn';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const lang = $derived((page.params.lang as 'es' | 'en') ?? 'es');
	const t = $derived(learnTranslations[lang].login);

	let email = $state('');
	let name = $state('');
	let alias = $state('');
	let isLoading = $state(false);

	let emailChecked = $state(false);

	$effect(() => {
		if (form && form.success && form.exists === false) {
			emailChecked = true;
			if (form.email) {
				email = form.email;
			}
		} else {
			emailChecked = false;
		}
	});

	function handleResetEmail() {
		emailChecked = false;
		email = '';
		if (form) {
			form.success = false;
			form.exists = undefined;
			form.email = undefined;
			form.message = undefined;
		}
	}
</script>

<svelte:head>
	<title>{t.pageTitle}</title>
</svelte:head>

<div class="login-page-wrapper flex items-center justify-center min-h-screen">
	<!-- Background Solarpunk Sun Rays Decor -->
	<div class="solar-glow-bg"></div>
	
	{#if !data.valid}
		<!-- INVALID CLASS CODE ERROR PAGE -->
		<div class="error-card glass-card text-center" in:fly={{ y: 30, duration: 400 }}>
			<div class="error-badge">⚠️</div>
			<h2>{t.invalidTitle}</h2>
			<p class="error-message">{data.message}</p>
			
			<div class="contact-mentor-box mt-6">
				<p class="text-sm">{t.contactMentor}</p>
			</div>
			
			<a href="/{lang}" class="btn-solar-secondary mt-6">
				{t.goHome}
			</a>
		</div>
	{:else}
		<!-- VALID CLASS CODE: ONBOARDING SCREEN -->
		<div class="onboarding-card glass-card" in:fly={{ y: 40, duration: 500 }}>
			<div class="onboarding-header">
				<div class="giochi-avatar-container animate-float">
					<!-- GIOCHI AI Bot Illustration via CSS -->
					<div class="giochi-bot">
						<div class="giochi-eyes">
							<div class="eye"></div>
							<div class="eye"></div>
						</div>
						<div class="giochi-body"></div>
						<div class="giochi-antenna"></div>
					</div>
				</div>
				
				<span class="agency-tag">{t.agencyTag}</span>
				<h1>{t.agentRegistration}</h1>
				<p class="subtitle">
					{#if lang === 'es'}
						¡Bip-bop! Código de clase <strong class="code-highlight">{data.code}</strong> detectado con éxito.
					{:else}
						Bip-bop! Class code <strong class="code-highlight">{data.code}</strong> successfully detected.
					{/if}
				</p>
			</div>

			<!-- GIOCHI Greeting Notification -->
			<div class="giochi-speech-bubble" in:fade={{ delay: 200 }}>
				<div class="bubble-title">{t.giochiSpeechTitle}</div>
				<p>{t.giochiGreeting}</p>
			</div>

			{#if form && !form.success}
				<div class="status-alert error" in:fade>
					<p>⚠️ {form.message}</p>
				</div>
			{/if}

			<form 
				method="POST" 
				action={emailChecked ? "?/registerPlayer" : "?/checkEmail"} 
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						isLoading = false;
						await update();
					};
				}}
				class="onboarding-form"
			>
				{#if !emailChecked}
					<div class="form-group">
						<label for="email">{t.emailLabel}</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							bind:value={email}
							placeholder={t.emailPlaceholder}
							class="subject-input"
							disabled={isLoading}
						/>
						<span class="input-tip">{t.emailTip}</span>
					</div>

					<button 
						type="submit" 
						class="btn-solar-primary w-full justify-center mt-6"
						disabled={isLoading}
					>
						{#if isLoading}
							<span class="solar-spinner mr-2"></span>
							{t.submitting}
						{:else}
							{t.checkEmailBtn}
						{/if}
					</button>
				{:else}
					<div class="form-group">
						<label for="email_display">{t.emailLabel}</label>
						<div style="display: flex; gap: 0.75rem; align-items: center;">
							<input
								type="email"
								id="email_display"
								value={email}
								disabled
								class="subject-input"
								style="flex: 1; background: rgba(0,0,0,0.05); color: var(--color-solar-text-muted);"
							/>
							<button 
								type="button" 
								class="btn-solar-secondary" 
								style="padding: 0.85rem 1rem;"
								onclick={handleResetEmail}
								disabled={isLoading}
							>
								✏️ {t.changeEmailBtn}
							</button>
						</div>
						<input type="hidden" name="email" value={email} />
					</div>

					<div class="form-group">
						<label for="name">{t.nameLabel}</label>
						<input
							type="text"
							id="name"
							name="name"
							required
							bind:value={name}
							placeholder={t.namePlaceholder}
							class="subject-input"
							disabled={isLoading}
						/>
					</div>

					<div class="form-group">
						<label for="alias">{t.aliasLabel}</label>
						<input
							type="text"
							id="alias"
							name="alias"
							required
							bind:value={alias}
							placeholder={t.aliasPlaceholder}
							class="subject-input"
							disabled={isLoading}
						/>
						<span class="input-tip">{t.aliasTip}</span>
					</div>

					<button 
						type="submit" 
						class="btn-solar-primary w-full justify-center mt-6"
						disabled={isLoading}
					>
						{#if isLoading}
							<span class="solar-spinner mr-2"></span>
							{t.submitting}
						{:else}
							{t.submit}
						{/if}
					</button>
				{/if}
			</form>
		</div>
	{/if}
</div>

<style>
	.login-page-wrapper {
		background-color: var(--color-solar-bg, #FAF9F6);
		position: relative;
		overflow-y: auto;
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1.25rem;
	}

	.solar-glow-bg {
		position: absolute;
		inset: 0;
		background: 
			radial-gradient(circle at 15% 15%, rgba(255, 209, 102, 0.22) 0%, transparent 50%),
			radial-gradient(circle at 85% 85%, rgba(24, 141, 181, 0.15) 0%, transparent 60%),
			radial-gradient(circle at 50% 50%, rgba(210, 245, 227, 0.25) 0%, transparent 75%);
		z-index: 1;
		pointer-events: none;
		filter: blur(20px);
	}

	.onboarding-card {
		position: relative;
		z-index: 10;
		max-width: 500px;
		width: 100%;
		padding: 3rem 2.5rem;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: var(--radius-solar-lg, 32px);
		box-shadow: 
			0 8px 32px rgba(30, 69, 51, 0.04),
			var(--shadow-solar-lg);
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
	}

	.onboarding-card:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 12px 40px rgba(30, 69, 51, 0.07),
			var(--shadow-solar-lg);
	}

	.error-card {
		position: relative;
		z-index: 10;
		max-width: 460px;
		width: 100%;
		padding: 3rem 2rem;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 24px;
		box-shadow: var(--shadow-solar-lg);
	}

	.error-badge {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.error-message {
		font-weight: 600;
		color: hsl(20, 70%, 50%);
		line-height: 1.5;
	}

	.contact-mentor-box {
		background: var(--color-solar-bg);
		border: 1px solid rgba(0,0,0,0.05);
		padding: 1rem;
		border-radius: 12px;
		color: var(--color-solar-text-muted);
	}

	.onboarding-header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.agency-tag {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--color-solar-green-medium, #3D8F68);
		background: var(--color-solar-green-light, #d2f5e3);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		margin-bottom: 0.75rem;
	}

	.onboarding-header h1 {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.85rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1E4533);
		margin: 0 0 0.25rem;
	}

	.subtitle {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		margin: 0;
	}

	.code-highlight {
		color: var(--color-solar-sky, #188db5);
		font-weight: 800;
	}

	/* GIOCHI BOT GRAPHICAL ILLUSTRATION */
	.giochi-avatar-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.giochi-bot {
		width: 70px;
		height: 60px;
		background: var(--color-solar-sky-light, #e1f4fc);
		border: 3px solid var(--color-solar-sky, #188db5);
		border-radius: 20px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.giochi-eyes {
		display: flex;
		gap: 0.5rem;
	}

	.giochi-eyes .eye {
		width: 14px;
		height: 14px;
		background: var(--color-solar-green-dark, #1e4533);
		border-radius: 50%;
		border: 2px solid white;
		position: relative;
	}

	.giochi-eyes .eye::after {
		content: '';
		width: 4px;
		height: 4px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
	}

	.giochi-body {
		width: 36px;
		height: 8px;
		background: var(--color-solar-yellow, #ffd166);
		border-radius: 4px;
		position: absolute;
		bottom: -4px;
		border: 2px solid var(--color-solar-sky, #188db5);
	}

	.giochi-antenna {
		width: 4px;
		height: 12px;
		background: var(--color-solar-sky, #188db5);
		position: absolute;
		top: -12px;
		border-radius: 2px;
	}

	.giochi-antenna::before {
		content: '';
		width: 10px;
		height: 10px;
		background: var(--color-solar-yellow, #ffd166);
		border-radius: 50%;
		position: absolute;
		top: -8px;
		left: -3px;
		box-shadow: 0 0 8px var(--color-solar-yellow, #ffd166);
	}

	/* GIOCHI SPEECH BUBBLE */
	.giochi-speech-bubble {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.4);
		padding: 1rem 1.25rem;
		border-radius: 16px;
		margin-bottom: 2rem;
		position: relative;
		box-shadow: var(--shadow-solar-sm);
	}

	.bubble-title {
		font-weight: 800;
		font-size: 0.85rem;
		color: var(--color-solar-green-dark);
		margin-bottom: 0.25rem;
	}

	.giochi-speech-bubble p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		font-weight: 600;
		color: var(--color-solar-text);
	}

	/* SPEECH BUBBLE TAIL */
	.giochi-speech-bubble::before {
		content: '';
		position: absolute;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 0 10px 10px 10px;
		border-style: solid;
		border-color: transparent transparent var(--color-solar-yellow-light, #fff9e6) transparent;
	}

	/* ONBOARDING FORM */
	.onboarding-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		text-align: left;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.form-group label {
		font-family: var(--font-solar-header, sans-serif);
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
	}

	.subject-input {
		font-family: var(--font-solar-body, sans-serif);
		font-size: 0.95rem;
		font-weight: 550;
		color: var(--color-solar-text);
		background: rgba(255, 255, 255, 0.65);
		border: 2px solid rgba(61, 143, 104, 0.15);
		border-radius: var(--radius-solar-sm, 12px);
		padding: 0.85rem 1rem;
		outline: none;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);
	}

	.subject-input::placeholder {
		color: var(--color-solar-text-muted);
		opacity: 0.6;
	}

	.subject-input:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(61, 143, 104, 0.35);
	}

	.subject-input:focus:not(:disabled) {
		background: #ffffff;
		border-color: var(--color-solar-green-medium);
		box-shadow: 
			0 0 0 4px rgba(61, 143, 104, 0.12),
			var(--shadow-solar-sm);
	}

	/* User-valid & User-invalid instant response state hooks */
	.subject-input:user-valid:not(:placeholder-shown) {
		border-color: var(--color-solar-green-medium);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233d8f68' width='18' height='18'%3E%3Cpath d='M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		padding-right: 2.5rem;
	}

	.subject-input:user-invalid {
		border-color: var(--color-solar-terracotta);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e07a5f' width='18' height='18'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13v2h-2v-2zm0-8h2v6h-2V7z'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		padding-right: 2.5rem;
	}

	.subject-input:disabled {
		opacity: 0.6;
		background: rgba(0, 0, 0, 0.03);
		border-color: rgba(0, 0, 0, 0.08);
		cursor: not-allowed;
	}

	.input-tip {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted);
		font-weight: 550;
	}

	.status-alert.error {
		background: #fee2e2;
		border: 1px solid #fecaca;
		color: #b91c1c;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.solar-spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
