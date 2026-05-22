/**
 * Batch 33 — Raanana city, child welfare law, divorce financial planning,
 * employment contract termination
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

  // Check criminal-lawyer-rishon-lezion
  const checkRishon = await api('GET', '/wp-json/wp/v2/pages?slug=criminal-lawyer-rishon-lezion&status=any&per_page=1');
  if (Array.isArray(checkRishon.body) && checkRishon.body.length > 0) {
    console.log('\n>>> criminal-lawyer-rishon-lezion exists (ID ' + checkRishon.body[0].id + ') — skipping');
  }

  // 1. REAL ESTATE RAANANA (affluent suburban city)
  results.push(await upsert('real-estate-lawyer-raanana', 'עורך דין מקרקעין רעננה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין ברעננה מטפל בשוק יוקרתי בלב השרון — עיר מבוקשת עם אוכלוסייה אנגלופונית גדולה, נדל"ן יוקרתי, ותוכניות פינוי-בינוי. רעננה היא מהערים הנחשבות ביותר בישראל לאיכות חיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין ברעננה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רעננה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>8,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>עסקת בית פרטי</td><td>12,000-30,000 ₪</td><td>15,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין רעננה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין רעננה: רכישה 8K-20K ₪. עיר יוקרה, אנגלופונים, שרון. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין רעננה' }
  ));

  // 2. FAMILY LAW RAANANA
  results.push(await upsert('family-law-raanana', 'עורך דין משפחה רעננה | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה ברעננה מייצג בבית המשפט לענייני משפחה. רעננה — עם אוכלוסייה של מעמד בינוני-גבוה ורבים דוברי אנגלית — מאופיינת בגירושין מורכבים עם נכסים, עסקים, ומשמורת בינלאומית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה ברעננה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רעננה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>6,000-15,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין מורכבים</td><td>20,000-80,000 ₪</td><td>25,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה רעננה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה רעננה: גירושין 6K-80K ₪. נכסים, עסקים, משמורת בינלאומית. מדריך 2025.', pillar_keyword: 'עורך דין משפחה רעננה' }
  ));

  // 3. CHILD WELFARE LAW (very specific Israeli law)
  results.push(await upsert('child-welfare-law-israel', 'חוק הנוער (טיפול והשגחה) | ילדים בסיכון, פקיד סעד | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק הנוער (טיפול והשגחה), תש"ך-1960 מסמיך את פקידי הסעד להתערב בחיי ילדים בסיכון — כולל הוצאתם מהמשפחה. כ-8,000-10,000 ילדים מאובחנים מדי שנה כ"ילדים בסיכון" בישראל. הורים שמתמודדים עם פקיד סעד — זקוקים לייצוג משפטי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי פקיד סעד יכול להוציא ילד מהבית?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עילה</th><th>הליך</th></tr></thead><tbody>
<tr><td>הזנחה פיזית</td><td>דיון בבית משפט לנוער</td></tr>
<tr><td>אלימות גופנית</td><td>צו חירום + דיון</td></tr>
<tr><td>התעללות מינית</td><td>צו חירום מיידי</td></tr>
<tr><td>הזנחה רגשית קיצונית</td><td>דיון</td></tr>
<tr><td>הורה עם מחלת נפש בלתי מטופלת</td><td>דיון</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כיצד להתמודד עם פקיד סעד?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) שתף פעולה — אך דע את זכויותיך. 2) קבל עורך דין לפני כל שיחה משמעותית. 3) תעד את כל מה שנאמר. 4) פקיד הסעד חייב להציג מינוי ולהסביר סיבת הביקור. 5) כל פקיד סעד מחויב לקדם את טובת הילד — לא להרוס משפחות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-custody-guide/">מדריך משמורת ילדים</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חוק הנוער — טיפול והשגחה | ילדים בסיכון, פקיד סעד | Jus-Tice', seo_description: '8-10K ילדים בסיכון/שנה. 5 עילות הוצאה. 5 כללים להתמודד עם פקיד סעד. ייצוג הורים בבית משפט לנוער.', pillar_keyword: 'ילדים בסיכון', secondary_keywords: 'פקיד סעד ילדים,חוק הנוער ישראל,הוצאת ילד מהבית' }
  ));

  // 4. DIVORCE FINANCIAL PLANNING
  results.push(await upsert('divorce-financial-planning', 'תכנון פיננסי בגירושין | נכסים, מס, חובות | Jus-Tice',
    `<!-- wp:paragraph --><p>גירושין משפיעים על כל אספקט פיננסי — רכוש, חובות, מס הכנסה, פנסיה. תכנון נכון לפני הגירושין ובמהלכם יכול לחסוך עשרות עד מאות אלפי שקלים. מדריך זה מציג את הנושאים המרכזיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נכסים עיקריים שמחלקים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נכס</th><th>חלוקה (ברוב המקרים)</th><th>שיקולים</th></tr></thead><tbody>
<tr><td>דירת מגורים</td><td>50/50 (אם משותפת)</td><td>מתי נרכשה, ממה מומנה</td></tr>
<tr><td>פנסיה</td><td>חלק שנצבר בנישואין</td><td>אקטואר, גיל, שכר</td></tr>
<tr><td>עסק</td><td>50/50 אם הוקם בנישואין</td><td>שווי עסק, רכישה לפני</td></tr>
<tr><td>ירושה</td><td>לרוב לא מחלקים</td><td>ערבוב עם כספים משותפים</td></tr>
<tr><td>חובות</td><td>שניהם אחראים (אם משותפים)</td><td>הלוואות לפני נישואין</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/divorce-pension-split/">חלוקת פנסיה</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תכנון פיננסי בגירושין | נכסים, מס, חובות | Jus-Tice', seo_description: 'גירושין: 5 נכסים + חלוקה בטבלה. פנסיה חלקית, עסק 50/50, ירושה — לא מחלקים. תכנון חוסך עשרות K.', pillar_keyword: 'תכנון פיננסי גירושין', secondary_keywords: 'חלוקת נכסים גירושין,גירושין כלכלי,כלכלה בגירושין' }
  ));

  // 5. EMPLOYMENT CONTRACT TERMINATION
  results.push(await upsert('employment-contract-termination', 'סיום חוזה עבודה | זכויות, הוצאה, זהירות | Jus-Tice',
    `<!-- wp:paragraph --><p>סיום חוזה עבודה — בין פיטורים, התפטרות, או פקיעת חוזה — כרוך בזכויות מוסדרות. עובד שלא יודע את זכויותיו עלול לאבד אלפי שקלים. מדריך זה מכסה את כל הסוגים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מגיע בסיום עבודה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>פיטורים</th><th>התפטרות</th></tr></thead><tbody>
<tr><td>פיצויי פיטורים</td><td>כן (חודש לשנה)</td><td>לא (חריגים)</td></tr>
<tr><td>הודעה מוקדמת</td><td>כן (שכר/עבודה)</td><td>כן (עבודה)</td></tr>
<tr><td>חופשה שלא נוצלה</td><td>כן</td><td>כן</td></tr>
<tr><td>פנסיה שנצברה</td><td>כן (ניוד)</td><td>כן (ניוד)</td></tr>
<tr><td>דמי אבטלה</td><td>כן (תנאים)</td><td>לא (בד"כ)</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מתי התפטרות = פיטורים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>התפטרות "בדין מפוטר" = זכאות לפיצויים כאילו פוטרתי. מתי? (1) מצב בריאות שמנע המשך עבודה. (2) שינוי מהותי בתנאי עבודה ע"י מעסיק. (3) טרדה/הטרדה. (4) העברה לסניף רחוק. יש להוכיח זאת לבית הדין לעבודה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סיום חוזה עבודה | זכויות, פיטורים, התפטרות | Jus-Tice', seo_description: 'סיום עבודה: 5 רכיבים × פיטורים vs התפטרות. התפטרות בדין מפוטר = פיצויים בגלל 4 עילות. מדריך 2025.', pillar_keyword: 'סיום חוזה עבודה', secondary_keywords: 'זכויות סיום עבודה,פיצויי פיטורים,התפטרות בדין מפוטר' }
  ));

  console.log('\n=== BATCH 33 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
