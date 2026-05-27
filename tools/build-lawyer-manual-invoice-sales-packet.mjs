import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LAWYER_MANUAL_INVOICE_SALES_PACKET_READY_NO_LIVE_ACTION';

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
  const base = `lawyer-manual-invoice-sales-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
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

function offerRows() {
  return [
    {
      row_id: 'SALE-OFFER-01',
      type: 'positioning',
      text_he: 'אנחנו בודקים צירוף עורך דין אחד למסלול Pro ב-Jus-Tice. המטרה היא פרופיל מקצועי מסודר, בדיקת התאמה, חשיפה מדודה והפעלה בלי התחייבות לכמות פניות.',
      say_this: 'Yes',
      do_not_say: 'אל תגידו שיש בלעדיות, הבטחת תיקים או תוצאה משפטית.',
      revenue_role: 'Creates a clear low-friction first paid offer.',
    },
    {
      row_id: 'SALE-OFFER-02',
      type: 'price',
      text_he: 'המסלול הראשון המומלץ הוא Pro במחיר 349 ש"ח לחודש כולל מע"מ, בכפוף לבדיקת התאמה ואישור תשלום.',
      say_this: 'Yes',
      do_not_say: 'אל תציגו את המחיר כהנחה זמנית אם אין אישור בעלים לכך.',
      revenue_role: 'Sets a small first close instead of waiting for a larger plan.',
    },
    {
      row_id: 'SALE-OFFER-03',
      type: 'scope',
      text_he: 'הפרופיל יופעל רק אחרי בדיקת רישיון, תוכן, פרטי חשבונית ואישור תשלום. חשבונית או קישור תשלום אינם נחשבים תשלום עד שיש אסמכתא.',
      say_this: 'Yes',
      do_not_say: 'אל תבטיחו פרסום לפני בדיקות או לפני תשלום.',
      revenue_role: 'Protects payment proof and profile activation boundaries.',
    },
  ];
}

function objectionRows() {
  return [
    {
      row_id: 'OBJ-01',
      objection_he: 'כמה לידים אני מקבל?',
      answer_he: 'במסלול הזה לא מוכרים כמות לידים. אנחנו מתחילים מחשיפה ופרופיל מקצועי, עם בדיקת התאמה ודיווח בסיסי. אם נראה שיש ביקוש יציב, אפשר לדבר על מסלול מתקדם יותר.',
      close_question_he: 'רוצה להתחיל ב-Pro לחודש ראשון ולבדוק התאמה בלי התחייבות לכמות לידים?',
      safety_note: 'No lead-volume promise.',
    },
    {
      row_id: 'OBJ-02',
      objection_he: 'למה לשלם לפני שיש תוצאות?',
      answer_he: 'התשלום הוא על הקמה, נוכחות מקצועית ותהליך בדיקה מסודר, לא על תוצאה. לכן בחרנו מסלול כניסה נמוך יחסית של 349 ש"ח לחודש.',
      close_question_he: 'אם נגדיר את זה כחודש בדיקה מסודר, זה מתאים להתחלה?',
      safety_note: 'No legal-result promise.',
    },
    {
      row_id: 'OBJ-03',
      objection_he: 'מי רואה את הפרופיל?',
      answer_he: 'האתר מיועד לציבור שמחפש עזרה משפטית. ההופעה תלויה בהתאמה, תוכן, קטגוריה ואיכות הפרופיל. לא נתחייב למיקום קבוע בלי בדיקה נפרדת.',
      close_question_he: 'נוכל להתחיל מהפרופיל הבסיסי ולשפר לפי נתונים?',
      safety_note: 'No fixed ranking promise.',
    },
    {
      row_id: 'OBJ-04',
      objection_he: 'אפשר לבטל?',
      answer_he: 'אפשר להגדיר את ההתחלה כחודש ראשון לבדיקה. תנאי הביטול המדויקים צריכים להיות מאושרים על ידי בעל האתר לפני שליחה.',
      close_question_he: 'רוצה שאשלח תנאי התחלה קצרים לאישור?',
      safety_note: 'Terms need owner approval before send.',
    },
    {
      row_id: 'OBJ-05',
      objection_he: 'אני רוצה בלעדיות בתחום.',
      answer_he: 'בשלב הראשון אין בלעדיות. אנחנו בודקים התאמה של פרופיל מקצועי אחד, בלי לחסום עורכי דין אחרים ובלי לפגוע בבחירת הציבור.',
      close_question_he: 'נתחיל בלי בלעדיות ונבחן בהמשך אם יש הצדקה למסלול מתקדם?',
      safety_note: 'No exclusivity.',
    },
    {
      row_id: 'OBJ-06',
      objection_he: 'איך משלמים?',
      answer_he: 'אחרי אישור התאמה ופרטי חשבונית נשלחת חשבונית או קישור תשלום ידני. הפרופיל מופעל רק אחרי אסמכתת תשלום ובדיקת תוכן.',
      close_question_he: 'אפשר לקבל שם חשבונית ומייל חשבוניות כדי להכין את זה אחרי אישור?',
      safety_note: 'No payment claim without proof.',
    },
  ];
}

function closeRows() {
  return [
    {
      step_id: 'CLOSE-01',
      phase: 'precheck',
      owner_admin_action: 'Select one target lawyer or approve generic draft only.',
      pass_condition: 'Owner reply gate passes for target mode, plan and message.',
      blocked_if: 'Owner reply CSV is blank or partial.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'CLOSE-02',
      phase: 'first_contact',
      owner_admin_action: 'Use approved Hebrew message only after owner approval.',
      pass_condition: 'Exact message approved and target details stored privately, not in repo.',
      blocked_if: 'Message still needs edits or target details are not verified.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'CLOSE-03',
      phase: 'fit',
      owner_admin_action: 'Verify license, practice fit, claims, billing legal name and invoice email.',
      pass_condition: 'Fit and billing facts are confirmed in private admin notes.',
      blocked_if: 'Missing license, fit, billing name or invoice email.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'CLOSE-04',
      phase: 'registration',
      owner_admin_action: 'Use manual invoice registration path for Pro only if owner approved live action.',
      pass_condition: 'Registration creates manual invoice follow-up without automatic charge.',
      blocked_if: 'No owner live-action approval.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'CLOSE-05',
      phase: 'invoice',
      owner_admin_action: 'Save invoice reference or manual payment link reference only after accepted terms.',
      pass_condition: 'Reference exists before invoice_sent.',
      blocked_if: 'No invoice/payment reference.',
      live_action_allowed: 'NO',
    },
    {
      step_id: 'CLOSE-06',
      phase: 'payment',
      owner_admin_action: 'Mark payment confirmed only after private payment proof.',
      pass_condition: 'Payment proof exists and owner confirms no dispute.',
      blocked_if: 'Promise to pay or invoice only.',
      live_action_allowed: 'NO',
    },
  ];
}

function buildMarkdown({ summary, offers, objections, closes }) {
  return [
    `# Lawyer manual invoice sales packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: close the first paid lawyer subscription through manual invoice after owner approval.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% sales-prep readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## First Offer',
    '',
    `Recommended first offer: Pro, ${summary.recommendedMonthlyIls} ILS per month including VAT.`,
    '',
    'This packet is internal only. It prepares the words and boundaries for a first close. It does not send anything.',
    '',
    '## What To Say',
    '',
    '| ID | Type | Text | Do not say | Revenue role |',
    '| --- | --- | --- | --- | --- |',
    ...offers.map((row) => `| ${row.row_id} | ${row.type} | ${mdCell(row.text_he)} | ${mdCell(row.do_not_say)} | ${mdCell(row.revenue_role)} |`),
    '',
    '## Objection Handling',
    '',
    '| ID | Objection | Answer | Close question | Safety note |',
    '| --- | --- | --- | --- | --- |',
    ...objections.map((row) => `| ${row.row_id} | ${mdCell(row.objection_he)} | ${mdCell(row.answer_he)} | ${mdCell(row.close_question_he)} | ${mdCell(row.safety_note)} |`),
    '',
    '## Close Sequence',
    '',
    '| Step | Phase | Owner/admin action | Pass condition | Blocked if | Live action allowed |',
    '| --- | --- | --- | --- | --- | --- |',
    ...closes.map((row) => `| ${row.step_id} | ${row.phase} | ${mdCell(row.owner_admin_action)} | ${mdCell(row.pass_condition)} | ${mdCell(row.blocked_if)} | ${row.live_action_allowed} |`),
    '',
    '## Not Published And Not Sent',
    '',
    '- No lawyer is named or contacted.',
    '- No CRM or admin record is created or edited.',
    '- No invoice or payment request is created.',
    '- No revenue or paid status is claimed.',
    '- No public profile, public page, route, SEO setting or uPress action is changed.',
  ].join('\n');
}

function buildHtml({ summary, offers, objections, closes }) {
  const table = (rows, columns) => rows.map((row) => `
    <tr>${columns.map((column) => `<td>${htmlEscape(row[column])}</td>`).join('')}</tr>`).join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>חבילת מכירה לעורך דין ראשון</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f6f7f8; color: #182033; line-height: 1.58; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 18px 56px; }
    h1 { margin: 0 0 10px; font-size: 30px; color: #07152f; }
    h2 { margin-top: 28px; color: #07152f; }
    .status { background: #fff; border: 1px solid #d7dde5; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 24px; }
    th, td { border: 1px solid #d7dde5; padding: 10px; vertical-align: top; font-size: 13px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
  </style>
</head>
<body>
<main>
  <h1>חבילת מכירה לעורך דין ראשון</h1>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>הצעה ראשונה:</strong> Pro, ${summary.recommendedMonthlyIls} ש"ח לחודש כולל מע"מ.</p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>מה אומרים</h2>
  <table>
    <thead><tr><th>ID</th><th>סוג</th><th>נוסח</th><th>לא לומר</th><th>תפקיד בהכנסה</th></tr></thead>
    <tbody>${table(offers, ['row_id', 'type', 'text_he', 'do_not_say', 'revenue_role'])}</tbody>
  </table>
  <h2>התנגדויות</h2>
  <table>
    <thead><tr><th>ID</th><th>התנגדות</th><th>תשובה</th><th>שאלת סגירה</th><th>גבול בטיחות</th></tr></thead>
    <tbody>${table(objections, ['row_id', 'objection_he', 'answer_he', 'close_question_he', 'safety_note'])}</tbody>
  </table>
  <h2>רצף סגירה</h2>
  <table>
    <thead><tr><th>שלב</th><th>פאזה</th><th>פעולה</th><th>תנאי מעבר</th><th>חסימה</th><th>פעולה חיה</th></tr></thead>
    <tbody>${table(closes, ['step_id', 'phase', 'owner_admin_action', 'pass_condition', 'blocked_if', 'live_action_allowed'])}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-lawyer-manual-invoice-sales-packet.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const offers = offerRows();
  const objections = objectionRows();
  const closes = closeRows();
  const rows = [
    ...offers.map((row) => ({ section: 'offer', ...row })),
    ...objections.map((row) => ({ section: 'objection', ...row })),
    ...closes.map((row) => ({ section: 'close', ...row })),
  ];
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    recommendedPlan: 'pro',
    recommendedMonthlyIls: 349,
    offerRows: offers.length,
    objectionRows: objections.length,
    closeRows: closes.length,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 90,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This packet prepares the first sales conversation only. It does not name or contact a lawyer, create CRM records, invoice, request payment, mark paid, publish or deploy.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, offers, objections, closes }));
  writeText(files.projectHtml, buildHtml({ summary, offers, objections, closes }));
  writeText(files.projectCsv, toCsv(rows, ['section', 'row_id', 'type', 'text_he', 'do_not_say', 'revenue_role', 'objection_he', 'answer_he', 'close_question_he', 'safety_note', 'step_id', 'phase', 'owner_admin_action', 'pass_condition', 'blocked_if', 'live_action_allowed']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, offers, objections, closes }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
