import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const REQUIRED_IDS = [
  'PROSPECT-01',
  'PROSPECT-02',
  'PROSPECT-03',
  'LAWYER-COVERAGE-01',
  'CONTROLLED-LEAD-01',
  'BILLING-01',
  'PAYMENT-01',
  'GO-NOGO-01',
];
const PASS_VALUES = new Set(['pass', 'passed', 'yes']);
const NO_VALUES = new Set(['', 'no', 'false', '0', 'not_approved']);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    filledCsv: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg.startsWith('--filledCsv=')) {
      args.filledCsv = arg.slice('--filledCsv='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (name === 'help' || name === 'filledCsv') {
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function sourceFiles(sourceDate, filledCsv) {
  return {
    sourceReport: path.join(ROOT, '.reports', `btl-source-readiness-admin-fill-packet-${sourceDate}.json`),
    filledCsv: filledCsv
      ? path.resolve(ROOT, filledCsv)
      : path.join(ROOT, '.project-control', `btl-source-readiness-admin-fill-template-${sourceDate}.csv`),
  };
}

function outputFiles(reportDate) {
  const base = `btl-source-readiness-filled-review-gate-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    escalationCsv: path.join(ROOT, '.project-control', `btl-source-readiness-filled-review-escalation-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath);
}

function readText(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required input: ${filePath}`);
  }
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows
    .slice(1)
    .filter((cells) => cells.some((cell) => cell.trim() !== ''))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function yes(value) {
  return PASS_VALUES.has(normalize(value));
}

function safeNo(value) {
  return NO_VALUES.has(normalize(value));
}

function present(value) {
  return String(value ?? '').trim() !== '';
}

function byId(rows) {
  const map = new Map();
  const duplicateIds = [];
  for (const row of rows) {
    const id = String(row.id || '').trim();
    if (!id) {
      continue;
    }
    if (map.has(id)) {
      duplicateIds.push(id);
    }
    map.set(id, row);
  }
  return { map, duplicateIds };
}

function prelimStatus(row, sourceRow) {
  if (!sourceRow) {
    return 'BLOCKED_UNKNOWN_ROW';
  }
  if (!safeNo(row.public_or_live_action_approved)) {
    return 'BLOCKED_LIVE_OR_PUBLIC_ACTION_MARKER';
  }
  if (normalize(row.stage) !== normalize(sourceRow.stage)) {
    return 'BLOCKED_STAGE_MISMATCH';
  }
  if (!PASS_VALUES.has(normalize(row.evidence_status)) || !PASS_VALUES.has(normalize(row.owner_admin_decision))) {
    return 'BLOCKED_DECISION_NOT_PASS';
  }
  if (!yes(row.proof_present_yes_no) || !yes(row.owner_verified_yes_no)) {
    return 'BLOCKED_PROOF_OR_OWNER_VERIFICATION_MISSING';
  }
  if (!present(row.live_admin_pointer_no_pii)) {
    return 'BLOCKED_PRIVATE_ADMIN_POINTER_MISSING';
  }
  return 'PASS_PRELIMINARY_PRIVATE_EVIDENCE';
}

function dependencyStatus(id, preliminary, passSet) {
  if (preliminary !== 'PASS_PRELIMINARY_PRIVATE_EVIDENCE') {
    return preliminary;
  }
  if (id === 'LAWYER-COVERAGE-01' && !['PROSPECT-01', 'PROSPECT-02', 'PROSPECT-03'].every((required) => passSet.has(required))) {
    return 'BLOCKED_THREE_PROSPECTS_NOT_PASSED';
  }
  if (id === 'CONTROLLED-LEAD-01' && !passSet.has('LAWYER-COVERAGE-01')) {
    return 'BLOCKED_COVERAGE_NOT_PASSED';
  }
  if (id === 'BILLING-01' && !passSet.has('CONTROLLED-LEAD-01')) {
    return 'BLOCKED_CONTROLLED_LEAD_NOT_PASSED';
  }
  if (id === 'PAYMENT-01' && !passSet.has('BILLING-01')) {
    return 'BLOCKED_BILLING_NOT_PASSED';
  }
  if (id === 'GO-NOGO-01' && !passSet.has('PAYMENT-01')) {
    return 'BLOCKED_PAYMENT_PROOF_NOT_PASSED';
  }
  return 'PASS';
}

function buildReviewRows({ sourceReport, filledRows }) {
  const sourceRows = new Map((sourceReport.adminRows || []).map((row) => [row.id, row]));
  const { map: filledById, duplicateIds } = byId(filledRows);
  const unknownIds = [...filledById.keys()].filter((id) => !REQUIRED_IDS.includes(id));
  const passSet = new Set();
  const reviewRows = [];

  for (const id of REQUIRED_IDS) {
    const sourceRow = sourceRows.get(id);
    const filledRow = filledById.get(id) || { id, stage: sourceRow?.stage || '' };
    const preliminary = filledById.has(id) ? prelimStatus(filledRow, sourceRow) : 'BLOCKED_ROW_MISSING_FROM_FILLED_CSV';
    const status = dependencyStatus(id, preliminary, passSet);

    if (status === 'PASS') {
      passSet.add(id);
    }

    reviewRows.push({
      id,
      sequence: sourceRow?.sequence || '',
      stage: sourceRow?.stage || filledRow.stage || '',
      evidence_status: normalize(filledRow.evidence_status) || 'blank',
      owner_admin_decision: normalize(filledRow.owner_admin_decision) || 'blank',
      proof_present_yes_no: normalize(filledRow.proof_present_yes_no) || 'blank',
      owner_verified_yes_no: normalize(filledRow.owner_verified_yes_no) || 'blank',
      admin_pointer_present: present(filledRow.live_admin_pointer_no_pii) ? 'yes' : 'no',
      private_note_present: present(filledRow.private_note_no_pii) ? 'yes' : 'no',
      public_or_live_action_approved: normalize(filledRow.public_or_live_action_approved) || 'blank',
      review_status: duplicateIds.includes(id) ? 'BLOCKED_DUPLICATE_ROW_ID' : status,
      blocker_if_no: sourceRow?.blocker_if_no || filledRow.blocker_if_no || 'Missing source blocker.',
      raw_values_echoed: 'no',
    });
  }

  return { reviewRows, duplicateIds, unknownIds };
}

function gateStatus(condition, passStatus = 'PASS', failStatus = 'BLOCKED') {
  return condition ? passStatus : failStatus;
}

function buildGateRows({ reviewRows, duplicateIds, unknownIds }) {
  const passed = new Set(reviewRows.filter((row) => row.review_status === 'PASS').map((row) => row.id));
  const liveMarkers = reviewRows.filter((row) => !safeNo(row.public_or_live_action_approved));
  return [
    {
      id: 'BTL-FILLED-GATE-01',
      gate: 'schema_and_required_rows',
      status: gateStatus(duplicateIds.length === 0 && unknownIds.length === 0 && reviewRows.length === REQUIRED_IDS.length),
      evidence: `${reviewRows.length}/${REQUIRED_IDS.length} required rows reviewed; ${duplicateIds.length} duplicate IDs; ${unknownIds.length} unknown IDs.`,
      next_action: 'Keep using the controlled no-PII template; do not add extra rows or private names.',
    },
    {
      id: 'BTL-FILLED-GATE-02',
      gate: 'no_live_or_public_action_approval',
      status: gateStatus(liveMarkers.length === 0, 'PASS', 'BLOCKED_LIVE_OR_PUBLIC_ACTION_MARKER'),
      evidence: `${liveMarkers.length} rows attempted to mark public/live action approval.`,
      next_action: 'Reset public_or_live_action_approved to no; live action needs a separate explicit owner release outside this packet.',
    },
    {
      id: 'BTL-FILLED-GATE-03',
      gate: 'three_private_prospects_pass',
      status: gateStatus(['PROSPECT-01', 'PROSPECT-02', 'PROSPECT-03'].every((id) => passed.has(id))),
      evidence: `${['PROSPECT-01', 'PROSPECT-02', 'PROSPECT-03'].filter((id) => passed.has(id)).length}/3 private specialist rows pass.`,
      next_action: 'Fill or fix the private specialist supply rows before claiming routable coverage.',
    },
    {
      id: 'BTL-FILLED-GATE-04',
      gate: 'coverage_and_controlled_lead_pass',
      status: gateStatus(passed.has('LAWYER-COVERAGE-01') && passed.has('CONTROLLED-LEAD-01')),
      evidence: `Coverage pass: ${passed.has('LAWYER-COVERAGE-01') ? 'yes' : 'no'}; controlled lead pass: ${passed.has('CONTROLLED-LEAD-01') ? 'yes' : 'no'}.`,
      next_action: 'Do not route a lead unless coverage and consented controlled lead evidence both pass.',
    },
    {
      id: 'BTL-FILLED-GATE-05',
      gate: 'billing_and_private_payment_proof_pass',
      status: gateStatus(passed.has('BILLING-01') && passed.has('PAYMENT-01')),
      evidence: `Billing pass: ${passed.has('BILLING-01') ? 'yes' : 'no'}; payment proof pass: ${passed.has('PAYMENT-01') ? 'yes' : 'no'}.`,
      next_action: 'Invoice/reference alone remains invoice-stage evidence; paid revenue requires private payment proof.',
    },
    {
      id: 'BTL-FILLED-GATE-06',
      gate: 'go_nogo_after_payment_only',
      status: gateStatus(passed.has('PAYMENT-01') && passed.has('GO-NOGO-01')),
      evidence: `Payment proof pass: ${passed.has('PAYMENT-01') ? 'yes' : 'no'}; go/no-go pass: ${passed.has('GO-NOGO-01') ? 'yes' : 'no'}.`,
      next_action: 'A pass here permits only a later owner-approved controlled action plan, not automatic live execution.',
    },
  ];
}

function buildEscalationRows(reviewRows) {
  return reviewRows
    .filter((row) => row.review_status !== 'PASS')
    .map((row) => ({
      id: row.id,
      stage: row.stage,
      current_review_status: row.review_status,
      owner_or_admin_resolution_needed: row.blocker_if_no,
      public_or_live_action_allowed_from_this_review: 'no',
    }));
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdown({ summary, gateRows, reviewRows, escalationRows }) {
  const gateTable = [
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
  ].join('\n');

  const reviewTable = [
    '| ID | Stage | Review Status | Evidence | Decision | Proof | Owner Verified | Admin Pointer Present |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...reviewRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.stage)} | ${mdCell(row.review_status)} | ${mdCell(row.evidence_status)} | ${mdCell(row.owner_admin_decision)} | ${mdCell(row.proof_present_yes_no)} | ${mdCell(row.owner_verified_yes_no)} | ${mdCell(row.admin_pointer_present)} |`),
  ].join('\n');

  const escalationTable = [
    '| ID | Stage | Current Status | Resolution Needed |',
    '| --- | --- | --- | --- |',
    ...escalationRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.stage)} | ${mdCell(row.current_review_status)} | ${mdCell(row.owner_or_admin_resolution_needed)} |`),
  ].join('\n');

  return `# BTL Source Readiness Filled Review Gate - ${summary.reportDate}

Status: ${summary.status}

Scope: private filled-row review only. This report does not echo admin pointers or notes, does not create or edit CRM/wp-admin records, does not contact clients or lawyers, does not invoice, does not mark payment, does not claim revenue, does not publish public pages, does not send messages, does not call external APIs and does not deploy uPress.

## Inputs

- Source packet: ${summary.sourcePacket}
- Filled CSV reviewed: ${summary.filledCsv}

## Counts

- Required rows: ${summary.requiredRowCount}
- Reviewed rows: ${summary.reviewedRowCount}
- Passed rows: ${summary.passRows}
- Blocked rows: ${summary.blockedRows}
- Gate rows: ${summary.gateRows}
- Blocked gates: ${summary.blockedGateRows}
- Live/public approvals: 0

## Gates

${gateTable}

## Row Review

${reviewTable}

## Escalation Rows

${escalationTable || 'No escalation rows.'}

## Decision

${summary.status === 'BTL_SOURCE_READINESS_FILLED_REVIEW_PASS_NO_LIVE_ACTION'
    ? 'All private source-readiness rows passed this static review. The next step is still a separate explicit owner-controlled action plan; no live action is authorized by this report.'
    : 'The Bituach Leumi first-paid-lead loop remains blocked. Fill or correct the escalation rows before any controlled handoff, invoice, payment status or revenue claim can be reviewed.'}
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/review-btl-source-readiness-filled-rows.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD [--filledCsv=.project-control/btl-source-readiness-admin-fill-template-YYYY-MM-DD.csv]');
    return;
  }

  const sources = sourceFiles(args.sourceDate, args.filledCsv);
  const outputs = outputFiles(args.reportDate);
  const sourceReport = readJson(sources.sourceReport);
  const filledRows = parseCsv(readText(sources.filledCsv));
  const { reviewRows, duplicateIds, unknownIds } = buildReviewRows({ sourceReport, filledRows });
  const gateRows = buildGateRows({ reviewRows, duplicateIds, unknownIds });
  const escalationRows = buildEscalationRows(reviewRows);
  const blockedGateRows = gateRows.filter((row) => row.status.startsWith('BLOCKED')).length;
  const passRows = reviewRows.filter((row) => row.review_status === 'PASS').length;
  const liveMarkers = reviewRows.filter((row) => !safeNo(row.public_or_live_action_approved)).length;
  const status = passRows === REQUIRED_IDS.length && blockedGateRows === 0 && liveMarkers === 0
    ? 'BTL_SOURCE_READINESS_FILLED_REVIEW_PASS_NO_LIVE_ACTION'
    : 'BTL_SOURCE_READINESS_FILLED_REVIEW_BLOCKED_NO_LIVE_ACTION';

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourcePacket: relativePath(sources.sourceReport),
    filledCsv: relativePath(sources.filledCsv),
    requiredRowCount: REQUIRED_IDS.length,
    reviewedRowCount: reviewRows.length,
    passRows,
    blockedRows: reviewRows.length - passRows,
    gateRows: gateRows.length,
    blockedGateRows,
    duplicateRowIds: duplicateIds.length,
    unknownRowIds: unknownIds.length,
    rawAdminPointersEchoed: 0,
    rawPrivateNotesEchoed: 0,
    publicChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    externalApisCalled: 0,
    emailsOrMessagesSent: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const reviewColumns = [
    'id',
    'sequence',
    'stage',
    'evidence_status',
    'owner_admin_decision',
    'proof_present_yes_no',
    'owner_verified_yes_no',
    'admin_pointer_present',
    'private_note_present',
    'public_or_live_action_approved',
    'review_status',
    'blocker_if_no',
    'raw_values_echoed',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const escalationColumns = ['id', 'stage', 'current_review_status', 'owner_or_admin_resolution_needed', 'public_or_live_action_allowed_from_this_review'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'requiredRowCount',
    'reviewedRowCount',
    'passRows',
    'blockedRows',
    'gateRows',
    'blockedGateRows',
    'rawAdminPointersEchoed',
    'rawPrivateNotesEchoed',
    'publicChangesApproved',
    'liveCrmOrOutreachApproved',
    'invoicesOrPaymentsCreated',
    'revenueClaimsApproved',
    'paidLlmApiUsed',
    'externalApisCalled',
    'emailsOrMessagesSent',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, markdown({ summary, gateRows, reviewRows, escalationRows }));
  writeText(outputs.projectCsv, toCsv(reviewRows, reviewColumns));
  writeText(outputs.escalationCsv, toCsv(escalationRows, escalationColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gateRows, reviewRows, escalationRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
