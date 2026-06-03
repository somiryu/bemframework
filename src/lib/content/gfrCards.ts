export interface GFRCard {
	id: string;
	text: string;
	gfr: 'meta' | 'retroalimentacion' | 'recompensa';
	rii: 'regulatorio' | 'integrado' | 'intrinseco';
	explanation: string;
}

export const workshopCards: GFRCard[] = [
	{
		id: 'ws_mr1',
		text: 'Si asistes a la sesión de estudio grupal para preparar el examen de cálculo, obtienes 10 puntos canjeables en la cafetería.',
		gfr: 'meta',
		rii: 'regulatorio',
		explanation: 'Es una Meta porque los puntos canjeables en la cafetería representan un objeto externo que el estudiante desea obtener y no tiene en este momento. Es Regulatorio porque este incentivo está completamente desalineado con el aprendizaje de las matemáticas.'
	},
	{
		id: 'ws_mr2',
		text: 'Si resuelves el cuestionario de historia de forma individual, obtienes el derecho a salir 10 minutos antes a la cafetería.',
		gfr: 'meta',
		rii: 'regulatorio',
		explanation: 'Es una Meta porque salir antes a la cafetería representa un beneficio externo y deseable que el estudiante desea alcanzar y no tiene en este momento. Es Regulatorio porque el beneficio está desalineado con el aprendizaje histórico.'
	},
	{
		id: 'ws_fr1',
		text: 'Si escribes un ensayo de geografía sobre el calentamiento global, el sistema te muestra estadísticas de la asistencia de tus compañeros a la clase de arte.',
		gfr: 'retroalimentacion',
		rii: 'regulatorio',
		explanation: 'Es Retroalimentación porque muestra datos puros sobre un comportamiento. Es Regulatorio porque los datos de asistencia a la clase de arte están totalmente desalineados de la actividad de escribir sobre geografía.'
	},
	{
		id: 'ws_rr1',
		text: 'Si estudio para el examen de química y por eso obtengo una entrada de cine gratis que no tenía, entonces siento alegría y entusiasmo por ir al estreno.',
		gfr: 'recompensa',
		rii: 'regulatorio',
		explanation: 'Es una Recompensa porque describe una reacción neurológica y emocional de alegría. Es Regulatorio porque la causa de la recompensa, que es ganar entradas de cine, está desalineada con el valor de aprender química.'
	},
	{
		id: 'ws_mi1',
		text: 'Si apruebas el curso avanzado de anatomía, obtienes el derecho a mantener tu acceso exclusivo al laboratorio de disección médica durante el próximo semestre.',
		gfr: 'meta',
		rii: 'integrado',
		explanation: 'Es una Meta porque el derecho a mantener el acceso exclusivo al laboratorio representa un beneficio o estado deseado que el estudiante ya tiene y busca conservar. Es Integrado porque el acceso al laboratorio está directamente alíneado con la práctica médica y sus metas profesionales.'
	},
	{
		id: 'ws_fi1',
		text: 'Si entregas tu tarea de programación tarde, la consola del sistema te despliega la alerta de error indicando los minutos de retraso y la penalización correspondiente sobre tu nota.',
		gfr: 'retroalimentacion',
		rii: 'integrado',
		explanation: 'Es Retroalimentación porque proporciona datos cuantitativos de desempeño. Es Integrado porque la advertencia y el reporte de entrega están directamente alineados con la actividad evaluativa.'
	},
	{
		id: 'ws_fi2',
		text: 'Al terminar la práctica de laboratorio de química, el profesor te entrega una hoja con anotaciones detalladas sobre la precisión de tus mezclas de reactivos.',
		gfr: 'retroalimentacion',
		rii: 'integrado',
		explanation: 'Es Retroalimentación porque es un reporte con datos y observaciones cuantitativas de su desempeño. Es Integrado porque la información está directamente alineada con el experimento químico realizado.'
	},
	{
		id: 'ws_ri1',
		text: 'Si presento el parcial de mi proyecto de biología y por eso el docente califica mi propuesta como pertinente y valiosa para la ciencia, entonces experimento orgullo y validación en mi capacidad intelectual.',
		gfr: 'recompensa',
		rii: 'integrado',
		explanation: 'Es una Recompensa debido a la respuesta emocional de orgullo y validación. Es Integrado porque la causa que la detona está alineada con el valor del proyecto de biología.'
	},
	{
		id: 'ws_mn1',
		text: 'Si practico origami todos los días de manera voluntaria, logro plegar figuras complejas por el puro placer de la precisión geométrica.',
		gfr: 'meta',
		rii: 'intrinseco',
		explanation: 'Es una Meta porque lograr plegar figuras complejas representa un estado futuro deseable y una meta personal que el estudiante busca conseguir. Es Intrínseco porque la meta y el impulso nacen de su propio gozo e interés estético, sin presiones ni recompensas ajenas al plegado.'
	},
	{
		id: 'ws_fn1',
		text: 'Al pintar un lienzo y ver cómo los colores se mezclan en tiempo real exactamente como lo habías imaginado, tus músculos faciales se contraen involuntariamente en una sonrisa de emoción.',
		gfr: 'retroalimentacion',
		rii: 'intrinseco',
		explanation: 'Es Retroalimentación porque es una respuesta biológica y muscular perceptible por los sentidos. Es Intrínseco porque el origen de la señal proviene de su propio sistema corporal.'
	},
	{
		id: 'ws_rin1',
		text: 'Si pinto un atardecer en acuarelas por el puro disfrute de mezclar los colores, entonces experimento una sensación de paz y tranquilidad emocional profunda.',
		gfr: 'recompensa',
		rii: 'intrinseco',
		explanation: 'Es una Recompensa porque describe una reacción neurológica y emocional de paz y tranquilidad. Es Intrínseco porque la meta es autotélica y responde al gozo estético de pintar.'
	},
	{
		id: 'ws_rin2',
		text: 'Si logro escribir un poema breve expresando mis propios sentimientos íntimos en clase de literatura, entonces experimento paz mental y una sensación de desahogo emocional.',
		gfr: 'recompensa',
		rii: 'intrinseco',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta emocional de paz y desahogo. Es Intrínseco porque surge de satisfacer una necesidad interna de expresión artística y literaria.'
	}
];

export const trainingCards: GFRCard[] = [
	// 1. Regulatorio - Meta
	{
		id: 'tr_mr1',
		text: 'Si entregas todos tus resúmenes semanales de historia, ganas un cupón de descuento en una tienda de ropa.',
		gfr: 'meta',
		rii: 'regulatorio',
		explanation: 'Es una Meta porque el cupón representa un objeto deseable futuro que el alumno no tiene y desea obtener. Es Regulatorio porque la recompensa comercial no guarda ninguna alineación con la materia de historia.'
	},
	{
		id: 'tr_mr2',
		text: 'Si participas en el debate de filosofía, eliminas un registro negativo de inasistencias en tu expediente escolar.',
		gfr: 'meta',
		rii: 'regulatorio',
		explanation: 'Es una Meta porque el estudiante desea eliminar una consecuencia negativa que ya posee, lo que califica como una meta de remover un estado no deseado. Es Regulatorio porque quitar la falta administrativa está desalineado con el valor del debate de ideas filosóficas.'
	},
	{
		id: 'tr_mr3',
		text: 'Si estudias tres horas adicionales en la plataforma de matemáticas, el tutor te permite evitar ser reubicado en la primera fila del salón.',
		gfr: 'meta',
		rii: 'regulatorio',
		explanation: 'Es una Meta porque evitar ser reubicado en la primera fila del salón representa un estado futuro indeseable que el estudiante busca evadir. Es Regulatorio porque la ubicación física forzada en el aula está desalineada con el estudio matemático.'
	},

	// 2. Regulatorio - Retroalimentación
	{
		id: 'tr_fr1',
		text: 'Si resuelves ejercicios de álgebra en la plataforma, la interfaz te despliega una gráfica con el consumo de energía eléctrica del laboratorio de computación.',
		gfr: 'retroalimentacion',
		rii: 'regulatorio',
		explanation: 'Es Retroalimentación porque aporta información medible. Es Regulatorio porque el consumo eléctrico de las computadoras no tiene relación ni aporta valor al aprendizaje del álgebra.'
	},
	{
		id: 'tr_fr2',
		text: 'Al completar un examen de literatura, el sistema te muestra el reporte del promedio de calificaciones históricas del colegio en educación física.',
		gfr: 'retroalimentacion',
		rii: 'regulatorio',
		explanation: 'Es Retroalimentación porque muestra métricas de desempeño. Es Regulatorio porque las notas de educación física están completamente desalineadas de la evaluación literaria.'
	},
	{
		id: 'tr_fr3',
		text: 'Si registras tus metas de aprendizaje de la semana en la bitácora escolar, el software te despliega el porcentaje de humedad del aire del patio principal.',
		gfr: 'retroalimentacion',
		rii: 'regulatorio',
		explanation: 'Es Retroalimentación porque provee datos sensoriales y objetivos medibles correspondientes al porcentaje de humedad del aire. Es Regulatorio porque el clima del patio escolar está desalineado con el proceso de planificar el estudio.'
	},

	// 3. Regulatorio - Recompensa
	{
		id: 'tr_rr1',
		text: 'Si termino el proyecto de biología a tiempo y con eso logro eliminar una inasistencia previa de mi registro, entonces siento un inmenso alivio de evitar que llamen a mis padres.',
		gfr: 'recompensa',
		rii: 'regulatorio',
		explanation: 'Es una Recompensa debido a la respuesta emocional de alivio. Es Regulatorio porque se detona al evadir un castigo administrativo escolar como la inasistencia, el cual no está alineado con la biología.'
	},
	{
		id: 'tr_rr2',
		text: 'Si respondo el cuestionario semanal de historia para evitar que el profesor me siente en la primera fila del salón, entonces experimento tranquilidad al saber que pasaré desapercibido.',
		gfr: 'recompensa',
		rii: 'regulatorio',
		explanation: 'Es una Recompensa porque el estudiante experimenta un estado emocional de tranquilidad al evadir un posible conflicto en el salón. Es Regulatorio porque proviene de esquivar una penalización física y espacial arbitraria.'
	},
	{
		id: 'tr_rr3',
		text: 'Si completo el laboratorio de física y por eso el docente me exime de limpiar los estantes de reactivos, entonces experimento una sensación de alivio al librarme de esa tarea.',
		gfr: 'recompensa',
		rii: 'regulatorio',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta neurológica y emocional de alivio al librarse de la tarea de limpieza. Es Regulatorio porque la consecuencia de evitar la limpieza de estantes está desalineada con el conocimiento de física.'
	},

	// 4. Integrado - Meta
	{
		id: 'tr_mi1',
		text: 'Si redactas un ensayo de investigación científica sobresaliente, obtienes la medalla de Investigador Destacado en tu bitácora de la universidad.',
		gfr: 'meta',
		rii: 'integrado',
		explanation: 'Es una Meta porque la medalla representa un reconocimiento que el alumno no tiene en este momento y desea ganar. Es Integrado porque la insignia simboliza y reconoce el valor del mérito científico de su redacción.'
	},
	{
		id: 'tr_mi2',
		text: 'Si asistes a las tutorías semanales de álgebra, logras evitar perder tu racha de logros en la materia por excelencia en la resolución de problemas.',
		gfr: 'meta',
		rii: 'integrado',
		explanation: 'Es una Meta porque evitar perder la racha de logros representa la evasión de un estado de perjuicio futuro que el estudiante busca no tener. Es Integrado porque la racha por excelencia en la resolución de problemas está directamente alineada con el dominio y desempeño en la materia de álgebra.'
	},
	{
		id: 'tr_mi3',
		text: 'Si apruebas el examen de suficiencia de inglés, logras eliminar el prerrequisito obligatorio de cursar los niveles básicos en tu carrera.',
		gfr: 'meta',
		rii: 'integrado',
		explanation: 'Es una Meta porque eliminar el prerrequisito obligatorio representa la remoción de un obstáculo actual que el estudiante desea quitar de su plan de estudios. Es Integrado porque saltar los niveles básicos está alineado con validar su competencia en el idioma.'
	},

	// 5. Integrado - Retroalimentación
	{
		id: 'tr_fi1',
		text: 'Al terminar tu ensayo sobre historia contemporánea, el procesador de texto te muestra un reporte de legibilidad que analiza la claridad y riqueza de tu vocabulario.',
		gfr: 'retroalimentacion',
		rii: 'integrado',
		explanation: 'Es Retroalimentación porque aporta datos objetivos de calidad del texto. Es Integrado porque el reporte de legibilidad está directamente alineado con el desarrollo de competencias de redacción del estudiante.'
	},
	{
		id: 'tr_fi2',
		text: 'Al resolver el examen práctico de química, la balanza digital del laboratorio te indica que la masa final de tu sustancia coincide exactamente con los gramos teóricos calculados.',
		gfr: 'retroalimentacion',
		rii: 'integrado',
		explanation: 'Es Retroalimentación porque la balanza digital entrega datos puros y mediciones físicas correspondientes al peso de la masa obtenida. Es Integrado porque la masa final está alineada con el cálculo químico que se está evaluando.'
	},
	{
		id: 'tr_fi3',
		text: 'Al finalizar tu presentación de oratoria, el sistema de grabación te despliega un gráfico de barras con la velocidad promedio de tus palabras por minuto.',
		gfr: 'retroalimentacion',
		rii: 'integrado',
		explanation: 'Es Retroalimentación al mostrar datos cuantitativos de voz. Es Integrado porque ayuda directamente al orador a medir su ritmo de modulación.'
	},

	// 6. Integrado - Recompensa
	{
		id: 'tr_ri1',
		text: 'Si programo un algoritmo para automatizar un proceso escolar y por eso recibo la insignia digital de Desarrollador Competente en la plataforma, entonces siento satisfacción al ver validada mi habilidad técnica.',
		gfr: 'recompensa',
		rii: 'integrado',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta emocional de satisfacción. Es Integrado porque el detonante es un reconocimiento de maestría directamente alineado con su aprendizaje técnico.'
	},
	{
		id: 'tr_ri2',
		text: 'Si expongo mi proyecto de historia frente al jurado y por eso recibo la invitación a publicar el texto en la revista académica de la escuela, entonces siento orgullo de ver trascender mi esfuerzo.',
		gfr: 'recompensa',
		rii: 'integrado',
		explanation: 'Es una Recompensa porque el estudiante experimenta orgullo intelectual. Es Integrado porque la publicación de la investigación es una consecuencia externa directamente coherente con la excelencia escolar.'
	},
	{
		id: 'tr_ri3',
		text: 'Si explico un tema de matemáticas a un compañero que tiene dificultades y por eso él logra aprobar el examen final de la materia, entonces siento una gran satisfacción al saber que mi apoyo fue de utilidad.',
		gfr: 'recompensa',
		rii: 'integrado',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta emocional de satisfacción al ver que su compañero aprobó el examen. Es Integrado al estar ligada directamente al valor social y colaborativo del aprendizaje.'
	},

	// 7. Intrínseco - Meta
	{
		id: 'tr_mn1',
		text: 'Si estudio astronomía de manera autónoma los fines de semana, logro comprender el origen del universo para saciar mi curiosidad científica.',
		gfr: 'meta',
		rii: 'intrinseco',
		explanation: 'Es una Meta porque comprender el origen del universo representa un nivel de conocimiento deseado que el alumno busca alcanzar. Es Intrínseco porque el fin es puramente autotélico para saciar su propio deseo de entender el cosmos.'
	},
	{
		id: 'tr_mn2',
		text: 'Si practico tallado de madera en mis momentos libres, logro esculpir figuras tridimensionales con gubia para perfeccionar mi destreza manual.',
		gfr: 'meta',
		rii: 'intrinseco',
		explanation: 'Es una Meta porque esculpir figuras tridimensionales representa una destreza técnica que el alumno desea alcanzar y perfeccionar. Es Intrínseco porque no depende de calificaciones ni de reconocimientos de terceros, sino de su propia maestría y placer motriz.'
	},
	{
		id: 'tr_mn3',
		text: 'Si leo un libro de mitología antigua por iniciativa propia, logro descubrir el significado de los mitos griegos clásicos.',
		gfr: 'meta',
		rii: 'intrinseco',
		explanation: 'Es una Meta porque descubrir el significado de los mitos griegos representa un logro cognitivo que el alumno desea alcanzar. Es Intrínseco porque el objetivo responde únicamente al interés intelectual y cultural propio de la lectura.'
	},

	// 8. Intrínseco - Retroalimentación
	{
		id: 'tr_fn1',
		text: 'Al exponer tu proyecto científico frente a un público muy numeroso, sientes cómo tus manos tiemblan ligeramente y la temperatura de tu rostro aumenta debido a los nervios.',
		gfr: 'retroalimentacion',
		rii: 'intrinseco',
		explanation: 'Es Retroalimentación corporal pura. Es Intrínseco porque son señales y reacciones físicas directas generadas por el sistema nervioso del propio estudiante.'
	},
	{
		id: 'tr_fn2',
		text: 'Tras resolver una sesión intensa de problemas lógicos abstractos, experimentas una sensación de pesadez y fatiga visual en tus ojos.',
		gfr: 'retroalimentacion',
		rii: 'intrinseco',
		explanation: 'Es Retroalimentación porque la sensación de pesadez y fatiga en los ojos representa una señal física directa generada por el esfuerzo del cuerpo. Es Intrínseco al ser la respuesta orgánica y muscular del cuerpo ante el esfuerzo de concentración.'
	},
	{
		id: 'tr_fn3',
		text: 'Mientras practicas una melodía compleja en la flauta traversa, notas cómo el flujo de tu respiración se vuelve más profundo y regular en tu diafragma.',
		gfr: 'retroalimentacion',
		rii: 'intrinseco',
		explanation: 'Es Retroalimentación porque el flujo de respiración en el diafragma representa una señal propioceptiva directa enviada por el cuerpo del instrumentista. Es Intrínseco al originarse puramente en la propiocepción y las señales respiratorias de su propio organismo.'
	},

	// 9. Intrínseco - Recompensa
	{
		id: 'tr_rn1',
		text: 'Si logro comprender el origen del universo de manera autónoma para saciar mi curiosidad, entonces siento una inmensa auto-eficacia intelectual.',
		gfr: 'recompensa',
		rii: 'intrinseco',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta neurológica de auto-eficacia al saciar su propia curiosidad científica. Es Intrínseco porque no intervienen calificaciones ni presores, proviniendo de satisfacer su propio impulso científico.'
	},
	{
		id: 'tr_rn2',
		text: 'Si logro silbar una melodía compleja de oído tras practicar a solas en mi habitación, entonces experimento una oleada de gozo y satisfacción al percibir mi destreza.',
		gfr: 'recompensa',
		rii: 'intrinseco',
		explanation: 'Es una Recompensa porque el estudiante experimenta una respuesta emocional y neurológica de gozo y satisfacción. Es Intrínseco al originarse por percibir su propio dominio auditivo y motriz sin premios de terceros.'
	},
	{
		id: 'tr_rn3',
		text: 'Si logro controlar mi respiración diafragmática al tocar la flauta traversa tras practicar voluntariamente, entonces experimento gozo y autocomplacencia por mi destreza motriz.',
		gfr: 'recompensa',
		rii: 'intrinseco',
		explanation: 'Es una Recompensa porque el estudiante experimenta una emoción directa de gozo y autocomplacencia por dominar la técnica de la flauta. Es Intrínseco al surgir directamente de percibir la maestría física de su propio cuerpo.'
	}
];
