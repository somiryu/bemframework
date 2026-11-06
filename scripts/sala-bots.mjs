// Cadetes simulados para probar «Sala de Crisis» contra una sala real.
//
//   node scripts/sala-bots.mjs <url-base> <CODIGO> [cantidad] [email-facilitador]
//   node scripts/sala-bots.mjs http://localhost:5174 OMIE7 24 javier@f2p.co
//
// Cada bot entra con su propio correo y responde lo que pida la fase en curso.
// Con el correo del facilitador (super_user), los bots aciertan más a menudo
// porque leen la respuesta correcta de la vista del facilitador. Ctrl-C para salir.

const [base = 'http://localhost:5174', code = 'OMIE7', nArg = '24', hostEmail = ''] =
	process.argv.slice(2);
const N = Number(nArg);
const NAMES = [
	'Valentina',
	'Mateo',
	'Sofía',
	'Samuel',
	'Isabella',
	'Tomás',
	'Mariana',
	'Martín',
	'Gabriela',
	'Emilio',
	'Salomé',
	'Andrés',
	'Lucía',
	'Nicolás',
	'Antonia',
	'Felipe',
	'Manuela',
	'David',
	'Paula',
	'Simón',
	'Camila',
	'Esteban',
	'Juliana',
	'Miguel',
	'Laura',
	'Santiago',
	'Julián',
	'Ana',
	'Pedro',
	'Irene'
];
const GUILDS = ['gary', 'uwe', 'sid', 'will'];
const MENTORS = ['sara', 'wilkins', 'kira', 'emma'];
const WHY = [
	'Me guío por la ficha.',
	'Es lo que pasa en mi curso.',
	'La otra opción confunde la pieza con el efecto.',
	'Por lo que gana la persona.',
	''
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function join(i) {
	const fd = new FormData();
	fd.set('alias', `${NAMES[i % NAMES.length]}${i >= NAMES.length ? ' ' + i : ''}`);
	fd.set('email', `bot${i}@sala.test`);
	const res = await fetch(`${base}/es/taller/${code}?/join`, {
		method: 'POST',
		body: fd,
		headers: { origin: base, 'x-sveltekit-action': 'true' },
		redirect: 'manual'
	});
	const cookie = (res.headers.get('set-cookie') || '').match(/taller_pid=[^;]+/)?.[0];
	if (!cookie) throw new Error(`El bot ${i} no pudo entrar (${res.status})`);
	return { i, cookie, skill: 0.35 + Math.random() * 0.5, done: new Set() };
}

async function api(cookie, body) {
	const res = await fetch(`${base}/api/taller/${code}`, {
		method: body ? 'POST' : 'GET',
		headers: { cookie, 'content-type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined
	});
	return res.ok ? res.json() : null;
}

async function step(bot, host) {
	const v = await api(bot.cookie);
	if (!v) return;
	const key = `${v.state.step}`;
	if (bot.done.has(key)) return;
	if (Math.random() < 0.35) return; // no todos responden al mismo tiempo
	const answer = (slot, extra) => api(bot.cookie, { type: 'answer', slot, ...extra });

	// Elegir gremio y mentor no consume la fase: el bot sigue respondiendo después.
	if (!v.me.guild && v.stage !== 'lobby')
		return void (await api(bot.cookie, { type: 'profile', guild: GUILDS[bot.i % 4] }));
	if (!v.me.mentor && v.stage !== 'lobby')
		return void (await api(bot.cookie, { type: 'profile', mentor: pick(MENTORS) }));
	if (v.stage === 'exp0')
		await answer('exp0', {
			value: Math.round(Math.min(97, Math.max(15, 70 + (Math.random() - 0.5) * 50)))
		});
	else if (v.stage === 'vote') await answer('vote', { exp: pick(v.data.options) });
	else if (v.stage === 'case') {
		const correct = host?.data?.case?.correct;
		const ok = correct != null && Math.random() < bot.skill;
		const opt = ok ? correct : Math.floor(Math.random() * 4);
		const conf = v.me.canFive
			? pick(ok ? [3, 5, 5] : [1, 1, 3, 5])
			: pick(ok ? [3, 3, 1] : [1, 1, 3]);
		await answer('v1', { option: opt, conf, why: pick(WHY) });
	} else if (v.stage === 'mirror' && v.data.mine.v1 != null) {
		const correct = host?.data?.case?.correct;
		const mine = v.data.mine.v1;
		const opt = correct != null && mine !== correct && Math.random() < 0.4 ? correct : mine;
		await answer('v2', { option: opt });
	} else if (v.stage === 'budget') {
		const b = [0, 0, 0, 0];
		for (let k = 0; k < 10; k++) b[Math.floor(Math.random() * 4)]++;
		await answer('budget', { budget: b.join(',') });
	} else if (v.stage === 'integ' && Math.random() < 0.5) {
		await answer('integ', {
			text: pick([
				'Quitar el ranking global del curso.',
				'Escribir el mensaje para quien falla.',
				'Dejar de premiar la asistencia con medallas.',
				'Hacer opcional de verdad lo opcional.'
			])
		});
	}
	bot.done.add(key);
}

const hostCookie = hostEmail ? `super_user_email=${hostEmail}` : null;
const bots = [];
for (let i = 0; i < N; i++) bots.push(await join(i));
console.log(`${bots.length} cadetes en la sala ${code}. Ctrl-C para salir.`);
for (;;) {
	const host = hostCookie ? await api(hostCookie) : null;
	await Promise.all(bots.map((b) => step(b, host).catch(() => {})));
	await sleep(1500);
}
