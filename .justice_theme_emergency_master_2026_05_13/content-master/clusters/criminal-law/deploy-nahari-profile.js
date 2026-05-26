/**
 * Deploy Sharon Nahari - Step 1: Create post, Step 2: Assign taxonomies
 */
const https = require('https');
const fs = require('fs');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function xmlrpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>${method}</methodName><params>${params}</params></methodCall>`, 'utf8');
    const req = https.request({
      hostname: 'jus-tice.co.il', path: '/xmlrpc.php', method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8', 'Content-Length': xml.length }
    }, (res) => { let b = ''; res.on('data', d => b += d); res.on('end', () => resolve(b)); });
    req.on('error', reject); req.write(xml); req.end();
  });
}

const profileContent = `<div class="lawyer-profile-content">
<h2>עורך דין שרון נהרי - משפט פלילי וצווארון לבן</h2>
<p>עורך הדין שרון נהרי הוא מבכירי עורכי הדין הפליליים בישראל, בעל ניסיון של למעלה מ-27 שנה בתחום המשפט הפלילי. משרד שרון נהרי ושות' הוקם בשנת 1998 ומאז התבסס כאחד המשרדים המובילים בישראל בתחומי המשפט הפלילי, עבירות צווארון לבן ופשיעה בינלאומית.</p>
<h3>תחומי התמחות</h3>
<ul>
<li><strong>משפט פלילי כללי</strong> - ייצוג חשודים ונאשמים בכל הערכאות, כולל בית המשפט העליון</li>
<li><strong>עבירות צווארון לבן</strong> - הלבנת הון, שוחד, הונאה ומרמה, עבירות מס</li>
<li><strong>פשיעה בינלאומית והסגרות</strong> - מומחה מוכר בתחום ההסגרות והמשפט הפלילי הבינלאומי</li>
<li><strong>עבירות סמים</strong> - החזקה, סחר, ייצור</li>
<li><strong>עבירות מין</strong> - ייצוג בכל שלבי ההליך</li>
<li><strong>עבירות אלימות</strong> - תקיפה, איומים, אלימות במשפחה</li>
<li><strong>סייבר ומטבעות דיגיטליים</strong> - עבירות קריפטו, מסחר בפורקס, הונאות מקוונות</li>
</ul>
<h3>ניסיון מקצועי</h3>
<p>עו"ד נהרי משמש כיו"ר ומייסד ועדת הסגרות ופשיעה בינלאומית בלשכת עורכי הדין בישראל. המשרד מדורג באופן עקבי על ידי Dun's 100 ו-BDI כאחד המשרדים המובילים בישראל בתחומי הפלילים והצווארון הלבן.</p>
<h3>שפות</h3>
<p>עברית, אנגלית</p>
<h3>בתי משפט</h3>
<p>בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום</p>
<h3>מידע חשוב</h3>
<p>המידע בדף זה הוא כללי ואינו מהווה ייעוץ משפטי. הפרופיל מבוסס על מידע פומבי ודירוגים מקצועיים. לפגישת ייעוץ ראשונית יש לפנות ישירות למשרד.</p>
</div>`;

const metaFields = [
  ['lawyer_full_name', 'עו"ד שרון נהרי'],
  ['firm_name', 'שרון נהרי ושות\' - משרד עורכי דין'],
  ['bio_short', 'מבכירי עורכי הדין הפליליים בישראל. מומחה למשפט פלילי, צווארון לבן, הסגרות ופשיעה בינלאומית. 27+ שנות ניסיון.'],
  ['profile_headline', 'עו"ד שרון נהרי - ייצוג פלילי ברמה הגבוהה ביותר'],
  ['profile_subheadline', 'למעלה מ-27 שנות ניסיון במשפט פלילי, עבירות צווארון לבן, הסגרות ופשיעה בינלאומית.'],
  ['profile_approach_title', 'גישה מקצועית'],
  ['profile_approach', 'ליווי צמוד ואישי מהשלב הראשון של החקירה ועד סיום ההליך. כל תיק מקבל תשומת לב מלאה עם אסטרטגיה משפטית מותאמת.'],
  ['profile_services', 'משפט פלילי כללי | ייצוג חשודים ונאשמים בכל סוגי העבירות\nעבירות צווארון לבן | הלבנת הון, שוחד, הונאה, עבירות מס\nפשיעה בינלאומית והסגרות | ייצוג בהליכי הסגרה\nעבירות סמים | החזקה, סחר, ייצור\nעבירות מין | ייצוג מקצועי בכל שלבי ההליך\nסייבר ומטבעות דיגיטליים | עבירות קריפטו, פורקס'],
  ['profile_process', 'פגישת ייעוץ ראשונית | הבנת התיק והערכת סיכויים\nליווי בחקירה | הכנה לחקירה וליווי בזמן אמת\nשימוע לפני כתב אישום | ניסיון למנוע הגשת כתב אישום\nייצוג בבית המשפט | הגנה מקצועית בכל הערכאות\nערעור | ייצוג בבית המשפט העליון'],
  ['profile_credentials', 'יו"ר ועדת הסגרות ופשיעה בינלאומית בלשכת עורכי הדין | תפקיד מוביל\nדירוג Dun\'s 100 | משרד מוביל בפלילים וצווארון לבן\nדירוג BDI Code | מוכר כמשרד מוביל\n27+ שנות ניסיון | הוקם 1998'],
  ['profile_faqs', 'מתי כדאי לפנות לעורך דין פלילי? | מומלץ לפנות מיד כשמתעורר חשד לחקירה פלילית\nמה ההבדל בין עבירת צווארון לבן לעבירה פלילית רגילה? | עבירות צווארון לבן הן עבירות כלכליות-פיננסיות הדורשות התמחות ספציפית\nמה עושים כשמקבלים צו הסגרה? | יש לפנות מיד לעורך דין המתמחה בדיני הסגרה\nהאם אפשר למנוע הגשת כתב אישום? | כן, בשלב השימוע ניתן להציג טיעונים לשכנע את הפרקליטות\nכמה עולה ייצוג פלילי? | עלויות משתנות. מומלץ לקבוע פגישת ייעוץ ראשונית'],
  ['profile_cta_title', 'זקוקים לעורך דין פלילי?'],
  ['profile_cta_text', 'לפגישת ייעוץ ראשונית, השאירו פרטים או התקשרו.'],
  ['phone', '03-6969080'],
  ['email', 'office@nahari-law.co.il'],
  ['website', 'https://nahari-law.co.il'],
  ['office_address', 'מצדה 7, מגדל בסר 4, קומה 40, בני ברק'],
  ['years_experience', '27'],
  ['courts', 'בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום'],
  ['languages', 'עברית, אנגלית'],
  ['license_status', 'active'],
  ['verification_status', 'verified'],
  ['plan_type', 'featured'],
  ['subscription_status', 'active'],
  ['profile_status', 'active'],
  ['priority_score', '90'],
  ['featured_on_front', '1'],
  ['lead_routing_enabled', '1'],
  ['source_type', 'manual'],
  ['internal_notes', 'Criminal law authority persona. Deployed 2026-05-14.'],
];

async function deploy() {
  // Build custom_fields XML
  let cfXml = '';
  for (const [key, value] of metaFields) {
    cfXml += `<value><struct><member><name>key</name><value><string>${esc(key)}</string></value></member><member><name>value</name><value><string>${esc(value)}</string></value></member></struct></value>`;
  }

  const params = `<param><value><int>1</int></value></param>` +
    `<param><value><string>benbatash</string></value></param>` +
    `<param><value><string>0584444595</string></value></param>` +
    `<param><value><struct>` +
      `<member><name>post_type</name><value><string>justice_lawyer</string></value></member>` +
      `<member><name>post_title</name><value><string>${esc('עו"ד שרון נהרי - משפט פלילי וצווארון לבן')}</string></value></member>` +
      `<member><name>post_content</name><value><string>${esc(profileContent)}</string></value></member>` +
      `<member><name>post_status</name><value><string>publish</string></value></member>` +
      `<member><name>post_name</name><value><string>advocate-sharon-nahari</string></value></member>` +
      `<member><name>post_excerpt</name><value><string>${esc('עו"ד שרון נהרי, מייסד משרד שרון נהרי ושות\'. מומחה למשפט פלילי, צווארון לבן, הסגרות ופשיעה בינלאומית.')}</string></value></member>` +
      `<member><name>custom_fields</name><value><array><data>${cfXml}</data></array></value></member>` +
    `</struct></value></param>`;

  console.log('Step 1: Creating Sharon Nahari lawyer profile...');
  const result = await xmlrpcCall('wp.newPost', params);
  
  const idMatch = result.match(/<string>(\d+)<\/string>/);
  if (idMatch) {
    const postId = parseInt(idMatch[1]);
    console.log(`SUCCESS! Post ID: ${postId}`);
    console.log(`URL: https://jus-tice.co.il/lawyers/advocate-sharon-nahari/`);
    
    // Step 2: Assign practice-areas taxonomy via wp.editPost with terms
    console.log('\nStep 2: Assigning practice-areas taxonomy...');
    const termParams = `<param><value><int>1</int></value></param>` +
      `<param><value><string>benbatash</string></value></param>` +
      `<param><value><string>0584444595</string></value></param>` +
      `<param><value><int>${postId}</int></value></param>` +
      `<param><value><struct>` +
        `<member><name>terms_names</name><value><struct>` +
          `<member><name>practice-areas</name><value><array><data>` +
            `<value><string>${esc('משפט פלילי')}</string></value>` +
          `</data></array></value></member>` +
          `<member><name>city</name><value><array><data>` +
            `<value><string>${esc('בני ברק')}</string></value>` +
            `<value><string>${esc('תל אביב')}</string></value>` +
          `</data></array></value></member>` +
        `</struct></value></member>` +
      `</struct></value></param>`;
    
    const termResult = await xmlrpcCall('wp.editPost', termParams);
    if (termResult.includes('<boolean>1</boolean>')) {
      console.log('Taxonomies assigned: practice-areas=משפט פלילי, city=בני ברק+תל אביב');
    } else {
      const fault = termResult.match(/faultString[\s\S]*?<string>([^<]+)/);
      console.log(`Taxonomy assignment: ${fault ? fault[1] : 'check manually'}`);
    }
    
    // Save result
    fs.writeFileSync(__dirname + '/nahari-deploy-result.json', JSON.stringify({
      post_id: postId,
      url: 'https://jus-tice.co.il/lawyers/advocate-sharon-nahari/',
      deployed: new Date().toISOString(),
      meta_fields: metaFields.length,
      taxonomies: ['practice-areas:משפט פלילי', 'city:בני ברק', 'city:תל אביב']
    }, null, 2));
    
    console.log('\nDONE');
    return postId;
  } else {
    const fault = result.match(/faultString[\s\S]*?<string>([^<]+)/);
    console.log(`FAILED: ${fault ? fault[1] : result.substring(0, 500)}`);
    return null;
  }
}

deploy().catch(console.error);
