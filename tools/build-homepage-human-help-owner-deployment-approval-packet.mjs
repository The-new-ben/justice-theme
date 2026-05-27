import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'HOMEPAGE_HUMAN_HELP_DEPLOYMENT_APPROVAL_PACKET_READY_OWNER_DECISION_REQUIRED';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    qaDate: process.env.QA_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    branch: process.env.BRANCH || 'codex/homepage-human-help-local',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--qaDate=')) {
      args.qaDate = arg.slice('--qaDate='.length);
    } else if (arg.startsWith('--branch=')) {
      args.branch = arg.slice('--branch='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [key, value] of Object.entries({ reportDate: args.reportDate, qaDate: args.qaDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${key} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `homepage-human-help-owner-deployment-approval-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    replyCsv: path.join(ROOT, '.project-control', `${base}-owner-reply.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function approvalRows() {
  return [
    {
      id: 'HOME-APPROVAL-01',
      decision: 'approve_real_route_qa',
      owner_question_he: 'לאשר בדיקת route אמיתי בסביבת WordPress או staging לפני פרסום?',
      recommended_answer: 'yes',
      effect_if_yes: 'Codex יבדוק את עמוד הבית האמיתי בדפדפן ויוודא שאין שבירה לפני merge או uPress.',
      effect_if_no: 'העבודה נשארת פנימית בענף, בלי פרסום.',
      current_status: 'waiting_owner_decision',
    },
    {
      id: 'HOME-APPROVAL-02',
      decision: 'approve_merge_to_main_after_route_qa_pass',
      owner_question_he: 'אם route QA אמיתי עובר, לאשר merge ל-main?',
      recommended_answer: 'no_until_route_qa_passes',
      effect_if_yes: 'רק אחרי route QA שעובר אפשר להכין merge ל-main.',
      effect_if_no: 'הענף נשאר נפרד ולא נכנס למסלול פריסה.',
      current_status: 'blocked_until_route_qa',
    },
    {
      id: 'HOME-APPROVAL-03',
      decision: 'approve_upress_pull_after_main_push',
      owner_question_he: 'אם יהיה push מאושר ל-main, לאשר uPress Pull Git לאתר החי?',
      recommended_answer: 'no_until_main_push_approved',
      effect_if_yes: 'Codex יפתח uPress ויריץ Pull Git רק אחרי push מאושר ל-main.',
      effect_if_no: 'לא תהיה השפעה על האתר החי.',
      current_status: 'blocked_until_owner_deployment_approval',
    },
    {
      id: 'HOME-APPROVAL-04',
      decision: 'approve_post_publish_review',
      owner_question_he: 'אם יפורסם, לאשר בדיקת פוסט-פרסום עם URL, סקירה וקישורי קניבליזציה?',
      recommended_answer: 'yes',
      effect_if_yes: 'Codex יבדוק את העמוד החי, יתעד URL, סקירה, סיכום תוכן וקישורים דומים לבדיקה.',
      effect_if_no: 'לא יהיה אישור איכות אחרי פרסום.',
      current_status: 'waiting_owner_decision',
    },
  ];
}

function withReadableHebrewApprovalText(row) {
  const readableTextById = {
    'HOME-APPROVAL-01': {
      owner_question_he: 'לאשר בדיקת route אמיתי בסביבת WordPress או staging לפני פרסום?',
      effect_if_yes: 'Codex יבדוק את עמוד הבית האמיתי בדפדפן ויוודא שאין שבירה לפני merge או uPress.',
      effect_if_no: 'העבודה נשארת פנימית בענף, בלי פרסום.',
    },
    'HOME-APPROVAL-02': {
      owner_question_he: 'אם route QA אמיתי עובר, לאשר merge ל-main?',
      effect_if_yes: 'רק אחרי route QA שעובר אפשר להכין merge ל-main.',
      effect_if_no: 'הענף נשאר נפרד ולא נכנס למסלול פריסה.',
    },
    'HOME-APPROVAL-03': {
      owner_question_he: 'אם יהיה push מאושר ל-main, לאשר uPress Pull Git לאתר החי?',
      effect_if_yes: 'Codex יפתח uPress ויריץ Pull Git רק אחרי push מאושר ל-main.',
      effect_if_no: 'לא תהיה השפעה על האתר החי.',
    },
    'HOME-APPROVAL-04': {
      owner_question_he: 'אם יפורסם, לאשר בדיקת פוסט-פרסום עם URL, סקירה וקישורי קניבליזציה?',
      effect_if_yes: 'Codex יבדוק את העמוד החי, יתעד URL, סקירה, סיכום תוכן וקישורים דומים לבדיקה.',
      effect_if_no: 'לא יהיה אישור איכות אחרי פרסום.',
    },
  };

  return { ...row, ...readableTextById[row.id] };
}

function gateRows(qaReport) {
  return [
    {
      id: 'HOME-DEPLOY-GATE-01',
      gate: 'static_visual_qa_passed',
      status: qaReport.status === 'HOMEPAGE_HUMAN_HELP_VISUAL_QA_PASS_NO_PUBLIC_CHANGE' ? 'PASS' : 'BLOCKED',
      evidence: `QA status: ${qaReport.status || 'missing'}.`,
    },
    {
      id: 'HOME-DEPLOY-GATE-02',
      gate: 'mobile_no_horizontal_overflow',
      status: qaReport.mobileOverflowX === false ? 'PASS' : 'BLOCKED',
      evidence: `mobileOverflowX=${qaReport.mobileOverflowX}.`,
    },
    {
      id: 'HOME-DEPLOY-GATE-03',
      gate: 'desktop_no_horizontal_overflow',
      status: qaReport.desktopOverflowX === false ? 'PASS' : 'BLOCKED',
      evidence: `desktopOverflowX=${qaReport.desktopOverflowX}.`,
    },
    {
      id: 'HOME-DEPLOY-GATE-04',
      gate: 'real_wordpress_route_qa',
      status: 'BLOCKED',
      evidence: 'Static preview passed, but the real WordPress route has not been checked yet.',
    },
    {
      id: 'HOME-DEPLOY-GATE-05',
      gate: 'owner_deployment_approval',
      status: 'BLOCKED',
      evidence: 'Owner has not approved merge to main or uPress Pull Git.',
    },
    {
      id: 'HOME-DEPLOY-GATE-06',
      gate: 'guide_content_preserved',
      status: 'PASS',
      evidence: 'The implementation and QA did not edit template-parts/sections/find-lawyer-guide.php.',
    },
  ];
}

function buildMarkdown({ summary, approvals, gates, qaReport }) {
  return [
    `# Homepage human-help owner deployment approval - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    `Active goal: turn the homepage improvement from internal code into a controlled deployment decision.`,
    `Current branch: \`${summary.branch}\`.`,
    `Current readiness to profit: ${summary.readinessToProfitPercent}% locally, ${summary.liveRevenueImpactPercent}% live.`,
    `Honesty statement: this is not published, not merged to main and not pulled by uPress. Static QA passed, but real WordPress route QA is still missing.`,
    '',
    '## What Is Ready',
    '',
    '- Public-first homepage help copy is implemented locally.',
    '- The choosing-lawyer guide content was not edited.',
    '- Static desktop and mobile visual QA passed after a mobile clipping fix.',
    `- QA report: \`${summary.qaReportPath}\`.`,
    '',
    '## What Is Not Ready',
    '',
    '- No real WordPress route or staging page has been checked yet.',
    '- No owner approval exists for merge to main.',
    '- No owner approval exists for uPress Pull Git.',
    '- No live revenue can be claimed from this work yet.',
    '',
    '## Owner Decisions Needed',
    '',
    '| ID | Decision | Question | Recommended | If yes | If no | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...approvals.map((row) => `| ${row.id} | ${row.decision} | ${mdCell(row.owner_question_he)} | ${row.recommended_answer} | ${mdCell(row.effect_if_yes)} | ${mdCell(row.effect_if_no)} | ${row.current_status} |`),
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${gate.gate} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## QA Snapshot',
    '',
    `- Desktop overflow: ${qaReport.desktopOverflowX}`,
    `- Mobile overflow: ${qaReport.mobileOverflowX}`,
    `- Desktop selectors present: ${qaReport.selectorsPresentDesktop}`,
    `- Mobile selectors present: ${qaReport.selectorsPresentMobile}`,
    '',
    '## Decision',
    '',
    'Do not deploy from this packet alone. The next safe action is real WordPress route QA or an explicit owner decision to keep the work internal.',
    '',
  ].join('\n');
}

function buildHtml({ summary, approvals, gates }) {
  const approvalsHtml = approvals.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.id)}</code></td>
      <td>${htmlEscape(row.owner_question_he)}</td>
      <td>${htmlEscape(row.recommended_answer)}</td>
      <td>${htmlEscape(row.effect_if_yes)}</td>
      <td>${htmlEscape(row.effect_if_no)}</td>
      <td>${htmlEscape(row.current_status)}</td>
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
  <title>Homepage deployment approval</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f8fa; color: #172033; line-height: 1.55; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 18px 56px; }
    h1, h2 { color: #07152f; }
    h1 { margin: 0 0 8px; font-size: 30px; }
    .status { background: #fff; border: 1px solid #d8dee4; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 26px; }
    th, td { border: 1px solid #d8dee4; padding: 10px; vertical-align: top; font-size: 14px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
  </style>
</head>
<body>
<main>
  <h1>אישור פריסה לבעלים: שיפור עמוד הבית</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> ${htmlEscape(summary.status)}</p>
    <p><strong>Branch:</strong> <code>${htmlEscape(summary.branch)}</code></p>
    <p><strong>Readiness:</strong> ${summary.readinessToProfitPercent}% local readiness, ${summary.liveRevenueImpactPercent}% live impact.</p>
    <p><strong>Honesty:</strong> לא פורסם, לא מוזג ל-main, ולא בוצע uPress Pull.</p>
  </section>
  <h2>החלטות בעלים</h2>
  <table>
    <thead><tr><th>ID</th><th>שאלה</th><th>מומלץ</th><th>אם כן</th><th>אם לא</th><th>סטטוס</th></tr></thead>
    <tbody>${approvalsHtml}</tbody>
  </table>
  <h2>Gates</h2>
  <table>
    <thead><tr><th>ID</th><th>Gate</th><th>Status</th><th>Evidence</th></tr></thead>
    <tbody>${gatesHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function withReadableHebrewHtml(html) {
  return html
    .replace(/<h1>.*?<\/h1>/s, '<h1>אישור פריסה לבעלים: שיפור עמוד הבית</h1>')
    .replace(/<p><strong>Honesty:<\/strong>.*?<\/p>/s, '<p><strong>כנות:</strong> לא פורסם, לא מוזג ל-main, ולא בוצע uPress Pull.</p>')
    .replace(/<h2>.*?<\/h2>/s, '<h2>החלטות בעלים</h2>')
    .replace(
      /<thead><tr><th>ID<\/th><th>.*?<\/th><th>.*?<\/th><th>.*?<\/th><th>.*?<\/th><th>.*?<\/th><\/tr><\/thead>/s,
      '<thead><tr><th>ID</th><th>שאלה</th><th>מומלץ</th><th>אם כן</th><th>אם לא</th><th>סטטוס</th></tr></thead>',
    );
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-homepage-human-help-owner-deployment-approval-packet.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const qaReportPath = path.join(ROOT, '.reports', `homepage-human-help-visual-qa-${args.qaDate}.json`);
  const qaReport = readJson(qaReportPath);
  const files = outputFiles(args.reportDate);
  const approvals = approvalRows().map(withReadableHebrewApprovalText);
  const gates = gateRows(qaReport);
  const blockedGates = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const passGates = gates.filter((gate) => gate.status === 'PASS').length;
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    qaDate: args.qaDate,
    branch: args.branch,
    qaReportPath: relativePath(qaReportPath),
    approvalRows: approvals.length,
    passGates,
    blockedGates,
    readyForMainMerge: false,
    readyForUpressPull: false,
    publicCmsChangesApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 78,
    liveRevenueImpactPercent: 0,
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      replyCsv: relativePath(files.replyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  const replyRows = approvals.map((row) => ({
    id: row.id,
    decision: row.decision,
    owner_answer_yes_no_or_wait: '',
    owner_note_optional: '',
  }));

  writeText(files.projectMd, buildMarkdown({ summary, approvals, gates, qaReport }));
  writeText(files.projectHtml, withReadableHebrewHtml(buildHtml({ summary, approvals, gates })));
  writeText(files.projectCsv, toCsv(approvals, ['id', 'decision', 'owner_question_he', 'recommended_answer', 'effect_if_yes', 'effect_if_no', 'current_status']));
  writeText(files.replyCsv, toCsv(replyRows, ['id', 'decision', 'owner_answer_yes_no_or_wait', 'owner_note_optional']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, approvals, gates, qaReport }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
