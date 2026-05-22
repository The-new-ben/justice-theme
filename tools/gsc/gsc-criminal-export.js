const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const DEFAULT_SITE_URL = 'https://jus-tice.co.il/';
const DEFAULT_PORT = 3333;
const DEFAULT_DAYS = 487;
const DEFAULT_MAX_ROWS = 250000;

const TARGET_PATHS = [
  '/criminal-defense-attorney/',
  '/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/',
  '/detention-before-charge-or-trial/',
  '/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/',
  '/drug-offenses-criminal-lawyer/',
];

const PROTECTED_SOURCE_PATHS = [
  '/%D7%AA%D7%97%D7%A0%D7%95%D7%AA-%D7%9E%D7%A9%D7%98%D7%A8%D7%94-%D7%9B%D7%AA%D7%95%D7%91%D7%AA-%D7%98%D7%9C%D7%A4%D7%95%D7%9F-%D7%A8%D7%A9%D7%99%D7%9E%D7%94-%D7%90%D7%A8%D7%A6%D7%99%D7%AA-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F',
  '/%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%93%D7%99%D7%9F/%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%94%D7%93%D7%99%D7%9F-%D7%94%D7%9E%D7%A4%D7%95%D7%A8%D7%A1%D7%9E%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%AA%D7%A8-%D7%9C%D7%94%D7%92%D7%A0%D7%94-%D7%A4%D7%9C%D7%99%D7%9C',
  '/apply-for-police-criminal-information-certificates/',
  '/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A4%D7%9C%D7%99%D7%9C%D7%99',
  '/sex-crime-lawyer/',
  '/drug-related-crime/',
  '/how-much-will-a-criminal-defense-lawyer-cost/',
  '/tax-investigation-guide/',
  '/traffic-lawyer/',
  '/famous-criminal-defense-lawyer/',
  '/lawyer-near-me-criminal-law/',
  '/what-is-money-laundering/',
  '/sexual-offenses/',
  '/economic-crimes-white-collar-lawyer/',
  '/leading-criminal-law-firm/',
  '/%D7%94%D7%9C%D7%99%D7%9A-%D7%94%D7%9E%D7%A2%D7%A6%D7%A8-%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%9E%D7%A2%D7%A6%D7%A8%D7%99%D7%9D-%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A2%D7%95%D7%93-%D7%A4%D7%9C%D7%99%D7%9C%D7%99',
  '/criminal-defense-attorney-roles-and-responsibilities/',
  '/criminal-lawyer/',
  '/%D7%9E%D7%A9%D7%A8%D7%93-%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%93%D7%99%D7%9F-%D7%A4%D7%9C%D7%99%D7%9C%D7%99-%D7%94%D7%9B%D7%99-%D7%98%D7%95%D7%91-%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91/',
  '/%D7%AA%D7%97%D7%95%D7%9E%D7%99-%D7%94%D7%AA%D7%9E%D7%97%D7%95%D7%AA/%D7%9E%D7%A9%D7%A4%D7%98-%D7%A4%D7%9C%D7%99%D7%9C%D7%99/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A4%D7%9C%D7%99%D7%9C%D7%99-%D7%A4%D7%A1%D7%A7%D7%99-%D7%93%D7%99%D7%9F-2022/',
];

const CRIMINAL_QUERY_TERMS = [
  'עורך דין פלילי',
  'עו"ד פלילי',
  'עוד פלילי',
  'פלילי',
  'דין פלילי',
  'משפט פלילי',
  'חקירה במשטרה',
  'ייעוץ לפני חקירה',
  'חקירה באזהרה',
  'מעצר ימים',
  'מעצר',
  'עורך דין מעצרים',
  'כתב אישום',
  'ביטול כתב אישום',
  'שימוע פלילי',
  'עבירות סמים',
  'סחר בסמים',
  'החזקת סמים',
  'מרשם פלילי',
  'רישום פלילי',
  'מחיקת רישום פלילי',
  'criminal lawyer',
  'criminal defense',
  'criminal law',
  'police investigation',
  'indictment',
  'drug offenses',
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    siteUrl: process.env.GSC_SITE_URL || DEFAULT_SITE_URL,
    days: Number(process.env.GSC_DAYS || DEFAULT_DAYS),
    maxRows: Number(process.env.GSC_MAX_ROWS || DEFAULT_MAX_ROWS),
    credentialPath: process.env.GSC_OAUTH_CLIENT_PATH || path.join(__dirname, 'oauth-client.json'),
    tokenPath: process.env.GSC_TOKEN_PATH || path.join(__dirname, 'gsc-token.json'),
    outputDir: process.env.GSC_OUTPUT_DIR || '',
    endDate: process.env.GSC_END_DATE || '',
    port: Number(process.env.GSC_AUTH_PORT || DEFAULT_PORT),
  };

  argv.forEach((arg) => {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg.startsWith('--siteUrl=')) args.siteUrl = arg.slice('--siteUrl='.length);
    else if (arg.startsWith('--days=')) args.days = Number(arg.slice('--days='.length));
    else if (arg.startsWith('--maxRows=')) args.maxRows = Number(arg.slice('--maxRows='.length));
    else if (arg.startsWith('--credentialPath=')) args.credentialPath = arg.slice('--credentialPath='.length);
    else if (arg.startsWith('--tokenPath=')) args.tokenPath = arg.slice('--tokenPath='.length);
    else if (arg.startsWith('--outputDir=')) args.outputDir = arg.slice('--outputDir='.length);
    else if (arg.startsWith('--endDate=')) args.endDate = arg.slice('--endDate='.length);
    else if (arg.startsWith('--port=')) args.port = Number(arg.slice('--port='.length));
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!Number.isFinite(args.days) || args.days < 1) throw new Error('--days must be a positive number');
  if (!Number.isFinite(args.maxRows) || args.maxRows < 0) throw new Error('--maxRows must be zero or a positive number');
  if (!Number.isFinite(args.port) || args.port < 1) throw new Error('--port must be a positive number');

  args.credentialPath = path.resolve(args.credentialPath);
  args.tokenPath = path.resolve(args.tokenPath);
  if (!args.outputDir) {
    args.outputDir = path.join(__dirname, '..', '..', 'reports', 'gsc', `criminal-law-${dateDaysAgo(0)}`);
  }
  args.outputDir = path.resolve(args.outputDir);
  return args;
}

function printHelp() {
  console.log(`Criminal Law GSC export

Usage:
  node tools/gsc/gsc-criminal-export.js --dry-run
  node tools/gsc/gsc-criminal-export.js

Environment overrides:
  GSC_OAUTH_CLIENT_PATH   Local OAuth desktop client JSON path
  GSC_TOKEN_PATH          Local OAuth token JSON path
  GSC_SITE_URL            GSC property URL, default ${DEFAULT_SITE_URL}
  GSC_OUTPUT_DIR          Output directory
  GSC_DAYS                Lookback days, default ${DEFAULT_DAYS}
  GSC_MAX_ROWS            Per-query pagination cap, default ${DEFAULT_MAX_ROWS}; 0 means uncapped
  GSC_END_DATE            End date YYYY-MM-DD; default is 3 days ago for GSC lag
  GSC_AUTH_PORT           OAuth callback port, default ${DEFAULT_PORT}

Outputs:
  criminal-law-pages.csv
  criminal-law-query-page.csv
  criminal-law-cannibalization.csv
  criminal-law-protected-sources.csv
  criminal-law-summary.json
`);
}

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(value) {
  const val = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const body = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(',')).join('\n');
  return `${header}\n${body}${body ? '\n' : ''}`;
}

function writeCsv(filePath, rows, columns) {
  fs.writeFileSync(filePath, toCsv(rows, columns), 'utf8');
}

function normalizePath(input) {
  if (!input) return '';
  let raw = input;
  try {
    raw = input.startsWith('http') ? new URL(input).pathname : new URL(input, DEFAULT_SITE_URL).pathname;
  } catch (_err) {
    raw = input;
  }
  raw = raw.split('#')[0].split('?')[0];
  if (!raw.startsWith('/')) raw = `/${raw}`;
  const hasFileExtension = /\/[^/]+\.[a-z0-9]{2,8}$/i.test(raw);
  if (!hasFileExtension && !raw.endsWith('/')) raw += '/';
  return raw;
}

function buildPathSet(paths) {
  const set = new Set();
  paths.forEach((item) => {
    const normalized = normalizePath(item);
    set.add(normalized);
    if (normalized.endsWith('/')) set.add(normalized.slice(0, -1));
  });
  return set;
}

const targetPathSet = buildPathSet(TARGET_PATHS);
const protectedPathSet = buildPathSet(PROTECTED_SOURCE_PATHS);
const allClusterPathSet = new Set([...targetPathSet, ...protectedPathSet]);

function pagePath(page) {
  return normalizePath(page);
}

function isClusterPage(page) {
  const normalized = pagePath(page);
  return allClusterPathSet.has(normalized) || allClusterPathSet.has(normalized.replace(/\/$/, ''));
}

function isTargetPage(page) {
  const normalized = pagePath(page);
  return targetPathSet.has(normalized) || targetPathSet.has(normalized.replace(/\/$/, ''));
}

function isProtectedSource(page) {
  const normalized = pagePath(page);
  return protectedPathSet.has(normalized) || protectedPathSet.has(normalized.replace(/\/$/, ''));
}

function isCriminalQuery(query) {
  const normalized = String(query || '').toLowerCase();
  return CRIMINAL_QUERY_TERMS.some((term) => normalized.includes(term.toLowerCase()));
}

function rowToMetric(keys, row) {
  const out = {};
  keys.forEach((key, index) => {
    out[key] = row.keys[index];
  });
  out.clicks = row.clicks || 0;
  out.impressions = row.impressions || 0;
  out.ctr = row.ctr ? `${(row.ctr * 100).toFixed(2)}%` : '0.00%';
  out.position = row.position ? row.position.toFixed(1) : '';
  return out;
}

function chooseSiteUrl(requestedSiteUrl, siteRows) {
  const available = siteRows.map((row) => row.siteUrl);
  if (available.includes(requestedSiteUrl)) return requestedSiteUrl;
  const noSlash = requestedSiteUrl.replace(/\/$/, '');
  const withSlash = `${noSlash}/`;
  if (available.includes(noSlash)) return noSlash;
  if (available.includes(withSlash)) return withSlash;
  if (available.includes('sc-domain:jus-tice.co.il')) return 'sc-domain:jus-tice.co.il';
  return requestedSiteUrl;
}

async function queryAll(searchconsole, siteUrl, requestBody, label, maxRows) {
  const allRows = [];
  let startRow = 0;
  const batchSize = 25000;
  let capped = false;

  while (true) {
    const remaining = maxRows > 0 ? maxRows - allRows.length : batchSize;
    if (maxRows > 0 && remaining <= 0) {
      capped = true;
      break;
    }

    const rowLimit = maxRows > 0 ? Math.min(batchSize, remaining) : batchSize;
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: { ...requestBody, rowLimit, startRow },
    });
    const rows = res.data.rows || [];
    allRows.push(...rows);
    console.log(`${label}: fetched ${allRows.length} rows`);
    if (rows.length < rowLimit) break;
    startRow += rowLimit;
  }

  return { rows: allRows, capped };
}

function loadOAuthClient(args) {
  if (!fs.existsSync(args.credentialPath)) {
    throw new Error(`OAuth client file not found: ${args.credentialPath}`);
  }
  const oauthCreds = JSON.parse(fs.readFileSync(args.credentialPath, 'utf8'));
  const client = oauthCreds.installed || oauthCreds.web;
  if (!client || !client.client_id || !client.client_secret) {
    throw new Error('OAuth client JSON must contain installed.client_id/client_secret or web.client_id/client_secret');
  }
  const { google } = require('googleapis');
  return new google.auth.OAuth2(client.client_id, client.client_secret, `http://localhost:${args.port}`);
}

async function authenticate(args) {
  const oauth2Client = loadOAuthClient(args);

  if (fs.existsSync(args.tokenPath)) {
    const tokens = JSON.parse(fs.readFileSync(args.tokenPath, 'utf8'));
    oauth2Client.setCredentials(tokens);
    if (tokens.expiry_date && tokens.expiry_date > Date.now()) {
      console.log('Using existing local GSC token.');
      return oauth2Client;
    }
    if (tokens.refresh_token) {
      console.log('Refreshing existing local GSC token.');
      const { credentials } = await oauth2Client.refreshAccessToken();
      credentials.refresh_token = tokens.refresh_token;
      fs.writeFileSync(args.tokenPath, JSON.stringify(credentials, null, 2), 'utf8');
      oauth2Client.setCredentials(credentials);
      return oauth2Client;
    }
  }

  return authenticateWithBrowser(args, oauth2Client);
}

async function authenticateWithBrowser(args, oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  console.log('Opening Google OAuth browser flow.');
  console.log('If the browser does not open, copy this URL:');
  console.log(authUrl);

  const open = (await import('open')).default;
  open(authUrl);

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://localhost:${args.port}`);
        const code = url.searchParams.get('code');
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Error: no OAuth code received.</h1>');
          return;
        }
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(args.tokenPath, JSON.stringify(tokens, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Connected. You can close this tab.</h1>');
        server.close();
        resolve(oauth2Client);
      } catch (err) {
        server.close();
        reject(err);
      }
    });
    server.listen(args.port, () => console.log(`Waiting for OAuth callback on port ${args.port}.`));
  });
}

function summarizeProtectedSources(pageRows) {
  const byPath = new Map();
  pageRows.forEach((row) => {
    byPath.set(pagePath(row.page), row);
    byPath.set(pagePath(row.page).replace(/\/$/, ''), row);
  });

  return PROTECTED_SOURCE_PATHS.map((sourcePath) => {
    const normalized = normalizePath(sourcePath);
    const row = byPath.get(normalized) || byPath.get(normalized.replace(/\/$/, ''));
    return {
      path: normalized,
      status: row ? 'HAS_GSC_ROWS' : 'NO_GSC_ROWS',
      clicks: row ? row.clicks : 0,
      impressions: row ? row.impressions : 0,
      ctr: row ? row.ctr : '',
      position: row ? row.position : '',
      risk_note: row && (row.clicks > 0 || row.impressions > 0) ? 'protect_before_redirect_or_retirement' : 'verify_live_and_indexing_before_decision',
    };
  });
}

function buildCannibalizationRows(queryPageRows) {
  const grouped = new Map();
  queryPageRows.forEach((row) => {
    if (!grouped.has(row.query)) grouped.set(row.query, []);
    grouped.get(row.query).push(row);
  });

  const rows = [];
  grouped.forEach((items, query) => {
    const pages = Array.from(new Set(items.map((item) => item.page)));
    if (pages.length < 2) return;
    rows.push({
      query,
      page_count: pages.length,
      total_clicks: items.reduce((sum, item) => sum + Number(item.clicks || 0), 0),
      total_impressions: items.reduce((sum, item) => sum + Number(item.impressions || 0), 0),
      pages: pages.join(' | '),
      positions: items.map((item) => `${item.page}=${item.position}`).join(' | '),
      decision_use: 'review_before_redirect_canonical_or_merge',
    });
  });

  rows.sort((a, b) => b.total_impressions - a.total_impressions);
  return rows;
}

async function exportCriminal(args) {
  const { google } = require('googleapis');
  const auth = await authenticate(args);
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  ensureDir(args.outputDir);

  const endDate = args.endDate || dateDaysAgo(3);
  const startDate = dateDaysAgo(args.days + 3);
  const baseBody = { startDate, endDate, dataState: 'final' };

  console.log(`Exporting Criminal Law GSC data for ${args.siteUrl}`);
  console.log(`Date range: ${startDate} to ${endDate}`);

  const sites = await searchconsole.sites.list();
  const siteRows = (sites.data.siteEntry || []).map((site) => ({
    siteUrl: site.siteUrl,
    permissionLevel: site.permissionLevel,
  }));
  writeCsv(path.join(args.outputDir, 'gsc-sites-visible.csv'), siteRows, ['siteUrl', 'permissionLevel']);
  const resolvedSiteUrl = chooseSiteUrl(args.siteUrl, siteRows);
  if (resolvedSiteUrl !== args.siteUrl) {
    console.log(`Using visible Search Console property: ${resolvedSiteUrl}`);
  }

  const pagesResult = await queryAll(
    searchconsole,
    resolvedSiteUrl,
    { ...baseBody, dimensions: ['page'] },
    'pages',
    args.maxRows
  );
  const pageRows = pagesResult.rows.map((row) => rowToMetric(['page'], row));
  const criminalPageRows = pageRows
    .filter((row) => isClusterPage(row.page))
    .map((row) => ({
      ...row,
      path: pagePath(row.page),
      role: isTargetPage(row.page) ? 'clean_target' : 'protected_source_or_asset',
    }));

  const queryPageResult = await queryAll(
    searchconsole,
    resolvedSiteUrl,
    { ...baseBody, dimensions: ['query', 'page'] },
    'query-page',
    args.maxRows
  );
  const queryPageRows = queryPageResult.rows.map((row) => rowToMetric(['query', 'page'], row));
  const criminalQueryPageRows = queryPageRows
    .filter((row) => isCriminalQuery(row.query) || isClusterPage(row.page))
    .map((row) => ({
      ...row,
      path: pagePath(row.page),
      match_type: isClusterPage(row.page) && isCriminalQuery(row.query)
        ? 'query_and_cluster_page'
        : isClusterPage(row.page)
          ? 'cluster_page'
          : 'criminal_query',
    }));

  const cannibalizationRows = buildCannibalizationRows(criminalQueryPageRows);
  const protectedRows = summarizeProtectedSources(criminalPageRows);

  writeCsv(path.join(args.outputDir, 'criminal-law-pages.csv'), criminalPageRows, [
    'role', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'criminal-law-query-page.csv'), criminalQueryPageRows, [
    'match_type', 'query', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'criminal-law-cannibalization.csv'), cannibalizationRows, [
    'query', 'page_count', 'total_clicks', 'total_impressions', 'pages', 'positions', 'decision_use',
  ]);
  writeCsv(path.join(args.outputDir, 'criminal-law-protected-sources.csv'), protectedRows, [
    'path', 'status', 'clicks', 'impressions', 'ctr', 'position', 'risk_note',
  ]);

  const summary = {
    generatedAt: new Date().toISOString(),
    requestedSiteUrl: args.siteUrl,
    siteUrl: resolvedSiteUrl,
    startDate,
    endDate,
    outputDir: args.outputDir,
    targetPathCount: TARGET_PATHS.length,
    protectedSourcePathCount: PROTECTED_SOURCE_PATHS.length,
    allPageRows: pageRows.length,
    criminalPageRows: criminalPageRows.length,
    allQueryPageRows: queryPageRows.length,
    criminalQueryPageRows: criminalQueryPageRows.length,
    cannibalizationGroups: cannibalizationRows.length,
    protectedSourcesWithGscRows: protectedRows.filter((row) => row.status === 'HAS_GSC_ROWS').length,
    capped: {
      pages: pagesResult.capped,
      queryPage: queryPageResult.capped,
      maxRows: args.maxRows,
    },
    safety: 'Read-only Search Console export. No CMS, URL, redirect, canonical, noindex or sitemap change.',
  };
  fs.writeFileSync(path.join(args.outputDir, 'criminal-law-summary.json'), JSON.stringify(summary, null, 2), 'utf8');

  console.log('Export complete.');
  console.log(`Output: ${args.outputDir}`);
  console.log(`Criminal query/page rows: ${criminalQueryPageRows.length}`);
  console.log(`Cannibalization groups: ${cannibalizationRows.length}`);
}

function dryRun(args) {
  const report = {
    mode: 'dry-run',
    siteUrl: args.siteUrl,
    days: args.days,
    maxRows: args.maxRows,
    credentialPath: args.credentialPath,
    credentialFileExists: fs.existsSync(args.credentialPath),
    tokenPath: args.tokenPath,
    tokenFileExists: fs.existsSync(args.tokenPath),
    outputDir: args.outputDir,
    targetPathCount: TARGET_PATHS.length,
    protectedSourcePathCount: PROTECTED_SOURCE_PATHS.length,
    queryTermCount: CRIMINAL_QUERY_TERMS.length,
    note: 'No credential contents read, no browser auth opened, no API call made.',
  };
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.dryRun) {
    dryRun(args);
    return;
  }
  await exportCriminal(args);
}

main().catch((err) => {
  console.error(`BLOCKED: ${err.message}`);
  process.exit(1);
});
