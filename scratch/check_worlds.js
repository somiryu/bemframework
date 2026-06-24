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
  const { data: worlds, error: wErr } = await supabase.from('course_worlds').select('*');
  if (wErr) console.error('Worlds error:', wErr);
  else console.log('Worlds:', worlds.map(w => ({ id: w.id, id_type: typeof w.id, name: w.name })));

  const { data: players, error: pErr } = await supabase.from('course_players').select('id, name, alias, game_state').limit(3);
  if (pErr) console.error('Players error:', pErr);
  else {
    players.forEach(p => {
      console.log(`Player: ${p.name} (${p.alias})`);
      console.log('Game State Type:', typeof p.game_state);
      console.log('Game State Keys:', p.game_state ? Object.keys(p.game_state) : 'null');
      console.log('Game State JSON:', JSON.stringify(p.game_state));
    });
  }
}

run();
