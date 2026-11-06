// Motor de «OMIE · Sala de Crisis» sobre las tablas de /taller.
//
// - taller_sessions.state guarda la fase de la sala y, por ronda, el expediente
//   que ganó la votación (picks) y el resumen congelado al revelar (summaries).
//   Congelar evita que una respuesta tardía cambie un resultado ya mostrado.
// - taller_responses guarda una fila por (participante, casilla):
//     exp0        scale = 0–100
//     r{n}:vote   text  = id del expediente
//     r{n}:v1     choice = opción, scale = seguridad (1/3/5), text = argumento
//     r{n}:v2     choice = opción
//     budget      text  = "a,b,c,d"
//     integ       text  = frase
// - XP, rangos y marcadores no se guardan: se recalculan desde las respuestas.
//
// Las consultas van por casilla (≤ 1 fila por participante) por el tope de 1000
// filas de PostgREST, igual que en taller.ts.

import { db } from '$lib/server/db';
import { slideRows, saveAnswer, type TallerSession } from '$lib/server/taller';
import {
	EXPEDIENTES,
	GUILDS,
	CABECERA,
	MENTORS,
	RANKS,
	BUDGET,
	type CabeceraKey,
	type GuildId,
	type SalaCase,
	type Expediente
} from '$lib/content/talleres/salaDeCrisis';

export const STAGES = [
	'lobby',
	'guild',
	'exp0',
	'exp0r',
	'vote',
	'case',
	'mirror',
	'reveal',
	'budget',
	'budgetr',
	'integ',
	'close'
] as const;
export type Stage = (typeof STAGES)[number];
const ROUND_STAGES: Stage[] = ['vote', 'case', 'mirror', 'reveal'];
const FINAL_STAGES: Stage[] = ['budget', 'budgetr', 'integ', 'close'];

export interface RoundPick {
	exp: string;
	idx: number;
	tie: boolean;
	votes: Record<string, number>;
}

export interface GuildRound {
	n: number;
	a1: number;
	a2: number;
}

export interface RoundSummary {
	n: number;
	correct: number;
	v1: number[];
	v2: number[];
	/** flow[i][j]: cuántos pasaron de la opción i en el 1.er voto a la j en el 2.º */
	flow: number[][];
	guilds: Partial<Record<GuildId, GuildRound>>;
	best: GuildId | null;
}

export interface SalaState {
	stage: Stage;
	round: number;
	/** Rondas jugadas cuando la sala entra a la secuencia final. */
	played: number;
	/** Se incrementa en cada cambio de fase: es el «step» que usa createTallerLive. */
	seq: number;
	stageAt: number;
	picks: RoundPick[];
	summaries: (RoundSummary | null)[];
}

export const REVEAL_MS = 3200;

export function initialState(): SalaState {
	return {
		stage: 'lobby',
		round: 0,
		played: 0,
		seq: 0,
		stageAt: Date.now(),
		picks: [],
		summaries: []
	};
}

export function normalizeSalaState(raw: any): SalaState {
	const base = initialState();
	if (!raw || typeof raw !== 'object') return base;
	return {
		stage: STAGES.includes(raw.stage) ? raw.stage : 'lobby',
		round: Number.isInteger(raw.round) && raw.round >= 0 ? raw.round : 0,
		played: Number.isInteger(raw.played) && raw.played >= 0 ? raw.played : 0,
		seq: Number.isInteger(raw.seq) ? raw.seq : 0,
		stageAt: Number.isFinite(raw.stageAt) ? raw.stageAt : base.stageAt,
		picks: Array.isArray(raw.picks) ? raw.picks : [],
		summaries: Array.isArray(raw.summaries) ? raw.summaries : []
	};
}

// ---------------------------------------------------------------------------
// Expedientes y rondas
// ---------------------------------------------------------------------------

const EXP_BY_ID = new Map(EXPEDIENTES.map((e) => [e.id, e]));
export const expediente = (id: string) => EXP_BY_ID.get(id) as Expediente;
const unlockIndex = (id: string) => EXPEDIENTES.findIndex((e) => e.id === id);
/** Ronda (base 1) en que se abre un expediente. */
export const unlockRound = (id: string) => Math.max(1, unlockIndex(id));

function usedCases(state: SalaState, exp: string, round: number) {
	let n = 0;
	for (let k = 0; k < round; k++) if (state.picks[k]?.exp === exp) n++;
	return n;
}

/** Expedientes en concurso en una ronda: desbloqueados (ronda + 2) con casos pendientes. */
export function optionsFor(state: SalaState, round: number): string[] {
	return EXPEDIENTES.slice(0, Math.min(EXPEDIENTES.length, round + 2))
		.filter((e) => usedCases(state, e.id, round) < e.cases.length)
		.map((e) => e.id);
}

export type ExpStatus = 'open' | 'closed' | 'locked';
export function expStates(state: SalaState, round: number) {
	const opts = new Set(optionsFor(state, round));
	return EXPEDIENTES.map((e) => {
		const used = usedCases(state, e.id, round);
		const status: ExpStatus = opts.has(e.id)
			? 'open'
			: used >= e.cases.length
				? 'closed'
				: 'locked';
		return {
			id: e.id,
			name: e.name,
			kind: e.kind,
			teaser: e.teaser,
			mentor: e.mentor,
			status,
			caseNo: Math.min(used + 1, e.cases.length),
			total: e.cases.length,
			unlockRound: unlockRound(e.id)
		};
	});
}

export function caseFor(
	state: SalaState,
	round: number
): (SalaCase & { exp: Expediente; idx: number }) | null {
	const pick = state.picks[round];
	if (!pick) return null;
	const exp = expediente(pick.exp);
	return { ...exp.cases[pick.idx], exp, idx: pick.idx };
}

// ---------------------------------------------------------------------------
// Lectura de datos
// ---------------------------------------------------------------------------

export interface SalaParticipant {
	id: string;
	email: string;
	alias: string | null;
	guild: GuildId | null;
	mentor: CabeceraKey | null;
}

export async function participants(code: string): Promise<SalaParticipant[]> {
	const { data } = await db
		.from('taller_participants')
		.select('id, email, alias, guild, mentor')
		.eq('session_code', code);
	return (data || []) as SalaParticipant[];
}

async function myRows(code: string, pid: string) {
	const { data } = await db
		.from('taller_responses')
		.select('slide_id, choice, scale, text')
		.eq('session_code', code)
		.eq('participant_id', pid);
	return new Map<string, any>((data || []).map((r: any) => [r.slide_id as string, r]));
}

const slot = (round: number, kind: 'vote' | 'v1' | 'v2') => `r${round}:${kind}`;

// ---------------------------------------------------------------------------
// Resultados por ronda
// ---------------------------------------------------------------------------

async function votesFor(code: string, round: number, opts: string[]) {
	const rows = await slideRows(code, slot(round, 'vote'));
	const votes: Record<string, number> = Object.fromEntries(opts.map((o) => [o, 0]));
	for (const r of rows) if (r.text in votes) votes[r.text]++;
	return votes;
}

/** Gana la mayoría. Con empate, la «moneda de GIOCHI»: determinista por sala y ronda. */
async function decidePick(
	session: TallerSession,
	state: SalaState,
	round: number
): Promise<RoundPick> {
	const opts = optionsFor(state, round);
	const votes = await votesFor(session.code, round, opts);
	const max = Math.max(0, ...Object.values(votes));
	const tied = opts.filter((o) => votes[o] === max);
	let seed = round * 7 + 3;
	for (const ch of session.code) seed += ch.charCodeAt(0);
	const exp = tied[seed % tied.length];
	return { exp, idx: usedCases(state, exp, round), tie: tied.length > 1, votes };
}

interface Answer {
	pid: string;
	guild: GuildId | null;
	v1: number;
	conf: number;
	why: string;
	v2: number;
}

async function roundAnswers(
	code: string,
	round: number,
	people: SalaParticipant[]
): Promise<Answer[]> {
	const [v1rows, v2rows] = await Promise.all([
		slideRows(code, slot(round, 'v1')),
		slideRows(code, slot(round, 'v2'))
	]);
	const v2 = new Map(v2rows.map((r: any) => [r.participant_id, r.choice]));
	const guildOf = new Map(people.map((p) => [p.id, p.guild]));
	return v1rows
		.filter((r: any) => Number.isInteger(r.choice))
		.map((r: any) => ({
			pid: r.participant_id,
			guild: guildOf.get(r.participant_id) ?? null,
			v1: r.choice,
			conf: Number.isInteger(r.scale) ? r.scale : 1,
			why: (r.text || '').trim(),
			v2: Number.isInteger(v2.get(r.participant_id))
				? (v2.get(r.participant_id) as number)
				: r.choice
		}));
}

function summarize(answers: Answer[], correct: number): RoundSummary {
	const v1 = [0, 0, 0, 0];
	const v2 = [0, 0, 0, 0];
	const flow = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
	const guilds: Partial<Record<GuildId, GuildRound>> = {};
	for (const a of answers) {
		v1[a.v1]++;
		v2[a.v2]++;
		flow[a.v1][a.v2]++;
		if (a.guild) {
			const g = (guilds[a.guild] ??= { n: 0, a1: 0, a2: 0 });
			g.n++;
			if (a.v1 === correct) g.a1++;
			if (a.v2 === correct) g.a2++;
		}
	}
	for (const g of Object.values(guilds)) {
		g.a1 /= g.n;
		g.a2 /= g.n;
	}
	// Mejor deliberación: el gremio que más mejoró entre el 1.er y el 2.º voto.
	// Solo cuenta si mejoró algo; con empate gana el de mayor acierto final.
	let best: GuildId | null = null;
	let bestGain = 0;
	for (const [id, g] of Object.entries(guilds) as [GuildId, GuildRound][]) {
		const gain = g.a2 - g.a1;
		const cur = best ? guilds[best]! : null;
		if (gain > bestGain || (best && gain === bestGain && gain > 0 && g.a2 > cur!.a2)) {
			best = id;
			bestGain = gain;
		}
	}
	return { n: answers.length, correct, v1, v2, flow, guilds, best };
}

// ---------------------------------------------------------------------------
// XP, rangos y marcadores (derivados)
// ---------------------------------------------------------------------------

export const calOne = (v1: number, conf: number, correct: number) =>
	v1 === correct ? conf / 5 : (6 - conf) / 5;

export type XPLine = [string, number];

/** XP de una ronda: acertar pesa más que participar. Nunca resta. */
export function xpForRound(
	mine: { v1: number | null; conf: number | null; why: string | null; v2: number | null },
	summary: RoundSummary,
	guild: GuildId | null
): XPLine[] {
	const out: XPLine[] = [];
	if (mine.v1 == null) return out;
	const c = summary.correct;
	const v2 = mine.v2 ?? mine.v1;
	if (mine.v1 === c) {
		out.push(['Acierto en el primer voto', 20]);
		if (v2 === c) out.push(['Sostuviste la respuesta', 8]);
	} else if (v2 === c) out.push(['Llegaste a la respuesta al deliberar', 6]);
	if (mine.conf)
		out.push([
			`Calibración (seguridad ${mine.conf})`,
			Math.max(1, Math.round(4 * calOne(mine.v1, mine.conf, c)))
		]);
	if (mine.why && mine.why.trim()) out.push(['Argumento aportado', 2]);
	if (guild && summary.best === guild) out.push(['Tu gremio deliberó mejor', 4]);
	return out;
}

/** Rondas cuyo resultado ya se ve (la revelación en curso cuenta tras la cuenta regresiva). */
function revealedRounds(state: SalaState, now = Date.now()) {
	if (FINAL_STAGES.includes(state.stage)) return state.played;
	if (!ROUND_STAGES.includes(state.stage)) return 0;
	const inReveal = state.stage === 'reveal' && now - state.stageAt >= REVEAL_MS;
	return state.round + (inReveal ? 1 : 0);
}

const stageIndex = (s: Stage) => STAGES.indexOf(s);
const pastStage = (state: SalaState, s: Stage, now = Date.now()) => {
	const cur = stageIndex(state.stage);
	const target = stageIndex(s);
	if (cur > target) return true;
	// Las fases con cuenta regresiva cuentan cuando termina.
	return cur === target && now - state.stageAt >= REVEAL_MS;
};

export function rankIndex(xp: number) {
	let r = 0;
	RANKS.forEach((k, i) => {
		if (xp >= k.min) r = i;
	});
	return r;
}

function playerProgress(state: SalaState, rows: Map<string, any>, guild: GuildId | null) {
	const breakdown: { label: string; xp: number; lines?: XPLine[] }[] = [];
	const exp0 = rows.get('exp0');
	if (exp0 && Number.isInteger(exp0.scale) && pastStage(state, 'exp0r'))
		breakdown.push({ label: 'Expediente 0', xp: 10 });

	const cal: number[] = [];
	let moved = 0;
	let wrong = 0;
	let args = 0;
	const rounds = revealedRounds(state);
	for (let r = 0; r < rounds; r++) {
		const s = state.summaries[r];
		const cs = caseFor(state, r);
		if (!s || !cs) continue;
		const mine = roundMine(rows, r);
		const lines = xpForRound(mine, s, guild);
		const xp = lines.reduce((a, l) => a + l[1], 0);
		if (xp) breakdown.push({ label: `Ronda ${r + 1} · ${cs.title}`, xp, lines });
		if (mine.v1 != null) {
			if (mine.conf) cal.push(calOne(mine.v1, mine.conf, s.correct));
			if (mine.v1 !== s.correct) {
				wrong++;
				if ((mine.v2 ?? mine.v1) === s.correct) moved++;
			}
			if (mine.why && mine.why.trim()) args++;
		}
	}
	if (rows.get('budget') && pastStage(state, 'budgetr'))
		breakdown.push({ label: 'Gremio repara', xp: 10 });
	if (rows.get('integ') && stageIndex(state.stage) >= stageIndex('close'))
		breakdown.push({ label: 'Integración', xp: 10 });

	const xp = breakdown.reduce((a, b) => a + b.xp, 0);
	const ri = rankIndex(xp);
	return {
		xp,
		rank: ri,
		breakdown,
		markers: {
			cal: cal.length ? Math.round((cal.reduce((a, b) => a + b, 0) / cal.length) * 100) : null,
			moved,
			wrong,
			args
		}
	};
}

function roundMine(rows: Map<string, any>, r: number) {
	const v1 = rows.get(slot(r, 'v1'));
	const v2 = rows.get(slot(r, 'v2'));
	return {
		vote: (rows.get(slot(r, 'vote'))?.text as string) ?? null,
		v1: Number.isInteger(v1?.choice) ? (v1.choice as number) : null,
		conf: Number.isInteger(v1?.scale) ? (v1.scale as number) : null,
		why: (v1?.text as string) ?? null,
		v2: Number.isInteger(v2?.choice) ? (v2.choice as number) : null
	};
}

// ---------------------------------------------------------------------------
// Simulación de «Gremio repara»
// ---------------------------------------------------------------------------

export type Budget = Record<'a' | 'b' | 'c' | 'd', number>;

export function parseBudget(text: string | null | undefined): Budget | null {
	const parts = String(text || '')
		.split(',')
		.map(Number);
	if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0)) return null;
	if (parts.reduce((a, b) => a + b, 0) !== 10) return null;
	return { a: parts[0], b: parts[1], c: parts[2], d: parts[3] };
}

/** Reglas fijas del caso (no son datos reales): índice de uso por mes, antes = 100. */
export function curve(al: Budget): number[] {
	return [1, 2, 3, 4].map((m) =>
		Math.max(
			15,
			100 +
				al.d * (13 - 6.5 * (m - 1)) +
				al.a * 3 +
				al.b * (1.5 + 2.2 * (m - 1)) +
				al.c * (1.5 + 2.6 * (m - 1))
		)
	);
}

async function guildBudgets(code: string, people: SalaParticipant[]) {
	const rows = await slideRows(code, 'budget');
	const guildOf = new Map(people.map((p) => [p.id, p.guild]));
	const acc: Partial<Record<GuildId, { n: number; sum: Budget }>> = {};
	for (const r of rows) {
		const b = parseBudget(r.text);
		const g = guildOf.get(r.participant_id);
		if (!b || !g) continue;
		const e = (acc[g] ??= { n: 0, sum: { a: 0, b: 0, c: 0, d: 0 } });
		e.n++;
		for (const k of ['a', 'b', 'c', 'd'] as const) e.sum[k] += b[k];
	}
	return GUILDS.map((g) => {
		const e = acc[g.id];
		if (!e)
			return { guild: g.id, n: 0, avg: null as Budget | null, curve: null as number[] | null };
		const avg = { a: e.sum.a / e.n, b: e.sum.b / e.n, c: e.sum.c / e.n, d: e.sum.d / e.n };
		return { guild: g.id, n: e.n, avg, curve: curve(avg) };
	});
}

// ---------------------------------------------------------------------------
// Transiciones del facilitador
// ---------------------------------------------------------------------------

async function freezeRound(session: TallerSession, state: SalaState, round: number) {
	const cs = caseFor(state, round);
	if (!cs) return;
	const people = await participants(session.code);
	const answers = await roundAnswers(session.code, round, people);
	state.summaries[round] = summarize(answers, cs.correct);
}

function enter(state: SalaState, stage: Stage, round = state.round): SalaState {
	return { ...state, stage, round, seq: state.seq + 1, stageAt: Date.now() };
}

export async function advance(
	session: TallerSession,
	raw: SalaState,
	to: 'next' | 'prev' | 'final'
): Promise<SalaState> {
	const s: SalaState = { ...raw, picks: [...raw.picks], summaries: [...raw.summaries] };
	const r = s.round;

	if (to === 'final') {
		if (FINAL_STAGES.includes(s.stage)) return s;
		let played = 0;
		if (ROUND_STAGES.includes(s.stage)) {
			if (s.stage === 'vote') played = r;
			else {
				if (!s.summaries[r] || s.stage !== 'reveal') await freezeRound(session, s, r);
				played = r + 1;
			}
		}
		s.played = played;
		s.picks = s.picks.slice(0, played);
		s.summaries = s.summaries.slice(0, played);
		return enter(s, 'budget', Math.max(0, played - 1));
	}

	if (to === 'next') {
		switch (s.stage) {
			case 'lobby':
				return enter(s, 'guild');
			case 'guild':
				return enter(s, 'exp0');
			case 'exp0':
				return enter(s, 'exp0r');
			case 'exp0r':
				return enter(s, 'vote', 0);
			case 'vote': {
				// Si se volvió de Caso a Votación y la ronda ya tiene respuestas, se conserva
				// el expediente elegido: recalcularlo evaluaría esas respuestas contra otro caso.
				const answered = s.picks[r]
					? (await slideRows(session.code, slot(r, 'v1'))).length > 0
					: false;
				if (!answered) s.picks[r] = await decidePick(session, s, r);
				s.picks = s.picks.slice(0, r + 1);
				s.summaries = s.summaries.slice(0, r);
				return enter(s, 'case');
			}
			case 'case':
				return enter(s, 'mirror');
			case 'mirror':
				await freezeRound(session, s, r);
				return enter(s, 'reveal');
			case 'reveal':
				if (optionsFor(s, r + 1).length > 0) return enter(s, 'vote', r + 1);
				s.played = r + 1;
				return enter(s, 'budget');
			case 'budget':
				return enter(s, 'budgetr');
			case 'budgetr':
				return enter(s, 'integ');
			case 'integ':
				return enter(s, 'close');
			default:
				return s;
		}
	}

	// prev
	switch (s.stage) {
		case 'guild':
			return enter(s, 'lobby');
		case 'exp0':
			return enter(s, 'guild');
		case 'exp0r':
			return enter(s, 'exp0');
		case 'vote':
			return r === 0 ? enter(s, 'exp0r', 0) : enter(s, 'reveal', r - 1);
		case 'case':
			return enter(s, 'vote');
		case 'mirror':
			return enter(s, 'case');
		case 'reveal':
			return enter(s, 'mirror');
		case 'budget':
			return s.played > 0 ? enter(s, 'reveal', s.played - 1) : enter(s, 'exp0r', 0);
		case 'budgetr':
			return enter(s, 'budget');
		case 'integ':
			return enter(s, 'budgetr');
		case 'close':
			return enter(s, 'integ');
		default:
			return s;
	}
}

// ---------------------------------------------------------------------------
// Respuestas de los cadetes
// ---------------------------------------------------------------------------

export class SalaInputError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

const MAX_WHY = 160;
const MAX_INTEG = 200;

export async function saveProfile(
	session: TallerSession,
	state: SalaState,
	me: SalaParticipant,
	body: any
) {
	const guild = GUILDS.some((g) => g.id === body.guild) ? (body.guild as GuildId) : undefined;
	const mentor = CABECERA.includes(body.mentor) ? (body.mentor as CabeceraKey) : undefined;
	// El gremio se puede cambiar mientras la sala está eligiendo; después solo
	// pueden elegirlo quienes llegan tarde y todavía no tienen.
	const open = state.stage === 'lobby' || state.stage === 'guild';
	const patch: Record<string, string> = {};
	if (guild && (open || !me.guild)) patch.guild = guild;
	if (mentor && (open || !me.mentor)) patch.mentor = mentor;
	if (!Object.keys(patch).length)
		throw new SalaInputError(409, 'Tu gremio y tu mentor ya quedaron elegidos.');
	const { error } = await db.from('taller_participants').update(patch).eq('id', me.id);
	if (error) throw new SalaInputError(500, 'No se pudo guardar tu elección.');
}

export async function saveSalaAnswer(
	session: TallerSession,
	state: SalaState,
	me: SalaParticipant,
	body: any
) {
	const code = session.code;
	const r = state.round;
	const kind = String(body.slot || '');
	const closed = () => new SalaInputError(409, 'Esta fase ya se cerró. Mira la pantalla.');

	if (kind === 'exp0') {
		if (state.stage !== 'exp0') throw closed();
		const v = Number(body.value);
		if (!Number.isInteger(v) || v < 0 || v > 100) throw new SalaInputError(400, 'Valor inválido.');
		return check(await saveAnswer(code, me.id, 'exp0', { choice: null, scale: v, text: null }));
	}
	if (kind === 'vote') {
		if (state.stage !== 'vote') throw closed();
		const exp = String(body.exp || '');
		if (!optionsFor(state, r).includes(exp))
			throw new SalaInputError(400, 'Ese expediente no está en concurso.');
		return check(
			await saveAnswer(code, me.id, slot(r, 'vote'), { choice: null, scale: null, text: exp })
		);
	}
	if (kind === 'v1') {
		if (state.stage !== 'case') throw closed();
		const opt = Number(body.option);
		const conf = Number(body.conf);
		if (!Number.isInteger(opt) || opt < 0 || opt > 3)
			throw new SalaInputError(400, 'Elige una opción.');
		if (![1, 3, 5].includes(conf)) throw new SalaInputError(400, 'Elige qué tan seguro estás.');
		if (conf === 5) {
			const rows = await myRows(code, me.id);
			if (playerProgress(state, rows, me.guild).rank < 1)
				throw new SalaInputError(403, 'La seguridad 5 se abre con el rango Analista.');
		}
		const why =
			String(body.why ?? '')
				.trim()
				.slice(0, MAX_WHY) || null;
		return check(
			await saveAnswer(code, me.id, slot(r, 'v1'), { choice: opt, scale: conf, text: why })
		);
	}
	if (kind === 'v2') {
		if (state.stage !== 'mirror') throw closed();
		const opt = Number(body.option);
		if (!Number.isInteger(opt) || opt < 0 || opt > 3)
			throw new SalaInputError(400, 'Elige una opción.');
		const rows = await myRows(code, me.id);
		if (!rows.get(slot(r, 'v1')))
			throw new SalaInputError(409, 'No respondiste el caso en el primer voto.');
		return check(
			await saveAnswer(code, me.id, slot(r, 'v2'), { choice: opt, scale: null, text: null })
		);
	}
	if (kind === 'budget') {
		if (state.stage !== 'budget') throw closed();
		const b = parseBudget(body.budget);
		if (!b) throw new SalaInputError(400, 'Reparte exactamente 10 Puntos de Recurso.');
		return check(
			await saveAnswer(code, me.id, 'budget', {
				choice: null,
				scale: null,
				text: [b.a, b.b, b.c, b.d].join(',')
			})
		);
	}
	if (kind === 'integ') {
		if (state.stage !== 'integ') throw closed();
		const text = String(body.text ?? '')
			.trim()
			.slice(0, MAX_INTEG);
		if (!text) throw new SalaInputError(400, 'Escribe tu frase antes de enviarla.');
		return check(await saveAnswer(code, me.id, 'integ', { choice: null, scale: null, text }));
	}
	throw new SalaInputError(400, 'Respuesta desconocida.');
}

function check(res: { error: any }) {
	if (res?.error) throw new SalaInputError(500, 'No se pudo guardar tu respuesta.');
}

// ---------------------------------------------------------------------------
// Vistas
// ---------------------------------------------------------------------------

function base(session: TallerSession, state: SalaState, count: number) {
	return {
		code: session.code,
		title: session.title,
		// createTallerLive compara step/phase para saber si la sala cambió.
		state: { step: state.seq, phase: state.stage },
		stage: state.stage,
		round: state.round,
		played: state.played,
		stageAge: Date.now() - state.stageAt,
		participantCount: count
	};
}

function publicCase(cs: NonNullable<ReturnType<typeof caseFor>>, withAnswer: boolean) {
	return {
		exp: { id: cs.exp.id, name: cs.exp.name, kind: cs.exp.kind, mentor: cs.exp.mentor },
		idx: cs.idx,
		total: cs.exp.cases.length,
		title: cs.title,
		setup: cs.setup,
		ficha: cs.ficha,
		q: cs.q,
		options: cs.options.map((o) => o.t),
		...(withAnswer ? { correct: cs.correct, explain: cs.explain, next: cs.next } : {})
	};
}

/** Argumentos reales de la sala por opción; si nadie escribió, el argumento de contenido. */
function argumentsByOption(
	answers: Answer[],
	cs: SalaCase,
	people: SalaParticipant[],
	excludePid?: string
) {
	const alias = new Map(people.map((p) => [p.id, p]));
	return [0, 1, 2, 3].map((i) => {
		const chose = answers.filter((a) => a.v1 === i);
		const written = chose.filter((a) => a.why && a.pid !== excludePid);
		// Sin repetidos: tres argumentos distintos, los más recientes.
		const seen = new Set<string>();
		const quotes = written
			.slice()
			.reverse()
			.filter((a) => {
				const k = a.why.toLowerCase();
				if (seen.has(k)) return false;
				seen.add(k);
				return true;
			})
			.slice(0, 3)
			.map((a) => ({ text: a.why, guild: alias.get(a.pid)?.guild ?? null }));
		return {
			count: chose.length,
			quotes: quotes.length ? quotes : chose.length ? [{ text: cs.options[i].a, guild: null }] : []
		};
	});
}

function guildDist(answers: Answer[], key: 'v1' | 'v2') {
	return [0, 1, 2, 3].map((i) => {
		const o: Partial<Record<GuildId, number>> = {};
		for (const a of answers) if (a[key] === i && a.guild) o[a.guild] = (o[a.guild] ?? 0) + 1;
		return o;
	});
}

export async function buildPlayerView(
	session: TallerSession,
	state: SalaState,
	me: SalaParticipant
) {
	const code = session.code;
	const [people, rows] = await Promise.all([participants(code), myRows(code, me.id)]);
	const progress = playerProgress(state, rows, me.guild);
	const r = state.round;
	const view: any = {
		...base(session, state, people.length),
		me: {
			alias: me.alias,
			guild: me.guild,
			mentor: me.mentor,
			...progress,
			canFive: progress.rank >= 1,
			hint: progress.rank >= 2
		},
		data: null
	};

	switch (state.stage) {
		case 'exp0':
			view.data = { mine: rows.get('exp0')?.scale ?? null };
			break;
		case 'exp0r': {
			const all = (await slideRows(code, 'exp0')).filter((x: any) => Number.isInteger(x.scale));
			const guildOf = new Map(people.map((p) => [p.id, p.guild]));
			const avg = (xs: number[]) =>
				xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
			view.data = {
				mine: rows.get('exp0')?.scale ?? null,
				room: avg(all.map((x: any) => x.scale)),
				guild: avg(
					all
						.filter((x: any) => guildOf.get(x.participant_id) === me.guild)
						.map((x: any) => x.scale)
				)
			};
			break;
		}
		case 'vote':
			view.data = {
				options: optionsFor(state, r),
				expedientes: expStates(state, r),
				mine: roundMine(rows, r).vote
			};
			break;
		case 'case': {
			const cs = caseFor(state, r)!;
			const pick = state.picks[r];
			view.data = {
				case: publicCase(cs, false),
				hint: progress.rank >= 2 ? cs.hint : null,
				tie: pick.tie,
				votedWinner: roundMine(rows, r).vote === pick.exp,
				mine: roundMine(rows, r)
			};
			break;
		}
		case 'mirror': {
			const cs = caseFor(state, r)!;
			const answers = await roundAnswers(code, r, people);
			const mine = roundMine(rows, r);
			view.data = {
				case: publicCase(cs, false),
				mine,
				room: [0, 1, 2, 3].map((i) => answers.filter((a) => a.v1 === i).length),
				guild: [0, 1, 2, 3].map(
					(i) => answers.filter((a) => a.v1 === i && a.guild === me.guild).length
				),
				args: argumentsByOption(answers, cs, people, me.id)
			};
			break;
		}
		case 'reveal': {
			const cs = caseFor(state, r)!;
			const s = state.summaries[r]!;
			const mine = roundMine(rows, r);
			view.data = {
				case: publicCase(cs, true),
				mentorLine: cs.mine[me.mentor ?? 'sara'],
				answer: mine,
				summary: s,
				lines: xpForRound(mine, s, me.guild)
			};
			break;
		}
		case 'budget':
			view.data = { mine: parseBudget(rows.get('budget')?.text) };
			break;
		case 'budgetr': {
			const g = (await guildBudgets(code, people)).find((x) => x.guild === me.guild) ?? null;
			const mine = parseBudget(rows.get('budget')?.text);
			view.data = { guild: g, mine, mineCurve: mine ? curve(mine) : null };
			break;
		}
		case 'integ':
			view.data = { mine: rows.get('integ')?.text ?? null };
			break;
		case 'close': {
			const trajectory = [];
			for (let k = 0; k < state.played; k++) {
				const cs = caseFor(state, k);
				const m = roundMine(rows, k);
				if (!cs || m.v1 == null) continue;
				trajectory.push({
					round: k,
					title: cs.title,
					correct: cs.correct,
					v1: m.v1,
					v2: m.v2 ?? m.v1,
					conf: m.conf
				});
			}
			view.data = { trajectory };
			break;
		}
	}
	return view;
}

export async function buildHostView(session: TallerSession, state: SalaState) {
	const code = session.code;
	const people = await participants(code);
	const r = state.round;
	const view: any = { ...base(session, state, people.length), responseCount: 0, data: null };
	const countSlot = async (id: string) => (await slideRows(code, id)).length;

	switch (state.stage) {
		case 'lobby':
			view.data = { aliases: people.map((p) => ({ alias: p.alias, guild: p.guild })) };
			break;
		case 'guild':
			view.data = {
				guilds: Object.fromEntries(
					GUILDS.map((g) => [g.id, people.filter((p) => p.guild === g.id).length])
				),
				mentors: Object.fromEntries(
					CABECERA.map((m) => [m, people.filter((p) => p.mentor === m).length])
				)
			};
			view.responseCount = people.filter((p) => p.guild && p.mentor).length;
			break;
		case 'exp0':
			view.responseCount = await countSlot('exp0');
			break;
		case 'exp0r': {
			const all = (await slideRows(code, 'exp0')).filter((x: any) => Number.isInteger(x.scale));
			const guildOf = new Map(people.map((p) => [p.id, p.guild]));
			const bins = [0, 0, 0, 0, 0];
			for (const x of all) bins[Math.min(4, Math.floor(x.scale / 20))]++;
			const avg = (xs: number[]) =>
				xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
			view.responseCount = all.length;
			view.data = {
				avg: avg(all.map((x: any) => x.scale)),
				bins,
				guilds: Object.fromEntries(
					GUILDS.map((g) => [
						g.id,
						avg(
							all
								.filter((x: any) => guildOf.get(x.participant_id) === g.id)
								.map((x: any) => x.scale)
						)
					])
				)
			};
			break;
		}
		case 'vote': {
			const opts = optionsFor(state, r);
			const votes = await votesFor(code, r, opts);
			view.responseCount = Object.values(votes).reduce((a, b) => a + b, 0);
			view.data = { options: opts, votes, expedientes: expStates(state, r) };
			break;
		}
		case 'case': {
			const cs = caseFor(state, r)!;
			view.responseCount = await countSlot(slot(r, 'v1'));
			view.data = { case: publicCase(cs, true), pick: state.picks[r] };
			break;
		}
		case 'mirror': {
			const cs = caseFor(state, r)!;
			const answers = await roundAnswers(code, r, people);
			const conf = [0, 1, 2, 3].map((i) => {
				const xs = answers.filter((a) => a.v1 === i).map((a) => a.conf);
				return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
			});
			view.responseCount = await countSlot(slot(r, 'v2'));
			view.data = {
				case: publicCase(cs, true),
				total: answers.length,
				dist: guildDist(answers, 'v1'),
				conf,
				args: argumentsByOption(answers, cs, people)
			};
			break;
		}
		case 'reveal': {
			const cs = caseFor(state, r)!;
			view.data = {
				case: publicCase(cs, true),
				summary: state.summaries[r],
				hasMore: optionsFor(state, r + 1).length > 0
			};
			break;
		}
		case 'budget':
			view.responseCount = await countSlot('budget');
			view.data = { options: BUDGET };
			break;
		case 'budgetr':
			view.data = { guilds: await guildBudgets(code, people) };
			break;
		case 'integ': {
			const rows = (await slideRows(code, 'integ')).filter((x: any) => (x.text || '').trim());
			rows.sort((a: any, b: any) => String(a.updated_at).localeCompare(String(b.updated_at)));
			view.responseCount = rows.length;
			// Anónimo: solo el texto.
			view.data = { wall: rows.map((x: any) => x.text.trim()) };
			break;
		}
		case 'close':
			view.data = await closingData(code, state, people);
			break;
	}
	return view;
}

async function closingData(code: string, state: SalaState, people: SalaParticipant[]) {
	const rounds = state.played;
	const perRound = await Promise.all(
		Array.from({ length: rounds }, (_, k) => roundAnswers(code, k, people))
	);
	const byPid = new Map(people.map((p) => [p.id, p]));

	// Gremio que mejor deliberó: suma de ganancias (2.º voto − 1.º) en todas las rondas.
	const gain: Partial<Record<GuildId, number>> = {};
	const acc2: Partial<Record<GuildId, number[]>> = {};
	state.summaries.slice(0, rounds).forEach((s) => {
		if (!s) return;
		for (const [g, v] of Object.entries(s.guilds) as [GuildId, GuildRound][]) {
			gain[g] = (gain[g] ?? 0) + (v.a2 - v.a1);
			(acc2[g] ??= []).push(v.a2);
		}
	});
	const bestDelib =
		(Object.entries(gain) as [GuildId, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

	// Más calibrado (mínimo 2 rondas respondidas) y apuesta más valiente.
	const cal = new Map<string, number[]>();
	let brave: { pid: string; round: number } | null = null;
	perRound.forEach((answers, k) => {
		const c = state.summaries[k]?.correct;
		if (c == null) return;
		for (const a of answers) {
			const xs = cal.get(a.pid) ?? [];
			xs.push(calOne(a.v1, a.conf, c));
			cal.set(a.pid, xs);
			if (a.conf === 5 && a.v1 !== c && a.v2 === c) brave = { pid: a.pid, round: k };
		}
	});
	let calBest: { pid: string; v: number } | null = null;
	for (const [pid, xs] of cal) {
		if (xs.length < Math.min(2, rounds)) continue;
		const v = xs.reduce((a, b) => a + b, 0) / xs.length;
		if (!calBest || v > calBest.v) calBest = { pid, v };
	}
	const budgets = await guildBudgets(code, people);
	const bestRepair =
		budgets.filter((b) => b.curve).sort((a, b) => b.curve![3] - a.curve![3])[0] ?? null;

	const name = (pid?: string) => (pid ? byPid.get(pid)?.alias || 'Cadete' : null);
	const braveR = brave as { pid: string; round: number } | null;
	return {
		podiums: [
			{
				title: 'El gremio que mejor deliberó',
				who: bestDelib,
				kind: 'guild',
				note: 'Más puntos ganados al discutir'
			},
			{
				title: 'El más calibrado',
				who: name(calBest?.pid),
				kind: 'person',
				note: 'Su seguridad coincidió con su acierto'
			},
			{
				title: 'La apuesta más valiente',
				who: name(braveR?.pid),
				kind: 'person',
				note: 'Apostó 5, falló, escuchó a su gremio y acertó'
			},
			{
				title: 'La reparación que sostuvo',
				who: bestRepair?.guild ?? null,
				kind: 'guild',
				note: 'Mejor mes 4 en la app Brillo'
			}
		],
		guilds: GUILDS.map((g) => {
			const xs = acc2[g.id] ?? [];
			return {
				id: g.id,
				acc: xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null,
				gain: gain[g.id] ?? 0
			};
		})
	};
}

// ---------------------------------------------------------------------------
// Exportación CSV (solo facilitador)
// ---------------------------------------------------------------------------

/** Una fila por participante y casilla, con el caso y si acertó. Para revisar la sesión después. */
export async function salaCsv(session: TallerSession) {
	const state = normalizeSalaState(session.state);
	const people = await participants(session.code);
	const byId = new Map(people.map((p) => [p.id, p]));
	const rounds = FINAL_STAGES.includes(state.stage) ? state.played : state.picks.length;
	const slots: { id: string; label: string; correct?: number; options?: string[] }[] = [
		{ id: 'exp0', label: 'Expediente 0 (termómetro)' }
	];
	for (let r = 0; r < rounds; r++) {
		const cs = caseFor(state, r);
		const title = cs ? `R${r + 1} · ${cs.title}` : `R${r + 1}`;
		slots.push({ id: slot(r, 'vote'), label: `R${r + 1} · voto de expediente` });
		slots.push({
			id: slot(r, 'v1'),
			label: `${title} · 1.er voto`,
			correct: cs?.correct,
			options: cs?.options.map((o) => o.t)
		});
		slots.push({
			id: slot(r, 'v2'),
			label: `${title} · 2.º voto`,
			correct: cs?.correct,
			options: cs?.options.map((o) => o.t)
		});
	}
	slots.push(
		{ id: 'budget', label: 'Gremio repara (tabla,metas,error,medallas)' },
		{ id: 'integ', label: 'Integración' }
	);

	const perSlot = await Promise.all(slots.map((sl) => slideRows(session.code, sl.id)));
	// Una celda que empieza con = + - @ se ejecutaría como fórmula en Excel/Sheets.
	const cell = (v: unknown) => {
		let t = String(v ?? '');
		if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
		return `"${t.replace(/"/g, '""')}"`;
	};
	const lines = [
		[
			'alias',
			'email',
			'gremio',
			'mentor',
			'casilla',
			'respuesta',
			'seguridad',
			'¿acertó?',
			'texto',
			'actualizado'
		]
			.map(cell)
			.join(',')
	];
	slots.forEach((sl, k) => {
		for (const r of perSlot[k]) {
			const p = byId.get(r.participant_id);
			const opt = Number.isInteger(r.choice) ? r.choice : null;
			let answer: unknown = '';
			let text: unknown = r.text ?? '';
			if (sl.id === 'exp0') answer = r.scale;
			else if (sl.id.endsWith(':vote')) {
				answer = expediente(r.text)?.name ?? r.text;
				text = '';
			} else if (opt != null && sl.options)
				answer = `${String.fromCharCode(65 + opt)}. ${sl.options[opt]}`;
			const hit = opt != null && sl.correct != null ? (opt === sl.correct ? 'sí' : 'no') : '';
			lines.push(
				[
					p?.alias,
					p?.email,
					p?.guild,
					p?.mentor,
					sl.label,
					answer,
					sl.id.endsWith(':v1') ? r.scale : '',
					hit,
					text,
					r.updated_at ? new Date(r.updated_at).toISOString() : ''
				]
					.map(cell)
					.join(',')
			);
		}
	});
	return lines.join('\n');
}

export { MENTORS };
