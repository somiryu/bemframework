import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { CASES, Q1, SLIDES } from '$lib/content/talleres/quienTieneLaCabeza';
import { getSession, getHostEmail, normalizeCode, slideRows } from '$lib/server/taller';

// Facilitator-only CSV with every answer — the raw material for the
// «recetario» that goes out after the webinar.
export const GET: RequestHandler = async ({ params, cookies }) => {
	if (!(await getHostEmail(cookies))) throw error(403, 'Solo el facilitador puede descargar las respuestas.');

	const code = normalizeCode(params.code);
	const session = await getSession(code);
	if (!session) throw error(404, 'Sala no encontrada.');

	// Per slide, for the same reason as buildLiveView: a single query over the
	// whole room would be cut at PostgREST's 1000-row cap.
	const [{ data: participants }, perSlide] = await Promise.all([
		db.from('taller_participants').select('id, email').eq('session_code', code),
		Promise.all(SLIDES.filter((s) => s.kind !== 'intro').map((s) => slideRows(code, s.id)))
	]);
	const rows = perSlide.flat();

	const emailOf = new Map((participants || []).map((p: any) => [p.id, p.email]));
	const titleOf = new Map<string, string>(CASES.map((c) => [c.id, c.title]));
	titleOf.set('vuelta', 'Dale la vuelta');

	// A leading = + - @ (or tab/CR) makes Excel/Sheets run the cell as a
	// formula; participants write free text, so neutralize it with a quote.
	const cell = (v: unknown) => {
		let t = String(v ?? '');
		if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
		return `"${t.replace(/"/g, '""')}"`;
	};
	const lines = [
		['email', 'slide', '¿Lo has hecho?', 'Deslizador (0 centauro – 100 invertido)', 'Texto', 'Actualizado'].map(cell).join(',')
	];
	for (const r of rows) {
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
