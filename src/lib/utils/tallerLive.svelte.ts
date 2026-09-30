import { supabase } from '$lib/supabase';

// Live sync for /[lang]/taller, same idea as createWorkshopSession in
// workshop.svelte.ts but with the server as the only source of truth:
//
// - /api/taller/[code] returns the whole view for the current slide.
// - A Supabase broadcast channel carries *pings only* ("state changed",
//   "someone answered"). Any client can send a broadcast with the anon key,
//   so a ping never carries data — receivers just refetch from the server.
// - Polling is the fallback (local DB mode has no Realtime, and channels drop).
//
// Pings are split so load stays linear: the facilitator's `state` ping makes
// every participant refetch; a participant's `answer` ping only wakes the
// facilitator, who needs the live response counter.

type Role = 'host' | 'participant';

export function createTallerLive<T extends { state: { step: number; phase: string } }>(
	code: string,
	initialView: T,
	role: Role
) {
	let view = $state<T>(initialView);
	let error = $state<string | null>(null);
	let channel: any = null;
	let timer: ReturnType<typeof setInterval> | null = null;
	let inFlight = false;

	const realtime = !!supabase;
	// Host needs a snappy counter; participants only need slide changes, which
	// normally arrive by ping — polling is just the safety net.
	const pollMs = role === 'host' ? 3000 : realtime ? 10000 : 3000;

	async function refresh() {
		if (inFlight) return;
		inFlight = true;
		try {
			const res = await fetch(`/api/taller/${code}`, { cache: 'no-store' });
			if (res.ok) {
				view = await res.json();
				error = null;
			} else if (res.status === 401 || res.status === 403) {
				location.reload();
			}
		} catch {
			// Transient network blip — next poll retries.
		} finally {
			inFlight = false;
		}
	}

	function ping(event: 'state' | 'answer') {
		channel?.send({ type: 'broadcast', event, payload: {} });
	}

	async function post(body: Record<string, unknown>) {
		const res = await fetch(`/api/taller/${code}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const msg = await res.json().catch(() => null);
			error = msg?.message || 'No se pudo enviar. Intenta de nuevo.';
			await refresh();
			return false;
		}
		view = await res.json();
		error = null;
		ping(body.type === 'answer' ? 'answer' : 'state');
		return true;
	}

	function onVisible() {
		if (document.visibilityState === 'visible') refresh();
	}

	function start() {
		if (supabase) {
			channel = supabase.channel(`taller_${code}`);
			channel.on('broadcast', { event: 'state' }, () => refresh());
			if (role === 'host') channel.on('broadcast', { event: 'answer' }, () => refresh());
			channel.subscribe();
		}
		timer = setInterval(refresh, pollMs);
		document.addEventListener('visibilitychange', onVisible);
		return stop;
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
		document.removeEventListener('visibilitychange', onVisible);
		if (channel) {
			supabase?.removeChannel(channel);
			channel = null;
		}
	}

	return {
		get view() {
			return view;
		},
		get error() {
			return error;
		},
		refresh,
		post,
		start
	};
}
