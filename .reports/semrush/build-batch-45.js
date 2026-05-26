/**
 * Batch 45 — Legal aid, RE Migdal HaEmek, family Carmiel, sexual offense victim rights, court appeal
 */
const https = require('https');
const fs = require('fs');
const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');
const H = {
  'Authorization': 'Basic ' + auth,
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Referer': 'https://jus-tice.co.il/wp-admin/post-new.php',
  'X-Requested-With': 'XMLHttpRequest',
  'Accept-Language': 'he-IL,he;q=0.9'
};

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const s = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method,
      headers: Object.assign({}, H, s ? { 'Content-Length': Buffer.byteLength(s) } : {})
    };
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch (e) { resolve({ status: res.statusCode, body: d }); } });
    });
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

  // 1. LEGAL AID ISRAEL (free legal help)
  results.push(await upsert('legal-aid-israel', 'סיוע משפטי חינם בישראל | מי זכאי, איך מגישים | Jus-Tice',
    `<!-- wp:paragraph --><p>מינהל הסיוע המשפטי (משרד המשפטים) מעניק ייצוג חינם לאנשים שאינם יכולים לממן עורך דין. כ-60,000-80,000 פניות מוגשות בשנה. הסיוע מכסה: פלילי, אזרחי, ומשפחה — בתנאים מסוימים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי זכאי לסיוע משפטי?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>תנאי הכנסה</th><th>כיסוי</th></tr></thead><tbody>
<tr><td>פלילי (חובה)</td><td>ללא תנאי הכנסה (חמורות)</td><td>מלא</td></tr>
<tr><td>אזרחי</td><td>עד 6,000 ₪/חודש (יחיד)</td><td>חלקי</td></tr>
<tr><td>משפחה</td><td>עד 8,000 ₪/חודש (משפחה)</td><td>חלקי</td></tr>
<tr><td>מקרקעין</td><td>מוגבל מאוד</td><td>מינימלי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לקבל עורך דין מסיוע משפטי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תיקים פליליים דחופים: 24-48 שעות. תיקים אזרחיים: 2-6 שבועות. תיקי משפחה: 1-4 שבועות. שורת ההמתנה ארוכה — כדאי לבדוק גם אגודות משפטיות ומרפאות קלינית.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: מינהל הסיוע המשפטי, משרד המשפטים ישראל. | <a href="/criminal-defense-attorney/">משפט פלילי</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'סיוע משפטי חינם בישראל | מי זכאי, איך מגישים | Jus-Tice',
      seo_description: '60-80K פניות/שנה. פלילי: ללא תנאי. אזרחי: עד 6K₪/חודש. משפחה: עד 8K₪. 24-48 שעות דחוף. 2025.',
      pillar_keyword: 'סיוע משפטי חינם', secondary_keywords: 'סיוע משפטי ישראל,ייצוג חינם עורך דין,מינהל סיוע משפטי'
    }
  ));

  // 2. REAL ESTATE MIGDAL HAEMEK (north development town)
  results.push(await upsert('real-estate-lawyer-migdal-haemek', 'עורך דין מקרקעין מגדל העמק | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין במגדל העמק מטפל בשוק עיר הפיתוח הצפונית — מגדל העמק מציעה נדל"ן בזול מהרגיל בצפון, עם פרויקטים חדשים של התחדשות עירונית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין במגדל העמק</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מגדל העמק</th><th>חיפה</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>3,000-8,000 ₪</td><td>6,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'עורך דין מקרקעין מגדל העמק | מחירים 2025 | Jus-Tice',
      seo_description: 'עורך דין מקרקעין מגדל העמק: רכישה 3K-8K ₪. עיר פיתוח צפון, התחדשות עירונית. מדריך 2025.',
      pillar_keyword: 'עורך דין מקרקעין מגדל העמק'
    }
  ));

  // 3. FAMILY LAW CARMIEL
  results.push(await upsert('family-law-carmiel', 'עורך דין משפחה כרמיאל | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בכרמיאל מייצג בבית המשפט לענייני משפחה. כרמיאל — עיר גלילית עם אוכלוסייה יהודית מגוונת — מאופיינת בתיקי גירושין ומשמורת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בכרמיאל</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>כרמיאל</th><th>חיפה</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>3,500-9,000 ₪</td><td>5,000-14,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>8,000-35,000 ₪</td><td>12,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'עורך דין משפחה כרמיאל | גירושין, מזונות 2025 | Jus-Tice',
      seo_description: 'עורך דין משפחה כרמיאל: גירושין 3.5K-35K ₪. גליל. מדריך 2025.',
      pillar_keyword: 'עורך דין משפחה כרמיאל'
    }
  ));

  // 4. SEXUAL OFFENSE VICTIM RIGHTS
  results.push(await upsert('sexual-offense-victim', 'קורבן עבירת מין | זכויות, תמיכה, תלונה | Jus-Tice',
    `<!-- wp:paragraph --><p>קורבן עבירת מין בישראל זכאי למגוון הגנות חוקיות ותמיכה מדינתית. חוק זכויות נפגעי עבירה (תשס"א-2001) מעניק זכויות מפורשות. כ-7,000-9,000 תלונות מין מוגשות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות קורבן עבירת מין</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>זכות לאנונימיות מלאה (שם לא יפורסם)</li>
<li>זכות לבדיקה רפואית חינם (ללא הגשת תלונה)</li>
<li>זכות לעו"ד ציבורי מטעם המדינה בחינם</li>
<li>זכות לבדיקה ע"י חוקרת מין (ולא שוטר רגיל)</li>
<li>זכות לתמיכה נפשית מקצועית מהמדינה</li>
<li>זכות לפיצויים מהמדינה (אם התוקף לא יכול לשלם)</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p>מקור: המרכז לסיוע לנפגעות ונפגעי תקיפה מינית. | <a href="/criminal-defense-attorney/">משפט פלילי</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'קורבן עבירת מין | זכויות, תמיכה, תלונה | Jus-Tice',
      seo_description: '7-9K תלונות מין/שנה. 6 זכויות קורבן. אנונימיות מלאה. עו"ד חינם. פיצויים מהמדינה. מדריך 2025.',
      pillar_keyword: 'קורבן עבירת מין', secondary_keywords: 'נפגע עבירת מין,זכויות קורבן,תלונת מין ישראל'
    }
  ));

  // 5. COURT APPEAL ISRAEL
  results.push(await upsert('court-appeal-israel', 'ערעור לבית משפט | מתי, איך, עלויות | Jus-Tice',
    `<!-- wp:paragraph --><p>ערעור על פסק דין בישראל הוא זכות — אך לא בכל מקרה. יש הבדל בין ערעור בזכות (מגיע אוטומטית) לערעור ברשות (צריך אישור). רוב הערעורים (70%+) נדחים — לכן עורך דין חיוני לסינון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלולי ערעור</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>ערכאה ראשונה</th><th>ערעור ל</th><th>מועד הגשה</th></tr></thead><tbody>
<tr><td>בית משפט שלום</td><td>מחוזי</td><td>45 ימים</td></tr>
<tr><td>בית משפט מחוזי</td><td>עליון</td><td>45 ימים</td></tr>
<tr><td>בית דין לעבודה אזורי</td><td>בית דין ארצי</td><td>30 ימים</td></tr>
<tr><td>בית משפט לענייני משפחה</td><td>מחוזי</td><td>45 ימים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה עולה ערעור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>אגרת ערעור: 1,500-5,000 ₪. שכר טרחת עורך דין: 15,000-50,000 ₪ (תלוי מורכבות). ערעור לעליון: עד 100,000+ ₪ בתיקים מורכבים. ממוצע: 20,000-40,000 ₪ כולל אגרה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">משפט פלילי</a> | <a href="/contract-law-israel/">דיני חוזים</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'ערעור לבית משפט | מתי, איך, עלויות | Jus-Tice',
      seo_description: '70%+ ערעורים נדחים. שלום→מחוזי: 45 יום. עלות: 1.5K-5K אגרה + 15K-50K שכ"ט. עליון: 100K+. מדריך 2025.',
      pillar_keyword: 'ערעור בית משפט', secondary_keywords: 'ערעור פסק דין,ערעור לעליון,הגשת ערעור'
    }
  ));

  console.log('\n=== BATCH 45 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
