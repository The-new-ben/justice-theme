import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const FORBIDDEN_HE = 'לא להכניס שם, טלפון, מייל, URL, מספר תיק, פרטי לקוח, פרטי כרטיס, סוד API או צילום/טקסט פרטי.';

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

  for (const [key, value] of Object.entries({ reportDate: args.reportDate, sourceDate: args.sourceDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${key} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function sourceFiles(sourceDate) {
  return {
    fillGuide: path.join(ROOT, '.reports', `first-revenue-owner-fill-guide-${sourceDate}.json`),
    fullOwnerFillCsv: path.join(ROOT, '.project-control', `first-revenue-owner-evidence-kit-owner-fill-${sourceDate}.csv`),
  };
}

function outputFiles(reportDate) {
  const base = `first-revenue-three-row-owner-starter-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
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

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function starterRows(firstRows, fullOwnerFillCsv) {
  return firstRows.map((row) => ({
    lane: row.lane,
    lane_title_he: row.lane_title_he,
    unblock_id: row.unblock_id,
    action_id: row.action_id,
    full_csv_sequence: row.sequence,
    action_title_he: row.action_title_he,
    private_proof_to_check_he: row.first_fill_hint_he,
    write_private_admin_pointer_no_pii: '',
    safe_pointer_example: row.suggested_private_pointer_no_pii,
    write_status_after_private_check: 'pass',
    write_owner_verified_yes_no: 'yes',
    write_proof_present_yes_no: 'yes',
    keep_no_pii_confirmed_yes_no: 'yes',
    keep_live_or_public_action_approved: 'no',
    owner_note_no_pii_optional: '',
    forbidden_values_he: FORBIDDEN_HE,
    destination_full_owner_fill_csv: fullOwnerFillCsv,
    reviewer_after_transfer: 'tools/review-first-revenue-owner-evidence-kit.mjs',
  }));
}

function gateRows({ guideSummary, rows }) {
  return [
    {
      id: 'FR-3ROW-GATE-01',
      gate: 'fill_guide_ready',
      status: guideSummary.status === 'FIRST_REVENUE_OWNER_FILL_GUIDE_READY_NO_LIVE_ACTION' ? 'PASS' : 'REVIEW',
      evidence: `Fill guide status: ${guideSummary.status || 'missing'}.`,
    },
    {
      id: 'FR-3ROW-GATE-02',
      gate: 'three_start_rows_only',
      status: rows.length === 3 ? 'PASS' : 'BLOCKED',
      evidence: `${rows.length}/3 starter rows generated.`,
    },
    {
      id: 'FR-3ROW-GATE-03',
      gate: 'live_action_still_blocked',
      status: rows.every((row) => row.keep_live_or_public_action_approved === 'no') ? 'PASS' : 'BLOCKED',
      evidence: 'Every starter row keeps live_or_public_action_approved=no.',
    },
    {
      id: 'FR-3ROW-GATE-04',
      gate: 'revenue_not_claimed',
      status: 'PASS',
      evidence: 'The starter sheet cannot claim revenue; it only prepares private evidence pointers.',
    },
  ];
}

function buildMarkdown({ summary, rows, gates }) {
  return [
    `# טופס שלוש שורות להכנסה ראשונה - ${summary.reportDate}`,
    '',
    `סטטוס: ${summary.status}`,
    '',
    'זהו טופס פנימי קצר לבעלים/מנהל. ממלאים כאן רק שלוש שורות התחלה, בלי פרטים מזהים. אחרי מילוי, מעבירים את הערכים לקובץ ה-CSV המלא ומריצים בדיקת ראיות חוזרת.',
    '',
    '## שורות למילוי',
    '',
    '| מסלול | שורת CSV | פעולה | מה לבדוק בפרטי | pointer בטוח לדוגמה | סטטוס לכתוב רק אם נבדק |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${mdCell(row.lane_title_he)} | ${row.full_csv_sequence} | ${mdCell(row.action_title_he)} | ${mdCell(row.private_proof_to_check_he)} | ${row.safe_pointer_example} | ${row.write_status_after_private_check} |`),
    '',
    '## ערכים לכתוב רק אחרי בדיקה פרטית',
    '',
    '| עמודה בקובץ המלא | ערך |',
    '| --- | --- |',
    '| private_admin_pointer_no_pii | מזהה פנימי קצר בלבד, לדוגמה מהעמודה safe_pointer_example. |',
    '| status | pass |',
    '| owner_verified_yes_no | yes |',
    '| proof_present_yes_no | yes |',
    '| no_pii_confirmed_yes_no | yes |',
    '| live_or_public_action_approved | no |',
    '| owner_note_no_pii | הערה קצרה ללא פרטים מזהים, או להשאיר ריק. |',
    '',
    `קובץ יעד מלא: \`${summary.destinationFullOwnerFillCsv}\``,
    '',
    `אסור: ${FORBIDDEN_HE}`,
    '',
    '## שערי בטיחות',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${gate.gate} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## החלטה',
    '',
    'אין עדיין הכנסה חיה. אם שלוש השורות ימולאו נכון ויעברו בדיקה, אפשר יהיה לבקש אישור בעלים לשלב הבא. גם אז לא מבוצעת פעולה חיה בלי אישור מפורש.',
    '',
  ].join('\n');
}

function buildHtml({ summary, rows, gates }) {
  const rowsHtml = rows.map((row) => `
    <tr>
      <td>${htmlEscape(row.lane_title_he)}</td>
      <td>${row.full_csv_sequence}</td>
      <td>${htmlEscape(row.action_title_he)}</td>
      <td>${htmlEscape(row.private_proof_to_check_he)}</td>
      <td><code>${htmlEscape(row.safe_pointer_example)}</code></td>
      <td><code>${htmlEscape(row.write_status_after_private_check)}</code></td>
    </tr>`).join('');
  const gatesHtml = gates.map((gate) => `
    <tr>
      <td><code>${htmlEscape(gate.id)}</code></td>
      <td>${htmlEscape(gate.gate)}</td>
      <td>${htmlEscape(gate.status)}</td>
      <td>${htmlEscape(gate.evidence)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>טופס שלוש שורות להכנסה ראשונה</title>
  <style>
    body { margin: 0; font-family: Arial, "Noto Sans Hebrew", sans-serif; background: #f7f6f2; color: #18201c; }
    main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 56px; }
    h1 { margin: 0 0 8px; font-size: 30px; }
    h2 { margin-top: 28px; font-size: 20px; }
    p, li { line-height: 1.65; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; background: #fff; }
    th, td { border: 1px solid #ddd6c7; padding: 10px; text-align: right; vertical-align: top; }
    th { background: #eee7d8; }
    code { direction: ltr; unicode-bidi: plaintext; background: #eef1ef; padding: 2px 5px; border-radius: 4px; }
    .status { display: inline-block; padding: 6px 10px; background: #fff1d6; border: 1px solid #e0b45a; border-radius: 6px; font-weight: 700; }
    .guard { background: #fff; border-right: 4px solid #9b2c2c; padding: 12px 14px; margin: 16px 0; }
  </style>
</head>
<body>
<main>
  <h1>טופס שלוש שורות להכנסה ראשונה</h1>
  <p class="status">${htmlEscape(summary.status)}</p>
  <p>ממלאים רק שלוש שורות התחלה, בלי פרטים מזהים. אחרי מילוי, מעבירים לקובץ ה-CSV המלא ומריצים בדיקת ראיות חוזרת.</p>
  <div class="guard">${htmlEscape(FORBIDDEN_HE)}</div>
  <h2>שורות למילוי</h2>
  <table><thead><tr><th>מסלול</th><th>שורת CSV</th><th>פעולה</th><th>מה לבדוק בפרטי</th><th>pointer בטוח לדוגמה</th><th>סטטוס לכתוב רק אם נבדק</th></tr></thead><tbody>${rowsHtml}</tbody></table>
  <h2>ערכים לכתוב רק אחרי בדיקה פרטית</h2>
  <ul>
    <li><code>status=pass</code></li>
    <li><code>owner_verified_yes_no=yes</code></li>
    <li><code>proof_present_yes_no=yes</code></li>
    <li><code>no_pii_confirmed_yes_no=yes</code></li>
    <li><code>live_or_public_action_approved=no</code></li>
  </ul>
  <p>קובץ יעד מלא: <code>${htmlEscape(summary.destinationFullOwnerFillCsv)}</code></p>
  <h2>שערי בטיחות</h2>
  <table><thead><tr><th>ID</th><th>Gate</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${gatesHtml}</tbody></table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-first-revenue-three-row-owner-starter.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const outputs = outputFiles(args.reportDate);
  const fillGuide = readJson(sources.fillGuide);
  readText(sources.fullOwnerFillCsv);

  const rows = starterRows(fillGuide.firstRows || [], relativePath(sources.fullOwnerFillCsv));
  const gates = gateRows({ guideSummary: fillGuide.summary || {}, rows });
  const status = 'FIRST_REVENUE_THREE_ROW_OWNER_STARTER_READY_NO_LIVE_ACTION';
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceGuide: relativePath(sources.fillGuide),
    destinationFullOwnerFillCsv: relativePath(sources.fullOwnerFillCsv),
    starterRows: rows.length,
    liveActionApproved: 0,
    publicActionApproved: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 43,
    revenueCanBeClaimed: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const starterColumns = [
    'lane',
    'lane_title_he',
    'unblock_id',
    'action_id',
    'full_csv_sequence',
    'action_title_he',
    'private_proof_to_check_he',
    'write_private_admin_pointer_no_pii',
    'safe_pointer_example',
    'write_status_after_private_check',
    'write_owner_verified_yes_no',
    'write_proof_present_yes_no',
    'keep_no_pii_confirmed_yes_no',
    'keep_live_or_public_action_approved',
    'owner_note_no_pii_optional',
    'forbidden_values_he',
    'destination_full_owner_fill_csv',
    'reviewer_after_transfer',
  ];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'starterRows',
    'liveActionApproved',
    'publicActionApproved',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
    'upressDeploymentRequired',
    'readinessToProfitPercent',
    'revenueCanBeClaimed',
  ];

  writeText(outputs.projectMd, buildMarkdown({ summary, rows, gates }));
  writeText(outputs.projectHtml, buildHtml({ summary, rows, gates }));
  writeText(outputs.projectCsv, toCsv(rows, starterColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gates, rows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
