// SANCTIONED AI SURFACE: This is the only route in bem-svelte that mints the
// bem_ai_session cookie and reads/writes AI chat history. Keep all AI chat
// UI colocated in this route folder — do not add chat components elsewhere.

import type { PageServerLoad } from './$types';
import { fetchChatHistory, mergeAnonymousHistoryIntoPlayer } from '$lib/server/ai/chatHistory';
import { isUseCaseId } from '$lib/server/ai/useCases';

const SESSION_COOKIE = 'bem_ai_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const USE_CASE_COOKIE = 'bem_ai_use_case';

export const load: PageServerLoad = async ({ cookies }) => {
	let sessionId = cookies.get(SESSION_COOKIE);

	if (!sessionId) {
		sessionId = crypto.randomUUID();
		cookies.set(SESSION_COOKIE, sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: SESSION_MAX_AGE
		});
	}

	const playerId = cookies.get('player_id') ?? null;

	if (playerId) {
		await mergeAnonymousHistoryIntoPlayer({ sessionId, playerId });
	}

	const messages = await fetchChatHistory({ sessionId, playerId });

	const rawUseCase = cookies.get(USE_CASE_COOKIE);
	const useCaseId = isUseCaseId(rawUseCase) ? rawUseCase : null;

	// sessionId intentionally not returned to the client — it lives only in the
	// httpOnly cookie; /api/ai reads it straight from the request, never from page data.
	return { messages, playerId, useCaseId };
};
