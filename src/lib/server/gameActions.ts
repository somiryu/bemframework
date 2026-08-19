// Shared server-side write path for player/workshop state.
//
// Every direct browser → Supabase write (the anon-key client in
// src/lib/supabase.ts) reaches course_players / course_instances through
// whatever RLS policy is configured there — today that policy is wide open.
// These actions are the replacement: the browser calls them, they resolve
// the caller from the session cookie, and only the server's service-role
// `db` client touches the database. Once every write path in the app goes
// through here, RLS on those tables can be locked down to service_role only
// without breaking anything.
//
// Imported by both +page.server.ts files that render game components:
// /learn (Training, via toggleIdea) and /learn/workshop/[instanceCode]/[worldId]
// (Workshop, via the shared session.updatePlayerGameState helper).

import { fail, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';

async function requirePlayer(cookies: RequestEvent['cookies']) {
	const playerId = cookies.get('player_id');
	if (!playerId) return null;

	const { data: player } = await db
		.from('course_players')
		.select('*')
		.eq('id', playerId)
		.maybeSingle();

	return player || null;
}

/**
 * Applies a player's own game_state / coins / avatar update. Mirrors the
 * client-side session.updatePlayerGameState(newState, additionalFields)
 * shape so call sites in the Workshop/Training components don't change —
 * only where that helper sends the write changes.
 *
 * is_super_user is never taken from the client: it's the flag that grants
 * host privileges (see workshop.svelte.ts isHost), and a player rewriting
 * their own game_state blob must not be able to grant it to themselves.
 */
export async function syncPlayerState({ request, cookies }: RequestEvent) {
	const player = await requirePlayer(cookies);
	if (!player) return fail(401, { success: false, message: 'No autorizado.' });

	const formData = await request.formData();
	const gameStateStr = formData.get('game_state') as string;
	const coinsStr = formData.get('coins') as string | null;
	const avatar = formData.get('avatar') as string | null;

	if (!gameStateStr) {
		return fail(400, { success: false, message: 'Estado de juego requerido.' });
	}

	let gameState: any;
	try {
		gameState = JSON.parse(gameStateStr);
	} catch {
		return fail(400, { success: false, message: 'Estado de juego inválido.' });
	}

	// Preserve the server's own record of host status regardless of what the
	// client submitted for it.
	if (player.game_state?.is_super_user === true) {
		gameState.is_super_user = true;
	} else {
		delete gameState.is_super_user;
	}

	const updatePayload: Record<string, any> = { game_state: gameState };

	if (coinsStr !== null) {
		const requestedCoins = parseInt(coinsStr, 10);
		if (!isNaN(requestedCoins)) {
			// Defense in depth: a single update can't jump coins further than a
			// generous headroom above the current balance, and never below zero.
			// This doesn't re-derive each world's exact scoring rules — that's
			// tracked separately — it just bounds the blast radius of a forged call.
			updatePayload.coins = Math.max(0, Math.min(requestedCoins, (player.coins || 0) + 100));
		}
	}

	if (avatar) {
		updatePayload.avatar = avatar;
	}

	const { error } = await db.from('course_players').update(updatePayload).eq('id', player.id);

	if (error) {
		return fail(400, { success: false, message: `Error al guardar: ${error.message}` });
	}

	return { success: true, coins: updatePayload.coins ?? player.coins, game_state: gameState };
}

/**
 * Host-only: clears every player's game_state for one world in the host's
 * own class instance, so a facilitator can re-run a workshop from scratch.
 */
export async function resetWorldProgress({ request, cookies }: RequestEvent) {
	const player = await requirePlayer(cookies);
	if (!player) return fail(401, { success: false, message: 'No autorizado.' });
	if (player.game_state?.is_super_user !== true) {
		return fail(403, { success: false, message: 'Solo el facilitador puede reiniciar el taller.' });
	}

	const formData = await request.formData();
	const worldId = parseInt(formData.get('world_id') as string, 10);
	const instanceCode = (formData.get('instance_code') as string) || '';
	const clearAvatar = formData.get('clear_avatar') === 'true';

	if (isNaN(worldId) || !instanceCode || instanceCode !== player.instance_code) {
		return fail(400, { success: false, message: 'Datos inválidos.' });
	}

	const { data: players } = await db
		.from('course_players')
		.select('id, game_state')
		.eq('instance_code', instanceCode);

	for (const p of players || []) {
		const newState = { ...(p.game_state || {}) };
		delete newState[worldId];
		delete newState[String(worldId)];

		const updatePayload: Record<string, any> = { game_state: newState };
		if (clearAvatar) updatePayload.avatar = null;

		await db.from('course_players').update(updatePayload).eq('id', p.id);
	}

	return { success: true };
}

/**
 * Host-only: writes the live synchronized workshop state (current slide,
 * mode, round) for the host's own class instance. The shape is opaque here
 * — each World*Workshop component defines its own current_workshop_state
 * fields — this only gates who is allowed to write it.
 */
export async function syncWorkshopState({ request, cookies }: RequestEvent) {
	const player = await requirePlayer(cookies);
	if (!player) return fail(401, { success: false, message: 'No autorizado.' });
	if (player.game_state?.is_super_user !== true) {
		return fail(403, { success: false, message: 'Solo el facilitador puede controlar la sesión.' });
	}

	const formData = await request.formData();
	const instanceCode = (formData.get('instance_code') as string) || '';
	const stateStr = formData.get('state') as string;

	if (!instanceCode || instanceCode !== player.instance_code || !stateStr) {
		return fail(400, { success: false, message: 'Datos inválidos.' });
	}

	let state: any;
	try {
		state = JSON.parse(stateStr);
	} catch {
		return fail(400, { success: false, message: 'Estado inválido.' });
	}

	const { error } = await db
		.from('course_instances')
		.update({ current_workshop_state: state })
		.eq('code', instanceCode);

	if (error) {
		return fail(400, { success: false, message: `Error al sincronizar: ${error.message}` });
	}

	return { success: true };
}
