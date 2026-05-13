const https = require('https');
const fs = require('fs');
const content = fs.readFileSync('C:/Users/pro/justice/justice-theme/justice_theme_emergency_master_2026_05_13/content-master/clusters/criminal-law/article-criminal-record-check.html','utf8');
const title = 'תעודת יושר ואישור העדר רישום פלילי בישראל | מדריך מלא 2026';
const slug = 'criminal-record-check';
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>wp.newPost</methodName><params><param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><struct><member><name>post_type</name><value><string>articles</string></value></member><member><name>post_title</name><value><string>${esc(title)}</string></value></member><member><name>post_content</name><value><string>${esc(content)}</string></value></member><member><name>post_name</name><value><string>${slug}</string></value></member><member><name>post_status</name><value><string>publish</string></value></member></struct></value></param></params></methodCall>`,'utf8');
const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>{const m=b.match(/<string>(\d+)<\/string>/);if(m)console.log('SUCCESS ID:',m[1]);else{const e=b.match(/faultString[\s\S]*?<string>([^<]+)/);console.log('ERR:',e?e[1]:b.substring(0,500));}});});
req.on('error',e=>console.log('ERR:',e.message));req.write(xml);req.end();
