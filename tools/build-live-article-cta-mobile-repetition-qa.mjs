import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_URLS = [
  'https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/',
  'https://jus-tice.co.il/most-recommended-family-lawyer/',
  'https://jus-tice.co.il/experienced-family-law-attorney/',
  'https://jus-tice.co.il/domestic-violence/',
  'https://jus-tice.co.il/rabbinical-agreement-approval/',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDedupe: '',
    urls: [],
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDedupe=')) {
      args.sourceDedupe = arg.slice('--sourceDedupe='.length);
    } else if (arg.startsWith('--url=')) {
      args.urls.push(arg.slice('--url='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  args.sourceDedupe = resolveSourceDedupe(args.sourceDedupe, args.reportDate);
  return args;
}

function resolveSourceDedupe(sourcePath, reportDate) {
  if (sourcePath) {
    return path.isAbsolute(sourcePath) ? sourcePath : path.join(ROOT, sourcePath);
  }

  const preferred = path.join(ROOT, '.reports', `live-article-cta-dedupe-${reportDate}.json`);
  if (existsSync(preferred)) {
    return preferred;
  }

  const latest = readdirSync(path.join(ROOT, '.reports'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith('live-article-cta-dedupe-') && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort()
    .at(-1);

  return latest ? path.join(ROOT, '.reports', latest) : preferred;
}

function outputFiles(reportDate) {
  const base = `live-article-cta-mobile-repetition-qa-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readOptionalJson(filePath) {
  if (!existsSync(filePath)) {
    return {
      exists: false,
      path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      status: 'MISSING',
      rows: [],
    };
  }

  const json = JSON.parse(readFileSync(filePath, 'utf8'));
  return {
    exists: true,
    path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    status: json.status || json.summary?.status || 'UNKNOWN',
    rows: Array.isArray(json.rows) ? json.rows : [],
  };
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function countMatches(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)));
}

function textFromHtml(html) {
  return decodeEntities(stripTags(html));
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match ? textFromHtml(match[1]) : '';
}

function extractClassBlocks(html, className) {
  const escapedClass = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockPattern = new RegExp(`<([a-z0-9]+)[^>]*class=["'][^"']*${escapedClass}[^"']*["'][^>]*>[\\s\\S]*?<\\/\\1>`, 'gi');
  return Array.from(html.matchAll(blockPattern)).map((match) => match[0]);
}

function extractButtonTexts(html) {
  const buttonPattern = /<(a|button)[^>]*class=["'][^"']*\bbutton\b[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi;
  return Array.from(html.matchAll(buttonPattern))
    .map((match) => textFromHtml(match[2]))
    .map((text) => text.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function duplicateGroups(values) {
  const counts = new Map();
  for (const value of values) {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      continue;
    }
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([text, count]) => `${text} (${count})`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Jus-Tice live QA / mobile article CTA repetition packet',
      accept: 'text/html,application/xhtml+xml',
    },
  });
  const html = await response.text();
  return { statusCode: response.status, html };
}

function sourceUrls(source, extraUrls) {
  const fromSource = source.rows
    .map((row) => row.url)
    .filter((url) => typeof url === 'string' && /^https:\/\/jus-tice\.co\.il\//.test(url))
    .filter((url) => !url.includes('/wp-content/'));

  return Array.from(new Set([...(fromSource.length ? fromSource : DEFAULT_URLS), ...extraUrls]));
}

async function buildRows(urls) {
  const rows = [];

  for (const url of urls) {
    const { statusCode, html } = await fetchText(url);
    const leadCtaBlocks = extractClassBlocks(html, 'single-article__lead-cta');
    const leadCtaTexts = leadCtaBlocks.map(textFromHtml);
    const leadCtaButtonTexts = leadCtaBlocks.flatMap(extractButtonTexts);
    const sidebarBlocks = extractClassBlocks(html, 'single-article__sidebar-lead-card');
    const sidebarTexts = sidebarBlocks.map(textFromHtml);
    const repeatedLeadCtaTexts = duplicateGroups(leadCtaTexts);
    const repeatedLeadCtaButtons = duplicateGroups(leadCtaButtonTexts);
    const sidebarRepeatsLeadCta = leadCtaTexts.some((leadText) =>
      sidebarTexts.some((sidebarText) => leadText && sidebarText && sidebarText.includes(leadText)),
    );
    const leadCtaCount = countMatches(html, 'single-article__lead-cta');
    const contextualCtaUrlCount = countMatches(html, 'utm_source=article_contextual_cta');
    const duplicateSidebarCount = countMatches(html, 'single-article__sidebar-lead-card--duplicate');
    const hasArticleLayout = html.includes('single-article__layout');
    const hasNoSidebarLayout = html.includes('single-article__layout--no-sidebar');
    const status =
      statusCode === 200
      && hasArticleLayout
      && leadCtaCount <= 1
      && contextualCtaUrlCount <= 1
      && duplicateSidebarCount === 0
      && repeatedLeadCtaTexts.length === 0
      && repeatedLeadCtaButtons.length === 0
      && !sidebarRepeatsLeadCta
        ? 'PASS'
        : 'REVIEW';

    rows.push({
      url,
      status,
      http_status: statusCode,
      title: extractTitle(html),
      lead_cta_count: leadCtaCount,
      contextual_cta_url_count: contextualCtaUrlCount,
      duplicate_sidebar_count: duplicateSidebarCount,
      sidebar_lead_card_count: sidebarBlocks.length,
      no_sidebar_layout: hasNoSidebarLayout ? 'yes' : 'no',
      repeated_lead_cta_text_groups: repeatedLeadCtaTexts.join(' | ') || '-',
      repeated_lead_cta_button_groups: repeatedLeadCtaButtons.join(' | ') || '-',
      sidebar_repeats_after_content_cta: sidebarRepeatsLeadCta ? 'yes' : 'no',
      evidence: `article_layout=${hasArticleLayout}; lead_cta_blocks=${leadCtaBlocks.length}; sidebar_cards=${sidebarBlocks.length}; contextual_cta_urls=${contextualCtaUrlCount}`,
      next_step:
        status === 'PASS'
          ? 'No public change needed for this sampled page; keep as post-deploy proof for the mobile duplicate CTA concern.'
          : 'Inspect this URL visually on mobile before making a public template change.',
    });
  }

  return rows;
}

function buildSummary(reportDate, source, rows) {
  const reviewRows = rows.filter((row) => row.status !== 'PASS');

  return {
    reportDate,
    status: reviewRows.length ? 'ARTICLE_CTA_MOBILE_REPETITION_REVIEW' : 'ARTICLE_CTA_MOBILE_REPETITION_QA_PASS_NO_PUBLIC_CHANGE',
    sourceDedupeReport: source.path,
    sourceDedupeStatus: source.status,
    sourceDedupeRows: source.rows.length,
    sampledUrls: rows.length,
    passCount: rows.length - reviewRows.length,
    reviewCount: reviewRows.length,
    maxLeadCtaCount: Math.max(...rows.map((row) => Number(row.lead_cta_count || 0)), 0),
    maxContextualCtaUrlCount: Math.max(...rows.map((row) => Number(row.contextual_cta_url_count || 0)), 0),
    maxDuplicateSidebarCount: Math.max(...rows.map((row) => Number(row.duplicate_sidebar_count || 0)), 0),
    rowsWithSidebarRepeatingLeadCta: rows.filter((row) => row.sidebar_repeats_after_content_cta === 'yes').length,
    publicChangesApproved: 0,
    cmsChangesApproved: 0,
    seoChangesApproved: 0,
    crmRecordsCreated: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, rows) {
  return [
    `# Live Article CTA Mobile Repetition QA - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: read-only live QA packet for the owner-reported mobile article issue where the same help/request message could appear again while scrolling. It samples live article pages, checks after-content CTA counts, contextual CTA URL counts, duplicate sidebar markers, repeated CTA text groups and sidebar/after-content repetition. It does not publish, edit CMS content, change templates, alter SEO settings, create leads, contact anyone, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Source dedupe report: ${summary.sourceDedupeReport} (${summary.sourceDedupeStatus}, ${summary.sourceDedupeRows} rows).`,
    `- Sampled URLs: ${summary.sampledUrls}.`,
    `- Passed: ${summary.passCount}; review rows: ${summary.reviewCount}.`,
    `- Max after-content CTA count: ${summary.maxLeadCtaCount}.`,
    `- Max contextual article CTA URL count: ${summary.maxContextualCtaUrlCount}.`,
    `- Max duplicate sidebar marker count: ${summary.maxDuplicateSidebarCount}.`,
    `- Sidebar repeats after-content CTA rows: ${summary.rowsWithSidebarRepeatingLeadCta}.`,
    '',
    '## Results',
    '',
    '| URL | Status | HTTP | Lead CTA Count | Contextual URL Count | Duplicate Sidebar Count | Sidebar Cards | No-Sidebar Layout | Repeated CTA Buttons | Sidebar Repeats CTA |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |',
    ...rows.map((row) =>
      `| ${mdCell(row.url)} | ${mdCell(row.status)} | ${mdCell(row.http_status)} | ${mdCell(row.lead_cta_count)} | ${mdCell(row.contextual_cta_url_count)} | ${mdCell(row.duplicate_sidebar_count)} | ${mdCell(row.sidebar_lead_card_count)} | ${mdCell(row.no_sidebar_layout)} | ${mdCell(row.repeated_lead_cta_button_groups)} | ${mdCell(row.sidebar_repeats_after_content_cta)} |`,
    ),
    '',
    '## Review',
    '',
    summary.reviewCount
      ? 'At least one sampled live article still needs mobile visual inspection before deciding on a public template change.'
      : 'The sampled live article pages do not reproduce the repeated-help-message problem: each sampled page has one after-content CTA at most, one contextual CTA URL at most, no duplicate sidebar marker and no sidebar block repeating the after-content CTA.',
    '',
    'This is a proof packet only. If a future mobile screenshot shows a different URL still repeats the message, add that exact URL to this checker before changing the public template.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-live-article-cta-mobile-repetition-qa.mjs [--reportDate=YYYY-MM-DD] [--sourceDedupe=.reports/file.json] [--url=https://jus-tice.co.il/example/]');
  process.exit(0);
}

const source = readOptionalJson(args.sourceDedupe);
const urls = sourceUrls(source, args.urls);
const rows = await buildRows(urls);
const summary = buildSummary(args.reportDate, source, rows);
const files = outputFiles(args.reportDate);
const columns = [
  'url',
  'status',
  'http_status',
  'title',
  'lead_cta_count',
  'contextual_cta_url_count',
  'duplicate_sidebar_count',
  'sidebar_lead_card_count',
  'no_sidebar_layout',
  'repeated_lead_cta_text_groups',
  'repeated_lead_cta_button_groups',
  'sidebar_repeats_after_content_cta',
  'evidence',
  'next_step',
];

writeText(files.projectMd, markdownReport(summary, rows));
writeText(files.projectCsv, toCsv(rows, columns));
writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeText(files.reportCsv, toCsv(rows, columns));

console.log(
  JSON.stringify(
    {
      ...summary,
      files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
    },
    null,
    2,
  ),
);

if (summary.reviewCount > 0) {
  process.exitCode = 1;
}
