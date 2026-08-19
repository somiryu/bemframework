// Moves the Training question banks out of the codebase and into
// course_worlds.training_modules, so they live in the database like the
// wiki and narrative content already do — see the /learn + /admin audit.
//
// The content itself is untouched: this script imports the existing TS
// content modules and writes their exported arrays into the DB verbatim,
// so nothing is retyped or paraphrased. Each World*Training.svelte
// component then reads world.training_modules first, falling back to its
// original static import if the DB field is empty (e.g. on an instance
// this script hasn't been run against yet).
//
// Usage:
//   npx tsx scripts/migrate-training-content.ts
//
// Runs against DATABASE_URL (defaults to the local dev DB). To apply the
// same migration to the production Supabase database, run it again with
// DATABASE_URL pointed at the Supabase Postgres connection string (Project
// Settings → Database → Connection string), e.g.:
//   DATABASE_URL="postgresql://postgres:<password>@<host>:5432/postgres" npx tsx scripts/migrate-training-content.ts

import pg from 'pg';

import { trainingQuestionsPool } from '../src/lib/content/trivia';
import { trainingCards } from '../src/lib/content/gfrCards';
import { interactivityQuestions } from '../src/lib/content/interactivityTrivia';
import { goalsTriviaQuestions } from '../src/lib/content/goalsTrivia';
import { attentionTriviaQuestions } from '../src/lib/content/attentionTrivia';
import { decisionsTriviaQuestions } from '../src/lib/content/decisionsTrivia';
import { world7TriviaQuestions } from '../src/lib/content/world7Trivia';

const { Pool } = pg;

const rawDbUrl = process.env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev';
const isLocal = rawDbUrl.includes('localhost') || rawDbUrl.includes('127.0.0.1');

const pool = new Pool({
	connectionString: rawDbUrl,
	ssl: isLocal ? undefined : { rejectUnauthorized: false }
});

// Mentor framing shown by WorldTraining.svelte before the quiz starts.
// Scoring thresholds and coin multipliers stay in code — those are game
// rules, not content, and the server is what should enforce them (SEC-08).
// maxLifetimeCoins is the cap each world's own instructions text promises the
// player ("acumulando hasta N monedas de por vida en este entrenamiento").
// World 6 promises 15 (5 stars × 3 coins/star); every other world promises 50
// (5 stars × 5 coins/star, rounded up to a flat 50). completeTrainingTrivia
// enforces this same number server-side — see SEC-08 in the /learn audit.
const mentorConfigs: Record<number, {
	title: string;
	mentorName: string;
	mentorAvatar: string;
	tip: string;
	instructions: string[];
	maxLifetimeCoins: number;
}> = {
	1: {
		title: 'Entrenamiento de Reconocimiento BEM',
		mentorName: 'Sara',
		mentorAvatar: '/learn_resources/characters/char_sara_animated.gif',
		tip: '¡Bienvenido de nuevo, Agente en entrenamiento! Los mentores han preparado un desafío riguroso para calibrar tus instintos de diseño motivacional:',
		instructions: [
			'<strong>21 Escenarios Aleatorios:</strong> Responderás un flujo dinámico de casos seleccionados al azar (3 por cada uno de los 7 drivers).',
			'<strong>Sistema de Karma en Vivo:</strong> Tus aciertos mueven la barra hacia el éxito (azul/verde), pero equivocarte (o aplicar mal un driver) empuja el indicador hacia atrás (rojo).',
			'<strong>Estrellas de Calibración:</strong> Al final, se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!',
			'<strong>Copa Máxima de 50 Monedas:</strong> Puedes entrenar y repetir cuantas veces quieras para calibrar tu karma, acumulando hasta un máximo de 50 monedas de por vida en este módulo.'
		],
		maxLifetimeCoins: 50
	},
	2: {
		title: 'Entrenamiento de Clasificación GFR',
		mentorName: 'Kira',
		mentorAvatar: '/learn_resources/characters/char_kira.png',
		tip: '¡Bienvenido, Agente! Este módulo calibrará tus habilidades para distinguir los componentes del diseño gamificado bajo el modelo GFR (Goal, Feedback, Reward) y la Teoría de la Autodeterminación (RII):',
		instructions: [
			'<strong>10 Casos de Estudio:</strong> Clasificarás 10 tarjetas aleatorias en la cuadrícula de 3x3.',
			'<strong>Reglas de Puntaje:</strong> Obtienes <strong>+2 puntos</strong> por ubicar perfectamente la tarjeta. Si solo aciertas en un eje (ya sea la columna GFR o la fila de regulación RII), recibes <strong>+1 punto</strong>.',
			'<strong>Calibración de Estrellas:</strong> Dependiendo de tus aciertos, ganarás hasta 5 estrellas de calibración. Cada estrella te otorga <strong>+5 BEM Coins</strong>.',
			'<strong>Copa Máxima de 50 Monedas:</strong> Puedes practicar cuantas veces lo necesites para dominar el modelo, acumulando hasta un total de 50 monedas en este entrenamiento.'
		],
		maxLifetimeCoins: 50
	},
	3: {
		title: 'Relojería de la Interactividad',
		mentorName: 'John Wilkins',
		mentorAvatar: '/learn_resources/characters/char_wilkins_animated.gif',
		tip: 'Para construir un aprendizaje lúdico y fluido, la meta, la acción del estudiante y el feedback de retorno deben encajar con la precisión de un cronógrafo. Calibremos tu exactitud con 10 escenarios reales de clase:',
		instructions: [
			'<strong>Clasifica el tamaño del ciclo:</strong> Determina si el bucle es <strong>Corto</strong> (segundos a minutos), <strong>Medio</strong> (1-3 días), o <strong>Largo</strong> (1 semana o más).',
			'<strong>Puntuación Neta:</strong> Cada acierto suma <strong>+1 punto</strong> y cada fallo resta <strong>-1 punto</strong>.',
			'<strong>Monedas BEM:</strong> Desbloquea hasta 5 estrellas de precisión. ¡Cada estrella otorga <strong>+5 BEM Coins</strong>!'
		],
		maxLifetimeCoins: 50
	},
	4: {
		title: 'Arquitectura de Metas y Expectativas',
		mentorName: 'Kira Yamada',
		mentorAvatar: '/learn_resources/characters/char_kira.png',
		tip: 'Bienvenido de nuevo, Agente. Kira ha diseñado una simulación con 21 escenarios para evaluar cómo calibras la matriz de expectativas y estructuras las metas principales y secundarias:',
		instructions: [
			'<strong>21 Preguntas de Calibración:</strong> Resolverás los 3 bloques temáticos de 7 preguntas cada uno.',
			'<strong>Criterio de Estrellas:</strong> Se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas.',
			'<strong>Tabla de Conversión:</strong> 18+ netos = 5 estrellas, 12+ netos = 4 estrellas, 6+ netos = 3 estrellas, 1+ netos = 2 estrellas, -5+ netos = 1 estrella.',
			'<strong>Monedas BEM:</strong> Cada estrella obtenida te otorga <strong>+5 BEM Coins</strong>, acumulando hasta un máximo de 50 de por vida en este entrenamiento.'
		],
		maxLifetimeCoins: 50
	},
	5: {
		title: 'Llamados a la Acción y Capturadores de Atención',
		mentorName: 'Sara Arbeláez',
		mentorAvatar: '/learn_resources/characters/char_sara_animated.gif',
		tip: 'Bienvenido, Agente. Sara ha diseñado una simulación con 21 escenarios de la vida real para calibrar tus instintos sobre cómo capturar la atención de tus estudiantes mediante llamados conductuales correctos:',
		instructions: [
			'<strong>3 Bloques de Atención (21 preguntas):</strong> Evaluarás casos sobre Hábitos (Bloque A), Timing y Ritmo (Bloque B) e Impacto Emocional y Ansiedad (Bloque C).',
			'<strong>Calibración de Calidad:</strong> El sistema calculará tu puntuación neta (Aciertos menos Errores) para determinar tus estrellas de calibración.',
			'<strong>Conversión de Estrellas:</strong> 18+ netos = 5 estrellas, 12+ netos = 4 estrellas, 6+ netos = 3 estrellas, 1+ netos = 2 estrellas, -5+ netos = 1 estrella.',
			'<strong>Monedas BEM:</strong> Obtén hasta 5 estrellas. Cada una te otorga <strong>+5 BEM Coins</strong> (máximo 50 de por vida en este entrenamiento).'
		],
		maxLifetimeCoins: 50
	},
	6: {
		title: 'Entrenamiento de Decisiones e Incertidumbre',
		mentorName: 'Sara Arbeláez',
		mentorAvatar: '/learn_resources/characters/char_sara.png',
		tip: '¡Bienvenido, Agente! Este módulo calibrará tus habilidades para distinguir sesgos cognitivos, heurísticas conductuales y estrategias lúdicas de decisión:',
		instructions: [
			'<strong>15 Preguntas de Calibración:</strong> Resolverás un flujo dinámico de casos (5 por bloque: Economía Conductual, Decisiones en Juegos y Autonomía en Educación).',
			'<strong>Criterio de Estrellas:</strong> Se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas.',
			'<strong>Tabla de Conversión:</strong> 14+ netos = 5 estrellas, 11+ netos = 4 estrellas, 8+ netos = 3 estrellas, 4+ netos = 2 estrellas, 1+ netos = 1 estrella.',
			'<strong>Monedas BEM:</strong> Cada estrella te otorga <strong>+3 BEM Coins</strong> (acumulando hasta 15 monedas máximo de por vida en este entrenamiento).'
		],
		maxLifetimeCoins: 15
	},
	7: {
		title: 'Entrenamiento de Sistemas de Evaluación',
		mentorName: 'Emma Wagner',
		mentorAvatar: '/learn_resources/characters/char_kira.png',
		tip: '¡Bienvenido, Agente! Emma Wagner te desafía a identificar sistemas de evaluación, tipos de disparador y detectar incentivos perversos en 21 escenarios de gamificación educativa:',
		instructions: [
			'<strong>21 Preguntas de Calibración:</strong> Resolverás 3 bloques de 7 preguntas cada uno.',
			'<strong>Sistema de Puntuación:</strong> Se evaluará tu desempeño neto (Aciertos menos Errores) en una escala de 5 estrellas.',
			'<strong>Tabla de Conversión:</strong> 18+ netos = 5 estrellas, 12+ netos = 4 estrellas, 6+ netos = 3 estrellas, 1+ netos = 2 estrellas, -5+ netos = 1 estrella.',
			'<strong>Monedas BEM:</strong> Cada estrella te otorga <strong>+5 BEM Coins</strong> (acumulando hasta 50 de por vida en este entrenamiento).'
		],
		maxLifetimeCoins: 50
	}
};

const questionsByWorld: Record<number, any[]> = {
	1: trainingQuestionsPool,
	2: trainingCards,
	3: interactivityQuestions,
	4: goalsTriviaQuestions,
	5: attentionTriviaQuestions,
	6: decisionsTriviaQuestions,
	7: world7TriviaQuestions
};

async function migrate() {
	console.log(`🌱 Migrating training_modules content → ${isLocal ? 'local Postgres' : 'remote Postgres'} (${rawDbUrl.replace(/:[^:@]*@/, ':***@')})`);

	for (const worldId of Object.keys(mentorConfigs).map(Number)) {
		const payload = {
			mentor: mentorConfigs[worldId],
			questions: questionsByWorld[worldId]
		};

		const res = await pool.query(
			`UPDATE public.course_worlds SET training_modules = $1::jsonb WHERE id = $2`,
			[JSON.stringify(payload), worldId]
		);

		if (res.rowCount === 0) {
			console.warn(`⚠️  No course_worlds row with id=${worldId} — skipped (${payload.questions.length} questions not written).`);
		} else {
			console.log(`✅ World ${worldId}: training_modules ← ${payload.questions.length} items + mentor config`);
		}
	}

	await pool.end();
	console.log('🏁 Done.');
}

migrate().catch((err) => {
	console.error('❌ Migration failed:', err);
	process.exit(1);
});
