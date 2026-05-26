/**
 * Batch 27 — Workplace harassment guide, guardianship adult, land dispute,
 * criminal appeal process, RE Modiin
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

  // 1. WORKPLACE HARASSMENT GUIDE
  results.push(await upsert('workplace-harassment-guide', 'הטרדה במקום עבודה | זכויות, הגשת תלונה, פיצוי | Jus-Tice',
    `<!-- wp:paragraph --><p>הטרדה במקום עבודה כוללת הטרדה מינית, בריונות, השפלה, ואפליה — כולן אסורות בחוק. ישראל מגנה על עובדים מפני הטרדה ממספר חוקים שונים. מדריך זה מסביר את כל הזכויות ואת הדרכים לפעול.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי הטרדה בעבודה ובסיס חוקי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>חוק</th><th>פיצוי</th></tr></thead><tbody>
<tr><td>הטרדה מינית</td><td>חוק למניעת הטרדה מינית</td><td>עד 120,000 ₪</td></tr>
<tr><td>בריונות/שפלה</td><td>חוק איסור לשון הרע + נזיקין</td><td>עד 50,000 ₪</td></tr>
<tr><td>אפליה (גזע, דת, מין)</td><td>חוק שוויון הזדמנויות</td><td>עד 50,000 ₪ ל"פ</td></tr>
<tr><td>אפליה (הריון, גיל)</td><td>חוק שוויון הזדמנויות</td><td>עד 50,000 ₪</td></tr>
<tr><td>נקמנות לאחר תלונה</td><td>אסורה — נסיבה מחמירה</td><td>מוגדל</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם המעסיק לא מטפל בתלונה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) תעד שהגשת תלונה (כתב, WhatsApp). 2) פנה לנציבות שוויון הזדמנויות. 3) פנה לממונה על הטרדה מינית (אם רלוונטי). 4) הגש תביעה לבית הדין לעבודה. 5) אם בריונות — גם תביעה אזרחית לנזיקין.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/sexual-harassment-work/">הטרדה מינית בעבודה</a> | <a href="/discrimination-at-work/">אפליה בעבודה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הטרדה במקום עבודה | זכויות, תלונה, פיצוי | Jus-Tice', seo_description: '5 סוגי הטרדה בעבודה. פיצוי מינית 120K ₪, בריונות 50K. 5 צעדים אם מעסיק לא מטפל. מדריך 2025.', pillar_keyword: 'הטרדה בעבודה', secondary_keywords: 'בריונות בעבודה,הטרדה במקום עבודה,פיצוי הטרדה עבודה' }
  ));

  // 2. ADULT GUARDIANSHIP
  results.push(await upsert('guardianship-adult-israel', 'אפוטרופסות למבוגר חסר כשרות | מינוי, תפקיד, חלופות | Jus-Tice',
    `<!-- wp:paragraph --><p>אפוטרופסות למבוגר מוענקת לאדם שאינו מסוגל לנהל את ענייניו עצמו — בשל מחלת אלצהיימר, פיגור שכלי, תאונה, או קשיש מגיל. כ-70,000 אפוטרופסויות פעילות בישראל. חוק הכשרות המשפטית מסדיר זאת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי אפוטרופסות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>תחום</th></tr></thead><tbody>
<tr><td>גוף</td><td>בריאות, מקום מגורים, טיפול</td></tr>
<tr><td>רכוש</td><td>נכסים, כסף, חשבונות</td></tr>
<tr><td>כללי</td><td>גוף + רכוש יחד</td></tr>
<tr><td>חלקי</td><td>תחום ספציפי בלבד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>חלופות לאפוטרופסות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>ייפוי כוח מתמשך:</strong> אדם בריא מייפה כוח מראש להחליט עבורו — מומלץ לעשות לפני שמאוחר</li>
<li><strong>תמיכה בקבלת החלטות:</strong> במקום הפקעת כשרות — תמיכה מלווה</li>
<li><strong>נאמן:</strong> לניהול רכוש בלבד, ללא הפקעת כשרות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח למנות אפוטרופוס?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>3-9 חודשים בדרך כלל (עם חוות דעת פסיכיאטרית + דיון בבית משפט). במקרי חירום — ניתן למנות אפוטרופוס זמני תוך ימים. האפוטרופוס מדווח לאפוטרופוס הכללי (מחלקת אפוטרופסות).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/power-of-attorney-guide/">ייפוי כוח</a> | <a href="/disability-rights-israel/">זכויות אנשים עם מוגבלות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפוטרופסות למבוגר חסר כשרות | מינוי, חלופות | Jus-Tice', seo_description: '70,000 אפוטרופסויות פעילות. 4 סוגים. ייפוי כוח מתמשך כחלופה. מינוי: 3-9 חודשים. מדריך 2025.', pillar_keyword: 'אפוטרופסות למבוגר', secondary_keywords: 'אפוטרופסות ישראל,מינוי אפוטרופוס,ייפוי כוח מתמשך' }
  ));

  // 3. CRIMINAL APPEAL PROCESS
  results.push(await upsert('criminal-appeal-process', 'ערעור פלילי | תהליך, עילות, סיכויים | Jus-Tice',
    `<!-- wp:paragraph --><p>ערעור פלילי הוא הגשת בקשה לבית משפט גבוה יותר לבחון מחדש פסיקה של בית משפט נמוך. בישראל: ערעור מבית שלום → מחוזי → עליון. כ-20-30% מהערעורים הפליליים מתקבלים (חלקית או מלאה) בישראל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי ערעור פלילי</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>קבלת פסק הדין + נימוקיו (14-60 יום)</li>
<li>הגשת הודעת ערעור (45 ימים מהרשעה)</li>
<li>הגשת כתב ערעור מפורט (60-90 יום נוספים)</li>
<li>תגובת פרקליטות</li>
<li>דיון בפני הרכב שופטים</li>
<li>פסיקה (ביטול, הפחתה, דחייה)</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>עילות ערעור קלאסיות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>טעות משפטית (פרשנות חוק שגויה)</li>
<li>קביעות עובדתיות שאינן נתמכות בראיות</li>
<li>עונש מוגזם (גם תביעה יכולה לערער)</li>
<li>פגם בהליך (שגיאה דיונית משמעותית)</li>
<li>ראיות חדשות שלא ניתן היה להביאן</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לצאת חופשי בתוך ערעור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ניתן לבקש עיכוב ביצוע מאסר עד לסיום הערעור — אם יש סיכוי ממשי לקבלת הערעור. כ-30-40% מבקשות עיכוב ביצוע מתקבלות. כל מקרה נבחן לגופו.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/criminal-lawyer-cost/">עלות עורך דין פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ערעור פלילי | תהליך, עילות, סיכויי הצלחה | Jus-Tice', seo_description: '20-30% ערעורים מתקבלים. 6-שלב הליך. 5 עילות ערעור. עיכוב ביצוע: 30-40% מאושרים. 45 ימים לערעור. מדריך 2025.', pillar_keyword: 'ערעור פלילי', secondary_keywords: 'ערעור פלילי ישראל,תהליך ערעור,עילות ערעור פלילי' }
  ));

  // 4. REAL ESTATE MODIIN
  results.push(await upsert('real-estate-lawyer-modiin', 'עורך דין מקרקעין מודיעין | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין במודיעין מטפל בשוק של העיר הצעירה ביותר בישראל — עיר שנבנתה מאפס, עם שכונות חדשות מתמיד, קרקעות מינהל, ועלייה מתמדת בערך הנדל"ן. מודיעין היא בין ערי הצמיחה המהירות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין במודיעין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מודיעין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה (קבלן)</td><td>8,000-18,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>רכישת דירה (יד שנייה)</td><td>7,000-15,000 ₪</td><td>11,000-25,000 ₪</td></tr>
<tr><td>ליקויי בנייה</td><td>8,000-30,000 ₪</td><td>10,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין מודיעין | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין מודיעין: רכישה 7K-18K ₪. עיר צומחת, שכונות חדשות, קרקעות מינהל. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין מודיעין' }
  ));

  // 5. OVERTIME PAY ISRAEL
  results.push(await upsert('overtime-pay-israel', 'שעות נוספות בישראל | כמה מגיע, חישוב, מה אסור | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק שעות עבודה ומנוחה, תשי"א-1951 מסדיר שעות נוספות בישראל. עובד שעורכי דין ומנהלים אינם יודעים על פיצויי שעות נוספות — מפסיד אלפי שקלים בשנה. מדריך זה מסביר את החישוב בדיוק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה מגיע עבור שעות נוספות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שעות נוספות</th><th>תוספת</th></tr></thead><tbody>
<tr><td>שתי השעות הראשונות</td><td>125% מהשכר הרגיל</td></tr>
<tr><td>מהשעה השלישית ואילך</td><td>150% מהשכר הרגיל</td></tr>
<tr><td>עבודה בשבת / חג</td><td>150% (+ יום מנוחה חלופי)</td></tr>
<tr><td>שעת גמישות (בהסכמה)</td><td>הסכם קיבוצי/אישי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם "הכל כולל" בחוזה עבודה מבטל שעות נוספות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא בהכרח. בפסיקה: "כולל כל שעות נוספות" תקף רק אם תוספת ב"כולל" מכסה בממוצע את כל שעות נוספות שנעשו בפועל. אם לא — עדיין ניתן לתבוע. פסק דין עליון 5900/09: "כולל שעות נוספות" נבחן על פי תוצאה בפועל.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה שנים ניתן לתבוע שעות נוספות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים (התיישנות). אבל — בית דין לעבודה בפועל מגביל לעיתים ל-3 שנים לאחור בשל שיהוי. מומלץ לא לחכות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/employment-contract-guide/">חוזה עבודה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שעות נוספות בישראל | כמה מגיע, חישוב 2025 | Jus-Tice', seo_description: 'שעות נוספות: 2 ראשונות 125%, מ-3 ואילך 150%. שבת 150%. "כולל שעות נוספות" — לא תמיד חוקי. 7 שנות התיישנות. מדריך 2025.', pillar_keyword: 'שעות נוספות ישראל', secondary_keywords: 'תוספת שעות נוספות,שעות נוספות חוק,חישוב שעות נוספות' }
  ));

  console.log('\n=== BATCH 27 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
