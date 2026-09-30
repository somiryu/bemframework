import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession, getHostEmail, buildLiveView, normalizeCode } from '$lib/server/taller';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = normalizeCode(params.code);

	if (!(await getHostEmail(cookies))) throw redirect(303, `/${params.lang}/taller?facilitador`);

	const session = await getSession(code);
	if (!session) throw redirect(303, `/${params.lang}/taller`);

	return { code, title: session.title, view: await buildLiveView(session, null) };
};
