const { google } = require('googleapis');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ── Config ──────────────────────────────────────────────
const SITE_URL = 'https://jus-tice.co.il/';
const OAUTH_FILE = path.join(__dirname, 'oauth-client.json');
const TOKEN_FILE = path.join(__dirname, 'gsc-token.json');
const REPORTS_DIR = path.join(__dirname, '..', '..', 'reports', 'gsc');
const PORT = 3333;

// ── Load OAuth credentials ──────────────────────────────
const oauthCreds = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf8'));
const { client_id, client_secret } = oauthCreds.installed;
const redirect_uri = `http://localhost:${PORT}`;

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

// ── Helpers ─────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function toCsv(rows, columns) {
  if (!rows || rows.length === 0) return columns.join(',') + '\n';
  const header = columns.join(',');
  const body = rows.map(row => columns.map(col => {
    let val = row[col] !== undefined ? row[col] : '';
    if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
      val = '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(',')).join('\n');
  return header + '\n' + body + '\n';
}

// ── Auth Flow ───────────────────────────────────────────
async function authenticate() {
  // Check for saved token
  if (fs.existsSync(TOKEN_FILE)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oauth2Client.setCredentials(tokens);

    // Check if token is expired
    if (tokens.expiry_date && tokens.expiry_date > Date.now()) {
      console.log('Using saved token (still valid).');
      return oauth2Client;
    }

    // Try to refresh
    if (tokens.refresh_token) {
      console.log('Token expired, refreshing...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        credentials.refresh_token = tokens.refresh_token;
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials, null, 2));
        oauth2Client.setCredentials(credentials);
        console.log('Token refreshed successfully.');
        return oauth2Client;
      } catch (e) {
        console.log('Refresh failed, need new login.');
      }
    }
  }

  // Need new authentication
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  console.log('\n============================================');
  console.log('OPENING BROWSER FOR GOOGLE LOGIN...');
  console.log('If the browser does not open, copy this URL:');
  console.log(authUrl);
  console.log('============================================\n');

  // Open browser
  const open = (await import('open')).default;
  open(authUrl);

  // Wait for callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const code = url.searchParams.get('code');

        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Error: No code received</h1>');
          return;
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1 style="color:green;font-family:sans-serif;">✅ Connected! You can close this tab.</h1><p>Go back to your terminal to see the data being pulled.</p>');

        server.close();
        console.log('Authentication successful! Token saved.');
        resolve(oauth2Client);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1 style="color:red;">Error: ' + err.message + '</h1>');
        reject(err);
      }
    });

    server.listen(PORT, () => {
      console.log(`Waiting for Google login callback on port ${PORT}...`);
    });
  });
}

// ── GSC Data Pull ───────────────────────────────────────
async function pullGscData(auth) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  ensureDir(REPORTS_DIR);

  // 1. Verify site access
  console.log('\n── Checking site access...');
  let siteUrl = SITE_URL;
  try {
    const sites = await searchconsole.sites.list();
    const siteList = sites.data.siteEntry || [];
    console.log(`Found ${siteList.length} site(s):`);
    siteList.forEach(s => console.log(`  - ${s.siteUrl} (${s.permissionLevel})`));

    const hasAccess = siteList.some(s => s.siteUrl === SITE_URL || s.siteUrl === 'sc-domain:jus-tice.co.il');
    if (!hasAccess && siteList.length > 0) {
      siteUrl = siteList[0].siteUrl;
      console.log(`Using first available site: ${siteUrl}`);
    }
  } catch (err) {
    console.error('Site list error:', err.message);
  }

  // 2. Pull performance data - Pages (last 12 months)
  console.log('\n── Pulling performance by PAGES (last 12 months)...');
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let allPageRows = [];
    let startRow = 0;
    const batchSize = 25000;

    while (true) {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate, endDate,
          dimensions: ['page'],
          rowLimit: batchSize,
          startRow: startRow,
        },
      });

      const rows = (res.data.rows || []).map(r => ({
        page: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: (r.ctr * 100).toFixed(2) + '%',
        position: r.position.toFixed(1),
      }));

      allPageRows = allPageRows.concat(rows);
      console.log(`  Fetched ${allPageRows.length} page rows...`);
      if (rows.length < batchSize) break;
      startRow += batchSize;
    }

    const csvPages = toCsv(allPageRows, ['page', 'clicks', 'impressions', 'ctr', 'position']);
    fs.writeFileSync(path.join(REPORTS_DIR, 'performance-pages.csv'), csvPages);
    console.log(`  ✅ Saved ${allPageRows.length} rows to performance-pages.csv`);
  } catch (err) {
    console.error('  ❌ Pages error:', err.message);
    if (err.message.includes('not found') || err.status === 403) {
      siteUrl = 'sc-domain:jus-tice.co.il';
      console.log(`  Retrying with: ${siteUrl}`);
    }
  }

  // 3. Pull performance data - Queries (last 12 months)
  console.log('\n── Pulling performance by QUERIES (last 12 months)...');
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let allQueryRows = [];
    let startRow = 0;
    const batchSize = 25000;

    while (true) {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate, endDate,
          dimensions: ['query'],
          rowLimit: batchSize,
          startRow: startRow,
        },
      });

      const rows = (res.data.rows || []).map(r => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: (r.ctr * 100).toFixed(2) + '%',
        position: r.position.toFixed(1),
      }));

      allQueryRows = allQueryRows.concat(rows);
      console.log(`  Fetched ${allQueryRows.length} query rows...`);
      if (rows.length < batchSize) break;
      startRow += batchSize;
    }

    const csvQueries = toCsv(allQueryRows, ['query', 'clicks', 'impressions', 'ctr', 'position']);
    fs.writeFileSync(path.join(REPORTS_DIR, 'performance-queries.csv'), csvQueries);
    console.log(`  ✅ Saved ${allQueryRows.length} rows to performance-queries.csv`);
  } catch (err) {
    console.error('  ❌ Queries error:', err.message);
  }

  // 4. Pull Query + Page combined (cannibalization detection)
  console.log('\n── Pulling QUERY+PAGE combined (cannibalization detection)...');
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let allCombinedRows = [];
    let startRow = 0;
    const batchSize = 25000;

    while (true) {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
          startDate, endDate,
          dimensions: ['query', 'page'],
          rowLimit: batchSize,
          startRow: startRow,
        },
      });

      const rows = (res.data.rows || []).map(r => ({
        query: r.keys[0],
        page: r.keys[1],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: (r.ctr * 100).toFixed(2) + '%',
        position: r.position.toFixed(1),
      }));

      allCombinedRows = allCombinedRows.concat(rows);
      console.log(`  Fetched ${allCombinedRows.length} combined rows...`);
      if (rows.length < batchSize) break;
      startRow += batchSize;
    }

    const csvCombined = toCsv(allCombinedRows, ['query', 'page', 'clicks', 'impressions', 'ctr', 'position']);
    fs.writeFileSync(path.join(REPORTS_DIR, 'query-page-combined.csv'), csvCombined);
    console.log(`  ✅ Saved ${allCombinedRows.length} rows to query-page-combined.csv`);

    // 5. Generate cannibalization report
    console.log('\n── Generating cannibalization report...');
    const queryPageMap = {};
    allCombinedRows.forEach(row => {
      if (!queryPageMap[row.query]) queryPageMap[row.query] = [];
      queryPageMap[row.query].push(row);
    });

    const cannibRows = [];
    Object.entries(queryPageMap).forEach(([query, pages]) => {
      if (pages.length > 1) {
        const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
        const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0);
        cannibRows.push({
          query,
          page_count: pages.length,
          total_clicks: totalClicks,
          total_impressions: totalImpressions,
          pages: pages.map(p => p.page).join(' | '),
          positions: pages.map(p => p.position).join(' | '),
        });
      }
    });

    cannibRows.sort((a, b) => b.total_impressions - a.total_impressions);

    const csvCannib = toCsv(cannibRows, ['query', 'page_count', 'total_clicks', 'total_impressions', 'pages', 'positions']);
    fs.writeFileSync(path.join(REPORTS_DIR, 'cannibalization-report.csv'), csvCannib);
    console.log(`  ✅ Found ${cannibRows.length} cannibalized queries → cannibalization-report.csv`);
  } catch (err) {
    console.error('  ❌ Combined error:', err.message);
  }

  // 6. Pull sitemaps info
  console.log('\n── Pulling sitemaps...');
  try {
    const res = await searchconsole.sitemaps.list({ siteUrl: siteUrl });
    const sitemaps = res.data.sitemap || [];
    console.log(`  Found ${sitemaps.length} sitemap(s):`);
    sitemaps.forEach(s => console.log(`    - ${s.path} (${s.type}, ${s.warnings} warnings, ${s.errors} errors)`));
  } catch (err) {
    console.error('  ❌ Sitemaps error:', err.message);
  }

  console.log('\n============================================');
  console.log('ALL DONE! Reports saved to:');
  console.log(`  ${REPORTS_DIR}`);
  console.log('Files:');
  console.log('  - performance-pages.csv');
  console.log('  - performance-queries.csv');
  console.log('  - query-page-combined.csv');
  console.log('  - cannibalization-report.csv');
  console.log('============================================\n');
}

// ── Main ────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  GSC Data Pull — jus-tice.co.il         ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const auth = await authenticate();
  await pullGscData(auth);
}

main().catch(err => {
  console.error('FATAL ERROR:', err.message);
  process.exit(1);
});
