import { createClient } from '@supabase/supabase-js';

const url = 'https://trwjxokjhvkhlmxtboun.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd2p4b2tqaHZraGxteHRib3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzc0NDUsImV4cCI6MjA5NDI1MzQ0NX0.gRDNDbxhObWg2ADu5LFB91pC5WaK5eaC86pkaTKtSXw';

const supabase = createClient(url, key);

async function test() {
	console.log('Testing public table select (should be BLOCKED by RLS now)...');
	const { data: tableData, error: tableError } = await supabase
		.from('super_user')
		.select('*')
		.eq('email', 'javier@f2p.co');

	if (tableError) {
		console.log('Table read blocked correctly as expected:', tableError.message);
	} else {
		console.log('Table read result:', tableData);
	}

	console.log('\nTesting secure RPC is_super_user for javier@f2p.co (should succeed)...');
	const { data: isSuper, error: rpcError } = await supabase
		.rpc('is_super_user', { email_to_check: 'javier@f2p.co' });

	if (rpcError) {
		console.error('RPC Error:', rpcError);
	} else {
		console.log('RPC Success! Is javier@f2p.co superuser?', isSuper);
	}

	console.log('\nTesting secure RPC is_super_user for non-existent user...');
	const { data: isSuperFake, error: rpcErrorFake } = await supabase
		.rpc('is_super_user', { email_to_check: 'fake@f2p.co' });

	if (rpcErrorFake) {
		console.error('RPC Error:', rpcErrorFake);
	} else {
		console.log('RPC Success! Is fake@f2p.co superuser?', isSuperFake);
	}
}

test();
