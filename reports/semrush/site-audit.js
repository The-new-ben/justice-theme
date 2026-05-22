/**
 * Full site audit: all published pages, posts, and practice areas.
 * Maps content to keywords, identifies family law pages, checks for
 * cannibalization risks, and builds the pyramid structure.
 */
const https = require('https');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');

function wpGet(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method: 'GET',
      headers: { 'Authorization': 'Basic ' + auth, 'Accept': 'application/json' }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers }); }
        catch(e) { resolve({ status: res.statusCode, body: data, headers: res.headers }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function getAllPages(type = 'pages', perPage = 100) {
  let page = 1;
  let all = [];
  while (true) {
    const r = await wpGet(`/wp-json/wp/v2/${type}?per_page=${perPage}&page=${page}&status=publish&_fields=id,slug,title,link,modified,meta,excerpt`);
    if (!Array.isArray(r.body) || r.body.length === 0) break;
    all = all.concat(r.body);
    const total = parseInt(r.headers['x-wp-totalpages'] || '1');
    if (page >= total) break;
    page++;
    await new Promise(res => setTimeout(res, 300));
  }
  return all;
}

async function main() {
  console.log('=== FULL SITE AUDIT - jus-tice.co.il ===\n');

  // 1. All pages
  console.log('Fetching all published pages...');
  const pages = await getAllPages('pages');
  console.log(`Total published pages: ${pages.length}`);

  // 2. All posts (if any)
  const posts = await getAllPages('posts');
  console.log(`Total published posts: ${posts.length}`);

  // 3. Articles custom post type
  const articles = await getAllPages('articles');
  console.log(`Total published articles CPT: ${articles.length}`);

  // 4. Lawyer profiles
  const lawyers = await getAllPages('justice_lawyer');
  console.log(`Total published lawyer profiles: ${lawyers.length}`);

  console.log('\n=== PAGES INVENTORY ===');
  
  // Classify pages by practice area
  const FAMILY_KEYWORDS = ['divorce', 'family', 'child', 'custody', 'support', 'mediation', 'גירושין', 'משפחה', 'ילד', 'משמורת', 'מזונות'];
  const CRIMINAL_KEYWORDS = ['criminal', 'police', 'פלילי', 'עצור', 'חקירה'];
  const MEDICAL_KEYWORDS = ['medical', 'malpractice', 'רשלנות', 'רפואי'];
  const REAL_ESTATE_KEYWORDS = ['real-estate', 'property', 'מקרקעין', 'נדלן', 'דירה'];
  const INHERITANCE_KEYWORDS = ['inheritance', 'will', 'ירושה', 'צוואה'];

  function classify(slug, title) {
    const text = (slug + ' ' + title).toLowerCase();
    if (FAMILY_KEYWORDS.some(k => text.includes(k))) return 'family-law';
    if (CRIMINAL_KEYWORDS.some(k => text.includes(k))) return 'criminal-law';
    if (MEDICAL_KEYWORDS.some(k => text.includes(k))) return 'medical-malpractice';
    if (REAL_ESTATE_KEYWORDS.some(k => text.includes(k))) return 'real-estate';
    if (INHERITANCE_KEYWORDS.some(k => text.includes(k))) return 'inheritance';
    return 'other';
  }

  const inventory = {};
  for (const p of pages) {
    const slug = p.slug;
    const title = p.title?.rendered || '';
    const area = classify(slug, title);
    if (!inventory[area]) inventory[area] = [];
    inventory[area].push({ id: p.id, slug, title: title.replace(/&quot;/g, '"').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'"), url: p.link, modified: p.modified });
  }

  for (const [area, items] of Object.entries(inventory)) {
    console.log(`\n--- ${area.toUpperCase()} (${items.length} pages) ---`);
    items.forEach(p => console.log(`  [${p.id}] /${p.slug}/`));
    console.log(`  Titles: ${items.map(p => p.title.substring(0, 50)).join(' | ')}`);
  }

  // 5. Check articles by practice area taxonomy
  console.log('\n=== ARTICLES CPT (by category) ===');
  // Get practice-areas terms
  const paTerms = await wpGet('/wp-json/wp/v2/practice-areas?per_page=50&_fields=id,slug,name,count');
  if (Array.isArray(paTerms.body)) {
    paTerms.body.forEach(t => console.log(`  [${t.id}] ${t.slug} - "${t.name}" (${t.count} articles)`));
  }

  // 6. Check menus
  console.log('\n=== NAVIGATION MENUS ===');
  const menus = await wpGet('/wp-json/wp/v2/menus?per_page=20');
  if (Array.isArray(menus.body)) {
    for (const menu of menus.body) {
      console.log(`  Menu: "${menu.name}" (${menu.count} items)`);
      const items = await wpGet(`/wp-json/wp/v2/menu-items?menus=${menu.id}&per_page=50&_fields=id,title,url,parent,menu_order`);
      if (Array.isArray(items.body)) {
        items.body.forEach(item => {
          const indent = item.parent ? '    ' : '  ';
          console.log(`${indent}[${item.menu_order}] ${item.title?.rendered?.replace(/<[^>]+>/g, '')} -> ${item.url}`);
        });
      }
    }
  }

  // 7. Identify cannibalization risks
  console.log('\n=== CANNIBALIZATION RISK SCAN ===');
  const KEYWORD_MAP = {
    'עורך דין גירושין': [],
    'גירושין בהסכמה': [],
    'הסכם גירושין': [],
    'מזונות ילדים': [],
    'משמורת ילדים': [],
    'עורך דין פלילי': [],
    'רשלנות רפואית': [],
    'עורך דין מקרקעין': [],
    'ירושה וצוואה': [],
  };
  
  for (const p of pages) {
    const slug = p.slug;
    const title = (p.title?.rendered || '').replace(/<[^>]+>/g, '');
    for (const kw of Object.keys(KEYWORD_MAP)) {
      const kwNorm = kw.toLowerCase();
      if (slug.toLowerCase().includes(kwNorm.split(' ')[0]) || 
          title.toLowerCase().includes(kw)) {
        KEYWORD_MAP[kw].push(`/${slug}/ (${title.substring(0, 40)})`);
      }
    }
  }

  for (const [kw, matches] of Object.entries(KEYWORD_MAP)) {
    if (matches.length > 1) {
      console.log(`  ⚠️  POTENTIAL CANNIBALIZATION: "${kw}"`);
      matches.forEach(m => console.log(`    - ${m}`));
    }
  }

  // 8. Homepage status
  console.log('\n=== HOMEPAGE ===');
  const homepage = await wpGet('/wp-json/wp/v2/pages?slug=&per_page=1&status=publish');
  const frontPage = await wpGet('/wp-json/wp/v2/pages?per_page=1&status=publish&orderby=menu_order&order=asc');
  
  // Get site settings
  const settings = await wpGet('/wp-json/wp/v2/settings');
  if (settings.body && settings.body.page_on_front) {
    console.log(`  Front page ID: ${settings.body.page_on_front}`);
    console.log(`  Posts page ID: ${settings.body.page_for_posts}`);
    console.log(`  Site title: ${settings.body.title}`);
    console.log(`  Site description: ${settings.body.description}`);
  }

  // Save full report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total_pages: pages.length,
      total_posts: posts.length,
      total_articles: articles.length,
      total_lawyers: lawyers.length,
    },
    pages_by_area: inventory,
    all_pages: pages.map(p => ({ id: p.id, slug: p.slug, title: (p.title?.rendered || '').replace(/<[^>]+>/g, ''), url: p.link })),
    all_articles: articles.map(a => ({ id: a.id, slug: a.slug, title: (a.title?.rendered || '').replace(/<[^>]+>/g, ''), url: a.link })),
    lawyers: lawyers.map(l => ({ id: l.id, slug: l.slug, title: (l.title?.rendered || '').replace(/<[^>]+>/g, '') })),
  };
  
  fs.writeFileSync('c:/Users/pro/justice/justice-theme/reports/site-audit-2026-05-22.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nAudit saved to reports/site-audit-2026-05-22.json');
}

main().catch(console.error);
