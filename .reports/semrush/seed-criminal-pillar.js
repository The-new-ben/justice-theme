/**
 * Criminal Defense Attorney Pillar — Content Seeder
 * Publishes/updates the /criminal-defense-attorney/ page with full SEO content.
 * Run once via: node reports/semrush/seed-criminal-pillar.js
 *
 * Content strategy based on:
 * - flanter-law.co.il: 7,720 words, #1 ranking, FAQPage + AggregateRating + Article schema
 * - dok.co.il: 4,832 words, 20 H2s, FAQPage, deep topical coverage
 * - lawreviews.co.il: CollectionPage + LegalService + "603 חוות דעת" trust signal
 * Target keyword: עורך דין פלילי (3,600/mo, KD 42)
 * Secondary: עורך דין פלילי מומלץ (1,000/mo), עורך דין פלילי בתל אביב (880/mo)
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

// =============================================================================
// CRIMINAL DEFENSE PILLAR — Full Content (Hebrew, competitor-matched depth)
// Based on: flanter (7,720w), dok (4,832w, 20 H2s), lawreviews directory model
// =============================================================================
const CRIMINAL_PILLAR_CONTENT = `<!-- wp:heading {"level":1} -->
<h1>עורך דין פלילי מומלץ — מצא את הייצוג הנכון לתיקך</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"pillar-intro"} -->
<p>כשמדובר בחקירה משטרתית, מעצר, כתב אישום או ערעור פלילי — בחירת עורך דין פלילי נכון יכולה לקבוע את גורלך. פורטל ג'סטיס מרכז את המדריך המקיף ביותר בישראל לבחירת עורך דין פלילי: מה הוא עושה, כמה הוא עולה, איך בוחרים נכון, ומי הם עורכי הדין הפליליים המומלצים ביותר בכל רחבי הארץ.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה עושה עורך דין פלילי?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>עורך דין פלילי הוא עורך דין המתמחה בייצוג חשודים ונאשמים בהליכים פליליים — מרגע החקירה במשטרה ועד לגזר הדין, ואם נדרש, בערעור לבית המשפט העליון. בניגוד למה שרבים חושבים, עורך דין פלילי אינו "מגן על עבריינים" — הוא מבטיח שהמדינה תוכיח את האשמה מעל לכל ספק סביר, ושזכויות הנאשם תכובדנה לאורך כל ההליך.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>תפקידי עורך הדין הפלילי כוללים:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>ייעוץ בחקירה</strong> — נוכחות בחקירה פולישית, הדרכה על זכות השתיקה, מניעת הפללה עצמית</li>
<li><strong>ייצוג בדיוני מעצר</strong> — כנגד מעצר ימים, מעצר עד תום ההליכים, בקשות ערבות</li>
<li><strong>ניהול משא ומתן</strong> — עם התביעה לקראת עסקת טיעון, הפחתת אישומים, סגירת תיק</li>
<li><strong>ייצוג בבית המשפט</strong> — בכל שלבי ההליך הפלילי, חקירת עדים, סיכומים</li>
<li><strong>ערעור</strong> — ערעור על הכרעת הדין ו/או גזר הדין לבית המשפט המחוזי ולעליון</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>מתי חייבים לשכור עורך דין פלילי?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בישראל, אין חובה חוקית לייצוג על ידי עורך דין פלילי בכל שלב — אך בפועל, ביצוע הגנה עצמית בהליך פלילי היא טעות כמעט תמיד. שכירת עורך דין פלילי הכרחית במצבים הבאים:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>הוזמנת לחקירה במשטרה</strong> — אפילו כ"עד", ייתכן שאתה חשוד. אל תגיע ללא ייעוץ.</li>
<li><strong>נעצרת</strong> — מרגע המעצר יש לך זכות לעורך דין. השתמש בה.</li>
<li><strong>הוגש נגדך כתב אישום</strong> — ייצוג מקצועי הוא חיוני. לא תוכל להתמודד לבד עם תביעה ממלכתית.</li>
<li><strong>עבירות חמורות</strong> — עבירות מין, עבירות אלימות, עבירות כלכליות, סמים — ייצוג פלילי מנוסה הכרחי.</li>
<li><strong>נהיגה בשכרות</strong> — נקודות, פסילה, קנסות גבוהים — עורך דין יכול להפחית משמעותית את העונש.</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>שלבי ההליך הפלילי בישראל — מהחקירה עד גזר הדין</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הבנת שלבי ההליך הפלילי תסייע לך לפעול נכון בכל שלב ולהבין מה עורך הדין שלך עושה:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>חקירה (Investigation)</strong> — המשטרה גובה עדות, מבצעת מעקב, עיון במסמכים. בשלב זה עורך הדין מייעץ ומלווה לחקירה.</li>
<li><strong>מעצר (Arrest)</strong> — ניתן להיעצר ל-24 שעות ללא צו שיפוטי. הארכת מעצר מצריכה אישור שופט. עורך הדין מייצג בדיון המעצר.</li>
<li><strong>כתב אישום (Indictment)</strong> — התביעה מגישה כתב אישום. הנאשם מתבקש להתייצב לבית המשפט. שמיעת ראיות מתחילה.</li>
<li><strong>שמיעת ראיות (Trial)</strong> — התביעה מביאה עדים, עורך הדין חוקר אותם נגדית. ההגנה מביאה עדיה.</li>
<li><strong>הכרעת דין (Verdict)</strong> — השופט מכריע אשמה/זיכוי. ניתן לערער תוך 45 יום.</li>
<li><strong>גזר הדין (Sentence)</strong> — בעקבות הרשעה. עורך הדין מגיש בקשות להקלת עונש, עבודות שירות, מאסר על תנאי.</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>סוגי עבירות פליליות — לאיזה עורך דין לפנות?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לא כל עורך דין פלילי מתמחה בכל סוג עבירה. להלן הסוגים העיקריים ומה לחפש:</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>עבירות אלימות</h3>
<!-- /wp:heading -->
<p>תקיפה, אינוס, הריגה, רצח — עבירות חמורות הדורשות עורך דין פלילי בעל ניסיון בתיקי אלימות. חפש ניסיון ספציפי בעבירות אלימות, לא רק "עורך דין פלילי כללי".</p>

<!-- wp:heading {"level":3} -->
<h3>עבירות כלכליות ומרמה</h3>
<!-- /wp:heading -->
<p>מעילה, הונאה, עבירות מס, הלבנת הון — מצריכות עורך דין פלילי שמכיר את הדין הפיננסי ואת עבודת המנהלים הכלכליים בתיקים אלה. תיקים כאלה מורכבים, ארוכים ומחייבים הכנה מקצועית יסודית.</p>

<!-- wp:heading {"level":3} -->
<h3>עבירות סמים</h3>
<!-- /wp:heading -->
<p>החזקת סם, סחר בסם, יבוא — עורך דין פלילי הבקיא בפסיקה בתיקי סמים עשוי לסייע בהפחתת אישומים, טיפול ב"כניסה להסדר טיפול" במקום כלא, ופתרון חסר עבר פלילי.</p>

<!-- wp:heading {"level":3} -->
<h3>עבירות מין</h3>
<!-- /wp:heading -->
<p>אלה מהתיקים הרגישים ביותר — עם השפעה עצומה על המוניטין, התא המשפחתי והקריירה. עורך דין פלילי המתמחה בעבירות מין יתייחס לרגישות הייחודית ויבנה הגנה מבוססת ראיות.</p>

<!-- wp:heading {"level":3} -->
<h3>תאונות דרכים ועבירות תנועה</h3>
<!-- /wp:heading -->
<p>נהיגה בשכרות, נהיגה ללא רישיון, גרם מוות ברשלנות — גם בתחום זה, עורך דין פלילי מנוסה יכול לעיתים קרובות להפחית את הסנקציות הפליליות והמנהליות.</p>

<!-- wp:heading {"level":3} -->
<h3>מחיקת כתב אישום וביטול תיק</h3>
<!-- /wp:heading -->
<p>גם לאחר הגשת כתב אישום, ניתן לעיתים לבקש מחיקתו על בסיס פגמים פרוצדורליים, ראיות שהתקבלו שלא כדין, או בסיום הסדר מותנה.</p>

<!-- wp:heading -->
<h2>עורך דין פלילי לפי אזור — כל הארץ מכוסה</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>פורטל ג'סטיס כולל עורכי דין פליליים מובילים בכל רחבי ישראל:</p>
<!-- /wp:paragraph -->

<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<h3>מרכז</h3>
<ul>
<li><a href="/criminal-defense-tel-aviv/">עורך דין פלילי תל אביב</a></li>
<li><a href="/criminal-defense-ramat-gan/">עורך דין פלילי רמת גן</a></li>
<li><a href="/criminal-defense-petah-tikva/">עורך דין פלילי פתח תקווה</a></li>
<li><a href="/criminal-defense-rishon/">עורך דין פלילי ראשון לציון</a></li>
</ul>
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<h3>צפון</h3>
<ul>
<li><a href="/criminal-defense-haifa/">עורך דין פלילי חיפה</a></li>
<li><a href="/criminal-defense-north/">עורך דין פלילי בצפון</a></li>
<li><a href="/criminal-defense-nazareth/">עורך דין פלילי נצרת</a></li>
</ul>
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<h3>דרום</h3>
<ul>
<li><a href="/criminal-defense-beer-sheva/">עורך דין פלילי באר שבע</a></li>
<li><a href="/criminal-defense-south/">עורך דין פלילי בדרום</a></li>
<li><a href="/criminal-defense-ashdod/">עורך דין פלילי אשדוד</a></li>
</ul>
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:heading -->
<h2>כמה עולה עורך דין פלילי? (מחירים ועלויות 2025)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>שכר הטרחה של עורך דין פלילי בישראל תלוי במספר גורמים: חומרת העבירה, שלב בו נכנס עורך הדין, ניסיון עורך הדין, ומורכבות התיק. להלן טווחי המחירים הנפוצים:</p>
<!-- /wp:paragraph -->

<!-- wp:table -->
<figure class="wp-block-table">
<table>
<thead><tr><th>שלב / סוג ייצוג</th><th>טווח מחירים</th></tr></thead>
<tbody>
<tr><td>ייעוץ ראשוני (שעה)</td><td>₪300 – ₪600</td></tr>
<tr><td>ליווי לחקירה בלבד</td><td>₪2,000 – ₪5,000</td></tr>
<tr><td>ייצוג בדיון מעצר ימים</td><td>₪3,000 – ₪8,000</td></tr>
<tr><td>ייצוג מלא בתיק עבירה קלה</td><td>₪5,000 – ₪15,000</td></tr>
<tr><td>ייצוג מלא בתיק עבירה בינונית</td><td>₪15,000 – ₪40,000</td></tr>
<tr><td>ייצוג מלא בתיק עבירה חמורה</td><td>₪40,000 – ₪150,000+</td></tr>
<tr><td>ערעור לבית המשפט המחוזי</td><td>₪15,000 – ₪40,000</td></tr>
</tbody>
</table>
</figure>
<!-- /wp:table -->

<!-- wp:paragraph -->
<p><strong>האם שכר הטרחה מגלם את כישרון עורך הדין?</strong> לא בהכרח. מחיר גבוה לא תמיד מבטיח איכות, ומחיר נמוך לא תמיד מסמן חוסר מקצועיות. חפש ניסיון ספציפי בסוג התיק שלך, לא רק מחיר.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>איך לבחור עורך דין פלילי — 7 קריטריונים מכריעים</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בחירת עורך דין פלילי היא אחת ההחלטות החשובות בחייך. הנה 7 קריטריונים שכל מי שמחפש עורך דין פלילי צריך לבדוק:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>ניסיון בסוג התיק שלך</strong> — שאל ישירות: כמה תיקים דומים ניהלת? מה הייתה התוצאה?</li>
<li><strong>היכרות עם בית המשפט</strong> — עורך דין פלילי שמכיר את השופטים המקומיים ואת סגנון העבודה של הפרקליטות המקומית — יתרון עצום.</li>
<li><strong>זמינות</strong> — ייצוג פלילי מחייב זמינות 24/7. האם עורך הדין יענה לשיחות בלילה? בסוף שבוע?</li>
<li><strong>שיפוט ריאלי</strong> — עורך דין טוב יגיד לך את האמת על סיכוייך, לא ייתן הבטחות שווא.</li>
<li><strong>קשרים ורקע</strong> — לשעבר פרקליט, קצין משטרה, עובד שירות ביטחון — רקע כזה עשוי לתת יתרון בהבנת חשיבת התביעה.</li>
<li><strong>חוות דעת לקוחות</strong> — חפש ביקורות אמיתיות מלקוחות קודמים, לא רק ב"ספר הכסף".</li>
<li><strong>שקיפות במחיר</strong> — עורך דין ישר יציג חוזה שכר טרחה ברור, ללא "הפתעות" בהמשך.</li>
</ol>
<!-- /wp:list -->

<!-- wp:heading -->
<h2>עורכי דין פליליים מובילים בישראל</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>פורטל ג'סטיס מרכז עורכי דין פליליים מנוסים ומוכרים בכל רחבי ישראל. כל עורך דין עובר תהליך אימות ובדיקה לפני הכללתו בפורטל.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[justice_lawyer_listing practice_area="criminal-defense" show_rating="true" limit="6"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p><a href="/lawyers/?area=criminal-law">ראה את כל עורכי הדין הפליליים בפורטל ←</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>שאלות נפוצות על עורך דין פלילי</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>האם חייב להיות לי עורך דין פלילי?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>בישראל, אין חובה חוקית לייצוג בכל שלב, אך ביצוע הגנה עצמית בהליך פלילי הוא סיכון קיצוני. מומלץ מאוד לשכור עורך דין פלילי בכל מקרה שיש בו אפשרות להגשת כתב אישום, מעצר, או עונש של מאסר.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה עולה עורך דין פלילי?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>שכר הטרחה נע בין ₪3,000 לייעוץ בסיסי ועד ₪150,000+ לתיקים חמורים ומורכבים. הגורמים העיקריים: חומרת העבירה, שלב ההליך ומוניטין עורך הדין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה ההבדל בין עורך דין פלילי לפרקליט?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>פרקליט (תובע) הוא עורך דין ממלכתי שמייצג את המדינה ומגיש כתב האישום. עורך הדין הפלילי מייצג את הנאשם (ההגנה). בישראל, פרקליטות המדינה היא הגוף שמביא תיקים חמורים לבתי משפט.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה עושים כשמוזמנים לחקירה במשטרה?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>ראשית — אל תגיע לבד. פנה לעורך דין פלילי לפני ההגעה לתחנה. זכרו: יש לך זכות לשתוק. אתה לא חייב לענות על שאלות שעלולות להפליל אותך. עורך הדין ילווה אותך ויסייע להגן על זכויותיך.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה זמן נמשך הליך פלילי?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>משך ההליך הפלילי תלוי במורכבות התיק: מכמה שבועות (תיקים קלים) ועד מספר שנים (תיקים מורכבים עם עדים רבים). חוק סדר הדין הפלילי קובע לוחות זמנים, אך בפועל תיקים מורכבים מתמשכים הרבה יותר.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם אפשר לקבל ייעוץ ראשוני חינם?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>חלק מעורכי הדין הפליליים מציעים ייעוץ ראשוני ללא תשלום. בפורטל ג'סטיס תוכל לסנן עורכי דין שמציעים ייעוץ חינם ולפנות ישירות אליהם.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה ההבדל בין עורך דין פלילי לעורך דין נזיקין?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>עורך דין פלילי מייצג בהליכים פליליים (מול מדינת ישראל). עורך דין נזיקין מייצג בתביעות אזרחיות על נזקים גוף/רכוש. לעיתים מקרה אחד (כמו תאונת דרכים) דורש גם ייצוג פלילי וגם תביעה נזיקית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מה זה מחיקת רישום פלילי?</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>מחיקת רישום פלילי היא הליך משפטי שבו מבקשים ממשטרת ישראל למחוק את הרישום הפלילי מתיק התיקים המשטרתי. ניתן לבקש מחיקה לאחר 7 שנים ממועד סיום ריצוי העונש. <a href="/police-records-data-deletion/">קרא עוד על מחיקת רישום פלילי ←</a></p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr/>
<!-- /wp:separator -->

<!-- wp:paragraph {"className":"pillar-cta"} -->
<p><strong>זקוק לעורך דין פלילי עכשיו?</strong> השאר פרטים ומומחה מפורטל ג'סטיס יחזור אליך תוך שעה.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[justice_contact_form type="criminal" urgent="true"]
<!-- /wp:shortcode -->`;

const CRIMINAL_PILLAR_META = {
  title: 'עורך דין פלילי מומלץ | השוואת עו"ד לפי ביקורות | Jus-Tice',
  slug: 'criminal-defense-attorney',
  content: CRIMINAL_PILLAR_CONTENT,
  status: 'publish',
  meta: {
    seo_title: 'עורך דין פלילי מומלץ | השוואת עו"ד לפי ביקורות | Jus-Tice',
    seo_description: 'מצא עורך דין פלילי מומלץ בישראל — השוואת עורכי דין לפי ביקורות לקוחות, מחירים, התמחות ואזור. חקירה, מעצר, כתב אישום, עבירות אלימות, כלכלה, סמים ועוד.',
    pillar_keyword: 'עורך דין פלילי',
    pillar_cluster: 'משפט פלילי',
    pillar_lawyer_area: 'criminal-defense',
  }
};

async function updateCriminalPillar() {
  console.log('Finding criminal defense pillar page...');

  // Find the page by slug
  const find = await wpRequest('GET', '/wp-json/wp/v2/pages?slug=criminal-defense-attorney&status=any&per_page=3');
  if (!find.body || !Array.isArray(find.body) || find.body.length === 0) {
    console.log('Page not found — creating new page');
    const create = await wpRequest('POST', '/wp-json/wp/v2/pages', {
      title: CRIMINAL_PILLAR_META.title,
      slug: CRIMINAL_PILLAR_META.slug,
      content: CRIMINAL_PILLAR_META.content,
      status: 'publish',
      meta: CRIMINAL_PILLAR_META.meta,
    });
    console.log('Created:', create.status, create.body?.link);
    return;
  }

  const page = find.body[0];
  console.log(`Found page ID ${page.id} | status: ${page.status} | link: ${page.link}`);

  // Update with new content
  const update = await wpRequest('POST', `/wp-json/wp/v2/pages/${page.id}`, {
    title: CRIMINAL_PILLAR_META.title,
    content: CRIMINAL_PILLAR_META.content,
    status: 'publish',
    meta: CRIMINAL_PILLAR_META.meta,
  });

  console.log('Updated:', update.status, '| New link:', update.body?.link);
  console.log('Title:', update.body?.title?.rendered);

  // Also update Yoast meta via custom endpoint if available
  const yoastUpdate = await wpRequest('POST', `/wp-json/wp/v2/pages/${page.id}`, {
    yoast_meta: {
      yoast_wpseo_title: CRIMINAL_PILLAR_META.meta.seo_title,
      yoast_wpseo_metadesc: CRIMINAL_PILLAR_META.meta.seo_description,
      yoast_wpseo_focuskw: 'עורך דין פלילי',
    }
  });
  console.log('Yoast update attempt:', yoastUpdate.status);
}

updateCriminalPillar().catch(console.error);
