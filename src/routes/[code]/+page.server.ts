import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession, normalizeCode } from '$lib/server/taller';

// Short share links for live workshop rooms: /masterclass1 → /es/taller/MASTERCLASS1.
// Anything that isn't a room keeps 404ing like before.
export const load: PageServerLoad = async ({ params }) => {
	const code = normalizeCode(params.code);
	if (code && (await getSession(code))) throw redirect(307, `/es/taller/${code}`);
	throw error(404, 'Not found');
};
