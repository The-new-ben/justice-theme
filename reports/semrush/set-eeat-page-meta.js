/**
 * Set author_practice_area meta on all published pillar/cluster pages
 * so the E-E-A-T system can resolve the correct attorney author.
 */
const https = require('https');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json', 'utf8'));
const auth = Buffer.from(creds.username + ':' + creds.app_password).toString('base64');

function wpRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'jus-tice.co.il', port: 443, path, method,
      headers: Object.assign(
        { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/json' },
        bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}
      )
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch(e) { resolve({ status: res.statusCode, body: data }); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Map: slug pattern -> practice area + secondary keywords for schema
const PAGE_AREA_MAP = [
  // Family law cluster
  { slug: 'lawyer-divorce-guide-proceedings-costs-rights', area: 'family-law', keywords: 'עורך דין גירושין, גירושין בהסכמה, מזונות, משמורת' },
  { slug: 'divorce-agreement', area: 'family-law', keywords: 'הסכם גירושין, הסכם פרידה, גירושין בהסכמה' },
  { slug: 'child-support', area: 'family-law', keywords: 'מזונות ילדים, מחשבון מזונות, מזונות הלכה 919' },
  { slug: 'child-custody', area: 'family-law', keywords: 'משמורת ילדים, טובת הילד, הסדרי ביקור' },
  { slug: 'divorce-mediation', area: 'family-law', keywords: 'גישור גירושין, גישור משפחתי' },
  { slug: 'consensual-divorce', area: 'family-law', keywords: 'גירושין בהסכמה, גירושין מהירים' },
  // Criminal law cluster
  { slug: 'criminal-defense-attorney', area: 'criminal-law', keywords: 'עורך דין פלילי, עו"ד פלילי מומלץ' },
  { slug: 'police-records-data-deletion', area: 'criminal-law', keywords: 'מחיקת רישום פלילי, רישום פלילי' },
  { slug: 'criminal-lawyer-cost', area: 'criminal-law', keywords: 'כמה עולה עורך דין פלילי, שכר טרחה' },
  // Medical malpractice
  { slug: 'medical-malpractice-lawyer', area: 'medical-malpractice', keywords: 'עורך דין רשלנות רפואית, תביעת רשלנות רפואית, פיצויים' },
  // Real estate
  { slug: 'real-estate-attorney', area: 'real-estate', keywords: 'עורך דין מקרקעין, עורך דין נדל"ן, מס רכישה' },
  // Inheritance
  { slug: 'inheritance-lawyer', area: 'inheritance', keywords: 'עורך דין ירושה, צוואה, עיזבון' },
];

async function setPageMeta(slug, area, keywords) {
  const find = await wpRequest('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=any&per_page=1`);
  const page = Array.isArray(find.body) ? find.body[0] : null;
  if (!page) {
    console.log(`  ${slug}: NOT FOUND`);
    return;
  }
  
  const result = await wpRequest('POST', `/wp-json/wp/v2/pages/${page.id}`, {
    meta: {
      author_practice_area: area,
      secondary_keywords: keywords,
    }
  });
  console.log(`  ${slug} (ID ${page.id}): meta=${result.status} area=${area}`);
}

async function main() {
  console.log('Setting E-E-A-T author_practice_area meta on all pillar/cluster pages...\n');
  for (const entry of PAGE_AREA_MAP) {
    await setPageMeta(entry.slug, entry.area, entry.keywords);
    await new Promise(r => setTimeout(r, 400));
  }
  console.log('\nDone.');
}

main().catch(console.error);
