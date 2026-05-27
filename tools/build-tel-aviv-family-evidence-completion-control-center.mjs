import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TARGET_PATH = '/divorce-lawyer-tel-aviv/';

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

function relativePath(filePath) {
  return path.relative(ROOT, filePath);
}

function outputFiles(reportDate) {
  const base = `tel-aviv-family-evidence-completion-control-center-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    workqueueCsv: path.join(ROOT, '.project-control', `tel-aviv-family-evidence-completion-workqueue-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    publicationReview: path.join(ROOT, '.reports', `tel-aviv-family-publication-review-packet-${sourceDate}.json`),
    gscOperator: path.join(ROOT, '.reports', `tel-aviv-family-focused-gsc-export-operator-packet-${sourceDate}.json`),
    lawyerReadiness: path.join(ROOT, '.reports', `tel-aviv-family-lawyer-readiness-owner-packet-${sourceDate}.json`),
    legalEditor: path.join(ROOT, '.reports', `tel-aviv-family-legal-editor-review-packet-${sourceDate}.json`),
    ownerScope: path.join(ROOT, '.reports', `tel-aviv-family-owner-publication-scope-packet-${sourceDate}.json`),
    publicationGateTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-publication-gate-template-${sourceDate}.csv`),
    gscPasteTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-gsc-export-paste-template-${sourceDate}.csv`),
    lawyerReadinessTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-lawyer-readiness-fill-template-${sourceDate}.csv`),
    legalEditorTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-legal-editor-fill-template-${sourceDate}.csv`),
    ownerScopeTemplate: path.join(ROOT, '.project-control', `tel-aviv-family-owner-publication-scope-fill-template-${sourceDate}.csv`),
    postPublicationChecklist: path.join(ROOT, '.project-control', `tel-aviv-family-post-publication-review-checklist-${sourceDate}.csv`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function countCsvRows(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source CSV: ${filePath}`);
  }

  const lines = readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');

  return Math.max(0, lines.length - 1);
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

function buildWorkqueue({ files, rowCounts }) {
  return [
    {
      id: 'TA-COMPLETE-01',
      phase: 1,
      workstream: 'focused_gsc_export',
      artifact: relativePath(files.gscPasteTemplate),
      row_count: rowCounts.gscPasteRows,
      responsible_role: 'owner_or_gsc_operator',
      required_fill: 'Fill clicks, impressions, ctr, position, query/page notes and reviewer_decision for both last-16-month and last-90-day windows.',
      completion_rule: 'All rows must be filled or explicitly marked not_available with no-pii notes before any local-page go/no-go review.',
      blocks: 'publication evidence, internal-link decision, consolidation/noindex/canonical/sitemap decisions',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-COMPLETE-02',
      phase: 2,
      workstream: 'lawyer_readiness',
      artifact: relativePath(files.lawyerReadinessTemplate),
      row_count: rowCounts.lawyerRows,
      responsible_role: 'owner_or_private_admin',
      required_fill: 'Verify identity, family/divorce fit, Tel Aviv fit, display permission, availability, contact path without exporting contact details and no ranking/paid/sponsored claim.',
      completion_rule: 'Each visible card row needs an owner/admin decision from private evidence.',
      blocks: 'coverage language, directory handoff confidence, local CTA wording',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-COMPLETE-03',
      phase: 3,
      workstream: 'legal_editor_review',
      artifact: relativePath(files.legalEditorTemplate),
      row_count: rowCounts.legalRows,
      responsible_role: 'legal_editor_or_owner_approved_reviewer',
      required_fill: 'Approve, revise, reject or mark needs_gsc / needs_owner_admin / needs_owner_scope for title, H1, intro, checklist, CTA, FAQ, source boundaries and disclaimer rows.',
      completion_rule: 'No final public title/H1/meta/body/FAQ/schema can be prepared until all rows have a decision.',
      blocks: 'final content, public claims, FAQ schema and legal-service wording',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-COMPLETE-04',
      phase: 4,
      workstream: 'owner_publication_scope',
      artifact: relativePath(files.ownerScopeTemplate),
      row_count: rowCounts.ownerRows,
      responsible_role: 'owner',
      required_fill: 'Approve, revise, reject, park or request more evidence for target URL, content scope, GSC gate, lawyer readiness, legal/editor approval, links, post-publication workflow and final go/no-go.',
      completion_rule: 'Owner scope must be explicit before any private CMS draft packet can be prepared.',
      blocks: 'route creation, internal links, CTA scope and deployment planning',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-COMPLETE-05',
      phase: 5,
      workstream: 'final_private_publication_gate',
      artifact: relativePath(files.publicationGateTemplate),
      row_count: rowCounts.publicationGateRows,
      responsible_role: 'private_reviewer',
      required_fill: 'Summarize focused GSC, lawyer readiness, legal/editor and owner-scope decisions into one private go/no-go gate.',
      completion_rule: 'Only after this gate is complete can a separate exact CMS draft packet be prepared for owner review.',
      blocks: 'public route execution and any live QA/email/uPress workflow',
      public_go_if_blank: 'no',
    },
  ];
}

function buildGateRows(rowCounts) {
  return [
    {
      id: 'TA-CENTER-GATE-01',
      gate: 'all_templates_present',
      status: 'PASS',
      evidence: `${rowCounts.totalRequiredFillRows} required fill rows indexed across 5 private templates.`,
      next_action: 'Fill rows in sequence and keep blanks blocking.',
    },
    {
      id: 'TA-CENTER-GATE-02',
      gate: 'human_fill_required',
      status: 'BLOCKED_HUMAN_FILL_REQUIRED',
      evidence: 'No owner/operator/legal/editor/admin fill has been recorded by this control center.',
      next_action: 'Use the workqueue CSV as the single handoff index.',
    },
    {
      id: 'TA-CENTER-GATE-03',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This control center records 0 public/CMS/SEO/CRM/contact/payment/email/uPress approvals.',
      next_action: 'Prepare a later private go/no-go packet only after every blocking fill row is complete.',
    },
  ];
}

function buildMarkdown({ summary, workqueueRows, gateRows }) {
  const workqueueTable = [
    '| ID | Phase | Workstream | Rows | Responsible Role | Artifact | Blocks |',
    '| --- | ---: | --- | ---: | --- | --- | --- |',
    ...workqueueRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.phase)} | ${mdCell(row.workstream)} | ${mdCell(row.row_count)} | ${mdCell(row.responsible_role)} | ${mdCell(row.artifact)} | ${mdCell(row.blocks)} |`),
  ].join('\n');

  const gateTable = [
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
  ].join('\n');

  return `# Tel Aviv Family Evidence Completion Control Center - ${summary.reportDate}

Status: ${summary.status}
Target: ${TARGET_PATH}

Scope: private evidence-completion index only. It does not fill evidence, approve publication, create a CMS page, change title/H1/meta/body/internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, call paid LLM APIs, or deploy.

## Source Statuses

- Publication review (${summary.sourceDate}): ${summary.sourceStatuses.publicationReview}
- Focused GSC operator (${summary.sourceDate}): ${summary.sourceStatuses.gscOperator}
- Lawyer readiness (${summary.sourceDate}): ${summary.sourceStatuses.lawyerReadiness}
- Legal/editor review (${summary.sourceDate}): ${summary.sourceStatuses.legalEditor}
- Owner scope (${summary.sourceDate}): ${summary.sourceStatuses.ownerScope}

## Remaining Fill Rows

- Total required before private go/no-go: ${summary.totalRequiredFillRows}
- Focused GSC paste rows: ${summary.focusedGscPasteRows}
- Lawyer readiness rows: ${summary.lawyerReadinessRows}
- Legal/editor rows: ${summary.legalEditorRows}
- Owner scope rows: ${summary.ownerScopeRows}
- Final publication gate rows: ${summary.publicationGateRows}
- Future post-publication checklist rows, not active now: ${summary.futurePostPublicationRows}

## Workqueue

${workqueueTable}

## Gates

${gateTable}

## Decision

The fastest safe next human action is to fill the GSC paste template first, then lawyer readiness, legal/editor and owner scope. Blanks keep ${TARGET_PATH} private. No public route or CMS packet should be prepared until the final private publication gate is complete.
`;
}

function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node tools/build-tel-aviv-family-evidence-completion-control-center.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const files = sourceFiles(args.sourceDate);
  const outputs = outputFiles(args.reportDate);
  const publicationReview = readJson(files.publicationReview);
  const gscOperator = readJson(files.gscOperator);
  const lawyerReadiness = readJson(files.lawyerReadiness);
  const legalEditor = readJson(files.legalEditor);
  const ownerScope = readJson(files.ownerScope);

  const rowCounts = {
    gscPasteRows: countCsvRows(files.gscPasteTemplate),
    lawyerRows: countCsvRows(files.lawyerReadinessTemplate),
    legalRows: countCsvRows(files.legalEditorTemplate),
    ownerRows: countCsvRows(files.ownerScopeTemplate),
    publicationGateRows: countCsvRows(files.publicationGateTemplate),
    futurePostPublicationRows: countCsvRows(files.postPublicationChecklist),
  };
  rowCounts.totalRequiredFillRows = rowCounts.gscPasteRows + rowCounts.lawyerRows + rowCounts.legalRows + rowCounts.ownerRows + rowCounts.publicationGateRows;

  const workqueueRows = buildWorkqueue({ files, rowCounts });
  const gateRows = buildGateRows(rowCounts);
  const status = 'TEL_AVIV_FAMILY_EVIDENCE_COMPLETION_CONTROL_CENTER_READY_BLOCKED_ON_HUMAN_FILL_NO_PUBLIC_CHANGE';

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    sourceStatuses: {
      publicationReview: statusOf(publicationReview),
      gscOperator: statusOf(gscOperator),
      lawyerReadiness: statusOf(lawyerReadiness),
      legalEditor: statusOf(legalEditor),
      ownerScope: statusOf(ownerScope),
    },
    workqueueRows: workqueueRows.length,
    gateRows: gateRows.length,
    blockedGateRows: gateRows.filter((row) => row.status.startsWith('BLOCKED')).length,
    totalRequiredFillRows: rowCounts.totalRequiredFillRows,
    focusedGscPasteRows: rowCounts.gscPasteRows,
    lawyerReadinessRows: rowCounts.lawyerRows,
    legalEditorRows: rowCounts.legalRows,
    ownerScopeRows: rowCounts.ownerRows,
    publicationGateRows: rowCounts.publicationGateRows,
    futurePostPublicationRows: rowCounts.futurePostPublicationRows,
    paidLlmApiUsed: 0,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const workqueueColumns = ['id', 'phase', 'workstream', 'artifact', 'row_count', 'responsible_role', 'required_fill', 'completion_rule', 'blocks', 'public_go_if_blank'];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'targetPath',
    'workqueueRows',
    'blockedGateRows',
    'totalRequiredFillRows',
    'focusedGscPasteRows',
    'lawyerReadinessRows',
    'legalEditorRows',
    'ownerScopeRows',
    'publicationGateRows',
    'futurePostPublicationRows',
    'publicChangesApproved',
    'cmsWritesApproved',
    'seoSettingsChanged',
    'crmRecordsCreated',
    'leadOrLawyerContactActions',
    'invoicesOrPaymentsCreated',
    'emailsSent',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, buildMarkdown({ summary, workqueueRows, gateRows }));
  writeText(outputs.projectCsv, toCsv(gateRows, gateColumns));
  writeText(outputs.workqueueCsv, toCsv(workqueueRows, workqueueColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gateRows, workqueueRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
