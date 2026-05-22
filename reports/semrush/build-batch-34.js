/**
 * Batch 34 — RE developer defects, Hadera city, music copyright, startup investment lawyer
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

  // 1. REAL ESTATE DEVELOPER DEFECTS (high volume — all new apartment buyers)
  results.push(await upsert('real-estate-developer-defect', 'ליקויי בניה מקבלן | זכויות, תביעה, מה כולל | Jus-Tice',
    `<!-- wp:paragraph --><p>ליקויי בניה הם עילת תביעה שכיחה בישראל — כמעט כל דירה חדשה מקבלן כוללת ליקויים. חוק המכר (דירות) מגן על הרוכש עם תקופות בדק ואחריות ברורות. כ-60-70% מהרוכשים חדשה מדווחים על ליקויים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תקופות בדק ואחריות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג ליקוי</th><th>תקופת בדק</th><th>תקופת אחריות</th></tr></thead><tbody>
<tr><td>ליקוי רטיבות בגג/מרפסת</td><td>7 שנים</td><td>עד 10 שנים</td></tr>
<tr><td>ליקוי רטיבות כללי</td><td>3 שנים</td><td>עד 7 שנים</td></tr>
<tr><td>עיוות תריסים/מנגנון</td><td>שנה</td><td>עד 3 שנים</td></tr>
<tr><td>ריצוף, מסגרות, אינסטלציה</td><td>2 שנים</td><td>עד 5 שנים</td></tr>
<tr><td>ליקוי מבני (יסודות)</td><td>10 שנים</td><td>עד 20 שנים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם הקבלן לא מתקן?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) שלח מכתב בכתב רשום. 2) שכור מהנדס לחוות דעת. 3) הגש תביעה לתיקון/פיצוי. תביעות ליקויי בניה מנוהלות לרוב בבית משפט שלום. ממוצע פיצוי: 20,000-80,000 ₪. שכ"ט עורך דין: לרוב בהצלחה בלבד.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ליקויי בניה מקבלן | זכויות, תביעה, תקופות | Jus-Tice', seo_description: '60-70% רוכשים = ליקויים. תקופות: גג 7 שנה, מבני 10 שנה. קבלן לא מתקן: 3 צעדים. ממוצע פיצוי 20K-80K.', pillar_keyword: 'ליקויי בניה', secondary_keywords: 'תביעת ליקויי בניה,ליקוי קבלן,חוק מכר דירות' }
  ));

  // 2. CRIMINAL HADERA
  results.push(await upsert('criminal-lawyer-hadera', 'עורך דין פלילי חדרה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בחדרה מייצג בבית משפט השלום. חדרה — עיר בלב הכרמל — מאופיינת בתיקי אלימות, סמים, ועבירות תעבורה. בית משפט השלום חדרה שיפוטית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בחדרה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>חדרה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>4,000-18,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי חדרה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי חדרה: תעבורה 1K-5K, אלימות 4K-18K ₪. בית משפט חדרה. מדריך 2025.', pillar_keyword: 'עורך דין פלילי חדרה' }
  ));

  // 3. FAMILY HADERA
  results.push(await upsert('family-law-hadera', 'עורך דין משפחה חדרה | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בחדרה מייצג בבית המשפט לענייני משפחה. חדרה מייצגת אוכלוסייה מגוונת — עם קהילות ותיקות ועולים חדשים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בחדרה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>חדרה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-11,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-40,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה חדרה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה חדרה: גירושין 4K-40K ₪. אוכלוסייה מגוונת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה חדרה' }
  ));

  // 4. MUSIC COPYRIGHT ISRAEL (IP niche)
  results.push(await upsert('copyright-music-israel', 'זכויות יוצרים במוזיקה ישראל | הגנה, ACUM, תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>זכויות יוצרים במוזיקה הן אחד התחומים המורכבים ביותר בקניין רוחני. ישראל חברה בכינוס ברן ובהסכמים בינלאומיים. אקו"ם (ACUM) ניהלת את זכויות היוצרים המוזיקאליים בישראל. הגנת זכויות: 70 שנה לאחר מות היוצר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי זכאי לזכויות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>מחבר הלחן</li>
<li>מחבר המילים</li>
<li>מפיק ההקלטה (זכות סמוכה)</li>
<li>מבצע (זכות מבצעים)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשאחרים גונבים את המוזיקה שלי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) תעד בעלות (תאריך יצירה, גיבוי, רישום אקו"ם). 2) שלח מכתב cease-and-desist. 3) הגש תביעה אזרחית לפיצויים. ניתן לתבוע פיצוי ללא הוכחת נזק: עד 100,000 ₪ לכל הפרה (חוק זכות יוצרים).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/intellectual-property-israel/">מדריך קניין רוחני</a> | <a href="/trademark-registration-israel/">רישום סימן מסחרי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות יוצרים מוזיקה ישראל | אקו"ם, הגנה, תביעה | Jus-Tice', seo_description: 'זכויות מוזיקה: 4 בעלים שונים. 70 שנה מיות היוצר. גנבו לך: cease-desist + 100K ₪ ללא הוכחת נזק. מדריך 2025.', pillar_keyword: 'זכויות יוצרים מוזיקה', secondary_keywords: 'אקו"ם זכויות יוצרים,הגנת זכויות מוזיקה,תביעת זכויות יוצרים' }
  ));

  // 5. STARTUP INVESTMENT LAWYER (corporate law + VC)
  results.push(await upsert('startup-investment-lawyer', 'עורך דין השקעות סטארטאפ | Term Sheet, SAFEs, מחירים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין לסטארטאפ מתמחה בגיוסי הון, term sheets, חוזי השקעה, ויחסי מייסדים. ישראל — "מדינת הסטארטאפ" — מונה ~8,000 חברות הייטק פעילות. תפקיד עורך הדין בגיוס הון הוא קריטי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שירותים לסטארטאפ</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מחיר</th><th>מתי</th></tr></thead><tbody>
<tr><td>הקמת חברה</td><td>2,000-5,000 ₪</td><td>ייסוד</td></tr>
<tr><td>הסכם מייסדים</td><td>5,000-15,000 ₪</td><td>ייסוד</td></tr>
<tr><td>סבב אנג'ל (Pre-Seed)</td><td>10,000-30,000 ₪</td><td>גיוס ראשון</td></tr>
<tr><td>סבב Seed (VC)</td><td>20,000-60,000 ₪</td><td>סבב Seed</td></tr>
<tr><td>SAFE / Convertible Note</td><td>3,000-10,000 ₪</td><td>גיוס מהיר</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/corporate-law-israel/">מדריך דיני חברות</a> | <a href="/contract-law-israel/">מדריך דיני חוזים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין סטארטאפ והשקעות | Term Sheet, SAFE, מחירים | Jus-Tice', seo_description: '8,000 הייטק בישראל. מייסדים 5K-15K, Seed 20K-60K, SAFE 3K-10K ₪. עורך דין לסטארטאפ מדריך 2025.', pillar_keyword: 'עורך דין סטארטאפ', secondary_keywords: 'עורך דין השקעות הייטק,term sheet ישראל,עורך דין venture capital' }
  ));

  console.log('\n=== BATCH 34 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
