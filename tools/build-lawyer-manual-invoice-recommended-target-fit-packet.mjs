import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LAWYER_MANUAL_INVOICE_RECOMMENDED_TARGET_FIT_PACKET_READY_OWNER_SELECTION_REQUIRED';

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) throw new Error('--reportDate must be YYYY-MM-DD');
  return args;
}

function shortlistPath(reportDate) {
  return path.join(ROOT, '.reports', `lawyer-manual-invoice-first-target-shortlist-${reportDate}.json`);
}

function outputFiles(reportDate) {
  const base = `lawyer-manual-invoice-recommended-target-fit-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerReplyCsv: path.join(ROOT, '.project-control', `${base}-owner-reply.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
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
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
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

function fitRows(target) {
  return [
    {
      gate_id: 'FIT-01',
      phase: 'owner_selection',
      required_check: `Owner selects ${target.target_id} or explicitly overrides it.`,
      pass_condition: 'Owner selection exists in the shortlist owner reply file.',
      evidence_allowed_in_repo: 'target_id only',
      blocked_if: 'No owner target selection.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-02',
      phase: 'source_recheck',
      required_check: 'Recheck the public source and current claim language before using the target in a live conversation.',
      pass_condition: 'Current public source still supports Bituach Leumi/medical committee relevance.',
      evidence_allowed_in_repo: 'public URL and yes/no summary only',
      blocked_if: 'Source unavailable, materially changed, or no longer supports the fit.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-03',
      phase: 'license',
      required_check: 'Verify Israeli lawyer license and active status from an independent source.',
      pass_condition: 'Active license is confirmed privately.',
      evidence_allowed_in_repo: 'verified=yes/no only, no private identifiers',
      blocked_if: 'License cannot be verified.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-04',
      phase: 'practice_fit',
      required_check: 'Confirm the office is willing to handle Bituach Leumi claims, medical committees or appeal-related inquiries.',
      pass_condition: 'Fit is confirmed without overstating specialization.',
      evidence_allowed_in_repo: 'fit category only',
      blocked_if: 'No confirmed fit or claims are too broad.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-05',
      phase: 'commercial_offer',
      required_check: 'Confirm Pro 349 ILS/month including VAT is acceptable as a measured profile test, not a lead guarantee.',
      pass_condition: 'Pro 349 terms are accepted before invoice creation.',
      evidence_allowed_in_repo: 'accepted_plan=pro_349 yes/no',
      blocked_if: 'Target demands guaranteed leads, ranking or exclusivity.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-06',
      phase: 'billing',
      required_check: 'Collect billing legal name and invoice email only in private admin space.',
      pass_condition: 'Billing contact exists privately before invoice_requested/invoice_sent.',
      evidence_allowed_in_repo: 'billing_ready=yes/no only',
      blocked_if: 'No billing contact or no permission to store it.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-07',
      phase: 'message',
      required_check: 'Use the approved sales packet language and avoid promises of lead quantity, result, fixed ranking or exclusivity.',
      pass_condition: 'Owner approves exact message after target selection.',
      evidence_allowed_in_repo: 'message_approved=yes/no only',
      blocked_if: 'Message not approved.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'FIT-08',
      phase: 'activation_boundary',
      required_check: 'Profile activation only after payment proof plus content/license review.',
      pass_condition: 'Payment proof and profile review are both complete.',
      evidence_allowed_in_repo: 'paid_confirmed=yes/no only',
      blocked_if: 'Invoice only, promise to pay, unreviewed content, or unresolved dispute.',
      live_action_allowed: 'NO',
    },
  ];
}

function ownerRows(target) {
  return [
    {
      row_id: 'OWNER-FIT-01',
      decision_needed: `Approve ${target.target_id} as the first private fit-review target.`,
      recommended_answer: 'yes',
      allowed_answers: 'yes | no | wait | choose_other',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-FIT-02',
      decision_needed: 'Approve current public-source recheck before any live use.',
      recommended_answer: 'yes',
      allowed_answers: 'yes | no | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-FIT-03',
      decision_needed: 'Approve no-contact private verification only.',
      recommended_answer: 'yes',
      allowed_answers: 'yes | no | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-FIT-04',
      decision_needed: 'Keep first offer at Pro 349 ILS/month including VAT if fit passes.',
      recommended_answer: 'pro_349',
      allowed_answers: 'pro_349 | other | wait',
      owner_answer: '',
      owner_note: '',
    },
  ];
}

function buildMarkdown({ summary, target, fit, ownerRows }) {
  return [
    `# Recommended target private fit packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: prepare one owner-approved target for the first Pro manual-invoice lawyer subscription test.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% private-fit readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Recommended Target',
    '',
    `Target ID: \`${target.target_id}\``,
    `Candidate: ${target.candidate}`,
    `Public source: ${target.source_url}`,
    `Existing evidence summary: ${target.evidence_summary}`,
    `Recommended offer: ${target.recommended_offer}`,
    '',
    '## Private Fit Gates',
    '',
    '| Gate | Phase | Required check | Pass condition | Evidence allowed in repo | Blocked if | Live action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...fit.map((row) => `| ${row.gate_id} | ${row.phase} | ${mdCell(row.required_check)} | ${mdCell(row.pass_condition)} | ${mdCell(row.evidence_allowed_in_repo)} | ${mdCell(row.blocked_if)} | ${row.live_action_allowed} |`),
    '',
    '## Owner Reply Rows',
    '',
    '| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |',
    '| --- | --- | --- | --- | --- | --- |',
    ...ownerRows.map((row) => `| ${row.row_id} | ${mdCell(row.decision_needed)} | ${row.recommended_answer} | ${mdCell(row.allowed_answers)} | ${row.owner_answer} | ${row.owner_note} |`),
    '',
    '## Boundaries',
    '',
    '- This packet does not select the target for the owner.',
    '- This packet does not contact the target.',
    '- This packet does not create or edit CRM/admin records.',
    '- This packet does not create an invoice, payment link, paid status or public profile.',
    '- Current public-source recheck is still required before live use.',
  ].join('\n');
}

function buildHtml({ summary, target, fit }) {
  const rows = fit.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.gate_id)}</code></td>
      <td>${htmlEscape(row.phase)}</td>
      <td>${htmlEscape(row.required_check)}</td>
      <td>${htmlEscape(row.pass_condition)}</td>
      <td>${htmlEscape(row.blocked_if)}</td>
    </tr>`).join('');
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>בדיקת התאמה פרטית ליעד מומלץ</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f6f7f8; color: #182033; line-height: 1.58; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 18px 56px; }
    h1 { margin: 0 0 10px; font-size: 30px; color: #07152f; }
    .status { background: #fff; border: 1px solid #d7dde5; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 24px; }
    th, td { border: 1px solid #d7dde5; padding: 10px; vertical-align: top; font-size: 13px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
    a { overflow-wrap: anywhere; }
  </style>
</head>
<body>
<main>
  <h1>בדיקת התאמה פרטית ליעד מומלץ</h1>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>Target:</strong> <code>${htmlEscape(target.target_id)}</code> - ${htmlEscape(target.candidate)}</p>
    <p><strong>Source:</strong> <a href="${htmlEscape(target.source_url)}">${htmlEscape(target.source_url)}</a></p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <table>
    <thead><tr><th>Gate</th><th>Phase</th><th>Required check</th><th>Pass</th><th>Blocked if</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-lawyer-manual-invoice-recommended-target-fit-packet.mjs --reportDate=YYYY-MM-DD');
    return;
  }
  const sourcePath = shortlistPath(args.reportDate);
  if (!existsSync(sourcePath)) throw new Error(`Shortlist report not found: ${sourcePath}`);
  const shortlistReport = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const target = shortlistReport.shortlist.find((row) => row.target_id === shortlistReport.recommendedTargetId);
  if (!target) throw new Error('Recommended target not found in shortlist report.');

  const files = outputFiles(args.reportDate);
  const fit = fitRows(target);
  const owners = ownerRows(target);
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    sourceReport: relativePath(sourcePath),
    recommendedTargetId: target.target_id,
    candidate: target.candidate,
    recommendedPlan: 'pro',
    recommendedMonthlyIls: 349,
    fitRows: fit.length,
    ownerDecisionRows: owners.length,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 93,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This packet prepares private fit review for the recommended shortlist target only. It does not verify current public claims in-browser, contact anyone, create CRM records, invoice, request payment, mark paid, publish or deploy.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      ownerReplyCsv: relativePath(files.ownerReplyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, target, fit, ownerRows: owners }));
  writeText(files.projectHtml, buildHtml({ summary, target, fit }));
  writeText(files.projectCsv, toCsv(fit, ['gate_id', 'phase', 'required_check', 'pass_condition', 'evidence_allowed_in_repo', 'blocked_if', 'live_action_allowed']));
  writeText(files.ownerReplyCsv, toCsv(owners, ['row_id', 'decision_needed', 'recommended_answer', 'allowed_answers', 'owner_answer', 'owner_note']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, target, fit, ownerRows: owners }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));
  console.log(JSON.stringify(summary, null, 2));
}

main();
