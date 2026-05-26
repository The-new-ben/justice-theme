import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 10000);
const DEFAULT_CONCURRENCY = Number(process.env.JUSTICE_FETCH_CONCURRENCY || 6);

const packages = [
  {
    key: 'rental_agreement',
    label: 'Rental agreement review / draft',
    pilotRank: 1,
    proposedPublicIntent: 'paid lawyer-supervised rental agreement review or draft',
    searchTerms: [
      'rental agreement',
      'lease agreement',
      'rental contract',
      'tenant',
      'landlord',
      '\u05d4\u05e1\u05db\u05dd \u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
      '\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
      '\u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
      '\u05e9\u05d5\u05db\u05e8',
      '\u05de\u05e9\u05db\u05d9\u05e8',
    ],
    signalTerms: [
      'rental',
      'lease',
      'tenant',
      'landlord',
      'real-estate',
      '\u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
      '\u05e9\u05d5\u05db\u05e8',
      '\u05de\u05e9\u05db\u05d9\u05e8',
      '\u05de\u05e7\u05e8\u05e7\u05e2\u05d9\u05df',
      '\u05d3\u05d9\u05e8\u05d4',
    ],
    exactPaths: [
      '/rental-agreement/',
      '/lease-agreement/',
      '/rental-contract/',
      '/apartment-rental-agreement/',
      '/tenant-rights/',
      '/landlord-tenant-dispute/',
      '/real-estate-lawyer-guide/',
      '/lawyer-for-buying-or-selling-a-house/',
    ],
    decisionRule:
      'Prefer upgrading an existing rental/real-estate legal-help page or adding a narrow CTA after owner/SEO review. Do not create a public package page until exact title/H1/meta and internal links are approved.',
  },
  {
    key: 'demand_letter_review',
    label: 'Demand letter with lawyer review',
    pilotRank: 2,
    proposedPublicIntent: 'paid lawyer-reviewed warning/demand letter for a narrow dispute',
    searchTerms: [
      'demand letter',
      'warning letter',
      'consumer refund',
      'wrongful termination',
      'rent dispute',
      '\u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4',
      '\u05de\u05db\u05ea\u05d1 \u05d3\u05e8\u05d9\u05e9\u05d4',
      '\u05ea\u05d1\u05d9\u05e2\u05d4 \u05e6\u05e8\u05db\u05e0\u05d9\u05ea',
      '\u05e4\u05d9\u05d8\u05d5\u05e8\u05d9\u05dd \u05e9\u05dc\u05d0 \u05db\u05d3\u05d9\u05df',
      '\u05e1\u05db\u05e1\u05d5\u05da \u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
    ],
    signalTerms: [
      'demand',
      'warning',
      'termination',
      'employment',
      'consumer',
      'small-claims',
      'eviction',
      'rent',
      '\u05de\u05db\u05ea\u05d1',
      '\u05d4\u05ea\u05e8\u05d0\u05d4',
      '\u05d3\u05e8\u05d9\u05e9\u05d4',
      '\u05e6\u05e8\u05db\u05df',
      '\u05e4\u05d9\u05d8\u05d5\u05e8',
      '\u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
    ],
    exactPaths: [
      '/demand-letter/',
      '/warning-letter/',
      '/consumer-refund-letter/',
      '/wrongful-termination-letter/',
      '/rent-dispute-letter/',
      '/severance-pay-calculator/',
      '/employment-lawyer/',
      '/labor-lawyer/',
      '/consumer-lawyer/',
    ],
    decisionRule:
      'Do not launch a generic demand-letter page. Split by dispute type only after employment, consumer and rental pages are inventoried and the lawyer-review scope is explicit.',
  },
];

const postTypes = ['articles', 'pages', 'posts'];

function parseArgs() {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    perPage: Number(process.env.JUSTICE_REST_SEARCH_PER_PAGE || 10),
    concurrency: DEFAULT_CONCURRENCY,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length);
    } else if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--perPage=')) {
      args.perPage = Number(arg.slice('--perPage='.length));
    } else if (arg.startsWith('--concurrency=')) {
      args.concurrency = Number(arg.slice('--concurrency='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

async function runLimited(tasks, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const taskIndex = index;
      index += 1;
      results[taskIndex] = await tasks[taskIndex]();
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(concurrency, tasks.length)) }, () => worker())
  );

  return results;
}

function outputFiles(reportDate) {
  const base = `managed-service-public-cannibalization-inventory-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function absoluteUrl(baseUrl, pathOrUrl) {
  return new URL(pathOrUrl, baseUrl).toString();
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
  return normalizeWhitespace(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
  );
}

function extractTag(html, tagName) {
  const match = String(html || '').match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? stripTags(match[1]) : '';
}

function extractCanonical(html) {
  const match = String(html || '').match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i);
  return match ? match[1] : '';
}

function isHighSignalSearchHit(packageInfo, query, title, pathname) {
  const haystack = `${title} ${pathname}`.toLocaleLowerCase('he-IL');
  return packageInfo.signalTerms.some((term) => haystack.includes(term.toLocaleLowerCase('he-IL')));
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

async function fetchWithTimeout(url, accept = 'text/html,application/xhtml+xml,application/json,*/*;q=0.8') {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: accept,
        'Cache-Control': 'no-cache',
        'User-Agent': 'Jus-Tice managed-service anti-cannibalization inventory',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function inspectPath(baseUrl, packageInfo, candidatePath) {
  const url = absoluteUrl(baseUrl, candidatePath);
  try {
    const response = await fetchWithTimeout(url);
    const html = await response.text();
    const title = extractTag(html, 'title');
    const h1 = extractTag(html, 'h1');
    const canonical = extractCanonical(html);
    const isLive = response.status >= 200 && response.status < 400 && Boolean(title || h1);
    return {
      package_key: packageInfo.key,
      package_label: packageInfo.label,
      source: 'exact_path_probe',
      query: '',
      post_type: 'route',
      url,
      path: new URL(response.url || url).pathname,
      status_code: response.status,
      title,
      h1,
      canonical,
      match_reason: isLive ? 'Exact route exists or resolves live.' : 'Exact route not found or no readable title/H1.',
      cannibalization_risk: isLive ? 'HIGH_REVIEW_EXISTING_ROUTE' : 'LOW_ABSENT_ROUTE',
      recommendation: isLive
        ? 'Review this existing route before creating or linking a public package page.'
        : 'Do not treat absence as approval; keep public launch blocked until owner/SEO review.',
    };
  } catch (error) {
    return {
      package_key: packageInfo.key,
      package_label: packageInfo.label,
      source: 'exact_path_probe',
      query: '',
      post_type: 'route',
      url,
      path: candidatePath,
      status_code: 'ERROR',
      title: '',
      h1: '',
      canonical: '',
      match_reason: error.message,
      cannibalization_risk: 'REVIEW_FETCH_ERROR',
      recommendation: 'Fetch failed; manually review before any public route decision.',
    };
  }
}

async function searchRest(baseUrl, packageInfo, query, postType, perPage) {
  const endpoint = absoluteUrl(
    baseUrl,
    `/wp-json/wp/v2/${postType}?search=${encodeURIComponent(query)}&per_page=${perPage}&_fields=id,slug,link,title,excerpt,status,type`
  );

  try {
    const response = await fetchWithTimeout(endpoint, 'application/json,*/*;q=0.8');
    if (!response.ok) {
      return [{
        package_key: packageInfo.key,
        package_label: packageInfo.label,
        source: 'wp_rest_search',
        query,
        post_type: postType,
        url: endpoint,
        path: '',
        status_code: response.status,
        title: '',
        h1: '',
        canonical: '',
        match_reason: `REST search endpoint returned ${response.status}.`,
        cannibalization_risk: 'REVIEW_FETCH_ERROR',
        recommendation: 'REST search unavailable; manually search before public package launch.',
      }];
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => {
      const url = item.link || '';
      const pathname = url ? new URL(url).pathname : '';
      const title = stripTags(item.title?.rendered || '');
      const excerpt = stripTags(item.excerpt?.rendered || '');
      const highSignal = isHighSignalSearchHit(packageInfo, query, title, pathname);
      return {
        package_key: packageInfo.key,
        package_label: packageInfo.label,
        source: 'wp_rest_search',
        query,
        post_type: item.type || postType,
        url,
        path: pathname,
        status_code: response.status,
        title,
        h1: '',
        canonical: '',
        match_reason: `REST search hit for "${query}". Excerpt: ${excerpt.slice(0, 160)}`,
        cannibalization_risk: highSignal ? 'MEDIUM_REVIEW_TITLE_OR_PATH_MATCH' : 'LOW_SEARCH_CONTEXT_ONLY',
        recommendation: highSignal
          ? 'Review as associated/synonymous content before any public package page or CTA.'
          : 'Keep in CSV evidence, but prioritize exact and title/path matches first.',
      };
    });
  } catch (error) {
    return [{
      package_key: packageInfo.key,
      package_label: packageInfo.label,
      source: 'wp_rest_search',
      query,
      post_type: postType,
      url: endpoint,
      path: '',
      status_code: 'ERROR',
      title: '',
      h1: '',
      canonical: '',
      match_reason: error.message,
      cannibalization_risk: 'REVIEW_FETCH_ERROR',
      recommendation: 'REST search failed; manually search before public package launch.',
    }];
  }
}

function dedupeRows(rows) {
  const seen = new Map();
  for (const row of rows) {
    const key = `${row.package_key}|${row.url || row.path}|${row.query}|${row.source}`;
    if (!seen.has(key)) {
      seen.set(key, row);
    }
  }
  return [...seen.values()];
}

function summarize(rows) {
  const exactLive = rows.filter((row) => row.source === 'exact_path_probe' && row.cannibalization_risk === 'HIGH_REVIEW_EXISTING_ROUTE').length;
  const relatedHits = rows.filter((row) => row.source === 'wp_rest_search' && row.cannibalization_risk === 'MEDIUM_REVIEW_TITLE_OR_PATH_MATCH').length;
  const lowSearchContextRows = rows.filter((row) => row.source === 'wp_rest_search' && row.cannibalization_risk === 'LOW_SEARCH_CONTEXT_ONLY').length;
  const errors = rows.filter((row) => String(row.cannibalization_risk).includes('ERROR')).length;
  return {
    status: errors > 0 ? 'REVIEW_PACKET_WITH_FETCH_ERRORS_NOT_APPROVED_FOR_PUBLISH' : 'REVIEW_PACKET_NOT_APPROVED_FOR_PUBLISH',
    exactLive,
    relatedHits,
    lowSearchContextRows,
    errors,
    totalRows: rows.length,
    publicChangesApproved: 0,
  };
}

function markdownReport(reportDate, baseUrl, summary, rows) {
  const highlightedRows = rows.filter((row) =>
    ['HIGH_REVIEW_EXISTING_ROUTE', 'MEDIUM_REVIEW_TITLE_OR_PATH_MATCH', 'REVIEW_FETCH_ERROR'].includes(row.cannibalization_risk)
  );
  const byPackage = packages.map((packageInfo) => ({
    packageInfo,
    rows: rows.filter((row) => row.package_key === packageInfo.key),
  }));

  return [
    `# Managed-Service Public Cannibalization Inventory - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    `Base URL: ${baseUrl}`,
    '',
    'Scope: live read-only inventory for the first two managed-service pilot packages. This is an anti-cannibalization packet only; it does not publish a page, edit CMS content, add internal links, change title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact anyone, invoice, charge payment or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Total inventory rows: ${summary.totalRows}`,
    `- Existing exact/live route probes requiring review: ${summary.exactLive}`,
    `- High-signal REST title/path matches requiring review: ${summary.relatedHits}`,
    `- Low-signal REST context rows kept in CSV only: ${summary.lowSearchContextRows}`,
    `- Fetch/search errors: ${summary.errors}`,
    `- Public changes approved by this packet: ${summary.publicChangesApproved}`,
    '',
    '## Package Decisions',
    '',
    '| Package | Pilot Rank | Proposed Public Intent | Decision Rule |',
    '| --- | --- | --- | --- |',
    ...packages.map((packageInfo) => `| ${packageInfo.label} | ${packageInfo.pilotRank} | ${packageInfo.proposedPublicIntent} | ${packageInfo.decisionRule} |`),
    '',
    '## Highlighted Inventory Rows',
    '',
    '| Package | Source | Query | Status | URL | Title/H1 | Risk | Recommendation |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...highlightedRows.map((row) => {
      const label = row.package_label.replace(/\|/g, '/');
      const title = `${row.title || row.h1 || '-'}${row.h1 && row.title !== row.h1 ? ` / ${row.h1}` : ''}`.replace(/\|/g, '/');
      return `| ${label} | ${row.source} | ${String(row.query || '-').replace(/\|/g, '/')} | ${row.status_code} | ${row.url || row.path} | ${title} | ${row.cannibalization_risk} | ${row.recommendation.replace(/\|/g, '/')} |`;
    }),
    '',
    '## Per-Package Notes',
    '',
    ...byPackage.map(({ packageInfo, rows: packageRows }) => [
      `### ${packageInfo.label}`,
      `- Rows found: ${packageRows.length}`,
      `- Exact live routes: ${packageRows.filter((row) => row.source === 'exact_path_probe' && row.cannibalization_risk === 'HIGH_REVIEW_EXISTING_ROUTE').length}`,
      `- High-signal related search hits: ${packageRows.filter((row) => row.source === 'wp_rest_search' && row.cannibalization_risk === 'MEDIUM_REVIEW_TITLE_OR_PATH_MATCH').length}`,
      `- Low-signal context rows kept in CSV: ${packageRows.filter((row) => row.source === 'wp_rest_search' && row.cannibalization_risk === 'LOW_SEARCH_CONTEXT_ONLY').length}`,
      `- Decision: ${packageInfo.decisionRule}`,
      '',
    ].join('\n')),
    '## Safety Statement',
    '',
    'This packet is not a launch approval. For any public managed-service package, owner/SEO must first choose whether to upgrade an existing page, create a narrow new page, or keep the package private; exact public URL, title/H1/meta/body, internal links and checkout wording remain blocked.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-managed-service-public-cannibalization-inventory.mjs [--baseUrl=https://jus-tice.co.il] [--reportDate=YYYY-MM-DD] [--perPage=10] [--concurrency=6]');
  process.exit(0);
}

const tasks = [];
for (const packageInfo of packages) {
  for (const candidatePath of packageInfo.exactPaths) {
    tasks.push(() => inspectPath(args.baseUrl, packageInfo, candidatePath));
  }

  for (const query of packageInfo.searchTerms) {
    for (const postType of postTypes) {
      tasks.push(() => searchRest(args.baseUrl, packageInfo, query, postType, args.perPage));
    }
  }
}

const taskResults = await runLimited(tasks, args.concurrency);
const rows = taskResults.flat();
const dedupedRows = dedupeRows(rows);
const summary = summarize(dedupedRows);
const files = outputFiles(args.reportDate);
const columns = [
  'package_key',
  'package_label',
  'source',
  'query',
  'post_type',
  'url',
  'path',
  'status_code',
  'title',
  'h1',
  'canonical',
  'match_reason',
  'cannibalization_risk',
  'recommendation',
];
const csv = toCsv(dedupedRows, columns);

writeText(files.projectMd, markdownReport(args.reportDate, args.baseUrl, summary, dedupedRows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows: dedupedRows, files }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify(summary, null, 2));
