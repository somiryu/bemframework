import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const { Client } = pg;
const rawDbUrl = process.env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev';

async function seedDatabase() {
	console.log('🌱 Seeding Local PostgreSQL Database for BEM Platform...');
	const dbClient = new Client({ connectionString: rawDbUrl });

	try {
		await dbClient.connect();
		const seedPath = path.join(rootDir, 'db', 'seed.sql');
		console.log(`📄 Executing seed from ${seedPath}...`);
		const seedSql = fs.readFileSync(seedPath, 'utf8');
		await dbClient.query(seedSql);
		console.log('✅ Seed data re-applied successfully!');

		const worldsRes = await dbClient.query('SELECT COUNT(*) as count FROM public.course_worlds');
		const instancesRes = await dbClient.query('SELECT COUNT(*) as count FROM public.course_instances');

		console.log(`🌍 Total Worlds: ${worldsRes.rows[0].count}`);
		console.log(`🎓 Total Course Instances: ${instancesRes.rows[0].count}`);
	} catch (err: any) {
		console.error('❌ Error during seed:', err);
		process.exit(1);
	} finally {
		await dbClient.end();
	}
}

seedDatabase();
