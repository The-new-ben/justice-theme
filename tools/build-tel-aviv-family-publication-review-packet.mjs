import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TARGET_PATH = '/divorce-lawyer-tel-aviv/';
const PILLAR_PATH = '/divorce-lawyer/';
const DIRECTORY_PATH = '/lawyers/?city=tel-aviv&area=family-law';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `tel-aviv-family-publication-review-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    gateTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-publication-gate-template-${reportDate}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    draft: path.join(ROOT, '.reports', `tel-aviv-family-local-draft-packet-${sourceDate}.json`),
    overlap: path.join(ROOT, '.reports', `tel-aviv-family-internal-overlap-review-${sourceDate}.json`),
    gsc: path.join(ROOT, '.reports', `tel-aviv-family-gsc-cache-review-${sourceDate}.json`),
    evidence: path.join(ROOT, '.reports', `divorce-tel-aviv-evidence-fill-packet-${sourceDate}.json`),
    directory: path.join(ROOT, '.reports', `divorce-tel-aviv-directory-coverage-qa-${sourceDate}.json`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function statusOf(report) {
  return report.summary?.status || report.status || 'missing_status';
}

function sourceDateOf(report) {
  return report.summary?.sourceDate || report.sourceDate || report.summary?.reportDate || report.reportDate || '';
}

function buildReviewRows({ draft, overlap, gsc, evidence, directory }) {
  const gscSummary = gsc.summary || {};
  const evidenceSummary = evidence.summary || {};
  const directorySummary = directory.summary || {};

  return [
    {
      id: 'TA-PUB-01',
      gate: 'target_private_status',
      status: draft.targetPublicStatus === 404 && evidenceSummary.targetLiveStatus === 404 ? 'PASS_PRIVATE_404' : 'BLOCKED_RECHECK_PUBLIC_EXPOSURE',
      evidence: `${TARGET_PATH} is ${draft.targetPublicStatus}; evidence packet target status is ${evidenceSummary.targetLiveStatus}.`,
      required_before_publication: 'Confirm target is not already public 200 immediately before any owner-approved CMS work.',
      owner_visible_decision: 'Keep private until final approval.',
      forbidden_action: 'Do not create or publish the URL from this packet.',
    },
    {
      id: 'TA-PUB-02',
      gate: 'canonical_lawyer_directory_coverage',
      status: directorySummary.canonicalAreaLawyerCardCount >= 3 ? 'REVIEW_COVERAGE_PRESENT_NOT_FINAL' : 'BLOCKED_COVERAGE_MISSING',
      evidence: `${DIRECTORY_PATH} has ${directorySummary.canonicalAreaLawyerCardCount || 0} visible cards; paid card count is not a public-quality claim.`,
      required_before_publication: 'Owner/admin verifies profile readiness, source-gated facts, availability and no unsupported paid/sponsored claims.',
      owner_visible_decision: 'Coverage evidence exists for planning, not publication approval.',
      forbidden_action: 'Do not claim best, ranked, sponsored, guaranteed or paid coverage from card count alone.',
    },
    {
      id: 'TA-PUB-03',
      gate: 'focused_gsc_exact_local_evidence',
      status: (gscSummary.exactLocalCacheRows || 0) > 0 ? 'REVIEW_FOCUSED_EXPORT_STILL_REQUIRED' : 'BLOCKED_FOCUSED_EXPORT_REQUIRED',
      evidence: `Local GSC cache has ${gscSummary.exactLocalCacheRows || 0} exact local rows; focused export template has ${gscSummary.focusedExportTemplateRows || 0} rows.`,
      required_before_publication: 'Fill focused GSC export for last 16 months and last 90 days for target, pillar, protected associated pages and legacy/profile URLs.',
      owner_visible_decision: 'Publication remains blocked on final GSC evidence.',
      forbidden_action: 'Do not use preliminary cache as final publication, canonical, noindex, sitemap or internal-link evidence.',
    },
    {
      id: 'TA-PUB-04',
      gate: 'pillar_protection',
      status: 'PASS_PROTECT_PILLAR',
      evidence: `Broad divorce-lawyer cache rows: ${gscSummary.broadDivorceLawyerRows || 0}; primary pillar remains ${PILLAR_PATH}.`,
      required_before_publication: 'Keep broad how-to-choose, cost, process and general divorce-lawyer intent on the pillar.',
      owner_visible_decision: 'Local page may only serve local fit-check and request-preparation intent.',
      forbidden_action: 'Do not duplicate the divorce pillar in the Tel Aviv local page.',
    },
    {
      id: 'TA-PUB-05',
      gate: 'associated_route_overlap',
      status: overlap.highRiskOverlapCount > 0 ? 'PASS_WITH_PROTECTED_ROUTES' : 'REVIEW_NO_HIGH_RISK_ROWS',
      evidence: `${overlap.routeCount || 0} associated routes mapped; ${overlap.highRiskOverlapCount || 0} high-risk routes protected.`,
      required_before_publication: 'Exclude custody, child support, mediation, settlement, template and cost intent unless legal/editor review explicitly approves a reference.',
      owner_visible_decision: 'Use overlap packet as the editor boundary map.',
      forbidden_action: 'Do not add internal links or absorb protected route intent from this packet alone.',
    },
    {
      id: 'TA-PUB-06',
      gate: 'legal_editor_review',
      status: 'BLOCKED_REVIEWER_REQUIRED',
      evidence: 'No legal/editor reviewer approval is recorded in the private source chain.',
      required_before_publication: 'Legal/editor reviewer must approve title, H1, intro, checklist, CTA, FAQ candidates, disclaimers and source boundaries.',
      owner_visible_decision: 'Legal/editor approval is a hard pre-publication gate.',
      forbidden_action: 'Do not publish legal/process/deadline/court/local-office claims without reviewer sign-off.',
    },
    {
      id: 'TA-PUB-07',
      gate: 'owner_publication_approval',
      status: 'BLOCKED_OWNER_APPROVAL_REQUIRED',
      evidence: 'All source packets record 0 public/CMS/SEO approvals.',
      required_before_publication: 'Owner must approve exact scope, target URL, directory link, protected associated pages and post-publication review workflow.',
      owner_visible_decision: 'Owner approval is not implied by this private packet.',
      forbidden_action: 'Do not create CMS page, update title/H1/meta/body/internal links, or request uPress from this packet.',
    },
    {
      id: 'TA-PUB-08',
      gate: 'future_owner_email_requirements',
      status: 'REFERENCE_ONLY_NO_EMAIL',
      evidence: 'No public page was published or updated in this cycle, so no owner email is triggered.',
      required_before_publication: 'If a future public update is approved and deployed, first check instruction emails, then send Hebrew review URL, summary and cannibalization list.',
      owner_visible_decision: 'Email workflow is documented for later only.',
      forbidden_action: 'Do not send routine progress email for this private packet.',
    },
    {
      id: 'TA-PUB-09',
      gate: 'no_live_action_boundary',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This packet writes private repo artifacts only and records 0 public/CMS/CRM/contact/payment/email/uPress approvals.',
      required_before_publication: 'Re-run boundary guard after generation and before commit.',
      owner_visible_decision: 'Safe private review artifact.',
      forbidden_action: 'Do not change redirects, canonicals/noindex, sitemap, taxonomy, CMS content, CRM data or payment settings.',
    },
  ];
}

function buildGateTemplateRows() {
  return [
    {
      id: 'TA-GATE-01',
      gate: 'focused_gsc_last_16_months',
      owner_or_editor_fill: '',
      required_value: 'Exact query/page rows for target, pillar, protected associated pages and legacy/profile URLs.',
      current_blocker: 'Focused export not filled.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-GATE-02',
      gate: 'focused_gsc_last_90_days',
      owner_or_editor_fill: '',
      required_value: 'Recent query/page rows to confirm no active cannibalization or stale legacy dominance.',
      current_blocker: 'Focused export not filled.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-GATE-03',
      gate: 'lawyer_coverage_readiness',
      owner_or_editor_fill: '',
      required_value: 'Owner/admin confirms visible Tel Aviv family-law profiles are source-gated, appropriate and available for the local page.',
      current_blocker: 'Visible card count exists, but readiness is not final publication proof.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-GATE-04',
      gate: 'legal_editor_copy_review',
      owner_or_editor_fill: '',
      required_value: 'Reviewer approves exact title, H1, intro, checklist, CTA, FAQ candidates and disclaimers.',
      current_blocker: 'No reviewer sign-off recorded.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-GATE-05',
      gate: 'owner_publication_scope',
      owner_or_editor_fill: '',
      required_value: 'Owner approves exact route, content scope, internal-link plan and post-publication review workflow.',
      current_blocker: 'No owner publication approval recorded.',
      public_go_if_blank: 'no',
    },
  ];
}

function buildStatus(rows) {
  const blocked = rows.filter((row) => row.status.startsWith('BLOCKED')).length;
  return blocked
    ? 'TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER'
    : 'TEL_AVIV_FAMILY_PUBLICATION_REVIEW_READY_FOR_OWNER_DECISION_NO_PUBLIC_CHANGE';
}

function buildMarkdown({ reportDate, sourceDate, rows, gateTemplateRows, status, sources }) {
  const lines = [
    `# Tel Aviv Family Publication Review Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Target: ${TARGET_PATH}`,
    '',
    'Scope: private publication-readiness packet only. This does not create or publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.',
    '',
    '## Source Chain',
    '',
    `- Draft packet (${sourceDate}): ${statusOf(sources.draft)}`,
    `- Internal overlap review (${sourceDate}): ${statusOf(sources.overlap)}`,
    `- GSC cache review (${sourceDate}): ${statusOf(sources.gsc)}`,
    `- Evidence-fill packet (${sourceDate}): ${statusOf(sources.evidence)}`,
    `- Directory coverage QA (${sourceDate}): ${statusOf(sources.directory)}`,
    '',
    '## Review Gates',
    '',
    '| ID | Gate | Status | Evidence | Required Before Publication |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.required_before_publication)} |`),
    '',
    '## Fillable Gate Template',
    '',
    `Use .project-control/tel-aviv-family-publication-gate-template-${reportDate}.csv before any public work.`,
    '',
    '| ID | Gate | Required Value | Current Blocker | Public Go If Blank |',
    '| --- | --- | --- | --- | --- |',
    ...gateTemplateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.required_value)} | ${mdCell(row.current_blocker)} | ${mdCell(row.public_go_if_blank)} |`),
    '',
    '## Decision',
    '',
    'The Tel Aviv divorce-lawyer page has enough private structure for legal/editor review, but not enough evidence for publication. The next owner-visible step is to fill focused GSC exports and legal/editor/owner approval fields; the route should stay private until those rows are complete.',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-tel-aviv-family-publication-review-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const paths = sourceFiles(args.sourceDate);
  const sources = {
    draft: readJson(paths.draft),
    overlap: readJson(paths.overlap),
    gsc: readJson(paths.gsc),
    evidence: readJson(paths.evidence),
    directory: readJson(paths.directory),
  };

  const rows = buildReviewRows(sources);
  const gateTemplateRows = buildGateTemplateRows();
  const status = buildStatus(rows);
  const outputs = outputFiles(args.reportDate);
  const columns = ['id', 'gate', 'status', 'evidence', 'required_before_publication', 'owner_visible_decision', 'forbidden_action'];
  const templateColumns = ['id', 'gate', 'owner_or_editor_fill', 'required_value', 'current_blocker', 'public_go_if_blank'];

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    sourceStatuses: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, statusOf(value)])),
    sourceDates: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, sourceDateOf(value)])),
    reviewRows: rows.length,
    blockedRows: rows.filter((row) => row.status.startsWith('BLOCKED')).length,
    reviewRowsRequiringOwnerOrEditor: rows.filter((row) => row.status.includes('REVIEW') || row.status.includes('BLOCKED')).length,
    gateTemplateRows: gateTemplateRows.length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    files: {
      projectMd: path.relative(ROOT, outputs.projectMd),
      projectCsv: path.relative(ROOT, outputs.projectCsv),
      gateTemplateCsv: path.relative(ROOT, outputs.gateTemplateCsv),
      reportJson: path.relative(ROOT, outputs.reportJson),
      reportCsv: path.relative(ROOT, outputs.reportCsv),
    },
  };

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, rows, gateTemplateRows, status, sources }));
  writeText(outputs.projectCsv, toCsv(rows, columns));
  writeText(outputs.gateTemplateCsv, toCsv(gateTemplateRows, templateColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, rows, gateTemplateRows, sourceFiles: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, path.relative(ROOT, value)])) }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(rows, columns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
