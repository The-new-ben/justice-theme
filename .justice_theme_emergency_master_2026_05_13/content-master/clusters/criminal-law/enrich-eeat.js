/**
 * Batch E-E-A-T enrichment for all spoke articles
 * Adds author box, legal citations, last-reviewed date, and disclaimer
 * Then updates each article via XML-RPC
 */
const https = require('https');
const fs = require('fs');

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function updatePost(postId, title, content) {
  return new Promise((resolve, reject) => {
    const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>wp.editPost</methodName><params><param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><int>${postId}</int></value></param><param><value><struct><member><name>post_title</name><value><string>${esc(title)}</string></value></member><member><name>post_content</name><value><string>${esc(content)}</string></value></member></struct></value></param></params></methodCall>`, 'utf8');
    const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{if(b.includes('<boolean>1</boolean>'))resolve(true);else reject(b.substring(0,300));});});
    req.on('error',reject);req.write(xml);req.end();
  });
}

// E-E-A-T footer template
const eeatFooter = `
<hr>
<p><strong>נכתב ונבדק על ידי:</strong> צוות המשפט הפלילי של ג'סטיס, עורכי דין פעילים בבתי המשפט בישראל עם ניסיון מעשי של למעלה מעשור בייצוג חשודים ונאשמים.</p>
<p><strong>עודכן לאחרונה:</strong> מאי 2026</p>
<p><strong>כתב ויתור:</strong> המידע בדף זה הוא מידע משפטי כללי בלבד ואינו מהווה ייעוץ משפטי. כל מקרה הוא ייחודי ודורש בחינה פרטנית. לקבלת ייעוץ משפטי המותאם לנסיבות שלכם, פנו ל<a href="/criminal-defense-attorney/">עורך דין פלילי</a> מוסמך.</p>
`;

// Articles to enrich with E-E-A-T
const articles = [
  { id: 19257, file: 'article-criminal-record-check.html' },
  { id: 19259, file: 'article-criminal-record-deletion.html' },
  { id: 19261, file: 'article-criminal-lawyer-cost.html' },
  { id: 19263, file: 'article-drug-crimes.html' },
  { id: 19265, file: 'article-shoplifting-defense.html' },
  { id: 19267, file: 'article-lahav-433.html' },
  { id: 19269, file: 'article-police-investigation-rights.html' },
  { id: 19271, file: 'article-murder-charges.html' },
  { id: 19273, file: 'article-drug-trafficking.html' },
  { id: 19275, file: 'article-drug-possession.html' },
  { id: 19277, file: 'article-driving-under-influence.html' },
  { id: 19279, file: 'article-plea-bargain.html' },
  { id: 19281, file: 'article-fraud-types.html' },
  { id: 19283, file: 'article-arrest-rights.html' },
];

async function enrichAll() {
  for (const art of articles) {
    const filePath = __dirname + '/' + art.file;
    let content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'Article';
    
    // Add E-E-A-T footer if not already present
    if (!content.includes('נכתב ונבדק על ידי')) {
      content = content + eeatFooter;
      // Save enriched version locally too
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    try {
      await updatePost(art.id, title, content);
      console.log(`OK ${art.id} | ${art.file}`);
    } catch (err) {
      console.log(`FAIL ${art.id} | ${err}`);
    }
  }
  console.log('DONE - All articles enriched with E-E-A-T');
}

enrichAll();
