import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'HOMEPAGE_HUMAN_HELP_VISUAL_QA_PREVIEW_READY_NO_PUBLIC_CHANGE';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

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
  const base = `homepage-human-help-visual-qa-preview-${reportDate}`;
  return {
    html: path.join(ROOT, '.project-control', `${base}.html`),
    md: path.join(ROOT, '.project-control', `${base}.md`),
    csv: path.join(ROOT, '.project-control', `${base}.csv`),
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

const qaRows = [
  {
    id: 'HOME-QA-01',
    selector: '.hero__first-steps',
    viewport: 'desktop and mobile',
    expectation: 'first-ten-minutes strip is visible below the hero search and does not push lawyer CTAs above public help',
    status: 'READY_FOR_BROWSER_CHECK',
  },
  {
    id: 'HOME-QA-02',
    selector: '.homepage-situation-router',
    viewport: 'desktop and mobile',
    expectation: 'six situation routes fit without horizontal overflow and speak to the public before legal category cards',
    status: 'READY_FOR_BROWSER_CHECK',
  },
  {
    id: 'HOME-QA-03',
    selector: '.homepage-intent-card__prep',
    viewport: 'desktop and mobile',
    expectation: 'each card has longer human guidance with what to prepare and when to seek help fast',
    status: 'READY_FOR_BROWSER_CHECK',
  },
  {
    id: 'HOME-QA-04',
    selector: '.homepage-intent-pyramid__lawyer-path',
    viewport: 'desktop and mobile',
    expectation: 'lawyer path remains visible but secondary below public legal help blocks',
    status: 'READY_FOR_BROWSER_CHECK',
  },
  {
    id: 'HOME-QA-05',
    selector: '.homepage-intent-pyramid__trust-note',
    viewport: 'desktop and mobile',
    expectation: 'legal-safety note is visible and does not sound like a sales promise',
    status: 'READY_FOR_BROWSER_CHECK',
  },
];

function buildHtml({ reportDate }) {
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jus-Tice homepage human-help QA preview</title>
  <link rel="stylesheet" href="../assets/css/main.css">
  <link rel="stylesheet" href="../assets/css/premium-pass-4.css">
  <style>
    :root {
      --jt-primary-deep: #07152f;
      --jt-accent-red: #b23a48;
      --jt-bg: #f7f8fa;
      --jt-muted: #6b7280;
      --jt-border: #e5e7eb;
      --color-heading: #07152f;
      --color-accent: #b23a48;
      --color-accent-hover: #9c2d3a;
      --radius-sm: 8px;
    }
    body { margin: 0; font-family: Arial, sans-serif; background: var(--jt-bg); }
    .container { width: min(1120px, calc(100% - 32px)); margin-inline: auto; }
    .qa-ribbon { background: #07152f; color: #fff; padding: 10px 16px; text-align: center; font-weight: 800; }
    .qa-ribbon span { color: #facc15; }
    .button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0.72rem 1rem; border-radius: 8px; font-weight: 800; text-decoration: none; }
    .button--primary, .button--gold { background: #b23a48; color: #fff; }
    .button--outline, .button--ghost { background: #fff; border: 1px solid #e5e7eb; color: #07152f; }
    .section-header__eyebrow { margin: 0 0 0.45rem; color: #b23a48; font-weight: 900; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="qa-ribbon">תצוגת QA פנימית בלבד <span>${reportDate}</span>. לא אתר חי ולא פרסום.</div>
  <section class="hero hero--has-bg" id="hero" style="--hero-bg-image: linear-gradient(135deg, #07152f, #1f3558);">
    <div class="container hero__grid">
      <div class="hero__content">
        <h1 class="hero__title">צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו</h1>
        <p class="hero__description">מכתב, זימון, חוב, פציעה או סכסוך יכולים להרגיש כמו רגע שבו חייבים להחליט מהר. Jus-Tice עוזר לעצור רגע, להבין מה דחוף, מה כדאי להכין, ואיך להתקדם למדריך או לעורך דין בלי הבטחות לא מבוססות.</p>
        <form class="hero-search" role="search">
          <div class="hero-search__filters">
            <div class="hero-search__field"><select><option>בחרו תחום משפטי</option></select></div>
            <div class="hero-search__field"><select><option>בחרו עיר</option></select></div>
          </div>
          <div class="hero-search__actions">
            <input type="search" placeholder="לדוגמה: חקירה במשטרה, גירושין, תאונת עבודה...">
            <button type="submit">חיפוש</button>
          </div>
        </form>
        <div class="hero__first-steps" aria-label="מה עושים בעשר הדקות הראשונות">
          <div class="hero__first-steps-intro">
            <strong>מה עושים בעשר הדקות הראשונות?</strong>
            <span>לפני שמחפשים עורך דין, סדרו את המקרה כך שהשיחה או החיפוש יהיו מדויקים יותר.</span>
          </div>
          <ol>
            <li><strong>כתבו מה קרה</strong><span>שורה אחת עם האירוע, הצד השני, העיר והתאריך החשוב ביותר.</span></li>
            <li><strong>שמרו מסמכים</strong><span>מכתב, זימון, חוזה, החלטה, צילום או הודעה יכולים לשנות את הצעד הבא.</span></li>
            <li><strong>בדקו דחיפות</strong><span>אם יש חקירה, מועד דיון, עיקול, פיטורים או דרישת תשלום, אל תחכו.</span></li>
            <li><strong>בחרו מסלול</strong><span>אפשר להתחיל ממדריך, מחיפוש לפי תחום ועיר, או מפנייה לעורך דין מתאים.</span></li>
          </ol>
        </div>
        <ul class="hero__market-signals">
          <li><strong>מסבירים במילים פשוטות</strong><span>גם אם לא יודעים איך קוראים לתחום המשפטי.</span></li>
          <li><strong>מבינים מה להכין</strong><span>מסמכים, מועדים ושאלות לפני שיחה.</span></li>
          <li><strong>עוברים לעורך דין כשזה מתאים</strong><span>בלי הבטחה לתוצאה ובלי לחץ מלאכותי.</span></li>
        </ul>
        <div class="hero__lawyer-access"><span>לעורכי דין:</span><a href="#">כניסה לאזור האישי</a><a href="#">מסלולי הצטרפות</a></div>
      </div>
    </div>
  </section>
  <section class="homepage-intent-pyramid section" id="homepage-intent-pyramid">
    <div class="container">
      <div class="section-header section-header--split">
        <div>
          <p class="section-header__eyebrow">חיפוש משפטי לפי כוונה</p>
          <h2>התחילו מהבעיה המשפטית, ואז עברו למדריך או לעורך דין</h2>
          <p class="section-header__desc">העמוד הראשי מחבר בין מצבים נפוצים לבין מסלולי פעולה ברורים: מדריך מקצועי, בדיקת מסמכים ראשונית, פרופילים בתחום ופנייה מסודרת.</p>
        </div>
        <a class="section-header__link button button--primary" href="#">חיפוש עורכי דין</a>
      </div>
      <div class="homepage-situation-router">
        <div class="homepage-situation-router__intro">
          <p class="section-header__eyebrow">לא חייבים לדעת את שם התחום</p>
          <h3>בחרו לפי מה שקרה לכם עכשיו</h3>
          <p>אנשים רבים מגיעים עם מכתב, זימון, חוב, פציעה או סכסוך ולא עם הגדרה משפטית. התחילו מהמצב, קראו מה להכין, ואז החליטו אם צריך מדריך או עורך דין.</p>
        </div>
        <div class="homepage-situation-router__grid">
          <a class="homepage-situation-card" href="#"><strong>קיבלתם מכתב או דרישת תשלום</strong><span>התחילו מהתאריך האחרון לתגובה וממה שמבקשים מכם לעשות.</span></a>
          <a class="homepage-situation-card" href="#"><strong>זומנתם לחקירה או להליך פלילי</strong><span>רשמו מי הזמין, מתי ובאיזה נושא לפני שמחליטים מה לומר.</span></a>
          <a class="homepage-situation-card" href="#"><strong>יש בעיה בעבודה</strong><span>אספו תלושי שכר, חוזה, זימון לשימוע והודעות מהמעסיק.</span></a>
          <a class="homepage-situation-card" href="#"><strong>המשפחה או הזוגיות הסתבכו</strong><span>כתבו מה דחוף עכשיו: ילדים, מזונות, רכוש או הסכם לבדיקה.</span></a>
          <a class="homepage-situation-card" href="#"><strong>חוב, עיקול או הוצאה לפועל</strong><span>בדקו מספר תיק, סכום, מועד אחרון ומי פתח את ההליך.</span></a>
          <a class="homepage-situation-card" href="#"><strong>פציעה, ביטוח או ביטוח לאומי</strong><span>שמרו אישורים רפואיים, תאריכים והודעות מהמוסד או מהביטוח.</span></a>
        </div>
      </div>
      <div class="homepage-intent-pyramid__grid">
${['עורך דין פלילי', 'עורך דין משפחה וגירושין', 'עורך דין מקרקעין'].map((title) => `
        <article class="homepage-intent-card">
          <div class="homepage-intent-card__top"><span class="homepage-intent-card__priority">גבוה</span><h3><a href="#">${title}</a></h3></div>
          <p class="homepage-intent-card__intent">מסלול לדוגמה שמציג בעיה נפוצה, מדריך מתאים ופרופילים בתחום.</p>
          <div class="homepage-intent-card__prep">
            <p><strong>מה להכין:</strong> מסמכים, תאריכים, הודעות וכל פרט שיעזור להבין את הדחיפות.</p>
            <p><strong>מתי לפנות מהר:</strong> כשיש מועד קרוב, חקירה, חתימה, תשלום, עיקול או שינוי מצב משמעותי.</p>
          </div>
          <div class="homepage-intent-card__actions"><a class="button button--gold" href="#">קריאת מדריך</a><a class="button button--ghost" href="#">פרופילים בתחום</a></div>
          <div class="homepage-intent-card__links"><strong>מדריכים קשורים</strong><ul><li><a href="#">מדריך קשור לדוגמה</a></li><li><a href="#">בדיקת מסמכים ראשונית</a></li></ul></div>
        </article>`).join('')}
      </div>
      <div class="homepage-intent-pyramid__lawyer-path">
        <div>
          <p class="homepage-intent-pyramid__label">למשרדי עורכי דין</p>
          <h3>פרופיל, פניות ואזור אישי במקום אחד</h3>
          <p>עורך דין יכול להתחיל בהרשמה, לבחור מסלול חשיפה ולנהל פרטי פרופיל ופניות באזור האישי. זה נשאר נתיב צדדי ולא מחליף את העזרה לציבור.</p>
        </div>
        <div class="homepage-intent-pyramid__lawyer-actions"><a class="button button--primary" href="#">מסלולי עורכי דין</a><a class="button button--ghost" href="#">פתיחת פרופיל</a></div>
      </div>
      <p class="homepage-intent-pyramid__trust-note">המידע באתר נועד לעזור להבין את הצעד הבא ולהגיע לשיחה מסודרת יותר. הוא כללי ואינו מחליף ייעוץ משפטי אישי מעורך דין שמכיר את פרטי המקרה.</p>
    </div>
  </section>
</body>
</html>
`;
}

function buildMarkdown({ reportDate, files }) {
  return [
    `# Homepage human-help visual QA preview - ${reportDate}`,
    '',
    `Status: ${STATUS}`,
    '',
    'This is an internal static preview for browser QA of the new homepage blocks. It is not a WordPress page, not a public CMS update and not a deployment.',
    '',
    '## What this preview checks',
    '',
    '| ID | Selector | Viewport | Expectation | Status |',
    '| --- | --- | --- | --- | --- |',
    ...qaRows.map((row) => `| ${row.id} | \`${row.selector}\` | ${row.viewport} | ${row.expectation} | ${row.status} |`),
    '',
    '## Files',
    '',
    `- Preview HTML: \`${relativePath(files.html)}\``,
    `- Report JSON: \`${relativePath(files.reportJson)}\``,
    '',
    '## Safety',
    '',
    '- No public CMS, database, SEO, URL, redirect, canonical, noindex, sitemap, taxonomy, CRM, profile, lead, contact, payment or uPress action.',
    '- The choosing-lawyer guide content is not included or edited by this preview.',
    '- Browser QA must still be followed by owner approval before deployment.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-homepage-human-help-visual-qa-preview.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    previewHtml: relativePath(files.html),
    qaRows: qaRows.length,
    publicCmsChangesApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    liveRevenueImpactPercent: 0,
    readinessToProfitPercent: 72,
  };

  writeText(files.html, buildHtml({ reportDate: args.reportDate }));
  writeText(files.md, buildMarkdown({ reportDate: args.reportDate, files }));
  writeText(files.csv, toCsv(qaRows, ['id', 'selector', 'viewport', 'expectation', 'status']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, rows: qaRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary)));

  console.log(JSON.stringify(summary, null, 2));
}

main();
