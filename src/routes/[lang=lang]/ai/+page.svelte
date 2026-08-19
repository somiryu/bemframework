<!--
	SANCTIONED AI SURFACE: This is the only route/component in bem-svelte allowed to
	fetch('/api/ai'). Do not add chat widgets, bubbles, or AI calls anywhere else —
	all AI interaction must happen here, under the "BEM AI" tab.
-->
<script lang="ts">
	import { marked } from 'marked';
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const lang = $derived((page.params.lang as 'en' | 'es') ?? 'es');

	interface ChatMessage {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		is_fallback?: boolean;
	}

	type UseCaseId =
		| 'product_saas'
		| 'marketing_growth'
		| 'hr_culture'
		| 'education_lnd'
		| 'game_design'
		| 'compare_frameworks'
		| 'audit_existing'
		| 'explore';

	const useCases: { id: UseCaseId; icon: string; es: { label: string; desc: string }; en: { label: string; desc: string } }[] = [
		{
			id: 'product_saas',
			icon: '🚀',
			es: { label: 'Producto & SaaS', desc: 'Onboarding, activación, retención de usuarios' },
			en: { label: 'Product & SaaS', desc: 'Onboarding, activation, user retention' }
		},
		{
			id: 'marketing_growth',
			icon: '📈',
			es: { label: 'Marketing & Growth', desc: 'Lealtad de marca, campañas, engagement' },
			en: { label: 'Marketing & Growth', desc: 'Brand loyalty, campaigns, engagement' }
		},
		{
			id: 'hr_culture',
			icon: '🤝',
			es: { label: 'RR.HH. & Cultura', desc: 'Motivación de equipos, reconocimiento' },
			en: { label: 'HR & Culture', desc: 'Team motivation, recognition programs' }
		},
		{
			id: 'education_lnd',
			icon: '🎓',
			es: { label: 'Educación & Capacitación', desc: 'Cursos, talleres, formación corporativa' },
			en: { label: 'Education & Training', desc: 'Courses, workshops, corporate L&D' }
		},
		{
			id: 'game_design',
			icon: '🎮',
			es: { label: 'Diseño de Juegos', desc: 'Mecánicas, progresión, balance' },
			en: { label: 'Game Design', desc: 'Mechanics, progression, balance' }
		},
		{
			id: 'compare_frameworks',
			icon: '⚖️',
			es: { label: 'Comparar Frameworks', desc: 'BEM vs. Octalysis, PBL, MDA, SDT' },
			en: { label: 'Compare Frameworks', desc: 'BEM vs. Octalysis, PBL, MDA, SDT' }
		},
		{
			id: 'audit_existing',
			icon: '🔍',
			es: { label: 'Auditar algo existente', desc: 'Ya construí algo, evalúalo con BEM' },
			en: { label: 'Audit something existing', desc: 'I already built something, evaluate it with BEM' }
		},
		{
			id: 'explore',
			icon: '🧭',
			es: { label: 'Solo quiero explorar', desc: 'Sin objetivo específico todavía' },
			en: { label: 'Just exploring', desc: 'No specific goal yet' }
		}
	];

	let messages = $state<ChatMessage[]>(
		(data.messages || []).map((m: any) => ({
			id: m.id,
			role: m.role,
			content: m.content,
			is_fallback: m.is_fallback
		}))
	);

	let selectedUseCase = $state<UseCaseId | null>(data.useCaseId);
	const showUseCaseSelector = $derived(messages.length === 0 && !selectedUseCase);

	let inputValue = $state('');
	let isSending = $state(false);
	let errorMessage = $state<string | null>(null);
	let scrollAnchor = $state<HTMLElement | null>(null);

	$effect(() => {
		// Re-run whenever messages length changes, scroll the anchor into view.
		if (messages.length && scrollAnchor) {
			scrollAnchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	});

	function pickUseCase(id: UseCaseId) {
		selectedUseCase = id;
		const maxAge = 60 * 60 * 24 * 365;
		document.cookie = `bem_ai_use_case=${id}; path=/; max-age=${maxAge}; samesite=lax`;
	}

	function changeTopic() {
		selectedUseCase = null;
	}

	// Neutralize any raw HTML in the LLM output before handing it to marked, so
	// only markup that marked itself generates from markdown syntax ever renders.
	function renderMarkdown(content: string): string {
		const escaped = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return marked.parse(escaped, { breaks: true, async: false }) as string;
	}

	function buildContextHistory() {
		// Last 10 turns is plenty of context for Gemini without ballooning the payload.
		return messages.slice(-10).map((m) => ({
			role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
			parts: [{ text: m.content }]
		}));
	}

	async function sendMessage() {
		const text = inputValue.trim();
		if (!text || isSending) return;

		errorMessage = null;
		const contextHistory = buildContextHistory();

		messages = [...messages, { id: `local-${Date.now()}`, role: 'user', content: text }];
		inputValue = '';
		isSending = true;

		try {
			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text, contextHistory, lang, useCaseId: selectedUseCase })
			});

			if (res.status === 429) {
				const body = await res.json().catch(() => ({}));
				errorMessage =
					lang === 'es'
						? `Muchos mensajes seguidos. Intenta de nuevo en ${body.retryAfterSeconds ?? 60}s.`
						: `Too many messages. Try again in ${body.retryAfterSeconds ?? 60}s.`;
				return;
			}

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}

			const { reply } = await res.json();
			messages = [...messages, { id: `local-${Date.now()}-r`, role: 'assistant', content: reply }];
		} catch (err) {
			console.error('Error sending AI message:', err);
			errorMessage =
				lang === 'es'
					? 'No se pudo conectar con el Discípulo BEM. Reintenta.'
					: 'Could not reach the BEM Disciple. Please retry.';
		} finally {
			isSending = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function retry() {
		errorMessage = null;
		sendMessage();
	}
</script>

<SEO
	title={lang === 'es' ? 'BEM AI | Discípulo BEM' : 'BEM AI | BEM Disciple'}
	description={lang === 'es'
		? 'Chatea con el Discípulo BEM, el copiloto de IA conectado a la vault de conocimiento BEM.'
		: 'Chat with the BEM Disciple, the AI copilot connected to the BEM knowledge vault.'}
	{lang}
/>

<HeroSection
	title={lang === 'es' ? 'BEM AI' : 'BEM AI'}
	description={lang === 'es'
		? 'Tu copiloto de IA para explorar el Framework BEM, conectado a la vault de conocimiento.'
		: 'Your AI copilot for exploring the BEM Framework, connected to the knowledge vault.'}
/>

<section class="ai-chat-section">
	<div class="container">
		{#if showUseCaseSelector}
			<div class="use-case-panel">
				<h2>{lang === 'es' ? '¿Para qué vas a usar al Discípulo BEM hoy?' : 'What will you use the BEM Disciple for today?'}</h2>
				<p>{lang === 'es' ? 'Así puedo enfocar mis respuestas a tu contexto.' : 'This helps me tailor my answers to your context.'}</p>

				<div class="use-case-grid">
					{#each useCases as uc}
						<button type="button" class="use-case-card" onclick={() => pickUseCase(uc.id)}>
							<span class="uc-icon">{uc.icon}</span>
							<strong>{lang === 'es' ? uc.es.label : uc.en.label}</strong>
							<span class="uc-desc">{lang === 'es' ? uc.es.desc : uc.en.desc}</span>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div class="chat-panel card">
				{#if selectedUseCase}
					<div class="use-case-badge">
						<span>
							{useCases.find((u) => u.id === selectedUseCase)?.icon}
							{lang === 'es' ? useCases.find((u) => u.id === selectedUseCase)?.es.label : useCases.find((u) => u.id === selectedUseCase)?.en.label}
						</span>
						<button type="button" onclick={changeTopic}>{lang === 'es' ? 'Cambiar tema' : 'Change topic'}</button>
					</div>
				{/if}

				<div class="chat-messages">
					{#if messages.length === 0}
						<div class="empty-state">
							{lang === 'es'
								? 'Pregúntale al Discípulo BEM sobre los 7 Drivers, MDA V2, Feedback o cualquier concepto del framework.'
								: 'Ask the BEM Disciple about the 7 Drivers, MDA V2, Feedback, or any framework concept.'}
						</div>
					{/if}

					{#each messages as msg (msg.id)}
						<div class="chat-bubble" class:user={msg.role === 'user'} class:assistant={msg.role === 'assistant'}>
							{#if msg.role === 'assistant'}
								<div class="bubble-content">{@html renderMarkdown(msg.content)}</div>
							{:else}
								<div class="bubble-content">{msg.content}</div>
							{/if}
						</div>
					{/each}

					{#if isSending}
						<div class="chat-bubble assistant thinking">
							<div class="bubble-content">
								{lang === 'es' ? 'Discípulo BEM está pensando…' : 'BEM Disciple is thinking…'}
							</div>
						</div>
					{/if}

					<div bind:this={scrollAnchor}></div>
				</div>

				{#if errorMessage}
					<div class="chat-error">
						<span>{errorMessage}</span>
						<button type="button" onclick={retry}>{lang === 'es' ? 'Reintentar' : 'Retry'}</button>
					</div>
				{/if}

				<div class="chat-composer">
					<textarea
						bind:value={inputValue}
						onkeydown={handleKeydown}
						disabled={isSending}
						maxlength={2000}
						placeholder={lang === 'es' ? 'Escribe tu pregunta...' : 'Type your question...'}
						rows="2"
					></textarea>
					<button type="button" class="send-btn" disabled={isSending || !inputValue.trim()} onclick={sendMessage}>
						{lang === 'es' ? 'Enviar' : 'Send'}
					</button>
				</div>
				<span class="composer-hint">{lang === 'es' ? 'Enter para enviar · Shift+Enter para nueva línea' : 'Enter to send · Shift+Enter for a new line'}</span>
			</div>
		{/if}
	</div>
</section>

<style>
	.ai-chat-section {
		padding: 3rem 0 6rem 0;
	}

	/* USE CASE SELECTOR */
	.use-case-panel {
		max-width: 780px;
		margin: 0 auto;
		text-align: center;
	}

	.use-case-panel h2 {
		font-size: 1.5rem;
		margin: 0 0 0.5rem;
		color: var(--color-text);
	}

	.use-case-panel p {
		color: var(--color-text-muted);
		margin: 0 0 2rem;
	}

	.use-case-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		text-align: left;
	}

	.use-case-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1.25rem;
		border-radius: var(--radius-md);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition: var(--transition-fast);
	}

	.use-case-card:hover {
		border-color: var(--color-purple);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.uc-icon {
		font-size: 1.5rem;
	}

	.use-case-card strong {
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.uc-desc {
		color: var(--color-text-muted);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	/* CHAT PANEL */
	.chat-panel {
		display: flex;
		flex-direction: column;
		height: 70vh;
		max-height: 720px;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		background: var(--color-bg-alt);
		border: 1px solid var(--color-border);
	}

	.use-case-badge {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5rem 0.85rem;
		margin-bottom: 0.75rem;
		border-radius: var(--radius-md);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.use-case-badge button {
		background: transparent;
		border: none;
		color: var(--color-purple);
		font-weight: 700;
		font-size: 0.8rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.5rem;
	}

	.empty-state {
		margin: auto;
		text-align: center;
		color: var(--color-text-muted);
		max-width: 420px;
		font-size: 0.95rem;
	}

	.chat-bubble {
		max-width: 75%;
		padding: 0.85rem 1.15rem;
		border-radius: 14px;
		line-height: 1.5;
		font-size: 0.95rem;
	}

	.chat-bubble.user {
		align-self: flex-end;
		background: var(--color-purple);
		color: #fff;
	}

	.chat-bubble.assistant {
		align-self: flex-start;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		box-shadow: var(--shadow-sm);
	}

	.chat-bubble.thinking {
		opacity: 0.7;
		font-style: italic;
	}

	.bubble-content :global(p) {
		margin: 0 0 0.5rem 0;
	}

	.bubble-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.bubble-content :global(ul),
	.bubble-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 1.25rem;
	}

	.bubble-content :global(h1),
	.bubble-content :global(h2),
	.bubble-content :global(h3),
	.bubble-content :global(h4) {
		margin: 0.75rem 0 0.35rem;
		font-size: 1.05em;
		color: var(--color-text);
	}

	.bubble-content :global(code) {
		background: var(--color-bg-alt);
		border-radius: 4px;
		padding: 0.1rem 0.35rem;
		font-size: 0.85em;
	}

	.bubble-content :global(pre) {
		background: var(--color-bg-alt);
		border-radius: 8px;
		padding: 0.75rem;
		overflow-x: auto;
	}

	.bubble-content :global(blockquote) {
		margin: 0.5rem 0;
		padding-left: 0.75rem;
		border-left: 3px solid var(--color-purple);
		color: var(--color-text-muted);
	}

	.chat-error {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		background: rgba(239, 68, 68, 0.08);
		border: 1px solid rgba(239, 68, 68, 0.3);
		font-size: 0.85rem;
		color: var(--color-red);
	}

	.chat-error button {
		background: transparent;
		border: 1px solid currentColor;
		border-radius: 6px;
		padding: 0.35rem 0.75rem;
		cursor: pointer;
		color: inherit;
		font-weight: 600;
		white-space: nowrap;
	}

	.chat-composer {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
		align-items: flex-end;
	}

	.chat-composer textarea {
		flex: 1;
		resize: none;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.95rem;
	}

	.chat-composer textarea:focus {
		outline: none;
		border-color: var(--color-purple);
	}

	.send-btn {
		background: var(--color-purple);
		color: #fff;
		border: none;
		border-radius: 10px;
		padding: 0.75rem 1.5rem;
		font-weight: 700;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.send-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.composer-hint {
		display: block;
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-align: right;
	}
</style>
