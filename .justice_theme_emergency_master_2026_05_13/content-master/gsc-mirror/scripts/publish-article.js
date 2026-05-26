/**
 * XML-RPC Article Publisher for jus-tice.co.il
 * Usage: node publish-article.js <slug> <title-file> <content-file>
 * Creates new articles in the "articles" CPT
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const creds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'tools', 'gsc', 'wp-app-password.json'), 'utf8'));
const USER = creds.username;
const PASS = creds.wp_password;

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function xmlrpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
<methodName>${method}</methodName>
<params>
${params}
</params>
</methodCall>`, 'utf8');

    const req = https.request({
      hostname: 'jus-tice.co.il',
      path: '/xmlrpc.php',
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8', 'Content-Length': xml.length }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(xml);
    req.end();
  });
}

async function createArticle(slug, title, content) {
  console.log(`Creating: /${slug}/`);
  console.log(`Title: ${title}`);
  console.log(`Content: ${content.length} chars`);
  
  const params = `
<param><value><int>1</int></value></param>
<param><value><string>${esc(USER)}</string></value></param>
<param><value><string>${esc(PASS)}</string></value></param>
<param><value><struct>
<member><name>post_type</name><value><string>articles</string></value></member>
<member><name>post_title</name><value><string>${esc(title)}</string></value></member>
<member><name>post_content</name><value><string>${esc(content)}</string></value></member>
<member><name>post_name</name><value><string>${esc(slug)}</string></value></member>
<member><name>post_status</name><value><string>publish</string></value></member>
</struct></value></param>`;

  const res = await xmlrpcCall('wp.newPost', params);
  const idMatch = res.match(/<string>(\d+)<\/string>/);
  if (idMatch) {
    console.log(`SUCCESS! Post ID: ${idMatch[1]}`);
    return idMatch[1];
  } else {
    const errMatch = res.match(/<name>faultString<\/name><value><string>([^<]+)/);
    console.log('ERROR:', errMatch ? errMatch[1] : res.substring(0, 500));
    return null;
  }
}

async function updateArticle(postId, title, content) {
  console.log(`Updating post ${postId}`);
  
  const params = `
<param><value><int>1</int></value></param>
<param><value><string>${esc(USER)}</string></value></param>
<param><value><string>${esc(PASS)}</string></value></param>
<param><value><int>${postId}</int></value></param>
<param><value><struct>
<member><name>post_title</name><value><string>${esc(title)}</string></value></member>
<member><name>post_content</name><value><string>${esc(content)}</string></value></member>
</struct></value></param>`;

  const res = await xmlrpcCall('wp.editPost', params);
  if (res.includes('<boolean>1</boolean>')) {
    console.log(`SUCCESS! Post ${postId} updated`);
    return true;
  } else {
    const errMatch = res.match(/<name>faultString<\/name><value><string>([^<]+)/);
    console.log('ERROR:', errMatch ? errMatch[1] : res.substring(0, 500));
    return false;
  }
}

// CLI mode
const args = process.argv.slice(2);
if (args[0] === 'create' && args.length >= 3) {
  const slug = args[1];
  const contentFile = args[2];
  const content = fs.readFileSync(contentFile, 'utf8');
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
  createArticle(slug, title, content);
} else if (args[0] === 'update' && args.length >= 3) {
  const postId = parseInt(args[1]);
  const contentFile = args[2];
  const content = fs.readFileSync(contentFile, 'utf8');
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : 'Updated Article';
  updateArticle(postId, title, content);
}

module.exports = { createArticle, updateArticle };
