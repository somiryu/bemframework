import { createClient } from '@supabase/supabase-js';

const url = 'https://trwjxokjhvkhlmxtboun.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2p4b2tqaHZraGxteHRib3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzc0NDUsImV4cCI6MjA5NDI1MzQ0NX0.gRDNDbxhObWg2ADu5LFB91pC5WaK5eaC86pkaTKtSXw';

const supabase = createClient(url, key);

async function check() {
	console.log('Querying course_players with game_state containing "2"...');
	const { data: players, error } = await supabase
		.from('course_players')
		.select('*');

	if (error) {
		console.error('Error fetching players:', error);
		return;
	}

	players.forEach(p => {
		if (p.game_state && (p.game_state['2'] || p.game_state[2])) {
			console.log(`MATCH - Player: ${p.alias} (${p.email}) - Instance: ${p.instance_code}`);
			console.log('Game State [2]:', JSON.stringify(p.game_state['2'] || p.game_state[2], null, 2));
			console.log('---');
		}
	});
	console.log('Done.');
}

check();
