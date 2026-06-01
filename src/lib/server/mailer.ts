import fs from 'fs';
import path from 'path';

export interface MailPayload {
	to: string[];
	subject: string;
	htmlContent: string;
}

// Read private environment variables safely
const BREVO_API_KEY = (import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY || '').trim();
const BREVO_SENDER_EMAIL = (import.meta.env.BREVO_SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'newsletter@bemframework.com').trim();
const BREVO_SENDER_NAME = (import.meta.env.BREVO_SENDER_NAME || process.env.BREVO_SENDER_NAME || 'BEM Framework').trim();

export const isBrevoConfigured = !!BREVO_API_KEY;

const SIMULATION_FILE_PATH = path.resolve('data/last_sent_simulation.html');

/**
 * Sends a newsletter to a list of email addresses.
 * Integrates directly with Brevo SMTP API, falling back to a comprehensive
 * local HTML preview simulation file if API credentials are not configured.
 */
export async function sendNewsletter({ to, subject, htmlContent }: MailPayload): Promise<{ success: boolean; message: string; isSimulation: boolean; recipientsCount: number }> {
	if (!to || to.length === 0) {
		return { success: false, message: 'No recipients specified', isSimulation: false, recipientsCount: 0 };
	}
	if (!subject.trim()) {
		return { success: false, message: 'Subject cannot be empty', isSimulation: false, recipientsCount: 0 };
	}
	if (!htmlContent.trim()) {
		return { success: false, message: 'HTML content cannot be empty', isSimulation: false, recipientsCount: 0 };
	}

	// 1. Simulation Mode (if Brevo is not configured)
	if (!isBrevoConfigured) {
		const formattedHtml = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Simulation Preview: ${subject}</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
		.simulation-banner { background: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
		.email-meta { background: white; padding: 15px; border-radius: 8px 8px 0 0; border: 1px solid #e5e7eb; border-bottom: 2px solid #f3f4f6; }
		.email-body { background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; min-height: 300px; }
		.meta-row { margin: 8px 0; font-size: 14px; }
		.meta-label { font-weight: bold; color: #4b5563; display: inline-block; width: 80px; }
	</style>
</head>
<body>
	<div class="simulation-banner">
		⚠️ MODO SIMULACIÓN - Brevo API Key no configurada en .env
	</div>
	<div class="email-meta">
		<div class="meta-row"><span class="meta-label">De:</span> ${BREVO_SENDER_NAME} &lt;${BREVO_SENDER_EMAIL}&gt;</div>
		<div class="meta-row"><span class="meta-label">Para:</span> ${to.join(', ')}</div>
		<div class="meta-row"><span class="meta-label">Asunto:</span> <strong>${subject}</strong></div>
		<div class="meta-row"><span class="meta-label">Fecha:</span> ${new Date().toLocaleString()}</div>
	</div>
	<div class="email-body">
		${htmlContent}
	</div>
</body>
</html>
		`;

		try {
			const dir = path.dirname(SIMULATION_FILE_PATH);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			fs.writeFileSync(SIMULATION_FILE_PATH, formattedHtml, 'utf-8');
			console.log(`Simulation email generated successfully. View it at: ${SIMULATION_FILE_PATH}`);
		} catch (error) {
			console.error('Error writing simulation file:', error);
		}

		return {
			success: true,
			message: `Simulado con éxito para ${to.length} destinatarios. Archivo de previsualización guardado en data/last_sent_simulation.html`,
			isSimulation: true,
			recipientsCount: to.length
		};
	}

	// 2. Real Send using Brevo HTTP API
	try {
		const recipients = to.map(email => ({ email }));

		const response = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'api-key': BREVO_API_KEY,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				sender: {
					name: BREVO_SENDER_NAME,
					email: BREVO_SENDER_EMAIL
				},
				to: recipients,
				subject: subject,
				htmlContent: htmlContent
			})
		});

		if (response.ok) {
			const responseData = await response.json();
			return {
				success: true,
				message: `Newsletter sent successfully via Brevo! Message ID: ${responseData.messageId || 'N/A'}`,
				isSimulation: false,
				recipientsCount: to.length
			};
		} else {
			const errorText = await response.text();
			console.error('Brevo SMTP API response error:', errorText);
			return {
				success: false,
				message: `Brevo SMTP API error: ${response.status} - ${errorText || response.statusText}`,
				isSimulation: false,
				recipientsCount: 0
			};
		}
	} catch (error: any) {
		console.error('Exception encountered while calling Brevo API:', error);
		return {
			success: false,
			message: `Connection exception: ${error.message || error}`,
			isSimulation: false,
			recipientsCount: 0
		};
	}
}
