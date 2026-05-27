import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;
const TARGET_SLUG = 'divorce-lawyer-tel-aviv';

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
  const base = `tel-aviv-family-local-draft-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    promptMd: path.join(ROOT, '.project-control', `tel-aviv-family-local-human-draft-prompt-${reportDate}.md`),
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

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function findRequired(collection, predicate, message) {
  const item = collection.find(predicate);
  if (!item) {
    throw new Error(message);
  }
  return item;
}

function buildPacketRows({ briefRow, thinPageRow, liveRows, sourceRows }) {
  const officialSources = sourceRows.filter((row) => row.type === 'official');
  const competitorSources = sourceRows.filter((row) => row.type === 'competitor');
  return [
    {
      id: 'TAF-ROW-01',
      section: 'route_role',
      status: 'PRIVATE_REVIEW_READY',
      value: briefRow.draft_role,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'Keep the local page subordinate to /divorce-lawyer/ and avoid duplicating the divorce pillar.',
    },
    {
      id: 'TAF-ROW-02',
      section: 'safe_private_opening',
      status: 'PRIVATE_DRAFT_ONLY',
      value: briefRow.intro_draft_private,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'Do not publish this copy before GSC, internal overlap, legal/editor and owner approval.',
    },
    {
      id: 'TAF-ROW-03',
      section: 'reader_evidence_checklist',
      status: 'PRIVATE_REVIEW_READY',
      value: briefRow.evidence_checklist_private,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'Use as a preparation checklist, not legal advice or a claim that all items are required.',
    },
    {
      id: 'TAF-ROW-04',
      section: 'lawyer_fit_trigger',
      status: 'PRIVATE_REVIEW_READY',
      value: briefRow.lawyer_fit_trigger_private,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'Do not promise response time, outcome, ranking, price or specific lawyer availability.',
    },
    {
      id: 'TAF-ROW-05',
      section: 'internal_link_plan',
      status: 'PRIVATE_REVIEW_READY',
      value: briefRow.internal_link_plan,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'Use /lawyers/?city=tel-aviv&area=family-law only; keep practice= alias QA-only.',
    },
    {
      id: 'TAF-ROW-06',
      section: 'faq_candidates',
      status: 'NEEDS_GSC_OR_OWNER_EVIDENCE',
      value: briefRow.faq_candidates_require_evidence,
      source: 'city-practice-priority-draft-briefs',
      guardrail: 'FAQ rows stay placeholders until backed by GSC, lead, owner or legal/editor evidence.',
    },
    {
      id: 'TAF-ROW-07',
      section: 'official_source_boundaries',
      status: 'PRIVATE_RESEARCH_READY',
      value: officialSources.map((row) => `${row.title}: ${row.useFor}`).join(' | '),
      source: 'sourceRows',
      guardrail: officialSources.map((row) => row.boundary).join(' | '),
    },
    {
      id: 'TAF-ROW-08',
      section: 'competitor_source_boundaries',
      status: 'SERP_CONTEXT_ONLY',
      value: competitorSources.map((row) => `${row.title}: ${row.useFor}`).join(' | '),
      source: 'sourceRows',
      guardrail: competitorSources.map((row) => row.boundary).join(' | '),
    },
    {
      id: 'TAF-ROW-09',
      section: 'thin_page_original_need',
      status: 'PRIVATE_REVIEW_READY',
      value: thinPageRow.unique_content_needed,
      source: 'city-practice-thin-page-improvement-packet',
      guardrail: thinPageRow.forbidden_action,
    },
    {
      id: 'TAF-ROW-10',
      section: 'publication_blockers',
      status: 'BLOCKS_PUBLICATION',
      value: briefRow.publication_blockers,
      source: 'city-practice-priority-draft-briefs',
      guardrail: briefRow.forbidden_public_claims,
    },
    {
      id: 'TAF-ROW-11',
      section: 'live_source_snapshot',
      status: 'PRIVATE_EVIDENCE_READY',
      value: liveRows
        .map((row) => `${row.role}: ${row.status}; gate=${row.gate}; cards=${row.lawyer_card_count}; h1=${row.h1}`)
        .join(' | '),
      source: 'liveRows',
      guardrail: 'Snapshot is read-only evidence; do not publish or link from it without owner/SEO/legal approval.',
    },
  ];
}

function buildGates({ priorityReport, thinPageReport, briefRow, liveRows, sourceRows }) {
  const targetLive = findRequired(liveRows, (row) => row.id === 'CPD-01-TARGET', 'Missing Tel Aviv family target live row.');
  const pillarLive = findRequired(liveRows, (row) => row.id === 'CPD-01-PILLAR', 'Missing divorce pillar live row.');
  const directoryLive = findRequired(liveRows, (row) => row.id === 'CPD-01-DIRECTORY', 'Missing Tel Aviv family directory live row.');
  const unsupportedLive = findRequired(
    liveRows,
    (row) => row.id === 'CPD-01-UNSUPPORTED-DIRECTORY',
    'Missing unsupported directory alias live row.',
  );
  const officialCount = sourceRows.filter((row) => row.type === 'official').length;
  const competitorCount = sourceRows.filter((row) => row.type === 'competitor').length;

  return [
    {
      id: 'TAF-GATE-01',
      gate: 'source_packets_available',
      status:
        priorityReport.status === 'CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_BLOCKED_NO_PUBLIC_CHANGE' &&
        thinPageReport.summary?.status === 'CITY_PRACTICE_THIN_PAGE_PACKET_READY_NO_PUBLIC_CHANGE'
          ? 'PASS'
          : 'REVIEW',
      evidence: `Priority packet: ${priorityReport.status}; thin packet: ${thinPageReport.summary?.status}. Global priority packet remains blocked by a different target, so this packet narrows only to ${briefRow.slug}.`,
      next_action: 'Keep Jerusalem criminal blocked; advance only Tel Aviv family as a private editor packet.',
    },
    {
      id: 'TAF-GATE-02',
      gate: 'target_not_public_200',
      status: targetLive.status === 404 && targetLive.gate === 'PASS_TARGET_NOT_PUBLIC_200' ? 'PASS' : 'BLOCKED',
      evidence: `${targetLive.url} returned ${targetLive.status} with gate ${targetLive.gate}.`,
      next_action: 'Do not create or publish the URL without owner/SEO/legal approval.',
    },
    {
      id: 'TAF-GATE-03',
      gate: 'pillar_reachable_and_primary',
      status: pillarLive.status === 200 && briefRow.pillar_path === '/divorce-lawyer/' ? 'PASS' : 'BLOCKED',
      evidence: `${pillarLive.url} returned ${pillarLive.status}; role says local draft supports ${briefRow.pillar_path}.`,
      next_action: 'Keep the pillar as the main divorce guide and avoid duplicating it.',
    },
    {
      id: 'TAF-GATE-04',
      gate: 'canonical_directory_has_coverage',
      status:
        directoryLive.status === 200 &&
        directoryLive.gate === 'PASS_CANONICAL_DIRECTORY_FILTER_REACHABLE' &&
        Number(directoryLive.lawyer_card_count) >= 3
          ? 'PASS'
          : 'BLOCKED',
      evidence: `${directoryLive.url} returned ${directoryLive.status}, H1 "${directoryLive.h1}", and ${directoryLive.lawyer_card_count} lawyer cards.`,
      next_action: 'Use only the canonical area= filtered directory in private planning.',
    },
    {
      id: 'TAF-GATE-05',
      gate: 'unsupported_alias_excluded',
      status: unsupportedLive.gate === 'PASS_UNSUPPORTED_ALIAS_NOT_FILTERED_DO_NOT_USE' ? 'PASS' : 'REVIEW',
      evidence: `${unsupportedLive.url} remains marked ${unsupportedLive.gate}; H1 "${unsupportedLive.h1}".`,
      next_action: 'Do not put practice= alias in a draft/public internal link plan.',
    },
    {
      id: 'TAF-GATE-06',
      gate: 'research_source_scaffold_present',
      status: officialCount >= 3 && competitorCount >= 2 ? 'PASS' : 'REVIEW',
      evidence: `${officialCount} official source prompt(s) and ${competitorCount} competitor context prompt(s) are available.`,
      next_action: 'Use official sources for document/checklist language; use competitors only for SERP context, not copy.',
    },
    {
      id: 'TAF-GATE-07',
      gate: 'no_public_or_live_action_authorized',
      status:
        priorityReport.publicChangesApproved === 0 &&
        priorityReport.cmsWritesApproved === 0 &&
        priorityReport.seoSettingsChanged === 0 &&
        priorityReport.crmRecordsCreated === 0 &&
        priorityReport.leadOrLawyerContactActions === 0 &&
        priorityReport.invoicesOrPaymentsCreated === 0 &&
        priorityReport.emailsSent === 0 &&
        priorityReport.upressDeploymentRequired === false
          ? 'PASS'
          : 'BLOCKED',
      evidence: 'Source priority packet has 0 public/CMS/SEO/CRM/contact/payment/email approvals and no uPress requirement.',
      next_action: 'Keep all outputs private until the owner explicitly approves publication scope.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, gates, packetRows, briefRow, sourceRows }) {
  return [
    `# Tel Aviv Family Local Draft Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Source date: ${sourceDate}`,
    '',
    'Scope: private editor packet for `/divorce-lawyer-tel-aviv/` only. This does not create or publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemap/taxonomies, contact lawyers/leads, create CRM records, send email, invoice, charge, or deploy.',
    '',
    '## Target',
    '',
    `- Slug: ${briefRow.slug}`,
    `- Title: ${briefRow.title_he}`,
    `- Pillar: ${briefRow.pillar_path}`,
    `- Canonical filtered directory: ${briefRow.directory_path}`,
    `- Unsupported alias, QA only: ${briefRow.unsupported_directory_path}`,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} | ${mdCell(gate.next_action)} |`),
    '',
    '## Private Editor Rows',
    '',
    '| ID | Section | Status | Value | Guardrail |',
    '| --- | --- | --- | --- | --- |',
    ...packetRows.map((row) => `| ${row.id} | ${mdCell(row.section)} | ${row.status} | ${mdCell(row.value)} | ${mdCell(row.guardrail)} |`),
    '',
    '## Source Boundaries',
    '',
    '| ID | Type | Title | URL | Use For | Boundary |',
    '| --- | --- | --- | --- | --- | --- |',
    ...sourceRows.map(
      (row) =>
        `| ${row.id} | ${row.type} | ${mdCell(row.title)} | ${row.url} | ${mdCell(row.useFor)} | ${mdCell(row.boundary)} |`,
    ),
    '',
    '## Review',
    '',
    'This target can advance to private owner/editor drafting because the page is not public 200, the central divorce pillar is reachable, the canonical filtered lawyer directory has 3 cards, and the unsupported alias is explicitly excluded. It is still not publishable: GSC evidence, internal overlap review, legal/editor review and owner approval remain required.',
    '',
  ].join('\n');
}

function buildPrompt({ reportDate, briefRow, sourceRows }) {
  const official = sourceRows.filter((row) => row.type === 'official');
  const competitors = sourceRows.filter((row) => row.type === 'competitor');
  return [
    `# Tel Aviv Family Local Human Draft Prompt - ${reportDate}`,
    '',
    'Purpose: no-API, human-supervised prompt for the owner/editor to use in an existing ChatGPT Pro, Claude or Gemini web account if desired. Do not run this as an unattended bot, and do not publish its output directly.',
    '',
    '## Guardrails',
    '',
    '- Write in Hebrew for a legal-help seeker.',
    '- Produce a private outline and short draft blocks only, not final publishable copy.',
    '- Keep the page subordinate to `/divorce-lawyer/`; do not duplicate the central divorce guide.',
    '- Use `/lawyers/?city=tel-aviv&area=family-law` as the only filtered directory path in private planning.',
    '- Do not use `/lawyers/?city=tel-aviv&practice=family-law` except as a QA warning.',
    '- Do not claim best/recommended/ranked lawyers, outcomes, prices, deadlines, eligibility or legal advice.',
    '- Add placeholders for GSC evidence, internal overlap review, legal/editor review and owner approval.',
    '',
    '## Target Row',
    '',
    `- Title: ${briefRow.title_he}`,
    `- Slug: ${briefRow.slug}`,
    `- Pillar: ${briefRow.pillar_path}`,
    `- Role: ${briefRow.draft_role}`,
    `- Safe private opening seed: ${briefRow.intro_draft_private}`,
    `- Evidence checklist seed: ${briefRow.evidence_checklist_private}`,
    `- Lawyer fit trigger seed: ${briefRow.lawyer_fit_trigger_private}`,
    `- FAQ candidates requiring evidence: ${briefRow.faq_candidates_require_evidence}`,
    '',
    '## Official Sources To Use Carefully',
    '',
    ...official.map((row) => `- ${row.title}: ${row.url}\n  Use for: ${row.useFor}\n  Boundary: ${row.boundary}`),
    '',
    '## Competitor Sources For SERP Context Only',
    '',
    ...competitors.map((row) => `- ${row.title}: ${row.url}\n  Use for: ${row.useFor}\n  Boundary: ${row.boundary}`),
    '',
    '## Prompt',
    '',
    'Create a private Hebrew editor draft outline for `עורך דין גירושין בתל אביב`. Include:',
    '',
    '1. A local/practice intent opening that explains who the page helps and when the main divorce guide is enough.',
    '2. A document/evidence preparation checklist that does not become legal advice.',
    '3. A short section on when a reader may consider a lawyer fit check.',
    '4. A safe internal link plan with the central pillar and the canonical filtered directory only.',
    '5. FAQ candidates marked `requires evidence` unless supported by supplied GSC, lead, owner or legal evidence.',
    '6. Anti-cannibalization notes: what this page must not compete with or repeat from the divorce pillar.',
    '7. Publication blockers: GSC evidence, internal overlap review, legal/editor review, owner approval, and no accidental public exposure.',
    '',
    'End with a review checklist. Do not include publication instructions, CMS fields, SEO title/meta, schema, or final copy.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-tel-aviv-family-local-draft-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const priorityReport = readJson(`.reports/city-practice-priority-draft-briefs-${args.sourceDate}.json`);
  const thinPageReport = readJson(`.reports/city-practice-thin-page-improvement-packet-${args.sourceDate}.json`);
  const briefRow = findRequired(priorityReport.briefRows || [], (row) => row.slug === TARGET_SLUG, `Missing ${TARGET_SLUG} brief row.`);
  const thinPageRow = findRequired(
    thinPageReport.pageRows || [],
    (row) => row.slug === TARGET_SLUG,
    `Missing ${TARGET_SLUG} thin-page row.`,
  );
  const liveRows = (priorityReport.liveRows || []).filter((row) => row.slug === TARGET_SLUG);
  const sourceRows = (priorityReport.sourceRows || []).filter((row) => row.targetSlug === TARGET_SLUG);
  const packetRows = buildPacketRows({ briefRow, thinPageRow, liveRows, sourceRows });
  const gates = buildGates({ priorityReport, thinPageReport, briefRow, liveRows, sourceRows });
  const blockedGateCount = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const reviewGateCount = gates.filter((gate) => gate.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_BLOCKED_NO_PUBLIC_CHANGE'
    : reviewGateCount
      ? 'TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_WITH_REVIEW_NO_PUBLIC_CHANGE'
      : 'TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE';

  const columns = ['id', 'section', 'status', 'value', 'source', 'guardrail'];
  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetSlug: TARGET_SLUG,
    targetTitle: briefRow.title_he,
    targetPublicStatus: findRequired(liveRows, (row) => row.id === 'CPD-01-TARGET', 'Missing target row.').status,
    pillarStatus: findRequired(liveRows, (row) => row.id === 'CPD-01-PILLAR', 'Missing pillar row.').status,
    directoryStatus: findRequired(liveRows, (row) => row.id === 'CPD-01-DIRECTORY', 'Missing directory row.').status,
    directoryLawyerCardCount: findRequired(liveRows, (row) => row.id === 'CPD-01-DIRECTORY', 'Missing directory row.')
      .lawyer_card_count,
    officialSourceCount: sourceRows.filter((row) => row.type === 'official').length,
    competitorSourceCount: sourceRows.filter((row) => row.type === 'competitor').length,
    gateCount: gates.length,
    passGateCount: gates.filter((gate) => gate.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    gates,
    packetRows,
    sourceRows,
    liveRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, gates, packetRows, briefRow, sourceRows }));
  writeText(files.projectCsv, toCsv(packetRows, columns));
  writeText(files.promptMd, buildPrompt({ reportDate: args.reportDate, briefRow, sourceRows }));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(packetRows, columns));

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        sourceDate: report.sourceDate,
        status: report.status,
        targetSlug: report.targetSlug,
        targetPublicStatus: report.targetPublicStatus,
        directoryLawyerCardCount: report.directoryLawyerCardCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        publicChangesApproved: report.publicChangesApproved,
        cmsWritesApproved: report.cmsWritesApproved,
        crmRecordsCreated: report.crmRecordsCreated,
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
