import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { useCaseInstructions, type UseCaseId } from './useCases';

export interface GeminiContentPart {
	role: 'user' | 'model';
	parts: { text: string }[];
}

const baseSystemInstruction: Record<'es' | 'en', string> = {
	es: `Eres el "Discípulo BEM", un copiloto experto y entusiasta de la teoría del BEM Framework (Behavior • Experience • Meaning).
Tu misión es guiar al usuario en la exploración del sitio web, explicando con rigor pedagógico y científico los 7 Drivers Intrínsecos, la arquitectura MDA V2, el diseño de Feedback y la superación del condicionamiento operante (puntos/badges).
Responde siempre de forma concisa, cercana y en formato Markdown.`,
	en: `You are the "BEM Disciple", an expert and enthusiastic copilot for the theory behind the BEM Framework (Behavior • Experience • Meaning).
Your mission is to guide the user through the website, explaining the 7 Intrinsic Drivers, the MDA V2 architecture, Feedback design, and moving beyond operant conditioning (points/badges) with pedagogical and scientific rigor.
Always respond concisely, warmly, and in Markdown format.`
};

const offlineFallback: Record<'es' | 'en', string> = {
	es: 'Hola. Soy el Discípulo BEM. Actualmente estoy operando en modo offline de contingencia.',
	en: "Hi. I'm the BEM Disciple. I'm currently running in offline contingency mode."
};

const BEM_MCP_SERVER_URL = env.BEM_MCP_URL || 'https://bem-mcp.onrender.com/mcp';
const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.0-flash';

async function fetchMcpContext(message: string): Promise<string> {
	const BEM_MCP_TOKEN = env.BEM_MCP_TOKEN;
	if (!BEM_MCP_TOKEN) return '';

	try {
		const mcpResponse = await fetch(BEM_MCP_SERVER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${BEM_MCP_TOKEN}`
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
				return `\n\n[Contexto Teórico del BEM Brain MCP Server]:\n${JSON.stringify(mcpData.result.content)}`;
			}
		}
	} catch (mcpErr) {
		console.warn('BEM MCP Server no devolvió contexto directo o está iniciando en Render:', mcpErr);
	}

	return '';
}

export async function getDiscipleReply(params: {
	message: string;
	contextHistory: GeminiContentPart[];
	lang: 'es' | 'en';
	useCaseId?: UseCaseId;
}): Promise<{ reply: string; isFallback: boolean }> {
	const GEMINI_API_KEY = env.GOOGLE_AI_STUDIO_API_KEY;
	const BEM_MCP_TOKEN = env.BEM_MCP_TOKEN;

	if (!GEMINI_API_KEY || !BEM_MCP_TOKEN) {
		throw error(500, 'Server misconfigured: missing GOOGLE_AI_STUDIO_API_KEY or BEM_MCP_TOKEN environment variables');
	}

	const mcpContext = await fetchMcpContext(params.message);
	const useCaseInstruction = params.useCaseId
		? useCaseInstructions[params.useCaseId][params.lang]
		: '';

	const systemInstruction = `${baseSystemInstruction[params.lang]}${useCaseInstruction ? '\n' + useCaseInstruction : ''} ${mcpContext}`;

	const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

	const geminiResponse = await fetch(geminiUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [
				...(params.contextHistory || []),
				{
					role: 'user',
					parts: [
						{
							text: `${systemInstruction}\n\n${params.lang === 'es' ? 'Pregunta del usuario' : "User's question"}: ${params.message}`
						}
					]
				}
			]
		})
	});

	if (!geminiResponse.ok) {
		const errorText = await geminiResponse.text();
		console.error('Gemini API Error:', errorText);
		return {
			reply: offlineFallback[params.lang],
			isFallback: true
		};
	}

	const geminiData = await geminiResponse.json();
	const noReplyFallback =
		params.lang === 'es'
			? 'No pude procesar la respuesta en este momento.'
			: 'I could not process a response right now.';
	const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || noReplyFallback;

	return { reply, isFallback: false };
}
