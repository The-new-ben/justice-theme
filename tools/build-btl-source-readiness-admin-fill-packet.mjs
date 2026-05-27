import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

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
    if (name === 'help') {
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `btl-source-readiness-admin-fill-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    fillTemplateCsv: path.join(ROOT, '.project-control', `btl-source-readiness-admin-fill-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    ledger: path.join(ROOT, '.reports', `btl-runtime-revenue-proof-ledger-${sourceDate}.json`),
    dryRun: path.join(ROOT, '.reports', `btl-controlled-lead-dry-run-packet-${sourceDate}.json`),
    readiness: path.join(ROOT, '.reports', `btl-first-paid-lead-readiness-${sourceDate}.json`),
    activation: path.join(ROOT, '.reports', `btl-first-prospect-activation-packet-${sourceDate}.json`),
  };
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath);
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

function buildAdminRows(ledgerRows) {
  return ledgerRows.map((row, index) => ({
    id: row.id,
    sequence: String(index + 1),
    stage: row.stage,
    current_status: row.current_status,
    source_candidate_reference: `${row.id} private admin row (no name stored in repo)`,
    admin_location: row.admin_location,
    required_private_evidence: row.required_evidence,
    crm_fields_or_anchors: row.crm_fields_or_anchors,
    pass_condition: row.pass_condition,
    blocker_if_no: row.blocked_until,
    allowed_next_action_after_owner_release: row.allowed_next_action,
    forbidden_action: row.forbidden_action,
    privacy_rule: row.privacy_rule,
    live_action_approved: 'no',
  }));
}

function buildFillRows(adminRows) {
  return adminRows.map((row) => ({
    id: row.id,
    stage: row.stage,
    live_admin_pointer_no_pii: '',
    evidence_status: 'not_started',
    owner_admin_decision: '',
    accepted_values: 'pass / fail / partial / not_available / needs_owner / park',
    proof_present_yes_no: 'no',
    owner_verified_yes_no: 'no',
    blocker_if_no: row.blocker_if_no,
    private_note_no_pii: '',
    public_or_live_action_approved: 'no',
  }));
}

function buildGateRows({ ledger, dryRun, readiness, activation, adminRows }) {
  return [
    {
      id: 'BTL-SOURCE-GATE-01',
      gate: 'source_rows_indexed',
      status: adminRows.length === 8 ? 'PASS' : 'BLOCKED',
      evidence: `${adminRows.length} ledger rows converted into owner/admin fill rows.`,
      next_action: 'Owner/admin fills the no-PII template from private wp-admin evidence only.',
    },
    {
      id: 'BTL-SOURCE-GATE-02',
      gate: 'runtime_readiness_still_blocked',
      status: statusOf(ledger) === 'BLOCKED_SOURCE_READINESS_NOT_CURRENT' ? 'BLOCKED_OWNER_ADMIN_EVIDENCE_REQUIRED' : 'REVIEW',
      evidence: `Runtime ledger: ${statusOf(ledger)}; dry-run: ${statusOf(dryRun)}; readiness: ${statusOf(readiness)}; activation: ${statusOf(activation)}.`,
      next_action: 'Treat this as a live-evidence request, not approval to create or edit records.',
    },
    {
      id: 'BTL-SOURCE-GATE-03',
      gate: 'payment_proof_rule_preserved',
      status: adminRows.some((row) => row.id === 'PAYMENT-01' && row.required_private_evidence.includes('private payment evidence URL')) ? 'PASS' : 'BLOCKED',
      evidence: 'PAYMENT-01 requires private payment evidence URL; invoice/reference alone remains invoice-stage evidence.',
      next_action: 'Do not count paid revenue until payment proof is recorded privately.',
    },
    {
      id: 'BTL-SOURCE-GATE-04',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This packet records 0 wp-admin/CRM/contact/invoice/payment/email/WhatsApp/TalkTo/public/uPress approvals.',
      next_action: 'Use filled rows for a later private proof review only.',
    },
  ];
}

function buildMarkdown({ summary, adminRows, gateRows }) {
  const gateTable = [
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
  ].join('\n');

  const rowTable = [
    '| ID | Sequence | Stage | Current Status | Required Private Evidence | CRM Fields / Anchors | Blocker If No |',
    '| --- | ---: | --- | --- | --- | --- | --- |',
    ...adminRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.sequence)} | ${mdCell(row.stage)} | ${mdCell(row.current_status)} | ${mdCell(row.required_private_evidence)} | ${mdCell(row.crm_fields_or_anchors)} | ${mdCell(row.blocker_if_no)} |`),
  ].join('\n');

  return `# BTL Source Readiness Admin Fill Packet - ${summary.reportDate}

Status: ${summary.status}

Scope: private owner/admin source-readiness packet only. It does not create prospects, create or edit CRM records, contact lawyers, contact clients, route PII, invoice, charge payment, mark paid revenue, publish public pages, change SEO controls, send email/WhatsApp/TalkTo, call GSC/API services, edit wp-admin, or deploy uPress.

## Source Statuses

- Runtime ledger (${summary.sourceDate}): ${summary.sourceStatuses.ledger}
- Controlled dry-run (${summary.sourceDate}): ${summary.sourceStatuses.dryRun}
- First paid-lead readiness (${summary.sourceDate}): ${summary.sourceStatuses.readiness}
- Prospect activation (${summary.sourceDate}): ${summary.sourceStatuses.activation}

## Counts

- Admin fill rows: ${summary.adminFillRows}
- Private prospect rows: ${summary.privateProspectRows}
- Coverage rows: ${summary.coverageRows}
- Controlled lead rows: ${summary.controlledLeadRows}
- Billing/payment rows: ${summary.billingPaymentRows}
- Blocked/review gates: ${summary.blockedOrReviewGateRows}
- Live/public approvals: 0

## Gates

${gateTable}

## Owner/Admin Fill Rows

${rowTable}

## Run Order

1. Fill PROSPECT-01 through PROSPECT-03 from private wp-admin evidence only.
2. Confirm LAWYER-COVERAGE-01 only after verified prospects are routable and billing/contact fields are present.
3. Fill CONTROLLED-LEAD-01 only from a current consented Bituach Leumi lead with owner release.
4. Fill BILLING-01 after actual routing creates a qualified billable lead and invoice/reference evidence exists.
5. Fill PAYMENT-01 only when private payment evidence URL exists; invoice/reference alone is not paid proof.
6. Fill GO-NOGO-01 only after payment proof passes and owner reviews supply, consent, billing, refund and complaint risk.
7. Run \`tools/review-btl-source-readiness-filled-rows.mjs\` against the filled CSV; no live action is authorized unless that private review passes and the owner separately approves the next controlled step.

## After Fill Review

Use \`.project-control/btl-source-readiness-filled-review-gate-${summary.reportDate}.md\` after the owner/admin fill is available. The reviewer reports pass/blocked status without echoing raw admin pointers or private notes into repo artifacts.

## Decision

This packet makes the first paid Bituach Leumi blocker actionable, but it does not authorize live work. Blanks keep the first-paid-lead loop blocked and keep revenue at 0%.
`;
}

function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node tools/build-btl-source-readiness-admin-fill-packet.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const outputs = outputFiles(args.reportDate);
  const ledger = readJson(sources.ledger);
  const dryRun = readJson(sources.dryRun);
  const readiness = readJson(sources.readiness);
  const activation = readJson(sources.activation);
  const adminRows = buildAdminRows(ledger.ledgerRows || []);
  const fillRows = buildFillRows(adminRows);
  const gateRows = buildGateRows({ ledger, dryRun, readiness, activation, adminRows });
  const status = 'BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION';

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceStatuses: {
      ledger: statusOf(ledger),
      dryRun: statusOf(dryRun),
      readiness: statusOf(readiness),
      activation: statusOf(activation),
    },
    adminFillRows: fillRows.length,
    gateRows: gateRows.length,
    blockedOrReviewGateRows: gateRows.filter((row) => row.status.startsWith('BLOCKED') || row.status === 'REVIEW').length,
    privateProspectRows: adminRows.filter((row) => row.stage === 'private_specialist_supply').length,
    coverageRows: adminRows.filter((row) => row.stage === 'routable_lawyer_coverage').length,
    controlledLeadRows: adminRows.filter((row) => row.stage === 'controlled_lead').length,
    billingPaymentRows: adminRows.filter((row) => ['qualified_lead_billing', 'payment_proof'].includes(row.stage)).length,
    paidLlmApiUsed: 0,
    wpAdminWritesApproved: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    messagesOrEmailsSent: 0,
    revenueClaimsApproved: 0,
    publicChangesApproved: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const adminColumns = [
    'id',
    'sequence',
    'stage',
    'current_status',
    'source_candidate_reference',
    'admin_location',
    'required_private_evidence',
    'crm_fields_or_anchors',
    'pass_condition',
    'blocker_if_no',
    'allowed_next_action_after_owner_release',
    'forbidden_action',
    'privacy_rule',
    'live_action_approved',
  ];
  const fillColumns = [
    'id',
    'stage',
    'live_admin_pointer_no_pii',
    'evidence_status',
    'owner_admin_decision',
    'accepted_values',
    'proof_present_yes_no',
    'owner_verified_yes_no',
    'blocker_if_no',
    'private_note_no_pii',
    'public_or_live_action_approved',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'adminFillRows',
    'blockedOrReviewGateRows',
    'privateProspectRows',
    'coverageRows',
    'controlledLeadRows',
    'billingPaymentRows',
    'wpAdminWritesApproved',
    'crmRecordsCreated',
    'leadOrLawyerContactActions',
    'invoicesOrPaymentsCreated',
    'messagesOrEmailsSent',
    'revenueClaimsApproved',
    'publicChangesApproved',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, buildMarkdown({ summary, adminRows, gateRows }));
  writeText(outputs.projectCsv, toCsv(gateRows, gateColumns));
  writeText(outputs.fillTemplateCsv, toCsv(fillRows, fillColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gateRows, adminRows, fillRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
