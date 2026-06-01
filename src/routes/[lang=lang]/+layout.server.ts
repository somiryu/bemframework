import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const supported = ['en', 'es'];

export const load: LayoutServerLoad = async ({ params }) => {
	const { lang } = params;

	if (!supported.includes(lang)) {
		throw error(404, 'Language not supported');
	}

	return { lang };
};
