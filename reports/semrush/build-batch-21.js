/**
 * Batch 21 — Criminal Holon, family law Rehovot, immigration visa, 
 * spousal support, sexual offense defense, labor law Haifa, workplace safety
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

  // 1. CRIMINAL HOLON
  results.push(await upsert('criminal-lawyer-holon', 'עורך דין פלילי חולון | מחירים וייצוג 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בחולון מייצג בבית משפט השלום ומחוזי תל אביב. חולון — עיר עם תעשייה ונמל אשדוד קרוב — מאופיינת בתיקי תעבורה, עבירות כלכליות, ואלימות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בחולון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>חולון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-24,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>8,000-38,000 ₪</td><td>10,000-50,000 ₪</td></tr>
<tr><td>עבירות כלכליות</td><td>15,000-70,000 ₪</td><td>20,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/criminal-lawyer-cost/">עלות עורך דין פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי חולון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי חולון: תעבורה 1.5K-6.5K, אלימות 6K-24K, עבירות כלכליות 15K-70K ₪. מדריך 2025.', pillar_keyword: 'עורך דין פלילי חולון' }
  ));

  // 2. FAMILY LAW REHOVOT
  results.push(await upsert('family-law-rehovot', 'עורך דין משפחה רחובות | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה ברחובות מייצג בבית המשפט לענייני משפחה רחובות, המשרת את אזור השפלה. רחובות — עיר אוניברסיטאית עם אוכלוסייה גדולה של צעירים — מתאפיינת בסכסוכי משפחה ביחס לאוכלוסייה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה ברחובות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רחובות</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-12,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-45,000 ₪</td><td>20,000-80,000 ₪</td></tr>
<tr><td>מזונות (דיון)</td><td>2,000-7,000 ₪</td><td>4,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה רחובות | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה רחובות: גירושין 4K-45K ₪. בית משפט משפחה רחובות. מדריך 2025.', pillar_keyword: 'עורך דין משפחה רחובות' }
  ));

  // 3. SPOUSAL SUPPORT (ALIMONY FOR WIFE - different from child support)
  results.push(await upsert('divorce-spousal-support', 'מזונות אישה בגירושין | מתי מגיע, כמה, כמה זמן | Jus-Tice',
    `<!-- wp:paragraph --><p>מזונות אישה (להבדיל ממזונות ילדים) הם מורכבים יותר בחוק הישראלי — שכן הם מבוססים בחוק האישי (הלכה יהודית, שריעה, או חוק ישראלי לפי הדת). אישה יהודיה — מזונותיה מכוח ההלכה. אישה מהדת המוסלמית — מכוח השריעה. מדריך זה מתמקד במזונות אישה יהודייה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי זכאית האישה למזונות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מצב</th><th>זכאות</th></tr></thead><tbody>
<tr><td>אישה לא עובדת + ילדים קטנים</td><td>כן — מדרגה ראשונה</td></tr>
<tr><td>אישה עובדת בשכר נמוך</td><td>כן — השלמה בין שכרה לצרכיה</td></tr>
<tr><td>אישה עובדת בשכר גבוה</td><td>ייתכן לא — אם מרוויחה לצרכיה</td></tr>
<tr><td>אישה שגרמה לגירושין</td><td>ייתכן שתאבד (לפי ההלכה)</td></tr>
<tr><td>גירושין בהסכמה</td><td>לפי הסכם — מוגדר בחוזה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כמה מזונות אישה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>אין נוסחה קבועה — בית הדין שוקל: הכנסות, צרכים, רמת חיים שמרה</li>
<li>טווח: 1,500 - 8,000 ₪ לחודש (בהתאם לנסיבות)</li>
<li>מזונות זמניים (עד גמר הגירושין): מוענקים לרוב תוך שבועות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן משלמים מזונות אישה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>עד הגירושין בפועל (לאחר חתימת גט). לאחר הגירושין — לרוב אין מזונות אישה. ניתן להסכים בהסכם גירושין על מזונות זמניים גם אחרי הגט (תקופת מעבר).</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם גבר יכול לבקש מזונות מאשתו?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי ההלכה היהודית — לא. לפי חוקים אחרים (כמו ידועים בציבור) — ייתכן. בפועל, מזונות לגבר מאישה הם נדירים מאוד בישראל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/divorce-women-rights-israel/">זכויות האישה בגירושין</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מזונות אישה בגירושין | מתי מגיע, כמה, כמה זמן | Jus-Tice', seo_description: 'מזונות אישה: מבוסס חוק אישי לפי דת. 1,500-8,000 ₪ לחודש. 5 מצבים בטבלה. עד הגט בלבד. מדריך 2025.', pillar_keyword: 'מזונות אישה', secondary_keywords: 'מזונות אישה גירושין,מזונות אישה ישראל,כמה מזונות אישה' }
  ));

  // 4. LABOR LAW HAIFA
  results.push(await upsert('labor-law-haifa', 'עורך דין עבודה חיפה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין עבודה בחיפה מייצג בבית הדין האזורי לעבודה חיפה, המשרת את אזור הצפון. חיפה — עיר נמל עם תעשייה כבדה, פטרוכימיה ורפואה — מאופיינת בתיקי עבודה הקשורים לפגיעות בעבודה, תנאי נמל, ועוד.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עלות עורך דין עבודה בחיפה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>חיפה</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>300-550 ₪</td><td>300-500 ₪</td></tr>
<tr><td>תביעת פיטורים</td><td>12,000-40,000 ₪</td><td>12,000-40,000 ₪</td></tr>
<tr><td>ייצוג בדיון</td><td>2,500-6,000 ₪/דיון</td><td>2,500-6,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/workplace-accident-guide/">תאונת עבודה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין עבודה חיפה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין עבודה חיפה: פיטורים 12K-40K ₪. בית דין לעבודה חיפה, תעשייה כבדה ונמל. מדריך 2025.', pillar_keyword: 'עורך דין עבודה חיפה' }
  ));

  // 5. WORKPLACE SAFETY
  results.push(await upsert('workplace-safety-israel', 'בטיחות בעבודה וזכויות נפגע | תאונות, פיצויים, הליך | Jus-Tice',
    `<!-- wp:paragraph --><p>כ-10,000 תאונות עבודה מוכרות מדווחות לביטוח הלאומי בשנה בישראל, מהן כ-80 קטלניות. נפגע בתאונת עבודה זכאי לפיצויים מכמה מקורות: ביטוח לאומי, תביעה נגד מעסיק, ותביעה נגד גורם שלישי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מקורות פיצוי לנפגע תאונת עבודה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מקור</th><th>מה מקבלים</th><th>כמה</th></tr></thead><tbody>
<tr><td>ביטוח לאומי</td><td>דמי פגיעה (90% שכר), קצבת נכות</td><td>90% שכר × ימי אבדן כושר</td></tr>
<tr><td>תביעה נגד מעסיק</td><td>פיצוי על אחריות מעוולת</td><td>100K-2M ₪ (תלוי בחומרה)</td></tr>
<tr><td>תביעה נגד צד שלישי</td><td>אם קבלן/ציוד/אחר אחראי</td><td>נוסף על שאר הפיצויים</td></tr>
<tr><td>ביטוח אחריות מעסיקים</td><td>כסה על ידי ביטוח המעסיק</td><td>תלוי בפוליסה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתבוע מעסיק על תאונת עבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — תביעת נזיקין נגד מעסיק שלא נקט אמצעי בטיחות מספקים. ביטוח לאומי לא מחסום — ניתן בנוסף עליו. ניתן גם לתבוע קבלן, יצרן ציוד, בעל מקרקעין.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים מיד אחרי תאונת עבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) קבל טיפול רפואי. 2) דווח למעסיק בכתב (WhatsApp/אימייל) מיד. 3) הגש תביעה לביטוח לאומי תוך 12 חודשים. 4) שמור כל מסמך רפואי. 5) צלם את מקום התאונה. 6) פנה לעורך דין בתאונות עבודה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/workplace-accident-guide/">מדריך תאונת עבודה</a> | <a href="/personal-injury-israel/">נזקי גוף</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'בטיחות בעבודה וזכויות נפגע | תאונות, פיצויים | Jus-Tice', seo_description: '10,000 תאונות בשנה, 80 קטלניות. ביטוח לאומי 90% שכר. תביעת מעסיק 100K-2M ₪. 6 צעדים מיידיים. מדריך 2025.', pillar_keyword: 'בטיחות בעבודה', secondary_keywords: 'תאונת עבודה ישראל,פיצויים תאונת עבודה,ביטוח לאומי תאונת עבודה' }
  ));

  console.log('\n=== BATCH 21 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
