/**
 * Fix and extract content from corrupted family-law JSON.
 * The file has encoding/escape issues — extract objects by bracket depth matching,
 * then parse each field individually.
 */
const fs = require('fs');
const raw = fs.readFileSync('c:/Users/pro/justice/justice-theme/reports/semrush/family-law-pages-content.json', 'utf8');

// The raw file was written with proper content but the JSON serialization
// may have issues with the em-dash (—) and Hebrew characters inside JSON strings.
// Strategy: extract each top-level object by bracket depth, then parse its fields.

function extractObjects(text) {
  let depth = 0, start = -1, objects = [];
  let inString = false, escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') { if (depth === 0) start = i; depth++; }
    else if (ch === '}') { depth--; if (depth === 0 && start >= 0) { objects.push(text.slice(start, i + 1)); start = -1; } }
  }
  return objects;
}

function extractField(objStr, fieldName) {
  // Extract a JSON string field value, handling escapes
  const keyPattern = '"' + fieldName + '"';
  const keyIdx = objStr.indexOf(keyPattern);
  if (keyIdx < 0) return '';
  let i = keyIdx + keyPattern.length;
  // skip whitespace and colon
  while (i < objStr.length && (objStr[i] === ':' || objStr[i] === ' ')) i++;
  if (objStr[i] !== '"') return '';
  i++; // skip opening quote
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

const objects = extractObjects(raw);
console.log(`Found ${objects.length} top-level objects`);

const pages = objects.map((objStr, idx) => {
  const slug = extractField(objStr, 'slug');
  const seo_title = extractField(objStr, 'seo_title');
  const seo_description = extractField(objStr, 'seo_description');
  const focus_keyword = extractField(objStr, 'focus_keyword');
  const content = extractField(objStr, 'content');

  console.log(`\nPage ${idx + 1}:`);
  console.log(`  slug: ${slug}`);
  console.log(`  focus_keyword: ${focus_keyword}`);
  console.log(`  seo_title: ${seo_title.substring(0, 60)}`);
  console.log(`  content length: ${content.length} chars`);
  console.log(`  content preview: ${content.substring(0, 80)}`);

  return { slug, seo_title, seo_description, focus_keyword, content };
});

// Validate
const valid = pages.filter(p => p.slug && p.content && p.content.length > 500);
console.log(`\nValid pages: ${valid.length}`);

fs.writeFileSync(
  'c:/Users/pro/justice/justice-theme/reports/semrush/family-law-pages-fixed.json',
  JSON.stringify(valid, null, 2),
  'utf8'
);
console.log('Saved to family-law-pages-fixed.json');
