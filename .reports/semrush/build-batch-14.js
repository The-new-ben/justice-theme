/**
 * Batch 14 — Military will, arbitration guide, pension rights, age discrimination,
 * landlord eviction process, real estate city pages
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

  // 1. MILITARY WILL (unique Israeli content — soldiers can make verbal/brief wills)
  results.push(await upsert('military-will-israel', 'צוואת חייל בישראל | דרישות, תוקף ומה ייחודי | Jus-Tice',
    `<!-- wp:paragraph --><p>צוואת חייל היא אחת הצוואות הייחודיות ביותר בחוק הישראלי — חייל בשירות פעיל יכול לצוות בעל-פה, ללא עדים, ולעיתים אף ללא כתב. חוק הירושה, תשכ"ה-1965 מאפשר זאת. זוהי חריגה ייחודית מהחוק הרגיל לצוואות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מה מיוחד בצוואת חייל?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>צוואת חייל</th><th>צוואה רגילה</th></tr></thead><tbody>
<tr><td>כתב</td><td>לא חייב — ניתן בעל-פה</td><td>חובה (חוץ מצוואה בפני עדים)</td></tr>
<tr><td>עדים</td><td>לא חייב</td><td>שני עדים (בסוגים מסוימים)</td></tr>
<tr><td>נוטריון</td><td>לא נדרש</td><td>לא נדרש (אך מחזק)</td></tr>
<tr><td>מי זכאי</td><td>חייל בשירות פעיל (כולל מילואים)</td><td>כל אדם בגיר</td></tr>
<tr><td>תוקף</td><td>שנה מסיום השירות</td><td>עד ביטול/שינוי</td></tr>
<tr><td>נסיבות</td><td>גם בפעולות לחימה, אשפוז</td><td>כל עת</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>כיצד עושים צוואת חייל?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>בכתב:</strong> מסמך כתוב, חתום, עם תאריך — מומלץ (אך אינו חובה)</li>
<li><strong>בעל-פה:</strong> בפני שני עדים — מספיק לחייל בשירות פעיל</li>
<li><strong>קצין ממונה:</strong> ניתן לאשר לפני קצין — מחזק את התוקף</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה קורה לצוואת חייל אחרי שסיים שירות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>צוואת חייל תקפה שנה מסיום השירות הפעיל. אחרי שנה — בטלה. כדי להמשיך צריך לעשות צוואה רגילה. לכן — מומלץ לאחר שחרור מסדיר צוואה רגילה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם שוטר / מאבטח זכאים לצוואת חייל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי הפסיקה — לא בהכרח. חוק הירושה מתייחס ל"חייל" בהגדרה ספציפית. שוטרים בפעולה מבצעית — יש שיקול דעת שיפוטי. מומלץ לא לסמוך עליו ולעשות צוואה רגילה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/will-and-testament/">צוואה רגילה</a> | <a href="/inheritance-lawyer/">מדריך ירושה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'צוואת חייל בישראל | דרישות, תוקף ומה ייחודי | Jus-Tice', seo_description: 'צוואת חייל: ניתן בעל-פה, ללא עדים, ללא כתב. חוק הירושה 1965. תקפה שנה מסיום שירות. מדריך 2025.', pillar_keyword: 'צוואת חייל', secondary_keywords: 'צוואה חייל ישראל,צוואה בעל פה חייל' }
  ));

  // 2. ARBITRATION VS COURT
  results.push(await upsert('arbitration-vs-court', 'בוררות לעומת בית משפט | יתרונות, חסרונות ומתי לבחור | Jus-Tice',
    `<!-- wp:paragraph --><p>בוררות היא חלופה לבית המשפט — הצדדים מסכימים שצד שלישי ("בורר") יכריע בסכסוכם. בישראל, כ-20,000 הליכי בוררות מתנהלים מדי שנה — חלקם מוגדרים בחוזה, חלקם מוסכמים בזמן הסכסוך. מדריך זה מסביר מתי בוררות עדיפה ומתי לא.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>השוואה: בוררות לעומת בית משפט</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>קריטריון</th><th>בוררות</th><th>בית משפט</th></tr></thead><tbody>
<tr><td>עלות ממוצעת</td><td>30,000 - 200,000 ₪</td><td>15,000 - 150,000 ₪</td></tr>
<tr><td>זמן</td><td>3-12 חודשים</td><td>1-5 שנים</td></tr>
<tr><td>פרטיות</td><td>פרטי — ללא פרסום</td><td>ציבורי — פסיקה גלויה</td></tr>
<tr><td>ערעור</td><td>מוגבל מאוד</td><td>מלא — עד בית המשפט העליון</td></tr>
<tr><td>גמישות פרוצדורלית</td><td>גבוהה — הצדדים קובעים</td><td>נמוכה — כללי בית המשפט</td></tr>
<tr><td>מומחיות הבורר</td><td>ניתן לבחור מומחה בתחום</td><td>שופט כללי (לרוב)</td></tr>
<tr><td>ביצוע פסק</td><td>כמו פסק דין — לאחר אישור</td><td>ישיר</td></tr>
<tr><td>חסם כניסה</td><td>שני הצדדים חייבים להסכים</td><td>חד-צדדי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מתי בוררות עדיפה?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>סכסוכים עסקיים מורכבים שדורשים מומחיות טכנית</li>
<li>סכסוכים בינלאומיים — פסק בוררות מוכר בינלאומית (אמנת ניו יורק)</li>
<li>כשפרטיות קריטית (מידע מסחרי, סכסוך בין שותפים)</li>
<li>כשמהירות חשובה יותר מאפשרות ערעור</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לבטל פסק בוררות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — בנסיבות מצומצמות בלבד: הבורר פעל בניגוד לדין, חרג מסמכותו, לא שמע את הצדדים, פסק נגד תקנת הציבור. לא ניתן לערער על תוכן הפסיקה גופה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם סעיף בוררות בחוזה מחייב?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — סעיף בוררות שנכלל בחוזה מחייב בדרך כלל, ובית המשפט ידחה תביעה שהוגשה בניגוד לסעיף בוררות. אולם, יש חריגים לזכויות שלא ניתן לוותר עליהן (כמו זכויות עובד).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/small-claims-court-israel/">בית משפט לתביעות קטנות</a> | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'בוררות לעומת בית משפט | יתרונות, חסרונות ומתי לבחור | Jus-Tice', seo_description: 'בוררות: 20,000 הליכים בשנה. מהירה (3-12 חודשים) אך פחות ניתנת לערעור. השוואה מלאה לבית משפט. מדריך 2025.', pillar_keyword: 'בוררות', secondary_keywords: 'בוררות לעומת בית משפט,הליך בוררות ישראל,פסק בוררות' }
  ));

  // 3. PENSION RIGHTS ISRAEL
  results.push(await upsert('pension-rights-israel', 'זכויות פנסיה בישראל | סוגים, חישוב, מה מגיע | Jus-Tice',
    `<!-- wp:paragraph --><p>פנסיה חובה בישראל קיימת מאז 2008 — כל עובד שכיר שמרוויח מעל שכר מינימום זכאי להפרשות פנסיה. עם זאת, פנסיה בפועל מורכבת: סוגים שונים, זכויות ייחודיות, פגמים נפוצים של מעסיקים. מדריך זה מסביר את העיקרים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מגמת הפנסיה: שיעורי הפרשה 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>עובד</th><th>מעסיק</th><th>סה"כ</th></tr></thead><tbody>
<tr><td>פנסיה / חיסכון</td><td>6%</td><td>6.5%</td><td>12.5%</td></tr>
<tr><td>פיצויי פיטורים (רכיב)</td><td>0%</td><td>6%</td><td>6%</td></tr>
<tr><td>נכות מקצועית</td><td>0%</td><td>2.5%</td><td>2.5%</td></tr>
<tr><td>סה"כ</td><td>6%</td><td>15%</td><td>21%</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>סוגי קרנות פנסיה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>קרן פנסיה מקיפה:</strong> מכסה פנסיה + נכות + שאירים — הנפוצה ביותר</li>
<li><strong>ביטוח מנהלים:</strong> פוליסת ביטוח — מחזיר פחות, עלות גבוהה יותר</li>
<li><strong>קופת גמל:</strong> חיסכון בלבד — ללא ביטוח נכות/שאירים</li>
<li><strong>קרן פנסיה ותיקה (מוגבלת):</strong> לעובדים שהצטרפו לפני 1995</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה קורה לפנסיה אם מפטרים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הכסף שלכם — גם כשמפטרים. ניתן להשאיר בקרן, להעביר לקרן אחרת, או למשוך (עם קנס מס). פיצויי פיטורים: אם מעסיק השלים לסעיף 14 — הפיצויים כבר בקרן. אם לא — המעסיק חייב פיצויים נפרדים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם המעסיק לא העביר הפרשות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פנה לביטוח הלאומי, להגשת תלונה, ולבית הדין לעבודה. המעסיק חייב להעביר הפרשות. אי-העברה היא עבירה פלילית. ניתן לתבוע את הפרש + ריבית + עוגמת נפש.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a> | <a href="/divorce-pension-split/">פנסיה בגירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות פנסיה בישראל | סוגים, הפרשות, מה מגיע | Jus-Tice', seo_description: 'פנסיה חובה מ-2008. הפרשות: עובד 6%, מעסיק 15%. 4 סוגי קרנות. מה אם מפטרים? אי-העברה = עבירה פלילית. מדריך 2025.', pillar_keyword: 'זכויות פנסיה', secondary_keywords: 'פנסיה חובה ישראל,קרן פנסיה,הפרשות פנסיה' }
  ));

  // 4. AGE DISCRIMINATION AT WORK
  results.push(await upsert('age-discrimination-work', 'אפליית גיל בעבודה | 45+, פיצויים וזכויות | Jus-Tice',
    `<!-- wp:paragraph --><p>אפליית גיל בעבודה היא מהעבירות הנפוצות ביותר בשוק העבודה הישראלי — אך גם מהקשות ביותר להוכיח. חוק שוויון הזדמנויות בעבודה אוסר על אפליה מגיל 45 ואילך. כ-500 תביעות אפליית גיל מוגשות לבית הדין לעבודה בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>אפליית גיל — מה אסור?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>דחיית מועמד בגין גיל בגיוס (שאלת גיל בראיון — אסורה)</li>
<li>פיטורים בגין גיל ("כדי לצעיר את הצוות")</li>
<li>אי-קידום מגיל</li>
<li>שכר נמוך לעובד ותיק שאין לו הסבר לגיטימי</li>
<li>הרעת תנאים (הורדת שכר, שינוי תפקיד) המקושרת לגיל</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כיצד מוכיחים אפליית גיל?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>ראיה</th><th>דוגמה</th><th>עוצמה</th></tr></thead><tbody>
<tr><td>הצהרה ישירה</td><td>"אנחנו מחפשים צעירים"</td><td>גבוהה מאוד</td></tr>
<tr><td>דפוס הגיוס</td><td>כל המגוייסים מתחת ל-35</td><td>גבוהה</td></tr>
<tr><td>פיטורי עובדים מבוגרים בצוות</td><td>3 מ-5 מפוטרים מעל 50</td><td>בינונית</td></tr>
<tr><td>פער שכר בין צעיר לזקן באותו תפקיד</td><td>ללא הסבר</td><td>בינונית</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מגיל כמה מוגנים מאפליית גיל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>מגיל 45 ואילך לפי חוק שוויון הזדמנויות. גם עובדים צעירים יותר יכולים להיות מוגנים אם האפליה מקושרת לגיל (למשל, מישהו בן 38 שפוטר כי הוא "מבוגר" לפרויקט).</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה פיצויים ניתן לקבל?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פיצוי ללא הוכחת נזק: עד 120,000 ₪ (חוק). עם הוכחת נזק (הפסד שכר, עוגמת נפש): בלא הגבלה. בפסיקה: 50,000-300,000 ₪ במקרים חמורים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/discrimination-at-work/">אפליה בעבודה</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפליית גיל בעבודה | 45+, פיצויים עד 120K ₪ | Jus-Tice', seo_description: 'אפליית גיל: 500 תביעות בשנה. הגנה מגיל 45. פיצוי ללא נזק 120,000 ₪. ראיות: הצהרה, דפוס גיוס. מדריך 2025.', pillar_keyword: 'אפליית גיל בעבודה', secondary_keywords: 'אפליה גיל עבודה ישראל,פיטורים בגלל גיל,45 שנה עבודה' }
  ));

  // 5. REAL ESTATE LAWYER TEL AVIV
  results.push(await upsert('real-estate-lawyer-tel-aviv', 'עורך דין מקרקעין תל אביב | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בתל אביב מייצג ברכישת דירות, מכירות, עסקאות יוקרה ועוד. תל אביב, עם אחת ממחירי הנדל"ן הגבוהים בעולם (ממוצע 3.5 מיליון ₪ לדירה), הופכת את ייצוג מקצועי לחיוני במיוחד.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין מקרקעין בתל אביב?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>תל אביב</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>רכישת דירה (0.5% ממחיר)</td><td>17,500 ₪ (דירה 3.5M)</td><td>12,500 ₪ (דירה 2.5M)</td></tr>
<tr><td>מכירת דירה</td><td>0.3-0.5% ממחיר</td><td>0.3-0.5%</td></tr>
<tr><td>בדיקת חוזה בלבד</td><td>2,000-5,000 ₪</td><td>1,500-4,000 ₪</td></tr>
<tr><td>ייפוי כוח + ביצוע עסקה</td><td>10,000-25,000 ₪</td><td>7,000-20,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p>בתל אביב, שוק הנדל"ן פרה-מיום ושמגרשי ת"א חוות תנודות מחיר חדות — ייצוג מקצועי חוסך טעויות שעלולות לעלות פי כמה מהאגרה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a> | <a href="/lawyers-tel-aviv/">עורכי דין תל אביב</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין תל אביב | מחירים ושירותים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין תל אביב: 0.5% ממחיר הדירה (3.5M = 17,500 ₪). שוק יוקרה. שירותים ומחירים 2025.', pillar_keyword: 'עורך דין מקרקעין תל אביב' }
  ));

  console.log('\n=== BATCH 14 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
