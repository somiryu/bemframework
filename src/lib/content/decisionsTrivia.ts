export interface DecisionsTriviaQuestion {
	id: string;
	block: 'A' | 'B' | 'C';
	blockName: string;
	scenario: string;
	question: string;
	options: string[];
	correct: 'A' | 'B' | 'C' | 'D';
	correctText: string;
	explanation: string;
}

export const decisionsTriviaQuestions: DecisionsTriviaQuestion[] = [
	// BLOQUE A: Economía Conductual (Sesgos y Heurísticas)
	{
		id: 'w6_q1',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'Un estudiante lee en un foro estudiantil que el último examen de matemáticas fue "imposible de pasar". Aunque ha estudiado y tiene buenas notas, asume de inmediato que reprobará y entra en pánico.',
		question: '¿Qué heurística o sesgo cognitivo está distorsionando su estimación de riesgo?',
		options: [
			'Falacia del Costo Hundido',
			'Heurística de Disponibilidad',
			'Sesgo del Presente',
			'Efecto de Dotación'
		],
		correct: 'B',
		correctText: 'Heurística de Disponibilidad',
		explanation: 'La heurística de disponibilidad hace que la mente estime la probabilidad de un suceso según la facilidad con la que recupera de la memoria un ejemplo vívido o reciente (el comentario alarmante del foro), ignorando su propio historial de notas y preparación real.'
	},
	{
		id: 'w6_q2',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'Un docente diseña tres opciones de material de estudio para un tema: Opción A (leer 10 páginas), Opción B (leer 10 páginas y escribir un ensayo de 5 páginas) y Opción C (leer un resumen ejecutivo de 8 páginas). La presencia de la Opción B hace que los alumnos consideren la Opción A como sumamente razonable y atractiva.',
		question: '¿Qué rol juega la Opción B en esta arquitectura de decisión?',
		options: [
			'Opción Dominante',
			'Señuelo (Decoy)',
			'Elección Ciega',
			'Agencia Estética'
		],
		correct: 'B',
		correctText: 'Señuelo (Decoy)',
		explanation: 'El "señuelo" (Opción B) es una alternativa deliberadamente asimétrica y de mayor costo que sirve únicamente para desviar la comparación y hacer que la opción preferida por el diseñador (Opción A) parezca sumamente valiosa y de bajo costo en comparación.'
	},
	{
		id: 'w6_q3',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'Si cambias las reglas de una actividad de modo que el estudiante inicie con 50 puntos y se le descuenten puntos por fallas, en lugar de iniciar en 0 e ir acumulándolos por aciertos...',
		question: '¿Qué principio de la economía conductual estás explotando para modificar la urgencia de entrega?',
		options: [
			'Descuento Hiperbólico',
			'Aversión a la Pérdida (Loss Aversion)',
			'Ilusión de Control',
			'Falacia de la Conjunción'
		],
		correct: 'B',
		correctText: 'Aversión a la Pérdida (Loss Aversion)',
		explanation: 'La aversión a la pérdida describe la tendencia psicológica a sentir el dolor de perder algo (puntos ya asignados) aproximadamente el doble de fuerte que el placer de ganar ese mismo recurso desde cero.'
	},
	{
		id: 'w6_q4',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'Un estudiante ha invertido 20 horas en escribir un proyecto escolar utilizando un enfoque metodológico incorrecto. Aunque el docente le demuestra que es mejor empezar de cero con otra estructura para asegurar la nota, el alumno insiste en continuar con su escrito inicial argumentando: "Ya le he dedicado demasiado tiempo a esto para botarlo".',
		question: '¿Qué sesgo cognitivo presenta el alumno al negarse a reiniciar su proyecto?',
		options: [
			'Falacia del Costo Hundido',
			'Sesgo de Representatividad',
			'Sesgo del Status Quo',
			'Error de Atribución Fundamental'
		],
		correct: 'A',
		correctText: 'Falacia del Costo Hundido',
		explanation: 'La falacia del costo hundido ocurre cuando insistimos en continuar una inversión o conducta debido a los recursos ya gastados (tiempo, esfuerzo, dinero), a pesar de que la evidencia demuestra que el resultado futuro será negativo si no cambiamos de rumbo.'
	},
	{
		id: 'w6_q5',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'Un estudiante prefiere jugar videojuegos hoy (recompensa inmediata) en lugar de estudiar para el examen de la próxima semana (recompensa diferida mayor), aun sabiendo que esto afectará gravemente su rendimiento final.',
		question: '¿Qué sesgo explica esta inconsistencia en la valoración del tiempo?',
		options: [
			'Sesgo de Anclaje',
			'Sesgo del Presente (Present Bias)',
			'Efecto de Dotación',
			'Ilusión de Control'
		],
		correct: 'B',
		correctText: 'Sesgo del Presente (Present Bias)',
		explanation: 'El sesgo del presente describe la tendencia de los humanos a sobrevalorar drásticamente las recompensas inmediatas frente a las futuras, mostrando un descuento hiperbólico de la utilidad del tiempo a medida que la recompensa se aleja en el calendario.'
	},
	{
		id: 'w6_q6',
		block: 'A',
		blockName: 'Economía Conductual',
		scenario: 'En un examen digital, permites que los estudiantes elijan manualmente de una pila virtual qué sobre de preguntas abrir, en lugar de que el sistema las asigne al azar. Los estudiantes reportan sentirse más seguros y confiados, a pesar de que todas las preguntas tienen la misma dificultad matemática.',
		question: '¿Qué sesgo explica la mayor confianza de los estudiantes al elegir manualmente su sobre de preguntas?',
		options: [
			'Efecto Enmarque',
			'Ilusión de Control',
			'Sesgo de Confirmación',
			'Sesgo de Status Quo'
		],
		correct: 'B',
		correctText: 'Ilusión de Control',
		explanation: 'La ilusión de control es la tendencia humana a creer que sus acciones personales (como elegir físicamente una tarjeta o lanzar un dado personal) influyen o determinan los resultados de eventos puramente azarosos o con probabilidades fijas preestablecidas.'
	},

	// BLOQUE B: Diseño de Decisiones en Juegos (Mecánicas y Elecciones Significativas)
	{
		id: 'w6_q7',
		block: 'B',
		blockName: 'Diseño de Decisiones en Juegos',
		scenario: 'En un juego serio sobre toma de decisiones de negocios, se le presenta al estudiante un dilema: "Elige entre la Estrategia Alfa o la Estrategia Beta", sin proporcionarle ningún reporte financiero previo, historial o pista contextual. Al seleccionar Alfa, el simulador le arroja un mensaje de quiebra permanente.',
		question: '¿Qué tipo de elección es esta que conduce a una quiebra inesperada sin pistas previas?',
		options: [
			'Elección Significativa',
			'Elección Ciega',
			'Elección Falsa',
			'Estrategia Dominante'
		],
		correct: 'B',
		correctText: 'Elección Ciega',
		explanation: 'Una elección es ciega cuando el usuario se ve obligado a elegir entre alternativas sin información previa para ponderar sus riesgos y consecuencias. Si además genera una penalización severa y permanente (quiebra), se considera un grave fallo de diseño.'
	},
	{
		id: 'w6_q8',
		block: 'B',
		blockName: 'Diseño de Decisiones en Juegos',
		scenario: 'Estás analizando el simulador educativo del curso y notas que todos los estudiantes eligen exactamente la misma ruta de especialización final porque es la única que otorga un multiplicador de puntos del 200% sin tener penalizaciones asociadas.',
		question: '¿Cómo se define técnicamente esta ruta que todos los estudiantes terminan eligiendo?',
		options: [
			'Agencia Cosmética',
			'Estrategia Dominante',
			'Elección con Daño Colateral',
			'Elección Significativa'
		],
		correct: 'B',
		correctText: 'Estrategia Dominante',
		explanation: 'Una estrategia dominante es una alternativa dentro de un sistema que resulta superior a todas las demás en cualquier escenario, anulando el dilema de elegir y destruyendo el interés estratégico de la toma de decisiones.'
	},
	{
		id: 'w6_q9',
		block: 'B',
		blockName: 'Diseño de Decisiones en Juegos',
		scenario: 'Un estudiante debe decidir entre comprar un escudo pesado (+50 de defensa, -20% de velocidad) o una capa ligera (+10 de defensa, +30% de velocidad) para su siguiente combate en un juego serio de rol.',
		question: '¿Qué tipo de elección se presenta al decidir entre el escudo pesado o la capa ligera con sus respectivos balances?',
		options: [
			'Elección Ciega',
			'Elección Significativa',
			'Elección Falsa',
			'Elección Cosmética'
		],
		correct: 'B',
		correctText: 'Elección Significativa',
		explanation: 'Es una elección significativa porque cuenta con información dable (los atributos de defensa/velocidad), tiene un impacto claro en el combate posterior y presenta un trade-off o costo de oportunidad equilibrado (ganar defensa implica sacrificar velocidad).'
	},
	{
		id: 'w6_q10',
		block: 'B',
		blockName: 'Diseño de Decisiones en Juegos',
		scenario: 'Si permites que tus estudiantes seleccionen el color de fondo y el escudo heráldico de su grupo de trabajo en la plataforma digital, sabiendo que esto no modifica las reglas de entrega, la dificultad ni las calificaciones del proyecto final...',
		question: '¿Qué tipo de elección representa la personalización del color de fondo y el escudo del grupo?',
		options: [
			'Elección Significativa',
			'Elección Decorativa (Agencia Cosmética)',
			'Elección Dominante',
			'Elección Falsa'
		],
		correct: 'B',
		correctText: 'Elección Decorativa (Agencia Cosmética)',
		explanation: 'Las elecciones decorativas o cosméticas permiten al usuario expresar su identidad y autoexpresión sin alterar el estado operativo, las mecánicas ni las reglas matemáticas del sistema. Son útiles para el driver de identidad pero no afectan la dificultad.'
	},
	{
		id: 'w6_q11',
		block: 'B',
		blockName: 'Diseño de Decisiones en Juegos',
		scenario: 'En un diálogo interactivo de historia, se le pregunta al jugador: "¿Quieres investigar las ruinas o cruzar el puente?". Si responde "cruzar el puente", el acompañante le dice: "¡Es muy peligroso! Vayamos a las ruinas". En ambos casos, el sistema los carga en las ruinas.',
		question: '¿Cómo se clasifica la dinámica que fuerza al jugador a ir a las ruinas sin importar qué elija?',
		options: [
			'Elección Ciega',
			'Elección Falsa (Ilusión de Agencia)',
			'Estrategia Dominante',
			'Elección Significativa'
		],
		correct: 'B',
		correctText: 'Elección Falsa (Ilusión de Agencia)',
		explanation: 'Las elecciones falsas o ilusiones de agencia ocurren cuando el sistema ofrece múltiples alternativas en pantalla pero las conduce de forma invisible e inevitable al mismo resultado final. Sirven para dar tono narrativo o de rol sin multiplicar el código.'
	},

	// BLOQUE C: Autonomía en Educación (Aplicación en el Aula)
	{
		id: 'w6_q12',
		block: 'C',
		blockName: 'Autonomía en Educación',
		scenario: 'Un docente decide dar total autonomía en su curso de ciencias y les ofrece una lista de 60 temas posibles para que cada estudiante elija uno de forma independiente para su exposición. Al final, nota retrasos masivos en la elección, alta ansiedad y quejas constantes.',
		question: '¿Qué fenómeno del diseño de decisiones explica esta parálisis de los estudiantes ante 60 temas?',
		options: [
			'Falacia del Costo Hundido',
			'Paradoja de la Elección (Sobrecarga Cognitiva)',
			'Sesgo del Status Quo',
			'Aversión a la Pérdida'
		],
		correct: 'B',
		correctText: 'Paradoja de la Elección (Sobrecarga Cognitiva)',
		explanation: 'La paradoja de la elección o sobrecarga cognitiva demuestra que, aunque valoramos la libertad, un número excesivo de opciones satura nuestros recursos de procesamiento cognitivo, generando parálisis por análisis, fatiga de decisión y frustración ante el costo de oportunidad.'
	},
	{
		id: 'w6_q13',
		block: 'C',
		blockName: 'Autonomía en Educación',
		scenario: 'Para incentivar el compromiso con las lecturas, un docente evalúa alternativas de autonomía estructurada en el aula.',
		question: '¿Cuál de las siguientes estrategias docentes representa la mejor implementación de "autonomía estructurada"?',
		options: [
			'Forzar una única lectura obligatoria obligando a todos a resumirla en PDF.',
			'Dar libertad de leer cualquier libro en el mundo que trate de historia y calificar con rúbricas abiertas.',
			'Seleccionar 3 lecturas académicas equivalentes y permitir al estudiante elegir cuál de las 3 leer y en qué formato presentar su reporte.',
			'Ofrecer lecturas sorpresa aleatorias cada semana que se eligen tirando un dado en clase.'
		],
		correct: 'C',
		correctText: 'Seleccionar 3 lecturas académicas equivalentes y permitir al estudiante elegir cuál de las 3 leer y en qué formato presentar su reporte.',
		explanation: 'La autonomía estructurada limita el número de opciones (reduciendo la sobrecarga cognitiva) pero mantiene abiertas alternativas con significado y equivalentes pedagógicamente, otorgando una sensación de agencia y control sin desestructurar la clase.'
	},
	{
		id: 'w6_q14',
		block: 'C',
		blockName: 'Autonomía en Educación',
		scenario: 'El docente busca definir un enfoque de evaluación formativa que permita al alumno aprender a través del fallo sin frustración.',
		question: '¿Qué enfoque de evaluación modela el fallo del estudiante de manera constructiva y promueve la Maestría?',
		options: [
			'Otorgar una única calificación final al entregar el proyecto final de semestre, sin posibilidad de corrección.',
			'Evaluar los borradores semanales como entregas formativas con feedback que el estudiante puede corregir y volver a entregar para mejorar su nota acumulada.',
			'Aplicar penalizaciones de puntos exponenciales a todo estudiante que entregue un borrador incomple.',
			'Aprobar a todos los estudiantes de forma automática sin importar si el proyecto tiene fallos.'
		],
		correct: 'B',
		correctText: 'Evaluar los borradores semanales como entregas formativas con feedback que el estudiante puede corregir y volver a entregar para mejorar su nota acumulada.',
		explanation: 'Modelar el fallo como parte del ciclo interactivo (Smart Failure) requiere que los errores sean reversibles y tengan feedback claro. Permitir la iteración y entrega de borradores reduce la ansiedad y el miedo al error, incentivando la búsqueda de la maestría.'
	},
	{
		id: 'w6_q15',
		block: 'C',
		blockName: 'Autonomía en Educación',
		scenario: 'Permites que tus estudiantes fusionen la entrega de sus tareas de Geografía e Historia en un único proyecto integrado de "Infografía Geohistórica", el cual evalúa los objetivos de ambas materias de forma simultánea y otorga un bono extra de puntos de progreso.',
		question: '¿Qué principio de diseño estás aplicando al unificar y bonificar las tareas integradas?',
		options: [
			'Recompensas Aleatorias',
			'Sinergia / Combos',
			'Decoy Effect',
			'Aversión a la Pérdida'
		],
		correct: 'B',
		correctText: 'Sinergia / Combos',
		explanation: 'Diseñar sinergias o "combos" de entregas permite a los alumnos planificar y conectar conocimientos de forma estratégica, optimizando sus esfuerzos al unificar tareas aisladas en entregables integrales más significativos y de alto valor percibido.'
	}
];
