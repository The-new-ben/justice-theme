import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

const TARGETS = [
  {
    id: 'CPD-01',
    slug: 'divorce-lawyer-tel-aviv',
    targetPath: '/divorce-lawyer-tel-aviv/',
    titleHe: 'עורך דין גירושין בתל אביב',
    cityHe: 'תל אביב',
    practiceHe: 'גירושין ודיני משפחה',
    citySlug: 'tel-aviv',
    practiceSlug: 'family-law',
    pillarPath: '/divorce-lawyer/',
    directoryPath: '/lawyers/?city=tel-aviv&practice=family-law',
    draftRole:
      'עמוד עזר מקומי ותמציתי שמפנה לעמוד הגירושין המרכזי ואינו מנסה להיות מדריך גירושין מלא.',
    introDraft:
      'טיוטת עבודה פרטית: אם אתם מחפשים עורך דין גירושין בתל אביב, העמוד הזה אמור לעזור להבין אילו שאלות ומסמכים כדאי להכין לפני פנייה מסודרת. הוא לא מחליף ייעוץ משפטי, ולא אמור להתחרות במדריך הגירושין המרכזי של Jus-Tice.',
    evidenceChecklist:
      'פרטי הצדדים והילדים, מסמכי הליכים קיימים אם יש, הסכמות או מחלוקות מרכזיות, מסמכים כלכליים בסיסיים, מועדי דיון או פניות קודמות, ושאלות שהגולש רוצה לברר מול עורך דין.',
    fitTrigger:
      'כאשר יש הליך פתוח, מועד קרוב, מחלוקת משמעותית או צורך להבין התאמה לעורך דין בתחום המשפחה בעיר או בסביבה.',
    faqCandidates:
      'איך יודעים אם צריך עורך דין גירושין מקומי? | אילו מסמכים כדאי להכין לפני פנייה? | מתי לקרוא קודם את מדריך הגירושין המרכזי?',
  },
  {
    id: 'CPD-02',
    slug: 'criminal-lawyer-jerusalem',
    targetPath: '/criminal-lawyer-jerusalem/',
    titleHe: 'עורך דין פלילי בירושלים',
    cityHe: 'ירושלים',
    practiceHe: 'משפט פלילי',
    citySlug: 'jerusalem',
    practiceSlug: 'criminal-law',
    pillarPath: '/criminal-lawyer/',
    directoryPath: '/lawyers/?city=jerusalem&practice=criminal-law',
    draftRole:
      'עמוד עזר מקומי למצבי חקירה, מעצר או כתב אישום, עם הפניה לעמוד הפלילי המרכזי ולבדיקת התאמה.',
    introDraft:
      'טיוטת עבודה פרטית: אם אתם או בן משפחה מתמודדים עם שאלה פלילית באזור ירושלים, העמוד הזה אמור לעזור לארגן את המידע לפני פנייה לעורך דין. הוא לא ייעוץ משפטי, לא מבטיח תוצאה, ולא מחליף את עמוד המשפט הפלילי המרכזי של Jus-Tice.',
    evidenceChecklist:
      'זימון לחקירה או דיון, כתב אישום אם קיים, פרוטוקול או החלטה אחרונה, פרטי תחנת משטרה או בית משפט אם ידועים, מועדים קרובים, ומסמכים שהתקבלו מגורם רשמי.',
    fitTrigger:
      'כאשר יש חקירה, מעצר, כתב אישום, דיון קרוב או צורך להבין במהירות איזה סוג ליווי משפטי עשוי להתאים.',
    faqCandidates:
      'מה להכין לפני שיחה עם עורך דין פלילי? | מתי פונים לסניגוריה ציבורית ומתי לעורך דין פרטי? | למה חשוב לציין מועדים ומסמכים רשמיים?',
  },
];

const SOURCE_ROWS = [
  {
    id: 'SRC-001',
    targetSlug: 'divorce-lawyer-tel-aviv',
    type: 'official',
    title: 'קבלת תעודת גירושין - בתי הדין הרבניים',
    url: 'https://www.gov.il/he/service/obtaining-divorce-certificate',
    useFor: 'source prompt for official-document language and evidence checklist only',
    boundary: 'Do not turn certificate-service details into legal advice or deadline claims.',
  },
  {
    id: 'SRC-002',
    targetSlug: 'divorce-lawyer-tel-aviv',
    type: 'official',
    title: 'בקשה לסיוע משפטי - סיוע משפטי',
    url: 'https://www.gov.il/he/service/legal_aid_application',
    useFor: 'source prompt for eligibility-sensitive wording and urgent-family-matter caveats',
    boundary: 'Do not claim eligibility; invite users to verify with official service or lawyer.',
  },
  {
    id: 'SRC-003',
    targetSlug: 'divorce-lawyer-tel-aviv',
    type: 'official',
    title: 'יחידות הסיוע ליד בתי המשפט ובתי הדין',
    url: 'https://www.gov.il/he/departments/Units/molsa-court-assiatance-units',
    useFor: 'source prompt for non-adversarial family-dispute context',
    boundary: 'Do not describe a mandatory process unless legal/editor review confirms the exact case type.',
  },
  {
    id: 'SRC-004',
    targetSlug: 'divorce-lawyer-tel-aviv',
    type: 'competitor',
    title: 'מורן גוהר - עורך דין גירושין בתל אביב',
    url: 'https://www.goharlaw.com/',
    useFor: 'SERP positioning reference: competitor pages lead with credentials, family-court experience and local service framing',
    boundary: 'Do not copy claims, rankings, testimonials, case outcomes, pricing or personal positioning.',
  },
  {
    id: 'SRC-005',
    targetSlug: 'divorce-lawyer-tel-aviv',
    type: 'competitor',
    title: 'מאיה רוטנברג - עורך דין גירושין',
    url: 'https://rotenberglaw.co.il/',
    useFor: 'SERP positioning reference: competitor pages often use experience, process reassurance and city coverage',
    boundary: 'Do not copy claims, price ranges, badges, testimonials or outcome promises.',
  },
  {
    id: 'SRC-006',
    targetSlug: 'criminal-lawyer-jerusalem',
    type: 'official',
    title: 'בקשת ייצוג על ידי הסניגוריה הציבורית',
    url: 'https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office',
    useFor: 'source prompt for official criminal-procedure document checklist and representation caveat',
    boundary: 'Do not claim eligibility; mention only that official routes may exist and require verification.',
  },
  {
    id: 'SRC-007',
    targetSlug: 'criminal-lawyer-jerusalem',
    type: 'official',
    title: 'חוות דעת ועמדות רשמיות - הסניגוריה הציבורית',
    url: 'https://www.gov.il/he/departments/dynamiccollectors/official_opinions_and_positions',
    useFor: 'source prompt for rights-sensitive language around suspects, defendants and criminal process',
    boundary: 'Do not summarize legal rights as instructions without legal review.',
  },
  {
    id: 'SRC-008',
    targetSlug: 'criminal-lawyer-jerusalem',
    type: 'competitor',
    title: 'דוד הלוי - עורך דין פלילי ירושלים',
    url: 'https://halevi-law.co.il/',
    useFor: 'SERP positioning reference: competitor pages highlight case types, urgency and defense review',
    boundary: 'Do not copy case lists, media mentions, client praise or aggressive promises.',
  },
  {
    id: 'SRC-009',
    targetSlug: 'criminal-lawyer-jerusalem',
    type: 'competitor',
    title: 'רמי בן חמו - עורך דין פלילי בירושלים',
    url: 'https://rbh-law.co.il/',
    useFor: 'SERP positioning reference: competitor pages emphasize availability, discretion and local office presence',
    boundary: 'Do not copy availability promises, slogans, personal claims or guarantees.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    baseUrl: DEFAULT_BASE_URL,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length).replace(/\/$/, '');
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
  const base = `city-practice-priority-draft-briefs-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    outlineMd: path.join(ROOT, '.project-control', `city-practice-priority-draft-outline-he-${reportDate}.md`),
  };
}

function readText(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : '';
}

function extractFirstH1(html) {
  const match = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripHtml(match[1]) : '';
}

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

async function fetchLive(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_priority_draft=${Date.now()}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceCityPracticeDraftBrief/1.0; +https://jus-tice.co.il/)',
      },
    });
    const html = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      title: extractTitle(html),
      h1: extractFirstH1(html),
      wordEstimate: countWords(stripHtml(html)),
    };
  } catch (error) {
    return {
      ok: false,
      status: 'ERROR',
      finalUrl: url,
      title: '',
      h1: '',
      wordEstimate: 0,
      error: error.name === 'AbortError' ? 'timeout' : error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function buildLiveRows(baseUrl) {
  const rows = [];
  for (const target of TARGETS) {
    const pillarUrl = new URL(target.pillarPath, baseUrl).toString();
    const targetUrl = new URL(target.targetPath, baseUrl).toString();
    const [pillar, targetPage] = await Promise.all([fetchLive(pillarUrl), fetchLive(targetUrl)]);

    rows.push({
      id: `${target.id}-PILLAR`,
      slug: target.slug,
      url: pillarUrl,
      role: 'central_pillar_live_check',
      status: pillar.status,
      final_url: pillar.finalUrl,
      title: pillar.title,
      h1: pillar.h1,
      word_estimate: pillar.wordEstimate,
      gate: pillar.ok ? 'PASS_PILLAR_REACHABLE' : 'BLOCKED_PILLAR_NOT_REACHABLE',
      note: 'Pillar must stay the primary canonical/help page for the practice topic.',
    });

    rows.push({
      id: `${target.id}-TARGET`,
      slug: target.slug,
      url: targetUrl,
      role: 'draft_target_public_exposure_check',
      status: targetPage.status,
      final_url: targetPage.finalUrl,
      title: targetPage.title,
      h1: targetPage.h1,
      word_estimate: targetPage.wordEstimate,
      gate: targetPage.ok ? 'REVIEW_TARGET_ALREADY_PUBLIC' : 'PASS_TARGET_NOT_PUBLIC_200',
      note: 'Target should remain private/draft until evidence, lawyer coverage, legal review and owner approval exist.',
    });
  }
  return rows;
}

function buildBriefRows(liveRows) {
  return TARGETS.map((target) => {
    const targetLive = liveRows.find((row) => row.slug === target.slug && row.role === 'draft_target_public_exposure_check');
    const pillarLive = liveRows.find((row) => row.slug === target.slug && row.role === 'central_pillar_live_check');
    const officialCount = SOURCE_ROWS.filter((row) => row.targetSlug === target.slug && row.type === 'official').length;
    const competitorCount = SOURCE_ROWS.filter((row) => row.targetSlug === target.slug && row.type === 'competitor').length;

    return {
      id: target.id,
      slug: target.slug,
      title_he: target.titleHe,
      city_he: target.cityHe,
      practice_he: target.practiceHe,
      pillar_path: target.pillarPath,
      directory_path: target.directoryPath,
      target_public_status: targetLive?.status ?? '',
      target_public_gate: targetLive?.gate ?? '',
      pillar_status: pillarLive?.status ?? '',
      official_sources: officialCount,
      competitor_sources: competitorCount,
      draft_role: target.draftRole,
      intro_draft_private: target.introDraft,
      evidence_checklist_private: target.evidenceChecklist,
      lawyer_fit_trigger_private: target.fitTrigger,
      internal_link_plan:
        `${target.pillarPath} as primary pillar | ${target.directoryPath} as filtered lawyer path | no new internal links until owner/SEO review`,
      faq_candidates_require_evidence: target.faqCandidates,
      publication_blockers:
        'GSC query/page evidence, internal overlap check, filtered lawyer count, legal/editor review, owner approval, and no public-exposure accident.',
      forbidden_public_claims:
        'No best/recommended/ranked lawyer claims, no guarantee, no copied competitor claims, no prices, no legal deadlines and no advice without verified legal review.',
    };
  });
}

function buildGateRows(liveRows, reportDate) {
  const previousPacketExists = existsSync(
    path.join(ROOT, '.reports', `city-practice-thin-page-improvement-packet-${reportDate}.json`),
  );
  const targetPublicRows = liveRows.filter((row) => row.role === 'draft_target_public_exposure_check');
  const publicTargetRows = targetPublicRows.filter((row) => row.gate === 'REVIEW_TARGET_ALREADY_PUBLIC');
  const blockedPillars = liveRows.filter((row) => row.role === 'central_pillar_live_check' && row.gate !== 'PASS_PILLAR_REACHABLE');
  const officialSources = SOURCE_ROWS.filter((row) => row.type === 'official').length;
  const competitorSources = SOURCE_ROWS.filter((row) => row.type === 'competitor').length;

  return [
    {
      id: 'CPD-GATE-01',
      gate: 'previous_city_practice_packet_exists',
      status: previousPacketExists ? 'PASS' : 'BLOCKED',
      evidence: previousPacketExists
        ? 'Prior city/practice thin-page packet exists in .reports.'
        : 'Prior city/practice thin-page packet missing for today.',
      next_action: previousPacketExists ? 'Use its target order and blockers.' : 'Regenerate the prior packet first.',
    },
    {
      id: 'CPD-GATE-02',
      gate: 'priority_targets_not_public_200',
      status: publicTargetRows.length ? 'REVIEW' : 'PASS',
      evidence: publicTargetRows.length
        ? `${publicTargetRows.length} target URL(s) returned live 200.`
        : `${targetPublicRows.length}/${TARGETS.length} target URLs checked and none returned live 200.`,
      next_action: publicTargetRows.length
        ? 'Inspect accidental public exposure before creating any draft.'
        : 'Keep all target work private until approvals exist.',
    },
    {
      id: 'CPD-GATE-03',
      gate: 'central_pillars_reachable',
      status: blockedPillars.length ? 'BLOCKED' : 'PASS',
      evidence: blockedPillars.length
        ? `${blockedPillars.length} pillar URL(s) failed live reachability.`
        : `${TARGETS.length}/${TARGETS.length} central pillar URLs reachable.`,
      next_action: blockedPillars.length
        ? 'Fix/confirm the pillar before drafting a subordinate local page.'
        : 'Keep local draft subordinate to the reachable pillar.',
    },
    {
      id: 'CPD-GATE-04',
      gate: 'source_scaffold_ready',
      status: officialSources >= 4 && competitorSources >= 4 ? 'PASS' : 'REVIEW',
      evidence: `${officialSources} official source prompts and ${competitorSources} competitor source prompts recorded.`,
      next_action: 'Use sources for direction and guardrails only; no copying or legal advice.',
    },
  ];
}

function buildProjectMarkdown({ reportDate, status, gateRows, liveRows, briefRows }) {
  const summary = [
    `# City/Practice Priority Draft Briefs - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    'Scope: private owner/editor draft brief packet for the first two approved city/practice targets. It does not publish content, edit WordPress, change SEO settings, contact leads/lawyers, create CRM records, send email, or deploy.',
    '',
    '## Summary',
    '',
    `- Priority targets: ${briefRows.length}.`,
    `- Static/live gates: ${gateRows.filter((row) => row.status === 'PASS').length}/${gateRows.length} pass.`,
    `- Own-site live checks: ${liveRows.length}.`,
    `- Source prompts: ${SOURCE_ROWS.length} total; ${SOURCE_ROWS.filter((row) => row.type === 'official').length} official; ${SOURCE_ROWS.filter((row) => row.type === 'competitor').length} competitor.`,
    '- Public actions: 0 CMS writes, 0 public page changes, 0 SEO setting changes, 0 CRM/contact/payment/email actions.',
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Live Own-Site Checks',
    '',
    '| ID | Slug | Role | Status | Gate | URL | H1 |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...liveRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.role)} | ${mdCell(row.status)} | ${mdCell(row.gate)} | ${mdCell(row.url)} | ${mdCell(row.h1)} |`,
    ),
    '',
    '## Draft Brief Rows',
    '',
    '| ID | Slug | Title | Target Gate | Pillar | Draft Role | Publication Blockers |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...briefRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.title_he)} | ${mdCell(row.target_public_gate)} | ${mdCell(row.pillar_path)} | ${mdCell(row.draft_role)} | ${mdCell(row.publication_blockers)} |`,
    ),
    '',
    '## Source Prompts',
    '',
    '| ID | Target | Type | Title | URL | Use For | Boundary |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...SOURCE_ROWS.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.targetSlug)} | ${mdCell(row.type)} | ${mdCell(row.title)} | ${mdCell(row.url)} | ${mdCell(row.useFor)} | ${mdCell(row.boundary)} |`,
    ),
    '',
    '## Review',
    '',
    'The two priority city/practice targets are ready for private owner/editor drafting, not publication. The safest next move is to fill GSC/internal-overlap/lawyer-coverage evidence for one target, then convert only that target into a legal-reviewed Hebrew draft. Competitor pages suggest that the SERP is commercially strong, but their claims should be used only to understand user expectations, never copied.',
    '',
  ];

  return summary.join('\n');
}

function buildOutlineMarkdown(reportDate, briefRows) {
  const sections = [
    `# טיוטות עבודה פרטיות לעמודי עיר/תחום - ${reportDate}`,
    '',
    'סטטוס: טיוטת מערכת פנימית בלבד. לא לפרסום, לא להעלאה ל-CMS, ולא לשימוש כייעוץ משפטי.',
    '',
  ];

  for (const row of briefRows) {
    sections.push(
      `## ${row.title_he}`,
      '',
      `**תפקיד העמוד:** ${row.draft_role}`,
      '',
      `**פתיחה אפשרית:** ${row.intro_draft_private}`,
      '',
      `**רשימת הכנה לגולש:** ${row.evidence_checklist_private}`,
      '',
      `**מתי לבדוק התאמה לעורך דין:** ${row.lawyer_fit_trigger_private}`,
      '',
      `**תכנית קישורים פנימית:** ${row.internal_link_plan}`,
      '',
      `**שאלות FAQ אפשריות, דורשות אימות:** ${row.faq_candidates_require_evidence}`,
      '',
      `**חסמי פרסום:** ${row.publication_blockers}`,
      '',
      `**אסור בפרסום:** ${row.forbidden_public_claims}`,
      '',
    );
  }

  return `${sections.join('\n').trimEnd()}\n`;
}

function printHelp() {
  console.log('Usage: node tools/build-city-practice-priority-draft-briefs.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  readText('inc/city-practice-pages.php');
  readText('page-city-practice.php');

  const files = outputFiles(args.reportDate);
  const liveRows = await buildLiveRows(args.baseUrl);
    const gateRows = buildGateRows(liveRows, args.reportDate);
    const briefRows = buildBriefRows(liveRows);
    const reviewGateCount = gateRows.filter((row) => row.status === 'REVIEW').length;
    const blockedGateCount = gateRows.filter((row) => row.status === 'BLOCKED').length;
    const status = blockedGateCount
      ? 'CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_BLOCKED_NO_PUBLIC_CHANGE'
      : reviewGateCount
        ? 'CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_READY_WITH_PUBLIC_REVIEW_GATE_NO_PUBLIC_CHANGE'
        : 'CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_READY_NO_PUBLIC_CHANGE';

  const report = {
    reportDate: args.reportDate,
    status,
    targetCount: briefRows.length,
    liveCheckCount: liveRows.length,
    gateCount: gateRows.length,
    passGateCount: gateRows.filter((row) => row.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    officialSourceCount: SOURCE_ROWS.filter((row) => row.type === 'official').length,
    competitorSourceCount: SOURCE_ROWS.filter((row) => row.type === 'competitor').length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    gates: gateRows,
    liveRows,
    briefRows,
    sourceRows: SOURCE_ROWS,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildProjectMarkdown({ reportDate: args.reportDate, status, gateRows, liveRows, briefRows }));
  writeText(
    files.projectCsv,
    toCsv(briefRows, [
      'id',
      'slug',
      'title_he',
      'city_he',
      'practice_he',
      'pillar_path',
      'directory_path',
      'target_public_status',
      'target_public_gate',
      'pillar_status',
      'official_sources',
      'competitor_sources',
      'draft_role',
      'intro_draft_private',
      'evidence_checklist_private',
      'lawyer_fit_trigger_private',
      'internal_link_plan',
      'faq_candidates_require_evidence',
      'publication_blockers',
      'forbidden_public_claims',
    ]),
  );
  writeText(files.outlineMd, buildOutlineMarkdown(args.reportDate, briefRows));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(
    files.reportCsv,
    toCsv(
      [
        ...gateRows.map((row) => ({ row_type: 'gate', ...row })),
        ...liveRows.map((row) => ({ row_type: 'live', ...row })),
        ...briefRows.map((row) => ({ row_type: 'brief', ...row })),
        ...SOURCE_ROWS.map((row) => ({ row_type: 'source', ...row })),
      ],
      [
        'row_type',
        'id',
        'slug',
        'targetSlug',
        'gate',
        'status',
        'role',
        'type',
        'title',
        'title_he',
        'url',
        'pillar_path',
        'target_public_gate',
        'evidence',
        'next_action',
        'useFor',
        'boundary',
        'publication_blockers',
      ],
    ),
  );

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        status: report.status,
        targetCount: report.targetCount,
        liveCheckCount: report.liveCheckCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        officialSourceCount: report.officialSourceCount,
        competitorSourceCount: report.competitorSourceCount,
        publicChangesApproved: report.publicChangesApproved,
        cmsWritesApproved: report.cmsWritesApproved,
        seoSettingsChanged: report.seoSettingsChanged,
        emailsSent: report.emailsSent,
        upressDeploymentRequired: report.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
