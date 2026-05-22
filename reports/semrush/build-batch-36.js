/**
 * Batch 36 — Criminal/family Lod, tenant rights, work accident, construction permit violation
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

  // 1. CRIMINAL LAWYER LOD (mixed city, high crime)
  results.push(await upsert('criminal-lawyer-lod', 'עורך דין פלילי לוד | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בלוד מייצג בבית משפט השלום. לוד — עיר מעורבת יהודית-ערבית עם שיעורי פשיעה מהגבוהים בישראל — מאופיינת בתיקי אלימות, סמים, גניבת רכב, ועבירות חמורות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בלוד</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>לוד</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>סמים / נשק</td><td>8,000-35,000 ₪</td><td>10,000-50,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי לוד | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי לוד: אלימות 5K-22K, סמים 8K-35K ₪. עיר מעורבת, פשיעה גבוהה. מדריך 2025.', pillar_keyword: 'עורך דין פלילי לוד' }
  ));

  // 2. FAMILY LAW LOD
  results.push(await upsert('family-law-lod', 'עורך דין משפחה לוד | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בלוד מייצג בבית המשפט לענייני משפחה. לוד — עיר מעורבת עם אוכלוסייה מגוונת — מאופיינת בסכסוכי משמורת, מזונות, ואלימות במשפחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בלוד</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>לוד</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-10,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-40,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה לוד | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה לוד: גירושין 4K-40K ₪. עיר מעורבת, משמורת, מזונות. מדריך 2025.', pillar_keyword: 'עורך דין משפחה לוד' }
  ));

  // 3. TENANT RIGHTS ISRAEL (comprehensive guide)
  results.push(await upsert('tenant-rights-israel', 'זכויות שוכר בישראל | מדריך מקיף 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>שוכר דירה בישראל יש לו זכויות מוגנות בחוק — גם אם אינן כתובות בחוזה. חוק השכירות והשאילה (תשל"א-1971) ותיקוניו מגנים על שוכר גם מפני שינויים חד-צדדיים של בעל דירה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>זכויות בסיסיות של שוכר</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הדירה חייבת להיות ראויה למגורים (תקינות, ניקיון, ביטחון)</li>
<li>שכר דירה לא ניתן להעלות באמצע תקופת חוזה ללא הסכמה</li>
<li>זכות ל-30-60 ימי הודעה לפני סיום שכירות</li>
<li>פיקדון חייב להיות מוחזר תוך 60 ימים (בניכוי נזקים מוכחים)</li>
<li>בעל דירה לא רשאי לחסום חשמל/מים — עבירה פלילית</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם בעל הדירה יכול להיכנס בלי רשות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>לא — כניסה ללא הסכמה היא עוולה של "הסגת גבול". בעל דירה חייב לתאם ביקור מראש (בדרך כלל 24-48 שעות). ב-חירום (שריפה, שיטפון) — מותר.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/eviction-notice-israel/">הליך פינוי שוכר</a> | <a href="/tenant-eviction-defense/">הגנת שוכר מפני פינוי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'זכויות שוכר בישראל | מדריך מקיף 2025 | Jus-Tice', seo_description: '5 זכויות שוכר שבעל הדירה לא מספר לך. פיקדון: 60 יום. חסימת חשמל = עבירה. כניסה ללא רשות = עוולה. 2025.', pillar_keyword: 'זכויות שוכר', secondary_keywords: 'זכויות שוכר דירה ישראל,חוק שכירות,שוכר זכויות' }
  ));

  // 4. WORK ACCIDENT GUIDE (personal injury sub-category)
  results.push(await upsert('work-accident-guide', 'תאונת עבודה | מה עושים, פיצויים, ביטוח לאומי | Jus-Tice',
    `<!-- wp:paragraph --><p>תאונת עבודה בישראל מגדירה זכויות מול שני גופים: ביטוח לאומי (קצבאות ו-נכות) ו-מעסיק/צד ג' (תביעת נזיקין). הדגש: הגשת תביעת ל"ל תוך 1 שנה היא קריטית. כ-30,000-40,000 תאונות עבודה מדווחות בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי תאונת עבודה</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>דווח מיידית למעסיק (ביום האירוע)</li>
<li>פנה לרופא ותעד: "תאונת עבודה" במסמכים</li>
<li>הגש תביעת ל"ל (דמי פגיעה) תוך 12 חודשים</li>
<li>שמור כל קבלה על הוצאות</li>
<li>הגש תביעת נזיקין אם יש אחריות מעסיק/צד ג'</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>מה מגיע מביטוח לאומי</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>גמלה</th><th>כמות</th></tr></thead><tbody>
<tr><td>דמי פגיעה</td><td>75% שכר ל-91 ימים</td></tr>
<tr><td>נכות מעבודה</td><td>% נכות × שכר</td></tr>
<tr><td>שיקום</td><td>הכשרה מקצועית</td></tr>
<tr><td>גמלת תלויים</td><td>בפטירה</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/personal-injury-claim/">תביעת נזקי גוף</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'תאונת עבודה | מה עושים, פיצויים, ביטוח לאומי | Jus-Tice', seo_description: '30-40K תאונות עבודה/שנה. 5 שלבים מיידיים. דמי פגיעה: 75% ל-91 יום. תביעת ל"ל: תוך 12 חודשים. מדריך 2025.', pillar_keyword: 'תאונת עבודה', secondary_keywords: 'תאונת עבודה ישראל,ביטוח לאומי תאונה,דמי פגיעה' }
  ));

  // 5. CONSTRUCTION WITHOUT PERMIT
  results.push(await upsert('construction-permit-violation', 'בנייה ללא היתר | עונשים, הכשרה, הריסה | Jus-Tice',
    `<!-- wp:paragraph --><p>בנייה ללא היתר היא עבירה פלילית בישראל. כ-150,000 יחידות דיור בנויות ללא היתר כדין, ועוד אלפי בניות בלתי-חוקיות מתגלות בשנה. העונשים: קנסות, הריסה, ולעיתים מאסר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עונשים על בנייה ללא היתר</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>עבירה</th><th>עונש</th></tr></thead><tbody>
<tr><td>בנייה ללא היתר ראשונה</td><td>קנס 75,000-300,000 ₪</td></tr>
<tr><td>המשך בנייה לאחר צו הפסקה</td><td>עד 6 חודשי מאסר</td></tr>
<tr><td>אי-ציות לצו הריסה</td><td>עד שנת מאסר</td></tr>
<tr><td>קבלן שבנה ללא היתר</td><td>כפל קנסות</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>הכשרה בדיעבד — האם אפשרי?</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>בחלק מהמקרים — כן. הכשרה בדיעבד (רטרואקטיבית) אפשרית אם הבנייה עומדת בתנאי תוכנית הבנייה (תב"ע). התהליך: בקשת היתר + קנס + תשלום היטל השבחה. ייעוץ עם עורך דין ומהנדס נדרש.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'בנייה ללא היתר | עונשים, הכשרה, הריסה | Jus-Tice', seo_description: '150K יחידות ללא היתר. קנס 75K-300K ₪, מאסר עד שנה. הכשרה בדיעבד — אפשרית בתנאים. מדריך 2025.', pillar_keyword: 'בנייה ללא היתר', secondary_keywords: 'עבירת בנייה,הריסת בנייה ללא היתר,קנס בנייה' }
  ));

  console.log('\n=== BATCH 36 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
