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

	const isHost = $derived(player.email === 'javier@f2p.co');

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
		});

		channel.subscribe(async (status: string) => {
			if (status === 'SUBSCRIBED') {
				await channel.track({
					playerId: player.id,
					name: player.name,
					alias: player.alias,
					email: player.email
				});
			}
		});
	}

	async function updatePlayerGameState(newState: any, additionalFields = {}) {
		player.game_state = newState;
		if (supabase && player.id) {
			await supabase
				.from('course_players')
				.update({
					game_state: newState,
					...additionalFields
				})
				.eq('id', player.id);
		}
	}

	onDestroy(() => {
		if (channel) {
			channel.unsubscribe();
		}
	});

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
		updatePlayerGameState
	};
}
