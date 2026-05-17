/**
 * Phase A Migration: Sync DB slugs to existing PM English slugs
 * 
 * For 582 articles that already have English URLs via Permalink Manager
 * but Hebrew slugs in the database, this script updates post_name
 * to match the PM English slug — making them work natively.
 * 
 * Safe operation: URLs don't change, just DB alignment.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Config
const CREDS = require('../gsc/wp-app-password.json');
const AUTH = Buffer.from(`${CREDS.username}:${CREDS.app_password}`).toString('base64');
const API_BASE = `${CREDS.rest_api_url}/articles`;
const CONCURRENCY = 3;
const DELAY_MS = 500; // Be gentle on the server

const REPORTS_DIR = path.resolve(__dirname, '../../../reports');
const AUDIT_CSV = path.resolve(REPORTS_DIR, 'slug-audit-report.csv');

// Parse CSV
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += char; }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

// Sleep helper
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Update a single post slug via REST API
async function updateSlug(postId, newSlug) {
  try {
    const resp = await axios.post(`${API_BASE}/${postId}`, 
      { slug: newSlug },
      {
        headers: {
          'Authorization': `Basic ${AUTH}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    return { success: true, postId, newSlug, returnedSlug: resp.data.slug };
  } catch (err) {
    const msg = err.response ? `${err.response.status}: ${JSON.stringify(err.response.data?.message || '')}` : err.message;
    return { success: false, postId, newSlug, error: msg };
  }
}

// Process in batches
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
  console.log('║   Phase A: Sync DB Slugs to PM English Slugs ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // 1. Load audit data
  console.log('📂 Loading slug audit report...');
  const allArticles = parseCSV(AUDIT_CSV);
  
  // 2. Filter Phase A candidates
  const phaseA = allArticles
    .filter(a => a.slug_status === 'ENGLISH_URL_HEBREW_SLUG')
    .filter(a => a.existing_english_slug && a.existing_english_slug.length > 0)
    .map(a => ({
      postId: a.post_id,
      newSlug: a.existing_english_slug,
      oldSlug: a.decoded_slug,
      title: a.title,
      currentUrl: a.current_url
    }));
  
  console.log(`   Found ${phaseA.length} articles for Phase A\n`);
  
  // 3. Check for duplicate slugs
  console.log('🔍 Checking for duplicate target slugs...');
  const slugCounts = {};
  phaseA.forEach(a => {
    slugCounts[a.newSlug] = (slugCounts[a.newSlug] || 0) + 1;
  });
  const duplicates = Object.entries(slugCounts).filter(([, c]) => c > 1);
  
  if (duplicates.length > 0) {
    console.log(`   ⚠️  Found ${duplicates.length} duplicate target slugs:`);
    duplicates.forEach(([slug, count]) => {
      console.log(`      "${slug}" → ${count} articles`);
      // Deduplicate by appending post ID
      let idx = 0;
      phaseA.forEach(a => {
        if (a.newSlug === slug) {
          idx++;
          if (idx > 1) {
            a.newSlug = `${slug}-${a.postId}`;
            console.log(`      → Renamed to: ${a.newSlug}`);
          }
        }
      });
    });
  } else {
    console.log('   ✅ No duplicate slugs found\n');
  }
  
  // 4. Save rollback CSV (before making changes)
  const rollbackPath = path.join(REPORTS_DIR, 'phase-a-rollback.csv');
  const rollbackCSV = 'post_id,old_slug,new_slug,title\n' + 
    phaseA.map(a => `${a.postId},"${a.oldSlug}","${a.newSlug}","${(a.title || '').replace(/"/g, '""')}"`).join('\n');
  fs.writeFileSync(rollbackPath, rollbackCSV, 'utf-8');
  console.log(`💾 Rollback CSV saved: ${rollbackPath}\n`);

  // 5. DRY RUN check
  if (process.argv.includes('--dry-run')) {
    console.log('🏃 DRY RUN MODE — No changes made.');
    console.log(`   Would update ${phaseA.length} articles.`);
    console.log('   Run without --dry-run to execute.\n');
    return;
  }

  // 6. Execute updates
  console.log(`🚀 Updating ${phaseA.length} articles via REST API...`);
  console.log(`   Concurrency: ${CONCURRENCY} | Delay: ${DELAY_MS}ms\n`);
  
  const results = await processBatch(phaseA, CONCURRENCY);
  
  // 7. Report
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  
  console.log('\n\n═══════════════════════════════════════════════');
  console.log('          PHASE A MIGRATION REPORT');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total processed:  ${results.length}`);
  console.log(`  ✅ Success:       ${successes.length}`);
  console.log(`  ❌ Failed:        ${failures.length}`);
  
  // Slug mismatch check
  const mismatches = successes.filter(r => r.returnedSlug !== r.newSlug);
  if (mismatches.length > 0) {
    console.log(`  ⚠️  Slug mismatches: ${mismatches.length} (WP auto-modified)`);
  }
  
  // Save results
  const resultsPath = path.join(REPORTS_DIR, 'phase-a-results.csv');
  const resultsCSV = 'post_id,status,requested_slug,actual_slug,error\n' +
    results.map(r => `${r.postId},${r.success ? 'OK' : 'FAIL'},"${r.newSlug}","${r.returnedSlug || ''}","${(r.error || '').replace(/"/g, '""')}"`).join('\n');
  fs.writeFileSync(resultsPath, resultsCSV, 'utf-8');
  console.log(`\n📋 Results saved: ${resultsPath}`);
  
  if (failures.length > 0) {
    console.log('\n❌ Failed updates:');
    failures.slice(0, 10).forEach(f => {
      console.log(`   ID ${f.postId}: ${f.error}`);
    });
    if (failures.length > 10) console.log(`   ... and ${failures.length - 10} more`);
  }
  
  console.log('\n✅ Phase A complete!\n');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
