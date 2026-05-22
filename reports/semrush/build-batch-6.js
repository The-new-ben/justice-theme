/**
 * Batch 6 — City×Practice + High-traffic cross-pillar pages
 * power-of-attorney, tenant rights, traffic points, pregnancy rights,
 * medical malpractice haifa/jerusalem, family law haifa/jerusalem
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

  // 1. POWER OF ATTORNEY (ייפוי כוח מתמשך) — cross-pillar, very high traffic
  results.push(await upsert('power-of-attorney-guide', 'ייפוי כוח מתמשך | מה זה, מתי נדרש ואיך עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>ייפוי כוח מתמשך הוא מסמך משפטי שבו אדם (המייפה) ממנה אחר (מיופה הכוח) לפעול בשמו גם כאשר הוא כבר אינו מסוגל לעשות זאת — בשל דמנציה, שבץ, תאונה קשה, או ירידה קוגניטיבית. חוק ייפוי הכוח המתמשך נכנס לתוקף בישראל ב-2017 וחולל מהפכה בתחום.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>ייפוי כוח מתמשך לעומת אפוטרופסות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>ייפוי כוח מתמשך</th><th>אפוטרופסות</th></tr></thead><tbody>
<tr><td>מי בוחר</td><td>האדם עצמו — כשמסוגל</td><td>בית המשפט — לאחר אובדן כשרות</td></tr>
<tr><td>עלות</td><td>1,500-4,000 ₪ (עו"ד + נוטריון)</td><td>15,000-50,000 ₪ (הליך משפטי)</td></tr>
<tr><td>זמן</td><td>מספר שעות</td><td>6-18 חודשים</td></tr>
<tr><td>שליטה</td><td>מלאה — המייפה קובע הכל</td><td>מוגבלת — בית המשפט מחליט</td></tr>
<tr><td>גמישות</td><td>ניתן להתאים אישית</td><td>נוקשה יחסית</td></tr>
<tr><td>אפשרות לביטול</td><td>כן — כל עוד כשיר</td><td>קשה — דורש הליך</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה ניתן לכלול בייפוי כוח מתמשך?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>רכוש:</strong> ניהול חשבונות, מכירת נכסים, תשלום חובות</li>
<li><strong>גוף:</strong> החלטות רפואיות, טיפולים, ניתוחים</li>
<li><strong>רווחה אישית:</strong> מגורים, חינוך, פנאי</li>
<li><strong>הנחיות מקדימות:</strong> מה לעשות בנסיבות ספציפיות</li>
<li><strong>הגדרת גבולות:</strong> מה מיופה הכוח אינו רשאי לעשות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה ייפוי כוח מתמשך?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עלות</th></tr></thead><tbody>
<tr><td>עורך דין לניסוח ייפוי הכוח</td><td>1,000 - 3,000 ₪</td></tr>
<tr><td>אימות נוטריוני</td><td>300 - 800 ₪</td></tr>
<tr><td>הפקדה באפוטרופוס הכללי</td><td>65 ₪ (אגרה)</td></tr>
<tr><td>סה"כ ממוצע</td><td>1,500 - 4,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מי יכול לעשות ייפוי כוח מתמשך?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כל אדם בגיר (מעל 18) שמסוגל להבין את המשמעות — כלומר, שיש לו כשרות משפטית. לא ניתן לעשות ייפוי כוח מתמשך לאחר שאדם כבר איבד את כשירותו — אז יש לפנות לאפוטרופסות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מי יכול להיות מיופה כוח?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כל אדם מבוגר שהמייפה סומך עליו — בן/בת זוג, ילד, אח, חבר קרוב. לא יכולים: מטפלים בשכר, גורמים מוסדיים שמטפלים בך. ניתן למנות מספר מיופי כוח עם תחומי אחריות שונים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה ההבדל בין ייפוי כוח רגיל לייפוי כוח מתמשך?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ייפוי כוח רגיל בטל ברגע שהמייפה מאבד כשרות. ייפוי כוח מתמשך ממשיך לפעול גם אז — זו המהות של "מתמשך". לכן, הוא הכלי המשפטי הנכון לתכנון עתידי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/inheritance-lawyer/">מדריך ירושה</a> | <a href="/will-and-testament/">צוואה</a> | <a href="/family-law/">דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ייפוי כוח מתמשך | מה זה, כמה עולה, מתי נדרש | Jus-Tice', seo_description: 'ייפוי כוח מתמשך: 1,500-4,000 ₪ לעומת אפוטרופסות 15K-50K. מה כולל, מי יכול. חוק 2017. מדריך מלא 2025.', pillar_keyword: 'ייפוי כוח מתמשך', secondary_keywords: 'ייפוי כוח,אפוטרופסות,כשרות משפטית' }
  ));

  // 2. TENANT RIGHTS (זכויות דייר)
  results.push(await upsert('tenant-rights-israel', 'זכויות דייר בישראל | שכירות, פינוי ומה מותר למשכיר | Jus-Tice',
    `<!-- wp:paragraph --><p>שוק השכירות בישראל מכיל כ-1.3 מיליון משקי בית שגרים בשכירות — כ-30% מכלל הדיור. חוק השכירות והשאילה, תשל"א-1971, מגן על שוכרים — אבל רק מי שמכיר את זכויותיו יכול לממש אותן.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות שוכר בסיסיות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>דירה ראויה למגורים:</strong> המשכיר חייב לתקן תקלות מהותיות (חשמל, אינסטלציה, חלונות)</li>
<li><strong>פרטיות:</strong> המשכיר אינו רשאי לבוא ללא התראה מוקדמת סבירה</li>
<li><strong>הסכם כתוב:</strong> כל שכירות מעל שנה חייבת להיות בכתב</li>
<li><strong>פיקדון:</strong> מוגבל ל-3 חודשי שכירות; המשכיר חייב להחזירו תוך 60 יום מפינוי</li>
<li><strong>הודעת פינוי:</strong> המשכיר חייב ליתן הודעה מוקדמת (לפי הסכם, בדרך כלל 2-3 חודשים)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה אסור למשכיר לעשות?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>פעולה</th><th>מותר?</th><th>סעד</th></tr></thead><tbody>
<tr><td>ניתוק חשמל/מים להכריח פינוי</td><td>אסור לחלוטין</td><td>תביעה, פיצויים</td></tr>
<tr><td>החלפת מנעול ללא צו</td><td>אסור</td><td>פינוי פולש — דרך בית משפט</td></tr>
<tr><td>כניסה ללא הודעה</td><td>אסור</td><td>פגיעה בפרטיות</td></tr>
<tr><td>הטרדה/איומים</td><td>אסור</td><td>עבירה פלילית</td></tr>
<tr><td>העלאת שכר חד-צדדית</td><td>אסור תוך תקופת השכירות</td><td>הסכם מחייב</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>פינוי שוכר — מה התהליך החוקי?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>משכיר שרוצה לפנות שוכר חייב לפנות לבית משפט ולקבל "צו פינוי". אין מנגנון של "פינוי עצמי". תהליך: הגשת תביעה → שימוע → צו → ביצוע על ידי מוציא לפועל. פינוי ללא צו הוא עבירה פלילית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים כשהמשכיר לא מחזיר פיקדון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנה בכתב תחילה. אם לא הוחזר תוך 60 יום מפינוי ללא עילה, הגש תביעה בבית משפט לתביעות קטנות (עד 33,200 ₪). ניתן לתבוע גם פיצויי עוגמת נפש.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם שוכר יכול לסרב לפנות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>עד לצו בית משפט — כן, חוקית. לאחר צו פינוי שניתן ולא ערערו עליו — אסור. שוכר שאינו פונה לאחר צו בית משפט עלול לגרום להוצאות גבוהות נגדו ולפגיעה בדירוג האשראי.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/buying-apartment/">רכישת דירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות דייר בישראל | שכירות, פיקדון, פינוי | Jus-Tice', seo_description: '1.3 מיליון שוכרים בישראל. מה אסור למשכיר, פינוי חוקי, החזרת פיקדון. חוק השכירות 1971. מדריך זכויות 2025.', pillar_keyword: 'זכויות דייר', secondary_keywords: 'שוכר זכויות,פיקדון שכירות,פינוי שוכר' }
  ));

  // 3. TRAFFIC OFFENSE / POINTS
  results.push(await upsert('traffic-offense-points', 'נקודות רישיון ועבירות תעבורה | כמה נקודות, מה השלכות | Jus-Tice',
    `<!-- wp:paragraph --><p>מערכת נקודות הרישיון בישראל מיועדת להרתיע מעבירות תעבורה. נהג שצבר 36 נקודות מאבד את הרישיון. כ-300,000 כתבי אישום בתעבורה מוגשים בשנה. הבנת המערכת עוזרת להחליט אם כדאי להתגונן.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מערכת הנקודות — מדרג עיקרי 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>נקודות</th><th>קנס מינימום</th></tr></thead><tbody>
<tr><td>נהיגה בשכרות</td><td>10</td><td>2,000 ₪ + שלילה</td></tr>
<tr><td>חציית אדום</td><td>5</td><td>500 ₪</td></tr>
<tr><td>עבור מהירות מעל 30 קמ"ש</td><td>10</td><td>1,500 ₪</td></tr>
<tr><td>עבור מהירות 20-30 קמ"ש</td><td>4</td><td>1,000 ₪</td></tr>
<tr><td>שימוש בטלפון בנהיגה</td><td>4</td><td>500 ₪</td></tr>
<tr><td>אי-חגירת חגורה</td><td>4</td><td>250 ₪</td></tr>
<tr><td>עקיפה אסורה</td><td>6</td><td>1,000 ₪</td></tr>
<tr><td>נסיעה ברמזור צהוב</td><td>4</td><td>250 ₪</td></tr>
<tr><td>חניה בנגישות</td><td>4</td><td>1,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד פוגות נקודות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>נקודות פוגות תוך <strong>2 שנים</strong> מיום ביצוע העבירה (לא מיום הקנס)</li>
<li>נהג שלא צבר נקודות חדשות ב-2 שנים — כל הנקודות נמחקות</li>
<li>קורס בטיחות בדרכים: מוריד 6 נקודות (פעם בשנה)</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מתי שווה להיעזר בעורך דין לתעבורה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>כן:</strong> אם הצבירה מסכנת שלילת רישיון, עבירות חמורות (שכרות, תאונה עם נפגעים), עבירות שבהן ישנה אפשרות לתשלום נמוך יותר</li>
<li><strong>לא בהכרח:</strong> עבירה בודדת, קנס קטן, ללא נקודות מסכנות</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לעקור נקודות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא לבטל, אבל קורס בטיחות בדרכים (עד 6 נקודות לשנה) מוריד. ניתן גם להגיש השגה על כתב האישום אם יש עילה משפטית.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם קנסות על חניה נכנסים לנקודות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. קנסות חניה (על פי פקחי עירייה) אינם כתבי אישום ואינם מצטרפים לנקודות. רק כתבי אישום שהוגשו על ידי שוטרים מוסיפים נקודות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/criminal-lawyer-cost/">עלות עורך דין פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נקודות רישיון ועבירות תעבורה | מדרג 2025 | Jus-Tice', seo_description: 'מערכת נקודות רישיון: חציית אדום 5 נקודות, שכרות 10, מהירות 4-10. כמה נקודות עד שלילה, איך פוגות. מדריך 2025.', pillar_keyword: 'נקודות רישיון', secondary_keywords: 'עבירות תעבורה ישראל,שלילת רישיון נקודות,קנסות תעבורה' }
  ));

  // 4. PREGNANCY EMPLOYMENT RIGHTS
  results.push(await upsert('employment-rights-pregnancy', 'זכויות עובדת בהריון | חוק, פיטורים ושמירת היריון | Jus-Tice',
    `<!-- wp:paragraph --><p>הריון בעבודה מוגן בחוק בישראל באחד הצורות הרחבות ביותר בעולם. עובדת בהריון לא ניתן לפטר ללא אישור שר העבודה, אסור להחמיר תנאיה, ויש לה זכויות ספציפיות לשמירת היריון, חופשת לידה ותקופת חזרה. כ-20,000 תלונות בשנה מוגשות על פגיעה בזכויות הריון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות עיקריות בהריון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>זכות</th><th>פרטים</th><th>מקור חוקי</th></tr></thead><tbody>
<tr><td>פיטורים בהריון אסורים</td><td>ללא אישור שר — אסור בתוך ההריון ו-60 יום לאחר חזרה מחופשה</td><td>חוק עבודת נשים</td></tr>
<tr><td>שמירת הריון</td><td>רופא מאשר — נעדרת ומקבלת 100% שכר מביטוח לאומי</td><td>חוק דמי מחלה + בל</td></tr>
<tr><td>חופשת לידה</td><td>26 שבועות (ניתן לפצל עם בן הזוג)</td><td>חוק עבודת נשים</td></tr>
<tr><td>דמי לידה</td><td>מהביטוח הלאומי — 100% שכר עד תקרה</td><td>חוק הביטוח הלאומי</td></tr>
<tr><td>שעת הנקה</td><td>שעה ביום, 4 חודשים לאחר לידה</td><td>חוק עבודת נשים</td></tr>
<tr><td>פינוי לבדיקות</td><td>זכאית לפינוי לביקורי רופא ללא ניכוי שעות</td><td>חוק עבודת נשים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה עושים כשפיטרו בהריון?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>תעד הכל בכתב (הודעת הפיטורים, שיחות)</li>
<li>פנה לעורך דין דיני עבודה מיד</li>
<li>הגש תלונה לממונה על חוק עבודת נשים (משרד העבודה)</li>
<li>הגש תביעה לבית הדין לעבודה (ניתן בעצמך)</li>
<li>הפיצויים: שכר 150 יום + פיצוי נוסף עד 200,000 ₪ בגין אפליה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם מותר להוריד שכר בהריון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. הרעת תנאי עבודה (כולל הורדת שכר, שינוי תפקיד לרעה, צמצום שעות) ללא הסכמת העובדת ובגלל ההריון — אסורה כפיטורים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה ה"שמירת הריון" בדיוק?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>רופא הנשים/גינקולוג כותב "אישור שמירת הריון" אם הוא מעריך שעבודתה מסכנת את ההריון. העובדת נעדרת מהעבודה ומקבלת דמי שמירת הריון מהביטוח הלאומי (100% שכר) — לא מהמעסיק.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/wrongful-dismissal-guide/">פיטורים שלא כדין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות עובדת בהריון | פיטורים, שמירת היריון, חופשת לידה | Jus-Tice', seo_description: 'זכויות הריון: 26 שבועות חופשת לידה, פיטורים אסורים, שמירת הריון 100% שכר. 20,000 תלונות בשנה. מדריך 2025.', pillar_keyword: 'זכויות עובדת בהריון', secondary_keywords: 'פיטורים בהריון,חופשת לידה,שמירת הריון' }
  ));

  // 5. FAMILY LAW HAIFA (city×practice)
  results.push(await upsert('family-law-haifa', 'עורך דין משפחה חיפה | גירושין, מזונות, משמורת | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בחיפה מטפל בכל ענייני הגירושין, המשמורת, המזונות וחלוקת הרכוש בבית המשפט לענייני משפחה חיפה (פל-ים 1). מחירי ייצוג בחיפה נמוכים ב-20-30% ממחירי תל אביב, עם איכות דומה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין משפחה בחיפה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>חיפה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,000 - 15,000 ₪</td><td>8,000 - 20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>15,000 - 70,000 ₪</td><td>25,000 - 100,000 ₪</td></tr>
<tr><td>ייצוג בדיון מזונות</td><td>3,000 - 12,000 ₪</td><td>5,000 - 20,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>0 - 400 ₪</td><td>0 - 600 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בית המשפט לענייני משפחה חיפה</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>כתובת: פל-ים 1, חיפה. הגשת תביעות: ניתן פיזית או דרך פורטל הרשות השופטת (courts.gov.il). בית הדין הרבני חיפה: גיסין 7 — לגט ועניינים דתיים. מרחק בין בתי הדין: כ-10 דקות הליכה.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/lawyers-haifa/">עורכי דין חיפה</a> | <a href="/divorce-agreement/">הסכם גירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה חיפה | גירושין, מזונות, מחירים 2025 | Jus-Tice', seo_description: 'עורך דין משפחה חיפה: גירושין 5K-70K ₪ (20-30% פחות מתל אביב). בית משפט לענייני משפחה פל-ים 1. מדריך 2025.', pillar_keyword: 'עורך דין משפחה חיפה' }
  ));

  // 6. CRIMINAL LAWYER JERUSALEM
  results.push(await upsert('criminal-lawyer-jerusalem', 'עורך דין פלילי ירושלים | ייצוג, מחירים ובתי משפט | Jus-Tice',
    `<!-- wp:paragraph --><p>ירושלים מאופיינת בהרכב אוכלוסייה מגוון ייחודי, ובמצבים משפטיים-פליליים שאין להם אח ורע: התנגשויות בהפגנות, עבירות בהר הבית, סכסוכי קרקעות בין קהילות, ועבירות הקשורות למנגנוני שלטון. עורך דין פלילי מנוסה בירושלים מכיר גם את הדין הישראלי וגם את הדין הבינלאומי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בירושלים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג תיק</th><th>ירושלים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>עבירת תעבורה</td><td>1,500 - 7,000 ₪</td><td>2,000 - 8,000 ₪</td></tr>
<tr><td>אלימות</td><td>7,000 - 25,000 ₪</td><td>8,000 - 30,000 ₪</td></tr>
<tr><td>עבירות ביטחוניות / מנהל</td><td>15,000 - 100,000 ₪</td><td>15,000 - 80,000 ₪</td></tr>
<tr><td>ייצוג בבג"ץ פלילי</td><td>20,000 - 150,000 ₪</td><td>—</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>בתי משפט פליליים בירושלים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בית המשפט המחוזי ירושלים:</strong> שלמה 1 — תיקי חומרה, ערעורים</li>
<li><strong>בית משפט השלום ירושלים:</strong> שלמה 1 — רוב התיקים</li>
<li><strong>בית המשפט העליון:</strong> קריית הממשלה — בג"ץ ועתירות חוקתיות</li>
<li><strong>בתי הדין הצבאיים:</strong> לנאשמים בגיל גיוס, תיקי גדה מערבית</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/lawyers-jerusalem/">עורכי דין ירושלים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי ירושלים | מחירים, בתי משפט, ייצוג | Jus-Tice', seo_description: 'עורך דין פלילי ירושלים: תעבורה 1.5K-7K, אלימות 7K-25K, ביטחוניות 15K-100K. בתי משפט, מה ייחודי בירושלים. 2025.', pillar_keyword: 'עורך דין פלילי ירושלים' }
  ));

  // 7. RESTRAINING ORDER
  results.push(await upsert('restraining-order-israel', 'צו הגנה בישראל | מה זה, מי מגיש ואיך | Jus-Tice',
    `<!-- wp:paragraph --><p>צו הגנה הוא צו שיפוטי המורה לאדם לא לפגוע, לאיים, להטריד, או להתקרב לנפגע/ת. בישראל, כ-16,000 צווי הגנה מוצאים מדי שנה. ניתן לקבל צו הגנה בהליך מזורז — תוך שעות — כשיש סכנה מיידית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי צווי הגנה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>מי מוציא</th><th>משך</th><th>תנאים</th></tr></thead><tbody>
<tr><td>צו הגנה (חוק למניעת אלימות)</td><td>בית משפט לענייני משפחה</td><td>עד 6 חודשים (ניתן להאריך)</td><td>בני משפחה / ידועים בציבור</td></tr>
<tr><td>צו הגנה (הטרדה מאיימת)</td><td>בית משפט שלום</td><td>עד 6 חודשים</td><td>כל אדם</td></tr>
<tr><td>צו ביניים (ארעי)</td><td>בית משפט — ללא נוכחות הנאשם</td><td>7-14 ימים עד דיון</td><td>סכנה מיידית</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד מגישים צו הגנה?</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>פנה למשטרה (תלונה רשמית)</li>
<li>פנה לבית המשפט לענייני משפחה / שלום עם תצהיר</li>
<li>בסכנה מיידית: בקש צו ביניים — ניתן ביום הגשה</li>
<li>דיון בנוכחות שני הצדדים בתוך 7-14 ימים</li>
<li>עורך דין מומלץ אבל לא חובה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם דרוש עורך דין לצו הגנה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא חובה. בית המשפט לענייני משפחה מטפל בתביעות עצמאיות. אולם, עורך דין מגדיל משמעותית את הסיכוי להגנה מקיפה ולמניעת טעויות פרוצדורליות שעלולות לפגוע בתיק.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה ההשלכות על מי שמפר צו הגנה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הפרת צו הגנה היא עבירה פלילית — עד 3 שנות מאסר. המשטרה חייבת לפעול מיד עם דיווח על הפרה. תעד הפרות (הודעות, צילומים, עדים) כדי להקל על ביצוע האכיפה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a> | <a href="/get-refusal-divorce/">סרבנות גט</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'צו הגנה בישראל | מה זה, כיצד מגישים, סוגים | Jus-Tice', seo_description: '16,000 צווי הגנה בשנה. סוגים: משפחה, הטרדה מאיימת, ביניים. כיצד מגישים, כמה זמן לוקח. הפרה = 3 שנות מאסר. 2025.', pillar_keyword: 'צו הגנה', secondary_keywords: 'צו הגנה ישראל,הטרדה מאיימת,אלימות במשפחה' }
  ));

  console.log('\n=== BATCH 6 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
