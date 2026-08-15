import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const BEM_MCP_SERVER_URL = env.BEM_MCP_SERVER_URL || 'https://bem-mcp.onrender.com/mcp';

export const POST: RequestHandler = async ({ request }) => {
	const GEMINI_API_KEY = env.GEMINI_API_KEY;
	const BEM_MCP_TOKEN = env.BEM_MCP_TOKEN;

	if (!GEMINI_API_KEY || !BEM_MCP_TOKEN) {
		throw error(500, 'Server misconfigured: missing GEMINI_API_KEY or BEM_MCP_TOKEN environment variables');
	}

	try {
		const { message, contextHistory } = await request.json();

		if (!message) {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		// 1. Opcional: Intentar consulta previa a BEM MCP Remoto en Render si se requiere contexto de la Vault
		let mcpContext = '';
		try {
			const mcpResponse = await fetch(BEM_MCP_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${BEM_MCP_TOKEN}`
				},
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'tools/call',
					params: {
						name: 'search_brain',
						arguments: { query: message }
					}
				})
			});

			if (mcpResponse.ok) {
				const mcpData = await mcpResponse.json();
				if (mcpData?.result?.content) {
					mcpContext = `\n\n[Contexto Teórico del BEM Brain MCP Server]:\n${JSON.stringify(mcpData.result.content)}`;
				}
			}
		} catch (mcpErr) {
			console.warn('BEM MCP Server no devolvió contexto directo o está iniciando en Render:', mcpErr);
		}

		// 2. Consulta a Google AI Studio (Gemini 1.5/2.0 API)
		const systemInstruction = `Eres el "Discípulo BEM", un copiloto experto y entusiasta de la teoría del BEM Framework (Behavior • Experience • Meaning). 
Tu misión es guiar al usuario en la exploración del sitio web, explicando con rigor pedagógico y científico los 7 Drivers Intrínsecos, la arquitectura MDA V2, el diseño de Feedback y la superación del condicionamiento operante (puntos/badges). 
Responde siempre de forma concisa, cercana y en formato Markdown. ${mcpContext}`;

		const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

		const geminiResponse = await fetch(geminiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contents: [
					...(contextHistory || []),
					{
						role: 'user',
						parts: [{ text: `${systemInstruction}\n\nPregunta del usuario: ${message}` }]
					}
				]
			})
		});

		if (!geminiResponse.ok) {
			const errorText = await geminiResponse.text();
			console.error('Gemini API Error:', errorText);
			return json({ 
				reply: `Hola. Soy el Discípulo BEM. Actualmente estoy operando en modo offline de contingencia. ${mcpContext ? 'Sin embargo, tengo acceso a la vault:' + mcpContext : ''}` 
			});
		}

		const geminiData = await geminiResponse.json();
		const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude procesar la respuesta en este momento.';

		return json({ reply });
	} catch (err: any) {
		console.error('Error en /api/disciple:', err);
		return json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
	}
};
