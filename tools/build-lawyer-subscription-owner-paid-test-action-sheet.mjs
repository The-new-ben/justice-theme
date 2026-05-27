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
  const base = `lawyer-subscription-owner-paid-test-action-sheet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerFillCsv: path.join(ROOT, '.project-control', `lawyer-subscription-owner-paid-test-owner-fill-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    reviewGate: path.join(ROOT, '.reports', `lawyer-subscription-controlled-evidence-review-gate-${sourceDate}.json`),
    walkthrough: path.join(ROOT, '.reports', `lawyer-subscription-controlled-walkthrough-${sourceDate}.json`),
    manualInvoice: path.join(ROOT, '.reports', `manual-invoice-revenue-fallback-packet-${sourceDate}.json`),
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
      id: 'LAW-SUB-ACTION-01',
      order: 1,
      title_he: 'לאשר זהות בדיקה נשלטת',
      owner_action_he: 'הבעלים בוחר alias, תיבת מייל וטלפון בדיקה שנשלטים על ידו, ומחליט אם זה dry-run או בדיקה חיה מאושרת.',
      allowed_proof_he: 'מותר לרשום alias קצר, yes/no, ומיקום ראיה פרטי. לא לשמור מייל, טלפון, סיסמה או שם אמיתי בקבצים.',
      unlocks_he: 'פותח הרשמה/דשבורד מבוקרים.',
      blocked_if_he: 'אין זהות בדיקה, אין אישור בעלים, או יש פרטים אישיים בקובץ.',
    },
    {
      id: 'LAW-SUB-ACTION-02',
      order: 2,
      title_he: 'לבחור נתיב תשלום מאושר',
      owner_action_he: 'לבחור נתיב אחד: manual_invoice, approved_payment_link, provider_link או no_charge_dry_run. Grow/Meshulam נשאר חסם אם אין KYC/מוצר/תשלום מאושרים.',
      allowed_proof_he: 'רק שם הנתיב וסטטוס מאושר/לא מאושר. לא להדביק URL תשלום, מפתחות ספק או קבלות.',
      unlocks_he: 'פותח בדיקת הרשמה ותוכנית בלי להבטיח הכנסה.',
      blocked_if_he: 'אין נתיב תשלום מאושר או אין חלופה ידנית ברורה.',
    },
    {
      id: 'LAW-SUB-ACTION-03',
      order: 3,
      title_he: 'לאשר הרשמה ופרופיל עורך דין מבוקר',
      owner_action_he: 'רק אחרי אישור: ליצור/לאמת פרופיל בדיקה פרטי, login ודשבורד עורך דין. אם זה לא חי מאושר, להשאיר כ-dry-run.',
      allowed_proof_he: 'מותר לרשום wp-admin ID או מיקום ראיה פרטי. לא לשמור סיסמאות, מיילים או טלפונים.',
      unlocks_he: 'פותח בדיקת בקשות שירות ותוכנית מנוי.',
      blocked_if_he: 'אין פרופיל, אין login, או אין אישור הרשמה חיה.',
    },
    {
      id: 'LAW-SUB-ACTION-04',
      order: 4,
      title_he: 'לבדוק בקשות שירות בדשבורד',
      owner_action_he: 'להפעיל רק במסגרת הבדיקה בקשות כמו invoice, payment_link, upgrade, downgrade, cancel או refund, ולוודא שהן נוחתות לבדיקת בעלים.',
      allowed_proof_he: 'מותר לשמור IDs של בקשות בלבד, בלי גוף הודעה רגיש.',
      unlocks_he: 'פותח הוכחת תפעול מנוי/חיוב.',
      blocked_if_he: 'בקשות לא נשמרות, או שהן יוצרות פעולה ספק/תשלום בלי אישור.',
    },
    {
      id: 'LAW-SUB-ACTION-05',
      order: 5,
      title_he: 'לקשר ליד/שירות מבוקר אם בודקים הכנסה',
      owner_action_he: 'אם בודקים ליד בתשלום או מנוי עם ליד: לבחור ליד עם הסכמה ושחרור בעלים, ולקשר אותו לעורך הדין הבדוק.',
      allowed_proof_he: 'רק lead ID וסטטוס הסכמה/hold, בלי שם לקוח, טלפון, צאט או מסמכים.',
      unlocks_he: 'פותח מצב חשבונית/תשלום שמבוסס על ערך אמיתי.',
      blocked_if_he: 'אין ליד עם הסכמה, אין שחרור בעלים, או אין עורך דין מחויב.',
    },
    {
      id: 'LAW-SUB-ACTION-06',
      order: 6,
      title_he: 'להפיק ראיית חשבונית או תשלום פרטית',
      owner_action_he: 'בנתיב manual_invoice: לרשום invoice/reference אחרי שהבעלים שולח ידנית. בנתיב paid: לספור הכנסה רק כשיש הוכחת תשלום פרטית.',
      allowed_proof_he: 'מותר לרשום reference או payment-proof-present=yes בלבד. לא להדביק חשבונית, קבלה או URL פרטי.',
      unlocks_he: 'פותח החלטת count_revenue / do_not_count / blocked.',
      blocked_if_he: 'יש רק הבטחה או invoice בלי הוכחת תשלום אם רוצים לספור הכנסה.',
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
    provider_or_payment_action_approved: 'no',
    owner_note_no_pii: '',
  }));
}

function buildGates({ reviewGate, walkthrough, manualInvoice, commandCenter }) {
  const topIds = new Set((commandCenter.rows || []).filter((row) => row.rank <= 3).map((row) => row.id));
  return [
    {
      id: 'LAW-SHEET-GATE-01',
      gate: 'source_chain_ready',
      status:
        statusOf(reviewGate) === 'LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION' &&
        statusOf(walkthrough) === 'READY_SCRIPT_WITH_RUNTIME_BLOCKERS' &&
        statusOf(manualInvoice) === 'MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION'
          ? 'PASS'
          : 'REVIEW',
      evidence: `Review: ${statusOf(reviewGate)}; walkthrough: ${statusOf(walkthrough)}; manual invoice: ${statusOf(manualInvoice)}.`,
      next_action: 'Use this sheet as the owner-facing layer before any controlled registration or payment drill.',
    },
    {
      id: 'LAW-SHEET-GATE-02',
      gate: 'subscription_is_top_revenue_goal',
      status: topIds.has('UNBLOCK-02') ? 'PASS' : 'REVIEW',
      evidence: `Top command-center rows: ${[...topIds].join(', ')}.`,
      next_action: 'Keep the controlled lawyer subscription proof visible immediately after BTL.',
    },
    {
      id: 'LAW-SHEET-GATE-03',
      gate: 'manual_invoice_boundary_preserved',
      status: manualInvoice.summary?.invoicesSent === 0 && manualInvoice.summary?.paymentsCreated === 0 ? 'PASS' : 'REVIEW',
      evidence: `Manual invoice packet records ${manualInvoice.summary?.invoicesSent ?? 'unknown'} invoices sent and ${manualInvoice.summary?.paymentsCreated ?? 'unknown'} payments created.`,
      next_action: 'Manual invoice is a fallback packet only until owner sends or approves the actual request.',
    },
    {
      id: 'LAW-SHEET-GATE-04',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This sheet approves 0 registrations, CRM writes, provider changes, invoices, payments, outreach, public edits, GSC calls or uPress actions.',
      next_action: 'Owner/admin fills sanitized status rows first; Codex reviews only the filled proof statuses afterward.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, actions, gates, files }) {
  return [
    `# דף פעולה לבעלים: בדיקת מנוי עורך דין להכנסה - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    `מקור: lawyer-subscription-controlled-evidence-review-gate-${sourceDate}`,
    '',
    'מטרה: להפוך את מסלול מנוי עורך דין מבדיקה פנימית להוכחת הכנסה או החלטת חסימה ברורה, בלי לשמור פרטים אישיים ובלי לבצע חיוב או פנייה לא מאושרים.',
    '',
    '## מצב רווחיות',
    '',
    '- הכנה סטטית: 70%.',
    '- הוכחת רווח חיה: 0%.',
    '- נתיב ידני: מוכן כמסגרת, לא כחשבונית שנשלחה.',
    '- הכנסה נספרת רק אחרי החלטת בעלים והוכחת תשלום פרטית או החלטה מפורשת של no-charge dry-run שאינה הכנסה.',
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
    '3. אל תכניסו שמות, טלפונים, מיילים, סיסמאות, URLs לתשלום, קבלות, הודעות לקוח או מסמכים.',
    '4. אם השורות עוברות, קודקס יכול להריץ סקירת ראיות פרטית ולהגיד אם אפשר להתקדם לשלב חי מאושר.',
    '',
    '## בדיקות בטיחות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## מה לא אעשה בלי אישור מפורש',
    '',
    'לא אגיש הרשמה חיה, לא אפתח משתמש אמיתי, לא אפנה לעורך דין/לקוח, לא אשלח חשבונית או לינק תשלום, לא אשנה Grow/Meshulam, לא אסמן paid, לא אפרסם עמוד ולא אמשוך uPress מתוך הדף הזה.',
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
  <title>בדיקת מנוי עורך דין להכנסה - ${htmlEscape(reportDate)}</title>
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
      <h1>בדיקת מנוי עורך דין להכנסה</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill warning">רווח חי: 0% עד תשלום/החלטה</span>
      </div>
      <p>דף פעולה לבעלים/מנהל: מה למלא כדי להפוך את מסלול המנוי מבדיקה פנימית להוכחת הכנסה או חסם ברור, בלי לחשוף מידע פרטי.</p>
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
        <p>ממלאים את <code>${htmlEscape(files.ownerFillCsv)}</code> עם סטטוסים בלבד. לא מכניסים פרטי קשר, סיסמאות, קישורי תשלום, קבלות או תוכן לקוח.</p>
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
    console.log('Usage: node tools/build-lawyer-subscription-owner-paid-test-action-sheet.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const reviewGate = readJson(sources.reviewGate);
  const walkthrough = readJson(sources.walkthrough);
  const manualInvoice = readJson(sources.manualInvoice);
  const commandCenter = readJson(sources.commandCenter);
  const outputs = outputFiles(args.reportDate);
  const actions = buildActions();
  const ownerRows = buildOwnerRows(actions);
  const gates = buildGates({ reviewGate, walkthrough, manualInvoice, commandCenter });
  const status = 'LAWYER_SUBSCRIPTION_OWNER_PAID_TEST_ACTION_SHEET_READY_NO_LIVE_ACTION';
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
    staticPreparationPercent: 70,
    revenueCanBeClaimed: false,
    manualInvoiceFallbackReady: statusOf(manualInvoice) === 'MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION',
    wpAdminWritesApproved: 0,
    crmRecordsCreated: 0,
    liveRegistrationsSubmitted: 0,
    providerActionsApproved: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    publicChangesApproved: 0,
    upressDeploymentRequired: false,
    sourceStatuses: {
      reviewGate: statusOf(reviewGate),
      walkthrough: statusOf(walkthrough),
      manualInvoice: statusOf(manualInvoice),
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
    'provider_or_payment_action_approved',
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
    'manualInvoiceFallbackReady',
    'wpAdminWritesApproved',
    'crmRecordsCreated',
    'liveRegistrationsSubmitted',
    'providerActionsApproved',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
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
