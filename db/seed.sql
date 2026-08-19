-- ==========================================================
-- BEM PLATFORM - SEED DATA
-- Extracted from Supabase Cloud (Project: bem)
-- Includes:
-- 1. Superuser facilitator
-- 2. Initial course instances (DEMO-2026, UNIANDES-26-1, OASIS)
-- 3. All 7 BEM Course Worlds (Full narrative, quizes, canvases, wiki)
-- ==========================================================

-- 1. SUPER USER
INSERT INTO public.super_user (email, password, created_at)
VALUES 
    ('javier@f2p.co', 'f2pRocks!', '2026-06-01 11:07:08.557812+00')
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password;

-- 2. COURSE INSTANCES
INSERT INTO public.course_instances (code, unlocked_worlds, current_workshop_state, created_at)
VALUES 
    ('DEMO-2026', '[1, 2, 3, 4, 5, 6, 7]'::jsonb, '{"mode": "feedback", "world_id": 7, "isPaused": false, "slide_index": 4, "visitedSlideIds": [1, 2, 3, 4], "activeCriteriaIds": ["evaluacion_general", "motivacion", "trampeable"], "isSubmissionEnabled": true}'::jsonb, '2026-06-01 11:07:08.557812+00'),
    ('UNIANDES-26-1', '[1, 2, 3, 4, 5, 6, 7]'::jsonb, '{"mode": "actividad", "world_id": 2, "card_order": [10, 8, 7, 2, 3, 9, 11, 5, 1, 6, 4, 0], "round_index": 0}'::jsonb, '2026-06-01 22:38:25.30211+00'),
    ('OASIS', '[1, 5]'::jsonb, '{"mode": "actividad", "world_id": 1, "slide_index": 5}'::jsonb, '2026-06-02 20:20:54.466288+00'),
    ('TEST', '[1, 3, 6, 7]'::jsonb, '{"mode": "actividad", "world_id": 1, "slide_index": 0}'::jsonb, '2026-08-19 12:00:00.000000+00'),
    ('SERGIO26', '[1]'::jsonb, '{"mode": "actividad", "world_id": 1, "slide_index": 0}'::jsonb, '2026-08-19 12:59:00.000000+00')
ON CONFLICT (code) DO UPDATE SET 
    unlocked_worlds = EXCLUDED.unlocked_worlds,
    current_workshop_state = EXCLUDED.current_workshop_state;

-- 3. COURSE WORLDS (MUNDOS 1 A 7)

-- WORLD 1
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    1, 1,
    'Misión 1: Iniciación en la OMIE y los 7 Drivers BEM',
    'Sede Central de la OMIE - Domo Solar',
    'Configurar tu hoja de personaje RPG, comprender la naturaleza intrínseca de la motivación humana y diseñar tus primeras actividades de aprendizaje.',
    'Sara Arbelaez',
    $$[
        {"character": "GIOCHI", "text": "¡Bip-bop! Saludos, Agente en entrenamiento. Bienvenido al Domo Solar de la OMIE. Estoy listo para guiarte en tu viaje de diseño de aprendizaje. ¡Mis lentes ópticos detectan mucho potencial en ti!"},
        {"character": "Sara Arbelaez", "text": "¡Hola! Soy Sara. Como psicóloga y antropóloga de la OMIE, mi pasión es entender qué hace latir el corazón de las personas. En esta primera misión, vamos a explorar cómo se estructuran las experiencias a través de las motivaciones profundas: los 7 Drivers BEM."},
        {"character": "John Wilkins", "text": "Un momento, Sara. No olvides que un buen sistema educativo no es solo sentimiento. Requiere mecánicas claras y sistemas eficientes. Hola, soy John. Analizaremos las reglas del juego."},
        {"character": "Kira Yamada", "text": "Y yo soy Kira. Aseguraré que cada actividad tenga un objetivo épico y bien enfocado. Si no sabes a dónde vas, terminarás en cualquier parte. ¡Empecemos con tu iniciación!"}
    ]$$::jsonb,
    $$[
        {"character": "GIOCHI", "text": "¡Bip-bup! ¡Lecturas motivacionales al 100%! Has completado con éxito tu iniciación en el Mundo 1. Tu perfil de Agente ha sido cargado en el Roster Central de la OMIE."},
        {"character": "Sara Arbelaez", "text": "Excelente trabajo, Agente. Has dado tus primeros pasos para comprender los drivers intrínsecos de tus estudiantes. Recuerda: no diseñamos juegos, diseñamos sistemas serios de aprendizaje."}
    ]$$::jsonb,
    $${
        "slides": [
            {"id": "welcome", "type": "onboarding", "title": "Bienvenida e Iniciación"},
            {"id": "gear", "type": "gear", "title": "Selecciona tu Herramienta OMIE"},
            {"id": "drivers", "type": "skills", "title": "Distribuye tus Skills (Tienes 15)"},
            {"id": "virtues_flaws", "type": "virtues_flaws", "title": "Virtudes y Defectos (Gustos de Juego)"},
            {"id": "gamer_level", "type": "gamer_level", "title": "Tu Nivel Gamer"},
            {"id": "roster", "type": "roster", "title": "Dashboard del Roster y Comparación"}
        ]
    }$$::jsonb,
    $${
        "title": "Reconocimiento de Drivers",
        "description": "Clasifica cada actividad según el driver BEM principal que busca incentivar.",
        "questions": [
            {"id": "q1", "scenario": "Diseñar un sistema de portafolios interactivo donde el alumno personalice su perfil con temas visuales, avatares artísticos y música de fondo.", "options": ["Hedonismo y Placer Estético", "Eficiencia y Productividad", "Relación Social y Empatía", "Empoderamiento y Control"], "correct": "Hedonismo y Placer Estético", "explanation": "El Hedonismo y Placer Estético se asocia con el disfrute de la belleza, la personalización sensorial y la expresión artística dentro del sistema."},
            {"id": "q2", "scenario": "Permitir que los estudiantes elijan libremente entre tres metodologías diferentes para resolver un proyecto de ciencias sociales, asumiendo el rol de directores del proyecto.", "options": ["Maestría y Progreso", "Búsqueda y Creatividad", "Empoderamiento y Control", "Identidad Épica y Propósito"], "correct": "Empoderamiento y Control", "explanation": "La autonomía para elegir el propio camino y ejercer control directo sobre el proyecto apela directamente al driver de Empoderamiento y Control."},
            {"id": "q3", "scenario": "Implementar un sistema de \"Farming de Tareas\" donde los estudiantes optimizan sus tiempos de entrega cooperando para minimizar el desperdicio de recursos escolares.", "options": ["Eficiencia y Productividad", "Relación Social y Empatía", "Búsqueda y Creatividad", "Identidad Épica y Propósito"], "correct": "Eficiencia y Productividad", "explanation": "La optimización de tiempos, ahorro de recursos y maximización de entregables son representaciones puras del driver de Eficiencia."},
            {"id": "q4", "scenario": "Un desafío matemático donde la dificultad se adapta dinámicamente al nivel del estudiante (Flow), permitiéndole ganar insignias técnicas a medida que perfecciona su método.", "options": ["Maestría y Progreso", "Búsqueda y Creatividad", "Relación Social y Empatía", "Hedonismo y Placer Estético"], "correct": "Maestría y Progreso", "explanation": "El balance de dificultad, la superación de retos técnicos y el autoperfeccionamiento apelan al driver de Maestría y Progreso."},
            {"id": "q5", "scenario": "Un proyecto final de clase donde los estudiantes diseñan una campaña de reciclaje real para ayudar a su comunidad local y limpiar un parque municipal.", "options": ["Identidad Épica y Propósito", "Relación Social y Empatía", "Maestría y Progreso", "Empoderamiento y Control"], "correct": "Identidad Épica y Propósito", "explanation": "Las actividades alineadas con una causa social superior y un propósito trascendente activan el driver de Identidad Épica y Propósito."}
        ]
    }$$::jsonb,
    $${
        "title": "Canvas de Actividades de Aprendizaje BEM",
        "description": "Define para cada uno de los 7 Drivers BEM una actividad de aprendizaje seria (no un juego) aplicable en tu clase que motive a ese tipo de perfil.",
        "fields": [
            {"driver": "Hedonismo", "label": "Hedonismo y Placer Estético", "placeholder": "Ej: Crear un diario visual de lecturas con collage digital interactivo..."},
            {"driver": "Eficiencia", "label": "Eficiencia y Productividad", "placeholder": "Ej: Permitir eximirse de la entrega final si automatizan un proceso manual..."},
            {"driver": "Relacion", "label": "Relacionamiento y Empatía", "placeholder": "Ej: Trabajos en parejas rotativas donde uno actúa de mentor y otro de aprendiz..."},
            {"driver": "Maestria", "label": "Maestría y Progreso", "placeholder": "Ej: Retos semanales opcionales de programación avanzada con niveles adaptativos..."},
            {"driver": "Descubrimiento", "label": "Descubrimiento y Creatividad", "placeholder": "Ej: Esconder \"huevos de pascua\" con material extra y pistas en el aula virtual..."},
            {"driver": "Empoderamiento", "label": "Empoderamiento y Control", "placeholder": "Ej: Estudiantes deciden los criterios de evaluación de la rúbrica mediante votación..."},
            {"driver": "Proposito", "label": "Identidad Épica y Propósito", "placeholder": "Ej: Proyectos reales enfocados a solucionar un problema del colegio o vecindario..."}
        ]
    }$$::jsonb,
    $$[
        {"id": "vid_intrinsica", "url": "https://www.youtube.com/watch?v=06lXns4hiJc", "cost": 5, "desc": "Video explicativo sobre la motivación intrínseca y la diferencia con sistemas Skinner.", "type": "video", "title": "La Diferencia entre Gamificación y Puntos"},
        {"id": "vid_gamificacion", "url": "https://www.youtube.com/watch?v=dq5mh8-zP4g", "cost": 5, "desc": "Análisis profundo sobre por qué diseñar Beyond Mechanics y la psicología detrás del juego.", "type": "video", "title": "Beyond Mechanics: El Diseño de Experiencias"},
        {"id": "paper_deterding", "url": "/learn_resources/resources/world1/1 - Detering - from game design elemento to gamefulness.pdf", "cost": 10, "desc": "El paper fundacional de Sebastian Deterding et al. que define la gamificación y la experiencia de juego.", "type": "pdf", "title": "From Game Design Elements to Gamefulness"},
        {"id": "paper_nicholson", "url": "/learn_resources/resources/world1/1 -Nicholson - User Centered Framework to Meaningful Gamification.pdf", "cost": 10, "desc": "Propuesta teórica de Scott Nicholson para lograr una gamificación con sentido centrada en el usuario.", "type": "pdf", "title": "A User-Centered Framework for Meaningful Gamification"},
        {"id": "paper_bostan", "url": "/learn_resources/resources/world1/3 - BBostan-2008-2 Player Motivations- A Psychological Perspective .pdf", "cost": 10, "desc": "Análisis y taxonomías psicológicas sobre lo que impulsa y motiva a los jugadores en entornos virtuales.", "type": "pdf", "title": "Player Motivations: A Psychological Perspective"},
        {"id": "paper_modeling", "url": "/learn_resources/resources/world1/3 - Player_modeling_2013.pdf", "cost": 10, "desc": "Estructuras avanzadas de modelado, segmentación y perfiles motivacionales aplicados al diseño.", "type": "pdf", "title": "Player Modeling in Game Design"}
    ]$$::jsonb,
    '2026-06-01 11:07:08.557812+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 2
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    2, 2,
    'Misión 2: El Modelo GFR y la Teoría de la Autodeterminación',
    'Laboratorio de Calibración de la OMIE',
    'Aprender a distinguir entre Meta (Goal), Retroalimentación (Feedback) y Recompensa (Reward) (modelo GFR) y los niveles de regulación (Regulatorio, Integrado, Intrínseco).',
    'Kira',
    $$[
        {"character": "Kira", "locationKey": "lab", "text": "¡Saludos, agentes! Me alegra ver que han asimilado los 7 Drivers. Ahora debemos abordar el diseño desde la raíz: la motivación como el proceso que inicia, guía y mantiene conductas orientadas a objetivos."},
        {"character": "Kira", "locationKey": "lab", "text": "He notado que muchos agentes novatos confunden las Metas con las Recompensas. Si tu diseño no distingue estos conceptos, corres el riesgo de crear sistemas transaccionales y manipulativos que dañen la motivación intrínseca."},
        {"character": "Sara", "locationKey": "lab", "text": "Es verdad, Kira. A veces pensamos que darle una medalla o puntos a alguien es la recompensa, pero en realidad eso es solo la Meta que busca alcanzar o la Retroalimentación de su progreso."},
        {"character": "Giochi", "locationKey": "lab", "text": "¡Bip-bop! He preparado una interfaz interactiva basada en el juego GFR para ayudarlos a entrenar esta importante distinción. ¡Vamos a calibrar esos diseños!"}
    ]$$::jsonb,
    $$[
        {"character": "Kira", "locationKey": "lab", "text": "¡Excelente trabajo, agentes! Han demostrado que pueden diferenciar entre el objetivo (Meta), la información pura de retorno (Retroalimentación) y la respuesta neurológica/emocional del usuario (Recompensa/Castigo)."},
        {"character": "Sara", "locationKey": "lab", "text": "Sí, ahora entiendo que la hamburguesa es la meta, pero el sabor agradable es la recompensa. ¡La anticipación no es lo mismo que la recepción!"},
        {"character": "Kira", "locationKey": "lab", "text": "Exacto. Y recuerden siempre buscar el diseño Integrado o Intrínseco. El soborno motivacional (Regulatorio) solo genera optimización a corto plazo. ¡Sigan adelante!"}
    ]$$::jsonb,
    $${
        "title": "GFR Live Challenge",
        "description": "Juego cooperativo por rondas. Ubiquen las tarjetas del modelo GFR en la cuadrícula correcta."
    }$$::jsonb,
    $${
        "title": "Entrenamiento GFR",
        "description": "Clasifica cada tarjeta en una de las 9 casillas de la matriz GFR."
    }$$::jsonb,
    $${
        "title": "Canvas de Diseño GFR Integrado",
        "description": "Crea filas de diseño gamificado donde alinees Meta, Retroalimentación y Recompensa en formato 'Si X, entonces Y', asegurando que estén integradas con la actividad."
    }$$::jsonb,
    $$[
        {"id": "paper_deciryan", "url": "/learn_resources/resources/world2/4 - 2000_DeciRyan_PIWhatWhy.pdf", "cost": 10, "desc": "El paper clásico de Deci & Ryan sobre la Teoría de la Autodeterminación, motivación extrínseca e intrínseca.", "type": "pdf", "title": "Intrinsic and Extrinsic Motivations: Classic Definitions"},
        {"id": "book_bem_w2", "url": "/learn_resources/resources/world2/The Book of BEM.docx (1).pdf", "cost": 40, "desc": "Libro de BEM: Capítulo sobre el modelo GFR (Goal, Feedback, Reward) y diseño motivacional.", "type": "pdf", "title": "The Book of BEM: GFR Model"},
        {"id": "vid_deciryan_w2", "url": "https://www.youtube.com/watch?v=u6XAPnuFjJc", "cost": 5, "desc": "Video explicativo (charla ilustrada) sobre lo que realmente nos motiva, los pilares de la autonomía, maestría y propósito.", "type": "video", "title": "La sorprendente verdad sobre lo que nos motiva (RSA)"},
        {"id": "gfr_theory_guide", "url": "/learn_resources/resources/world2/gfr_theory_guide.pdf", "cost": 10, "desc": "Documento exclusivo que detalla el ciclo GFR, los 4 tipos de metas y los niveles de regulación motivacional.", "type": "pdf", "title": "Guía Teórica BEM: Modelo GFR y Regulación RII"},
        {"id": "vid_timeline_w2", "url": "https://www.youtube.com/watch?v=BKwa3NfB2mo&t=1s", "cost": 5, "desc": "Video explicativo sobre las reglas y mecánicas del juego de mesa Timeline.", "type": "video", "title": "Video de el juego Timeline"}
    ]$$::jsonb,
    '2026-06-02 21:24:06.76678+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 3
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    3, 3,
    'Misión 3: Ciclos Interactivos de Aprendizaje',
    'omie',
    'Entender la estructura temporal y la relojería de los ciclos de aprendizaje lúdico, diferenciando duraciones (corto, medio, largo) y clasificando las 6 etapas internas.',
    'John Wilkins',
    $$[
        {"character": "Kira Yamada", "pose": "animated", "text": "¿Cómo podemos crear algo realmente poderoso con las metas, la retroalimentación y la recompensa de manera que no se queden en el papel?"},
        {"character": "John Wilkins", "pose": "animated", "text": "Los juegos se fundamentan en los ciclos como estructuras principales de apoyo. Son la relojería oculta que da vida a la experiencia."},
        {"character": "Kira Yamada", "pose": "animated", "text": "Supongo que esos ciclos deben implicar algún tipo de agencia de los jugadores..."},
        {"character": "John Wilkins", "pose": "animated", "text": "Así es, pero la agencia en los juegos no implica sólo tomar decisiones, especialmente cuando hablamos de aprendizaje."}
    ]$$::jsonb,
    $$[
        {"character": "John Wilkins", "pose": "animated", "text": "¡Excelente, Agente! Has descifrado los engranajes de la interactividad. El tiempo y la retroalimentación ahora giran a tu favor."},
        {"character": "Kira Yamada", "pose": "animated", "text": "Es increíble cómo ajustar el tamaño de un ciclo cambia por completo la atención del estudiante. ¡Una verdadera obra de relojería de aprendizaje!"}
    ]$$::jsonb,
    $${
        "title": "Relojería de la Interactividad",
        "description": "Clasifiquen las ideas propuestas en las 6 etapas del ciclo de interactividad."
    }$$::jsonb,
    $${
        "title": "Ciclos de Aprendizaje",
        "description": "Clasifica cada actividad de clase según la duración de su ciclo de retroalimentación."
    }$$::jsonb,
    $${
        "title": "Canvas de Ciclos de Interactividad",
        "description": "Diseña un bucle de interactividad completo con las 6 etapas."
    }$$::jsonb,
    '[]'::jsonb,
    '2026-06-10 21:17:25.504464+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 4
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    4, 4,
    'Misión 4: Arquitectura de Metas y Expectativas',
    'El Faro de la Orientación',
    'Diseñar objetivos narrativos, principales y secundarios, y calibrar las 7 variables de expectativa en el aprendizaje.',
    'Kira',
    $$[
        {"character": "Kira", "locationKey": "guidance_lighthouse", "pose": "base", "text": "Bienvenido al Faro de la Orientación, Agente. En medio de la niebla del diseño, aquí es donde trazamos el rumbo correcto."},
        {"character": "Kira", "pose": "animated", "text": "En el diseño motivacional, un objetivo confuso es como navegar sin brújula. Si el jugador no sabe a dónde va, su energía simplemente se dispersará."},
        {"character": "Kira", "pose": "animated", "text": "Analizaremos cómo estructurar las metas: diferenciar lo que queremos y tenemos, de lo que evitamos o deseamos alcanzar. Así darás el primer paso para dominar este mapa."}
    ]$$::jsonb,
    $$[
        {"character": "Kira", "locationKey": "guidance_lighthouse", "pose": "animated", "text": "¡Extraordinario, Agente! Has arrojado luz sobre la niebla del diseño. Tus metas ahora son tan claras como el haz de este faro."},
        {"character": "Kira", "pose": "animated", "text": "Recuerda: la claridad en los objetivos y la progresión visible es lo que mantiene encendido el motor de la constancia."},
        {"character": "Kira", "pose": "base", "text": "Continúa refinando tus mapas de juego y nos vemos en la próxima misión de la OMIE."}
    ]$$::jsonb,
    $${
        "title": "Calibrador de Metas",
        "description": "Analicen y balanceen la estructura y tipología de las metas."
    }$$::jsonb,
    $${
        "title": "Variables y Tipos de Metas",
        "description": "Entrena tus habilidades identificando variables de expectativa, tipos de metas y cuadrantes Quiero/Tengo."
    }$$::jsonb,
    $${
        "title": "Diseñador de Metas",
        "description": "Diseña tus propias metas de aprendizaje calibrando las variables de expectativa y clasificando su tipología."
    }$$::jsonb,
    $$[
        {"id": "diseno_mundo4_detras_de_camaras", "url": "/learn_resources/resources/world4/diseno_mundo4_detras_de_camaras.pdf", "cost": 30, "desc": "Documento interno que revela la arquitectura pedagógica y lúdica completa del Mundo 4. Detalla las decisiones de diseño detrás de cada slide, trivia y canvas.", "type": "pdf", "title": "Diseño del Mundo 4: Detrás de Cámaras"},
        {"id": "resumen_teorico_mundo4", "url": "/learn_resources/resources/world4/resumen_teorico_mundo4.pdf", "cost": 30, "desc": "Condensado de los conceptos clave vistos en clase: las 7 variables de expectativa, tipos de metas (Narrativa, Principal, Secundaria) y la Matriz Quiero/Tengo.", "type": "pdf", "title": "Resumen Teórico: Metas y Expectativas"},
        {"id": "expert_myth", "url": "https://www.youtube.com/watch?v=5eW6Eagr9XA&t=1s", "cost": 20, "desc": "Exploración en video del concepto de expertise y cómo la percepción de competencia afecta la motivación intrínseca.", "type": "video", "title": "El Mito del Experto"},
        {"id": "intrinsic_extrinsic_motivation", "url": "/learn_resources/resources/world4/BK_Intrinsic_extrinsicmotivationbook1.pdf", "cost": 20, "desc": "Libro académico de Carol Sansone y Judith Harackiewicz sobre motivación humana y teoría de la autodeterminación.", "type": "pdf", "title": "Intrinsic and Extrinsic Motivation Book"},
        {"id": "badge_goal_orientation", "url": "/learn_resources/resources/world4/2B -2014-hakulinen-badge-goalorientation.pdf", "cost": 20, "desc": "Estudio empírico de Hakulinen et al. sobre cómo las mecánicas gamificadas afectan de manera diferenciada a los estudiantes.", "type": "pdf", "title": "Achievement Goal Orientations & Gamification"},
        {"id": "instructional_objectives_gameplay", "url": "/learn_resources/resources/world4/Instructional_objectives_to_core_gamepla.pdf", "cost": 20, "desc": "Metodología de diseño de serious games para mapear objetivos pedagógicos hacia dinámicas de juego principales.", "type": "pdf", "title": "Instructional Objectives to Core-Gameplay"}
    ]$$::jsonb,
    '2026-06-17 16:45:15.443889+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 5
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    5, 5,
    'Misión 5: Llamados a la Acción y Capturadores de Atención',
    'El Faro de la Orientación - guidance_lighthouse',
    'Calibrar notificadores conductuales, analizar el impacto emocional de las alertas e integrar la inacción como disparador de autonomía.',
    'Sara Arbelaez',
    $$[
        {"character": "Sara Arbelaez", "locationKey": "guidance_lighthouse", "text": "Bienvenidos de vuelta al Faro de la Orientación, Agentes. Hoy no venimos a trazar rutas, sino a entender cómo mantener la vista del tripulante en la dirección correcta."},
        {"character": "Sara Arbelaez", "text": "En cualquier sistema interactivo, la atención es el recurso más valioso. Mecanismos como los notificadores visuales o sonoros actúan como señales de 'Push': alertan al usuario antes de que ocurra un evento crítico, dándole el tiempo justo para reaccionar."},
        {"character": "Sara Arbelaez", "text": "Si un conductor no recibe una alerta visual clara antes de una bifurcación o un obstáculo imprevisto en la vía, el sistema falla. En el aprendizaje pasa lo mismo: necesitamos capturadores y notificadores diseñados con precisión para guiar la atención del estudiante en el momento correcto sin saturar su mente."}
    ]$$::jsonb,
    $$[
        {"character": "Sara Arbelaez", "locationKey": "guidance_lighthouse", "text": "¡Impresionante, Agente! Has dominado el sutil arte de capturar y dirigir la atención. Tus diseños ahora cuentan con verdaderos faros de alerta."},
        {"character": "Sara Arbelaez", "text": "Recuerda: un buen capturador de atención no interrumpe el flujo, lo encauza. El diseño de notificaciones y tiempos de reacción es lo que separa una experiencia frustrante de una inmersiva."},
        {"character": "Sara Arbelaez", "text": "Sigue aplicando este balance y nos vemos en la próxima misión de la OMIE."}
    ]$$::jsonb,
    $${
        "slides": [
            {"id": "welcome", "type": "onboarding", "title": "Bienvenida y Triggers"},
            {"id": "phase1", "type": "actividad", "title": "Fase 1: Hábitos e Inacción"},
            {"id": "phase2", "type": "actividad", "title": "Fase 2: Semáforo de Notificaciones"},
            {"id": "phase3", "type": "actividad", "title": "Fase 3: Dial de Intensidad"},
            {"id": "roster", "type": "roster", "title": "Consenso y Cierre"}
        ]
    }$$::jsonb,
    $${
        "title": "Calibrador de Notificadores y Atención",
        "description": "Evalúa y califica la efectividad y el impacto atencional de las alertas en base a hábitos, timing y emociones.",
        "questions": [
            {"id": "q1", "scenario": "Un colegio usa el mismo timbre largo para el cambio de clase, el simulacro de evacuación y para anunciar exámenes rápidos.", "question": "Si fueras un estudiante, ¿qué efecto tendría esta señal en tu conducta habitual?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "Una señal ambigua rompe el condicionamiento clásico. Si el estímulo significa múltiples cosas con distintas urgencias, el cerebro del estudiante no puede automatizar una respuesta, aumentando la fricción inicial."},
            {"id": "q2", "scenario": "Al abrir el simulador de química, el estudiante ve una mesa de laboratorio digital vacía, sin instrucciones, ventanas emergentes o flechas indicadoras.", "question": "Si fueras un estudiante, ¿cuál sería tu primera reacción ante esta inacción de estímulos?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "La inacción deliberada en el diseño de interfaces (similar al inicio de Mario Bros) actúa como un vacío de información. Al no haber ruido visual, la curiosidad innata empuja al estudiante a tomar la iniciativa, promoviendo la autonomía."},
            {"id": "q3", "scenario": "El profesor quiere instaurar una rutina de 10 minutos de lectura libre al inicio de cada clase. Usa un cuenco tibetano con un sonido suave y relajante para marcar el inicio.", "question": "Si fueras un estudiante, ¿cómo percibirías este disparador auditivo a lo largo de las semanas?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "El condicionamiento auditivo consistente con un sonido único y asociado exclusivamente a un estado mental (relajación/enfoque) reduce la resistencia cognitiva de transición de un estado activo/social al estudio individual."},
            {"id": "q4", "scenario": "Un simulador de código emite un sonido agudo y estridente ('buzzer') cada vez que el estudiante comete un error de sintaxis al presionar una tecla.", "question": "Si fueras un estudiante, ¿qué hábito desarrollaría esta señal repetitiva?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "Los disparadores negativos de alta intensidad ante fallos de bajo nivel destruyen la seguridad psicológica. El estudiante prefiere la inacción o silenciar el sistema antes que someterse al castigo auditivo constante."},
            {"id": "q5", "scenario": "Una aplicación educativa de idiomas envía una notificación a las 8:00 AM que dice: 'Tu racha está en peligro. Entra ahora y no pierdas tu progreso'.", "question": "Si fueras un estudiante que suele estudiar a las 9:00 PM, ¿cómo te afectaría esta notificación proactiva?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "Las notificaciones proactivas ('Push') deben alinearse con el ritmo de vida del estudiante. Si se envían a deshoras, se perciben como spam disruptivo en lugar de un facilitador de hábitos."},
            {"id": "q6", "scenario": "El aula virtual envía una alerta diaria a las 6:00 PM: 'Recuerda participar en el foro semanal', incluso a los estudiantes que ya publicaron su respuesta el lunes.", "question": "Si fueras un estudiante que ya participó, ¿cómo reaccionaría a este disparador recurrente?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "Las alertas Push no condicionadas al estado real del usuario destruyen la confianza en la señal. El cerebro aprende rápidamente a filtrar el 'ruido de fondo', lo que anula la efectividad de futuras notificaciones realmente críticas."},
            {"id": "q7", "scenario": "Un simulador de matemáticas reproduce una fanfarria triunfal de 8 bits muy clara cada vez que el estudiante resuelve correctamente 5 ejercicios seguidos.", "question": "Si fueras un estudiante, ¿qué conducta fomentaría este disparador de éxito?", "options": ["A", "B", "C", "D"], "correct": "B", "explanation": "Una señal discriminatoria de éxito actúa como recompensa secundaria condicionada (similar al sonido de las monedas en Mario). Si se entrega con consistencia tras un esfuerzo estructurado, refuerza la conducta del ciclo y motiva a iniciar la siguiente tanda."}
        ]
    }$$::jsonb,
    $${
        "title": "Canvas de Notificadores Educativos BEM",
        "description": "Diseña llamados a la acción para mejorar las rutinas de tus estudiantes y califica sus parámetros en tres dimensiones críticas.",
        "fields": [
            {"driver": "accion", "label": "Acción / Comportamiento deseado", "placeholder": "Ej: Completar la lectura previa de circuitos eléctricos antes de clase..."},
            {"driver": "senal", "label": "Diseño de la Alerta / Señal", "placeholder": "Ej: Mensaje corto en la app de Notion con botón directo al recurso enviado a las 5 PM..."}
        ]
    }$$::jsonb,
    $$[
        {"id": "doc_signals", "url": "/learn_resources/resources/world5/diseno_mundo5_detras_de_camaras.pdf", "cost": 0, "desc": "Documento técnico de diseño que explica la arquitectura del Mundo 5, el sistema multijugador, los retos de las tres fases y a GIOCHI.", "type": "pdf", "title": "Detrás de cámaras: Diseño de Señales y Llamados a la Acción"},
        {"id": "doc_summary", "url": "/learn_resources/resources/world5/resumen_teorico_mundo5.pdf", "cost": 0, "desc": "Guía resumida de consulta rápida sobre condicionamiento clásico, el modelo de comportamiento de Fogg, timing y fatiga por alerta.", "type": "pdf", "title": "Resumen conceptual: Notificadores, Timing y Ansiedad"},
        {"id": "paper_bavelier", "url": "/learn_resources/resources/world5/Bavelier, Daphne & Green, C. Shawn - Enhancing Attentional Control: Lessons from Action Video Games (2019).pdf", "cost": 10, "desc": "Estudio sobre cómo el juego de acción modula el control de atención y la selectividad visual del cerebro, optimizando la concentración.", "type": "pdf", "title": "Enhancing Attentional Control: Lessons from Action Video Games"},
        {"id": "paper_shell", "url": "/learn_resources/resources/world5/Shell, Duane F. & Flowerday, Terri - Affordances and Attention (2019).pdf", "cost": 10, "desc": "Marco conceptual que conecta las affordances en entornos virtuales con la motivación y el condicionamiento de la atención del estudiante.", "type": "pdf", "title": "Affordances and Attention"},
        {"id": "paper_dayan", "url": "/learn_resources/resources/world5/Dayan, Peter & Yu, Angela J. - Uncertainty and Learning (2002).pdf", "cost": 15, "desc": "Paper clásico sobre cómo el cerebro gestiona la incertidumbre predictiva del sistema gatillando mayor asignación atencional.", "type": "pdf", "title": "Uncertainty and Learning"},
        {"id": "paper_kober", "url": "/learn_resources/resources/world5/Kober, Silvia Erika, Wood, Guilherme, Kiili, Kristian, Moeller, Korbinian & Ninaus, Manuel - Game-based learning environments affect frontal brain activity (2020).pdf", "cost": 15, "desc": "Estudio con fNIRS que mide la respuesta neurofuncional de los alumnos en tareas gamificadas y el incremento de actividad frontal de recompensa.", "type": "pdf", "title": "Game-based learning environments affect frontal brain activity"},
        {"id": "vid_attention_getters", "url": "https://www.youtube.com/watch?v=78eiLtQjmss", "cost": 5, "desc": "Demostración de juegos y llamados a la acción físicos/auditivos para reenfocar la atención del grupo rápidamente.", "type": "video", "title": "Juegos y Capturadores de Atención (Playworks)"},
        {"id": "vid_quick_triggers", "url": "https://www.youtube.com/shorts/OZz3QTxn4o0", "cost": 5, "desc": "Ejemplo práctico en formato corto de un videojuego que utiliza múltiples estímulos visuales y auditivos simultáneos para enganchar y retener la atención del jugador.", "type": "video", "title": "Capturadores de Atención en Videojuegos"}
    ]$$::jsonb,
    '2026-06-24 13:07:38.353614+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 6
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    6, 6,
    'Misión 6: Psicología de la toma de decisión y la toma de acción',
    'El Laberinto Cognitivo',
    'Aprender cómo operan los sesgos cognitivos, diseñar decisiones significativas y estructurar la autonomía.',
    'Sara Arbeláez',
    $$[
        {"character": "Sara Arbelaez", "locationKey": "maze", "text": "Bienvenidos al Laberinto Cognitivo, Agentes. Este lugar representa los complejos e intrincados senderos que recorre la mente humana al momento de tomar decisiones."},
        {"character": "Sara Arbelaez", "text": "Al diseñar, solemos caer en la ilusión de que las personas son seres lógicos y racionales que siempre elegirán la opción de estudio óptima. Pero la realidad es que decidimos influenciados por sesgos cognitivos y atajos mentales."},
        {"character": "John Wilkins", "text": "Y no olvidemos la estructura, Sara. La mente no decide en el vacío. Las decisiones son moldeadas de forma directa por cómo organizamos el entorno de información y por las reglas de juego vigentes."},
        {"character": "John Wilkins", "text": "Si modificamos la visibilidad de las opciones o el costo operativo de una acción, cambiaremos de inmediato la ruta que el estudiante decidirá transitar."},
        {"character": "Sara Arbelaez", "text": "Exactamente, John. Por eso, para construir sistemas que apoyen genuinamente la autonomía, debemos aprender a estructurar decisiones que tengan valor, consecuencias y significado real."}
    ]$$::jsonb,
    $$[
        {"character": "Sara Arbelaez", "locationKey": "maze", "text": "¡Fantástico trabajo, Agente! Has logrado descifrar las bifurcaciones de la mente y comprender la psicología detrás de cada acción en el laberinto."},
        {"character": "John Wilkins", "text": "Ahora comprendes que las reglas no solo restringen, sino que habilitan decisiones significativas. Diseñar la información es construir la brújula de la acción."},
        {"character": "Sara Arbelaez", "text": "Recuerda siempre: el diseño de la autonomía no consiste en dar opciones infinitas, sino en estructurar alternativas con significado. ¡Nos vemos en la próxima misión de la OMIE!"}
    ]$$::jsonb,
    $${
        "slides": [
            {"id": "welcome", "type": "onboarding", "title": "Bienvenida y Reglas"},
            {"id": "phase1", "type": "actividad", "title": "Fase 1: Economía Conductual"},
            {"id": "phase2", "type": "actividad", "title": "Fase 2: Diseño de Juegos"},
            {"id": "phase3", "type": "actividad", "title": "Fase 3: Decisiones en Educación"},
            {"id": "roster", "type": "roster", "title": "Consenso y Cierre"}
        ]
    }$$::jsonb,
    $${
        "title": "Calibrador de Decisiones e Incertidumbre",
        "description": "Evalúa y califica tu comprensión sobre cómo influyen los sesgos cognitivos, las elecciones significativas y la autonomía.",
        "questions": [
            {"id": "q1", "scenario": "Un estudiante lee en un foro estudiantil que el último examen de matemáticas fue 'imposible de pasar'. Aunque ha estudiado y tiene buenas notas, asume de inmediato que reprobará y entra en pánico.", "question": "¿Qué heurística o sesgo cognitivo está distorsionando su estimación de riesgo?", "options": ["Falacia del Costo Hundido", "Heurística de Disponibilidad", "Sesgo del Presente", "Efecto de Dotación"], "correct": "B", "explanation": "La heurística de disponibilidad hace que la mente estime la probabilidad de un suceso según la facilidad con la que recupera de la memoria un ejemplo vívido o reciente (el comentario alarmante del foro), ignorando su propio historial de notas y preparación real."},
            {"id": "q2", "scenario": "Un docente diseña tres opciones de material de estudio para un tema: Opción A (leer 10 páginas), Opción B (leer 10 páginas y escribir un ensayo de 5 páginas) y Opción C (leer un resumen ejecutivo de 8 páginas). La presencia de la Opción B hace que los alumnos consideren la Opción A como sumamente razonable y atractiva.", "question": "¿Qué rol juega la Opción B en esta arquitectura de decisión?", "options": ["Opción Dominante", "Señuelo (Decoy)", "Elección Ciega", "Agencia Estética"], "correct": "B", "explanation": "El 'señuelo' (Opción B) es una alternativa deliberadamente asimétrica y de mayor costo que sirve únicamente para desviar la comparación y hacer que la opción preferida por el diseñador (Opción A) parezca sumamente valiosa y de bajo costo en comparación."},
            {"id": "q3", "scenario": "Si cambias las reglas de una actividad de modo que el estudiante inicie con 50 puntos y se le descuenten puntos por fallas, en lugar de iniciar en 0 e ir acumulándolos por aciertos...", "question": "¿Qué principio de la economía conductual estás explotando para modificar la urgencia de entrega?", "options": ["Descuento Hiperbólico", "Aversión a la Pérdida (Loss Aversion)", "Ilusión de Control", "Falacia de la Conjunción"], "correct": "B", "explanation": "La aversión a la pérdida describe la tendencia psicológica a sentir el dolor de perder algo (puntos ya asignados) aproximadamente el doble de fuerte que el placer de ganar ese mismo recurso desde cero."},
            {"id": "q4", "scenario": "Un estudiante ha invertido 20 horas en escribir un proyecto escolar utilizando un enfoque metodológico incorrecto. Aunque el docente le demuestra que es mejor empezar de cero con otra estructura para asegurar la nota, el alumno insiste en continuar con su escrito inicial argumentando: 'Ya le he dedicado demasiado tiempo a esto para botarlo'.", "question": "¿Qué sesgo cognitivo presenta el alumno al negarse a reiniciar su proyecto?", "options": ["Falacia del Costo Hundido", "Sesgo de Representatividad", "Sesgo del Status Quo", "Error de Atribución Fundamental"], "correct": "A", "explanation": "La falacia del costo hundido ocurre cuando insistimos en continuar una inversión o conducta debido a los recursos ya gastados (tiempo, esfuerzo, dinero), a pesar de que la evidencia demuestra que el resultado futuro será negativo si no cambiamos de rumbo."},
            {"id": "q5", "scenario": "Un estudiante prefiere jugar videojuegos hoy (recompensa inmediata) en lugar de estudiar para el examen de la próxima semana (recompensa diferida mayor), aun sabiendo que esto afectará gravemente su rendimiento final.", "question": "¿Qué sesgo explica esta inconsistencia en la valoración del tiempo?", "options": ["Sesgo de Anclaje", "Sesgo del Presente (Present Bias)", "Efecto de Dotación", "Ilusión de Control"], "correct": "B", "explanation": "El sesgo del presente describe la tendencia de los humanos a sobrevalorar drásticamente las recompensas inmediatas frente a las futuras, mostrando un descuento hiperbólico de la utilidad del tiempo a medida que la recompensa se aleja en el calendario."},
            {"id": "q6", "scenario": "En un examen digital, permites que los estudiantes elijan manualmente de una pila virtual qué sobre de preguntas abrir, en lugar de que el sistema las asigne al azar. Los estudiantes reportan sentirse más seguros y confiados, a pesar de que todas las preguntas tienen la misma dificultad matemática.", "question": "¿Qué sesgo explica la mayor confianza de los estudiantes al elegir manualmente su sobre de preguntas?", "options": ["Efecto Enmarque", "Ilusión de Control", "Sesgo de Confirmación", "Sesgo de Status Quo"], "correct": "B", "explanation": "La ilusión de control es la tendencia humana a creer que sus acciones personales (como elegir físicamente una tarjeta o lanzar un dado personal) influyen o determinan los resultados de eventos puramente azarosos o con probabilidades fijas preestablecidas."},
            {"id": "q7", "scenario": "En un juego serio sobre toma de decisiones de negocios, se le presenta al estudiante un dilema: 'Elige entre la Estrategia Alfa o la Estrategia Beta', sin proporcionarle ningún reporte financiero previo, historial o pista contextual. Al seleccionar Alfa, el simulador le arroja un mensaje de quiebra permanente.", "question": "¿Qué tipo de elección es esta que conduce a una quiebra inesperada sin pistas previas?", "options": ["Elección Significativa", "Elección Ciega", "Elección Falsa", "Estrategia Dominante"], "correct": "B", "explanation": "Una elección es ciega cuando el usuario se ve obligado a elegir entre alternativas sin información previa para ponderar sus riesgos y consecuencias. Si además genera una penalización severa y permanente (quiebra), se considera un grave fallo de diseño."},
            {"id": "q8", "scenario": "Estás analizando el simulador educativo del curso y notas que todos los estudiantes eligen exactamente la misma ruta de especialización final porque es la única que otorga un multiplicador de puntos del 200% sin tener penalizaciones asociadas.", "question": "¿Cómo se define técnicamente esta ruta que todos los estudiantes terminan eligiendo?", "options": ["Agencia Cosmética", "Estrategia Dominante", "Elección con Daño Colateral", "Elección Significativa"], "correct": "B", "explanation": "Una estrategia dominante es una alternativa dentro de un sistema que resulta superior a todas las demás en cualquier escenario, anulando el dilema de elegir y destruyendo el interés estratégico de la toma de decisiones."},
            {"id": "q9", "scenario": "Un estudiante debe decidir entre comprar un escudo pesado (+50 de defensa, -20% de velocidad) o una capa ligera (+10 de defensa, +30% de velocidad) para su siguiente combate en un juego serio de rol.", "question": "¿Qué tipo de elección se presenta al decidir entre el escudo pesado o la capa ligera con sus respectivos balances?", "options": ["Elección Ciega", "Elección Significativa", "Elección Falsa", "Elección Cosmética"], "correct": "B", "explanation": "Es una elección significativa porque cuenta con información dable (los atributos de defensa/velocidad), tiene un impacto claro en el combate posterior y presenta un trade-off o costo de oportunidad equilibrado (ganar defensa implica sacrificar velocidad)."},
            {"id": "q10", "scenario": "Si permites que tus estudiantes seleccionen el color de fondo y el escudo heráldico de su grupo de trabajo en la plataforma digital, sabiendo que esto no modifica las reglas de entrega, la dificultad ni las calificaciones del proyecto final...", "question": "¿Qué tipo de elección representa la personalización del color de fondo y el escudo del grupo?", "options": ["Elección Significativa", "Elección Decorativa (Agencia Cosmética)", "Elección Dominante", "Elección Falsa"], "correct": "B", "explanation": "Las elecciones decorativas o cosméticas permiten al usuario expresar su identidad y autoexpresión sin alterar el estado operativo, las mecánicas ni las reglas matemáticas del sistema. Son útiles para el driver de identidad pero no afectan la dificultad."},
            {"id": "q11", "scenario": "En un diálogo interactivo de historia, se le pregunta al jugador: '¿Quieres investigar las ruinas o cruzar el puente?'. Si responde 'cruzar el puente', el acompañante le dice: '¡Es muy peligroso! Vayamos a las ruinas'. En ambos casos, el sistema los carga en las ruinas.", "question": "¿Cómo se clasifica la dinámica que fuerza al jugador a ir a las ruinas sin importar qué elija?", "options": ["Elección Ciega", "Elección Falsa (Ilusión de Agencia)", "Estrategia Dominante", "Elección Significativa"], "correct": "B", "explanation": "Las elecciones falsas o ilusiones de agencia ocurren cuando el sistema ofrece múltiples alternativas en pantalla pero las conduce de forma invisible e inevitable al mismo resultado final. Sirven para dar tono narrativo o de rol sin multiplicar el código."},
            {"id": "q12", "scenario": "Un docente decide dar total autonomía en su curso de ciencias y les ofrece una lista de 60 temas posibles para que cada estudiante elija uno de forma independiente para su exposición. Al final, nota retrasos masivos en la elección, alta ansiedad y quejas constantes.", "question": "¿Qué fenómeno del diseño de decisiones explica esta parálisis de los estudiantes ante 60 temas?", "options": ["Falacia del Costo Hundido", "Paradoja de la Elección (Sobrecarga Cognitiva)", "Sesgo del Status Quo", "Aversión a la Pérdida"], "correct": "B", "explanation": "La paradoja de la elección o sobrecarga cognitiva demuestra que, aunque valoramos la libertad, un número excesivo de opciones satura nuestros recursos de procesamiento cognitivo, generando parálisis por análisis, fatiga de decisión y frustración ante el costo de oportunidad."},
            {"id": "q13", "scenario": "Para incentivar el compromiso con las lecturas, un docente evalúa alternativas de autonomía estructurada en el aula.", "question": "¿Cuál de las siguientes estrategias docentes representa la mejor implementación de 'autonomía estructurada'?", "options": ["Forzar una única lectura obligatoria obligando a todos a resumirla en PDF.", "Dar libertad de leer cualquier libro en el mundo que trate de historia y calificar con rúbricas abiertas.", "Seleccionar 3 lecturas académicas equivalentes y permitir al estudiante elegir cuál de las 3 leer y en qué formato presentar su reporte.", "Ofrecer lecturas sorpresa aleatorias cada semana que se eligen tirando un dado en clase."], "correct": "C", "explanation": "La autonomía estructurada limita el número de opciones (reduciendo la sobrecarga cognitiva) pero mantiene abiertas alternativas con significado y equivalentes pedagógicamente, otorgando una sensación de agencia y control sin desestructurar la clase."},
            {"id": "q14", "scenario": "El docente busca definir un enfoque de evaluación formativa que permita al alumno aprender a través del fallo sin frustración.", "question": "¿Qué enfoque de evaluación modela el fallo del estudiante de manera constructiva y promueve la Maestría?", "options": ["Otorgar una única calificación final al entregar el proyecto final de semestre, sin posibilidad de corrección.", "Evaluar los borradores semanales como entregas formativas con feedback que el estudiante puede corregir y volver a entregar para mejorar su nota acumulada.", "Aplicar penalizaciones de puntos exponenciales a todo estudiante que entregue un borrador incompleto.", "Aprobar a todos los estudiantes de forma automática sin importar si el proyecto tiene fallos."], "correct": "B", "explanation": "Modelar el fallo como parte del ciclo interactivo (Smart Failure) requiere que los errores sean reversibles y tengan feedback claro. Permitir la iteración y entrega de borradores reduce la ansiedad y el miedo al error, incentivando la búsqueda de la maestría."},
            {"id": "q15", "scenario": "Permites que tus estudiantes fusionen la entrega de sus tareas de Geografía e Historia en un único proyecto integrado de 'Infografía Geohistórica', el cual evalúa los objetivos de ambas materias de forma simultánea y otorga un bono extra de puntos de progreso.", "question": "¿Qué principio de diseño estás aplicando al unificar y bonificar las tareas integradas?", "options": ["Recompensas Aleatorias", "Sinergia / Combos", "Decoy Effect", "Aversión a la Pérdida"], "correct": "B", "explanation": "Diseñar sinergias o 'combos' de entregas permite a los alumnos planificar y conectar conocimientos de forma estratégica, optimizando sus esfuerzos al unificar tareas aisladas en entregables integrales más significativos y de alto valor percibido."}
        ]
    }$$::jsonb,
    $${
        "title": "Canvas de Decisiones e Incertidumbre BEM",
        "description": "Estructura un lienzo de doble columna para balancear estímulos conductuales de la mente con estrategias lúdicas de diseño de juego.",
        "fields": [
            {"driver": "conductuales", "label": "Decisiones Conductuales", "placeholder": "Idea para aplicar la heurística conductual en clase..."},
            {"driver": "juegos", "label": "Estrategias de Diseño de Juegos", "placeholder": "Idea para aplicar la estrategia lúdica en clase..."}
        ]
    }$$::jsonb,
    $$[
        {"id": "doc_decisions", "url": "/learn_resources/resources/world6/diseno_mundo6_detras_de_camaras.pdf", "cost": 0, "desc": "Documento técnico sobre el diseño del detrás de cámaras del Mundo 6, analizando heurísticas, decisiones en juego y dilemas pedagógicos.", "type": "pdf", "title": "Detrás de cámaras: Toma de Decisiones y Autonomía"},
        {"id": "doc_summary6", "url": "/learn_resources/resources/world6/resumen_teorico_mundo6.pdf", "cost": 0, "desc": "Guía conceptual resumida sobre la psicología de toma de decisiones, sesgos cognitivos, elecciones lúdicas y la paradoja de la elección.", "type": "pdf", "title": "Resumen conceptual: Heurísticas, Sesgos y Autonomía Estructurada"},
        {"id": "paper_salen", "url": "/learn_resources/resources/world6/Salen, Katie & Zimmerman, Eric - Rules of Play: Game Design Fundamentals (2004).pdf", "cost": 10, "desc": "Capítulos esenciales sobre el diseño de elecciones significativas (meaningful play), macro y micro-decisiones y la anatomía de la acción.", "type": "pdf", "title": "Rules of Play: Game Design Fundamentals"},
        {"id": "paper_mullins", "url": "/learn_resources/resources/world6/Mullins, Jeffrey K. & Sabherwal, Rajiv - Beyond Enjoyment: A Cognitive-Emotional Perspective of Gamification (2018).pdf", "cost": 10, "desc": "Estudio sobre cómo balancear tensiones cognitivo-emocionales en experiencias gamificadas para mejorar el rendimiento sistémico.", "type": "pdf", "title": "Beyond Enjoyment: A Cognitive-Emotional Perspective of Gamification"},
        {"id": "paper_sansone", "url": "/learn_resources/resources/world6/Sansone, Carol & Harackiewicz, Judith M. - Intrinsic and Extrinsic Motivation: The Search for Optimal Motivation and Performance (2000).pdf", "cost": 15, "desc": "Contiene los hallazgos de Lepper & Henderlong sobre cómo estructurar la autonomía para motivar de manera intrínseca sin perder la estructura.", "type": "pdf", "title": "Intrinsic and Extrinsic Motivation"},
        {"id": "paper_renner", "url": "/learn_resources/resources/world6/Renner, Elke - Applied Behavioural Economics Lecture 2 and 3: Heuristics and Biases in Judgement and Decision making (2015).pdf", "cost": 15, "desc": "Recopila y explica las heurísticas y sesgos de Kahneman & Tversky aplicados a las predicciones y juicios del agente humano bajo riesgo.", "type": "pdf", "title": "Applied Behavioural Economics: Heuristics and Biases"}
    ]$$::jsonb,
    '2026-07-01 14:25:54.765288+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- WORLD 7
INSERT INTO public.course_worlds (
    id, order_index, title, narrative_place, narrative_objective, narrative_mentor,
    narrative_intro, narrative_outro, workshop_modules, training_modules, design_modules, wiki_modules, created_at
) VALUES (
    7, 7,
    'Misión 7: Evaluación e Incentivos',
    'El Laberinto de la Heurística',
    'Comprender cómo los sistemas de evaluación en juegos configuran los incentivos conductuales y la motivación intrínseca.',
    'Emma Wagner',
    $$[
        {"character": "Sara Arbelaez", "locationKey": "maze", "text": "Bienvenido de vuelta al Laberinto, Agente. Hoy no exploraremos sesgos ni atajos mentales. Hoy vamos a hablar de cómo medimos el progreso. Y para eso, he traído a una experta muy especial."},
        {"character": "Emma Wagner", "text": "¡Hola! Soy Emma. Trankil, sí soy una niña. Pero cuando se trata de evaluación y sistemas de incentivos, tengo más precisión que un reloj suizo. En mi país, aprender a evaluar es un arte tan riguroso como construir un motor."},
        {"character": "Emma Wagner", "text": "Pero ojo: el rigor no está reñido con el juego. Yo creo en el Kindheitsstaunen — ese asombro infantil que hace que mirar una tabla de puntajes se sienta como abrir un regalo. Sin esa chispa, la evaluación es solo burocracia."},
        {"character": "John Wilkins", "text": "Emma ha sido mi mejor estudiante, y no lo digo a la ligera. Los juegos parecen relojería sin alma a veces, pero ella entiende que cada engranaje — cada puntaje, cada rúbrica, cada feedback — late con intención pedagógica."},
        {"character": "Emma Wagner", "text": "Vamos a diseccionar cómo evalúan los juegos. Verás que no hay una sola forma de hacerlo, y que cada método genera incentivos distintos… algunos muy perversos. Tu misión: aprender a leer los puntajes como yo leo las partituras de Bach. ¡Empezamos!"}
    ]$$::jsonb,
    $$[
        {"character": "Emma Wagner", "locationKey": "maze", "text": "¡Bravo, Agente! Has aprendido a ver más allá de los números. Ahora sabes que toda evaluación es también un mensaje, y que los incentivos hablan más fuerte que las instrucciones."},
        {"character": "John Wilkins", "text": "Impresionante. Has entendido que la precisión sin propósito es solo ruido, y que el asombro sin método es solo caos. Emma, le has enseñado bien."},
        {"character": "Emma Wagner", "text": "Recuerda siempre: cuando diseñes un sistema de evaluación, pregúntate no solo qué mides, sino qué incentivación sin querer. El verdadero arte está en alinear ambos. ¡Bis bald, Agente!"}
    ]$$::jsonb,
    $${
        "slides": [
            {"id": "welcome", "type": "onboarding", "title": "Bienvenida y Conceptos"},
            {"id": "phase1", "type": "actividad", "title": "Fase 1: Disparador de Acción"},
            {"id": "phase2", "type": "actividad", "title": "Fase 2: Disparadores de Meta"},
            {"id": "phase3", "type": "actividad", "title": "Fase 3: Disparadores Farmeables"},
            {"id": "roster", "type": "roster", "title": "Cierre y Podio de la Clase"}
        ]
    }$$::jsonb,
    $${
        "title": "Calibrador de Evaluación e Incentivos",
        "description": "Prueba tu habilidad de diagnóstico analizando sistemas de evaluación de cursos e identificando sus tipos de disparador, consecuencias e incentivos perversos.",
        "questions": [
            {"id": "q1", "scenario": "El docente revisa el portafolio del semestre y asigna una nota del 1 al 10 basándose en su impresión general del esfuerzo y la creatividad del estudiante, sin usar ningún instrumento predefinido.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Rúbrica multicanal", "Criterios dinámicos", "Algoritmo matemático", "Dashboard de información"], "correct": "B", "explanation": "No hay criterios predefinidos ni canales separados. El docente asigna la nota según su juicio subjetivo del momento. Eso es criterios dinámicos."},
            {"id": "q2", "scenario": "Al finalizar la exposición oral, el estudiante recibe una calificación única: Básico si tuvo problemas de comunicación, Intermedio si se expresó con claridad general, o Avanzado si dominó el tema y respondió preguntas del público.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Calificación directa", "Algoritmo matemático", "Rúbrica multicanal", "Efecto sistémico"], "correct": "C", "explanation": "Varios criterios (comunicación, claridad, dominio) se combinan en una sola calificación cualitativa de tres niveles. Es una rúbrica multicanal."},
            {"id": "q3", "scenario": "Cada vez que el estudiante completa un módulo, recibe 10 puntos fijos en su bandeja de logros, sin importar cuántos intentos haya necesitado ni el puntaje obtenido en las evaluaciones internas.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Dashboard de información", "Calificación directa", "Criterios dinámicos", "Rúbrica multicanal"], "correct": "B", "explanation": "La recompensa es fija, estable y directa: 10 puntos por completar. No hay fórmula, subjetividad ni multicanalidad. Es calificación directa."},
            {"id": "q4", "scenario": "Si el estudiante acumula 5 participaciones de calidad en el foro, el sistema le desbloquea el rol de 'Moderador de Debate' con permisos especiales para gestionar hilos de discusión.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Calificación directa", "Algoritmo matemático", "Dashboard de información", "Efecto sistémico"], "correct": "D", "explanation": "No se otorgan puntos ni notas. La consecuencia de la acción es un cambio en el sistema: el desbloqueo de un rol con nuevos permisos. Es un efecto sistémico."},
            {"id": "q5", "scenario": "Al responder correctamente una pregunta del quiz, el estudiante gana 10 puntos base. Si lleva 3 aciertos consecutivos, el puntaje se multiplica por 1.5. Si falla, pierde el multiplicador y gana 0 puntos en esa pregunta.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Rúbrica multicanal", "Criterios dinámicos", "Algoritmo matemático", "Calificación directa"], "correct": "C", "explanation": "Hay una fórmula explícita con multiplicadores, condicionales y reinicio de racha. Es un algoritmo matemático que calcula el puntaje dinámicamente."},
            {"id": "q6", "scenario": "Tras completar la encuesta de clima del aula, el sistema muestra una gráfica de barras con la distribución de respuestas del grupo, sin asignar puntos ni consecuencias a ningún estudiante.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Efecto sistémico", "Dashboard de información", "Calificación directa", "Algoritmo matemático"], "correct": "B", "explanation": "El sistema solo entrega datos estadísticos sin calificación ni cambio en el sistema. El estudiante debe interpretar la información. Es un dashboard de información."},
            {"id": "q7", "scenario": "Al terminar el proyecto en equipo, el docente asigna una nota de 0 a 100 evaluando: contenido (30 pts), organización (25 pts), creatividad (20 pts), fuentes (15 pts) y presentación (10 pts). La suma da la calificación final.", "question": "¿Qué sistema de evaluación describe este escenario?", "options": ["Criterios dinámicos", "Dashboard de información", "Rúbrica multicanal", "Efecto sistémico"], "correct": "C", "explanation": "Aunque parece algorítmico, los puntajes por canal son fijos y se suman directamente. Pero al combinar múltiples canales cualitativos en una sola ecuación (con pesos arbitrarios), es una rúbrica multicanal que mezcla dimensiones distintas en una misma nota."},
            {"id": "q8", "scenario": "Cada vez que el estudiante entrega un resumen de lectura, recibe un sello de 'Completado' en su bitácora de progreso.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Híbrido"], "correct": "A", "explanation": "El estudiante tiene control total sobre la acción (entregar el resumen) y la consecuencia es directa e inmediata. Es un disparador de acción."},
            {"id": "q9", "scenario": "Si el promedio de la clase en el examen supera los 4.0, todos los estudiantes reciben un punto adicional en su nota final.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Automático"], "correct": "B", "explanation": "El resultado no depende del control individual de un estudiante, sino de una condición colectiva que puede o no cumplirse. El estudiante no tiene control directo sobre el promedio final. Es un disparador de meta."},
            {"id": "q10", "scenario": "Cada vez que el estudiante responde correctamente una pregunta en la trivia, acumula 5 puntos. Puede responder tantas veces como quiera.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Continuo"], "correct": "C", "explanation": "La acción es repetible sin límite y cada instancia genera la misma consecuencia. El estudiante puede 'farmear' puntos respondiendo múltiples veces. Es farmeable."},
            {"id": "q11", "scenario": "Si el estudiante logra completar 3 niveles del simulador sin cometer errores, desbloquea el modo difícil.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Condicional"], "correct": "B", "explanation": "La condición ('sin cometer errores') introduce incertidumbre. El estudiante no puede garantizar el resultado aunque intente la acción. Es un disparador de meta."},
            {"id": "q12", "scenario": "Al hacer clic en el botón 'Entregar tarea', el sistema registra la hora de envío y confirma la recepción del archivo.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Pasivo"], "correct": "A", "explanation": "El estudiante controla completamente cuándo hacer clic. La consecuencia (registro y confirmación) es inmediata y predecible. Es un disparador de acción."},
            {"id": "q13", "scenario": "Cada comentario útil que el estudiante publica en el foro le otorga 2 puntos de participación. No hay límite de comentarios por día.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Social"], "correct": "C", "explanation": "La acción se puede repetir sin restricción y cada repetición genera la misma recompensa. El diseño incentiva la acumulación por volumen. Es farmeable."},
            {"id": "q14", "scenario": "Si el equipo logra que todos sus miembros obtengan más de 8 puntos en el quiz individual, reciben una bonificación grupal.", "question": "¿Qué tipo de disparador activa esta evaluación?", "options": ["Acción", "Meta", "Farmeable", "Colaborativo"], "correct": "B", "explanation": "El resultado depende del desempeño de todos los miembros del equipo, no del control de un solo estudiante. Hay incertidumbre sobre si la condición se cumplirá. Es un disparador de meta."},
            {"id": "q15", "scenario": "Un sistema otorga 10 puntos por cada ejercicio completado, sin límite. Los estudiantes descubren que pueden resolver ejercicios de kinder una y otra vez para acumular puntos sin esfuerzo.", "question": "¿Qué problema de diseño de evaluación ilustra este caso?", "options": ["Subjetividad del evaluador", "Incentivo perverso por farming", "Falta de rúbrica", "Baja multicanalidad"], "correct": "B", "explanation": "Al no poner límite ni diferenciar por dificultad, el sistema incentiva la repetición de la tarea más fácil en lugar del aprendizaje real. Es un incentivo perverso por farming."},
            {"id": "q16", "scenario": "El docente asigna la nota del proyecto basándose en 'lo que sintió' al leerlo, sin criterios explícitos. Dos estudiantes con trabajos similares reciben notas muy diferentes.", "question": "¿Qué problema de diseño de evaluación ilustra este caso?", "options": ["Sesgo del evaluador por criterios dinámicos", "Exceso de algoritmos", "Farming de puntos", "Dashboard innecesario"], "correct": "A", "explanation": "Sin rúbrica ni canales definidos, la evaluación depende del estado de ánimo y sesgos del evaluador. La falta de consistencia es el riesgo principal de los criterios dinámicos."},
            {"id": "q17", "scenario": "Un examen combina en una sola nota: ortografía (0-10), conocimientos (0-50), creatividad (0-20) y asistencia (0-20). Un estudiante con ortografía pésima pero conocimiento excelente termina con la misma nota que uno con ortografía perfecta pero conocimiento básico.", "question": "¿Qué problema de diseño ilustra este caso?", "options": ["Gap evaluativo por mezcla de canales", "Falta de farming", "Exceso de objetividad", "Buen dashboard"], "correct": "A", "explanation": "Al sumar canales con distinta naturaleza (conocimiento vs ortografía vs asistencia) en una misma ecuación, se pierde información diagnóstica. No se sabe qué está midiendo realmente la nota. Es un gap evaluativo de rúbrica multicanal."},
            {"id": "q18", "scenario": "Un juego muestra al jugador su puntaje actual, el puntaje del líder, el promedio del grupo y una gráfica de su progreso semanal. No hay recompensas asociadas a estos datos.", "question": "¿Qué función cumple este dashboard?", "options": ["Retroalimentación informativa para la autorregulación", "Calificación sumativa", "Incentivo perverso", "Sistema de recompensas"], "correct": "A", "explanation": "El dashboard entrega datos sin calificar ni recompensar. Su función es permitir que el estudiante analice su posición y ajuste su estrategia. Es retroalimentación pura para la autorregulación."},
            {"id": "q19", "scenario": "Para ganar el trofeo semanal, el estudiante debe responder 50 preguntas. Sin importar si las respuestas son correctas o incorrectas, solo cuenta la cantidad.", "question": "¿Qué incentivo perverso genera este sistema?", "options": ["Cantidad sobre calidad", "Subjetividad del evaluador", "Gap multicanal", "Exceso de dashboard"], "correct": "A", "explanation": "Al premiar solo el volumen, el estudiante aprende a priorizar la velocidad sobre la comprensión. Responde rápido y sin pensar para acumular. El incentivo está desalineado del aprendizaje."},
            {"id": "q20", "scenario": "Un sistema de evaluación usa 6 canales separados: cada habilidad (sintaxis, lógica, creatividad, eficiencia, documentación, trabajo en equipo) genera su propio puntaje en un score board independiente.", "question": "¿Qué ventaja tiene este diseño frente a una rúbrica multicanal que mezcle todo en una nota?", "options": ["Cada canal conserva su información diagnóstica", "Es más fácil de calcular", "Elimina la subjetividad", "Genera más puntos"], "correct": "A", "explanation": "Al mantener los canales separados, el estudiante y el docente pueden ver exactamente en qué habilidades hay fortalezas y debilidades. No se pierde información al promediar canales distintos."},
            {"id": "q21", "scenario": "Un juego de aprendizaje otorga una insignia especial solo a los 3 estudiantes con más puntos al final del mes. Los estudiantes dejan de ayudarse entre sí para maximizar su propio puntaje individual.", "question": "¿Qué problema de diseño revela este caso?", "options": ["Incentivo perverso que destruye la colaboración", "Buen uso de metas", "Dashboard efectivo", "Algoritmo justo"], "correct": "A", "explanation": "La competencia por un recurso escaso (solo 3 insignias) transforma la dinámica social de colaboración a competencia. El sistema de evaluación está incentivando comportamiento contrario al objetivo pedagógico."}
        ]
    }$$::jsonb,
    $${
        "title": "Canvas de Diseñador de Sistemas de Evaluación",
        "description": "Diseña tus propios sistemas de evaluación con mecánicas de juego. Tu idea debe incluir un disparador y un criterio, y de forma opcional algoritmo, efecto sistémico y dashboard.",
        "fields": [
            {"driver": "disparador", "label": "Disparador", "placeholder": "Selecciona el disparador: Acción, Meta o Farmeable..."},
            {"driver": "criterioParametro", "label": "Criterio / Parámetro", "placeholder": "Describe qué se va a medir exactamente..."},
            {"driver": "algoritmoMatematico", "label": "Algoritmo Matemático (Opcional)", "placeholder": "Fórmula o lógica de puntuación..."},
            {"driver": "efectoSistemico", "label": "Efecto Sistémico (Opcional)", "placeholder": "¿Qué se desbloquea o cambia en el sistema?..."},
            {"driver": "dashboardInformacion", "label": "Dashboard de Información (Opcional)", "placeholder": "¿Qué datos se muestran para la autorregulación?..."}
        ]
    }$$::jsonb,
    $$[
        {"id": "doc_design7", "url": "/learn_resources/resources/world7/diseno_mundo7_detras_de_camaras.pdf", "cost": 0, "desc": "Documento técnico sobre el diseño y la arquitectura pedagógica y lúdica completa del Mundo 7.", "type": "pdf", "title": "Detrás de cámaras: Evaluación e Incentivos"},
        {"id": "doc_summary7", "url": "/learn_resources/resources/world7/resumen_teorico_mundo7.pdf", "cost": 0, "desc": "Guía conceptual resumida sobre disparadores, sistemas de evaluación, incentivos perversos y BEM.", "type": "pdf", "title": "Resumen teórico: Sistemas de Evaluación e Incentivos"},
        {"id": "paper_mekler", "url": "/learn_resources/resources/world7/mekler_2017_gamification_elements.pdf", "cost": 15, "desc": "Investigación empírica que aísla los efectos de puntos, niveles y tablas de posiciones sobre la motivación y rendimiento.", "type": "pdf", "title": "Towards Understanding the Effects of Individual Gamification Elements"},
        {"id": "paper_lipnevich", "url": "/learn_resources/resources/world7/lipnevich_panadero_2021_feedback_models.pdf", "cost": 20, "desc": "Revisión exhaustiva de los principales modelos y teorías de feedback en educación y entornos digitales.", "type": "pdf", "title": "A Review of Feedback Models and Theories"},
        {"id": "paper_johnson", "url": "/learn_resources/resources/world7/johnson_2017_feedback_serious_games.pdf", "cost": 15, "desc": "Guía práctica sobre cómo estructurar mensajes de feedback efectivos que impulsen el aprendizaje y retención.", "type": "pdf", "title": "Designing Effective Feedback Messages in Serious Games"},
        {"id": "paper_harackiewicz", "url": "/learn_resources/resources/world7/harackiewicz_1979_reward_feedback.pdf", "cost": 20, "desc": "Estudio clásico sobre cómo las contingencias de recompensa y el tipo de feedback afectan la motivación intrínseca.", "type": "pdf", "title": "The Effects of Reward Contingency and Performance Feedback"}
    ]$$::jsonb,
    '2026-07-06 10:26:24.827522+00'
) ON CONFLICT (id) DO UPDATE SET 
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    narrative_place = EXCLUDED.narrative_place,
    narrative_objective = EXCLUDED.narrative_objective,
    narrative_mentor = EXCLUDED.narrative_mentor,
    narrative_intro = EXCLUDED.narrative_intro,
    narrative_outro = EXCLUDED.narrative_outro,
    workshop_modules = EXCLUDED.workshop_modules,
    training_modules = EXCLUDED.training_modules,
    design_modules = EXCLUDED.design_modules,
    wiki_modules = EXCLUDED.wiki_modules;

-- Reset sequence to 8
SELECT setval('course_worlds_id_seq', (SELECT MAX(id) FROM public.course_worlds));
