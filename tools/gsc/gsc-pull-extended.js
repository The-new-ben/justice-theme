const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────
const SITE_URL = 'https://jus-tice.co.il/';
const OAUTH_FILE = path.join(__dirname, 'oauth-client.json');
const TOKEN_FILE = path.join(__dirname, 'gsc-token.json');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master', 'gsc');

// ── Brand signals (Hebrew + English variants) ────────────
const BRAND_TERMS = ['jus-tice', 'justice', 'ג\'סטיס', 'גסטיס', 'ג׳סטיס', 'jus tice', 'justiceil'];

const oauthCreds = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf8'));
const { client_id, client_secret } = oauthCreds.installed;
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3333');

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function toCsv(rows, columns) {
  if (!rows || rows.length === 0) return columns.join(',') + '\n';
  const header = columns.join(',');
  const body = rows.map(row => columns.map(col => {
    let val = row[col] !== undefined ? row[col] : '';
    val = String(val);
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(',')).join('\n');
  return header + '\n' + body + '\n';
}

function dateStr(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function isBranded(query) {
  const q = query.toLowerCase();
  return BRAND_TERMS.some(t => q.includes(t));
}

async function authenticate() {
  if (fs.existsSync(TOKEN_FILE)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oauth2Client.setCredentials(tokens);
    if (tokens.expiry_date && tokens.expiry_date > Date.now()) {
      console.log('Token valid.');
      return oauth2Client;
    }
    if (tokens.refresh_token) {
      console.log('Refreshing token...');
      const { credentials } = await oauth2Client.refreshAccessToken();
      credentials.refresh_token = tokens.refresh_token;
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials, null, 2));
      oauth2Client.setCredentials(credentials);
      console.log('Token refreshed.');
      return oauth2Client;
    }
  }
  throw new Error('Token invalid and no refresh token. Run gsc-pull.js first to re-authenticate.');
}

async function queryGSC(sc, siteUrl, body, label) {
  let allRows = [];
  let startRow = 0;
  const batchSize = 25000;
  while (true) {
    const res = await sc.searchanalytics.query({
      siteUrl,
      requestBody: { ...body, rowLimit: batchSize, startRow }
    });
    const rows = res.data.rows || [];
    allRows = allRows.concat(rows);
    process.stdout.write(`  ${label}: ${allRows.length} rows\r`);
    if (rows.length < batchSize) break;
    startRow += batchSize;
  }
  console.log(`  ${label}: ${allRows.length} rows ✓`);
  return allRows;
}

async function main() {
  console.log('╔══════════════════════════════════╗');
  console.log('║  GSC Extended Pull — jus-tice    ║');
  console.log('╚══════════════════════════════════╝\n');

  const auth = await authenticate();
  const sc = google.searchconsole({ version: 'v1', auth });
  ensureDir(OUTPUT_DIR);

  const today = dateStr(0);
  const start3m = dateStr(92);
  const start12m = dateStr(365);

  // ── 1. Pages 3m ─────────────────────────────────────────
  console.log('── Pages 3m...');
  const pages3m = await queryGSC(sc, SITE_URL, { startDate: start3m, endDate: today, dimensions: ['page'] }, 'pages-3m');
  const p3rows = pages3m.map(r => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_pages_3m.csv'), toCsv(p3rows, ['page','clicks','impressions','ctr','position']));

  // ── 2. Pages 12m ────────────────────────────────────────
  console.log('── Pages 12m...');
  const pages12m = await queryGSC(sc, SITE_URL, { startDate: start12m, endDate: today, dimensions: ['page'] }, 'pages-12m');
  const p12rows = pages12m.map(r => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_pages_12m.csv'), toCsv(p12rows, ['page','clicks','impressions','ctr','position']));

  // ── 3. Queries 3m ───────────────────────────────────────
  console.log('── Queries 3m...');
  const queries3m = await queryGSC(sc, SITE_URL, { startDate: start3m, endDate: today, dimensions: ['query'] }, 'queries-3m');
  const q3rows = queries3m.map(r => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_queries_3m.csv'), toCsv(q3rows, ['query','clicks','impressions','ctr','position']));

  // ── 4. Queries 12m ──────────────────────────────────────
  console.log('── Queries 12m...');
  const queries12m = await queryGSC(sc, SITE_URL, { startDate: start12m, endDate: today, dimensions: ['query'] }, 'queries-12m');
  const q12rows = queries12m.map(r => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_queries_12m.csv'), toCsv(q12rows, ['query','clicks','impressions','ctr','position']));

  // ── 5. Query+Page 3m (cannibalization) ──────────────────
  console.log('── Query+Page 3m...');
  const qp3m = await queryGSC(sc, SITE_URL, { startDate: start3m, endDate: today, dimensions: ['query','page'] }, 'qp-3m');
  const qp3rows = qp3m.map(r => ({ query: r.keys[0], page: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_query_page_3m.csv'), toCsv(qp3rows, ['query','page','clicks','impressions','ctr','position']));

  // ── 6. Query+Page 12m ───────────────────────────────────
  console.log('── Query+Page 12m...');
  const qp12m = await queryGSC(sc, SITE_URL, { startDate: start12m, endDate: today, dimensions: ['query','page'] }, 'qp-12m');
  const qp12rows = qp12m.map(r => ({ query: r.keys[0], page: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_query_page_12m.csv'), toCsv(qp12rows, ['query','page','clicks','impressions','ctr','position']));

  // ── 7. Device split 3m ──────────────────────────────────
  console.log('── Device split 3m...');
  const deviceRows = await queryGSC(sc, SITE_URL, { startDate: start3m, endDate: today, dimensions: ['page','device'] }, 'device');
  const devRows = deviceRows.map(r => ({ page: r.keys[0], device: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_device_split.csv'), toCsv(devRows, ['page','device','clicks','impressions','ctr','position']));

  // ── 8. Country split 3m ─────────────────────────────────
  console.log('── Country split 3m...');
  const countryRows = await queryGSC(sc, SITE_URL, { startDate: start3m, endDate: today, dimensions: ['page','country'] }, 'country');
  const ctRows = countryRows.map(r => ({ page: r.keys[0], country: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: (r.ctr*100).toFixed(2)+'%', position: r.position.toFixed(1) }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_country_split.csv'), toCsv(ctRows, ['page','country','clicks','impressions','ctr','position']));

  // ── 9. Branded vs Non-branded (3m) ──────────────────────
  console.log('── Branded vs Non-branded...');
  const branded = q3rows.filter(r => isBranded(r.query));
  const nonBranded = q3rows.filter(r => !isBranded(r.query));
  const bRows = [
    ...branded.map(r => ({ ...r, type: 'BRANDED' })),
    ...nonBranded.slice(0, 5000).map(r => ({ ...r, type: 'NON_BRANDED' }))
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_branded_vs_nonbranded.csv'), toCsv(bRows, ['query','clicks','impressions','ctr','position','type']));
  console.log(`  Branded: ${branded.length}, Non-branded: ${nonBranded.length}`);

  // ── 10. Cannibalization map (3m) ────────────────────────
  console.log('── Cannibalization map (3m)...');
  const queryPageMap = {};
  qp3rows.forEach(row => {
    if (!queryPageMap[row.query]) queryPageMap[row.query] = [];
    queryPageMap[row.query].push(row);
  });
  const cannibRows = [];
  Object.entries(queryPageMap).forEach(([query, pages]) => {
    if (pages.length > 1) {
      cannibRows.push({
        query, page_count: pages.length,
        total_clicks: pages.reduce((s,p) => s + p.clicks, 0),
        total_impressions: pages.reduce((s,p) => s + p.impressions, 0),
        pages: pages.map(p => p.page).join(' | '),
        positions: pages.map(p => p.position).join(' | ')
      });
    }
  });
  cannibRows.sort((a,b) => b.total_impressions - a.total_impressions);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_cannibalization_map.csv'), toCsv(cannibRows, ['query','page_count','total_clicks','total_impressions','pages','positions']));
  console.log(`  Cannibalization groups: ${cannibRows.length}`);

  // ── 11. Low CTR opportunities ────────────────────────────
  console.log('── Low CTR opportunities...');
  const lowCtr = p12rows.filter(r => r.impressions >= 1000 && parseFloat(r.ctr) < 2);
  lowCtr.sort((a,b) => b.impressions - a.impressions);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_low_ctr_opportunities.csv'), toCsv(lowCtr, ['page','clicks','impressions','ctr','position']));
  console.log(`  Low CTR rows: ${lowCtr.length}`);

  // ── 12. Striking distance ────────────────────────────────
  console.log('── Striking distance...');
  const striking = p12rows.filter(r => parseFloat(r.position) >= 5 && parseFloat(r.position) <= 20 && r.impressions >= 500);
  striking.sort((a,b) => b.impressions - a.impressions);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_striking_distance.csv'), toCsv(striking, ['page','clicks','impressions','ctr','position']));
  console.log(`  Striking distance rows: ${striking.length}`);

  // ── 13. Traffic drop (high impressions, poor position) ──
  console.log('── Traffic drop analysis...');
  const drop = p12rows.filter(r => parseFloat(r.position) > 30 && r.impressions >= 2000);
  drop.sort((a,b) => b.impressions - a.impressions);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'gsc_traffic_drop_analysis.csv'), toCsv(drop, ['page','clicks','impressions','ctr','position']));
  console.log(`  Traffic drop rows: ${drop.length}`);

  // ── Summary ─────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════╗');
  console.log('║  EXTENDED GSC PULL COMPLETE      ║');
  console.log('╚══════════════════════════════════╝');
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Pages 3m: ${p3rows.length} | Pages 12m: ${p12rows.length}`);
  console.log(`Queries 3m: ${q3rows.length} | Queries 12m: ${q12rows.length}`);
  console.log(`Query+Page 3m: ${qp3rows.length} | Query+Page 12m: ${qp12rows.length}`);
  console.log(`Device: ${devRows.length} | Country: ${ctRows.length}`);
  console.log(`Cannibalization: ${cannibRows.length} | Low CTR: ${lowCtr.length} | Striking: ${striking.length}`);
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
