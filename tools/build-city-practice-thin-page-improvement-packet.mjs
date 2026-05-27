import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

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
  const base = `city-practice-thin-page-improvement-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    evidenceTemplateCsv: path.join(ROOT, '.project-control', `city-practice-thin-page-evidence-template-${reportDate}.csv`),
    humanDraftPromptMd: path.join(ROOT, '.project-control', `city-practice-thin-page-human-draft-prompt-${reportDate}.md`),
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

function countWords(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseSeedPages(source) {
  const pattern = /'([^']+)'\s*=>\s*array\(\s*'title'\s*=>\s*'([^']*)',\s*'excerpt'\s*=>\s*'([^']*)',\s*'city'\s*=>\s*'([^']*)',\s*'practice'\s*=>\s*'([^']*)',\s*'content'\s*=>\s*justice_theme_city_practice_content\(\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\s*\),\s*\),/gms;
  return Array.from(source.matchAll(pattern)).map((match) => ({
    slug: match[1],
    title: match[2],
    excerpt: match[3],
    city_slug: match[4],
    practice_slug: match[5],
    practice_label: match[6],
    city_label: match[7],
    pillar_url: match[8],
  }));
}

function markerGate({ id, gate, file, markers, evidence, nextAction }) {
  const source = readText(file);
  const missing = markers.filter((marker) => !source.includes(marker));

  return {
    id,
    gate,
    status: missing.length ? 'BLOCKED' : 'PASS',
    file,
    evidence: `${markers.length - missing.length}/${markers.length} markers found; ${evidence}`,
    missing_markers: missing.join(' | '),
    next_action: nextAction,
  };
}

function buildGateRows() {
  return [
    markerGate({
      id: 'CPG-01',
      gate: 'draft_seed_write_guard',
      file: 'inc/city-practice-pages.php',
      markers: [
        'justice_theme_admin_cms_write_enabled',
        'justice_theme_enable_city_practice_draft_seed',
        "'post_status'  => 'draft'",
        "'_wp_page_template' => 'page-city-practice.php'",
        "'traffic_risk'      => 'UNKNOWN'",
      ],
      evidence: 'City/practice pages are seeded only as guarded drafts with unknown traffic risk.',
      nextAction: 'Keep this packet private until owner approves exact draft improvement and publication gates.',
    }),
    markerGate({
      id: 'CPG-02',
      gate: 'template_lawyer_coverage_guard',
      file: 'page-city-practice.php',
      markers: [
        'city_slug',
        'practice_slug',
        'WP_Query',
        'tax_query',
        'city-practice-body__empty',
        'העמוד צריך להישאר טיוטה',
      ],
      evidence: 'Public template requires city/practice filtering and displays a hold message when lawyer coverage is insufficient.',
      nextAction: 'Do not publish a target unless filtered lawyer coverage is verified.',
    }),
    markerGate({
      id: 'CPG-03',
      gate: 'practice_hub_pattern_reference',
      file: 'template-parts/content/practice-landing-page.php',
      markers: [
        'practice-signals',
        'legal-pillar-topic-grid',
        'practice-landing__pillar-content',
        'practice-lead-form',
        'generic text is removed',
      ],
      evidence: 'Richer practice hubs provide the pattern: topical signals, supporting links, body content and lead form.',
      nextAction: 'Use hub structure as inspiration, not as duplicate copy.',
    }),
  ];
}

function buildPageRows(seedPages) {
  return seedPages.map((page, index) => {
    const seedText = `${page.title} ${page.excerpt} ${page.practice_label} ${page.city_label}`;
    const seedWordEstimate = countWords(seedText);
    const priority = index < 2 ? 'HIGH' : 'MEDIUM';
    const uniqueAngle = [
      'local-intent opening that explains who this city/practice page is for',
      'document/evidence checklist specific to the practice area',
      'when to move from reading to a lawyer fit check',
      'filtered lawyer coverage proof before public visibility',
      'FAQ rows only after real search, lead or owner evidence',
      'links to the central pillar and filtered directory without competing with the pillar',
    ].join(' | ');

    return {
      id: `CP-${String(index + 1).padStart(2, '0')}`,
      slug: page.slug,
      title: page.title,
      city_slug: page.city_slug,
      practice_slug: page.practice_slug,
      practice_label: page.practice_label,
      city_label: page.city_label,
      pillar_url: page.pillar_url,
      priority,
      current_status: 'DRAFT_SEED_THIN_PLACEHOLDER',
      seed_word_estimate: seedWordEstimate,
      anti_cannibalization_role: `Support ${page.pillar_url} with local/practice intent; do not replace the central pillar.`,
      unique_content_needed: uniqueAngle,
      commercial_user_goal: 'Help a legal-help seeker decide whether to read the pillar, inspect filtered lawyers or leave a concise request.',
      blocked_without: 'GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval.',
      forbidden_action: 'Do not publish, change title/H1/meta/canonical/sitemap/internal links, claim ranking/best-lawyer status, or contact lawyers/leads from this packet.',
      allowed_next_step: 'Prepare a human-supervised private draft brief and fill the evidence template.',
    };
  });
}

function buildEvidenceTemplateRows(seedPages) {
  return seedPages.map((page) => ({
    slug: page.slug,
    target_url_private_or_draft: `/${page.slug}/`,
    gsc_query_cluster: '',
    clicks_90d: '',
    impressions_90d: '',
    average_position: '',
    cannibalizing_url_1: '',
    cannibalizing_url_2: '',
    approved_unique_angle: '',
    filtered_lawyer_profile_count: '',
    legal_reviewer: '',
    owner_approved_public_update: '',
    notes_no_pii: '',
  }));
}

function buildHumanDraftPrompt(reportDate, pageRows) {
  const rows = pageRows
    .map((row) => `- ${row.slug}: city=${row.city_slug}; practice=${row.practice_slug}; pillar=${row.pillar_url}; role=${row.anti_cannibalization_role}`)
    .join('\n');

  return [
    `# City/Practice Thin Page Human Draft Prompt - ${reportDate}`,
    '',
    'Purpose: no-API, human-supervised drafting packet for the owner to use in an existing ChatGPT Pro, Claude or Gemini web subscription if desired. This prompt is not an unattended bot workflow and must not be used to publish directly.',
    '',
    '## Guardrails',
    '',
    '- Write in Hebrew for a public legal-help seeker, not for lawyers or investors.',
    '- Do not claim "best", "recommended", rankings, guaranteed results, local court facts, deadlines or legal advice unless the owner supplies verified sources and legal review approves.',
    '- Keep the city/practice page subordinate to the central pillar page; do not duplicate the pillar.',
    '- Include placeholders where GSC evidence, lawyer coverage, local facts or legal review are missing.',
    '- Do not include names, phone numbers, lead details, WhatsApp/TalkTo transcripts, prices or business-plan language.',
    '- End every draft with a review checklist, not with publication instructions.',
    '',
    '## Targets',
    '',
    rows,
    '',
    '## Prompt',
    '',
    'You are helping prepare a private draft brief for one Jus-Tice city/practice legal-help page. Use the target row below. Create a concise Hebrew draft outline, not final publishable copy.',
    '',
    'Required sections:',
    '1. Local/practice intent opening: who this page helps and when the central pillar is enough.',
    '2. Evidence/document checklist for the practice area.',
    '3. When a reader should consider a lawyer fit check.',
    '4. Internal link plan: central pillar, filtered lawyer directory, and 1-2 related articles only if supplied.',
    '5. FAQ candidates, marked as "requires evidence" if not sourced from real GSC/lead/owner data.',
    '6. Anti-cannibalization review: what this page must not compete with.',
    '7. Publication blockers: GSC, lawyer coverage, legal review, owner approval.',
    '',
    'Target row:',
    '[paste one CSV row from the packet here]',
    '',
  ].join('\n');
}

function buildSummary(reportDate, seedPages, gateRows, pageRows) {
  const blockedGates = gateRows.filter((row) => row.status !== 'PASS');
  return {
    reportDate,
    status: blockedGates.length ? 'CITY_PRACTICE_THIN_PAGE_PACKET_BLOCKED_STATIC_GATES' : 'CITY_PRACTICE_THIN_PAGE_PACKET_READY_NO_PUBLIC_CHANGE',
    seedPagesFound: seedPages.length,
    staticGateCount: gateRows.length,
    staticPassCount: gateRows.length - blockedGates.length,
    staticBlockedCount: blockedGates.length,
    targetRows: pageRows.length,
    highPriorityRows: pageRows.filter((row) => row.priority === 'HIGH').length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, gateRows, pageRows) {
  return [
    `# City/Practice Thin Page Improvement Packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private content-improvement and anti-cannibalization packet for draft city/practice pages. It reads repo source only and does not publish CMS content, create pages, change redirects/canonicals/noindex/sitemaps/taxonomies, contact lawyers/leads, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Seed pages found: ${summary.seedPagesFound}.`,
    `- Static gates: ${summary.staticPassCount}/${summary.staticGateCount} passed.`,
    `- Target improvement rows: ${summary.targetRows}.`,
    `- High-priority private-review rows: ${summary.highPriorityRows}.`,
    `- Live actions: ${summary.publicChangesApproved} public changes, ${summary.cmsWritesApproved} CMS writes, ${summary.crmRecordsCreated} CRM records, ${summary.leadOrLawyerContactActions} lead/lawyer contacts, ${summary.invoicesOrPaymentsCreated} invoices/payments, ${summary.emailsSent} emails.`,
    '',
    '## Static Gates',
    '',
    '| ID | Gate | Status | File | Evidence | Missing Markers | Next Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.file)} | ${mdCell(row.evidence)} | ${mdCell(row.missing_markers || '-')} | ${mdCell(row.next_action)} |`),
    '',
    '## Target Rows',
    '',
    '| ID | Slug | Priority | City | Practice | Pillar | Current Status | Unique Content Needed | Blocked Without |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...pageRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.slug)} | ${mdCell(row.priority)} | ${mdCell(row.city_slug)} | ${mdCell(row.practice_slug)} | ${mdCell(row.pillar_url)} | ${mdCell(row.current_status)} | ${mdCell(row.unique_content_needed)} | ${mdCell(row.blocked_without)} |`),
    '',
    '## Review',
    '',
    'The existing city/practice system is correctly conservative: pages are draft-only, explicitly thin/unknown-risk, and blocked until unique content and lawyer coverage exist. The next safe improvement is not publication; it is filling evidence and preparing one human-reviewed draft brief at a time.',
    '',
    'Recommended first private targets are the first two seed rows only, because broad publication of all five would raise duplicate local SEO risk before GSC evidence and lawyer coverage are proven.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-city-practice-thin-page-improvement-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const seedSource = readText('inc/city-practice-pages.php');
const seedPages = parseSeedPages(seedSource);
if (!seedPages.length) {
  throw new Error('No city/practice seed pages found in inc/city-practice-pages.php');
}

const gateRows = buildGateRows();
const pageRows = buildPageRows(seedPages);
const evidenceRows = buildEvidenceTemplateRows(seedPages);
const summary = buildSummary(args.reportDate, seedPages, gateRows, pageRows);
const files = outputFiles(args.reportDate);

const pageColumns = [
  'id',
  'slug',
  'title',
  'city_slug',
  'practice_slug',
  'practice_label',
  'city_label',
  'pillar_url',
  'priority',
  'current_status',
  'seed_word_estimate',
  'anti_cannibalization_role',
  'unique_content_needed',
  'commercial_user_goal',
  'blocked_without',
  'forbidden_action',
  'allowed_next_step',
];
const evidenceColumns = [
  'slug',
  'target_url_private_or_draft',
  'gsc_query_cluster',
  'clicks_90d',
  'impressions_90d',
  'average_position',
  'cannibalizing_url_1',
  'cannibalizing_url_2',
  'approved_unique_angle',
  'filtered_lawyer_profile_count',
  'legal_reviewer',
  'owner_approved_public_update',
  'notes_no_pii',
];

writeText(files.projectMd, markdownReport(summary, gateRows, pageRows));
writeText(files.projectCsv, toCsv(pageRows, pageColumns));
writeText(files.reportJson, `${JSON.stringify({ summary, gateRows, pageRows, evidenceRows }, null, 2)}\n`);
writeText(files.reportCsv, toCsv(pageRows, pageColumns));
writeText(files.evidenceTemplateCsv, toCsv(evidenceRows, evidenceColumns));
writeText(files.humanDraftPromptMd, buildHumanDraftPrompt(args.reportDate, pageRows));

console.log(
  JSON.stringify(
    {
      ...summary,
      files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
    },
    null,
    2,
  ),
);

if (summary.staticBlockedCount > 0) {
  process.exitCode = 1;
}
