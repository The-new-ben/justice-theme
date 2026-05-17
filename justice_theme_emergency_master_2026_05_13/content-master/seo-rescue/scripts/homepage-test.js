// Reproduce the intermittent homepage noindex issue
// Hit the homepage 20 times rapidly and check each response
const https = require('https');

function get(url, id) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const title = d.match(/<title[^>]*>([^<]*)<\/title>/i);
        const robotsMeta = d.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
        const seoedge = res.headers['x-cached-engine-header'] || 'none';
        const isNotFound = title && title[1].includes('not found');
        const isNoindex = robotsMeta && robotsMeta[1].includes('noindex');
        const deployMarker = d.match(/justice-deployment-marker.*?content=["']([^"']*)/i);
        resolve({
          id, status: res.statusCode,
          title: title ? title[1].substring(0, 80) : 'NO TITLE',
          robots: robotsMeta ? robotsMeta[1] : 'NO ROBOTS META',
          seoedge,
          isNotFound: !!isNotFound,
          isNoindex: !!isNoindex,
          marker: deployMarker ? deployMarker[1] : 'none',
          bodyLen: d.length,
        });
      });
    }).on('error', e => reject(e));
  });
}

async function main() {
  console.log('=== HOMEPAGE INTERMITTENT NOINDEX TEST (20 requests) ===\n');
  console.log('Using Googlebot User-Agent to simulate what Google sees.\n');

  let bad = 0;
  let good = 0;

  for (let i = 1; i <= 20; i++) {
    const r = await get('https://jus-tice.co.il/', i);
    const icon = r.isNotFound || r.isNoindex ? '🚨' : '✅';
    if (r.isNotFound || r.isNoindex) bad++; else good++;
    console.log(`${icon} #${i}: ${r.status} | "${r.title}" | robots=${r.robots} | seoedge=${r.seoedge} | body=${r.bodyLen}b`);
  }

  console.log(`\n=== RESULT: ${good} good, ${bad} BAD (noindex/not-found) out of 20 ===`);
  if (bad > 0) {
    console.log('🚨 CONFIRMED: Homepage is intermittently serving noindex/not-found!');
  } else {
    console.log('✅ All 20 requests returned correct homepage.');
  }

  // Also test with regular UA
  console.log('\n--- Now testing with regular browser UA (5 requests) ---');
  for (let i = 1; i <= 5; i++) {
    const r = await new Promise((resolve, reject) => {
      https.get('https://jus-tice.co.il/', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          const title = d.match(/<title[^>]*>([^<]*)<\/title>/i);
          const robots = d.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
          resolve({ title: title?.[1]?.substring(0,80), robots: robots?.[1], status: res.statusCode });
        });
      }).on('error', reject);
    });
    const isNoindex = r.robots && r.robots.includes('noindex');
    const isNotFound = r.title && r.title.includes('not found');
    console.log(`${isNoindex || isNotFound ? '🚨' : '✅'} #${i}: ${r.status} | "${r.title}" | robots=${r.robots}`);
  }
}

main().catch(e => console.error('FATAL:', e));
