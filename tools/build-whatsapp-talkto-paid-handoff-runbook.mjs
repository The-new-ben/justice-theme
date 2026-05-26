import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

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

function outputFiles(reportDate) {
  const base = `whatsapp-talkto-paid-handoff-runbook-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
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

const rows = [
  {
    id: 'SURFACE-01',
    type: 'existing_admin_surface',
    stage: 'manual_capture',
    status: 'READY_ADMIN_ONLY',
    required_evidence: 'Owner/admin pastes inbound WhatsApp, email, phone or TalkTo lead into Justice CRM with source reference.',
    allowed_action: 'Create a private justice_lead only when the owner approves real lead creation for that source.',
    blocked_action: 'Do not create real CRM records from old chats in bulk without owner approval and import batch labeling.',
    repo_anchor: 'inc/lead-crm.php manual bridge',
    linear_anchor: 'HAD-87',
    next_owner_action: 'For the UK WhatsApp lead, approve or hold real private CRM lead creation.',
  },
  {
    id: 'SURFACE-02',
    type: 'existing_admin_surface',
    stage: 'bulk_import',
    status: 'READY_ADMIN_ONLY',
    required_evidence: 'CSV export has source system, batch label, source page or thread/import ID where available.',
    allowed_action: 'Stage up to 200 rows per paste with routing_hold=1 and dedupe fingerprint.',
    blocked_action: 'Do not route legacy rows; default old leads to legacy_needs_repermission.',
    repo_anchor: 'inc/lead-crm.php import staging',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Provide TalkTo or WhatsApp export format when ready; start with a small batch.',
  },
  {
    id: 'GATE-01',
    type: 'safety_gate',
    stage: 'consent',
    status: 'REQUIRED_BEFORE_ROUTING',
    required_evidence: 'consent_status is explicit_match_consent or owner_verified_consent, and the owner/admin checked the permission evidence.',
    allowed_action: 'Proceed to no-PII partner preview and paid terms review.',
    blocked_action: 'Do not route, expose client contact details, or introduce a lawyer/supplier.',
    repo_anchor: 'inc/lead-crm.php consent options; inc/lead-routing.php consent gate',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Use the permission queue for fresh or legacy inbound chats.',
  },
  {
    id: 'GATE-02',
    type: 'safety_gate',
    stage: 'routing_hold',
    status: 'DEFAULT_ON',
    required_evidence: 'routing_hold=1 remains until consent, commercial terms and owner release are all recorded.',
    allowed_action: 'Keep internal classification, notes and no-PII readiness visible to the owner.',
    blocked_action: 'Do not remove routing_hold just because the lead has a phone number or legal area.',
    repo_anchor: 'inc/lead-routing.php routing_hold guard',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Release only after the owner release queue confirms the lead is safe.',
  },
  {
    id: 'GATE-03',
    type: 'safety_gate',
    stage: 'no_pii_preview',
    status: 'REQUIRED_BEFORE_PARTNER_CONTACT',
    required_evidence: 'An anonymized preview describes area, urgency, city/region if safe, and required supplier/lawyer type without name, phone, email, documents or raw chat.',
    allowed_action: 'Ask selected lawyer/supplier whether they accept the category, SLA and price/fee terms.',
    blocked_action: 'Do not send screenshots, raw WhatsApp content, full phone number, exact address, or documents at preview stage.',
    repo_anchor: 'inc/lead-crm.php partner preview / terms queue',
    linear_anchor: 'HAD-87; HAD-97',
    next_owner_action: 'Use no-PII preview before any UK-law, immigration or supplier quote contact.',
  },
  {
    id: 'GATE-04',
    type: 'safety_gate',
    stage: 'partner_terms',
    status: 'REQUIRED_BEFORE_PII_RELEASE',
    required_evidence: 'Partner accepted lead/case type, price or per-lead fee, response commitment, billing contact and any capacity limits.',
    allowed_action: 'Record partner terms and move the lead toward owner release.',
    blocked_action: 'Do not release client PII to a partner who has not accepted terms and billing contact requirements.',
    repo_anchor: 'inc/lead-crm.php owner handoff release queue; inc/lawyer-prospects.php supplier/lawyer activation packet',
    linear_anchor: 'HAD-79; HAD-87; HAD-97',
    next_owner_action: 'For each supplier/lawyer category, record minimum fee and billing route before first handoff.',
  },
  {
    id: 'GATE-05',
    type: 'safety_gate',
    stage: 'billing_proof',
    status: 'REQUIRED_BEFORE_REVENUE_CLAIM',
    required_evidence: 'qualified_lead_billing_status, invoice reference or payment evidence URL, and owner note are stored.',
    allowed_action: 'Claim invoice sent or paid only according to recorded evidence.',
    blocked_action: 'Do not mark paid, claim revenue, or activate paid status without invoice/payment proof.',
    repo_anchor: 'inc/lead-crm.php qualified lead billing queue',
    linear_anchor: 'HAD-76; HAD-87',
    next_owner_action: 'Use manual invoice/payment flow until Grow/Morning provider setup is fully verified.',
  },
  {
    id: 'GATE-06',
    type: 'safety_gate',
    stage: 'owner_release',
    status: 'FINAL_MANUAL_GATE',
    required_evidence: 'Client permission, partner terms and minimum paid fee are present; owner release is recorded.',
    allowed_action: 'Prepare the controlled manual handoff. The system still sends nothing automatically.',
    blocked_action: 'Do not automate the handoff or live webhook release from this report.',
    repo_anchor: 'inc/lead-crm.php owner handoff release queue',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Owner manually approves each first-category handoff before scale.',
  },
  {
    id: 'GATE-07',
    type: 'integration_gate',
    stage: 'whatsapp_talkto_webhook',
    status: 'BLOCKED_PENDING_PROVIDER_APPROVAL',
    required_evidence: 'Official provider route, signature/shared-secret method, pause switch, replay protection and approved permission text.',
    allowed_action: 'Keep using manual/import bridge and connector-readiness panel.',
    blocked_action: 'Do not build unattended scraping/login bots or bypass WhatsApp/TalkTo protections.',
    repo_anchor: 'inc/lead-crm.php connector readiness panel',
    linear_anchor: 'HAD-81; HAD-87',
    next_owner_action: 'Provide official API/webhook docs or account settings when ready.',
  },
  {
    id: 'CASE-UK-01',
    type: 'current_real_lead_packet',
    stage: 'uk_law_whatsapp',
    status: 'BLOCKED_OWNER_APPROVAL_FOR_REAL_CRM_RECORD',
    required_evidence: 'Owner approves creating a private CRM lead from the Outlook/WhatsApp email and stores the source reference.',
    allowed_action: 'If approved, create private lead with legal_area=uk-law, source_page_url=/uk-lawyer/, consent_status=fresh_inbound_needs_details, routing_hold=1.',
    blocked_action: 'Do not send the client to a UK lawyer/supplier or charge until case details and match permission are clear.',
    repo_anchor: 'inc/lead-classifier.php uk-law classification; inc/lead-crm.php manual bridge',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Approve real CRM entry or keep the email as evidence only until more client details arrive.',
  },
  {
    id: 'CASE-UK-02',
    type: 'current_real_lead_packet',
    stage: 'uk_law_whatsapp',
    status: 'NEXT_AFTER_OWNER_APPROVAL',
    required_evidence: 'Client states what they need in UK law and agrees to be matched/contacted.',
    allowed_action: 'Move consent to explicit_match_consent or owner_verified_consent, then run no-PII partner preview.',
    blocked_action: 'Do not infer consent from pressing the WhatsApp button alone.',
    repo_anchor: 'inc/lead-crm.php permission queue',
    linear_anchor: 'HAD-87',
    next_owner_action: 'Use an owner-approved short permission/details message.',
  },
  {
    id: 'MONEY-01',
    type: 'commercial_path',
    stage: 'find_register_take_money',
    status: 'MANUAL_SAFE_PATH_AVAILABLE',
    required_evidence: 'Routable lawyer/supplier profile, accepted terms, billing contact, lead fee or package price, owner release.',
    allowed_action: 'Attach the client to a partner through the CRM, record billing queue state, then collect manual invoice/payment proof.',
    blocked_action: 'Do not make automatic recurring billing, automated refunds or guaranteed supplier bids claims until provider tests pass.',
    repo_anchor: 'inc/lead-crm.php billing queue; inc/lawyer-onboarding.php manual invoice path; inc/lawyer-suppliers.php supplier readiness',
    linear_anchor: 'HAD-76; HAD-79; HAD-87',
    next_owner_action: 'For each category, register at least one accepted partner with billing terms before routing.',
  },
];

function markdownReport(reportDate) {
  const summary = {
    adminSurfaces: rows.filter((row) => row.type === 'existing_admin_surface').length,
    safetyGates: rows.filter((row) => row.type === 'safety_gate').length,
    integrationGates: rows.filter((row) => row.type === 'integration_gate').length,
    currentLeadRows: rows.filter((row) => row.type === 'current_real_lead_packet').length,
    liveAutomationApproved: 0,
    publicChangesApproved: 0,
  };

  const lines = [
    `# WhatsApp / TalkTo Paid Handoff Runbook - ${reportDate}`,
    '',
    'Status: PRIVATE_RUNBOOK_ONLY_NOT_APPROVED_FOR_AUTOMATION',
    '',
    'Purpose: convert inbound WhatsApp, TalkTo, email and legacy leads into a safe CRM-to-partner-to-payment workflow without contacting clients or suppliers automatically and without exposing private business strategy on public pages.',
    '',
    'Safety: no login, mailbox action, CMS publish, database edit, lead creation, partner contact, client contact, WhatsApp message, TalkTo message, payment, invoice, webhook, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    '## Summary',
    '',
    `- Existing admin surfaces mapped: ${summary.adminSurfaces}`,
    `- Safety gates mapped: ${summary.safetyGates}`,
    `- Integration gates mapped: ${summary.integrationGates}`,
    `- Current real-lead packet rows: ${summary.currentLeadRows}`,
    `- Live automation approved: ${summary.liveAutomationApproved}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Operator Rule',
    '',
    'The safe path is: private CRM lead -> consent evidence -> routing hold -> no-PII partner preview -> accepted terms and billing contact -> owner release -> manual handoff -> invoice/payment proof. Skip none of these steps.',
    '',
    '## Runbook Rows',
    '',
    '| ID | Type | Stage | Status | Required Evidence | Allowed Action | Blocked Action | Repo Anchor | Linear | Next Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) => `| ${row.id} | ${row.type} | ${row.stage} | ${row.status} | ${row.required_evidence} | ${row.allowed_action} | ${row.blocked_action} | ${row.repo_anchor} | ${row.linear_anchor} | ${row.next_owner_action} |`
    ),
    '',
    '## Current UK WhatsApp Lead',
    '',
    '- Treat the UK-law WhatsApp/email lead as a real client lead only after owner approval to create the private CRM record.',
    '- Suggested private CRM starting state, if approved: `legal_area=uk-law`, `source_page_url=/uk-lawyer/`, `consent_status=fresh_inbound_needs_details`, `routing_hold=1`, `handoff_path=lawyer_and_supplier` or `supplier_marketplace`.',
    '- Pressing the WhatsApp button is not enough to infer permission for a lawyer/supplier introduction.',
    '- The next safe message is a permission/details request, not a partner introduction.',
    '',
    '## Blockers',
    '',
    '- Real UK lead creation remains blocked until the owner approves creating the private CRM record.',
    '- Supplier/lawyer PII handoff remains blocked until client consent, partner terms, billing contact and owner release are recorded.',
    '- Live WhatsApp/TalkTo webhook ingestion remains blocked until official provider route, signature/shared-secret method, pause control and permission text are approved.',
    '- Real revenue remains blocked until invoice/payment evidence is recorded for the specific handoff.',
    '',
    '## Where Future Agents Should Look',
    '',
    '- Linear: `HAD-87` for WhatsApp/TalkTo consent-safe CRM; `HAD-79`/`HAD-97` for supplier marketplace and bidding; `HAD-76` for Bituach Leumi first billable lead.',
    '- Repo: `.project-control/lead-consent-import-architecture-2026-05-26.md` for the original architecture.',
    '- Admin: `wp-admin -> Justice CRM` for manual bridge, import staging, permission queue, anonymized partner preview, owner handoff release and qualified lead billing queue.',
    ''
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-whatsapp-talkto-paid-handoff-runbook.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const columns = [
  'id',
  'type',
  'stage',
  'status',
  'required_evidence',
  'allowed_action',
  'blocked_action',
  'repo_anchor',
  'linear_anchor',
  'next_owner_action',
];

writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ status: 'PRIVATE_RUNBOOK_ONLY_NOT_APPROVED_FOR_AUTOMATION', rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(args.reportDate));

console.table(rows.map(({ id, stage, status, linear_anchor }) => ({
  id,
  stage,
  status,
  linear_anchor,
})));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);
