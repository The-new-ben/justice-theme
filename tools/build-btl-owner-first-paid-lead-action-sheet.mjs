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
  const base = `btl-owner-first-paid-lead-action-sheet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerFillCsv: path.join(ROOT, '.project-control', `btl-owner-first-paid-lead-owner-fill-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    sourcePacket: path.join(ROOT, '.reports', `btl-source-readiness-admin-fill-packet-${sourceDate}.json`),
    operatorCommand: path.join(ROOT, '.reports', `btl-first-revenue-operator-command-${sourceDate}.json`),
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
      id: 'BTL-ACTION-01',
      order: 1,
      title_he: 'לאמת שלושה מומחי ביטוח לאומי פרטיים',
      owner_action_he: 'בתוך wp-admin/CRM פרטי: לסמן שלושה ספקים שמטפלים בערעורי ביטוח לאומי, עם רישיון/סטטוס, התאמת תחום, זמינות תגובה, נתיב תשלום, תנאי lead-fee ואיש קשר לחיוב.',
      allowed_proof_he: 'מותר לרשום בקובץ רק מצביע לא מזהה כמו admin-row-1, סטטוס pass/partial/fail, והאם הבעלים אימת. לא שמות, טלפונים, מיילים או קישורי תשלום.',
      unlocks_he: 'פותח בדיקת כיסוי לספקים routable.',
      blocked_if_he: 'פחות משלושה ספקים פרטיים מאומתים.',
    },
    {
      id: 'BTL-ACTION-02',
      order: 2,
      title_he: 'להפוך את השלושה לכיסוי ניתן לניתוב',
      owner_action_he: 'לוודא שלשלושת הספקים יש routing enabled, סטטוס שמותר להשתמש בו, ואימייל/איש קשר לחיוב במערכת הפרטית.',
      allowed_proof_he: 'רק כן/לא/חלקי ומצביע לא מזהה לכרטיס/רשומה פנימית.',
      unlocks_he: 'פותח בחירת ליד מבוקר אחד.',
      blocked_if_he: 'אין שלושה ספקים routable עם פרטי חיוב/קשר.',
    },
    {
      id: 'BTL-ACTION-03',
      order: 3,
      title_he: 'לבחור ליד ביטוח לאומי אחד עם הסכמה',
      owner_action_he: 'לבחור ליד עדכני בנושא ביטוח לאומי שיש לו explicit match consent או owner verified consent, ולשחרר routing hold רק אם הבעלים מאשר.',
      allowed_proof_he: 'בקובץ מותר לרשום רק controlled-lead-1 ללא שם/טלפון/צאט/מסמכים.',
      unlocks_he: 'פותח העברה מבוקרת לספק ויצירת מצב billable.',
      blocked_if_he: 'אין הסכמה, אין התאמת ביטוח לאומי, או אין שחרור בעלים.',
    },
    {
      id: 'BTL-ACTION-04',
      order: 4,
      title_he: 'ליצור מצב חיוב לליד מוסמך',
      owner_action_he: 'אחרי העברה מבוקרת בלבד: לסמן ready_to_bill או invoice_sent, לקשר עורך דין מחויב, ולהשאיר מחיר מומלץ מעל 0.',
      allowed_proof_he: 'מותר לציין invoice/reference פנימי לא מזהה. חשבונית או reference אינם הוכחת תשלום.',
      unlocks_he: 'פותח בדיקת הוכחת תשלום.',
      blocked_if_he: 'אין ליד billable, אין עורך דין מחויב, או המחיר/חשבונית חסרים.',
    },
    {
      id: 'BTL-ACTION-05',
      order: 5,
      title_he: 'לאשר תשלום רק עם הוכחה פרטית',
      owner_action_he: 'לסמן paid רק אם קיימת הוכחת תשלום פרטית במערכת התשלום/ניהול, ולא בקובץ הריפו.',
      allowed_proof_he: 'בקובץ מותר לכתוב payment-proof-present=yes בלבד. לא להדביק קבלה, קישור תשלום או URL פרטי.',
      unlocks_he: 'מאפשר לספור ליד ביטוח לאומי ראשון בתשלום.',
      blocked_if_he: 'יש רק חשבונית, reference או הבטחת תשלום, בלי הוכחת תשלום פרטית.',
    },
    {
      id: 'BTL-ACTION-06',
      order: 6,
      title_he: 'לקבל החלטת scale/fix/stop',
      owner_action_he: 'אחרי התשלום: לבדוק תלונה, החזר, הסכמה ואתיקה. רק אז להחליט אם משכפלים, מתקנים או עוצרים.',
      allowed_proof_he: 'מותר לציין החלטה בלבד: scale / fix / stop / hold.',
      unlocks_he: 'פותח מסלול הכנסה חוזר ומבוקר.',
      blocked_if_he: 'חסר תשלום, יש בעיית הסכמה/תלונה/החזר, או אין אישור בעלים להמשך.',
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
    public_or_live_action_approved: 'no',
    owner_note_no_pii: '',
  }));
}

function buildGates({ sourcePacket, operatorCommand, commandCenter }) {
  const topIds = new Set((commandCenter.rows || []).filter((row) => row.rank <= 3).map((row) => row.id));
  return [
    {
      id: 'BTL-SHEET-GATE-01',
      gate: 'source_packets_ready',
      status:
        statusOf(sourcePacket) === 'BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION' &&
        statusOf(operatorCommand) === 'BTL_FIRST_REVENUE_OPERATOR_COMMAND_READY_BLOCKED_ON_PRIVATE_EVIDENCE_NO_LIVE_ACTION'
          ? 'PASS'
          : 'REVIEW',
      evidence: `Source packet: ${statusOf(sourcePacket)}; operator: ${statusOf(operatorCommand)}.`,
      next_action: 'Use this sheet as the owner-facing action layer over the technical CSV.',
    },
    {
      id: 'BTL-SHEET-GATE-02',
      gate: 'btl_is_top_revenue_goal',
      status: topIds.has('UNBLOCK-01') ? 'PASS' : 'REVIEW',
      evidence: `Top command-center rows: ${[...topIds].join(', ')}.`,
      next_action: 'Keep BTL first paid-lead proof as the first owner-admin action.',
    },
    {
      id: 'BTL-SHEET-GATE-03',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This sheet approves 0 CMS, CRM write, outreach, invoice, payment, email, WhatsApp/TalkTo, GSC or uPress actions.',
      next_action: 'Owner/admin fills private evidence first; Codex only reviews sanitized status rows afterward.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, actions, gates, files }) {
  return [
    `# דף פעולה לבעלים: ביטוח לאומי ליד ראשון בתשלום - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    `מקור: btl-source-readiness-admin-fill-packet-${sourceDate}`,
    '',
    'מטרה: להפוך את מסלול ביטוח לאומי מפעילות פנימית להכנסה מוכחת אחת, בלי להעתיק פרטים אישיים לריפו ובלי לבצע פנייה, חיוב או פרסום לא מאושרים.',
    '',
    '## מצב רווחיות',
    '',
    '- הכנה סטטית: 75%.',
    '- הוכחת רווח חיה: 0%.',
    '- מוכנות לרווח אחרי מילוי בעלים תקין: אפשר לעבור לבדיקת ראיות פרטית, לא לתשלום אוטומטי.',
    '- הכנסה נספרת רק אחרי הוכחת תשלום פרטית ב-PAYMENT-01.',
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
    '3. אל תכניסו שמות, טלפונים, מיילים, צילומי מסך, קבלות, קישורי תשלום, URLs פרטיים, צאטים או מסמכים.',
    '4. אם כל שורה עוברת, קודקס יכול להריץ בדיקה פרטית מסכמת בלי לבצע פעולה חיה.',
    '',
    '## בדיקות בטיחות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## מה לא אעשה בלי אישור מפורש',
    '',
    'לא אפתח ספק אמיתי, לא אפנה לעורך דין או ללקוח, לא אשחרר ליד, לא אשלח WhatsApp/TalkTo, לא אפיק חשבונית, לא אבצע חיוב, לא אסמן paid, לא אפרסם עמוד, לא אשנה SEO טכני ולא אמשוך uPress מתוך הדף הזה.',
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
  <title>ביטוח לאומי ליד ראשון בתשלום - ${htmlEscape(reportDate)}</title>
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
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 44px;
    }
    header, section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-bottom: 18px;
    }
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
    ul { margin: 0; padding-inline-start: 22px; }
    li + li { margin-top: 6px; }
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
      <h1>ביטוח לאומי: ליד ראשון בתשלום</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill warning">רווח חי: 0% עד PAYMENT-01</span>
      </div>
      <p>דף פעולה לבעלים/מנהל: מה למלא במערכת הפרטית כדי שקודקס יוכל לבדוק ראיות בלי לראות פרטים אישיים ובלי לבצע פעולה חיה.</p>
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
        <p>ממלאים את <code>${htmlEscape(files.ownerFillCsv)}</code> עם סטטוסים בלבד. לא מכניסים שמות, טלפונים, מיילים, קבלות, קישורי תשלום, צאטים או מסמכים.</p>
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
    console.log('Usage: node tools/build-btl-owner-first-paid-lead-action-sheet.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const sourcePacket = readJson(sources.sourcePacket);
  const operatorCommand = readJson(sources.operatorCommand);
  const commandCenter = readJson(sources.commandCenter);
  const outputs = outputFiles(args.reportDate);
  const actions = buildActions();
  const ownerRows = buildOwnerRows(actions);
  const gates = buildGates({ sourcePacket, operatorCommand, commandCenter });
  const status = 'BTL_OWNER_FIRST_PAID_LEAD_ACTION_SHEET_READY_NO_LIVE_ACTION';
  const files = Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)]));
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    actionRows: actions.length,
    ownerFillRows: ownerRows.length,
    passGateCount: gates.filter((gate) => gate.status.startsWith('PASS')).length,
    reviewGateCount: gates.filter((gate) => gate.status === 'REVIEW').length,
    liveProfitProofPercent: 0,
    staticPreparationPercent: 75,
    revenueCanBeClaimed: false,
    wpAdminWritesApproved: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    messagesOrEmailsSent: 0,
    publicChangesApproved: 0,
    upressDeploymentRequired: false,
    sourceStatuses: {
      sourcePacket: statusOf(sourcePacket),
      operatorCommand: statusOf(operatorCommand),
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
    'public_or_live_action_approved',
    'owner_note_no_pii',
  ];
  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action'];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'actionRows',
    'ownerFillRows',
    'liveProfitProofPercent',
    'staticPreparationPercent',
    'revenueCanBeClaimed',
    'wpAdminWritesApproved',
    'crmRecordsCreated',
    'leadOrLawyerContactActions',
    'invoicesOrPaymentsCreated',
    'messagesOrEmailsSent',
    'publicChangesApproved',
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
