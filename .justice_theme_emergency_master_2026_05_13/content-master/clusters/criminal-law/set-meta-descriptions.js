/**
 * Set SEO meta descriptions for all criminal law articles via XML-RPC
 */
const https = require('https');

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function setMeta(postId, key, value) {
  return new Promise((resolve, reject) => {
    const params = `<param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><int>${postId}</int></value></param><param><value><struct><member><name>custom_fields</name><value><array><data><value><struct><member><name>key</name><value><string>${esc(key)}</string></value></member><member><name>value</name><value><string>${esc(value)}</string></value></member></struct></value></data></array></value></member></struct></value></param>`;
    const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>wp.editPost</methodName><params>${params}</params></methodCall>`, 'utf8');
    const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{if(b.includes('<boolean>1</boolean>'))resolve(true);else reject(b.substring(0,200));});});
    req.on('error',reject);req.write(xml);req.end();
  });
}

const metas = [
  { id: 857, desc: 'מדריך מקיף על עורך דין פלילי בישראל. סוגי עבירות, עונשים, זכויות החשוד, בחירת עורך דין ועלויות. מעודכן 2026.' },
  { id: 19257, desc: 'איך מוציאים תעודת יושר ואישור העדר רישום פלילי? המדריך המלא: תהליך, עלויות, זמנים ומה עושים כשיש רישום.' },
  { id: 19259, desc: 'מחיקת רישום פלילי ומשטרתי בישראל. תקופות צינון, שינוי עילת סגירה, תהליך המחיקה וזכויות שלכם. מדריך מעודכן.' },
  { id: 19261, desc: 'כמה עולה עורך דין פלילי? מחירון מעודכן 2026. עלויות לפי סוג עבירה, שלב הליך ומורכבות. טיפים לחיסכון.' },
  { id: 19263, desc: 'עבירות סמים בישראל: סוגי עבירות, עונשים, הגנות משפטיות ומדיניות אכיפה. מדריך מקיף לכל מה שצריך לדעת.' },
  { id: 19265, desc: 'נתפסת בגניבה מחנות? המדריך המלא: עונשים, הגנות משפטיות, זכויות הנחשד ומה לעשות כשנתפסים. עו"ד פלילי מסביר.' },
  { id: 19267, desc: 'להב 433 - היחידה הארצית לחקירות הונאה. מה קורה כשזומנים לחקירה? זכויות, תהליך החקירה ודרכי הגנה.' },
  { id: 19269, desc: 'זכויות הנחקר בחקירה משטרתית. זכות השתיקה, זכות לעורך דין, מה מותר ומה אסור למשטרה. המדריך המלא.' },
  { id: 19271, desc: 'עבירות רצח והריגה בישראל. סיווג עבירות, עונשים, הגנות משפטיות והבדלים בין רצח להריגה. מדריך משפטי מקיף.' },
  { id: 19273, desc: 'סחר בסמים בישראל: עונשים חמורים, ההבחנה בין החזקה לסחר, הגנות משפטיות וכיצד בוחרים עורך דין.' },
  { id: 19275, desc: 'החזקת סמים לשימוש עצמי. מדיניות צבע לבן, עונשים, הפניה לטיפול במקום העמדה לדין ומה עושים כשנתפסים.' },
  { id: 19277, desc: 'נהיגה בשכרות ותחת השפעת סמים. עונשים, שלילת רישיון, סירוב לבדיקה והגנות משפטיות. מדריך מעודכן 2026.' },
  { id: 19279, desc: 'הסדר טיעון במשפט פלילי. מתי כדאי, מתי לא, איך מתנהל התהליך וכיצד מגיעים להסדר הטוב ביותר.' },
  { id: 19281, desc: 'עבירות הונאה ומרמה בישראל. סוגי הונאות, עונשים, הגנות משפטיות וכיצד להתמודד עם חקירה או אישום.' },
  { id: 19283, desc: 'מעצר בישראל: סוגי מעצר, זכויות העצור, דיון מעצר ודרכי שחרור. המדריך המלא לזכויות שלכם.' },
  { id: 19300, desc: 'עבירות מס בישראל. העלמת מס, חשבוניות פיקטיביות, גילוי מרצון והגנות משפטיות. מדריך מקצועי מעודכן.' },
  { id: 19302, desc: 'רשלנות פלילית: גרם מוות ברשלנות, תאונות עבודה ורשלנות רפואית. הגדרה, עונשים והגנות משפטיות.' },
  { id: 19304, desc: 'ערעור פלילי בישראל. מתי כדאי לערער, סיכויי הצלחה, מועדים להגשה ותהליך הערעור. מדריך מעודכן.' },
];

async function main() {
  for (const m of metas) {
    try {
      await setMeta(m.id, 'seo_description', m.desc);
      console.log(`OK ${m.id} | ${m.desc.substring(0, 50)}...`);
    } catch (err) {
      console.log(`FAIL ${m.id} | ${err}`);
    }
  }
  console.log('DONE - All meta descriptions set');
}

main();
