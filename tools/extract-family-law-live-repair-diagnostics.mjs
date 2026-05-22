import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const pages = [
  {
    id: 'FLR-DIAG-PILLAR-LONG',
    path: '/lawyer-divorce-guide-proceedings-costs-rights/',
    priority: 'CRITICAL',
    operatorHint: 'Record exact H1s and preserve current URL until owner/GSC canonical decision.',
  },
  {
    id: 'FLR-DIAG-PILLAR-CLEAN',
    path: '/divorce-lawyer/',
    priority: 'CRITICAL',
    operatorHint: 'Record exact H1s and preserve current URL until owner/GSC canonical decision.',
  },
  {
    id: 'FLR-DIAG-AGREEMENT',
    path: '/divorce-agreement/',
    priority: 'CRITICAL',
    operatorHint: 'Repair raw shortcode/PDF promise first after rollback backup and owner approval.',
  },
  {
    id: 'FLR-DIAG-CHILD-SUPPORT',
    path: '/child-support/',
    priority: 'MEDIUM',
    operatorHint: 'Repair extra H1/template issue on current URL only after backup.',
  },
  {
    id: 'FLR-DIAG-CHILD-CUSTODY',
    path: '/child-custody/',
    priority: 'MEDIUM',
    operatorHint: 'Repair extra H1/template issue on current URL only after backup.',
  },
  {
    id: 'FLR-DIAG-MEDIATION',
    path: '/divorce-mediation/',
    priority: 'MEDIUM',
    operatorHint: 'Repair extra H1/template issue on current URL only after backup.',
  },
];

const pdfCandidates = [
  '/wp-content/uploads/divorce-agreement-template-2025.pdf',
  '/wp-content/uploads/2025/05/divorce-agreement-template-2025.pdf',
  '/wp-content/uploads/2026/05/divorce-agreement-template-2025.pdf',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    baseUrl: BASE_URL,
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
  const base = `family-law-live-repair-diagnostics-${reportDate}`;
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
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripTags(value) {
  return normalizeWhitespace(decodeEntities(String(value || '').replace(/<[^>]+>/g, ' ')));
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripTags(match[1]) : '';
}

function extractAllTags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? match[1] : '';
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

function extractPdfLinks(html, baseUrl) {
  return [...new Set(extractHrefs(html)
    .filter((href) => /\.pdf(?:$|[?#])/i.test(href) || /divorce-agreement-template/i.test(href))
    .map((href) => absoluteUrl(baseUrl, href)))];
}

function rawShortcodeTokens(html) {
  return ['justice_pdf_download', 'justice_contact_form'].filter((token) => html.includes(token));
}

function shortcodeContexts(html) {
  const contexts = [];
  rawShortcodeTokens(html).forEach((token) => {
    const index = html.indexOf(token);
    if (index === -1) return;
    const start = Math.max(0, index - 140);
    const end = Math.min(html.length, index + token.length + 140);
    contexts.push(stripTags(html.slice(start, end)).slice(0, 320));
  });
  return contexts;
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
        'User-Agent': 'Jus-Tice-Family-Law-Live-Repair-Diagnostics/1.0',
        Accept: accept,
        'Cache-Control': 'no-cache',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function inspectPage(baseUrl, page) {
  const url = absoluteUrl(baseUrl, page.path);
  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const h1Texts = extractAllTags(html, 'h1');
    const shortcodeTokens = rawShortcodeTokens(html);
    const pdfLinks = extractPdfLinks(html, baseUrl);
    const issues = [];

    if (response.status !== 200) issues.push(`http_${response.status}`);
    if (h1Texts.length !== 1) issues.push(`h1_count_${h1Texts.length}`);
    if (shortcodeTokens.length) issues.push(`raw_shortcodes_${shortcodeTokens.join('|')}`);
    if (html.includes('\uFFFD')) issues.push('replacement_character_detected');

    return {
      diagnostic_id: page.id,
      row_type: 'html_page',
      priority: page.priority,
      target_path: page.path,
      target_url: url,
      http_status: response.status,
      final_url: response.url,
      content_type: contentType,
      content_length: response.headers.get('content-length') || '',
      title: extractTag(html, 'title'),
      canonical: extractCanonical(html),
      robots: extractRobots(html),
      h1_count: h1Texts.length,
      h1_texts: h1Texts.join(' || '),
      raw_shortcode_tokens: shortcodeTokens.join('|'),
      shortcode_contexts: shortcodeContexts(html).join(' || '),
      pdf_links: pdfLinks.join('|'),
      issues: issues.join(';') || '-',
      operator_hint: page.operatorHint,
    };
  } catch (error) {
    return {
      diagnostic_id: page.id,
      row_type: 'html_page',
      priority: page.priority,
      target_path: page.path,
      target_url: url,
      http_status: 0,
      final_url: '',
      content_type: '',
      content_length: '',
      title: '',
      canonical: '',
      robots: '',
      h1_count: 0,
      h1_texts: '',
      raw_shortcode_tokens: '',
      shortcode_contexts: '',
      pdf_links: '',
      issues: `fetch_error_${error.name || 'unknown'}`,
      operator_hint: page.operatorHint,
    };
  }
}

async function inspectPdf(baseUrl, candidatePath, index) {
  const url = absoluteUrl(baseUrl, candidatePath);
  try {
    const response = await fetchWithTimeout(url, 'application/pdf,*/*;q=0.8');
    const contentType = response.headers.get('content-type') || '';
    const issues = [];
    if (response.status !== 200) issues.push(`http_${response.status}`);
    if (response.status === 200 && !contentType.toLowerCase().includes('pdf')) {
      issues.push(`content_type_${contentType || 'missing'}`);
    }

    return {
      diagnostic_id: `FLR-DIAG-PDF-${index}`,
      row_type: 'pdf_candidate',
      priority: 'CRITICAL',
      target_path: candidatePath,
      target_url: url,
      http_status: response.status,
      final_url: response.url,
      content_type: contentType,
      content_length: response.headers.get('content-length') || '',
      title: '',
      canonical: '',
      robots: '',
      h1_count: '',
      h1_texts: '',
      raw_shortcode_tokens: '',
      shortcode_contexts: '',
      pdf_links: '',
      issues: issues.join(';') || '-',
      operator_hint: 'PDF CTA may remain only if one candidate returns 200 with PDF content type.',
    };
  } catch (error) {
    return {
      diagnostic_id: `FLR-DIAG-PDF-${index}`,
      row_type: 'pdf_candidate',
      priority: 'CRITICAL',
      target_path: candidatePath,
      target_url: url,
      http_status: 0,
      final_url: '',
      content_type: '',
      content_length: '',
      title: '',
      canonical: '',
      robots: '',
      h1_count: '',
      h1_texts: '',
      raw_shortcode_tokens: '',
      shortcode_contexts: '',
      pdf_links: '',
      issues: `fetch_error_${error.name || 'unknown'}`,
      operator_hint: 'PDF CTA may remain only if one candidate returns 200 with PDF content type.',
    };
  }
}

function buildSummary(rows) {
  const htmlRows = rows.filter((row) => row.row_type === 'html_page');
  const pdfRows = rows.filter((row) => row.row_type === 'pdf_candidate');
  const rowsWithIssues = rows.filter((row) => row.issues !== '-');
  const rawShortcodeRows = htmlRows.filter((row) => row.raw_shortcode_tokens);
  const h1IssueRows = htmlRows.filter((row) => Number(row.h1_count) !== 1);
  const workingPdfRows = pdfRows.filter((row) => Number(row.http_status) === 200 && String(row.content_type).toLowerCase().includes('pdf'));

  return {
    total_rows: rows.length,
    html_rows: htmlRows.length,
    pdf_rows: pdfRows.length,
    rows_with_issues: rowsWithIssues.length,
    h1_issue_rows: h1IssueRows.length,
    raw_shortcode_rows: rawShortcodeRows.length,
    working_pdf_candidates: workingPdfRows.length,
    public_change_status: 'NO_PUBLIC_CHANGES_READ_ONLY_DIAGNOSTICS',
  };
}

function buildMarkdown(reportDate, rows, summary) {
  const htmlRows = rows.filter((row) => row.row_type === 'html_page');
  const pdfRows = rows.filter((row) => row.row_type === 'pdf_candidate');
  const h1IssueRows = htmlRows.filter((row) => Number(row.h1_count) !== 1);
  const rawShortcodeRows = htmlRows.filter((row) => row.raw_shortcode_tokens);

  const lines = [
    `# Family Law Live Repair Diagnostics - ${reportDate}`,
    '',
    '## Status',
    '',
    '- VERIFIED LIVE READ-ONLY: this diagnostic fetches public URLs only.',
    `- HTML PAGES: ${summary.html_rows}.`,
    `- PDF CANDIDATES: ${summary.pdf_rows}.`,
    `- ROWS WITH ISSUES: ${summary.rows_with_issues}/${summary.total_rows}.`,
    `- H1 ISSUE ROWS: ${summary.h1_issue_rows}.`,
    `- RAW SHORTCODE ROWS: ${summary.raw_shortcode_rows}.`,
    `- WORKING PDF CANDIDATES: ${summary.working_pdf_candidates}.`,
    '- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.',
    '',
    '## H1 Diagnostics',
    '',
  ];

  h1IssueRows.forEach((row) => {
    lines.push(`- ${row.target_path}: h1_count_${row.h1_count}; H1 texts: ${row.h1_texts || '(none detected)'}`);
  });

  if (!h1IssueRows.length) lines.push('- No H1 issues detected.');

  lines.push('', '## Raw Shortcode Diagnostics', '');
  rawShortcodeRows.forEach((row) => {
    lines.push(`- ${row.target_path}: ${row.raw_shortcode_tokens}; context: ${row.shortcode_contexts || '(no context)'}`);
  });
  if (!rawShortcodeRows.length) lines.push('- No raw shortcode tokens detected.');

  lines.push('', '## PDF Candidates', '');
  pdfRows.forEach((row) => {
    lines.push(`- ${row.target_url}: HTTP ${row.http_status}; content-type: ${row.content_type || '-'}; issues: ${row.issues}`);
  });

  lines.push(
    '',
    '## Next',
    '',
    '1. Use this report to identify the exact body/template headings to repair after owner approval and CMS rollback backup.',
    '2. Repair `/divorce-agreement/` raw shortcode/PDF promise before marking the page final.',
    '3. Keep divorce-lawyer canonical/redirect/noindex/sitemap decisions blocked until focused GSC export and owner decision.',
    '4. Rerun `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD` after approved public repair.',
    ''
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/extract-family-law-live-repair-diagnostics.mjs --reportDate=YYYY-MM-DD [--baseUrl=https://jus-tice.co.il]');
    return;
  }

  const pageRows = await Promise.all(pages.map((page) => inspectPage(args.baseUrl, page)));
  const pdfRows = await Promise.all(pdfCandidates.map((candidate, index) => inspectPdf(args.baseUrl, candidate, index + 1)));
  const rows = [...pageRows, ...pdfRows];
  const summary = buildSummary(rows);
  const files = outputFiles(args.reportDate);
  const columns = [
    'diagnostic_id',
    'row_type',
    'priority',
    'target_path',
    'target_url',
    'http_status',
    'final_url',
    'content_type',
    'content_length',
    'title',
    'canonical',
    'robots',
    'h1_count',
    'h1_texts',
    'raw_shortcode_tokens',
    'shortcode_contexts',
    'pdf_links',
    'issues',
    'operator_hint',
  ];
  const csv = toCsv(rows, columns);
  const json = JSON.stringify({
    reportDate: args.reportDate,
    generated_at: new Date().toISOString(),
    baseUrl: args.baseUrl,
    summary,
    rows,
  }, null, 2);

  writeText(files.reportCsv, csv);
  writeText(files.projectCsv, csv);
  writeText(files.reportJson, json);
  writeText(files.projectMd, buildMarkdown(args.reportDate, rows, summary));

  console.log(JSON.stringify({
    reportDate: args.reportDate,
    generated_at: new Date().toISOString(),
    summary,
    outputs: files,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
