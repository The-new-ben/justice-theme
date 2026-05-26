/**
 * Batch 13 — Domestic violence, rental agreement guide, divorce financial disclosure,
 * will dispute grounds, non-compete clause, corporate law intro, age discrimination
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

  // 1. DOMESTIC VIOLENCE (cross-pillar: family + criminal)
  results.push(await upsert('domestic-violence-israel', 'אלימות במשפחה בישראל | זכויות, דיווח ועורך דין | Jus-Tice',
    `<!-- wp:paragraph --><p>אלימות במשפחה היא עבירה פלילית חמורה ובמקביל נושא למשפט אזרחי (צו הגנה, גירושין, משמורת). בישראל, כ-100,000 תיקי אלימות במשפחה נפתחים במשטרה מדי שנה. הנפגעים זכאים לעזרה מיידית, הגנה משפטית, ותמיכה כלכלית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מוגדר אלימות במשפחה בחוק?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג אלימות</th><th>דוגמה</th><th>הגדרה חוקית</th></tr></thead><tbody>
<tr><td>פיזית</td><td>מכות, דחיפות, חנק</td><td>תקיפה, חבלה חמורה</td></tr>
<tr><td>מינית</td><td>יחסי מין בכפייה</td><td>אונס בין בני זוג — עבירה פלילית</td></tr>
<tr><td>נפשית</td><td>השפלות חוזרות, שליטה</td><td>הטרדה מאיימת, ס' 192א</td></tr>
<tr><td>כלכלית</td><td>שליטה בכספים, מניעת עבודה</td><td>ניתן לצרף לתביעה אזרחית</td></tr>
<tr><td>רדיפה (stalking)</td><td>מעקב, הטרדות חוזרות</td><td>הטרדה מאיימת</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה עושים מיד?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>התקשרות: 100 (משטרה) — אם בסכנה מיידית</li>
<li>קו לסיוע לנפגעי אלימות במשפחה: 1202</li>
<li>מקלט לנשים מוכות: 1203</li>
<li>הגש תלונה במשטרה — גם ב"רטרוספקט" ניתן</li>
<li>בקש צו הגנה (ר' <a href="/restraining-order-israel/">מדריך צו הגנה</a>)</li>
<li>פנה לעורך דין דיני משפחה ופלילי</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>זכויות כלכליות לנפגעי אלימות במשפחה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>מזונות דחופים: בית המשפט יכול לפסוק תוך ימים</li>
<li>פינוי הגורם האלים מהבית — ניתן לבקש צו ביניים</li>
<li>שמירת גישה לחשבון משותף</li>
<li>קצבת ילדים ישירות לנפגע/ת</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתבוע בן/ת זוג על אונס?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן. בישראל, אונס בין בני זוג מוכר כעבירה פלילית מלאה — אין "חסינות זוגית". ניתן להגיש תלונה פלילית ובמקביל לתבוע פיצויים אזרחיים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ילדים יכולים לדווח על אלימות בבית?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — וזו חובה. חוק הנוער (טיפול והשגחה) מחייב כל אדם לדווח על ילד בסכנה. ילד יכול לפנות לעובד סוציאלי בבית ספר, שיגיש דיווח. המספר: 1201 (ידיד הנוער).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/restraining-order-israel/">צו הגנה</a> | <a href="/family-law/">מדריך דיני משפחה</a> | <a href="/criminal-defense-attorney/">משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אלימות במשפחה | זכויות, דיווח, צו הגנה | Jus-Tice', seo_description: '100,000 תיקי אלימות במשפחה בשנה. 5 סוגי אלימות. 6 צעדים מיידיים. מספרים: 100, 1202, 1203. מדריך 2025.', pillar_keyword: 'אלימות במשפחה', secondary_keywords: 'אלימות במשפחה ישראל,קו חם אלימות,אונס בין בני זוג' }
  ));

  // 2. RENTAL AGREEMENT GUIDE
  results.push(await upsert('rental-agreement-guide', 'חוזה שכירות | מה חייב להיות, סעיפים מסוכנים | Jus-Tice',
    `<!-- wp:paragraph --><p>חוזה שכירות טוב מגן על שני הצדדים — שוכר ומשכיר. אולם, חוזי שכירות רבים כוללים סעיפים בעייתיים שעלולים לפגוע בזכויות השוכר. לפני חתימה — כדאי לדעת מה לבדוק. עלות בדיקת חוזה שכירות על ידי עורך דין: 500-2,000 ₪ — ועלולה לחסוך הרבה יותר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה חייב להיות בחוזה שכירות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>פרטי הצדדים (שם מלא, ת.ז.) ופרטי הנכס</li>
<li>תקופת השכירות (תאריך התחלה וסיום)</li>
<li>סכום שכר הדירה ומועד תשלום</li>
<li>אופן עדכון שכר (אינדקס? אחוז? שנתי?)</li>
<li>גובה הפיקדון ותנאי השבתו</li>
<li>ביטחונות נוספים (ערבות בנקאית, שטר חוב)</li>
<li>האחריות לתיקונים (מה של שוכר, מה של משכיר)</li>
<li>תנאי סיום ופינוי</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>סעיפים בעייתיים לשים לב אליהם</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סעיף</th><th>בעיה פוטנציאלית</th><th>מה לבדוק</th></tr></thead><tbody>
<tr><td>עדכון שכר</td><td>"הצמדה" ללא הגבלה</td><td>מהו הבסיס? מהו תקרה?</td></tr>
<tr><td>פיקדון גבוה</td><td>מעל 3 חודשים — חריג</td><td>לא לחתום על יותר מ-3 חודשים</td></tr>
<tr><td>תיקונים</td><td>"שוכר אחראי לכל תיקון"</td><td>בחוק: קטנים = שוכר, גדולים = משכיר</td></tr>
<tr><td>יציאה מוקדמת</td><td>ללא אפשרות יציאה</td><td>בקש break clause עם 60 ימי הודעה</td></tr>
<tr><td>כניסת משכיר</td><td>ללא הגדרת הודעה</td><td>דרוש "48 שעות הודעה"</td></tr>
<tr><td>שינויים בדירה</td><td>"אסור לשנות דבר"</td><td>בקש רשות לתמונות/וילונות לפחות</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם חובה שחוזה שכירות יהיה בכתב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לגבי שכירות מעל שנה — כן, חובה בכתב (חוק השכירות). לפחות שנה — אין חובה חוקית, אך מאוד מומלץ. בעל פה אפשרי אך מוביל לסכסוכים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם המשכיר לא שולח חוזה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>שלח הודעה בכתב (WhatsApp, אימייל) עם תנאים ברורים. תכתובת כתובה יכולה לשמש כחוזה. אל תעבור לדירה ללא חוזה ותיעוד של המצב הנוכחי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/tenant-rights-israel/">זכויות דייר</a> | <a href="/landlord-rights-israel/">זכויות משכיר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'חוזה שכירות | מה חייב להיות, סעיפים מסוכנים | Jus-Tice', seo_description: 'חוזה שכירות: 8 סעיפים חובה, 6 סעיפים מסוכנים. פיקדון מעל 3 חודשים — חריג. בדיקה 500-2,000 ₪. מדריך 2025.', pillar_keyword: 'חוזה שכירות', secondary_keywords: 'חוזה שכירות מגורים,חוזה שכירות דירה,בדיקת חוזה שכירות' }
  ));

  // 3. DIVORCE FINANCIAL DISCLOSURE
  results.push(await upsert('divorce-financial-disclosure', 'גילוי נכסים בגירושין | חובה, הסתרה ועונשים | Jus-Tice',
    `<!-- wp:paragraph --><p>בהליך גירושין, כל אחד מהצדדים חייב לגלות את מלוא רכושו — חשבונות בנק, נדל"ן, קרנות פנסיה, עסקים, השקעות. הסתרת נכסים בגירושין היא עבירה חמורה שיכולה לגרום לפסיקה חריגה נגד המסתיר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>נכסים שחייבים לגלות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>חשבונות בנק בישראל ובחו"ל</li>
<li>נדל"ן (בבעלות מלאה, חלקית, בנאמנות)</li>
<li>קרנות פנסיה, ביטוח מנהלים, קופות גמל</li>
<li>מניות, קרנות השקעה, ניירות ערך</li>
<li>עסקים ושותפויות (גם חלקיות)</li>
<li>זכויות עתידיות (תביעות תלויות, ירושה צפויה)</li>
<li>הלוואות שנתת (כנכס)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כיצד מגלים הסתרת נכסים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שיטת חשיפה</th><th>מי מבצע</th><th>עלות</th></tr></thead><tbody>
<tr><td>בקשה לגילוי מסמכים (Discovery)</td><td>עורך דין + בית משפט</td><td>חלק מהייצוג</td></tr>
<tr><td>חקירת רואה חשבון פורנזי</td><td>מומחה פרטי</td><td>10,000-40,000 ₪</td></tr>
<tr><td>פניה לרשות המיסים / מאגרי נתונים</td><td>עו"ד עם הרשאה</td><td>כחלק מהייצוג</td></tr>
<tr><td>חקירה פרטית</td><td>חוקר פרטי</td><td>3,000-15,000 ₪</td></tr>
<tr><td>עיון ברשמי החברות, טאבו</td><td>ניתן בעצמך</td><td>עד 200 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה ניתן לעשות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הגש בקשה לגילוי מסמכים לבית המשפט</li>
<li>בקש עיקול זמני על נכסים ידועים</li>
<li>הגש תצהיר שקרי — זו עבירת שקר בשבועה (עד שנת מאסר)</li>
<li>בית המשפט יכול לפסוק חלוקה לא שוויונית כעונש על הסתרה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה קורה אם מגלים הסתרת נכסים לאחר הגירושין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ניתן לפתוח הליך מחדש בתוך 5 שנים מגילוי הנכס המוסתר. בית המשפט יכול לחייב את המסתיר במחצית הנכס + הוצאות משפט + פיצוי נוסף.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/divorce-women-rights-israel/">זכויות האישה בגירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גילוי נכסים בגירושין | חובה, הסתרה ועונשים | Jus-Tice', seo_description: 'גילוי נכסים בגירושין: 7 קטגוריות נכסים לגלות. חשיפת הסתרה: רו"ח פורנזי 10K-40K, חוקר פרטי 3K-15K. עונש: חלוקה לא שוויונית. מדריך 2025.', pillar_keyword: 'גילוי נכסים גירושין', secondary_keywords: 'הסתרת נכסים גירושין,גילוי מסמכים גירושין' }
  ));

  // 4. WILL DISPUTE GROUNDS
  results.push(await upsert('will-dispute-grounds', 'התנגדות לצוואה | עילות, הליך וסיכויי הצלחה | Jus-Tice',
    `<!-- wp:paragraph --><p>התנגדות לצוואה היא בקשה לבית המשפט לבטל צוואה שכבר הוגשה לביצוע. כ-1,500 התנגדויות לצוואה מוגשות בישראל בשנה. רוב ההתנגדויות נגמרות בפשרה — אבל יש מקרים שמגיעים לפסיקה מלאה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עילות להתנגדות לצוואה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עילה</th><th>הגדרה</th><th>עוצמת הראיה הנדרשת</th></tr></thead><tbody>
<tr><td>חוסר כשרות</td><td>המנוח לא הבין את תוכן הצוואה בעת עריכתה</td><td>גבוהה — חוות דעת רפואית</td></tr>
<tr><td>השפעה בלתי הוגנת</td><td>לחץ, אילוץ, ניצול תלות</td><td>גבוהה — עדים, נסיבות</td></tr>
<tr><td>פגם צורני</td><td>צוואה שאינה עומדת בדרישות החוק (עדים, כתב ידיים)</td><td>בינונית — בדיקת הצוואה עצמה</td></tr>
<tr><td>הטעיה / מרמה</td><td>המנוח הוטעה לגבי עובדות מהותיות</td><td>גבוהה מאוד</td></tr>
<tr><td>זיוף</td><td>הצוואה לא נכתבה על ידי המנוח</td><td>גבוהה — מומחה כתב יד</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הליך ההתנגדות</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגש "התנגדות לבקשה לצו קיום צוואה" לרשם הירושות</li>
<li>רשם הירושות מעביר לבית המשפט לענייני משפחה</li>
<li>שימוע — שני הצדדים מציגים ראיות</li>
<li>בית המשפט מחליט: לאשר, לבטל, או לתקן את הצוואה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש להגיש התנגדות לצוואה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>14 יום מקבלת ההודעה על הגשת בקשת הצו — אם הודעה נשלחה. ללא הודעה — עד שהצו ניתן. אחרי מתן הצו: ניתן לבקש ביטולו תוך 3 חודשים (ב"ית חוק).</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה עולה הליך התנגדות לצוואה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ייצוג: 15,000-80,000 ₪ תלוי בגודל העיזבון ומורכבות. חוות דעת מומחה כתב יד: 5,000-15,000 ₪. רפואית: 5,000-20,000 ₪. בדרך כלל — כדאי רק אם ערך העיזבון משמעותי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/inheritance-lawyer/">מדריך ירושה</a> | <a href="/will-and-testament/">צוואה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'התנגדות לצוואה | עילות, הליך וסיכויים | Jus-Tice', seo_description: '1,500 התנגדויות לצוואה בשנה. 5 עילות: כשרות, השפעה, פגם, מרמה, זיוף. עלות: 15K-80K ₪. מדריך 2025.', pillar_keyword: 'התנגדות לצוואה', secondary_keywords: 'עילות התנגדות לצוואה,ביטול צוואה,השפעה בלתי הוגנת צוואה' }
  ));

  // 5. NON-COMPETE CLAUSE
  results.push(await upsert('non-compete-clause-israel', 'סעיף אי-תחרות בחוזה עבודה | תוקף ומה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>סעיפי אי-תחרות (non-compete) בחוזי עבודה נפוצים מאוד בישראל — אך לא כולם תקפים. בית הדין לעבודה מגביל בצורה משמעותית את תוקף סעיפים אלה. הבנת מה תקף ומה לא — קריטית לפני שעוזבים מעסיק.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי סעיף אי-תחרות תקף?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תנאי</th><th>מה נדרש</th></tr></thead><tbody>
<tr><td>אינטרס לגיטימי</td><td>סוד מסחרי, לקוחות ייחודיים, ידע ייחודי</td></tr>
<tr><td>היקף מוגבל</td><td>לא לכל תחום עבודה — לתחום ספציפי</td></tr>
<tr><td>זמן מוגבל</td><td>בדרך כלל 6-24 חודשים — לא לנצח</td></tr>
<tr><td>פיצוי</td><td>בית הדין מצפה לפיצוי תמורת ההגבלה</td></tr>
<tr><td>אזור גיאוגרפי</td><td>ארצי — נדיר לאכוף; אזורי — יותר סביר</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה קורה אם מפרים סעיף אי-תחרות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>המעסיק הקודם יכול לתבוע פיצויים (שמוגדרים לרוב בסעיף)</li>
<li>מעסיק חדש עלול להיות נתבע גם הוא</li>
<li>בית הדין יבחן: האם הסעיף תקף? האם ההפרה גרמה נזק?</li>
<li>לרוב, בית הדין לא מוציא צו מניעה אלא פוסק פיצויים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם חייבים לחתום על סעיף אי-תחרות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. אפשר לנהל משא ומתן, לצמצם, או לסרב. עם זאת, מעסיק רשאי לבחור לא לגייס מי שמסרב. המציאות: אפשר לנסות להפחית את תקופת האי-תחרות או להגביל את תחומה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם פיטורים פוטרים מסעיף אי-תחרות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לרוב כן — בית הדין לעבודה נוטה שלא לאכוף סעיף אי-תחרות נגד עובד שפוטר (ולא התפטר). ההיגיון: המעסיק לא יכול לפטר ואז לחסום גם את פרנסתו.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סעיף אי-תחרות | תוקף, הפרה ומה מותר | Jus-Tice', seo_description: 'סעיף אי-תחרות: 5 תנאים לתוקף. פיטורים פוטרים לרוב מהסעיף. בית הדין: פיצויים לא צו מניעה. מדריך 2025.', pillar_keyword: 'סעיף אי תחרות', secondary_keywords: 'non compete ישראל,הסכם אי תחרות,הגבלת עיסוק' }
  ));

  console.log('\n=== BATCH 13 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
