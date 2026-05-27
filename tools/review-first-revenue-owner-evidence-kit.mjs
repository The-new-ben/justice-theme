import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const PASS_VALUES = new Set(['pass', 'passed', 'yes']);
const SAFE_NO_VALUES = new Set(['', 'no', 'false', '0', 'not_approved']);
const LANE_ORDER = ['btl_first_paid_lead', 'lawyer_subscription_paid_test', 'criminal_jerusalem_supplier_coverage'];

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
    sourceReport: path.join(ROOT, '.reports', `first-revenue-owner-evidence-kit-${sourceDate}.json`),
    filledCsv: filledCsv
      ? path.resolve(ROOT, filledCsv)
      : path.join(ROOT, '.project-control', `first-revenue-owner-evidence-kit-owner-fill-${sourceDate}.csv`),
  };
}

function outputFiles(reportDate) {
  const base = `first-revenue-owner-evidence-review-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    escalationCsv: path.join(ROOT, '.project-control', `${base}-escalation.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
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

function relativePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
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
    .filter((cells) => cells.some((cell) => String(cell).trim() !== ''))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function present(value) {
  return String(value ?? '').trim() !== '';
}

function yes(value) {
  return PASS_VALUES.has(normalize(value));
}

function safeNo(value) {
  return SAFE_NO_VALUES.has(normalize(value));
}

function hasPrivateMarker(row) {
  return present(row.private_admin_pointer_no_pii);
}

function suspiciousPrivateText(row) {
  const joined = [
    row.private_admin_pointer_no_pii,
    row.owner_note_no_pii,
  ].join(' ');
  return [
    /https?:\/\//i,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /\b(?:\+?972|0)(?:[-\s]?\d){8,}\b/,
    /\b(?:sk-|pk_|AIza|xoxp-|xoxb-)[A-Za-z0-9_-]{8,}\b/i,
  ].some((pattern) => pattern.test(joined));
}

function sourceKey(row) {
  return `${row.lane}:${row.action_id}`;
}

function byKey(rows) {
  const map = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = sourceKey(row);
    if (!row.lane || !row.action_id) {
      continue;
    }
    if (map.has(key)) {
      duplicates.push(key);
    }
    map.set(key, row);
  }
  return { map, duplicates };
}

function preliminaryStatus({ sourceRow, filledRow, duplicateKeys }) {
  if (!filledRow) {
    return 'BLOCKED_ROW_MISSING_FROM_FILLED_CSV';
  }
  const key = sourceKey(sourceRow);
  if (duplicateKeys.includes(key)) {
    return 'BLOCKED_DUPLICATE_ROW';
  }
  if (normalize(filledRow.unblock_id) !== normalize(sourceRow.unblock_id)) {
    return 'BLOCKED_UNBLOCK_ID_MISMATCH';
  }
  if (!safeNo(filledRow.live_or_public_action_approved)) {
    return 'BLOCKED_LIVE_OR_PUBLIC_ACTION_MARKER';
  }
  if (!yes(filledRow.no_pii_confirmed_yes_no)) {
    return 'BLOCKED_NO_PII_CONFIRMATION_MISSING';
  }
  if (suspiciousPrivateText(filledRow)) {
    return 'BLOCKED_PRIVATE_VALUE_OR_PII_PATTERN';
  }
  if (!PASS_VALUES.has(normalize(filledRow.status))) {
    return 'BLOCKED_STATUS_NOT_PASS';
  }
  if (!yes(filledRow.owner_verified_yes_no) || !yes(filledRow.proof_present_yes_no)) {
    return 'BLOCKED_OWNER_OR_PROOF_MISSING';
  }
  if (!hasPrivateMarker(filledRow)) {
    return 'BLOCKED_PRIVATE_EVIDENCE_POINTER_MISSING';
  }
  return 'PASS_PRELIMINARY_PRIVATE_EVIDENCE';
}

function dependencyStatus(row, preliminary, lanePassSet) {
  if (preliminary !== 'PASS_PRELIMINARY_PRIVATE_EVIDENCE') {
    return preliminary;
  }
  const laneKey = `${row.lane}:`;
  const requiredEarlier = (row.sequence || 1) - 1;
  const passedEarlier = [...lanePassSet].filter((key) => key.startsWith(laneKey)).length;
  if (passedEarlier < requiredEarlier) {
    return 'BLOCKED_PRIOR_ACTIONS_NOT_PASSED';
  }
  return 'PASS';
}

function buildReviewRows({ sourceReport, filledRows }) {
  const sourceRows = sourceReport.combinedRows || [];
  const { map: filledByKey, duplicates } = byKey(filledRows);
  const requiredKeys = sourceRows.map(sourceKey);
  const unknownKeys = [...filledByKey.keys()].filter((key) => !requiredKeys.includes(key));
  const lanePassSet = new Set();
  const reviewRows = [];

  for (const sourceRow of sourceRows) {
    const key = sourceKey(sourceRow);
    const filledRow = filledByKey.get(key);
    const preliminary = preliminaryStatus({ sourceRow, filledRow, duplicateKeys: duplicates });
    const status = dependencyStatus(sourceRow, preliminary, lanePassSet);

    if (status === 'PASS') {
      lanePassSet.add(key);
    }

    reviewRows.push({
      lane: sourceRow.lane,
      unblock_id: sourceRow.unblock_id,
      sequence: sourceRow.sequence,
      action_id: sourceRow.action_id,
      title_he: sourceRow.title_he,
      status_value: normalize(filledRow?.status) || 'blank',
      owner_verified_yes_no: normalize(filledRow?.owner_verified_yes_no) || 'blank',
      proof_present_yes_no: normalize(filledRow?.proof_present_yes_no) || 'blank',
      no_pii_confirmed_yes_no: normalize(filledRow?.no_pii_confirmed_yes_no) || 'blank',
      private_pointer_present: hasPrivateMarker(filledRow || {}) ? 'yes' : 'no',
      live_or_public_action_approved: normalize(filledRow?.live_or_public_action_approved) || 'blank',
      review_status: status,
      raw_values_echoed: 'no',
    });
  }

  return { reviewRows, duplicateKeys: duplicates, unknownKeys };
}

function buildLaneRows(reviewRows) {
  return LANE_ORDER.map((lane) => {
    const rows = reviewRows.filter((row) => row.lane === lane);
    const passed = rows.filter((row) => row.review_status === 'PASS').length;
    return {
      lane,
      total_rows: rows.length,
      passed_rows: passed,
      blocked_rows: rows.length - passed,
      lane_status: passed === rows.length && rows.length > 0 ? 'PASS_PRIVATE_EVIDENCE_REVIEW' : 'BLOCKED_PRIVATE_EVIDENCE_INCOMPLETE',
      first_blocker: rows.find((row) => row.review_status !== 'PASS')?.review_status || '',
      revenue_can_be_claimed: 'no',
      live_action_approved: 'no',
    };
  });
}

function buildGates({ reviewRows, laneRows, duplicateKeys, unknownKeys }) {
  const liveMarkers = reviewRows.filter((row) => !safeNo(row.live_or_public_action_approved));
  const suspiciousRows = reviewRows.filter((row) => row.review_status === 'BLOCKED_PRIVATE_VALUE_OR_PII_PATTERN');
  const passedRows = reviewRows.filter((row) => row.review_status === 'PASS').length;
  return [
    {
      id: 'FRK-REVIEW-GATE-01',
      gate: 'schema_and_required_rows',
      status: duplicateKeys.length === 0 && unknownKeys.length === 0 && reviewRows.length === 18 ? 'PASS' : 'BLOCKED',
      evidence: `${reviewRows.length}/18 required rows reviewed; ${duplicateKeys.length} duplicate keys; ${unknownKeys.length} unknown keys.`,
      next_action: 'Use the generated owner-fill CSV only; do not add private names or extra rows.',
    },
    {
      id: 'FRK-REVIEW-GATE-02',
      gate: 'no_pii_or_secret_patterns',
      status: suspiciousRows.length === 0 ? 'PASS' : 'BLOCKED_PRIVATE_VALUE_OR_PII_PATTERN',
      evidence: `${suspiciousRows.length} rows looked like they contained URLs, contact details or secrets.`,
      next_action: 'Replace raw private values with a non-identifying pointer such as admin-row-1.',
    },
    {
      id: 'FRK-REVIEW-GATE-03',
      gate: 'no_live_public_or_payment_action_approved',
      status: liveMarkers.length === 0 ? 'PASS' : 'BLOCKED_LIVE_OR_PUBLIC_ACTION_MARKER',
      evidence: `${liveMarkers.length} rows attempted to approve live/public action inside the fill sheet.`,
      next_action: 'Live action requires a separate explicit owner approval after private review.',
    },
    {
      id: 'FRK-REVIEW-GATE-04',
      gate: 'all_private_evidence_rows_passed',
      status: passedRows === reviewRows.length ? 'PASS' : 'BLOCKED_PRIVATE_EVIDENCE_INCOMPLETE',
      evidence: `${passedRows}/${reviewRows.length} owner evidence rows pass.`,
      next_action: 'Fill the first blocked row in each lane before asking for live execution.',
    },
    {
      id: 'FRK-REVIEW-GATE-05',
      gate: 'revenue_not_claimed_by_review',
      status: laneRows.every((row) => row.revenue_can_be_claimed === 'no') ? 'PASS' : 'BLOCKED',
      evidence: 'The review returns pass/blocked only; it does not count revenue or mark paid.',
      next_action: 'Revenue can be counted only after separate owner decision plus private payment proof.',
    },
  ];
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildMarkdown({ summary, gateRows, laneRows, reviewRows }) {
  return [
    `# First Revenue Owner Evidence Review - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private sanitized evidence review only. This file does not echo private values and does not approve live CRM work, outreach, public content, invoices, payments, email, WhatsApp/TalkTo, SEO changes or uPress.',
    '',
    '## Lane Results',
    '',
    '| Lane | Passed | Blocked | Status | First Blocker | Revenue Can Be Claimed |',
    '| --- | ---: | ---: | --- | --- | --- |',
    ...laneRows.map(
      (row) =>
        `| ${mdCell(row.lane)} | ${row.passed_rows}/${row.total_rows} | ${row.blocked_rows} | ${row.lane_status} | ${mdCell(row.first_blocker)} | ${row.revenue_can_be_claimed} |`,
    ),
    '',
    '## Review Rows',
    '',
    '| Lane | Action | Status | Owner Verified | Proof Present | Private Pointer | Review Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...reviewRows.map(
      (row) =>
        `| ${mdCell(row.unblock_id)} | ${mdCell(row.action_id)} | ${row.status_value} | ${row.owner_verified_yes_no} | ${row.proof_present_yes_no} | ${row.private_pointer_present} | ${row.review_status} |`,
    ),
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...gateRows.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## Decision',
    '',
    summary.passedRows === summary.reviewRows
      ? 'All private evidence rows passed preliminary review. This still does not authorize live action; the owner must separately approve the exact next controlled step.'
      : 'The first-revenue loop remains blocked. Fill the first blocked row in each lane with sanitized private evidence pointers, then rerun this review.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/review-first-revenue-owner-evidence-kit.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD [--filledCsv=path]');
    return;
  }

  const sources = sourceFiles(args.sourceDate, args.filledCsv);
  const outputs = outputFiles(args.reportDate);
  const sourceReport = readJson(sources.sourceReport);
  const filledRows = parseCsv(readText(sources.filledCsv));
  const { reviewRows, duplicateKeys, unknownKeys } = buildReviewRows({ sourceReport, filledRows });
  const laneRows = buildLaneRows(reviewRows);
  const gateRows = buildGates({ reviewRows, laneRows, duplicateKeys, unknownKeys });
  const passedRows = reviewRows.filter((row) => row.review_status === 'PASS').length;
  const status = passedRows === reviewRows.length
    ? 'FIRST_REVENUE_OWNER_EVIDENCE_REVIEW_PASS_NO_LIVE_ACTION'
    : 'FIRST_REVENUE_OWNER_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION';
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceReport: relativePath(sources.sourceReport),
    filledCsv: relativePath(sources.filledCsv),
    reviewRows: reviewRows.length,
    passedRows,
    blockedRows: reviewRows.length - passedRows,
    lanePassCount: laneRows.filter((row) => row.lane_status === 'PASS_PRIVATE_EVIDENCE_REVIEW').length,
    duplicateKeys: duplicateKeys.length,
    unknownKeys: unknownKeys.length,
    piiOrSecretPatternRows: reviewRows.filter((row) => row.review_status === 'BLOCKED_PRIVATE_VALUE_OR_PII_PATTERN').length,
    revenueCanBeClaimed: false,
    liveActionApproved: 0,
    publicActionApproved: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const reviewColumns = [
    'lane',
    'unblock_id',
    'sequence',
    'action_id',
    'title_he',
    'status_value',
    'owner_verified_yes_no',
    'proof_present_yes_no',
    'no_pii_confirmed_yes_no',
    'private_pointer_present',
    'live_or_public_action_approved',
    'review_status',
    'raw_values_echoed',
  ];
  const laneColumns = [
    'lane',
    'total_rows',
    'passed_rows',
    'blocked_rows',
    'lane_status',
    'first_blocker',
    'revenue_can_be_claimed',
    'live_action_approved',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'reviewRows',
    'passedRows',
    'blockedRows',
    'lanePassCount',
    'duplicateKeys',
    'unknownKeys',
    'piiOrSecretPatternRows',
    'revenueCanBeClaimed',
    'liveActionApproved',
    'publicActionApproved',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, buildMarkdown({ summary, gateRows, laneRows, reviewRows }));
  writeText(outputs.projectCsv, toCsv(reviewRows, reviewColumns));
  writeText(outputs.escalationCsv, toCsv(laneRows, laneColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gateRows, laneRows, reviewRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
