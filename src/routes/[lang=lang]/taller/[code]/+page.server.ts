import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getSession,
	getParticipant,
	joinSession,
	buildLiveView,
	normalizeCode,
	isValidEmail
} from '$lib/server/taller';
import { db } from '$lib/server/db';
import { WORKSHOP_ID as SALA_ID } from '$lib/content/talleres/salaDeCrisis';
import { getSalaParticipant } from '$lib/server/salaDeCrisisApi';
import { buildPlayerView, normalizeSalaState } from '$lib/server/salaDeCrisis';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = normalizeCode(params.code);
	if (code !== params.code) throw redirect(303, `/${params.lang}/taller/${code}`);

	const session = await getSession(code);
	if (!session) throw redirect(303, `/${params.lang}/taller?sala=${encodeURIComponent(code)}`);

	if (session.workshop === SALA_ID) {
		const me = await getSalaParticipant(cookies, code);
		return {
			workshop: 'sala' as const,
			code,
			title: session.title,
			email: me?.email ?? null,
			view: null,
			salaView: me ? await buildPlayerView(session, normalizeSalaState(session.state), me) : null
		};
	}

	const participant = await getParticipant(cookies, code);
	if (!participant) {
		return {
			workshop: 'taller' as const,
			code,
			title: session.title,
			email: null,
			view: null,
			salaView: null
		};
	}

	return {
		workshop: 'taller' as const,
		code,
		title: session.title,
		email: participant.email as string,
		view: await buildLiveView(session, participant.id),
		salaView: null
	};
};

export const actions: Actions = {
	// The whole login: one email, no password, no verification mail.
	join: async ({ request, params, cookies }) => {
		const code = normalizeCode(params.code);
		const form = await request.formData();
		const email = ((form.get('email') as string) || '').trim().toLowerCase();

		const alias = ((form.get('alias') as string) || '').trim().replace(/\s+/g, ' ').slice(0, 24);

		if (!isValidEmail(email)) return fail(400, { error: 'Escribe un email válido.', email, alias });

		const session = await getSession(code);
		if (!session) return fail(404, { error: 'Esta sala ya no existe.', email, alias });

		const isSala = session.workshop === SALA_ID;
		if (isSala && alias.length < 2)
			return fail(400, { error: 'Escribe tu nombre de cadete (mínimo 2 letras).', email, alias });

		const id = await joinSession(cookies, code, email);
		if (!id) return fail(500, { error: 'No pudimos registrarte. Intenta de nuevo.', email, alias });
		if (isSala) await db.from('taller_participants').update({ alias }).eq('id', id);

		throw redirect(303, `/${params.lang}/taller/${code}`);
	}
};
