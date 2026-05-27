import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const REQUIRED_FIELDS = [
  ['EVID-01', 'owner_controlled_test_approval'],
  ['EVID-02', 'controlled_identity_alias'],
  ['EVID-03', 'controlled_inbox_and_phone_owner_confirmed'],
  ['EVID-04', 'selected_payment_path'],
  ['EVID-05', 'live_registration_allowed'],
  ['EVID-06', 'controlled_lawyer_profile_or_post_id'],
  ['EVID-07', 'controlled_lawyer_user_login_confirmed'],
  ['EVID-08', 'service_request_ids'],
  ['EVID-09', 'controlled_consented_lead_id'],
  ['EVID-10', 'invoice_or_payment_reference'],
  ['EVID-11', 'revenue_counting_decision'],
];
const PAYMENT_PATHS = new Set(['manual_invoice', 'approved_payment_link', 'provider_link', 'no_charge_dry_run']);

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
    walkthrough: path.join(ROOT, '.reports', `lawyer-subscription-controlled-walkthrough-${sourceDate}.json`),
    manualInvoice: path.join(ROOT, '.reports', `manual-invoice-revenue-fallback-packet-${sourceDate}.json`),
    filledCsv: filledCsv
      ? path.resolve(ROOT, filledCsv)
      : path.join(ROOT, '.project-control', `lawyer-subscription-controlled-evidence-template-${sourceDate}.csv`),
  };
}

function outputFiles(reportDate) {
  const base = `lawyer-subscription-controlled-evidence-review-gate-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    escalationCsv: path.join(ROOT, '.project-control', `lawyer-subscription-controlled-evidence-escalation-${reportDate}.csv`),
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

function valueFor(row) {
  return String(row.owner_value ?? row.filled_value ?? row.blank_owner_value ?? '').trim();
}

function present(value) {
  return String(value ?? '').trim() !== '';
}

function yes(value) {
  return ['yes', 'y', 'true', '1', 'approved', 'approve'].includes(normalize(value));
}

function containsPotentialPrivateContact(value) {
  const text = String(value ?? '');
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) || /(?:\+?\d[\s-]?){7,}/.test(text) || /password|passwd|סיסמה/i.test(text);
}

function includesAll(value, terms) {
  const text = normalize(value);
  return terms.every((term) => text.includes(term));
}

function byId(rows) {
  const map = new Map();
  const duplicateIds = [];
  for (const row of rows) {
    const id = String(row.field_id || '').trim();
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

function fieldStatus(id, field, value) {
  if (!present(value)) {
    return 'BLOCKED_BLANK_OWNER_VALUE';
  }
  if (containsPotentialPrivateContact(value)) {
    return 'BLOCKED_POTENTIAL_PRIVATE_CONTACT_OR_SECRET_IN_REPO';
  }
  if (id === 'EVID-01' && normalize(value) !== 'approve') {
    return 'BLOCKED_OWNER_TEST_NOT_APPROVED';
  }
  if (id === 'EVID-03' && !yes(value)) {
    return 'BLOCKED_CONTROLLED_INBOX_PHONE_NOT_CONFIRMED';
  }
  if (id === 'EVID-04' && !PAYMENT_PATHS.has(normalize(value))) {
    return 'BLOCKED_PAYMENT_PATH_NOT_ALLOWED';
  }
  if (id === 'EVID-05' && !yes(value)) {
    return 'BLOCKED_LIVE_REGISTRATION_NOT_ALLOWED';
  }
  if (id === 'EVID-07' && !yes(value)) {
    return 'BLOCKED_CONTROLLED_LOGIN_NOT_CONFIRMED';
  }
  if (id === 'EVID-08' && !includesAll(value, ['payment', 'upgrade', 'downgrade', 'cancel', 'refund', 'invoice'])) {
    return 'BLOCKED_SERVICE_REQUEST_SET_INCOMPLETE';
  }
  if (id === 'EVID-09' && !/consent|הסכמ|explicit|owner_verified/i.test(value)) {
    return 'BLOCKED_CONTROLLED_LEAD_CONSENT_NOT_SUMMARIZED';
  }
  if (id === 'EVID-10' && !/invoice|reference|payment|evidence|no_charge|dry/i.test(value)) {
    return 'BLOCKED_INVOICE_OR_PAYMENT_REFERENCE_MISSING';
  }
  if (id === 'EVID-11' && !['count_revenue', 'do_not_count', 'blocked'].includes(normalize(value))) {
    return 'BLOCKED_REVENUE_DECISION_NOT_ALLOWED';
  }
  if (field === 'revenue_counting_decision' && normalize(value) === 'count_revenue') {
    return 'REVIEW_REVENUE_COUNT_REQUIRES_PRIVATE_PAYMENT_PROOF';
  }
  return 'PASS';
}

function dependencyStatus(row, passedIds) {
  if (row.review_status !== 'PASS' && row.review_status !== 'REVIEW_REVENUE_COUNT_REQUIRES_PRIVATE_PAYMENT_PROOF') {
    return row.review_status;
  }
  const id = row.field_id;
  if (id === 'EVID-05' && !['EVID-01', 'EVID-02', 'EVID-03', 'EVID-04'].every((required) => passedIds.has(required))) {
    return 'BLOCKED_PREFLIGHT_EVIDENCE_NOT_COMPLETE';
  }
  if (id === 'EVID-06' && !passedIds.has('EVID-05')) {
    return 'BLOCKED_REGISTRATION_NOT_APPROVED';
  }
  if (id === 'EVID-07' && !passedIds.has('EVID-06')) {
    return 'BLOCKED_CONTROLLED_PROFILE_NOT_RECORDED';
  }
  if (id === 'EVID-08' && !passedIds.has('EVID-07')) {
    return 'BLOCKED_CONTROLLED_LOGIN_NOT_PASSED';
  }
  if (id === 'EVID-09' && !passedIds.has('EVID-07')) {
    return 'BLOCKED_CONTROLLED_LOGIN_NOT_PASSED';
  }
  if (id === 'EVID-10' && !['EVID-08', 'EVID-09'].every((required) => passedIds.has(required))) {
    return 'BLOCKED_SERVICE_REQUESTS_OR_LEAD_NOT_PASSED';
  }
  if (id === 'EVID-11' && !passedIds.has('EVID-10')) {
    return 'BLOCKED_INVOICE_PAYMENT_REFERENCE_NOT_PASSED';
  }
  return row.review_status;
}

function buildReviewRows({ walkthrough, filledRows }) {
  const sourceRows = new Map((walkthrough.evidenceTemplateRows || []).map((row) => [row.field_id, row]));
  const { map: filledById, duplicateIds } = byId(filledRows);
  const unknownIds = [...filledById.keys()].filter((id) => !REQUIRED_FIELDS.some(([requiredId]) => requiredId === id));
  const passedIds = new Set();
  const reviewRows = [];

  for (const [fieldId, field] of REQUIRED_FIELDS) {
    const sourceRow = sourceRows.get(fieldId);
    const filledRow = filledById.get(fieldId) || sourceRow || { field_id: fieldId, field };
    const value = valueFor(filledRow);
    const rawStatus = filledById.has(fieldId) ? fieldStatus(fieldId, field, value) : 'BLOCKED_FIELD_MISSING_FROM_FILLED_CSV';
    const reviewRow = {
      field_id: fieldId,
      field,
      required_before_step: sourceRow?.required_before_step || '',
      value_present: present(value) ? 'yes' : 'no',
      potential_private_contact_or_secret: containsPotentialPrivateContact(value) ? 'yes' : 'no',
      review_status: duplicateIds.includes(fieldId) ? 'BLOCKED_DUPLICATE_FIELD_ID' : rawStatus,
      expected_value_type: sourceRow?.expected_value_type || '',
      repo_storage_rule: sourceRow?.repo_storage_rule || '',
      raw_values_echoed: 'no',
    };
    reviewRow.review_status = dependencyStatus(reviewRow, passedIds);
    if (reviewRow.review_status === 'PASS') {
      passedIds.add(fieldId);
    }
    reviewRows.push(reviewRow);
  }

  return { reviewRows, duplicateIds, unknownIds };
}

function buildGateRows({ reviewRows, duplicateIds, unknownIds, manualInvoice }) {
  const passedIds = new Set(reviewRows.filter((row) => row.review_status === 'PASS').map((row) => row.field_id));
  const reviewRowsCount = reviewRows.filter((row) => row.review_status.startsWith('REVIEW')).length;
  const potentialPrivateRows = reviewRows.filter((row) => row.potential_private_contact_or_secret === 'yes').length;
  const manualInvoiceReady = manualInvoice.summary?.status === 'MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION';
  const paymentPath = reviewRows.find((row) => row.field_id === 'EVID-04');
  return [
    {
      id: 'LSE-GATE-01',
      gate: 'schema_and_required_fields',
      status: duplicateIds.length === 0 && unknownIds.length === 0 && reviewRows.length === REQUIRED_FIELDS.length ? 'PASS' : 'BLOCKED_SCHEMA',
      evidence: `${reviewRows.length}/${REQUIRED_FIELDS.length} required fields reviewed; ${duplicateIds.length} duplicate IDs; ${unknownIds.length} unknown IDs.`,
      next_action: 'Use the controlled evidence template only; do not add private contact details.',
    },
    {
      id: 'LSE-GATE-02',
      gate: 'no_private_contact_or_secret_echo',
      status: potentialPrivateRows === 0 ? 'PASS' : 'BLOCKED_PRIVATE_CONTACT_OR_SECRET_MARKER',
      evidence: `${potentialPrivateRows} rows appear to contain contact details, phone-like values or secrets.`,
      next_action: 'Replace raw contact/payment/password values with yes/no and private evidence-location summaries.',
    },
    {
      id: 'LSE-GATE-03',
      gate: 'controlled_identity_and_payment_path',
      status: ['EVID-01', 'EVID-02', 'EVID-03', 'EVID-04'].every((id) => passedIds.has(id)) ? 'PASS' : 'BLOCKED_OWNER_TEST_SCOPE',
      evidence: `Owner/test/payment scope pass fields: ${['EVID-01', 'EVID-02', 'EVID-03', 'EVID-04'].filter((id) => passedIds.has(id)).length}/4.`,
      next_action: 'Do not submit registration until owner-controlled identity and payment path are filled.',
    },
    {
      id: 'LSE-GATE-04',
      gate: 'manual_invoice_fallback_source_current',
      status: manualInvoiceReady ? 'PASS' : 'BLOCKED_MANUAL_INVOICE_SOURCE',
      evidence: `Manual invoice fallback source: ${manualInvoice.summary?.status || 'UNKNOWN'}.`,
      next_action: 'Keep manual invoice as fallback until provider/KYC/payment proof is explicitly approved.',
    },
    {
      id: 'LSE-GATE-05',
      gate: 'live_walkthrough_evidence_chain',
      status: ['EVID-05', 'EVID-06', 'EVID-07', 'EVID-08', 'EVID-09'].every((id) => passedIds.has(id)) ? 'PASS' : 'BLOCKED_LIVE_WALKTHROUGH_EVIDENCE',
      evidence: `Registration/profile/login/service-request/lead pass fields: ${['EVID-05', 'EVID-06', 'EVID-07', 'EVID-08', 'EVID-09'].filter((id) => passedIds.has(id)).length}/5.`,
      next_action: 'Do not claim dashboard or CRM readiness until controlled profile, login, requests and lead evidence pass.',
    },
    {
      id: 'LSE-GATE-06',
      gate: 'invoice_payment_and_revenue_decision',
      status: passedIds.has('EVID-10') && passedIds.has('EVID-11') && reviewRowsCount === 0 ? 'PASS' : 'BLOCKED_PAYMENT_OR_REVENUE_DECISION',
      evidence: `Payment/reference pass: ${passedIds.has('EVID-10') ? 'yes' : 'no'}; revenue decision pass: ${passedIds.has('EVID-11') ? 'yes' : 'no'}; review rows: ${reviewRowsCount}; selected payment path row present: ${paymentPath?.value_present || 'no'}.`,
      next_action: 'Count revenue only after private payment evidence supports the owner revenue decision.',
    },
  ];
}

function buildEscalationRows(reviewRows) {
  return reviewRows
    .filter((row) => row.review_status !== 'PASS')
    .map((row) => ({
      field_id: row.field_id,
      field: row.field,
      required_before_step: row.required_before_step,
      current_review_status: row.review_status,
      resolution_needed: row.expected_value_type,
      live_or_public_action_allowed_from_this_review: 'no',
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
    '| Field ID | Field | Required Before | Value Present | Private Marker | Review Status |',
    '| --- | --- | --- | --- | --- | --- |',
    ...reviewRows.map((row) => `| ${mdCell(row.field_id)} | ${mdCell(row.field)} | ${mdCell(row.required_before_step)} | ${mdCell(row.value_present)} | ${mdCell(row.potential_private_contact_or_secret)} | ${mdCell(row.review_status)} |`),
  ].join('\n');
  const escalationTable = [
    '| Field ID | Field | Current Status | Resolution Needed |',
    '| --- | --- | --- | --- |',
    ...escalationRows.map((row) => `| ${mdCell(row.field_id)} | ${mdCell(row.field)} | ${mdCell(row.current_review_status)} | ${mdCell(row.resolution_needed)} |`),
  ].join('\n');

  return `# Lawyer Subscription Controlled Evidence Review Gate - ${summary.reportDate}

Status: ${summary.status}

Scope: private filled-evidence review only. This report does not echo raw owner-filled values, emails, phones, payment URLs, passwords, client details or provider secrets. It does not create records, submit registrations, send email, create invoices, create payments, change provider state, claim revenue, publish public pages, call external APIs or deploy uPress.

## Inputs

- Walkthrough source: ${summary.walkthroughSource}
- Manual invoice source: ${summary.manualInvoiceSource}
- Filled CSV reviewed: ${summary.filledCsv}

## Counts

- Required fields: ${summary.requiredFieldCount}
- Reviewed fields: ${summary.reviewedFieldCount}
- Passed fields: ${summary.passFields}
- Blocked/review fields: ${summary.blockedOrReviewFields}
- Gate rows: ${summary.gateRows}
- Blocked/review gates: ${summary.blockedOrReviewGateRows}
- Raw values echoed: 0
- Live/public approvals: 0

## Gates

${gateTable}

## Field Review

${reviewTable}

## Escalation Rows

${escalationRows.length ? escalationTable : 'No escalation rows.'}

## Decision

${summary.status === 'LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_PASS_NO_LIVE_ACTION'
    ? 'The private evidence review passes, but live action still requires a separate explicit owner-controlled execution approval.'
    : 'The controlled lawyer subscription revenue path remains blocked. Fill or correct the escalation rows before any live registration, provider action, invoice, payment, dashboard proof, CRM lead proof or revenue claim.'}
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/review-lawyer-subscription-controlled-evidence.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD [--filledCsv=.project-control/lawyer-subscription-controlled-evidence-template-YYYY-MM-DD.csv]');
    return;
  }

  const sources = sourceFiles(args.sourceDate, args.filledCsv);
  const outputs = outputFiles(args.reportDate);
  const walkthrough = readJson(sources.walkthrough);
  const manualInvoice = readJson(sources.manualInvoice);
  const filledRows = parseCsv(readText(sources.filledCsv));
  const { reviewRows, duplicateIds, unknownIds } = buildReviewRows({ walkthrough, filledRows });
  const gateRows = buildGateRows({ reviewRows, duplicateIds, unknownIds, manualInvoice });
  const escalationRows = buildEscalationRows(reviewRows);
  const passFields = reviewRows.filter((row) => row.review_status === 'PASS').length;
  const blockedOrReviewGateRows = gateRows.filter((row) => row.status.startsWith('BLOCKED') || row.status.startsWith('REVIEW')).length;
  const status = passFields === REQUIRED_FIELDS.length && blockedOrReviewGateRows === 0
    ? 'LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_PASS_NO_LIVE_ACTION'
    : 'LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION';

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    walkthroughSource: relativePath(sources.walkthrough),
    manualInvoiceSource: relativePath(sources.manualInvoice),
    filledCsv: relativePath(sources.filledCsv),
    requiredFieldCount: REQUIRED_FIELDS.length,
    reviewedFieldCount: reviewRows.length,
    passFields,
    blockedOrReviewFields: reviewRows.length - passFields,
    gateRows: gateRows.length,
    blockedOrReviewGateRows,
    duplicateFieldIds: duplicateIds.length,
    unknownFieldIds: unknownIds.length,
    rawOwnerValuesEchoed: 0,
    privateContactOrSecretMarkers: reviewRows.filter((row) => row.potential_private_contact_or_secret === 'yes').length,
    publicChangesApproved: 0,
    liveRecordOrRegistrationApproved: 0,
    providerActionsApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    externalApisCalled: 0,
    emailsOrMessagesSent: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const reviewColumns = [
    'field_id',
    'field',
    'required_before_step',
    'value_present',
    'potential_private_contact_or_secret',
    'review_status',
    'expected_value_type',
    'repo_storage_rule',
    'raw_values_echoed',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const escalationColumns = ['field_id', 'field', 'required_before_step', 'current_review_status', 'resolution_needed', 'live_or_public_action_allowed_from_this_review'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'requiredFieldCount',
    'reviewedFieldCount',
    'passFields',
    'blockedOrReviewFields',
    'gateRows',
    'blockedOrReviewGateRows',
    'rawOwnerValuesEchoed',
    'privateContactOrSecretMarkers',
    'publicChangesApproved',
    'liveRecordOrRegistrationApproved',
    'providerActionsApproved',
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
