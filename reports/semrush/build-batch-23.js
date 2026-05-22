/**
 * Batch 23 — City pages (Ramat Gan, Ashdod), debt collection, immigration lawyer cost
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

  // 1. REAL ESTATE RAMAT GAN (near Diamond Exchange area)
  results.push(await upsert('real-estate-lawyer-ramat-gan', 'עורך דין מקרקעין רמת גן | מחירים, בורסת היהלומים ועוד | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין ברמת גן מטפל באחד השווקים הדינמיים ביותר באזור גוש דן — לרבות נכסי בורסת היהלומים, פרויקטי יוקרה, ופינוי-בינוי נרחב. רמת גן סמוכה לתל אביב, ומחיריה עולים בהתמדה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין ברמת גן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רמת גן</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>9,000-20,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>בדיקת חוזה</td><td>1,500-4,000 ₪</td><td>2,000-5,000 ₪</td></tr>
<tr><td>פינוי-בינוי</td><td>2,000-8,000 ₪ לדייר</td><td>2,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין רמת גן | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין רמת גן: רכישה 9K-20K ₪. בורסת יהלומים, פינוי-בינוי, שוק דינמי. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין רמת גן' }
  ));

  // 2. FAMILY LAW ASHDOD
  results.push(await upsert('family-law-ashdod', 'עורך דין משפחה אשדוד | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה באשדוד מייצג בבית המשפט לענייני משפחה אשדוד ובבית הדין הרבני. אשדוד — עיר נמל עם אוכלוסייה מגוונת גדולה — מאופיינת בביקוש גבוה לשירותי דיני משפחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה באשדוד</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>אשדוד</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-12,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-45,000 ₪</td><td>20,000-80,000 ₪</td></tr>
<tr><td>מזונות (דיון)</td><td>2,000-7,000 ₪</td><td>4,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה אשדוד | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה אשדוד: גירושין 4K-45K ₪. בית משפט משפחה אשדוד, עיר נמל מגוונת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה אשדוד' }
  ));

  // 3. CRIMINAL LAWYER ASHDOD
  results.push(await upsert('criminal-lawyer-ashdod', 'עורך דין פלילי אשדוד | מחירים וייצוג 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי באשדוד מייצג בבית משפט השלום ובמחוזי תל אביב. אשדוד — נמל הים הגדול בישראל — מאופיינת בתיקי קבלן, עובדים זרים, הברחות, ועבירות נמל.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי באשדוד</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>אשדוד</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-6,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>6,000-22,000 ₪</td><td>8,000-30,000 ₪</td></tr>
<tr><td>עבירות מכס/הברחה</td><td>15,000-60,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי אשדוד | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי אשדוד: תעבורה 1.5K-6K, הברחות 15K-60K ₪. עיר נמל, עבירות מכס. מדריך 2025.', pillar_keyword: 'עורך דין פלילי אשדוד' }
  ));

  // 4. DEBT COLLECTION ISRAEL
  results.push(await upsert('debt-collection-israel', 'גביית חוב בישראל | כלים, זכויות חייב, הליך | Jus-Tice',
    `<!-- wp:paragraph --><p>גביית חוב בישראל מתנהלת בעיקר דרך הוצאה לפועל, אבל יש גם מסלולים אחרים — בית משפט לתביעות קטנות, בית דין לעבודה, ומגשרים. לחייב יש זכויות שמגינות עליו מגביה בלתי חוקית.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מסלולי גביית חוב</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מסלול</th><th>מתאים ל</th><th>עלות</th><th>זמן</th></tr></thead><tbody>
<tr><td>הוצאה לפועל</td><td>חובות עם פסק דין</td><td>1-3% + אגרה</td><td>מיידי עד חודשים</td></tr>
<tr><td>תביעות קטנות (עד 33,200)</td><td>חוב קטן ללא עו"ד</td><td>120-600 ₪</td><td>3-6 חודשים</td></tr>
<tr><td>גישור / מו"מ</td><td>לקוח שעדיין משלם</td><td>3,000-10,000 ₪</td><td>שבועות</td></tr>
<tr><td>חברת גבייה</td><td>חובות קטנים מרובים</td><td>20-40% מהגבוי</td><td>שבועות-חודשים</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה אסור לגובה חוב לעשות?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>לאיים או להפחיד</li>
<li>ליצור קשר בשעות לא סבירות (לפני 7:00 ואחרי 21:00)</li>
<li>לפנות למקום עבודה ללא הרשאה</li>
<li>לזייף מסמכים</li>
<li>לתת מידע שקרי לחייב</li>
</ul><!-- /wp:list -->
<!-- wp:paragraph --><p><a href="/writ-of-execution-israel/">הוצאה לפועל</a> | <a href="/small-claims-court-israel/">תביעות קטנות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גביית חוב בישראל | כלים, זכויות חייב, הליך | Jus-Tice', seo_description: '4 מסלולי גבייה: ה"פ, תביעות קטנות, גישור, חברת גבייה. 5 דברים אסורים לגובה. מדריך 2025.', pillar_keyword: 'גביית חוב', secondary_keywords: 'גביית חובות ישראל,חברת גבייה,גבייה בהוצאה לפועל' }
  ));

  // 5. IMMIGRATION LAWYER COST
  results.push(await upsert('immigration-lawyer-cost', 'כמה עולה עורך דין הגירה | מחירים לכל שירות | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין הגירה בישראל מטפל בעלייה, ויזות, אשרות עבודה, ואזרחות. מחירים משתנים מאוד לפי סוג השירות. מדריך זה נותן טווחים ריאליים ועדכניים לשנת 2025.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין הגירה 2025</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מינימום</th><th>ממוצע</th><th>מקסימום</th></tr></thead><tbody>
<tr><td>ייעוץ ראשוני</td><td>0 ₪</td><td>400 ₪</td><td>800 ₪</td></tr>
<tr><td>אשרת עלייה / עולה חדש</td><td>2,000 ₪</td><td>5,000 ₪</td><td>12,000 ₪</td></tr>
<tr><td>אשרת עבודה לזר</td><td>3,000 ₪</td><td>7,000 ₪</td><td>20,000 ₪</td></tr>
<tr><td>אזרחות / השבת אזרחות</td><td>5,000 ₪</td><td>10,000 ₪</td><td>30,000 ₪</td></tr>
<tr><td>ערעור דחיית בקשה</td><td>5,000 ₪</td><td>15,000 ₪</td><td>40,000 ₪</td></tr>
<tr><td>גירוש / עצור הגירה</td><td>8,000 ₪</td><td>20,000 ₪</td><td>60,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/immigration-lawyer-israel/">מדריך עורך דין הגירה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'כמה עולה עורך דין הגירה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין הגירה: עלייה 2K-12K, עבודה לזר 3K-20K, אזרחות 5K-30K, גירוש 8K-60K ₪. מדריך 2025.', pillar_keyword: 'כמה עולה עורך דין הגירה', secondary_keywords: 'מחיר עורך דין הגירה,עלות עורך דין עלייה,שכר טרחה הגירה' }
  ));

  console.log('\n=== BATCH 23 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
