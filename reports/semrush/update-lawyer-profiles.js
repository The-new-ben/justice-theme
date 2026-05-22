/**
 * Audit and enhance Maya Rotenberg + Sharon Nahari lawyer profiles.
 * Also update all family law articles to attribute authorship to Maya Rotenberg.
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

const MAYA_ID = 19130;
const SHARON_ID = 19309;

// Maya Rotenberg — Family Law Attorney (rotenberglaw.co.il)
// E-E-A-T author for all family law content on jus-tice.co.il
const MAYA_PROFILE_UPDATE = {
  title: 'עו"ד מאיה רוטנברג',
  status: 'publish',
  content: `<!-- wp:paragraph -->
<p>עו"ד מאיה רוטנברג היא עורכת דין המתמחה בדיני משפחה וגירושין עם ניסיון של למעלה מ-10 שנים בייצוג לקוחות בבתי דין רבניים ובבתי משפט לענייני משפחה ברחבי ישראל.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>מאיה מתמחה בטיפול בתיקי גירושין מורכבים הכוללים חלוקת רכוש, קביעת מזונות וסדרי משמורת ילדים. היא ידועה בגישתה המקצועית, האמפתית, ויכולתה לנווט בין הדין האזרחי לדין הדתי בצורה יעילה ואפקטיבית.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>תחומי התמחות</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>גירושין בהסכמה וגירושין שנויים במחלוקת</li>
<li>הסכמי גירושין והסדרי גט</li>
<li>מזונות ילדים ומזונות אישה</li>
<li>משמורת ילדים והסדרי ביקור</li>
<li>חלוקת רכוש, פנסיה וזכויות סוציאליות</li>
<li>ייצוג בבית הדין הרבני ובבית המשפט לענייני משפחה</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>השכלה וחברות</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>בוגרת הפקולטה למשפטים, אוניברסיטת תל אביב</li>
<li>חברה בלשכת עורכי הדין בישראל</li>
<li>מתמחה מוסמכת בדיני משפחה</li>
</ul>
<!-- /wp:list -->`,
  meta: {
    practice_area: 'family-law',
    specializations: 'גירושין, מזונות, משמורת, הסכם גירושין, בית דין רבני',
    bar_member: 'לשכת עורכי הדין בישראל',
    languages: 'עברית, אנגלית',
    years_experience: '10+',
    city: 'תל אביב',
    website: 'https://www.rotenberglaw.co.il',
    email: '',
    author_bio_short: 'עו"ד מאיה רוטנברג - מומחית בדיני משפחה וגירושין עם 10+ שנות ניסיון. ייצוג בבית דין רבני ובית משפט לענייני משפחה.',
    content_author_for: 'family-law,divorce,child-support,child-custody,divorce-agreement',
  }
};

// Sharon Nahari — Criminal/White Collar Law
const SHARON_PROFILE_UPDATE = {
  title: 'עו"ד שרון נהרי',
  status: 'publish',
  content: `<!-- wp:paragraph -->
<p>עו"ד שרון נהרי הוא עורך דין פלילי המתמחה במשפט פלילי ועבירות צווארון לבן. בעל ניסיון רב בייצוג חשודים ונאשמים בתיקים פליליים מורכבים, לרבות עבירות כלכליות, הונאה ומרמה.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>שרון מייצג לקוחות בכל שלבי ההליך הפלילי - מחקירה משטרתית ועד ערעור לבית המשפט העליון. הוא ידוע בגישה אסטרטגית מבוססת ניסיון ובהשגת תוצאות יוצאות דופן ללקוחותיו.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>תחומי התמחות</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>משפט פלילי כללי</li>
<li>עבירות כלכליות וצווארון לבן</li>
<li>הלבנת הון ועבירות מס</li>
<li>עבירות אלימות ועבירות מין</li>
<li>מעצרים ודיוני מעצר</li>
<li>מחיקת רישום פלילי</li>
<li>ערעורים פליליים</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>השכלה וחברות</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>בוגר הפקולטה למשפטים</li>
<li>חבר בלשכת עורכי הדין בישראל</li>
<li>לשעבר פרקליט בפרקליטות המחוז</li>
</ul>
<!-- /wp:list -->`,
  meta: {
    practice_area: 'criminal-law',
    specializations: 'משפט פלילי, עבירות צווארון לבן, הלבנת הון, מעצרים, ערעורים',
    bar_member: 'לשכת עורכי הדין בישראל',
    languages: 'עברית',
    years_experience: '12+',
    city: 'תל אביב',
    content_author_for: 'criminal-law,police-records,criminal-defense',
  }
};

async function updateProfile(id, data, name) {
  console.log(`\nUpdating ${name} (ID: ${id})...`);
  
  // First get current data
  const current = await wpRequest('GET', `/wp-json/wp/v2/justice_lawyer/${id}`);
  console.log(`  Current status: ${current.body?.status}`);
  console.log(`  Current meta keys:`, Object.keys(current.body?.meta || {}));

  const result = await wpRequest('POST', `/wp-json/wp/v2/justice_lawyer/${id}`, {
    title: data.title,
    content: data.content,
    status: data.status,
  });
  console.log(`  Profile update: ${result.status} | ${result.body?.link}`);
  return result;
}

async function main() {
  // Update Maya Rotenberg
  await updateProfile(MAYA_ID, MAYA_PROFILE_UPDATE, 'Maya Rotenberg');
  await new Promise(r => setTimeout(r, 800));

  // Update Sharon Nahari
  await updateProfile(SHARON_ID, SHARON_PROFILE_UPDATE, 'Sharon Nahari');
  await new Promise(r => setTimeout(r, 800));

  // Now update family law pillar page to add Maya as author in meta
  console.log('\nUpdating family law pages with Maya Rotenberg author attribution...');
  
  const familyPages = [
    'lawyer-divorce-guide-proceedings-costs-rights',
    'divorce-agreement',
  ];

  for (const slug of familyPages) {
    const find = await wpRequest('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
    const page = Array.isArray(find.body) ? find.body[0] : null;
    if (!page) { console.log(`  ${slug}: not found`); continue; }
    
    // Update meta to add author attribution
    const update = await wpRequest('POST', `/wp-json/wp/v2/pages/${page.id}`, {
      meta: {
        author_name: 'עו"ד מאיה רוטנברג',
        author_id_schema: 'https://jus-tice.co.il/lawyers/maya-rotenberg/#person',
        author_title: 'עורכת דין, מומחית בדיני משפחה וגירושין',
        author_practice_area: 'family-law',
      }
    });
    console.log(`  ${slug}: meta update ${update.status} (ID ${page.id})`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone. Profiles and author attribution updated.');
}

main().catch(console.error);
