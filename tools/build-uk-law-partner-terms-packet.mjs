import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const sourceFiles = {
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  classifier: path.join(ROOT, 'inc', 'lead-classifier.php'),
  prospects: path.join(ROOT, 'inc', 'lawyer-prospects.php'),
  suppliers: path.join(ROOT, 'inc', 'lawyer-suppliers.php'),
  onboarding: path.join(ROOT, 'inc', 'lawyer-onboarding.php'),
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
  const base = `uk-law-partner-terms-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    partnerTemplateCsv: path.join(ROOT, '.project-control', `uk-law-partner-terms-template-${reportDate}.csv`),
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
      id: 'UKP-SRC-01',
      gate: 'uk_law_demand_classification',
      file: 'classifier',
      markers: ['uk-law', 'uk-lawyer', 'england lawyer', 'united kingdom', 'cross-border uk'],
      evidence: 'UK-law demand can be recognized and tagged before partner matching.',
      nextStep: 'Keep partner records tied to legal_area=uk-law and source_page_url=/uk-lawyer/.',
    }),
    checkMarkers({
      id: 'UKP-SRC-02',
      gate: 'supplier_partner_cms_fields',
      file: 'suppliers',
      markers: [
        'justice_supplier',
        'supplier_provider_type',
        'supplier_jurisdictions',
        'supplier_partnership_status',
        'supplier_revenue_model',
        'supplier_min_price_ils',
        'supplier_response_sla',
        'supplier_source_url',
      ],
      evidence: 'Supplier records can capture provider type, jurisdictions, commercial terms, SLA and source proof.',
      nextStep: 'Create/complete a private supplier record only after owner chooses a real UK-law partner.',
    }),
    checkMarkers({
      id: 'UKP-SRC-03',
      gate: 'supplier_readiness_and_safe_bid',
      file: 'suppliers',
      markers: [
        'justice_theme_lawyer_supplier_match_readiness',
        'justice_theme_lawyer_supplier_safe_bid_packet',
        'do not send client personal details',
        'Credential/license status is acceptable for controlled matching.',
      ],
      evidence: 'Supplier matching has readiness scoring and a no-PII first-contact packet.',
      nextStep: 'Use only after client permission and owner-approved partner research.',
    }),
    checkMarkers({
      id: 'UKP-SRC-04',
      gate: 'supplier_public_exposure_guard',
      file: 'suppliers',
      markers: [
        'justice_theme_lawyer_supplier_is_public_ready',
        'supplier_public_visibility',
        'show',
        'approved',
        'supplier_offer_summary',
      ],
      evidence: 'Supplier records do not become public merely because they exist; public display has explicit gates.',
      nextStep: 'Keep UK-law supplier partners private until public display is separately approved.',
    }),
    checkMarkers({
      id: 'UKP-SRC-05',
      gate: 'lawyer_prospect_terms_fields',
      file: 'prospects',
      markers: [
        'justice_prospect',
        'prospect_agreed_lead_fee_ils',
        'prospect_billing_contact_email',
        'prospect_lead_fee_terms_ready',
        'prospect_payment_path_ready',
        'prospect_license_verified',
        'prospect_specialty_verified',
      ],
      evidence: 'Lawyer coverage prospects can capture license, specialty, fee, billing contact and payment-path readiness.',
      nextStep: 'Use this when the UK-law partner is a lawyer or a lawyer-led firm.',
    }),
    checkMarkers({
      id: 'UKP-SRC-06',
      gate: 'manual_invoice_lawyer_path',
      file: 'onboarding',
      markers: [
        'manual_invoice',
        'billing_invoice_email',
        'payment_followup_status',
        'invoice_requested',
        'invoice_sent',
        'Paid plans are activated only after payment approval.',
      ],
      evidence: 'Lawyer onboarding supports manual invoice/payment follow-up before paid activation.',
      nextStep: 'Use manual invoice status only after accepted partner terms and owner release.',
    }),
    checkMarkers({
      id: 'UKP-SRC-07',
      gate: 'crm_partner_terms_owner_release_billing',
      file: 'crm',
      markers: [
        'partner_terms_status',
        'partner_terms_min_fee_ils',
        'owner_handoff_release_status',
        'qualified_lead_billing_status',
        'qualified_lead_invoice_reference',
        'qualified_lead_payment_evidence_url',
      ],
      evidence: 'CRM lead handoff has partner terms, owner release, invoice/reference and private payment evidence fields.',
      nextStep: 'Connect the UK partner to the specific lead only after client permission exists.',
    }),
  ];
}

const partnerRows = [
  {
    id: 'PARTNER-01',
    lane: 'partner_type_decision',
    admin_surface: 'Owner decision before wp-admin record',
    required_fields: 'Choose lawyer, supplier, or both; keep this private.',
    ready_when: 'Owner knows whether the UK-law response requires a licensed lawyer, an external supplier, or a lawyer-led supplier.',
    blocked_action: 'Do not introduce the client or promise a match.',
    next_owner_action: 'Choose first target type for the current UK-law demand.',
  },
  {
    id: 'PARTNER-02',
    lane: 'supplier_record',
    admin_surface: 'wp-admin -> Suppliers',
    required_fields: 'provider_type, supplier_category, service_area, jurisdictions, license_status, partnership_status, revenue_model, min_price, response_sla, contact route, source_url, owner_note.',
    ready_when: 'partnership_status=approved or at least candidate terms are documented for owner review.',
    blocked_action: 'Do not expose supplier publicly or send PII.',
    next_owner_action: 'Create or complete a UK-law supplier candidate only after owner selects a real partner.',
  },
  {
    id: 'PARTNER-03',
    lane: 'lawyer_prospect_record',
    admin_surface: 'wp-admin -> Lawyer Prospects',
    required_fields: 'practice_area=uk-law, city/coverage area, target_plan=lead_partner, license_verified, specialty_verified, agreed_lead_fee_ils, billing_contact_email, lead_fee_terms_ready, payment_path_ready.',
    ready_when: 'license/specialty/payment/fee/billing fields are complete.',
    blocked_action: 'Do not route as a paid lawyer lead while terms are incomplete.',
    next_owner_action: 'Use if the first UK partner is a lawyer or a lawyer-led office.',
  },
  {
    id: 'PARTNER-04',
    lane: 'terms_acceptance',
    admin_surface: 'CRM partner terms queue or partner record notes',
    required_fields: 'accepted service category, jurisdiction limits, response SLA, fixed price or lead fee, billing contact, VAT/invoice path, capacity limit, conflict/refusal rule.',
    ready_when: 'terms are accepted in writing and stored in wp-admin notes.',
    blocked_action: 'Do not release client PII or mark ready_to_bill.',
    next_owner_action: 'Record partner terms before any handoff.',
  },
  {
    id: 'PARTNER-05',
    lane: 'no_pii_preview',
    admin_surface: 'Justice CRM -> Anonymized partner preview / terms queue',
    required_fields: 'area=UK/cross-border law, source=/uk-lawyer/, general urgency, sanitized facts, no name/phone/email/documents/raw chat.',
    ready_when: 'client permission is recorded and preview text is safe.',
    blocked_action: 'Do not send screenshots, raw WhatsApp content or identifying details.',
    next_owner_action: 'Use only after the client gives match permission.',
  },
  {
    id: 'PARTNER-06',
    lane: 'owner_release',
    admin_surface: 'Justice CRM -> Owner handoff release queue',
    required_fields: 'client permission, accepted partner terms, fee, billing contact, owner release note.',
    ready_when: 'owner_handoff_release_status=approved_manual_handoff.',
    blocked_action: 'Do not hand off or remove routing hold without owner release.',
    next_owner_action: 'Record manual-only release for the specific lead/partner pair.',
  },
  {
    id: 'PARTNER-07',
    lane: 'billing_proof',
    admin_surface: 'Justice CRM -> Qualified lead billing queue / Lawyer Onboarding payment follow-up',
    required_fields: 'invoice/reference for invoice-stage follow-up, private payment evidence URL for paid status, billing status, owner note.',
    ready_when: 'invoice_sent has reference or paid has private payment evidence.',
    blocked_action: 'Do not claim paid revenue or mark paid without private payment evidence.',
    next_owner_action: 'Use manual invoice path until payment provider proof exists.',
  },
  {
    id: 'PARTNER-08',
    lane: 'public_exposure_guard',
    admin_surface: 'Supplier public visibility / lawyer profile publication controls',
    required_fields: 'explicit public approval, source proof, approved status, offer summary, no business-plan language.',
    ready_when: 'Owner separately approves public display after legal/source review.',
    blocked_action: 'Do not publish supplier cards, public claims, pricing or paid placement language from this packet.',
    next_owner_action: 'Keep UK-law partner private for now.',
  },
];

const templateRows = [
  {
    field: 'partner_type',
    owner_value: '',
    allowed_values: 'lawyer | supplier | both',
    why: 'Determines whether to use Lawyer Prospects, Suppliers, or both.',
    blocked_if_blank: 'No partner record creation.',
  },
  {
    field: 'partner_private_name_or_id',
    owner_value: '',
    allowed_values: 'wp-admin record title/id only; no public publication from this template',
    why: 'Connects the chosen partner to the internal workflow.',
    blocked_if_blank: 'No handoff.',
  },
  {
    field: 'coverage_scope',
    owner_value: '',
    allowed_values: 'uk-law | cross-border-uk | england | london | owner-defined',
    why: 'Prevents misrouting to unrelated international-law partners.',
    blocked_if_blank: 'Keep prospect/supplier as research only.',
  },
  {
    field: 'license_or_credential_status',
    owner_value: '',
    allowed_values: 'verified | source_checked | not_required | self_reported | unknown',
    why: 'Controls whether the partner can be trusted for the specific service.',
    blocked_if_blank: 'Do not release PII.',
  },
  {
    field: 'accepted_service_categories',
    owner_value: '',
    allowed_values: 'short private list',
    why: 'The partner must accept the category before a lead is offered.',
    blocked_if_blank: 'Do not preview the lead.',
  },
  {
    field: 'response_sla',
    owner_value: '',
    allowed_values: 'same_day | 24h | 48h | owner-defined',
    why: 'Needed before telling the owner/client a handoff is workable.',
    blocked_if_blank: 'Do not release PII.',
  },
  {
    field: 'lead_fee_or_min_price_ils',
    owner_value: '',
    allowed_values: 'number',
    why: 'Money path requires a fee/price before billing.',
    blocked_if_blank: 'Do not mark ready_to_bill.',
  },
  {
    field: 'billing_contact',
    owner_value: '',
    allowed_values: 'billing email or wp-admin private note',
    why: 'Invoices/payment requests need a real billing owner.',
    blocked_if_blank: 'No invoice.',
  },
  {
    field: 'client_permission_recorded',
    owner_value: '',
    allowed_values: 'yes | no',
    why: 'No partner PII handoff before client permission.',
    blocked_if_blank: 'No no-PII preview outside CRM.',
  },
  {
    field: 'owner_release_decision',
    owner_value: '',
    allowed_values: 'approved_manual_handoff | needs_more_review | do_not_release',
    why: 'Final manual gate for this partner/lead pair.',
    blocked_if_blank: 'No handoff.',
  },
  {
    field: 'invoice_or_payment_proof',
    owner_value: '',
    allowed_values: 'invoice reference or private evidence URL stored in wp-admin only',
    why: 'Revenue cannot be counted without proof.',
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
    `# UK-Law Partner Terms Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    'Purpose: prepare the partner side of the current UK-law lead path: find/register a lawyer or supplier, record paid terms, preserve no-PII rules, and keep paid revenue claims blocked until private payment evidence exists.',
    '',
    'Safety: no mailbox action, CMS publish, database edit, supplier creation, lawyer prospect creation, lawyer registration, partner contact, client contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin write or uPress action was performed.',
    '',
    '## Summary',
    '',
    `- Static source gates passing: ${passingChecks}/${checks.length}`,
    `- Partner workflow rows: ${partnerRows.length}`,
    `- Owner template rows: ${templateRows.length}`,
    '- Supplier/lawyer records created: 0',
    '- Contacts made: 0',
    '- Public exposure approved: 0',
    '- Revenue claimed: 0',
    '',
    '## Static Source Gates',
    '',
    '| ID | Gate | Status | File | Evidence | Markers | Missing | Next Step |',
    '| --- | --- | --- | --- | --- | ---: | --- | --- |',
    ...checks.map((check) => `| ${check.id} | ${check.gate} | ${check.status} | ${check.file} | ${mdCell(check.evidence)} | ${check.markers_found}/${check.markers_total} | ${mdCell(check.missing_markers)} | ${mdCell(check.next_step)} |`),
    '',
    '## Partner Workflow',
    '',
    '| ID | Lane | Admin Surface | Required Fields | Ready When | Blocked Action | Next Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...partnerRows.map((row) => `| ${row.id} | ${row.lane} | ${mdCell(row.admin_surface)} | ${mdCell(row.required_fields)} | ${mdCell(row.ready_when)} | ${mdCell(row.blocked_action)} | ${mdCell(row.next_owner_action)} |`),
    '',
    '## First Practical Sequence',
    '',
    '1. Choose first UK-law partner type: lawyer, supplier, or both.',
    '2. Complete one private partner record with scope, credential/source proof, SLA, fee/price and billing contact.',
    '3. Only after client match permission, send a no-PII partner preview.',
    '4. Record accepted terms and owner release before client PII leaves the CRM.',
    '5. Use invoice/reference for invoice-stage follow-up and private payment evidence before paid revenue claims.',
    '',
    '## Blockers',
    '',
    '- Do not create a real supplier/lawyer/prospect record from this packet alone.',
    '- Do not contact a partner or client until owner approval and consent conditions are met.',
    '- Do not expose the partner publicly or publish UK-law service claims from this packet.',
    '- Do not mark paid or claim paid revenue until private payment evidence exists.',
    ''
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-uk-law-partner-terms-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const checks = buildStaticChecks();
const status = checks.every((check) => check.status === 'PASS')
  ? 'UK_LAW_PARTNER_TERMS_PACKET_READY_NO_LIVE_ACTION'
  : 'UK_LAW_PARTNER_TERMS_PACKET_BLOCKED_STATIC_GATES';

const partnerColumns = ['id', 'lane', 'admin_surface', 'required_fields', 'ready_when', 'blocked_action', 'next_owner_action'];
const templateColumns = ['field', 'owner_value', 'allowed_values', 'why', 'blocked_if_blank'];
const payload = {
  reportDate: args.reportDate,
  status,
  summary: {
    staticChecks: checks.length,
    staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
    partnerRows: partnerRows.length,
    ownerTemplateRows: templateRows.length,
    supplierRecordsCreated: 0,
    lawyerProspectsCreated: 0,
    contactsMade: 0,
    publicExposureApproved: 0,
    revenueClaimed: 0,
  },
  checks,
  partnerRows,
  templateRows,
  safety: {
    publicCmsChanged: false,
    partnerRecordCreated: false,
    outboundMessageSent: false,
    clientPiiShared: false,
    invoiceCreated: false,
    paymentChanged: false,
    seoSettingsChanged: false,
    uPressAction: false,
  },
};

writeText(outputs.projectMd, markdownReport(args.reportDate, checks, status));
writeText(outputs.projectCsv, toCsv(partnerRows, partnerColumns));
writeText(outputs.reportJson, JSON.stringify(payload, null, 2) + '\n');
writeText(outputs.reportCsv, toCsv(partnerRows, partnerColumns));
writeText(outputs.partnerTemplateCsv, toCsv(templateRows, templateColumns));

console.table(partnerRows.map(({ id, lane, ready_when }) => ({ id, lane, ready_when })));
console.log(`${payload.summary.staticChecksPassing}/${payload.summary.staticChecks} static source checks passed.`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.partnerTemplateCsv)}`);

if (status.endsWith('BLOCKED_STATIC_GATES')) {
  process.exitCode = 1;
}
