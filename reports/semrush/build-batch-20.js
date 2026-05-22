/**
 * Batch 20 — Petah Tikva city pages, pension split in divorce,
 * durable power of attorney, internet defamation, class action
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

  // 1. CRIMINAL PETAH TIKVA
  results.push(await upsert('criminal-lawyer-petah-tikva', 'עורך דין פלילי פתח תקווה | מחירים וייצוג | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בפתח תקווה מייצג בבית משפט השלום ובמחוזי תל אביב. פתח תקווה — "אם המושבות" — היא עיר גדולה עם בית משפט שלום פעיל ורמת פשיעה ממוצעת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בפתח תקווה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>פתח תקווה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>8,000-35,000 ₪</td><td>10,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי פתח תקווה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי פתח תקווה: תעבורה 1.5K-6K, אלימות 6K-22K ₪. מדריך 2025.', pillar_keyword: 'עורך דין פלילי פתח תקווה' }
  ));

  // 2. FAMILY LAW PETAH TIKVA
  results.push(await upsert('family-law-petah-tikva', 'עורך דין משפחה פתח תקווה | גירושין, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בפתח תקווה מייצג בבית המשפט לענייני משפחה ובבית הדין הרבני. פתח תקווה היא עיר עם קהילה חרדית משמעותית, ייחוד שמשפיע על אופי הסכסוכים המשפחתיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בפתח תקווה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>פתח תקווה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,500-13,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-50,000 ₪</td><td>20,000-80,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0-300 ₪</td><td>0-500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה פתח תקווה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה פתח תקווה: גירושין 4.5K-50K ₪. קהילה חרדית, בית משפט משפחה. מדריך 2025.', pillar_keyword: 'עורך דין משפחה פתח תקווה' }
  ));

  // 3. PENSION SPLIT IN DIVORCE (very high search volume)
  results.push(await upsert('divorce-pension-split', 'חלוקת פנסיה בגירושין | כיצד מחשבים, מה מגיע | Jus-Tice',
    `<!-- wp:paragraph --><p>פנסיה היא לעיתים קרובות הנכס הגדול ביותר שנצבר בנישואים — לפעמים יותר מהדירה. חלוקת פנסיה בגירושין היא מורכבת, ומצריכה חוות דעת אקטוארית. כ-60,000 זוגות מתגרשים בישראל בשנה — ובמרביתם יש פנסיה לחלק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחלק בפנסיה בגירושין?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב פנסיוני</th><th>נחלק בגירושין?</th><th>הסבר</th></tr></thead><tbody>
<tr><td>פנסיה מקיפה שנצברה בנישואים</td><td>כן</td><td>פרופורציה לתקופת הנישואים</td></tr>
<tr><td>פנסיה מלפני הנישואים</td><td>לא</td><td>רכוש אישי</td></tr>
<tr><td>ביטוח מנהלים (נישואים)</td><td>כן</td><td>כולל רכיב ביטוח ורכיב חיסכון</td></tr>
<tr><td>פיצויי פיטורים שנצברו</td><td>כן</td><td>אם בוצעה הפרדה — לפי הסכם 14</td></tr>
<tr><td>ירושה שהוכנסה לפנסיה</td><td>לא</td><td>נכס אישי אם תועד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד מחשבים את החלק שמגיע?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>חוות דעת אקטואר: 3,000-8,000 ₪</li>
<li>נוסחה בסיסית: ערך הנכס × (שנות נישואים / שנות עבודה) × 50%</li>
<li>כל קרן פנסיה מחשבת אחרת — האקטואר מתמחה בהתאמה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לקבל את חלק הפנסיה מיידי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — פנסיה ניתנת רק בגיל פרישה. ניתן להסכים על: הכרה בפנסיה כנכס ופיצוי בנכס אחר (למשל, חלק גדול יותר מהדירה), תשלום חודשי עתידי כשהשני פורש, או שמירה על הזכות לחלק עתידי.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה קורה לפנסיית שאירים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנסיית שאירים ניתנת לבן/ת הזוג בזמן הפטירה — לא ליורשים. לאחר גירושין, בן/ת הזוג המגורש לא זכאי אוטומטית. ניתן להסדיר בגירושין שבן/ת הזוג ישאר מוטב לפנסיית שאירים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/pension-rights-israel/">זכויות פנסיה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חלוקת פנסיה בגירושין | כיצד מחשבים, מה מגיע | Jus-Tice', seo_description: '60,000 גירושים בשנה. פנסיה = נכס ענק. חוות דעת אקטואר 3K-8K ₪. נוסחה: שנות נישואים ÷ שנות עבודה × 50%. מדריך 2025.', pillar_keyword: 'חלוקת פנסיה גירושין', secondary_keywords: 'פנסיה גירושין ישראל,חלוקת פנסיה,אקטואר גירושין' }
  ));

  // 4. INTERNET DEFAMATION (high volume, new niche)
  results.push(await upsert('internet-defamation-israel', 'לשון הרע ברשת | פיצויים, מחיקה, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>לשון הרע ברשת הוא אחד התחומים המשפטיים הצומחים ביותר בישראל — כ-1,000 תביעות לשון הרע מוגשות בשנה, ורובן נוגעות לפרסומים דיגיטליים (פייסבוק, גוגל, אינסטגרם, ביקורות). חוק איסור לשון הרע, תשכ"ה-1965 חל גם על רשת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב לשון הרע ברשת?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פוסט פייסבוק שמכפיש אדם</li>
<li>ביקורת כוזבת בגוגל / TripAdvisor</li>
<li>הפצת שמועות שקר בקבוצות WhatsApp</li>
<li>צילום מסך עם הערה מעוותת</li>
<li>ביקורת שמפרסמת עובדות שקריות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה פיצויים ניתן לקבל?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג נזק</th><th>פיצוי</th></tr></thead><tbody>
<tr><td>פיצוי ללא הוכחת נזק</td><td>עד 50,000 ₪</td></tr>
<tr><td>פיצוי מוגדל (כוונת זדון)</td><td>עד 100,000 ₪</td></tr>
<tr><td>נזק ממשי (עסקים, עבודה)</td><td>ללא הגבלה</td></tr>
<tr><td>פיצויים בגין הסרה (בית משפט)</td><td>הוצאות + פיצוי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן למחוק ביקורת שלילית מגוגל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — בשני מסלולים: 1) פנייה לגוגל ישירות (דרך "דווח על ביקורת") — עובד אם הביקורת מפרה מדיניות גוגל. 2) פסק דין ישראלי שמורה על הסרה — גוגל מציית לפסקי דין ישראליים בד"כ. הליך 2 — 3-12 חודשים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ביקורת שלילית (גם אם נכונה) נחשבת לשון הרע?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — אמת היא הגנה מלאה מפני לשון הרע. אם הביקורת מבוססת על ניסיון אמיתי ומפרסמת עובדות נכונות — אינה לשון הרע. ה"כאב" אינו מספיק לתביעה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'לשון הרע ברשת | פיצויים, מחיקה, מה עושים | Jus-Tice', seo_description: '1,000 תביעות לשון הרע בשנה. פיצוי 50K-100K ₪ ללא הוכחת נזק. ביקורת גוגל: מחיקה 2 מסלולים. מדריך 2025.', pillar_keyword: 'לשון הרע ברשת', secondary_keywords: 'לשון הרע אינטרנט,מחיקת ביקורת גוגל,פיצויים לשון הרע' }
  ));

  // 5. CLASS ACTION LAWSUIT
  results.push(await upsert('class-action-lawsuit', 'תביעה ייצוגית בישראל | כיצד עובדת, תנאים, פיצויים | Jus-Tice',
    `<!-- wp:paragraph --><p>תביעה ייצוגית מאפשרת לאדם אחד לתבוע בשם קבוצה גדולה שנפגעה באופן דומה. בישראל, כ-800-1,000 תביעות ייצוגיות מוגשות מדי שנה, ורובן נגד חברות גדולות (בנקים, חברות ביטוח, חברות טכנולוגיה).</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תנאים לאישור תביעה ייצוגית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>שאלה משפטית משותפת לכל חברי הקבוצה</li>
<li>קבוצה גדולה מספיק (לרוב מאות ויותר)</li>
<li>תביעה ייצוגית היא הדרך הטובה ביותר לטפל בסכסוך</li>
<li>בית המשפט צריך לאשר את הייצוגיות לפני שהתביעה יוצאת לדרך</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה מרוויח התובע המייצג?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>טווח</th></tr></thead><tbody>
<tr><td>גמול לתובע מייצג</td><td>5,000 - 100,000 ₪ (לא פרופורציה מהסדר)</td></tr>
<tr><td>שכ"ט עורך דין ייצוגי</td><td>15-25% מסכום ההסדר</td></tr>
<tr><td>חלק כל נפגע מהסדר</td><td>10-5,000 ₪ (תלוי בגודל הקבוצה)</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן להגיש תביעה ייצוגית נגד מדינה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. בישראל ניתן להגיש תביעות ייצוגיות גם נגד גורמים ממשלתיים — למשל, ביטוח לאומי, רשות המיסים. ההליך זהה, אך הרגישות פוליטית גבוהה יותר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקחת תביעה ייצוגית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>3-10 שנים ממוצע. שלבים: אישור תביעה ייצוגית (1-2 שנים) → ניהול ראיות (1-3 שנים) → פסיקה/הסדר (6-18 חודשים). רוב התביעות מסתיימות בהסדר לפני פסיקה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תביעה ייצוגית בישראל | כיצד עובדת, תנאים, פיצויים | Jus-Tice', seo_description: '800-1,000 תביעות ייצוגיות בשנה. גמול תובע: 5K-100K ₪. עו"ד: 15-25% מהסדר. 3-10 שנים. מדריך 2025.', pillar_keyword: 'תביעה ייצוגית', secondary_keywords: 'תביעה ייצוגית ישראל,class action,תובע מייצג' }
  ));

  console.log('\n=== BATCH 20 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
