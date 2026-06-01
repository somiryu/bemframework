import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addSubscriber } from '$lib/server/subscribers';

export const POST: RequestHandler = async ({ request }) => {
	try {
		let email = '';
		let honeypot = '';

		const contentType = request.headers.get('content-type') || '';

		if (contentType.includes('application/json')) {
			const body = await request.json();
			email = body.email || '';
			honeypot = body.honeypot || body.b_username || '';
		} else {
			const formData = await request.formData();
			email = (formData.get('email') as string) || '';
			honeypot = (formData.get('honeypot') as string) || (formData.get('b_username') as string) || '';
		}

		email = email.trim();
		honeypot = honeypot.trim();

		// 1. Honeypot check: If filled, simulate silent success to deceive spam bots
		if (honeypot) {
			console.warn(`[Honeypot Triggered] Silently blocked subscription bot for: ${email}`);
			return json({
				success: true,
				message: 'Subscription successful (silent bot bypass)',
				bot: true
			});
		}

		// 2. Email validation
		if (!email) {
			return json({ success: false, message: 'El correo electrónico es requerido.' }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ success: false, message: 'Por favor, ingresa un correo electrónico válido.' }, { status: 400 });
		}

		// 3. Save subscriber
		const result = await addSubscriber(email);

		if (result.success) {
			return json({
				success: true,
				message: result.message === 'Already subscribed' 
					? '¡Ya estás suscrito a nuestro newsletter!' 
					: '¡Gracias por suscribirte a nuestro newsletter!'
			});
		} else {
			return json({
				success: false,
				message: 'Hubo un problema al guardar tu suscripción. Por favor, intenta de nuevo.'
			}, { status: 500 });
		}
	} catch (error: any) {
		console.error('Subscription API Exception:', error);
		return json({
			success: false,
			message: 'Error interno en el servidor al procesar la suscripción.'
		}, { status: 500 });
	}
};
