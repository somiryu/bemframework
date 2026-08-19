import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { syncPlayerState } from '$lib/server/gameActions';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const playerId = cookies.get('player_id');
	const lang = params.lang || 'es';

	if (!playerId) {
		// Not authenticated, redirect to root landing or show error
		throw redirect(303, `/${lang}`);
	}

	// Fetch active player details
	const { data: player, error: playerErr } = await db
		.from('course_players')
		.select('*')
		.eq('id', playerId)
		.maybeSingle();

	if (playerErr || !player) {
		// Player session expired or invalid, clear cookies
		cookies.delete('player_id', { path: '/' });
		cookies.delete('player_instance_code', { path: '/' });
		throw redirect(303, `/${lang}`);
	}

	// The player's own instance_code is the source of truth for which class
	// they belong to — the cookie is only used to look up the player.
	const instanceCode = player.instance_code;

	// Fetch active class instance
	const { data: instance, error: instErr } = await db
		.from('course_instances')
		.select('*')
		.eq('code', instanceCode)
		.maybeSingle();

	if (instErr || !instance) {
		throw redirect(303, `/${lang}`);
	}

	// Fetch all worlds configured
	const { data: worlds } = await db
		.from('course_worlds')
		.select('*')
		.order('order_index', { ascending: true });

	// Fetch classmates in the same class (for roster browse)
	const { data: classmates } = await db
		.from('course_players')
		.select('id, name, alias, avatar, coins, game_state')
		.eq('instance_code', instanceCode);

	return {
		player,
		instance,
		worlds: worlds || [],
		classmates: classmates || []
	};
};

export const actions: Actions = {
	syncPlayerState,

	completeTrainingTrivia: async ({ request, cookies }) => {
		const playerId = cookies.get('player_id');
		if (!playerId) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const coinsAwarded = parseInt(formData.get('coins') as string, 10);

		if (isNaN(worldId) || isNaN(coinsAwarded)) {
			return fail(400, { success: false, message: 'Parámetros inválidos.' });
		}

		// Fetch player current data
		const { data: player } = await db
			.from('course_players')
			.select('coins, game_state')
			.eq('id', playerId)
			.maybeSingle();

		if (!player) return fail(404, { success: false, message: 'Jugador no encontrado.' });

		// Each world's own training instructions promise a specific lifetime cap
		// (course_worlds.training_modules.mentor.maxLifetimeCoins) — most worlds
		// promise 50, but World 6 promises 15. Enforcing a flat 50 here let a
		// completion silently exceed what World 6 told the player (SEC-08).
		const { data: world } = await db
			.from('course_worlds')
			.select('training_modules')
			.eq('id', worldId)
			.maybeSingle();

		const state = player.game_state || {};
		const worldState = state[worldId] || {};

		const alreadyEarned = worldState.training_coins_gained || 0;
		const maxPossibleEarned = world?.training_modules?.mentor?.maxLifetimeCoins ?? 50;
		const remainingToEarn = Math.max(0, maxPossibleEarned - alreadyEarned);
		const finalCoinsAwarded = Math.min(remainingToEarn, coinsAwarded);

		// Mark training completed and update metrics
		worldState.training_completed = true;
		worldState.training_coins_gained = alreadyEarned + finalCoinsAwarded;

		// Extract block correctness if submitted
		const blockCorrectA = parseInt(formData.get('block_correct_a') as string, 10);
		const blockCorrectB = parseInt(formData.get('block_correct_b') as string, 10);
		const blockCorrectC = parseInt(formData.get('block_correct_c') as string, 10);

		if (!isNaN(blockCorrectA)) worldState.block_correct_a = blockCorrectA;
		if (!isNaN(blockCorrectB)) worldState.block_correct_b = blockCorrectB;
		if (!isNaN(blockCorrectC)) worldState.block_correct_c = blockCorrectC;

		state[worldId] = worldState;

		const newCoins = player.coins + finalCoinsAwarded;

		const { error } = await db
			.from('course_players')
			.update({
				coins: newCoins,
				game_state: state
			})
			.eq('id', playerId);

		if (error) {
			return fail(400, { success: false, message: `Error al guardar: ${error.message}` });
		}

		return { 
			success: true, 
			coins: newCoins, 
			game_state: state, 
			coinsAwardedNow: finalCoinsAwarded,
			totalCoinsEarned: worldState.training_coins_gained
		};
	},

	submitDesignCanvas: async ({ request, cookies }) => {
		const playerId = cookies.get('player_id');
		if (!playerId) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const canvasDataStr = formData.get('canvas_data') as string;

		if (isNaN(worldId) || !canvasDataStr) {
			return fail(400, { success: false, message: 'Datos incompletos.' });
		}

		try {
			const canvasData = JSON.parse(canvasDataStr);

			// Fetch player current data
			const { data: player } = await db
				.from('course_players')
				.select('coins, game_state')
				.eq('id', playerId)
				.maybeSingle();

			if (!player) return fail(404, { success: false, message: 'Jugador no encontrado.' });

			const state = player.game_state || {};
			const worldState = state[worldId] || {};

			worldState.design_completed = true;
			worldState.design_canvas = canvasData;

			let newCoins = player.coins || 0;
			if (
				((worldId === 5 && Array.isArray(canvasData) && canvasData.length >= 3) ||
				 (worldId === 6 && Array.isArray(canvasData) && canvasData.length >= 1)) &&
				!worldState.design_coins_awarded
			) {
				newCoins += 15;
				worldState.design_coins_awarded = true;
			}

			state[worldId] = worldState;

			const { error } = await db
				.from('course_players')
				.update({ 
					coins: newCoins,
					game_state: state 
				})
				.eq('id', playerId);

			if (error) {
				return fail(400, { success: false, message: `Error de guardado: ${error.message}` });
			}

			return { success: true, game_state: state };
		} catch (e: any) {
			return fail(400, { success: false, message: `Error de formato JSON: ${e.message}` });
		}
	},

	unlockWikiResource: async ({ request, cookies }) => {
		const playerId = cookies.get('player_id');
		if (!playerId) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const resourceId = formData.get('resource_id') as string;

		if (isNaN(worldId) || !resourceId) {
			return fail(400, { success: false, message: 'Parámetros inválidos.' });
		}

		// The cost is never trusted from the client — it is looked up from the
		// world's own wiki catalog in the database.
		const { data: world } = await db
			.from('course_worlds')
			.select('wiki_modules')
			.eq('id', worldId)
			.maybeSingle();

		const resource = (world?.wiki_modules || []).find((r: any) => r.id === resourceId);
		if (!resource) {
			return fail(404, { success: false, message: 'Recurso no encontrado en la biblioteca de este mundo.' });
		}

		const cost = Number(resource.cost) || 0;

		// Fetch player data
		const { data: player } = await db
			.from('course_players')
			.select('coins, game_state')
			.eq('id', playerId)
			.maybeSingle();

		if (!player) return fail(404, { success: false, message: 'Jugador no encontrado.' });

		if (player.coins < cost) {
			return fail(400, { success: false, message: 'Monedas BEM insuficientes.' });
		}

		const state = player.game_state || {};
		const worldState = state[worldId] || {};
		const unlocked = worldState.unlocked_resources || [];

		if (!unlocked.includes(resourceId)) {
			unlocked.push(resourceId);
		}

		worldState.unlocked_resources = unlocked;
		state[worldId] = worldState;

		const newCoins = player.coins - cost;

		const { error } = await db
			.from('course_players')
			.update({
				coins: newCoins,
				game_state: state
			})
			.eq('id', playerId);

		if (error) {
			return fail(400, { success: false, message: `Error al canjear: ${error.message}` });
		}

		return { success: true, coins: newCoins, game_state: state };
	},

	submitWorkshopFeedback: async ({ request, cookies }) => {
		const playerId = cookies.get('player_id');
		const instanceCode = cookies.get('player_instance_code');

		if (!playerId || !instanceCode) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const playerName = formData.get('player_name') as string;
		const ratingEngagement = parseInt(formData.get('rating_engagement') as string, 10);
		const ratingDifficulty = parseInt(formData.get('rating_difficulty') as string, 10);
		const ratingPace = parseInt(formData.get('rating_pace') as string, 10);
		const ratingRelevance = parseInt(formData.get('rating_relevance') as string, 10);
		const comment = formData.get('comment') as string;
		const allowPublic = formData.get('allow_public') === 'true';

		if (isNaN(worldId) || isNaN(ratingEngagement) || isNaN(ratingDifficulty) || isNaN(ratingPace) || isNaN(ratingRelevance)) {
			return fail(400, { success: false, message: 'Métricas de evaluación incompletas.' });
		}

		const { error } = await db
			.from('workshop_feedback')
			.insert([{
				instance_code: instanceCode,
				world_id: worldId,
				player_name: playerName || 'Agente Anónimo',
				rating_engagement: ratingEngagement,
				rating_difficulty: ratingDifficulty,
				rating_pace: ratingPace,
				rating_relevance: ratingRelevance,
				comment: comment || '',
				allow_public: allowPublic
			}]);

		if (error) {
			return fail(400, { success: false, message: `Error al guardar retroalimentación: ${error.message}` });
		}

		// Save feedback done in game_state
		const { data: player } = await db
			.from('course_players')
			.select('game_state')
			.eq('id', playerId)
			.maybeSingle();

		if (player) {
			const state = player.game_state || {};
			const worldState = state[worldId] || {};
			worldState.workshop_feedback_submitted = true;
			state[worldId] = worldState;

			await db
				.from('course_players')
				.update({ game_state: state })
				.eq('id', playerId);
		}

		return { success: true, message: '¡Retroalimentación enviada! Gracias por ayudar a mejorar la academia OMIE.' };
	},

	setNarrativeViewed: async ({ request, cookies }) => {
		const playerId = cookies.get('player_id');
		if (!playerId) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const type = formData.get('type') as string;

		if (isNaN(worldId) || !type) {
			return fail(400, { success: false, message: 'Parámetros inválidos.' });
		}

		// Fetch player current data
		const { data: player } = await db
			.from('course_players')
			.select('game_state')
			.eq('id', playerId)
			.maybeSingle();

		if (!player) return fail(404, { success: false, message: 'Jugador no encontrado.' });

		const state = player.game_state || {};
		const worldState = state[worldId] || {};

		if (type === 'intro') {
			worldState.narrative_intro_viewed = true;
		} else {
			worldState.narrative_outro_viewed = true;
		}

		state[worldId] = worldState;

		const { error } = await db
			.from('course_players')
			.update({ game_state: state })
			.eq('id', playerId);

		if (error) {
			return fail(400, { success: false, message: `Error al guardar narrativa: ${error.message}` });
		}

		return { success: true, game_state: state };
	},

	logout: async ({ cookies, params }) => {
		const lang = params.lang || 'es';
		cookies.delete('player_id', { path: '/' });
		cookies.delete('player_instance_code', { path: '/' });
		throw redirect(303, `/${lang}`);
	}
};
