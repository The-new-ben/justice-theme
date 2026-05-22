/**
 * Batch 11 — Custody modification, adoption, small claims, more city×practice,
 * pension divorce sub-topic, discrimination at work
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

  // 1. SMALL CLAIMS COURT (cross-pillar, very high search volume)
  results.push(await upsert('small-claims-court-israel', 'בית משפט לתביעות קטנות | כמה, איך ומתי | Jus-Tice',
    `<!-- wp:paragraph --><p>בית משפט לתביעות קטנות הוא ערכאה שנועדה לאזרח הרגיל — ללא עורך דין, ללא נוסחאות משפטיות מורכבות, ובאגרה מינימלית. כ-120,000 תביעות קטנות מוגשות בישראל בשנה. מדריך זה מסביר מה ניתן לתבוע, כמה עולה, ואיך עושים זאת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה ניתן לתבוע בתביעות קטנות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נושא</th><th>ניתן לתבוע?</th></tr></thead><tbody>
<tr><td>פיקדון שכירות שלא הוחזר</td><td>כן</td></tr>
<tr><td>מוצר פגום / שירות לא ניתן</td><td>כן</td></tr>
<tr><td>נזק לרכב ברשלנות</td><td>כן</td></tr>
<tr><td>הטעיה צרכנית</td><td>כן</td></tr>
<tr><td>שכר עבודה שלא שולם</td><td>כן (עד התקרה)</td></tr>
<tr><td>נזקי גוף</td><td>כן (עד התקרה)</td></tr>
<tr><td>גירושין / משמורת</td><td>לא — ערכאה אחרת</td></tr>
<tr><td>חובות גדולים / עסקים</td><td>לא — בית משפט שלום</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>תקרת התביעות ואגרות 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>פרמטר</th><th>סכום</th></tr></thead><tbody>
<tr><td>תקרת תביעה</td><td>33,200 ₪</td></tr>
<tr><td>אגרת תביעה עד 5,000 ₪</td><td>120 ₪</td></tr>
<tr><td>אגרת תביעה 5,001 - 16,000 ₪</td><td>300 ₪</td></tr>
<tr><td>אגרת תביעה 16,001 - 33,200 ₪</td><td>600 ₪</td></tr>
<tr><td>מינוי מומחה (אם נדרש)</td><td>500-3,000 ₪ נוספים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שלבי הגשת תביעה קטנה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>נסה לפתור ישירות מול הנתבע (מכתב רשמי לפני הגשה)</li>
<li>הכן תיעוד: חשבוניות, חוזים, צילומים, עדים</li>
<li>הגש ב-courts.gov.il (אונליין) או בבית המשפט הקרוב</li>
<li>שלם אגרה</li>
<li>קבל מועד דיון (בדרך כלל 2-4 חודשים)</li>
<li>התייצב לדיון — ספר את הסיפור בפשטות</li>
<li>קבל פסק דין (לרוב בתוך 30 יום מהדיון)</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן להביא עורך דין לתביעות קטנות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — אסור לחלוטין. שני הצדדים מייצגים את עצמם. זה מכוון: המטרה היא נגישות לכל אדם ללא עלות ייצוג. אם הנתבע מחב' שמביא משפטן פנימי — ניתן לבקש פסילה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם ניתן פסק דין לטובתי אבל הנתבע לא משלם?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנה להוצאה לפועל. פסק דין תביעות קטנות הוא כמו כל פסק דין — ניתן לאכיפה מלאה: עיקול שכר, חשבון, רכב. אגרת פתיחת תיק הוצל"פ: כ-200 ₪.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a> | <a href="/tenant-rights-israel/">זכויות דייר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'בית משפט לתביעות קטנות | כמה, איך ומתי להגיש | Jus-Tice', seo_description: '120,000 תביעות קטנות בשנה. תקרה 33,200 ₪. אגרה 120-600 ₪. 7 שלבים להגשה. ללא עורך דין. מדריך 2025.', pillar_keyword: 'תביעות קטנות', secondary_keywords: 'בית משפט תביעות קטנות,הגשת תביעה קטנה,תביעה קטנה ישראל' }
  ));

  // 2. CUSTODY MODIFICATION
  results.push(await upsert('custody-modification-israel', 'שינוי הסדרי משמורת | מתי אפשר ואיך עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>פסק דין משמורת אינו קבוע לעולם. ניתן לשנות הסדרי משמורת כאשר יש "שינוי נסיבות מהותי". בישראל, אלפי בקשות לשינוי משמורת מוגשות מדי שנה. ההצלחה תלויה בהוכחת שינוי הנסיבות ובטובת הילד.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב "שינוי נסיבות מהותי"?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שינוי נסיבות</th><th>מהותי?</th><th>דוגמה</th></tr></thead><tbody>
<tr><td>מעבר דירה רחוק של ההורה</td><td>כן</td><td>מתל אביב לחיפה</td></tr>
<tr><td>נישואים מחדש של הורה</td><td>לרוב כן</td><td>בן/בת זוג חדש/ה שמשפיע/ה</td></tr>
<tr><td>שינוי משמעותי בהכנסה</td><td>כן (לעניין מזונות)</td><td>פיטורים, עלייה גדולה</td></tr>
<tr><td>פגיעה ברווחת הילד</td><td>בוודאות כן</td><td>חשיפה לאלימות, הזנחה</td></tr>
<tr><td>משאלות הילד (גיל מבוגר)</td><td>כן — עם ייחוס משקל</td><td>ילד מעל 12 מבקש לשנות</td></tr>
<tr><td>שינוי בשעות עבודה</td><td>לרוב לא מספיק לבד</td><td>אם לא משפיע על הילד</td></tr>
<tr><td>מחלה קשה של הורה</td><td>כן</td><td>מגבלה ביכולת טיפול</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>ההליך — כיצד מגישים בקשה לשינוי משמורת</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנה לבית המשפט לענייני משפחה שנתן את הפסק המקורי</li>
<li>הגש "בקשה לשינוי הסדרי משמורת" עם תצהיר מפורט</li>
<li>בית המשפט יזמן עובדת סוציאלית לבחינת הנסיבות</li>
<li>דיון בפני שופט — לרוב תוך 2-4 חודשים</li>
<li>פסק דין המבוסס על טובת הילד בלבד</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ילד יכול לבחור אצל מי לגור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ילד מתחת לגיל 12: דעתו נשמעת אך לא מחייבת. מעל 12: בית המשפט נותן משקל משמעותי לרצונו, אך הוא עדיין שוקל טובת הילד כוליה. ילד מעל 14: רצונו המוצהר מקבל משקל גבוה מאוד.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה עולה הליך שינוי משמורת?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בהסכמה: 3,000-10,000 ₪ לייצוג. בסכסוך: 15,000-50,000 ₪. עובדת סוציאלית מטעם בית המשפט: ללא תשלום.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-custody-guide/">מדריך משמורת ילדים</a> | <a href="/joint-custody/">משמורת משותפת</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שינוי הסדרי משמורת | מתי אפשר ואיך עושים | Jus-Tice', seo_description: 'שינוי הסדרי משמורת: שינוי נסיבות מהותי (מעבר, פגיעה, נישואים). 5-שלב הליך. עלות 3K-50K. מדריך 2025.', pillar_keyword: 'שינוי משמורת', secondary_keywords: 'בקשה לשינוי משמורת,שינוי הסדרי ראיית ילדים' }
  ));

  // 3. DISCRIMINATION AT WORK
  results.push(await upsert('discrimination-at-work', 'אפליה בעבודה | זכויות, תביעה ופיצויים | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק שוויון הזדמנויות בעבודה, תשמ"ח-1988 אוסר על אפליה בכל שלבי העסקה — קבלה לעבודה, תנאים, קידום, ופיטורים. כ-3,000 תביעות אפליה מוגשות לבית הדין לעבודה בשנה. הפיצויים יכולים להגיע ל-200,000 ₪ ויותר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>על מה אסור לפלות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מאפיין מוגן</th><th>חוק</th><th>פיצוי מקסימום</th></tr></thead><tbody>
<tr><td>מין / מגדר</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
<tr><td>גיל (45+)</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
<tr><td>הריון / לידה</td><td>חוק עבודת נשים</td><td>שכר 150 ימים + 200,000 ₪</td></tr>
<tr><td>נכות / מוגבלות</td><td>חוק שוויון לאנשים עם מוגבלות</td><td>בלא הגבלה</td></tr>
<tr><td>לאום / גזע / מוצא</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
<tr><td>דת / ארץ מוצא</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
<tr><td>מעמד אישי (נשוי/גרוש)</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
<tr><td>מיניות</td><td>חוק שוויון הזדמנויות</td><td>בלא הגבלה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה צריך להוכיח?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>בתביעת אפליה, נטל ההוכחה מדורג: ראשית, על התובע להוכיח שהיה מאפיין מוגן ושהחלטת המעסיק השפיעה עליו לרעה. אז — עובר הנטל למעסיק להוכיח שהחלטתו הייתה מסיבות לגיטימיות אחרות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תביעת אפליה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>3 שנים ממועד ביצוע המעשה המפלה. תביעות אפליה בגין פיטורים: 3 שנים מיום הפיטורים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לזהות אפליה בגיוס (ראיונות)?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — שאלות אסורות בראיון עבודה: גיל, הריון, מצב משפחתי, מצב בריאותי, דת, לאום. שאלת מעסיק על נושאים אלה היא בעצמה עבירה על החוק.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפליה בעבודה | זכויות, תביעה ופיצויים | Jus-Tice', seo_description: 'אפליה בעבודה: 3,000 תביעות בשנה. 8 מאפיינים מוגנים. פיצויים ללא הגבלה. 3 שנות התיישנות. מדריך 2025.', pillar_keyword: 'אפליה בעבודה', secondary_keywords: 'שוויון הזדמנויות,תביעת אפליה,אפליה גיוס' }
  ));

  // 4. CRIMINAL LAWYER HAIFA
  results.push(await upsert('criminal-lawyer-haifa', 'עורך דין פלילי חיפה | מחירים, בתי משפט, ייצוג | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בחיפה מייצג בבית המשפט המחוזי ובית משפט השלום חיפה. חיפה מאופיינת במגוון אוכלוסייה ובעבירות שמשקפות את המאפיינים הגאוגרפיים: יבוא-ייצוא, נמל, ותעשייה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בחיפה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>חיפה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>עבירת תעבורה</td><td>1,500-7,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-25,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>8,000-40,000 ₪</td><td>10,000-50,000 ₪</td></tr>
<tr><td>עבירות נמל / ייצוא</td><td>20,000-100,000 ₪</td><td>מקביל</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בתי משפט פליליים בחיפה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט המחוזי חיפה:</strong> פל-ים 1 — עבירות חמורות, ערעורים</li>
<li><strong>בית משפט השלום חיפה:</strong> פל-ים 1 — עבירות יומיומיות</li>
<li><strong>מחלקת חקירות חיפה:</strong> — חקירות מחוז חיפה</li>
</ul><!-- /wp:list -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/lawyers-haifa/">עורכי דין חיפה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי חיפה | מחירים, בתי משפט | Jus-Tice', seo_description: 'עורך דין פלילי חיפה: תעבורה 1.5K-7K, אלימות 6K-25K, נמל/ייצוא 20K-100K. בתי משפט. מדריך 2025.', pillar_keyword: 'עורך דין פלילי חיפה' }
  ));

  // 5. MEDICAL MALPRACTICE TEL AVIV
  results.push(await upsert('medical-malpractice-tel-aviv', 'רשלנות רפואית תל אביב | עורך דין, בתי חולים | Jus-Tice',
    `<!-- wp:paragraph --><p>תל אביב היא מרכז הרפואה הפרטית בישראל — ועם ריכוז גבוה של בתי חולים: איכילוב, אסותא, בלינסון (פתח תקווה), ועוד. תביעות רשלנות רפואית מוגשות לבית המשפט המחוזי תל אביב ומלוות לרוב בחוות דעת מומחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>בתי חולים מרכזיים באזור תל אביב</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>איכילוב (בי"ח סוראסקי):</strong> אחד הגדולים בישראל — מחלקות כל תחומי הרפואה</li>
<li><strong>אסותא תל אביב:</strong> מרכז פרטי — ניתוחים, גינקולוגיה, קרדיולוגיה</li>
<li><strong>שניידר לילדים:</strong> פתח תקווה — מרכז ילדים ייחודי בישראל</li>
<li><strong>בלינסון:</strong> פתח תקווה — בית חולים גדול, מתמחה בלב, נוירולוגיה</li>
<li><strong>בילינסון מסאדה:</strong> — מרכז גריאטריה ושיקום</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה עורך דין רשלנות רפואית בתל אביב?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>תל אביב</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>תשלום לפי הצלחה (contingency)</td><td>25-35%</td><td>20-30%</td></tr>
<tr><td>חוות דעת מומחה</td><td>8,000-25,000 ₪</td><td>6,000-20,000 ₪</td></tr>
<tr><td>ייצוג + הכנת תיק</td><td>תשלום לפי הצלחה</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a> | <a href="/lawyers-tel-aviv/">עורכי דין תל אביב</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רשלנות רפואית תל אביב | עורך דין, בתי חולים | Jus-Tice', seo_description: 'רשלנות רפואית בתל אביב: איכילוב, אסותא, שניידר. עורך דין 25-35% מהפיצוי. מדריך 2025.', pillar_keyword: 'רשלנות רפואית תל אביב' }
  ));

  // 6. FAMILY LAW BEER SHEVA
  results.push(await upsert('family-law-beer-sheva', 'עורך דין משפחה באר שבע | גירושין, מזונות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בבאר שבע מייצג בבית המשפט לענייני משפחה דרום ובבית הדין הרבני באזור. מחירי הייצוג בדרום נמוכים ב-30-40% ממרכז הארץ.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין משפחה בבאר שבע?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>באר שבע</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000 - 12,000 ₪</td><td>8,000 - 20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000 - 55,000 ₪</td><td>20,000 - 80,000 ₪</td></tr>
<tr><td>ייצוג בדיון מזונות</td><td>2,500 - 10,000 ₪</td><td>4,000 - 15,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0 - 350 ₪</td><td>0 - 500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p>בית המשפט לענייני משפחה באר שבע: הנשיא הרצוג 3, באר שבע. בית הדין הרבני: ברוך 7, באר שבע.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/lawyers-beer-sheva/">עורכי דין באר שבע</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה באר שבע | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה באר שבע: גירושין 4K-55K ₪, 30-40% פחות מהמרכז. בית משפט הרצוג 3. מדריך 2025.', pillar_keyword: 'עורך דין משפחה באר שבע' }
  ));

  console.log('\n=== BATCH 11 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
