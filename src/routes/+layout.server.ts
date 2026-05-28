import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
	if (url.pathname === '/') {
		const langHeader = request.headers.get('accept-language');

		const preferred =
			langHeader && langHeader.startsWith('es') ? 'es' : 'en';

		throw redirect(302, `/${preferred}`);
	}
};
