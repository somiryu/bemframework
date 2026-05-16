export type Lang = 'en' | 'es';

export const bemContent = {
	en: {
		seo: {
			title: 'BEM Framework | Advanced Gamification Design System',
			description: 'Behavior • Experience • Meaning (BEM). A systemic design methodology for creating high-performance engagement through intrinsic motivation.',
			keywords: 'gamification, systemic design, behavioral design, intrinsic motivation, BEM framework'
		},
		hero: {
			title: 'A Structural Framework for Advanced Gamification',
			description:
				'Behavior • Experience • Meaning (BEM) is a systemic design discipline grounded in intrinsic motivation and architectural coherence.',
			buttons: [
				{ text: 'For Learning', link: '/en/learning', type: 'primary' },
				{ text: 'Answer Trivia', link: '#trivia', type: 'secondary' }
			]
		},

		positioning: {
			title: 'Gamification Has a Structural Problem',
			paragraphs: [
				'Most current systems suffer from what we in the industry know as "lazy gamification". They limit themselves to overlaying superficial reward structures—classic Skinner boxes driven by Points, Badges, and Leaderboards (PBLs)—over inherently weak engagement models.',
				'By relying on extrinsic motivators to push users, these systems end up turning interaction into repetitive and mercenary work (farming) that, in the long run, generates burnout, destroys intrinsic motivation, and is even perceived as exploitation.',
				'BEM (Behavior • Experience • Meaning) reformulates this approach from its root. Gamification is not a simple toolbox with isolated mechanics scattered over a problem, but a multidisciplinary systemic design discipline.',
				'Instead of trying to manipulate behavior by isolating variables, BEM optimizes the experience by managing information flow, decision architecture, and uncertainty. It transforms isolated tasks into playful cycles of interactive learning, where the true engine of retention is born from facing meaningful challenges, discovering the system, and exercising true autonomy.'
			]
		},

		gameDesign: {
			title: 'Game-Inspired Design: The Invisible Architecture of Engagement',
			intro: 'The BEM model is not about making corporate video games, nor about disguising serious processes under childish themes or expensive simulators. True gamification is, for the most part, invisible.',
			description: 'It consists of decoding the learning practices, decision architecture, and psychology that make good games inherently captivating, to integrate them organically into real life, in products, services, and work environments.',
			footer: 'Instead of relying on superficial rewards or forcing users to "play," a BEM designer uses the true toolkit of game creators to optimize reality. Our tools are not points and badges, but the systems that operate under the hood:',
			items: [
				{
					title: 'Systemic Goal Design',
					description: 'Games don\'t tell you what to learn; they give you a challenge that requires you to learn it to overcome it. BEM designs ecosystems of goals (main, secondary, and micro-challenges) that grant autonomy to the user, generate constant anticipation, and demand strategic thinking instead of simple mechanical repetition.'
				},
				{
					title: 'Playful Learning Cycles (Core Loops)',
					description: 'Learning and engagement don\'t happen at the final goal, but in the day-to-day micro-interactions. We structure the experience in continuous loops of "action - response - adjustment," where the user solves problems through exploration, reducing the cost of failure to incentivize resilience and discovery.'
				},
				{
					title: 'Feedback Models',
					description: 'Feedback is not a prize at the end of a task; it\'s the language that makes interaction possible. We design coherent, timely signals with emotional resonance that guide the user, reduce their uncertainty when facing complex problems, and recapture their attention in real-time.'
				}
			]
		},

		architecture: {
			title: 'System Architecture',
			description:
				'BEM aligns intrinsic drivers with architectural schemas and operational mechanics. Engagement emerges through layered structural coherence.',
			summary: 'The BEM system operates as a comprehensive design cycle that connects strategic scope definition with game architecture and learning loops. Through the precise alignment of goals and the seven intrinsic drivers, the framework ensures total systemic coherence from scope to iteration.',
			image: '/bem/bem system.png'
		},

		paradigms: {
			title: 'The Three Paradigms',
			intro: 'The BEM model guides design metrics to integrally align system goals with the user\'s interests and well-being. Project success is guaranteed by evaluating three fundamental dimensions:',
			items: [
				{
					title: 'Behavioral Paradigm',
					description:
						'Defines Key Behavioral Indicators (KBI) through the lens of intent: deciphering the "Why do I do it?" to build coherent interaction structures.'
				},
				{
					title: 'Experiential Paradigm',
					description:
						'Establishes Key Experiential Indicators (KEI) based on journey emotions and design pacing, managing tension and delight.'
				},
				{
					title: 'Meaningful Paradigm',
					description:
						'Defines Key Learning Indicators (KLI) as progress systems that measure real growth and user evolution within the ecosystem.'
				}
			]
		},

		drivers: {
			title: 'The Seven Intrinsic Drivers',
			intro: 'The BEM framework uses 7 core intrinsic motivators to structure the design process. They function as hypotheses about human drive, ensuring the system offers meaningful choices by aligning with intrinsic impulses rather than manipulation.',
			items: [
				{ slug: 'identity', title: 'Epic Identity & Purpose', color: 'purple', description: 'Focuses on long-term meaning through values and ideologies, making actions contribute to a grand narrative.' },
				{ slug: 'discovery', title: 'Discovery & Creativity', color: 'green', description: 'Fueled by curiosity, inviting users to explore the unknown, experiment, and solve mysteries.' },
				{ slug: 'empowerment', title: 'Empowerment & Control', color: 'green', description: 'Centered on autonomy, competition, and influence over the system or environment.' },
				{ slug: 'mastery', title: 'Mastery & Progress', color: 'orange', description: 'Focused on skill development and overcoming challenges through balanced difficulty cycles (Flow).' },
				{ slug: 'relatedness', title: 'Relatedness & Empathy', color: 'orange', description: 'Based on the need for belonging and social connection, fostering trust and cooperation.' },
				{ slug: 'efficiency', title: 'Efficiency & Productivity', color: 'red', description: 'Driven by resource management and optimization to minimize effort and maximize results.' },
				{ slug: 'hedonism', title: 'Hedonism & Aesthetic Pleasure', color: 'red', description: 'Focuses on sensory and emotional experience, seeking beauty, comfort, and awe.' }
			]
		},

		discipline: {
			title: 'Beyond Mechanics. Toward Discipline',
			intro: 'Swordsmanship is a discipline; the sword, a simple tool. BEM elevates gamification into a rigorous design discipline, studying the triad of player motivation, game system architecture, and the real-world environment.',
			areasTitle: 'Areas of Study: Game Design at the Center',
			areasIntro: 'Like an architect studying more than bricks, a BEM disciple structures knowledge with Game Design as the gravitational core, exploring adjacent fields to nurture their criteria:',
			areas: [
				{ title: 'Systemic & Experience Design', description: 'Structuring long-term interaction cycles.' },
				{ title: 'Info-engineering & Semiotics', description: 'Managing complexity and interface language.' },
				{ title: 'Behavioral & Neuroscience', description: 'Understanding decision-making under uncertainty.' },
				{ title: 'Motivation & Cognition', description: 'Anchoring design in deep psychological needs.' },
				{ title: 'Pedagogy & Learning Science', description: 'Scaffolding and action-based knowledge.' },
				{ title: 'Emotion Theory', description: 'Mapping sensory journeys and Flow states.' }
			],
			skillsTitle: 'BEM Disciple Skills',
			skillsIntro: 'Dominion over these areas provides the designer with indispensable strategic skills to intervene in reality:',
			skills: [
				{ title: 'Systemic Vision & Anticipation', description: 'Predicting reactions and avoiding undesirable emergent behaviors.' },
				{ title: 'Info & Difficulty Management', description: 'Modulating cognitive load and learning curves.' },
				{ title: 'Decision Architecture', description: 'Guiding behavior through meaningful, voluntary options.' },
				{ title: 'Experimentation & Feedback', description: 'Constant iteration as the true engine of design.' }
			]
		},

		creator: {
			name: 'Javier Velásquez',
			photo: '/Javier Velasquez.jpeg',
			about: [
				'Award-winning gamification designer and founder of the BEM framework.',
				'Winner of 4 international Gamicon - TechMagazine awards for Gamification + Learning projects.',
				'Javier has helped over 100 companies meet their goals through meaningful gamification designs that create engagement in learning, workplace, sales, and loyalty.'
			],
			skills: 'Gamification Design • Engagement Management • Training and Development (HR) • Loyalty Programs • Behavior Management',
			linkedin: 'https://www.linkedin.com/in/javier-velasquez-game/',
			whatsapp: 'https://wa.me/573125185990'
		}
	},

	es: {
		seo: {
			title: 'BEM Framework | Sistema de Diseño de Gamificación Avanzada',
			description: 'Behavior • Experience • Meaning (BEM). Una metodología de diseño sistémico para crear compromiso de alto rendimiento mediante motivación intrínseca.',
			keywords: 'gamificación, diseño sistémico, diseño conductual, motivación intrínseca, marco BEM'
		},
		hero: {
			title: 'Un Marco Estructural para la Gamificación Avanzada',
			description: 'Behavior • Experience • Meaning (BEM) es una disciplina de diseño sistémico basada en motivación intrínseca.',
			buttons: [
				{ text: 'Para Aprender', link: '/es/learning', type: 'primary' },
				{ text: 'Responder Trivia', link: '#trivia', type: 'secondary' }
			]
		},

		positioning: {
			title: 'La Gamificación Tiene un Problema Estructural',
			paragraphs: [
				'La mayoría de los sistemas actuales sufren de lo que en la industria conocemos como "gamificación perezosa". Se limitan a superponer estructuras de recompensa superficiales —las clásicas cajas de Skinner impulsadas por Puntos, Medallas y Tablas de Clasificación (PBLs)— sobre modelos de engagement inherentemente débiles.',
				'Al depender de motivadores extrínsecos para presionar a los usuarios, estos sistemas terminan convirtiendo la interacción en un trabajo repetitivo y mercenario (farming) que, a largo plazo, genera agotamiento, destruye la motivación intrínseca e incluso se percibe como explotación.',
				'BEM (Behavioral-Experiential-Meaningful) reformula este enfoque desde su raíz. La gamificación no es una simple caja de herramientas con mecánicas aisladas que se esparcen sobre un problema, sino una disciplina de diseño sistémico multidisciplinar.',
				'En lugar de intentar manipular el comportamiento aislando variables, BEM optimiza la experiencia gestionando el flujo de información, la arquitectura de decisiones y la incertidumbre. Transforma tareas aisladas en ciclos lúdicos de aprendizaje interactivo, donde el verdadero motor de la retención nace de enfrentar retos significativos, descubrir el sistema y ejercer verdadera autonomía.'
			]
		},

		gameDesign: {
			title: 'Diseño Inspirado en Juegos: La Arquitectura Invisible del Engagement',
			intro: 'El modelo BEM no consiste en fabricar videojuegos corporativos, ni en disfrazar procesos serios bajo temáticas infantiles o simuladores costosos. La verdadera gamificación es, en su mayor parte, invisible.',
			description: 'Consiste en decodificar las prácticas de aprendizaje, la arquitectura de decisiones y la psicología que hacen que los buenos juegos sean inherentemente cautivadores, para integrarlas de manera orgánica en la vida real, en productos, servicios y entornos de trabajo.',
			footer: 'En lugar de depender de recompensas superficiales o de obligar a los usuarios a "jugar", un diseñador BEM utiliza el verdadero toolkit (caja de herramientas) de los creadores de juegos para optimizar la realidad. Nuestras herramientas no son los puntos y las medallas, sino los sistemas que operan bajo el capó:',
			items: [
				{
					title: 'Diseño Sistémico de Objetivos',
					description: 'Los juegos no te dicen qué aprender; te dan un desafío que requiere que lo aprendas para superarlo. BEM diseña ecosistemas de metas (principales, secundarias y micro-retos) que otorgan autonomía al usuario, generan anticipación constante y exigen pensamiento estratégico en lugar de simple repetición mecánica.'
				},
				{
					title: 'Ciclos Lúdicos de Aprendizaje (Core Loops)',
					description: 'El aprendizaje y el enganche no ocurren en la meta final, sino en las micro-interacciones del día a día. Estructuramos la experiencia en bucles continuos de "acción - respuesta - ajuste", donde el usuario resuelve problemas a través de la exploración, reduciendo el costo del fracaso para incentivar la resiliencia y el descubrimiento.'
				},
				{
					title: 'Modelos de Retroalimentación (Feedback)',
					description: 'El feedback no es un premio al final de una tarea; es el lenguaje que hace posible la interacción. Diseñamos señales coherentes, oportunas y con resonancia emocional que orientan al usuario, reducen su incertidumbre frente a problemas complejos y recapturan su atención en tiempo real.'
				}
			]
		},

		architecture: {
			title: 'Arquitectura Sistémica',
			description:
				'BEM alinea motivadores intrínsecos con esquemas arquitectónicos y mecánicas operativas. El compromiso surge a través de una coherencia estructural en capas.',
			summary: 'El sistema BEM opera como un ciclo de diseño integral que conecta la definición estratégica del alcance con la arquitectura lúdica y los bucles de aprendizaje. A través de la alineación precisa entre los objetivos y los siete motivadores intrínsecos, el marco garantiza una coherencia sistémica total desde el alcance hasta la iteración.',
			image: '/bem/bem system.png'
		},

		paradigms: {
			title: 'Los Tres Paradigmas',
			intro: 'El modelo BEM orienta las métricas de diseño para alinear integralmente los objetivos del sistema con los intereses y el bienestar del usuario. El éxito de un proyecto se garantiza evaluando tres dimensiones fundamentales:',
			items: [
				{ title: 'Paradigma Conductual', description: 'Define los Key Behavioral Indicators (KBI) analizados a través de la intención conductual: descifrar el "¿por qué lo hago?" para diseñar estructuras coherentes.' },
				{ title: 'Paradigma Experiencial', description: 'Establece los Key Experiential Indicators (KEI) en función de las emociones del journey y el ritmo del diseño, gestionando la tensión y el deleite.' },
				{ title: 'Paradigma de Sentido', description: 'Define los Key Learning Indicators (KLI) como sistemas de progreso que miden el crecimiento real y la evolución del usuario en el sistema.' }
			]
		},

		drivers: {
			title: 'Los Siete Motivadores Intrínsecos',
			intro: 'El marco BEM utiliza 7 impulsores intrínsecos centrales para estructurar el diseño. No son un mecanismo de perfilamiento exacto, sino una hipótesis sobre qué lleva a alguien a invertir su energía, garantizando que el sistema ofrezca opciones significativas en lugar de manipular.',
			items: [
				{ slug: 'identity', title: 'Identidad Épica y Propósito', color: 'purple', description: 'Enfocado en el significado a largo plazo a través de valores y morales, haciendo sentir al jugador que sus acciones contribuyen a una narrativa grandiosa.' },
				{ slug: 'discovery', title: 'Descubrimiento y Creatividad', color: 'green', description: 'Alimentado por la curiosidad ante la incertidumbre, invita a explorar lo desconocido, experimentar y resolver misterios.' },
				{ slug: 'empowerment', title: 'Empoderamiento y Control', color: 'green', description: 'Centrado en la autonomía externa y la influencia, apela a la necesidad de ejercer dominio sobre el sistema y ganar certeza frente al entorno.' },
				{ slug: 'mastery', title: 'Maestría y Progreso', color: 'orange', description: 'Enfocado en el desarrollo de habilidades y superación de retos mediante dificultad equilibrada (Flow) y sensación de competencia.' },
				{ slug: 'relatedness', title: 'Vinculación y Empatía', color: 'orange', description: 'Basado en la necesidad de pertenencia y conexión social, fomenta la confianza, la cooperación y el trabajo en equipo.' },
				{ slug: 'efficiency', title: 'Eficiencia y Productividad', color: 'red', description: 'Impulsado por la gestión de recursos y optimización para ahorrar tiempo, minimizar el esfuerzo y maximizar resultados.' },
				{ slug: 'hedonism', title: 'Hedonismo y Placer Estético', color: 'red', description: 'Se centra en la experiencia emocional y sensorial, impulsando a buscar la belleza, la comodidad y el asombro.' }
			]
		},

		discipline: {
			title: 'Beyond Mechanics. Toward Discipline',
			intro: 'El manejo de la espada es una disciplina; la espada, una simple herramienta. BEM eleva la gamificación a una rigurosa disciplina de diseño, estudiando la relación triádica entre las motivaciones del jugador, la arquitectura del sistema y el entorno real.',
			areasTitle: 'Las Áreas de Estudio: El Diseño de Juegos en el Centro',
			areasIntro: 'Al igual que un arquitecto no solo estudia ladrillos, un discípulo de BEM estructura su conocimiento con el Diseño de Juegos como núcleo gravitacional:',
			areas: [
				{ title: 'Diseño Sistémico y de Experiencia', description: 'Para estructurar flujos lúdicos y ciclos de interacción a largo plazo.' },
				{ title: 'Info-ingeniería y Semiótica', description: 'Para dominar la gestión de la complejidad y comprender el lenguaje de las interfaces.' },
				{ title: 'Ciencias del Comportamiento y Neurociencia', description: 'Para entender la toma de decisiones bajo incertidumbre y las heurísticas del cerebro.' },
				{ title: 'Teorías de la Motivación y Cognición', description: 'Para anclar el diseño en las necesidades psicológicas profundas.' },
				{ title: 'Pedagogy y Ciencias del Aprendizaje', description: 'Para estructurar el conocimiento mediante el andamiaje (scaffolding).' },
				{ title: 'Teorías de las Emociones', description: 'Para mapear el viaje sensorial y gestionar los picos de tensión y Flow.' }
			],
			skillsTitle: 'Las Habilidades (Skills) del Discípulo BEM',
			skillsIntro: 'El dominio de estas áreas dota al diseñador de habilidades prácticas estratégicas para intervenir la realidad:',
			skills: [
				{ title: 'Visión Sistémica y Anticipación', description: 'Predecir reacciones y evitar comportamientos emergentes indeseados.' },
				{ title: 'Gestión de la Información y la Dificultad', description: 'Modular la carga cognitiva y diseñar curvas de aprendizaje elegantes.' },
				{ title: 'Arquitectura de Decisiones', description: 'Guiar el comportamiento creando opciones significativas y acción voluntaria.' },
				{ title: 'Experimentación y Mejora desde el Feedback', description: 'Usar la iteración constante como el verdadero motor de diseño.' }
			]
		},

		creator: {
			name: 'Javier Velásquez',
			photo: '/Javier Velasquez.jpeg',
			about: [
				'Diseñador de gamificación galardonado y fundador del marco BEM.',
				'Ganador de 4 premios internacionales Gamicon - TechMagazine por proyectos de Gamification + Learning.',
				'Javier ha ayudado a más de 100 empresas a cumplir sus objetivos mediante diseños de gamificación significativos.'
			],
			skills: 'Diseño de Gamificación • Gestión de Compromiso • Capacitación y Desarrollo • Programas de Lealtad • Gestión de Comportamiento',
			linkedin: 'https://www.linkedin.com/in/javier-velasquez-game/',
			whatsapp: 'https://wa.me/573125185990'
		}
	}
};
