import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || DEFAULT_SOURCE_DATE,
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

function outputFiles(reportDate) {
  const base = `criminal-jerusalem-owner-coverage-action-sheet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerFillCsv: path.join(ROOT, '.project-control', `criminal-jerusalem-owner-coverage-owner-fill-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    activationPacket: path.join(ROOT, '.reports', `criminal-jerusalem-lawyer-coverage-activation-packet-${sourceDate}.json`),
    commandCenter: path.join(ROOT, '.reports', `owner-unblocker-command-center-${sourceDate}.json`),
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

function statusOf(report) {
  return report.summary?.status || report.status || 'missing_status';
}

function buildActions() {
  return [
    {
      id: 'CJ-OWNER-ACTION-01',
      order: 1,
      title_he: 'לבחור מועמד פרטי אחד לעורך דין פלילי בירושלים',
      owner_action_he: 'בתוך wp-admin/CRM פרטי: לזהות עורך דין שמשרת ירושלים ומתאים לתיקים פליליים. זה Prospect פרטי בלבד, לא כרטיס ציבורי.',
      allowed_proof_he: 'מותר לרשום בקובץ alias או prospect-row-1 בלבד, בלי שם, טלפון, מייל או URL פרטי.',
      unlocks_he: 'פותח בדיקת רישיון והתאמת תחום.',
      blocked_if_he: 'אין מועמד פלילי-ירושלים ברור, או שהמידע מבוסס רק על ניחוש.',
    },
    {
      id: 'CJ-OWNER-ACTION-02',
      order: 2,
      title_he: 'לאמת רישיון וסטטוס מקצועי',
      owner_action_he: 'לוודא ממקור שאושר על ידי הבעלים שהמועמד מורשה/פעיל. לא להסתמך רק על טקסט שיווקי.',
      allowed_proof_he: 'רק yes/no, תאריך בדיקה ומיקום ראיה פרטי ללא פרטים מזהים.',
      unlocks_he: 'פותח בדיקת התאמה פלילית וירושלים.',
      blocked_if_he: 'אין אימות רישיון/סטטוס.',
    },
    {
      id: 'CJ-OWNER-ACTION-03',
      order: 3,
      title_he: 'לאמת התאמה פלילית ושירות בירושלים',
      owner_action_he: 'לאשר שהמועמד מטפל בפלילי, ושיש לו כיסוי רלוונטי בירושלים. עורך דין כללי בירושלים לא מספיק.',
      allowed_proof_he: 'סטטוס pass/partial/fail והערת התאמה לא מזהה.',
      unlocks_he: 'פותח בדיקת זמינות לתגובה.',
      blocked_if_he: 'אין ראיה פלילית או אין כיסוי ירושלים.',
    },
    {
      id: 'CJ-OWNER-ACTION-04',
      order: 4,
      title_he: 'לאשר זמינות תגובה ללידים רגישים',
      owner_action_he: 'לסמן within_15_min או same_day רק אם יש ראיה פרטית לזמינות תגובה סבירה.',
      allowed_proof_he: 'אחד משני הערכים בלבד: within_15_min או same_day, או fail אם לא ידוע.',
      unlocks_he: 'פותח בדיקת תנאי תשלום ו-lead-fee.',
      blocked_if_he: 'זמינות לא ידועה או לא מתאימה לתיקים פליליים דחופים.',
    },
    {
      id: 'CJ-OWNER-ACTION-05',
      order: 5,
      title_he: 'לאשר תנאי lead-fee ונתיב חשבונית ידני',
      owner_action_he: 'לתעד שהמועמד מקבל תנאי ליד/מנוי או מסלול חשבונית ידנית, כולל סכום מוסכם מעל 0 ואיש קשר לחיוב במערכת הפרטית.',
      allowed_proof_he: 'מותר לרשום fee-present=yes ו-billing-contact-present=yes. לא לשמור מייל, קבלה, חשבונית או קישור תשלום.',
      unlocks_he: 'פותח בדיקת מוכנות לניתוב מבוקר.',
      blocked_if_he: 'אין תנאי תשלום, אין סכום מוסכם, או אין איש קשר לחיוב.',
    },
    {
      id: 'CJ-OWNER-ACTION-06',
      order: 6,
      title_he: 'להחליט אם מכינים כרטיס ציבורי בנפרד',
      owner_action_he: 'רק אחרי שכל השורות הפרטיות עוברות: לקבל אישור נפרד להכנת כרטיס/פרופיל ציבורי או להשאיר את המסלול חונה.',
      allowed_proof_he: 'החלטה בלבד: prepare_public_review / keep_private / park / reject.',
      unlocks_he: 'פותח בדיקת כיסוי חוזרת לספריית פלילי+ירושלים.',
      blocked_if_he: 'אין אישור בעלים נפרד לפרסום או אין ראיות מלאות.',
    },
  ];
}

function buildOwnerRows(actions) {
  return actions.map((action) => ({
    action_id: action.id,
    title_he: action.title_he,
    private_admin_pointer_no_pii: '',
    status: 'not_started',
    accepted_status_values: 'pass / partial / fail / not_available / needs_owner / park',
    owner_verified_yes_no: 'no',
    proof_present_yes_no: 'no',
    no_pii_confirmed_yes_no: 'yes',
    public_profile_action_approved: 'no',
    outreach_or_contact_approved: 'no',
    invoice_or_payment_approved: 'no',
    owner_note_no_pii: '',
  }));
}

function buildGates({ activationPacket, commandCenter }) {
  const topIds = new Set((commandCenter.rows || []).filter((row) => row.rank <= 3).map((row) => row.id));
  const source = activationPacket.sourceSummary || {};
  return [
    {
      id: 'CJ-SHEET-GATE-01',
      gate: 'source_activation_packet_ready',
      status: statusOf(activationPacket) === 'CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION' ? 'PASS' : 'REVIEW',
      evidence: `Activation packet: ${statusOf(activationPacket)}.`,
      next_action: 'Use this sheet as the owner-facing layer before any private prospect entry.',
    },
    {
      id: 'CJ-SHEET-GATE-02',
      gate: 'exact_coverage_gap_confirmed',
      status: Number(source.exactCardCount ?? -1) === 0 && Number(source.areaOnlyCardCount ?? -1) === 0 ? 'PASS' : 'REVIEW',
      evidence: `Exact criminal+Jerusalem cards: ${source.exactCardCount ?? 'unknown'}; area-only criminal cards: ${source.areaOnlyCardCount ?? 'unknown'}; city-only Jerusalem cards: ${source.cityOnlyCardCount ?? 'unknown'}.`,
      next_action: 'Treat this as a supplier-coverage blocker, not as approval to edit public content.',
    },
    {
      id: 'CJ-SHEET-GATE-03',
      gate: 'coverage_is_top_revenue_goal',
      status: topIds.has('UNBLOCK-08') ? 'PASS' : 'REVIEW',
      evidence: `Top command-center rows: ${[...topIds].join(', ')}.`,
      next_action: 'Keep supplier coverage visible as the third revenue blocker after BTL and lawyer subscription proof.',
    },
    {
      id: 'CJ-SHEET-GATE-04',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This sheet approves 0 public profiles, CRM writes, outreach, lead routing, invoices, payments, emails, WhatsApp/TalkTo, SEO edits or uPress actions.',
      next_action: 'Owner/admin fills sanitized status rows first; public profile review requires a separate approval.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, actions, gates, files }) {
  return [
    `# דף פעולה לבעלים: כיסוי עורך דין פלילי בירושלים - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    `מקור: criminal-jerusalem-lawyer-coverage-activation-packet-${sourceDate}`,
    '',
    'מטרה: להפוך חסם כיסוי בספריית פלילי+ירושלים לפעולת ספק פרטית וברורה, בלי לפרסם כרטיס, בלי לפנות לעורך דין, ובלי ליצור חיוב לא מאושר.',
    '',
    '## מצב רווחיות',
    '',
    '- הכנה סטטית: 65%.',
    '- הוכחת ספק חי: 0% עד שהבעלים ממלא ראיות פרטיות.',
    '- הכנסה נספרת רק אחרי תנאי lead-fee, ליד מבוקר ותשלום/חשבונית עם ראיה פרטית. הדף הזה עדיין לא מאפשר חיוב.',
    '',
    '## מה למלא',
    '',
    '| סדר | פעולה | מה הבעלים עושה במערכת הפרטית | מה מותר לרשום בקובץ | מה זה פותח | חסום אם |',
    '| ---: | --- | --- | --- | --- | --- |',
    ...actions.map(
      (action) =>
        `| ${action.order} | ${mdCell(action.title_he)} | ${mdCell(action.owner_action_he)} | ${mdCell(action.allowed_proof_he)} | ${mdCell(action.unlocks_he)} | ${mdCell(action.blocked_if_he)} |`,
    ),
    '',
    '## איך למסור לקודקס בלי לחשוף מידע פרטי',
    '',
    `1. מלאו את הקובץ: \`${files.ownerFillCsv}\`.`,
    '2. השתמשו רק בערכים: pass / partial / fail / not_available / needs_owner / park.',
    '3. אל תכניסו שמות, טלפונים, מיילים, URLs פרטיים, קבלות, חשבוניות, הודעות או מסמכים.',
    '4. גם אם כל השורות עוברות, פרופיל ציבורי או פנייה דורשים אישור נפרד.',
    '',
    '## בדיקות בטיחות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## מה לא אעשה בלי אישור מפורש',
    '',
    'לא אצור כרטיס ציבורי, לא אפנה לעורך דין, לא אשחרר ליד, לא אפיק חשבונית, לא אבצע תשלום, לא אשנה SEO, לא אפרסם תוכן ולא אמשוך uPress מתוך הדף הזה.',
    '',
  ].join('\n');
}

function buildHtml({ reportDate, status, actions, gates, files }) {
  const actionRows = actions
    .map(
      (action) => `<tr>
        <td>${htmlEscape(action.order)}</td>
        <td><strong>${htmlEscape(action.title_he)}</strong></td>
        <td>${htmlEscape(action.owner_action_he)}</td>
        <td>${htmlEscape(action.allowed_proof_he)}</td>
        <td>${htmlEscape(action.unlocks_he)}</td>
        <td>${htmlEscape(action.blocked_if_he)}</td>
      </tr>`,
    )
    .join('\n');
  const gateRows = gates
    .map(
      (gate) => `<tr>
        <td><strong>${htmlEscape(gate.id)}</strong></td>
        <td>${htmlEscape(gate.gate)}</td>
        <td><span class="status">${htmlEscape(gate.status)}</span></td>
        <td>${htmlEscape(gate.evidence)}</td>
      </tr>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>כיסוי עורך דין פלילי בירושלים - ${htmlEscape(reportDate)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #172033;
      --muted: #5f6b7f;
      --line: #d9deea;
      --panel: #ffffff;
      --soft: #f5f7fb;
      --accent: #1967d2;
      --accent-soft: #e8f0fe;
      --warn: #8a4b00;
      --warn-soft: #fff4df;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--soft);
      color: var(--ink);
      font-family: Arial, "Noto Sans Hebrew", "Segoe UI", sans-serif;
      line-height: 1.6;
    }
    main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 44px; }
    header, section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; margin-bottom: 18px; }
    header { display: grid; gap: 14px; padding: 24px; }
    section { overflow: hidden; }
    .section-head { padding: 18px 20px; border-bottom: 1px solid var(--line); }
    h1, h2, p { margin: 0; letter-spacing: 0; }
    h1 { font-size: clamp(1.8rem, 2.5vw, 2.55rem); line-height: 1.2; }
    h2 { font-size: 1.15rem; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill, code, .status {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.88rem;
      line-height: 1.35;
      white-space: normal;
    }
    .pill { color: var(--accent); background: var(--accent-soft); border: 1px solid #c7d7f8; }
    .pill.warning, .status { color: var(--warn); background: var(--warn-soft); border: 1px solid #f5d08b; }
    code {
      direction: ltr;
      color: #12315c;
      background: #eef3fb;
      border: 1px solid #ced9ef;
      font-family: Consolas, "Courier New", monospace;
    }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; min-width: 860px; border-collapse: collapse; }
    th, td { padding: 12px 14px; border-bottom: 1px solid var(--line); text-align: right; vertical-align: top; }
    th { color: var(--muted); background: #fafbfe; white-space: nowrap; }
    tr:last-child td { border-bottom: 0; }
    .notice { padding: 18px 20px; color: var(--muted); }
    @media (max-width: 760px) {
      main { width: min(100% - 20px, 1180px); padding-top: 16px; }
      header { padding: 18px; }
      table { min-width: 760px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>כיסוי עורך דין פלילי בירושלים</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill warning">פעולה חיה: 0 עד אישור בעלים</span>
      </div>
      <p>דף פעולה לבעלים/מנהל: איך להפוך חסר כיסוי בספרייה למועמד ספק פרטי, בלי לפרסם ובלי לפנות.</p>
    </header>
    <section>
      <div class="section-head"><h2>סדר פעולות</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>סדר</th><th>פעולה</th><th>מה עושים פרטי</th><th>מה מותר לרשום</th><th>פותח</th><th>חסום אם</th></tr></thead>
          <tbody>${actionRows}</tbody>
        </table>
      </div>
    </section>
    <section>
      <div class="section-head"><h2>מסירה לקודקס</h2></div>
      <div class="notice">
        <p>ממלאים את <code>${htmlEscape(files.ownerFillCsv)}</code> עם סטטוסים בלבד. לא מכניסים פרטי קשר, שמות, קבלות או תוכן פרטי.</p>
      </div>
    </section>
    <section>
      <div class="section-head"><h2>בדיקות בטיחות</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>מזהה</th><th>בדיקה</th><th>סטטוס</th><th>ראיה</th></tr></thead>
          <tbody>${gateRows}</tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-criminal-jerusalem-owner-coverage-action-sheet.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const activationPacket = readJson(sources.activationPacket);
  const commandCenter = readJson(sources.commandCenter);
  const outputs = outputFiles(args.reportDate);
  const actions = buildActions();
  const ownerRows = buildOwnerRows(actions);
  const gates = buildGates({ activationPacket, commandCenter });
  const status = 'CRIMINAL_JERUSALEM_OWNER_COVERAGE_ACTION_SHEET_READY_NO_LIVE_ACTION';
  const files = Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)]));
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    actionRows: actions.length,
    ownerFillRows: ownerRows.length,
    passGateCount: gates.filter((gate) => gate.status.startsWith('PASS')).length,
    reviewGateCount: gates.filter((gate) => gate.status === 'REVIEW').length,
    supplierCoverageProofPercent: 0,
    staticPreparationPercent: 65,
    revenueCanBeClaimed: false,
    publicProfileApproved: false,
    wpAdminWritesApproved: 0,
    crmRecordsCreated: 0,
    lawyerProfilesCreated: 0,
    outreachOrContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    publicChangesApproved: 0,
    seoSettingsChanged: 0,
    upressDeploymentRequired: false,
    sourceStatuses: {
      activationPacket: statusOf(activationPacket),
      commandCenter: statusOf(commandCenter),
    },
    files,
  };

  const actionColumns = ['id', 'order', 'title_he', 'owner_action_he', 'allowed_proof_he', 'unlocks_he', 'blocked_if_he'];
  const ownerColumns = [
    'action_id',
    'title_he',
    'private_admin_pointer_no_pii',
    'status',
    'accepted_status_values',
    'owner_verified_yes_no',
    'proof_present_yes_no',
    'no_pii_confirmed_yes_no',
    'public_profile_action_approved',
    'outreach_or_contact_approved',
    'invoice_or_payment_approved',
    'owner_note_no_pii',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'actionRows',
    'ownerFillRows',
    'supplierCoverageProofPercent',
    'staticPreparationPercent',
    'revenueCanBeClaimed',
    'publicProfileApproved',
    'wpAdminWritesApproved',
    'crmRecordsCreated',
    'lawyerProfilesCreated',
    'outreachOrContactActions',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
    'publicChangesApproved',
    'seoSettingsChanged',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, actions, gates, files }));
  writeText(outputs.projectHtml, buildHtml({ reportDate: args.reportDate, status, actions, gates, files }));
  writeText(outputs.projectCsv, toCsv(actions, actionColumns));
  writeText(outputs.ownerFillCsv, toCsv(ownerRows, ownerColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gates, actions, ownerRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
