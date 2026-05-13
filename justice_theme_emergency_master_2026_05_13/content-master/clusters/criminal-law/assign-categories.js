/**
 * Create criminal-law category and assign all criminal articles to it
 * via XML-RPC
 */
const https = require('https');

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function xmlrpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const xml = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>${method}</methodName><params>${params}</params></methodCall>`, 'utf8');
    const req = https.request({hostname:'jus-tice.co.il',path:'/xmlrpc.php',method:'POST',headers:{'Content-Type':'text/xml; charset=utf-8','Content-Length':xml.length}},(res)=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>resolve(b));});
    req.on('error',reject);req.write(xml);req.end();
  });
}

// Create category via wp.newTerm
async function createCategory(name, slug) {
  const params = `<param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><struct><member><name>taxonomy</name><value><string>category</string></value></member><member><name>name</name><value><string>${esc(name)}</string></value></member><member><name>slug</name><value><string>${esc(slug)}</string></value></member><member><name>parent</name><value><int>699</int></value></member></struct></value></param>`;
  const result = await xmlrpcCall('wp.newTerm', params);
  const match = result.match(/<string>(\d+)<\/string>/);
  if (match) {
    console.log(`Created category: ${name} (${slug}) -> ID: ${match[1]}`);
    return parseInt(match[1]);
  }
  // May already exist
  const fault = result.match(/faultString[\s\S]*?<string>([^<]+)/);
  console.log(`Category ${slug}: ${fault ? fault[1] : 'unknown response'}`);
  return null;
}

// Assign category to article via wp.editPost
async function assignCategory(postId, categoryId) {
  const params = `<param><value><int>1</int></value></param><param><value><string>benbatash</string></value></param><param><value><string>0584444595</string></value></param><param><value><int>${postId}</int></value></param><param><value><struct><member><name>terms</name><value><struct><member><name>category</name><value><array><data><value><int>${categoryId}</int></value></data></array></value></member></struct></value></member></struct></value></param>`;
  const result = await xmlrpcCall('wp.editPost', params);
  if (result.includes('<boolean>1</boolean>')) {
    console.log(`  Post ${postId} -> assigned to category ${categoryId}`);
    return true;
  }
  const fault = result.match(/faultString[\s\S]*?<string>([^<]+)/);
  console.log(`  Post ${postId} FAIL: ${fault ? fault[1] : result.substring(0,200)}`);
  return false;
}

const articles = [
  857, 19257, 19259, 19261, 19263, 19265, 19267, 19269,
  19271, 19273, 19275, 19277, 19279, 19281, 19283,
  19300, 19302, 19304
];

async function main() {
  // Step 1: Create criminal-law category under Practice Areas (699)
  const catId = await createCategory('משפט פלילי', 'criminal-law');
  
  if (!catId) {
    // Try to find existing
    console.log('Category may already exist. Trying ID 699 as fallback parent...');
    // Use ID 699 (Practice Areas) for now
  }
  
  const targetCat = catId || 699;
  
  // Step 2: Assign all articles
  console.log(`\nAssigning ${articles.length} articles to category ${targetCat}...`);
  for (const postId of articles) {
    await assignCategory(postId, targetCat);
  }
  
  console.log('\nDONE');
}

main().catch(console.error);
