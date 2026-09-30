import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { SLIDES } from '$lib/content/talleres/quienTieneLaCabeza';
import {
	getSession,
	getHostEmail,
	getParticipant,
	buildLiveView,
	saveAnswer,
	normalizeCode,
	normalizeState
} from '$lib/server/taller';

// Polled by both views (and pinged over Supabase broadcast when available).
// The response is the whole truth for the current slide — clients never
// trust a broadcast payload, they only use it as a hint to refetch.
export const GET: RequestHandler = async ({ params, cookies, setHeaders }) => {
	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw error(404, 'Sala no encontrada.');

	setHeaders({ 'cache-control': 'no-store' });

	const participant = await getParticipant(cookies, code);
	if (participant) return json(await buildLiveView(session, participant.id));

	if (await getHostEmail(cookies)) return json(await buildLiveView(session, null));

	throw error(401, 'Entra con tu email para ver la sala.');
};

const MAX_TEXT = 2000;

export const POST: RequestHandler = async ({ params, cookies, request }) => {
	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw error(404, 'Sala no encontrada.');

	let body: any;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Solicitud inválida.');
	}

	if (body?.type === 'answer') {
		const participant = await getParticipant(cookies, code);
		if (!participant) throw error(401, 'Entra con tu email para responder.');

		const slide = SLIDES[session.state.step];
		// Answers only count for the slide on screen, and only while voting is open.
		if (body.slideId !== slide.id || session.state.phase !== 'vote') {
			throw error(409, 'La votación de este slide ya se cerró.');
		}

		if (slide.kind === 'case') {
			const choice = Number(body.choice);
			const scale = Number(body.scale);
			if (!Number.isInteger(choice) || choice < 0 || choice > 2) throw error(400, 'Respuesta 1 inválida.');
			if (!Number.isInteger(scale) || scale < 0 || scale > 100) throw error(400, 'Respuesta 2 inválida.');
			const { error: dbErr } = await saveAnswer(code, participant.id, slide.id, { choice, scale, text: null });
			if (dbErr) throw error(500, 'No se pudo guardar tu respuesta.');
		} else if (slide.kind === 'closing') {
			const text = String(body.text ?? '').trim().slice(0, MAX_TEXT);
			if (!text) throw error(400, 'Escribe tu respuesta antes de enviarla.');
			const { error: dbErr } = await saveAnswer(code, participant.id, slide.id, { choice: null, scale: null, text });
			if (dbErr) throw error(500, 'No se pudo guardar tu respuesta.');
		} else {
			throw error(400, 'Este slide no recibe respuestas.');
		}

		return json(await buildLiveView(session, participant.id));
	}

	// Everything below is the facilitator's.
	if (!(await getHostEmail(cookies))) throw error(403, 'Solo el facilitador controla la sala.');

	if (body?.type === 'state') {
		const state = normalizeState({ step: body.step, phase: body.phase });
		const { error: dbErr } = await db.from('taller_sessions').update({ state }).eq('code', code);
		if (dbErr) throw error(500, 'No se pudo actualizar la sala.');
		return json(await buildLiveView({ ...session, state }, null));
	}

	if (body?.type === 'reset') {
		const state = normalizeState({ step: 0, phase: 'vote' });
		await db.from('taller_responses').delete().eq('session_code', code);
		await db.from('taller_sessions').update({ state }).eq('code', code);
		return json(await buildLiveView({ ...session, state }, null));
	}

	throw error(400, 'Acción desconocida.');
};
