/**
 * Batch 53 — Criminal Bat Yam, RE/family/criminal Modi'in, landlord obligations
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

  // 1. CRIMINAL BAT YAM
  results.push(await upsert('criminal-lawyer-bat-yam', 'עורך דין פלילי בת ים | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בבת ים מייצג בבית משפט השלום. בת ים — עיר חוף גדולה בגוש דן — מאופיינת בתיקי תעבורה, אלימות, וסמים. בית המשפט בבת ים משרת גם חלק מיפו.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי בבת ים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>בת ים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,200-5,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי בת ים | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי בת ים: תעבורה 1.2K-5.5K, אלימות 5K-22K ₪. גוש דן, ריביירה. מדריך 2025.', pillar_keyword: 'עורך דין פלילי בת ים' }
  ));

  // 2. REAL ESTATE MODIIN (planned city, young families, high demand)
  results.push(await upsert('real-estate-lawyer-modiin', 'עורך דין מקרקעין מודיעין | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין במודיעין מטפל בשוק עיר הצעירה ביותר בישראל — מודיעין תוכננה מאפס, בנויה לצעירים עם משפחות, ושוק הנדל"ן בה פעיל מאוד עם ביקוש גבוה.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין במודיעין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מודיעין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>8,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין מודיעין | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין מודיעין: רכישה 8K-20K ₪. עיר תכנונית, צעירים, ביקוש גבוה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין מודיעין' }
  ));

  // 3. FAMILY LAW MODIIN
  results.push(await upsert('family-law-modiin', 'עורך דין משפחה מודיעין | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה במודיעין מייצג בבית המשפט לענייני משפחה. מודיעין — עיר צעירים עם משפחות — מאופיינת בגירושין של זוגות צעירים עם ילדים קטנים ומשמורת.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה במודיעין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מודיעין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,000-13,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-48,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה מודיעין | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה מודיעין: גירושין 5K-48K ₪. עיר צעירים, ילדים קטנים. מדריך 2025.', pillar_keyword: 'עורך דין משפחה מודיעין' }
  ));

  // 4. CRIMINAL MODIIN
  results.push(await upsert('criminal-lawyer-modiin', 'עורך דין פלילי מודיעין | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי במודיעין מייצג בבית משפט השלום. מודיעין — עיר צעירה ובטוחה יחסית — מאופיינת בתיקי תעבורה ועבירות קל. אחוז פשיעה נמוך ביחס לגודל העיר.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי במודיעין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>מודיעין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עבירות קל</td><td>3,000-12,000 ₪</td><td>5,000-18,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי מודיעין | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי מודיעין: תעבורה 1K-5K, עבירות קל 3K-12K ₪. עיר בטוחה, פשיעה נמוכה. מדריך 2025.', pillar_keyword: 'עורך דין פלילי מודיעין' }
  ));

  // 5. LANDLORD OBLIGATIONS ISRAEL (comprehensive, high-search intent)
  results.push(await upsert('landlord-obligations-israel', 'חובות משכיר בישראל | תחזוקה, ביטוח, זכויות | Jus-Tice',
    `<!-- wp:paragraph --><p>משכיר דירה בישראל מחויב בחוקים שלעיתים אינו מודע להם. חוק השכירות והשאילה (תשל"א-1971) וחוק ההגנה על הדייר קובעים חובות ברורות. אי-מילוי — תביעה של השוכר ופיצויים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>חובות המשכיר לפי חוק</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>מסירת הנכס במצב ראוי למגורים</li>
<li>תיקון תקלות מהותיות (אינסטלציה, חשמל, גג)</li>
<li>ביטוח מבנה (המשכיר, לא השוכר)</li>
<li>אי-הפרעה לשוכר (לא להיכנס ללא הסכמה)</li>
<li>העברת כל ציוד שהובטח בחוזה</li>
<li>הסדרת ארנונה (אלא אם הוסכם אחרת)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם משכיר חייב לתקן תקלות מהר?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — תקלה מהותית (מים, חשמל, גז) חייבת תיקון מיידי. שאר תקלות — תוך זמן סביר. שוכר שמתקן על חשבונו בגלל אי-היענות משכיר — יכול לנכות מהשכירות (בהסכמה + קבלות). בית משפט בדרך כלל תומך בשוכר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: חוק השכירות והשאילה, פסיקת בתי משפט 2024. | <a href="/tenant-rights-israel/">זכויות שוכר</a> | <a href="/landlord-rights-israel/">זכויות משכיר</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'חובות משכיר בישראל | תחזוקה, ביטוח, זכויות | Jus-Tice',
      seo_description: '6 חובות משכיר בחוק. תקלה מהותית = תיקון מיידי. שוכר יכול לנכות מהשכירות. ביטוח מבנה = על המשכיר. 2025.',
      pillar_keyword: 'חובות משכיר', secondary_keywords: 'חובות בעל הדירה,תיקונים בדירה שכורה,משכיר חוק'
    }
  ));

  console.log('\n=== BATCH 53 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
