import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const sourceFiles = {
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  router: path.join(ROOT, 'inc', 'lead-routing.php'),
  classifier: path.join(ROOT, 'inc', 'lead-classifier.php'),
  suppliers: path.join(ROOT, 'inc', 'lawyer-suppliers.php'),
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

function outputFiles(reportDate) {
  const base = `uk-whatsapp-lead-supplier-handoff-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    ownerTemplateCsv: path.join(ROOT, '.project-control', `uk-whatsapp-lead-owner-template-${reportDate}.csv`),
  };
}

function readSource(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function relativeSource(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function checkMarkers({ id, gate, file, markers, evidence, nextStep }) {
  const filePath = sourceFiles[file];
  const text = readSource(filePath);
  const missing = markers.filter((marker) => !text.includes(marker));

  return {
    id,
    gate,
    status: existsSync(filePath) && missing.length === 0 ? 'PASS' : 'BLOCKED',
    file: filePath ? relativeSource(filePath) : file,
    evidence: existsSync(filePath) ? evidence : 'Source file missing',
    markers_found: markers.length - missing.length,
    markers_total: markers.length,
    missing_markers: missing.join('|') || '-',
    next_step: missing.length ? `Restore or verify missing source markers: ${missing.join(', ')}` : nextStep,
  };
}

function buildStaticChecks() {
  return [
    checkMarkers({
      id: 'UK-SRC-01',
      gate: 'manual_crm_bridge_fields',
      file: 'crm',
      markers: [
        'Manual WhatsApp / client lead bridge',
        'source_channel',
        'handoff_path',
        'source_page_url',
        'fresh_inbound_needs_details',
        'lawyer_and_supplier',
        'supplier_marketplace',
      ],
      evidence: 'The admin bridge can create a private held lead with source, handoff path, page URL and consent state.',
      nextStep: 'Use the bridge only after owner approval for this real source; keep routing held.',
    }),
    checkMarkers({
      id: 'UK-SRC-02',
      gate: 'uk_law_classifier',
      file: 'classifier',
      markers: ['uk-law', 'uk-lawyer', 'united kingdom', 'britain', 'london'],
      evidence: 'The rule classifier recognizes UK / cross-border law demand instead of falling into a generic bucket.',
      nextStep: 'Create the private lead with legal_area=uk-law and preserve source_page_url=/uk-lawyer/.',
    }),
    checkMarkers({
      id: 'UK-SRC-03',
      gate: 'external_source_routing_hold',
      file: 'router',
      markers: [
        'routing_hold',
        'whatsapp_manual',
        'email_forward',
        'explicit_match_consent',
        'owner_verified_consent',
        'Routing blocked: external WhatsApp/TalkTo/manual lead lacks explicit match consent',
      ],
      evidence: 'The router blocks external/manual leads unless explicit or owner-verified consent is present.',
      nextStep: 'Do not tick release-to-router until consent evidence and paid partner terms are recorded.',
    }),
    checkMarkers({
      id: 'UK-SRC-04',
      gate: 'no_pii_partner_preview',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_partner_preview_queue',
        'anonymized_preview_status',
        'partner_terms_status',
        'partner_terms_min_fee_ils',
        'Do not send externally until explicit/owner-verified client permission is recorded.',
      ],
      evidence: 'The CRM has a no-PII partner-preview and terms queue before any supplier/lawyer PII release.',
      nextStep: 'After permission, ask partners only with anonymized facts, fee terms and billing contact requirements.',
    }),
    checkMarkers({
      id: 'UK-SRC-05',
      gate: 'owner_release_gate',
      file: 'crm',
      markers: [
        'function justice_theme_crm_render_owner_handoff_release_queue',
        'owner_handoff_release_status',
        'approved_manual_handoff',
        'I confirmed client permission evidence.',
        'I confirmed accepted partner terms and fee.',
      ],
      evidence: 'Owner release requires permission, partner terms and manual-only confirmation.',
      nextStep: 'Record owner release only after consent and accepted paid partner terms are visible.',
    }),
    checkMarkers({
      id: 'UK-SRC-06',
      gate: 'billing_proof_guard',
      file: 'crm',
      markers: [
        'qualified_lead_billing_status',
        'qualified_lead_invoice_reference',
        'qualified_lead_payment_evidence_url',
        'payment_proof_missing',
        'paid_with_proof',
      ],
      evidence: 'Billing state separates invoice/reference for invoice_sent from private payment evidence for paid.',
      nextStep: 'Use manual invoice/reference plus private payment evidence until Grow/Morning provider status is fully verified.',
    }),
    checkMarkers({
      id: 'UK-SRC-07',
      gate: 'supplier_safe_bid_packet',
      file: 'suppliers',
      markers: [
        'justice_theme_lawyer_supplier_match_readiness',
        'justice_theme_lawyer_supplier_safe_bid_packet',
        'do not send client personal details',
      ],
      evidence: 'Supplier matching has readiness scoring and a safe-bid packet that blocks first-contact PII sharing.',
      nextStep: 'Register/complete a UK-law supplier or lawyer partner with terms before any handoff.',
    }),
  ];
}

const handoffRows = [
  {
    id: 'UK-01',
    phase: 'source_capture',
    admin_location: 'wp-admin -> Justice CRM -> Manual WhatsApp / client lead bridge',
    recommended_value: 'Use the owner-forwarded Outlook/WhatsApp email as source evidence, but keep the real phone/name/message outside repo artifacts.',
    status: 'READY_FOR_OWNER_APPROVAL',
    owner_action: 'Approve private CRM entry for this current inbound UK-law lead, or keep it parked as email evidence only.',
    blocked_until: 'Owner approves creating one private held CRM lead.',
    safety: 'No public page, contact, invoice, payment, partner message or PII release from this packet.',
  },
  {
    id: 'UK-02',
    phase: 'private_lead_fields',
    admin_location: 'Manual WhatsApp / client lead bridge',
    recommended_value: 'source_channel=whatsapp_manual; handoff_path=lawyer_and_supplier; legal_area=uk-law; source_page_url=https://jus-tice.co.il/uk-lawyer/; consent_status=fresh_inbound_needs_details; suggested_lead_price_ils=249 or owner-approved value.',
    status: 'READY_TEMPLATE_ONLY',
    owner_action: 'Paste the real client fields in wp-admin only, not into repo reports.',
    blocked_until: 'Owner/admin is in wp-admin and confirms the source reference.',
    safety: 'Leave release_to_router unchecked unless consent is explicit/owner-verified.',
  },
  {
    id: 'UK-03',
    phase: 'routing_hold',
    admin_location: 'Manual bridge checkboxes',
    recommended_value: 'Leave routing_hold active; do not tick release_to_router; keep billing queue preparation on only as a future proof field.',
    status: 'REQUIRED',
    owner_action: 'Create the record as held if approved.',
    blocked_until: 'Client gives explicit match permission and partner terms exist.',
    safety: 'The client is not introduced to anyone just because the lead exists.',
  },
  {
    id: 'UK-04',
    phase: 'client_permission',
    admin_location: 'Justice CRM -> Permission / re-permission queue',
    recommended_value: 'Use current inbound permission/details wording from the consent message pack; ask for case details and explicit permission to match.',
    status: 'BLOCKED_NO_SEND_FROM_REPO',
    owner_action: 'Owner/legal approves and sends the message manually only if appropriate.',
    blocked_until: 'Client replies with clear permission or owner verifies existing permission evidence.',
    safety: 'A WhatsApp button click alone is not permission for lawyer/supplier introduction.',
  },
  {
    id: 'UK-05',
    phase: 'partner_preview',
    admin_location: 'Justice CRM -> Anonymized partner preview / terms queue',
    recommended_value: 'No-PII preview only: area=UK/cross-border law; source=/uk-lawyer/; urgency/details only if safe; ask availability, scope, SLA and fee.',
    status: 'AFTER_PERMISSION_ONLY',
    owner_action: 'Use this after permission, before sending any name/phone/email/documents.',
    blocked_until: 'Permission evidence is recorded and routing_hold remains on.',
    safety: 'No screenshots, raw chat, exact phone, exact address or documents at preview stage.',
  },
  {
    id: 'UK-06',
    phase: 'partner_terms',
    admin_location: 'Supplier/lawyer profile + CRM partner terms queue',
    recommended_value: 'Record target_type=both or supplier/lawyer, terms_accepted, min fee, billing contact, response commitment and capacity limits.',
    status: 'REQUIRED_BEFORE_PII_RELEASE',
    owner_action: 'Register or complete at least one UK-law lawyer/supplier partner with accepted paid terms.',
    blocked_until: 'Accepted terms and billing contact are recorded.',
    safety: 'No PII release to a partner with missing fee or missing billing contact.',
  },
  {
    id: 'UK-07',
    phase: 'owner_release',
    admin_location: 'Justice CRM -> Owner handoff release queue',
    recommended_value: 'approved_manual_handoff only after permission, accepted terms and fee are all recorded.',
    status: 'FINAL_GATE',
    owner_action: 'Owner records the manual-only release decision.',
    blocked_until: 'Client permission + partner terms + owner release are present.',
    safety: 'Owner release records approval; the system still does not send anything automatically.',
  },
  {
    id: 'UK-08',
    phase: 'money',
    admin_location: 'Justice CRM -> Qualified lead billing queue',
      recommended_value: 'Move to ready_to_bill/invoice_sent with an invoice reference; move to paid only with private payment evidence.',
    status: 'MANUAL_INVOICE_PATH',
    owner_action: 'Collect invoice/reference for invoice_sent and private payment evidence before paid revenue is claimed.',
    blocked_until: 'Partner accepted fee and owner release happened for this lead.',
    safety: 'Do not mark paid or claim paid revenue without private payment evidence.',
  },
  {
    id: 'UK-09',
    phase: 'automation_boundary',
    admin_location: 'Justice CRM -> WhatsApp / TalkTo connector readiness',
    recommended_value: 'Keep webhook/API automation not live for this lead.',
    status: 'BLOCKED_PENDING_PROVIDER_GATES',
    owner_action: 'Use manual CRM path only until official provider route, signed payload/shared secret, pause control and permission text are approved.',
    blocked_until: 'Provider integration is approved separately.',
    safety: 'No WhatsApp Web/login automation, scraping, CAPTCHA/MFA bypass or unattended platform access.',
  },
];

const ownerTemplateRows = [
  {
    field: 'owner_private_crm_entry_decision',
    owner_value: '',
    allowed_values: 'approve_private_crm_entry | hold_email_only | needs_more_evidence',
    why: 'Confirms whether a real held CRM record may be created from the Outlook/WhatsApp source.',
    blocked_if_blank: 'Do not create the real CRM lead.',
  },
  {
    field: 'source_reference_stored_in_wp_admin',
    owner_value: '',
    allowed_values: 'Outlook message link/id or owner note; do not paste client PII into this CSV',
    why: 'Connects the private CRM record to the evidence without storing PII in repo artifacts.',
    blocked_if_blank: 'Keep source evidence in mailbox only.',
  },
  {
    field: 'source_channel',
    owner_value: '',
    allowed_values: 'whatsapp_manual | email_forward',
    why: 'Use whatsapp_manual when pasting WhatsApp text; use email_forward if only the forwarded email is recorded.',
    blocked_if_blank: 'Use whatsapp_manual only after confirming the source context.',
  },
  {
    field: 'handoff_path',
    owner_value: '',
    allowed_values: 'lawyer_and_supplier | supplier_marketplace',
    why: 'This UK lead may need both a lawyer and a legal-service supplier path.',
    blocked_if_blank: 'Default to lawyer_and_supplier but keep routing held.',
  },
  {
    field: 'legal_area',
    owner_value: '',
    allowed_values: 'uk-law',
    why: 'Prevents the lead from falling into generic or unrelated international categories.',
    blocked_if_blank: 'Do not route.',
  },
  {
    field: 'consent_status',
    owner_value: '',
    allowed_values: 'fresh_inbound_needs_details | explicit_match_consent | owner_verified_consent | do_not_contact',
    why: 'Controls whether any partner preview or routing can happen.',
    blocked_if_blank: 'Keep routing_hold=1 and do not contact partners.',
  },
  {
    field: 'client_permission_evidence_note',
    owner_value: '',
    allowed_values: 'Short private note in wp-admin; no client PII in this template',
    why: 'Needed before no-PII partner preview can become an actual handoff path.',
    blocked_if_blank: 'Do not release PII or route.',
  },
  {
    field: 'partner_target_type',
    owner_value: '',
    allowed_values: 'lawyer | supplier | both',
    why: 'Defines whether the first paid path is lawyer, supplier or combined.',
    blocked_if_blank: 'Keep partner terms not_started.',
  },
  {
    field: 'partner_terms_min_fee_ils',
    owner_value: '',
    allowed_values: 'number',
    why: 'Paid handoff cannot be counted without a fee and billing contact.',
    blocked_if_blank: 'Do not mark ready_to_bill.',
  },
  {
    field: 'owner_release_decision',
    owner_value: '',
    allowed_values: 'approved_manual_handoff | needs_more_review | do_not_release',
    why: 'Final manual gate before any client PII leaves the CRM.',
    blocked_if_blank: 'No handoff.',
  },
  {
    field: 'invoice_or_payment_evidence',
    owner_value: '',
    allowed_values: 'invoice reference or private evidence URL stored in wp-admin only',
    why: 'Revenue may be claimed only after proof exists.',
    blocked_if_blank: 'Do not mark paid.',
  },
];

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

function markdownReport(reportDate, checks, status) {
  const passingChecks = checks.filter((check) => check.status === 'PASS').length;
  const lines = [
    `# UK WhatsApp Lead Supplier Handoff Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    'Purpose: convert the current owner-forwarded UK-law WhatsApp/email lead into a precise, consent-safe CRM-to-lawyer/supplier-to-money operating packet without storing client PII in repo artifacts.',
    '',
    'Safety: no mailbox action, CMS publish, database edit, real CRM lead creation, partner contact, client contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin write or uPress action was performed.',
    '',
    '## Summary',
    '',
    `- Static code gates passing: ${passingChecks}/${checks.length}`,
    `- Operator rows: ${handoffRows.length}`,
    `- Owner template rows: ${ownerTemplateRows.length}`,
    '- Real CRM leads created: 0',
    '- Client/lawyer/supplier contacts made: 0',
    '- Public changes approved: 0',
    '- Revenue claimed: 0',
    '',
    '## Static Source Gates',
    '',
    '| ID | Gate | Status | File | Evidence | Markers | Missing | Next Step |',
    '| --- | --- | --- | --- | --- | ---: | --- | --- |',
    ...checks.map((check) => `| ${check.id} | ${check.gate} | ${check.status} | ${check.file} | ${mdCell(check.evidence)} | ${check.markers_found}/${check.markers_total} | ${mdCell(check.missing_markers)} | ${mdCell(check.next_step)} |`),
    '',
    '## Operator Packet',
    '',
    '| ID | Phase | Admin Location | Recommended Value | Status | Owner Action | Blocked Until | Safety |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...handoffRows.map((row) => `| ${row.id} | ${row.phase} | ${mdCell(row.admin_location)} | ${mdCell(row.recommended_value)} | ${row.status} | ${mdCell(row.owner_action)} | ${mdCell(row.blocked_until)} | ${mdCell(row.safety)} |`),
    '',
    '## First Safe Path',
    '',
    '1. Owner approves private CRM entry for this current inbound UK-law source.',
    '2. Admin creates a held private lead in `Manual WhatsApp / client lead bridge` with `legal_area=uk-law`, `handoff_path=lawyer_and_supplier`, `consent_status=fresh_inbound_needs_details` and routing held.',
    '3. Owner/legal approves and sends a current-inbound permission/details message manually, if appropriate.',
    '4. Only after explicit/owner-verified permission, use no-PII partner preview to find a UK-law lawyer/supplier willing to accept scope, SLA, fee and billing terms.',
    '5. Record accepted terms and billing contact, then owner release, then invoice/reference and private payment evidence.',
    '',
    '## Blockers',
    '',
    '- Do not create the real CRM lead from this packet alone; owner approval and wp-admin source reference are required.',
    '- Do not contact the client, supplier or lawyer until permission and owner/legal wording are clear.',
    '- Do not release PII until client permission, accepted partner terms, fee, billing contact and owner release exist.',
    '- Do not claim paid revenue until private payment evidence is recorded; invoice/reference alone supports invoice_sent only.',
    ''
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-uk-whatsapp-lead-supplier-handoff-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const checks = buildStaticChecks();
const status = checks.every((check) => check.status === 'PASS')
  ? 'UK_WHATSAPP_SUPPLIER_HANDOFF_PACKET_READY_NO_LIVE_ACTION'
  : 'UK_WHATSAPP_SUPPLIER_HANDOFF_PACKET_BLOCKED_STATIC_GATES';

const handoffColumns = ['id', 'phase', 'admin_location', 'recommended_value', 'status', 'owner_action', 'blocked_until', 'safety'];
const ownerTemplateColumns = ['field', 'owner_value', 'allowed_values', 'why', 'blocked_if_blank'];

const payload = {
  reportDate: args.reportDate,
  status,
  summary: {
    staticChecks: checks.length,
    staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
    operatorRows: handoffRows.length,
    ownerTemplateRows: ownerTemplateRows.length,
    realCrmLeadsCreated: 0,
    contactsMade: 0,
    publicChangesApproved: 0,
    revenueClaimed: 0,
  },
  checks,
  handoffRows,
  ownerTemplateRows,
  safety: {
    clientPiiStoredInRepo: false,
    crmLeadCreated: false,
    outboundMessageSent: false,
    partnerContacted: false,
    invoiceCreated: false,
    paymentChanged: false,
    publicCmsChanged: false,
    seoSettingsChanged: false,
    uPressAction: false,
  },
};

writeText(outputs.projectMd, markdownReport(args.reportDate, checks, status));
writeText(outputs.projectCsv, toCsv(handoffRows, handoffColumns));
writeText(outputs.reportJson, JSON.stringify(payload, null, 2) + '\n');
writeText(outputs.reportCsv, toCsv(handoffRows, handoffColumns));
writeText(outputs.ownerTemplateCsv, toCsv(ownerTemplateRows, ownerTemplateColumns));

console.table(handoffRows.map(({ id, phase, status }) => ({ id, phase, status })));
console.log(`${payload.summary.staticChecksPassing}/${payload.summary.staticChecks} static source checks passed.`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.ownerTemplateCsv)}`);

if (status.endsWith('BLOCKED_STATIC_GATES')) {
  process.exitCode = 1;
}
