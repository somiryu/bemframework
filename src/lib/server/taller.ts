// Server side of the live workshops at /[lang]/taller (e.g. «¿Quién tiene la
// cabeza?»). Mirrors the /learn split: the browser never touches the database —
// it calls /api/taller/[code], which resolves who is calling from cookies and
// only then reads or writes through the service-role `db` client.
//
// - Participants: a single email per session (taller_participants), remembered
//   in the httpOnly `taller_pid` cookie. No password — it's a webinar, not an account.
// - Facilitator: the same `super_user_email` cookie /admin sets, re-validated
//   against super_user on every call (never trusted on its own).
//
// Group results for a slide are only returned once the facilitator reveals it,
// so nobody can peek at the distribution before voting (caja negra per case).

import type { Cookies } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { SLIDES, CASES, type TallerView } from '$lib/content/talleres/quienTieneLaCabeza';

export const PARTICIPANT_COOKIE = 'taller_pid';
export const COHOST_COOKIE = 'taller_cohost';

/**
 * admin: a super_user (full control, reset, CSV, co-facilitator code).
 * cohost: holds this room's co-facilitator code — can drive the slides only.
 */
export type HostRole = 'admin' | 'cohost';

export type Phase = 'vote' | 'results';
export interface LiveState {
	step: number;
	phase: Phase;
}

export interface TallerSession {
	code: string;
	workshop: string;
	title: string;
	state: LiveState;
	host_code: string | null;
	created_at: string;
}

export interface Answer {
	choice: number | null;
	scale: number | null;
	text: string | null;
}

export function normalizeCode(raw: string) {
	return (raw || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function normalizeState(raw: any): LiveState {
	const step = Number.isInteger(raw?.step) ? raw.step : 0;
	return {
		step: Math.max(0, Math.min(SLIDES.length - 1, step)),
		phase: raw?.phase === 'results' ? 'results' : 'vote'
	};
}

export async function getSession(code: string): Promise<TallerSession | null> {
	const { data } = await db.from('taller_sessions').select('*').eq('code', code).maybeSingle();
	if (!data) return null;
	return { ...data, state: normalizeState(data.state) };
}

export async function getHostEmail(cookies: Cookies): Promise<string | null> {
	const email = cookies.get('super_user_email') || null;
	if (!email) return null;
	const { data: isSuper } = await db.rpc('is_super_user', { email_to_check: email });
	return isSuper ? email : null;
}

/**
 * Who is driving this room, if anyone. The co-facilitator cookie holds
 * "<ROOM>:<code>" and is checked against the room's current host_code on
 * every call, so regenerating or revoking the code cuts access at once.
 */
export async function getHostRole(cookies: Cookies, session: TallerSession): Promise<HostRole | null> {
	if (await getHostEmail(cookies)) return 'admin';
	const raw = cookies.get(COHOST_COOKIE) || '';
	if (session.host_code && raw === `${session.code}:${session.host_code}`) return 'cohost';
	return null;
}

export function setCohostCookie(cookies: Cookies, session: TallerSession) {
	cookies.set(COHOST_COOKIE, `${session.code}:${session.host_code}`, {
		path: '/',
		maxAge: 60 * 60 * 24 * 14,
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}

export async function getParticipant(cookies: Cookies, code: string) {
	const id = cookies.get(PARTICIPANT_COOKIE);
	if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return null;
	const { data } = await db
		.from('taller_participants')
		.select('id, email, session_code')
		.eq('id', id)
		.eq('session_code', code)
		.maybeSingle();
	return data || null;
}

export async function joinSession(cookies: Cookies, code: string, email: string) {
	const clean = email.trim().toLowerCase();
	let { data: participant } = await db
		.from('taller_participants')
		.select('id')
		.eq('session_code', code)
		.eq('email', clean)
		.maybeSingle();

	if (!participant) {
		const { data, error } = await db
			.from('taller_participants')
			.insert({ session_code: code, email: clean })
			.select()
			.single();
		if (error || !data) {
			// Two tabs racing the same email: the unique constraint wins, re-read.
			const retry = await db
				.from('taller_participants')
				.select('id')
				.eq('session_code', code)
				.eq('email', clean)
				.maybeSingle();
			participant = retry.data;
		} else {
			participant = data;
		}
	}

	if (!participant) return null;

	cookies.set(PARTICIPANT_COOKIE, participant.id, {
		path: '/',
		maxAge: 60 * 60 * 24 * 14,
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
	return participant.id as string;
}

/**
 * Upsert by hand: the local-Postgres query builder in db.ts has no .upsert(),
 * and the unique (session, participant, slide) constraint backs this up.
 */
export async function saveAnswer(code: string, participantId: string, slideId: string, answer: Answer) {
	const { data: existing } = await db
		.from('taller_responses')
		.select('id')
		.eq('session_code', code)
		.eq('participant_id', participantId)
		.eq('slide_id', slideId)
		.maybeSingle();

	const values = { ...answer, updated_at: new Date().toISOString() };

	if (existing) {
		return db.from('taller_responses').update(values).eq('id', existing.id);
	}
	return db.from('taller_responses').insert({
		session_code: code,
		participant_id: participantId,
		slide_id: slideId,
		...values
	});
}

function aggregateCase(rows: any[]) {
	const counts = [0, 0, 0];
	const scales: number[] = [];
	for (const r of rows) {
		if (Number.isInteger(r.choice) && r.choice >= 0 && r.choice < 3) counts[r.choice]++;
		if (Number.isInteger(r.scale)) scales.push(r.scale);
	}
	return { counts, scales };
}

export async function slideRows(code: string, slideId: string): Promise<any[]> {
	const { data } = await db
		.from('taller_responses')
		.select('participant_id, slide_id, choice, scale, text, updated_at')
		.eq('session_code', code)
		.eq('slide_id', slideId);
	return data || [];
}

/**
 * Everything a client needs to render the current slide. `participantId` is
 * null for the facilitator.
 */
export async function buildLiveView(
	session: TallerSession,
	participantId: string | null
): Promise<TallerView> {
	const { state } = session;
	const slide = SLIDES[state.step];

	// One slide per query: PostgREST caps every response at 1000 rows, so
	// fetching the whole room at once would silently drop answers past ~140
	// participants (7 answers each). Per slide, the cap is the head count.
	const [{ data: participants }, current] = await Promise.all([
		db.from('taller_participants').select('id').eq('session_code', session.code),
		slideRows(session.code, slide.id)
	]);

	const mineRow = participantId ? current.find((r: any) => r.participant_id === participantId) : null;

	const view: TallerView = {
		code: session.code,
		title: session.title,
		state,
		participantCount: (participants || []).length,
		responseCount: current.length,
		mine: mineRow
			? { choice: mineRow.choice, scale: mineRow.scale, text: mineRow.text }
			: null,
		results: null
	};

	if (state.phase === 'results') {
		if (slide.kind === 'case') {
			view.results = aggregateCase(current);
		} else if (slide.kind === 'closing') {
			// Anonymous: the texts go out without who wrote them.
			view.results = {
				vueltas: current
					.map((r: any) => (r.text || '').trim())
					.filter(Boolean),
				summary: (await Promise.all(CASES.map((c) => slideRows(session.code, c.id)))).map((caseRows, i) => {
					const c = CASES[i];
					const mine = participantId
						? caseRows.find((r: any) => r.participant_id === participantId)
						: null;
					return {
						id: c.id,
						...aggregateCase(caseRows),
						mine: mine ? { choice: mine.choice, scale: mine.scale } : null
					};
				})
			};
		}
	}

	return view;
}

// No 0/O/1/I so codes read cleanly when dictated on a call.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCode() {
	let out = '';
	for (let i = 0; i < 5; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
	return out;
}

/** Co-facilitator code: grants control of a room, so it comes from crypto. */
export function generateHostCode() {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}
