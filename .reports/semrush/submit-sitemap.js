/**
 * Sitemap submission helper
 * 1. Checks sitemap.xml accessibility + page count
 * 2. Pings Google
 */
const https = require('https');
const http = require('http');

function get(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === 'https:' ? https : http;
    lib.get(urlStr, { headers: {'User-Agent':'Mozilla/5.0 Googlebot/2.1'} }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({status: res.statusCode, data, headers: res.headers}));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== SITEMAP SUBMISSION HELPER ===\n');

  // 1. Check main sitemap
  try {
    const sm = await get('https://jus-tice.co.il/sitemap.xml');
    console.log(`sitemap.xml: HTTP ${sm.status} | ${sm.data.length} bytes`);
    if (sm.status === 200) {
      const sitemapCount = (sm.data.match(/<sitemap>/g) || []).length;
      const urlCount = (sm.data.match(/<url>/g) || []).length;
      console.log(`  → ${sitemapCount} sub-sitemaps, ${urlCount} direct URLs`);
    }
  } catch(e) { console.log('sitemap.xml error:', e.message); }

  // 2. Check page sitemap
  try {
    const ps = await get('https://jus-tice.co.il/page-sitemap.xml');
    console.log(`page-sitemap.xml: HTTP ${ps.status} | ${ps.data.length} bytes`);
    if (ps.status === 200) {
      const urlCount = (ps.data.match(/<url>/g) || []).length;
      console.log(`  → ${urlCount} page URLs in sitemap`);
    }
  } catch(e) { console.log('page-sitemap.xml error:', e.message); }

  // 3. Ping Google
  try {
    const ping = await get('https://www.google.com/ping?sitemap=https://jus-tice.co.il/sitemap.xml');
    console.log(`\nGoogle ping: HTTP ${ping.status}`);
    if (ping.status === 200 || ping.status === 302) {
      console.log('  → Google acknowledged sitemap ping!');
    } else {
      console.log(`  → Response: ${ping.data.substring(0, 200)}`);
    }
  } catch(e) { console.log('Google ping error:', e.message); }

  // 4. Ping Bing
  try {
    const bingPing = await get('https://www.bing.com/ping?sitemap=https://jus-tice.co.il/sitemap.xml');
    console.log(`Bing ping: HTTP ${bingPing.status}`);
  } catch(e) { console.log('Bing ping error:', e.message); }

  console.log('\n=== DONE ===');
}
main().catch(console.error);
