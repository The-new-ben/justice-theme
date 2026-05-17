#!/usr/bin/env node
/**
 * Cycle 1B: GSC URL export — pages + query/page data for 12m and 3m.
 * Uses existing OAuth credentials from tools/gsc/.
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const GSC_DIR = path.join(__dirname, '..', '..', '..', '..', 'tools', 'gsc');
const OUT_DIR = path.join(__dirname, '..', 'output', 'gsc');
const SITE = 'https://jus-tice.co.il/';  // URL-prefix property
const ROW_LIMIT = 25000;

async function getAuth() {
  const creds = JSON.parse(fs.readFileSync(path.join(GSC_DIR, 'oauth-client.json'), 'utf8'));
  const token = JSON.parse(fs.readFileSync(path.join(GSC_DIR, 'gsc-token.json'), 'utf8'));
  const { client_id, client_secret, redirect_uris } = creds.installed;
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  auth.setCredentials(token);
  return auth;
}

function dateStr(daysAgo) {
  const d = new Date(); d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function fetchGSC(wm, dims, startDate, endDate) {
  const all = []; let startRow = 0;
  while (true) {
    const res = await wm.searchanalytics.query({
      siteUrl: SITE,
      requestBody: { startDate, endDate, dimensions: dims, rowLimit: ROW_LIMIT, startRow, dataState: 'all' }
    });
    const rows = res.data.rows || [];
    if (!rows.length) break;
    all.push(...rows);
    console.log(`  fetched ${all.length} rows (startRow=${startRow})`);
    if (rows.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return all;
}

function saveCsv(file, header, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const esc = s => `"${String(s||'').replace(/"/g,'""')}"`;
  const lines = rows.map(r => r.map(c => typeof c === 'string' ? esc(c) : c).join(','));
  fs.writeFileSync(file, header + '\n' + lines.join('\n'), 'utf8');
  console.log(`  Saved ${rows.length} rows → ${path.basename(file)}`);
}

async function main() {
  console.log('=== GSC URL EXPORT ===\n');
  const auth = await getAuth();
  const wm = google.searchconsole({ version: 'v1', auth }).searchAnalytics ? 
    google.webmasters({ version: 'v3', auth }) :
    google.webmasters({ version: 'v3', auth });
  
  // Actually use searchconsole API
  const sc = google.searchconsole({ version: 'v1', auth });

  const end = dateStr(3);
  const start12m = dateStr(365);
  const start3m = dateStr(90);

  // 1. Pages 12m
  console.log('Fetching pages 12m...');
  const pages12 = await fetchGSC(sc, ['page'], start12m, end);
  saveCsv(path.join(OUT_DIR, 'gsc_pages_12m.csv'), 'page,clicks,impressions,ctr,position',
    pages12.map(r => [r.keys[0], r.clicks, r.impressions, r.ctr?.toFixed(4), r.position?.toFixed(1)]));

  // 2. Pages 3m
  console.log('Fetching pages 3m...');
  const pages3 = await fetchGSC(sc, ['page'], start3m, end);
  saveCsv(path.join(OUT_DIR, 'gsc_pages_3m.csv'), 'page,clicks,impressions,ctr,position',
    pages3.map(r => [r.keys[0], r.clicks, r.impressions, r.ctr?.toFixed(4), r.position?.toFixed(1)]));

  // 3. Query+Page 12m
  console.log('Fetching query+page 12m...');
  const qp12 = await fetchGSC(sc, ['query', 'page'], start12m, end);
  saveCsv(path.join(OUT_DIR, 'gsc_query_page_12m.csv'), 'query,page,clicks,impressions,ctr,position',
    qp12.map(r => [r.keys[0], r.keys[1], r.clicks, r.impressions, r.ctr?.toFixed(4), r.position?.toFixed(1)]));

  // 4. Query+Page 3m
  console.log('Fetching query+page 3m...');
  const qp3 = await fetchGSC(sc, ['query', 'page'], start3m, end);
  saveCsv(path.join(OUT_DIR, 'gsc_query_page_3m.csv'), 'query,page,clicks,impressions,ctr,position',
    qp3.map(r => [r.keys[0], r.keys[1], r.clicks, r.impressions, r.ctr?.toFixed(4), r.position?.toFixed(1)]));

  // 5. Build normalized inventory
  console.log('\nBuilding gsc-url-inventory.csv...');
  const urlMap = {};
  for (const r of pages12) {
    const u = r.keys[0];
    if (!urlMap[u]) urlMap[u] = { clicks12: 0, imp12: 0, clicks3: 0, imp3: 0, queries: [] };
    urlMap[u].clicks12 = r.clicks;
    urlMap[u].imp12 = r.impressions;
  }
  for (const r of pages3) {
    const u = r.keys[0];
    if (!urlMap[u]) urlMap[u] = { clicks12: 0, imp12: 0, clicks3: 0, imp3: 0, queries: [] };
    urlMap[u].clicks3 = r.clicks;
    urlMap[u].imp3 = r.impressions;
  }
  for (const r of qp12) {
    const u = r.keys[1];
    if (!urlMap[u]) urlMap[u] = { clicks12: 0, imp12: 0, clicks3: 0, imp3: 0, queries: [] };
    if (urlMap[u].queries.length < 5 && !urlMap[u].queries.includes(r.keys[0])) {
      urlMap[u].queries.push(r.keys[0]);
    }
  }

  const invRows = [];
  for (const [url, d] of Object.entries(urlMap)) {
    let p; try { p = new URL(url).pathname; } catch { p = url; }
    const hasPrefix = p.startsWith('/articles/') ? 'YES' : 'NO';
    let risk = 'LOW';
    if (d.clicks12 >= 100 || d.imp12 >= 20000) risk = 'HIGH';
    else if (d.clicks12 >= 10 || d.imp12 >= 1000) risk = 'MEDIUM';
    invRows.push([url, p, d.clicks12, d.imp12, d.clicks3, d.imp3, d.queries.join(' | '), hasPrefix, risk]);
  }

  saveCsv(path.join(OUT_DIR, 'gsc-url-inventory.csv'),
    'gsc_url,gsc_path,clicks_12m,impressions_12m,clicks_3m,impressions_3m,top_queries,has_articles_prefix,traffic_risk',
    invRows);

  // Summary stats
  const withPrefix = invRows.filter(r => r[7] === 'YES').length;
  const withoutPrefix = invRows.filter(r => r[7] === 'NO').length;
  const highRisk = invRows.filter(r => r[8] === 'HIGH').length;
  const medRisk = invRows.filter(r => r[8] === 'MEDIUM').length;

  console.log(`\n=== GSC EXPORT COMPLETE ===`);
  console.log(`Total unique GSC URLs: ${invRows.length}`);
  console.log(`  With /articles/ prefix: ${withPrefix}`);
  console.log(`  Without /articles/ prefix: ${withoutPrefix}`);
  console.log(`  HIGH traffic risk: ${highRisk}`);
  console.log(`  MEDIUM traffic risk: ${medRisk}`);
  console.log(`  LOW traffic risk: ${invRows.length - highRisk - medRisk}`);
}

main().catch(e => { console.error('FATAL:', e.message || e); process.exit(1); });
