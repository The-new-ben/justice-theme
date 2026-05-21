import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const REPORT_PATH = process.env.JUSTICE_FAMILY_DIVORCE_LIVE_PREUPLOAD_REPORT
  || 'reports/family-divorce-live-preupload-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const cleanTargets = [
  ['/divorce-lawyer/', 'Wave 1A pillar target'],
  ['/consensual-divorce/', 'Wave 1A support target'],
  ['/divorce-mediation/', 'Wave 1A support target'],
  ['/divorce-property-division/', 'Wave 1A support target'],
  ['/family-dispute-resolution/', 'Wave 1A support target'],
  ['/child-support/', 'Wave 1B support target'],
  ['/child-custody/', 'Wave 1B support target'],
];

const protectedSources = [
  ['/free-divorce-agreement-template/', 'P0 GSC source: divorce agreement template'],
  ['/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D', 'P0 GSC source: child support calculator'],
  ['/joint-custody-shared-parenting/', 'P0 GSC source: joint custody/shared parenting'],
  ['/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%A2%D7%93%D7%9B%D7%A0%D7%99-%D7%9C%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F', 'P0 GSC source: updated divorce guide'],
  ['/child-custody-modification/', 'P0 GSC source: custody modification'],
  ['/divorce-costs-2025/', 'P0 GSC source: divorce costs'],
  ['/%D7%A2%D7%95%D7%93-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%9B%D7%99%D7%A6%D7%93-%D7%9C%D7%9E%D7%A6%D7%95%D7%90-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%95%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%94%D7%AA%D7%92%D7%A8%D7%A9', 'P0 GSC source: recommended divorce lawyer query'],
  ['/living-apart-together-legal-rights/', 'P0 GSC source: common-law spouse rights'],
  ['/%D7%92%D7%99%D7%A9%D7%95%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A-%D7%A2%D7%95%D7%91%D7%93', 'P0 GSC source: divorce mediation explainer'],
  ['/request-for-family-dispute-settlements/', 'P0 GSC source: family dispute settlement request'],
  ['/divorce-mediation-basics/', 'P0 GSC source: divorce mediation basics'],
  ['/cohabitation-property-rights-for-unmarried-couples/', 'P0 GSC source: common-law property rights'],
  ['/how-much-does-a-divorce-agreement-cost/', 'P0 GSC source: divorce agreement cost'],
  ['/divorce-everything-you-need-to-know/', 'P0 GSC source: broad divorce guide'],
  ['/what-is-child-custody/', 'P0 GSC source: child custody explainer'],
  ['/trusted-divorce-attorney-guide/', 'P0 GSC source: trusted divorce attorney guide'],
  ['/strategic-divorce-cost-planning/', 'P0 GSC source: strategic divorce cost planning'],
];

const protectedAssets = [
  ['/wp-content/uploads/2021/03/%D7%A0%D7%95%D7%A1%D7%97-%D7%94%D7%A1%D7%9B%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%93%D7%95%D7%92%D7%9E%D7%90-2021.docx', 'P0 GSC asset: divorce agreement DOCX'],
];

const checks = [
  ...cleanTargets.map(([path, role]) => ({
    group: 'clean_target',
    path,
    role,
    expected: 'ready slot or reviewed live page before upload',
  })),
  ...protectedSources.map(([path, role]) => ({
    group: 'protected_source',
    path,
    role,
    expected: 'must remain reachable; no homepage redirect; no accidental 404',
  })),
  ...protectedAssets.map(([path, role]) => ({
    group: 'protected_asset',
    path,
    role,
    expected: 'must remain reachable; no homepage redirect; no accidental 404',
  })),
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizePathname(pathname) {
  const value = String(pathname || '/');
  if (value === '/') {
    return '/';
  }

  const trimmed = value.replace(/^\/+|\/+$/g, '');
  if (!trimmed) {
    return '/';
  }

  const lastSegment = trimmed.split('/').at(-1) || '';
  const suffix = lastSegment.includes('.') ? '' : '/';
  return `/${trimmed}${suffix}`;
}

function extractTag(body, tagName) {
  const match = body.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? normalizeWhitespace(match[1].replace(/<[^>]+>/g, ' ')) : '';
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

function isRedirectStatus(status) {
  return status >= 300 && status < 400;
}

function isHomePath(pathname) {
  return normalizePathname(pathname) === '/';
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function readBody(response, contentType) {
  if (!contentType.toLowerCase().includes('text/html')) {
    const buffer = await response.arrayBuffer();
    return {
      body: '',
      bytes: buffer.byteLength,
    };
  }

  const body = await response.text();
  return {
    body,
    bytes: Buffer.byteLength(body, 'utf8'),
  };
}

function classifyCleanTarget(result, issues) {
  if (result.http === 404 || result.http === 410) {
    return 'OPEN_SLOT';
  }

  if (result.http === 200 && result.finalPath === result.expectedFinalPath) {
    issues.push('target_already_live_review_before_overwrite');
    return 'LIVE_PRESENT_REVIEW';
  }

  if (isHomePath(result.finalPath)) {
    issues.push('clean_target_redirects_to_homepage');
    return 'CONFLICT';
  }

  issues.push(`clean_target_unexpected_final_path_${result.finalPath}`);
  return 'CONFLICT';
}

function classifyProtected(check, result, issues) {
  if (result.http !== 200) {
    issues.push(`protected_url_http_${result.http}`);
  }

  if (isHomePath(result.finalPath) && result.expectedFinalPath !== '/') {
    issues.push('protected_url_redirects_to_homepage');
  }

  if (result.contentType.toLowerCase().includes('text/html') && result.bytes < 1500) {
    issues.push(`thin_html_${result.bytes}_bytes`);
  }

  if (result.robots.includes('noindex')) {
    issues.push('noindex_present_review_before_relying_on_this_url');
  }

  if (issues.some((issue) => /http_|homepage|unexpected/.test(issue))) {
    return 'CONFLICT';
  }

  if (issues.length > 0) {
    return 'REVIEW';
  }

  return 'PASS';
}

async function runCheck(check) {
  const url = absoluteUrl(check.path);
  const expectedFinalPath = normalizePathname(new URL(url).pathname);
  const headers = {
    'User-Agent': 'Jus-Tice-Family-Divorce-Preupload-Guard/1.0',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Cache-Control': 'no-cache',
  };

  const initialResponse = await fetchWithTimeout(url, {
    redirect: 'manual',
    headers,
  });
  const initialHttp = initialResponse.status;
  const redirectLocation = initialResponse.headers.get('location') || '';
  const response = isRedirectStatus(initialHttp)
    ? await fetchWithTimeout(url, { redirect: 'follow', headers })
    : initialResponse;
  const contentType = response.headers.get('content-type') || '';
  const { body, bytes } = await readBody(response, contentType);
  const finalUrl = response.url;
  const finalPath = normalizePathname(new URL(finalUrl).pathname);
  const title = body ? extractTag(body, 'title') : '';
  const h1 = body ? extractTag(body, 'h1') : '';
  const canonical = body ? extractCanonical(body) : '';
  const robots = body ? robotsState(body) : '';
  const issues = [];

  if (isRedirectStatus(initialHttp)) {
    const redirectPath = redirectLocation
      ? normalizePathname(new URL(redirectLocation, BASE_URL).pathname)
      : 'missing_location';
    if (!(redirectPath === expectedFinalPath && check.group !== 'clean_target')) {
      issues.push(`initial_redirect_${initialHttp}_to_${redirectPath}`);
    }
  }

  const base = {
    group: check.group,
    path: check.path,
    role: check.role,
    expected: check.expected,
    expectedFinalPath,
    initialHttp,
    http: response.status,
    redirectLocation,
    finalPath,
    finalUrl,
    contentType,
    bytes,
    title,
    h1,
    canonical,
    robots,
  };

  const status = check.group === 'clean_target'
    ? classifyCleanTarget({ ...base, http: response.status }, issues)
    : classifyProtected(check, { ...base, http: response.status }, issues);

  return {
    ...base,
    status,
    issues: issues.join(';') || '-',
  };
}

const results = [];

for (const check of checks) {
  try {
    results.push(await runCheck(check));
  } catch (error) {
    results.push({
      group: check.group,
      path: check.path,
      role: check.role,
      expected: check.expected,
      expectedFinalPath: normalizePathname(new URL(absoluteUrl(check.path)).pathname),
      initialHttp: 0,
      http: 0,
      redirectLocation: '',
      finalPath: '',
      finalUrl: '',
      contentType: '',
      bytes: 0,
      title: '',
      h1: '',
      canonical: '',
      robots: '',
      status: 'CONFLICT',
      issues: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results.map((result) => ({
  group: result.group,
  status: result.status,
  path: result.path,
  initial: result.initialHttp,
  http: result.http,
  finalPath: result.finalPath,
  bytes: result.bytes,
  issues: result.issues,
})));

if (WRITE_REPORT) {
  const headers = [
    'group',
    'path',
    'role',
    'expected',
    'status',
    'initialHttp',
    'http',
    'redirectLocation',
    'expectedFinalPath',
    'finalPath',
    'finalUrl',
    'contentType',
    'bytes',
    'title',
    'h1',
    'canonical',
    'robots',
    'issues',
  ];
  const csv = [
    headers.join(','),
    ...results.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';

  const target = resolve(REPORT_PATH);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, csv, 'utf8');
  console.log(`Wrote ${target}`);
}

const conflicts = results.filter((result) => result.status === 'CONFLICT');
if (conflicts.length > 0) {
  process.exitCode = 1;
}
