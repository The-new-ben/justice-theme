/**
 * Update pillar 857 with E-E-A-T section and new spoke links
 * Replaces old bottom section with enriched version
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Read current pillar backup and new EEAT section
const currentContent = fs.readFileSync(path.join(dir, 'pillar-current-backup.html'), 'utf8');
const eeatSection = fs.readFileSync(path.join(dir, 'pillar-eeat-section.html'), 'utf8');

// Find the old "related articles" section and replace it
// The old section starts with "<h2>מאמרים נוספים" and goes to end
let newContent;
const oldSectionStart = currentContent.indexOf('<h2>\u05DE\u05D0\u05DE\u05E8\u05D9\u05DD \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD');
if (oldSectionStart > 0) {
  newContent = currentContent.substring(0, oldSectionStart) + eeatSection;
} else {
  // Fallback: try finding the old disclaimer
  const disclaimerStart = currentContent.lastIndexOf('<p><em>');
  if (disclaimerStart > 0) {
    newContent = currentContent.substring(0, disclaimerStart) + eeatSection;
  } else {
    newContent = currentContent + '\n' + eeatSection;
  }
}

// Also fix old broken links
newContent = newContent.replace(/href="\/shoplifting"/g, 'href="/shoplifting-defense/"');
newContent = newContent.replace(/href="\/how-much-will-a-criminal-defense-lawyer-cost"/g, 'href="/criminal-lawyer-cost/"');
newContent = newContent.replace(/href="\/lahav-433"/g, 'href="/lahav-433-guide/"');
newContent = newContent.replace(/href="\/apply-for-police-criminal-information-certificates"/g, 'href="/criminal-record-check/"');
newContent = newContent.replace(/href="\/drug-offenses-criminal-lawyer"/g, 'href="/drug-crimes/"');

console.log(`New content length: ${newContent.length} chars`);
console.log(`Old length: ${currentContent.length}, Added: ${newContent.length - currentContent.length}`);

// Upload via XML-RPC
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const title = 'עורך דין פלילי בישראל: המדריך המלא | מעודכן 2026';
const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>wp.editPost</methodName><params><param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><int>857</int></value></param><param><value><struct><member><name>post_title</name><value><string>${esc(title)}</string></value></member><member><name>post_content</name><value><string>${esc(newContent)}</string></value></member></struct></value></param></params></methodCall>`, 'utf8');

const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{if(b.includes('<boolean>1</boolean>'))console.log('SUCCESS! Pillar 857 updated');else{const e=b.match(/faultString[\s\S]*?<string>([^<]+)/);console.log('ERROR:',e?e[1]:b.substring(0,500));}});});
req.on('error',e=>console.log('ERROR:',e.message));req.write(xml);req.end();
