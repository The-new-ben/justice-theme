const https = require('https');

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
  const auth = Buffer.from('benbatash:BynE nrDn 6boc xPSW JjLa K9C5').toString('base64');
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
  console.log('=== COMPREHENSIVE SEO DIAGNOSTICS ===\n');

  // 1. Check homepage for noindex
  console.log('--- 1. HOMEPAGE META TAGS ---');
  const home = await get('https://jus-tice.co.il/');
  const robotsMeta = home.body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const canonical = home.body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const yoast = home.body.includes('yoast') || home.body.includes('Yoast');
  const noindexCount = (home.body.match(/noindex/gi) || []).length;
  const xRobots = home.headers['x-robots-tag'] || 'none';
  console.log('  Robots meta:', robotsMeta ? robotsMeta[1] : 'NOT FOUND');
  console.log('  Canonical:', canonical ? canonical[1] : 'NOT FOUND');
  console.log('  X-Robots-Tag header:', xRobots);
  console.log('  Yoast detected:', yoast);
  console.log('  "noindex" occurrences in HTML:', noindexCount);

  // 2. Check sitemap URLs
  console.log('\n--- 2. SITEMAP STATUS ---');
  const sitemapUrls = [
    'https://jus-tice.co.il/sitemap.xml',
    'https://jus-tice.co.il/sitemap_index.xml',
    'https://jus-tice.co.il/wp-sitemap.xml',
    'https://jus-tice.co.il/post-sitemap.xml',
    'https://jus-tice.co.il/articles-sitemap.xml',
    'https://jus-tice.co.il/page-sitemap.xml',
  ];
  for (const url of sitemapUrls) {
    const r = await get(url);
    const hasXml = r.body.includes('<?xml') || r.body.includes('<urlset') || r.body.includes('<sitemapindex');
    console.log(' ', r.status, url.replace('https://jus-tice.co.il',''), hasXml ? '(valid XML)' : '(not XML)');
  }

  // 3. Check WP Reading settings (blog_public)
  console.log('\n--- 3. WP SETTINGS (blog_public = 0 means DISCOURAGE INDEXING) ---');
  try {
    const settings = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/settings');
    const j = JSON.parse(settings.body);
    console.log('  blog_public:', j.blog_public, j.blog_public === 0 ? '🚨 INDEXING DISCOURAGED!' : '✅ OK');
    console.log('  permalink_structure:', j.permalink_structure || 'not returned');
  } catch (e) {
    console.log('  Error fetching settings:', e.message);
    // Try option directly
    const opt = await getAuth('https://jus-tice.co.il/wp-json/');
    try {
      const j = JSON.parse(opt.body);
      console.log('  WP REST root reachable:', j.name || 'yes');
    } catch (e2) {
      console.log('  WP REST not reachable');
    }
  }

  // 4. Check a sample article for noindex
  console.log('\n--- 4. ARTICLE META TAGS (sample: /articles/lahav-433/) ---');
  const article = await get('https://jus-tice.co.il/articles/lahav-433/');
  const artRobots = article.body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const artCanonical = article.body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const artXRobots = article.headers['x-robots-tag'] || 'none';
  const artNoindex = (article.body.match(/noindex/gi) || []).length;
  console.log('  Status:', article.status);
  console.log('  Robots meta:', artRobots ? artRobots[1] : 'NOT FOUND');
  console.log('  Canonical:', artCanonical ? artCanonical[1] : 'NOT FOUND');
  console.log('  X-Robots-Tag header:', artXRobots);
  console.log('  "noindex" occurrences:', artNoindex);

  // 5. Check HTTP vs HTTPS
  console.log('\n--- 5. HTTP/HTTPS REDIRECT ---');
  const http = require('http');
  await new Promise((resolve) => {
    http.get('http://jus-tice.co.il/', r => {
      console.log('  http:// status:', r.statusCode, '-> ', r.headers.location || '(no redirect)');
      r.resume();
      resolve();
    }).on('error', e => { console.log('  http:// error:', e.message); resolve(); });
  });

  // 6. Check www vs non-www
  console.log('\n--- 6. WWW vs NON-WWW ---');
  try {
    const www = await get('https://www.jus-tice.co.il/');
    console.log('  www status:', www.status, www.headers.location ? '-> ' + www.headers.location : '');
  } catch (e) {
    console.log('  www:', e.message);
  }

  // 7. Check WP options via REST for blog_public specifically  
  console.log('\n--- 7. DIRECT OPTION CHECK ---');
  try {
    const optRes = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/settings');
    if (optRes.status === 200) {
      const data = JSON.parse(optRes.body);
      // Check all keys for anything indexing-related
      for (const [k,v] of Object.entries(data)) {
        if (k.includes('public') || k.includes('index') || k.includes('robot') || k.includes('blog')) {
          console.log(' ', k, '=', v);
        }
      }
    } else {
      console.log('  Settings endpoint returned:', optRes.status);
    }
  } catch(e) {
    console.log('  Error:', e.message);
  }

  // 8. Check multiple articles for noindex pattern
  console.log('\n--- 8. BATCH NOINDEX CHECK (10 articles) ---');
  const testSlugs = ['lahav-433','shoplifting','golden-visa','usa-lawyers','greece-lawyers',
    'immigration-lawyer','spain-lawyers','germany-lawyers','thailand-real-estate','extradition-guide'];
  for (const slug of testSlugs) {
    const r = await get('https://jus-tice.co.il/articles/' + slug + '/');
    const rm = r.body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ni = rm && rm[1].includes('noindex');
    console.log(' ', ni ? '🚨' : '✅', slug, ':', rm ? rm[1] : 'no robots meta', '| x-robots:', r.headers['x-robots-tag'] || 'none');
  }

  console.log('\n=== DIAGNOSTICS COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
