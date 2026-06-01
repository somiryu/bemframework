import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { learnTranslations } from '$lib/content/learn';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const code = params.code.trim().toUpperCase();
	const lang = (params.lang as 'es' | 'en') ?? 'es';

	if (!supabase) {
		return { 
			valid: false, 
			message: lang === 'es' ? 'Supabase no está configurado.' : 'Supabase is not configured.', 
			code 
		};
	}

	// Verify if this class code exists
	const { data: instance, error } = await supabase
		.from('course_instances')
		.select('*')
		.eq('code', code)
		.single();

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
		const { data: player } = await supabase
			.from('course_players')
			.select('id')
			.eq('id', activePlayerId)
			.single();

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
	loginPlayer: async ({ request, params, cookies }) => {
		const code = params.code.trim().toUpperCase();
		const lang = (params.lang as 'es' | 'en') ?? 'es';
		const t = learnTranslations[lang].login;
		
		if (!supabase) {
			return fail(500, { 
				success: false, 
				message: lang === 'es' ? 'Supabase no está configurado.' : 'Supabase is not configured.' 
			});
		}

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

		// Upsert student into course_players
		// A student is uniquely identified by (instance_code, email)
		const { data: player, error } = await supabase
			.from('course_players')
			.upsert({
				instance_code: code,
				email: cleanEmail,
				name: cleanName,
				alias: cleanAlias,
				avatar: 'eco-engineer', // Default avatar base, fully customizable in slide 1
				coins: 0,
				game_state: {}
			}, {
				onConflict: 'instance_code,email'
			})
			.select()
			.single();

		if (error || !player) {
			console.error('Login upsert error:', error);
			return fail(400, { 
				success: false, 
				message: lang === 'es' ? `Error de registro: ${error.message}` : `Registration error: ${error.message}` 
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

