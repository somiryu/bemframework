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

	// Every request is numbered when it's sent, and a response only lands if
	// nothing newer has landed first. Without this, a poll that left before the
	// facilitator pressed "Siguiente" could arrive after it and snap the screen
	// back to the old slide until the next poll.
	let sent = 0;
	let applied = 0;
	function apply(seq: number, next: T) {
		if (seq < applied) return;
		applied = seq;
		// An error message stays up until the room moves on (or the next send
		// succeeds, see post), not until the next background poll.
		if (next.state.step !== view.state.step || next.state.phase !== view.state.phase) error = null;
		view = next;
	}

	// A refresh asked for while one is in flight isn't dropped: it runs again
	// right after, so a ping that lands mid-request still gets the new state.
	let again = false;
	async function refresh() {
		if (inFlight) {
			again = true;
			return;
		}
		inFlight = true;
		const seq = ++sent;
		try {
			const res = await fetch(`/api/taller/${code}`, { cache: 'no-store' });
			if (res.ok) {
				apply(seq, await res.json());
			} else if (res.status === 401 || res.status === 403) {
				location.reload();
			}
		} catch {
			// Transient network blip — next poll retries.
		} finally {
			inFlight = false;
			if (again) {
				again = false;
				refresh();
			}
		}
	}

	// A state ping reaches every participant at the same instant; spreading
	// their refetches over ~0.8 s keeps a slide change from hitting the server
	// (and the free-tier database) as one spike. Pings arriving while one is
	// already scheduled collapse into it.
	let pingTimer: ReturnType<typeof setTimeout> | null = null;
	function refreshSoon() {
		if (pingTimer) return;
		pingTimer = setTimeout(() => {
			pingTimer = null;
			refresh();
		}, role === 'host' ? 0 : Math.random() * 800);
	}

	function ping(event: 'state' | 'answer') {
		channel?.send({ type: 'broadcast', event, payload: {} });
	}

	async function post(body: Record<string, unknown>) {
		const seq = ++sent;
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
		// hostCode is handled by HostLive directly; every body posted here
		// answers with the full live view.
		apply(seq, await res.json());
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
			channel.on('broadcast', { event: 'state' }, refreshSoon);
			if (role === 'host') channel.on('broadcast', { event: 'answer' }, refreshSoon);
			channel.subscribe();
		}
		timer = setInterval(refresh, pollMs);
		document.addEventListener('visibilitychange', onVisible);
		return stop;
	}

	function stop() {
		if (timer) clearInterval(timer);
		timer = null;
		if (pingTimer) clearTimeout(pingTimer);
		pingTimer = null;
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
