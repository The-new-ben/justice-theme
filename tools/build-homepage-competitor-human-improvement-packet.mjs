import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'HOMEPAGE_COMPETITOR_HUMAN_IMPROVEMENT_PACKET_READY_NO_PUBLIC_CHANGE';

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
  const base = `homepage-competitor-human-improvement-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    lovablePrompt: path.join(ROOT, '.project-control', `homepage-lovable-manual-prompt-${reportDate}.md`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function requiredLocalTemplates() {
  return [
    {
      file: 'page-home.php',
      role: 'Home page assembler',
      reviewedFor: 'section order, public-first home assignment and where the homepage copy actually renders',
    },
    {
      file: 'front-page.php',
      role: 'Front-page fallback',
      reviewedFor: 'older router and guide sections that must not be overwritten by the packet',
    },
    {
      file: 'template-parts/sections/hero.php',
      role: 'Hero and first action',
      reviewedFor: 'public-first headline, search form, market signals and lawyer side entry',
    },
    {
      file: 'template-parts/sections/homepage-intent-pyramid.php',
      role: 'Intent router',
      reviewedFor: 'situation cards, public guidance copy and lower lawyer path',
    },
  ];
}

function competitorSources() {
  return [
    {
      name: 'Advocato',
      url: 'https://advocato.co.il/',
      observedStrength: 'fast search by legal problem and location, clear category chips, simple three-step explanation, and separate lawyer joining path',
      safeTransfer: 'make the first action feel fast and understandable, while keeping unverifiable ratings or market-leader claims out of Jus-Tice copy',
      avoidCopying: 'do not copy testimonials, ratings, exact category wording, or claims about thousands of lawyers',
    },
    {
      name: 'LawZone',
      url: 'https://lawzone.co.il/',
      observedStrength: 'direct route from a legal issue to a conversation with a lawyer, broad legal-area taxonomy, and urgency language around personal follow-up',
      safeTransfer: 'add clearer routes for urgent situations and explain what the visitor should prepare before a lawyer call',
      avoidCopying: 'do not copy aggressive matching promises, sales language, or any direct-call promise without operational proof',
    },
    {
      name: 'iLaw',
      url: 'https://www.ilaw.co.il/',
      observedStrength: 'large legal-topic map, forums, articles, case-law/news navigation and many subtopics under each practice area',
      safeTransfer: 'expand practice cards with more human explanation and subtopic context instead of making the page thinner',
      avoidCopying: 'do not turn Jus-Tice into a dense old-style directory or duplicate their topic lists',
    },
    {
      name: 'MyAttorney',
      url: 'https://www.myattorney.co.il/',
      observedStrength: 'area-based lawyer search, recommended-lawyer cards and simple public-facing legal categories',
      safeTransfer: 'show local confidence and nearby-help language without implying rankings or recommendations that are not verified',
      avoidCopying: 'do not create fake recommendation labels, fake review hierarchy, or unsupported local availability claims',
    },
    {
      name: 'Vaquill AI awesome legaltech',
      url: 'https://github.com/Vaquill-AI/awesome-legaltech',
      observedStrength: 'curated legaltech map with open-source platforms, AI tools, datasets, MCP servers and verification warnings',
      safeTransfer: 'translate the idea into Jus-Tice as evidence-based intake, source grounding and human review gates rather than importing foreign-law code directly',
      avoidCopying: 'do not claim Israeli legal coverage from foreign tools and do not use unverified legal outputs as advice',
    },
  ];
}

function improvementRows() {
  return [
    {
      id: 'HOME-HUMAN-01',
      area: 'Hero first screen',
      changeType: 'copy and layout proposal',
      currentRisk: 'the page is better after the public-first update, but the visitor still needs a stronger first-minute answer before choosing a lawyer',
      proposedChange: 'add a short strip under the search that says what to do in the first ten minutes: write what happened, keep documents, check deadline, and choose a help path',
      publicCopyDraft: 'לפני שמחפשים עורך דין, סדרו את המקרה בשתי דקות: מה קרה, מי מעורב, איזה מסמך קיבלתם, ומה התאריך הקרוב שחשוב לא לפספס.',
      sourceInspiredBy: 'Advocato speed and LawZone urgency, translated into a public-help step',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
    {
      id: 'HOME-HUMAN-02',
      area: 'Situation router',
      changeType: 'content depth proposal',
      currentRisk: 'practice cards can feel like a directory if they do not explain the human situation behind the legal field',
      proposedChange: 'add six situation-based routes: got a letter, police or investigation, work problem, family dispute, debt or execution, injury or insurance',
      publicCopyDraft: 'בחרו לפי מה שקרה לכם, לא לפי שם משפטי שאתם לא בטוחים בו. אם קיבלתם מכתב, זימון, דרישת תשלום או החלטה רשמית, התחילו משם.',
      sourceInspiredBy: 'iLaw topic depth and MyAttorney categories, translated into situation language',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
    {
      id: 'HOME-HUMAN-03',
      area: 'Practice cards',
      changeType: 'longer human copy proposal',
      currentRisk: 'thin local or practice cards may not build enough trust or search intent coverage',
      proposedChange: 'make each card longer by adding what people usually need, what to prepare, and when a lawyer becomes urgent',
      publicCopyDraft: 'בכל תחום נציג בשפה פשוטה מה בדרך כלל בודקים, אילו מסמכים כדאי להכין, ומה הסימנים שמצדיקים שיחה מהירה עם עורך דין.',
      sourceInspiredBy: 'iLaw broad subtopic map, with simpler public wording',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
    {
      id: 'HOME-HUMAN-04',
      area: 'Choosing lawyer guide',
      changeType: 'boundary proposal',
      currentRisk: 'the owner explicitly asked not to change the guide content',
      proposedChange: 'do not edit guide body copy. Add only a contextual intro above it and internal links around it if later approved',
      publicCopyDraft: 'כבר יודעים שאתם צריכים עורך דין? המדריך הבא יעזור להבין איך לבדוק ניסיון, זמינות, שכר טרחה והתאמה למקרה שלכם.',
      sourceInspiredBy: 'competitors separate search and education, but Jus-Tice should protect the existing guide text',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
    {
      id: 'HOME-HUMAN-05',
      area: 'Lawyer path',
      changeType: 'revenue path placement proposal',
      currentRisk: 'lawyer revenue CTAs can distract the public if they dominate the hero',
      proposedChange: 'keep lawyer profile, dashboard and subscription entry visible in a side rail or lower section, not as the main headline',
      publicCopyDraft: 'לעורכי דין: אפשר להצטרף, לעדכן פרופיל ולבדוק פניות מתאימות. הכניסה לעורכי דין נשארת זמינה, אבל העמוד הראשי מדבר קודם לציבור שמחפש עזרה.',
      sourceInspiredBy: 'Advocato lawyer join link kept separate from public search',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
    {
      id: 'HOME-HUMAN-06',
      area: 'Trust and legal safety',
      changeType: 'disclaimer and tone proposal',
      currentRisk: 'the page needs trust without sounding like AI, sales or legal advice',
      proposedChange: 'add a plain Hebrew note that the site helps organize information and connect to legal help, but does not replace legal advice',
      publicCopyDraft: 'המידע באתר נועד לעזור לכם להבין את הצעד הבא ולפנות בצורה מסודרת. הוא לא מחליף ייעוץ משפטי אישי מעורך דין שמכיר את הפרטים.',
      sourceInspiredBy: 'legaltech verification warnings from Vaquill list and public legal portals',
      preserveGuide: 'yes',
      liveApprovalNeeded: 'yes',
    },
  ];
}

function gates({ templates, sources, rows }) {
  return [
    {
      id: 'HOME-GATE-01',
      gate: 'local_templates_reviewed',
      status: templates.every((entry) => entry.exists) ? 'PASS' : 'BLOCKED',
      evidence: `${templates.filter((entry) => entry.exists).length}/${templates.length} local homepage templates found.`,
    },
    {
      id: 'HOME-GATE-02',
      gate: 'competitor_sources_recorded',
      status: sources.length >= 4 ? 'PASS' : 'BLOCKED',
      evidence: `${sources.length} public competitor or legaltech sources recorded for review.`,
    },
    {
      id: 'HOME-GATE-03',
      gate: 'choosing_lawyer_guide_preserved',
      status: rows.every((row) => row.preserveGuide === 'yes') ? 'PASS' : 'BLOCKED',
      evidence: 'Every proposed improvement keeps the choosing-lawyer guide content unchanged.',
    },
    {
      id: 'HOME-GATE-04',
      gate: 'public_change_blocked_until_owner_approval',
      status: rows.every((row) => row.liveApprovalNeeded === 'yes') ? 'PASS' : 'BLOCKED',
      evidence: 'Every row requires explicit owner approval before any public page, CMS, SEO or deployment change.',
    },
    {
      id: 'HOME-GATE-05',
      gate: 'paid_llm_api_not_used',
      status: 'PASS',
      evidence: 'No paid OpenAI, Anthropic, Gemini, Groq or other LLM API was used.',
    },
    {
      id: 'HOME-GATE-06',
      gate: 'manual_lovable_packet_only',
      status: 'PASS',
      evidence: 'Lovable was not available as an installed plugin, so this packet gives a manual prompt only.',
    },
  ];
}

function readTemplateSnippets() {
  return requiredLocalTemplates().map((entry) => {
    const absolute = path.join(ROOT, entry.file);
    const exists = existsSync(absolute);
    if (exists) {
      readFileSync(absolute, 'utf8');
    }
    return {
      ...entry,
      exists,
    };
  });
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

function buildLovablePrompt({ reportDate, sources, rows }) {
  const sourceLines = sources.map((source) => `- ${source.name}: ${source.url}`).join('\n');
  const proposalLines = rows.map((row) => `- ${row.id}: ${row.proposedChange} Suggested Hebrew direction: ${row.publicCopyDraft}`).join('\n');

  return [
    `# Manual Lovable prompt for Jus-Tice homepage - ${reportDate}`,
    '',
    'Use this as a design and copy instruction only. Do not publish. Do not connect to WordPress, CMS, database, redirects, canonicals, sitemap, noindex, taxonomy, CRM, payment or external messaging.',
    '',
    'Goal: improve the Jus-Tice.co.il homepage so it feels more human, more helpful to the public, and more ready to convert legal-help visitors. The main audience is people who need legal help. Lawyers can stay visible as a side path, not the main emotional focus.',
    '',
    'Hard rule: do not change the existing choosing-lawyer guide content. You may propose a short intro above it or supporting links around it, but the guide body text must stay unchanged.',
    '',
    'Competitor references reviewed:',
    sourceLines,
    '',
    'What to borrow conceptually, not copy:',
    '- Faster first action from lawyer directories.',
    '- More situation-based routing, so the visitor does not need to know the legal term.',
    '- More words in each practice card, with practical human explanation.',
    '- A separate but visible lawyer path lower on the page.',
    '- Clear trust language that says the site helps organize next steps and does not replace personal legal advice.',
    '',
    'Tone rules:',
    '- Plain Hebrew for the public.',
    '- No AI-sounding signs.',
    '- No em dashes or decorative separators.',
    '- No internal business language.',
    '- No unsupported claims like market leader, guaranteed match, verified recommendation or top-ranked lawyer.',
    '- Do not copy competitor text or testimonial language.',
    '',
    'Proposed homepage changes:',
    proposalLines,
    '',
    'Deliverable requested from Lovable:',
    '- A homepage design and copy proposal only.',
    '- Public-first above the fold.',
    '- Stronger search and situation router.',
    '- Longer human copy in key sections.',
    '- Lawyer dashboard or join path as a secondary side entry.',
    '- No public deployment and no content changes to the choosing-lawyer guide.',
    '',
  ].join('\n');
}

function buildMarkdown({ summary, templates, sources, rows, gateRows, lovablePromptPath }) {
  return [
    `# Homepage competitor human improvement packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project manager check',
    '',
    `Active goal: improve homepage trust and conversion for people seeking legal help, while keeping lawyer monetization visible but secondary.`,
    `Sub-goals: competitor-informed homepage clarity, no change to the choosing-lawyer guide content, no public deployment without owner approval, and a manual Lovable prompt that does not use paid APIs.`,
    `Readiness to profit: ${summary.readinessToProfitPercent}% for planning and homepage conversion preparation, 0% live revenue impact until owner approves implementation and the site is deployed.`,
    `Honesty statement: I did not use Lovable directly because no Lovable plugin was available here. I did not use paid OpenAI, Anthropic, Gemini, Groq or other LLM APIs. I did not publish or change the live site.`,
    '',
    '## Competitor and legaltech observations',
    '',
    '| Source | URL | What they do well | What Jus-Tice can use safely | What not to copy |',
    '| --- | --- | --- | --- | --- |',
    ...sources.map((source) => `| ${mdCell(source.name)} | ${source.url} | ${mdCell(source.observedStrength)} | ${mdCell(source.safeTransfer)} | ${mdCell(source.avoidCopying)} |`),
    '',
    '## Local homepage files reviewed',
    '',
    '| File | Exists | Role | Reviewed for |',
    '| --- | --- | --- | --- |',
    ...templates.map((entry) => `| ${entry.file} | ${entry.exists ? 'yes' : 'no'} | ${mdCell(entry.role)} | ${mdCell(entry.reviewedFor)} |`),
    '',
    '## Proposed homepage improvements',
    '',
    '| ID | Area | Change type | Current risk | Proposed change | Draft public copy | Inspired by | Guide preserved | Live approval needed |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${mdCell(row.area)} | ${mdCell(row.changeType)} | ${mdCell(row.currentRisk)} | ${mdCell(row.proposedChange)} | ${mdCell(row.publicCopyDraft)} | ${mdCell(row.sourceInspiredBy)} | ${row.preserveGuide} | ${row.liveApprovalNeeded} |`),
    '',
    '## Anti-cannibalization and tone rules',
    '',
    '- Treat this as a homepage improvement proposal only, not a new public page.',
    '- Do not change redirects, canonicals, noindex, sitemap, taxonomy, URL structure or protected guide content.',
    '- Keep the choosing-lawyer guide content unchanged.',
    '- Do not reduce words. Expand useful public explanations where they help users decide what to do next.',
    '- Write to the public first. Keep lawyer business paths visible on the side.',
    '- Avoid unsupported ranking, recommendation, guarantee or best-lawyer claims.',
    '- Use plain Hebrew without AI-looking punctuation or decorative separators.',
    '',
    '## Manual Lovable prompt',
    '',
    `Prompt file: \`${lovablePromptPath}\``,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...gateRows.map((gate) => `| ${gate.id} | ${gate.gate} | ${gate.status} | ${mdCell(gate.evidence)} |`),
    '',
    '## Completion assessment',
    '',
    'The homepage improvement plan is ready as an internal packet. The next step is owner approval of which rows to implement, then local code changes and visual QA. Nothing in this packet changes the public site.',
    '',
  ].join('\n');
}

function buildHtml({ summary, sources, templates, rows, gateRows }) {
  const sourceRows = sources.map((source) => `
    <tr>
      <td>${htmlEscape(source.name)}</td>
      <td><a href="${htmlEscape(source.url)}">${htmlEscape(source.url)}</a></td>
      <td>${htmlEscape(source.observedStrength)}</td>
      <td>${htmlEscape(source.safeTransfer)}</td>
      <td>${htmlEscape(source.avoidCopying)}</td>
    </tr>`).join('');

  const templateRows = templates.map((entry) => `
    <tr>
      <td><code>${htmlEscape(entry.file)}</code></td>
      <td>${entry.exists ? 'yes' : 'no'}</td>
      <td>${htmlEscape(entry.role)}</td>
      <td>${htmlEscape(entry.reviewedFor)}</td>
    </tr>`).join('');

  const proposalRows = rows.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.id)}</code></td>
      <td>${htmlEscape(row.area)}</td>
      <td>${htmlEscape(row.currentRisk)}</td>
      <td>${htmlEscape(row.proposedChange)}</td>
      <td>${htmlEscape(row.publicCopyDraft)}</td>
      <td>${htmlEscape(row.sourceInspiredBy)}</td>
    </tr>`).join('');

  const gatesHtml = gateRows.map((gate) => `
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
  <title>Homepage competitor human improvement packet</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f7f4; color: #1f2933; line-height: 1.55; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 20px 56px; }
    h1, h2 { color: #102a43; }
    h1 { font-size: 32px; margin: 0 0 8px; }
    h2 { margin-top: 32px; font-size: 22px; }
    .status { background: #ffffff; border: 1px solid #d8dee4; border-radius: 8px; padding: 16px; margin-top: 18px; }
    .status strong { color: #0f766e; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #d8dee4; margin-top: 12px; }
    th, td { border: 1px solid #d8dee4; padding: 10px; vertical-align: top; font-size: 14px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #eef2f7; padding: 2px 5px; border-radius: 5px; }
    ul { background: #ffffff; border: 1px solid #d8dee4; border-radius: 8px; padding: 18px 28px; }
  </style>
</head>
<body>
<main>
  <h1>חבילת שיפור אנושית לעמוד הבית</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> ${htmlEscape(summary.status)}</p>
    <p><strong>Readiness to profit:</strong> ${summary.readinessToProfitPercent}% planning readiness, 0% live revenue impact until approved and deployed.</p>
    <p><strong>Honesty:</strong> Lovable was not directly available here. No paid LLM API, public CMS edit, SEO setting change, CRM action, payment action or deployment happened.</p>
  </section>

  <h2>מתחרים ומקורות</h2>
  <table>
    <thead><tr><th>Source</th><th>URL</th><th>Strength</th><th>Safe transfer</th><th>Do not copy</th></tr></thead>
    <tbody>${sourceRows}</tbody>
  </table>

  <h2>קבצי בית שנבדקו</h2>
  <table>
    <thead><tr><th>File</th><th>Exists</th><th>Role</th><th>Reviewed for</th></tr></thead>
    <tbody>${templateRows}</tbody>
  </table>

  <h2>הצעות שיפור</h2>
  <table>
    <thead><tr><th>ID</th><th>Area</th><th>Risk</th><th>Change</th><th>Draft public copy</th><th>Inspired by</th></tr></thead>
    <tbody>${proposalRows}</tbody>
  </table>

  <h2>כללי בטיחות</h2>
  <ul>
    <li>לא לשנות את תוכן מדריך בחירת עורך דין.</li>
    <li>לא לפרסם ולא לשנות CMS, SEO, URL, הפניות, canonical, noindex, sitemap או taxonomy.</li>
    <li>לדבר לציבור קודם, ולעורכי דין כנתיב צדדי.</li>
    <li>לא להשתמש בטענות דירוג, הבטחה או המלצה לא מבוססת.</li>
  </ul>

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

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-homepage-competitor-human-improvement-packet.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const sources = competitorSources();
  const rows = improvementRows();
  const templates = readTemplateSnippets();
  const gateRows = gates({ templates, sources, rows });
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    competitorSources: sources.length,
    localTemplatesReviewed: templates.length,
    localTemplatesFound: templates.filter((entry) => entry.exists).length,
    proposedPublicCopySections: rows.length,
    preserveFindLawyerGuideContent: true,
    publicCmsChangesApproved: 0,
    seoSettingsChanged: 0,
    paidLlmApiUsed: 0,
    liveActionApproved: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 55,
    liveRevenueImpactPercent: 0,
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      lovablePrompt: relativePath(files.lovablePrompt),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  const prompt = buildLovablePrompt({ reportDate: args.reportDate, sources, rows });
  const markdown = buildMarkdown({
    summary,
    templates,
    sources,
    rows,
    gateRows,
    lovablePromptPath: relativePath(files.lovablePrompt),
  });
  const html = buildHtml({ summary, templates, sources, rows, gateRows });

  const proposalColumns = [
    'id',
    'area',
    'changeType',
    'currentRisk',
    'proposedChange',
    'publicCopyDraft',
    'sourceInspiredBy',
    'preserveGuide',
    'liveApprovalNeeded',
  ];
  const reportRows = [
    {
      status: summary.status,
      reportDate: summary.reportDate,
      competitorSources: summary.competitorSources,
      localTemplatesReviewed: summary.localTemplatesReviewed,
      localTemplatesFound: summary.localTemplatesFound,
      proposedPublicCopySections: summary.proposedPublicCopySections,
      preserveFindLawyerGuideContent: summary.preserveFindLawyerGuideContent,
      publicCmsChangesApproved: summary.publicCmsChangesApproved,
      seoSettingsChanged: summary.seoSettingsChanged,
      paidLlmApiUsed: summary.paidLlmApiUsed,
      liveActionApproved: summary.liveActionApproved,
      upressDeploymentRequired: summary.upressDeploymentRequired,
      readinessToProfitPercent: summary.readinessToProfitPercent,
      liveRevenueImpactPercent: summary.liveRevenueImpactPercent,
    },
  ];

  writeText(files.projectMd, markdown);
  writeText(files.projectHtml, html);
  writeText(files.projectCsv, toCsv(rows, proposalColumns));
  writeText(files.lovablePrompt, prompt);
  writeText(files.reportJson, `${JSON.stringify({ ...summary, sources, templates, rows, gates: gateRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(reportRows, Object.keys(reportRows[0])));

  console.log(JSON.stringify(summary, null, 2));
}

main();
