<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';


	let { 
		player = {}, 
		classmates = [], 
		worlds = [],
		onCloseJournal
	}: { 
		player: any; 
		classmates: any[]; 
		worlds: any[];
		onCloseJournal: () => void 
	} = $props();

	let activeJournalTab = $state('canvas'); // 'canvas', 'wiki', 'achievements', 'roster'

	let tabsContainer = $state<HTMLElement | null>(null);

	function scrollCarousel(offset: number) {
		if (tabsContainer) {
			tabsContainer.scrollBy({ left: offset, behavior: 'smooth' });
		}
	}

	const gameState = $derived(player.game_state || {});

	// Calculate earned achievements based on player state!
	const achievementsList = $derived.by(() => {
		const achievements = [
			{ id: 'registered', title: 'Agente OMIE Oficial', desc: 'Registrar tu perfil RPG de entrenamiento en la agencia.', date: player.created_at, unlocked: true, icon: '🌱' }
		];

		// Check if any training trivia completed
		let totalTrainingDone = 0;
		let totalCanvasDone = 0;
		let totalWikiUnlocked = 0;

		worlds.forEach((w) => {
			if (gameState[w.id]?.training_completed) totalTrainingDone++;
			if (gameState[w.id]?.design_completed) totalCanvasDone++;
			if (gameState[w.id]?.unlocked_resources?.length > 0) totalWikiUnlocked += gameState[w.id].unlocked_resources.length;
		});

		if (totalTrainingDone > 0) {
			achievements.push({
				id: 'trivia_newbie',
				title: 'Analista de Drivers',
				desc: 'Superar tu primera trivia de reconocimiento de motivadores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🧠'
			});
		}

		if (totalCanvasDone > 0) {
			achievements.push({
				id: 'canvas_completed',
				title: 'Arquitecto del Aprendizaje',
				desc: 'Diseñar actividades serias para los 7 drivers BEM en tu bitácora.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📝'
			});
		}

		if (totalWikiUnlocked > 0) {
			achievements.push({
				id: 'wiki_scholar',
				title: 'Coleccionista de Sabiduría',
				desc: 'Canjear BEM Coins para desbloquear recursos teóricos opcionales de la Wiki.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📚'
			});
		}

		if (player.coins >= 30) {
			achievements.push({
				id: 'coin_wealth',
				title: 'Emprendedor de Monedas',
				desc: 'Acumular un balance de 30 o más BEM Coins.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🪙'
			});
		}

		// World 2 specific achievements
		if (gameState['2']?.training_completed) {
			achievements.push({
				id: 'gfr_calibrator',
				title: 'Calibrador GFR',
				desc: 'Superar el módulo de calibración del simulador GFR en el Mundo 2.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🎯'
			});
		}

		if (gameState['2']?.design_completed) {
			achievements.push({
				id: 'motivational_engineer',
				title: 'Ingeniero Motivacional BEM',
				desc: 'Completar la matriz de diseño instruccional del Mundo 2 en la bitácora.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⚙️'
			});
		}

		if (gameState['2']?.unlocked_resources?.includes('gfr_theory_guide')) {
			achievements.push({
				id: 'gfr_theory_scholar',
				title: 'Erudito Motivacional',
				desc: 'Adquirir la Guía Teórica del Modelo GFR y Regulación RII en la Wiki.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '👑'
			});
		}

		// World 3 specific achievements
		if (gameState['3']?.training_completed) {
			achievements.push({
				id: 'interactivity_calibrator',
				title: 'Calibrador de Engranajes',
				desc: 'Superar la trivia de entrenamiento de Relojería Lúdica en el Mundo 3.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🛠️'
			});
		}

		if (gameState['3']?.design_completed) {
			achievements.push({
				id: 'interactivity_architect',
				title: 'Arquitecto de Interactividad',
				desc: 'Completar el canvas de Relojería Lúdica del Mundo 3 en la bitácora.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🕰️'
			});
		}

		// World 4 specific achievements
		if (gameState['4']?.workshop_completed) {
			achievements.push({
				id: 'el_faro_encendido',
				title: 'El Faro Encendido',
				desc: 'Completar el Taller Sincrónico del Mundo 4.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🏮'
			});
		}

		if (gameState['4']?.training_completed) {
			achievements.push({
				id: 'calibrador',
				title: 'Calibrador',
				desc: 'Completar las 21 preguntas del Entrenamiento Asíncrono del Mundo 4.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⚖️'
			});
		}

		const canvasW4 = gameState['4']?.design_canvas || [];
		if (gameState['4']?.design_completed && canvasW4.length >= 3) {
			achievements.push({
				id: 'arquitecto_de_metas',
				title: 'Arquitecto de Metas',
				desc: 'Guardar al menos 3 metas en el Canvas del Mundo 4 con todos los campos completos.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🏗️'
			});
		}

		if (gameState['4']?.block_correct_a === 7) {
			achievements.push({
				id: 'ojo_clinico',
				title: 'Ojo Clínico',
				desc: 'Responder correctamente las 7 preguntas de Variables de Expectativa sin errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🔍'
			});
		}

		if (gameState['4']?.block_correct_b === 7) {
			achievements.push({
				id: 'tipologo',
				title: 'Tipólogo',
				desc: 'Responder correctamente las 7 preguntas de Tipos de Meta sin errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🗂️'
			});
		}

		if (gameState['4']?.block_correct_c === 7) {
			achievements.push({
				id: 'cuadrante_perfecto',
				title: 'Cuadrante Perfecto',
				desc: 'Responder correctamente las 7 preguntas de la Matriz Quiero/Tengo sin errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🧭'
			});
		}

		if (gameState['4']?.block_correct_a === 7 && gameState['4']?.block_correct_b === 7 && gameState['4']?.block_correct_c === 7) {
			achievements.push({
				id: 'estrella_de_calibracion',
				title: 'Estrella de Calibración',
				desc: 'Completar los 3 bloques de la trivia del Mundo 4 con puntaje perfecto (21/21).',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⭐'
			});
		}

		// Las 4 Esquinas
		const has4Esquinas = (() => {
			if (!Array.isArray(canvasW4)) return false;
			const quads = new Set();
			canvasW4.forEach(g => {
				const q = (g.cuadrante || '').toLowerCase();
				if (q.includes('adquisición') || q.includes('adquisicion') || q.includes('adquirir') || q.includes('quiero y no tengo')) quads.add('adq');
				if (q.includes('mantenimiento') || q.includes('mantener') || q.includes('conservar') || q.includes('quiero y tengo')) quads.add('mant');
				if (q.includes('eliminación') || q.includes('eliminacion') || q.includes('eliminar') || q.includes('escapar') || q.includes('no quiero y tengo')) quads.add('elim');
				if (q.includes('prevención') || q.includes('prevencion') || q.includes('evitar') || q.includes('prevenir') || q.includes('no quiero y no tengo')) quads.add('prev');
			});
			return quads.size === 4;
		})();
		if (has4Esquinas) {
			achievements.push({
				id: 'las_4_esquinas',
				title: 'Las 4 Esquinas',
				desc: 'Crear en el Canvas al menos una meta por cada uno de los 4 cuadrantes de la Matriz Quiero/Tengo.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🗺️'
			});
		}

		// Diseñador Completo
		const hasDiseñadorCompleto = (() => {
			if (!Array.isArray(canvasW4)) return false;
			const types = new Set();
			canvasW4.forEach(g => {
				const t = (g.tipo || '').toLowerCase();
				if (t.includes('narrativa')) types.add('narr');
				if (t.includes('aproximación') || t.includes('aproximacion')) types.add('aprox');
				if (t.includes('evasión') || t.includes('evasion')) types.add('evas');
				if (t.includes('secundaria')) types.add('secund');
			});
			return types.size === 4;
		})();
		if (hasDiseñadorCompleto) {
			achievements.push({
				id: 'disenador_completo',
				title: 'Diseñador Completo',
				desc: 'Crear en el Canvas metas de los 4 tipos distintos: Narrativa, Principal de Aproximación, Principal de Evasión y Secundaria.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🎨'
			});
		}

		// Lector del Faro
		const w4Resources = gameState['4']?.unlocked_resources || [];
		const hasLectorDelFaro = w4Resources.includes('intrinsic_extrinsic_motivation') &&
								 w4Resources.includes('badge_goal_orientation') &&
								 w4Resources.includes('instructional_objectives_gameplay');
		if (hasLectorDelFaro) {
			achievements.push({
				id: 'lector_del_faro',
				title: 'Lector del Faro',
				desc: 'Desbloquear y acceder a los 3 recursos académicos de pago en la Biblioteca del Mundo 4.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📖'
			});
		}

		// Maestro del Tablero
		if (gameState['4']?.maestro_del_tablero) {
			achievements.push({
				id: 'maestro_del_tablero',
				title: 'Maestro del Tablero',
				desc: 'Clasificar correctamente los 8 escenarios de la Parte 2 del Taller en el primer intento.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '👑'
			});
		}

		// Meta Ultra
		if (canvasW4.length >= 7) {
			achievements.push({
				id: 'meta_ultra',
				title: 'Meta Ultra',
				desc: 'Crear 7 o más metas en el Canvas de Metas del Mundo 4.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🌟'
			});
		}

		// World 5 specific achievements
		// 1. el_faro_del_ritmo
		if (gameState['5']?.workshop_participated === true || gameState['5']?.workshop_completed === true) {
			achievements.push({
				id: 'el_faro_del_ritmo',
				title: 'El Faro del Ritmo',
				desc: 'Participar en el Taller Sincrónico del Mundo 5 (enviar al menos una respuesta como activo o ceder un turno).',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🏮'
			});
		}

		// 2. calibrador_de_alertas
		if (gameState['5']?.training_completed === true) {
			achievements.push({
				id: 'calibrador_de_alertas',
				title: 'Calibrador de Alertas',
				desc: 'Responder las 21 preguntas del Entrenamiento Asíncrono de la trivia (sin importar el puntaje final).',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⚖️'
			});
		}

		// 3. ingeniero_de_senales
		const canvasW5 = gameState['5']?.design_canvas || [];
		if (gameState['5']?.design_completed === true && canvasW5.length >= 3) {
			achievements.push({
				id: 'ingeniero_de_senales',
				title: 'Ingeniero de Señales',
				desc: 'Guardar en el Canvas al menos 3 notificadores de clase con todos sus campos completos y calificados.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🏗️'
			});
		}

		// 4. rutina_de_hierro
		if (gameState['5']?.block_correct_a === 7) {
			achievements.push({
				id: 'rutina_de_hierro',
				title: 'Rutina de Hierro',
				desc: 'Responder correctamente las 7 preguntas del Bloque A (Hábitos y Condicionamiento) sin cometer errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⛓️'
			});
		}

		// 5. semaforo_verde
		if (gameState['5']?.block_correct_b === 7) {
			achievements.push({
				id: 'semaforo_verde',
				title: 'Semáforo Verde',
				desc: 'Responder correctamente las 7 preguntas del Bloque B (Timing y Oportunidad) sin cometer errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🚦'
			});
		}

		// 6. calma_absoluta
		if (gameState['5']?.block_correct_c === 7) {
			achievements.push({
				id: 'calma_absoluta',
				title: 'Calma Absoluta',
				desc: 'Responder correctamente las 7 preguntas del Bloque C (Urgencia y Ansiedad) sin cometer errores.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🧘'
			});
		}

		// 7. estrella_de_la_atencion
		if (gameState['5']?.block_correct_a === 7 && gameState['5']?.block_correct_b === 7 && gameState['5']?.block_correct_c === 7) {
			achievements.push({
				id: 'estrella_de_la_atencion',
				title: 'Estrella de la Atención',
				desc: 'Completar la trivia con un puntaje perfecto de 21/21 aciertos en el primer intento.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '⭐'
			});
		}

		// 8. calibracion_tridimensional
		const hasCalibracionTridimensional = (() => {
			if (!Array.isArray(canvasW5)) return false;
			return canvasW5.some(row => {
				const intens = row.intensidad !== undefined ? row.intensidad : row.intensity;
				const clar = row.coherencia !== undefined ? row.coherencia : (row.claridad !== undefined ? row.claridad : row.coherence);
				const time = row.timing !== undefined ? row.timing : row.timing_value;
				const just = (row.senal || '').trim() || (row.justificacion || '').trim() || (row.justification || '').trim();
				return intens >= 4 && clar >= 4 && time >= 4 && just.length > 0;
			});
		})();
		if (hasCalibracionTridimensional) {
			achievements.push({
				id: 'calibracion_tridimensional',
				title: 'Calibración Tridimensional',
				desc: 'Crear en el Canvas un notificador de clase que tenga calificaciones altas en los 3 sliders (Intensidad >= 4, Claridad >= 4 y Timing >= 4) con su debida justificación.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📐'
			});
		}

		// 9. sutil_pero_claro
		const hasSutilPeroClaro = (() => {
			if (!Array.isArray(canvasW5)) return false;
			return canvasW5.some(row => {
				const intens = row.intensidad !== undefined ? row.intensidad : row.intensity;
				const clar = row.coherencia !== undefined ? row.coherencia : (row.claridad !== undefined ? row.claridad : row.coherence);
				return intens === 1 && clar === 5;
			});
		})();
		if (hasSutilPeroClaro) {
			achievements.push({
				id: 'sutil_pero_claro',
				title: 'Sutil pero Claro',
				desc: 'Crear en el Canvas una alerta calibrada con Intensidad = 1 (mínimo) y Claridad = 5 (máximo) para modelar un llamado a la acción no intrusivo pero perfectamente descifrable.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🔍'
			});
		}

		// 10. lector_de_la_boveda
		const w5Resources = gameState['5']?.unlocked_resources || [];
		const hasLectorDeLaBoveda = w5Resources.includes('paper_bavelier') &&
									w5Resources.includes('paper_shell') &&
									w5Resources.includes('paper_dayan') &&
									w5Resources.includes('paper_kober');
		if (hasLectorDeLaBoveda) {
			achievements.push({
				id: 'lector_de_la_boveda',
				title: 'Lector de la Bóveda',
				desc: 'Desbloquear y leer los documentos de pago de la biblioteca del Mundo 5 (Bavelier, Shell, Dayan, Kober).',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '📖'
			});
		}

		// 11. sintonia_fina
		if (gameState['5']?.sintonia_fina === true) {
			achievements.push({
				id: 'sintonia_fina',
				title: 'Sintonía Fina',
				desc: 'Lograr una alineación del 100% con las decisiones de GIOCHI en 5 preguntas consecutivas durante el taller sincrónico.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🤝'
			});
		}

		// 12. maestro_de_la_inaccion
		if (gameState['5']?.maestro_de_la_inaccion === true) {
			achievements.push({
				id: 'maestro_de_la_inaccion',
				title: 'Maestro de la Inacción',
				desc: 'Resolver correctamente los 3 retos del taller sincrónico que utilizan la inacción como disparador conductual en el primer intento.',
				date: new Date().toLocaleDateString(),
				unlocked: true,
				icon: '🛑'
			});
		}

		return achievements;
	});
</script>

<div class="journal-overlay" transition:fade>
	<div class="journal-notebook glass-card" in:fly={{ y: 50, duration: 450 }}>
		<!-- Close Button -->
		<button type="button" class="btn-close" onclick={onCloseJournal} aria-label="Cerrar bitácora">
			✕
		</button>

		<div class="notebook-header">
			<div class="header-main">
				<span class="solar-ornament">📔 BITÁCORA DEL AGENTE</span>
				<h2>Diario de Viaje de {player.name}</h2>
				<p class="alias-tag">Código de Agente: <strong>{player.alias}</strong> • Rango: Agente en entrenamiento</p>
			</div>
			
			<div class="stats-pills">
				<div class="stat-badge coin-count animate-solar-pulse">
					🪙 <strong>{player.coins} BEM Coins</strong>
				</div>
			</div>
		</div>

		<!-- Notebook Two-Column / Carousel Layout Wrapper -->
		<div class="notebook-layout-container">
			<!-- Left column menu on desktop, horizontal carousel on mobile -->
			<div class="notebook-menu-column">
				<!-- Carousel wrapper for mobile with navigation arrows -->
				<div class="carousel-nav-wrapper">
					<button type="button" class="carousel-arrow prev" onclick={() => scrollCarousel(-100)} aria-label="Anterior">‹</button>
					
					<div class="notebook-tabs-menu" bind:this={tabsContainer}>
						<button 
							class="n-tab" 
							class:active={activeJournalTab === 'canvas'} 
							onclick={() => activeJournalTab = 'canvas'}
						>
							📝 Bitácora de Diseños
						</button>
						<button 
							class="n-tab" 
							class:active={activeJournalTab === 'ideas'} 
							onclick={() => activeJournalTab = 'ideas'}
						>
							💡 Ideas Guardadas
						</button>
						<button 
							class="n-tab" 
							class:active={activeJournalTab === 'wiki'} 
							onclick={() => activeJournalTab = 'wiki'}
						>
							📚 Biblioteca Desbloqueada
						</button>
						<button 
							class="n-tab" 
							class:active={activeJournalTab === 'achievements'} 
							onclick={() => activeJournalTab = 'achievements'}
						>
							🏆 Logros Obtenidos
						</button>
						<button 
							class="n-tab" 
							class:active={activeJournalTab === 'roster'} 
							onclick={() => activeJournalTab = 'roster'}
						>
							👥 Roster OMIE
						</button>
					</div>

					<button type="button" class="carousel-arrow next" onclick={() => scrollCarousel(100)} aria-label="Siguiente">›</button>
				</div>
			</div>

			<!-- Vertical Divider for Desktop -->
			<div class="notebook-vertical-divider"></div>

			<!-- Right Column Content Body -->
			<div class="notebook-body-column">
				<div class="notebook-body max-h-[500px] overflow-y-auto">
					<!-- TAB: CANVAS DESIGNS -->
					{#if activeJournalTab === 'canvas'}
						<div class="tab-content" in:fade>
							<h3>✏️ Actividades de Aprendizaje Guardadas</h3>
							<p class="section-desc">Aquí se compilan todos los Canvas de diseño de clase que has enviado en tus misiones.</p>

							{#if typeof worlds === 'object'}
								{@const canvasWorlds = worlds.filter(w => gameState[w.id]?.design_canvas)}
								{#if canvasWorlds.length > 0}
									<div class="accordion-canvases">
										{#each canvasWorlds as w}
											{@const canvas = gameState[w.id].design_canvas}
											<div class="canvas-saved-block">
												<h4 class="world-title-saved">{w.title}</h4>
												<div class="canvas-grid-display">
													{#if Array.isArray(canvas)}
														{#each canvas as row, index}
															<div class="canvas-row-saved-container">
																<h5 class="canvas-row-title">
																	{w.id === 4 ? `Meta de Aprendizaje #${index + 1}` : (w.id === 5 ? `Diseño de Señal #${index + 1}` : (w.id === 6 ? `Calibración #${index + 1}` : `Fila de Diseño #${index + 1}`))}
																</h5>
																<div class="canvas-row-items">
																	{#if w.id === 3}
																		<div class="driver-item-saved">
																			<span class="d-label">1. META</span>
																			<p class="d-answer">"{row.meta || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">2. ESTÍMULO / LLAMADO A LA ACCIÓN</span>
																			<p class="d-answer">"{row.llamado || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">3. EVALUACIÓN COGNITIVA ESPERADA</span>
																			<p class="d-answer">"{row.eval_cognitiva || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">4. ACCIÓN DISPARADORA</span>
																			<p class="d-answer">"{row.accion_disparadora || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">5. EVALUACIÓN DEL JUEGO</span>
																			<p class="d-answer">"{row.eval_juego || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">6. RETROALIMENTACIÓN</span>
																			<p class="d-answer">"{row.retroalimentacion || ''}"</p>
																		</div>
																	{:else if w.id === 4}
																		<div class="driver-item-saved">
																			<span class="d-label">1. META DE APRENDIZAJE</span>
																			<p class="d-answer">"{row.meta || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">2. TIPO DE OBJETIVO</span>
																			<p class="d-answer">"{row.tipo || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">3. PERFIL DE EXPECTATIVA</span>
																			<p class="d-answer">"{row.expectativa || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">4. CUADRANTE QUIERO/TENGO</span>
																			<p class="d-answer">"{row.cuadrante || ''}"</p>
																		</div>
																	{:else if w.id === 5}
																		<div class="driver-item-saved">
																			<span class="d-label">🎯 1. COMPORTAMIENTO DESEADO</span>
																			<p class="d-answer">"{row.accion || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">📢 2. DISEÑO DE LA SEÑAL</span>
																			<p class="d-answer">"{row.senal || ''}"</p>
																		</div>
																		<div class="driver-item-saved" style="display: flex; gap: 1rem;">
																			<div style="flex: 1;">
																				<span class="d-label text-[10px] opacity-75">💥 INTENSIDAD</span>
																				<p class="d-answer font-bold" style="margin-top: 0.15rem;">{row.intensidad || 3} / 5</p>
																			</div>
																			<div style="flex: 1;">
																				<span class="d-label text-[10px] opacity-75">🌀 COHERENCIA</span>
																				<p class="d-answer font-bold" style="margin-top: 0.15rem;">{row.coherencia || 3} / 5</p>
																			</div>
																			<div style="flex: 1;">
																				<span class="d-label text-[10px] opacity-75">⏱️ TIMING</span>
																				<p class="d-answer font-bold" style="margin-top: 0.15rem;">{row.timing || 3} / 5</p>
																			</div>
																		</div>
																	{:else if w.id === 6}
																		<div class="driver-item-saved">
																			<span class="d-label">🧠 SESGO / HEURÍSTICA CONDUCTUAL</span>
																			<p class="d-answer font-bold" style="text-transform: capitalize; color: var(--color-solar-green-medium); margin-bottom: 0.25rem;">
																				{row.heuristicId ? row.heuristicId.replace('_', ' ') : ''}
																			</p>
																			<p class="d-answer">"{row.heuristicIdea || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">🎮 ESTRATEGIA DE DISEÑO DE JUEGO</span>
																			<p class="d-answer font-bold" style="text-transform: capitalize; color: var(--color-solar-green-medium); margin-bottom: 0.25rem;">
																				{row.strategyId ? row.strategyId.replace('_', ' ') : ''}
																			</p>
																			<p class="d-answer">"{row.strategyIdea || ''}"</p>
																		</div>
																	{:else}
																		<div class="driver-item-saved">
																			<span class="d-label">META (GOAL)</span>
																			<p class="d-answer">"{row.meta || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">RETROALIMENTACIÓN (FEEDBACK)</span>
																			<p class="d-answer">"{row.retroalimentacion || ''}"</p>
																		</div>
																		<div class="driver-item-saved">
																			<span class="d-label">RECOMPENSA (REWARD)</span>
																			<p class="d-answer">"{row.recompensa || ''}"</p>
																		</div>
																	{/if}
																</div>
															</div>
														{/each}
													{:else}
														{#each Object.entries(canvas) as [driver, answer]}
															<div class="driver-item-saved">
																<span class="d-label">{driver.toUpperCase()}:</span>
																<p class="d-answer">"{answer}"</p>
															</div>
														{/each}
													{/if}
												</div>
											</div>
										{/each}
									</div>
								{:else}
									<div class="empty-notebook-state">
										<span class="empty-icon">🤖</span>
										<div class="empty-text">
											<strong>Bitácora en Blanco</strong>
											<p>GIOCHI reporta: ¡Bip-bup! No detecto diseños de canvas en tus registros. Dirígete a la ruta del curso, haz clic en el Mundo 1, selecciona "Modo Diseño" y redacta tus propuestas motivacionales.</p>
										</div>
									</div>
								{/if}
							{/if}
						</div>
					{/if}

					<!-- TAB: IDEAS -->
					{#if activeJournalTab === 'ideas'}
						{@const likedIdeas = gameState.ideas || []}
						<div class="tab-content" in:fade>
							<h3>💡 Ideas de Diseño Motivacional BEM</h3>
							<p class="section-desc">Casos de estudio y escenarios de la trivia que marcaste con "Me gusta" para guardarlos como inspiración para tus clases.</p>

							{#if likedIdeas.length > 0}
								<div class="ideas-list-layout">
									{#each likedIdeas as idea}
										<div class="resource-unlocked-card idea-card" in:slide>
											<div class="res-badge-row">
												<span class="driver-tag driver-{idea.driver.toLowerCase()}">{idea.driver.toUpperCase()}</span>
												<span class="res-world">{idea.likedAt ? new Date(idea.likedAt).toLocaleDateString() : ''}</span>
											</div>
											<blockquote class="scenario-text-journal mt-2">
												"{idea.scenario}"
											</blockquote>
											
											<div class="article-content-box mt-3">
												<h6 class="font-bold text-[10px] uppercase tracking-wider text-solar-green-medium mb-1">Análisis de Diseño BEM:</h6>
												<p class="explanation-text text-xs leading-relaxed">{idea.explanation}</p>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="empty-notebook-state">
									<span class="empty-icon">💡</span>
									<div class="empty-text">
										<strong>Tu baúl de Ideas está vacío</strong>
										<p>Mientras resuelves el Simulador de Trivia en solitario, haz clic en el botón <strong>"💡 Me gusta. Volver una Idea"</strong> que aparece en cada caso para guardarlo aquí como recurso permanente de consulta.</p>
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<!-- TAB: WIKI / RESOURCES -->
					{#if activeJournalTab === 'wiki'}
						{@const unlockedResources = worlds.reduce((acc, w) => {
							const res = gameState[w.id]?.unlocked_resources || [];
							const worldWiki = w.wiki_modules || [];
							const matched = worldWiki.filter((r: any) => res.includes(r.id));
							return [...acc, ...matched.map((r: any) => ({ ...r, worldTitle: w.title }))];
						}, [] as any[])}
						<div class="tab-content" in:fade>
							<h3>📚 Biblioteca de Recursos Desbloqueados</h3>
							<p class="section-desc">Materiales teóricos opcionales que has adquirido canjeando BEM Coins en la Wiki.</p>

							{#if unlockedResources.length > 0}
								<div class="resources-unlocked-grid">
									{#each unlockedResources as r}
										<div class="resource-unlocked-card">
											<div class="res-badge-row">
												<span class="res-type-badge {r.type}">{r.type.toUpperCase()}</span>
												<span class="res-world">{r.worldTitle}</span>
											</div>
											<h4>{r.title}</h4>
											<p class="res-desc">{r.desc}</p>
											
											{#if r.type === 'article'}
												<div class="article-content-box">
													<p>{r.content}</p>
												</div>
											{:else}
												<a href={r.url} target="_blank" rel="noopener noreferrer" class="btn-solar-primary btn-sm mt-3">
													📥 Descargar / Ver {r.type.toUpperCase()}
												</a>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<div class="empty-notebook-state">
									<span class="empty-icon">📚</span>
									<div class="empty-text">
										<strong>Biblioteca Vacía</strong>
										<p>No has desbloqueado ningún recurso de mentor opcional. Gana BEM Coins resolviendo trivias de entrenamiento en solitario y gástalas en la pestaña Wiki de cada mundo.</p>
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<!-- TAB: ACHIEVEMENTS -->
					{#if activeJournalTab === 'achievements'}
						<div class="tab-content" in:fade>
							<h3>🏆 Logros e Insignias de Agente</h3>
							<p class="section-desc">Hitos alcanzados a lo largo de tu viaje en la academia de gamificación OMIE.</p>

							<div class="achievements-list-layout">
								{#each achievementsList as ach}
									<div class="achievement-row-card" class:locked={!ach.unlocked}>
										<div class="ach-icon">{ach.icon}</div>
										<div class="ach-info">
											<h4>{ach.title}</h4>
											<p>{ach.desc}</p>
										</div>
										<div class="ach-date">
											{#if ach.unlocked}
												<span class="date-unlocked">Otorgado</span>
												<span class="date-val">{ach.date ? new Date(ach.date).toLocaleDateString() : ''}</span>
											{:else}
												<span class="date-locked">Bloqueado</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- TAB: ROSTER CLASSMATES -->
					{#if activeJournalTab === 'roster'}
						<div class="tab-content" in:fade>
							<h3>👥 Roster de Agentes de la Clase</h3>
							<p class="section-desc">Navega y compara tus estadísticas de personaje RPG con tus compañeros de clase activos.</p>

							<div class="roster-grid-layout">
								{#each classmates as mate}
									{@const mateState = mate.game_state || {}}
									{@const world1Stats = mateState['1']?.rpg_character?.drivers ?? null}

									<div class="roster-classmate-card">
										<div class="mate-card-header">
											<div class="m-badge group">{mate.avatar ? mate.avatar.replace('-', ' ') : 'Agente'}</div>
											<div class="mate-card-meta">🪙 {mate.coins} Coins</div>
										</div>
										
										<div class="mate-card-body flex gap-3 mt-2">
									<div class="mate-avatar-circle">{mate.name.substring(0,2).toUpperCase()}</div>
									<div class="mate-details">
										<strong>{mate.name}</strong>
										<span class="mate-alias">"{mate.alias}"</span>
										
										{#if world1Stats}
											<div class="mate-rpg-preview text-xs mt-2 font-semibold">
												🛡️ RPG Stats BEM:
												<div class="grid grid-cols-2 gap-1 text-xxs-font bg-white p-sm-pad rounded mt-1 border">
													{#each Object.entries(world1Stats) as [driver, points]}
														<div>{driver.substring(0,5)}: <strong>{points}</strong></div>
													{/each}
												</div>
											</div>
										{:else}
											<span class="text-xs text-gray-400 block mt-2">RPG sin configurar</span>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.journal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 69, 51, 0.4);
		backdrop-filter: blur(10px);
		z-index: 50000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		overflow-y: auto;
	}

	.journal-notebook {
		max-width: 880px;
		width: 100%;
		background: #ffffff;
		border-radius: var(--radius-solar-lg, 32px);
		border: 1px solid var(--color-solar-green-medium);
		padding: 3rem;
		position: relative;
		box-shadow: var(--shadow-solar-lg);
		background-image: 
			radial-gradient(var(--color-solar-bg) 20%, transparent 20%),
			radial-gradient(var(--color-solar-bg) 20%, transparent 20%);
		background-size: 8px 8px;
		background-position: 0 0, 4px 4px;
		max-height: 90vh;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.journal-notebook {
			padding: 2rem 1.5rem;
		}
	}

	.btn-close {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		background: var(--color-solar-bg);
		border: 1px solid rgba(0,0,0,0.05);
		font-size: 1.1rem;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-solar-text-muted);
		transition: all 0.2s ease;
		z-index: 1000;
	}

	.btn-close:hover {
		background: #E5E7EB;
		color: var(--color-solar-text);
	}

	.notebook-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.solar-ornament {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.1em;
	}

	.notebook-header h2 {
		font-family: var(--font-solar-header);
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0.25rem 0 0.15rem 0;
	}

	.alias-tag {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		font-weight: 550;
	}

	.stat-badge {
		background: var(--color-solar-yellow);
		color: var(--color-solar-green-dark);
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		font-family: var(--font-solar-header);
		font-weight: 700;
		font-size: 0.95rem;
		box-shadow: var(--shadow-solar-sm);
	}

	/* NEW TWO-COLUMN & CAROUSEL LAYOUT */
	.notebook-layout-container {
		display: flex;
		gap: 2rem;
		align-items: stretch;
		min-height: 480px;
	}

	.notebook-menu-column {
		width: 230px;
		flex-shrink: 0;
	}

	.notebook-vertical-divider {
		width: 1px;
		background: var(--color-solar-card-border);
		align-self: stretch;
	}

	.notebook-body-column {
		flex: 1;
		min-width: 0;
	}

	.carousel-nav-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
	}

	/* Disable Carousel Arrows on Desktop */
	.carousel-arrow {
		display: none;
	}

	/* Vertically list tabs on Desktop */
	.notebook-tabs-menu {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: none;
		padding-bottom: 0;
		width: 100%;
	}

	.n-tab {
		background: rgba(0, 0, 0, 0.02);
		border: 1px solid rgba(0, 0, 0, 0.03);
		border-radius: 12px;
		color: var(--color-solar-text-muted);
		font-weight: 700;
		font-size: 0.85rem;
		padding: 0.75rem 1rem;
		cursor: pointer;
		text-align: left;
		width: 100%;
		transition: all 0.2s ease;
		box-sizing: border-box;
	}

	.n-tab:hover {
		color: var(--color-solar-green-dark);
		background: rgba(61, 143, 104, 0.06);
		border-color: rgba(61, 143, 104, 0.15);
	}

	.n-tab.active {
		color: white !important;
		background: var(--color-solar-green-medium) !important;
		border-color: var(--color-solar-green-medium) !important;
		box-shadow: var(--shadow-solar-sm);
	}

	.n-tab.active::after {
		display: none; /* Hide standard bottom bar */
	}

	/* RESPONSIVE JOURNAL POPUP (MOBILE) */
	@media (max-width: 768px) {
		.notebook-layout-container {
			flex-direction: column;
			gap: 1rem;
			min-height: auto;
		}

		.notebook-menu-column {
			width: 100%;
		}

		.notebook-vertical-divider {
			display: none;
		}

		.carousel-nav-wrapper {
			display: flex;
			position: relative;
			gap: 0.5rem;
		}

		.carousel-arrow {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: var(--color-solar-bg);
			border: 1.5px solid var(--color-solar-card-border);
			cursor: pointer;
			font-size: 1.1rem;
			font-weight: bold;
			color: var(--color-solar-green-dark);
			user-select: none;
			transition: all 0.2s ease;
			z-index: 10;
		}

		.carousel-arrow:hover {
			background: white;
			border-color: var(--color-solar-green-medium);
		}

		.notebook-tabs-menu {
			flex-direction: row !important;
			overflow-x: auto;
			scroll-behavior: smooth;
			-webkit-overflow-scrolling: touch;
			gap: 0.5rem;
			flex: 1;
			width: 100%;
			padding-bottom: 0.5rem;
			scrollbar-width: none; /* Hide scrollbar Firefox */
		}

		.notebook-tabs-menu::-webkit-scrollbar {
			display: none; /* Hide scrollbar Chrome/Safari */
		}

		.n-tab {
			width: auto !important;
			white-space: nowrap;
			display: inline-block;
			padding: 0.5rem 1rem;
			border-radius: 20px;
		}
	}

	.n-separator {
		display: none; /* Separator not needed in new two-column layout */
	}

	.notebook-body {
		min-height: 300px;
		max-height: 480px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted);
		margin: 0 0 1.5rem;
		font-weight: 550;
	}

	/* ACCORDION CANVAS SAVED */
	.canvas-saved-block {
		background: var(--color-solar-bg);
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.world-title-saved {
		font-family: var(--font-solar-header);
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		margin: 0 0 1rem;
	}

	.canvas-grid-display {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.canvas-row-saved-container {
		background: rgba(255, 255, 255, 0.45);
		border: 1px dashed rgba(61, 143, 104, 0.25);
		border-radius: 16px;
		padding: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.canvas-row-title {
		font-family: var(--font-solar-header);
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		margin: 0 0 0.75rem 0;
		letter-spacing: 0.02em;
	}

	.canvas-row-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.driver-item-saved {
		background: white;
		border: 1px solid rgba(0,0,0,0.05);
		border-radius: 12px;
		padding: 0.75rem 1rem;
	}

	.driver-item-saved .d-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		letter-spacing: 0.05em;
		display: block;
		margin-bottom: 0.25rem;
	}

	.driver-item-saved .d-answer {
		margin: 0;
		font-size: 0.85rem;
		font-style: italic;
		line-height: 1.4;
	}

	/* EMPTY STATE */
	.empty-notebook-state {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		background: var(--color-solar-yellow-light);
		border: 1px solid rgba(255, 209, 102, 0.3);
		padding: 1.5rem;
		border-radius: 20px;
	}

	.empty-icon {
		font-size: 2.5rem;
	}


	.empty-text p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		font-weight: 600;
	}

	/* WIKI RESOURCES UNLOCKED */
	.resources-unlocked-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.resource-unlocked-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 20px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.res-badge-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.res-type-badge {
		font-size: 0.6rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		color: white;
	}

	.res-type-badge.pdf { background: #ef4444; }
	.res-type-badge.video { background: #3b82f6; }
	.res-type-badge.article { background: #10b981; }

	.res-world {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-solar-text-muted);
	}

	.resource-unlocked-card h4 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-solar-green-dark);
		margin: 0;
	}

	.res-desc {
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.article-content-box {
		background: var(--color-solar-bg);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		font-size: 0.8rem;
		font-style: italic;
		line-height: 1.4;
		border-left: 3px solid var(--color-solar-green-medium);
		margin-top: 0.5rem;
	}

	/* ACHIEVEMENTS INSIGNIAS */
	.achievements-list-layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.achievement-row-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1rem 1.25rem;
		display: grid;
		grid-template-columns: 48px 1fr 140px;
		gap: 1.5rem;
		align-items: center;
		box-shadow: var(--shadow-solar-sm);
	}

	@media (max-width: 600px) {
		.achievement-row-card {
			grid-template-columns: 48px 1fr;
		}
		.ach-date {
			grid-column: span 2;
			text-align: left !important;
		}
	}

	.ach-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--color-solar-yellow-light);
		border: 2px solid var(--color-solar-yellow);
		font-size: 1.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ach-info h4 {
		font-family: var(--font-solar-header);
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--color-solar-green-dark);
		margin: 0 0 0.15rem 0;
	}

	.ach-info p {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-solar-text-muted);
		font-weight: 550;
	}

	.ach-date {
		text-align: right;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.date-unlocked {
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		text-transform: uppercase;
	}

	.date-val {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-text);
	}

	/* CLASS ROSTER */
	.roster-grid-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.roster-grid-layout {
			grid-template-columns: 1fr;
		}
	}

	.roster-classmate-card {
		background: white;
		border: 1px solid var(--color-solar-card-border);
		border-radius: 16px;
		padding: 1rem;
		box-shadow: var(--shadow-solar-sm);
	}

	.mate-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.35rem;
	}

	.mate-card-meta {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-solar-green-medium);
	}

	.mate-avatar-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
	}

	.mate-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.mate-details strong {
		font-size: 0.9rem;
		color: var(--color-solar-green-dark);
	}

	.mate-alias {
		font-size: 0.75rem;
		color: var(--color-solar-green-medium);
		font-style: italic;
		font-weight: 700;
	}

	.mt-3 { margin-top: 0.75rem; }
	.text-xxs-font { font-size: 10px; }
	.p-sm-pad { padding: 0.375rem; }
	.rounded { border-radius: 0.25rem; }
	.border { border: 1px solid #E5E7EB; }

	.ideas-list-layout {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
	}

	/* IDEAS STYLES */
	.scenario-text-journal {
		font-family: var(--font-solar-header), sans-serif;
		font-size: 0.95rem;
		font-weight: 800;
		color: var(--color-solar-green-dark);
		line-height: 1.4;
		margin: 0.5rem 0 0;
	}

	.idea-card {
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.idea-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
		border-color: var(--color-solar-green-medium);
	}

	/* Color categories for Drivers matching Solarpunk visual system */
	.driver-tag {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		letter-spacing: 0.05em;
		display: inline-block;
		background: var(--color-solar-green-light);
		color: var(--color-solar-green-dark);
	}

	.driver-tag.driver-hedonismo { background: #ffe4e6; color: #e11d48; }
	.driver-tag.driver-eficiencia { background: #fee2e2; color: #b91c1c; }
	.driver-tag.driver-relacionamiento { background: #ffedd5; color: #d97706; }
	.driver-tag.driver-maestría { background: #e0f2fe; color: #0369a1; }
	.driver-tag.driver-descubrimiento { background: #d2f5e3; color: #1e4533; }
	.driver-tag.driver-empoderamiento { background: #f3e8ff; color: #6b21a8; }
	.driver-tag.driver-propósito { background: #fef3c7; color: #b45309; }
</style>
