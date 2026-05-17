/**
 * Inject internal link to criminal law pillar page into unlinked articles.
 * 
 * This adds a contextual CTA block at the end of each criminal law article
 * that doesn't already link to /criminal-defense-attorney/
 * 
 * Run: node tools/inject-pillar-links.js [--dry-run] [--limit=10]
 */

const fs = require('fs');
const path = require('path');

const credPath = path.join(__dirname, 'gsc', 'wp-app-password.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
const SITE = 'https://jus-tice.co.il';
const AUTH = Buffer.from(`${creds.username}:${creds.app_password}`).toString('base64');

const PILLAR_URL = '/criminal-defense-attorney/';
const PILLAR_ANCHOR = 'עורך דין פלילי';
const TAXONOMY_TERM_ID = 170; // criminal-law

// The CTA block to inject at the end of article content
const CTA_BLOCK = `
<div class="justice-pillar-link" style="margin-top:2rem;padding:1.5rem;background:rgba(82,114,178,0.06);border-radius:12px;border-right:4px solid #5272b2;">
<p style="margin:0;font-size:1.05rem;line-height:1.7;">
<strong>📌 קראו גם:</strong> המדריך המלא שלנו בנושא <a href="${SITE}${PILLAR_URL}" style="color:#5272b2;font-weight:700;">${PILLAR_ANCHOR}</a> — כולל הסבר על זכויות, הליכים, עלויות, ובחירת עורך דין מתאים.
</p>
</div>`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 999;

async function fetchAllCriminalArticles() {
  let page = 1;
  let articles = [];
  
  while (true) {
    const url = `${SITE}/wp-json/wp/v2/articles?practice-areas=${TAXONOMY_TERM_ID}&per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Basic ${AUTH}` },
    });
    
    if (!res.ok) break;
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    articles.push(...data);
    
    const total = parseInt(res.headers.get('x-wp-total') || '0');
    if (articles.length >= total) break;
    page++;
  }
  
  return articles;
}

async function injectLink(article) {
  const content = article.content?.raw || article.content?.rendered || '';
  
  // Skip if already links to pillar
  if (content.includes(PILLAR_URL) || content.includes('criminal-defense-attorney')) {
    return { status: 'skipped', reason: 'already linked' };
  }
  
  // Skip if already has the CTA block
  if (content.includes('justice-pillar-link')) {
    return { status: 'skipped', reason: 'already has CTA block' };
  }
  
  if (dryRun) {
    return { status: 'dry-run', reason: 'would inject' };
  }
  
  // Get raw content via edit context
  const editRes = await fetch(`${SITE}/wp-json/wp/v2/articles/${article.id}?context=edit`, {
    headers: { 'Authorization': `Basic ${AUTH}` },
  });
  
  if (!editRes.ok) {
    return { status: 'error', reason: `fetch failed: ${editRes.status}` };
  }
  
  const editData = await editRes.json();
  const rawContent = editData.content?.raw || '';
  
  if (rawContent.includes(PILLAR_URL) || rawContent.includes('justice-pillar-link')) {
    return { status: 'skipped', reason: 'already linked (raw)' };
  }
  
  // Append CTA block
  const newContent = rawContent + '\n' + CTA_BLOCK;
  
  const updateRes = await fetch(`${SITE}/wp-json/wp/v2/articles/${article.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: newContent }),
  });
  
  if (!updateRes.ok) {
    const err = await updateRes.text();
    return { status: 'error', reason: `update failed: ${updateRes.status} ${err.substring(0, 100)}` };
  }
  
  return { status: 'injected' };
}

async function main() {
  console.log('=== Criminal Law Pillar Link Injection ===');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Limit: ${limit}`);
  console.log(`Pillar: ${SITE}${PILLAR_URL}`);
  console.log('');
  
  const articles = await fetchAllCriminalArticles();
  console.log(`Found ${articles.length} criminal law articles\n`);
  
  let injected = 0, skipped = 0, errors = 0;
  
  for (const article of articles) {
    if (injected >= limit) {
      console.log(`Reached limit of ${limit}`);
      break;
    }
    
    const result = await injectLink(article);
    
    if (result.status === 'injected' || result.status === 'dry-run') {
      injected++;
      console.log(`✅ ${result.status}: ${article.id} | ${article.slug}`);
    } else if (result.status === 'skipped') {
      skipped++;
    } else {
      errors++;
      console.log(`❌ ${result.status}: ${article.id} | ${result.reason}`);
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Injected: ${injected}`);
  console.log(`Skipped (already linked): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total processed: ${articles.length}`);
}

main().catch(console.error);
