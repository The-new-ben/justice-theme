/**
 * gsc-mirror-master.js
 * The "GSC Mirror Master File" Builder
 * Integrates GSC API (16-month deep pull) and PSI API (Performance)
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const BASE_DIR = path.join(__dirname, '..', '..', 'justice_theme_emergency_master_2026_05_13', 'content-master');
const OUTPUT_FILE = path.join(BASE_DIR, 'gsc-mirror-master-database.csv');
const TOKEN_PATH = path.join(__dirname, 'gsc-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'oauth-client.json');

const SITE_URL = 'https://jus-tice.co.il/';

// Date Calculation (16 months ago to today)
const today = new Date();
const endDate = today.toISOString().split('T')[0];
const pastDate = new Date(today.setMonth(today.getMonth() - 16));
const startDate = pastDate.toISOString().split('T')[0];

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
ensureDir(BASE_DIR);

// Auth Setup
async function authorize() {
    if (!fs.existsSync(CREDENTIALS_PATH)) throw new Error('oauth-client.json missing');
    if (!fs.existsSync(TOKEN_PATH)) throw new Error('gsc-token.json missing. Run gsc-pull.js first to authenticate.');
    
    const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_secret, client_id, redirect_uris } = creds.installed || creds.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
}

// Helper: HTTP GET for PSI (to avoid extra dependencies)
function getPSI(url) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
        https.get(apiUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
                } else if (res.statusCode === 429) {
                    resolve('RATE_LIMIT');
                } else {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

// CSV Handlers
function writeCsv(rows) {
    const cols = [
        'URL', 'Primary_Query', 'Secondary_Queries', 'Total_Clicks', 'Total_Impressions', 
        'Average_CTR', 'Average_Position', 'Cannibalization_Flag', 'Mobile_Speed_Score', 'Core_Web_Vitals_Status'
    ];
    
    const lines = rows.map(r => cols.map(c => {
        let v = r[c] !== undefined && r[c] !== null ? String(r[c]) : '';
        if (v.includes(',') || v.includes('"') || v.includes('\n')) v = '"' + v.replace(/"/g, '""') + '"';
        return v;
    }).join(','));
    
    fs.writeFileSync(OUTPUT_FILE, cols.join(',') + '\n' + lines.join('\n') + '\n', 'utf8');
}

function readCsv() {
    if (!fs.existsSync(OUTPUT_FILE)) return null;
    const lines = fs.readFileSync(OUTPUT_FILE, 'utf8').trim().split('\n');
    if (lines.length < 2) return null;
    
    const cols = lines[0].split(',');
    return lines.slice(1).map(line => {
        const r = []; let cur = '', q = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') { if (q && line[i+1] === '"') { cur += '"'; i++; } else q = !q; }
            else if (line[i] === ',' && !q) { r.push(cur); cur = ''; }
            else cur += line[i];
        }
        r.push(cur);
        
        const obj = {};
        cols.forEach((c, i) => obj[c] = r[i] || '');
        return obj;
    });
}

async function main() {
    console.log(`\n🚀 Starting GSC Mirror Extraction (16 Months: ${startDate} to ${endDate})`);
    
    // Check if we already have a partial file to resume PSI
    let existingData = readCsv();
    let urlMap = {};

    if (!existingData) {
        // --- PHASE 1: GSC DEEP PULL ---
        console.log(`\n[1/3] Authenticating with Google Search Console...`);
        const auth = await authorize();
        const webmasters = google.webmasters({ version: 'v3', auth });

        let startRow = 0;
        const rowLimit = 25000;
        let allRows = [];
        let hasMore = true;

        console.log(`[2/3] Extracting Dimensions Matrix (page, query, device)...`);
        
        while (hasMore) {
            console.log(`  -> Fetching rows ${startRow} to ${startRow + rowLimit}...`);
            try {
                const res = await webmasters.searchanalytics.query({
                    siteUrl: SITE_URL,
                    requestBody: {
                        startDate: startDate,
                        endDate: endDate,
                        dimensions: ['page', 'query', 'device'],
                        rowLimit: rowLimit,
                        startRow: startRow
                    }
                });

                if (res.data.rows && res.data.rows.length > 0) {
                    allRows = allRows.concat(res.data.rows);
                    startRow += rowLimit;
                    if (res.data.rows.length < rowLimit) hasMore = false;
                } else {
                    hasMore = false;
                }
            } catch (err) {
                console.error(`  ❌ API Error: ${err.message}`);
                hasMore = false;
            }
        }

        console.log(`✅ Total GSC Data Points Extracted: ${allRows.length}`);

        // Process Data into URL-centric structure
        console.log(`\n[3/3] Aggregating Data & Detecting Cannibalization...`);
        
        allRows.forEach(r => {
            const url = r.keys[0].replace(/\/$/, '').toLowerCase();
            const query = r.keys[1];
            // r.keys[2] is device, but we are aggregating at the URL level
            
            if (!urlMap[url]) {
                urlMap[url] = { 
                    URL: url, clicks: 0, impressions: 0, posSum: 0, 
                    queries: {}, Mobile_Speed_Score: 'PENDING', Core_Web_Vitals_Status: 'PENDING'
                };
            }
            
            urlMap[url].clicks += r.clicks;
            urlMap[url].impressions += r.impressions;
            urlMap[url].posSum += (r.position * r.impressions); // Weighted position
            
            if (!urlMap[url].queries[query]) urlMap[url].queries[query] = { clicks: 0, imp: 0 };
            urlMap[url].queries[query].clicks += r.clicks;
            urlMap[url].queries[query].imp += r.impressions;
        });

        const compiledRows = Object.values(urlMap).map(u => {
            const qList = Object.entries(u.queries).map(([q, stats]) => ({ q, ...stats }));
            qList.sort((a, b) => b.clicks - a.clicks || b.imp - a.imp);
            
            return {
                URL: u.URL,
                Primary_Query: qList.length > 0 ? qList[0].q : '',
                Secondary_Queries: qList.slice(1, 11).map(x => x.q).join(' | '),
                Total_Clicks: u.clicks,
                Total_Impressions: u.impressions,
                Average_CTR: u.impressions > 0 ? ((u.clicks / u.impressions) * 100).toFixed(2) + '%' : '0%',
                Average_Position: u.impressions > 0 ? (u.posSum / u.impressions).toFixed(1) : '0',
                Cannibalization_Flag: 'FALSE', // Default, will calc next
                Mobile_Speed_Score: 'PENDING',
                Core_Web_Vitals_Status: 'PENDING'
            };
        });

        // Calculate Cannibalization (Multiple URLs sharing the exact same Primary Query)
        const primaryQueryMap = {};
        compiledRows.forEach(r => {
            if (r.Primary_Query && r.Total_Clicks > 0) {
                if (!primaryQueryMap[r.Primary_Query]) primaryQueryMap[r.Primary_Query] = [];
                primaryQueryMap[r.Primary_Query].push(r.URL);
            }
        });

        compiledRows.forEach(r => {
            if (r.Primary_Query && primaryQueryMap[r.Primary_Query] && primaryQueryMap[r.Primary_Query].length > 1) {
                r.Cannibalization_Flag = 'TRUE';
            }
        });

        existingData = compiledRows;
        writeCsv(existingData);
        console.log(`✅ Base Matrix Saved to: ${OUTPUT_FILE}`);

    } else {
        console.log(`\n♻️ Resuming from existing database (${existingData.length} URLs found).`);
    }

    // --- PHASE 2: PAGE SPEED INSIGHTS (PSI) ENRICHMENT ---
    console.log(`\n⏳ Initializing PageSpeed Insights (PSI) Enrichment Layer...`);
    const pendingUrls = existingData.filter(r => r.Mobile_Speed_Score === 'PENDING' || r.Mobile_Speed_Score === '');
    
    if (pendingUrls.length === 0) {
        console.log(`✅ All URLs have been analyzed by PSI. Mirror Complete.`);
        return;
    }

    console.log(`URLs remaining for PSI analysis: ${pendingUrls.length}`);
    console.log(`Running sequential requests (approx 5s - 10s per URL to avoid bans)...`);

    for (let i = 0; i < pendingUrls.length; i++) {
        const row = pendingUrls[i];
        process.stdout.write(`  [${i+1}/${pendingUrls.length}] Testing ${row.URL}... `);
        
        const psiData = await getPSI(row.URL);
        
        if (psiData === 'RATE_LIMIT') {
            console.log(`❌ RATE LIMIT HIT. Sleeping script. Please re-run later.`);
            writeCsv(existingData);
            break;
        }

        if (psiData && psiData.lighthouseResult) {
            const score = psiData.lighthouseResult.categories.performance.score * 100;
            const metrics = psiData.lighthouseResult.audits['metrics']?.details?.items?.[0] || {};
            
            // Core Web Vitals simple pass/fail based on Lighthouse field data or lab data
            const cwvs = psiData.loadingExperience?.overall_category || 
                         (score >= 90 ? 'FAST' : (score >= 50 ? 'AVERAGE' : 'SLOW'));

            row.Mobile_Speed_Score = Math.round(score);
            row.Core_Web_Vitals_Status = cwvs;
            console.log(`Score: ${Math.round(score)} | CWV: ${cwvs}`);
        } else {
            row.Mobile_Speed_Score = 'ERROR';
            row.Core_Web_Vitals_Status = 'ERROR';
            console.log(`ERROR or Timeout`);
        }

        // Save after every request to ensure progress is never lost
        writeCsv(existingData);

        // Sleep to respect quotas
        if (i < pendingUrls.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log(`\n🎉 Mirror Process Finished. Output saved at: ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error('FATAL ERROR:', err.message);
});
