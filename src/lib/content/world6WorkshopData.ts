export interface WorkshopSlide6 {
	id: number;
	part: 1 | 2 | 3;
	type: 'selection';
	title: string;
	concept: string;
	scenario: string;
	options: { id: string; text: string; letter: string }[];
	correctOption?: string;
	giochiFeedback: string;
}

export const world6WorkshopSlides: WorkshopSlide6[] = [
	// FASE 1: ECONOMÍA CONDUCTUAL (MICRO-EXPERIMENTOS PSICOLÓGICOS)
	{
		id: 1,
		part: 1,
		type: 'selection',
		title: 'Slide F1.1: Ilusión de Patrones y Aleatoriedad',
		concept: 'Economía Conductual: El cerebro humano busca patrones lógicos incluso en el puro azar.',
		scenario: 'Se presentan dos secuencias de números. Determina cuál de ellas fue generada por un algoritmo de azar real y no por un humano.',
		options: [
			{ id: 'a', letter: 'A', text: '2 2 4 6 4 5 8 9 5 8 3 3 3' },
			{ id: 'b', letter: 'B', text: '4 7 2 6 8 3 5 8 4 2 5 7 2' }
		],
		correctOption: 'a',
		giochiFeedback: 'El cerebro busca patrones constantemente. La opción B fue creada por un humano tratando de imitar el azar (evitando repetir números seguidos para que parezca "desordenado"). La opción A presenta rachas naturales (2 2 y 3 3 3), lo cual es estadísticamente normal en procesos de azar verdaderos.'
	},
	{
		id: 2,
		part: 1,
		type: 'selection',
		title: 'Slide F1.2: Efecto Señuelo (Decoy Effect) en Suscripciones',
		concept: 'Economía Conductual: El señuelo altera asimétricamente el valor percibido.',
		scenario: 'Elige la opción de suscripción que prefieras para la biblioteca de recursos:',
		options: [
			{ id: 'a', letter: 'A', text: 'Suscripción Digital únicamente por 30 BEM Coins.' },
			{ id: 'b', letter: 'B', text: 'Suscripción Impresa únicamente por 50 BEM Coins.' },
			{ id: 'c', letter: 'C', text: 'Suscripción Impresa + Digital por 50 BEM Coins.' }
		],
		giochiFeedback: 'En el experimento clásico de Dan Ariely, la mera presencia de la Opción B (el "señuelo") hace que la Opción C parezca un regalo ineludible, disparando los votos hacia C. Sin la opción B, la mayoría de personas eligen la opción más económica (A).'
	},
	{
		id: 3,
		part: 1,
		type: 'selection',
		title: 'Slide F1.3: Heurística de Disponibilidad y Miedo',
		concept: 'Economía Conductual: Las noticias alarmantes influyen en la estimación de riesgos.',
		scenario: '¿Cuál crees que es la probabilidad real de que una persona promedio salga a la calle en una gran ciudad como Bogotá y sea víctima de un robo en un día cualquiera?',
		options: [
			{ id: 'a', letter: 'A', text: 'Menos de 10%' },
			{ id: 'b', letter: 'B', text: 'Entre 11% y 20%' },
			{ id: 'c', letter: 'C', text: 'Entre 21% y 40%' },
			{ id: 'd', letter: 'D', text: 'Más de 41%' }
		],
		correctOption: 'a',
		giochiFeedback: 'Las estadísticas reales de criminalidad indican que la probabilidad diaria por persona es inferior al 10%. Sin embargo, sobreestimamos masivamente su probabilidad (eligiendo opciones más altas) debido a que el miedo y las noticias vívidas hacen que estos eventos estén muy disponibles en nuestra memoria.'
	},
	{
		id: 4,
		part: 1,
		type: 'selection',
		title: 'Slide F1.4: Aversión a la Pérdida en Ganancias (Loss Aversion)',
		concept: 'Economía Conductual: El dolor de perder supera la atracción de ganar.',
		scenario: 'Te ofrecen elegir entre dos opciones financieras para tu balance de saldo. ¿Cuál prefieres?',
		options: [
			{ id: 'a', letter: 'A', text: 'Recibir 200 BEM Coins seguros de inmediato.' },
			{ id: 'b', letter: 'B', text: 'Lanzar una moneda de 4 caras. Si sale 1, ganas 800 BEM Coins; si sale cualquier otra cara, ganas 0.' }
		],
		giochiFeedback: 'Aunque el valor esperado matemático de ambas opciones es el mismo (200 BEM Coins), la mayoría de personas eligen la opción segura (A). La aversión al riesgo ante la ganancia hace que el dolor psicológico de perder una recompensa garantizada supere la atracción de ganar más al azar.'
	},
	{
		id: 5,
		part: 1,
		type: 'selection',
		title: 'Slide F1.5: Efecto Enmarque (Framing Effect) y Supervivencia',
		concept: 'Economía Conductual: La presentación de la información altera las elecciones.',
		scenario: 'Te diagnostican una dolencia y debes elegir un tratamiento de forma inmediata. ¿Cuál elegirías?',
		options: [
			{ id: 'a', letter: 'A', text: 'Tratamiento X, que tiene un 80% de probabilidad de salvar tu vida.' },
			{ id: 'b', letter: 'B', text: 'Tratamiento Y, que tiene un 20% de probabilidad de provocar tu muerte.' },
			{ id: 'c', letter: 'C', text: 'Tratamiento Z, que tiene una probabilidad de supervivencia de 4/5.' }
		],
		giochiFeedback: 'Las tres opciones son matemáticamente idénticas (80% supervivencia = 20% muerte = 4/5). No obstante, la opción A suele ser la más votada debido a que el marco de "salvar la vida" genera emociones positivas, mientras que la palabra "muerte" en B activa la aversión, y los porcentajes en A se sienten más precisos que la fracción en C.'
	},
	{
		id: 6,
		part: 1,
		type: 'selection',
		title: 'Slide F1.6: Falacia del Costo Hundido (Sunk Cost Fallacy)',
		concept: 'Economía Conductual: Los gastos del pasado sesgan las decisiones del presente.',
		scenario: 'Has pagado 100 BEM Coins por una entrada a un concierto al aire libre. El día del evento se desata una tormenta de lluvia y granizo. ¿Qué decides hacer?',
		options: [
			{ id: 'a', letter: 'A', text: 'Ir al concierto bajo la tormenta para no desperdiciar las 100 BEM Coins invertidas.' },
			{ id: 'b', letter: 'B', text: 'Quedarme en casa abrigado y seguro, aceptando la pérdida del valor de la entrada.' }
		],
		giochiFeedback: 'Racionalmente, las 100 BEM Coins ya se gastaron y no se pueden recuperar (costo hundido). Ir bajo la tormenta solo añade sufrimiento físico a la pérdida económica. A pesar de esto, la mente prefiere sufrir para evitar la sensación de haber "desperdiciado" el dinero.'
	},
	{
		id: 7,
		part: 1,
		type: 'selection',
		title: 'Slide F1.7: Sesgo del Presente y Descuento Hiperbólico',
		concept: 'Economía Conductual: Sobrevaloramos lo inmediato ante recompensas futuras.',
		scenario: '¿Qué estructura de pago prefieres para la entrega de un proyecto corto?',
		options: [
			{ id: 'a', letter: 'A', text: 'Recibir 10 BEM Coins hoy mismo.' },
			{ id: 'b', letter: 'B', text: 'Recibir 12 BEM Coins en 1 mes.' },
			{ id: 'c', letter: 'C', text: 'Recibir 25 BEM Coins en 3 meses.' },
			{ id: 'd', letter: 'D', text: 'Recibir 60 BEM Coins en 6 meses.' }
		],
		giochiFeedback: 'Cuando el beneficio se ofrece "hoy", el sesgo del presente nos hace preferir la inmediatez (Opción A) a pesar de que esperar unos meses ofrece un rendimiento exponencialmente mayor. Si el dilema fuera elegir entre recibir 10 BEM Coins en 12 meses o 12 BEM Coins en 13 meses, casi todos elegirían esperar.'
	},
	{
		id: 8,
		part: 1,
		type: 'selection',
		title: 'Slide F1.8: Ilusión de Control y Rituales',
		concept: 'Economía Conductual: Creer que las elecciones determinan el puro azar.',
		scenario: 'Vas a participar en una rifa colectiva de BEM Coins. ¿Cómo prefieres obtener tu billete?',
		options: [
			{ id: 'a', letter: 'A', text: 'Elegir yo mismo el billete de una pila.' },
			{ id: 'b', letter: 'B', text: 'Que el sistema me asigne un billete al azar.' },
			{ id: 'c', letter: 'C', text: 'Que un compañero elija el billete por mí.' },
			{ id: 'd', letter: 'D', text: 'Lanzar mi dado favorito para decidir qué número de la lista elegir.' }
		],
		giochiFeedback: 'Aunque la probabilidad matemática de ganar es idéntica en las 4 opciones, elegir personalmente (A) o utilizar un ritual (D) activa el sesgo de ilusión de control. Las personas sienten erróneamente que sus acciones influyen en el resultado de eventos puramente azarosos.'
	},
	{
		id: 9,
		part: 1,
		type: 'selection',
		title: 'Slide F1.9: Efecto de Dotación (Endowment Effect)',
		concept: 'Economía Conductual: Valoramos más las cosas simplemente porque son nuestras.',
		scenario: 'Te acaban de regalar una insignia rara en tu bitácora valorada en 50 BEM Coins. Un compañero quiere comprártela. ¿Por qué precio mínimo aceptarías vendérsela?',
		options: [
			{ id: 'a', letter: 'A', text: 'Por su precio de mercado (50 BEM Coins) o incluso menos.' },
			{ id: 'b', letter: 'B', text: 'Por un recargo moderado (entre 51 y 75 BEM Coins).' },
			{ id: 'c', letter: 'C', text: 'Solo si me paga el doble de su valor de mercado (100 BEM Coins o más).' },
			{ id: 'd', letter: 'D', text: 'No me interesa venderla bajo ninguna circunstancia.' }
		],
		giochiFeedback: 'El simple hecho de poseer un objeto (dotación) hace que le asignemos un valor psicológico superior al real. Los propietarios suelen exigir precios de venta significativamente más altos que lo que un comprador racional estaría dispuesto a pagar por el mismo artículo.'
	},
	{
		id: 10,
		part: 1,
		type: 'selection',
		title: 'Slide F1.10: Sesgo de Representatividad y Conjunción',
		concept: 'Economía Conductual: La falacia de la conjunción ante descripciones familiares.',
		scenario: 'Linda tiene 31 años, es soltera, abierta y muy brillante. En sus años universitarios se especializó en filosofía y se preocupó profundamente por temas de discriminación y justicia social. ¿Qué opción es más probable?',
		options: [
			{ id: 'a', letter: 'A', text: 'Linda es cajera en un banco.' },
			{ id: 'b', letter: 'B', text: 'Linda es cajera en un banco y es activista.' },
			{ id: 'c', letter: 'C', text: 'Linda es cajera en un banco, activista y feminista.' },
			{ id: 'd', letter: 'D', text: 'Linda es cajera en un banco, activista y millonaria.' }
		],
		correctOption: 'a',
		giochiFeedback: 'La probabilidad de que ocurra un solo evento (cajera de banco - A) siempre es mayor que la de que ocurra ese mismo evento combinado con otros rasgos (B, C, o D). La mente cae en la falacia de la conjunción porque la descripción coincide con su representación mental de una activista.'
	},
	{
		id: 11,
		part: 1,
		type: 'selection',
		title: 'Slide F1.11: Anclaje y Ajuste Numérico',
		concept: 'Economía Conductual: El orden de cálculo ancla las estimaciones de escala.',
		scenario: 'Tienes 5 segundos para estimar rápidamente el resultado aproximado de esta multiplicación matemática: 1 x 2 x 3 x 4 x 5 x 6 x 7 x 8',
		options: [
			{ id: 'a', letter: 'A', text: 'Menos de 500' },
			{ id: 'b', letter: 'B', text: 'Entre 500 y 2,000' },
			{ id: 'c', letter: 'C', text: 'Entre 2,001 y 15,000' },
			{ id: 'd', letter: 'D', text: 'Más de 15,000' }
		],
		correctOption: 'd',
		giochiFeedback: 'Al calcular rápido de izquierda a derecha comenzando por números pequeños (1 x 2 x 3...), la mente se ancla en un número inicial bajo y realiza ajustes insuficientes al estimar el resultado final, subestimándolo drásticamente. El resultado real es 40,320.'
	},
	{
		id: 12,
		part: 1,
		type: 'selection',
		title: 'Slide F1.12: Error de Atribución Fundamental',
		concept: 'Economía Conductual: Juzgar la personalidad del otro en lugar de su contexto.',
		scenario: 'Un conductor te adelanta a gran velocidad y sin luces de cruce en una vía rápida, casi rozando tu automóvil. ¿Cuál consideras que es el motivo de su acción?',
		options: [
			{ id: 'a', letter: 'A', text: 'Es un conductor imprudente, maleducado y egoísta por naturaleza.' },
			{ id: 'b', letter: 'B', text: 'No vio mi vehículo debido a un punto ciego del espejo y la mala iluminación.' },
			{ id: 'c', letter: 'C', text: 'Su copiloto tiene una urgencia de salud y van en camino al hospital.' },
			{ id: 'd', letter: 'D', text: 'El pedal de su acelerador se atascó momentáneamente por una falla mecánica.' }
		],
		giochiFeedback: 'Tendemos a sobreatribuir los errores ajenos a su personalidad interna y mala disposición (Opción A), mientras que cuando cometemos errores similares los justificamos con factores del contexto externo (B, C o D). Esto se conoce como el error de atribución.'
	},
	{
		id: 13,
		part: 1,
		type: 'selection',
		title: 'Slide F1.13: El Sesgo de los Nombres y Contexto Implícito',
		concept: 'Economía Conductual: Contextualización automática basada en familiaridad.',
		scenario: '¿Qué nombre de pila consideras que es estadísticamente el más popular y común del mundo entero?',
		options: [
			{ id: 'a', letter: 'A', text: 'Samuel' },
			{ id: 'b', letter: 'B', text: 'Alexandra' },
			{ id: 'c', letter: 'C', text: 'Jennifer' },
			{ id: 'd', letter: 'D', text: 'Mohammed' }
		],
		correctOption: 'd',
		giochiFeedback: 'El nombre "Mohammed" (y sus variantes) es el más común a nivel global debido a la enorme densidad de población que lo adopta por tradición. Nuestra mente asume implícitamente un contexto occidental local y elige opciones más familiares, ignorando la literalidad global de la pregunta.'
	},

	// FASE 2: DISEÑO DE JUEGOS (DILEMAS TÁCTICOS Y MECÁNICAS LÚDICAS)
	{
		id: 14,
		part: 2,
		type: 'selection',
		title: 'Slide F2.1: La Elección Ciega e Irreversible',
		concept: 'Diseño de Juegos: Las consecuencias irreversibles requieren pistas e información.',
		scenario: 'Te encuentras en el nivel 5 de un calabozo y hallas tres puertas de madera idénticas. Sabes que una de ellas contiene una trampa que destruye permanentemente tu inventario de armas (irreversible), otra tiene un enemigo poderoso, y la tercera es la salida. No hay ninguna pista o indicio. ¿Qué decides hacer?',
		options: [
			{ id: 'a', letter: 'A', text: 'Cruzo la puerta izquierda y asumo el riesgo.' },
			{ id: 'b', letter: 'B', text: 'Cruzo la puerta del centro y asumo el riesgo.' },
			{ id: 'c', letter: 'C', text: 'Cruzo la puerta derecha y asumo el riesgo.' },
			{ id: 'd', letter: 'D', text: 'Decido retroceder dos habitaciones y buscar pistas en las paredes de los niveles anteriores, asumiendo el gasto de comida y tiempo.' }
		],
		giochiFeedback: 'Las elecciones ciegas no son problemáticas si el jugador tiene margen para mapear y devolverse. Pero si conllevan consecuencias severas e irreversibles (como perder el inventario), rompen la autonomía y frustran al jugador. La Opción D demuestra cómo los jugadores optan por retroceder y buscar información antes que someterse al azar punitivo si se les da la oportunidad.'
	},
	{
		id: 15,
		part: 2,
		type: 'selection',
		title: 'Slide F2.2: La Opción Dominante vs. Comparación Significativa',
		concept: 'Diseño de Juegos: Las opciones dominantes destruyen el interés de elegir.',
		scenario: 'En la tienda de un juego de combate táctico, tienes un saldo de 100 BEM Coins y las siguientes espadas disponibles por el mismo precio. ¿Cuál decides comprar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Espada de Hierro: Hace 15 de daño.' },
			{ id: 'b', letter: 'B', text: 'Espada de Bronce: Hace 20 de daño.' },
			{ id: 'c', letter: 'C', text: 'Espada de la Sombra: Hace 40 de daño y otorga invisibilidad temporal.' },
			{ id: 'd', letter: 'D', text: 'Espada del Fénix: Hace 45 de daño y tiene un 20% de probabilidad de golpe crítico.' }
		],
		giochiFeedback: 'Las opciones A y B quedan totalmente invalidadas; son malas opciones obvias. Sin embargo, elegir entre C y D representa una comparación significativa: no hay una opción claramente superior, ya que depende de tu estilo de juego (invisibilidad táctica vs. daño explosivo). Esto ilustra cómo dos opciones dominantes similares compiten entre sí para preservar la decisión.'
	},
	{
		id: 16,
		part: 2,
		type: 'selection',
		title: 'Slide F2.3: Elección Estética vs. Rendimiento Funcional',
		concept: 'Diseño de Juegos: La autoexpresión estética equilibra la pura utilidad de estadísticas.',
		scenario: 'Te preparas para un torneo multijugador online. Un mercader te ofrece las siguientes armaduras para tu personaje. ¿Cuál decides comprar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Armadura del Ogro: Otorga una defensa altísima (+80), pero estéticamente es grotesca y fea.' },
			{ id: 'b', letter: 'B', text: 'Armadura de Seda Élfica: Otorga una defensa muy débil (+10), pero tiene un diseño hermoso, brillante y elegante.' },
			{ id: 'c', letter: 'C', text: 'Armadura de Soldado: Ofrece valores estándar de defensa (+45) y una apariencia común y pasable.' },
			{ id: 'd', letter: 'D', text: 'Armadura del Paladín Dorado: Otorga una defensa excelente (+75) y un diseño espectacular, pero cuesta el doble de tu saldo.' }
		],
		giochiFeedback: 'La agencia del jugador no es solo matemática. Esta decisión opone la utilidad mecánica (Opción A) a la identidad/autoexpresión estética (Opción B) y a la gestión de recursos (Opción D). Los jugadores con fuerte driver de autoexpresión o identidad a menudo sacrifican estadísticas con tal de verse bien.'
	},
	{
		id: 17,
		part: 2,
		type: 'selection',
		title: 'Slide F2.4: Asimetría de Información y Gestión de Incertidumbre',
		concept: 'Diseño de Juegos: La información reduce la incertidumbre cognitiva y empodera el análisis.',
		scenario: 'Te enfrentas a un duelo de cartas táctico y tienes la oportunidad de lanzar un conjuro antes de realizar tu jugada final. ¿Qué hechizo decides lanzar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Hechizo de Ojo Revelador: Te permite ver 2 cartas de la mano del oponente de forma secreta.' },
			{ id: 'b', letter: 'B', text: 'Hechizo de Robar Fortuna: Te permite robar 2 cartas adicionales de tu propio mazo al azar.' },
			{ id: 'c', letter: 'C', text: 'Hechizo de Visión Equilibrada: Te permite ver 1 carta del oponente y robar 1 carta de tu propio mazo.' }
		],
		giochiFeedback: 'La información es el combustible del Sistema 2 (pensamiento reflexivo). La opción A reduce la incertidumbre y te permite predecir los movimientos del rival. La opción B aumenta tu potencia y opciones tácticas puras. La opción C es una estrategia híbrida que equilibra el control del entorno con la versatilidad de recursos.'
	},
	{
		id: 18,
		part: 2,
		type: 'selection',
		title: 'Slide F2.5: Riesgos vs. Recompensas en la Mina de Calaveras',
		concept: 'Diseño de Juegos: El balance entre seguridad y azar excita la cognición.',
		scenario: 'Tu grupo de expedición llega a una encrucijada oscura en la Mina de Oro de las Calaveras. Se escuchan ruidos diferentes por cada pasadizo. ¿Por cuál decides avanzar?',
		options: [
			{ id: 'a', letter: 'A', text: 'El Sendero del Minero: Ganas 10 BEM Coins garantizadas y seguras, pero tardas 3 rondas.' },
			{ id: 'b', letter: 'B', text: 'El Eje de las Vagonetas: 50% de ganar 100 BEM Coins y 50% de perder 50 BEM Coins.' },
			{ id: 'c', letter: 'C', text: 'El Abismo de los Murciélagos: 20% de ganar 300 BEM Coins, pero 80% de perder 80 BEM Coins.' },
			{ id: 'd', letter: 'D', text: 'El Pasadizo del Acertijo: Responder un enigma en 15 segundos. Si aciertas, ganas 50 BEM Coins; si fallas, vas al Sendero del Minero.' }
		],
		giochiFeedback: 'Este slide ilustra cómo los diseñadores de juego equilibran la tensión cognitiva mediante el balance de riesgo y recompensa. Al añadir narrativa y dar pesos distintos a la probabilidad frente a la penalización, cada jugador elige la opción que mejor encaja con su perfil de riesgo y su autoconfianza.'
	},
	{
		id: 19,
		part: 2,
		type: 'selection',
		title: 'Slide F2.6: Costo de Oportunidad e Irreversibilidad',
		concept: 'Diseño de Juegos: La irreversibilidad forja compromiso a largo plazo.',
		scenario: 'Al subir de nivel en un juego de estrategia fantástico, recibes 2 puntos de habilidad para tu personaje. La distribución que elijas se bloqueará permanentemente y no se podrá reentrenar. ¿Dónde decides asignarlos?',
		options: [
			{ id: 'a', letter: 'A', text: 'Piromancia Ofensiva: Desbloquear el hechizo "Ataque de Fuego" para infligir gran daño.' },
			{ id: 'b', letter: 'B', text: 'Sanación Rápida: Desbloquear la regeneración automática de tu barra de salud.' },
			{ id: 'c', letter: 'C', text: 'Canalización Mística: Aumentar tu capacidad de maná máximo.' },
			{ id: 'd', letter: 'D', text: 'Ojo del Buscador: Desbloquear una habilidad pasiva para detectar cofres ocultos.' }
		],
		giochiFeedback: 'Si las decisiones del juego se pueden revertir gratis en cualquier momento, el jugador no reflexiona y la decisión pierde peso. La irreversibilidad (o el costo alto de deshacer una acción) fuerza al Sistema 2 a comprometerse. Además, las categorías bien diferenciadas establecen un costo de oportunidad real.'
	},
	{
		id: 20,
		part: 2,
		type: 'selection',
		title: 'Slide F2.7: Elecciones Falsas e Ilusión de Agencia',
		concept: 'Diseño de Juegos: Las elecciones falsas otorgan agencia narrativa y de rol.',
		scenario: 'Estás discutiendo con tu compañero de rol sobre qué camino tomar para cruzar el mapa. Él tiene pánico y quiere rodear el Bosque de las Almas Perdidas, lo que costará un día de viaje. ¿Qué decides hacer?',
		options: [
			{ id: 'a', letter: 'A', text: 'Forzarlo violentamente a entrar en el bosque arrastrándolo del brazo.' },
			{ id: 'b', letter: 'B', text: 'Persuadirlo prometiéndole compartir todos los tesoros que encontremos allí.' },
			{ id: 'c', letter: 'C', text: 'Escucharlo con empatía pero explicarle firmemente por qué no podemos demorarnos rodeando el bosque.' }
		],
		giochiFeedback: 'En el motor del juego, el bosque es el único nivel modelado, por lo que el jugador entrará allí elija lo que elija (elección falsa). Sin embargo, estas opciones no son inútiles: otorgan "agencia de rol". Permiten al jugador definir la personalidad de su héroe (violento, persuasivo, o empático).'
	},
	{
		id: 21,
		part: 2,
		type: 'selection',
		title: 'Slide F2.8: Cooperación Social (Dilema del Prisionero)',
		concept: 'Diseño de Juegos: La cooperación colectiva emerge frente a la pura optimización lógica.',
		scenario: 'Tú y tu aliado obtienen un cofre con 100 BEM Coins. Deben elegir en secreto: si ambos eligen compartir, se dividen 50 y 50; si uno elige traicionar y el otro compartir, el traidor se lleva las 100 y el otro 0; si ambos eligen traicionar, el botín se quema (0 y 0). ¿Qué decides elegir?',
		options: [
			{ id: 'a', letter: 'A', text: 'Elijo Compartir.' },
			{ id: 'b', letter: 'B', text: 'Elijo Traicionar.' }
		],
		giochiFeedback: 'El conflicto de esta decisión no es lógico, sino social. Aunque la estrategia dominante racional individual de la teoría de juegos es traicionar (Opción B) para evitar salir con 0, los jugadores suelen cooperar (Opción A) debido a normas de reputación social y proxemia tribal.'
	},
	{
		id: 22,
		part: 2,
		type: 'selection',
		title: 'Slide F2.9: Fricción por Sobrecarga de Elecciones',
		concept: 'Diseño de Juegos: El exceso de alternativas satura los recursos en momentos de presión.',
		scenario: 'Estás escapando de una avalancha de rocas y entras en una gran cámara con varias opciones de escape. Tienes 3 segundos para reaccionar. ¿Por cuál decides entrar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Cámara Verde: Un pasillo simple que solo se conecta a 2 puertas de madera idénticas.' },
			{ id: 'b', letter: 'B', text: 'Cámara Azul: Un pasillo con 2 puertas hechas de metales diferentes (hierro y cobre).' },
			{ id: 'c', letter: 'C', text: 'Cámara Roja: Una gran sala con 8 puertas numeradas, cada una con un acertijo grabado.' },
			{ id: 'd', letter: 'D', text: 'Cámara Gris: Una sala con 20 cofres alineados en el suelo y una sola llave tirada.' }
		],
		correctOption: 'a',
		giochiFeedback: 'Bajo la presión temporal o el estrés lúdico, la sobrecarga de opciones genera parálisis por análisis. Los jugadores tienden a elegir pasajes que simplifiquen la fricción cognitiva (A o B) en lugar de salas que requieran alta deliberación o micro-gestión de recursos (C o D).'
	},
	{
		id: 23,
		part: 2,
		type: 'selection',
		title: 'Slide F2.10: Decisiones Basadas en Sinergias y Combos',
		concept: 'Diseño de Juegos: Los combos revalorizan recursos débiles mediante planificación.',
		scenario: 'Estás armando tu mazo de cartas de hechizos y tienes el último espacio libre. ¿Qué carta decides añadir?',
		options: [
			{ id: 'a', letter: 'A', text: 'Lluvia de Flechas: Hechizo simple que hace 20 de daño base a un objetivo.' },
			{ id: 'b', letter: 'B', text: 'Viento Helado: Hace 5 de daño base, pero duplica el daño de cualquier ataque de flechas/hielo posterior.' },
			{ id: 'c', letter: 'C', text: 'Horda de Esqueletos: Invoca a un esqueleto con 2 de daño, pero gana +1 por cada esqueleto en mano.' },
			{ id: 'd', letter: 'D', text: 'Bendición Solar: Restaura 5 de salud y añade +2 de fuerza a todas tus invocaciones activas.' }
		],
		giochiFeedback: 'El diseño de combos hace que opciones débiles de forma aislada (el bajo daño del viento en B o del esqueleto en C) adquieran un valor estratégico inmenso cuando el jugador planea combinaciones complejas. Esto expande el espacio de decisiones significativas.'
	},
	{
		id: 24,
		part: 2,
		type: 'selection',
		title: 'Slide F2.11: Decisiones con Daño Colateral (Efectos Negativos)',
		concept: 'Diseño de Juegos: El daño colateral equilibra las alternativas de alta potencia.',
		scenario: 'Te enfrentas a una oleada de enemigos y es tu turno de acción. ¿Qué hechizo decides lanzar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Hechizo de Fuego: Inflige 40 de daño a todos los enemigos, pero hiere a tus aliados un 10%.' },
			{ id: 'b', letter: 'B', text: 'Rayo Encadenado: Hace 30 de daño a 3 enemigos, pero rebota con 5 de daño a un aliado al azar.' },
			{ id: 'c', letter: 'C', text: 'Explosión Vital: Reduce tu propia barra de salud a la mitad para restar un 75% de la vida total del jefe.' },
			{ id: 'd', letter: 'D', text: 'Flecha de Precisión: Hace 20 de daño a un único oponente seleccionado, sin efectos colaterales.' }
		],
		giochiFeedback: 'Introducir consecuencias negativas colaterales a las opciones más potentes evita que existan estrategias dominantes y obliga al jugador a sopesar con cuidado el costo-beneficio de su intervención táctica.'
	},
	{
		id: 25,
		part: 2,
		type: 'selection',
		title: 'Slide F2.12: Atractores vs. Disuasores en la Taberna',
		concept: 'Diseño de Juegos: El balance de atractores y disuasores revela preferencias psicológicas.',
		scenario: 'Entras a la taberna de la aldea buscando tu siguiente misión de progreso. Hay cuatro personajes. ¿A cuál decides acercarte?',
		options: [
			{ id: 'a', letter: 'A', text: 'Una elfa majestuosa que viste una armadura brillante pero te mira con desdén.' },
			{ id: 'b', letter: 'B', text: 'Un enano gruñón que te da la espalda, pero lleva una bolsa de monedas de oro enorme.' },
			{ id: 'c', letter: 'C', text: 'Un hombre misterioso con capucha del que no puedes ver el rostro, pero lleva la insignia de asesinos.' },
			{ id: 'd', letter: 'D', text: 'El tabernero local, que limpia un vaso y te sonríe amigablemente, aunque viste ropa vieja.' }
		],
		giochiFeedback: 'Cada opción en este dilema ofrece un atractor (estatus/belleza, riqueza inmediata, misterio/peligro, seguridad social) balanceado con un disuasor. Esto permite a los diseñadores ver qué motivaciones psicológicas y drivers prioriza cada jugador cuando se enfrenta a opciones equilibradas.'
	},
	{
		id: 26,
		part: 2,
		type: 'selection',
		title: 'Slide F2.13: Rutas de Navegación en Mundo Abierto',
		concept: 'Diseño de Juegos: La ramificación y escasez posponen la meta principal.',
		scenario: 'Abres el mapa en un juego de exploración libre y tienes varias opciones de viaje marcadas. ¿Hacia cuál de ellas decides dirigir tus pasos?',
		options: [
			{ id: 'a', letter: 'A', text: 'El Templo de la Sabiduría (Misión Principal): A solo 100 pasos de distancia, avanza la trama principal.' },
			{ id: 'b', letter: 'B', text: 'El Valle de los Muertos (Misión Temporal): Una misión secundaria que expira en 20 minutos reales, a 800 pasos.' },
			{ id: 'c', letter: 'C', text: 'La Cumbre de las Almas (Misión Difícil): Una misión secundaria de alta dificultad a 300 pasos (recompensa espada legendaria).' },
			{ id: 'd', letter: 'D', text: 'La Guarida Olvidada (Exploración): Una mazmorra oculta a 1000 pasos de distancia con un cofre legendario sin guardianes.' }
		],
		giochiFeedback: 'En juegos de mundo abierto, ofrecer alternativas con urgencia temporal (B), grandes recompensas (C) o exploración libre sin riesgo (D) compite fuertemente con la misión principal (A). Muestra cómo los jugadores tienden a retrasar la conclusión de una historia si el entorno les ofrece ramificaciones atractivas.'
	},

	// FASE 3: DECISIONES EN EDUCACIÓN (AULA REAL Y MOTIVACIÓN DEL ESTUDIANTE)
	{
		id: 27,
		part: 3,
		type: 'selection',
		title: 'Slide F3.1: Examen vs. Música',
		concept: 'Educación: La autonomía ambiental modula el costo percibido de la dificultad.',
		scenario: 'Se acerca el examen final de la materia. El profesor te da a elegir bajo qué condiciones prefieres presentarlo en el aula. ¿Cuál eliges?',
		options: [
			{ id: 'a', letter: 'A', text: 'Tomar un examen un poco más difícil (2 preguntas extra), pero con permiso de escuchar música con tus audífonos.' },
			{ id: 'b', letter: 'B', text: 'Tomar el examen estándar en silencio absoluto de forma convencional.' },
			{ id: 'c', letter: 'C', text: 'Tomar un examen más sencillo y corto, pero con 10 minutos menos de tiempo límite.' }
		],
		giochiFeedback: 'Revela cómo los estudiantes valoran la autonomía y el confort ambiental. Muchos están dispuestos a asumir una mayor dificultad académica (A) a cambio de controlar su entorno de concentración, demostrando que la dificultad no es el único factor de rechazo.'
	},
	{
		id: 28,
		part: 3,
		type: 'selection',
		title: 'Slide F3.2: Dificultad Dinámica y Esfuerzo',
		concept: 'Educación: La autoconfianza y la fatiga por repetición modulan el esfuerzo voluntario.',
		scenario: 'Para el taller práctico de física, debes acumular exactamente 15 puntos resolviendo ejercicios. ¿Qué combinación de trabajo prefieres entregar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Resolver 1 solo problema de nivel "Extremo" (vale 15 puntos).' },
			{ id: 'b', letter: 'B', text: 'Resolver 3 problemas de nivel "Estándar" (valen 5 puntos cada uno).' },
			{ id: 'c', letter: 'C', text: 'Resolver 5 problemas de nivel "Fácil" (valen 3 puntos cada uno).' }
		],
		giochiFeedback: 'Muestra que los estudiantes no siempre eligen la ley del mínimo esfuerzo. Aquellos con alta autoconfianza prefieren enfrentar un reto complejo único (A) para evitar la monotonía del trabajo repetitivo (C), mientras que otros buscan la seguridad de la progresión escalonada (B).'
	},
	{
		id: 29,
		part: 3,
		type: 'selection',
		title: 'Slide F3.3: El Tono del Feedback',
		concept: 'Educación: El soporte emocional versus la eficiencia directa influyen en la resiliencia.',
		scenario: 'Vas a entregar un borrador de tu proyecto de investigación y el docente te pide elegir el tipo de feedback que te entregará. ¿Cuál decides recibir?',
		options: [
			{ id: 'a', letter: 'A', text: 'Tono crítico y ácido: Sin rodeos ni suavizantes, enfocado puramente en señalar cada error.' },
			{ id: 'b', letter: 'B', text: 'Tono empático y motivador: Enfocado en destacar tus progresos y darte sugerencias amables.' },
			{ id: 'c', letter: 'C', text: 'Tono analítico y neutral: Enfocado en datos objetivos y cumplimiento de la rúbrica formal.' }
		],
		giochiFeedback: 'Evidencia que los estudiantes tienen perfiles de seguridad emocional muy distintos frente al error. Algunos priorizan la eficiencia descarnada (A) para maximizar su nota final, mientras que otros requieren contención empática (B) para no frustrarse y abandonar la tarea.'
	},
	{
		id: 30,
		part: 3,
		type: 'selection',
		title: 'Slide F3.4: Encuadre de Calificación (Aversión a la Pérdida)',
		concept: 'Educación: El enmarque de los puntos activa motivaciones de urgencia o de combo.',
		scenario: 'Comienza el semestre. ¿Qué política de puntuación y entrega de tareas semanales te generaría una mayor motivación e interés para trabajar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Acumulación limpia: Empiezas con 0 puntos y sumas +10 puntos por cada tarea semanal entregada.' },
			{ id: 'b', letter: 'B', text: 'Marco de pérdida: Empiezas con 100 puntos garantizados, y pierdes -10 por cada tarea no entregada.' },
			{ id: 'c', letter: 'C', text: 'Formato Mixto: Empiezas con 50 puntos. +10 por entrega, -10 por incumplimiento, y bono de racha de +5.' },
			{ id: 'd', letter: 'D', text: 'Racha Progresiva: Empiezas en 0. Primera entrega +5, segunda +7, tercera en adelante +10. Si fallas vuelve a +5.' }
		],
		giochiFeedback: 'Evalúa el impacto de la aversión a la pérdida y las mecánicas de racha. La opción B genera urgencia por pérdida de estatus, pero las opciones C y D introducen incentivos dinámicos de optimización lúdica que atraen a perfiles competitivos que buscan maximizar el combo de puntos.'
	},
	{
		id: 31,
		part: 3,
		type: 'selection',
		title: 'Slide F3.5: Efecto Señuelo en Tareas Opcionales',
		concept: 'Educación: Los distractores de alto costo facilitan la aceptación de tareas complejas.',
		scenario: 'El profesor te ofrece preparar el tema del debate de la próxima clase. Tienes tres alternativas de estudio autónomo. ¿Cuál eliges?',
		options: [
			{ id: 'a', letter: 'A', text: 'Leer un artículo de investigación denso de 20 páginas sobre el tema.' },
			{ id: 'b', letter: 'B', text: 'Leer el artículo denso de 20 páginas y además escribir un ensayo analítico de 3 páginas.' },
			{ id: 'c', letter: 'C', text: 'Leer un folleto resumen estructurado de 15 páginas con los conceptos clave.' }
		],
		giochiFeedback: 'Al introducir la opción B (el "señuelo" que requiere mucho más trabajo), la opción A se vuelve significativamente más atractiva y aceptable para los estudiantes que si solo tuvieran que elegir entre la lectura larga (A) y el resumen intermedio de 15 páginas (C).'
	},
	{
		id: 32,
		part: 3,
		type: 'selection',
		title: 'Slide F3.6: Personalización Temática de Ejercicios',
		concept: 'Educación: La alineación temática satisface el driver de identidad y expresión personal.',
		scenario: 'En tu clase de algoritmos de programación, debes codificar un sistema de ordenamiento de datos. El profesor te permite elegir el contexto de la base de datos de tu examen. ¿Cuál seleccionas?',
		options: [
			{ id: 'a', letter: 'A', text: 'Ordenar una lista de precios de productos de un supermercado.' },
			{ id: 'b', letter: 'B', text: 'Ordenar el inventario de pócimas y armas de un personaje en un juego de rol medieval.' },
			{ id: 'c', letter: 'C', text: 'Ordenar perfiles de compatibilidad e intereses para una aplicación de citas.' }
		],
		giochiFeedback: 'Aunque la lógica de programación y la dificultad son idénticas en las tres opciones, permitir la personalización temática (Opción B o C) activa motivaciones de identidad y entretenimiento, haciendo que el estudiante se comprometa más con resolver el problema.'
	},
	{
		id: 33,
		part: 3,
		type: 'selection',
		title: 'Slide F3.7: Estructura del Curso (Mundo Abierto vs. Ruta Guiada)',
		concept: 'Educación: Estructuras lúdicas de navegación disminuyen la inercia sin limitar la agencia.',
		scenario: 'Te inscribes en un curso autónomo online de historia contemporánea. ¿Cómo prefieres que esté organizada la navegación de los módulos de aprendizaje?',
		options: [
			{ id: 'a', letter: 'A', text: 'Libertad de navegación completa: Todos los módulos abiertos desde el primer día.' },
			{ id: 'b', letter: 'B', text: 'Ruta de mundo abierto: Los módulos se abren semana a semana, pero tienes un menú lateral de tareas secundarias.' },
			{ id: 'c', letter: 'C', text: 'Árbol de decisiones: Luego del módulo básico, puedes elegir abrir la rama de "Historia Política" o "Historia del Arte".' },
			{ id: 'd', letter: 'D', text: 'Ruta lineal obligatoria: El sistema mantiene bloqueados los módulos hasta que apruebas el anterior.' }
		],
		giochiFeedback: 'Explora el balance entre autonomía y guía. Los formatos intermedios (B y C) simulan mundos abiertos y árboles de progresión lúdica que reducen la fatiga de decisión y el sesgo de status quo sin limitar la agencia de exploración del alumno.'
	},
	{
		id: 34,
		part: 3,
		type: 'selection',
		title: 'Slide F3.8: Cooperación en Trabajo Colectivo',
		concept: 'Educación: La rendición de cuentas compartida protege contra la inacción del free-rider.',
		scenario: 'Debes realizar un proyecto grupal de investigación de 4 semanas. El docente les permite elegir la regla de calificación para el equipo. ¿Cuál prefieres?',
		options: [
			{ id: 'a', letter: 'A', text: 'Nota grupal directa: Todos los integrantes obtienen la misma calificación final.' },
			{ id: 'b', letter: 'B', text: 'Nota con co-evaluación: 70% nota del proyecto grupal, y 30% co-evaluación interna confidencial.' },
			{ id: 'c', letter: 'C', text: 'Nota 100% individual: Cada miembro defiende y es evaluado únicamente por su sección escrita.' },
			{ id: 'd', letter: 'D', text: 'Formato mixto: 50% por el producto grupal y 50% por una entrevista oral individual del docente.' }
		],
		giochiFeedback: 'Refleja el temor al comportamiento de los compañeros que no trabajan (free-riders). Los estudiantes a menudo prefieren la rendición de cuentas (B y D) por encima de la nota grupal ciega (A) para asegurar que su esfuerzo personal sea reconocido.'
	},
	{
		id: 35,
		part: 3,
		type: 'selection',
		title: 'Slide F3.9: Costo de Oportunidad en la Especialización',
		concept: 'Educación: La comodidad y certidumbre compiten con la curiosidad de exploración.',
		scenario: 'En la asignatura de historia, debes elegir una línea de investigación temática para tus ensayos de la segunda mitad del año. La elección es fija e irreversible. ¿Cuál eliges?',
		options: [
			{ id: 'a', letter: 'A', text: 'Enfoque Clásico: Historia de las Guerras Mundiales. Hay abundante bibliografía y videos en internet.' },
			{ id: 'b', letter: 'B', text: 'Enfoque Alternativo: Historia del Arte y la Música de las Tribus Urbanas en los 80. La bibliografía es escasa.' }
		],
		giochiFeedback: 'Muestra el conflicto de costo de oportunidad entre la comodidad y bajo riesgo (Opción A) frente a la curiosidad intelectual y el deseo de originalidad y autoexpresión (Opción B).'
	},
	{
		id: 36,
		part: 3,
		type: 'selection',
		title: 'Slide F3.10: Sobrecarga de Opciones vs. Fricción de Consulta',
		concept: 'Educación: Respuestas inmediatas y baja fricción prevalecen ante la fatiga de sobrecarga bibliográfica.',
		scenario: 'Tienes dudas conceptuales graves sobre un tema que entrará en el examen de mañana. ¿Qué recurso decides consultar para resolverlas?',
		options: [
			{ id: 'a', letter: 'A', text: 'Una biblioteca digital en la plataforma de clase con 15 enlaces seleccionados.' },
			{ id: 'b', letter: 'B', text: 'Un bot de chat con Inteligencia Artificial integrado en el curso que responde tus dudas al instante.' },
			{ id: 'c', letter: 'C', text: 'Agendar una sesión rápida de 10 minutos de tutoría en vivo con el docente.' }
		],
		giochiFeedback: 'Muestra que los estudiantes a menudo prefieren soluciones rápidas de baja fricción cognitiva y retroalimentación inmediata (B) por encima de la exhaustividad bibliográfica (A) o el contacto humano diferido (C) en momentos de urgencia.'
	},
	{
		id: 37,
		part: 3,
		type: 'selection',
		title: 'Slide F3.11: Riesgo vs. Recompensa en la Evaluación Final',
		concept: 'Educación: Alternativas de riesgo medio satisfacen a los perfiles pragmáticos.',
		scenario: 'Tu promedio en la materia es regular y necesitas asegurar una buena nota final. El profesor te da tres opciones para tu entrega final. ¿Cuál decides tomar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Examen escrito tradicional: Si apruebas, subes a 4.0; si repruebas, mantienes tu promedio actual.' },
			{ id: 'b', letter: 'B', text: 'Defensa oral de un proyecto de innovación ante jurado externo: Aprobado = nota final 5.0; rechazado = bajas 1 punto completo.' },
			{ id: 'c', letter: 'C', text: 'Presentación de proyecto en clase: Aprobado = nota sube a 4.5; rechazado = baja medio punto.' }
		],
		giochiFeedback: 'Ilustra cómo el perfil de aversión al riesgo varía según la relación costo-beneficio. Al introducir la opción C (riesgo moderado y beneficio moderado), se abre una alternativa de equilibrio que atrae a los estudiantes pragmáticos que quieren balancear seguridad y recompensa.'
	},
	{
		id: 38,
		part: 3,
		type: 'selection',
		title: 'Slide F3.12: Participación Democrática y Escasez de Tiempo',
		concept: 'Educación: La escasez de recursos como el tiempo disminuye la valoración de la autonomía.',
		scenario: 'El profesor les permite decidir cómo organizarán la clase de repaso de hoy. Tienen 50 minutos totales de clase. ¿Qué opción prefieres que se aplique?',
		options: [
			{ id: 'a', letter: 'A', text: 'Realizar una votación en vivo en clase entre 3 dinámicas de repaso diferentes propuestas por los estudiantes.' },
			{ id: 'b', letter: 'B', text: 'Que el profesor traiga una dinámica sorpresa estructurada por él y la aplique directamente.' }
		],
		giochiFeedback: 'Valora la sensación de agencia frente a la escasez de recursos. Aunque la opción A apoya el driver de autonomía, cuando los estudiantes perciben que el tiempo es escaso o limitado (ej. antes de un examen), muchos cambian su preferencia hacia la opción B por pura eficiencia de tiempo, sacrificando su autonomía.'
	},
	{
		id: 39,
		part: 3,
		type: 'selection',
		title: 'Slide F3.13: Metajuego de Planificación Académica',
		concept: 'Educación: La planificación inicial se prefiere al esfuerzo diferido, facilitando el compromiso.',
		scenario: 'Para ganar 5 puntos adicionales de participación al iniciar la materia, el profesor te da a elegir entre dos actividades. ¿Cuál prefieres realizar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Dedicar 30 minutos a redactar y firmar una "bitácora de compromiso personal" con tus metas de estudio.' },
			{ id: 'b', letter: 'B', text: 'Asistir a una clase presencial extra de repaso de 1 hora un sábado por la mañana.' }
		],
		giochiFeedback: 'Muestra si los estudiantes prefieren la fricción inicial de la planificación (A) o el esfuerzo físico y de tiempo posterior (B). A menudo eligen la planificación porque se siente de menor costo inmediato, aunque su impacto a largo plazo en su compromiso sea mayor.'
	},
	{
		id: 40,
		part: 3,
		type: 'selection',
		title: 'Slide F3.14: Uso de Hechizos / Items Lúdicos en el Aula',
		concept: 'Educación: La proyección de dinámicas de juego altera la aversión al riesgo y cooperación.',
		scenario: 'En un taller grupal de repaso gamificado, tu equipo de 3 personas ha ganado una "Poción de Doble Puntaje" (un solo uso). ¿Cómo deciden utilizarla?',
		options: [
			{ id: 'a', letter: 'A', text: 'Activarla de inmediato: Duplica los puntos que ganemos, pero si fallamos, resta 10 puntos a todo el equipo.' },
			{ id: 'b', letter: 'B', text: 'Guardarla para el examen final: Duplica la nota final, pero solo si todos asistieron a las tutorías.' },
			{ id: 'c', letter: 'C', text: 'Consumirla individualmente: Un solo miembro duplica su puntaje personal, y el resto gana +2 puntos estándar.' },
			{ id: 'd', letter: 'D', text: 'Canjearla de inmediato en la tienda del juego por 15 BEM Coins fijas para cada miembro.' }
		],
		giochiFeedback: 'Proyecta dinámicas lúdicas directas (riesgo, daño colateral, cooperación vs. egoísmo, o aversión al riesgo) sobre la estructura operativa del aula. Muestra cómo los estudiantes gestionan decisiones complejas cuando se introducen mecánicas de juego en su aprendizaje.'
	},
	{
		id: 41,
		part: 3,
		type: 'selection',
		title: 'Slide F3.15: Reversibilidad y Tolerancia al Fallo (Múltiples Entregas)',
		concept: 'Educación: La iteración reduce la ansiedad por fracaso fomentando la maestría activa.',
		scenario: 'Debes entregar tu proyecto final de la asignatura. ¿Qué política de entregas y evaluación prefieres que aplique el profesor?',
		options: [
			{ id: 'a', letter: 'A', text: 'Entrega única y definitiva en la última semana, con calificación directa sin oportunidad de cambios.' },
			{ id: 'b', letter: 'B', text: 'Micro-entregas semanales: 10 pequeñas tareas cortas a lo largo de todo el curso.' },
			{ id: 'c', letter: 'C', text: 'Dos entregas: Una entrega parcial con feedback a mitad de semestre, y una entrega final.' },
			{ id: 'd', letter: 'D', text: 'Entrega libre iterativa: Envías borradores, recibes feedback, los corriges y reenvías hasta obtener la nota deseada.' }
		],
		giochiFeedback: 'Explora la tolerancia al fallo (Smart Failure). Las opciones B, C y D reducen la presión del examen único, pero requieren una autogestión continua del esfuerzo. Permite ver si los estudiantes eligen la inercia de la entrega única (A) o prefieren invertir esfuerzo constante (D) a cambio de eliminar el riesgo de fallar.'
	},
	{
		id: 42,
		part: 3,
		type: 'selection',
		title: 'Slide F3.16: Personalización Estética (Cosmética Lúdica)',
		concept: 'Educación: El control estético personal promueve la identidad y el sentido de pertenencia.',
		scenario: 'La plataforma virtual de la materia te permite personalizar el aspecto visual de tu bitácora de estudio digital. ¿Qué tema estético decides activar?',
		options: [
			{ id: 'a', letter: 'A', text: 'Tema "Modo Hacker": Fondo negro, texto verde fluorescente y animaciones de código.' },
			{ id: 'b', letter: 'B', text: 'Tema "Domo Zen": Colores pastel, sonido ambiental de lluvia y temporizador Pomodoro.' },
			{ id: 'c', letter: 'C', text: 'Tema "Gremio de Magos": Textura de pergamino antiguo, sonido de páginas y medallas medievales.' }
		],
		giochiFeedback: 'La estética es una dimensión de la agencia. Aunque las tareas de estudio y las explicaciones son exactamente las mismas, dar control estético al estudiante (A, B o C) satisface el driver de identidad y expresión personal (Hedonismo), incrementando la retención y el tiempo voluntario de uso de la plataforma.'
	},
	{
		id: 43,
		part: 3,
		type: 'selection',
		title: 'Slide F3.17: Azar Controlado y Recompensas Inesperadas (Mecánica de Cofres)',
		concept: 'Educación: El azar controlado activa impulsos competitivos y motivación lúdica.',
		scenario: 'Has completado con éxito un módulo de estudio difícil. La plataforma te da a elegir cómo deseas reclamar tu recompensa. ¿Cuál prefieres?',
		options: [
			{ id: 'a', letter: 'A', text: 'Lanzar la "Moneda de la Suerte": 50% de probabilidad de ganar 20 BEM Coins y 50% de ganar 0.' },
			{ id: 'b', letter: 'B', text: 'Abrir el "Cofre del Destino": 80% de ganar 5 BEM Coins, y 20% de obtener una Medalla Épica.' },
			{ id: 'c', letter: 'C', text: 'Reclamar un "Boleto de Lotería de Clase" para el sorteo semanal de un eximente.' }
		],
		giochiFeedback: 'Investiga la afinidad por mecánicas de azar controlado (loot boxes/loot drops). Al hacer que todas las opciones involucren riesgo y azar (moneda simétrica, dado asimétrico positivo, lotería social), se evidencia cómo los estudiantes de la clase evalúan y comparan diferentes perfiles de incertidumbre lúdica aplicada a su rendimiento académico.'
	}
];
