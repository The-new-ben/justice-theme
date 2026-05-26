/**
 * Batch 28 — Family law Modiin, divorce/children emotional, eviction notice,
 * business partner dispute, RE Givatayim
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

  // 1. FAMILY LAW MODIIN
  results.push(await upsert('family-law-modiin', 'עורך דין משפחה מודיעין | גירושין, מזונות 2025 | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין משפחה במודיעין מייצג בבית המשפט לענייני משפחה ובבית הדין הרבני. מודיעין — עיר צעירה עם אוכלוסייה צעירה ומשפחות — מאופיינת בביקוש גבוה לשירותי משפחה בשל הרכב הדמוגרפי.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין משפחה במודיעין</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>מודיעין</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>גירושין בהסכמה</td><td>5,000-14,000 ₪</td><td>8,000-20,000 ₪</td></tr>
<tr><td>גירושין בסכסוך</td><td>12,000-50,000 ₪</td><td>20,000-80,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/family-law/">מדריך דיני משפחה</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין משפחה מודיעין | גירושין, מזונות 2025 | Jus-Tice', seo_description: 'עורך דין משפחה מודיעין: גירושין 5K-50K ₪. עיר צעירה, ביקוש גבוה. בית משפט משפחה. מדריך 2025.', pillar_keyword: 'עורך דין משפחה מודיעין' }
  ));

  // 2. DIVORCE AND CHILDREN EMOTIONAL (emotional/informational magnet)
  results.push(await upsert('divorce-children-emotional', 'גירושין והשפעה על ילדים | כיצד להגן, מה לעשות | Jus-Tice',
    `<!-- wp:paragraph --><p>גירושין משפיעים על ילדים — אך הרבה תלוי בכיצד ההורים מנהלים את התהליך. מחקרים מראים: ילדים שהוריהם גרשו בשיתוף פעולה — מסתגלים טוב יותר. ילדים שהפכו לכלי במלחמת ההורים — עלולים לסבול נפשית שנים.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>השפעות שכיחות של גירושין על ילדים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>גיל</th><th>תגובה שכיחה</th><th>מה עוזר</th></tr></thead><tbody>
<tr><td>0-5</td><td>חרדת פרידה, נסיגה התפתחותית</td><td>יציבות שגרה</td></tr>
<tr><td>6-12</td><td>אשמה עצמית, ביצועים לימודיים</td><td>בהירות + אי-שיתוף במחלוקות</td></tr>
<tr><td>13-18</td><td>מרידה, בחירת צד, דיכאון</td><td>עצמאות מוכוונת, טיפול</td></tr>
</tbody></table></figure><!-- /wp:table -->

<!-- wp:heading --><h2>מה הורים יכולים לעשות</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>דברו עם הילדים בגובה העיניים, לא דרך ילד (messenger child)</li>
<li>אל תשתפו ילדים בפרטי הסכסוך הכספי</li>
<li>שמרו על שגרת ביקורים ללא שינוי חד</li>
<li>שקלו גישור משפחתי לפני בית משפט</li>
<li>פנו למטפל ילדים אם נדרש</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>מה אומרים הילדים בבית המשפט?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>בית המשפט ממנה "עורך דין לילד" (מינוי) בתיקים שנויים במחלוקת. מגיל 14+ — ייתכן שהשופט ישמע את הילד ישירות. אך אין "זכות" לילד לבחור הורה — השופט שוקל את כלל הנסיבות.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/child-custody-guide/">מדריך משמורת ילדים</a> | <a href="/divorce-mediation/">גישור בגירושין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'גירושין והשפעה על ילדים | כיצד להגן, מה לעשות | Jus-Tice', seo_description: 'גירושין: 3 גיל × תגובה × מה עוזר בטבלה. 5 כללי הורה מגן. עורך דין לילד. מגיל 14 = שמיעה. מדריך 2025.', pillar_keyword: 'גירושין השפעה על ילדים', secondary_keywords: 'ילדים בגירושין,גירושין ילדים,הגנת ילדים בגירושין' }
  ));

  // 3. EVICTION NOTICE ISRAEL (both landlord and tenant angles)
  results.push(await upsert('eviction-notice-israel', 'פינוי שוכר | הליך, מכתב, זכויות שוכר | Jus-Tice',
    `<!-- wp:paragraph --><p>פינוי שוכר בישראל הוא הליך משפטי מוסדר — לא ניתן פשוט "להוציא" שוכר. בעל דירה שרוצה לסיים שכירות חייב לעמוד בתהליך החוק. שוכר שמסרב לצאת — ניתן לפנותו רק בפסק דין ורשות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>תנאים שבהם ניתן לפנות שוכר</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>הסכם שכירות פג ולא חודש</li>
<li>אי-תשלום דמי שכירות (אחרי התראה)</li>
<li>שימוש בנכס שלא כמוסכם</li>
<li>נזק חמור לנכס</li>
<li>הפרת הסכם מהותית אחרת</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>שלבי הליך פינוי</h2><!-- /wp:heading -->
<!-- wp:list {"ordered":true} --><ol>
<li>מכתב התראה לשוכר (7-14 ימים)</li>
<li>הגשת תביעת פינוי לבית משפט שלום</li>
<li>שמיעה (30-90 ימים)</li>
<li>פסק דין פינוי</li>
<li>הוצאה לפועל (10 ימים לצאת)</li>
</ol><!-- /wp:list -->

<!-- wp:heading --><h2>שאלות נפוצות</h2><!-- /wp:heading -->
<!-- wp:heading {"level":3} --><h3>כמה זמן לוקח לפנות שוכר?</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>מינימום 3-4 חודשים אם הכל חלק. בשוכר שמתנגד — 6-12 חודשים. בשוכר מוגן (דייר ותיק) — שנים ותשלום מוניטין עצום.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="/landlord-rights-israel/">זכויות בעל דירה</a> | <a href="/tenant-rights-israel/">זכויות שוכר</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'פינוי שוכר | הליך, מכתב, זכויות שוכר | Jus-Tice', seo_description: '5 תנאי פינוי. הליך 5 שלבים: 3-12 חודשים. דייר ותיק = מסובך. 10 ימי ה"פ לאחר פסיקה. מדריך 2025.', pillar_keyword: 'פינוי שוכר', secondary_keywords: 'פינוי דייר ישראל,תביעת פינוי,מכתב פינוי' }
  ));

  // 4. BUSINESS PARTNER DISPUTE
  results.push(await upsert('partner-dispute-business', 'סכסוך שותפים עסקיים | פירוק, זכויות, הליך | Jus-Tice',
    `<!-- wp:paragraph --><p>סכסוך שותפים עסקיים — בין שותפויות, חברות, או הסכמי שותפות — הוא אחד הסכסוכים המורכבים ביותר. כ-30-40% מהעסקים הקטנים חווים סכסוך שותפים בנקודת כלשהי. הפתרון הנכון חוסך לשני הצדדים הרבה כסף וזמן.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>סיבות נפוצות לסכסוך שותפים</h2><!-- /wp:heading -->
<!-- wp:list --><ul>
<li>חלוקת רווחים לא מוסכמת</li>
<li>אחד השותפים לא מתפקד / עוזב</li>
<li>הפרת אמון / גניבה</li>
<li>חילוקי דעות אסטרטגיים</li>
<li>אין הסכם שותפות ברור</li>
</ul><!-- /wp:list -->

<!-- wp:heading --><h2>אפשרויות פתרון</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>מסלול</th><th>מתאים ל</th><th>עלות</th></tr></thead><tbody>
<tr><td>מו"מ / גישור</td><td>שותפים שעוד מדברים</td><td>5,000-30,000 ₪</td></tr>
<tr><td>פירוק שותפות בהסכמה</td><td>רוצים להיפרד בשקט</td><td>8,000-25,000 ₪</td></tr>
<tr><td>בוררות</td><td>רוצים החלטה מהירה + חסויה</td><td>20,000-80,000 ₪</td></tr>
<tr><td>תביעה לבית משפט</td><td>הפרת נאמנות / אין שיתוף</td><td>30,000-150,000 ₪</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/corporate-law-israel/">דיני חברות</a> | <a href="/mediation-israel/">גישור</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'סכסוך שותפים עסקיים | פירוק, זכויות, הליך | Jus-Tice', seo_description: '30-40% עסקים קטנים = סכסוך שותפים. 4 מסלולים: גישור 5K, פירוק 8K, בוררות 20K, תביעה 30K. מדריך 2025.', pillar_keyword: 'סכסוך שותפים', secondary_keywords: 'פירוק שותפות ישראל,סכסוך שותפים עסקי,בוררות שותפים' }
  ));

  // 5. REAL ESTATE GIVATAYIM
  results.push(await upsert('real-estate-lawyer-givatayim', 'עורך דין מקרקעין גבעתיים | מחירים ושירותים | Jus-Tice',
    `<!-- wp:paragraph --><p>עורך דין מקרקעין בגבעתיים מטפל בשוק יוקרתי של הסמוכים לתל אביב — גבעתיים היא בין הערים היקרות בנדל"ן בישראל, עם ביקוש גבוה ועסקאות יוקרתיות.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2>מחירי עורך דין מקרקעין בגבעתיים</h2><!-- /wp:heading -->
<!-- wp:table --><figure class="wp-block-table"><table><thead><tr><th>שירות</th><th>גבעתיים</th><th>תל אביב</th></tr></thead><tbody>
<tr><td>רכישת דירה</td><td>10,000-25,000 ₪</td><td>12,000-30,000 ₪</td></tr>
<tr><td>עסקת יוקרה</td><td>0.5-1% ממחיר הנכס</td><td>0.5-1.5%</td></tr>
</tbody></table></figure><!-- /wp:table -->
<!-- wp:paragraph --><p><a href="/real-estate-lawyer-guide/">מדריך עורך דין מקרקעין</a></p><!-- /wp:paragraph -->`,
    { seo_title: 'עורך דין מקרקעין גבעתיים | מחירים 2025 | Jus-Tice', seo_description: 'עורך דין מקרקעין גבעתיים: רכישה 10K-25K ₪. גבעתיים — בין הנדל"ן היקר בישראל, ביקוש גבוה. מדריך 2025.', pillar_keyword: 'עורך דין מקרקעין גבעתיים' }
  ));

  console.log('\n=== BATCH 28 RESULTS ===');
  results.forEach(r => console.log(`${(r.action||'').toUpperCase().padEnd(8)} | HTTP ${r.status} | ID ${String(r.id).padEnd(6)} | ${r.slug}`));
}
main().catch(console.error);
