export interface InteractivityQuestion {
	id: string;
	title: string;
	scenario: string;
	options: ('Corto' | 'Medio' | 'Largo')[];
	correct: 'Corto' | 'Medio' | 'Largo';
	explanation: string;
}

export const interactivityQuestions: InteractivityQuestion[] = [
	{
		id: 'w3_q1',
		title: 'El Proyecto de Ecología Urbana',
		scenario: 'La profesora Claudia diseña un proyecto de fin de semestre donde los estudiantes deben redactar un reporte de investigación de 15 páginas sobre ecología urbana. Los estudiantes investigan durante 3 semanas, entregan el reporte final en la última sesión y reciben sus notas y comentarios escritos por correo una semana después de cerrar el curso.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Largo',
		explanation: 'Al transcurrir un mes completo entre la asignación de la meta y la recepción de la retroalimentación, la acción del estudiante pierde conexión temporal inmediata con el feedback, dificultando la autorregulación cognitiva activa.'
	},
	{
		id: 'w3_q2',
		title: 'El Compilador Interactivo',
		scenario: 'En la clase de programación del profesor Mateo, los alumnos resuelven un algoritmo en una plataforma interactiva en vivo. A medida que escriben cada línea de código, la interfaz ejecuta pruebas unitarias y resalta en rojo los errores de sintaxis o en verde el éxito del bloque en menos de 2 segundos.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Corto',
		explanation: 'La retroalimentación inmediata (en milisegundos o segundos) permite realizar una autoevaluación cognitiva instantánea y corregir el curso de acción inmediatamente sin consolidar conceptos erróneos.'
	},
	{
		id: 'w3_q3',
		title: 'El Ensayo de Oratoria Grabado',
		scenario: 'Para la clase de debate, el mentor John les pide a los grupos preparar y grabar una propuesta de oratoria de 3 minutos. Los estudiantes ensayan el lunes, graban y suben su propuesta el martes a la plataforma, y el profesor les comparte una rúbrica grabada en audio con puntos específicos de mejora el jueves por la tarde.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Medio',
		explanation: 'Un ciclo de 2 a 3 días es adecuado para tareas de complejidad moderada que requieren un periodo de reflexión y producción, manteniendo el feedback dentro de una ventana de memoria activa útil.'
	},
	{
		id: 'w3_q4',
		title: 'La Bitácora de Lectura Mensual',
		scenario: 'Los estudiantes leen una novela completa durante 4 semanas y van redactando una bitácora analítica acumulativa. Realizan la entrega física el último día del mes, y el docente tarda 8 días hábiles adicionales en calificarla y devolver las bitácoras con anotaciones manuscritas.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Largo',
		explanation: 'Los ciclos largos (de una semana o más) son típicos de evaluaciones acumulativas amplias. Aunque permiten una reflexión global, tienen un impacto menor en el ajuste de conductas de aprendizaje cotidianas.'
	},
	{
		id: 'w3_q5',
		title: 'La Pregunta de Clicker en Vivo',
		scenario: 'Durante la explicación de termodinámica, el profesor lanza una pregunta conceptual desafiante a través de una aplicación de votación móvil. Los estudiantes envían su respuesta en 30 segundos, y el docente proyecta la distribución de votos al instante para aclarar el concepto erróneo de inmediato.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Corto',
		explanation: 'Este es un ciclo de retroalimentación ultracorto. Mantiene el foco en el momento álgido de la explicación y previene que el estudiante continúe la clase con dudas o asunciones incorrectas.'
	},
	{
		id: 'w3_q6',
		title: 'El Reporte de Laboratorio Semanal',
		scenario: 'En el laboratorio de química orgánica, el miércoles se realiza un experimento práctico. Los estudiantes procesan los datos y suben su reporte de 3 páginas el viernes. El lunes por la mañana el docente les comparte la rúbrica evaluada a través del aula virtual.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Medio',
		explanation: 'Un ciclo intermedio (de 2 a 3 días) equilibra la complejidad de redacción y análisis técnico con una entrega de retroalimentación oportuna, antes de que los estudiantes olviden los pormenores de la práctica de laboratorio.'
	},
	{
		id: 'w3_q7',
		title: 'El Ejercicio Adaptativo de Khan Academy',
		scenario: 'Un estudiante practica álgebra resolviendo ecuaciones cuadráticas. Al ingresar su respuesta numérica en el casillero y presionar "Comprobar", el sistema le muestra un check verde de acierto o, si falla, le ofrece un botón para ver el desglose paso a paso del despeje de inmediato.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Corto',
		explanation: 'Las plataformas adaptativas digitales destacan por crear bucles de interactividad cortos e hiper-enfocados, permitiendo el auto-aprendizaje a través del ensayo y error guiado.'
	},
	{
		id: 'w3_q8',
		title: 'La Maqueta de Diseño Espacial',
		scenario: 'Los alumnos de arquitectura trabajan en el modelado tridimensional de un centro comunitario a lo largo de un bimestre de 8 semanas. Hacen la entrega final del modelo físico y la sustentación el último día, y el acta de calificaciones y veredicto del jurado se publica 7 días después.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Largo',
		explanation: 'Los proyectos de largo aliento implican ciclos de retroalimentación muy extendidos en su fase final, por lo que es vital complementarlos con hitos e interactividades más cortas durante el proceso.'
	},
	{
		id: 'w3_q9',
		title: 'El Tutor por Voz de Duolingo',
		scenario: 'En la sección de conversación en inglés, el estudiante activa el micrófono para repetir una frase de vocabulario complejo. La aplicación analiza las ondas de voz en 1 segundo y resalta en rojo las sílabas con pronunciación incorrecta para que las repita.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Corto',
		explanation: 'La retroalimentación en tiempo real en tareas motoras o lingüísticas permite al estudiante sintonizar de inmediato sus acciones musculares o conceptuales, optimizando el aprendizaje de precisión.'
	},
	{
		id: 'w3_q10',
		title: 'La Simulación de Crisis de Negocios',
		scenario: 'Un grupo de estudiantes de administración participa en un simulador virtual. Toman decisiones el lunes por la tarde, el simulador procesa las variables el martes en la noche, y el miércoles por la mañana reciben el reporte detallado de ventas y cuota de mercado para planear la siguiente ronda.',
		options: ['Corto', 'Medio', 'Largo'],
		correct: 'Medio',
		explanation: 'Los ciclos de procesamiento por lotes (batch processing) de 1 a 2 días son típicos de simulaciones realistas de negocios o geopolítica, dando tiempo para el análisis estratégico del equipo.'
	}
];
