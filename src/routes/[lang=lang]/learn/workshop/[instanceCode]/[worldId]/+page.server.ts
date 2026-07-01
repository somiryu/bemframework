import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const playerId = cookies.get('player_id');
	const instanceCode = params.instanceCode; // Read directly from URL route parameter
	const lang = params.lang || 'es';
	const worldId = parseInt(params.worldId as string, 10);

	if (isNaN(worldId) || !instanceCode) {
		throw redirect(303, `/${lang}/learn`);
	}

	if (!playerId) {
		throw redirect(303, `/${lang}`);
	}

	if (!supabase) {
		return { valid: false, message: 'Supabase no está configurado.' };
	}

	// Fetch active player details
	const { data: player, error: playerErr } = await supabase
		.from('course_players')
		.select('*')
		.eq('id', playerId)
		.single();

	if (playerErr || !player) {
		cookies.delete('player_id', { path: '/' });
		cookies.delete('player_instance_code', { path: '/' });
		throw redirect(303, `/${lang}`);
	}

	// Fetch active class instance
	const { data: instance, error: instErr } = await supabase
		.from('course_instances')
		.select('*')
		.eq('code', instanceCode)
		.single();

	if (instErr || !instance) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Verify that the requested world is unlocked in this instance
	if (!instance.unlocked_worlds?.includes(worldId)) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Fetch specific world
	const { data: world, error: worldErr } = await supabase
		.from('course_worlds')
		.select('*')
		.eq('id', worldId)
		.single();

	if (worldErr || !world) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Fetch classmates in the same class
	const { data: classmates } = await supabase
		.from('course_players')
		.select('id, name, alias, avatar, coins, game_state')
		.eq('instance_code', instanceCode);

	return {
		player,
		instance,
		world,
		classmates: classmates || []
	};
};
