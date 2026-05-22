/**
 * Batch 22 — Prenuptial cost, execution (hotzaa lepoal), trademark,
 * mental health law, corporate law, personal injury car accident
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

  // 1. PRENUPTIAL AGREEMENT COST
  results.push(await upsert('prenuptial-agreement-cost', 'כמה עולה הסכם קדם נישואין | מחירים ומה כולל | Jus-Tice',
    `<!-- wp:paragraph --><p>הסכם קדם נישואין מגן על שני הצדדים במקרה של גירושין. רבים נרתעים מהמחיר — אך הסכם טוב שעולה 5,000-20,000 ₪ יכול לחסוך עשרות ואף מאות אלפי שקלים בגירושין. מדריך זה מפרט מה עולה ומה כולל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי הסכם קדם נישואין 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג הסכם</th><th>מינימום</th><th>ממוצע</th><th>מקסימום</th></tr></thead><tbody>
<tr><td>בסיסי (בלי נכסים)</td><td>2,500 ₪</td><td>5,000 ₪</td><td>10,000 ₪</td></tr>
<tr><td>סטנדרטי (דירה + חסכונות)</td><td>5,000 ₪</td><td>10,000 ₪</td><td>20,000 ₪</td></tr>
<tr><td>מורכב (עסקים, ירושות)</td><td>10,000 ₪</td><td>20,000 ₪</td><td>50,000 ₪</td></tr>
<tr><td>שני עורכי דין (מומלץ)</td><td>+2,500 ₪</td><td>+5,000 ₪</td><td>+10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם הסכם קדם נישואין תמיד תקף?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — ביהמ"ש יכול לבטל הסכם שלא נחתם בהבנה מלאה, שנחתם תחת לחץ, שאינו מאוזן חריגות, או שאינו משקף נסיבות שהשתנו. מומלץ: שני עורכי דין נפרדים (אחד לכל צד), נוטריון לאישור, ותיעוד שניהם הסכימו ברצון חופשי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/prenuptial-agreement-guide/">מדריך הסכם קדם נישואין</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'כמה עולה הסכם קדם נישואין | מחירים 2025 | Jus-Tice', seo_description: 'הסכם קדם נישואין: בסיסי 2.5K-10K ₪, סטנדרטי 5K-20K, מורכב 10K-50K. שני עורכי דין = הגנה כפולה. מדריך 2025.', pillar_keyword: 'כמה עולה הסכם קדם נישואין', secondary_keywords: 'מחיר הסכם קדם נישואין,עלות הסכם קדם נישואין' }
  ));

  // 2. WRIT OF EXECUTION (HOTZAA LEPOAL)
  results.push(await upsert('writ-of-execution-israel', 'הוצאה לפועל | מדריך מלא — חייב ונושה | Jus-Tice',
    `<!-- wp:paragraph --><p>הוצאה לפועל (ה"פ) היא הגוף המבצע פסקי דין וצווים כספיים. כ-1.5 מיליון תיקים פתוחים בהוצאה לפועל בכל רגע נתון בישראל. מדריך זה מסביר את מה שצריך לדעת — הן מצד הנושה (מי שמגיש) והן מצד החייב.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כלים של ה"פ נגד חייבים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>כלי אכיפה</th><th>תנאי</th><th>השפעה</th></tr></thead><tbody>
<tr><td>עיקול משכורת</td><td>פסק דין קיים</td><td>עד 30% מהשכר נתפס</td></tr>
<tr><td>עיקול חשבון בנק</td><td>פסק דין קיים</td><td>קפאון חשבון</td></tr>
<tr><td>שלילת רישיון נהיגה</td><td>חוב +5,000 ₪</td><td>שלילה עד תשלום</td></tr>
<tr><td>מניעת יציאה לחו"ל</td><td>חוב +5,000 ₪</td><td>עד תשלום</td></tr>
<tr><td>עיקול נדל"ן</td><td>פסק דין</td><td>מניעת מכירה</td></tr>
<tr><td>מעצר חייב</td><td>מסרב לשתף ל"פ</td><td>עד 3 ימים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשמקבלים צו עיקול?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) בדוק את תוקף הצו (יש שגיאות). 2) בדוק אם חוב מתיישן (7 שנים כללי). 3) הגש ערעור אם יש עילה. 4) בקש הסדר תשלומים מרשם ה"פ. 5) פנה לעורך דין לפני שעוברים על כל הכסף.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/debt-collection-israel/">גביית חוב</a> | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הוצאה לפועל בישראל | מדריך מלא חייב ונושה | Jus-Tice', seo_description: '1.5M תיקים פתוחים. 6 כלי אכיפה: עיקול, שלילת רישיון, מניעת יציאה. 5 צעדים לחייב. מדריך 2025.', pillar_keyword: 'הוצאה לפועל', secondary_keywords: 'הוצאה לפועל ישראל,עיקול משכורת,שלילת רישיון חוב' }
  ));

  // 3. TRADEMARK REGISTRATION
  results.push(await upsert('trademark-registration-israel', 'רישום סימן מסחרי בישראל | כיצד, עלות, הגנה | Jus-Tice',
    `<!-- wp:paragraph --><p>סימן מסחרי רשום מגן על השם, הלוגו, הסלוגן של העסק מפני מתחרים. בישראל, רשות הפטנטים, המדגמים וסימני המסחר מטפלת בבקשות. כ-12,000 בקשות רישום סימן מסחרי מוגשות בישראל מדי שנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה ניתן לרשום כסימן מסחרי?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>שם עסק / מותג</li>
<li>לוגו (עיצוב, צבע)</li>
<li>סלוגן</li>
<li>חתימה ייחודית</li>
<li>צליל (מוזיקת פתיחה)</li>
<li>צורה ייחודית של מוצר (trade dress)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>עלות רישום סימן מסחרי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>עלות</th></tr></thead><tbody>
<tr><td>אגרת רישום (קטגוריה אחת)</td><td>1,527 ₪</td></tr>
<tr><td>כל קטגוריה נוספת</td><td>764 ₪</td></tr>
<tr><td>שכ"ט עורך דין (כולל בקשה)</td><td>3,000-8,000 ₪</td></tr>
<tr><td>סה"כ (קטגוריה אחת)</td><td>4,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח לרשום סימן מסחרי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כ-18-24 חודשים. שלבים: בדיקת ייחודיות (2-3 חודשים), פרסום לגופות (3 חודשים), אישור סופי (6-12 חודשים). אחרי רישום — הסימן תקף 10 שנים (ניתן לחידוש).</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה קורה אם מישהו משתמש בסימן שלי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>עם סימן מסחרי רשום: ניתן לתבוע נזיקין, לקבל צו מניעה, ולדרוש פיצויים. ללא רישום: רק תביעת "גניבת עין" — קשה יותר להוכיח ופחות אפקטיבית.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/copyright-infringement-israel/">זכויות יוצרים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רישום סימן מסחרי בישראל | עלות, הליך, הגנה | Jus-Tice', seo_description: '12,000 בקשות בשנה. אגרה 1,527 ₪ לקטגוריה + עו"ד 3K-8K. 18-24 חודשים. תקף 10 שנים. מדריך 2025.', pillar_keyword: 'רישום סימן מסחרי', secondary_keywords: 'סימן מסחרי ישראל,רישום מותג,הגנה על שם מותג' }
  ));

  // 4. MENTAL HEALTH LAW (highly unique to Israel)
  results.push(await upsert('mental-health-law-israel', 'חוק בריאות הנפש | אישפוז כפוי, זכויות, שחרור | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק הטיפול בחולי נפש, תשנ"א-1991 מסדיר את אישפוז חולי הנפש בישראל — כולל אישפוז כפוי. כ-5,000 צווי אישפוז כפוי ניתנים בשנה. לאדם המאושפז יש זכויות משמעותיות שרבים לא יודעים עליהן.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי אישפוז פסיכיאטרי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>הגדרה</th><th>מי מחליט</th></tr></thead><tbody>
<tr><td>וולונטרי</td><td>המטופל מסכים</td><td>המטופל + פסיכיאטר</td></tr>
<tr><td>כפוי (כללי)</td><td>סכנה לעצמו/אחרים</td><td>פסיכיאטר מחוזי</td></tr>
<tr><td>כפוי (פלילי)</td><td>נאשם שאינו כשיר לדין</td><td>בית משפט</td></tr>
<tr><td>אמבולטורי כפוי</td><td>טיפול בקהילה (לא אשפוז)</td><td>פסיכיאטר מחוזי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>זכויות מטופל מאושפז</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>זכות לפנות לפסיכיאטר מחוזי לביקורת הצו</li>
<li>זכות לייצוג משפטי</li>
<li>זכות לפנות לבית המשפט המחוזי</li>
<li>זכות לדעת מדוע מאושפז</li>
<li>הגבלת טיפולים פולשניים ללא הסכמה (בחריגים)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן ניתן לאשפז בכפייה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ראשון: 24 שעות (ראשוני). שנית: עד 14 יום. שלישית: עד 30 יום. הארכות נוספות — עם אישור בית משפט. כל שלב דורש ביקורת רפואית ומשפטית.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/disability-rights-israel/">זכויות אנשים עם מוגבלות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חוק בריאות הנפש | אישפוז כפוי, זכויות, שחרור | Jus-Tice', seo_description: '5,000 צווי אישפוז כפוי בשנה. 4 סוגי אישפוז. 5 זכויות מרכזיות. כפוי ראשוני: 24 שעות. מדריך 2025.', pillar_keyword: 'אישפוז כפוי', secondary_keywords: 'חוק בריאות הנפש ישראל,אישפוז פסיכיאטרי,זכויות מטופל' }
  ));

  // 5. PERSONAL INJURY CAR ACCIDENT (highest volume PI in Israel)
  results.push(await upsert('personal-injury-car-accident', 'תאונת דרכים | פיצויים, ביטוח, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>תאונות דרכים הן הגורם המוביל לנזקי גוף בישראל — כ-400 הרוגים ו-17,000 פצועים בשנה. נפגע בתאונת דרכים זכאי לפיצויים מחוק הפיצויים לנפגעי תאונות דרכים, תשל"ה-1975 — גם אם לא הייתה אשמה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מכסה חוק הפיצויים לנפגעי תאונות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>ללא אשמה (No-Fault):</strong> כל נפגע בתאונת דרכים זכאי לפיצוי — גם אם הוא אשם</li>
<li><strong>נזקי גוף:</strong> כאב וסבל, אובדן שכר, טיפול רפואי, עזרת הזולת</li>
<li><strong>מות:</strong> שאירים מקבלים פיצוי על תלות כלכלית</li>
<li><strong>ביטוח חובה:</strong> כל מכונית חייבת — זה מממן את הפיצויים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>טווח פיצויים בתאונות דרכים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>חומרת הפגיעה</th><th>טווח פיצוי</th></tr></thead><tbody>
<tr><td>קלה (שבר, נקע)</td><td>20,000 - 80,000 ₪</td></tr>
<tr><td>בינונית (ניתוח, נכות חלקית)</td><td>80,000 - 500,000 ₪</td></tr>
<tr><td>חמורה (נכות קבועה)</td><td>500,000 - 3,000,000 ₪</td></tr>
<tr><td>קטלנית</td><td>500,000 - 4,000,000 ₪ לשאירים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים מיד אחרי תאונה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) בקש עזרה רפואית מיידית. 2) אל תחתום על שום מסמך מחברת הביטוח. 3) צלם את המקום, הנזקים, הרכבים. 4) קבל פרטי נסיבות מאחרים. 5) פנה לעורך דין תאונות בהקדם — הם עובדים על בסיס הצלחה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש לתבוע אחרי תאונת דרכים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים מיום התאונה (תביעה עצמאית). קטינים — עד גיל 25 (7 שנים מגיל 18). מת — 7 שנים מיום הפטירה לשאירים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/personal-injury-israel/">נזקי גוף</a> | <a href="/medical-malpractice-lawyer/">רשלנות רפואית</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תאונת דרכים | פיצויים, ביטוח, מה עושים | Jus-Tice', seo_description: '400 הרוגים, 17,000 פצועים בשנה. No-fault: כל נפגע זכאי. פיצוי: 20K-4M ₪. 7 שנות התיישנות. מדריך 2025.', pillar_keyword: 'תאונת דרכים פיצויים', secondary_keywords: 'תאונת דרכים ישראל,פיצוי תאונת דרכים,ביטוח חובה ישראל' }
  ));

  console.log('\n=== BATCH 22 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
