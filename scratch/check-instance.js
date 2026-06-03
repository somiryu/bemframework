import { createClient } from '@supabase/supabase-js';

const url = 'https://trwjxokjhvkhlmxtboun.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2p4b2tqaHZraGxteHRib3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzc0NDUsImV4cCI6MjA5NDI1MzQ0NX0.gRDNDbxhObWg2ADu5LFB91pC5WaK5eaC86pkaTKtSXw';

const supabase = createClient(url, key);

async function check() {
	console.log('Querying course_instances for DEMO-2026...');
	const { data, error } = await supabase
		.from('course_instances')
		.select('*')
		.eq('code', 'DEMO-2026')
		.single();

	if (error) {
		console.error('Error:', error);
		return;
	}

	console.log('Current Workshop State:', JSON.stringify(data.current_workshop_state, null, 2));
}

check();
