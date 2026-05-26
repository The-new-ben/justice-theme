/**
 * Batch 12 — Immigration, landlord rights, real estate Jerusalem,
 * insurance disputes, bank seizure, guardianship, criminal Beer Sheva
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

  // 1. IMMIGRATION LAWYER (NEW HIGH-VOLUME PILLAR)
  results.push(await upsert('immigration-lawyer-israel', 'עורך דין הגירה בישראל | ויזה, אזרחות, עלייה | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין הגירה מסייע לעולים חדשים, לתושבים זמניים, לבעלי ויזות ולזרים שרוצים להסדיר את מעמדם בישראל. כ-30,000 עולים חדשים מגיעים לישראל מדי שנה. הסדרת מעמד חוקי בישראל יכולה להיות מורכבת — עורך דין מנוסה מקצר את התהליך.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי שירותי הגירה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מה כולל</th><th>אוכלוסיה</th></tr></thead><tbody>
<tr><td>עלייה לישראל (חוק השבות)</td><td>הכנת מסמכים, ייצוג מול סוכנות יהודית</td><td>יהודים ובני משפחה</td></tr>
<tr><td>השגת מעמד קבע</td><td>בקשות ל-א1, ב2, תושב קבע</td><td>זרים עם קשר לישראל</td></tr>
<tr><td>ויזות עבודה</td><td>ויזת ב1/2, מעסיקים, TRV</td><td>עובדים זרים</td></tr>
<tr><td>נישואים לאזרח ישראלי</td><td>בניית תיק גילום הזוגיות</td><td>בני זוג זרים</td></tr>
<tr><td>הסדרת מעמד עובד זר</td><td>חקלאות, בניה, סיעוד</td><td>עובדים זרים</td></tr>
<tr><td>ערר על דחיית ויזה/מעמד</td><td>ייצוג בבית הדין לעררים</td><td>כל מי שנדחה</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מסלולי מעמד בישראל</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>חוק השבות:</strong> יהודים, ילדי יהודים, נכדי יהודים, בני זוגם — זכאים לעלות ולקבל אזרחות</li>
<li><strong>נישואים לאזרח ישראלי:</strong> תהליך הדרגתי — ב2 → א5 → קבע → אזרחות (5-7 שנים)</li>
<li><strong>מאהבת הומניטרית:</strong> ישהות ממושכת + ילד ישראלי → בקשה לשיקול דעת</li>
<li><strong>מקלט / הגנה:</strong> פליטים ומבקשי מקלט — דרך רשות האוכלוסין + UNHCR</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>כמה עולה עורך דין הגירה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>עלות ממוצעת</th></tr></thead><tbody>
<tr><td>ייצוג בקשת עלייה</td><td>5,000 - 15,000 ₪</td></tr>
<tr><td>תיק מעמד נישואים מלא</td><td>15,000 - 40,000 ₪</td></tr>
<tr><td>ערר על דחייה</td><td>8,000 - 30,000 ₪</td></tr>
<tr><td>ייעוץ ראשוני</td><td>500 - 1,500 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה הגדרת "יהודי" לצורך חוק השבות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>ילוד לאם יהודייה, או מי שהתגייר גיור מוכר. בנוסף, ילדים ונכדים של יהודי (גם אם הם עצמם לא יהודים) וכן בני זוגם — כולם זכאים לעלות לפי חוק השבות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח להשיג מעמד קבע בדרך נישואים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תהליך מדורג: שנה ראשונה — ב2 (ויזת ביקור מוארך). שנתיים-שלוש — א5 (תושב ארעי). אחרי 5 שנות נישואים פעילים — בקשת מעמד קבע. אחרי 3 שנות קבע — אזרחות. סה"כ: 7-10 שנים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>← <a href="/">חזרה לעמוד הבית Jus-Tice</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין הגירה בישראל | ויזה, אזרחות, עלייה | Jus-Tice', seo_description: '30,000 עולים בשנה. חוק השבות, מעמד נישואים, ויזת עבודה. עלות: 5K-40K ₪. 7 סוגי שירות. מדריך הגירה 2025.', pillar_keyword: 'עורך דין הגירה', secondary_keywords: 'עורך דין הגירה ישראל,מעמד ישיבה,חוק השבות עלייה' }
  ));

  // 2. LANDLORD RIGHTS
  results.push(await upsert('landlord-rights-israel', 'זכויות משכיר בישראל | מה מותר, פינוי ושמירת זכויות | Jus-Tice',
    `<!-- wp:paragraph --><p>משכירי דירות בישראל זכאים לזכויות משמעותיות — אך גם חייבים לנהוג כחוק. הסכסוכים השכיחים הם: שוכר שלא משלם, שוכר שגרם נזקים, ושוכר שמסרב לפנות. הבנת המסגרת החוקית מסייעת להימנע מטעויות יקרות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות מרכזיות של המשכיר</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>לקבל שכר דירה במועד שנקבע בחוזה</li>
<li>לדרוש שמירה על הדירה ואי-גרימת נזקים</li>
<li>לדרוש שהשוכר לא יעביר לצד שלישי ללא אישור</li>
<li>לבדוק את הדירה בהתראה מוקדמת סבירה</li>
<li>לממש בטוחות (פיקדון, ערבות) בגין נזקים / חוב</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה אסור למשכיר?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>פעולה</th><th>האם מותר?</th><th>השלכות</th></tr></thead><tbody>
<tr><td>ניתוק חשמל/מים</td><td>אסור</td><td>תביעה, פיצויים</td></tr>
<tr><td>החלפת מנעול ללא צו</td><td>אסור</td><td>עבירה פלילית</td></tr>
<tr><td>כניסה ללא הסכמה</td><td>אסור</td><td>פגיעה בפרטיות</td></tr>
<tr><td>זריקת חפצים של שוכר</td><td>אסור</td><td>נזיקין</td></tr>
<tr><td>פינוי ללא צו בית משפט</td><td>אסור</td><td>עבירה פלילית</td></tr>
<tr><td>הפחדה / איומים</td><td>אסור</td><td>עבירה פלילית</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הליך פינוי שוכר — שלבים</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>שלח לשוכר מכתב התראה רשמי (עדיפות בדואר רשום)</li>
<li>אם אינו עוזב: הגש תביעת פינוי לבית משפט השלום</li>
<li>קבל צו פינוי (בדרך כלל תוך 2-4 חודשים)</li>
<li>שלח מוציא לפועל לביצוע פינוי בפועל</li>
<li>תבע חוב שכ"ד + נזקים כתביעה נפרדת</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח לפנות שוכר שלא משלם?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>הגשת תביעה + קבלת צו פינוי: 2-6 חודשים. ביצוע הפינוי על ידי מוציא לפועל: 1-4 שבועות נוספים. סה"כ: 3-8 חודשים בממוצע.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לנכות נזקים מהפיקדון?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם הנזק הוכח וחורג מ"בלאי סביר". המשכיר חייב להחזיר את יתרת הפיקדון תוך 60 יום מסיום השכירות. ניכוי ללא הצדקה חושף את המשכיר לתביעה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/tenant-rights-israel/">זכויות דייר</a> | <a href="/real-estate-lawyer-guide/">מדריך מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות משכיר בישראל | פינוי, נזקים, מה מותר | Jus-Tice', seo_description: 'זכויות משכיר: 5 זכויות מרכזיות, 6 פעולות אסורות. הליך פינוי 3-8 חודשים, 5 שלבים. ניכוי פיקדון. מדריך 2025.', pillar_keyword: 'זכויות משכיר', secondary_keywords: 'פינוי שוכר,זכויות בעל דירה,שכירות נזקים' }
  ));

  // 3. INSURANCE DISPUTE
  results.push(await upsert('insurance-claim-dispute', 'תביעת ביטוח שנדחתה | זכויות וכיצד מערערים | Jus-Tice',
    `<!-- wp:paragraph --><p>חברת הביטוח דחתה תביעה? יש לכם את הזכות לערער — ולרוב כדאי. כ-40,000 פניות מוגשות לממונה על שוק ההון, ביטוח וחסכון (ביטוח) מדי שנה. רבות מסתיימות בטובת המבוטח. מדריך זה מסביר את הזכויות ומה עושים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עילות נפוצות לדחיית תביעת ביטוח (וכיצד מתמודדים)</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>טענת חברת ביטוח</th><th>תגובה מומלצת</th><th>הצלחה בערר</th></tr></thead><tbody>
<tr><td>"מחלה קודמת שלא נמסרה"</td><td>בדוק מה בדיוק לא נמסר ומה הקשר הסיבתי</td><td>50-60%</td></tr>
<tr><td>"האירוע לא כוסה בפוליסה"</td><td>קרא את הפוליסה בדיוק; פרשנות לקוי תפסיד</td><td>40-50%</td></tr>
<tr><td>"הכחשת נכות / מוגבלות"</td><td>הזמן חוות דעת רפואית עצמאית</td><td>60-70%</td></tr>
<tr><td>"הונאת ביטוח"</td><td>עורך דין מיד — הטענה חמורה</td><td>30-40%</td></tr>
<tr><td>"פג תוקף הפוליסה"</td><td>בדוק תשלומים, התראות, ביטול כדין</td><td>60%+</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הליך ערר על החלטת ביטוח</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>בקש מחברת הביטוח נימוק מפורט בכתב לדחייה</li>
<li>שלח מכתב ערר (פורמלי) תוך 30 יום</li>
<li>אם נדחה — פנה לממונה על הביטוח (חינם): gov.il/he/departments/legalInfo/insurance</li>
<li>בנוסף: פנה לבוררות לפי הפוליסה (אם יש סעיף)</li>
<li>אם לא הוסדר — הגש תביעה לבית משפט</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם דרוש עורך דין לתביעת ביטוח?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לתביעות קטנות (עד 33,200 ₪): ניתן ב"תביעות קטנות". לסכומים גבוהים, ביטוח חיים, אובדן כושר עבודה — עורך דין ביטוח מוסיף ערך משמעותי. רבים עובדים לפי הצלחה.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש לבחברה לבטח להגיב לתביעה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לפי חוק חוזה הביטוח, חברת הביטוח חייבת להחליט תוך 30 יום מקבלת כל המסמכים. דחיית תשלום ללא נימוק — ניתן לתבוע עם ריבית פיגורים גבוהה.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/consumer-rights-israel/">זכויות צרכן</a> | <a href="/personal-injury-israel/">נזקי גוף</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תביעת ביטוח שנדחתה | זכויות, ערר, כיצד מתמודדים | Jus-Tice', seo_description: '40,000 פניות לממונה ביטוח בשנה. 5 עילות נפוצות לדחייה + הצלחה בערר. 5-שלב הליך. 30 יום לחברה להחליט. מדריך 2025.', pillar_keyword: 'תביעת ביטוח', secondary_keywords: 'דחיית תביעת ביטוח,ערר ביטוח,עורך דין ביטוח' }
  ));

  // 4. CRIMINAL LAWYER BEER SHEVA
  results.push(await upsert('criminal-lawyer-beer-sheva', 'עורך דין פלילי באר שבע | מחירים ובתי משפט | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בבאר שבע מייצג בבית המשפט המחוזי דרום ובבית משפט השלום באר שבע. הנגב מאופיין בעבירות ייחודיות: זיוף מסמכים, חניות בנגב, ועבירות קרקע.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>כמה עולה עורך דין פלילי בבאר שבע?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>באר שבע</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>עבירת תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים</td><td>6,000-35,000 ₪</td><td>10,000-50,000 ₪</td></tr>
<tr><td>קרקע / זיוף</td><td>10,000-60,000 ₪</td><td>15,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a> | <a href="/lawyers-beer-sheva/">עורכי דין באר שבע</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי באר שבע | מחירים, ייצוג 2025 | Jus-Tice', seo_description: 'עורך דין פלילי באר שבע: תעבורה 1K-5K, אלימות 5K-20K, סמים 6K-35K. 30-50% פחות מתל אביב. מדריך 2025.', pillar_keyword: 'עורך דין פלילי באר שבע' }
  ));

  // 5. GUARDIANSHIP
  results.push(await upsert('guardianship-israel', 'אפוטרופסות בישראל | מינוי, תהליך ומה כולל | Jus-Tice',
    `<!-- wp:paragraph --><p>אפוטרופסות היא מינוי שיפוטי המאפשר לאדם לפעול בשם אחר שאינו מסוגל לדאוג לענייניו. כ-8,000 בקשות לאפוטרופסות מוגשות בשנה. לפני הגשת בקשה — יש לבדוק אם ייפוי כוח מתמשך לא יכול לעשות את העבודה פחות מורכב.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי אפוטרופסות</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>על מה?</th><th>מי ממנה</th></tr></thead><tbody>
<tr><td>לאדם (גוף)</td><td>בריאות, מגורים, החלטות אישיות</td><td>בית משפט לענייני משפחה</td></tr>
<tr><td>לרכוש</td><td>ניהול נכסים, חשבון בנק</td><td>בית משפט לענייני משפחה</td></tr>
<tr><td>כללי</td><td>גוף + רכוש יחד</td><td>בית משפט</td></tr>
<tr><td>לקטין</td><td>ילד ללא הורים כשירים</td><td>בית משפט לענייני משפחה</td></tr>
<tr><td>לתאגיד</td><td>ניהול עסק / עזבון</td><td>בית משפט מחוזי</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הליך מינוי אפוטרופוס</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגש בקשה לבית משפט לענייני משפחה עם תצהיר ומסמכים רפואיים</li>
<li>בית המשפט ממנה עובד סוציאלי לבדיקת הצורך</li>
<li>שימוע — שני הצדדים (כולל "הנדון" אם ניתן)</li>
<li>בית המשפט ממנה אפוטרופוס ומגדיר תחומי אחריות</li>
<li>אפוטרופוס מדווח לאפוטרופוס הכללי מדי שנה</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מי יכול להיות אפוטרופוס?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>קרוב משפחה, עורך דין, רואה חשבון, גוף ציבורי (כמו מנהל) — לפי שיקול בית המשפט. עדיפות לקרוב משפחה, אלא אם יש ניגוד עניינים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם אפוטרופסות = ייפוי כוח מתמשך?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא. ייפוי כוח מתמשך עדיף — נעשה כשאדם עדיין כשיר, מהיר וזול יותר. אפוטרופסות מוטלת לאחר שאדם כבר איבד כשרות. תכנן מראש!</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/power-of-attorney-guide/">ייפוי כוח מתמשך</a> | <a href="/family-law/">דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אפוטרופסות בישראל | מינוי, הליך ומה כולל | Jus-Tice', seo_description: 'אפוטרופסות: 8,000 בקשות בשנה. 5 סוגים. 5-שלב הליך. עדיפות לייפוי כוח מתמשך. כמה עולה. מדריך 2025.', pillar_keyword: 'אפוטרופסות', secondary_keywords: 'מינוי אפוטרופוס,אפוטרופסות לרכוש,אפוטרופוס לקטין' }
  ));

  console.log('\n=== BATCH 12 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
