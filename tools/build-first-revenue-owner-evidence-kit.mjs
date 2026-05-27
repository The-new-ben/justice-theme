import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;

const SOURCES = [
  {
    lane: 'btl_first_paid_lead',
    unblockId: 'UNBLOCK-01',
    titleHe: 'ביטוח לאומי: ליד ראשון בתשלום',
    reportBase: 'btl-owner-first-paid-lead-action-sheet',
    ownerActionHe: 'למלא ראיות פרטיות לשלושה מומחים, ליד אחד עם הסכמה, billing והוכחת תשלום פרטית.',
  },
  {
    lane: 'lawyer_subscription_paid_test',
    unblockId: 'UNBLOCK-02',
    titleHe: 'מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית',
    reportBase: 'lawyer-subscription-owner-paid-test-action-sheet',
    ownerActionHe: 'לאשר זהות בדיקה, נתיב תשלום, הרשמה/דשבורד, בקשות שירות וראיית חשבונית או תשלום.',
  },
  {
    lane: 'criminal_jerusalem_supplier_coverage',
    unblockId: 'UNBLOCK-08',
    titleHe: 'ספק פלילי בירושלים: כיסוי פרטי לפני פרסום',
    reportBase: 'criminal-jerusalem-owner-coverage-action-sheet',
    ownerActionHe: 'לבחור מועמד פרטי, לאמת רישיון/תחום/זמינות/תנאי fee, ולהחליט אם מכינים פרופיל ציבורי בנפרד.',
  },
];

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
  const base = `first-revenue-owner-evidence-kit-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerReplyCsv: path.join(ROOT, '.project-control', `first-revenue-owner-evidence-kit-owner-reply-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceReportPath(sourceDate, base) {
  return path.join(ROOT, '.reports', `${base}-${sourceDate}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function normalizeSourceFiles(files = {}) {
  return Object.fromEntries(Object.entries(files).map(([key, value]) => [key, String(value || '').replace(/\\/g, '/')]));
}

function buildLaneRows({ source, report }) {
  const summary = report.summary || {};
  const files = normalizeSourceFiles(summary.files || {});
  return {
    lane: source.lane,
    unblock_id: source.unblockId,
    title_he: source.titleHe,
    source_status: statusOf(report),
    static_preparation_percent: summary.staticPreparationPercent ?? 0,
    live_profit_proof_percent: summary.liveProfitProofPercent ?? summary.supplierCoverageProofPercent ?? 0,
    revenue_can_be_claimed: summary.revenueCanBeClaimed ? 'yes' : 'no',
    owner_fill_rows: summary.ownerFillRows ?? 0,
    owner_action_he: source.ownerActionHe,
    owner_fill_csv: files.ownerFillCsv || '',
    action_sheet_html: files.projectHtml || '',
    blocker_he: 'חסר מילוי בעלים/מנהל עם ראיות פרטיות ללא PII.',
    next_after_fill_he: 'קודקס יכול לבדוק סטטוסים מסוננים בלבד ולהחזיר pass/blocked בלי לבצע פעולה חיה.',
  };
}

function buildCombinedRows(reportsByLane) {
  return SOURCES.flatMap((source) => {
    const report = reportsByLane[source.lane];
    return (report.ownerRows || []).map((row, index) => ({
      lane: source.lane,
      unblock_id: source.unblockId,
      sequence: index + 1,
      action_id: row.action_id || row.id || '',
      title_he: row.title_he || '',
      private_admin_pointer_no_pii: '',
      status: 'not_started',
      owner_verified_yes_no: 'no',
      proof_present_yes_no: 'no',
      no_pii_confirmed_yes_no: 'yes',
      live_or_public_action_approved: 'no',
      owner_note_no_pii: '',
    }));
  });
}

function buildOwnerReplyRows(laneRows) {
  return laneRows.map((row) => ({
    unblock_id: row.unblock_id,
    lane: row.lane,
    owner_decision: '',
    accepted_values: 'approve_fill / park / reject / needs_more_evidence',
    first_private_evidence_location_no_pii: '',
    live_action_approved: 'no',
    public_action_approved: 'no',
    payment_or_invoice_approved: 'no',
    owner_note_no_pii: '',
  }));
}

function buildGates({ commandCenter, laneRows }) {
  const topIds = (commandCenter.rows || []).filter((row) => row.rank <= 3).map((row) => row.id);
  const allSourcesReady = laneRows.every((row) => row.source_status.endsWith('READY_NO_LIVE_ACTION'));
  const noRevenueClaims = laneRows.every((row) => row.revenue_can_be_claimed === 'no' && Number(row.live_profit_proof_percent) === 0);
  return [
    {
      id: 'FRK-GATE-01',
      gate: 'top_three_sources_available',
      status: allSourcesReady ? 'PASS' : 'REVIEW',
      evidence: laneRows.map((row) => `${row.unblock_id}:${row.source_status}`).join(' | '),
      next_action: 'Use the kit as one owner-facing evidence intake surface.',
    },
    {
      id: 'FRK-GATE-02',
      gate: 'command_center_top_three_aligned',
      status: ['UNBLOCK-01', 'UNBLOCK-02', 'UNBLOCK-08'].every((id) => topIds.includes(id)) ? 'PASS' : 'REVIEW',
      evidence: `Top command-center rows: ${topIds.join(', ')}.`,
      next_action: 'Keep BTL, lawyer subscription and criminal Jerusalem supplier coverage as the first screen.',
    },
    {
      id: 'FRK-GATE-03',
      gate: 'revenue_not_claimable_yet',
      status: noRevenueClaims ? 'PASS' : 'BLOCKED',
      evidence: laneRows.map((row) => `${row.unblock_id}: live proof ${row.live_profit_proof_percent}%, revenue ${row.revenue_can_be_claimed}`).join(' | '),
      next_action: 'Do not claim revenue until private payment/proof rows pass.',
    },
    {
      id: 'FRK-GATE-04',
      gate: 'no_live_action_authorized',
      status: 'PASS_NO_LIVE_ACTION',
      evidence: 'This kit approves 0 CMS edits, CRM writes, outreach, supplier/lawyer/client contact, invoices, payments, email, WhatsApp/TalkTo, SEO changes or uPress actions.',
      next_action: 'Owner/admin fills private status rows first; every live action needs separate approval.',
    },
  ];
}

function buildMarkdown({ reportDate, status, laneRows, combinedRows, ownerReplyRows, gates }) {
  return [
    `# ערכת ראיות בעלים להכנסה ראשונה - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    '',
    'מטרה: לרכז את שלושת מסלולי ההכנסה הראשונים לערכת מילוי אחת. הערכה לא מפרסמת, לא פונה, לא מחייבת ולא יוצרת רשומות. היא רק אומרת לבעלים מה למלא במערכות הפרטיות כדי שקודקס יוכל לבדוק pass/blocked.',
    '',
    '## תמונת מצב',
    '',
    '| יעד | מוכנות סטטית | הוכחת רווח חי | אפשר לספור הכנסה | קובץ מילוי | דף פעולה |',
    '| --- | ---: | ---: | --- | --- | --- |',
    ...laneRows.map(
      (row) =>
        `| ${mdCell(row.title_he)} | ${row.static_preparation_percent}% | ${row.live_profit_proof_percent}% | ${row.revenue_can_be_claimed} | ${mdCell(row.owner_fill_csv)} | ${mdCell(row.action_sheet_html)} |`,
    ),
    '',
    '## שלושת הצעדים עכשיו',
    '',
    '1. למלא קודם את ביטוח לאומי אם קיימות ראיות פרטיות לשלושה מומחים וליד עם הסכמה.',
    '2. למלא את מנוי עורך דין אם קיימת זהות בדיקה ונתיב תשלום/חשבונית מאושר.',
    '3. למלא את כיסוי פלילי ירושלים אם יש מועמד ספק אמיתי שאפשר לאמת בלי לפרסם ובלי לפנות.',
    '',
    '## שורות מילוי מאוחדות',
    '',
    '| מסלול | מזהה | פעולה | סטטוס התחלתי | אישור בעלים | ראיה קיימת | אסור פעולה חיה |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...combinedRows.map(
      (row) =>
        `| ${mdCell(row.unblock_id)} | ${mdCell(row.action_id)} | ${mdCell(row.title_he)} | ${row.status} | ${row.owner_verified_yes_no} | ${row.proof_present_yes_no} | ${row.live_or_public_action_approved} |`,
    ),
    '',
    '## תשובת בעלים קצרה',
    '',
    '| יעד | החלטה | מקום ראיה פרטי ללא PII | פעולה חיה מאושרת | תשלום/חשבונית מאושרים |',
    '| --- | --- | --- | --- | --- |',
    ...ownerReplyRows.map(
      (row) =>
        `| ${mdCell(row.unblock_id)} | ${mdCell(row.accepted_values)} | ${mdCell(row.first_private_evidence_location_no_pii)} | ${row.live_action_approved} | ${row.payment_or_invoice_approved} |`,
    ),
    '',
    '## בדיקות בטיחות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## הצהרת כנות',
    '',
    'הערכה הזו לא מייצרת כסף בעצמה. היא מקצרת את הדרך לראיות: supply, consent, billing ו-payment proof. בלי מילוי בעלים/מנהל ובלי הוכחת תשלום פרטית, ההכנסה נשארת 0.',
    '',
  ].join('\n');
}

function buildHtml({ reportDate, status, laneRows, combinedRows, gates }) {
  const laneCards = laneRows
    .map(
      (row) => `<article class="card">
        <div class="card-meta"><span>${htmlEscape(row.unblock_id)}</span><span>${htmlEscape(row.lane)}</span></div>
        <h2>${htmlEscape(row.title_he)}</h2>
        <p>${htmlEscape(row.owner_action_he)}</p>
        <dl>
          <dt>מוכנות סטטית</dt><dd>${htmlEscape(row.static_preparation_percent)}%</dd>
          <dt>הוכחת רווח חי</dt><dd>${htmlEscape(row.live_profit_proof_percent)}%</dd>
          <dt>קובץ מילוי</dt><dd><code>${htmlEscape(row.owner_fill_csv)}</code></dd>
          <dt>דף פעולה</dt><dd><code>${htmlEscape(row.action_sheet_html)}</code></dd>
        </dl>
      </article>`,
    )
    .join('\n');
  const combinedTable = combinedRows
    .map(
      (row) => `<tr>
        <td><strong>${htmlEscape(row.unblock_id)}</strong></td>
        <td>${htmlEscape(row.action_id)}</td>
        <td>${htmlEscape(row.title_he)}</td>
        <td>${htmlEscape(row.status)}</td>
        <td>${htmlEscape(row.owner_verified_yes_no)}</td>
        <td>${htmlEscape(row.proof_present_yes_no)}</td>
        <td>${htmlEscape(row.live_or_public_action_approved)}</td>
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
  <title>ערכת ראיות בעלים להכנסה ראשונה - ${htmlEscape(reportDate)}</title>
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
    header, .card, section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
    header { display: grid; gap: 14px; padding: 24px; margin-bottom: 18px; }
    h1, h2, p { margin: 0; letter-spacing: 0; }
    h1 { font-size: clamp(1.8rem, 2.5vw, 2.55rem); line-height: 1.2; }
    h2 { font-size: 1.15rem; }
    .meta, .card-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
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
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
    .card { display: grid; gap: 12px; padding: 18px; }
    .card-meta { justify-content: space-between; color: var(--muted); font-size: 0.9rem; }
    dl { display: grid; gap: 6px; margin: 0; }
    dt { color: var(--muted); font-weight: 700; }
    dd { margin: 0 0 6px; }
    section { margin-top: 18px; overflow: hidden; }
    .section-head { padding: 18px 20px; border-bottom: 1px solid var(--line); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; min-width: 860px; border-collapse: collapse; }
    th, td { padding: 12px 14px; border-bottom: 1px solid var(--line); text-align: right; vertical-align: top; }
    th { color: var(--muted); background: #fafbfe; white-space: nowrap; }
    tr:last-child td { border-bottom: 0; }
    @media (max-width: 860px) {
      .grid { grid-template-columns: 1fr; }
      main { width: min(100% - 20px, 1180px); padding-top: 16px; }
      header { padding: 18px; }
      table { min-width: 760px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>ערכת ראיות בעלים להכנסה ראשונה</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill warning">רווח חי: 0% עד ראיות פרטיות</span>
      </div>
      <p>מסך אחד שמרכז את שלושת מסלולי ההכנסה הראשונים ואת קבצי המילוי שלהם. אין כאן פרסום, פנייה, חשבונית או תשלום.</p>
    </header>
    <div class="grid">${laneCards}</div>
    <section>
      <div class="section-head"><h2>שורות מילוי מאוחדות</h2></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>יעד</th><th>מזהה</th><th>פעולה</th><th>סטטוס</th><th>אישור בעלים</th><th>ראיה</th><th>פעולה חיה</th></tr></thead>
          <tbody>${combinedTable}</tbody>
        </table>
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
    console.log('Usage: node tools/build-first-revenue-owner-evidence-kit.mjs --reportDate=YYYY-MM-DD --sourceDate=YYYY-MM-DD');
    return;
  }

  const outputs = outputFiles(args.reportDate);
  const reportsByLane = Object.fromEntries(
    SOURCES.map((source) => [source.lane, readJson(sourceReportPath(args.sourceDate, source.reportBase))]),
  );
  const commandCenter = readJson(path.join(ROOT, '.reports', `owner-unblocker-command-center-${args.sourceDate}.json`));
  const laneRows = SOURCES.map((source) => buildLaneRows({ source, report: reportsByLane[source.lane] }));
  const combinedRows = buildCombinedRows(reportsByLane);
  const ownerReplyRows = buildOwnerReplyRows(laneRows);
  const gates = buildGates({ commandCenter, laneRows });
  const status = 'FIRST_REVENUE_OWNER_EVIDENCE_KIT_READY_NO_LIVE_ACTION';
  const staticAverage = Math.round(
    laneRows.reduce((sum, row) => sum + Number(row.static_preparation_percent || 0), 0) / Math.max(laneRows.length, 1),
  );
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    laneCount: laneRows.length,
    combinedOwnerFillRows: combinedRows.length,
    ownerReplyRows: ownerReplyRows.length,
    staticPreparationAveragePercent: staticAverage,
    liveProfitProofPercent: 0,
    readinessToProfitPercent: 40,
    revenueCanBeClaimed: false,
    wpAdminWritesApproved: 0,
    crmRecordsCreated: 0,
    leadLawyerSupplierContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsOrMessagesSent: 0,
    publicChangesApproved: 0,
    seoSettingsChanged: 0,
    upressDeploymentRequired: false,
    files: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, relativePath(value)])),
  };

  const laneColumns = [
    'lane',
    'unblock_id',
    'title_he',
    'source_status',
    'static_preparation_percent',
    'live_profit_proof_percent',
    'revenue_can_be_claimed',
    'owner_fill_rows',
    'owner_action_he',
    'owner_fill_csv',
    'action_sheet_html',
    'blocker_he',
    'next_after_fill_he',
  ];
  const combinedColumns = [
    'lane',
    'unblock_id',
    'sequence',
    'action_id',
    'title_he',
    'private_admin_pointer_no_pii',
    'status',
    'owner_verified_yes_no',
    'proof_present_yes_no',
    'no_pii_confirmed_yes_no',
    'live_or_public_action_approved',
    'owner_note_no_pii',
  ];
  const ownerReplyColumns = [
    'unblock_id',
    'lane',
    'owner_decision',
    'accepted_values',
    'first_private_evidence_location_no_pii',
    'live_action_approved',
    'public_action_approved',
    'payment_or_invoice_approved',
    'owner_note_no_pii',
  ];
  const summaryColumns = [
    'reportDate',
    'sourceDate',
    'status',
    'laneCount',
    'combinedOwnerFillRows',
    'staticPreparationAveragePercent',
    'liveProfitProofPercent',
    'readinessToProfitPercent',
    'revenueCanBeClaimed',
    'wpAdminWritesApproved',
    'crmRecordsCreated',
    'leadLawyerSupplierContactActions',
    'invoicesOrPaymentsCreated',
    'emailsOrMessagesSent',
    'publicChangesApproved',
    'seoSettingsChanged',
    'upressDeploymentRequired',
  ];

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, status, laneRows, combinedRows, ownerReplyRows, gates }));
  writeText(outputs.projectHtml, buildHtml({ reportDate: args.reportDate, status, laneRows, combinedRows, gates }));
  writeText(outputs.projectCsv, toCsv([...laneRows, ...combinedRows], [...new Set([...laneColumns, ...combinedColumns])]));
  writeText(outputs.ownerReplyCsv, toCsv(ownerReplyRows, ownerReplyColumns));
  writeText(outputs.reportJson, `${JSON.stringify({ summary, gates, laneRows, combinedRows, ownerReplyRows }, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv([summary], summaryColumns));

  console.log(JSON.stringify(summary, null, 2));
}

main();
