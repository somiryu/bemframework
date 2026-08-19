import { db } from '$lib/server/db';

export interface ChatMessageRow {
	id: string;
	session_id: string;
	player_id: string | null;
	role: 'user' | 'assistant';
	content: string;
	lang: 'en' | 'es';
	is_fallback: boolean;
	created_at: string;
}

const RATE_LIMIT_MAX_MESSAGES = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

// NOTE: queries here are written against the lowest-common-denominator subset
// supported by both the real Supabase client and the local Postgres query
// builder in $lib/server/db.ts (select/insert/update, eq, order, limit) —
// no .or()/.is()/count-select, which the local builder doesn't implement.

export async function fetchChatHistory(params: {
	sessionId: string;
	playerId: string | null;
}): Promise<ChatMessageRow[]> {
	const { data: bySession, error: sessionErr } = await db
		.from('ai_chat_messages')
		.select('*')
		.eq('session_id', params.sessionId)
		.order('created_at', { ascending: true });

	if (sessionErr) {
		console.error('fetchChatHistory (session) error:', sessionErr.message);
	}

	let rows: ChatMessageRow[] = bySession || [];

	if (params.playerId) {
		const { data: byPlayer, error: playerErr } = await db
			.from('ai_chat_messages')
			.select('*')
			.eq('player_id', params.playerId)
			.order('created_at', { ascending: true });

		if (playerErr) {
			console.error('fetchChatHistory (player) error:', playerErr.message);
		}

		if (byPlayer?.length) {
			const seen = new Set(rows.map((r) => r.id));
			for (const row of byPlayer) {
				if (!seen.has(row.id)) {
					rows.push(row);
					seen.add(row.id);
				}
			}
		}
	}

	rows.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
	return rows;
}

function isForeignKeyViolation(error: any): boolean {
	return error?.code === '23503' || /foreign key constraint/i.test(error?.message || '');
}

export async function insertChatMessage(params: {
	sessionId: string;
	playerId: string | null;
	role: 'user' | 'assistant';
	content: string;
	lang: 'en' | 'es';
	isFallback?: boolean;
}): Promise<void> {
	const row = {
		session_id: params.sessionId,
		player_id: params.playerId,
		role: params.role,
		content: params.content,
		lang: params.lang,
		is_fallback: params.isFallback ?? false
	};

	const { error } = await db.from('ai_chat_messages').insert([row]);

	if (error && params.playerId && isForeignKeyViolation(error)) {
		// A stale/invalid player_id cookie (e.g. left over from a different
		// DB_MODE, or a deleted player) shouldn't drop the message entirely —
		// retry once as an anonymous row instead.
		console.warn('insertChatMessage: invalid player_id, retrying without it:', params.playerId);
		const { error: retryError } = await db
			.from('ai_chat_messages')
			.insert([{ ...row, player_id: null }]);
		if (retryError) {
			console.error('insertChatMessage retry error:', retryError.message);
		}
	} else if (error) {
		console.error('insertChatMessage error:', error.message);
	}
}

async function playerExists(playerId: string): Promise<boolean> {
	const { data } = await db.from('course_players').select('id').eq('id', playerId).maybeSingle();
	return !!data;
}

export async function mergeAnonymousHistoryIntoPlayer(params: {
	sessionId: string;
	playerId: string;
}): Promise<void> {
	// A player_id cookie can outlive its row (switched DB_MODE, player was reset,
	// etc.) — check first instead of letting the FK constraint reject the update
	// on every page load.
	if (!(await playerExists(params.playerId))) {
		return;
	}

	// Unconditionally stamps player_id on every row for this browser session —
	// safe because a session_id cookie belongs to exactly one browser, and
	// re-stamping an already-correct player_id is a no-op.
	const { error } = await db
		.from('ai_chat_messages')
		.update({ player_id: params.playerId })
		.eq('session_id', params.sessionId);

	if (error) {
		console.error('mergeAnonymousHistoryIntoPlayer error:', error.message);
	}
}

export async function checkRateLimit(params: {
	sessionId: string;
}): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
	const { data, error } = await db
		.from('ai_chat_messages')
		.select('created_at')
		.eq('session_id', params.sessionId)
		.eq('role', 'user')
		.order('created_at', { ascending: false })
		.limit(RATE_LIMIT_MAX_MESSAGES);

	if (error) {
		console.error('checkRateLimit error:', error.message);
		return { allowed: true };
	}

	const windowStartMs = Date.now() - RATE_LIMIT_WINDOW_MS;
	const recentCount = (data || []).filter(
		(row: { created_at: string }) => new Date(row.created_at).getTime() > windowStartMs
	).length;

	if (recentCount >= RATE_LIMIT_MAX_MESSAGES) {
		return { allowed: false, retryAfterSeconds: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) };
	}

	return { allowed: true };
}
