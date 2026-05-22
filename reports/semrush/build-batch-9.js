/**
 * Batch 9 — Sexual harassment, fraud, workplace accidents, adoption,
 * city×practice pages, surgical malpractice deep-dive
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

  // 1. SEXUAL HARASSMENT IN THE WORKPLACE
  results.push(await upsert('sexual-harassment-work', 'הטרדה מינית בעבודה | זכויות, תלונה ופיצויים | Jus-Tice',
    `<!-- wp:paragraph --><p>הטרדה מינית בעבודה מוסדרת בחוק למניעת הטרדה מינית, תשנ"ח-1998 — אחד החוקים המתקדמים בעולם בתחום זה. כ-5,000-7,000 תלונות מוגשות לרשות האיסור הפלילי מדי שנה. הפיצויים עשויים להגיע לעשרות אלפי שקלים — גם ללא הוכחת נזק ספציפי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב הטרדה מינית לפי החוק?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג התנהגות</th><th>האם הטרדה מינית?</th></tr></thead><tbody>
<tr><td>ניסיונות חוזרים לקשר מיני לאחר סירוב</td><td>כן</td></tr>
<tr><td>הצעות מיניות שאינן רצויות</td><td>כן</td></tr>
<tr><td>התייחסות מינית משפילה / פוגעת</td><td>כן</td></tr>
<tr><td>פרסום תמונות מיניות ללא הסכמה</td><td>כן</td></tr>
<tr><td>מגע פיזי לא רצוי</td><td>כן</td></tr>
<tr><td>חד-פעמי (בהצעה מיני לעובד/ת) אם כרוך בסמכות</td><td>כן — גם חד-פעמי מספיק</td></tr>
<tr><td>ביקורת מקצועית על עבודה</td><td>לא</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>חובות המעסיק</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>מינוי אחראי על מניעת הטרדה מינית</li>
<li>הצגת תקנון (חובה לפי חוק) בכל מקום עבודה</li>
<li>בדיקת תלונות ביסודיות ובאופן מיידי</li>
<li>הגנה על המתלוננ/ת מפני פגיעה (אסור לפטר בגלל תלונה)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>פיצויים בהטרדה מינית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פיצוי ללא הוכחת נזק: עד 120,000 ₪ (חוק)</li>
<li>פיצוי עם הוכחת נזק (עוגמת נפש, נזק נפשי): בלא הגבלה</li>
<li>פיצוי נוסף נגד המעסיק: על הפרת חובת המעסיק</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשמוטרדים מינית בעבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1. תעד הכל (הודעות, עדים, תאריכים). 2. פנה לאחראי/ת על מניעת הטרדה מינית בארגון. 3. הגש תלונה משטרתית אם מדובר בעבירה פלילית. 4. פנה לבית הדין לעבודה עם תביעה. 5. קבל ייעוץ עורך דין — רבים מציעים ייעוץ ראשוני ללא תשלום.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם גבר יכול להיות קרבן הטרדה מינית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. חוק הטרדה מינית חל על כל מגדר. גברים מדווחים פחות — אבל הם מוגנים באותה מידה. כ-10-15% מהתלונות מוגשות על ידי גברים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הטרדה מינית בעבודה | זכויות, תלונה ופיצויים עד 120K ₪ | Jus-Tice', seo_description: 'הטרדה מינית בעבודה: 5,000-7,000 תלונות בשנה. פיצוי ללא נזק עד 120,000 ₪. חובות מעסיק. מה עושים. מדריך 2025.', pillar_keyword: 'הטרדה מינית בעבודה', secondary_keywords: 'הטרדה מינית,תלונה הטרדה מינית,פיצויים הטרדה מינית' }
  ));

  // 2. FRAUD OFFENSES
  results.push(await upsert('fraud-offenses-israel', 'עבירות הונאה ומרמה | סוגים, ענישה והגנה | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירות הונאה ומרמה הן מהעבירות הכלכליות הנפוצות ביותר — לפי נתוני המשטרה, כ-15,000 תיקי הונאה נפתחים בשנה. ההגנה על נאשם בהונאה מורכבת ודורשת הבנה של דיני הראיות, מסמכים פיננסיים וחקירות סייבר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי עבירות הונאה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>חוק / סעיף</th><th>עונש מקסימום</th></tr></thead><tbody>
<tr><td>מרמה (fraud)</td><td>עיסקאות מרמה ס' 415</td><td>3 שנות מאסר</td></tr>
<tr><td>הונאה בנסיבות מחמירות</td><td>ס' 415 + גורמים מחמירים</td><td>7 שנות מאסר</td></tr>
<tr><td>קבלת דבר במרמה</td><td>ס' 415</td><td>3 שנים</td></tr>
<tr><td>זיוף מסמך</td><td>ס' 418</td><td>7 שנות מאסר</td></tr>
<tr><td>הלבנת הון</td><td>חוק איסור הלבנת הון</td><td>10 שנים + חילוט</td></tr>
<tr><td>הונאה בניירות ערך</td><td>חוק ניירות ערך</td><td>5-10 שנים</td></tr>
<tr><td>מחשב ומרמה (phishing)</td><td>חוק המחשבים + ס' 415</td><td>5-7 שנים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הגנות נפוצות בתיקי הונאה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>חוסר כוונה:</strong> הונאה דורשת כוונה תרמיתית — טעות כנה אינה עבירה</li>
<li><strong>ראיות לא קבילות:</strong> ראיות שהושגו שלא כחוק עשויות להידחות</li>
<li><strong>עסקת טיעון:</strong> שיתוף פעולה עשוי להביא להקלה משמעותית</li>
<li><strong>התיישנות:</strong> ברוב עבירות ההונאה — 7 שנים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם יש הבדל בין עורך דין פלילי רגיל לכלכלי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. עורך דין כלכלי-פלילי מתמחה בתיקים פיננסיים: הבנת דוחות, מסמכים עסקיים, חקירות רשות ניירות ערך. לתיק הונאה מורכב — מומלץ עורך דין עם ניסיון ספציפי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/white-collar-crime-israel/">עבירות צווארון לבן</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עבירות הונאה ומרמה | סוגים, ענישה והגנה | Jus-Tice', seo_description: '15,000 תיקי הונאה בשנה. מרמה: 3-7 שנים. הלבנת הון: 10 שנים. הגנות נפוצות. עורך דין כלכלי. מדריך 2025.', pillar_keyword: 'עבירות הונאה', secondary_keywords: 'מרמה פלילית,הלבנת הון,עורך דין הונאה' }
  ));

  // 3. WORKPLACE ACCIDENT GUIDE
  results.push(await upsert('workplace-accident-guide', 'תאונת עבודה | זכויות, פיצויים ומה עושים מיד | Jus-Tice',
    `<!-- wp:paragraph --><p>כ-30,000 תאונות עבודה מדווחות מדי שנה בישראל לביטוח הלאומי. נפגע תאונת עבודה זכאי למסלול כפול: מהביטוח הלאומי (גמלה) ובנוסף — תביעת נזיקין מהמעסיק או מצד שלישי. הבנת שני המסלולים יכולה להכפיל את הפיצוי הכולל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלול א': ביטוח לאומי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>גמלה</th><th>פרטים</th></tr></thead><tbody>
<tr><td>דמי פגיעה</td><td>75% שכר ל-90 יום ראשונים</td></tr>
<tr><td>נכות מעבודה</td><td>לפי % נכות, עד 100% שכר ממוצע במשק</td></tr>
<tr><td>שיקום מקצועי</td><td>הכשרה מחדש אם לא ניתן לחזור לעבודה קודמת</td></tr>
<tr><td>קצבת שאירים</td><td>אם נפגע נפטר — לבן/בת הזוג וילדים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מסלול ב': תביעת נזיקין</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>בנוסף לביטוח לאומי, ניתן לתבוע פיצויים אזרחיים מ:</p><!-- /wp:paragraph -->
<!-- wp:list --><ul>
<li><strong>המעסיק:</strong> אם רשלנות, הפרת בטיחות, סיכון בלתי סביר</li>
<li><strong>יצרן ציוד:</strong> אם ציוד פגום גרם לתאונה</li>
<li><strong>קבלן ראשי / משנה:</strong> בתאונות בנייה ותשתית</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה עושים מיד לאחר תאונת עבודה?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>קבל טיפול רפואי מיידי</li>
<li>דווח למעסיק בכתב עוד ביום התאונה</li>
<li>שמור כל מסמך רפואי, מרשם, קבלה</li>
<li>צלם את זירת האירוע אם ניתן</li>
<li>אסוף שמות עדים</li>
<li>הגש תביעה לביטוח לאומי תוך 90 יום</li>
<li>התייעץ עם עורך דין נזיקין לפני חתימת כל מסמך</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם עובד עצמאי מכוסה בתאונת עבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם עצמאי מבוטח בביטוח לאומי (חובה). אולם, אין להם מעסיק לתבוע — ניתן לתבוע יצרן ציוד, בעל הנכס שבו עבדו, וכד'. ברוב המקרים מסלול הביטוח הלאומי הוא המסלול העיקרי.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה ה"כירסום" (קיזוז) בין ביטוח לאומי לפיצויים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ביטוח לאומי מקזז מהפיצויים האזרחיים שקיבלת. כלומר, הסכום הכולל אינו ביטוח לאומי + פיצויים — אלא הפיצויים האזרחיים מפצים על מה שמעבר לביטוח הלאומי. עורך דין מנוסה יחשב את הפיצוי הנכון.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/personal-injury-israel/">נזקי גוף</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תאונת עבודה | זכויות, פיצויים ומה עושים | Jus-Tice', seo_description: '30,000 תאונות עבודה בשנה. מסלול כפול: ביטוח לאומי (75% שכר) + תביעת נזיקין. 7 צעדים מיידיים. מדריך 2025.', pillar_keyword: 'תאונת עבודה', secondary_keywords: 'תאונת עבודה פיצויים,ביטוח לאומי תאונה,תביעת מעסיק' }
  ));

  // 4. FAMILY LAW RISHON LEZION
  results.push(await upsert('family-law-rishon-lezion', 'עורך דין משפחה ראשון לציון | גירושין, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בראשון לציון מייצג בבית משפט לענייני משפחה ובבית הדין הרבני. ראשון לציון עם 280,000 תושבים היא עיר בצמיחה מהירה — שוק עורכי הדין פעיל ותחרותי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין משפחה בראשון לציון?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ראשון לציון</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>6,000 - 18,000 ₪</td><td>8,000 - 20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>18,000 - 75,000 ₪</td><td>20,000 - 80,000 ₪</td></tr>
<tr><td>ייצוג בדיון מזונות</td><td>3,500 - 14,000 ₪</td><td>4,000 - 15,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0 - 450 ₪</td><td>0 - 500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p>בית משפט לענייני משפחה ראשון לציון: רוטשילד 4, ראשון לציון. הגשת תביעות: ניתן פיזית ובפורטל courts.gov.il.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/lawyers-rishon-lezion/">עורכי דין ראשון לציון</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה ראשון לציון | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה ראשון לציון: גירושין 6K-75K ₪. בית משפט משפחה רוטשילד 4. מחירים לפי שירות 2025.', pillar_keyword: 'עורך דין משפחה ראשון לציון' }
  ));

  // 5. SURGICAL MALPRACTICE
  results.push(await upsert('medical-malpractice-surgery', 'רשלנות בניתוח | סוגים, פיצויים ואיך מוכיחים | Jus-Tice',
    `<!-- wp:paragraph --><p>רשלנות ניתוחית היא אחת מקטגוריות הרשלנות הרפואית בעלות הפיצויים הגבוהים ביותר. כ-2,000 תביעות על ניתוחים מוגשות בישראל בשנה. הוכחת רשלנות בניתוח דורשת חוות דעת מומחה כירורג.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי רשלנות ניתוחית</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>דוגמה</th><th>פיצוי ממוצע</th></tr></thead><tbody>
<tr><td>ניקוב / חיתוך שגוי</td><td>פגיעה בעורק, מעי, עצב</td><td>200,000 - 2,000,000 ₪</td></tr>
<tr><td>שכחת ציוד בגוף</td><td>גאז, מלקח, מחט</td><td>100,000 - 500,000 ₪</td></tr>
<tr><td>ניתוח לא נדרש</td><td>ניתוח מיותר שנגרם מאבחנה שגויה</td><td>50,000 - 300,000 ₪</td></tr>
<tr><td>ניהול הרדמה שגוי</td><td>אובר-דוז הרדמה, היפוקסיה</td><td>500,000 - 5,000,000 ₪</td></tr>
<tr><td>זיהום ניתוחי (עקב רשלנות)</td><td>אי-עמידה בפרוטוקול סטריליזציה</td><td>100,000 - 1,000,000 ₪</td></tr>
<tr><td>אי-הסכמה מדעת</td><td>לא הוסברו הסיכונים</td><td>30,000 - 150,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד מוכיחים רשלנות ניתוחית?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>תיק רפואי מלא (ניתוח, אנסתזיה, הנקה)</li>
<li>חוות דעת כירורג מומחה</li>
<li>השוואה לסטנדרט הטיפול המקובל</li>
<li>הוכחת קשר סיבתי בין הרשלנות לנזק</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תביעת רשלנות ניתוחית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים מיום גילוי הנזק. לניתוחים שנסיבות הנזק התגלו מאוחר — "מרוץ ההתיישנות" מתחיל מגילוי, לא מהניתוח. לקטינים: 7 שנים מגיל 18.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם סיבוך ניתוחי = רשלנות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא בהכרח. כל ניתוח כרוך בסיכונים ידועים. רשלנות היא כאשר הרופא חרג מהסטנדרט המקובל — לא כאשר ארע סיבוך ידוע שנכלל בהסכמה. לכן חוות דעת מומחה קריטית.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a> | <a href="/birth-injury-compensation/">נזקי לידה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רשלנות בניתוח | פיצויים, סוגים ואיך מוכיחים | Jus-Tice', seo_description: '2,000 תביעות ניתוח בשנה. ניקוב שגוי 200K-2M, הרדמה שגויה 500K-5M. כיצד מוכיחים. סיבוך ≠ רשלנות. מדריך 2025.', pillar_keyword: 'רשלנות ניתוח', secondary_keywords: 'רשלנות רפואית ניתוח,ניתוח שגוי פיצויים,רשלנות ניתוחית' }
  ));

  console.log('\n=== BATCH 9 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
