/**
 * Batch 7 — New pillars + remaining city matrix + child custody general
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

  // 1. CHILD CUSTODY GENERAL GUIDE (different intent from /joint-custody/ - top of funnel)
  results.push(await upsert('child-custody-guide', 'משמורת ילדים | מדריך כולל: סוגים, הליך ומה קובע | Jus-Tice',
    `<!-- wp:paragraph --><p>משמורת ילדים היא אחת השאלות הראשונות שעולות בגירושין. מה ההבדל בין משמורת פיזית למשפטית? כיצד בית המשפט מחליט? מה קורה כשהורים אינם מסכימים? מדריך זה מסביר את כל הסוגים, השלבים, והגורמים שמשפיעים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי משמורת</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>הגדרה</th><th>מה כולל</th></tr></thead><tbody>
<tr><td>משמורת פיזית בלעדית</td><td>ילד גר עם הורה אחד בעיקר</td><td>80-100% מהזמן אצל הורה אחד</td></tr>
<tr><td>משמורת פיזית משותפת</td><td>ילד מתחלק בין שני הבתים</td><td>50-50, 60-40, 2-2-3 וכו'</td></tr>
<tr><td>משמורת משפטית בלעדית</td><td>הורה אחד מחליט על חינוך, בריאות, דת</td><td>נדיר — בנסיבות חריגות</td></tr>
<tr><td>משמורת משפטית משותפת</td><td>שני ההורים שותפים בהחלטות</td><td>הנפוץ ביותר גם כשפיזית בלעדי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד בית המשפט קובע משמורת?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>בית המשפט לענייני משפחה קובע לפי <strong>"טובת הילד"</strong> בלבד — לא לפי רצון ההורים, לא לפי מגדר ההורה, ולא לפי מי הגיש תחילה. בית המשפט שומע: הורים, עובדת סוציאלית, ולעיתים את הילד עצמו.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>גורמים שבית המשפט שוקל</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>גיל הילד ושלב ההתפתחות</li>
<li>קשר הילד עם כל הורה עד כה</li>
<li>יכולת כל הורה לספק יציבות</li>
<li>מצב רגשי ופיזי של כל הורה</li>
<li>איכות התקשורת בין ההורים</li>
<li>מרחק בין בתי ההורים</li>
<li>המלצת עובדת סוציאלית מטעם בית המשפט</li>
<li>משאלות הילד (לפי גיל ובשלות)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>משמורת בלעדית — מתי בית המשפט יקבע?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>היסטוריה מוכחת של אלימות או הזנחה</li>
<li>הורה עם בעיה חמורה: התמכרות, מחלת נפש לא מטופלת</li>
<li>הורה שאינו מסוגל לדאוג לצרכי הילד בסיסיים</li>
<li>הורה שחטף ילד או מנע קשר</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם אמא תמיד מקבלת משמורת?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. "חזקת הגיל הרך" (שעדיפות לאם עד גיל 6) בוטלה בפסיקה בשנות ה-2000. בית המשפט מחליט לגופו של עניין, לפי טובת הילד בלבד. שיעור המשמורת המשותפת עלה מ-21% ב-2012 ל-52% ב-2024.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח להסדיר משמורת?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בהסכמה: שבועות. בסכסוך: 6-24 חודשים עד פסק דין. בית המשפט מוציא "הסדר ביניים" בדרך כלל תוך ימים-שבועות מהגשה ראשונה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה ה"הסדר ביניים"?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הסדר זמני שנקבע בתחילת ההליך עד לפסק הדין הסופי. משמש כ"סטטוס קוו" — לכן חשוב להיות עם ייצוג כבר בדיון הראשון.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/joint-custody/">משמורת משותפת — מדריך מפורט</a> | <a href="/child-support-guide/">מזונות ילדים</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'משמורת ילדים | סוגים, הליך, ומה קובע בית המשפט | Jus-Tice', seo_description: 'משמורת ילדים: פיזית/משפטית, בלעדית/משותפת. כיצד בית המשפט קובע? 52% מגירושין 2024 = משמורת משותפת. מדריך כולל 2025.', pillar_keyword: 'משמורת ילדים', secondary_keywords: 'משמורת ילדים גירושין,איך קובעים משמורת,חזקת הגיל הרך' }
  ));

  // 2. PERSONAL INJURY (נזקי גוף)
  results.push(await upsert('personal-injury-israel', 'נזקי גוף בישראל | תאונות, פיצויים ואיך תובעים | Jus-Tice',
    `<!-- wp:paragraph --><p>נזקי גוף הם קטגוריה משפטית שכוללת תאונות דרכים, תאונות עבודה, החלקות בנכסים ציבוריים, ותקיפות. בישראל, כ-50,000 תיקי נזקי גוף נפתחים מדי שנה, מרביתם בתאונות דרכים. הפיצויים יכולים להגיע לעשרות ומאות אלפי שקלים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי נזקי גוף הנפוצים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>חוק / בסיס</th><th>פיצוי ממוצע</th></tr></thead><tbody>
<tr><td>תאונת דרכים</td><td>חוק הפיצויים לנפגעי תאונות דרכים</td><td>50,000 - 2,000,000 ₪</td></tr>
<tr><td>תאונת עבודה</td><td>פקודת הנזיקין + ביטוח לאומי</td><td>30,000 - 1,500,000 ₪</td></tr>
<tr><td>החלקה ברשות ציבורית</td><td>פקודת הנזיקין, ס' 41 (רשלנות)</td><td>20,000 - 500,000 ₪</td></tr>
<tr><td>תקיפה / תגרה</td><td>פקודת הנזיקין, ס' 23-24</td><td>10,000 - 200,000 ₪</td></tr>
<tr><td>כלב שנשך</td><td>חוק הפיקוח על כלבים</td><td>20,000 - 100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>רכיבי הפיצוי בנזקי גוף</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>כאב וסבל:</strong> קובע לפי מידת הנכות ומשך הסבל</li>
<li><strong>הפסד השתכרות:</strong> עבר (עד פסק הדין) ועתידי (אקטואר)</li>
<li><strong>הוצאות רפואיות:</strong> עבר ועתיד</li>
<li><strong>עזרת זולת:</strong> אם נדרש טיפול/עזרה יומיומית</li>
<li><strong>הפסד שנות עבודה:</strong> לנכות קבועה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תביעת נזקי גוף?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים מיום האירוע (לנפגע בוגר). לקטין — 7 שנים מגיל 18. תאונת דרכים — 7 שנים. מומלץ לא להמתין — ממצאים רפואיים, עדים וראיות מתקלקלים עם הזמן.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם עורך דין נזקי גוף עובד בתשלום לפי הצלחה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן, רוב עורכי הדין בנזקי גוף גובים 20-30% מהפיצוי — ולא גובים דבר אם לא מצליחים. כך גישה לצדק פתוחה גם ללא כסף מראש.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">רשלנות רפואית</a> | <a href="/birth-injury-compensation/">נזקי לידה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נזקי גוף בישראל | תאונות, פיצויים ואיך תובעים | Jus-Tice', seo_description: 'נזקי גוף: 50,000 תיקים בשנה. תאונת דרכים 50K-2M ₪, עבודה 30K-1.5M ₪, החלקה 20K-500K ₪. פיצויים לפי הצלחה. מדריך 2025.', pillar_keyword: 'נזקי גוף', secondary_keywords: 'תאונת דרכים פיצויים,תאונת עבודה תביעה,נזיקין ישראל' }
  ));

  // 3. CONSUMER RIGHTS (חדש — קול זכות מתחרה כאן!)
  results.push(await upsert('consumer-rights-israel', 'זכויות צרכן בישראל | ביטול עסקה, אחריות ומוצר פגום | Jus-Tice',
    `<!-- wp:paragraph --><p>זכויות הצרכן בישראל מוגנות בחוק הגנת הצרכן, תשמ"א-1981 — אחד החוקים הפרו-צרכן החזקים בעולם. כ-140,000 פניות מוגשות לרשות להגנת הצרכן בשנה. מדריך זה מסביר את זכויות הביטול, האחריות, ומוצר פגום.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות ביטול עסקה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג עסקה</th><th>זמן ביטול</th><th>דמי ביטול</th></tr></thead><tbody>
<tr><td>רכישה מקוונת (e-commerce)</td><td>14 יום מקבלת המוצר</td><td>עד 5% ממחיר, לא יותר מ-100 ₪</td></tr>
<tr><td>רכישה בחנות (חזרה)</td><td>14 יום — אם לא פתוח</td><td>לפי מדיניות החנות (חייבת להיות ברורה)</td></tr>
<tr><td>עסקת מנוי / שירות חוזר</td><td>בכל עת בהודעה 30 יום מראש</td><td>עד 5% מעלות שנה</td></tr>
<tr><td>עסקה עם עוסק מורשה (מרחוק)</td><td>14 יום</td><td>5% / 100 ₪ — הנמוך</td></tr>
<tr><td>מוצר פגום</td><td>תוך תקופת אחריות</td><td>ללא דמי ביטול</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>אחריות על מוצרים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>מוצרי חשמל / אלקטרוניקה:</strong> שנה אחריות חובה (לפי חוק)</li>
<li><strong>מוצרי לבוש:</strong> 6 חודשים (בפועל, לפי הגדרת "פגם" בחוק)</li>
<li><strong>רכב חדש:</strong> 3 שנים (תלוי יצרן)</li>
<li><strong>דירה חדשה מקבלן:</strong> עד 7 שנים לפגמים (חוק המכר-דירות)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם חנות חייבת להחזיר כסף ולא רק זיכוי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בביטול עסקה חוקי (14 יום) — כן, החנות חייבת להחזיר כסף, לא רק זיכוי. "נותנים רק זיכוי" אינו חוקי כשביטול העסקה הוא במסגרת הזכות החוקית.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשמוצר פגום ומסרבים לתקן?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנה לרשות להגנת הצרכן (1700-707-707). הגש תביעה בבית משפט לתביעות קטנות (עד 33,200 ₪) — ניתן בעצמך ללא עורך דין, אגרה כ-120 ₪.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לבטל שירות מנוי כמו ספורטל, HOT?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. לפי חוק הגנת הצרכן, ניתן לבטל כל מנוי בהודעה. הספק אינו יכול לדרוש יותר מ-30 ימי הודעה מראש ודמי ביטול של עד 5% מעלות שנה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/">חזרה לעמוד הבית Jus-Tice</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות צרכן בישראל | ביטול, אחריות, מוצר פגום | Jus-Tice', seo_description: '140,000 פניות לרשות הצרכן בשנה. ביטול מקוון: 14 יום, 5%/100₪. אחריות: שנה לחשמל. מוצר פגום. מדריך 2025.', pillar_keyword: 'זכויות צרכן', secondary_keywords: 'ביטול עסקה,אחריות על מוצר,הגנת הצרכן ישראל' }
  ));

  // 4. CITY HUB: BEER SHEVA
  results.push(await upsert('lawyers-beer-sheva', 'עורכי דין באר שבע | מדריך לשוק המשפטי בדרום | Jus-Tice',
    `<!-- wp:paragraph --><p>באר שבע היא עיר הדגל של הנגב ומרכז משפטי חשוב לדרום ישראל. לשכת עורכי הדין מחוז דרום מונה כ-2,800 חברים. בית המשפט המחוזי דרום (באר שבע) מכסה שטח גיאוגרפי עצום — מאשקלון ועד אילת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>בתי משפט באר שבע</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט המחוזי דרום:</strong> הנשיא הרצוג 3, באר שבע — תיקים כבדים</li>
<li><strong>בית משפט השלום באר שבע:</strong> הנשיא הרצוג 3 — תיקים יומיומיים</li>
<li><strong>בית הדין לעבודה באר שבע:</strong> — תביעות עבודה</li>
<li><strong>בית המשפט לענייני משפחה:</strong> — גירושין, ילדים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורכי דין באר שבע</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>באר שבע</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>דיני משפחה</td><td>6,000 - 35,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>פלילי</td><td>4,000 - 50,000 ₪</td><td>8,000 - 150,000 ₪</td></tr>
<tr><td>נדל"ן</td><td>4,000 - 18,000 ₪</td><td>8,000 - 40,000 ₪</td></tr>
<tr><td>ייעוץ שעתי</td><td>250 - 700 ₪/שעה</td><td>400 - 2,500 ₪/שעה</td></tr>
</tbody></table></figure><!-- /wp:table -->
<p>המחירים בדרום נמוכים ב-30-50% ממרכז הארץ — תוך שמירה על רמת מקצועיות גבוהה.</p>
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורכי דין באר שבע | מדריך שוק הדרום 2025 | Jus-Tice', seo_description: '2,800 עורכי דין מחוז דרום. מחירים 30-50% נמוכים מתל אביב. בתי משפט, תחומים. מדריך עורכי דין באר שבע 2025.', pillar_keyword: 'עורכי דין באר שבע' }
  ));

  // 5. CONTRACTOR DISPUTE
  results.push(await upsert('real-estate-developer-dispute', 'תביעה נגד קבלן | ליקויי בנייה, פיצויים ואחריות | Jus-Tice',
    `<!-- wp:paragraph --><p>תביעות נגד קבלנים על ליקויי בנייה הן מהתחומים הצומחים ביותר במקרקעין. חוק המכר (דירות), תשל"ג-1973, מעניק לרוכשים הגנות חזקות — אחריות לפגמים, פיצוי על עיכובים, וזכות ביטול. כ-10,000 תביעות ליקויי בנייה מוגשות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תקופות האחריות של קבלן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג ליקוי</th><th>תקופת אחריות</th><th>הדגמה</th></tr></thead><tbody>
<tr><td>ליקויים ברכיבי מבנה (יסודות, קירות נושאים)</td><td>7 שנים</td><td>סדקים, שקיעת יסודות</td></tr>
<tr><td>ליקויים בקירות, חיפויים, ריצוף</td><td>4 שנים</td><td>אריחים שנשברים, סדקים בגמר</td></tr>
<tr><td>ליקויים בצנרת, ביוב</td><td>3 שנים</td><td>נזילות, סתימות מבנייה</td></tr>
<tr><td>ליקויים בדלתות, חלונות, מנעולים</td><td>2 שנים</td><td>דלתות עקומות, חלונות דולפים</td></tr>
<tr><td>ליקויי גמר (צבע, טיח)</td><td>שנה אחת</td><td>קילוף צבע, בעיות גמר</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה עושים כשיש ליקויים?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>תעד הכל: צלם, כתוב רשימת ליקויים מפורטת</li>
<li>שלח הודעה בכתב (מסמך!) לקבלן — אל תסתפק בטלפון</li>
<li>הזמן מהנדס/שמאי ליקויי בנייה לחוות דעת (עלות: 3,000-8,000 ₪)</li>
<li>תן לקבלן הזדמנות לתקן בזמן סביר</li>
<li>אם מסרב — הגש תביעה לבית משפט השלום (עד 2.5 מיליון ₪) או מחוזי</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה פיצויים מקבלים על ליקויי בנייה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פיצוי עלות התיקון (לפי שמאי), ועוד: עוגמת נפש (5,000-30,000 ₪), ירידת ערך הנכס, שכר דירה לתקופת התיקון. בסכומים גדולים — הוצאות משפט.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם אפשר לבטל רכישת דירה בגלל ליקויים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ביטול חוזה מכר דירה הוא הקצה — רק בליקויים מהותיים שהופכים את הדירה לבלתי ראויה למגורים. בפועל, בתי המשפט מעדיפים לפסוק פיצויים על פני ביטול.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/buying-apartment/">רכישת דירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תביעה נגד קבלן | ליקויי בנייה, פיצויים ואחריות | Jus-Tice', seo_description: 'תביעות ליקויי בנייה: 10,000 תיקים בשנה. אחריות קבלן: 1-7 שנים לפי סוג. כיצד תובעים, כמה פיצויים. מדריך 2025.', pillar_keyword: 'ליקויי בנייה', secondary_keywords: 'תביעה נגד קבלן,ליקויי בנייה פיצויים,חוק המכר דירות' }
  ));

  console.log('\n=== BATCH 7 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
