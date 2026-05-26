/**
 * Batch 30 — Kfar Saba (3), immigration asylum, domestic violence guide
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

  // 1. RE KFAR SABA
  results.push(await upsert('real-estate-lawyer-kfar-saba', 'עורך דין מקרקעין כפר סבא | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בכפר סבא מטפל בשוק הצפוני של גוש דן — עיר משפחתית עם בניה חדשה, תמ"א 38, ופרויקטי פינוי-בינוי נרחבים. כפר סבא מחירי נדל"ן בינוניים-גבוהים, קרובה לרעננה ורמת השרון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בכפר סבא</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>כפר סבא</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>7,000-16,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>פינוי-בינוי</td><td>2,000-7,000 ₪/דייר</td><td>2,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין כפר סבא | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין כפר סבא: רכישה 7K-16K ₪. תמ"א 38, פינוי-בינוי, עיר משפחתית. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין כפר סבא' }
  ));

  // 2. FAMILY KFAR SABA
  results.push(await upsert('family-law-kfar-saba', 'עורך דין משפחה כפר סבא | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בכפר סבא מייצג בבית המשפט לענייני משפחה. כפר סבא — עיר פרברית עם אוכלוסייה משפחתית מהמעמד הבינוני-גבוה — מאופיינת בגירושין עם נכסים ומשמורת על ילדים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בכפר סבא</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>כפר סבא</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,000-13,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-50,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה כפר סבא | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה כפר סבא: גירושין 5K-50K ₪. מעמד בינוני-גבוה, נכסים. בית משפט משפחה. מדריך 2025.', pillar_keyword: 'עורך דין משפחה כפר סבא' }
  ));

  // 3. CRIMINAL KFAR SABA
  results.push(await upsert('criminal-lawyer-kfar-saba', 'עורך דין פלילי כפר סבא | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי בכפר סבא מייצג בבית משפט השלום. כפר סבא — עיר שקטה ביחסה — נפגשת עם תיקי תעבורה, אלימות מסוג משפחה, ועבירות קלות-בינוניות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי בכפר סבא</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>כפר סבא</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,200-5,500 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>5,000-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי כפר סבא | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי כפר סבא: תעבורה 1.2K-5.5K, אלימות 5K-20K ₪. שקט, אבל יש. מדריך 2025.', pillar_keyword: 'עורך דין פלילי כפר סבא' }
  ));

  // 4. ASYLUM ISRAEL (sensitive but high-demand)
  results.push(await upsert('immigration-asylum-israel', 'מקלט מדיני בישראל | הליך, זכויות, סיכויים | Jus-Tice',
    `<!-- wp:paragraph --><p>ישראל מכירה במקלט מדיני לפי אמנת הפליטים של האו"ם (1951). כ-25,000-35,000 מבקשי מקלט פעילים בישראל, ברובם מאריתריאה ומסודן. שיעור ההכרה ישראלי הוא בין הנמוכים בעולם — פחות מ-1%. אבל יש אלטרנטיבות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>שלבי הגשת בקשת מקלט</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>הגשת בקשה ל-UNHCR או למשרד הפנים</li>
<li>ראיון בסיסי לאיסוף מידע</li>
<li>ראיון עומק (לאחר חודשים-שנים)</li>
<li>החלטה: הכרה, דחייה, או מעמד הגנה קבוצתית</li>
<li>ערעור על דחייה (בתוך 30 ימים)</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>חלופות כאשר בקשת מקלט נדחית</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>הגנה זמנית:</strong> מניעת גירוש ללא הכרה מלאה</li>
<li><strong>ויזה הומניטארית:</strong> לבני משפחה חולים</li>
<li><strong>מעמד מוסדר:</strong> ריצוי חוב בעבודה בלתי-סדירה → מסלול הסדרה</li>
</ul><!-- /wp:list -->

<!-- wp:paragraph --><p><a href="/immigration-lawyer-israel/">מדריך עורך דין הגירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מקלט מדיני בישראל | הליך, זכויות, סיכויים | Jus-Tice', seo_description: '25K-35K מבקשי מקלט. שיעור הכרה: פחות מ-1%. 5 שלבי הגשה. הגנה זמנית כחלופה. מדריך 2025.', pillar_keyword: 'מקלט מדיני ישראל', secondary_keywords: 'מבקש מקלט ישראל,פליט ישראל,אמנת פליטים' }
  ));

  // 5. DOMESTIC VIOLENCE LEGAL GUIDE
  results.push(await upsert('domestic-violence-legal-guide', 'אלימות במשפחה | עזרה משפטית, צו הגנה, מה עושים | Jus-Tice',
    `<!-- wp:paragraph --><p>אלימות במשפחה היא תופעה רחבה — כ-200,000 נשים ו-60,000 גברים בישראל חווים אלימות של בן/בת זוג בחייהם. המשפט הישראלי מציע כלי הגנה מהירים ויעילים. אנחנו מדריכים — לא מגדירים אשמה. אם את/ה בסכנה — התקשר/י 100 (משטרה) או 1201 (עזרת נשים).</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>הגנה משפטית מיידית</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>כלי</th><th>מה עושה</th><th>זמן לקבל</th></tr></thead><tbody>
<tr><td>צו הרחקה</td><td>מונע גישה לדירה/לך</td><td>שעות (דחוף)</td></tr>
<tr><td>צו הגנה</td><td>הגנה רחבה יותר</td><td>ימים</td></tr>
<tr><td>פינוי מן הדירה</td><td>המקנה ממקן</td><td>שעות-ימים</td></tr>
<tr><td>מעצר תוקף</td><td>שוטרים עוצרים</td><td>מיידי (עם תלונה)</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה הצעדים הראשונים?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>1) בסכנה מיידית — 100. 2) צא/צאי עם הילדים. 3) פנה לקו סיוע 1201 (נשים) / 1202 (גברים). 4) תעד אלימות (צילום, WhatsApp). 5) פנה לבית משפט לבקש צו הגנה דחוף. 6) פנה לעורך דין.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם אלימות פסיכולוגית נחשבת?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — חוק למניעת אלימות במשפחה כולל גם אלימות פסיכולוגית, כלכלית, ורגשית. צו הגנה ניתן גם על כלכלית (שלילת כסף, שליטה) ורגשית (השפלה, בידוד).</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/restraining-order-israel/">צו הגנה בישראל</a> | <a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'אלימות במשפחה | עזרה משפטית, צו הגנה, מה עושים | Jus-Tice', seo_description: '200K נשים, 60K גברים = אלימות מזוגית. 4 כלי הגנה: צו הרחקה (שעות), מעצר (מיידי). 6 צעדים ראשונים. 1201/1202.', pillar_keyword: 'אלימות במשפחה', secondary_keywords: 'אלימות משפחתית ישראל,צו הגנה אלימות,עזרה אלימות במשפחה' }
  ));

  console.log('\n=== BATCH 30 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
