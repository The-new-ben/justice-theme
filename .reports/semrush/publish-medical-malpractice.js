/**
 * Publish medical malpractice pillar from JSON file.
 * 5,325 Hebrew words, 13 H2s, FAQPage schema-ready, rich NIS data.
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

// Re-use same extraction logic as fix-json.js
function extractField(objStr, fieldName) {
  const keyPattern = '"' + fieldName + '"';
  const keyIdx = objStr.indexOf(keyPattern);
  if (keyIdx < 0) return '';
  let i = keyIdx + keyPattern.length;
  while (i < objStr.length && (objStr[i] === ':' || objStr[i] === ' ')) i++;
  if (objStr[i] !== '"') return '';
  i++;
  let value = '';
  while (i < objStr.length) {
    const ch = objStr[i];
    if (ch === '\\') {
      i++;
      const next = objStr[i];
      if (next === 'n') value += '\n';
      else if (next === 't') value += '\t';
      else if (next === 'r') value += '';
      else if (next === '"') value += '"';
      else if (next === '\\') value += '\\';
      else if (next === 'u') {
        const hex = objStr.slice(i + 1, i + 5);
        value += String.fromCharCode(parseInt(hex, 16));
        i += 4;
      } else value += next;
    } else if (ch === '"') {
      break;
    } else {
      value += ch;
    }
    i++;
  }
  return value;
}

async function main() {
  let raw;
  try {
    raw = fs.readFileSync('c:/Users/pro/justice/justice-theme/reports/semrush/medical-malpractice-content.json', 'utf8');
  } catch (e) {
    console.error('Could not read medical-malpractice-content.json:', e.message);
    process.exit(1);
  }

  // Try direct JSON parse first
  let page;
  try {
    const parsed = JSON.parse(raw);
    page = Array.isArray(parsed) ? parsed[0] : parsed;
  } catch (e) {
    console.log('Direct parse failed, using field extractor...');
    page = {
      slug: extractField(raw, 'slug'),
      seo_title: extractField(raw, 'seo_title'),
      seo_description: extractField(raw, 'seo_description'),
      focus_keyword: extractField(raw, 'focus_keyword'),
      content: extractField(raw, 'content'),
    };
  }

  console.log('Slug:', page.slug);
  console.log('SEO Title:', page.seo_title);
  console.log('Content length:', page.content.length, 'chars');
  console.log('Focus KW:', page.focus_keyword);

  if (!page.slug || !page.content) {
    console.error('Could not extract page data');
    process.exit(1);
  }

  const find = await wpRequest('GET', `/wp-json/wp/v2/pages?slug=${encodeURIComponent(page.slug)}&status=any&per_page=1`);
  const existing = Array.isArray(find.body) ? find.body[0] : null;

  const payload = {
    title: page.seo_title,
    slug: page.slug,
    content: page.content,
    status: 'publish',
    meta: {
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      pillar_keyword: page.focus_keyword,
      author_practice_area: 'medical-malpractice',
      secondary_keywords: 'רשלנות רפואית בלידה, פיצויים רשלנות רפואית, תביעת רשלנות רפואית',
    }
  };

  let result;
  if (existing) {
    console.log(`\nUpdating existing page ID ${existing.id} (${existing.status})`);
    result = await wpRequest('POST', `/wp-json/wp/v2/pages/${existing.id}`, payload);
  } else {
    console.log('\nCreating new page');
    result = await wpRequest('POST', '/wp-json/wp/v2/pages', payload);
  }

  console.log(`\nResult: HTTP ${result.status}`);
  console.log(`URL: ${result.body?.link}`);
  if (result.status >= 400) {
    console.log('Error:', JSON.stringify(result.body).substring(0, 400));
  } else {
    console.log('\n✅ Medical malpractice pillar LIVE');
  }
}

main().catch(console.error);
