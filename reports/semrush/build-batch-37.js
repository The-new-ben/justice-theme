/**
 * Batch 37 — Non-compete, age discrimination, inheritance dispute, criminal Ashkelon, RE Yavne
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

  // 1. NON-COMPETE AGREEMENT (high volume labor/contract)
  results.push(await upsert('non-compete-agreement-israel', 'סעיף אי-תחרות בחוזה עבודה | תקף? מחייב? | Jus-Tice',
    `<!-- wp:paragraph --><p>סעיף אי-תחרות (Noncompete) הוא אחד הסעיפים השנויים ביותר במחלוקת בדיני עבודה ישראליים. בית הדין לעבודה נוהג להגביל ואף לבטל סעיפים שנחשבים רחבים מדי — כי הם פוגעים בחופש העיסוק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי סעיף אי-תחרות תקף?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>תקף/לא תקף</th></tr></thead><tbody>
<tr><td>הגבלה ל-6-12 חודשים</td><td>בדרך כלל תקף</td></tr>
<tr><td>הגבלה ל-3-5 שנים</td><td>לרוב לא תקף</td></tr>
<tr><td>הגבלת תחום ספציפי</td><td>תקף יותר</td></tr>
<tr><td>הגבלת כל תחום</td><td>קשה לאכיפה</td></tr>
<tr><td>עם פיצוי תמורת ההגבלה</td><td>תקף יותר</td></tr>
<tr><td>ללא כל פיצוי</td><td>לרוב לא תקף</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לפטר עובד שעובד אצל מתחרה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי. אם העובד חתם על סעיף תקף — כן, ויש גם עילה לתביעת פיצויים. אבל אם הסעיף לא תקף — לא. המבחן: האם הגבלה סבירה ו-proportional? האם ניתן פיצוי?</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/employment-contract-guide/">מדריך חוזה עבודה</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סעיף אי-תחרות בחוזה עבודה | תקף? מחייב? | Jus-Tice', seo_description: 'אי-תחרות: 6-12 חודשים = תקף, 3-5 שנים = לרוב לא. ללא פיצוי = קשה לאכיפה. 6 קריטריונים בטבלה. 2025.', pillar_keyword: 'סעיף אי-תחרות', secondary_keywords: 'noncompete ישראל,הגבלת עיסוק,אי-תחרות עובד' }
  ));

  // 2. AGE DISCRIMINATION AT WORK
  results.push(await upsert('age-discrimination-work', 'אפליית גיל בעבודה | זכויות, תלונה, פיצוי | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק שוויון הזדמנויות בעבודה אוסר אפליית עובד בשל גיל — הן לצעירים (גיל מינימום) והן לבוגרים (מי שסובל מ"ageism"). כ-15-20% מהתלונות על אפליה בישראל נוגעות לגיל. הפיצוי: עד 50,000 ₪ ללא הוכחת נזק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב אפליית גיל?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פיטורים בשל גיל ("אנחנו מחפשים צעירים")</li>
<li>אי-קבלה לעבודה ("יותר מדי מנוסה" / "אין ניסיון")</li>
<li>אי-קידום בשל גיל</li>
<li>שכר נמוך יותר לאדם מבוגר מאותה עבודה</li>
<li>הצקה / הטרדה על גיל</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/discrimination-at-work/">אפליה בעבודה</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפליית גיל בעבודה | זכויות, תלונה, פיצוי | Jus-Tice', seo_description: '15-20% תלונות אפליה = גיל. פיצוי עד 50K ₪ ללא הוכחת נזק. 5 מקרים שנחשבים אפליה. מדריך 2025.', pillar_keyword: 'אפליית גיל בעבודה', secondary_keywords: 'ageism עבודה,אפליה גיל,פיטורים בשל גיל' }
  ));

  // 3. INHERITANCE DISPUTE
  results.push(await upsert('inheritance-dispute', 'סכסוך ירושה בין יורשים | פתרון, ביטול צוואה | Jus-Tice',
    `<!-- wp:paragraph --><p>סכסוך ירושה — בין אחים, בין בן/בת זוג לילדים, או עקב צוואה שנויה במחלוקת — הוא אחד הסכסוכים הרגישים והמורכבים ביותר. כ-15,000-20,000 בקשות לצו ירושה מוגשות בשנה בישראל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עילות נפוצות לסכסוך</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>צוואה שנחשבת לא תקינה (לחץ, חוסר כשרות)</li>
<li>חלוקה לא שוויונית בין ילדים</li>
<li>בן/בת זוג נגד ילדים מנישואין קודמים</li>
<li>נכס שלא נכלל בצוואה</li>
<li>חוב של המוריש שמאיים על הירושה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לערער על צוואה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — תוך 30 ימים מהגשתה (לפני אישורה) או לאחר שהתגלו עובדות חדשות. עילות: (1) חוסר כשרות במועד הצוואה. (2) השפעה בלתי הוגנת. (3) פגם פורמלי. (4) זיוף. ייצוג עורך דין הוא קריטי בהתנגדות לצוואה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/will-and-estate-planning/">צוואה וירושה</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סכסוך ירושה | ביטול צוואה, חלוקת עיזבון | Jus-Tice', seo_description: '15-20K בקשות ירושה/שנה. 5 עילות סכסוך. ערעור על צוואה: 30 יום, 4 עילות. פשרה vs. תביעה. מדריך 2025.', pillar_keyword: 'סכסוך ירושה', secondary_keywords: 'ביטול צוואה,מחלוקת ירושה,חלוקת עיזבון' }
  ));

  // 4. CRIMINAL ASHKELON
  results.push(await upsert('criminal-lawyer-ashkelon', 'עורך דין פלילי אשקלון | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי באשקלון מייצג בבית משפט השלום ובמחוזי. אשקלון — עיר עם צמיחה מהירה בדרום — מאופיינת בתיקי תעבורה, אלימות, ועבירות קשורות לסחר בסמים באזור הדרום.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי באשקלון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>אשקלון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>7,000-30,000 ₪</td><td>10,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי אשקלון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי אשקלון: תעבורה 1K-5K, אלימות 5K-20K, סמים 7K-30K ₪. דרום. מדריך 2025.', pillar_keyword: 'עורך דין פלילי אשקלון' }
  ));

  // 5. REAL ESTATE YAVNE (fast growing tech city)
  results.push(await upsert('real-estate-lawyer-yavne', 'עורך דין מקרקעין יבנה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין ביבנה מטפל בשוק הצומח של עיר פריפריית גוש דן הדרומי — יבנה הפכה לאחת מערי הצמיחה המהירות בשפלה, עם השקעות תשתית ומרכזי היי-טק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין ביבנה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>יבנה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>5,000-13,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין יבנה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין יבנה: רכישה 5K-13K ₪. עיר צומחת שפלה, היי-טק. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין יבנה' }
  ));

  console.log('\n=== BATCH 37 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
