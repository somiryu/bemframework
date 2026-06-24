export interface AttentionTriviaQuestion {
	id: string;
	block: 'A' | 'B' | 'C';
	blockName: string;
	scenario: string;
	question: string;
	options: string[];
	correct: string; // 'A' | 'B' | 'C' | 'D'
	correctText: string;
	explanation: string;
}

export const attentionTriviaQuestions: AttentionTriviaQuestion[] = [
	// BLOQUE A: Hábitos y Condicionamiento Conductual
	{
		id: 'w5_q1',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'Un colegio usa el mismo timbre largo para el cambio de clase, el simulacro de evacuación y para anunciar exámenes rápidos.',
		question: 'Si fueras un estudiante, ¿qué efecto tendría esta señal en tu conducta habitual?',
		options: [
			'Me mantendría en estado de alerta constante, mejorando mi concentración.',
			'Me generaría confusión y apatía, perdiendo el sentido de urgencia ante eventos importantes.',
			'Desarrollaría un hábito automático y ordenado de preparación.',
			'Ignoraría la señal por completo y esperaría a que el profesor hablara.'
		],
		correct: 'B',
		correctText: 'Me generaría confusión y apatía, perdiendo el sentido de urgencia ante eventos importantes.',
		explanation: 'Una señal ambigua rompe el condicionamiento clásico. Si el estímulo significa múltiples cosas con distintas urgencias, el cerebro del estudiante no puede automatizar una respuesta, aumentando la fricción inicial.'
	},
	{
		id: 'w5_q2',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'Al abrir el simulador de química, el estudiante ve una mesa de laboratorio digital vacía, sin instrucciones, ventanas emergentes o flechas indicadoras.',
		question: 'Si fueras un estudiante, ¿cuál sería tu primera reacción ante esta inacción de estímulos?',
		options: [
			'Frustración inmediata por no saber qué hacer, cerrando la aplicación.',
			'Exploración activa e intuitiva, haciendo clic en los frascos e instrumentos disponibles.',
			'Espera pasiva de que aparezca un mensaje de ayuda o un tutorial obligatorio.',
			'Buscar un manual en internet antes de tocar cualquier elemento en la pantalla.'
		],
		correct: 'B',
		correctText: 'Exploración activa e intuitiva, haciendo clic en los frascos e instrumentos disponibles.',
		explanation: 'La inacción deliberada en el diseño de interfaces (similar al inicio de Mario Bros) actúa como un vacío de información. Al no haber ruido visual, la curiosidad innata empuja al estudiante a tomar la iniciativa, promoviendo la autonomía.'
	},
	{
		id: 'w5_q3',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'El profesor quiere instaurar una rutina de 10 minutos de lectura libre al inicio de cada clase. Usa un cuenco tibetano con un sonido suave y relajante para marcar el inicio.',
		question: 'Si fueras un estudiante, ¿cómo percibirías este disparador auditivo a lo largo de las semanas?',
		options: [
			'Como una alerta molesta que interrumpe mis conversaciones con compañeros.',
			'Como una transición pacífica que condiciona mi cerebro al silencio y al enfoque lector.',
			'Como una señal irrelevante que solo sigo si el profesor me vigila directamente.',
			'Como un estímulo estresante que me presiona a abrir el libro con prisa.'
		],
		correct: 'B',
		correctText: 'Como una transición pacífica que condiciona mi cerebro al silencio y al enfoque lector.',
		explanation: 'El condicionamiento auditivo consistente con un sonido único y asociado exclusivamente a un estado mental (relajación/enfoque) reduce la resistencia cognitiva de transición de un estado activo/social al estudio individual.'
	},
	{
		id: 'w5_q4',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'Un simulador de código emite un sonido agudo y estridente ("buzzer") cada vez que el estudiante comete un error de sintaxis al presionar una tecla.',
		question: 'Si fueras un estudiante, ¿qué hábito desarrollaría esta señal repetitiva?',
		options: [
			'Escribiría más rápido para corregir el error antes de que el sonido me moleste.',
			'Desarrollaría miedo a presionar las teclas, disminuyendo mi tasa de experimentación.',
			'Analizaría con calma el error sintáctico antes de seguir programando.',
			'Silenciaría el computador para ignorar por completo la retroalimentación del sistema.'
		],
		correct: 'B',
		correctText: 'Desarrollaría miedo a presionar las teclas, disminuyendo mi tasa de experimentación.',
		explanation: 'Los disparadores negativos de alta intensidad ante fallos de bajo nivel destruyen la seguridad psicológica. El estudiante prefiere la inacción o silenciar el sistema antes que someterse al castigo auditivo constante.'
	},
	{
		id: 'w5_q5',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'Una aplicación educativa de idiomas envía una notificación a las 8:00 AM que dice: "Tu racha está en peligro. Entra ahora y no pierdas tu progreso".',
		question: 'Si fueras un estudiante que suele estudiar a las 9:00 PM, ¿cómo te afectaría esta notificación proactiva?',
		options: [
			'Me motivaría a cambiar mi rutina para estudiar por la mañana.',
			'Me causaría molestia e ignoraría la alerta porque interrumpe mi jornada laboral/escolar.',
			'Me daría una sensación de control total sobre mi agenda de aprendizaje.',
			'Desactivaría las notificaciones de inmediato para no recibir presiones tempranas.'
		],
		correct: 'B',
		correctText: 'Me causaría molestia e ignoraría la alerta porque interrumpe mi jornada laboral/escolar.',
		explanation: 'Las notificaciones proactivas ("Push") deben alinearse con el ritmo de vida del estudiante. Si se envían a deshoras, se perciben como spam disruptivo en lugar de un facilitador de hábitos.'
	},
	{
		id: 'w5_q6',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'El aula virtual envía una alerta diaria a las 6:00 PM: "Recuerda participar en el foro semanal", incluso a los estudiantes que ya publicaron su respuesta el lunes.',
		question: 'Si fueras un estudiante que ya participó, ¿cómo reaccionaría a este disparador recurrente?',
		options: [
			'Volvería a entrar al foro para leer si alguien me respondió, por curiosidad.',
			'Ignoraría la notificación y entrenaría a mi mente para no prestar atención a futuros avisos del aula.',
			'Me sentiría tranquilo al saber que el sistema funciona bien para toda la clase.',
			'Borraría mi respuesta del foro para volver a publicarla y evitar la alerta.'
		],
		correct: 'B',
		correctText: 'Ignoraría la notificación y entrenaría a mi mente para no prestar atención a futuros avisos del aula.',
		explanation: 'Las alertas Push no condicionadas al estado real del usuario destruyen la confianza en la señal. El cerebro aprende rápidamente a filtrar el "ruido de fondo", lo que anula la efectividad de futuras notificaciones realmente críticas.'
	},
	{
		id: 'w5_q7',
		block: 'A',
		blockName: 'Hábitos y Condicionamiento',
		scenario: 'Un simulador de matemáticas reproduce una fanfarria triunfal de 8 bits muy clara cada vez que el estudiante resuelve correctamente 5 ejercicios seguidos.',
		question: 'Si fueras un estudiante, ¿qué conducta fomentaría este disparador de éxito?',
		options: [
			'Resolvería los ejercicios al azar para intentar escuchar el sonido más rápido.',
			'Buscaría completar bloques de 5 ejercicios para sentir la satisfacción del logro auditivo.',
			'Me parecería infantil y silenciaría el volumen del simulador de inmediato.',
			'Me concentraría en la teoría matemática en lugar de hacer los ejercicios prácticos.'
		],
		correct: 'B',
		correctText: 'Buscaría completar bloques de 5 ejercicios para sentir la satisfacción del logro auditivo.',
		explanation: 'Una señal discriminatoria de éxito actúa como recompensa secundaria condicionada (similar al sonido de las monedas en Mario). Si se entrega con consistencia tras un esfuerzo estructurado, refuerza la conducta del ciclo y motiva a iniciar la siguiente tanda.'
	},

	// BLOQUE B: Frecuencia, Timing y Oportunidad
	{
		id: 'w5_q8',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'El LMS envía una alerta Push: "Quedan 10 minutos para entregar el taller de álgebra" a un estudiante que no ha iniciado la tarea.',
		question: 'Si fueras este estudiante, ¿qué efecto tendría el timing de esta alerta?',
		options: [
			'Me impulsaría a completar el taller de forma rápida y perfecta.',
			'Me generaría un pico de pánico y frustración, llevándome a abandonar el intento de entrega.',
			'Me daría tiempo suficiente para repasar la teoría y responder con calma.',
			'Ignoraría la alerta al asumir que ya no es posible completar el trabajo.'
		],
		correct: 'B',
		correctText: 'Me generaría un pico de pánico y frustración, llevándome a abandonar el intento de entrega.',
		explanation: 'Un timing demasiado cercano al cierre (límite insuperable) para una tarea de alta carga cognitiva no promueve la acción; induce parálisis por estrés o resignación. El pre-aviso debió ocurrir con horas o días de antelación.'
	},
	{
		id: 'w5_q9',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'Un estudiante entregó su proyecto final el lunes. El jueves por la tarde recibe una notificación del sistema: "Recuerda entregar tu proyecto final antes de la medianoche de hoy para evitar penalizaciones".',
		question: 'Si fueras este estudiante, ¿cómo reaccionarías ante este recordatorio?',
		options: [
			'Entraría en pánico pensando que el sistema no guardó mi entrega del lunes.',
			'Agradecería que la plataforma recuerde los plazos generales de la clase.',
			'Ignoraría la alerta por completo y confiaría en mi comprobante de entrega.',
			'Subiría el archivo por segunda vez solo para estar seguro.'
		],
		correct: 'A',
		correctText: 'Entraría en pánico pensando que el sistema no guardó mi entrega del lunes.',
		explanation: 'La falta de sincronización del timing con el estado real del usuario destruye la tranquilidad y la experiencia. El estudiante siente desconfianza en el sistema, lo que le genera ansiedad innecesaria.'
	},
	{
		id: 'w5_q10',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'El lunes a las 8:00 AM, el estudiante recibe 6 alertas automáticas de 6 materias distintas en su celular sobre las lecturas y tareas de la semana.',
		question: 'Si fueras este estudiante, ¿qué impacto tendría esta acumulación en tu planificación semanal?',
		options: [
			'Me sentiría entusiasmado por tener claros todos mis objetivos de la semana.',
			'Experimentaría saturación y agobio, posponiendo la revisión de todas las alertas.',
			'Organizaría mi agenda de inmediato asignando un día para cada materia.',
			'Silenciaría la app para que no me lleguen notificaciones simultáneas.'
		],
		correct: 'B',
		correctText: 'Experimentaría saturación y agobio, posponiendo la revisión de todas las alertas.',
		explanation: 'La sobrecarga de notificadores en un mismo canal y hora satura la atención de trabajo del estudiante (cognitive spamming). Las notificaciones semanales deben distribuirse o consolidarse.'
	},
	{
		id: 'w5_q11',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'Para evitar saturar al alumno, el colegio decide enviar las notas de los quices en un boletín mensual consolidado, en lugar de publicarlas inmediatamente al calificar.',
		question: 'Si fueras un estudiante, ¿cómo calificarías esta baja frecuencia de notificaciones?',
		options: [
			'Excelente, ya que no tengo el estrés de recibir alertas de notas individuales.',
			'Negativa, porque cuando recibo la nota un mes después ya no recuerdo el examen ni mis errores.',
			'Útil para analizar mi promedio general con más objetividad y calma.',
			'Irrelevante; la nota no influye en cómo estudio en el día a día.'
		],
		correct: 'B',
		correctText: 'Negativa, porque cuando recibo la nota un mes después ya no recuerdo el examen ni mis errores.',
		explanation: 'El timing del feedback debe estar lo más cercano posible a la acción (contigüidad temporal). Consolidar en exceso las alertas de evaluación diluye el aprendizaje del error y rompe la retroalimentación.'
	},
	{
		id: 'w5_q12',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'El docente proyecta un ejercicio complejo y, a los 10 segundos, activa una alarma sonora de 1 minuto restante antes de cerrar las respuestas.',
		question: 'Si fueras un estudiante en la sesión, ¿cómo afectaría esta señal a tu resolución?',
		options: [
			'Me enfocaría mejor gracias a la adrenalina del tiempo límite.',
			'Me bloquearía mentalmente, eligiendo cualquier respuesta al azar para cumplir con el plazo.',
			'Leerías el ejercicio con la misma velocidad sin importar el temporizador.',
			'Le pediría al profesor de viva voz que extienda el tiempo del ejercicio.'
		],
		correct: 'B',
		correctText: 'Me bloquearía mentalmente, eligiendo cualquier respuesta al azar para cumplir con el plazo.',
		explanation: 'Activar señales de límite de tiempo sin un periodo previo de asimilación cognitiva satura la memoria de trabajo. El estudiante pasa de procesar el problema (atención ejecutiva) a procesar la amenaza del cierre (estrés).'
	},
	{
		id: 'w5_q13',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'Para asegurar que los alumnos estén presentes en la sesión virtual de 2 horas, el sistema emite una alarma sonora y un botón emergente de "Presente" cada 15 minutos de forma aleatoria.',
		question: 'Si fueras un estudiante en esta clase síncrona, ¿cuál sería el impacto de esta dinámica?',
		options: [
			'Estaría más concentrado en la explicación del profesor para no perderme nada.',
			'Pasaría toda la clase con ansiedad, pendiente del botón emergente en lugar de atender al tema.',
			'Ignoraría el botón y le explicaría al docente mis razones al final de la sesión.',
			'Dejaría un script programado para hacer clic en el botón de forma automática.'
		],
		correct: 'B',
		correctText: 'Pasaría toda la clase con ansiedad, pendiente del botón emergente en lugar de atender al tema.',
		explanation: 'El monitoreo de asistencia mediante alertas repetitivas por sorpresa sabotea la atención sostenida. El estudiante gasta energía mental monitoreando el canal de control en lugar de procesar el contenido de la clase.'
	},
	{
		id: 'w5_q14',
		block: 'B',
		blockName: 'Timing y Oportunidad',
		scenario: 'Un estudiante participa en un foro de dudas. La plataforma le da a elegir entre recibir un correo por cada respuesta de compañeros (Tiempo Real) o un único correo al final del día (Consolidado).',
		question: 'Si fueras el estudiante, ¿cuál de los dos ritmos elegirías para tu hábito de estudio?',
		options: [
			'Tiempo Real, para responder de inmediato a cada interacción de mis compañeros.',
			'Consolidado, para revisar todas las dudas juntas en mi bloque de estudio nocturno sin interrupciones.',
			'Ninguno; considero que los foros no requieren avisos por correo electrónico.',
			'Tiempo Real durante las mañanas y Consolidado durante las tardes y noches.'
		],
		correct: 'B',
		correctText: 'Consolidado, para revisar todas las dudas juntas en mi bloque de estudio nocturno sin interrupciones.',
		explanation: 'El consolidado diario (digest) es la mejor práctica para proteger la atención ejecutiva. Reduce la fragmentación del tiempo y permite al estudiante abordar las interacciones en un momento dedicado, favoreciendo el aprendizaje profundo.'
	},

	// BLOQUE C: Impacto Emocional, Urgencia y Ansiedad
	{
		id: 'w5_q15',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Mientras un estudiante está concentrado leyendo un texto largo y complejo para su examen de historia, un pop-up rojo gigante aparece en el centro de la pantalla con una alarma: "¡Quedan 30 segundos para cerrar el ejercicio!".',
		question: 'Si fueras el estudiante, ¿cómo reaccionarías ante esta interrupción?',
		options: [
			'Aumentaría mi velocidad de lectura y comprensión, reteniendo mejor la información.',
			'Perdería el hilo de la lectura debido a la distracción, experimentando bloqueo mental y ansiedad.',
			'Ignoraría la ventana emergente y continuaría leyendo al mismo ritmo.',
			'Cerraría la plataforma inmediatamente por el enojo de la interrupción.'
		],
		correct: 'B',
		correctText: 'Perdería el hilo de la lectura debido a la distracción, experimentando bloqueo mental y ansiedad.',
		explanation: 'Una alerta intrusiva durante una tarea de alta carga ejecutiva interrumpe la memoria de trabajo. El cerebro debe desviar recursos para procesar la amenaza del tiempo límite, lo que rompe el foco de aprendizaje y causa frustración.'
	},
	{
		id: 'w5_q16',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Si el alumno no entra al curso de idiomas, recibe una notificación móvil con la mascota del robot triste y el texto: "Parece que estudiar química orgánica no es tan importante para ti hoy... Nos vemos luego".',
		question: 'Si fueras este estudiante, ¿qué emoción te generaría esta alerta?',
		options: [
			'Motivación inmediata para entrar a la app y disculparme con la mascota del robot.',
			'Culpa y fastidio, sintiendo rechazo y manipulación emocional por parte de la app.',
			'Alegría por el tono humorístico del mensaje.',
			'Curiosidad por ver qué otras frases graciosas envía la plataforma.'
		],
		correct: 'B',
		correctText: 'Culpa y fastidio, sintiendo rechazo y manipulación emocional por parte de la app.',
		explanation: 'Las alertas pasivo-agresivas apelan a la culpa (introjected regulation). A corto plazo pueden forzar la entrada, pero a largo plazo desgastan la relación emocional con el usuario, provocando que desinstale la aplicación para evadir la hostilidad.'
	},
	{
		id: 'w5_q17',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Al responder mal una pregunta de la trivia de geografía, la pantalla se bloquea con un fondo rojo oscuro y un cartel gigante que dice: "¡RESPUESTA INCORRECTA! HAS FALLADO", acompañado de un sonido de gong dramático.',
		question: 'Si fueras un estudiante con baja confianza en la materia, ¿qué efecto tendría este diseño?',
		options: [
			'Me impulsaría a esforzarme el doble en la siguiente pregunta para borrar la mala nota.',
			'Sentiría desánimo y vergüenza, queriendo abandonar la trivia para evitar más frustración.',
			'Me divertiría el suspenso y continuaría respondiendo sin prestarle atención al cartel.',
			'Silenciaría el computador para no escuchar el sonido de derrota.'
		],
		correct: 'B',
		correctText: 'Sentiría desánimo y vergüenza, queriendo abandonar la trivia para evitar más frustración.',
		explanation: 'Las señales de fallo de alta saliencia visual y auditiva aumentan la ansiedad y disminuyen la autoeficacia. El error debe presentarse como información neutra de aprendizaje (feedback de calibración), no como un castigo dramático.'
	},
	{
		id: 'w5_q18',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Para avisar que la nota de un taller ha sido publicada, la app del colegio reproduce un sonido de sirena de ambulancia en el celular del estudiante.',
		question: 'Si fueras este estudiante, ¿cómo reaccionarías ante este sonido?',
		options: [
			'Con alegría, sabiendo que ya puedo revisar mi nota aprobada.',
			'Con taquicardia y pánico instantáneo, temiendo haber reprobado la materia.',
			'Con curiosidad por saber qué nota obtuve en el taller de cálculo.',
			'Borraría la app de inmediato para evitar sonidos molestos y alarmantes.'
		],
		correct: 'B',
		correctText: 'Con taquicardia y pánico instantáneo, temiendo haber reprobado la materia.',
		explanation: 'Asociar sonidos de emergencia médica con hitos de evaluación rutinarios genera condicionamiento por miedo. La entrega de notas debe notificarse con señales sonoras y visuales tranquilas y neutras.'
	},
	{
		id: 'w5_q19',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Un correo automático del aula virtual dice: "Si no asistes a la tutoría obligatoria de esta tarde a las 4:00 PM, tu promedio se verá seriamente afectado y podrías perder el derecho a examen".',
		question: 'Si fueras el estudiante, ¿cómo afectaría esta redacción a tu motivación para asistir?',
		options: [
			'Asistiría con gusto por el interés de aprender los temas del examen.',
			'Asistiría bajo coacción y con resentimiento, participando de forma pasiva y de mal humor.',
			'Ignoraría la amenaza por considerar que el profesor no se atrevería a reprobarme.',
			'Le pediría una justificación médica a mi doctor para eximirme de la tutoría.'
		],
		correct: 'B',
		correctText: 'Asistiría bajo coacción y con resentimiento, participando de forma pasiva y de mal humor.',
		explanation: 'La motivación controlada por amenazas (external regulation/coerción) destruye la autodeterminación. Aunque el alumno asista, su actitud de aprendizaje será evasiva y de mínimo esfuerzo.'
	},
	{
		id: 'w5_q20',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'En el panel de control del proyecto grupal, el sistema muestra en color rojo parpadeante con un icono de exclamación al estudiante que lleva menos palabras escritas en el borrador compartido.',
		question: 'Si fueras este estudiante rezagado, ¿qué efecto tendría esta visualización ante tus compañeros?',
		options: [
			'Me impulsaría a escribir más rápido para quitar el icono rojo de mi perfil.',
			'Sentiría vergüenza social y exclusión del grupo, abandonando el trabajo compartido.',
			'Ignoraría el icono rojo y continuaría trabajando a mi propio ritmo de escritura.',
			'Discutiría con mis compañeros por la exposición de mi desempeño ante el equipo.'
		],
		correct: 'B',
		correctText: 'Sentiría vergüenza social y exclusión del grupo, abandonando el trabajo compartido.',
		explanation: 'Exponer públicamente el bajo rendimiento o el retraso (public shaming) activa la amígdala y provoca evitación defensiva. Los recordatorios de retraso deben ser privados y orientados a la ayuda, no punitivos.'
	},
	{
		id: 'w5_q21',
		block: 'C',
		blockName: 'Urgencia y Ansiedad',
		scenario: 'Durante una lectura de comprensión en el aula virtual, un reloj digital rojo gigante parpadea y suena con un segundero en la esquina superior derecha de la pantalla.',
		question: 'Si fueras el estudiante, ¿cómo afectaría este cronómetro a tu lectura?',
		options: [
			'Me ayudaría a leer más rápido y con mayor precisión conceptual.',
			'Concentraría mi vista en el reloj en lugar de las palabras, reduciendo mi comprensión de la lectura.',
			'Me daría igual y leería al mismo ritmo sin mirar el reloj digital.',
			'Taparía el reloj con un papel en la pantalla para poder leer en paz.'
		],
		correct: 'B',
		correctText: 'Concentraría mi vista en el reloj en lugar de las palabras, reduciendo mi comprensión de la lectura.',
		explanation: 'La saliencia extrema de un temporizador de cuenta regresiva distrae la atención visual y de trabajo. El cerebro procesa la presión temporal antes que la semántica del texto, disminuyendo la comprensión lectora real.'
	}
];
