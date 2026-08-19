import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const { Client } = pg;

// Get connection URL or defaults
const rawDbUrl = process.env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev';

async function setupDatabase() {
	console.log('🌱 Starting Local PostgreSQL Setup for BEM Platform...');
	console.log(`📡 Target connection: ${rawDbUrl}`);

	// Parse database name from URL
	const urlObj = new URL(rawDbUrl);
	const targetDbName = urlObj.pathname.replace(/^\//, '') || 'bem_dev';
	
	// Create maintenance client (connecting to default 'postgres' database)
	const maintenanceUrl = new URL(rawDbUrl);
	maintenanceUrl.pathname = '/postgres';

	console.log(`🔍 Checking if database "${targetDbName}" exists...`);
	const maintenanceClient = new Client({ connectionString: maintenanceUrl.toString() });

	try {
		await maintenanceClient.connect();
		const checkRes = await maintenanceClient.query(
			`SELECT 1 FROM pg_database WHERE datname = $1`,
			[targetDbName]
		);

		if (checkRes.rowCount === 0) {
			console.log(`⚡ Database "${targetDbName}" does not exist. Creating...`);
			await maintenanceClient.query(`CREATE DATABASE "${targetDbName}"`);
			console.log(`✅ Database "${targetDbName}" created successfully!`);
		} else {
			console.log(`✓ Database "${targetDbName}" already exists.`);
		}
	} catch (err: any) {
		console.warn(`⚠️ Notice during database check: ${err.message}. Proceeding with target DB connection...`);
	} finally {
		await maintenanceClient.end().catch(() => {});
	}

	// Connect to target database
	const dbClient = new Client({ connectionString: rawDbUrl });
	try {
		await dbClient.connect();
		console.log(`🔌 Connected to database "${targetDbName}".`);

		// 1. Apply schema.sql
		const schemaPath = path.join(rootDir, 'db', 'schema.sql');
		console.log(`📄 Executing schema from ${schemaPath}...`);
		const schemaSql = fs.readFileSync(schemaPath, 'utf8');
		await dbClient.query(schemaSql);
		console.log('✅ Schema created successfully!');

		// 2. Apply seed.sql
		const seedPath = path.join(rootDir, 'db', 'seed.sql');
		console.log(`🌱 Executing seed data from ${seedPath}...`);
		const seedSql = fs.readFileSync(seedPath, 'utf8');
		await dbClient.query(seedSql);
		console.log('✅ Seed data inserted successfully!');

		// Verify contents
		const worldsRes = await dbClient.query('SELECT id, order_index, title FROM public.course_worlds ORDER BY order_index ASC');
		const instancesRes = await dbClient.query('SELECT code, unlocked_worlds FROM public.course_instances ORDER BY code ASC');
		const superUserRes = await dbClient.query('SELECT email FROM public.super_user');

		console.log('\n=============================================');
		console.log('🎉 LOCAL POSTGRESQL DATABASE READY!');
		console.log('=============================================');
		console.log(`🌍 Worlds Loaded: ${worldsRes.rowCount}`);
		worldsRes.rows.forEach(w => console.log(`   - M${w.order_index}: ${w.title}`));
		console.log(`🎓 Course Instances: ${instancesRes.rowCount}`);
		instancesRes.rows.forEach(i => console.log(`   - Code: ${i.code} (Unlocked: ${JSON.stringify(i.unlocked_worlds)})`));
		console.log(`👑 Super User: ${superUserRes.rows[0]?.email || 'None'}`);
		console.log('=============================================\n');

	} catch (err: any) {
		console.error('❌ Error during setup:', err);
		process.exit(1);
	} finally {
		await dbClient.end();
	}
}

setupDatabase();
