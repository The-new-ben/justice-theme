/**
 * Batch 41 — RE/Family Bnei Brak, guardianship adult, money laundering, startup equity
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

  // 1. REAL ESTATE BNEI BRAK
  results.push(await upsert('real-estate-lawyer-bnei-brak', 'עורך דין מקרקעין בני ברק | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בבני ברק מטפל בשוק ייחודי — עיר חרדית עם צפיפות מהגבוהות בישראל, ביקוש גבוה לדיור קטן, ופינוי-בינוי נרחב. נדל"ן בני ברק זול יחסית לסמיכות לת"א.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בבני ברק</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בני ברק</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>6,000-14,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>פינוי-בינוי</td><td>2,000-6,000 ₪/דייר</td><td>2,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין בני ברק | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין בני ברק: רכישה 6K-14K ₪. עיר חרדית, צפיפות גבוהה, פינוי-בינוי. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין בני ברק' }
  ));

  // 2. FAMILY LAW BNEI BRAK (ultra-orthodox — religious divorce focus)
  results.push(await upsert('family-law-bnei-brak', 'עורך דין משפחה בני ברק | גט, מזונות, גירושין חרדי | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בבני ברק מייצג בדין תורה ובבית משפט אזרחי. בחברה החרדית — הגט הוא מרכזי, מהותי, ועלול להיות מסובך. עגינות (אשה שלא מקבלת גט) היא בעיה אמיתית ומוכרת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>אתגרי גירושין בחברה החרדית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>גט הוא חובה הלכתית — האיש חייב לתתו</li>
<li>גט מאונס (forced) לא תקף — צריך הסכמת שני הצדדים</li>
<li>בית הדין הרבני יכול להטיל עיצומים (כולל כלא) על מסרב</li>
<li>משמורת ילדים — תחת ה-halacha ובית משפט</li>
<li>מזונות — לפי הכנסה ומנהג מדינה</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/divorce-agreement/">הסכם גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה בני ברק | גט, גירושין חרדי 2025 | Jus-Tice', seo_description: 'משפחה חרדית: גט = מרכזי. עגינות = בעיה אמיתית. בית דין רבני + עיצומים. 5 אתגרים. מדריך 2025.', pillar_keyword: 'עורך דין משפחה בני ברק', secondary_keywords: 'גט חרדי,גירושין חרדי,עגינות ישראל' }
  ));

  // 3. GUARDIANSHIP ADULT ISRAEL
  results.push(await upsert('guardianship-adult-israel', 'אפוטרופסות על בגיר | נכות, קשיש, הליך | Jus-Tice',
    `<!-- wp:paragraph --><p>אפוטרופסות על בגיר (מבוגר) מונה כאשר אדם אינו מסוגל לנהל את ענייניו בשל נכות, ירידה קוגניטיבית, מחלת נפש, או גיל. כ-50,000 מוגדרים תחת אפוטרופסות בישראל. הנטייה כיום — למינוי מינימלי ("תמיכה בקבלת החלטות").</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי מינוי אפוטרופוס</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגשת בקשה לבית המשפט לענייני משפחה</li>
<li>מינוי עו"ד לייצוג האדם (לא המבקש)</li>
<li>חוות דעת רפואית/פסיכיאטרית</li>
<li>דיון בבית משפט</li>
<li>מינוי אפוטרופוס + דיווח שנתי</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה ההבדל בין אפוטרופוס לעניינים אישיים לרכושיים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ניתן למנות אפוטרופוס רק לרכוש (לנהל כסף ונכסים) — מבלי לפגוע בחופש האישי. ניתן גם למנות לשניהם. ניתן גם למנות "תומך בקבלת החלטות" — מסלול פחות פולשני שנוסף בחוק 2016.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/disability-rights-israel/">זכויות נכות</a> | <a href="/will-and-estate-planning/">צוואה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפוטרופסות על בגיר | נכות, קשיש, הליך | Jus-Tice', seo_description: '50,000 תחת אפוטרופסות. 5 שלבי מינוי. אפוטרופוס רכוש vs. אישי. "תמיכה בהחלטות" = מסלול חדש 2016.', pillar_keyword: 'אפוטרופסות בגיר', secondary_keywords: 'אפוטרופוס קשיש,אפוטרופוס נכות,מינוי אפוטרופוס' }
  ));

  // 4. MONEY LAUNDERING DEFENSE (financial crime)
  results.push(await upsert('money-laundering-defense', 'הגנה בעבירת הלבנת הון | חקירה, אסטרטגיה | Jus-Tice',
    `<!-- wp:paragraph --><p>הלבנת הון היא עבירה חמורה — עד 10 שנות מאסר ועיקול נכסים. ישראל מדינה מחויבת ל-FATF (Financial Action Task Force) ויש לה מוסד "רשות לאיסור הלבנת הון". חשוב: הלבנת הון לא מחייבת "כסף מלוכלך" — גם העברה ממקור לא ברור עלולה להיחשב.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>רכיבי עבירת הלבנת הון</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>כסף ממקור עבירה (עבירת מקור)</li>
<li>פעולה להסוות את מקור הכסף</li>
<li>כוונה להלבין (mens rea)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם מקבלים כסף ממקור לא ברור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) אל תשתמש/י בכסף. 2) פנה לייעוץ משפטי מיידי. 3) אם קיבלת בתום לב — ייתכן שיש הגנה. 4) דיווח רצוני לרשות לאיסור הלבנת הון עשוי להפחית חשיפה. 5) עורך דין יכול לנהל הסדר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגנה בעבירת הלבנת הון | חקירה, אסטרטגיה | Jus-Tice', seo_description: 'הלבנת הון: עד 10 שנים + עיקול. 3 רכיבים. קיבלת כסף לא ברור: 5 צעדים. תום לב = הגנה אפשרית. מדריך 2025.', pillar_keyword: 'הלבנת הון', secondary_keywords: 'עבירת הלבנת הון,איסור הלבנת הון,כסף שחור' }
  ));

  // 5. STARTUP EQUITY ISRAEL (ESOP/RSU)
  results.push(await upsert('startup-equity-israel', 'מניות עובדים ואופציות | ESOP, RSU, מיסוי | Jus-Tice',
    `<!-- wp:paragraph --><p>מניות ואופציות לעובדים בחברות הייטק ישראליות — ESOP (Employee Stock Option Plan) ו-RSU (Restricted Stock Units) — הן חלק מרכזי מהתגמול. ישראל מציעה מסלול מס אטרקטיבי לפי סעיף 102 לפקודת מס הכנסה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלולי מס לאופציות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מסלול</th><th>מס</th><th>וסטינג מינימלי</th></tr></thead><tbody>
<tr><td>מסלול רווח הון (102)</td><td>25% רווח הון</td><td>24 חודשים</td></tr>
<tr><td>מסלול הכנסה (102)</td><td>50%+ מס שולי</td><td>—</td></tr>
<tr><td>מחוץ ל-102</td><td>מס שולי מלא</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה קורה לאופציות כשעוזבים חברה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי בחוזה: (1) לרוב יש 90 יום לממש אחרי פרישה. (2) אופציות לא matureed = פוקעות. (3) במקרה פיטורים = לפי הסכם. חשוב לבדוק את תנאי ה-vesting וה-cliff לפני הצטרפות לחברה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/corporate-law-israel/">מדריך דיני חברות</a> | <a href="/tax-lawyer-israel/">מדריך עורך דין מיסים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מניות עובדים ואופציות | ESOP, RSU, מס 102 | Jus-Tice', seo_description: 'ESOP/RSU: מסלול 102 = 25% רווח הון (24 חודש). מסלול הכנסה = 50%+. עזב = 90 יום לממש. מדריך 2025.', pillar_keyword: 'אופציות לעובדים', secondary_keywords: 'ESOP ישראל,RSU מס,מניות הייטק עובד' }
  ));

  console.log('\n=== BATCH 41 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
