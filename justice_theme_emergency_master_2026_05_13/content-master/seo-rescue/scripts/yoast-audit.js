// Deep audit of current Yoast configuration via REST API and direct option reads
const https = require('https');
const auth = Buffer.from('benbatash:BynE nrDn 6boc xPSW JjLa K9C5').toString('base64');

function getAuth(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Authorization': 'Basic ' + auth }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: d }));
    }).on('error', reject);
  });
}

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

async function main() {
  console.log('=== DEEP YOAST CONFIGURATION AUDIT ===\n');

  // 1. Yoast version
  console.log('--- 1. YOAST VERSION & STATUS ---');
  const plugins = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/plugins');
  if (plugins.status === 200) {
    const plist = JSON.parse(plugins.body);
    const yoast = plist.find(p => p.plugin && p.plugin.includes('wordpress-seo'));
    if (yoast) {
      console.log('  Plugin:', yoast.plugin);
      console.log('  Name:', yoast.name);
      console.log('  Version:', yoast.version);
      console.log('  Status:', yoast.status);
    } else {
      console.log('  ⚠ Yoast SEO plugin NOT FOUND in plugin list!');
      console.log('  Looking for any SEO plugin...');
      plist.filter(p => p.status === 'active').forEach(p => {
        if (p.name && (p.name.toLowerCase().includes('seo') || p.name.toLowerCase().includes('yoast')))
          console.log('  Found:', p.name, p.version, p.plugin);
      });
    }
  }

  // 2. Yoast REST API head endpoint
  console.log('\n--- 2. YOAST HEAD API ---');
  const headHome = await get('https://jus-tice.co.il/wp-json/yoast/v1/get_head?url=https://jus-tice.co.il/');
  if (headHome.status === 200) {
    const h = JSON.parse(headHome.body);
    console.log('  Homepage robots:', JSON.stringify(h.json?.robots));
    console.log('  Homepage canonical:', h.json?.canonical);
    console.log('  Homepage og_url:', h.json?.og_url);
    console.log('  Homepage schema present:', !!h.json?.schema);
  } else {
    console.log('  Yoast HEAD API status:', headHome.status);
  }

  // 3. Test canonical on an article via Yoast HEAD API
  console.log('\n--- 3. YOAST HEAD API FOR ARTICLES ---');
  const testUrls = [
    'https://jus-tice.co.il/articles/lahav-433/',
    'https://jus-tice.co.il/articles/shoplifting/',
    'https://jus-tice.co.il/articles/golden-visa/',
  ];
  for (const url of testUrls) {
    const r = await get('https://jus-tice.co.il/wp-json/yoast/v1/get_head?url=' + encodeURIComponent(url));
    if (r.status === 200) {
      const h = JSON.parse(r.body);
      const slug = url.replace('https://jus-tice.co.il/articles/', '').replace('/', '');
      const canonicalCorrect = h.json?.canonical === url;
      console.log(' ', canonicalCorrect ? '✅' : '🚨', slug);
      console.log('    Canonical:', h.json?.canonical);
      console.log('    OG URL:', h.json?.og_url);
      console.log('    Robots:', JSON.stringify(h.json?.robots));
    }
  }

  // 4. Check the WP option for blog_public (discourage indexing)
  console.log('\n--- 4. BLOG_PUBLIC CHECK ---');
  // The /wp-json/wp/v2/settings endpoint should include this
  const settings = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/settings');
  if (settings.status === 200) {
    const s = JSON.parse(settings.body);
    console.log('  All settings keys:', Object.keys(s).join(', '));
    // Some specific checks
    if ('blog_public' in s) {
      console.log('  blog_public:', s.blog_public, s.blog_public === '0' || s.blog_public === 0 ? '🚨 DISCOURAGED!' : '✅ OK');
    }
  }

  // 5. Check for XML sitemap via Yoast's own endpoint
  console.log('\n--- 5. SITEMAP DETAILED CHECK ---');
  // Follow the redirect from /sitemap.xml
  const sm1 = await get('https://jus-tice.co.il/sitemap.xml');
  console.log('  /sitemap.xml status:', sm1.status);
  if (sm1.status === 301 || sm1.status === 302) {
    console.log('  Redirects to:', sm1.headers.location);
    if (sm1.headers.location) {
      const sm2 = await get(sm1.headers.location);
      console.log('  Target status:', sm2.status);
      console.log('  Target has XML:', sm2.body.includes('<?xml') || sm2.body.includes('<urlset'));
      if (sm2.body.length < 1000) console.log('  Target body:', sm2.body.substring(0, 500));
    }
  }

  // 6. Check Yoast options via an undocumented endpoint or via options API
  console.log('\n--- 6. YOAST WPSEO OPTIONS ---');
  // Try the Yoast configuration endpoint
  const yoastConfig = await getAuth('https://jus-tice.co.il/wp-json/yoast/v1/configuration');
  console.log('  /yoast/v1/configuration status:', yoastConfig.status);

  // 7. Check AMP plugin conflict
  console.log('\n--- 7. CONFLICTING PLUGINS ---');
  if (plugins.status === 200) {
    const plist = JSON.parse(plugins.body);
    const conflicting = ['amp', 'all-in-one-seo', 'rank-math', 'schema', 'sitemap', 'redirect'];
    plist.filter(p => p.status === 'active').forEach(p => {
      const name = (p.name || '').toLowerCase();
      const slug = (p.plugin || '').toLowerCase();
      if (conflicting.some(c => name.includes(c) || slug.includes(c))) {
        console.log('  ⚠ Potential conflict:', p.name, '(' + p.plugin + ')');
      }
    });
  }

  // 8. Full canonical check on 20 articles
  console.log('\n--- 8. FULL CANONICAL AUDIT (20 articles) ---');
  const articles = await getAuth('https://jus-tice.co.il/wp-json/wp/v2/articles?per_page=20&_fields=id,slug,link');
  if (articles.status === 200) {
    const arts = JSON.parse(articles.body);
    let mismatched = 0;
    let correct = 0;
    for (const art of arts) {
      const page = await get(art.link);
      const canon = page.body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
      if (canon) {
        if (canon[1] !== art.link) {
          mismatched++;
          if (mismatched <= 5) {
            console.log('  🚨', art.slug);
            console.log('    WP link:', art.link);
            console.log('    Canon:  ', canon[1]);
          }
        } else {
          correct++;
        }
      }
    }
    console.log('  Correct:', correct, '| Mismatched:', mismatched, '(of', arts.length, ')');
  }

  console.log('\n=== AUDIT COMPLETE ===');
}

main().catch(e => console.error('FATAL:', e));
