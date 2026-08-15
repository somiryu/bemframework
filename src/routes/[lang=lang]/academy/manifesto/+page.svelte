<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { tick } from 'svelte';

	let { data }: { data: { lang: string } } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	let activeChapter = $state('');
	let chapterEls = $state<Record<string, HTMLElement>>({});

	const chapters = [
		{ id: 'ch-intro', num: '1', labelEn: 'Introduction', labelEs: 'Introducción' },
		{ id: 'ch-oit', num: '2', labelEn: 'Motivation & the OIT Continuum', labelEs: 'Motivación y el Continuo OIT' },
		{ id: 'ch-drivers', num: '3', labelEn: 'The Seven Drivers', labelEs: 'Los Siete Drivers' },
		{ id: 'ch-systemic', num: '4', labelEn: 'The Systemic Approach', labelEs: 'El Enfoque Sistémico' },
		{ id: 'ch-cycle', num: '5', labelEn: 'The Interactive Learning Cycle', labelEs: 'El Ciclo Interactivo de Aprendizaje' },
		{ id: 'ch-goals', num: '6', labelEn: 'Goals as Systems of Anticipation', labelEs: 'Metas como Sistemas de Anticipación' },
		{ id: 'ch-architecture', num: '7', labelEn: 'Goal Architecture', labelEs: 'Arquitectura de Metas' },
		{ id: 'ch-secondary', num: '8', labelEn: 'Secondary Goals', labelEs: 'Metas Secundarias' },
		{ id: 'ch-cta', num: '9', labelEn: 'Call to Action & Attention', labelEs: 'Llamado a la Acción y Atención' },
		{ id: 'ch-evaluation', num: '10', labelEn: 'Evaluation: Rules That Build Competency', labelEs: 'Evaluación: Reglas que Construyen Competencia' },
		{ id: 'ch-feedback', num: '11', labelEn: 'Feedback as Information and Emotion', labelEs: 'Feedback como Información y Emoción' },
		{ id: 'ch-elaborate', num: '12', labelEn: 'Corrective & Elaborate Feedback', labelEs: 'Feedback Correctivo y Elaborado' },
		{ id: 'ch-building', num: '13', labelEn: 'The Building Blocks of Feedback', labelEs: 'Los Bloques del Feedback' },
		{ id: 'ch-failure', num: '14', labelEn: 'Failure as a Learning Mechanism', labelEs: 'El Fracaso como Mecanismo de Aprendizaje' },
		{ id: 'ch-points', num: '15', labelEn: 'The Power of Points in Education', labelEs: 'El Poder de los Puntos en la Educación' },
		{ id: 'ch-update', num: '16', labelEn: 'Updating Goals and the New Loop', labelEs: 'Actualizando Metas y el Nuevo Ciclo' },
		{ id: 'ch-cycles', num: '17', labelEn: 'Progression Cycles', labelEs: 'Ciclos de Progresión' },
		{ id: 'ch-ai', num: '18', labelEn: 'AI and BEM Gamification', labelEs: 'IA y Gamificación BEM' },
		{ id: 'ch-conclusion', num: '19', labelEn: 'Conclusion', labelEs: 'Conclusión' }
	];

	let observer: IntersectionObserver;

	function setupObserver() {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeChapter = entry.target.id;
					}
				}
			},
			{ rootMargin: '-80px 0px -60% 0px', threshold: 0 }
		);
		for (const el of Object.values(chapterEls)) {
			if (el) observer.observe(el);
		}
	}

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			tick().then(() => {
				setupObserver();
			});
		}
		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

<svelte:head>
	<title>{lang === 'es' ? 'Arquitectura Pedagógica BEM | Beyond Points and Badges' : 'BEM Pedagogical Architecture | Beyond Points and Badges'}</title>
	<meta name="description" content={lang === 'es' ? 'Artículo completo sobre la arquitectura pedagógica de BEM: motivación, drivers, metas, feedback, evaluación y fracaso.' : 'Full article on BEM\'s pedagogical architecture: motivation, drivers, goals, feedback, evaluation, and failure.'} />
</svelte:head>

<SEO
	title={lang === 'es' ? 'Arquitectura Pedagógica BEM | Beyond Points and Badges' : 'BEM Pedagogical Architecture | Beyond Points and Badges'}
	description={lang === 'es' ? 'Artículo completo sobre la arquitectura pedagógica de BEM.' : 'Full article on BEM\'s pedagogical architecture.'}
	{lang}
/>

<HeroSection
	title={lang === 'es' ? 'Arquitectura Pedagógica de BEM' : 'BEM Pedagogical Architecture'}
	description={lang === 'es' ? 'Artículo completo — 19 capítulos sobre motivación, drivers, metas, feedback, evaluación, fracaso, puntos, ciclos de progresión e IA.' : 'Full article — 19 chapters on motivation, drivers, goals, feedback, evaluation, failure, points, progression cycles, and AI.'}
/>

<section class="learning-layout-view">
	<div class="container broad-layout">
		<!-- SIDEBAR NAVIGATION -->
		<aside class="sidebar-nav card glass-card">
			<h3>{lang === 'es' ? 'Capítulos' : 'Chapters'}</h3>
			<nav>
				{#each chapters as ch}
					<button
						class="nav-sublink"
						class:active={activeChapter === ch.id}
						onclick={() => scrollTo(ch.id)}
					>
						<span class="ch-num">{ch.num}.</span>
						{lang === 'es' ? ch.labelEs : ch.labelEn}
					</button>
				{/each}
			</nav>
		</aside>

		<!-- MAIN READING CONTENT -->
		<main class="main-content card glass-card">
			<!-- HEADER -->
			<div class="article-header">
				{#if lang === 'es'}
					<h1>Más Allá de Puntos e Insignias:<br />Cómo la Arquitectura de Feedback de BEM Apoya el Aprendizaje Autónomo</h1>
					<div class="byline">
						<span class="author">Por Javier Velásquez — Diseñador de BEM</span>
						<span class="version">V1. 10/06/2026</span>
					</div>
				{:else}
					<h1>Beyond Points and Badges:<br />How BEM's Feedback Architecture Supports Autonomous Learning</h1>
					<div class="byline">
						<span class="author">By Javier Velásquez — Designer of BEM</span>
						<span class="version">V1. 10/06/2026</span>
					</div>
				{/if}
			</div>

			<!-- CHAPTER 1: Introduction -->
			<section id="ch-intro" bind:this={chapterEls['ch-intro']}>
				{#if lang === 'es'}
					<h2>1. Introducción</h2>
					<p class="intro-paragraph">Durante las últimas dos décadas, la respuesta predeterminada a "¿cómo hacemos la educación más atractiva?" ha sido engañosamente simple: agregar puntos, medallas y tablas de líderes. Pon una barra de progreso en una tarea de lectura, otorga una estrella por completar un cuestionario y deja que la tabla de líderes haga el resto. Este enfoque — comúnmente llamado gamificación PBL (Puntos, Medallas y tablas de Líderes) — se ha extendido por aulas, plataformas de capacitación corporativa y sistemas de gestión de aprendizaje con una velocidad notable.</p>
					<p>Y sin embargo, la evidencia cuenta una historia más complicada. Los meta-análisis muestran que la gamificación puede mejorar el compromiso, la motivación e incluso los resultados de aprendizaje, pero estos efectos son desiguales, dependientes del contexto y — crucialmente — frágiles. Cuando los puntos desaparecen, el comportamiento tiende a desaparecer con ellos. Aún más preocupante, hay evidencia de que las recompensas extrínsecas pueden erosionar la motivación intrínseca preexistente: los estudiantes que leían por placer, una vez recompensados con estrellas, comienzan a leer por las estrellas, y cuando las estrellas dejan de llegar, leen <em>menos</em> de lo que leían antes de la intervención.</p>
					<p>El problema no es la gamificación en sí misma. El problema es que la mayoría de los enfoques de gamificación tratan la motivación como algo que se inyecta desde afuera — una capa de recompensas cosméticas pintadas sobre un núcleo instruccional sin cambios.</p>
					<p>Hay una alternativa. En lugar de agregar elementos de juego <em>sobre</em> la instrucción, podemos rediseñar la instrucción misma usando la lógica estructural de los juegos: sus arquitecturas de metas, sus sistemas de retroalimentación, sus mecanismos de evaluación, su relación con el fracaso. Esto es lo que propone el marco BEM (Behavioral-Experiential-Meaningful) — no como una taxonomía de elementos, sino como una arquitectura instruccional integrada.</p>
					<p>Este artículo introduce BEM desde una perspectiva pedagógica. Se enfoca en los principios de diseño que hacen de BEM una metodología coherente para el aprendizaje, en lugar de una lista de trucos de compromiso. Exploraremos cómo BEM replantea la motivación a través del lente de la Teoría de Integración Orgánica, cómo estructura las metas en torno a la identidad y la autonomía, cómo diseña la retroalimentación como información y emoción, y cómo transforma la evaluación y el fracaso en motores de aprendizaje. El objetivo es proporcionar a los profesionales — docentes, diseñadores instruccionales y desarrolladores de experiencias de aprendizaje — un marco que puedan usar para construir sistemas donde los estudiantes persistan porque la actividad misma es significativa, no porque una recompensa externa los obligue.</p>
				{:else}
					<h2>1. Introduction</h2>
					<p class="intro-paragraph">For the past two decades, the default answer to "how do we make education more engaging?" has been deceptively simple: add points, badges, and leaderboards. Slap a progress bar on a reading assignment, award a star for completing a quiz, and let the leaderboard sort out the rest. This approach — commonly referred to as PBL gamification (Points, Badges, Leaderboards) — has spread through classrooms, corporate training platforms, and learning management systems with remarkable speed.</p>
					<p>And yet, the evidence tells a more complicated story. Meta-analyses show that gamification can improve engagement, motivation, and even learning outcomes, but these effects are uneven, context-dependent, and — crucially — fragile. When the points disappear, the behavior tends to disappear with them. More troubling still, there is evidence that extrinsic rewards can erode pre-existing intrinsic motivation: students who read for pleasure, once rewarded with stars, begin reading for the stars, and when the stars stop coming, they read <em>less</em> than they did before the intervention.</p>
					<p>The problem is not gamification itself. The problem is that most gamification approaches treat motivation as something you inject from the outside — a layer of cosmetic rewards painted onto an unchanged instructional core.</p>
					<p>There is an alternative. Instead of adding game elements <em>onto</em> instruction, we can redesign the instruction itself using the structural logic of games: their goal architectures, their feedback systems, their evaluation mechanisms, their relationship with failure. This is what the Behavioral-Experiential-Meaningful (BEM) framework proposes — not as a taxonomy of elements, but as an integrated instructional architecture.</p>
					<p>This article introduces BEM from a pedagogical perspective. It focuses on the design principles that make BEM a coherent methodology for learning, rather than a list of engagement tricks. We will explore how BEM rethinks motivation through the lens of Organismic Integration Theory, how it structures goals around identity and autonomy, how it designs feedback as both information and emotion, and how it transforms evaluation and failure into engines of learning. The goal is to provide practitioners — teachers, instructional designers, and learning experience developers — with a framework they can use to build systems where students persist because the activity itself is meaningful, not because an external reward compels them.</p>
				{/if}
			</section>

			<!-- CHAPTER 2: Motivation and the OIT Continuum -->
			<section id="ch-oit" bind:this={chapterEls['ch-oit']}>
				{#if lang === 'es'}
				<h2>2. Motivación y el Continuo OIT: De la Presión a la Integración</h2>
				<p>Antes de diseñar para el compromiso, debemos entender qué impulsa el comportamiento humano. La Teoría de la Autodeterminación (SDT), desarrollada por Edward Deci y Richard Ryan, es uno de los marcos más rigurosamente probados en la psicología motivacional. Postula que los seres humanos tienen tres necesidades psicológicas básicas: autonomía (la necesidad de sentirse voluntarios), competencia (la necesidad de sentirse eficaces) y relación (la necesidad de sentirse conectados). Cuando estas necesidades son apoyadas, la motivación florece; cuando son frustradas, la motivación se marchita.</p>
				<p>Dentro de la SDT, una mini-teoría es particularmente relevante para el diseño de gamificación: la Teoría de Integración Orgánica (OIT). La OIT describe el espectro de la motivación, desde completamente controlada hasta totalmente autónoma. La idea clave es que la motivación extrínseca no es un monolito. Hay una diferencia cualitativa entre "estudio porque si no pierdo puntos" y "estudio porque ser una persona con conocimientos importa para quien soy". La OIT formaliza esto como un continuo:</p>
				<ul>
					<li><strong>Regulación Externa</strong>: Comportamiento impulsado por recompensas o castigos externos. "Estudio porque el profesor me da puntos." Este es el ámbito de la gamificación PBL en su forma más pura. El locus de causalidad percibido está completamente fuera de la persona.</li>
					<li><strong>Regulación Introyectada</strong>: Comportamiento impulsado por presión interna — culpa, vergüenza o autoestima contingente. "Estudio porque me sentiría mal conmigo mismo si no lo hiciera." La presión está internalizada, pero aún se experimenta como control, no como elección.</li>
					<li><strong>Regulación Identificada</strong>: Comportamiento impulsado por la valoración consciente del resultado. "Estudio porque quiero ser enfermero, y entender la anatomía es esencial para eso." La persona se identifica con la importancia de la acción, incluso si la acción en sí no es inherentemente placentera.</li>
					<li><strong>Regulación Integrada</strong>: Comportamiento impulsado por la alineación completa con los valores y la identidad de uno. "Estudio porque ser alguien que entiende este material es parte de quién soy." Esta es la forma más autónoma de motivación extrínseca. La acción sigue siendo instrumental — la realizas por un resultado separable — pero ese resultado está profundamente entretejido en tu sentido del yo.</li>
					<li><strong>Motivación Intrínseca</strong>: Comportamiento impulsado por el puro disfrute de la actividad en sí misma. "Estudio porque aprender esto es fascinante." Este es el estándar de oro de la motivación, pero no siempre es posible alcanzarlo — no toda tarea de aprendizaje puede hacerse inherentemente agradable para cada estudiante.</li>
				</ul>
				<p>El hallazgo crítico de la investigación sobre la OIT es que <strong>la regulación identificada e integrada producen resultados casi tan positivos como la motivación intrínseca</strong> en términos de persistencia, creatividad, bienestar y profundidad del aprendizaje. El objetivo del diseño educativo, entonces, no es necesariamente hacer que todo sea intrínsecamente divertido — un estándar imposible — sino crear condiciones donde los estudiantes puedan identificarse e integrar el valor de lo que están aprendiendo.</p>
				<p>Aquí es donde la gamificación PBL típicamente falla. Los puntos, medallas y tablas de líderes operan casi exclusivamente al nivel de la <strong>regulación externa</strong>. Dicen: "Haz esto y obtendrás esta recompensa externa." La relación del estudiante con la actividad de aprendizaje no cambia. La actividad sigue siendo algo que se soporta por el bien de la recompensa. Cuando la recompensa desaparece, también lo hace la motivación.</p>
				<p>BEM toma un enfoque diferente. En lugar de agregar recompensas externas, BEM replantea las señales dentro del sistema de aprendizaje como <strong>informativas</strong> en lugar de <strong>controladoras</strong>. Una calificación puede experimentarse como un juicio controlador ("sacaste una C, necesitas mejorar") o como retroalimentación informativa ("tu comprensión actual está en este nivel; aquí están las áreas específicas donde tu modelo necesita ajuste"). Los datos pueden ser los mismos; el impacto motivacional es radicalmente diferente.</p>
				<p>La arquitectura motivacional de BEM está diseñada para apoyar el movimiento a lo largo del continuo OIT — desde la regulación externa hacia la regulación identificada e integrada. Lo hace no eliminando la estructura (la autonomía sin estructura es caos), sino asegurando que cada elemento estructural comunique su relevancia para las metas y valores propios del estudiante. El sistema no dice "haz esto porque lo digo yo" o "haz esto por una estrella". Dice, implícita y explícitamente: "aquí está por qué esto importa, aquí está dónde te encuentras y aquí está cómo puedes crecer."</p>
				<p>Este principio — que las señales externas deben apoyar la internalización en lugar de evitarla — es la base de todo lo que sigue.</p>
				{:else}
				<h2>2. Motivation and the OIT Continuum: From Pressure to Integration</h2>
				<p>Before we can design for engagement, we need to understand what drives human behavior. Self-Determination Theory (SDT), developed by Edward Deci and Richard Ryan, is one of the most rigorously tested frameworks in motivational psychology. It posits that human beings have three basic psychological needs: autonomy (the need to feel volitional), competence (the need to feel effective), and relatedness (the need to feel connected). When these needs are supported, motivation flourishes; when they are thwarted, motivation withers.</p>
				<p>Within SDT, one mini-theory is particularly relevant to gamification design: Organismic Integration Theory (OIT). OIT describes the spectrum of motivation, from completely controlled to fully autonomous. The key insight is that extrinsic motivation is not a monolith. There is a qualitative difference between "I study because otherwise I'll lose points" and "I study because being a knowledgeable person matters to who I am." OIT formalizes this as a continuum:</p>
				<ul>
					<li><strong>External Regulation</strong>: Behavior driven by external rewards or punishments. "I study because the teacher gives me points." This is the realm of PBL gamification in its purest form. The perceived locus of causality is entirely outside the person.</li>
					<li><strong>Introjected Regulation</strong>: Behavior driven by internal pressure — guilt, shame, or contingent self-esteem. "I study because I'd feel bad about myself if I didn't." The pressure is internalized, but it is still experienced as control, not choice.</li>
					<li><strong>Identified Regulation</strong>: Behavior driven by conscious valuing of the outcome. "I study because I want to be a nurse, and understanding anatomy is essential for that." The person identifies with the importance of the action, even if the action itself is not inherently enjoyable.</li>
					<li><strong>Integrated Regulation</strong>: Behavior driven by full alignment with one's values and identity. "I study because being someone who understands this material is part of who I am." This is the most autonomous form of extrinsic motivation. The action is still instrumental — you are doing it for a separable outcome — but that outcome is deeply woven into your sense of self.</li>
					<li><strong>Intrinsic Motivation</strong>: Behavior driven by pure enjoyment of the activity itself. "I study because learning this is fascinating." This is the gold standard of motivation, but it is not always possible to achieve — not every learning task can be made inherently enjoyable for every student.</li>
				</ul>
				<p>The critical finding from OIT research is that <strong>identified and integrated regulation produce outcomes nearly as positive as intrinsic motivation</strong> in terms of persistence, creativity, well-being, and depth of learning. The goal of educational design, then, is not necessarily to make everything intrinsically fun — an impossible standard — but to create conditions where learners can identify with and integrate the value of what they are learning.</p>
				<p>This is where PBL gamification typically fails. Points, badges, and leaderboards operate almost exclusively at the level of <strong>external regulation</strong>. They say: "Do this thing, and you will get this external reward." The learner's relationship to the learning activity does not change. The activity remains something to be endured for the sake of the reward. When the reward disappears, so does the motivation.</p>
				<p>BEM takes a different approach. Rather than adding external rewards, BEM reframes the signals within the learning system as <strong>informational</strong> rather than <strong>controlling</strong>. A grade can be experienced as a controlling judgment ("you got a C, you need to improve") or as informational feedback ("your current understanding is at this level; here are the specific areas where your model needs adjustment"). The data may be the same; the motivational impact is radically different.</p>
				<p>BEM's motivational architecture is designed to support movement along the OIT continuum — from external regulation toward identified and integrated regulation. It does this not by removing structure (autonomy without structure is chaos), but by ensuring that every structural element communicates its relevance to the learner's own goals and values. The system does not say "do this because I say so" or "do this for a star." It says, implicitly and explicitly: "here is why this matters, here is where you stand, and here is how you can grow."</p>
				<p>This principle — that external signals should support internalization rather than bypass it — is the foundation of everything that follows.</p>
				{/if}
			</section>

			<!-- CHAPTER 3: The Seven Drivers -->
			<section id="ch-drivers" bind:this={chapterEls['ch-drivers']}>
				{#if lang === 'es'}
				<h2>3. Los Siete Drivers: Un Lenguaje para la Diversidad Motivacional</h2>
				<p>El continuo OIT explica el proceso de internalización — cómo la regulación externa puede, bajo las condiciones adecuadas, transformarse en motivación integrada o intrínseca. Pero no nos dice qué tipos de experiencias encuentran significativas los diferentes estudiantes. Dos estudiantes pueden alcanzar la regulación identificada, cada uno a través de un canal completamente diferente. Uno puede conectarse a través del deseo de maestría; otro a través de la necesidad de conexión social; un tercero a través de la emoción del descubrimiento.</p>
				<p>BEM identifica siete impulsores motivacionales fundamentales — categorías de experiencia que los seres humanos encuentran inherentemente convincentes. Estos impulsores no son arbitrarios; surgen de décadas de investigación en psicología motivacional, estudios de tipología de jugadores y práctica de diseño de juegos. Cada impulsor representa una respuesta diferente a la pregunta "¿qué tipo de estado haría significativa esta actividad?"</p>
				<ul>
					<li><strong>Maestría y Progreso</strong>: El impulso de mejorar, desarrollar habilidades, superar desafíos y ver evidencia tangible de crecimiento. Este es el impulsor detrás de los sistemas de niveles, curvas de dificultad y seguimiento de logros. Los estudiantes con alto puntaje en este impulsor se motivan con retroalimentación clara de rendimiento que muestra que están mejorando en algo que importa.</li>
					<li><strong>Relación y Empatía</strong>: El impulso de conectarse con otros, sentir pertenencia, cooperar y experimentar emociones compartidas. Este impulsor se activa con mecánicas sociales, desafíos en equipo, roles de mentoría y cualquier diseño que haga sentir al estudiante parte de una comunidad. No se trata de competencia — se trata de conexión.</li>
					<li><strong>Descubrimiento y Creatividad</strong>: El impulso de explorar lo desconocido, descubrir secretos, experimentar y crear algo nuevo. Este impulsor alimenta la curiosidad, la exploración y la expresión creativa. Se activa con contenido oculto, problemas abiertos, entornos de prueba y herramientas para la creación.</li>
					<li><strong>Empoderamiento y Control</strong>: El impulso de ejercer agencia, tomar decisiones consecuentes, influir en el sistema y sentir una sensación de dominio. Este es el impulsor detrás de las elecciones estratégicas, los roles de liderazgo y las estructuras competitivas. Se trata de tener poder significativo dentro del sistema.</li>
					<li><strong>Eficiencia y Productividad</strong>: El impulso de optimizar recursos, completar tareas con economía, acumular valor y gestionar la escasez. Este impulsor se activa con sistemas económicos, desafíos de gestión del tiempo, barras de progreso y cualquier retroalimentación que señale "estás usando bien tus recursos."</li>
					<li><strong>Hedonismo y Placer</strong>: El impulso de buscar deleite sensorial, belleza estética, humor y comodidad. Este impulsor puede parecer superficial, pero juega un papel crucial en la incorporación inicial, la reducción de fricción y la creación de momentos de alegría que sostienen el compromiso a través de parches difíciles. Se activa con interfaces hermosas, animaciones satisfactorias, humor y recompensas sensoriales.</li>
					<li><strong>Identidad y Propósito</strong>: El impulso de pertenecer a una causa significativa, construir un legado, actuar con integridad y sentir que las acciones de uno importan más allá de uno mismo. Este es el impulsor más complejo — conecta el aprendizaje con el sentido más amplio de significado del estudiante. Se activa con marcos narrativos, elecciones éticas, sistemas de causa y efecto, e impacto visible en el mundo (incluso uno ficticio).</li>
				</ul>
				<p>Cada impulsor es una lente para diseñar metas y retroalimentación. Una actividad de aprendizaje que activa múltiples impulsores es más resiliente que una que depende de un solo impulsor, porque diferentes estudiantes se conectarán a través de diferentes canales. Más importante aún, un mismo estudiante puede conectarse a través de diferentes impulsores en diferentes momentos: descubrimiento en las etapas iniciales, maestría en el medio y propósito hacia el final.</p>
				<p>BEM no prescribe qué impulsor usar. Proporciona el vocabulario para que los diseñadores se hagan las preguntas correctas: ¿A qué impulsor sirve naturalmente esta actividad? ¿Qué impulsor podría hacerla significativa para un estudiante que no está actualmente comprometido? Y crucialmente — ¿la retroalimentación que estoy diseñando está alineada con el mismo impulsor que la meta que apoya?</p>
				<div class="highlight-box">
					<p><strong>Alineación de impulsores</strong> es uno de los principios más importantes de BEM. Una meta impulsada por Descubrimiento debe ser seguida por retroalimentación que amplifique el descubrimiento (revelando nueva información, abriendo nuevos caminos), no por retroalimentación que apele a un impulsor diferente. La desalineación entre meta y retroalimentación crea fricción motivacional. El estudiante que exploró por curiosidad pero recibe una barra de chocolate como "recompensa" recibe un mensaje implícito: tu curiosidad no era valiosa en sí misma; aquí hay algo más para compensar. Con el tiempo, esta desalineación erosiona la misma motivación que el sistema intenta construir.</p>
				</div>
				{:else}
				<h2>3. The Seven Drivers: A Language for Motivational Diversity</h2>
				<p>The OIT continuum explains the internalization process — how external regulation can, under the right conditions, transform into integrated or intrinsic motivation. But it does not tell us what kinds of experiences different learners find meaningful. Two learners may both reach identified regulation, each through an entirely different channel. One may connect through the desire for mastery; another through the need for social connection; a third through the thrill of discovery.</p>
				<p>BEM identifies seven fundamental motivational drivers — categories of experience that human beings find inherently compelling. These drivers are not arbitrary; they emerge from decades of research in motivational psychology, player typology studies, and game design practice. Each driver represents a different answer to the question "what kind of state would make this activity meaningful?"</p>
				<ul>
					<li><strong>Mastery & Progress</strong>: The drive to improve, develop skills, overcome challenges, and see tangible evidence of growth. This is the driver behind leveling systems, difficulty curves, and accomplishment tracking. Learners high in this driver are motivated by clear performance feedback that shows they are getting better at something that matters.</li>
					<li><strong>Relatedness & Empathy</strong>: The drive to connect with others, feel belonging, cooperate, and experience shared emotion. This driver is activated by social mechanics, team challenges, mentoring roles, and any design that makes the learner feel part of a community. It is not about competition — it is about connection.</li>
					<li><strong>Discovery & Creativity</strong>: The drive to explore the unknown, uncover secrets, experiment, and create something new. This driver fuels curiosity, exploration, and creative expression. It is activated by hidden content, open-ended problems, sandbox environments, and tools for creation.</li>
					<li><strong>Empowerment & Control</strong>: The drive to exercise agency, make consequential decisions, influence the system, and feel a sense of dominion. This is the driver behind strategic choices, leadership roles, and competitive structures. It is about having meaningful power within the system.</li>
					<li><strong>Efficiency & Productivity</strong>: The drive to optimize resources, complete tasks with economy, accumulate value, and manage scarcity. This driver is activated by economic systems, time management challenges, progress bars, and any feedback that signals "you are using your resources well."</li>
					<li><strong>Hedonism & Pleasure</strong>: The drive to seek sensory delight, aesthetic beauty, humor, and comfort. This driver may seem superficial, but it plays a crucial role in onboarding, reducing friction, and creating moments of joy that sustain engagement through difficult patches. It is activated by beautiful interfaces, satisfying animations, humor, and sensory rewards.</li>
					<li><strong>Identity & Purpose</strong>: The drive to belong to a meaningful cause, build a legacy, act with integrity, and feel that one's actions matter beyond oneself. This is the most complex driver — it connects learning to the learner's broader sense of meaning. It is activated by narrative framing, ethical choices, cause-and-effect systems, and visible impact on the world (even a fictional one).</li>
				</ul>
				<p>Each driver is a lens for designing goals and feedback. A learning activity that activates multiple drivers is more resilient than one that relies on a single driver, because different learners will connect through different channels. More importantly, the same learner may connect through different drivers at different moments: discovery in the early stages, mastery in the middle, and purpose toward the end.</p>
				<p>BEM does not prescribe which driver to use. It provides the vocabulary for designers to ask the right questions: Which driver does this activity naturally serve? Which driver might make it meaningful for a learner who is not currently engaged? And crucially — is the feedback I am designing aligned with the same driver as the goal it supports?</p>
				<div class="highlight-box">
					<p><strong>Driver alignment</strong> is one of BEM's most important principles. A goal driven by Discovery should be followed by feedback that amplifies discovery (revealing new information, opening new paths), not by feedback that appeals to a different driver. Misalignment between goal and feedback creates motivational friction. The learner who explored out of curiosity but receives a candy bar as a "reward" receives an implicit message: your curiosity was not valuable in itself; here is something else to compensate. Over time, this misalignment erodes the very motivation the system is trying to build.</p>
				</div>
				{/if}
			</section>

			<!-- CHAPTER 4: The Systemic Approach -->
			<section id="ch-systemic" bind:this={chapterEls['ch-systemic']}>
				{#if lang === 'es'}
				<h2>4. El Enfoque Sistémico: Un Método, No una Taxonomía</h2>
				<p>Muchos marcos de gamificación son taxonomías — listas de elementos organizados por tipo o propósito. Te dicen qué herramientas existen, pero no cómo usarlas coherentemente. BEM es diferente. Proporciona un <strong>método sistémico</strong> para diseñar experiencias de aprendizaje gamificadas, estructurado como una secuencia de decisiones de diseño que se despliegan desde el objetivo de aprendizaje hacia afuera.</p>
				<p>El proceso de diseño de BEM consta de ocho pasos, cada uno construyendo sobre el anterior:</p>
				<ol>
					<li><strong>Definir el Alcance del Experimento.</strong> Antes de seleccionar cualquier elemento de juego, el diseñador debe articular el objetivo de aprendizaje de forma clara y concreta. ¿Qué problema intenta resolver esta iteración de diseño? ¿Es baja asistencia? ¿Compromiso superficial con las lecturas? ¿Dificultad para transferir conceptos a la práctica? El alcance define el éxito y guía cada decisión subsiguiente.</li>
					<li><strong>Definición del Esquema de Juego.</strong> Diferentes géneros de juego tienen diferentes patrones estructurales. Un curso diseñado como un juego de aventura (narrativa en desarrollo, exploración, acertijos) tendrá una arquitectura diferente a uno diseñado como un simulador económico (gestión de recursos, optimización, curvas de crecimiento). BEM pide al diseñador que considere qué esquema de género se adapta mejor al contenido y las habilidades que se enseñan, en lugar de recurrir a un sistema genérico de puntos y medallas.</li>
					<li><strong>Diseño de la Meta Principal.</strong> Aquí es donde la arquitectura de metas toma forma. Las metas narrativas enmarcan la experiencia en términos de identidad y propósito. Las metas primarias definen el camino obligatorio — lo que el estudiante debe lograr para progresar o evitar perder. Juntas, crean la columna vertebral de la experiencia.</li>
					<li><strong>Diseño de Metas Secundarias.</strong> Las metas secundarias son objetivos no obligatorios alineados con diferentes impulsores. Son el mecanismo a través del cual BEM acomoda la diversidad motivacional. Diferentes estudiantes pueden perseguir diferentes metas secundarias, creando la misma experiencia pero a través de diferentes canales motivacionales.</li>
					<li><strong>Diseño de Reglas de Retroalimentación.</strong> Para cada meta, se debe diseñar un sistema de retroalimentación correspondiente. Esto incluye definir los algoritmos de evaluación, las señales discriminatorias que comunicarán los resultados y los elementos de interfaz que hacen visible el progreso. La retroalimentación es uno de los pilares principales de BEM.</li>
					<li><strong>Diseño de Llamados a la Acción y Verbos de Juego.</strong> Las metas y la retroalimentación definen la estructura; los llamados a la acción definen el ritmo y gestionan la atención. El diseñador debe especificar qué desencadena cada interacción — qué impulsará al estudiante a actuar, y qué acciones están disponibles en cada momento.</li>
					<li><strong>Diseño de Bucles.</strong> El sistema debe evolucionar con el tiempo. Esto significa diseñar bucles de progresión (cómo avanza el estudiante a través de desafíos cada vez más complejos), bucles de retroalimentación (cómo cambia el estado del sistema en respuesta a las acciones del estudiante) y bucles de compromiso (cómo mantiene el sistema la atención entre sesiones).</li>
					<li><strong>Pruebas e Iteración.</strong> Ningún diseño sobrevive intacto al primer contacto con los estudiantes. BEM trata la implementación como un prototipo que debe ser probado, medido y refinado. Las métricas de compromiso, persistencia, calidad de decisiones y resultados de aprendizaje informan iteraciones sucesivas.</li>
				</ol>
				<p>Lo que hace que este enfoque sea <strong>sistémico</strong> no es la existencia de pasos individuales, sino el requisito de que cada paso se conecte hacia atrás y hacia adelante. Las reglas de retroalimentación deben alinearse con las metas. Los llamados a la acción deben alinearse con la arquitectura de impulsores. Los bucles deben retroalimentar la definición del alcance. Nada existe de forma aislada.</p>
				<p>El enfoque sistémico es también lo que distingue a BEM del enfoque típico de caja de herramientas. Cuando un diseñador tiene una caja de herramientas (puntos, medallas, tablas de líderes, misiones), la tentación es agregar elementos oportunistamente: "agreguemos una medalla para esto, una tabla de líderes para aquello." El resultado es un mosaico de características que pueden o no funcionar juntas. El proceso de diseño de BEM fuerza la coherencia al comenzar con el objetivo de aprendizaje y construir hacia afuera, asegurando que cada elemento sirva a un propósito conectado con la meta central.</p>
				<p>Esta secuencia de ocho pasos proporciona la columna vertebral metodológica de BEM. Pero un proceso de diseño no es lo mismo que una experiencia de aprendizaje. La pregunta sigue siendo: ¿cómo se unen todos estos elementos — metas, llamados a la acción, evaluación, retroalimentación — en la interacción momento a momento entre el estudiante y el sistema? La respuesta es el Ciclo Interactivo de Aprendizaje, la meta-estructura que operacionaliza la lógica sistémica de BEM al nivel de cada encuentro de aprendizaje individual.</p>
				{:else}
				<h2>4. The Systemic Approach: A Method, Not a Taxonomy</h2>
				<p>Many gamification frameworks are taxonomies — lists of elements organized by type or purpose. They tell you what tools exist, but not how to use them coherently. BEM is different. It provides a <strong>systemic method</strong> for designing gamified learning experiences, structured as a sequence of design decisions that unfold from the learning objective outward.</p>
				<p>The BEM design process consists of eight steps, each building on the previous one:</p>
				<ol>
					<li><strong>Define the Experiment Scope.</strong> Before any game element is selected, the designer must articulate the learning objective clearly and concretely. What problem is this design iteration trying to solve? Is it low attendance? Shallow engagement with readings? Difficulty transferring concepts to practice? The scope defines success and guides every subsequent decision.</li>
					<li><strong>Game Schema Definition.</strong> Different game genres have different structural patterns. A course designed as an adventure game (unfolding narrative, exploration, puzzles) will have a different architecture than one designed as an economy simulator (resource management, optimization, growth curves). BEM asks the designer to consider which genre schema best fits the content and skills being taught, rather than defaulting to a generic points-and-badges system.</li>
					<li><strong>Main Goal Design.</strong> This is where the goal architecture takes shape. Narrative goals frame the experience in terms of identity and purpose. Primary goals define the mandatory path — what the learner must achieve to progress or avoid losing. Together, they create the backbone of the experience.</li>
					<li><strong>Secondary Goal Design.</strong> Secondary goals are non-mandatory objectives aligned with different drivers. They are the mechanism through which BEM accommodates motivational diversity. Different learners can pursue different secondary goals, creating the same experience but through different motivational channels.</li>
					<li><strong>Feedback Rules Design.</strong> For every goal, a corresponding feedback system must be designed. This includes defining the evaluation algorithms, the discriminatory signals that will communicate results, and the interface elements that make progress visible. Feedback is one of the main pillars of BEM.</li>
					<li><strong>Call-to-Action and Game Verb Design.</strong> Goals and feedback define the structure; calls to action define the rhythm and manage attention. The designer must specify what triggers each interaction — what will prompt the learner to act, and what actions are available at each moment.</li>
					<li><strong>Loop Design.</strong> The system must evolve over time. This means designing progression loops (how the learner advances through increasingly complex challenges), feedback loops (how the system's state changes in response to the learner's actions), and engagement loops (how the system maintains attention across sessions).</li>
					<li><strong>Testing and Iteration.</strong> No design survives first contact with learners intact. BEM treats implementation as a prototype to be tested, measured, and refined. Metrics of engagement, persistence, decision quality, and learning outcomes inform successive iterations.</li>
				</ol>
				<p>What makes this approach <strong>systemic</strong> is not the existence of individual steps, but the requirement that each step connects backward and forward. The feedback rules must align with the goals. The calls to action must align with the driver architecture. The loops must feed back into the scope definition. Nothing exists in isolation.</p>
				<p>The systemic approach is also what distinguishes BEM from the typical toolkit approach. When a designer has a toolkit (points, badges, leaderboards, quests), the temptation is to add elements opportunistically: "let's add a badge for this, a leaderboard for that." The result is a patchwork of features that may or may not work together. BEM's design process forces coherence by starting with the learning objective and building outward, ensuring that every element serves a purpose connected to the core goal.</p>
				<p>This eight-step sequence provides the methodological backbone of BEM. But a design process is not the same as a learning experience. The question remains: how do all these elements — goals, calls to action, evaluation, feedback — come together in the moment-to-moment interaction between learner and system? The answer is the Interactive Learning Cycle, the meta-structure that operationalizes BEM's systemic logic at the level of each individual learning encounter.</p>
				{/if}
			</section>

			<!-- CHAPTER 5: The Interactive Learning Cycle -->
			<section id="ch-cycle" bind:this={chapterEls['ch-cycle']}>
				{#if lang === 'es'}
				<h2>5. El Ciclo Interactivo de Aprendizaje: La Meta-Estructura de BEM</h2>
				<p>El Marco de Aprendizaje BEM define el aprendizaje no como transmisión pasiva de información, ni como un intercambio transaccional de tareas por puntos, sino como <strong>interactividad sostenida</strong>: una conversación estructurada y continua entre el estudiante, el evaluador y el sistema de reglas del juego. La unidad mínima que genera aprendizaje y compromiso no es la lección o la tarea, sino la sucesión constante de microinteracciones organizadas en ciclos interactivos.</p>
				<p>Cada Ciclo Interactivo de Aprendizaje consta de cuatro fases consecutivas:</p>
				<div class="cycle-steps">
					<div class="cycle-step">
						<span class="step-num">1</span>
						<div>
							<h4>Meta y Estado del Sistema</h4>
							<p>El estudiante comprende lo que debe lograrse en el momento inmediato y lee el estado actual del sistema a través de la interfaz: qué recursos están disponibles, qué restricciones existen y qué reglas gobiernan el entorno. Esta fase responde a la pregunta: "¿Qué estoy tratando de lograr y dónde me encuentro ahora mismo?"</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">2</span>
						<div>
							<h4>Llamado a la Acción (CTA)</h4>
							<p>El sistema presiona al estudiante para que decida. Esto no siempre es una instrucción explícita; puede ser un temporizador de cuenta regresiva, un cambio en el entorno del juego, una amenaza que se aproxima, o incluso una pausa deliberada que obliga al estudiante a tomar la iniciativa. El CTA crea el momento de decisión y recaptura la atención — el punto en el que el estudiante debe elegir.</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">3</span>
						<div>
							<h4>Evaluación Cognitiva, Decisión y Acción</h4>
							<p>El estudiante contrasta sus modelos mentales e hipótesis con la situación actual y ejecuta una acción. Aquí es donde la metacognición se vuelve operativa — el estudiante debe evaluar su propia comprensión, hacer una predicción y comprometerse con un curso de acción.</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">4</span>
						<div>
							<h4>Evaluación del Sistema y Retroalimentación</h4>
							<p>El sistema, oponente o profesor evalúa la acción según sus algoritmos y devuelve una señal instructiva que reconfigura el estado de la interfaz. Esta retroalimentación se convierte en el punto de partida para el siguiente ciclo: el nuevo estado del sistema del estudiante se convierte en la Fase 1 de la siguiente iteración.</p>
						</div>
					</div>
				</div>
				<p>Este ciclo es el corazón de BEM. Todo lo demás — arquitectura de metas, alineación de impulsores, diseño de retroalimentación, mecánicas de fracaso — en última instancia sirve para hacer que este bucle de cuatro fases sea lo más productivo y significativo posible. El Enfoque Sistémico define el método de diseño; el Ciclo Interactivo de Aprendizaje define la estructura experiencial que el método produce. Los dos son inseparables: el método diseña el sistema, y el ciclo es lo que el estudiante experimenta cuando el sistema funciona.</p>
				<p>El ciclo también explica por qué BEM integra elementos que la instrucción tradicional mantiene separados. Las metas no son estándares abstractos escritos en un programa de estudios; son el objetivo inmediato presentado en la Fase 1. La evaluación no es una calificación terminal; es el procesamiento algorítmico que ocurre en la Fase 4. La retroalimentación no es un comentario en un trabajo devuelto; es la señal que cierra un bucle y abre el siguiente. Cada fase depende de la anterior, y juntas forman el núcleo operativo de la arquitectura pedagógica de BEM.</p>
				<p>Y el principio principal detrás de la filosofía BEM es que, para emular un ciclo de aprendizaje similar a un juego, estos deben ser lo más cortos posible, para permitir una conversación más fluida con más puntos de retroalimentación. El aprendizaje ocurre al final del ciclo, por lo que queremos maximizar el número de ciclos por unidad de tiempo. Escribir un ensayo largo y luego esperar una semana para recibir retroalimentación no cumple con BEM. Escribir un par de oraciones y recibir retroalimentación oportuna sí lo hace.</p>
				<p>Esta estructura requiere un sistema de metas a largo y corto plazo. Las metas a largo plazo son los objetivos del curso, y las metas a corto plazo son los objetivos inmediatos que el estudiante debe lograr en cada ciclo. Las metas a corto plazo deben estar alineadas con las metas a largo plazo, y las metas a largo plazo deben desglosarse en una serie de metas a corto plazo, lo que en diseño de juegos se llama breadcrumbing (migas de pan).</p>
				{:else}
				<h2>5. The Interactive Learning Cycle: The Meta-Structure of BEM</h2>
				<p>The BEM Learning Framework defines learning not as passive information transmission, nor as a transactional exchange of tasks for points, but as <strong>sustained interactivity</strong>: a structured, continuous conversation between the learner, the evaluator, and the game rules system. The minimal unit that generates learning and engagement is not the lesson or the assignment, but the constant succession of micro-interactions organized in interactive cycles.</p>
				<p>Each Interactive Learning Cycle consists of four consecutive phases:</p>
				<div class="cycle-steps">
					<div class="cycle-step">
						<span class="step-num">1</span>
						<div>
							<h4>Goal and System State</h4>
							<p>The learner understands what must be achieved in the immediate moment and reads the system's current state through the interface: what resources are available, what constraints exist, and what rules govern the environment. This phase answers the question: "What am I trying to accomplish, and where do I stand right now?"</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">2</span>
						<div>
							<h4>Call to Action (CTA)</h4>
							<p>The system pressures the learner to decide. This is not always an explicit instruction; it can be a countdown timer, a change in the game environment, an approaching threat, or even a deliberate pause that forces the learner to take initiative. The CTA creates the moment of decision and recaptures attention — the point at which the learner must choose.</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">3</span>
						<div>
							<h4>Cognitive Evaluation, Decision, and Action</h4>
							<p>The learner contrasts their mental models and hypotheses against the current situation and executes an action. This is where metacognition becomes operational — the learner must assess their own understanding, make a prediction, and commit to a course of action.</p>
						</div>
					</div>
					<div class="cycle-step">
						<span class="step-num">4</span>
						<div>
							<h4>System Evaluation and Feedback</h4>
							<p>The system, opponent or teacher evaluates the action according to its algorithms and returns an instructional signal that reconfigures the interface state. This feedback becomes the starting point for the next cycle: the learner's new system state becomes Phase 1 of the next iteration.</p>
						</div>
					</div>
				</div>
				<p>This cycle is the heartbeat of BEM. Everything else — goal architecture, driver alignment, feedback design, failure mechanics — ultimately serves to make this four-phase loop as productive and meaningful as possible. The Systemic Approach defines the design method; the Interactive Learning Cycle defines the experiential structure that the method produces. The two are inseparable: the method designs the system, and the cycle is what the learner experiences when the system runs.</p>
				<p>The cycle also explains why BEM integrates elements that traditional instruction keeps separate. Goals are not abstract standards written in a syllabus; they are the immediate target presented in Phase 1. Evaluation is not a terminal grade; it is the algorithmic processing that occurs in Phase 4. Feedback is not a comment on a returned paper; it is the signal that closes one loop and opens the next. Each phase depends on the one before it, and together they form the operational core of BEM's pedagogical architecture.</p>
				<p>And the main principle behind the BEM philosophy is that, to emulate a game-like learning cycle, these must be as short as possible, to allow for a more fluid conversation with more feedback points. Learning happens at the end of the cycle, so we want to maximize the number of cycles per unit of time. Writing a long essay and then waiting a week for feedback is not BEM compliant. Writing a couple of sentences and getting opportunistic feedback is.</p>
				<p>This structure requires a system of long-term and short-term goals. The long-term goals are the objectives of the course, and the short-term goals are the immediate targets that the learner must achieve in each cycle. The short-term goals must be aligned with the long-term goals, and the long-term goals must be broken down into a series of short-term goals, which in game design is called breadcrumbing.</p>
				{/if}
			</section>

			<!-- CHAPTER 6: Goals as Systems of Anticipation -->
			<section id="ch-goals" bind:this={chapterEls['ch-goals']}>
				{#if lang === 'es'}
				<h2>6. Metas como Sistemas de Anticipación</h2>
				<p>Una meta es la representación de un estado futuro deseado. Enfoca la atención, moviliza el esfuerzo y sostiene la persistencia. Pero en BEM, las metas se entienden como algo más: son <strong>sistemas anticipatorios</strong>. Generan dirección al señalar al estudiante hacia un estado futuro deseado, y la tensión entre el estado actual y el estado meta crea anticipación de dopamina — el motor neurológico de la motivación.</p>
				<p>Recordemos que la definición de motivación según la literatura psicológica es: "Un proceso que inicia, guía y mantiene comportamientos orientados a metas." Así que al establecer metas adecuadas, estamos estableciendo el principal impulsor del proceso de aprendizaje.</p>
				<p>Por eso BEM insiste en un replanteamiento crucial: lo que el campo típicamente llama "recompensas" son simplemente metas diferidas. Una medalla no es una recompensa por completar una tarea; es una meta que el estudiante estaba persiguiendo y que ahora ha alcanzado. Un certificado no es un premio; es un estado meta hacia el cual el estudiante se orientaba. Al replantear las recompensas como metas, BEM desplaza la atención del diseñador de "¿qué les doy cuando terminan?" a "¿qué estado deberían querer alcanzar?" Si una medalla es una meta, entonces la pregunta no es si la medalla funciona, sino cómo está diseñada como meta y qué efectos produce. Hay medallas buenas y nocivas, y todo depende de su diseño.</p>
				<p>No todas las metas son iguales. En la mayoría del diseño educativo, las metas toman la forma de <strong>metas de acción</strong>: "Completa el ejercicio 3B," "Entrega el ensayo para el viernes," "Responde 8 de 10 preguntas correctamente." Las metas de acción especifican un comportamiento concreto a realizar, que siempre está bajo el control del estudiante. Son medibles, manejables y fáciles de evaluar. También son, por sí mismas, motivacionalmente endebles. Las metas de acción responden a la pregunta "¿qué debo hacer?" pero no "¿por qué debería querer hacerlo?" Un estudiante puede completar el ejercicio 3B sin importarle nunca las matemáticas. La casilla está marcada; nada ha cambiado en la relación del estudiante con la materia.</p>
				<p>Los juegos, por el contrario, destacan en la creación de <strong>metas de estado</strong>: "Conviértete en el héroe que salva el reino," "Construye un imperio que resista cualquier asedio," "Descubre la verdad detrás del antiguo misterio." Las metas de estado describen una identidad o estado del ser deseado. A menudo son abiertas, pueden perseguirse a través de múltiples caminos, y generan inversión emocional porque hablan de quién el jugador quiere <em>llegar a ser</em>, cómo el jugador quiere que <em>el mundo sea</em>, no solo lo que el jugador quiere <em>hacer</em>. Un jugador que persigue la meta de "convertirse en un maestro estratega" no solo completa ejercicios tácticos — interpreta cada acción a través del lente de su identidad aspiracional. Esto requiere estrategia y no solo trabajo.</p>
				<p>La educación tradicional está abrumadoramente orientada hacia las metas de acción. Los estándares curriculares, los planes de clase y las rúbricas de evaluación dividen el aprendizaje en comportamientos discretos y observables. Esto es útil para la medición, pero crea un vacío motivacional. Los estudiantes aprenden a cumplir — a realizar la acción — sin integrar nunca el valor de la acción en su sentido del yo. Y las metas de estado suelen orientarse hacia una calificación diseñada para castigar y desmotivar.</p>
				<p>BEM no abandona las metas de acción. Al contrario, las metas de acción son esenciales: proporcionan los pasos concretos a través de los cuales el progreso se hace visible. Pero BEM integra las metas de acción dentro de una arquitectura más grande de metas de estado. La meta de acción ("entrega este desafío de programación") obtiene significado de la meta de estado a la que sirve ("depurar sistemas complejos con éxito"). La meta de estado, a su vez, se vuelve tangible a través de las metas de acción que miden el progreso hacia ella.</p>
				<p>Esta arquitectura dual es la base del sistema de metas de BEM. Una experiencia BEM bien diseñada siempre deja dos cosas claras para el estudiante: las acciones inmediatas disponibles para realizar, y el estado de competencia o identidad hacia el cual esas acciones están construyendo. Cuando ambas son visibles, el estudiante puede moverse fluidamente entre tareas concretas e identidad aspiracional — y este movimiento es el motor de la motivación sostenida.</p>
				{:else}
				<h2>6. Goals as Systems of Anticipation</h2>
				<p>A goal is a representation of a desired future state. It focuses attention, mobilizes effort, and sustains persistence. But in BEM, goals are understood as something more: they are <strong>anticipatory systems</strong>. They generate direction by pointing the learner toward a desired future state, and the tension between the current state and the goal state creates dopamine anticipation — the neurological engine of motivation.</p>
				<p>Remember, the definition of motivation according to the psychological literature is: "A process that initiates, guides and maintains goal-oriented behaviors." So by setting up proper goals, we are actually setting up the main driver of the learning process.</p>
				<p>This is why BEM insists on a crucial reframing: what the field typically calls "rewards" are simply deferred goals. A badge is not a reward for completing a task; it is a goal the learner was pursuing that they have now reached. A certificate is not a prize; it is a goal state the learner oriented toward. By reframing rewards as goals, BEM shifts the designer's attention from "what do I give them when they finish?" to "what state should they want to reach?" If a badge is a goal, then the question is not if a badge works, but how it is designed as a goal and what effects it produces. There are good and nocive badges, and it all depends on their design.</p>
				<p>Not all goals are created equal. In most educational design, goals take the form of <strong>action goals</strong>: "Complete exercise 3B," "Submit the essay by Friday," "Answer 8 out of 10 questions correctly." Action goals specify a concrete behavior to perform, that is always in the learners' control. They are measurable, manageable, and easy to assess. They are also, by themselves, motivationally thin. Action goals answer the question "what should I do?" but not "why should I want to do it?" A student can complete exercise 3B without ever caring about mathematics. The checkbox is ticked; nothing has changed in the student's relationship with the subject.</p>
				<p>Games, by contrast, excel at creating <strong>state goals</strong>: "Become the hero who saves the kingdom," "Build an empire that withstands any siege," "Discover the truth behind the ancient mystery." State goals describe a desired identity or state of being. They are often open-ended, can be pursued through multiple paths, and generate emotional investment because they speak to who the player wants to <em>become</em>, how the player wants the <em>world to be</em>, not just what the player wants to <em>do</em>. A player who pursues the goal of "becoming a master strategist" does not merely complete tactical exercises — she interprets every action through the lens of her aspirational identity. This requires strategy and not just work.</p>
				<p>Traditional education is overwhelmingly oriented toward action goals. Curriculum standards, lesson plans, and assessment rubrics break learning into discrete, observable behaviors. This is useful for measurement, but it creates a motivational vacuum. Students learn to comply — to perform the action — without ever integrating the value of the action into their sense of self. And state goals are usually oriented toward a grade that is designed to punish and demotivate.</p>
				<p>BEM does not abandon action goals. On the contrary, action goals are essential: they provide the concrete steps through which progress is made visible. But BEM embeds action goals within a larger architecture of state goals. The action goal ("deliver this programming challenge") gains meaning from the state goal it serves ("debug complex systems successfully"). The state goal, in turn, becomes tangible through the action goals that measure progress toward it.</p>
				<p>This dual architecture is the foundation of BEM's goal system. A well-designed BEM experience always makes two things clear to the learner: the immediate actions available to perform, and the state of competence or identity toward which those actions are building. When both are visible, the learner can move fluently between concrete tasks and aspirational identity — and this movement is the engine of sustained motivation.</p>
				{/if}
			</section>

			<!-- CHAPTER 7: Goal Architecture -->
			<section id="ch-architecture" bind:this={chapterEls['ch-architecture']}>
				{#if lang === 'es'}
				<h2>7. Arquitectura de Metas: Narrativas, Principales y Secundarias</h2>
				<p>Basándose en la distinción entre metas de estado y de acción, BEM estructura las metas en tres niveles, cada uno con una función distinta:</p>
				<div class="tier-card">
					<h3>Metas Narrativas</h3>
					<p>Son metas de estado que enmarcan toda la experiencia en términos de identidad y propósito. Responden a la pregunta "¿quién soy en este mundo?" Una meta narrativa podría ser "convertirte en un consultor que pueda analizar problemas organizacionales," "asumir el rol de un historiador reconstruyendo un evento perdido," o "unirte a un equipo de ingenieros compitiendo para resolver una crisis ambiental." Las metas narrativas no especifican acciones concretas; especifican un lente a través del cual todas las acciones adquieren significado. Una meta narrativa bien elaborada puede hacer que incluso las tareas mundanas se sientan significativas porque se interpretan como progreso hacia una identidad que el estudiante ha elegido adoptar.</p>
				</div>
				<div class="tier-card">
					<h3>Metas Principales (Metas Primarias)</h3>
					<p>Son metas de estado que definen el camino obligatorio a través de la experiencia de aprendizaje. Son concretas, medibles y unívocas — el estudiante debe saber sin ambigüedad si una meta principal se ha logrado. Las metas principales crean <strong>dirección</strong> al especificar lo que el estudiante debe hacer para progresar, y crean <strong>estructura</strong> al definir la secuencia de desafíos. BEM distingue entre dos tipos de metas principales: metas de aproximación (hitos positivos a alcanzar) y metas de evitación (estados negativos a prevenir). Ambas son necesarias; demasiadas metas de evitación crean una atmósfera punitiva, mientras que demasiadas metas de aproximación pueden eliminar la tensión productiva que surge de tener algo en juego.</p>
				</div>
				<div class="tier-card">
					<h3>Metas Secundarias</h3>
					<p>Son objetivos no obligatorios que acompañan a las metas principales. Son el mecanismo central a través del cual BEM apoya la <strong>autonomía</strong> y la <strong>diversidad motivacional</strong>. Diferentes estudiantes pueden perseguir diferentes metas secundarias dependiendo de qué impulsores resuenen con ellos. Una meta secundaria podría ser un desafío de maestría (Maestría y Progreso), una tarea de exploración (Descubrimiento y Creatividad), una optimización de eficiencia (Eficiencia y Productividad), una misión colaborativa (Relación y Empatía), o cualquier otro objetivo alineado con un impulsor.</p>
				</div>
				<p>La característica estructural crucial de las metas secundarias es que son <strong>no obligatorias</strong>. Esto no es lo mismo que "crédito extra." El crédito extra aún se evalúa dentro del marco evaluativo — añade puntos a la misma escala. Las metas secundarias en BEM existen fuera de la estructura de progresión obligatoria. Enriquecen la experiencia sin amenazarla. Un estudiante que ignora todas las metas secundarias aún puede completar el camino principal. Pero un estudiante que se involucra con las metas secundarias obtiene canales de retroalimentación adicionales, una conexión más profunda con el contenido y — lo más importante — la experiencia de elegir involucrarse porque la meta resuena, no porque el sistema lo obligue.</p>
				<p>Esta cualidad no obligatoria es lo que operacionaliza la regulación identificada e integrada de la OIT. Cuando un estudiante elige perseguir una meta secundaria alineada con Descubrimiento porque siente curiosidad, está practicando la regulación identificada: está actuando porque la actividad en sí misma tiene valor para él. El sistema apoya esta elección haciendo visible la meta como una opción, pero sin aplicar presión para perseguirla. Con el tiempo, esta experiencia repetida de elección autónoma construye una relación con el aprendizaje que es intrínseca en lugar de controlada.</p>
				{:else}
				<h2>7. Goal Architecture: Narrative, Main, and Secondary Goals</h2>
				<p>Building on the distinction between state and action goals, BEM structures goals into three tiers, each serving a distinct function:</p>
				<div class="tier-card">
					<h3>Narrative Goals</h3>
					<p>These are state goals that frame the entire experience in terms of identity and purpose. They answer the question "who am I in this world?" A narrative goal might be "become a consultant who can analyze organizational problems," "take on the role of a historian reconstructing a lost event," or "join a team of engineers racing to solve an environmental crisis." Narrative goals do not specify concrete actions; they specify a lens through which all actions gain meaning. A well-crafted narrative goal can make even mundane tasks feel significant because they are interpreted as progress toward an identity the learner has chosen to adopt.</p>
				</div>
				<div class="tier-card">
					<h3>Main Goals (Primary Goals)</h3>
					<p>These are state goals that define the mandatory path through the learning experience. They are concrete, measurable, and univocal — the learner must know without ambiguity whether a main goal has been achieved. Main goals create <strong>direction</strong> by specifying what the learner must do to progress, and they create <strong>structure</strong> by defining the sequence of challenges. BEM distinguishes between two types of main goals: approach goals (positive milestones to reach) and avoidance goals (negative states to prevent). Both are necessary; too many avoidance goals create a punitive atmosphere, while too many approach goals can eliminate the productive tension that comes from having something at stake.</p>
				</div>
				<div class="tier-card">
					<h3>Secondary Goals</h3>
					<p>These are non-mandatory objectives that accompany main goals. They are the central mechanism through which BEM supports <strong>autonomy</strong> and <strong>motivational diversity</strong>. Different learners can pursue different secondary goals depending on which drivers resonate with them. A secondary goal might be a mastery challenge (Mastery & Progress), an exploration task (Discovery & Creativity), an efficiency optimization (Efficiency & Productivity), a collaborative mission (Relatedness & Empathy), or any other driver-aligned objective.</p>
				</div>
				<p>The crucial structural feature of secondary goals is that they are <strong>non-mandatory</strong>. This is not the same as "extra credit." Extra credit is still assessed within the evaluative framework — it adds points to the same scale. Secondary goals in BEM exist outside the mandatory progression structure. They enrich the experience without threatening it. A learner who ignores all secondary goals can still complete the main path. But a learner who engages with secondary goals gains additional feedback channels, deeper connection to the content, and — most importantly — the experience of choosing to engage because the goal resonates, not because the system compels it.</p>
				<p>This non-mandatory quality is what operationalizes OIT's identified and integrated regulation. When a learner chooses to pursue a secondary goal aligned with Discovery because they are curious, they are practicing identified regulation: they are acting because the activity itself has value to them. The system supports this choice by making the goal visible as an option, but applying no pressure to pursue it. Over time, this repeated experience of autonomous choice builds a relationship with learning that is intrinsic rather than controlled.</p>
				{/if}
			</section>

			<!-- CHAPTER 8: Secondary Goals -->
			<section id="ch-secondary" bind:this={chapterEls['ch-secondary']}>
				{#if lang === 'es'}
				<h2>8. Metas Secundarias: Autonomía a Través de Caminos No Obligatorios</h2>
				<p>Las metas secundarias merecen un examen más profundo porque son, en muchos sentidos, la innovación distintiva del diseño motivacional de BEM. La mayoría de los sistemas de gamificación se centran en el camino obligatorio: completa estas tareas, gana estos puntos, alcanza este nivel. El camino obligatorio es necesario — proporciona estructura y asegura la cobertura de los objetivos de aprendizaje — pero no es suficiente para un compromiso profundo.</p>
				<p>Las metas secundarias de BEM se diseñan a través de la <strong>alineación de impulsores</strong>: la práctica de mapear metas a impulsores específicos para crear múltiples caminos a través del mismo contenido. Considera un módulo de aprendizaje sobre pensamiento computacional. La meta principal podría ser "depurar un programa con al menos tres errores con éxito." Las metas secundarias, diseñadas para diferentes impulsores, podrían incluir:</p>
				<ul>
					<li><strong>Maestría y Progreso</strong>: "Completa el desafío de depuración en menos de 5 minutos" (una meta de optimización de rendimiento)</li>
					<li><strong>Descubrimiento y Creatividad</strong>: "Encuentra y documenta tres formas diferentes de corregir el mismo error" (una meta de exploración y creatividad)</li>
					<li><strong>Eficiencia y Productividad</strong>: "Completa el desafío usando el número mínimo de pasos posible" (una meta de optimización de recursos)</li>
					<li><strong>Relación y Empatía</strong>: "Depura en pareja con un compañero y documenta su proceso de colaboración" (una meta social)</li>
					<li><strong>Empoderamiento y Control</strong>: "Diseña un nuevo desafío de depuración para tus compañeros basado en lo que aprendiste" (una meta de liderazgo)</li>
					<li><strong>Identidad y Propósito</strong>: "Escribe una breve reflexión sobre cómo las habilidades de depuración se aplican a la calidad del software en el mundo real" (una meta de creación de significado)</li>
				</ul>
				<p>Cada una de estas metas secundarias involucra el mismo contenido central — la depuración — a través de un lente motivacional diferente. Un estudiante impulsado por Maestría se sentirá atraído por la profundidad del desafío. Un estudiante impulsado por Relación buscará la opción colaborativa. Un estudiante impulsado por Identidad y Propósito encontrará significado en la tarea de reflexión.</p>
				<p>El principio clave de diseño es que las metas secundarias deben estar <strong>sustancialmente conectadas con el objetivo de aprendizaje</strong>, no ser decorativas. Una meta secundaria que otorga puntos por publicar un comentario aleatorio en un foro no está alineada con un impulsor; es un mecanismo de cumplimiento disfrazado de compromiso. Una meta secundaria que invita al estudiante a explorar una aplicación tangencial de la habilidad que acaba de practicar está genuinamente alineada con un impulsor porque la meta surge del contenido mismo.</p>
				<p>Desde la perspectiva de la OIT, las metas secundarias apoyan el cambio de la regulación externa hacia la regulación integrada al proporcionar un <strong>entorno de bajo riesgo para la elección autónoma</strong>. Debido a que las metas secundarias no son obligatorias, el estudiante no puede experimentarlas como controladas. La elección de involucrarse debe venir de dentro. Y debido a que están alineadas con impulsores que el estudiante ya puede valorar, crean oportunidades para la identificación: "Elegí hacer esto porque soy alguien que valora la creatividad," o "Elegí hacer esto porque la eficiencia es importante para mí."</p>
				<p>Con el tiempo, la experiencia repetida de elegir actividades de aprendizaje que se alinean con los valores propios construye un autoconcepto como aprendiz autodirigido. Esta es la forma más profunda de diseño motivacional: no hacer que la actividad sea divertida, sino hacer que la actividad sea <em>significativa</em> de una manera que el estudiante pueda internalizar.</p>
				{:else}
				<h2>8. Secondary Goals: Autonomy Through Non-Mandatory Pathways</h2>
				<p>Secondary goals deserve deeper examination because they are, in many ways, the signature innovation of BEM's motivational design. Most gamification systems focus on the mandatory path: complete these tasks, earn these points, reach this level. The mandatory path is necessary — it provides structure and ensures coverage of learning objectives — but it is not sufficient for deep engagement.</p>
				<p>BEM's secondary goals are designed through <strong>driver alignment</strong>: the practice of mapping goals to specific drivers to create multiple pathways through the same content. Consider a learning module on computational thinking. The main goal might be "successfully debug a program with at least three errors." The secondary goals, designed for different drivers, might include:</p>
				<ul>
					<li><strong>Mastery & Progress</strong>: "Complete the debugging challenge in under 5 minutes" (a performance optimization goal)</li>
					<li><strong>Discovery & Creativity</strong>: "Find and document three different ways to fix the same error" (an exploration and creativity goal)</li>
					<li><strong>Efficiency & Productivity</strong>: "Complete the challenge using the minimum number of steps possible" (a resource optimization goal)</li>
					<li><strong>Relatedness & Empathy</strong>: "Pair-debug with a classmate and document your collaboration process" (a social goal)</li>
					<li><strong>Empowerment & Control</strong>: "Design a new debugging challenge for your classmates based on what you learned" (a leadership goal)</li>
					<li><strong>Identity & Purpose</strong>: "Write a short reflection on how debugging skills apply to real-world software quality" (a meaning-making goal)</li>
				</ul>
				<p>Each of these secondary goals engages the same core content — debugging — through a different motivational lens. A learner driven by Mastery will be drawn to the depth of the challenge. A learner driven by Relatedness will seek the collaborative option. A learner driven by Identity & Purpose will find meaning in the reflection task.</p>
				<p>The key design principle is that secondary goals must be <strong>substantively connected to the learning objective</strong>, not decorative. A secondary goal that gives points for posting a random comment on a forum is not driver-aligned; it is a compliance mechanism disguised as engagement. A secondary goal that invites the learner to explore a tangential application of the skill they just practiced is genuinely driver-aligned because the goal emerges from the content itself.</p>
				<p>From the perspective of OIT, secondary goals support the shift from external regulation toward integrated regulation by providing a <strong>low-stakes environment for autonomous choice</strong>. Because secondary goals are non-mandatory, the learner cannot experience them as controlled. The choice to engage must come from within. And because they are aligned with drivers that the learner may already value, they create opportunities for identification: "I chose to do this because I am someone who values creativity," or "I chose to do this because efficiency matters to me."</p>
				<p>Over time, the repeated experience of choosing learning activities that align with one's values builds a self-concept as a self-directed learner. This is the deepest form of motivational design: not making the activity fun, but making the activity <em>meaningful</em> in a way the learner can internalize.</p>
				{/if}
			</section>

			<!-- CHAPTER 9: Call to Action and Attention Management -->
			<section id="ch-cta" bind:this={chapterEls['ch-cta']}>
				{#if lang === 'es'}
				<h2>9. Llamado a la Acción y Gestión de la Atención</h2>
				<p>Las metas, incluso las bien diseñadas, son inertes hasta que se activan. Una meta en la que el estudiante nunca piensa no puede dirigir el comportamiento. Aquí es donde los <strong>llamados a la acción</strong> (CTA) entran en escena.</p>
				<p>En el diseño de juegos, un llamado a la acción es cualquier elemento del sistema que incita al jugador a tomar una decisión. Puede ser un temporizador en cuenta regresiva, un enemigo acercándose, un proveedor de misiones apareciendo, o un recurso comenzando a agotarse. El CTA crea <strong>urgencia</strong> — no necesariamente en el sentido de estrés, sino en el sentido de un punto de decisión que demanda atención.</p>
				<p>BEM trata los CTA como un elemento de diseño en sí mismos, no como una característica incidental de la interfaz. El ritmo y la sincronización de los CTA determinan el <strong>ritmo</strong> de la experiencia de aprendizaje y ayudan a gestionar los recursos atencionales del estudiante. Muy pocos CTA, y el estudiante se desvía; demasiados, y el estudiante se siente abrumado. El arte de la gestión de la atención radica en calibrar la frecuencia y prominencia de los CTA para que coincidan con el estado cognitivo del estudiante.</p>
				<p>BEM distingue entre varios tipos de CTA:</p>
				<ul>
					<li><strong>CTA Explícitos</strong> son indicaciones directas: "Haz clic aquí para comenzar," "Envía tu respuesta," "Elige tu camino." No dejan ambigüedad sobre lo que el estudiante debe hacer. Son esenciales para la incorporación inicial y para momentos en que el sistema necesita una decisión clara.</li>
					<li><strong>CTA Implícitos</strong> surgen del estado del sistema: una barra de progreso acercándose a su finalización, un recurso agotándose, un límite de tiempo inminente. No se le dice directamente al estudiante qué hacer; el estado del sistema crea una presión natural para actuar. Los CTA implícitos son poderosos porque involucran la propia toma de decisiones del estudiante en lugar de simplemente seguir instrucciones.</li>
					<li><strong>CTA Ambientales</strong> son cambios en el mundo del juego que señalan una oportunidad o amenaza: una puerta abriéndose, un enemigo apareciendo, una nueva área volviéndose accesible. Estos CTA aprovechan el sistema perceptual del estudiante — capturan la atención a través de la novedad, el cambio o el contraste.</li>
					<li><strong>CTA Silenciosos</strong> son llamados a la acción desde la inacción. Cuando las cosas no avanzan hasta que el estudiante toma una acción, esa inacción se convierte en un CTA. Se construye en torno al deseo inherente de mantener las cosas en movimiento. Esto es diferente a no tener un CTA, lo que significa no crear urgencia — esto es construir la necesidad de acción a través de silencios incómodos.</li>
				</ul>
				<p>La gestión de la atención también implica diseñar momentos de <strong>descanso</strong>. No todos los momentos pueden ser un pico de urgencia; el sistema necesita períodos de baja tensión donde el estudiante pueda procesar, reflexionar, consolidar y planificar. Los juegos alternan entre secuencias de acción intensa y momentos más tranquilos de exploración o gestión de inventario. BEM aplica el mismo principio: una experiencia de aprendizaje con buen ritmo alterna entre desafío y reflexión, entre acción y procesamiento.</p>
				<p>La relación entre los CTA y las metas es bidireccional. Las metas generan el contexto en el que los CTA tienen significado — un CTA para "elige tu especialización" solo tiene sentido si el estudiante tiene una meta que implica especialización. Inversamente, los CTA traen las metas a la atención inmediata del estudiante — un temporizador que advierte "quedan 2 minutos" hace que la meta basada en el tiempo sea relevante en el momento de la decisión.</p>
				<p>Es por esto que los CTA vienen después del diseño de metas en el proceso de BEM. El diseñador debe saber qué metas existen antes de diseñar los momentos que las activan.</p>
				{:else}
				<h2>9. Call to Action and Attention Management</h2>
				<p>Goals, even well-designed ones, are inert until they are activated. A goal that the learner never thinks about cannot direct behavior. This is where <strong>calls to action</strong> (CTAs) enter the picture.</p>
				<p>In game design, a call to action is any element of the system that prompts the player to make a decision. It might be a timer counting down, an enemy approaching, a quest giver appearing, or a resource starting to drain. The CTA creates <strong>urgency</strong> — not necessarily in the sense of stress, but in the sense of a decision point that demands attention.</p>
				<p>BEM treats CTAs as a design element in their own right, not an incidental feature of the interface. The rhythm and timing of CTAs determine the <strong>pace</strong> of the learning experience and helps manage the learners' attentional resources. Too few CTAs, and the learner drifts; too many, and the learner becomes overwhelmed. The art of attention management lies in calibrating the frequency and salience of CTAs to match the cognitive state of the learner.</p>
				<p>BEM distinguishes between several types of CTAs:</p>
				<ul>
					<li><strong>Explicit CTAs</strong> are direct prompts: "Click here to begin," "Submit your answer," "Choose your path." They leave no ambiguity about what the learner should do. They are essential for onboarding and for moments when the system needs a clear decision.</li>
					<li><strong>Implicit CTAs</strong> arise from the state of the system: a progress bar approaching completion, a resource depleting, a time limit looming. The learner is not told directly what to do; the state of the system creates a natural pressure to act. Implicit CTAs are powerful because they engage the learner's own decision-making rather than simply following instructions.</li>
					<li><strong>Environmental CTAs</strong> are changes in the game world that signal an opportunity or threat: a door unlocking, an enemy appearing, a new area becoming accessible. These CTAs leverage the learner's perceptual system — they capture attention through novelty, change, or contrast.</li>
					<li><strong>Silent CTAs</strong> are call to actions from inaction. When things don't move forward until the learner takes an action, that inaction becomes a CTA. It builds around the inherent desire of keeping things moving. This is different than not having a CTA, which means not building urgency — this is building the need for action through uncomfortable silences.</li>
				</ul>
				<p>Attention management also involves designing moments of <strong>rest</strong>. Not every moment can be a peak of urgency; the system needs low-tension periods where the learner can process, reflect, consolidate, and plan. Games alternate between intense action sequences and quieter moments of exploration or inventory management. BEM applies the same principle: a well-paced learning experience alternates between challenge and reflection, between action and processing.</p>
				<p>The relationship between CTAs and goals is bidirectional. Goals generate the context in which CTAs are meaningful — a CTA to "choose your specialization" is only meaningful if the learner has a goal that involves specialization. Conversely, CTAs bring goals into the learner's immediate attention — a timer that warns "2 minutes remaining" makes the time-based goal salient at the moment of decision.</p>
				<p>This is why CTAs come after goal design in the BEM process. The designer must know what goals exist before designing the moments that activate them.</p>
				{/if}
			</section>

			<!-- CHAPTER 10: Evaluation -->
			<section id="ch-evaluation" bind:this={chapterEls['ch-evaluation']}>
				{#if lang === 'es'}
				<h2>10. Evaluación: Reglas que Construyen Competencia</h2>
				<p>Uno de los aspectos más radicales de BEM es su tratamiento de la <strong>evaluación</strong>. En la educación tradicional, la evaluación es un acto terminal: ocurre al final, produce una calificación y sirve principalmente como un juicio del desempeño del estudiante. En BEM, la evaluación es un <strong>elemento estructural del sistema de retroalimentación</strong> — existe no para juzgar, sino para generar la información que el estudiante necesita para autocorregirse.</p>
				<p>BEM reconceptualiza la evaluación como <strong>evaluación funcional</strong>: el diseño de reglas algorítmicas que procesan las acciones del estudiante y producen resultados consistentes y medibles. El término "funcional" es deliberado — significa que la evaluación produce el mismo resultado dado el mismo insumo, eliminando la subjetividad e inconsistencia que afectan a la evaluación tradicional.</p>
				<p>La evaluación funcional sigue un proceso de cuatro pasos:</p>
				<ol>
					<li><strong>Definir los canales de retroalimentación.</strong> Una sola acción del estudiante puede generar múltiples señales de evaluación. Un ejercicio de programación, por ejemplo, podría producir canales separados para corrección sintáctica, eficiencia algorítmica, legibilidad del código y cobertura de pruebas. Cada canal es independiente — el estudiante puede ver el rendimiento en cada dimensión por separado.</li>
					<li><strong>Definición de parámetros.</strong> Para cada canal, el diseñador especifica qué parámetros serán evaluados. En el ejemplo de programación, el canal de sintaxis podría evaluar "número de errores de sintaxis" y "éxito de compilación," mientras que el canal de eficiencia evalúa "complejidad temporal" y "uso de memoria."</li>
					<li><strong>Diseño de función y salida.</strong> Para cada canal, el diseñador crea una función que procesa los parámetros en una salida. La función es algorítmica — dados los mismos parámetros, siempre produce el mismo resultado. La salida se convierte en la actualización de estado que el sistema de retroalimentación entregará al estudiante.</li>
					<li><strong>Diseño de entrega de retroalimentación.</strong> El diseñador determina cómo se comunica cada estado de salida al estudiante a través de la interfaz. Aquí es donde la evaluación se conecta con la retroalimentación — la función de evaluación produce los datos; el sistema de retroalimentación determina cómo esos datos se convierten en una experiencia para el estudiante.</li>
				</ol>
				<p>Este enfoque introduce una distinción crítica entre la evaluación <strong>monocanal</strong> y <strong>multicanal</strong>.</p>
				<p>La evaluación monocanal es lo que la mayoría de los sistemas educativos hacen: múltiples criterios se combinan en una sola puntuación. Un ensayo podría ser evaluado en contenido, estructura, gramática y originalidad, pero todo esto se reduce a una sola calificación. Esto crea lo que BEM llama una <strong>brecha evaluativa</strong>: el estudiante recibe un 7/10 pero no puede saber si el problema fue el contenido, la estructura o la gramática. La información es ambigua y, por lo tanto, inútil para la autocorrección.</p>
				<p>La evaluación multicanal mantiene cada criterio en su propio canal, con su propia puntuación y su propia señal de retroalimentación. El estudiante ve:</p>
				<ul>
					<li>Precisión del contenido: 8/10</li>
					<li>Estructura del argumento: 6/10</li>
					<li>Gramática y estilo: 9/10</li>
					<li>Originalidad: 7/10</li>
				</ul>
				<p>Cada canal es independiente. El estudiante sabe exactamente qué dimensión necesita trabajo. No hay ambigüedad, no hay promediación entre criterios, no hay misterio sobre lo que significa la puntuación.</p>
				<p>La evaluación multicanal requiere más trabajo de diseño — implica definir funciones separadas para cada canal — pero es dramáticamente más útil para el aprendizaje. Transforma la evaluación de un juicio terminal en un <strong>panel de diagnóstico</strong> que el estudiante puede usar para guiar la práctica.</p>
				<p>Igualmente importante: la evaluación multicanal apoya el <strong>error como aprendizaje</strong>. Cuando un estudiante falla en una prueba monocanal, la información es demasiado gruesa para guiar la corrección. "Fallaste la prueba" no le dice nada al estudiante sobre qué hacer de manera diferente. Cuando un estudiante falla en una evaluación multicanal, la información es precisa: "Tu sintaxis es correcta, pero tu algoritmo es ineficiente. Aquí tienes una comparación de la complejidad temporal de tu solución contra la complejidad objetivo." Ahora el estudiante tiene información procesable — exactamente lo que el sistema de retroalimentación de BEM necesita entregar.</p>
				<p>Este es el puente de la evaluación al diseño del fracaso. La evaluación, bien hecha, no es el fin del aprendizaje. Es el comienzo de la siguiente iteración.</p>
				{:else}
				<h2>10. Evaluation: Rules That Build Competency</h2>
				<p>One of the most radical aspects of BEM is its treatment of <strong>evaluation</strong>. In traditional education, evaluation is a terminal act: it happens at the end, it produces a grade, and it serves primarily as a judgment of the learner's performance. In BEM, evaluation is a <strong>structural element of the feedback system</strong> — it exists not to judge, but to generate the information the learner needs to self-correct.</p>
				<p>BEM reconceptualizes evaluation as <strong>functional evaluation</strong>: the design of algorithmic rules that process the learner's actions and produce consistent, measurable outputs. The term "functional" is deliberate — it means the evaluation produces the same result given the same input, eliminating the subjectivity and inconsistency that plague traditional assessment.</p>
				<p>Functional evaluation follows a four-step process:</p>
				<ol>
					<li><strong>Define the feedback channels.</strong> A single learner action can generate multiple evaluation signals. A programming exercise, for example, might produce separate channels for syntax correctness, algorithmic efficiency, code readability, and testing coverage. Each channel is independent — the learner can see performance on each dimension separately.</li>
					<li><strong>Parameter definition.</strong> For each channel, the designer specifies what parameters will be evaluated. In the programming example, the syntax channel might evaluate "number of syntax errors" and "compilation success," while the efficiency channel evaluates "time complexity" and "memory usage."</li>
					<li><strong>Function and output design.</strong> For each channel, the designer creates a function that processes the parameters into an output. The function is algorithmic — given the same parameters, it always produces the same result. The output becomes the state update that the feedback system will deliver to the learner.</li>
					<li><strong>Feedback delivery design.</strong> The designer determines how each output state is communicated to the learner through the interface. This is where evaluation connects to feedback — the evaluation function produces the data; the feedback system determines how that data becomes an experience for the learner.</li>
				</ol>
				<p>This approach introduces a critical distinction between <strong>monochannel</strong> and <strong>multichannel</strong> evaluation.</p>
				<p>Monochannel evaluation is what most educational systems do: multiple criteria are combined into a single score. An essay might be evaluated on content, structure, grammar, and originality, but all of these are collapsed into one grade. This creates what BEM calls an <strong>evaluative gap</strong>: the learner receives a 7/10 but cannot tell whether the problem was content, structure, or grammar. The information is ambiguous, and therefore useless for self-correction.</p>
				<p>Multichannel evaluation keeps each criterion in its own channel, with its own score and its own feedback signal. The learner sees:</p>
				<ul>
					<li>Content accuracy: 8/10</li>
					<li>Argument structure: 6/10</li>
					<li>Grammar and style: 9/10</li>
					<li>Originality: 7/10</li>
				</ul>
				<p>Each channel is independent. The learner knows exactly which dimension needs work. There is no ambiguity, no averaging across criteria, no mystery about what the score means.</p>
				<p>Multichannel evaluation is more work to design — it requires defining separate functions for each channel — but it is dramatically more useful for learning. It transforms evaluation from a terminal judgment into a <strong>diagnostic dashboard</strong> that the learner can use to guide practice.</p>
				<p>Equally important: multichannel evaluation supports <strong>error as learning</strong>. When a learner fails a monochannel test, the information is too coarse to guide correction. "You failed the test" tells the learner nothing about what to do differently. When a learner fails a multichannel evaluation, the information is precise: "Your syntax is correct, but your algorithm is inefficient. Here is a comparison of your solution's time complexity against the target complexity." Now the learner has actionable information — exactly what BEM's feedback system needs to deliver.</p>
				<p>This is the bridge from evaluation to failure design. Evaluation, done well, is not the end of learning. It is the beginning of the next iteration.</p>
				{/if}
			</section>

			<!-- CHAPTER 11: Feedback as Information and Emotion -->
			<section id="ch-feedback" bind:this={chapterEls['ch-feedback']}>
				{#if lang === 'es'}
				<h2>11. La Retroalimentación como Información y Emoción</h2>
				<p>Si la evaluación es el juicio interno del sistema, la <strong>retroalimentación</strong> es cómo ese juicio se convierte en una experiencia para el aprendiz. La retroalimentación es el canal a través del cual el sistema se comunica — y la comunicación en los juegos nunca es puramente informativa. También es emocional.</p>
				<p>Primero, entendamos la definición de retroalimentación de BEM: "La respuesta interactiva de un sistema cuando se activa un evento o criterio." La retroalimentación no se trata solo de corrección, sino de comunicación y guía. Los aprendices reciben retroalimentación constante de su profesor, pero también de sus compañeros, y el profesor recibe retroalimentación de los estudiantes. La retroalimentación requiere un bucle conversacional continuo, que necesita participación activa, o mejor aún, interactiva.</p>
				<p>Por eso BEM es más que aprendizaje activo — es aprendizaje interactivo.</p>
				<p>BEM distingue entre dos dimensiones de la retroalimentación que deben diseñarse juntas:</p>
				<h3>Retroalimentación Cognitiva</h3>
				<p>Este es el contenido informativo de la señal: datos sobre rendimiento, progreso y estado. "Tu solución tiene una complejidad temporal de O(n²). El objetivo es O(n log n)." "Has completado 3 de 5 objetivos en este nivel." "Tu tasa de precisión actual es del 72%." La retroalimentación cognitiva alimenta el <strong>Sistema 2</strong> del aprendiz (Kahnemann) — el sistema de procesamiento deliberado y analítico. Permite la autoevaluación, el ajuste de estrategias y la práctica deliberada.</p>
				<p>La retroalimentación cognitiva es en lo que la mayoría de los sistemas educativos piensan cuando piensan en retroalimentación. Pero la retroalimentación cognitiva por sí sola es insuficiente. La retroalimentación puramente informativa puede sentirse fría, impersonal y desmotivadora. Peor aún, puede interpretarse como un juicio si se entrega con el tono equivocado.</p>
				<h3>Retroalimentación Emocional</h3>
				<p>Esta es la cualidad afectiva de la señal: cómo el sistema <em>hace sentir al aprendiz</em> a través de sus elecciones de composición, color, animación, sonido, ritmo e interacción con personajes. La retroalimentación emocional opera en el <strong>Sistema 1</strong> del aprendiz (Kahnemann) — el sistema de procesamiento rápido, intuitivo y afectivo. Genera sentimientos de triunfo, sorpresa, curiosidad, alivio, tensión o satisfacción.</p>
				<p>La retroalimentación emocional no es decoración. Es un elemento estructural de la motivación. La emoción impulsa la atención, la codificación y la persistencia. Un momento de triunfo de una animación celebratoria bien sincronizada codifica la estrategia exitosa más profundamente que cualquier "¡correcto!" basado en texto podría hacerlo. Un momento de tensión de un temporizador de cuenta regresiva enfoca la atención del aprendiz y crea urgencia. Un momento de humor de la reacción de un personaje a un error reduce la frustración y hace que el fracaso se sienta superable.</p>
				<p>Los juegos son maestros de la retroalimentación emocional. La vibración de la pantalla en un golpe crítico, el sonido satisfactorio de una moneda al ser recolectada, el zoom dramático en la entrada de un jefe, el cambio musical sutil al entrar en un área segura — estos no son añadidos cosméticos. Son los canales principales a través de los cuales el juego comunica significado emocional. Le dicen al jugador: esto importa, esto es emocionante, esto es peligroso, esto es seguro.</p>
				<p>BEM trae esta sensibilidad al diseño de aprendizaje. Cada señal de retroalimentación debe diseñarse teniendo en cuenta tanto las dimensiones cognitivas como las emocionales. Esto no significa que cada cuestionario necesite una animación de fuegos artificiales. Pero sí significa que el diseñador debe preguntarse: ¿qué estado emocional debería crear esta retroalimentación? ¿Asombro? ¿Alivio? ¿Curiosidad? ¿Satisfacción? ¿Urgencia? ¿Y cómo producirán ese estado la composición, el tiempo y la calidad sensorial de la señal?</p>
				<p>La distinción cognitivo/emocional se conecta con la distinción de <strong>información vs. control</strong> introducida anteriormente. La retroalimentación informativa dice: "aquí es donde estás." La retroalimentación de control dice: "necesitas estar aquí, y estás fallando en cumplir con el estándar." Los mismos datos pueden entregarse de cualquier manera. Y la calidad emocional de la señal — el tono, el encuadre, las características sensoriales — es lo que determina qué mensaje recibe el aprendiz.</p>
				<p>Una barra de progreso que avanza suavemente es informativa: le dice al aprendiz "estás al 60% del camino." Una barra de progreso que parpadea en rojo y muestra "ADVERTENCIA: ESTÁS ATRASADO" es controladora: le dice al aprendiz "no estás donde deberías estar." Los datos subyacentes pueden ser idénticos. La experiencia emocional es radicalmente diferente. Y esa diferencia emocional tiene consecuencias reales para la motivación y el aprendizaje.</p>
				<p>El catálogo de retroalimentación de BEM proporciona a los diseñadores un vocabulario para pensar sistemáticamente sobre la retroalimentación emocional. Los tipos de retroalimentación visual (indicadores de progreso, cambios de estado, animaciones), las señales auditivas (sonidos de confirmación, tonos de alerta, cambios ambientales), las señales hápticas y propioceptivas (vibración de pantalla, vibración del dispositivo) y la retroalimentación mediada por personajes (diálogo, expresiones, poses) son todas herramientas de diseño que pueden seleccionarse y combinarse para producir la respuesta emocional deseada.</p>
				<p>La clave es que la retroalimentación emocional debe estar <strong>alineada</strong> con la meta y el impulsor. Una explosión de confeti celebratoria para una tarea rutinaria puede sentirse condescendiente. Un sonido tranquilo y elegante para un gran avance puede sentirse anticlimático. Así como la meta y el impulsor deben estar alineados, la retroalimentación y el tono emocional deben calibrarse según la importancia del momento.</p>
				<h3>Interdependencia de Canales: Emoción y Cognición son Sistemas Paralelos</h3>
				<p>La directriz de BEM es clara: nunca intentes compensar una retroalimentación instruccional deficiente con imágenes amigables, medallas motivacionales o agentes empáticos. La lógica cognitiva y la experiencia emocional deben diseñarse como <strong>sistemas paralelos y complementarios</strong>, cada uno cumpliendo su propia función. Un tono cálido no puede reemplazar una explicación faltante, y una explicación perfecta entregada fríamente aún puede desmotivar.</p>
				<p>Pero aunque son independientes, también son interdependientes. Un sistema puede amplificar, amortiguar o interferir con el otro. Una explicación bien escrita puede verse opacada por una mala entrega, y una entrega atractiva puede carecer de significado si la lógica cognitiva no es clara. Por otro lado, si ambos canales están alineados, pueden crear un poderoso bucle de retroalimentación que mejora tanto el aprendizaje como la motivación.</p>
				{:else}
				<h2>11. Feedback as Information and Emotion</h2>
				<p>If evaluation is the system's internal judgment, <strong>feedback</strong> is how that judgment becomes an experience for the learner. Feedback is the channel through which the system communicates — and communication in games is never purely informational. It is also emotional.</p>
				<p>First, let's understand BEM's definition of feedback: "The interactive response of a system when an event or criteria is triggered." Feedback is not about correction only, but about communication and guidance. Learners receive constant feedback from their teacher, but also from their peers, and the teacher receives feedback from the students. Feedback requires a continuous conversational loop, which requires active, or better, interactive participation.</p>
				<p>That is why BEM is more than active learning — it is interactive learning.</p>
				<p>BEM distinguishes between two dimensions of feedback that must be designed together:</p>
				<h3>Cognitive Feedback</h3>
				<p>This is the informational content of the signal: data about performance, progress, and state. "Your solution has a time complexity of O(n²). The target is O(n log n)." "You have completed 3 of 5 objectives in this level." "Your current accuracy rate is 72%." Cognitive feedback feeds the learner's <strong>System 2</strong> (Kahnemann) — the deliberate, analytical processing system. It enables self-assessment, strategy adjustment, and deliberate practice.</p>
				<p>Cognitive feedback is what most educational systems think of when they think of feedback. But cognitive feedback alone is insufficient. Purely informational feedback can feel cold, impersonal, and unmotivating. Worse, it can be interpreted as judgment if delivered in the wrong tone.</p>
				<h3>Emotional Feedback</h3>
				<p>This is the affective quality of the signal: how the system <em>makes the learner feel</em> through its choices of composition, color, animation, sound, pacing, and character interaction. Emotional feedback operates on the learner's <strong>System 1</strong> (Kahnemann) — the fast, intuitive, affective processing system. It generates feelings of triumph, surprise, curiosity, relief, tension, or satisfaction.</p>
				<p>Emotional feedback is not decoration. It is a structural element of motivation. Emotion drives attention, encoding, and persistence. A moment of triumph from a well-timed celebratory animation encodes the successful strategy more deeply than any text-based "correct!" ever could. A moment of tension from a countdown timer focuses the learner's attention and creates urgency. A moment of humor from a character's reaction to an error reduces frustration and makes failure feel survivable.</p>
				<p>Games are masters of emotional feedback. The screen shake on a critical hit, the satisfying sound of a coin being collected, the dramatic zoom on a boss's entrance, the quiet musical shift when entering a safe area — these are not cosmetic additions. They are the primary channels through which the game communicates emotional meaning. They tell the player: this matters, this is exciting, this is dangerous, this is safe.</p>
				<p>BEM brings this sensitivity to learning design. Every feedback signal should be designed with both cognitive and emotional dimensions in mind. This does not mean every quiz needs a fireworks animation. But it does mean the designer should ask: what emotional state should this feedback create? Awe? Relief? Curiosity? Satisfaction? Urgency? And how will the composition, timing, and sensory quality of the signal produce that state?</p>
				<p>The cognitive/emotional distinction connects back to the <strong>information vs. control</strong> distinction introduced earlier. Information feedback says: "here is where you are." Control feedback says: "you need to be here, and you are failing to meet the standard." The same data can be delivered either way. And the emotional quality of the signal — the tone, the framing, the sensory characteristics — is what determines which message the learner receives.</p>
				<p>A progress bar that advances smoothly is informational: it tells the learner "you are 60% of the way there." A progress bar that flashes red and displays "WARNING: YOU ARE BEHIND" is controlling: it tells the learner "you are not where you should be." The underlying data may be identical. The emotional experience is radically different. And that emotional difference has real consequences for motivation and learning.</p>
				<p>BEM's feedback catalogue provides designers with a vocabulary for thinking systematically about emotional feedback. Visual feedback types (progress indicators, state changes, animations), auditory signals (confirmation sounds, alert tones, ambient shifts), haptic and proprioceptive signals (screen shake, device vibration), and character-mediated feedback (dialogue, expressions, poses) are all design tools that can be selected and combined to produce the desired emotional response.</p>
				<p>The key is that emotional feedback must be <strong>aligned</strong> with the goal and driver. A celebratory explosion of confetti for a routine task can feel patronizing. A quiet, elegant sound for a major breakthrough can feel anticlimactic. Just as goal and driver must be aligned, feedback and emotional tone must be calibrated to the significance of the moment.</p>
				<h3>Channel Interdependence: Emotion and Cognition Are Parallel Systems</h3>
				<p>BEM's directive is clear: never attempt to compensate for poor instructional feedback with friendly visuals, motivational badges, or empathetic agents. The cognitive logic and the emotional experience must be designed as <strong>parallel and complementary systems</strong>, each serving its own function. A warm tone cannot replace a missing explanation, and a perfect explanation delivered coldly can still demotivate.</p>
				<p>But while independent, they are also interdependent. One system can amplify, buffer, or interfere with the other. A well written explanation can be dampened by a bad delivery, and an engaging delivery can be meaningless if the cognitive logic is unclear. On the other hand, if both channels are aligned, they can create a powerful feedback loop that enhances both learning and motivation.</p>
				{/if}
			</section>

			<!-- CHAPTER 12: Corrective and Elaborate Feedback -->
			<section id="ch-elaborate" bind:this={chapterEls['ch-elaborate']}>
				{#if lang === 'es'}
				<h2>12. Retroalimentación Correctiva y Elaborada: La Paradoja de la Carga Cognitiva</h2>
				<p>La retroalimentación no es una señal monolítica. Un mismo fragmento de información puede entregarse de maneras que ya sea empoderan al aprendiz para autocorregirse o crean dependencia de una explicación externa. BEM se basa en la investigación sobre retroalimentación instruccional para distinguir entre dos tipos fundamentales de retroalimentación, cada uno con efectos distintos sobre la carga cognitiva y los resultados de aprendizaje.</p>
				<p><strong>Retroalimentación Correctiva (Conocimiento de Resultados — KR).</strong> Este tipo informa al aprendiz solo si su respuesta fue correcta o incorrecta, opcionalmente revelando la respuesta correcta sin explicar por qué. La retroalimentación correctiva aumenta la <strong>carga cognitiva pertinente</strong> del aprendiz — el esfuerzo mental dedicado a la construcción activa de esquemas. Debido a que el sistema no explica el error, el cerebro del aprendiz se ve forzado a buscar en la memoria y las reglas del sistema para deducir la fuente del fallo. Para estudiantes fuertes con modelos mentales robustos, esto estimula la autorregulación y el procesamiento más profundo. Para los novatos, sin embargo, genera alta frustración, aumenta la incertidumbre y produce una peor transferencia de conocimiento.</p>
				<p><strong>Retroalimentación Elaborada (Proceso / Explicativa).</strong> Este tipo proporciona una explicación detallada: los pasos lógicos, la fórmula utilizada o la heurística que justifica por qué una opción es correcta o incorrecta. La retroalimentación elaborada <strong>reduce el esfuerzo cognitivo inmediato</strong> (carga pertinente) al entregar una comprensión ya estructurada al aprendiz. Acelera drásticamente la adquisición conceptual inicial y la transferencia para los novatos.</p>
				<p>Pero la retroalimentación elaborada introduce una paradoja: la <strong>Paradoja de la Carga Pertinente</strong>. Si la explicación es demasiado detallada o se entrega inmediatamente después del error, induce <strong>pasividad cognitiva</strong>. El aprendiz simplemente lee la explicación sin realizar un procesamiento profundo. El mismo mecanismo que ayuda a los novatos puede, cuando se aplica en exceso, prevenir la codificación esforzada que produce retención a largo plazo.</p>
				<h3>La Solución de BEM: Retroalimentación Elaborada Andamiada</h3>
				<p>BEM resuelve esta paradoja mediante un diseño de retroalimentación andamiada:</p>
				<ol>
					<li><strong>Evitar la explicación completa inmediata.</strong> Cuando un aprendiz falla en un desafío, no entregues la respuesta completa paso a paso de inmediato. Esto cortocircuitaría el esfuerzo cognitivo necesario para la construcción de esquemas.</li>
					<li><strong>Usar pistas (andamiaje conceptual).</strong> Proporciona retroalimentación elaborada en forma de pistas conceptuales, heurísticas o preguntas guía. Esto reduce la incertidumbre sin eliminar el esfuerzo de deducción activa del aprendiz — preservando un nivel saludable de carga cognitiva pertinente.</li>
					<li><strong>Aplicar desvanecimiento dinámico basado en experiencia.</strong> El <strong>Efecto de Inversión de Experiencia</strong> establece que lo que ayuda a los novatos perjudica a los expertos. Los novatos carecen de esquemas mentales estructurados en la memoria a largo plazo; necesitan andamiaje elaborado, detallado e inmediato para evitar colapsar bajo la carga cognitiva extrínseca. Los expertos, por el contrario, tienen esquemas robustos; para ellos, la retroalimentación elaborada actúa como <strong>ruido de interferencia</strong> — interrumpe la automatización, fuerza el procesamiento de información redundante y degrada el rendimiento. BEM prescribe implementar un desvanecimiento dinámico: a medida que el usuario progresa y demuestra consistencia, el sistema simplifica la retroalimentación de elaborada a puramente correctiva o basada en tiempo.</li>
				</ol>
				{:else}
				<h2>12. Corrective and Elaborate Feedback: The Cognitive Load Paradox</h2>
				<p>Feedback is not a monolithic signal. The same piece of information can be delivered in ways that either empower the learner to self-correct or create dependency on external explanation. BEM draws on instructional feedback research to distinguish between two fundamental types of feedback, each with distinct effects on cognitive load and learning outcomes.</p>
				<p><strong>Corrective Feedback (Knowledge of Results — KR).</strong> This type informs the learner only whether their response was correct or incorrect, optionally revealing the correct answer without explaining why. Corrective feedback increases the learner's <strong>germane cognitive load</strong> — the mental effort devoted to active schema construction. Because the system does not explain the error, the learner's brain is forced to search memory and system rules to deduce the source of the failure. For strong students with robust mental models, this stimulates self-regulation and deeper processing. For novices, however, it generates high frustration, increases uncertainty, and produces worse knowledge transfer.</p>
				<p><strong>Elaborate Feedback (Process / Explanatory).</strong> This type provides detailed explanation: the logical steps, the formula used, or the heuristic that justifies why an option is correct or incorrect. Elaborate feedback <strong>reduces immediate cognitive effort</strong> (germane load) by delivering already-structured understanding to the learner. It dramatically accelerates initial conceptual acquisition and transfer for novices.</p>
				<p>But elaborate feedback introduces a paradox: the <strong>Germane Load Paradox</strong>. If the explanation is too detailed or delivered immediately after the error, it induces <strong>cognitive passivity</strong>. The learner simply reads the explanation without performing deep processing. The very mechanism that helps novices can, when over-applied, prevent the effortful encoding that produces long-term retention.</p>
				<h3>BEM's Solution: Scaffolded Elaborate Feedback</h3>
				<p>BEM resolves this paradox through scaffolded feedback design:</p>
				<ol>
					<li><strong>Avoid immediate full explanation.</strong> When a learner fails a challenge, do not deliver the complete step-by-step answer immediately. This would short-circuit the cognitive effort needed for schema construction.</li>
					<li><strong>Use hints (conceptual scaffolding).</strong> Provide elaborate feedback in the form of conceptual clues, heuristics, or guiding questions. This reduces uncertainty without eliminating the learner's active deduction effort — preserving a healthy level of germane cognitive load.</li>
					<li><strong>Apply dynamic fading based on expertise.</strong> The <strong>Expertise Reversal Effect</strong> states that what helps novices harms experts. Novices lack structured mental schemas in long-term memory; they need elaborate, detailed, and immediate scaffolding to avoid collapsing under extraneous cognitive load. Experts, by contrast, have robust schemas; for them, elaborate feedback acts as <strong>interference noise</strong> — it interrupts automation, forces processing of redundant information, and degrades performance. BEM prescribes implementing dynamic fading: as the user progresses and demonstrates consistency, the system simplifies feedback from elaborative to purely corrective or time-based.</li>
				</ol>
				{/if}
			</section>

			<!-- CHAPTER 13: The Building Blocks of Feedback Design -->
			<section id="ch-building" bind:this={chapterEls['ch-building']}>
				{#if lang === 'es'}
				<h2>13. Los Componentes del Diseño de Retroalimentación</h2>
				<p>El catálogo de retroalimentación de BEM categoriza los canales de retroalimentación no solo por modalidad sensorial, sino por cómo cada canal construye significado. Comprender estos componentes permite al diseñador elegir la señal correcta para el momento adecuado y combinarlas en sistemas de retroalimentación coherentes. El sistema educativo tradicional se basa casi exclusivamente en uno de estos cuatro, ignorando el poder único de los otros tres.</p>
				<h3>Retroalimentación Visual</h3>
				<p><strong>1. Insignias (Iconos y Animaciones).</strong> Estos son símbolos visuales — iconos, <strong>medallas</strong>, ilustraciones animadas — que construyen significado a través de la <strong>composición</strong>. Su significado proviene de lo que representan, cómo están estilizados y el contexto en el que aparecen. Una marca de verificación, una estrella, un aura brillante, la expresión de un personaje: cada uno comunica un estado o evento específico a través del lenguaje visual. Las insignias sobresalen en el reconocimiento inmediato y holístico. El aprendiz ve el ícono y sabe instantáneamente "lo logré," "esto es peligroso," o "desbloqueé algo." No requieren lectura, conteo o comparación. Su poder reside en la velocidad y la resonancia emocional.</p>
				<p>En BEM, las insignias son especialmente útiles para la Fase 4 del Ciclo de Aprendizaje Interactivo (Evaluación del Sistema y Retroalimentación), donde el sistema debe comunicar un cambio de estado rápidamente. Un ícono bien diseñado puede reemplazar párrafos de texto y comunicar la misma información en milisegundos.</p>
				<p><strong>2. Escalas (Sistemas Cuantitativos).</strong> Estos son números, barras de progreso, <strong>puntos</strong>, indicadores de nivel y cualquier elemento visual que construya significado a través de <strong>relaciones cuantitativas</strong>. Una barra de progreso al 60% comunica "estás más de la mitad del camino." Un nivel de 7 sobre 10 comunica posición relativa. Una puntuación de 850 comunica magnitud. Las escalas requieren interpretación — el aprendiz debe leer, comparar y evaluar la cantidad en relación con un punto de referencia conocido.</p>
				<p>Las escalas sobresalen en el seguimiento de la progresión a lo largo del tiempo y en apoyar la práctica deliberada. Responden a la pregunta "¿dónde me encuentro?" con precisión. Mientras que las insignias comunican <em>qué sucedió</em>, las escalas comunican <em>cuánto</em> y <em>qué tan lejos</em>. Son esenciales para la fase de Meta y Estado del Sistema (Fase 1) del Ciclo de Aprendizaje Interactivo, donde el aprendiz necesita evaluar su posición actual frente al objetivo.</p>
				<h3>Retroalimentación Auditiva</h3>
				<p><strong>3. Señales Auditivas Simples (SFX Discriminatorios).</strong> Estos son efectos de sonido cortos y distintivos que llevan significados específicos y repetibles. El sonido icónico de la moneda en Super Mario Bros., el zumbido de error de una respuesta incorrecta, el clic de un botón, el campanilleo de una subida de nivel — cada uno es un ícono auditivo comprimido que comunica un concepto único de inmediato. Las señales auditivas simples son poderosas porque evitan la atención visual. El aprendiz puede recibir retroalimentación sin mirar la pantalla, o mientras su canal visual está ocupado con información compleja. Y llevan un fuerte significado emocional, ya que tu cerebro está entrenado para sentir algo cuando se escucha un sonido particular. El pop y el burbujeo de un refresco, la emoción de una fanfarria, la tensión de un redoble de tambor — estos sonidos están profundamente arraigados en nuestra evolución y biología.</p>
				<p>En BEM, las señales auditivas simples sirven como <strong>insignias auditivas</strong> — funcionan como íconos visuales pero a través del oído. Son ideales para confirmar acciones, señalar transiciones de estado y proporcionar retroalimentación en tiempo real durante interacciones rápidas donde la lectura sería demasiado lenta.</p>
				<p><strong>4. Señales Auditivas Complejas (Lenguaje).</strong> Este es el lenguaje hablado o escrito — el canal de retroalimentación más articulado. El lenguaje puede explicar, describir, narrar, preguntar y razonar. Es el único canal que puede comunicar información novedosa y dependiente del contexto con precisión. "Tu algoritmo es correcto pero tu complejidad temporal es O(n²); así es como puedes optimizarlo" — este nivel de detalle es imposible solo con íconos, escalas o efectos de sonido. También puede desencadenar la imaginación de formas que los otros tipos no pueden.</p>
				<p>La educación tradicional otorga <strong>privilegio exclusivo</strong> a este canal. Las conferencias, los libros de texto, la retroalimentación escrita y las explicaciones verbales son el modo predeterminado y a menudo el único de comunicación instruccional. BEM no rechaza el lenguaje — es esencial para la retroalimentación elaborada. Pero BEM insiste en que el lenguaje es <strong>un canal entre cuatro</strong>, no la respuesta universal. Los otros tres canales — insignias, escalas y señales auditivas simples — no son adiciones decorativas o "recompensas." Son <strong>mecanismos de información estructural</strong> que comunican tipos específicos de contenido de manera más eficiente de lo que el lenguaje podría hacerlo.</p>
				<h3>Principio de Diseño: Empareja el Canal con la Función</h3>
				<p>Cada componente tiene un rol natural en el Ciclo de Aprendizaje Interactivo:</p>
				<ul>
					<li><strong>Fase 1 (Meta y Estado del Sistema):</strong> Las escalas dominan — el aprendiz lee su posición frente a objetivos cuantitativos.</li>
					<li><strong>Fase 2 (Llamado a la Acción):</strong> Las señales auditivas simples y las insignias funcionan bien — capturan la atención y señalan urgencia sin requerir interpretación.</li>
					<li><strong>Fase 4 (Evaluación del Sistema y Retroalimentación):</strong> Todos los canales pueden contribuir. Las insignias comunican el resultado de manera holística, las escalas muestran la magnitud, los sonidos simples confirman el evento y el lenguaje elabora cuando se necesita una comprensión más profunda.</li>
				</ul>
				<p>La tarea del diseñador no es elegir un canal, sino orquestarlos para que cada señal use el canal más adecuado para su contenido. Una puntuación que requiere comparación cuantitativa debería ser una escala, no una insignia. Un cambio de estado que necesita reconocimiento inmediato debería ser una insignia o un sonido simple, no una oración. Y una explicación compleja debería ser lenguaje, no una barra de progreso. Este es el arte de la orquestación de la retroalimentación.</p>
				<p>¡Pero cuidado! ¡No trates la retroalimentación como un premio! Esta es la razón por la que los PBL (Puntos, Medallas y tablas de Líderes) son un concepto vinculado con las malas prácticas de gamificación. ¡Pero los puntos, las medallas y las tablas de líderes son solo canales de retroalimentación! No son buenos ni malos por sí mismos, sino que dependen de las mecánicas detrás de ellos. Si tratas una medalla o un punto como una recompensa, estás perdiendo su valor de retroalimentación. Los PBL no tienen la culpa, sino sus diseñadores.</p>
				{:else}
				<h2>13. The Building Blocks of Feedback Design</h2>
				<p>BEM's feedback catalogue categorizes feedback channels not just by sensory modality, but by how each channel constructs meaning. Understanding these building blocks allows the designer to choose the right signal for the right moment, and to combine them into coherent feedback systems. The traditional educational system relies almost exclusively on one of these four, ignoring the unique power of the other three.</p>
				<h3>Visual Feedback</h3>
				<p><strong>1. Insigniae (Icons and Animations).</strong> These are visual symbols — icons, <strong>badges</strong>, animated illustrations — that construct meaning through <strong>composition</strong>. Their significance comes from what they depict, how they are styled, and the context in which they appear. A checkmark, a star, a glowing aura, a character's expression: each communicates a specific state or event through visual language. Insigniae excel at immediate, holistic recognition. The learner sees the icon and instantly knows "I succeeded," "this is dangerous," or "I unlocked something." They do not require reading, counting, or comparing. Their power lies in speed and emotional resonance.</p>
				<p>In BEM, insigniae are especially useful for Phase 4 of the Interactive Learning Cycle (System Evaluation and Feedback), where the system must communicate a state change rapidly. A well-designed icon can replace paragraphs of text and communicate the same information in milliseconds.</p>
				<p><strong>2. Scales (Quantitative Systems).</strong> These are numbers, progress bars, <strong>points</strong>, level indicators, and any visual element that constructs meaning through <strong>quantitative relationships</strong>. A progress bar at 60% communicates "you are more than halfway there." A level of 7 out of 10 communicates relative position. A score of 850 communicates magnitude. Scales require interpretation — the learner must read, compare, and evaluate the quantity in relation to a known reference point.</p>
				<p>Scales excel at tracking progression over time and supporting deliberate practice. They answer the question "where do I stand?" with precision. While insigniae communicate <em>what happened</em>, scales communicate <em>how much</em> and <em>how far</em>. They are essential for the Goal and System State phase (Phase 1) of the Interactive Learning Cycle, where the learner needs to assess their current position against the target.</p>
				<h3>Auditory Feedback</h3>
				<p><strong>3. Simple Auditory Signals (Discriminatory SFX).</strong> These are short, distinctive sound effects that carry specific, repeatable meanings. The iconic coin sound in Super Mario Bros., the error buzz of a wrong answer, the click of a button, the chime of a level-up — each is a compressed auditory icon that communicates a single concept immediately. Simple auditory signals are powerful because they bypass visual attention. The learner can receive feedback without looking at the screen, or while their visual channel is occupied with complex information. And they carry heavy emotional meaning, as your brain is trained to feel something when a particular sound is heard. The pop and fizz of a soda, the excitement of a fanfare, the tension of a drumroll — these sounds are deeply rooted in our evolution and biology.</p>
				<p>In BEM, simple auditory signals serve as <strong>auditory insigniae</strong> — they work like visual icons but through the ear. They are ideal for confirming actions, signaling state transitions, and providing real-time feedback during fast-paced interactions where reading would be too slow.</p>
				<p><strong>4. Complex Auditory Signals (Language).</strong> This is spoken or written language — the most articulated feedback channel. Language can explain, describe, narrate, question, and reason. It is the only channel that can communicate novel, context-dependent information with precision. "Your algorithm is correct but your time complexity is O(n²); here is how you can optimize it" — this level of detail is impossible through icons, scales, or sound effects alone. It can also trigger the imagination in ways the other types can't.</p>
				<p>Traditional education gives <strong>exclusive privilege</strong> to this channel. Lectures, textbooks, written feedback, and verbal explanations are the default and often the only mode of instructional communication. BEM does not reject language — it is essential for elaborate feedback. But BEM insists that language is <strong>one channel among four</strong>, not the universal answer. The other three channels — insigniae, scales, and simple auditory signals — are not decorative additions or "rewards." They are <strong>structural information mechanisms</strong> that communicate specific kinds of content more efficiently than language ever could.</p>
				<h3>Design Principle: Match the Channel to the Function</h3>
				<p>Each building block has a natural role in the Interactive Learning Cycle:</p>
				<ul>
					<li><strong>Phase 1 (Goal and System State):</strong> Scales dominate — the learner reads their position against quantitative targets.</li>
					<li><strong>Phase 2 (Call to Action):</strong> Simple auditory signals and insigniae work well — they capture attention and signal urgency without requiring interpretation.</li>
					<li><strong>Phase 4 (System Evaluation and Feedback):</strong> All channels can contribute. Insigniae communicate the outcome holistically, scales show the magnitude, simple sounds confirm the event, and language elaborates when deeper understanding is needed.</li>
				</ul>
				<p>The designer's task is not to choose one channel, but to orchestrate them so that each signal uses the channel best suited to its content. A score that requires quantitative comparison should be a scale, not a badge. A state change that needs immediate recognition should be an insignia or a simple sound, not a sentence. And a complex explanation should be language, not a progress bar. This is the craft of feedback orchestration.</p>
				<p>But beware! Don't treat feedback as a prize! This is the reason PBLs (Points, badges and leaderboards) is a concept tied with bad gamification practice. But points, badges and leaderboards are just feedback channels! They are not good or bad on their own, but they depend on the mechanics behind them. If you treat a badge or a point as a reward, you are losing its feedback value. PBLs are not to blame, but their designers.</p>
				{/if}
			</section>

			<!-- CHAPTER 14: Failure as a Learning Mechanism -->
			<section id="ch-failure" bind:this={chapterEls['ch-failure']}>
				{#if lang === 'es'}
				<h2>14. El Fracaso como Mecanismo de Aprendizaje</h2>
				<p>Quizás la diferencia más profunda entre los juegos y la educación es su relación con el fracaso. En la educación, el fracaso es un evento terminal: suspendes el examen, obtienes una mala nota, y esa nota te persigue. El mensaje es implícito pero claro: el fracaso es algo que debe evitarse a toda costa. El resultado, paradójicamente, es que los estudiantes evitan los mismos desafíos que producirían el mayor aprendizaje — porque los desafíos crean el riesgo de fracasar.</p>
				<p>En los juegos, el fracaso está entretejido en la estructura de la experiencia. Un jugador de un juego difícil fracasará docenas, incluso cientos de veces antes de tener éxito. Pero no experimentan estos fracasos como juicios de su valía. Los experimentan como <strong>información</strong> — como datos sobre qué estrategia no funcionó y qué deberían intentar a continuación. El juego no castiga el fracaso; hace que el fracaso sea <em>consecuente</em> pero no <em>final</em>.</p>
				<p>BEM trae esta lógica al diseño de aprendizaje. El objetivo no es eliminar el fracaso — eso es imposible e indeseable. El objetivo es diseñar el fracaso para que produzca aprendizaje en lugar de desmoralización.</p>
				<p>BEM propone cinco principios para el diseño del fracaso:</p>
				<ol>
					<li><strong>Crear un Entorno Seguro para el Fracaso.</strong> El primer requisito es que el fracaso no debe tener consecuencias permanentes o severas. En términos de juego, esto significa evitar la "muerte permanente" — el equivalente educativo de un solo examen que determina la nota final. En su lugar, los fracasos deben tener pequeñas apuestas recuperables. El aprendiz pierde algo de progreso, no todo. El aprendiz puede reintentar sin vergüenza.</li>
					<li><strong>Distinguir entre Fracasos Suaves y Duros.</strong> Los fracasos suaves son errores frecuentes y de bajo riesgo: una respuesta incorrecta en un cuestionario de práctica, un movimiento subóptimo en una simulación, un intento fallido que cuesta una pequeña cantidad de progreso. Los fracasos suaves crean retroalimentación continua sin amenazar el sentido de competencia del aprendiz. Los fracasos duros son más raros y conllevan mayores riesgos: fallar en un proyecto importante, perder todo el progreso acumulado en un nivel. Los fracasos duros aumentan el peso emocional de la experiencia pero deben usarse con moderación. Demasiados fracasos duros crean frustración y abandono; demasiados fracasos suaves crean aburrimiento y falta de consecuencias.</li>
					<li><strong>Proporcionar Empoderamiento Después del Fracaso.</strong> Después de un fracaso, el aprendiz necesita más que información — necesita un camino a seguir. Esto podría tomar la forma de pistas, potenciadores, dificultad ajustada o ánimo narrativo. La clave es que el sistema no abandona al aprendiz después del fracaso. Lo ayuda activamente a recuperarse. Esto es lo opuesto a las prácticas educativas que otorgan una mala nota y siguen adelante sin apoyo.</li>
					<li><strong>Reducir la Incertidumbre a Través de la Retroalimentación.</strong> El fracaso a menudo se siente injusto cuando el aprendiz no entiende <em>por qué</em> fracasó. El sistema de retroalimentación de BEM debe proporcionar información clara sobre la causa del fracaso: "Tu algoritmo produjo la salida correcta pero usó demasiada memoria." Esto convierte el fracaso de un juicio misterioso en un problema solucionable. El aprendiz puede no conocer la solución aún, pero sabe en qué trabajar.</li>
					<li><strong>Diseñar para la Gestión de la Incertidumbre.</strong> El aprendizaje, como los juegos, es una máquina de incertidumbre. El aprendiz no sabe si su próximo intento tendrá éxito. Esta incertidumbre es lo que crea tensión y, en última instancia, satisfacción cuando se supera el desafío. Pero demasiada incertidumbre crea ansiedad, y muy poca crea aburrimiento. Los bucles de retroalimentación son el mecanismo a través del cual el sistema calibra la incertidumbre.</li>
				</ol>
				<p>Este último punto introduce el concepto de <strong>bucles de retroalimentación</strong> — la forma en que los resultados del sistema afectan su comportamiento futuro.</p>
				<p><strong>Los bucles de retroalimentación positiva</strong> amplifican la trayectoria actual. En un juego, un jugador que está ganando recibe potenciadores que lo hacen aún más fuerte, aumentando su probabilidad de éxito continuo. En educación, un estudiante que se desempeña bien puede recibir contenido avanzado y más atención, ampliando la brecha con los estudiantes de menor rendimiento. Los bucles de retroalimentación positiva crean ciclos virtuosos para los ganadores y ciclos viciosos para los perdedores. Aumentan la certeza para los de alto rendimiento y la disminuyen para los de bajo rendimiento. Por lo tanto, pueden llevar al aburrimiento (para los fuertes) o a la frustración (para los débiles).</p>
				<p><strong>Los bucles de retroalimentación negativa</strong> mitigan la trayectoria actual. En un juego, un jugador que está perdiendo puede recibir mecánicas de recuperación — efecto goma en juegos de carreras, mayores tasas de obtención de objetos raros, enemigos más fáciles. Estos mecanismos reducen la probabilidad de fracaso continuo y aumentan la probabilidad de recuperación. En educación, un bucle de retroalimentación negativa podría significar proporcionar apoyo adicional a los estudiantes con dificultades, ajustar la dificultad de la tarea para igualar la habilidad actual, o dar intentos extra.</p>
				<p>BEM prioriza el uso de <strong>bucles de retroalimentación negativa</strong> en entornos de aprendizaje. Esta es una elección de diseño contraintuitiva — la mayoría de los sistemas de gamificación se construyen sobre bucles positivos, recompensando el éxito con más recompensas. Pero los bucles positivos, en el aprendizaje, tienden a amplificar las disparidades existentes y reducir la incertidumbre productiva que impulsa el compromiso. Los bucles negativos, por el contrario, mantienen a todos los aprendices en la zona donde el desafío y la habilidad están equilibrados — las condiciones que Csikszentmihalyi llamó "flow."</p>
				<p>Un ejemplo concreto: en el programa de pensamiento computacional Biobots, los bucles de retroalimentación negativa se construyeron a través de mecánicas de colaboración. Los estudiantes que tenían dificultades recibieron más apoyo de sus compañeros que los de alto rendimiento. La frecuencia de errores se calibró para que los escenarios de nivel inferior produjeran menos oportunidades de fracaso, mientras que los escenarios avanzados aumentaban la dificultad progresivamente. El sistema no recompensaba el éxito con más éxito; equilibraba la experiencia para que todos los aprendices permanecieran comprometidos.</p>
				<p>El fracaso, en esta arquitectura, no es un error. Es una señal. El sistema lo utiliza para ajustar la dificultad, proporcionar apoyo y mantener la tensión entre desafío y habilidad. Y el aprendiz, con el tiempo, internaliza esta relación con el fracaso: no como algo que temer, sino como algo de lo que aprender.</p>
				{:else}
				<h2>14. Failure as a Learning Mechanism</h2>
				<p>Perhaps the most profound difference between games and education is their relationship with failure. In education, failure is a terminal event: you fail the test, you get a low grade, and that grade follows you. The message is implicit but clear: failure is something to be avoided at all costs. The result, paradoxically, is that students avoid the very challenges that would produce the most learning — because challenges create the risk of failure.</p>
				<p>In games, failure is woven into the fabric of the experience. A player of a difficult game will fail dozens, even hundreds of times before succeeding. But they do not experience these failures as judgments of their worth. They experience them as <strong>information</strong> — as data about what strategy did not work and what they should try next. The game does not punish failure; it makes failure <em>consequential</em> but not <em>final</em>.</p>
				<p>BEM brings this logic into learning design. The goal is not to eliminate failure — that is impossible and undesirable. The goal is to design failure so that it produces learning rather than demoralization.</p>
				<p>BEM proposes five principles for failure design:</p>
				<ol>
					<li><strong>Create a Safe Environment for Failure.</strong> The first requirement is that failure must not carry permanent or severe consequences. In game terms, this means avoiding "permadeath" — the educational equivalent of a single exam determining a final grade. Instead, failures should have small, recoverable stakes. The learner loses some progress, not all of it. The learner can retry without shame.</li>
					<li><strong>Distinguish Between Soft and Hard Failures.</strong> Soft failures are frequent, low-stakes mistakes: a wrong answer in a practice quiz, a suboptimal move in a simulation, a failed attempt that costs a small amount of progress. Soft failures create continuous feedback without threatening the learner's sense of competence. Hard failures are rarer and carry higher stakes: failing a major project, losing all accumulated progress in a level. Hard failures increase the emotional weight of the experience but must be used sparingly. Too many hard failures create frustration and abandonment; too many soft failures create boredom and lack of consequence.</li>
					<li><strong>Provide Empowerment After Failure.</strong> After a failure, the learner needs more than information — they need a path forward. This might take the form of hints, power-ups, adjusted difficulty, or narrative encouragement. The key is that the system does not abandon the learner after failure. It actively helps them recover. This is the opposite of educational practices that give a low grade and move on without support.</li>
					<li><strong>Reduce Uncertainty Through Feedback.</strong> Failure often feels unfair when the learner does not understand <em>why</em> they failed. BEM's feedback system should provide clear information about the cause of failure: "Your algorithm produced the correct output but used too much memory." This turns failure from a mysterious judgment into a solvable problem. The learner may not know the solution yet, but they know what to work on.</li>
					<li><strong>Design for Uncertainty Management.</strong> Learning, like games, is an uncertainty machine. The learner does not know whether their next attempt will succeed. This uncertainty is what creates tension and, ultimately, satisfaction when the challenge is overcome. But too much uncertainty creates anxiety, and too little creates boredom. Feedback loops are the mechanism through which the system calibrates uncertainty.</li>
				</ol>
				<p>This last point introduces the concept of <strong>feedback loops</strong> — the way the system's outcomes affect its future behavior.</p>
				<p><strong>Positive feedback loops</strong> amplify the current trajectory. In a game, a player who is winning receives power-ups that make them even stronger, increasing their chance of continued success. In education, a student who performs well may receive advanced content and more attention, widening the gap with lower-performing students. Positive feedback loops create virtuous cycles for winners and vicious cycles for losers. They increase certainty for strong performers and decrease it for weak performers. They can therefore lead to boredom (for the strong) or frustration (for the weak).</p>
				<p><strong>Negative feedback loops</strong> mitigate the current trajectory. In a game, a player who is losing may receive catch-up mechanics — rubber-banding in racing games, increased drop rates for rare items, easier enemies. These mechanisms reduce the chance of continued failure and increase the chance of recovery. In education, a negative feedback loop might mean providing additional support to struggling students, adjusting task difficulty to match current skill, or giving extra attempts.</p>
				<p>BEM prioritizes the use of <strong>negative feedback loops</strong> in learning environments. This is a counterintuitive design choice — most gamification systems are built on positive loops, rewarding success with more rewards. But positive loops, in learning, tend to amplify existing disparities and reduce the productive uncertainty that drives engagement. Negative loops, by contrast, keep all learners in the zone where challenge and skill are balanced — the conditions that Csikszentmihalyi called "flow."</p>
				<p>A concrete example: in the Biobots computational thinking program, negative feedback loops were built through collaboration mechanics. Students who struggled received more peer support than high performers. Error frequency was calibrated so that lower-level scenarios produced fewer failure opportunities, while advanced scenarios increased difficulty progressively. The system did not reward success with more success; it balanced the experience so that all learners remained engaged.</p>
				<p>Failure, in this architecture, is not a bug. It is a signal. The system uses it to adjust difficulty, provide support, and maintain the tension between challenge and skill. And the learner, over time, internalizes this relationship with failure: not as something to fear, but as something to learn from.</p>
				{/if}
			</section>

			{#if lang === 'es'}
			<!-- CHAPTER 15: El Poder de los Puntos en la Educación -->
			<section id="ch-points" bind:this={chapterEls['ch-points']}>
				<h2>15. El Poder de los Puntos en la Educación</h2>
				<p>A lo largo de este artículo, hemos tratado los puntos, las medallas y las tablas de líderes con escepticismo. Pero también hemos insistido en que no son inherentemente malos — son herramientas, y su valor depende completamente de las mecánicas que hay detrás de ellos. Este capítulo examina los puntos específicamente: qué son, qué pueden hacer y cómo diseñarlos para que sirvan al aprendizaje en lugar de socavarlo. Ah, sí, y por qué las medallas son solo otra forma de puntos.</p>
				<p>La postura de BEM sobre los puntos es clara: <strong>los puntos no son recompensas</strong>. Son la gramática del sistema. No son accesorios motivacionales añadidos al final de un proceso para calificar el rendimiento; son herramientas de modelado de la realidad que definen cómo se interpretan los estados, recursos, habilidades y el progreso. Los puntos transforman decisiones en acciones con consecuencias visibles dentro del sistema. Cuando un estudiante gana puntos, no está siendo sobornado — está leyendo el estado del sistema.</p>
				<p>Esta distinción es crítica. Si los puntos son recompensas, entonces el estudiante trabaja por los puntos, no por el aprendizaje. Si los puntos son información, entonces el estudiante trabaja por el aprendizaje, y los puntos son la lectura de ese trabajo.</p>
				<h3>Nomenclatura Semántica: Los Puntos Deben Significar Algo</h3>
				<p>La primera regla del diseño de puntos de BEM es la <strong>nomenclatura semántica</strong>.</p>
				<p>¿Qué son los puntos? No son solo un número: son el uso combinado de un número, un nombre y, a veces, un icono. Piensa en una moneda de oro... ahora piensa en cien monedas de oro. Son icónicos, tienen un nombre y una cantidad. Cuando dices puntos de destreza, el nombre y el icono, si lo hay, sirven como ancla de significado para el número, lo que les da sentido. Y tener 3 medallas de excelencia es exactamente eso, ¡un tipo de punto! Las medallas son realmente solo una submecánica de los puntos que pone énfasis en el emblema.</p>
				<p>Probablemente por eso dar "15 puntos" es la retroalimentación más común y, sin embargo, la más insignificante posible. Los puntos nunca deberían llamarse simplemente "puntos".</p>
				<p>La palabra "punto", usada como nombre para un punto, proviene de esquemas de marketing (incluso los deportes nunca usan la palabra puntos). Los programas de fidelización, por ejemplo, usan este nombre a menudo para un tipo de token canjeable. Algunos juegos usan la palabra puntos solos, pero la mayoría prefiere "puntuación", o usa puntos como apellido: "puntos de salud". Es por esto que la P en PBL tiene mala reputación — funcionan como recompensas de programas de fidelización y no como mecanismos de retroalimentación significativos.</p>
				<p>Por lo tanto, los puntos deben tener un nombre significativo alineado con el concepto que modelan. "Has ganado 10 Puntos de Análisis Crítico" comunica algo fundamentalmente diferente de "Has ganado 10 puntos". El nombre conecta la acción con el significado. Le dice al estudiante <em>qué</em> acaba de demostrar, no solo <em>cuánto</em>. Y si el icono del punto de análisis crítico es un cerebro, entonces el concepto se refuerza aún más.</p>
				<p>La nomenclatura semántica operacionaliza la dimensión cognitiva de la retroalimentación. Cuando un estudiante ve "Análisis +5", su Sistema 2 tiene algo con lo que trabajar: puede inferir que se requería análisis, que lo demostró y que el sistema lo reconoce como una habilidad distinta. "Puntos +5" no comunica nada más que cantidad — y cantidad sin calidad es ruido.</p>
				<h3>Puntajes (points) vs. Puntuaciones (scores): Dos Funciones Diferentes</h3>
				<p>BEM traza una distinción clara entre <strong>Puntajes (points)</strong> y <strong>Puntuaciones (scores)</strong>, una distinción que la mayoría de los sistemas de gamificación eliminan:</p>
				<ul>
					<li><strong>Puntajes (points)</strong> tienen un rol transaccional. Se gastan, intercambian o usan para desbloquear contenido. Los Puntajes son la moneda del sistema — controlan el flujo y permiten decisiones. Como se consumen, crean elecciones significativas: "¿Gasto mis Puntos de Análisis para desbloquear el módulo avanzado, o los guardo para la rama de especialización?"</li>
					<li><strong>Puntuaciones (scores)</strong> tienen un rol informativo. Miden rendimiento, estado o progreso, pero no activan mecánicas directamente. Una Puntuación de velocidad, una calificación de calidad, un porcentaje de finalización — estos le dicen al estudiante dónde está sin forzar una decisión. Las Puntuaciones (scores) son el tablero; los Puntajes (points) son el motor.</li>
				</ul>
				<p>Esta es una distinción de cómo se denominan a menudo en el diseño de juegos, y nos ayudará a categorizar mejor la gama más amplia de tipos de puntajes.</p>
				<h3>Puntos como Mecánicas de Incentivos</h3>
				<p>Los puntos, las puntuaciones y las medallas no son números aislados. Están gobernados por <strong>algoritmos y reglas</strong> — las mecánicas que determinan cómo se ganan, pierden, calculan y muestran. Estas mecánicas no son neutrales. Llevan una filosofía. Moldean el comportamiento de maneras que el diseñador puede no anticipar, y pueden apoyar o socavar los objetivos motivacionales del sistema.</p>
				<p>Considera la mecánica de puntos más común en educación: el <strong>promedio de calificaciones</strong>. La nota final de un estudiante es la media aritmética de todas sus evaluaciones a lo largo de un período. A primera vista, parece justo — agrega el rendimiento. Pero mira más de cerca. El promedio tiene una propiedad mecánica específica: <strong>castiga los errores pasados permanentemente</strong>. Una mala puntuación en un examen en la primera semana arrastra el promedio durante todo el período, sin importar cuánto mejore el estudiante. El estudiante que falla el primer examen y luego domina todos los siguientes aún no puede alcanzar la nota más alta posible. Solo hay recuperación parcial.</p>
				<p>Esto no es un error. Es una decisión de diseño que revela una filosofía subyacente: la educación se trata de clasificar y juzgar, no de crecimiento y recuperación. La mecánica del promedio trata el fracaso temprano como una mancha permanente. Le comunica al estudiante: "Tu error te seguirá." Incentiva ir a lo seguro, nunca tomar riesgos, nunca intentar desafíos que puedan llevar al fracaso. Es, en esencia, una mecánica diseñada para producir ansiedad y aversión al riesgo.</p>
				<p>La alternativa de BEM es usar mecánicas que <strong>permitan la recuperación total</strong>. Puntos de experiencia (XP) que solo se acumulan y nunca disminuyen. Puntuaciones de rendimiento que siguen líneas de tendencia en lugar de promedios estáticos. Puntuaciones de resistencia que replantean el conteo de fracasos como una medida de persistencia. Estas mecánicas llevan una filosofía diferente: los errores son parte del viaje, y el sistema está diseñado para ayudar al estudiante a crecer, no para juzgarlo por dónde empezó.</p>
				<p>El mismo principio se aplica a las <strong>tablas de líderes</strong>. Una tabla de líderes sin filtrar ordenada por rendimiento total es una de las mecánicas más destructivas en educación. Les dice a los estudiantes con peor rendimiento exactamente lo lejos que están, sin un camino a seguir. Les dice a los estudiantes con mejor rendimiento que pueden relajarse. Crea una jerarquía fija y pública que desalienta el esfuerzo de quienes más lo necesitan e infla la complacencia en quienes menos lo necesitan.</p>
				<p>La postura de BEM sobre las tablas de líderes es restrictiva: <strong>no las uses a menos que puedas implementar un emparejamiento adecuado, ligas y competición por niveles</strong>. Una tabla de líderes que enfrenta a un novato contra un experto no es una competición — es una humillación pública. Una tabla de líderes que agrupa a los estudiantes por nivel de habilidad, rota regularmente y se reinicia periódicamente puede crear competición amistosa. Pero la mayoría de los educadores carecen de las habilidades de diseño para implementar estas mecánicas avanzadas, y una tabla de líderes mal diseñada hace más daño que bien.</p>
				<p>Si se usan tablas de líderes, nunca deben vincularse directamente a la habilidad o el rendimiento. Pueden vincularse a indicadores lúdicos — solución más creativa, mayor mejora, revisiones entre pares más útiles — que creen competición amistosa sin castigar a los de bajo rendimiento. En el momento en que una tabla de líderes se convierte en un ranking de quién es "mejor" en la materia, se ha convertido en una herramienta de intimidación, no de motivación.</p>
				<p>La idea clave es que <strong>los puntos y las calificaciones nunca deben equipararse</strong>. Si los puntos del juego se convierten en calificaciones, el juego se convierte en una extensión del sistema evaluativo, y el estudiante lo temerá de la misma manera que teme un examen final. El espacio seguro que crean los juegos — donde el fracaso es información, no juicio — se desmorona. Los profesores que quieran usar puntos en sus aulas deben mantener la economía de puntos separada de la economía de calificaciones. Los puntos deberían desbloquear contenido narrativo, opciones de personalización o recompensas lúdicas, no determinar el promedio de calificaciones del estudiante.</p>
				<p>Es por esto que BEM insiste en que las reglas que gobiernan los puntos son tan importantes como los puntos mismos. Una mala mecánica puede convertir el sistema de puntos más elegante en una fuente de ansiedad. Una buena mecánica puede convertir un número simple en una herramienta de crecimiento. El trabajo del diseñador no es solo elegir qué medir, sino diseñar <em>cómo</em> funciona la medición — y asegurar que las mecánicas reflejen la filosofía del aprendizaje, no la filosofía del juicio.</p>
				<h3>Puntos Multi-Entidad</h3>
				<p>Una de las contribuciones más distintivas de BEM es la idea de que los puntos no pertenecen solo a las personas. Los puntos pueden asignarse a <strong>objetos</strong> (un servidor con 3 puntos de estabilidad), a <strong>problemas</strong> (un error de dificultad 5 con 3 puntos de resistencia a parches), o al <strong>entorno</strong> (una sala de reuniones con 8 puntos de armonía acústica). Este enfoque multi-entidad expande el espacio de diseño dramáticamente: el sistema de aprendizaje ahora puede modelar no solo el progreso del estudiante, sino el estado de todo el entorno de aprendizaje. Un desafío que "pierde puntos de integridad" a medida que pasa el tiempo crea urgencia a través del estado del problema, no a través de la presión sobre el estudiante.</p>
				<h3>La Taxonomía de Puntos de BEM por Alineación de Impulsores</h3>
				<p>BEM organiza los tipos de puntos por el impulsor motivacional que activan. La taxonomía completa incluye dieciocho tipos, cada uno con reglas de diseño específicas. Estos se explican con más detalle como un submarco de BEM, pero aquí hay un breve resumen:</p>
				<p><strong>Impulsores de Maestría y Progreso</strong> usan Puntos de Experiencia (XP — nunca se pierden, acumulativos, curvos), Puntuaciones de Rendimiento (informativas, longitudinales, basadas en tendencias), Puntuaciones de Habilidad (multidimensionales, separando consistencia de velocidad de síntesis), Puntuaciones de Logro (marcadores de hitos, nunca para tareas triviales) y Puntuaciones de Resistencia (replanteando el conteo de fracasos como medición de persistencia).</p>
				<p><strong>Impulsores de Eficiencia y Productividad</strong> usan Puntos de Moneda (transaccionables, crean economías internas), Puntos de Tiempo (tiempo como recurso activo, calibrar cuidadosamente para evitar ansiedad) y Puntuaciones de Tiempo (registro de velocidad pasivo, comparación intrapersonal).</p>
				<p><strong>Impulsores de Descubrimiento y Creatividad</strong> usan Puntos de Apuesta (modelan metacognición a través del riesgo — el estudiante apuesta sobre su confianza), Puntuaciones de Exploración (miden cobertura y descubrimiento no lineal, permiten finalización superior al 100%), Puntos de Desbloqueo (basados en umbrales, añaden complejidad sin penalización) y Puntuaciones de Enfoque (atraen atención a elementos críticos).</p>
				<p><strong>Impulsores de Empoderamiento y Control</strong> usan Puntos de Recurso (limitan capacidad para forzar decisiones estratégicas), Puntos de Habilidad (modelan capacidades del avatar o herramienta como parámetros) y Puntos de Obstáculo (introducen tensión a través de la evitación, siempre con caminos de recuperación, nunca con juego permanente terminado).</p>
				<p><strong>Impulsores de Relación e Identidad</strong> usan Puntuaciones Sociales (capturan juicios de pares — votos, likes, evaluaciones), Puntuaciones de Belleza (capturan elegancia y armonía cualitativas) y Puntuaciones de Datos (estadísticas opcionales para reflexión personal).</p>
				<p>Cada uno de estos tipos sirve una función diferente y activa una vía motivacional diferente. La tarea del diseñador no es usarlos todos, sino elegir los tipos que se alineen con los objetivos de aprendizaje y los impulsores que el sistema pretende apoyar.</p>
				<h3>Los Puntos No Son el Punto</h3>
				<p>La lección de diseño más importante sobre los puntos es que nunca son el punto. Los puntos son un lenguaje para hacer visible lo invisible. No crean motivación por sí solos — crean <em>claridad</em>. Un estudiante que puede ver su progreso, su desglose de habilidades, su persistencia y sus elecciones es un estudiante que puede autorregularse. Un estudiante que solo ve un número es un estudiante que perseguirá el número.</p>
				<p>Es por esto que BEM insiste en los puntos como gramática, no como premios. La gramática no motiva — permite la expresión. Un sistema de puntos bien diseñado no hace que aprender sea divertido. Hace que aprender sea <em>legible</em>. Y la legibilidad, a largo plazo, es más poderosa que la diversión.</p>
			</section>
			{:else}
			<!-- CHAPTER 15: The Power of Points in Education -->
			<section id="ch-points" bind:this={chapterEls['ch-points']}>
				<h2>15. The Power of Points in Education</h2>
				<p>Throughout this article, we have treated points, badges, and leaderboards with suspicion. But we have also insisted that these are not inherently bad — they are tools, and their value depends entirely on the mechanics behind them. This chapter examines points specifically: what they are, what they can do, and how to design them so that they serve learning rather than undermining it. Oh yes, and why badges are just another form of points.</p>
				<p>BEM's position on points is clear: <strong>points are not rewards</strong>. They are the grammar of the system. They are not motivational accessories added at the end of a process to grade performance; they are reality-modeling tools that define how states, resources, skills, and progress are interpreted. Points transform decisions into actions with visible consequences within the system. When a learner earns points, they are not being bribed — they are reading the system's state.</p>
				<p>This distinction is critical. If points are rewards, then the learner works for the points, not for the learning. If points are information, then the learner works for the learning, and the points are the reading of that work.</p>
				<h3>Semantic Naming: Points Must Mean Something</h3>
				<p>The first rule of BEM point design is <strong>semantic naming</strong>.</p>
				<p>What are points? They are not just a number: they are the combined use of a number, a name and, sometimes, an icon. Think of a gold coin... now think of a hundred gold coins. They are iconic, have a name and a quantity. When you say dexterity points, the name and icon, if any, serves as an anchor of meaning for the number, which gives them meaning. And having 3 badges of excellency is exactly that, a type of point! Badges are really just a sub-mechanic of points that puts emphasis on the insignia.</p>
				<p>That is probably why giving "15 points" is the most common, and yet the most meaningless, feedback possible. Points should never be called simply "points."</p>
				<p>The word "point", used as the name for a point, comes from marketing schemes (even sports never use the word points). Loyalty programs, for example, use this name often for a type of redeemable token. Some games do use the word points alone, but most of them prefer "score", or use points as a surname: "health points". This is why the P in PBLs have a bad rep — they work as loyalty scheme rewards and not as meaningful feedback mechanisms.</p>
				<p>So, points must have a meaningful name aligned with the concept they model. "You earned 10 Critical Analysis Points" communicates something fundamentally different from "You earned 10 points." The name connects the action to the meaning. It tells the learner <em>what</em> they just demonstrated, not just <em>how much</em>. And if the critical analysis point icon is a brain, then the concept is further reinforced.</p>
				<p>Semantic naming operationalizes the cognitive dimension of feedback. When a learner sees "Analysis +5," their System 2 has something to work with: they can infer that analysis was required, that they demonstrated it, and that the system recognizes it as a distinct skill. "Points +5" communicates nothing but quantity — and quantity without quality is noise.</p>
				<h3>Points vs. Scores: Two Different Functions</h3>
				<p>BEM draws a sharp distinction between <strong>points</strong> and <strong>scores</strong>, a distinction that most gamification systems collapse:</p>
				<ul>
					<li><strong>Points</strong> have a transactional role. They are spent, traded, or used to unlock content. Points are the currency of the system — they control flow and enable decisions. Because they are consumed, they create meaningful choices: "Do I spend my Analysis Points to unlock the advanced module, or do I save them for the specialization track?"</li>
					<li><strong>Scores</strong> have an informational role. They measure performance, state, or progress, but they do not activate mechanics directly. A speed score, a quality rating, a completion percentage — these tell the learner where they stand without forcing a decision. Scores are the dashboard; points are the engine.</li>
				</ul>
				<p>This is a distinction of how they are often called in game design, and will better help us categorize the broader range of point types.</p>
				<h3>Points as Mechanics for Incentives</h3>
				<p>Points, scores, and badges are not isolated numbers. They are governed by <strong>algorithms and rules</strong> — the mechanics that determine how they are earned, lost, calculated, and displayed. These mechanics are not neutral. They carry a philosophy. They shape behavior in ways that the designer may not anticipate, and they can either support or undermine the motivational goals of the system.</p>
				<p>Consider the most common point mechanic in education: the <strong>grade average</strong>. A student's final grade is the arithmetic mean of all their assessments across a term. At first glance, this seems fair — it aggregates performance. But look closer. The average has a specific mechanical property: <strong>it punishes past mistakes permanently</strong>. A poor exam score in the first week drags down the average for the entire term, regardless of how much the student improves. The student who bombs the first test and then masters every subsequent one still cannot achieve the highest possible grade. There is only partial recovery.</p>
				<p>This is not a bug. It is a design choice that reveals an underlying philosophy: education is about sorting and judging, not about growth and recovery. The average mechanic treats early failure as a permanent stain. It communicates to the student: "Your mistake will follow you." It incentivizes playing it safe, never taking risks, never attempting challenges that might lead to failure. It is, in essence, a mechanic designed to produce anxiety and risk aversion.</p>
				<p>BEM's alternative is to use mechanics that <strong>allow full recovery</strong>. Experience points (XP) that only accumulate and never decrease. Performance scores that track trend lines rather than static averages. Endurance scores that reframe failure count as a measure of persistence. These mechanics carry a different philosophy: mistakes are part of the journey, and the system is designed to help the learner grow, not to judge them for where they started.</p>
				<p>The same principle applies to <strong>leaderboards</strong>. A raw leaderboard sorted by total performance is one of the most destructive mechanics in education. It tells the lowest-performing students exactly how far behind they are, with no path forward. It tells the highest-performing students that they can coast. It creates a fixed, public hierarchy that discourages effort from those who need it most and inflates complacency in those who need it least.</p>
				<p>BEM's position on leaderboards is restrictive: <strong>do not use them unless you can implement proper matchmaking, leagues, and tiered competition</strong>. A leaderboard that matches a novice against an expert is not a competition — it is a public shaming. A leaderboard that groups learners by skill level, rotates regularly, and resets periodically can create friendly competition. But most educators lack the design skills to implement these advanced mechanics, and a poorly designed leaderboard does more harm than good.</p>
				<p>If leaderboards are used, they must never be tied to skill or performance directly. They can be tied to playful indicators — most creative solution, most improved, most helpful peer reviews — that create friendly competition without punishing low performers. The moment a leaderboard becomes a ranking of who is "better" at the subject, it has become a tool of intimidation, not motivation.</p>
				<p>The key insight is that <strong>points and grades must never be equated</strong>. If game points become grades, the game becomes an extension of the evaluative system, and the learner will fear it the same way they fear a final exam. The safe space that games create — where failure is information, not judgment — collapses. Teachers who want to use points in their classrooms must keep the point economy separate from the grading economy. Points should unlock narrative content, customization options, or playful rewards, not determine the student's GPA.</p>
				<p>This is why BEM insists that the rules governing points are as important as the points themselves. A bad mechanic can turn the most elegant point system into a source of anxiety. A good mechanic can turn a simple number into a tool for growth. The designer's job is not just to choose what to measure, but to design <em>how</em> the measurement works — and to ensure that the mechanics reflect the philosophy of learning, not the philosophy of judgment.</p>
				<h3>Multi-Entity Points</h3>
				<p>One of BEM's most distinctive contributions is the idea that points do not belong only to people. Points can be assigned to <strong>objects</strong> (a server with 3 stability points), to <strong>problems</strong> (a bug of difficulty 5 with 3 patch-resistance points), or to the <strong>environment</strong> (a meeting room with 8 acoustic harmony points). This multi-entity approach expands the design space dramatically: the learning system can now model not just learner progress, but the state of the entire learning environment. A challenge that "loses integrity points" as time passes creates urgency through the state of the problem, not through pressure on the learner.</p>
				<h3>The BEM Points Taxonomy by Driver Alignment</h3>
				<p>BEM organizes point types by the motivational driver they activate. The full taxonomy includes eighteen types, each with specific design rules. These are explained in more detail as a subframework of BEM, but here is a brief summary:</p>
				<p><strong>Mastery & Progress drivers</strong> use Experience Points (XP — never lost, cumulative, curved), Performance Scores (informational, longitudinal, trend-based), Skill Scores (multidimensional, separating consistency from speed from synthesis), Achievement Scores (milestone markers, never for trivial tasks), and Endurance Scores (reframing failure count as persistence measurement).</p>
				<p><strong>Efficiency & Productivity drivers</strong> use Currency Points (transactable, create internal economies), Time Points (time as active resource, calibrate carefully to avoid anxiety), and Time Scores (passive speed recording, intrapersonal comparison).</p>
				<p><strong>Discovery & Creativity drivers</strong> use Bet Points (model metacognition through risk — the learner bets on their confidence), Exploration Scores (measure coverage and non-linear discovery, allow over-100% completion), Unlock Points (threshold-based, add complexity without penalty), and Focus Scores (attract attention to critical elements).</p>
				<p><strong>Empowerment & Control drivers</strong> use Resource Points (limit capacity to force strategic decisions), Skill Points (model avatar or tool capabilities as parameters), and Hindrance Points (introduce tension through avoidance, always with recovery paths, never with permanent game over).</p>
				<p><strong>Relatedness & Identity drivers</strong> use Social Scores (capture peer judgments — votes, likes, evaluations), Beauty Scores (capture qualitative elegance and harmony), and Data Scores (optional statistics for personal reflection).</p>
				<p>Each of these types serves a different function and activates a different motivational pathway. The designer's task is not to use all of them, but to choose the types that align with the learning objectives and the drivers that the system aims to support.</p>
				<h3>Points Are Not the Point</h3>
				<p>The most important design lesson about points is that they are never the point. Points are a language for making the invisible visible. They do not create motivation on their own — they create <em>clarity</em>. A learner who can see their progress, their skill breakdown, their persistence, and their choices is a learner who can self-regulate. A learner who sees only a number is a learner who will chase the number.</p>
				<p>This is why BEM insists on points as grammar, not as prizes. Grammar does not motivate — it enables expression. A well-designed point system does not make learning fun. It makes learning <em>legible</em>. And legibility, in the long run, is more powerful than fun.</p>
			</section>
			{/if}

			{#if lang === 'es'}
			<!-- CHAPTER 16: Actualización de Metas y el Nuevo Ciclo -->
			<section id="ch-update" bind:this={chapterEls['ch-update']}>
				<h2>16. Actualización de Metas y el Nuevo Ciclo</h2>
				<p>El Ciclo de Aprendizaje Interactivo describe cuatro fases: Meta y Estado del Sistema, Llamada a la Acción, Evaluación Cognitiva y Acción, y Evaluación del Sistema y Retroalimentación. Pero este modelo, tal como se ha presentado hasta ahora, podría sugerir que el ciclo termina donde comenzó — que el estudiante regresa al mismo estado, listo para empezar de nuevo. Esto es engañoso. <strong>La meta nunca es la misma después de un ciclo completado.</strong></p>
				<p>Cada ciclo de retroalimentación cambia el sistema. El estudiante ha recibido nueva información. Su posición ha cambiado. Un desafío ha sido superado o un fracaso ha sido registrado. El estado del entorno — puntos, contenido desbloqueado, progreso narrativo, opciones disponibles — se ha actualizado. El propio estudiante puede haber cambiado: una nueva habilidad adquirida, una nueva estrategia considerada, una nueva pregunta formulada. Volver a la misma meta después de todo esto sería ignorar la naturaleza fundamental de los sistemas interactivos: son dinámicos, y cada interacción los transforma.</p>
				<h3>Cómo la Retroalimentación Actualiza la Interfaz</h3>
				<p>El efecto más visible de un ciclo completado es la actualización de la interfaz del sistema. Una barra de progreso avanza. Una nueva opción aparece. Una insignia es otorgada. Una puntuación cambia. Estos no son decorativos — son la declaración del sistema de que el estado ha cambiado y, por lo tanto, el conjunto de acciones posibles ha cambiado.</p>
				<p>En diseño de juegos, esto se llama <strong>transición de estado</strong>: el movimiento de una configuración del mundo del juego a otra. Una puerta que se desbloquea después de un rompecabezas es una transición de estado. Una nueva área que se vuelve accesible después de derrotar a un jefe es una transición de estado. La interfaz no solo reporta la transición — <em>es</em> la transición. El estudiante ve el nuevo estado e inmediatamente comienza a formar nuevas metas basadas en él.</p>
				<h3>Cómo la Retroalimentación Crea Nuevas Metas</h3>
				<p>La interfaz actualizada hace más que informar — invita. Un nuevo módulo desbloqueado no es solo una marca en una lista; es una nueva Llamada a la Acción. El estudiante ahora pregunta: "¿Entro en este módulo ahora? ¿O termino primero el actual?" Una puntuación de rendimiento que muestra 7/10 no es solo un número; es una brecha entre el estado actual y el estado deseado. El estudiante ahora pregunta: "¿Cómo paso de 7 a 10?"</p>
				<p>Este es el mecanismo mediante el cual la retroalimentación genera nuevas metas. Cada evaluación produce no solo un resultado, sino un <strong>diferencial</strong>: la distancia entre dónde está el estudiante y dónde podría estar. Ese diferencial es la semilla de una nueva meta. Puede ser una micrometa (corregir el error en este ejercicio específico), una mesometa (mejorar la puntuación de rendimiento en esta dimensión de habilidad) o una macrometa (alcanzar el próximo hito narrativo).</p>
				<h3>Tres Tipos de Actualización de Metas</h3>
				<p>BEM distingue tres tipos de actualizaciones de metas que ocurren después de un ciclo de retroalimentación:</p>
				<p><strong>1. Metas correctivas</strong> surgen del fracaso o del rendimiento subóptimo. El estudiante debe reintentar, revisar o reparar. Estas metas suelen ser a corto plazo y concretas: "Corrige el error de sintaxis en la línea 23", "Vuelve a enviar el ensayo con una estructura argumental mejorada". Las metas correctivas están impulsadas por la brecha entre el rendimiento real y el esperado.</p>
				<p><strong>2. Metas progresivas</strong> surgen del éxito. El estudiante ha superado un umbral y el sistema revela el siguiente paso. Estas metas miran hacia adelante: "Entra al siguiente nivel", "Comienza el módulo avanzado", "Aplica esta habilidad a un nuevo contexto". Las metas progresivas están impulsadas por la estructura que se despliega del sistema.</p>
				<p><strong>3. Metas de cambio</strong> surgen de la elección. El estudiante, al recibir retroalimentación, puede decidir cambiar el enfoque. Una meta secundaria que antes se ignoraba ahora parece más atractiva. Un impulsor diferente se activa. El estudiante elige un camino diferente. Las metas de cambio están impulsadas por la autonomía y la diversidad motivacional — son el mecanismo mediante el cual el mismo sistema puede servir a diferentes estudiantes de manera diferente.</p>
				<h3>Mover los Puestos de la Meta</h3>
				<p>La frase "mover los puestos de la meta" generalmente conlleva una connotación negativa — sugiere injusticia, un objetivo que se desplaza para asegurar el fracaso. Pero en los sistemas de aprendizaje bien diseñados, mover los puestos de la meta es exactamente lo correcto, porque <strong>el estudiante no es la misma persona que comenzó el viaje</strong>.</p>
				<p>Un novato que no podía escribir una sola línea de código ahora depura con confianza. Las metas que eran apropiadas para ese novato serían triviales para la persona en la que se han convertido. Si los puestos de la meta no se mueven, el estudiante supera al sistema. Si se mueven demasiado rápido, el estudiante se siente abrumado. El arte está en la calibración: el sistema debe presentar metas que estén siempre un poco más allá del alcance actual del estudiante, pero nunca fuera de su alcance.</p>
				<p>Esta es la esencia de la Zona de Desarrollo Próximo de Vygotsky, operacionalizada a través de actualizaciones de metas impulsadas por la retroalimentación. Cada ciclo completado eleva el suelo. Cada nueva meta se construye sobre la anterior. El estudiante no está corriendo en una cinta — está subiendo una escalera donde cada escalón revela una nueva vista y un nuevo destino.</p>
			</section>
			{:else}
			<!-- CHAPTER 16: Updating Goals and the New Loop -->
			<section id="ch-update" bind:this={chapterEls['ch-update']}>
				<h2>16. Updating Goals and the New Loop</h2>
				<p>The Interactive Learning Cycle describes four phases: Goal and System State, Call to Action, Cognitive Evaluation and Action, and System Evaluation and Feedback. But this model, as presented so far, might suggest that the cycle ends where it began — that the learner returns to the same state, ready to begin again. This is misleading. <strong>The goal is never the same after a completed loop.</strong></p>
				<p>Every feedback cycle changes the system. The learner has received new information. Their position has shifted. A challenge has been overcome or a failure has been registered. The state of the environment — points, unlocked content, narrative progress, available choices — has been updated. The learner themselves may have changed: a new skill acquired, a new strategy considered, a new question formed. To return to the same goal after all of this would be to ignore the fundamental nature of interactive systems: they are dynamic, and every interaction transforms them.</p>
				<h3>How Feedback Updates the Interface</h3>
				<p>The most visible effect of a completed cycle is the update to the system's interface. A progress bar advances. A new option appears. A badge is awarded. A score changes. These are not decorative — they are the system's declaration that the state has changed, and therefore the set of possible actions has changed.</p>
				<p>In game design, this is called <strong>state transition</strong>: the movement from one configuration of the game world to another. A door that unlocks after a puzzle is a state transition. A new area that becomes accessible after a boss is defeated is a state transition. The interface does not just report the transition — it <em>is</em> the transition. The learner sees the new state and immediately begins to form new goals based on it.</p>
				<h3>How Feedback Creates New Goals</h3>
				<p>The updated interface does more than inform — it invites. A new unlocked module is not just a checkmark on a list; it is a new Call to Action. The learner now asks: "Should I enter this module now? Or should I finish the current one first?" A performance score that reads 7/10 is not just a number; it is a gap between current state and desired state. The learner now asks: "How do I get from 7 to 10?"</p>
				<p>This is the mechanism through which feedback generates new goals. Every evaluation produces not just a result, but a <strong>differential</strong>: the distance between where the learner is and where they could be. That differential is the seed of a new goal. It may be a micro-goal (correct the error in this specific exercise), a meso-goal (improve the performance score on this skill dimension), or a macro-goal (reach the next narrative milestone).</p>
				<h3>Three Kinds of Goal Updates</h3>
				<p>BEM distinguishes three types of goal updates that occur after a feedback cycle:</p>
				<p><strong>1. Corrective goals</strong> emerge from failure or suboptimal performance. The learner must retry, revise, or repair. These goals are usually short-term and concrete: "Fix the syntax error in line 23," "Re-submit the essay with improved argument structure." Corrective goals are driven by the gap between actual and expected performance.</p>
				<p><strong>2. Progressive goals</strong> emerge from success. The learner has cleared a threshold and the system reveals the next step. These goals are forward-looking: "Enter the next level," "Begin the advanced module," "Apply this skill to a new context." Progressive goals are driven by the system's unfolding structure.</p>
				<p><strong>3. Shift goals</strong> emerge from choice. The learner, having received feedback, may decide to change focus. A secondary goal that was previously ignored now seems more appealing. A different driver becomes activated. The learner chooses a different path. Shift goals are driven by autonomy and motivational diversity — they are the mechanism through which the same system can serve different learners differently.</p>
				<h3>Moving the Goal Posts</h3>
				<p>The phrase "moving the goal posts" usually carries a negative connotation — it suggests unfairness, a target that shifts to ensure failure. But in well-designed learning systems, moving the goal posts is exactly the right thing to do, because <strong>the learner is not the same person who started the journey</strong>.</p>
				<p>A novice who could not write a single line of code now debugs with confidence. The goals that were appropriate for that novice would be trivial for the person they have become. If the goal posts do not move, the learner outgrows the system. If they move too fast, the learner feels overwhelmed. The art is in the calibration: the system must present goals that are always just beyond the learner's current reach, but never beyond their grasp.</p>
				<p>This is the essence of Vygotsky's Zone of Proximal Development, operationalized through feedback-driven goal updates. Each completed cycle raises the floor. Each new goal is built on the last. The learner is not running on a treadmill — they are climbing a staircase where each step reveals a new view and a new destination.</p>
			</section>
			{/if}

			{#if lang === 'es'}
			<!-- CHAPTER 17: Ciclos de Progresión -->
			<section id="ch-cycles" bind:this={chapterEls['ch-cycles']}>
				<h2>17. Ciclos de Progresión</h2>
				<p>Si el capítulo anterior estableció que las metas cambian después de cada ciclo, este capítulo aborda una pregunta más profunda: ¿qué sucede cuando múltiples ciclos se ejecutan al mismo tiempo? Porque en cualquier sistema atractivo — juego o entorno de aprendizaje — nunca hay solo una meta activa.</p>
				<h3>La Naturaleza Multi-Meta del Compromiso</h3>
				<p>Los juegos no le dan al jugador un único objetivo y esperan a que se complete. En cualquier momento, un jugador en un juego de rol podría estar: avanzando hacia una meta narrativa lejana (derrotar al jefe final), completando una misión actual (rescatar al mercader), gestionando un recurso (mantener la salud por encima del 50%), explorando un área secundaria (descubrir tres santuarios ocultos), mejorando una habilidad (subir de nivel herrería) y manteniendo una obligación social (regresar al gremio por una recompensa). Cada uno de estos es una meta con su propio ciclo de retroalimentación, su propia línea de tiempo, su propia alineación de impulsores.</p>
				<p>¿Por qué los juegos superponen metas de esta manera? Porque <strong>el compromiso no es un hilo único — es un tejido</strong>. Una sola meta crea enfoque pero también fragilidad: si el estudiante falla esa meta, no hay nada más que mantenga su atención. Múltiples metas crean resiliencia: si un camino está bloqueado, otro permanece abierto. Si un tipo de retroalimentación se vuelve repetitivo, otro canal proporciona novedad. El tejido de metas mantiene al estudiante orientado incluso cuando los hilos individuales se rompen.</p>
				<p>BEM aplica esta lógica a través del <strong>sistema de metas secundarias</strong>. Las metas secundarias no son complementos opcionales — son el mecanismo estructural que transforma una progresión lineal en una experiencia multihebra. Mientras que la meta principal proporciona dirección y estructura, las metas secundarias proporcionan profundidad, autonomía y diversidad motivacional. Un estudiante que persigue una meta principal y dos o tres metas secundarias está operando en un espacio de metas rico donde el progreso ocurre en múltiples frentes simultáneamente.</p>
				<h3>Los Engranajes de la Progresión</h3>
				<p>Imagina un sistema con tres ciclos concurrentes:</p>
				<ul>
					<li><strong>Ciclo A</strong>: Un bucle correctivo corto — el estudiante está corrigiendo un error específico en su código. Este ciclo podría completarse en segundos o minutos. Cada intento genera retroalimentación inmediata.</li>
					<li><strong>Ciclo B</strong>: Un bucle de rendimiento medio — el estudiante está trabajando hacia una puntuación de precisión del 90% en el módulo actual. Este ciclo abarca múltiples ejercicios a lo largo de una sesión. La retroalimentación llega como promedios continuos y líneas de tendencia.</li>
					<li><strong>Ciclo C</strong>: Un bucle de identidad largo — el estudiante está progresando hacia un hito narrativo: convertirse en "Analista Senior". Este ciclo abarca semanas. La retroalimentación llega a través de subidas de nivel, contenido desbloqueado y eventos narrativos.</li>
				</ul>
				<p>Estos ciclos no son secuenciales — están <strong>anidados</strong>. Los microbucles alimentan a los mesobucles, que alimentan a los macroluces. Cada error corregido (Ciclo A) contribuye a la puntuación de precisión (Ciclo B), que contribuye al ascenso (Ciclo C). El estudiante experimenta progreso en múltiples escalas de tiempo simultáneamente, que es exactamente cómo los juegos mantienen el compromiso entre sesiones.</p>
				<p>Esta estructura anidada es por lo que el capítulo de BEM sobre metas distinguió entre metas de estado y metas de acción, entre niveles narrativo, principal y secundario. Cada nivel opera a una escala de tiempo diferente. Cada nivel tiene su propia cadencia de retroalimentación. Cada nivel sirve una función diferente en la arquitectura general del compromiso.</p>
				<h3>El Problema de la Industrialización: Tiempo vs. Logro</h3>
				<p>Pero hay un problema. La mayoría de los sistemas educativos no funcionan de esta manera. Operan en <strong>tiempo académico</strong>: el semestre, la unidad, el período de clase. El progreso está determinado no por el logro sino por el calendario. El sistema dice: "Tienes 45 minutos para completar esta hoja de ejercicios. Tienes una semana para dominar esta unidad. Tienes un semestre para aprobar este curso." El horario es el amo, no la competencia del estudiante.</p>
				<p>Esto es lo que BEM llama la <strong>industrialización de la educación</strong> — el tratamiento del aprendizaje como una línea de producción donde el tiempo es el insumo y las calificaciones son el producto. Crea un desalineamiento fundamental entre el ritmo natural del aprendizaje y el ritmo impuesto de la institución.</p>
				<p>La consecuencia es un sistema que genera ansiedad en lugar de compromiso. Considera los niveles de desplazamiento automático en los juegos clásicos de Mario: la pantalla avanza a un ritmo fijo, y si el jugador no puede mantener el ritmo, es empujado fuera de la pantalla y muere. No hay opción de reducir la velocidad, explorar, retroceder. A la pantalla no le importa la preparación del jugador — solo le importa el reloj.</p>
				<p>Los sistemas educativos que vinculan el progreso al calendario son desplazadores automáticos. Crean estudiantes que están ansiosos por quedarse atrás en lugar de concentrados en dominar el material. Castigan al estudiante que necesita más tiempo en un concepto fundamental moviendo la pantalla hacia adelante de todos modos. Y aburren al estudiante que podría moverse más rápido forzándolo a esperar a que la pantalla lo alcance.</p>
				<h3>Progresión Basada en Logros</h3>
				<p>La alternativa de BEM es la <strong>progresión basada en logros</strong>: el progreso está vinculado a la competencia demostrada, no al tiempo transcurrido. El estudiante avanza cuando está listo, no cuando suena la campana. Esto no significa que no haya estructuras de tiempo en absoluto — algunas restricciones crean tensión productiva. Pero el mecanismo principal de avance debe ser el éxito del estudiante, no el calendario.</p>
				<p>Este es el desafío más difícil que enfrenta BEM, porque requiere confrontar las estructuras institucionales de la educación: períodos de calificación, ritmo del plan de estudios, horarios de exámenes estandarizados y los sistemas administrativos construidos a su alrededor. BEM no puede resolver estos problemas estructurales por sí solo. Pero puede proporcionar los principios de diseño que hacen posible la progresión basada en logros dentro de esas limitaciones.</p>
				<p>La idea clave es que <strong>múltiples ciclos en diferentes escalas de tiempo pueden coexistir dentro de un horario fijo</strong>. El macrohorario (el semestre, el curso) puede ser fijo, pero los microciclos (ejercicios, bucles de retroalimentación, metas correctivas) pueden basarse en logros. El sistema puede usar el calendario académico como una condición límite sin dejar que dicte la experiencia momento a momento. Dentro de cada período de clase, el estudiante se mueve a su propio ritmo. Dentro de cada unidad, el estudiante avanza cuando demuestra dominio. El horario proporciona un contenedor; los ciclos proporcionan el motor.</p>
				<p>Esto es lo que los juegos hacen magistralmente. Un juego puede tener un arco narrativo fijo (te enfrentarás al jefe final cuando la historia esté lista), pero dentro de ese arco, el jugador decide cuándo explorar, cuándo grindear, cuándo intentar el desafío difícil. El contenedor es fijo; el ritmo es libre.</p>
				<p>Los ciclos de progresión de BEM están diseñados para traer esta libertad al aprendizaje. Los engranajes de múltiples ciclos anidados — correctivos, progresivos y de identidad — crean una experiencia rica y multihebra donde el progreso es visible en múltiples frentes. El sistema respeta el ritmo del estudiante mientras mantiene la estructura que hace que el aprendizaje sea coherente. E insiste en que la medida definitiva del progreso no es el tiempo invertido, sino la competencia alcanzada.</p>
			</section>
			{:else}
			<!-- CHAPTER 17: Progression Cycles -->
			<section id="ch-cycles" bind:this={chapterEls['ch-cycles']}>
				<h2>17. Progression Cycles</h2>
				<p>If the previous chapter established that goals change after each loop, this chapter addresses a deeper question: what happens when multiple loops are running at the same time? Because in any engaging system — game or learning environment — there is never only one active goal.</p>
				<h3>The Multi-Goal Nature of Engagement</h3>
				<p>Games do not give the player a single objective and wait for it to be completed. At any moment, a player in a role-playing game might be: advancing toward a distant narrative goal (defeat the final boss), completing a current quest (rescue the merchant), managing a resource (keep health above 50%), exploring a side area (discover three hidden shrines), improving a skill (level up blacksmithing), and maintaining a social obligation (return to the guild for a reward). Each of these is a goal with its own feedback cycle, its own timeline, its own driver alignment.</p>
				<p>Why do games layer goals this way? Because <strong>engagement is not a single thread — it is a fabric</strong>. A single goal creates focus but also fragility: if the learner fails that goal, there is nothing else to hold their attention. Multiple goals create resilience: if one path is blocked, another remains open. If one type of feedback becomes repetitive, another channel provides novelty. The fabric of goals keeps the learner oriented even when individual threads break.</p>
				<p>BEM applies this logic through the <strong>secondary goal system</strong>. Secondary goals are not optional add-ons — they are the structural mechanism that transforms a linear progression into a multi-threaded experience. While the main goal provides direction and structure, secondary goals provide depth, autonomy, and motivational diversity. A learner pursuing a main goal and two or three secondary goals is operating in a rich goal space where progress is happening on multiple fronts simultaneously.</p>
				<h3>The Gears of Progression</h3>
				<p>Imagine a system with three concurrent cycles:</p>
				<ul>
					<li><strong>Cycle A</strong>: A short corrective loop — the learner is fixing a specific error in their code. This cycle might complete in seconds or minutes. Each attempt generates immediate feedback.</li>
					<li><strong>Cycle B</strong>: A medium performance loop — the learner is working toward a 90% accuracy score on the current module. This cycle spans multiple exercises across a session. Feedback comes as running averages and trend lines.</li>
					<li><strong>Cycle C</strong>: A long identity loop — the learner is progressing toward a narrative milestone: becoming a "Senior Analyst." This cycle spans weeks. Feedback comes through level-ups, unlocked content, and narrative events.</li>
				</ul>
				<p>These cycles are not sequential — they are <strong>nested</strong>. The micro-loops feed the meso-loops, which feed the macro-loops. Every corrected error (Cycle A) contributes to the accuracy score (Cycle B), which contributes to the promotion (Cycle C). The learner experiences progress at multiple timescales simultaneously, which is exactly how games maintain engagement across sessions.</p>
				<p>This nested structure is why BEM's chapter on goals distinguished between state goals and action goals, between narrative, main, and secondary tiers. Each tier operates at a different timescale. Each tier has its own feedback cadence. Each tier serves a different function in the overall architecture of engagement.</p>
				<h3>The Industrialization Problem: Time vs. Achievement</h3>
				<p>But there is a problem. Most educational systems do not operate this way. They operate on <strong>academic time</strong>: the semester, the unit, the class period. Progress is determined not by achievement but by the calendar. The system says: "You have 45 minutes to complete this worksheet. You have one week to master this unit. You have one semester to pass this course." The schedule is the master, not the learner's competence.</p>
				<p>This is what BEM calls the <strong>industrialization of education</strong> — the treatment of learning as a production line where time is the input and grades are the output. It creates a fundamental misalignment between the natural rhythm of learning and the imposed rhythm of the institution.</p>
				<p>The consequence is a system that generates anxiety rather than engagement. Consider the auto-scrolling levels in classic Mario games: the screen moves forward at a fixed pace, and if the player cannot keep up, they are pushed off-screen and die. There is no option to slow down, to explore, to go back. The screen does not care about the player's readiness — it only cares about the clock.</p>
				<p>Educational systems that tie progress to the calendar are auto-scrollers. They create learners who are anxious about falling behind rather than focused on mastering the material. They punish the learner who needs more time on a foundational concept by moving the screen forward anyway. And they bore the learner who could move faster by forcing them to wait for the screen to catch up.</p>
				<h3>Achievement-Based Progression</h3>
				<p>BEM's alternative is <strong>achievement-based progression</strong>: progress is tied to demonstrated competence, not to elapsed time. The learner advances when they are ready, not when the bell rings. This does not mean there are no time structures at all — some constraints create productive tension. But the primary mechanism of advancement must be the learner's success, not the calendar.</p>
				<p>This is the hardest challenge BEM faces, because it requires confronting the institutional structures of education: grading periods, curriculum pacing, standardized testing schedules, and the administrative systems built around them. BEM cannot solve these structural problems on its own. But it can provide the design principles that make achievement-based progression possible within those constraints.</p>
				<p>The key insight is that <strong>multiple cycles at different timescales can coexist within a fixed schedule</strong>. The macro-schedule (the semester, the course) may be fixed, but the micro-cycles (exercises, feedback loops, corrective goals) can be achievement-based. The system can use the academic calendar as a boundary condition without letting it dictate the moment-to-moment experience. Within each class period, the learner moves at their own pace. Within each unit, the learner advances when they demonstrate mastery. The schedule provides a container; the cycles provide the engine.</p>
				<p>This is what games do masterfully. A game may have a fixed narrative arc (you will face the final boss when the story is ready), but within that arc, the player decides when to explore, when to grind, when to attempt the difficult challenge. The container is fixed; the pacing is free.</p>
				<p>BEM's progression cycles are designed to bring this freedom into learning. The gears of multiple nested cycles — corrective, progressive, and identity — create a rich, multi-threaded experience where progress is visible on multiple fronts. The system respects the learner's pace while maintaining the structure that makes learning coherent. And it insists that the ultimate measure of progress is not time spent, but competence achieved.</p>
			</section>
			{/if}

			{#if lang === 'es'}
			<!-- CHAPTER 18: IA y Gamificación BEM -->
			<section id="ch-ai" bind:this={chapterEls['ch-ai']}>
				<h2>18. IA y Gamificación BEM</h2>
				<p>La inteligencia artificial ha acompañado a los diseñadores de juegos desde los primeros días del campo. Desde los algoritmos de los fantasmas en Pac-Man hasta la dificultad adaptativa de los juegos de carreras modernos, la IA siempre ha sido una herramienta para crear oposición, generar variedad y calibrar desafíos. Los juegos proporcionan un terreno de entrenamiento ideal para la IA porque sus estructuras basadas en reglas hacen que la resolución de problemas sea medible — la IA puede entrenarse en millones de estados de juego porque cada estado está definido, cada acción está registrada y cada resultado es cuantificable.</p>
				<p>En educación, la IA se ha planteado de dos formas opuestas: como una herramienta de trampa que reduce el esfuerzo cognitivo, o como un tutor inteligente que se adapta al estudiante. Ambas perspectivas colocan a la IA en interacción directa con el estudiante. BEM propone una tercera visión — una que se centra en la relación entre la IA y el diseñador, y en la IA como <strong>oposición</strong> y <strong>generadora de desafíos</strong>, en lugar de como un reemplazo del docente.</p>
				<h3>La Complejidad Sistémica de BEM y el Cerebro de IA</h3>
				<p>Un marco como BEM tiene muchos puntos de contacto sistémicos: arquitectura de metas, alineación de impulsores, canales de retroalimentación, funciones de evaluación, mecánicas de fracaso, ciclos de progresión. Para un principiante, esta riqueza puede ser abrumadora. ¿Por dónde empezar? ¿Cómo saber si tu diseño es coherente?</p>
				<p>BEM está preparando un <strong>cerebro de IA</strong> — un modelo especializado entrenado en el marco BEM — para apoyar a diseñadores instruccionales y docentes en la evaluación de sus diseños a través de métricas BEM. La IA puede analizar una actividad de aprendizaje, identificar puntos ciegos en la alineación de metas, sugerir canales de retroalimentación que coincidan con el perfil del impulsor y señalar posibles contradicciones motivacionales. No es un reemplazo del juicio del diseñador. Es un espejo que refleja la estructura de vuelta al diseñador.</p>
				<h3>Cinco Principios para Integrar la IA en el Diseño de Aprendizaje</h3>
				<p><strong>1. La IA como Sistema de Evaluación No Determinístico.</strong> Los resultados determinísticos (correcto/incorrecto, bien/mal) no requieren IA. Un cuestionario de opción múltiple puede evaluarse con lógica condicional simple. El valor de la IA surge donde la evaluación es no determinística — donde la respuesta no es fija, donde la creatividad, el pensamiento crítico o la calidad del argumento deben ser evaluados. Pero esto no significa simplemente preguntarle a la IA "¿cómo se ve esto?" El diseñador debe crear criterios de evaluación basados en el modelo BEM, dándole a la IA un marco concreto para la retroalimentación. La IA también puede asumir roles — avatares con personalidades y estilos de retroalimentación distintos — para entregar evaluación en diferentes voces sobre la marcha. El límite es claro: la IA puede proporcionar retroalimentación siempre que no se requiera la responsabilidad del docente (como asignar una nota final).</p>
				<p><strong>2. La IA como Generadora de Desafíos y Oponente.</strong> Una de las aplicaciones más prácticas de la IA en BEM es la generación de contenido. Una IA puede producir mucho más contenido de práctica del que un aula podría consumir, generando baterías aleatorizadas de ejercicios — como sacar cartas de un mazo donde cada carta es un desafío único. Más importante aún, la IA puede servir como oponente. En lugar de enfrentar a los estudiantes entre sí (lo que crea los problemas de las tablas de líderes discutidos anteriormente), el sistema puede enfrentar a los estudiantes contra la IA. Este es el principio de los juegos de un solo jugador: los jugadores compiten contra una IA optimizada para calibrar la dificultad. La lógica de la IA puede incluir bucles de retroalimentación integrados que adaptan automáticamente la dificultad de los desafíos según los resultados del estudiante, manteniendo el estado de flujo sin requerir intervención manual.</p>
				<p><strong>3. La IA Genera Incertidumbre — Como Dados o Cartas.</strong> La probabilidad y la aleatoriedad son propiedades intrínsecas de los sistemas de IA. Una IA generativa no produce el mismo resultado dos veces. Sin embargo, los estudiantes (y los docentes) a menudo sienten una confianza determinística en los resultados de la IA — como si la respuesta de la máquina fuera de alguna manera más objetiva que la de un humano. BEM insiste en que la IA debería cultivar la <strong>sospecha, no la certeza</strong>. Así como los dados introducen aleatoriedad productiva en un juego de mesa, la IA introduce incertidumbre productiva en el aprendizaje. El estudiante debería preguntarse: "¿Por qué la IA propuso esto? ¿Qué otras posibilidades existen?" Esta incertidumbre no es un error — es una característica que refleja la impredecibilidad de la resolución de problemas en el mundo real.</p>
				<p><strong>4. La IA Habilita Mundos Interactivos Vivos.</strong> Los sistemas de IA son narradores naturales. Pueden generar descripciones, historias de fondo, diálogos y elementos de construcción de mundos bajo demanda. Si bien sus narrativas pueden no cumplir con los estándares literarios o cinematográficos, las narrativas de juego no requieren esos estándares. Una descripción procedural de una tienda de fantasía, una sesión informativa de misión generada dinámicamente o una conversación improvisada con un personaje no jugador no necesita ser Tolstoi — necesita ser <em>funcional</em> dentro del bucle de juego. La IA puede crear eventos de juego, poblar mundos con personajes y responder a las acciones del estudiante con consecuencias narrativas coherentes, haciendo que el entorno de aprendizaje se sienta vivo sin requerir un equipo de escritura dedicado.</p>
				<p><strong>5. La Ley de la Transparencia.</strong> Los sistemas de IA son, por diseño, motores de engaño — están entrenados para parecer humanos. Esto crea una obligación ética: los estudiantes deben saber cuándo están frente a una IA y cuándo están interactuando con un humano. La transparencia permite al estudiante ajustar sus expectativas y estrategias en consecuencia. Un mecanismo práctico es darle a la IA un nombre y un rol, creando una distinción formal. "Esta es Iris, tu compañera de análisis de IA. Es buena identificando patrones pero no entiende las emociones. Habla con tu profesor cuando necesites empatía." La IA nombrada se convierte en una entidad reconocida en el sistema, no en un titiritero invisible.</p>
				<h3>Una Reflexión Final</h3>
				<p>Este documento que estás leyendo — la Arquitectura Pedagógica de BEM — es en sí mismo un recurso que puede ser alimentado a una IA. Si eres docente o diseñador instruccional, toma este texto y hazle preguntas a una IA sobre tu práctica. "Basado en los principios de retroalimentación de BEM, ¿cómo podría rediseñar mi sistema de calificación?" "¿Qué impulsor me falta en este plan de clase?" "¿Mi evaluación es multicanal o estoy colapsando todo en una sola puntuación?" La IA no tendrá todas las respuestas, pero tendrá un marco con el cual pensar — y eso es lo que BEM proporciona: no una prescripción, sino un lenguaje para hacer mejores preguntas.</p>
			</section>
			<!-- CHAPTER 19: Conclusión -->
			<section id="ch-conclusion" bind:this={chapterEls['ch-conclusion']}>
				<h2>19. Conclusión: BEM como Infraestructura Pedagógica</h2>
				<p>Este artículo ha presentado BEM no como un conjunto de artilugios de compromiso, sino como una <strong>arquitectura instruccional coherente</strong> — un método para diseñar experiencias de aprendizaje que respeten la autonomía del estudiante, apoyen la internalización de la motivación y traten la evaluación y el fracaso como partes integrales del proceso de aprendizaje, no como juicios terminales.</p>
				<p>La arquitectura que hemos explorado opera a múltiples niveles:</p>
				<ul>
					<li>A nivel <strong>motivacional</strong>, BEM utiliza la OIT como marco para entender cómo las señales externas pueden apoyar — en lugar de socavar — la motivación autónoma. Replantea las recompensas como metas diferidas y la evaluación como retroalimentación informativa. Fundamenta su diseño en la regulación identificada e integrada, no en la presión externa.</li>
					<li>A nivel <strong>de impulsores</strong>, BEM ofrece un vocabulario de siete impulsores motivacionales que capturan la diversidad de la motivación humana. La alineación de impulsores asegura que las metas y la retroalimentación hablen el mismo lenguaje motivacional, evitando el efecto corrosivo de los incentivos desajustados.</li>
					<li>A nivel <strong>sistémico</strong>, BEM proporciona un proceso de diseño de ocho pasos que conecta cada elemento de vuelta al objetivo de aprendizaje. Es un método, no una taxonomía — una forma de construir sistemas coherentes en lugar de ensamblar listas de características. Este método se operacionaliza a través del Ciclo de Aprendizaje Interactivo, el bucle de cuatro fases que estructura cada interacción de aprendizaje como un encuentro impulsado por metas y mediado por retroalimentación.</li>
					<li>A nivel <strong>de metas</strong>, BEM distingue entre metas de estado (quién quiere llegar a ser el estudiante) y metas de acción (qué necesita hacer el estudiante). Estructura las metas en niveles narrativo, principal y secundario, cada uno sirviendo una función diferente. Las metas secundarias, en particular, proporcionan las vías no obligatorias y alineadas con impulsores que hacen posible la autonomía dentro de un sistema estructurado.</li>
					<li>A nivel <strong>de evaluación</strong>, BEM reconceptualiza la evaluación como funcional, multicanal y diagnóstica. La evaluación existe para ayudar al estudiante a alcanzar la competencia, no para clasificar u ordenar. La evaluación multicanal elimina la brecha evaluativa y brinda a los estudiantes información procesable para la autocorrección.</li>
					<li>A nivel <strong>de retroalimentación</strong>, BEM diseña tanto para el impacto cognitivo como emocional. La retroalimentación es información, pero también es experiencia. La calidad emocional de la retroalimentación — su momento, sus características sensoriales, su alineación con el estado del estudiante — determina si el estudiante experimenta el sistema como solidario o controlador.</li>
					<li>A nivel <strong>de fracaso</strong>, BEM trata el error como un mecanismo de aprendizaje en lugar de un evento terminal. A través de un cuidadoso diseño del fracaso, distinciones suaves y duras, empoderamiento después del fracaso y bucles de retroalimentación negativa, BEM crea entornos donde los estudiantes pueden persistir a través de la dificultad porque el sistema apoya la recuperación.</li>
				</ul>
				<p>Estos niveles no son independientes. Forman una cadena: la arquitectura de metas determina lo que el estudiante persigue, los impulsores determinan cómo el estudiante se conecta con las metas, la evaluación determina cómo se juzgan las acciones, la retroalimentación determina cómo se comunican los juicios, y el diseño del fracaso determina qué sucede cuando el estudiante no tiene éxito. Cada nivel depende del anterior.</p>
				<p>El resultado es un marco que va más allá de la lógica simplista de recompensas de la gamificación PBL. BEM no pregunta "¿qué recompensa podemos dar por esta tarea?" Pregunta: "¿Qué estado querría alcanzar el estudiante? ¿Cómo podemos hacer visible ese estado como una meta? ¿Cómo podemos evaluar el progreso hacia ella con claridad y equidad? ¿Cómo podemos comunicar esa evaluación de una manera que informe y motive? ¿Y cómo podemos hacer del fracaso una parte productiva del viaje?"</p>
				<p>Estas son preguntas más difíciles que "cuántos puntos por un cuestionario". Pero son las preguntas que conducen a entornos de aprendizaje donde los estudiantes persisten no porque sean obligados, sino porque la actividad misma se ha vuelto significativa.</p>
				<p>BEM no promete que cada tarea de aprendizaje será divertida. Algunas cosas son inherentemente difíciles, repetitivas o frustrantes, y ninguna cantidad de diseño de juegos cambiará eso. Lo que BEM promete es que estas dificultades pueden ser <strong>enmarcadas</strong>, <strong>apoyadas</strong> e <strong>integradas</strong> en una narrativa más amplia de crecimiento y competencia. El estudiante que lucha a través de un concepto desafiante no está soportando una prueba sin sentido — se está convirtiendo en alguien que puede dominar cosas difíciles. El trabajo del sistema es hacer visible ese devenir.</p>
				<p class="conclusion-line">En última instancia, BEM es un acto de respeto: respeto por la autonomía del estudiante, respeto por la complejidad de la motivación y respeto por el hecho de que el aprendizaje no es una transacción que completar sino una identidad que construir. El marco proporciona las herramientas; el diseñador proporciona el cuidado. Juntos, pueden construir experiencias que educan no solo a través de la entrega de información, sino a través de la arquitectura de la interacción misma.</p>
			</section>
			{:else}
			<!-- CHAPTER 18: AI and BEM Gamification -->
			<section id="ch-ai" bind:this={chapterEls['ch-ai']}>
				<h2>18. AI and BEM Gamification</h2>
				<p>Artificial intelligence has accompanied game designers since the earliest days of the field. From Pac-Man's ghost algorithms to the adaptive difficulty of modern racing games, AI has always been a tool for creating opposition, generating variety, and calibrating challenge. Games provide an ideal training ground for AI because their rule-based structures make problem-solving measurable — AI can train on millions of game states because every state is defined, every action is logged, and every outcome is quantifiable.</p>
				<p>In education, AI has been framed in two opposing ways: as a cheating tool that reduces cognitive effort, or as an intelligent tutor that adapts to the learner. Both perspectives place AI in direct interaction with the learner. BEM proposes a third view — one that focuses on the relationship between AI and the designer, and on AI as <strong>opposition</strong> and <strong>challenge generation</strong>, rather than as a replacement for the instructor.</p>
				<h3>BEM's Systemic Complexity and the AI Brain</h3>
				<p>A framework like BEM has many systemic touch points: goal architecture, driver alignment, feedback channels, evaluation functions, failure mechanics, progression cycles. For a newcomer, this richness can be overwhelming. Where do you begin? How do you know if your design is coherent?</p>
				<p>BEM is preparing an <strong>AI brain</strong> — a specialized model trained on the BEM framework — to support instructional designers and teachers in evaluating their designs through BEM metrics. The AI can analyze a learning activity, identify blind spots in goal alignment, suggest feedback channels that match the driver profile, and flag potential motivational contradictions. It is not a replacement for the designer's judgment. It is a mirror that reflects the structure back to the designer.</p>
				<h3>Five Principles for Integrating AI into Learning Design</h3>
				<p><strong>1. AI as a Non-Deterministic Evaluation System.</strong> Deterministic outcomes (right/wrong, pass/fail) do not require AI. A multiple-choice quiz can be assessed with simple conditional logic. AI's value arises where evaluation is non-deterministic — where the answer is not fixed, where creativity, critical thinking, or argument quality must be assessed. But this does not mean simply asking the AI "how does this look?" The designer must create evaluation criteria based on the BEM framework, giving the AI a concrete rubric for feedback. AI can also take on roles — avatars with distinct personalities and feedback styles — to deliver evaluation in different voices on the fly. The limit is clear: AI can provide feedback wherever the instructor's accountability is not required (such as assigning a final grade).</p>
				<p><strong>2. AI as a Challenge Generator and Opponent.</strong> One of the most practical applications of AI in BEM is content generation. An AI can produce far more practice content than a classroom could consume, generating randomized batteries of exercises — like drawing cards from a deck where each card is a unique challenge. More importantly, AI can serve as an opponent. Instead of pitting students against each other (which creates the leaderboard problems discussed earlier), the system can pit students against AI. This is the principle of single-player games: players compete against an AI optimized to calibrate difficulty. The AI's logic can include embedded feedback loops that automatically adapt challenge difficulty based on the learner's results, maintaining a flow state without requiring manual intervention.</p>
				<p><strong>3. AI Generates Uncertainty — Like Dice or Cards.</strong> Probability and randomness are intrinsic properties of AI systems. A generative AI does not produce the same output twice. Yet learners (and teachers) often feel a deterministic trust in AI outputs — as if the machine's answer were somehow more objective than a human's. BEM insists that AI should cultivate <strong>suspicion, not certainty</strong>. Just as dice introduce productive randomness into a board game, AI introduces productive uncertainty into learning. The learner should wonder: "Why did the AI propose this? What other possibilities exist?" This uncertainty is not a bug — it is a feature that mirrors the unpredictability of real-world problem solving.</p>
				<p><strong>4. AI Enables Living Interactive Worlds.</strong> AI systems are natural storytellers. They can generate descriptions, backstories, dialogue, and world-building elements on demand. While their narratives may not meet literary or cinematic standards, game narratives do not require those standards. A procedural description of a fantasy shop, a dynamically generated mission briefing, or an improvised conversation with a non-player character does not need to be Tolstoy — it needs to be <em>functional</em> within the game loop. AI can create game events, populate worlds with characters, and respond to learner actions with coherent narrative consequences, making the learning environment feel alive without requiring a dedicated writing team.</p>
				<p><strong>5. The Law of Transparency.</strong> AI systems are, by design, deception engines — they are trained to seem human. This creates an ethical obligation: learners must know when they are facing AI and when they are interacting with a human. Transparency allows the learner to adjust their expectations and strategies accordingly. A practical mechanism is to give the AI a name and a role, creating a formal distinction. "This is Iris, your AI analysis companion. She is good at identifying patterns but does not understand emotions. Talk to your instructor when you need empathy." Named AI becomes a recognized entity in the system, not an invisible puppeteer.</p>
				<h3>A Final Reflection</h3>
				<p>This document you are reading — the BEM Pedagogical Architecture — is itself a resource that can be fed into an AI. If you are an educator or instructional designer, take this text and ask an AI questions about your practice. "Based on BEM's feedback principles, how could I redesign my grading system?" "What driver am I missing in this lesson plan?" "Is my assessment multichannel or am I collapsing everything into a single score?" The AI will not have all the answers, but it will have a framework to think with — and that is what BEM provides: not a prescription, but a language for asking better questions.</p>
			</section>
			<!-- CHAPTER 19: Conclusion -->
			<section id="ch-conclusion" bind:this={chapterEls['ch-conclusion']}>
				<h2>19. Conclusion: BEM as a Pedagogical Infrastructure</h2>
				<p>This article has presented BEM not as a set of engagement gadgets, but as a <strong>coherent instructional architecture</strong> — a method for designing learning experiences that respect the learner's autonomy, support the internalization of motivation, and treat evaluation and failure as integral parts of the learning process, not as terminal judgments.</p>
				<p>The architecture we have explored operates at multiple levels:</p>
				<ul>
					<li>At the <strong>motivational level</strong>, BEM uses OIT as a framework for understanding how external signals can support — rather than undermine — autonomous motivation. It reframes rewards as deferred goals and evaluation as informational feedback. It grounds its design in identified and integrated regulation, not in external pressure.</li>
					<li>At the <strong>driver level</strong>, BEM offers a vocabulary of seven motivational drivers that capture the diversity of human motivation. Driver alignment ensures that goals and feedback speak the same motivational language, avoiding the corrosive effect of mismatched incentives.</li>
					<li>At the <strong>systemic level</strong>, BEM provides an eight-step design process that connects every element back to the learning objective. It is a method, not a taxonomy — a way of building coherent systems rather than assembling feature lists. This method is operationalized through the Interactive Learning Cycle, the four-phase loop that structures every learning interaction as a goal-driven, feedback-mediated encounter.</li>
					<li>At the <strong>goal level</strong>, BEM distinguishes between state goals (who the learner wants to become) and action goals (what the learner needs to do). It structures goals into narrative, main, and secondary tiers, each serving a different function. Secondary goals, in particular, provide the non-mandatory, driver-aligned pathways that make autonomy possible within a structured system.</li>
					<li>At the <strong>evaluation level</strong>, BEM reconceptualizes assessment as functional, multichannel, and diagnostic. Evaluation exists to help the learner achieve competency, not to sort or rank. Multichannel evaluation eliminates the evaluative gap and gives learners actionable information for self-correction.</li>
					<li>At the <strong>feedback level</strong>, BEM designs for both cognitive and emotional impact. Feedback is information, but it is also experience. The emotional quality of feedback — its timing, its sensory characteristics, its alignment with the learner's state — determines whether the learner experiences the system as supportive or controlling.</li>
					<li>At the <strong>failure level</strong>, BEM treats error as a learning mechanism rather than a terminal event. Through careful failure design, soft and hard distinctions, empowerment after failure, and negative feedback loops, BEM creates environments where learners can persist through difficulty because the system supports recovery.</li>
				</ul>
				<p>These levels are not independent. They form a chain: goal architecture determines what the learner pursues, drivers determine how the learner connects to goals, evaluation determines how actions are judged, feedback determines how judgments are communicated, and failure design determines what happens when the learner does not succeed. Each level depends on the one before it.</p>
				<p>The result is a framework that moves beyond the simplistic reward logic of PBL gamification. BEM does not ask "what reward can we give for this task?" It asks: "What state would the learner want to reach? How can we make that state visible as a goal? How can we evaluate progress toward it with clarity and fairness? How can we communicate that evaluation in a way that informs and motivates? And how can we make failure a productive part of the journey?"</p>
				<p>These are harder questions than "how many points for a quiz." But they are the questions that lead to learning environments where students persist not because they are compelled, but because the activity itself has become meaningful.</p>
				<p>BEM does not promise that every learning task will be fun. Some things are inherently difficult, repetitive, or frustrating, and no amount of game design will change that. What BEM promises is that these difficulties can be <strong>framed</strong>, <strong>supported</strong>, and <strong>integrated</strong> into a larger narrative of growth and competence. The learner who struggles through a challenging concept is not enduring a pointless ordeal — she is becoming someone who can master hard things. The system's job is to make that becoming visible.</p>
				<p class="conclusion-line">Ultimately, BEM is an act of respect: respect for the learner's autonomy, respect for the complexity of motivation, and respect for the fact that learning is not a transaction to be completed but an identity to be built. The framework provides the tools; the designer provides the care. Together, they can build experiences that educate not just through information delivery, but through the architecture of the interaction itself.</p>
			</section>
			{/if}
		</main>
	</div>
</section>

<style>
.learning-layout-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	max-width: 1280px !important;
	display: grid;
	grid-template-columns: 260px 1fr;
	gap: 3rem;
	align-items: start;
}

@media (max-width: 1100px) {
	.broad-layout {
		grid-template-columns: 1fr;
		gap: 2rem;
	}
}

.glass-card {
	background: white;
	border: 1px solid var(--color-border);
	padding: 2.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
}

/* SIDEBAR */
.sidebar-nav {
	padding: 1.5rem;
	position: sticky;
	top: 2rem;
	max-height: calc(100vh - 4rem);
	overflow-y: auto;
}

.sidebar-nav h3 {
	font-size: 0.9rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: var(--color-text);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.sidebar-nav nav {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.nav-sublink {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 0.75rem;
	font-weight: 700;
	font-size: 0.82rem;
	border-radius: var(--radius-sm);
	color: var(--color-text-muted);
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;
	width: 100%;
	transition: var(--transition-fast);
	font-family: inherit;
	line-height: 1.3;
}

.nav-sublink:hover {
	background: var(--color-bg-alt);
	color: var(--color-purple);
}

.nav-sublink.active {
	background: rgba(124, 58, 237, 0.08);
	color: var(--color-purple);
}

.ch-num {
	font-size: 0.75rem;
	font-weight: 800;
	color: var(--color-text-muted);
	opacity: 0.6;
	flex-shrink: 0;
}

.nav-sublink.active .ch-num {
	color: var(--color-purple);
	opacity: 1;
}

/* MAIN CONTENT */
.main-content {
	padding: 3rem;
	overflow: visible;
}

.article-header {
	margin-bottom: 3rem;
	padding-bottom: 2rem;
	border-bottom: 2px solid var(--color-border);
}

.article-header h1 {
	font-size: 2.2rem;
	font-weight: 900;
	line-height: 1.2;
	margin: 0 0 1rem;
	color: var(--color-text);
}

.byline {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 2rem;
	align-items: center;
}

.author {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-purple);
}

.version {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--color-text-muted);
}

/* Chapter sections */
.main-content section {
	margin-bottom: 0;
	padding-top: 1rem;
}

.main-content section + section {
	margin-top: 3rem;
	padding-top: 3rem;
	border-top: 1px solid var(--color-border);
}

.main-content h2 {
	font-size: 1.6rem;
	font-weight: 850;
	margin: 0 0 1.2rem;
	color: var(--color-text);
}

.main-content h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin: 1.8rem 0 0.8rem;
	color: var(--color-text);
}

.main-content h4 {
	font-size: 1.05rem;
	font-weight: 800;
	margin: 0 0 0.3rem;
	color: var(--color-text);
}

.main-content p {
	font-size: 1rem;
	line-height: 1.7;
	margin: 0 0 1rem;
	color: var(--color-text);
}

.main-content ul,
.main-content ol {
	margin: 0 0 1.2rem 1.5rem;
	padding: 0;
}

.main-content li {
	font-size: 1rem;
	line-height: 1.6;
	margin-bottom: 0.5rem;
	color: var(--color-text);
}

.main-content li:last-child {
	margin-bottom: 0;
}

.main-content strong {
	font-weight: 800;
}

.main-content em {
	font-style: italic;
}

/* Highlight box */
.highlight-box {
	border-left: 4px solid var(--color-purple);
	padding: 1.2rem 1.5rem;
	background: rgba(124, 58, 237, 0.03);
	border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	margin-bottom: 1rem;
}

.highlight-box p {
	margin: 0;
	font-weight: 600;
	font-size: 0.95rem;
	line-height: 1.6;
}

/* Cycle steps */
.cycle-steps {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.cycle-step {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
}

.step-num {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: var(--color-purple);
	color: white;
	font-weight: 900;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 0.1rem;
}

.cycle-step > div {
	flex-grow: 1;
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 1rem 1.5rem;
	border-radius: var(--radius-md);
}

.cycle-step p {
	margin: 0;
	font-size: 0.92rem;
	line-height: 1.5;
	color: var(--color-text-muted);
}

/* Tier cards */
.tier-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	border-left: 4px solid var(--color-purple);
	padding: 1.5rem;
	border-radius: var(--radius-md);
	margin-bottom: 1rem;
}

.tier-card:last-of-type {
	margin-bottom: 1.5rem;
}

.tier-card h3 {
	margin-top: 0;
	font-size: 1.15rem;
}

.tier-card p {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.5;
	color: var(--color-text-muted);
}

/* Conclusion */
.conclusion-line {
	font-size: 1.15rem !important;
	font-weight: 700 !important;
	line-height: 1.6 !important;
	color: var(--color-purple) !important;
	margin-top: 2rem !important;
	padding-top: 1.5rem;
	border-top: 2px solid var(--color-purple);
}

/* Responsive */
@media (max-width: 1100px) {
	.sidebar-nav {
		position: static;
		max-height: none;
		overflow-y: visible;
	}

	.sidebar-nav nav {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.nav-sublink {
		width: auto;
		font-size: 0.78rem;
		padding: 0.4rem 0.6rem;
	}

	.main-content {
		padding: 1.5rem;
	}

	.article-header h1 {
		font-size: 1.6rem;
	}
}

@media (max-width: 600px) {
	.main-content {
		padding: 1rem;
	}

	.main-content h2 {
		font-size: 1.3rem;
	}

	.byline {
		flex-direction: column;
		gap: 0.25rem;
		align-items: flex-start;
	}
}
</style>
