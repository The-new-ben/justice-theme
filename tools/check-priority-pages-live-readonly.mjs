import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const pages = [
  {
    id: 'P1-CRIMINAL-COST',
    cluster: 'criminal-law',
    priority: 'P1',
    path: '/criminal-lawyer-cost/',
    expectedTerms: ['עלות', 'פלילי'],
    expectedPillarLinks: ['/criminal-defense-attorney/'],
  },
  {
    id: 'P1-PLEA-BARGAIN',
    cluster: 'criminal-law',
    priority: 'P1',
    path: '/plea-bargain/',
    expectedTerms: ['טיעון'],
    expectedPillarLinks: ['/criminal-defense-attorney/'],
  },
  {
    id: 'P1-MEDMAL-DIAGNOSIS',
    cluster: 'medical-malpractice',
    priority: 'P1',
    path: '/medical-malpractice-diagnosis-errors/',
    expectedTerms: ['רשלנות', 'אבחון'],
    expectedPillarLinks: ['/medical-malpractice-lawyer/'],
  },
  {
    id: 'P1-FAMILY-JOINT-CUSTODY',
    cluster: 'family-law',
    priority: 'P1',
    path: '/joint-custody/',
    expectedTerms: ['משמורת', 'משותפת'],
    expectedPillarLinks: ['/family-law/'],
  },
  {
    id: 'P2-MEDMAL-MEDICATION',
    cluster: 'medical-malpractice',
    priority: 'P2',
    path: '/medication-errors-malpractice/',
    expectedTerms: ['רשלנות', 'תרופות'],
    expectedPillarLinks: ['/medical-malpractice-lawyer/'],
  },
  {
    id: 'P2-FAMILY-PENSION',
    cluster: 'family-law',
    priority: 'P2',
    path: '/divorce-pension-split/',
    expectedTerms: ['פנסיה', 'גירושין'],
    expectedPillarLinks: ['/family-law/', '/divorce-agreement/'],
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || new Date().toISOString().slice(0, 10),
    baseUrl: DEFAULT_BASE_URL,
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--baseUrl=')) args.baseUrl = arg.slice('--baseUrl='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `priority-pages-live-readonly-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function absoluteUrl(baseUrl, inputPath) {
  return new URL(inputPath, baseUrl).toString();
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripTags(value) {
  return normalizeWhitespace(decodeEntities(String(value || '').replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')));
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripTags(match[1]) : '';
}

function extractAllTags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function pickAttribute(openTag, name) {
  const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(openTag || '').match(new RegExp(`\\b${safeName}=["']([^"']*)["']`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function compactHtmlContext(html, index, length) {
  const start = Math.max(0, index - 220);
  const end = Math.min(html.length, index + length + 220);
  let snippet = html.slice(start, end);
  const firstClose = snippet.indexOf('>');
  const firstOpen = snippet.indexOf('<');
  if (start > 0 && firstClose !== -1 && (firstOpen === -1 || firstClose < firstOpen)) {
    snippet = snippet.slice(firstClose + 1);
  }
  return stripTags(snippet).replace(/<[^>]*$/, '').slice(0, 360);
}

function extractAllTagDetails(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => {
      const openTag = `<${tag}${match[1] || ''}>`;
      const text = stripTags(match[2]);
      return {
        text,
        className: pickAttribute(openTag, 'class'),
        id: pickAttribute(openTag, 'id'),
        context: compactHtmlContext(html, match.index || 0, match[0].length),
      };
    })
    .filter((detail) => detail.text || detail.className || detail.id);
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? decodeEntities(match[1]) : '';
}

function extractRobots(html) {
  return [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/gi)]
    .map((match) => normalizeWhitespace(match[1].toLowerCase()))
    .join('|');
}

function extractHrefs(html) {
  return [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => decodeEntities(match[1]))
    .filter(Boolean);
}

function normalizePathFromHref(baseUrl, href) {
  try {
    const url = new URL(href, baseUrl);
    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  } catch {
    return '';
  }
}

function normalizeUrlForCompare(url) {
  try {
    const parsed = new URL(url);
    const pathName = parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
    return `${parsed.origin}${pathName}`;
  } catch {
    return String(url || '');
  }
}

function jsonLdTypes(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => decodeEntities(match[1]).trim())
    .filter(Boolean);
  const types = [];

  function collectTypes(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collectTypes);
      return;
    }
    if ('object' !== typeof value) return;
    const type = value['@type'];
    if (Array.isArray(type)) type.forEach((item) => types.push(String(item)));
    else if (type) types.push(String(type));
    if (Array.isArray(value['@graph'])) value['@graph'].forEach(collectTypes);
  }

  scripts.forEach((script) => {
    try {
      collectTypes(JSON.parse(script));
    } catch {
      types.push('UNPARSEABLE_JSON_LD');
    }
  });

  return [...new Set(types)];
}

function mojibakeHits(html) {
  const markers = ['�', '×©', '×”', '×', '×¢', '×•', '×™', '×¨', 'ג‚×'];
  return markers.filter((marker) => html.includes(marker));
}

function stableMojibakeHits(html) {
  const markers = [
    { label: 'replacement_character', pattern: /\uFFFD/ },
    { label: 'latin1_misdecoded_hebrew_x', pattern: /\u00D7[\u0080-\u00FF\u2010-\u202F]/ },
    { label: 'latin1_misdecoded_hebrew_y', pattern: /\u00D6[\u0080-\u00FF\u2010-\u202F]/ },
    { label: 'html_entity_replacement', pattern: /&#65533;|&amp;#65533;/i },
  ];
  return markers.filter((marker) => marker.pattern.test(html)).map((marker) => marker.label);
}

function hebrewCharacterCount(value) {
  return (String(value || '').match(/[\u0590-\u05FF]/g) || []).length;
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
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
      headers: {
        'User-Agent': 'Jus-Tice-Priority-Pages-Live-Readonly-QA/1.0',
        Accept: accept,
        'Cache-Control': 'no-cache',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function slugFromPath(inputPath) {
  return String(inputPath || '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).pop() || '';
}

async function inspectRestCollection(baseUrl, collection, slug) {
  const url = new URL(`/wp-json/wp/v2/${collection}`, baseUrl);
  url.searchParams.set('slug', slug);
  url.searchParams.set('_fields', 'id,slug,status,link,title');

  try {
    const response = await fetchWithTimeout(url.toString(), 'application/json,*/*;q=0.8');
    const body = await response.text();
    let data = null;
    try {
      data = JSON.parse(body);
    } catch {
      return {
        status: response.status,
        count: '',
        ids: '',
        links: '',
        issue: `rest_${collection}_unparseable_json`,
      };
    }

    const items = Array.isArray(data) ? data : [];
    return {
      status: response.status,
      count: items.length,
      ids: items.map((item) => item.id).filter(Boolean).join(' | '),
      links: items.map((item) => item.link).filter(Boolean).join(' | '),
      issue: response.status === 200 ? '' : `rest_${collection}_http_${response.status}`,
    };
  } catch (error) {
    return {
      status: 0,
      count: '',
      ids: '',
      links: '',
      issue: `rest_${collection}_fetch_error_${error.name || 'unknown'}`,
    };
  }
}

async function inspectPage(baseUrl, page) {
  const targetUrl = absoluteUrl(baseUrl, page.path);
  const slug = slugFromPath(page.path);
  const issues = [];

  try {
    const [response, restPages, restPosts] = await Promise.all([
      fetchWithTimeout(targetUrl),
      inspectRestCollection(baseUrl, 'pages', slug),
      inspectRestCollection(baseUrl, 'posts', slug),
    ]);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const visibleText = stripTags(html);
    const title = extractTag(html, 'title');
    const h1Details = extractAllTagDetails(html, 'h1');
    const h1Texts = h1Details.map((detail) => detail.text).filter(Boolean);
    const canonical = extractCanonical(html);
    const robots = extractRobots(html);
    const hrefPaths = extractHrefs(html).map((href) => normalizePathFromHref(baseUrl, href)).filter(Boolean);
    const missingPillarLinks = page.expectedPillarLinks.filter((linkPath) => !hrefPaths.includes(linkPath));
    const missingTerms = page.expectedTerms.filter((term) => !visibleText.includes(term) && !title.includes(term));
    const schemaTypes = jsonLdTypes(html);
    const mojibake = stableMojibakeHits(html);
    const hebrewChars = hebrewCharacterCount(visibleText);
    const expectedCanonical = absoluteUrl(baseUrl, page.path);
    const contentChecksEligible = response.status === 200 && contentType.toLowerCase().includes('text/html');

    if (response.status !== 200) issues.push(`http_${response.status}`);
    if (!contentType.toLowerCase().includes('text/html')) issues.push('non_html_response');
    if (!title) issues.push('missing_title');
    if (contentChecksEligible && h1Texts.length !== 1) issues.push(`h1_count_${h1Texts.length}`);
    if (!canonical) issues.push('missing_canonical');
    else if (normalizeUrlForCompare(canonical) !== normalizeUrlForCompare(expectedCanonical)) issues.push('canonical_mismatch');
    if (robots.includes('noindex')) issues.push('noindex_detected');
    if (contentChecksEligible && missingPillarLinks.length) issues.push(`missing_pillar_links_${missingPillarLinks.join('|')}`);
    if (contentChecksEligible && missingTerms.length) issues.push(`missing_expected_terms_${missingTerms.join('|')}`);
    if (contentChecksEligible && mojibake.length) issues.push(`mojibake_markers_${mojibake.join('|')}`);
    if (contentChecksEligible && hebrewChars < 300) issues.push(`low_hebrew_signal_${hebrewChars}`);
    if (contentChecksEligible && !schemaTypes.some((type) => ['Article', 'WebPage', 'NewsArticle', 'BlogPosting'].includes(type))) {
      issues.push('missing_page_or_article_jsonld');
    }
    if (restPages.issue) issues.push(restPages.issue);
    if (restPosts.issue) issues.push(restPosts.issue);
    if (restPages.status === 200 && restPosts.status === 200 && !Number(restPages.count) && !Number(restPosts.count)) {
      issues.push('public_rest_empty_pages_posts');
    }

    return {
      check_id: page.id,
      cluster: page.cluster,
      priority: page.priority,
      status: issues.length ? 'BLOCKED' : 'VERIFIED',
      target_path: page.path,
      target_url: targetUrl,
      http_status: response.status,
      final_url: response.url,
      content_type: contentType,
      title,
      h1_count: h1Texts.length,
      h1_texts: h1Texts.join(' | '),
      h1_sources: h1Details.map((detail) => `${detail.text || '-'} [class=${detail.className || '-'} id=${detail.id || '-'}]`).join(' | '),
      h1_contexts: h1Details.map((detail) => detail.context).filter(Boolean).join(' | '),
      canonical,
      robots,
      rest_pages_status: restPages.status,
      rest_pages_count: restPages.count,
      rest_pages_ids: restPages.ids,
      rest_pages_links: restPages.links,
      rest_posts_status: restPosts.status,
      rest_posts_count: restPosts.count,
      rest_posts_ids: restPosts.ids,
      rest_posts_links: restPosts.links,
      expected_pillar_links: page.expectedPillarLinks.join(' | '),
      missing_pillar_links: missingPillarLinks.join(' | '),
      expected_terms: page.expectedTerms.join(' | '),
      missing_expected_terms: missingTerms.join(' | '),
      schema_types: schemaTypes.join(' | '),
      hebrew_character_count: hebrewChars,
      mojibake_markers: mojibake.join(' | '),
      screenshot_status: 'NOT_CAPTURED_PLAYWRIGHT_NOT_INSTALLED',
      issues: issues.length ? issues.join(';') : '-',
      next_step: issues.length
        ? 'Review live page in browser/wp-admin, capture rollback material before any edit, then repair only the listed issue.'
        : 'Keep page in post-publish monitoring set and add GSC query/page evidence when available.',
    };
  } catch (error) {
    return {
      check_id: page.id,
      cluster: page.cluster,
      priority: page.priority,
      status: 'BLOCKED',
      target_path: page.path,
      target_url: targetUrl,
      http_status: 0,
      final_url: '',
      content_type: '',
      title: '',
      h1_count: '',
      h1_texts: '',
      h1_sources: '',
      h1_contexts: '',
      canonical: '',
      robots: '',
      rest_pages_status: '',
      rest_pages_count: '',
      rest_pages_ids: '',
      rest_pages_links: '',
      rest_posts_status: '',
      rest_posts_count: '',
      rest_posts_ids: '',
      rest_posts_links: '',
      expected_pillar_links: page.expectedPillarLinks.join(' | '),
      missing_pillar_links: page.expectedPillarLinks.join(' | '),
      expected_terms: page.expectedTerms.join(' | '),
      missing_expected_terms: page.expectedTerms.join(' | '),
      schema_types: '',
      hebrew_character_count: 0,
      mojibake_markers: '',
      screenshot_status: 'NOT_CAPTURED_FETCH_FAILED',
      issues: `fetch_error_${error.name || 'unknown'}_${error.message || ''}`.slice(0, 220),
      next_step: 'Retry read-only live check; if still blocked, verify DNS/CDN/cache and page publication state.',
    };
  }
}

function buildSummary(rows) {
  const verified = rows.filter((row) => row.status === 'VERIFIED').length;
  const blocked = rows.length - verified;
  return {
    total_pages: rows.length,
    verified_pages: verified,
    blocked_pages: blocked,
    http_200_pages: rows.filter((row) => Number(row.http_status) === 200).length,
    noindex_pages: rows.filter((row) => String(row.robots).includes('noindex')).length,
    h1_issue_pages: rows.filter((row) => Number(row.h1_count) !== 1).length,
    mojibake_pages: rows.filter((row) => row.mojibake_markers).length,
    public_rest_empty_pages_posts: rows.filter((row) => Number(row.rest_pages_count) === 0 && Number(row.rest_posts_count) === 0).length,
    public_change_status: 'NO_PUBLIC_CHANGES_READ_ONLY_LIVE_QA',
  };
}

function buildMarkdown(reportDate, baseUrl, rows, summary) {
  const lines = [
    `# Priority Pages Live Read-Only QA - ${reportDate}`,
    '',
    '## Status',
    '',
    '- VERIFIED LIVE READ-ONLY: this check fetched public URLs only.',
    `- BASE URL: ${baseUrl}.`,
    `- VERIFIED PAGES: ${summary.verified_pages}/${summary.total_pages}.`,
    `- BLOCKED PAGES: ${summary.blocked_pages}/${summary.total_pages}.`,
    `- HTTP 200 PAGES: ${summary.http_200_pages}/${summary.total_pages}.`,
    `- H1 ISSUE PAGES: ${summary.h1_issue_pages}.`,
    `- NOINDEX PAGES: ${summary.noindex_pages}.`,
    `- MOJIBAKE PAGES: ${summary.mojibake_pages}.`,
    `- PUBLIC REST EMPTY PAGES/POSTS: ${summary.public_rest_empty_pages_posts}/${summary.total_pages}.`,
    '- SCREENSHOTS: NOT CAPTURED because Playwright is not installed in this repo environment.',
    '- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.',
    '',
    '## Results',
    '',
    '| Page | Status | HTTP | H1 Count | Issues |',
    '| --- | --- | --- | --- | --- |',
  ];

  rows.forEach((row) => {
    lines.push(`| ${row.target_path} | ${row.status} | ${row.http_status} | ${row.h1_count || '-'} | ${row.issues.replace(/\|/g, '/') || '-'} |`);
  });

  lines.push(
    '',
    '## Duplicate H1 Diagnostics',
    '',
    '| Page | H1 Sources | H1 Contexts |',
    '| --- | --- | --- |'
  );

  rows
    .filter((row) => Number(row.h1_count) !== 1)
    .forEach((row) => {
      lines.push(`| ${row.target_path} | ${(row.h1_sources || '-').replace(/\|/g, '/')} | ${(row.h1_contexts || '-').replace(/\|/g, '/')} |`);
    });

  lines.push(
    '',
    '## Public REST Visibility',
    '',
    '| Page | wp/v2/pages | Page IDs | wp/v2/posts | Post IDs |',
    '| --- | --- | --- | --- | --- |'
  );

  rows.forEach((row) => {
    lines.push(`| ${row.target_path} | ${row.rest_pages_status}/${row.rest_pages_count} | ${row.rest_pages_ids || '-'} | ${row.rest_posts_status}/${row.rest_posts_count} | ${row.rest_posts_ids || '-'} |`);
  });

  lines.push(
    '',
    '## Next',
    '',
    '1. If a row is BLOCKED, inspect the live page in a browser and capture rollback material before any CMS edit.',
    '2. For VERIFIED rows, keep monitoring after cache clears and attach GSC page/query evidence when owner OAuth export is available.',
    '3. Capture mobile/desktop screenshots in a browser-capable environment before marking these pages visually verified.'
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/check-priority-pages-live-readonly.mjs --reportDate=YYYY-MM-DD [--baseUrl=https://jus-tice.co.il]');
    return;
  }

  const rows = await Promise.all(pages.map((page) => inspectPage(args.baseUrl, page)));
  const summary = buildSummary(rows);
  const outputs = outputFiles(args.reportDate);
  const columns = [
    'check_id',
    'cluster',
    'priority',
    'status',
    'target_path',
    'target_url',
    'http_status',
    'final_url',
    'content_type',
    'title',
    'h1_count',
    'h1_texts',
    'h1_sources',
    'h1_contexts',
    'canonical',
    'robots',
    'rest_pages_status',
    'rest_pages_count',
    'rest_pages_ids',
    'rest_pages_links',
    'rest_posts_status',
    'rest_posts_count',
    'rest_posts_ids',
    'rest_posts_links',
    'expected_pillar_links',
    'missing_pillar_links',
    'expected_terms',
    'missing_expected_terms',
    'schema_types',
    'hebrew_character_count',
    'mojibake_markers',
    'screenshot_status',
    'issues',
    'next_step',
  ];

  writeText(outputs.reportCsv, toCsv(rows, columns));
  writeText(outputs.projectCsv, toCsv(rows, columns));
  writeText(outputs.reportJson, JSON.stringify({
    reportDate: args.reportDate,
    generated_at: new Date().toISOString(),
    baseUrl: args.baseUrl,
    summary,
    rows,
  }, null, 2) + '\n');
  writeText(outputs.projectMd, buildMarkdown(args.reportDate, args.baseUrl, rows, summary));

  console.table(rows.map(({ check_id, status, http_status, h1_count }) => ({ check_id, status, http_status, h1_count })));
  console.log(`Priority pages live read-only QA: ${summary.verified_pages}/${summary.total_pages} VERIFIED`);
  console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
