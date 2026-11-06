// /api/taller/[code] para salas de «Sala de Crisis». La ruta comparte URL con
// los demás talleres y delega aquí cuando session.workshop es 'sala-de-crisis'.

import { json, error, type Cookies } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	PARTICIPANT_COOKIE,
	getHostRole,
	generateHostCode,
	type TallerSession
} from '$lib/server/taller';
import {
	advance,
	buildHostView,
	buildPlayerView,
	initialState,
	normalizeSalaState,
	saveProfile,
	saveSalaAnswer,
	SalaInputError,
	type SalaParticipant
} from '$lib/server/salaDeCrisis';

export async function getSalaParticipant(
	cookies: Cookies,
	code: string
): Promise<SalaParticipant | null> {
	const id = cookies.get(PARTICIPANT_COOKIE);
	if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return null;
	const { data } = await db
		.from('taller_participants')
		.select('id, email, alias, guild, mentor')
		.eq('id', id)
		.eq('session_code', code)
		.maybeSingle();
	return (data as SalaParticipant) || null;
}

export async function salaGET(session: TallerSession, cookies: Cookies, asHost = false) {
	const state = normalizeSalaState(session.state);
	if (asHost && (await getHostRole(cookies, session)))
		return json(await buildHostView(session, state));
	const me = await getSalaParticipant(cookies, session.code);
	if (me) return json(await buildPlayerView(session, state, me));
	if (await getHostRole(cookies, session)) return json(await buildHostView(session, state));
	throw error(401, 'Entra con tu nombre de cadete para ver la sala.');
}

export async function salaPOST(session: TallerSession, cookies: Cookies, body: any) {
	const state = normalizeSalaState(session.state);

	if (body?.type === 'profile' || body?.type === 'answer') {
		const me = await getSalaParticipant(cookies, session.code);
		if (!me) throw error(401, 'Entra con tu nombre de cadete para responder.');
		try {
			if (body.type === 'profile') {
				await saveProfile(session, state, me, body);
				const fresh = (await getSalaParticipant(cookies, session.code))!;
				return json(await buildPlayerView(session, state, fresh));
			}
			await saveSalaAnswer(session, state, me, body);
		} catch (e) {
			if (e instanceof SalaInputError) throw error(e.status, e.message);
			throw e;
		}
		return json(await buildPlayerView(session, state, me));
	}

	const role = await getHostRole(cookies, session);
	if (!role) throw error(403, 'Solo el facilitador controla la sala.');

	if (body?.type === 'advance') {
		const to = body.to === 'prev' ? 'prev' : body.to === 'final' ? 'final' : 'next';
		const next = await advance(session, state, to);
		const { error: dbErr } = await db
			.from('taller_sessions')
			.update({ state: next })
			.eq('code', session.code);
		if (dbErr) throw error(500, 'No se pudo actualizar la sala.');
		return json(await buildHostView({ ...session, state: next as any }, next));
	}

	if (role !== 'admin') throw error(403, 'Esta acción es solo del facilitador principal.');

	if (body?.type === 'hostCode') {
		const hostCode = body.action === 'revoke' ? null : generateHostCode();
		const { error: dbErr } = await db
			.from('taller_sessions')
			.update({ host_code: hostCode })
			.eq('code', session.code);
		if (dbErr) throw error(500, 'No se pudo actualizar el código.');
		return json({ hostCode });
	}

	if (body?.type === 'reset') {
		const fresh = initialState();
		await db.from('taller_responses').delete().eq('session_code', session.code);
		await db.from('taller_participants').delete().eq('session_code', session.code);
		await db.from('taller_sessions').update({ state: fresh }).eq('code', session.code);
		return json(await buildHostView({ ...session, state: fresh as any }, fresh));
	}

	throw error(400, 'Acción desconocida.');
}
