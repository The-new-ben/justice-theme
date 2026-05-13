/**
 * Batch Tag Family Law Articles + Set Expert Lawyer
 * ──────────────────────────────────────────────────
 * Reads family-law-decision-map.csv and calls WP REST endpoints to:
 * 1. Tag all 247 articles with "family-law" practice area
 * 2. Tag each article with its specific sub-topic
 * 3. Set Maya Rotenberg as the expert lawyer on all articles
 *
 * Requires WP Application Password auth.
 *
 * Usage: WP_USER=admin WP_APP_PASS=xxxx node batch-tag-family-law.js
 *        OR: node batch-tag-family-law.js --user admin --pass xxxx
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ──────────────────────────────────────────────────────────
const SITE = 'https://jus-tice.co.il';
const DECISION_CSV = path.resolve(__dirname, '../../project-control/content-master/family-law-decision-map.csv');

// Auth from env or args.
let WP_USER = process.env.WP_USER || '';
let WP_PASS = process.env.WP_APP_PASS || '';

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--user' && args[i + 1]) WP_USER = args[i + 1];
  if (args[i] === '--pass' && args[i + 1]) WP_PASS = args[i + 1];
}

if (!WP_USER || !WP_PASS) {
  console.log('Usage: WP_USER=admin WP_APP_PASS=xxxx node batch-tag-family-law.js');
  console.log('   OR: node batch-tag-family-law.js --user admin --pass xxxx');
  console.log('\nFirst, run these steps:');
  console.log('1. Deploy the updated justice-core plugin to WordPress');
  console.log('2. Visit any WP admin page to trigger sub-topic term registration');
  console.log('3. Find Maya Rotenberg lawyer post ID via WP admin');
  console.log('4. Run this script with Application Password credentials');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// ── Subtopic slug mapping (our classification → practice-area slug) ─
const SUBTOPIC_TO_SLUG = {
  'divorce_general':    'divorce',
  'child_support':      'child-support',
  'custody':            'custody',
  'prenuptial':         'prenuptial',
  'rabbinical_court':   'rabbinical-court',
  'property_division':  'property-division',
  'domestic_violence':  'domestic-violence',
  'divorce_agreement':  'divorce-agreement',
  'ketubah':            'ketubah',
  'common_law':         'common-law',
  'mediation':          'mediation',
  'infidelity':         'infidelity',
  'reconciliation':     'reconciliation',
  'family_general':     'family-law',
  'other_family':       'family-law',
};

// ── CSV Parser ──────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += ch;
  }
  result.push(current);
  return result;
}

// ── HTTP Helper ─────────────────────────────────────────────────────
function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(SITE + path);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': AUTH,
        'User-Agent': 'JusticeTools/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(SITE + path);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + (url.search || ''),
      method: 'GET',
      headers: {
        'Authorization': AUTH,
        'User-Agent': 'JusticeTools/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ── MAIN ────────────────────────────────────────────────────────────
async function main() {
  console.log('=== BATCH TAG FAMILY LAW ARTICLES ===\n');

  // 1. Read decision map.
  console.log('Reading decision map...');
  const rows = parseCSV(fs.readFileSync(DECISION_CSV, 'utf-8'));
  const postIds = rows.map(r => parseInt(r.post_id)).filter(Boolean);
  console.log(`Found ${postIds.length} articles to tag.\n`);

  // 2. Find Maya Rotenberg's lawyer post ID.
  console.log('Looking up Maya Rotenberg...');
  const lawyerRes = await getJSON('/wp-json/wp/v2/justice_lawyer?per_page=100');
  let mayaId = null;

  if (lawyerRes.status === 200 && Array.isArray(lawyerRes.data)) {
    const maya = lawyerRes.data.find(l =>
      (l.title && l.title.rendered && l.title.rendered.includes('מאיה')) ||
      (l.title && l.title.rendered && l.title.rendered.includes('רוטנברג'))
    );
    if (maya) {
      mayaId = maya.id;
      console.log(`Found Maya: ID=${mayaId}, Title="${maya.title.rendered}"`);
    }
  }

  if (!mayaId) {
    // Try search by meta via custom endpoint or check all.
    console.log('Maya not found via public API. Trying search...');
    const searchRes = await getJSON('/wp-json/wp/v2/justice_lawyer?search=%D7%9E%D7%90%D7%99%D7%94&per_page=10');
    if (searchRes.status === 200 && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
      mayaId = searchRes.data[0].id;
      console.log(`Found Maya via search: ID=${mayaId}`);
    } else {
      console.log('WARNING: Maya Rotenberg not found in published lawyers.');
      console.log('The batch-tag for practice areas will still proceed.');
      console.log('Expert lawyer assignment will be skipped.');
      console.log('After deploying the plugin and seeder, re-run this script.\n');
    }
  }

  // 3. Batch tag ALL articles with "family-law" parent practice area.
  console.log('\n--- STEP 1: Tag all articles with "family-law" ---');
  const BATCH_SIZE = 50;
  for (let i = 0; i < postIds.length; i += BATCH_SIZE) {
    const batch = postIds.slice(i, i + BATCH_SIZE);
    const res = await postJSON('/wp-json/justice-core/v1/batch-tag-articles', {
      post_ids: batch,
      practice_area: 'family-law',
      append: true,
    });
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${JSON.stringify(res.data)}`);
  }

  // 4. Tag each article with its specific sub-topic.
  console.log('\n--- STEP 2: Tag articles with specific sub-topics ---');
  const mappings = rows
    .filter(r => r.subtopic && SUBTOPIC_TO_SLUG[r.subtopic])
    .map(r => ({
      post_id: parseInt(r.post_id),
      subtopic: SUBTOPIC_TO_SLUG[r.subtopic],
    }))
    .filter(m => m.post_id);

  for (let i = 0; i < mappings.length; i += BATCH_SIZE) {
    const batch = mappings.slice(i, i + BATCH_SIZE);
    const res = await postJSON('/wp-json/justice-core/v1/batch-tag-subtopics', {
      mappings: batch,
    });
    console.log(`Subtopic batch ${Math.floor(i / BATCH_SIZE) + 1}: ${JSON.stringify(res.data)}`);
  }

  // 5. Set Maya as expert lawyer on all Family Law articles.
  if (mayaId) {
    console.log(`\n--- STEP 3: Set Maya (ID=${mayaId}) as expert on all articles ---`);
    for (let i = 0; i < postIds.length; i += BATCH_SIZE) {
      const batch = postIds.slice(i, i + BATCH_SIZE);
      const res = await postJSON('/wp-json/justice-core/v1/batch-set-expert', {
        post_ids: batch,
        lawyer_id: mayaId,
      });
      console.log(`Expert batch ${Math.floor(i / BATCH_SIZE) + 1}: ${JSON.stringify(res.data)}`);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`Tagged ${postIds.length} articles with practice areas.`);
  console.log(`Tagged ${mappings.length} articles with specific sub-topics.`);
  if (mayaId) {
    console.log(`Set Maya Rotenberg (ID=${mayaId}) as expert on ${postIds.length} articles.`);
  }
  console.log('\nThe smart bridge system will now auto-match lawyers to articles based on practice-areas taxonomy.');
}

main().catch(console.error);
