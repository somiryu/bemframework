import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf-8');
let url = '';
let key = '';
for (const line of envText.split('\n')) {
  if (line.startsWith('PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
}

const supabase = createClient(url, key);

async function run() {
  // Fetch all players
  const { data: players, error } = await supabase
    .from('course_players')
    .select('id, name, alias, coins, instance_code');

  if (error) {
    console.error('Error fetching players:', error);
    return;
  }

  // Filter players in demo/oasis instances
  const demoPlayers = players.filter(p => {
    const code = (p.instance_code || '').toUpperCase();
    return code.includes('DEMO') || code.includes('OASIS');
  });

  console.log(`Found ${demoPlayers.length} players in demo/oasis instances.`);
  for (const p of demoPlayers) {
    console.log(`- Player: ${p.name} (${p.alias}) in ${p.instance_code} | Current Coins: ${p.coins}`);
    
    // Update coins to 500
    const { error: updateError } = await supabase
      .from('course_players')
      .update({ coins: 500 })
      .eq('id', p.id);

    if (updateError) {
      console.error(`Error updating coins for ${p.name}:`, updateError);
    } else {
      console.log(`  Updated to 500 Coins.`);
    }
  }
}

run();
