import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf-8');
let url = '';
let key = '';
for (const line of envText.split('\n')) {
  if (line.startsWith('PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
}

const supabase = createClient(url, key);

const world7Data = {
  id: 7,
  title: 'Misión 7: Evaluación e Incentivos',
  order_index: 7,
  narrative_place: 'El Laberinto de la Heurística',
  narrative_mentor: 'Emma Wagner',
  narrative_objective: 'Comprender cómo los sistemas de evaluación en juegos configuran los incentivos conductuales y la motivación intrínseca.',
  narrative_intro: [
    {
      "text": "Bienvenido de vuelta al Laberinto, Agente. Hoy no exploraremos sesgos ni atajos mentales. Hoy vamos a hablar de cómo medimos el progreso. Y para eso, he traído a una experta muy especial.",
      "character": "Sara Arbelaez",
      "locationKey": "maze"
    },
    {
      "text": "¡Hola! Soy Emma. Trankil, sí soy una niña. Pero cuando se trata de evaluación y sistemas de incentivos, tengo más precisión que un reloj suizo. En mi país, aprender a evaluar es un arte tan riguroso como construir un motor.",
      "character": "Emma Wagner"
    },
    {
      "text": "Pero ojo: el rigor no está reñido con el juego. Yo creo en el Kindheitsstaunen — ese asombro infantil que hace que mirar una tabla de puntajes se sienta como abrir un regalo. Sin esa chispa, la evaluación es solo burocracia.",
      "character": "Emma Wagner"
    },
    {
      "text": "Emma ha sido mi mejor estudiante, y no lo digo a la ligera. Los juegos parecen relojería sin alma a veces, pero ella entiende que cada engranaje — cada puntaje, cada rúbrica, cada feedback — late con intención pedagógica.",
      "character": "John Wilkins"
    },
    {
      "text": "Vamos a diseccionar cómo evalúan los juegos. Verás que no hay una sola forma de hacerlo, y que cada método genera incentivos distintos… algunos muy perversos. Tu misión: aprender a leer los puntajes como yo leo las partituras de Bach. ¡Empezamos!",
      "character": "Emma Wagner"
    }
  ],
  narrative_outro: [
    {
      "text": "¡Bravo, Agente! Has aprendido a ver más allá de los números. Ahora sabes que toda evaluación es también un mensaje, y que los incentivos hablan más fuerte que las instrucciones.",
      "character": "Emma Wagner",
      "locationKey": "maze"
    },
    {
      "text": "Impresionante. Has entendido que la precisión sin propósito es solo ruido, y que el asombro sin método es solo caos. Emma, le has enseñado bien.",
      "character": "John Wilkins"
    },
    {
      "text": "Recuerda siempre: cuando diseñes un sistema de evaluación, pregúntate no solo qué mides, sino qué incentivación sin querer. El verdadero arte está en alinear ambos. ¡Bis bald, Agente!",
      "character": "Emma Wagner"
    }
  ],
  workshop_modules: {
    "slides": [
      {"id": "welcome", "type": "onboarding", "title": "Bienvenida y Conceptos"},
      {"id": "phase1", "type": "actividad", "title": "Fase 1: Disparador de Acción"},
      {"id": "phase2", "type": "actividad", "title": "Fase 2: Disparadores de Meta"},
      {"id": "phase3", "type": "actividad", "title": "Fase 3: Disparadores Farmeables"},
      {"id": "roster", "type": "roster", "title": "Cierre y Podio de la Clase"}
    ]
  },
  training_modules: {
    "title": "Calibrador de Evaluación e Incentivos",
    "description": "Prueba tu habilidad de diagnóstico analizando sistemas de evaluación de cursos e identificando sus tipos de disparador, consecuencias e incentivos perversos.",
    "questions": [
      {
        "id": "q1",
        "correct": "B",
        "options": [
          "Rúbrica multicanal",
          "Criterios dinámicos",
          "Algoritmo matemático",
          "Dashboard de información"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "El docente revisa el portafolio del semestre y asigna una nota del 1 al 10 basándose en su impresión general del esfuerzo y la creatividad del estudiante, sin usar ningún instrumento predefinido.",
        "explanation": "No hay criterios predefinidos ni canales separados. El docente asigna la nota según su juicio subjetivo del momento. Eso es criterios dinámicos."
      },
      {
        "id": "q2",
        "correct": "C",
        "options": [
          "Calificación directa",
          "Algoritmo matemático",
          "Rúbrica multicanal",
          "Efecto sistémico"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Al finalizar la exposición oral, el estudiante recibe una calificación única: Básico si tuvo problemas de comunicación, Intermedio si se expresó con claridad general, o Avanzado si dominó el tema y respondió preguntas del público.",
        "explanation": "Varios criterios (comunicación, claridad, dominio) se combinan en una sola calificación cualitativa de tres niveles. Es una rúbrica multicanal."
      },
      {
        "id": "q3",
        "correct": "B",
        "options": [
          "Dashboard de información",
          "Calificación directa",
          "Criterios dinámicos",
          "Rúbrica multicanal"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Cada vez que el estudiante completa un módulo, recibe 10 puntos fijos en su bandeja de logros, sin importar cuántos intentos haya necesitado ni el puntaje obtenido en las evaluaciones internas.",
        "explanation": "La recompensa es fija, estable y directa: 10 puntos por completar. No hay fórmula, subjetividad ni multicanalidad. Es calificación directa."
      },
      {
        "id": "q4",
        "correct": "D",
        "options": [
          "Calificación directa",
          "Algoritmo matemático",
          "Dashboard de información",
          "Efecto sistémico"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Si el estudiante acumula 5 participaciones de calidad en el foro, el sistema le desbloquea el rol de 'Moderador de Debate' con permisos especiales para gestionar hilos de discusión.",
        "explanation": "No se otorgan puntos ni notas. La consecuencia de la acción es un cambio en el sistema: el desbloqueo de un rol con nuevos permisos. Es un efecto sistémico."
      },
      {
        "id": "q5",
        "correct": "C",
        "options": [
          "Rúbrica multicanal",
          "Criterios dinámicos",
          "Algoritmo matemático",
          "Calificación directa"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Al responder correctamente una pregunta del quiz, el estudiante gana 10 puntos base. Si lleva 3 aciertos consecutivos, el puntaje se multiplica por 1.5. Si falla, pierde el multiplicador y gana 0 puntos en esa pregunta.",
        "explanation": "Hay una fórmula explícita con multiplicadores, condicionales y reinicio de racha. Es un algoritmo matemático que calcula el puntaje dinámicamente."
      },
      {
        "id": "q6",
        "correct": "B",
        "options": [
          "Efecto sistémico",
          "Dashboard de información",
          "Calificación directa",
          "Algoritmo matemático"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Tras completar la encuesta de clima del aula, el sistema muestra una gráfica de barras con la distribución de respuestas del grupo, sin asignar puntos ni consecuencias a ningún estudiante.",
        "explanation": "El sistema solo entrega datos estadísticos sin calificación ni cambio en el sistema. El estudiante debe interpretar la información. Es un dashboard de información."
      },
      {
        "id": "q7",
        "correct": "C",
        "options": [
          "Criterios dinámicos",
          "Dashboard de información",
          "Rúbrica multicanal",
          "Efecto sistémico"
        ],
        "question": "¿Qué sistema de evaluación describe este escenario?",
        "scenario": "Al terminar el proyecto en equipo, el docente asigna una nota de 0 a 100 evaluando: contenido (30 pts), organización (25 pts), creatividad (20 pts), fuentes (15 pts) y presentación (10 pts). La suma da la calificación final.",
        "explanation": "Aunque parece algorítmico, los puntajes por canal son fijos y se suman directamente. Pero al combinar múltiples canales cualitativos en una sola ecuación (con pesos arbitrarios), es una rúbrica multicanal que mezcla dimensiones distintas en una misma nota."
      },
      {
        "id": "q8",
        "correct": "A",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Híbrido"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Cada vez que el estudiante entrega un resumen de lectura, recibe un sello de 'Completado' en su bitácora de progreso.",
        "explanation": "El estudiante tiene control total sobre la acción (entregar el resumen) y la consecuencia es directa e inmediata. Es un disparador de acción."
      },
      {
        "id": "q9",
        "correct": "B",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Automático"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Si el promedio de la clase en el examen supera los 4.0, todos los estudiantes reciben un punto adicional en su nota final.",
        "explanation": "El resultado no depende del control individual de un estudiante, sino de una condición colectiva que puede o no cumplirse. El estudiante no tiene control directo sobre el promedio final. Es un disparador de meta."
      },
      {
        "id": "q10",
        "correct": "C",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Continuo"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Cada vez que el estudiante responde correctamente una pregunta en la trivia, acumula 5 puntos. Puede responder tantas veces como quiera.",
        "explanation": "La acción es repetible sin límite y cada instancia genera la misma consecuencia. El estudiante puede 'farmear' puntos respondiendo múltiples veces. Es farmeable."
      },
      {
        "id": "q11",
        "correct": "B",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Condicional"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Si el estudiante logra completar 3 niveles del simulador sin cometer errores, desbloquea el modo difícil.",
        "explanation": "La condición ('sin cometer errores') introduce incertidumbre. El estudiante no puede garantizar el resultado aunque intente la acción. Es un disparador de meta."
      },
      {
        "id": "q12",
        "correct": "A",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Pasivo"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Al hacer clic en el botón 'Entregar tarea', el sistema registra la hora de envío y confirma la recepción del archivo.",
        "explanation": "El estudiante controla completamente cuándo hacer clic. La consecuencia (registro y confirmación) es inmediata y predecible. Es un disparador de acción."
      },
      {
        "id": "q13",
        "correct": "C",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Social"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Cada comentario útil que el estudiante publica en el foro le otorga 2 puntos de participación. No hay límite de comentarios por día.",
        "explanation": "La acción se puede repetir sin restricción y cada repetición genera la misma recompensa. El diseño incentiva la acumulación por volumen. Es farmeable."
      },
      {
        "id": "q14",
        "correct": "B",
        "options": [
          "Acción",
          "Meta",
          "Farmeable",
          "Colaborativo"
        ],
        "question": "¿Qué tipo de disparador activa esta evaluación?",
        "scenario": "Si el equipo logra que todos sus miembros obtengan más de 8 puntos en el quiz individual, reciben una bonificación grupal.",
        "explanation": "El resultado depende del desempeño de todos los miembros del equipo, no del control de un solo estudiante. Hay incertidumbre sobre si la condición se cumplirá. Es un disparador de meta."
      },
      {
        "id": "q15",
        "correct": "B",
        "options": [
          "Subjetividad del evaluador",
          "Incentivo perverso por farming",
          "Falta de rúbrica",
          "Baja multicanalidad"
        ],
        "question": "¿Qué problema de diseño de evaluación ilustra este caso?",
        "scenario": "Un sistema otorga 10 puntos por cada ejercicio completado, sin límite. Los estudiantes descubren que pueden resolver ejercicios de kinder una y otra vez para acumular puntos sin esfuerzo.",
        "explanation": "Al no poner límite ni diferenciar por dificultad, el sistema incentiva la repetición de la tarea más fácil en lugar del aprendizaje real. Es un incentivo perverso por farming."
      },
      {
        "id": "q16",
        "correct": "A",
        "options": [
          "Sesgo del evaluador por criterios dinámicos",
          "Exceso de algoritmos",
          "Farming de puntos",
          "Dashboard innecesario"
        ],
        "question": "¿Qué problema de diseño de evaluación ilustra este caso?",
        "scenario": "El docente asigna la nota del proyecto basándose en 'lo que sintió' al leerlo, sin criterios explícitos. Dos estudiantes con trabajos similares reciben notas muy diferentes.",
        "explanation": "Sin rúbrica ni canales definidos, la evaluación depende del estado de ánimo y sesgos del evaluador. La falta de consistencia es el riesgo principal de los criterios dinámicos."
      },
      {
        "id": "q17",
        "correct": "A",
        "options": [
          "Gap evaluativo por mezcla de canales",
          "Falta de farming",
          "Exceso de objetividad",
          "Buen dashboard"
        ],
        "question": "¿Qué problema de diseño ilustra este caso?",
        "scenario": "Un examen combina en una sola nota: ortografía (0-10), conocimientos (0-50), creatividad (0-20) y asistencia (0-20). Un estudiante con ortografía pésima pero conocimiento excelente termina con la misma nota que uno con ortografía perfecta pero conocimiento básico.",
        "explanation": "Al sumar canales con distinta naturaleza (conocimiento vs ortografía vs asistencia) en una misma ecuación, se pierde información diagnóstica. No se sabe qué está midiendo realmente la nota. Es un gap evaluativo de rúbrica multicanal."
      },
      {
        "id": "q18",
        "correct": "A",
        "options": [
          "Retroalimentación informativa para la autorregulación",
          "Calificación sumativa",
          "Incentivo perverso",
          "Sistema de recompensas"
        ],
        "question": "¿Qué función cumple este dashboard?",
        "scenario": "Un juego muestra al jugador su puntaje actual, el puntaje del líder, el promedio del grupo y una gráfica de su progreso semanal. No hay recompensas asociadas a estos datos.",
        "explanation": "El dashboard entrega datos sin calificar ni recompensar. Su función es permitir que el estudiante analice su posición y ajuste su estrategia. Es retroalimentación pura para la autorregulación."
      },
      {
        "id": "q19",
        "correct": "A",
        "options": [
          "Cantidad sobre calidad",
          "Subjetividad del evaluador",
          "Gap multicanal",
          "Exceso de dashboard"
        ],
        "question": "¿Qué incentivo perverso genera este sistema?",
        "scenario": "Para ganar el trofeo semanal, el estudiante debe responder 50 preguntas. Sin importar si las respuestas son correctas o incorrectas, solo cuenta la cantidad.",
        "explanation": "Al premiar solo el volumen, el estudiante aprende a priorizar la velocidad sobre la comprensión. Responde rápido y sin pensar para acumular. El incentivo está desalineado del aprendizaje."
      },
      {
        "id": "q20",
        "correct": "A",
        "options": [
          "Cada canal conserva su información diagnóstica",
          "Es más fácil de calcular",
          "Elimina la subjetividad",
          "Genera más puntos"
        ],
        "question": "¿Qué ventaja tiene este diseño frente a una rúbrica multicanal que mezcle todo en una nota?",
        "scenario": "Un sistema de evaluación usa 6 canales separados: cada habilidad (sintaxis, lógica, creatividad, eficiencia, documentación, trabajo en equipo) genera su propio puntaje en un score board independiente.",
        "explanation": "Al mantener los canales separados, el estudiante y el docente pueden ver exactamente en qué habilidades hay fortalezas y debilidades. No se pierde información al promediar canales distintos."
      },
      {
        "id": "q21",
        "correct": "A",
        "options": [
          "Incentivo perverso que destruye la colaboración",
          "Buen uso de metas",
          "Dashboard efectivo",
          "Algoritmo justo"
        ],
        "question": "¿Qué problema de diseño revela este caso?",
        "scenario": "Un juego de aprendizaje otorga una insignia especial solo a los 3 estudiantes con más puntos al final del mes. Los estudiantes dejan de ayudarse entre sí para maximizar su propio puntaje individual.",
        "explanation": "La competencia por un recurso escaso (solo 3 insignias) transforma la dinámica social de colaboración a competencia. El sistema de evaluación está incentivando comportamiento contrario al objetivo pedagógico."
      }
    ]
  },
  design_modules: {
    "title": "Canvas de Diseñador de Sistemas de Evaluación",
    "description": "Diseña tus propios sistemas de evaluación con mecánicas de juego. Tu idea debe incluir un disparador y un criterio, y de forma opcional algoritmo, efecto sistémico y dashboard.",
    "fields": [
      {
        "label": "Disparador",
        "driver": "disparador",
        "placeholder": "Selecciona el disparador: Acción, Meta o Farmeable..."
      },
      {
        "label": "Criterio / Parámetro",
        "driver": "criterioParametro",
        "placeholder": "Describe qué se va a medir exactamente..."
      },
      {
        "label": "Algoritmo Matemático (Opcional)",
        "driver": "algoritmoMatematico",
        "placeholder": "Fórmula o lógica de puntuación..."
      },
      {
        "label": "Efecto Sistémico (Opcional)",
        "driver": "efectoSistemico",
        "placeholder": "¿Qué se desbloquea o cambia en el sistema?..."
      },
      {
        "label": "Dashboard de Información (Opcional)",
        "driver": "dashboardInformacion",
        "placeholder": "¿Qué datos se muestran para la autorregulación?..."
      }
    ]
  },
  wiki_modules: [
    {
      "id": "doc_design7",
      "url": "/learn_resources/resources/world7/diseno_mundo7_detras_de_camaras.pdf",
      "cost": 0,
      "desc": "Documento técnico sobre el diseño y la arquitectura pedagógica y lúdica completa del Mundo 7.",
      "type": "pdf",
      "title": "Detrás de cámaras: Evaluación e Incentivos"
    },
    {
      "id": "doc_summary7",
      "url": "/learn_resources/resources/world7/resumen_teorico_mundo7.pdf",
      "cost": 0,
      "desc": "Guía conceptual resumida sobre disparadores, sistemas de evaluación, incentivos perversos y BEM.",
      "type": "pdf",
      "title": "Resumen teórico: Sistemas de Evaluación e Incentivos"
    },
    {
      "id": "paper_mekler",
      "url": "/learn_resources/resources/world7/mekler_2017_gamification_elements.pdf",
      "cost": 15,
      "desc": "Investigación empírica que aísla los efectos de puntos, niveles y tablas de posiciones sobre la motivación y rendimiento.",
      "type": "pdf",
      "title": "Towards Understanding the Effects of Individual Gamification Elements"
    },
    {
      "id": "paper_lipnevich",
      "url": "/learn_resources/resources/world7/lipnevich_panadero_2021_feedback_models.pdf",
      "cost": 20,
      "desc": "Revisión exhaustiva de los principales modelos y teorías de feedback en educación y entornos digitales.",
      "type": "pdf",
      "title": "A Review of Feedback Models and Theories"
    },
    {
      "id": "paper_johnson",
      "url": "/learn_resources/resources/world7/johnson_2017_feedback_serious_games.pdf",
      "cost": 15,
      "desc": "Guía práctica sobre cómo estructurar mensajes de feedback efectivos que impulsen el aprendizaje y retención.",
      "type": "pdf",
      "title": "Designing Effective Feedback Messages in Serious Games"
    },
    {
      "id": "paper_harackiewicz",
      "url": "/learn_resources/resources/world7/harackiewicz_1979_reward_feedback.pdf",
      "cost": 20,
      "desc": "Estudio clásico sobre cómo las contingencias de recompensa y el tipo de feedback afectan la motivación intrínseca.",
      "type": "pdf",
      "title": "The Effects of Reward Contingency and Performance Feedback"
    }
  ]
};

async function run() {
  console.log('Inserting World 7 into course_worlds...');
  const { data: insertedWorld, error: insertError } = await supabase
    .from('course_worlds')
    .upsert(world7Data)
    .select();

  if (insertError) {
    console.error('Error inserting World 7:', insertError);
    return;
  }
  console.log('World 7 inserted/updated successfully:', insertedWorld);

  console.log('Activating World 7 in DEMO-2026 course instance...');
  const { data: instance, error: fetchError } = await supabase
    .from('course_instances')
    .select('unlocked_worlds')
    .eq('code', 'DEMO-2026')
    .single();

  if (fetchError) {
    console.error('Error fetching DEMO-2026 instance:', fetchError);
    return;
  }

  let unlocked = instance.unlocked_worlds || [];
  if (!unlocked.includes(7)) {
    unlocked.push(7);
    unlocked.sort((a, b) => a - b);
  }

  const { data: updatedInstance, error: updateError } = await supabase
    .from('course_instances')
    .update({ unlocked_worlds: unlocked })
    .eq('code', 'DEMO-2026')
    .select();

  if (updateError) {
    console.error('Error updating instance:', updateError);
    return;
  }
  console.log('DEMO-2026 instance updated successfully:', updatedInstance);
}

run();
