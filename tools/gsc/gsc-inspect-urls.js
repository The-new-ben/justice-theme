/**
 * Request Google to re-index our criminal law URLs via GSC URL Inspection API
 * Uses existing OAuth2 credentials from tools/gsc
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve(__dirname, '../../gsc-mirror/scripts');
const tokenPath = path.join(toolsDir, '..', '..', '..', '..', 'tools', 'gsc', 'gsc-token.json');
const clientPath = path.join(toolsDir, '..', '..', '..', '..', 'tools', 'gsc', 'oauth-client.json');

// Try to find the files
let actualTokenPath, actualClientPath;
const possibleRoots = [
  path.join(__dirname, '..', '..', '..', '..', 'tools', 'gsc'),
  'C:\\Users\\pro\\justice\\justice-theme\\tools\\gsc',
];

for (const root of possibleRoots) {
  if (fs.existsSync(path.join(root, 'gsc-token.json'))) {
    actualTokenPath = path.join(root, 'gsc-token.json');
    actualClientPath = path.join(root, 'oauth-client.json');
    break;
  }
}

if (!actualTokenPath) {
  console.log('ERROR: Cannot find GSC OAuth tokens. Run from tools/gsc first.');
  process.exit(1);
}

const token = JSON.parse(fs.readFileSync(actualTokenPath, 'utf8'));
const client = JSON.parse(fs.readFileSync(actualClientPath, 'utf8'));
const { client_id, client_secret } = client.installed || client.web;

const oauth2 = new google.auth.OAuth2(client_id, client_secret);
oauth2.setCredentials(token);

const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2 });

const siteUrl = 'https://jus-tice.co.il/';

const urls = [
  'https://jus-tice.co.il/criminal-defense-attorney/',
  'https://jus-tice.co.il/criminal-record-check/',
  'https://jus-tice.co.il/criminal-record-deletion/',
  'https://jus-tice.co.il/criminal-lawyer-cost/',
  'https://jus-tice.co.il/drug-crimes/',
  'https://jus-tice.co.il/shoplifting-defense/',
  'https://jus-tice.co.il/lahav-433-guide/',
  'https://jus-tice.co.il/police-investigation-rights/',
  'https://jus-tice.co.il/murder-charges/',
  'https://jus-tice.co.il/drug-trafficking/',
  'https://jus-tice.co.il/drug-possession/',
  'https://jus-tice.co.il/driving-under-influence/',
  'https://jus-tice.co.il/plea-bargain/',
  'https://jus-tice.co.il/fraud-types/',
  'https://jus-tice.co.il/arrest-rights/',
  'https://jus-tice.co.il/tax-crimes/',
  'https://jus-tice.co.il/criminal-negligence/',
  'https://jus-tice.co.il/criminal-appeal/',
];

async function inspectUrl(url) {
  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: siteUrl,
      }
    });
    const result = res.data.inspectionResult;
    const indexStatus = result?.indexStatusResult?.coverageState || 'unknown';
    const lastCrawl = result?.indexStatusResult?.lastCrawlTime || 'never';
    console.log(`${url} -> ${indexStatus} | Last crawl: ${lastCrawl}`);
    return { url, indexStatus, lastCrawl };
  } catch (err) {
    console.log(`${url} -> ERROR: ${err.message}`);
    return { url, error: err.message };
  }
}

async function main() {
  console.log('Inspecting URLs in GSC...\n');
  const results = [];
  for (const url of urls) {
    const r = await inspectUrl(url);
    results.push(r);
    // Rate limit: 2000/day but be gentle
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== SUMMARY ===');
  const indexed = results.filter(r => r.indexStatus === 'Submitted and indexed');
  const notIndexed = results.filter(r => r.indexStatus !== 'Submitted and indexed' && !r.error);
  const errors = results.filter(r => r.error);
  console.log(`Indexed: ${indexed.length}`);
  console.log(`Not indexed: ${notIndexed.length}`);
  console.log(`Errors: ${errors.length}`);
  
  // Save results
  fs.writeFileSync(path.join(__dirname, 'gsc-inspection-results.json'), JSON.stringify(results, null, 2));
  console.log('\nResults saved to gsc-inspection-results.json');
}

main().catch(console.error);
