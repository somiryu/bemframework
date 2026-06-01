<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';

	let { 
		player, 
		instance, 
		onComplete 
	}: { 
		player: any; 
		instance: any; 
		onComplete: () => void 
	} = $props();

	// Host logic (Javier Velasquez or email match)
	const isHost = $derived(player.email === 'javier@f2p.co');

	// Slide navigation and synchronization
	let currentSlide = $state(0); // 0 to 5 (6 slides total)
	let activeSlideMode = $state<'actividad' | 'feedback'>('actividad');
	let channel: any = null;

	// Aggregated online trainees
	let onlinePlayers = $state<any[]>([]);

	// 1. Slide 1 Choice: Guild Cofradía
	let selectedGuild = $state(''); // 'gary', 'uwe', 'sid', 'will'

	// 2. Slide 2 Choice: Character Profile
	let selectedCharacter = $state(''); // 'sensei', 'explorador', 'proposito', 'curador', 'estratega', 'socio', 'ingeniero'

	// 3. Slide 3 Choice: Habilidades Points
	let skillPoints = $state<Record<string, number>>({
		heroismo: 2,
		poder: 2,
		explotacion: 2,
		habilidad: 3,
		colaboracion: 2,
		administracion: 2,
		arte: 2
	});
	const totalSkillsAllocated = $derived(
		Object.values(skillPoints).reduce((a, b) => a + b, 0)
	);

	// 4. Slide 4 Choice: Virtues & Flaws
	let gameVirtues = $state('');
	let gameFlaws = $state('');

	// 5. Slide 5 Choice: Game Preference
	let selectedPreference = $state(''); // 'misterio', 'roles', 'conquista', 'coordinacion', 'estetico', 'economico', 'dificil'

	// Track if this student has submitted the active slide
	let studentCompletedSlides = $state<Record<number, boolean>>({});
	const hasSubmittedActiveSlide = $derived(studentCompletedSlides[currentSlide] || false);

	// Aggregate real-time submissions of all classmates
	let classSubmissions = $state<Record<string, any>>({});

	onMount(() => {
		// Persistent state recovery: Load existing choices from player.game_state[1] if present
		const existingState = player.game_state?.[1] || {};
		if (existingState.guild) {
			selectedGuild = existingState.guild;
			studentCompletedSlides[0] = true;
		}
		if (existingState.character) {
			selectedCharacter = existingState.character;
			studentCompletedSlides[1] = true;
		}
		if (existingState.skills) {
			skillPoints = { ...existingState.skills };
			studentCompletedSlides[2] = true;
		}
		if (existingState.virtues || existingState.flaws) {
			gameVirtues = existingState.virtues || '';
			gameFlaws = existingState.flaws || '';
			studentCompletedSlides[3] = true;
		}
		if (existingState.preference) {
			selectedPreference = existingState.preference;
			studentCompletedSlides[4] = true;
		}
		if (existingState.workshop_completed) {
			studentCompletedSlides[5] = true;
		}

		if (supabase) {
			const channelId = `workshop_session_omie_${instance.code}`;
			channel = supabase.channel(channelId, {
				config: { presence: { key: player.id } }
			});

			// Setup broadcast handlers
			channel.on('broadcast', { event: 'slide-sync' }, (payload: any) => {
				const data = payload.payload;
				currentSlide = data.slideIndex;
				activeSlideMode = data.mode;
			});

			channel.on('broadcast', { event: 'student-submit' }, (payload: any) => {
				const submission = payload.payload;
				classSubmissions = {
					...classSubmissions,
					[submission.playerId]: submission
				};
			});

			// Presence sync
			channel.on('presence', { event: 'sync' }, () => {
				const state = channel.presenceState();
				const list: any[] = [];
				Object.keys(state).forEach((key) => {
					const user = state[key][0];
					if (user) list.push(user);
				});
				onlinePlayers = list;
			});

			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await channel.track({
						playerId: player.id,
						name: player.name,
						alias: player.alias,
						email: player.email
					});

					// Fetch latest workshop state stored in course instance to keep in sync
					const { data: inst } = await supabase
						.from('course_instances')
						.select('current_workshop_state')
						.eq('code', instance.code)
						.single();

					if (inst?.current_workshop_state) {
						currentSlide = inst.current_workshop_state.slide_index ?? 0;
						activeSlideMode = inst.current_workshop_state.mode ?? 'actividad';
					}
				}
			});

			return () => {
				supabase.removeChannel(channel);
			};
		}
	});

	// Host broadcast sync triggers
	async function changeSlide(index: number, mode: 'actividad' | 'feedback') {
		currentSlide = index;
		activeSlideMode = mode;
		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'slide-sync',
				payload: { slideIndex: index, mode }
			});

			// Save to DB for persistent late entrants
			await supabase
				.from('course_instances')
				.update({
					current_workshop_state: { world_id: 1, slide_index: index, mode }
				})
				.eq('code', instance.code);
		}
	}

	// Submit student choices for the slide
	async function submitSlideChoice() {
		studentCompletedSlides = {
			...studentCompletedSlides,
			[currentSlide]: true
		};

		const payloadData = {
			playerId: player.id,
			name: player.name,
			alias: player.alias,
			slide: currentSlide,
			guild: selectedGuild,
			character: selectedCharacter,
			skills: { ...skillPoints },
			virtues: gameVirtues,
			flaws: gameFlaws,
			preference: selectedPreference
		};

		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'student-submit',
				payload: payloadData
			});
		}

		classSubmissions = {
			...classSubmissions,
			[player.id]: payloadData
		};

		// persistent DB save for every single slide submission to guarantee no data loss on page reload
		const state = player.game_state || {};
		state[1] = {
			...(state[1] || {}),
			guild: selectedGuild,
			character: selectedCharacter,
			skills: { ...skillPoints },
			virtues: gameVirtues,
			flaws: gameFlaws,
			preference: selectedPreference
		};

		if (currentSlide === 5) {
			state[1].workshop_completed = true;
			state[1].rpg_character = {
				guild: selectedGuild,
				character: selectedCharacter,
				skills: { ...skillPoints },
				virtues: gameVirtues,
				flaws: gameFlaws,
				preference: selectedPreference
			};
		}

		await supabase
			.from('course_players')
			.update({
				game_state: state,
				...(selectedCharacter ? { avatar: selectedCharacter } : {}),
				...(currentSlide === 5 ? { coins: player.coins + 25 } : {})
			})
			.eq('id', player.id);
	}

	// Slide 1 Content
	const guilds = [
		{ id: 'gary', name: 'Gary Gygax', motive: 'Identidad / Inmersión', desc: 'Reconocido por D&D y ser el padre de los juegos de rol. Explora historias ricas e inmersión épica.', banner: '/learn_resoruces/banners/guild_gary_gigax_identity.png' },
		{ id: 'uwe', name: 'Uwe Rosenberg', motive: 'Eficiencia / Placer (Hedonismo)', desc: 'Reconocido por juegos de mesa de motor económico, buenas gráficas y sistemas de optimización profunda.', banner: '/learn_resoruces/banners/guild_uwe_efficiency_hedonism.png' },
		{ id: 'sid', name: 'Sid Meier', motive: 'Empoderamiento / Descubrimiento', desc: 'Reconocido por juegos legendarios de exploración, expansión y conquista como Civilization y Pirates.', banner: '/learn_resoruces/banners/guild_sid_meier_empowerment_discovery.png' },
		{ id: 'will', name: 'Will Wright', motive: 'Maestría / Relacionamiento', desc: 'Reconocido por juegos de simulación social y retos interactivos creativos como Sims y Spores.', banner: '/learn_resoruces/banners/guild_will_wright_mastery_relatedness.png' }
	];

	// Slide 2 Content
	const charProfiles = [
		{ id: 'sensei', title: 'Agente Sensei', driver: 'Maestría 🏆', desc: 'Busca la excelencia total, retos de alta dificultad y perfeccionar metodologías.', icon: '🎓' },
		{ id: 'explorador', title: 'Eco-Explorador', driver: 'Descubrimiento 🗺️', desc: 'Ama investigar, descifrar misterios, caminos libres y experimentar.', icon: '🧭' },
		{ id: 'proposito', title: 'Arquitecto de Propósitos', driver: 'Propósito 🌱', desc: 'Conecta cada aprendizaje con un impacto real, causa ecológica o beneficio humano.', icon: '🌿' },
		{ id: 'curador', title: 'Curador Lúdico', driver: 'Hedonismo ☀️', desc: 'Se enfoca en la estética deslumbrante, diversión directa y emociones vívidas.', icon: '🎨' },
		{ id: 'estratega', title: 'Estratega de Misiones', driver: 'Autonomía / Empoderamiento ⚡', desc: 'Valora la toma de decisiones, proyectos autónomos y libertad de acción.', icon: '⚖️' },
		{ id: 'socio', title: 'Socio de Cofradías', driver: 'Relacionamiento 👥', desc: 'Potencia el aprendizaje cooperativo, gremios sociales y debates colectivos.', icon: '🤝' },
		{ id: 'ingeniero', title: 'Ingeniero de Ciclos', driver: 'Eficiencia ⚙️', desc: 'Busca optimizar tiempos, feedbacks veloces y flujos organizativos ágiles.', icon: '📊' }
	];

	// Slide 5 Preferences
	const preferences = [
		{ id: 'misterio', label: 'Un juego de misterio y suspenso (Descubrimiento)', driver: 'Descubrimiento' },
		{ id: 'roles', label: 'Un juego de roles o identidades secretas (Identidad)', driver: 'Identidad' },
		{ id: 'conquista', label: 'Un juego de conquista y competencia (Empoderamiento)', driver: 'Empoderamiento' },
		{ id: 'coordinacion', label: 'Un juego de coordinación social (Relacionamiento)', driver: 'Relacionamiento' },
		{ id: 'estetico', label: 'Un juego estético y artístico (Hedonismo)', driver: 'Hedonismo' },
		{ id: 'economico', label: 'Un juego económico y administrativo (Eficiencia)', driver: 'Eficiencia' },
		{ id: 'dificil', label: 'Un juego difícil y retador (Maestría)', driver: 'Maestría' }
	];

	const labelKeys = ['Descubrimiento', 'Identidad', 'Empoderamiento', 'Relacionamiento', 'Hedonismo', 'Eficiencia', 'Maestría'];

	// Count submissions dynamically for Host
	const slideSubmissionsCount = $derived(
		Object.values(classSubmissions).filter((s: any) => s.slide === currentSlide).length
	);

	// Slide 1 Waiting analytics
	const guildCounts = $derived.by(() => {
		const counts: Record<string, number> = { gary: 0, uwe: 0, sid: 0, will: 0 };
		Object.values(classSubmissions).forEach((s: any) => {
			if (s.slide === 0 && s.guild) {
				counts[s.guild] = (counts[s.guild] || 0) + 1;
			}
		});
		return counts;
	});

	// Slide 2 Waiting analytics
	const charCounts = $derived.by(() => {
		const counts: Record<string, number> = {};
		charProfiles.forEach(p => counts[p.id] = 0);
		Object.values(classSubmissions).forEach((s: any) => {
			if (s.slide === 1 && s.character) {
				counts[s.character] = (counts[s.character] || 0) + 1;
			}
		});
		return counts;
	});

	// Slide 3 Waiting analytics (Averages of skills points allocated)
	const skillAverages = $derived.by(() => {
		const keys = ['heroismo', 'poder', 'explotacion', 'habilidad', 'colaboracion', 'administracion', 'arte'];
		const avgs: Record<string, number> = {};
		keys.forEach(k => avgs[k] = 0);
		
		const subs = Object.values(classSubmissions).filter((s: any) => s.slide >= 2 && s.skills);
		if (subs.length === 0) return avgs;

		subs.forEach((s: any) => {
			keys.forEach(k => {
				avgs[k] += s.skills[k] || 0;
			});
		});

		keys.forEach(k => {
			avgs[k] = parseFloat((avgs[k] / subs.length).toFixed(1));
		});

		return avgs;
	});

	// Slide 4 Waiting Columns
	const submittedJoys = $derived(
		Object.values(classSubmissions)
			.filter((s: any) => s.virtues)
			.map((s: any) => ({ alias: s.alias, value: s.virtues }))
	);
	const submittedFlaws = $derived(
		Object.values(classSubmissions)
			.filter((s: any) => s.flaws)
			.map((s: any) => ({ alias: s.alias, value: s.flaws }))
	);

	// Slide 5 Preference Counts
	const preferenceCounts = $derived.by(() => {
		const counts: Record<string, number> = {};
		preferences.forEach(p => counts[p.id] = 0);
		Object.values(classSubmissions).forEach((s: any) => {
			if (s.slide >= 4 && s.preference) {
				counts[s.preference] = (counts[s.preference] || 0) + 1;
			}
		});
		return counts;
	});

	// Dynamic Spider Chart Calculators
	function calculatePersonalDrivers(sub: any) {
		const d = {
			Descubrimiento: 0,
			Identidad: 0,
			Empoderamiento: 0,
			Relacionamiento: 0,
			Hedonismo: 0,
			Eficiencia: 0,
			Maestría: 0
		};

		if (!sub) return d;

		// 1. Guild mapping
		if (sub.guild === 'sid') d.Descubrimiento += 2;
		if (sub.guild === 'sid') d.Empoderamiento += 2;
		if (sub.guild === 'gary') d.Identidad += 3;
		if (sub.guild === 'uwe') d.Eficiencia += 2;
		if (sub.guild === 'uwe') d.Hedonismo += 2;
		if (sub.guild === 'will') d.Maestría += 2;
		if (sub.guild === 'will') d.Relacionamiento += 2;

		// 2. Character mapping
		if (sub.character === 'sensei') d.Maestría += 3;
		if (sub.character === 'explorador') d.Descubrimiento += 3;
		if (sub.character === 'proposito') d.Identidad += 3; // Purpose connects identity
		if (sub.character === 'curador') d.Hedonismo += 3;
		if (sub.character === 'estratega') d.Empoderamiento += 3;
		if (sub.character === 'socio') d.Relacionamiento += 3;
		if (sub.character === 'ingeniero') d.Eficiencia += 3;

		// 3. Skills allocated
		if (sub.skills) {
			d.Identidad += sub.skills.heroismo || 0;
			d.Empoderamiento += sub.skills.poder || 0;
			d.Descubrimiento += sub.skills.explotacion || 0;
			d.Maestría += sub.skills.habilidad || 0;
			d.Relacionamiento += sub.skills.colaboracion || 0;
			d.Eficiencia += sub.skills.administracion || 0;
			d.Hedonismo += sub.skills.arte || 0;
		}

		// 5. Game preference
		if (sub.preference === 'misterio') d.Descubrimiento += 3;
		if (sub.preference === 'roles') d.Identidad += 3;
		if (sub.preference === 'conquista') d.Empoderamiento += 3;
		if (sub.preference === 'coordinacion') d.Relacionamiento += 3;
		if (sub.preference === 'estetico') d.Hedonismo += 3;
		if (sub.preference === 'economico') d.Eficiencia += 3;
		if (sub.preference === 'dificil') d.Maestría += 3;

		return d;
	}

	const myDrivers = $derived(
		calculatePersonalDrivers({
			guild: selectedGuild,
			character: selectedCharacter,
			skills: skillPoints,
			preference: selectedPreference
		})
	);

	const classAverageDrivers = $derived.by(() => {
		const sums = {
			Descubrimiento: 0,
			Identidad: 0,
			Empoderamiento: 0,
			Relacionamiento: 0,
			Hedonismo: 0,
			Eficiencia: 0,
			Maestría: 0
		};
		const subs = Object.values(classSubmissions);
		if (subs.length === 0) return sums;

		subs.forEach((s: any) => {
			const subD = calculatePersonalDrivers(s);
			Object.keys(sums).forEach((k) => {
				(sums as any)[k] += (subD as any)[k] || 0;
			});
		});

		Object.keys(sums).forEach((k) => {
			(sums as any)[k] = parseFloat(((sums as any)[k] / subs.length).toFixed(1));
		});

		return sums;
	});

	// SVG polygon generator for the Radar chart
	function getRadarPoints(drivers: Record<string, number>, maxVal = 25) {
		const keys = ['Descubrimiento', 'Identidad', 'Empoderamiento', 'Relacionamiento', 'Hedonismo', 'Eficiencia', 'Maestría'];
		const center = 150;
		const radius = 100;
		const points: string[] = [];

		keys.forEach((key, idx) => {
			const value = drivers[key] || 0;
			const angle = (idx * 2 * Math.PI) / 7 - Math.PI / 2;
			const length = (Math.min(value, maxVal) / maxVal) * radius;
			const x = center + length * Math.cos(angle);
			const y = center + length * Math.sin(angle);
			points.push(`${x},${y}`);
		});

		return points.join(' ');
	}

	async function handleResetWorkshop() {
		if (confirm('¿Estás seguro de que deseas reiniciar el taller al Slide 1? Todos los alumnos volverán a la primera pantalla.')) {
			await changeSlide(0, 'actividad');
		}
	}
</script>

<div class="workshop-container">
	<!-- ---------------------------------------------------- -->
	<!-- HOST CONTROL PANEL OVERLAY (For Javier)              -->
	<!-- ---------------------------------------------------- -->
	{#if isHost}
		<div class="host-controls-banner" in:slide>
			<div class="host-title">
				<span>👑 MENTOR ORQUESTADOR (JAVIER)</span>
			</div>
			
			<div class="host-actions-row">
				<div class="host-buttons-group">
					<button 
						type="button" 
						class="btn-solar-danger btn-sm font-bold"
						onclick={handleResetWorkshop}
					>
						🔄 Reiniciar
					</button>

					<button 
						type="button" 
						class="btn-solar-secondary btn-sm"
						disabled={currentSlide === 0}
						onclick={() => changeSlide(currentSlide - 1, 'actividad')}
					>
						◀ Slide Anterior
					</button>

					{#if activeSlideMode === 'actividad'}
						<button 
							type="button" 
							class="btn-solar-accent btn-sm font-bold animate-solar-pulse"
							onclick={() => changeSlide(currentSlide, 'feedback')}
						>
							📢 Activar Feedback en Vivo
						</button>
					{:else}
						<button 
							type="button" 
							class="btn-solar-secondary btn-sm font-bold"
							onclick={() => changeSlide(currentSlide, 'actividad')}
						>
							✏️ Regresar a Actividad
						</button>
					{/if}
					
					{#if currentSlide < 5}
						<button 
							type="button" 
							class="btn-solar-primary btn-sm font-bold"
							onclick={() => changeSlide(currentSlide + 1, 'actividad')}
						>
							Siguiente Slide ▶
						</button>
					{:else}
						<button 
							type="button" 
							class="btn-solar-primary btn-sm font-bold"
							onclick={onComplete}
						>
							✓ Finalizar Workshop
						</button>
					{/if}
				</div>

				<div class="presence-tag">
					🟢 Estudiantes: <strong>{onlinePlayers.length}</strong> | Respondieron: <strong>{slideSubmissionsCount}</strong>
				</div>
			</div>
		</div>
	{/if}

	<!-- STEPS TAB NAVIGATION MAP -->
	<div class="steps-progress-dots">
		{#each Array(6) as _, i}
			<div class="step-dot" class:active={currentSlide === i} class:host={isHost}>
				<span class="step-num">{i + 1}</span>
			</div>
		{/each}
	</div>

	<div class="slide-main-content">
		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 1: ESCUELA DE COFRADÍAS                        -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 0}
			<div class="slide-card" in:fade>
				<h3>Slide 1: Escoge tu Cofradía Motivacional</h3>
				<p class="slide-intro">Cada cofradía está inspirada en un legendario diseñador de juegos y representa dos de los drivers internos de BEM.</p>

				{#if activeSlideMode === 'feedback'}
					<!-- FEEDBACK VIEW -->
					<div class="feedback-layout glass-card" in:fade>
						<span class="m-badge font-bold">ANÁLISIS DE MENTORES BEM</span>
						<h4 class="f-header mt-2">La Estructura de las Cofradías</h4>
						<p class="f-desc mt-2">
							Cada una de estas figuras históricas de la industria del videojuego representa diferentes pilares del marco de gamificación:
							<strong>Gary Gygax</strong> evoca la inmersión profunda y el desarrollo de la **Identidad**.
							<strong>Uwe Rosenberg</strong> representa la maximización matemática y el placer estético del **Hedonismo/Eficiencia**.
							<strong>Sid Meier</strong> activa la motivación intrínseca mediante la exploración y el **Empoderamiento**.
							<strong>Will Wright</strong> potencia la creatividad estructurada bajo retos de **Maestría** y fuertes vínculos sociales.
						</p>

						<div class="stats-bars-graph mt-6">
							<h5 class="font-bold text-sm mb-4">Elecciones de la Clase en Tiempo Real:</h5>
							{#each guilds as g}
								{@const count = guildCounts[g.id] || 0}
								<div class="graph-row mb-4">
									<div class="graph-label">{g.name} ({count} votos)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill sky" style="width: {count > 0 ? (count / Object.keys(classSubmissions).length) * 100 : 0}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if hasSubmittedActiveSlide}
					<!-- WAITING VIEW -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">⏳</span>
						<h4>Sala de Espera de Cofradías</h4>
						<p class="mb-4">Has escogido tu gremio. Espera a que el Mentor active la retroalimentación o pase de slide. ¡Mira cómo se distribuye la clase en tiempo real!</p>

						<div class="guilds-waiting-grid mt-6">
							{#each guilds as g}
								{@const members = Object.values(classSubmissions).filter(s => s.slide === 0 && s.guild === g.id)}
								<div class="guild-waiting-card" class:my-choice={selectedGuild === g.id}>
									<div class="guild-banner-container compact">
										<img src={g.banner} alt={g.name} class="guild-banner-img" />
									</div>
									<div class="guild-waiting-info">
										<div class="guild-header-row">
											<h4>{g.name}</h4>
											<span class="guild-waiting-count">{members.length}</span>
										</div>
										{#if selectedGuild === g.id}
											<div class="my-choice-badge">Tu Gremio</div>
										{/if}
										<div class="guild-members-list">
											{#if members.length > 0}
												{#each members as m}
													<span class="member-pill">👤 {m.alias}</span>
												{/each}
											{:else}
												<span class="no-members-label">Esperando aventureros...</span>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- INTERACTION VIEW -->
					<div class="guilds-select-grid mt-6">
						{#each guilds as g}
							<button 
								type="button" 
								class="guild-card" 
								class:selected={selectedGuild === g.id}
								onclick={() => selectedGuild = g.id}
							>
								<div class="guild-banner-container">
									<img src={g.banner} alt={g.name} class="guild-banner-img" />
								</div>
								<div class="guild-info">
									<span class="motive-badge">{g.motive}</span>
									<h4>{g.name}</h4>
									<p>{g.desc}</p>
								</div>
							</button>
						{/each}
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={!selectedGuild}
						onclick={submitSlideChoice}
					>
						✓ Confirmar y Unirse a la Cofradía
					</button>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 2: SELECCIÓN DE PERSONAJES                     -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 1}
			<div class="slide-card" in:fade>
				<h3>Slide 2: Selección de Personaje Motivacional</h3>
				<p class="slide-intro">Configura tu perfil de agente RPG en OMIE. Cada arquetipo está alineado con uno de los 7 drivers en educación.</p>

				{#if activeSlideMode === 'feedback'}
					<!-- FEEDBACK VIEW -->
					<div class="feedback-layout glass-card" in:fade>
						<span class="m-badge font-bold">DIVERSIDAD MOTIVACIONAL</span>
						<h4 class="f-header mt-2">¿Cómo influyen los arquetipos en el diseño de clases?</h4>
						<p class="f-desc mt-2">
							No todos los alumnos interactúan de la misma manera. El arquetipo elegido funciona como una hipótesis de segmentación.
							Crear misiones con mecánicas diversas asegura enganchar tanto a un **Agente Sensei** (retos difíciles) como a un **Eco-Explorador** (investigación y misterios libres).
						</p>

						<div class="stats-bars-graph mt-6">
							<h5 class="font-bold text-sm mb-4">Balance de Arquetipos de la Clase:</h5>
							{#each charProfiles as cp}
								{@const count = charCounts[cp.id] || 0}
								<div class="graph-row mb-4">
									<div class="graph-label">{cp.icon} {cp.title} - {cp.driver} ({count} alumnos)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill green" style="width: {count > 0 ? (count / Object.keys(classSubmissions).length) * 100 : 0}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if hasSubmittedActiveSlide}
					<!-- WAITING VIEW -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">🎭</span>
						<h4>Sala de Espera de Arquetipos</h4>
						<p class="mb-4">Tu personaje de campo ha sido asignado. ¡Observa qué arquetipos está eligiendo la clase para conformar el equipo de aprendizaje!</p>

						<div class="profiles-waiting-grid mt-6">
							{#each charProfiles as cp}
								{@const members = Object.values(classSubmissions).filter(s => s.slide === 1 && s.character === cp.id)}
								<div class="profile-waiting-card" class:my-choice={selectedCharacter === cp.id}>
									<div class="profile-waiting-header">
										<span class="p-waiting-icon">{cp.icon}</span>
										<div class="p-waiting-title-area text-left">
											<h4>{cp.title}</h4>
											<span class="p-waiting-driver">{cp.driver}</span>
										</div>
										<span class="profile-waiting-count">{members.length}</span>
									</div>
									{#if selectedCharacter === cp.id}
										<div class="my-choice-badge">Tu Arquetipo</div>
									{/if}
									<div class="profile-members-list">
										{#if members.length > 0}
											{#each members as m}
												<span class="member-pill">👤 {m.alias}</span>
											{/each}
										{:else}
											<span class="no-members-label">Aún sin asignar</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- INTERACTION VIEW -->
					<div class="profiles-grid mt-6">
						{#each charProfiles as cp}
							<button 
								type="button" 
								class="profile-card"
								class:selected={selectedCharacter === cp.id}
								onclick={() => selectedCharacter = cp.id}
							>
								<span class="p-icon">{cp.icon}</span>
								<div class="p-main">
									<h4>{cp.title}</h4>
									<span class="p-driver">{cp.driver}</span>
									<p>{cp.desc}</p>
								</div>
							</button>
						{/each}
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={!selectedCharacter}
						onclick={submitSlideChoice}
					>
						✓ Asignar mi Personaje de Campo
					</button>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 3: DISTRIBUCIÓN DE HABILIDADES                 -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 2}
			<div class="slide-card" in:fade>
				<h3>Slide 3: Distribuye tus Habilidades (Tienes 15 Puntos)</h3>
				<p class="slide-intro">Calibra tus estadísticas RPG de agente. Tienes **exactamente 15 puntos** para distribuir en las 7 habilidades.</p>

				{#if activeSlideMode === 'feedback'}
					<!-- FEEDBACK VIEW -->
					<div class="feedback-layout glass-card" in:fade>
						<span class="m-badge font-bold">CALIBRACIÓN DE MÍNIMOS</span>
						<h4 class="f-header mt-2">La hipótesis del Driver Dominante</h4>
						<p class="f-desc mt-2">
							Nadie está activado por un solo motivador de manera aislada. Tus habilidades reflejan una combinación única de impulsos.
							En pedagogía, realizar testeos nos permite descubrir qué activa a cada alumno según el contexto y el entorno lúdico.
						</p>

						<div class="stats-bars-graph mt-6">
							<h5 class="font-bold text-sm mb-4">Promedio de Habilidades de la Clase:</h5>
							{#each Object.keys(skillPoints) as k}
								{@const avg = skillAverages[k]}
								<div class="graph-row mb-4">
									<div class="graph-label">{k.toUpperCase()} ({avg} pts promedio)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill sky" style="width: {(avg / 15) * 100}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if hasSubmittedActiveSlide}
					<!-- WAITING VIEW -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">📊</span>
						<h4>Sala de Espera de Habilidades</h4>
						<p class="mb-4">Habilidades guardadas con éxito. Observa los promedios preliminares de la clase mientras se calibran los demás estudiantes:</p>

						<div class="my-skills-box mb-6">
							<span class="text-xs font-bold uppercase tracking-wider text-solar-green-medium">Tu Calibración de Habilidades</span>
							<div class="skills-distribution-row mt-2">
								{#each Object.entries(skillPoints) as [skill, val]}
									<div class="skill-mini-pill">
										<span class="sk-name">{skill.substring(0, 3).toUpperCase()}</span>
										<span class="sk-val">{val}</span>
									</div>
								{/each}
							</div>
						</div>

						<div class="stats-bars-graph mt-6 text-left">
							<h5 class="font-bold text-sm mb-4">Promedio Preliminar de la Clase ({Object.values(classSubmissions).filter(s => s.slide === 2).length} entregados):</h5>
							{#each Object.keys(skillPoints) as k}
								{@const subs = Object.values(classSubmissions).filter(s => s.slide === 2 && s.skills)}
								{@const sum = subs.reduce((acc, curr) => acc + (curr.skills?.[k] || 0), 0)}
								{@const avg = subs.length > 0 ? (sum / subs.length).toFixed(1) : '0.0'}
								<div class="graph-row mb-4">
									<div class="graph-label">{k.charAt(0).toUpperCase() + k.slice(1)} ({avg} pts prom.)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill sky" style="width: {(parseFloat(avg) / 10) * 100}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- INTERACTION VIEW -->
					<div class="skills-point-editor mt-4">
						<div class="remaining-points-counter" class:perfect={totalSkillsAllocated === 15}>
							Puntos Utilizados: <strong>{totalSkillsAllocated} / 15</strong>
							{#if totalSkillsAllocated === 15}
								<span class="perfect-badge">✓ ¡Distribución Perfecta!</span>
							{:else}
								<span class="warning-badge">Debes usar exactamente 15 puntos</span>
							{/if}
						</div>

						<div class="skills-sliders-grid mt-4">
							{#each Object.keys(skillPoints) as skill}
								<div class="skill-slider-row">
									<div class="skill-name-col">
										<strong>{skill.toUpperCase()}</strong>
									</div>
									<div class="slider-control-col">
										<input 
											type="range" 
											min="0" 
											max="15" 
											bind:value={skillPoints[skill]} 
											class="solar-range-slider"
										/>
									</div>
									<div class="slider-value-col">
										<strong>{skillPoints[skill]} pts</strong>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={totalSkillsAllocated !== 15}
						onclick={submitSlideChoice}
					>
						✓ Sincronizar mis Estadísticas
					</button>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 4: VIRTUES & FLAWS (Game Taste Matrix)         -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 3}
			<div class="slide-card" in:fade>
				<h3>Slide 4: Virtudes y Defectos de Juego</h3>
				<p class="slide-intro">Comprender qué juegos te fascinan y cuáles detestas permite calibrar y entender tus triggers pedagógicos.</p>

				{#if activeSlideMode === 'feedback'}
					<!-- FEEDBACK VIEW -->
					<div class="feedback-layout glass-card" in:fade>
						<span class="m-badge font-bold">DISEÑO DE LOOPS PEDAGÓGICOS</span>
						<h4 class="f-header mt-2">No existen juegos perfectos</h4>
						<p class="f-desc mt-2">
							Hacer videojuegos completos en el aula es costoso y rara vez estratégico.
							Sin embargo, entender qué mecánicas hacen que ciertos juegos sean amados u odiados nos permite incorporar miniloops interactivos altamente efectivos en nuestras clases.
						</p>

						<div class="rpg-roster-split-layout mt-6">
							<div class="glass-card text-left">
								<h5 class="font-bold text-solar-green-medium mb-2">💚 Juegos Virtuosos (Amados):</h5>
								<ul class="text-xs list-disc pl-4 space-y-1">
									{#each submittedJoys as j}
										<li><strong>{j.alias}:</strong> {j.value}</li>
									{/each}
								</ul>
							</div>

							<div class="glass-card text-left">
								<h5 class="font-bold text-solar-terracotta mb-2">💔 Juegos No Virtuosos (Odiados):</h5>
								<ul class="text-xs list-disc pl-4 space-y-1">
									{#each submittedFlaws as f}
										<li><strong>{f.alias}:</strong> {f.value}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{:else if hasSubmittedActiveSlide}
					<!-- WAITING VIEW -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">🎮</span>
						<h4>Sala de Espera de Gustos</h4>
						<p class="mb-4">Preferencias de juegos subidas. Mira en tiempo real lo que apasiona y frustra a tus compañeros de clase:</p>

						<div class="rpg-roster-split-layout mt-6">
							<div class="glass-card text-left">
								<h5 class="font-bold text-solar-green-medium mb-3">💚 Lo que nos apasiona (En Vivo):</h5>
								<div class="live-scroll-list">
									{#each Object.values(classSubmissions).filter(s => s.slide === 3 && s.virtues) as op}
										<div class="live-input-pill mb-2">
											<strong>{op.alias}:</strong> <span class="italic text-xs">"{op.virtues}"</span>
										</div>
									{:else}
										<span class="no-members-label">Esperando gustos apasionantes...</span>
									{/each}
								</div>
							</div>

							<div class="glass-card text-left">
								<h5 class="font-bold text-solar-terracotta mb-3">💔 Lo que nos frustra (En Vivo):</h5>
								<div class="live-scroll-list">
									{#each Object.values(classSubmissions).filter(s => s.slide === 3 && s.flaws) as op}
										<div class="live-input-pill mb-2">
											<strong>{op.alias}:</strong> <span class="italic text-xs">"{op.flaws}"</span>
										</div>
									{:else}
										<span class="no-members-label">Esperando quejas de juegos...</span>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{:else}
					<!-- INTERACTION VIEW -->
					<div class="form-group text-left mt-6">
						<label for="virtues" class="font-bold block mb-2">Juegos que Te Apasionan (Virtudes):</label>
						<input 
							type="text" 
							id="virtues" 
							bind:value={gameVirtues} 
							placeholder="ej: Minecraft, Portal, Chess, Stardew Valley" 
							class="subject-input"
						/>
					</div>

					<div class="form-group text-left mt-4">
						<label for="flaws" class="font-bold block mb-2">Juegos que No Soportas (Defectos):</label>
						<input 
							type="text" 
							id="flaws" 
							bind:value={gameFlaws} 
							placeholder="ej: Candy Crush, League of Legends, FIFA" 
							class="subject-input"
						/>
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={!gameVirtues || !gameFlaws}
						onclick={submitSlideChoice}
					>
						✓ Sincronizar mis Virtudes y Defectos
					</button>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 5: PREFERENCIA DE JUEGOS                       -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 4}
			<div class="slide-card" in:fade>
				<h3>Slide 5: ¿Qué Tipo de Juego Prefieres?</h3>
				<p class="slide-intro">Escoge la alternativa que mejor describa la experiencia de juego que más disfrutas.</p>

				{#if activeSlideMode === 'feedback'}
					<!-- FEEDBACK VIEW -->
					<div class="feedback-layout glass-card" in:fade>
						<span class="m-badge font-bold">PREFERENCIAS CONSOLIDADAS</span>
						<h4 class="f-header mt-2">Análisis de la Motivación Central</h4>
						<p class="f-desc mt-2">
							Tu elección aquí completa la calibración motivacional y define la forma en la que te desenvuelves bajo entornos lúdicos y de diseño serio.
						</p>

						<div class="stats-bars-graph mt-6">
							<h5 class="font-bold text-sm mb-4">Votos Acumulados de la Clase:</h5>
							{#each preferences as p}
								{@const count = preferenceCounts[p.id] || 0}
								<div class="graph-row mb-4">
									<div class="graph-label">{p.label} ({count} votos)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill sky" style="width: {count > 0 ? (count / Object.keys(classSubmissions).length) * 100 : 0}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else if hasSubmittedActiveSlide}
					<!-- WAITING VIEW -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">⚡</span>
						<h4>Sala de Espera de Preferencias</h4>
						<p class="mb-4">Preferencia enviada con éxito. ¡Mira cómo prefiere jugar la clase en tiempo real!</p>

						<div class="preferences-waiting-list mt-6 text-left">
							{#each preferences as p}
								{@const members = Object.values(classSubmissions).filter(s => s.slide === 4 && s.preference === p.id)}
								<div class="preference-waiting-row" class:my-choice={selectedPreference === p.id}>
									<div class="pref-waiting-header-row">
										<div class="pref-left">
											<div class="pref-indicator-dot" class:my-choice={selectedPreference === p.id}></div>
											<span class="pref-waiting-label font-bold">{p.label}</span>
										</div>
										<span class="pref-waiting-count">{members.length} votos</span>
									</div>
									<div class="pref-members-pills mt-2">
										{#if members.length > 0}
											{#each members as m}
												<span class="member-pill">👤 {m.alias}</span>
											{/each}
										{:else}
											<span class="no-members-label">Sin votos aún</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- INTERACTION VIEW -->
					<div class="preferences-choices-list mt-6">
						{#each preferences as p}
							<button 
								type="button" 
								class="preference-option-card"
								class:selected={selectedPreference === p.id}
								onclick={() => selectedPreference = p.id}
							>
								<div class="pref-radio"></div>
								<div class="pref-label">{p.label}</div>
							</button>
						{/each}
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={!selectedPreference}
						onclick={submitSlideChoice}
					>
						✓ Registrar mi Preferencia de Juego
					</button>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 6: SPIDER RADAR CHART (FINAL WORLD SLIDE)      -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 5}
			<div class="slide-card" in:fade>
				<h3>Slide 6: Tu Ficha de Agente y Radar Motivacional BEM</h3>
				<p class="slide-intro">¡Felicidades, Agente! Has completado con éxito la iniciación y tu caracterización RPG de OMIE.</p>

				{#if !hasSubmittedActiveSlide}
					<button type="button" class="btn-solar-accent w-full justify-center py-4 mb-6" onclick={submitSlideChoice}>
						🔓 Sincronizar Ficha y Reclamar +25 BEM Coins
					</button>
				{/if}

				<div class="rpg-roster-split-layout">
					<!-- RADAR GRAPHS COMPARISON -->
					<div class="glass-card">
						<h4 class="font-bold text-solar-green-dark text-sm mb-4">🔮 TU RADAR PERSONAL</h4>
						<div class="radar-container-box">
							<svg width="300" height="300" class="radar-svg">
								<!-- Outer bounds circles -->
								<circle cx="150" cy="150" r="100" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="75" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="50" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="25" fill="none" stroke="#E5E7EB" stroke-width="1" />

								<!-- Radial Lines -->
								{#each Array(7) as _, i}
									{@const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2}
									<line x1="150" y1="150" x2={150 + 100 * Math.cos(angle)} y2={150 + 100 * Math.sin(angle)} stroke="#E5E7EB" stroke-width="1" />
								{/each}

								<!-- Labels -->
								{#each labelKeys as label, i}
									{@const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2}
									{@const x = 150 + 115 * Math.cos(angle)}
									{@const y = 150 + 115 * Math.sin(angle)}
									<text x={x} y={y} font-size="8" font-weight="bold" fill="var(--color-solar-text)" text-anchor="middle" dominant-baseline="middle">{label.substring(0,6)}..</text>
								{/each}

								<!-- Solid personal polygon -->
								<polygon points={getRadarPoints(myDrivers)} fill="rgba(61, 143, 104, 0.4)" stroke="var(--color-solar-green-medium)" stroke-width="2" />
							</svg>
						</div>
					</div>

					<div class="glass-card">
						<h4 class="font-bold text-solar-sky text-sm mb-4">👥 RADAR DE LA CLASE (PROMEDIO)</h4>
						<div class="radar-container-box">
							<svg width="300" height="300" class="radar-svg">
								<circle cx="150" cy="150" r="100" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="75" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="50" fill="none" stroke="#E5E7EB" stroke-width="1" />
								<circle cx="150" cy="150" r="25" fill="none" stroke="#E5E7EB" stroke-width="1" />

								{#each Array(7) as _, i}
									{@const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2}
									<line x1="150" y1="150" x2={150 + 100 * Math.cos(angle)} y2={150 + 100 * Math.sin(angle)} stroke="#E5E7EB" stroke-width="1" />
								{/each}

								{#each labelKeys as label, i}
									{@const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2}
									{@const x = 150 + 115 * Math.cos(angle)}
									{@const y = 150 + 115 * Math.sin(angle)}
									<text x={x} y={y} font-size="8" font-weight="bold" fill="var(--color-solar-text)" text-anchor="middle" dominant-baseline="middle">{label.substring(0,6)}..</text>
								{/each}

								<!-- Solid class average polygon -->
								<polygon points={getRadarPoints(classAverageDrivers)} fill="rgba(24, 141, 181, 0.4)" stroke="var(--color-solar-sky)" stroke-width="2" />
							</svg>
						</div>
					</div>
				</div>

				<div class="feedback-conclusion-banner glass-card mt-6 text-left">
					<h5 class="font-bold mb-2">Conclusión del Mentor:</h5>
					<p class="text-xs line-height-relaxed text-solar-text">
						Nadie es un solo driver puro. La experimentación rigurosa en el aula es el único camino que permite descubrir qué activa a un estudiante de manera intrínseca.
						Usa los datos motivacionales de tu cofradía y arquetipo para modelar misiones ricas, diversas y con fuerte empoderamiento pedagógico.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.workshop-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		height: 100%;
	}

	.steps-progress-dots {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		border-bottom: 1px solid var(--color-solar-card-border);
		padding-bottom: 1.5rem;
	}

	.step-dot {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #E5E7EB;
		color: #4B5563;
		font-weight: 800;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #D1D5DB;
		transition: all 0.3s ease;
	}

	.step-dot.active {
		background: var(--color-solar-green-medium);
		color: white;
		border-color: var(--color-solar-green-dark);
		box-shadow: 0 0 10px rgba(61, 143, 104, 0.4);
	}

	/* HOST BANNER */
	.host-controls-banner {
		background: linear-gradient(135deg, hsl(150, 45%, 6%) 0%, hsl(152, 40%, 10%) 100%) !important;
		border: 1.5px solid var(--color-solar-yellow) !important;
		color: white !important;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 1rem !important;
		border-radius: 10px !important;
		gap: 1.5rem !important;
		text-align: left;
		margin-bottom: 0.75rem;
		box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
		width: 100%;
		box-sizing: border-box;
	}

	.host-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.host-title span {
		font-size: 0.65rem;
		font-weight: 900;
		color: var(--color-solar-yellow);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.host-actions-row {
		display: flex;
		align-items: center;
		gap: 1.5rem !important;
	}

	.host-buttons-group {
		display: flex;
		gap: 0.75rem !important;
		align-items: center;
	}

	.host-controls-banner button {
		padding: 0.25rem 0.65rem !important;
		font-size: 0.75rem !important;
		border-radius: 6px !important;
		font-weight: 800 !important;
		height: auto !important;
		min-height: unset !important;
		margin: 0 0.25rem !important; /* Explicit horizontal margin to guarantee gap spacing in all layouts */
		border: 1px solid rgba(255, 255, 255, 0.15) !important;
	}

	.presence-tag {
		font-size: 0.75rem;
		font-weight: 700;
		background: rgba(0, 0, 0, 0.5);
		padding: 0.25rem 0.75rem;
		border-radius: 6px;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.15);
		display: inline-flex;
		align-items: center;
	}

	/* SLIDE CARDS */
	.slide-card {
		max-width: 820px;
		margin: 0 auto;
		text-align: center;
	}

	.slide-card h3 {
		font-family: var(--font-solar-header);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0 0 0.5rem 0;
	}

	.slide-intro {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 1.5rem 0;
		font-weight: 550;
		line-height: 1.5;
	}

	.guilds-select-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1024px) {
		.guilds-select-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.guilds-select-grid {
			grid-template-columns: 1fr;
		}
	}

	.guild-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		text-align: left;
		transition: all 0.25s ease;
	}

	.guild-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-solar-md);
		border-color: var(--color-solar-green-medium);
	}

	.guild-card.selected {
		border-color: var(--color-solar-green-medium);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.25);
	}

	/* GUILDS WAITING REAL-TIME GRID */
	.guilds-waiting-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 1024px) {
		.guilds-waiting-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.guilds-waiting-grid {
			grid-template-columns: 1fr;
		}
	}

	.guild-waiting-card {
		background: rgba(255, 255, 255, 0.65);
		border: 1.5px solid var(--color-solar-card-border);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-align: left;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: var(--shadow-solar-sm);
	}

	.guild-waiting-card.my-choice {
		border: 2px solid var(--color-solar-green-medium) !important;
		background: white !important;
		box-shadow: 0 8px 30px rgba(61, 143, 104, 0.15) !important;
		transform: scale(1.02);
	}

	.guild-banner-container.compact {
		width: 100%;
		height: 140px;
		overflow: hidden;
		position: relative;
	}

	.guild-waiting-info {
		padding: 1rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.guild-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.guild-header-row h4 {
		font-family: var(--font-solar-header);
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.guild-waiting-count {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		font-size: 0.8rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		min-width: 1.4rem;
		text-align: center;
	}

	.my-choice-badge {
		font-size: 0.6rem;
		font-weight: 900;
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		align-self: flex-start;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		box-shadow: 0 2px 5px rgba(0,0,0,0.05);
	}

	.guild-members-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-top: 0.5rem;
		border-top: 1px dashed rgba(61, 143, 104, 0.15);
		padding-top: 0.75rem;
		flex: 1;
	}

	.member-pill {
		background: #ffffff;
		border: 1px solid rgba(61, 143, 104, 0.12);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-green-dark);
		display: inline-flex;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0,0,0,0.02);
	}

	.no-members-label {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted);
		font-style: italic;
		margin-top: 0.25rem;
	}

	/* SLIDE 2 WAITING STYLES */
	.profiles-waiting-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 900px) {
		.profiles-waiting-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.profiles-waiting-grid {
			grid-template-columns: 1fr;
		}
	}

	.profile-waiting-card {
		background: rgba(255, 255, 255, 0.65);
		border: 1.5px solid var(--color-solar-card-border);
		border-radius: 14px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		text-align: left;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-solar-sm);
	}

	.profile-waiting-card.my-choice {
		border: 2px solid var(--color-solar-green-medium) !important;
		background: white !important;
		box-shadow: 0 6px 20px rgba(61, 143, 104, 0.12) !important;
	}

	.profile-waiting-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.p-waiting-icon {
		font-size: 1.75rem;
	}

	.p-waiting-title-area {
		flex: 1;
	}

	.p-waiting-title-area h4 {
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.p-waiting-driver {
		font-size: 0.7rem;
		color: var(--color-solar-green-medium);
		font-weight: 700;
	}

	.profile-waiting-count {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		font-size: 0.75rem;
		font-weight: 800;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
	}

	.profile-members-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-top: 0.5rem;
		border-top: 1px dashed rgba(61, 143, 104, 0.12);
		padding-top: 0.5rem;
	}

	/* SLIDE 3 WAITING STYLES */
	.my-skills-box {
		background: rgba(255, 255, 255, 0.8);
		border: 1px dashed var(--color-solar-green-medium);
		padding: 1rem;
		border-radius: 12px;
		max-width: 600px;
		margin: 0 auto;
	}

	.skills-distribution-row {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.skill-mini-pill {
		background: white;
		border: 1px solid rgba(61, 143, 104, 0.15);
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
	}

	.sk-name {
		font-weight: 800;
		color: var(--color-solar-green-medium);
	}

	.sk-val {
		font-weight: 900;
		color: var(--color-solar-green-dark);
		background: var(--color-solar-green-light);
		padding: 0.05rem 0.25rem;
		border-radius: 4px;
	}

	/* SLIDE 4 WAITING STYLES */
	.live-scroll-list {
		max-height: 250px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-right: 0.25rem;
	}

	.live-input-pill {
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.06);
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		font-size: 0.8rem;
		color: var(--color-solar-text);
		line-height: 1.3;
	}

	/* SLIDE 5 WAITING STYLES */
	.preferences-waiting-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 700px;
		margin: 1.5rem auto 0 auto;
	}

	.preference-waiting-row {
		background: rgba(255, 255, 255, 0.6);
		border: 1.5px solid var(--color-solar-card-border);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		transition: all 0.3s ease;
	}

	.preference-waiting-row.my-choice {
		border: 2px solid var(--color-solar-green-medium) !important;
		background: white !important;
		box-shadow: 0 4px 12px rgba(61, 143, 104, 0.08) !important;
	}

	.pref-waiting-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.pref-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.pref-indicator-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #D1D5DB;
	}

	.pref-indicator-dot.my-choice {
		background: var(--color-solar-green-medium);
		box-shadow: 0 0 6px var(--color-solar-green-medium);
	}

	.pref-waiting-label {
		font-size: 0.85rem;
		color: var(--color-solar-green-dark);
	}

	.pref-waiting-count {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
	}

	.pref-members-pills {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
		border-top: 1px dashed rgba(61, 143, 104, 0.12);
		padding-top: 0.5rem;
	}

	.guild-banner-container {
		width: 100%;
		height: 320px;
		overflow: hidden;
	}

	.guild-banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.guild-info {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.motive-badge {
		align-self: flex-start;
		font-size: 0.6rem;
		font-weight: 800;
		text-transform: uppercase;
		background: var(--color-solar-yellow-light);
		color: #b45309;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
	}

	.guild-info h4 {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.guild-info p {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	/* SLIDE 2 CHARACTERS PROFILES */
	.profiles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.profile-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		gap: 1rem;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.profile-card:hover {
		transform: translateY(-2px);
		border-color: var(--color-solar-green-medium);
		box-shadow: var(--shadow-solar-sm);
	}

	.profile-card.selected {
		background: var(--color-solar-green-light);
		border-color: var(--color-solar-green-medium);
	}

	.p-icon {
		font-size: 2.2rem;
		flex-shrink: 0;
	}

	.p-main {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.p-main h4 {
		font-family: var(--font-solar-header);
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.p-driver {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-solar-text-muted);
		text-transform: uppercase;
	}

	.p-main p {
		font-size: 0.8rem;
		color: var(--color-solar-text);
		margin: 0.25rem 0 0 0;
		line-height: 1.4;
	}

	/* SLIDE 3 SKILL POINT SLIDERS */
	.skills-point-editor {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 24px;
		padding: 2rem;
	}

	.remaining-points-counter {
		font-family: var(--font-solar-header);
		font-size: 1.2rem;
		color: var(--color-solar-green-dark);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.perfect-badge {
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 800;
	}

	.warning-badge {
		background: #FEE2E2;
		color: #B91C1C;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 800;
	}

	.skills-sliders-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.skill-slider-row {
		display: grid;
		grid-template-columns: 140px 1fr 80px;
		gap: 1.5rem;
		align-items: center;
	}

	.skill-name-col {
		text-align: left;
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
	}

	.solar-range-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		background: #E5E7EB;
		border-radius: 4px;
		outline: none;
	}

	.solar-range-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-solar-green-medium);
		border: 3px solid white;
		cursor: pointer;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.15s ease;
	}

	.slider-value-col {
		text-align: right;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark);
	}

	/* SLIDE 4 INPUT FORM */
	.subject-input {
		width: 100%;
		padding: 0.85rem 1.25rem;
		font-size: 0.95rem;
		border-radius: 12px;
		border: 1.5px solid var(--color-solar-card-border);
		background: var(--color-solar-bg);
		outline: none;
		transition: all 0.2s ease;
	}

	.subject-input:focus {
		border-color: var(--color-solar-green-medium);
		background: white;
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.15);
	}

	/* SLIDE 5 OPTION CARDS */
	.preferences-choices-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.preference-option-card {
		background: white;
		border: 1.5px solid var(--color-solar-card-border);
		padding: 1.25rem 1.5rem;
		border-radius: 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		text-align: left;
		transition: all 0.2s ease;
	}

	.preference-option-card:hover {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-bg);
	}

	.preference-option-card.selected {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
	}

	.pref-radio {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid var(--color-solar-card-border);
		background: white;
		position: relative;
		flex-shrink: 0;
	}

	.preference-option-card.selected .pref-radio {
		border-color: var(--color-solar-green-medium);
	}

	.preference-option-card.selected .pref-radio::after {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-solar-green-medium);
		position: absolute;
		top: 3px;
		left: 3px;
	}

	.pref-label {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-solar-text);
	}

	/* SLIDE 6 RADAR SVG */
	.radar-container-box {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background: white;
		border-radius: 20px;
		border: 1px solid var(--color-solar-card-border);
	}

	.radar-svg {
		max-width: 100%;
		height: auto;
	}

	/* FEEDBACK PANELS */
	.feedback-layout {
		text-align: left;
		padding: 2.5rem;
		background: linear-gradient(135deg, #ffffff 0%, var(--color-solar-bg) 100%);
	}

	.f-header {
		font-family: var(--font-solar-header);
		font-size: 1.35rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.f-desc {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--color-solar-text);
	}

	.stats-bars-graph {
		background: white;
		border: 1px solid #E5E7EB;
		border-radius: 20px;
		padding: 2rem;
		text-align: left;
	}

	.graph-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.graph-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-solar-green-dark);
	}

	.graph-bar-track {
		width: 100%;
		height: 14px;
		background: var(--color-solar-bg);
		border-radius: 7px;
		overflow: hidden;
		border: 1px solid rgba(0,0,0,0.04);
	}

	.graph-bar-fill {
		height: 100%;
		border-radius: 7px;
		transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.graph-bar-fill.sky { background: var(--color-solar-sky); }
	.graph-bar-fill.green { background: var(--color-solar-green-medium); }

	/* WAITING SPECTATOR CARDS */
	.spectator-card {
		background: var(--color-solar-yellow-light);
		border: 1px solid rgba(255, 209, 102, 0.4);
		padding: 2.5rem;
		border-radius: 24px;
	}

	.spectator-card h4 {
		font-family: var(--font-solar-header);
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.5rem 0 0.25rem 0;
	}

	.spectator-card p {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		font-weight: 550;
	}

	.online-players-grid {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.player-roster-pill {
		background: white;
		border: 1px solid #E5E7EB;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		font-size: 0.85rem;
		font-weight: 600;
		box-shadow: var(--shadow-solar-sm);
	}

	.rpg-roster-split-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.rpg-roster-split-layout {
			grid-template-columns: 1fr;
		}
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 20px;
		border: 1px solid var(--color-solar-card-border);
		box-shadow: var(--shadow-solar-sm);
		padding: 1.5rem;
	}

	.text-left { text-align: left; }
	.w-full { width: 100%; }
	.justify-center { justify-content: center; }
	.mt-6 { margin-top: 1.5rem; }
	.mt-4 { margin-top: 1rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }

	.btn-solar-danger {
		background: #ef4444 !important;
		color: white !important;
		border: 1px solid #dc2626 !important;
	}

	.btn-solar-danger:hover {
		background: #dc2626 !important;
		transform: translateY(-1px);
	}
</style>
