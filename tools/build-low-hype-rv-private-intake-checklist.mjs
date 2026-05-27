import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceGsc: '',
    sourceRouteOverlap: '',
    sourceSerp: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceGsc=')) {
      args.sourceGsc = arg.slice('--sourceGsc='.length);
    } else if (arg.startsWith('--sourceRouteOverlap=')) {
      args.sourceRouteOverlap = arg.slice('--sourceRouteOverlap='.length);
    } else if (arg.startsWith('--sourceSerp=')) {
      args.sourceSerp = arg.slice('--sourceSerp='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (!args.sourceGsc) {
    args.sourceGsc = path.join(ROOT, '.reports', `low-hype-rv-gsc-evidence-request-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceGsc)) {
    args.sourceGsc = path.join(ROOT, args.sourceGsc);
  }

  if (!args.sourceRouteOverlap) {
    args.sourceRouteOverlap = path.join(ROOT, '.reports', `low-hype-rv-internal-route-overlap-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceRouteOverlap)) {
    args.sourceRouteOverlap = path.join(ROOT, args.sourceRouteOverlap);
  }

  if (!args.sourceSerp) {
    args.sourceSerp = path.join(ROOT, '.reports', `low-hype-rv-serp-cannibalization-packet-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceSerp)) {
    args.sourceSerp = path.join(ROOT, args.sourceSerp);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `low-hype-rv-private-intake-checklist-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `low-hype-rv-private-intake-template-${reportDate}.csv`),
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

function sourceContext(gsc, routeOverlap, serp) {
  return [
    `GSC: ${gsc.summary?.status || 'missing status'}`,
    `routes: ${routeOverlap.summary?.status || 'missing status'}`,
    `SERP: ${serp.summary?.status || 'missing status'}`,
  ].join(' | ');
}

function buildChecklistRows({ gsc, routeOverlap, serp }) {
  const context = sourceContext(gsc, routeOverlap, serp);

  return [
    {
      id: 'INTAKE-01',
      stage: 'permission_and_source',
      question_or_check: 'Is this a current inbound person asking for help now, or an old WhatsApp/TalkTo lead?',
      allowed_response: 'Current inbound may continue only after explicit permission to check lawyer/supplier fit. Old leads require re-permission first.',
      private_note_no_pii: 'Record source channel, date bucket and permission status only; do not paste full chat content into a shared packet.',
      route_or_owner_decision: 'Use private intake only; no public copy or CRM import is approved by this checklist.',
      blocker: 'Missing explicit permission or owner-approved re-permission path.',
      forbidden_action: 'Do not contact old leads, lawyers or suppliers from this row.',
      source_context: context,
    },
    {
      id: 'INTAKE-02',
      stage: 'problem_classification',
      question_or_check: 'Is the problem limited to rental, deposit, post-return charge, cancellation, refund, damage charge or rental terms?',
      allowed_response: 'Yes means candidate for the narrow private RV rental/deposit/charge pilot. No means park or route to separate review.',
      private_note_no_pii: 'Use category labels only; avoid names, phones, emails, vehicle plates or full booking numbers.',
      route_or_owner_decision: 'Preferred private path maps to consumer/rental surfaces, not a standalone RV route.',
      blocker: 'Insurance, accident, injury or traffic facts appear in the same story.',
      forbidden_action: 'Do not merge accident, insurance or traffic matters into this first pilot.',
      source_context: 'SERP packet recommends rental/deposit/charge only as first pilot.',
    },
    {
      id: 'INTAKE-03',
      stage: 'evidence_summary',
      question_or_check: 'Which neutral evidence exists: agreement, booking confirmation, invoice, photos, supplier messages, chargeback/refund attempt, dates and amount?',
      allowed_response: 'Collect a short no-PII evidence checklist before legal or partner preview.',
      private_note_no_pii: 'Use amount range, country, supplier type and document yes/no flags; store sensitive files only in approved private systems.',
      route_or_owner_decision: 'Evidence checklist can prepare a later lawyer review but does not create legal advice.',
      blocker: 'No agreement, no invoice and no charge detail yet.',
      forbidden_action: 'Do not forward private evidence to a lawyer/supplier until permission and owner release exist.',
      source_context: 'Supplier terms rows in SERP packet support evidence-first triage.',
    },
    {
      id: 'INTAKE-04',
      stage: 'value_and_suitability',
      question_or_check: 'Is the disputed amount and urgency suitable for paid help, small-claims guidance, or owner hold?',
      allowed_response: 'Classify as low, medium or high value; recommend no guarantee and no automatic paid handoff.',
      private_note_no_pii: 'Use currency and amount band, not card digits or payment screenshots in shared reports.',
      route_or_owner_decision: 'Owner decides whether this is worth a controlled private pilot before any public page work.',
      blocker: 'Value too low, facts unclear, or urgency needs a licensed lawyer immediately.',
      forbidden_action: 'Do not promise recovery, price, timeline or lawyer acceptance.',
      source_context: context,
    },
    {
      id: 'INTAKE-05',
      stage: 'legal_review_gate',
      question_or_check: 'Has a licensed/legal reviewer approved the exact positioning before demand-letter, claim or negotiation wording?',
      allowed_response: 'Proceed only to owner-review/private legal-review queue; public advice remains blocked.',
      private_note_no_pii: 'Keep the summary factual and neutral until legal review decides the path.',
      route_or_owner_decision: 'Legal review required before demand-letter or claim-position language.',
      blocker: 'No legal review owner marked.',
      forbidden_action: 'Do not generate public advice, coverage advice, demand letter text or claim text from this checklist.',
      source_context: 'Public RV copy remains blocked by GSC and legal review.',
    },
    {
      id: 'INTAKE-06',
      stage: 'partner_preview',
      question_or_check: 'Can a lawyer or supplier receive only anonymized facts before client identity is released?',
      allowed_response: 'Yes, only after permission, partner terms status and owner release are recorded.',
      private_note_no_pii: 'Preview should use issue type, country, amount band, document flags and urgency only.',
      route_or_owner_decision: 'Use no-PII preview first; release identity only after all gates pass.',
      blocker: 'No accepted partner terms or no explicit client permission.',
      forbidden_action: 'Do not send name, phone, email, chat transcript, booking number or files to a partner.',
      source_context: 'WhatsApp/TalkTo runbook requires no-PII partner preview and terms.',
    },
    {
      id: 'INTAKE-07',
      stage: 'billing_and_payment_proof',
      question_or_check: 'Are accepted terms, billing contact, invoice reference and payment proof available?',
      allowed_response: 'Count invoice-stage follow-up from invoice/reference; count paid money only after private payment proof exists.',
      private_note_no_pii: 'Store proof reference, not sensitive payment details, in the shared checklist.',
      route_or_owner_decision: 'Revenue is not counted until proof exists in the approved admin flow.',
      blocker: 'No invoice reference, no payment evidence or no accepted partner terms.',
      forbidden_action: 'Do not mark paid, claim revenue or route as paid lead without private payment proof.',
      source_context: 'CRM runbook billing proof gate remains required.',
    },
    {
      id: 'INTAKE-08',
      stage: 'legacy_lead_repermission',
      question_or_check: 'For past WhatsApp/TalkTo leads, is there a fresh permission message or owner-approved re-permission workflow?',
      allowed_response: 'If yes, continue as current inbound only after the new permission. If no, keep parked.',
      private_note_no_pii: 'Use batch label and re-permission status only.',
      route_or_owner_decision: 'Legacy rows default to hold; no retroactive matching.',
      blocker: 'Old lead without fresh permission.',
      forbidden_action: 'Do not bulk message, import, match, call or email old leads from this checklist.',
      source_context: 'Owner explicitly flagged permission risk for past untreated clients.',
    },
    {
      id: 'INTAKE-09',
      stage: 'public_site_boundary',
      question_or_check: 'Does this intake evidence justify a public page or public section today?',
      allowed_response: 'No. Keep private-only until GSC export, owner decision and legal review approve exact text.',
      private_note_no_pii: 'Use private learnings only to decide whether a future public-review packet is worth drafting.',
      route_or_owner_decision: 'No standalone RV route; possible future tiny section on consumer/rental pages only after approval.',
      blocker: 'GSC export template is not filled.',
      forbidden_action: 'Do not change title, H1, meta, URL, internal links, canonical, sitemap or CMS content.',
      source_context: 'GSC evidence request status: export not filled.',
    },
    {
      id: 'INTAKE-10',
      stage: 'blocked_path_escalation',
      question_or_check: 'Does the story include insurance coverage, accident, injury, traffic fine, criminal/regulatory or urgent limitation-period facts?',
      allowed_response: 'Escalate out of the Low Hype RV rental pilot and park for specialist review.',
      private_note_no_pii: 'Tag the issue family only and keep sensitive facts in approved private systems.',
      route_or_owner_decision: 'Separate review required; not part of first rental/deposit/charge pilot.',
      blocker: 'Specialist legal path needed.',
      forbidden_action: 'Do not treat specialist cases as consumer/rental managed-service leads without legal review.',
      source_context: 'SERP and route packets flag insurance/traffic/accident cannibalization risk.',
    },
  ];
}

function buildTemplateRows(checklistRows) {
  return checklistRows.map((row) => ({
    intake_check_id: row.id,
    source_channel: '',
    inbound_or_legacy: '',
    permission_status: '',
    problem_category: '',
    evidence_flags_no_pii: '',
    amount_band: '',
    urgency_band: '',
    owner_decision: 'not_filled',
    partner_preview_status: 'not_started',
    billing_proof_status: 'not_started',
    public_action_approved: 'no',
    operator_note_no_pii: '',
  }));
}

function buildSummary(reportDate, checklistRows, templateRows, sourceData) {
  return {
    reportDate,
    status: 'PRIVATE_INTAKE_CHECKLIST_READY_NO_PUBLIC_OR_CRM_ACTION',
    checklistRows: checklistRows.length,
    templateRows: templateRows.length,
    sourceGscStatus: sourceData.gsc.summary?.status || '',
    sourceRouteOverlapStatus: sourceData.routeOverlap.summary?.status || '',
    sourceSerpStatus: sourceData.serp.summary?.status || '',
    publicChangesApproved: 0,
    crmRecordsCreated: 0,
    leadsContacted: 0,
    lawyersOrSuppliersContacted: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    gscApiCalled: 0,
    emailSent: 0,
    upressDeploymentRequired: false,
  };
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownReport(summary, checklistRows, templateRows) {
  return [
    `# Low Hype / RV Private Intake Checklist - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private intake and consent checklist only. This does not create CRM records, contact old leads, contact lawyers or suppliers, send email/WhatsApp/TalkTo messages, invoice, mark paid, publish public content or deploy.',
    '',
    '## Working Decision',
    '',
    'Use this only for a narrow private RV rental/deposit/charge triage path. It is not a public page plan, not a legal-advice draft and not permission to process legacy chats.',
    '',
    '## Source Gates',
    '',
    `- GSC evidence request: ${summary.sourceGscStatus}`,
    `- Internal route overlap: ${summary.sourceRouteOverlapStatus}`,
    `- SERP/cannibalization packet: ${summary.sourceSerpStatus}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    `- CRM records or outreach actions approved: ${summary.crmRecordsCreated}`,
    '',
    '## Checklist',
    '',
    '| ID | Stage | Question / Check | Allowed Response | Blocker | Forbidden Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...checklistRows.map((row) =>
      `| ${row.id} | ${mdCell(row.stage)} | ${mdCell(row.question_or_check)} | ${mdCell(row.allowed_response)} | ${mdCell(row.blocker)} | ${mdCell(row.forbidden_action)} |`
    ),
    '',
    '## Operator Template',
    '',
    `Blank no-PII template rows generated in \`.project-control/low-hype-rv-private-intake-template-${summary.reportDate}.csv\`: ${templateRows.length}.`,
    '',
    '## Review Notes',
    '',
    '- Current inbound users can be triaged only when they explicitly ask for help and permission is recorded.',
    '- Old WhatsApp/TalkTo leads stay parked until a fresh re-permission path is approved.',
    '- Accident, insurance, injury and traffic paths are outside this first pilot and require separate specialist review.',
    '- Public RV copy remains blocked until the GSC export is filled and owner/legal review approve exact placement.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-low-hype-rv-private-intake-checklist.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const sourceData = {
  gsc: readJson(args.sourceGsc),
  routeOverlap: readJson(args.sourceRouteOverlap),
  serp: readJson(args.sourceSerp),
};
const checklistRows = buildChecklistRows(sourceData);
const templateRows = buildTemplateRows(checklistRows);
const summary = buildSummary(args.reportDate, checklistRows, templateRows, sourceData);
const files = outputFiles(args.reportDate);
const checklistColumns = [
  'id',
  'stage',
  'question_or_check',
  'allowed_response',
  'private_note_no_pii',
  'route_or_owner_decision',
  'blocker',
  'forbidden_action',
  'source_context',
];
const templateColumns = [
  'intake_check_id',
  'source_channel',
  'inbound_or_legacy',
  'permission_status',
  'problem_category',
  'evidence_flags_no_pii',
  'amount_band',
  'urgency_band',
  'owner_decision',
  'partner_preview_status',
  'billing_proof_status',
  'public_action_approved',
  'operator_note_no_pii',
];

const checklistCsv = toCsv(checklistRows, checklistColumns);

writeText(files.projectMd, markdownReport(summary, checklistRows, templateRows));
writeText(files.projectCsv, checklistCsv);
writeText(files.reportJson, `${JSON.stringify({ summary, checklistRows, templateRows }, null, 2)}\n`);
writeText(files.reportCsv, checklistCsv);
writeText(files.templateCsv, toCsv(templateRows, templateColumns));

console.log(JSON.stringify({ ...summary, files }, null, 2));
