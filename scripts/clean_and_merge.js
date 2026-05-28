import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const processedPath = '/Users/freetoplay/.gemini/antigravity/scratch/processed_chunk_2_part2.json';
const blogDataPath = 'src/lib/content/blogData.ts';

const categoryMap = {
  'Systemic Design': 'Diseño Sistémico',
  'UX & Game Loops': 'UX y Bucles de Juego',
  'L&D & Education': 'Aprendizaje y L&D',
  'Psychology': 'Psicología'
};

function formatPost(item, lang) {
  const category = lang === 'es' ? (categoryMap[item.category] || item.category) : item.category;
  const langData = item[lang];
  
  let faqStr = '';
  if (langData.faq && langData.faq.length > 0) {
    faqStr = `,\n\t\tfaq: ${JSON.stringify(langData.faq, null, 2).replace(/\n/g, '\n\t\t')}`;
  }
  
  const contentStr = langData.content.trim();
  
  return `\t\t{
\t\t\tslug: '${item.slug}',
\t\t\tcategory: '${category}',
\t\t\treadTime: ${item.readTime},
\t\t\tdate: '${item.date}',
\t\t\tauthor: '${item.author}',
\t\t\ttitle: ${JSON.stringify(langData.title)},
\t\t\texcerpt: ${JSON.stringify(langData.excerpt)},
\t\t\tcontent: \`
${contentStr}
\`${faqStr}
\t\t}`;
}

function main() {
  console.log("Loading new articles from JSON...");
  const newArticles = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
  console.log(`Loaded ${newArticles.length} articles.`);

  console.log("Retrieving pristine blogData.ts from Git HEAD...");
  let pristineContent;
  try {
    pristineContent = execSync(`git show HEAD:${blogDataPath}`, { encoding: 'utf-8' });
    console.log("Successfully retrieved pristine content!");
  } catch (err) {
    console.error("Failed to run git show HEAD:", err.message);
    process.exit(1);
  }

  // Generate the formatted new posts
  const formattedEnPosts = newArticles.map(item => formatPost(item, 'en'));
  const formattedEsPosts = newArticles.map(item => formatPost(item, 'es'));

  // Find boundary between en and es arrays
  // Looks like: ],\n\tes: [
  const boundaryRegex = /\]\s*,\s*[\r\n\t ]*es\s*:\s*\[/;
  const boundaryMatch = pristineContent.match(boundaryRegex);
  if (!boundaryMatch) {
    console.error("Could not find the boundary between 'en' and 'es' arrays in the pristine file.");
    process.exit(1);
  }

  const boundaryIndex = boundaryMatch.index;
  const enPart = pristineContent.slice(0, boundaryIndex);
  const esPart = pristineContent.slice(boundaryIndex);

  // enPart ends right before the closing ']' of the en array
  const updatedEnPart = enPart.trimEnd() + ',\n' + formattedEnPosts.join(',\n') + '\n';

  // Find the closing bracket of the es array (which is right before '};')
  const endRegex = /\]\s*\}\s*;?\s*$/;
  const endMatch = esPart.match(endRegex);
  if (!endMatch) {
    console.error("Could not find the closing brackets at the end of the 'es' array.");
    process.exit(1);
  }

  const esItemsPart = esPart.slice(0, endMatch.index);
  const esEndPart = esPart.slice(endMatch.index);

  const updatedEsPart = esItemsPart.trimEnd() + ',\n' + formattedEsPosts.join(',\n') + '\n' + esEndPart;

  const finalContent = updatedEnPart + updatedEsPart;

  console.log("Writing merged content back to blogData.ts...");
  fs.writeFileSync(blogDataPath, finalContent, 'utf8');
  console.log("Successfully merged and saved blogData.ts!");
}

main();
