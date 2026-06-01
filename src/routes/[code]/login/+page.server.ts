import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, params }) => {
	const code = params.code.trim();
	
	// Detect browser's language setting
	const langHeader = request.headers.get('accept-language');
	const preferred = langHeader && langHeader.startsWith('en') ? 'en' : 'es';

	// Redirect to the language-specific login route
	throw redirect(302, `/${preferred}/${code}/login`);
};
