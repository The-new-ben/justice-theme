/**
 * Batch 51 — Criminal Raanana/Herzliya, RE/family Givatayim, RE Rishon LeZion
 */
const https = require('https');
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');
const H = {
  'Authorization': 'Basic ' + auth, 'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://jus-tice.co.il/wp-admin/post-new.php', 'X-Requested-With': 'XMLHttpRequest', 'Accept-Language': 'he-IL,he;q=0.9'
};

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const s = body ? JSON.stringify(body) : null;
    const opts = { hostname: 'jus-tice.co.il', port: 443, path, method, headers: Object.assign({}, H, s ? { 'Content-Length': Buffer.byteLength(s) } : {}) };
    const req = https.request(opts, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch (e) { resolve({ status: res.statusCode, body: d }); } }); });
    req.on('error', reject); if (s) req.write(s); req.end();
  });
}

async function upsert(slug, title, content, meta) {
  console.log(`\n>>> ${slug}`);
  const f = await api('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  const ex = Array.isArray(f.body) ? f.body[0] : null;
  const r = ex
    ? await api('POST', `/wp-json/wp/v2/pages/${ex.id}`, { title, content, status: 'publish', slug, meta })
    : await api('POST', '/wp-json/wp/v2/pages', { title, content, status: 'publish', slug, meta });
  console.log(`    ${ex ? 'UPDATED' : 'CREATED'} | HTTP ${r.status} | ID ${r.body && r.body.id} | ${r.body && r.body.link}`);
  return { slug, action: ex ? 'updated' : 'created', status: r.status, id: r.body && r.body.id };
}

async function main() {
  const results = [];

  // 1. CRIMINAL RAANANA
  results.push(await upsert('criminal-lawyer-raanana', 'עורך דין פלילי רעננה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי ברעננה מייצג בבית משפט השלום. רעננה — עיר יוקרתית עם אוכלוסייה אנגלית-אמריקאית — מאופיינת בתיקי תעבורה, עבירות עסקיות, ולפעמים תיקים של תיירים עם בעיות משפטיות.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי ברעננה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>רעננה</th><th>ת"א</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עסקי</td><td>6,000-25,000 ₪</td><td>8,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי רעננה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי רעננה: תעבורה 1.5K-6K, עסקי 6K-25K ₪. עיר יוקרתית, אנגלית. מדריך 2025.', pillar_keyword: 'עורך דין פלילי רעננה' }
  ));

  // 2. CRIMINAL HERZLIYA
  results.push(await upsert('criminal-lawyer-herzliya', 'עורך דין פלילי הרצליה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בהרצליה מייצג בבית משפט השלום. הרצליה — עיר הייטק ועסקים — מאופיינת בתיקי עבירות עסקיות, מס, ולפעמים תאונות דרכים בכביש 2.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי בהרצליה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>הרצליה</th><th>ת"א</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עסקי/כלכלי</td><td>7,000-30,000 ₪</td><td>8,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי הרצליה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי הרצליה: תעבורה 1.5K-6.5K, עסקי 7K-30K ₪. הייטק, כביש 2. מדריך 2025.', pillar_keyword: 'עורך דין פלילי הרצליה' }
  ));

  // 3. REAL ESTATE GIVATAYIM (small prestigious city next to TA)
  results.push(await upsert('real-estate-lawyer-givatayim', 'עורך דין מקרקעין גבעתיים | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בגבעתיים מטפל בשוק עיר יוקרה הצמודה לתל אביב — גבעתיים הקטנה (58,000 תושבים) עם צפיפות גבוהה ומחירי נדל"ן דומים לת"א. ביקוש גבוה, היצע נמוך.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בגבעתיים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>גבעתיים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>11,000-27,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין גבעתיים | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין גבעתיים: רכישה 11K-27K ₪. דומה לת"א, צפוף, יוקרה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין גבעתיים' }
  ));

  // 4. FAMILY LAW GIVATAYIM
  results.push(await upsert('family-law-givatayim', 'עורך דין משפחה גבעתיים | גירושין, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בגבעתיים מייצג בבית המשפט לענייני משפחה. גבעתיים — עיר חילונית עם משפחות מבוססות — מאופיינת בגירושין מורכבים עם נכסים רבים ועסקים.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה בגבעתיים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>גבעתיים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>6,000-16,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין מורכב (נכסים)</td><td>20,000-80,000 ₪</td><td>25,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה גבעתיים | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה גבעתיים: גירושין 6K-80K ₪. עיר חילונית יוקרתית, נכסים מורכבים. מדריך 2025.', pillar_keyword: 'עורך דין משפחה גבעתיים' }
  ));

  // 5. REAL ESTATE RISHON LEZION (4th largest city, big market)
  results.push(await upsert('real-estate-lawyer-rishon-lezion', 'עורך דין מקרקעין ראשון לציון | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בראשון לציון מטפל בשוק העיר הרביעית בגודלה בישראל — 270,000 תושבים עם שוק נדל"ן גדול ומגוון. מחירים נמוכים מת"א אך גוש דן ביקושי.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בראשון לציון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ראשון לציון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>8,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין ראשון לציון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין ראשון לציון: רכישה 8K-20K ₪. עיר #4 בישראל, 270K תושבים. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין ראשון לציון' }
  ));

  console.log('\n=== BATCH 51 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
