/**
 * Batch 4 — New pillar clusters + transversal high-traffic pages
 * Pages: lawyer-fees-guide, labor-law-employee-rights, drug-offenses-israel,
 *        inheritance-tax-israel, real-estate-agent-vs-lawyer, divorce-mediation-guide
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

  // 1. LAWYER FEES GUIDE (transversal — competes for כמה עולה עורך דין)
  results.push(await upsert('lawyer-fees-guide', 'שכר טרחה עורך דין | מדריך מחירים 2025 לפי תחום | Jus-Tice',
    `<!-- wp:paragraph --><p>אחת השאלות הנפוצות ביותר היא: "כמה עולה עורך דין?" התשובה שונה לחלוטין לפי תחום המשפט, מורכבות התיק, ניסיון עורך הדין והאזור הגיאוגרפי. מדריך זה מסביר את מבני התמחור הנפוצים בישראל ומספק טבלאות מחיר לפי תחום.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מבני תמחור נפוצים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מבנה תמחור</th><th>מתי נפוץ</th><th>יתרון</th><th>חיסרון</th></tr></thead><tbody>
<tr><td>סכום קבוע לתיק</td><td>פלילי, גירושין, חוזים</td><td>ודאות מחיר</td><td>עשוי לא לכלול חריגות</td></tr>
<tr><td>שכר שעתי</td><td>ייעוץ עסקי, ליטיגציה מורכבת</td><td>משלמים בדיוק לפי עבודה</td><td>קשה לתקצב</td></tr>
<tr><td>אחוז מהסכום</td><td>נזיקין, רשלנות רפואית</td><td>0 מקדמה, תשלום רק בהצלחה</td><td>יקר יחסית בהצלחה</td></tr>
<tr><td>שכר שמירה (Retainer)</td><td>עסקים, ייעוץ שוטף</td><td>זמינות מובטחת</td><td>עלות חודשית גם ללא שימוש</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מחירים לפי תחום משפט 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>מינימום</th><th>מקסימום</th><th>ממוצע</th></tr></thead><tbody>
<tr><td>דיני משפחה (גירושין)</td><td>5,000 ₪</td><td>80,000 ₪</td><td>20,000 ₪</td></tr>
<tr><td>משפט פלילי</td><td>2,000 ₪</td><td>500,000 ₪+</td><td>15,000 ₪</td></tr>
<tr><td>נדל"ן ומקרקעין</td><td>5,000 ₪</td><td>50,000 ₪</td><td>12,000 ₪</td></tr>
<tr><td>רשלנות רפואית</td><td>0 ₪ (contingency)</td><td>35% מהפיצוי</td><td>25%</td></tr>
<tr><td>דיני עבודה</td><td>3,000 ₪</td><td>30,000 ₪</td><td>8,000 ₪</td></tr>
<tr><td>ירושה וצוואה</td><td>2,000 ₪</td><td>20,000 ₪</td><td>6,000 ₪</td></tr>
<tr><td>ייעוץ עסקי (שעתי)</td><td>400 ₪/שעה</td><td>2,500 ₪/שעה</td><td>900 ₪/שעה</td></tr>
<tr><td>עבירות תעבורה</td><td>1,500 ₪</td><td>15,000 ₪</td><td>4,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>5 טיפים להורדת עלות עורך הדין</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li><strong>השווה מחירים:</strong> קבל הצעות מ-3 עורכי דין לפחות. הפרשי מחיר של 50-100% לאותו תיק שכיחים</li>
<li><strong>בקש הסכם שכר טרחה בכתב:</strong> מה כלול? מה לא? מה קורה בחריגות?</li>
<li><strong>שקול גישור:</strong> בסכסוכי גירושין, גישור עולה 50-70% פחות מייצוג נפרד</li>
<li><strong>ייעוץ חד-פעמי:</strong> לפעמים שעה אחת של ייעוץ חוסכת שגיאה יקרה. לא כל מצב דורש ייצוג מלא</li>
<li><strong>ישן יותר = זול יותר:</strong> עורכי דין מנוסים אך לא מפורסמים לעיתים מציעים שירות מצוין במחיר נמוך יותר</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לנהל משא ומתן על שכר הטרחה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. שכר טרחה אינו מחיר קבוע. אפשר לנהל משא ומתן על הסכום, על מבנה התשלום, ועל מה בדיוק כלול. עורכי דין רבים גמישים, במיוחד כשמדובר בלקוח שמגיע עם תיק ברור.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה כולל "שכר טרחה + הוצאות"?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>שכר טרחה = שכר העורך דין. הוצאות = אגרות בית משפט, שליחים, תרגומים, חוות דעת מומחה — אלה בדרך כלל בנוסף לשכר הטרחה ומחויבים לפי קבלה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מתי עורך דין עובד "בתשלום לפי הצלחה"?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בתיקי נזיקין ורשלנות רפואית זה נפוץ מאוד — עורך הדין גובה 20-35% מהפיצוי רק אם מצליח. בדיני עבודה ותביעות קטנות זה גם נפוץ. בגירושין, פלילי ונדל"ן — נדיר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-lawyer-cost/">עלות עורך דין פלילי</a> | <a href="/medical-malpractice-lawyer/">עורך דין רשלנות רפואית</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שכר טרחה עורך דין 2025 | מחירים לפי תחום, מבני תמחור | Jus-Tice', seo_description: 'כמה עולה עורך דין בישראל? טבלת מחירים 2025: גירושין 5K-80K, פלילי 2K-500K, נדל"ן 5K-50K. מבני תמחור, 5 טיפים לחיסכון.', pillar_keyword: 'שכר טרחה עורך דין' }
  ));

  // 2. LABOR LAW / EMPLOYEE RIGHTS (new pillar — high-volume keywords)
  results.push(await upsert('labor-law-employee-rights', 'זכויות עובדים בישראל | פיטורים, פיצויים, שכר ועבודה שחורה | Jus-Tice',
    `<!-- wp:paragraph --><p>זכויות עובדים בישראל מוגנות על ידי רשת חוקים מקיפה — אך רק עובדים שמכירים את זכויותיהם יכולים לממש אותן. בכל שנה מוגשות כ-70,000 תביעות לבית הדין לעבודה. מדריך זה מכסה את הזכויות הבסיסיות שכל עובד צריך לדעת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות עבודה בסיסיות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>זכות</th><th>פרטים 2025</th><th>מקור חוקי</th></tr></thead><tbody>
<tr><td>שכר מינימום</td><td>5,880 ₪ לחודש (47.08 ₪/שעה)</td><td>חוק שכר מינימום</td></tr>
<tr><td>ימי חופשה</td><td>11-28 ימים בשנה לפי ותק</td><td>חוק חופשה שנתית</td></tr>
<tr><td>דמי מחלה</td><td>18 יום בשנה, 50% ליום 2-3, 100% מיום 4</td><td>חוק דמי מחלה</td></tr>
<tr><td>פיצויי פיטורים</td><td>שכר חודשי לכל שנת עבודה (מעל שנה)</td><td>חוק פיצויי פיטורים</td></tr>
<tr><td>הפרשה לפנסיה</td><td>18.5% מהשכר (6% עובד + 6.5% מעסיק + 6% פיצויים)</td><td>צו הרחבה 2008</td></tr>
<tr><td>שעות עבודה</td><td>מקסימום 43 שעות/שבוע (9 ביום, 8 בערב שבת)</td><td>חוק שעות עבודה</td></tr>
<tr><td>ימי הבראה</td><td>6-10 ימים בשנה לפי ותק</td><td>צו הרחבה הבראה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>פיצויי פיטורים — מי זכאי?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>עובד שפוטר לאחר שנת עבודה אחת לפחות זכאי לפיצויי פיטורים. הסכום: שכר חודשי אחרון × שנות עבודה. עובד שהתפטר בנסיבות שמזכות (הרעת תנאים מהותית, מעבר דירה לאחר נישואים) זכאי גם הוא.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>פיטורים שלא כדין</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>פיטורים בהריון:</strong> אסור ללא אישור ממשרד העבודה. עד 60 יום אחרי חזרה מחופשת לידה.</li>
<li><strong>פיטורים בגין מחלה:</strong> לא ניתן לפטר עובד רק בשל מחלה (חוק שוויון זכויות לאנשים עם מוגבלות)</li>
<li><strong>פיטורים שרירותיים:</strong> מעסיק חייב לשמוע עובד לפני פיטורים (חובת שימוע)</li>
<li><strong>פיטורים בגין פעילות ועד:</strong> אסורים בהחלט</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה לעשות אם המעסיק לא משלם?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li><strong>תביעה לבית הדין לעבודה:</strong> ניתן להגיש בעצמך (ללא עורך דין). אגרה מינימלית.</li>
<li><strong>ממונה על השכר:</strong> פנייה לממונה מטעם משרד העבודה לאכיפה מינהלית</li>
<li><strong>ביטוח לאומי:</strong> אם המעסיק פשט רגל, הביטוח הלאומי משלם שכר עד 5 חודשים</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם עצמאי זכאי לזכויות אלה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>עצמאים (קבלני משנה) אינם זכאים לרוב הזכויות. אבל: אם מערכת היחסים דומה לשכיר (שעות מוכתבות, ציוד מהמעסיק, בלעדיות), בית הדין עשוי לסווגך כשכיר ולהעניק לך זכויות. זה "מבחן ההכרה".</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תביעת עבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים לרכיבי שכר (שכר מינימום, שעות נוספות, חופשה). 3 שנים לפיצויי פיטורים. ממועד הפסקת עבודה לכל רכיב שבסוף תקופת ההעסקה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לפטר עובד בתקופת ניסיון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן, אבל גם בתקופת ניסיון אסור לפטר מסיבות מפלות (הריון, מחלה, גזע, מין). מעסיק שפיטר בתקופת ניסיון מסיבות אסורות חשוף לתביעה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/">חזרה לעמוד הבית Jus-Tice</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות עובדים בישראל 2025 | פיטורים, פיצויים, שכר מינימום | Jus-Tice', seo_description: 'זכויות עובדים: שכר מינימום 5,880 ₪, פיצויי פיטורים, חופשה, פנסיה. פיטורים שלא כדין — מה עושים? 70,000 תביעות בשנה. מדריך 2025.', pillar_keyword: 'זכויות עובדים', secondary_keywords: 'פיצויי פיטורים,פיטורים שלא כדין,דיני עבודה ישראל' }
  ));

  // 3. DRUG OFFENSES
  results.push(await upsert('drug-offenses-israel', 'עבירות סמים בישראל | ענישה, הגנה וגישת הביקוש | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירות סמים מהוות כ-12% מהתיקים הפליליים בישראל. הקשת רחבה: מהחזקה לשימוש עצמי (שעשויה להסתיים בטיפול ולא כלא) ועד לסחר בינלאומי (עד 25 שנות מאסר). ההבחנה בין "להחזיק לשימוש עצמי" לבין "סחר" היא לרוב מרכז ההגנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סולם עבירות הסמים ועונשיהן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>חוק / סעיף</th><th>עונש מקסימום</th><th>בפועל</th></tr></thead><tbody>
<tr><td>שימוש בסם (כמות קטנה)</td><td>פקודת הסמים המסוכנים, ס' 7</td><td>3 שנות מאסר</td><td>טיפול, קנס, מאסר על תנאי</td></tr>
<tr><td>החזקה לשימוש עצמי</td><td>ס' 7</td><td>3 שנות מאסר</td><td>לרוב: קנס, מאסר מותנה</td></tr>
<tr><td>החזקה בכמות סחירה</td><td>ס' 7</td><td>20 שנות מאסר</td><td>3-7 שנים בפועל</td></tr>
<tr><td>סחר בסמים</td><td>ס' 13</td><td>20 שנות מאסר</td><td>5-15 שנים בפועל</td></tr>
<tr><td>ייצור סמים</td><td>ס' 6</td><td>25 שנות מאסר</td><td>7-20 שנים בפועל</td></tr>
<tr><td>הברחה בינלאומית</td><td>ס' 13</td><td>25 שנות מאסר + חילוט</td><td>10-25 שנים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>גישת "הביקוש" — הנחות לשימוש עצמי</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>ב-2019 שינתה המשטרה גישתה: נחשדים בהחזקת סמים לשימוש עצמי לרוב אינם נעצרים אלא מקבלים "מכתב כוונות" ומופנים לטיפול. זה אינו חוק רשמי — אלא מדיניות. המשטרה שומרת שיקול דעת לאכוף את החוק המלא.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מהי "כמות סחירה" לפי בית המשפט?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>אין הגדרה כמותית קבועה בחוק. בית המשפט בוחן: כמות, אופן אריזה (חבילות נפרדות = סחר), מציאת כסף מזומן, היסטוריה, ומסרים בטלפון. 10 גרם של קנביס עשויים להיחשב שימוש עצמי; 500 גרם — כמעט בוודאי סחר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם קנביס חוקי בישראל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. קנביס אינו מחוקק בישראל. אולם, אכיפה על שימוש עצמי מינורי ירדה משמעותית מ-2019. שימוש רפואי מאושר בקנביס תחת מרשם רפואי — חוקי לחלוטין.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה עולה עורך דין לעבירת סמים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>החזקה קטנה: 5,000-15,000 ₪. סחר: 30,000-150,000 ₪. הברחה בינלאומית: 80,000-500,000 ₪. ראה <a href="/criminal-lawyer-cost/">מדריך עלות עורך דין פלילי</a>.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">חזרה למדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עבירות סמים בישראל | ענישה, הגנה וגישת הביקוש | Jus-Tice', seo_description: 'עבירות סמים: שימוש עצמי (3 שנות מקסימום) עד הברחה (25 שנה). גישת הביקוש 2019. מה נחשב "כמות סחירה". מדריך 2025.', pillar_keyword: 'עבירות סמים', secondary_keywords: 'סמים ישראל,קנביס ישראל חוקי,עורך דין סמים' }
  ));

  // 4. INHERITANCE TAX
  results.push(await upsert('inheritance-tax-israel', 'מס ירושה בישראל | האם קיים ועל מה משלמים? | Jus-Tice',
    `<!-- wp:paragraph --><p>שאלה שנשאלת לעיתים קרובות: "כמה מס ירושה משלמים בישראל?" התשובה המפתיעה: <strong>בישראל אין מס ירושה.</strong> חוק מס הירושה בוטל בשנת 1981. אולם, יש מיסים אחרים שעשויים לחול בירושה — שלא יוחמצו.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה בוטל ומה עדיין קיים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מס</th><th>מצב</th><th>שיעור</th></tr></thead><tbody>
<tr><td>מס ירושה (Estate tax)</td><td>בוטל 1981</td><td>0%</td></tr>
<tr><td>מס עיזבון (על נכסים)</td><td>אין בישראל</td><td>0%</td></tr>
<tr><td>מס שבח על נדל"ן שהתקבל בירושה</td><td>קיים — עם פטורים חשובים</td><td>0% בפטור / 25% ללא</td></tr>
<tr><td>מס רכישה על ירושה</td><td>פטור מלא ליורשים</td><td>0%</td></tr>
<tr><td>מס על דיבידנד מניות שהתקבלו בירושה</td><td>25% על דיבידנד עתידי</td><td>25% על עתידי בלבד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מס שבח בירושת נדל"ן</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>זהו המס העיקרי שיש לשים לב אליו. כשמוכרים נכס שהתקבל בירושה:</p><!-- /wp:paragraph -->
<!-- wp:list --><ul>
<li><strong>פטור מלא:</strong> אם הנכס היה "דירת מגורים" של המוריש שנפטר, ואתה היורש הישיר (ילד, בן/בת זוג) — פטור מלא ממס שבח בעת מכירה (לפי חוק מיסוי מקרקעין)</li>
<li><strong>מחיר מקורי:</strong> אם אין פטור, מחשבים שבח מהמחיר שקנה המוריש — לא מהשווי בעת הירושה. זה עשוי להיות גדול מאוד</li>
<li><strong>יורש שמוכר מיד:</strong> בדרך כלל אין שבח בסמוך לפטירה (כי שווי השוק = שווי הירושה)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם יורש חייב לדווח לרשות המסים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>על ירושת נדל"ן — כן, יש להגיש הצהרת ירושה ולרשום את הנכס על שמך. על ירושת כספים ומניות — אין חובת דיווח מיוחדת, אך מומלץ להתייעץ עם רואה חשבון.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתכנן מס בירושה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. תכנון נכון כולל: הגדרת מוטבים בקרנות פנסיה וביטוח חיים (עוקפים ירושה ומס), מתנות בחיים תחת גבולות מסוימים, ועריכת ייפוי כוח מתמשך. עורך דין ירושה יכול לייעץ לפני שיש ירושה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/inheritance-lawyer/">חזרה למדריך ירושה</a> | <a href="/will-and-testament/">צוואה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מס ירושה בישראל | האם קיים ועל מה משלמים? | Jus-Tice', seo_description: 'מס ירושה בישראל בוטל ב-1981. אבל מס שבח על נדל"ן שהתקבל בירושה עדיין קיים. מה פטור ומה לא? מדריך מלא 2025.', pillar_keyword: 'מס ירושה ישראל', secondary_keywords: 'האם יש מס ירושה ישראל,מס שבח ירושה,מיסוי ירושה' }
  ));

  // 5. DIVORCE MEDIATION DEEP DIVE
  results.push(await upsert('divorce-mediation-guide', 'גישור גירושין | מה זה, כמה עולה ומתי זה עובד | Jus-Tice',
    `<!-- wp:paragraph --><p>גישור גירושין הוא חלופה להליך ייצוגי מלא — מגשר ניטרלי מסייע לשני ההורים להגיע להסכמות ביניהם. בישראל, כ-30% מהזוגות הפונים לגישור מסיימים אותו בהצלחה עם הסכם. הגישור עולה 50-80% פחות מהליך ייצוגי מלא.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>גישור לעומת ייצוג נפרד</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>גישור</th><th>ייצוג נפרד</th></tr></thead><tbody>
<tr><td>עלות כוללת</td><td>8,000 - 25,000 ₪</td><td>20,000 - 100,000 ₪</td></tr>
<tr><td>משך זמן</td><td>1-4 חודשים</td><td>6 חודשים - 5 שנים</td></tr>
<tr><td>שליטת הזוג</td><td>גבוהה — הצדדים מחליטים</td><td>נמוכה — עורכי דין מנהלים</td></tr>
<tr><td>חשיפה רגשית</td><td>נמוכה יחסית</td><td>גבוהה, ייתכן עיצוב מחדש</td></tr>
<tr><td>תוצאה</td><td>הסכם מוסכם</td><td>פסק דין או הסכם</td></tr>
<tr><td>מתאים כש</td><td>יש בסיס הסכמה</td><td>סכסוך חריף, חוסר אמון</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מתי גישור לא מתאים?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>היסטוריה של אלימות במשפחה (פגיעה בכוח המיקוח)</li>
<li>אחד הצדדים מסרב לגלות נכסים</li>
<li>חוסר אמון מוחלט שמונע דיאלוג</li>
<li>אחד הצדדים אינו מוכן לפשרה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם הסכם גישור מחייב משפטית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הסכם גישור בעצמו אינו מחייב — הוא מסמך עקרונות. לאחר הגישור, עורך דין ממיר אותו להסכם גירושין מחייב שמוגש לאישור בית הדין הרבני או בית המשפט לענייני משפחה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם המגשר מייצג אחד מהצדדים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. המגשר ניטרלי לחלוטין ואינו יכול לייצג אחד מהצדדים לאחר הגישור. רצוי שלכל אחד מהצדדים יהיה עורך דין שסוקר את ההסכם לפני חתימה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">חזרה למדריך דיני משפחה</a> | <a href="/divorce-agreement/">הסכם גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גישור גירושין | עלות, כמה זמן ומתי זה עובד | Jus-Tice', seo_description: 'גישור גירושין: 8,000-25,000 ₪ לעומת 20,000-100,000 לייצוג. 1-4 חודשים. מתי מתאים ומתי לא. מדריך 2025.', pillar_keyword: 'גישור גירושין', secondary_keywords: 'גישור גירושין עלות,מגשר גירושין,גישור לעומת עורך דין' }
  ));

  console.log('\n=== BATCH 4 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
