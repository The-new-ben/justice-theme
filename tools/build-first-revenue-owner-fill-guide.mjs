import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const LANE_COPY = {
  btl_first_paid_lead: {
    titleHe: 'ביטוח לאומי: ליד ראשון בתשלום',
    ownerProofHe: 'ראיה פרטית שיש שלושה מומחים/עורכי דין מתאימים, כיסוי שניתן לנתב אליו, ליד אחד עם הסכמה, חיוב והוכחת תשלום פרטית.',
    safePointerExample: 'btl-private-admin-row-01',
    firstFillHe: 'להתחיל רק בשורת המומחה הראשונה: לאמת שיש גורם פרטי מתאים, בלי שם, טלפון, מייל או קישור בקובץ.',
  },
  lawyer_subscription_paid_test: {
    titleHe: 'מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית',
    ownerProofHe: 'ראיה פרטית לזהות בדיקה נשלטת, נתיב תשלום מאושר, רישום/דשבורד, בקשת שירות וחשבונית או תשלום.',
    safePointerExample: 'lawyer-test-private-row-01',
    firstFillHe: 'להתחיל רק בזהות הבדיקה: לאשר שהבעלים יודע מי עורך הדין/משתמש הבדיקה, בלי להכניס פרטי קשר לקובץ.',
  },
  criminal_jerusalem_supplier_coverage: {
    titleHe: 'כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום',
    ownerProofHe: 'ראיה פרטית למועמד מתאים, אימות רישיון/תחום, זמינות, תנאי lead-fee והחלטה אם מכינים כרטיס ציבורי בנפרד.',
    safePointerExample: 'criminal-jlm-private-row-01',
    firstFillHe: 'להתחיל רק במועמד אחד: לסמן שיש מועמד פרטי לבדיקה, בלי שם, טלפון, מייל או כתובת אתר בקובץ.',
  },
};

const FIELD_ROWS = [
  {
    field: 'private_admin_pointer_no_pii',
    fillHe: 'מזהה פנימי בלבד, למשל admin-row-1 או btl-private-admin-row-01.',
    doNotFillHe: 'לא שם אדם, לא טלפון, לא מייל, לא URL, לא מספר תיק, לא סוד API.',
  },
  {
    field: 'status',
    fillHe: 'pass רק אם הבעלים/מנהל באמת בדק את הראיה הפרטית. אחרת להשאיר not_started או blocked.',
    doNotFillHe: 'לא לסמן pass כדי להתקדם מהר. pass בלי ראיה ייחסם בהמשך.',
  },
  {
    field: 'owner_verified_yes_no',
    fillHe: 'yes רק אם הבעלים/מנהל אישר שהראיה נבדקה.',
    doNotFillHe: 'לא yes אם רק יש הנחה או זיכרון כללי.',
  },
  {
    field: 'proof_present_yes_no',
    fillHe: 'yes רק אם קיימת ראיה פרטית במקום אחר: wp-admin, CRM, חשבונית, צילום מסך פרטי או מסמך פנימי.',
    doNotFillHe: 'לא להדביק את הראיה עצמה לקובץ הזה.',
  },
  {
    field: 'no_pii_confirmed_yes_no',
    fillHe: 'yes רק אחרי בדיקה שאין בקובץ הזה פרטים מזהים.',
    doNotFillHe: 'לא להשאיר yes אם הוכנסו פרטי קשר, URL או פרטי לקוח.',
  },
  {
    field: 'live_or_public_action_approved',
    fillHe: 'להשאיר no. פעולה חיה דורשת אישור בעלים נפרד אחרי שהבדיקה עוברת.',
    doNotFillHe: 'לא להשתמש בעמודה הזו כדי לאשר פנייה, תשלום, פרסום או שינוי ציבורי.',
  },
  {
    field: 'owner_note_no_pii',
    fillHe: 'הערה קצרה ללא פרטים מזהים, למשל "נבדק מול wp-admin" או "חסר אישור תשלום".',
    doNotFillHe: 'לא להכניס שמות, מספרים, מיילים, טלפונים, קישורים או פרטי תיק.',
  },
];

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
    reviewJson: path.join(ROOT, '.reports', `first-revenue-owner-evidence-review-${sourceDate}.json`),
    ownerFillCsv: path.join(ROOT, '.project-control', `first-revenue-owner-evidence-kit-owner-fill-${sourceDate}.csv`),
  };
}

function outputFiles(reportDate) {
  const base = `first-revenue-owner-fill-guide-${reportDate}`;
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

  const headers = rows[0] || [];
  return rows
    .slice(1)
    .filter((cells) => cells.some((cell) => String(cell).trim() !== ''))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function buildGuideRows(reviewRows) {
  return reviewRows.map((row) => {
    const copy = LANE_COPY[row.lane] || {};
    return {
      lane: row.lane,
      lane_title_he: copy.titleHe || row.lane,
      unblock_id: row.unblock_id,
      sequence: row.sequence,
      action_id: row.action_id,
      action_title_he: row.title_he,
      current_review_status: row.review_status,
      suggested_status: row.review_status === 'PASS' ? 'pass' : 'pass only after private proof',
      suggested_private_pointer_no_pii: `${copy.safePointerExample || 'private-admin-row'}-${String(row.sequence).padStart(2, '0')}`,
      required_owner_fill_he: copy.ownerProofHe || '',
      first_fill_hint_he: row.sequence === 1 ? copy.firstFillHe || '' : 'למלא רק אחרי שהשורות הקודמות במסלול עברו או שיש ראיה מסודרת לכל הרצף.',
      keep_live_public_action_approved: 'no',
      raw_private_values_allowed: 'no',
    };
  });
}

function firstBlockedRows(guideRows) {
  const lanes = [...new Set(guideRows.map((row) => row.lane))];
  return lanes.map((lane) => guideRows.find((row) => row.lane === lane && row.current_review_status !== 'PASS')).filter(Boolean);
}

function buildGates({ sourceReview, ownerFillRows, guideRows }) {
  const summary = sourceReview.summary || {};
  return [
    {
      id: 'FR-FILL-GUIDE-GATE-01',
      gate: 'source_review_loaded',
      status: summary.status === 'FIRST_REVENUE_OWNER_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION' ? 'PASS' : 'REVIEW',
      evidence: `Source review status: ${summary.status || 'missing'}.`,
    },
    {
      id: 'FR-FILL-GUIDE-GATE-02',
      gate: 'owner_fill_csv_available',
      status: ownerFillRows.length === 18 ? 'PASS' : 'BLOCKED',
      evidence: `${ownerFillRows.length}/18 owner-fill rows available.`,
    },
    {
      id: 'FR-FILL-GUIDE-GATE-03',
      gate: 'guide_rows_created',
      status: guideRows.length === 18 ? 'PASS' : 'BLOCKED',
      evidence: `${guideRows.length}/18 guide rows created.`,
    },
    {
      id: 'FR-FILL-GUIDE-GATE-04',
      gate: 'no_live_action_from_guide',
      status: 'PASS',
      evidence: 'The guide only explains private fill values; it approves 0 live/public/payment/email/uPress actions.',
    },
  ];
}

function buildMarkdown({ summary, firstRows, fieldRows, guideRows, gates }) {
  return [
    `# מדריך מילוי ראיות להכנסה ראשונה - ${summary.reportDate}`,
    '',
    `סטטוס: ${summary.status}`,
    '',
    'המדריך הזה פנימי בלבד. הוא לא מפרסם עמוד, לא יוצר ליד, לא פונה לעורך דין או ספק, לא יוצר חשבונית או תשלום, ולא מאשר פעולה חיה. המטרה שלו היא לעזור לבעלים או מנהל למלא ראיות מסוננות כדי שקודקס יוכל לבדוק pass/blocked בלי פרטים מזהים.',
    '',
    '## מה לעשות עכשיו',
    '',
    `1. לפתוח את קובץ המילוי: \`${summary.ownerFillCsv}\`.`,
    '2. להתחיל בשלוש השורות הראשונות בלבד: שורה אחת לכל מסלול הכנסה.',
    '3. בכל שורה שעברה בדיקה פרטית אמיתית, למלא `status=pass`, `owner_verified_yes_no=yes`, `proof_present_yes_no=yes`, להשאיר `no_pii_confirmed_yes_no=yes`, ולהשאיר `live_or_public_action_approved=no`.',
    '4. לא להכניס שמות, טלפונים, מיילים, כתובות URL, פרטי לקוחות, מספרי תיקים או סודות.',
    '5. אחרי מילוי, להריץ מחדש את בדיקת הראיות. גם אם הבדיקה עוברת, פעולה חיה עדיין דורשת אישור בעלים נפרד.',
    '',
    '## שלוש שורות להתחלה',
    '',
    '| מסלול | שורה | פעולה | מה צריך להוכיח | דוגמת pointer בטוחה | סטטוס נוכחי |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...firstRows.map((row) => `| ${mdCell(row.lane_title_he)} | ${row.sequence} | ${mdCell(row.action_title_he)} | ${mdCell(row.first_fill_hint_he)} | ${row.suggested_private_pointer_no_pii} | ${row.current_review_status} |`),
    '',
    '## איך למלא עמודות',
    '',
    '| עמודה | למלא כך | לא למלא כך |',
    '| --- | --- | --- |',
    ...fieldRows.map((row) => `| ${row.field} | ${mdCell(row.fillHe)} | ${mdCell(row.doNotFillHe)} |`),
    '',
    '## כל שורות הבדיקה',
    '',
    '| מסלול | שורה | action_id | סטטוס נוכחי | pointer מוצע |',
    '| --- | ---: | --- | --- | --- |',
    ...guideRows.map((row) => `| ${mdCell(row.lane_title_he)} | ${row.sequence} | ${row.action_id} | ${row.current_review_status} | ${row.suggested_private_pointer_no_pii} |`),
    '',
    '## שערי בטיחות',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${gate.gate} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## החלטה',
    '',
    'עדיין אין הכנסה חיה. המדריך הופך את החסם לפעולת מילוי פרטית וברורה: שלוש שורות ראשונות, בלי פרטים מזהים, ואז בדיקת pass/blocked חוזרת.',
    '',
  ].join('\n');
}

function buildHtml({ summary, firstRows, fieldRows, guideRows, gates }) {
  const firstRowsHtml = firstRows
    .map(
      (row) => `
        <tr>
          <td>${htmlEscape(row.lane_title_he)}</td>
          <td>${row.sequence}</td>
          <td>${htmlEscape(row.action_title_he)}</td>
          <td>${htmlEscape(row.first_fill_hint_he)}</td>
          <td><code>${htmlEscape(row.suggested_private_pointer_no_pii)}</code></td>
          <td>${htmlEscape(row.current_review_status)}</td>
        </tr>`,
    )
    .join('');
  const fieldRowsHtml = fieldRows
    .map(
      (row) => `
        <tr>
          <td><code>${htmlEscape(row.field)}</code></td>
          <td>${htmlEscape(row.fillHe)}</td>
          <td>${htmlEscape(row.doNotFillHe)}</td>
        </tr>`,
    )
    .join('');
  const guideRowsHtml = guideRows
    .map(
      (row) => `
        <tr>
          <td>${htmlEscape(row.lane_title_he)}</td>
          <td>${row.sequence}</td>
          <td><code>${htmlEscape(row.action_id)}</code></td>
          <td>${htmlEscape(row.current_review_status)}</td>
          <td><code>${htmlEscape(row.suggested_private_pointer_no_pii)}</code></td>
        </tr>`,
    )
    .join('');
  const gatesHtml = gates
    .map(
      (gate) => `
        <tr>
          <td><code>${htmlEscape(gate.id)}</code></td>
          <td>${htmlEscape(gate.gate)}</td>
          <td>${htmlEscape(gate.status)}</td>
          <td>${htmlEscape(gate.evidence)}</td>
        </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>מדריך מילוי ראיות להכנסה ראשונה</title>
  <style>
    body { margin: 0; font-family: Arial, "Noto Sans Hebrew", sans-serif; background: #f7f6f2; color: #18201c; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 20px 56px; }
    h1 { font-size: 30px; margin: 0 0 8px; }
    h2 { font-size: 20px; margin-top: 28px; }
    p, li { line-height: 1.65; }
    .status { display: inline-block; padding: 6px 10px; background: #fff1d6; border: 1px solid #e0b45a; border-radius: 6px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; background: #fff; }
    th, td { border: 1px solid #ddd6c7; padding: 10px; text-align: right; vertical-align: top; }
    th { background: #eee7d8; }
    code { direction: ltr; unicode-bidi: plaintext; background: #f1f3f2; padding: 2px 5px; border-radius: 4px; }
    .note { background: #fff; border-right: 4px solid #2d6a4f; padding: 12px 14px; margin: 16px 0; }
  </style>
</head>
<body>
<main>
  <h1>מדריך מילוי ראיות להכנסה ראשונה</h1>
  <p class="status">${htmlEscape(summary.status)}</p>
  <div class="note">פנימי בלבד: המדריך לא מפרסם עמוד, לא יוצר ליד, לא שולח הודעה, לא יוצר חשבונית או תשלום, ולא מאשר פעולה חיה.</div>
  <h2>מה לעשות עכשיו</h2>
  <ol>
    <li>לפתוח את קובץ המילוי: <code>${htmlEscape(summary.ownerFillCsv)}</code>.</li>
    <li>להתחיל בשלוש השורות הראשונות בלבד: שורה אחת לכל מסלול הכנסה.</li>
    <li>למלא <code>pass</code> ו-<code>yes</code> רק אחרי בדיקה פרטית אמיתית, ולהשאיר פעולה חיה על <code>no</code>.</li>
    <li>לא להכניס שמות, טלפונים, מיילים, כתובות URL, פרטי לקוחות, מספרי תיקים או סודות.</li>
  </ol>
  <h2>שלוש שורות להתחלה</h2>
  <table><thead><tr><th>מסלול</th><th>שורה</th><th>פעולה</th><th>מה צריך להוכיח</th><th>pointer בטוח</th><th>סטטוס נוכחי</th></tr></thead><tbody>${firstRowsHtml}</tbody></table>
  <h2>איך למלא עמודות</h2>
  <table><thead><tr><th>עמודה</th><th>למלא כך</th><th>לא למלא כך</th></tr></thead><tbody>${fieldRowsHtml}</tbody></table>
  <h2>כל שורות הבדיקה</h2>
  <table><thead><tr><th>מסלול</th><th>שורה</th><th>action_id</th><th>סטטוס נוכחי</th><th>pointer מוצע</th></tr></thead><tbody>${guideRowsHtml}</tbody></table>
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
    console.log('Usage: node tools/build-first-revenue-owner-fill-guide.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const outputs = outputFiles(args.reportDate);
  const sourceReview = readJson(sources.reviewJson);
  const ownerFillRows = parseCsv(readText(sources.ownerFillCsv));
  const reviewRows = sourceReview.reviewRows || [];
  const guideRows = buildGuideRows(reviewRows);
  const firstRows = firstBlockedRows(guideRows);
  const gates = buildGates({ sourceReview, ownerFillRows, guideRows });
  const status = 'FIRST_REVENUE_OWNER_FILL_GUIDE_READY_NO_LIVE_ACTION';
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceReview: relativePath(sources.reviewJson),
    ownerFillCsv: relativePath(sources.ownerFillCsv),
    ownerFillRows: ownerFillRows.length,
    guideRows: guideRows.length,
    firstRowsToFill: firstRows.length,
    liveActionApproved: 0,
    publicActionApproved: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 42,
    revenueCanBeClaimed: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const guideColumns = [
    'lane',
    'lane_title_he',
    'unblock_id',
    'sequence',
    'action_id',
    'action_title_he',
    'current_review_status',
    'suggested_status',
    'suggested_private_pointer_no_pii',
    'required_owner_fill_he',
    'first_fill_hint_he',
    'keep_live_public_action_approved',
    'raw_private_values_allowed',
  ];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'ownerFillRows',
    'guideRows',
    'firstRowsToFill',
    'liveActionApproved',
    'publicActionApproved',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
    'upressDeploymentRequired',
    'readinessToProfitPercent',
    'revenueCanBeClaimed',
  ];

  writeText(outputs.projectMd, buildMarkdown({ summary, firstRows, fieldRows: FIELD_ROWS, guideRows, gates }));
  writeText(outputs.projectHtml, buildHtml({ summary, firstRows, fieldRows: FIELD_ROWS, guideRows, gates }));
  writeText(outputs.projectCsv, toCsv(guideRows, guideColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gates, firstRows, fieldRows: FIELD_ROWS, guideRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
