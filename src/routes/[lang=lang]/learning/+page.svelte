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
		{ id: 'ch-conclusion', num: '18', labelEn: 'Conclusion', labelEs: 'Conclusión' }
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
	description={lang === 'es' ? 'Artículo completo — 18 capítulos sobre motivación, drivers, metas, feedback, evaluación, fracaso, puntos y ciclos de progresión.' : 'Full article — 18 chapters on motivation, drivers, goals, feedback, evaluation, failure, points, and progression cycles.'}
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
				<h1>Beyond Points and Badges:<br />How BEM's Feedback Architecture Supports Autonomous Learning</h1>
				<div class="byline">
					<span class="author">By Javier Velásquez — Designer of BEM</span>
					<span class="version">V1. 10/06/2026</span>
				</div>
			</div>

			<!-- CHAPTER 1: Introduction -->
			<section id="ch-intro" bind:this={chapterEls['ch-intro']}>
				<h2>1. Introduction</h2>
				<p class="intro-paragraph">For the past two decades, the default answer to "how do we make education more engaging?" has been deceptively simple: add points, badges, and leaderboards. Slap a progress bar on a reading assignment, award a star for completing a quiz, and let the leaderboard sort out the rest. This approach — commonly referred to as PBL gamification (Points, Badges, Leaderboards) — has spread through classrooms, corporate training platforms, and learning management systems with remarkable speed.</p>
				<p>And yet, the evidence tells a more complicated story. Meta-analyses show that gamification can improve engagement, motivation, and even learning outcomes, but these effects are uneven, context-dependent, and — crucially — fragile. When the points disappear, the behavior tends to disappear with them. More troubling still, there is evidence that extrinsic rewards can erode pre-existing intrinsic motivation: students who read for pleasure, once rewarded with stars, begin reading for the stars, and when the stars stop coming, they read <em>less</em> than they did before the intervention.</p>
				<p>The problem is not gamification itself. The problem is that most gamification approaches treat motivation as something you inject from the outside — a layer of cosmetic rewards painted onto an unchanged instructional core.</p>
				<p>There is an alternative. Instead of adding game elements <em>onto</em> instruction, we can redesign the instruction itself using the structural logic of games: their goal architectures, their feedback systems, their evaluation mechanisms, their relationship with failure. This is what the Behavioral-Experiential-Meaningful (BEM) framework proposes — not as a taxonomy of elements, but as an integrated instructional architecture.</p>
				<p>This article introduces BEM from a pedagogical perspective. It focuses on the design principles that make BEM a coherent methodology for learning, rather than a list of engagement tricks. We will explore how BEM rethinks motivation through the lens of Organismic Integration Theory, how it structures goals around identity and autonomy, how it designs feedback as both information and emotion, and how it transforms evaluation and failure into engines of learning. The goal is to provide practitioners — teachers, instructional designers, and learning experience developers — with a framework they can use to build systems where students persist because the activity itself is meaningful, not because an external reward compels them.</p>
			</section>

			<!-- CHAPTER 2: Motivation and the OIT Continuum -->
			<section id="ch-oit" bind:this={chapterEls['ch-oit']}>
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
			</section>

			<!-- CHAPTER 3: The Seven Drivers -->
			<section id="ch-drivers" bind:this={chapterEls['ch-drivers']}>
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
			</section>

			<!-- CHAPTER 4: The Systemic Approach -->
			<section id="ch-systemic" bind:this={chapterEls['ch-systemic']}>
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
			</section>

			<!-- CHAPTER 5: The Interactive Learning Cycle -->
			<section id="ch-cycle" bind:this={chapterEls['ch-cycle']}>
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
			</section>

			<!-- CHAPTER 6: Goals as Systems of Anticipation -->
			<section id="ch-goals" bind:this={chapterEls['ch-goals']}>
				<h2>6. Goals as Systems of Anticipation</h2>
				<p>A goal is a representation of a desired future state. It focuses attention, mobilizes effort, and sustains persistence. But in BEM, goals are understood as something more: they are <strong>anticipatory systems</strong>. They generate direction by pointing the learner toward a desired future state, and the tension between the current state and the goal state creates dopamine anticipation — the neurological engine of motivation.</p>
				<p>Remember, the definition of motivation according to the psychological literature is: "A process that initiates, guides and maintains goal-oriented behaviors." So by setting up proper goals, we are actually setting up the main driver of the learning process.</p>
				<p>This is why BEM insists on a crucial reframing: what the field typically calls "rewards" are simply deferred goals. A badge is not a reward for completing a task; it is a goal the learner was pursuing that they have now reached. A certificate is not a prize; it is a goal state the learner oriented toward. By reframing rewards as goals, BEM shifts the designer's attention from "what do I give them when they finish?" to "what state should they want to reach?" If a badge is a goal, then the question is not if a badge works, but how it is designed as a goal and what effects it produces. There are good and nocive badges, and it all depends on their design.</p>
				<p>Not all goals are created equal. In most educational design, goals take the form of <strong>action goals</strong>: "Complete exercise 3B," "Submit the essay by Friday," "Answer 8 out of 10 questions correctly." Action goals specify a concrete behavior to perform, that is always in the learners' control. They are measurable, manageable, and easy to assess. They are also, by themselves, motivationally thin. Action goals answer the question "what should I do?" but not "why should I want to do it?" A student can complete exercise 3B without ever caring about mathematics. The checkbox is ticked; nothing has changed in the student's relationship with the subject.</p>
				<p>Games, by contrast, excel at creating <strong>state goals</strong>: "Become the hero who saves the kingdom," "Build an empire that withstands any siege," "Discover the truth behind the ancient mystery." State goals describe a desired identity or state of being. They are often open-ended, can be pursued through multiple paths, and generate emotional investment because they speak to who the player wants to <em>become</em>, how the player wants the <em>world to be</em>, not just what the player wants to <em>do</em>. A player who pursues the goal of "becoming a master strategist" does not merely complete tactical exercises — she interprets every action through the lens of her aspirational identity. This requires strategy and not just work.</p>
				<p>Traditional education is overwhelmingly oriented toward action goals. Curriculum standards, lesson plans, and assessment rubrics break learning into discrete, observable behaviors. This is useful for measurement, but it creates a motivational vacuum. Students learn to comply — to perform the action — without ever integrating the value of the action into their sense of self. And state goals are usually oriented toward a grade that is designed to punish and demotivate.</p>
				<p>BEM does not abandon action goals. On the contrary, action goals are essential: they provide the concrete steps through which progress is made visible. But BEM embeds action goals within a larger architecture of state goals. The action goal ("deliver this programming challenge") gains meaning from the state goal it serves ("debug complex systems successfully"). The state goal, in turn, becomes tangible through the action goals that measure progress toward it.</p>
				<p>This dual architecture is the foundation of BEM's goal system. A well-designed BEM experience always makes two things clear to the learner: the immediate actions available to perform, and the state of competence or identity toward which those actions are building. When both are visible, the learner can move fluently between concrete tasks and aspirational identity — and this movement is the engine of sustained motivation.</p>
			</section>

			<!-- CHAPTER 7: Goal Architecture -->
			<section id="ch-architecture" bind:this={chapterEls['ch-architecture']}>
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
			</section>

			<!-- CHAPTER 8: Secondary Goals -->
			<section id="ch-secondary" bind:this={chapterEls['ch-secondary']}>
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
			</section>

			<!-- CHAPTER 9: Call to Action and Attention Management -->
			<section id="ch-cta" bind:this={chapterEls['ch-cta']}>
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
			</section>

			<!-- CHAPTER 10: Evaluation -->
			<section id="ch-evaluation" bind:this={chapterEls['ch-evaluation']}>
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
			</section>

			<!-- CHAPTER 11: Feedback as Information and Emotion -->
			<section id="ch-feedback" bind:this={chapterEls['ch-feedback']}>
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
			</section>

			<!-- CHAPTER 12: Corrective and Elaborate Feedback -->
			<section id="ch-elaborate" bind:this={chapterEls['ch-elaborate']}>
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

			</section>

			<!-- CHAPTER 13: The Building Blocks of Feedback Design -->
			<section id="ch-building" bind:this={chapterEls['ch-building']}>
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
			</section>

			<!-- CHAPTER 14: Failure as a Learning Mechanism -->
			<section id="ch-failure" bind:this={chapterEls['ch-failure']}>
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
			</section>

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

			<!-- CHAPTER 18: Conclusion -->
			<section id="ch-conclusion" bind:this={chapterEls['ch-conclusion']}>
				<h2>18. Conclusion: BEM as a Pedagogical Infrastructure</h2>
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
