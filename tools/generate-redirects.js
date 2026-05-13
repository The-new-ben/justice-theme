/**
 * Generate 301 Redirect Map
 * ─────────────────────────
 * Reads family-law-decision-map.csv and extracts MERGE_REDIRECT rows.
 * Generates a redirect map with old_url → new_url for .htaccess or WP plugin.
 *
 * NO LIVE CHANGES — produces redirect CSV for batch import.
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(__dirname, '../../project-control/content-master/family-law-decision-map.csv');
const MASTER = path.resolve(__dirname, '../../project-control/content-master/content-master-inventory.csv');
const OUTPUT = path.resolve(__dirname, '../../project-control/content-master/redirect-301-family-law.csv');
const HTACCESS = path.resolve(__dirname, '../../project-control/content-master/redirect-301-htaccess.txt');

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
  return { headers, rows };
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

function main() {
  console.log('Reading decision map...');
  const decRaw = fs.readFileSync(INPUT, 'utf-8');
  const { rows: decisions } = parseCSV(decRaw);

  console.log('Reading master inventory for URL lookups...');
  const masterRaw = fs.readFileSync(MASTER, 'utf-8');
  const { rows: master } = parseCSV(masterRaw);

  // Build post_id → URL lookup
  const urlMap = {};
  for (const m of master) {
    urlMap[m.post_id] = m.current_url || '';
  }

  // Filter MERGE_REDIRECT decisions
  const redirects = decisions.filter(d => d.decision === 'MERGE_REDIRECT');
  console.log(`Found ${redirects.length} redirect decisions`);

  // Generate CSV
  let csv = 'old_url,new_url,old_post_id,target_post_id,old_title,status_code,notes\n';
  let htaccess = '# Family Law 301 Redirects\n# Generated: ' + new Date().toISOString().slice(0, 16) + '\n';
  htaccess += '# DO NOT APPLY until owner approval\n\n';

  for (const r of redirects) {
    const oldUrl = urlMap[r.post_id] || r.current_url || '';
    const newUrl = urlMap[r.target_id] || '';

    if (!oldUrl || !newUrl) {
      console.warn(`Missing URL for post ${r.post_id} → ${r.target_id}`);
      continue;
    }

    // Extract path from URL
    const oldPath = oldUrl.replace(/^https?:\/\/[^/]+/, '');
    const newPath = newUrl.replace(/^https?:\/\/[^/]+/, '');

    const title = (r.title || '').replace(/,/g, ';').replace(/"/g, "'");
    csv += `${oldUrl},${newUrl},${r.post_id},${r.target_id},"${title}",301,"${r.notes || ''}"\n`;

    // .htaccess format
    htaccess += `# ${r.post_id}: ${title.substring(0, 50)}\n`;
    htaccess += `RedirectPermanent ${oldPath} https://jus-tice.co.il${newPath}\n\n`;
  }

  fs.writeFileSync(OUTPUT, csv, 'utf-8');
  console.log(`Wrote: ${OUTPUT}`);

  fs.writeFileSync(HTACCESS, htaccess, 'utf-8');
  console.log(`Wrote: ${HTACCESS}`);

  console.log(`\nTotal redirects: ${redirects.length}`);
  console.log('REMINDER: Do NOT apply these until owner approval!');
}

main();
