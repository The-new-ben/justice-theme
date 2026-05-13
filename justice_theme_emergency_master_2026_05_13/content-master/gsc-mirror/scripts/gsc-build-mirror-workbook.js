/**
 * gsc-build-mirror-workbook.js — Builds the complete GSC Mirror from raw exports
 * Reads all raw CSVs, builds analysis sheets, writes final CSVs + XLSX workbook.
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const MIRROR = path.join(__dirname, '..');
const RAW = path.join(MIRROR, 'raw');

// CSV parser
function parseCsv(fp) {
  if (!fs.existsSync(fp)) return [];
  const lines = fs.readFileSync(fp, 'utf8').trim().split('\n');
  if (lines.length < 2) return [];
  const hdrs = lines[0].split(',');
  return lines.slice(1).map(line => {
    const vals = []; let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { if (q && line[i+1] === '"') { cur += '"'; i++; } else q = !q; }
      else if (line[i] === ',' && !q) { vals.push(cur); cur = ''; }
      else cur += line[i];
    }
    vals.push(cur);
    const obj = {};
    hdrs.forEach((h, i) => { obj[h.trim()] = vals[i] || ''; });
    return obj;
  });
}

function csvEsc(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function writeCsv(fp, hdrs, rows) {
  const lines = [hdrs.join(',')];
  for (const r of rows) lines.push(hdrs.map(h => csvEsc(r[h] !== undefined ? r[h] : '')).join(','));
  fs.writeFileSync(fp, lines.join('\n') + '\n', 'utf8');
}

function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function normUrl(u) { return (u || '').replace(/\/$/, '').toLowerCase(); }

// Money keywords
const MONEY_KW = ['עורך דין','עורכי דין','עורך דין פלילי','עורך דין גירושין','עורך דין משפחה',
  'עורך דין מקרקעין','עורך דין רשלנות רפואית','עורך דין תעבורה','עורך דין נזיקין',
  'עורך דין עבודה','עורך דין ירושה','ייעוץ לפני חקירה','חקירה במשטרה','מעצר','כתב אישום'];

function isBranded(q) { return /jus.?tice|ג'סטיס|ג׳סטיס/i.test(q); }
function isMoney(q) { return MONEY_KW.some(k => q.includes(k)); }
function isCriminal(q) { return /פלילי|criminal|מעצר|חקירה|כתב אישום|שימוע|משטרה|עבירה|גניבה|סמים|אלימות/i.test(q); }
function isFamily(q) { return /גירושין|משפחה|מזונות|משמורת|הסכם ממון|divorce|family|בית דין רבני/i.test(q); }

console.log('╔═══════════════════════════════════════════╗');
console.log('║  GSC MIRROR WORKBOOK BUILDER               ║');
console.log('╚═══════════════════════════════════════════╝\n');

// ── Load raw data ──
console.log('[LOAD] Reading raw CSVs...');
const pages28d = parseCsv(path.join(RAW, 'gsc_pages_28d.csv'));
const pages3m = parseCsv(path.join(RAW, 'gsc_pages_3m.csv'));
const pages12m = parseCsv(path.join(RAW, 'gsc_pages_12m.csv'));
const pages16m = parseCsv(path.join(RAW, 'gsc_pages_16m.csv'));
const qp28d = parseCsv(path.join(RAW, 'gsc_query_page_28d.csv'));
const qp3m = parseCsv(path.join(RAW, 'gsc_query_page_3m.csv'));
const qp12m = parseCsv(path.join(RAW, 'gsc_query_page_12m.csv'));
const qp16m = parseCsv(path.join(RAW, 'gsc_query_page_16m.csv'));
const queries12m = parseCsv(path.join(RAW, 'gsc_queries_12m.csv'));
const queries28d = parseCsv(path.join(RAW, 'gsc_queries_28d.csv'));
const queries3m = parseCsv(path.join(RAW, 'gsc_queries_3m.csv'));
const deviceData = parseCsv(path.join(RAW, 'gsc_device_split.csv'));
const countryData = parseCsv(path.join(RAW, 'gsc_country_split.csv'));
const pageDateCur = parseCsv(path.join(RAW, 'gsc_page_date_28d.csv'));
const pageDatePrev = parseCsv(path.join(RAW, 'gsc_page_date_28d_prev.csv'));

console.log(`  pages: 28d=${pages28d.length} 3m=${pages3m.length} 12m=${pages12m.length} 16m=${pages16m.length}`);
console.log(`  qp: 28d=${qp28d.length} 3m=${qp3m.length} 12m=${qp12m.length} 16m=${qp16m.length}`);
console.log(`  queries: 28d=${queries28d.length} 3m=${queries3m.length} 12m=${queries12m.length}`);
console.log(`  device=${deviceData.length} country=${countryData.length}`);

// ── 1. URL MASTER ──
console.log('\n[BUILD] URL Master...');
const urlMap = {};
function mergePages(rows, suffix) {
  for (const r of rows) {
    const u = normUrl(r.page);
    if (!urlMap[u]) urlMap[u] = { url: u };
    urlMap[u][`clicks_${suffix}`] = num(r.clicks);
    urlMap[u][`impressions_${suffix}`] = num(r.impressions);
    urlMap[u][`ctr_${suffix}`] = (num(r.ctr) * 100).toFixed(2) + '%';
    urlMap[u][`position_${suffix}`] = num(r.position).toFixed(1);
  }
}
mergePages(pages28d, '28d'); mergePages(pages3m, '3m');
mergePages(pages12m, '12m'); mergePages(pages16m, '16m');

// Attach top queries from qp12m
const qpByUrl = {};
for (const r of qp12m) {
  const u = normUrl(r.page);
  if (!qpByUrl[u]) qpByUrl[u] = [];
  qpByUrl[u].push({ q: r.query, clicks: num(r.clicks), imp: num(r.impressions), pos: num(r.position) });
}
for (const u of Object.keys(qpByUrl)) {
  qpByUrl[u].sort((a, b) => b.clicks - a.clicks || b.imp - a.imp);
}

// Device data
const devByUrl = {};
for (const r of deviceData) {
  const u = normUrl(r.page);
  if (!devByUrl[u]) devByUrl[u] = {};
  devByUrl[u][r.device] = { clicks: num(r.clicks), imp: num(r.impressions) };
}

// Country data - just main country
const cntByUrl = {};
for (const r of countryData) {
  const u = normUrl(r.page);
  if (!cntByUrl[u] || num(r.clicks) > cntByUrl[u].clicks) {
    cntByUrl[u] = { country: r.country, clicks: num(r.clicks) };
  }
}

// Build URL master rows
const urlRows = Object.values(urlMap).map(u => {
  const topQ = (qpByUrl[u.url] || []).slice(0, 5);
  const allQ = qpByUrl[u.url] || [];
  const cannibQueries = [];
  const clicks12 = num(u.clicks_12m) || 0;
  const imp12 = num(u.impressions_12m) || 0;
  const clicks28 = num(u.clicks_28d) || 0;
  const dev = devByUrl[u.url] || {};
  const cnt = cntByUrl[u.url] || {};
  
  let risk = 'LOW';
  if (clicks12 >= 100 || imp12 >= 20000) risk = 'HIGH';
  else if (clicks12 >= 10 || imp12 >= 1000) risk = 'MEDIUM';

  const row = {
    url: u.url, clicks_28d: u.clicks_28d||0, impressions_28d: u.impressions_28d||0,
    ctr_28d: u.ctr_28d||'0%', position_28d: u.position_28d||0,
    clicks_3m: u.clicks_3m||0, impressions_3m: u.impressions_3m||0,
    ctr_3m: u.ctr_3m||'0%', position_3m: u.position_3m||0,
    clicks_12m: u.clicks_12m||0, impressions_12m: u.impressions_12m||0,
    ctr_12m: u.ctr_12m||'0%', position_12m: u.position_12m||0,
    clicks_16m: u.clicks_16m||0, impressions_16m: u.impressions_16m||0,
    ctr_16m: u.ctr_16m||'0%', position_16m: u.position_16m||0,
    query_count: allQ.length, traffic_risk: risk,
    mobile_clicks: (dev.MOBILE||{}).clicks||0, desktop_clicks: (dev.DESKTOP||{}).clicks||0,
    mobile_impressions: (dev.MOBILE||{}).imp||0, desktop_impressions: (dev.DESKTOP||{}).imp||0,
    main_country: cnt.country||'',
  };
  for (let i = 0; i < 5; i++) {
    const tq = topQ[i] || {};
    row[`top_query_${i+1}`] = tq.q || '';
    row[`top_query_${i+1}_clicks`] = tq.clicks || 0;
    row[`top_query_${i+1}_impressions`] = tq.imp || 0;
    row[`top_query_${i+1}_position`] = tq.pos ? tq.pos.toFixed(1) : '';
  }
  return row;
});

urlRows.sort((a, b) => num(b.clicks_12m) - num(a.clicks_12m));
const urlHdrs = ['url','clicks_28d','impressions_28d','ctr_28d','position_28d',
  'clicks_3m','impressions_3m','ctr_3m','position_3m',
  'clicks_12m','impressions_12m','ctr_12m','position_12m',
  'clicks_16m','impressions_16m','ctr_16m','position_16m',
  'top_query_1','top_query_1_clicks','top_query_1_impressions','top_query_1_position',
  'top_query_2','top_query_2_clicks','top_query_2_impressions','top_query_2_position',
  'top_query_3','top_query_3_clicks','top_query_3_impressions','top_query_3_position',
  'top_query_4','top_query_4_clicks','top_query_4_impressions','top_query_4_position',
  'top_query_5','top_query_5_clicks','top_query_5_impressions','top_query_5_position',
  'query_count','traffic_risk','mobile_clicks','desktop_clicks',
  'mobile_impressions','desktop_impressions','main_country'];
writeCsv(path.join(MIRROR, 'gsc-url-master.csv'), urlHdrs, urlRows);
console.log(`  ✅ ${urlRows.length} URLs`);

// ── 2. QUERY+PAGE MASTER ──
console.log('[BUILD] Query+Page Master...');
const qpRows = qp12m.map(r => ({
  query: r.query, page: r.page, clicks: num(r.clicks), impressions: num(r.impressions),
  ctr: (num(r.ctr)*100).toFixed(2)+'%', position: num(r.position).toFixed(1),
  is_branded: isBranded(r.query) ? 'TRUE' : 'FALSE',
  is_money_keyword: isMoney(r.query) ? 'TRUE' : 'FALSE',
  is_criminal_law: isCriminal(r.query) ? 'TRUE' : 'FALSE',
  is_family_law: isFamily(r.query) ? 'TRUE' : 'FALSE',
}));
writeCsv(path.join(MIRROR, 'gsc-query-page-master.csv'),
  ['query','page','clicks','impressions','ctr','position','is_branded','is_money_keyword','is_criminal_law','is_family_law'], qpRows);
console.log(`  ✅ ${qpRows.length} query+page pairs`);

// ── 3. QUERY MASTER ──
console.log('[BUILD] Query Master...');
const qMap = {};
for (const r of qp12m) {
  const q = r.query;
  if (!qMap[q]) qMap[q] = { query: q, clicks: 0, impressions: 0, posSum: 0, pages: {} };
  qMap[q].clicks += num(r.clicks);
  qMap[q].impressions += num(r.impressions);
  qMap[q].posSum += num(r.position) * num(r.impressions);
  if (!qMap[q].pages[r.page]) qMap[q].pages[r.page] = { clicks: 0, imp: 0, pos: num(r.position) };
  qMap[q].pages[r.page].clicks += num(r.clicks);
  qMap[q].pages[r.page].imp += num(r.impressions);
}
const queryRows = Object.values(qMap).map(q => {
  const pList = Object.entries(q.pages).map(([p, s]) => ({ p, ...s })).sort((a,b) => b.clicks - a.clicks);
  const avgPos = q.impressions > 0 ? (q.posSum / q.impressions).toFixed(1) : '0';
  return {
    query: q.query, clicks_12m: q.clicks, impressions_12m: q.impressions,
    ctr_12m: q.impressions > 0 ? ((q.clicks/q.impressions)*100).toFixed(2)+'%' : '0%',
    position_12m: avgPos,
    ranking_page_count: pList.length,
    top_page: pList[0]?.p || '', top_page_clicks: pList[0]?.clicks || 0,
    competing_pages: pList.slice(1, 4).map(p => p.p).join(' | '),
    cannibalization_flag: pList.length > 1 ? 'TRUE' : 'FALSE',
    branded_flag: isBranded(q.query) ? 'TRUE' : 'FALSE',
    money_keyword_flag: isMoney(q.query) ? 'TRUE' : 'FALSE',
  };
}).sort((a,b) => b.clicks_12m - a.clicks_12m);
writeCsv(path.join(MIRROR, 'gsc-query-master.csv'),
  ['query','clicks_12m','impressions_12m','ctr_12m','position_12m','ranking_page_count',
   'top_page','top_page_clicks','competing_pages','cannibalization_flag','branded_flag','money_keyword_flag'], queryRows);
console.log(`  ✅ ${queryRows.length} queries`);

// ── 4. CANNIBALIZATION ──
console.log('[BUILD] Cannibalization Map...');
const cannibRows = queryRows.filter(q => q.cannibalization_flag === 'TRUE' && q.impressions_12m >= 50 && q.branded_flag === 'FALSE')
  .map(q => {
    const pList = Object.entries(qMap[q.query].pages).map(([p,s]) => ({p,...s})).sort((a,b) => b.clicks-a.clicks);
    return {
      query: q.query, total_clicks: q.clicks_12m, total_impressions: q.impressions_12m,
      avg_position: q.position_12m, page_count: pList.length,
      best_page: pList[0]?.p||'', best_page_clicks: pList[0]?.clicks||0,
      best_page_impressions: pList[0]?.imp||0,
      second_page: pList[1]?.p||'', second_page_clicks: pList[1]?.clicks||0,
      third_page: pList[2]?.p||'',
      risk_level: q.impressions_12m >= 5000 ? 'HIGH' : q.impressions_12m >= 500 ? 'MEDIUM' : 'LOW',
    };
  }).sort((a,b) => b.total_impressions - a.total_impressions);
writeCsv(path.join(MIRROR, 'gsc-cannibalization-map.csv'),
  ['query','total_clicks','total_impressions','avg_position','page_count','best_page','best_page_clicks',
   'best_page_impressions','second_page','second_page_clicks','third_page','risk_level'], cannibRows);
console.log(`  ✅ ${cannibRows.length} cannibalized queries`);

// ── 5. LOW CTR ──
console.log('[BUILD] Low CTR Opportunities...');
const lowCtr = qpRows.filter(r => num(r.impressions) >= 1000 && parseFloat(r.ctr) < 2)
  .map(r => ({ ...r, priority: num(r.impressions) >= 5000 ? 'HIGH' : 'MEDIUM' }))
  .sort((a,b) => num(b.impressions) - num(a.impressions));
writeCsv(path.join(MIRROR, 'gsc-low-ctr-opportunities.csv'),
  ['query','page','clicks','impressions','ctr','position','priority'], lowCtr);
console.log(`  ✅ ${lowCtr.length} low CTR opportunities`);

// ── 6. STRIKING DISTANCE ──
console.log('[BUILD] Striking Distance...');
const striking = qpRows.filter(r => {
  const pos = num(r.position);
  return pos >= 5 && pos <= 20 && num(r.impressions) >= 100;
}).map(r => ({ ...r, priority: num(r.impressions) >= 1000 ? 'HIGH' : 'MEDIUM' }))
  .sort((a,b) => num(b.impressions) - num(a.impressions));
writeCsv(path.join(MIRROR, 'gsc-striking-distance.csv'),
  ['query','page','clicks','impressions','ctr','position','is_money_keyword','is_criminal_law','priority'], striking);
console.log(`  ✅ ${striking.length} striking distance opportunities`);

// ── 7. TRAFFIC DROP ──
console.log('[BUILD] Traffic Drop Analysis...');
// Aggregate page_date by page for 28d current vs 28d previous
const agg28cur = {}, agg28prev = {};
for (const r of pageDateCur) { const u = normUrl(r.page); if (!agg28cur[u]) agg28cur[u] = {c:0,i:0}; agg28cur[u].c += num(r.clicks); agg28cur[u].i += num(r.impressions); }
for (const r of pageDatePrev) { const u = normUrl(r.page); if (!agg28prev[u]) agg28prev[u] = {c:0,i:0}; agg28prev[u].c += num(r.clicks); agg28prev[u].i += num(r.impressions); }
const allDropUrls = new Set([...Object.keys(agg28cur), ...Object.keys(agg28prev)]);
const dropRows = [];
for (const u of allDropUrls) {
  const cur = agg28cur[u] || {c:0,i:0};
  const prev = agg28prev[u] || {c:0,i:0};
  const clickChange = cur.c - prev.c;
  const pct = prev.c > 0 ? ((clickChange / prev.c) * 100).toFixed(1) : (cur.c > 0 ? '100' : '0');
  let risk = 'STABLE';
  if (num(pct) <= -50 && prev.c >= 10) risk = 'CRITICAL_DROP';
  else if (num(pct) <= -30 && prev.c >= 5) risk = 'HIGH_DROP';
  else if (num(pct) <= -15) risk = 'MEDIUM_DROP';
  else if (num(pct) >= 30 && cur.c >= 5) risk = 'GROWING';
  if (risk === 'STABLE' && prev.c < 3) continue;
  dropRows.push({
    page: u, current_clicks: cur.c, previous_clicks: prev.c,
    click_change: clickChange, click_change_percent: pct + '%',
    current_impressions: cur.i, previous_impressions: prev.i, risk_level: risk,
  });
}
dropRows.sort((a,b) => num(a.click_change) - num(b.click_change));
writeCsv(path.join(MIRROR, 'gsc-traffic-drop-analysis.csv'),
  ['page','current_clicks','previous_clicks','click_change','click_change_percent',
   'current_impressions','previous_impressions','risk_level'], dropRows);
console.log(`  ✅ ${dropRows.length} traffic trend rows`);

// ── 8. DEVICE SPLIT CSV ──
console.log('[BUILD] Device Split...');
const devRows = deviceData.map(r => ({
  page: r.page, device: r.device, clicks: num(r.clicks), impressions: num(r.impressions),
  ctr: (num(r.ctr)*100).toFixed(2)+'%', position: num(r.position).toFixed(1),
}));
writeCsv(path.join(MIRROR, 'gsc-device-split.csv'), ['page','device','clicks','impressions','ctr','position'], devRows);
console.log(`  ✅ ${devRows.length} device rows`);

// ── 9. COUNTRY SPLIT CSV ──
console.log('[BUILD] Country Split...');
const cntRows = countryData.map(r => ({
  page: r.page, country: r.country, clicks: num(r.clicks), impressions: num(r.impressions),
  ctr: (num(r.ctr)*100).toFixed(2)+'%', position: num(r.position).toFixed(1),
  main_country_flag: r.country === 'isr' ? 'TRUE' : 'FALSE',
})).sort((a,b) => num(b.clicks) - num(a.clicks));
writeCsv(path.join(MIRROR, 'gsc-country-split.csv'),
  ['page','country','clicks','impressions','ctr','position','main_country_flag'], cntRows);
console.log(`  ✅ ${cntRows.length} country rows`);

// ── 10. XLSX WORKBOOK ──
console.log('\n[XLSX] Building workbook...');
const wb = XLSX.utils.book_new();

function addSheet(name, data) {
  if (!data || data.length === 0) { data = [{ note: 'No data available' }]; }
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31));
}

addSheet('URL_MASTER', urlRows);
addSheet('QUERY_PAGE', qpRows.slice(0, 65000));
addSheet('QUERY_MASTER', queryRows);
addSheet('CANNIBALIZATION', cannibRows);
addSheet('LOW_CTR', lowCtr);
addSheet('STRIKING_DISTANCE', striking.slice(0, 65000));
addSheet('TRAFFIC_DROP', dropRows);
addSheet('DEVICE', devRows);
addSheet('COUNTRY', cntRows.slice(0, 65000));

// Criminal Law filter
const crimUrls = urlRows.filter(r => {
  const tqs = [r.top_query_1, r.top_query_2, r.top_query_3].join(' ');
  return isCriminal(tqs) || r.url.includes('criminal') || r.url.includes('%d7%a4%d7%9c%d7%99%d7%9c');
});
addSheet('CRIMINAL_LAW', crimUrls);

// Money keywords
const moneyQ = queryRows.filter(r => r.money_keyword_flag === 'TRUE');
addSheet('MONEY_KEYWORDS', moneyQ);

const wbPath = path.join(MIRROR, 'gsc-mirror-master.xlsx');
XLSX.writeFile(wb, wbPath);
console.log(`  ✅ Workbook saved: ${wbPath}`);
console.log(`     Sheets: URL_MASTER, QUERY_PAGE, QUERY_MASTER, CANNIBALIZATION, LOW_CTR,`);
console.log(`     STRIKING_DISTANCE, TRAFFIC_DROP, DEVICE, COUNTRY, CRIMINAL_LAW, MONEY_KEYWORDS`);

// ── SUMMARY ──
console.log('\n╔═══════════════════════════════════════════╗');
console.log('║  MIRROR BUILD COMPLETE                     ║');
console.log('╚═══════════════════════════════════════════╝');
console.log(`\nURL Master: ${urlRows.length} URLs`);
console.log(`Query+Page: ${qpRows.length} pairs`);
console.log(`Query Master: ${queryRows.length} queries`);
console.log(`Cannibalization: ${cannibRows.length} groups`);
console.log(`Low CTR: ${lowCtr.length} opportunities`);
console.log(`Striking Distance: ${striking.length} opportunities`);
console.log(`Traffic Drops: ${dropRows.filter(r=>r.risk_level.includes('DROP')).length} declining`);
console.log(`Criminal Law URLs: ${crimUrls.length}`);
console.log(`Money Keywords: ${moneyQ.length}`);
console.log(`\nTop 10 pages by clicks (12m):`);
urlRows.slice(0, 10).forEach((r, i) => console.log(`  ${i+1}. ${r.url} — ${r.clicks_12m} clicks`));
console.log(`\nTop 5 cannibalized queries:`);
cannibRows.slice(0, 5).forEach((r, i) => console.log(`  ${i+1}. "${r.query}" — ${r.page_count} pages, ${r.total_impressions} imp`));
