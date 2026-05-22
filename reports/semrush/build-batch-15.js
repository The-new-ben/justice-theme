/**
 * Batch 15 — RE lawyer Jerusalem, criminal lawyer Rishon, copyright (new pillar),
 * startup lawyer (new niche), alimony amount intent, divorce lawyer cost intent
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

  // 1. REAL ESTATE LAWYER JERUSALEM
  results.push(await upsert('real-estate-lawyer-jerusalem', 'עורך דין מקרקעין ירושלים | מחירים ומה ייחודי | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בירושלים מתמודד עם אחד השווקים המורכבים בעולם: נכסי מינהל, ירושות בינלאומיות, רכוש של תושבי חוץ, נכסים באזורים רגישים, וסיבוכי רישום היסטוריים. ירושלים מציגה אתגרים ייחודיים שלא קיימים בשאר הארץ.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>אתגרים ייחודיים בנדל"ן ירושלמי</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>נכסי מינהל מקרקעי ישראל:</strong> שיעור גבוה של הנכסים אינם בבעלות פרטית</li>
<li><strong>מעמד יהודי/לא-יהודי של בעלים:</strong> עלול להשפיע על זכויות ברחבת ושכונות</li>
<li><strong>נכסי ירושה מחו"ל:</strong> תושבי חוץ שורשיים, יהודים מחו"ל ששב לישראל</li>
<li><strong>בנייה בלתי חוקית:</strong> ירושלים מורכבת היסטורית — בדיקת היתרים קריטית</li>
<li><strong>ייחוד מגרשים:</strong> גבולות מגרשים ישנים שלא עודכנו</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה עורך דין מקרקעין בירושלים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>ירושלים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה (שכ"ט)</td><td>8,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>בדיקת מסמכים בלבד</td><td>1,500-4,000 ₪</td><td>2,000-5,000 ₪</td></tr>
<tr><td>תיקון ליקויי רישום</td><td>5,000-20,000 ₪</td><td>5,000-20,000 ₪</td></tr>
<tr><td>סכסוכי ירושה + נדל"ן</td><td>15,000-60,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/lawyers-jerusalem/">עורכי דין ירושלים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין ירושלים | מחירים ואתגרים ייחודיים | Jus-Tice', seo_description: 'עורך דין מקרקעין ירושלים: נכסי מינהל, ירושות בינ"ל, בנייה ישנה. רכישה 8K-20K ₪. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין ירושלים' }
  ));

  // 2. COPYRIGHT INFRINGEMENT (NEW PILLAR)
  results.push(await upsert('copyright-infringement-israel', 'הפרת זכויות יוצרים בישראל | מה אסור, פיצויים, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>זכויות יוצרים בישראל מוגנות על פי חוק זכות יוצרים, תשס"ח-2007. הפרת זכויות יוצרים — שימוש ביצירה ללא רשות — עלולה לחשוף את המפר לתביעה עד 100,000 ₪ ללא הוכחת נזק, ועד 2.5 מיליון ₪ בהפרה עסקית. כ-800 תביעות זכויות יוצרים מוגשות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מוגן בזכויות יוצרים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>יצירה</th><th>הגנה</th><th>תקופה</th></tr></thead><tbody>
<tr><td>ספרות, מאמרים, תוכן כתוב</td><td>כן</td><td>70 שנה מפטירת המחבר</td></tr>
<tr><td>צילומים</td><td>כן</td><td>70 שנה</td></tr>
<tr><td>תוכנה / קוד</td><td>כן</td><td>70 שנה</td></tr>
<tr><td>מוזיקה (כולל ביצוע)</td><td>כן</td><td>70 שנה (כתיבה) + 50 (ביצוע)</td></tr>
<tr><td>סרטים / וידאו</td><td>כן</td><td>70 שנה</td></tr>
<tr><td>עיצוב גרפי</td><td>כן</td><td>70 שנה</td></tr>
<tr><td>רעיון / שיטה</td><td>לא — רק הביטוי מוגן</td><td>—</td></tr>
<tr><td>חדשות / עובדות</td><td>לא</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>פיצויים בהפרת זכויות יוצרים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פיצוי בלא הוכחת נזק: עד 100,000 ₪ לסוגיה</li>
<li>פיצוי עסקי (פרצה מסחרית): עד 2,500,000 ₪</li>
<li>צו מניעה: להפסקת ההפרה מיידית</li>
<li>חילוט הרווחים: מה שהמפר הרוויח מההפרה</li>
<li>הוצאות משפט: על המפר בדרך כלל</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם הוספת קרדיט (קישור/שם הכותב) מתירה שימוש?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. קרדיט לא מחליף רשיון. חובה לקבל רשות מהיוצר (רישיון כתוב, רישיון Creative Commons, או תשלום). קרדיט הוא חובה מוסרית — לא חלופה לרשות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה הם "שימוש הוגן" ו"שימוש נסביר"?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>חוק ישראלי מכיר ב"שימוש הוגן" למטרות: ביקורת, לימוד, מחקר, דיווח חדשותי. אין רשימה סגורה — בית המשפט שוקל: מטרת השימוש, האם מסחרי, השפעה על שוק היצירה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/">חזרה לדף הבית</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הפרת זכויות יוצרים בישראל | פיצויים, מה אסור, מה עושים | Jus-Tice', seo_description: 'הפרת זכויות יוצרים: 800 תביעות בשנה. פיצוי ללא נזק 100K ₪, עסקי 2.5M ₪. מה מוגן, שימוש הוגן. מדריך 2025.', pillar_keyword: 'הפרת זכויות יוצרים', secondary_keywords: 'זכויות יוצרים ישראל,פיצויים זכויות יוצרים,שימוש הוגן ישראל' }
  ));

  // 3. STARTUP LAWYER ISRAEL (niche but growing fast)
  results.push(await upsert('startup-lawyer-israel', 'עורך דין לסטארטאפ | מניות, גיוס ומה צריך | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל — "אומת הסטארטאפ" — מייצרת כ-500 סטארטאפ חדשים בשנה. עורך דין לסטארטאפ מלווה מהיום הראשון: הסכמי ייסוד, הקצאת מניות, השקעות (SAFE, convertible note), ועד IPO. הטעות הנפוצה: לא להיעזר בעורך דין עד שכבר מאוחר מדי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שירותים שעורך דין סטארטאפ מספק</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>ייסוד חברה בע"מ (מזרז + מסמכים נכונים)</li>
<li>הסכם מייסדים (Founders Agreement) — מה קורה אם מייסד עוזב</li>
<li>Vesting schedules — הקצאת מניות בפריסה זמנית</li>
<li>Term Sheet ו-SHA (Shareholders Agreement)</li>
<li>מסמכי גיוס: SAFE, Convertible Note, Series A</li>
<li>NDAs ועבודה עם פריילנסרים/קבלנים</li>
<li>IP Assignment — וודא שקוד ה-IP בחברה, לא אצל מייסד</li>
<li>Exit: M&A, Term Sheet, Due Diligence</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מתי להיעזר בעורך דין לסטארטאפ?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>מהרגע שיש שותף. לא "כשהיה כסף" — כי אז כבר ייתכנו בעיות. הסכם מייסדים הוא ה-ROI הטוב ביותר לסטארטאפ (עלות: 3,000-8,000 ₪, ומונע סכסוכים שעלו מיליונים).</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה עולה עורך דין סטארטאפ?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הסכם מייסדים: 3,000-8,000 ₪. ייסוד חברה + מסמכים: 5,000-15,000 ₪. גיוס (SAFE / Convertible): 8,000-25,000 ₪. Series A: 30,000-100,000 ₪. יש עורכי דין שעובדים ב-equity חלקי + שכ"ט מוזל.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/">חזרה לדף הבית Jus-Tice</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין לסטארטאפ | מניות, גיוס, מה צריך | Jus-Tice', seo_description: '500 סטארטאפ חדשים בשנה. עורך דין סטארטאפ: הסכם מייסדים 3K-8K ₪, גיוס SAFE 8K-25K. 8 שירותים מרכזיים. מדריך 2025.', pillar_keyword: 'עורך דין סטארטאפ', secondary_keywords: 'עורך דין סטארטאפ ישראל,הסכם מייסדים,גיוס סטארטאפ' }
  ));

  // 4. DIVORCE LAWYER COST (specific cost intent)
  results.push(await upsert('divorce-lawyer-cost', 'כמה עולה עורך דין גירושין | מחירים, שכר טרחה | Jus-Tice',
    `<!-- wp:paragraph --><p>עלות עורך דין גירושין היא אחת השאלות הנפוצות ביותר — ולמרות זאת, רוב עורכי הדין לא מפרסמים מחירים. מדריך זה נותן מחירים ממוצעים עדכניים לשנת 2025, כולל ההבדלים בין גירושין בהסכמה לסכסוך.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין גירושין 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מינימום</th><th>ממוצע</th><th>מקסימום</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>0 ₪</td><td>300 ₪</td><td>600 ₪</td></tr>
<tr><td>גירושין בהסכמה מלאה</td><td>5,000 ₪</td><td>12,000 ₪</td><td>25,000 ₪</td></tr>
<tr><td>גירושין עם מחלוקות מסוימות</td><td>12,000 ₪</td><td>30,000 ₪</td><td>60,000 ₪</td></tr>
<tr><td>גירושין בסכסוך מלא</td><td>25,000 ₪</td><td>60,000 ₪</td><td>200,000 ₪+</td></tr>
<tr><td>ייצוג בדיון בלבד</td><td>2,000 ₪</td><td>5,000 ₪</td><td>15,000 ₪</td></tr>
<tr><td>הסכם גירושין בלבד</td><td>3,000 ₪</td><td>8,000 ₪</td><td>20,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה משפיע על עלות עורך דין גירושין?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>האם יש הסכמה מלאה בין הצדדים</li>
<li>מורכבות הרכוש (עסקים, נדל"ן, פנסיה)</li>
<li>מחלוקות על ילדים (משמורת, מזונות)</li>
<li>ניסיון ומוניטין עורך הדין</li>
<li>מיקום גיאוגרפי (תל אביב יקרה ב-20-40% מפריפריה)</li>
<li>שיטת תמחור: שעתי או ריטיינר</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לבצע גירושין בלי עורך דין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>גירושין בהסכמה ללא נדל"ן/ילדים/נכסים: כן, ניתן. אבל — הסכם גירושין ללא עורך דין עלול לאפשר אכיפה קשה בהמשך. מומלץ לפחות ייעוץ חד-פעמי (500-1,000 ₪) לבדיקת ההסכם.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם שני הצדדים יכולים להשתמש באותו עורך דין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בגירושין בהסכמה מלאה — חוקית אבל לא מומלצת. עורך דין לא יכול לייצג שני צדדים בסכסוך. בפועל: עורך דין אחד ייצג, השני יחתום לאחר עיון (ייעוץ ממליצים).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/divorce-agreement/">הסכם גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'כמה עולה עורך דין גירושין 2025 | מחירים עדכניים | Jus-Tice', seo_description: 'עורך דין גירושין: הסכמה 5K-25K, מחלוקות 12K-60K, סכסוך 25K-200K+. 6 גורמים שמשפיעים על עלות. מדריך 2025.', pillar_keyword: 'כמה עולה עורך דין גירושין', secondary_keywords: 'מחיר עורך דין גירושין,עלות גירושין ישראל,שכר טרחה גירושין' }
  ));

  // 5. CRIMINAL LAWYER RISHON LEZION
  results.push(await upsert('criminal-lawyer-rishon-lezion', 'עורך דין פלילי ראשון לציון | מחירים וייצוג | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בראשון לציון מייצג בבית משפט השלום ובמחוזי תל אביב. ראשון לציון, בסמיכות לתל אביב, מאפשרת לאזרח לבחור בין עורך דין בעלות נמוכה מעט יותר לעורך דין תל-אביבי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בראשון לציון?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>ראשון לציון</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-7,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-25,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>8,000-40,000 ₪</td><td>10,000-50,000 ₪</td></tr>
<tr><td>הכחשת נזק / הונאה</td><td>10,000-50,000 ₪</td><td>15,000-70,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/lawyers-rishon-lezion/">עורכי דין ראשון לציון</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי ראשון לציון | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי ראשון לציון: תעבורה 1.5K-7K, אלימות 6K-25K. מעט פחות מתל אביב. מדריך 2025.', pillar_keyword: 'עורך דין פלילי ראשון לציון' }
  ));

  console.log('\n=== BATCH 15 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
