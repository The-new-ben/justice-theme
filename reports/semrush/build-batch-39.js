/**
 * Batch 39 — Bankruptcy individual, Rosh HaAyin city, trade secret, debt collection
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

  // 1. BANKRUPTCY INDIVIDUAL ISRAEL (new pillar — חדלות פירעון)
  results.push(await upsert('bankruptcy-individual-israel', 'פשיטת רגל לפרטים | חדלות פירעון, הליך, פתיחה | Jus-Tice',
    `<!-- wp:paragraph --><p>מאז רפורמת חדלות הפירעון (2019), ישראל עברה ממודל "פשיטת רגל" למודל "חדלות פירעון" — שמתמקד בשיקום כלכלי ולא בעונש. הליך חדלות פירעון מאפשר לאדם עמוס בחובות לקבל "התחלה חדשה" תוך 3-7 שנים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי הליך חדלות פירעון</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגשת בקשה לרשם הוצאה לפועל (מינוי נאמן)</li>
<li>הנאמן בוחן נכסים, הכנסות, חובות</li>
<li>תקופת תשלום חודשי (תלוי הכנסה)</li>
<li>קיום תוכנית 36-84 חודשים</li>
<li>צו הפטר — שחרור מחובות שנותרו</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>נתוני חדלות פירעון 2024</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נתון</th><th>מספר</th></tr></thead><tbody>
<tr><td>בקשות חדלות פירעון 2024</td><td>~12,000</td></tr>
<tr><td>ממוצע חוב שנמחק</td><td>~350,000 ₪</td></tr>
<tr><td>תקופה ממוצעת עד הפטר</td><td>4-5 שנים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם בית ייגמר לאחר חדלות פירעון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לאו דווקא. אם הדירה היחידה ושוויה סביר — ייתכן שיישאר. אבל הנאמן בוחן נכסים. דירה שגדולה מהנדרש עשויה להימכר. כל מקרה שונה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>מקור: רשות האכיפה והגבייה, נתוני 2024.</p><!-- /wp:paragraph -->`,
    { seo_title: 'פשיטת רגל לפרטים | חדלות פירעון, הליך, פתיחה | Jus-Tice', seo_description: '12,000 בקשות/שנה. ממוצע חוב נמחק: 350K ₪. 5 שלבים, 4-5 שנים עד הפטר. רפורמה 2019. מדריך 2025.', pillar_keyword: 'פשיטת רגל', secondary_keywords: 'חדלות פירעון ישראל,הפטר מחובות,מחיקת חובות פרטי' }
  ));

  // 2. CRIMINAL ROSH HAAYIN
  results.push(await upsert('criminal-lawyer-rosh-haayin', 'עורך דין פלילי ראש העין | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בראש העין מייצג בבית משפט השלום. ראש העין — עיר גדולה וצומחת במרכז — מאופיינת בעיר עם אוכלוסייה יהודית-ערבית ותיקים שונים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בראש העין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>ראש העין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,200-5,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי ראש העין | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי ראש העין: תעבורה 1.2K-5.5K, אלימות 5K-20K ₪. מרכז. מדריך 2025.', pillar_keyword: 'עורך דין פלילי ראש העין' }
  ));

  // 3. REAL ESTATE ROSH HAAYIN
  results.push(await upsert('real-estate-lawyer-rosh-haayin', 'עורך דין מקרקעין ראש העין | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בראש העין מטפל בשוק העיר הצומחת — ראש העין צמחה מ-20,000 ל-60,000+ תושבים תוך 20 שנה. מחירי הנדל"ן עלו בהתאם.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בראש העין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ראש העין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>6,000-14,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין ראש העין | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין ראש העין: רכישה 6K-14K ₪. עיר צומחת ×3 תוך 20 שנה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין ראש העין' }
  ));

  // 4. TRADE SECRET LAW ISRAEL
  results.push(await upsert('trade-secret-law-israel', 'סוד מסחרי בישראל | הגנה, הפרה, תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>סוד מסחרי הוא מידע עסקי בעל ערך כלכלי שאינו ידוע לציבור — נוסחה, תהליך, רשימת לקוחות. בישראל מוגן דרך פקודת הנזיקין ועוולת "שימוש לרעה בסוד מסחרי". עובדים שעוזבים ולוקחים מידע — חשופים לתביעה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב סוד מסחרי?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>נוסחה או מתכון</li>
<li>תהליך ייצור</li>
<li>רשימת לקוחות + פרטים עסקיים</li>
<li>אסטרטגיה עסקית</li>
<li>קוד מקור של תוכנה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>עובד שלקח רשימת לקוחות — האם אפשר לתבוע?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — ניתן לתבוע גם ללא הסכם סודיות כתוב. אם מדובר במידע שהעובד ידע שהוא סודי — יש עוולת אמון. עם הסכם NDA — תביעה קלה יותר. פיצויים: נזק ממשי + עשיית עושר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/intellectual-property-israel/">מדריך קניין רוחני</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סוד מסחרי בישראל | הגנה, הפרה, תביעה | Jus-Tice', seo_description: '5 סוגי סודות מסחריים. עובד שלוקח רשימת לקוחות = תביעה (גם ללא NDA). עוולת אמון. מדריך 2025.', pillar_keyword: 'סוד מסחרי', secondary_keywords: 'הגנת סוד מסחרי ישראל,NDA עובד,תביעת עובד לקח מידע' }
  ));

  // 5. DEBT COLLECTION ISRAEL
  results.push(await upsert('debt-collection-israel', 'גביית חובות בישראל | הליך, עורך דין, הוצאה לפועל | Jus-Tice',
    `<!-- wp:paragraph --><p>גביית חובות אזרחית בישראל מתנהלת בעיקר דרך הוצאה לפועל (הל"פ). נושה שיש לו חוב מאושר יכול להגיש ל-הל"פ ולקבל עיקולים, עצירת חשבון, או מכירת נכסים. כ-3 מיליון תיקים פתוחים בהל"פ בכל שנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי גביית חוב</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פסק דין או שטר חוב (להוכיח חוב)</li>
<li>פתיחת תיק הוצאה לפועל</li>
<li>בקשת אמצעי גבייה: עיקול שכר, חשבון, רכב</li>
<li>עיכוב יציאה מהארץ (עבור חייבים גדולים)</li>
<li>הכרזה כ"חייב מוגבל באמצעים" (אם אין נכסים)</li>
</ol><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/contract-law-israel/">מדריך דיני חוזים</a> | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גביית חובות בישראל | הליך, הוצאה לפועל, עיקולים | Jus-Tice', seo_description: '3M תיקים/שנה בהל"פ. 5 שלבי גבייה. עיקול שכר, חשבון, רכב. עיכוב יציאה. חייב מוגבל. מדריך 2025.', pillar_keyword: 'גביית חובות', secondary_keywords: 'הוצאה לפועל ישראל,עיקול חשבון,חוב גבייה' }
  ));

  console.log('\n=== BATCH 39 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
