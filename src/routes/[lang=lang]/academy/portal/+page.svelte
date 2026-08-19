<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const lang = $derived((page.params.lang as 'es' | 'en') ?? 'es');

	let classCode = $state('');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>{lang === 'es' ? 'Portal de Acceso | Academia OMIE' : 'Access Portal | OMIE Academy'}</title>
</svelte:head>

<div class="portal-page-wrapper flex items-center justify-center min-h-screen">
	<!-- Solarpunk glow rays -->
	<div class="solar-glow-bg"></div>

	<div class="portal-card glass-card" in:fly={{ y: 40, duration: 500 }}>
		<div class="portal-header">
			<div class="giochi-avatar-container animate-float">
				<div class="giochi-bot">
					<div class="giochi-eyes">
						<div class="eye"></div>
						<div class="eye"></div>
					</div>
					<div class="giochi-body"></div>
					<div class="giochi-antenna"></div>
				</div>
			</div>

			<span class="agency-tag">OMIE CENTRAL • ACADEMIA</span>
			<h1>{lang === 'es' ? 'Portal de Acceso al Curso' : 'Course Access Portal'}</h1>
			<p class="subtitle">
				{#if lang === 'es'}
					Ingresa el código oficial de tu clase para acceder a tus misiones gamificadas y workshops en vivo.
				{:else}
					Enter your official class code to access gamified missions and live workshops.
				{/if}
			</p>
		</div>

		<!-- Speech notification from GIOCHI -->
		<div class="giochi-speech-bubble" in:fade={{ delay: 200 }}>
			<div class="bubble-title">🤖 GIOCHI dice:</div>
			<p>
				{#if lang === 'es'}
					¡Saludos! Para sincronizar tu dispositivo y cargar tu bitácora de misiones, digita el código que te entregó tu mentor o facilitador.
				{:else}
					Greetings! To synchronize your device and load your mission log, type the code provided by your mentor or facilitator.
				{/if}
			</p>
		</div>

		{#if form && !form.success}
			<div class="status-alert error" in:fade>
				<p>⚠️ {form.message}</p>
			</div>
		{/if}

		<form
			method="POST"
			action="?/submitCode"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					await update();
				};
			}}
			class="portal-form"
		>
			<div class="form-group">
				<label for="code">
					{lang === 'es' ? 'Código de Clase o Módulo' : 'Class or Module Code'}
				</label>
				<input
					type="text"
					id="code"
					name="code"
					required
					bind:value={classCode}
					class="subject-input uppercase"
					disabled={isLoading}
					autocomplete="off"
					spellcheck="false"
				/>
				<span class="input-tip">
					{lang === 'es' 
						? 'El código no distingue mayúsculas de minúsculas ni espacios.' 
						: 'Code is case-insensitive.'}
				</span>
			</div>

			<button
				type="submit"
				class="btn-solar-primary w-full justify-center mt-4"
				disabled={isLoading || !classCode.trim()}
			>
				{#if isLoading}
					<span class="solar-spinner mr-2"></span>
					{lang === 'es' ? 'Verificando Código...' : 'Verifying Code...'}
				{:else}
					{lang === 'es' ? '🚀 Acceder al Curso' : '🚀 Access Course'}
				{/if}
			</button>
		</form>

		<div class="contact-box mt-8">
			<h4>{lang === 'es' ? '¿No tienes un código de clase?' : 'Don\'t have a class code?'}</h4>
			<p>
				{#if lang === 'es'}
					Las misiones de la Academia OMIE se habilitan mediante enlaces e invitaciones creadas por facilitadores autorizados. Si eres estudiante, solicita el enlace a tu profesor o mentor.
				{:else}
					OMIE Academy missions are unlocked via invitations created by authorized facilitators. If you are a student, ask your instructor or mentor for your class link.
				{/if}
			</p>
			<a href="/{lang}/learning" class="back-link">
				{lang === 'es' ? '⬅ Explorar la Arquitectura Pedagógica' : '⬅ Explore Pedagogical Architecture'}
			</a>
		</div>
	</div>
</div>

<style>
	.portal-page-wrapper {
		background-color: var(--color-solar-bg, #FAF9F6);
		position: relative;
		overflow-y: auto;
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1.25rem;
		box-sizing: border-box;
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

	.portal-card {
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
	}

	.portal-header {
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

	.portal-header h1 {
		font-family: var(--font-solar-header, sans-serif);
		font-size: 1.85rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1E4533);
		margin: 0 0 0.5rem;
	}

	.subtitle {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
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

	.giochi-speech-bubble {
		background: var(--color-solar-yellow-light, #fff9e6);
		border: 1px solid rgba(255, 209, 102, 0.4);
		padding: 1rem 1.25rem;
		border-radius: 16px;
		margin-bottom: 2rem;
		position: relative;
		box-shadow: var(--shadow-solar-sm);
		text-align: left;
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

	.portal-form {
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
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--color-solar-green-dark);
		background: rgba(255, 255, 255, 0.65);
		border: 2px solid rgba(61, 143, 104, 0.2);
		border-radius: var(--radius-solar-sm, 12px);
		padding: 0.85rem 1rem;
		outline: none;
		transition: all 0.3s ease;
	}

	.subject-input.uppercase {
		text-transform: uppercase;
	}

	.subject-input:focus:not(:disabled) {
		background: #ffffff;
		border-color: var(--color-solar-green-medium);
		box-shadow: 
			0 0 0 4px rgba(61, 143, 104, 0.12),
			var(--shadow-solar-sm);
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
		text-align: left;
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

	.contact-box {
		border-top: 1px solid var(--color-solar-card-border);
		padding-top: 1.5rem;
		text-align: center;
	}

	.contact-box h4 {
		font-family: var(--font-solar-header);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-solar-green-dark);
		margin: 0 0 0.5rem;
	}

	.contact-box p {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		line-height: 1.4;
		margin: 0 0 1rem;
	}

	.back-link {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-solar-green-medium);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-solar-green-dark);
		text-decoration: underline;
	}
</style>
