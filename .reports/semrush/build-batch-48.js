/**
 * Batch 48 — Criminal/RE/Family Tiberias, military defense, property tax arnona
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

  // 1. CRIMINAL TIBERIAS
  results.push(await upsert('criminal-lawyer-tiberias', 'עורך דין פלילי טבריה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בטבריה מייצג בבית משפט השלום. טבריה — עיר ים כנרת מעורבת — מאופיינת בתיקי תעבורה, אלימות, וסמים. בית המשפט משרת את אזור הגליל התחתון.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי בטבריה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>טבריה</th><th>חיפה</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>900-4,500 ₪</td><td>1,500-7,000 ₪</td></tr>
<tr><td>אלימות</td><td>4,500-18,000 ₪</td><td>7,000-28,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי טבריה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי טבריה: תעבורה 900-4.5K, אלימות 4.5K-18K ₪. ים כנרת. מדריך 2025.', pillar_keyword: 'עורך דין פלילי טבריה' }
  ));

  // 2. REAL ESTATE TIBERIAS
  results.push(await upsert('real-estate-lawyer-tiberias', 'עורך דין מקרקעין טבריה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בטבריה מטפל בשוק ים כנרת — עיר תיירות ויהדות עם נדל"ן ייחודי: בתי קיץ, נכסי תיירות, ומלונות. מחירים נמוכים יחסית לגוש דן.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בטבריה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>טבריה</th><th>חיפה</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>4,000-10,000 ₪</td><td>6,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין טבריה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין טבריה: רכישה 4K-10K ₪. ים כנרת, תיירות, בתי קיץ. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין טבריה' }
  ));

  // 3. FAMILY TIBERIAS
  results.push(await upsert('family-law-tiberias', 'עורך דין משפחה טבריה | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בטבריה מייצג בבית המשפט לענייני משפחה. טבריה — עיר מעורבת — מאופיינת בתיקי גירושין, ולפעמים בסוגיות של יהדות ופרסונל סטטוס.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה בטבריה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>טבריה</th><th>חיפה</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>3,500-9,500 ₪</td><td>5,000-14,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>9,000-36,000 ₪</td><td>12,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה טבריה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה טבריה: גירושין 3.5K-36K ₪. ים כנרת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה טבריה' }
  ));

  // 4. MILITARY CRIMINAL DEFENSE
  results.push(await upsert('military-criminal-defense', 'עבירה צבאית — הגנה | בית דין צבאי, עונשים | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירות צבאיות בישראל נדונות בבית הדין הצבאי — מערכת שיפוטית נפרדת. כ-3,000-5,000 תיקים פליליים צבאיים נפתחים בשנה. עורך דין צבאי פרטי (לא סניגור צבאי) יכול לייצג חייל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עבירות צבאיות נפוצות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>עונש מקסימלי</th></tr></thead><tbody>
<tr><td>היעדרות ללא רשות (סרבנות)</td><td>3 שנות מאסר</td></tr>
<tr><td>עזיבת שמירה</td><td>3 שנות מאסר</td></tr>
<tr><td>אי-ציות לפקודה</td><td>2 שנות מאסר</td></tr>
<tr><td>תקיפת קצין</td><td>10 שנות מאסר</td></tr>
<tr><td>גניבת נשק</td><td>7 שנות מאסר</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם עורך דין אזרחי יכול לייצג בבית דין צבאי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — עורך דין פרטי (אזרחי) יכול לייצג חייל בבית הדין הצבאי. לרוב עדיף על הסניגור הצבאי בתיקים חמורים. עלות: 10,000-40,000 ₪ לפי מורכבות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'עבירה צבאית — הגנה | בית דין צבאי, עונשים | Jus-Tice',
      seo_description: '3-5K תיקים/שנה. סרבנות: 3 שנים. תקיפת קצין: 10 שנים. עו"ד אזרחי = מותר + עדיף. 10K-40K ₪. 2025.',
      pillar_keyword: 'עבירה צבאית', secondary_keywords: 'בית דין צבאי,עורך דין צבאי,סרבנות צבאי'
    }
  ));

  // 5. PROPERTY TAX ARNONA ISRAEL
  results.push(await upsert('property-tax-arnona-israel', 'ארנונה בישראל | חישוב, פטורים, ערעור | Jus-Tice',
    `<!-- wp:paragraph --><p>ארנונה היא מס מוניציפלי — כל בעל נכס (דירה, עסק) חייב בו. שיעורי הארנונה קבועים ע"י כל עירייה בנפרד. כ-30 מיליארד ₪ מגבות הרשויות בשנה. ישנם פטורים רבים — שלא כולם מודעים אליהם.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי זכאי להנחה/פטור בארנונה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>קשישים מעל 70 (הנחה של 33-100%)</li>
<li>נכים בדרגה מסוימת (30-100%)</li>
<li>חד-הוריים (הנחות משמעותיות)</li>
<li>מקבלי קצבת ביטוח לאומי נמוכה</li>
<li>נכסים ריקים (לרוב 1/3 עד 1/2)</li>
<li>עמותות ומוסדות מוכרים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כיצד מערערים על ארנונה גבוהה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) בקש השגה ממחלקת הארנונה של העירייה (תוך 90 יום). 2) אם נדחה — ערר לוועדת ערר (תוך 30 יום). 3) ערעור לבית משפט מינהלי. רוב העוררים (40-60%) מצליחים בהשגה הראשונה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: הסתדרות המעוף, נתוני ארנונה 2024. | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'ארנונה בישראל | חישוב, פטורים, ערעור | Jus-Tice',
      seo_description: '30 מיליארד ₪/שנה. 6 קבוצות פטור. קשיש 70+: 33-100%. ערעור: 40-60% מצליחים. 90 יום להשגה. 2025.',
      pillar_keyword: 'ארנונה ישראל', secondary_keywords: 'ארנונה פטור,ערר ארנונה,חישוב ארנונה'
    }
  ));

  console.log('\n=== BATCH 48 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
