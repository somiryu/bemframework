// SANCTIONED AI SURFACE: This is the only route/endpoint in bem-svelte allowed to call
// the Discípulo BEM backend. Do not add chat widgets or fetch('/api/ai') calls elsewhere —
// all AI interaction must live under /{lang}/ai (see src/routes/[lang=lang]/ai/+page.svelte).

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDiscipleReply, type GeminiContentPart } from '$lib/server/ai/discipleClient';
import { checkRateLimit, insertChatMessage } from '$lib/server/ai/chatHistory';
import { isUseCaseId } from '$lib/server/ai/useCases';

const MAX_MESSAGE_LENGTH = 2000;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionId = cookies.get('bem_ai_session');
	if (!sessionId) {
		throw error(400, 'Missing AI session — reload the page');
	}
	const playerId = cookies.get('player_id') ?? null;

	try {
		const body = await request.json();
		const message: unknown = body?.message;
		const contextHistory: GeminiContentPart[] = body?.contextHistory || [];
		const lang: 'en' | 'es' = body?.lang === 'en' ? 'en' : 'es';
		const useCaseId = isUseCaseId(body?.useCaseId) ? body.useCaseId : undefined;

		if (!message || typeof message !== 'string' || !message.trim()) {
			return json({ error: 'Message is required' }, { status: 400 });
		}
		if (message.length > MAX_MESSAGE_LENGTH) {
			return json({ error: 'Message too long' }, { status: 400 });
		}

		const rateCheck = await checkRateLimit({ sessionId });
		if (!rateCheck.allowed) {
			return json(
				{ error: 'Rate limited', retryAfterSeconds: rateCheck.retryAfterSeconds },
				{ status: 429 }
			);
		}

		await insertChatMessage({ sessionId, playerId, role: 'user', content: message, lang });

		const { reply, isFallback } = await getDiscipleReply({ message, contextHistory, lang, useCaseId });

		await insertChatMessage({
			sessionId,
			playerId,
			role: 'assistant',
			content: reply,
			lang,
			isFallback
		});

		return json({ reply });
	} catch (err: any) {
		console.error('Error en /api/ai:', err);
		return json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
	}
};
