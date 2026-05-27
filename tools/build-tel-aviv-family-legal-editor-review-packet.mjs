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
  const base = `tel-aviv-family-legal-editor-review-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    fillTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-legal-editor-fill-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    publication: path.join(ROOT, '.reports', `tel-aviv-family-publication-review-packet-${sourceDate}.json`),
    draft: path.join(ROOT, '.reports', `tel-aviv-family-local-draft-packet-${sourceDate}.json`),
    overlap: path.join(ROOT, '.reports', `tel-aviv-family-internal-overlap-review-${sourceDate}.json`),
    gscOperator: path.join(ROOT, '.reports', `tel-aviv-family-focused-gsc-export-operator-packet-${sourceDate}.json`),
    lawyerReadiness: path.join(ROOT, '.reports', `tel-aviv-family-lawyer-readiness-owner-packet-${sourceDate}.json`),
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

function packetRowBySection(draft, section) {
  return (draft.packetRows || []).find((row) => row.section === section) || {};
}

function officialSourceSummary(draft) {
  return (draft.sourceRows || [])
    .filter((row) => row.type === 'official')
    .map((row) => `${row.title}: ${row.useFor}; boundary=${row.boundary}`)
    .join(' | ');
}

function competitorSourceSummary(draft) {
  return (draft.sourceRows || [])
    .filter((row) => row.type === 'competitor')
    .map((row) => `${row.title}: ${row.useFor}; boundary=${row.boundary}`)
    .join(' | ');
}

function protectedRoutesSummary(overlap) {
  return (overlap.overlapRows || [])
    .filter((row) => String(row.status || '').includes('PROTECT') || String(row.risk || '').toLowerCase().includes('high'))
    .slice(0, 10)
    .map((row) => `${row.route || row.path || row.url || row.id}: ${row.intent_owner || row.owner || row.action || row.status}`)
    .join(' | ') || `${overlap.routeCount || 0} associated route(s), ${overlap.highRiskOverlapCount || 0} high-risk route(s) protected.`;
}

function buildReviewRows({ draft, overlap, gscOperator, lawyerReadiness }) {
  const routeRole = packetRowBySection(draft, 'route_role');
  const opening = packetRowBySection(draft, 'safe_private_opening');
  const checklist = packetRowBySection(draft, 'reader_evidence_checklist');
  const fitTrigger = packetRowBySection(draft, 'lawyer_fit_trigger');
  const links = packetRowBySection(draft, 'internal_link_plan');
  const faqs = packetRowBySection(draft, 'faq_candidates');
  const official = packetRowBySection(draft, 'official_source_boundaries');
  const competitor = packetRowBySection(draft, 'competitor_source_boundaries');
  const blockers = packetRowBySection(draft, 'publication_blockers');

  return [
    {
      id: 'TA-LEGAL-01',
      section: 'title_h1_and_route_role',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: `${draft.targetTitle || ''} | ${routeRole.value || ''}`,
      source_basis: 'local private draft route role and target title',
      review_focus: `Confirm local page stays subordinate to ${PILLAR_PATH} and does not become a general divorce guide.`,
      forbidden_claims_or_changes: 'No public title, H1, meta, slug, route, canonical/noindex, sitemap or internal-link change from this packet.',
      required_before_publication: 'Legal/editor approves exact title, H1 and route role after GSC and owner scope are filled.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-02',
      section: 'intro_opening',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: opening.value || '',
      source_basis: opening.source || 'local private draft packet',
      review_focus: 'Confirm wording is informational, local-fit oriented and not legal advice.',
      forbidden_claims_or_changes: 'No guarantee, deadline, court/local-office claim, price, ranking, best-lawyer or outcome claim.',
      required_before_publication: 'Reviewer approves, revises or rejects intro text.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-03',
      section: 'preparation_checklist',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: checklist.value || '',
      source_basis: checklist.source || 'local private draft packet',
      review_focus: 'Confirm checklist is framed as preparation only and does not say every item is legally required.',
      forbidden_claims_or_changes: 'No mandatory-process claim unless official source and legal review support it for the exact case type.',
      required_before_publication: 'Reviewer approves checklist scope and caveat language.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-04',
      section: 'lawyer_fit_trigger',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: fitTrigger.value || '',
      source_basis: fitTrigger.source || 'local private draft packet',
      review_focus: 'Confirm when-to-contact wording is careful and does not imply urgency, SLA, availability or result.',
      forbidden_claims_or_changes: 'No emergency, response-time, success, suitability guarantee or availability promise.',
      required_before_publication: 'Reviewer approves trigger wording and CTA boundaries.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-05',
      section: 'internal_links_and_cta_boundaries',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: links.value || `${PILLAR_PATH} | ${DIRECTORY_PATH}`,
      source_basis: links.source || 'local private draft packet',
      review_focus: 'Confirm any future link plan protects the pillar and uses only canonical area= directory path.',
      forbidden_claims_or_changes: 'No internal link, CTA, route, redirect, canonical/noindex, sitemap or taxonomy change from this packet.',
      required_before_publication: 'SEO/editor and owner approve exact links and CTA copy later.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-06',
      section: 'faq_candidates',
      status: 'BLOCKED_GSC_OR_OWNER_EVIDENCE_REQUIRED',
      current_private_material: faqs.value || '',
      source_basis: faqs.source || 'local private draft packet',
      review_focus: 'FAQ candidates need GSC, lead, owner or legal/editor evidence before use.',
      forbidden_claims_or_changes: 'No FAQ schema or public FAQ body until evidence and legal/editor review are complete.',
      required_before_publication: 'Reviewer approves, revises or rejects FAQ candidates after focused GSC rows are filled.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-07',
      section: 'official_source_boundaries',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: official.value || officialSourceSummary(draft),
      source_basis: 'official source rows in local private draft packet',
      review_focus: 'Confirm official sources are used only for document/checklist/service-context boundaries.',
      forbidden_claims_or_changes: 'No eligibility, mandatory-process, deadline or certificate-service claim beyond source-supported wording.',
      required_before_publication: 'Reviewer approves exact source-supported statements and excludes unsupported legal advice.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-08',
      section: 'competitor_source_boundaries',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: competitor.value || competitorSourceSummary(draft),
      source_basis: 'competitor context rows in local private draft packet',
      review_focus: 'Use competitor pages only for SERP context; do not copy claims or positioning.',
      forbidden_claims_or_changes: 'No copied testimonials, rankings, case outcomes, badges, price ranges or personal positioning.',
      required_before_publication: 'Reviewer confirms competitor material is not copied or paraphrased as claims.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-09',
      section: 'protected_route_overlap',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: protectedRoutesSummary(overlap),
      source_basis: 'internal overlap review',
      review_focus: 'Confirm custody, child support, mediation, settlement, template and cost intents stay with existing route owners.',
      forbidden_claims_or_changes: 'No absorbing protected route intent into the Tel Aviv local page without explicit legal/editor approval.',
      required_before_publication: 'Reviewer marks preserve/reference/exclude for every protected intent touched by copy.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-10',
      section: 'lawyer_coverage_language',
      status: lawyerReadiness.summary?.blockedRows ? 'BLOCKED_OWNER_ADMIN_READINESS_REQUIRED' : 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: `${lawyerReadiness.summary?.extractedCardRows || 0} visible card rows; ${lawyerReadiness.summary?.publicBasicOrClaimRows || 0} public-basic/claim-flow rows still need owner/admin verification.`,
      source_basis: 'lawyer readiness owner packet',
      review_focus: 'Confirm the page does not imply selected, ranked, paid, sponsored, verified, available or guaranteed coverage.',
      forbidden_claims_or_changes: 'No best/recommended/ranked/sponsored/paid/guaranteed language; no contact details or lawyer outreach.',
      required_before_publication: 'Owner/admin fills readiness rows before reviewer approves any coverage language.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-11',
      section: 'gsc_dependency_and_query_scope',
      status: 'BLOCKED_FOCUSED_GSC_EXPORT_REQUIRED',
      current_private_material: `${gscOperator.summary?.pasteTemplateRows || 0} focused GSC paste rows prepared; exact local cache rows remain ${gscOperator.summary?.exactLocalCacheRows || 0}.`,
      source_basis: 'focused GSC export operator packet',
      review_focus: 'Confirm final copy and FAQ choices wait for focused GSC evidence.',
      forbidden_claims_or_changes: 'No publication, FAQ/schema, internal links, consolidation, redirect, canonical/noindex or sitemap decision from preliminary cache.',
      required_before_publication: 'Focused GSC exports must be filled before final legal/editor approval.',
      public_go_if_blank: 'no',
    },
    {
      id: 'TA-LEGAL-12',
      section: 'final_disclaimer_and_forbidden_claims',
      status: 'HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED',
      current_private_material: blockers.value || '',
      source_basis: blockers.source || 'local private draft packet',
      review_focus: 'Confirm final disclaimer and forbidden-claim list for a local legal-services page.',
      forbidden_claims_or_changes: 'No legal advice, outcome guarantee, price, deadline, urgent SLA, ranking, recommendation, paid proof, profile availability or unsupported court/local-office claim.',
      required_before_publication: 'Reviewer approves final no-advice/no-guarantee boundaries.',
      public_go_if_blank: 'no',
    },
  ];
}

function buildGateRows({ publication, gscOperator, lawyerReadiness, legalRows }) {
  return [
    {
      id: 'TA-LEG-GATE-01',
      gate: 'source_packets_available',
      status: 'PASS',
      evidence: `Publication=${statusOf(publication)}; GSC=${statusOf(gscOperator)}; lawyer readiness=${statusOf(lawyerReadiness)}.`,
      next_action: 'Use this packet as the legal/editor review surface only.',
    },
    {
      id: 'TA-LEG-GATE-02',
      gate: 'human_legal_editor_review_required',
      status: 'BLOCKED_REVIEWER_REQUIRED',
      evidence: `${legalRows.length} legal/editor review rows generated; none are human-approved.`,
      next_action: 'Legal/editor fills the review template with approve/revise/reject decisions.',
    },
    {
      id: 'TA-LEG-GATE-03',
      gate: 'focused_gsc_still_required',
      status: gscOperator.summary?.pasteTemplateRows ? 'BLOCKED_FOCUSED_GSC_EXPORT_FILL_REQUIRED' : 'BLOCKED_GSC_OPERATOR_MISSING',
      evidence: `${gscOperator.summary?.pasteTemplateRows || 0} GSC paste rows are prepared, but not filled.`,
      next_action: 'Do not approve FAQ/title/link scope until focused GSC rows are filled.',
    },
    {
      id: 'TA-LEG-GATE-04',
      gate: 'lawyer_readiness_still_required',
      status: lawyerReadiness.summary?.blockedRows ? 'BLOCKED_OWNER_ADMIN_READINESS_FILL_REQUIRED' : 'REVIEW_READY',
      evidence: `${lawyerReadiness.summary?.blockedRows || 0} lawyer readiness gate(s) remain blocked.`,
      next_action: 'Owner/admin fills lawyer readiness template before coverage language is approved.',
    },
    {
      id: 'TA-LEG-GATE-05',
      gate: 'no_public_or_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This packet writes private repo artifacts only and authorizes 0 public/CMS/SEO/CRM/contact/payment/email/uPress actions.',
      next_action: 'Keep all output private until owner explicitly approves publication scope.',
    },
  ];
}

function buildFillRows(legalRows) {
  return legalRows.map((row) => ({
    review_id: row.id,
    section: row.section,
    current_private_material: row.current_private_material,
    legal_editor_decision: '',
    accepted_values: 'approve / revise / reject / needs_gsc / needs_owner_admin / needs_owner_scope',
    required_edits_no_pii: '',
    source_boundary_notes: '',
    final_text_or_instruction_no_pii: '',
    reviewer_name_or_role: '',
    review_date: '',
    public_go_if_blank: 'no',
  }));
}

function statusFromGates(gateRows) {
  return gateRows.some((row) => row.status.startsWith('BLOCKED'))
    ? 'TEL_AVIV_FAMILY_LEGAL_EDITOR_REVIEW_PACKET_BLOCKED_HUMAN_REVIEW_REQUIRED_NO_PUBLIC_CHANGE'
    : 'TEL_AVIV_FAMILY_LEGAL_EDITOR_REVIEW_PACKET_READY_NO_PUBLIC_CHANGE';
}

function buildMarkdown({ reportDate, sourceDate, status, sources, gateRows, legalRows, fillRows }) {
  const lines = [
    `# Tel Aviv Family Legal Editor Review Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Target: ${TARGET_PATH}`,
    '',
    'Scope: private legal/editor review packet only. It does not generate final article content, call paid LLM APIs, publish CMS content, change title/H1/meta/body/internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, message, or deploy.',
    '',
    '## Source Chain',
    '',
    `- Publication review (${sourceDate}): ${statusOf(sources.publication)}`,
    `- Local draft packet (${sourceDate}): ${statusOf(sources.draft)}`,
    `- Internal overlap review (${sourceDate}): ${statusOf(sources.overlap)}`,
    `- GSC export operator (${sourceDate}): ${statusOf(sources.gscOperator)}`,
    `- Lawyer readiness owner packet (${sourceDate}): ${statusOf(sources.lawyerReadiness)}`,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
    '',
    '## Legal Editor Review Rows',
    '',
    '| ID | Section | Status | Review Focus | Forbidden Claims Or Changes |',
    '| --- | --- | --- | --- | --- |',
    ...legalRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.section)} | ${mdCell(row.status)} | ${mdCell(row.review_focus)} | ${mdCell(row.forbidden_claims_or_changes)} |`),
    '',
    '## Fillable Template',
    '',
    `Use .project-control/tel-aviv-family-legal-editor-fill-template-${reportDate}.csv. ${fillRows.length} rows require human legal/editor decisions; blanks keep publication blocked.`,
    '',
    '## Decision',
    '',
    'This packet narrows the legal/editor review work to exact rows, but it does not approve publication. Focused GSC rows, owner/admin lawyer readiness, legal/editor decisions and explicit owner publication scope are still required before any public page work.',
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
    console.log('Usage: node tools/build-tel-aviv-family-legal-editor-review-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const paths = sourceFiles(args.sourceDate);
  const sources = Object.fromEntries(Object.entries(paths).map(([key, filePath]) => [key, readJson(filePath)]));
  const legalRows = buildReviewRows(sources);
  const gateRows = buildGateRows({ ...sources, legalRows });
  const fillRows = buildFillRows(legalRows);
  const status = statusFromGates(gateRows);
  const outputs = outputFiles(args.reportDate);

  const reviewColumns = ['id', 'section', 'status', 'current_private_material', 'source_basis', 'review_focus', 'forbidden_claims_or_changes', 'required_before_publication', 'public_go_if_blank'];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const fillColumns = ['review_id', 'section', 'current_private_material', 'legal_editor_decision', 'accepted_values', 'required_edits_no_pii', 'source_boundary_notes', 'final_text_or_instruction_no_pii', 'reviewer_name_or_role', 'review_date', 'public_go_if_blank'];

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    sourceStatuses: Object.fromEntries(Object.entries(sources).map(([key, report]) => [key, statusOf(report)])),
    reviewRows: legalRows.length,
    fillTemplateRows: fillRows.length,
    blockedGateRows: gateRows.filter((row) => row.status.startsWith('BLOCKED')).length,
    humanReviewRequiredRows: legalRows.filter((row) => row.status.includes('HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED')).length,
    gscBlockedRows: legalRows.filter((row) => row.status.includes('GSC')).length,
    lawyerReadinessBlockedRows: legalRows.filter((row) => row.status.includes('OWNER_ADMIN')).length,
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
      reportJson: path.relative(ROOT, outputs.reportJson),
      reportCsv: path.relative(ROOT, outputs.reportCsv),
    },
  };

  const markdown = buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, sources, gateRows, legalRows, fillRows });
  const projectCsv = toCsv(legalRows, reviewColumns);
  const fillCsv = toCsv(fillRows, fillColumns);
  const reportCsv = toCsv(gateRows, gateColumns);
  const reportJson = `${JSON.stringify({ summary, gateRows, legalRows, fillRows, sourceFiles: Object.fromEntries(Object.entries(paths).map(([key, value]) => [key, path.relative(ROOT, value)])) }, null, 2)}\n`;

  assertNoReplacementCharacter('markdown', markdown);
  assertNoReplacementCharacter('projectCsv', projectCsv);
  assertNoReplacementCharacter('fillCsv', fillCsv);
  assertNoReplacementCharacter('reportCsv', reportCsv);
  assertNoReplacementCharacter('reportJson', reportJson);

  writeText(outputs.projectMd, markdown);
  writeText(outputs.projectCsv, projectCsv);
  writeText(outputs.fillTemplateCsv, fillCsv);
  writeText(outputs.reportJson, reportJson);
  writeText(outputs.reportCsv, reportCsv);

  console.log(JSON.stringify(summary, null, 2));
}

main();
