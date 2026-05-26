import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);
const DEFAULT_MAX_SITEMAP_FILES = Number(process.env.JUSTICE_MAX_SITEMAP_FILES || 0);
const DEFAULT_MAX_SITEMAP_CANDIDATES = Number(process.env.JUSTICE_MAX_SITEMAP_CANDIDATES || 0);

const seedCandidates = [
  { path: '/real-estate-lawyer-guide/', source: 'controlled_real_estate_route', topic: 'hub' },
  { path: '/real-estate-attorney/', source: 'legacy_money_query', topic: 'hub' },
  { path: '/real-estate-tax/', source: 'homepage_intent_pyramid', topic: 'real_estate_tax' },
  { path: '/land-appreciation-tax/', source: 'real_estate_route_supporting_link', topic: 'seller_tax' },
  { path: '/purchase-tax/', source: 'owner_high_risk_placeholder', topic: 'purchase_tax' },
  { path: '/purchase-tax-calculator/', source: 'owner_high_risk_placeholder', topic: 'purchase_tax_tool' },
  { path: '/real-estate-purchase-tax/', source: 'owner_high_risk_placeholder', topic: 'purchase_tax' },
  { path: '/purchase-tax-verdict-claim-63044-06-20/', source: 'redirect_map_candidate', topic: 'purchase_tax_case' },
  { path: '/purchase-tax-cancellation-real-estate-5561-01-20/', source: 'redirect_map_candidate', topic: 'purchase_tax_case' },
  { path: '/lawyer-for-buying-or-selling-a-house/', source: 'real_estate_route_supporting_link', topic: 'buy_sell_apartment' },
  { path: '/buying-apartment/', source: 'pillar_and_redirect_candidate', topic: 'buying_apartment' },
  { path: '/buying-apartment-guide-comprehensive/', source: 'redirect_map_candidate', topic: 'buying_apartment' },
  { path: '/selling-apartment/', source: 'slug_map_candidate', topic: 'selling_apartment' },
  { path: '/registration-of-real-estate-israel/', source: 'real_estate_route_supporting_link', topic: 'registration' },
  { path: '/real-estate-lawyer-cost-2025/', source: 'real_estate_route_supporting_link', topic: 'lawyer_cost' },
  { path: '/real-estate-appraiser/', source: 'real_estate_route_supporting_link', topic: 'supplier_appraiser' },
  { path: '/property-tax-arnona/', source: 'breadcrumb_candidate', topic: 'arnona' },
  { path: '/arnona-appeal-checker/', source: 'revenue_stream_placeholder', topic: 'arnona_tool' },
  { path: '/marital-property-agreement/', source: 'real_estate_route_supporting_link', topic: 'family_property_overlap' },
];

const sitemapPathPatterns = [
  /real-estate/i,
  /property/i,
  /apartment/i,
  /land-(appreciation|registry)/i,
  /purchase-tax/i,
  /arnona/i,
  /appraiser/i,
  /buying/i,
  /selling/i,
  /tenant/i,
  /landlord/i,
];

function parseArgs() {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    maxSitemapFiles: DEFAULT_MAX_SITEMAP_FILES,
    maxSitemapCandidates: DEFAULT_MAX_SITEMAP_CANDIDATES,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length);
    } else if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--maxSitemapFiles=')) {
      args.maxSitemapFiles = Number(arg.slice('--maxSitemapFiles='.length));
    } else if (arg.startsWith('--maxSitemapCandidates=')) {
      args.maxSitemapCandidates = Number(arg.slice('--maxSitemapCandidates='.length));
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

function outputFiles(reportDate) {
  const base = `real-estate-tax-tool-inventory-${reportDate}`;
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

function normalizePath(pathOrUrl) {
  const url = new URL(pathOrUrl, DEFAULT_BASE_URL);
  return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
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

function extractAllTags(html, tagName) {
  return [...String(html || '').matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function extractMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escaped}["'][^>]*>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = String(html || '').match(pattern);
    if (match) {
      return stripTags(match[1]);
    }
  }
  return '';
}

function extractCanonical(html) {
  const match = String(html || '').match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i);
  return match ? match[1] : '';
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

async function fetchWithTimeout(url, accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8') {
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
        'User-Agent': 'Jus-Tice live QA / real-estate tax inventory',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function loadSitemapCandidates(baseUrl) {
  if (args.maxSitemapFiles <= 0 || args.maxSitemapCandidates <= 0) {
    return [];
  }

  const sitemapSeeds = ['/sitemap_index.xml', '/wp-sitemap.xml', '/sitemap.xml'];
  const seen = new Set();
  const urls = new Set();

  async function visit(url, depth = 0) {
    if (seen.has(url) || depth > 3 || seen.size >= args.maxSitemapFiles || urls.size >= args.maxSitemapCandidates) {
      return;
    }
    seen.add(url);

    try {
      const response = await fetchWithTimeout(url, 'application/xml,text/xml,*/*;q=0.8');
      if (!response.ok) {
        return;
      }
      const body = await response.text();
      const locs = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1].trim());
      for (const loc of locs) {
        if (seen.size >= args.maxSitemapFiles || urls.size >= args.maxSitemapCandidates) {
          break;
        }
        if (/\.xml(\?|$)/i.test(loc)) {
          await visit(loc, depth + 1);
        } else {
          const parsed = new URL(loc);
          if (parsed.hostname === new URL(baseUrl).hostname && sitemapPathPatterns.some((pattern) => pattern.test(parsed.pathname))) {
            urls.add(normalizePath(parsed.pathname));
          }
        }
      }
    } catch (error) {
      // Sitemap availability is useful but not required for the inventory.
    }
  }

  for (const sitemapPath of sitemapSeeds) {
    await visit(absoluteUrl(baseUrl, sitemapPath));
  }

  return [...urls].map((candidatePath) => ({
    path: candidatePath,
    source: 'sitemap_keyword_match',
    topic: inferTopic(candidatePath),
  }));
}

function inferTopic(candidatePath) {
  if (/purchase-tax/i.test(candidatePath)) {
    return 'purchase_tax';
  }
  if (/land-appreciation-tax|seller|selling/i.test(candidatePath)) {
    return 'seller_tax';
  }
  if (/arnona|property-tax/i.test(candidatePath)) {
    return 'arnona';
  }
  if (/appraiser/i.test(candidatePath)) {
    return 'supplier_appraiser';
  }
  if (/buying|apartment/i.test(candidatePath)) {
    return 'buying_apartment';
  }
  if (/real-estate/i.test(candidatePath)) {
    return 'real_estate';
  }
  if (/property/i.test(candidatePath)) {
    return 'property_overlap';
  }
  return 'related';
}

function mergeCandidates(sitemapCandidates) {
  const merged = new Map();
  for (const candidate of [...seedCandidates, ...sitemapCandidates]) {
    const candidatePath = normalizePath(candidate.path);
    if (!merged.has(candidatePath)) {
      merged.set(candidatePath, {
        path: candidatePath,
        sources: new Set(),
        topics: new Set(),
      });
    }
    merged.get(candidatePath).sources.add(candidate.source);
    merged.get(candidatePath).topics.add(candidate.topic);
  }

  return [...merged.values()].map((candidate) => ({
    path: candidate.path,
    sources: [...candidate.sources].sort().join(' | '),
    topics: [...candidate.topics].sort().join(' | '),
  }));
}

function assessRow(row) {
  if (row.http_status === 0) {
    return {
      status: 'REVIEW_FETCH_FAILED',
      overlap_risk: 'UNKNOWN',
      recommended_action: 'Retry live read-only fetch before any link or content decision.',
    };
  }
  if (row.http_status === 404) {
    return {
      status: 'ABSENT_OR_NOT_PUBLIC',
      overlap_risk: row.topics.includes('purchase_tax') || row.topics.includes('seller_tax') ? 'MEDIUM' : 'LOW',
      recommended_action: 'Do not create or link a replacement until owner/SEO approves the target and confirms no CMS equivalent exists.',
    };
  }
  if (row.http_status !== 200) {
    return {
      status: 'REVIEW_HTTP_STATUS',
      overlap_risk: 'MEDIUM',
      recommended_action: 'Review status/final URL before any public link or page decision.',
    };
  }
  if (row.final_path !== row.path) {
    return {
      status: 'REVIEW_REDIRECT_OR_ALIAS',
      overlap_risk: 'MEDIUM',
      recommended_action: 'Inspect redirect/alias behavior before linking; do not change redirects or canonicals from this packet.',
    };
  }
  if (/purchase_tax|seller_tax|real_estate_tax/.test(row.topics)) {
    return {
      status: 'EXISTING_TAX_INTENT_PAGE',
      overlap_risk: 'HIGH',
      recommended_action: 'Use as existing-page evidence before considering a new tax calculator or link target; owner/SEO/GSC approval required.',
    };
  }
  if (/hub|real_estate|buy_sell_apartment|buying_apartment|registration/.test(row.topics)) {
    return {
      status: 'EXISTING_RELATED_PAGE',
      overlap_risk: 'MEDIUM',
      recommended_action: 'Keep as supporting real-estate context; link only after owner/UX approval and intent-split review.',
    };
  }
  return {
    status: 'EXISTING_ADJACENT_PAGE',
    overlap_risk: 'LOW',
    recommended_action: 'Use as context for future internal-link planning.',
  };
}

async function inspectCandidate(baseUrl, candidate, cacheToken) {
  const url = absoluteUrl(baseUrl, `${candidate.path}?real_estate_tax_inventory=${encodeURIComponent(cacheToken)}`);
  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const finalPath = new URL(response.url).pathname.endsWith('/')
      ? new URL(response.url).pathname
      : `${new URL(response.url).pathname}/`;
    const title = extractTag(html, 'title');
    const h1s = extractAllTags(html, 'h1');
    const canonical = extractCanonical(html);
    const robots = extractMeta(html, 'robots');
    const row = {
      path: candidate.path,
      sources: candidate.sources,
      topics: candidate.topics,
      http_status: response.status,
      final_url: response.url,
      final_path: finalPath,
      title,
      h1: h1s.join(' | '),
      h1_count: h1s.length,
      canonical,
      robots,
      noindex: /noindex/i.test(robots) ? 'YES' : 'NO',
      word_count: stripTags(html).split(/\s+/).filter(Boolean).length,
    };
    return {
      ...row,
      ...assessRow(row),
    };
  } catch (error) {
    const row = {
      path: candidate.path,
      sources: candidate.sources,
      topics: candidate.topics,
      http_status: 0,
      final_url: '',
      final_path: '',
      title: '',
      h1: '',
      h1_count: 0,
      canonical: '',
      robots: '',
      noindex: '',
      word_count: 0,
    };
    return {
      ...row,
      ...assessRow(row),
      recommended_action: error instanceof Error ? `Retry after fetch error: ${error.message}` : 'Retry after fetch error.',
    };
  }
}

function markdownReport(rows, reportDate, baseUrl) {
  const existingTaxRows = rows.filter((row) => row.status === 'EXISTING_TAX_INTENT_PAGE');
  const absentRows = rows.filter((row) => row.status === 'ABSENT_OR_NOT_PUBLIC');
  const highRiskRows = rows.filter((row) => row.overlap_risk === 'HIGH');
  const reviewRows = rows.filter((row) => row.status.startsWith('REVIEW'));

  const lines = [
    `# Real-Estate Tax / Tool Inventory - ${reportDate}`,
    '',
    'Status: REVIEW_PACKET_ONLY_NOT_APPROVED_FOR_PUBLISH',
    '',
    `Base URL: ${baseUrl}`,
    '',
    'Scope: live read-only inventory for the high-risk real-estate tax/tool placeholder from the associated-linkage review. This checks exact route/config/redirect candidates for purchase-tax, seller-tax, arnona and adjacent real-estate routes before any new page, calculator, link or SEO action is considered. Sitemap expansion is optional and disabled by default for fast safe reruns.',
    '',
    'Safety: no login, CMS publish, database edit, internal link write, title/H1/meta change, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, product, payment, invoice, email, WhatsApp, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    '## Summary',
    '',
    `- Candidate routes inspected: ${rows.length}`,
    `- Existing tax-intent pages: ${existingTaxRows.length}`,
    `- High-risk overlap rows: ${highRiskRows.length}`,
    `- Absent/not-public candidates: ${absentRows.length}`,
    `- Fetch/status review rows: ${reviewRows.length}`,
    '- Approved for publish or linking: 0',
    '',
    '## Inventory',
    '',
    '| Path | Status | HTTP | Topics | Risk | Title | H1 | Recommended Action |',
    '| --- | --- | ---: | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) => `| ${row.path} | ${row.status} | ${row.http_status} | ${row.topics.replace(/\|/g, '/')} | ${row.overlap_risk} | ${row.title.replace(/\|/g, '/')} | ${row.h1.replace(/\|/g, '/')} | ${row.recommended_action.replace(/\|/g, '/')} |`
    ),
    '',
    '## Interpretation',
    '',
    '- This inventory exists because `/real-estate-lawyer-guide/` should not link to a new purchase-tax or seller-tax tool before existing pages are mapped.',
    '- Any existing tax-intent route is high-risk for cannibalization and needs owner/SEO/GSC review before anchors, internal links, titles, H1, canonicals, redirects or new calculator pages are changed.',
    '- Absent purchase-tax-style candidates are not permission to create a new page. They are only evidence for the next owner decision.',
    ''
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-real-estate-tax-tool-inventory.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il] [--maxSitemapFiles=0] [--maxSitemapCandidates=0]');
  process.exit(0);
}

const sitemapCandidates = await loadSitemapCandidates(args.baseUrl);
const candidates = mergeCandidates(sitemapCandidates);
const rows = [];
for (const candidate of candidates) {
  rows.push(await inspectCandidate(args.baseUrl, candidate, args.reportDate));
}

rows.sort((a, b) => {
  const riskRank = { HIGH: 0, MEDIUM: 1, LOW: 2, UNKNOWN: 3 };
  return (riskRank[a.overlap_risk] ?? 9) - (riskRank[b.overlap_risk] ?? 9) || a.path.localeCompare(b.path);
});

const outputs = outputFiles(args.reportDate);
const columns = [
  'path',
  'status',
  'http_status',
  'final_url',
  'final_path',
  'sources',
  'topics',
  'overlap_risk',
  'title',
  'h1',
  'h1_count',
  'canonical',
  'robots',
  'noindex',
  'word_count',
  'recommended_action',
];

writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.reportDate, args.baseUrl));

console.table(rows.map(({ path, status, http_status, topics, overlap_risk }) => ({
  path,
  status,
  http_status,
  topics,
  overlap_risk,
})));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);
