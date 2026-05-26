// Check what URLs the Yoast sitemap actually contains
const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== SITEMAP CONTENT AUDIT ===\n');

  // 1. Check sitemap_index.xml
  console.log('--- sitemap_index.xml ---');
  const idx = await get('https://jus-tice.co.il/sitemap_index.xml');
  console.log('Status:', idx.status);
  const sitemaps = idx.body.match(/<loc>([^<]*)<\/loc>/g) || [];
  console.log('Sub-sitemaps listed:');
  sitemaps.forEach(s => {
    const url = s.replace('<loc>', '').replace('</loc>', '');
    console.log(' ', url);
  });

  // 2. Check articles-sitemap.xml — first 10 URLs
  console.log('\n--- articles-sitemap.xml (first 20 URLs) ---');
  const arts = await get('https://jus-tice.co.il/articles-sitemap.xml');
  console.log('Status:', arts.status);
  const artUrls = arts.body.match(/<loc>([^<]*)<\/loc>/g) || [];
  console.log('Total URLs:', artUrls.length);
  artUrls.slice(0, 20).forEach(u => {
    const url = u.replace('<loc>', '').replace('</loc>', '');
    const hasArticles = url.includes('/articles/');
    console.log(' ', hasArticles ? '✅' : '🚨', url);
  });

  // 3. Check for articles-sitemap2.xml (pagination)
  console.log('\n--- articles-sitemap2.xml ---');
  const arts2 = await get('https://jus-tice.co.il/articles-sitemap2.xml');
  console.log('Status:', arts2.status);
  if (arts2.status === 200) {
    const art2Urls = arts2.body.match(/<loc>([^<]*)<\/loc>/g) || [];
    console.log('Total URLs:', art2Urls.length);
    art2Urls.slice(0, 5).forEach(u => {
      const url = u.replace('<loc>', '').replace('</loc>', '');
      console.log(' ', url.includes('/articles/') ? '✅' : '🚨', url);
    });
  }

  // 4. Check page-sitemap.xml
  console.log('\n--- page-sitemap.xml ---');
  const pages = await get('https://jus-tice.co.il/page-sitemap.xml');
  console.log('Status:', pages.status);
  const pageUrls = pages.body.match(/<loc>([^<]*)<\/loc>/g) || [];
  console.log('Total URLs:', pageUrls.length);
  pageUrls.slice(0, 10).forEach(u => {
    const url = u.replace('<loc>', '').replace('</loc>', '');
    console.log(' ', url);
  });

  // Count total articles across all sitemap pages
  let totalArticleUrls = artUrls.length;
  let withPrefix = artUrls.filter(u => u.includes('/articles/')).length;
  let withoutPrefix = artUrls.filter(u => !u.includes('/articles/')).length;
  
  // Check page 2
  if (arts2.status === 200) {
    const art2Urls = arts2.body.match(/<loc>([^<]*)<\/loc>/g) || [];
    totalArticleUrls += art2Urls.length;
    withPrefix += art2Urls.filter(u => u.includes('/articles/')).length;
    withoutPrefix += art2Urls.filter(u => !u.includes('/articles/')).length;
  }

  console.log('\n--- SUMMARY ---');
  console.log('Total article URLs in sitemap:', totalArticleUrls);
  console.log('With /articles/ prefix:', withPrefix);
  console.log('Without /articles/ prefix:', withoutPrefix, withoutPrefix > 0 ? '🚨 BROKEN!' : '✅ OK');
}

main().catch(e => console.error('FATAL:', e));
