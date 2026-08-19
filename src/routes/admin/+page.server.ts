import { fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSubscribers } from '$lib/server/subscribers';
import { sendNewsletter, isBrevoConfigured } from '$lib/server/mailer';
import { db, DB_MODE } from '$lib/server/db';
import { supabase } from '$lib/supabase';

// Re-validates the session cookie against the database on every mutating action.
// The cookie alone is not proof of privilege — it must still resolve to a row
// in super_user via the same RPC the page load uses.
async function requireSuperUser(cookies: Cookies): Promise<string | null> {
	const superUserEmail = cookies.get('super_user_email') || null;
	if (!superUserEmail) return null;

	const { data: isSuper } = await db.rpc('is_super_user', { email_to_check: superUserEmail });
	return isSuper ? superUserEmail : null;
}

export const load: PageServerLoad = async ({ cookies }) => {
	const subscribers = await getSubscribers();
	
	// Read super_user_email from cookies to check session
	const superUserEmail = cookies.get('super_user_email') || null;
	let isSuperUser = false;
	
	let courseWorlds: any[] = [];
	let courseInstances: any[] = [];
	let coursePlayers: any[] = [];
	let feedbackTestimonies: any[] = [];

	if (superUserEmail) {
		// Double check against database using secure server-side RPC
		const { data: isSuper } = await db.rpc('is_super_user', { email_to_check: superUserEmail });

		if (isSuper) {
			isSuperUser = true;

			// Fetch BEM course data
			const { data: worlds } = await db
				.from('course_worlds')
				.select('*')
				.order('order_index', { ascending: true });
			courseWorlds = worlds || [];

			const { data: instances } = await db
				.from('course_instances')
				.select('*')
				.order('created_at', { ascending: false });
			courseInstances = instances || [];

			const { data: players } = await db
				.from('course_players')
				.select('*')
				.order('created_at', { ascending: false });
			coursePlayers = players || [];

			const { data: feedback } = await db
				.from('workshop_feedback')
				.select('*')
				.order('created_at', { ascending: false });
			feedbackTestimonies = feedback || [];
		}
	}

	return {
		subscribers,
		isBrevoConfigured,
		isSuperUser,
		superUserEmail,
		courseWorlds,
		courseInstances,
		coursePlayers,
		feedbackTestimonies
	};
};

export const actions: Actions = {
	// Original Newsletter Admin action preserved
	sendNewsletter: async ({ request }) => {
		try {
			const formData = await request.formData();
			const subject = (formData.get('subject') as string) || '';
			const htmlContent = (formData.get('htmlContent') as string) || '';

			if (!subject.trim()) {
				return fail(400, { success: false, message: 'El asunto es obligatorio.' });
			}

			if (!htmlContent.trim() || htmlContent === '<p><br></p>' || htmlContent === '<div><br></div>') {
				return fail(400, { success: false, message: 'El contenido del correo no puede estar vacío.' });
			}

			const subscribers = await getSubscribers();
			const emails = subscribers.map((sub) => sub.email);

			if (emails.length === 0) {
				return fail(400, { success: false, message: 'No hay suscriptores registrados para enviar el correo.' });
			}

			const result = await sendNewsletter({
				to: emails,
				subject: subject.trim(),
				htmlContent: htmlContent
			});

			if (result.success) {
				return {
					success: true,
					message: result.message,
					isSimulation: result.isSimulation,
					recipientsCount: result.recipientsCount
				};
			} else {
				return fail(500, { success: false, message: result.message });
			}
		} catch (error: any) {
			console.error('Error in sendNewsletter action:', error);
			return fail(500, {
				success: false,
				message: `Error interno al procesar el envío: ${error.message || error}`
			});
		}
	},

	// BEM Course Admin Actions
	loginAdmin: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = (formData.get('email') as string) || '';
		const password = (formData.get('password') as string) || '';

		const cleanEmail = email.trim().toLowerCase();
		const cleanPassword = password.trim();

		if (!cleanEmail || !cleanPassword) {
			return fail(400, { success: false, message: 'El correo y la contraseña son requeridos.' });
		}
		
		if (DB_MODE === 'supabase' && supabase) {
			// Authenticate using the official Supabase Auth API
			const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
				email: cleanEmail,
				password: cleanPassword
			});

			if (authError || !authData.user) {
				// Fallback to checking the super_user table in case auth user is configured directly in DB.
				// password is a pgcrypto hash — verified via RPC, never compared in plaintext.
				const { data: passwordOk } = await db.rpc('verify_super_user_password', {
					email_to_check: cleanEmail,
					password_to_check: cleanPassword
				});

				if (!passwordOk) {
					console.error('Supabase Auth error:', authError);
					return fail(400, {
						success: false,
						message: authError
							? `Error de autenticación: ${authError.message}`
							: 'Credenciales de superusuario incorrectas.'
					});
				}
			}

			// Double check if this user exists in our super_user roles table using secure RPC
			const { data: isSuper, error: dbError } = await db
				.rpc('is_super_user', { email_to_check: cleanEmail });

			if (dbError || !isSuper) {
				if (supabase.auth) await supabase.auth.signOut();
				return fail(403, { 
					success: false, 
					message: 'Acceso denegado: Este usuario no posee privilegios de Orquestador/Superusuario.' 
				});
			}
		} else {
			// Local Postgres mode authentication — password is a pgcrypto hash,
			// verified via RPC, never compared in plaintext.
			const { data: passwordOk, error: queryError } = await db.rpc('verify_super_user_password', {
				email_to_check: cleanEmail,
				password_to_check: cleanPassword
			});

			if (queryError || !passwordOk) {
				return fail(400, {
					success: false,
					message: 'Credenciales incorrectas para el usuario administrador local.'
				});
			}
		}

		// Set secure cookie using the sanitized email
		cookies.set('super_user_email', cleanEmail, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		return { success: true, message: 'Sesión iniciada con éxito como administrador.' };
	},

	logoutAdmin: async ({ cookies }) => {
		cookies.delete('super_user_email', { path: '/' });
		return { success: true, message: 'Sesión cerrada con éxito.' };
	},

	createInstance: async ({ request, cookies }) => {
		const superUserEmail = await requireSuperUser(cookies);
		if (!superUserEmail) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const rawCode = (formData.get('code') as string) || '';
		const code = rawCode.trim().toUpperCase().replace(/\s+/g, '-');

		if (!code) {
			return fail(400, { success: false, message: 'El código de clase es requerido.' });
		}

		const { error } = await db
			.from('course_instances')
			.insert({
				code,
				unlocked_worlds: [1],
				current_workshop_state: { world_id: 1, slide_index: 0 }
			});

		if (error) {
			console.error('Create instance error:', error);
			return fail(400, { success: false, message: `Error al instanciar clase: ${error.message || 'Código duplicado o inválido'}` });
		}

		return { success: true, message: `Clase ${code} creada exitosamente con el Mundo 1 desbloqueado.` };
	},

	toggleWorldUnlock: async ({ request, cookies }) => {
		const superUserEmail = await requireSuperUser(cookies);
		if (!superUserEmail) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const instanceCode = (formData.get('instance_code') as string) || '';
		const worldId = parseInt((formData.get('world_id') as string) || '0', 10);
		const action = (formData.get('action') as string) || 'unlock';

		if (!instanceCode || !worldId) {
			return fail(400, { success: false, message: 'Datos incompletos.' });
		}

		const { data: instance } = await db
			.from('course_instances')
			.select('unlocked_worlds')
			.eq('code', instanceCode)
			.maybeSingle();

		if (!instance) {
			return fail(404, { success: false, message: 'Instancia no encontrada.' });
		}

		let unlocked: number[] = Array.isArray(instance.unlocked_worlds) ? instance.unlocked_worlds : [];

		if (action === 'unlock') {
			if (!unlocked.includes(worldId)) {
				unlocked.push(worldId);
				unlocked.sort((a, b) => a - b);
			}
		} else {
			unlocked = unlocked.filter((id) => id !== worldId);
			if (unlocked.length === 0) unlocked = [1]; // Keep world 1 always unlocked
		}

		const { error } = await db
			.from('course_instances')
			.update({ unlocked_worlds: unlocked })
			.eq('code', instanceCode);

		if (error) {
			return fail(400, { success: false, message: `Error al actualizar: ${error.message}` });
		}

		return { success: true, message: `Mundo ${worldId} ${action === 'unlock' ? 'desbloqueado' : 'bloqueado'} para la clase ${instanceCode}.` };
	},

	loginAsSuperUserPlayer: async ({ request, cookies }) => {
		const superUserEmail = await requireSuperUser(cookies);
		if (!superUserEmail) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const code = (formData.get('code') as string) || '';

		if (!code.trim()) {
			return fail(400, { success: false, message: 'El código de la clase es requerido.' });
		}

		const cleanCode = code.trim().toUpperCase();

		// Check if player already exists to avoid wiping progress
		const { data: existingPlayer } = await db
			.from('course_players')
			.select('*')
			.eq('instance_code', cleanCode)
			.eq('email', superUserEmail)
			.maybeSingle();

		let player;
		let error;

		if (existingPlayer) {
			player = existingPlayer;
		} else {
			// Create Javier player profile only if it does not exist
			const { data: newPlayer, error: insertError } = await db
				.from('course_players')
				.insert({
					instance_code: cleanCode,
					email: superUserEmail,
					name: 'Javier Velásquez (Superuser)',
					alias: 'JavierBEM',
					avatar: 'eco-engineer',
					coins: 15,
					game_state: { is_super_user: true }
				})
				.select()
				.single();

			player = newPlayer;
			error = insertError;
		}

		if (error || !player) {
			console.error('Superuser login player error:', error);
			return fail(400, { success: false, message: `Error al crear jugador superusuario: ${error ? error.message : 'No data'}` });
		}

		// Set player session cookies
		cookies.set('player_id', player.id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		cookies.set('player_instance_code', cleanCode, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		throw redirect(303, `/es/learn`);
	}
};
