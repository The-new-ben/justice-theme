// Focused check: canonical mismatch, sitemap, and blog_public
const https = require('https');
const auth = Buffer.from('benbatash:BynE nrDn 6boc xPSW JjLa K9C5').toString('base64');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    }).on('error', reject);
  });
}

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
  // 1. Check if the emergency reset already ran (someone may have triggered it)
  console.log('=== FOCUSED CHECK ===\n');

  // 2. Check blog_public directly via wp-admin options page
  console.log('--- blog_public via options endpoint ---');
  // Use an alternative: check if the HTML contains "Discourage"
  const reading = await getAuth('https://jus-tice.co.il/wp-json/');
  try {
    const j = JSON.parse(reading.body);
    console.log('  Site name:', j.name);
    console.log('  WP version:', j.description ? 'yes' : 'unknown');
  } catch(e) {}

  // 3. Canonical check: exactly what Google sees for an article URL
  console.log('\n--- CANONICAL: What Google sees ---');
  const testPages = [
    { url: 'https://jus-tice.co.il/articles/lahav-433/', name: 'lahav-433' },
    { url: 'https://jus-tice.co.il/articles/shoplifting/', name: 'shoplifting' },
    { url: 'https://jus-tice.co.il/articles/golden-visa/', name: 'golden-visa' },
    { url: 'https://jus-tice.co.il/articles/greece-lawyers/', name: 'greece-lawyers' },
    { url: 'https://jus-tice.co.il/articles/usa-lawyers/', name: 'usa-lawyers' },
  ];

  for (const p of testPages) {
    const r = await get(p.url);
    // Extract ALL <link rel="canonical"> tags
    const canonicals = r.body.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi) || [];
    // Extract ALL meta robots
    const robotsMetas = r.body.match(/<meta[^>]*name=["']robots["'][^>]*>/gi) || [];
    
    const canonHref = r.body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    const hasArticlesPrefix = canonHref && canonHref[1].includes('/articles/');
    
    console.log(' ', hasArticlesPrefix ? '✅' : '🚨', p.name);
    console.log('    Status:', r.status);
    console.log('    Canonical tags found:', canonicals.length);
    canonicals.forEach((c, i) => {
      const href = c.match(/href=["']([^"']*)/);
      console.log('    Canon', i + 1, ':', href ? href[1] : c);
    });
    console.log('    Robots tags found:', robotsMetas.length);
    robotsMetas.forEach((m, i) => {
      const content = m.match(/content=["']([^"']*)/);
      console.log('    Robot', i + 1, ':', content ? content[1] : m);
    });
  }

  // 4. Check ALL sitemap variants more carefully
  console.log('\n--- SITEMAP STATUS (ALL VARIANTS) ---');
  const sitemaps = [
    '/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml',
    '/articles-sitemap.xml', '/post-sitemap.xml', '/page-sitemap.xml',
    '/category-sitemap.xml', '/practice-areas-sitemap.xml',
    '/author-sitemap.xml',
  ];
  for (const s of sitemaps) {
    const r = await get('https://jus-tice.co.il' + s);
    const hasXml = r.body.includes('<?xml') || r.body.includes('<urlset') || r.body.includes('<sitemapindex');
    const redirect = r.headers.location || '';
    console.log(' ', r.status === 200 && hasXml ? '✅' : '❌', r.status, s, redirect ? '-> ' + redirect : '', hasXml ? '(XML)' : '');
  }

  // 5. Check for "WP Sitemap Page" plugin conflict (it was in active plugins)
  console.log('\n--- WP SITEMAP PAGE PLUGIN ---');
  console.log('  This plugin (wp-sitemap-page) generates HTML sitemaps, NOT XML sitemaps.');
  console.log('  However, it might interfere with rewrite rules for /sitemap.xml.');
  
  // 6. Check if WordPress core sitemaps are also disabled
  console.log('\n--- WP CORE SITEMAP ---');
  const wpCore = await get('https://jus-tice.co.il/wp-sitemap.xml');
  console.log('  /wp-sitemap.xml status:', wpCore.status);
  if (wpCore.status === 200) {
    console.log('  WP Core sitemaps are working!');
    const urls = wpCore.body.match(/<loc>([^<]*)<\/loc>/g) || [];
    console.log('  Contains', urls.length, 'sitemap entries');
    urls.forEach(u => console.log('   ', u));
  }

  // 7. Check Yoast head API for articles specifically
  console.log('\n--- YOAST HEAD API FOR ARTICLE ---');
  const yHead = await get('https://jus-tice.co.il/wp-json/yoast/v1/get_head?url=' + encodeURIComponent('https://jus-tice.co.il/articles/lahav-433/'));
  if (yHead.status === 200) {
    try {
      const h = JSON.parse(yHead.body);
      console.log('  canonical:', h.json?.canonical);
      console.log('  og_url:', h.json?.og_url);
      console.log('  robots:', JSON.stringify(h.json?.robots));
    } catch(e) {
      console.log('  Parse error, body preview:', yHead.body.substring(0, 300));
    }
  } else {
    console.log('  Yoast HEAD API for article status:', yHead.status);
    console.log('  Body:', yHead.body.substring(0, 300));
  }

  console.log('\n=== FOCUSED CHECK COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
