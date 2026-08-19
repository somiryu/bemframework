import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const lang = (params.lang as 'es' | 'en') ?? 'es';
	const activePlayerId = cookies.get('player_id');
	const activeInstanceCode = cookies.get('player_instance_code');

	// If player is already authenticated with an active class, redirect directly to /learn
	if (activePlayerId && activeInstanceCode) {
		const { data: player } = await db
			.from('course_players')
			.select('id')
			.eq('id', activePlayerId)
			.maybeSingle();

		if (player) {
			throw redirect(303, `/${lang}/learn`);
		}
	}

	return {
		lang
	};
};

export const actions: Actions = {
	submitCode: async ({ request, params }) => {
		const lang = (params.lang as 'es' | 'en') ?? 'es';
		const formData = await request.formData();
		const rawCode = (formData.get('code') as string) || '';

		if (!rawCode.trim()) {
			return fail(400, {
				success: false,
				message: lang === 'es' 
					? 'Por favor ingresa un código de clase.' 
					: 'Please enter a class code.'
			});
		}

		const cleanCode = rawCode.trim().toUpperCase().replace(/\s+/g, '-');

		// Verify that this class instance exists
		const { data: instance, error } = await db
			.from('course_instances')
			.select('code')
			.eq('code', cleanCode)
			.maybeSingle();

		if (error || !instance) {
			return fail(404, {
				success: false,
				message: lang === 'es'
					? `El código de clase '${cleanCode}' no corresponde a ninguna clase activa. Verifica con tu mentor.`
					: `The class code '${cleanCode}' does not correspond to any active class. Check with your mentor.`
			});
		}

		// Valid code! Redirect to the class login route
		throw redirect(303, `/${lang}/${cleanCode}/login`);
	}
};
