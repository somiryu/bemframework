<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	let selectedFramework = $state('octalysis');

	const t = $derived({
		en: {
			title: 'Gamification Frameworks Comparison Suite | BEM vs Industry Standards',
			desc: 'Directly compare BEM with other popular gamification models: Yu-kai Chou\'s Octalysis, Marczewski\'s Hexad, ADDIE, Nir Eyal\'s Hook Model, and SDT.',
			header: 'Framework Comparison Suite',
			sub: 'Evaluating behavioral design methodologies objectively and highlighting BEM\'s core paradigms.',
			dropdownLabel: 'Select a framework to compare:',
			praiseHeader: '🌟 Friendly Praise (What it does well)',
			critiqueHeader: '⚠️ Systemic Critique (BEM\'s Critical View)',
			resolutionHeader: '🚀 The BEM Resolution (How BEM solves it)',
			integrationHeader: '🔌 How to Integrate BEM',
			synergyHeader: '🤝 How They Complement Each Other',
			frameworks: {
				octalysis: {
					name: 'Octalysis (Yu-kai Chou)',
					core: '8 Core Drives shaping human motivation inside an octagon (White vs. Black Hat, Left vs. Right Brain).',
					praise: 'Extremely strong visual auditing and mapping capabilities. The White Hat vs. Black Hat drive separation provides exceptional conceptual clarity for classifying user emotional pressures.',
					critique: '1) High risk of coercive Black Hat mechanics (scarcity, loss) that drive short-term metrics but cause anxiety. 2) Centers primarily on behavioral sciences (extrinsic nudges/features) rather than gameful decision architectures and feedback loops. Octalysis focuses on mechanics, while BEM focuses on decision systems and feedback loops.',
					resolution: 'BEM focuses on "Meaningful Learning Loops" and feedback as instruction signals. It decouples progress from simple reward points, preventing Skinner-burnout by prioritizing long-term autonomy and competence.',
					integration: 'Use the Octalysis octagon grid to audit user motivations during early design brainstorming, then use the BEM GFR grammar to engineer the underlying decision states, loops, and interface feedback signals.',
					synergy: 'Octalysis identifies *why* a user wants to engage, and BEM designs *how* the software actually converses, evaluates, and dynamically scaffolding that engagement without Skinner-box coercion.'
				},
				hexad: {
					name: 'Gamification Hexad (Andrzej Marczewski)',
					core: '6 User Types (Achievers, Socializers, Philanthropists, Free Spirits, Players, Disruptors) motivated by intrinsic/extrinsic vectors.',
					praise: 'Highly user-centric. Acknowledges that individuals are not monolithic and display varying combinations of motivations (autonomy, relatedness, purpose). Perfect for persona profiling.',
					critique: 'Focuses heavily on categorizing players. It does not provide designers with the structural engineering loops (how actions connect to system state and feedback codes) required to build the software itself.',
					resolution: 'BEM bridges player profiling with system architecture. It maps the GFR (Goals, Feedback, Rewards) grammar, converting player archetypes (e.g. Climber, Hacker) directly into micro-objective actions and LEGIBLE interfaces.',
					integration: 'Profile your users using the Hexad scales during target audience analysis. Then, map Hexad user types directly to BEM\'s 7 Intrinsic Motivators to build custom objectives tailored to each type.',
					synergy: 'Hexad guarantees you know *who* you are designing for, while BEM guarantees your software provides the exact *micro-conversations* and points grammar that those users require to thrive.'
				},
				addie: {
					name: 'ADDIE Model (Instructional Design)',
					core: 'Linear 5-phase educational cycle: Analysis, Design, Development, Implementation, Evaluation.',
					praise: 'Incredible pedagogical and structural rigor. Excellent for mapping out comprehensive curricular matrices and establishing clear learning standards.',
					critique: 'Very rigid and monolithic. Operates under linear progress tracks where all students are expected to move synchronously, lacking the play-based cycles of trial, manageable failure, and rapid iteration.',
					resolution: 'BEM introduces "Ludic Learning Cycles" (1-5 min micro-conversations) and "Universal Measurement". It normalizes error as a core driver, allowing non-linear paths of exploration and self-paced mastery.',
					integration: 'Keep the macro-ADDIE model for organizational compliance and milestone planning, but replace the "Design" and "Development" phases with BEM ludic loops, micro-objectives, and scaffolding cycles.',
					synergy: 'ADDIE provides the high-level educational governance and academic validity, while BEM injects the micro-level interactive engagement that keeps students actively participating.'
				},
				hook: {
					name: 'Hook Model (Nir Eyal)',
					core: '4-step habit-forming loop: Trigger, Action, Variable Reward, Investment.',
					praise: 'Highly effective at building product habits and short-term engagement. Excellent at aligning product hooks with automatic user behavior.',
					critique: 'Relies heavily on variable reward schedules (which mimic gambling slot machines). This extrinsic manipulation can degrade intrinsic autonomy, causing user fatigue, trust decay, and addictive behaviors.',
					resolution: 'BEM rejects manipulative variable bribes. It aligns with Organismic Integration Theory (OIT) to design "integrated objectives". Rewards are not external carrots; they are functional multipliers that enrich subsequent play.',
					integration: 'Use Hook\'s triggers to invite initial onboarding actions, but replace variable reward schedules with BEM\'s "Points as Grammar" taxonomy (like Skill Scores and Exploration Scores) to foster Competence.',
					synergy: 'Hook creates the immediate loop entry and habit hooks, while BEM transforms that habit into deep, voluntary mastery, meaning, and non-addictive long-term retention.'
				},
				sdt: {
					name: 'Self-Determination Theory (Deci & Ryan)',
					core: 'Psychological framework asserting that human growth requires three basic needs: Autonomy, Competence, and Relatedness.',
					praise: 'The definitive empirical foundation of intrinsic motivation. Grounded in decades of clinical psychological research validating the human need for self-determination.',
					critique: 'A highly theoretical psychology model. It does not translate these high-level psychological needs into practical code structures, UI variables, or concrete game actions for software developers.',
					resolution: 'BEM serves as an operational bridge. It translates Competence into "Mastery curves", Autonomy into "Sandbox choice architecture", and Relatedness into "Social peer trust vectors", tokenizing psychology into software engineering.',
					integration: 'Use SDT as your psychological North Star to justify and audit the system. Use BEM to implement the exact points grammar, visual interface states, and objective-chaining algorithms.',
					synergy: 'SDT provides the scientific validation of BEM\'s intrinsic goals, while BEM provides the engineering blueprints to actually deploy SDT inside modern digital platforms.'
				}
			}
		},
		es: {
			title: 'Comparador de Marcos de Gamificación | BEM vs Estándares de la Industria',
			desc: 'Compara directamente el marco BEM con otros modelos populares: Octalysis de Yu-kai Chou, Hexad de Marczewski, ADDIE, Hook Model y SDT.',
			header: 'Comparador de Metodologías BEM',
			sub: 'Evaluamos marcos conductuales de forma objetiva, destacando sus fortalezas y los paradigmas de BEM.',
			dropdownLabel: 'Selecciona un marco para comparar:',
			praiseHeader: '🌟 Elogio Amistoso (Lo que hace muy bien)',
			critiqueHeader: '⚠️ Crítica Sistémica (Visión Crítica de BEM)',
			resolutionHeader: '🚀 La Resolución BEM (Cómo lo resuelve BEM)',
			integrationHeader: '🔌 Cómo Integrar BEM',
			synergyHeader: '🤝 Cómo se Complementan (Sinergia)',
			frameworks: {
				octalysis: {
					name: 'Octalysis (Yu-kai Chou)',
					core: '8 Motivadores Centrales dispuestos en un octágono (White vs. Black Hat, Cerebro Izquierdo vs. Derecho).',
					praise: 'Excelente claridad visual y auditoría sistémica. La separación de White Hat (positivo a largo plazo) y Black Hat (urgencia a corto plazo) proporciona una claridad conceptual insuperable.',
					critique: '1) Alto riesgo de mecánicas coercitivas Black Hat (pérdida, escasez) que inflan métricas a corto plazo pero causan ansiedad. 2) Se centra más en ciencias conductuales (nudges y features externos) que en arquitecturas de decisión lúdicas y feedback. Octalysis se enfoca en mecánicas; BEM en sistemas de decisión y bucles.',
					resolution: 'BEM se enfoca en "Bucles de Aprendizaje de Sentido" y señales de instrucción. Desacopla el progreso de recompensas simples, evitando el burnout conductual al priorizar la autonomía intrínseca.',
					integration: 'Utiliza el octágono de Octalysis en la lluvia de ideas inicial para auditar motivaciones de usuario. Luego, aplica la gramática GFR de BEM para codificar los estados de decisión del software y las señales de la interfaz.',
					synergy: 'Octalysis identifica *por qué* quiere engancharse un usuario, y BEM diseña *cómo* el software conversa, evalúa y andamia de manera fluida y ética esa interacción.'
				},
				hexad: {
					name: 'Gamification Hexad (Andrzej Marczewski)',
					core: '6 Tipos de Usuario (Achievers, Socializers, Philanthropists, Free Spirits, Players, Disruptors) según motivaciones.',
					praise: 'Muy centrado en el usuario. Reconoce que las personas no son monolíticas y muestran combinaciones de motivaciones (autonomía, relaciones, propósito). Excelente para crear personas.',
					critique: 'Se enfoca demasiado en clasificar perfiles, pero no entrega a los diseñadores la arquitectura técnica (cómo conectar acciones con el estado del sistema y señales de feedback).',
					resolution: 'BEM une el perfil del jugador con la arquitectura del sistema. Mapea la gramática de GFR, traduciendo arquetipos de usuario (ej. Climber, Hacker) en micro-objetivos y variables legibles de interfaz.',
					integration: 'Clasifica a tu público objetivo con la escala Hexad. Luego, mapea estos perfiles directo a los 7 Motivadores Intrínsecos BEM para construir metas y mecánicas específicas para cada tipo.',
					synergy: 'Hexad te asegura saber *para quién* diseñas, mientras que BEM asegura que tu software provea las *micro-conversaciones* y la gramática de puntos exacta que ese perfil necesita.'
				},
				addie: {
					name: 'Modelo ADDIE (Diseño Instruccional)',
					core: 'Ciclo educativo lineal de 5 fases: Análisis, Diseño, Desarrollo, Implementación y Evaluación.',
					praise: 'Increíble rigor pedagógico y estructural. Es la base perfecta para diagramar currículos densos y asegurar estándares de conocimiento claros.',
					critique: 'Rígido y monolítico. Asume rutas lineales donde todos los estudiantes avanzan sincrónicamente, eliminando el ciclo lúdico de prueba, error gestionable y retroalimentación inmediata.',
					resolution: 'BEM introduce los "Ciclos Lúdicos de Aprendizaje" (micro-conversaciones de 1 a 5 minutos). Normaliza el error como motor de aprendizaje y permite la exploración autónoma.',
					integration: 'Mantén ADDIE para la planificación macro y cumplimiento institucional, pero reemplaza la fase de "Diseño" y "Desarrollo" con bucles BEM, micro-objetivos y andamiaje cognitivo.',
					synergy: 'ADDIE provee la gobernanza y validez educativa general, mientras que BEM inyecta el engagement a micro-escala que mantiene a los estudiantes activos y concentrados.'
				},
				hook: {
					name: 'Hook Model (Nir Eyal)',
					core: 'Bucle de habituación de 4 pasos: Disparador, Acción, Recompensa Variable e Inversión.',
					praise: 'Sumamente efectivo para generar hábitos de producto y retención a corto plazo, alineando ganchos visuales con el comportamiento automático.',
					critique: 'Depende fuertemente de recompensas variables (como las máquinas tragamonedas). Esta manipulación extrínseca daña la autonomía real, generando fatiga y desconfianza.',
					resolution: 'BEM rechaza los sobornos de recompensas variables. Se alinea con la Teoría de Integración Organísmica (OIT) para diseñar "objetivos integrados", donde las recompensas son multiplicadores del juego, no zanahorias externas.',
					integration: 'Usa los disparadores del Hook Model para incentivar las primeras interacciones, pero sustituye los premios variables con la taxonomía de BEM (como Skill Scores y Exploration Scores) para nutrir la competencia real.',
					synergy: 'Hook crea el gancho de hábito inicial, y BEM transforma ese hábito en maestría voluntaria y retención ética a largo plazo sin conductas adictivas.'
				},
				sdt: {
					name: 'Teoría de la Autodeterminación (SDT - Deci & Ryan)',
					core: 'Marco psicológico que postula que el crecimiento humano requiere Autonomía, Competencia y Vinculación.',
					praise: 'La base científica definitiva de la motivación intrínseca. Respaldada por décadas de rigurosa investigación clínica sobre las necesidades psicológicas humanas.',
					critique: 'Es una teoría puramente psicológica. No proporciona estructuras de código, variables de interfaz ni acciones de juego que los desarrolladores de software puedan programar directamente.',
					resolution: 'BEM actúa como un puente operativo. Traduce Competencia en "curvas de maestría", Autonomía en "cajas de arena conductuales" y Vinculación en "vectores de confianza social", tokenizando la psicología en software.',
					integration: 'Adopta SDT como la brújula científica para validar tus sistemas, y aplica BEM para estructurar el código, los algoritmos de encadenamiento de metas y las señales visuales.',
					synergy: 'SDT aporta la validez científica fundamental sobre el engagement sano, y BEM aporta los planos de ingeniería de software para implementarlo en entornos digitales.'
				}
			}
		}
	}[lang]);

	const currentFramework = $derived(t.frameworks[selectedFramework as keyof typeof t.frameworks]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={t.header} description={t.sub} />

<section class="section comparison-view">
	<div class="container broad-layout">
		<!-- FRAMEWORK SELECTION dropdown -->
		<div class="selector-card card glass-card">
			<label for="framework-select">{t.dropdownLabel}</label>
			<select id="framework-select" bind:value={selectedFramework}>
				<option value="octalysis">Octalysis (Yu-kai Chou)</option>
				<option value="hexad">Gamification Hexad (Andrzej Marczewski)</option>
				<option value="addie">ADDIE Model (Instructional Design)</option>
				<option value="hook">Hook Model (Nir Eyal)</option>
				<option value="sdt">Self-Determination Theory (SDT)</option>
			</select>
		</div>

		<!-- DETAILED COMPARATIVE GRID -->
		{#if currentFramework}
			<div class="comparison-details-grid">
				<!-- CORE COMPARISON HEAD -->
				<div class="comp-box core-box card glass-card full-width">
					<h3>⚔️ BEM vs. {currentFramework.name}</h3>
					<div class="core-summary">
						<strong>{lang === 'es' ? 'Concepto Central:' : 'Core Concept:'}</strong>
						<p>{currentFramework.core}</p>
					</div>
				</div>

				<!-- PRAISE -->
				<div class="comp-box praise-box card glass-card border-green">
					<h4>{t.praiseHeader}</h4>
					<p>{currentFramework.praise}</p>
				</div>

				<!-- CRITIQUE -->
				<div class="comp-box critique-box card glass-card border-red">
					<h4>{t.critiqueHeader}</h4>
					<p>{currentFramework.critique}</p>
				</div>

				<!-- RESOLUTION -->
				<div class="comp-box resolution-box card glass-card border-purple full-width">
					<h4>{t.resolutionHeader}</h4>
					<p>{currentFramework.resolution}</p>
				</div>

				<!-- INTEGRATION -->
				<div class="comp-box integration-box card glass-card border-orange">
					<h4>{t.integrationHeader}</h4>
					<p>{currentFramework.integration}</p>
				</div>

				<!-- SYNERGY / COMPLEMENT -->
				<div class="comp-box synergy-box card glass-card border-blue">
					<h4>{t.synergyHeader}</h4>
					<p>{currentFramework.synergy}</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
.comparison-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	max-width: 1000px !important;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.glass-card {
	background: white;
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
}

.selector-card {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 500px;
	margin: 0 auto;
	padding: 2rem;
}

.selector-card label {
	font-weight: 800;
	font-size: 0.95rem;
	color: var(--color-text);
}

.selector-card select {
	width: 100%;
	padding: 0.85rem 1rem;
	border: 2px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-bg-alt);
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-text);
	cursor: pointer;
	outline: none;
	transition: var(--transition-fast);
}

.selector-card select:focus {
	border-color: var(--color-purple);
	background: white;
}

/* COMPARISON GRID */
.comparison-details-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

.comp-box.full-width {
	grid-column: span 2;
}

.comp-box h3 {
	font-size: 1.6rem;
	font-weight: 900;
	color: var(--color-text);
	margin-bottom: 1.5rem;
}

.comp-box h4 {
	font-size: 1.15rem;
	font-weight: 800;
	margin-bottom: 0.75rem;
	color: var(--color-text);
}

.comp-box p {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-text-muted);
	margin: 0;
	font-weight: 550;
}

.core-summary {
	background: var(--color-bg-alt);
	padding: 1.5rem;
	border-radius: var(--radius-md);
	border: 1px solid var(--color-border);
}

.core-summary strong {
	display: block;
	font-size: 0.9rem;
	color: var(--color-purple);
	text-transform: uppercase;
	margin-bottom: 0.5rem;
}

.core-summary p {
	color: var(--color-text);
	font-weight: 700;
	font-size: 1.05rem;
}

.border-green { border-top: 4px solid var(--color-green); }
.border-red { border-top: 4px solid var(--color-red); }
.border-purple { border-top: 5px solid var(--color-purple); }
.border-orange { border-top: 4px solid var(--color-orange); }
.border-blue { border-top: 4px solid #2563eb; }

@media (max-width: 768px) {
	.comparison-details-grid {
		grid-template-columns: 1fr;
	}
	.comp-box.full-width {
		grid-column: span 1;
	}
}
</style>
