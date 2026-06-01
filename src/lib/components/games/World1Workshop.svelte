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

	// Check if this student is Javier Velasquez (Super User host)
	const isHost = $derived(player.email === 'javier@f2p.co');

	// Active slide state (synced with host via Broadcast)
	let currentSlide = $state(0);
	
	// Real-time broadcast connection
	let channel: any = null;

	// Slide 0 Onboarding
	let selectedAvatar = $state('eco-engineer'); // 'eco-engineer', 'cyber-botanist', 'solar-scholar'
	
	// Slide 1 Gear Focus
	let selectedGear = $state('holo-notebook'); // 'holo-notebook', 'bio-sensor', 'compass'

	// Slide 2 Tienes 15 (BEM Drivers point allocation)
	let skillPoints = $state<Record<string, number>>({
		Hedonismo: 2,
		Eficiencia: 2,
		Relacion: 2,
		Maestria: 3,
		Descubrimiento: 2,
		Empoderamiento: 2,
		Proposito: 2
	});
	const totalSkillsAllocated = $derived(
		Object.values(skillPoints).reduce((a, b) => a + b, 0)
	);

	// Slide 3 Virtues & Flaws
	let gameVirtues = $state('');
	let gameFlaws = $state('');

	// Slide 4 Gamer Level
	let gamerLevel = $state(50);

	// Spectator / Waiting status
	let hasSubmittedActiveSlide = $state(false);

	// Classmates submissions data (Presence + Broadcast aggregates)
	let classSubmissions = $state<Record<string, any>>({});
	
	// List of online presence players
	let onlinePlayers = $state<any[]>([]);

	// Setup Supabase Realtime Channels
	onMount(() => {
		if (supabase) {
			const channelId = `workshop_session_${instance.code}`;
			channel = supabase.channel(channelId, {
				config: {
					presence: { key: player.id }
				}
			});

			// 1. Listen to broadcast messages
			channel.on('broadcast', { event: 'slide-change' }, (payload: any) => {
				currentSlide = payload.payload.slideIndex;
				hasSubmittedActiveSlide = false; // Reset submission lock for next slide
			});

			channel.on('broadcast', { event: 'student-submit' }, (payload: any) => {
				const submission = payload.payload;
				classSubmissions = {
					...classSubmissions,
					[submission.playerId]: submission
				};
			});

			// 2. Presence track
			channel.on('presence', { event: 'sync' }, () => {
				const state = channel.presenceState();
				const playersList: any[] = [];
				Object.keys(state).forEach((key) => {
					const userPresence = state[key][0];
					if (userPresence) {
						playersList.push(userPresence);
					}
				});
				onlinePlayers = playersList;
			});

			channel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					// Share presence
					await channel.track({
						playerId: player.id,
						name: player.name,
						alias: player.alias,
						avatar: selectedAvatar
					});
				}
			});

			return () => {
				supabase.removeChannel(channel);
			};
		}
	});

	// Host slide change action
	async function changeSlide(index: number) {
		currentSlide = index;
		hasSubmittedActiveSlide = false;
		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'slide-change',
				payload: { slideIndex: index }
			});

			// Backup save current state in Supabase DB for late arrivals
			await supabase
				.from('course_instances')
				.update({
					current_workshop_state: { world_id: 1, slide_index: index }
				})
				.eq('code', instance.code);
		}
	}

	// Submit current slide choices
	async function submitSlideData() {
		hasSubmittedActiveSlide = true;

		const payloadData = {
			playerId: player.id,
			name: player.name,
			alias: player.alias,
			slide: currentSlide,
			avatar: selectedAvatar,
			gear: selectedGear,
			drivers: { ...skillPoints },
			virtues: gameVirtues,
			flaws: gameFlaws,
			gamerLevel: gamerLevel
		};

		// Broadcast to everyone
		if (channel) {
			await channel.send({
				type: 'broadcast',
				event: 'student-submit',
				payload: payloadData
			});
		}

		// Save locally in aggregates
		classSubmissions = {
			...classSubmissions,
			[player.id]: payloadData
		};

		// If this is Slide 5 (final), we save player character RPG state to Supabase DB!
		if (currentSlide === 5) {
			const state = player.game_state || {};
			state[1] = {
				...state[1],
				workshop_completed: true,
				rpg_character: {
					avatar: selectedAvatar,
					gear: selectedGear,
					drivers: { ...skillPoints },
					virtues: gameVirtues,
					flaws: gameFlaws,
					gamerLevel: gamerLevel
				}
			};

			await supabase
				.from('course_players')
				.update({
					avatar: selectedAvatar,
					game_state: state,
					coins: player.coins + 25 // Award 25 coins for completing workshop RPG character creator!
				})
				.eq('id', player.id);
		}
	}

	// Helper arrays
	const avatars = [
		{ id: 'eco-engineer', label: 'Eco-Ingeniero', desc: 'Sistemas biológicos avanzados.', icon: '🛠️' },
		{ id: 'cyber-botanist', label: 'Ciber-Botánico', desc: 'Foliación digital de aprendizaje.', icon: '🌱' },
		{ id: 'solar-scholar', label: 'Erudito Solar', desc: 'Lógica radiante y propósito.', icon: '☀️' }
	];

	const gears = [
		{ id: 'holo-notebook', label: 'Holo-Bitácora', desc: 'Para registrar motivadores.', icon: '📓' },
		{ id: 'bio-sensor', label: 'Bio-Sensor Emocional', desc: 'Detecta placer y relatedness.', icon: '📡' },
		{ id: 'compass', label: 'Brújula Algorítmica', desc: 'Navega en metas de Maestría.', icon: '🧭' }
	];

	// Spectator Aggregate Analytics
	const gearCounts = $derived.by(() => {
		const counts: Record<string, number> = { 'holo-notebook': 0, 'bio-sensor': 0, 'compass': 0 };
		Object.values(classSubmissions).forEach((s: any) => {
			if (s.gear) counts[s.gear] = (counts[s.gear] || 0) + 1;
		});
		return counts;
	});

	const driverAverages = $derived.by(() => {
		const sums: Record<string, number> = {
			Hedonismo: 0, Eficiencia: 0, Relacion: 0, Maestria: 0, Descubrimiento: 0, Empoderamiento: 0, Proposito: 0
		};
		const subsList = Object.values(classSubmissions);
		if (subsList.length === 0) return sums;

		subsList.forEach((s: any) => {
			if (s.drivers) {
				Object.keys(sums).forEach((driver) => {
					sums[driver] += s.drivers[driver] || 0;
				});
			}
		});

		Object.keys(sums).forEach((driver) => {
			sums[driver] = parseFloat((sums[driver] / subsList.length).toFixed(1));
		});

		return sums;
	});

	const gamerLevelAverage = $derived.by(() => {
		const subsList = Object.values(classSubmissions);
		if (subsList.length === 0) return 0;
		const sum = subsList.reduce((acc, s: any) => acc + (s.gamerLevel || 0), 0);
		return Math.round(sum / subsList.length);
	});
</script>

<div class="workshop-container">
	<!-- TOP HEADER SLIDE STEPS MAP -->
	<div class="steps-progress-dots">
		{#each Array(6) as _, i}
			<div class="step-dot" class:active={currentSlide === i} class:host={isHost}>
				<span class="step-num">{i + 1}</span>
			</div>
		{/each}
	</div>

	<!-- ---------------------------------------------------- -->
	<!-- HOST CONTROL PANEL OVERLAY (For Javier)              -->
	<!-- ---------------------------------------------------- -->
	{#if isHost}
		<div class="host-controls-banner glass-card" in:slide>
			<div class="host-title">
				<span>👑 MENTOR ORQUESTADOR ACTIVO</span>
				<h4>Panel de Control de Presentación de Javier</h4>
			</div>
			
			<div class="host-actions-row">
				<div class="flex gap-2">
					<button 
						type="button" 
						class="btn-solar-secondary btn-sm"
						disabled={currentSlide === 0}
						onclick={() => changeSlide(currentSlide - 1)}
					>
						◀ Slide Anterior
					</button>
					
					{#if currentSlide < 5}
						<button 
							type="button" 
							class="btn-solar-accent btn-sm font-bold"
							onclick={() => changeSlide(currentSlide + 1)}
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
					🟢 Estudiantes Conectados: <strong>{onlinePlayers.length}</strong>
				</div>
			</div>
		</div>
	{/if}

	<div class="slide-main-content">
		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 1: AVATAR SELECTION                            -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 0}
			<div class="slide-card" in:fade>
				<h3>Paso 1: Iniciación del Trainee y Selección de Avatar</h3>
				<p class="slide-intro">¡Saludos, Agente! Toda iniciación requiere que configures tu representación holográfica en OMIE.</p>

				{#if !hasSubmittedActiveSlide}
					<div class="avatar-select-grid mt-6">
						{#each avatars as av}
							<button 
								type="button" 
								class="avatar-card-btn" 
								class:selected={selectedAvatar === av.id}
								onclick={() => selectedAvatar = av.id}
							>
								<div class="av-icon">{av.icon}</div>
								<h4>{av.label}</h4>
								<p>{av.desc}</p>
							</button>
						{/each}
					</div>

					<button type="button" class="btn-solar-primary mt-6 w-full justify-center" onclick={submitSlideData}>
						✓ Guardar y Enviar Avatar
					</button>
				{:else}
					<!-- SPECTATOR STATE -->
					<div class="spectator-card glass-card text-center" in:fade>
						<span class="animate-float block text-3xl">👥</span>
						<h4>Agentes Vinculados en Tiempo Real</h4>
						<p>Has enviado tu avatar. Esperando a que el Mentor Javier pase a la siguiente fase. Observa quiénes se han unido:</p>

						<div class="online-players-grid mt-4">
							{#each onlinePlayers as op}
								<div class="player-roster-pill">
									👤 <strong>{op.name}</strong> 
									<span class="text-xs text-solar-green-medium">"{op.alias}"</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 2: GEAR FOCUS                                  -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 1}
			<div class="slide-card" in:fade>
				<h3>Paso 2: Equipa tu Herramienta de Campo</h3>
				<p class="slide-intro">Cada agente utiliza un dispositivo específico para procesar el aprendizaje serious de los drivers.</p>

				{#if !hasSubmittedActiveSlide}
					<div class="avatar-select-grid mt-6">
						{#each gears as g}
							<button 
								type="button" 
								class="avatar-card-btn" 
								class:selected={selectedGear === g.id}
								onclick={() => selectedGear = g.id}
							>
								<div class="av-icon">{g.icon}</div>
								<h4>{g.label}</h4>
								<p>{g.desc}</p>
							</button>
						{/each}
					</div>

					<button type="button" class="btn-solar-primary mt-6 w-full justify-center" onclick={submitSlideData}>
						✓ Guardar y Enviar Herramienta
					</button>
				{:else}
					<!-- SPECTATOR STATE -->
					<div class="spectator-card glass-card text-center" in:fade>
						<h4>Estadísticas de Equipamiento de la Clase</h4>
						<p>Observa qué herramientas están seleccionando tus compañeros en tiempo real:</p>

						<div class="stats-bars-graph mt-6">
							{#each gears as g}
								{@const count = gearCounts[g.id] || 0}
								<div class="graph-row mb-4">
									<div class="graph-label">{g.icon} {g.label} ({count})</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill sky" style="width: {count > 0 ? (count / Object.keys(classSubmissions).length) * 100 : 0}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 3: SKILLS POINT ALLOCATION - TIENES 15          -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 2}
			<div class="slide-card" in:fade>
				<h3>Paso 3: Distribuye tus Drivers Skills (Tienes 15)</h3>
				<p class="slide-intro">Como agente RPG, tu personalidad está definida por la intensidad de tus drivers BEM. Distribuye **exactamente 15 puntos** entre las 7 dimensiones.</p>

				{#if !hasSubmittedActiveSlide}
					<div class="skills-point-editor mt-4">
						<div class="remaining-points-counter" class:perfect={totalSkillsAllocated === 15}>
							Puntos Utilizados: <strong>{totalSkillsAllocated} / 15</strong>
							{#if totalSkillsAllocated === 15}
								<span class="perfect-badge">✓ ¡Distribución Perfecta!</span>
							{:else}
								<span class="warning-badge">Faltan o sobran puntos</span>
							{/if}
						</div>

						<div class="skills-sliders-grid mt-4">
							{#each Object.keys(skillPoints) as driver}
								<div class="skill-slider-row">
									<div class="skill-name-col">
										<strong>{driver}</strong>
									</div>
									
									<div class="slider-control-col">
										<input 
											type="range" 
											min="0" 
											max="15" 
											bind:value={skillPoints[driver]} 
											class="solar-range-slider"
										/>
									</div>

									<div class="slider-value-col">
										<strong>{skillPoints[driver]} pts</strong>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<button 
						type="button" 
						class="btn-solar-primary mt-6 w-full justify-center" 
						disabled={totalSkillsAllocated !== 15}
						onclick={submitSlideData}
					>
						✓ Confirmar Skills BEM
					</button>
				{:else}
					<!-- SPECTATOR STATE -->
					<div class="spectator-card glass-card text-center" in:fade>
						<h4>Promedio de Drivers Skills de la Clase</h4>
						<p>Este gráfico muestra el balance promedio de perfiles motivacionales de todo tu grupo activo:</p>

						<div class="stats-bars-graph mt-6">
							{#each Object.keys(skillPoints) as driver}
								{@const avg = driverAverages[driver]}
								<div class="graph-row mb-4">
									<div class="graph-label">{driver} ({avg} pts)</div>
									<div class="graph-bar-track">
										<div class="graph-bar-fill green" style="width: {(avg / 15) * 100}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 4: VIRTUES & FLAWS (Game Taste Matrix)         -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 3}
			<div class="slide-card" in:fade>
				<h3>Paso 4: Virtudes y Defectos (Gustos de Juego)</h3>
				<p class="slide-intro">Tus virtudes y defectos se definen por los tipos de juego que amas u odias. Esto calibra tus KBIs motivacionales.</p>

				{#if !hasSubmittedActiveSlide}
					<div class="form-group text-left mt-6">
						<label for="virtues">Virtudes: Juegos que Te Apasionan</label>
						<input 
							type="text" 
							id="virtues" 
							bind:value={gameVirtues} 
							placeholder="ej: Minecraft, Portal, Chess, Stardew Valley" 
							class="subject-input"
						/>
					</div>

					<div class="form-group text-left mt-4">
						<label for="flaws">Defectos: Juegos que No Soportas</label>
						<input 
							type="text" 
							id="flaws" 
							bind:value={gameFlaws} 
							placeholder="ej: Candy Crush, League of Legends, FIFA" 
							class="subject-input"
						/>
					</div>

					<button type="button" class="btn-solar-primary mt-6 w-full justify-center" onclick={submitSlideData}>
						✓ Confirmar Gustos de Juego
					</button>
				{:else}
					<!-- SPECTATOR STATE -->
					<div class="spectator-card glass-card text-center" in:fade>
						<h4>Feed de Preferencias de la Clase</h4>
						<p>Lo que otros agentes en tu sesión han listado como juegos amados y odiados:</p>

						<div class="roster-grid-layout mt-4 max-h-60 overflow-y-auto">
							{#each Object.values(classSubmissions) as s}
								<div class="player-roster-card">
									<strong>{s.alias}:</strong>
									<div class="text-xs">
										💚 Virtudes: <span class="text-solar-green-medium">{s.virtues || 'Ninguna'}</span>
									</div>
									<div class="text-xs">
										💔 Defectos: <span class="text-solar-terracotta">{s.flaws || 'Ninguno'}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 5: GAMER LEVEL SLIDER                          -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 4}
			<div class="slide-card" in:fade>
				<h3>Paso 5: Tu Espectro Gamer</h3>
				<p class="slide-intro">¿Qué tan gamer te consideras? Arrastra el slider para calibrar tu indicador.</p>

				{#if !hasSubmittedActiveSlide}
					<div class="gamer-slider-container mt-6">
						<input 
							type="range" 
							min="0" 
							max="100" 
							bind:value={gamerLevel} 
							class="solar-range-slider gamer-spectrum-slider"
						/>
						
						<div class="flex justify-between font-bold text-xs mt-2 px-2">
							<span>No me gustan los juegos 🥱</span>
							<span>Casual 🎮</span>
							<span>Gamer Pro ⚡</span>
						</div>

						<div class="gamer-badge-selected mt-6 text-center">
							Tu Nivel: <strong class="text-lg text-solar-sky">{gamerLevel}%</strong>
						</div>
					</div>

					<button type="button" class="btn-solar-primary mt-6 w-full justify-center" onclick={submitSlideData}>
						✓ Guardar y Enviar Nivel Gamer
					</button>
				{:else}
					<!-- SPECTATOR STATE -->
					<div class="spectator-card glass-card text-center" in:fade>
						<h4>Nivel Gamer Promedio del Grupo</h4>
						<p>En promedio, el nivel de interés en los videojuegos de los trainees activos es:</p>

						<div class="gamer-average-gauge mt-6">
							<div class="gauge-center animate-solar-pulse">
								<span class="text-3xl font-bold">{gamerLevelAverage}%</span>
								<span class="text-xs font-bold block">INTERÉS PROMEDIO</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- ---------------------------------------------------- -->
		<!-- SLIDE 6: COMPLETED CHARACTER SHEET & ROSTER BROWSER  -->
		<!-- ---------------------------------------------------- -->
		{#if currentSlide === 5}
			<div class="slide-card" in:fade>
				<h3>Paso 6: Tu Ficha de Agente y Roster Completo</h3>
				<p class="slide-intro">¡Felicidades! Has completado tu iniciación. A continuación se presenta tu BEM Card RPG definitiva. Puedes explorar también las fichas de tus compañeros.</p>

				{#if !hasSubmittedActiveSlide}
					<!-- Single save required to write profile and reward coins -->
					<button type="button" class="btn-solar-accent w-full justify-center py-4 mb-6" onclick={submitSlideData}>
						🔓 Sincronizar Ficha y Reclamar +25 BEM Coins
					</button>
				{/if}

				<div class="rpg-roster-split-layout">
					<!-- MY CARD -->
					<div class="my-rpg-card glass-card">
						<span class="badge-role">TU FICHA OMIE</span>
						<div class="avatar-view-big">
							<span class="big-icon">
								{selectedAvatar === 'eco-engineer' ? '🛠️' : selectedAvatar === 'cyber-botanist' ? '🌱' : '☀️'}
							</span>
							<h3>{player.name}</h3>
							<span class="text-solar-green-medium font-bold">"{player.alias}"</span>
						</div>

						<hr class="n-separator" />

						<div class="my-rpg-details text-left">
							<div>🎒 Gear: <strong>{selectedGear === 'holo-notebook' ? '📓 Holo-Bitácora' : selectedGear === 'bio-sensor' ? '📡 Bio-Sensor' : '🧭 Brújula'}</strong></div>
							<div>🎮 Interés Gamer: <strong>{gamerLevel}%</strong></div>
							<div>💚 Virtudes: <span class="font-semibold text-solar-green-medium">{gameVirtues || 'Ninguna'}</span></div>
							<div>💔 Defectos: <span class="font-semibold text-solar-terracotta">{gameFlaws || 'Ninguno'}</span></div>
						</div>

						<hr class="n-separator" />

						<h4 class="text-left font-bold text-xs">PUNTOS DE DRIVERS:</h4>
						<div class="drivers-stats-mini text-left">
							{#each Object.entries(skillPoints) as [d, p]}
								<div class="mini-row">
									<span>{d}:</span>
									<strong>{p} pts</strong>
								</div>
							{/each}
						</div>
					</div>

					<!-- CLASS ROSTER BROWSER -->
					<div class="class-roster-browser">
						<h4 class="font-bold text-sm mb-4">👥 Roster de la Clase ({Object.keys(classSubmissions).length} perfiles)</h4>
						
						<div class="roster-grid-layout max-h-96 overflow-y-auto">
							{#each Object.values(classSubmissions) as s}
								{#if s.playerId !== player.id}
									<div class="roster-classmate-card">
										<div class="mate-card-header justify-between">
											<strong>{s.name} ("{s.alias}")</strong>
											<span class="text-xs">🎮 {s.gamerLevel}%</span>
										</div>
										<div class="text-xs text-left mt-2">
											<div>🎒 Gear: {s.gear}</div>
											<div class="grid grid-cols-2 gap-1 bg-gray-50 p-sm-pad rounded mt-1 text-xxs-font border">
												{#each Object.entries(s.drivers) as [d, p]}
													<div>{d.substring(0,5)}: {p}</div>
												{/each}
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
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
		background: linear-gradient(135deg, hsl(150, 43%, 12%) 0%, hsl(152, 40%, 20%) 100%);
		border: 1.5px solid var(--color-solar-yellow);
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 2rem;
		flex-wrap: wrap;
		gap: 1.5rem;
		text-align: left;
	}

	.host-title span {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-yellow);
		letter-spacing: 0.05em;
	}

	.host-title h4 {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		margin: 0;
		font-weight: 800;
	}

	.host-actions-row {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.presence-tag {
		font-size: 0.85rem;
		font-weight: 600;
	}

	/* SLIDE CARDS */
	.slide-card {
		max-width: 800px;
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

	.avatar-select-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.avatar-card-btn {
		background: var(--color-solar-bg);
		border: 2px solid var(--color-solar-card-border);
		padding: 1.5rem 1.25rem;
		border-radius: 20px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.25s ease;
	}

	.avatar-card-btn:hover {
		transform: translateY(-4px);
		background: white;
		border-color: var(--color-solar-green-medium);
		box-shadow: var(--shadow-solar-sm);
	}

	.avatar-card-btn.selected {
		border-color: var(--color-solar-green-medium);
		background: var(--color-solar-green-light);
	}

	.av-icon {
		font-size: 2.5rem;
		margin-bottom: 0.25rem;
	}

	.avatar-card-btn h4 {
		font-family: var(--font-solar-header);
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.avatar-card-btn p {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	/* SPECTATOR CARD */
	.spectator-card {
		background: var(--color-solar-yellow-light);
		border: 1px solid rgba(255, 209, 102, 0.4);
		padding: 2.5rem;
		border-radius: 24px;
	}

	.spectator-card h4 {
		font-family: var(--font-solar-header);
		font-size: 1.2rem;
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

	/* SKILL POINTS allocation */
	.skills-point-editor {
		background: var(--color-solar-bg);
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
		flex-wrap: wrap;
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

	@media (max-width: 580px) {
		.skill-slider-row {
			grid-template-columns: 100px 1fr 50px;
			gap: 0.5rem;
		}
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

	.solar-range-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		background: var(--color-solar-green-dark);
	}

	.slider-value-col {
		text-align: right;
		font-size: 0.95rem;
		color: var(--color-solar-green-dark);
	}

	/* ANALYTICS GRAPH */
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

	/* GAMER AVERAGE GAUGE */
	.gamer-average-gauge {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: conic-gradient(
			var(--color-solar-sky) 0%,
			var(--color-solar-sky) var(--gamer-level-average, 50%),
			#E5E7EB var(--gamer-level-average, 50%),
			#E5E7EB 100%
		);
		margin: 2rem auto;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: var(--shadow-solar-md);
	}

	.gauge-center {
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
	}

	/* FINAL SPLIT ROSTER */
	.rpg-roster-split-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 768px) {
		.rpg-roster-split-layout {
			grid-template-columns: 1fr;
		}
	}

	.my-rpg-card {
		background: white;
		border: 2px solid var(--color-solar-yellow);
		border-radius: var(--radius-solar-md);
		padding: 2rem 1.5rem;
		box-shadow: var(--shadow-solar-lg), var(--shadow-solar-glow);
	}

	.avatar-view-big {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}

	.big-icon {
		font-size: 3.5rem;
		margin-bottom: 0.5rem;
	}

	.avatar-view-big h3 {
		font-family: var(--font-solar-header);
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.my-rpg-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.drivers-stats-mini {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.mini-row {
		display: flex;
		justify-content: space-between;
		background: var(--color-solar-bg);
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
	}

	.roster-classmate-card {
		background: var(--color-solar-bg);
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1rem;
	}

	.mate-card-header {
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.35rem;
	}

	.text-left { text-align: left; }
	.w-full { width: 100%; }
	.justify-center { justify-content: center; }
	.mt-6 { margin-top: 1.5rem; }
	.mt-4 { margin-top: 1rem; }
	.mb-4 { margin-bottom: 1rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.p-sm-pad { padding: 0.375rem; }
	.text-xxs-font { font-size: 10px; }
	.rounded { border-radius: 0.25rem; }
	.border { border: 1px solid #E5E7EB; }
</style>
