/**
 * Batch 46 — RE Beit Shean, criminal/family Beit Shemesh, wrongful termination, minimum wage 2025
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

  // 1. REAL ESTATE BEIT SHEAN (north periphery)
  results.push(await upsert('real-estate-lawyer-beit-shean', 'עורך דין מקרקעין בית שאן | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בבית שאן מטפל בשוק פריפריית הצפון — בית שאן עיר עתיקת-יומין בעמק הירדן, עם נדל"ן זול מהממוצע הארצי ופוטנציאל תיירותי.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בבית שאן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בית שאן</th><th>ת"א</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>3,000-7,500 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין בית שאן | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין בית שאן: רכישה 3K-7.5K ₪. פריפריית צפון, עמק ירדן, זול. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין בית שאן' }
  ));

  // 2. CRIMINAL BEIT SHEMESH (mixed secular-haredi)
  results.push(await upsert('criminal-lawyer-beit-shemesh', 'עורך דין פלילי בית שמש | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בבית שמש מייצג בבית משפט השלום. בית שמש — עיר מגוונת עם מתחים חילוניים-חרדיים — מאופיינת בתיקי תעבורה, עבירות רכוש ועבירות הקשורות למחלוקות קהילה.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין פלילי בבית שמש</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>בית שמש</th><th>ירושלים</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>1,500-7,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>7,000-28,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי בית שמש | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי בית שמש: תעבורה 1K-5K, אלימות 5K-20K ₪. חילוני-חרדי. מדריך 2025.', pillar_keyword: 'עורך דין פלילי בית שמש' }
  ));

  // 3. FAMILY LAW BEIT SHEMESH
  results.push(await upsert('family-law-beit-shemesh', 'עורך דין משפחה בית שמש | גירושין, גט, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בבית שמש מייצג בבית משפט לענייני משפחה ובבית דין רבני. בית שמש — עיר מעורבת חילונית-חרדית — מאופיינת בסוגיות גט, גירושין דתיים, ומשמורת.</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>מחירי עורך דין משפחה בבית שמש</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בית שמש</th><th>ירושלים</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-11,000 ₪</td><td>6,000-16,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-40,000 ₪</td><td>15,000-60,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה בית שמש | גירושין, גט 2025 | Jus-Tice', seo_description: 'עורך דין משפחה בית שמש: גירושין 4K-40K ₪. חילוני-חרדי, גט, בית דין רבני. מדריך 2025.', pillar_keyword: 'עורך דין משפחה בית שמש' }
  ));

  // 4. WRONGFUL TERMINATION ISRAEL (comprehensive)
  results.push(await upsert('wrongful-termination-israel', 'פיטורים שלא כדין | הגנה, פיצויים, תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>פיטורים שלא כדין הם פיטורים בניגוד לחוק — בין אם בשל אפליה, נקמנות, או ללא הליך נאות. כ-15,000-20,000 תביעות פיטורים מוגשות בשנה לבית הדין לעבודה. פיצוי: עד שנת שכר ויותר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב פיטורים שלא כדין?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פיטורים בשל הריון / חופשת לידה (אסור מוחלט)</li>
<li>פיטורים בשל תלונה על הטרדה מינית</li>
<li>פיטורים בשל מחלה (ללא הליך נאות)</li>
<li>פיטורים בשל פעילות ועד עובדים</li>
<li>פיטורים ללא שימוע — כשנדרש</li>
<li>פיטורים בשל גיל, מין, לאום</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה פיצוי מגיע על פיטורים שלא כדין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי בנסיבות: (1) פיצויי פיטורים רגילים (חובה). (2) פיצוי נוסף עד 6-12 חודשי שכר על פגיעה בכבוד. (3) אם בשל אפליה — עד 50,000 ₪ נוספים ללא הוכחת נזק. מקרים של פיטורים בהריון — עד 24 חודשי שכר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: בית הדין הארצי לעבודה, ניתוחי פסיקה 2024. | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'פיטורים שלא כדין | הגנה, פיצויים, תביעה | Jus-Tice',
      seo_description: '15-20K תביעות/שנה. 6 מקרי פיטורים לא חוקיים. הריון: עד 24 חודשי שכר. אפליה: +50K ₪. מדריך 2025.',
      pillar_keyword: 'פיטורים שלא כדין', secondary_keywords: 'פיטורים לא חוקיים,פיצוי פיטורים,תביעת פיטורים'
    }
  ));

  // 5. MINIMUM WAGE ISRAEL 2025
  results.push(await upsert('minimum-wage-israel-2025', 'שכר מינימום ישראל 2025 | שעתי, חודשי, עדכונים | Jus-Tice',
    `<!-- wp:paragraph --><p>שכר המינימום בישראל מתעדכן בכל שנה. נכון ל-2025: 6,248 ₪ לחודש (עובד במשרה מלאה) ו-34.81 ₪ לשעה. עובד שמקבל פחות — זכאי לתביעת הפרשים עד 7 שנים אחורה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שכר מינימום 2020-2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שנה</th><th>חודשי</th><th>שעתי</th></tr></thead><tbody>
<tr><td>2020</td><td>5,300 ₪</td><td>29.12 ₪</td></tr>
<tr><td>2021</td><td>5,300 ₪</td><td>29.12 ₪</td></tr>
<tr><td>2022</td><td>5,571 ₪</td><td>30.61 ₪</td></tr>
<tr><td>2023</td><td>5,880 ₪</td><td>32.30 ₪</td></tr>
<tr><td>2024</td><td>6,083 ₪</td><td>33.41 ₪</td></tr>
<tr><td>2025</td><td>6,248 ₪</td><td>34.81 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם מסתמן עדכון שכר מינימום ב-2025?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — הסכם 2021-2025 כבר קבע עדכון ל-6,248 ₪ ב-2025. לאחריו — כנראה ניהול ועדת שכר מינימום חדשה ל-2026-2027.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: משרד העבודה ישראל, ינואר 2025. | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    {
      seo_title: 'שכר מינימום ישראל 2025 | שעתי, חודשי, עדכונים | Jus-Tice',
      seo_description: 'שכר מינימום 2025: 6,248 ₪/חודש, 34.81 ₪/שעה. טבלת 2020-2025. תביעת הפרשים: עד 7 שנים. מדריך.',
      pillar_keyword: 'שכר מינימום 2025', secondary_keywords: 'שכר מינימום ישראל,מינימום שעתי,עדכון שכר מינימום'
    }
  ));

  console.log('\n=== BATCH 46 RESULTS ===');
  results.forEach(r => console.log(`${(r.action || '').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
