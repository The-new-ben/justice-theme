/**
 * XML-RPC Post Updater — Updates post 857 with the criminal law pillar article
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'jus-tice.co.il';
const USER = 'benbatash';
const PASS = String.raw`BmYiVWN0To%@c2)ZAq8Y$Co7`;
const POST_ID = 857;

// Read article parts
const p1 = fs.readFileSync('C:\\Users\\pro\\justice\\justice-theme\\criminal-article-part1.html', 'utf8');
const p2 = fs.readFileSync('C:\\Users\\pro\\justice\\justice-theme\\criminal-article-part2.html', 'utf8');
const content = p1 + '\n' + p2;

const title = 'עורך דין פלילי בישראל | מדריך מלא: חקירה, מעצר, כתב אישום ורישום פלילי';

console.log(`Article: ${content.length} chars`);
console.log(`Title: ${title}`);

// Build XML-RPC request
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
<methodName>wp.editPost</methodName>
<params>
<param><value><int>1</int></value></param>
<param><value><string>${esc(USER)}</string></value></param>
<param><value><string>${esc(PASS)}</string></value></param>
<param><value><int>${POST_ID}</int></value></param>
<param><value><struct>
<member><name>post_title</name><value><string>${esc(title)}</string></value></member>
<member><name>post_content</name><value><string>${esc(content)}</string></value></member>
<member><name>post_status</name><value><string>publish</string></value></member>
</struct></value></param>
</params>
</methodCall>`;

const opts = {
  hostname: SITE,
  path: '/xmlrpc.php',
  method: 'POST',
  headers: { 'Content-Type': 'text/xml', 'Content-Length': Buffer.byteLength(xml, 'utf8') }
};

const req = https.request(opts, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    if (body.includes('<boolean>1</boolean>') || body.includes('true')) {
      console.log('SUCCESS: Post 857 updated!');
    } else if (body.includes('faultString')) {
      const m = body.match(/<string>([^<]+)<\/string>/);
      console.log('ERROR:', m ? m[1] : body.substring(0, 500));
    } else {
      console.log('Response:', body.substring(0, 500));
    }
  });
});
req.on('error', e => console.log('Request error:', e.message));
req.write(xml, 'utf8');
req.end();
