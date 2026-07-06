export interface World7TriviaQuestion {
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

export const world7TriviaQuestions: World7TriviaQuestion[] = [
	// ─── BLOQUE A: IDENTIFICAR SISTEMA DE EVALUACIÓN (7 preguntas) ───
	{
		id: 'w7_q1',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'El docente revisa el portafolio del semestre y asigna una nota del 1 al 10 basándose en su impresión general del esfuerzo y la creatividad del estudiante, sin usar ningún instrumento predefinido.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Rúbrica multicanal', 'Criterios dinámicos', 'Algoritmo matemático', 'Dashboard de información'],
		correct: 'B',
		correctText: 'Criterios dinámicos',
		explanation: 'No hay criterios predefinidos ni canales separados. El docente asigna la nota según su juicio subjetivo del momento. Eso es criterios dinámicos.'
	},
	{
		id: 'w7_q2',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Al finalizar la exposición oral, el estudiante recibe una calificación única: Básico si tuvo problemas de comunicación, Intermedio si se expresó con claridad general, o Avanzado si dominó el tema y respondió preguntas del público.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Calificación directa', 'Algoritmo matemático', 'Rúbrica multicanal', 'Efecto sistémico'],
		correct: 'C',
		correctText: 'Rúbrica multicanal',
		explanation: 'Varios criterios (comunicación, claridad, dominio) se combinan en una sola calificación cualitativa de tres niveles. Es una rúbrica multicanal.'
	},
	{
		id: 'w7_q3',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Cada vez que el estudiante completa un módulo, recibe 10 puntos fijos en su bandeja de logros, sin importar cuántos intentos haya necesitado ni el puntaje obtenido en las evaluaciones internas.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Dashboard de información', 'Calificación directa', 'Criterios dinámicos', 'Rúbrica multicanal'],
		correct: 'B',
		correctText: 'Calificación directa',
		explanation: 'La recompensa es fija, estable y directa: 10 puntos por completar. No hay fórmula, subjetividad ni multicanalidad. Es calificación directa.'
	},
	{
		id: 'w7_q4',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Si el estudiante acumula 5 participaciones de calidad en el foro, el sistema le desbloquea el rol de "Moderador de Debate" con permisos especiales para gestionar hilos de discusión.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Calificación directa', 'Algoritmo matemático', 'Dashboard de información', 'Efecto sistémico'],
		correct: 'D',
		correctText: 'Efecto sistémico',
		explanation: 'No se otorgan puntos ni notas. La consecuencia de la acción es un cambio en el sistema: el desbloqueo de un rol con nuevos permisos. Es un efecto sistémico.'
	},
	{
		id: 'w7_q5',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Al responder correctamente una pregunta del quiz, el estudiante gana 10 puntos base. Si lleva 3 aciertos consecutivos, el puntaje se multiplica por 1.5. Si falla, pierde el multiplicador y gana 0 puntos en esa pregunta.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Rúbrica multicanal', 'Criterios dinámicos', 'Algoritmo matemático', 'Calificación directa'],
		correct: 'C',
		correctText: 'Algoritmo matemático',
		explanation: 'Hay una fórmula explícita con multiplicadores, condicionales y reinicio de racha. Es un algoritmo matemático que calcula el puntaje dinámicamente.'
	},
	{
		id: 'w7_q6',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Tras completar la encuesta de clima del aula, el sistema muestra una gráfica de barras con la distribución de respuestas del grupo, sin asignar puntos ni consecuencias a ningún estudiante.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Efecto sistémico', 'Dashboard de información', 'Calificación directa', 'Algoritmo matemático'],
		correct: 'B',
		correctText: 'Dashboard de información',
		explanation: 'El sistema solo entrega datos estadísticos sin calificación ni cambio en el sistema. El estudiante debe interpretar la información. Es un dashboard de información.'
	},
	{
		id: 'w7_q7',
		block: 'A',
		blockName: 'Identificar Sistema de Evaluación',
		scenario: 'Al terminar el proyecto en equipo, el docente asigna una nota de 0 a 100 evaluando: contenido (30 pts), organización (25 pts), creatividad (20 pts), fuentes (15 pts) y presentación (10 pts). La suma da la calificación final.',
		question: '¿Qué sistema de evaluación describe este escenario?',
		options: ['Criterios dinámicos', 'Dashboard de información', 'Rúbrica multicanal', 'Efecto sistémico'],
		correct: 'C',
		correctText: 'Rúbrica multicanal',
		explanation: 'Aunque parece algorítmico, los puntajes por canal son fijos y se suman directamente. Pero al combinar múltiples canales cualitativos en una sola ecuación con pesos arbitrarios, es una rúbrica multicanal que mezcla dimensiones distintas en una misma nota.'
	},

	// ─── BLOQUE B: IDENTIFICAR TIPO DE DISPARADOR (7 preguntas) ───
	{
		id: 'w7_q8',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Cada vez que el estudiante entrega un resumen de lectura, recibe un sello de "Completado" en su bitácora de progreso.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Híbrido'],
		correct: 'A',
		correctText: 'Acción',
		explanation: 'El estudiante tiene control total sobre la acción (entregar el resumen) y la consecuencia es directa e inmediata. Es un disparador de acción.'
	},
	{
		id: 'w7_q9',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Si el promedio de la clase en el examen supera los 4.0, todos los estudiantes reciben un punto adicional en su nota final.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Automático'],
		correct: 'B',
		correctText: 'Meta',
		explanation: 'El resultado no depende del control individual de un estudiante, sino de una condición colectiva que puede o no cumplirse. Es un disparador de meta.'
	},
	{
		id: 'w7_q10',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Cada vez que el estudiante responde correctamente una pregunta en la trivia, acumula 5 puntos. Puede responder tantas veces como quiera.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Continuo'],
		correct: 'C',
		correctText: 'Farmeable',
		explanation: 'La acción es repetible sin límite y cada instancia genera la misma consecuencia. Es farmeable.'
	},
	{
		id: 'w7_q11',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Si el estudiante logra completar 3 niveles del simulador sin cometer errores, desbloquea el modo difícil.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Condicional'],
		correct: 'B',
		correctText: 'Meta',
		explanation: 'La condición ("sin cometer errores") introduce incertidumbre. El estudiante no puede garantizar el resultado aunque intente la acción. Es un disparador de meta.'
	},
	{
		id: 'w7_q12',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Al hacer clic en el botón "Entregar tarea", el sistema registra la hora de envío y confirma la recepción del archivo.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Pasivo'],
		correct: 'A',
		correctText: 'Acción',
		explanation: 'El estudiante controla completamente cuándo hacer clic. La consecuencia es inmediata y predecible. Es un disparador de acción.'
	},
	{
		id: 'w7_q13',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Cada comentario útil que el estudiante publica en el foro le otorga 2 puntos de participación. No hay límite de comentarios por día.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Social'],
		correct: 'C',
		correctText: 'Farmeable',
		explanation: 'La acción se puede repetir sin restricción y cada repetición genera la misma recompensa. Es farmeable.'
	},
	{
		id: 'w7_q14',
		block: 'B',
		blockName: 'Identificar Tipo de Disparador',
		scenario: 'Si el equipo logra que todos sus miembros obtengan más de 8 puntos en el quiz individual, reciben una bonificación grupal.',
		question: '¿Qué tipo de disparador activa esta evaluación?',
		options: ['Acción', 'Meta', 'Farmeable', 'Colaborativo'],
		correct: 'B',
		correctText: 'Meta',
		explanation: 'El resultado depende del desempeño de todos los miembros del equipo, no del control de un solo estudiante. Es un disparador de meta.'
	},

	// ─── BLOQUE C: INCENTIVOS PERVERSOS Y CONCEPTOS (7 preguntas) ───
	{
		id: 'w7_q15',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Un sistema otorga 10 puntos por cada ejercicio completado, sin límite. Los estudiantes descubren que pueden resolver ejercicios de kinder una y otra vez para acumular puntos sin esfuerzo.',
		question: '¿Qué problema de diseño de evaluación ilustra este caso?',
		options: ['Subjetividad del evaluador', 'Incentivo perverso por farming', 'Falta de rúbrica', 'Baja multicanalidad'],
		correct: 'B',
		correctText: 'Incentivo perverso por farming',
		explanation: 'Al no poner límite ni diferenciar por dificultad, el sistema incentiva la repetición de la tarea más fácil en lugar del aprendizaje real. Es un incentivo perverso por farming.'
	},
	{
		id: 'w7_q16',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'El docente asigna la nota del proyecto basándose en "lo que sintió" al leerlo, sin criterios explícitos. Dos estudiantes con trabajos similares reciben notas muy diferentes.',
		question: '¿Qué problema de diseño de evaluación ilustra este caso?',
		options: ['Sesgo del evaluador por criterios dinámicos', 'Exceso de algoritmos', 'Farming de puntos', 'Dashboard innecesario'],
		correct: 'A',
		correctText: 'Sesgo del evaluador por criterios dinámicos',
		explanation: 'Sin rúbrica ni canales definidos, la evaluación depende del estado de ánimo y sesgos del evaluador. La falta de consistencia es el riesgo principal de los criterios dinámicos.'
	},
	{
		id: 'w7_q17',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Un examen combina en una sola nota: ortografía (0-10), conocimientos (0-50), creatividad (0-20) y asistencia (0-20). Un estudiante con ortografía pésima pero conocimiento excelente termina con la misma nota que uno con ortografía perfecta pero conocimiento básico.',
		question: '¿Qué problema de diseño ilustra este caso?',
		options: ['Gap evaluativo por mezcla de canales', 'Falta de farming', 'Exceso de objetividad', 'Buen dashboard'],
		correct: 'A',
		correctText: 'Gap evaluativo por mezcla de canales',
		explanation: 'Al sumar canales con distinta naturaleza (conocimiento vs ortografía vs asistencia) en una misma ecuación, se pierde información diagnóstica. No se sabe qué está midiendo realmente la nota. Es un gap evaluativo de rúbrica multicanal.'
	},
	{
		id: 'w7_q18',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Un juego muestra al jugador su puntaje actual, el puntaje del líder, el promedio del grupo y una gráfica de su progreso semanal. No hay recompensas asociadas a estos datos.',
		question: '¿Qué función cumple este dashboard?',
		options: ['Retroalimentación informativa para la autorregulación', 'Calificación sumativa', 'Incentivo perverso', 'Sistema de recompensas'],
		correct: 'A',
		correctText: 'Retroalimentación informativa para la autorregulación',
		explanation: 'El dashboard entrega datos sin calificar ni recompensar. Su función es permitir que el estudiante analice su posición y ajuste su estrategia. Es retroalimentación pura para la autorregulación.'
	},
	{
		id: 'w7_q19',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Para ganar el trofeo semanal, el estudiante debe responder 50 preguntas. Sin importar si las respuestas son correctas o incorrectas, solo cuenta la cantidad.',
		question: '¿Qué incentivo perverso genera este sistema?',
		options: ['Cantidad sobre calidad', 'Subjetividad del evaluador', 'Gap multicanal', 'Exceso de dashboard'],
		correct: 'A',
		correctText: 'Cantidad sobre calidad',
		explanation: 'Al premiar solo el volumen, el estudiante aprende a priorizar la velocidad sobre la comprensión. El incentivo está desalineado del aprendizaje.'
	},
	{
		id: 'w7_q20',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Un sistema de evaluación usa 6 canales separados: cada habilidad (sintaxis, lógica, creatividad, eficiencia, documentación, trabajo en equipo) genera su propio puntaje en un score board independiente.',
		question: '¿Qué ventaja tiene este diseño frente a una rúbrica multicanal que mezcle todo en una nota?',
		options: ['Cada canal conserva su información diagnóstica', 'Es más fácil de calcular', 'Elimina la subjetividad', 'Genera más puntos'],
		correct: 'A',
		correctText: 'Cada canal conserva su información diagnóstica',
		explanation: 'Al mantener los canales separados, el estudiante y el docente pueden ver exactamente en qué habilidades hay fortalezas y debilidades. No se pierde información al promediar canales distintos.'
	},
	{
		id: 'w7_q21',
		block: 'C',
		blockName: 'Incentivos Perversos y Conceptos',
		scenario: 'Un juego de aprendizaje otorga una insignia especial solo a los 3 estudiantes con más puntos al final del mes. Los estudiantes dejan de ayudarse entre sí para maximizar su propio puntaje individual.',
		question: '¿Qué problema de diseño revela este caso?',
		options: ['Incentivo perverso que destruye la colaboración', 'Buen uso de metas', 'Dashboard efectivo', 'Algoritmo justo'],
		correct: 'A',
		correctText: 'Incentivo perverso que destruye la colaboración',
		explanation: 'La competencia por un recurso escaso (solo 3 insignias) transforma la dinámica social de colaboración a competencia. El sistema de evaluación está incentivando comportamiento contrario al objetivo pedagógico.'
	}
];
