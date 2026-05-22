/**
 * Batch 16 — Child abduction (Hague), admin detention, RE Haifa, malpractice cost,
 * prenuptial cost, joint account divorce, legal aid
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

  // 1. CHILD ABDUCTION HAGUE (very urgent, unique Israeli content)
  results.push(await upsert('child-abduction-hague', 'חטיפת ילדים לחו"ל | אמנת האג, זכויות, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>חטיפת ילד בינלאומית — פשוט כשהורה אחד לוקח ילד לחו"ל ללא הסכמת ההורה השני — היא אחת החוויות הקשות ביותר. ישראל חתומה על אמנת האג (1980) לענין חטיפת ילדים, ויש הליכים מהירים יחסית להחזרתם. כ-100-150 בקשות להחזרת ילדים מישראל לחו"ל ומחו"ל לישראל מוגשות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה עושים ברגע הראשון?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנה מיד לעורך דין שמתמחה בחטיפות בינלאומיות</li>
<li>הגש בקשה לבית המשפט לענייני משפחה לצו עיכוב יציאה</li>
<li>פנה לרשות המרכזית (משרד המשפטים): 02-541-5555</li>
<li>הגש תלונה במשטרה</li>
<li>פנה לשגרירות המדינה אליה הוברח הילד</li>
<li>אם הילד בחו"ל — פנה לרשות המרכזית של אותה מדינה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>אמנת האג — כיצד עובדת?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שלב</th><th>תוכן</th><th>זמן</th></tr></thead><tbody>
<tr><td>הגשת בקשה לרשות המרכזית</td><td>טפסים, אסמכתאות, ייפוי כוח</td><td>מיד</td></tr>
<tr><td>הרשות המרכזית מעבירה לחו"ל</td><td>תיאום עם הרשות במדינה הקולטת</td><td>שבוע</td></tr>
<tr><td>הגשה לבית משפט בחו"ל</td><td>בקשה להחזרה לפי האמנה</td><td>2-6 שבועות</td></tr>
<tr><td>החלטת בית משפט</td><td>אם ראה לנכון — מורה על החזרה</td><td>6-16 שבועות</td></tr>
<tr><td>ביצוע החזרה</td><td>תיאום עם הרשויות</td><td>2-4 שבועות</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם האמנה חלה על כל המדינות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. האמנה חלה רק על מדינות שחתמו עליה (כ-100 מדינות). מדינות ערב (מלבד מרוקו), אפריקה רבה, ומדינות מסוימות אחרות אינן חתומות. לילד שהוברח למדינה לא-חתומה — הליך שונה ומורכב יותר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם הורה שחטף ילד עלול לעמוד בפני אישום פלילי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. לפי חוק הישראלי — הברחת קטין היא עבירה פלילית עד 5 שנות מאסר. גם בחו"ל — מדינות רבות מחשיבות זאת לעבירה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-custody-guide/">משמורת ילדים</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חטיפת ילדים לחו"ל | אמנת האג, זכויות, מה עושים | Jus-Tice', seo_description: '100-150 מקרי חטיפה בשנה. אמנת האג: 5-שלב תהליך, 6-16 שבועות. הרשות המרכזית: 02-541-5555. מדריך 2025.', pillar_keyword: 'חטיפת ילדים לחו"ל', secondary_keywords: 'אמנת האג ילדים,חטיפה בינלאומית,החזרת ילד מחו"ל' }
  ));

  // 2. LEGAL AID ISRAEL (high-volume, public service)
  results.push(await upsert('legal-aid-israel', 'סיוע משפטי חינם בישראל | זכאות, שירותים, איך מגישים | Jus-Tice',
    `<!-- wp:paragraph --><p>הלשכה לסיוע משפטי (המשרד לסיוע ציבורי — שייך למשרד המשפטים) מספקת ייצוג ועזרה משפטית חינם לזכאים. כ-200,000 פניות מוגשות ללשכה מדי שנה. מדריך זה מסביר מי זכאי, לאיזה שירותים, ואיך מגישים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי זכאי לסיוע משפטי חינם?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>פרטים</th></tr></thead><tbody>
<tr><td>סף הכנסה</td><td>משפחה עד 2.5 פעמים שכר מינימום (2025: ~14,300 ₪)</td></tr>
<tr><td>נישואים</td><td>ייצוג חינם בגירושין לזכאים</td></tr>
<tr><td>פלילי (נאשם)</td><td>לרוב מחויב בחוק עבור עוד שנות מאסר</td></tr>
<tr><td>אלימות במשפחה</td><td>ייצוג ללא תלות בהכנסה</td></tr>
<tr><td>אשפוז פסיכיאטרי</td><td>ייצוג חינם</td></tr>
<tr><td>פליטים / מבקשי מקלט</td><td>ייעוץ בסוגיות מסוימות</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שירותים שמספקת הלשכה לסיוע משפטי</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>ייצוג בבית המשפט לענייני משפחה (גירושין, מזונות, משמורת)</li>
<li>ייצוג בבית הדין לעבודה (פיטורים, שכר)</li>
<li>ייצוג בתיקים פליליים (לנאשמים)</li>
<li>ייעוץ חד-פעמי חינם בתחומים שונים</li>
<li>עזרה בהגשת תביעות לבית הדין לעררים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כיצד מגישים בקשה?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנה ללשכה הקרובה למקום מגוריך (32 סניפים ברחבי ישראל)</li>
<li>הצג תלושי שכר אחרונים + ת"ז</li>
<li>מלא טופס בקשה</li>
<li>לשכה תשלח טופס אישור/דחייה תוך 14 יום</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לבחור עורך דין ספציפי בסיוע משפטי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בדרך כלל לא. הלשכה מפנה לאחד מהעורכי הדין שעובדים עמה. אולם, בתחומים מסוימים (כמו תיקים מורכבים) ניתן לבקש עורך דין פרטי שיועסק בסבסוד.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לקבל סיוע משפטי לאדם עשיר יחסית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בנושא אלימות במשפחה — כן, ללא תלות בהכנסה. בנושאי פלילי חמורים — גם. בשאר — לפי סף הכנסה. כדאי לברר ישירות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/lawyer-fees-guide/">מחירי עורכי דין</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סיוע משפטי חינם בישראל | זכאות, שירותים, איך מגישים | Jus-Tice', seo_description: '200,000 פניות בשנה. ייצוג חינם: גירושין, עבודה, פלילי, אלימות. סף הכנסה 14,300 ₪. 32 סניפים. מדריך 2025.', pillar_keyword: 'סיוע משפטי', secondary_keywords: 'לשכה לסיוע משפטי,עורך דין חינם,ייצוג חינם ישראל' }
  ));

  // 3. MEDICAL MALPRACTICE COST
  results.push(await upsert('medical-malpractice-cost', 'כמה עולה תביעת רשלנות רפואית | מחירים ומה לצפות | Jus-Tice',
    `<!-- wp:paragraph --><p>תביעת רשלנות רפואית היא אחת התביעות המורכבות ביותר — ולכן גם מהיקרות ביותר. עם זאת, רוב עורכי הדין בתחום עובדים לפי הצלחה — כלומר, לא תשלמו מראש. מדריך זה מסביר בדיוק מה העלויות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי תביעת רשלנות רפואית 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב עלות</th><th>מינימום</th><th>ממוצע</th><th>מקסימום</th></tr></thead><tbody>
<tr><td>שכ"ט עורך דין (% מפיצוי)</td><td>20%</td><td>28%</td><td>35%</td></tr>
<tr><td>חוות דעת רפואית ראשונה</td><td>5,000 ₪</td><td>12,000 ₪</td><td>25,000 ₪</td></tr>
<tr><td>חוות דעת שנייה (תגובה)</td><td>3,000 ₪</td><td>8,000 ₪</td><td>18,000 ₪</td></tr>
<tr><td>חוות דעת נכות</td><td>2,000 ₪</td><td>5,000 ₪</td><td>12,000 ₪</td></tr>
<tr><td>אגרות בית משפט</td><td>1,000 ₪</td><td>3,000 ₪</td><td>8,000 ₪</td></tr>
<tr><td>סה"כ עלויות (ללא שכ"ט)</td><td>11,000 ₪</td><td>28,000 ₪</td><td>63,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם אני חייב לשלם מראש?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בדרך כלל לא. רוב עורכי הדין לרשלנות רפואית עובדים על בסיס "contingency fee" — תשלום רק אם מנצחים. כיסוי הוצאות (חוות דעת): ייתכן שתצטרכו לממן חלקית. בדקו עם עורך הדין.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה גובה הפיצויים בתביעת רשלנות רפואית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>טווח רחב מאוד: 50,000 ₪ (פגיעה קלה) עד 10,000,000 ₪+ (נכות קבועה, שיתוק מוחין). ממוצע תביעה שמסתיימת בהצלחה: 500,000-1,500,000 ₪.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'כמה עולה תביעת רשלנות רפואית | מחירים 2025 | Jus-Tice', seo_description: 'רשלנות רפואית: עורך דין 20-35% מהפיצוי. חוות דעת: 5K-25K ₪. פיצוי ממוצע: 500K-1.5M ₪. מדריך 2025.', pillar_keyword: 'כמה עולה תביעת רשלנות רפואית', secondary_keywords: 'מחיר תביעת רשלנות רפואית,עלות עורך דין רשלנות רפואית' }
  ));

  // 4. REAL ESTATE LAWYER HAIFA
  results.push(await upsert('real-estate-lawyer-haifa', 'עורך דין מקרקעין חיפה | שירותים ומחירים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בחיפה עוסק בשוק ייחודי: שכונות מרמת הכרמל, עיר תחתית, עיר תיכונה, הדר; נכסים עם רקע היסטורי מורכב; ונכסי מינהל שנפוצים מאוד. מחירי הנדל"ן בחיפה נמוכים ב-30-50% מתל אביב — ועלות העורך דין בהתאם.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בחיפה 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>חיפה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה (שכ"ט)</td><td>6,000-15,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>בדיקת מסמכים</td><td>1,000-3,000 ₪</td><td>2,000-5,000 ₪</td></tr>
<tr><td>ליקויי נכס</td><td>8,000-30,000 ₪</td><td>10,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/lawyers-haifa/">עורכי דין חיפה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין חיפה | מחירים ושירותים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין חיפה: רכישה 6K-15K ₪, 30-50% פחות מתל אביב. שכונות: כרמל, עיר תחתית, הדר. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין חיפה' }
  ));

  // 5. MEDIATION ISRAEL (high volume, growing practice)
  results.push(await upsert('mediation-israel', 'גישור בישראל | מה זה, מתי עוזר ואיך עובד | Jus-Tice',
    `<!-- wp:paragraph --><p>גישור הוא הליך שבו צד שלישי ניטראלי (מגשר) מסייע לצדדים להגיע להסכם מרצון — מבלי להכריע ביניהם. בישראל, גישור הפך לכלי מרכזי: כ-50,000 הליכי גישור מתנהלים בשנה, כולל גישור חובה שמוזמן על ידי בית המשפט.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>גישור לעומת בית משפט — השוואה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>גישור</th><th>בית משפט</th></tr></thead><tbody>
<tr><td>עלות</td><td>3,000 - 20,000 ₪</td><td>20,000 - 150,000 ₪</td></tr>
<tr><td>זמן</td><td>2-10 פגישות (שבועות-חודשים)</td><td>1-5 שנים</td></tr>
<tr><td>פרטיות</td><td>חסוי לחלוטין</td><td>ציבורי</td></tr>
<tr><td>שליטה על תוצאה</td><td>גבוהה — הצדדים קובעים</td><td>נמוכה — שופט מחליט</td></tr>
<tr><td>שיעור הצלחה</td><td>65-80% מסתיימים בהסכם</td><td>100% (פסיקה) אבל לא תמיד מרוצים</td></tr>
<tr><td>קשר עתידי</td><td>משמר (שכנים, עסקים, משפחה)</td><td>מחמיר לרוב</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>תחומים שבהם גישור עובד טוב</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>גירושין (גישור משפחתי) — שומר על ילדים</li>
<li>סכסוכים עסקיים / שותפויות</li>
<li>סכסוכי שכנים ובעלי דירות</li>
<li>ירושות / סכסוכי משפחה</li>
<li>תביעות עובד-מעסיק</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם הסכם גישור מחייב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>אם נחתם — כן, מחייב כמו כל חוזה. ניתן להגיש אותו לבית המשפט לאישור כפסק דין (מה שמאפשר הוצאה לפועל). מומלץ תמיד לאשרו.</p><!-- /wp:parameter -->
<!-- wp:heading {"level":3} --><h3>האם אפשר להביא עורך דין לגישור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. מגשר רבים ממליצים שלכל צד יהיה עורך דין שמלווה (לא נוכח בחדר בהכרח) — לייעוץ בין הפגישות ולאישור ההסכם הסופי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/arbitration-vs-court/">בוררות לעומת בית משפט</a> | <a href="/divorce-mediation-guide/">גישור גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גישור בישראל | מה זה, עלות, שיעור הצלחה | Jus-Tice', seo_description: '50,000 גישורים בשנה. 65-80% מסתיימים בהסכם. עלות: 3K-20K לעומת 20K-150K בית משפט. חסוי לחלוטין. מדריך 2025.', pillar_keyword: 'גישור', secondary_keywords: 'גישור ישראל,גישור עסקי,גישור גירושין,גישור שכנים' }
  ));

  console.log('\n=== BATCH 16 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
