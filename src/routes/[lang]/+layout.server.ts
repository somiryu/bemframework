import { redirect, error } from '@sveltejs/kit';

const supported = ['en', 'es'];

export const load = async ({ params }) => {
	const { lang } = params;

	if (!supported.includes(lang)) {
		throw error(404, 'Language not supported');
	}

	return { lang };
};
