/**
 * Batch 19 — Sexual harassment complaint procedure, child support calculation,
 * will executor, restraining order violation, labor law Tel Aviv, eviction process
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

  // 1. SEXUAL HARASSMENT COMPLAINT (procedural intent — different from general guide)
  results.push(await upsert('sexual-harassment-complaint', 'הגשת תלונה על הטרדה מינית | שלבים, מה לצפות | Jus-Tice',
    `<!-- wp:paragraph --><p>הטרדה מינית היא עבירה פלילית ועוולה אזרחית. הגשת תלונה היא צעד אמיץ — מדריך זה מסביר בדיוק מה עושים, שלב אחרי שלב. ישראל הכירה בהטרדה מינית בחוק ב-1998, ומאז אלפי תלונות מוגשות מדי שנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלולי תלונה — השוואה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מסלול</th><th>יתרון</th><th>חסרון</th><th>פיצוי</th></tr></thead><tbody>
<tr><td>תלונה פלילית (משטרה)</td><td>מחייב חקירה, עונש פלילי אפשרי</td><td>נטל הוכחה גבוה, פרוצדורה ארוכה</td><td>עונש פלילי לא פיצוי</td></tr>
<tr><td>תלונה למנהל (בעבודה)</td><td>מהיר יחסית, פנים-ארגוני</td><td>מעסיק עלול "לקבור" תלונה</td><td>אין ישיר</td></tr>
<tr><td>תביעה אזרחית לבית הדין לעבודה</td><td>פיצוי ישיר, ללא הוכחת נזק</td><td>זמן + עלות</td><td>עד 120,000 ₪ ויותר</td></tr>
<tr><td>ממונה על הטרדה מינית</td><td>כל מעסיק חייב להיות לו</td><td>תלוי בממונה הספציפי</td><td>אין ישיר</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שלבי הגשת תלונה בעבודה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>תעד את ההטרדות (תאריכים, מה נאמר/נעשה, עדים)</li>
<li>פנה לממונה על מניעת הטרדה מינית בארגון</li>
<li>אם לא מטופל — פנה למשאבי אנוש</li>
<li>אם עדיין לא מטופל — הגש תלונה לנציבות שוויון ההזדמנויות</li>
<li>בנוסף — הגש תביעה לבית הדין לעבודה (ניתן במקביל)</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש תלונה על הטרדה מינית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלונה פלילית: 10 שנות התיישנות. תביעה אזרחית לבית הדין לעבודה: 7 שנים (לרוב). תלונה ממונה: אין הגבלה ספציפית — ניתן בכל עת.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן להישאר אנונימי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי חוק, הממונה חייב לשמור על סודיות בתחילת החקירה. אולם, לחקירה מלאה ייתכן ויהיה צורך לזהות את המתלוננ/ת. בתביעה משפטית — הזהות מוצגת לנתבע.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/sexual-harassment-work/">מדריך הטרדה מינית בעבודה</a> | <a href="/discrimination-at-work/">אפליה בעבודה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגשת תלונה על הטרדה מינית | שלבים ומה לצפות | Jus-Tice', seo_description: 'הטרדה מינית: 4 מסלולי תלונה. פיצוי עד 120K ₪ ללא הוכחת נזק. 5-שלב בהגשה פנים-ארגונית. 7-10 שנות התיישנות. מדריך 2025.', pillar_keyword: 'תלונה הטרדה מינית', secondary_keywords: 'הגשת תלונה הטרדה מינית,ממונה הטרדה מינית,תביעה הטרדה מינית' }
  ));

  // 2. CHILD SUPPORT CALCULATION (specific calculator intent)
  results.push(await upsert('child-support-calculation', 'חישוב מזונות ילדים | כמה, נוסחה, מה משפיע | Jus-Tice',
    `<!-- wp:paragraph --><p>חישוב מזונות ילדים בישראל נקבע לפי פסיקת בית המשפט העליון (הלכת קיטאי-פרידמן, 2017, ורע"א 919/15) ולפי נסיבות כל מקרה. אין נוסחה אחת — אבל יש עקרונות ברורים. מדריך זה עוזר להבין בערך מה ניתן לצפות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>גורמים שמשפיעים על גובה המזונות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>הכנסת שני ההורים:</strong> גורם ראשי — מחלקים בפרופורציה</li>
<li><strong>גיל הילד:</strong> מתחת ל-6 — אב נושא יותר; מעל 6 — שני הורים</li>
<li><strong>הסדרי משמורת:</strong> במשמורת משותפת — מופחת</li>
<li><strong>צרכי הילד:</strong> נסיעות לחוגים, רפואה, חינוך פרטי</li>
<li><strong>רמת חיים שמרה בנישואים:</strong> ביהמ"ש מתחשב</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>טבלת הערכה — מזונות ילדים לפי הכנסה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>הכנסת האב (נטו)</th><th>ילד 1 (עד 6)</th><th>ילד 1 (6-15)</th><th>ילד 1 (15+)</th></tr></thead><tbody>
<tr><td>7,000 ₪</td><td>1,800-2,500 ₪</td><td>1,200-2,000 ₪</td><td>900-1,500 ₪</td></tr>
<tr><td>12,000 ₪</td><td>2,500-3,500 ₪</td><td>2,000-3,000 ₪</td><td>1,500-2,500 ₪</td></tr>
<tr><td>20,000 ₪</td><td>3,500-5,000 ₪</td><td>3,000-4,500 ₪</td><td>2,500-4,000 ₪</td></tr>
<tr><td>30,000 ₪</td><td>5,000-8,000 ₪</td><td>4,000-7,000 ₪</td><td>3,000-5,500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<p><em>* הערכות בלבד — בית המשפט קובע לפי כל הנסיבות</em></p>

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לשנות גובה המזונות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם יש שינוי נסיבות מהותי: שינוי הכנסה, שינוי צרכי הילד, שינוי הסדרי ראיה. פנה לבית המשפט לענייני משפחה לשינוי הפסיקה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה קורה אם האב לא משלם מזונות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנה להוצאה לפועל. ניתן לעקל משכורת, חשבון בנק, לשלול רישיון נהיגה. ישנה גם קרן למזונות (ביטוח לאומי) שמשלמת עד 1,600 ₪ לילד בחודש כשהאב לא משלם.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-support-guide/">מדריך מזונות ילדים</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חישוב מזונות ילדים | כמה, נוסחה, גורמים | Jus-Tice', seo_description: 'מזונות ילדים: 4 גורמים מרכזיים. טבלת הערכה לפי הכנסת האב. קרן מזונות 1,600 ₪. שינוי נסיבות. מדריך 2025.', pillar_keyword: 'חישוב מזונות ילדים', secondary_keywords: 'מזונות ילדים חישוב,כמה מזונות ישראל,נוסחת מזונות' }
  ));

  // 3. WILL EXECUTOR ISRAEL
  results.push(await upsert('will-executor-israel', 'מנהל עיזבון בישראל | תפקיד, מינוי, זכויות | Jus-Tice',
    `<!-- wp:paragraph --><p>מנהל עיזבון הוא האדם שמתמנה לניהול הרכוש שהשאיר הנפטר עד חלוקתו ליורשים. מינוי מנהל עיזבון אינו חובה — אך מומלץ בכל מקרה שיש נכסים, חובות, עסקים, או יורשים מרובים. כ-15,000 בקשות לניהול עיזבון מוגשות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי יכול להיות מנהל עיזבון?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>יורש שהצדדים הסכימו לו</li>
<li>עורך דין (מקצועי — לרוב עדיף)</li>
<li>רואה חשבון (לעיזבונות עם נכסים עסקיים)</li>
<li>גורם אחר שבית המשפט אישר</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>תפקידי מנהל עיזבון</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>איתור כל נכסי העיזבון</li>
<li>פרעון חובות העיזבון</li>
<li>הגשת דוחות מס ותשלומם</li>
<li>שמירה על הנכסים עד החלוקה</li>
<li>חלוקת הנכסים ליורשים לפי הצוואה/החוק</li>
<li>דיווח לרשם הירושות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה שכרו של מנהל עיזבון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי תקנות ניהול עיזבון: 2% מהעיזבון הכולל (עד 500,000 ₪), 1.5% מ-500K-2M, 1% מעל 2M. עורך דין שמשמש כמנהל עיזבון מוסיף שכ"ט עבור שירותים משפטיים נוספים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן נמשך ניהול עיזבון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>עיזבון פשוט (דירה + חשבון): 6-12 חודשים. עיזבון מורכב (עסקים, מניות, נדל"ן מרובה): 2-5 שנים. עיזבון עם סכסוכים: ללא הגבלה עד פסיקה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/inheritance-lawyer/">מדריך ירושה</a> | <a href="/will-and-testament/">צוואה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מנהל עיזבון בישראל | תפקיד, מינוי, שכר | Jus-Tice', seo_description: '15,000 בקשות לניהול עיזבון בשנה. שכר: 2% עד 500K, 1.5% עד 2M. 6 תפקידים. 6-60 חודשים. מדריך 2025.', pillar_keyword: 'מנהל עיזבון', secondary_keywords: 'מנהל עיזבון ישראל,ניהול עיזבון,רשם ירושות' }
  ));

  // 4. LABOR LAW TEL AVIV
  results.push(await upsert('labor-law-tel-aviv', 'עורך דין עבודה תל אביב | מחירים, שירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין עבודה בתל אביב מייצג בבית הדין האזורי לעבודה תל אביב — אחד הגדולים בישראל, עם אלפי תיקים חדשים בשנה. תל אביב, כמרכז הכלכלי של ישראל, מרכזת סכסוכי עבודה רבים בחברות הייטק, פיננסים, מסחר ועוד.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עלות עורך דין עבודה בתל אביב</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>תל אביב</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>400-700 ₪</td><td>300-500 ₪</td></tr>
<tr><td>תביעת פיטורים (שלום)</td><td>15,000-50,000 ₪</td><td>12,000-40,000 ₪</td></tr>
<tr><td>ייצוג בדיון</td><td>3,000-8,000 ₪/דיון</td><td>2,500-6,000 ₪</td></tr>
<tr><td>פיצויים בהצלחה</td><td>15-25% מהפיצוי</td><td>15-25%</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין עבודה תל אביב | מחירים ושירותים 2025 | Jus-Tice', seo_description: 'עורך דין עבודה תל אביב: תביעת פיטורים 15K-50K ₪, ייעוץ 400-700 ₪. בית דין לעבודה TA. מדריך 2025.', pillar_keyword: 'עורך דין עבודה תל אביב' }
  ));

  // 5. RESTRAINING ORDER VIOLATION
  results.push(await upsert('restraining-order-violation', 'הפרת צו הגנה | מה קורה, עונש, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>הפרת צו הגנה היא עבירה פלילית חמורה שיכולה להוביל למאסר מיידי. אם בן/ת הזוג, שכן, או אחר שהוצא נגדו צו הגנה — הפר את הצו, יש לך צעדים ברורים לנקוט.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה נחשב הפרת צו הגנה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>כניסה לבית / לאזור שאסור לו להיכנס</li>
<li>פנייה בכל אמצעי תקשורת (טלפון, WhatsApp, דוא"ל, סושיאל)</li>
<li>התקרבות בניגוד למרחק שנקבע</li>
<li>יצירת קשר דרך צד שלישי</li>
<li>נוכחות במקומות שאסור (בית ספר, עבודה)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה עושים ברגע הפרת הצו?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>תעד מיד (צילום, תכתובת, עדות שכן)</li>
<li>קשר לפי מצב: 100 (משטרה) אם בסכנה, 110 (משמר הגבול) בנפרד</li>
<li>הגש תלונה במשטרה עם ראיות</li>
<li>דווח לעורך הדין שלך</li>
<li>בקש מבית המשפט להחמיר את הצו</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>עונש על הפרת צו הגנה</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי חוק למניעת אלימות במשפחה: מאסר עד שנה. הפרה חוזרת — עד 3 שנים. בית המשפט יכול לצוות מעצר מיידי. הוצאת צו מרחיק מהבית — ניתן לבצע תוך שעות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם פנייה "תמימה" (כגון "מה שלומך") מהווה הפרה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם צו הגנה אוסר כל פנייה, גם פנייה "תמימה" היא הפרה. "לא ידעתי" — אינה הגנה. אם הצו קיים — כל קשר אסור לחלוטין.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/restraining-order-israel/">מדריך צו הגנה</a> | <a href="/domestic-violence-israel/">אלימות במשפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הפרת צו הגנה | עונש, מה עושים, מה מהווה הפרה | Jus-Tice', seo_description: 'הפרת צו הגנה: עד שנה מאסר, חוזרת עד 3 שנים. 5 סוגי הפרה. 5-שלב מה לעשות. מיידי: 100 משטרה. מדריך 2025.', pillar_keyword: 'הפרת צו הגנה', secondary_keywords: 'הפרת צו הגנה ישראל,צו הגנה הפרה,עונש הפרת צו' }
  ));

  console.log('\n=== BATCH 19 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
