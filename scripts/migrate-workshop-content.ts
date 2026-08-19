// Moves Workshop content banks out of the codebase and into
// course_worlds.workshop_modules — the same move migrate-training-content.ts
// already made for Training. See the /learn + /admin audit (ARQ-02).
//
// Scope, deliberately narrow: only the parts of each Workshop that are pure
// content (slide banks, guild/character rosters, GFR cards) move here. The
// live-multiplayer state machines, phase logic, and scoring in each
// World*Workshop.svelte stay exactly as they are — those are game code, not
// content, and rewriting them was never the goal.
//
// World 1 gets guilds / characters / preferences (small inline arrays).
// World 2 gets its GFR classification cards (from gfrCards.ts workshopCards
// — note this is the *workshop* card set, distinct from the trainingCards
// already migrated into training_modules).
// Worlds 4–7 get their slide banks (world{N}WorkshopSlides), which already
// dispatch through generic template components by a `type` field — the
// cleanest, lowest-risk content to move.
// World 3 has no comparable content bank (it's a live brainstorm/voting
// tool with no pre-authored slide data) and is intentionally left out.
//
// Usage:
//   npx tsx scripts/migrate-workshop-content.ts
//
// Same DATABASE_URL convention as migrate-training-content.ts — point it at
// the Supabase Postgres connection string to apply this to production.

import pg from 'pg';

import { workshopCards } from '../src/lib/content/gfrCards';
import { world4WorkshopSlides } from '../src/lib/content/world4WorkshopData';
import { world5WorkshopSlides } from '../src/lib/content/world5WorkshopData';
import { world6WorkshopSlides } from '../src/lib/content/world6WorkshopData';
import { world7WorkshopSlides } from '../src/lib/content/world7WorkshopData';

const { Pool } = pg;

const rawDbUrl = process.env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev';
const isLocal = rawDbUrl.includes('localhost') || rawDbUrl.includes('127.0.0.1');

const pool = new Pool({
	connectionString: rawDbUrl,
	ssl: isLocal ? undefined : { rejectUnauthorized: false }
});

// World 1's RPG-builder rosters — currently inline literals in
// World1Workshop.svelte (guilds/charProfiles/preferences).
const world1Guilds = [
	{ id: 'gary', name: 'Gary Gygax', motive: 'Identidad / Inmersión', desc: 'Reconocido por D&D y ser el padre de los juegos de rol. Explora historias ricas e inmersión épica.', banner: '/learn_resources/banners/guild_gary_gigax_identity.png' },
	{ id: 'uwe', name: 'Uwe Rosenberg', motive: 'Eficiencia / Placer (Hedonismo)', desc: 'Reconocido por juegos de mesa de motor económico, buenas gráficas y sistemas de optimización profunda.', banner: '/learn_resources/banners/guild_uwe_efficiency_hedonism.png' },
	{ id: 'sid', name: 'Sid Meier', motive: 'Empoderamiento / Descubrimiento', desc: 'Reconocido por juegos legendarios de exploración, expansión y conquista como Civilization y Pirates.', banner: '/learn_resources/banners/guild_sid_meier_empowerment_discovery.png' },
	{ id: 'will', name: 'Will Wright', motive: 'Maestría / Relacionamiento', desc: 'Reconocido por juegos de simulación social y retos interactivos creativos como Sims y Spores.', banner: '/learn_resources/banners/guild_will_wright_mastery_relatedness.png' }
];

const world1Characters = [
	{ id: 'sensei', title: 'Agente Sensei', driver: 'Maestría 🏆', desc: 'Busca la excelencia total, retos de alta dificultad y perfeccionar metodologías.', icon: '🎓' },
	{ id: 'explorador', title: 'Eco-Explorador', driver: 'Descubrimiento 🗺️', desc: 'Ama investigar, descifrar misterios, caminos libres y experimentar.', icon: '🧭' },
	{ id: 'proposito', title: 'Arquitecto de Propósitos', driver: 'Propósito 🌱', desc: 'Conecta cada aprendizaje con un impacto real, causa ecológica o beneficio humano.', icon: '🌿' },
	{ id: 'curador', title: 'Curador Lúdico', driver: 'Hedonismo ☀️', desc: 'Se enfoca en la estética deslumbrante, diversión directa y emociones vívidas.', icon: '🎨' },
	{ id: 'estratega', title: 'Estratega de Misiones', driver: 'Autonomía / Empoderamiento ⚡', desc: 'Valora la toma de decisiones, proyectos autónomos y libertad de acción.', icon: '⚖️' },
	{ id: 'socio', title: 'Socio de Cofradías', driver: 'Relacionamiento 👥', desc: 'Potencia el aprendizaje cooperativo, gremios sociales y debates colectivos.', icon: '🤝' },
	{ id: 'ingeniero', title: 'Ingeniero de Ciclos', driver: 'Eficiencia ⚙️', desc: 'Busca optimizar tiempos, feedbacks veloces y flujos organizativos ágiles.', icon: '📊' }
];

const world1Preferences = [
	{ id: 'misterio', label: 'Un juego de misterio y suspenso (Descubrimiento)', driver: 'Descubrimiento' },
	{ id: 'roles', label: 'Un juego de roles o identidades secretas (Identidad)', driver: 'Identidad' },
	{ id: 'conquista', label: 'Un juego de conquista y competencia (Empoderamiento)', driver: 'Empoderamiento' },
	{ id: 'coordinacion', label: 'Un juego de coordinación social (Relacionamiento)', driver: 'Relacionamiento' },
	{ id: 'estetico', label: 'Un juego estético y artístico (Hedonismo)', driver: 'Hedonismo' },
	{ id: 'economico', label: 'Un juego económico y administrativo (Eficiencia)', driver: 'Eficiencia' },
	{ id: 'dificil', label: 'Un juego difícil y retador (Maestría)', driver: 'Maestría' }
];

const payloadByWorld: Record<number, any> = {
	1: { guilds: world1Guilds, characters: world1Characters, preferences: world1Preferences },
	2: { cards: workshopCards },
	4: { slides: world4WorkshopSlides },
	5: { slides: world5WorkshopSlides },
	6: { slides: world6WorkshopSlides },
	7: { slides: world7WorkshopSlides }
};

async function migrate() {
	console.log(`🌱 Migrating workshop_modules content → ${isLocal ? 'local Postgres' : 'remote Postgres'} (${rawDbUrl.replace(/:[^:@]*@/, ':***@')})`);

	for (const worldId of Object.keys(payloadByWorld).map(Number)) {
		const payload = payloadByWorld[worldId];
		const itemCount = Object.values(payload).reduce((n: number, arr: any) => n + (Array.isArray(arr) ? arr.length : 0), 0);

		// Merge onto whatever workshop_modules already holds (e.g. World 1's
		// existing "slides" outline) instead of overwriting it — that content
		// wasn't authored by this script and isn't this script's to delete.
		const res = await pool.query(
			`UPDATE public.course_worlds
			 SET workshop_modules = COALESCE(workshop_modules, '{}'::jsonb) || $1::jsonb
			 WHERE id = $2`,
			[JSON.stringify(payload), worldId]
		);

		if (res.rowCount === 0) {
			console.warn(`⚠️  No course_worlds row with id=${worldId} — skipped (${itemCount} items not written).`);
		} else {
			console.log(`✅ World ${worldId}: workshop_modules ← ${Object.keys(payload).join(', ')} (${itemCount} items total)`);
		}
	}

	await pool.end();
	console.log('🏁 Done. World 3 intentionally has no workshop_modules content — it has none to migrate.');
}

migrate().catch((err) => {
	console.error('❌ Migration failed:', err);
	process.exit(1);
});
