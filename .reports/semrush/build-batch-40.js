/**
 * Batch 40 — Copyright software, RE Holon, family Rosh HaAyin, tax evasion defense, criminal Bnei Brak
 */
const https = require('https');
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');
const H = { 'Authorization':'Basic '+auth,'Content-Type':'application/json','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36','Referer':'https://jus-tice.co.il/wp-admin/post-new.php','X-Requested-With':'XMLHttpRequest','Accept-Language':'he-IL,he;q=0.9' };

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const s = body ? JSON.stringify(body) : null;
    const opts = { hostname:'jus-tice.co.il', port:443, path, method, headers:Object.assign({}, H, s?{'Content-Length':Buffer.byteLength(s)}:{}) };
    const req = https.request(opts, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve({status:res.statusCode,body:JSON.parse(d)})}catch(e){resolve({status:res.statusCode,body:d})} }); });
    req.on('error', reject); if(s) req.write(s); req.end();
  });
}

async function upsert(slug, title, content, meta) {
  console.log(`\n>>> ${slug}`);
  const f = await api('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  const ex = Array.isArray(f.body) ? f.body[0] : null;
  const r = ex ? await api('POST', `/wp-json/wp/v2/pages/${ex.id}`, {title,content,status:'publish',slug,meta})
                : await api('POST', '/wp-json/wp/v2/pages', {title,content,status:'publish',slug,meta});
  console.log(`    ${ex?'UPDATED':'CREATED'} | HTTP ${r.status} | ID ${r.body&&r.body.id} | ${r.body&&r.body.link}`);
  return {slug, action:ex?'updated':'created', status:r.status, id:r.body&&r.body.id};
}

async function main() {
  const results = [];

  // 1. COPYRIGHT SOFTWARE ISRAEL
  results.push(await upsert('copyright-software-israel', 'זכויות יוצרים בתוכנה | קוד, API, הגנה | Jus-Tice',
    `<!-- wp:paragraph --><p>תוכנה מוגנת בישראל כיצירה ספרותית תחת חוק זכות יוצרים, תשס"ח-2007. הגנה: 70 שנה מיום הפרסום. ישראל בעלת תעשיית הייטק גדולה — הגנת קוד ו-IP היא עניין אסטרטגי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מוגן ומה לא</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>הגנה</th></tr></thead><tbody>
<tr><td>קוד מקור (source code)</td><td>כן — זכות יוצרים</td></tr>
<tr><td>אלגוריתם (רעיון)</td><td>לא — רק פטנט</td></tr>
<tr><td>ממשק API (structure)</td><td>שנוי במחלוקת</td></tr>
<tr><td>שם המוצר</td><td>סימן מסחרי</td></tr>
<tr><td>פרוטוקול רשת</td><td>לא — רק מימוש ספציפי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם קוד open source מוגן?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — קוד פתוח מוגן בזכות יוצרים. הרישיון (MIT, GPL, Apache) קובע מה מותר לעשות איתו. שימוש בקוד GPL בלי שחרור קוד = הפרה. שימוש בקוד MIT = מותר כמעט הכל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/intellectual-property-israel/">מדריך קניין רוחני</a> | <a href="/patent-registration-israel/">פטנט</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות יוצרים בתוכנה | קוד, API, הגנה | Jus-Tice', seo_description: 'קוד מקור = הגן. אלגוריתם = לא (רק פטנט). GPL הפרה: שחרור קוד. MIT: חופשי. 5 רכיבים בטבלה. מדריך 2025.', pillar_keyword: 'זכויות יוצרים תוכנה', secondary_keywords: 'הגנת קוד,IP תוכנה,open source זכויות' }
  ));

  // 2. REAL ESTATE HOLON
  results.push(await upsert('real-estate-lawyer-holon', 'עורך דין מקרקעין חולון | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בחולון מטפל בשוק עיר הגבולות של גוש דן הדרומי — חולון שוכנת בין ת"א לבת ים, עם נדל"ן ביקושי גבוה יחסית לפריפריה ופרויקטי פינוי-בינוי נרחבים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בחולון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>חולון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>7,000-16,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין חולון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין חולון: רכישה 7K-16K ₪. גוש דן דרום, פינוי-בינוי. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין חולון' }
  ));

  // 3. FAMILY LAW ROSH HAAYIN
  results.push(await upsert('family-law-rosh-haayin', 'עורך דין משפחה ראש העין | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בראש העין מייצג בבית המשפט לענייני משפחה. ראש העין — עיר עם אוכלוסייה מגוונת כולל קהילות עולים — מאופיינת בתיקי גירושין, משמורת, ומזונות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בראש העין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ראש העין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,500-12,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-45,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה ראש העין | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה ראש העין: גירושין 4.5K-45K ₪. עיר מגוונת, עולים. מדריך 2025.', pillar_keyword: 'עורך דין משפחה ראש העין' }
  ));

  // 4. TAX EVASION DEFENSE (criminal + tax crossover)
  results.push(await upsert('tax-evasion-defense', 'הגנה בעבירת מס | חקירת מס הכנסה, עונשים | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירת מס בישראל היא עבירה פלילית — לא רק אזרחית. חקירה ע"י יחידת המודיעין של רשות המיסים, חקירה ע"י מס הכנסה עצמה, או בגלל תלונה. אי-דיווח על הכנסות: עד 7 שנות מאסר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עבירות מס נפוצות ועונשיהן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>עונש מקסימלי</th></tr></thead><tbody>
<tr><td>אי-דיווח על הכנסה</td><td>5 שנות מאסר</td></tr>
<tr><td>הגשת דוח כוזב</td><td>7 שנות מאסר</td></tr>
<tr><td>הפקת חשבוניות פיקטיביות</td><td>7 שנות מאסר</td></tr>
<tr><td>אי-תשלום ניכוי במקור</td><td>5 שנות מאסר</td></tr>
<tr><td>מס קנס + ריבית</td><td>עד 100% מהסכום</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם מס הכנסה מזמין לחקירה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) שתוק — אל תגיד כלום לפני שתדבר עם עורך דין. 2) הזכות לייצוג קיימת. 3) חקירה יכולה להסתיים ב: סגירת תיק, כופר (תשלום), או כתב אישום. 4) הסדר כופר עדיף על משפט פלילי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/tax-lawyer-israel/">מדריך עורך דין מיסים</a> | <a href="/criminal-defense-attorney/">משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגנה בעבירת מס | חקירת מס הכנסה, עונשים | Jus-Tice', seo_description: 'עבירת מס: 5-7 שנות מאסר. חשבוניות פיקטיביות, אי-דיווח. חקירה: שתוק + עורך דין. כופר > משפט. מדריך.', pillar_keyword: 'עבירת מס', secondary_keywords: 'חקירת מס הכנסה,הגנה עבירת מס,כופר מס' }
  ));

  // 5. CRIMINAL BNEI BRAK (ultra-orthodox city)
  results.push(await upsert('criminal-lawyer-bnei-brak', 'עורך דין פלילי בני ברק | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בבני ברק מייצג בבית משפט השלום. בני ברק — עיר חרדית הגדולה בישראל — מאופיינת בתיקי תעבורה, עבירות עסקיות, ולעיתים תיקים הקשורים לקהילה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בבני ברק</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>בני ברק</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עבירה כלכלית</td><td>5,000-25,000 ₪</td><td>8,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי בני ברק | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי בני ברק: תעבורה 1K-5K, עסקי 5K-25K ₪. עיר חרדית. מדריך 2025.', pillar_keyword: 'עורך דין פלילי בני ברק' }
  ));

  console.log('\n=== BATCH 40 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
