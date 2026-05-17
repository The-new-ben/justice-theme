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
  // 1. Check blog_public option directly via options endpoint
  console.log('=== DEEP SETTINGS CHECK ===\n');
  
  // Try reading blog_public via custom REST call
  console.log('--- blog_public via /wp-json/ root ---');
  const root = await getAuth('https://jus-tice.co.il/wp-json/');
  try {
    const j = JSON.parse(root.body);
    console.log('  Site name:', j.name);
    console.log('  Site URL:', j.url);
    console.log('  Home:', j.home);
  } catch(e) { console.log('  Parse error'); }

  // 2. Check if Yoast is active
  console.log('\n--- Active plugins check ---');
  const plugins = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/plugins');
  if (plugins.status === 200) {
    try {
      const plist = JSON.parse(plugins.body);
      for (const p of plist) {
        if (p.status === 'active') {
          console.log('  ACTIVE:', p.name || p.plugin);
        }
      }
    } catch(e) { console.log('  Cannot parse plugins list'); }
  } else {
    console.log('  Plugins endpoint status:', plugins.status);
  }

  // 3. Check where /sitemap.xml redirects to
  console.log('\n--- Sitemap redirect chain ---');
  const sitemap = await getAuth('https://jus-tice.co.il/sitemap.xml');
  console.log('  /sitemap.xml status:', sitemap.status);
  if (sitemap.body.length < 500) console.log('  Body:', sitemap.body);
  
  // 4. Canonical tag problem: articles show canonical WITHOUT /articles/
  console.log('\n--- CANONICAL TAG MISMATCH CHECK ---');
  const slugs = ['lahav-433', 'shoplifting', 'golden-visa', 'immigration-lawyer', 'usa-lawyers'];
  for (const slug of slugs) {
    const r = await getAuth('https://jus-tice.co.il/articles/' + slug + '/');
    const canonical = r.body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    const actualUrl = 'https://jus-tice.co.il/articles/' + slug + '/';
    const canonicalUrl = canonical ? canonical[1] : 'NONE';
    const mismatch = canonicalUrl !== actualUrl;
    console.log(' ', mismatch ? '🚨 MISMATCH' : '✅ OK', slug);
    console.log('    Actual:', actualUrl);
    console.log('    Canon: ', canonicalUrl);
  }
  
  // 5. Check if WP-Cron / Yoast sitemap generation works
  console.log('\n--- Yoast SEO options ---');
  const yoastOpts = await getAuth('https://jus-tice.co.il/wp-json/yoast/v1/get_head?url=https://jus-tice.co.il/');
  console.log('  Yoast REST status:', yoastOpts.status);
  if (yoastOpts.status === 200) {
    try {
      const y = JSON.parse(yoastOpts.body);
      console.log('  Yoast robots:', y.json?.robots);
    } catch(e) { console.log('  Body preview:', yoastOpts.body.substring(0, 300)); }
  }
}

main().catch(e => console.error('FATAL:', e));
