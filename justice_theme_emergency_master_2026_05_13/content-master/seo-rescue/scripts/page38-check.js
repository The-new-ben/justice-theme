// Check page 38 (homepage) Yoast SEO meta via REST API
const https = require('https');
const auth = Buffer.from('benbatash:BynE nrDn 6boc xPSW JjLa K9C5').toString('base64');

function getAuth(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Authorization': 'Basic ' + auth }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== CHECK PAGE 38 (HOMEPAGE) YOAST SEO META ===\n');

  // 1. Get page 38 with Yoast SEO fields
  const r = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/pages/38');
  if (r.status !== 200) {
    console.log('Page 38 not found. Status:', r.status);
    return;
  }

  const page = JSON.parse(r.body);
  console.log('Title:', page.title?.rendered);
  console.log('Slug:', page.slug);
  console.log('Status:', page.status);
  console.log('Template:', page.template);
  console.log('Link:', page.link);

  // 2. Check Yoast meta fields
  console.log('\n--- Yoast SEO Meta (from post meta) ---');
  const yoastFields = [
    'yoast_head', 'yoast_head_json',
  ];
  
  for (const f of yoastFields) {
    if (page[f]) {
      if (f === 'yoast_head_json') {
        const yj = page[f];
        console.log('  canonical:', yj.canonical);
        console.log('  og_url:', yj.og_url);
        console.log('  robots:', JSON.stringify(yj.robots));
        console.log('  title:', yj.title);
        console.log('  og_title:', yj.og_title);
        console.log('  og_description:', yj.og_description?.substring(0, 100));
      } else if (f === 'yoast_head') {
        // Check for noindex in raw HTML
        const noindex = page[f].includes('noindex');
        const canonical = page[f].match(/rel="canonical"[^>]*href="([^"]*)"/);
        console.log('  Contains noindex:', noindex ? '🚨 YES!' : '✅ No');
        console.log('  Canonical:', canonical ? canonical[1] : 'not found');
      }
    }
  }

  // 3. Also check the Yoast REST endpoint for the homepage
  console.log('\n--- Yoast HEAD API for Homepage ---');
  const homeHead = await getAuth('https://jus-tice.co.il/wp-json/yoast/v1/get_head?url=https://jus-tice.co.il/');
  if (homeHead.status === 200) {
    const h = JSON.parse(homeHead.body);
    console.log('  canonical:', h.json?.canonical);
    console.log('  robots:', JSON.stringify(h.json?.robots));
    console.log('  title:', h.json?.title);
    console.log('  status:', h.status);
  }

  // 4. Check show_on_front and page_on_front settings
  console.log('\n--- WordPress Homepage Settings ---');
  const settings = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/settings');
  if (settings.status === 200) {
    const s = JSON.parse(settings.body);
    console.log('  show_on_front:', s.show_on_front);
    console.log('  page_on_front:', s.page_on_front);
    console.log('  page_for_posts:', s.page_for_posts);
  }

  // 5. Check for Schema & Structured Data plugin conflict
  console.log('\n--- Plugin Conflicts (Schema duplication) ---');
  const plugins = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/plugins');
  if (plugins.status === 200) {
    const plist = JSON.parse(plugins.body);
    const dangerous = plist.filter(p => p.status === 'active' && (
      p.plugin.includes('schema') || 
      p.plugin.includes('faq-schema') ||
      p.plugin.includes('wp-sitemap-page') ||
      p.plugin.includes('all-in-one')
    ));
    dangerous.forEach(p => {
      console.log('  ⚠ ACTIVE:', p.name, '(' + p.plugin + ')');
    });
    if (dangerous.length === 0) {
      console.log('  ✅ No dangerous schema/sitemap conflicts found');
    }
  }
}

main().catch(e => console.error('FATAL:', e));
