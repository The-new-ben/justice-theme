/**
 * Batch 26 — Tax lawyer, child custody agreement, land dispute, civil rights, Beer Sheva
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

  // Check if criminal-lawyer-rishon-lezion exists, skip if so
  const checkRishon = await api('GET', '/wp-json/wp/v2/pages?slug=criminal-lawyer-rishon-lezion&status=any&per_page=1');
  if (Array.isArray(checkRishon.body) && checkRishon.body.length > 0) {
    console.log('\n>>> criminal-lawyer-rishon-lezion already exists (ID ' + checkRishon.body[0].id + ') — skipping');
  }

  // 1. TAX LAWYER ISRAEL (new pillar)
  results.push(await upsert('tax-lawyer-israel', 'עורך דין מיסוי בישראל | מה הוא עושה, מתי צריך | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מיסוי (מיסים) מתמחה בדיני המס בישראל — מס הכנסה, מע"מ, מס שבח, ביטוח לאומי, ומיסוי בינלאומי. ישנם כ-1,200 עורכי דין מוסמכים בתחום המיסוי בישראל. חשוב להבדיל בין עורך דין מיסוי לרואה חשבון — הם משלימים אחד את השני.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי צריך עורך דין מיסוי?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>מחלוקת עם רשות המיסים (שומה, קנס)</li>
<li>חקירה פלילית בגין עבירות מס</li>
<li>עסקה נדל"נית מורכבת (מס שבח/רכישה)</li>
<li>פתיחת עסק בינלאומי / פעילות בחו"ל</li>
<li>ירושה ממדינה זרה</li>
<li>השקעות ניירות ערך ומט"ח</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורך דין מיסוי 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מינימום</th><th>ממוצע</th><th>מקסימום</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>0 ₪</td><td>600 ₪</td><td>1,500 ₪</td></tr>
<tr><td>ייצוג בהשגה</td><td>5,000 ₪</td><td>15,000 ₪</td><td>40,000 ₪</td></tr>
<tr><td>ייצוג בערעור מס</td><td>15,000 ₪</td><td>35,000 ₪</td><td>100,000 ₪</td></tr>
<tr><td>תכנון מס עסקה</td><td>3,000 ₪</td><td>10,000 ₪</td><td>30,000 ₪</td></tr>
<tr><td>הגנה בחקירה פלילית</td><td>20,000 ₪</td><td>60,000 ₪</td><td>200,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה ההבדל בין עורך דין מיסוי לרואה חשבון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>רואה חשבון: מתמחה בהכנת דוחות, חישוב מיסים, ייעוץ תכנוני שוטף. עורך דין מיסוי: מתמחה בסכסוכים, ערעורים, הגנה בחקירות. בסכסוך עם רשות המיסים — עורך דין; בתכנון מס שגרתי — רואה חשבון.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-tax-israel/">מס שבח ורכישה</a> | <a href="/corporate-law-israel/">דיני חברות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מיסוי בישראל | מתי צריך, מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מיסוי: ייצוג השגה 5K-40K, ערעור 15K-100K ₪. 1,200 מוסמכים. vs. רואה חשבון. מדריך 2025.', pillar_keyword: 'עורך דין מיסוי', secondary_keywords: 'עורך דין מס ישראל,ייצוג רשות המיסים,ערעור מס' }
  ));

  // 2. CUSTODY AGREEMENT
  results.push(await upsert('divorce-custody-agreement', 'הסכם משמורת ילדים | מה כולל, כיצד כותבים | Jus-Tice',
    `<!-- wp:paragraph --><p>הסכם משמורת ילדים הוא אחת ההחלטות החשובות ביותר בתהליך הגירושין. הסכם טוב מגדיר בבהירות את המשמורת הפיזית והמשפטית, לוחות שמירה, חגים, ועוד — ומונע סכסוכים עתידיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה כולל הסכם משמורת?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>משמורת פיזית:</strong> עם מי גר הילד ביומיום</li>
<li><strong>משמורת משפטית:</strong> מי מקבל החלטות (חינוך, בריאות, דת)</li>
<li><strong>לוח שמירה:</strong> ימים, שבתות, חגים, חופשות</li>
<li><strong>מגורים:</strong> שינוי מגורים מחייב הסכמה</li>
<li><strong>טיולים לחו"ל:</strong> הסכמה מראש</li>
<li><strong>נסיבות שינוי:</strong> מה יגרום לשינוי ההסכם</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מהי משמורת משותפת לעומת יחידה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>משמורת יחידה: ילד גר בעיקר אצל הורה אחד. השני — ביקורים. משמורת משותפת: ילד חי לסירוגין אצל שני ההורים (לרוב 50/50 שבועות). בית משפט מעדיף לרוב משמורת משותפת — אם שניהם מסוגלים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-custody-guide/">מדריך משמורת ילדים</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הסכם משמורת ילדים | מה כולל, כיצד כותבים | Jus-Tice', seo_description: 'הסכם משמורת: 6 רכיבים חובה. משמורת משותפת vs. יחידה. חגים, חו"ל, שינוי מגורים. מדריך 2025.', pillar_keyword: 'הסכם משמורת ילדים', secondary_keywords: 'הסכם משמורת,משמורת משותפת,הסכם גירושין ילדים' }
  ));

  // 3. BEER SHEVA REAL ESTATE
  results.push(await upsert('real-estate-lawyer-beer-sheva', 'עורך דין מקרקעין באר שבע | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בבאר שבע מטפל בשוק ייחודי של הנגב — עיר אוניברסיטאית עם מחירי נדל"ן נמוכים יחסית, קרקעות מדינה, ופיתוח נרחב. באר שבע מרוחקת ממרכז הארץ אך מציעה תשואות גבוהות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בבאר שבע</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>באר שבע</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>5,000-12,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>מכירת דירה</td><td>3,000-8,000 ₪</td><td>7,000-20,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין באר שבע | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין באר שבע: רכישה 5K-12K ₪, זול יותר ב-50% מת"א. עיר אוניברסיטאית. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין באר שבע' }
  ));

  // 4. CRIMINAL BEER SHEVA
  results.push(await upsert('criminal-lawyer-beer-sheva', 'עורך דין פלילי באר שבע | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בבאר שבע מייצג בבית משפט השלום ובמחוזי באר שבע — המשרת את כל הנגב. באר שבע מרכזת תיקים מסוג שונה: בדואי, מגזר חקלאי, ועבירות קרקע.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בבאר שבע</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>באר שבע</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,200-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>6,000-28,000 ₪</td><td>10,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי באר שבע | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי באר שבע: תעבודה 1.2K-5K, אלימות 5K-20K ₪. בית משפט נגב. מדריך 2025.', pillar_keyword: 'עורך דין פלילי באר שבע' }
  ));

  // 5. FRAUD VICTIM GUIDE
  results.push(await upsert('fraud-victim-guide', 'נפגעתי מהונאה | מה עושים, כיצד מגישים תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>הונאה (מירמה) היא עבירה פלילית ועוולה אזרחית. אם נפגעת מהונאה — יש לך מסלולים מקבילים: תלונה פלילית, תביעה אזרחית, ופניה לרשות הגנת הצרכן. כ-15,000 תלונות על הונאה מוגשות בישראל בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלולי פעולה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מסלול</th><th>יתרון</th><th>מה מקבלים</th></tr></thead><tbody>
<tr><td>תלונה פלילית (משטרה)</td><td>חינם, לחץ על רמאי</td><td>אין פיצוי ישיר</td></tr>
<tr><td>תביעה אזרחית</td><td>פיצוי ישיר</td><td>כסף + עוגמת נפש</td></tr>
<tr><td>רשות הגנת הצרכן</td><td>גישור מהיר</td><td>החזר + פיצוי מינימלי</td></tr>
<tr><td>חברת האשראי (chargeback)</td><td>מהיר, לתשלומי כרטיס</td><td>החזר כסף</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה ראיות נצבר לפני הגשת תלונה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>שמור: אסמכתאות תשלום, הבטחות בכתב (WhatsApp, מייל, חוזה), מפרטי מוצר/שירות, צילומי מסך. הראיות הטובות ביותר הן מסמכים כתובים — לא דברים שנאמרו.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a> | <a href="/internet-defamation-israel/">לשון הרע ברשת</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נפגעתי מהונאה | מה עושים, תביעה, כיצד להתאושש | Jus-Tice', seo_description: '15,000 תלונות הונאה בשנה. 4 מסלולי פעולה: פלילי, אזרחי, צרכן, chargeback. מה ראיות לשמור. מדריך 2025.', pillar_keyword: 'נפגעתי מהונאה', secondary_keywords: 'הונאה ישראל,מה עושים בהונאה,תביעת הונאה' }
  ));

  console.log('\n=== BATCH 26 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
