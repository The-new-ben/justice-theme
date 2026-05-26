import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const SOURCE_CSV = path.join(ROOT, '.project-control', 'btl-specialist-prospect-shortlist-2026-05-26.csv');

const preferredSourceOrder = [
  'work-accidents.co.il',
  'kslaw.biz',
  'samaratviot.co.il',
  'lt-law.co.il',
  'm-f.law',
];

const manualChecklist = [
  'Verify Israeli Bar license and active professional status from an independent source.',
  'Verify Bituach Leumi appeal, medical committee or appeal committee experience from a direct source.',
  'Verify same-day response SLA for urgent appeal-window cases.',
  'Verify accepted lead fee, trial terms or subscription path before marking as commercial-ready.',
  'Verify billing contact email and manual invoice/payment path.',
  'Verify permission to receive no-PII lead previews and the exact terms they accept.',
  'Record partnership status, accepted terms, billing contact and payment path in the private CRM.',
  'Only after all gates pass, convert the private prospect to a routable lawyer profile with owner release.',
];

const stopConditions = [
  'No independent source verification for license or active status.',
  'No direct evidence of Bituach Leumi appeal or medical-committee work.',
  'No accepted lead fee, subscription terms or manual invoice/payment path.',
  'No billing contact email.',
  'No explicit permission to receive no-PII lead previews.',
  'No owner-approved controlled lead for the first routing drill.',
];

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
  const base = `btl-first-prospect-activation-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
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

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(field);
      if (row.some((cell) => cell.trim() !== '')) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== '')) {
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows
    .filter((item) => item.length === headers.length)
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ''])));
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function sourceRank(row) {
  const url = normalize(row.source_url);
  const preferredIndex = preferredSourceOrder.findIndex((domain) => url.includes(domain));
  if (preferredIndex >= 0) {
    return preferredIndex;
  }
  return preferredSourceOrder.length + 100;
}

function selectRows(sourceRows) {
  const highPriority = sourceRows.filter((row) => normalize(row.priority) === 'high');
  const preferred = highPriority
    .filter((row) => sourceRank(row) < preferredSourceOrder.length)
    .sort((a, b) => sourceRank(a) - sourceRank(b));
  const fallback = highPriority.filter((row) => !preferred.includes(row));
  const selected = [...preferred, ...fallback];
  const primary = selected.slice(0, 3);
  const backup = selected.slice(3, 6);
  return { highPriority, primary, backup };
}

function buildActivationRows(primary, backup) {
  return [...primary, ...backup].map((row, index) => {
    const queue = index < primary.length ? 'primary' : 'backup';
    const step = index < primary.length ? index + 1 : index - primary.length + 1;
    return {
      queue,
      step,
      candidate: row.candidate,
      source_url: row.source_url,
      source_type: row.source_type,
      apparent_focus: row.apparent_focus,
      source_evidence_summary: row.source_evidence_summary,
      priority: row.priority,
      geo_hint: row.geo_hint,
      crm_action: row.crm_action,
      verification_status: row.verification_status || 'not_verified',
      manual_checks_required: manualChecklist.join(' | '),
      owner_next_action:
        queue === 'primary'
          ? 'Create private prospect only; do not publish, contact, route or mark ready until every manual check passes.'
          : 'Use only if a primary candidate fails verification, response or commercial terms.',
      stop_condition: stopConditions.join(' | '),
      notes: row.notes,
    };
  });
}

function mdTable(rows, mode = 'primary') {
  if (!rows.length) {
    return '_No rows selected._';
  }

  return [
    '| Step | Candidate | Source | Focus | Current Status | Next Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows.map((row, index) => {
      const source = row.source_url ? `[source](${row.source_url})` : 'source missing';
      const nextAction =
        mode === 'primary'
          ? 'Create private prospect, then verify all gates before any outreach.'
          : 'Hold as backup unless a primary candidate fails gates.';
      return `| ${index + 1} | ${String(row.candidate || '').replace(/\|/g, '/')} | ${source} | ${String(row.apparent_focus || '').replace(/\|/g, '/')} | ${row.verification_status || 'not_verified'} | ${nextAction} |`;
    }),
  ].join('\n');
}

function markdownReport(reportDate, summary, primary, backup) {
  return [
    `# Bituach Leumi First-Prospect Activation Packet - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private owner/team activation packet for the first Bituach Leumi supplier entries. This does not create leads, create prospects, create lawyer records, publish public pages, send outreach, route clients, invoice, charge payment, change SEO controls or deploy uPress.',
    '',
    '## Source Boundary',
    '',
    '- Source CSV: `.project-control/btl-specialist-prospect-shortlist-2026-05-26.csv`.',
    '- This is not a public recommendation list and not public lawyer-directory content.',
    '- Selection order is for private CRM entry only. It does not endorse any candidate.',
    '- Every candidate starts as `not_verified` until the private CRM verification fields prove otherwise.',
    '',
    '## Summary',
    '',
    `- Source rows loaded: ${summary.sourceRows}`,
    `- High-priority rows available: ${summary.highPriorityRows}`,
    `- Primary private-entry candidates: ${summary.primaryCount}`,
    `- Backup private-entry candidates: ${summary.backupCount}`,
    `- Public changes approved by this packet: 0`,
    '',
    '## Primary Private-Entry Queue',
    '',
    mdTable(primary, 'primary'),
    '',
    '## Backup Queue',
    '',
    mdTable(backup, 'backup'),
    '',
    '## Per-Prospect Manual Checklist',
    '',
    ...manualChecklist.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## Stop Conditions',
    '',
    ...stopConditions.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## Manual No-PII Outreach Skeletons',
    '',
    'Use these only after the owner decides to contact a prospect manually. Do not attach client names, phone numbers, documents, chats, medical facts or files.',
    '',
    '**Email subject:** בדיקת שיתוף פעולה פרטית - פניות ביטוח לאומי מ-Jus-Tice',
    '',
    '**Email/WhatsApp body skeleton:**',
    '',
    'שלום, אנחנו בודקים שיתוף פעולה פרטי ומבוקר לפניות בתחום ביטוח לאומי / ועדות רפואיות. בשלב זה לא מועברים פרטי לקוח. נרצה לוודא תחומי טיפול, זמינות, תנאי קבלת פניות, פרטי חיוב ואישור לקבלת תקצירי פנייה ללא פרטים מזהים. אם מתאים, נמשיך רק אחרי אישור תנאים מסודר.',
    '',
    '## Owner / Remote Team Run Order',
    '',
    '1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply`.',
    '2. Create private prospect records only for the three primary candidates.',
    '3. Fill source URL, focus, evidence summary and `not_verified` status from the CSV.',
    '4. Work the manual checklist until each verification-missing field is empty.',
    '5. If a primary candidate fails, use the next backup candidate.',
    '6. Convert to routable lawyer profile only after owner release and accepted commercial terms.',
    '7. Run the controlled Bituach Leumi lead only after three routable paid specialists and billing evidence paths exist.',
    '',
    '## Related Trail',
    '',
    '- Parent Linear task: `HAD-76` - Bituach Leumi first billable lead.',
    '- Prior evidence: `HAD-104` / `.project-control/btl-first-paid-lead-readiness-2026-05-26.md`.',
    '- Source pack: `.project-control/btl-specialist-prospect-shortlist-2026-05-26.md`.',
    '',
    '## Safety Statement',
    '',
    'Do not create public profiles, publish recommendations, route leads, send client PII, contact lawyers automatically, invoice, charge, mark paid or claim first paid-lead revenue from this packet alone.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-btl-first-prospect-activation-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

if (!existsSync(SOURCE_CSV)) {
  throw new Error(`Source CSV missing: ${SOURCE_CSV}`);
}

const sourceRows = parseCsv(readText(SOURCE_CSV));
const { highPriority, primary, backup } = selectRows(sourceRows);
const activationRows = buildActivationRows(primary, backup);
const summary = {
  reportDate: args.reportDate,
  status: primary.length === 3 && backup.length >= 3 ? 'READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY' : 'BLOCKED_SOURCE_SELECTION',
  sourceRows: sourceRows.length,
  highPriorityRows: highPriority.length,
  primaryCount: primary.length,
  backupCount: backup.length,
  publicChangesApproved: 0,
};
const files = outputFiles(args.reportDate);
const columns = [
  'queue',
  'step',
  'candidate',
  'source_url',
  'source_type',
  'apparent_focus',
  'source_evidence_summary',
  'priority',
  'geo_hint',
  'crm_action',
  'verification_status',
  'manual_checks_required',
  'owner_next_action',
  'stop_condition',
  'notes',
];
const csv = toCsv(activationRows, columns);

writeText(files.projectMd, markdownReport(args.reportDate, summary, primary, backup));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, activationRows, files }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify(summary, null, 2));
