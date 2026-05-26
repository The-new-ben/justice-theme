import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const sourceBases = {
  readiness: 'btl-first-paid-lead-readiness',
  activation: 'btl-first-prospect-activation-packet',
};

const adminLocations = {
  prospects: 'wp-admin -> Justice CRM -> Bituach Leumi specialist supply / Lawyer Prospects',
  crm: 'wp-admin -> Justice CRM -> Held Bituach Leumi lead triage / First paid-lead preflight',
  billing: 'wp-admin -> Justice CRM -> Qualified lead billing queue',
};

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || '2026-05-26',
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
  const base = `btl-runtime-revenue-proof-ledger-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `btl-runtime-revenue-proof-template-${reportDate}.csv`),
  };
}

function sourcePath(base, sourceDate) {
  return path.join(ROOT, '.reports', `${base}-${sourceDate}.json`);
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

function selectedPrimaryProspects(activation) {
  return (activation.activationRows || [])
    .filter((row) => row.queue === 'primary')
    .slice(0, 3);
}

function readinessGate(readiness, id) {
  return (readiness.rows || []).find((row) => row.id === id) || {};
}

function buildLedgerRows({ readiness, activation }) {
  const primaryProspects = selectedPrimaryProspects(activation);
  const runtimeGate = readinessGate(readiness, 'BTL-10');

  const prospectRows = primaryProspects.map((prospect, index) => ({
    id: `PROSPECT-${String(index + 1).padStart(2, '0')}`,
    stage: 'private_specialist_supply',
    current_status: 'NEEDS_OWNER_ADMIN_EVIDENCE',
    source_candidate: prospect.candidate || `Primary prospect ${index + 1}`,
    admin_location: adminLocations.prospects,
    required_evidence: 'Private prospect exists and license/status, Bituach Leumi appeal fit, response SLA, payment path, lead-fee terms and billing contact are all recorded.',
    crm_fields_or_anchors: 'prospect_license_verified=1; prospect_specialty_verified=1; prospect_payment_path_ready=1; prospect_lead_fee_terms_ready=1; prospect_agreed_lead_fee_ils>0; prospect_billing_contact_email valid',
    pass_condition: 'All verification-missing checks are empty and owner confirms the prospect can become routable.',
    blocked_until: 'Private prospect is created and all manual verification fields pass.',
    allowed_next_action: 'Convert to routable lawyer profile only after owner release and recorded accepted terms.',
    forbidden_action: 'Do not publish profile, send client PII, route a lead, invoice or claim revenue from this prospect row alone.',
    privacy_rule: 'No client PII. Do not paste private lawyer emails into repo artifacts.',
  }));

  const routeRows = [
    {
      id: 'LAWYER-COVERAGE-01',
      stage: 'routable_lawyer_coverage',
      current_status: 'NEEDS_OWNER_ADMIN_EVIDENCE',
      source_candidate: 'First 3 verified Bituach Leumi specialists',
      admin_location: adminLocations.crm,
      required_evidence: 'At least 3 routable lawyer profiles exist for Bituach Leumi appeal work with routing enabled, accepted terms and billing/contact email.',
      crm_fields_or_anchors: 'lead_routing_enabled=1; subscription_status=trialing/active/paid only after owner approval; billing_invoice_email or contact email present',
      pass_condition: 'Justice CRM first paid-lead preflight shows coverage ready and no billing/contact blockers.',
      blocked_until: '3 verified prospects are converted into routable lawyer profiles and billing/contact is present.',
      allowed_next_action: 'Run one controlled consented lead drill.',
      forbidden_action: 'Do not scale routing or claim supply readiness before the preflight is green.',
      privacy_rule: 'Use internal record IDs in the live admin only, not in public reports.',
    },
    {
      id: 'CONTROLLED-LEAD-01',
      stage: 'controlled_lead',
      current_status: 'NEEDS_OWNER_ADMIN_EVIDENCE',
      source_candidate: 'One consented Bituach Leumi lead',
      admin_location: adminLocations.crm,
      required_evidence: 'One lead has explicit_match_consent or owner_verified_consent, routing_hold cleared only by owner workflow, and Bituach Leumi appeal intent.',
      crm_fields_or_anchors: 'consent_status=explicit_match_consent/owner_verified_consent; routing_hold cleared only after owner release; lead_revenue_model=qualified_appeal_lead',
      pass_condition: 'The lead routes to an accepted specialist and creates qualified lead billing state.',
      blocked_until: 'Client permission and owner release are recorded in the live CRM.',
      allowed_next_action: 'Move the routed lead to billing queue after the handoff is actually made.',
      forbidden_action: 'Do not infer consent from WhatsApp button click alone; do not send raw chat, screenshots, documents or contact details at preview stage.',
      privacy_rule: 'No client name, phone, email, raw chat, exact address or documents in repo artifacts.',
    },
    {
      id: 'BILLING-01',
      stage: 'qualified_lead_billing',
      current_status: 'NEEDS_OWNER_ADMIN_EVIDENCE',
      source_candidate: 'Routed qualified appeal lead',
      admin_location: adminLocations.billing,
      required_evidence: 'Qualified lead billing status becomes ready_to_bill or invoice_sent with suggested lead price and linked billable lawyer.',
      crm_fields_or_anchors: 'qualified_lead_billing_status=ready_to_bill/invoice_sent; suggested_lead_price_ils>0; billable lawyer IDs linked',
      pass_condition: 'Manual invoice/payment request is sent to recorded billing contact and invoice/payment reference is saved before invoice_sent.',
      blocked_until: 'The controlled lead is routed and the billing queue shows a billable lead.',
      allowed_next_action: 'Send manual invoice/payment request and save reference.',
      forbidden_action: 'Do not mark paid, claim revenue or automate payment collection without proof.',
      privacy_rule: 'Repo report may record reference-present yes/no only, not invoice contents or private payment URLs.',
    },
    {
      id: 'PAYMENT-01',
      stage: 'payment_proof',
      current_status: 'NEEDS_OWNER_ADMIN_EVIDENCE',
      source_candidate: 'First paid Bituach Leumi lead',
      admin_location: adminLocations.billing,
      required_evidence: 'Payment proof exists through invoice/reference or private payment evidence URL and status is paid.',
      crm_fields_or_anchors: 'qualified_lead_billing_status=paid; qualified_lead_invoice_reference present or qualified_lead_payment_evidence_url present',
      pass_condition: 'Paid status has proof. The revenue loop can be counted once, with notes retained.',
      blocked_until: runtimeGate.next_action || 'Owner/admin records invoice/payment proof.',
      allowed_next_action: 'Record first paid-lead achievement and decide whether to scale the Bituach Leumi loop.',
      forbidden_action: 'Do not count revenue if paid status lacks invoice/reference or evidence URL.',
      privacy_rule: 'Keep payment proof URL private; do not copy receipts into repo.',
    },
    {
      id: 'GO-NOGO-01',
      stage: 'scale_decision',
      current_status: 'BLOCKED_UNTIL_PAYMENT_PROOF',
      source_candidate: 'Owner scale decision',
      admin_location: 'Owner review after live CRM evidence exists',
      required_evidence: '3 verified/routable specialists, 1 consented routed lead, invoice/reference, payment evidence and no unresolved complaint/refund/ethics issue.',
      crm_fields_or_anchors: 'all prior ledger rows PASS in live admin evidence',
      pass_condition: 'Owner approves scale, or holds for fixes.',
      blocked_until: 'PAYMENT-01 passes.',
      allowed_next_action: 'If approved, repeat controlled batches; if not, fix terms/supply/consent first.',
      forbidden_action: 'Do not expand WhatsApp/TalkTo lead routing or public claims before owner scale approval.',
      privacy_rule: 'Decision summary may be shared internally; client/lawyer/payment details stay private.',
    },
  ];

  return [...prospectRows, ...routeRows];
}

function buildTemplateRows(ledgerRows) {
  return ledgerRows.map((row) => ({
    id: row.id,
    live_record_id_or_admin_pointer: '',
    evidence_status: 'not_started',
    evidence_recorded_by: '',
    evidence_recorded_at: '',
    proof_present_yes_no: 'no',
    blocker_if_no: row.blocked_until,
    private_note_no_pii: '',
  }));
}

function ledgerStatus(ledgerRows, readiness, activation) {
  const readinessStatus = readiness.summary?.status || '';
  const activationStatus = activation.summary?.status || '';
  const primaryCount = selectedPrimaryProspects(activation).length;

  if (readinessStatus !== 'PASS_WITH_RUNTIME_BLOCKERS') {
    return 'BLOCKED_SOURCE_READINESS_NOT_CURRENT';
  }
  if (activationStatus !== 'READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY' || primaryCount < 3) {
    return 'BLOCKED_SOURCE_ACTIVATION_PACKET_NOT_READY';
  }
  if (ledgerRows.length < 8) {
    return 'BLOCKED_LEDGER_INCOMPLETE';
  }
  return 'RUNTIME_LEDGER_READY_NO_REVENUE_CLAIM';
}

function buildMarkdown({ reportDate, sourceDate, status, readiness, activation, ledgerRows }) {
  const prospectRows = ledgerRows.filter((row) => row.stage === 'private_specialist_supply');
  const proofRows = ledgerRows.filter((row) => row.current_status.includes('NEEDS'));
  const activationSummary = activation.summary || {};
  const readinessSummary = readiness.summary || {};

  const lines = [
    `# Bituach Leumi Runtime Revenue Proof Ledger - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Source packet date: ${sourceDate}`,
    '',
    'Scope: private owner/admin no-PII proof ledger for the Bituach Leumi specialist-to-first-paid-lead loop. This does not create prospects, create leads, contact lawyers, contact clients, route PII, invoice, charge payment, publish public pages, change SEO controls, send email/WhatsApp, use TalkTo, edit wp-admin or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Readiness source status: ${readinessSummary.status || 'unknown'}`,
    `- Activation source status: ${activationSummary.status || 'unknown'}`,
    `- Source candidates: ${activationSummary.sourceRows ?? 'unknown'}`,
    `- Primary private-entry prospects in source packet: ${activationSummary.primaryCount ?? prospectRows.length}`,
    `- Runtime proof ledger rows: ${ledgerRows.length}`,
    `- Rows still requiring live owner/admin evidence: ${proofRows.length}`,
    '- Revenue claims approved by this ledger: 0',
    '- Public changes approved by this ledger: 0',
    '',
    '## Ledger Rows',
    '',
    '| ID | Stage | Current Status | Required Evidence | CRM Fields / Anchors | Pass Condition | Blocked Until |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...ledgerRows.map(
      (row) =>
        `| ${row.id} | ${row.stage} | ${row.current_status} | ${mdCell(row.required_evidence)} | ${mdCell(row.crm_fields_or_anchors)} | ${mdCell(row.pass_condition)} | ${mdCell(row.blocked_until)} |`,
    ),
    '',
    '## Owner/Admin Run Order',
    '',
    '1. Create the first three private Bituach Leumi prospects from the activation packet, if the owner approves live private entry.',
    '2. Verify license/status, niche fit, response SLA, accepted fee, accepted terms and billing contact for each prospect.',
    '3. Convert only verified prospects into routable lawyer profiles and confirm the first paid-lead preflight is green.',
    '4. Use one consented controlled lead only; keep routing hold until consent and owner release are recorded.',
    '5. After actual routing, use the qualified lead billing queue, send a manual invoice/payment request, and save proof before marking paid.',
    '6. Count revenue only after payment proof exists; then decide whether to scale.',
    '',
    '## Privacy Boundary',
    '',
    '- Do not paste client names, phone numbers, emails, raw chats, screenshots, documents, exact addresses, invoice documents or private payment-proof URLs into repo artifacts.',
    '- The generated template is a status ledger only. Live evidence belongs in wp-admin/private owner systems.',
    '- Pressing a WhatsApp button is not enough permission for lawyer/supplier PII handoff.',
    '',
    '## Source Files',
    '',
    `- \`.reports/${sourceBases.readiness}-${sourceDate}.json\``,
    `- \`.reports/${sourceBases.activation}-${sourceDate}.json\``,
  ];

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-btl-runtime-revenue-proof-ledger.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const readinessPath = sourcePath(sourceBases.readiness, args.sourceDate);
  const activationPath = sourcePath(sourceBases.activation, args.sourceDate);
  const readiness = readJson(readinessPath);
  const activation = readJson(activationPath);
  const ledgerRows = buildLedgerRows({ readiness, activation });
  const templateRows = buildTemplateRows(ledgerRows);
  const status = ledgerStatus(ledgerRows, readiness, activation);
  const outputs = outputFiles(args.reportDate);

  const ledgerColumns = [
    'id',
    'stage',
    'current_status',
    'source_candidate',
    'admin_location',
    'required_evidence',
    'crm_fields_or_anchors',
    'pass_condition',
    'blocked_until',
    'allowed_next_action',
    'forbidden_action',
    'privacy_rule',
  ];

  const templateColumns = [
    'id',
    'live_record_id_or_admin_pointer',
    'evidence_status',
    'evidence_recorded_by',
    'evidence_recorded_at',
    'proof_present_yes_no',
    'blocker_if_no',
    'private_note_no_pii',
  ];

  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    summary: {
      readinessStatus: readiness.summary?.status || null,
      activationStatus: activation.summary?.status || null,
      sourceCandidates: activation.summary?.sourceRows || 0,
      primaryProspects: selectedPrimaryProspects(activation).length,
      ledgerRows: ledgerRows.length,
      templateRows: templateRows.length,
      revenueClaimsApproved: 0,
      publicChangesApproved: 0,
    },
    sourceFiles: {
      readiness: path.relative(ROOT, readinessPath).replace(/\\/g, '/'),
      activation: path.relative(ROOT, activationPath).replace(/\\/g, '/'),
    },
    ledgerRows,
    templateRows,
  };

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, readiness, activation, ledgerRows }));
  writeText(outputs.projectCsv, toCsv(ledgerRows, ledgerColumns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(ledgerRows, ledgerColumns));
  writeText(outputs.templateCsv, toCsv(templateRows, templateColumns));

  console.log(`Bituach Leumi runtime revenue proof ledger status: ${status}`);
  console.log(`Project markdown: ${path.relative(ROOT, outputs.projectMd)}`);
  console.log(`Evidence template: ${path.relative(ROOT, outputs.templateCsv)}`);
}

main();
