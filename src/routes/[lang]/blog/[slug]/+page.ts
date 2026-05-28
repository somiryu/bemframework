import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { blogData } from '$lib/content/blogData';

export const load: PageLoad = async ({ params }) => {
	const { lang, slug } = params;

	const articles = blogData[lang as 'en' | 'es'] || [];
	const post = articles.find((p) => p.slug === slug);

	if (!post) {
		throw error(404, {
			message: lang === 'es' ? 'Artículo no encontrado' : 'Article not found'
		});
	}

	return {
		post
	};
};
