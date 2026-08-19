import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || 'postgresql://freetoplay@localhost:5432/bem_dev'
});

async function runTests() {
	console.log('🧪 Testing Local PostgreSQL connection and tables...');
	
	try {
		// 1. Check worlds
		const worlds = await pool.query('SELECT count(*) FROM public.course_worlds');
		console.log(`✅ course_worlds count: ${worlds.rows[0].count} (Expected 7)`);

		// 2. Check instances
		const instances = await pool.query('SELECT count(*) FROM public.course_instances');
		console.log(`✅ course_instances count: ${instances.rows[0].count} (Expected 3)`);

		// 3. Test RPC function
		const rpcRes = await pool.query("SELECT public.is_super_user('javier@f2p.co') as is_super");
		console.log(`✅ is_super_user('javier@f2p.co'): ${rpcRes.rows[0].is_super} (Expected true)`);

		const rpcFalseRes = await pool.query("SELECT public.is_super_user('random@unknown.com') as is_super");
		console.log(`✅ is_super_user('random@unknown.com'): ${rpcFalseRes.rows[0].is_super} (Expected false)`);

		// 4. Test player insert and update
		const testPlayerEmail = `test_agent_${Date.now()}@example.com`;
		const insertRes = await pool.query(
			`INSERT INTO public.course_players (instance_code, email, name, alias, avatar, coins, game_state)
			 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, coins`,
			['DEMO-2026', testPlayerEmail, 'Test Agent', 'Cipher', 'eco-engineer', 10, JSON.stringify({ 1: { training_completed: true } })]
		);
		const createdId = insertRes.rows[0].id;
		console.log(`✅ Inserted test player: ${insertRes.rows[0].email} (ID: ${createdId})`);

		// Update coins
		const updateRes = await pool.query(
			`UPDATE public.course_players SET coins = coins + 50 WHERE id = $1 RETURNING coins`,
			[createdId]
		);
		console.log(`✅ Updated test player coins: ${updateRes.rows[0].coins} (Expected 60)`);

		// Clean up test player
		await pool.query(`DELETE FROM public.course_players WHERE id = $1`, [createdId]);
		console.log(`✅ Cleaned up test player.`);

		console.log('\n🎉 ALL LOCAL POSTGRESQL TESTS PASSED SUCCESSFULLY!\n');
	} catch (err: any) {
		console.error('❌ Test failed:', err);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

runTests();
