// «¿Quién tiene la cabeza?» — webinar de 40 min para docentes (Creatividad e IA,
// Universidad de los Andes · Facultad de Educación · HUB Innovación Educativa con IA).
// Fuente: bem-outputs/proyectos_gamificacion/Creatividad e IA/07_prototipo_taller_quien_tiene_la_cabeza.html
//
// Todo lo que se muestra en el taller vive aquí. El servidor solo guarda el paso
// actual y las respuestas; las lecturas del grupo se calculan con readings().

export type CaseLean = 'c' | 'i' | 'g';

export interface TallerCase {
	id: string;
	title: string;
	who: string;
	story: string;
	lean: CaseLean;
	leanText: string;
	/** Lectura del diseñador: nota de facilitación, nunca respuesta correcta. */
	read: string;
	human: string;
	machine: string;
	/** Pregunta para abrir micrófono; opcional, algunos casos no la llevan. */
	mic?: string;
	/** Imagen alusiva al caso en estética Cuphead */
	image?: string;
}

export type TallerSlide =
	| { kind: 'intro'; id: 'intro' }
	| { kind: 'case'; id: string; index: number; case: TallerCase }
	| { kind: 'closing'; id: 'vuelta' };

export const WORKSHOP_ID = 'quien-tiene-la-cabeza';
export const WORKSHOP_TITLE = '¿Quién tiene la cabeza?';

export const Q1 = ['Lo he hecho', 'He hecho algo parecido', 'No se me había ocurrido'];

export const CASES: TallerCase[] = [
	{
		id: 'escape',
		title: 'El laboratorio contaminado',
		who: 'Laura · Química · grado décimo',
		image: '/taller/caso-escape.webp',
		story:
			'Un viernes a las 10 p. m., Laura le pidió a la IA: «Diseña un escape room de 50 minutos sobre estequiometría, con narrativa y cinco candados». En veinte minutos tenía un laboratorio contaminado, un científico desaparecido, cinco candados numéricos cuyas claves eran resultados de balancear ecuaciones y una carta final escrita con tinta invisible. Imprimió todo, compró tres candados de verdad y el lunes armó el salón. Sus estudiantes pidieron repetirlo y dos colegas ya le pidieron la plantilla.',
		lean: 'i',
		leanText: 'Invertido deslumbrante',
		read: 'La idea, la narrativa y la estructura salieron de la IA; Laura puso la ejecución física, que fue impecable. Es el caso para abrir: funcionó muy bien y aun así la cabeza fue de la máquina. Suele dividir al grupo.',
		human:
			'Laura parte del error de estequiometría que su grupo comete siempre y lo convierte en la trampa del candado 3. Inventa el giro: el científico desaparecido fue su estudiante el año pasado. La IA calcula ecuaciones con resultados exactos para cada candado, redacta las cartas y prueba si las pistas se pueden resolver sin entender el concepto.',
		machine: 'Lo que hizo Laura: pedir el escape room completo e implementarlo tal como llegó.'
	},
	{
		id: 'remedios',
		title: 'Doña Remedios, telegrafista',
		who: 'Andrés · Historia de Colombia · universidad',
		image: '/taller/caso-remedios.webp',
		story:
			'Andrés escribió en dos páginas a Doña Remedios, telegrafista en Bogotá el 9 de abril de 1948. Vio pasar mensajes que nadie debía leer, le teme a los militares, desprecia a los políticos de ambos partidos, miente cuando le preguntan por su hermano y solo cuenta algo nuevo si el estudiante le demuestra que entendió lo que ella ya dijo. Configuró la IA con esa ficha. Cada grupo la entrevista por chat, descubre un fragmento distinto y en clase arman el rompecabezas.',
		lean: 'c',
		leanText: 'Centauro claro',
		read: 'El personaje está lleno de decisiones humanas (qué sabe, qué oculta, cuándo habla). La IA solo lo interpreta a escala, en conversaciones uno a uno que Andrés no podría sostener. Casi nadie lo ha hecho: es un buen caso para detonar.',
		human:
			'Lo que hizo Andrés: una ficha con decisiones (secretos, miedos, reglas de cuándo hablar) que la IA interpreta.',
		machine:
			'«Crea un personaje histórico del Bogotazo para que mis estudiantes lo entrevisten», y usar el que la IA propone.',
		mic: '¿Qué decisiones de la ficha de Doña Remedios no se le habrían ocurrido a la IA?'
	},
	{
		id: 'ensayos',
		title: 'Tres preguntas en vez de correcciones',
		who: 'Marcela · Escritura argumentativa · 60 ensayos por corte',
		image: '/taller/caso-ensayos.webp',
		story:
			'Marcela dejó de llenar los ensayos de comentarios al margen. Escribió un banco de 30 preguntas organizadas por los seis errores argumentativos que más ve en su grupo, como «¿Qué tendría que ser cierto para que tu conclusión fuera falsa?». La IA lee cada ensayo, identifica el error dominante y le asigna al estudiante tres preguntas de ese tipo. Nadie recibe nota hasta responderlas y reescribir un párrafo.',
		lean: 'c',
		leanText: 'Centauro · uso común',
		read: 'Muchos docentes ya usan IA para retroalimentar, así que la pregunta 1 debería salir alta en «lo he hecho» o «algo parecido». Es el caso para decir que la creatividad no está en el uso sino en la forma: el sistema y las preguntas son de Marcela y la IA solo los ejecuta a escala.',
		human:
			'Lo que hizo Marcela: ella diseña el sistema y el banco de preguntas; la IA diagnostica y asigna.',
		machine:
			'Pasarle cada ensayo a la IA con la rúbrica, pedirle comentarios formativos y revisarlos antes de enviarlos. El docente queda como control de calidad de lo que pensó la máquina.',
		mic: 'Si ya usas IA para retroalimentar, ¿qué parte de ese sistema es tuya?'
	},
	{
		id: 'podcast',
		title: 'Aristóteles contra la influencer',
		who: 'Camilo · Ética · primer semestre',
		image: '/taller/caso-podcast.webp',
		story:
			'A Camilo se le ocurrió enfrentar a Aristóteles con una influencer de bienestar de 23 años en un debate sobre la felicidad. Le pidió a la IA un guion de 12 minutos con tres falacias escondidas en cada lado y generó las voces con otra herramienta. Lo publicó como episodio de podcast. Los estudiantes lo escuchan en el bus y llegan a clase con las falacias cazadas. La discusión más larga fue sobre si la influencer tenía razón.',
		lean: 'g',
		leanText: 'Zona gris',
		read: 'La ocurrencia (el cruce improbable) es humana. Los argumentos, las falacias y el tono los pensó la IA. Está diseñado para dividir al grupo: ¿basta la chispa inicial para que la cabeza sea humana?',
		human:
			'Camilo escribe los argumentos centrales de cada personaje y decide qué falacia va dónde (las mismas que sus estudiantes usan en sus ensayos). La IA dramatiza, da ritmo y pone las voces.',
		machine:
			'«Dame ideas de podcasts para enseñar ética», y quedarse con la del debate que propuso la IA.',
		mic: '¿Basta con tener la ocurrencia? ¿Dónde empieza a pensar la máquina en este caso?'
	},
	{
		id: 'minuto50',
		title: 'El minuto 50',
		who: 'Sofía · Cálculo · clases de dos horas',
		image: '/taller/caso-minuto50.webp',
		story:
			'Sofía notaba que su clase se caía siempre después del minuto 50. Grabó el audio de tres sesiones, lo transcribió y le pidió a la IA una sola cosa: marcar minuto a minuto quién hablaba, qué tipo de tarea había y cuántas preguntas hacían los estudiantes. Descubrió que hablaba 38 minutos seguidos antes del primer cambio de actividad y que solo le preguntaban en los primeros 15 minutos. Con ese mapa rediseñó la clase en bloques de 12 minutos.',
		lean: 'c',
		leanText: 'Centauro que no parece creativo',
		read: 'La IA solo midió. Lo creativo está en la pregunta que Sofía le hizo a su propia clase y en el rediseño. Suele salir con consenso hacia centauro, aunque a primera vista no se vea como un uso creativo.',
		human:
			'Lo que hizo Sofía: la IA como instrumento de medición; el diagnóstico y el rediseño son suyos.',
		machine:
			'«Reorganiza mi planeación para que mantenga la atención de los estudiantes», y aplicar la estructura que propone.',
		mic: '¿Dónde está lo creativo en un uso que no parece creativo?'
	},
	{
		id: 'rubrica',
		title: 'La rúbrica que escribieron los errores',
		who: 'Julián · Proyecto final integrador · ingeniería',
		image: '/taller/caso-rubrica.webp',
		story:
			'Julián sentía que su rúbrica no distinguía un trabajo correcto de uno memorable. Le pasó a la IA los 40 proyectos del semestre anterior con sus notas y le pidió encontrar qué tenían en común los que sacaron más de 4,5 y qué les faltaba a los que quedaron entre 3,5 y 4. La IA encontró cinco rasgos. Julián descartó dos, reformuló los otros tres y los convirtió en los criterios de la nueva rúbrica.',
		lean: 'g',
		leanText: 'Zona gris, inclinada a invertido',
		read: 'Los criterios los formuló la IA, aunque a partir de las notas de Julián (su juicio pasado). Él curó. Es un buen caso para cerrar porque obliga a precisar: ¿el criterio es suyo o de la máquina?',
		human:
			'Julián escribe primero qué distinguía para él los mejores proyectos y le pide a la IA buscar evidencia a favor y en contra en los 40 trabajos, con citas textuales.',
		machine: '«Hazme una rúbrica para mi proyecto final», con cinco criterios y cuatro niveles.',
		mic: 'Si la IA descubrió el criterio en mis propias notas, ¿el criterio es mío o suyo?'
	}
];

export const SLIDES: TallerSlide[] = [
	{ kind: 'intro', id: 'intro' },
	...CASES.map((c, index) => ({ kind: 'case' as const, id: c.id, index, case: c })),
	{ kind: 'closing', id: 'vuelta' }
];

export const POCKET_QUESTIONS = [
	'¿Qué idea de este material existía en mi cabeza antes de abrir la IA?',
	'¿Le pedí ideas, o le pedí que trabajara sobre las mías?',
	'Si me quitan este material, ¿podría defender por qué es así y no de otra forma?'
];

export const VUELTA_PLACEHOLDER =
	'Ej.: Hoy le pido a la IA preguntas para el foro. Voy a escribir yo la pregunta que me inquieta y pedirle que la responda como cinco estudiantes distintos, para ver dónde se atascan.';

// ---------- lecturas del grupo ----------

export function zone(v: number): string {
	return v < 38 ? 'Más centauro' : v > 62 ? 'Más centauro invertido' : 'Zona gris';
}

export const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
export const sd = (a: number[]) => {
	if (!a.length) return 0;
	const m = mean(a);
	return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};

export type Reading = [title: string, body: string];

export function readings(counts: number[], vals: number[]): [Reading, Reading] {
	const tot = counts.reduce((x, y) => x + y, 0) || 1;
	const nunca = counts[2] / tot;
	const conocido = (counts[0] + counts[1]) / tot;

	let r1: Reading;
	if (nunca >= 0.55)
		r1 = [
			'Territorio nuevo',
			`${Math.round(nunca * 100)}% no lo había imaginado. Aquí hay un uso para llevarse: ¿en qué parte de tu curso funcionaría?`
		];
	else if (conocido >= 0.6)
		r1 = [
			'La creatividad está en la forma',
			`${Math.round(conocido * 100)}% ya hace algo parecido. El uso es común; lo que cambia es cómo se hace.`
		];
	else
		r1 = [
			'Mitad y mitad',
			'El grupo se reparte entre quienes ya lo hacen y quienes no. Pregunten a alguien que ya lo hizo qué cambiaría.'
		];

	const s = sd(vals);
	const m = mean(vals);
	let r2: Reading;
	if (s > 22)
		r2 = [
			'El grupo está dividido',
			'Las respuestas van de un extremo al otro. ¿Qué detalle del caso inclina la balanza? Una voz de cada lado.'
		];
	else if (m < 38)
		r2 = [
			'Coincidencia: centauro',
			'Casi todos ven la cabeza humana. ¿Qué decisión del docente lo deja tan claro?'
		];
	else if (m > 62)
		r2 = [
			'Coincidencia: invertido',
			'Casi todos ven la cabeza de la máquina, aunque el resultado haya sido bueno.'
		];
	else
		r2 = [
			'Zona gris compartida',
			'El grupo coincide en que no es ni lo uno ni lo otro. ¿Qué haría falta para inclinarlo hacia la cabeza humana?'
		];

	return [r1, r2];
}

// ---------- forma de /api/taller/[code] ----------

export interface CaseResults {
	counts: number[];
	scales: number[];
}

export interface ClosingResults {
	vueltas: string[];
	summary: (CaseResults & { id: string; mine: { choice: number | null; scale: number | null } | null })[];
}

export interface TallerView {
	code: string;
	title: string;
	state: { step: number; phase: 'vote' | 'results' };
	participantCount: number;
	responseCount: number;
	mine: { choice: number | null; scale: number | null; text: string | null } | null;
	results: CaseResults | ClosingResults | null;
}
