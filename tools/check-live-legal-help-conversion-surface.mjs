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
  '/lawyers/',
  '/find-lawyer-how-to-find-good-attorney/',
  '/national-insurance-attorney/',
  '/bituach-leumi-appeal-guide/',
  '/criminal-defense-attorney/',
  '/medical-malpractice-lawyer/',
  '/real-estate-lawyer-guide/',
];

const pageRoles = new Map([
  ['/', 'homepage'],
  ['/lawyers/', 'lawyer-directory'],
  ['/find-lawyer-how-to-find-good-attorney/', 'selection-guide'],
  ['/national-insurance-attorney/', 'practice-lawyer-match'],
  ['/bituach-leumi-appeal-guide/', 'guide-calculator'],
  ['/criminal-defense-attorney/', 'practice-lawyer-match'],
  ['/medical-malpractice-lawyer/', 'practice-lawyer-match'],
  ['/real-estate-lawyer-guide/', 'guide-practice'],
]);

const associatedPages = new Map([
  ['/', '/lawyers/ | /find-lawyer-how-to-find-good-attorney/ | /national-insurance-attorney/'],
  ['/lawyers/', '/find-lawyer-how-to-find-good-attorney/ | practice pages'],
  ['/find-lawyer-how-to-find-good-attorney/', '/lawyers/ | homepage lawyer search'],
  ['/national-insurance-attorney/', '/bituach-leumi-appeal-guide/ (split: lawyer-match vs guide/calculator)'],
  ['/bituach-leumi-appeal-guide/', '/national-insurance-attorney/ (split: guide/calculator vs lawyer-match)'],
  ['/criminal-defense-attorney/', '/lawyers/ | criminal articles'],
  ['/medical-malpractice-lawyer/', '/lawyers/ | medical malpractice articles'],
  ['/real-estate-lawyer-guide/', '/lawyers/ | real-estate attorney pages | purchase-tax/seller-tax tools if approved'],
]);

const internalBusinessMarkers = [
  'revenue',
  'lead fee',
  'qualified lead fee',
  'lawyers pay',
  'lawyer pays',
  'lead partner',
  'grow/meshulam',
  'meshulam',
  'morning plugin',
  'upress',
  'linear',
  'investor',
  'payment proof',
  'provider setup',
  'supplier smart-match',
  'bid readiness',
  'owner-only',
  'business plan',
  'מסלול הכנסה',
  'מודל הכנסה',
  'מודל הכנסות',
  'הכנסה ל-jus-tice',
  'לידים בתשלום',
  'עורכי דין משלמים',
  'מבחינה עסקית',
  'בעל האתר',
  'מדדי הצלחה',
  'חסמי פרסום',
  'קניבליזציה',
  'למה זה מסלול',
];

const userHelpMarkers = [
  'עורך דין',
  'עו"ד',
  'ייעוץ',
  'בדיקה',
  'פנייה',
  'השאירו פרטים',
  'מצאו',
  'השוואה',
  'זכויות',
  'תביעה',
  'ערעור',
  'מסמכים',
  'טלפון',
  'וואטסאפ',
  'lawyer',
  'attorney',
  'legal help',
  'contact',
];

const ctaMarkers = [
  'פנייה',
  'צרו קשר',
  'שיחה',
  'בדיקה',
  'מצאו',
  'השאירו',
  'שליחה',
  'וואטסאפ',
  'טלפון',
  'ייעוץ',
  'contact',
  'lawyer',
  'attorney',
];

const lawyerAcquisitionMarkers = [
  'הצטרפו',
  'תוכניות עורכי דין',
  'מידע לעורכי דין',
  'בקשת בדיקת פרופיל',
  'פרופיל מקצועי',
  'lawyer plans',
  'join',
];

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
  const base = `live-legal-help-conversion-surface-${reportDate}`;
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

function detectMarkers(text, markers) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  return markers
    .filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')))
    .filter((marker, index, list) => list.indexOf(marker) === index);
}

function countMarkerHits(text, markers) {
  return detectMarkers(text, markers).length;
}

function extractLinks(html) {
  return [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    const attrs = match[1] || '';
    const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    return {
      href: hrefMatch ? hrefMatch[1] : '',
      text: stripTags(match[2]),
    };
  });
}

function countCtaLinks(links) {
  return links.filter((link) => {
    const combined = `${link.href} ${link.text}`.toLocaleLowerCase('he-IL');
    return (
      combined.includes('tel:') ||
      combined.includes('wa.me') ||
      combined.includes('whatsapp') ||
      combined.includes('/contact') ||
      combined.includes('/lawyers') ||
      combined.includes('/find-lawyer') ||
      combined.includes('lead_area') ||
      detectMarkers(combined, ctaMarkers).length > 0
    );
  }).length;
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
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Jus-Tice live QA / legal-help conversion surface',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function inspectPath(baseUrl, pathOrUrl) {
  const requestedPath = new URL(absoluteUrl(baseUrl, pathOrUrl)).pathname;
  const url = absoluteUrl(baseUrl, `${requestedPath}?legal_help_surface_audit=${Date.now()}`);

  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const title = extractTag(html, 'title');
    const h1s = extractAllTags(html, 'h1');
    const h2s = extractAllTags(html, 'h2');
    const visibleText = stripTags(html);
    const firstScreenText = visibleText.slice(0, 2200);
    const links = extractLinks(html);
    const finalPath = new URL(response.url).pathname;
    const internalHits = detectMarkers([title, ...h1s, ...h2s, visibleText].join('\n'), internalBusinessMarkers);
    const userHelpCount = countMarkerHits(visibleText, userHelpMarkers);
    const firstScreenUserHelpCount = countMarkerHits(firstScreenText, userHelpMarkers);
    const firstScreenLawyerAcquisitionHits = detectMarkers(firstScreenText, lawyerAcquisitionMarkers);
    const ctaLinkCount = countCtaLinks(links);
    const issues = [];

    if (response.status !== 200) {
      issues.push(`http_${response.status}`);
    }
    if (finalPath !== requestedPath) {
      issues.push(`final_path_${finalPath}`);
    }
    if (!title) {
      issues.push('missing_title');
    }
    if (h1s.length === 0) {
      issues.push('missing_h1');
    }
    if (internalHits.length > 0) {
      issues.push('internal_business_language');
    }
    if (userHelpCount === 0) {
      issues.push('no_legal_help_markers');
    }
    if (ctaLinkCount === 0) {
      issues.push('no_detected_user_cta_links');
    }

    return {
      path: requestedPath,
      role: pageRoles.get(requestedPath) || 'public-route',
      status: issues.length ? 'REVIEW' : 'VERIFIED',
      http_status: response.status,
      final_url: response.url,
      title,
      h1: h1s.join(' | '),
      h1_count: h1s.length,
      h2_sample: h2s.slice(0, 5).join(' | '),
      user_help_marker_count: userHelpCount,
      first_screen_user_help_count: firstScreenUserHelpCount,
      cta_link_count: ctaLinkCount,
      internal_marker_hits: internalHits.join(' | ') || '-',
      first_screen_lawyer_acquisition_hits: firstScreenLawyerAcquisitionHits.join(' | ') || '-',
      associated_pages: associatedPages.get(requestedPath) || '-',
      issues: issues.join(';') || '-',
      next_step: issues.length
        ? 'Review this route before sending more traffic or building adjacent content.'
        : 'Keep as a legal-help surface; review associated pages for internal links before new content work.',
    };
  } catch (error) {
    return {
      path: requestedPath,
      role: pageRoles.get(requestedPath) || 'public-route',
      status: 'REVIEW',
      http_status: 0,
      final_url: '',
      title: '',
      h1: '',
      h1_count: 0,
      h2_sample: '',
      user_help_marker_count: 0,
      first_screen_user_help_count: 0,
      cta_link_count: 0,
      internal_marker_hits: '-',
      first_screen_lawyer_acquisition_hits: '-',
      associated_pages: associatedPages.get(requestedPath) || '-',
      issues: error instanceof Error ? error.message : String(error),
      next_step: 'Retry the live read-only fetch before taking public action.',
    };
  }
}

function markdownReport(rows, reportDate, baseUrl) {
  const reviewRows = rows.filter((row) => row.status !== 'VERIFIED');
  const internalRows = rows.filter((row) => row.internal_marker_hits !== '-');
  const associatedRows = rows.filter((row) => row.associated_pages !== '-');
  const status = reviewRows.length === 0
    ? 'VERIFIED_LEGAL_HELP_SURFACES'
    : 'REVIEW_REQUIRED';

  const lines = [
    `# Live Legal-Help Conversion Surface Audit - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Base URL: ${baseUrl}`,
    '',
    'Scope: read-only live route QA for public visitor-facing legal-help pages. This checks customer-first surface signals, internal business-language leakage, detectable legal-help CTAs and associated/synonymous pages for future linkage review.',
    '',
    'Safety: no login, CMS publish, database edit, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, product, payment, invoice, email, WhatsApp, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    '## Page Results',
    '',
    '| Path | Status | HTTP | Role | User Help Markers | CTA Links | Internal Markers | Issues |',
    '| --- | --- | ---: | --- | ---: | ---: | --- | --- |',
    ...rows.map(
      (row) => `| ${row.path} | ${row.status} | ${row.http_status} | ${row.role} | ${row.user_help_marker_count} | ${row.cta_link_count} | ${row.internal_marker_hits.replace(/\|/g, '/')} | ${row.issues.replace(/\|/g, '/')} |`
    ),
    '',
    '## Associated / Potentially Synonymous Pages',
    '',
  ];

  if (associatedRows.length === 0) {
    lines.push('- No associated page pairs were mapped for this sample.');
  } else {
    lines.push('| Page | Role | Associated Pages | Recommended Linkage Review |');
    lines.push('| --- | --- | --- | --- |');
    for (const row of associatedRows) {
      lines.push(`| ${row.path} | ${row.role} | ${row.associated_pages.replace(/\|/g, '<br>')} | Keep intent split clear before new internal links or content expansions. |`);
    }
  }

  lines.push(
    '',
    '## Interpretation',
    '',
    internalRows.length === 0
      ? '- No internal revenue/business-plan markers were found in the sampled public surfaces.'
      : '- At least one sampled surface contains internal business language and should be corrected before more traffic is sent to it.',
    reviewRows.length === 0
      ? '- Every sampled route returned the expected path, had title/H1 signals, contained legal-help language and exposed detectable user CTAs.'
      : '- One or more sampled routes needs review before adjacent page work.',
    '- The Bituach Leumi pair should remain split by intent: `/national-insurance-attorney/` for lawyer matching and `/bituach-leumi-appeal-guide/` for guide/calculator intent unless owner/SEO approves a different strategy.',
    ''
  );

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-live-legal-help-conversion-surface.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il] [--path=/some-page/]');
  process.exit(0);
}

const rows = [];
for (const pathOrUrl of args.paths) {
  rows.push(await inspectPath(args.baseUrl, pathOrUrl));
}

const outputs = outputFiles(args.reportDate);
const columns = [
  'path',
  'role',
  'status',
  'http_status',
  'final_url',
  'title',
  'h1',
  'h1_count',
  'h2_sample',
  'user_help_marker_count',
  'first_screen_user_help_count',
  'cta_link_count',
  'internal_marker_hits',
  'first_screen_lawyer_acquisition_hits',
  'associated_pages',
  'issues',
  'next_step',
];

writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.reportDate, args.baseUrl));

console.table(rows.map(({ path, status, http_status, user_help_marker_count, cta_link_count, internal_marker_hits, issues }) => ({
  path,
  status,
  http_status,
  user_help_marker_count,
  cta_link_count,
  internal_marker_hits,
  issues,
})));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (rows.some((row) => row.status !== 'VERIFIED')) {
  process.exitCode = 1;
}
