import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const SOURCE_KEYS = {
  opportunity: 'low-hype-rv-opportunity-brief',
  serp: 'low-hype-rv-serp-cannibalization-packet',
  routeOverlap: 'low-hype-rv-internal-route-overlap',
  gsc: 'low-hype-rv-gsc-evidence-request',
  intake: 'low-hype-rv-private-intake-checklist',
};

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
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

function sourcePath(sourceKey, reportDate) {
  return path.join(ROOT, '.reports', `${sourceKey}-${reportDate}.json`);
}

function outputFiles(reportDate) {
  const base = `low-hype-rv-first-pilot-decision-queue-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerDecisionCsv: path.join(ROOT, '.project-control', `low-hype-rv-owner-decision-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
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

function sourceStatuses(sources) {
  return {
    opportunityStatus: sources.opportunity.summary?.status || '',
    serpStatus: sources.serp.summary?.status || '',
    routeOverlapStatus: sources.routeOverlap.summary?.status || '',
    gscStatus: sources.gsc.summary?.status || '',
    intakeStatus: sources.intake.summary?.status || '',
    recommendedFirstPilot: sources.serp.summary?.recommendedFirstPilot || sources.routeOverlap.summary?.sourceSerpRecommendation || '',
    routeRecommendation: sources.routeOverlap.summary?.recommendedDecision || '',
  };
}

function buildDecisionRows(statuses) {
  return [
    {
      id: 'QUEUE-01',
      decision_area: 'low_hype_visibility',
      current_evidence: 'Low Hype is useful as a private operating label, but public users should only see legal-help language.',
      owner_decision_needed: 'Confirm Low Hype remains internal-only for now.',
      default_safe_decision: 'Keep internal-only.',
      allowed_next_action: 'Use Low Hype as a private prioritization tag in Linear and repo packets.',
      blocked_action: 'Do not publish Low Hype navigation, public brand copy, public route, metadata or CTA wording.',
      status: 'OWNER_DECISION_REQUIRED',
      source_anchor: statuses.opportunityStatus,
    },
    {
      id: 'QUEUE-02',
      decision_area: 'first_pilot_topic',
      current_evidence: statuses.recommendedFirstPilot || 'Prior packets point to RV rental/deposit/charge dispute as the narrowest candidate.',
      owner_decision_needed: 'Approve, reject or park RV rental/deposit/charge as the only first pilot.',
      default_safe_decision: 'Park until GSC/export evidence is filled.',
      allowed_next_action: 'If owner approves, continue only as private evidence and owner-review intake.',
      blocked_action: 'Do not open accident, insurance, traffic, import or municipal-fine tracks as part of the first pilot.',
      status: 'OWNER_DECISION_REQUIRED',
      source_anchor: statuses.serpStatus,
    },
    {
      id: 'QUEUE-03',
      decision_area: 'gsc_export_gate',
      current_evidence: 'The GSC template exists, but query/page rows are not filled.',
      owner_decision_needed: 'Export/paste Search Console rows for caravan/RV/rental/deposit/charge plus candidate pages.',
      default_safe_decision: 'No public copy while export is empty.',
      allowed_next_action: 'Fill the private GSC template and classify every row by route family.',
      blocked_action: 'Do not write title, H1, meta, public section, internal link, canonical, sitemap or CMS copy before GSC review.',
      status: 'BLOCKED_PENDING_GSC_EXPORT',
      source_anchor: statuses.gscStatus,
    },
    {
      id: 'QUEUE-04',
      decision_area: 'route_owner',
      current_evidence: 'Route overlap found consumer-rights as the primary surface and rental-agreement as an adjacent surface; no existing RV marker route was found.',
      owner_decision_needed: 'Choose whether an approved pilot would attach to consumer-rights, rental-agreement or stay private-only.',
      default_safe_decision: 'No standalone RV route.',
      allowed_next_action: 'Prepare only a route-decision map after GSC/legal review if evidence supports public work.',
      blocked_action: 'Do not create a standalone RV/caravan/campervan URL from the current evidence.',
      status: 'ROUTE_DECISION_BLOCKED',
      source_anchor: statuses.routeOverlapStatus,
    },
    {
      id: 'QUEUE-05',
      decision_area: 'legal_category',
      current_evidence: 'SERP and route packets show mixed consumer, rental, insurance, accident and traffic intent.',
      owner_decision_needed: 'Legal/editor reviewer must confirm whether the first pilot is consumer/rental only.',
      default_safe_decision: 'Consumer/rental candidate only; specialist paths parked.',
      allowed_next_action: 'Escalate insurance, accident, injury, traffic or urgent limitation facts out of this pilot.',
      blocked_action: 'Do not publish legal advice, demand-letter wording, insurance coverage guidance or outcome claims.',
      status: 'LEGAL_REVIEW_REQUIRED',
      source_anchor: `${statuses.serpStatus} | ${statuses.routeOverlapStatus}`,
    },
    {
      id: 'QUEUE-06',
      decision_area: 'private_intake_and_consent',
      current_evidence: 'Private intake checklist is ready for current inbound only; legacy WhatsApp/TalkTo rows need fresh permission.',
      owner_decision_needed: 'Approve the exact no-PII intake fields and re-permission policy before any real lead handling.',
      default_safe_decision: 'Current inbound only after explicit permission; old leads parked.',
      allowed_next_action: 'Use the private intake template with source channel, permission status and no-PII evidence flags.',
      blocked_action: 'Do not import old chats, bulk message, call, email, match, or share PII with partners from this queue.',
      status: 'PRIVATE_INTAKE_READY_LIVE_ACTION_BLOCKED',
      source_anchor: statuses.intakeStatus,
    },
    {
      id: 'QUEUE-07',
      decision_area: 'partner_and_payment_path',
      current_evidence: 'No partner terms, billing contact, invoice reference or payment proof exists for this RV pilot.',
      owner_decision_needed: 'Confirm partner terms and billing proof rules before any lawyer/supplier preview.',
      default_safe_decision: 'No PII release and no revenue claim.',
      allowed_next_action: 'Prepare only anonymized partner preview fields after permission and owner release are present.',
      blocked_action: 'Do not contact lawyers/suppliers, send raw chats/files, invoice, mark paid or claim revenue.',
      status: 'PAYMENT_AND_PARTNER_PROOF_BLOCKED',
      source_anchor: 'WhatsApp/TalkTo runbook + private intake checklist',
    },
    {
      id: 'QUEUE-08',
      decision_area: 'public_copy_gate',
      current_evidence: 'All source packets keep public changes at zero and block standalone RV publication.',
      owner_decision_needed: 'Owner, SEO and legal/editor must approve exact text, placement and post-publication QA before any public edit.',
      default_safe_decision: 'No public change.',
      allowed_next_action: 'After all prior gates pass, draft a tiny public-review packet for one existing route only.',
      blocked_action: 'Do not change CMS content, titles, H1, meta, links, redirects, canonicals/noindex, sitemaps, taxonomies or uPress.',
      status: 'PUBLIC_COPY_BLOCKED',
      source_anchor: `${statuses.opportunityStatus} | ${statuses.gscStatus}`,
    },
  ];
}

function buildOwnerDecisionRows(decisionRows) {
  return decisionRows.map((row) => ({
    decision_id: row.id,
    decision_area: row.decision_area,
    required_owner_input: row.owner_decision_needed,
    acceptable_values: 'approve / reject / park / needs_more_evidence',
    current_status: row.status,
    owner_decision: '',
    owner_note_no_pii: '',
    public_action_approved: 'no',
    crm_or_outreach_approved: 'no',
    blocker_if_empty: row.blocked_action,
  }));
}

function buildSummary(reportDate, decisionRows, ownerDecisionRows, statuses) {
  return {
    reportDate,
    status: 'LOW_HYPE_RV_FIRST_PILOT_DECISION_QUEUE_READY_NO_PUBLIC_CHANGE',
    decisionRows: decisionRows.length,
    ownerDecisionRows: ownerDecisionRows.length,
    ownerDecisionRequiredRows: decisionRows.filter((row) => row.status.includes('OWNER_DECISION')).length,
    blockedRows: decisionRows.filter((row) => row.status.includes('BLOCKED') || row.status.includes('REQUIRED')).length,
    recommendedFirstPilot: statuses.recommendedFirstPilot,
    routeRecommendation: statuses.routeRecommendation,
    publicChangesApproved: 0,
    cmsWrites: 0,
    seoChanges: 0,
    crmRecordsCreated: 0,
    leadsContacted: 0,
    lawyersOrSuppliersContacted: 0,
    invoicesOrPaymentsCreated: 0,
    emailSent: 0,
    whatsappTalktoActions: 0,
    gscApiCalled: 0,
    upressDeploymentRequired: false,
    sourceStatuses: statuses,
  };
}

function markdownReport(summary, decisionRows) {
  return [
    `# Low Hype / RV First Pilot Decision Queue - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private owner/operator decision queue only. This does not approve public pages, public Low Hype labels, CMS content, route changes, title/H1/meta changes, internal links, CRM records, lead handoffs, lawyer/supplier outreach, invoices, payments, email, WhatsApp/TalkTo actions, GSC API calls or uPress deployment.',
    '',
    '## Working Decision',
    '',
    'No standalone RV route. If the owner wants to continue, the only plausible first pilot is a private RV rental/deposit/charge dispute path attached later to existing consumer/rental surfaces after GSC, legal/editor and owner review.',
    '',
    '## Source Statuses',
    '',
    `- Opportunity brief: ${summary.sourceStatuses.opportunityStatus}`,
    `- SERP/cannibalization packet: ${summary.sourceStatuses.serpStatus}`,
    `- Route-overlap packet: ${summary.sourceStatuses.routeOverlapStatus}`,
    `- GSC evidence request: ${summary.sourceStatuses.gscStatus}`,
    `- Private intake checklist: ${summary.sourceStatuses.intakeStatus}`,
    '',
    '## Summary',
    '',
    `- Decision rows: ${summary.decisionRows}`,
    `- Owner-decision template rows: ${summary.ownerDecisionRows}`,
    `- Owner-decision rows: ${summary.ownerDecisionRequiredRows}`,
    `- Blocked/review-required rows: ${summary.blockedRows}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    `- CRM/lead/lawyer/supplier/payment/email/WhatsApp/TalkTo actions: 0`,
    '',
    '## Decision Queue',
    '',
    '| ID | Decision Area | Current Evidence | Owner Decision Needed | Default Safe Decision | Allowed Next Action | Blocked Action | Status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...decisionRows.map((row) => `| ${row.id} | ${mdCell(row.decision_area)} | ${mdCell(row.current_evidence)} | ${mdCell(row.owner_decision_needed)} | ${mdCell(row.default_safe_decision)} | ${mdCell(row.allowed_next_action)} | ${mdCell(row.blocked_action)} | ${mdCell(row.status)} |`),
    '',
    '## Allowed Next 48-Hour Move',
    '',
    '1. Fill the owner decision template with approve/reject/park/needs_more_evidence for each row.',
    '2. If the RV pilot is still interesting, fill the GSC query/page template before drafting any public copy.',
    '3. Use the no-PII intake template only for current inbound users with explicit permission; keep legacy chats parked.',
    '',
    '## Own Review',
    '',
    'This queue is useful because it turns several private packets into one decision surface. It also prevents the tempting but risky move: launching a generic RV page before demand, route ownership, legal category and consent/payment gates are proven.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-low-hype-rv-first-pilot-decision-queue.mjs [--reportDate=YYYY-MM-DD]');
    return;
  }

  const sources = Object.fromEntries(
    Object.entries(SOURCE_KEYS).map(([key, sourceKey]) => [key, readJson(sourcePath(sourceKey, args.reportDate))]),
  );
  const statuses = sourceStatuses(sources);
  const decisionRows = buildDecisionRows(statuses);
  const ownerDecisionRows = buildOwnerDecisionRows(decisionRows);
  const summary = buildSummary(args.reportDate, decisionRows, ownerDecisionRows, statuses);
  const files = outputFiles(args.reportDate);

  const decisionColumns = [
    'id',
    'decision_area',
    'current_evidence',
    'owner_decision_needed',
    'default_safe_decision',
    'allowed_next_action',
    'blocked_action',
    'status',
    'source_anchor',
  ];
  const ownerColumns = [
    'decision_id',
    'decision_area',
    'required_owner_input',
    'acceptable_values',
    'current_status',
    'owner_decision',
    'owner_note_no_pii',
    'public_action_approved',
    'crm_or_outreach_approved',
    'blocker_if_empty',
  ];

  writeText(files.projectMd, markdownReport(summary, decisionRows));
  writeText(files.projectCsv, toCsv(decisionRows, decisionColumns));
  writeText(files.ownerDecisionCsv, toCsv(ownerDecisionRows, ownerColumns));
  writeText(files.reportJson, `${JSON.stringify({ summary, decisionRows, ownerDecisionRows, files }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(decisionRows, decisionColumns));

  console.log(JSON.stringify({ ...summary, files }, null, 2));
}

main();
