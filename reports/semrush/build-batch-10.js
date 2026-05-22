/**
 * Batch 10 — Internal Linking: Update pillar pages with related article sections
 * Also: New content pages - prenuptial guide, adoption, pension, commercial lease, criminal appeal
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

async function getBySlug(slug) {
  const r = await api('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  return Array.isArray(r.body) && r.body.length > 0 ? r.body[0] : null;
}

async function appendInternalLinks(slug, linksList) {
  const page = await getBySlug(slug);
  if (!page) { console.log(`  SKIP (not found): ${slug}`); return; }
  
  const existingContent = page.content && page.content.rendered ? page.content.raw || '' : '';
  
  // Build the internal links section
  const linksHtml = linksList.map(([url, text]) => `<li><a href="${url}">${text}</a></li>`).join('\n');
  const appendBlock = `\n\n<!-- wp:heading --><h2>מאמרים קשורים</h2><!-- /wp:heading -->\n<!-- wp:list --><ul>\n${linksHtml}\n</ul><!-- /wp:list -->`;
  
  // Check if already has internal links section
  if (existingContent.includes('מאמרים קשורים')) {
    console.log(`  SKIP (already has links): ${slug}`);
    return;
  }
  
  const r = await api('POST', `/wp-json/wp/v2/pages/${page.id}`, { content: existingContent + appendBlock });
  console.log(`  LINKED | ${slug} | HTTP ${r.status}`);
  return r;
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

  // ══════════════════════════════════════════════════════════
  // PHASE 1: INTERNAL LINKING ON PILLAR PAGES
  // ══════════════════════════════════════════════════════════
  console.log('\n\n=== PHASE 1: INTERNAL LINKING ===\n');

  console.log('\n[family-law] Adding cluster links...');
  await appendInternalLinks('family-law', [
    ['/divorce-agreement/', 'הסכם גירושין — מה כולל, עלות ושלבים'],
    ['/child-support-guide/', 'מזונות ילדים — חישוב, זכאות ואכיפה'],
    ['/get-refusal-divorce/', 'סרבן גט — זכויות וכלים משפטיים'],
    ['/divorce-mediation-guide/', 'גישור גירושין — עלות, משך ומתי מתאים'],
    ['/cohabiting-couples-rights/', 'זכויות ידועים בציבור — מה מגיע ומה לא'],
    ['/child-custody-guide/', 'משמורת ילדים — סוגים, הליך ומה קובע'],
    ['/divorce-women-rights-israel/', 'זכויות האישה בגירושין — רכוש, מזונות, פנסיה'],
    ['/restraining-order-israel/', 'צו הגנה — כיצד מגישים וסוגים'],
    ['/joint-custody/', 'משמורת משותפת — המדריך המלא'],
    ['/alimony-israel/', 'מזונות — מדריך שלם'],
    ['/prenuptial-agreement/', 'הסכם קדם נישואין'],
    ['/divorce-pension-split/', 'פנסיה בגירושין'],
  ]);

  console.log('\n[criminal-defense-attorney] Adding cluster links...');
  await appendInternalLinks('criminal-defense-attorney', [
    ['/criminal-record-deletion/', 'מחיקת עבר פלילי — מי זכאי ואיך'],
    ['/police-investigation-rights/', 'זכויות בחקירה — המדריך המלא'],
    ['/plea-bargain/', 'עסקת טיעון — מה זה ומתי כדאי'],
    ['/white-collar-crime-israel/', 'עבירות צווארון לבן — מה הן ואיך מתגוננים'],
    ['/drug-offenses-israel/', 'עבירות סמים — ענישה, גישת הביקוש, הגנה'],
    ['/criminal-rights-arrest/', 'זכויות במעצר — מה מותר ואסור למשטרה'],
    ['/criminal-sentencing-israel/', 'גזר דין פלילי — ענישה וגורמים מקלים'],
    ['/traffic-offense-points/', 'נקודות רישיון ועבירות תעבורה'],
    ['/fraud-offenses-israel/', 'עבירות הונאה ומרמה'],
    ['/criminal-lawyer-cost/', 'כמה עולה עורך דין פלילי'],
  ]);

  console.log('\n[medical-malpractice-lawyer] Adding cluster links...');
  await appendInternalLinks('medical-malpractice-lawyer', [
    ['/medical-malpractice-diagnosis-errors/', 'רשלנות באבחון — שגיאות ופיצויים'],
    ['/medication-errors-malpractice/', 'רשלנות בתרופות — מינון שגוי ופיצויים'],
    ['/birth-injury-compensation/', 'נזקי לידה — שיתוק מוחין, CP, פיצויים'],
    ['/medical-malpractice-surgery/', 'רשלנות בניתוח — סוגים ואיך מוכיחים'],
    ['/medical-malpractice-haifa/', 'רשלנות רפואית חיפה — עורך דין ובתי חולים'],
    ['/medical-malpractice-tel-aviv/', 'רשלנות רפואית תל אביב'],
  ]);

  console.log('\n[real-estate-lawyer-guide] Adding cluster links...');
  await appendInternalLinks('real-estate-lawyer-guide', [
    ['/buying-apartment/', 'רכישת דירה — מדריך מלא לתהליך'],
    ['/real-estate-contract-review/', 'בדיקת חוזה מקרקעין — מה לבדוק לפני חתימה'],
    ['/real-estate-developer-dispute/', 'תביעה נגד קבלן — ליקויי בנייה ופיצויים'],
    ['/tenant-rights-israel/', 'זכויות דייר — שכירות, פינוי, פיקדון'],
    ['/inheritance-tax-israel/', 'מס ירושה בישראל — מה קיים ומה לא'],
    ['/real-estate-agent-vs-lawyer/', 'מתווך לעומת עורך דין מקרקעין'],
  ]);

  console.log('\n[inheritance-lawyer] Adding cluster links...');
  await appendInternalLinks('inheritance-lawyer', [
    ['/will-and-testament/', 'צוואה בישראל — 4 סוגים, עלות ותוקף'],
    ['/inheritance-dispute/', 'סכסוך ירושה — עילות, טיפול ועלות'],
    ['/inheritance-lawyer-guide/', 'עורך דין ירושה — שירותים ומחירים'],
    ['/inheritance-tax-israel/', 'מס ירושה — האם קיים ועל מה משלמים'],
    ['/cohabiting-couples-rights/', 'ידועים בציבור וירושה — מה הזכויות'],
    ['/power-of-attorney-guide/', 'ייפוי כוח מתמשך — תכנון מוקדם'],
  ]);

  // ══════════════════════════════════════════════════════════
  // PHASE 2: NEW CONTENT PAGES
  // ══════════════════════════════════════════════════════════
  console.log('\n\n=== PHASE 2: NEW CONTENT PAGES ===\n');

  const results = [];

  // 1. PRENUPTIAL AGREEMENT GUIDE (different intent — guide not process page)
  results.push(await upsert('prenuptial-agreement-guide', 'הסכם קדם נישואין | מה כולל, מתי כדאי ועלות | Jus-Tice',
    `<!-- wp:paragraph --><p>הסכם קדם נישואין (פרה-נופשיאל) הוא הסכם שנחתם לפני הנישואים ומגדיר את יחסי הרכוש של בני הזוג — גם אם יתגרשו. בישראל, החוק מאפשר לזוגות לקבוע הסדרים שונים מהסטנדרט של חוק יחסי ממון. כ-15% מהזוגות הנישאים בישראל עורכים הסכם קדם נישואין.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה ניתן לכלול בהסכם קדם נישואין?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הפרדת רכוש שהיה לכל אחד לפני הנישואים</li>
<li>הגדרת מה יחשב "רכוש משותף" בנישואים</li>
<li>חלוקת עסק/ות שנוסדו לפני הנישואים</li>
<li>הגדרת זכויות ירושה</li>
<li>מזונות במקרה גירושין</li>
<li>הגדרת נכסים שיישארו בנפרד (ירושה, מתנה מהורים)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה לא ניתן לכלול?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>ויתור על מזונות ילדים — אסור לחלוטין</li>
<li>קביעת משמורת על ילדים — בית המשפט יכריע לפי טובת הילד</li>
<li>תנאים שמעודדים גירושין (נחשב לתנאי נגד תקנת הציבור)</li>
<li>ויתור על זכויות שלא ניתן לוותר עליהן לפי חוק</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>עלות הסכם קדם נישואין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עלות</th></tr></thead><tbody>
<tr><td>הסכם פשוט (נכסים מועטים)</td><td>3,000 - 8,000 ₪</td></tr>
<tr><td>הסכם עם נכסים מורכבים / עסקים</td><td>10,000 - 30,000 ₪</td></tr>
<tr><td>אימות נוטריוני</td><td>300 - 600 ₪</td></tr>
<tr><td>אישור בית משפט לענייני משפחה</td><td>חובה — אגרה 800-1,500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם הסכם קדם נישואין מחייב לפי חוק?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם נחתם כחוק: בכתב, לפני נוטריון, ואושר על ידי בית משפט לענייני משפחה. ללא אישור שיפוטי — ייתכן שלא יהיה ניתן לאכיפה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לשנות הסכם קדם נישואין לאחר הנישואים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. ניתן לשנות או לבטל הסכם קדם נישואין בכל עת, בהסכמת שני הצדדים, תוך ביצוע הליך זהה (כתב, נוטריון, אישור שיפוטי).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/prenuptial-agreement/">הסכם קדם נישואין — מדריך קצר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הסכם קדם נישואין | מה כולל, עלות ומתי כדאי | Jus-Tice', seo_description: '15% מהזוגות בישראל עורכים הסכם קדם נישואין. עלות: 3K-30K ₪. מה ניתן לכלול ומה לא. חובת אישור שיפוטי. מדריך 2025.', pillar_keyword: 'הסכם קדם נישואין', secondary_keywords: 'פרה נופשיאל,הסכם לפני נישואים,הפרדת רכוש' }
  ));

  // 2. CRIMINAL APPEAL GUIDE
  results.push(await upsert('criminal-appeal-guide', 'ערעור פלילי | מתי כדאי, מה הסיכויים ואיך עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>ערעור פלילי הוא זכות חוקתית של כל נאשם שהורשע — אך לא כל הרשעה כדאי לערער עליה. סיכויי ערעור מוצלח בישראל: כ-20-25% מהמקרים שמגיעים לערעור. ההחלטה מתי לערער היא מהחשובות בתיק פלילי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>על מה ניתן לערער?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>נושא ערעור</th><th>עילה</th><th>סיכוי הצלחה</th></tr></thead><tbody>
<tr><td>שגיאה משפטית</td><td>שופט טעה בפרשנות החוק</td><td>גבוה יחסית</td></tr>
<tr><td>קבלת ראיה פסולה</td><td>ראיה שלא הייתה צריכה להתקבל</td><td>בינוני</td></tr>
<tr><td>כבדות עונש</td><td>עונש חמור מהנסיבות</td><td>בינוני-נמוך</td></tr>
<tr><td>הרשעה מנוגדת לראיות</td><td>הראיות לא תומכות בהרשעה</td><td>נמוך (אך קיים)</td></tr>
<tr><td>עדות שווא שהתגלתה</td><td>ראיות חדשות</td><td>גבוה אם מוכח</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מועדים לערעור</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>ערעור על הרשעה:</strong> 45 יום מיום גזר הדין</li>
<li><strong>ערעור על עונש בלבד:</strong> 45 יום מגזר הדין</li>
<li><strong>ערעור תביעה (על קלות עונש):</strong> 45 יום</li>
<li><strong>ערעור לבית המשפט העליון:</strong> ברשות בלבד — עניינים עקרוניים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לערער על עסקת טיעון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לרוב לא. עסקת טיעון הרשעה כוללת ויתור על זכות ערעור בנושאים מסוימים. אולם, ניתן לערער על ביצוע שגוי של העסקה, חריגה מהסכמות, או עסקה שנחתמה תחת לחץ.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עולה ערעור פלילי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ייצוג בערעור: 15,000-80,000 ₪ תלוי במורכבות. אגרת ערעור: כ-900 ₪. ערעור לעליון: 20,000-120,000 ₪.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/criminal-sentencing-israel/">גזר דין פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ערעור פלילי | מתי כדאי, סיכויים ואיך עושים | Jus-Tice', seo_description: 'ערעור פלילי: 45 יום מגזר הדין, 20-25% הצלחה. על מה ניתן לערער. עלות 15K-80K ₪. מדריך 2025.', pillar_keyword: 'ערעור פלילי', secondary_keywords: 'ערעור על הרשעה,ערעור עונש,ערעור פלילי בית משפט' }
  ));

  // 3. COMMERCIAL LEASE
  results.push(await upsert('commercial-lease-israel', 'שכירות עסקית בישראל | חוזה, זכויות ועלות | Jus-Tice',
    `<!-- wp:paragraph --><p>שכירות עסקית שונה מהותית משכירות מגורים. חוק השכירות והשאילה חל אך עם הרבה פחות הגנות לשוכר. חוזי שכירות עסקית הם לרוב לטובת המשכיר — ויש לבדוק כל סעיף לפני חתימה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>הבדלים מרכזיים משכירות מגורים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>שכירות מגורים</th><th>שכירות עסקית</th></tr></thead><tbody>
<tr><td>הגנת דייר</td><td>חזקה — חוק מגן</td><td>חלשה — חוזה שולט</td></tr>
<tr><td>העלאת שכר</td><td>מוגבלת בחוק</td><td>כמוסכם בחוזה</td></tr>
<tr><td>זכות ביטול</td><td>בדרך כלל 14 יום</td><td>לפי חוזה בלבד</td></tr>
<tr><td>ביטוח</td><td>לרוב אופציונלי</td><td>חובה לרוב (אחריות + נכסים)</td></tr>
<tr><td>שיפורים</td><td>שיבה לקדמות בסוף</td><td>נגוצים לפי חוזה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>סעיפים קריטיים בחוזה שכירות עסקית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>אורך תקופה ואופציות:</strong> כמה שנים בסיסיות + כמה אופציות</li>
<li><strong>עדכון שכר:</strong> הצמדה למדד? לאחוז? בגין מה?</li>
<li><strong>שיפורים:</strong> מי משלם? מה קורה להם בסוף השכירות?</li>
<li><strong>מקרה פשיטת רגל:</strong> מה זכויות המשכיר אם העסק נסגר?</li>
<li><strong>שימוש מותר:</strong> הגדרת שימוש ספציפי (לא לשנות ייעוד)</li>
<li><strong>ביטחונות:</strong> ערבות בנקאית, פיקדון, ערבות אישית</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה עולה בדיקת חוזה שכירות עסקית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בדיקה בלבד: 1,500-4,000 ₪. ניהול משא ומתן ותיקון חוזה: 3,000-10,000 ₪. לעסקים עם שכירות גבוהה (100,000+ ₪/שנה) — השקעה זו חוסכת טעויות שעולות הרבה יותר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם שוכר עסקי יכול לסגור עסק ולצאת?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>רק אם יש בחוזה "סעיף יציאה" (break clause). אחרת — אחראי לשכר עד סוף תקופה, גם אם העסק נסגר. לכן חשוב לנהל משא ומתן על סעיף זה לפני חתימה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/tenant-rights-israel/">זכויות דייר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שכירות עסקית בישראל | חוזה, זכויות ועלות | Jus-Tice', seo_description: 'שכירות עסקית: הגנות חלשות בהשוואה למגורים. סעיפים קריטיים לבדיקה. עלות בדיקת חוזה 1.5K-4K ₪. מדריך 2025.', pillar_keyword: 'שכירות עסקית', secondary_keywords: 'חוזה שכירות עסקי,שכירות מסחרית,בדיקת חוזה עסקי' }
  ));

  console.log('\n=== BATCH 10 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
  console.log('\n=== DONE ===');
}
main().catch(console.error);
