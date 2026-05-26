/**
 * Batch 17 — Criminal record, lawsuit cost, disability rights, consumer rights hub,
 * power of attorney types, debt collection, surrogacy
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

  // 1. CRIMINAL RECORD ISRAEL (broad intent — different from /criminal-record-deletion/)
  results.push(await upsert('criminal-record-israel', 'עבר פלילי | מה משמעותו, גישה, מחיקה ועיון | Jus-Tice',
    `<!-- wp:paragraph --><p>עבר פלילי (תיק פלילי) הוא רישום של הרשעות פליליות של אדם במאגר משטרת ישראל. לרישום עבר פלילי יכולות להיות השלכות על תעסוקה, ויזות, אחזקת נשק, ועוד. מדריך זה מסביר מה רשום, מי יכול לראות, ואיך ניתן למחוק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נכלל ב"עבר פלילי"?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג מידע</th><th>נכלל?</th></tr></thead><tbody>
<tr><td>הרשעות פליליות</td><td>כן</td></tr>
<tr><td>גזר דין (סוג עונש)</td><td>כן</td></tr>
<tr><td>כתבי אישום שנגנזו</td><td>לא — אלא אם הורשע</td></tr>
<tr><td>חקירות שנסגרו ללא כלום</td><td>לא</td></tr>
<tr><td>עבירות שנמחקו</td><td>אחרי המחיקה — לא</td></tr>
<tr><td>תיקי נוער</td><td>חסויים — אך יתכן שיאפשרו גישה מוגבלת</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מי יכול לעיין בעבר הפלילי שלי?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>מעסיקים בתפקידים רגישים:</strong> ביטחון, חינוך, בנקאות — בהסכמה</li>
<li><strong>רשויות המדינה:</strong> משטרה, בית משפט, גורמי ממשל</li>
<li><strong>האדם עצמו:</strong> זכות לעיין בתיקו</li>
<li><strong>מעסיק רגיל:</strong> לא — אלא אם הסכמת</li>
<li><strong>חברות ביטוח / בנקים:</strong> מוגבל</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם עבר פלילי מונע קבלה לעבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי בסוג העבירה ובתפקיד. הרשעה בגניבה — עלולה למנוע עבודה בבנק. הרשעה בתקיפה — עלולה למנוע עבודה בחינוך. הרשעה קלה בסמים לפני עשור — לרוב לא תמנע עבודה רגילה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מתי ניתן למחוק עבר פלילי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי חוק המרשם הפלילי: עבירה קלה — 7 שנים לאחר ריצוי העונש. עבירה בינונית — 10 שנים. עבירה חמורה — לא תמחק אוטומטית; ניתן לבקש מחיקה. ראה <a href="/criminal-record-deletion/">מדריך מחיקת עבר פלילי</a>.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-record-deletion/">מחיקת עבר פלילי</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עבר פלילי בישראל | מה משמעותו, גישה ומחיקה | Jus-Tice', seo_description: 'עבר פלילי: מה נרשם, מי יכול לראות, מתי נמחק. 7-10 שנים לאוטומטי. השלכות על תעסוקה. מדריך 2025.', pillar_keyword: 'עבר פלילי', secondary_keywords: 'תיק פלילי ישראל,עיון עבר פלילי,עבר פלילי תעסוקה' }
  ));

  // 2. LAWSUIT COST (informational, very high volume)
  results.push(await upsert('law-suit-cost-israel', 'כמה עולה תביעה משפטית בישראל | כל העלויות | Jus-Tice',
    `<!-- wp:paragraph --><p>עלות תביעה משפטית בישראל מורכבת מכמה רכיבים: שכר טרחת עורך דין, אגרות בית משפט, חוות דעת מומחים, והוצאות שונות. מדריך זה נותן תמונה שקופה של כל העלויות, כדי שתוכלו להחליט אם כדאי להגיש.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי תביעה משפטית לפי סוג</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג תביעה</th><th>אגרה</th><th>שכ"ט עו"ד</th><th>סה"כ (ממוצע)</th></tr></thead><tbody>
<tr><td>תביעות קטנות (עד 33,200)</td><td>120-600 ₪</td><td>ללא (אסור)</td><td>120-600 ₪</td></tr>
<tr><td>בית משפט שלום (50K-2.5M)</td><td>1-2.5% מהסכום</td><td>15,000-60,000 ₪</td><td>30,000-100,000 ₪</td></tr>
<tr><td>בית משפט מחוזי (2.5M+)</td><td>1% מהסכום</td><td>40,000-200,000 ₪</td><td>80,000-300,000 ₪</td></tr>
<tr><td>גירושין</td><td>800-1,500 ₪</td><td>10,000-80,000 ₪</td><td>20,000-100,000 ₪</td></tr>
<tr><td>פלילי (נאשם)</td><td>אין אגרה</td><td>8,000-100,000 ₪</td><td>8,000-100,000 ₪</td></tr>
<tr><td>בית הדין לעבודה</td><td>300-800 ₪</td><td>10,000-50,000 ₪</td><td>20,000-70,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה קורה אם מנצחים? ניתן לגבות הוצאות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. אם ניצחת — בית המשפט יכול לחייב את הצד המפסיד בהוצאות. אבל: הוצאות שנפסקות בדרך כלל נמוכות מהוצאות בפועל (50-80%). אל תסמוך על פסיקת הוצאות לכסות את כל ההשקעה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לקבל חזרה את האגרה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>אם הגעת לפשרה לפני ההחלטה — ניתן לבקש החזר חלקי. אם ניצחת — האגרה תיפסק לחובת הנתבע. אם הפסדת — לא.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/small-claims-court-israel/">תביעות קטנות</a> | <a href="/legal-aid-israel/">סיוע משפטי חינם</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'כמה עולה תביעה משפטית | כל האגרות והעלויות | Jus-Tice', seo_description: 'עלות תביעה: תביעות קטנות 120-600 ₪. שלום 30K-100K ₪. מחוזי 80K-300K ₪. עבודה 20K-70K ₪. מדריך 2025.', pillar_keyword: 'כמה עולה תביעה משפטית', secondary_keywords: 'עלות תביעה ישראל,אגרות בית משפט,שכר טרחה עורך דין תביעה' }
  ));

  // 3. DISABILITY RIGHTS ISRAEL
  results.push(await upsert('disability-rights-israel', 'זכויות אנשים עם מוגבלות בישראל | עבודה, רווחה, נגישות | Jus-Tice',
    `<!-- wp:paragraph --><p>כ-1.6 מיליון אנשים בישראל חיים עם מוגבלות — 18% מהאוכלוסייה. חוק שוויון זכויות לאנשים עם מוגבלות, תשנ"ח-1998, מגן עליהם בתחומי עבודה, שירותים ציבוריים, נגישות, ועוד. מדריך זה מסביר את הזכויות המרכזיות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות מרכזיות של אנשים עם מוגבלות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תחום</th><th>זכות</th><th>חוק/תקנה</th></tr></thead><tbody>
<tr><td>עבודה</td><td>אי-אפליה, התאמות סבירות</td><td>חוק שוויון הזדמנויות</td></tr>
<tr><td>נגישות</td><td>בניינים ציבוריים, תחבורה נגישים</td><td>תקנות הנגישות 2009</td></tr>
<tr><td>שירותים ציבוריים</td><td>שירות נגיש, ממשק נגיש</td><td>חוק שוויון זכויות</td></tr>
<tr><td>ייצוג</td><td>אפוטרופסות / ייפוי כוח</td><td>חוק הכשרות המשפטית</td></tr>
<tr><td>קצבאות</td><td>נכות, שירותים מיוחדים</td><td>ביטוח לאומי</td></tr>
<tr><td>חינוך</td><td>שילוב בחינוך רגיל, השגחה</td><td>חוק חינוך מיוחד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה "התאמה סבירה" בעבודה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>המעסיק חייב לבצע שינויים סבירים בסביבת העבודה כדי לאפשר לעובד עם מוגבלות לתפקד — ועד שהם לא "מטילים נטל בלתי סביר". דוגמאות: כסא ארגונומי, שמע מוגבר, גמישות שעות, גישה לחצרים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה מגיעה קצבת נכות כללית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>נכות כללית (ביטוח לאומי 2025): נכות מלאה — 3,200-4,800 ₪ לחודש תלוי בגיל ומצב. נכות חלקית (60%+) — 1,900-2,900 ₪. ניתן לקבל בנוסף: דמי כלכלה, השלמת הכנסה, שירותים מיוחדים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/discrimination-at-work/">אפליה בעבודה</a> | <a href="/guardianship-israel/">אפוטרופסות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות אנשים עם מוגבלות בישראל | עבודה, קצבה, נגישות | Jus-Tice', seo_description: '1.6M אנשים עם מוגבלות בישראל. 6 תחומי זכויות. קצבה: 3,200-4,800 ₪/חודש. התאמות סבירות בעבודה. מדריך 2025.', pillar_keyword: 'זכויות מוגבלות', secondary_keywords: 'זכויות אנשים עם מוגבלות ישראל,נכות כללית,נגישות חוק ישראל' }
  ));

  // 4. CONSUMER RIGHTS ISRAEL (pillar hub)
  results.push(await upsert('consumer-rights-israel', 'זכויות צרכן בישראל | ביטול, החזר, תביעה | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק הגנת הצרכן, תשמ"א-1981 וחוק ביטול עסקאות מרחוק נותנים לצרכן הישראלי הגנות משמעותיות. כ-120,000 תלונות צרכניות מוגשות לרשות הגנת הצרכן מדי שנה. מדריך זה מסביר את הזכויות המרכזיות שכדאי לדעת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות מרכזיות של צרכן בישראל</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>זכות</th><th>תנאים</th><th>בסיס חוקי</th></tr></thead><tbody>
<tr><td>ביטול עסקה מרחוק תוך 14 יום</td><td>רכישה מהאינטרנט/טלפון</td><td>חוק ביטול עסקאות</td></tr>
<tr><td>אחריות על מוצר</td><td>שנה + על כלי עבודה</td><td>חוק אחריות יצרנים</td></tr>
<tr><td>הצגת מחיר גמור (כולל מע"מ)</td><td>כל תצוגת מחיר</td><td>חוק הגנת הצרכן</td></tr>
<tr><td>איסור הטעיה</td><td>כל פרסום/עסקה</td><td>חוק הגנת הצרכן ס' 2</td></tr>
<tr><td>ביטול עסקה עקב ליקוי</td><td>מוצר לא תואם תיאור</td><td>חוק ביטול עסקאות</td></tr>
<tr><td>פיצוי ללא הוכחת נזק (הטעיה)</td><td>פסיקה</td><td>עד 10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מאמרים קשורים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><a href="/small-claims-court-israel/">בית משפט לתביעות קטנות</a></li>
<li><a href="/insurance-claim-dispute/">תביעת ביטוח שנדחתה</a></li>
<li><a href="/arbitration-vs-court/">בוררות לעומת בית משפט</a></li>
<li><a href="/rental-agreement-guide/">חוזה שכירות</a></li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כיצד מגישים תלונה לרשות הגנת הצרכן?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>דרך האתר gov.il/he/departments/consumer_protection. תלונה מוגשת ללא תשלום. זמן טיפול: 30-90 יום. הרשות מנסה גישור לפני פעולה אכיפתית.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם עסק חייב להחזיר כסף על מוצר שלא אהבתי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא בהכרח. אם המוצר תקין ותואם תיאורו — אין חובה חוקית להחזר. ה"מדיניות ביטול" של העסק (לרוב 14-30 יום) היא ניהולית לא חוקית. אבל — עסקה מרחוק (אונליין, טלפון): חובה 14 יום.</p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות צרכן בישראל | ביטול, החזר, תביעה | Jus-Tice', seo_description: '120,000 תלונות צרכניות בשנה. ביטול מרחוק 14 יום. אחריות שנה. פיצוי הטעיה 10,000 ₪. מדריך 2025.', pillar_keyword: 'זכויות צרכן', secondary_keywords: 'זכויות צרכן ישראל,ביטול עסקה,אחריות מוצר ישראל' }
  ));

  // 5. SURROGACY ISRAEL
  results.push(await upsert('surrogacy-israel', 'פונדקאות בישראל | הליך, זכויות ומה השתנה | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל הייתה אחת המדינות הראשונות בעולם שהסדירה פונדקאות בחוק (1996). בשנת 2021 חוקק חוק חדש שמאפשר גם לגברים יחידים ולקהילת הלהט"ב לפנות לפונדקאות. כ-300-400 הסכמי פונדקאות נחתמים בישראל מדי שנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי יכול לפנות לפונדקאות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מזמין</th><th>מחוק 2021</th></tr></thead><tbody>
<tr><td>זוג הטרוסקסואלי נשוי</td><td>כן</td></tr>
<tr><td>אישה יחידה (רווקה/גרושה)</td><td>כן</td></tr>
<tr><td>גבר יחיד</td><td>כן (מחוק 2021)</td></tr>
<tr><td>זוג חד-מיני (ב"ב)</td><td>כן (מחוק 2021)</td></tr>
<tr><td>זוג חד-מיני (ג"ג)</td><td>כן (מחוק 2021)</td></tr>
<tr><td>זר / תושב חוץ</td><td>לא — ישראלים בלבד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>עלות פונדקאות בישראל</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>סה"כ תהליך: 300,000 - 600,000 ₪</li>
<li>שכר הפונדקאית: 100,000 - 180,000 ₪</li>
<li>טיפולי פוריות + IVF: 30,000 - 80,000 ₪</li>
<li>שכ"ט עורך דין: 20,000 - 50,000 ₪</li>
<li>פסיכולוג, ביטוח, הוצאות נלוות: 30,000-80,000 ₪</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקחת פונדקאות בישראל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כ-2-4 שנים מרגע הפנייה — כולל: המתנה לועדת האישורים, מציאת פונדקאית, הליכי IVF, הריון ולידה, ורישום. ממוצע אמתי: 3 שנים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם הפונדקאית יכולה לשמור את הילד?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא לפי חוק הפונדקאות הישראלי — הפונדקאית אינה ההורה. ההורים הביולוגיים (מזמינים) הם ההורים המשפטיים. הפונדקאית מחויבת למסור את הילד לאחר הלידה לפי ההסכם.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'פונדקאות בישראל | הליך, עלות, זכויות 2025 | Jus-Tice', seo_description: 'פונדקאות: 300-400 הסכמים בשנה. עלות: 300K-600K ₪. חוק 2021 מרחיב לגברים יחידים ולהט"ב. 3 שנים ממוצע. מדריך 2025.', pillar_keyword: 'פונדקאות ישראל', secondary_keywords: 'פונדקאות בישראל,חוק פונדקאות,עלות פונדקאות' }
  ));

  console.log('\n=== BATCH 17 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
