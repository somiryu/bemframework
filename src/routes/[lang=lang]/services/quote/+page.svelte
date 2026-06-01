<script lang="ts">
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { gameActions } from '$lib/gameStore';
	import { cardsData } from '$lib/content/cards';
	import { fade, slide } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	const lang = $derived(data.lang as 'en' | 'es');

	// Form State Wizard
	let step = $state(1);
	let audience = $state('');
	let friction = $state('');
	let format = $state('');
	let clientName = $state('');
	let clientEmail = $state('');
	let details = $state('');

	// Submission state
	let submitted = $state(false);
	let rolledCard = $state<any>(null);

	// Localized resources
	const t = $derived({
		en: {
			title: 'Interactive BEM Quote Estimator | Behavior Design Services',
			desc: 'Select your target audience, platform format, and business friction to generate a custom gamification design estimate instantly.',
			header: 'BEM Scope Configurator',
			sub: 'Build your custom behavior design scope interactively and receive a professional assessment.',
			prev: 'Back',
			next: 'Next',
			finish: 'Generate Estimate & Request Proposal',
			step1: 'Step 1: Who is your target audience?',
			step2: 'Step 2: What is your primary engagement friction?',
			step3: 'Step 3: What is your digital or physical format?',
			step4: 'Step 4: Who should Javier deliver this assessment to?',
			successTitle: '🎉 SCOPE GENERATED SUCCESSFULLY!',
			successSub: 'A professional BEM structural proposal has been compiled.',
			successXp: 'You gained +150 XP for completing the engagement configurator!',
			cardsTip: 'You have triggered a Legendary Card roll!',
			recTitle: 'Systemic BEM Recommendations:',
			estCost: 'Estimated Strategy Investment:',
			estWeeks: 'Estimated Delivery Timeline:',
			weeks: 'weeks',
			recommendedPlan: 'Recommended Plan for Your Scope',
			phase1: 'Phase 1: Diagnostics',
			phase2: 'Phase 2: Experiment Design',
			phase3: 'Phase 3: Prototyping & Review*',
			phaseNote: '* This only includes the design and analysis, but not costs of implementation.',
			strategyNote: 'You decide when we can change phases!',
			audiences: [
				{ id: 'leader', label: 'Product Leaders & Managers', desc: 'Seeking massive retention growth and strategic LTV.' },
				{ id: 'designer', label: 'UX/UI Designers', desc: 'Seeking advanced decision architecture and spatial flow.' },
				{ id: 'educator', label: 'L&D & Coaches', desc: 'Seeking play-based scaffolding, core loops, and KLI metrics.' },
				{ id: 'marketer', label: 'Growth Marketers', desc: 'Seeking community dynamics and loyalty ecosystems.' }
			],
			frictions: [
				{ id: 'onboarding', label: 'User Onboarding Dropoff', desc: 'Users leave immediately after signing up.' },
				{ id: 'retention', label: 'Long-term Retention Churn', desc: 'Users vanish after 7-30 days.' },
				{ id: 'learning', label: 'Dull Educational Experience', desc: 'Low completion rates and rapid memory decay.' },
				{ id: 'burnout', label: 'Extrinsic Reward Fatigue', desc: 'Users suffer burnout from boring Skinner-box points.' }
			],
			formats: [
				{ id: 'mobile', label: 'Mobile App', desc: 'Native iOS or Android engagement.' },
				{ id: 'web', label: 'Web Portal / Platform', desc: 'SaaS dashboards, e-commerce, or interactive sites.' },
				{ id: 'academy', label: 'Online Academy / Course', desc: 'LMS systems, video portals, or coaching ecosystems.' },
				{ id: 'offline', label: 'Hybrid or Workspace', desc: 'Corporate coaching, HR training, or physical setups.' }
			]
		},
		es: {
			title: 'Estimador Interactivo de Cotización BEM | Servicios de Gamificación',
			desc: 'Selecciona tu audiencia, formato de plataforma y fricción conductual para generar un presupuesto personalizado de diseño BEM al instante.',
			header: 'Configurador de Alcance BEM',
			sub: 'Crea tu propuesta de diseño conductual de forma interactiva y recibe una evaluación profesional instantánea.',
			prev: 'Atrás',
			next: 'Siguiente',
			finish: 'Generar Estimación y Solicitar Propuesta',
			step1: 'Paso 1: ¿A quién va dirigida tu experiencia?',
			step2: 'Paso 2: ¿Cuál es tu principal fricción de engagement?',
			step3: 'Paso 3: ¿Cuál es tu formato de plataforma?',
			step4: 'Paso 4: ¿A quién debe Javier entregar este diagnóstico?',
			successTitle: '🎉 ¡PROPUESTA GENERADA EXITOSAMENTE!',
			successSub: 'Se ha compilado un diagnóstico de alcance estructural BEM.',
			successXp: '¡Ganaste +150 XP por configurar tu alcance de servicios BEM!',
			cardsTip: '¡Has activado un tiro de Carta Legendaria BEM!',
			recTitle: 'Recomendaciones Sistémicas BEM:',
			estCost: 'Inversión de Estrategia Estimada:',
			estWeeks: 'Tiempo Estimado de Entrega:',
			weeks: 'semanas',
			recommendedPlan: 'Plan Recomendado para tu Alcance',
			phase1: 'Fase 1: Diagnóstico',
			phase2: 'Fase 2: Diseño de Experimentos',
			phase3: 'Fase 3: Prototipado y Revisión*',
			phaseNote: '* Esto solo incluye el diseño y análisis, no los costos de implementación.',
			strategyNote: '¡Tú decides cuándo cambiamos de fase!',
			audiences: [
				{ id: 'leader', label: 'Líderes de Producto', desc: 'Buscan escalar la retención y el valor de vida del usuario (LTV).' },
				{ id: 'designer', label: 'Diseñadores UX/UI', desc: 'Buscan dominar la arquitectura de decisiones y flujos.' },
				{ id: 'educator', label: 'Especialistas L&D y Mentores', desc: 'Buscan andamiaje lúdico, loops de aprendizaje y métricas KLI.' },
				{ id: 'marketer', label: 'Growth Marketers', desc: 'Buscan comunidades y ecosistemas de lealtad.' }
			],
			frictions: [
				{ id: 'onboarding', label: 'Abandono en el Onboarding', desc: 'Los usuarios se van inmediatamente tras registrarse.' },
				{ id: 'retention', label: 'Pérdida de Retención a Largo Plazo', desc: 'Los usuarios desaparecen tras 7 o 30 días.' },
				{ id: 'learning', label: 'Cursos Aburridos y Pasivos', desc: 'Bajas tasas de finalización y nula retención de conocimientos.' },
				{ id: 'burnout', label: 'Agotamiento por Recompensas', desc: 'Fatiga de usuarios cansados de puntos y medallas cosméticas.' }
			],
			formats: [
				{ id: 'mobile', label: 'Aplicación Móvil', desc: 'Interacciones nativas para iOS o Android.' },
				{ id: 'web', label: 'Portal Web / Plataforma', desc: 'Ecosistemas SaaS, portales o landing pages complejas.' },
				{ id: 'academy', label: 'Academia / Curso Online', desc: 'Sistemas LMS, portales de video o mentorías híbridas.' },
				{ id: 'offline', label: 'Ecosistema Híbrido / Oficina', desc: 'Dinámicas de equipo, recursos humanos o espacios físicos.' }
			]
		}
	}[lang]);

	// Recommended tier calculation based on selected inputs
	const recommendedTier = $derived.by(() => {
		if (friction === 'burnout' || format === 'offline' || audience === 'leader') {
			return 'high';
		} else if (friction === 'retention' || format === 'mobile') {
			return 'mid';
		}
		return 'low';
	});

	// Dynamic Recommendations & Weeks
	const dynamicRecommendations = $derived.by(() => {
		let recommendations: string[] = [];
		let weeks = 4;

		if (audience === 'leader') {
			weeks += 2;
			recommendations.push(lang === 'es' ? 'Diseño de Indicadores de Intención Conductual (KBIs)' : 'Behavioral Intent Indicators Mapping (KBIs)');
		} else if (audience === 'educator') {
			weeks += 1;
			recommendations.push(lang === 'es' ? 'Andamiaje Pedagógico Avanzado y Métricas de Aprendizaje (KLIs)' : 'Pedagogical Scaffolding & Key Learning Indicators (KLIs)');
		}

		if (friction === 'onboarding') {
			recommendations.push(lang === 'es' ? 'Bucles Lúdicos Rápidos y Onboarding de Placer Hedonista' : 'Playful Core Loops & Hedonistic Aesthetic Onboarding');
		} else if (friction === 'burnout') {
			weeks += 1;
			recommendations.push(lang === 'es' ? 'Desmantelamiento de Skinner-Box y Diseño de Autonomía Intrínseca' : 'Skinner-Box Disassembly & Autonomy-Driven Architecture');
		}

		if (format === 'mobile') {
			weeks += 2;
			recommendations.push(lang === 'es' ? 'Optimización de Señales de Feedback y Notificaciones Discriminatorias' : 'Immediate Discriminatory Feedback Signal Calibration');
		} else if (format === 'offline') {
			weeks += 3;
			recommendations.push(lang === 'es' ? 'Diseño de Dinámicas de Grupo y Cooperación Social en Entornos Físicos' : 'Social Connection & Cooperative Group Dynamics Design');
		}

		if (recommendations.length === 0) {
			recommendations.push(lang === 'es' ? 'Mapeo de Arquitectura de Decisiones Sistémica BEM' : 'Systemic BEM Decision Architecture Design');
		}

		return { weeks, recommendations };
	});

	const nextStep = () => {
		if (step === 1 && !audience) return;
		if (step === 2 && !friction) return;
		if (step === 3 && !format) return;
		step += 1;
	};

	const prevStep = () => {
		step -= 1;
	};

	const handleFormSubmit = async (e: Event) => {
		e.preventDefault();
		if (!clientName.trim() || !clientEmail.trim()) return;

		submitted = true;

		// 1. Submit lead details (Logged for analysis)
		console.log('Submitting BEM calibrated proposal scope to database...', {
			client_name: clientName,
			client_email: clientEmail,
			audience,
			friction,
			format,
			recommended_tier: recommendedTier,
			details
		});

		// 2. Award +150 XP
		gameActions.addXP(150, `quote_generated_${Date.now()}`);

		// 3. Roll Legendary booster pack!
		const pool = cardsData[lang]?.filter((c) => c.rarity === 'Legendary') || [];
		if (pool.length > 0) {
			const rolled = pool[Math.floor(Math.random() * pool.length)];
			gameActions.unlockCard(rolled.id, rolled.title);
			rolledCard = rolled;
		}
	};
</script>

<SEO title={t.title} description={t.desc} {lang} />

<HeroSection title={t.header} description={t.sub} />

<section class="section quote-builder">
	<div class="container container-narrow">
		{#if !submitted}
			<!-- STEP PROGRESS BAR -->
			<div class="step-indicator-wrapper">
				<div class="indicator-bar">
					<div class="indicator-fill" style="width: {((step - 1) / 3) * 100}%"></div>
				</div>
				<div class="step-nums">
					<span class:active={step >= 1}>1</span>
					<span class:active={step >= 2}>2</span>
					<span class:active={step >= 3}>3</span>
					<span class:active={step >= 4}>4</span>
				</div>
			</div>

			<!-- WIZARD INTERFACE -->
			<div class="wizard-panel">
				{#if step === 1}
					<div class="wizard-step" in:fade>
						<h3>{t.step1}</h3>
						<div class="options-grid">
							{#each t.audiences as item}
								<button
									class="selector-card"
									class:selected={audience === item.id}
									onclick={() => audience = item.id}
								>
									<div class="radio-dot"></div>
									<div class="selector-content">
										<strong>{item.label}</strong>
										<p>{item.desc}</p>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{:else if step === 2}
					<div class="wizard-step" in:fade>
						<h3>{t.step2}</h3>
						<div class="options-grid">
							{#each t.frictions as item}
								<button
									class="selector-card"
									class:selected={friction === item.id}
									onclick={() => friction = item.id}
								>
									<div class="radio-dot"></div>
									<div class="selector-content">
										<strong>{item.label}</strong>
										<p>{item.desc}</p>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{:else if step === 3}
					<div class="wizard-step" in:fade>
						<h3>{t.step3}</h3>
						<div class="options-grid">
							{#each t.formats as item}
								<button
									class="selector-card"
									class:selected={format === item.id}
									onclick={() => format = item.id}
								>
									<div class="radio-dot"></div>
									<div class="selector-content">
										<strong>{item.label}</strong>
										<p>{item.desc}</p>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{:else if step === 4}
					<form onsubmit={handleFormSubmit} class="wizard-step form-step" in:fade>
						<h3>{t.step4}</h3>
						
						<div class="form-inputs">
							<div class="input-group">
								<label for="name">{lang === 'es' ? 'Nombre Completo' : 'Full Name'}</label>
								<input type="text" id="name" required bind:value={clientName} placeholder="Jane Doe" />
							</div>

							<div class="input-group">
								<label for="email">{lang === 'es' ? 'Email Corporativo' : 'Work Email'}</label>
								<input type="email" id="email" required bind:value={clientEmail} placeholder="jane@company.com" />
							</div>

							<div class="input-group">
								<label for="notes">{lang === 'es' ? 'Detalles de Contexto (Opcional)' : 'Additional Context (Optional)'}</label>
								<textarea id="notes" bind:value={details} rows="4" placeholder={lang === 'es' ? 'Describe brevemente tu plataforma o reto...' : 'Briefly describe your product challenges...'}></textarea>
							</div>
						</div>

						<button type="submit" class="submit-estimate-btn">{t.finish}</button>
					</form>
				{/if}

				<!-- WIZARD ACTIONS -->
				{#if step < 4}
					<div class="wizard-actions">
						{#if step > 1}
							<button class="nav-btn prev-btn" onclick={prevStep}>{t.prev}</button>
						{:else}
							<div></div>
						{/if}
						
						<button 
							class="nav-btn next-btn" 
							onclick={nextStep} 
							disabled={
								(step === 1 && !audience) ||
								(step === 2 && !friction) ||
								(step === 3 && !format)
							}
						>
							{t.next}
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- SUBMISSION SUCCESS DISPLAY -->
			<div class="success-panel" in:fade>
				<div class="success-glow"></div>
				<div class="success-header">
					<span class="success-badge">✓ SUCCESS</span>
					<h2>{t.successTitle}</h2>
					<p class="success-desc">{t.successSub}</p>
					<span class="xp-badge">+{t.successXp}</span>
				</div>

				<div class="success-body">
					<!-- ESTIMATIONS ROADMAP COMPARATIVE DECK -->
					<div class="comparative-deck">
						<!-- LOW BUDGET -->
						<div class="budget-card" class:recommended={recommendedTier === 'low'}>
							{#if recommendedTier === 'low'}
								<span class="rec-badge">{t.recommendedPlan}</span>
							{/if}
							<h3>{lang === 'es' ? 'Plan Inicial' : 'Low Strategy'}</h3>
							<div class="price-tag">$2,000 <span class="usd">USD</span></div>
							
							<div class="breakdown">
								<div class="row"><span>{t.phase1}</span><strong>$400</strong></div>
								<div class="row"><span>{t.phase2}</span><strong>$1,000</strong></div>
								<div class="row"><span>{t.phase3}</span><strong>$600</strong></div>
							</div>
						</div>

						<!-- MID BUDGET -->
						<div class="budget-card" class:recommended={recommendedTier === 'mid'}>
							{#if recommendedTier === 'mid'}
								<span class="rec-badge">{t.recommendedPlan}</span>
							{/if}
							<h3>{lang === 'es' ? 'Plan Estratégico' : 'Mid Strategy'}</h3>
							<div class="price-tag">$2,900 <span class="usd">USD</span></div>
							
							<div class="breakdown">
								<div class="row"><span>{t.phase1}</span><strong>$600</strong></div>
								<div class="row"><span>{t.phase2}</span><strong>$1,500</strong></div>
								<div class="row"><span>{t.phase3}</span><strong>$800</strong></div>
							</div>
						</div>

						<!-- HIGH BUDGET -->
						<div class="budget-card" class:recommended={recommendedTier === 'high'}>
							{#if recommendedTier === 'high'}
								<span class="rec-badge">{t.recommendedPlan}</span>
							{/if}
							<h3>{lang === 'es' ? 'Plan Premium' : 'High Strategy'}</h3>
							<div class="price-tag">$4,800 <span class="usd">USD</span></div>
							
							<div class="breakdown">
								<div class="row"><span>{t.phase1}</span><strong>$800</strong></div>
								<div class="row"><span>{t.phase2}</span><strong>$3,000</strong></div>
								<div class="row"><span>{t.phase3}</span><strong>$1,000</strong></div>
							</div>
						</div>
					</div>

					<p class="phase-disclaimer">{t.phaseNote}</p>
					<p class="strategy-disclaimer">⚡ {t.strategyNote}</p>

					<!-- RECOMMENDATIONS & WEEKS -->
					<div class="details-section-grid">
						<div class="est-card">
							<span>{t.estWeeks}</span>
							<strong>{dynamicRecommendations.weeks} {t.weeks}</strong>
						</div>
						
						<div class="recommendations-box">
							<h4>{t.recTitle}</h4>
							<ul>
								{#each dynamicRecommendations.recommendations as rec}
									<li in:slide>{rec}</li>
								{/each}
							</ul>
						</div>
					</div>

					<!-- LEGENDARY CARD ROLL -->
					{#if rolledCard}
						<div class="legendary-card-reveal-box">
							<span class="roll-banner">💎 {t.cardsTip}</span>
							<div class="card-inner rarity-legendary">
								<div class="rarity-badge">Legendary</div>
								<div class="card-header">
									<span class="type-label">{rolledCard.type}</span>
									<h3>{rolledCard.title}</h3>
								</div>
								<div class="card-body">
									<p>{rolledCard.description}</p>
								</div>
							</div>
						</div>
					{/if}

					<a href={`/${lang}`} class="return-home-btn">{lang === 'es' ? 'Volver al Inicio' : 'Return to Home'}</a>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
.quote-builder {
	background: var(--color-bg);
	padding-top: var(--space-md);
}

.step-indicator-wrapper {
	position: relative;
	margin-bottom: 3rem;
}

.indicator-bar {
	position: absolute;
	top: 50%; left: 0; right: 0;
	height: 4px;
	background: var(--color-border);
	transform: translateY(-50%);
	z-index: 1;
}

.indicator-fill {
	height: 100%;
	background: var(--color-purple);
	transition: width 0.4s ease;
}

.step-nums {
	display: flex;
	justify-content: space-between;
	position: relative;
	z-index: 2;
}

.step-nums span {
	width: 36px;
	height: 36px;
	border-radius: var(--radius-full);
	background: white;
	border: 3px solid var(--color-border);
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 800;
	font-size: 0.9rem;
	color: var(--color-text-muted);
	transition: all 0.3s ease;
}

.step-nums span.active {
	border-color: var(--color-purple);
	color: var(--color-purple);
	box-shadow: 0 0 10px rgba(124, 58, 237, 0.2);
}

/* WIZARD PANEL */
.wizard-panel {
	background: white;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	padding: 3rem;
}

@media (max-width: 600px) {
	.wizard-panel {
		padding: 1.5rem;
	}
}

.wizard-step h3 {
	font-size: 1.6rem;
	font-weight: 800;
	margin: 0 0 2rem;
	text-align: center;
}

.options-grid {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.selector-card {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	width: 100%;
	padding: 1.5rem;
	border: 2px solid var(--color-border);
	background: white;
	border-radius: var(--radius-md);
	text-align: left;
	cursor: pointer;
	transition: var(--transition-fast);
}

.selector-card:hover {
	border-color: var(--color-purple);
	background: var(--color-bg-alt);
}

.selector-card.selected {
	border-color: var(--color-purple);
	background: rgba(124, 58, 237, 0.03);
}

.radio-dot {
	width: 20px;
	height: 20px;
	border-radius: var(--radius-full);
	border: 2px solid var(--color-border);
	position: relative;
	flex-shrink: 0;
}

.selector-card.selected .radio-dot {
	border-color: var(--color-purple);
}

.selector-card.selected .radio-dot::after {
	content: '';
	position: absolute;
	top: 50%; left: 50%;
	transform: translate(-50%, -50%);
	width: 10px;
	height: 10px;
	border-radius: var(--radius-full);
	background: var(--color-purple);
}

.selector-content strong {
	display: block;
	font-size: 1.1rem;
	font-weight: 800;
	color: var(--color-text);
	margin-bottom: 0.25rem;
}

.selector-content p {
	margin: 0;
	font-size: 0.9rem;
	color: var(--color-text-muted);
	font-weight: 500;
}

/* WIZARD ACTIONS */
.wizard-actions {
	display: flex;
	justify-content: space-between;
	margin-top: 3rem;
	border-top: 1px solid var(--color-border);
	padding-top: 1.5rem;
}

.nav-btn {
	padding: 0.75rem 1.75rem;
	font-weight: 800;
	border-radius: var(--radius-md);
	cursor: pointer;
	transition: var(--transition-fast);
}

.prev-btn {
	background: transparent;
	border: 2px solid var(--color-border);
	color: var(--color-text-muted);
}

.prev-btn:hover {
	background: var(--color-bg-alt);
}

.next-btn {
	background: var(--color-purple);
	color: white;
	border: none;
}

.next-btn:hover:not(:disabled) {
	filter: brightness(1.1);
	transform: translateX(4px);
}

.next-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

/* FORM STEP */
.form-inputs {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-bottom: 2rem;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.input-group label {
	font-weight: 700;
	font-size: 0.9rem;
}

.input-group input, .input-group textarea {
	width: 100%;
	padding: 0.85rem 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-bg-alt);
	font-size: 0.95rem;
	font-weight: 600;
}

.input-group input:focus, .input-group textarea:focus {
	outline: none;
	border-color: var(--color-purple);
	background: white;
}

.submit-estimate-btn {
	width: 100%;
	background: var(--color-purple);
	color: white;
	border: none;
	padding: 1.1rem;
	font-weight: 800;
	font-size: 1.05rem;
	border-radius: var(--radius-md);
	cursor: pointer;
	transition: var(--transition-fast);
}

.submit-estimate-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
}

/* SUCCESS PANEL & DECK */
.success-panel {
	background: white;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	overflow: hidden;
	border: 1px solid var(--color-border);
}

.success-header {
	background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
	padding: 3rem;
	color: white;
	text-align: center;
	position: relative;
}

.success-badge {
	display: inline-block;
	background: var(--color-green);
	color: #064e3b;
	font-weight: 800;
	font-size: 0.75rem;
	padding: 0.35rem 0.75rem;
	border-radius: var(--radius-sm);
	letter-spacing: 0.1em;
	margin-bottom: 1rem;
}

.success-header h2 {
	font-size: 2.2rem;
	font-weight: 900;
	margin: 0 0 0.5rem;
}

.success-desc {
	font-size: 1.1rem;
	opacity: 0.85;
	margin: 0 0 1.5rem;
}

.xp-badge {
	display: inline-block;
	font-weight: 800;
	font-size: 0.9rem;
	color: var(--color-green);
	border: 2px dashed var(--color-green);
	padding: 0.5rem 1rem;
	border-radius: var(--radius-md);
}

.success-body {
	padding: 3rem;
}

@media (max-width: 600px) {
	.success-body {
		padding: 1.5rem;
	}
}

/* COMPARATIVE DECK */
.comparative-deck {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	margin-bottom: 2.5rem;
}

.budget-card {
	background: var(--color-bg-alt);
	border: 2px solid var(--color-border);
	padding: 2.5rem 2rem;
	border-radius: var(--radius-lg);
	display: flex;
	flex-direction: column;
	text-align: center;
	position: relative;
	transition: var(--transition-normal);
}

.budget-card.recommended {
	border-color: var(--color-purple);
	background: white;
	box-shadow: var(--shadow-lg);
	transform: scale(1.03);
}

.rec-badge {
	position: absolute;
	top: -12px; left: 50%;
	transform: translateX(-50%);
	background: var(--color-purple);
	color: white;
	font-size: 0.75rem;
	font-weight: 800;
	padding: 0.35rem 1rem;
	border-radius: var(--radius-full);
	white-space: nowrap;
	letter-spacing: 0.05em;
}

.budget-card h3 {
	font-size: 1.25rem;
	font-weight: 800;
	margin-bottom: 1rem;
	color: var(--color-text);
}

.price-tag {
	font-size: 2.2rem;
	font-weight: 900;
	color: var(--color-purple);
	margin-bottom: 2rem;
}

.price-tag .usd {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-text-muted);
}

.budget-card.recommended .price-tag {
	color: var(--color-green);
}

.breakdown {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
	border-top: 1px solid var(--color-border);
	padding-top: 1.5rem;
}

.breakdown .row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.9rem;
}

.breakdown .row span {
	color: var(--color-text-muted);
	font-weight: 600;
}

.breakdown .row strong {
	color: var(--color-text);
	font-weight: 800;
}

.phase-disclaimer {
	font-size: 0.85rem;
	color: var(--color-text-muted);
	text-align: center;
	margin: 0 0 0.5rem;
	font-weight: 600;
}

.strategy-disclaimer {
	font-size: 0.95rem;
	color: var(--color-orange);
	text-align: center;
	margin-bottom: 3rem;
	font-weight: 800;
}

/* DETAILS SECTION GRID */
.details-section-grid {
	display: grid;
	grid-template-columns: 280px 1fr;
	gap: 2rem;
	margin-bottom: 3rem;
}

@media (max-width: 768px) {
	.details-section-grid {
		grid-template-columns: 1fr;
	}
}

.est-card {
	background: var(--color-bg-alt);
	border: 1px solid var(--color-border);
	padding: 2rem;
	border-radius: var(--radius-lg);
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.5rem;
}

.est-card span {
	font-size: 0.85rem;
	font-weight: 700;
	color: var(--color-text-muted);
	text-transform: uppercase;
}

.est-card strong {
	font-size: 1.8rem;
	font-weight: 900;
	color: var(--color-text);
}

.recommendations-box {
	background: var(--color-bg-alt);
	padding: 2rem;
	border-radius: var(--radius-lg);
	border: 1px solid var(--color-border);
}

.recommendations-box h4 {
	font-size: 1.15rem;
	font-weight: 800;
	margin: 0 0 1rem;
	color: var(--color-text);
}

.recommendations-box ul {
	padding-left: 1.5rem;
	margin: 0;
}

.recommendations-box li {
	margin-bottom: 0.5rem;
	font-weight: 600;
	color: var(--color-text-muted);
}

/* LEGENDARY CARD DISPLAY */
.legendary-card-reveal-box {
	text-align: center;
	margin-bottom: 3rem;
}

.roll-banner {
	display: inline-block;
	font-weight: 800;
	font-size: 0.95rem;
	color: var(--color-orange);
	margin-bottom: 1.5rem;
}

.legendary-card-reveal-box .card-inner {
	max-width: 320px;
	height: 440px;
	margin: 0 auto;
	background: linear-gradient(135deg, #a855f7 0%, #6b21a8 100%);
	border-radius: var(--radius-lg);
	border: 8px solid white;
	box-shadow: var(--shadow-lg);
	padding: 2rem;
	color: white;
	display: flex;
	flex-direction: column;
	text-align: left;
	position: relative;
	overflow: hidden;
}

.legendary-card-reveal-box .rarity-badge {
	position: absolute;
	top: 1rem; right: 1rem;
	background: rgba(0,0,0,0.3);
	font-size: 0.7rem;
	font-weight: 800;
	padding: 0.25rem 0.6rem;
	border-radius: 20px;
}

.legendary-card-reveal-box .type-label {
	font-size: 0.8rem;
	opacity: 0.85;
	color: rgba(255, 255, 255, 0.75) !important;
}

.legendary-card-reveal-box h3 {
	font-size: 1.6rem;
	margin: 0.5rem 0 1.5rem;
	color: white !important;
	text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.legendary-card-reveal-box .card-body {
	background: rgba(0, 0, 0, 0.3) !important;
	border-radius: var(--radius-md);
	padding: 1.5rem;
	color: white !important;
	flex-grow: 1;
	display: flex;
	align-items: center;
	text-align: center;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(4px);
}

.legendary-card-reveal-box .card-body p {
	font-size: 0.95rem;
	margin: 0;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95) !important;
}

.return-home-btn {
	display: block;
	text-align: center;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	padding: 1rem;
	border-radius: var(--radius-md);
	font-weight: 800;
	font-size: 1rem;
	transition: var(--transition-fast);
}

.return-home-btn:hover {
	background: var(--color-purple);
	transform: translateY(-2px);
}
</style>
