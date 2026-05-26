import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const defaultPaths = [
  '/',
  '/national-insurance-attorney/',
  '/bituach-leumi-appeal-guide/',
  '/find-lawyer-how-to-find-good-attorney/',
  '/lawyers/',
  '/articles/',
  '/rental-agreement/',
  '/labor-lawyer/',
  '/consumer-rights-israel/',
  '/eviction-notice-israel/',
  '/criminal-defense-attorney/',
  '/medical-malpractice-lawyer/',
  '/real-estate-lawyer-guide/',
];

const blockedMarkers = [
  'revenue for Jus-Tice',
  'revenue for justice',
  'good revenue for Jus-Tice',
  'good revenue for justice',
  'why is Bituach Leumi a good revenue',
  'why Bituach Leumi is a good revenue',
  'why national insurance is a good revenue',
  'why is national insurance a good revenue',
  'revenue stream',
  'internal revenue',
  'why this is revenue',
  'why this page is revenue',
  'why this is a good revenue',
  'qualified lead fee',
  'lawyers pay',
  'lawyer pays',
  'Lead Partner target',
  'manual invoice/payment path',
  'Grow/Meshulam',
  'Meshulam',
  'Morning plugin',
  'uPress',
  'Linear',
  'investor',
  'מסלול הכנסה',
  'הכנסה חשוב',
  'למה זה מסלול הכנסה',
  'למה ערעור ביטוח לאומי הוא מסלול הכנסה',
  'למה ביטוח לאומי הוא מסלול הכנסה',
  'הכנסה ל-Jus-Tice',
  'מודל הכנסה',
  'מודל הכנסות',
  'לידים בתשלום',
  'עורכי דין משלמים',
  'מבחינה עסקית',
  'בעל האתר',
  'מדדי הצלחה',
  'סטטוס לפני פרסום',
  'פעולות המשך לפני פרסום',
  'חסמי פרסום',
  'בדיקת מקורות',
  'קניבליזציה',
  'המשתמש ביקש',
  'Jus-Tice צריך',
];

const blockedRegexMarkers = [
  {
    label: 'why_bituach_or_national_insurance_revenue',
    regex: /why\s+(?:is\s+)?(?:this|bituach\s+leumi|national\s+insurance)[^\n.?!]{0,90}(?:good\s+)?revenue[^\n.?!]{0,90}(?:jus[-\s]?tice|justice)?/i,
  },
  {
    label: 'why_page_revenue_for_justice',
    regex: /why[^\n.?!]{0,90}(?:page|route|article|service)[^\n.?!]{0,90}revenue[^\n.?!]{0,90}(?:jus[-\s]?tice|justice)/i,
  },
  {
    label: 'hebrew_bituach_revenue_heading',
    regex: /למה[^\n.?!]{0,90}(?:ביטוח\s+לאומי|ערעור|זה)[^\n.?!]{0,90}(?:מסלול\s+הכנסה|הכנסה)[^\n.?!]{0,90}(?:Jus[-\s]?Tice|ג'אסטיס|ג׳אסטיס)?/i,
  },
  {
    label: 'hebrew_internal_revenue_for_site',
    regex: /(?:מסלול\s+הכנסה|מודל\s+הכנסה|לידים\s+בתשלום)[^\n.?!]{0,90}(?:Jus[-\s]?Tice|ג'אסטיס|ג׳אסטיס|האתר)/i,
  },
];

const userIntentMarkers = [
  'עורך דין',
  'עורכי דין',
  'עו"ד',
  'ייעוץ',
  'משפטיים',
  'בעיה',
  'זכויות',
  'ערעור',
  'תביעה',
  'מסמכים',
  'פנייה',
  'בדיקה',
  'חוזה',
  'שכירות',
  'פיטורים',
  'צרכנות',
  'פינוי',
  'lawyer',
  'attorney',
  'legal',
  'appeal',
  'rights',
  'claim',
  'contract',
  'rental',
  'consumer',
];

const publicBusinessAudiencePaths = new Set([
  '/lawyer-plans/',
  '/lawyer-registration/',
  '/lawyer-dashboard/',
]);

function parseArgs() {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    paths: [],
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length);
    } else if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--path=')) {
      args.paths.push(arg.slice('--path='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (args.paths.length === 0) {
    args.paths = defaultPaths;
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `live-public-business-language-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
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

function extractAllTags(html, tagName) {
  return [...String(html || '').matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function detectMarkers(text) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  const literalHits = blockedMarkers
    .filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')))
    .map((marker) => marker);
  const regexHits = blockedRegexMarkers
    .filter((marker) => marker.regex.test(String(text || '')))
    .map((marker) => marker.label);

  return [...literalHits, ...regexHits]
    .filter((marker, index, markers) => markers.indexOf(marker) === index);
}

function detectUserIntent(text) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  return userIntentMarkers
    .filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')))
    .filter((marker, index, markers) => markers.indexOf(marker) === index);
}

function titleIntentVerdict(pathName, title, h1s, markers) {
  if (markers.length > 0) {
    return 'FAIL_INTERNAL_BUSINESS_LANGUAGE';
  }

  if (publicBusinessAudiencePaths.has(pathName)) {
    return 'PUBLIC_BUSINESS_AUDIENCE_REVIEW';
  }

  const headingUserIntent = detectUserIntent([title, ...h1s].join(' '));
  if (headingUserIntent.length > 0) {
    return 'USER_LEGAL_HELP_ORIENTED';
  }

  return 'REVIEW_TITLE_H1_INTENT';
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

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Jus-Tice-Public-Business-Language-Audit/1.0',
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function inspectPath(baseUrl, pathOrUrl) {
  const url = absoluteUrl(baseUrl, `${pathOrUrl}${pathOrUrl.includes('?') ? '&' : '?'}business_language_audit=${Date.now()}`);

  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const title = extractTag(html, 'title');
    const h1s = extractAllTags(html, 'h1');
    const h2s = extractAllTags(html, 'h2');
    const visibleText = stripTags(html);
    const scannedText = [title, ...h1s, ...h2s, visibleText].join('\n');
    const markers = detectMarkers(scannedText);
    const finalPath = new URL(response.url).pathname;
    const requestedPath = new URL(absoluteUrl(baseUrl, pathOrUrl)).pathname;
    const surfaceVerdict = titleIntentVerdict(requestedPath, title, h1s, markers);
    const titleIntentHits = detectUserIntent([title, ...h1s].join(' '));
    const issues = [];

    if (response.status !== 200) {
      issues.push(`http_${response.status}`);
    }
    if (finalPath !== requestedPath) {
      issues.push(`final_path_${finalPath}`);
    }
    if (markers.length > 0) {
      issues.push('internal_business_language');
    }
    if (surfaceVerdict === 'REVIEW_TITLE_H1_INTENT') {
      issues.push('title_h1_intent_review');
    }

    return {
      path: requestedPath,
      url: absoluteUrl(baseUrl, requestedPath),
      status: issues.length ? 'REVIEW' : 'VERIFIED',
      http_status: response.status,
      final_url: response.url,
      title,
      h1: h1s.join(' | '),
      h1_count: h1s.length,
      h2_sample: h2s.slice(0, 6).join(' | '),
      surface_verdict: surfaceVerdict,
      title_h1_user_intent_hits: titleIntentHits.join(' | ') || '-',
      marker_hits: markers.join(' | ') || '-',
      issues: issues.join(';') || '-',
      next_step: markers.length > 0
        ? 'Replace internal business-plan language with user legal-help intent before relying on this page publicly.'
        : surfaceVerdict === 'REVIEW_TITLE_H1_INTENT'
          ? 'Manually verify that title and H1 speak to the reader legal problem, not an internal plan.'
        : 'Keep in normal public QA rotation.',
    };
  } catch (error) {
    return {
      path: new URL(absoluteUrl(baseUrl, pathOrUrl)).pathname,
      url: absoluteUrl(baseUrl, pathOrUrl),
      status: 'REVIEW',
      http_status: 0,
      final_url: '',
      title: '',
      h1: '',
      h1_count: 0,
      h2_sample: '',
      surface_verdict: 'FETCH_REVIEW',
      title_h1_user_intent_hits: '-',
      marker_hits: '-',
      issues: error instanceof Error ? error.message : String(error),
      next_step: 'Retry live read-only fetch before publishing related content.',
    };
  }
}

function duplicateRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (row.http_status !== 200 || !row.title || !row.h1) {
      continue;
    }
    const key = `${row.title}|||${row.h1}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(row.path);
  }

  return [...groups.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([key, paths], index) => {
      const [title, h1] = key.split('|||');
      return {
        duplicate_id: `DUP-${String(index + 1).padStart(3, '0')}`,
        status: 'REVIEW',
        paths: paths.join(' | '),
        title,
        h1,
        next_step: 'Review association/cannibalization. If both pages must stay, clarify intent and internal links before any URL/canonical decision.',
      };
    });
}

function markdownReport(rows, duplicates, reportDate, baseUrl) {
  const reviewRows = rows.filter((row) => row.status !== 'VERIFIED');
  const markerRows = rows.filter((row) => row.marker_hits !== '-');

  const lines = [
    `# Live Public Business-Language Audit - ${reportDate}`,
    '',
    `Status: ${markerRows.length === 0 ? 'VERIFIED_NO_INTERNAL_BUSINESS_LANGUAGE_FOUND' : 'REVIEW_INTERNAL_LANGUAGE_FOUND'}`,
    '',
    `Base URL: ${baseUrl}`,
    '',
    'Scope: read-only live scan of already-published public pages. This does not log in, publish, edit CMS records, change URLs, redirects, canonicals, noindex, sitemaps or taxonomies.',
    '',
    '## Page Results',
    '',
    '| Path | Status | HTTP | Surface Verdict | Title | H1 | User-Intent Hits | Marker Hits | Issues |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) => `| ${row.path} | ${row.status} | ${row.http_status} | ${row.surface_verdict} | ${row.title.replace(/\|/g, '/')} | ${row.h1.replace(/\|/g, '/')} | ${row.title_h1_user_intent_hits.replace(/\|/g, '/')} | ${row.marker_hits.replace(/\|/g, '/')} | ${row.issues.replace(/\|/g, '/')} |`
    ),
    '',
    '## Duplicate Title/H1 Review',
    '',
  ];

  if (duplicates.length === 0) {
    lines.push('- No duplicate title + H1 pairs found in the sampled pages.');
  } else {
    lines.push('| Group | Paths | Shared Title | Shared H1 | Next Step |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const duplicate of duplicates) {
      lines.push(`| ${duplicate.duplicate_id} | ${duplicate.paths.replace(/\|/g, '<br>')} | ${duplicate.title.replace(/\|/g, '/')} | ${duplicate.h1.replace(/\|/g, '/')} | ${duplicate.next_step} |`);
    }
  }

  lines.push(
    '',
    '## Interpretation',
    '',
    markerRows.length === 0
      ? '- The sampled live pages did not expose internal revenue/business-plan language.'
      : '- At least one sampled live page exposes internal business-plan language and should be manually reviewed before more traffic is sent to it.',
    rows.every((row) => row.surface_verdict !== 'REVIEW_TITLE_H1_INTENT')
      ? '- Every successful sampled title/H1 had legal-help user intent or an explicitly business-audience review classification.'
      : '- At least one sampled title/H1 needs manual reader-intent review even without a hard internal-language marker.',
    reviewRows.length === 0
      ? '- All sampled URLs returned the expected 200 path.'
      : '- Some sampled URLs need review because of HTTP/path/internal-language issues.',
    '- The new publish gate protects future saves only. Already-published CMS content still needs read-only audits like this one.',
    ''
  );

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-live-public-business-language.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il] [--path=/some-page/]');
  process.exit(0);
}

const rows = [];
for (const pathOrUrl of args.paths) {
  rows.push(await inspectPath(args.baseUrl, pathOrUrl));
}

const duplicates = duplicateRows(rows);
const outputs = outputFiles(args.reportDate);
const columns = ['path', 'url', 'status', 'http_status', 'final_url', 'title', 'h1', 'h1_count', 'h2_sample', 'surface_verdict', 'title_h1_user_intent_hits', 'marker_hits', 'issues', 'next_step'];
const duplicateColumns = ['duplicate_id', 'status', 'paths', 'title', 'h1', 'next_step'];

writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ rows, duplicates }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, duplicates, args.reportDate, args.baseUrl));

console.table(rows.map(({ path, status, http_status, surface_verdict, marker_hits, issues }) => ({ path, status, http_status, surface_verdict, marker_hits, issues })));
if (duplicates.length > 0) {
  console.log(toCsv(duplicates, duplicateColumns));
}
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (rows.some((row) => row.marker_hits !== '-')) {
  process.exitCode = 1;
}
