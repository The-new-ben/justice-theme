const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const DEFAULT_SITE_URL = 'https://jus-tice.co.il/';
const DEFAULT_PORT = 3333;
const DEFAULT_DAYS = 487;
const DEFAULT_MAX_ROWS = 250000;

const TARGET_PATHS = [
  '/divorce-lawyer/',
  '/consensual-divorce/',
  '/divorce-mediation/',
  '/divorce-property-division/',
  '/family-dispute-resolution/',
  '/child-support/',
  '/child-custody/',
];

const PROTECTED_SOURCE_PATHS = [
  '/free-divorce-agreement-template/',
  '/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D',
  '/joint-custody-shared-parenting/',
  '/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%A2%D7%93%D7%9B%D7%A0%D7%99-%D7%9C%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F',
  '/child-custody-modification/',
  '/divorce-costs-2025/',
  '/%D7%A2%D7%95%D7%93-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%9B%D7%99%D7%A6%D7%93-%D7%9C%D7%9E%D7%A6%D7%95%D7%90-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%95%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%94%D7%AA%D7%92%D7%A8%D7%A9',
  '/living-apart-together-legal-rights/',
  '/%D7%92%D7%99%D7%A9%D7%95%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A-%D7%A2%D7%95%D7%91%D7%93',
  '/request-for-family-dispute-settlements/',
  '/divorce-mediation-basics/',
  '/cohabitation-property-rights-for-unmarried-couples/',
  '/how-much-does-a-divorce-agreement-cost/',
  '/divorce-everything-you-need-to-know/',
  '/what-is-child-custody/',
  '/trusted-divorce-attorney-guide/',
  '/strategic-divorce-cost-planning/',
  '/wp-content/uploads/2021/03/%D7%A0%D7%95%D7%A1%D7%97-%D7%94%D7%A1%D7%9B%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%93%D7%95%D7%92%D7%9E%D7%90-2021.docx',
];

const FAMILY_QUERY_TERMS = [
  'עורך דין גירושין',
  'גירושין',
  'הסכם גירושין',
  'הסכם ממון',
  'מזונות',
  'משמורת',
  'חלוקת רכוש',
  'צוואה',
  'צוואות וירושות',
  'עורך דין לענייני משפחה',
  'divorce',
  'family law',
  'custody',
  'child support',
  'alimony',
  'prenup',
  'inheritance',
  'will',
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
    args.outputDir = path.join(__dirname, '..', '..', 'reports', 'gsc', `family-divorce-${dateDaysAgo(0)}`);
  }
  args.outputDir = path.resolve(args.outputDir);
  return args;
}

function printHelp() {
  console.log(`Family/Divorce GSC export

Usage:
  node tools/gsc/gsc-family-divorce-export.js --dry-run
  node tools/gsc/gsc-family-divorce-export.js

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
  family-divorce-pages.csv
  family-divorce-query-page.csv
  family-divorce-cannibalization.csv
  family-divorce-protected-sources.csv
  family-divorce-summary.json
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

function isFamilyQuery(query) {
  const normalized = String(query || '').toLowerCase();
  return FAMILY_QUERY_TERMS.some((term) => normalized.includes(term.toLowerCase()));
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

async function exportFamilyDivorce(args) {
  const { google } = require('googleapis');
  const auth = await authenticate(args);
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  ensureDir(args.outputDir);

  const endDate = args.endDate || dateDaysAgo(3);
  const startDate = dateDaysAgo(args.days + 3);
  const baseBody = { startDate, endDate, dataState: 'final' };

  console.log(`Exporting Family/Divorce GSC data for ${args.siteUrl}`);
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
  const familyPageRows = pageRows
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
  const familyQueryPageRows = queryPageRows
    .filter((row) => isFamilyQuery(row.query) || isClusterPage(row.page))
    .map((row) => ({
      ...row,
      path: pagePath(row.page),
      match_type: isClusterPage(row.page) && isFamilyQuery(row.query)
        ? 'query_and_cluster_page'
        : isClusterPage(row.page)
          ? 'cluster_page'
          : 'family_query',
    }));

  const cannibalizationRows = buildCannibalizationRows(familyQueryPageRows);
  const protectedRows = summarizeProtectedSources(familyPageRows);

  writeCsv(path.join(args.outputDir, 'family-divorce-pages.csv'), familyPageRows, [
    'role', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'family-divorce-query-page.csv'), familyQueryPageRows, [
    'match_type', 'query', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'family-divorce-cannibalization.csv'), cannibalizationRows, [
    'query', 'page_count', 'total_clicks', 'total_impressions', 'pages', 'positions', 'decision_use',
  ]);
  writeCsv(path.join(args.outputDir, 'family-divorce-protected-sources.csv'), protectedRows, [
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
    familyPageRows: familyPageRows.length,
    allQueryPageRows: queryPageRows.length,
    familyQueryPageRows: familyQueryPageRows.length,
    cannibalizationGroups: cannibalizationRows.length,
    protectedSourcesWithGscRows: protectedRows.filter((row) => row.status === 'HAS_GSC_ROWS').length,
    capped: {
      pages: pagesResult.capped,
      queryPage: queryPageResult.capped,
      maxRows: args.maxRows,
    },
    safety: 'Read-only Search Console export. No CMS, URL, redirect, canonical, noindex or sitemap change.',
  };
  fs.writeFileSync(path.join(args.outputDir, 'family-divorce-summary.json'), JSON.stringify(summary, null, 2), 'utf8');

  console.log('Export complete.');
  console.log(`Output: ${args.outputDir}`);
  console.log(`Family query/page rows: ${familyQueryPageRows.length}`);
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
    queryTermCount: FAMILY_QUERY_TERMS.length,
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
  await exportFamilyDivorce(args);
}

main().catch((err) => {
  console.error(`BLOCKED: ${err.message}`);
  process.exit(1);
});
