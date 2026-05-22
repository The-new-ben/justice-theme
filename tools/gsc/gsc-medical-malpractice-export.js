const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const DEFAULT_SITE_URL = 'https://jus-tice.co.il/';
const DEFAULT_PORT = 3333;
const DEFAULT_DAYS = 487;
const DEFAULT_MAX_ROWS = 250000;
const ROOT = path.resolve(__dirname, '..', '..');

const PRIMARY_TARGET_PATHS = [
  '/medical-malpractice-lawyer/',
];

const MEDICAL_QUERY_TERMS = [
  decodeURIComponent('%D7%A2%D7%95%D7%A8%D7%9A%20%D7%93%D7%99%D7%9F%20%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  decodeURIComponent('%D7%A2%D7%95%D7%93%20%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  decodeURIComponent('%D7%AA%D7%91%D7%99%D7%A2%D7%AA%20%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA%20%D7%91%D7%9C%D7%99%D7%93%D7%94'),
  decodeURIComponent('%D7%A2%D7%95%D7%A8%D7%9A%20%D7%93%D7%99%D7%9F%20%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA%20%D7%91%D7%9C%D7%99%D7%93%D7%94'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%91%D7%94%D7%A8%D7%99%D7%95%D7%9F'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%91%D7%A0%D7%99%D7%AA%D7%95%D7%97'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%91%D7%94%D7%A8%D7%93%D7%9E%D7%94'),
  decodeURIComponent('%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%91%D7%91%D7%99%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D'),
  decodeURIComponent('%D7%A9%D7%99%D7%AA%D7%95%D7%A7%20%D7%9E%D7%95%D7%97%D7%99%D7%9F'),
  decodeURIComponent('%D7%A0%D7%96%D7%A7%20%D7%9E%D7%95%D7%97%D7%99%20%D7%91%D7%9C%D7%99%D7%93%D7%94'),
  decodeURIComponent('%D7%9E%D7%95%D7%9E%D7%97%D7%94%20%D7%A8%D7%A4%D7%95%D7%90%D7%99'),
  decodeURIComponent('%D7%97%D7%95%D7%95%D7%AA%20%D7%93%D7%A2%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  decodeURIComponent('%D7%A4%D7%99%D7%A6%D7%95%D7%99%D7%99%D7%9D%20%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA'),
  'medical malpractice',
  'medical negligence',
  'birth injury',
  'cerebral palsy',
  'surgical error',
  'anesthesia malpractice',
  'hospital negligence',
];

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function findLatestProjectControlFile(pattern) {
  const dir = path.join(ROOT, 'project-control');
  return fs.readdirSync(dir)
    .filter((fileName) => pattern.test(fileName))
    .sort()
    .reverse()
    .map((fileName) => path.join(dir, fileName))[0] || '';
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    siteUrl: process.env.GSC_SITE_URL || DEFAULT_SITE_URL,
    days: Number(process.env.GSC_DAYS || DEFAULT_DAYS),
    maxRows: Number(process.env.GSC_MAX_ROWS || DEFAULT_MAX_ROWS),
    credentialPath: process.env.GSC_OAUTH_CLIENT_PATH || path.join(__dirname, 'oauth-client.json'),
    tokenPath: process.env.GSC_TOKEN_PATH || path.join(__dirname, 'gsc-token.json'),
    outputDir: process.env.GSC_OUTPUT_DIR || '',
    dashboard: process.env.MEDICAL_MALPRACTICE_READINESS_DASHBOARD_CSV || '',
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
    else if (arg.startsWith('--dashboard=')) args.dashboard = arg.slice('--dashboard='.length);
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
    args.outputDir = path.join(ROOT, 'reports', 'gsc', `medical-malpractice-${dateDaysAgo(0)}`);
  }
  args.outputDir = path.resolve(args.outputDir);
  args.dashboard = args.dashboard
    ? path.resolve(args.dashboard)
    : findLatestProjectControlFile(/^medical-malpractice-readiness-dashboard-\d{4}-\d{2}-\d{2}\.csv$/);
  if (!args.dashboard) throw new Error('No medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv found; pass --dashboard=path');
  return args;
}

function printHelp() {
  console.log(`Medical Malpractice GSC export

Usage:
  node tools/gsc/gsc-medical-malpractice-export.js --dry-run
  node tools/gsc/gsc-medical-malpractice-export.js

Environment overrides:
  GSC_OAUTH_CLIENT_PATH                      Local OAuth desktop client JSON path
  GSC_TOKEN_PATH                             Local OAuth token JSON path
  GSC_SITE_URL                               GSC property URL, default ${DEFAULT_SITE_URL}
  GSC_OUTPUT_DIR                             Output directory
  MEDICAL_MALPRACTICE_READINESS_DASHBOARD_CSV Dashboard CSV path
  GSC_DAYS                                   Lookback days, default ${DEFAULT_DAYS}
  GSC_MAX_ROWS                               Per-query pagination cap, default ${DEFAULT_MAX_ROWS}; 0 means uncapped
  GSC_END_DATE                               End date YYYY-MM-DD; default is 3 days ago for GSC lag
  GSC_AUTH_PORT                              OAuth callback port, default ${DEFAULT_PORT}

Outputs:
  medical-malpractice-pages.csv
  medical-malpractice-query-page.csv
  medical-malpractice-cannibalization.csv
  medical-malpractice-protected-sources.csv
  medical-malpractice-summary.json
`);
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  if (quoted) throw new Error(`Unclosed CSV quote in line: ${line.slice(0, 80)}`);
  return values;
}

function readCsv(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '') : header
  ));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`${path.relative(ROOT, filePath)}: expected ${headers.length} columns, got ${values.length}`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
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
  let raw = String(input).trim();
  if (!raw || /^REFERENCE:|^FUTURE:|^TRAFFIC_|^old row/i.test(raw)) return '';
  try {
    raw = raw.startsWith('http') ? new URL(raw).pathname : new URL(raw, DEFAULT_SITE_URL).pathname;
  } catch (_err) {
    raw = raw.split(/[;\s]/)[0];
  }
  raw = raw.split('#')[0].split('?')[0];
  if (!raw || !raw.startsWith('/')) return '';
  const hasFileExtension = /\/[^/]+\.[a-z0-9]{2,8}$/i.test(raw);
  if (!hasFileExtension && !raw.endsWith('/')) raw += '/';
  return raw;
}

function buildPathSet(paths) {
  const set = new Set();
  paths.forEach((item) => {
    const normalized = normalizePath(item);
    if (!normalized) return;
    set.add(normalized);
    if (normalized.endsWith('/')) set.add(normalized.slice(0, -1));
  });
  return set;
}

function extractPathCandidates(value) {
  const candidates = [];
  String(value || '').split(/[;|]/).forEach((item) => {
    const normalized = normalizePath(item.trim());
    if (normalized) candidates.push(normalized);
  });
  return candidates;
}

function buildScope(dashboardPath) {
  const dashboardRows = readCsv(dashboardPath);
  const targetPathSet = buildPathSet(PRIMARY_TARGET_PATHS);
  const protectedPathSet = new Set();
  const routeCandidatePathSet = new Set();
  const boundaryPathSet = new Set();

  dashboardRows.forEach((row) => {
    const lane = row.lane || '';
    const statusBlob = `${row.readiness_status || ''} ${row.decision_status || ''} ${row.url_action_status || ''} ${row.notes || ''}`;
    const currentCandidates = extractPathCandidates(row.current_url);
    const secondaryCandidates = extractPathCandidates(row.secondary_url);

    if (lane === 'CURRENT_URL_READINESS' && /EXCLUDE_FROM_MALPRACTICE|VERIFIED_BOUNDARY|EXCLUDE_PENDING_MANUAL_REVIEW/i.test(statusBlob)) {
      [...currentCandidates, ...secondaryCandidates].forEach((item) => boundaryPathSet.add(item));
      return;
    }

    if (lane === 'P0_SUPPORT_TO_HUB_MAP' || lane === 'CONTENT_INVENTORY_AUDIT' || lane === 'URL_MIGRATION_MAP') {
      currentCandidates.forEach((item) => {
        if (!targetPathSet.has(item) && !targetPathSet.has(item.replace(/\/$/, ''))) protectedPathSet.add(item);
      });
    }

    if (lane === 'CURRENT_URL_READINESS') {
      currentCandidates.forEach((item) => {
        if (!targetPathSet.has(item) && !targetPathSet.has(item.replace(/\/$/, ''))) protectedPathSet.add(item);
      });
    }

    if (lane === 'CLEAN_SLUG_ROUTE_REVIEW') {
      currentCandidates.forEach((item) => {
        routeCandidatePathSet.add(item);
        if (!targetPathSet.has(item) && !targetPathSet.has(item.replace(/\/$/, ''))) protectedPathSet.add(item);
      });
    }
  });

  boundaryPathSet.forEach((item) => protectedPathSet.delete(item));
  const allClusterPathSet = new Set([...targetPathSet, ...protectedPathSet, ...routeCandidatePathSet]);
  return {
    dashboardRows,
    targetPathSet,
    protectedPathSet,
    routeCandidatePathSet,
    boundaryPathSet,
    allClusterPathSet,
  };
}

function canonicalPathCount(pathSet) {
  return [...pathSet].filter((item) => item.endsWith('/') || /\/[^/]+\.[a-z0-9]{2,8}$/i.test(item)).length;
}

function pagePath(page) {
  return normalizePath(page);
}

function pathSetHas(pathSet, page) {
  const normalized = pagePath(page);
  return pathSet.has(normalized) || pathSet.has(normalized.replace(/\/$/, ''));
}

function isMedicalQuery(query) {
  const normalized = String(query || '').toLowerCase();
  return MEDICAL_QUERY_TERMS.some((term) => normalized.includes(term.toLowerCase()));
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

function summarizeProtectedSources(pageRows, scope) {
  const byPath = new Map();
  pageRows.forEach((row) => {
    byPath.set(pagePath(row.page), row);
    byPath.set(pagePath(row.page).replace(/\/$/, ''), row);
  });

  return [...scope.protectedPathSet].sort().map((sourcePath) => {
    const row = byPath.get(sourcePath) || byPath.get(sourcePath.replace(/\/$/, ''));
    return {
      path: sourcePath,
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

async function exportMedicalMalpractice(args) {
  const { google } = require('googleapis');
  const auth = await authenticate(args);
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  ensureDir(args.outputDir);
  const scope = buildScope(args.dashboard);

  const endDate = args.endDate || dateDaysAgo(3);
  const startDate = dateDaysAgo(args.days + 3);
  const baseBody = { startDate, endDate, dataState: 'final' };

  console.log(`Exporting Medical Malpractice GSC data for ${args.siteUrl}`);
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
  const medicalPageRows = pageRows
    .filter((row) => pathSetHas(scope.allClusterPathSet, row.page))
    .map((row) => ({
      ...row,
      path: pagePath(row.page),
      role: pathSetHas(scope.targetPathSet, row.page) ? 'primary_target' : 'protected_source_or_asset',
    }));

  const queryPageResult = await queryAll(
    searchconsole,
    resolvedSiteUrl,
    { ...baseBody, dimensions: ['query', 'page'] },
    'query-page',
    args.maxRows
  );
  const queryPageRows = queryPageResult.rows.map((row) => rowToMetric(['query', 'page'], row));
  const medicalQueryPageRows = queryPageRows
    .filter((row) => isMedicalQuery(row.query) || pathSetHas(scope.allClusterPathSet, row.page))
    .map((row) => ({
      ...row,
      path: pagePath(row.page),
      match_type: pathSetHas(scope.allClusterPathSet, row.page) && isMedicalQuery(row.query)
        ? 'query_and_cluster_page'
        : pathSetHas(scope.allClusterPathSet, row.page)
          ? 'cluster_page'
          : 'medical_malpractice_query',
    }));

  const cannibalizationRows = buildCannibalizationRows(medicalQueryPageRows);
  const protectedRows = summarizeProtectedSources(medicalPageRows, scope);

  writeCsv(path.join(args.outputDir, 'medical-malpractice-pages.csv'), medicalPageRows, [
    'role', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'medical-malpractice-query-page.csv'), medicalQueryPageRows, [
    'match_type', 'query', 'path', 'page', 'clicks', 'impressions', 'ctr', 'position',
  ]);
  writeCsv(path.join(args.outputDir, 'medical-malpractice-cannibalization.csv'), cannibalizationRows, [
    'query', 'page_count', 'total_clicks', 'total_impressions', 'pages', 'positions', 'decision_use',
  ]);
  writeCsv(path.join(args.outputDir, 'medical-malpractice-protected-sources.csv'), protectedRows, [
    'path', 'status', 'clicks', 'impressions', 'ctr', 'position', 'risk_note',
  ]);

  const summary = {
    generatedAt: new Date().toISOString(),
    requestedSiteUrl: args.siteUrl,
    siteUrl: resolvedSiteUrl,
    startDate,
    endDate,
    outputDir: args.outputDir,
    dashboard: path.relative(ROOT, args.dashboard),
    targetPathCount: canonicalPathCount(scope.targetPathSet),
    protectedSourcePathCount: scope.protectedPathSet.size,
    routeCandidatePathCount: scope.routeCandidatePathSet.size,
    boundaryPathCount: scope.boundaryPathSet.size,
    allPageRows: pageRows.length,
    medicalPageRows: medicalPageRows.length,
    allQueryPageRows: queryPageRows.length,
    medicalQueryPageRows: medicalQueryPageRows.length,
    cannibalizationGroups: cannibalizationRows.length,
    protectedSourcesWithGscRows: protectedRows.filter((row) => row.status === 'HAS_GSC_ROWS').length,
    capped: {
      pages: pagesResult.capped,
      queryPage: queryPageResult.capped,
      maxRows: args.maxRows,
    },
    safety: 'Read-only Search Console export. No CMS, URL, redirect, canonical, noindex or sitemap change.',
  };
  fs.writeFileSync(path.join(args.outputDir, 'medical-malpractice-summary.json'), JSON.stringify(summary, null, 2), 'utf8');

  console.log('Export complete.');
  console.log(`Output: ${args.outputDir}`);
  console.log(`Medical query/page rows: ${medicalQueryPageRows.length}`);
  console.log(`Cannibalization groups: ${cannibalizationRows.length}`);
}

function dryRun(args) {
  const scope = buildScope(args.dashboard);
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
    dashboard: path.relative(ROOT, args.dashboard),
    targetPathCount: canonicalPathCount(scope.targetPathSet),
    protectedSourcePathCount: scope.protectedPathSet.size,
    routeCandidatePathCount: scope.routeCandidatePathSet.size,
    boundaryPathCount: scope.boundaryPathSet.size,
    queryTermCount: MEDICAL_QUERY_TERMS.length,
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
  await exportMedicalMalpractice(args);
}

main().catch((err) => {
  console.error(`BLOCKED: ${err.message}`);
  process.exit(1);
});
