import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
    // Basic language detection or just default to /en
    throw redirect(307, '/en');
};
