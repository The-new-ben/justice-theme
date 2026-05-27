import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const HEADER_ALIASES = {
  phone: ['phone', 'client_phone', 'lead_phone', 'tel', 'telephone'],
  name: ['name', 'client_name', 'lead_name'],
  email: ['email', 'client_email', 'lead_email'],
  message: ['message', 'text', 'chat', 'body', 'lead_message'],
  date: ['date', 'created_at', 'timestamp', 'time'],
  page_url: ['page_url', 'source_url', 'url', 'landing_page', 'link'],
  thread_id: ['thread_id', 'chat_id', 'conversation_id', 'source_thread_id', 'id'],
  legal_area: ['legal_area', 'area_key', 'practice_area'],
  consent_status: ['consent_status', 'permission_status'],
  city: ['city', 'area', 'location'],
};

const CONSENT_STATES = [
  'fresh_inbound_needs_details',
  'explicit_match_consent',
  'owner_verified_consent',
  'legacy_needs_repermission',
  'do_not_contact',
];

const ROUTEABLE_CONSENT_STATES = ['explicit_match_consent', 'owner_verified_consent'];

const REQUIRED_CODE_MARKERS = [
  {
    id: 'CODE-01',
    marker: 'justice_theme_crm_render_external_lead_importer',
    label: 'Owner-only CSV import staging panel exists',
  },
  {
    id: 'CODE-02',
    marker: "'routing_hold'                 => '1'",
    label: 'Imported leads default to routing hold',
  },
  {
    id: 'CODE-03',
    marker: 'legacy_needs_repermission',
    label: 'Legacy re-permission consent state exists',
  },
  {
    id: 'CODE-04',
    marker: 'justice_theme_crm_external_lead_fingerprint',
    label: 'Import dedupe fingerprint exists',
  },
  {
    id: 'CODE-05',
    marker: 'array_slice( $lines, 0, 200 )',
    label: 'Import batch cap exists',
  },
  {
    id: 'CODE-06',
    marker: 'justice_theme_crm_render_repermission_queue',
    label: 'Permission / re-permission queue exists',
  },
  {
    id: 'CODE-07',
    marker: 'justice_theme_crm_render_partner_preview_queue',
    label: 'No-PII partner preview / terms queue exists',
  },
  {
    id: 'CODE-08',
    marker: 'justice_theme_crm_render_owner_handoff_release_queue',
    label: 'Owner release queue exists',
  },
  {
    id: 'CODE-09',
    marker: 'justice_theme_crm_render_lead_audit_export_panel',
    label: 'No-PII audit export exists',
  },
  {
    id: 'CODE-10',
    marker: 'justice_theme_crm_render_webhook_readiness_panel',
    label: 'Webhook readiness panel exists but is not live',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    input: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--input=')) {
      args.input = arg.slice('--input='.length);
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
  const base = `whatsapp-talkto-import-preflight-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `whatsapp-talkto-import-template-${reportDate}.csv`),
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

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function normalizeHeader(header) {
  return String(header || '').trim().toLowerCase();
}

function findHeader(headers, canonical) {
  const aliases = HEADER_ALIASES[canonical] || [canonical];
  return headers.find((header) => aliases.includes(header)) || '';
}

function getCell(row, headers, canonical) {
  const header = findHeader(headers, canonical);
  if (!header) {
    return '';
  }
  const index = headers.indexOf(header);
  return String(row[index] || '').trim();
}

function inspectInput(inputPath) {
  if (!inputPath) {
    return {
      mode: 'template_only',
      inputProvided: false,
      status: 'TEMPLATE_READY_NO_SOURCE_FILE',
      blockers: ['No source export supplied yet. Use the generated template or run again with --input=path/to/export.csv.'],
      rowCount: 0,
      headers: [],
      mappedHeaders: {},
      rowsMissingPhoneAndMessage: 0,
      rowsWithRouteableConsent: 0,
      rowsWithLegacyConsent: 0,
      rowsWithDoNotContact: 0,
      rowsWithUnknownConsent: 0,
    };
  }

  const absoluteInput = path.resolve(ROOT, inputPath);
  if (!existsSync(absoluteInput)) {
    throw new Error(`Input CSV does not exist: ${absoluteInput}`);
  }

  const raw = readFileSync(absoluteInput, 'utf8');
  const lines = raw.split(/\r\n|\r|\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) {
    return {
      mode: 'input_checked',
      inputProvided: true,
      status: 'BLOCKED_EMPTY_OR_HEADER_ONLY',
      blockers: ['Input has no data rows.'],
      rowCount: 0,
      headers: lines[0] ? parseCsvLine(lines[0]).map(normalizeHeader) : [],
      mappedHeaders: {},
      rowsMissingPhoneAndMessage: 0,
      rowsWithRouteableConsent: 0,
      rowsWithLegacyConsent: 0,
      rowsWithDoNotContact: 0,
      rowsWithUnknownConsent: 0,
    };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const rows = lines.slice(1).map(parseCsvLine);
  const mappedHeaders = Object.fromEntries(Object.keys(HEADER_ALIASES).map((key) => [key, findHeader(headers, key)]));
  const blockers = [];

  if (!mappedHeaders.phone && !mappedHeaders.message) {
    blockers.push('No phone or message header was detected. Import staging requires at least one of them.');
  }
  if (!mappedHeaders.thread_id) {
    blockers.push('No thread_id/chat_id/conversation_id header was detected. Dedupe will rely more heavily on phone/date/message fingerprint.');
  }
  if (!mappedHeaders.date) {
    blockers.push('No date/timestamp header was detected. Add one if the provider export supports it.');
  }
  if (!mappedHeaders.consent_status) {
    blockers.push('No consent_status/permission_status header was detected. The CRM form default must be chosen carefully before paste import.');
  }

  let rowsMissingPhoneAndMessage = 0;
  let rowsWithRouteableConsent = 0;
  let rowsWithLegacyConsent = 0;
  let rowsWithDoNotContact = 0;
  let rowsWithUnknownConsent = 0;

  for (const row of rows) {
    const phone = getCell(row, headers, 'phone');
    const message = getCell(row, headers, 'message');
    const consent = getCell(row, headers, 'consent_status');

    if (!phone && !message) {
      rowsMissingPhoneAndMessage += 1;
    }

    if (ROUTEABLE_CONSENT_STATES.includes(consent)) {
      rowsWithRouteableConsent += 1;
    } else if (consent === 'legacy_needs_repermission') {
      rowsWithLegacyConsent += 1;
    } else if (consent === 'do_not_contact') {
      rowsWithDoNotContact += 1;
    } else if (consent && !CONSENT_STATES.includes(consent)) {
      rowsWithUnknownConsent += 1;
    }
  }

  if (rowsMissingPhoneAndMessage > 0) {
    blockers.push(`${rowsMissingPhoneAndMessage} row(s) have neither phone nor message and should not be imported.`);
  }
  if (rowsWithRouteableConsent > 0) {
    blockers.push(`${rowsWithRouteableConsent} row(s) claim routeable consent. Owner must verify evidence before import or downgrade to fresh_inbound_needs_details/legacy_needs_repermission.`);
  }
  if (rowsWithUnknownConsent > 0) {
    blockers.push(`${rowsWithUnknownConsent} row(s) use unknown consent status values.`);
  }

  return {
    mode: 'input_checked',
    inputProvided: true,
    status: blockers.length ? 'BLOCKED_REVIEW_REQUIRED' : 'READY_FOR_OWNER_PASTE_STAGING',
    blockers,
    rowCount: rows.length,
    headers,
    mappedHeaders,
    rowsMissingPhoneAndMessage,
    rowsWithRouteableConsent,
    rowsWithLegacyConsent,
    rowsWithDoNotContact,
    rowsWithUnknownConsent,
  };
}

function inspectCodeGates() {
  const leadCrmPath = path.join(ROOT, 'inc', 'lead-crm.php');
  const source = readFileSync(leadCrmPath, 'utf8');

  return REQUIRED_CODE_MARKERS.map((check) => ({
    id: check.id,
    gate: check.label,
    status: source.includes(check.marker) ? 'PASS' : 'MISSING',
    evidence: check.marker,
    action: source.includes(check.marker)
      ? 'No action needed.'
      : 'Do not import exports until this code marker is restored.',
  }));
}

function buildRows(validation, codeGates) {
  const rows = [
    {
      id: 'IMPORT-01',
      type: 'operator_gate',
      status: validation.status,
      evidence: validation.inputProvided ? `Input checked with ${validation.rowCount} row(s); no PII written to report.` : 'No input file supplied; generated blank import template.',
      allowed_action: validation.inputProvided && validation.status === 'READY_FOR_OWNER_PASTE_STAGING'
        ? 'Owner may paste the export into Justice CRM import staging after choosing source channel and default consent carefully.'
        : 'Use this packet to prepare the export; do not create CRM rows from this report alone.',
      blocked_action: 'Do not contact clients, notify lawyers/suppliers, release PII, invoice, mark paid, or enable webhooks from this packet.',
      next_owner_action: validation.inputProvided
        ? 'Review blockers and consent evidence before paste import.'
        : 'Ask TalkTo/WhatsApp provider for a CSV export using the generated template headers.',
    },
    {
      id: 'IMPORT-02',
      type: 'template',
      status: 'READY_PRIVATE_TEMPLATE',
      evidence: '.project-control/whatsapp-talkto-import-template-<date>.csv',
      allowed_action: 'Use as a column guide for provider exports or owner-maintained lead sheets.',
      blocked_action: 'Do not fill this template with real PII inside the repo.',
      next_owner_action: 'Store real exports outside the repo or paste directly into wp-admin Justice CRM.',
    },
    {
      id: 'IMPORT-03',
      type: 'legacy_rule',
      status: 'DEFAULT_REPERMISSION_REQUIRED',
      evidence: 'Legacy exports must default to legacy_needs_repermission.',
      allowed_action: 'Send only owner-approved opt-in/details copy from the CRM permission queue.',
      blocked_action: 'Do not treat old WhatsApp/TalkTo rows as permission for lawyer or supplier introduction.',
      next_owner_action: 'For old untreated leads, use small batches and keep routing_hold=1.',
    },
    {
      id: 'IMPORT-04',
      type: 'fresh_inbound_rule',
      status: 'DETAILS_AND_MATCH_PERMISSION_REQUIRED',
      evidence: 'Fresh inbound rows may start as fresh_inbound_needs_details.',
      allowed_action: 'Ask for case details and explicit permission to match before partner preview or PII release.',
      blocked_action: 'Do not infer match consent from clicking the WhatsApp button alone.',
      next_owner_action: 'For the current UK lead, ask permission/details before supplier handoff.',
    },
    {
      id: 'IMPORT-05',
      type: 'billing_rule',
      status: 'PAYMENT_PROOF_REQUIRED',
      evidence: 'Billing queue and owner release exist in CRM, but no payment is created by import.',
      allowed_action: 'Record partner terms, owner release, invoice/reference and private payment evidence manually after consent.',
      blocked_action: 'Do not claim paid revenue from staged imports before private payment evidence exists.',
      next_owner_action: 'Use manual invoice path until provider payment flow is proven.',
    },
    ...codeGates.map((gate) => ({
      id: gate.id,
      type: 'code_gate',
      status: gate.status,
      evidence: gate.gate,
      allowed_action: gate.status === 'PASS' ? 'This static gate is present.' : 'Fix code before import.',
      blocked_action: gate.status === 'PASS' ? 'Do not bypass the gate manually.' : 'Do not import while missing.',
      next_owner_action: gate.action,
    })),
  ];

  return rows;
}

function templateCsv() {
  return toCsv(
    [
      {
        phone: '',
        name: '',
        email: '',
        message: '',
        date: '',
        page_url: '',
        thread_id: '',
        legal_area: '',
        consent_status: 'legacy_needs_repermission',
        city: '',
      },
    ],
    ['phone', 'name', 'email', 'message', 'date', 'page_url', 'thread_id', 'legal_area', 'consent_status', 'city']
  );
}

function markdownReport(reportDate, validation, rows, outputs) {
  const codeGateFailures = rows.filter((row) => row.type === 'code_gate' && row.status !== 'PASS').length;
  const summaryStatus = codeGateFailures > 0
    ? 'BLOCKED_CODE_GATE_MISSING'
    : validation.status;

  const lines = [
    `# WhatsApp / TalkTo Import Preflight Packet - ${reportDate}`,
    '',
    `Status: ${summaryStatus}`,
    '',
    'Purpose: prepare WhatsApp, TalkTo and legacy lead exports for consent-safe CRM staging without writing client PII into repo reports.',
    '',
    'Safety: no login, mailbox action, CMS publish, database edit, real lead creation, client contact, lawyer/supplier contact, WhatsApp message, TalkTo message, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    '## Generated Files',
    '',
    `- Private report: \`${path.relative(ROOT, outputs.projectMd)}\``,
    `- Private CSV: \`${path.relative(ROOT, outputs.projectCsv)}\``,
    `- Machine JSON: \`${path.relative(ROOT, outputs.reportJson)}\``,
    `- Machine CSV: \`${path.relative(ROOT, outputs.reportCsv)}\``,
    `- Blank import template: \`${path.relative(ROOT, outputs.templateCsv)}\``,
    '',
    '## Validation Summary',
    '',
    `- Input supplied: ${validation.inputProvided ? 'yes' : 'no'}`,
    `- Input rows counted: ${validation.rowCount}`,
    `- Rows missing both phone and message: ${validation.rowsMissingPhoneAndMessage}`,
    `- Rows claiming routeable consent: ${validation.rowsWithRouteableConsent}`,
    `- Rows marked legacy re-permission: ${validation.rowsWithLegacyConsent}`,
    `- Rows marked do not contact: ${validation.rowsWithDoNotContact}`,
    `- Rows with unknown consent value: ${validation.rowsWithUnknownConsent}`,
    '',
    '## Blockers',
    '',
    ...(validation.blockers.length ? validation.blockers.map((item) => `- ${item}`) : ['- None in this no-PII preflight. Owner review is still required before paste import.']),
    '',
    '## Header Map',
    '',
    '| Canonical Field | Detected Header |',
    '| --- | --- |',
    ...Object.keys(HEADER_ALIASES).map((key) => `| ${key} | ${validation.mappedHeaders?.[key] || '-'} |`),
    '',
    '## Gate Rows',
    '',
    '| ID | Type | Status | Evidence | Allowed Action | Blocked Action | Next Owner Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.type} | ${row.status} | ${row.evidence} | ${row.allowed_action} | ${row.blocked_action} | ${row.next_owner_action} |`),
    '',
    '## Operator Rule',
    '',
    'Real exports should stay out of the repo. Either paste a reviewed export directly into `wp-admin -> Justice CRM -> WhatsApp / TalkTo import staging`, or run this tool against a local file only to get no-PII counts and blockers. The report intentionally records headers and counts only, not names, phone numbers, emails, raw chat, documents or screenshots.',
    '',
    '## Linear Anchors',
    '',
    '- Parent: `HAD-87` WhatsApp/TalkTo consent-safe CRM.',
    '- Related: `HAD-102` paid handoff runbook, `HAD-79` supplier marketplace, `HAD-97` smart-match bid readiness, `HAD-76` Bituach Leumi first paid lead.',
    '',
  ];

  return lines.join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-whatsapp-talkto-import-preflight-packet.mjs [--reportDate=YYYY-MM-DD] [--input=path/to/export.csv]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const validation = inspectInput(args.input);
const codeGates = inspectCodeGates();
const rows = buildRows(validation, codeGates);
const columns = ['id', 'type', 'status', 'evidence', 'allowed_action', 'blocked_action', 'next_owner_action'];

writeText(outputs.templateCsv, templateCsv());
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ status: validation.status, validation, codeGates, rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(args.reportDate, validation, rows, outputs));

console.table(rows.map(({ id, type, status }) => ({ id, type, status })));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.templateCsv)}`);
