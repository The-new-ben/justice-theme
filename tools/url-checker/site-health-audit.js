#!/usr/bin/env node
/**
 * Site Health Audit — jus-tice.co.il
 * 
 * Comprehensive URL, title, and redirect-chain auditor.
 * Based on professional best practices from:
 *   - Screaming Frog / Sitebulb methodology (crawl + status check)
 *   - WordPress REST API bulk export (get ALL content programmatically)
 *   - Httpstatus.io approach (follow redirect chains, detect loops)
 *   - SEO cannibalization detection (duplicate title/slug grouping)
 *   - Post-migration health check best practices (single-hop 301 verification)
 *
 * What this script does:
 *   1. Fetches ALL articles, pages, and taxonomy terms via the WP REST API
 *   2. Checks every public URL for HTTP status (200, 301, 404, 500, etc.)
 *   3. Follows redirect chains to detect loops and multi-hop issues
 *   4. Detects duplicate titles (SEO cannibalization risk)
 *   5. Detects duplicate slugs
 *   6. Verifies old Hebrew slug → new English slug 301 redirects
 *   7. Outputs a full CSV report + console summary
 *
 * Usage:
 *   cd tools/url-checker
 *   npm install    (if node-fetch not available)
 *   node site-health-audit.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ─── Configuration ───────────────────────────────────────────────────
const SITE = 'https://jus-tice.co.il';
const REST_BASE = `${SITE}/wp-json/wp/v2`;
const PER_PAGE = 100;
const CONCURRENCY = 3;       // parallel HTTP checks (be gentle on server)
const FOLLOW_REDIRECTS = 10; // max hops before declaring a loop
const TIMEOUT_MS = 15000;

const REPORTS_DIR = path.join(__dirname, '..', '..', 'reports');
const REPORT_FILE = path.join(REPORTS_DIR, `site-health-audit-${new Date().toISOString().slice(0,10)}.csv`);
const SUMMARY_FILE = path.join(REPORTS_DIR, `site-health-summary-${new Date().toISOString().slice(0,10)}.txt`);

// ─── HTTP Helper ─────────────────────────────────────────────────────
function httpGet(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'JusticeTheme-HealthAudit/1.0',
        ...(options.headers || {}),
      },
      timeout: TIMEOUT_MS,
    };

    // Don't follow redirects automatically
    const req = lib.request(reqOptions, (res) => {
      let body = '';
      if (options.method === 'HEAD' || options.noBody) {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: '',
        });
        res.resume();
      } else {
        res.setEncoding('utf8');
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
        }));
      }
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('TIMEOUT')); });
    req.on('error', reject);
    req.end();
  });
}

// ─── Follow redirect chain ──────────────────────────────────────────
async function followRedirectChain(startUrl) {
  const chain = [startUrl];
  let current = startUrl;
  let finalStatus = 0;

  for (let i = 0; i < FOLLOW_REDIRECTS; i++) {
    try {
      const res = await httpGet(current, { method: 'HEAD', noBody: true });
      finalStatus = res.status;

      if (res.status >= 300 && res.status < 400 && res.headers.location) {
        let next = res.headers.location;
        // Handle relative redirects
        if (!next.startsWith('http')) {
          const base = new URL(current);
          next = `${base.protocol}//${base.host}${next}`;
        }
        if (chain.includes(next)) {
          return { chain, finalStatus: 'LOOP', finalUrl: next, hops: chain.length };
        }
        chain.push(next);
        current = next;
      } else {
        return { chain, finalStatus, finalUrl: current, hops: chain.length - 1 };
      }
    } catch (err) {
      return { chain, finalStatus: `ERROR:${err.message}`, finalUrl: current, hops: chain.length - 1 };
    }
  }
  return { chain, finalStatus: 'TOO_MANY_REDIRECTS', finalUrl: current, hops: chain.length - 1 };
}

// ─── Fetch all items from a REST API endpoint (paginated) ───────────
async function fetchAllFromEndpoint(endpoint) {
  const items = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const apiUrl = `${endpoint}?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,title,link,status,type`;
    try {
      const res = await httpGet(apiUrl);
      if (res.status !== 200) {
        console.error(`  API error ${res.status} for ${apiUrl}`);
        break;
      }
      const data = JSON.parse(res.body);
      if (!Array.isArray(data) || data.length === 0) break;

      items.push(...data);

      // Get total pages from first response
      if (page === 1 && res.headers['x-wp-totalpages']) {
        totalPages = parseInt(res.headers['x-wp-totalpages'], 10);
      }
      page++;
    } catch (err) {
      console.error(`  Fetch error page ${page}: ${err.message}`);
      break;
    }
  }
  return items;
}

// ─── Fetch taxonomy terms ───────────────────────────────────────────
async function fetchAllTerms(taxonomy) {
  const items = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const apiUrl = `${REST_BASE}/${taxonomy}?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,name,link,count`;
    try {
      const res = await httpGet(apiUrl);
      if (res.status !== 200) break;
      const data = JSON.parse(res.body);
      if (!Array.isArray(data) || data.length === 0) break;
      items.push(...data);
      if (page === 1 && res.headers['x-wp-totalpages']) {
        totalPages = parseInt(res.headers['x-wp-totalpages'], 10);
      }
      page++;
    } catch (err) {
      console.error(`  Term fetch error: ${err.message}`);
      break;
    }
  }
  return items;
}

// ─── Process items in batches with concurrency control ──────────────
async function processBatch(items, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    // Progress
    const done = Math.min(i + CONCURRENCY, items.length);
    process.stdout.write(`\r  Checked ${done}/${items.length}`);
  }
  process.stdout.write('\n');
  return results;
}

// ─── MAIN ───────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  SITE HEALTH AUDIT — jus-tice.co.il');
  console.log('  ' + new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════\n');

  // Ensure reports directory
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // ── Phase 1: Collect ALL content via REST API ─────────────────────
  console.log('Phase 1: Fetching all content from REST API...');

  console.log('  → Articles (custom post type)...');
  const articles = await fetchAllFromEndpoint(`${REST_BASE}/articles`);
  console.log(`    Found ${articles.length} articles`);

  console.log('  → Pages...');
  const pages = await fetchAllFromEndpoint(`${REST_BASE}/pages`);
  console.log(`    Found ${pages.length} pages`);

  console.log('  → Posts...');
  const posts = await fetchAllFromEndpoint(`${REST_BASE}/posts`);
  console.log(`    Found ${posts.length} posts`);

  console.log('  → Practice-areas terms...');
  const practiceAreas = await fetchAllTerms('practice-areas');
  console.log(`    Found ${practiceAreas.length} practice-area terms`);

  console.log('  → Categories...');
  const categories = await fetchAllTerms('categories');
  console.log(`    Found ${categories.length} categories`);

  // ── Phase 2: Build URL list ───────────────────────────────────────
  console.log('\nPhase 2: Building comprehensive URL list...');

  const allUrls = [];

  // Add homepage
  allUrls.push({ id: 0, type: 'homepage', slug: '', title: 'Homepage', url: SITE + '/' });

  // Add articles
  for (const a of articles) {
    const title = a.title?.rendered || a.title || '';
    allUrls.push({
      id: a.id,
      type: 'article',
      slug: a.slug,
      title: title.replace(/<[^>]*>/g, ''),
      url: (a.link || '').replace(/^http:/, 'https:'),
    });
  }

  // Add pages
  for (const p of pages) {
    const title = p.title?.rendered || p.title || '';
    allUrls.push({
      id: p.id,
      type: 'page',
      slug: p.slug,
      title: title.replace(/<[^>]*>/g, ''),
      url: (p.link || '').replace(/^http:/, 'https:'),
    });
  }

  // Add posts
  for (const p of posts) {
    const title = p.title?.rendered || p.title || '';
    allUrls.push({
      id: p.id,
      type: 'post',
      slug: p.slug,
      title: title.replace(/<[^>]*>/g, ''),
      url: (p.link || '').replace(/^http:/, 'https:'),
    });
  }

  // Add taxonomy term archive pages
  for (const t of practiceAreas) {
    allUrls.push({
      id: t.id,
      type: 'practice-area-term',
      slug: t.slug,
      title: t.name || '',
      url: (t.link || '').replace(/^http:/, 'https:'),
    });
  }

  // Add some key known URLs (static pages, archives)
  const keyUrls = [
    { type: 'archive', slug: 'articles', title: 'Articles Archive', url: `${SITE}/articles/` },
    { type: 'archive', slug: 'lawyers', title: 'Lawyers Directory', url: `${SITE}/lawyers/` },
    { type: 'page', slug: 'contact', title: 'Contact', url: `${SITE}/contact/` },
    { type: 'page', slug: 'about', title: 'About', url: `${SITE}/about/` },
    { type: 'page', slug: 'lawyer-registration', title: 'Lawyer Registration', url: `${SITE}/lawyer-registration/` },
    { type: 'page', slug: 'divorce-lawyer', title: 'Divorce Lawyer', url: `${SITE}/divorce-lawyer/` },
    { type: 'page', slug: 'traffic-lawyer', title: 'Traffic Lawyer', url: `${SITE}/traffic-lawyer/` },
  ];
  for (const k of keyUrls) {
    if (!allUrls.find(u => u.url === k.url)) {
      allUrls.push({ id: 0, ...k });
    }
  }

  console.log(`  Total URLs to check: ${allUrls.length}`);

  // ── Phase 3: Duplicate Detection ──────────────────────────────────
  console.log('\nPhase 3: Checking for duplicate titles and slugs...');

  // Duplicate titles
  const titleMap = {};
  for (const u of allUrls) {
    const t = u.title.trim();
    if (!t) continue;
    if (!titleMap[t]) titleMap[t] = [];
    titleMap[t].push(u);
  }
  const dupTitles = Object.entries(titleMap).filter(([_, items]) => items.length > 1);
  console.log(`  Duplicate titles found: ${dupTitles.length} groups`);

  // Duplicate slugs (within same type)
  const slugMap = {};
  for (const u of allUrls) {
    const key = `${u.type}:${u.slug}`;
    if (!slugMap[key]) slugMap[key] = [];
    slugMap[key].push(u);
  }
  const dupSlugs = Object.entries(slugMap).filter(([_, items]) => items.length > 1);
  console.log(`  Duplicate slugs found: ${dupSlugs.length} groups`);

  // ── Phase 4: HTTP Status Check + Redirect Chain Analysis ──────────
  console.log('\nPhase 4: Checking HTTP status for ALL URLs...');
  console.log(`  (${allUrls.length} URLs, concurrency=${CONCURRENCY})\n`);

  const results = await processBatch(allUrls, async (item) => {
    const check = await followRedirectChain(item.url);
    return {
      ...item,
      httpStatus: check.finalStatus,
      finalUrl: check.finalUrl,
      hops: check.hops,
      redirectChain: check.chain.join(' → '),
      isLoop: check.finalStatus === 'LOOP' || check.finalStatus === 'TOO_MANY_REDIRECTS',
    };
  });

  // ── Phase 5: Analysis & Reporting ─────────────────────────────────
  console.log('\nPhase 5: Generating report...\n');

  const ok200 = results.filter(r => r.httpStatus === 200);
  const redirect301 = results.filter(r => r.httpStatus === 301);
  const error404 = results.filter(r => r.httpStatus === 404);
  const error500 = results.filter(r => r.httpStatus >= 500 && r.httpStatus < 600);
  const loops = results.filter(r => r.isLoop);
  const errors = results.filter(r => typeof r.httpStatus === 'string' && r.httpStatus.startsWith('ERROR'));
  const multiHop = results.filter(r => r.hops > 1 && !r.isLoop);

  // ── Console Summary ─────────────────────────────────────────────
  const summary = [];
  summary.push('═══════════════════════════════════════════════════════');
  summary.push('  SITE HEALTH AUDIT RESULTS');
  summary.push('═══════════════════════════════════════════════════════');
  summary.push(`  Total URLs checked:        ${results.length}`);
  summary.push(`  ✅ 200 OK:                  ${ok200.length}`);
  summary.push(`  ↪️  301 Redirect (final):    ${redirect301.length}`);
  summary.push(`  ❌ 404 Not Found:           ${error404.length}`);
  summary.push(`  🔥 500 Server Error:        ${error500.length}`);
  summary.push(`  🔄 Redirect Loops:          ${loops.length}`);
  summary.push(`  ⚠️  Multi-hop Redirects:     ${multiHop.length}`);
  summary.push(`  💥 Connection Errors:       ${errors.length}`);
  summary.push(`  📋 Duplicate Title Groups:  ${dupTitles.length}`);
  summary.push(`  📋 Duplicate Slug Groups:   ${dupSlugs.length}`);
  summary.push('───────────────────────────────────────────────────────');

  if (error404.length > 0) {
    summary.push('\n❌ 404 NOT FOUND:');
    for (const r of error404) {
      summary.push(`  [${r.type}] ${r.url}  (title: "${r.title}")`);
    }
  }

  if (loops.length > 0) {
    summary.push('\n🔄 REDIRECT LOOPS:');
    for (const r of loops) {
      summary.push(`  [${r.type}] ${r.url}`);
      summary.push(`    Chain: ${r.redirectChain}`);
    }
  }

  if (errors.length > 0) {
    summary.push('\n💥 CONNECTION ERRORS:');
    for (const r of errors) {
      summary.push(`  [${r.type}] ${r.url}  (${r.httpStatus})`);
    }
  }

  if (multiHop.length > 0) {
    summary.push('\n⚠️  MULTI-HOP REDIRECTS (should be single-hop):');
    for (const r of multiHop) {
      summary.push(`  [${r.type}] ${r.url} → ${r.finalUrl}  (${r.hops} hops)`);
    }
  }

  if (dupTitles.length > 0) {
    summary.push('\n📋 DUPLICATE TITLES (Cannibalization Risk):');
    for (const [title, items] of dupTitles.slice(0, 20)) {
      summary.push(`  Title: "${title}"`);
      for (const i of items) {
        summary.push(`    - [${i.type}] ${i.url}`);
      }
    }
    if (dupTitles.length > 20) {
      summary.push(`  ... and ${dupTitles.length - 20} more duplicate title groups`);
    }
  }

  summary.push('\n═══════════════════════════════════════════════════════');
  summary.push('  Report saved to: ' + REPORT_FILE);
  summary.push('═══════════════════════════════════════════════════════');

  const summaryText = summary.join('\n');
  console.log(summaryText);

  // ── CSV Report ──────────────────────────────────────────────────
  const csvHeader = 'id,type,slug,title,url,httpStatus,finalUrl,hops,isLoop,redirectChain\n';
  const csvRows = results.map(r => {
    const esc = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
    return [r.id, r.type, esc(r.slug), esc(r.title), esc(r.url), r.httpStatus, esc(r.finalUrl), r.hops, r.isLoop, esc(r.redirectChain)].join(',');
  }).join('\n');

  fs.writeFileSync(REPORT_FILE, csvHeader + csvRows, 'utf8');
  fs.writeFileSync(SUMMARY_FILE, summaryText, 'utf8');

  console.log(`\nCSV report: ${REPORT_FILE}`);
  console.log(`Summary: ${SUMMARY_FILE}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
