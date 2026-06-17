export interface GoalsTriviaQuestion {
	id: string;
	block: 'A' | 'B' | 'C';
	blockName: string;
	scenario: string;
	question: string;
	options: string[];
	correct: string;
	explanation: string;
}

export const goalsTriviaQuestions: GoalsTriviaQuestion[] = [
	// BLOQUE A: Variables de Expectativa
	{
		id: 'w4_q1',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'Un simulador de código muestra al estudiante una barra de energía que crece con cada función que escribe correctamente, y un contador de cuántos retos quedan para desbloquear el siguiente nivel.',
		question: '¿Qué variable de expectativa está diseñando principalmente este sistema?',
		options: [
			'Deseabilidad (atracción hacia la meta)',
			'Progreso Visible (retroalimentación del avance)',
			'Agencia vs Incertidumbre (autonomía del estudiante)',
			'Consistencia de Medición (objetividad de la calificación)'
		],
		correct: 'Progreso Visible (retroalimentación del avance)',
		explanation: 'La barra de energía y el contador de retos son mecanismos de retroalimentación del avance. No generan atracción inicial ni miden objetividad; su función es hacer visible el progreso acumulado paso a paso.'
	},
	{
		id: 'w4_q2',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'Para obtener la certificación de idiomas, el estudiante debe presentar un examen de 3 horas. Si no pasa, debe pagar la tarifa nuevamente y esperar 6 meses para un nuevo intento.',
		question: '¿Qué variable de expectativa está más comprometida en esta meta?',
		options: [
			'Plazo / Término (proximidad del logro)',
			'Esfuerzo / Trabajo Requerido (carga cognitiva)',
			'Probabilidad de Logro / Dificultad (desafío equilibrado)',
			'Consistencia de Medición (objetividad)'
		],
		correct: 'Probabilidad de Logro / Dificultad (desafío equilibrado)',
		explanation: 'El costo de fallar (tiempo + dinero) eleva artificialmente la percepción de dificultad y reduce la probabilidad subjetiva de éxito. El estudiante puede sentir que el riesgo supera sus posibilidades, lo que inhibe la activación.'
	},
	{
		id: 'w4_q3',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'La app de matemáticas propone una trivia de 5 minutos al día. Si el estudiante la completa, mantiene su racha activa y sube en el ranking semanal de su curso.',
		question: '¿Cuál variable de expectativa es el principal motor de enganche de esta meta?',
		options: [
			'Deseabilidad (atracción hacia la meta)',
			'Esfuerzo / Trabajo Requerido (carga cognitiva)',
			'Progreso Visible (retroalimentación del avance)',
			'Plazo / Término (proximidad del logro)'
		],
		correct: 'Plazo / Término (proximidad del logro)',
		explanation: 'El ciclo diario de 5 minutos crea una percepción de cercanía constante al logro. La racha y el ranking semanal refuerzan la sensación de que el objetivo siempre está a punto de alcanzarse, activando el compromiso de forma continua.'
	},
	{
		id: 'w4_q4',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'La sustentación oral del proyecto final se califica con una rúbrica pública que incluye ejemplos con video de cada nivel de logro (Básico, Aceptable, Sobresaliente, Excelente).',
		question: '¿Qué variable de expectativa mejora principalmente esta rúbrica pública?',
		options: [
			'Progreso Visible (retroalimentación del avance)',
			'Consistencia de Medición (objetividad de la calificación)',
			'Agencia vs Incertidumbre (autonomía del estudiante)',
			'Deseabilidad (atracción hacia la meta)'
		],
		correct: 'Consistencia de Medición (objetividad de la calificación)',
		explanation: 'Una rúbrica pública con ejemplos reduce la incertidumbre sobre los criterios de evaluación. El estudiante sabe exactamente qué se espera de él, lo que incrementa la percepción de objetividad y justicia en la medición.'
	},
	{
		id: 'w4_q5',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'El trabajo de grado consiste en recopilar datos de campo en terreno durante un semestre, analizarlos y sustentarlos ante un jurado en una sesión de 2 horas.',
		question: '¿Cuál variable de expectativa pesa más negativamente en esta meta para estudiantes que recién inician?',
		options: [
			'Plazo / Término (proximidad del logro)',
			'Consistencia de Medición (objetividad)',
			'Agencia vs Incertidumbre (autonomía)',
			'Esfuerzo / Trabajo Requerido (carga cognitiva)'
		],
		correct: 'Esfuerzo / Trabajo Requerido (carga cognitiva)',
		explanation: 'El volumen de trabajo acumulado (semestre de campo + análisis + sustentación) genera una carga cognitiva y temporal muy elevada. Esta percepción de esfuerzo desproporcionado es la primera barrera de activación para quien aún no ha comenzado.'
	},
	{
		id: 'w4_q6',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'En el simulador de historia, el estudiante decide libremente en qué orden visita las épocas, qué personajes entrevista y qué eventos investiga, armando su propia línea temporal.',
		question: '¿Qué variable de expectativa se está potenciando con este diseño?',
		options: [
			'Deseabilidad (atracción hacia la meta)',
			'Plazo / Término (proximidad del logro)',
			'Agencia vs Incertidumbre (autonomía del estudiante)',
			'Progreso Visible (retroalimentación del avance)'
		],
		correct: 'Agencia vs Incertidumbre (autonomía del estudiante)',
		explanation: 'La libertad de elección del orden, los personajes y los eventos activa la variable de Agencia. El estudiante siente control sobre su recorrido, lo que reduce la incertidumbre y aumenta la percepción de dominio sobre la actividad.'
	},
	{
		id: 'w4_q7',
		block: 'A',
		blockName: 'Variables de Expectativa',
		scenario: 'Aprender vocabulario médico jugando partidas rápidas de trivia en vivo contra compañeros, con efectos de sonido, animaciones y una tabla de posiciones actualizada al instante.',
		question: '¿Qué variable de expectativa está siendo el gancho principal de esta meta?',
		options: [
			'Progreso Visible (retroalimentación del avance)',
			'Consistencia de Medición (objetividad)',
			'Deseabilidad (atracción y motivación inicial hacia la meta)',
			'Esfuerzo / Trabajo Requerido (carga cognitiva)'
		],
		correct: 'Deseabilidad (atracción y motivación inicial hacia la meta)',
		explanation: 'Los elementos lúdicos (competencia en vivo, efectos, animaciones, tabla de posiciones) generan atracción inmediata hacia la actividad antes de que el estudiante siquiera evalúe si puede lograrlo o cuánto le costará. Eso es Deseabilidad.'
	},

	// BLOQUE B: Tipos de Meta
	{
		id: 'w4_q8',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Eres un cronista del futuro enviado al pasado para documentar cómo las ciudades del siglo XX aprendieron a convivir con la tecnología. Tu misión: reconstruir esa historia antes de que los registros desaparezcan.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Principal de Aproximación',
			'Meta Secundaria (Descubrimiento)',
			'Meta Narrativa',
			'Meta Principal de Evasión'
		],
		correct: 'Meta Narrativa',
		explanation: 'Esta meta no define una acción medible ni un criterio de logro. Establece un rol ficticio (cronista del futuro) y un contexto dramático. Es el marco de significado que da sentido a las actividades reales: una Meta Narrativa.'
	},
	{
		id: 'w4_q9',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Aprobar con mínimo 7/10 el quiz de comprensión lectora de los capítulos 4 al 7 antes del miércoles. El quiz tiene dos intentos disponibles.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Narrativa',
			'Meta Principal de Aproximación',
			'Meta Secundaria (Maestría)',
			'Meta Principal de Evasión'
		],
		correct: 'Meta Principal de Aproximación',
		explanation: 'Esta meta es obligatoria, tiene criterio de logro claro (7/10), plazo definido (miércoles) y busca alcanzar un estado positivo (aprobar). Eso la define como Meta Principal de Aproximación.'
	},
	{
		id: 'w4_q10',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Reiniciar tu ensayo crítico de 5 páginas desde el principio si cometes más de 5 errores ortográficos en el borrador final enviado.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Principal de Aproximación',
			'Meta Narrativa',
			'Meta Secundaria (Eficiencia)',
			'Meta Principal de Evasión'
		],
		correct: 'Meta Principal de Evasión',
		explanation: 'El estudiante no busca alcanzar algo positivo: busca evitar una consecuencia negativa (reiniciar el ensayo). La meta es obligatoria y define una condición de castigo. Es una Meta Principal de Evasión.'
	},
	{
		id: 'w4_q11',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Investigar e incluir en tu antología un cuento de autoría anónima del siglo XIX que ningún otro equipo haya seleccionado. Las mejores investigaciones se expondrán en la galería digital del curso.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Narrativa',
			'Meta Principal de Aproximación',
			'Meta Principal de Evasión',
			'Meta Secundaria (Descubrimiento)'
		],
		correct: 'Meta Secundaria (Descubrimiento)',
		explanation: 'Esta meta no es obligatoria; es un reto adicional voluntario. El incentivo es social (exposición en la galería), no académico. Apela a la curiosidad y la exploración: rasgos del driver Descubrimiento. Es una Meta Secundaria.'
	},
	{
		id: 'w4_q12',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'El salón es una agencia de detectives literarios. Su misión colectiva: resolver qué cuento colombiano del siglo XX fue el más influyente en la narrativa nacional. Cada equipo representa una editorial rival.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Principal de Aproximación',
			'Meta Narrativa',
			'Meta Secundaria (Relacionamiento)',
			'Meta Principal de Evasión'
		],
		correct: 'Meta Narrativa',
		explanation: 'La "misión de la agencia" y los roles de "editoriales rivales" son ficción motivacional. No hay acción medible ni criterio de éxito: hay un contexto épico que da identidad al grupo. Eso es una Meta Narrativa.'
	},
	{
		id: 'w4_q13',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Evitar acumular más de 2 inasistencias sin justificación para mantener el derecho a presentar los parciales del período.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Secundaria (Eficiencia)',
			'Meta Principal de Evasión',
			'Meta Principal de Aproximación',
			'Meta Narrativa'
		],
		correct: 'Meta Principal de Evasión',
		explanation: 'El estudiante no busca conquistar algo: busca no perder un derecho que ya tiene. La estructura es obligatoria (sin ella no puede presentar parciales) y el motor es la prevención de una consecuencia negativa.'
	},
	{
		id: 'w4_q14',
		block: 'B',
		blockName: 'Tipos de Meta',
		scenario: 'Competir voluntariamente para ser el equipo más votado por los compañeros en calidad editorial y obtener el derecho de definir uno de los criterios de la rúbrica final de evaluación.',
		question: '¿Qué tipo de meta es esta?',
		options: [
			'Meta Principal de Aproximación',
			'Meta Narrativa',
			'Meta Secundaria (Empoderamiento)',
			'Meta Principal de Evasión'
		],
		correct: 'Meta Secundaria (Empoderamiento)',
		explanation: 'La competencia es voluntaria y el incentivo es social/de dominio (poder influir en la rúbrica, ser la editorial referente). No hay calificación directa ni obligatoriedad. Apela al Empoderamiento: competencia y dominio social entre pares.'
	},

	// BLOQUE C: Matriz Quiero / Tengo
	{
		id: 'w4_q15',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El docente otorgó una exención del examen final a los alumnos destacados del primer corte. El estudiante ya obtuvo ese beneficio y ahora debe subir un reporte de lectura impecable cada semana para no perderlo.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'No Quiero y Tengo',
			'Quiero y No Tengo',
			'No Quiero y No Tengo',
			'Quiero y Tengo'
		],
		correct: 'Quiero y Tengo',
		explanation: 'El estudiante ya posee el beneficio (exención) y lo valora. La meta consiste en mantener activamente algo que tiene y quiere conservar. Eso es Quiero y Tengo: metas de mantenimiento de estado positivo.'
	},
	{
		id: 'w4_q16',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El alumno llegó tarde a dos sesiones de laboratorio y acumuló una penalización de -0.5 en la nota del período. Para eliminarla, debe entregar dos resúmenes conceptuales adicionales antes del viernes.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'Quiero y Tengo',
			'No Quiero y Tengo',
			'No Quiero y No Tengo',
			'Quiero y No Tengo'
		],
		correct: 'No Quiero y Tengo',
		explanation: 'El estudiante tiene algo que no quiere (la penalización) y la meta es una acción para eliminarlo. Es el cuadrante de eliminación de estado negativo: No Quiero y Tengo.'
	},
	{
		id: 'w4_q17',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El docente otorga el derecho de usar una hoja de apuntes en el parcial final solo a quienes completen los 5 retos opcionales de la plataforma. El estudiante aún no los ha hecho.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'No Quiero y Tengo',
			'Quiero y Tengo',
			'No Quiero y No Tengo',
			'Quiero y No Tengo'
		],
		correct: 'Quiero y No Tengo',
		explanation: 'El beneficio (hoja de apuntes) es deseado por el estudiante pero todavía no lo tiene. La meta define las acciones para adquirirlo. Es el cuadrante de adquisición: Quiero y No Tengo.'
	},
	{
		id: 'w4_q18',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El alumno va al día en el curso y no ha perdido puntos. Sin embargo, si su promedio cae por debajo de 3.0, quedará obligado a asistir a tutorías los sábados. La meta es mantener ese promedio.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'Quiero y Tengo',
			'Quiero y No Tengo',
			'No Quiero y Tengo',
			'No Quiero y No Tengo'
		],
		correct: 'No Quiero y No Tengo',
		explanation: 'El estudiante no tiene aún la consecuencia negativa (tutorías de sábado) y no quiere recibirla. La meta es preventiva: evitar que algo indeseable ocurra en el futuro. Es el cuadrante de prevención: No Quiero y No Tengo.'
	},
	{
		id: 'w4_q19',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El docente diseñó un multiplicador de puntos por racha de participación activa. El alumno lleva 3 semanas consecutivas participando y ya activó el ×2. Debe participar en el foro esta semana para no perderlo.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'Quiero y No Tengo',
			'No Quiero y Tengo',
			'No Quiero y No Tengo',
			'Quiero y Tengo'
		],
		correct: 'Quiero y Tengo',
		explanation: 'El multiplicador es algo que el estudiante tiene y valora. La acción de la semana busca conservarlo. Es una meta de mantenimiento de estado positivo: Quiero y Tengo.'
	},
	{
		id: 'w4_q20',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El alumno recibió una alerta automática por inasistencia que bloquea su acceso a los parciales. Para levantarla, el docente le asignó una investigación complementaria que debe entregar esta semana.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'Quiero y Tengo',
			'No Quiero y No Tengo',
			'Quiero y No Tengo',
			'No Quiero y Tengo'
		],
		correct: 'No Quiero y Tengo',
		explanation: 'El estudiante posee algo no deseado (la alerta de inasistencia) y la meta define la acción para eliminarlo. Es el cuadrante de eliminación de estado negativo: No Quiero y Tengo.'
	},
	{
		id: 'w4_q21',
		block: 'C',
		blockName: 'Matriz Quiero / Tengo',
		scenario: 'El estudiante quiere obtener el rol de líder del proyecto de clase (implica autonomía y puntos adicionales al período). Para ganárselo, debe aprobar el quiz de selección de líderes antes del martes.',
		question: '¿En qué cuadrante de la Matriz Quiero/Tengo está esta meta?',
		options: [
			'No Quiero y Tengo',
			'Quiero y Tengo',
			'No Quiero y No Tengo',
			'Quiero y No Tengo'
		],
		correct: 'Quiero y No Tengo',
		explanation: 'El rol de líder es algo que el estudiante desea pero que todavía no posee. La meta establece la acción para adquirirlo (quiz de selección). Es el cuadrante de adquisición de estado positivo: Quiero y No Tengo.'
	}
];
