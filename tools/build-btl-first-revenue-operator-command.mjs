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
  const base = `btl-first-revenue-operator-command-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    adminPacket: path.join(ROOT, '.reports', `btl-source-readiness-admin-fill-packet-${sourceDate}.json`),
    filledReview: path.join(ROOT, '.reports', `btl-source-readiness-filled-review-gate-${sourceDate}.json`),
    runtimeLedger: path.join(ROOT, '.reports', `btl-runtime-revenue-proof-ledger-${sourceDate}.json`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath);
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
  return report?.summary?.status || report?.status || 'UNKNOWN';
}

function reviewRowsById(filledReview) {
  return Object.fromEntries((filledReview.reviewRows || []).map((row) => [row.id, row]));
}

function countPass(reviewRows, ids) {
  return ids.filter((id) => reviewRows[id]?.review_status === 'PASS').length;
}

function allPass(reviewRows, ids) {
  return countPass(reviewRows, ids) === ids.length;
}

function buildActions({ reviewRows }) {
  const prospectIds = ['PROSPECT-01', 'PROSPECT-02', 'PROSPECT-03'];
  const coverageIds = ['LAWYER-COVERAGE-01'];
  const leadIds = ['CONTROLLED-LEAD-01'];
  const billingIds = ['BILLING-01'];
  const paymentIds = ['PAYMENT-01'];
  const scaleIds = ['GO-NOGO-01'];

  return [
    {
      id: 'BTL-REV-01',
      sequence: 1,
      lane: 'private_specialist_supply',
      current_status: allPass(reviewRows, prospectIds) ? 'PASS' : 'BLOCKED_PRIVATE_SUPPLY_EMPTY',
      owner_action: 'Create or verify 3 private Bituach Leumi specialist prospects in the private admin system.',
      proof_needed: 'Each prospect has license/status verified, Bituach Leumi appeal fit, response SLA, accepted lead-fee terms, payment path and billing contact.',
      unlocks: 'Routable coverage check for the first controlled Bituach Leumi lead.',
      hard_no: 'Do not publish profiles, contact lawyers from repo data, route client PII, invoice or claim revenue from prospect rows alone.',
    },
    {
      id: 'BTL-REV-02',
      sequence: 2,
      lane: 'routable_coverage',
      current_status: allPass(reviewRows, [...prospectIds, ...coverageIds]) ? 'PASS' : 'BLOCKED_UNTIL_THREE_PROSPECTS_ROUTABLE',
      owner_action: 'Confirm the 3 verified specialists are routable lawyer profiles with routing enabled and billing/contact fields present.',
      proof_needed: 'First paid-lead preflight shows Bituach Leumi coverage ready with no billing/contact blockers.',
      unlocks: 'One consented controlled lead can be reviewed for routing.',
      hard_no: 'Do not rely on a public page or directory card if the private routable coverage proof is missing.',
    },
    {
      id: 'BTL-REV-03',
      sequence: 3,
      lane: 'controlled_lead_consent',
      current_status: allPass(reviewRows, [...prospectIds, ...coverageIds, ...leadIds]) ? 'PASS' : 'BLOCKED_UNTIL_CONSENTED_LEAD_EXISTS',
      owner_action: 'Select one current Bituach Leumi lead with explicit match consent or owner-verified consent and owner release.',
      proof_needed: 'Consent status, routing hold clearance by owner workflow, Bituach Leumi appeal intent and qualified lead model are recorded privately.',
      unlocks: 'A controlled handoff can create billable lead state.',
      hard_no: 'Do not infer consent from a WhatsApp button click alone and do not copy client names, phones, raw chats or documents into repo files.',
    },
    {
      id: 'BTL-REV-04',
      sequence: 4,
      lane: 'billing_reference',
      current_status: allPass(reviewRows, [...prospectIds, ...coverageIds, ...leadIds, ...billingIds]) ? 'PASS' : 'BLOCKED_UNTIL_BILLABLE_LEAD',
      owner_action: 'After actual controlled routing, record qualified lead billing as ready_to_bill or invoice_sent.',
      proof_needed: 'Billable lawyer linked, suggested lead price above 0 and invoice/payment reference exists privately.',
      unlocks: 'Payment proof can be requested and checked.',
      hard_no: 'Do not mark paid or claim revenue from invoice/reference alone.',
    },
    {
      id: 'BTL-REV-05',
      sequence: 5,
      lane: 'payment_proof',
      current_status: allPass(reviewRows, [...prospectIds, ...coverageIds, ...leadIds, ...billingIds, ...paymentIds]) ? 'PASS' : 'BLOCKED_UNTIL_PRIVATE_PAYMENT_PROOF',
      owner_action: 'Record paid status only after private payment proof exists.',
      proof_needed: 'Private payment evidence URL exists in the private admin/payment system and qualified lead billing status is paid.',
      unlocks: 'One paid Bituach Leumi lead can be counted once.',
      hard_no: 'Do not paste receipts or private payment URLs into repo artifacts.',
    },
    {
      id: 'BTL-REV-06',
      sequence: 6,
      lane: 'scale_decision',
      current_status: allPass(reviewRows, [...prospectIds, ...coverageIds, ...leadIds, ...billingIds, ...paymentIds, ...scaleIds]) ? 'PASS' : 'BLOCKED_UNTIL_FIRST_PAYMENT_REVIEW',
      owner_action: 'After the first paid proof passes, decide scale, fix or stop.',
      proof_needed: 'No unresolved complaint, refund, consent or ethics issue, and owner explicitly approves the next batch.',
      unlocks: 'Repeatable controlled Bituach Leumi revenue loop.',
      hard_no: 'Do not expand WhatsApp/TalkTo routing, public claims or supplier outreach before the scale decision.',
    },
  ];
}

function buildGates({ adminPacket, filledReview, actions }) {
  const blockedActions = actions.filter((row) => row.current_status !== 'PASS').length;
  return [
    {
      id: 'BTL-OP-GATE-01',
      gate: 'source_packets_loaded',
      status: statusOf(adminPacket).includes('BTL_SOURCE_READINESS') && statusOf(filledReview).includes('BTL_SOURCE_READINESS_FILLED_REVIEW') ? 'PASS' : 'BLOCKED',
      evidence: `Admin packet: ${statusOf(adminPacket)}; filled review: ${statusOf(filledReview)}.`,
      next_action: 'Use this operator card as the short owner/admin run order.',
    },
    {
      id: 'BTL-OP-GATE-02',
      gate: 'no_private_values_echoed',
      status: filledReview.summary?.rawAdminPointersEchoed === 0 && filledReview.summary?.rawPrivateNotesEchoed === 0 ? 'PASS' : 'BLOCKED',
      evidence: `${filledReview.summary?.rawAdminPointersEchoed ?? 'unknown'} raw admin pointers echoed; ${filledReview.summary?.rawPrivateNotesEchoed ?? 'unknown'} raw private notes echoed.`,
      next_action: 'Keep all private record IDs, notes, payment URLs and PII inside private owner systems.',
    },
    {
      id: 'BTL-OP-GATE-03',
      gate: 'revenue_not_claimed_without_payment',
      status: filledReview.summary?.revenueClaimsApproved === 0 && filledReview.summary?.invoicesOrPaymentsCreated === 0 ? 'PASS' : 'BLOCKED',
      evidence: `${filledReview.summary?.revenueClaimsApproved ?? 'unknown'} revenue claims approved; ${filledReview.summary?.invoicesOrPaymentsCreated ?? 'unknown'} invoices/payments created by the report.`,
      next_action: 'Revenue stays 0 until PAYMENT-01 passes with private payment evidence.',
    },
    {
      id: 'BTL-OP-GATE-04',
      gate: 'operator_actions_still_blocked',
      status: blockedActions > 0 ? 'BLOCKED_PRIVATE_EVIDENCE_REQUIRED' : 'PASS_READY_FOR_OWNER_REVIEW',
      evidence: `${blockedActions}/${actions.length} operator actions are still blocked.`,
      next_action: blockedActions > 0 ? 'Start with BTL-REV-01 and fill private supply evidence.' : 'Prepare owner-reviewed first paid-lead execution record.',
    },
  ];
}

function buildMarkdown({ summary, actions, gates }) {
  const gateTable = [
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gates.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
  ].join('\n');

  const actionTable = [
    '| ID | Step | Lane | Status | Owner/Admin Action | Proof Needed | Unlocks | Hard No |',
    '| --- | ---: | --- | --- | --- | --- | --- | --- |',
    ...actions.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.sequence)} | ${mdCell(row.lane)} | ${mdCell(row.current_status)} | ${mdCell(row.owner_action)} | ${mdCell(row.proof_needed)} | ${mdCell(row.unlocks)} | ${mdCell(row.hard_no)} |`),
  ].join('\n');

  return `# BTL First Revenue Operator Command - ${summary.reportDate}

Status: ${summary.status}

Scope: private operator command only. It does not create or edit wp-admin/CRM records, contact lawyers, contact clients, route PII, invoice, charge payment, mark revenue, publish public pages, change SEO controls, send email/WhatsApp/TalkTo, call external APIs or deploy uPress.

## Profit Readiness

- Static preparation: ${summary.staticPreparationPercent}%.
- Live paid-lead proof: ${summary.livePaidLeadProofPercent}%.
- Actions blocked by missing private evidence: ${summary.blockedActionCount}/${summary.actionCount}.
- First required action: ${summary.firstRequiredAction}.
- Revenue can be counted only after: PAYMENT-01 passes with private payment evidence.

## Gates

${gateTable}

## Operator Run Order

${actionTable}

## What Codex Can Do After The Owner/Admin Fill

1. Run \`tools/review-btl-source-readiness-filled-rows.mjs --reportDate=${summary.reportDate} --sourceDate=${summary.sourceDate}\`.
2. Report pass/blocked status without echoing private admin pointers, private notes, payment URLs or PII.
3. If all gates pass and the owner separately approves, prepare one controlled Bituach Leumi handoff/payment execution record.

## Honest Business Assessment

This loop is still 0% live-profit-ready because no private supply, consented lead, billing or payment proof rows pass. The shortest useful move is not more public content. It is filling BTL-REV-01 through BTL-REV-03 from private admin evidence, then asking Codex to review the filled rows.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-btl-first-revenue-operator-command.mjs --reportDate=YYYY-MM-DD [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const adminPacket = readJson(sources.adminPacket);
  const filledReview = readJson(sources.filledReview);
  const runtimeLedger = readJson(sources.runtimeLedger);
  const reviewRows = reviewRowsById(filledReview);
  const actions = buildActions({ reviewRows });
  const gates = buildGates({ adminPacket, filledReview, actions });
  const blockedActionCount = actions.filter((row) => row.current_status !== 'PASS').length;
  const passedReviewRows = filledReview.summary?.passRows ?? 0;
  const requiredReviewRows = filledReview.summary?.requiredRowCount ?? 8;
  const livePaidLeadProofPercent = requiredReviewRows > 0 ? Math.round((passedReviewRows / requiredReviewRows) * 100) : 0;
  const staticPreparationPercent = adminPacket.summary?.adminFillRows === 8 && runtimeLedger.summary?.runtimeProofRows === 8 ? 100 : 75;
  const files = outputFiles(args.reportDate);

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status: 'BTL_FIRST_REVENUE_OPERATOR_COMMAND_READY_BLOCKED_ON_PRIVATE_EVIDENCE_NO_LIVE_ACTION',
    sourceStatuses: {
      adminPacket: statusOf(adminPacket),
      filledReview: statusOf(filledReview),
      runtimeLedger: statusOf(runtimeLedger),
    },
    staticPreparationPercent,
    livePaidLeadProofPercent,
    actionCount: actions.length,
    blockedActionCount,
    firstRequiredAction: actions.find((row) => row.current_status !== 'PASS')?.id || 'owner_review_after_payment',
    revenueClaimsApproved: 0,
    publicChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    externalApisCalled: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(files).map(([key, filePath]) => [key, relativePath(filePath)])),
  };

  const report = { summary, gates, actions };
  const actionColumns = ['id', 'sequence', 'lane', 'current_status', 'owner_action', 'proof_needed', 'unlocks', 'hard_no'];

  writeText(files.projectMd, buildMarkdown({ summary, actions, gates }));
  writeText(files.projectCsv, toCsv(actions, actionColumns));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(actions, actionColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
