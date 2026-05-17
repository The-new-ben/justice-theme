/**
 * Phase B Migration: Translate Hebrew slugs → English + update DB
 * 
 * For 601 articles with Hebrew-only URLs, this script:
 * 1. Translates Hebrew titles to clean English slugs
 * 2. Deduplicates and avoids keyword cannibalization  
 * 3. Updates post_name via REST API
 * 4. Generates a 301 redirect map for old→new URLs
 * 5. Saves rollback + results CSV
 *
 * Usage: node migrate-phase-b.js --dry-run   (preview only)
 *        node migrate-phase-b.js              (execute)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dict = require('./hebrew-english-dict');

const CREDS = require('../gsc/wp-app-password.json');
const AUTH = Buffer.from(`${CREDS.username}:${CREDS.app_password}`).toString('base64');
const API_BASE = `${CREDS.rest_api_url}/articles`;
const SITE = CREDS.site;
const CONCURRENCY = 3;
const DELAY_MS = 600;

const REPORTS_DIR = path.resolve(__dirname, '../../../reports');
const AUDIT_CSV = path.resolve(REPORTS_DIR, 'slug-audit-report.csv');
const DRY_RUN = process.argv.includes('--dry-run');

// ═══════════════════════════════════════
// CSV PARSER
// ═══════════════════════════════════════
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  return lines.slice(1).map(line => {
    const values = []; let current = ''; let inQ = false;
    for (const c of line) {
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { values.push(current.trim()); current = ''; }
      else current += c;
    }
    values.push(current.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

// ═══════════════════════════════════════
// HEBREW → ENGLISH TRANSLATION ENGINE
// ═══════════════════════════════════════

// Sort phrases by length (longest first for greedy matching)
const sortedPhrases = Object.keys(dict.phrases)
  .sort((a, b) => b.length - a.length);

function translateTitle(hebrewTitle) {
  let text = hebrewTitle.trim();
  const englishParts = [];
  
  // Step 1: Extract any existing English words/numbers
  const englishPattern = /[a-zA-Z0-9]+(?:[-'][a-zA-Z0-9]+)*/g;
  const existingEnglish = [];
  let m;
  while ((m = englishPattern.exec(text)) !== null) {
    const word = m[0].toLowerCase();
    if (word.length > 1 || /\d/.test(word)) {
      existingEnglish.push(word);
    }
  }
  
  // Step 2: Match phrases (longest first)
  let remaining = text;
  for (const phrase of sortedPhrases) {
    if (remaining.includes(phrase)) {
      englishParts.push(dict.phrases[phrase]);
      remaining = remaining.replace(phrase, ' ');
    }
  }
  
  // Step 3: Match individual words
  const hebrewWords = remaining.split(/[\s,;:.\-–—|()[\]{}""״׳'!?\/]+/).filter(w => w.length > 0);
  for (const word of hebrewWords) {
    // Remove prefix letters (ה,ב,ל,מ,ו,כ,ש)
    const prefixes = ['ה', 'ב', 'ל', 'מ', 'ו', 'כ', 'ש'];
    let lookup = word;
    
    if (dict.words[lookup]) {
      englishParts.push(dict.words[lookup]);
    } else {
      // Try removing single-letter prefix
      for (const p of prefixes) {
        if (lookup.startsWith(p) && lookup.length > 2) {
          const stripped = lookup.slice(1);
          if (dict.words[stripped]) {
            englishParts.push(dict.words[stripped]);
            break;
          }
          // Try removing double prefix (e.g., "והגירושין" → "גירושין")
          for (const p2 of prefixes) {
            if (stripped.startsWith(p2) && stripped.length > 2) {
              const stripped2 = stripped.slice(1);
              if (dict.words[stripped2]) {
                englishParts.push(dict.words[stripped2]);
                break;
              }
            }
          }
        }
      }
    }
  }
  
  // Step 4: Add English words that aren't already present
  for (const ew of existingEnglish) {
    if (!englishParts.includes(ew) && !dict.stopWords.has(ew)) {
      englishParts.push(ew);
    }
  }
  
  // Step 5: Deduplicate parts while preserving order
  const seen = new Set();
  const unique = englishParts.filter(p => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });
  
  return unique;
}

function generateSlug(hebrewTitle, postId) {
  const parts = translateTitle(hebrewTitle);
  
  if (parts.length === 0) {
    // Fallback: use post ID with 'article' prefix
    return `article-${postId}`;
  }
  
  // Limit to 6 meaningful terms for URL brevity
  let slug = parts.slice(0, 6).join('-');
  
  // Clean up
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Ensure minimum length
  if (slug.length < 3) {
    slug = `article-${postId}`;
  }
  
  return slug;
}

// ═══════════════════════════════════════
// ANTI-CANNIBALIZATION ENGINE
// ═══════════════════════════════════════

// Track ALL slugs (including Phase A results) to avoid conflicts
function loadExistingSlugs() {
  const existing = new Set();
  
  // Load Phase A results
  const phaseAPath = path.join(REPORTS_DIR, 'phase-a-results.csv');
  if (fs.existsSync(phaseAPath)) {
    const lines = fs.readFileSync(phaseAPath, 'utf-8').split('\n').slice(1);
    lines.forEach(l => {
      const parts = l.split(',');
      if (parts[1] === 'OK' && parts[3]) {
        existing.add(parts[3].replace(/"/g, ''));
      }
    });
  }
  
  // Load ENGLISH_OK articles from audit
  const allArticles = parseCSV(AUDIT_CSV);
  allArticles
    .filter(a => a.slug_status === 'ENGLISH_OK')
    .forEach(a => existing.add(a.decoded_slug));
  
  return existing;
}

function deduplicateSlugs(items, existingSlugs) {
  const slugMap = new Map(); // slug → [items]
  const finalItems = [];
  
  // Group by slug
  items.forEach(item => {
    const key = item.newSlug;
    if (!slugMap.has(key)) slugMap.set(key, []);
    slugMap.get(key).push(item);
  });
  
  // Synonyms for anti-cannibalization
  const synonyms = {
    'lawyer': ['attorney', 'counsel', 'advocate', 'legal-advisor'],
    'divorce': ['marital-separation', 'dissolution', 'separation'],
    'agreement': ['contract', 'arrangement', 'accord'],
    'guide': ['handbook', 'overview', 'primer', 'resource'],
    'cost': ['pricing', 'fees', 'rates', 'expense'],
    'recommended': ['top-rated', 'leading', 'trusted', 'best'],
    'criminal': ['penal', 'defense', 'prosecution'],
    'property': ['real-estate', 'asset', 'holding'],
    'compensation': ['damages', 'recovery', 'remedy'],
    'court': ['tribunal', 'bench', 'judicial'],
    'verdict': ['ruling', 'judgment', 'decision'],
    'investigation': ['inquiry', 'probe', 'examination'],
    'custody': ['guardianship', 'care', 'parenting'],
    'tax': ['fiscal', 'revenue', 'levy'],
    'insurance': ['coverage', 'policy', 'indemnity'],
  };
  
  for (const [slug, group] of slugMap) {
    if (group.length === 1 && !existingSlugs.has(slug)) {
      finalItems.push(group[0]);
      existingSlugs.add(slug);
    } else {
      // Disambiguate duplicates
      group.forEach((item, idx) => {
        let newSlug = slug;
        
        if (idx > 0 || existingSlugs.has(slug)) {
          // Try synonym replacement first
          let diversified = false;
          const parts = slug.split('-');
          
          for (const [word, syns] of Object.entries(synonyms)) {
            const wordIdx = parts.indexOf(word);
            if (wordIdx !== -1) {
              const synIdx = (idx - (existingSlugs.has(slug) ? 0 : 1)) % syns.length;
              parts[wordIdx] = syns[synIdx];
              newSlug = parts.join('-');
              if (!existingSlugs.has(newSlug)) {
                diversified = true;
                break;
              }
            }
          }
          
          // Fallback: append post ID
          if (!diversified || existingSlugs.has(newSlug)) {
            newSlug = `${slug}-${item.postId}`;
          }
        }
        
        item.newSlug = newSlug;
        finalItems.push(item);
        existingSlugs.add(newSlug);
      });
    }
  }
  
  return finalItems;
}

// ═══════════════════════════════════════
// REST API UPDATE
// ═══════════════════════════════════════
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Phase B: Translate Hebrew Slugs → English + Update ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // 1. Load data
  console.log('📂 Loading audit data...');
  const allArticles = parseCSV(AUDIT_CSV);
  const phaseB = allArticles
    .filter(a => a.slug_status === 'NEEDS_TRANSLATION')
    .map(a => ({
      postId: a.post_id,
      title: a.title,
      oldSlug: a.decoded_slug,
      currentUrl: a.current_url,
      newSlug: '' // will be generated
    }));
  console.log(`   Found ${phaseB.length} articles for Phase B\n`);

  // 2. Generate English slugs
  console.log('🔤 Translating Hebrew titles to English slugs...');
  let translatedCount = 0;
  let fallbackCount = 0;
  
  phaseB.forEach(item => {
    item.newSlug = generateSlug(item.title, item.postId);
    if (item.newSlug.startsWith('article-')) {
      fallbackCount++;
    } else {
      translatedCount++;
    }
  });
  console.log(`   ✅ Translated: ${translatedCount}`);
  console.log(`   🔄 Fallback (ID-based): ${fallbackCount}\n`);

  // 3. Deduplicate + anti-cannibalization
  console.log('🔍 Deduplicating and checking for cannibalization...');
  const existingSlugs = loadExistingSlugs();
  console.log(`   Existing slugs to avoid: ${existingSlugs.size}`);
  const deduplicated = deduplicateSlugs(phaseB, existingSlugs);
  console.log(`   ✅ All ${deduplicated.length} slugs are unique\n`);

  // 4. Save rollback CSV
  const rollbackPath = path.join(REPORTS_DIR, 'phase-b-rollback.csv');
  const rollbackCSV = 'post_id,old_hebrew_slug,new_english_slug,title\n' +
    deduplicated.map(a => `${a.postId},"${a.oldSlug}","${a.newSlug}","${(a.title || '').replace(/"/g, '""')}"`).join('\n');
  fs.writeFileSync(rollbackPath, rollbackCSV, 'utf-8');
  console.log(`💾 Rollback saved: ${rollbackPath}`);

  // 5. Generate 301 redirect map
  const redirectPath = path.join(REPORTS_DIR, 'redirect-map-301.csv');
  const redirectCSV = 'old_url,new_url,status_code\n' +
    deduplicated.map(a => {
      const oldUrl = a.currentUrl || `${SITE}/${encodeURIComponent(a.oldSlug)}/`;
      const newUrl = `${SITE}/${a.newSlug}/`;
      return `"${oldUrl}","${newUrl}",301`;
    }).join('\n');
  fs.writeFileSync(redirectPath, redirectCSV, 'utf-8');
  console.log(`🔀 301 redirect map saved: ${redirectPath}\n`);

  // 6. Show sample translations
  console.log('📋 Sample translations (first 15):');
  deduplicated.slice(0, 15).forEach(a => {
    const title = (a.title || '').substring(0, 40);
    console.log(`   "${title}..." → ${a.newSlug}`);
  });
  console.log('');

  // 7. DRY RUN check
  if (DRY_RUN) {
    console.log('🏃 DRY RUN MODE — No DB changes made.');
    console.log(`   Would update ${deduplicated.length} articles.`);
    console.log('   Run without --dry-run to execute.\n');
    return;
  }

  // 8. Execute updates
  console.log(`🚀 Updating ${deduplicated.length} articles via REST API...`);
  console.log(`   Concurrency: ${CONCURRENCY} | Delay: ${DELAY_MS}ms\n`);
  
  const results = await processBatch(deduplicated, CONCURRENCY);
  
  // 9. Report
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  
  console.log('\n\n═══════════════════════════════════════════════');
  console.log('          PHASE B MIGRATION REPORT');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total processed:  ${results.length}`);
  console.log(`  ✅ Success:       ${successes.length}`);
  console.log(`  ❌ Failed:        ${failures.length}`);
  
  const mismatches = successes.filter(r => r.returnedSlug !== r.newSlug);
  if (mismatches.length > 0) {
    console.log(`  ⚠️  Slug mismatches: ${mismatches.length}`);
  }
  
  // Save results
  const resultsPath = path.join(REPORTS_DIR, 'phase-b-results.csv');
  const resultsCSV = 'post_id,status,requested_slug,actual_slug,error\n' +
    results.map(r => `${r.postId},${r.success ? 'OK' : 'FAIL'},"${r.newSlug}","${r.returnedSlug || ''}","${(r.error || '').replace(/"/g, '""')}"`).join('\n');
  fs.writeFileSync(resultsPath, resultsCSV, 'utf-8');
  console.log(`\n📋 Results: ${resultsPath}`);
  
  if (failures.length > 0) {
    console.log('\n❌ Sample failures:');
    failures.slice(0, 10).forEach(f => console.log(`   ID ${f.postId}: ${f.error}`));
    if (failures.length > 10) console.log(`   ... and ${failures.length - 10} more`);
  }
  
  console.log('\n✅ Phase B complete!\n');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
