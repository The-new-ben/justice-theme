import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const REPORT_PATH = process.env.JUSTICE_BREADCRUMB_REPORT || 'reports/breadcrumb-schema-audit-2026-05-18.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const LIMIT = Number.parseInt(process.env.JUSTICE_BREADCRUMB_LIMIT || '0', 10);

const seedPaths = [
  '/',
  '/site-map/',
  '/articles/',
  '/lawyers/',
  '/lawyer-registration/',
  '/family-law/',
  '/criminal-defense-attorney/',
  '/traffic-lawyer/',
  '/find-lawyer-how-to-find-good-attorney/',
];

function absoluteUrl(pathOrUrl) {
  return new URL(pathOrUrl, BASE_URL).toString();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      Accept: 'text/html,application/xml,*/*',
      ...headers,
    },
  });
  return {
    status: response.status,
    finalUrl: response.url,
    body: await response.text(),
  };
}

async function discoverSitemapUrls() {
  const discovered = [];
  const sitemapIndex = await fetchText(absoluteUrl('/sitemap_index.xml'));
  const childSitemaps = [...sitemapIndex.body.matchAll(/<loc>(.*?)<\/loc>/gi)]
    .map((match) => match[1].trim())
    .filter((url) => /sitemap/i.test(url));

  for (const sitemapUrl of childSitemaps) {
    try {
      const sitemap = await fetchText(sitemapUrl);
      for (const match of sitemap.body.matchAll(/<loc>(.*?)<\/loc>/gi)) {
        const loc = match[1].trim();
        if (!/sitemap/i.test(loc)) {
          discovered.push(loc);
        }
      }
    } catch (error) {
      discovered.push(`ERROR:${sitemapUrl}:${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return discovered;
}

function parseJsonLd(body) {
  return [...body.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .map((raw) => {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function typeIncludes(value, expectedType) {
  return asArray(value).some((type) => String(type).toLowerCase() === expectedType.toLowerCase());
}

function collectBreadcrumbLists(node, found = []) {
  if (!node || typeof node !== 'object') {
    return found;
  }

  if (typeIncludes(node['@type'], 'BreadcrumbList')) {
    found.push(node);
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      collectBreadcrumbLists(child, found);
    }
  } else {
    for (const child of Object.values(node)) {
      collectBreadcrumbLists(child, found);
    }
  }

  return found;
}

function validateBreadcrumbLists(lists) {
  const issues = [];

  lists.forEach((list, listIndex) => {
    const elements = asArray(list.itemListElement || []);
    if (elements.length === 0) {
      issues.push(`breadcrumb_${listIndex}_empty_itemListElement`);
      return;
    }

    elements.forEach((item, index) => {
      const name = typeof item?.name === 'string' ? item.name.trim() : '';
      const itemName = typeof item?.item?.name === 'string' ? item.item.name.trim() : '';
      if (!name && !itemName) {
        issues.push(`breadcrumb_${listIndex}_position_${item?.position || index + 1}_missing_name`);
      }
      if (typeof item?.item === 'string' && item.item.trim() === '') {
        issues.push(`breadcrumb_${listIndex}_position_${item?.position || index + 1}_empty_item`);
      }
    });
  });

  return issues;
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

const sitemapUrls = await discoverSitemapUrls();
let urls = unique([...seedPaths.map(absoluteUrl), ...sitemapUrls.filter((url) => !url.startsWith('ERROR:'))]);
if (LIMIT > 0) {
  urls = urls.slice(0, LIMIT);
}

const results = [];
for (const url of urls) {
  try {
    const response = await fetchText(url);
    const jsonLd = parseJsonLd(response.body);
    const breadcrumbLists = jsonLd.flatMap((node) => collectBreadcrumbLists(node));
    const issues = validateBreadcrumbLists(breadcrumbLists);
    results.push({
      status: issues.length ? 'REVIEW' : 'PASS',
      http: response.status,
      url,
      finalUrl: response.finalUrl,
      breadcrumbLists: breadcrumbLists.length,
      issues: issues.join(';'),
    });
  } catch (error) {
    results.push({
      status: 'REVIEW',
      http: 0,
      url,
      finalUrl: '',
      breadcrumbLists: 0,
      issues: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results.filter((row) => row.status !== 'PASS').slice(0, 30));
console.log(`Checked ${results.length} URLs; ${results.filter((row) => row.status !== 'PASS').length} need review.`);

if (WRITE_REPORT) {
  const headers = ['status', 'http', 'url', 'finalUrl', 'breadcrumbLists', 'issues'];
  const csv = [
    headers.join(','),
    ...results.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';
  const target = resolve(REPORT_PATH);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, csv, 'utf8');
  console.log(`Wrote ${target}`);
}

if (results.some((row) => row.status !== 'PASS')) {
  process.exitCode = 1;
}
