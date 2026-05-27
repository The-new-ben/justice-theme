import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const SOURCES = [
  ['homepageDeployment', '.reports', 'homepage-deployment-blocker', '2026-05-27'],
  ['homepageLiveVerification', '.reports', 'homepage-public-help-live-verification', '2026-05-27'],
  ['btlOwnerActionSheet', '.reports', 'btl-owner-first-paid-lead-action-sheet', '2026-05-27'],
  ['btlFirstRevenueOperator', '.reports', 'btl-first-revenue-operator-command', '2026-05-27'],
  ['btlSourceReadiness', '.reports', 'btl-source-readiness-admin-fill-packet', '2026-05-27'],
  ['lawyerSubscriptionOwnerActionSheet', '.reports', 'lawyer-subscription-owner-paid-test-action-sheet', '2026-05-27'],
  ['lawyerSubscriptionEvidenceReview', '.reports', 'lawyer-subscription-controlled-evidence-review-gate', '2026-05-27'],
  ['lawyerWalkthrough', '.reports', 'lawyer-subscription-controlled-walkthrough', '2026-05-27'],
  ['manualInvoice', '.reports', 'manual-invoice-revenue-fallback-packet', '2026-05-27'],
  ['criminalJerusalemCoverage', '.reports', 'criminal-jerusalem-lawyer-coverage-activation-packet', '2026-05-27'],
  ['publicApproval', '.reports', 'public-update-owner-approval-queue', '2026-05-27'],
  ['lowHypeRv', '.reports', 'low-hype-rv-first-pilot-decision-queue', '2026-05-27'],
  ['divorceTelAviv', '.reports', 'tel-aviv-family-evidence-completion-control-center', '2026-05-27'],
  ['criminalDecision', '.reports', 'criminal-law-pillar-split-decision-packet', '2026-05-27'],
  ['consentPack', '.reports', 'whatsapp-talkto-consent-message-pack', '2026-05-27'],
];

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE };
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

function outputFiles(reportDate) {
  const base = `owner-unblocker-command-queue-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    replyTemplateCsv: path.join(ROOT, '.project-control', `owner-unblocker-reply-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFile([, dir, base, date]) {
  return path.join(ROOT, dir, `${base}-${date}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    return { missing: true, summary: { status: 'MISSING_SOURCE' } };
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

function statusOf(source) {
  return source?.summary?.status || source?.status || 'UNKNOWN';
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function sourceStatuses(sources) {
  return Object.fromEntries(Object.entries(sources).map(([key, source]) => [key, statusOf(source)]));
}

function buildRows(sources) {
  const statuses = sourceStatuses(sources);
  const homepageLiveVerified =
    statuses.homepageLiveVerification === 'HOMEPAGE_PUBLIC_HELP_LIVE_VERIFIED_UPRESS_PULL_DONE';
  const rows = [
    {
      id: 'UNBLOCK-01',
      rank: 1,
      lane: 'btl_first_paid_lead',
      owner_reply_needed: 'Fill the Bituach Leumi source-readiness admin packet: 3 private specialist rows, coverage, 1 consented lead row, billing, payment proof and go/no-go.',
      why_it_matters: 'This is the closest route to a first paid lead, but repo checks cannot prove live supply, consent, handoff, billing or payment evidence.',
      exact_next_step: 'Owner/admin fills the BTL source-readiness no-PII template from private wp-admin/CRM evidence only; Codex can then review the filled proof rows.',
      allowed_after_yes: 'Private review of filled evidence; one controlled manual handoff only after all proof rows pass and owner explicitly releases it.',
      hard_no: 'No old lead contact, no PII release, no lawyer/client outreach, no invoice, no paid status and no revenue claim from repo artifacts alone.',
      source_status: `${statuses.btlOwnerActionSheet} | ${statuses.btlFirstRevenueOperator} | ${statuses.btlSourceReadiness}`,
      source_artifact: statuses.btlOwnerActionSheet === 'BTL_OWNER_FIRST_PAID_LEAD_ACTION_SHEET_READY_NO_LIVE_ACTION'
        ? '.project-control/btl-owner-first-paid-lead-action-sheet-2026-05-27.html'
        : '.project-control/btl-first-revenue-operator-command-2026-05-27.md',
      public_action: 'no',
      crm_or_outreach_action: 'owner-controlled-only',
      completion_if_owner_replies: 'Can move from 0% live proof to first controlled Bituach Leumi proof review.',
    },
    {
      id: 'UNBLOCK-02',
      rank: 2,
      lane: 'lawyer_subscription_revenue',
      owner_reply_needed: 'Choose a controlled test lawyer identity/inbox/phone and payment path: manual invoice, approved payment link, provider link, or no-charge dry run.',
      why_it_matters: 'The lawyer subscription flow is statically ready, but live revenue proof needs a controlled identity and approved payment evidence.',
      exact_next_step: 'Owner/admin fills the controlled lawyer subscription no-PII evidence template; Codex then runs the evidence review gate before any live execution.',
      allowed_after_yes: 'Private review of filled identity, payment path, registration, dashboard, service-request, lead, invoice/payment and revenue-decision evidence.',
      hard_no: 'No real lawyer charge, no payment-link email, no live registration submit and no provider mutation without owner-approved test scope.',
      source_status: `${statuses.lawyerSubscriptionOwnerActionSheet} | ${statuses.lawyerSubscriptionEvidenceReview} | ${statuses.manualInvoice}`,
      source_artifact: statuses.lawyerSubscriptionOwnerActionSheet === 'LAWYER_SUBSCRIPTION_OWNER_PAID_TEST_ACTION_SHEET_READY_NO_LIVE_ACTION'
        ? '.project-control/lawyer-subscription-owner-paid-test-action-sheet-2026-05-27.html'
        : '.project-control/lawyer-subscription-controlled-evidence-review-gate-2026-05-27.md',
      public_action: 'no',
      crm_or_outreach_action: 'owner-controlled-only',
      completion_if_owner_replies: 'Can move from blank evidence to a controlled lawyer subscription proof review.',
    },
    {
      id: 'UNBLOCK-08',
      rank: 3,
      lane: 'criminal_jerusalem_lawyer_coverage',
      owner_reply_needed: 'Approve private wp-admin entry/verification for one criminal-law/Jerusalem lawyer prospect, or explicitly park the exact directory coverage route.',
      why_it_matters: 'The exact criminal-law/Jerusalem directory and area-only criminal directory both have 0 lawyer cards; public draft/link reliance stays blocked until exact coverage exists.',
      exact_next_step: 'Owner/admin fills the criminal Jerusalem prospect activation template with license, specialty, response fit, manual payment path, agreed fee terms and billing contact evidence.',
      allowed_after_yes: 'Private review of filled no-PII evidence, then one owner-approved private prospect/profile readiness step before rerunning the directory coverage gate.',
      hard_no: 'No public page edit, no public lawyer card/profile, no lawyer contact, no lead routing, no invoice, no payment claim and no uPress from this packet alone.',
      source_status: statuses.criminalJerusalemCoverage,
      source_artifact: '.project-control/criminal-jerusalem-lawyer-coverage-activation-packet-2026-05-27.md',
      public_action: 'no',
      crm_or_outreach_action: 'owner-controlled-private-entry-only',
      completion_if_owner_replies: 'Can move the criminal Jerusalem content route from coverage blocked to private prospect verification review.',
    },
    {
      id: 'UNBLOCK-03',
      rank: 4,
      lane: 'public_existing_route_revenue_copy',
      owner_reply_needed: 'Approve, edit or reject the existing-route rental-agreement update packet as the first public managed-service copy candidate.',
      why_it_matters: 'This can improve public user conversion without creating a duplicate route, but it needs explicit owner/SEO/legal approval before CMS edits.',
      exact_next_step: 'If approved, prepare exact public-change packet for /rental-agreement/ and post-publication QA; if rejected, keep the queue parked.',
      allowed_after_yes: 'Draft exact text for owner/legal review and run anti-cannibalization/mobile CTA QA before any deployment.',
      hard_no: 'No title, H1, meta, body, link, checkout, fixed-price claim, CMS edit, email or uPress without explicit public approval.',
      source_status: statuses.publicApproval,
      source_artifact: '.project-control/public-update-owner-approval-queue-2026-05-27.md',
      public_action: 'blocked_pending_owner_approval',
      crm_or_outreach_action: 'no',
      completion_if_owner_replies: 'Can convert one ready public packet into an exact deployable review draft.',
    },
    {
      id: 'UNBLOCK-04',
      rank: 5,
      lane: 'low_hype_rv',
      owner_reply_needed: 'Decide whether Low Hype stays internal-only and whether RV rental/deposit/charge should be approved, rejected or parked as the first pilot.',
      why_it_matters: 'The research suggests a narrow private pilot only; a standalone RV route is still too risky.',
      exact_next_step: 'Owner fills the Low Hype/RV owner decision template, then GSC rows before any public copy.',
      allowed_after_yes: 'Continue private GSC/legal route-decision review; current inbound-only no-PII intake if explicit permission exists.',
      hard_no: 'No public Low Hype label, standalone RV route, old lead import, partner contact, PII release, invoice or payment claim.',
      source_status: statuses.lowHypeRv,
      source_artifact: '.project-control/low-hype-rv-first-pilot-decision-queue-2026-05-27.md',
      public_action: 'no',
      crm_or_outreach_action: 'blocked_pending_consent',
      completion_if_owner_replies: 'Can choose one narrow pilot path or close the loop cleanly.',
    },
    {
      id: 'UNBLOCK-05',
      rank: 6,
      lane: 'tel_aviv_family_evidence_completion',
      owner_reply_needed: 'Fill the Tel Aviv family evidence-completion workqueue: 144 GSC paste rows, 3 lawyer-readiness rows, 12 legal/editor rows, 8 owner-scope rows and 5 final publication-gate rows.',
      why_it_matters: 'The route has enough private structure to continue safely, but publication is now blocked on one clear human-fill chain rather than more repo-only preparation.',
      exact_next_step: 'Use the evidence-completion control center as the index: fill GSC first, then lawyer readiness, legal/editor, owner scope and the final private publication gate.',
      allowed_after_yes: 'Private review of filled no-PII rows; only after all gates pass can a separate exact CMS draft packet be prepared for owner review.',
      hard_no: 'No CMS page, title/H1/meta/body, internal links, redirects, canonicals/noindex, sitemap, taxonomy, email or uPress from this queue row.',
      source_status: statuses.divorceTelAviv,
      source_artifact: '.project-control/tel-aviv-family-evidence-completion-control-center-2026-05-27.md',
      public_action: 'blocked_pending_owner_gsc_legal',
      crm_or_outreach_action: 'no',
      completion_if_owner_replies: 'Can move from 0% human fill to a private go/no-go review surface for the local page.',
    },
    {
      id: 'UNBLOCK-06',
      rank: 7,
      lane: 'criminal_jerusalem_role',
      owner_reply_needed: 'Fill the criminal-law GSC/owner decision template: preserve, revise, consolidate or park /criminal-lawyer-jerusalem/ and choose central route ownership.',
      why_it_matters: 'The page is public and thin, but the criminal-law pillar split must be resolved before edits.',
      exact_next_step: 'Use GSC rows and owner decision to map central criminal-law route, local-page role and protected specialist pages.',
      allowed_after_yes: 'Prepare exact update draft only after route ownership is clear.',
      hard_no: 'No public edit, unpublish, redirect, canonical/noindex, internal-link rewrite, sitemap or taxonomy change.',
      source_status: statuses.criminalDecision,
      source_artifact: '.project-control/criminal-law-pillar-split-decision-packet-2026-05-27.md',
      public_action: 'blocked_pending_owner_gsc_legal',
      crm_or_outreach_action: 'no',
      completion_if_owner_replies: 'Can turn the live QA into a safe update/consolidation decision.',
    },
    {
      id: 'UNBLOCK-07',
      rank: 8,
      lane: 'whatsapp_talkto_consent',
      owner_reply_needed: 'Approve or edit exact consent/re-permission wording and suppression rules before any real WhatsApp/TalkTo lead handling.',
      why_it_matters: 'Inbound and legacy chats can become CRM supply only if permission, stop rules and no-PII preview boundaries are explicit.',
      exact_next_step: 'Owner/legal reviews the message pack; then Codex can help create a filled no-PII import/preflight review from an owner-provided export.',
      allowed_after_yes: 'Current inbound clarification only after permission; legacy leads only after fresh re-permission workflow is approved.',
      hard_no: 'No bulk messaging, no old lead matching, no PII release, no partner preview, no invoice and no revenue claim.',
      source_status: statuses.consentPack,
      source_artifact: '.project-control/whatsapp-talkto-consent-message-pack-2026-05-27.md',
      public_action: 'no',
      crm_or_outreach_action: 'blocked_pending_owner_legal',
      completion_if_owner_replies: 'Can safely prepare real lead-import preflight without contacting anyone.',
    },
    {
      id: 'UNBLOCK-00',
      rank: 99,
      lane: 'homepage_live_deployment_closed',
      owner_reply_needed: homepageLiveVerified
        ? 'No owner action needed now: uPress Pull Git was completed and the public-first homepage copy was verified live.'
        : 'Recheck homepage deployment evidence because the live-verification proof file is missing or not passing.',
      why_it_matters: 'Closed blockers must not stay above the first-revenue queue; this row remains only as an audit trail.',
      exact_next_step: homepageLiveVerified
        ? 'Keep the live verification proof attached; if cache or layout concerns reappear, run read-only live verification again.'
        : 'Create or repair the live homepage verification proof before treating the homepage deployment blocker as closed.',
      allowed_after_yes: 'Read-only homepage verification only; no new deployment or CMS work is authorized by this closed row.',
      hard_no: 'No CMS content edit, redirect, canonical/noindex, sitemap, taxonomy, CRM, payment, provider-setting or uPress action from this closed audit row.',
      source_status: `${statuses.homepageDeployment} | ${statuses.homepageLiveVerification}`,
      source_artifact: homepageLiveVerified
        ? '.project-control/homepage-public-help-live-verification-2026-05-27.md'
        : '.project-control/homepage-deployment-blocker-2026-05-27.md',
      public_action: homepageLiveVerified ? 'completed_no_new_action' : 'verification_missing',
      crm_or_outreach_action: 'no',
      completion_if_owner_replies: homepageLiveVerified
        ? 'Already completed: homepage copy is live; revenue focus moves to BTL/supply/payment proof.'
        : 'Can close the stale homepage blocker once live evidence is restored.',
    },
  ];

  return rows.sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id));
}

function buildReplyRows(rows) {
  return rows.map((row) => ({
    unblock_id: row.id,
    owner_decision: '',
    accepted_values: 'approve / edit / reject / park / needs_more_evidence',
    owner_note_no_pii: '',
    public_action_approved: 'no',
    live_crm_or_outreach_approved: 'no',
    payment_or_invoice_approved: 'no',
    next_evidence_location: '',
  }));
}

function buildSummary(reportDate, rows, sources) {
  const homepageLiveVerified =
    statusOf(sources.homepageLiveVerification) === 'HOMEPAGE_PUBLIC_HELP_LIVE_VERIFIED_UPRESS_PULL_DONE';
  return {
    reportDate,
    status: 'OWNER_UNBLOCKER_COMMAND_QUEUE_READY_NO_LIVE_ACTION',
    rowCount: rows.length,
    p0Rows: rows.filter((row) => row.rank <= 3).length,
    completedRows: rows.filter((row) => row.public_action === 'completed_no_new_action').length,
    homepageLiveVerified,
    publicActionApproved: 0,
    liveCrmOrOutreachApproved: 0,
    paymentOrInvoiceApproved: 0,
    emailsSent: 0,
    gscApiCalled: 0,
    upressDeploymentRequired: !homepageLiveVerified && Boolean(sources.homepageDeployment?.summary?.upressDeploymentRequired),
    sourceStatuses: sourceStatuses(sources),
  };
}

function markdownReport(summary, rows) {
  return [
    `# Owner Unblocker Command Queue - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private owner/operator queue only. This does not approve CMS/database edits, public SEO changes, CRM records, client/lawyer/supplier contact, invoices, payments, email, WhatsApp/TalkTo messages, GSC API calls or uPress deployment.',
    '',
    '## Summary',
    '',
    `- Rows prepared: ${summary.rowCount}`,
    `- Highest-priority rows: ${summary.p0Rows}`,
    `- Completed audit rows: ${summary.completedRows}`,
    `- Homepage live verified: ${summary.homepageLiveVerified ? 'yes' : 'no'}`,
    '- Public actions approved: 0',
    '- Live CRM/outreach/payment actions approved: 0',
    '- Emails sent: 0',
    `- uPress deployment required: ${summary.upressDeploymentRequired ? 'yes' : 'no'}`,
    '',
    '## Command Queue',
    '',
    '| ID | Rank | Lane | Owner Reply Needed | Exact Next Step | Allowed After Yes | Hard No | Source Status |',
    '| --- | ---: | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.rank} | ${mdCell(row.lane)} | ${mdCell(row.owner_reply_needed)} | ${mdCell(row.exact_next_step)} | ${mdCell(row.allowed_after_yes)} | ${mdCell(row.hard_no)} | ${mdCell(row.source_status)} |`),
    '',
    '## Recommended Owner Reply Format',
    '',
    'Reply with row IDs only, for example: `UNBLOCK-01 approve, UNBLOCK-08 approve, UNBLOCK-03 park`.',
    '',
    '## Own Review',
    '',
    'The fastest revenue path is still not a new public page. It is clearing one controlled proof path: Bituach Leumi paid-lead evidence, a controlled lawyer subscription walkthrough, or the criminal Jerusalem private coverage prospect step. Public content work should stay on existing-route approval packets until GSC/legal/owner gates are filled.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or call the GSC API. UNBLOCK-00 is now a closed audit row for the completed homepage Pull Git and live verification; it does not authorize another uPress action.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-owner-unblocker-command-queue.mjs [--reportDate=YYYY-MM-DD]');
    return;
  }

  const sources = Object.fromEntries(SOURCES.map(([key, ...rest]) => [key, readJson(sourceFile([key, ...rest]))]));
  const rows = buildRows(sources);
  const replyRows = buildReplyRows(rows);
  const summary = buildSummary(args.reportDate, rows, sources);
  const files = outputFiles(args.reportDate);

  const columns = [
    'id',
    'rank',
    'lane',
    'owner_reply_needed',
    'why_it_matters',
    'exact_next_step',
    'allowed_after_yes',
    'hard_no',
    'source_status',
    'source_artifact',
    'public_action',
    'crm_or_outreach_action',
    'completion_if_owner_replies',
  ];
  const replyColumns = [
    'unblock_id',
    'owner_decision',
    'accepted_values',
    'owner_note_no_pii',
    'public_action_approved',
    'live_crm_or_outreach_approved',
    'payment_or_invoice_approved',
    'next_evidence_location',
  ];

  writeText(files.projectMd, markdownReport(summary, rows));
  writeText(files.projectCsv, toCsv(rows, columns));
  writeText(files.replyTemplateCsv, toCsv(replyRows, replyColumns));
  writeText(files.reportJson, `${JSON.stringify({ summary, rows, replyRows, files }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(rows, columns));

  console.log(JSON.stringify({ ...summary, files }, null, 2));
}

main();
