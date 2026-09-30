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

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = normalizeCode(params.code);
	if (code !== params.code) throw redirect(303, `/${params.lang}/taller/${code}`);

	const session = await getSession(code);
	if (!session) throw redirect(303, `/${params.lang}/taller?sala=${encodeURIComponent(code)}`);

	const participant = await getParticipant(cookies, code);
	if (!participant) {
		return { code, title: session.title, email: null, view: null };
	}

	return {
		code,
		title: session.title,
		email: participant.email as string,
		view: await buildLiveView(session, participant.id)
	};
};

export const actions: Actions = {
	// The whole login: one email, no password, no verification mail.
	join: async ({ request, params, cookies }) => {
		const code = normalizeCode(params.code);
		const form = await request.formData();
		const email = ((form.get('email') as string) || '').trim().toLowerCase();

		if (!isValidEmail(email)) return fail(400, { error: 'Escribe un email válido.', email });

		const session = await getSession(code);
		if (!session) return fail(404, { error: 'Esta sala ya no existe.', email });

		const id = await joinSession(cookies, code, email);
		if (!id) return fail(500, { error: 'No pudimos registrarte. Intenta de nuevo.', email });

		throw redirect(303, `/${params.lang}/taller/${code}`);
	}
};
