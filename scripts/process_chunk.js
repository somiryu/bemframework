import fs from 'fs';
import path from 'path';

// Define the absolute paths
const rawCatalogPath = '/Users/freetoplay/.gemini/antigravity/scratch/raw_articles_list.json';
const outputPath = '/Users/freetoplay/.gemini/antigravity/scratch/processed_chunk_3.json';

// Mapping categories exactly as required
const categoryMap = {
  17: 'Psychology',
  18: 'Psychology',
  19: 'L&D & Education',
  20: 'UX & Game Loops',
  21: 'Systemic Design',
  22: 'L&D & Education',
  23: 'L&D & Education',
  24: 'Systemic Design'
};

// Manually crafted slugs, excerpts, formatted content, and FAQs to guarantee top-tier essayistic quality
const processedData = {
  17: {
    slug: 'bem-gamification-measuring-motivation-part-2',
    en: {
      title: 'BEM Gamification: Measuring Motivation (part 2)',
      excerpt: 'Explore how perseverance modulates motivation over time and why understanding player lifetime is crucial for designing voluntary systems in unpredictable environments.',
      content: `<p>In the last article we discussed behavior clusters, and measuring energy and direction. However, I left the most important indicator out: perseverance. So let's pick where we left off!</p>
<h3>Perseverance</h3>
<p>While energy can help us understand how attractive is the activity we are designing and how much intrinsic motivation is being allocated to the activity (or the measure of fear for a consequence, but let's say we are not that kind of designers), perseverance shows us how this energy is modulated over time.</p>
<p>Motivation is not a static indicator: its rate can change, and will change over time. Motivation is in flux, and it depends on several factors, many of which are out of our control. Motivating someone is an uphill battle that can be negatively affected by several foreseeable and unforeseen forces. Let's list a few:</p>
<ul>
<li><strong>Workload:</strong> You might have a game that you play every day and love, but a peak in you workload makes you leave the game for a few days. I have seen this peaks in several gamification projects and, actually, if the tension created by this workload lasts several weeks, it can produce permanent disengagement. As games usually are voluntary in nature, they are affected hard by non-voluntary activities.</li>
<li><strong>Repetition:</strong> Our brain is built for novelty, an we know for a fact that repetition affects the amount of dopamine that is released upon anticipation. Games are repetitive by nature, as are built upon cycles, but, the game designers work hard on keeping the game fresh by changing the level design. How many songs can you play with the 88 keys of a piano? How many novel problems can you create with 7 game mechanics? Actually a lot, but when the brain picks on patterns it begins to feel satiation, and that is why series with more than 5 or 6 seasons are rare.</li>
<li><strong>Frustration and Boredom:</strong> We can never lose ourselves from Flow theory! Humans have the ability to withstand variable levels of frustration and boredom for some time, but sustain this feelings and this is a recipe for avoidance. The issue, like with repetition, is that keeping the player in the flow channel becomes increasingly hard, as you have to accommodate for the real fact that your players actually learn from your system! What makes games powerful is what makes them "finite" in a sense. As skill progresses it becomes harder to keep the player engaged, specially because the more skillful a person feels she is, the less inclined she will be to expose herself to challenging situations.</li>
<li><strong>Replacement:</strong> We have limited time in this world, but, even worst, we have limited time per day! Humans work in circadian cycles, creating structures of behaviors and habits over 15 to 18 hour cycles. This means that most of our daily "calendars" are filled out by serious work and idle activities. Even when work becomes disengaging, people will find other activities to fill those spots, like social media or games. This means that, if you get to be part of that calendar with your design, your slot will be constantly bombarded by hundreds of other potential activities. You might lose a player only because she found something more interesting to do. Or your player might be interested in your system, but never finds another slot to replace.</li>
<li><strong>Pain and Effort:</strong> I said that the more skillful a person is, the less inclined to expose herself to challenging situations. Let's tackle that issue now! Most activities you engage with will come with a degree of physical or psychological pain, and will ask you to make an effort to continue. While many product designers are trying to create engagement by reducing pain and effort, game designers are not in that business! Mastery requires that you put yourself in uncomfortable situations. Go to the gym and survive the body aches, learn to play guitar and survive the pain in the fingers, learn a game and prepare to lose over and over again. People tend to endure these hardships until they feel adequate enough: learn to drive a car and you will stop learning when you can drive without thinking, but you will not expose yourself to more challenging situations. In this sense, it is normal for players to abandon before reaching the end of your game, just because they don't feel like exposing themselves to higher challenges.</li>
<li><strong>Skill Decline:</strong> We live in a world were certain skills peak on a certain age, and then both physical and cognitive functions naturally decline. Professional sport and e-sport players tend to be competitive until they are 30 to 40 years old, as younger brains and bodies are more effective by nature. This is not something to worry unless you are thinking on having a player in the very long term, but is something to take into account if you are pitting players of different age ranges, as the difference in skill can make some players abandon the system quicker.</li>
<li><strong>Serotonin and mood changes:</strong> To talk about motivation on a healthy brain is hard enough, but when you have to take into account how depression or mood variance due to environmental changes affect you potential players, you are in a whole other level of challenge. Depression for example creates more feelings of anxiousness when you are put into challenging situations, which means you might create a really engaging system that actually creates avoidance behaviors for some people. And this can happen suddenly: you might have engaged players that you then lose without apparent reason.</li>
<li><strong>Prediction:</strong> When a system becomes too predictable, it again loses novelty. To avoid this, game designers tend to give games a lot of volatility, which is easier to do in commercial game designs than in more serious projects. How to introduce volatility if you are trying to teach a procedural system, where the idea is that players become able to predict how the system will react?</li>
</ul>
<p>This is a small list to just show how many of the elements that diminish perseverance are out of your control, and others require careful thought and testing. Think about this: the triple A game industry can take 3 years and big teams to keep you engaged for 50 to 70 hours, and even then, you will reach only a fraction of the population. Measuring the life time of your players become essential to understand motivation and, while you might never know the real cause of abandon, understanding when your players are leaving can give you hints into the problems that are in your control, like difficulty curves or fatigue from repetition.</p>
<h3>The game of motivation</h3>
<p>Motivation designers of any type are fighting a hard fight, with many obstacles that play against us. We can't control all the factors, which means the game of motivation is a game of both skill and chance! The right question is about the odds of getting a player to try your system and then the odds of keeping them for a significant amount of time.</p>
<p>If you are designing a mandatory course, you will not be able to measure things related to intrinsic motivation, so you will have to measure the perception of the experience. But this is relatively simple and has been done through many methods. But when you don't intend to create obligation, now you are playing a hard hand. Specially because in serious environments you don't have a lot of space for testing, and, as an expert, your client might expect certain results in very short timeframes. In this case, measuring motivations is about managing expectations!</p>
<p>Unfortunately, gamification companies and consultants have always used a really optimistic language like: "gamification is the perfect tool for engaging your users/learners". It's understandable, but when a client feels like gamification is THE answer, this might create the idea that gamification is the sole responsible for the success of a project and that it will work with everyone! And the measure of success is a game of expectation and anticipation.</p>
<p>As a game of probabilities, measuring motivation in percents seems like a good move, but you must be careful, as scales affect expectation in a big way. Look at the following questions and answers (not taken from real stats):</p>
<ul>
<li>What is the probability that my current users will be engaged by the gamification system? =&gt; 80%.</li>
<li>What are the odds that someone that finds my site will be engaged by the gamification system? =&gt; 60%.</li>
<li>What are the odds that my users will invite new users to the experience? =&gt; 8%.</li>
<li>What percentage of my possible market will engage with my platform? =&gt; 3%.</li>
<li>What percentage of people in the world will interact with my gamified app? =&gt; 0.001%.</li>
</ul>
<p>You must be wary as many of these questions won't measure motivation via gamification, as, for example, attracting new market might be the role of the marketing team (which can be using or not gamified principles). On the other hand, percentages can give you odds, but can also give you sets: 3% of engaged users of my possible market is not the same as having a 3% probability of engaging a user. And finally, the framing of the question can take you to the bottom of the scale, which sounds awful! Is 0.001% of the world population a bad metric? Sounds bad because of the scale but it's actually around 8 million people!</p>
<p>The thing is, motivation can only be measured in numbers 1 and 3! If you invite 100 people to do a task and 15% do it, that might be more or less the chances that that task can engage people. In this case, the set represents more or less the chances, because all of them had the information on the task (and it was a big enough sample), very different to say that 3% of my possible market engages, as 97% might just not know about your system! In this sense, motivation can only be measured by understanding the level of engagement of people who are still active in your system and receive the call to action!</p>
<p>If you have 1000 users and, after gamifying your app you get 1000 more, was this solely because of the gamified system? That is really hard to say and you would need to have control groups to have better information (having the non gamified option competing with the new one, for example), but also, eliminating noise can be hard! Maybe there was a better marketing scheme that is responsible for the new users. So, measuring motivation by growth is an inexact science. Bounce rate might be a better indicator, as it show the resistance to grow and can be expressed as probabilities: 60% of my new users engage for more than 10 minutes.</p>
<p>On the other hand, if with each new user you recalculate the odds of people doing certain tasks, this can improve your model! If you send a call to action to 200 users and 120 are not engaged, that would be the measure of apathy for that task. Is that a bad number? Not necessarily!</p>
<p>First of all, remember the behavioral clusters! The more activities you can do in an app, the more they are competing for the user attention, and one related task might be taking people's attention away from the other one. In this case, improving the engagement on the task might systemically reduce the engagement on other performing activities. Remember, you have limited amounts of attention!</p>
<p>But this shows one big thing! The only way to measure motivation is giving choice, as choice is the only way to measure chances! As player motivations can vary a lot among each other, having a mechanic which only 10% of players interact with it might not be a bad idea: maybe it is a competitive scenario for only high performers, but this 10% yield 90% of the productivity! Remember, you need to account for energy as well as direction. Now, if that 10% loses interest in just a few weeks then you have a problem of perseverance for that mechanic and should be tweaked. So measuring engagement and disengagement over time is a key metric!</p>
<p>And be wary: one thing is to lose a player, another thing is that a player stops using a mechanic! Maybe that 10% that stopped using your competitive scenario migrated to collaborative guilds! That might be a great player journey! In this sense, measuring engagement by player's level might give you great information on how your mechanics promote motivation. But this can only be achieved if your players have choice!</p>
<p>If your gamification system is a way to remove choice then you will have a hard time measuring motivation. You will have to rely on past baselines to see if your current implementation improve the odds of engagement. But you will have to isolate variables like marketing and this would require the type of control testing that is hard to do in the corporate world. Think of putting your own mechanics in competition and you might find a better way to check for results, but always remember, check the energy, the direction and the perseverance to have a bigger picture.</p>
<p>And never oversell expectations! Remember, there are 3.68 billion gamers in a world of almost 8 billion people, which is less than 50%, and World of Warcraft has 4.8 million subscribers, which is 0,13% of that 50%. Now you can start to really understand what getting another 100 players to your system might mean! You gamification system is competing with all sort of mandatory and idle activities, some of them with enormous budgets, so any new user with feedback of love to your system is an epic win!</p>
<p>Any questions? I still have many! Any other ideas? Let's build knowledge together!</p>`,
      faq: [
        {
          "question": "What is perseverance in BEM gamification?",
          "answer": "Perseverance represents the modulation and sustainment of player motivation over time, indicating how long players remain engaged with systemic mechanics."
        },
        {
          "question": "Why is choice necessary to measure motivation?",
          "answer": "Choice provides the only true assessment of intrinsic motivation. Without choice, players only demonstrate compliance rather than real systemic engagement."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: medir la motivación (parte 2)',
      excerpt: 'Explore cómo la perseverancia modula la motivación a lo largo del tiempo y por qué comprender el ciclo de vida del jugador resulta crucial para diseñar sistemas voluntarios en entornos impredecibles.',
      content: `<p>En el artículo anterior analizamos los grupos de comportamiento, así como la medición de la energía y la dirección. Sin embargo, omití el indicador más importante, la perseverancia. Retomemos el análisis desde ese punto.</p>
<h3>La perseverancia</h3>
<p>Mientras que la energía nos permite comprender qué tan atractiva es la actividad diseñada y cuánta motivación intrínseca se le asigna, la perseverancia muestra cómo se modula esta energía a lo largo del tiempo.</p>
<p>La motivación no constituye un indicador estático, su ritmo cambia y fluctuará en el tiempo. La motivación se encuentra en constante cambio y depende de diversos factores, muchos de los cuales escapan a nuestro control. Motivar a alguien representa una batalla cuesta arriba que puede verse afectada por fuerzas tanto previsibles como imprevistas. Detallemos algunas de ellas:</p>
<ul>
<li><strong>Carga de trabajo:</strong> Es posible tener un juego predilecto y jugarlo a diario, pero un pico en la carga de trabajo obliga a abandonarlo temporalmente. He observado estos picos en múltiples proyectos de gamificación y, si la tensión dura varias semanas, suele producir una desconexión permanente. Al ser voluntarios por naturaleza, los juegos sufren enormemente ante las actividades obligatorias.</li>
<li><strong>Repetición:</strong> El cerebro humano está estructurado para buscar la novedad. La repetición disminuye la cantidad de dopamina liberada ante la anticipación. Los juegos son repetitivos por diseño, ya que se construyen sobre ciclos, pero los diseñadores de juegos trabajan arduamente para mantener la frescura mediante el diseño de niveles. Es fácil que el cerebro identifique patrones y alcance la saciedad, lo cual explica por qué las series de televisión rara vez superan las cinco o seis temporadas.</li>
<li><strong>Frustración y aburrimiento:</strong> La teoría del flujo resulta ineludible. Las personas toleran niveles variables de frustración y aburrimiento temporalmente, pero sostener estos estados conduce inevitablemente a la evitación. Mantener al jugador en el canal de flujo se vuelve cada vez más complejo debido a que los usuarios aprenden del sistema. A medida que progresa la habilidad, el enganche se dificulta, en particular porque una persona que se percibe habilidosa se muestra menos inclinada a exponerse a situaciones desafiantes.</li>
<li><strong>Reemplazo:</strong> El tiempo diario es limitado. Los seres humanos operamos en ciclos circadianos, estructurando hábitos en bloques de quince a dieciocho horas. La mayor parte de la agenda diaria se reparte entre el trabajo serio y el ocio. Si un diseño logra entrar en esa agenda, competirá constantemente con cientos de actividades alternativas. Se puede perder un jugador simplemente porque encontró una opción más atractiva o porque no halló espacio para acomodar la actividad.</li>
<li><strong>Dolor y esfuerzo:</strong> La mayoría de las actividades conllevan cierto grado de dolor físico o psicológico y exigen un esfuerzo continuo. A diferencia de los diseñadores de productos que buscan eliminar la fricción, los diseñadores de juegos no evitan el dolor. El dominio exige enfrentarse a situaciones incómodas. Soportar el dolor muscular en el gimnasio, el dolor en los dedos al aprender guitarra o perder repetidamente en un juego son requisitos del aprendizaje. Los jugadores suelen abandonar antes de terminar si el esfuerzo exigido supera sus expectativas de superación.</li>
<li><strong>Declive de habilidades:</strong> Existen habilidades que alcanzan su punto máximo a cierta edad y luego declinan de manera natural. Los jugadores profesionales de deportes tradicionales y electrónicos suelen ser competitivos hasta los treinta o cuarenta años. Esto es relevante al diseñar sistemas donde compiten personas de diferentes rangos de edad, ya que la brecha de habilidad puede acelerar el abandono.</li>
<li><strong>Serotonina y variaciones del estado de ánimo:</strong> La depresión y las variaciones anímicas debidas al entorno representan un desafío de otra categoría. La depresión genera mayor ansiedad ante el desafío, lo cual puede transformar un sistema altamente atractivo en un detonante de conductas de evitación para ciertos usuarios.</li>
<li><strong>Predicción:</strong> Un sistema excesivamente predecible pierde toda novedad. Los diseñadores de juegos comerciales introducen volatilidad para evitarlo, algo sumamente complejo en proyectos serios donde el objetivo suele ser que el usuario aprenda a predecir la respuesta del sistema.</li>
</ul>
<p>Esta lista ilustra cuántos elementos que disminuyen la perseverancia quedan fuera de nuestro control. La industria de los videojuegos de gran presupuesto invierte años y equipos masivos para mantener el interés durante cincuenta o setenta horas, y aun así solo alcanza a una fracción del público. Medir el ciclo de vida de los jugadores es fundamental para comprender la motivación.</p>
<h3>El juego de la motivación</h3>
<p>Los diseñadores de motivación enfrentamos una batalla compleja, llena de obstáculos externos. No controlamos todos los factores, de modo que el diseño de motivación es un juego de habilidad y azar. La pregunta correcta gira en torno a la probabilidad de que un jugador pruebe el sistema y permanezca en él durante un tiempo significativo.</p>
<p>En un curso obligatorio, no es posible medir la motivación intrínseca, por lo que la medición se limita a la percepción de la experiencia. En entornos voluntarios, el panorama cambia drásticamente. Las empresas de gamificación suelen utilizar un lenguaje excesivamente optimista al presentar la disciplina como la solución definitiva para el enganche. Sin embargo, el éxito es una probabilidad y depende del manejo de las expectativas.</p>
<p>Como juego de probabilidades, medir la motivación en porcentajes resulta útil, aunque las escalas afectan la percepción de forma notable. Analicemos estas preguntas y respuestas hipotéticas:</p>
<ul>
<li>¿Cuál es la probabilidad de que mis usuarios actuales se enganchen con el sistema? =&gt; 80%.</li>
<li>¿Qué probabilidad hay de que un visitante nuevo se enganche? =&gt; 60%.</li>
<li>¿Qué probabilidad hay de que los usuarios inviten a otros? =&gt; 8%.</li>
<li>¿Qué porcentaje del mercado potencial se enganchará con la plataforma? =&gt; 3%.</li>
<li>¿Qué porcentaje de la población mundial interactuará con la aplicación? =&gt; 0.001%.</li>
</ul>
<p>Debemos ser cautelosos, ya que atraer nuevo mercado depende de factores comerciales ajenos a la gamificación. Además, la motivación solo puede medirse en personas activas que reciben y comprenden la llamada a la acción.</p>
<p>Determinar si el crecimiento de usuarios se debe únicamente al sistema gamificado requiere grupos de control, lo cual suele ser difícil en el ámbito corporativo. La tasa de rebote ofrece un indicador más limpio, expresado en probabilidades, como el porcentaje de nuevos usuarios que permanecen activos por más de diez minutos.</p>
<p>Por otra parte, la única forma de medir la motivación es ofreciendo opciones, ya que la elección permite evaluar las probabilidades de acción. Si un elemento atrae solo al diez por ciento de los jugadores pero este grupo genera la mayor parte de la productividad, el diseño es sumamente exitoso. Si ese grupo pierde interés rápidamente, existe un problema de perseverancia en esa mecánica.</p>
<p>Si un sistema de gamificación elimina la opción de elegir, resulta imposible medir la motivación real. Siempre se debe evaluar la energía, la dirección y la perseverancia para obtener un panorama completo.</p>
<p>Nunca debemos sobredimensionar las expectativas. Hay más de tres mil millones de jugadores en el mundo, y títulos masivos como World of Warcraft cuentan con una fracción mínima de suscriptores. Cada usuario que demuestra un aprecio genuino por nuestro sistema representa una victoria monumental.</p>
<p>¿Tiene alguna pregunta? Aún conservo bastantes. ¿Alguna otra idea? Construyamos conocimiento en conjunto.</p>`,
      faq: [
        {
          "question": "¿Qué representa la perseverancia en la gamificación BEM?",
          "answer": "La perseverancia indica la forma en que se sostiene y modula la motivación de los usuarios a lo largo del tiempo dentro de un ecosistema de diseño."
        },
        {
          "question": "¿Por qué la libre elección resulta crucial para medir la motivación?",
          "answer": "La elección libre permite diferenciar la verdadera motivación del simple cumplimiento de normas obligatorias, reflejando el enganche genuino del usuario."
        }
      ]
    }
  },
  18: {
    slug: 'bem-gamification-measuring-motivation-part-1',
    en: {
      title: 'BEM Gamification: Measuring Motivation (part 1)',
      excerpt: 'Delve into the foundational mechanics of measuring motivation using energy, direction, and behavior clusters instead of superficial engagement metrics.',
      content: `<p>Any gamification project will have a significant number of KPIs, specially when you are not applying gamification to an already existing project. Are you players learning? Are your players enjoying the interface? Are your players using the right behaviors? Are your players taking advantage of the system functionalities? But a question you will have to tackle every time is: are your players being motivated by the gamified system and how much?</p>
<p>In the early days of Gamification, Zichermann talked about measuring the big E, for engagement. I find talking about measuring engagement difficult, as digital analytics are already using this term for some metrics, like frequency of visits, bouncing rate and so on. I would argue this is not engagement from the point of view of a game designer, but why enter the discussion when we can just talk about measuring the big M: motivation. Is a player who returns frequently to a site being motivated? Yes, but a player that won't return to the site regularly might be too. Take for instance a player who can't afford a game but seek every YouTube video about it. That player is being driven by the game, but she is showing compensatory behaviors and channeling her motivation towards other content. Or maybe the player has the game but is more engaged with the "meta game", and is browsing every wiki she can get her hands on, so her engagement metrics might be "poorer".</p>
<p>Engagement is actually a triad composed of motivation, emotion and attention. In the century of the attention wars, many are focused on measuring attention, as this is a big monetization driver. Meanwhile, emotion has been treated as a means: what to be viral? Enrage people! If emotion was a KPI maybe we could live on a better world, one with less biased algorithms and AIs. But motivation is seldom measured or taken into account, as tracking motivation seems difficult, at least for the guys in marketing. I want to give some understanding on how motivation can be measured, specially for you who are working on gamification projects or general applications for change.</p>
<p>Let's begin by understanding motivation and why it is so difficult to measure. For this, a like to use the quote from Jefrey Nevid:</p>
<blockquote>
<p>Motivation is the process that initiates, guides, and maintains goal-oriented behaviors. [...] Motivation doesn't just refer to the factors that activate behaviors; it also involves the factors that direct and maintain these goal-directed actions (though such motives are rarely directly observable). As a result, we often have to infer the reasons why people do the things that they do based on observable behaviors.</p>
</blockquote>
<p>When we talk about motivation, we can't directly give the reasons for the behaviors, so different motivational theories and frameworks have been dealing with understanding taxonomies for this reasons. Maslow was the first to give such a taxonomy, but we currently work heavily with Edward Deci's Self Determination Theory, which gives as Mastery, Autonomy and Relatedness (yes! Purpose is not original to the theory as it is understood as a part of Autonomy). From there you can find things like Octalysis' eight core drivers, or Appelo's Champfrogs, or even my own BEM seven drivers. This taxonomies are useful as they can help infer why are people doing stuff: we can't still pinpoint the reason, but we can give several informed hypothesis.</p>
<p>In this sense, one of the earliest ways of measuring motivation in game design was actually Bartle's 4 player types. Bartle's study was an effort to classify players according to their predominant behaviors according to four play styles: seldom did he knew that he was working in a similar framework as SDT: achievers are mastery driven, socializers are relatedness driven, explorers are autonomy driven, and killers, well they are still mastery driven, with an specific empowerment drive. Bartle's study was the first real attempt to measure motivation, by making "behavior clusters".</p>
<p>I'm not sure if behavior clusters is a thing, but it is a thing I use. The idea is to categorize behaviors into groups that can relate to different drivers. Why? If we take a student that loves solving math problems, we might think it can be related to mastery, but we could also explain this as a way to express autonomy (she thrills in the discovery of new ways of expressing herself through numbers) or even hedonism (she finds equations beautiful). Most individual behaviors can be explained by almost any driver, which becomes a "list of reasons" why someone might engage on an activity. And believe me, doing such lists is a great way to train yourself when designing gamification systems (that's part of the core of BEM). However, that is not great for measuring motivation. But if we know that the same student loves to solve puzzles, and is driven by hard chemistry problems, we can start discarding possible causes, or at least give a more probable explanation.</p>
<p>Let's leave that for now, as this only solves part of the problem: we can't answer why a player is doing something, but we can try to infer it better. But now we need to actually create a measure or scale. There are many indicators of motivation, but I usually work with three: energy, perseverance and direction. I will try to make this as pragmatic as possible:</p>
<h3>Energy and Direction</h3>
<p>If a learner is not driven by doing an exercise, but is driven to avoid being punished with a grade, you can actually measure this by the level of optimization of the task. When our brain is pushed towards something painful or boring, it will try to find the quickest way to get a positive result that will avoid the bad outcome. This example can help us illustrate two measures through reading the perceived quality of the task performed and then using the pain-desire scale.</p>
<p>When our brain is engaged with the activity, and not an extrinsic pressure, that energy will probably go towards doing the task better, as the quality of the job done will be a measure of fulfillment. But when our brain is being pressured by an extrinsic goal, it tends to save energy and becomes creative in finding ways of getting to the goal without having to do much effort. Is a player who tries to get all three stars in Angry Birds more driven? Maybe. We need to understand our previous taxonomy to actually give a better answer: if we measure this behavior through the lens of mastery, then yes, the player is more driven, but if we measure it through the lens of discovery and exploration, then maybe not, it is just driven by a different driver. Energy can't be measured on a vacuum, as we need to know where that energy is channeled. A student that cheats in an exam is not driven towards answering the exam, but she is driven to spend energy to find better ways to cheat.</p>
<p>This takes us to the other indicator: direction. In academic terms, we have three directions: apathy, avoidance and approximation. Apathy happens when the brains just doesn't care or doesn't care enough to try to get to a goal. If you place some reward behind an enemy but the player just decides to skip it by avoiding the enemy, we can say that that player was probably apathetic towards that reward. You can actually measure this and it can be convenient to find better ways to create drive towards a goal, but be careful, this apathetic attitude is not the same as failing in your design, but more on that later.</p>
<p>Now if a player is trying to get a big coin guarded by several obstacles, even when she could try a simpler approach and avoid the activity, we can infer she is driven towards approach. Approach is better explained as a goal that is arbitrary and not required, but that generates desire: approach is psycogenetically intrinsic as the decision is presented externally but its not pressured, it stems from wanting psychological satisfaction. This is the hardest direction to grasp in gamification projects, as the designers usually want to pressure behavior, but it actually is created by suggesting optional goals. To measure approach direction, then, we need to create optional goals that players might not interact with in the game.</p>
<p>Finally, avoidance is about removing a pain or avoiding a future pain. Most games have some sort of enemies and health bars to create this desire for avoidance. Curiously enough, avoiding probable pain is rewarding in itself, but not being able to avoid it might be demotivating. What is important to measure in this sense is not if there is avoidance drivers present in your design (they will surely be), but if those pain points are creating the desire to retry or to leave the game. Every pain you create in you system (losing XP, losing a challenge, being hit by an enemy, being surpassed in the leaderboard) has a probability of making you lose a player. How you manage your frustration threshold is important, as lowering this odds can actually hinder the experience for players driven towards approach through mastery. You have to select a range of punishment and difficulty and you will never be able to make it universal for every player.</p>
<p>Probable? End of part one.</p>
<p>As you can see, motivation is a game of probabilities. We can gather queues, but we can never get the driver itself, even if we ask for it. Self-knowledge and self-awareness are actually skills, and most people can't understand why they are driven by something, as we have not been taught to understand this in our schooling system. So, our measures of motivation cannot be given in absolute numbers. Knowing that we have 1000 players will not help us to understand motivation, but knowing that out of 200, 30 players are still in the game can give us some light. In my next article I will talk about perseverance and understanding motivation as game of probability, and where to put your expectations. Hope to see you next week!</p>`,
      faq: [
        {
          "question": "What is the motivation triad?",
          "answer": "Engagement is composed of motivation, emotion, and attention, where motivation is the least measured but most vital for sustainable behavioral change."
        },
        {
          "question": "How do you distinguish energy from direction in motivation?",
          "answer": "Energy represents the amount of effort a player allocates to a task, whereas direction indicates whether they approach, avoid, or remain apathetic to the goal."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: medir la motivación (parte 1)',
      excerpt: 'Descubra las mecánicas fundamentales para medir la motivación a través de la energía, la dirección y los grupos de comportamiento, superando las métricas superficiales de enganche.',
      content: `<p>Cualquier proyecto de gamificación cuenta con un número significativo de indicadores de rendimiento, en particular cuando la disciplina se aplica sobre un proyecto preexistente. ¿Aprenden los jugadores? ¿Disfrutan de la interfaz? ¿Adoptan los comportamientos correctos? ¿Aprovechan las funcionalidades del sistema? Sin embargo, una interrogante constante es si los jugadores experimentan una verdadera motivación gracias al sistema y en qué medida.</p>
<p>En los inicios de la gamificación, se hablaba de medir el compromiso o "engagement". Considero complejo este término, debido a que la analítica digital ya lo utiliza para métricas como la frecuencia de visitas o el porcentaje de rebote. Esto no representa el compromiso desde la perspectiva del diseño de juegos. Un jugador que no regresa con regularidad puede estar motivado, como ocurre con quien no puede adquirir un juego pero consume cada video al respecto en plataformas de video, canalizando su motivación hacia contenido derivado. O bien, el usuario se enfoca en el meta-juego, consultando enciclopedias y comunidades en línea, lo que registraría métricas de actividad directa menores en la plataforma.</p>
<p>El compromiso real es una tríada compuesta por motivación, emoción y atención. En la era de la disputa por la atención, la analítica se centra en medir la retención del usuario debido a su valor comercial. Por su parte, la emoción suele tratarse como un simple medio, apelando a la indignación para viralizar contenidos. La motivación rara vez se evalúa, dado que el mercadeo la considera difícil de rastrear. A continuación, presento algunas pautas para medir la motivación en proyectos de gamificación.</p>
<p>La motivación es el proceso que inicia, guía y mantiene los comportamientos orientados a objetivos. No solo activa conductas, también las sostiene y dirige, aunque estos motivos rara vez resultan observables de manera directa. En consecuencia, debemos deducir las razones del comportamiento basándonos en la conducta observable.</p>
<p>Para inferir estas razones, empleamos diversas teorías y marcos conceptuales. Abraham Maslow propuso una taxonomía inicial, pero hoy trabajamos con la teoría de la autodeterminación de Edward Deci, que postula la maestría, la autonomía y la relación como ejes de la motivación. A partir de allí surgen marcos como Octalysis con sus de ocho impulsores, Champfrogs de Jurgen Appelo o mis propios siete impulsores del modelo BEM. Estas clasificaciones permiten formular hipótesis informadas sobre el comportamiento.</p>
<p>Uno de los primeros intentos por medir la motivación en el diseño de juegos fue la clasificación de Richard Bartle, que agrupó a los jugadores en cuatro estilos de juego según sus conductas predominantes, un esfuerzo análogo a la teoría de la autodeterminación, donde los realizadores buscan el dominio, los socializadores la relación y los exploradores la autonomía.</p>
<p>Los grupos de comportamiento facilitan esta inferencia al agrupar conductas que apuntan a impulsores específicos. Si una estudiante resuelve problemas complejos de matemáticas, esto puede deberse a la maestría, a la autonomía o incluso al hedonismo. Al analizar conductas concurrentes, como el interés en acertijos y química, descartamos causas improbables y precisamos la explicación más plausible.</p>
<p>Para cuantificar esta motivación, utilizamos tres indicadores clave, la energía, la perseverancia y la dirección.</p>
<h3>Energía y dirección</h3>
<p>Medimos la energía mediante la optimización de las tareas y el deseo de logro. Cuando el cerebro realiza una actividad bajo presión externa, busca la ruta más rápida para evitar un resultado adverso con el mínimo esfuerzo. Si la actividad es intrínsecamente atractiva, la energía se encauza hacia la calidad de la ejecución como vía de satisfacción. La energía no se mide en el vacío, requiere comprender hacia dónde se canaliza. Una estudiante que recurre al plagio en un examen no dirige su energía a resolver la prueba, sino a idear el método más efectivo para el engaño.</p>
<p>La dirección se define en tres orientaciones, la apatía, la evitación y la aproximación. La apatía ocurre cuando el usuario no muestra interés suficiente para intentar alcanzar una meta. La evitación consiste en eludir o eliminar un dolor potencial, un elemento común en sistemas con barras de vida o penalizaciones, aunque el exceso de castigo puede forzar el abandono del usuario. La aproximación representa la búsqueda de una satisfacción psicológica voluntaria mediante metas opcionales que el usuario decide perseguir sin presiones.</p>
<p>La motivación se rige por la probabilidad. Las mediciones no arrojan certezas absolutas, pero sí muestran tendencias claras sobre la retención de usuarios activos. En el próximo artículo analizaré la perseverancia y cómo gestionar las expectativas de éxito en proyectos reales. ¡Espero verlos la próxima semana!</p>`,
      faq: [
        {
          "question": "¿Cuáles son los componentes de la tríada de compromiso?",
          "answer": "El enganche se compone de atención, emoción y motivación. Esta última es la menos medida en la analítica digital convencional."
        },
        {
          "question": "¿Qué distingue a la energía de la dirección al medir motivación?",
          "answer": "La energía determina la intensidad del esfuerzo aplicado, mientras que la dirección define si el usuario se aproxima, evita o permanece apático al objetivo."
        }
      ]
    }
  },
  19: {
    slug: 'bem-gamification-semiotics-hermeneutics-and-learning',
    en: {
      title: 'BEM Gamification: Semiotics, Hermeneutics and Learning',
      excerpt: 'Analyze games as sophisticated communication systems through semiotics and hermeneutics, showing how dynamic context and clear feedback create deep systemic learning.',
      content: `<p>There is an old quote that I've always found too simplistic: "Gamification is 80% psychology and 20% technology". Gamification has always been linked with motivation and behavioral theories, and that's not my issue with the quote. However, the idea of understanding gamification as psychology and technology might reduce the scope of the field. This article is an example of how understanding Gamification from the lens of other disciplines might help create better designs.</p>
<p>Let's begin by understanding a game as a communication system. Games are made of choices, moves and intentions, which means that the interface provides a way of communicating all those things. This is so powerful that some board games, like The Mind or Magic Maze, are built with a "no speaking" rule. Players should be able to "talk" to each other using the pieces as mediators. Furthermore, the internationalization of board games has made ubiquitous the use of icons and infographic language to avoid requiring written words. Of course, the rules of the games are complex and do require some sort of literacy in most cases, but we can find examples of games with wordless tutorials, like many arcade games. So, it makes sense to try to understand games from the field of semiotics.</p>
<p>Semiotics is the study of signs and meanings, the basis for human communication. We know that signs are arbitrary and conventional, which means there is no logic connection between the sign and its meaning, and is the social agreement what conveys the backbone of understanding. We know roosters sound different in different languages: Cock a Doodle Doo in english, Kikiriki in Spanish, Kokoriko in French and so on. The problem we face with this aspect of language is that it can make meanings unequivocal or equivocal: for a single word many people can give just one definition or multiple. Gamification has suffered from being an equivocal term with not a single definition, as agreement is not easy to be found for something so abstract.</p>
<p>That a word or a sign can be equivocal is the basis for another field: hermeneutics. Learning does not happen from explicit information, but most of the time it emerges from implicit interpretations: hermeneutics try to understand how we create meaning from complexity, specially when understanding can be modified by tone, context, cultural background, previous knowledge and so on. What do you understand by the word "freedom" and what implications does it have in you social life. Does freedom of speech should have limits? What about freedom of behavior or freedom of intention? In western society we might agree that freedom of speech is important, but we might not agree on what does this expression means.</p>
<p>Games, as learning systems, suffer from the same principles. The rules of a game allow for information to flow only in certain ways, but the agency of a human player makes the game state flow in one intended direction. Intention is behind every move, but intentions are veiled behind behaviors, as giving information to an opponent might be the key for your defeat. In games you lie, deceive, and bluff your way to victory. But each move is not abstract and its effects on the game tend to be explicit, so players rely on this information to make the next choice. We use suspicion to avoid falling into traps, but we try to better interpret the factual information to inform our next moves.</p>
<p>Understanding this can be the difference between a generic gamification system and a really powerful learning experience, as the designer has control over the information shown and the rules that underlie each game move. This is specially true when it comes to feedback, one of the main tools of a gamification designer. Meaning creates emotion, which drives motivations, and meaning depends on hermeneutics. If we want to motivate we must avoid conflicting signals or signs that will create emotional backlashes.</p>
<p>From a semiotics point of view, a leaderboard has meaning beyond being a position table: from a table of players and scores, a player can infer odds, performance, skills, and even knowledge. A player that is low in the leaderboard might interpret that she isn't understanding the game, even if she knows the rules, which can create negative emotions that create a positive feedback loop of demotivation. Mario Kart is famous for creating rules that interfere with this pattern of thought, as being last might means amazing power ups that artificially improve the odds for the player. But, beyond the rules, the feedback in itself can carry emotional weight. Imagine a leaderboard where, besides the top 5 players avatars you see a "poison" icon and their names in green, while the lower positions have a fire icon and their names in red. Now, imagine the last player has her name in gold! This icons carry their own interpretation, which might make you think that in this game going last actually can be good as a long-term strategy (are you learning something?)! One additional piece of information can transform all you know about leaderboards!</p>
<p>Beyond pure motivation, semiotics can actually help make knowledge less ambiguos. Reducing equivocal meanings can help provide better understanding of what you want to teach. Games tend to create unequivocal information by using discriminatory signals, built upon feedback rules: if certain sound, icon or animation is always triggered by the same "rule", then the brain can learn easily what that stimulus means without words: causality is best understood when there is no conflicting information! This might seem like operant conditioning, because it actually has common roots, but from a hermeneutical standpoint it's not about creating automatic responses to stimuli, is about creating quick understanding, its about packing a lot of meaning into a single stimulus.</p>
<p>The question, then, is how can I create clear understanding of my content or learning material using feedback elements? If all I do is questions and answers, and every question has one correct answer, then my feedback will be binary: right or wrong. But I will lose the possibility of creating nuance: why am I wrong? was it a hard question? am I mainly failing on a particular topic? if I retry can I do better? All of this information could be provided for trivia mechanics and upgrade a simple experience into a motivation-based design.</p>
<p>But we can do more than that: as game designers we can make people choose depending on information contexts! Think about it this way: you are playing Catan and it's your turn, you analyze the board and have to make a choice: there are no right or wrong answers, although some choices can be better than others: you need to interpret the information and choose. Now you can see the consequences of your choices as other players react in their turns and you try to figure out why your move didn't went as expected. This micro-failure comes with a lot of information and hypothesis which you can test in following rounds.</p>
<p>And here is the magic of games as semiotic systems! As you play and play the same game you see more and more patterns emerging, which give you more clarity on what does certain information unequivocally mean! That is, until someone finds a better strategy and all your hypothesis have to be reevaluated. But for this to work we need one final touch...</p>
<p>If we understand that the game state can be as powerful for learners as the feedback itself (it might be the relation between both, actually), then we really need to think about the "language" we use. Calling everything points just creates more equivocal information, but talking about dexterity, strength, charisma, damage, resistance, prestige, knowledge gives more context for the brain to make better interpretations. In hermeneutics there is a golden rule: the better the context, the better the interpretation. In language sometimes less is less, and the ability to infer meaning from context is more powerful than answering trivias from memory.</p>
<p>What better way of spending my 40th birthday than writing about the things I love. As a Magister of Literature I've always thought language is the best interface to understand anything deep, so why not think of games like this? Maybe games are psychology driven by semiotics and systemic design, and gamification is about experimenting with the language of games to solve problems where other forms of language have not been able to give enough value. I hope when I reach 50 I will still have many hypothesis to share, always pushing the boundaries forward. Thanks for reading!</p>`,
      faq: [
        {
          "question": "How do semiotics and gamification interact?",
          "answer": "Semiotics treats game interfaces and actions as signs that convey implicit, non-verbal instructions, allowing players to grasp mechanics and causality without textual overhead."
        },
        {
          "question": "What role does hermeneutics play in player feedback?",
          "answer": "Hermeneutics explores how players interpret feedback in context. Changing simple aesthetic elements, like leaderboard styles, alters the meaning players extract from their status."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: semiótica, hermenéutica y aprendizaje',
      excerpt: 'Analice los juegos como sistemas complejos de comunicación a través de la semiótica y la hermenéutica, demostrando cómo el contexto dinámico y la retroalimentación clara facilitan un aprendizaje sistémico profundo.',
      content: `<p>La conocida afirmación que reduce la gamificación a un ochenta por ciento de psicología y un veinte por ciento de tecnología resulta demasiado simple. Si bien la disciplina se vincula estrechamente con la motivación, esta visión limita su alcance. Analizar la gamificación desde otras disciplinas enriquece el diseño de forma notable.</p>
<p>El juego constituye un sistema de comunicación donde las elecciones y los movimientos transmiten intenciones a través de la interfaz. Esto es tan potente que algunos juegos de mesa prohíben la comunicación verbal, forzando a los jugadores a interactuar mediante las piezas. La internacionalización del juego de mesa ha popularizado el uso de íconos para evitar el texto escrito. Así, la semiótica resulta una herramienta fundamental en nuestro campo.</p>
<p>La semiótica estudia los signos y el significado, la base de la comunicación humana. Los signos son convencionales y arbitrarios, definidos por el acuerdo social. Sin embargo, la ambigüedad puede distorsionar el mensaje, un problema que la gamificación ha sufrido al carecer de una definición única.</p>
<p>La interpretación de esta ambigüedad es el objeto de la hermenéutica. El aprendizaje surge de interpretaciones implícitas y complejas, moldeadas por el contexto, la cultura y el conocimiento previo. El significado de conceptos abstractos varía según el entorno de los individuos.</p>
<p>Los juegos operan bajo estos principios. Las reglas canalizan la información, mientras que la agencia del jugador dirige el estado del juego. Aunque las intenciones se ocultan tras la conducta, los efectos de cada movimiento son explícitos, permitiendo a los jugadores evaluar sus siguientes pasos y descifrar la estrategia del oponente.</p>
<p>Comprender esto distingue un diseño genérico de una experiencia de aprendizaje de alto impacto. La retroalimentación es la principal herramienta para moldear la emoción y la motivación, por lo que debemos evitar señales contradictorias que generen rechazo emocional.</p>
<p>Desde la perspectiva semiótica, una tabla de clasificación representa mucho más que una lista de posiciones, pues el usuario infiere de ella su rendimiento y capacidad. Una posición baja puede interpretarse como falta de comprensión del juego, detonando desmotivación. Títulos como Mario Kart equilibran esto mediante reglas que otorgan mejores ventajas a las últimas posiciones. Un cambio estético o simbólico, como cambiar el color del nombre del último lugar a dorado, altera por completo la interpretación de esa posición, sugiriendo un valor estratégico a largo plazo.</p>
<p>La semiótica ayuda a clarificar el conocimiento y reducir la ambigüedad mediante señales discriminatorias y reglas de retroalimentación constantes. Esto permite al cerebro asimilar estímulos sin necesidad de explicaciones textuales prolongadas, facilitando una comprensión inmediata y profunda.</p>
<p>Para evitar retroalimentaciones binarias e ineficaces en el aprendizaje, debemos diseñar escenarios donde las decisiones carezcan de una respuesta única correcta, obligando al usuario a interpretar el contexto y evaluar las consecuencias de sus actos, simulando la complejidad del mundo real.</p>
<p>El uso del lenguaje resulta crucial en este proceso. Utilizar términos específicos de la temática en lugar de la palabra 'puntos' otorga un contexto valioso que mejora la interpretación hermenéutica. Un contexto enriquecido permite deducir el significado con mayor eficacia que la memorización mecánica.</p>
<p>Qué mejor manera de celebrar mi cuadragésimo cumpleaños que escribiendo sobre las disciplinas que me apasionan. Como magíster en literatura, considero el lenguaje la mejor interfaz para comprender lo complejo, y los juegos no son la excepción. La gamificación representa una oportunidad para experimentar con el lenguaje lúdico en la resolución de problemas donde la comunicación convencional ha resultado insuficiente.</p>`,
      faq: [
        {
          "question": "¿De qué manera la semiótica mejora la gamificación?",
          "answer": "La semiótica permite estructurar interfaces donde los íconos y la retroalimentación visual actúan como signos, facilitando la comprensión causal de las mecánicas sin saturación de texto."
        },
        {
          "question": "¿Qué papel desempeña la hermenéutica en el aprendizaje gamificado?",
          "answer": "La hermenéutica ayuda a analizar cómo los jugadores interpretan el estado del juego y los mensajes de logro dentro de su contexto particular, evitando malentendidos desmotivadores."
        }
      ]
    }
  },
  20: {
    slug: 'bem-gamification-delayed-feedback-and-the-netflix-problem',
    en: {
      title: 'BEM Gamification: Delayed feedback and the Netflix problem',
      excerpt: 'Examine how delayed and scheduled feedback build anticipation and dopamine, contrasting this with the binge culture of Netflix that leads to rapid satiation and anxiety.',
      content: `<p>Gamification was born under one fundamentally wrong premise: our brain prefers immediate feedback. Sure, immediate feedback is great for learning and games use it heavily when it comes to things that require almost real time information for split decision making, but, for a term that is so heavily associated with dopamine, we often seem to forget how this neurotransmitter actually works: and this is killing Netflix.</p>
<p>To explain the Netflix problem, I have lay first the ground. When I'm designing feedback systems for my gamification projects I divide them in the following categories:</p>
<ul>
<li><strong>Immediate:</strong> the system reacts as close as it can to real time, to provide information required to validate actions or be able to evaluate results. It is important for split second decisions or to build trust and experience in a system that does not have natural feedback elements.</li>
<li><strong>Delayed:</strong> the system delays the feedback so it is delivered in the best possible moment. Delayed feedback is build upon anticipation, and works great to create tension and desire over time. Dopamine has a huge effect on delayed feedback, but the timing has to be right: if you take a bit to roll a die it can create excitement, but take it too far and it will create anxiety.</li>
<li><strong>Scheduled:</strong> the system schedules when the result of an action or activity will be revealed. Schedules help the brain organize information and expectations, and it's amazing to create use cycles and dis/re-engagement systems.</li>
<li><strong>Late:</strong> the feedback comes when the information is no longer needed, or when the lack of information has already created anxiety. If you press a button and the interface takes more than a tenth of second to react (for example by changing its state to a "loading" status"), this will encourage the user to try to click again.</li>
<li><strong>Devalued:</strong> the feedback loses its emotional power overtime, and, if it takes too long to come, the information might not be valuable for the brain anymore. Although devalued feedback is better than no feedback at all, it loses its emotional and motivational power, like when a teacher takes weeks to return an essay.</li>
</ul>
<p>Delayed and scheduled feedback is used more than you think in game play, and can actually become a mechanical feature. Let's use some examples, first for delayed feedback:</p>
<ul>
<li>When you stop moving a character, the character will not stop immediately, creating the need of learning when to stop moving so you won't fall a cliff.</li>
<li>When you need to shuffle a deck before drawing a key card that might save the day.</li>
<li>When you are getting a reward from a roulette-like system (like in Mario Bros 3).</li>
<li>When you are getting something really exciting from a loot. In Clash Royale the game takes more time to reveal a legendary card from the other types.</li>
</ul>
<p>Now let's check some for scheduled feedback:</p>
<ul>
<li>When the result of a vote is scheduled to be known in the next episode of a show.</li>
<li>When you have to wait for a timer to deplete to be able to collect resources.</li>
<li>When the game state is updated at certain hour of the day, every day.</li>
<li>When you need an alarm to remember to take your pills.</li>
</ul>
<p>The problem is most people confuse delayed and scheduled with late and devalued feedback. This creates a sensation in the designer that if everything can't be tracked in real time, it's not worth tracking. Yes, some real-time information can really get you hooked, like the stock market, but this can also create fatigue. Try to track the real time analytics of your website for a whole day and you will feel like there is a lot of "nothing going on". Understanding how to deliver information over time is one of the big skill of a great game-gamification designer.</p>
<p>This takes us to the Netflix problem: the binge culture. Netflix created a culture around delivering whole seasons of a show in one go, to take advantage of the compulsory behavior of wanting to know what happens next. This is a form of immediate feedback, with only a small delay between episodes, as cliffhangers require resolution. This can actually create a sensation of excitement, as the brain seems to like to avoid waiting to know what happens next, but this is only a small part of the picture.</p>
<p>By releasing whole seasons at a time, Netflix is, inadvertently, setting itself for failure. User's immediate feedback will be positive and the spike of excitement will be tangible, but the systemic effects overall will have dire consequences. Which consequences, you ask? Let's review some of them:</p>
<ul>
<li>By consuming long streams of information, the brain is not able to retain everything in the long term memory. While you might remember the overarching plot, the small details that are important to create storytelling connections are lost, specially between seasons. Try watching again a show that you loved (and are waiting for the new season) and you will find yourself feeling as if you were watching for almost the first time. If you release episodes on a schedule, the brain has time to ruminate through the details, which is reinforced by the second point:</li>
<li>By creating scheduled feedback, you let the fandom create content in between to keep the excitement going. This will make you not only remember the plot, but the whole conversation around each episode, which will increase your retention of information.</li>
<li>Long binching hours create fatigue, even if you are not noticing it. There are studies that show that binge watching actually lowers the sense of enjoyment of an episode, and this is not something unpredictable. When our brain likes something, it actually tends to create delayed schedules of enjoyment to avoid familiarity: you don't want to eat the same food during the whole week, you want to create diversity. This reduces the hedonic adaptation effect.</li>
<li>Cramming all episodes in a 9 hour experiences means that you will feel the wait period for the new season unbearable. Although the release schedules are similar to shows that are released weekly, you will not feel it like that. After ending a season you will know that the next episode is far away down the timeline and this will create a sense of anxiety that will take from the enjoyment of the climax! Would you rather hace to wait a summer brake for the new season, or almost 7 months if not more?</li>
<li>This long breaks without content means that Netflix has to produce more content to fill the dead lapses of time. More content means less possibilities for great expectation campaigns, which build upon delayed and scheduled feedback to create excitement. Many times I have noticed that a new season was released the same day it was released, because the space for self promotion in the platform is overflowed. This also means that you will not be able to discover great shows and are totally at the mercy of the algorithm.</li>
<li>There are no clear cues of how long you will have to wait for then next episode. If there is a place for progress bars, this is one of them! This is made worst by the fact that the algorithm tends to show you series or movies you have already seen, or that you have been avoiding for a long time.</li>
</ul>
<p>This was something that was not that evident until Disney Plus and HBO Max starting rolling series with weekly schedules, and it's even something you can see that worked effectively in series like a Good Place, Arcane or now Stranger Things (4th season), which used scheduled systems to keep interest overtime.</p>
<p>For a behemoth like Netflix, that revolutionized the culture of video media in a real way, they have been slow to understand their experience problems. While no streaming platform has really good rules of service and have explored feedback elements in their interfaces to their full potential, Netflix will continue to lose ground if they don't change course.</p>
<p>So maybe, we need to really look beyond immediate gratification as a holy grail in human motivation and start learning from more complex and interesting systems of delivering information to the users, and remember that Dopamine works more on anticipation, than on reward. This should be the field in which we are, as gamification designers, creating real advancements to human experiences, let's not forget that.</p>`,
      faq: [
        {
          "question": "How does scheduled feedback differ from immediate feedback?",
          "answer": "Immediate feedback validates user actions in real-time, whereas scheduled feedback delivers updates at fixed intervals, leveraging anticipation and reducing emotional fatigue."
        },
        {
          "question": "What is the Netflix problem in experience design?",
          "answer": "Binge-releasing entire seasons creates instant gratification but leads to rapid memory decay, deprives the brand of community discussion, and accelerates hedonic adaptation."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: retroalimentación diferida y el problema de Netflix',
      excerpt: 'Examine cómo la retroalimentación diferida y programada genera anticipación y dopamina, contrastando este efecto con la cultura del consumo masivo de Netflix que acelera la saciedad y la ansiedad.',
      content: `<p>La gamificación partió de una premisa incorrecta, la idea de que el cerebro siempre prefiere la retroalimentación inmediata. Si bien la respuesta en tiempo real es útil para decisiones rápidas, la dopamina actúa principalmente mediante la anticipación, un aspecto que la cultura del consumo inmediato está ignorando.</p>
<p>Al diseñar sistemas de retroalimentación, utilizo cinco categorías:</p>
<ul>
<li><strong>Inmediata:</strong> El sistema responde en tiempo real para validar acciones y construir confianza rápidamente.</li>
<li><strong>Diferida:</strong> La entrega de la respuesta se pospone al momento óptimo para generar tensión y deseo mediante la anticipación, dosificando el flujo de dopamina.</li>
<li><strong>Programada:</strong> Define intervalos específicos para revelar resultados, organizando las expectativas y estructurando ciclos de uso.</li>
<li><strong>Tardía:</strong> La información llega cuando ya no es útil, generando ansiedad y desconfianza en la interfaz.</li>
<li><strong>Devaluada:</strong> La respuesta tarda tanto que pierde toda fuerza emocional y utilidad práctica.</li>
</ul>
<p>La retroalimentación diferida y programada abunda en el diseño de juegos, como el frenado progresivo de un personaje, la mezcla de una baraja o la espera del resultado de un sorteo. Muchos diseñadores confunden estos retrasos estratégicos con la retroalimentación tardía o devaluada, asumiendo erróneamente que todo debe medirse al instante.</p>
<p>Este error se ilustra con el problema de Netflix y su modelo de publicación de temporadas completas en un solo día. Aunque la respuesta inicial del usuario es positiva debido a la resolución rápida de la intriga, los efectos sistémicos resultan perjudiciales:</p>
<ul>
<li><strong>Pérdida de memoria a largo plazo:</strong> El consumo masivo impide asimilar detalles narrativos complejos, diluyendo la conexión con la historia a largo plazo.</li>
<li><strong>Ausencia de conversación comunitaria:</strong> La publicación semanal permite a los usuarios debatir, teorizar y crear contenido, manteniendo vivo el interés en el tiempo.</li>
<li><strong>Fatiga hedónica:</strong> El cerebro requiere espaciar el disfrute para evitar la familiaridad y mantener el valor del estímulo.</li>
<li><strong>Ansiedad ante la espera:</strong> Terminar una temporada en un día transforma la espera del siguiente año en un proceso insoportable.</li>
</ul>
<p>El éxito de competidores como Disney Plus y HBO Max mediante lanzamientos semanales demuestra el valor de la dosificación programada. Los diseñadores de motivación debemos superar la obsesión por la gratificación instantánea y aprender a diseñar sistemas que utilicen la anticipación para enriquecer la experiencia humana.</p>`,
      faq: [
        {
          "question": "¿En qué se diferencia la retroalimentación diferida de la programada?",
          "answer": "La retroalimentación diferida pospone la respuesta para el momento óptimo con el fin de generar tensión lúdica, mientras que la programada define intervalos fijos para la actualización del estado."
        },
        {
          "question": "¿Qué define al problema de Netflix en el diseño de experiencias?",
          "answer": "Consiste en la entrega masiva e inmediata de contenidos, lo que anula la retención de detalles a largo plazo y acelera la saturación o fatiga hedónica del usuario."
        }
      ]
    }
  },
  21: {
    slug: 'bem-gamification-the-value-of-a-definition',
    en: {
      title: 'BEM Gamification: The value of a definition',
      excerpt: 'Understand how definitions serve as boundaries and expectations in gamification design, moving beyond buzzwords to establish a rigorous, empowering discipline.',
      content: `<p>After a long long hiatus, I have decided to write something short again. It has not been the lack of will, but the lack of time. But an interesting post by Andrzej Marczewski prompt me to continue the discussion he has begun, from another point of view. This is not a rebuttal of that article, it's just a different take and I prompt you to read that as well.</p>
<p>The discussion about definitions can feel "academic", and, as with any discipline, there is no clear convention that states what something "is". Actually, it can be an academic discussion, if you understand that the effort of creating "definitions" is actually the need to create boundaries. But, if you know a bit of semiotics, you will know that linguistic signs can have an ample and arbitrary set of meanings (this happens a lot, in fact, with the word arbitrary).</p>
<p>If you enter the field of definitions as a way to "set" a final definition, it will become frustrating, as language is diachronic, which means, its definitions change with time: random once meant to run fast and carelessly. The thing is, this has created a culture of gamification consultants "correcting people", which is more a statement of knowledge than a real effort to use a definition for what it should be.</p>
<p>In this sense, we need to understand gamification in its whole semantic context: not for what it "is", but for what it can represent:</p>
<ul>
<li><strong>First of all, gamification is a buzzword.</strong> This means it has a certain power beyond a definition. Gamification has set a trend of design, but also a trend to convince investors, bosses or clients that what you are doing is cool and different. This is something we will never be able (or would want to) take away. In this sense, we need to accept that gamification will be used for game based designs or other things like escape rooms and alternate reality games. It has more commercial value.</li>
<li><strong>Second, gamification is a brand.</strong> My first language is spanish, but I prefer to talk about "gamificación" and not about "jueguificación" or "ludificación", which are often used by purists. Again, gamification has a commercial value, and I prefer to say that I have a Gamification company than a gamification, game-based design, serious board game design and alternative games company.</li>
<li><strong>Third, gamification creates communities of interest,</strong> as I love to know what other "gamification" consultants are doing, even if they are doing serious games. I find it weird that someone who enters the field of gamification doesn't have a love for designing games, and just stops on the whole "using game elements" thing.</li>
<li><strong>Fourth, gamification is a discipline and a series of methods.</strong> There are people researching better ways to gamify, which means sometimes going beyond the proposed definitions, but also, numerous frameworks appear because we need to be able to use gamification in a systematic way. In this sense, Hexad, Octalysis, the Hero's journey, BEM and so on are attempts to take all the knowledge base we have been creating and being able to create organization schemes for better designs.</li>
</ul>
<p>That being said, it would seem that creating a definition is futile. You can't define a disciple with a simple phrase, each framework bring its own definition, a community of interest will never fully agree on one take, and the industry will continue to use the buzzword as a way of branding and empowering their ideas, even if they are not gamification in a more rigorous sense. This might make consultants feel that this is an effort just to be discussed between other experts, researchers or consultants. But I think is more.</p>
<p>Definitions are part of a design process. It's not about correcting clients, it's about helping your client, and yourself, to understand the scope of a project. In my experience, I go a long way to try and work on definitions with my clients, even going to the trouble of explaining the difference between behavioral, experiential, meaningful, data-based or systemic based gamification approaches. This is not just for showing off (of course, it is a little, that gives you credibility in the process), but it also helps to align expectation.</p>
<p>Again, in my experience, clients that are offered different definitions and that work on understanding what they want their design to be, not also are more helpful in the design process (as they understand which boundaries to use), but also feel empowered by the new knowledge, feel part of a community of people that really understands what this is about, and feel more certain of what they are trying to accomplish.</p>
<p>So, my actual definition is too long to place on a single phrase, but the gist of it is:</p>
<blockquote>
<p>Gamification is a design discipline that leverages the knowledge of game design paradigms as a core to organize knowledge around psychology, semiotics, systemics and more, to incorporate them into contexts beyond game design.</p>
</blockquote>
<p>I think that definition is both empowering and understands there are nuances, schools of thought, different frameworks and approaches. From there I can define BEM in a more specific way, for example the idea of relying more on feedback elements than reward cycles, and so on.</p>
<p>This is not an all mighty truth, but I hope it gives some direction to the discussion.</p>`,
      faq: [
        {
          "question": "Why are definitions important in gamification consulting?",
          "answer": "Definitions are strategic tools that align expectations and establish the scope of a project, distinguishing between behavioral, experiential, and systemic approaches."
        },
        {
          "question": "How is BEM gamification defined?",
          "answer": "BEM is a design discipline that leverages game design paradigms to organize psychological and systemic knowledge, emphasizing structured feedback over simple reward cycles."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: el valor de una definición',
      excerpt: 'Comprenda cómo las definiciones actúan como límites y expectativas en el diseño de gamificación, trascendiendo el uso de modas comerciales para establecer una disciplina rigurosa.',
      content: `<p>Tras una prolongada pausa, he decidido escribir un texto breve. No ha sido por falta de voluntad, sino por falta de tiempo. Una publicación de Andrzej Marczewski me ha motivado a continuar el debate que él inició, aportando un punto de vista complementario.</p>
<p>El debate sobre las definiciones puede parecer puramente académico, pero resulta esencial para establecer límites claros en una disciplina. La gamificación ha oscilado entre la moda comercial y la práctica rigurosa, por lo que definir sus términos permite alinear las expectativas de cualquier proyecto.</p>
<p>Es preciso comprender la gamificación en su contexto semántico:</p>
<ul>
<li><strong>Como término comercial:</strong> Atrae inversión y despierta interés al presentarse como una propuesta innovadora, englobando diseños basados en juegos y salas de escape.</li>
<li><strong>Como marca:</strong> Posee una fuerza de mercado que supera las alternativas etimológicas complejas.</li>
<li><strong>Como comunidad:</strong> Agrupa a profesionales con un interés compartido en el diseño de experiencias lúdicas.</li>
<li><strong>Como disciplina:</strong> Sustenta marcos metodológicos como Hexad, Octalysis y el modelo BEM para sistematizar el diseño de motivación.</li>
</ul>
<p>Lejos de ser un ejercicio inútil de corrección académica, la definición es una herramienta estratégica que ayuda al cliente a comprender el alcance de su proyecto, distinguiendo entre enfoques conductuales, experienciales o sistémicos.</p>
<p>Propongo definir la gamificación como la disciplina de diseño que aprovecha los paradigmas del diseño de juegos para estructurar el conocimiento sobre psicología, semiótica y teoría de sistemas, aplicándolo en entornos ajenos al entretenimiento.</p>
<p>Considero que esta definición resulta integradora al reconocer matices, escuelas de pensamiento y metodologías diversas. A partir de ella es posible delimitar el modelo BEM como un enfoque centrado en los bucles de retroalimentación por encima de los esquemas de recompensa tradicionales.</p>`,
      faq: [
        {
          "question": "¿Por qué resulta crucial definir la gamificación en un proyecto?",
          "answer": "Establece los límites operativos y alinea las expectativas del cliente, permitiendo diferenciar entre gamificación conductual, experiencial o sistémica."
        },
        {
          "question": "¿Cómo define el modelo BEM a la gamificación?",
          "answer": "La define como una disciplina que utiliza los paradigmas del diseño de juegos para articular la psicología y la teoría de sistemas, priorizando la retroalimentación sobre la recompensa."
        }
      ]
    }
  },
  22: {
    slug: 'bem-gamification-learning-cycles-and-feedback-loops-part-2',
    en: {
      title: 'BEM Gamification: Learning cycles and Feedback Loops (part 2)',
      excerpt: 'Explore the design of mastery goals, performance reporting, optional training scenarios, and breadcrumbing effects to drive voluntary skill acquisition.',
      content: `<p>This is the second part of this chapter of the Book of BEM. This subchapter is about secondary goals in the design of learning cycles and feedback loops, which is one of the main parts of this chapter, so it will be broken in several parts.</p>
<h3>Goals of Mastery</h3>
<blockquote>
<p>"Bringing the message to Lady Dwin Lei was simple but long. Xei had a long trip ahead, 7 days of the most secure road, an easy goal with great pay. By the third day she found a path through the marshes that could shorten the trip a couple of days. She had the skill from her time as a ranger and was simply bored. No one ever heard from her again"</p>
<cite>- The Book of BEM - The lost love letter that could have united the Feuds</cite>
</blockquote>
<p>Mastery is achieved by self-reliance and potential growth. High performance players are constantly seeking new challenges, like the "Achievers" in Bartle's player types. For this players you can create different strategies, for example:</p>
<ul>
<li><strong>Escalated difficulties for the same tasks:</strong> have you seen those three-star feedback systems at the end of game levels? Getting the first star is usually the main goal, the one to achieve if you want to unlock the next level (progression loop), but the second and third are there to give you secondary goals of improved performance. In gamification this means being able to create escalated goals for you users, where they can decide to just move the game along, or do the hard task. As this is optional, you should not measure completing this hard tasks as a requirement, they must be voluntary.</li>
<li><strong>Optional bosses:</strong> Boss fighting or boss levels create natural main goals in your system, and create clear progression loops. But you will find many players enjoy more searching for optional hard bosses or hard levels. Have you played the secret levels in Donkey Kong Country? Have you fought in the Pantheon or the Colosseum of Fools, or passed the Path of Pain in Hollow Knight? Have you fought all the Valkyries in God of War IV? Have you fight the Ultima Weapons in Final Fantasy? Have you played all of Mario's optional levels? This are, again, optional tasks, that only those that are more Mastery oriented enjoy. This might nudge some players to give an extra mile of work, but only if they feel it's voluntary.</li>
<li><strong>Mentoring mechanics:</strong> in games with Guilds, like World of Warcraft, some emergent behaviors appear when some players get to a level were they are more driven to improve their guild members' skills, than to improve their own. Guild masters start to find ways of mentoring other players to have a more powerful community, so they can be able to make better cooperative missions. This leads to Masters teaching young padawans in the art of better game play. There is usually no mission that states you need to do this, but there is usually a systemic incentive to learn how to accomplish this.</li>
</ul>
<p>Mastery goals can be designed for groups, but I prefer to keep them around self-reliance and self-competence, and that is why I usually design these goals in term of individuals, performance and training. So let's check this out:</p>
<p>I don't think of single-player games anymore, that is old news right now. Would you rather play Assassin's Creed in single player mode, or playing online against other players? You do have a preference! And no, it's not the same one as everybody else's. Most games now have a mixture of single and multiplayer modes, as we have found out that there are gamers for both styles of play. So, single player modes are usually created around narrative development, or skill building. As we are talking about mastery oriented secondary goals, skill building would be a key part of challenge design. And skill building is one of the main concerns for gamification designers in many areas, like L&D. A goal that allows you to reinforce and improve a skill can be enticing for those that want to prove themselves to be self-competent, which means the reward must be some kind of measure of skill.</p>
<p>This brings us to performance reporting. In terms of feedback, many games report the performance of the player. Escalated difficulties are a way of creating this reports, but not the only one: think of shooters, where you get a detailed report of your stats after every game: how many headshots, kills, respawns, etc. If you are not a gamer, then relate with sports' stats, where players tend to be rated by skill related reports. This reports create a mission in themselves, but is not a declared objective, but an arbitrary goal the player sets for herself. Reports, in this way, are not rewards in themselves, but reward the players when they improve those stats, which incites skill building.</p>
<p>Does this happen in every game type? Sure... let's go back to Takyon. While virtual systems can measure everything and report back based on counters and algorithms, board games still give enough information to help players feel masterful. Players do have information based on their playthrough, specially if they play several times, as they can compare their performance with their past selves. Many players even record those results in apps like Boardgamegeek so they can track the data in a digital interface, and they do it mainly by recording the victory points and place in the position board. But, also, players can analyse how many resources they ended up with, how many building each player got, how far along the game they manage to advance and so on. The game gives the information, players need only to make inferences around that information to get their performance report. But the last source of data is actually speaking with other players: after you finish a game of Takyon, you will start talking about the highlights of the game: "when you landed in South America and took that last tech, triggering a paradox, I missed my chance and had to improvise! I did not expect that!". This information gives context for skill improvement, as it allows the brain to assess the results of the effort.</p>
<p>Which brings us to the last aspect of mastery oriented goals: training. One of the most powerful things about games is that they are training systems in essence. But training is not only about creating a save environment for practice, as you might think from real life training designs. Yes! You could have training sessions, but that would be weird if you are playing a board game, for example, because most games are played in a friendly environment, not in a competitive one, so each playthrough is a training session! So, if you are playing Double Dragon, a hard game in itself, and each playthrough is a training session, what else could account as training in the game environment?</p>
<p>Remember, we are talking about secondary goals, and certain goals can be designed to create training scenarios for certain skills, like bonus levels. Have you played Crash Bandicoot's Bonus levels? Well, they are optional, but player's tend to love getting in there and getting all the boxes! These levels have a particular design, where some particular skill is tested to a limit, where you need to time really well a particular technique to achieve the goal. But you are not playing to train the ability! That's what is boring about lifting weights in real life for many people: you are doing it to train. But in Crash you are doing it to get the boxes. Why? because getting all the boxes in a level gives you a gem, which triggers the chance of finishing the game with 100% discovered! Game psychology sometimes seem really counterintuitive, because we don't find these kind of behaviors in real life as much. But this happens in part because most of our work is mandatory, not optional, not intrinsic by design. Now, a player is losing most of her lives jumping around doing something not needed to achieve the main goal! The brain is rewarded by the feeling of improved skill sets as well as a feeling of self-competence, but if you don't manage the level, well, it's not that bad, that's optional after all, there are still many challenges worth your while.</p>
<p>So, what can you get from all of this for you gamification designs? You don't have to enforce skill building, you must entice it. How? By making the center of the game not about developing the skill, but about using it to achieve a clear goal. The secondary objective doesn't say: "Learn how to jump higher and bounce in boxes to reach high places", it only says "get all the boxes and reach the end of the bonus level (if you wish)".</p>
<p>Now, Crash does makes these bonus levels a safe environment, in the sense that you never actually lose lives trying them, and you can give up if you want after each run. This is because, the harder the task, the lower the consequences should be: the bonus levels are short and safe, a great way to test your skills. But that's not always the case: Donkey Kong Country Tropical Freeze secret levels are actually the opposite: long and punishing! In these levels, player's don't get checkpoints (those cute pigs that celebrate with flags when you reach them), so they always have to restart from the beginning, and you do lose lives here! How they compensate for this? Well, you usually get to this worlds with 80+ lives, so you have many to lose (and you lose many!), but you also start feeling the learning curve early on. Let me explain with a personal anecdote.</p>
<p>If I can say I have a secondary mastery-oriented goal in life, it is playing classical guitar. I've never wanted to make money out of that, nor I think it will bring me any usefulness in life. But I love trying to get those hard pieces right! The one I loved the most getting right was actually Drifting from Andy Mckee, which I have forgotten already. What does this have to do with Donkey Kong Country? Well, learning a big piece is both a long endevour and a punishing one! To get all five minutes of the piece right, you need to train and train a lot each passage. But there is an effect that can help you with the frustration, if you really want to do it: when you start with the first part, you have this melodic parts that create a breadcrumbing effect. So, you start by needing to get right the first seven to eight bars, and you feel that is achievable. When you get there, you might still not be prepared to do it perfectly, but you push through the next eight bars: so you keep training the first part while you struggle with the second part. Then you get to those lovable double bars, where you need to repeat the whole thing over: you first achievement! This becomes a virtual checkpoint in terms of achievement: you managed to get there!</p>
<p>This breadcrumbing effect is what keeps mastery-oriented players trying and trying to do something that is not needed to finish the game! Let's go back to DK: these levels are hard, but have a pacing, an engagement rhythm, so after a having to make a few things in perfect sequence without breathing, you reach a platform with lesser challenge, and you feel "I got here! Next segment!" And while trying to do the next segment, by repetition you start building mastery on the first one until a point when you almost never lose. And then you have measurable knowledge of improved skills: that part that seemed impossible at first is now a breeze.</p>
<h3>Now back to the real world</h3>
<blockquote>
<p>"It was a late night when the white fox of the Aeonwoods found a Will o' the Wisp: a red shimmering light that seemed from a different dimension. She chased it playfully until they reach a circle of small stones in the form of a different planet. Blue and green stones glowing in the night marked a center and the fox stepped in, never to be seen again"</p>
<cite>- Book of BEM - The Myth of the Dull Dimension</cite>
</blockquote>
<p>Gamification is about applying this concept in the real world, and while there is much to say still about the learning cycle, and secondary goals in particular, this seems to be a good place to start grounding this knowledge in non-game designs! I began with Mastery and Progress because this is a big part of L&D and education concerns, which is one of the main areas I work with. But even in other kinds of behavioral, cultural and cognitive designs, like cultural transformation, this is a big thing: better to teach than to nudge, that's the BEM way.</p>
<p>The first thing is understanding the skill sets required to solve the problems you are tackling. Let's say you want to help your service employees in the front to better solve customer problems. Classic instructional design would create a lot of material, both in video, text and infographic formats, and assess through Q&A mechanics. But the main problem with this design is that in Q&As, the feedback is final: you usually get corrective and assessment feedback that does not allow for replayability. Imagine this question:</p>
<p>"If a customer is frustrated and being rude because customer support hasn't been able to solve his issue in over a month, what would be the first thing you should do, according to the material, to calm him down?"</p>
<p>Now you get several options and you choose one. There are two possibilities here: "That is correct!" or "Incorrect answer". You can gamify those messages as much as you want with texts like "Victory!" or "Defeat", but the underlying problem is not solved. If you get the incorrect answer, you have two choices, to show the correct answer, or not. Spoiler alert, both are awful. Why? First case: you gave the correct answer to the player. What's next? If you repeat the challenge, you gave the answer away, so there is no learning cycle, but if you continue with another challenge, another question, there is no way to reinforce this new knowledge in memory. And even if you manage to reinforce it by, say, sending the question again after a couple of other questions, the skill you are developing is memory. Students will try to power through the answers, remembering them in the short term to be able to pass the exam. But let's say you don't give the correct answer, so you can create a small learning cycle: again, people will optimize the goal by learning what to discard the next time the answer appears. There is no required inference or real skills required for this process, and skill building lasts more than memorization.</p>
<p>Now, let's change this design following the gamified way. First we need a narrative goal that could engage them, so you don't give them pdf's to read or videos to watch, but problems to solve. You say: "You are the best customer support employee on the company, but difficulties on the production line have left many customers in an enraged state. You are called to help calm the angry mob!". From the narrative goal you get into problem solving mode, it's not about learning content, is about proving yourself as the best. Now, the main goal states that clients will come in waves, and you need to survive each wave before getting to the next.</p>
<p>To achieve the main goal you have a Q&A-like mechanic, but you don't get questions and answers: you get the client's situation, profile information on that client, her history of purchases, and indicators of voice tone and respiration rate. From there you get 3 basic actions that work in different scenarios, like: "explain things in a rational way", "be empathetic with the customer" and "ask more questions about her condition". After selecting an action, the game will not give you feedback yet, but you get a series of strategies used by that kind of action: for the first action they could be "Give clear details of how the process is moving along", "Explain the process the customer has to do to get a quicker response", "Explain the roadblocks for the process and how to tackle them". The player looks at all the information available and makes a choice.</p>
<p>Most problems in life are contextual and have gray areas, and the best customer support employees have the ability to read between lines and adapt depending on the context, not the ones that follow a script. So, here, we understand that the skillset required to tackle these problems is the ability to infer actions from different informational sources, which requires knowledge of the process and emotional intelligence. This might be way better than classic challenges, but we are not done yet!</p>
<p>Remember, secondary goals are really the secret sauce, and from this example will be able to start grounding this concept for every driver. Mastery oriented secondary goals are about performance, training, scaled difficulty, rhythm and pacing. Some quick ideas to get this working:</p>
<ul>
<li><strong>Scaled difficulty:</strong> to succeed you need to calm the client down around 20%, but if you calm them more than that, you will get different badges for performance.</li>
<li><strong>Performance reports:</strong> After each wave, you get stats on all the clients you managed, showing your weak points and the kinds of clients you struggled with. Now you can replay if you want to improve those numbers and get a better report.</li>
<li><strong>Bonus level:</strong> randomly, an alert message appears that states that a horrible client approaches, which can give you extra report points, but that you can also send to another team mate instead, to avoid.</li>
<li><strong>Difficulty choice:</strong> before receiving the customer you get two with different difficulty ratings. You choose which one to attend.</li>
<li><strong>Perfect run:</strong> you get a badge if you make no mistakes (if that's possible).</li>
<li><strong>God mode:</strong> Some data about the client will be hidden and you must infer it from the other information. If you choose god mode, you can actually finish the game with 100% completion.</li>
<li><strong>Optional boss:</strong> after some waves, if you manage to get high ratings in most of the clients, you can do an optional client marked with a skull: just one, it's not in a wave, but it's the worst case scenario. You won't lose reputation for this one and can retry all you want. There is a board that shows how many skull clients each learner has been able to defeat.</li>
</ul>
<p>As you can see, all of these are non-mandatory and avoidable, but think for yourself: would you engage with any of this goals? Probably yes! They are almost rewardless, but they make the game way more interesting than just doing the same thing over and over again. They bring additional challenge to the table, but you are not forced to solve it, nor you have to feel bad for it.</p>
<h3>Goal of Empowerment</h3>
<blockquote>
<p>"The halfling wanderer reached the old city of Davios, famous for their savage colosseum. The city was in his path towards Gallion, where his sister was last seen. Near the colosseum he was challenged by a Barbarian with a two-handed axe. The halfman entered the colosseum, followed by the incredulous eyes of the Barbarian and crowd. In the center, he chanted silently to the gods. The fires that ravaged the city lasted days."</p>
<cite>- Book of BEM - "Tales of the survivor of Davios, the wanderer's apprentice"</cite>
</blockquote>
<p>While mastery tackles with skill sets and measurable progress, empowerment is about certainty, dominance, property and control. As we saw from the very beginning, this is the hardest driver to design for, but it's key on the design of learning cycles, so I will just focus on the ways empowerment goals can be designed to engage these other type of players.</p>
<p>Empowerment and Control requires, first of all, justice and balance. Systemic injustice pushes players away, and knowing you can't beat other players just because the system is designed that way can damage your enjoyment of the platform. Injustices happen when you feel a game state is unachievable by you, that you are locked out of a possibility that you wish to have, but that other players can achieve by other means. To increase fairness, there are several thing that can be done, even from the design of your goals.</p>
<p>Empowerment goals bring certainty to the system, which is really important to weight out the effects of randomness in games.</p>
<p>If you want me and my team to be part of your gamification project, and feel like we can make a difference, just write to javier@f2p.co. I hope you can see we have a mature framework and are eager to share our knowledge!</p>`,
      faq: [
        {
          "question": "How does BEM approach mastery in learning cycles?",
          "answer": "Mastery is scaffolded through optional challenges like escalated difficulties, optional boss scenarios, and performance reports that encourage self-competence and voluntary replayability."
        },
        {
          "question": "What is the breadcrumbing effect in game design?",
          "answer": "It is a design technique that paces player effort by dividing complex, high-friction tasks into small, progressive segments, separated by virtual checkpoints to reduce anxiety."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: ciclos de aprendizaje y bucles de retroalimentación (parte 2)',
      excerpt: 'Explore el diseño de objetivos de dominio, informes de rendimiento, escenarios opcionales de entrenamiento y el efecto de fragmentación de difficulties para impulsar la adquisición voluntaria de habilidades.',
      content: `<p>Esta es la segunda parte del capítulo sobre ciclos de aprendizaje en el modelo BEM. Analizaremos los objetivos secundarios en el diseño de bucles de retroalimentación, abordando cómo estructurar el crecimiento voluntario del usuario.</p>
<h3>Objetivos de dominio</h3>
<blockquote>
<p>"Llevar el mensaje a Lady Dwin Lei era simple pero largo. Xei tenía un largo viaje por delante, siete días del camino más seguro, un objetivo sencillo con gran recompensa. Al tercer día, encontró un sendero a través del pantano que acortaba el viaje. Tenía la habilidad como exploradora y estaba aburrida. Nadie volvió a saber de ella."</p>
<cite>- El Libro de BEM - La carta de amor perdida que pudo unir los feudos</cite>
</blockquote>
<p>El dominio se alcanza mediante la autoconfianza y el crecimiento continuo. Para los usuarios orientados al logro, diseñamos estrategias específicas de maestría:</p>
<ul>
<li><strong>Dificultades escalonadas:</strong> Sistemas opcionales de calificación por estrellas que permiten al usuario avanzar con lo básico o esforzarse por metas de alto rendimiento de manera voluntaria.</li>
<li><strong>Desafíos y jefes opcionales:</strong> Niveles secretos o enemigos de alta complejidad que solo atraen a los usuarios motivados por el autodescubrimiento y el esfuerzo puro.</li>
<li><strong>Mecánicas de mentoría:</strong> Sistemas cooperativos donde los usuarios avanzados encuentran satisfacción al enseñar a los novatos, fortaleciendo el desempeño grupal.</li>
</ul>
<p>El desarrollo de habilidades es una prioridad en la capacitación corporativa. Los informes de rendimiento detallados actúan como incentivos implícitos al permitir que el usuario evalúe su progreso y establezca metas personales de mejora.</p>
<p>Los escenarios de entrenamiento no deben ser obligatorios ni punitivos. Diseñamos niveles de práctica seguros donde el error carece de consecuencias graves, reduciendo la ansiedad y estimulando la persistencia. La técnica del fragmentado de dificultades divide un desafío extenso en segmentos manejables con pequeñas victorias intermedias, facilitando la concentración y el aprendizaje progresivo.</p>
<p>En el diseño gamificado, evitamos los cuestionarios tradicionales con respuestas correctas fijas. Proponemos en su lugar escenarios complejos y contextuales basados en la toma de decisiones estratégicas, donde el usuario evalúa múltiples variables y aprende mediante la simulación de consecuencias.</p>
<h3>Retorno al mundo real</h3>
<blockquote>
<p>"Era una noche tardía cuando el zorro blanco de los bosques eternos encontró un fuego fatuo. Lo persiguió hasta un círculo de pequeñas piedras en forma de otro planeta. Las piedras brillaban en la noche y el zorro entró en el centro, desapareciendo para siempre."</p>
<cite>- El Libro de BEM - El mito de la dimensión aburrida</cite>
</blockquote>
<p>La gamificación consiste en aplicar estos conceptos en el entorno laboral y educativo. La base del modelo BEM radica en la premisa de que resulta muy superior enseñar antes que simplemente empujar al usuario mediante incentivos visuales.</p>
<p>El diseño de metas de maestría secundarias aporta dinamismo y enriquece la experiencia del empleado o estudiante mediante varios esquemas prácticos:</p>
<ul>
<li><strong>Dificultad progresiva:</strong> Calificaciones opcionales que premian el desempeño excepcional con reconocimientos simbólicos de alta reputación.</li>
<li><strong>Informes detallados:</strong> Estadísticas de rendimiento que destacan las fortalezas y áreas de mejora tras finalizar cada bloque de trabajo.</li>
<li><strong>Niveles especiales de prueba:</strong> Retos imprevistos de gran dificultad que el usuario puede intentar de forma voluntaria para obtener bonificaciones de reputación.</li>
<li><strong>Modo avanzado opcional:</strong> Ocultar ciertos datos para obligar al usuario a deducir el proceso basándose en su experiencia previa.</li>
</ul>
<h3>Objetivos de empoderamiento</h3>
<blockquote>
<p>"El viajero mediano llegó a la vieja ciudad de Davios, famosa por su coliseo salvaje. El coliseo estaba en su camino. Fue desafiado por un bárbaro con una gran hacha. El mediano entró al coliseo bajo la mirada del público y cantó en silencio a los dioses. Los fuegos que consumieron la ciudad duraron días."</p>
<cite>- El Libro de BEM - Relatos del sobreviviente de Davios</cite>
</blockquote>
<p>Mientras que la maestría aborda las habilidades y el progreso medible, el empoderamiento se centra en la certeza, el dominio, la propiedad y el control sobre el entorno. Esto exige balance y equidad sistémica en el diseño de las reglas para asegurar que el esfuerzo de cada usuario sea respetado.</p>`,
      faq: [
        {
          "question": "¿Cómo estructura el modelo BEM la maestría en el aprendizaje?",
          "answer": "A través de desafíos opcionales, informes de progreso detallados y la ausencia de penalizaciones severas en los niveles de práctica, promoviendo el esfuerzo voluntario."
        },
        {
          "question": "¿En qué consiste la técnica de fragmentado de dificultades?",
          "answer": "Es un método de diseño que espacia los picos de dificultad dividiendo un reto extenso en pequeños segmentos separados por puntos de control virtuales."
        }
      ]
    }
  },
  23: {
    slug: 'bem-gamification-learning-cycles-and-feedback-loops-part-1',
    en: {
      title: 'BEM Gamification: Learning cycles and Feedback Loops (part 1)',
      excerpt: 'Discover how to structure robust learning cycles using narrative goals, main objectives, endgame triggers, failing states, and optional strategic paths.',
      content: `<p>One of the main distinctions I like to make between BEM Gamification and other frameworks is that BEM has a center on game design paradigms and not on the use technics or mechanics libraries based on drivers or behavioral goals. The other big one is that I use behavioral science approaches to reduce cognitive loads, not to steer behaviors, but to guide the player with appropriate notifications and waypoints. If you want to reduce failure states or emergent behaviors, BeSci might be better suited for you, but if you want a system that not only nudges behaviors but that also creates a cognitive change, you'd better start working on gamified learning cycles.</p>
<h3>First, there was the game goal and the game state</h3>
<blockquote>
<p>"Brederick, the master, stumbled into Rei, a hard-headed dwarf with little interest for the arcane arts. He wanted to motivate her with a brilliant speech on how magicks had changed the world and how this skill would let her be appraised by the kingdom or Uir. After three passionate hours of lecture, she was not impressed"</p>
<cite>- The Book of BEM - The origins of the Rei, the Dark Lord of Uir (part 1)</cite>
</blockquote>
<p>Imagine you stumble into a board game store, that has a lot of tables and people are playing all sort of games. You enter and start browsing them, looking at the boxes and tables and you notice some dark titles: Arkham Horror, Mansions of Madness, Dice Forge, Roads and Boats, Food Chain Magnate, Everdell, Imaginarium and so on. Many of the players have actually joined some tables together because of the sheer magnitude of space needed to put the boards and pieces.</p>
<p>Games are not "intuitive" designs at all! Regular UX/UI parameters don't apply. You see there is a uniformity of conventions, but still, can't even start understanding what each icon on the boards means. Games are about artificial rules and defamiliarization: a game designer twists regular conventions and creates systems that are not there to make things easier for people, but the whole opposite. You see in Imaginarium there is a "market", but it really works as a conveyor belt and you pay with carbonium depending on the position in the belt. This goes against the rules of everyday market mechanics.</p>
<p>This might be the main reason why games have developed so efficient and effective learning techniques. Every game must be taught. Every game must be learned. Board games designers have been slow on developing proper learning tools for their games, but video game design has a whole topic on how to create great tutorials, because you just can't have human teachers teaching the game.</p>
<h3>Narrative Goals</h3>
<blockquote>
<p>"In the dark corners of the Stench, the swamp Lord put his plan in motion. Others had tried to get the gem of the necromancer, but death and despair was all they could find beyond the gates of Orgk. But his people knew despair and death anyway from the horrid swamps, so they would not back off"</p>
<cite>- The Book of BEM - The extinction of the swamp clans of the south</cite>
</blockquote>
<p>The first thing to notice is that players start by giving you a narrative background: "You see, the world entered an environmental crisis and had to leave Earth for Nova Terra. There, they started researching Takyons to create time machines. They built an AI that determined Earth could be saved if they manage to accomplish 12 history-changing missions, by sending technologies from one era to another, but each change would create a paradox that could destroy the world. So, we are time agents working on time-locked time machines, trying to save the Earth."</p>
<p>This is a big part of the learning cycle. Much has been said about engagement, but remember, one of the main drives is Epic Identity, which relates to building purpose. If you have to learn a complex system, you need to be motivated, but trying to give arguments on the skills you will develop by playing the game is just not that motivating. Games create a Lore, a background of information that creates conflict, as conflict builds purpose. We can relate with fictional missions sometimes even more than with actual real life ones!</p>
<p>But there is a big part remaining: who are you on this whole panorama? "Each player represents a future corporation trying to win influence by making the most history-changing missions to secure their name on the annals of history. Your mission is to be able to complete more missions than everyone else." It's not just about building competition, which is just another way to create conflict, it is about understanding your role in the game. You want to know who you are and your drives, as this helps to make them your own.</p>
<h3>The Main Goal and End Game Triggers</h3>
<blockquote>
<p>"The battle was intense. The party could see the cup of eternity in the altar, a long life awaited for them. But the wyvern was powerful, with a breath hot as the sun. Naimi avoided the claws and tail searching for a way to hit the heart and, finally, after a masterful roll, she saw an opportunity to stab. Naimi walked to the cup and drank its magic waters: eternal life. Then she looked back to find all her close friends dead. The fight ended, but she lost..."</p>
<cite>- The Book of BEM - The myth behind the 300 year old crazy witch-warrior of Mur</cite>
</blockquote>
<p>Now, the players change from narrative mode to mechanical mode. The first thing is you need something more concrete: where should I start? Every game has some main objectives, things you need to accomplish to get to the victory state: "To accomplish this goal you will try to get influence points. The player with the most points at the end of the game wins." Points can have different meanings, which will be important when we start reading the game state.</p>
<p>Main goals can be points, but they can be other kinds of game states, like reach the pole in Mario, or being the last man standing in chess or Fortnite. "Whenever we have collectively reached 12 missions, the game ends and we do some game end scoring, depending on the missions we achieved." Some gamification projects neglect having endgame triggers, as they expect the game to go on forever, but this can become unmanageable. This can be solved by creating bigger cycles of play, like seasons or tournaments.</p>
<p>Main goals usually create a sense of progression by creating a progression loop. The best reward for a main goal is to move the game forward. Gamification designs usually suffer from creating main goals around spending currencies, but this does not move the game forward. If your main goal in the workplace is to get a salary, you will feel stagnant really quick. Our brain asks for progression loops, and gamification designers artificially design these goals so you feel compel to achieve those main goals to feel Mastery & Progression.</p>
<h3>Failing states and avoidance goals</h3>
<blockquote>
<p>"The archers of the Dark Forest were famous for their venom. A single graze and a soldier would fall. Enormous shields were manufactured and hard plates covered the Prince's army. The army advanced, killing every archer in the way, until they found the archers' Shar'ig. One blow and the war would be over. The Shar'ig jumped as if boosted by hidden wings and cut the prince's throat with a regular dagger. The war was over."</p>
<cite>- The Book of BEM - Numurs' annals: the only war ever lost</cite>
</blockquote>
<p>In competitive games, usually not getting to the podium means you are a loser. This is the easiest way of creating failing states, but not necessarily the best. So the rules continue: "Beware! This is a semi-competitive game, which means one of us can win, but we might all lose! Each time we complete a mission, a paradox will appear on the board and will lock travelling to some continents. If any continent gets two paradoxes it becomes permanently locked. If at any point three continents are timed-locked, we all lose the game, so if you are winning, you should be careful."</p>
<p>Failing states create avoidance goals, which are key for creating stakes in the game design. These avoidance goals can be severely punishing, but usually a game designer creates failing states that trigger punishing conditions you can recover from. Every pain you create (losing XP, losing a challenge, being hit by an enemy, being surpassed in the leaderboard) has a probability of making you lose a player. How you manage your frustration threshold is important, as lowering this odds can actually hinder the experience for players driven towards approach through mastery.</p>
<h3>Secondary goals and strategic paths</h3>
<p>Here comes one of the main engagement systems used in game design: a game design paradigm that is still not so used in gamification: optional missions and strategic paths! "Now, there are different ways of getting these influence points: you can get them from technologies, or from completing missions in three levels of difficulty." No game has a dominant path to achieve a goal. Games create choices where multiple paths seem equally rewarding, creating styles of play and variance.</p>
<p>In board games you actually incentivize different paths by locking some for certain players depending on rules. Not being able to repeat game actions or having to pay other players to perform an action creates conflict in the decision making process, as you can't farm the same action twice: you need to create a strategy, a model of thinking about the future. These secondary goals are designed based on the seven drivers, starting with Mastery.</p>`,
      faq: [
        {
          "question": "What is the difference between BEM and traditional gamification?",
          "answer": "BEM focuses on fundamental game design paradigms and meaningful choices, using behavioral science to guide players rather than dictate behaviors."
        },
        {
          "question": "Why are narrative goals crucial in gamification?",
          "answer": "Narrative goals construct an Epic Identity and systemic purpose, leveraging conflict to motivate players through learning cycles."
        }
      ]
    },
    es: {
      title: 'Gamificación BEM: ciclos de aprendizaje y bucles de retroalimentación (parte 1)',
      excerpt: 'Descubra cómo estructurar ciclos de aprendizaje robustos mediante objetivos narrativos, metas principales, detonadores de fin de partida, estados de fallo y rutas estratégicas opcionales.',
      content: `<p>El modelo BEM se centra en los paradigmas del diseño de juegos para estructurar el aprendizaje, utilizando la ciencia del comportamiento no para limitar la libertad del usuario, sino para guiarlo mediante información clara. Diseñamos con el objetivo de generar una transformación cognitiva real a través de ciclos estructurados.</p>
<h3>El objetivo del juego y el estado de la partida</h3>
<blockquote>
<p>"Brederick, el maestro, se encontró con Rei, una enana obstinada con escaso interés por las artes arcanas. Intentó motivarla con un brillante discurso sobre cómo la magia había cambiado el mundo. Tras tres horas apasionadas de sermón, ella no se mostró impresionada."</p>
<cite>- El Libro de BEM - Los orígenes de Rei, la Señora Oscura de Uir (parte 1)</cite>
</blockquote>
<p>Imaginemos entrar a una tienda de juegos de mesa repleta de mesas y personas interactuando con diversos títulos complejos, como Everdell o Imaginarium. La magnitud de componentes y tableros resulta abrumadora a primera vista.</p>
<p>Los juegos no son diseños intuitivos de manera convencional, las reglas de usabilidad tradicionales no aplican de forma lineal. Se construyen mediante reglas artificiales que rompen con lo cotidiano, forzando al usuario a asimilar un lenguaje nuevo para operar en un ecosistema diferente.</p>
<p>Esta complejidad explica por qué los videojuegos y juegos de mesa han desarrollado técnicas de enseñanza altamente eficaces. Cada juego debe enseñarse y aprenderse. Los tutoriales interactivos permiten asimilar mecánicas complejas de forma autónoma y fluida.</p>
<h3>Objetivos narrativos</h3>
<blockquote>
<p>"En los rincones oscuros del pantano, el señor de la ciénaga puso en marcha su plan. Otros habían intentado obtener la gema del nigromante, hallando solo muerte más allá de las puertas de Orgk. Pero su pueblo ya conocía la miseria del pantano, por lo que no retrocederían."</p>
<cite>- El Libro de BEM - La extinción de los clanes del pantano del sur</cite>
</blockquote>
<p>El aprendizaje lúdico comienza estructurando un contexto narrativo, describiendo la ambientación y el conflicto central de la partida para construir una Identidad Épica. El conflicto genera propósito, atrayendo la atención del usuario de manera más profunda que la simple descripción de las habilidades a desarrollar.</p>
<p>Además, definimos con precisión el rol del jugador en este contexto. Al asumir una corporación espacial o un agente del tiempo, el usuario asimila el papel como propio, lo que otorga sentido a sus futuras decisiones estratégicas en el sistema.</p>
<h3>Meta principal y detonadores de fin de partida</h3>
<blockquote>
<p>"La batalla fue intensa. El grupo veía la copa de la eternidad en el altar. Pero el dragón era poderoso. Naimi esquivó las garras buscando el corazón y, tras una tirada maestra, logró apuñalarlo. Bebió de la copa, pero al mirar atrás vio a sus amigos muertos. La lucha terminó, pero ella había perdido..."</p>
<cite>- El Libro de BEM - El mito de la guerrera loca de Mur</cite>
</blockquote>
<p>La narrativa se traduce en metas mecánicas concretas. La meta principal define las condiciones de victoria y la progresión dentro del sistema. En muchos diseños, la partida concluye mediante detonadores de fin de juego que detienen el ciclo de juego y proceden al recuento final de logros.</p>
<p>Los bucles de progresión permiten avanzar en el juego. En la gamificación aplicada, evitar el simple esquema de acumulación y gasto de puntos resulta crucial, pues esto estanca la experiencia. El cerebro requiere percibir un crecimiento real en sus capacidades y estatus.</p>
<h3>Estados de fallo y metas de evitación</h3>
<blockquote>
<p>"Los arqueros del bosque oscuro eran famosos por su veneno. Un rasguño y el soldado caía. Enormes escudos cubrieron al ejército del príncipe. Avanzaron eliminando arqueros hasta encontrar a Shar'ig. Un golpe y la guerra terminaría. Pero Shar'ig saltó y cortó la garganta del príncipe. La guerra había terminado."</p>
<cite>- El Libro de BEM - Los anales de Numurs</cite>
</blockquote>
<p>Los estados de fallo construyen metas de evitación, otorgando peso y tensión a las decisiones de los jugadores. Diseñamos penalizaciones que desafíen al usuario sin llegar a frustrarlo o desmotivarlo de forma definitiva, balanceando la dificultad según la curva de aprendizaje.</p>
<h3>Objetivos secundarios y rutas estratégicas</h3>
<p>Para evitar que exista un único camino hacia el éxito, implementamos misiones opcionales y rutas estratégicas. El diseño óptimo ofrece múltiples alternativas igualmente viables, impulsando al usuario a experimentar con la toma de decisiones estratégicas basadas en sus preferencias.</p>
<p>Bloquear ciertas acciones o introducir costos de oportunidad por repetir movimientos fomenta el pensamiento estratégico a largo plazo. Así, los objetivos secundarios canalizan la energía del usuario de forma voluntaria y alineada con los siete impulsores del comportamiento.</p>`,
      faq: [
        {
          "question": "¿Qué diferencia al modelo BEM de la gamificación tradicional?",
          "answer": "BEM prioriza los paradigmas del diseño de juegos y las elecciones significativas sobre los esquemas simples de premios y medallas."
        },
        {
          "question": "¿Cuál es la función de los objetivos narrativos?",
          "answer": "Construyen un contexto de Identidad Épica que involucra emocionalmente al usuario, justificando el esfuerzo requerido para dominar el sistema."
        }
      ]
    }
  },
  24: {
    slug: 'thoughts-about-the-gamicon21v-line-up-and-the-topics',
    en: {
      title: 'Thoughts about the Gamicon21v line-up and the topics.',
      excerpt: 'An insightful review of the Gamicon 2021 presentation line-up, analyzing key topics in intrinsic motivation, emotional design, behavioral science, and academic research.',
      content: `<p>I've been wrapping my head around the idea of a 24 hour, 2 day experience gamification event, as trying to figure out what I want to attend is a real choice in its own. I know between work and sleep, I will have to choose the ones I will want to attend right on the spot, but it's been a titanic endeavour. So I decided, for my own sake, to write my thoughts on each of the conferences, so here it is if it might help you as well.</p>
<p>Of course, everyone here has merit and if I say I won't be attending one it's only based on my own motivations and what I can deduce from the descriptions. There are many speakers I don't actually know, so there can be a lot of speculation here. I just think that if you read me, maybe you have a similar understanding on what you'd wish to find in the event, but feel free to disagree.</p>
<ul>
<li><strong>Yu-kai Chou:</strong> If you are relatively new to gamification this would be a must-see. Octalysis has paved the way for many frameworks, including my own, and has a nice clear approach to motivation and human based design.</li>
<li><strong>Susan Peahl:</strong> I do believe this can be a really fun playshop, but creativity and thinking about what I can't do is not my issue really, so I might have to pass on this one for the sake of my limited attentional resources.</li>
<li><strong>Kevin Bell:</strong> Kevin's lecture description includes Intrinsic Motivators, which means that it aligns well with my interests, and if you are not knowledgable around this topic, you should go and learn about this.</li>
<li><strong>Eric Nelson:</strong> I think the best merge of Design Thinking and Game Design is Amy Jo Kim's Game Thinking framework, but a new approach to this topic would be interesting to check.</li>
<li><strong>James Bishop:</strong> I love James' work and escape rooms are amazing! If I'm not there it would be because of the time, but this is one that must be lived, not viewed after.</li>
<li><strong>Abhilash Purohit:</strong> The description does not give a clear idea of what this one would be about, but his work intersects learning and technology, so check it out if you are searching for tools for gamified learning.</li>
<li><strong>Kerstin Oberprieler:</strong> I love Kerstin's work! She is a really academic/designer type that is not easy to find. Her case studies are really clever, so keep an eye on her work!</li>
<li><strong>Pete Jenkins:</strong> Well, Pete is a well known gamification master, so what is there to say. Guru of Gamification Europe and an essential speaker.</li>
<li><strong>Loredana Zaharescu:</strong> I might check this one out. The whole idea of working beyond PBLs and helping people get better on that skill is not easy, so there might be a few things to learn.</li>
<li><strong>Rob Alvarez:</strong> Professor Game itself will be here! He has heard first hand from the main gamification gurus so his knowledge base must be amazing.</li>
<li><strong>Ashley Parker:</strong> This one is a must see for me. Ashley seems to bring to the table some interesting ideas on branching narrative games and the resulting imbalances.</li>
<li><strong>Adam Palmquist:</strong> Wow, this is an academic approach! I expect this one to be filled with hard data, and I would not expect it to be so much sexy as really insightful. My kind of deal.</li>
<li><strong>Javier Velásquez:</strong> This is must see, of course. No more comments!</li>
<li><strong>Jim Egan, Naomi Pariseault, Dave Eng:</strong> An open topic around the ethics of gamification, which I love. I know Naomi and Dave, and know how serious they are in the field.</li>
<li><strong>Dr. Larysa Nadolny:</strong> This one is a must go for me! Again, I love the academic approach, and I think this will be like reading a meta-analysis, but in a more dynamic presentation.</li>
<li><strong>Chuck Sigmund:</strong> I think these topics around dark patterns and manipulation techniques in gamification are a must check. Everyone working in the field should know about this.</li>
<li><strong>David Chandross, PhD:</strong> This one is a don't miss for me. David's work is serious and pushes boundaries. He is not shy about saying the things he disagrees with, shaking the discipline from within.</li>
<li><strong>Robin Kreiglstein:</strong> This has a base on Behavioral Sciences, which is a key aspect to take into account to create behavior change.</li>
</ul>
<p>The event presents a formidable density of perspectives, representing a milestone in the consolidation of gamification as a rigorous discipline. Engaging with these diverse schools of thought is essential for any modern designer.</p>`,
      faq: [
        {
          "question": "What are the key themes of Gamicon 2021?",
          "answer": "The main themes revolve around moving beyond simple PBL (Points, Badges, Leaderboards) templates, exploring intrinsic motivation, dark patterns, and academic research."
        },
        {
          "question": "Why is David Chandross recommended?",
          "answer": "David Chandross is renowned for pushing the boundaries of educational gamification, offering critical, research-driven assessments that challenge traditional learning paradigms."
        }
      ]
    },
    es: {
      title: 'Reflexiones sobre las ponencias de Gamicon 2021',
      excerpt: 'Un análisis detallado de las ponencias de Gamicon 2021, evaluando temas clave en motivación intrínseca, diseño emocional, ciencias del comportamiento e investigación académica.',
      content: `<p>Analizar el cronograma de un evento de cuarenta y ocho horas exige una selección minuciosa de las sesiones a asistir. Comparto mis reflexiones sobre las principales conferencias del evento, evaluando su relevancia para el diseño de motivación y el aprendizaje:</p>
<ul>
<li><strong>Yu-kai Chou:</strong> Una excelente introducción para quienes se inician en la gamificación mediante el diseño centrado en el ser humano y el marco Octalysis.</li>
<li><strong>Susan Peahl:</strong> Una propuesta lúdica centrada en la creatividad y la improvisación, de gran dinamismo.</li>
<li><strong>Kevin Bell:</strong> Ponencia valiosa sobre motivadores intrínsecos y su aplicación en la educación a distancia.</li>
<li><strong>Eric Nelson:</strong> Propuesta que busca fusionar el diseño ágil con el desarrollo de hábitos constantes.</li>
<li><strong>James Bishop:</strong> Diseños de salas de escape de alta calidad, una experiencia lúdica inmersiva muy recomendada.</li>
<li><strong>Kerstin Oberprieler:</strong> Estudios de caso excepcionales y de gran rigor conceptual. Su enfoque analítico resulta imperdible.</li>
<li><strong>Pete Jenkins:</strong> Mentor de la gamificación europea y referente absoluto en la estructuración de proyectos corporativos.</li>
<li><strong>Loredana Zaharescu:</strong> Propuestas para trascender los bucles de recompensas simples y diseñar mecánicas complejas.</li>
<li><strong>Rob Alvarez:</strong> Creador del podcast Professor Game, acumula una perspectiva amplísima al entrevistar a los mayores referentes del sector.</li>
<li><strong>Ashley Parker:</strong> Análisis sumamente interesante sobre la narrativa ramificada y la gestión de desequilibrios en el juego.</li>
<li><strong>Adam Palmquist:</strong> Enfoque científico excepcional, repleto de datos duros que analizan los resultados de la gamificación en el mundo real.</li>
<li><strong>Javier Velásquez:</strong> Mi propia ponencia, donde espero compartir avances significativos sobre el modelo BEM. ¡Los espero allí!</li>
<li><strong>Jim Egan, Naomi Pariseault, Dave Eng:</strong> Debate necesario y valiente sobre la ética en la gamificación y los límites de la influencia conductual.</li>
<li><strong>Dr. Larysa Nadolny:</strong> Análisis académico imprescindible estructurado a la manera de un metanálisis dinámico de datos.</li>
<li><strong>Chuck Sigmund:</strong> Ponencia crucial sobre los patrones oscuros y la manipulación conductual, un tema que todo profesional ético debe conocer.</li>
<li><strong>David Chandross:</strong> Disrupción absoluta en gamificación educativa. Cuestiona las prácticas obsoletas y sacude los cimientos del sector.</li>
<li><strong>Robin Kreiglstein:</strong> Integración de las ciencias del comportamiento para el diseño de hábitos sostenibles en el tiempo.</li>
</ul>
<p>La gamificación evoluciona gracias al intercambio constante entre la investigación científica y la práctica del diseño. Este evento ofrece una oportunidad inigualable para evaluar el estado del arte y cuestionar nuestras propias metodologías.</p>`,
      faq: [
        {
          "question": "¿Cuáles son las principales tendencias de Gamicon 2021?",
          "answer": "Se observa un claro esfuerzo por superar el uso simplista de puntos y medallas, discutiendo la ética del diseño de comportamiento, los patrones oscuros y el rigor científico."
        },
        {
          "question": "¿Por qué resulta relevante el debate sobre la ética en este evento?",
          "answer": "Permite definir límites claros contra la manipulación conductual, asegurando que el diseño de motivación respete la autonomía del usuario."
        }
      ]
    }
  }
};

// Process everything
const rawData = JSON.parse(fs.readFileSync(rawCatalogPath, 'utf8'));

const targetIds = [17, 18, 19, 20, 21, 22, 23, 24];

const outputData = targetIds.map(id => {
  const original = rawData.find(item => item.id === id);
  if (!original) {
    throw new Error(`Article with ID ${id} not found in raw catalog.`);
  }

  // Calculate dynamic read time based on the body word count (English version)
  // Approx 200-250 words per minute. Let's use 225.
  const wordCount = original.body.trim().split(/\\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 225));

  const pData = processedData[id];
  if (!pData) {
    throw new Error(`No processed data mapped for ID ${id}.`);
  }

  return {
    id: id,
    slug: pData.slug,
    category: categoryMap[id],
    readTime: readTime,
    date: original.date,
    author: 'Javier Velásquez',
    en: {
      title: pData.en.title,
      excerpt: pData.en.excerpt,
      content: pData.en.content.replace(/\\n/g, ''),
      faq: pData.en.faq
    },
    es: {
      title: pData.es.title,
      excerpt: pData.es.excerpt,
      content: pData.es.content.replace(/\\n/g, ''),
      faq: pData.es.faq
    }
  };
});

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
console.log(`Successfully processed articles and saved to ${outputPath}`);
