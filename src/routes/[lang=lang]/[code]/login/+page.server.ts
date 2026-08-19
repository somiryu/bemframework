import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { learnTranslations } from '$lib/content/learn';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = params.code.trim().toUpperCase();
	const lang = (params.lang as 'es' | 'en') ?? 'es';

	// Verify if this class code exists
	const { data: instance, error } = await db
		.from('course_instances')
		.select('*')
		.eq('code', code)
		.maybeSingle();

	if (error || !instance) {
		return {
			valid: false,
			message: lang === 'es' 
				? `El código de curso '${code}' no corresponde a ninguna clase activa. Verifica con tu mentor.` 
				: `The course code '${code}' does not correspond to any active class. Check with your mentor.`,
			code
		};
	}

	// Check if player is already logged in for this class
	const activePlayerId = cookies.get('player_id');
	const activeInstanceCode = cookies.get('player_instance_code');

	if (activePlayerId && activeInstanceCode === code) {
		// Verify in DB that student still exists
		const { data: player } = await db
			.from('course_players')
			.select('id')
			.eq('id', activePlayerId)
			.maybeSingle();

		if (player) {
			// Already authenticated, redirect directly to learn map!
			throw redirect(303, `/${params.lang}/learn`);
		}
	}

	return {
		valid: true,
		code,
		unlockedWorlds: instance.unlocked_worlds
	};
};

export const actions: Actions = {
	checkEmail: async ({ request, params, cookies }) => {
		const code = params.code.trim().toUpperCase();
		const lang = (params.lang as 'es' | 'en') ?? 'es';
		const t = learnTranslations[lang].login;

		const formData = await request.formData();
		const email = (formData.get('email') as string) || '';

		if (!email.trim()) {
			return fail(400, { success: false, message: t.requiredFields });
		}

		const cleanEmail = email.trim().toLowerCase();

		// Check if player already exists in this course instance
		const { data: player, error } = await db
			.from('course_players')
			.select('*')
			.eq('instance_code', code)
			.eq('email', cleanEmail)
			.maybeSingle();

		if (error) {
			console.error('Check email error:', error);
			return fail(400, {
				success: false,
				message: lang === 'es' ? `Error de verificación: ${error.message}` : `Verification error: ${error.message}`
			});
		}

		if (player) {
			// Player exists! Set cookies and log in.
			cookies.set('player_id', player.id, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30, // 30 days
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production'
			});

			cookies.set('player_instance_code', code, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30,
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production'
			});

			throw redirect(303, `/${params.lang}/learn`);
		}

		// Player does not exist. Proceed to registration.
		return {
			success: true,
			exists: false,
			email: cleanEmail
		};
	},

	registerPlayer: async ({ request, params, cookies }) => {
		const code = params.code.trim().toUpperCase();
		const lang = (params.lang as 'es' | 'en') ?? 'es';
		const t = learnTranslations[lang].login;

		const formData = await request.formData();
		const email = (formData.get('email') as string) || '';
		const name = (formData.get('name') as string) || '';
		const alias = (formData.get('alias') as string) || '';

		if (!email.trim() || !name.trim() || !alias.trim()) {
			return fail(400, { success: false, message: t.requiredFields });
		}

		const cleanEmail = email.trim().toLowerCase();
		const cleanName = name.trim();
		const cleanAlias = alias.trim();

		// Double-check if the player already exists to prevent duplicate registration
		const { data: existingPlayer } = await db
			.from('course_players')
			.select('id')
			.eq('instance_code', code)
			.eq('email', cleanEmail)
			.maybeSingle();

		if (existingPlayer) {
			return fail(400, {
				success: false,
				message: t.emailExistsError
			});
		}

		// Insert student into course_players (no upsert, protecting existing records)
		const { data: player, error } = await db
			.from('course_players')
			.insert({
				instance_code: code,
				email: cleanEmail,
				name: cleanName,
				alias: cleanAlias,
				avatar: 'eco-engineer', // Default avatar base
				coins: 0,
				game_state: {}
			})
			.select()
			.single();

		if (error || !player) {
			console.error('Registration insert error:', error);
			return fail(400, {
				success: false,
				message: lang === 'es' 
					? `Error de registro: ${error?.message || 'Error desconocido'}` 
					: `Registration error: ${error?.message || 'Unknown error'}`
			});
		}

		// Save student ID and class code in cookies (lasts for 30 days)
		cookies.set('player_id', player.id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		cookies.set('player_instance_code', code, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		// Success! Redirect to central learn map
		throw redirect(303, `/${params.lang}/learn`);
	}
};
