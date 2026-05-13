/**
 * Generic article publisher for jus-tice.co.il
 * Usage: node quick-publish.js <slug> <htmlFile>
 */
const https = require('https');
const fs = require('fs');
const slug = process.argv[2];
const file = process.argv[3];
if (!slug || !file) { console.log('Usage: node quick-publish.js <slug> <htmlFile>'); process.exit(1); }
const content = fs.readFileSync(file, 'utf8');
const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
const title = titleMatch ? titleMatch[1] : slug;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
console.log(`Publishing: /${slug}/ | Title: ${title} | ${content.length} chars`);
const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>wp.newPost</methodName><params><param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><struct><member><name>post_type</name><value><string>articles</string></value></member><member><name>post_title</name><value><string>${esc(title)}</string></value></member><member><name>post_content</name><value><string>${esc(content)}</string></value></member><member><name>post_name</name><value><string>${slug}</string></value></member><member><name>post_status</name><value><string>publish</string></value></member></struct></value></param></params></methodCall>`,'utf8');
const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{const m=b.match(/<string>(\d+)<\/string>/);if(m)console.log('SUCCESS! Post ID:',m[1]);else{const e=b.match(/faultString[\s\S]*?<string>([^<]+)/);console.log('ERROR:',e?e[1]:b.substring(0,500));}});});
req.on('error',e=>console.log('ERROR:',e.message));req.write(xml);req.end();
