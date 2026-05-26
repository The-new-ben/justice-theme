/**
 * Batch 43 — Personal injury statistics, RE Afula, family Kiryat Gat,
 * employment subcontractor, drunk driving defense
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

  // 1. PERSONAL INJURY STATISTICS 2025 (data journalism — E-E-A-T)
  results.push(await upsert('personal-injury-statistics', 'נזקי גוף בישראל — נתונים 2025 | תביעות, פיצויים | Jus-Tice',
    `<!-- wp:paragraph --><p>נזקי גוף — תאונות דרכים, תאונות עבודה, נפילות, ועוד — הם מהתביעות הנפוצות ביותר בישראל. מדינת ישראל מממנת חלק דרך ביטוח לאומי, אך תביעת נזיקין מול אחראים נדרשת לפיצוי מלא. נתוני 2024.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נתוני נזקי גוף 2024</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קטגוריה</th><th>נתון</th></tr></thead><tbody>
<tr><td>תאונות דרכים עם נפגעים</td><td>~17,500/שנה</td></tr>
<tr><td>תאונות עבודה</td><td>~35,000/שנה</td></tr>
<tr><td>תביעות נזיקין שהוגשו</td><td>~25,000/שנה</td></tr>
<tr><td>ממוצע פיצוי (תאונת דרכים)</td><td>300,000-800,000 ₪</td></tr>
<tr><td>ממוצע פיצוי (תאונת עבודה קשה)</td><td>200,000-600,000 ₪</td></tr>
<tr><td>שיעור תיקים שנסגרים בפשרה</td><td>~75%</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p>מקורות: משטרת ישראל, ביטוח לאומי, משרד העבודה דוחות 2024. | <a href="/personal-injury-claim/">מדריך נזקי גוף</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נזקי גוף ישראל — נתונים 2025 | תביעות, פיצויים | Jus-Tice', seo_description: '17.5K תאונות דרכים. 35K עבודה. פיצוי ממוצע: 300K-800K ₪. 75% בפשרה. 25K תביעות/שנה. מקור: ל"ל 2024.', pillar_keyword: 'נתוני נזקי גוף', secondary_keywords: 'סטטיסטיקת תאונות ישראל,פיצוי ממוצע נזקי גוף,תביעות אישיות נתונים' }
  ));

  // 2. REAL ESTATE AFULA (north, Jezreel Valley)
  results.push(await upsert('real-estate-lawyer-afula', 'עורך דין מקרקעין עפולה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בעפולה מטפל בשוק עמק יזרעאל — עיר מרכזית בצפון עם מחירי נדל"ן נמוכים יחסית לגוש דן. עפולה "בירת עמק יזרעאל" עם תשתית חקלאית ותעשייתית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בעפולה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עפולה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>4,000-10,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין עפולה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין עפולה: רכישה 4K-10K ₪. עמק יזרעאל, בירת הצפון, זול. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין עפולה' }
  ));

  // 3. FAMILY LAW KIRYAT GAT
  results.push(await upsert('family-law-kiryat-gat', 'עורך דין משפחה קריית גת | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בקריית גת מייצג בבית המשפט לענייני משפחה. קריית גת — עיר פיתוח בדרום עם אוכלוסייה מגוונת — מאופיינת בתיקי גירושין, מזונות, ואלימות במשפחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בקריית גת</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>קריית גת</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>3,500-9,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>9,000-35,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה קריית גת | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה קריית גת: גירושין 3.5K-35K ₪. פיתוח דרום, מגוון. מדריך 2025.', pillar_keyword: 'עורך דין משפחה קריית גת' }
  ));

  // 4. EMPLOYMENT SUBCONTRACTOR RIGHTS
  results.push(await upsert('employment-subcontractor', 'קבלן משנה ועובד קבלן | זכויות, אחריות | Jus-Tice',
    `<!-- wp:paragraph --><p>עובד קבלן (קבלן משנה) בישראל מוגן בחוק — גם אם המעסיק הישיר שלו הוא חברת כוח אדם. חוק קבלני משנה (תשנ"ו-1995) מחייב את המזמין לוודא תשלום שכר מינימום וזכויות סוציאליות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות עובד קבלן</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>שכר מינימום (כמו כל עובד)</li>
<li>הפרשות פנסיה מהיום הראשון</li>
<li>חופשה שנתית, מחלה, חגים</li>
<li>אחרי 9 חודשים — המזמין חייב להשתוות בזכויות</li>
<li>פיצויי פיטורים (לפי חוק)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מי אחראי אם קבלן המשנה לא משלם שכר?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>המזמין (החברה שהזמינה את העבודה) אחראי לוודא שהקבלן משלם. אם לא — המזמין עצמו יכול להתחייב. זהו "עיקרון האחריות הנגזרת" בחוק קבלני משנה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'קבלן משנה ועובד קבלן | זכויות, אחריות | Jus-Tice', seo_description: 'עובד קבלן: 5 זכויות. אחרי 9 חודשים = השתוות. מזמין אחראי אם קבלן לא משלם. מדריך 2025.', pillar_keyword: 'עובד קבלן משנה', secondary_keywords: 'זכויות קבלן משנה,עובד כוח אדם,קבלני משנה חוק' }
  ));

  // 5. DRUNK DRIVING DEFENSE
  results.push(await upsert('drunk-driving-defense', 'נהיגה בשכרות | עונשים, הגנה, רישיון | Jus-Tice',
    `<!-- wp:paragraph --><p>נהיגה בשכרות (מעל 0.25 מ"ג/ל) היא עבירה פלילית בישראל. מעל 0.5 מ"ג/ל — עבירה חמורה יותר. כ-6,000-8,000 תיקים בשנה. עורך דין טוב יכול להפחית עונש, למנוע שלילת רישיון, או לזכות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עונשים על נהיגה בשכרות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רמה</th><th>עונש</th></tr></thead><tbody>
<tr><td>0.25-0.5 מ"ג/ל</td><td>קנס + שלילה 3-6 חודשים</td></tr>
<tr><td>מעל 0.5 מ"ג/ל</td><td>שלילה 1-3 שנים + קנס + מאסר אפשרי</td></tr>
<tr><td>נהיגה שכורה עם תאונה</td><td>שלילה 5 שנים + מאסר</td></tr>
<tr><td>עבירה חוזרת</td><td>כפל עונש + ביטול רישיון</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/traffic-violations-guide/">עבירות תעבורה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נהיגה בשכרות | עונשים, הגנה, שלילת רישיון | Jus-Tice', seo_description: '6-8K תיקים/שנה. 0.5+: שלילה 1-3 שנים + מאסר. תאונה: 5 שנים. עבירה חוזרת: כפל. הגנה = עורך דין.', pillar_keyword: 'נהיגה בשכרות', secondary_keywords: 'שכרות נהיגה ישראל,שלילת רישיון שכרות,אלכוהול נהיגה' }
  ));

  console.log('\n=== BATCH 43 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
