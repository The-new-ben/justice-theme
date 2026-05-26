/**
 * Batch 24 — Corporate law (new pillar), contract law (new pillar),
 * family law Bnei Brak, slip-and-fall PI, criminal appeal process, labor Netanya check
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

  // 0. CHECK labor-law-netanya (skip if exists)
  const checkNetanya = await api('GET', '/wp-json/wp/v2/pages?slug=labor-law-netanya&status=any&per_page=1');
  if (!Array.isArray(checkNetanya.body) || checkNetanya.body.length === 0) {
    results.push(await upsert('labor-law-netanya', 'עורך דין עבודה נתניה | מחירים ושירותים 2025 | Jus-Tice',
      `<!-- wp:paragraph --><p>עורך דין עבודה בנתניה מייצג בבית הדין האזורי לעבודה תל אביב. נתניה — עיר חוף עם תעשיית תיירות ומלונאות — מאופיינת בסכסוכי עבודה הנוגעים לשירות, אירוח, ותעשייה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עלות עורך דין עבודה בנתניה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>נתניה</th><th>ממוצע ארצי</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>0-350 ₪</td><td>300-500 ₪</td></tr>
<tr><td>תביעת פיטורים</td><td>10,000-38,000 ₪</td><td>12,000-40,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
      { seo_title: 'עורך דין עבודה נתניה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין עבודה נתניה: פיטורים 10K-38K ₪. תיירות, מלונאות, שירות. בית דין לעבודה. מדריך 2025.', pillar_keyword: 'עורך דין עבודה נתניה' }
    ));
  } else {
    console.log('\n>>> labor-law-netanya already exists — skipping');
  }

  // 1. CORPORATE LAW ISRAEL (new pillar)
  results.push(await upsert('corporate-law-israel', 'דיני חברות בישראל | מדריך עורך דין חברות | Jus-Tice',
    `<!-- wp:paragraph --><p>דיני חברות בישראל מסדירים את ייסוד החברות, ניהולן, אחריות הדירקטורים, ומניות. חוק החברות, תשנ"ט-1999 הוא הבסיס המשפטי. ישראל רשמה כ-200,000 חברות פעילות — ולכולן יש צורך בסיוע משפטי בנקודות זמן שונות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שירותים שעורך דין חברות מספק</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>ייסוד חברה בע"מ (Incorporation)</li>
<li>תקנון חברה (Articles of Association)</li>
<li>הסכמי בעלי מניות (SHA)</li>
<li>חוזים מסחריים ועסקיים</li>
<li>העברת מניות, רכישת חברות (M&A)</li>
<li>מיזוגים ופיצולים</li>
<li><a href="/startup-lawyer-israel/">ייצוג סטארטאפ</a></li>
<li>הגנה בתביעות נגד חברה</li>
<li>ביזיון אמונה של בעלי מניות/דירקטורים</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה אחריות בעל מניות בחברה בע"מ?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בדרך כלל — מוגבלת לערך המניות שהשקיע. לא ניתן לתבוע בעל מניות ישירות בגין חובות החברה. אולם — "הרמת מסך" אפשרית כשיש הונאה, ניצול לרעה, או עירוב בין כספים.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מהי אחריות דירקטור?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>דירקטור חייב חובת נאמנות וזהירות לחברה. בניגוד לבעל מניות — עלול לחוב אישית בגין פעולות שנעשו בחוסר תום לב, ניגוד עניינים, או הפרת חוק.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/startup-lawyer-israel/">עורך דין סטארטאפ</a> | <a href="/trademark-registration-israel/">רישום סימן מסחרי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'דיני חברות בישראל | מדריך עורך דין חברות | Jus-Tice', seo_description: '200,000 חברות פעילות. עורך דין חברות: ייסוד, תקנון, SHA, M&A. אחריות דירקטור. הרמת מסך. מדריך 2025.', pillar_keyword: 'דיני חברות', secondary_keywords: 'עורך דין חברות ישראל,ייסוד חברה בע"מ,תקנון חברה' }
  ));

  // 2. CONTRACT LAW ISRAEL (new pillar)
  results.push(await upsert('contract-law-israel', 'דיני חוזים בישראל | מה תקף, ביטול, הפרה | Jus-Tice',
    `<!-- wp:paragraph --><p>חוק החוזים (חלק כללי), תשל"ג-1973 הוא בסיס דיני החוזים בישראל. חוזה — כל הסכם מחייב בין שני צדדים. אבל לא כל "חוזה" תקף. מדריך זה מסביר מה צריך להיות, מתי ניתן לבטל, ומה קורה בהפרה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תנאים לתוקף חוזה</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>גמירת דעת:</strong> שני הצדדים התכוונו להתקשר</li>
<li><strong>מסוימות:</strong> התנאים ברורים (מה, כמה, מתי)</li>
<li><strong>כשרות:</strong> שני הצדדים כשירים משפטית (לא קטינים, לא חסויים)</li>
<li><strong>חוקיות:</strong> לא נגד החוק/תקנת הציבור</li>
<li><strong>ללא פגם:</strong> לא טעות, הטעיה, כפייה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מתי ניתן לבטל חוזה?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עילת ביטול</th><th>דוגמה</th><th>אפקט</strong></tr></thead><tbody>
<tr><td>הטעיה</td><td>מוכר הסתיר פגם</td><td>ביטול + פיצויים</td></tr>
<tr><td>כפייה</td><td>חתמת תחת איום</td><td>ביטול + פיצויים</td></tr>
<tr><td>עושק</td><td>ניצול מצוקה — תנאים חריגים</td><td>ביטול/תיקון</td></tr>
<tr><td>טעות משותפת</td><td>שניכם טעיתם לגבי עובדה מהותית</td><td>ביטול</td></tr>
<tr><td>חוזה אחיד פוגעני</td><td>תנאי לא הוגן בחוזה הצרכן</td><td>ביטול הסעיף</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם חוזה בעל פה תקף?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — בדרך כלל. חוזה בעל פה מחייב כמו חוזה כתוב, אבל קשה יותר להוכיח. חריגים: עסקאות מקרקעין — חייבות בכתב לפי חוק; חוזים שחוק ספציפי דורש בכתב.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/employment-contract-guide/">חוזה עבודה</a> | <a href="/rental-agreement-guide/">חוזה שכירות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'דיני חוזים בישראל | מה תקף, ביטול, הפרה | Jus-Tice', seo_description: 'דיני חוזים: 5 תנאי תוקף. 5 עילות ביטול בטבלה. חוזה בעל פה — תקף! חריג: מקרקעין. מדריך 2025.', pillar_keyword: 'דיני חוזים', secondary_keywords: 'חוזה חוקי ישראל,ביטול חוזה,הפרת חוזה' }
  ));

  // 3. FAMILY LAW BNEI BRAK (haredi community special)
  results.push(await upsert('family-law-bnei-brak', 'עורך דין משפחה בני ברק | גירושין, מזונות, בית דין | Jus-Tice',
    `<!-- wp:paragraph --><p>בני ברק היא העיר החרדית הצפופה ביותר בישראל. עורך דין משפחה בבני ברק מכיר היטב את בתי הדין הרבניים ואת הדינמיקה של הקהילה החרדית — שלא ניתן לנתק מהיבטים דתיים-קהילתיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>ייחודיות של דיני משפחה בבני ברק</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>רוב הגירושין מתנהלים בבית הדין הרבני (לא אזרחי)</li>
<li>הקהילה מעדיפה לרוב פתרונות בתוך הקהילה (בד"ץ, דיין)</li>
<li>סכסוכי גט — ידועות בדיני ממגן (גט מאוחר)</li>
<li>מזונות ילדים — לפי ההלכה, עם פרשנות שיפוטית מגוונת</li>
<li>ייצוג אפקטיבי דורש הכרת הרב ושדרת הקהילה</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בבני ברק</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בני ברק</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-12,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-45,000 ₪</td><td>20,000-80,000 ₪</td></tr>
<tr><td>תיק גט מורכב</td><td>20,000-80,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה בני ברק | גירושין, מזונות, בית דין 2025 | Jus-Tice', seo_description: 'עורך דין משפחה בני ברק: קהילה חרדית, בתי דין רבניים. גירושין 4K-45K ₪. גט מורכב 20K-80K. מדריך 2025.', pillar_keyword: 'עורך דין משפחה בני ברק' }
  ));

  // 4. SLIP AND FALL PI
  results.push(await upsert('personal-injury-slip-fall', 'נפילה בשטח ציבורי | פיצויים, אחריות, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>נפילה בשטח ציבורי — על מדרכה שבורה, בסופרמרקט, בקניון, או בגינה ציבורית — יכולה להוביל לתביעת נזיקין. כ-5,000-8,000 תביעות נפילה בשטח ציבורי מוגשות בישראל בשנה. פיצויים: 15,000-800,000 ₪ בהתאם לחומרה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מי אחראי לנפילה בשטח ציבורי?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מיקום</th><th>אחראי</th></tr></thead><tbody>
<tr><td>מדרכה עירונית</td><td>עירייה / רשות מקומית</td></tr>
<tr><td>סופרמרקט / מרכול</td><td>בעל העסק</td></tr>
<tr><td>קניון</td><td>חברת הניהול</td></tr>
<tr><td>מגרש חניה</td><td>בעל/מפעיל</td></tr>
<tr><td>גינה ציבורית</td><td>עירייה</td></tr>
<tr><td>בניין מגורים</td><td>ועד הבית / חברת ניהול</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה עושים מיד אחרי נפילה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) צלם את המקום מיד (הסכנה, שלטים, תאורה). 2) דווח לבעל המקום/מנהל. 3) קבל טיפול רפואי. 4) שמור תלושי הוצאות. 5) אל תחתום על כלום. 6) פנה לעורך דין תאונות.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>מה גובה הפיצוי בנפילה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>פגיעה קלה: 15,000-50,000 ₪. שבר עם ניתוח: 50,000-300,000 ₪. פגיעה חמורה (כאב כרוני, נכות): 200,000-800,000 ₪. תלוי ב: חומרת הפגיעה, הכנסת הנפגע, גיל, ומידת האחריות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/personal-injury-israel/">נזקי גוף</a> | <a href="/personal-injury-car-accident/">תאונת דרכים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'נפילה בשטח ציבורי | פיצויים, אחריות, מה עושים | Jus-Tice', seo_description: '5,000-8,000 תביעות בשנה. פיצוי 15K-800K ₪. 6 מיקומים + אחראי. 6 צעדים מיידיים. מדריך 2025.', pillar_keyword: 'נפילה בשטח ציבורי', secondary_keywords: 'נפילה מדרכה פיצוי,תאונה בסופרמרקט,נפילה בקניון' }
  ));

  console.log('\n=== BATCH 24 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
