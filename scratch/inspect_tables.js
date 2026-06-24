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
  const { data: inst } = await supabase.from('course_instances').select('*').limit(1);
  console.log('course_instances columns:', Object.keys(inst[0] || {}));

  const { data: play } = await supabase.from('course_players').select('*').limit(1);
  console.log('course_players columns:', Object.keys(play[0] || {}));
}

run();
