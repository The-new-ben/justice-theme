/**
 * XML-RPC Post Updater for jus-tice.co.il
 * Updates post 857 (/criminal-defense-attorney/) with pillar content
 */
const https = require('https');
const fs = require('fs');

const USER = 'benbatash';
const PASS = '0584444595';
const POST_ID = 857;

const p1 = fs.readFileSync('C:\\Users\\pro\\justice\\justice-theme\\criminal-article-part1.html', 'utf8');
const p2 = fs.readFileSync('C:\\Users\\pro\\justice\\justice-theme\\criminal-article-part2.html', 'utf8');
const content = p1 + '\n' + p2;
const title = 'עורך דין פלילי בישראל | המדריך המלא למשפט פלילי';

console.log('Content:', content.length, 'chars');

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
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
</struct></value></param>
</params>
</methodCall>`, 'utf8');

const opts = {
  hostname: 'jus-tice.co.il',
  path: '/xmlrpc.php',
  method: 'POST',
  headers: { 'Content-Type': 'text/xml; charset=utf-8', 'Content-Length': xml.length }
};

const req = https.request(opts, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    if (body.includes('<boolean>1</boolean>')) {
      console.log('SUCCESS: Post', POST_ID, 'updated!');
    } else {
      const m = body.match(/<string>([^<]+)<\/string>/);
      console.log('Response:', m ? m[1] : body.substring(0, 500));
    }
  });
});
req.on('error', e => console.log('Error:', e.message));
req.write(xml);
req.end();
