import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const REPORT_PATH = process.env.JUSTICE_TRAFFIC_REPORT || 'reports/traffic-priority-audit-2026-05-18.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';

const checks = [
  {
    journey: 'user',
    priority: 'critical',
    path: '/',
    role: 'homepage lead entry',
    mustInclude: ['#ask-lawyer', '/lawyers/', '/site-map/', '0525101555'],
    maxBytes: 350000,
  },
  {
    journey: 'googlebot',
    priority: 'critical',
    path: '/site-map/',
    role: 'dynamic crawl hub',
    mustInclude: ['/articles/', '/lawyers/', 'BreadcrumbList'],
    maxBytes: 1600000,
  },
  {
    journey: 'googlebot',
    priority: 'critical',
    path: '/articles/',
    role: 'article discovery hub',
    mustInclude: ['canonical'],
    maxBytes: 1600000,
    maxLinks: 2200,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/family-law/',
    role: 'family law practice page',
    titleMustIncludeAny: ['דיני משפחה', 'משפחה', 'גירוש', 'מזונות', 'משמורת'],
    titleMustNotIncludeAny: ['פסק דין', 'השופט', 'השופטת', 'תביעה רכושית'],
    bodyMustIncludeAny: ['דיני משפחה', 'עורך דין', 'גירוש', 'מזונות', 'משמורת'],
    maxBytes: 500000,
  },
  {
    journey: 'lawyer',
    priority: 'high',
    path: '/lawyers/?area=family-law',
    role: 'family lawyer directory filter',
    mustIncludeAny: ['lawyer', 'עורך דין', 'משפחה'],
    allowNoindex: true,
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/medical-malpractice-lawyer/',
    role: 'medical malpractice commercial path',
    mustStatus: 200,
    mustIncludeAny: ['רשלנות רפואית', 'עורך דין', 'medical'],
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/real-estate-lawyer-guide/',
    role: 'real estate lawyer guide recovery path',
    mustStatus: 200,
    mustIncludeAny: ['מקרקעין', 'נדל', 'עורך דין', 'real estate'],
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/criminal-defense-attorney/',
    role: 'criminal lawyer commercial path',
    mustStatus: 200,
    mustIncludeAny: ['פלילי', 'עורך דין', 'criminal'],
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/traffic-lawyer/',
    role: 'traffic lawyer commercial path',
    mustStatus: 200,
    mustIncludeAny: ['תעבורה', 'עורך דין', 'traffic'],
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'critical',
    path: '/inheritance-lawyer/',
    role: 'inheritance and wills lawyer commercial path',
    mustStatus: 200,
    mustIncludeAny: ['ירושה', 'צווא', 'עורך דין', 'inheritance'],
    h1MustIncludeAny: ['\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d9\u05e8\u05d5\u05e9\u05d4'],
    maxBytes: 500000,
  },
  {
    journey: 'user',
    priority: 'high',
    path: '/contact/',
    role: 'legacy contact path',
    mustStatus: 200,
    mustIncludeAny: ['0525101555', 'contact', 'צור קשר', 'פנייה'],
    maxBytes: 300000,
  },
  {
    journey: 'user',
    priority: 'medium',
    path: '/about/',
    role: 'trust/about path',
    mustStatus: 200,
    mustIncludeAny: ['Jus-Tice', 'אודות', 'משפטי'],
    maxBytes: 300000,
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractTag(body, tagName) {
  const match = body.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? normalize(match[1].replace(/<[^>]+>/g, ' ')) : '';
}

function extractCanonical(body) {
  const match = body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? match[1] : '';
}

function robotsState(body) {
  const robots = [...body.matchAll(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/gi)]
    .map((match) => match[1].toLowerCase());
  return robots.join('|');
}

function countLinks(body) {
  return (body.match(/<a\s+[^>]*href=["'][^"']+["']/gi) || []).length;
}

function hasAny(haystack, needles = []) {
  const lowerHaystack = haystack.toLowerCase();
  return needles.some((needle) => lowerHaystack.includes(String(needle).toLowerCase()));
}

function missingAnyGroup(haystack, needles = []) {
  return needles.length > 0 && !hasAny(haystack, needles);
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function runCheck(check) {
  const url = absoluteUrl(check.path);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': check.journey === 'googlebot'
        ? 'Googlebot/2.1 (+http://www.google.com/bot.html)'
        : 'Jus-Tice-Traffic-Priority-Checker/1.0',
      Accept: 'text/html,*/*',
    },
  });
  const body = await response.text();
  const title = extractTag(body, 'title');
  const h1 = extractTag(body, 'h1');
  const canonical = extractCanonical(body);
  const robots = robotsState(body);
  const links = countLinks(body);
  const issues = [];
  const titleAndH1 = `${title} ${h1}`;
  const expectedStatus = check.mustStatus || 200;

  if (response.status !== expectedStatus) {
    issues.push(`http_${response.status}_expected_${expectedStatus}`);
  }
  if (robots.includes('noindex') && check.allowNoindex !== true) {
    issues.push('noindex_present');
  }
  for (const token of check.mustInclude || []) {
    if (!body.toLowerCase().includes(String(token).toLowerCase())) {
      issues.push(`missing_${token}`);
    }
  }
  if (missingAnyGroup(body, check.mustIncludeAny)) {
    issues.push(`missing_any:${check.mustIncludeAny.join('|')}`);
  }
  if (missingAnyGroup(titleAndH1, check.titleMustIncludeAny)) {
    issues.push(`title_h1_missing_any:${check.titleMustIncludeAny.join('|')}`);
  }
  if (missingAnyGroup(h1, check.h1MustIncludeAny)) {
    issues.push(`h1_missing_any:${check.h1MustIncludeAny.join('|')}`);
  }
  if (hasAny(titleAndH1, check.titleMustNotIncludeAny || [])) {
    issues.push(`title_h1_wrong_intent:${check.titleMustNotIncludeAny.join('|')}`);
  }
  if (missingAnyGroup(body, check.bodyMustIncludeAny)) {
    issues.push(`body_missing_any:${check.bodyMustIncludeAny.join('|')}`);
  }
  if (check.maxBytes && body.length > check.maxBytes) {
    issues.push(`oversized_html_${body.length}_gt_${check.maxBytes}`);
  }
  if (check.maxLinks && links > check.maxLinks) {
    issues.push(`too_many_links_${links}_gt_${check.maxLinks}`);
  }

  return {
    journey: check.journey,
    priority: check.priority,
    path: check.path,
    role: check.role,
    status: issues.length ? 'REVIEW' : 'PASS',
    http: response.status,
    bytes: body.length,
    links,
    title,
    h1,
    canonical,
    robots,
    finalUrl: response.url,
    issues: issues.join(';'),
  };
}

const results = [];
for (const check of checks) {
  try {
    results.push(await runCheck(check));
  } catch (error) {
    results.push({
      journey: check.journey,
      priority: check.priority,
      path: check.path,
      role: check.role,
      status: 'REVIEW',
      http: 0,
      bytes: 0,
      links: 0,
      title: '',
      h1: '',
      canonical: '',
      robots: '',
      finalUrl: absoluteUrl(check.path),
      issues: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results.map((result) => ({
  status: result.status,
  priority: result.priority,
  path: result.path,
  http: result.http,
  bytes: result.bytes,
  links: result.links,
  issues: result.issues || '-',
})));

if (WRITE_REPORT) {
  const headers = ['journey', 'priority', 'path', 'role', 'status', 'http', 'bytes', 'links', 'title', 'h1', 'canonical', 'robots', 'finalUrl', 'issues'];
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
