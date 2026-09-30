import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSession, getHostRole, setCohostCookie, buildLiveView, normalizeCode } from '$lib/server/taller';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw redirect(303, `/${params.lang}/taller`);

	const role = await getHostRole(cookies, session);

	// Not a facilitator yet: offer the co-facilitator code form (the main
	// facilitator signs in from /taller instead).
	if (!role) return { code, title: session.title, role: null, hostCode: null, view: null };

	return {
		code,
		title: session.title,
		role,
		// Only the main facilitator ever sees the code itself.
		hostCode: role === 'admin' ? session.host_code : null,
		view: await buildLiveView(session, null)
	};
};

export const actions: Actions = {
	cohostLogin: async ({ request, params, cookies }) => {
		const code = normalizeCode(params.code);
		const session = await getSession(code);
		if (!session) return fail(404, { error: 'Esta sala ya no existe.' });

		const form = await request.formData();
		const typed = ((form.get('hostCode') as string) || '').trim().toUpperCase().replace(/\s+/g, '');

		if (!session.host_code || typed !== session.host_code) {
			return fail(400, { error: 'Ese código no es válido para esta sala. Pídele uno nuevo al facilitador.' });
		}

		setCohostCookie(cookies, session);
		throw redirect(303, `/${params.lang}/taller/${code}/facilitador`);
	}
};
