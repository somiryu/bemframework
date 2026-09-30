import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { CASES, Q1 } from '$lib/content/talleres/quienTieneLaCabeza';
import { getSession, getHostEmail, normalizeCode } from '$lib/server/taller';

// Facilitator-only CSV with every answer — the raw material for the
// «recetario» that goes out after the webinar.
export const GET: RequestHandler = async ({ params, cookies }) => {
	if (!(await getHostEmail(cookies))) throw error(403, 'Solo el facilitador puede descargar las respuestas.');

	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw error(404, 'Sala no encontrada.');

	const [{ data: participants }, { data: rows }] = await Promise.all([
		db.from('taller_participants').select('id, email').eq('session_code', code),
		db.from('taller_responses').select('*').eq('session_code', code)
	]);

	const emailOf = new Map((participants || []).map((p: any) => [p.id, p.email]));
	const titleOf = new Map<string, string>(CASES.map((c) => [c.id, c.title]));
	titleOf.set('vuelta', 'Dale la vuelta');

	const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
	const lines = [
		['email', 'slide', '¿Lo has hecho?', 'Deslizador (0 centauro – 100 invertido)', 'Texto', 'Actualizado'].map(cell).join(',')
	];
	for (const r of rows || []) {
		lines.push(
			[
				emailOf.get(r.participant_id),
				titleOf.get(r.slide_id) ?? r.slide_id,
				Number.isInteger(r.choice) ? Q1[r.choice] : '',
				r.scale ?? '',
				r.text ?? '',
				r.updated_at ? new Date(r.updated_at).toISOString() : ''
			]
				.map(cell)
				.join(',')
		);
	}

	return new Response('﻿' + lines.join('\n'), {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="taller-${code}.csv"`
		}
	});
};
