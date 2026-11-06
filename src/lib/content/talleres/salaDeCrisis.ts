// «OMIE · Sala de Crisis» — juego en vivo para una clase presencial de 2 horas
// sobre fundamentos de gamificación BEM.
// GDD: bem-outputs/proyectos_gamificacion/OMIE Sala de Crisis/06_gdd_sala_de_crisis.md
//
// Todo el contenido del juego vive aquí. El servidor solo guarda el estado de la
// sala y las respuestas; resultados, XP y rangos se derivan en salaDeCrisis.ts.

export const WORKSHOP_ID = 'sala-de-crisis';
export const WORKSHOP_TITLE = 'OMIE · Sala de Crisis';

export type MentorKey = 'sara' | 'wilkins' | 'kira' | 'emma' | 'giochi';
export type CabeceraKey = Exclude<MentorKey, 'giochi'>;
export type GuildId = 'gary' | 'uwe' | 'sid' | 'will';
export type DriverFamily = 'lila' | 'rojo' | 'verde' | 'naranja';

export interface Mentor {
	name: string;
	role: string;
	desc: string;
	img: string;
}

export interface Guild {
	id: GuildId;
	name: string;
	motive: string;
	/** Familia del código cromático de drivers: el único uso del color en el juego. */
	fam: DriverFamily;
	img: string;
}

export interface CaseOption {
	t: string;
	/** Argumento plausible de quien elige esta opción: alimenta el espejo de la sala. */
	a: string;
}

export interface SalaCase {
	title: string;
	setup: string;
	/** Definiciones mínimas para decidir: [término, definición]. */
	ficha: [string, string][];
	q: string;
	options: CaseOption[];
	correct: number;
	hint: string;
	/** Explicación del mentor experto en la revelación. */
	explain: string;
	/** Lectura de cada mentor de cabecera en el celular. */
	mine: Record<CabeceraKey, string>;
	next: string;
}

export interface Expediente {
	id: string;
	name: string;
	mentor: MentorKey;
	kind: string;
	teaser: string;
	cases: SalaCase[];
}

export const MENTORS: Record<MentorKey, Mentor> = {
	sara: {
		name: 'Sara Arbeláez',
		role: 'Psicóloga y antropóloga',
		desc: 'Te habla de las personas detrás de cada conducta.',
		img: '/taller/sala/mentor-sara.webp'
	},
	wilkins: {
		name: 'John Wilkins',
		role: 'Mecánicas y sistemas',
		desc: 'Directo: reglas, piezas y qué cambiar.',
		img: '/taller/sala/mentor-wilkins.webp'
	},
	kira: {
		name: 'Kira Yamada',
		role: 'Metas y propósito',
		desc: 'Te devuelve siempre a la meta: ¿hacia dónde vas?',
		img: '/taller/sala/mentor-kira.webp'
	},
	emma: {
		name: 'Emma Wagner',
		role: 'Evaluación e incentivos',
		desc: 'Precisión de relojero y asombro por los datos.',
		img: '/taller/sala/mentor-emma.webp'
	},
	giochi: {
		name: 'GIOCHI',
		role: 'Asistente de la OMIE',
		desc: '',
		img: '/taller/sala/mentor-giochi.webp'
	}
};

export const CABECERA: CabeceraKey[] = ['sara', 'wilkins', 'kira', 'emma'];

export const GUILDS: Guild[] = [
	{
		id: 'gary',
		name: 'Gary Gygax',
		motive: 'Identidad / Inmersión',
		fam: 'lila',
		img: '/taller/sala/gremio-gary.webp'
	},
	{
		id: 'uwe',
		name: 'Uwe Rosenberg',
		motive: 'Eficiencia / Hedonismo',
		fam: 'rojo',
		img: '/taller/sala/gremio-uwe.webp'
	},
	{
		id: 'sid',
		name: 'Sid Meier',
		motive: 'Empoderamiento / Descubrimiento',
		fam: 'verde',
		img: '/taller/sala/gremio-sid.webp'
	},
	{
		id: 'will',
		name: 'Will Wright',
		motive: 'Maestría / Relacionamiento',
		fam: 'naranja',
		img: '/taller/sala/gremio-will.webp'
	}
];

/** Rangos por XP. La XP depende del desempeño (ver xpForRound en salaDeCrisis.ts). */
export const RANKS: { name: string; min: number; unlock: string | null }[] = [
	{
		name: 'Cadete',
		min: 0,
		unlock: null
	},
	{
		name: 'Analista',
		min: 45,
		unlock: 'Apuesta de seguridad 5'
	},
	{
		name: 'Diseñador',
		min: 105,
		unlock: 'Pista de tu mentor durante el caso'
	},
	{
		name: 'Arquitecto',
		min: 170,
		unlock: 'Tu argumento se destaca en el espejo de la sala'
	}
];

/** En orden de desbloqueo: en la ronda 1 compiten los dos primeros y cada ronda abre uno más. */
export const EXPEDIENTES: Expediente[] = [
	{
		id: 'drivers',
		name: 'Los 7 drivers',
		mentor: 'sara',
		kind: 'Perfil de jugador',
		teaser: 'Lee la conducta de una jugadora y nombra su subarquetipo.',
		cases: [
			{
				title: 'Luisa y los acentos',
				setup:
					'Luisa, 34 años, estudia alemán en una app. Descubrió que si escribe las respuestas en mayúsculas, la app no revisa los acentos. Ahora termina las lecciones en la mitad del tiempo. No mira el ranking ni comparte resultados: lo que la divierte es entender cómo funciona el sistema por dentro.',
				ficha: [
					['Achiever · Maestría', 'Busca la ejecución perfecta: repetir hasta hacerlo impecable.'],
					[
						'Hacker · Maestría',
						'Explora vacíos y caminos no convencionales para dominar el sistema.'
					],
					[
						'Explorador · Descubrimiento',
						'Busca contenido oculto: lugares, historias y secretos del mundo.'
					],
					['Competidor · Empoderamiento', 'Busca superar a otros: rankings y desafíos directos.']
				],
				q: '¿Qué subarquetipo describe mejor la conducta de Luisa?',
				options: [
					{
						t: 'Achiever (Maestría)',
						a: 'Quiere terminar las lecciones y hacerlo bien.'
					},
					{
						t: 'Hacker (Maestría)',
						a: 'Encontró un vacío en las reglas y lo usa para dominar la app.'
					},
					{
						t: 'Explorador (Descubrimiento)',
						a: 'Le divierte descubrir cómo funciona la app por dentro.'
					},
					{
						t: 'Competidor (Empoderamiento)',
						a: 'Terminar en la mitad del tiempo es ganarle al sistema.'
					}
				],
				correct: 1,
				hint: 'Compara lo que Luisa encontró con lo que gana: ¿un lugar nuevo del mundo o una forma de dominar la regla?',
				explain:
					'Luisa no busca secretos del mundo: busca el vacío de la regla. Eso es Maestría por la vía del Hacker. El Explorador habría buscado qué hay detrás de una puerta, no cómo saltarse la revisión.',
				mine: {
					sara: 'Fíjate en lo que Luisa gana: no ve nada nuevo del mundo, gana control sobre la regla. Ahí está la pista.',
					wilkins:
						'Regla mal cerrada, jugadora que la encuentra: eso es el Hacker. Y es información valiosa para quien diseñó la app.',
					kira: 'Pregúntate siempre hacia dónde va la persona. Luisa no va hacia un lugar nuevo: va hacia dominar el sistema.',
					emma: 'Me encanta Luisa. Una Hacker es la mejor auditoría gratuita que puede tener un sistema de evaluación.'
				},
				next: 'Para distinguir subarquetipos, pregunta qué gana la persona, no solo qué hace.'
			},
			{
				title: 'La bitácora de Ana',
				setup:
					'Ana es enfermera y juega un simulador clínico con sus colegas. No mira el ranking ni compite por salvar más pacientes. Pasa horas abriendo las historias ocultas de cada paciente ficticio y desbloqueando el pasado de los personajes del hospital.',
				ficha: [
					['Achiever · Maestría', 'Busca la ejecución perfecta: repetir hasta hacerlo impecable.'],
					[
						'Explorador · Descubrimiento',
						'Busca contenido oculto: lugares, historias y secretos del mundo.'
					],
					[
						'Ideólogo · Identidad Épica',
						'Toma decisiones alineadas con sus valores y con una causa mayor.'
					],
					['Nurturer · Vinculación', 'Busca apoyar y cuidar a la comunidad de jugadores.']
				],
				q: '¿Qué subarquetipo describe mejor la conducta de Ana en el juego?',
				options: [
					{
						t: 'Achiever (Maestría)',
						a: 'Quiere conocer cada caso a la perfección.'
					},
					{
						t: 'Explorador (Descubrimiento)',
						a: 'Lo que hace con su tiempo es abrir lo que está oculto.'
					},
					{
						t: 'Ideólogo (Identidad Épica)',
						a: 'Es enfermera: la mueve el propósito de cuidar.'
					},
					{
						t: 'Nurturer (Vinculación)',
						a: 'Juega con sus colegas y se preocupa por los pacientes.'
					}
				],
				correct: 1,
				hint: 'Mira qué hace Ana con su tiempo en el juego, no cuál es su profesión.',
				explain:
					'Ana no persigue salvar más pacientes ni hacerlo perfecto: abre lo que está oculto. El propósito de su profesión puede estar de fondo, pero la conducta observable es exploración.',
				mine: {
					sara: 'Su oficio es cuidar, pero en el juego busca historias. No confundas quién es la persona con lo que la mueve en ese sistema.',
					wilkins:
						'Mira la acción que repite: abrir historias. Esa es la pieza que el diseño tiene que alimentar.',
					kira: 'La meta que Ana se pone es descubrir el pasado de los personajes. El propósito de cuidar no es la meta de esa sesión.',
					emma: 'Si midieras sus pacientes salvados, no verías nada de Ana. Mide cuántas historias abrió.'
				},
				next: 'Separa la identidad de la persona de la conducta que repite dentro del sistema.'
			},
			{
				title: 'Diego en el foro',
				setup:
					'En un juego en línea para aprender física, Diego dejó de subir de nivel hace semanas. Pasa sus sesiones respondiendo dudas de jugadores nuevos en el foro y armando guías para que no se frustren. Su equipo le pide que vuelva a jugar las misiones con ellos; él prefiere seguir en el foro.',
				ficha: [
					['Team Player · Vinculación', 'Busca el éxito cooperativo de su equipo.'],
					[
						'Nurturer · Vinculación',
						'Busca apoyar y cuidar a la comunidad, en especial a los nuevos.'
					],
					['Climber · Empoderamiento', 'Busca progresar en poder y conseguir herramientas.'],
					['Achiever · Maestría', 'Busca la ejecución perfecta del reto.']
				],
				q: '¿Qué subarquetipo describe mejor la conducta de Diego?',
				options: [
					{
						t: 'Team Player (Vinculación)',
						a: 'Lo mueve lo social: ayudar a otros jugadores.'
					},
					{
						t: 'Nurturer (Vinculación)',
						a: 'Cuida a los nuevos aunque su equipo le pida otra cosa.'
					},
					{
						t: 'Climber (Empoderamiento)',
						a: 'Ser el que sabe en el foro le da poder.'
					},
					{
						t: 'Achiever (Maestría)',
						a: 'Escribir guías perfectas es su forma de dominar el juego.'
					}
				],
				correct: 1,
				hint: 'Diego le dice que no a su equipo. ¿A quién está cuidando entonces?',
				explain:
					'Los dos son Vinculación, pero apuntan a lugares distintos. El Team Player juega para que su equipo gane; Diego deja a su equipo para cuidar a los nuevos. Eso es el Nurturer.',
				mine: {
					sara: 'Diego eligió a los que llegan, no a los que ya están. Esa elección dice más que cualquier perfil.',
					wilkins:
						'Si quieres retener a Diego, dale herramientas para el foro, no misiones de equipo.',
					kira: 'Su meta no es ganar: es que los nuevos no se rindan. Un buen sistema le reconoce esa meta.',
					emma: 'Si solo midieras su nivel, dirías que Diego abandonó. Mide las dudas que respondió.'
				},
				next: 'Cuando dos subarquetipos comparten driver, pregunta a quién beneficia la conducta.'
			}
		]
	},
	{
		id: 'gfr',
		name: '¿Recompensa o feedback?',
		mentor: 'kira',
		kind: 'Lenguaje BEM',
		teaser: 'Revisa el reglamento de un semillero y encuentra el término bien usado.',
		cases: [
			{
				title: 'El reglamento del semillero',
				setup:
					'Un semillero de investigación escribió su reglamento gamificado. Antes de publicarlo, la directora quiere que el equipo hable con precisión. Solo una de estas cuatro frases usa bien la palabra «recompensa».',
				ficha: [
					['Meta', 'Da dirección y genera anticipación.'],
					['Feedback', 'Comunica un cambio de estado y el progreso hacia la meta.'],
					['Recompensa', 'La respuesta neurológica en la persona: orgullo, alivio, satisfacción.'],
					[
						'Premio',
						'Un objeto que el sistema entrega, como monedas o medallas. Es una meta diferida.'
					]
				],
				q: '¿Cuál frase usa bien la palabra «recompensa»?',
				options: [
					{
						t: '«Quien entregue a tiempo recibirá una recompensa de 50 monedas.»',
						a: 'Las monedas son lo que motiva a entregar.'
					},
					{
						t: '«La recompensa del módulo 2 es una medalla dorada.»',
						a: 'La medalla es lo que se gana al final del módulo.'
					},
					{
						t: '«Diseñamos el cierre para que el alivio de resolver el caso sea la recompensa.»',
						a: 'Habla de lo que siente la persona, no de lo que recibe.'
					},
					{
						t: '«La barra de progreso es la recompensa de cada ejercicio.»',
						a: 'La barra se llena y eso se siente bien.'
					}
				],
				correct: 2,
				hint: 'Busca la frase que habla de lo que le pasa a alguien por dentro.',
				explain:
					'Monedas y medallas son premios; la barra es feedback. La recompensa no se puede entregar: ocurre en la persona cuando el feedback le confirma que alcanzó la meta.',
				mine: {
					sara: 'Lo que me interesa es lo que pasa dentro de la persona. Por eso la recompensa vive ahí y no en la tienda de premios.',
					wilkins:
						'Tres sustantivos, tres piezas del sistema: premio, feedback, recompensa. Si las mezclas en el reglamento, las mezclarás en el diseño.',
					kira: 'La meta jala, el feedback informa y la recompensa ocurre. Nadie la puede repartir.',
					emma: 'Una medalla sin asombro es un pedazo de metal. La recompensa es el asombro, no la medalla.'
				},
				next: 'Cuando escribas «recompensa», revisa si hablas de algo que el sistema entrega. Si es así, la palabra es «premio» o «feedback».'
			},
			{
				title: 'La barra de Mateo',
				setup:
					'Una app de lectura llena una barra con cada página leída. Mateo terminó su primer libro del año, vio la barra completa y sintió orgullo. La app no le dio nada más.',
				ficha: [
					['Meta', 'Da dirección y genera anticipación.'],
					['Feedback', 'Comunica un cambio de estado y el progreso hacia la meta.'],
					['Recompensa', 'La respuesta neurológica en la persona: orgullo, alivio, satisfacción.'],
					[
						'Premio',
						'Un objeto que el sistema entrega, como monedas o medallas. Es una meta diferida.'
					]
				],
				q: 'En este caso, ¿qué es la barra?',
				options: [
					{
						t: 'Una recompensa',
						a: 'Mateo sintió orgullo al verla llena.'
					},
					{
						t: 'Un premio',
						a: 'Es lo que la app le dio por leer.'
					},
					{
						t: 'Feedback',
						a: 'Comunica cuánto avanzó hacia terminar el libro.'
					},
					{
						t: 'Una meta diferida',
						a: 'Llenarla es lo que Mateo buscaba.'
					}
				],
				correct: 2,
				hint: 'Separa lo que se ve en la pantalla de lo que sintió Mateo.',
				explain:
					'La barra comunica progreso: es feedback. El orgullo de Mateo es la recompensa, y ocurre porque la barra le confirmó que llegó a la meta de terminar el libro.',
				mine: {
					sara: 'El orgullo es de Mateo, no de la barra. La barra solo le contó algo que él ya había logrado.',
					wilkins:
						'La barra es la pieza; el orgullo es el efecto. Si confundes pieza con efecto, diseñarás barras esperando orgullo.',
					kira: 'La meta era terminar el libro. La barra lo hizo visible; por eso el orgullo llegó en el momento justo.',
					emma: 'Una barra bien calibrada es una maravilla: informa sin prometer nada que no va a cumplir.'
				},
				next: 'Pregunta si lo que nombras está en la pantalla o en la persona.'
			},
			{
				title: 'La medalla que nadie miraba',
				setup:
					'Una universidad entrega una medalla digital por cada 10 charlas a las que asistes. Las primeras semanas la gente las compartía en redes. Para la séptima medalla, casi nadie la abría. La asistencia también bajó.',
				ficha: [
					['Meta diferida', 'Un premio que se persigue: la medalla.'],
					['Anticipación', 'La meta genera atracción antes de la acción.'],
					[
						'Calibración',
						'La experiencia real del premio reentrena cuánto se anticipa la próxima vez.'
					],
					['Recompensa', 'La respuesta neurológica en la persona, no el objeto.']
				],
				q: 'Según el modelo GFR, ¿qué pasó con la medalla?',
				options: [
					{
						t: 'Dejó de ser una recompensa',
						a: 'Al principio emocionaba y luego ya no.'
					},
					{
						t: 'La meta perdió anticipación porque el premio no aportaba nada real',
						a: 'La gente aprendió que la medalla no le daba nada, y dejó de desearla.'
					},
					{
						t: 'El feedback fue demasiado frecuente',
						a: 'Una medalla cada 10 charlas es demasiado seguido.'
					},
					{
						t: 'Faltó una recompensa más grande',
						a: 'Con un premio mejor la gente habría seguido.'
					}
				],
				correct: 1,
				hint: '¿La medalla fue alguna vez una recompensa, o era otra cosa?',
				explain:
					'La medalla nunca fue una recompensa: era una meta diferida. La experiencia real de recibirla no aportó valor, así que cada ciclo la gente anticipó menos. Un premio más grande solo habría retrasado lo mismo.',
				mine: {
					sara: 'Las personas aprenden rápido qué promesas se cumplen. La medalla prometía algo y no lo cumplió.',
					wilkins: 'La pieza no se rompió: se gastó. Ninguna medalla sostiene sola una asistencia.',
					kira: 'Una meta vive de la anticipación. Cuando nadie anticipa nada, la meta ya no existe aunque siga en pantalla.',
					emma: 'Mira el dato: primero dejaron de abrirla y después dejaron de asistir. La medalla te avisó antes.'
				},
				next: 'Antes de agregar un premio, pregunta qué valor real tendrá la décima vez que se reciba.'
			}
		]
	},
	{
		id: 'metas',
		name: 'Metas y espectro MCPFT',
		mentor: 'wilkins',
		kind: 'Espectro de acción',
		teaser: 'Clasifica una actividad de un curso real.',
		cases: [
			{
				title: 'Los sellos de Wilmer',
				setup:
					'En el curso de Wilmer, entrar a la plataforma da un sello por día. Cada sello suma un punto canjeable por stickers. Es opcional y no cuenta para la nota. La mitad del curso entra cada día, recoge su sello y sale.',
				ficha: [
					['Misión', 'Voluntaria, con propósito y una narrativa mayor.'],
					['Reto', 'Difícil pero alcanzable; exige habilidad.'],
					['Farming', 'Repetitiva y de bajo esfuerzo, para acumular algo.'],
					['Tarea', 'Baja autonomía; se hace para cumplir o evitar una pérdida.']
				],
				q: '¿Qué tipo de actividad es recoger el sello diario?',
				options: [
					{
						t: 'Misión',
						a: 'Los estudiantes la eligen libremente.'
					},
					{
						t: 'Reto',
						a: 'Hay que acordarse cada día; no es tan fácil.'
					},
					{
						t: 'Farming',
						a: 'Entran, recogen y salen: repetición sin esfuerzo para acumular.'
					},
					{
						t: 'Tarea',
						a: 'Se siente como una obligación más del curso.'
					}
				],
				correct: 2,
				hint: 'Es opcional y no evita ninguna pérdida. ¿Qué opción descarta eso?',
				explain:
					'Es Farming: repetitivo, de bajo esfuerzo y para acumular. No es Tarea porque es opcional y no evita ninguna pérdida. El síntoma de diseño es que entran y salen: el sello no los conecta con nada del curso.',
				mine: {
					sara: 'Que entren y salgan me dice mucho: el sello no les importa a ellos, le importa al sistema.',
					wilkins:
						'Bajo esfuerzo, repetición y acumulación: tres condiciones, tres cumplidas. No es malo en sí; es malo si es lo único que hay.',
					kira: 'Un sello que no lleva a ninguna parte no es una meta: es un hábito sin dirección.',
					emma: 'Mide qué hacen después de recoger el sello. Si la respuesta es «nada», ya tienes tu diagnóstico.'
				},
				next: 'Para clasificar, mira cuánta autonomía tiene la persona y cuánto esfuerzo le pide la actividad.'
			},
			{
				title: 'La brigada del campus',
				setup:
					'Los estudiantes pueden inscribirse a una brigada que reforesta el campus. El curso la presenta como «la misión de recuperar el bosque de la universidad». Exige identificar especies con una guía técnica. No da nota ni puntos.',
				ficha: [
					['Misión', 'Voluntaria, con propósito y una narrativa mayor.'],
					['Reto', 'Difícil pero alcanzable; exige habilidad.'],
					['Placer', 'Baja carga; se disfruta por su estética o su goce directo.'],
					['Tarea', 'Baja autonomía; se hace para cumplir o evitar una pérdida.']
				],
				q: '¿Qué tipo de actividad es la brigada?',
				options: [
					{
						t: 'Misión',
						a: 'Es voluntaria y tiene un propósito más grande que el curso.'
					},
					{
						t: 'Reto',
						a: 'Identificar especies con una guía técnica exige habilidad.'
					},
					{
						t: 'Placer',
						a: 'Estar al aire libre plantando árboles se disfruta.'
					},
					{
						t: 'Tarea',
						a: 'El curso la propone, así que se siente como un deber.'
					}
				],
				correct: 0,
				hint: '¿Qué mueve a alguien a inscribirse: superar la dificultad o el propósito?',
				explain:
					'Voluntaria, con propósito y una narrativa mayor: es una Misión. Que exija habilidad no la vuelve Reto; el motor es el propósito, no superar la dificultad.',
				mine: {
					sara: 'Nadie se inscribe a reforestar por la guía de especies. Se inscribe por el bosque.',
					wilkins:
						'Una misión puede contener un reto adentro. Clasifica por lo que mueve la actividad, no por cada pieza.',
					kira: '«Recuperar el bosque» es una meta narrativa. Esa es la diferencia con cualquier actividad del curso.',
					emma: 'Si le pusieras nota, la volverías una Tarea en una semana. Por eso no se la pusieron.'
				},
				next: 'Clasifica por el motor de la actividad; una misión puede tener retos adentro.'
			},
			{
				title: 'La ruleta del viernes',
				setup:
					'Cada viernes, el curso gira una ruleta con colores y música para elegir quién cuenta un chiste corto sobre la materia. No hay nota, nadie pierde nada y el curso entero se ríe. Algunos estudiantes preparan su chiste toda la semana.',
				ficha: [
					['Misión', 'Voluntaria, con propósito y una narrativa mayor.'],
					['Reto', 'Difícil pero alcanzable; exige habilidad.'],
					['Placer', 'Baja carga; se disfruta por su estética o su goce directo.'],
					['Tarea', 'Baja autonomía; se hace para cumplir o evitar una pérdida.']
				],
				q: '¿Qué tipo de actividad es la ruleta del viernes?',
				options: [
					{
						t: 'Reto',
						a: 'Hacer reír al curso con la materia no es fácil.'
					},
					{
						t: 'Placer',
						a: 'Baja carga, música y risas: se disfruta por sí misma.'
					},
					{
						t: 'Tarea',
						a: 'Si la ruleta te elige, tienes que hacerlo.'
					},
					{
						t: 'Farming',
						a: 'Se repite todos los viernes igual.'
					}
				],
				correct: 1,
				hint: '¿Qué pierde alguien si lo elige la ruleta y su chiste no funciona?',
				explain:
					'Es Placer: baja carga, sin consecuencias y disfrutable en sí misma. Que te elijan no la vuelve Tarea, porque no hay pérdida que evitar. Que algunos preparen el chiste toda la semana muestra que el placer también mueve conducta.',
				mine: {
					sara: 'Fíjate en la risa del curso: esa es la evidencia de que la actividad funciona.',
					wilkins:
						'Ruleta, música y cero consecuencias: las tres piezas del placer. Si le pones nota, la rompes.',
					kira: 'No toda actividad necesita una meta grande. Esta crea las ganas de volver el viernes.',
					emma: '¡Me encanta que algunos preparen el chiste toda la semana! Eso no lo pide nadie.'
				},
				next: 'Para distinguir Placer de Tarea, pregunta si hay una pérdida que evitar.'
			}
		]
	},
	{
		id: 'puntos',
		name: 'Puntos y marcadores',
		mentor: 'emma',
		kind: 'Points Design',
		teaser: 'Distingue lo que activa una mecánica de lo que solo informa.',
		cases: [
			{
				title: 'El tablero de programación',
				setup:
					'Un curso de programación muestra cuatro números en la pantalla de cada estudiante. Tres de ellos cambian lo que el estudiante puede hacer dentro del sistema. Uno solo le informa algo sobre sí mismo.',
				ficha: [
					[
						'Punto',
						'Tiene un rol en las reglas: se gasta, se acumula para abrir algo o limita lo que puedes hacer.'
					],
					['Marcador', 'Informa sobre el desempeño o el estado. Que cambie no activa nada.'],
					['Regla BEM', 'Ninguno se llama solo «puntos»: lleva el nombre de lo que modela.']
				],
				q: '¿Cuál de los cuatro números es un Marcador?',
				options: [
					{
						t: 'Monedas que se gastan para comprar pistas',
						a: 'Las monedas informan cuánto has trabajado.'
					},
					{
						t: 'Llaves que abren el repositorio de lecturas',
						a: 'Las llaves muestran tu avance en el curso.'
					},
					{
						t: 'Tiempo promedio que tardas en resolver un ejercicio',
						a: 'Que ese número cambie no abre ni gasta nada.'
					},
					{
						t: 'Energía que se consume al intentar un reto',
						a: 'La energía te dice cuánto te queda: informa.'
					}
				],
				correct: 2,
				hint: 'Imagina que el número sube. ¿Se abre, se gasta o se limita algo?',
				explain:
					'Monedas, llaves y energía tienen un trabajo dentro de las reglas: se gastan, abren o limitan. El tiempo promedio solo te cuenta algo sobre ti: es un Marcador de Tiempo y sirve para compararte contigo mismo.',
				mine: {
					sara: 'El tiempo promedio es un espejo, no una llave. Los espejos sirven para conocerse.',
					wilkins:
						'Pregunta qué hace el número cuando cambia. Si la respuesta es «nada en el sistema», es un marcador.',
					kira: 'El marcador te dice dónde estás; el punto te deja moverte hacia la meta.',
					emma: '¡Esto me encanta! Un buen marcador no castiga: te cuenta tu propia historia con precisión de reloj.'
				},
				next: 'Pregunta qué hace el número, no cómo se ve.'
			},
			{
				title: 'Las estrellas que abren',
				setup:
					'En un curso, cada entrega recibe de 1 a 3 estrellas de calidad. Desde este semestre, sacar 3 estrellas abre una lectura extra que antes estaba disponible para todos.',
				ficha: [
					[
						'Punto',
						'Tiene un rol en las reglas: se gasta, se acumula para abrir algo o limita lo que puedes hacer.'
					],
					['Marcador', 'Informa sobre el desempeño o el estado. Que cambie no activa nada.'],
					[
						'Riesgo',
						'Cuando un marcador de calidad empieza a abrir cosas, la gente persigue el número y no la calidad.'
					]
				],
				q: 'Desde este semestre, ¿qué son las estrellas?',
				options: [
					{
						t: 'Un marcador: siguen informando la calidad',
						a: 'Las estrellas miden lo bien hecha que está la entrega.'
					},
					{
						t: 'Un punto: ahora activan un desbloqueo',
						a: 'Con 3 estrellas se abre algo: tienen un trabajo en las reglas.'
					},
					{
						t: 'Un premio',
						a: 'La lectura extra es lo que se gana.'
					},
					{
						t: 'Una meta secundaria',
						a: 'Sacar 3 estrellas es una meta opcional.'
					}
				],
				correct: 1,
				hint: 'Lee la ficha: ¿qué pasa en el sistema cuando llegas a 3 estrellas?',
				explain:
					'Desde que abren la lectura, las estrellas tienen un trabajo en las reglas: funcionan como Puntos de Desbloqueo. Siguen informando calidad, pero lo que define su tipo es que activan algo. Y aparece el riesgo: el estudiante empieza a perseguir la estrella en vez de la calidad.',
				mine: {
					sara: 'Fíjate en lo que cambia para el estudiante: antes leía por curiosidad, ahora lee si gana estrellas.',
					wilkins: 'Un número con trabajo en las reglas es un punto, aunque se vea como estrella.',
					kira: 'La meta del estudiante cambió: ya no es hacer una buena entrega, es llegar a 3. Ese es el costo.',
					emma: '¡Ay! Convirtieron un marcador precioso en una llave. Ahora la medición ya no mide lo mismo.'
				},
				next: 'Cuando un número empieza a abrir cosas, revisa si sigue midiendo lo que medía.'
			},
			{
				title: 'La energía del laboratorio',
				setup:
					'En un simulador de química, cada intento de experimento gasta 1 punto de energía. Cada estudiante tiene 5 por día y se recargan en la noche. El equipo quiere que los estudiantes piensen antes de mezclar, en vez de probar al azar.',
				ficha: [
					[
						'Puntos de Recursos',
						'Limitan lo que puedes hacer ahora para exigir decisiones. Se presentan con una metáfora del dominio.'
					],
					[
						'Puntos de Obstáculo',
						'Algo que hay que evitar acumular o perder. Siempre necesitan una vía de recuperación.'
					],
					[
						'Marcador de Persistencia',
						'Cuenta los intentos hasta lograr algo, con encuadre positivo.'
					],
					['Puntos de Divisa', 'Se intercambian por otros bienes dentro del sistema.']
				],
				q: '¿Qué tipo de punto es la energía?',
				options: [
					{
						t: 'Puntos de Recursos',
						a: 'Limita los intentos para que cada uno sea una decisión.'
					},
					{
						t: 'Marcador de Persistencia',
						a: 'Cuenta cuántas veces intentas.'
					},
					{
						t: 'Puntos de Obstáculo',
						a: 'Quedarse sin energía es algo que hay que evitar.'
					},
					{
						t: 'Puntos de Divisa',
						a: 'Se gasta como una moneda.'
					}
				],
				correct: 0,
				hint: '¿Para qué la puso el equipo: para castigar, para contar o para obligar a decidir?',
				explain:
					'La energía limita lo que puedes hacer ahora para que cada intento sea una decisión: son Puntos de Recursos. Gastarla no es perder; es elegir. El riesgo es que, en un laboratorio de aprendizaje, el límite desanime a quien necesita fallar más veces.',
				mine: {
					sara: 'Cinco intentos pueden ser pocos para quien más los necesita. Vigila quién se queda sin energía primero.',
					wilkins:
						'El recurso funciona si convierte cada intento en una decisión. Si solo frena, es un obstáculo mal puesto.',
					kira: 'La meta es que piensen antes de mezclar. La energía es una forma de acercarlos a esa meta.',
					emma: 'Mide quién gasta los 5 intentos en la primera hora. Ahí está tu siguiente ajuste.'
				},
				next: 'Un recurso que limita debe convertir cada uso en una decisión, no solo frenar.'
			}
		]
	},
	{
		id: 'competencia',
		name: 'Competencia y rankings',
		mentor: 'wilkins',
		kind: 'Autopsia de sistema',
		teaser: 'Un curso con cuatro piezas competitivas. Solo una sobrevive.',
		cases: [
			{
				title: 'El curso de los 45',
				setup:
					'Un docente gamificó su curso de 45 estudiantes con cuatro piezas competitivas. A mitad de semestre, los diez últimos del ranking dejaron de participar. La coordinación le pide conservar solo una pieza.',
				ficha: [
					[
						'Competencia amistosa',
						'Bajo riesgo, reversible, entre pares de nivel similar. Sin rankings absolutos.'
					],
					['Alto rendimiento', 'Exigencia real, pero siempre opt-in, con emparejamiento y ligas.'],
					[
						'Competencia destructiva',
						'Suma cero, exposición sin recuperación o stakes impuestos. Se prohíbe en BEM.'
					],
					[
						'Pozo de fallo',
						'Quien va muy atrás deja de intentarlo: siente que nada de lo que haga importa.'
					]
				],
				q: 'Si solo pudieras conservar una pieza, ¿cuál?',
				options: [
					{
						t: 'Ranking global de los 45, visible todo el semestre',
						a: 'Es transparente: todos saben dónde están.'
					},
					{
						t: 'Los 5 primeros suben 0,5 en la nota final',
						a: 'Motiva a los mejores a dar más.'
					},
					{
						t: 'Tabla por equipos que se reinicia cada unidad',
						a: 'Nadie queda atrás para siempre y se compite en equipo.'
					},
					{
						t: 'Quien queda último presenta primero',
						a: 'Le da a todos una razón para no quedar últimos.'
					}
				],
				correct: 2,
				hint: '¿Qué pieza le deja al estudiante 38 una vía de regreso?',
				explain:
					'Solo la tabla por equipos cumple las reglas de la competencia amistosa: segmentada, de bajo riesgo y reversible. Las otras tres crean pozos de fallo o imponen stakes reales sin opt-in. Eso explica por qué se fueron los diez últimos.',
				mine: {
					sara: 'Piensa en el estudiante 38 en la semana 10. ¿Qué pieza le deja una razón para volver?',
					wilkins:
						'El reinicio por unidad es la pieza mecánica que evita el pozo de fallo. Lo demás es exposición sin salida.',
					kira: 'Una meta que ya no puedes alcanzar deja de ser meta. El ranking global le quitó la meta a diez personas.',
					emma: 'Comparar a 45 personas en una sola tabla es medir mal. Mide por equipos y por unidades, y la tabla vuelve a contar algo útil.'
				},
				next: 'Para cada pieza competitiva pregunta: ¿qué le pasa a quien va perdiendo?'
			},
			{
				title: 'La liga de debate',
				setup:
					'Un club universitario de debate quiere un sistema de competencia exigente, con ranking, ascensos y descensos. Hay miembros que solo quieren practicar sin presión.',
				ficha: [
					[
						'Competencia amistosa',
						'Bajo riesgo, reversible, entre pares de nivel similar. Sin rankings absolutos.'
					],
					['Alto rendimiento', 'Exigencia real, pero siempre opt-in, con emparejamiento y ligas.'],
					[
						'Competencia destructiva',
						'Suma cero, exposición sin recuperación o stakes impuestos. Se prohíbe en BEM.'
					],
					['Opt-in', 'La persona elige activamente entrar al sistema exigente.']
				],
				q: '¿Qué necesita la liga para ser Alto Rendimiento y no Competencia Destructiva?',
				options: [
					{
						t: 'Que sea obligatoria para todos los miembros',
						a: 'Si es para todos, nadie se queda atrás.'
					},
					{
						t: 'Que sea opt-in, con emparejamiento por nivel y ligas',
						a: 'Entra quien quiere exigencia, y compite con pares de su nivel.'
					},
					{
						t: 'Que el último de cada mes pierda su cupo',
						a: 'Así la exigencia es real.'
					},
					{
						t: 'Que el ranking sea global y público',
						a: 'La transparencia motiva a todos.'
					}
				],
				correct: 1,
				hint: '¿Qué pasa con quienes solo quieren practicar?',
				explain:
					'El alto rendimiento es legítimo cuando es opt-in y tiene emparejamiento y ligas. Si se impone a todos, o castiga sin retorno, cruza a competencia destructiva.',
				mine: {
					sara: 'Los que solo quieren practicar también son el club. Un sistema obligatorio los expulsa sin decirlo.',
					wilkins:
						'Tres piezas obligatorias: opt-in, emparejamiento y ligas. Si falta una, la liga se rompe.',
					kira: 'Quien entra a la liga eligió esa meta. Esa elección es lo que legitima la presión.',
					emma: 'Medir a todos con la misma vara es medir mal. Las ligas son una forma de medir con justicia.'
				},
				next: 'Antes de subir la exigencia, pregunta quién la eligió.'
			},
			{
				title: 'El reto entre cursos',
				setup:
					'Dos cursos paralelos compiten durante el semestre: el que tenga más entregas a tiempo gana una salida de campo. El curso que pierde no va. Nadie eligió participar.',
				ficha: [
					['Competencia amistosa', 'Bajo riesgo, reversible, entre pares de nivel similar.'],
					['Alto rendimiento', 'Exigencia real, pero siempre opt-in, con emparejamiento y ligas.'],
					[
						'Competencia destructiva',
						'Suma cero, exposición sin recuperación o stakes impuestos. Se prohíbe en BEM.'
					],
					['Suma cero', 'Lo que gana uno se lo quita directamente al otro.']
				],
				q: '¿Qué tipo de competencia es el reto entre cursos?',
				options: [
					{
						t: 'Amistosa',
						a: 'Es entre grupos, no entre personas, así que fortalece el equipo.'
					},
					{
						t: 'Alto rendimiento',
						a: 'Hay un premio real y exigencia real.'
					},
					{
						t: 'Destructiva',
						a: 'El premio de un curso es exactamente lo que pierde el otro, y nadie eligió entrar.'
					},
					{
						t: 'No es competencia, es cooperación',
						a: 'Dentro de cada curso todos colaboran.'
					}
				],
				correct: 2,
				hint: '¿Qué le pasa al curso que pierde, y quién eligió ese riesgo?',
				explain:
					'Es Competencia Destructiva: suma cero (la salida de uno es la pérdida del otro) y stakes reales impuestos. Que sea entre grupos no la vuelve amistosa; solo traslada la presión al grupo, que suele castigar al compañero que entregó tarde.',
				mine: {
					sara: 'Piensa en el estudiante que entregó tarde en el curso que perdió. ¿Cómo lo miran sus compañeros?',
					wilkins:
						'Dos piezas lo delatan: suma cero y nadie eligió entrar. Con una sola ya habría que revisar.',
					kira: 'La salida de campo debería ser una meta para todos. Aquí se volvió el castigo de la mitad.',
					emma: 'Medir entregas a tiempo está bien. Atarle una pérdida colectiva convierte el dato en una amenaza.'
				},
				next: 'Que una competencia sea entre equipos no la vuelve amistosa: revisa qué pierde el que pierde.'
			}
		]
	},
	{
		id: 'failsmart',
		name: 'El error con acompañamiento',
		mentor: 'giochi',
		kind: 'Fail Smart',
		teaser: 'Elige la señal que recibe quien falla.',
		cases: [
			{
				title: 'El mensaje para Tomás',
				setup:
					'En un quiz con apuestas de seguridad, Tomás apostó 5 (máxima seguridad) y falló. Es la tercera vez esta semana. El sistema tiene que enviarle un mensaje ahora mismo.',
				ficha: [
					[
						'El error es un checkpoint',
						'Perder no es el final: es información para el siguiente intento.'
					],
					['Transparencia', 'La señal dice qué variable cambiar. Sin eso, el fallo es ruido.'],
					[
						'Brecha de confianza',
						'Apostar alto y fallar es una disonancia útil, no una vergüenza.'
					],
					['Inadecuación', 'Compararse sin ayuda daña la autoeficacia.']
				],
				q: '¿Qué mensaje le envías a Tomás?',
				options: [
					{
						t: '«Incorrecto. Pierdes 5 puntos.»',
						a: 'Es claro y tiene consecuencias.'
					},
					{
						t: '«Estabas muy seguro y no coincidió: esa brecha es lo que vale revisar. Mira el criterio 2 y vuelve a intentarlo. Tu progreso sigue intacto.»',
						a: 'Le dice qué revisar y no le quita lo que lleva.'
					},
					{
						t: '«¡Casi! Ganaste una medalla de consolación.»',
						a: 'Lo anima para que no se rinda.'
					},
					{
						t: '«El 80 % de la clase acertó esta pregunta.»',
						a: 'Le muestra que sí era posible.'
					}
				],
				correct: 1,
				hint: 'Busca el mensaje que nombra algo concreto que revisar.',
				explain:
					'Bip-bop. Señal correcta: explica la variable, normaliza la brecha de confianza y protege el progreso. Restar puntos castiga, la medalla premia el fallo y el 80 % compara sin ayudar.',
				mine: {
					sara: 'Tercera vez en la semana: Tomás necesita sentir que el sistema está de su lado.',
					wilkins:
						'Una señal útil trae una variable que cambiar. Si no la trae, es una notificación.',
					kira: 'El buen mensaje le devuelve a Tomás su próxima meta: revisar el criterio 2.',
					emma: 'Compararlo con el 80 % es la forma más precisa de hacerlo sentir mal sin enseñarle nada.'
				},
				next: 'Diseña la carta del error con la misma atención que la del acierto.'
			},
			{
				title: 'El checkpoint del laboratorio',
				setup:
					'Un simulador de laboratorio tiene 6 pasos. En el paso 4, el más difícil, Sofía mezcló mal los reactivos. El equipo de diseño discute qué debe pasar.',
				ficha: [
					[
						'El error es un checkpoint',
						'Perder no es el final: es información para el siguiente intento.'
					],
					[
						'A más dificultad, menos penalización',
						'En un jefe difícil, el juego te regresa al inicio del combate, no al inicio del juego.'
					],
					['Transparencia', 'La señal dice qué variable cambiar.'],
					['Fracaso sin feedback', 'Fallar sin saber por qué es ruido y castigo.']
				],
				q: '¿Qué debe pasar cuando Sofía falla en el paso 4?',
				options: [
					{
						t: 'Vuelve al paso 1 y pierde su puntaje',
						a: 'Así aprende a no equivocarse.'
					},
					{
						t: 'Vuelve al inicio del paso 4 con una nota de qué variable revisar',
						a: 'Repite solo lo difícil y sabe qué cambiar.'
					},
					{
						t: 'Sigue adelante y ve su nota al final',
						a: 'No interrumpe el flujo del laboratorio.'
					},
					{
						t: 'El simulador se bloquea hasta el día siguiente',
						a: 'Le da tiempo para estudiar.'
					}
				],
				correct: 1,
				hint: '¿Qué paso es el más difícil y qué tan lejos debería mandarla el error?',
				explain:
					'Bip-bop. A mayor dificultad, menor penalización: el checkpoint vuelve al inicio del paso difícil y dice qué variable revisar. Volver al paso 1 castiga, seguir sin feedback es ruido y el bloqueo rompe la persistencia.',
				mine: {
					sara: 'Imagina a Sofía repitiendo tres pasos que ya domina para volver a fallar en el cuarto. Ahí se rinde.',
					wilkins:
						'La pieza correcta es un checkpoint en el paso difícil más una señal con la variable. Las dos, no una.',
					kira: 'Su meta era dominar el paso 4. El checkpoint la deja exactamente frente a esa meta.',
					emma: 'Una nota al final te dice que fallaste, no dónde. Eso no es evaluación, es un veredicto.'
				},
				next: 'Pon el checkpoint justo antes de lo difícil y acompáñalo de una variable a revisar.'
			},
			{
				title: 'La racha de Valeria',
				setup:
					'Una app de estudio cuenta días seguidos de práctica. Valeria llevaba 40 días. Se enfermó, no entró dos días y la racha volvió a cero. Desde entonces no ha vuelto a abrir la app.',
				ficha: [
					[
						'Puntos de Obstáculo',
						'Algo que se pierde o se acumula como amenaza. Siempre necesitan una vía de recuperación.'
					],
					[
						'Indefensión aprendida',
						'Si nada de lo que haga cambia el resultado, la persona deja de intentarlo.'
					],
					[
						'El error es un checkpoint',
						'Perder no es el final: es información para el siguiente intento.'
					],
					['Lo ganado se conserva', 'Lo que registra el camino recorrido nunca se pierde.']
				],
				q: '¿Qué cambio de diseño aplica Fail Smart?',
				options: [
					{
						t: 'Mostrar un mensaje motivador cuando se pierde la racha',
						a: 'Que Valeria sienta que la app la entiende.'
					},
					{
						t: 'Conservar su récord de 40 días y dejarla recuperar la racha con un micro-reto',
						a: 'No vuelve a cero y tiene una vía clara de regreso.'
					},
					{
						t: 'Quitar la racha de la app',
						a: 'Si la racha hace daño, mejor no tenerla.'
					},
					{
						t: 'Enviarle recordatorios más insistentes',
						a: 'Así no se le olvida volver.'
					}
				],
				correct: 1,
				hint: '¿Qué necesita Valeria para creer que volver vale la pena?',
				explain:
					'Bip-bop. La racha es un Punto de Obstáculo y debe tener vía de recuperación. Conservar el récord protege lo ganado; el micro-reto le devuelve la agencia. Un mensaje amable sin cambiar la regla no la saca de la indefensión.',
				mine: {
					sara: 'Valeria no dejó de querer estudiar. Dejó de creer que 40 días valían algo.',
					wilkins:
						'La pieza rota es la caída a cero. Arreglas esa regla y el mensaje ya no hace falta.',
					kira: 'Su meta seguía ahí. La app le quitó el camino hacia ella en un solo día.',
					emma: 'Un récord que desaparece es un dato que el sistema tiró a la basura. Consérvalo.'
				},
				next: 'Toda pérdida que diseñes necesita su camino de regreso.'
			}
		]
	}
];

export const BUDGET: { id: 'a' | 'b' | 'c' | 'd'; name: string }[] = [
	{
		id: 'a',
		name: 'Tabla por equipos que se reinicia cada semana'
	},
	{
		id: 'b',
		name: 'Metas secundarias opcionales de verdad'
	},
	{
		id: 'c',
		name: 'Feedback que acompaña el error'
	},
	{
		id: 'd',
		name: 'Más medallas y premios semanales'
	}
];

export const EXP0_MENTOR: Record<CabeceraKey, string> = {
	sara: '¿Quiénes crees que se fueron primero: los de arriba o los de abajo del ranking?',
	wilkins: 'Duplicar el uso un mes no dice nada del mes 4. Mide la persistencia, no el pico.',
	kira: 'Un mes de números altos sin una meta detrás son fuegos artificiales.',
	emma: 'Si solo hubieran medido el mes 1, le habrían puesto un 5 a este sistema. Por eso se mide en ventanas de tiempo.'
};
export const BUDGET_MENTOR: Record<CabeceraKey, string> = {
	sara: 'Las curvas que se sostienen son las que cuidan a las personas cuando fallan.',
	wilkins:
		'Las medallas compran el mes 1. El mes 4 lo sostienen las metas opcionales reales y el feedback que acompaña el error.',
	kira: 'Mira el mes 4: ahí se ve si el sistema tenía una meta o solo un pico.',
	emma: 'Qué bonita es una curva que no se cae. Esa es la evaluación que me importa.'
};
export const CLOSE_MENTOR: Record<CabeceraKey, string> = {
	sara: 'Hoy no solo respondiste: escuchaste a otros y te dejaste mover por buenos argumentos. Eso también se diseña.',
	wilkins: 'Cada caso fue un ciclo completo. Ya sabes cómo se ve un sistema por dentro.',
	kira: 'Llévate una meta concreta: el cambio que escribiste en la integración.',
	emma: 'Mira tu recorrido: esa es una evaluación que cuenta una historia, no una nota.'
};

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
