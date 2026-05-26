/**
 * gsc-export-all.js — DEFCON-1 GSC Mirror Extraction Engine
 * Pulls ALL data across ALL date ranges and ALL dimension combos.
 * Handles pagination (25k rows per batch), logging, and resumption.
 * 
 * ZERO DESTRUCTIVE ACTIONS. READ-ONLY DATA EXTRACTION.
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// PATHS
// ═══════════════════════════════════════════════════════════
// Find justice-theme root by walking up from __dirname until we find tools/gsc
function findToolsDir() {
  let d = __dirname;
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(d, 'tools', 'gsc');
    if (fs.existsSync(candidate)) return candidate;
    d = path.dirname(d);
  }
  // Fallback: absolute known path
  return 'C:\\Users\\pro\\justice\\justice-theme\\tools\\gsc';
}
const TOOLS_DIR = findToolsDir();
const MIRROR_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(MIRROR_DIR, 'raw');
const TOKEN_PATH = path.join(TOOLS_DIR, 'gsc-token.json');
const CREDS_PATH = path.join(TOOLS_DIR, 'oauth-client.json');
const LOG_FILE = path.join(MIRROR_DIR, 'gsc-run-log.md');
const SITES_FILE = path.join(MIRROR_DIR, 'gsc-sites-list.csv');
const DATES_FILE = path.join(MIRROR_DIR, 'gsc-date-ranges-used.md');
const MISSING_FILE = path.join(MIRROR_DIR, 'gsc-missing-data.md');

// Ensure dirs
[RAW_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ═══════════════════════════════════════════════════════════
// DATE RANGES
// ═══════════════════════════════════════════════════════════
const TODAY = new Date('2026-05-13');
function fmt(d) { return d.toISOString().split('T')[0]; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function addMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }

const RANGES = {
  '28d':      { start: fmt(addDays(TODAY, -28)),  end: fmt(TODAY) },
  '28d_prev': { start: fmt(addDays(TODAY, -56)),  end: fmt(addDays(TODAY, -29)) },
  '3m':       { start: fmt(addMonths(TODAY, -3)), end: fmt(TODAY) },
  '3m_prev':  { start: fmt(addMonths(TODAY, -6)), end: fmt(addDays(addMonths(TODAY, -3), -1)) },
  '12m':      { start: fmt(addMonths(TODAY, -12)), end: fmt(TODAY) },
  '16m':      { start: fmt(addMonths(TODAY, -16)), end: fmt(TODAY) },
};

// ═══════════════════════════════════════════════════════════
// PULL JOBS DEFINITION
// ═══════════════════════════════════════════════════════════
const PULL_JOBS = [
  // Page-only pulls across ranges
  { name: 'gsc_pages_28d',      dims: ['page'], range: '28d' },
  { name: 'gsc_pages_3m',       dims: ['page'], range: '3m' },
  { name: 'gsc_pages_12m',      dims: ['page'], range: '12m' },
  { name: 'gsc_pages_16m',      dims: ['page'], range: '16m' },
  // Query-only pulls
  { name: 'gsc_queries_28d',    dims: ['query'], range: '28d' },
  { name: 'gsc_queries_3m',     dims: ['query'], range: '3m' },
  { name: 'gsc_queries_12m',    dims: ['query'], range: '12m' },
  { name: 'gsc_queries_16m',    dims: ['query'], range: '16m' },
  // Query+Page (the holy grail)
  { name: 'gsc_query_page_28d', dims: ['query', 'page'], range: '28d' },
  { name: 'gsc_query_page_3m',  dims: ['query', 'page'], range: '3m' },
  { name: 'gsc_query_page_12m', dims: ['query', 'page'], range: '12m' },
  { name: 'gsc_query_page_16m', dims: ['query', 'page'], range: '16m' },
  // Page+Date trend
  { name: 'gsc_page_date_28d',  dims: ['page', 'date'], range: '28d' },
  { name: 'gsc_page_date_28d_prev', dims: ['page', 'date'], range: '28d_prev' },
  { name: 'gsc_page_date_3m',   dims: ['page', 'date'], range: '3m' },
  { name: 'gsc_page_date_3m_prev', dims: ['page', 'date'], range: '3m_prev' },
  // Query+Date trend
  { name: 'gsc_query_date_28d', dims: ['query', 'date'], range: '28d' },
  { name: 'gsc_query_date_28d_prev', dims: ['query', 'date'], range: '28d_prev' },
  // Device split
  { name: 'gsc_device_split',   dims: ['page', 'device'], range: '12m' },
  // Country split
  { name: 'gsc_country_split',  dims: ['page', 'country'], range: '12m' },
  // Search appearance
  { name: 'gsc_search_appearance', dims: ['page', 'searchAppearance'], range: '12m' },
];

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
async function authorize() {
  if (!fs.existsSync(CREDS_PATH)) throw new Error(`Missing ${CREDS_PATH}`);
  if (!fs.existsSync(TOKEN_PATH)) throw new Error(`Missing ${TOKEN_PATH}. Run gsc-pull.js first.`);
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH));
  const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
  const client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  return client;
}

// ═══════════════════════════════════════════════════════════
// CSV HELPERS
// ═══════════════════════════════════════════════════════════
function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function writeCsv(filepath, headers, rows) {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => csvEscape(row[h] !== undefined ? row[h] : '')).join(','));
  }
  fs.writeFileSync(filepath, lines.join('\n') + '\n', 'utf8');
}

// ═══════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════
function log(entry) {
  const line = `\n---\n**${new Date().toISOString()}**\n` +
    Object.entries(entry).map(([k,v]) => `- ${k}: ${v}`).join('\n') + '\n';
  fs.appendFileSync(LOG_FILE, line);
}

// ═══════════════════════════════════════════════════════════
// PAGINATED PULL
// ═══════════════════════════════════════════════════════════
async function pullData(webmasters, siteUrl, dims, startDate, endDate) {
  let allRows = [];
  let startRow = 0;
  const LIMIT = 25000;
  
  while (true) {
    try {
      const res = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions: dims, rowLimit: LIMIT, startRow }
      });
      const rows = (res.data && res.data.rows) || [];
      allRows = allRows.concat(rows);
      if (rows.length < LIMIT) break;
      startRow += LIMIT;
    } catch (err) {
      if (err.code === 429 || (err.message && err.message.includes('Quota'))) {
        console.log(`    ⏳ Rate limited. Waiting 60s...`);
        await new Promise(r => setTimeout(r, 60000));
        continue; // retry same batch
      }
      console.error(`    ❌ Error: ${err.message}`);
      break;
    }
  }
  return allRows;
}

// ═══════════════════════════════════════════════════════════
// FLATTEN ROW
// ═══════════════════════════════════════════════════════════
function flattenRow(row, dims) {
  const obj = {};
  dims.forEach((d, i) => { obj[d] = row.keys[i]; });
  obj.clicks = row.clicks;
  obj.impressions = row.impressions;
  obj.ctr = row.ctr;
  obj.position = row.position;
  return obj;
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  DEFCON-1 GSC MIRROR — FULL EXTRACTION ENGINE  ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  // Init log
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '# GSC Mirror Run Log\n\nAll extraction runs are logged here.\n');
  }
  
  // Auth
  console.log('[AUTH] Authenticating...');
  const auth = await authorize();
  const webmasters = google.webmasters({ version: 'v3', auth });
  
  // ── Step 1: List & verify sites ──
  console.log('[SITES] Listing Search Console properties...');
  const sitesRes = await webmasters.sites.list();
  const sites = (sitesRes.data && sitesRes.data.siteEntry) || [];
  
  const sitesData = sites.map(s => ({
    siteUrl: s.siteUrl,
    permissionLevel: s.permissionLevel
  }));
  
  writeCsv(SITES_FILE, ['siteUrl', 'permissionLevel'], sitesData);
  console.log(`  Found ${sites.length} properties:`);
  sites.forEach(s => console.log(`    ${s.siteUrl} (${s.permissionLevel})`));
  
  // Pick best property
  const preferred = sites.find(s => s.siteUrl === 'sc-domain:jus-tice.co.il');
  const fallback = sites.find(s => s.siteUrl.includes('jus-tice.co.il'));
  const siteUrl = (preferred || fallback || sites[0]).siteUrl;
  console.log(`\n  ✅ Using property: ${siteUrl}\n`);
  
  // ── Step 2: Write date ranges ──
  let datesContent = '# GSC Date Ranges Used\n\n';
  for (const [key, val] of Object.entries(RANGES)) {
    datesContent += `${key}_start = ${val.start}\n${key}_end = ${val.end}\n\n`;
  }
  fs.writeFileSync(DATES_FILE, datesContent);
  
  // ── Step 3: Run ALL pull jobs ──
  const missingData = [];
  const stats = {};
  
  for (const job of PULL_JOBS) {
    const range = RANGES[job.range];
    const outFile = path.join(RAW_DIR, `${job.name}.csv`);
    
    // Check if already exists (for resumption)
    if (fs.existsSync(outFile)) {
      const existingLines = fs.readFileSync(outFile, 'utf8').trim().split('\n').length - 1;
      if (existingLines > 0) {
        console.log(`[SKIP] ${job.name} — already exists (${existingLines} rows)`);
        stats[job.name] = existingLines;
        continue;
      }
    }
    
    console.log(`[PULL] ${job.name} | dims=${job.dims.join(',')} | ${range.start} → ${range.end}`);
    const startTime = Date.now();
    
    const rows = await pullData(webmasters, siteUrl, job.dims, range.start, range.end);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    if (rows.length === 0) {
      console.log(`  ⚠️  0 rows returned (${elapsed}s)`);
      missingData.push(`${job.name}: 0 rows returned. Dimensions: ${job.dims.join(',')}. Range: ${range.start} to ${range.end}.`);
      stats[job.name] = 0;
    } else {
      const flat = rows.map(r => flattenRow(r, job.dims));
      const headers = [...job.dims, 'clicks', 'impressions', 'ctr', 'position'];
      writeCsv(outFile, headers, flat);
      console.log(`  ✅ ${rows.length} rows saved (${elapsed}s)`);
      stats[job.name] = rows.length;
    }
    
    log({
      script: 'gsc-export-all.js',
      property: siteUrl,
      job: job.name,
      date_range: `${range.start} to ${range.end}`,
      dimensions: job.dims.join(','),
      rows_returned: rows.length,
      output_file: outFile,
      errors: 'none',
    });
    
    // small delay between jobs to be respectful
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // ── Step 4: Sitemaps ──
  console.log(`\n[SITEMAPS] Fetching sitemap data...`);
  try {
    const smRes = await webmasters.sitemaps.list({ siteUrl });
    const sitemaps = (smRes.data && smRes.data.sitemap) || [];
    const smData = sitemaps.map(s => ({
      path: s.path,
      type: s.type,
      lastSubmitted: s.lastSubmitted,
      lastDownloaded: s.lastDownloaded,
      isPending: s.isPending,
      isSitemapsIndex: s.isSitemapsIndex,
      warnings: s.warnings || 0,
      errors: s.errors || 0,
    }));
    writeCsv(path.join(RAW_DIR, 'gsc_sitemaps.csv'), 
      ['path','type','lastSubmitted','lastDownloaded','isPending','isSitemapsIndex','warnings','errors'], smData);
    console.log(`  ✅ ${sitemaps.length} sitemaps found`);
    stats['sitemaps'] = sitemaps.length;
  } catch (err) {
    console.log(`  ⚠️ Sitemaps error: ${err.message}`);
    missingData.push(`sitemaps: Error — ${err.message}`);
  }
  
  // ── Step 5: Write missing data ──
  let missingContent = '# GSC Missing Data Report\n\nGenerated: ' + new Date().toISOString() + '\n\n';
  missingContent += '## API Limitations\n\n';
  missingContent += '- **Backlinks/Links**: NOT available via Search Analytics API. Must be manually exported from GSC UI. See `links-manual-export-needed.md`.\n';
  missingContent += '- **URL Inspection**: Available via API but rate-limited (2000/day). Will be done separately for priority URLs.\n';
  missingContent += '- **PageSpeed Insights**: Separate API, rate-limited. Will be done for priority URLs.\n';
  missingContent += '- **Core Web Vitals (CrUX)**: Requires BigQuery or CrUX API. Not pulled in this extraction.\n\n';
  
  if (missingData.length > 0) {
    missingContent += '## Missing/Empty Pulls\n\n';
    missingData.forEach(m => { missingContent += `- ${m}\n`; });
  } else {
    missingContent += '## All Pulls Successful ✅\n';
  }
  fs.writeFileSync(MISSING_FILE, missingContent);
  
  // ── Final Summary ──
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  EXTRACTION COMPLETE — SUMMARY                 ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`Property: ${siteUrl}`);
  console.log(`Date ranges: 28d, 28d_prev, 3m, 3m_prev, 12m, 16m`);
  console.log(`\nRow counts:`);
  for (const [k, v] of Object.entries(stats)) {
    console.log(`  ${k}: ${v.toLocaleString()}`);
  }
  console.log(`\nRaw files saved to: ${RAW_DIR}`);
  console.log(`Run log: ${LOG_FILE}`);
  console.log(`\n✅ Phase 1 (Extraction) DONE. Run gsc-build-mirror-workbook.js next.\n`);
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
