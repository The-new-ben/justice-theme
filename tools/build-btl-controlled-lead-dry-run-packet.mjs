import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    ledgerDate: process.env.LEDGER_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--ledgerDate=')) {
      args.ledgerDate = arg.slice('--ledgerDate='.length);
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
  const base = `btl-controlled-lead-dry-run-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `btl-controlled-lead-dry-run-template-${reportDate}.csv`),
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

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function sourcePaths({ ledgerDate }) {
  return {
    ledger: path.join(ROOT, '.reports', `btl-runtime-revenue-proof-ledger-${ledgerDate}.json`),
    consentPack: path.join(ROOT, '.reports', `whatsapp-talkto-consent-message-pack-${ledgerDate}.json`),
    invoiceFallback: path.join(ROOT, '.reports', `manual-invoice-revenue-fallback-packet-${ledgerDate}.json`),
    leadCrm: path.join(ROOT, 'inc', 'lead-crm.php'),
    leadRouting: path.join(ROOT, 'inc', 'lead-routing.php'),
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function staticChecks(paths, ledger, consentPack, invoiceFallback) {
  const crm = readText(paths.leadCrm);
  const routing = readText(paths.leadRouting);
  const invoiceStatus = invoiceFallback.status || invoiceFallback.summary?.status || '';

  return [
    {
      id: 'CHECK-01',
      gate: 'runtime ledger available',
      status: ledger.status === 'RUNTIME_LEDGER_READY_NO_REVENUE_CLAIM' ? 'PASS' : 'BLOCKED',
      evidence: ledger.status || 'missing status',
    },
    {
      id: 'CHECK-02',
      gate: 'consent message pack available without send approval',
      status: consentPack.status === 'CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND' ? 'PASS' : 'BLOCKED',
      evidence: consentPack.status || 'missing status',
    },
    {
      id: 'CHECK-03',
      gate: 'manual invoice fallback available without live payment action',
      status: invoiceStatus === 'MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION' ? 'PASS' : 'BLOCKED',
      evidence: invoiceStatus || 'missing status',
    },
    {
      id: 'CHECK-04',
      gate: 'routing hold and external consent guard present',
      status: routing.includes('routing_hold') && routing.includes('explicit_match_consent') && routing.includes('owner_verified_consent') ? 'PASS' : 'BLOCKED',
      evidence: 'inc/lead-routing.php routing_hold plus routeable consent markers',
    },
    {
      id: 'CHECK-05',
      gate: 'qualified lead billing proof fields present',
      status: crm.includes('qualified_lead_invoice_reference') && crm.includes('qualified_lead_payment_evidence_url') && crm.includes("'paid' === $billing_status && '' === $payment_evidence_url") && crm.includes('qualified_lead_paid_at') ? 'PASS' : 'BLOCKED',
      evidence: 'inc/lead-crm.php separates invoice reference from paid payment-evidence proof',
    },
  ];
}

function buildRows(ledger) {
  const prospectRows = (ledger.ledgerRows || [])
    .filter((row) => row.stage === 'private_specialist_supply')
    .slice(0, 3)
    .map((row, index) => ({
      id: `DRILL-PROSPECT-${String(index + 1).padStart(2, '0')}`,
      sequence: String(index + 1),
      phase: 'supply',
      owner_admin_action: `Create or verify private Bituach Leumi prospect ${index + 1} in wp-admin only.`,
      required_proof: 'License/status verified; direct Bituach Leumi appeal fit verified; response SLA recorded; accepted lead-fee or subscription terms recorded; billing contact recorded.',
      pass_condition: 'All private prospect verification fields pass and owner approves routable activation.',
      fail_stop: 'Any missing license, fit, terms, billing contact or owner approval blocks routing.',
      crm_anchor: row.crm_fields_or_anchors,
      allowed_next_action: 'Convert to routable lawyer profile after owner release.',
      forbidden_action: 'Do not publish profile, send client PII, contact client, invoice or count revenue from prospect setup alone.',
      repo_privacy_rule: 'Use generic prospect numbers in repo; real names, phones, emails and notes stay in wp-admin only.',
    }));

  return [
    ...prospectRows,
    {
      id: 'DRILL-COVERAGE-01',
      sequence: '4',
      phase: 'supply',
      owner_admin_action: 'Confirm the first paid-lead preflight shows 3 routable Bituach Leumi specialists.',
      required_proof: 'Published/private lawyer profiles are routable, have Bituach Leumi area, routing enabled, accepted commercial terms, billing contact and remaining lead capacity.',
      pass_condition: 'Preflight has no supply, billing or routing-capacity blockers.',
      fail_stop: 'Fewer than 3 routable specialists blocks the controlled lead drill.',
      crm_anchor: 'wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> First paid-lead routing preflight',
      allowed_next_action: 'Select one controlled consented lead.',
      forbidden_action: 'Do not route leads to non-routable or unpaid/unverified profiles.',
      repo_privacy_rule: 'Do not put live lawyer IDs, emails or private billing fields in repo artifacts.',
    },
    {
      id: 'DRILL-CLIENT-01',
      sequence: '5',
      phase: 'consent',
      owner_admin_action: 'Select one current Bituach Leumi lead with explicit match permission.',
      required_proof: 'Lead has explicit_match_consent or owner_verified_consent, owner release note, Bituach Leumi appeal intent and no do-not-contact signal.',
      pass_condition: 'Consent evidence and owner release are recorded before routing_hold is cleared.',
      fail_stop: 'No explicit permission, unclear permission, old legacy row, or do-not-contact blocks the drill.',
      crm_anchor: 'wp-admin -> Justice CRM -> Held Bituach Leumi lead triage / permission queue',
      allowed_next_action: 'Prepare no-PII partner preview or controlled route.',
      forbidden_action: 'Do not infer consent from a WhatsApp click, old chat, silence, emoji or missed call.',
      repo_privacy_rule: 'No client name, phone, email, documents, raw chat or exact address in repo artifacts.',
    },
    {
      id: 'DRILL-PREVIEW-01',
      sequence: '6',
      phase: 'partner_preview',
      owner_admin_action: 'Prepare a no-PII preview of the controlled Bituach Leumi lead.',
      required_proof: 'Preview includes general issue, urgency and region only if safe; excludes name, phone, email, exact address, documents and raw WhatsApp/TalkTo content.',
      pass_condition: 'Partner terms and billing contact are already accepted before any PII release.',
      fail_stop: 'Partner has not accepted terms or billing contact, or preview contains PII.',
      crm_anchor: 'wp-admin -> Justice CRM -> Partner preview / terms queue',
      allowed_next_action: 'Manual handoff only after owner release confirms consent and terms.',
      forbidden_action: 'Do not send screenshots, raw chats, medical documents or full contact details at preview stage.',
      repo_privacy_rule: 'Repo can record preview-ready yes/no only.',
    },
    {
      id: 'DRILL-ROUTE-01',
      sequence: '7',
      phase: 'manual_handoff',
      owner_admin_action: 'Perform one controlled manual/routed handoff after all prior proof rows pass.',
      required_proof: 'Owner release confirms client permission, accepted partner terms, billing contact, manual-only scope and lead price/fee.',
      pass_condition: 'The lead reaches one accepted specialist and creates a qualified billing queue item.',
      fail_stop: 'Any missing owner release, partner terms or consent keeps routing_hold on.',
      crm_anchor: 'wp-admin -> Justice CRM -> Owner handoff release queue',
      allowed_next_action: 'Move to billing queue and request invoice/payment proof.',
      forbidden_action: 'Do not automate webhooks, bulk route, or contact additional partners from this drill.',
      repo_privacy_rule: 'No live handoff details in repo; keep exact IDs in wp-admin.',
    },
    {
      id: 'DRILL-BILLING-01',
      sequence: '8',
      phase: 'billing',
      owner_admin_action: 'Record manual invoice/payment request for the accepted partner.',
      required_proof: 'Qualified lead billing status, invoice reference or payment request reference, suggested price and billable partner are recorded.',
      pass_condition: 'Invoice_sent can be recorded only with reference; paid can be recorded only with proof.',
      fail_stop: 'No invoice/reference means no invoice_sent; no payment evidence means no paid revenue claim.',
      crm_anchor: 'wp-admin -> Justice CRM -> Qualified lead billing queue',
      allowed_next_action: 'Wait for payment evidence and record it privately.',
      forbidden_action: 'Do not mark paid or claim first paid lead from a promise to pay.',
      repo_privacy_rule: 'Repo may say reference present yes/no; no private invoice or payment URLs.',
    },
    {
      id: 'DRILL-PAYMENT-01',
      sequence: '9',
      phase: 'payment_proof',
      owner_admin_action: 'Verify actual payment proof exists before counting revenue.',
      required_proof: 'qualified_lead_billing_status=paid and private payment evidence URL is present; invoice reference alone is not paid proof.',
      pass_condition: 'Paid status has proof, no refund/dispute/complaint is open, and owner confirms one-time revenue count.',
      fail_stop: 'Any missing proof, dispute, refund, complaint or ethics concern blocks revenue count.',
      crm_anchor: 'wp-admin -> Justice CRM -> Qualified lead billing queue',
      allowed_next_action: 'Record first paid-lead achievement and prepare scale/no-go review.',
      forbidden_action: 'Do not count paid revenue from screenshots outside CRM or undocumented owner notes.',
      repo_privacy_rule: 'Payment evidence stays private; repo only records proof-present status.',
    },
    {
      id: 'DRILL-SCALE-01',
      sequence: '10',
      phase: 'scale_decision',
      owner_admin_action: 'Decide whether to repeat, repair or stop the Bituach Leumi paid-lead loop.',
      required_proof: 'All prior drill rows pass; owner confirms supply quality, consent process, billing proof, refund path and no unresolved complaints.',
      pass_condition: 'Owner approves controlled repeat batches, or holds for repair.',
      fail_stop: 'Any unresolved blocker keeps the loop in controlled/manual mode only.',
      crm_anchor: 'Owner review after live CRM proof exists',
      allowed_next_action: 'Repeat small controlled batches after approval.',
      forbidden_action: 'Do not publish public claims, scale WhatsApp/TalkTo imports or automate lead routing from one incomplete drill.',
      repo_privacy_rule: 'Scale decision can be summarized without live client/lawyer/payment details.',
    },
  ];
}

function templateRows(rows) {
  return rows.map((row) => ({
    id: row.id,
    live_admin_pointer: '',
    evidence_status: 'not_started',
    proof_present_yes_no: 'no',
    owner_verified_yes_no: 'no',
    blocker_if_no: row.fail_stop,
    private_note_no_pii: '',
  }));
}

function buildStatus(checks, rows) {
  if (checks.some((check) => check.status !== 'PASS')) {
    return 'BLOCKED_STATIC_GATE_MISSING';
  }
  if (rows.length < 10) {
    return 'BLOCKED_DRY_RUN_ROWS_INCOMPLETE';
  }
  return 'BTL_CONTROLLED_DRY_RUN_READY_NO_LIVE_ACTION';
}

function markdownReport({ reportDate, ledgerDate, outputs, status, checks, rows }) {
  const lines = [
    `# Bituach Leumi Controlled Lead Dry-Run Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Source ledger date: ${ledgerDate}`,
    '',
    'Purpose: give the owner/admin a no-PII dry-run worksheet for the first Bituach Leumi paid-lead loop, from private specialist supply through consent, no-PII preview, owner release, billing proof and scale decision.',
    '',
    'Safety: no wp-admin action, CRM record, prospect record, lead, lawyer contact, client contact, WhatsApp/TalkTo/email message, invoice, payment, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, provider setting or uPress deployment was performed.',
    '',
    '## Generated Files',
    '',
    `- Private report: \`${path.relative(ROOT, outputs.projectMd)}\``,
    `- Private CSV: \`${path.relative(ROOT, outputs.projectCsv)}\``,
    `- Fillable dry-run template: \`${path.relative(ROOT, outputs.templateCsv)}\``,
    `- Machine JSON: \`${path.relative(ROOT, outputs.reportJson)}\``,
    `- Machine CSV: \`${path.relative(ROOT, outputs.reportCsv)}\``,
    '',
    '## Summary',
    '',
    `- Static gates passing: ${checks.filter((check) => check.status === 'PASS').length}/${checks.length}`,
    `- Dry-run rows: ${rows.length}`,
    `- Supply rows: ${rows.filter((row) => row.phase === 'supply').length}`,
    `- Consent/client rows: ${rows.filter((row) => row.phase === 'consent').length}`,
    `- Billing/payment rows: ${rows.filter((row) => ['billing', 'payment_proof'].includes(row.phase)).length}`,
    '- Live records created: 0',
    '- Messages sent: 0',
    '- Revenue claims approved: 0',
    '- Public changes approved: 0',
    '',
    '## Static Gates',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...checks.map((check) => `| ${check.id} | ${check.gate} | ${check.status} | ${mdCell(check.evidence)} |`),
    '',
    '## Dry-Run Rows',
    '',
    '| ID | Sequence | Phase | Owner/Admin Action | Required Proof | Pass Condition | Fail Stop | CRM Anchor |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.sequence} | ${row.phase} | ${mdCell(row.owner_admin_action)} | ${mdCell(row.required_proof)} | ${mdCell(row.pass_condition)} | ${mdCell(row.fail_stop)} | ${mdCell(row.crm_anchor)} |`),
    '',
    '## Completion Rule',
    '',
    'This packet is complete as a private dry-run artifact, but the business loop is not complete. The first paid Bituach Leumi lead can be counted only when the fillable template is completed from live wp-admin evidence and `DRILL-PAYMENT-01` passes with payment proof.',
    '',
    '## Linear Anchors',
    '',
    '- Parent: `HAD-76` Bituach Leumi first paid-lead loop.',
    '- Related: `HAD-134` runtime proof ledger, `HAD-148` consent message pack, `HAD-142` manual invoice fallback, `HAD-87` WhatsApp/TalkTo CRM.',
    '',
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-btl-controlled-lead-dry-run-packet.mjs [--reportDate=YYYY-MM-DD] [--ledgerDate=YYYY-MM-DD]');
  process.exit(0);
}

const paths = sourcePaths(args);
const ledger = readJson(paths.ledger);
const consentPack = readJson(paths.consentPack);
const invoiceFallback = readJson(paths.invoiceFallback);
const checks = staticChecks(paths, ledger, consentPack, invoiceFallback);
const rows = buildRows(ledger);
const status = buildStatus(checks, rows);
const outputs = outputFiles(args.reportDate);
const columns = [
  'id',
  'sequence',
  'phase',
  'owner_admin_action',
  'required_proof',
  'pass_condition',
  'fail_stop',
  'crm_anchor',
  'allowed_next_action',
  'forbidden_action',
  'repo_privacy_rule',
];

writeText(outputs.projectMd, markdownReport({ reportDate: args.reportDate, ledgerDate: args.ledgerDate, outputs, status, checks, rows }));
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.templateCsv, toCsv(templateRows(rows), ['id', 'live_admin_pointer', 'evidence_status', 'proof_present_yes_no', 'owner_verified_yes_no', 'blocker_if_no', 'private_note_no_pii']));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, `${JSON.stringify({
  reportDate: args.reportDate,
  ledgerDate: args.ledgerDate,
  status,
  summary: {
    staticChecks: checks.length,
    staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
    dryRunRows: rows.length,
    supplyRows: rows.filter((row) => row.phase === 'supply').length,
    consentRows: rows.filter((row) => row.phase === 'consent').length,
    billingPaymentRows: rows.filter((row) => ['billing', 'payment_proof'].includes(row.phase)).length,
    liveRecordsCreated: 0,
    messagesSent: 0,
    revenueClaimsApproved: 0,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    upressDeploymentRequired: false,
  },
  sourceFiles: {
    ledger: path.relative(ROOT, paths.ledger),
    consentPack: path.relative(ROOT, paths.consentPack),
    invoiceFallback: path.relative(ROOT, paths.invoiceFallback),
  },
  checks,
  rows,
  templateRows: templateRows(rows),
}, null, 2)}\n`);

console.log(JSON.stringify({
  reportDate: args.reportDate,
  status,
  dryRunRows: rows.length,
  staticChecks: checks.length,
  staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
  liveRecordsCreated: 0,
  messagesSent: 0,
  publicChangesApproved: 0,
  upressDeploymentRequired: false,
}, null, 2));
