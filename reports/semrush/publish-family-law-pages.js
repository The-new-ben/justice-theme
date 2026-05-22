/**
 * Publish family law pages from fixed JSON + inline divorce agreement content.
 */
const https = require('https');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');

function wpRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method,
      headers: Object.assign(
        { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/json' },
        bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}
      )
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Page 2 — divorce agreement — written inline (subagent output was truncated)
const DIVORCE_AGREEMENT_CONTENT = `<!-- wp:heading {"level":1} -->
<h1>הסכם גירושין 2025 — מדריך מלא, טופס PDF להורדה וכל מה שצריך לדעת</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"pillar-intro"} -->
<p>הסכם גירושין הוא אחד המסמכים המשפטיים החשובים ביותר שתחתמו בחייכם. הוא קובע את תנאי פירוד הזוגיות — מה יקרה לדירה, מי מקבל את הילדים, כמה ישולמו מזונות — ועם אישורו על ידי בית המשפט הוא מקבל תוקף של פסק דין מחייב. מדריך זה ינחה אתכם בכל שלבי הכנת הסכם גירושין, יסביר מה הוא אמור לכלול, ויציע לכם <strong>טופס הסכם גירושין להורדה בחינם</strong> כנקודת פתיחה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה זה הסכם גירושין?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הסכם גירושין (המכונה גם "הסכם פרידה") הוא חוזה משפטי בין שני בני זוג המסדיר את כל ההיבטים של פירוק חיי הנישואין. ההסכם מכסה את כלל הנושאים הרלוונטיים: חלוקת רכוש ונכסים, מזונות ילדים, משמורת ילדים והסדרי ביקור, מזונות אישה (אם ישים), הסדרת הפנסיה וקרנות ההשתלמות, ותנאי הגט הדתי.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>לאחר שהוא נחתם על ידי שני הצדדים ומאושר על ידי בית המשפט לענייני משפחה (או בית הדין הרבני), ההסכם מקבל תוקף של <strong>פסק דין מחייב</strong> — ניתן לאכוף אותו באמצעות לשכת ההוצאה לפועל.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מתי הסכם גירושין הוא חובה ומתי הוא מומלץ?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בגירושין בהסכמה — כאשר שני הצדדים מסכימים על כלל התנאים — הסכם גירושין הוא <strong>תנאי הכרחי</strong> לאישור הגירושין על ידי בית המשפט. ללא הסכם מאושר, אי אפשר לסיים את ההליך.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>אפילו כשיש מחלוקות חלקיות, רצוי מאוד להגיע להסכם מוסכם על כמה שיותר נושאים — זה קצר את ההליך, מפחית עלויות משפטיות, ומצמצם את הסכסוך לנושאים המצומצמים שבאמת שנויים במחלוקת.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה כולל הסכם גירושין טיפוסי? (9 סעיפים מרכזיים)</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>הצהרות כלליות</strong> — פרטי בני הזוג, תאריך הנישואין, מספר הילדים, הסכמה לגירושין.</li>
<li><strong>הגט הדתי</strong> — הסדרים לנתינת הגט בבית הדין הרבני, לוחות זמנים, מחויבויות הצדדים.</li>
<li><strong>משמורת ילדים</strong> — <a href="/child-custody/">משמורת פיזית ומשמורת משפטית</a>, הסדרי לינה, חלוקת חגים וחופשות, זמני ביקור.</li>
<li><strong>מזונות ילדים</strong> — <a href="/child-support/">סכום המזונות</a>, דרך התשלום, מנגנון הצמדה למדד, הוצאות חינוך ובריאות.</li>
<li><strong>מזונות אישה</strong> — סכום, תנאים, משך התשלום, נסיבות סיומו.</li>
<li><strong>חלוקת הדירה</strong> — מכירה וחלוקת התמורה / העברת בעלות לאחד הצדדים / הסדרי מגורים זמניים.</li>
<li><strong>חלוקת כלל הנכסים</strong> — חשבונות בנק, קרנות השתלמות, פנסיה, רכבים, השקעות.</li>
<li><strong>חובות ומשכנתאות</strong> — מי נושא באחריות לחובות משותפים.</li>
<li><strong>ויתורים הדדיים</strong> — סעיף סיום המוודא שכל תביעה עתידית מוסדרת.</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>טופס הסכם גירושין להורדה בחינם 2025</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>פורטל ג'סטיס מעמיד לרשותכם טופס הסכם גירושין להורדה בחינם — כנקודת פתיחה לדיונים עם עורך הדין שלכם. חשוב: הטופס הוא מדריך בלבד ואינו תחליף לייעוץ משפטי. כל הסכם גירושין חייב להיות מותאם לנסיבות הספציפיות של זוג.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[justice_pdf_download file="divorce-agreement-template-2025.pdf" label="הורד טופס הסכם גירושין 2025 בחינם"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p>⚠️ <strong>אזהרה חשובה:</strong> הטופס הוא נקודת התחלה בלבד. הסכם גירושין שלא נבדק על ידי עורך דין מנוסה עלול לפגוע קשות בזכויותיכם — כולל ויתור לא מודע על חלק ברכוש, מזונות נמוכים מהמגיע, ועוד. השקעה בעורך דין משתלמת תמיד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>איך עושים הסכם גירושין — שלב אחר שלב</h2>
<!-- /wp:heading -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>שיחה ראשונית בין בני הזוג</strong> — זהו שלב ראשוני בו מנסים לגבש הסכמות עקרוניות לגבי ילדים ורכוש.</li>
<li><strong>ייעוץ עם עורך דין גירושין</strong> — כל צד שוכר עורך דין משלו (מומלץ) או מתייעץ עם עורך דין אחד הנייטרלי (גישור).</li>
<li><strong>גיבוש טיוטה</strong> — עורכי הדין עורכים טיוטה ראשונית על בסיס ההסכמות.</li>
<li><strong>משא ומתן</strong> — הנושאים השנויים במחלוקת מוסדרים דרך משא ומתן ישיר, גישור, או ייצוג בבית המשפט.</li>
<li><strong>חתימה</strong> — שני הצדדים חותמים על ההסכם הסופי בנוכחות עורך הדין.</li>
<li><strong>אישור בית משפט</strong> — ההסכם מוגש לאישור בית המשפט לענייני משפחה. השופט בוחן אותו ואם הוא תקין ומשקף הסכמה חופשית — מאשר אותו כפסק דין.</li>
<li><strong>גט</strong> — ביחד עם אישור הגירושין האזרחי, נסדר גם הגט בבית הדין הרבני.</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>כמה עולה הסכם גירושין? (טבלת עלויות 2025)</h2>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<thead><tr><th>סוג הגירושין</th><th>עלות משוערת</th><th>משך זמן</th></tr></thead>
<tbody>
<tr><td>גירושין בהסכמה פשוטים (ללא ילדים, ללא נכסים)</td><td>₪5,000 – ₪12,000</td><td>2–4 חודשים</td></tr>
<tr><td>גירושין בהסכמה עם ילדים ורכוש</td><td>₪15,000 – ₪40,000</td><td>4–8 חודשים</td></tr>
<tr><td>גירושין חלקית מוסכמים (מחלוקות ספציפיות)</td><td>₪25,000 – ₪60,000</td><td>8–18 חודשים</td></tr>
<tr><td>גירושין שנויים במחלוקת</td><td>₪40,000 – ₪150,000+</td><td>1–5 שנים</td></tr>
<tr><td>גישור גירושין + הסכם</td><td>₪8,000 – ₪25,000</td><td>3–6 חודשים</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:heading -->
<h2>הסכם גירושין פרטני לעומת הסכם עם גישור</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><a href="/divorce-mediation/">גישור גירושין</a> הוא תהליך בו מגשר ניטרלי מסייע לשני הצדדים להגיע להסכמות. הגישור לרוב זול יותר, מהיר יותר ומשמר טוב יותר את יחסי ההורות לאחר הגירושין — במיוחד כאשר יש ילדים משותפים. ההסכם המגובש בגישור מועבר לאחר מכן לאישור בית המשפט ומקבל תוקף פסיקתי זהה.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>ייצוג פרטי (כל צד עם עורך דין משלו) מתאים יותר כאשר יש מחלוקות עמוקות, פערי כוח בין הצדדים, חשש לאלימות, או חשבונות מורכבים. עורך הדין מגן על האינטרסים שלכם בלבד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>שאלות נפוצות על הסכם גירושין</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>האם חייב לכלול עורך דין בהכנת הסכם גירושין?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>מבחינה חוקית, ניתן להגיש הסכם גירושין גם ללא עורך דין — אך זה לא מומלץ. בית המשפט יבחן אם ההסכם הוגן לשני הצדדים ולילדים. הסכם שנחתם ללא ייצוג עלול להיות לא מאוזן, ומאוחר יותר קשה לבטל אותו.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה זמן אורך אישור הסכם גירושין בבית המשפט?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>לאחר הגשת ההסכם לבית המשפט, האישור לוקח בדרך כלל 4–8 שבועות. בית המשפט קובע מועד דיון, בוחן את ההסכם, ואם הוא תקין — מאשר אותו בפסיקה תה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם ניתן לשנות הסכם גירושין לאחר חתימה?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>כן — ניתן לפנות לבית המשפט בבקשה לשינוי ההסכם אם השתנו הנסיבות מהותית. למשל: שינוי מהותי בהכנסות, שינוי בסדרי המשמורת, או מעבר מגורים. שינוי מזונות ילדים אפשרי כאשר יש שינוי מהותי בנסיבות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה קורה אם צד אחד לא מקיים את ההסכם?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>מאחר שהסכם גירושין שאושר על ידי בית המשפט הוא פסק דין, ניתן לאכוף אותו דרך לשכת ההוצאה לפועל. אי תשלום מזונות, למשל, יכול להוביל לעיקול חשבונות, מניעת יציאה מהארץ, ואף מאסר.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה ניתן לכלול בהסכם גירושין בנוגע לדירה?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>הסכם גירושין יכול לקבוע: מכירת הדירה וחלוקת התמורה, העברת הבעלות לאחד הצדדים (עם פדיון לצד השני), הסדרת מגורים עד גיל מסוים של הילדים, ועוד. יש לכלול טיפול במשכנתא ובכל ההיבטים הכספיים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם הסכם גירושין גם מסדיר את הגט?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>הסכם גירושין אזרחי מסדיר את ההיבטים הממוניים, ההוריים והאישיים של הפרידה. הגט הדתי מוסדר בנפרד בבית הדין הרבני. לעיתים הסכם הגירושין כולל גם הוראות בנוגע להתחייבות לתת גט — אך אכיפה על מסרב גט היא נושא מורכב.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה ההבדל בין "גירושין בהסכמה" ל"גירושין שנויים במחלוקת"?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>בגירושין בהסכמה — שני הצדדים מסכימים על כל התנאים, חותמים על הסכם, ובית המשפט מאשר. תהליך מהיר ופחות יקר. בגירושין שנויים במחלוקת — אין הסכמה על נושאים מהותיים (רכוש, ילדים, מזונות). בית המשפט מכריע, והתהליך ארוך ויקר בהרבה.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr/>
<!-- /wp:separator -->

<!-- wp:paragraph {"className":"pillar-cta"} -->
<p><strong>זקוק לעורך דין גירושין לעריכת הסכם גירושין?</strong> השאר פרטים ומומחה ג'סטיס יחזור אליך תוך שעה.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[justice_contact_form type="divorce" subject="הסכם גירושין"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p>← <a href="/lawyer-divorce-guide-proceedings-costs-rights/">חזרה למדריך עורך דין גירושין המלא</a> | <a href="/child-support/">מחשבון מזונות ילדים →</a></p>
<!-- /wp:paragraph -->`;

async function publishPage(slug, title, seoTitle, seoDesc, focusKw, content) {
  console.log(`\n--- Publishing: ${slug} ---`);
  const find = await wpRequest('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=3`);
  const existing = Array.isArray(find.body) ? find.body[0] : null;

  const payload = {
    title: seoTitle,
    slug,
    content,
    status: 'publish',
    meta: { seo_title: seoTitle, seo_description: seoDesc, pillar_keyword: focusKw },
  };

  let result;
  if (existing) {
    console.log(`  Updating existing ID ${existing.id}`);
    result = await wpRequest('POST', `/wp-json/wp/v2/pages/${existing.id}`, payload);
  } else {
    console.log(`  Creating new page`);
    result = await wpRequest('POST', '/wp-json/wp/v2/pages', payload);
  }
  console.log(`  Status: ${result.status} | URL: ${result.body?.link}`);
  return result;
}

async function main() {
  const pages = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/reports/semrush/family-law-pages-fixed.json', 'utf8'));
  
  // Publish divorce pillar (page 1 from fixed JSON)
  const p1 = pages[0];
  await publishPage(
    p1.slug,
    p1.seo_title,
    p1.seo_title,
    p1.seo_description || 'מצא עורך דין גירושין מומלץ בישראל — מדריך מלא: הליך הגירושין, מחירים, חלוקת רכוש, מזונות ומשמורת ילדים. השוואת עורכי דין לפי ביקורות.',
    p1.focus_keyword,
    p1.content
  );
  await new Promise(r => setTimeout(r, 1000));

  // Publish divorce agreement (inline content — page 2 was truncated)
  await publishPage(
    'divorce-agreement',
    'הסכם גירושין 2025 | מדריך + טופס PDF להורדה | Jus-Tice',
    'הסכם גירושין 2025 | מדריך + טופס PDF להורדה | Jus-Tice',
    'מדריך מלא להסכם גירושין בישראל 2025 — מה כולל ההסכם, איך עושים אותו, כמה עולה, טופס להורדה בחינם. ייעוץ מעורך דין גירושין.',
    'הסכם גירושין',
    DIVORCE_AGREEMENT_CONTENT
  );

  console.log('\n✅ All pages published.');
}

main().catch(console.error);
