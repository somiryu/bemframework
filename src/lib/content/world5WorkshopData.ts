export interface WorkshopSlide5 {
	id: number;
	part: 1 | 2 | 3;
	type: 'selection' | 'sorting' | 'slider';
	title: string;
	concept: string;
	scenario: string;
	// For Phase 1 Selection
	options?: { id: string; text: string; letter: string }[];
	correctOption?: string;
	// For Phase 2 Sorting
	sortingItems?: { id: string; text: string; correctCategory: 'push' | 'digest' | 'silence' }[];
	// For Phase 3 Slider
	initialIntensity?: number;
	correctIntensity?: number;
	minLabel?: string;
	maxLabel?: string;
	// GIOCHI feedback
	giochiFeedback: string;
}

export const world5WorkshopSlides: WorkshopSlide5[] = [
	{
		id: 1,
		part: 1,
		type: 'selection',
		title: 'Reto 1: El timbre ambiguo',
		concept: 'Analicen el impacto de la coherencia y claridad en la respuesta condicionada de los estudiantes.',
		scenario: 'Un colegio usa el mismo timbre largo para el cambio de clase, el simulacro de evacuación y para anunciar exámenes rápidos. Si fueras un estudiante, ¿qué efecto tendría esta señal en tu conducta habitual?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me mantendría en estado de alerta constante, mejorando mi concentración.' },
			{ id: 'b', letter: 'B', text: 'Me generaría confusión y apatía, perdiendo el sentido de urgencia ante eventos importantes.' },
			{ id: 'c', letter: 'C', text: 'Desarrollaría un hábito automático y ordenado de preparación.' },
			{ id: 'd', letter: 'D', text: 'Ignoraría la señal por completo y esperaría a que el profesor hablara.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Una señal ambigua rompe el condicionamiento clásico. Si el estímulo significa múltiples cosas con distintas urgencias, el cerebro del estudiante no puede automatizar una respuesta, aumentando la fricción inicial.'
	},
	{
		id: 2,
		part: 1,
		type: 'selection',
		title: 'Reto 2: El lienzo en blanco (Inacción)',
		concept: 'Analicen cómo la ausencia de estímulos directos (inacción) puede actuar como disparador.',
		scenario: 'Al abrir el simulador de química, el estudiante ve una mesa de laboratorio digital vacía, sin instrucciones, ventanas emergentes o flechas indicadoras. Si fueras un estudiante, ¿cuál sería tu primera reacción ante esta inacción de estímulos?',
		options: [
			{ id: 'a', letter: 'A', text: 'Frustración inmediata por no saber qué hacer, cerrando la aplicación.' },
			{ id: 'b', letter: 'B', text: 'Exploración activa e intuitiva, haciendo clic en los frascos e instrumentos disponibles.' },
			{ id: 'c', letter: 'C', text: 'Espera pasiva de que aparezca un mensaje de ayuda o un tutorial obligatorio.' },
			{ id: 'd', letter: 'D', text: 'Buscar un manual en internet antes de tocar cualquier elemento en la pantalla.' },
		],
		correctOption: 'b',
		giochiFeedback: 'La inacción deliberada en el diseño de interfaces (similar al inicio de Mario Bros) actúa como un vacío de información. Al no haber ruido visual, la curiosidad innata empuja al estudiante a tomar la iniciativa, promoviendo la autonomía.'
	},
	{
		id: 3,
		part: 1,
		type: 'selection',
		title: 'Reto 3: La campana de lectura',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'El profesor quiere instaurar una rutina de 10 minutos de lectura libre al inicio de cada clase. Usa un cuenco tibetano con un sonido suave y relajante para marcar el inicio. Si fueras un estudiante, ¿cómo percibirías este disparador auditivo a lo largo de las semanas?',
		options: [
			{ id: 'a', letter: 'A', text: 'Como una alerta molesta que interrumpe mis conversaciones con compañeros.' },
			{ id: 'b', letter: 'B', text: 'Como una transición pacífica que condiciona mi cerebro al silencio y al enfoque lector.' },
			{ id: 'c', letter: 'C', text: 'Como una señal irrelevante que solo sigo si el profesor me vigila directamente.' },
			{ id: 'd', letter: 'D', text: 'Como un estímulo estresante que me presiona a abrir el libro con prisa.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El condicionamiento auditivo consistente con un sonido único y asociado exclusivamente a un estado mental (relajación/enfoque) reduce la resistencia cognitiva de transición de un estado activo/social al estudio individual.'
	},
	{
		id: 4,
		part: 1,
		type: 'selection',
		title: 'Reto 4: Tono de error en programación',
		concept: 'Analicen cómo los notificadores de error y fallas afectan la seguridad psicológica del alumno.',
		scenario: 'Un simulador de código emite un sonido agudo y estridente ("buzzer") cada vez que el estudiante comete un error de sintaxis al presionar una tecla. Si fueras un estudiante, ¿qué hábito desarrollaría esta señal repetitiva?',
		options: [
			{ id: 'a', letter: 'A', text: 'Escribiría más rápido para corregir el error antes de que el sonido me moleste.' },
			{ id: 'b', letter: 'B', text: 'Desarrollaría miedo a presionar las teclas, disminuyendo mi tasa de experimentación.' },
			{ id: 'c', letter: 'C', text: 'Analizaría con calma el error sintáctico antes de seguir programando.' },
			{ id: 'd', letter: 'D', text: 'Silenciaría el computador para ignorar por completo la retroalimentación del sistema.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los disparadores negativos de alta intensidad ante fallos de bajo nivel destruyen la seguridad psicológica. El estudiante prefiere la inacción o silenciar el sistema antes que someterse al castigo auditivo constante.'
	},
	{
		id: 5,
		part: 1,
		type: 'selection',
		title: 'Reto 5: Recordatorio de racha diaria',
		concept: 'Analicen el impacto de los recordatorios recurrentes en la confianza sistémica y el hábito.',
		scenario: 'Una aplicación educativa de idiomas envía una notificación a las 8:00 AM que dice: "Tu racha está en peligro. Entra ahora y no pierdas tu progreso". Si fueras un estudiante que suele estudiar a las 9:00 PM, ¿cómo te afectaría esta notificación proactiva?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me motivaría a cambiar mi rutina para estudiar por la mañana.' },
			{ id: 'b', letter: 'B', text: 'Me causaría molestia e ignoraría la alerta porque interrumpe mi jornada laboral/escolar.' },
			{ id: 'c', letter: 'C', text: 'Me daría una sensación de control total sobre mi agenda de aprendizaje.' },
			{ id: 'd', letter: 'D', text: 'Desactivaría las notificaciones de inmediato para no recibir presiones tempranas.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las notificaciones proactivas ("Push") deben alinearse con el ritmo de vida del estudiante. Si se envían a deshoras, se perciben como spam disruptivo en lugar de un facilitador de hábitos.'
	},
	{
		id: 6,
		part: 1,
		type: 'selection',
		title: 'Reto 6: El simulador apagado (Inacción)',
		concept: 'Analicen cómo la ausencia de estímulos directos (inacción) puede actuar como disparador.',
		scenario: 'En una práctica virtual de física de circuitos, el simulador muestra un interruptor rojo parpadeante en un tablero completamente apagado y oscuro. Si fueras un estudiante, ¿cuál sería el impacto de este diseño de inacción ambiental?',
		options: [
			{ id: 'a', letter: 'A', text: 'Pensaría que el simulador está dañado o cargando y esperaría.' },
			{ id: 'b', letter: 'B', text: 'Sentiría el impulso inmediato de presionar el interruptor rojo para "encender" el sistema.' },
			{ id: 'c', letter: 'C', text: 'Buscaría un botón de menú para ver la guía de laboratorio escrita.' },
			{ id: 'd', letter: 'D', text: 'Ignoraría el interruptor y trataría de mover los otros cables del tablero.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El parpadeo de un único elemento en un entorno inerte reduce las opciones y dirige la atención ejecutiva. Es un llamado a la acción implícito por contraste visual que no requiere instrucciones de texto.'
	},
	{
		id: 7,
		part: 1,
		type: 'selection',
		title: 'Reto 7: La campana de debate',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Durante un debate en el aula virtual, el sistema reproduce un sonido de corneta de aire de estadio cada vez que un estudiante se excede un segundo del tiempo asignado. Si fueras un estudiante, ¿cómo reaccionarías emocionalmente ante esta señal?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me reiría y continuaría hablando con más energía para terminar mi idea.' },
			{ id: 'b', letter: 'B', text: 'Sentiría humillación social y ansiedad, interrumpiendo mi discurso de forma abrupta.' },
			{ id: 'c', letter: 'C', text: 'Ajustaría mi velocidad de habla con precisión matemática en las siguientes rondas.' },
			{ id: 'd', letter: 'D', text: 'Reclamaría al docente por el uso de sonidos disruptivos en la sesión de debate.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El uso de señales agresivas o humorísticas invasivas frente al grupo virtual activa la amígdala y genera vergüenza social. Para regular la conducta de forma segura, se requiere un pre-aviso sutil.'
	},
	{
		id: 8,
		part: 1,
		type: 'selection',
		title: 'Reto 8: La campana de inicio de clase',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Para marcar el inicio exacto del trabajo colaborativo en Notion, el líder del grupo pone siempre una pista de música de sintetizador muy específica durante 30 segundos. Si fueras un estudiante del equipo, ¿qué hábito desarrollaría esta señal musical recurrente?',
		options: [
			{ id: 'a', letter: 'A', text: 'Cerraría Notion y esperaría a que la música terminara para empezar.' },
			{ id: 'b', letter: 'B', text: 'Entraría en modo de preparación activa, sabiendo que al terminar la música inicia el trabajo.' },
			{ id: 'c', letter: 'C', text: 'Me distraería bailando o buscando el nombre de la canción en internet.' },
			{ id: 'd', letter: 'D', text: 'Sentiría rechazo hacia el líder por imponer sus gustos musicales en el grupo.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Un disparador con duración definida (30s) actúa como zona de amortiguación (buffer). Ayuda al cerebro a desconectarse de la tarea previa y prepararse para la nueva rutina sin una interrupción brusca.'
	},
	{
		id: 9,
		part: 1,
		type: 'selection',
		title: 'Reto 9: El recordatorio redundante',
		concept: 'Analicen el impacto de los recordatorios recurrentes en la confianza sistémica y el hábito.',
		scenario: 'El aula virtual envía una alerta diaria a las 6:00 PM: "Recuerda participar en el foro semanal", incluso a los estudiantes que ya publicaron su respuesta el lunes. Si fueras un estudiante que ya participó, ¿cómo reaccionarías a este disparador recurrente?',
		options: [
			{ id: 'a', letter: 'A', text: 'Volvería a entrar al foro para leer si alguien me respondió, por curiosidad.' },
			{ id: 'b', letter: 'B', text: 'Ignoraría la notificación y entrenaría a mi mente para no prestar atención a futuros avisos del aula.' },
			{ id: 'c', letter: 'C', text: 'Me sentiría tranquilo al saber que el sistema funciona bien para toda la clase.' },
			{ id: 'd', letter: 'D', text: 'Borraría mi respuesta del foro para volver a publicarla y evitar la alerta.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las alertas Push no condicionadas al estado real del usuario destruyen la confianza en la señal. El cerebro aprende rápidamente a filtrar el "ruido de fondo", lo que anula la efectividad de futuras notificaciones realmente críticas.'
	},
	{
		id: 10,
		part: 1,
		type: 'selection',
		title: 'Reto 10: Alerta de inactividad de 3 días',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Si un estudiante no entra al curso virtual en 3 días, la plataforma le envía un correo titulado: "¡Te extrañamos en el curso! Mira lo que tus compañeros están debatiendo hoy". Si fueras un estudiante, ¿este disparador reactivaría tu hábito de estudio?',
		options: [
			{ id: 'a', letter: 'A', text: 'Sí, me daría curiosidad ver los debates de mis compañeros y entraría.' },
			{ id: 'b', letter: 'B', text: 'No, sentiría culpa y presión social, lo que aumentaría mi procrastinación.' },
			{ id: 'c', letter: 'C', text: 'Ignoraría el correo porque considero que el correo no es para temas urgentes.' },
			{ id: 'd', letter: 'D', text: 'Respondería al correo explicando las razones de mi ausencia.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los recordatorios basados en Relatedness (conexión social y pertenencia) son más efectivos para reactivar hábitos que los mensajes punitivos o de control ("Debes entrar a completar la tarea"). Sin embargo, en estudiantes con alta ansiedad social, puede gatillar evasión por culpa.'
	},
	{
		id: 11,
		part: 1,
		type: 'selection',
		title: 'Reto 11: Tono de éxito al completar la meta',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Un simulador de matemáticas reproduce una fanfarria triunfal de 8 bits muy clara cada vez que el estudiante resuelve correctamente 5 ejercicios seguidos. Si fueras un estudiante, ¿qué conducta fomentaría este disparador de éxito?',
		options: [
			{ id: 'a', letter: 'A', text: 'Resolvería los ejercicios al azar para intentar escuchar el sonido más rápido.' },
			{ id: 'b', letter: 'B', text: 'Buscaría completar bloques de 5 ejercicios para sentir la satisfacción del logro auditivo.' },
			{ id: 'c', letter: 'C', text: 'Me parecería infantil y silenciaría el volumen del simulador de inmediato.' },
			{ id: 'd', letter: 'D', text: 'Me concentraría en la teoría matemática en lugar de hacer los ejercicios prácticos.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Una señal discriminatoria de éxito actúa como recompensa secundaria condicionada (similar al sonido de las monedas en Mario). Si se entrega con consistencia tras un esfuerzo estructurado, refuerza la conducta del ciclo y motiva a iniciar la siguiente tanda.'
	},
	{
		id: 12,
		part: 1,
		type: 'selection',
		title: 'Reto 12: Notificación de "desafío opcional"',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Un estudiante recibe una notificación móvil cada vez que un compañero publica un "desafío opcional de código" en el foro, con el texto "Nuevo reto disponible para ganar 5 Coins extras". Si fueras un estudiante, ¿cómo reaccionarías ante este aviso periódico?',
		options: [
			{ id: 'a', letter: 'A', text: 'Entraría de inmediato a resolverlo para mantener mi ventaja competitiva.' },
			{ id: 'b', letter: 'B', text: 'Ignoraría la notificación si considero que el premio no compensa mi tiempo de estudio.' },
			{ id: 'c', letter: 'C', text: 'Sentiría ansiedad por no poder resolverlo, aunque sea una actividad opcional.' },
			{ id: 'd', letter: 'D', text: 'Desactivaría las notificaciones del foro para no saturar mi barra de alertas.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las notificaciones sobre retos secundarios (voluntarios) deben competir con la carga de trabajo principal. Si el incentivo no está alineado con el driver de Maestría o Eficiencia del alumno, la alerta se descarta rápidamente.'
	},
	{
		id: 13,
		part: 1,
		type: 'selection',
		title: 'Reto 13: La inacción del cursor bloqueado',
		concept: 'Analicen cómo la ausencia de estímulos directos (inacción) puede actuar como disparador.',
		scenario: 'En un software de diseño interactivo de videojuegos, si el alumno no hace clic en ningún elemento durante 60 segundos, el cursor del mouse se transforma en una pequeña pala que simula "cavar en busca de tesoros". Si fueras un estudiante, ¿qué efecto tendría esta inacción del sistema en tu atención?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me enfadaría con el programa por alterar el cursor sin mi autorización directa.' },
			{ id: 'b', letter: 'B', text: 'Me daría risa y me impulsaría a volver a mover el mouse para retornar al trabajo de diseño.' },
			{ id: 'c', letter: 'C', text: 'Dejaría el mouse quieto de forma deliberada solo para ver la animación del cursor.' },
			{ id: 'd', letter: 'D', text: 'Pensaría que el sistema se ha congelado y guardaría el progreso para reiniciar.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los capturadores de atención basados en micro-detalles humorísticos o estéticos rompen la inercia de la distracción pasiva. Actúan como señales de reenganche suaves que invitan a retomar la interacción sin emitir alertas intrusivas.'
	},
	{
		id: 14,
		part: 1,
		type: 'selection',
		title: 'Reto 14: Alerta de "pre-requisito listo"',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Un sistema LMS envía un aviso emergente en pantalla: "Tu compañero de equipo ha subido el borrador de la sección A. Ahora puedes comenzar a redactar la sección B". Si fueras un estudiante, ¿cómo afectaría esta notificación a tu flujo de trabajo?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me generaría prisa y presión por completar mi parte rápido para no retrasar al equipo.' },
			{ id: 'b', letter: 'B', text: 'Me daría una guía clara sobre cuándo es el momento óptimo para retomar mi actividad de redacción.' },
			{ id: 'c', letter: 'C', text: 'Ignoraría el aviso y redactaría la sección B cuando tenga mi espacio de estudio planeado.' },
			{ id: 'd', letter: 'D', text: 'Le escribiría a mi compañero para criticar la calidad de su sección A.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las notificaciones basadas en flujos interdependientes actúan como disparadores contextuales de alto valor. Indican que el entorno ha cambiado y que la inacción ya no es una opción válida, coordinando los ritmos de forma orgánica.'
	},
	{
		id: 15,
		part: 1,
		type: 'selection',
		title: 'Reto 15: El recordatorio de racha a la misma hora',
		concept: 'Analicen el impacto de los recordatorios recurrentes en la confianza sistémica y el hábito.',
		scenario: 'Una app educativa envía la notificación de racha todos los días exactamente a las 7:00 PM, sin importar si el usuario ha entrado o no en el transcurso del día. Si fueras un estudiante que suele resolver sus deberes en la mañana, ¿cómo percibirías esta señal?',
		options: [
			{ id: 'a', letter: 'A', text: 'Como un recordatorio útil para repasar los temas una segunda vez en la tarde.' },
			{ id: 'b', letter: 'B', text: 'Como un error molesto del sistema que no reconoce mi esfuerzo matutino.' },
			{ id: 'c', letter: 'C', text: 'Como un mensaje irrelevante que simplemente deslizo para borrar de mi pantalla.' },
			{ id: 'd', letter: 'D', text: 'Como una señal de que debo dejar de estudiar por las mañanas para coincidir con la app.' },
		],
		correctOption: 'b',
		giochiFeedback: 'La inconsistencia entre la acción del usuario y el estado del notificador rompe la relación causal del sistema. El estudiante siente que su esfuerzo no es registrado, lo que reduce la deseabilidad hacia la plataforma.'
	},
	{
		id: 16,
		part: 1,
		type: 'selection',
		title: 'Reto 16: La señal sonora del foro',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Cada vez que un estudiante publica una pregunta en el foro de dudas de la clase, el sistema reproduce un sonido de campana suave a todos los alumnos que están conectados a la plataforma. Si fueras un estudiante concentrado en resolver un cuestionario de física dentro de la misma plataforma, ¿qué efecto tendría esta alerta?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me impulsaría a abrir el foro para ayudar a mi compañero, postergando mi cuestionario.' },
			{ id: 'b', letter: 'B', text: 'Interrumpiría mi concentración y flujo de pensamiento lógico en el cuestionario de física.' },
			{ id: 'c', letter: 'C', text: 'Ignoraría el sonido y continuaría con el cuestionario como si nada hubiera pasado.' },
			{ id: 'd', letter: 'D', text: 'Me causaría enojo y buscaría la opción para apagar el sonido de la plataforma.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Una señal auditiva indiscriminada durante una tarea de alta demanda cognitiva rompe el foco de la atención ejecutiva. Para evitar la saturación, los notificadores sociales deben silenciarse mientras el estudiante realiza tareas complejas.'
	},
	{
		id: 17,
		part: 1,
		type: 'selection',
		title: 'Reto 17: La señal visual de "módulo completo"',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Al responder la última pregunta de una guía de historia, el fondo de la pantalla cambia de azul grisáceo a un tono verde suave con un sutil destello de confeti en las esquinas. Si fueras un estudiante, ¿qué mensaje te transmitiría este cambio de entorno?',
		options: [
			{ id: 'a', letter: 'A', text: 'Que he cometido un error grave y debo revisar mis respuestas.' },
			{ id: 'b', letter: 'B', text: 'Una confirmación pacífica y satisfactoria de que he completado la tarea con éxito.' },
			{ id: 'c', letter: 'C', text: 'Una distracción visual innecesaria que me aleja del contenido histórico.' },
			{ id: 'd', letter: 'D', text: 'Que el sistema se ha reiniciado y debo volver a empezar el módulo.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los cambios sutiles y estéticos del entorno (retroalimentación integrada por color) confirman el cambio de estado del sistema sin necesidad de carteles de texto obstructivos, cerrando la tarea cognitiva de forma limpia.'
	},
	{
		id: 18,
		part: 1,
		type: 'selection',
		title: 'Reto 18: El recordatorio de "racha salvada"',
		concept: 'Analicen el impacto de los recordatorios recurrentes en la confianza sistémica y el hábito.',
		scenario: 'Tras completar una trivia a última hora, la app muestra un mensaje emergente: "Racha salvada al límite. ¡Buen trabajo protegiendo tu hábito!". Si fueras un estudiante, ¿qué emoción te generaría este disparador al final de la actividad?',
		options: [
			{ id: 'a', letter: 'A', text: 'Ansiedad por haber estado tan cerca de perder mi progreso acumulado.' },
			{ id: 'b', letter: 'B', text: 'Alivio y una sensación de triunfo por haber completado el deber a tiempo.' },
			{ id: 'c', letter: 'C', text: 'Indiferencia; considero que la racha es una métrica vacía y sin sentido real.' },
			{ id: 'd', letter: 'D', text: 'Deseo de planificar mejor mi tiempo para no repetir la urgencia mañana.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los notificadores de confirmación emocional al cierre de un reto bajo presión refuerzan la sensación de autoeficacia y alivio, ayudando a consolidar el comportamiento de cierre del ciclo en el cerebro del estudiante.'
	},
	{
		id: 19,
		part: 1,
		type: 'selection',
		title: 'Reto 19: El timbre de "reinicio de ciclo"',
		concept: 'Analicen el impacto de la coherencia y claridad en la respuesta condicionada de los estudiantes.',
		scenario: 'En un juego de rol histórico en vivo, cuando el facilitador toca un triángulo metálico tres veces, todos los equipos deben detenerse, cambiar de mesa y asumir un nuevo rol político. Si fueras un estudiante, ¿cómo afectaría este sonido repetitivo a tu dinámica grupal?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me causaría desorganización y resistencia a cambiar de rol con mi equipo.' },
			{ id: 'b', letter: 'B', text: 'Facilitaría una rotación ordenada y rápida, preparando mi mente para el nuevo contexto político.' },
			{ id: 'c', letter: 'C', text: 'Me daría igual y seguiría discutiendo con mis compañeros de la mesa actual.' },
			{ id: 'd', letter: 'D', text: 'Sentiría frustración por no poder terminar los debates del rol anterior.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las señales de transición unívocas y repetitivas estructuran el tiempo y el espacio en dinámicas síncronas complejas. Permiten que los estudiantes automaticen la transición física y mental entre fases del taller sin instrucciones repetidas del docente.'
	},
	{
		id: 20,
		part: 1,
		type: 'selection',
		title: 'Reto 20: La alerta de "revisión por pares disponible"',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Un sistema de escritura envía una notificación móvil que dice: "Un compañero ha evaluado tu ensayo. Tienes 48 horas para leer su retroalimentación y calificar su reseña". Si fueras un estudiante, ¿este disparador te motivaría a entrar a la plataforma?',
		options: [
			{ id: 'a', letter: 'A', text: 'Sí, me daría intriga ver la opinión de mi compañero y calificar su reseña a tiempo.' },
			{ id: 'b', letter: 'B', text: 'No, me daría pereza tener que leer y evaluar la reseña de otra persona.' },
			{ id: 'c', letter: 'C', text: 'Sentiría temor de leer críticas negativas y pospondría la entrada hasta el final del plazo.' },
			{ id: 'd', letter: 'D', text: 'Le pediría al profesor que evalúe mi ensayo en lugar de mi compañero.' },
		],
		correctOption: 'a',
		giochiFeedback: 'El disparador combina la curiosidad social (Relatedness) con un plazo definido (urgencia de 48h). Esta mezcla genera una tracción efectiva que reactiva la interacción dentro del ciclo de aprendizaje colaborativo.'
	},
	{
		id: 21,
		part: 1,
		type: 'selection',
		title: 'Reto 21: El simulador de circuitos en blanco (Inacción)',
		concept: 'Analicen cómo la ausencia de estímulos directos (inacción) puede actuar como disparador.',
		scenario: 'Al entrar al taller virtual de electricidad, la pantalla muestra un banco de pruebas vacío. El estudiante debe arrastrar los componentes del inventario para iniciar la simulación, pero no hay ningún mensaje de "Inicio". Si fueras un estudiante, ¿cómo reaccionaría tu atención ante esta falta de guía?',
		options: [
			{ id: 'a', letter: 'A', text: 'Esperaría a que el profesor dé la instrucción de forma oral antes de tocar nada.' },
			{ id: 'b', letter: 'B', text: 'Comenzaría a experimentar con los componentes del inventario para ver qué pasa en el tablero.' },
			{ id: 'c', letter: 'C', text: 'Me sentiría perdido y abandonaría la plataforma por falta de instrucciones de texto.' },
			{ id: 'd', letter: 'D', text: 'Buscaría en la sección de ayuda un tutorial en video de cómo usar la interfaz.' },
		],
		correctOption: 'b',
		giochiFeedback: 'La ausencia de guías restrictivas en entornos sandbox estimula la exploración activa de bajo riesgo. Al no haber un camino predefinido, el estudiante asume el rol de experimentador por curiosidad innata.'
	},
	{
		id: 22,
		part: 1,
		type: 'selection',
		title: 'Reto 22: Alerta visual de "desafío cooperativo"',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Si tres miembros del grupo completan la lectura obligatoria, el sistema les muestra a todos un banner verde: "¡Desafío grupal desbloqueado! Reúnanse con su equipo para responder la trivia especial". Si fueras un estudiante de ese equipo, ¿qué efecto tendría esta alerta visual?',
		options: [
			{ id: 'a', letter: 'A', text: 'Presionaría a los miembros restantes para que lean rápido y no retrasen al grupo.' },
			{ id: 'b', letter: 'B', text: 'Generaría discusiones y reclamos entre los integrantes por los ritmos de estudio.' },
			{ id: 'c', letter: 'C', text: 'Ignoraría el aviso y seguiría estudiando a mi propio ritmo individual.' },
			{ id: 'd', letter: 'D', text: 'Le pediría al sistema que me permita responder la trivia especial de forma individual.' },
		],
		correctOption: 'a',
		giochiFeedback: 'Los disparadores cooperativos aprovechan la presión de grupo positiva (social compliance). La notificación alerta sobre un cambio de estado del equipo que requiere coordinación, estimulando el hábito de estudio conjunto.'
	},
	{
		id: 23,
		part: 1,
		type: 'selection',
		title: 'Reto 23: La señal de "recurso escaso"',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'En una simulación de economía escolar virtual, si el presupuesto del grupo cae por debajo del 10%, el fondo del panel financiero parpadea lentamente en tono ámbar y suena un tic-tac suave. Si fueras un estudiante, ¿cómo reaccionarías ante este cambio en la interfaz?',
		options: [
			{ id: 'a', letter: 'A', text: 'Ignoraría la señal por completo y seguiría gastando al mismo ritmo.' },
			{ id: 'b', letter: 'B', text: 'Sentiría prisa por revisar el balance de gastos y ajustar el presupuesto del equipo.' },
			{ id: 'c', letter: 'C', text: 'Cerraría la simulación por el estrés que me genera el sonido del tic-tac.' },
			{ id: 'd', letter: 'D', text: 'Le pediría al profesor que recargue el presupuesto de mi equipo de forma manual.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El parpadeo ámbar y el sonido de tic-tac son señales visuales y sonoras de urgencia moderada. Capturan la atención sin saturar el cerebro, motivando al estudiante a tomar medidas preventivas antes de la quiebra.'
	},
	{
		id: 24,
		part: 1,
		type: 'selection',
		title: 'Reto 24: Inacción del software de diseño de planos',
		concept: 'Analicen cómo la ausencia de estímulos directos (inacción) puede actuar como disparador.',
		scenario: 'Al iniciar el software de diseño de planos arquitectónicos, la pantalla muestra una cuadrícula en 3D vacía con un único punto de fuga brillante en el centro del espacio de trabajo. Si fueras un estudiante, ¿qué harías ante este diseño visual de inacción?',
		options: [
			{ id: 'a', letter: 'A', text: 'Buscaría el botón de cerrar la aplicación por creer que no ha cargado los menús.' },
			{ id: 'b', letter: 'B', text: 'Haría clic en la cuadrícula o en el punto de fuga brillante para iniciar el trazado.' },
			{ id: 'c', letter: 'C', text: 'Esperaría a que aparezca una ventana de diálogo flotante con las instrucciones.' },
			{ id: 'd', letter: 'D', text: 'Cambiaría de pestaña para buscar un tutorial de dibujo arquitectónico en YouTube.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Un único punto luminoso en un entorno en blanco actúa como el "atractor visual" principal. Guía la acción inicial de forma intuitiva sin sobrecargar la pantalla de textos explicativos distractores.'
	},
	{
		id: 25,
		part: 1,
		type: 'selection',
		title: 'Reto 25: Notificación push de "racha en peligro" nocturna',
		concept: 'Analicen el impacto de los recordatorios recurrentes en la confianza sistémica y el hábito.',
		scenario: 'La app envía una alerta móvil a las 11:30 PM que dice: "¡Solo te quedan 30 minutos para salvar tu racha de hoy! Entra a responder una pregunta rápida". Si fueras un estudiante cansado y a punto de dormir, ¿qué emoción te causaría este disparador?',
		options: [
			{ id: 'a', letter: 'A', text: 'Agradecimiento por salvar mi hábito al último minuto, entrando feliz a la app.' },
			{ id: 'b', letter: 'B', text: 'Estrés, culpa y fastidio, sintiendo que la app me vigila y controla mis horas de sueño.' },
			{ id: 'c', letter: 'C', text: 'Indiferencia absoluta, apagando el celular para dormir sin interrupciones.' },
			{ id: 'd', letter: 'D', text: 'Deseo de desinstalar la app para no recibir alertas molestas a altas horas.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El timing al filo de la medianoche genera pánico y culpa (ansiedad de rendimiento). En lugar de fomentar el hábito de forma positiva, el estudiante asocia la app con emociones de estrés y control intrusivo, dañando la retención.'
	},
	{
		id: 26,
		part: 1,
		type: 'selection',
		title: 'Reto 26: Señal de "reunión grupal inminente"',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'El sistema de gestión de proyectos envía una alerta sonora de campana de oficina 5 minutos antes de la hora acordada para la sesión de trabajo del equipo. Si fueras un estudiante, ¿cómo percibirías este recordatorio de corto plazo?',
		options: [
			{ id: 'a', letter: 'A', text: 'Como una interrupción molesta de mi actividad actual que me obliga a apurarme.' },
			{ id: 'b', letter: 'B', text: 'Como un pre-aviso útil que me permite guardar mi trabajo y conectarme a tiempo.' },
			{ id: 'c', letter: 'C', text: 'Como una alerta innecesaria que considero spam ya que tengo mi calendario abierto.' },
			{ id: 'd', letter: 'D', text: 'Ignoraría la campana y me conectaría 10 minutos tarde a la reunión del grupo.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Las alertas de pre-aviso de corto plazo (5-10 minutos) reducen la fricción de transición. Permiten al estudiante cerrar de forma ordenada su actividad actual, reduciendo el estrés de llegar tarde.'
	},
	{
		id: 27,
		part: 1,
		type: 'selection',
		title: 'Reto 27: Alerta de "error de compilación persistente"',
		concept: 'Analicen cómo los notificadores de error y fallas afectan la seguridad psicológica del alumno.',
		scenario: 'En el simulador de programación, tras fallar 5 intentos seguidos del mismo código, la interfaz cambia el color del botón "Ejecutar" de azul a gris claro e inhabilita los clics durante 30 segundos. Si fueras un estudiante, ¿qué efecto tendría esta inacción forzada del sistema?',
		options: [
			{ id: 'a', letter: 'A', text: 'Me enojaría por no poder seguir intentándolo de inmediato, queriendo cerrar el simulador.' },
			{ id: 'b', letter: 'B', text: 'Aprovecharía los 30 segundos de pausa obligatoria para releer el código y buscar el error sintáctico.' },
			{ id: 'c', letter: 'C', text: 'Pensaría que el simulador se ha bloqueado por un error del servidor y pediría soporte.' },
			{ id: 'd', letter: 'D', text: 'Haría clics repetidos en el botón gris para intentar forzar la ejecución del programa.' },
		],
		correctOption: 'b',
		giochiFeedback: 'La inactividad forzada de corto plazo (cool-down period) rompe el ciclo de "ensayo y error impulsivo" (farming de intentos). Fuerza una pausa cognitiva que estimula la autorregulación y la revisión consciente antes de actuar de nuevo.'
	},
	{
		id: 28,
		part: 1,
		type: 'selection',
		title: 'Reto 28: Notificador de "pregunta de compañero en el foro"',
		concept: 'Analicen el impacto de la señal de llamado a la acción y su relevancia conductual.',
		scenario: 'Si un compañero del grupo de trabajo publica una duda en el tablero común, al estudiante le llega una alerta móvil: "Juan tiene una duda sobre la sección B de tu proyecto. ¿Puedes ayudarle?". Si fueras un estudiante, ¿cómo responderías ante este llamado a la acción?',
		options: [
			{ id: 'a', letter: 'A', text: 'Entraría al foro a resolver su duda de inmediato por empatía y responsabilidad del equipo.' },
			{ id: 'b', letter: 'B', text: 'Ignoraría la alerta para que otro compañero del grupo responda la pregunta de Juan.' },
			{ id: 'c', letter: 'C', text: 'Sentiría molestia al pensar que Juan no investiga por su propia cuenta antes de preguntar.' },
			{ id: 'd', letter: 'D', text: 'Le escribiría a Juan por chat privado para responderle sin usar el foro de la clase.' },
		],
		correctOption: 'a',
		giochiFeedback: 'Los disparadores basados en el Driver de Relacionamiento (Relatedness) apelan a la reciprocidad social y a la responsabilidad mutua, logrando altas tasas de respuesta activa sin usar premios transaccionales.'
	},
	{
		id: 29,
		part: 1,
		type: 'selection',
		title: 'Reto 29: Señal de "nuevo nivel de dificultad desbloqueado"',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Al obtener puntaje perfecto en la trivia de geografía, el mapa del juego despliega una animación de nubes disipándose y un sonido de viento que revela una nueva región montañosa. Si fueras un estudiante, ¿qué te incitaría a hacer este disparador visual y sonoro?',
		options: [
			{ id: 'a', letter: 'A', text: 'Cerrar la sesión de estudio al sentir que ya completé el objetivo principal de la clase.' },
			{ id: 'b', letter: 'B', text: 'Hacer clic en la nueva región montañosa para explorar los nuevos retos de geografía.' },
			{ id: 'c', letter: 'C', text: 'Sentir pereza por el aumento de dificultad y volver a jugar en las regiones fáciles.' },
			{ id: 'd', letter: 'D', text: 'Pedirle al profesor que me califique la actividad antes de explorar el nuevo mapa.' },
		],
		correctOption: 'b',
		giochiFeedback: 'Los llamados visuales de descubrimiento (unveiling) aprovechan la curiosidad y la sensación de progreso (Mastery). Indican la apertura de nuevas fronteras interactivas, invitando a la exploración voluntaria inmediata.'
	},
	{
		id: 30,
		part: 1,
		type: 'selection',
		title: 'Reto 30: Campana de finalización de examen',
		concept: 'Analicen la asociación exclusiva de señales sonoras o visuales con estados de enfoque.',
		scenario: 'Para marcar el fin del examen de física, el sistema reproduce un sonido de campana de iglesia solemne y bloquea la pantalla mostrando un mensaje: "Tiempo agotado. Respuestas consolidadas". Si fueras un estudiante, ¿cómo evaluarías emocionalmente este cierre de interacción?',
		options: [
			{ id: 'a', letter: 'A', text: 'Como un final ordenado y justo que evita que otros compañeros sigan respondiendo.' },
			{ id: 'b', letter: 'B', text: 'Como una interrupción violenta y estresante que me impidió revisar mis últimas respuestas.' },
			{ id: 'c', letter: 'C', text: 'Con indiferencia absoluta; considero que los exámenes siempre deben cerrarse así.' },
			{ id: 'd', letter: 'D', text: 'Como una alerta confusa que me hace dudar si mis respuestas se guardaron bien.' },
		],
		correctOption: 'b',
		giochiFeedback: 'El bloqueo abrupto con sonidos solemnes eleva la disonancia y el estrés post-evaluación. Aunque la inacción forzada es necesaria al expirar el tiempo, el notificador visual debe transmitir calma y confirmación de guardado seguro para mitigar la ansiedad de rendimiento.'
	},
	{
		id: 31,
		part: 2,
		type: 'sorting',
		title: 'Reto 31: Gestión de Alertas Académicas',
		concept: 'Clasifiquen alertas de exámenes y tareas para evitar la fatiga por sobre-alerta académica.',
		scenario: 'Arrastren y clasifiquen las siguientes alertas académicas programadas para el día de hoy según su urgencia y canal de recepción idóneo.',
		sortingItems: [
			{ id: 's31_1', text: 'Tu examen final de álgebra inicia en 3 minutos de forma obligatoria.', correctCategory: 'push' },
			{ id: 's31_2', text: 'El profesor ha subido la lista de lecturas recomendadas para el próximo mes.', correctCategory: 'digest' },
			{ id: 's31_3', text: 'Alerta: Tienes un taller pendiente de entrega (que ya subiste con éxito ayer).', correctCategory: 'silence' },
			{ id: 's31_4', text: 'Se canceló la sesión presencial de laboratorio de hoy por fallas eléctricas en el plantel.', correctCategory: 'push' },
			{ id: 's31_5', text: 'Quedan 2 días para la entrega del ensayo opcional de geografía.', correctCategory: 'digest' },
		],
		giochiFeedback: 'Las alertas inmediatas (Push) se reservan para eventos de última hora y exámenes síncronos críticos. La planeación a largo plazo y avisos generales pertenecen a resúmenes consolidados (Digest), y las notificaciones de tareas ya entregadas se silencian.'
	},
	{
		id: 32,
		part: 2,
		type: 'sorting',
		title: 'Reto 32: Interacciones Sociales y Foros',
		concept: 'Clasifiquen notificaciones de foros y peer-reviews para equilibrar la colaboración social y el foco.',
		scenario: 'Clasifiquen las notificaciones generadas por la interacción social del grupo para no interrumpir el estudio individual de forma innecesaria.',
		sortingItems: [
			{ id: 's32_1', text: 'Un compañero etiquetó tu nombre en una duda urgente sobre tu parte del código del proyecto.', correctCategory: 'push' },
			{ id: 's32_2', text: 'Recibiste 5 nuevos comentarios en tu publicación del foro semanal.', correctCategory: 'digest' },
			{ id: 's32_3', text: 'Se publicó una pregunta general en el foro de dudas de la materia.', correctCategory: 'digest' },
			{ id: 's32_4', text: 'Tu compañero de banca leyó tu comentario en el foro sin escribir respuestas.', correctCategory: 'silence' },
			{ id: 's32_5', text: 'El líder de tu equipo te ha convocado a una videollamada síncrona de emergencia en este momento.', correctCategory: 'push' },
		],
		giochiFeedback: 'Las menciones directas y convocatorias activas de equipo requieren triggers Push por su urgencia de respuesta. El flujo regular de comentarios generales se consolida en resúmenes diarios (Digest), y los avisos pasivos de lectura se silencian.'
	},
	{
		id: 33,
		part: 2,
		type: 'sorting',
		title: 'Reto 33: Alertas de Soporte y Sistema',
		concept: 'Determinen la urgencia de notificaciones de mantenimiento y seguridad de la plataforma.',
		scenario: 'Clasifiquen las notificaciones automáticas del servidor de aprendizaje para proteger la atención del alumno de temas técnicos irrelevantes.',
		sortingItems: [
			{ id: 's33_1', text: 'Inicio de sesión sospechoso detectado desde un nuevo dispositivo en tu cuenta virtual.', correctCategory: 'push' },
			{ id: 's33_2', text: 'El servidor del aula virtual estará en mantenimiento programado este domingo de 2:00 AM a 4:00 AM.', correctCategory: 'digest' },
			{ id: 's33_3', text: 'Confirmación de carga: Tu foto de perfil ha sido actualizada en la base de datos.', correctCategory: 'silence' },
			{ id: 's33_4', text: 'Código de seguridad de un solo uso para restablecer tu contraseña en este instante.', correctCategory: 'push' },
			{ id: 's33_5', text: 'El módulo de reportes históricos del curso se actualizará el próximo mes.', correctCategory: 'digest' },
		],
		giochiFeedback: 'Las alertas de seguridad y autenticación en curso (tokens, inicios sospechosos) requieren avisos Push inmediatos para actuar rápido. Los mantenimientos futuros van al Digest técnico, y los avisos de autoguardado se silencian.'
	},
	{
		id: 34,
		part: 2,
		type: 'sorting',
		title: 'Reto 34: Motivación y Gamificación',
		concept: 'Calibren disparadores de rachas y logros para evitar la fatiga conductual.',
		scenario: 'Clasifiquen los disparadores de motivación de la app para evitar la habituación y la insensibilidad al premio.',
		sortingItems: [
			{ id: 's34_1', text: '¡Felicidades! Has ganado la medalla de plata de constancia de la semana.', correctCategory: 'digest' },
			{ id: 's34_2', text: 'Completaste tu racha de hoy: Notificación automática nocturna para ingresar a la app.', correctCategory: 'silence' },
			{ id: 's34_3', text: 'Tu racha invicta de 15 días expira en 1 hora y aún no registras actividad hoy.', correctCategory: 'push' },
			{ id: 's34_4', text: 'Un compañero del curso superó tu puntuación en la tabla semanal de líderes.', correctCategory: 'digest' },
			{ id: 's34_5', text: 'El sistema recalculó tu porcentaje general de medallas acumuladas del trimestre pasado.', correctCategory: 'silence' },
		],
		giochiFeedback: 'Las rachas a punto de vencer son triggers de urgencia legítimos (Push) por aversión a la pérdida. Los logros semanales y cambios en tablas se agrupan en el Digest motivacional, y los avisos redundantes a usuarios que ya cumplieron se silencian.'
	},
	{
		id: 35,
		part: 2,
		type: 'sorting',
		title: 'Reto 35: Timing y Fuera de Horas',
		concept: 'Eviten el agobio cognitivo de notificaciones recibidas en horarios no lectivos.',
		scenario: 'Clasifiquen las notificaciones enviadas durante fines de semana y altas horas de la noche para proteger el descanso de los estudiantes.',
		sortingItems: [
			{ id: 's35_1', text: 'Sábado 10:00 PM: Recordatorio genérico para mantener tu racha de estudio diaria.', correctCategory: 'silence' },
			{ id: 's35_2', text: 'Domingo 2:00 PM: Material de estudio recomendado para las clases de la siguiente semana.', correctCategory: 'digest' },
			{ id: 's35_3', text: 'Viernes 11:30 PM: Notificación móvil de que las calificaciones del quiz de historia han sido publicadas.', correctCategory: 'silence' },
			{ id: 's35_4', text: 'Sábado 9:00 AM: Cambio de punto de encuentro de la práctica de campo presencial de este lunes temprano.', correctCategory: 'push' },
			{ id: 's35_5', text: 'Domingo 8:00 PM: Recordatorio preventivo de la clase síncrona obligatoria del lunes a las 8:00 AM.', correctCategory: 'digest' },
		],
		giochiFeedback: 'Los fines de semana y noches deben ser protegidos. Solo cambios logísticos críticos de última hora son Push. La planeación de la semana se agrupa en el Digest dominical, y el spam de rachas nocturnas o notas tardías se silencia por completo.'
	},
	{
		id: 36,
		part: 2,
		type: 'sorting',
		title: 'Reto 36: Redundancia y Repetición',
		concept: 'Clasifiquen alertas duplicadas o redundantes para proteger la saliencia de la señal.',
		scenario: 'Clasifiquen las siguientes alertas redundantes para evitar la ceguera de banners y el desprecio del canal por parte del alumno.',
		sortingItems: [
			{ id: 's36_1', text: 'Faltan 12 horas para la entrega: Envío simultáneo de alerta móvil + correo electrónico + mensaje SMS.', correctCategory: 'digest' },
			{ id: 's36_2', text: 'El profesor canceló la videoclase de hoy que iniciaba en 15 minutos por urgencia médica.', correctCategory: 'push' },
			{ id: 's36_3', text: 'Recordatorio genérico de participación en el foro semanal (para un estudiante que ya aportó).', correctCategory: 'silence' },
			{ id: 's36_4', text: 'Notificación de bienvenida a la plataforma que se despliega cada vez que abres la pantalla principal.', correctCategory: 'silence' },
			{ id: 's36_5', text: 'Resumen semanal de los 3 entregables pendientes del curso enviado el lunes por la mañana.', correctCategory: 'digest' },
		],
		giochiFeedback: 'El envío redundante en múltiples canales fatiga al usuario y entrena al cerebro para ignorar futuras alertas. Solo imprevistos inmediatos son Push. Las alertas generales van al Digest y los recordatorios a usuarios cumplidos se silencian.'
	},
	{
		id: 37,
		part: 2,
		type: 'sorting',
		title: 'Reto 37: Consolidación vs Tiempo Real',
		concept: 'Decidan cuándo agrupar alertas informativas frente a notificaciones instantáneas.',
		scenario: 'Diferencien qué información necesita un trigger en tiempo real frente a aquella que mejora al consolidarse.',
		sortingItems: [
			{ id: 's37_1', text: 'Se publicaron las calificaciones definitivas del primer examen parcial de toda la clase.', correctCategory: 'digest' },
			{ id: 's37_2', text: 'El docente acaba de abrir una sesión de dudas extraordinaria en vivo que inicia en este instante.', correctCategory: 'push' },
			{ id: 's37_3', text: "Un compañero de tu grupo cambió su frase de estado de perfil a 'Concentrado'.", correctCategory: 'silence' },
			{ id: 's37_4', text: 'Recibiste mensajes individuales aislados de saludo en el chat del foro común.', correctCategory: 'digest' },
			{ id: 's37_5', text: 'El servidor de exámenes rápidos se cayó a la mitad del quiz activo de tu grupo.', correctCategory: 'push' },
		],
		giochiFeedback: 'Las notas publicadas y chats informales se consolidan (Digest) para no interrumpir el foco. Las caídas de servidores durante quices activos y tutorías de última hora requieren Push. Las acciones cosméticas se silencian.'
	},
	{
		id: 38,
		part: 2,
		type: 'sorting',
		title: 'Reto 38: Interrupciones en Clase',
		concept: 'Gestionen disparadores intrusivos durante sesiones síncronas de aprendizaje.',
		scenario: 'Clasifiquen los disparadores del sistema mientras el estudiante está conectado a una videoclase síncrona en vivo.',
		sortingItems: [
			{ id: 's38_1', text: 'Durante la videoclase: Un compañero del equipo te envía el archivo de apuntes compartidos.', correctCategory: 'digest' },
			{ id: 's38_2', text: 'Durante la videoclase: El profesor activa un quiz de repaso rápido de 2 minutos.', correctCategory: 'push' },
			{ id: 's38_3', text: 'Durante la videoclase: La app virtual te muestra un globo festivo con sonido por tu cumpleaños.', correctCategory: 'silence' },
			{ id: 's38_4', text: 'Durante la videoclase: Alerta móvil de una tarea de otra materia para el próximo viernes.', correctCategory: 'silence' },
			{ id: 's38_5', text: 'Durante la videoclase: Se cae la señal de transmisión de la clase virtual por error del host.', correctCategory: 'push' },
		],
		giochiFeedback: 'En clases en vivo, la atención es altamente vulnerable. Solo las dinámicas integradas en la clase síncrona (quices) o fallas de transmisión son Push. Los apuntes van al Digest post-clase y las alertas ajenas se silencian.'
	},
	{
		id: 39,
		part: 2,
		type: 'sorting',
		title: 'Reto 39: Notificaciones de Evaluación',
		concept: 'Calibren el timing de entrega de notas y retroalimentaciones académicas.',
		scenario: 'Clasifiquen las notificaciones del módulo de calificaciones para balancear el feedback oportuno con la calma mental.',
		sortingItems: [
			{ id: 's39_1', text: 'Se cargó el archivo con la retroalimentación en video de tu proyecto integrador final.', correctCategory: 'digest' },
			{ id: 's39_2', text: 'El quiz de retroalimentación de la sesión se cerrará definitivamente en 1 minuto.', correctCategory: 'push' },
			{ id: 's39_3', text: 'Aviso de recepción: Tu examen ha sido recibido con éxito en la base de datos.', correctCategory: 'silence' },
			{ id: 's39_4', text: 'El promedio general acumulado de la clase ha subido una décima este mes.', correctCategory: 'silence' },
			{ id: 's39_5', text: 'Tu calificación del quiz semanal ya se encuentra disponible para consulta.', correctCategory: 'digest' },
		],
		giochiFeedback: 'Los cierres inminentes de quices activos requieren aviso inmediato (Push). La entrega de notas y retroalimentaciones detalladas deben ir al Digest para ser asimiladas en un espacio reflexivo. Los recibos de entrega son silenciosos.'
	},
	{
		id: 40,
		part: 2,
		type: 'sorting',
		title: 'Reto 40: Proyectos y Coordinación Grupal',
		concept: 'Clasifiquen alertas de trabajo en equipo para evitar el spam de coordinación.',
		scenario: 'Clasifiquen las notificaciones de trabajo en documentos compartidos y coordinación grupal.',
		sortingItems: [
			{ id: 's40_1', text: 'El archivo de presentación grupal en la nube se ha guardado de manera automática.', correctCategory: 'silence' },
			{ id: 's40_2', text: 'Tu compañero de grupo cargó su parte de la redacción para tu revisión obligatoria.', correctCategory: 'digest' },
			{ id: 's40_3', text: 'Tu compañero de equipo acaba de iniciar sesión en la plataforma de trabajo.', correctCategory: 'silence' },
			{ id: 's40_4', text: 'Se suspendió la sesión de co-creación grupal de hoy por enfermedad de un compañero.', correctCategory: 'push' },
			{ id: 's40_5', text: 'Faltan 30 minutos para la reunión virtual acordada con tu equipo de desarrollo.', correctCategory: 'push' },
		],
		giochiFeedback: 'Las suspensiones de última hora y recordatorios de reuniones próximas requieren Push para evitar pérdidas de tiempo en vivo. Los avances asíncronos van al Digest del grupo, y el spam de autoguardados o ingresos se silencia.'
	},
	{
		id: 41,
		part: 3,
		type: 'slider',
		title: 'Reto 41: El Notificador de Tiempo Invasivo',
		concept: 'Calibren la intensidad óptima de la señal para evitar el bloqueo mental y la ansiedad por tiempo.',
		scenario: "Mientras estás concentrado resolviendo una lectura de comprensión histórica, un cartel de pantalla completa parpadeante y con sonido de sirena (intensidad 5) te alerta: '¡Quedan 30 segundos!'. Calibra la intensidad del notificador del 1 al 5.",
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Periférico e informativo (Sutil)',
		maxLabel: 'Emergencia intrusiva (Alarma)',
		giochiFeedback: 'Una alerta intrusiva de nivel 5 durante una tarea de alta carga ejecutiva sabotea la memoria de trabajo. Bajar el nivel a 2 (una señal periférica y sutil, sin alarmas sonoras) mantiene el foco cognitivo en el problema y no en la amenaza de la cuenta regresiva.'
	},
	{
		id: 42,
		part: 3,
		type: 'slider',
		title: 'Reto 42: La Mascota del Aula Pasivo-Agresiva',
		concept: 'Eviten el chantaje emocional en las alertas push de retorno de usuario.',
		scenario: "Al no ingresar a la plataforma por 2 días, la mascota interactiva del aula virtual te envía una alerta con un avatar llorando y el texto: '¡Me tienes abandonado! ¿Ya no te importa tu educación?' (intensidad 5). Modera la intensidad del recordatorio.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Recordatorio neutro de valor',
		maxLabel: 'Culpabilización pasivo-agresiva',
		giochiFeedback: 'Las alertas basadas en el chantaje emocional (guilt-tripping) generan rechazo y distanciamiento a mediano plazo. Calibrar al nivel 1 (un recordatorio neutro enfocado en facilitar el reingreso u ofrecer valor directo) fomenta hábitos saludables sin generar culpa.'
	},
	{
		id: 43,
		part: 3,
		type: 'slider',
		title: 'Reto 43: El Sonido de Error Punitivo',
		concept: 'Ajusten el volumen y drama de los notificadores de error de cara a la tolerancia a la frustración.',
		scenario: "Al cometer un error en una trivia matemática, el sistema reproduce un sonido de gong trágico amplificado y bloquea la pantalla con un cartel gigante: '¡ERROR DE CÁLCULO! Pierdes tus puntos acumulados' (intensidad 5). Calibra el notificador.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Retroalimentación visual neutra',
		maxLabel: 'Castigo sonoro dramático',
		giochiFeedback: 'Los sonidos estruendosos ante fallas activan el sistema de amenaza (cortisol), paralizando el aprendizaje y disminuyendo la experimentación. Bajar al nivel 1 (retroalimentación visual neutra que asimila el error como información) mantiene seguro al estudiante.'
	},
	{
		id: 44,
		part: 3,
		type: 'slider',
		title: 'Reto 44: Alarma de Publicación de Notas',
		concept: 'Ajusten la saliencia visual y auditiva de las alertas de resultados académicos.',
		scenario: "El sistema publica las notas del quiz y envía una notificación móvil con sonido de bocina de ambulancia y vibración continua: '¡NOTAS PUBLICADAS! Revisa tu puesto en el ranking' (intensidad 5). Calibra la urgencia visual y sonora.",
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Informativo discreto en bitácora',
		maxLabel: 'Emergencia visual y sonora',
		giochiFeedback: 'La publicación de notas no es una emergencia de seguridad. Calibrar al nivel 2 (notificación visual discreta en la barra superior de la app, sin alarmas o vibraciones) permite al alumno asimilar el resultado con tranquilidad, protegiendo su bienestar.'
	},
	{
		id: 45,
		part: 3,
		type: 'slider',
		title: 'Reto 45: Mensajes de Logro Intrusivos',
		concept: 'Eviten interrupciones cognitivas con notificaciones de recompensas secundarias.',
		scenario: "En medio de una sesión síncrona con el docente, la app te interrumpe a pantalla completa con animaciones ruidosas de fuegos artificiales y trompetas: '¡Felicidades! Has completado tu racha semanal' (intensidad 5). Calibra la intensidad del notificador.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Icono discreto en cabecera',
		maxLabel: 'Fuegos artificiales intrusivos',
		giochiFeedback: 'Las recompensas secundarias no deben interferir con el canal de atención síncrono. Bajar al nivel 1 (icono estático en cabecera o guardado directo en la bitácora) permite al alumno seguir la clase sin distracciones visuales o ruidos molestos.'
	},
	{
		id: 46,
		part: 3,
		type: 'slider',
		title: 'Reto 46: Penalización Parpadeante',
		concept: 'Disminuyan el ruido visual y el lenguaje punitivo en la pérdida de recursos.',
		scenario: "Al cometer un error en el simulador de inversiones, el saldo de tu cuenta se vuelve rojo parpadeante con el mensaje: '¡PUNTOS PERDIDOS PARA SIEMPRE POR INVERSIÓN ERRÓNEA!' (intensidad 5). Calibra la saliencia del notificador.",
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Aviso de balance en amarillo',
		maxLabel: 'Rojo parpadeante de pérdida',
		giochiFeedback: 'Los parpadeos rojos y textos punitivos disparan la aversión a la pérdida, induciendo parálisis o toma de riesgos irracionales. Bajar la intensidad a nivel 2 (aviso en tono neutro detallando la pérdida) facilita una corrección analítica.'
	},
	{
		id: 47,
		part: 3,
		type: 'slider',
		title: 'Reto 47: La Exposición Social',
		concept: 'Eviten el escarnio público y la humillación social como disparadores de urgencia.',
		scenario: 'En el tablero de tareas del grupo, el estudiante que se retrasa aparece con un icono de tortuga llorando junto a su nombre para presionar su entrega (intensidad 5). Calibra este indicador social.',
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Barra de estado neutra',
		maxLabel: 'Escarnio social público',
		giochiFeedback: 'La presión social negativa y la humillación destruyen la cohesión del equipo y desmotivan al alumno rezagado. Una barra de estado neutra a nivel 1 indica el avance del proyecto de forma constructiva, sin etiquetas personales.'
	},
	{
		id: 48,
		part: 3,
		type: 'slider',
		title: 'Reto 48: Recordatorio de Racha Redundante',
		concept: 'Eviten el acoso de notificaciones push vibratorias recurrentes.',
		scenario: "La app te envía notificaciones push vibratorias cada 30 minutos a partir de las 6:00 PM: '¡No pierdas tu racha, ingresa ya!' (intensidad 5). Modera la frecuencia y el estímulo táctil.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Un solo aviso al final del día',
		maxLabel: 'Spam vibratorio repetitivo',
		giochiFeedback: 'La insistencia constante por encima del umbral de atención se convierte en hostigamiento (nagging). Calibrar al nivel 1 (un único recordatorio diario opcional y silencioso) respeta el tiempo y el espacio del estudiante.'
	},
	{
		id: 49,
		part: 3,
		type: 'slider',
		title: 'Reto 49: El Buzzer de Respuestas',
		concept: 'Minimizan la retroalimentación sonora intrusiva en entornos grupales.',
		scenario: 'Al responder una pregunta en la trivia interactiva en clase, el botón parpadea en verde y emite un sonido alegre muy fuerte que interrumpe la explicación del docente (intensidad 5). Calibra el volumen del notificador.',
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Vibración sutil sin sonido',
		maxLabel: 'Campanadas fuertes en vivo',
		giochiFeedback: 'En clases colectivas presenciales o síncronas, el ruido auditivo individual sabotea el ambiente de aprendizaje general. Calibrar al nivel 2 (vibración háptica o destello visual sutil, sin sonido) respeta el entorno acústico común.'
	},
	{
		id: 50,
		part: 3,
		type: 'slider',
		title: "Reto 50: Mensaje de 'Desafío Cooperativo' Urgente",
		concept: 'Protejan la atención profunda (deep work) bloqueando interrupciones secundarias.',
		scenario: "Mientras estás haciendo un quiz individual de física, una alerta gigante con luces amarillas parpadeantes cubre tu pantalla: '¡DESAFÍO COOPERATIVO DISPONIBLE! Únete a tu grupo de inmediato' (intensidad 5). Calibra la intrusión.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Alerta pasiva en cabecera',
		maxLabel: 'Interrupción de pantalla completa',
		giochiFeedback: 'Interrumpir una tarea de alta concentración con invitaciones a otras actividades rompe el estado de flujo (flow state). La invitación debe encolarse o mostrarse como un aviso pasivo discreto a nivel 1 para cuando el estudiante termine.'
	},
	{
		id: 51,
		part: 3,
		type: 'slider',
		title: 'Reto 51: El Timbre Metrónomo',
		concept: 'Eliminen estímulos continuos de presión temporal para tareas de alta carga de creación.',
		scenario: "Durante una redacción literaria de 15 minutos, el procesador de textos digital hace sonar un 'clic' de metrónomo cada segundo y parpadea el borde de la pantalla en amarillo para que no dejes de escribir (intensidad 5). Calibra la presión temporal.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Pantalla limpia sin estímulos',
		maxLabel: 'Metrónomo visual y sonoro',
		giochiFeedback: 'La estimulación auditiva repetitiva y el parpadeo constante agotan el lóbulo frontal. Un entorno libre de ruidos y distracciones a nivel 1 es vital para tareas creativas y analíticas complejas.'
	},
	{
		id: 52,
		part: 3,
		type: 'slider',
		title: "Reto 52: Alerta de 'Tutoría Programada'",
		concept: 'Calibren pre-avisos de calendario sin forzar interacciones invasivas.',
		scenario: 'Una hora antes de tu tutoría, la app hace vibrar tu celular continuamente durante 10 segundos y muestra una ventana emergente persistente que no puedes cerrar sin responder una encuesta (intensidad 5). Calibra el pre-aviso.',
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Notificación de calendario sutil',
		maxLabel: 'Bloqueo con encuesta obligatoria',
		giochiFeedback: 'Los avisos de eventos agendados deben ser informativos y fáciles de descartar. Forzar encuestas u obstruir la pantalla a nivel 5 eleva el enojo del estudiante. Bajar la intensidad a 2 (notificación estándar) cumple el objetivo de forma amigable.'
	},
	{
		id: 53,
		part: 3,
		type: 'slider',
		title: "Reto 53: Notificador de 'Compañero Conectado'",
		concept: 'Eviten el spam de presencia social no solicitada.',
		scenario: "Cada vez que un compañero de tu clase virtual inicia sesión, se reproduce un sonido de campana de viento y aparece un banner animado en la esquina superior derecha: '¡Pedro se ha unido a estudiar!' (intensidad 5). Calibra el notificador.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Indicador de punto verde estático',
		maxLabel: 'Banner animado con campanas',
		giochiFeedback: 'La presencia social pasiva no justifica romper el foco del alumno con ruidos y banners. Calibrar al nivel 1 (un punto verde estático junto al nombre del compañero en la barra lateral) ofrece la información de forma no intrusiva.'
	},
	{
		id: 54,
		part: 3,
		type: 'slider',
		title: 'Reto 54: El Banner de Medallas Recibidas',
		concept: 'Calibren la retroalimentación festiva para proteger el ritmo de estudio.',
		scenario: "Tras responder correctamente 3 quices seguidos, la app bloquea tu teclado por 3 segundos y reproduce un video en bucle de un trofeo giratorio con música festiva a alto volumen: '¡ERES EL REY DE LA RACHA!' (intensidad 5). Calibra la intensidad.",
		initialIntensity: 5,
		correctIntensity: 1,
		minLabel: 'Notificación sutil en barra',
		maxLabel: 'Bloqueo con video y fanfarria',
		giochiFeedback: 'Los bloqueos de control y la música fuerte agotan rápidamente al estudiante. Bajar a nivel 1 (una pequeña tarjeta visual silenciosa y fluida en la esquina) celebra el progreso sin interrumpir el ritmo de trabajo.'
	},
	{
		id: 55,
		part: 3,
		type: 'slider',
		title: 'Reto 55: El Globo de Alertas Gigante',
		concept: 'Moderen disparadores visuales permanentes en iconos de aplicación.',
		scenario: 'El icono de la app de tu celular muestra un globo rojo de notificaciones gigante que parpadea y tiene un número de dos dígitos de alertas acumuladas, causándote molestia cada vez que abres tu teléfono (intensidad 5). Calibra el globo.',
		initialIntensity: 5,
		correctIntensity: 2,
		minLabel: 'Globo sutil sin números',
		maxLabel: 'Globo parpadeante de dos dígitos',
		giochiFeedback: 'Los globos con contadores rojos de dos dígitos aumentan el estrés y la evitación del canal a largo plazo. Calibrar a nivel 2 (un punto de novedad pequeño, silencioso y sin números) invita al ingreso voluntario sin disparar ansiedad.'
	}
];
