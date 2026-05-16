export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface BEMCardData {
	id: number;
	title: string;
	type: string;
	rarity: CardRarity;
	description: string;
}

export const cardsData: Record<string, BEMCardData[]> = {
	es: [
		{ id: 1, title: 'Experience Points (XP)', type: 'Punto', rarity: 'Common', description: 'Diseñados para hacer visible el progreso en el tiempo, los XP no se gastan ni habilitan acciones directas. Fomentan un sentido de avance constante.' },
		{ id: 2, title: 'Bet Points (Puntos de Apuesta)', type: 'Punto', rarity: 'Rare', description: 'Miden el nivel de riesgo que el jugador está dispuesto a asumir frente a la incertidumbre. Elevan la tensión emocional y el aprendizaje.' },
		{ id: 3, title: 'Hindrance Points (Penalización)', type: 'Punto', rarity: 'Epic', description: 'Operan bajo la motivación de evitación. Introducen una tensión productiva que captura la atención de inmediato para mitigar consecuencias negativas.' },
		{ id: 4, title: 'Beauty Scores (Belleza)', type: 'Punto', rarity: 'Legendary', description: 'Capturan juicios puramente estéticos o cualitativos. Conectan con el hedonismo y el placer sensorial, elevando la experiencia a un arte vivencial.' },
		{ id: 5, title: 'Sandbox Game (Caja de Arena)', type: 'Game Schema', rarity: 'Legendary', description: 'Esquema abierto impulsado por el Descubrimiento y la Creatividad. Maximiza la agencia y la autonomía del jugador.' },
		{ id: 6, title: 'Economic Engine (Motor Económico)', type: 'Game Schema', rarity: 'Rare', description: 'Desafía al jugador a construir bucles de generación y reinversión de recursos. Enseña a priorizar decisiones tácticas.' },
		{ id: 7, title: 'Morality Game (Juego de Moralidad)', type: 'Game Schema', rarity: 'Epic', description: 'Confronta al jugador con dilemas éticos donde no hay respuesta correcta evidente. Las decisiones definen el carácter del usuario.' },
		{ id: 8, title: 'Tactical Randomness (Azar Táctico)', type: 'Mecánica', rarity: 'Rare', description: 'Define las condiciones iniciales del problema antes de que el jugador actúe. Obliga a adaptar la estrategia en tiempo real.' },
		{ id: 9, title: 'Interactive Failure (Fracaso Interactivo)', type: 'Bucle de Juego', rarity: 'Epic', description: 'El error es el mecanismo principal de aprendizaje. Cada derrota entrega información vital que reduce la incertidumbre.' },
		{ id: 10, title: 'Epic Identity (Identidad Épica)', type: 'Driver', rarity: 'Legendary', description: 'El motivador más elevado. Acciones que contribuyen a un significado a largo plazo o una causa trascendente.' },
		{ id: 11, title: 'Mastery & Progress', type: 'Driver', rarity: 'Common', description: 'Deseo de superar retos y experimentar el estado de Flow. La recompensa real es la sensación neurológica de competencia.' },
		{ id: 12, title: 'Discriminatory Signal', type: 'Feedback', rarity: 'Epic', description: 'Respuesta unívoca y reconocible al instante. Reduce la carga cognitiva al transmitir información precisa sobre el estado del juego.' },
		{ id: 13, title: 'Deferred Goal (Meta Diferida)', type: 'Meta', rarity: 'Rare', description: 'Objetivos a largo plazo que el jugador decide perseguir. Evita el diseño transaccional centrando el esfuerzo en la anticipación.' },
		{ id: 14, title: 'Secondary Quests', type: 'Meta', rarity: 'Common', description: 'Metas voluntarias que ofrecen autonomía pura. Adaptan la dificultad a diversos perfiles motivacionales.' },
		{ id: 15, title: 'The Hacker (El Hacker)', type: 'Arquetipo', rarity: 'Epic', description: 'Sub-arquetipo movido por la Maestría. Busca los límites y atajos del sistema. El diseño canaliza su energía en metas ocultas.' },
		{ id: 16, title: 'Reaction Game', type: 'Game Schema', rarity: 'Common', description: 'Exige respuestas instintivas bajo presión. La tensión y el estrés controlado generan picos de adrenalina y repetición constante.' },
		{ id: 17, title: 'Currency Points (Monedas)', type: 'Punto', rarity: 'Common', description: 'Habilitan economías y mercados. Permiten tomar decisiones estratégicas de gasto y otorgan autonomía al elegir beneficios.' },
		{ id: 18, title: 'Positive Feedback Loop', type: 'Game Loop', rarity: 'Rare', description: 'Regla donde el éxito facilita éxitos futuros. Empodera al jugador pero requiere balance para no destruir la incertidumbre.' },
		{ id: 19, title: 'Incomplete Information', type: 'Mecánica', rarity: 'Rare', description: 'Ocultar fragmentos clave para encender la curiosidad. Fuerza a formular hipótesis y tomar riesgos calculados.' },
		{ id: 20, title: 'Hedonism & Aesthetics', type: 'Driver', rarity: 'Epic', description: 'Búsqueda de la belleza y el asombro sensorial. Esencial para el Onboarding, generando atracción magnética inmediata.' }
	],
	en: [
		{ id: 1, title: 'Experience Points (XP)', type: 'Point', rarity: 'Common', description: 'Designed to make progress visible over time, XP is not spent but fosters a sense of constant advancement.' },
		{ id: 2, title: 'Bet Points', type: 'Point', rarity: 'Rare', description: 'Measures the level of risk the player is willing to take against uncertainty. Elevates emotional tension and learning.' },
		{ id: 3, title: 'Hindrance Points', type: 'Point', rarity: 'Epic', description: 'Operates under avoidance motivation. Introduces productive tension to capture attention and mitigate negative consequences.' },
		{ id: 4, title: 'Beauty Scores', type: 'Point', rarity: 'Legendary', description: 'Captures purely aesthetic or qualitative judgments. Connects with hedonism and sensory pleasure.' },
		{ id: 5, title: 'Sandbox Game', type: 'Game Schema', rarity: 'Legendary', description: 'An open game schema driven by Discovery and Creativity. Maximizes player agency and autonomy.' },
		{ id: 6, title: 'Economic Engine', type: 'Game Schema', rarity: 'Rare', description: 'Challenges the player to build loops of resource generation and reinvestment. Teaches tactical prioritization.' },
		{ id: 7, title: 'Morality Game', type: 'Game Schema', rarity: 'Epic', description: 'Confronts the player with ethical dilemmas with no clear correct answer. Decisions define the user\'s character.' },
		{ id: 8, title: 'Tactical Randomness', type: 'Mechanic', rarity: 'Rare', description: 'Defines initial problem conditions before the player acts. Forces strategy adaptation in real-time.' },
		{ id: 9, title: 'Interactive Failure', type: 'Game Loop', rarity: 'Epic', description: 'Failure is the primary learning mechanism. Each defeat provides vital information to reduce uncertainty.' },
		{ id: 10, title: 'Epic Identity', type: 'Driver', rarity: 'Legendary', description: 'The highest motivator. Actions that contribute to a long-term meaning or a grand cause.' },
		{ id: 11, title: 'Mastery & Progress', type: 'Driver', rarity: 'Common', description: 'Desire to overcome challenges and experience Flow. Real reward is the neurological sensation of competence.' },
		{ id: 12, title: 'Discriminatory Signal', type: 'Feedback', rarity: 'Epic', description: 'Immediate, recognizable system response. Reduces cognitive load by transmitting precise state information.' },
		{ id: 13, title: 'Deferred Goal', type: 'Goal', rarity: 'Rare', description: 'Long-term objectives that the player chooses to pursue. Avoids transactional design by centering on anticipation.' },
		{ id: 14, title: 'Secondary Quests', type: 'Goal', rarity: 'Common', description: 'Voluntary goals that offer pure autonomy. Dynamically adapts difficulty to various motivational profiles.' },
		{ id: 15, title: 'The Hacker', type: 'Archetype', rarity: 'Epic', description: 'Sub-archetype driven by Mastery. Seeks system limits and shortcuts. Design channels this energy into hidden goals.' },
		{ id: 16, title: 'Reaction Game', type: 'Game Schema', rarity: 'Common', description: 'Demands instinctive responses under pressure. Controlled stress and tension generate adrenaline and engagement.' },
		{ id: 17, title: 'Currency Points', type: 'Point', rarity: 'Common', description: 'Enables economies and markets. Allows strategic spending decisions and grants autonomy in choosing benefits.' },
		{ id: 18, title: 'Positive Feedback Loop', type: 'Game Loop', rarity: 'Rare', description: 'A rule where success facilitates future success. Empowers the player but requires careful balancing.' },
		{ id: 19, title: 'Incomplete Information', type: 'Mechanic', rarity: 'Rare', description: 'Hiding key system fragments to ignite curiosity. Forces players to formulate hypotheses and take risks.' },
		{ id: 20, title: 'Hedonism & Aesthetics', type: 'Driver', rarity: 'Epic', description: 'Driven by beauty and sensory wonder. Essential for Onboarding, generating immediate magnetic attraction.' }
	]
};
