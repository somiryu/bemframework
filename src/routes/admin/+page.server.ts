import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSubscribers } from '$lib/server/subscribers';
import { sendNewsletter, isBrevoConfigured } from '$lib/server/mailer';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ cookies }) => {
	const subscribers = await getSubscribers();
	
	// Read super_user_email from cookies to check session
	const superUserEmail = cookies.get('super_user_email') || null;
	let isSuperUser = false;
	
	let courseWorlds: any[] = [];
	let courseInstances: any[] = [];
	let coursePlayers: any[] = [];
	let feedbackTestimonies: any[] = [];

	if (superUserEmail && supabase) {
		// Double check against database using secure server-side RPC
		const { data: isSuper } = await supabase
			.rpc('is_super_user', { email_to_check: superUserEmail });

		if (isSuper) {
			isSuperUser = true;

			// Fetch BEM course data
			const { data: worlds } = await supabase
				.from('course_worlds')
				.select('*')
				.order('order_index', { ascending: true });
			courseWorlds = worlds || [];

			const { data: instances } = await supabase
				.from('course_instances')
				.select('*')
				.order('created_at', { ascending: false });
			courseInstances = instances || [];

			const { data: players } = await supabase
				.from('course_players')
				.select('*')
				.order('created_at', { ascending: false });
			coursePlayers = players || [];

			const { data: feedback } = await supabase
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

		if (!supabase) {
			return fail(500, { success: false, message: 'Supabase no está configurado.' });
		}

		// Authenticate using the official Supabase Auth API
		const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
			email: cleanEmail,
			password: cleanPassword
		});

		if (authError || !authData.user) {
			console.error('Supabase Auth error:', authError);
			return fail(400, { 
				success: false, 
				message: authError 
					? `Error de autenticación: ${authError.message}` 
					: 'Credenciales de superusuario incorrectas.' 
			});
		}

		// Double check if this authenticated user exists in our super_user roles table using secure RPC
		const { data: isSuper, error: dbError } = await supabase
			.rpc('is_super_user', { email_to_check: cleanEmail });

		if (dbError || !isSuper) {
			// Sign out immediately if not a super user
			await supabase.auth.signOut();
			return fail(403, { 
				success: false, 
				message: 'Acceso denegado: Este usuario no posee privilegios de Orquestador/Superusuario.' 
			});
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
		const superUserEmail = cookies.get('super_user_email');
		if (!superUserEmail || !supabase) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const code = (formData.get('code') as string) || '';

		if (!code.trim()) {
			return fail(400, { success: false, message: 'El código de la clase es requerido.' });
		}

		const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '-');

		const { error } = await supabase
			.from('course_instances')
			.insert([{ code: cleanCode, unlocked_worlds: [1] }]);

		if (error) {
			return fail(400, { success: false, message: `Error al crear la clase: ${error.message}` });
		}

		return { success: true, message: `Clase '${cleanCode}' creada exitosamente.` };
	},

	toggleWorldUnlock: async ({ request, cookies }) => {
		const superUserEmail = cookies.get('super_user_email');
		if (!superUserEmail || !supabase) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const code = formData.get('instance_code') as string;
		const worldId = parseInt(formData.get('world_id') as string, 10);
		const action = formData.get('action') as string; // 'unlock' or 'lock'

		if (!code || isNaN(worldId)) {
			return fail(400, { success: false, message: 'Parámetros inválidos.' });
		}

		// Fetch current unlocked worlds
		const { data: instance } = await supabase
			.from('course_instances')
			.select('unlocked_worlds')
			.eq('code', code)
			.single();

		if (!instance) {
			return fail(404, { success: false, message: 'Instancia no encontrada.' });
		}

		let unlocked: number[] = instance.unlocked_worlds || [];

		if (action === 'unlock') {
			if (!unlocked.includes(worldId)) {
				unlocked.push(worldId);
			}
		} else {
			unlocked = unlocked.filter((id) => id !== worldId);
			if (unlocked.length === 0) unlocked = [1]; // Keep world 1 always unlocked
		}

		const { error } = await supabase
			.from('course_instances')
			.update({ unlocked_worlds: unlocked })
			.eq('code', code);

		if (error) {
			return fail(400, { success: false, message: `Error al actualizar: ${error.message}` });
		}

		return { success: true, message: `Mundo actualizado correctamente para la clase ${code}.` };
	},

	updateWorldContent: async ({ request, cookies }) => {
		const superUserEmail = cookies.get('super_user_email');
		if (!superUserEmail || !supabase) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const worldIdStr = formData.get('world_id') as string;
		const orderIndex = parseInt(formData.get('order_index') as string, 10);
		const title = formData.get('title') as string;
		const narrativePlace = formData.get('narrative_place') as string;
		const narrativeObjective = formData.get('narrative_objective') as string;
		const narrativeMentor = formData.get('narrative_mentor') as string;

		// JSON fields
		const narrativeIntroStr = formData.get('narrative_intro') as string;
		const narrativeOutroStr = formData.get('narrative_outro') as string;
		const workshopModulesStr = formData.get('workshop_modules') as string;
		const trainingModulesStr = formData.get('training_modules') as string;
		const designModulesStr = formData.get('design_modules') as string;
		const wikiModulesStr = formData.get('wiki_modules') as string;

		if (!title || !narrativePlace || !narrativeObjective || !narrativeMentor || isNaN(orderIndex)) {
			return fail(400, { success: false, message: 'Campos obligatorios vacíos.' });
		}

		try {
			const payload = {
				order_index: orderIndex,
				title,
				narrative_place: narrativePlace,
				narrative_objective: narrativeObjective,
				narrative_mentor: narrativeMentor,
				narrative_intro: JSON.parse(narrativeIntroStr || '[]'),
				narrative_outro: JSON.parse(narrativeOutroStr || '[]'),
				workshop_modules: JSON.parse(workshopModulesStr || '{}'),
				training_modules: JSON.parse(trainingModulesStr || '{}'),
				design_modules: JSON.parse(designModulesStr || '{}'),
				wiki_modules: JSON.parse(wikiModulesStr || '[]')
			};

			let error;

			if (worldIdStr && worldIdStr !== 'new') {
				const worldId = parseInt(worldIdStr, 10);
				const { error: err } = await supabase
					.from('course_worlds')
					.update(payload)
					.eq('id', worldId);
				error = err;
			} else {
				const { error: err } = await supabase
					.from('course_worlds')
					.insert([payload]);
				error = err;
			}

			if (error) {
				return fail(400, { success: false, message: `Error al guardar en base de datos: ${error.message}` });
			}

			return { success: true, message: 'Contenido del mundo guardado correctamente.' };
		} catch (e: any) {
			return fail(400, { success: false, message: `Error de formato JSON: ${e.message}` });
		}
	},

	loginAsSuperUserPlayer: async ({ request, cookies }) => {
		const superUserEmail = cookies.get('super_user_email');
		if (!superUserEmail || !supabase) {
			return fail(401, { success: false, message: 'No autorizado.' });
		}

		const formData = await request.formData();
		const code = (formData.get('code') as string) || '';

		if (!code.trim()) {
			return fail(400, { success: false, message: 'El código de la clase es requerido.' });
		}

		const cleanCode = code.trim().toUpperCase();

		// Check if player already exists to avoid wiping progress
		const { data: existingPlayer } = await supabase
			.from('course_players')
			.select('*')
			.eq('instance_code', cleanCode)
			.eq('email', 'javier@f2p.co')
			.maybeSingle();

		let player;
		let error;

		if (existingPlayer) {
			player = existingPlayer;
		} else {
			// Create Javier player profile only if it does not exist
			const { data: newPlayer, error: insertError } = await supabase
				.from('course_players')
				.insert({
					instance_code: cleanCode,
					email: 'javier@f2p.co',
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

		// Save player session in secure cookies
		cookies.set('player_id', player.id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		cookies.set('player_instance_code', cleanCode, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		throw redirect(303, `/es/learn`);
	}
};
