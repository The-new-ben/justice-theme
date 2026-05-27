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
  const base = `owner-unblocker-command-center-${reportDate}`;
  return {
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source report: ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
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

function pathFromRoot(relativePath) {
  return path.resolve(ROOT, relativePath);
}

function localHref(fromFile, targetRelativePath) {
  const target = pathFromRoot(targetRelativePath);
  return encodeURI(path.relative(path.dirname(fromFile), target).replace(/\\/g, '/'));
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildCommandRows(sourceReport, files) {
  return (sourceReport.rows || []).map((row) => {
    const sourceArtifact = row.source_artifact || '';
    const sourceExists = sourceArtifact ? existsSync(pathFromRoot(sourceArtifact)) : false;
    return {
      id: row.id,
      rank: row.rank,
      priority_group: row.priority_group,
      title_he: row.title_he,
      suggested_reply_he: row.suggested_reply_he,
      owner_decision_needed_he: row.owner_decision_needed_he,
      exact_next_step_he: row.exact_next_step_he,
      if_approved_he: row.if_approved_he,
      hard_no_he: row.hard_no_he,
      source_status: row.source_status,
      source_artifact: sourceArtifact,
      source_exists: sourceExists ? 'yes' : 'no',
      source_href: sourceArtifact && sourceExists ? localHref(files.projectHtml, sourceArtifact) : '',
      owner_brief_href: localHref(files.projectHtml, sourceReport.files.projectHtml),
      reply_template_href: localHref(files.projectHtml, sourceReport.files.replyTemplateCsv),
      live_action_approved: 'no',
      email_or_outreach_approved: 'no',
      payment_or_invoice_approved: 'no',
    };
  });
}

function buildGates(sourceReport, rows) {
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  const missingSources = rows.filter((row) => row.source_exists !== 'yes');
  return [
    {
      id: 'OCC-GATE-01',
      gate: 'source_hebrew_brief_ready',
      status: sourceReport.status === 'OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_READY_NO_LIVE_ACTION' ? 'PASS' : 'REVIEW',
      evidence: `Source Hebrew brief status: ${sourceReport.status || 'missing'}.`,
      next_action: 'Use the command center only as a private owner navigation layer.',
    },
    {
      id: 'OCC-GATE-02',
      gate: 'top_three_private_sources_linked',
      status:
        topRows.length === 3 &&
        topRows.some((row) => row.id === 'UNBLOCK-08') &&
        topRows.every((row) => row.source_exists === 'yes')
          ? 'PASS'
          : 'BLOCKED',
      evidence: `Top rows: ${topRows.map((row) => `${row.id}:${row.source_exists}`).join(', ')}.`,
      next_action: 'Keep the first screen focused on BTL proof, subscription walkthrough and criminal Jerusalem coverage.',
    },
    {
      id: 'OCC-GATE-03',
      gate: 'all_source_artifacts_exist',
      status: missingSources.length === 0 ? 'PASS' : 'BLOCKED',
      evidence: missingSources.length ? `Missing sources: ${missingSources.map((row) => row.id).join(', ')}.` : 'All row source artifacts exist locally.',
      next_action: 'Do not hand this to the owner if any linked source packet is missing.',
    },
    {
      id: 'OCC-GATE-04',
      gate: 'no_live_action_authorized',
      status:
        sourceReport.publicActionApproved === 0 &&
        sourceReport.liveCrmOrOutreachApproved === 0 &&
        sourceReport.paymentOrInvoiceApproved === 0 &&
        sourceReport.emailsSent === 0 &&
        sourceReport.upressDeploymentRequired === false
          ? 'PASS'
          : 'BLOCKED',
      evidence:
        'Source report keeps public, CRM/outreach, payment, email and uPress approvals disabled.',
      next_action: 'Do not publish, contact, create records, charge, email or deploy from this command center.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, gates, rows }) {
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  return [
    `# מרכז החלטות בעלים פרטי - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    `מקור: owner-unblocker-hebrew-decision-brief-${sourceDate}`,
    '',
    'מטרה: קובץ ניווט פרטי שמחבר בין החלטות הבעלים, תקציר עברי, תבנית תשובה וחבילות המקור. הוא לא מאשר פעולה ציבורית, CRM, פניה, חשבונית, תשלום, אימייל או uPress.',
    '',
    '## שלוש ההחלטות הראשונות',
    '',
    '| מזהה | עדיפות | נושא | תשובה מוצעת | מקור פרטי | הצעד הבא | אסור ללא אישור |',
    '| --- | ---: | --- | --- | --- | --- | --- |',
    ...topRows.map(
      (row) =>
        `| ${row.id} | ${row.rank} | ${mdCell(row.title_he)} | ${mdCell(row.suggested_reply_he)} | ${mdCell(row.source_artifact)} | ${mdCell(row.exact_next_step_he)} | ${mdCell(row.hard_no_he)} |`,
    ),
    '',
    '## כל השורות',
    '',
    '| מזהה | עדיפות | נושא | מקור קיים | סטטוס מקור | פעולה חיה מאושרת |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.id} | ${row.rank} | ${mdCell(row.title_he)} | ${row.source_exists} | ${mdCell(row.source_status)} | ${row.live_action_approved} |`,
    ),
    '',
    '## בדיקות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
  ].join('\n');
}

function buildHtml({ reportDate, sourceDate, status, gates, rows }) {
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  const secondaryRows = rows.filter((row) => row.priority_group !== 'top_3');
  const gateClass = (gate) => gate.status.toLowerCase();
  const topCards = topRows
    .map(
      (row) => `
        <article class="decision-card">
          <div class="card-meta">
            <span class="rank">#${htmlEscape(row.rank)}</span>
            <span>${htmlEscape(row.id)}</span>
          </div>
          <h2>${htmlEscape(row.title_he)}</h2>
          <p>${htmlEscape(row.owner_decision_needed_he)}</p>
          <div class="action-line">
            <code>${htmlEscape(row.suggested_reply_he)}</code>
            <a href="${htmlEscape(row.source_href)}">חבילת מקור</a>
          </div>
          <dl>
            <dt>הצעד הבא אחרי אישור</dt>
            <dd>${htmlEscape(row.if_approved_he)}</dd>
            <dt>אסור ללא אישור</dt>
            <dd>${htmlEscape(row.hard_no_he)}</dd>
          </dl>
        </article>`,
    )
    .join('\n');

  const secondaryTable = secondaryRows
    .map(
      (row) => `
          <tr>
            <td><strong>${htmlEscape(row.id)}</strong></td>
            <td>${htmlEscape(row.rank)}</td>
            <td>${htmlEscape(row.title_he)}</td>
            <td><a href="${htmlEscape(row.source_href)}">מקור</a></td>
            <td>${htmlEscape(row.source_status)}</td>
            <td><code>${htmlEscape(row.suggested_reply_he)}</code></td>
          </tr>`,
    )
    .join('\n');

  const gateRows = gates
    .map(
      (gate) => `
          <tr>
            <td><strong>${htmlEscape(gate.id)}</strong></td>
            <td>${htmlEscape(gate.gate)}</td>
            <td><span class="status ${htmlEscape(gateClass(gate))}">${htmlEscape(gate.status)}</span></td>
            <td>${htmlEscape(gate.evidence)}</td>
          </tr>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>מרכז החלטות בעלים פרטי - ${htmlEscape(reportDate)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #172033;
      --muted: #5f6b7f;
      --line: #d9deea;
      --panel: #ffffff;
      --soft: #f4f6fa;
      --accent: #1967d2;
      --accent-soft: #e8f0fe;
      --ok: #137333;
      --ok-soft: #e6f4ea;
      --warn: #8a4b00;
      --warn-soft: #fff4df;
      --danger: #a50e0e;
      --danger-soft: #fce8e6;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--soft);
      color: var(--ink);
      font-family: Arial, "Noto Sans Hebrew", "Segoe UI", sans-serif;
      line-height: 1.6;
    }

    main {
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 44px;
    }

    header,
    .decision-card,
    .section,
    footer {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    header {
      display: grid;
      gap: 14px;
      margin-bottom: 22px;
      padding: 24px;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
      letter-spacing: 0;
    }

    h1 {
      font-size: clamp(1.8rem, 2.5vw, 2.55rem);
      line-height: 1.2;
    }

    h2 {
      font-size: 1.2rem;
      line-height: 1.35;
    }

    p,
    dd,
    td {
      color: var(--ink);
    }

    .summary {
      max-width: 980px;
      color: var(--muted);
    }

    .meta,
    .links,
    .action-line {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .pill,
    .status,
    code,
    a {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.88rem;
      line-height: 1.35;
      text-decoration: none;
      white-space: normal;
    }

    .pill,
    a {
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid #c7d7f8;
    }

    .pill.warning {
      color: var(--warn);
      background: var(--warn-soft);
      border-color: #f5d08b;
    }

    code {
      direction: ltr;
      color: #12315c;
      background: #eef3fb;
      border: 1px solid #ced9ef;
      font-family: Consolas, "Courier New", monospace;
    }

    .decision-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 16px 0 22px;
    }

    .decision-card {
      display: grid;
      gap: 12px;
      padding: 18px;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .rank {
      color: var(--accent);
      font-weight: 700;
    }

    dl {
      display: grid;
      gap: 6px;
      margin: 0;
    }

    dt {
      color: var(--muted);
      font-weight: 700;
    }

    dd {
      margin: 0 0 6px;
    }

    .section {
      margin-top: 18px;
      overflow: hidden;
    }

    .section-head {
      padding: 18px 20px;
      border-bottom: 1px solid var(--line);
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 820px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      text-align: right;
      vertical-align: top;
    }

    th {
      color: var(--muted);
      background: #fafbfe;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .status.pass {
      color: var(--ok);
      background: var(--ok-soft);
      border: 1px solid #b7dfc0;
    }

    .status.review {
      color: var(--warn);
      background: var(--warn-soft);
      border: 1px solid #f5d08b;
    }

    .status.blocked {
      color: var(--danger);
      background: var(--danger-soft);
      border: 1px solid #f3b3ad;
    }

    footer {
      margin-top: 18px;
      padding: 16px 20px;
      color: var(--muted);
    }

    @media (max-width: 900px) {
      main {
        width: min(100% - 20px, 760px);
        padding-top: 16px;
      }

      header,
      .decision-card {
        padding: 16px;
      }

      .decision-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>מרכז החלטות בעלים פרטי</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(reportDate)}</span>
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill">מקור: owner-unblocker-hebrew-decision-brief-${htmlEscape(sourceDate)}</span>
        <span class="pill warning">ניווט פרטי בלבד - ללא פעולה חיה</span>
      </div>
      <p class="summary">קובץ זה מחבר בין ההחלטות, תקציר הבעלים, תבנית התשובה וחבילות המקור. הוא נועד לצמצם חיכוך החלטה בלבד ואינו מאשר פרסום, CRM, פניה, חשבונית, תשלום, אימייל, WhatsApp/TalkTo, wp-admin או uPress.</p>
      <div class="links">
        <a href="${htmlEscape(rows[0]?.owner_brief_href || '')}">תקציר עברי</a>
        <a href="${htmlEscape(rows[0]?.reply_template_href || '')}">תבנית תשובה</a>
      </div>
    </header>

    <section>
      <h2>שלוש החלטות ראשונות לבעלים</h2>
      <div class="decision-grid">
${topCards}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>שורות נוספות בתור</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>מזהה</th>
              <th>עדיפות</th>
              <th>נושא</th>
              <th>מקור</th>
              <th>סטטוס</th>
              <th>תשובה מוצעת</th>
            </tr>
          </thead>
          <tbody>
${secondaryTable}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>בדיקות בטיחות</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>מזהה</th>
              <th>בדיקה</th>
              <th>סטטוס</th>
              <th>ראיה</th>
            </tr>
          </thead>
          <tbody>
${gateRows}
          </tbody>
        </table>
      </div>
    </section>

    <footer>
      הצעד הבא היחיד לבעלים הוא תשובה קצרה עם מזהי שורות. כל ביצוע חי יישאר חסום עד אישור מפורש והיקף ראיות מאושר.
    </footer>
  </main>
</body>
</html>
`;
}

function printHelp() {
  console.log('Usage: node tools/build-owner-unblocker-command-center.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const sourceReport = readJson(`.reports/owner-unblocker-hebrew-decision-brief-${args.sourceDate}.json`);
  const rows = buildCommandRows(sourceReport, files);
  const gates = buildGates(sourceReport, rows);
  const blockedGateCount = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const reviewGateCount = gates.filter((gate) => gate.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'OWNER_UNBLOCKER_COMMAND_CENTER_BLOCKED_NO_LIVE_ACTION'
    : reviewGateCount
      ? 'OWNER_UNBLOCKER_COMMAND_CENTER_READY_WITH_REVIEW_NO_LIVE_ACTION'
      : 'OWNER_UNBLOCKER_COMMAND_CENTER_READY_NO_LIVE_ACTION';

  const columns = [
    'id',
    'rank',
    'priority_group',
    'title_he',
    'suggested_reply_he',
    'source_status',
    'source_artifact',
    'source_exists',
    'live_action_approved',
    'email_or_outreach_approved',
    'payment_or_invoice_approved',
  ];

  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceStatus: sourceReport.status,
    rowCount: rows.length,
    topRowCount: rows.filter((row) => row.priority_group === 'top_3').length,
    gateCount: gates.length,
    passGateCount: gates.filter((gate) => gate.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    linkedSourceCount: rows.filter((row) => row.source_exists === 'yes').length,
    liveActionApproved: 0,
    emailOrOutreachApproved: 0,
    paymentOrInvoiceApproved: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    gates,
    rows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectHtml, buildHtml({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, rows }));
  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, rows }));
  writeText(files.projectCsv, toCsv(rows, columns));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(rows, columns));

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        sourceDate: report.sourceDate,
        status: report.status,
        rowCount: report.rowCount,
        topRowCount: report.topRowCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        linkedSourceCount: report.linkedSourceCount,
        liveActionApproved: report.liveActionApproved,
        emailOrOutreachApproved: report.emailOrOutreachApproved,
        paymentOrInvoiceApproved: report.paymentOrInvoiceApproved,
        emailsSent: report.emailsSent,
        upressDeploymentRequired: report.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main();
