import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LAWYER_MANUAL_INVOICE_FIRST_TARGET_CHECKLIST_READY_OWNER_TARGET_REQUIRED';

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE };
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
  const base = `lawyer-manual-invoice-first-target-checklist-${reportDate}`;
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

function planRows() {
  return [
    {
      plan_key: 'pro',
      monthly_ils_vat_included: 349,
      recommendation: 'RECOMMENDED_FIRST_CLOSE',
      reason: 'Lowest paid friction and does not require lead-volume promises or client PII routing.',
      proof_source: 'inc/lawyer-plans.php public override and WooCommerce setup notes list Pro at 349 ILS per month including VAT.',
    },
    {
      plan_key: 'featured',
      monthly_ils_vat_included: 749,
      recommendation: 'SECOND_OPTION',
      reason: 'Higher value, but includes exposure positioning and needs clearer sponsored-profile wording.',
      proof_source: 'inc/lawyer-plans.php public override and WooCommerce setup notes list Featured at 749 ILS per month including VAT.',
    },
    {
      plan_key: 'lead_partner',
      monthly_ils_vat_included: 1490,
      recommendation: 'NOT_FIRST_WITHOUT_OWNER_APPROVAL',
      reason: 'Bigger revenue but closer to lead allocation and ethical/volume expectations; not the first close unless owner explicitly wants it.',
      proof_source: 'inc/lawyer-plans.php public override and WooCommerce setup notes list Lead Partner at 1490 ILS per month including VAT.',
    },
    {
      plan_key: 'full_service',
      monthly_ils_vat_included: 2490,
      recommendation: 'LATER',
      reason: 'High value but needs broader service delivery capacity and onboarding proof.',
      proof_source: 'inc/lawyer-plans.php public override and WooCommerce setup notes list Full Service at 2490 ILS per month including VAT.',
    },
  ];
}

function checklistRows() {
  return [
    {
      step_id: 'LMI-01',
      phase: 'owner_choice',
      action: 'Owner confirms the selected lane is lawyer subscription by manual invoice.',
      required_input: 'yes/no lane approval',
      pass_condition: 'Owner approves lawyer_subscription_manual_invoice as the next live-approved lane.',
      blocked_if: 'Owner says no or chooses wait.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-02',
      phase: 'target',
      action: 'Owner names one lawyer/prospect, or approves a generic one-target draft only.',
      required_input: 'target name/contact or generic draft permission',
      pass_condition: 'Exactly one target path is selected.',
      blocked_if: 'No target and no generic draft approval.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-03',
      phase: 'offer',
      action: 'Use Pro plan as the first paid offer unless owner overrides.',
      required_input: 'plan=pro or owner override',
      pass_condition: 'Plan and monthly price are recorded: recommended Pro at 349 ILS per month including VAT.',
      blocked_if: 'No price or plan is selected.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-04',
      phase: 'fit',
      action: 'Check license, practice fit, public claims and no-guarantee language before any public profile activation.',
      required_input: 'license/profile fit review',
      pass_condition: 'Owner/admin confirms fit review can proceed for the selected target.',
      blocked_if: 'Unverified identity, license or claims.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-05',
      phase: 'billing',
      action: 'Collect or confirm billing legal name and invoice email.',
      required_input: 'billing legal name, billing invoice email',
      pass_condition: 'Billing contact exists before invoice_requested/invoice_sent.',
      blocked_if: 'Missing billing contact.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-06',
      phase: 'message',
      action: 'Owner approves the outreach/message text before any send.',
      required_input: 'approved message or requested edits',
      pass_condition: 'Owner approves or edits the Hebrew draft.',
      blocked_if: 'No wording approval.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-07',
      phase: 'registration_path',
      action: 'Use the existing manual registration path for Pro plan if owner approves live action.',
      required_input: '/lawyer-registration/?plan_interest=pro&payment_path=manual_invoice',
      pass_condition: 'The target can be sent to the manual invoice registration path or admin-created only after approval.',
      blocked_if: 'No owner approval to contact or create admin entry.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-08',
      phase: 'invoice_reference',
      action: 'After accepted terms, save manual invoice/payment reference.',
      required_input: 'manual_invoice_reference or manual payment link reference',
      pass_condition: 'Reference exists before invoice_sent.',
      blocked_if: 'No invoice/payment reference.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-09',
      phase: 'payment_proof',
      action: 'Mark payment confirmed only after private payment evidence.',
      required_input: 'payment evidence, owner note',
      pass_condition: 'Payment proof exists and no dispute/refund/complaint is open.',
      blocked_if: 'Promise to pay, invoice only, or missing proof.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'LMI-10',
      phase: 'activation',
      action: 'Activate or publish profile only after payment proof and content/license review.',
      required_input: 'payment proof plus content/license review',
      pass_condition: 'Payment confirmed and profile content approved.',
      blocked_if: 'Unpaid, disputed, or unreviewed profile.',
      live_action_allowed: 'NO',
    },
  ];
}

function draftMessageRows() {
  return [
    {
      message_id: 'LMI-MSG-01',
      use_when: 'Owner wants a generic draft before selecting the exact target.',
      subject_he: 'בדיקת הצטרפות למסלול Pro ב-Jus-Tice',
      body_he: 'שלום, אנחנו בודקים הצטרפות של עורך דין אחד למסלול Pro ב-Jus-Tice במסלול חשבונית ידנית. המסלול מיועד לפרופיל מקצועי מורחב, בדיקת התאמה, אפשרות לדוח חשיפה ותהליך הפעלה מסודר. בשלב זה אין חיוב אוטומטי, אין הבטחת כמות פניות, אין התחייבות לתוצאה משפטית ואין בלעדיות. המחיר המוצע למסלול הראשון הוא 349 ש״ח לחודש כולל מע״מ, בכפוף לאישור התאמה, פרטי חשבונית ואישור תשלום. אם זה רלוונטי, נשלח קישור הרשמה קצר ונמשיך רק אחרי אישור תנאים.',
      send_status: 'DRAFT_ONLY_NOT_SENT',
    },
    {
      message_id: 'LMI-MSG-02',
      use_when: 'After a target asks how payment works.',
      subject_he: 'איך עובד התשלום הידני',
      body_he: 'ההרשמה יוצרת בקשת בדיקת התאמה. לאחר אישור התאמה נשלח חשבונית או קישור תשלום ידני. הפרופיל יופעל רק לאחר אישור תשלום ובדיקת תוכן ורישיון. חשבונית או קישור תשלום אינם נחשבים תשלום עד שיש אסמכתא.',
      send_status: 'DRAFT_ONLY_NOT_SENT',
    },
  ];
}

function ownerDecisionRows() {
  return [
    {
      row_id: 'OWNER-LMI-01',
      decision_needed: 'Approve lawyer subscription manual invoice as the next lane.',
      recommended_answer: 'yes',
      allowed_answers: 'yes | no | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-LMI-02',
      decision_needed: 'Choose target mode.',
      recommended_answer: 'generic_draft_only_until_target_named',
      allowed_answers: 'target_named | generic_draft_only | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-LMI-03',
      decision_needed: 'Approve first-offer plan and price.',
      recommended_answer: 'pro_349_ils_month_vat_included',
      allowed_answers: 'pro_349 | featured_749 | lead_partner_1490 | other | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-LMI-04',
      decision_needed: 'Approve or edit Hebrew message draft.',
      recommended_answer: 'edit_or_approve_before_any_send',
      allowed_answers: 'approve | edit_first | no | wait',
      owner_answer: '',
      owner_note: '',
    },
  ];
}

function buildMarkdown({ summary, plans, checklist, messages, ownerRows }) {
  return [
    `# Lawyer manual invoice first-target checklist - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: convert the recommended first-revenue lane into a one-target checklist that the owner can approve without triggering live action.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% checklist readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Recommendation',
    '',
    `Start with \`${summary.recommendedPlan}\` at ${summary.recommendedMonthlyIls} ILS per month including VAT.`,
    '',
    'Why: it is the lowest-friction paid plan, uses the existing manual invoice registration path and avoids lead-volume promises.',
    '',
    '## Plan Options',
    '',
    '| Plan | Monthly ILS incl. VAT | Recommendation | Reason | Source |',
    '| --- | --- | --- | --- | --- |',
    ...plans.map((row) => `| ${row.plan_key} | ${row.monthly_ils_vat_included} | ${row.recommendation} | ${mdCell(row.reason)} | ${mdCell(row.proof_source)} |`),
    '',
    '## Checklist',
    '',
    '| Step | Phase | Action | Required input | Pass condition | Blocked if | Live action allowed |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...checklist.map((row) => `| ${row.step_id} | ${row.phase} | ${mdCell(row.action)} | ${mdCell(row.required_input)} | ${mdCell(row.pass_condition)} | ${mdCell(row.blocked_if)} | ${row.live_action_allowed} |`),
    '',
    '## Hebrew Draft Messages',
    '',
    '| ID | Use when | Subject | Body | Status |',
    '| --- | --- | --- | --- | --- |',
    ...messages.map((row) => `| ${row.message_id} | ${mdCell(row.use_when)} | ${mdCell(row.subject_he)} | ${mdCell(row.body_he)} | ${row.send_status} |`),
    '',
    '## Owner Decision Rows',
    '',
    '| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |',
    '| --- | --- | --- | --- | --- | --- |',
    ...ownerRows.map((row) => `| ${row.row_id} | ${mdCell(row.decision_needed)} | ${row.recommended_answer} | ${mdCell(row.allowed_answers)} | ${row.owner_answer} | ${row.owner_note} |`),
    '',
    '## What This Does Not Do',
    '',
    '- Does not name or contact a lawyer.',
    '- Does not create or edit a CRM/admin record.',
    '- Does not send an email, WhatsApp or invoice.',
    '- Does not create a payment request.',
    '- Does not mark invoice_sent or paid.',
    '- Does not publish a profile or deploy anything.',
  ].join('\n');
}

function buildHtml({ summary, checklist, messages }) {
  const checklistHtml = checklist.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.step_id)}</code></td>
      <td>${htmlEscape(row.phase)}</td>
      <td>${htmlEscape(row.action)}</td>
      <td>${htmlEscape(row.pass_condition)}</td>
      <td>${htmlEscape(row.blocked_if)}</td>
    </tr>`).join('');
  const messagesHtml = messages.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.message_id)}</code></td>
      <td>${htmlEscape(row.subject_he)}</td>
      <td>${htmlEscape(row.body_he)}</td>
      <td>${htmlEscape(row.send_status)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lawyer manual invoice first-target checklist</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f8fa; color: #172033; line-height: 1.55; }
    main { max-width: 1160px; margin: 0 auto; padding: 32px 18px 56px; }
    h1, h2 { color: #07152f; }
    h1 { margin: 0 0 8px; font-size: 30px; }
    .status { background: #fff; border: 1px solid #d8dee4; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 26px; }
    th, td { border: 1px solid #d8dee4; padding: 10px; vertical-align: top; font-size: 13px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
  </style>
</head>
<body>
<main>
  <h1>Checklist למסלול עורך דין ראשון בחשבונית ידנית</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>המלצה:</strong> <code>${htmlEscape(summary.recommendedPlan)}</code>, ${summary.recommendedMonthlyIls} ש״ח לחודש כולל מע״מ.</p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>Checklist</h2>
  <table>
    <thead><tr><th>ID</th><th>Phase</th><th>Action</th><th>Pass</th><th>Blocked if</th></tr></thead>
    <tbody>${checklistHtml}</tbody>
  </table>
  <h2>טיוטות הודעה</h2>
  <table>
    <thead><tr><th>ID</th><th>נושא</th><th>גוף</th><th>סטטוס</th></tr></thead>
    <tbody>${messagesHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-lawyer-manual-invoice-first-target-checklist.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const plans = planRows();
  const checklist = checklistRows();
  const messages = draftMessageRows();
  const ownerRows = ownerDecisionRows();
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    recommendedPlan: 'pro',
    recommendedMonthlyIls: 349,
    planRows: plans.length,
    checklistRows: checklist.length,
    draftMessageRows: messages.length,
    ownerDecisionRows: ownerRows.length,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 88,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This packet prepares a one-target approval checklist and draft only. It does not contact anyone, create CRM records, invoice, request payment, mark paid, publish or deploy.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      ownerReplyCsv: relativePath(files.ownerReplyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, plans, checklist, messages, ownerRows }));
  writeText(files.projectHtml, buildHtml({ summary, checklist, messages }));
  writeText(files.projectCsv, toCsv(checklist, ['step_id', 'phase', 'action', 'required_input', 'pass_condition', 'blocked_if', 'live_action_allowed']));
  writeText(files.ownerReplyCsv, toCsv(ownerRows, ['row_id', 'decision_needed', 'recommended_answer', 'allowed_answers', 'owner_answer', 'owner_note']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, plans, checklist, messages, ownerRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
