import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

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
  const base = `city-practice-directory-coverage-unblocker-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerTemplateCsv: path.join(ROOT, '.project-control', `city-practice-directory-coverage-owner-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source report: ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'));
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

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function countLawyerCards(html) {
  return (String(html || '').match(/<article\b[^>]*class=["'][^"']*\blawyer-card\b/gi) || []).length;
}

async function fetchLive(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_directory_unblocker=${Date.now()}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceDirectoryCoverageUnblocker/1.0; +https://jus-tice.co.il/)',
      },
    });
    const html = await response.text();
    const text = stripHtml(html);
    return {
      ok: response.ok,
      status: response.status,
      final_url: response.url,
      title: extractTitle(html),
      h1: extractFirstH1(html),
      word_estimate: countWords(text),
      lawyer_card_count: countLawyerCards(html),
    };
  } catch (error) {
    return {
      ok: false,
      status: 'ERROR',
      final_url: url,
      title: '',
      h1: '',
      word_estimate: 0,
      lawyer_card_count: 0,
      error: error.name === 'AbortError' ? 'timeout' : error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function alternativePathsFor(blocker, briefRow) {
  const canonicalUrl = new URL(blocker.url);
  const area = canonicalUrl.searchParams.get('area') || '';
  const city = canonicalUrl.searchParams.get('city') || '';
  const source = briefRow?.slug || blocker.slug;

  return [
    {
      id: `${blocker.id}-ALT-AREA`,
      option: 'area_only_directory',
      path: area ? `/lawyers/?area=${area}` : '/lawyers/',
      use_case: 'Fallback directory candidate if owner/editor accepts a broader, non-local directory link.',
      safety: 'Do not present as Jerusalem-specific coverage.',
    },
    {
      id: `${blocker.id}-ALT-CITY`,
      option: 'city_only_directory',
      path: city ? `/lawyers/?city=${city}` : '/lawyers/',
      use_case: 'Fallback city directory candidate if owner/editor accepts a broader, non-practice-specific directory link.',
      safety: 'Do not present as criminal-law-specific coverage.',
    },
    {
      id: `${blocker.id}-ALT-CONTACT`,
      option: 'contact_form_fallback',
      path: `/contact/?area=${area || 'general'}&city=${city || ''}&source=${source}`,
      use_case: 'Potential future user-help CTA when no matching lawyer-card coverage exists.',
      safety: 'Requires owner/SEO/legal approval before any public content or internal-link use.',
    },
  ];
}

async function buildLiveAlternativeRows(blockedRows, briefRows, baseUrl) {
  const candidates = blockedRows.flatMap((blocker) => {
    const briefRow = briefRows.find((row) => row.slug === blocker.slug);
    return alternativePathsFor(blocker, briefRow).map((candidate) => ({
      ...candidate,
      slug: blocker.slug,
      source_directory_url: blocker.url,
    }));
  });

  const rows = [];
  for (const candidate of candidates) {
    const live = await fetchLive(new URL(candidate.path, baseUrl).toString());
    rows.push({
      row_type: 'live_alternative',
      ...candidate,
      url: new URL(candidate.path, baseUrl).toString(),
      status: live.status,
      final_url: live.final_url,
      title: live.title,
      h1: live.h1,
      word_estimate: live.word_estimate,
      lawyer_card_count: live.lawyer_card_count,
      gate:
        live.ok && candidate.option !== 'contact_form_fallback' && live.lawyer_card_count > 0
          ? 'REVIEW_ALTERNATE_DIRECTORY_HAS_COVERAGE'
          : live.ok && candidate.option === 'contact_form_fallback'
            ? 'REVIEW_CONTACT_FORM_REACHABLE'
            : live.ok
              ? 'BLOCKED_ALTERNATE_DIRECTORY_EMPTY'
              : 'BLOCKED_ALTERNATE_UNREACHABLE',
    });
  }
  return rows;
}

function buildBlockedRows(sourceReport) {
  return (sourceReport.liveRows || [])
    .filter((row) => row.role === 'canonical_directory_live_check' && row.gate !== 'PASS_CANONICAL_DIRECTORY_FILTER_REACHABLE')
    .map((row) => ({
      row_type: 'blocked_directory',
      id: row.id,
      slug: row.slug,
      url: row.url,
      status: row.status,
      title: row.title,
      h1: row.h1,
      expected_terms: row.expected_terms,
      lawyer_card_count: row.lawyer_card_count,
      gate: row.gate,
      blocker: 'Canonical filtered directory cannot be used for draft/internal-link reliance because coverage is missing or generic.',
      next_action: 'Fix lawyer coverage privately, choose an approved alternate CTA/path, or park the city/practice draft.',
    }));
}

function buildOptionRows(blockedRows, alternativeRows) {
  return blockedRows.flatMap((blocker) => {
    const alternativesForSlug = alternativeRows.filter((row) => row.slug === blocker.slug);
    const areaDirectory = alternativesForSlug.find((row) => row.option === 'area_only_directory');
    const cityDirectory = alternativesForSlug.find((row) => row.option === 'city_only_directory');
    const contactForm = alternativesForSlug.find((row) => row.option === 'contact_form_fallback');

    return [
      {
        row_type: 'option',
        id: `${blocker.id}-OPTION-01`,
        slug: blocker.slug,
        option: 'activate_matching_lawyer_coverage',
        status: 'RECOMMENDED_PRIVATE_REVENUE_PATH',
        evidence: `${blocker.url} has ${blocker.lawyer_card_count} lawyer cards for the exact city/practice filter.`,
        next_action:
          'Owner/admin should activate or verify at least one matching routable lawyer profile/prospect before relying on the exact directory path.',
        public_change_allowed: 'no',
      },
      {
        row_type: 'option',
        id: `${blocker.id}-OPTION-02`,
        slug: blocker.slug,
        option: 'broader_area_directory_fallback',
        status: areaDirectory?.lawyer_card_count > 0 ? 'REVIEW_ONLY_HAS_COVERAGE' : 'BLOCKED_EMPTY_OR_UNVERIFIED',
        evidence: areaDirectory
          ? `${areaDirectory.path} returned ${areaDirectory.lawyer_card_count} lawyer cards and H1 "${areaDirectory.h1}".`
          : 'No area-only alternative was checked.',
        next_action:
          'Use only if owner/SEO/legal approves a broader non-local directory CTA in a future public draft packet.',
        public_change_allowed: 'no',
      },
      {
        row_type: 'option',
        id: `${blocker.id}-OPTION-03`,
        slug: blocker.slug,
        option: 'broader_city_directory_fallback',
        status: cityDirectory?.lawyer_card_count > 0 ? 'REVIEW_ONLY_HAS_COVERAGE' : 'BLOCKED_EMPTY_OR_UNVERIFIED',
        evidence: cityDirectory
          ? `${cityDirectory.path} returned ${cityDirectory.lawyer_card_count} lawyer cards and H1 "${cityDirectory.h1}".`
          : 'No city-only alternative was checked.',
        next_action:
          'Use only if owner/SEO/legal approves a broader non-practice-specific directory CTA in a future public draft packet.',
        public_change_allowed: 'no',
      },
      {
        row_type: 'option',
        id: `${blocker.id}-OPTION-04`,
        slug: blocker.slug,
        option: 'contact_form_fallback',
        status: contactForm?.status === 200 ? 'REVIEW_ONLY_REACHABLE' : 'BLOCKED_UNREACHABLE',
        evidence: contactForm
          ? `${contactForm.path} returned status ${contactForm.status} and H1 "${contactForm.h1}".`
          : 'No contact-form fallback was checked.',
        next_action:
          'Use only after explicit approval of public copy, lead-routing expectations and non-directory wording.',
        public_change_allowed: 'no',
      },
      {
        row_type: 'option',
        id: `${blocker.id}-OPTION-05`,
        slug: blocker.slug,
        option: 'park_city_practice_public_work',
        status: 'SAFE_DEFAULT',
        evidence: 'Exact directory coverage is missing and public content approval is absent.',
        next_action: 'Keep the local/practice update private until coverage or approved fallback is ready.',
        public_change_allowed: 'no',
      },
    ];
  });
}

function buildOwnerTemplateRows(blockedRows) {
  return blockedRows.flatMap((blocker) => [
    {
      row_type: 'owner_template',
      decision_id: `${blocker.id}-DECISION-01`,
      slug: blocker.slug,
      owner_decision: '',
      recommended_value: 'approve private matching-lawyer coverage work',
      allowed_next_step:
        'Create/verify one matching private lawyer/prospect record and only later rerun the coverage gate.',
      forbidden_without_fresh_approval:
        'Do not publish content, add internal links, contact anyone, route leads, invoice, mark paid or change SEO settings.',
    },
    {
      row_type: 'owner_template',
      decision_id: `${blocker.id}-DECISION-02`,
      slug: blocker.slug,
      owner_decision: '',
      recommended_value: 'park public city/practice update',
      allowed_next_step:
        'Keep content private and continue revenue/content prep on targets with proven directory coverage.',
      forbidden_without_fresh_approval:
        'Do not use a broader area/city/contact fallback on the public site without owner/SEO/legal approval.',
    },
    {
      row_type: 'owner_template',
      decision_id: `${blocker.id}-DECISION-03`,
      slug: blocker.slug,
      owner_decision: '',
      recommended_value: 'request alternate CTA plan',
      allowed_next_step:
        'Prepare a separate public-copy review packet for a non-directory CTA, still with no CMS change.',
      forbidden_without_fresh_approval:
        'Do not imply exact lawyer availability in the blocked city/practice combination.',
    },
  ]);
}

function buildGateRows({ sourceReport, blockedRows, alternativeRows, optionRows }) {
  const reviewedAlternatives = alternativeRows.length;
  const options = optionRows.length;
  const publicChangeAllowed = optionRows.some((row) => row.public_change_allowed !== 'no');

  return [
    {
      row_type: 'gate',
      id: 'DGU-GATE-01',
      gate: 'source_priority_packet_available',
      status: sourceReport.status ? 'PASS' : 'BLOCKED',
      evidence: `Source city/practice packet status: ${sourceReport.status || 'missing'}.`,
      next_action: 'Use source packet only as private evidence; do not publish from it.',
    },
    {
      row_type: 'gate',
      id: 'DGU-GATE-02',
      gate: 'blocked_directory_rows_found',
      status: blockedRows.length ? 'PASS' : 'REVIEW',
      evidence: `${blockedRows.length} blocked canonical directory row(s) found.`,
      next_action: blockedRows.length
        ? 'Build owner choices around the exact blocked rows.'
        : 'No coverage unblocker needed unless owner asks for broader review.',
    },
    {
      row_type: 'gate',
      id: 'DGU-GATE-03',
      gate: 'alternate_paths_checked_read_only',
      status: reviewedAlternatives >= blockedRows.length * 3 ? 'PASS' : 'REVIEW',
      evidence: `${reviewedAlternatives} live alternate path check(s) recorded.`,
      next_action: 'Treat alternatives as review candidates only, not approved public links.',
    },
    {
      row_type: 'gate',
      id: 'DGU-GATE-04',
      gate: 'owner_options_ready',
      status: options ? 'PASS' : 'BLOCKED',
      evidence: `${options} private option row(s) generated.`,
      next_action: 'Owner/admin can choose private coverage, park, or ask for a separate alternate-CTA packet.',
    },
    {
      row_type: 'gate',
      id: 'DGU-GATE-05',
      gate: 'no_public_change_authorized',
      status: publicChangeAllowed ? 'BLOCKED' : 'PASS',
      evidence: publicChangeAllowed
        ? 'At least one option row permits public change.'
        : 'All option rows keep public change forbidden without fresh owner approval.',
      next_action: 'Do not publish, link, route, contact, invoice or deploy from this packet.',
    },
  ];
}

function buildMarkdown({ reportDate, status, gateRows, blockedRows, alternativeRows, optionRows, ownerTemplateRows }) {
  return [
    `# City/Practice Directory Coverage Unblocker - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    'Scope: private unblocker packet for city/practice draft targets whose canonical filtered lawyer-directory URL lacks usable coverage. This packet performs read-only live checks only. It does not publish content, edit WordPress, change SEO settings, create CRM records, contact anyone, send email, invoice, take payment or deploy.',
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Blocked Directory Rows',
    '',
    '| ID | Slug | Gate | URL | H1 | Lawyer Cards | Next Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...blockedRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.gate)} | ${mdCell(row.url)} | ${mdCell(row.h1)} | ${mdCell(row.lawyer_card_count)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Read-Only Alternate Checks',
    '',
    '| ID | Slug | Option | Gate | URL | H1 | Lawyer Cards | Safety |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...alternativeRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.option)} | ${mdCell(row.gate)} | ${mdCell(row.url)} | ${mdCell(row.h1)} | ${mdCell(row.lawyer_card_count)} | ${mdCell(row.safety)} |`,
    ),
    '',
    '## Owner Options',
    '',
    '| ID | Slug | Option | Status | Evidence | Next Action | Public Change Allowed |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...optionRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.option)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} | ${mdCell(row.public_change_allowed)} |`,
    ),
    '',
    '## Owner Template Rows',
    '',
    '| Decision ID | Slug | Recommended Value | Allowed Next Step | Forbidden Without Fresh Approval |',
    '| --- | --- | --- | --- | --- |',
    ...ownerTemplateRows.map(
      (row) =>
        `| ${mdCell(row.decision_id)} | ${mdCell(row.slug)} | ${mdCell(row.recommended_value)} | ${mdCell(row.allowed_next_step)} | ${mdCell(row.forbidden_without_fresh_approval)} |`,
    ),
    '',
    '## Review',
    '',
    'The safest revenue-aligned fix is private lawyer coverage: create or verify a matching routable criminal-law/Jerusalem lawyer or prospect, then rerun the directory coverage gate. A broader area directory, broader city directory, or contact-form fallback can be considered only in a separate owner/SEO/legal-approved public-copy packet. Until then, keep the Jerusalem criminal city/practice draft and internal-link plan blocked.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-city-practice-directory-coverage-unblocker.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const sourceReport = readJson(`.reports/city-practice-priority-draft-briefs-${args.reportDate}.json`);
  const blockedRows = buildBlockedRows(sourceReport);
  const alternativeRows = await buildLiveAlternativeRows(blockedRows, sourceReport.briefRows || [], args.baseUrl);
  const optionRows = buildOptionRows(blockedRows, alternativeRows);
  const ownerTemplateRows = buildOwnerTemplateRows(blockedRows);
  const gateRows = buildGateRows({ sourceReport, blockedRows, alternativeRows, optionRows });
  const blockedGateCount = gateRows.filter((row) => row.status === 'BLOCKED').length;
  const reviewGateCount = gateRows.filter((row) => row.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'DIRECTORY_COVERAGE_UNBLOCKER_BLOCKED_NO_PUBLIC_CHANGE'
    : reviewGateCount
      ? 'DIRECTORY_COVERAGE_UNBLOCKER_READY_WITH_REVIEW_NO_PUBLIC_CHANGE'
      : 'DIRECTORY_COVERAGE_UNBLOCKER_READY_NO_PUBLIC_CHANGE';

  const report = {
    reportDate: args.reportDate,
    status,
    sourceStatus: sourceReport.status,
    blockedDirectoryCount: blockedRows.length,
    liveAlternativeCount: alternativeRows.length,
    optionCount: optionRows.length,
    ownerTemplateRowCount: ownerTemplateRows.length,
    passGateCount: gateRows.filter((row) => row.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    gates: gateRows,
    blockedRows,
    alternativeRows,
    optionRows,
    ownerTemplateRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, status, gateRows, blockedRows, alternativeRows, optionRows, ownerTemplateRows }));
  writeText(
    files.projectCsv,
    toCsv([...blockedRows, ...alternativeRows, ...optionRows], [
      'row_type',
      'id',
      'slug',
      'option',
      'status',
      'gate',
      'url',
      'path',
      'title',
      'h1',
      'lawyer_card_count',
      'evidence',
      'next_action',
      'safety',
      'public_change_allowed',
    ]),
  );
  writeText(
    files.ownerTemplateCsv,
    toCsv(ownerTemplateRows, [
      'row_type',
      'decision_id',
      'slug',
      'owner_decision',
      'recommended_value',
      'allowed_next_step',
      'forbidden_without_fresh_approval',
    ]),
  );
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(
    files.reportCsv,
    toCsv([...gateRows, ...blockedRows, ...alternativeRows, ...optionRows, ...ownerTemplateRows], [
      'row_type',
      'id',
      'decision_id',
      'slug',
      'gate',
      'status',
      'option',
      'url',
      'path',
      'title',
      'h1',
      'lawyer_card_count',
      'evidence',
      'next_action',
      'recommended_value',
      'allowed_next_step',
      'forbidden_without_fresh_approval',
      'public_change_allowed',
    ]),
  );

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        status: report.status,
        sourceStatus: report.sourceStatus,
        blockedDirectoryCount: report.blockedDirectoryCount,
        liveAlternativeCount: report.liveAlternativeCount,
        optionCount: report.optionCount,
        ownerTemplateRowCount: report.ownerTemplateRowCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        publicChangesApproved: report.publicChangesApproved,
        cmsWritesApproved: report.cmsWritesApproved,
        seoSettingsChanged: report.seoSettingsChanged,
        emailsSent: report.emailsSent,
        upressDeploymentRequired: report.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
