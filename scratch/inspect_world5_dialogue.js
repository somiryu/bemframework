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
  const { data: w, error } = await supabase.from('course_worlds').select('id, title, narrative_intro, narrative_outro').eq('id', 5).single();
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('World 5 Narrative Intro:', JSON.stringify(w.narrative_intro, null, 2));
    console.log('World 5 Narrative Outro:', JSON.stringify(w.narrative_outro, null, 2));
  }
}

run();
