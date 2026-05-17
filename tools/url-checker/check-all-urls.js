/**
 * URL Health Checker for jus-tice.co.il
 * ======================================
 * Pings every article URL and reports:
 * - Status code (200, 301, 302, 404, 500, etc.)
 * - Redirect chain (if any)
 * - Final destination URL
 * - Response time
 * 
 * Usage: node check-all-urls.js
 * Output: ../../reports/url-health-report.csv + url-health-report.json
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_BASE = 'https://jus-tice.co.il';
const CONCURRENCY = 5; // max simultaneous requests (be gentle on server)
const TIMEOUT_MS = 15000; // 15s timeout per request
const INVENTORY_PATH = path.join(__dirname, '..', '..', '..', 'project-control', 'full-inventory.csv');
const REPORT_DIR = path.join(__dirname, '..', '..', '..', 'reports');
const REPORT_CSV = path.join(REPORT_DIR, 'url-health-report.csv');
const REPORT_JSON = path.join(REPORT_DIR, 'url-health-report.json');

/**
 * Parse the full-inventory.csv to extract article URLs
 */
function parseInventory(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const header = lines[0];
  const articles = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // CSV parsing: id,url,slug,title,status
    // URL is the second field, but may contain commas in title (quoted)
    const match = line.match(/^(\d+),([^,]+),([^,]+),(".*?"|[^,]*),(publish|draft|private|pending|trash)/);
    if (match) {
      articles.push({
        id: parseInt(match[1]),
        url: match[2],
        slug: match[3],
        title: match[4].replace(/^"|"$/g, ''),
        status: match[5]
      });
    }
  }
  return articles;
}

/**
 * Check a single URL - follow redirects manually to track chain
 */
async function checkUrl(url) {
  const startTime = Date.now();
  const redirectChain = [];
  let currentUrl = url;
  let finalStatus = null;
  let error = null;

  for (let hop = 0; hop < 10; hop++) {
    try {
      const response = await axios.get(currentUrl, {
        maxRedirects: 0, // Don't auto-follow - we track manually
        timeout: TIMEOUT_MS,
        validateStatus: () => true, // Accept all status codes
        headers: {
          'User-Agent': 'JusTice-URLChecker/1.0 (SEO Health Check)',
          'Accept': 'text/html',
        }
      });

      finalStatus = response.status;

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.location;
        if (!location) {
          error = 'Redirect without Location header';
          break;
        }
        // Resolve relative URLs
        const nextUrl = location.startsWith('http') ? location : new URL(location, currentUrl).href;
        redirectChain.push({ from: currentUrl, to: nextUrl, status: response.status });
        currentUrl = nextUrl;
      } else {
        break; // Not a redirect, we're done
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        finalStatus = 'TIMEOUT';
        error = `Timeout after ${TIMEOUT_MS}ms`;
      } else if (err.code === 'ENOTFOUND') {
        finalStatus = 'DNS_FAIL';
        error = 'DNS resolution failed';
      } else if (err.code === 'ECONNREFUSED') {
        finalStatus = 'CONN_REFUSED';
        error = 'Connection refused';
      } else {
        finalStatus = 'ERROR';
        error = err.message || String(err);
      }
      break;
    }
  }

  return {
    originalUrl: url,
    finalUrl: currentUrl,
    statusCode: finalStatus,
    redirectCount: redirectChain.length,
    redirectChain: redirectChain,
    responseTime: Date.now() - startTime,
    error: error,
    isAlive: finalStatus === 200,
    is404: finalStatus === 404,
    isRedirect: redirectChain.length > 0,
    hasRedirectChain: redirectChain.length > 1
  };
}

/**
 * Process URLs in batches with concurrency limit
 */
async function checkAllUrls(articles) {
  const results = [];
  const total = articles.length;
  let completed = 0;
  let alive = 0, redirects = 0, notFound = 0, errors = 0;

  console.log(`\n🔍 Checking ${total} URLs on ${SITE_BASE}...`);
  console.log(`   Concurrency: ${CONCURRENCY} | Timeout: ${TIMEOUT_MS}ms\n`);

  // Process in batches
  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = articles.slice(i, i + CONCURRENCY);
    const batchPromises = batch.map(article => checkUrl(article.url));
    const batchResults = await Promise.all(batchPromises);

    for (let j = 0; j < batchResults.length; j++) {
      const result = { ...batchResults[j], postId: batch[j].id, title: batch[j].title, slug: batch[j].slug };
      results.push(result);
      completed++;

      // Update counters
      if (result.isAlive) alive++;
      else if (result.is404) notFound++;
      else if (result.isRedirect) redirects++;
      else errors++;

      // Progress log every 25 URLs
      if (completed % 25 === 0 || completed === total) {
        const pct = ((completed / total) * 100).toFixed(1);
        process.stdout.write(`\r   Progress: ${completed}/${total} (${pct}%) | ✅ ${alive} | 🔄 ${redirects} | ❌ ${notFound} | ⚠️ ${errors}`);
      }
    }

    // Small delay between batches to be respectful
    if (i + CONCURRENCY < total) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('\n');
  return results;
}

/**
 * Generate CSV report
 */
function generateCsvReport(results) {
  const header = 'post_id,original_url,final_url,status_code,redirect_count,response_time_ms,is_alive,is_404,has_redirect_chain,slug,title,error';
  const rows = results.map(r => {
    const title = (r.title || '').replace(/"/g, '""');
    const slug = (r.slug || '').replace(/"/g, '""');
    const err = (r.error || '').replace(/"/g, '""');
    return `${r.postId},"${r.originalUrl}","${r.finalUrl}",${r.statusCode},${r.redirectCount},${r.responseTime},${r.isAlive},${r.is404},${r.hasRedirectChain},"${slug}","${title}","${err}"`;
  });
  return header + '\n' + rows.join('\n') + '\n';
}

/**
 * Generate summary report
 */
function generateSummary(results) {
  const alive = results.filter(r => r.isAlive);
  const redirected = results.filter(r => r.isRedirect);
  const notFound = results.filter(r => r.is404);
  const serverErrors = results.filter(r => [500, 502, 503].includes(r.statusCode));
  const otherErrors = results.filter(r => !r.isAlive && !r.is404 && !r.isRedirect && !serverErrors.includes(r));
  const chainRedirects = results.filter(r => r.hasRedirectChain);
  const hebrewSlugs = results.filter(r => r.slug && /%[dD][7]/.test(r.slug));

  console.log('═══════════════════════════════════════════════');
  console.log('          URL HEALTH CHECK REPORT');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total URLs checked:     ${results.length}`);
  console.log(`  ✅ Alive (200):          ${alive.length}`);
  console.log(`  🔄 Redirected (3xx):     ${redirected.length}`);
  console.log(`  ❌ Not Found (404):      ${notFound.length}`);
  console.log(`  💥 Server Errors (5xx):  ${serverErrors.length}`);
  console.log(`  ⚠️  Other Errors:        ${otherErrors.length}`);
  console.log(`  🔗 Redirect Chains (2+): ${chainRedirects.length}`);
  console.log(`  🔤 Hebrew Slugs:         ${hebrewSlugs.length}`);
  console.log('═══════════════════════════════════════════════');

  if (notFound.length > 0) {
    console.log('\n❌ 404 NOT FOUND URLs:');
    notFound.slice(0, 20).forEach(r => {
      console.log(`   [${r.postId}] ${r.originalUrl}`);
    });
    if (notFound.length > 20) console.log(`   ... and ${notFound.length - 20} more`);
  }

  if (chainRedirects.length > 0) {
    console.log('\n🔗 REDIRECT CHAINS (Multiple hops):');
    chainRedirects.slice(0, 10).forEach(r => {
      console.log(`   [${r.postId}] ${r.originalUrl}`);
      r.redirectChain.forEach((hop, i) => {
        console.log(`      ${i + 1}. [${hop.status}] → ${hop.to}`);
      });
    });
    if (chainRedirects.length > 10) console.log(`   ... and ${chainRedirects.length - 10} more`);
  }

  if (serverErrors.length > 0) {
    console.log('\n💥 SERVER ERRORS:');
    serverErrors.forEach(r => {
      console.log(`   [${r.statusCode}] ${r.originalUrl}`);
    });
  }

  return {
    total: results.length,
    alive: alive.length,
    redirected: redirected.length,
    notFound: notFound.length,
    serverErrors: serverErrors.length,
    otherErrors: otherErrors.length,
    chainRedirects: chainRedirects.length,
    hebrewSlugs: hebrewSlugs.length,
    notFoundUrls: notFound.map(r => ({ postId: r.postId, url: r.originalUrl, title: r.title })),
    chainRedirectUrls: chainRedirects.map(r => ({ postId: r.postId, url: r.originalUrl, chain: r.redirectChain }))
  };
}

// ═══════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   jus-tice.co.il — URL Health Checker v1.0    ║');
  console.log('╚═══════════════════════════════════════════════╝');

  // 1. Load inventory
  console.log(`\n📂 Loading inventory from: ${INVENTORY_PATH}`);
  if (!fs.existsSync(INVENTORY_PATH)) {
    console.error('❌ Inventory file not found! Expected at:', INVENTORY_PATH);
    process.exit(1);
  }
  const articles = parseInventory(INVENTORY_PATH);
  console.log(`   Found ${articles.length} articles`);

  // Filter to published only
  const published = articles.filter(a => a.status === 'publish');
  console.log(`   Published: ${published.length} | Other: ${articles.length - published.length}`);

  // 2. Check all URLs
  const results = await checkAllUrls(published);

  // 3. Generate reports
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

  // CSV report
  const csv = generateCsvReport(results);
  fs.writeFileSync(REPORT_CSV, csv, 'utf8');
  console.log(`📊 CSV report saved: ${REPORT_CSV}`);

  // Summary
  const summary = generateSummary(results);

  // JSON report (full details)
  const jsonReport = {
    timestamp: new Date().toISOString(),
    site: SITE_BASE,
    summary: summary,
    results: results
  };
  fs.writeFileSync(REPORT_JSON, JSON.stringify(jsonReport, null, 2), 'utf8');
  console.log(`📋 JSON report saved: ${REPORT_JSON}`);

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
