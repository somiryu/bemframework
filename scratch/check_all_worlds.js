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
  const { data: worlds, error } = await supabase.from('course_worlds').select('*');
  if (error) {
    console.error('Error fetching worlds:', error);
    return;
  }

  worlds.forEach(w => {
    console.log(`\n=================== WORLD ${w.id} ===================`);
    console.log('narrative_intro steps:', w.narrative_intro ? w.narrative_intro.length : 0);
    console.log('narrative_outro steps:', w.narrative_outro ? w.narrative_outro.length : 0);
    console.log('workshop_modules slides count:', w.workshop_modules?.slides?.length || 0);
    console.log('training_modules:', JSON.stringify(w.training_modules?.title || 'None'));
    console.log('wiki_modules count:', w.wiki_modules?.length || 0);
    console.log('Is there a medals/achievements reference in workshop_modules?');
    const hasMedals = JSON.stringify(w.workshop_modules).includes('medal') || JSON.stringify(w.workshop_modules).includes('logro');
    console.log('Has "medal" or "logro" in workshop_modules:', hasMedals);
  });
}

run();
