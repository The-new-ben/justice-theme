/**
 * Batch 35 — Insurance claim denial, labor tribunal, RE Akko, criminal Nazareth,
 * landlord rights
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

  // 1. INSURANCE CLAIM DENIAL (very high demand)
  results.push(await upsert('insurance-claim-denial', 'ביטוח שלא משלם | מה עושים, ערעור, תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>חברת ביטוח שמסרבת לשלם תביעה — לרוב ניתן לערעור ולמאבק. כ-20-30% מסירובי ביטוח מתהפכים לאחר ערעור. הכרת הזכויות שלך היא הצעד הראשון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סיבות נפוצות לסירוב ביטוח</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סיבה</th><th>מה ניתן לעשות</th></tr></thead><tbody>
<tr><td>אי-גילוי מידע בעת הצטרפות</td><td>הוכח שלא ידעת/לא היה רלוונטי</td></tr>
<tr><td>אי-תשלום פרמיה</td><td>הוכח שהתשלום בוצע</td></tr>
<tr><td>"לא כוסה בפוליסה"</td><td>בדוק ניסוח פוליסה — לרוב ניתן לפרש</td></tr>
<tr><td>תקופת המתנה</td><td>בדוק ניסוח — הכל לפי תנאי הפוליסה</td></tr>
<tr><td>רשלנות תורמת</td><td>הוכח שלא היית רשלן</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שלבי ערעור</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>בקש מסמך סירוב בכתב עם נימוקים</li>
<li>פנה למחלקת ערעורים פנימית של חברה</li>
<li>פנה לנציב תלונות הציבור לביטוח (חינם)</li>
<li>הגש תביעה לבית משפט</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לתבוע ביטוח שסירב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>3 שנים מיום שנודע על הסירוב (התיישנות). ביטוח חיים ונכות: 7 שנים. אבל — עדיף להגיש ערעור מיידי; עדויות ומסמכים נשמרים טוב יותר קרוב לאירוע.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ביטוח שלא משלם | מה עושים, ערעור, תביעה | Jus-Tice', seo_description: '20-30% סירובים מתהפכים. 5 סיבות סירוב + מה לעשות. 4 שלבי ערעור. 3-7 שנות התיישנות. מדריך 2025.', pillar_keyword: 'ביטוח שלא משלם', secondary_keywords: 'סירוב ביטוח,תביעת ביטוח,ערעור ביטוח' }
  ));

  // 2. LABOR TRIBUNAL PROCESS (how-to guide)
  results.push(await upsert('labor-tribunal-process', 'בית הדין לעבודה | הליך, שלבים, עלויות | Jus-Tice',
    `<!-- wp:paragraph --><p>בית הדין לעבודה הוא ערכאה שיפוטית ייחודית לסכסוכי עבודה בישראל. יש שני סוגים: בית הדין האזורי לעבודה (ערכאה ראשונה) ובית הדין הארצי לעבודה (ערעורים). הדיון הוא מהיר יחסית — 6-18 חודשים בממוצע.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי הגשת תביעה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגשת כתב תביעה (תוך 7 שנים)</li>
<li>קדם-משפט (תוך 30-60 יום)</li>
<li>גילוי מסמכים (60-90 יום)</li>
<li>תצהירים ועדויות</li>
<li>סיכומים בכתב</li>
<li>פסק דין</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>עלויות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>עלות</th></tr></thead><tbody>
<tr><td>אגרת בית משפט</td><td>בדרך כלל 0 (אגרה מינימלית)</td></tr>
<tr><td>עורך דין (שכ"ט)</td><td>10,000-50,000 ₪ (לפי מורכבות)</td></tr>
<tr><td>פיצוי בהצלחה</td><td>עד פי 2-3 מהסכום הנתבע</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'בית הדין לעבודה | הליך, שלבים, עלויות | Jus-Tice', seo_description: 'בית הדין לעבודה: 6 שלבים, 6-18 חודשים. אגרה: 0. עורך דין: 10K-50K ₪. 7 שנות התיישנות. מדריך 2025.', pillar_keyword: 'בית הדין לעבודה', secondary_keywords: 'הליך בית דין עבודה,תביעת עובד,כיצד מגישים תביעה לעבודה' }
  ));

  // 3. REAL ESTATE AKKO (mixed Jewish-Arab city — underserved niche)
  results.push(await upsert('real-estate-lawyer-akko', 'עורך דין מקרקעין עכו | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בעכו מטפל בשוק מיוחד — עיר מעורבת יהודית-ערבית עם עיר עתיקה מסויימת ונכסים היסטוריים. עכו מאופיינת בנדל"ן זול יחסית לצפון, עם פוטנציאל תיירותי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בעכו</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עכו</th><th>חיפה</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>4,000-10,000 ₪</td><td>6,000-15,000 ₪</td></tr>
<tr><td>נכס היסטורי/שימור</td><td>6,000-18,000 ₪</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין עכו | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין עכו: רכישה 4K-10K ₪. עיר עתיקה, נכסים היסטוריים, פוטנציאל תיירות. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין עכו' }
  ));

  // 4. CRIMINAL NAZARETH (Arabic/mixed city — underserved)
  results.push(await upsert('criminal-lawyer-nazareth', 'עורך דין פלילי נצרת | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בנצרת מייצג בבית משפט השלום. נצרת — עיר ערבית גדולה בישראל — מאופיינת בתיקים הקשורים לאלימות, סמים, ועבירות עסקיות. בית משפט נצרת שיפוטי לאזור.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בנצרת</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>נצרת</th><th>חיפה</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>1,500-7,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-22,000 ₪</td><td>7,000-28,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי נצרת | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי נצרת: תעבורה 1K-5K, אלימות 5K-22K ₪. עיר ערבית, בית משפט נצרת. מדריך 2025.', pillar_keyword: 'עורך דין פלילי נצרת' }
  ));

  // 5. LANDLORD RIGHTS ISRAEL (comprehensive)
  results.push(await upsert('landlord-rights-israel', 'זכויות בעל דירה להשכרה | שוכר לא משלם, פינוי | Jus-Tice',
    `<!-- wp:paragraph --><p>בעל דירה שמשכיר — יש לו זכויות ברורות, אך גם מגבלות. חוק השכירות והשאילה (תשל"א-1971) מסדיר את היחסים. בעל דירה לא יכול "לקחת" בעצמו — הוא חייב ללכת דרך הליך חוקי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות בסיסיות של בעל דירה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>לקבל שכר דירה במועד שנקבע</li>
<li>לבקש פיקדון (כמה חודשי שכירות)</li>
<li>לדרוש ביטוח לשוכר לנכס</li>
<li>לבדוק את הנכס בתיאום מראש</li>
<li>לפנות שוכר על ידי בית משפט אם הפר</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>שוכר לא משלם — מה עושים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) שלח מכתב התראה רשמי (7-14 ימים). 2) בקש פיקדון (אם קיים). 3) הגש תביעה לתשלום + פינוי בבית משפט שלום. 4) קח מהפיקדון סכום לא שנוי במחלוקת. 5) אל תחסום מים/חשמל — עבירה פלילית.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/eviction-notice-israel/">הליך פינוי שוכר</a> | <a href="/real-estate-lawyer-guide/">עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות בעל דירה להשכרה | שוכר לא משלם, פינוי | Jus-Tice', seo_description: 'זכויות בעל דירה: 5 זכויות. שוכר לא משלם: 5 צעדים (אל תחסום חשמל — עבירה!). פינוי: 3-12 חודשים.', pillar_keyword: 'זכויות בעל דירה', secondary_keywords: 'שוכר לא משלם,בעל דירה זכויות,פינוי שוכר לא משלם' }
  ));

  console.log('\n=== BATCH 35 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
