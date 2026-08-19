import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { formatActiveWorlds } from '$lib/utils/worldMapper';
import { syncPlayerState, resetWorldProgress, syncWorkshopState } from '$lib/server/gameActions';

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

	// Fetch active player details
	const { data: player, error: playerErr } = await db
		.from('course_players')
		.select('*')
		.eq('id', playerId)
		.maybeSingle();

	if (playerErr || !player) {
		cookies.delete('player_id', { path: '/' });
		cookies.delete('player_instance_code', { path: '/' });
		throw redirect(303, `/${lang}`);
	}

	// A player may only enter the workshop of the class they actually belong to,
	// regardless of what instance code appears in the URL.
	if (player.instance_code !== instanceCode) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Fetch active class instance
	const { data: instance, error: instErr } = await db
		.from('course_instances')
		.select('*')
		.eq('code', instanceCode)
		.maybeSingle();

	if (instErr || !instance) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Verify that the requested world is unlocked in this instance
	if (!instance.unlocked_worlds?.includes(worldId)) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Fetch every world and derive the same relative numbering the map uses,
	// so a short course (e.g. unlocked_worlds: [1, 4, 6]) always reads as a
	// clean 1, 2, 3 sequence here too — never the canonical order_index, and
	// never skipping straight to "Misión 3" with no 1 or 2 in sight.
	const { data: allWorlds } = await db
		.from('course_worlds')
		.select('*')
		.order('order_index', { ascending: true });

	const formattedWorld = formatActiveWorlds(allWorlds || [], instance.unlocked_worlds).find(
		(w) => w.id === worldId
	);

	if (!formattedWorld) {
		throw redirect(303, `/${lang}/learn`);
	}

	// Fetch classmates in the same class
	const { data: classmates } = await db
		.from('course_players')
		.select('id, name, alias, avatar, coins, game_state')
		.eq('instance_code', instanceCode);

	return {
		player,
		instance,
		world: formattedWorld,
		classmates: classmates || []
	};
};

export const actions: Actions = {
	syncPlayerState,
	resetWorldProgress,
	syncWorkshopState
};
