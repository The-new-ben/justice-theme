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
  const base = `tel-aviv-family-owner-publication-scope-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    fillTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-owner-publication-scope-fill-template-${reportDate}.csv`),
    reviewUrlChecklistCsv: path.join(ROOT, '.project-control', `tel-aviv-family-post-publication-review-checklist-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    publication: path.join(ROOT, '.reports', `tel-aviv-family-publication-review-packet-${sourceDate}.json`),
    gscOperator: path.join(ROOT, '.reports', `tel-aviv-family-focused-gsc-export-operator-packet-${sourceDate}.json`),
    lawyerReadiness: path.join(ROOT, '.reports', `tel-aviv-family-lawyer-readiness-owner-packet-${sourceDate}.json`),
    legalEditor: path.join(ROOT, '.reports', `tel-aviv-family-legal-editor-review-packet-${sourceDate}.json`),
    overlap: path.join(ROOT, '.reports', `tel-aviv-family-internal-overlap-review-${sourceDate}.json`),
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

function buildScopeRows({ publication, gscOperator, lawyerReadiness, legalEditor, overlap }) {
  const sourceStatuses = [
    `publication=${statusOf(publication)}`,
    `gsc=${statusOf(gscOperator)}`,
    `lawyer_readiness=${statusOf(lawyerReadiness)}`,
    `legal_editor=${statusOf(legalEditor)}`,
  ].join(' | ');

  return [
    {
      id: 'TA-OWNER-01',
      decision_area: 'target_url_and_route_creation',
      current_status: 'BLOCKED_OWNER_PUBLICATION_SCOPE_REQUIRED',
      required_owner_decision: `Approve, reject or park exact future target URL ${TARGET_PATH}.`,
      evidence_needed_before_yes: 'Focused GSC export rows filled; legal/editor fill template approved; lawyer readiness fill template approved.',
      allowed_if_owner_approves_later: 'Prepare an exact private CMS draft packet for the approved URL only.',
      forbidden_now: 'No CMS page, route creation, slug, redirect, canonical/noindex, sitemap, taxonomy or uPress action.',
      source_evidence: sourceStatuses,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-02',
      decision_area: 'content_scope',
      current_status: 'BLOCKED_SCOPE_REQUIRED',
      required_owner_decision: 'Approve whether the page may cover only local fit-check and request-preparation intent.',
      evidence_needed_before_yes: `Pillar ${PILLAR_PATH} remains primary; protected routes remain owners for custody, support, mediation, settlement, template and cost intent.`,
      allowed_if_owner_approves_later: 'Use local preparation, evidence checklist and directory handoff language only after legal/editor approval.',
      forbidden_now: 'No broad divorce guide, legal advice, deadline, price, guarantee, ranking or outcome language.',
      source_evidence: `${overlap.routeCount || 0} associated routes mapped; ${overlap.highRiskOverlapCount || 0} high-risk routes protected.`,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-03',
      decision_area: 'gsc_evidence_gate',
      current_status: 'BLOCKED_FOCUSED_GSC_EXPORT_FILL_REQUIRED',
      required_owner_decision: 'Confirm who will fill the GSC paste template and whether blank rows should keep the route private.',
      evidence_needed_before_yes: `${gscOperator.summary?.pasteTemplateRows || 0} paste rows filled across last 16 months and last 90 days, including target, pillar, protected pages and legacy/profile pages.`,
      allowed_if_owner_approves_later: 'Use filled GSC rows as input to a later private go/no-go packet.',
      forbidden_now: 'No publication, internal links, consolidation, redirect, canonical/noindex or sitemap decision from preliminary cache.',
      source_evidence: `Exact local cache rows: ${gscOperator.summary?.exactLocalCacheRows || 0}; prepared paste rows: ${gscOperator.summary?.pasteTemplateRows || 0}.`,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-04',
      decision_area: 'lawyer_coverage_readiness',
      current_status: 'BLOCKED_OWNER_ADMIN_READINESS_FILL_REQUIRED',
      required_owner_decision: 'Confirm owner/admin will verify each visible Tel Aviv family-law profile before coverage language is used.',
      evidence_needed_before_yes: `${lawyerReadiness.summary?.fillTemplateRows || 0} lawyer readiness rows filled from private admin evidence, with no contact detail export.`,
      allowed_if_owner_approves_later: 'Use neutral directory handoff language after all readiness rows are approved.',
      forbidden_now: 'No best/recommended/ranked/paid/sponsored/guaranteed/available claim and no lawyer contact or profile edit.',
      source_evidence: `${lawyerReadiness.summary?.extractedCardRows || 0} visible cards; ${lawyerReadiness.summary?.publicBasicOrClaimRows || 0} public-basic/claim-flow cards; ${lawyerReadiness.summary?.blockedRows || 0} blocked readiness gates.`,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-05',
      decision_area: 'legal_editor_approval',
      current_status: 'BLOCKED_HUMAN_REVIEW_REQUIRED',
      required_owner_decision: 'Assign or approve a legal/editor reviewer for all rows in the fill template.',
      evidence_needed_before_yes: `${legalEditor.summary?.fillTemplateRows || 0} legal/editor review rows filled with approve/revise/reject decisions.`,
      allowed_if_owner_approves_later: 'Use approved/revised rows only in a later exact CMS draft packet.',
      forbidden_now: 'No final article/content generation, public title/H1/meta/body, FAQ schema or legal-service claims.',
      source_evidence: `${legalEditor.summary?.humanReviewRequiredRows || 0} human-review rows; ${legalEditor.summary?.gscBlockedRows || 0} GSC-blocked rows; ${legalEditor.summary?.lawyerReadinessBlockedRows || 0} lawyer-readiness blocked rows.`,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-06',
      decision_area: 'internal_link_and_cta_scope',
      current_status: 'BLOCKED_OWNER_SEO_REVIEW_REQUIRED',
      required_owner_decision: `Approve exact future links only after GSC/legal/editor gates pass: ${PILLAR_PATH} and ${DIRECTORY_PATH}.`,
      evidence_needed_before_yes: 'SEO/editor confirms pillar protection, canonical directory path and no duplicate CTA density.',
      allowed_if_owner_approves_later: 'Prepare exact internal-link and CTA copy in a later private deploy packet.',
      forbidden_now: 'No link insertion, CTA change, redirect, canonical/noindex, sitemap, taxonomy or public navigation change.',
      source_evidence: `Directory path must stay ${DIRECTORY_PATH}; practice= alias remains unsupported/QA-only.`,
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-07',
      decision_area: 'post_publication_review_workflow',
      current_status: 'REFERENCE_ONLY_FUTURE_IF_DEPLOYED',
      required_owner_decision: 'Approve who reviews the page after any future owner-approved deployment.',
      evidence_needed_before_yes: 'Future review URL, visible title/H1/meta/body, internal links, directory handoff, associated route list and cannibalization checks.',
      allowed_if_owner_approves_later: 'After deployment only, send Hebrew email with review URL, summary and similar/cannibalizing pages if email policy requires it.',
      forbidden_now: 'No email, review URL claim, uPress pull or live QA because nothing was deployed.',
      source_evidence: 'Email workflow is documented for future approved public updates only.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-OWNER-08',
      decision_area: 'final_go_no_go',
      current_status: 'PUBLICATION_STILL_BLOCKED',
      required_owner_decision: 'Final owner decision must be approve / revise / reject / park after all evidence rows are filled.',
      evidence_needed_before_yes: 'Focused GSC, lawyer readiness, legal/editor decisions and owner scope all filled and reviewed together.',
      allowed_if_owner_approves_later: 'Only then prepare exact deployable CMS packet for owner review.',
      forbidden_now: 'No public route execution, CMS/database work, SEO setting changes, CRM/contact/payment/email or uPress action.',
      source_evidence: 'All source packets still record 0 public/CMS/SEO/CRM/contact/payment/email/uPress approvals.',
      public_go_if_blank: 'no',
    },
  ];
}

function buildFillRows(scopeRows) {
  return scopeRows.map((row) => ({
    decision_id: row.id,
    decision_area: row.decision_area,
    owner_decision: '',
    accepted_values: 'approve / revise / reject / park / needs_gsc / needs_lawyer_readiness / needs_legal_editor',
    owner_scope_notes_no_pii: '',
    required_followup_owner: '',
    can_prepare_private_cms_packet: 'no',
    public_go_if_blank: 'no',
  }));
}

function buildPostPublicationRows() {
  return [
    {
      id: 'TA-POST-01',
      future_check: 'review_url',
      required_if_deployed: `Record final review URL for ${TARGET_PATH}.`,
      similar_or_cannibalizing_pages_to_inspect: `${PILLAR_PATH} | /family-law/ | /child-custody/ | /child-support-calculator-2023/ | /divorce-mediation/ | /what-is-a-divorce-settlement-agreement/ | /free-divorce-agreement-template/ | /how-much-does-a-divorce-agreement-cost/`,
      current_status: 'not_deployed_not_applicable',
    },
    {
      id: 'TA-POST-02',
      future_check: 'title_h1_meta_body',
      required_if_deployed: 'Confirm final public title/H1/meta/body match owner/legal/editor approved packet only.',
      similar_or_cannibalizing_pages_to_inspect: `${PILLAR_PATH} and all protected family/divorce associated routes.`,
      current_status: 'not_deployed_not_applicable',
    },
    {
      id: 'TA-POST-03',
      future_check: 'internal_links_and_directory_handoff',
      required_if_deployed: `Confirm only approved links are present and directory path is ${DIRECTORY_PATH}.`,
      similar_or_cannibalizing_pages_to_inspect: `${PILLAR_PATH} | ${DIRECTORY_PATH}`,
      current_status: 'not_deployed_not_applicable',
    },
    {
      id: 'TA-POST-04',
      future_check: 'owner_email_if_public_update',
      required_if_deployed: 'Before any email, check Gmail for owner instruction emails; then send Hebrew review URL, content summary, concise review and cannibalization list if warranted.',
      similar_or_cannibalizing_pages_to_inspect: 'All protected associated routes in this checklist.',
      current_status: 'not_deployed_not_applicable_no_email_now',
    },
  ];
}

function buildGateRows({ scopeRows, gscOperator, lawyerReadiness, legalEditor }) {
  const blockers = [
    gscOperator.summary?.pasteTemplateRows ? 'focused_gsc_not_filled' : 'focused_gsc_template_missing',
    lawyerReadiness.summary?.blockedRows ? 'lawyer_readiness_not_filled' : '',
    legalEditor.summary?.blockedGateRows ? 'legal_editor_not_filled' : '',
    'owner_scope_not_filled',
  ].filter(Boolean);

  return [
    {
      id: 'TA-OWNER-GATE-01',
      gate: 'scope_rows_ready',
      status: 'PASS_SCOPE_TEMPLATE_READY',
      evidence: `${scopeRows.length} owner decision rows generated.`,
      next_action: 'Owner fills approve/revise/reject/park decisions.',
    },
    {
      id: 'TA-OWNER-GATE-02',
      gate: 'evidence_blockers_still_open',
      status: 'BLOCKED_EVIDENCE_ROWS_REQUIRED',
      evidence: blockers.join(' | '),
      next_action: 'Fill GSC, lawyer readiness, legal/editor and owner scope templates before any go decision.',
    },
    {
      id: 'TA-OWNER-GATE-03',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This packet writes private repo artifacts only and records 0 public/CMS/SEO/CRM/contact/payment/email/uPress approvals.',
      next_action: 'Keep the target private until a later explicit owner-approved deploy packet exists.',
    },
  ];
}

function statusFromGates(gateRows) {
  return gateRows.some((row) => row.status.startsWith('BLOCKED'))
    ? 'TEL_AVIV_FAMILY_OWNER_PUBLICATION_SCOPE_PACKET_BLOCKED_OWNER_AND_EVIDENCE_FILL_REQUIRED_NO_PUBLIC_CHANGE'
    : 'TEL_AVIV_FAMILY_OWNER_PUBLICATION_SCOPE_PACKET_READY_NO_PUBLIC_CHANGE';
}

function buildMarkdown({ reportDate, sourceDate, status, sources, gateRows, scopeRows, fillRows, postRows }) {
  const lines = [
    `# Tel Aviv Family Owner Publication Scope Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Target: ${TARGET_PATH}`,
    '',
    'Scope: private owner publication-scope decision packet only. It does not approve publication, create a CMS page, change title/H1/meta/body/internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, message, call paid LLM APIs, or deploy.',
    '',
    '## Source Chain',
    '',
    `- Publication review (${sourceDate}): ${statusOf(sources.publication)}`,
    `- Focused GSC operator (${sourceDate}): ${statusOf(sources.gscOperator)}`,
    `- Lawyer readiness (${sourceDate}): ${statusOf(sources.lawyerReadiness)}`,
    `- Legal/editor review (${sourceDate}): ${statusOf(sources.legalEditor)}`,
    `- Internal overlap (${sourceDate}): ${statusOf(sources.overlap)}`,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
    '',
    '## Owner Decision Rows',
    '',
    '| ID | Decision Area | Current Status | Required Owner Decision | Forbidden Now |',
    '| --- | --- | --- | --- | --- |',
    ...scopeRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.decision_area)} | ${mdCell(row.current_status)} | ${mdCell(row.required_owner_decision)} | ${mdCell(row.forbidden_now)} |`),
    '',
    '## Fillable Template',
    '',
    `Use .project-control/tel-aviv-family-owner-publication-scope-fill-template-${reportDate}.csv. ${fillRows.length} rows require owner decisions; blanks keep publication blocked.`,
    '',
    '## Future Post-Publication Checklist',
    '',
    '| ID | Future Check | Required If Deployed | Similar/Cannibalizing Pages | Current Status |',
    '| --- | --- | --- | --- | --- |',
    ...postRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.future_check)} | ${mdCell(row.required_if_deployed)} | ${mdCell(row.similar_or_cannibalizing_pages_to_inspect)} | ${mdCell(row.current_status)} |`),
    '',
    '## Decision',
    '',
    'This packet is the owner-facing scope gate for a future decision only. Publication remains blocked until focused GSC, lawyer readiness, legal/editor review and owner scope are all filled and reviewed together in a later private go/no-go packet.',
  ];

  return `${lines.join('\n')}\n`;
}

function assertNoReplacementCharacter(label, text) {
  if (text.includes('\uFFFD')) {
    throw new Error(`${label} contains a replacement character`);
  }
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-tel-aviv-family-owner-publication-scope-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const paths = sourceFiles(args.sourceDate);
  const sources = Object.fromEntries(Object.entries(paths).map(([key, filePath]) => [key, readJson(filePath)]));
  const scopeRows = buildScopeRows(sources);
  const fillRows = buildFillRows(scopeRows);
  const postRows = buildPostPublicationRows();
  const gateRows = buildGateRows({ ...sources, scopeRows });
  const status = statusFromGates(gateRows);
  const outputs = outputFiles(args.reportDate);

  const scopeColumns = ['id', 'decision_area', 'current_status', 'required_owner_decision', 'evidence_needed_before_yes', 'allowed_if_owner_approves_later', 'forbidden_now', 'source_evidence', 'public_go_if_blank'];
  const fillColumns = ['decision_id', 'decision_area', 'owner_decision', 'accepted_values', 'owner_scope_notes_no_pii', 'required_followup_owner', 'can_prepare_private_cms_packet', 'public_go_if_blank'];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const postColumns = ['id', 'future_check', 'required_if_deployed', 'similar_or_cannibalizing_pages_to_inspect', 'current_status'];

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    sourceStatuses: Object.fromEntries(Object.entries(sources).map(([key, report]) => [key, statusOf(report)])),
    ownerDecisionRows: scopeRows.length,
    ownerFillTemplateRows: fillRows.length,
    postPublicationChecklistRows: postRows.length,
    blockedGateRows: gateRows.filter((row) => row.status.startsWith('BLOCKED')).length,
    focusedGscPasteRows: sources.gscOperator.summary?.pasteTemplateRows || 0,
    lawyerReadinessBlockedRows: sources.lawyerReadiness.summary?.blockedRows || 0,
    legalEditorBlockedGateRows: sources.legalEditor.summary?.blockedGateRows || 0,
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
    files: {
      projectMd: path.relative(ROOT, outputs.projectMd),
      projectCsv: path.relative(ROOT, outputs.projectCsv),
      fillTemplateCsv: path.relative(ROOT, outputs.fillTemplateCsv),
      reviewUrlChecklistCsv: path.relative(ROOT, outputs.reviewUrlChecklistCsv),
      reportJson: path.relative(ROOT, outputs.reportJson),
      reportCsv: path.relative(ROOT, outputs.reportCsv),
    },
  };

  const markdown = buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, sources, gateRows, scopeRows, fillRows, postRows });
  const projectCsv = toCsv(scopeRows, scopeColumns);
  const fillCsv = toCsv(fillRows, fillColumns);
  const postCsv = toCsv(postRows, postColumns);
  const reportCsv = toCsv(gateRows, gateColumns);
  const reportJson = `${JSON.stringify({ summary, gateRows, scopeRows, fillRows, postRows, sourceFiles: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, path.relative(ROOT, value)])) }, null, 2)}\n`;

  assertNoReplacementCharacter('markdown', markdown);
  assertNoReplacementCharacter('projectCsv', projectCsv);
  assertNoReplacementCharacter('fillCsv', fillCsv);
  assertNoReplacementCharacter('postCsv', postCsv);
  assertNoReplacementCharacter('reportCsv', reportCsv);
  assertNoReplacementCharacter('reportJson', reportJson);

  writeText(outputs.projectMd, markdown);
  writeText(outputs.projectCsv, projectCsv);
  writeText(outputs.fillTemplateCsv, fillCsv);
  writeText(outputs.reviewUrlChecklistCsv, postCsv);
  writeText(outputs.reportJson, reportJson);
  writeText(outputs.reportCsv, reportCsv);

  console.log(JSON.stringify(summary, null, 2));
}

main();
