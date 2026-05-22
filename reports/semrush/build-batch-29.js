/**
 * Batch 29 — Herzliya city (3), elder law, tenant eviction defense
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

  // 1. REAL ESTATE HERZLIYA (tech hub + luxury Sharon)
  results.push(await upsert('real-estate-lawyer-herzliya', 'עורך דין מקרקעין הרצליה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בהרצליה מטפל בשוק יוקרתי — עיר ים עם היי-טק, מרינה, ובתים יוקרתיים. הרצליה פיתוח היא מהאזורים היקרים בישראל. רכישת נדל"ן כאן דורשת ייצוג משפטי מקצועי בשל ערכי העסקאות הגבוהים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בהרצליה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>הרצליה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>10,000-25,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>עסקת וילה/יוקרה</td><td>0.5-1% ממחיר</td><td>0.5-1.5%</td></tr>
<tr><td>השכרת נכס</td><td>1,500-4,000 ₪</td><td>2,000-5,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין הרצליה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין הרצליה: רכישה 10K-25K ₪. הרצליה פיתוח, מרינה, היי-טק — שוק יוקרה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין הרצליה' }
  ));

  // 2. CRIMINAL HERZLIYA
  results.push(await upsert('criminal-lawyer-herzliya', 'עורך דין פלילי הרצליה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בהרצליה מייצג בבית משפט השלום. הרצליה — עיר היי-טק ועסקים — מאופיינת בתיקי עבירות כלכליות, מס, סייבר, ועבירות עסקיות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בהרצליה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>הרצליה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-7,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עבירות היי-טק/סייבר</td><td>20,000-80,000 ₪</td><td>25,000-100,000 ₪</td></tr>
<tr><td>עבירות כלכליות</td><td>15,000-60,000 ₪</td><td>20,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי הרצליה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי הרצליה: עבירות סייבר 20K-80K, כלכלי 15K-60K ₪. עיר היי-טק. מדריך 2025.', pillar_keyword: 'עורך דין פלילי הרצליה' }
  ));

  // 3. FAMILY HERZLIYA
  results.push(await upsert('family-law-herzliya', 'עורך דין משפחה הרצליה | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בהרצליה מייצג בבית המשפט לענייני משפחה. הרצליה — עיר עם אוכלוסייה מגוונת כלכלית — מאופיינת בגירושין שבהם נכסים משמעותיים (מניות, נדל"ן, אופציות היי-טק) מחלקים לשני הצדדים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בהרצליה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>הרצליה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>6,000-15,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין עם נכסים מורכבים</td><td>20,000-80,000 ₪</td><td>25,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה הרצליה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה הרצליה: גירושין 6K-80K ₪. חלוקת מניות, אופציות היי-טק, נדל"ן יוקרה. מדריך 2025.', pillar_keyword: 'עורך דין משפחה הרצליה' }
  ));

  // 4. ELDER LAW ISRAEL (new niche pillar)
  results.push(await upsert('elder-law-israel', 'זכויות קשישים בישראל | פנסיה, ביטוח לאומי, אפוטרופסות | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מונה כ-1.1 מיליון אזרחים מעל גיל 65 — כ-12% מהאוכלוסייה. חוק הקשיש, חוק ביטוח לאומי, וחקיקה ספציפית מקנים לקשיש זכויות נרחבות שרבים אינם מממשים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות מרכזיות לקשישים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נושא</th><th>זכות</th><th>מאיפה</th></tr></thead><tbody>
<tr><td>קצבת זקנה</td><td>מגיל 67 (גבר) / 62-67 (אישה)</td><td>ביטוח לאומי</td></tr>
<tr><td>השלמת הכנסה</td><td>קשיש מתחת לסף — תוספת קצבה</td><td>ביטוח לאומי</td></tr>
<tr><td>פטור/הנחה בארנונה</td><td>מעל גיל 70 + הכנסה נמוכה</td><td>רשות מקומית</td></tr>
<tr><td>מעון/בית אבות</td><td>השתתפות מדינה בעלות</td><td>משרד הרווחה</td></tr>
<tr><td>ייפוי כוח מתמשך</td><td>הכנה בריאות לעתיד</td><td>חוק הכשרות</td></tr>
<tr><td>הגנה מפני ניצול</td><td>עבירת ניצול קשיש — חמורה</td><td>חוק עונשין</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשקשיש ניצול על ידי בן משפחה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) פנה לרשות הסעד של העירייה. 2) הגש תלונה למשטרה. 3) בקש מינוי אפוטרופוס דחוף (בית משפט). 4) נשית תביעה אזרחית להחזר נכסים גנובים. ניצול קשיש ניתן לריצוי עם עד 7 שנות מאסר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/guardianship-adult-israel/">אפוטרופסות למבוגר</a> | <a href="/power-of-attorney-guide/">ייפוי כוח</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות קשישים בישראל | פנסיה, ביטוח לאומי, הגנה | Jus-Tice', seo_description: '1.1M קשישים. קצבת זקנה מגיל 67. ניצול קשיש — 7 שנות מאסר. 6 זכויות בטבלה. מדריך 2025.', pillar_keyword: 'זכויות קשישים', secondary_keywords: 'חוק הקשיש,זכויות קשיש ישראל,ניצול קשיש' }
  ));

  // 5. TENANT EVICTION DEFENSE
  results.push(await upsert('tenant-eviction-defense', 'הגנת שוכר מפני פינוי | זכויות, ועוד | Jus-Tice',
    `<!-- wp:paragraph --><p>שוכר שקיבל מכתב פינוי — לא חייב לצאת מיד. יש לו זכויות, ויש לו זמן. שוכר שפועל נכון יכול להשיג: עיכוב פינוי, תשלום מוניטין (בדייר ותיק), או פיצוי אחר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>הזכויות של שוכר שמפנים אותו</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>זכות לקבל הסכם ברור לאי-חידוש שכירות (לא "לצאת מיד")</li>
<li>זכות לתקופת הודעה מוקדמת (לרוב 30-60 ימים)</li>
<li>זכות לקיצור הליך רק בפינוי מוצדק (אי-תשלום, נזק)</li>
<li>דייר ותיק: זכות למוניטין — עשרות עד מאות אלפי שקלים</li>
<li>זכות לייצוג בבית משפט ולהשמעת טענות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה ההבדל בין שוכר רגיל לדייר ותיק?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>שוכר רגיל: שכירות לפי הסכם מוגבל בזמן — פינוי כשהסכם פג. דייר ותיק (Protected Tenant): חי בנכס לפי הסכם ישן (לפני 1968) — קשה מאוד לפנותו, מגיע לו מוניטין גבוה מאוד.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/tenant-rights-israel/">זכויות שוכר</a> | <a href="/eviction-notice-israel/">הליך פינוי שוכר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגנת שוכר מפני פינוי | זכויות, דייר ותיק, מוניטין | Jus-Tice', seo_description: 'שוכר שמפנים: 5 זכויות. דייר ותיק = מוניטין עצום. אי-תשלום = פינוי מהיר. 30-60 ימי הודעה. מדריך 2025.', pillar_keyword: 'הגנת שוכר פינוי', secondary_keywords: 'שוכר מפני פינוי,דייר ותיק זכויות,מוניטין שוכר' }
  ));

  console.log('\n=== BATCH 29 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
