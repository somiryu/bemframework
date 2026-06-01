<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Active tab inside administrative dashboard
	let activeTab = $state('newsletter'); // 'newsletter', 'worlds', 'classes'

	// --- 1. NEWSLETTER STATE & ACTIONS (Preserved) ---
	let searchSubscribers = $state('');
	let emailSubject = $state('');
	let wysiwygContent = $state('<h2>¡Hola Diseñadores BEM!</h2><p>Este es el inicio de tu nuevo boletín informativo altamente gamificado. Comienza a editar para crear un correo inolvidable.</p><p>Puedes usar la barra de herramientas para dar formato a los textos e incrustar imágenes locales convirtiéndolas automáticamente a Base64.</p>');
	let imageLinkUrl = $state('');
	let showUrlModal = $state(false);
	let isSubmitting = $state(false);

	let editorRef = $state<HTMLDivElement | null>(null);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	function handleEditorInput(e: Event) {
		if (editorRef) {
			wysiwygContent = editorRef.innerHTML;
		}
	}

	onMount(() => {
		if (editorRef) {
			editorRef.innerHTML = wysiwygContent;
		}
	});

	const filteredSubscribers = $derived(
		data.subscribers ? data.subscribers.filter((sub: any) =>
			sub.email.toLowerCase().includes(searchSubscribers.toLowerCase())
		) : []
	);

	function execCommand(command: string, value: string = '') {
		if (typeof window !== 'undefined') {
			document.execCommand(command, false, value);
			if (editorRef) {
				wysiwygContent = editorRef.innerHTML;
			}
		}
	}

	function handleLocalImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			const reader = new FileReader();
			reader.onload = (event) => {
				const base64Url = event.target?.result as string;
				execCommand(
					'insertHTML',
					`<img src="${base64Url}" style="max-width: 100%; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Incrustada" />`
				);
			};
			reader.readAsDataURL(file);
			target.value = '';
		}
	}

	function handleInsertImageUrl() {
		if (imageLinkUrl.trim()) {
			execCommand(
				'insertHTML',
				`<img src="${imageLinkUrl.trim()}" style="max-width: 100%; border-radius: 8px; margin: 15px 0;" alt="Imagen URL" />`
			);
			imageLinkUrl = '';
			showUrlModal = false;
		}
	}

	function handleInsertLink() {
		const url = prompt('Ingresa la URL del enlace:');
		if (url) {
			execCommand('createLink', url);
		}
	}

	// --- 2. BEM WORLDS EDITOR STATE ---
	let selectedWorld = $state<any>(null);
	let worldIdStr = $state('new');
	let worldOrderIndex = $state(1);
	let worldTitle = $state('');
	let worldNarrativePlace = $state('');
	let worldNarrativeObjective = $state('');
	let worldNarrativeMentor = $state('Sara Arbelaez');
	
	let worldNarrativeIntro = $state('[]');
	let worldNarrativeOutro = $state('[]');
	let worldWorkshopModules = $state('{}');
	let worldTrainingModules = $state('{}');
	let worldDesignModules = $state('{}');
	let worldWikiModules = $state('[]');

	function loadWorldForEdit(world: any) {
		selectedWorld = world;
		worldIdStr = world.id.toString();
		worldOrderIndex = world.order_index;
		worldTitle = world.title;
		worldNarrativePlace = world.narrative_place;
		worldNarrativeObjective = world.narrative_objective;
		worldNarrativeMentor = world.narrative_mentor;

		worldNarrativeIntro = JSON.stringify(world.narrative_intro, null, 2);
		worldNarrativeOutro = JSON.stringify(world.narrative_outro, null, 2);
		worldWorkshopModules = JSON.stringify(world.workshop_modules, null, 2);
		worldTrainingModules = JSON.stringify(world.training_modules, null, 2);
		worldDesignModules = JSON.stringify(world.design_modules, null, 2);
		worldWikiModules = JSON.stringify(world.wiki_modules, null, 2);
	}

	function clearWorldEditor() {
		selectedWorld = null;
		worldIdStr = 'new';
		worldOrderIndex = data.courseWorlds.length + 1;
		worldTitle = '';
		worldNarrativePlace = '';
		worldNarrativeObjective = '';
		worldNarrativeMentor = 'Sara Arbelaez';

		// Load clean Solarpunk templates!
		worldNarrativeIntro = JSON.stringify([
			{ "character": "GIOCHI", "text": "¡Bip-bup! Bienvenido al Mundo." },
			{ "character": "Sara Arbelaez", "text": "Hola, agente. Hoy analizaremos nuevos perfiles." }
		], null, 2);
		
		worldNarrativeOutro = JSON.stringify([
			{ "character": "Kira Yamada", "text": "Buen trabajo. Has finalizado tu entrenamiento." }
		], null, 2);

		worldWorkshopModules = JSON.stringify({
			"slides": [
				{ "id": "welcome", "title": "Bienvenida", "type": "onboarding" },
				{ "id": "roster", "title": "Dashboard", "type": "roster" }
			]
		}, null, 2);

		worldTrainingModules = JSON.stringify({
			"title": "Entrenamiento de Drivers",
			"description": "Clasifica las metas.",
			"questions": [
				{
					"id": "q1",
					"scenario": "Ejemplo de escenario educativo...",
					"options": ["Hedonismo", "Eficiencia", "Relación", "Maestría"],
					"correct": "Hedonismo",
					"explanation": "Detalle explicativo."
				}
			]
		}, null, 2);

		worldDesignModules = JSON.stringify({
			"title": "Canvas de Diseño Serio BEM",
			"description": "Completa el canvas.",
			"fields": [
				{ "driver": "Hedonismo", "label": "Hedonismo y Placer", "placeholder": "Meta..." }
			]
		}, null, 2);

		worldWikiModules = JSON.stringify([
			{ "id": "doc1", "title": "Recurso 1", "type": "pdf", "cost": 5, "url": "#", "desc": "Descripción..." }
		], null, 2);
	}

	// Filtered list of students by active class code
	let classCodeFilter = $state('');
	const filteredPlayers = $derived(
		data.coursePlayers ? data.coursePlayers.filter((player: any) =>
			!classCodeFilter || player.instance_code === classCodeFilter
		) : []
	);

	// Clipboard Copy Link Utility
	let copiedInstanceCode = $state<string | null>(null);
	function copyLoginLink(code: string) {
		if (typeof window !== 'undefined') {
			const loginUrl = `${window.location.origin}/${code}/login`;
			navigator.clipboard.writeText(loginUrl);
			copiedInstanceCode = code;
			setTimeout(() => {
				if (copiedInstanceCode === code) {
					copiedInstanceCode = null;
				}
			}, 2500);
		}
	}
</script>

<svelte:head>
	<title>Panel de Control | BEM Administración Core</title>
</svelte:head>

<div class="admin-dashboard-container learn-theme">
	{#if !data.isSuperUser}
		<!-- ---------------------------------------------------- -->
		<!-- SOLARPUNK ADMINISTRATIVE LOGIN                       -->
		<!-- ---------------------------------------------------- -->
		<div class="login-overlay" in:fade>
			<div class="login-card glass-card">
				<div class="login-header">
					<div class="logo-area">🌱</div>
					<h2>Acceso OMIE Core</h2>
					<p>Ingresa tus credenciales de orquestador de aprendizaje para acceder al panel BEM.</p>
				</div>

				{#if form && !form.success}
					<div class="status-alert error" in:slide>
						<p>{form.message}</p>
					</div>
				{/if}

				<form method="POST" action="?/loginAdmin" use:enhance class="login-form">
					<div class="form-group">
						<label for="email">Email Administrativo</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							placeholder="javier@f2p.co"
							class="subject-input"
						/>
					</div>

					<div class="form-group">
						<label for="password">Contraseña Core</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							placeholder="Contraseña"
							class="subject-input"
						/>
					</div>

					<button type="submit" class="btn-solar-primary w-full justify-center mt-4">
						🔓 Autenticar Orquestador
					</button>
				</form>
				
				<div class="login-footer">
					<p>BEM Behavioral-Experiential-Meaningful Framework • OMIE Central</p>
				</div>
			</div>
		</div>
	{:else}
		<!-- ---------------------------------------------------- -->
		<!-- MAIN CORE ADMIN DASHBOARD INTERFACE                 -->
		<!-- ---------------------------------------------------- -->
		<header class="admin-header">
			<div class="header-inner container">
				<div class="title-area">
					<span class="admin-badge">ADMIN ORQUESTADOR</span>
					<h1>Panel de Administración BEM</h1>
					<p>Gestiona mundos lineales, monitorea instancias de clase y orquesta workshops.</p>
				</div>
				
				<div class="header-actions">
					<div class="super-user-tag">
						<span class="user-avatar">👤</span>
						<span class="user-email">{data.superUserEmail}</span>
					</div>
					<form method="POST" action="?/logoutAdmin" use:enhance>
						<button type="submit" class="btn-logout">
							🚪 Salir
						</button>
					</form>
				</div>
			</div>

			<!-- TAB CONTROLLER BAR -->
			<div class="container tabs-bar">
				<button 
					class="tab-btn" 
					class:active={activeTab === 'newsletter'} 
					onclick={() => activeTab = 'newsletter'}
				>
					📰 Newsletter
				</button>
				<button 
					class="tab-btn" 
					class:active={activeTab === 'worlds'} 
					onclick={() => { activeTab = 'worlds'; clearWorldEditor(); }}
				>
					🌱 Mundos BEM ({data.courseWorlds.length})
				</button>
				<button 
					class="tab-btn" 
					class:active={activeTab === 'classes'} 
					onclick={() => activeTab = 'classes'}
				>
					🎓 Clases & Alumnos
				</button>
			</div>
		</header>

		<div class="container main-content-area">
			<!-- ---------------------------------------------------- -->
			<!-- TAB 1: NEWSLETTER ADMIN (PRESERVED IN FULL)          -->
			<!-- ---------------------------------------------------- -->
			{#if activeTab === 'newsletter'}
				<div class="admin-grid" in:fade>
					<!-- LEFT: SUBSCRIBERS -->
					<section class="sidebar-subscribers glass-card">
						<div class="card-header">
							<h2>👥 Suscriptores Newsletter</h2>
							<span class="sub-count">{data.subscribers.length} total</span>
						</div>

						<div class="search-bar">
							<input
								type="text"
								placeholder="Buscar por email..."
								bind:value={searchSubscribers}
								class="search-input"
							/>
							<span class="search-icon">🔍</span>
						</div>

						<div class="subscribers-table-wrapper">
							{#if filteredSubscribers.length > 0}
								<table class="subscribers-table">
									<thead>
										<tr>
											<th>Email</th>
											<th>Registro</th>
											<th>Origen</th>
										</tr>
									</thead>
									<tbody>
										{#each filteredSubscribers as sub}
											<tr>
												<td class="email-col"><strong>{sub.email}</strong></td>
												<td class="date-col">{new Date(sub.created_at).toLocaleDateString()}</td>
												<td class="source-col">
													<span class="badge" class:supabase={sub.source === 'supabase'} class:local={sub.source === 'local'}>
														{sub.source}
													</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{:else}
								<div class="empty-list">
									<p>No se encontraron suscriptores.</p>
								</div>
							{/if}
						</div>
					</section>

					<!-- RIGHT: NEWSLETTER EDITOR -->
					<section class="editor-section glass-card">
						<div class="card-header">
							<h2>✏️ Diseñar & Enviar Boletín Informativo</h2>
						</div>

						{#if !data.isBrevoConfigured}
							<div class="simulation-banner">
								<span class="icon">⚠️</span>
								<div class="banner-text">
									<strong>Modo Simulación Activo</strong>
									<p>El boletín no se enviará. El HTML se guardará en `data/last_sent_simulation.html` para previsualización.</p>
								</div>
							</div>
						{/if}

						{#if form && form.success}
							<div class="status-alert success" in:slide>
								<h3>🎉 ¡Envío Procesado!</h3>
								<p>{form.message}</p>
							</div>
						{/if}

						<form
							method="POST"
							action="?/sendNewsletter"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									isSubmitting = false;
									await update();
								};
							}}
							class="newsletter-form"
						>
							<div class="form-group">
								<label for="subject">Asunto del Correo</label>
								<input
									type="text"
									id="subject"
									name="subject"
									bind:value={emailSubject}
									required
									placeholder="Ej: Descubre la Gamificación de Segunda Generación"
									class="subject-input"
								/>
							</div>

							<input type="hidden" name="htmlContent" bind:value={wysiwygContent} />

							<div class="wysiwyg-wrapper">
								<label>Cuerpo del Correo</label>
								
								<div class="editor-toolbar">
									<button type="button" onclick={() => execCommand('bold')}><strong>B</strong></button>
									<button type="button" onclick={() => execCommand('italic')}><em>I</em></button>
									<button type="button" onclick={() => execCommand('underline')}><span class="underline">U</span></button>
									<div class="divider"></div>
									<button type="button" onclick={() => execCommand('formatBlock', '<h2>')}>H2</button>
									<button type="button" onclick={() => execCommand('formatBlock', '<h3>')}>H3</button>
									<button type="button" onclick={() => execCommand('formatBlock', '<p>')}>P</button>
									<div class="divider"></div>
									<button type="button" onclick={handleInsertLink}>🔗 Enlace</button>
									<button type="button" onclick={() => fileInputRef?.click()}>🖼️ Subir</button>
									<button type="button" onclick={() => showUrlModal = true}>🌐 URL</button>
								</div>

								<input
									type="file"
									accept="image/*"
									bind:this={fileInputRef}
									onchange={handleLocalImageUpload}
									style="display: none;"
								/>

								<div
									bind:this={editorRef}
									contenteditable="true"
									oninput={handleEditorInput}
									class="editor-editable"
									role="textbox"
									aria-multiline="true"
									tabindex="0"
								></div>
							</div>

							<div class="submit-row">
								<button
									type="submit"
									disabled={isSubmitting || data.subscribers.length === 0}
									class="send-btn"
								>
									🚀 Enviar Boletín a {data.subscribers.length} Suscriptores
								</button>
							</div>
						</form>
					</section>
				</div>
			{/if}

			<!-- ---------------------------------------------------- -->
			<!-- TAB 2: COURSE WORLDS EDITOR                          -->
			<!-- ---------------------------------------------------- -->
			{#if activeTab === 'worlds'}
				<div class="admin-grid" in:fade>
					<!-- LEFT COLUMN: WORLDS LIST -->
					<section class="sidebar-subscribers glass-card">
						<div class="card-header justify-between">
							<h2>🌱 Mundos del Curso</h2>
							<button class="btn-solar-secondary btn-sm" onclick={clearWorldEditor}>
								➕ Nuevo Mundo
							</button>
						</div>

						<div class="worlds-vertical-list">
							{#each data.courseWorlds as world}
								<button 
									class="world-list-item" 
									class:selected={selectedWorld && selectedWorld.id === world.id}
									onclick={() => loadWorldForEdit(world)}
								>
									<div class="world-index">Mundo {world.order_index}</div>
									<div class="world-name">{world.title}</div>
									<div class="world-meta-info">📍 {world.narrative_place} | 👤 {world.narrative_mentor}</div>
								</button>
							{/each}
						</div>
					</section>

					<!-- RIGHT COLUMN: WORLD EDITOR FORM -->
					<section class="editor-section glass-card">
						<div class="card-header">
							<h2>⚙️ {worldIdStr === 'new' ? 'Crear Nuevo Mundo BEM' : `Modificar Mundo ${worldOrderIndex}`}</h2>
						</div>

						<form 
							method="POST" 
							action="?/updateWorldContent" 
							use:enhance 
							class="newsletter-form"
						>
							<input type="hidden" name="world_id" bind:value={worldIdStr} />

							<div class="editor-two-cols">
								<div class="form-group">
									<label for="order_index">Índice del Mundo (Orden lineal)</label>
									<input
										type="number"
										id="order_index"
										name="order_index"
										bind:value={worldOrderIndex}
										required
										class="subject-input"
									/>
								</div>

								<div class="form-group">
									<label for="narrative_mentor">Mentor Principal del Mundo</label>
									<select
										id="narrative_mentor"
										name="narrative_mentor"
										bind:value={worldNarrativeMentor}
										class="subject-input"
									>
										<option value="Sara Arbelaez">Sara Arbelaez (Psicóloga/Antropóloga)</option>
										<option value="John Wilkins">John Wilkins (Mecánicas/Sistemas)</option>
										<option value="Kira Yamada">Kira Yamada (Diseño de Objetivos)</option>
									</select>
								</div>
							</div>

							<div class="form-group">
								<label for="world_title">Título del Mundo</label>
								<input
									type="text"
									id="world_title"
									name="title"
									bind:value={worldTitle}
									required
									placeholder="Ej: Misión 1: Iniciación en la OMIE y los 7 Drivers BEM"
									class="subject-input"
								/>
							</div>

							<div class="editor-two-cols">
								<div class="form-group">
									<label for="narrative_place">Lugar de Juego (Setting)</label>
									<input
										type="text"
										id="narrative_place"
										name="narrative_place"
										bind:value={worldNarrativePlace}
										required
										placeholder="Ej: Domo Solar de la OMIE"
										class="subject-input"
									/>
								</div>

								<div class="form-group">
									<label for="narrative_objective">Objetivo del Mundo</label>
									<input
										type="text"
										id="narrative_objective"
										name="narrative_objective"
										bind:value={worldNarrativeObjective}
										required
										placeholder="Ej: Configurar tu hoja de personaje RPG..."
										class="subject-input"
									/>
								</div>
							</div>

							<hr class="form-separator" />

							<div class="tabs-subsystems">
								<h3>🛠️ Configuraciones de Módulos (JSON)</h3>
								<p class="section-desc">Escribe o edita los contenidos en formato JSON. Se validará la sintaxis al guardar.</p>
							</div>

							<div class="json-editors-grid">
								<div class="form-group">
									<label>Conversación de Introducción (Narrative Intro Array)</label>
									<textarea name="narrative_intro" bind:value={worldNarrativeIntro} class="json-textarea" rows="4"></textarea>
								</div>

								<div class="form-group">
									<label>Conversación de Finalización (Narrative Outro Array)</label>
									<textarea name="narrative_outro" bind:value={worldNarrativeOutro} class="json-textarea" rows="4"></textarea>
								</div>

								<div class="form-group">
									<label>Workshop Módulo Síncrono (Slides Array)</label>
									<textarea name="workshop_modules" bind:value={worldWorkshopModules} class="json-textarea" rows="4"></textarea>
								</div>

								<div class="form-group">
									<label>Training Módulo Asíncrono (Trivia Quiz Dictionary)</label>
									<textarea name="training_modules" bind:value={worldTrainingModules} class="json-textarea" rows="4"></textarea>
								</div>

								<div class="form-group">
									<label>Módulo de Diseño (Canvas Dictionary)</label>
									<textarea name="design_modules" bind:value={worldDesignModules} class="json-textarea" rows="4"></textarea>
								</div>

								<div class="form-group">
									<label>Wiki Módulo (Resources Array)</label>
									<textarea name="wiki_modules" bind:value={worldWikiModules} class="json-textarea" rows="4"></textarea>
								</div>
							</div>

							<div class="submit-row justify-between items-center mt-6">
								<button type="button" class="btn-solar-secondary" onclick={clearWorldEditor}>
									🗑️ Descartar Cambios
								</button>
								<button type="submit" class="btn-solar-accent">
									💾 Guardar Contenidos de Mundo
								</button>
							</div>
						</form>
					</section>
				</div>
			{/if}

			<!-- ---------------------------------------------------- -->
			<!-- TAB 3: CLASSES & PLAYERS MONITOR                     -->
			<!-- ---------------------------------------------------- -->
			{#if activeTab === 'classes'}
				<div class="admin-grid" in:fade>
					<!-- LEFT: CLASS INSTANCE CREATOR & LIST -->
					<section class="sidebar-subscribers glass-card">
						<div class="card-header">
							<h2>🏫 Instancias de Clases</h2>
						</div>

						{#if form && form.success}
							<div class="status-alert success mb-4" in:slide>
								<p>🎉 {form.message}</p>
							</div>
						{:else if form && !form.success}
							<div class="status-alert error mb-4" in:slide>
								<p>⚠️ {form.message}</p>
							</div>
						{/if}

						<form 
							method="POST" 
							action="?/createInstance" 
							use:enhance 
							class="create-class-form mb-6"
						>
							<div class="form-group">
								<label for="code">Código Único de Clase</label>
								<div class="flex gap-2">
									<input
										type="text"
										id="code"
										name="code"
										required
										placeholder="Ej: BEM-2026-SPRING"
										class="subject-input"
									/>
									<button type="submit" class="btn-solar-accent font-bold py-2">
										Instanciar
									</button>
								</div>
							</div>
						</form>

						<div class="classes-list">
							{#each data.courseInstances as instance}
								<div class="class-card-item">
									<!-- REDESIGNED CLEAN HEADER -->
									<div class="class-card-header flex items-center justify-between">
										<span class="class-code">{instance.code}</span>
										<span class="class-date">📅 {new Date(instance.created_at).toLocaleDateString()}</span>
									</div>
									
									<div class="class-card-body mt-3">
										<!-- Dedicated action buttons row -->
										<div class="class-actions-row flex gap-2 mb-3">
											<button 
												type="button" 
												class="btn-copy-link flex-1 justify-center" 
												onclick={() => copyLoginLink(instance.code)}
												title="Copiar enlace de inicio de sesión directo para alumnos"
											>
												{#if copiedInstanceCode === instance.code}
													✔️ Copiado
												{:else}
													🔗 Copiar Enlace
												{/if}
											</button>
											<form method="POST" action="?/loginAsSuperUserPlayer" use:enhance class="flex-1 flex" target="_blank">
												<input type="hidden" name="code" value={instance.code} />
												<button 
													type="submit" 
													class="btn-go-to-course w-full justify-center"
													title="Entrar al curso como superusuario"
												>
													🎮 Ir al curso
												</button>
											</form>
										</div>

										<div class="workshop-slide-status mb-3">
											🎬 Slide Activo: <strong>{instance.current_workshop_state?.slide_index ?? 0}</strong> 
											<span class="status-world-label">(Mundo {instance.current_workshop_state?.world_id ?? 1})</span>
										</div>
										
										<div class="unlocked-worlds-pills">
											<span class="unlocked-label">Mundos Desbloqueados:</span>
											<div class="flex flex-wrap gap-1 mt-1">
												{#each data.courseWorlds as world}
													{@const isUnlocked = instance.unlocked_worlds.includes(world.id)}
													<form method="POST" action="?/toggleWorldUnlock" use:enhance class="inline-block">
														<input type="hidden" name="instance_code" value={instance.code} />
														<input type="hidden" name="world_id" value={world.id} />
														<input type="hidden" name="action" value={isUnlocked ? 'lock' : 'unlock'} />
														<button 
															type="submit" 
															class="world-pill-toggle"
															class:unlocked={isUnlocked}
															title={isUnlocked ? 'Haga clic para bloquear este mundo' : 'Haga clic para desbloquear este mundo'}
														>
															M{world.order_index} {isUnlocked ? '🔓' : '🔒'}
														</button>
													</form>
												{/each}
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>

					<!-- RIGHT: ACTIVE STUDENTS ROSTER & FEEDBACKS -->
					<section class="editor-section glass-card">
						<div class="card-header justify-between">
							<h2>🎓 Roster de Estudiantes & Testimonios</h2>
							<div class="filter-wrapper flex items-center gap-2">
								<label for="class-filter" class="text-xs font-bold whitespace-nowrap">Filtrar por Clase:</label>
								<select id="class-filter" bind:value={classCodeFilter} class="filter-select">
									<option value="">Todas las clases</option>
									{#each data.courseInstances as inst}
										<option value={inst.code}>{inst.code}</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="sub-tabs-players flex gap-4 border-b border-gray-200 pb-2 mb-4">
							<button class="font-bold text-sm text-solar-green-dark">Estudiantes ({filteredPlayers.length})</button>
						</div>

						<div class="players-vertical-roster max-h-96 overflow-y-auto mb-8">
							{#if filteredPlayers.length > 0}
								<div class="players-grid">
									{#each filteredPlayers as player}
										<div class="player-roster-card">
											<div class="player-avatar-badge">{player.avatar ? player.avatar.substring(0,2).toUpperCase() : 'AG'}</div>
											<div class="player-info">
												<div class="player-name-row">
													<strong>{player.name}</strong> 
													<span class="player-alias">"{player.alias}"</span>
												</div>
												<div class="player-meta text-xs">
													✉️ {player.email} | 🎓 {player.instance_code}
												</div>
												<div class="player-stats-row">
													🪙 <strong>{player.coins} BEM Coins</strong>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="empty-list">
									<p>No hay estudiantes registrados para este filtro.</p>
								</div>
							{/if}
						</div>

						<div class="card-header">
							<h2>💬 Testimonios de Workshops (Feedbacks)</h2>
						</div>

						<div class="feedbacks-list max-h-96 overflow-y-auto">
							{#if data.feedbackTestimonies && data.feedbackTestimonies.length > 0}
								{#each data.feedbackTestimonies as f}
									<div class="feedback-card">
										<div class="feedback-card-header justify-between">
											<div class="feedback-student">
												👤 <strong>{f.player_name}</strong> 
												<span class="text-xs ml-2 text-gray-500">| Clase: {f.instance_code} | Mundo {f.world_id}</span>
											</div>
											<span class="testimonial-public-badge" class:public={f.allow_public}>
												{f.allow_public ? 'Público ✓' : 'Privado ✗'}
											</span>
										</div>

										<div class="feedback-ratings">
											<div class="rating-bar">
												<span class="lbl">Enganche</span>
												<div class="dots-stars">
													{#each Array(5) as _, i}
														<span class="star" class:filled={i < f.rating_engagement}>★</span>
													{/each}
												</div>
											</div>
											<div class="rating-bar">
												<span class="lbl">Dificultad</span>
												<div class="dots-stars">
													{#each Array(5) as _, i}
														<span class="star" class:filled={i < f.rating_difficulty}>★</span>
													{/each}
												</div>
											</div>
											<div class="rating-bar">
												<span class="lbl">Ritmo</span>
												<div class="dots-stars">
													{#each Array(5) as _, i}
														<span class="star" class:filled={i < f.rating_pace}>★</span>
													{/each}
												</div>
											</div>
											<div class="rating-bar">
												<span class="lbl">Pertinencia</span>
												<div class="dots-stars">
													{#each Array(5) as _, i}
														<span class="star" class:filled={i < f.rating_relevance}>★</span>
													{/each}
												</div>
											</div>
										</div>

										{#if f.comment}
											<blockquote class="feedback-comment">
												"{f.comment}"
											</blockquote>
										{/if}
									</div>
								{/each}
							{:else}
								<div class="empty-list">
									<p>No se han recibido cuestionarios de feedback aún.</p>
								</div>
							{/if}
						</div>
					</section>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- EXTERNAL IMAGE URL DIALOG MODAL (Newsletter Preserved) -->
{#if showUrlModal}
	<div class="modal-overlay" onclick={() => showUrlModal = false} transition:fade={{ duration: 150 }}>
		<div class="modal-content glass-card" onclick={(e) => e.stopPropagation()} transition:slide={{ duration: 200 }}>
			<h3>Insertar Imagen por Enlace</h3>
			<p>Pega la dirección URL completa de la imagen externa:</p>
			
			<input
				type="url"
				bind:value={imageLinkUrl}
				placeholder="https://ejemplo.com/imagen.jpg"
				class="modal-input"
			/>
			
			<div class="modal-actions">
				<button type="button" onclick={() => showUrlModal = false} class="btn-cancel">Cancelar</button>
				<button type="button" onclick={handleInsertImageUrl} class="btn-confirm">Insertar Imagen</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.admin-dashboard-container {
		background: var(--color-solar-bg, #FAF9F6);
		min-height: 100vh;
		padding-bottom: 5rem;
		color: var(--color-solar-text, #1E4533);
	}

	.admin-header {
		background: linear-gradient(135deg, hsl(150, 43%, 15%) 0%, hsl(152, 40%, 25%) 100%);
		color: white;
		padding: 2rem 0 0 0;
		margin-bottom: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.header-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 2rem;
		padding-bottom: 1.5rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.super-user-tag {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.15);
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.btn-logout {
		background: hsl(20, 70%, 60%);
		border: none;
		color: white;
		font-weight: bold;
		padding: 0.5rem 1.25rem;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-logout:hover {
		transform: translateY(-2px);
		background: hsl(20, 70%, 55%);
	}

	.title-area {
		flex: 1;
		min-width: 300px;
	}

	.admin-badge {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		background: rgba(255, 209, 102, 0.2);
		color: var(--color-solar-yellow, #FFD166);
		border: 1px solid rgba(255, 209, 102, 0.3);
		padding: 0.3rem 0.75rem;
		border-radius: 6px;
		margin-bottom: 0.75rem;
	}

	.title-area h1 {
		font-family: var(--font-solar-header, inherit);
		font-size: 2rem;
		font-weight: 800;
		color: white;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}

	.title-area p {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
		font-weight: 500;
	}

	.tabs-bar {
		display: flex;
		gap: 0.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tab-btn {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		padding: 1rem 1.75rem;
		font-family: var(--font-solar-header, inherit);
		font-weight: 700;
		font-size: 1.05rem;
		cursor: pointer;
		position: relative;
		transition: all 0.2s ease;
	}

	.tab-btn:hover {
		color: white;
	}

	.tab-btn.active {
		color: var(--color-solar-yellow, #FFD166);
	}

	.tab-btn.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: var(--color-solar-yellow, #FFD166);
		border-radius: 4px 4px 0 0;
	}

	.main-content-area {
		padding-top: 1rem;
	}

	/* ADMIN GRID */
	.admin-grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 2rem;
		align-items: start;
		max-width: 1400px;
		margin: 0 auto;
	}

	@media (max-width: 1024px) {
		.admin-grid {
			grid-template-columns: 1fr;
		}
	}

	.glass-card {
		background: white;
		border: 1px solid var(--color-solar-card-border, #E5E7EB);
		border-radius: 24px;
		box-shadow: var(--shadow-solar-sm);
		padding: 2rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #E5E7EB;
		padding-bottom: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.card-header h2 {
		font-family: var(--font-solar-header, inherit);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1E4533);
		margin: 0;
	}

	.sub-count {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3D8F68);
		background: var(--color-solar-green-light, #d2f5e3);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
	}

	/* LOGIN SCREEN */
	.login-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 100px);
		padding: 2rem;
	}

	.login-card {
		max-width: 480px;
		width: 100%;
		padding: 3rem 2.5rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo-area {
		font-size: 3rem;
		margin-bottom: 1rem;
		animation: float 4s ease-in-out infinite;
	}

	.login-header h2 {
		font-family: var(--font-solar-header, inherit);
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1E4533);
		margin: 0 0 0.5rem;
	}

	.login-header p {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted, #6B7280);
		margin: 0;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.login-footer {
		text-align: center;
		margin-top: 2rem;
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #6B7280);
		font-weight: 600;
	}

	/* WORLDS EDIT LIST */
	.worlds-vertical-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-height: 700px;
		overflow-y: auto;
	}

	.world-list-item {
		text-align: left;
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid #E5E7EB;
		padding: 1rem 1.25rem;
		border-radius: 16px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.world-list-item:hover {
		transform: translateY(-2px);
		border-color: var(--color-solar-green-medium, #3D8F68);
		background: white;
		box-shadow: var(--shadow-solar-sm);
	}

	.world-list-item.selected {
		background: var(--color-solar-green-light, #d2f5e3);
		border-color: var(--color-solar-green-medium, #3D8F68);
	}

	.world-index {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium, #3D8F68);
		text-transform: uppercase;
		margin-bottom: 0.25rem;
	}

	.world-name {
		font-family: var(--font-solar-header, inherit);
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-solar-green-dark, #1E4533);
		margin-bottom: 0.5rem;
	}

	.world-meta-info {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #6B7280);
		font-weight: 600;
	}

	/* FORM SEPARATOR */
	.form-separator {
		border: none;
		border-top: 1px solid #E5E7EB;
		margin: 2rem 0;
	}

	.editor-two-cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.tabs-subsystems h3 {
		font-family: var(--font-solar-header, inherit);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--color-solar-green-dark, #1E4533);
		margin: 0 0 0.25rem;
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--color-solar-text-muted, #6B7280);
		margin: 0 0 1.5rem;
		font-weight: 550;
	}

	.json-editors-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	.json-textarea {
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.85rem;
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		background: #fafaf9;
		color: #1f2937;
		resize: vertical;
	}

	.json-textarea:focus {
		outline: none;
		border-color: var(--color-solar-green-medium, #3D8F68);
		background: white;
	}

	/* CLASSES SECTION LIST */
	.classes-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 600px;
		overflow-y: auto;
	}

	.class-card-item {
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid #E5E7EB;
		border-radius: 16px;
		padding: 1.25rem;
		transition: all 0.2s ease;
	}

	.class-card-item:hover {
		box-shadow: var(--shadow-solar-sm);
		border-color: var(--color-solar-green-medium, #3D8F68);
	}

	.class-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.5rem;
	}

	.btn-copy-link {
		background: var(--color-solar-green-light, #d2f5e3);
		color: var(--color-solar-green-dark, #1E4533);
		border: 1px solid rgba(61, 143, 104, 0.2);
		padding: 0.4rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 750;
		border-radius: 8px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition: all 0.2s ease;
	}

	.btn-copy-link:hover {
		background: var(--color-solar-green-medium, #3D8F68);
		color: white;
		transform: translateY(-1px);
	}

	.btn-go-to-course {
		background: var(--color-solar-sky-light, #e1f4fc);
		color: var(--color-solar-sky, #188db5);
		border: 1px solid rgba(24, 141, 181, 0.2);
		padding: 0.4rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 750;
		border-radius: 8px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		transition: all 0.2s ease;
	}

	.btn-go-to-course:hover {
		background: var(--color-solar-sky, #188db5);
		color: white;
		transform: translateY(-1px);
	}

	.class-code {
		font-family: var(--font-solar-header, inherit);
		font-weight: 800;
		color: var(--color-solar-green-dark, #1E4533);
		font-size: 1.25rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.class-date {
		font-size: 0.75rem;
		color: var(--color-solar-text-muted, #6B7280);
		font-weight: 700;
		background: rgba(0, 0, 0, 0.03);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
	}

	.workshop-slide-status {
		font-size: 0.85rem;
		color: var(--color-solar-text, #1E4533);
		margin-bottom: 0.75rem;
		font-weight: 600;
		background: #ffffff;
		border: 1px solid rgba(0, 0, 0, 0.04);
		padding: 0.5rem 0.75rem;
		border-radius: 10px;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
	}

	.status-world-label {
		color: var(--color-solar-text-muted);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.unlocked-worlds-pills {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.unlocked-label {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-solar-green-medium);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.world-pill-toggle {
		background: #E5E7EB;
		border: 1px solid #D1D5DB;
		color: #4B5563;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.world-pill-toggle.unlocked {
		background: var(--color-solar-green-light, #d2f5e3);
		border-color: var(--color-solar-green-medium, #3D8F68);
		color: var(--color-solar-green-dark, #1E4533);
	}

	.world-pill-toggle:hover {
		transform: scale(1.05);
	}

	.filter-select {
		padding: 0.4rem 0.8rem;
		border: 1px solid #D1D5DB;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 600;
	}

	/* ROSTER PLAYERS */
	.players-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.players-grid {
			grid-template-columns: 1fr;
		}
	}

	.player-roster-card {
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid #E5E7EB;
		border-radius: 16px;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.player-avatar-badge {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--color-solar-green-medium, #3D8F68);
		color: white;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-solar-sm);
	}

	.player-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.player-name-row {
		font-size: 0.95rem;
		color: var(--color-solar-green-dark, #1E4533);
	}

	.player-alias {
		color: var(--color-solar-green-medium, #3D8F68);
		font-weight: 700;
		font-style: italic;
	}

	.player-meta {
		color: var(--color-solar-text-muted, #6B7280);
	}

	.player-stats-row {
		font-size: 0.8rem;
		color: var(--color-solar-text, #1E4533);
	}

	/* FEEDBACK TESTIMONIES */
	.feedback-card {
		background: var(--color-solar-bg, #FAF9F6);
		border: 1px solid #E5E7EB;
		border-radius: 16px;
		padding: 1.25rem;
		margin-bottom: 1rem;
		transition: all 0.2s ease;
	}

	.feedback-card:hover {
		border-color: var(--color-solar-green-medium, #3D8F68);
	}

	.feedback-card-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
		border-bottom: 1px solid rgba(0,0,0,0.05);
		padding-bottom: 0.5rem;
	}

	.testimonial-public-badge {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		background: #E5E7EB;
		color: #4B5563;
	}

	.testimonial-public-badge.public {
		background: var(--color-solar-green-light, #d2f5e3);
		color: var(--color-solar-green-dark, #1E4533);
		border: 1px solid rgba(61, 143, 104, 0.2);
	}

	.feedback-ratings {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem 1.5rem;
		margin-bottom: 0.75rem;
	}

	@media (max-width: 640px) {
		.feedback-ratings {
			grid-template-columns: 1fr;
		}
	}

	.rating-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.8rem;
	}

	.rating-bar .lbl {
		font-weight: 700;
		color: var(--color-solar-text, #1E4533);
	}

	.dots-stars {
		display: flex;
		gap: 0.1rem;
	}

	.star {
		color: #D1D5DB;
		font-size: 0.95rem;
	}

	.star.filled {
		color: var(--color-solar-yellow, #FFD166);
	}

	.feedback-comment {
		font-style: italic;
		color: var(--color-solar-text-muted, #6B7280);
		margin: 0.5rem 0 0 0;
		padding-left: 0.75rem;
		border-left: 3px solid var(--color-solar-green-medium, #3D8F68);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	/* NEWSLETTER CARD PRESERVED STYLES */
	.sidebar-subscribers {
		background: white;
		border: 1px solid #E5E7EB;
		border-radius: 24px;
		padding: 2rem;
	}

	.search-bar {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		background: #f9fafb;
		font-size: 0.9rem;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-solar-green-medium, #3D8F68);
		background: white;
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.12);
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.9rem;
		opacity: 0.5;
	}

	.subscribers-table-wrapper {
		max-height: 500px;
		overflow-y: auto;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
	}

	.subscribers-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
		text-align: left;
	}

	.subscribers-table th, .subscribers-table td {
		padding: 0.85rem 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.subscribers-table th {
		background: #f9fafb;
		font-weight: 800;
		color: #4b5563;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.email-col {
		word-break: break-all;
	}

	.date-col {
		color: #6b7280;
		font-weight: 550;
	}

	.badge {
		font-size: 0.65rem;
		font-weight: 800;
		text-transform: uppercase;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
	}

	.badge.supabase {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
		border: 1px solid rgba(16, 185, 129, 0.2);
	}

	.badge.local {
		background: rgba(139, 92, 246, 0.1);
		color: #7c3aed;
		border: 1px solid rgba(139, 92, 246, 0.2);
	}

	.empty-list {
		padding: 3rem 1.5rem;
		text-align: center;
		color: #6b7280;
		font-weight: 600;
	}

	.simulation-banner {
		background: #fef3c7;
		border: 1px solid #fcd34d;
		color: #92400e;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		display: flex;
		gap: 1rem;
	}

	.simulation-banner .icon {
		font-size: 1.5rem;
	}

	.simulation-banner p {
		font-size: 0.85rem;
		margin: 0;
		line-height: 1.5;
		font-weight: 550;
	}

	.status-alert {
		padding: 1.25rem;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.status-alert.success {
		background: #dcfce7;
		border: 1px solid #bbf7d0;
		color: #15803d;
	}

	.status-alert.success h3 {
		font-size: 1.1rem;
		font-weight: 800;
		margin: 0 0 0.5rem;
	}

	.status-alert.success p {
		font-size: 0.95rem;
		margin: 0;
		font-weight: 600;
	}

	.status-alert.error {
		background: #fee2e2;
		border: 1px solid #fecaca;
		color: #b91c1c;
	}

	.status-alert.error p {
		font-size: 0.95rem;
		margin: 0;
		font-weight: 600;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-solar-text, #1E4533);
	}

	.subject-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.subject-input:focus {
		outline: none;
		border-color: var(--color-solar-green-medium, #3D8F68);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.12);
	}

	.wysiwyg-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.wysiwyg-wrapper label {
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--color-solar-text, #1E4533);
	}

	.editor-toolbar {
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-bottom: none;
		border-radius: 12px 12px 0 0;
		padding: 0.5rem;
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.editor-toolbar button {
		background: transparent;
		border: 1px solid transparent;
		padding: 0.4rem 0.7rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 700;
		color: #4b5563;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
	}

	.editor-toolbar button:hover {
		background: #e5e7eb;
		color: #111827;
		border-color: #d1d5db;
	}

	.editor-toolbar .divider {
		width: 1px;
		height: 20px;
		background: #d1d5db;
		margin: 0 0.35rem;
	}

	.underline { text-decoration: underline; }

	.editor-editable {
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 0 0 12px 12px;
		padding: 1.5rem;
		min-height: 300px;
		max-height: 500px;
		overflow-y: auto;
		outline: none;
		font-size: 1.05rem;
		line-height: 1.6;
		font-family: inherit;
		transition: all 0.2s ease;
	}

	.editor-editable:focus {
		border-color: var(--color-solar-green-medium, #3D8F68);
		box-shadow: 0 0 0 3px rgba(61, 143, 104, 0.12);
	}

	.submit-row {
		display: flex;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.send-btn {
		background: linear-gradient(135deg, var(--color-solar-green-medium), var(--color-solar-green-dark));
		color: white;
		border: none;
		padding: 0.85rem 2rem;
		font-size: 1rem;
		font-weight: 700;
		border-radius: 12px;
		cursor: pointer;
		box-shadow: var(--shadow-solar-sm);
		transition: all 0.25s ease;
	}

	.send-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-solar-md);
	}

	.send-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* MODAL STYLES */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.modal-content {
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.modal-content h3 {
		font-size: 1.3rem;
		font-weight: 800;
		margin: 0;
		color: var(--color-solar-green-dark, #1E4533);
	}

	.modal-content p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-solar-text-muted, #6B7280);
		font-weight: 600;
	}

	.modal-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn-cancel {
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		color: #4b5563;
		padding: 0.6rem 1.25rem;
		font-weight: 800;
		font-size: 0.9rem;
		border-radius: 12px;
		cursor: pointer;
	}

	.btn-cancel:hover {
		background: #e5e7eb;
	}

	.btn-confirm {
		background: var(--color-solar-green-medium, #3D8F68);
		color: white;
		border: none;
		padding: 0.6rem 1.5rem;
		font-weight: 800;
		font-size: 0.9rem;
		border-radius: 12px;
		cursor: pointer;
	}

	.btn-confirm:hover {
		background: var(--color-solar-green-dark, #1E4533);
	}

	.w-full { width: 100%; }
	.mt-4 { margin-top: 1rem; }
	.mt-6 { margin-top: 1.5rem; }
	.mb-6 { margin-bottom: 1.5rem; }
	.mb-8 { margin-bottom: 2rem; }
	.flex { display: flex; }
	.gap-1 { gap: 0.25rem; }
	.gap-2 { gap: 0.5rem; }
	.gap-4 { gap: 1rem; }
	.flex-wrap { flex-wrap: wrap; }
	.inline-block { display: inline-block; }
	.items-center { align-items: center; }
	.justify-between { justify-content: space-between; }
	.justify-center { justify-content: center; }
	.text-xs { font-size: 0.75rem; }
	.font-bold { font-weight: 700; }
	.pb-2 { padding-bottom: 0.5rem; }
	.border-b { border-bottom: 1px solid; }
	.border-gray-200 { border-color: #E5E7EB; }
	.max-h-96 { max-height: 24rem; }
	.overflow-y-auto { overflow-y: auto; }
	.text-gray-500 { color: #6B7280; }
	.ml-2 { margin-left: 0.5rem; }
	.mt-1 { margin-top: 0.25rem; }
	.whitespace-nowrap { whitespace-nowrap: nowrap; }
</style>
