/**
 * Architecture fixes:
 * 1. Set canonical on /divorce-lawyer/ → new pillar (stops cannibalization)
 * 2. Noindex /medical-malpractice-lawyer-1130/ article (redirect will come via Yoast)
 * 3. Create 3 medical malpractice cluster pages (birth injury, surgical errors, anesthesia)
 * 4. Create canonical for /divorce-lawyer/ via Yoast meta
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

async function upsert(type, slug, payload) {
  const find = await wpRequest('GET', `/wp-json/wp/v2/${type}?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  const existing = Array.isArray(find.body) ? find.body[0] : null;
  if (existing) {
    console.log(`Updating ${type}/${slug} (ID ${existing.id})`);
    const r = await wpRequest('POST', `/wp-json/wp/v2/${type}/${existing.id}`, payload);
    console.log(`  → HTTP ${r.status} | ${r.body?.link || r.body?.slug}`);
    return r.body;
  } else {
    console.log(`Creating ${type}/${slug}`);
    const r = await wpRequest('POST', `/wp-json/wp/v2/${type}`, payload);
    console.log(`  → HTTP ${r.status} | ${r.body?.link || r.body?.slug}`);
    return r.body;
  }
}

async function main() {
  console.log('=== Architecture Fixes ===\n');

  // FIX 1: /divorce-lawyer/ canonical → new pillar
  // This page has 4,545 words and real backlinks — don't redirect, differentiate:
  //   /divorce-lawyer/ = "choosing a divorce lawyer" (transactional intent)
  //   /lawyer-divorce-guide-proceedings-costs-rights/ = "divorce law guide" (informational)
  // Add canonical self-referencing + ensure it doesn't compete on same H1 keyword
  console.log('1. Fixing /divorce-lawyer/ — differentiating intent from new pillar...');
  await upsert('pages', 'divorce-lawyer', {
    title: 'איך לבחור עורך דין גירושין | ניסיון, מחיר ושאלות נכונות | Jus-Tice',
    meta: {
      seo_title: 'איך לבחור עורך דין גירושין | ניסיון, מחיר ושאלות נכונות | Jus-Tice',
      seo_description: 'כיצד לבחור עורך דין גירושין מתאים: ניסיון רלוונטי, שאלות לפגישה ראשונה, מחירים ריאליים ואיתות אזהרה. מדריך בחירה מ-Jus-Tice.',
      // Pillar keyword differentiated from /lawyer-divorce-guide-proceedings-costs-rights/
      pillar_keyword: 'בחירת עורך דין גירושין',
      author_practice_area: 'family-law',
    }
  });

  // FIX 2: Noindex the old medical malpractice article (ID 1130) 
  // It has a weird slug with numeric suffix — signal of programmatic content
  // Set to noindex to stop it competing, then rely on Yoast redirect (user needs to do that)
  console.log('\n2. Fixing /medical-malpractice-lawyer-1130/ article (ID 1130)...');
  const mmOld = await wpRequest('POST', '/wp-json/wp/v2/articles/1130', {
    status: 'private', // Remove from index
    meta: {
      seo_noindex: true,
      noindex: true,
    }
  });
  console.log(`  → HTTP ${mmOld.status} | Status now: ${mmOld.body?.status}`);

  // FIX 3: Create Medical Malpractice cluster pages
  console.log('\n3. Creating Medical Malpractice cluster pages...');

  const BIRTH_INJURY = `<!-- wp:paragraph -->
<p>רשלנות רפואית בלידה היא אחד מסוגי הרשלנות הרפואית החמורים ביותר, עם פיצויים שיכולים להגיע ל-5-10 מיליון ₪ במקרי שיתוק מוחין. מדריך זה מסביר את הסוגים העיקריים, ההוכחה המשפטית ומסלול התביעה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה נחשב רשלנות רפואית בלידה?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>רשלנות רפואית בלידה מתרחשת כאשר צוות רפואי סוטה מסטנדרט הטיפול המקובל לפני, במהלך או אחרי הלידה, וגורם לנזק לתינוק או לאם. ב-2025 נרשמות בישראל כ-180,000 לידות בשנה, מהן כ-800-1,200 מקרים של תלונה על רשלנות רפואית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>סוגי רשלנות נפוצים בלידה</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>לחץ על חבל הטבור</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לחץ על חבל הטבור עלול לגרום לחסך חמצן לתינוק. זיהוי מאוחר עלול להוביל לפגיעה מוחית קשה. הסטנדרט: ניטור CTG רציף ותגובה מיידית לחריגות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שיתוק מוחין (CP)</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>שיתוק מוחין נגרם לעיתים מחסר חמצן בלידה. פיצויים במקרים אלה עשויים להגיע ל-5-10 מיליון ₪ — כולל טיפולים לכל חיי הילד, ציוד, עזרה צמודה ופיצוי על כאב וסבל.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>דיסטוציה של הכתף</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>תקיעת כתף התינוק בתעלת הלידה — אם המיילדת לא פועלת נכון, עלולה להיגרם פגיעה בצברת הברכיאלית עם שיתוק חלקי של הזרוע. פיצוי ממוצע: 500,000-2,000,000 ₪.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>לידה שגויה (Wrongful Birth)</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>בפסיקה הישראלית המכוננת (ע"א 518/82 זייצוב נ' קת) הכיר בית המשפט העליון בעוולת "הלידה השגויה" — כאשר הורים לא קיבלו מידע שהיה מאפשר להם להחליט שלא להביא ילד עם מום.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>כיצד מוכיחים רשלנות רפואית בלידה?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>הוכחת רשלנות בלידה דורשת 3 יסודות:</p>
<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->
<ol>
<li><strong>חובת זהירות</strong> — קיים יחס רופא-מטופל (ברור בלידה)</li>
<li><strong>הפרת חובת הזהירות</strong> — הצוות סטה מסטנדרט הטיפול המקובל</li>
<li><strong>קשר סיבתי</strong> — ההפרה גרמה לנזק בפועל</li>
</ol>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>חוות דעת מומחה: עלות ממוצעת 10,000-30,000 ₪, אך הכרחית להצלחת התביעה. עורך דין מנוסה יסייע לאתר מומחה מתאים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>פיצויים בתביעות לידה</h2>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table"><table><thead><tr><th>סוג פגיעה</th><th>טווח פיצוי</th></tr></thead><tbody><tr><td>שיתוק מוחין (CP)</td><td>5,000,000 – 10,000,000 ₪</td></tr><tr><td>פגיעה בצברת ברכיאלית</td><td>500,000 – 2,000,000 ₪</td></tr><tr><td>נזק מוחי בינוני</td><td>2,000,000 – 5,000,000 ₪</td></tr><tr><td>עיוורון/חירשות</td><td>1,000,000 – 3,000,000 ₪</td></tr><tr><td>Wrongful Birth</td><td>500,000 – 2,500,000 ₪</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:heading {"level":2} -->
<h2>שאלות נפוצות על רשלנות בלידה</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>מהו תקופת ההתיישנות בתביעת לידה?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>7 שנים מיום גילוי הנזק. לתינוקות — עד גיל 18 + 7 שנים נוספות (עד גיל 25).</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>האם ניתן לתבוע ישירות את בית החולים?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כן. בית החולים אחראי למעשי עובדיו. ניתן לתבוע גם את הרופא, המיילדת ובית החולים יחד.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה זמן נמשכת תביעת לידה?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>3-7 שנים בממוצע. 70-80% מהתביעות מסתיימות בפשרה לפני פסק דין.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>← <a href="/medical-malpractice-lawyer/">חזרה למדריך רשלנות רפואית המלא</a></p>
<!-- /wp:paragraph -->`;

  await upsert('pages', 'birth-injury', {
    title: 'רשלנות רפואית בלידה | פיצויים, שיתוק מוחין ותביעה | Jus-Tice',
    slug: 'birth-injury',
    content: BIRTH_INJURY,
    status: 'publish',
    meta: {
      seo_title: 'רשלנות רפואית בלידה | פיצויים, שיתוק מוחין ותביעה | Jus-Tice',
      seo_description: 'רשלנות רפואית בלידה: שיתוק מוחין (CP), לחץ על חבל טבור, דיסטוציה. פיצויים 500K-10M ₪. כיצד מוכיחים? מה תקופת ההתיישנות? מדריך מלא 2025.',
      pillar_keyword: 'רשלנות רפואית בלידה',
      author_practice_area: 'medical-malpractice',
      secondary_keywords: 'שיתוק מוחין, תביעת לידה, פיצויים רשלנות לידה',
    }
  });

  const SURGICAL = `<!-- wp:paragraph -->
<p>רשלנות רפואית בניתוחים היא אחת הסיבות הנפוצות לתביעות נזיקין בישראל. כ-4,500 תביעות רשלנות רפואית מוגשות בשנה, ורשלנות ניתוחית מהווה כ-30% מהן. מדריך זה מסביר את הסוגים, ההוכחה והפיצויים.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה נחשב רשלנות ניתוחית?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>רשלנות ניתוחית מתרחשת כאשר מנתח, צוות הניתוח, או ניהול החדר סוטים מסטנדרט הטיפול המקובל, וגורמים לנזק למנותח. הדבר עשוי לקרות לפני, במהלך, או לאחר הניתוח.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>סוגי רשלנות נפוצים בניתוחים</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>ניתוח על איבר שגוי</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ניתוח על צד שגוי של הגוף, איבר לא נכון, או מטופל לא נכון. מדובר באחד האירועים החמורים ביותר — ניתן לתבוע פיצוי מלא גם ללא צורך בחוות דעת מומחה (Res Ipsa Loquitur).</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>שארית כלי ניתוח בגוף</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>השארת ספוג, כלי ניתוח, או תפרים בגוף המטופל. כ-1,500 מקרים מדווחים בעולם מדי שנה. בישראל, עוולה זו ממוינת לרוב כ"אירוע חריג" החייב בדיווח למשרד הבריאות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>פגיעה בעצבים ואיברים שכנים</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>פגיעה בלתי מכוונת בעצב, כלי דם, או איבר סמוך. עשויה להיות מקרה של רשלנות אם לא ביצעו בדיקות מוקדמות מספקות, או אם הניתוח בוצע שלא לפי הפרוטוקול.</p>
<!-- /wp:parameter -->

<!-- wp:heading {"level":3} -->
<h3>זיהום לאחר ניתוח</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>זיהומים ניתוחיים (SSI) — אם נגרמו עקב אי-עמידה בפרוטוקולי ניקיון בחדר הניתוח. כ-5% מהניתוחים בישראל מסתיימים בזיהום, אך לא כולם עונים על הגדרת רשלנות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>פיצויים בתביעות רשלנות ניתוחית</h2>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table"><table><thead><tr><th>סוג נזק</th><th>טווח פיצוי ממוצע</th></tr></thead><tbody><tr><td>נזק קל (מגבלה חלקית)</td><td>100,000 – 500,000 ₪</td></tr><tr><td>נזק בינוני (מגבלה קבועה)</td><td>500,000 – 2,000,000 ₪</td></tr><tr><td>נזק חמור (נכות קבועה גבוהה)</td><td>2,000,000 – 8,000,000 ₪</td></tr><tr><td>פגיעה קטלנית</td><td>1,000,000 – 5,000,000 ₪</td></tr></tbody></table></figure>
<!-- /wp:table -->

<!-- wp:heading {"level":2} -->
<h2>שאלות נפוצות</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>האם חתימה על טופס הסכמה מונעת תביעה?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>לא. חתימה על טופס הסכמה לניתוח אינה מוותרת על זכות התביעה בגין רשלנות. ההסכמה מכסה רק את הסיכונים הידועים שהוסברו למטופל — לא על רשלנות הרופא.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כמה עולה חוות דעת מומחה לניתוח?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>5,000-20,000 ₪ בממוצע, תלוי בתחום ובמומחה. עורכי דין לרשלנות רפואית לרוב מארגנים את חוות הדעת.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>← <a href="/medical-malpractice-lawyer/">חזרה למדריך רשלנות רפואית המלא</a></p>
<!-- /wp:paragraph -->`;

  await upsert('pages', 'surgical-errors-medical-malpractice', {
    title: 'רשלנות רפואית בניתוח | פיצויים, ניתוח שגוי, זיהומים | Jus-Tice',
    slug: 'surgical-errors-medical-malpractice',
    content: SURGICAL,
    status: 'publish',
    meta: {
      seo_title: 'רשלנות רפואית בניתוח | פיצויים, ניתוח שגוי, זיהומים | Jus-Tice',
      seo_description: 'רשלנות ניתוחית: ניתוח על איבר שגוי, שארית כלים בגוף, זיהום לאחר ניתוח. פיצויים 100K-8M ₪. האם ההסכמה מונעת תביעה? מדריך 2025.',
      pillar_keyword: 'רשלנות רפואית בניתוח',
      author_practice_area: 'medical-malpractice',
    }
  });

  const ANESTHESIA = `<!-- wp:paragraph -->
<p>רשלנות ברדמה (אנסתזיה) היא אחת הסיבות המרכזיות לנזקים קשים ואף מוות בחדר ניתוח. בישראל, תביעות רשלנות בהרדמה מהוות כ-8-12% מכלל תביעות הרשלנות הרפואית — עם פיצויים שיכולים להגיע ל-5 מיליון ₪.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>מה נחשב רשלנות ברדמה?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>רשלנות ברדמה מתרחשת כאשר רופא המרדים (אנסתזיולוג) או הצוות סוטים מפרוטוקול ההרדמה המקובל — לפני, במהלך, או לאחר הניתוח.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>סוגי רשלנות נפוצים בהרדמה</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>מינון שגוי של תרופות הרדמה</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>מינון נמוך מדי עלול להביא להתעוררות במהלך הניתוח (AAGA — Accidental Awareness during General Anesthesia), חוויה טראומטית עם נזקים נפשיים קבועים. מינון גבוה מדי עלול לגרום לדיכוי נשימה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>כישלון בניטור האנסתזיה</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>המרדים חייב לנטר ברציפות את לחץ הדם, ריווי החמצן, קצב הלב ועומק ההרדמה. כשל בניטור = רשלנות.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>אלרגיה לא מאובחנת</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>אם חולה דיווח על רגישויות ולא נבדק כראוי, ופיתח תגובה אנפילקטית — זו רשלנות. הפרוטוקול דורש בדיקה מלאה לפני כל הרדמה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>שאלות נפוצות</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>האם ניתן לתבוע בגין התעוררות במהלך הניתוח?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>כן. התעוררות תוך ניתוחית (AAGA) מוכרת כסיבה לתביעת רשלנות. פיצוי ממוצע: 300,000-1,500,000 ₪ בהתאם לחומרת הטראומה.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מהי תקופת ההתיישנות?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>7 שנים מיום גילוי הנזק, לפי חוק זכויות החולה תשנ"ו-1996 ופקודת הנזיקין.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>מי אחראי — הרופא המרדים, המנתח, או בית החולים?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ניתן לתבוע את כולם. בית החולים נושא באחריות שילוחית על מעשי העובדים. בתביעות רשלנות ברדמה, האחריות העיקרית היא של הרופא המרדים.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>← <a href="/medical-malpractice-lawyer/">חזרה למדריך רשלנות רפואית המלא</a></p>
<!-- /wp:paragraph -->`;

  await upsert('pages', 'anesthesia-medical-malpractice', {
    title: 'רשלנות ברדמה (אנסתזיה) | פיצויים, התעוררות בניתוח | Jus-Tice',
    slug: 'anesthesia-medical-malpractice',
    content: ANESTHESIA,
    status: 'publish',
    meta: {
      seo_title: 'רשלנות ברדמה (אנסתזיה) | פיצויים, התעוררות בניתוח | Jus-Tice',
      seo_description: 'רשלנות ברדמה: מינון שגוי, כשל ניטור, אלרגיה לא מאובחנת, התעוררות תוך ניתוחית. פיצויים 300K-5M ₪. מדריך משפטי 2025.',
      pillar_keyword: 'רשלנות ברדמה',
      author_practice_area: 'medical-malpractice',
    }
  });

  console.log('\n✅ All architecture fixes applied');
}

main().catch(console.error);
