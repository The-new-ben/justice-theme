/**
 * wp-rest-practice-areas.js
 * Pulls practice-areas for ALL articles via WP REST API.
 * Outputs enriched articles with resolved practice-area names.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://jus-tice.co.il/wp-json/wp/v2';
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master', 'wp-rest-export');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'JusTice-SEO-Audit/1.0' }, timeout: 30000 }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }); }
        catch (e) { resolve({ status: res.statusCode, data: null, raw: data.slice(0,200) }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function toCsv(rows, cols) {
  const lines = rows.map(r => cols.map(c => {
    let v = String(r[c] !== undefined && r[c] !== null ? r[c] : '');
    if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g,'""') + '"';
    return v;
  }).join(','));
  return cols.join(',') + '\n' + lines.join('\n') + '\n';
}

async function main() {
  console.log('Pulling practice-areas for all articles...\n');

  // 1. Load practice-area terms
  const paRes = await get(`${BASE_URL}/practice-areas?per_page=100&_fields=id,name,slug`);
  const paTerms = paRes.status === 200 && Array.isArray(paRes.data) ? paRes.data : [];
  const paById = {};
  paTerms.forEach(p => { paById[p.id] = p.name; });
  console.log(`Practice area terms: ${paTerms.length}`);

  // 2. Paginate all articles with practice-areas field
  let allArticles = [];
  for (let page = 1; page <= 30; page++) {
    const url = `${BASE_URL}/articles?per_page=100&page=${page}&_fields=id,slug,link,title,status,date,modified,author,categories,tags,practice-areas`;
    process.stdout.write(`  Page ${page}... `);
    const res = await get(url);
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      console.log('done');
      break;
    }
    allArticles = allArticles.concat(res.data);
    console.log(`${res.data.length} items (${allArticles.length} total)`);
    const total = res.headers['x-wp-totalpages'];
    if (total && page >= parseInt(total)) break;
  }

  console.log(`\nTotal articles: ${allArticles.length}`);

  // 3. Build enriched rows
  const rows = allArticles.map(a => {
    const paIds = a['practice-areas'] || [];
    const paNames = paIds.map(id => paById[id] || `PA_ID_${id}`);
    const catIds = a.categories || [];
    const tagIds = a.tags || [];
    return {
      post_id: a.id,
      post_type: 'articles',
      wp_status: a.status,
      current_url: a.link,
      current_slug: a.slug,
      current_title: a.title ? a.title.rendered.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#8211;/g,'–').replace(/&#8217;/g,"'").trim() : '',
      author_id: a.author,
      published_date: a.date ? a.date.split('T')[0] : '',
      modified_date: a.modified ? a.modified.split('T')[0] : '',
      practice_area_ids: paIds.join('|'),
      practice_area_names: paNames.join(' | '),
      category_ids: catIds.join('|'),
      tag_ids: tagIds.join('|'),
    };
  });

  // 4. Stats
  const withPA = rows.filter(r => r.practice_area_names && r.practice_area_names.trim() !== '').length;
  const withoutPA = rows.length - withPA;
  console.log(`\nArticles with practice-area: ${withPA}`);
  console.log(`Articles without practice-area: ${withoutPA}`);

  // Practice area distribution
  const paDist = {};
  rows.forEach(r => {
    const names = r.practice_area_names.split(' | ').filter(Boolean);
    names.forEach(n => { paDist[n] = (paDist[n] || 0) + 1; });
  });
  console.log('\nPractice area distribution:');
  Object.entries(paDist).sort((a,b) => b[1]-a[1]).forEach(([name, count]) => {
    console.log(`  ${count} — ${name}`);
  });

  // 5. Write
  const cols = ['post_id','post_type','wp_status','current_url','current_slug','current_title','author_id','published_date','modified_date','practice_area_ids','practice_area_names','category_ids','tag_ids'];
  fs.writeFileSync(path.join(OUTPUT_DIR, 'wp-articles-with-practice-areas.csv'), toCsv(rows, cols));
  console.log(`\nSaved: wp-articles-with-practice-areas.csv (${rows.length} rows)`);
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
