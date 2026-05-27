import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const sourceFiles = {
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  router: path.join(ROOT, 'inc', 'lead-routing.php'),
  prospects: path.join(ROOT, 'inc', 'lawyer-prospects.php'),
  suppliers: path.join(ROOT, 'inc', 'lawyer-suppliers.php'),
  dashboard: path.join(ROOT, 'inc', 'lawyer-dashboard.php'),
};

function readSource(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function relativeSource(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function inspectMarkers({ id, gate, file, markers, evidence, nextAction }) {
  const filePath = sourceFiles[file];
  const text = readSource(filePath);
  const missing = markers.filter((marker) => !text.includes(marker));

  return {
    id,
    gate,
    status: existsSync(filePath) && missing.length === 0 ? 'PASS' : 'BLOCKED',
    file: filePath ? relativeSource(filePath) : file,
    evidence: existsSync(filePath) ? evidence : 'Source file missing',
    markers_found: String(markers.length - missing.length),
    markers_total: String(markers.length),
    missing_markers: missing.join('|'),
    next_action: missing.length ? `Restore or verify missing source markers: ${missing.join(', ')}` : nextAction,
  };
}

function buildStaticChecks() {
  return [
    inspectMarkers({
      id: 'WT-SRC-01',
      gate: 'manual_whatsapp_talkto_capture_bridge',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_whatsapp_lead_bridge',
        'justice_theme_create_whatsapp_lead',
        'source_channel',
        'handoff_path',
        'routing_hold',
      ],
      evidence: 'Manual admin bridge captures source, handoff path and keeps routing held by default.',
      nextAction: 'Use wp-admin -> Justice CRM manual bridge only after owner approval for real lead creation.',
    }),
    inspectMarkers({
      id: 'WT-SRC-02',
      gate: 'legacy_import_defaults_to_repermission',
      file: 'crm',
      markers: [
        'function justice_theme_crm_handle_external_lead_import',
        'legacy_needs_repermission',
        'import_fingerprint',
        'repermission_status',
        "'routing_hold'                 => '1'",
      ],
      evidence: 'Bulk/legacy imports dedupe rows and default old leads to re-permission with routing hold.',
      nextAction: 'Start with a small owner-approved export batch and keep routeable consent downgraded until evidence is reviewed.',
    }),
    inspectMarkers({
      id: 'WT-SRC-03',
      gate: 'permission_queue_and_routeable_consent',
      file: 'crm',
      markers: [
        'function justice_theme_crm_manual_lead_consent_options',
        'function justice_theme_crm_manual_lead_routeable_consent_statuses',
        'explicit_match_consent',
        'owner_verified_consent',
        'do_not_contact',
      ],
      evidence: 'CRM has explicit/owner-verified consent states plus do-not-contact handling.',
      nextAction: 'Use only explicit_match_consent or owner_verified_consent before partner preview or routing.',
    }),
    inspectMarkers({
      id: 'WT-SRC-04',
      gate: 'router_blocks_unsafe_external_leads',
      file: 'router',
      markers: [
        'get_post_meta( $post_id, \'routing_hold\', true )',
        'whatsapp_manual',
        'talkto_chatbot',
        'explicit_match_consent',
        'owner_verified_consent',
        'Routing blocked: external WhatsApp/TalkTo/manual lead lacks explicit match consent',
      ],
      evidence: 'Router refuses held/manual external leads unless consent status and consent flag are both routeable.',
      nextAction: 'Do not remove routing_hold until permission, partner terms and owner release are recorded.',
    }),
    inspectMarkers({
      id: 'WT-SRC-05',
      gate: 'no_pii_partner_preview_and_terms',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_partner_preview_queue',
        'anonymized_preview_status',
        'partner_terms_status',
        'partner_terms_min_fee_ils',
        'partner_terms_owner_verified',
      ],
      evidence: 'Partner preview and terms queue exists before PII release or paid handoff.',
      nextAction: 'Send only anonymized facts until partner accepted terms, fee and billing contact.',
    }),
    inspectMarkers({
      id: 'WT-SRC-06',
      gate: 'final_owner_release_required',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_owner_handoff_release_queue',
        'owner_confirmed_client_permission',
        'owner_confirmed_partner_terms',
        'owner_confirmed_manual_only',
        'approved_manual_handoff',
      ],
      evidence: 'Owner release queue requires client permission, partner terms and manual-only confirmation.',
      nextAction: 'Record owner release deliberately; the system still sends nothing automatically.',
    }),
    inspectMarkers({
      id: 'WT-SRC-07',
      gate: 'qualified_lead_invoice_payment_proof',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_qualified_lead_billing_queue',
        'function justice_theme_crm_lead_has_payment_evidence',
        'justice_theme_crm_qualified_lead_revenue_snapshot',
        'qualified_lead_invoice_reference',
        'qualified_lead_payment_evidence_url',
        'payment_proof_missing',
        "'paid' === $billing_status && '' === $payment_evidence_url",
        'Invoice/reference alone can support Invoice sent, not paid revenue.',
        'qualified_lead_paid_at',
      ],
      evidence: 'Billing queue, badges and revenue summaries separate invoice references from payment evidence and prevent paid counts without an evidence URL.',
      nextAction: 'Count revenue only after private payment evidence is present; invoice/reference alone can support invoice sent.',
    }),
    inspectMarkers({
      id: 'WT-SRC-08',
      gate: 'no_pii_audit_export',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_lead_audit_export_panel',
        'function justice_theme_crm_lead_audit_gate',
        'invoice_reference_present',
        'payment_evidence_url_present',
        'Excludes by design: client name, phone, email',
      ],
      evidence: 'Owner can export no-PII readiness rows without leaking client contact data or payment URLs.',
      nextAction: 'Use audit export before bulk lead handoff, supplier/lawyer routing or invoice chase.',
    }),
    inspectMarkers({
      id: 'WT-SRC-09',
      gate: 'webhook_not_live_until_provider_gates',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_webhook_readiness_panel',
        'Connection status',
        'Not live',
        'signature secret',
        'Do not build unattended scraping/login bots',
      ],
      evidence: 'Connector panel keeps webhook ingestion explicitly not-live until official provider controls are approved.',
      nextAction: 'Use official WhatsApp/TalkTo provider routes only; no scraping, login automation or bypassing platform protections.',
    }),
  ];
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
    required_evidence: 'qualified_lead_billing_status, invoice reference for invoice_sent, payment evidence URL for paid, and owner note are stored.',
    allowed_action: 'Claim invoice sent from reference; claim paid only from payment evidence.',
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

function markdownReport(reportDate, checks, status) {
  const summary = {
    adminSurfaces: rows.filter((row) => row.type === 'existing_admin_surface').length,
    safetyGates: rows.filter((row) => row.type === 'safety_gate').length,
    integrationGates: rows.filter((row) => row.type === 'integration_gate').length,
    currentLeadRows: rows.filter((row) => row.type === 'current_real_lead_packet').length,
    staticChecks: checks.length,
    staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
    liveAutomationApproved: 0,
    publicChangesApproved: 0,
  };

  const lines = [
    `# WhatsApp / TalkTo Paid Handoff Runbook - ${reportDate}`,
    '',
    `Status: ${status}`,
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
    `- Static source checks passing: ${summary.staticChecksPassing}/${summary.staticChecks}`,
    `- Live automation approved: ${summary.liveAutomationApproved}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Operator Rule',
    '',
    'The safe path is: private CRM lead -> consent evidence -> routing hold -> no-PII partner preview -> accepted terms and billing contact -> owner release -> manual handoff -> invoice/payment proof. Skip none of these steps.',
    '',
    '## Static Source Checks',
    '',
    '| ID | Gate | Status | File | Evidence | Markers | Missing | Next Action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...checks.map(
      (check) =>
        `| ${check.id} | ${check.gate} | ${check.status} | ${check.file} | ${mdCell(check.evidence)} | ${check.markers_found}/${check.markers_total} | ${mdCell(check.missing_markers || '-')} | ${mdCell(check.next_action)} |`
    ),
    '',
    '## Runbook Rows',
    '',
    '| ID | Type | Stage | Status | Required Evidence | Allowed Action | Blocked Action | Repo Anchor | Linear | Next Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) => `| ${row.id} | ${row.type} | ${row.stage} | ${row.status} | ${mdCell(row.required_evidence)} | ${mdCell(row.allowed_action)} | ${mdCell(row.blocked_action)} | ${mdCell(row.repo_anchor)} | ${mdCell(row.linear_anchor)} | ${mdCell(row.next_owner_action)} |`
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
    '- Real revenue remains blocked until private payment evidence is recorded for the specific handoff; invoice references alone only support invoice-sent status.',
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
const checks = buildStaticChecks();
const status = checks.every((check) => check.status === 'PASS')
  ? 'PRIVATE_RUNBOOK_VERIFIED_NOT_APPROVED_FOR_AUTOMATION'
  : 'BLOCKED_STATIC_HANDOFF_GATES';
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
writeText(outputs.reportJson, JSON.stringify({
  reportDate: args.reportDate,
  status,
  summary: {
    runbookRows: rows.length,
    staticChecks: checks.length,
    staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
    liveAutomationApproved: 0,
    publicChangesApproved: 0,
  },
  sourceFiles: Object.fromEntries(Object.entries(sourceFiles).map(([key, filePath]) => [key, relativeSource(filePath)])),
  checks,
  rows,
}, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(args.reportDate, checks, status));

console.table(rows.map(({ id, stage, status, linear_anchor }) => ({
  id,
  stage,
  status,
  linear_anchor,
})));
console.log(`${checks.filter((check) => check.status === 'PASS').length}/${checks.length} static source checks passed.`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);
