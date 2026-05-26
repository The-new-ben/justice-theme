/**
 * Batch 18 — City pages for more regions + adoption + tax disputes + employment contract
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

  // 1. FAMILY LAW NETANYA
  results.push(await upsert('family-law-netanya', 'עורך דין משפחה נתניה | גירושין, מזונות, ייצוג | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בנתניה מייצג בבית המשפט לענייני משפחה נתניה ובבית הדין הרבני. נתניה, עיר עם אוכלוסייה מגוונת של עולים חדשים ותושבים ותיקים, מאופיינת בפנייה גבוהה לשירותי דיני משפחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין משפחה בנתניה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>נתניה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,500 - 14,000 ₪</td><td>8,000 - 20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000 - 55,000 ₪</td><td>20,000 - 80,000 ₪</td></tr>
<tr><td>מזונות ילדים (דיון)</td><td>2,500 - 9,000 ₪</td><td>4,000 - 15,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0 - 350 ₪</td><td>0 - 500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה נתניה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה נתניה: גירושין 4.5K-55K ₪, מזונות 2.5K-9K ₪. בית משפט משפחה נתניה. מדריך 2025.', pillar_keyword: 'עורך דין משפחה נתניה' }
  ));

  // 2. CRIMINAL LAWYER NETANYA
  results.push(await upsert('criminal-lawyer-netanya', 'עורך דין פלילי נתניה | מחירים וייצוג | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בנתניה מייצג בבית משפט השלום נתניה ובמחוזי תל אביב. נתניה מאופיינת בסמיכות לשרון ובתיקים הקשורים לנמל קיסריה, תעשיה ופשיעה כלכלית אזורית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בנתניה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>נתניה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>8,000-38,000 ₪</td><td>10,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי נתניה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי נתניה: תעבורה 1.5K-6.5K ₪, אלימות 6K-22K ₪. מדריך 2025.', pillar_keyword: 'עורך דין פלילי נתניה' }
  ));

  // 3. ADOPTION ISRAEL
  results.push(await upsert('adoption-israel-guide', 'אימוץ ילדים בישראל | תנאים, הליך ומה צריך לדעת | Jus-Tice',
    `<!-- wp:paragraph --><p>אימוץ ילדים בישראל הוא הליך ארוך ומורכב — אך מאפשר לאנשים שלא יכולים להביא ילדים להיות הורים. כ-200-300 ילדים מאומצים בישראל מדי שנה. מדריך זה מסביר את התנאים, ההליך, והזמנים הריאליים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תנאים לאימוץ בישראל</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>גיל מינימום של 25 (לפחות 18 שנה מבוגרים מהילד)</li>
<li>זוג נשוי (ל-3+ שנים) — ניתן לאמץ יחד</li>
<li>רווק/ה מגיל 30+ עם הצדקה מיוחדת — ייתכן</li>
<li>בריאות נפשית ופיזית תקינה</li>
<li>מצב כלכלי שמאפשר גידול ילד</li>
<li>אין עבר פלילי בעבירות כלפי ילדים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שלבי הליך האימוץ</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנייה לשירות למען הילד (הגשת בקשה + מסמכים)</li>
<li>הערכה פסיכו-סוציאלית (6-12 חודשים)</li>
<li>אישור ועדת אימוצים ברמה ארצית</li>
<li>שיבוץ ילד (המתנה: 2-6 שנים בממוצע)</li>
<li>תקופת היכרות ופגישות</li>
<li>הגשה לבית משפט לענייני משפחה לצו אימוץ</li>
<li>קבלת צו אימוץ — ההורים הביולוגיים מאבדים כל זכות</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח לאמץ בישראל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ממוצע: 4-8 שנים מרגע ההגשה. הרוב המכריע של הזמן הוא המתנה לשיבוץ — מספר הילדים הניתנים לאימוץ קטן בהרבה מהמבקשים. ילדים צעירים יותר — ממתינים יותר.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לאמץ ילד מחו"ל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן, אבל קשה יותר. ישראל חתומה על אמנת האג לאימוצים בינלאומיים. תהליך מחמיר. דרישות: אישור ממדינת המוצא, הסכמת המדינה הקולטת, ועוד. מדינות נפוצות: אוקראינה, קמבודיה, קולומביה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/surrogacy-israel/">פונדקאות</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אימוץ ילדים בישראל | תנאים, הליך וזמנים | Jus-Tice', seo_description: '200-300 אימוצים בשנה. 6 תנאים. 7-שלב הליך. 4-8 שנים ממוצע. אימוץ מחו"ל: אמנת האג. מדריך 2025.', pillar_keyword: 'אימוץ ילדים ישראל', secondary_keywords: 'אימוץ ילדים,הליך אימוץ,אימוץ מחו"ל ישראל' }
  ));

  // 4. EMPLOYMENT CONTRACT GUIDE
  results.push(await upsert('employment-contract-guide', 'מדריך חוזה עבודה | מה חייב להיות, סעיפים מסוכנים | Jus-Tice',
    `<!-- wp:paragraph --><p>חוזה עבודה הוא הבסיס ליחסי עובד-מעסיק. למרות שהחוק הישראלי מגן על עובדים רבות — חוזה שכולל סעיפים בעייתיים יכול לפגוע בזכויות. מדריך זה מסביר מה חייב להיות בחוזה, ומה לבדוק לפני חתימה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה חייב להיות בחוזה עבודה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פרטי הצדדים (שם, ת"ז, כתובת)</li>
<li>תאריך תחילת עבודה</li>
<li>היקף משרה (מלאה / חלקית / שעתית)</li>
<li>שכר ומועד תשלום</li>
<li>ימי חופשה ומחלה</li>
<li>הפרשות פנסיה (לפי חוק)</li>
<li>הגדרת התפקיד</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>סעיפים בעייתיים לשים לב</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סעיף</th><th>בעיה</th><th>מה לעשות</th></tr></thead><tbody>
<tr><td>סעיף אי-תחרות רחב</td><td>חוסם כל עבודה עתידית</td><td>לצמצם ל-12 חודשים + תחום ספציפי</td></tr>
<tr><td>"כולל כל שעות נוספות"</td><td>ביטול זכות שעות נוספות</td><td>לבדוק תקרה שעתית, יש לפרסם בנפרד</td></tr>
<tr><td>כוח שיקול דעת מוחלט למעסיק</td><td>שינוי תפקיד/שכר ללא הסכמה</td><td>לסגור הגדרה מדויקת</td></tr>
<tr><td>סיום עבודה ללא הודעה</td><td>פגיעה בזכות ל-notice period</td><td>חוק מגן: לפחות חודש</td></tr>
<tr><td>ייחוס IP לכל יצירה</td><td>גם יצירה פרטית שלך</td><td>לאפשר יצירה אישית מחוץ לשעות עבודה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם חוזה עבודה חייב להיות בכתב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — אך מומלץ מאוד. בלי חוזה כתוב, מגיל "ברירת מחדל" של חוק שחות (תנאים מינימליים) ותנאי ההעסקה שנהגו בפועל. חוזה כתוב עדיף הן לעובד והן למעסיק.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם חוזה יכול לקבוע פחות מהחוק?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. חוקי העבודה בישראל הם "חוקים מגנים" — אי-אפשר להוריד בחוזה מתחת לסטנדרט החוק. כל סעיף שפוגע בזכות חוקית — פסול. לדוגמה: "10 ימי חופשה בשנה" כאשר החוק מחייב 12 — הסעיף בטל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/non-compete-clause-israel/">סעיף אי-תחרות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מדריך חוזה עבודה | מה חייב להיות, סעיפים מסוכנים | Jus-Tice', seo_description: 'חוזה עבודה: 7 סעיפים חובה, 5 סעיפים מסוכנים. חוק מגן: לא ניתן לקחת מתחת לסטנדרט. מדריך 2025.', pillar_keyword: 'חוזה עבודה', secondary_keywords: 'חוזה עבודה מדריך,סעיפים חוזה עבודה,בדיקת חוזה עבודה' }
  ));

  // 5. REAL ESTATE TAX ISRAEL (mas shevah + mas rechisha)
  results.push(await upsert('real-estate-tax-israel', 'מס שבח ומס רכישה | כמה, מי משלם, פטורים | Jus-Tice',
    `<!-- wp:paragraph --><p>מס שבח ומס רכישה הם שני המיסים המרכזיים בעסקת נדל"ן בישראל. טעות בחישוב המיסים יכולה לעלות מאות אלפי שקלים. מדריך זה מסביר כמה, מי משלם, ומהם הפטורים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מס רכישה — הקונה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מדרגה</th><th>מחיר הדירה</th><th>שיעור (דירה יחידה)</th></tr></thead><tbody>
<tr><td>מדרגה 1</td><td>עד 1,978,745 ₪</td><td>0%</td></tr>
<tr><td>מדרגה 2</td><td>1,978,746 - 2,347,040 ₪</td><td>3.5%</td></tr>
<tr><td>מדרגה 3</td><td>2,347,041 - 6,055,070 ₪</td><td>5%</td></tr>
<tr><td>מדרגה 4</td><td>6,055,071 - 20,183,565 ₪</td><td>8%</td></tr>
<tr><td>מדרגה 5</td><td>מעל 20,183,565 ₪</td><td>10%</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מס שבח — המוכר</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>שיעור:</strong> 25% על הרווח הריאלי (אחרי אינפלציה)</li>
<li><strong>פטור לדירת מגורים יחידה:</strong> 0% — אם זה דירתך היחידה ומכרת פחות מ-3 חודשים מהרכישה</li>
<li><strong>פטור כל 18 חודשים:</strong> מי שמוכר דירה ואין לו דירה אחרת</li>
<li><strong>לינאריות:</strong> דירות שנרכשו לפני 2014 — חישוב לינארי מוטב</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן להפחית מס שבח?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — דרך ניכויים: הוצאות שיפוץ, שכ"ט עורך דין ברכישה, מס רכישה ששולם, עמלת תיווך. חשוב לתעד כל הוצאה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מתי צריך לשלם מס שבח?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תוך 30 יום מיום חתימת ההסכם. אחרת — קנסות ריבית. מי שאינו בטוח בחישוב — עורך דין מקרקעין מחשב עבורו.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך מקרקעין</a> | <a href="/buying-apartment/">רכישת דירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מס שבח ומס רכישה | כמה, פטורים, מי משלם | Jus-Tice', seo_description: 'מס רכישה: 0% עד 2M ₪ לדירה יחידה. מס שבח: 25% על רווח. פטורים ספציפיים. 30 יום לתשלום. מדריך 2025.', pillar_keyword: 'מס שבח מס רכישה', secondary_keywords: 'מס שבח ישראל,מס רכישה,פטור מס שבח' }
  ));

  console.log('\n=== BATCH 18 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
