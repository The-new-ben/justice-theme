import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'MANUAL_TERMS_REVENUE_PACKET_READY_OWNER_REVIEW_REQUIRED';

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
  const base = `manual-terms-revenue-packet-${reportDate}`;
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

function termRows() {
  return [
    {
      id: 'MTR-01',
      gate: 'commercial_lane',
      owner_decision: 'Select the first lane: Bituach Leumi qualified lead, lawyer subscription, supplier handoff, or UK/cross-border supplier.',
      default_position: 'Start with Bituach Leumi qualified appeal lead or lawyer/supplier manual invoice terms.',
      crm_fields: 'lead_revenue_model, partner_terms_target_type, prospect_target_plan, payment_path=manual_invoice',
      pass_condition: 'One lane is selected and the owner agrees it is the current first-revenue target.',
      fail_stop: 'No selected lane means no outreach, handoff, invoice or revenue claim.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-02',
      gate: 'accepted_scope',
      owner_decision: 'Define exactly what the partner receives: no-PII preview, consented lead handoff, subscription profile/dashboard, or supplier task.',
      default_position: 'No client PII before client permission, accepted terms and owner release.',
      crm_fields: 'consent_status, routing_hold, partner_terms_target_type, owner_handoff_release_scope',
      pass_condition: 'The accepted scope is recorded and does not promise legal outcome, ranking, exclusivity or lead volume.',
      fail_stop: 'Any promise of outcome, ranking, exclusivity or guaranteed lead volume blocks the deal.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-03',
      gate: 'price_and_fee',
      owner_decision: 'Record the commercial price: per-lead fee, monthly subscription, supplier fee or trial terms.',
      default_position: 'For Bituach Leumi controlled lead use 249 ILS suggested lead price unless owner changes it; otherwise owner fills exact amount.',
      crm_fields: 'partner_terms_min_fee_ils, prospect_agreed_lead_fee_ils, suggested_lead_price_ils, plan_type',
      pass_condition: 'A numeric fee or owner-approved trial term is recorded before handoff.',
      fail_stop: 'No price, no billing contact, or vague trial terms means no invoice and no paid claim.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-04',
      gate: 'billing_contact',
      owner_decision: 'Record where the manual invoice/payment request goes.',
      default_position: 'Use billing contact email and legal billing name from lawyer onboarding/prospect/CRM.',
      crm_fields: 'billing_invoice_email, billing_legal_name, prospect_billing_contact_email, qualified_lead_invoice_reference',
      pass_condition: 'Billing email and legal billing identity are present or owner records a manual alternative.',
      fail_stop: 'No billing contact means no invoice_sent status.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-05',
      gate: 'partner_acceptance',
      owner_decision: 'Record partner acceptance of fee, scope, response expectation and no-guarantee boundary.',
      default_position: 'Partner must accept fee and same-day or defined response SLA before client details are released.',
      crm_fields: 'partner_terms_status, partner_terms_min_fee_ils, prospect_response_fit, prospect_terms_note',
      pass_condition: 'Accepted terms, fee, billing contact and response SLA are visible in owner/admin context.',
      fail_stop: 'Partner has not accepted terms or wants outcome/volume promises.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-06',
      gate: 'client_permission_and_owner_release',
      owner_decision: 'Confirm client permission and owner manual release before handoff.',
      default_position: 'Owner release is a record only; it sends nothing automatically.',
      crm_fields: 'consent_status, owner_handoff_release_status, owner_confirmed_client_permission, owner_confirmed_partner_terms',
      pass_condition: 'Client permission, accepted partner terms and owner manual-only confirmation are all recorded.',
      fail_stop: 'Missing consent, missing terms or missing owner release keeps routing hold active.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-07',
      gate: 'invoice_reference',
      owner_decision: 'After an approved handoff, send/request manual invoice/payment and save the reference.',
      default_position: 'Invoice/reference can prove invoice_sent only, not paid revenue.',
      crm_fields: 'qualified_lead_billing_status, qualified_lead_invoice_reference, manual_invoice_reference',
      pass_condition: 'invoice_sent has an invoice/payment reference attached.',
      fail_stop: 'No reference means do not mark invoice_sent.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-08',
      gate: 'payment_evidence',
      owner_decision: 'Count revenue only after private payment proof exists.',
      default_position: 'Paid requires private payment evidence URL or owner-recorded proof, not a promise to pay.',
      crm_fields: 'qualified_lead_payment_evidence_url, qualified_lead_billing_status=paid, owner_note',
      pass_condition: 'Payment proof exists, no refund/dispute/complaint is open, and owner confirms count once.',
      fail_stop: 'No private proof means 0 paid revenue claim.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-09',
      gate: 'dispute_refund_hold',
      owner_decision: 'Define what freezes scale-up: refund, complaint, dispute, ethics concern or wrong-match feedback.',
      default_position: 'Any dispute stops revenue celebration and scale until reviewed.',
      crm_fields: 'owner_note, qualified_lead_billing_status, partner_terms_note',
      pass_condition: 'No dispute/refund/complaint is open for the counted payment.',
      fail_stop: 'Open dispute blocks paid success reporting and follow-up scale.',
      public_or_live_action_allowed: 'NO',
    },
    {
      id: 'MTR-10',
      gate: 'next_scale_decision',
      owner_decision: 'After one paid proof, decide whether to repeat with the same lane or expand to a second lane.',
      default_position: 'Repeat the lane with actual paid evidence before adding broad automation.',
      crm_fields: 'revenue_stream, owner_next_step, payment_path',
      pass_condition: 'One paid proof creates a scale/no-go review, not automatic mass routing.',
      fail_stop: 'Do not scale from unpaid invoices or verbal interest.',
      public_or_live_action_allowed: 'NO',
    },
  ];
}

function messageRows() {
  return [
    {
      id: 'MSG-01',
      recipient: 'lawyer_or_supplier',
      use_when: 'Before any client PII is released, after owner selected a lane and wants partner acceptance.',
      subject_he: 'בדיקת שיתוף פעולה ידני עם Jus-Tice',
      body_he: 'שלום, אנחנו בודקים שיתוף פעולה ידני ומבוקר עם Jus-Tice. בשלב זה לא מועברים פרטי לקוח. המטרה היא לוודא התאמה מקצועית, זמינות, תנאי קבלת פנייה, פרטי חיוב והסכמה לקבל תקציר פנייה רק לפי התנאים שסוכמו. אין התחייבות לתוצאה משפטית, לדירוג, לבלעדיות או לכמות פניות. אם זה רלוונטי, נשמח לאשר יחד תחום טיפול, מחיר/תנאי תשלום, איש קשר לחשבונית וזמן תגובה.',
      send_status: 'DRAFT_ONLY_NOT_SENT',
    },
    {
      id: 'MSG-02',
      recipient: 'lawyer_or_supplier',
      use_when: 'After owner-approved handoff and accepted terms, before invoice_sent is recorded.',
      subject_he: 'פנייה שאושרה לחיוב ידני',
      body_he: 'שלום, פנייה שאושרה במסלול ידני סומנה כמוכנה לחיוב לפי התנאים שסוכמו מראש. נא לאשר קבלה ולעדכן אם לשלוח חשבונית או קישור תשלום ידני. התשלום יירשם רק לאחר קבלת אסמכתא. אין התחייבות לתוצאה משפטית או להיקף פניות עתידי.',
      send_status: 'DRAFT_ONLY_NOT_SENT',
    },
  ];
}

function buildMarkdown({ summary, terms, messages }) {
  return [
    `# Manual terms revenue packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: create a shortest safe path from accepted lawyer/supplier terms to manual invoice revenue while payment-provider setup is blocked.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% operational readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## What This Packet Does',
    '',
    '- Converts the LegalTech OpenAgreements/Accord pattern into a Jus-Tice owner approval checklist.',
    '- Uses existing CRM concepts: consent, partner terms, owner handoff release, invoice reference and private payment proof.',
    '- Provides Hebrew draft messages, but sends nothing.',
    '- Keeps invoice reference separate from paid revenue proof.',
    '',
    '## Terms Gates',
    '',
    '| ID | Gate | Owner decision | Default position | CRM fields | Pass condition | Fail stop | Live action allowed |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...terms.map((row) => `| ${row.id} | ${row.gate} | ${mdCell(row.owner_decision)} | ${mdCell(row.default_position)} | ${mdCell(row.crm_fields)} | ${mdCell(row.pass_condition)} | ${mdCell(row.fail_stop)} | ${row.public_or_live_action_allowed} |`),
    '',
    '## Hebrew Draft Messages',
    '',
    '| ID | Recipient | Use when | Subject | Body | Status |',
    '| --- | --- | --- | --- | --- | --- |',
    ...messages.map((row) => `| ${row.id} | ${row.recipient} | ${mdCell(row.use_when)} | ${mdCell(row.subject_he)} | ${mdCell(row.body_he)} | ${row.send_status} |`),
    '',
    '## Owner Next Decision',
    '',
    'Choose exactly one first revenue lane:',
    '',
    '1. Bituach Leumi qualified appeal lead fee.',
    '2. Paid lawyer subscription via manual invoice.',
    '3. Supplier/UK/cross-border handoff fee.',
    '',
    'Then fill fee, billing contact and accepted scope. Do not route, invoice, mark paid or count revenue until the matching CRM proof exists.',
  ].join('\n');
}

function buildHtml({ summary, terms, messages }) {
  const termRowsHtml = terms.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.id)}</code></td>
      <td>${htmlEscape(row.gate)}</td>
      <td>${htmlEscape(row.owner_decision)}</td>
      <td>${htmlEscape(row.default_position)}</td>
      <td>${htmlEscape(row.pass_condition)}</td>
      <td>${htmlEscape(row.fail_stop)}</td>
    </tr>`).join('');
  const messageRowsHtml = messages.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.id)}</code></td>
      <td>${htmlEscape(row.use_when)}</td>
      <td>${htmlEscape(row.subject_he)}</td>
      <td>${htmlEscape(row.body_he)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Manual terms revenue packet</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f8fa; color: #172033; line-height: 1.55; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 56px; }
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
  <h1>חבילת תנאים ידנית לרווח ראשון</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>מוכנות לרווח:</strong> ${summary.readinessToProfitPercent}% תפעולי, ${summary.liveRevenueImpactPercent}% חי.</p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>שערי תנאים</h2>
  <table>
    <thead><tr><th>ID</th><th>Gate</th><th>החלטת בעלים</th><th>ברירת מחדל</th><th>תנאי מעבר</th><th>עצירה</th></tr></thead>
    <tbody>${termRowsHtml}</tbody>
  </table>
  <h2>טיוטות הודעה</h2>
  <table>
    <thead><tr><th>ID</th><th>מתי להשתמש</th><th>נושא</th><th>גוף</th></tr></thead>
    <tbody>${messageRowsHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-manual-terms-revenue-packet.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const terms = termRows();
  const messages = messageRows();
  const ownerReplyRows = [
    {
      row_id: 'OWNER-MTR-01',
      owner_decision_needed: 'Choose first revenue lane',
      allowed_answers: 'btl_lead_fee | lawyer_subscription | supplier_handoff | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-MTR-02',
      owner_decision_needed: 'Approve using the Hebrew partner acceptance message as a draft',
      allowed_answers: 'yes | edit_first | no',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-MTR-03',
      owner_decision_needed: 'Approve exact fee or trial term for the selected lane',
      allowed_answers: 'amount_ils | trial_terms | wait',
      owner_answer: '',
      owner_note: '',
    },
  ];
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    termGateRows: terms.length,
    draftMessageRows: messages.length,
    ownerDecisionRows: ownerReplyRows.length,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    externalCodeCopied: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 72,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This packet creates owner-review terms and draft messages only. It sends nothing, invoices nothing, marks nothing paid and imports no external code.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      ownerReplyCsv: relativePath(files.ownerReplyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, terms, messages }));
  writeText(files.projectHtml, buildHtml({ summary, terms, messages }));
  writeText(files.projectCsv, toCsv(terms, ['id', 'gate', 'owner_decision', 'default_position', 'crm_fields', 'pass_condition', 'fail_stop', 'public_or_live_action_allowed']));
  writeText(files.ownerReplyCsv, toCsv(ownerReplyRows, ['row_id', 'owner_decision_needed', 'allowed_answers', 'owner_answer', 'owner_note']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, terms, messages, ownerReplyRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
