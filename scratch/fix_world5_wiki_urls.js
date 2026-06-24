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
  const { data: worldData, error: fetchError } = await supabase
    .from('course_worlds')
    .select('wiki_modules')
    .eq('id', 5)
    .single();

  if (fetchError) {
    console.error('Error fetching world 5:', fetchError);
    return;
  }

  const wikiModules = worldData.wiki_modules || [];
  const updatedModules = wikiModules.map(module => {
    if (module.url && module.url.startsWith('/learn_resources/resources/')) {
      const original = module.url;
      module.url = original.replace('/learn_resources/resources/', '/learn_resources/resources/');
      console.log(`Replacing URL: ${original} -> ${module.url}`);
    }
    return module;
  });

  const { error: updateError } = await supabase
    .from('course_worlds')
    .update({ wiki_modules: updatedModules })
    .eq('id', 5);

  if (updateError) {
    console.error('Error updating world 5 wiki modules:', updateError);
  } else {
    console.log('Successfully updated World 5 wiki modules URLs in database.');
  }
}

run();
