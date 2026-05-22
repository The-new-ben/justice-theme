#!/usr/bin/env node

import fs from 'node:fs/promises';

const REPORT_DATE = '2026-05-19';
const OUTPUT_CSV = `reports/money-query-preedit-snapshot-${REPORT_DATE}.csv`;
const OUTPUT_JSON = `reports/money-query-preedit-snapshot-${REPORT_DATE}.json`;

const TARGETS = [
  {
    priority: 'P0',
    url: 'https://jus-tice.co.il/real-estate-attorney/',
    lane: 'real-estate',
    impressions: 88601,
    ctr: '0.02%',
  },
  {
    priority: 'P0',
    url: 'https://jus-tice.co.il/criminal-defense-attorney/',
    lane: 'criminal-law',
    impressions: 62561,
    ctr: '0.02%',
  },
  {
    priority: 'P0',
    url: 'https://jus-tice.co.il/sex-crime-lawyer/',
    lane: 'criminal-law',
    impressions: 27904,
    ctr: '0.12%',
  },
  {
    priority: 'P0',
    url: 'https://jus-tice.co.il/prenup-attorney/',
    lane: 'family-law',
    impressions: 20894,
    ctr: '0.00%',
  },
  {
    priority: 'P1',
    url: 'https://jus-tice.co.il/traffic-lawyer/',
    lane: 'traffic-law',
    impressions: 20330,
    ctr: '0.00%',
  },
];

const USER_AGENT = 'Mozilla/5.0 (compatible; JusTiceMoneyQuerySnapshot/1.0; +https://jus-tice.co.il/)';

function clean(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFirst(html, regex) {
  return clean((html.match(regex) || [])[1] || '');
}

function getAll(html, regex) {
  return [...html.matchAll(regex)].map((match) => clean(match[1])).filter(Boolean);
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  const body = await response.text();
  return {
    status: response.status,
    finalUrl: response.url,
    body,
  };
}

async function loadSitemapUrls() {
  const seen = new Set();
  const urls = new Set();

  async function load(url, depth = 0) {
    if (seen.has(url) || depth > 2) {
      return;
    }
    seen.add(url);

    try {
      const { body } = await fetchText(url);
      const locs = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim());
      for (const loc of locs) {
        if (/\.xml(\?|$)/i.test(loc)) {
          await load(loc, depth + 1);
        } else {
          urls.add(normalizeUrl(loc));
        }
      }
    } catch (error) {
      // Sitemap availability is a useful signal, but page snapshots should still run.
    }
  }

  await load('https://jus-tice.co.il/sitemap_index.xml');
  return urls;
}

function normalizeUrl(url) {
  return String(url || '').replace(/[?#].*$/, '').replace(/\/$/, '');
}

function hasLeadIntent(html) {
  const haystack = html.toLowerCase();
  return [
    'ask-lawyer',
    'lawyer-registration',
    'justice_lead',
    'lead-form',
    'wpforms',
    'elementor-field',
    'tel:',
    'wa.me',
  ].some((needle) => haystack.includes(needle));
}

async function snapshot(target, sitemapUrls) {
  const { status, finalUrl, body } = await fetchText(target.url);
  const title = getFirst(body, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1s = getAll(body, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const description = getFirst(body, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const canonical = getFirst(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i);
  const robots = getFirst(body, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const ogTitle = getFirst(body, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const wordCount = clean(body).split(/\s+/).filter(Boolean).length;
  const normalizedTarget = normalizeUrl(target.url);
  const normalizedCanonical = normalizeUrl(canonical);

  return {
    snapshotDate: REPORT_DATE,
    priority: target.priority,
    lane: target.lane,
    url: target.url,
    status,
    finalUrl,
    inSitemap: sitemapUrls.has(normalizedTarget) ? 'YES' : 'NO',
    canonical,
    canonicalMatchesTarget: normalizedCanonical === normalizedTarget ? 'YES' : 'NO',
    robots,
    noindex: /noindex/i.test(robots) ? 'YES' : 'NO',
    title,
    titleLength: [...title].length,
    h1: h1s[0] || '',
    h1Count: h1s.length,
    metaDescription: description,
    metaDescriptionLength: [...description].length,
    ogTitle,
    hasLeadIntent: hasLeadIntent(body) ? 'YES' : 'NO',
    bytes: body.length,
    wordCount,
    impressions: target.impressions,
    ctr: target.ctr,
  };
}

async function main() {
  await fs.mkdir('reports', { recursive: true });
  const sitemapUrls = await loadSitemapUrls();
  const rows = [];

  for (const target of TARGETS) {
    rows.push(await snapshot(target, sitemapUrls));
  }

  const headers = [
    'snapshotDate',
    'priority',
    'lane',
    'url',
    'status',
    'finalUrl',
    'inSitemap',
    'canonical',
    'canonicalMatchesTarget',
    'robots',
    'noindex',
    'title',
    'titleLength',
    'h1',
    'h1Count',
    'metaDescription',
    'metaDescriptionLength',
    'ogTitle',
    'hasLeadIntent',
    'bytes',
    'wordCount',
    'impressions',
    'ctr',
  ];

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');

  await fs.writeFile(OUTPUT_CSV, `${csv}\n`, 'utf8');
  await fs.writeFile(OUTPUT_JSON, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');

  console.table(rows.map((row) => ({
    url: new URL(row.url).pathname,
    status: row.status,
    inSitemap: row.inSitemap,
    canonical: row.canonicalMatchesTarget,
    noindex: row.noindex,
    h1Count: row.h1Count,
    titleLength: row.titleLength,
    hasLeadIntent: row.hasLeadIntent,
  })));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
