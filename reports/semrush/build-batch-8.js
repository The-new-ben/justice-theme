/**
 * Batch 8 — Criminal sentencing, women divorce rights, inheritance lawyer guide,
 * real estate fees, Rishon city hub, medical malpractice compensation guide
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

  // 1. CRIMINAL SENTENCING
  results.push(await upsert('criminal-sentencing-israel', 'גזר דין פלילי | ענישה, גורמים מקלים ומחמירים | Jus-Tice',
    `<!-- wp:paragraph --><p>גזר דין פלילי הוא השלב האחרון בתיק הפלילי — אחרי הרשעה. השופט שוקל גורמים מקלים ומחמירים ומחליט על העונש. הבנת תהליך זה חשובה הן לנאשם והן לנפגע שיש לו עמדה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי עונשים בגזר דין פלילי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עונש</th><th>מתי</th><th>הערות</th></tr></thead><tbody>
<tr><td>מאסר בפועל</td><td>עבירות חמורות, רצידיביזם</td><td>ניתן להפחית בשירות ב-1/3</td></tr>
<tr><td>מאסר מותנה</td><td>עבירה ראשונה, עבירות בינוניות</td><td>מופעל רק אם עוברים שוב</td></tr>
<tr><td>עבודות שירות</td><td>חלופה לכלא עד 6 חודשים</td><td>עד 480 שעות</td></tr>
<tr><td>קנס</td><td>עבירות קלות/בינוניות</td><td>עד אחוז ממחזור (עסקים)</td></tr>
<tr><td>מאסר בעבודה</td><td>עד 9 חודשים — יוצא לעבוד</td><td>נרשם כמאסר</td></tr>
<tr><td>שירות לתועלת הציבור</td><td>חלופה לקנס / מאסר קצר</td><td>עבודה ללא תשלום</td></tr>
<tr><td>שחרור מוקדם</td><td>לאחר 2/3 מהעונש</td><td>בוועדת שחרורים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>גורמים מקלים בגזר הדין</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>עבריין ראשון (עבר פלילי נקי)</li>
<li>הודאה ושיתוף פעולה עם הרשויות</li>
<li>חרטה אמיתית ותיקון נזקים</li>
<li>גיל (צעיר מאוד או מבוגר מאוד)</li>
<li>מצב בריאותי/משפחתי קשה</li>
<li>נסיבות אישיות חריגות</li>
<li>עסקת טיעון מוסכמת</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>גורמים מחמירים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>עבר פלילי רלוונטי</li>
<li>ריבוי עבירות / עבריין מועד</li>
<li>ניצול פגיעות של הקרבן</li>
<li>תפקיד מנהיגות בעבירה קבוצתית</li>
<li>עבירה על אמון (עמדת כוח)</li>
<li>היעדר חרטה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לערער על גזר הדין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — תוך 45 יום מגזר הדין. הן הנאשם (על חומרה) והן התביעה (על קלות) יכולים לערער. ערעור על גזר הדין אינו מבטל את ההרשעה — רק שואל על העונש.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יושב אסיר לפני שחרור מוקדם?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בעבירות רגילות: 2/3 מהעונש. בעבירות מין וסמים: 3/4. ועדת שחרורים בוחנת: חרטה, סיכון לציבור, תכנית שיקום.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/plea-bargain/">עסקאות טיעון</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גזר דין פלילי | ענישה, גורמים מקלים ומחמירים | Jus-Tice', seo_description: 'גזר דין פלילי: 7 סוגי עונשים, גורמים מקלים ומחמירים. מאסר בפועל, מותנה, עבודות שירות. ערעור תוך 45 יום. מדריך 2025.', pillar_keyword: 'גזר דין פלילי', secondary_keywords: 'ענישה פלילית,גורמים מקלים,שחרור מוקדם' }
  ));

  // 2. WOMEN DIVORCE RIGHTS
  results.push(await upsert('divorce-women-rights-israel', 'זכויות האישה בגירושין | רכוש, מזונות, פנסיה | Jus-Tice',
    `<!-- wp:paragraph --><p>בישראל, מחצית מכלל הגירושין מוגשים על ידי נשים. מעמד האישה בגירושין שופר דרמטית בעשורים האחרונים — חוק יחסי ממון, הלכת השיתוף, ופסיקות בית המשפט העליון חיזקו את זכויותיה. מדריך זה מסביר את הזכויות המרכזיות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות כלכליות בגירושין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>זכות</th><th>מה כוללת</th><th>בסיס משפטי</th></tr></thead><tbody>
<tr><td>חלוקת רכוש שנצבר</td><td>מחצית מכל רכוש שנצבר במהלך הנישואים</td><td>חוק יחסי ממון 1973</td></tr>
<tr><td>פנסיה בגירושין</td><td>מחצית מזכויות הפנסיה שנצברו בנישואים</td><td>חוק יחסי ממון + ס' 11</td></tr>
<tr><td>מזונות אישה</td><td>מזונות לאחר גירושין (מוגבל בחוק ובפסיקה)</td><td>חוק לתיקון דיני משפחה</td></tr>
<tr><td>דמי מחייה לתקופת ביניים</td><td>מזונות עד לסיום הגירושין</td><td>מהירות ביצוע</td></tr>
<tr><td>זכות במגורים</td><td>זכות לגור בדירה המשותפת עד פרידה</td><td>חוק כבוד האדם</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה הייתה "חזקת הגיל הרך" וכיצד השתנה?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>בעבר, חוק הכשרות המשפטית קבע שילדים עד גיל 6 יהיו עם האם ("חזקת הגיל הרך"). בשנות ה-2000 בתי המשפט פרשו זאת מחדש — כיום אין "חזקה" ולא "עדיפות" — רק "טובת הילד". שיעור המשמורת המשותפת עלה מ-21% ב-2012 ל-52% ב-2024.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם אישה שעובדת זכאית למזונות מהבעל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פחות בוודאות. מזונות אישה שאינה עובדת: מחויבים. לאישה עובדת: בית המשפט בוחן את פער ההכנסות. מגמת הפסיקה: מזונות האישה מצטמצמים, בעיקר לתקופת הגירושין, לא לצמיתות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה זכויות האישה בדירה שהייתה של הבעל לפני הנישואים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>דירה שהייתה בבעלות הבעל לפני הנישואים — בדרך כלל לא חולקת. אולם, "עליית ערך" שנוצרה בנישואים עשויה להתחלק. כל מקרה נבחן לגופו — ייעוץ עורך דין הכרחי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/divorce-agreement/">הסכם גירושין</a> | <a href="/divorce-pension-split/">פנסיה בגירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות האישה בגירושין | רכוש, מזונות, פנסיה | Jus-Tice', seo_description: 'זכויות האישה בגירושין: מחצית הרכוש, פנסיה, מזונות. חוק יחסי ממון 1973. חזקת הגיל הרך — מה השתנה. מדריך 2025.', pillar_keyword: 'זכויות האישה בגירושין', secondary_keywords: 'זכויות אישה גירושין,חלוקת רכוש גירושין,מזונות אישה' }
  ));

  // 3. INHERITANCE LAWYER GUIDE (support page for /inheritance-lawyer/ pillar)
  results.push(await upsert('inheritance-lawyer-guide', 'עורך דין ירושה | מה הוא עושה, מתי צריך ומחירים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין ירושה מתמחה בכל הנוגע לצוואות, עיזבונות, ירושה על פי דין, סכסוכי ירושה ומינוי מנהלי עיזבון. מדריך זה מסביר מה עושה עורך הדין, מתי אתם צריכים אחד, וכמה זה עולה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שירותי עורך דין ירושה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>עריכת צוואה ועדכונה</li>
<li>הגשת בקשה לצו ירושה / צו קיום צוואה</li>
<li>ייצוג בסכסוכי ירושה ובהתנגדות לצוואה</li>
<li>מינוי מנהל עיזבון ופיקוח על חלוקה</li>
<li>טיפול בנכסים בחו"ל</li>
<li>תכנון עיזבון (לפני הפטירה)</li>
<li>ייפוי כוח מתמשך</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורך דין ירושה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עלות ממוצעת</th></tr></thead><tbody>
<tr><td>עריכת צוואה (פשוטה)</td><td>1,000 - 3,000 ₪</td></tr>
<tr><td>צו ירושה / קיום צוואה פשוט</td><td>3,000 - 8,000 ₪</td></tr>
<tr><td>צו ירושה עם נדל"ן</td><td>5,000 - 15,000 ₪</td></tr>
<tr><td>התנגדות לצוואה</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>מנהל עיזבון (שכר)</td><td>1-3% משווי העיזבון</td></tr>
<tr><td>תכנון עיזבון מקיף</td><td>5,000 - 25,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם אפשר לנהל ירושה בלי עורך דין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ירושה פשוטה (נכסים מועטים, יורשים מסכימים): כן, ניתן להגיש לרשם הירושות בעצמכם. ירושה עם נדל"ן, עסקים, סכסוך בין יורשים: מומלץ מאוד עורך דין — עלות ייצוג נמוכה לעומת הסיכון.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח לקבל צו ירושה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ללא התנגדויות: 2-4 חודשים מהגשה עד צו. עם נדל"ן: 4-8 חודשים לרישום מלא. עם סכסוך: שנה ויותר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/inheritance-lawyer/">חזרה למדריך ירושה</a> | <a href="/will-and-testament/">צוואה</a> | <a href="/inheritance-dispute/">סכסוך ירושה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין ירושה | שירותים, מחירים ומתי צריך | Jus-Tice', seo_description: 'עורך דין ירושה: צוואה 1K-3K, צו ירושה 3K-8K, סכסוך 15K-80K. מה הוא עושה, מתי לא צריך. מדריך 2025.', pillar_keyword: 'עורך דין ירושה', secondary_keywords: 'צו ירושה,מנהל עיזבון,עורך דין צוואה' }
  ));

  // 4. RISHON LEZION CITY HUB
  results.push(await upsert('lawyers-rishon-lezion', 'עורכי דין בראשון לציון | מדריך לשוק המשפטי | Jus-Tice',
    `<!-- wp:paragraph --><p>ראשון לציון, עם כ-280,000 תושבים, היא העיר הרביעית בגודלה בישראל. לשכת עורכי הדין מחוז מרכז (הכוללת ראשון לציון) מונה כ-12,000 חברים. ראשון לציון משרתת את אחד האזורים הצומחים ביותר בישראל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורכי דין בראשון לציון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>ראשון לציון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>דיני משפחה</td><td>7,000 - 45,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>פלילי</td><td>5,000 - 70,000 ₪</td><td>8,000 - 150,000 ₪</td></tr>
<tr><td>נדל"ן</td><td>6,000 - 25,000 ₪</td><td>8,000 - 40,000 ₪</td></tr>
<tr><td>ייעוץ שעתי</td><td>350 - 1,200 ₪/שעה</td><td>400 - 2,500 ₪/שעה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בתי משפט הפועלים בראשון לציון</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית משפט השלום ראשון לציון:</strong> רוטשילד 4 — תיקים אזרחיים ופליליים</li>
<li><strong>בית הדין לעבודה תל אביב:</strong> סמוך — תביעות עבודה</li>
<li><strong>בית הדין הרבני האזורי תל אביב:</strong> — גט, גירושין דתיים</li>
</ul><!-- /wp:list -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורכי דין ראשון לציון 2025 | מדריך ומחירים | Jus-Tice', seo_description: 'עורכי דין ראשון לציון: מחירים 10-30% נמוכים מתל אביב. 280,000 תושבים, עיר הרביעית. בתי משפט. מדריך 2025.', pillar_keyword: 'עורכי דין ראשון לציון' }
  ));

  // 5. MEDICAL MALPRACTICE HAIFA (city×practice)
  results.push(await upsert('medical-malpractice-haifa', 'רשלנות רפואית חיפה | פיצויים, עורך דין, בתי חולים | Jus-Tice',
    `<!-- wp:paragraph --><p>חיפה מכילה את בית החולים רמב"ם — בית החולים הגדול בצפון — ואת הטכניון-מכון טכנולוגי לישראל עם הפקולטה לרפואה. תביעות רשלנות רפואית בחיפה מוגשות לבית המשפט המחוזי חיפה ולרשם הירושות שם.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>בתי חולים מרכזיים בחיפה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית החולים רמב"ם:</strong> גדול הבתי-חולים בצפון, מרכז טראומה אזורי</li>
<li><strong>בית החולים כרמל:</strong> בית חולים כללי בית חולים מחוז חיפה</li>
<li><strong>בית החולים בני ציון:</strong> גינקולוגיה, מיילדות, פנימית</li>
<li><strong>בית החולים אלין:</strong> שיקום ורפואה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה עורך דין רשלנות רפואית בחיפה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מבנה תמחור</th><th>חיפה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תשלום לפי הצלחה (contingency)</td><td>20-30% מהפיצוי</td><td>25-35% מהפיצוי</td></tr>
<tr><td>עלות חוות דעת מומחה</td><td>6,000 - 20,000 ₪</td><td>8,000 - 25,000 ₪</td></tr>
<tr><td>קנייה עצמאית של מסמכים רפואיים</td><td>100-300 ₪</td><td>100-300 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a> | <a href="/lawyers-haifa/">עורכי דין חיפה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רשלנות רפואית חיפה | עורך דין, פיצויים, בתי חולים | Jus-Tice', seo_description: 'רשלנות רפואית בחיפה: רמב"ם, כרמל, בני ציון. עורך דין 20-30% מהפיצוי. מדריך 2025.', pillar_keyword: 'רשלנות רפואית חיפה' }
  ));

  console.log('\n=== BATCH 8 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
