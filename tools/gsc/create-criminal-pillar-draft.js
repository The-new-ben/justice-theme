/**
 * create-criminal-pillar-draft.js
 * Creates a DRAFT WordPress Page for the Criminal Law pillar.
 * SAFE: Creates draft only, does not publish.
 * Does not change any existing URLs.
 * Does not redirect anything.
 * Does not modify existing posts.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'jus-tice.co.il';

// Application Password credentials (base64 of user:pass)
// Check if we have an app password stored
const APP_PASSWORD_FILE = path.join(__dirname, 'wp-app-password.json');

let AUTH_HEADER = '';
if (fs.existsSync(APP_PASSWORD_FILE)) {
  const creds = JSON.parse(fs.readFileSync(APP_PASSWORD_FILE, 'utf8'));
  AUTH_HEADER = 'Basic ' + Buffer.from(`${creds.username}:${creds.password}`).toString('base64');
}

// ── Page Content ──────────────────────────────────────────
const PAGE_TITLE = 'עורך דין פלילי';
const PAGE_SLUG = 'criminal-lawyer';

const PAGE_CONTENT = `
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">עורך דין פלילי — מדריך מקיף למשפט פלילי בישראל</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>מי שנקלע למצב פלילי — חקירה, מעצר, כתב אישום או אפילו הזמנה לשימוע — צריך לדעת מה עומד לקרות ומה הזכויות שלו. הדף הזה מרכז את המידע החשוב ביותר על ההליך הפלילי בישראל, ומסביר מתי ולמה חשוב לפנות לעורך דין פלילי.</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2 class="wp-block-heading">מתי צריך עורך דין פלילי?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לא כל מפגש עם המשטרה דורש עורך דין, אבל יש מצבים שבהם ליווי מקצועי הוא קריטי:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>זימון לחקירה במשטרה</strong> — גם אם מדובר ב&quot;שיחת בירור&quot;, כדאי להתייעץ לפני שמגיעים.</li>
<li><strong>מעצר</strong> — מעצר ימים, מעצר עד תום ההליכים, שחרור בערובה — כל אחד דורש ייצוג.</li>
<li><strong>כתב אישום</strong> — אם הוגש נגדכם כתב אישום, אתם זקוקים לייצוג מיידי.</li>
<li><strong>שימוע לפני כתב אישום</strong> — הזדמנות למנוע הגשת כתב אישום, בתנאי שמתכוננים נכון.</li>
<li><strong>רישום פלילי</strong> — בקשה למחיקה או בדיקת רישום קיים.</li>
<li><strong>עבירות תנועה חמורות</strong> — נהיגה בשכרות, תאונה עם נפגעים, או פסילת רישיון.</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">חקירה במשטרה — מה חשוב לדעת לפני שמדברים?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כשמזמינים אתכם לחקירה, עדיף להתייעץ עם עורך דין <strong>לפני</strong> שמגיעים לתחנה. כל מילה שנאמרת בחקירה יכולה לשמש כראיה. עורך דין פלילי יסביר לכם מה הזכויות שלכם, מתי מותר לשתוק, ומה לצפות.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>📌 <a href="https://jus-tice.co.il/apply-for-police-criminal-information-certificates">בקשה לאישורי מידע פלילי מהמשטרה — מדריך מלא</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">זכויות נחקר במשטרה</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לכל אדם שנחקר יש זכויות בסיסיות שהמשטרה חייבת לכבד:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>הזכות לדעת בגין מה נחקרים</li>
<li>הזכות להיוועץ עם עורך דין לפני ובמהלך חקירה</li>
<li>הזכות לשתוק (בכפוף לחריגים בחוק)</li>
<li>הזכות לתנאים הוגנים בחקירה — ללא לחצים פסולים</li>
<li>הזכות שלא להפליל את עצמו</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>אם אחת מהזכויות האלה נפגעה, עורך דין פלילי יכול לטעון לפסילת ראיות שהושגו שלא כדין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">מעצר, שחרור ודיון בבית המשפט</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ישנם מספר סוגי מעצר בדין הישראלי:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>מעצר ימים</strong> — עד 24 שעות ללא הארכה, או עד 15 יום עם אישור שופט.</li>
<li><strong>מעצר עד תום ההליכים</strong> — מעצר חמור יותר, לאחר הגשת כתב אישום.</li>
<li><strong>שחרור בערובה</strong> — שחרור תחת תנאים כמו ערבות כספית, מעצר בית, או הגבלות נוספות.</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>בכל דיון מעצר, נוכחות עורך דין משנה את התוצאה. בית המשפט מחויב לאזן בין האינטרס הציבורי לזכויות הנאשם.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">כתב אישום והליך פלילי</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כתב אישום הוא המסמך הרשמי שבו המדינה מאשימה אדם בביצוע עבירה. לאחר הגשתו, מתחיל ההליך הפלילי בבית המשפט — הקראה, שמיעת ראיות, סיכומים ופסק דין.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>לפני הגשת כתב אישום, לעיתים מתקיים <strong>שימוע</strong> — הזדמנות לשכנע את הפרקליטות שלא להגיש תביעה. שימוע מוצלח יכול למנוע הליך פלילי לחלוטין.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>📌 <a href="https://jus-tice.co.il/how-much-will-a-criminal-defense-lawyer-cost">כמה עולה עורך דין פלילי? מחירון מעודכן</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">רישום פלילי ומחיקת רישום</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>רישום פלילי יכול להשפיע על חיים שלמים — תעסוקה, רישיונות, נסיעות לחו&quot;ל ועוד. בישראל, ניתן במקרים מסוימים למחוק רישום פלילי או לקבל חנינה.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>עורך דין פלילי מנוסה יכול לסייע בהגשת בקשה למחיקת רישום, ולבדוק אם עברה תקופת ההתיישנות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">תחומי ייצוג נפוצים במשפט פלילי</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>המשפט הפלילי בישראל מכסה מגוון רחב של עבירות. הנה התחומים המרכזיים שבהם עורך דין פלילי מייצג:</p>
<!-- /wp:paragraph -->

<!-- wp:columns -->
<div class="wp-block-columns">

<!-- wp:column -->
<div class="wp-block-column">
<h3>🔹 עבירות אלימות</h3>
<p>תקיפה, איומים, אלימות במשפחה, גרימת חבלה חמורה.</p>

<h3>🔹 עבירות סמים</h3>
<p>החזקה, שימוש, סחר, גידול — העונשים משתנים לפי סוג הסם והכמות.</p>

<h3>🔹 עבירות מין</h3>
<p>אינוס, מעשים מגונים, הטרדה מינית — עבירות עם השלכות חמורות מאוד.</p>
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<h3>🔹 עבירות רכוש</h3>
<p>גניבה, שוד, פריצה, הונאה.</p>
<p>📌 <a href="https://jus-tice.co.il/shoplifting">גניבה מחנות (Shoplifting) — מדריך משפטי</a></p>

<h3>🔹 צווארון לבן</h3>
<p>הלבנת הון, מרמה, הונאה עסקית, עבירות מס פליליות.</p>

<h3>🔹 עבירות תנועה חמורות</h3>
<p>נהיגה בשכרות, גרימת מוות בתאונה, מירוץ לא חוקי.</p>
</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->

<!-- wp:paragraph -->
<p>📌 <a href="https://jus-tice.co.il/lahav-433">להב 433 — יחידת החקירות הארצית: מה צריך לדעת</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">ההליך הפלילי בישראל — מפת דרכים</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ההליך הפלילי כולל מספר שלבים עיקריים:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>חקירה</strong> — איסוף ראיות על ידי המשטרה.</li>
<li><strong>שימוע</strong> — הזדמנות לשכנע את הפרקליטות שלא להעמיד לדין.</li>
<li><strong>כתב אישום</strong> — הגשת התביעה הפלילית לבית המשפט.</li>
<li><strong>הקראה</strong> — הנאשם שומע את האישומים ומשיב &quot;מודה&quot; או &quot;כופר&quot;.</li>
<li><strong>שמיעת ראיות</strong> — עדויות, חקירות נגדיות, מסמכים.</li>
<li><strong>סיכומים</strong> — טענות הצדדים.</li>
<li><strong>פסק דין</strong> — זיכוי או הרשעה.</li>
<li><strong>גזר דין</strong> — קביעת העונש במקרה של הרשעה.</li>
<li><strong>ערעור</strong> — אפשרות לערער בבית משפט גבוה יותר.</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">איך Jus-Tice עוזר למצוא מידע ועורך דין פלילי?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Jus-Tice הוא פורטל משפטי ישראלי שמרכז מידע מקצועי ומאפשר לאזרחים למצוא מידע משפטי ברור ונגיש. באתר תמצאו:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>מאמרים מקצועיים בנושאי משפט פלילי</li>
<li>מדריכים מעשיים לזכויות נחקרים ונאשמים</li>
<li>מידע על סוגי עבירות ועונשים</li>
<li>אפשרות לפנות ולהתחבר עם עורכי דין מתאימים</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>צריכים הכוונה ראשונית?</strong> פנו אלינו ונעזור לכם להבין את המצב המשפטי ולמצוא עורך דין פלילי מתאים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">שאלות נפוצות</h2>
<!-- /wp:heading -->

<details>
<summary><strong>האם מותר להתייעץ עם עורך דין לפני חקירה?</strong></summary>
<p>כן. כל אדם רשאי להתייעץ עם עורך דין לפני חקירה במשטרה. מומלץ מאוד לעשות זאת, מכיוון שעורך הדין יכול להסביר מה הזכויות שלכם ולהכין אתכם לחקירה.</p>
</details>

<details>
<summary><strong>מה לעשות אם זומנתי לחקירה במשטרה?</strong></summary>
<p>אל תתעלמו מהזימון. אם לא תגיעו, המשטרה עלולה להוציא צו הבאה. לפני ההגעה, התייעצו עם עורך דין פלילי שיסביר לכם מה לצפות ואיך להתנהג.</p>
</details>

<details>
<summary><strong>מה ההבדל בין מעצר ימים למעצר עד תום ההליכים?</strong></summary>
<p>מעצר ימים הוא מעצר קצר לצורך חקירה (עד 24 שעות, עם אפשרות הארכה על ידי שופט). מעצר עד תום ההליכים הוא מעצר ארוך יותר, לאחר הגשת כתב אישום, כשבית המשפט סבור שיש עילה להחזיק את הנאשם במעצר עד סוף המשפט.</p>
</details>

<details>
<summary><strong>האם אפשר למחוק רישום פלילי?</strong></summary>
<p>במקרים מסוימים, כן. לאחר תקופת התיישנות מסוימת (שתלויה בחומרת העבירה), ניתן להגיש בקשה למחיקת הרישום. עורך דין פלילי יכול לבדוק את הזכאות ולהגיש את הבקשה.</p>
</details>

<details>
<summary><strong>מתי כדאי לפנות לעורך דין פלילי?</strong></summary>
<p>מוקדם ככל האפשר. ברגע שאתם יודעים שיש חקירה, תלונה, זימון, מעצר, או כל מגע עם מערכת המשפט הפלילי — פנו לעורך דין. ככל שהפנייה מוקדמת יותר, כך יש יותר אפשרויות לפעולה.</p>
</details>

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"14px"},"color":{"text":"#666666"}}} -->
<p style="color:#666666;font-size:14px"><em>המידע באתר הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי. אין באמור לעיל תחליף להתייעצות עם עורך דין מוסמך. לקבלת ייעוץ משפטי פרטני, יש לפנות לעורך דין.</em></p>
<!-- /wp:paragraph -->
`;

// ── Create Draft via REST API ─────────────────────────────
function post(path, data, auth) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: SITE,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'JusTice-Pillar-Creator/1.0',
      },
    };
    if (auth) options.headers['Authorization'] = auth;

    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, raw: data.slice(0, 500) }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('╔══════════════════════════════════╗');
  console.log('║  Criminal Law Pillar — DRAFT     ║');
  console.log('╚══════════════════════════════════╝\n');

  if (!AUTH_HEADER) {
    console.log('No wp-app-password.json found.');
    console.log('To create the draft via REST API, create the file:');
    console.log('  justice-theme/tools/gsc/wp-app-password.json');
    console.log('  {"username":"YOUR_WP_USER","password":"YOUR_APP_PASSWORD"}');
    console.log('\nAlternatively, create the page manually in WP Admin.');
    console.log('\n--- PAGE CONTENT SAVED TO FILE ---');
    
    // Save content to file for manual paste
    const contentFile = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 
      'content-master', 'clusters', 'criminal-law', 'criminal-law-pillar-page-content.html');
    fs.writeFileSync(contentFile, PAGE_CONTENT, 'utf8');
    console.log(`Content saved to: ${contentFile}`);
    console.log('\nInstructions for manual creation:');
    console.log('1. Go to WP Admin > Pages > Add New');
    console.log('2. Set title: ' + PAGE_TITLE);
    console.log('3. Set slug: ' + PAGE_SLUG);
    console.log('4. Switch to Code Editor (Ctrl+Shift+Alt+M)');
    console.log('5. Paste the content from the saved file');
    console.log('6. Switch back to Visual Editor');
    console.log('7. Set SEO title: עורך דין פלילי | מדריך משפט פלילי, חקירה, מעצר וכתב אישום | Jus-Tice');
    console.log('8. Set meta description: מדריך מקיף למשפט פלילי - חקירה, מעצר, כתב אישום, רישום פלילי. מה הזכויות שלכם? מתי צריך עורך דין?');
    console.log('9. SAVE AS DRAFT — do not publish yet');
    console.log('10. Preview and check mobile');
    return;
  }

  // Try creating via REST API
  console.log('Creating draft page via REST API...');
  
  const result = await post('/wp-json/wp/v2/pages', {
    title: PAGE_TITLE,
    slug: PAGE_SLUG,
    content: PAGE_CONTENT,
    status: 'draft',
    meta: {
      _yoast_wpseo_title: 'עורך דין פלילי | מדריך משפט פלילי, חקירה, מעצר וכתב אישום | Jus-Tice',
      _yoast_wpseo_metadesc: 'מדריך מקיף למשפט פלילי בישראל — חקירה במשטרה, זכויות נחקר, מעצר, כתב אישום, רישום פלילי. מה הזכויות שלכם? מתי צריך עורך דין פלילי?',
    },
  }, AUTH_HEADER);

  if (result.status === 201) {
    console.log('✅ DRAFT CREATED SUCCESSFULLY!');
    console.log(`   Page ID: ${result.data.id}`);
    console.log(`   Link: ${result.data.link}`);
    console.log(`   Status: ${result.data.status}`);
    console.log(`   Slug: ${result.data.slug}`);
    console.log('\n   NEXT: Preview in WP Admin and get owner approval before publishing.');
  } else {
    console.log(`❌ Creation failed: HTTP ${result.status}`);
    console.log(result.data ? JSON.stringify(result.data, null, 2).slice(0, 500) : result.raw);
    console.log('\nFallback: Create manually in WP Admin (see instructions above).');
    
    // Still save content file
    const contentFile = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 
      'content-master', 'clusters', 'criminal-law', 'criminal-law-pillar-page-content.html');
    fs.writeFileSync(contentFile, PAGE_CONTENT, 'utf8');
    console.log(`Content saved to: ${contentFile}`);
  }
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
