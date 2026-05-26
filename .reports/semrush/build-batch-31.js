/**
 * Batch 31 — Sexual offense defense, RE Petah Tikva, divorce steps guide,
 * business visa, and legal costs FAQ
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

  // 1. SEXUAL OFFENSE DEFENSE (HIGH STAKES CRIMINAL)
  results.push(await upsert('sexual-offense-defense', 'הגנה בעבירת מין | זכויות נאשם, אסטרטגיה, תהליך | Jus-Tice',
    `<!-- wp:paragraph --><p>עבירת מין היא אחת האשמות החמורות ביותר — גם הרשעה אחת גוררת השלכות לכל החיים: רישום בפנקס עבריינים מינויים, מגורים ותעסוקה מוגבלים. לכן — הגנה מקצועית ומיידית היא חיונית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי עבירות מין בישראל</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>ענישה מקסימלית</th></tr></thead><tbody>
<tr><td>אינוס</td><td>16 שנות מאסר</td></tr>
<tr><td>מעשה סדום</td><td>16 שנות מאסר</td></tr>
<tr><td>מגע מיני ללא הסכמה</td><td>3-4 שנות מאסר</td></tr>
<tr><td>הטרדה מינית</td><td>2 שנות מאסר</td></tr>
<tr><td>עבירות מין בקטין</td><td>עד 20 שנה</td></tr>
<tr><td>תיעוד ללא הסכמה (revenge porn)</td><td>5 שנות מאסר</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>זכויות נאשם</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>זכות שתיקה — כל מה שתגיד ישמש נגדך</li>
<li>זכות לעורך דין לפני חקירה (גם בחינם)</li>
<li>זכות לעיין בכל חומרי החקירה</li>
<li>חזקת חפות</li>
<li>זכות לפגוש עורך דין לפני כל דיון</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים אם נחקרים בחשד לעבירת מין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) הפעל שתיקה מיידית. 2) בקש לדבר עם עורך דין לפני שאתה עונה על שאלות. 3) אל תסביר. 4) אל תשלח הודעות לאף אחד. 5) התקשר לעורך דין פלילי עם ניסיון בעבירות מין — מיד.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/police-investigation-rights/">זכויות בחקירה</a> | <a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'הגנה בעבירת מין | זכויות נאשם, תהליך, אסטרטגיה | Jus-Tice', seo_description: 'עבירת מין: אינוס 16 שנה, בקטין עד 20. 5 זכויות נאשם. 5 צעדים מיידיים בחקירה. רישום עולמי. מדריך 2025.', pillar_keyword: 'הגנה בעבירת מין', secondary_keywords: 'עבירת מין ישראל,נאשם עבירת מין,חקירה מין' }
  ));

  // 2. RE PETAH TIKVA
  results.push(await upsert('real-estate-lawyer-petah-tikva', 'עורך דין מקרקעין פתח תקווה | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בפתח תקווה מטפל בשוק הגדול של "אם המושבות" — עיר עם שוק נדל"ן פעיל, פינוי-בינוי נרחב, ותמ"א 38. פ"ת ידועה בהתחדשות עירונית נרחבת.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בפ"ת</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>פ"ת</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>7,000-17,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>תמ"א 38 / פינוי-בינוי</td><td>2,000-8,000 ₪/דייר</td><td>2,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין פתח תקווה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין פ"ת: רכישה 7K-17K ₪. אם המושבות, פינוי-בינוי, תמ"א 38. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין פתח תקווה' }
  ));

  // 3. DIVORCE PROCESS STEPS (comprehensive how-to)
  results.push(await upsert('divorce-process-steps', 'שלבי הגירושין בישראל | מדריך שלב אחרי שלב | Jus-Tice',
    `<!-- wp:paragraph --><p>גירושין בישראל — על פי הדין היהודי — הם תהליך בין-מוסדי שמחייב: בית דין רבני (לגט), בית משפט לענייני משפחה (לנכסים), ולפעמים שניהם. מדריך זה מסביר את כל השלבים — כולל כסף, זמן, ורגש.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>6 שלבי גירושין — מהאשמה לאחר</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שלב</th><th>מה</th><th>זמן</th><th>עלות</th></tr></thead><tbody>
<tr><td>1. החלטה וייעוץ</td><td>עורך דין + גישור</td><td>שבועות</td><td>2,000-5,000 ₪</td></tr>
<tr><td>2. הסכם גירושין</td><td>גישור/עו"ד, נכסים, ילדים</td><td>1-3 חודשים</td><td>8,000-25,000 ₪</td></tr>
<tr><td>3. אישור בימ"ש</td><td>הסכם מוגש, מאושר</td><td>1-3 חודשים</td><td>כלול</td></tr>
<tr><td>4. גט</td><td>בית דין רבני — גט פיטורין</td><td>חודש-חצי</td><td>1,000-3,000 ₪</td></tr>
<tr><td>5. ביצוע הסכם</td><td>חלוקת נכסים, מכירת דירה</td><td>3-12 חודשים</td><td>משתנה</td></tr>
<tr><td>6. תביעות נוספות</td><td>מזונות, משמורת (אם נדרש)</td><td>6-24 חודשים</td><td>12,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח תהליך גירושין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>מינימום 3-4 חודשים (גירושין מוסכם מהיר + גט). ממוצע: 8-18 חודשים. תיקים מורכבים: 3-5 שנים. ב-80% מהמקרים — הגירושין מסתיימים בהסכמה (לא בפסיקה שיפוטית).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/divorce-agreement/">הסכם גירושין</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'שלבי הגירושין בישראל | מדריך שלב אחרי שלב | Jus-Tice', seo_description: '6 שלבי גירושין: החלטה → הסכם → אישור → גט → ביצוע → תביעות. 3 חודשים-5 שנים. 80% בהסכמה. מדריך 2025.', pillar_keyword: 'שלבי גירושין', secondary_keywords: 'תהליך גירושין ישראל,כמה זמן גירושין,מדריך גירושין' }
  ));

  // 4. WHO PAYS LEGAL COSTS (FAQ cross-pillar)
  results.push(await upsert('legal-costs-who-pays', 'מי משלם הוצאות משפטיות | כללים, פסיקה, חריגים | Jus-Tice',
    `<!-- wp:paragraph --><p>בישראל — "מי שמפסיד משלם" הוא הכלל הבסיסי בהוצאות משפטיות. אבל יש כלל זה חריגים רבים, ופסיקת ההוצאות היא שיקול דעת שיפוטי. מדריך זה מסביר מי משלם, כמה, ומתי ניתן להכניסו בחשבון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כללים בסיסיים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מצב</th><th>מי משלם</th><th>כמה</th></tr></thead><tbody>
<tr><td>תובע מנצח</td><td>הנתבע</td><td>כפי שיפסוק ביהמ"ש</td></tr>
<tr><td>תובע מפסיד</td><td>התובע</td><td>הוצאות נתבע</td></tr>
<tr><td>דחיית תביעה על הסף</td><td>התובע</td><td>גבוה יותר</td></tr>
<tr><td>פשרה</td><td>לפי הסכם הפשרה</td><td>כמוסכם</td></tr>
<tr><td>תביעות קטנות</td><td>בדרך כלל ללא הוצאות</td><td>0-600 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה ביהמ"ש פוסק בהוצאות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי בסוג התיק וערכאה. תביעות קטנות: 300-1,500 ₪. בית שלום: 5,000-20,000 ₪. מחוזי: 10,000-80,000 ₪. עליון: 20,000-150,000 ₪. פסיקת הוצאות אינה מכסה בדרך כלל את עלות עורך הדין המלאה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתבוע שכר עורך דין?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בנזיקין: כן — עלות עורך דין סבירה היא חלק מהנזק. בחוזים: לפי הסכם. בתביעות קטנות: לא. בפלילי: לא ניתן לתבוע הגנה שיפויית (רק ביטוח).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/law-suit-cost-israel/">עלות תביעה אזרחית</a> | <a href="/consumer-rights-israel/">זכויות צרכן</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מי משלם הוצאות משפטיות | כללים, פסיקה, חריגים | Jus-Tice', seo_description: 'מי שמפסיד משלם — אבל יש חריגים. בית שלום: 5K-20K ₪. תביעות קטנות: ללא הוצאות. נזיקין: שכ"ט נתבע. מדריך 2025.', pillar_keyword: 'הוצאות משפטיות ישראל', secondary_keywords: 'מי משלם הוצאות משפט,פסיקת הוצאות,שכר טרחה ביהמ"ש' }
  ));

  // 5. BUSINESS VISA ISRAEL
  results.push(await upsert('business-visa-israel', 'ויזה עסקית לישראל | סוגים, עלות, הגשה | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מציעה מספר סוגי ויזות עסקיות לזרים. אזרחי ארה"ב, EU, ורוב המדינות המערביות אינם זקוקים לויזה לביקורי עסקים קצרים. אזרחי מדינות אחרות צריכים לבקש. הגבול בין "ביקור עסקי" ל"עבודה" — קריטי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי ויזות עסקיות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>ויזה</th><th>מתאים ל</th><th>תקף</th></tr></thead><tbody>
<tr><td>B/2 (תייר-עסקי)</td><td>ביקור עסקי קצר ללא עבודה</td><td>3 חודשים</td></tr>
<tr><td>A/2 (עבודה זמנית)</td><td>עובד זר שנשלח לישראל</td><td>1-2 שנה</td></tr>
<tr><td>B/1 (עסקים)</td><td>שהיית עסקים מעל 90 יום</td><td>1 שנה</td></tr>
<tr><td>ויזת חברות</td><td>חברה זרה עם נוכחות ישראלית</td><td>לפי הגדרה</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/immigration-lawyer-israel/">מדריך עורך דין הגירה</a> | <a href="/immigration-lawyer-cost/">עלות עורך דין הגירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'ויזה עסקית לישראל | סוגים, עלות, הגשה 2025 | Jus-Tice', seo_description: 'ויזה עסקית ישראל: B/2 תיירות-עסקי 3 חודשים, A/2 עבודה 1-2 שנה, B/1 שנה. גבול עבודה-ביקור. מדריך 2025.', pillar_keyword: 'ויזה עסקית ישראל', secondary_keywords: 'ויזת עסקים ישראל,B2 ישראל,אשרת עבודה זמנית' }
  ));

  console.log('\n=== BATCH 31 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
