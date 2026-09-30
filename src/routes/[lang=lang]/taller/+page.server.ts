import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, DB_MODE } from '$lib/server/db';
import { supabase } from '$lib/supabase';
import { WORKSHOP_ID, WORKSHOP_TITLE } from '$lib/content/talleres/quienTieneLaCabeza';
import { getHostEmail, getSession, normalizeCode, generateCode, normalizeState } from '$lib/server/taller';

// Entry point for /[lang]/taller: participants type the room code here;
// the facilitator (super_user) also gets the list of rooms and can open one.
export const load: PageServerLoad = async ({ cookies, url }) => {
	const hostEmail = await getHostEmail(cookies);
	let sessions: any[] = [];

	if (hostEmail) {
		const { data } = await db
			.from('taller_sessions')
			.select('*')
			.order('created_at', { ascending: false });
		sessions = (data || []).map((s: any) => ({ ...s, state: normalizeState(s.state) }));
	}

	return {
		hostEmail,
		sessions,
		prefillCode: normalizeCode(url.searchParams.get('sala') || ''),
		showHostLogin: url.searchParams.has('facilitador')
	};
};

export const actions: Actions = {
	join: async ({ request, params }) => {
		const form = await request.formData();
		const code = normalizeCode((form.get('code') as string) || '');
		if (!code) return fail(400, { joinError: 'Escribe el código de la sala.', code });

		const session = await getSession(code);
		if (!session) return fail(404, { joinError: `No encontramos la sala «${code}». Revisa el código.`, code });

		throw redirect(303, `/${params.lang}/taller/${code}`);
	},

	// Same credentials as /admin, and the same cookie, so a facilitator
	// already signed in there lands here signed in too.
	hostLogin: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = ((form.get('email') as string) || '').trim().toLowerCase();
		const password = ((form.get('password') as string) || '').trim();
		if (!email || !password) return fail(400, { hostError: 'Correo y contraseña son requeridos.' });

		let ok = false;
		const { data: passwordOk } = await db.rpc('verify_super_user_password', {
			email_to_check: email,
			password_to_check: password
		});
		ok = !!passwordOk;

		if (!ok && DB_MODE === 'supabase' && supabase) {
			const { data } = await supabase.auth.signInWithPassword({ email, password });
			ok = !!data?.user;
		}

		const { data: isSuper } = await db.rpc('is_super_user', { email_to_check: email });
		if (!ok || !isSuper) return fail(400, { hostError: 'Credenciales de facilitador incorrectas.' });

		cookies.set('super_user_email', email, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});
		return { hostOk: true };
	},

	create: async ({ request, cookies, params }) => {
		const hostEmail = await getHostEmail(cookies);
		if (!hostEmail) return fail(403, { createError: 'Solo el facilitador puede crear salas.' });

		const form = await request.formData();
		const title = ((form.get('title') as string) || '').trim() || WORKSHOP_TITLE;
		let code = normalizeCode((form.get('code') as string) || '');

		if (code) {
			if (code.length < 3 || code.length > 20) {
				return fail(400, { createError: 'El código debe tener entre 3 y 20 caracteres (letras y números).' });
			}
			if (await getSession(code)) return fail(400, { createError: `Ya existe una sala «${code}».` });
		} else {
			do code = generateCode();
			while (await getSession(code));
		}

		const { error } = await db.from('taller_sessions').insert({
			code,
			workshop: WORKSHOP_ID,
			title,
			state: { step: 0, phase: 'vote' },
			created_by: hostEmail
		});
		if (error) return fail(500, { createError: `No se pudo crear la sala: ${error.message}` });

		throw redirect(303, `/${params.lang}/taller/${code}/facilitador`);
	},

	hostLogout: async ({ cookies }) => {
		cookies.delete('super_user_email', { path: '/' });
		return { loggedOut: true };
	}
};
