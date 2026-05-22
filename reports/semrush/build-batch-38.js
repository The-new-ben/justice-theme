/**
 * Batch 38 — Commercial lease, drug offense guide, property division divorce,
 * family Ashkelon, RE Rehovot (upsert)
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

  // 1. COMMERCIAL LEASE ISRAEL
  results.push(await upsert('commercial-lease-israel', 'חכירה מסחרית בישראל | חוזה שכירות עסקי | Jus-Tice',
    `<!-- wp:paragraph --><p>חכירה מסחרית (שכירות עסקית) בישראל שונה משמעותית משכירות מגורים. חוק הגנת הדייר לא חל על עסקים (לרוב). השוכר העסקי אחראי למו"מ על כל תנאי — ולכן ייצוג משפטי קריטי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נושאים מרכזיים בחוזה חכירה מסחרית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>תקופת שכירות ואופציות להארכה</li>
<li>שכר דירה ומנגנון הצמדה (מדד/דולר)</li>
<li>התאמות ושיפוצים — מי משלם?</li>
<li>שימוש ייעודי (לא לשנות ייעוד ללא רשות)</li>
<li>ביטוחים — אחריות על הנכס ועל העסק</li>
<li>פינוי מוקדם — פיצוי לבעל הנכס</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם שוכר עסקי יכול לעזוב לפני סוף החוזה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>רק אם יש סעיף ביטול בחוזה. ללא סעיף — בעל הנכס יכול לתבוע שכר דירה לכל תקופת החוזה + עוגמת נפש. שוכר שסוגר עסק באמצע — חייב להמשיך לשלם (עד שימצא שוכר חלופי).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/contract-law-israel/">מדריך דיני חוזים</a> | <a href="/real-estate-lawyer-guide/">עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חכירה מסחרית בישראל | חוזה שכירות עסקי | Jus-Tice', seo_description: 'חכירה מסחרית: 6 נושאים קריטיים. יציאה מוקדמת = חייב לשלם עד סוף חוזה. ללא הגנת דייר. מדריך 2025.', pillar_keyword: 'חכירה מסחרית', secondary_keywords: 'שכירות עסקית ישראל,חוזה עסקי שכירות,חכירת מסחר' }
  ));

  // 2. DRUG OFFENSE GUIDE
  results.push(await upsert('drug-offense-guide', 'עבירות סמים בישראל | הגנה, עונשים, שיקום | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירות סמים בישראל נחלקות לסוגים שונים — החזקה לשימוש עצמי, סחר, הפצה. העונשים שונים מאוד. חוק זכויות עצורים ו"פרוגרמת שיקום" מציעים חלופות לכלא במקרים מסוימים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עונשים לפי עבירה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>עונש מקסימלי</th><th>הערות</th></tr></thead><tbody>
<tr><td>החזקה לשימוש עצמי (סם קל)</td><td>3 שנות מאסר</td><td>לרוב: קנס/שיקום</td></tr>
<tr><td>החזקה לשימוש עצמי (סם קשה)</td><td>3 שנות מאסר</td><td>פחות גמישות</td></tr>
<tr><td>סחר בסמים</td><td>20-25 שנים</td><td>חמור מאוד</td></tr>
<tr><td>הפצה לקטין</td><td>עד עולם</td><td>נסיבה מחמירה</td></tr>
<tr><td>ייבוא/ייצוא</td><td>20-25 שנים</td><td>חמור</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>שיקום במקום כלא — מתי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כשהנאשם מוכן להכנס לתוכנית שיקום מוכרת — ביהמ"ש עשוי לדחות גזר דין לאחר שיקום מוצלח. תוכנית שיקום: 12-18 חודשים. אם הצליח — עונש מופחת מאוד. בעבירות קשות — אין שיקום.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עבירות סמים בישראל | הגנה, עונשים, שיקום | Jus-Tice', seo_description: 'החזקה עצמי: 3 שנים. סחר: 20-25 שנים. הפצה לקטין: עולם. שיקום 12-18 חודשים כחלופה לכלא. מדריך 2025.', pillar_keyword: 'עבירות סמים ישראל', secondary_keywords: 'עבירת סמים,הגנה סמים,שיקום ממסמים' }
  ));

  // 3. PROPERTY DIVISION DIVORCE (comprehensive)
  results.push(await upsert('property-division-divorce', 'חלוקת רכוש בגירושין | חוק, שיטות, מה מגיע | Jus-Tice',
    `<!-- wp:paragraph --><p>חלוקת רכוש בגירושין בישראל היא מהנושאים המורכבים ביותר — שכן ישנם שני חוקים שחלים בהתאם לתאריך הנישואין: "חוק יחסי ממון בין בני זוג" (לאחר 1974) ו"חוק השיתוף" (לפני 1974 או שחלות פסיקה).</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מחלקים ומה לא</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נכס</th><th>האם מחלקים</th><th>הערה</th></tr></thead><tbody>
<tr><td>דירה שנרכשה בנישואין</td><td>כן (50/50)</td><td>ממה מומנה</td></tr>
<tr><td>דירה שהייתה לפני נישואין</td><td>לא (עקרון)</td><td>אלא אם ערבוב</td></tr>
<tr><td>ירושה שהתקבלה</td><td>לא</td><td>אלא אם נכנסה לקופה משותפת</td></tr>
<tr><td>עסק שהוקם בנישואין</td><td>כן</td><td>שווי עסק — נדרש שמאי</td></tr>
<tr><td>פנסיה שנצברה</td><td>חלק שנצבר</td><td>חישוב אקטוארי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/divorce-financial-planning/">תכנון פיננסי בגירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חלוקת רכוש בגירושין | חוק, שיטות, מה מגיע | Jus-Tice', seo_description: 'חלוקת רכוש: 5 נכסים × מחלקים/לא בטבלה. דירה לפני = לא. ירושה = לא. עסק בנישואין = כן. מדריך 2025.', pillar_keyword: 'חלוקת רכוש גירושין', secondary_keywords: 'חלוקת נכסים גירושין,רכוש בגירושין,חוק יחסי ממון' }
  ));

  // 4. FAMILY ASHKELON
  results.push(await upsert('family-law-ashkelon', 'עורך דין משפחה אשקלון | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה באשקלון מייצג בבית המשפט לענייני משפחה. אשקלון — עיר ים דרומית צומחת — מאופיינת באוכלוסייה מגוונת עם קהילות מעולי אתיופיה וחבר העמים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה באשקלון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>אשקלון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-11,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-42,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה אשקלון | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה אשקלון: גירושין 4K-42K ₪. דרום ים, אוכלוסייה מגוונת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה אשקלון' }
  ));

  // 5. REAL ESTATE REHOVOT (large city, check if exists)
  results.push(await upsert('real-estate-lawyer-rehovot', 'עורך דין מקרקעין רחובות | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין ברחובות מטפל בשוק הגדול של עיר אוניברסיטאית — רחובות מחזיקה מכון ויצמן, היי-טק חקלאי, ומרכזי מחקר. הנדל"ן ברחובות זול יחסית לגוש דן אך ביקוש גבוה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין ברחובות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רחובות</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>6,000-15,000 ₪</td><td>12,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין רחובות | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין רחובות: רכישה 6K-15K ₪. מכון ויצמן, היי-טק חקלאי. זול מגוש דן. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין רחובות' }
  ));

  console.log('\n=== BATCH 38 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
