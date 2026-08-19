import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// /learning moved to /academy/manifesto — kept as a redirect so existing
// links/bookmarks (nav, marketing copy, external references) keep working.
export const load: PageServerLoad = async ({ params }) => {
	throw redirect(301, `/${params.lang}/academy/manifesto`);
};
