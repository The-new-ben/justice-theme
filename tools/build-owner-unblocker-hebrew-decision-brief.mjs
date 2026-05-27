import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;

const HEBREW_ROWS = {
  'UNBLOCK-01': {
    title_he: 'הוכחת ליד בתשלום בביטוח לאומי',
    owner_decision_needed_he: 'לאשר איסוף ראיות חי מתוך wp-admin בלבד: שלושה מומחים פרטיים, ליד עדכני עם הסכמה, אישור בעלים, אסמכתת חיוב והוכחת תשלום.',
    why_he: 'זה המסלול הקרוב ביותר לליד ראשון בתשלום, אבל כרגע יש רק הכנת תשתית ולא ראיות חיות.',
    exact_next_step_he: 'הבעלים או מנהל האתר ממלאים את תבנית dry-run מתוך wp-admin בלי להכניס פרטים אישיים לקבצים.',
    if_approved_he: 'קודקס יכול לבדוק את שורות הראיה ללא פרטים מזהים ולהמשיך רק אם כל השורות עוברות.',
    hard_no_he: 'לא פונים ללידים ישנים, לא מעבירים פרטים אישיים, לא מחייבים, לא מסמנים שולם ולא טוענים להכנסה מתוך הקבצים בלבד.',
    suggested_reply_he: 'UNBLOCK-01 approve',
  },
  'UNBLOCK-02': {
    title_he: 'בדיקת מסלול מנוי עורך דין',
    owner_decision_needed_he: 'לבחור זהות בדיקה נשלטת לעורך דין: שם/מייל/טלפון בדיקה ומסלול תשלום מאושר כמו חשבונית ידנית, לינק תשלום מאושר, קישור ספק או dry-run ללא חיוב.',
    why_he: 'מסלול המנוי מוכן סטטית, אבל הוכחת הכנסה חיה דורשת זהות בדיקה וראיית תשלום שאושרו מראש.',
    exact_next_step_he: 'מריצים walkthrough נשלט רק עם זהות הבדיקה ונתיב התשלום שאושרו.',
    if_approved_he: 'אפשר לאסוף הוכחות על הרשמה, תוכנית, תשלום, דשבורד ובקשות שירות בתוך היקף בדיקה מוגדר.',
    hard_no_he: 'לא מחייבים עורך דין אמיתי, לא שולחים לינק תשלום, לא מגישים הרשמה חיה ולא משנים ספק תשלום בלי היקף בדיקה מאושר.',
    suggested_reply_he: 'UNBLOCK-02 approve',
  },
  'UNBLOCK-08': {
    title_he: 'כיסוי עורך דין פלילי בירושלים',
    owner_decision_needed_he: 'לאשר הכנסת/אימות prospect פרטי אחד ב-wp-admin לעורך דין פלילי בירושלים, או להחליט במפורש להקפיא את מסלול הכיסוי המדויק.',
    why_he: 'הספריה המדויקת פלילי+ירושלים וגם ספריית פלילי בלבד מציגות 0 כרטיסי עורכי דין, לכן אסור להסתמך על הדף לפני שיש כיסוי אמיתי.',
    exact_next_step_he: 'למלא את תבנית criminal Jerusalem עם רישיון, התאמת תחום, זמינות תגובה, נתיב תשלום ידני, תנאי fee וכתובת חיוב.',
    if_approved_he: 'אפשר לבדוק את הראיות הפרטיות ואז לבצע צעד prospect/profile פרטי מאושר לפני הרצה מחדש של בדיקת הכיסוי.',
    hard_no_he: 'לא עורכים דף ציבורי, לא יוצרים כרטיס עורך דין ציבורי, לא פונים לעורך דין, לא מנתבים ליד, לא מפיקים חשבונית ולא עושים uPress.',
    suggested_reply_he: 'UNBLOCK-08 approve',
  },
  'UNBLOCK-03': {
    title_he: 'עדכון ציבורי אפשרי בעמוד הסכם שכירות',
    owner_decision_needed_he: 'לאשר, לערוך, לדחות או להקפיא את חבילת העדכון למסלול הקיים /rental-agreement/.',
    why_he: 'זה יכול לשפר המרה בעמוד קיים בלי ליצור מסלול כפול, אבל דורש אישור בעלים/SEO/משפטי לפני עריכת CMS.',
    exact_next_step_he: 'אם יאושר, מכינים נוסח מדויק לבדיקת בעלים ומשפטי ומריצים QA לפני פרסום.',
    if_approved_he: 'אפשר להכין טיוטת שינוי מדויקת בלבד, עדיין בלי פרסום.',
    hard_no_he: 'אין שינוי title/H1/meta/body/link/checkout/CMS/email/uPress בלי אישור ציבורי מפורש.',
    suggested_reply_he: 'UNBLOCK-03 approve',
  },
  'UNBLOCK-04': {
    title_he: 'החלטת Low Hype / RV',
    owner_decision_needed_he: 'להחליט אם Low Hype נשאר פנימי בלבד ואם פיילוט RV שכירות/פיקדון/חיוב מאושר, נדחה או מוקפא.',
    why_he: 'המחקר תומך בפיילוט צר בלבד; מסלול RV עצמאי עדיין מסוכן מדי.',
    exact_next_step_he: 'למלא החלטת בעלים ואז שורות GSC לפני כל תוכן ציבורי.',
    if_approved_he: 'אפשר להמשיך בדיקת GSC/משפטי פרטית או intake ללא פרטים מזהים רק עם הסכמה מפורשת.',
    hard_no_he: 'אין תווית Low Hype ציבורית, אין מסלול RV עצמאי, אין יבוא לידים ישנים, אין שחרור פרטים ואין חיוב.',
    suggested_reply_he: 'UNBLOCK-04 park',
  },
  'UNBLOCK-05': {
    title_he: 'עמוד גירושין תל אביב',
    owner_decision_needed_he: 'לאמת מוכנות wp-admin לשלושת כרטיסי דיני משפחה בתל אביב ולספק שורות GSC לקבוצת גירושין תל אביב.',
    why_he: 'יש כיסוי ספריה שנראה חי, אבל פרסום דורש מוכנות פרופילים, GSC ובדיקת משפטית/עריכה.',
    exact_next_step_he: 'למלא תבנית public-draft gate עם ספירת פרופילים, GSC, בודק משפטי/עריכה והחלטת בעלים.',
    if_approved_he: 'אפשר להכין טיוטת fit-check צרה שמגינה על pillar הגירושין ועל עמודים קשורים.',
    hard_no_he: 'אין CMS, title/H1/meta/body, קישורים פנימיים, שינוי ספריה, redirects/canonicals/noindex/sitemap/uPress.',
    suggested_reply_he: 'UNBLOCK-05 needs_more_evidence',
  },
  'UNBLOCK-06': {
    title_he: 'תפקיד העמוד פלילי ירושלים',
    owner_decision_needed_he: 'למלא החלטת GSC/בעלים: לשמר, לערוך, לאחד או להקפיא את /criminal-lawyer-jerusalem/ ולהחליט מי הבעלים של מסלול פלילי המרכזי.',
    why_he: 'העמוד כבר ציבורי ודק, אבל אסור לערוך לפני שמחליטים איך הוא משתלב עם pillar פלילי ועמודים מומחים.',
    exact_next_step_he: 'להשתמש בשורות GSC ובהחלטת בעלים כדי למפות בעלות מסלול מרכזי, תפקיד עמוד מקומי ועמודים מוגנים.',
    if_approved_he: 'אפשר להכין טיוטת עדכון רק אחרי שבעלות המסלול ברורה.',
    hard_no_he: 'אין עריכה ציבורית, ביטול פרסום, redirect, canonical/noindex, שינוי קישורים פנימיים, sitemap או taxonomy.',
    suggested_reply_he: 'UNBLOCK-06 needs_more_evidence',
  },
  'UNBLOCK-07': {
    title_he: 'הסכמה ללידים מ-WhatsApp/TalkTo',
    owner_decision_needed_he: 'לאשר או לערוך נוסח הסכמה/re-permission וכללי suppression לפני טיפול בלידים אמיתיים.',
    why_he: 'צאטים נכנסים וישנים יכולים להפוך ל-CRM רק אם הסכמה, כללי עצירה וגבולות no-PII ברורים.',
    exact_next_step_he: 'בעלים/משפטי בודקים את חבילת ההודעות; אחר כך אפשר להכין preflight מייצוא שהבעלים מספק.',
    if_approved_he: 'אפשר לטפל בפניות עדכניות רק עם הרשאה; לידים ישנים רק אחרי re-permission מאושר.',
    hard_no_he: 'אין הודעות bulk, אין התאמת לידים ישנים, אין שחרור PII, אין preview לשותף, אין חשבונית ואין טענת הכנסה.',
    suggested_reply_he: 'UNBLOCK-07 edit',
  },
};

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
  const base = `owner-unblocker-hebrew-decision-brief-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    replyTemplateCsv: path.join(ROOT, '.project-control', `owner-unblocker-hebrew-reply-template-${reportDate}.csv`),
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

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildRows(sourceRows) {
  return sourceRows.map((row) => {
    const hebrew = HEBREW_ROWS[row.id] || {};
    return {
      id: row.id,
      rank: row.rank,
      lane: row.lane,
      priority_group: row.rank <= 3 ? 'top_3' : 'secondary',
      title_he: hebrew.title_he || row.lane,
      owner_decision_needed_he: hebrew.owner_decision_needed_he || row.owner_reply_needed,
      why_he: hebrew.why_he || row.why_it_matters,
      exact_next_step_he: hebrew.exact_next_step_he || row.exact_next_step,
      if_approved_he: hebrew.if_approved_he || row.allowed_after_yes,
      hard_no_he: hebrew.hard_no_he || row.hard_no,
      suggested_reply_he: hebrew.suggested_reply_he || `${row.id} needs_more_evidence`,
      source_status: row.source_status,
      source_artifact: row.source_artifact,
      public_action_approved: 'no',
      live_crm_or_outreach_approved: 'no',
      payment_or_invoice_approved: 'no',
    };
  });
}

function buildGates(sourceReport, rows) {
  const status = sourceReport.summary?.status || '';
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  return [
    {
      id: 'OHB-GATE-01',
      gate: 'source_owner_queue_available',
      status: status === 'OWNER_UNBLOCKER_COMMAND_QUEUE_READY_NO_LIVE_ACTION' ? 'PASS' : 'BLOCKED',
      evidence: `Source queue status: ${status || 'missing'}.`,
      next_action: 'Use the Hebrew brief only as a private decision aid.',
    },
    {
      id: 'OHB-GATE-02',
      gate: 'top_three_owner_decisions_present',
      status: topRows.length === 3 && topRows.some((row) => row.id === 'UNBLOCK-08') ? 'PASS' : 'REVIEW',
      evidence: `Top rows: ${topRows.map((row) => row.id).join(', ')}.`,
      next_action: 'Keep BTL, subscription and criminal Jerusalem coverage visible first.',
    },
    {
      id: 'OHB-GATE-03',
      gate: 'no_live_action_authorized',
      status: rows.every(
        (row) =>
          row.public_action_approved === 'no' &&
          row.live_crm_or_outreach_approved === 'no' &&
          row.payment_or_invoice_approved === 'no',
      )
        ? 'PASS'
        : 'BLOCKED',
      evidence: 'All Hebrew decision rows keep public, CRM/outreach and payment approval set to no.',
      next_action: 'Do not send, publish, create records or charge from this brief.',
    },
  ];
}

function buildReplyRows(rows) {
  return rows.map((row) => ({
    unblock_id: row.id,
    החלטה: '',
    ערכים_מותרים: 'approve / edit / reject / park / needs_more_evidence',
    הערת_בעלים_בלי_פרטים_מזהים: '',
    פעולה_ציבורית_מאושרת: 'no',
    crm_או_פניה_חיה_מאושרת: 'no',
    חיוב_או_תשלום_מאושר: 'no',
    מיקום_ראיות_פרטי: '',
    הצעת_תשובה: row.suggested_reply_he,
  }));
}

function buildMarkdown({ reportDate, sourceDate, status, gates, rows }) {
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  return [
    `# תקציר החלטות בעלים - ${reportDate}`,
    '',
    `סטטוס: ${status}`,
    `מקור: owner-unblocker-command-queue-${sourceDate}`,
    '',
    'מטרה: לתת לבעלים מסך החלטה קצר בעברית. זהו קובץ פרטי בלבד. הוא לא מאשר עריכת CMS, שינוי SEO, יצירת רשומות CRM, פניה ללקוח/עורך דין/ספק, חשבונית, תשלום, אימייל, WhatsApp/TalkTo, קריאת GSC או uPress.',
    '',
    '## שלוש החלטות ראשונות',
    '',
    '| מזהה | עדיפות | נושא | החלטה נדרשת | הצעד הבא | אסור בלי אישור | תשובה מומלצת |',
    '| --- | ---: | --- | --- | --- | --- | --- |',
    ...topRows.map(
      (row) =>
        `| ${row.id} | ${row.rank} | ${mdCell(row.title_he)} | ${mdCell(row.owner_decision_needed_he)} | ${mdCell(row.exact_next_step_he)} | ${mdCell(row.hard_no_he)} | ${mdCell(row.suggested_reply_he)} |`,
    ),
    '',
    '## כל התור',
    '',
    '| מזהה | עדיפות | נושא | למה זה חשוב | אם מאושר | מקור |',
    '| --- | ---: | --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.id} | ${row.rank} | ${mdCell(row.title_he)} | ${mdCell(row.why_he)} | ${mdCell(row.if_approved_he)} | ${mdCell(row.source_status)} |`,
    ),
    '',
    '## בדיקות בטיחות',
    '',
    '| מזהה | בדיקה | סטטוס | ראיה |',
    '| --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## נוסח תשובה קצר',
    '',
    'אפשר להשיב רק עם מזהים, למשל:',
    '',
    '`UNBLOCK-01 approve, UNBLOCK-08 approve, UNBLOCK-03 park`',
    '',
    '## סקירה קצרה',
    '',
    'המסלול הכי מהיר להכנסה עדיין אינו פרסום עמוד חדש. הוא אחד משלושה צעדים פרטיים: הוכחת ליד בביטוח לאומי, בדיקת מנוי עורך דין, או אישור prospect פלילי בירושלים כדי לפתוח את חסימת הכיסוי. כל שינוי ציבורי נשאר חסום עד אישור בעלים, GSC ובדיקה משפטית.',
    '',
  ].join('\n');
}

function buildHtml({ reportDate, sourceDate, status, gates, rows }) {
  const topRows = rows.filter((row) => row.priority_group === 'top_3');
  const gateClass = (gate) => gate.status.toLowerCase();
  const topCards = topRows
    .map(
      (row) => `
        <article class="decision-card">
          <div class="card-head">
            <span class="rank">#${htmlEscape(row.rank)}</span>
            <span class="id">${htmlEscape(row.id)}</span>
          </div>
          <h2>${htmlEscape(row.title_he)}</h2>
          <dl>
            <dt>החלטת בעלים נדרשת</dt>
            <dd>${htmlEscape(row.owner_decision_needed_he)}</dd>
            <dt>הצעד הבא</dt>
            <dd>${htmlEscape(row.exact_next_step_he)}</dd>
            <dt>אסור ללא אישור</dt>
            <dd>${htmlEscape(row.hard_no_he)}</dd>
            <dt>תשובה קצרה מוצעת</dt>
            <dd><code>${htmlEscape(row.suggested_reply_he)}</code></dd>
          </dl>
        </article>`,
    )
    .join('\n');

  const queueRows = rows
    .map(
      (row) => `
          <tr>
            <td><strong>${htmlEscape(row.id)}</strong></td>
            <td>${htmlEscape(row.rank)}</td>
            <td>${htmlEscape(row.title_he)}</td>
            <td>${htmlEscape(row.why_he)}</td>
            <td>${htmlEscape(row.if_approved_he)}</td>
            <td>${htmlEscape(row.source_status)}</td>
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
  <title>תקציר החלטות בעלים - ${htmlEscape(reportDate)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #172033;
      --muted: #5c667a;
      --line: #d8dde8;
      --panel: #ffffff;
      --soft: #f5f7fb;
      --accent: #1967d2;
      --accent-soft: #e8f0fe;
      --warn: #8a4b00;
      --warn-soft: #fff4df;
      --ok: #137333;
      --ok-soft: #e6f4ea;
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
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 48px;
    }

    header {
      display: grid;
      gap: 16px;
      margin-bottom: 24px;
      padding: 24px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    h1,
    h2,
    h3 {
      margin: 0;
      letter-spacing: 0;
    }

    h1 {
      font-size: clamp(1.8rem, 2.4vw, 2.6rem);
      line-height: 1.25;
    }

    h2 {
      font-size: 1.2rem;
      line-height: 1.35;
    }

    h3 {
      font-size: 1.05rem;
    }

    p {
      margin: 0;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill,
    .status,
    code {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.88rem;
      line-height: 1.35;
      white-space: normal;
    }

    .pill {
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid #c7d7f8;
    }

    .pill.warning {
      color: var(--warn);
      background: var(--warn-soft);
      border-color: #f5d08b;
    }

    .summary {
      color: var(--muted);
      max-width: 940px;
    }

    .decision-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 18px 0 28px;
    }

    .decision-card,
    .section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .decision-card {
      display: grid;
      gap: 14px;
      padding: 18px;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      gap: 8px;
      margin: 0;
    }

    dt {
      color: var(--muted);
      font-weight: 700;
      margin-top: 4px;
    }

    dd {
      margin: 0;
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
      min-width: 860px;
      border-collapse: collapse;
      background: var(--panel);
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
      color: #a50e0e;
      background: #fce8e6;
      border: 1px solid #f3b3ad;
    }

    code {
      direction: ltr;
      font-family: Consolas, "Courier New", monospace;
      color: #12315c;
      background: #eef3fb;
      border: 1px solid #ced9ef;
    }

    footer {
      margin-top: 18px;
      padding: 16px 20px;
      color: var(--muted);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    @media (max-width: 860px) {
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
      <h1>תקציר החלטות בעלים</h1>
      <div class="meta">
        <span class="pill">${htmlEscape(reportDate)}</span>
        <span class="pill">${htmlEscape(status)}</span>
        <span class="pill">מקור: owner-unblocker-command-queue-${htmlEscape(sourceDate)}</span>
        <span class="pill warning">פרטי בלבד - ללא פעולה ציבורית</span>
      </div>
      <p class="summary">מטרת הקובץ היא לתת לבעלים מסך החלטה קצר בעברית. הוא אינו מאשר עריכת CMS, שינוי SEO, יצירת רשומת CRM, פנייה ללקוח או לעורך דין, חשבונית, תשלום, אימייל, WhatsApp/TalkTo, קריאת GSC או uPress.</p>
    </header>

    <section>
      <h2>שלוש החלטות ראשונות</h2>
      <div class="decision-grid">
${topCards}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>כל התור</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>מזהה</th>
              <th>עדיפות</th>
              <th>נושא</th>
              <th>למה זה חשוב</th>
              <th>אם מאושר</th>
              <th>מקור</th>
            </tr>
          </thead>
          <tbody>
${queueRows}
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
      אפשר להשיב רק עם מזהים, למשל <code>UNBLOCK-01 approve, UNBLOCK-08 approve</code>. כל שינוי ציבורי נשאר חסום עד אישור בעלים מפורש, בדיקת GSC ובדיקה משפטית לפי המסלול.
    </footer>
  </main>
</body>
</html>
`;
}

function printHelp() {
  console.log('Usage: node tools/build-owner-unblocker-hebrew-decision-brief.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const sourceReport = readJson(`.reports/owner-unblocker-command-queue-${args.sourceDate}.json`);
  const rows = buildRows(sourceReport.rows || []);
  const gates = buildGates(sourceReport, rows);
  const replyRows = buildReplyRows(rows);
  const blockedGateCount = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const reviewGateCount = gates.filter((gate) => gate.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_BLOCKED_NO_LIVE_ACTION'
    : reviewGateCount
      ? 'OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_READY_WITH_REVIEW_NO_LIVE_ACTION'
      : 'OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_READY_NO_LIVE_ACTION';

  const rowColumns = [
    'id',
    'rank',
    'lane',
    'priority_group',
    'title_he',
    'owner_decision_needed_he',
    'why_he',
    'exact_next_step_he',
    'if_approved_he',
    'hard_no_he',
    'suggested_reply_he',
    'source_status',
    'source_artifact',
    'public_action_approved',
    'live_crm_or_outreach_approved',
    'payment_or_invoice_approved',
  ];

  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceStatus: sourceReport.summary?.status || '',
    rowCount: rows.length,
    topRowCount: rows.filter((row) => row.priority_group === 'top_3').length,
    gateCount: gates.length,
    passGateCount: gates.filter((gate) => gate.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    publicActionApproved: 0,
    liveCrmOrOutreachApproved: 0,
    paymentOrInvoiceApproved: 0,
    emailsSent: 0,
    gscApiCalled: 0,
    upressDeploymentRequired: false,
    gates,
    rows,
    replyRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, rows }));
  writeText(files.projectHtml, buildHtml({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, rows }));
  writeText(files.projectCsv, toCsv(rows, rowColumns));
  writeText(files.replyTemplateCsv, toCsv(replyRows, Object.keys(replyRows[0] || {})));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(rows, rowColumns));

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
        publicActionApproved: report.publicActionApproved,
        liveCrmOrOutreachApproved: report.liveCrmOrOutreachApproved,
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
