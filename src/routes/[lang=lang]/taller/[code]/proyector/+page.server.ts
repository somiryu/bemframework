import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession, getHostRole, normalizeCode } from '$lib/server/taller';
import { WORKSHOP_ID as SALA_ID } from '$lib/content/talleres/salaDeCrisis';
import { buildHostView, normalizeSalaState } from '$lib/server/salaDeCrisis';
import { qrSvg, salaJoinUrl } from '$lib/server/qr';

// Pantalla del proyector: solo lectura, para quien controla la sala.
export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw redirect(303, `/${params.lang}/taller`);
	if (session.workshop !== SALA_ID || !(await getHostRole(cookies, session))) {
		throw redirect(303, `/${params.lang}/taller/${code}/facilitador`);
	}
	const joinUrl = salaJoinUrl(url.origin, code);
	return {
		code,
		title: session.title,
		view: await buildHostView(session, normalizeSalaState(session.state)),
		joinUrl,
		qr: await qrSvg(joinUrl)
	};
};
