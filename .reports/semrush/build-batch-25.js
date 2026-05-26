/**
 * Batch 25 — Pregnancy malpractice, fired immediately, RE Bat Yam, family Bat Yam, criminal Ramat Gan
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

  // 1. MEDICAL NEGLIGENCE IN PREGNANCY/BIRTH (high-demand specific cluster)
  results.push(await upsert('medical-negligence-pregnancy', 'רשלנות רפואית בהריון ולידה | מה שצריך לדעת | Jus-Tice',
    `<!-- wp:paragraph --><p>רשלנות רפואית בהריון ולידה היא אחת הקטגוריות הרגישות והחמורות ביותר. כ-20-30% מתביעות הרשלנות הרפואית בישראל נוגעות ללידה ותינוקות. הפיצויים הם בין הגבוהים ביותר — שכן מדובר לעיתים בנכות לכל החיים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סוגי רשלנות בהריון ולידה</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>סוג</th><th>דוגמאות</th><th>טווח פיצוי</th></tr></thead><tbody>
<tr><td>אי-אבחון מולד</td><td>Down Syndrome, ספינה ביפידה</td><td>500K-3M ₪</td></tr>
<tr><td>סיבוכי לידה</td><td>שיתוק מוחין, חנק לידה</td><td>1M-10M ₪</td></tr>
<tr><td>ניתוח קיסרי מאחר</td><td>עיכוב בהחלטה</td><td>300K-2M ₪</td></tr>
<tr><td>תרופות בהריון</td><td>נזק לעובר</td><td>200K-1.5M ₪</td></tr>
<tr><td>ניהול לקוי של סיכון</td><td>פה-פה, סוכרת הריון</td><td>100K-500K ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן יש לתבוע רשלנות לידה?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>7 שנים מיום שנודע הנזק. לקטין (ילד שנפגע): 7 שנים מגיל 18. לפיכך — עד גיל 25. לתביעות שיתוק מוחין — כ-25 שנה מהלידה עד לתביעה אפשרית.</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>האם ניתן לתבוע על לידה שהייתה לפני שנים רבות?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>כן — אם הילד עדיין מתחת לגיל 25 (לנפגע קטין). ואם הנזק התגלה לאחרונה — 7 שנים מגילוי הנזק, בכפוף לקביעת בית משפט.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/medical-malpractice-lawyer/">מדריך רשלנות רפואית</a> | <a href="/medical-malpractice-cost/">עלות תביעת רשלנות</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'רשלנות רפואית בהריון ולידה | פיצויים ומה לעשות | Jus-Tice', seo_description: '20-30% מתביעות רשלנות = לידה. שיתוק מוחין: 1M-10M ₪. קטין: עד גיל 25. 5 סוגי תביעות. מדריך 2025.', pillar_keyword: 'רשלנות רפואית לידה', secondary_keywords: 'רשלנות הריון ולידה,שיתוק מוחין תביעה,אי אבחון מולד' }
  ));

  // 2. FIRED IMMEDIATELY (high-volume urgent intent)
  results.push(await upsert('worker-rights-fired-immediately', 'פוטרתי על המקום | מה עושים, מה מגיע, מה כדאי | Jus-Tice',
    `<!-- wp:paragraph --><p>פיטורים מיידיים — ללא הודעה מוקדמת — הם לרוב בלתי חוקיים בישראל. אם פוטרת על המקום, יש לך זכויות ברורות וצעדים שצריך לנקוט מיד. מדריך זה עוזר.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>האם פיטורים מיידיים חוקיים?</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li><strong>לרוב — לא:</strong> חוק הודעה מוקדמת מחייב: 1 חודש (אחרי שנה) עד 30 יום.</li>
<li><strong>חריגים:</strong> פיטורים מיידיים מותרים במקרים של: גניבה, אלימות, הפרת סודיות, הפרה קיצונית של אמון.</li>
<li><strong>בנטל:</strong> המעסיק חייב להוכיח שהיה עילה לפיטורים מיידיים. ברוב המקרים — כדאי להמתין לחוות דעת משפטית.</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>מה מגיע לך אחרי פיטורים?</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>רכיב</th><th>מה מגיע</th></tr></thead><tbody>
<tr><td>פיצויי פיטורים</td><td>חודש שכר לכל שנת עבודה</td></tr>
<tr><td>הודעה מוקדמת (pay in lieu)</td><td>שכר בגין תקופת הודעה</td></tr>
<tr><td>ימי חופשה שלא נוצלו</td><td>שכר עבורם</td></tr>
<tr><td>פנסיה שנצברה</td><td>העברה לפנסיה אישית תוך 15 יום</td></tr>
<tr><td>אם פיטורים שלא כדין</td><td>פיצוי נוסף + עוגמת נפש</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>צעדים מיידיים</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>תעד הכל — בכתב, WhatsApp, דוא"ל</li>
<li>בקש מסמך רשמי לפיטורים (מכתב פיטורים)</li>
<li>אל תחתום על כלום עדיין (מסמכי ויתור)</li>
<li>פנה לעורך דין עבודה</li>
<li>הגש תביעת דמי אבטלה לביטוח לאומי תוך 28 ימים</li>
</ol><!-- /wp:list -->
<!-- wp:paragraph --><p><a href="/wrongful-dismissal-guide/">מדריך פיטורים שלא כדין</a> | <a href="/labor-law-employee-rights/">זכויות עובדים</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'פוטרתי על המקום | מה עושים, מה מגיע | Jus-Tice', seo_description: 'פיטורים מיידיים: לרוב בלתי חוקיים. חודש שכר לכל שנה + הודעה מוקדמת. 5 צעדים מיידיים. אבטלה: 28 יום. מדריך 2025.', pillar_keyword: 'פוטרתי על המקום', secondary_keywords: 'פיטורים מיידיים זכויות,פוטר על המקום ישראל,פיטורים ללא הודעה' }
  ));

  // 3. REAL ESTATE BAT YAM
  results.push(await upsert('real-estate-lawyer-bat-yam', 'עורך דין מקרקעין בת ים | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בבת ים מטפל בשוק ייחודי — עיר חוף ים שמתחדשת מהר, עם פינוי-בינוי נרחב ועליית ערך דירות משמעותית. בת ים סמוכה לתל אביב ולחולון.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בבת ים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בת ים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>8,000-18,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>פינוי-בינוי</td><td>2,000-7,000 ₪/דייר</td><td>2,500-10,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין בת ים | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין בת ים: רכישה 8K-18K ₪. פינוי-בינוי נרחב, עיר חוף מתחדשת. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין בת ים' }
  ));

  // 4. FAMILY BAT YAM
  results.push(await upsert('family-law-bat-yam', 'עורך דין משפחה בת ים | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה בבת ים מייצג בבית המשפט לענייני משפחה ובבית הדין הרבני האזורי. בת ים היא עיר עם אוכלוסייה מגוונת, ומאופיינת בביקוש גבוה לשירותי דיני משפחה.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה בבת ים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>בת ים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>4,000-12,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>10,000-45,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה בת ים | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה בת ים: גירושין 4K-45K ₪. בת ים עיר חוף עם אוכלוסייה מגוונת. מדריך 2025.', pillar_keyword: 'עורך דין משפחה בת ים' }
  ));

  // 5. CRIMINAL RAMAT GAN
  results.push(await upsert('criminal-lawyer-ramat-gan', 'עורך דין פלילי רמת גן | מחירים וייצוג 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין פלילי ברמת גן מייצג בבית משפט השלום ובמחוזי תל אביב. רמת גן — עם בורסת היהלומים ועסקים בינלאומיים — מאופיינת בתיקי עבירות עסקיות, מס, ועבירות צווארון לבן.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין פלילי ברמת גן</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>תיק</th><th>רמת גן</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>תעבורה</td><td>1,500-7,000 ₪</td><td>2,000-8,000 ₪</td></tr>
<tr><td>עבירות כלכליות</td><td>15,000-70,000 ₪</td><td>20,000-100,000 ₪</td></tr>
<tr><td>עבירות יהלומים / מס</td><td>20,000-80,000 ₪</td><td>25,000-100,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/criminal-defense-attorney/">מדריך משפט פלילי</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין פלילי רמת גן | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין פלילי רמת גן: עבירות כלכליות 15K-70K, יהלומים 20K-80K ₪. בורסת יהלומים. מדריך 2025.', pillar_keyword: 'עורך דין פלילי רמת גן' }
  ));

  console.log('\n=== BATCH 25 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
