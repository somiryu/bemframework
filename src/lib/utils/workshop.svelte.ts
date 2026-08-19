import { onDestroy } from 'svelte';
import { supabase } from '$lib/supabase';

export function createWorkshopSession(
	initialPlayer: any,
	instance: any,
	worldId: number,
	onComplete: () => void
) {
	let player = $state(JSON.parse(JSON.stringify(initialPlayer)));
	let onlinePlayers = $state<any[]>([]);
	let allClassPlayers = $state<any[]>([]);
	let channel = $state<any>(null);

	// The admin panel marks the facilitator by writing game_state.is_super_user
	// (see loginAsSuperUserPlayer in routes/admin/+page.server.ts) — that flag,
	// not the player's email, is the single source of truth for host status.
	const isHost = $derived(player.game_state?.is_super_user === true);

	async function loadAllClassPlayers() {
		if (!supabase) return;
		const { data: players } = await supabase
			.from('course_players')
			.select('id, alias, game_state')
			.eq('instance_code', instance.code);
		if (players) {
			allClassPlayers = players;
		}
	}

	function safeSend(event: string, payload: any) {
		if (channel) {
			channel.send({
				type: 'broadcast',
				event,
				payload
			});
		} else {
			console.warn(`[Supabase Realtime] Canal no listo. Ignorando envío de evento: ${event}`);
		}
	}

	function initConnection(onBroadcast: (event: string, payload: any) => void) {
		if (!supabase) return;
		
		// World 1 has a different legacy channel ID structure, newer worlds include the world number
		const channelId = worldId === 1 
			? `workshop_session_omie_${instance.code}` 
			: `workshop_session_omie_w${worldId}_${instance.code}`;

		channel = supabase.channel(channelId, {
			config: { presence: { key: player.id } }
		});

		// Listen to broadcast events
		channel.on('broadcast', { event: '*' }, (payload: any) => {
			onBroadcast(payload.event, payload.payload);
		});

		// Listen to presence events
		channel.on('presence', { event: 'sync' }, () => {
			const state = channel.presenceState();
			const list: any[] = [];
			Object.keys(state).forEach((key) => {
				const user = state[key][0];
				if (user) list.push(user);
			});
			onlinePlayers = list;

			// If a new player joined who is not in our allClassPlayers list, reload it!
			const hasNewPlayer = list.some(op => op.playerId && !allClassPlayers.some(ap => ap.id === op.playerId));
			if (hasNewPlayer) {
				loadAllClassPlayers();
			}
		});

		channel.on('presence', { event: 'leave' }, ({ key }: any) => {
			onBroadcast('presence-leave', { playerId: key });
		});

		channel.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') {
				await channel.track({
					playerId: player.id,
					name: player.name,
					alias: player.alias
				});
			}
		});
	}

	async function updatePlayerGameState(newState: any, additionalFields: { coins?: number; avatar?: string } = {}) {
		player.game_state = newState;
		if (player.id) {
			const formData = new FormData();
			formData.append('game_state', JSON.stringify(newState));
			if (additionalFields.coins !== undefined) formData.append('coins', String(additionalFields.coins));
			if (additionalFields.avatar) formData.append('avatar', additionalFields.avatar);

			const res = await fetch('?/syncPlayerState', { method: 'POST', body: formData });
			if (!res.ok) {
				console.error('syncPlayerState error:', res.status, await res.text());
				throw new Error('Failed to sync player state');
			}
		}
	}

	// Host-only: persists the synchronized workshop state (current slide, mode,
	// round — shape varies per world) so late entrants and reconnects pick up
	// where the class is. Server-side this is gated on the caller's own
	// game_state.is_super_user flag, not on anything the client claims.
	async function syncWorkshopState(state: any) {
		const formData = new FormData();
		formData.append('instance_code', instance.code);
		formData.append('state', JSON.stringify(state));

		const res = await fetch('?/syncWorkshopState', { method: 'POST', body: formData });
		if (!res.ok) {
			console.error('syncWorkshopState error:', res.status, await res.text());
		}
	}

	function cleanup() {
		if (channel) {
			channel.unsubscribe();
			channel = null;
		}
	}

	return {
		get player() { return player; },
		set player(v) { player = v; },
		get onlinePlayers() { return onlinePlayers; },
		set onlinePlayers(v) { onlinePlayers = v; },
		get allClassPlayers() { return allClassPlayers; },
		set allClassPlayers(v) { allClassPlayers = v; },
		get channel() { return channel; },
		get isHost() { return isHost; },
		loadAllClassPlayers,
		initConnection,
		updatePlayerGameState,
		syncWorkshopState,
		safeSend,
		cleanup
	};
}
