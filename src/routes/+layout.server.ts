import { redirect } from '@sveltejs/kit';

export const load = async ({ request, url }) => {
	if (url.pathname === '/') {
		const langHeader = request.headers.get('accept-language');

		const preferred =
			langHeader && langHeader.startsWith('es') ? 'es' : 'en';

		throw redirect(302, `/${preferred}`);
	}
};
