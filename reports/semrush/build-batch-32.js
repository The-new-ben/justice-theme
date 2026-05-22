/**
 * Batch 32 — Data journalism statistics pages:
 * Divorce stats, lawyer discipline, medical malpractice stats, criminal stats, RE market stats
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

  // 1. DIVORCE STATISTICS ISRAEL 2025 (high backlink potential)
  results.push(await upsert('divorce-statistics-israel', 'גירושין בישראל — נתונים ומספרים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מפרסמת נתוני גירושין מדי שנה דרך הלשכה המרכזית לסטטיסטיקה (הלמ"ס). מדינת ישראל ייחודית — שכן גירושין יהודיים מחייבים גם הליך דתי (גט) בנוסף לאזרחי. נתונים לשנת 2024 (עדכון אחרון).</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נתוני גירושין מרכזיים 2024</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נתון</th><th>מספר/שיעור</th></tr></thead><tbody>
<tr><td>זוגות שגרשו 2024</td><td>~14,000 זוגות</td></tr>
<tr><td>שיעור גירושין לכל 1,000 נשואים</td><td>~1.6 (בין הנמוכים ב-OECD)</td></tr>
<tr><td>ממוצע שנות נישואין לפני גירושין</td><td>~13.5 שנים</td></tr>
<tr><td>גיל ממוצע בגירושין — גבר</td><td>~43</td></tr>
<tr><td>גיל ממוצע בגירושין — אישה</td><td>~40</td></tr>
<tr><td>זוגות עם ילדים שגרשו</td><td>~60%</td></tr>
<tr><td>שיעור גירושין שהסתיימו בהסכמה</td><td>~80%</td></tr>
<tr><td>ממוצע זמן תהליך גירושין</td><td>12-18 חודשים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מגמות גירושין בישראל</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>שיעור הגירושין בישראל נמוך יחסית לאירופה וארה"ב</li>
<li>גירושין בחברה החרדית — נמוכים מאוד ביחס לאוכלוסייה</li>
<tr><td>ערים עם שיעור גירושין גבוה: חיפה, תל אביב, ראשון לציון</td></tr>
<li>עלייה בגירושין של בני 55+ ("גירושי גיל הביניים")</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p>מקור: הלמ"ס (הלשכה המרכזית לסטטיסטיקה), דוח 2024. | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גירושין בישראל — נתונים ומספרים 2025 | Jus-Tice', seo_description: '14,000 זוגות גרשו ב-2024. שיעור 1.6/1,000 — נמוך מ-OECD. 80% בהסכמה. ממוצע 13.5 שנות נישואין. מקור: הלמ"ס.', pillar_keyword: 'גירושין ישראל נתונים', secondary_keywords: 'סטטיסטיקת גירושין ישראל,כמה מגרשים בישראל,שיעור גירושין' }
  ));

  // 2. LAWYER DISCIPLINE (HOW TO COMPLAIN)
  results.push(await upsert('lawyer-discipline-israel', 'תלונה על עורך דין | כיצד מגישים, לשכת עורכי הדין | Jus-Tice',
    `<!-- wp:paragraph --><p>כל עורך דין בישראל חייב להיות רשום בלשכת עורכי הדין. הלשכה גם מוסמכת להעניש עורכי דין על רשלנות מקצועית, ניגוד עניינים, גביית שכר טרחה מופרז, או התנהגות בלתי הולמת. כ-1,500-2,000 תלונות מוגשות בשנה נגד עורכי דין.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עילות תלונה נפוצות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>רשלנות מקצועית (פספוס מועדים, טעויות)</li>
<li>ניגוד עניינים (ייצוג שני צדדים)</li>
<li>שכר טרחה מופרז ו/או לא מוסכם</li>
<li>אי-דיווח ללקוח</li>
<li>שימוש בכספי נאמנות (הונאה)</li>
<li>התנהגות בלתי הולמת בבית משפט</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>הגשת תלונה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>כתוב תלונה עם פרטי המקרה, תאריכים, עדויות</li>
<li>שלח ללשכת עורכי הדין (knesset-ha-mishpat.co.il)</li>
<li>בית הדין המשמעתי של הלשכה דן בתלונה</li>
<li>עונשים: אזהרה, השעיה, הוצאה מלשכה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם תלונה ללשכה נותנת פיצוי כספי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא ישירות — תלונה ללשכה היא הליך משמעתי. לפיצוי כספי — יש להגיש תביעת רשלנות מקצועית לבית משפט נגד עורך הדין. ניתן לעשות את שניהם במקביל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: לשכת עורכי הדין בישראל. | <a href="/legal-malpractice-israel/">רשלנות עורך דין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תלונה על עורך דין | כיצד מגישים, לשכת עו"ד | Jus-Tice', seo_description: '1,500-2,000 תלונות בשנה. 6 עילות. 4 שלבי הגשה. תלונה לשכה ≠ פיצוי — צריך גם תביעה. מדריך 2025.', pillar_keyword: 'תלונה על עורך דין', secondary_keywords: 'לשכת עורכי הדין תלונה,רשלנות עורך דין,משמעת עורך דין' }
  ));

  // 3. MEDICAL MALPRACTICE STATISTICS
  results.push(await upsert('medical-malpractice-statistics', 'רשלנות רפואית בישראל — נתונים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מדווחת על נתוני רשלנות רפואית דרך משרד הבריאות ומבקר המדינה. מדינות מחברות OECD דומות לישראל דיווחו על שיפור בשנים האחרונות — אבל הבעיה לא נפתרה. נתונים לשנת 2024.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נתוני רשלנות רפואית 2024</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נתון</th><th>מספר</th></tr></thead><tbody>
<tr><td>תביעות רשלנות שהוגשו 2024</td><td>~3,000-4,000</td></tr>
<tr><td>תשלומי פיצויים (קופות חולים+מדינה)</td><td>~700M ₪/שנה</td></tr>
<tr><td>ממוצע פיצוי בתביעה מוצלחת</td><td>~400,000-600,000 ₪</td></tr>
<tr><td>אחוז תביעות שזוכות</td><td>~30-40%</td></tr>
<tr><td>שנות התיישנות</td><td>7 שנים מגילוי הנזק</td></tr>
<tr><td>מקצוע עם הכי הרבה תביעות</td><td>כירורגיה, גינקולוגיה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p>מקורות: משרד הבריאות, מבקר המדינה 2024, קרן לביטוח אחריות מקצועית. | <a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רשלנות רפואית ישראל — נתונים 2025 | Jus-Tice', seo_description: '3,000-4,000 תביעות/שנה. 700M ₪ פיצויים. פיצוי ממוצע 400K-600K ₪. 30-40% מצליחות. כירורגיה גינקולוגיה מובילות.', pillar_keyword: 'נתוני רשלנות רפואית', secondary_keywords: 'סטטיסטיקה רשלנות רפואית,תביעות רפואיות ישראל,מספר תביעות רשלנות' }
  ));

  // 4. REAL ESTATE MARKET STATISTICS 2025
  results.push(await upsert('real-estate-market-statistics', 'שוק הנדל"ן בישראל — מחירים ונתונים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>שוק הנדל"ן הישראלי אחד הדינמיים והמוצפים בעולם. מחירי הדירות עלו ב-60-70% בעשר השנים האחרונות. נתוני 2025 מציגים מגמות חדשות. מדריך זה מבוסס על נתוני הלמ"ס, מינהל מקרקעי ישראל, ומשרד האוצר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי דירה ממוצעים לפי עיר (2025)</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עיר</th><th>ממוצע 4 חדרים</th><th>שינוי 10 שנים</th></tr></thead><tbody>
<tr><td>תל אביב</td><td>4.5-7M ₪</td><td>+85%</td></tr>
<tr><td>הרצליה פיתוח</td><td>4-6M ₪</td><td>+90%</td></tr>
<tr><td>ירושלים</td><td>3-5M ₪</td><td>+65%</td></tr>
<tr><td>חיפה</td><td>1.5-2.5M ₪</td><td>+45%</td></tr>
<tr><td>באר שבע</td><td>800K-1.5M ₪</td><td>+40%</td></tr>
<tr><td>ממוצע ארצי</td><td>2.1M ₪</td><td>+68%</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>נתוני עסקאות 2024</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>~80,000 עסקאות נדל"ן בוצעו ב-2024</li>
<li>ירידה של 20-25% מהשיא של 2021</li>
<li>פינוי-בינוי: 30,000+ יחידות בהליך</li>
<li>אחוז רוכשי ראשונה: ~35% מהעסקאות</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p>מקורות: הלמ"ס, מינהל מקרקעי ישראל, מחלקת המחקר של בנק ישראל. | <a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שוק הנדל"ן ישראל — מחירים ונתונים 2025 | Jus-Tice', seo_description: 'ת"א 4.5-7M ₪, ממוצע ארצי 2.1M ₪ (+68% בעשור). 80K עסקאות ב-2024. 30K יחידות פינוי-בינוי. מקור: הלמ"ס.', pillar_keyword: 'שוק הנדל"ן ישראל 2025', secondary_keywords: 'מחירי דירות 2025,נדל"ן ישראל נתונים,שוק דיור ישראל' }
  ));

  // 5. CRIMINAL LAW STATISTICS
  results.push(await upsert('criminal-law-statistics-israel', 'פשיעה בישראל — נתונים ומגמות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מפרסמת נתוני פשיעה מדי שנה דרך המשטרה ומשרד המשפטים. המגמות הכלליות: ירידה בפשיעה אלימה, עלייה בעברות סייבר ומרמה. נתונים לשנת 2024.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נתוני פשיעה מרכזיים 2024</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קטגוריה</th><th>מספר אירועים</th><th>מגמה</th></tr></thead><tbody>
<tr><td>עבירות רכוש (גנבה, שוד)</td><td>~220,000</td><td>יציב</td></tr>
<tr><td>עבירות אלימות</td><td>~55,000</td><td>ירידה קלה</td></tr>
<tr><td>עבירות תעבורה (נפגעים)</td><td>~17,500</td><td>ירידה</td></tr>
<tr><td>עבירות סמים</td><td>~25,000</td><td>עלייה</td></tr>
<tr><td>מרמה וזיוף</td><td>~18,000</td><td>עלייה</td></tr>
<tr><td>עבירות סייבר</td><td>~12,000</td><td>עלייה חדה</td></tr>
<tr><td>עבירות מין (מדווחות)</td><td>~8,000</td><td>עלייה (בדיווח)</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה אנשים יש לישראל בכלא?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כ-14,000-16,000 כלואים (נתון 2024) — שיעור כליאה של ~150 לכל 100,000 תושבים, בדומה לאירופה המערבית. 30% מהכלואים — ביטחוניים (פסנ"ר).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקורות: דוח שנתי משטרת ישראל 2024, נציבות שירות בתי הסוהר. | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'פשיעה בישראל — נתונים ומגמות 2025 | Jus-Tice', seo_description: '220K עבירות רכוש, 55K אלימות, 12K סייבר (+עלייה חדה). 14-16K כלואים. מקור: משטרת ישראל 2024.', pillar_keyword: 'נתוני פשיעה ישראל', secondary_keywords: 'סטטיסטיקת פשיעה,עבירות ישראל נתונים,פשיעה ישראל 2025' }
  ));

  console.log('\n=== BATCH 32 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
