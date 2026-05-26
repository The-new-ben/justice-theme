/**
 * Competitor SERP Scraper — jus-tice.co.il SEO Research
 * Fills all [NEEDS CONNECTOR] gaps from SEMrush report:
 * - Title tags, H1, H2 structure
 * - Word count
 * - Schema types present
 * - Internal link count
 * - FAQ presence
 * - Last modified / year signals
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

// Top competitors per keyword — from SEMrush report
const TARGETS = [
  // === עורך דין פלילי ===
  { kw: 'עורך דין פלילי', url: 'https://flanter-law.co.il/', label: 'flanter-criminal-home' },
  { kw: 'עורך דין פלילי', url: 'https://alonerez.co.il/', label: 'alonerez-criminal-home' },
  { kw: 'עורך דין פלילי', url: 'https://dok.co.il/', label: 'dok-home' },
  { kw: 'עורך דין פלילי מומלץ', url: 'https://lawreviews.co.il/search/criminal-law', label: 'lawreviews-criminal' },
  { kw: 'עורך דין פלילי מומלץ', url: 'https://lawyersnet.org.il/', label: 'lawyersnet-home' },

  // === עורך דין גירושין ===
  { kw: 'עורך דין גירושין', url: 'https://divorce1.co.il/', label: 'divorce1-home' },
  { kw: 'עורך דין גירושין', url: 'https://azr.co.il/', label: 'azr-home' },
  { kw: 'עורך דין גירושין', url: 'https://lucymeir.co.il/', label: 'lucymeir-home' },
  { kw: 'עורך דין גירושין מומלץ', url: 'https://gerushin.co.il/', label: 'gerushin-home' },
  { kw: 'עורך דין גירושין מומלץ', url: 'https://rotenberglaw.co.il/', label: 'rotenberglaw-home' },

  // === הסכם גירושין ===
  { kw: 'הסכם גירושין', url: 'https://shared-parenting.co.il/', label: 'shared-parenting-home' },
  { kw: 'הסכם גירושין', url: 'https://kolzchut.org.il/', label: 'kolzchut-home' },
  { kw: 'הסכם גירושין', url: 'https://todivorce.co.il/', label: 'todivorce-home' },

  // === מחיקת רישום פלילי ===
  { kw: 'מחיקת רישום פלילי', url: 'https://flanter-law.co.il/מחיקת-רישום-פלילי/', label: 'flanter-criminal-record' },
  { kw: 'מחיקת רישום פלילי', url: 'https://rishump.co.il/', label: 'rishump-home' },
  { kw: 'מחיקת רישום פלילי', url: 'https://ese.co.il/', label: 'ese-home' },

  // === מזונות ילדים ===
  { kw: 'מזונות ילדים', url: 'https://divorce1.co.il/', label: 'divorce1-mezonot' },
  { kw: 'מזונות ילדים', url: 'https://gerushin.co.il/', label: 'gerushin-mezonot' },

  // === עורך דין מקרקעין ===
  { kw: 'עורך דין מקרקעין', url: 'https://midrag.co.il/', label: 'midrag-real-estate' },
  { kw: 'עורך דין מקרקעין', url: 'https://lawreviews.co.il/', label: 'lawreviews-home' },

  // === עורך דין רשלנות רפואית ===
  { kw: 'עורך דין רשלנות רפואית', url: 'https://m-adv.co.il/', label: 'm-adv-malpractice' },
  { kw: 'עורך דין רשלנות רפואית', url: 'https://lawreviews.co.il/', label: 'lawreviews-malpractice' },

  // === עורך דין ירושה ===
  { kw: 'עורך דין ירושה', url: 'https://yerusha.org.il/', label: 'yerusha-home' },
  { kw: 'עורך דין ירושה', url: 'https://yanivor.com/', label: 'yanivor-home' },
];

function fetchPage(urlStr, timeout = 12000) {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr);
      const mod = u.protocol === 'https:' ? https : http;
      const options = {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOResearch/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'he-IL,he;q=0.9',
        },
        timeout,
      };
      const req = mod.request(options, (res) => {
        // Follow one redirect
        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          return fetchPage(res.headers.location, timeout).then(resolve);
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (c) => { data += c; });
        res.on('end', () => resolve({ ok: true, status: res.statusCode, html: data }));
      });
      req.on('error', (e) => resolve({ ok: false, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

function extractData(html, urlStr) {
  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]{1,200})<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,400})["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']{1,400})["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]{1,200}?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // H2s
  const h2Pattern = /<h2[^>]*>([\s\S]{1,200}?)<\/h2>/gi;
  const h2s = [];
  let h2m;
  while ((h2m = h2Pattern.exec(html)) !== null && h2s.length < 20) {
    const text = h2m[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 2) h2s.push(text);
  }

  // H3s (first 10)
  const h3Pattern = /<h3[^>]*>([\s\S]{1,150}?)<\/h3>/gi;
  const h3s = [];
  let h3m;
  while ((h3m = h3Pattern.exec(html)) !== null && h3s.length < 10) {
    const text = h3m[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 2) h3s.push(text);
  }

  // Word count (rough — strip tags, count words)
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textOnly.split(/\s+/).filter(w => w.length > 1).length;

  // Schema types
  const schemaTypes = [];
  const schemaMatches = html.matchAll(/"@type"\s*:\s*"([^"]+)"/g);
  for (const m of schemaMatches) {
    if (!schemaTypes.includes(m[1])) schemaTypes.push(m[1]);
  }

  // Has FAQ
  const hasFaq = /FAQPage|accordion|faq|שאלות.{0,20}תשובות|שאלות.{0,20}נפוצות/i.test(html);

  // Has calculator / tool
  const hasCalc = /מחשבון|calculator|חשב/i.test(html);

  // Has downloadable PDF / template
  const hasPdf = /\.pdf|להורדה|הורד/i.test(html);

  // Year signals in title/H1/content
  const yearMatch = html.match(/202[3-9]/);
  const yearSignal = yearMatch ? yearMatch[0] : '';

  // Internal links count (rough)
  const domain = new URL(urlStr).hostname;
  const internalLinks = (html.match(new RegExp(`href=["'][^"']*${domain.replace('.', '\\.')}[^"']*["']`, 'g')) || []).length;

  // Canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                          html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';

  return { title, description, h1, h2s, h3s, wordCount, schemaTypes, hasFaq, hasCalc, hasPdf, yearSignal, internalLinks, canonical };
}

async function main() {
  const results = [];
  const seen = new Set();

  for (const t of TARGETS) {
    const key = t.url;
    if (seen.has(key)) {
      console.log(`  [skip duplicate] ${t.label}`);
      continue;
    }
    seen.add(key);
    console.log(`\nFetching [${t.kw}] ${t.label}: ${t.url}`);
    const res = await fetchPage(t.url);
    if (!res.ok) {
      console.log(`  ❌ Error: ${res.error}`);
      results.push({ ...t, error: res.error });
      continue;
    }
    const data = extractData(res.html, t.url);
    console.log(`  ✅ Title: ${data.title.substring(0, 70)}`);
    console.log(`  H1: ${data.h1.substring(0, 60)}`);
    console.log(`  H2s: ${data.h2s.length} | Words: ${data.wordCount} | Schema: ${data.schemaTypes.join(', ')}`);
    results.push({ ...t, ...data });
    // Polite delay
    await new Promise(r => setTimeout(r, 800));
  }

  // Save raw JSON
  fs.writeFileSync(
    'c:/Users/pro/justice/justice-theme/reports/semrush/competitor-scrape-raw.json',
    JSON.stringify(results, null, 2),
    'utf8'
  );

  // Build markdown report
  let md = `# Competitor Page Analysis — jus-tice.co.il\n`;
  md += `**Scraped:** ${new Date().toISOString().slice(0, 10)} | **Pages:** ${results.length}\n`;
  md += `Fills all [NEEDS CONNECTOR] items from SEMrush report.\n\n---\n\n`;

  // Group by keyword
  const byKw = {};
  for (const r of results) {
    if (!byKw[r.kw]) byKw[r.kw] = [];
    byKw[r.kw].push(r);
  }

  for (const [kw, pages] of Object.entries(byKw)) {
    md += `## ${kw}\n\n`;
    for (const p of pages) {
      if (p.error) {
        md += `### ❌ ${p.label} — ${p.url}\nError: ${p.error}\n\n`;
        continue;
      }
      md += `### ${p.label}\n`;
      md += `**URL:** ${p.url}\n\n`;
      md += `| Field | Value |\n|-------|-------|\n`;
      md += `| Title | ${p.title.replace(/\|/g, '\\|')} |\n`;
      md += `| Title length | ${p.title.length} chars |\n`;
      md += `| H1 | ${p.h1.replace(/\|/g, '\\|')} |\n`;
      md += `| Word count | ~${p.wordCount} words |\n`;
      md += `| Schema types | ${p.schemaTypes.join(', ') || 'none detected'} |\n`;
      md += `| Has FAQ | ${p.hasFaq ? '✅ Yes' : '❌ No'} |\n`;
      md += `| Has Calculator | ${p.hasCalc ? '✅ Yes' : '❌ No'} |\n`;
      md += `| Has PDF/Download | ${p.hasPdf ? '✅ Yes' : '❌ No'} |\n`;
      md += `| Year signal | ${p.yearSignal || 'none'} |\n`;
      md += `| Canonical | ${p.canonical} |\n\n`;
      if (p.h2s.length > 0) {
        md += `**H2 Structure:**\n`;
        p.h2s.forEach((h, i) => { md += `${i + 1}. ${h}\n`; });
        md += '\n';
      }
      if (p.h3s.length > 0) {
        md += `**H3 (first 10):**\n`;
        p.h3s.forEach((h, i) => { md += `${i + 1}. ${h}\n`; });
        md += '\n';
      }
      if (p.description) {
        md += `**Meta Description:** ${p.description}\n\n`;
      }
      md += '---\n\n';
    }
  }

  // Title pattern analysis
  md += `## Title Pattern Analysis — Across All Keywords\n\n`;
  const allTitles = results.filter(r => r.title).map(r => ({ kw: r.kw, title: r.title, len: r.title.length }));
  md += `| Keyword | Competitor | Title | Length |\n|---------|-----------|-------|--------|\n`;
  for (const t of allTitles) {
    md += `| ${t.kw} | — | ${t.title.replace(/\|/g, '\\|')} | ${t.len} |\n`;
  }
  md += '\n';

  // Schema summary
  md += `## Schema Types — Competitive Landscape\n\n`;
  const schemaCount = {};
  for (const r of results) {
    (r.schemaTypes || []).forEach(s => { schemaCount[s] = (schemaCount[s] || 0) + 1; });
  }
  md += `| Schema Type | Used by # competitors |\n|------------|----------------------|\n`;
  Object.entries(schemaCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    md += `| ${k} | ${v} |\n`;
  });
  md += '\n';

  // Feature summary
  md += `## Feature Summary\n\n`;
  md += `| Competitor | FAQ | Calculator | PDF/Download | Year Signal | Est. Words |\n`;
  md += `|-----------|-----|-----------|-------------|------------|------------|\n`;
  for (const r of results) {
    if (r.error) continue;
    md += `| ${r.label} | ${r.hasFaq ? '✅' : '❌'} | ${r.hasCalc ? '✅' : '❌'} | ${r.hasPdf ? '✅' : '❌'} | ${r.yearSignal || '—'} | ~${r.wordCount} |\n`;
  }

  fs.writeFileSync(
    'c:/Users/pro/justice/justice-theme/reports/semrush/competitor-scrape-report.md',
    md,
    'utf8'
  );

  console.log(`\n\n✅ Done. Scraped ${results.length} pages.`);
  console.log(`  Raw JSON: reports/semrush/competitor-scrape-raw.json`);
  console.log(`  Markdown: reports/semrush/competitor-scrape-report.md`);
}

main().catch(console.error);
