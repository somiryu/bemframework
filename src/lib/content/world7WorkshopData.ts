export type TriggerType7 = 'accion' | 'meta' | 'farmeable';
export type EvaluationSystem7 = 'criterios_dinamicos' | 'rubrica_multicanal' | 'calificacion_directa' | 'efecto_sistemico' | 'algoritmo_matematico' | 'dashboard';

export interface Criterion7 {
	id: string;
	label: string;
	question: string;
	minLabel: string;
	maxLabel: string;
}

export const world7Criteria: Criterion7[] = [
	{
		id: 'evaluacion_general',
		label: 'Evaluación general',
		question: '¿Qué tan buena es esta idea como sistema de evaluación?',
		minLabel: 'Muy deficiente',
		maxLabel: 'Excelente'
	},
	{
		id: 'multicanalidad',
		label: 'Multicanalidad',
		question: '¿Mezcla conceptos en un solo canal o usa canales separados?',
		minLabel: 'Todo en 1 canal',
		maxLabel: 'Canales independientes'
	},
	{
		id: 'objetividad',
		label: 'Objetividad',
		question: '¿Se presta a interpretación subjetiva o es matemática y estable?',
		minLabel: 'Muy subjetivo',
		maxLabel: 'Matemático y estable'
	},
	{
		id: 'motivacion',
		label: 'Motivación',
		question: '¿Motiva a aprender o castiga el error?',
		minLabel: 'Desmotiva',
		maxLabel: 'Motiva profundamente'
	},
	{
		id: 'trampeable',
		label: 'Trampeable',
		question: '¿Qué tan fácil es hacerle trampa al sistema?',
		minLabel: 'Muy trampeable',
		maxLabel: 'Muy robusto'
	}
];

export interface WorkshopSlide7 {
	id: number;
	part: 1 | 2 | 3;
	partName: string;
	title: string;
	scenario: string;
	triggerType: TriggerType7;
	evaluationSystem: EvaluationSystem7;
	giochiFeedback: string;
}

export const world7PartNames: Record<number, string> = {
	1: 'Disparadores por Acción',
	2: 'Disparadores por Meta',
	3: 'Disparadores Farmeables'
};

export const world7WorkshopSlides: WorkshopSlide7[] = [
	// ─── PARTE 1: DISPARADORES POR ACCIÓN (9 slides) ───
	{
		id: 1,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A1: Dibujo de la Célula',
		scenario: 'Al entregar un dibujo a mano de la célula, el docente observa la ilustración y asigna directamente una nota del 1 al 10 basándose en su impresión general del esfuerzo y la precisión.',
		triggerType: 'accion',
		evaluationSystem: 'criterios_dinamicos',
		giochiFeedback: 'La falta de una rúbrica explícita genera un alto riesgo de sesgo cognitivo ("jugar al jurado"). Al depender del juicio dinámico y subjetivo del evaluador, se reduce la predictibilidad para el estudiante, lo cual socava su autonomía y confianza en la justicia del sistema.'
	},
	{
		id: 2,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A2: Rúbrica de Foro Semanal',
		scenario: 'Cada vez que un estudiante publica un mensaje en el foro de discusión semanal, el sistema lo evalúa automáticamente contra una rúbrica de 4 criterios: profundidad analítica (0-4), referencia a lecturas (0-2), claridad argumentativa (0-2) y respuesta a compañeros (0-2). La nota máxima por publicación es 10. El estudiante puede ver su puntuación desglosada inmediatamente después de publicar.',
		triggerType: 'accion',
		evaluationSystem: 'rubrica_multicanal',
		giochiFeedback: 'La rúbrica multicanal ofrece claridad y transparencia total: el estudiante sabe exactamente qué se evalúa. El disparador por acción (publicar) es inmediato y predecible. Sin embargo, la rigidez de la rúbrica puede no capturar contribuciones valiosas pero atípicas, y algunos estudiantes podrían optimizar sus publicaciones solo para cumplir la rúbrica en lugar de participar genuinamente.'
	},
	{
		id: 3,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A3: Botón de Evaluación Inmediata',
		scenario: 'Al finalizar cada ejercicio práctico de matemáticas, aparece un botón verde "Evaluar mi respuesta". Al hacer clic, el sistema compara la respuesta del estudiante con la solución oficial en una base de datos y asigna 10 puntos si es exacta, 7 si el planteamiento es correcto pero el resultado numérico es incorrecto, y 0 en cualquier otro caso. El resultado se muestra como una nota parcial que se promedia al final del módulo.',
		triggerType: 'accion',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'La calificación directa es simple y transparente, pero tiene limitaciones: no tolera respuestas parcialmente correctas con métodos alternativos válidos. El disparador (hacer clic en el botón) es voluntario, lo que permite al estudiante elegir cuándo ser evaluado. Esto reduce la ansiedad pero puede llevar a que algunos estudiantes eviten la autoevaluación.'
	},
	{
		id: 4,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A4: Nota Grupal en Vivo',
		scenario: 'En un proyecto colaborativo de ciencias, cada vez que un miembro del equipo sube un avance al repositorio compartido (documento, datos, código), el sistema recalcula la nota de todo el grupo en tiempo real. La fórmula combina: 40% cantidad de contribuciones, 30% calidad (votación entre pares) y 30% cumplimiento de hitos. Todos los integrantes ven fluctuar su nota individual con cada acción de cualquier compañero.',
		triggerType: 'accion',
		evaluationSystem: 'dashboard',
		giochiFeedback: 'El dashboard de información en tiempo real genera un fuerte impacto: ver fluctuar la nota constantemente provoca que los estudiantes monitoricen el sistema de manera obsesiva. Esta retroalimentación visual continua promueve la autorregulación pero también eleva la ansiedad y la presión de pares. El peligro es que los estudiantes prioricen realizar acciones rápidas de bajo valor solo para ver subir la barra en el panel de control.'
	},
	{
		id: 5,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A5: Fórmula de Desempeño Compuesto',
		scenario: 'Cada vez que un estudiante completa un módulo de aprendizaje, el sistema calcula su puntuación con la fórmula: P = (A × 0.5) + (V × 0.2) + (T × 0.3), donde A = porcentaje de aciertos en el módulo, V = velocidad relativa (comparada con el promedio del curso) y T = tiempo total de lectura en minutos (con tope de 60). El resultado se muestra como un número entre 0 y 100.',
		triggerType: 'accion',
		evaluationSystem: 'algoritmo_matematico',
		giochiFeedback: 'El algoritmo matemático es explícito y medible, lo que da alta objetividad. Sin embargo, ponderar la velocidad puede incentivar respuestas apresuradas por encima del aprendizaje profundo. La transparencia es alta si la fórmula se publica, pero la inclusión del tiempo de lectura favorece a quienes pueden dedicar más horas, no necesariamente a quienes aprenden más.'
	},
	{
		id: 6,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A6: Dashboard de Nota Estimada',
		scenario: 'Cada vez que el estudiante completa una actividad, un dashboard en su bitácora actualiza una barra de "Nota Estimada Final" que proyecta su calificación basándose en el promedio ponderado de todas las actividades realizadas hasta el momento. La barra cambia de color (rojo < 3.0, amarillo 3.0-4.0, verde > 4.0) y muestra una flecha de tendencia (sube/baja/estable) comparada con la semana anterior.',
		triggerType: 'accion',
		evaluationSystem: 'dashboard',
		giochiFeedback: 'El dashboard ofrece retroalimentación visual inmediata y motiva la autorregulación. El disparador por acción (completar actividad) es claro. Sin embargo, la proyección puede generar ansiedad si la nota estimada baja, y la flecha de tendencia podría incentivar a los estudiantes a hacer actividades fáciles solo para "subir la flecha" en lugar de asumir desafíos significativos.'
	},
	{
		id: 7,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A7: Insignia de Primera Respuesta',
		scenario: 'La primera vez que un estudiante responde correctamente un ejercicio en cada módulo, el sistema le otorga una insignia virtual y 5 BEM Coins. La insignia aparece con una animación y un mensaje de "¡Primer Acierto!". Las respuestas posteriores en el mismo módulo no generan insignia ni monedas adicionales.',
		triggerType: 'accion',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'Este sistema de calificación directa con recompensa única es simple pero tiene un claro incentivo perverso: el estudiante podría responder solo el primer ejercicio de cada módulo y luego abandonar, maximizando monedas con mínimo esfuerzo. La motivación inicial es alta, pero desaparece rápidamente dentro del mismo módulo.'
	},
	{
		id: 8,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A8: Sustentación de Exposición',
		scenario: 'Al finalizar la exposición de ciencias frente al grupo, el docente asigna una calificación de 1 a 10 basada en la oratoria y el dominio de la presentación.',
		triggerType: 'accion',
		evaluationSystem: 'criterios_dinamicos',
		giochiFeedback: 'Evaluar habilidades complejas como la oratoria mediante criterios dinámicos subjetivos expone la nota al sesgo del evaluador. Los estudiantes no tienen pautas para mejorar, lo que reduce la transparencia y genera desconfianza.'
	},
	{
		id: 9,
		part: 1,
		partName: 'Disparadores por Acción',
		title: 'Caso A9: Puntuación Compuesta por Velocidad y Precisión',
		scenario: 'Al resolver un conjunto de 10 problemas de álgebra, el sistema calcula: P = (precisión × 70) + (velocidad × 30) - penalización por pistas usadas, donde precisión = aciertos/10 × 100, velocidad = (tiempo base de 600s / tiempo real del estudiante) × 100 con tope en 1.0, y cada pista resta 5 puntos. El resultado es un número entre 0 y 100.',
		triggerType: 'accion',
		evaluationSystem: 'algoritmo_matematico',
		giochiFeedback: 'El algoritmo es completamente transparente y la fórmula es clara. Sin embargo, la velocidad tiene un peso significativo (30%) que puede generar ansiedad y favorecer a estudiantes que trabajan rápido pero no necesariamente mejor. La penalización por pistas desincentiva su uso, contradiciendo el propósito pedagógico de las pistas como herramienta de aprendizaje.'
	},
	// ─── PARTE 2: DISPARADORES POR META (8 slides) ───
	{
		id: 10,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M1: Logro por Maestría de Módulo',
		scenario: 'Cuando un estudiante alcanza al menos el 90% de aciertos en todas las evaluaciones de un módulo completo, el sistema desbloquea el "Logro de Maestría" que otorga 30 BEM Coins, una medalla especial en la bitácora y acceso a contenido secreto de profundización. El progreso hacia la maestría se muestra como un anillo de completación que se llena proporcionalmente al avance.',
		triggerType: 'meta',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'Este sistema de calificación directa premia el logro de metas fijas y estables (medallas, coins, contenido) al alcanzar el 90%. El disparador por meta es claro en el módulo. Sin embargo, el umbral fijo del 90% puede ser arbitrario y desmotivar a estudiantes que llegan al 89%: al ser directo y de todo o nada, no hay reconocimiento al progreso parcial.'
	},
	{
		id: 11,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M2: Desbloqueo Grupal por Puntos Colectivos',
		scenario: 'Toda la clase comparte una barra de progreso llamada "Termómetro del Conocimiento". Cuando la suma de puntos de todos los estudiantes alcanza hitos predefinidos (1000, 2500, 5000 puntos colectivos), se desbloquean recompensas para toda la clase: un video especial del mentor, un día sin tarea, o una excursión virtual. Cada acción individual de cualquier estudiante alimenta la barra colectiva.',
		triggerType: 'meta',
		evaluationSystem: 'efecto_sistemico',
		giochiFeedback: 'El efecto sistémico aquí es positivo: las acciones de todos benefician a todos. El disparador por meta colectiva fomenta la cooperación y la responsabilidad compartida. Sin embargo, los estudiantes más activos pueden resentir a los que menos contribuyen ("free-riders"), y los estudiantes con bajo rendimiento pueden sentir que no contribuyen al progreso grupal.'
	},
	{
		id: 12,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M3: Tablero Predictivo de Metas',
		scenario: 'Cada estudiante tiene un dashboard que muestra: "Meta del Módulo: 4.0. Tu progreso actual: 3.2. Proyección: Si mantienes tu ritmo actual, alcanzarás 3.8. Necesitas 2 actividades adicionales con nota ≥ 4.0 para llegar a 4.0." Los datos se actualizan cada vez que se registra una nueva calificación, y el sistema sugiere actividades específicas para cerrar la brecha.',
		triggerType: 'meta',
		evaluationSystem: 'dashboard',
		giochiFeedback: 'El dashboard predictivo ofrece claridad total sobre el estado actual y el camino hacia la meta. El disparador por meta es explícito y la transparencia es máxima. El sistema no solo informa sino que recomienda acciones concretas. El riesgo es que los estudiantes se obsesionen con la proyección numérica y pierdan de vista el aprendizaje genuino.'
	},
	{
		id: 13,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M4: XP Fijo por Hito Semanal',
		scenario: 'Cada semana, el sistema define 3 hitos: (1) completar la lectura obligatoria, (2) participar en el foro al menos 2 veces, (3) entregar el ejercicio práctico. Completar cada hito otorga 100 XP fijos. Completar los 3 hitos de la semana otorga un bonus de +100 XP. El XP acumulado determina el nivel del estudiante en el sistema (rango Novato a Maestro). No hay XP parcial ni por calidad.',
		triggerType: 'meta',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'La calificación directa por hitos es simple y predecible. El disparador por meta es claro: completar los 3 hitos. El bonus semanal incentiva la constancia. Sin embargo, no hay diferenciación por calidad: un comentario profundo en el foro vale lo mismo que uno superficial de una línea. Esto puede llevar a cumplir los mínimos sin excelencia.'
	},
	{
		id: 14,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M5: Calificación de Trabajo en Equipo',
		scenario: 'Si todos los miembros del equipo obtienen más de 8 puntos en el quiz individual, el docente evalúa la calidad de su colaboración grupal y asigna una bonificación de 1 a 5 puntos a cada miembro.',
		triggerType: 'meta',
		evaluationSystem: 'criterios_dinamicos',
		giochiFeedback: 'Un disparador de Meta promueve la presión de pares constructiva. Sin embargo, acoplarlo a una recompensa de criterios subjetivos del docente puede sembrar tensiones y quejas de injusticia lúdica entre equipos.'
	},
	{
		id: 15,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M6: Fórmula Cuadrática de Rendimiento',
		scenario: 'Al completar un proyecto final, la nota se calcula con: N = (A² / T) × (1 + D/10), donde A = aciertos (0-100), T = tiempo en horas (mínimo 1), y D = dificultad autoevaluada por el estudiante (1-10). La fórmula favorece exponencialmente la precisión sobre la velocidad, y la autoevaluación de dificultad sirve como multiplicador.',
		triggerType: 'meta',
		evaluationSystem: 'algoritmo_matematico',
		giochiFeedback: 'El algoritmo matemático usa A², lo que premia fuertemente la precisión alta. La autoevaluación de dificultad como multiplicador es innovadora pero introduce un incentivo perverso: los estudiantes podrían inflar su autoevaluación de dificultad para subir la nota. La transparencia es alta si la fórmula se publica, pero la complejidad matemática puede ser intimidante.'
	},
	{
		id: 16,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M7: Evaluación 360° al Completar Proyecto',
		scenario: 'Al finalizar un proyecto grupal, cada estudiante recibe una evaluación compuesta por: autoevaluación (20%), evaluación del docente (40%), evaluación de pares (30%) y evaluación del cliente simulado (10%). Cada evaluador usa una rúbrica de 5 criterios con escala 1-5. El sistema promedia las puntuaciones y muestra un radar de competencias con el desglose completo.',
		triggerType: 'meta',
		evaluationSystem: 'rubrica_multicanal',
		giochiFeedback: 'La rúbrica multicanal con 4 fuentes de evaluación ofrece una visión integral del desempeño. La transparencia es alta porque cada criterio y fuente está desglosada. Sin embargo, la evaluación de pares puede verse afectada por sesgos personales o acuerdos tácitos entre compañeros. El peso del 30% en pares es significativo y requiere entrenamiento previo en evaluación objetiva.'
	},
	{
		id: 17,
		part: 2,
		partName: 'Disparadores por Meta',
		title: 'Caso M8: Bonus Grupal por Logro Universal',
		scenario: 'Cuando todos los miembros del equipo alcanzan su meta individual de nota mínima (definida por cada uno al inicio del proyecto), el equipo entero recibe un bonus de 50 BEM Coins cada uno. Si al menos un miembro no alcanza su meta, nadie recibe el bonus. El progreso de cada miembro es visible para todo el equipo en un panel compartido.',
		triggerType: 'meta',
		evaluationSystem: 'efecto_sistemico',
		giochiFeedback: 'El efecto sistémico es intenso: el bonus individual depende del éxito colectivo. Esto genera presión social para que todos alcancen sus metas, lo que puede ser positivo (apoyo mutuo) o negativo (estrés, culpa, conflictos). La transparencia del panel compartido aumenta la rendición de cuentas pero también puede generar ansiedad en estudiantes con bajo rendimiento.'
	},
	// ─── PARTE 3: DISPARADORES FARMEABLES (8 slides) ───
	{
		id: 18,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F1: Dashboard de Racha de Estudio',
		scenario: 'Cada día que el estudiante inicia sesión y estudia al menos 15 minutos, su racha diaria aumenta en 1. El dashboard muestra un calendario con los días marcados (verde = estudiado, rojo = perdido), el contador de racha actual, y la racha más larga de la clase. Si el estudiante pierde un día, la racha vuelve a 0. No hay recuperación ni congelamiento de racha.',
		triggerType: 'farmeable',
		evaluationSystem: 'dashboard',
		giochiFeedback: 'El dashboard de racha es visualmente motivador y el disparador farmeable es claro (15 min/día). Sin embargo, la pérdida total de la racha al fallar un día es punitiva y puede generar desmotivación: un estudiante con 60 días de racha que pierde un día por enfermedad pierde todo. La ausencia de mecanismos de recuperación (día de gracia, congelador) hace el sistema frágil.'
	},
	{
		id: 19,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F2: Puntos por Minuto de Lectura',
		scenario: 'La plataforma otorga 1 BEM Coin por cada minuto continuo de lectura en los materiales del curso, con un tope de 30 monedas por día. El tiempo se mide mediante scroll tracking y cambios de página. Si el estudiante permanece inactivo más de 2 minutos en la misma página, el contador se detiene hasta que haya interacción.',
		triggerType: 'farmeable',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'La calificación directa por tiempo de lectura es fácil de entender pero tiene un incentivo perverso enorme: los estudiantes pueden dejar la página abierta y hacer scroll mecánico sin realmente leer. El tope diario limita el farming pero no elimina el problema de fondo: se premia la presencia, no la comprensión.'
	},
	{
		id: 20,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F3: Puntos Decrecientes por Repetición',
		scenario: 'Un banco de ejercicios de vocabulario permite repetir los mismos ejercicios indefinidamente. El primer intento de cada ejercicio otorga 10 puntos. El segundo intento del mismo ejercicio otorga 5 puntos. El tercero otorga 2 puntos. Del cuarto en adelante, 0 puntos. El sistema muestra el puntaje restante de cada ejercicio en un semáforo (verde = 10, amarillo = 5, rojo = 0).',
		triggerType: 'farmeable',
		evaluationSystem: 'algoritmo_matematico',
		giochiFeedback: 'El algoritmo de puntos decrecientes es transparente y el semáforo ayuda a la toma de decisiones. Este diseño anti-farming es efectivo porque desincentiva la repetición mecánica y fomenta la variedad de práctica. Sin embargo, si un estudiante necesita repetir un ejercicio para realmente aprenderlo, el sistema lo castiga con puntos decrecientes, priorizando la métrica sobre el aprendizaje.'
	},
	{
		id: 21,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F4: Farming Excesivo Penaliza al Gremio',
		scenario: 'En un sistema de gremios (equipos de 5 estudiantes), si el sistema detecta que un miembro está haciendo clics repetitivos sin aprendizaje real (misma respuesta 10 veces en 1 minuto, patrones de clic sospechosos), el gremio entero pierde 50 puntos de bonus semanal. El miembro infractor recibe una advertencia, y si reincide, es temporalmente bloqueado de actividades farmeables.',
		triggerType: 'farmeable',
		evaluationSystem: 'efecto_sistemico',
		giochiFeedback: 'El efecto sistémico aquí es punitivo: el farming de uno afecta a todos. Esto genera control social entre pares, pero también puede generar conflictos injustos si el sistema detecta falsos positivos. La penalización grupal por acción individual puede sentirse como castigo colectivo injusto. El bloqueo temporal es una medida razonable pero requiere un sistema de detección preciso.'
	},
	{
		id: 22,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F5: Bitácora Semanal con Rúbrica',
		scenario: 'Cada viernes, el sistema revisa automáticamente la bitácora semanal del estudiante y evalúa 3 criterios: cantidad de entradas (0-4), profundidad reflexiva (0-4 medido por análisis de texto), y conexión con conceptos del curso (0-4 medido por coincidencia de keywords). La suma da un puntaje de 0-12 que se convierte a nota sobre 5.0. El estudiante puede ver el desglose y las palabras clave detectadas.',
		triggerType: 'farmeable',
		evaluationSystem: 'rubrica_multicanal',
		giochiFeedback: 'La rúbrica multicanal automatizada ofrece consistencia y la transparencia del desglose ayuda al estudiante a entender su evaluación. Sin embargo, el análisis por keywords puede ser engañoso: un estudiante puede escribir "motivación, autonomía, competencia, relación" sin realmente reflexionar. La cantidad de entradas también puede incentivar escribir entradas superficiales solo para cumplir.'
	},
	{
		id: 23,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F6: Valoración de Aportes en el Foro',
		scenario: 'Cada vez que el estudiante publica un apunte en el foro colaborativo, el docente asigna una valoración entre "Útil", "Muy útil" o "Destacado".',
		triggerType: 'farmeable',
		evaluationSystem: 'criterios_dinamicos',
		giochiFeedback: 'Fomenta la participación proactiva repetible. No obstante, al no contar con criterios de calidad claros y preestablecidos, puede incentivar a los estudiantes a saturar el foro con publicaciones de baja calidad a modo de ensayo y error para medir el criterio dinámico del docente.'
	},
	{
		id: 24,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F7: Ranking Semanal de Actividad',
		scenario: 'Cada lunes, el sistema publica un ranking semanal con la actividad de la semana anterior. Las métricas incluyen: minutos de estudio, ejercicios completados, publicaciones en foro y días con racha activa. El ranking muestra la posición numérica y el cambio respecto a la semana anterior (+5, -2, =). Los 3 primeros reciben una insignia especial que se muestra en su perfil hasta el próximo ranking.',
		triggerType: 'farmeable',
		evaluationSystem: 'dashboard',
		giochiFeedback: 'El dashboard con ranking semanal es transparente y motiva la competencia. Sin embargo, el ranking público puede generar ansiedad en estudiantes de bajo rendimiento, que ven su nombre al final de la lista semana tras semana. Las insignias para los primeros 3 pueden crear una élite fija si los mismos estudiantes ganan siempre, desmotivando al resto.'
	},
	{
		id: 25,
		part: 3,
		partName: 'Disparadores Farmeables',
		title: 'Caso F8: Monedas por Ejercicio con Tope Diario',
		scenario: 'Cada ejercicio completado correctamente otorga 2 BEM Coins, con un máximo de 20 monedas por día. El contador diario se reinicia a la medianoche. El estudiante ve un indicador tipo "barra de energía" que muestra cuántas monedas le quedan por ganar hoy. Los ejercicios realizados después de alcanzar el tope se registran como completados pero no otorgan monedas.',
		triggerType: 'farmeable',
		evaluationSystem: 'calificacion_directa',
		giochiFeedback: 'La calificación directa con tope diario es simple y el indicador de barra de energía es claro. El tope limita el farming excesivo y distribuye la práctica en el tiempo. Sin embargo, el tope fijo de 20 monedas puede ser alcanzado en 10 minutos (10 ejercicios), después de lo cual el estudiante no tiene incentivo económico para seguir practicando. El tope debería calibrarse al volumen real de ejercicios necesarios.'
	}
];

export function getWorld7ProximityScore(studentRating: number, groupAverage: number): number {
	const distance = Math.abs(studentRating - groupAverage);
	return Math.max(0, 20 - Math.round(distance * 10));
}

export function getWorld7SpeedScore(secondsElapsed: number): number {
	if (secondsElapsed <= 10) return 10;
	return Math.max(0, 20 - secondsElapsed);
}

export function getWorld7TotalPV(proximityScore: number, speedScore: number): number {
	return proximityScore + speedScore;
}

export function getWorld7Stars(pv: number, activeCriteriaCount: number): number {
	const maxPoints = (20 * activeCriteriaCount) + 10;
	const step = maxPoints / 4;
	if (pv >= 3 * step) return 3;
	if (pv >= 2 * step) return 2;
	if (pv >= 1 * step) return 1;
	return 0;
}
