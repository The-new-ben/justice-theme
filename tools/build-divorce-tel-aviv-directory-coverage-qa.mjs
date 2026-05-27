import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

const CHECKS = [
  {
    id: 'DIR-01',
    label: 'candidate_practice_param_from_private_packet',
    path: '/lawyers/?city=tel-aviv&practice=family-law',
    expected: 'Should represent Tel Aviv family-law coverage if practice is accepted as an alias.',
  },
  {
    id: 'DIR-02',
    label: 'canonical_area_param_used_by_archive',
    path: '/lawyers/?city=tel-aviv&area=family-law',
    expected: 'Should represent the actual archive-supported Tel Aviv family-law filter.',
  },
  {
    id: 'DIR-03',
    label: 'city_only_control',
    path: '/lawyers/?city=tel-aviv',
    expected: 'Control route for Tel Aviv without practice filter.',
  },
  {
    id: 'DIR-04',
    label: 'family_area_only_control',
    path: '/lawyers/?area=family-law',
    expected: 'Control route for family-law without city filter.',
  },
];

const FIX_PLAN_ROWS = [
  {
    id: 'FIX-01',
    decision: 'parameter_alias_review',
    proposedAction: 'Accept `practice` as a read-only alias for `area` in the lawyer directory filter, or update all internal/private planning URLs to use `area` only.',
    publicImpactIfApproved: 'Existing links with `practice=family-law` would apply the intended practice filter instead of city-only results.',
    blocker: 'Requires owner approval for a public-facing code change and Hebrew public-change email workflow after deployment.',
    forbiddenNow: 'Do not change archive code, links, redirects, canonicals, noindex, sitemaps, taxonomies or CMS content from this private QA packet.',
  },
  {
    id: 'FIX-02',
    decision: 'coverage_count_review',
    proposedAction: 'Use only the canonical `area=family-law` filtered route when checking Tel Aviv family-law/divorce lawyer coverage.',
    publicImpactIfApproved: 'The local divorce page coverage gate will be based on the real filtered directory, not an accidental city-only URL.',
    blocker: 'Still needs wp-admin profile readiness review; public HTML card counts are not enough to prove routable paid/verified coverage.',
    forbiddenNow: 'Do not publish `/divorce-lawyer-tel-aviv/` from public card counts alone.',
  },
  {
    id: 'FIX-03',
    decision: 'draft_gate_update',
    proposedAction: 'Update the divorce Tel Aviv public-draft gate template manually or in the next private packet to use `/lawyers/?city=tel-aviv&area=family-law` as the directory evidence URL.',
    publicImpactIfApproved: 'None if kept private; it only corrects the evidence checklist.',
    blocker: 'GSC, legal/editor and owner approval are still missing.',
    forbiddenNow: 'Do not infer GSC demand or legal suitability from this directory QA.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    baseUrl: DEFAULT_BASE_URL,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length).replace(/\/$/, '');
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
  const base = `divorce-tel-aviv-directory-coverage-qa-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    fixPlanCsv: path.join(ROOT, '.project-control', `divorce-tel-aviv-directory-coverage-fix-plan-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : '';
}

function extractFirstH1(html) {
  const match = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripHtml(match[1]) : '';
}

function countMatches(text, pattern) {
  return Array.from(String(text || '').matchAll(pattern)).length;
}

function extractResultCount(html) {
  const blockMatch = String(html || '').match(/<div[^>]+class=["'][^"']*\bdirectory-results-bar\b[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?:<div|<section|<aside|<nav|$)/i);
  const text = stripHtml(blockMatch ? blockMatch[1] : '');
  const matches = Array.from(text.matchAll(/([0-9]{1,4})/g)).map((match) => Number(match[1]));
  return matches.length ? matches[0] : null;
}

function pageMetrics(html) {
  return {
    title: extractTitle(html),
    h1: extractFirstH1(html),
    resultCountTextNumber: extractResultCount(html),
    lawyerCardCount: countMatches(html, /class=["'][^"']*\blawyer-card\b/gi),
    factGatedCardCount: countMatches(html, /lawyer-card--fact-gated/gi),
    paidCardCount: countMatches(html, /lawyer-card--paid/gi),
    sponsoredCardCount: countMatches(html, /lawyer-card--sponsored/gi),
    basicCardCount: countMatches(html, /lawyer-card--basic-index/gi),
    activeFilterChipCount: countMatches(html, /class=["'][^"']*\bdirectory-chip\b/gi),
    emptyStatePresent: /class=["'][^"']*\bdirectory-empty\b/i.test(html),
  };
}

async function fetchLive(baseUrl, check) {
  const url = `${baseUrl}${check.path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_dir_coverage=${Date.now()}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceDirectoryCoverageQA/1.0; +https://jus-tice.co.il/)',
      },
    });
    const html = await response.text();
    return {
      ...check,
      url,
      status: response.status,
      finalUrl: response.url.replace(/[?&]jt_dir_coverage=\d+/, ''),
      error: '',
      ...pageMetrics(html),
    };
  } catch (error) {
    return {
      ...check,
      url,
      status: 'FETCH_ERROR',
      finalUrl: url,
      error: error instanceof Error ? error.message : String(error),
      title: '',
      h1: '',
      resultCountTextNumber: null,
      lawyerCardCount: 0,
      factGatedCardCount: 0,
      paidCardCount: 0,
      sponsoredCardCount: 0,
      basicCardCount: 0,
      activeFilterChipCount: 0,
      emptyStatePresent: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function localParamRows() {
  const archiveSource = readFileSync(path.join(ROOT, 'archive-justice_lawyer.php'), 'utf8');
  const evidencePacket = readFileSync(path.join(ROOT, '.project-control', 'divorce-tel-aviv-evidence-fill-packet-2026-05-27.md'), 'utf8');

  return [
    {
      id: 'LOCAL-01',
      gate: 'archive_reads_area_param',
      status: archiveSource.includes("$_GET['area']") ? 'PASS' : 'BLOCKED',
      evidence: 'archive-justice_lawyer.php reads `area` as the practice-area filter parameter.',
      nextAction: 'Use `area=family-law` for coverage evidence unless an alias is approved.',
    },
    {
      id: 'LOCAL-02',
      gate: 'archive_reads_practice_param',
      status: archiveSource.includes("$_GET['practice']") ? 'PASS_ALIAS_EXISTS' : 'REVIEW_ALIAS_MISSING',
      evidence: archiveSource.includes("$_GET['practice']")
        ? 'The archive already reads `practice` as an alias.'
        : 'The archive does not read `practice`; URLs using `practice=family-law` may not filter by practice.',
      nextAction: 'Treat private packet directory evidence URL as needing correction or public alias fix review.',
    },
    {
      id: 'LOCAL-03',
      gate: 'private_packet_uses_practice_param',
      status: evidencePacket.includes('practice=family-law') ? 'REVIEW_MISMATCH_FOUND' : 'PASS',
      evidence: evidencePacket.includes('practice=family-law')
        ? 'The latest divorce Tel Aviv evidence packet contains `practice=family-law` in the directory URL.'
        : 'The latest divorce Tel Aviv evidence packet already avoids `practice=family-law`.',
      nextAction: 'Correct the evidence gate to the canonical `area=family-law` route before publication review.',
    },
  ];
}

function compareRows(routeRows) {
  const practiceParam = routeRows.find((row) => row.id === 'DIR-01');
  const areaParam = routeRows.find((row) => row.id === 'DIR-02');
  const cityOnly = routeRows.find((row) => row.id === 'DIR-03');

  const practiceLooksCityOnly =
    practiceParam &&
    cityOnly &&
    practiceParam.h1 === cityOnly.h1 &&
    practiceParam.lawyerCardCount === cityOnly.lawyerCardCount &&
    practiceParam.activeFilterChipCount === cityOnly.activeFilterChipCount;

  const areaDiffersFromPractice =
    practiceParam &&
    areaParam &&
    (practiceParam.h1 !== areaParam.h1 ||
      practiceParam.lawyerCardCount !== areaParam.lawyerCardCount ||
      practiceParam.activeFilterChipCount !== areaParam.activeFilterChipCount);

  return [
    {
      id: 'CMP-01',
      comparison: 'practice_param_vs_city_only',
      status: practiceLooksCityOnly ? 'REVIEW_PRACTICE_PARAM_BEHAVES_LIKE_CITY_ONLY' : 'PASS_DIFFERENT_FROM_CITY_ONLY',
      evidence: practiceLooksCityOnly
        ? '`practice=family-law` has the same H1/card-count/chip-count shape as the city-only control.'
        : '`practice=family-law` differs from the city-only control.',
      nextAction: practiceLooksCityOnly
        ? 'Do not use `practice=family-law` as proof of family-law coverage.'
        : 'Still verify archive parameter support and wp-admin profile readiness.',
    },
    {
      id: 'CMP-02',
      comparison: 'practice_param_vs_area_param',
      status: areaDiffersFromPractice ? 'REVIEW_CANONICAL_AREA_DIFFERS' : 'PASS_OR_INCONCLUSIVE',
      evidence: areaDiffersFromPractice
        ? '`area=family-law` produces a different page shape from `practice=family-law`.'
        : '`area=family-law` did not clearly differ from `practice=family-law` in the sampled metrics.',
      nextAction: areaDiffersFromPractice
        ? 'Use the canonical `area=family-law` route for the coverage gate.'
        : 'Inspect live HTML manually if coverage remains ambiguous.',
    },
  ];
}

function buildSummary({ reportDate, localRows, routeRows, comparisonRows }) {
  const aliasMissing = localRows.some((row) => row.status === 'REVIEW_ALIAS_MISSING');
  const mismatchFound = localRows.some((row) => row.status === 'REVIEW_MISMATCH_FOUND');
  const comparisonReview = comparisonRows.some((row) => row.status.startsWith('REVIEW'));
  const areaRow = routeRows.find((row) => row.id === 'DIR-02');

  return {
    reportDate,
    status: aliasMissing || mismatchFound || comparisonReview
      ? 'DIRECTORY_COVERAGE_QA_FOUND_FILTER_ALIAS_GAP_NO_PUBLIC_CHANGE'
      : 'DIRECTORY_COVERAGE_QA_READY_NO_PUBLIC_CHANGE',
    canonicalCoverageUrl: `${DEFAULT_BASE_URL}/lawyers/?city=tel-aviv&area=family-law`,
    canonicalAreaStatus: areaRow?.status ?? 'unknown',
    canonicalAreaLawyerCardCount: areaRow?.lawyerCardCount ?? 0,
    canonicalAreaResultCountTextNumber: areaRow?.resultCountTextNumber ?? null,
    routeChecks: routeRows.length,
    localChecks: localRows.length,
    comparisonChecks: comparisonRows.length,
    publicChangesApproved: 0,
    cmsWrites: 0,
    seoChanges: 0,
    crmRecordsCreated: 0,
    contactsSent: 0,
    invoicesOrPayments: 0,
    emailsSent: 0,
    upressActions: 0,
  };
}

function reportRows({ localRows, routeRows, comparisonRows }) {
  return [
    ...localRows.map((row) => ({
      row_type: 'local_parameter_gate',
      id: row.id,
      item: row.gate,
      status: row.status,
      evidence: row.evidence,
      next_action: row.nextAction,
    })),
    ...routeRows.map((row) => ({
      row_type: 'live_directory_route',
      id: row.id,
      item: row.path,
      status: String(row.status),
      evidence: `h1=${row.h1}; cards=${row.lawyerCardCount}; chips=${row.activeFilterChipCount}; empty=${row.emptyStatePresent}`,
      next_action: row.expected,
    })),
    ...comparisonRows.map((row) => ({
      row_type: 'comparison',
      id: row.id,
      item: row.comparison,
      status: row.status,
      evidence: row.evidence,
      next_action: row.nextAction,
    })),
    ...FIX_PLAN_ROWS.map((row) => ({
      row_type: 'fix_plan',
      id: row.id,
      item: row.decision,
      status: 'PROPOSED_NOT_APPLIED',
      evidence: row.proposedAction,
      next_action: row.blocker,
    })),
  ];
}

function markdown(summary, { localRows, routeRows, comparisonRows }) {
  return [
    `# Divorce Tel Aviv Directory Coverage QA - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private read-only QA for the filtered lawyer-directory coverage behind the `/divorce-lawyer-tel-aviv/` candidate. This packet does not edit the public directory, publish a page, change CMS/database content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.',
    '',
    '## Summary',
    '',
    `- Canonical coverage URL to use for future evidence: ${summary.canonicalCoverageUrl.replace(DEFAULT_BASE_URL, '')}`,
    `- Canonical route status: ${summary.canonicalAreaStatus}`,
    `- Canonical visible lawyer card count: ${summary.canonicalAreaLawyerCardCount}`,
    `- Public actions: ${summary.publicChangesApproved} approved; ${summary.cmsWrites} CMS writes; ${summary.seoChanges} SEO changes; ${summary.emailsSent} emails; ${summary.upressActions} uPress actions.`,
    '',
    '## Local Parameter Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...localRows.map((row) => `| ${row.id} | ${mdCell(row.gate)} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.nextAction)} |`),
    '',
    '## Live Directory Route Checks',
    '',
    '| ID | Route | Status | H1 | Cards | Filter Chips | Empty State | Expected Use |',
    '| --- | --- | ---: | --- | ---: | ---: | --- | --- |',
    ...routeRows.map((row) => `| ${row.id} | ${mdCell(row.path)} | ${row.status} | ${mdCell(row.h1 || row.title || row.error)} | ${row.lawyerCardCount} | ${row.activeFilterChipCount} | ${row.emptyStatePresent ? 'yes' : 'no'} | ${mdCell(row.expected)} |`),
    '',
    '## Comparisons',
    '',
    '| ID | Comparison | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...comparisonRows.map((row) => `| ${row.id} | ${mdCell(row.comparison)} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.nextAction)} |`),
    '',
    '## Proposed Fix Plan',
    '',
    '| ID | Decision | Proposed Action | Public Impact If Approved | Blocker | Forbidden Now |',
    '| --- | --- | --- | --- | --- | --- |',
    ...FIX_PLAN_ROWS.map((row) => `| ${row.id} | ${mdCell(row.decision)} | ${mdCell(row.proposedAction)} | ${mdCell(row.publicImpactIfApproved)} | ${mdCell(row.blocker)} | ${mdCell(row.forbiddenNow)} |`),
    '',
    '## Own Review',
    '',
    'The divorce Tel Aviv coverage gate is not ready to rely on the `practice=family-law` directory URL. The archive template reads `area`, and the live comparison should treat `area=family-law` as the canonical evidence route. This is useful because the local page must not be approved on a false coverage signal. The next public-facing fix, if approved, is small: accept `practice` as an alias or correct all internal planning URLs to `area`; either path still leaves GSC, wp-admin profile readiness, legal/editor review and owner approval as blockers.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-divorce-tel-aviv-directory-coverage-qa.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
  process.exit(0);
}

const localRows = localParamRows();
const routeRows = await Promise.all(CHECKS.map((check) => fetchLive(args.baseUrl, check)));
const comparisonRows = compareRows(routeRows);
const summary = buildSummary({ reportDate: args.reportDate, localRows, routeRows, comparisonRows });
const files = outputFiles(args.reportDate);
const allRows = reportRows({ localRows, routeRows, comparisonRows });

const reportColumns = ['row_type', 'id', 'item', 'status', 'evidence', 'next_action'];
const routeColumns = [
  'id',
  'label',
  'path',
  'status',
  'finalUrl',
  'h1',
  'resultCountTextNumber',
  'lawyerCardCount',
  'factGatedCardCount',
  'paidCardCount',
  'sponsoredCardCount',
  'basicCardCount',
  'activeFilterChipCount',
  'emptyStatePresent',
  'expected',
];
const fixPlanColumns = ['id', 'decision', 'proposedAction', 'publicImpactIfApproved', 'blocker', 'forbiddenNow'];

writeText(files.projectMd, markdown(summary, { localRows, routeRows, comparisonRows }));
writeText(files.projectCsv, toCsv(allRows, reportColumns));
writeText(files.fixPlanCsv, toCsv(FIX_PLAN_ROWS, fixPlanColumns));
writeText(files.reportCsv, toCsv(routeRows, routeColumns));
writeText(files.reportJson, JSON.stringify({ summary, localRows, routeRows, comparisonRows, fixPlanRows: FIX_PLAN_ROWS, files }, null, 2));

console.log(JSON.stringify({ ...summary, files }, null, 2));
