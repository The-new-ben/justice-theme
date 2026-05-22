#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const REPORT_PATH = process.env.JUSTICE_CONTROLLED_BREADCRUMB_REPORT || 'reports/controlled-route-live-breadcrumbs.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';

const routes = [
  {
    path: '/family-law/',
    expectedLastNameAny: ['משפחה', 'גירוש'],
  },
  {
    path: '/medical-malpractice-lawyer/',
    expectedLastNameAny: ['רשלנות רפואית', 'medical'],
  },
  {
    path: '/real-estate-lawyer-guide/',
    expectedLastNameAny: ['מקרקעין', 'נדל', 'real estate'],
  },
  {
    path: '/inheritance-lawyer/',
    expectedLastNameAny: ['ירושה', 'צווא'],
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalizePathname(pathname) {
  const normalized = `/${String(pathname || '').replace(/^\/+|\/+$/g, '')}/`;
  return normalized === '//' ? '/' : normalized;
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

function breadcrumbItems(list) {
  return asArray(list?.itemListElement || []);
}

function itemUrl(item) {
  if (typeof item?.item === 'string') {
    return item.item;
  }
  if (typeof item?.item?.['@id'] === 'string') {
    return item.item['@id'];
  }
  if (typeof item?.item?.url === 'string') {
    return item.item.url;
  }
  return '';
}

function itemName(item) {
  return String(item?.name || item?.item?.name || '').trim();
}

function htmlDecode(text) {
  return String(text || '')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function hasAnyToken(haystack, needles = []) {
  const lower = htmlDecode(haystack).toLowerCase();
  return needles.some((needle) => lower.includes(String(needle).toLowerCase()));
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function checkRoute(route) {
  const expectedUrl = absoluteUrl(route.path);
  const response = await fetch(expectedUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      Accept: 'text/html,*/*',
      'Cache-Control': 'no-cache',
    },
  });
  const body = await response.text();
  const finalPath = normalizePathname(new URL(response.url).pathname);
  const lists = parseJsonLd(body).flatMap((node) => collectBreadcrumbLists(node));
  const issues = [];

  if (response.status !== 200) {
    issues.push(`http_${response.status}`);
  }
  if (finalPath !== normalizePathname(route.path)) {
    issues.push(`final_path_${finalPath}`);
  }
  if (lists.length === 0) {
    issues.push('missing_breadcrumb_list');
  }

  const listSummaries = lists.map((list, listIndex) => {
    const items = breadcrumbItems(list);
    if (items.length < 2) {
      issues.push(`breadcrumb_${listIndex + 1}_items_${items.length}`);
    }

    items.forEach((item, itemIndex) => {
      if (!itemName(item)) {
        issues.push(`breadcrumb_${listIndex + 1}_item_${itemIndex + 1}_missing_name`);
      }
    });

    const lastItem = items[items.length - 1] || {};
    const lastName = itemName(lastItem);
    const lastUrl = itemUrl(lastItem);
    if (lastUrl) {
      const lastPath = normalizePathname(new URL(lastUrl, BASE_URL).pathname);
      if (lastPath !== normalizePathname(route.path)) {
        issues.push(`breadcrumb_${listIndex + 1}_last_item_path_${lastPath}`);
      }
    }
    if (!hasAnyToken(lastName, route.expectedLastNameAny)) {
      issues.push(`breadcrumb_${listIndex + 1}_wrong_last_name`);
    }

    return {
      itemCount: items.length,
      lastName,
      lastUrl,
    };
  });

  return {
    path: route.path,
    status: issues.length ? 'REVIEW' : 'PASS',
    http: response.status,
    finalUrl: response.url,
    breadcrumbLists: lists.length,
    breadcrumbItems: listSummaries.map((summary) => summary.itemCount).join('|'),
    lastName: listSummaries.map((summary) => htmlDecode(summary.lastName)).join(' | '),
    lastUrl: listSummaries.map((summary) => summary.lastUrl || '-').join(' | '),
    issues: issues.join(';') || '-',
  };
}

const results = [];
for (const route of routes) {
  try {
    results.push(await checkRoute(route));
  } catch (error) {
    results.push({
      path: route.path,
      status: 'REVIEW',
      http: 0,
      finalUrl: '',
      breadcrumbLists: 0,
      breadcrumbItems: 0,
      lastName: '',
      lastUrl: '',
      issues: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results);

if (WRITE_REPORT) {
  const headers = ['path', 'status', 'http', 'finalUrl', 'breadcrumbLists', 'breadcrumbItems', 'lastName', 'lastUrl', 'issues'];
  const csv = [
    headers.join(','),
    ...results.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';
  const target = resolve(REPORT_PATH);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, csv, 'utf8');
  console.log(`Wrote ${target}`);
}

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
