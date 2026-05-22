import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const htmlChecks = [
  {
    id: 'FAM-LIVE-PILLAR-LONG',
    scope: 'divorce_pillar_candidate',
    path: '/lawyer-divorce-guide-proceedings-costs-rights/',
    risk: 'CRITICAL',
    expected: 'Existing live page must not compete with canonical divorce-lawyer target without owner/GSC decision.',
  },
  {
    id: 'FAM-LIVE-PILLAR-CLEAN',
    scope: 'divorce_pillar_candidate',
    path: '/divorce-lawyer/',
    risk: 'CRITICAL',
    expected: 'Planned clean pillar must be protected until owner/GSC decision.',
  },
  {
    id: 'FAM-LIVE-AGREEMENT',
    scope: 'divorce_agreement_support',
    path: '/divorce-agreement/',
    risk: 'CRITICAL',
    expected: 'Agreement support page must render public UI without raw shortcodes and with a working PDF path.',
  },
  {
    id: 'FAM-LIVE-CHILD-SUPPORT',
    scope: 'support_link',
    path: '/child-support/',
    risk: 'MEDIUM',
    expected: 'Internal support link should resolve and remain indexable until final cluster decisions.',
  },
  {
    id: 'FAM-LIVE-CHILD-CUSTODY',
    scope: 'support_link',
    path: '/child-custody/',
    risk: 'MEDIUM',
    expected: 'Internal support link should resolve and remain indexable until final cluster decisions.',
  },
  {
    id: 'FAM-LIVE-MEDIATION',
    scope: 'support_link',
    path: '/divorce-mediation/',
    risk: 'MEDIUM',
    expected: 'Internal support link should resolve and remain indexable until final cluster decisions.',
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
  const base = `family-law-live-safety-check-${reportDate}`;
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

function normalizePathname(value) {
  const pathname = String(value || '/');
  if (pathname === '/') return '/';
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return '/';
  const last = trimmed.split('/').at(-1) || '';
  return `/${trimmed}${last.includes('.') ? '' : '/'}`;
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? normalizeWhitespace(match[1].replace(/<[^>]+>/g, ' ')) : '';
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match ? match[1] : '';
}

function extractRobots(html) {
  return [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/gi)]
    .map((match) => match[1].toLowerCase())
    .join('|');
}

function h1Count(html) {
  return (html.match(/<h1\b/gi) || []).length;
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

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Jus-Tice-Family-Law-Live-Safety/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkHtmlPage(baseUrl, check) {
  const url = absoluteUrl(baseUrl, check.path);
  const expectedPath = normalizePathname(new URL(url).pathname);
  const issues = [];

  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const finalPath = normalizePathname(new URL(response.url).pathname);
    const canonical = extractCanonical(html);
    const robots = extractRobots(html);
    const countH1 = h1Count(html);
    const rawShortcodes = ['justice_pdf_download', 'justice_contact_form']
      .filter((token) => html.includes(token))
      .join('|');
    const hebrewCount = (html.match(/[\u0590-\u05FF]/g) || []).length;

    if (response.status !== 200) issues.push(`http_${response.status}`);
    if (finalPath !== expectedPath) issues.push(`final_path_${finalPath}`);
    if (robots.includes('noindex')) issues.push('noindex_present');
    if (countH1 !== 1) issues.push(`h1_count_${countH1}`);
    if (rawShortcodes) issues.push(`raw_shortcodes_${rawShortcodes}`);
    if (html.includes('\uFFFD')) issues.push('replacement_character_detected');
    if (contentType.toLowerCase().includes('text/html') && hebrewCount < 100) issues.push(`low_hebrew_count_${hebrewCount}`);

    return {
      check_id: check.id,
      scope: check.scope,
      url,
      path: check.path,
      status: issues.length ? 'BLOCKED_OR_REVIEW' : 'VERIFIED',
      risk: check.risk,
      http_status: response.status,
      final_url: response.url,
      title: extractTag(html, 'title'),
      h1: extractTag(html, 'h1'),
      h1_count: countH1,
      canonical,
      robots,
      raw_shortcode_tokens: rawShortcodes,
      hebrew_count: hebrewCount,
      issues: issues.join(';') || '-',
      expected: check.expected,
      next_step: issues.length ? 'Review and repair before Family upload is marked live-safe.' : 'Keep as verified read-only baseline.',
    };
  } catch (error) {
    return {
      check_id: check.id,
      scope: check.scope,
      url,
      path: check.path,
      status: 'BLOCKED_OR_REVIEW',
      risk: check.risk,
      http_status: 0,
      final_url: '',
      title: '',
      h1: '',
      h1_count: 0,
      canonical: '',
      robots: '',
      raw_shortcode_tokens: '',
      hebrew_count: 0,
      issues: error instanceof Error ? error.message : String(error),
      expected: check.expected,
      next_step: 'Rerun live read-only check; investigate network or route failure.',
    };
  }
}

async function checkPdfCandidates(baseUrl) {
  const rows = [];
  for (const candidatePath of pdfCandidates) {
    const url = absoluteUrl(baseUrl, candidatePath);
    try {
      const response = await fetchWithTimeout(url);
      const contentType = response.headers.get('content-type') || '';
      rows.push({
        check_id: `FAM-LIVE-PDF-${rows.length + 1}`,
        scope: 'pdf_asset_candidate',
        url,
        path: candidatePath,
        status: response.status === 200 && contentType.toLowerCase().includes('pdf') ? 'VERIFIED' : 'BLOCKED_OR_REVIEW',
        risk: 'CRITICAL',
        http_status: response.status,
        final_url: response.url,
        title: '',
        h1: '',
        h1_count: '',
        canonical: '',
        robots: '',
        raw_shortcode_tokens: '',
        hebrew_count: '',
        issues: response.status === 200 ? `content_type_${contentType || 'missing'}` : `http_${response.status}`,
        expected: 'At least one referenced divorce agreement PDF asset path should return a PDF before public CTA is final.',
        next_step: 'Upload/verify the PDF asset or remove the public PDF promise.',
      });
    } catch (error) {
      rows.push({
        check_id: `FAM-LIVE-PDF-${rows.length + 1}`,
        scope: 'pdf_asset_candidate',
        url,
        path: candidatePath,
        status: 'BLOCKED_OR_REVIEW',
        risk: 'CRITICAL',
        http_status: 0,
        final_url: '',
        title: '',
        h1: '',
        h1_count: '',
        canonical: '',
        robots: '',
        raw_shortcode_tokens: '',
        hebrew_count: '',
        issues: error instanceof Error ? error.message : String(error),
        expected: 'At least one referenced divorce agreement PDF asset path should return a PDF before public CTA is final.',
        next_step: 'Rerun live read-only check; investigate network or media route failure.',
      });
    }
  }
  return rows;
}

function addClusterRows(rows) {
  const pillarRows = rows.filter((row) => row.scope === 'divorce_pillar_candidate');
  const indexablePillars = pillarRows.filter((row) => (
    Number(row.http_status) === 200
    && !String(row.robots).includes('noindex')
    && String(row.canonical).includes(row.path)
  ));
  rows.push({
    check_id: 'FAM-LIVE-CANONICAL-CONFLICT',
    scope: 'cluster_decision_gate',
    url: indexablePillars.map((row) => row.url).join('|'),
    path: indexablePillars.map((row) => row.path).join('|'),
    status: indexablePillars.length > 1 ? 'BLOCKED_OR_REVIEW' : 'VERIFIED',
    risk: 'CRITICAL',
    http_status: '',
    final_url: '',
    title: '',
    h1: '',
    h1_count: '',
    canonical: indexablePillars.map((row) => row.canonical).join('|'),
    robots: indexablePillars.map((row) => row.robots).join('|'),
    raw_shortcode_tokens: '',
    hebrew_count: '',
    issues: indexablePillars.length > 1 ? `indexable_self_canonical_pillar_count_${indexablePillars.length}` : '-',
    expected: 'Only one divorce-lawyer pillar URL should be canonical/indexable after owner/GSC decision.',
    next_step: indexablePillars.length > 1
      ? 'Run focused GSC export and owner URL decision before any redirect/canonical/noindex action.'
      : 'Keep monitored until final Family URL strategy is approved.',
  });

  const pdfRows = rows.filter((row) => row.scope === 'pdf_asset_candidate');
  const workingPdfCount = pdfRows.filter((row) => row.status === 'VERIFIED').length;
  rows.push({
    check_id: 'FAM-LIVE-PDF-ASSET-GATE',
    scope: 'cluster_decision_gate',
    url: pdfRows.map((row) => row.url).join('|'),
    path: pdfRows.map((row) => row.path).join('|'),
    status: workingPdfCount > 0 ? 'VERIFIED' : 'BLOCKED_OR_REVIEW',
    risk: 'CRITICAL',
    http_status: '',
    final_url: '',
    title: '',
    h1: '',
    h1_count: '',
    canonical: '',
    robots: '',
    raw_shortcode_tokens: '',
    hebrew_count: '',
    issues: workingPdfCount > 0 ? '-' : 'no_working_pdf_candidate_found',
    expected: 'Divorce agreement PDF promise must have a working file or be removed.',
    next_step: workingPdfCount > 0 ? 'Verify public CTA renders the working asset.' : 'Upload/verify PDF or remove PDF CTA before final upload.',
  });
}

function buildSummary(rows) {
  const blockers = rows.filter((row) => row.status === 'BLOCKED_OR_REVIEW');
  const critical = blockers.filter((row) => row.risk === 'CRITICAL');
  return {
    generated_at: new Date().toISOString(),
    total_rows: rows.length,
    verified_rows: rows.filter((row) => row.status === 'VERIFIED').length,
    blocked_or_review_rows: blockers.length,
    critical_blockers: critical.length,
    public_change_status: 'NO_PUBLIC_CHANGES_READ_ONLY_CHECK',
    labels: ['VERIFIED_LIVE_READ_ONLY', 'BLOCKED', 'NOT_EXECUTION'],
  };
}

function buildMarkdown(reportDate, summary, rows) {
  const blocked = rows.filter((row) => row.status === 'BLOCKED_OR_REVIEW');
  const lines = [
    `# Family Law Live Safety Check - ${reportDate}`,
    '',
    '## Status',
    '',
    '- VERIFIED LIVE READ-ONLY: this checker fetches public URLs only.',
    `- VERIFIED ROWS: ${summary.verified_rows}/${summary.total_rows}.`,
    `- BLOCKED / REVIEW ROWS: ${summary.blocked_or_review_rows}/${summary.total_rows}.`,
    `- CRITICAL BLOCKERS: ${summary.critical_blockers}.`,
    '- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.',
    '',
    '## Blockers',
    '',
  ];

  if (!blocked.length) {
    lines.push('- VERIFIED: no blockers found in this read-only run.');
  } else {
    blocked.forEach((row) => {
      lines.push(`- ${row.check_id} / ${row.risk}: ${row.issues} | ${row.next_step}`);
    });
  }

  lines.push(
    '',
    '## Next',
    '',
    '1. Owner decides the divorce-lawyer canonical URL only after focused GSC export.',
    '2. Repair `/divorce-agreement/` raw shortcode rendering and PDF asset before treating the page as final.',
    '3. Rerun this checker after any approved public repair.',
    '',
  );

  return `${lines.join('\n')}\n`;
}

async function run() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const rows = [];
  for (const check of htmlChecks) {
    rows.push(await checkHtmlPage(args.baseUrl, check));
  }
  rows.push(...await checkPdfCandidates(args.baseUrl));
  addClusterRows(rows);

  const summary = buildSummary(rows);
  const files = outputFiles(args.reportDate);
  const columns = [
    'check_id',
    'scope',
    'status',
    'risk',
    'path',
    'url',
    'http_status',
    'final_url',
    'title',
    'h1',
    'h1_count',
    'canonical',
    'robots',
    'raw_shortcode_tokens',
    'hebrew_count',
    'issues',
    'expected',
    'next_step',
  ];
  const csv = toCsv(rows, columns);

  writeText(files.reportCsv, csv);
  writeText(files.projectCsv, csv);
  writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(files.projectMd, buildMarkdown(args.reportDate, summary, rows));

  console.log(JSON.stringify({
    reportDate: args.reportDate,
    ...summary,
    outputs: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value)])),
  }, null, 2));

  if (summary.critical_blockers > 0) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

