#!/usr/bin/env node
/**
 * Cycle 2: Crawl URL variants — check HTTP status of old vs new URLs.
 * For every WP article at /articles/slug/, also test /slug/.
 * For every GSC URL without /articles/, also test /articles/slug/.
 * Output: output/crawl/url-status-map.csv
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'output', 'crawl', 'url-status-map.csv');
const WP_CSV = path.join(__dirname, '..', 'output', 'crawl', 'wp-url-inventory.csv');
const GSC_CSV = path.join(__dirname, '..', 'output', 'gsc', 'gsc-url-inventory.csv');
const SITE = 'https://jus-tice.co.il';
const CONCURRENCY = 5;
const TIMEOUT = 15000;

function httpHead(targetUrl) {
  return new Promise((resolve) => {
    const parsed = new URL(targetUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: parsed.hostname, path: parsed.pathname + parsed.search,
      method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36', 'Accept': 'text/html' }, timeout: TIMEOUT,
    }, res => {
      let body = '';
      res.on('data', c => { if (body.length < 50000) body += c; });
      res.on('end', () => {
        // Extract title, h1, canonical from body
        const titleMatch = body.match(/<title[^>]*>([^<]*)<\/title>/i);
        const h1Match = body.match(/<h1[^>]*>([^<]*)<\/h1>/i);
        const canonMatch = body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i);
        const robotsMatch = body.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"[^>]*>/i);
        resolve({
          status: res.statusCode,
          location: res.headers.location || '',
          title: (titleMatch?.[1] || '').trim(),
          h1: (h1Match?.[1] || '').trim(),
          canonical: (canonMatch?.[1] || '').trim(),
          robots: (robotsMatch?.[1] || '').trim(),
        });
      });
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', location:'', title:'', h1:'', canonical:'', robots:'' }); });
    req.on('error', (e) => resolve({ status: `ERR:${e.code||e.message}`, location:'', title:'', h1:'', canonical:'', robots:'' }));
    req.end();
  });
}

async function followChain(startUrl, maxHops = 10) {
  const chain = [startUrl]; let current = startUrl; let finalData = {};
  for (let i = 0; i < maxHops; i++) {
    const r = await httpHead(current);
    finalData = r;
    if (r.status >= 300 && r.status < 400 && r.location) {
      let next = r.location;
      if (!next.startsWith('http')) { const b = new URL(current); next = `${b.protocol}//${b.host}${next}`; }
      if (chain.includes(next)) return { chain, ...finalData, status: 'LOOP' };
      chain.push(next); current = next;
    } else {
      return { chain, ...finalData, finalUrl: current };
    }
  }
  return { chain, ...finalData, status: 'TOO_MANY_REDIRECTS', finalUrl: current };
}

function parseCsv(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const header = lines[0].split(',');
  return lines.slice(1).map(line => {
    const vals = []; let current = ''; let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { vals.push(current); current = ''; }
      else { current += ch; }
    }
    vals.push(current);
    const obj = {};
    header.forEach((h, i) => obj[h.trim()] = (vals[i] || '').trim());
    return obj;
  });
}

async function processBatch(items, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    results.push(...await Promise.all(batch.map(fn)));
    process.stdout.write(`\r  ${Math.min(i + CONCURRENCY, items.length)}/${items.length}`);
  }
  console.log('');
  return results;
}

// Detect homepage by checking if title contains common homepage keywords
const HP_SIGS = ['עורכי דין בישראל', 'פורטל משפטי', 'Jus-Tice.co.il', 'jus●tice'];

async function main() {
  console.log('=== URL STATUS CRAWL ===\n');

  // Build unique URL set to test
  const urlsToTest = new Map(); // url -> { type, source, wpId, gscClicks, gscImps }

  // From WP inventory
  if (fs.existsSync(WP_CSV)) {
    const wp = parseCsv(WP_CSV);
    console.log(`Loaded ${wp.length} WP URLs`);
    for (const row of wp) {
      const url = row.current_url;
      if (!url || !url.startsWith('http')) continue;
      urlsToTest.set(url, { type: 'wp_current', source: 'wp', wpId: row.post_id, gscClicks: 0, gscImps: 0 });

      // For articles with /articles/ prefix, also test root-level variant
      if (row.has_articles_prefix === 'YES' && row.post_type === 'article') {
        const slug = row.slug;
        const rootUrl = `${SITE}/${slug}/`;
        if (!urlsToTest.has(rootUrl)) {
          urlsToTest.set(rootUrl, { type: 'old_root_variant', source: 'wp_derived', wpId: row.post_id, gscClicks: 0, gscImps: 0 });
        }
      }
    }
  }

  // From GSC inventory
  if (fs.existsSync(GSC_CSV)) {
    const gsc = parseCsv(GSC_CSV);
    console.log(`Loaded ${gsc.length} GSC URLs`);
    for (const row of gsc) {
      const url = row.gsc_url;
      if (!url || !url.startsWith('http')) continue;
      if (urlsToTest.has(url)) {
        urlsToTest.get(url).gscClicks = parseInt(row.clicks_12m) || 0;
        urlsToTest.get(url).gscImps = parseInt(row.impressions_12m) || 0;
      } else {
        urlsToTest.set(url, {
          type: row.has_articles_prefix === 'YES' ? 'gsc_with_prefix' : 'gsc_old_url',
          source: 'gsc', wpId: '', gscClicks: parseInt(row.clicks_12m) || 0, gscImps: parseInt(row.impressions_12m) || 0,
        });
      }

      // For GSC URLs without /articles/, check if /articles/ version exists
      if (row.has_articles_prefix === 'NO') {
        try {
          const p = new URL(url).pathname.replace(/^\/|\/$/g, '');
          if (p && !p.includes('/')) {
            const withPrefix = `${SITE}/articles/${p}/`;
            if (!urlsToTest.has(withPrefix)) {
              urlsToTest.set(withPrefix, { type: 'new_articles_variant', source: 'gsc_derived', wpId: '', gscClicks: 0, gscImps: 0 });
            }
          }
        } catch {}
      }
    }
  }

  // Limit crawl to manageable size — prioritize GSC URLs and their variants
  // Skip crawling every single WP article URL (we already verified those in the health audit)
  const priority = [...urlsToTest.entries()]
    .filter(([_, v]) => v.source !== 'wp' || v.type !== 'wp_current') // skip known-good WP URLs
    .concat([...urlsToTest.entries()].filter(([_, v]) => v.source === 'wp' && v.type === 'wp_current').slice(0, 50)); // sample 50 WP
  
  console.log(`\nTotal unique URLs to crawl: ${priority.length}`);
  console.log(`  (skipped ${urlsToTest.size - priority.length} known-good WP URLs)\n`);

  const results = await processBatch(priority, async ([url, meta]) => {
    const r = await followChain(url);
    const isHomepageFallback = r.status === 200 && new URL(url).pathname !== '/' && HP_SIGS.some(s => (r.title || '').includes(s));
    const is404 = r.status === 404;
    const isNoindex = (r.robots || '').includes('noindex');
    const isSoft404 = r.status === 200 && (r.title || '').includes('404');

    return {
      url, ...meta,
      statusCode: r.status,
      finalUrl: r.finalUrl || r.chain[r.chain.length - 1],
      redirectChain: r.chain.join(' → '),
      redirectCount: r.chain.length - 1,
      title: r.title, h1: r.h1, canonical: r.canonical,
      robots: r.robots, isNoindex, is404, isSoft404,
      isHomepageFallback,
      isArticlesPrefix: url.includes('/articles/') ? 'YES' : 'NO',
    };
  });

  // Save
  const esc = s => `"${String(s||'').replace(/"/g,'""').replace(/\n/g,' ')}"`;
  const header = 'url,variant_type,source,wp_post_id,gsc_clicks_12m,gsc_impressions_12m,status_code,final_url,redirect_count,title,h1,canonical,robots,is_noindex,is_404,is_soft_404,is_homepage_fallback,has_articles_prefix,redirect_chain';
  const rows = results.map(r => [
    esc(r.url), r.type, r.source, r.wpId, r.gscClicks, r.gscImps,
    r.statusCode, esc(r.finalUrl), r.redirectCount,
    esc(r.title), esc(r.h1), esc(r.canonical), esc(r.robots),
    r.isNoindex, r.is404, r.isSoft404, r.isHomepageFallback, r.isArticlesPrefix, esc(r.redirectChain),
  ].join(','));

  fs.writeFileSync(OUT, header + '\n' + rows.join('\n'), 'utf8');

  // Summary
  const s200 = results.filter(r => r.statusCode === 200).length;
  const s301 = results.filter(r => r.statusCode === 301 || r.statusCode === 302).length;
  const s404 = results.filter(r => r.is404).length;
  const hpFallback = results.filter(r => r.isHomepageFallback).length;
  const loops = results.filter(r => r.statusCode === 'LOOP' || r.statusCode === 'TOO_MANY_REDIRECTS').length;
  const oldRoot404 = results.filter(r => r.type === 'old_root_variant' && r.is404).length;
  const oldRootRedirect = results.filter(r => r.type === 'old_root_variant' && (r.statusCode === 301 || r.statusCode === 302)).length;
  const oldRootHP = results.filter(r => r.type === 'old_root_variant' && r.isHomepageFallback).length;
  const gscOld404 = results.filter(r => r.type === 'gsc_old_url' && r.is404).length;
  const gscOldHP = results.filter(r => r.type === 'gsc_old_url' && r.isHomepageFallback).length;
  const gscOldGood = results.filter(r => r.type === 'gsc_old_url' && r.statusCode === 200 && !r.isHomepageFallback).length;

  console.log(`\n=== CRAWL COMPLETE ===`);
  console.log(`Crawled: ${results.length}`);
  console.log(`  200 OK: ${s200}`);
  console.log(`  301/302: ${s301}`);
  console.log(`  404: ${s404}`);
  console.log(`  Homepage fallback: ${hpFallback}`);
  console.log(`  Loops: ${loops}`);
  console.log(`\n--- OLD ROOT-LEVEL VARIANTS (without /articles/) ---`);
  console.log(`  404: ${oldRoot404}`);
  console.log(`  Redirecting: ${oldRootRedirect}`);
  console.log(`  Homepage fallback: ${oldRootHP}`);
  console.log(`\n--- GSC OLD URLs (indexed without /articles/) ---`);
  console.log(`  404: ${gscOld404}`);
  console.log(`  Homepage fallback: ${gscOldHP}`);
  console.log(`  Still serving content: ${gscOldGood}`);
  console.log(`\nSaved: ${OUT}`);
}

main().catch(e => { console.error('FATAL:', e.message || e); process.exit(1); });
