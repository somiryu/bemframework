import { createClient } from '@supabase/supabase-js';

const url = 'https://trwjxokjhvkhlmxtboun.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2p4b2tqaHZraGxteHRib3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzc0NDUsImV4cCI6MjA5NDI1MzQ0NX0.gRDNDbxhObWg2ADu5LFB91pC5WaK5eaC86pkaTKtSXw';

const supabase = createClient(url, key);

async function runReset() {
	console.log('Querying course_players for DEMO-2026...');
	const { data: players, error } = await supabase
		.from('course_players')
		.select('*')
		.eq('instance_code', 'DEMO-2026');

	if (error) {
		console.error('Error fetching players:', error);
		return;
	}

	console.log(`Found ${players.length} players. Updating...`);

	for (const p of players) {
		const newState = { ...p.game_state };
		console.log(`Before update for ${p.alias}:`, JSON.stringify(newState));
		delete newState['2'];
		delete newState[2];
		console.log(`After delete key 2:`, JSON.stringify(newState));

		const { data, error: updateError } = await supabase
			.from('course_players')
			.update({ game_state: newState })
			.eq('id', p.id)
			.select();

		if (updateError) {
			console.error(`Error updating player ${p.alias}:`, updateError.message);
		} else {
			console.log(`Updated player ${p.alias} successfully! Result:`, JSON.stringify(data[0].game_state));
		}
	}
}

runReset();
