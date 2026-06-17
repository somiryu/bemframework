export interface WorkshopSlide {
	id: number;
	part: 1 | 2 | 3 | 4;
	type: 'rating' | 'priority' | 'classification' | 'classification_rating' | 'summary';
	title: string;
	concept?: string;
	variable?: string;
	metaList?: { id: string; text: string; correctCategory?: string; correctRating?: number }[];
	categories?: string[];
	minLabel?: string;
	maxLabel?: string;
	explanation?: { positive: string; negative: string };
}

export const world4WorkshopSlides: WorkshopSlide[] = [
	// PARTE 1: CALIBRACIÓN DE EXPECTATIVAS (Slides 1 a 7)
	{
		id: 1,
		part: 1,
		type: 'rating',
		title: 'Variable 1: Deseabilidad (Atracción y Motivación Inicial)',
		concept: 'Evalúen la deseabilidad (atracción y motivación inicial) de las siguientes 4 metas para estudiantes en un contexto de aprendizaje del 1 al 5.',
		variable: 'deseabilidad',
		minLabel: 'Poco atractiva',
		maxLabel: 'Muy atractiva',
		metaList: [
			{ id: 'p1_s1_a', text: 'Aprender vocabulario médico básico jugando partidas rápidas de trivia contra compañeros en vivo.' },
			{ id: 'p1_s1_b', text: 'Estudiar un reporte técnico impreso de 80 páginas sobre políticas de salud pública sin checkpoints intermedios.' },
			{ id: 'p1_s1_c', text: 'Dominar pronunciación básica de alemán participando en una aventura interactiva de rol conversacional en la app.' },
			{ id: 'p1_s1_d', text: 'Resolver una guía escrita obligatoria de 40 problemas de álgebra para entregar la próxima semana.' }
		]
	},
	{
		id: 2,
		part: 1,
		type: 'rating',
		title: 'Variable 2: Progreso Visible (Retroalimentación del Avance)',
		concept: 'Evalúen el progreso visible (retroalimentación constante) de las siguientes 4 metas del 1 al 5.',
		variable: 'progresoVisible',
		minLabel: 'Sin hitos de avance',
		maxLabel: 'Feedback constante',
		metaList: [
			{ id: 'p1_s2_a', text: 'Completar retos de código en un simulador que muestra tu progreso en tiempo real con una barra de energía y medallas de nivel.' },
			{ id: 'p1_s2_b', text: 'Tomar un curso de historia del arte viendo 20 videos grabados seguidos sin cuestionarios ni hitos de avance.' },
			{ id: 'p1_s2_c', text: 'Aprender geografía desbloqueando regiones interactivas en un mapa 3D a medida que respondes preguntas correctas.' },
			{ id: 'p1_s2_d', text: 'Preparar un ensayo final de 15 páginas sobre sociología urbana con una única entrega calificada al terminar el semestre.' }
		]
	},
	{
		id: 3,
		part: 1,
		type: 'rating',
		title: 'Variable 3: Dificultad / Probabilidad de Logro (Desafío Equilibrado)',
		concept: 'Evalúen la probabilidad de logro (qué tan superable o equilibrada se percibe la dificultad) de las siguientes 4 metas del 1 al 5.',
		variable: 'dificultad',
		minLabel: 'Casi imposible / Alto riesgo',
		maxLabel: 'Alcanzable con esfuerzo',
		metaList: [
			{ id: 'p1_s3_a', text: 'Resolver un rompecabezas matemático de lógica donde tienes intentos ilimitados y pistas dinámicas que se adaptan a tus errores.' },
			{ id: 'p1_s3_b', text: 'Presentar un examen final de certificación de 3 horas donde si fallas debes pagar y esperar 6 meses para volver a intentarlo.' },
			{ id: 'p1_s3_c', text: 'Completar un reto de programación en parejas donde el simulador te otorga "vidas de ayuda" extra si cooperas con tu equipo.' },
			{ id: 'p1_s3_d', text: 'Memorizar y recitar un poema clásico de 50 líneas ante el profesor en una sola oportunidad sin apuntes.' }
		]
	},
	{
		id: 4,
		part: 1,
		type: 'rating',
		title: 'Variable 4: Plazo / Término (Proximidad del Logro)',
		concept: 'Evalúen el plazo o proximidad del logro (cercanía en el tiempo) de las siguientes 4 metas del 1 al 5.',
		variable: 'plazo',
		minLabel: 'Muy lejano',
		maxLabel: 'Inmediato o muy cercano',
		metaList: [
			{ id: 'p1_s4_a', text: 'Realizar una trivia de 5 minutos de ortografía al día para mantener una "racha" de aprendizaje activa en la app móvil.' },
			{ id: 'p1_s4_b', text: 'Cursar un programa de especialización a distancia de 2 años entregando un proyecto final extenso al terminar.' },
			{ id: 'p1_s4_c', text: 'Resolver un simulador virtual de física en el laboratorio antes de que expire el temporizador de 10 minutos.' },
			{ id: 'p1_s4_d', text: 'Estudiar durante un año escolar completo para presentar la prueba de estado de educación superior.' }
		]
	},
	{
		id: 5,
		part: 1,
		type: 'rating',
		title: 'Variable 5: Consistencia de Medición (Objetividad)',
		concept: 'Evalúen la consistencia de medición (claridad y objetividad de las reglas de calificación) de las siguientes 4 metas del 1 al 5.',
		variable: 'consistencia',
		minLabel: 'Criterios subjetivos / azar',
		maxLabel: 'Criterios objetivos y claros',
		metaList: [
			{ id: 'p1_s5_a', text: 'Participar en un debate en el aula donde la nota final depende de la apreciación global e informal del profesor.' },
			{ id: 'p1_s5_b', text: 'Completar un test de opción múltiple automatizado donde el sistema te da tu nota y desglose de aciertos inmediatamente.' },
			{ id: 'p1_s5_c', text: 'Entregar un portafolio de diseño que se califica usando una rúbrica pública y detallada con ejemplos de cada nivel de logro.' },
			{ id: 'p1_s5_d', text: 'Exponer tu proyecto de semestre ante un jurado invitado con criterios de evaluación abiertos y variados.' }
		]
	},
	{
		id: 6,
		part: 1,
		type: 'rating',
		title: 'Variable 6: Nivel de Agencia vs Incertidumbre (Autonomía)',
		concept: 'Evalúen el nivel de agencia o autonomía real que el estudiante tiene sobre el camino para alcanzar las siguientes 4 metas del 1 al 5.',
		variable: 'agencia',
		minLabel: 'Sin control / Lineal',
		maxLabel: 'Alto control / Autonomía total',
		metaList: [
			{ id: 'p1_s6_a', text: 'Superar un caso clínico interactivo donde ocurren complicaciones aleatorias y eventos imprevistos que te obligan a reaccionar.' },
			{ id: 'p1_s6_b', text: 'Seguir un tutorial lineal y estructurado paso a paso donde no puedes saltarte páginas ni tomar caminos alternativos.' },
			{ id: 'p1_s6_c', text: 'Explorar un sandbox virtual de historia donde decides libremente qué épocas y personajes investigar primero.' },
			{ id: 'p1_s6_d', text: 'Asistir a una clase magistral obligatoria donde el orden de los temas y las diapositivas está estrictamente predefinido.' }
		]
	},
	{
		id: 7,
		part: 1,
		type: 'rating',
		title: 'Variable 7: Esfuerzo / Trabajo Requerido (Carga Cognitiva)',
		concept: 'Evalúen el esfuerzo y carga cognitiva requerida percibida (esfuerzo ligero vs carga extrema) de las siguientes 4 metas del 1 al 5.',
		variable: 'esfuerzo',
		minLabel: 'Carga cognitiva extrema',
		maxLabel: 'Esfuerzo ligero y accesible',
		metaList: [
			{ id: 'p1_s7_a', text: 'Dominar modelado 3D profesional avanzado realizando maquetas de alta complejidad técnica y artística.' },
			{ id: 'p1_s7_b', text: 'Familiarizarse con las normas del aula completando una breve trivia humorística de 3 preguntas.' },
			{ id: 'p1_s7_c', text: 'Redactar y sustentar una tesis de investigación recopilando datos de campo en terreno durante un semestre.' },
			{ id: 'p1_s7_d', text: 'Conocer la historia de la institución hojeando una infografía interactiva de 5 secciones.' }
		]
	},
	{
		id: 8,
		part: 1,
		type: 'priority',
		title: 'Variable 8: Priorización de Diseño de Expectativas',
		concept: 'Distribuyan 15 puntos de prioridad entre las 7 variables anteriores para reflejar cuáles consideran más críticas para lograr alto engagement.',
		variable: 'priorizacion',
		categories: ['deseabilidad', 'progresoVisible', 'dificultad', 'plazo', 'consistencia', 'agencia', 'esfuerzo']
	},

	// PARTE 2: CLASIFICACIÓN DE LA ESTRUCTURA DE METAS (MATRIZ QUIERO/TENGO) (Slide 9)
	{
		id: 9,
		part: 2,
		type: 'classification',
		title: 'Clasificación: Matriz de Estructura de Metas (Quiero / Tengo)',
		concept: 'Clasifiquen los 8 escenarios de metas de aprendizaje en el cuadrante correcto de la Matriz Quiero/Tengo según la acción requerida para mantener o cambiar el estado actual.',
		variable: 'matrix_sorting',
		categories: [
			'Quiero y Tengo (Mantenimiento)',
			'No Quiero y Tengo (Eliminación)',
			'Quiero y No Tengo (Adquisición)',
			'No Quiero y No Tengo (Prevención)'
		],
		metaList: [
			{ id: 'p2_s1', text: 'El docente otorga una exención del examen final a los alumnos destacados. El estudiante ya tiene este beneficio y debe subir un reporte de lectura semanal impecable para no perderlo.', correctCategory: 'Quiero y Tengo (Mantenimiento)' },
			{ id: 'p2_s2', text: 'El docente diseñó un multiplicador de puntos por racha de participación semanal activa. El alumno ya tiene el multiplicador x2 y debe participar al menos una vez en el foro de esta semana para mantenerlo.', correctCategory: 'Quiero y Tengo (Mantenimiento)' },
			{ id: 'p2_s3', text: 'El docente asignó al estudiante una penalización de retraso en el laboratorio anterior. Para borrar esta marca y recuperar los puntos perdidos, la meta es entregar dos resúmenes conceptuales antes del viernes.', correctCategory: 'No Quiero y Tengo (Eliminación)' },
			{ id: 'p2_s4', text: 'El alumno tiene una alerta por inasistencia que bloquea su derecho a parciales. Para eliminar la alerta, la meta es completar y entregar una investigación complementaria asignada por el docente.', correctCategory: 'No Quiero y Tengo (Eliminación)' },
			{ id: 'p2_s5', text: 'El estudiante quiere el derecho de usar una hoja de apuntes en el parcial final, beneficio que el docente otorga a quienes completen los 5 retos opcionales de la plataforma.', correctCategory: 'Quiero y No Tengo (Adquisición)' },
			{ id: 'p2_s6', text: 'El estudiante quiere obtener el rol de líder del proyecto (lo que otorga autonomía y puntos adicionales). Para ganarse el rol, la meta es aprobar el quiz de selección de líderes antes del martes.', correctCategory: 'Quiero y No Tengo (Adquisición)' },
			{ id: 'p2_s7', text: 'El estudiante no tiene sanciones de deshonestidad académica. Para evitar recibir un reporte de plagio y reprobar la materia, la meta es pasar el borrador por la herramienta de auto-validación de citas del curso.', correctCategory: 'No Quiero y No Tengo (Prevención)' },
			{ id: 'p2_s8', text: 'El alumno va al día y no está en riesgo. Para evitar caer en la lista de bajo rendimiento (que lo obligaría a asistir a tutorías presenciales los sábados), la meta es mantener un promedio mayor a 3.0 en las evaluaciones semanales.', correctCategory: 'No Quiero y No Tengo (Prevención)' }
		]
	},

	// PARTE 3: TIPOS DE METAS (Slides 10 a 14)
	{
		id: 10,
		part: 3,
		type: 'rating',
		title: 'Alineación de Metas Narrativas (Motivación e Identidad)',
		concept: 'Evalúen el nivel de integración/alineación entre el contexto narrativo (la ficción) y la actividad de aprendizaje real de las siguientes 10 metas del 1 al 5.',
		variable: 'narrative_alignment',
		minLabel: 'Decorativa / Desalineada',
		maxLabel: 'Integrada / Altamente Alineada',
		explanation: {
			positive: 'Meta Narrativa Alineada: La narrativa (ficción) y la acción de aprendizaje real están integradas. Por ejemplo, redactar reportes de espionaje basados en documentos de la época para estudiar la Guerra Fría.',
			negative: 'Meta Narrativa Desalineada: La ficción es puramente decorativa o cosmética. Por ejemplo, derrotar a un dragón seleccionando verbos en inglés (la fantasía de calabozo no tiene relación con las reglas de gramática).'
		},
		metaList: [
			{ id: 'p3_s1_1', text: 'Pilotar un cohete espacial de la Tierra a Saturno resolviendo ecuaciones de álgebra lineal.' },
			{ id: 'p3_s1_2', text: 'Competir como editores literarios seleccionando cuentos nacionales y redactando un prólogo para publicar la mejor antología de cuento colombiano.' },
			{ id: 'p3_s1_3', text: 'Derrotar a un dragón de fuego en un calabozo seleccionando los verbos correctos en inglés.' },
			{ id: 'p3_s1_4', text: 'Investigar la Guerra Fría redactando reportes de espionaje basados en documentos desclasificados reales de la época.' },
			{ id: 'p3_s1_5', text: 'Navegar un barco pirata sumando fracciones y decimales para ganar cofres de oro.' },
			{ id: 'p3_s1_6', text: 'Resolver diagnósticos críticos de pacientes virtuales en urgencias para graduarte de médico interno.' },
			{ id: 'p3_s1_7', text: 'Sobrevivir a una horda de zombies respondiendo preguntas de opción múltiple sobre el manual de convivencia escolar.' },
			{ id: 'p3_s1_8', text: 'Redactar una crónica periodística de investigación simulando cubrir una noticia de última hora con entrevistas ficticias en tiempo real.' },
			{ id: 'p3_s1_9', text: 'Construir un castillo feudal respondiendo trivias sobre los componentes del hardware de un computador.' },
			{ id: 'p3_s1_10', text: 'Asumir el rol de un consultor de gamificación y estructurar un canvas de metas para resolver el bajo engagement de una app real.' }
		]
	},
	{
		id: 11,
		part: 3,
		type: 'classification_rating',
		title: 'Metas Principales: Tipo y Frustración Percibida',
		concept: 'Clasifiquen cada una de las 8 metas principales obligatorias según su tipo (Aproximación vs Evasión) y califiquen el nivel de frustración que percibes del 1 al 5.',
		variable: 'principal_goals',
		categories: ['Aproximación', 'Evasión'],
		minLabel: 'Alcanzable / Estimulante',
		maxLabel: 'Altamente Frustrante',
		metaList: [
			{ id: 'p3_s2_1', text: 'Reiniciar un ensayo crítico de 5 páginas desde el principio si cometes más de 5 errores ortográficos en tu borrador final.', correctCategory: 'Evasión', correctRating: 5 },
			{ id: 'p3_s2_2', text: 'Resolver 50 problemas de cálculo avanzado en 10 minutos sin errores para poder pasar el taller semanal.', correctCategory: 'Aproximación', correctRating: 5 },
			{ id: 'p3_s2_3', text: 'Recibir una penalización de -1.5 puntos en la nota final del proyecto de grupo si uno solo de los integrantes no sube su parte antes de la medianoche.', correctCategory: 'Evasión', correctRating: 4 },
			{ id: 'p3_s2_4', text: 'Exponer tu investigación oral de forma fluida durante 8 minutos exactos sin mirar diapositivas ni notas impresas para obtener la nota máxima.', correctCategory: 'Aproximación', correctRating: 4 },
			{ id: 'p3_s2_5', text: 'Responder correctamente 8 de las 10 preguntas de la trivia de física antes del viernes, contando con 2 intentos de reactivación del cuestionario.', correctCategory: 'Aproximación', correctRating: 2 },
			{ id: 'p3_s2_6', text: 'Evitar perder los puntos de bonificación del laboratorio entregando el pre-informe con al menos 12 horas de anticipación a la sesión práctica.', correctCategory: 'Evasión', correctRating: 2 },
			{ id: 'p3_s2_7', text: 'Completar 3 resúmenes de lectura de 1 página cada semana siguiendo una rúbrica de evaluación clara y progresiva.', correctCategory: 'Aproximación', correctRating: 1 },
			{ id: 'p3_s2_8', text: 'Mantener tu puntaje de participación semanal evitando acumular más de 2 inasistencias sin justificación.', correctCategory: 'Evasión', correctRating: 1 }
		]
	},
	{
		id: 12,
		part: 3,
		type: 'classification_rating',
		title: 'Metas Secundarias voluntarias (Grupo A): Drivers y Nivel de Incentivo',
		concept: 'Para cada meta secundaria voluntaria, clasifiquen el Driver BEM predominante (Maestría, Descubrimiento o Eficiencia) y evalúen el nivel de incentivo de la meta del 1 al 5.',
		variable: 'secondary_goals_a',
		categories: ['Maestría', 'Descubrimiento', 'Eficiencia'],
		minLabel: 'Cero / Arbitrario',
		maxLabel: 'Alto / Estructural',
		explanation: {
			positive: 'Meta Incentivada: Ofrece una recompensa de alta utilidad para el estudiante en el ecosistema del curso (ej: bonificaciones en notas, exenciones de laboratorios, privilegios o monedas).',
			negative: 'Meta NO Incentivada: Se basa puramente en motivación intrínseca, curiosidad intelectual o retroalimentación estética, sin alterar las calificaciones o las reglas del curso (ej: diseñar plantillas por comodidad, leer recursos extra por gusto, maquetar con colores bonitos).'
		},
		metaList: [
			{ id: 'p3_s3_1', text: 'Encontrar al menos 5 cuentos inéditos de autores poco conocidos que ninguna otra editorial haya seleccionado. Obtienes +1.0 de bonificación en el parcial.', correctCategory: 'Maestría', correctRating: 5 },
			{ id: 'p3_s3_2', text: 'Redactar el prólogo de tu antología en un formato de ensayo académico avanzado voluntariamente para autoevaluar tu nivel.', correctCategory: 'Maestría', correctRating: 1 },
			{ id: 'p3_s3_3', text: 'Investigar e incluir en tu antología un cuento raro de autoría anónima del siglo XIX. Las mejores se expondrán en la galería del curso.', correctCategory: 'Descubrimiento', correctRating: 3 },
			{ id: 'p3_s3_4', text: 'Leer y explorar 10 cuentos adicionales recomendados en el índice de la biblioteca por pura curiosidad intelectual.', correctCategory: 'Descubrimiento', correctRating: 1 },
			{ id: 'p3_s3_5', text: 'Organizar los roles de tu equipo para entregar todo 24 horas antes del plazo. Si lo logran, quedan eximidos de asistir al laboratorio del viernes.', correctCategory: 'Eficiencia', correctRating: 5 },
			{ id: 'p3_s3_6', text: 'Diseñar una plantilla compartida en Notion para consolidar las referencias y cuentos recopilados de la manera más rápida posible.', correctCategory: 'Eficiencia', correctRating: 1 }
		]
	},
	{
		id: 13,
		part: 3,
		type: 'classification_rating',
		title: 'Metas Secundarias voluntarias (Grupo B): Drivers y Nivel de Incentivo',
		concept: 'Para cada meta secundaria, clasifiquen el Driver BEM predominante (Relacionamiento, Empoderamiento o Hedonismo) y califiquen el nivel de incentivo de la meta del 1 al 5.',
		variable: 'secondary_goals_b',
		categories: ['Relacionamiento', 'Empoderamiento', 'Hedonismo'],
		minLabel: 'Cero / Arbitrario',
		maxLabel: 'Alto / Estructural',
		explanation: {
			positive: 'Meta Incentivada: Ofrece una recompensa de alta utilidad para el estudiante en el ecosistema del curso (ej: bonificaciones en notas, exenciones de laboratorios, privilegios o monedas).',
			negative: 'Meta NO Incentivada: Se basa puramente en motivación intrínseca, curiosidad intelectual o retroalimentación estética, sin alterar las calificaciones o las reglas del curso (ej: diseñar plantillas por comodidad, leer recursos extra por gusto, maquetar con colores bonitos).'
		},
		metaList: [
			{ id: 'p3_s4_1', text: 'Co-redactar el prólogo en colaboración con un compañero de otro equipo. Ambos quedan eximidos de entregar la bitácora individual semanal.', correctCategory: 'Relacionamiento', correctRating: 5 },
			{ id: 'p3_s4_2', text: 'Revisar y dejar comentarios de sugerencias constructivas en los borradores de al menos 2 equipos compañeros por empatía académica.', correctCategory: 'Relacionamiento', correctRating: 1 },
			{ id: 'p3_s4_3', text: 'Competir en votación de calidad editorial: el equipo más votado se vuelve la "Editorial Referente" y define criterios de rúbrica final.', correctCategory: 'Empoderamiento', correctRating: 3 },
			{ id: 'p3_s4_4', text: 'Personalizar libremente el orden, la jerarquía y la estructura de los capítulos de tu antología digital según tu propio criterio.', correctCategory: 'Empoderamiento', correctRating: 1 },
			{ id: 'p3_s4_5', text: 'Diseñar una portada artística y diagramación elegante. Las portadas irán a votación para definir un ranking social de estética en el grupo.', correctCategory: 'Hedonismo', correctRating: 3 },
			{ id: 'p3_s4_6', text: 'Maquetar la versión interactiva de tu antología digital utilizando una paleta de colores de tu elección para que se vea visualmente agradable.', correctCategory: 'Hedonismo', correctRating: 1 }
		]
	},
	{
		id: 14,
		part: 3,
		type: 'classification',
		title: 'Micro-Juego: Clasifica el Tipo de Meta',
		concept: 'Clasifiquen cada una de las 6 metas de aprendizaje de contextos variados arrastrándolas o seleccionando su casilla correspondiente: Narrativa, Principal o Secundaria.',
		variable: 'type_sorting',
		categories: ['Narrativa', 'Principal', 'Secundaria'],
		metaList: [
			{ id: 'p3_s5_1', text: 'Eres un cronista del futuro enviado al pasado para documentar cómo las ciudades del siglo XX aprendieron a convivir con la tecnología. Tu misión: reconstruir esa historia.', correctCategory: 'Narrativa' },
			{ id: 'p3_s5_2', text: 'Entregar un análisis escrito de 3 páginas sobre las causas de la Revolución Industrial antes del próximo viernes, con mínimo 4 fuentes en normas APA. Nota mínima: 3.5.', correctCategory: 'Principal' },
			{ id: 'p3_s5_3', text: 'Si tu equipo logra que todos sus integrantes completen el reto de vocabulario técnico en la app antes del jueves, obtienen una sesión exclusiva de retroalimentación con el docente previo al examen.', correctCategory: 'Secundaria' },
			{ id: 'p3_s5_4', text: 'El salón es una agencia de detectives literarios encargada de resolver qué cuento colombiano del siglo XX fue el más influyente y por qué. Cada equipo es una editorial rival.', correctCategory: 'Narrativa' },
			{ id: 'p3_s5_5', text: 'Aprobar con mínimo 7/10 el quiz de comprensión lectora de los capítulos 4 al 7 antes del miércoles. El quiz tiene dos intentos disponibles.', correctCategory: 'Principal' },
			{ id: 'p3_s5_6', text: 'Diseñar voluntariamente una infografía visual con los datos más llamativos de tu investigación y compartirla en el mural digital del curso para recibir comentarios de tus compañeros.', correctCategory: 'Secundaria' }
		]
	},

	// RESUMEN / FINAL (Slide 15)
	{
		id: 15,
		part: 4,
		type: 'summary',
		title: 'Resumen del Taller: Arquitectura de Metas',
		concept: '¡Felicitaciones! Han completado la calibración de variables de expectativa, la estructura de la Matriz Quiero/Tengo y la tipología de objetivos.'
	}
];
