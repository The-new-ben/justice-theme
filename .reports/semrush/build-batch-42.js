/**
 * Batch 42 — Employment sexual harassment, data privacy, RE Kfar Yona,
 * criminal Kiryat Gat, child support calculation
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

  // 1. EMPLOYMENT SEXUAL HARASSMENT
  results.push(await upsert('employment-sexual-harassment', 'הטרדה מינית בעבודה | זכויות, תלונה, פיצוי | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק למניעת הטרדה מינית (תשנ"ח-1998) אוסר הטרדה מינית בכל מקום — כולל מקום עבודה. כ-5,000-8,000 תלונות מוגשות בשנה. המעסיק אחראי לסביבה נקייה מהטרדה — ויכול להיות אחראי גם על מעשי עובדיו.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב הטרדה מינית?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הצעות מיניות חוזרות לאחר סירוב</li>
<li>פרסום תכנים מיניים</li>
<li>שאלות על חיי המין</li>
<li>ניצול מרות לאפשרויות מיניות</li>
<li>התייחסויות מבזות למגדר</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שלבי הגשת תלונה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנה לממונה על הטרדה מינית במקום העבודה</li>
<li>הגש תלונה למשטרה (עבירה פלילית)</li>
<li>הגש תביעה אזרחית לפיצויים ללא הוכחת נזק: עד 120,000 ₪</li>
</ol><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/discrimination-at-work/">אפליה בעבודה</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הטרדה מינית בעבודה | זכויות, תלונה, פיצוי | Jus-Tice', seo_description: '5-8K תלונות/שנה. 5 מה נחשב. 3 שלבי תלונה. פיצוי אזרחי: עד 120K ₪ ללא הוכחת נזק. מדריך 2025.', pillar_keyword: 'הטרדה מינית בעבודה', secondary_keywords: 'תלונה הטרדה מינית,הטרדה מינית פיצוי,חוק הטרדה מינית' }
  ));

  // 2. DATA PRIVACY ISRAEL (GDPR crossover — growing niche)
  results.push(await upsert('data-privacy-israel', 'הגנת פרטיות ונתונים בישראל | GDPR, חוק, זכויות | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מחזיקה חוק הגנת הפרטיות (תשמ"א-1981) ותקנות GDPR-ישראל. ישראל גם מוכרת ע"י האיחוד האירופי כמדינה "נאותה" לצרכי GDPR. עסקים שמעבדים נתוני אזרחים אירופאים — מחויבים לשמור על GDPR.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עיקרי החוק הישראלי לפרטיות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>זכות לדעת אילו נתונים נמצאים עלייך</li>
<li>זכות לתיקון נתונים שגויים</li>
<li>איסור שימוש ללא הסכמה</li>
<li>חובת הרשמה למאגר מידע</li>
<li>הרשות להגנת הפרטיות — אמצעי אכיפה</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p>מקור: הרשות להגנת הפרטיות ישראל. | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגנת פרטיות בישראל | GDPR, חוק, זכויות | Jus-Tice', seo_description: 'ישראל = מדינה נאותה ל-GDPR. 5 זכויות פרטיות. חובת רישום מאגר. הרשות לפרטיות = אכיפה. מדריך 2025.', pillar_keyword: 'הגנת פרטיות ישראל', secondary_keywords: 'GDPR ישראל,חוק פרטיות,מאגר מידע ישראל' }
  ));

  // 3. REAL ESTATE KFAR YONA
  results.push(await upsert('real-estate-lawyer-kfar-yona', 'עורך דין מקרקעין כפר יונה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בכפר יונה מטפל בשוק הצפוני של גוש דן — כפר יונה מציעה מחירי נדל"ן נמוכים ממרכז הארץ עם קרבה לנתניה. ביקוש גובר מקנייני ת"א שמחפשים אלטרנטיבה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בכפר יונה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>כפר יונה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>5,000-12,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין כפר יונה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין כפר יונה: רכישה 5K-12K ₪. גוש דן צפון, נמוך ממרכז. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין כפר יונה' }
  ));

  // 4. CRIMINAL KIRYAT GAT (southern development city)
  results.push(await upsert('criminal-lawyer-kiryat-gat', 'עורך דין פלילי קריית גת | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בקריית גת מייצג בבית משפט השלום. קריית גת — עיר פיתוח בדרום — מאופיינת בתיקי אלימות, עבירות נשק, וסמים. בית המשפט בקריית גת מטפל גם בחלק מאיזור לכיש.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בקריית גת</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>קריית גת</th><th>באר שבע</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>800-4,500 ₪</td><td>1,000-5,000 ₪</td></tr>
<tr><td>אלימות</td><td>4,000-18,000 ₪</td><td>5,000-20,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי קריית גת | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי קריית גת: תעבורה 800-4.5K, אלימות 4K-18K ₪. דרום, לכיש. מדריך 2025.', pillar_keyword: 'עורך דין פלילי קריית גת' }
  ));

  // 5. CHILD SUPPORT CALCULATION (high intent family)
  results.push(await upsert('child-support-calculation', 'חישוב מזונות ילדים | טבלאות, נוסחה, מה מגיע | Jus-Tice',
    `<!-- wp:paragraph --><p>מזונות ילדים בישראל מחושבים לפי הכנסת האב, גיל הילדים, ומי שמשמור. אין נוסחה אחידה — בית משפט שוקל מכלול שיקולים. אבל יש קווים מנחים ופסיקה מוסכמת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>גורמים עיקריים בחישוב מזונות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>גורם</th><th>השפעה</th></tr></thead><tbody>
<tr><td>גיל ילד 0-6</td><td>מזונות בסיסיים + מדור</td></tr>
<tr><td>גיל ילד 6-15</td><td>מזונות בסיסיים + חינוך</td></tr>
<tr><td>גיל ילד 15-18</td><td>שוקל הכנסת ילד</td></tr>
<tr><td>משמורת משותפת</td><td>מפחית מזונות</td></tr>
<tr><td>הכנסת האם</td><td>שוקל פחות מהאב</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה ממוצע מזונות לילד בישראל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ממוצע ל-2024: 1,500-3,500 ₪/חודש לילד (תלוי הכנסות). ילד יחיד: לרוב 1,800-2,800 ₪. שניים: 3,000-5,500 ₪. משמורת משותפת: 800-1,800 ₪ לילד. מזונות ניתן לשינוי עם שינוי נסיבות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/child-custody-guide/">מדריך משמורת</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חישוב מזונות ילדים | טבלאות, ממוצעים, מה מגיע | Jus-Tice', seo_description: 'מזונות ממוצע: 1,500-3,500 ₪/ילד/חודש. גיל 0-6 = בסיסיים + מדור. משמורת משותפת = פחות. מדריך 2025.', pillar_keyword: 'חישוב מזונות ילדים', secondary_keywords: 'מזונות ילד ישראל,מזונות ממוצע,חישוב מזונות' }
  ));

  console.log('\n=== BATCH 42 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
