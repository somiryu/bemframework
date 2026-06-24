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
  const { data: players, error } = await supabase.from('course_players').select('id, name, alias, game_state');
  if (error) {
    console.error('Error fetching players:', error);
    return;
  }

  console.log(`Total players: ${players.length}`);
  let count = 0;
  players.forEach(p => {
    const gs = p.game_state || {};
    const w1 = gs[1] || gs['1'] || {};
    if (!w1.narrative_intro_viewed) {
      console.log(`- MISSING INTRO VIEWED: ${p.name} (${p.alias}) | World 1 GS: ${JSON.stringify(w1)}`);
      count++;
    }
  });
  console.log(`Total players missing intro viewed: ${count}`);
}

run();
