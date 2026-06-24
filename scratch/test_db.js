import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env
const envText = fs.readFileSync('.env', 'utf-8');
const envLines = envText.split('\n');
let supabaseUrl = '';
let supabaseAnonKey = '';

for (const line of envLines) {
  if (line.startsWith('PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
}

console.log('Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Fetch a player
  const { data: players, error: fetchError } = await supabase
    .from('course_players')
    .select('id, name, alias, game_state')
    .limit(5);

  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  console.log('Fetched players:', players.map(p => ({ id: p.id, name: p.name, alias: p.alias, gs: JSON.stringify(p.game_state) })));

  const targetPlayer = players[0];
  if (!targetPlayer) {
    console.log('No players found');
    return;
  }

  console.log('Testing update for player:', targetPlayer.name);
  const state = targetPlayer.game_state || {};
  if (!state[1]) state[1] = {};
  
  // Toggle narrative_intro_viewed
  const currentVal = !!state[1].narrative_intro_viewed;
  state[1].narrative_intro_viewed = !currentVal;
  console.log('New target state:', JSON.stringify(state));

  const { data: updatedData, error: updateError } = await supabase
    .from('course_players')
    .update({ game_state: state })
    .eq('id', targetPlayer.id)
    .select();

  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Update successful! New DB state:', JSON.stringify(updatedData[0].game_state));
    
    // Restore original value
    state[1].narrative_intro_viewed = currentVal;
    await supabase
      .from('course_players')
      .update({ game_state: state })
      .eq('id', targetPlayer.id);
    console.log('Restored original value.');
  }
}

run();
