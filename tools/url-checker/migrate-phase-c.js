/**
 * Phase C Migration: Retry failed items from Phase A and Phase B
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CREDS = require('../gsc/wp-app-password.json');
const AUTH = Buffer.from(`${CREDS.username}:${CREDS.app_password}`).toString('base64');
const API_BASE = `${CREDS.rest_api_url}/articles`;
const CONCURRENCY = 3;
const DELAY_MS = 600;

const REPORTS_DIR = path.resolve(__dirname, '../../../reports');
const PHASE_A_CSV = path.join(REPORTS_DIR, 'phase-a-results.csv');
const PHASE_B_CSV = path.join(REPORTS_DIR, 'phase-b-results.csv');

function parseFailures(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const failures = [];
  
  for (let i = 1; i < lines.length; i++) {
    // post_id,status,requested_slug,actual_slug,error
    const line = lines[i];
    const match = line.match(/^(\d+),FAIL,"([^"]+)","(.*?)","(.*?)"/);
    if (match) {
      failures.push({
        postId: match[1],
        newSlug: match[2],
        error: match[4]
      });
    }
  }
  return failures;
}

async function updateSlug(postId, newSlug) {
  try {
    const resp = await axios.post(`${API_BASE}/${postId}`,
      { slug: newSlug },
      {
        headers: { 'Authorization': `Basic ${AUTH}`, 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );
    return { success: true, postId, newSlug, returnedSlug: resp.data.slug };
  } catch (err) {
    const msg = err.response ? `${err.response.status}: ${(err.response.data?.message || '').substring(0, 120)}` : err.message;
    return { success: false, postId, newSlug, error: msg };
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function processBatch(items, batchSize) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const promises = batch.map(item => updateSlug(item.postId, item.newSlug));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    const done = Math.min(i + batchSize, items.length);
    const ok = results.filter(r => r.success).length;
    const fail = results.filter(r => !r.success).length;
    process.stdout.write(`\r   Progress: ${done}/${items.length} | ✅ ${ok} | ❌ ${fail}`);
    await sleep(DELAY_MS);
  }
  return results;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║  Phase C: Retry failed migrations (Blocked)   ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  const failedA = parseFailures(PHASE_A_CSV);
  const failedB = parseFailures(PHASE_B_CSV);
  const totalFailed = [...failedA, ...failedB];

  console.log(`📂 Found ${failedA.length} failures from Phase A`);
  console.log(`📂 Found ${failedB.length} failures from Phase B`);
  console.log(`   Total to retry: ${totalFailed.length}\n`);

  if (totalFailed.length === 0) {
    console.log('✅ Nothing to do.');
    return;
  }

  console.log(`🚀 Retrying ${totalFailed.length} articles via REST API...`);
  const results = await processBatch(totalFailed, CONCURRENCY);
  
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);

  console.log('\n\n═══════════════════════════════════════════════');
  console.log('          PHASE C MIGRATION REPORT');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total retried:    ${results.length}`);
  console.log(`  ✅ Success:       ${successes.length}`);
  console.log(`  ❌ Failed again:  ${failures.length}`);

  if (failures.length > 0) {
    console.log('\n❌ Remaining failures:');
    failures.forEach(f => console.log(`   ID ${f.postId}: ${f.error}`));
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
