/**
 * Publish About page + Editorial Policy page for E-E-A-T site-level signals.
 * Per SQRG: YMYL legal sites MUST have About + editorial policy to avoid "Lowest" rating.
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
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch(e) { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function upsert(slug, payload) {
  const find = await wpRequest('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  const existing = Array.isArray(find.body) ? find.body[0] : null;
  if (existing) {
    console.log(`Updating /${slug}/ (ID ${existing.id})`);
    const r = await wpRequest('POST', `/wp-json/wp/v2/pages/${existing.id}`, payload);
    console.log(`  → HTTP ${r.status} | ${r.body?.link}`);
    return r;
  } else {
    console.log(`Creating /${slug}/`);
    const r = await wpRequest('POST', '/wp-json/wp/v2/pages', payload);
    console.log(`  → HTTP ${r.status} | ${r.body?.link}`);
    return r;
  }
}

const ABOUT_CONTENT = `<!-- wp:heading -->
<h2>אודות Jus-Tice — פורטל משפטי ישראלי</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Jus-Tice (jus-תice.co.il) הוא פורטל המידע המשפטי הגדול בישראל לציבור הרחב. אנו מחברים בין אנשים שזקוקים לעזרה משפטית לבין עורכי דין מוסמכים — תוך מתן מידע מהימן, עדכני ומקצועי על זכויות, הליכים, עלויות ומסלולים משפטיים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>המשימה שלנו</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>אנו מאמינים שלכל אדם מגיעה גישה למידע משפטי איכותי בעברית. המידע המשפטי בישראל פזור, טכני ולעיתים קרובות לא נגיש לציבור הרחב. Jus-Tice נוצר כדי לשנות זאת: אנחנו לא משרד עורכי דין — אנחנו פלטפורמה שמביאה את המידע אליך.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>הצוות שלנו</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>עו"ד מאיה רוטנברג — דיני משפחה וגירושין</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>עורכת דין מוסמכת בעלת ניסיון של מעל 10 שנים בדיני משפחה, גירושין, מזונות, משמורת ילדים וחלוקת רכוש. חברה בלשכת עורכי הדין בישראל. בוגרת הפקולטה למשפטים. כותבת ומבקרת את כלל התוכן בתחום דיני משפחה ב-Jus-Tice.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>עו"ד שרון נהרי — משפט פלילי</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>עורך דין פלילי מוסמך עם ניסיון של מעל 12 שנים בהגנה פלילית, עבירות כלכליות וצווארון לבן, חקירות משטרתיות וייצוג בבתי משפט. חבר בלשכת עורכי הדין בישראל. בוגר הפקולטה למשפטים. כותב ומבקר את כלל התוכן הפלילי ב-Jus-Tice.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>מה אנחנו מציעים</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li><strong>מדריכים משפטיים</strong> — מאמרים מקיפים על כל תחום משפטי, כתובים בשפה נגישה ומבוססים על החקיקה הישראלית העדכנית</li>
<li><strong>מחשבונים</strong> — כלים פרקטיים כמו מחשבון מזונות ילדים (הלכת 919/15)</li>
<li><strong>פסיקה ותקדימים</strong> — ניתוח פסיקה עדכנית מבתי המשפט בישראל</li>
<li><strong>חיבור לעורכי דין</strong> — מערכת להצגת עורכי דין מוסמכים בכל תחום ואזור</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>תחומי התמחות</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li><a href="/family-law/">דיני משפחה וגירושין</a> — גירושין, מזונות, משמורת, הסכמי ממון</li>
<li><a href="/criminal-defense-attorney/">משפט פלילי</a> — הגנה פלילית, חקירות, עבירות כלכליות</li>
<li><a href="/medical-malpractice-lawyer/">רשלנות רפואית</a> — תביעות, פיצויים, חוות דעת מומחה</li>
<li><a href="/real-estate-lawyer-guide/">מקרקעין ונדל"ן</a> — עסקאות נדל"ן, חוזים, מיסים</li>
<li><a href="/inheritance-lawyer/">ירושה וצוואות</a> — צוואות, ירושה, ניהול עיזבון</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>הצהרה משפטית</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>המידע ב-Jus-Tice מיועד למטרות מידע כללי בלבד ואינו מהווה ייעוץ משפטי פרסונלי. כל מקרה משפטי שונה בנסיבותיו. אנו ממליצים תמיד להתייעץ עם עורך דין מוסמך לפני קבלת כל החלטה משפטית.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>יצירת קשר:</strong> לשאלות ובירורים, צרו קשר דרך <a href="/contact/">טופס יצירת קשר</a>.</p>
<!-- /wp:paragraph -->`;

const EDITORIAL_CONTENT = `<!-- wp:heading -->
<h2>מדיניות עריכה של Jus-Tice</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Jus-Tice מחויב לסטנדרטים המחמירים ביותר של דיוק, שקיפות ואמינות בתוכן משפטי. מדיניות עריכה זו מסבירה כיצד אנו יוצרים, בודקים ומעדכנים את התוכן שלנו.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>עקרונות הכתיבה שלנו</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li><strong>מבוסס על חקיקה ישראלית</strong> — כל מאמר מסתמך על החוקים הרלוונטיים (כנסת, נבו, תקסיר) ועל פסיקה עדכנית של בתי המשפט בישראל</li>
<li><strong>מדויק ועדכני</strong> — אנחנו מעדכנים תוכן בעקבות שינויי חקיקה, פסיקות חדשות ותקדימים משפטיים</li>
<li><strong>נגיש לציבור</strong> — השפה פשוטה ובהירה, ללא ז'רגון משפטי מיותר, עם הסברים מעמיקים של מונחים</li>
<li><strong>מאוזן ואובייקטיבי</strong> — אנחנו מציגים את מלוא התמונה, לרבות מגבלות ואי-ודאויות</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>תהליך הכתיבה והביקורת</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>שלב 1: מחקר</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כל מאמר מתחיל במחקר מעמיק: קריאת החקיקה הרלוונטית, עיון בפסיקה עדכנית, ניתוח נתונים רשמיים (משרד המשפטים, הנהלת בתי המשפט, משרד הבריאות), ובחינת הנחיות פרקליטות המדינה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שלב 2: כתיבה</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>התוכן נכתב על ידי צוות הכותבים שלנו בשיתוף עם עורכי הדין המוסמכים שלנו. כל עובדה, נתון ומספר מתוייגים למקור אמין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שלב 3: ביקורת משפטית</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כל מאמר עובר ביקורת מקצועית על ידי עורך דין מוסמך בתחום הרלוונטי:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><strong>דיני משפחה וגירושין</strong> — ע"י עו"ד מאיה רוטנברג, בעלת ניסיון 10+ שנים</li>
<li><strong>משפט פלילי</strong> — ע"י עו"ד שרון נהרי, בעל ניסיון 12+ שנים</li>
<li><strong>תחומים נוספים</strong> — ע"י צוות עורכי דין מוסמכים בעלי ניסיון רלוונטי</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>שלב 4: פרסום ועדכון</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לאחר אישור ביקורת, המאמר מפורסם עם תאריך פרסום ותאריך עדכון אחרון. אנחנו מעדכנים תוכן ב:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>כל שינוי בחקיקה הרלוונטית (תיקון חוק, תקנות חדשות)</li>
<li>פסיקות תקדימיות חדשות של בית המשפט העליון</li>
<li>שינויים במדיניות של גופים ממשלתיים</li>
<li>ביקורת תקופתית — לפחות אחת לשנה לכל תוכן</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>מדיניות מקורות</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>אנחנו מסתמכים אך ורק על מקורות ראשוניים ואמינים:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li><a href="https://www.nevo.co.il" rel="noopener noreferrer" target="_blank">נבו — מאגר החקיקה הישראלי</a></li>
<li><a href="https://www.knesset.gov.il" rel="noopener noreferrer" target="_blank">אתר הכנסת</a></li>
<li><a href="https://www.gov.il/he/departments/ministry_of_justice" rel="noopener noreferrer" target="_blank">משרד המשפטים</a></li>
<li><a href="https://www.israelbar.org.il" rel="noopener noreferrer" target="_blank">לשכת עורכי הדין בישראל</a></li>
<li>הנהלת בתי המשפט — נתונים סטטיסטיים</li>
<li>דוחות שנתיים של פרקליטות המדינה</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>מדיניות פרסום ועורכי דין</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Jus-Tice מאפשר לעורכי דין מוסמכים להירשם ולהופיע במאגר שלנו. <strong>עורכי הדין המופיעים ברשימות שלנו לא משפיעים על עצמאות התוכן העריכאי שלנו.</strong> אנחנו שומרים על הפרדה מוחלטת בין תוכן עריכאי לפרסום.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>לשאלות על מדיניות עריכה זו, צרו קשר: <a href="/contact/">טופס יצירת קשר</a>.</p>
<!-- /wp:paragraph -->`;

async function main() {
  console.log('Publishing About + Editorial Policy pages...\n');

  await upsert('about', {
    title: 'אודות Jus-Tice | פורטל משפטי ישראלי — צוות, ייעוד ועקרונות',
    slug: 'about',
    content: ABOUT_CONTENT,
    status: 'publish',
    meta: {
      seo_title: 'אודות Jus-Tice | פורטל משפטי ישראלי — צוות, ייעוד ועקרונות',
      seo_description: 'Jus-Tice הוא פורטל המידע המשפטי הגדול בישראל. כל התוכן נכתב ונסקר על ידי עורכי דין מוסמכים — מאיה רוטנברג (משפחה) ושרון נהרי (פלילי). חברי לשכת עורכי הדין.',
    }
  });

  await upsert('editorial-policy', {
    title: 'מדיניות עריכה | כיצד אנו יוצרים ומבקרים תוכן משפטי | Jus-Tice',
    slug: 'editorial-policy',
    content: EDITORIAL_CONTENT,
    status: 'publish',
    meta: {
      seo_title: 'מדיניות עריכה | כיצד אנו יוצרים ומבקרים תוכן משפטי | Jus-Tice',
      seo_description: 'מדיניות העריכה של Jus-Tice: תהליך כתיבה, ביקורת על ידי עורכי דין מוסמכים, מקורות ראשוניים ועדכון תוכן. סטנדרטים YMYL לתוכן משפטי.',
    }
  });

  console.log('\n✅ About + Editorial Policy pages published');
}

main().catch(console.error);
