export type UseCaseId =
	| 'product_saas'
	| 'marketing_growth'
	| 'hr_culture'
	| 'education_lnd'
	| 'game_design'
	| 'compare_frameworks'
	| 'audit_existing'
	| 'explore';

export const USE_CASE_IDS: UseCaseId[] = [
	'product_saas',
	'marketing_growth',
	'hr_culture',
	'education_lnd',
	'game_design',
	'compare_frameworks',
	'audit_existing',
	'explore'
];

// Extra instruction appended to the base system prompt, tailoring vocabulary and
// examples to the domain the user picked before their first message. 'explore'
// intentionally adds nothing — it's the no-op / skip option.
export const useCaseInstructions: Record<UseCaseId, { es: string; en: string }> = {
	product_saas: {
		es: 'El usuario trabaja en producto o SaaS. Enfoca tus ejemplos en onboarding, activación, retención y métricas como churn o DAU/MAU, usando vocabulario de producto digital.',
		en: 'The user works in product or SaaS. Frame your examples around onboarding, activation, retention, and metrics like churn or DAU/MAU, using digital product vocabulary.'
	},
	marketing_growth: {
		es: 'El usuario trabaja en marketing o growth. Enfoca tus ejemplos en lealtad de marca, campañas, engagement y métricas como NPS o LTV.',
		en: 'The user works in marketing or growth. Frame your examples around brand loyalty, campaigns, engagement, and metrics like NPS or LTV.'
	},
	hr_culture: {
		es: 'El usuario trabaja en Recursos Humanos o cultura organizacional. Enfoca tus ejemplos en motivación de equipos, reconocimiento, retención de talento y clima laboral.',
		en: 'The user works in HR or organizational culture. Frame your examples around team motivation, recognition programs, talent retention, and workplace culture.'
	},
	education_lnd: {
		es: 'El usuario trabaja en educación o capacitación corporativa (L&D). Enfoca tus ejemplos en diseño de cursos, talleres, retención de conocimiento y finalización de programas.',
		en: 'The user works in education or corporate training (L&D). Frame your examples around course design, workshops, knowledge retention, and program completion.'
	},
	game_design: {
		es: 'El usuario diseña juegos o productos gamificados. Enfoca tus ejemplos en mecánicas, sistemas de progresión, balance y retención de jugadores.',
		en: 'The user designs games or gamified products. Frame your examples around mechanics, progression systems, balance, and player retention.'
	},
	compare_frameworks: {
		es: 'El usuario quiere comparar BEM con otros frameworks de gamificación (Octalysis, PBL, MDA clásico, Self-Determination Theory). Sé claro y justo al contrastar enfoques, y destaca en qué se diferencia BEM.',
		en: 'The user wants to compare BEM with other gamification frameworks (Octalysis, PBL, classic MDA, Self-Determination Theory). Be clear and fair when contrasting approaches, and highlight what makes BEM different.'
	},
	audit_existing: {
		es: 'El usuario ya construyó algo (un producto, curso o sistema) y quiere que lo evalúes según los principios de BEM. Haz preguntas si falta contexto, y señala específicamente qué le falta o qué podría mejorar.',
		en: "The user already built something (a product, course, or system) and wants you to evaluate it against BEM's principles. Ask clarifying questions if context is missing, and point out specifically what's missing or could improve."
	},
	explore: { es: '', en: '' }
};

export function isUseCaseId(value: unknown): value is UseCaseId {
	return typeof value === 'string' && (USE_CASE_IDS as string[]).includes(value);
}
