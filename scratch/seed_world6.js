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

const world6Data = {
  id: 6,
  title: 'Misión 6: Psicología de la toma de decisión y la toma de acción',
  order_index: 6,
  narrative_place: 'El Laberinto Cognitivo',
  narrative_mentor: 'Sara Arbeláez',
  narrative_objective: 'Aprender cómo operan los sesgos cognitivos, diseñar decisiones significativas y estructurar la autonomía.',
  narrative_intro: [
    {
      "text": "Bienvenidos al Laberinto Cognitivo, Agentes. Este lugar representa los complejos e intrincados senderos que recorre la mente humana al momento de tomar decisiones.",
      "character": "Sara Arbelaez",
      "locationKey": "maze"
    },
    {
      "text": "Al diseñar, solemos caer en la ilusión de que las personas son seres lógicos y racionales que siempre elegirán la opción de estudio óptima. Pero la realidad es que decidimos influenciados por sesgos cognitivos y atajos mentales.",
      "character": "Sara Arbelaez"
    },
    {
      "text": "Y no olvidemos la estructura, Sara. La mente no decide en el vacío. Las decisiones son moldeadas de forma directa por cómo organizamos el entorno de información y por las reglas de juego vigentes.",
      "character": "John Wilkins"
    },
    {
      "text": "Si modificamos la visibilidad de las opciones o el costo operativo de una acción, cambiaremos de inmediato la ruta que el estudiante decidirá transitar.",
      "character": "John Wilkins"
    },
    {
      "text": "Exactamente, John. Por eso, para construir sistemas que apoyen genuinamente la autonomía, debemos aprender a estructurar decisiones que tengan valor, consecuencias y significado real.",
      "character": "Sara Arbelaez"
    }
  ],
  narrative_outro: [
    {
      "text": "¡Fantástico trabajo, Agente! Has logrado descifrar las bifurcaciones de la mente y comprender la psicología detrás de cada acción en el laberinto.",
      "character": "Sara Arbelaez",
      "locationKey": "maze"
    },
    {
      "text": "Ahora comprendes que las reglas no solo restringen, sino que habilitan decisiones significativas. Diseñar la información es construir la brújula de la acción.",
      "character": "John Wilkins"
    },
    {
      "text": "Recuerda siempre: el diseño de la autonomía no consiste en dar opciones infinitas, sino en estructurar alternativas con significado. ¡Nos vemos en la próxima misión de la OMIE!",
      "character": "Sara Arbelaez"
    }
  ],
  workshop_modules: {
    "slides": [
      {"id": "welcome", "type": "onboarding", "title": "Bienvenida y Reglas"},
      {"id": "phase1", "type": "actividad", "title": "Fase 1: Economía Conductual"},
      {"id": "phase2", "type": "actividad", "title": "Fase 2: Diseño de Juegos"},
      {"id": "phase3", "type": "actividad", "title": "Fase 3: Decisiones en Educación"},
      {"id": "roster", "type": "roster", "title": "Consenso y Cierre"}
    ]
  },
  training_modules: {
    "title": "Calibrador de Decisiones e Incertidumbre",
    "description": "Evalúa y califica tu comprensión sobre cómo influyen los sesgos cognitivos, las elecciones significativas y la autonomía.",
    "questions": [
      {
        "id": "q1",
        "correct": "B",
        "options": [
          "Falacia del Costo Hundido",
          "Heurística de Disponibilidad",
          "Sesgo del Presente",
          "Efecto de Dotación"
        ],
        "question": "¿Qué heurística o sesgo cognitivo está distorsionando su estimación de riesgo?",
        "scenario": "Un estudiante lee en un foro estudiantil que el último examen de matemáticas fue 'imposible de pasar'. Aunque ha estudiado y tiene buenas notas, asume de inmediato que reprobará y entra en pánico.",
        "explanation": "La heurística de disponibilidad hace que la mente estime la probabilidad de un suceso según la facilidad con la que recupera de la memoria un ejemplo vívido o reciente (el comentario alarmante del foro), ignorando su propio historial de notas y preparación real."
      },
      {
        "id": "q2",
        "correct": "B",
        "options": [
          "Opción Dominante",
          "Señuelo (Decoy)",
          "Elección Ciega",
          "Agencia Estética"
        ],
        "question": "¿Qué rol juega la Opción B en esta arquitectura de decisión?",
        "scenario": "Un docente diseía tres opciones de material de estudio para un tema: Opción A (leer 10 páginas), Opción B (leer 10 páginas y escribir un ensayo de 5 páginas) y Opción C (leer un resumen ejecutivo de 8 páginas). La presencia de la Opción B hace que los alumnos consideren la Opción A como sumamente razonable y atractiva.",
        "explanation": "El 'señuelo' (Opción B) es una alternativa deliberadamente asimétrica y de mayor costo que sirve únicamente para desviar la comparación y hacer que la opción preferida por el diseñador (Opción A) parezca sumamente valiosa y de bajo costo en comparación."
      },
      {
        "id": "q3",
        "correct": "B",
        "options": [
          "Descuento Hiperbólico",
          "Aversión a la Pérdida (Loss Aversion)",
          "Ilusión de Control",
          "Falacia de la Conjunción"
        ],
        "question": "¿Qué principio de la economía conductual estás explotando para modificar la urgencia de entrega?",
        "scenario": "Si cambias las reglas de una actividad de modo que el estudiante inicie con 50 puntos y se le descuenten puntos por fallas, en lugar de iniciar en 0 e ir acumulándolos por aciertos...",
        "explanation": "La aversión a la pérdida describe la tendencia psicológica a sentir el dolor de perder algo (puntos ya asignados) aproximadamente el doble de fuerte que el placer de ganar ese mismo recurso desde cero."
      },
      {
        "id": "q4",
        "correct": "A",
        "options": [
          "Falacia del Costo Hundido",
          "Sesgo de Representatividad",
          "Sesgo del Status Quo",
          "Error de Atribución Fundamental"
        ],
        "question": "¿Qué sesgo cognitivo presenta el alumno al negarse a reiniciar su proyecto?",
        "scenario": "Un estudiante ha invertido 20 horas en escribir un proyecto escolar utilizando un enfoque metodológico incorrecto. Aunque el docente le demuestra que es mejor empezar de cero con otra estructura para asegurar la nota, el alumno insiste en continuar con su escrito inicial argumentando: 'Ya le he dedicado demasiado tiempo a esto para botarlo'.",
        "explanation": "La falacia del costo hundido ocurre cuando insistimos en continuar una inversión o conducta debido a los recursos ya gastados (tiempo, esfuerzo, dinero), a pesar de que la evidencia demuestra que el resultado futuro será negativo si no cambiamos de rumbo."
      },
      {
        "id": "q5",
        "correct": "B",
        "options": [
          "Sesgo de Anclaje",
          "Sesgo del Presente (Present Bias)",
          "Efecto de Dotación",
          "Ilusión de Control"
        ],
        "question": "¿Qué sesgo explica esta inconsistencia en la valoración del tiempo?",
        "scenario": "Un estudiante prefiere jugar videojuegos hoy (recompensa inmediata) en lugar de estudiar para el examen de la próxima semana (recompensa diferida mayor), aun sabiendo que esto afectará gravemente su rendimiento final.",
        "explanation": "El sesgo del presente describe la tendencia de los humanos a sobrevalorar drásticamente las recompensas inmediatas frente a las futuras, mostrando un descuento hiperbólico de la utilidad del tiempo a medida que la recompensa se aleja en el calendario."
      },
      {
        "id": "q6",
        "correct": "B",
        "options": [
          "Efecto Enmarque",
          "Ilusión de Control",
          "Sesgo de Confirmación",
          "Sesgo de Status Quo"
        ],
        "question": "¿Qué sesgo explica la mayor confianza de los estudiantes al elegir manualmente su sobre de preguntas?",
        "scenario": "En un examen digital, permites que los estudiantes elijan manualmente de una pila virtual qué sobre de preguntas abrir, en lugar de que el sistema las asigne al azar. Los estudiantes reportan sentirse más seguros y confiados, a pesar de que todas las preguntas tienen la misma dificultad matemática.",
        "explanation": "La ilusión de control es la tendencia humana a creer que sus acciones personales (como elegir físicamente una tarjeta o lanzar un dado personal) influyen o determinan los resultados de eventos puramente azarosos o con probabilidades fijas preestablecidas."
      },
      {
        "id": "q7",
        "correct": "B",
        "options": [
          "Elección Significativa",
          "Elección Ciega",
          "Elección Falsa",
          "Estrategia Dominante"
        ],
        "question": "¿Qué tipo de elección es esta que conduce a una quiebra inesperada sin pistas previas?",
        "scenario": "En un juego serio sobre toma de decisiones de negocios, se le presenta al estudiante un dilema: 'Elige entre la Estrategia Alfa o la Estrategia Beta', sin proporcionarle ningún reporte financiero previo, historial o pista contextual. Al seleccionar Alfa, el simulador le arroja un mensaje de quiebra permanente.",
        "explanation": "Una elección es ciega cuando el usuario se ve obligado a elegir entre alternativas sin información previa para ponderar sus riesgos y consecuencias. Si además genera una penalización severa y permanente (quiebra), se considera un grave fallo de diseño."
      },
      {
        "id": "q8",
        "correct": "B",
        "options": [
          "Agencia Cosmética",
          "Estrategia Dominante",
          "Elección con Daño Colateral",
          "Elección Significativa"
        ],
        "question": "¿Cómo se define técnicamente esta ruta que todos los estudiantes terminan eligiendo?",
        "scenario": "Estás analizando el simulador educativo del curso y notas que todos los estudiantes eligen exactamente la misma ruta de especialización final porque es la única que otorga un multiplicador de puntos del 200% sin tener penalizaciones asociadas.",
        "explanation": "Una estrategia dominante es una alternativa dentro de un sistema que resulta superior a todas las demás en cualquier escenario, anulando el dilema de elegir y destruyendo el interés estratégico de la toma de decisiones."
      },
      {
        "id": "q9",
        "correct": "B",
        "options": [
          "Elección Ciega",
          "Elección Significativa",
          "Elección Falsa",
          "Elección Cosmética"
        ],
        "question": "¿Qué tipo de elección se presenta al decidir entre el escudo pesado o la capa ligera con sus respectivos balances?",
        "scenario": "Un estudiante debe decidir entre comprar un escudo pesado (+50 de defensa, -20% de velocidad) o una capa ligera (+10 de defensa, +30% de velocidad) para su siguiente combate en un juego serio de rol.",
        "explanation": "Es una elección significativa porque cuenta con información dable (los atributos de defensa/velocidad), tiene un impacto claro en el combate posterior y presenta un trade-off o costo de oportunidad equilibrado (ganar defensa implica sacrificar velocidad)."
      },
      {
        "id": "q10",
        "correct": "B",
        "options": [
          "Elección Significativa",
          "Elección Decorativa (Agencia Cosmética)",
          "Elección Dominante",
          "Elección Falsa"
        ],
        "question": "¿Qué tipo de elección representa la personalización del color de fondo y el escudo del grupo?",
        "scenario": "Si permites que tus estudiantes seleccionen el color de fondo y el escudo heráldico de su grupo de trabajo en la plataforma digital, sabiendo que esto no modifica las reglas de entrega, la dificultad ni las calificaciones del proyecto final...",
        "explanation": "Las elecciones decorativas o cosméticas permiten al usuario expresar su identidad y autoexpresión sin alterar el estado operativo, las mecánicas ni las reglas matemáticas del sistema. Son útiles para el driver de identidad pero no afectan la dificultad."
      },
      {
        "id": "q11",
        "correct": "B",
        "options": [
          "Elección Ciega",
          "Elección Falsa (Ilusión de Agencia)",
          "Estrategia Dominante",
          "Elección Significativa"
        ],
        "question": "¿Cómo se clasifica la dinámica que fuerza al jugador a ir a las ruinas sin importar qué elija?",
        "scenario": "En un diálogo interactivo de historia, se le pregunta al jugador: '¿Quieres investigar las ruinas o cruzar el puente?'. Si responde 'cruzar el puente', el acompañante le dice: '¡Es muy peligroso! Vayamos a las ruinas'. En ambos casos, el sistema los carga en las ruinas.",
        "explanation": "Las elecciones falsas o ilusiones de agencia ocurren cuando el sistema ofrece múltiples alternativas en pantalla pero las conduce de forma invisible e inevitable al mismo resultado final. Sirven para dar tono narrativo o de rol sin multiplicar el código."
      },
      {
        "id": "q12",
        "correct": "B",
        "options": [
          "Falacia del Costo Hundido",
          "Paradoja de la Elección (Sobrecarga Cognitiva)",
          "Sesgo del Status Quo",
          "Aversión a la Pérdida"
        ],
        "question": "¿Qué fenómeno del diseño de decisiones explica esta parálisis de los estudiantes ante 60 temas?",
        "scenario": "Un docente decide dar total autonomía en su curso de ciencias y les ofrece una lista de 60 temas posibles para que cada estudiante elija uno de forma independiente para su exposición. Al final, nota retrasos masivos en la elección, alta ansiedad y quejas constantes.",
        "explanation": "La paradoja de la elección o sobrecarga cognitiva demuestra que, aunque valoramos la libertad, un número excesivo de opciones satura nuestros recursos de procesamiento cognitivo, generando parálisis por análisis, fatiga de decisión y frustración ante el costo de oportunidad."
      },
      {
        "id": "q13",
        "correct": "C",
        "options": [
          "Forzar una única lectura obligatoria obligando a todos a resumirla en PDF.",
          "Dar libertad de leer cualquier libro en el mundo que trate de historia y calificar con rúbricas abiertas.",
          "Seleccionar 3 lecturas académicas equivalentes y permitir al estudiante elegir cuál de las 3 leer y en qué formato presentar su reporte.",
          "Ofrecer lecturas sorpresa aleatorias cada semana que se eligen tirando un dado en clase."
        ],
        "question": "¿Cuál de las siguientes estrategias docentes representa la mejor implementación de 'autonomía estructurada'?",
        "scenario": "Para incentivar el compromiso con las lecturas, un docente evalúa alternativas de autonomía estructurada en el aula.",
        "explanation": "La autonomía estructurada limita el número de opciones (reduciendo la sobrecarga cognitiva) pero mantiene abiertas alternativas con significado y equivalentes pedagógicamente, otorgando una sensación de agencia y control sin desestructurar la clase."
      },
      {
        "id": "q14",
        "correct": "B",
        "options": [
          "Otorgar una única calificación final al entregar el proyecto final de semestre, sin posibilidad de corrección.",
          "Evaluar los borradores semanales como entregas formativas con feedback que el estudiante puede corregir y volver a entregar para mejorar su nota acumulada.",
          "Aplicar penalizaciones de puntos exponenciales a todo estudiante que entregue un borrador incomple.",
          "Aprobar a todos los estudiantes de forma automática sin importar si el proyecto tiene fallos."
        ],
        "question": "¿Qué enfoque de evaluación modela el fallo del estudiante de manera constructiva y promueve la Maestría?",
        "scenario": "El docente busca definir un enfoque de evaluación formativa que permita al alumno aprender a través del fallo sin frustración.",
        "explanation": "Modelar el fallo como parte del ciclo interactivo (Smart Failure) requiere que los errores sean reversibles y tengan feedback claro. Permitir la iteración y entrega de borradores reduce la ansiedad y el miedo al error, incentivando la búsqueda de la maestría."
      },
      {
        "id": "q15",
        "correct": "B",
        "options": [
          "Recompensas Aleatorias",
          "Sinergia / Combos",
          "Decoy Effect",
          "Aversión a la Pérdida"
        ],
        "question": "¿Qué principio de diseño estás aplicando al unificar y bonificar las tareas integradas?",
        "scenario": "Permites que tus estudiantes fusionen la entrega de sus tareas de Geografía e Historia en un único proyecto integrado de 'Infografía Geohistórica', el cual evalúa los objetivos de ambas materias de forma simultánea y otorga un bono extra de puntos de progreso.",
        "explanation": "Diseñar sinergias o 'combos' de entregas permite a los alumnos planificar y conectar conocimientos de forma estratégica, optimizando sus esfuerzos al unificar tareas aisladas en entregables integrales más significativos y de alto valor percibido."
      }
    ]
  },
  design_modules: {
    "title": "Canvas de Decisiones e Incertidumbre BEM",
    "description": "Estructura un lienzo de doble columna para balancear estímulos conductuales de la mente con estrategias lúdicas de diseño de juego.",
    "fields": [
      {
        "label": "Decisiones Conductuales",
        "driver": "conductuales",
        "placeholder": "Idea para aplicar la heurística conductual en clase..."
      },
      {
        "label": "Estrategias de Diseño de Juegos",
        "driver": "juegos",
        "placeholder": "Idea para aplicar la estrategia lúdica en clase..."
      }
    ]
  },
  wiki_modules: [
    {
      "id": "doc_decisions",
      "url": "/learn_resources/resources/world6/diseno_mundo6_detras_de_camaras.pdf",
      "cost": 0,
      "desc": "Documento técnico sobre el diseño del detrás de cámaras del Mundo 6, analizando heurísticas, decisiones en juego y dilemas pedagógicos.",
      "type": "pdf",
      "title": "Detrás de cámaras: Toma de Decisiones y Autonomía"
    },
    {
      "id": "doc_summary6",
      "url": "/learn_resources/resources/world6/resumen_teorico_mundo6.pdf",
      "cost": 0,
      "desc": "Guía conceptual resumida sobre la psicología de toma de decisiones, sesgos cognitivos, elecciones lúdicas y la paradoja de la elección.",
      "type": "pdf",
      "title": "Resumen conceptual: Heurísticas, Sesgos y Autonomía Estructurada"
    },
    {
      "id": "paper_salen",
      "url": "/learn_resources/resources/world6/Salen, Katie & Zimmerman, Eric - Rules of Play: Game Design Fundamentals (2004).pdf",
      "cost": 10,
      "desc": "Capítulos esenciales sobre el diseño de elecciones significativas (meaningful play), macro y micro-decisiones y la anatomía de la acción.",
      "type": "pdf",
      "title": "Rules of Play: Game Design Fundamentals"
    },
    {
      "id": "paper_mullins",
      "url": "/learn_resources/resources/world6/Mullins, Jeffrey K. & Sabherwal, Rajiv - Beyond Enjoyment: A Cognitive-Emotional Perspective of Gamification (2018).pdf",
      "cost": 10,
      "desc": "Estudio sobre cómo balancear tensiones cognitivo-emocionales en experiencias gamificadas para mejorar el rendimiento sistémico.",
      "type": "pdf",
      "title": "Beyond Enjoyment: A Cognitive-Emotional Perspective of Gamification"
    },
    {
      "id": "paper_sansone",
      "url": "/learn_resources/resources/world6/Sansone, Carol & Harackiewicz, Judith M. - Intrinsic and Extrinsic Motivation: The Search for Optimal Motivation and Performance (2000).pdf",
      "cost": 15,
      "desc": "Contiene los hallazgos de Lepper & Henderlong sobre cómo estructurar la autonomía para motivar de manera intrínseca sin perder la estructura.",
      "type": "pdf",
      "title": "Intrinsic and Extrinsic Motivation"
    },
    {
      "id": "paper_renner",
      "url": "/learn_resources/resources/world6/Renner, Elke - Applied Behavioural Economics Lecture 2 and 3: Heuristics and Biases in Judgement and Decision making (2015).pdf",
      "cost": 15,
      "desc": "Recopila y explica las heurísticas y sesgos de Kahneman & Tversky aplicados a las predicciones y juicios del agente humano bajo riesgo.",
      "type": "pdf",
      "title": "Applied Behavioural Economics: Heuristics and Biases"
    }
  ]
};

async function run() {
  console.log('Inserting World 6 into course_worlds...');
  const { data: insertedWorld, error: insertError } = await supabase
    .from('course_worlds')
    .upsert(world6Data)
    .select();

  if (insertError) {
    console.error('Error inserting World 6:', insertError);
    return;
  }
  console.log('World 6 inserted/updated successfully:', insertedWorld);

  console.log('Activating World 6 in DEMO-2026 course instance...');
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
  if (!unlocked.includes(6)) {
    unlocked.push(6);
    // Sort numeric worlds ascending
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
