const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://jus-tice.co.il/wp-json/wp/v2';
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master');

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'JusTice-SEO-Audit/1.0' }, timeout: 30000 }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }); }
        catch (e) { resolve({ status: res.statusCode, data: null, headers: res.headers, raw: data.slice(0,200) }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function toCsv(rows, cols) {
  if (!rows.length) return cols.join(',') + '\n';
  const lines = rows.map(r => cols.map(c => {
    let v = String(r[c] !== undefined && r[c] !== null ? r[c] : '');
    if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g,'""') + '"';
    return v;
  }).join(','));
  return cols.join(',') + '\n' + lines.join('\n') + '\n';
}

async function fetchAll(endpoint, maxPages = 20) {
  let all = [];
  for (let p = 1; p <= maxPages; p++) {
    const url = `${BASE_URL}/${endpoint}&page=${p}&per_page=100`;
    process.stdout.write(`  ${endpoint} page ${p}... `);
    const res = await get(url);
    if (res.status !== 200 || !res.data) { console.log(`stopped (${res.status})`); break; }
    const rows = Array.isArray(res.data) ? res.data : [res.data];
    if (rows.length === 0) { console.log('done'); break; }
    all = all.concat(rows);
    const total = res.headers['x-wp-totalpages'];
    console.log(`${rows.length} items (${all.length} total)`);
    if (total && p >= parseInt(total)) break;
  }
  return all;
}

async function main() {
  ensureDir(OUTPUT_DIR);
  const wpDir = path.join(OUTPUT_DIR, 'wp-rest-export');
  ensureDir(wpDir);

  console.log('╔══════════════════════════════════╗');
  console.log('║  WordPress REST Export           ║');
  console.log('╚══════════════════════════════════╝\n');

  // 1. Articles CPT
  console.log('── Articles...');
  const articles = await fetchAll('articles?_fields=id,slug,link,title,status,date,modified,author,excerpt,categories,tags,meta,type', 30);
  console.log(`  Total articles: ${articles.length}`);

  const articleRows = articles.map(a => ({
    post_id: a.id,
    post_type: 'articles',
    wp_status: a.status,
    current_url: a.link,
    current_slug: a.slug,
    current_title: a.title ? a.title.rendered.replace(/<[^>]+>/g,'').trim() : '',
    author_id: a.author,
    published_date: a.date ? a.date.split('T')[0] : '',
    modified_date: a.modified ? a.modified.split('T')[0] : '',
    categories: a.categories ? a.categories.join('|') : '',
    tags: a.tags ? a.tags.join('|') : '',
    excerpt: a.excerpt ? a.excerpt.rendered.replace(/<[^>]+>/g,'').trim().slice(0,200) : '',
    has_meta: a.meta ? 'YES' : 'NO'
  }));

  fs.writeFileSync(path.join(wpDir, 'wp-articles.csv'), toCsv(articleRows, ['post_id','post_type','wp_status','current_url','current_slug','current_title','author_id','published_date','modified_date','categories','tags','excerpt','has_meta']));
  console.log(`  Saved ${articleRows.length} articles to wp-articles.csv`);

  // 2. Categories
  console.log('\n── Categories...');
  const cats = await fetchAll('categories?_fields=id,name,slug,parent,count', 5);
  const catRows = cats.map(c => ({ id: c.id, name: c.name, slug: c.slug, parent: c.parent, count: c.count }));
  fs.writeFileSync(path.join(wpDir, 'wp-categories.csv'), toCsv(catRows, ['id','name','slug','parent','count']));
  console.log(`  Saved ${catRows.length} categories`);

  // Build category ID -> name map
  const catMap = {};
  cats.forEach(c => { catMap[c.id] = c.name; });
  fs.writeFileSync(path.join(wpDir, 'wp-category-map.json'), JSON.stringify(catMap, null, 2));

  // 3. Tags
  console.log('\n── Tags...');
  const tags = await fetchAll('tags?_fields=id,name,slug,count', 10);
  const tagRows = tags.map(t => ({ id: t.id, name: t.name, slug: t.slug, count: t.count }));
  fs.writeFileSync(path.join(wpDir, 'wp-tags.csv'), toCsv(tagRows, ['id','name','slug','count']));
  console.log(`  Saved ${tagRows.length} tags`);
  const tagMap = {};
  tags.forEach(t => { tagMap[t.id] = t.name; });

  // 4. Practice areas taxonomy
  console.log('\n── Practice Areas...');
  const paRes = await get(`${BASE_URL}/practice-areas?per_page=100&_fields=id,name,slug,count`);
  let practiceAreas = [];
  if (paRes.status === 200 && paRes.data) {
    practiceAreas = Array.isArray(paRes.data) ? paRes.data : [paRes.data];
    const paRows = practiceAreas.map(p => ({ id: p.id, name: p.name, slug: p.slug, count: p.count }));
    fs.writeFileSync(path.join(wpDir, 'wp-practice-areas.csv'), toCsv(paRows, ['id','name','slug','count']));
    console.log(`  Saved ${paRows.length} practice areas`);
  } else {
    console.log(`  Practice areas: not accessible (${paRes.status}) - try taxonomy name variants`);
    // Try alternative slugs
    for (const slug of ['practice_area','practice-area','practice_areas','topics']) {
      const r2 = await get(`${BASE_URL}/${slug}?per_page=100`);
      if (r2.status === 200 && r2.data) {
        console.log(`  Found taxonomy at: ${slug} - ${r2.data.length} terms`);
        fs.writeFileSync(path.join(wpDir, `wp-${slug}.csv`), JSON.stringify(r2.data, null, 2));
        break;
      }
    }
  }
  const paMap = {};
  practiceAreas.forEach(p => { paMap[p.id] = p.name; });

  // 5. Now rebuild enriched article list with resolved names
  console.log('\n── Building enriched article export...');
  const enriched = articleRows.map(a => {
    const catIds = a.categories ? a.categories.split('|').filter(Boolean) : [];
    const tagIds = a.tags ? a.tags.split('|').filter(Boolean) : [];
    return {
      ...a,
      category_names: catIds.map(id => catMap[id] || id).join(' | '),
      tag_names: tagIds.map(id => tagMap[id] || id).join(' | ')
    };
  });
  fs.writeFileSync(path.join(wpDir, 'wp-articles-enriched.csv'), 
    toCsv(enriched, ['post_id','post_type','wp_status','current_url','current_slug','current_title','author_id','published_date','modified_date','category_names','tag_names','excerpt']));
  console.log(`  Saved enriched export with category/tag names`);

  // 6. Check posts (standard blog posts)
  console.log('\n── Standard posts...');
  const posts = await fetchAll('posts?_fields=id,slug,link,title,status,date,modified,categories,tags&status=publish', 5);
  if (posts.length > 0) {
    const postRows = posts.map(p => ({ post_id: p.id, post_type: 'post', wp_status: p.status, current_url: p.link, current_slug: p.slug, current_title: p.title ? p.title.rendered.replace(/<[^>]+>/g,'') : '' }));
    fs.writeFileSync(path.join(wpDir, 'wp-posts.csv'), toCsv(postRows, ['post_id','post_type','wp_status','current_url','current_slug','current_title']));
    console.log(`  Saved ${postRows.length} standard posts`);
  }

  // 7. Pages
  console.log('\n── Pages...');
  const pages = await fetchAll('pages?_fields=id,slug,link,title,status,date,modified', 5);
  if (pages.length > 0) {
    const pageRows = pages.map(p => ({ post_id: p.id, post_type: 'page', wp_status: p.status, current_url: p.link, current_slug: p.slug, current_title: p.title ? p.title.rendered.replace(/<[^>]+>/g,'') : '' }));
    fs.writeFileSync(path.join(wpDir, 'wp-pages.csv'), toCsv(pageRows, ['post_id','post_type','wp_status','current_url','current_slug','current_title']));
    console.log(`  Saved ${pageRows.length} pages`);
  }

  console.log('\n╔══════════════════════════════════╗');
  console.log('║  WP REST EXPORT COMPLETE         ║');
  console.log('╚══════════════════════════════════╝');
  console.log(`Output: ${wpDir}`);
  console.log(`Articles: ${articleRows.length} | Categories: ${catRows.length} | Tags: ${tagRows.length}`);
  console.log(`Practice areas: ${practiceAreas.length}`);
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
