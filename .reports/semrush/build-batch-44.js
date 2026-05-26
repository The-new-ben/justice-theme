/**
 * Batch 44 — RE Carmiel, criminal Ramle, family Ramle, criminal record expungement, speeding ticket
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

  // 1. REAL ESTATE CARMIEL (north, Jewish-Arab-Druze)
  results.push(await upsert('real-estate-lawyer-carmiel', 'עורך דין מקרקעין כרמיאל | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בכרמיאל מטפל בשוק הצפון הגלילי — עיר יהודית שנוסדה ב-1964 באזור ערבי-דרוזי. מחירי נדל"ן נמוכים, נגישות לטבריה וחיפה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בכרמיאל</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>כרמיאל</th><th>חיפה</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>3,500-9,000 ₪</td><td>6,000-15,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין כרמיאל | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין כרמיאל: רכישה 3.5K-9K ₪. גליל צפוני, זול, נגישות לחיפה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין כרמיאל' }
  ));

  // 2. CRIMINAL RAMLE (mixed city)
  results.push(await upsert('criminal-lawyer-ramle', 'עורך דין פלילי רמלה | מחירים 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי ברמלה מייצג בבית משפט השלום. רמלה — עיר מעורבת יהודית-ערבית — מאופיינת בתיקי אלימות, גניבה, סמים. בית משפט רמלה-לוד מטפל יחד באזור.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי ברמלה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>רמלה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,000-5,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>אלימות</td><td>4,500-20,000 ₪</td><td>8,000-30,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי רמלה | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי רמלה: תעבורה 1K-5K, אלימות 4.5K-20K ₪. עיר מעורבת. מדריך 2025.', pillar_keyword: 'עורך דין פלילי רמלה' }
  ));

  // 3. FAMILY LAW RAMLE
  results.push(await upsert('family-law-ramle', 'עורך דין משפחה רמלה | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה ברמלה מייצג בבית המשפט לענייני משפחה. רמלה — עיר מעורבת — מאופיינת בתיקי גירושין, משמורת, ואלימות במשפחה בקהילות שונות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה ברמלה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>רמלה</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-10,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-40,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה רמלה | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה רמלה: גירושין 4K-40K ₪. עיר מעורבת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה רמלה' }
  ));

  // 4. CRIMINAL RECORD EXPUNGEMENT (high intent)
  results.push(await upsert('criminal-record-expungement', 'מחיקת עבר פלילי | תנאים, הליך, הגשה | Jus-Tice',
    `<!-- wp:paragraph --><p>מחיקת עבר פלילי בישראל מתאפשרת לפי חוק המרשם הפלילי (תשמ"ד-1981). לא כל עבר נמחק, אבל ישנם מנגנונים חוקיים: "תקופת התיישנות", "תיק שנסגר", ו-"ביטול הרשעה". כ-50,000-60,000 אנשים מבקשים מידע על עברם בשנה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מתי עבר פלילי נמחק?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>תקופה להתיישנות</th></tr></thead><tbody>
<tr><td>עבירות קל (קנס בלבד)</td><td>3 שנים</td></tr>
<tr><td>עבירות מסוג חטא</td><td>7 שנים</td></tr>
<tr><td>עבירות מסוג עוון</td><td>10 שנים</td></tr>
<tr><td>עבירות מסוג פשע</td><td>15-17 שנים</td></tr>
<tr><td>רצח, אלימות קשה</td><td>לא נמחק</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>האם מעסיק יכול לראות עבר פלילי?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>תלוי בתפקיד. עבודות מסוימות (ביטחון, עם קטינים, מדינה) — כן. עבודות רגילות — לרוב לא. אחרי תקופת ההתיישנות — העבר לא מופיע בתעודת יושר. אבל תיק ל"ג בעומר יכול להישמר בפנים.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'מחיקת עבר פלילי | תנאים, הליך, הגשה | Jus-Tice', seo_description: '50-60K בקשות/שנה. קנס: 3 שנים. פשע: 15-17 שנים. רצח: לא נמחק. מעסיק: תלוי בתפקיד. מדריך 2025.', pillar_keyword: 'מחיקת עבר פלילי', secondary_keywords: 'מחיקת רישום פלילי,תיק פלילי מחיקה,עבר פלילי ישראל' }
  ));

  // 5. SPEEDING TICKET GUIDE
  results.push(await upsert('speeding-ticket-guide', 'דוח מהירות | ערעור, נקודות, עונשים | Jus-Tice',
    `<!-- wp:paragraph --><p>דוח מהירות בישראל: קנס, נקודות, ולפעמים שלילת רישיון. ניתן לערער תוך 90 ימים. כ-500,000-700,000 דוחות מהירות מונפקים בשנה. על-ידי מצלמות מהירות ומשטרה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>עונשים לפי מהירות (בישוב)</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>חריגה ממהירות</th><th>קנס</th><th>נקודות</th></tr></thead><tbody>
<tr><td>עד 20 קמ"ש</td><td>250 ₪</td><td>0</td></tr>
<tr><td>21-30 קמ"ש</td><td>500 ₪</td><td>2</td></tr>
<tr><td>31-45 קמ"ש</td><td>750 ₪</td><td>4</td></tr>
<tr><td>46-60 קמ"ש</td><td>1,000 ₪ + שלילה</td><td>6</td></tr>
<tr><td>61+ קמ"ש</td><td>2,000+ ₪ + שלילה ארוכה</td><td>8+</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:paragraph --><p><a href="/traffic-violations-guide/">עבירות תעבורה</a> | <a href="/criminal-defense-attorney/">משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'דוח מהירות | ערעור, נקודות, עונשים | Jus-Tice', seo_description: '500-700K דוחות/שנה. 5 רמות חריגה. 61+: 2K+ ₪ + שלילה ארוכה. ערעור: 90 יום. מדריך 2025.', pillar_keyword: 'דוח מהירות', secondary_keywords: 'קנס מהירות,ערעור דוח מהירות,נקודות תעבורה' }
  ));

  console.log('\n=== BATCH 44 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
