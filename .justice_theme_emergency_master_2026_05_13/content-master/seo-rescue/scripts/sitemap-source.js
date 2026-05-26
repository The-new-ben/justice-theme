// Determine which sitemap system is active: Yoast vs Custom REST
const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== WHICH SITEMAP SYSTEM IS ACTIVE? ===\n');

  // 1. Yoast-style sitemaps
  console.log('--- Yoast-style URLs ---');
  const yoastUrls = [
    '/sitemap_index.xml',
    '/sitemap.xml',
    '/articles-sitemap.xml',
    '/page-sitemap.xml',
  ];
  for (const u of yoastUrls) {
    const r = await get('https://jus-tice.co.il' + u);
    const isXml = r.body.includes('<?xml') || r.body.includes('<urlset') || r.body.includes('<sitemapindex');
    const hasYoast = r.body.includes('yoast') || r.body.includes('Yoast');
    console.log(`  ${r.status === 200 && isXml ? '✅' : '❌'} ${r.status} ${u} | XML:${isXml} | YoastBranded:${hasYoast}`);
    // Check first 200 chars of body
    if (r.status === 200 && isXml) {
      console.log('    First 300 chars:', r.body.substring(0, 300).replace(/\n/g, ' '));
    }
  }

  // 2. Custom REST-based sitemaps
  console.log('\n--- Custom REST URLs ---');
  const restUrls = [
    '/wp-json/justice/v1/sitemap',
    '/wp-json/justice/v1/sitemap/articles',
  ];
  for (const u of restUrls) {
    const r = await get('https://jus-tice.co.il' + u);
    const isXml = r.body.includes('<?xml') || r.body.includes('<urlset') || r.body.includes('<sitemapindex');
    console.log(`  ${r.status === 200 && isXml ? '✅' : '❌'} ${r.status} ${u} | XML:${isXml}`);
    if (r.status === 200 && isXml) {
      console.log('    First 300 chars:', r.body.substring(0, 300).replace(/\n/g, ' '));
    }
  }

  // 3. Check robots.txt to see which sitemap it points to
  console.log('\n--- robots.txt ---');
  const robots = await get('https://jus-tice.co.il/robots.txt');
  if (robots.status === 200) {
    const sitemapLines = robots.body.split('\n').filter(l => l.toLowerCase().includes('sitemap'));
    console.log('  Sitemap references:');
    sitemapLines.forEach(l => console.log('   ', l.trim()));
  }
}

main().catch(e => console.error('FATAL:', e));
