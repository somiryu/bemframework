<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import NewsletterSubscription from '$lib/components/NewsletterSubscription.svelte';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	const t = $derived({
		en: {
			title: 'BEM Play & Learn Arcade | Gamification Micro-Games',
			desc: 'Interactive micro-games to learn advanced gamification concepts, feedback loops, and player psychology.',
			header: 'BEM Play & Learn',
			sub: 'Step into the arcade. Play interactive micro-games to master advanced behavior design concepts.',
			lockedMessage: 'Locked Challenge',
			unlockedAt: 'Unlocks at Level',
			comingSoon: 'Sprints Expansion Pack DLC - Coming Soon',
			games: [
				{
					title: 'Skinner-Box Smasher',
					desc: 'Dismantle coercive, repetitive reward systems. Use the hammer of Autonomy to liberate players and replace Skinner boxes with intrinsic loops.',
					lockMsg: 'Coming Soon - Phase 2 Sprint',
					cabinetColor: 'var(--color-purple)'
				},
				{
					title: 'Feedback Loop Balancer',
					desc: 'Balance "Human Wants" with "System Rules" in real-time. Adjust strategic decisions to prevent apathy, decay, or Skinner-burnout.',
					lockMsg: 'Unlocks at BEM Disciple Level 3',
					cabinetColor: 'var(--color-green)'
				},
				{
					title: 'Autonomy Climber',
					desc: 'Guide your player up the Organismic Integration Theory (OIT) ladder. Transform extrinsic pressure into self-integrated identity.',
					lockMsg: 'Coming Soon - DLC Pack',
					cabinetColor: 'var(--color-orange)'
				}
			]
		},
		es: {
			title: 'Arcade BEM Play & Learn | Microjuegos de Gamificación',
			desc: 'Microjuegos interactivos para aprender conceptos avanzados de gamificación, loops de feedback y psicología del jugador.',
			header: 'BEM Play & Learn',
			sub: 'Entra al arcade. Juega microjuegos interactivos para dominar el diseño de comportamiento avanzado.',
			lockedMessage: 'Desafío Bloqueado',
			unlockedAt: 'Se desbloquea al Nivel',
			comingSoon: 'Expansión de Sprints DLC - Próximamente',
			games: [
				{
					title: 'Skinner-Box Smasher',
					desc: 'Desmantela sistemas de recompensa coercitivos. Usa el martillo de la Autonomía para liberar jugadores y crear loops intrínsecos.',
					lockMsg: 'Próximamente - Sprint de Fase 2',
					cabinetColor: 'var(--color-purple)'
				},
				{
					title: 'Feedback Loop Balancer',
					desc: 'Equilibra "Deseos Humanos" con "Reglas del Sistema". Ajusta decisiones para evitar la apatía y el desgaste conductual.',
					lockMsg: 'Se desbloquea al Nivel 3 de Discípulo BEM',
					cabinetColor: 'var(--color-green)'
				},
				{
					title: 'Autonomy Climber',
					desc: 'Guía a tu jugador a subir la escalera de la Teoría de Integración Organísmica (OIT). Transforma la presión en identidad.',
					lockMsg: 'Próximamente - Paquete DLC',
					cabinetColor: 'var(--color-orange)'
				}
			]
		}
	}[lang]);
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={t.header} description={t.sub} />

<section class="section play-learn-view">
	<div class="container broad-layout">
		<!-- SYSTEM STATE BANNER -->
		<div class="coming-soon-banner card glass-card">
			<div class="banner-glow"></div>
			<div class="banner-inner">
				<span class="pulse-dot"></span>
				<h2>🎮 BEM Arcade Cabinet: Offline Mode</h2>
				<p>{lang === 'es' ? 'Los gabinetes de juego se están calibrando en nuestro laboratorio de motivación conductual.' : 'The game cabinets are currently being calibrated in our behavioral motivation lab.'}</p>
				<span class="dlc-badge">⚡ {t.comingSoon}</span>
			</div>
		</div>

		<!-- CABINETS GRID -->
		<div class="cabinets-grid">
			{#each t.games as game}
				<div class="cabinet-card card glass-card" style="--cabinet-accent: {game.cabinetColor}">
					<div class="cabinet-top">
						<span class="cabinet-marquee">ARCADE</span>
						<div class="screen-glare"></div>
						<div class="screen-content">
							<span class="lock-icon">🔒</span>
							<h3>{game.title}</h3>
						</div>
					</div>

					<div class="cabinet-controls">
						<div class="joystick-wrapper">
							<div class="joystick-base"></div>
							<div class="joystick-shaft"></div>
							<div class="joystick-knob"></div>
						</div>
						<div class="action-buttons">
							<span class="btn-red"></span>
							<span class="btn-yellow"></span>
						</div>
					</div>

					<div class="cabinet-info">
						<p class="desc">{game.desc}</p>
						<span class="lock-message">{game.lockMsg}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<div class="container">
	<NewsletterSubscription {lang} />
</div>

<style>
.play-learn-view {
	background: var(--color-bg);
	padding-top: 0;
}

.broad-layout {
	max-width: 1280px !important;
	display: flex;
	flex-direction: column;
	gap: 4rem;
}

/* COMING SOON BANNER */
.coming-soon-banner {
	background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
	border: 1px solid rgba(255, 255, 255, 0.15);
	padding: 3rem;
	border-radius: var(--radius-lg);
	position: relative;
	overflow: hidden;
	color: white;
	text-align: center;
	box-shadow: var(--shadow-lg);
}

.banner-glow {
	position: absolute;
	top: -50%; left: -50%; width: 200%; height: 200%;
	background: radial-gradient(circle at center, var(--color-purple) 0%, transparent 60%);
	opacity: 0.15;
	pointer-events: none;
}

.banner-inner {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.coming-soon-banner h2 {
	font-size: 2.2rem;
	font-weight: 900;
	color: white !important;
	background: linear-gradient(to right, white, #a855f7);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin: 0;
}

.coming-soon-banner p {
	font-size: 1.2rem;
	color: rgba(255, 255, 255, 0.7);
	margin: 0 auto;
	max-width: 700px;
}

.dlc-badge {
	font-size: 0.85rem;
	font-weight: 800;
	background: rgba(234, 179, 8, 0.2);
	color: var(--color-orange);
	border: 1.5px dashed var(--color-orange);
	padding: 0.5rem 1.25rem;
	border-radius: var(--radius-md);
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-top: 1rem;
}

.pulse-dot {
	width: 12px;
	height: 12px;
	background: var(--color-red);
	border-radius: var(--radius-full);
	box-shadow: 0 0 10px var(--color-red);
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0%, 100% { transform: scale(1); opacity: 0.5; }
	50% { transform: scale(1.3); opacity: 1; }
}

/* CABINETS GRID */
.cabinets-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	gap: 3rem;
}

.cabinet-card {
	background: #1e293b;
	border: 3px solid var(--color-border);
	padding: 1.5rem;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	display: flex;
	flex-direction: column;
	transition: var(--transition-normal);
	position: relative;
	overflow: hidden;
}

.cabinet-card:hover {
	transform: translateY(-8px);
	border-color: var(--cabinet-accent);
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

/* RETRO CABINET TOP SCREEN */
.cabinet-top {
	background: #0f172a;
	border-radius: var(--radius-md);
	border: 4px solid #334155;
	height: 220px;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.cabinet-marquee {
	position: absolute;
	top: 0; left: 0; right: 0;
	background: var(--cabinet-accent);
	color: white;
	font-size: 0.7rem;
	font-weight: 900;
	text-align: center;
	padding: 0.2rem 0;
	letter-spacing: 0.35em;
	box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.screen-glare {
	position: absolute;
	top: -50%; left: -50%; width: 200%; height: 200%;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
	pointer-events: none;
	z-index: 2;
}

.screen-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	z-index: 1;
	padding: 2rem 1.5rem 1rem;
	text-align: center;
}

.lock-icon {
	font-size: 2.2rem;
	filter: drop-shadow(0 0 8px rgba(0,0,0,0.5));
}

.screen-content h3 {
	font-size: 1.35rem;
	font-weight: 800;
	color: white !important;
	margin: 0;
}

/* RETRO CABINET CONTROLS */
.cabinet-controls {
	background: #334155;
	height: 60px;
	border-radius: var(--radius-sm);
	margin: 1rem 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 2rem;
	border-bottom: 5px solid #1e293b;
	position: relative;
}

.joystick-wrapper {
	position: relative;
	width: 30px; height: 30px;
}

.joystick-base {
	width: 24px; height: 8px;
	background: #1e293b;
	border-radius: var(--radius-full);
	position: absolute;
	bottom: 0; left: 3px;
}

.joystick-shaft {
	width: 4px; height: 18px;
	background: #94a3b8;
	position: absolute;
	bottom: 4px; left: 13px;
}

.joystick-knob {
	width: 14px; height: 14px;
	background: var(--color-red);
	border-radius: var(--radius-full);
	position: absolute;
	top: 0; left: 8px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
}

.action-buttons span {
	width: 12px; height: 12px;
	border-radius: var(--radius-full);
	border-bottom: 2px solid rgba(0,0,0,0.3);
}

.btn-red { background: var(--color-red); }
.btn-yellow { background: var(--color-orange); }

/* RETRO CABINET INFO */
.cabinet-info {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	flex-grow: 1;
	justify-content: space-between;
}

.cabinet-info .desc {
	font-size: 0.95rem;
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.5;
	margin: 0;
	font-weight: 500;
}

.lock-message {
	font-size: 0.8rem;
	font-weight: 800;
	color: var(--cabinet-accent);
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.08);
	padding: 0.5rem;
	border-radius: var(--radius-sm);
	text-align: center;
	text-transform: uppercase;
	letter-spacing: 0.03em;
}
</style>
