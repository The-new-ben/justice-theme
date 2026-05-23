/**
 * Batch 52 — Criminal/family Rishon LeZion, RE Petah Tikva, RE/family Bat Yam
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

  // 1. CRIMINAL RISHON LEZION
  results.push(await upsert('criminal-lawyer-rishon-lezion', 'עורך דין פלילי ראשון לציון | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בראשון לציון מייצג בבית משפט השלום. ראשון לציון — עיר ענקית בגוש דן — מאופיינת בתיקי תעבורה, אלימות, וסמים. בית המשפט בראשון לציון עמוס מאוד.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי בראשון לציון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>ראשון לציון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,200-5,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי ראשון לציון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי ראשון לציון: תעבורה 1.2K-5.5K, אלימות 5K-22K ₪. עיר #4. מדריך 2025.', pillar_keyword: 'עורך דין פלילי ראשון לציון' }
  ));

  // 2. FAMILY LAW RISHON LEZION
  results.push(await upsert('family-law-rishon-lezion', 'עורך דין משפחה ראשון לציון | גירושין, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בראשון לציון מייצג בבית המשפט לענייני משפחה. ראשון לציון — עיר עם ~270,000 תושבים — מאופיינת בגירושין, מזונות ומשמורת. בית המשפט בראשון לציון אחד מהגדולים.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה בראשון לציון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ראשון לציון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,500-14,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-50,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה ראשון לציון | גירושין 2025 | Jus-Tice', seo_description: 'עורך דין משפחה ראשון לציון: גירושין 5.5K-50K ₪. 270K תושבים. מדריך 2025.', pillar_keyword: 'עורך דין משפחה ראשון לציון' }
  ));

  // 3. REAL ESTATE PETAH TIKVA (5th largest city)
  results.push(await upsert('real-estate-lawyer-petah-tikva', 'עורך דין מקרקעין פתח תקווה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בפתח תקווה מטפל בשוק העיר החמישית בגודלה — 280,000 תושבים. פתח תקווה "אם המושבות" עם שוק נדל"ן ותיק ומגוון, מחירים נמוכים מת"א.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בפתח תקווה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>פתח תקווה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>7,000-18,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין פתח תקווה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין פתח תקווה: רכישה 7K-18K ₪. אם המושבות, 280K תושבים, עיר #5. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין פתח תקווה' }
  ));

  // 4. REAL ESTATE BAT YAM (south Tel Aviv metro)
  results.push(await upsert('real-estate-lawyer-bat-yam', 'עורך דין מקרקעין בת ים | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בבת ים מטפל בשוק "הריביירה הישראלית" — בת ים עיר חוף עם נדל"ן שצמח בחדות בשנים האחרונות, פרויקטים רבים על קו הים.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בבת ים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בת ים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>8,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>דירת קו ים</td><td>14,000-35,000 ₪</td><td>20,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין בת ים | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין בת ים: רכישה 8K-20K, קו ים 14K-35K ₪. ריביירה ישראלית. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין בת ים' }
  ));

  // 5. FAMILY LAW BAT YAM
  results.push(await upsert('family-law-bat-yam', 'עורך דין משפחה בת ים | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בבת ים מייצג בבית המשפט לענייני משפחה. בת ים — עיר עם אוכלוסייה מגוונת ותעסוקה בגוש דן — מאופיינת בגירושין, מזונות, ומשמורת.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה בבת ים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בת ים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,000-13,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-48,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה בת ים | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה בת ים: גירושין 5K-48K ₪. ריביירה, גוש דן. מדריך 2025.', pillar_keyword: 'עורך דין משפחה בת ים' }
  ));

  console.log('\n=== BATCH 52 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
