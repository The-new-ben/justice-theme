// Emergency site status check
const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 15000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    });
    req.on('error', e => resolve({ status: 'ERROR', error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT' }); });
  });
}

async function main() {
  console.log('=== EMERGENCY SITE STATUS CHECK ===\n');
  console.log('Time:', new Date().toISOString(), '\n');

  const urls = [
    'https://jus-tice.co.il/',
    'https://jus-tice.co.il/sitemap_index.xml',
    'https://jus-tice.co.il/sitemap.xml',
    'https://jus-tice.co.il/articles/lahav-433/',
    'https://jus-tice.co.il/lahav-433/',
    'https://jus-tice.co.il/wp-json/wp/v2/articles?per_page=1',
    'https://jus-tice.co.il/robots.txt',
  ];

  for (const url of urls) {
    const r = await get(url);
    const short = url.replace('https://jus-tice.co.il', '');
    if (r.status === 'ERROR' || r.status === 'TIMEOUT') {
      console.log(`🚨 ${r.status} ${short} — ${r.error || 'timed out'}`);
    } else {
      const title = r.body.match(/<title[^>]*>([^<]*)<\/title>/i);
      const isError = r.body.includes('Error') || r.body.includes('error') || r.body.includes('Fatal');
      console.log(`${r.status >= 500 ? '🚨' : r.status >= 400 ? '⚠️' : '✅'} ${r.status} ${short}${title ? ' — "' + title[1].substring(0,60) + '"' : ''}${isError ? ' [ERROR IN BODY]' : ''}`);
      if (r.status >= 500) {
        console.log('  Body preview:', r.body.substring(0, 300));
      }
    }
  }
}

main().catch(e => console.error('FATAL:', e));
