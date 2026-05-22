/**
 * Batch 5 — City Matrix + Employment Deep Pages
 * City hubs: Tel Aviv, Haifa, Jerusalem
 * City × practice: family/criminal/medical-malpractice in Tel Aviv
 * Plus: employment dismissal deep-dive, property rights cohabiting
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

  // ─── CITY HUB: TEL AVIV ─────────────────────────────────
  results.push(await upsert('lawyers-tel-aviv', 'עורכי דין בתל אביב | מדריך למציאת עורך דין בעיר | Jus-Tice',
    `<!-- wp:paragraph --><p>תל אביב-יפו היא הבירה המשפטית של ישראל. הלשכה המחוזית תל אביב מונה כ-15,000 עורכי דין פעילים — יותר מ-40% מכל עורכי הדין בישראל. מציאת עורך הדין הנכון בתל אביב דורשת הבנה של התמחויות, מחירים ואיכות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תחומי התמחות נפוצים בתל אביב</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>ריכוז גיאוגרפי</th><th>מחיר ממוצע</th></tr></thead><tbody>
<tr><td>דיני משפחה וגירושין</td><td>אזור בית המשפט לענייני משפחה תל אביב (הרצליה ד.)</td><td>15,000-50,000 ₪ לתיק</td></tr>
<tr><td>משפט פלילי</td><td>סביב בית המשפט המחוזי, בוגרשוב</td><td>8,000-100,000 ₪</td></tr>
<tr><td>נדל"ן ומקרקעין</td><td>רמת גן (בורסה), הצפון הישן</td><td>8,000-40,000 ₪</td></tr>
<tr><td>דיני עסקים וחברות</td><td>מגדלי עזריאלי, מרכז העיר</td><td>400-2,500 ₪/שעה</td></tr>
<tr><td>רשלנות רפואית</td><td>כל רחבי העיר</td><td>20-35% מהפיצוי</td></tr>
<tr><td>ירושה וצוואה</td><td>פזור — רשם ירושות תל אביב במרכז</td><td>3,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בתי משפט מרכזיים בתל אביב</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט המחוזי תל אביב-יפו:</strong> ויצמן 1, תל אביב — תיקים גדולים, ערעורים, אזרחי ופלילי</li>
<li><strong>בית משפט השלום תל אביב:</strong> ויצמן 3 — רוב התיקים האזרחיים והפליליים הבסיסיים</li>
<li><strong>בית הדין לעבודה תל אביב:</strong> בן גוריון 33 — כל תביעות העבודה</li>
<li><strong>בית המשפט לענייני משפחה:</strong> הרצל 68, הרצליה — גירושין, משמורת, מזונות</li>
<li><strong>בית הדין הרבני האזורי תל אביב-יפו:</strong> ויצמן 8 — גט ועניינים דתיים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>איך מוצאים עורך דין מומלץ בתל אביב?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>בדוק רישיון בלשכת עורכי הדין (iba.org.il)</li>
<li>בקש 2-3 המלצות אישיות מאנשים שעברו תיק דומה</li>
<li>קבל 3 הצעות מחיר — השוואה עם פגישת ייעוץ ראשונה</li>
<li>בדוק אם עורך הדין מתמחה בתחום שלך (לא כל עורך דין עושה הכל)</li>
<li>בדוק זמינות — האם יחזור אליך בתוך 24 שעות?</li>
</ol><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/family-law-tel-aviv/">עורך דין משפחה תל אביב</a> | <a href="/criminal-lawyer-tel-aviv/">עורך דין פלילי תל אביב</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורכי דין בתל אביב 2025 | מדריך, תחומים ומחירים | Jus-Tice', seo_description: '15,000 עורכי דין בתל אביב. איפה נמצאים? מה מחירי הממוצע? איך מוצאים מומלץ? בתי משפט מרכזיים. מדריך 2025.', pillar_keyword: 'עורכי דין תל אביב', secondary_keywords: 'עורך דין תל אביב,מציאת עורך דין תל אביב' }
  ));

  // ─── CITY × PRACTICE: FAMILY LAW TEL AVIV ──────────────
  results.push(await upsert('family-law-tel-aviv', 'עורך דין משפחה תל אביב | גירושין, משמורת, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בתל אביב מטפל בגירושין, משמורת ילדים, מזונות, הסכמים פרה-נופשיאלים, סרבנות גט ועוד. בית המשפט לענייני משפחה תל אביב (הרצליה) הוא הגדול בישראל — מטפל ביותר מ-20,000 תיקים פעילים בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שירותי עורך דין משפחה בתל אביב</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>גירושין בהסכמה ובסכסוך</li>
<li>הסכם גירושין</li>
<li>משמורת ילדים (פיזית ומשפטית)</li>
<li>מזונות ילדים ובן זוג</li>
<li>חלוקת רכוש ופנסיה</li>
<li>הסכם קדם-נישואין (פרה-נופשיאל)</li>
<li>סרבנות גט</li>
<li>אימוץ ואפוטרופסות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה עורך דין משפחה בתל אביב?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מחיר בתל אביב</th><th>מחיר ממוצע ארצי</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה (פשוט)</td><td>8,000 - 20,000 ₪</td><td>5,000 - 15,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>25,000 - 100,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>הסכם גירושין בלבד</td><td>6,000 - 15,000 ₪</td><td>4,000 - 12,000 ₪</td></tr>
<tr><td>ייצוג בדיון מזונות</td><td>5,000 - 20,000 ₪</td><td>3,000 - 15,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0 - 600 ₪/שעה</td><td>0 - 500 ₪/שעה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>היכן מוגשות תביעות משפחה בתל אביב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בית המשפט לענייני משפחה תל אביב-יפו: רחוב הרצל 68, הרצליה. ניתן להגיש גם בפורטל הרשות השופטת (courts.gov.il) מרחוק.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם צריך עורך דין מתל אביב ספציפית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. עורך דין רשוי בישראל יכול לייצג בכל בית משפט. אולם, עורך דין המכיר את בית המשפט המקומי, השופטים ופרקליטות המחוז מכיר את הפרקטיקה המקומית — יתרון בפועל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/lawyers-tel-aviv/">עורכי דין תל אביב</a> | <a href="/divorce-agreement/">הסכם גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה תל אביב 2025 | גירושין, משמורת, מחירים | Jus-Tice', seo_description: 'עורך דין משפחה תל אביב: גירושין 8K-100K ₪, מזונות, משמורת. בית משפט לענייני משפחה תל אביב — 20,000 תיקים/שנה. מחירים 2025.', pillar_keyword: 'עורך דין משפחה תל אביב', secondary_keywords: 'גירושין תל אביב,עורך דין גירושין תל אביב' }
  ));

  // ─── CITY × PRACTICE: CRIMINAL LAW TEL AVIV ────────────
  results.push(await upsert('criminal-lawyer-tel-aviv', 'עורך דין פלילי תל אביב | ייצוג, מחירים ואיך בוחרים | Jus-Tice',
    `<!-- wp:paragraph --><p>תל אביב היא מרכז הפעילות הפלילית הגדול בישראל — בית המשפט המחוזי תל אביב-יפו מטפל בתיקי חומרה גבוהה, צווארון לבן, וסחר בסמים. מציאת עורך דין פלילי מנוסה בתל אביב יכולה לשנות את תוצאת התיק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בתל אביב?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג תיק</th><th>תל אביב</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>עבירת תעבורה</td><td>2,000 - 8,000 ₪</td><td>1,500 - 6,000 ₪</td></tr>
<tr><td>אלימות קלה</td><td>8,000 - 30,000 ₪</td><td>5,000 - 20,000 ₪</td></tr>
<tr><td>עבירות סמים</td><td>10,000 - 50,000 ₪</td><td>5,000 - 25,000 ₪</td></tr>
<tr><td>צווארון לבן</td><td>40,000 - 300,000 ₪</td><td>30,000 - 200,000 ₪</td></tr>
<tr><td>עבירות מין</td><td>30,000 - 200,000 ₪</td><td>20,000 - 150,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בתי משפט פליליים בתל אביב</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית משפט השלום תל אביב-יפו:</strong> ויצמן 3 — עבירות עד 7 שנות מאסר</li>
<li><strong>בית המשפט המחוזי תל אביב-יפו:</strong> ויצמן 1 — עבירות חמורות, ערעורים</li>
<li><strong>מרכז לחקירות פלילית תל אביב (מחלקה 433):</strong> האחראי לחקירות מחוז תל אביב</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם יש הבדל בין עורכי דין פליליים בתל אביב לאחרים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן ולא. עורך דין מנוסה מכיר את השופטים, הפרקליטים ונהלי בית המשפט הספציפי. בתל אביב יש ריכוז גבוה של עורכי דין שהתמחו בצווארון לבן ותיקים מורכבים — יתרון לתיקים כאלה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשנעצרים בתל אביב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הצהר זכות שתיקה. בקש עורך דין לפני כל חקירה. השוטרים חייבים לאפשר לך לדבר עם עורך דין. אם אין לך — בקש מהמשטרה מספר של עורך דין תורן.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/criminal-rights-arrest/">זכויות במעצר</a> | <a href="/lawyers-tel-aviv/">עורכי דין תל אביב</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי תל אביב | מחירים, בתי משפט, ייצוג | Jus-Tice', seo_description: 'עורך דין פלילי תל אביב: עבירות תעבורה 2K-8K, צווארון לבן 40K-300K. בתי משפט, איך בוחרים. מחירים 2025.', pillar_keyword: 'עורך דין פלילי תל אביב', secondary_keywords: 'פלילי תל אביב,עורך דין פלילי מומלץ תל אביב' }
  ));

  // ─── CITY HUB: HAIFA ────────────────────────────────────
  results.push(await upsert('lawyers-haifa', 'עורכי דין בחיפה | מדריך למציאת עורך דין | Jus-Tice',
    `<!-- wp:paragraph --><p>חיפה היא המרכז המשפטי של הצפון. לשכת עורכי הדין מחוז חיפה מונה כ-3,500 חברים. חיפה מכילה בתי משפט מחוזי, שלום, דין לעבודה, ובית הדין הרבני האזורי. מדריך זה עוזר למצוא עורך דין בחיפה לפי תחום.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>בתי משפט בחיפה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט המחוזי חיפה:</strong> פל-ים 1 — תיקים כבדים, ערעורים</li>
<li><strong>בית משפט השלום חיפה:</strong> פל-ים 1 — תיקים יומיומיים</li>
<li><strong>בית הדין לעבודה חיפה:</strong> פל-ים 1 — תביעות עבודה</li>
<li><strong>בית המשפט לענייני משפחה חיפה:</strong> פל-ים 1 — גירושין, ילדים</li>
<li><strong>בית הדין הרבני חיפה:</strong> גיסין 7 — גט וגירושין דתיים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורכי דין בחיפה לעומת תל אביב</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>חיפה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>דיני משפחה</td><td>8,000 - 40,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>פלילי</td><td>5,000 - 60,000 ₪</td><td>8,000 - 150,000 ₪</td></tr>
<tr><td>נדל"ן</td><td>5,000 - 20,000 ₪</td><td>8,000 - 40,000 ₪</td></tr>
<tr><td>ייעוץ שעתי</td><td>300 - 900 ₪/שעה</td><td>400 - 2,500 ₪/שעה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורכי דין בחיפה 2025 | מדריך, תחומים ומחירים | Jus-Tice', seo_description: '3,500 עורכי דין בחיפה. מחירים 20-30% נמוכים מתל אביב. בתי משפט מרכזיים. איך מוצאים מומלץ. מדריך 2025.', pillar_keyword: 'עורכי דין חיפה' }
  ));

  // ─── CITY HUB: JERUSALEM ────────────────────────────────
  results.push(await upsert('lawyers-jerusalem', 'עורכי דין בירושלים | מדריך ומאפייני השוק | Jus-Tice',
    `<!-- wp:paragraph --><p>ירושלים היא מרכז מנהלי ומשפטי ייחודי. לשכת עורכי הדין מחוז ירושלים מונה כ-4,500 חברים. ירושלים מכילה את בית המשפט העליון, בתי דין רבניים ושרעיים מרכזיים, וגופים ייחודיים הנוגעים לממשל, לאדמות ולמיעוטים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>ייחודי ירושלים מבחינה משפטית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט העליון:</strong> ירושלים — ערכאה עליונה לכל ישראל, בג"ץ</li>
<li><strong>בתי הדין הרבניים הגבוהים:</strong> בירושלים — ערעורים על בתי דין אזוריים</li>
<li><strong>בתי דין שרעיים:</strong> לסכסוכי ירושה ומשפחה בקרב אזרחים מוסלמים</li>
<li><strong>אדמות מינהל ומקדשות:</strong> עורכי דין המתמחים במסלול ירושלמי ייחודי</li>
<li><strong>ניגוד בין חוק ישראלי לדין ירדני:</strong> ב"שטחים" שסופחו — הליכים ייחודיים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורכי דין בירושלים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>ירושלים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>דיני משפחה</td><td>8,000 - 45,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>פלילי</td><td>5,000 - 80,000 ₪</td><td>8,000 - 150,000 ₪</td></tr>
<tr><td>נדל"ן ומקרקעין</td><td>5,000 - 25,000 ₪</td><td>8,000 - 40,000 ₪</td></tr>
<tr><td>בג"ץ ועתירות מנהליות</td><td>15,000 - 100,000 ₪</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורכי דין בירושלים 2025 | מדריך, ייחודי השוק ומחירים | Jus-Tice', seo_description: '4,500 עורכי דין בירושלים. בית המשפט העליון, בתי דין רבניים גבוהים. ייחודי ירושלים. מחירים 2025.', pillar_keyword: 'עורכי דין ירושלים' }
  ));

  // ─── EMPLOYMENT: DISMISSAL DEEP DIVE ────────────────────
  results.push(await upsert('wrongful-dismissal-guide', 'פיטורים שלא כדין | זכויות, תביעה ופיצויים | Jus-Tice',
    `<!-- wp:paragraph --><p>פיטורים שלא כדין הם פיטורים המבוצעים תוך הפרת חוק — ללא שימוע, מסיבות מפלות, או בניגוד להגנה חוקית. בכל שנה מוגשות כ-18,000 תביעות פיטורים שלא כדין לבית הדין לעבודה. הפיצויים נעים בין 20,000 ₪ לתביעות ייצוגיות של מיליוני שקלים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב פיטורים שלא כדין?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סיבת פיטורים</th><th>האם חוקי?</th><th>עילה לתביעה</th></tr></thead><tbody>
<tr><td>בגין הריון / לידה</td><td>אסור — ללא אישור שר</td><td>חוק שוויון הזדמנויות</td></tr>
<tr><td>בגין מחלה</td><td>אסור — ללא שימוע ואישור</td><td>חוק שוויון לאנשים עם מוגבלות</td></tr>
<tr><td>בגין פעילות ועד / שביתה</td><td>אסור לחלוטין</td><td>חוק הסכמים קיבוציים</td></tr>
<tr><td>ללא שימוע</td><td>בלתי חוקי ברוב המקרים</td><td>פגיעה בחובת שימוע</td></tr>
<tr><td>בגין גיל (מעל 45)</td><td>אסור</td><td>חוק שוויון הזדמנויות בעבודה</td></tr>
<tr><td>בגין גזע / מגדר / דת</td><td>אסור</td><td>חוק שוויון הזדמנויות</td></tr>
<tr><td>בגין מאמץ לתאונת עבודה</td><td>אסור</td><td>חוק אחריות מעסיקים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מהו "שימוע" ומדוע הוא קריטי?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>שימוע הוא הזכות של עובד לשמוע את הטענות נגדו ולהגיב לפני קבלת ההחלטה לפטרו. פיטורים ללא שימוע כלל אינם בהכרח בטלים, אך מזכים לפיצוי נפרד בגין פגיעה בכבוד ובהליך הוגן. שימוע מוכן מראש ומשמש כהגנה למעסיק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>פיצויים בפיטורים שלא כדין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב פיצוי</th><th>טווח</th></tr></thead><tbody>
<tr><td>פיצויי פיטורים</td><td>שכר חודשי × שנות עבודה</td></tr>
<tr><td>הפרשי שכר</td><td>שכר לתקופת ההתראה שלא ניתנה</td></tr>
<tr><td>פיצוי על פגיעה בהליך (שימוע)</td><td>2,000 - 50,000 ₪</td></tr>
<tr><td>פיצוי על אפליה</td><td>10,000 - 200,000 ₪</td></tr>
<tr><td>פיצוי על הפרת חוק הריון</td><td>שכר 150 ימים + 10,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תביעת פיטורים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים לרכיבי שכר; 3 שנים לפיצויי פיטורים; 3 שנים לתביעת אפליה. ממועד הפיטורים לכל רכיב. ככל שממהרים — כך הראיות (עדים, מסמכים) שמורות יותר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתבוע בלי עורך דין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. בית הדין לעבודה ידוע בנגישותו — ניתן להגיש תביעה עצמאית, הטפסים פשוטים, ואגרה מינימלית. אולם, בתביעות מורכבות (אפליה, פיטורים בהריון) — ייצוג מעלה משמעותית את הסכוי ואת סכום הפיצוי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/lawyer-fees-guide/">מחירי עורכי דין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'פיטורים שלא כדין | זכויות, פיצויים ותביעה | Jus-Tice', seo_description: 'פיטורים שלא כדין: בהריון, מחלה, ללא שימוע, אפליה. פיצויים 2K-200K ₪ בנוסף לפיטורים. 18,000 תביעות בשנה. מדריך 2025.', pillar_keyword: 'פיטורים שלא כדין', secondary_keywords: 'תביעת פיטורים,שימוע פיטורים,פיטורים בהריון' }
  ));

  // ─── PROPERTY RIGHTS COHABITING COUPLES ─────────────────
  results.push(await upsert('cohabiting-couples-rights', 'זכויות ידועים בציבור | מה מגיע, מה לא ואיך מוכיחים | Jus-Tice',
    `<!-- wp:paragraph --><p>ידוע/ידועה בציבור הם זוג שחי יחד כנשוי אך ללא נישואים פורמליים. בישראל, כ-250,000 זוגות חיים כ"ידועים בציבור". הזכויות של ידועים בציבור שונות מאלה של נשואים — ועדיין מוכרות בחוק בתחומים רבים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מגיע לידועים בציבור?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>זכות</th><th>ידועים בציבור</th><th>נשואים</th></tr></thead><tbody>
<tr><td>ירושה ללא צוואה</td><td>לא — חייבת צוואה</td><td>כן — אוטומטי</td></tr>
<tr><td>חלוקת רכוש</td><td>לפי תביעת שיתוף ספציפי</td><td>חזקת שיתוף / חוק יחסי ממון</td></tr>
<tr><td>קצבת שארים (ביטוח לאומי)</td><td>כן — אם הוכח ידועות</td><td>כן — אוטומטי</td></tr>
<tr><td>פנסיית שאירים</td><td>כן — רוב הקרנות מכירות</td><td>כן — אוטומטי</td></tr>
<tr><td>ניכוי מס על בן/בת זוג</td><td>לא</td><td>כן</td></tr>
<tr><td>אימוץ משותף</td><td>הוגבל בחקיקה</td><td>מלא</td></tr>
<tr><td>דמי לידה</td><td>כן — שווה לנשואים</td><td>כן</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד מוכיחים ידועות בציבור?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הצהרה בפני נוטריון (הכי חזקה)</li>
<li>הצהרה מול רשות מקומית</li>
<li>חשבונות בנק משותפים</li>
<li>חוזי שכירות / בעלות על נכס משותף</li>
<li>עדויות שכנים, משפחה, מעסיקים</li>
<li>ביטוח משותף</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן צריך לחיות יחד כדי להיות ידועים בציבור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>אין קביעה חוקית של "שנה מינימום". בפועל, בתי המשפט בוחנים מכלול: חיים משותפים, כלכלה משותפת, מצג כלפי חוץ, ותמשכה ויציבות. חצי שנה עם כוונה רצינית עשויה להספיק. שנתיים עם כל הסימנים — בוודאות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה קורה לרכוש אם ידוע/ה מת ללא צוואה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הרכוש עובר ליורשים על פי דין — ילדים, הורים, אחים — לא לבן/בת הזוג הידוע. זו הסיבה שצוואה היא קריטית לידועים בציבור. ראה <a href="/will-and-testament/">מדריך צוואה</a>.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לקבל מזונות בפרידה של ידועים בציבור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לרוב לא. מזונות בין בני זוג חלים בנישואים בלבד. ידוע/ה יכולים לתבוע חלוקת רכוש, אך לא מזונות ספציפיים זה לזה לאחר פרידה (אלא אם יש הסכם).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/will-and-testament/">מדריך צוואה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות ידועים בציבור | מה מגיע, ירושה, רכוש | Jus-Tice', seo_description: '250,000 זוגות ידועים בציבור בישראל. מה מגיע: ירושה (לא), פנסיה (כן), רכוש (בתביעה). כיצד מוכיחים? מדריך 2025.', pillar_keyword: 'זכויות ידועים בציבור', secondary_keywords: 'ידועים בציבור זכויות,ידוע בציבור ירושה,ידועים בציבור רכוש' }
  ));

  console.log('\n=== BATCH 5 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
