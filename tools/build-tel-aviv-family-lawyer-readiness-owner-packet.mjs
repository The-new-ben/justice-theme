import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const TARGET_PATH = '/divorce-lawyer-tel-aviv/';
const DIRECTORY_PATH = '/lawyers/?city=tel-aviv&area=family-law';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    baseUrl: DEFAULT_BASE_URL,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length).replace(/\/$/, '');
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries({ reportDate: args.reportDate, sourceDate: args.sourceDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `tel-aviv-family-lawyer-readiness-owner-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    fillTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-lawyer-readiness-fill-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function sourceFiles(sourceDate) {
  return {
    publication: path.join(ROOT, '.reports', `tel-aviv-family-publication-review-packet-${sourceDate}.json`),
    directory: path.join(ROOT, '.reports', `divorce-tel-aviv-directory-coverage-qa-${sourceDate}.json`),
    draft: path.join(ROOT, '.reports', `tel-aviv-family-local-draft-packet-${sourceDate}.json`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required source JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
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

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  return decodeHtml(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function extractFirst(text, pattern) {
  const match = String(text || '').match(pattern);
  return match ? decodeHtml(match[1]).trim() : '';
}

function hrefToPath(href) {
  const decoded = decodeHtml(href);
  try {
    const url = new URL(decoded);
    return `${url.pathname}${url.search || ''}`;
  } catch {
    return decoded || '';
  }
}

function extractProofText(cardHtml) {
  const proofBlock = extractFirst(cardHtml, /<div[^>]+class=["'][^"']*\blawyer-card__proof\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  return proofBlock || '';
}

function extractCards(html) {
  const cards = [];
  const articlePattern = /<article\b([^>]*)>([\s\S]*?)<\/article>/gi;
  let match;

  while ((match = articlePattern.exec(html))) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    if (!/\blawyer-card\b/i.test(attrs)) {
      continue;
    }

    const nameLinkMatch = body.match(/<h3[^>]+class=["'][^"']*\blawyer-card__name\b[^"']*["'][^>]*>\s*<a\b([^>]*)>([\s\S]*?)<\/a>/i);
    const fallbackMediaHref = extractFirst(body, /<a\b[^>]+class=["'][^"']*\blawyer-card__media\b[^"']*["'][^>]+href=["']([^"']+)["']/i);
    const profileHref = nameLinkMatch ? extractFirst(nameLinkMatch[1], /href=["']([^"']+)["']/i) : fallbackMediaHref;
    const statusBadge = stripHtml(extractFirst(body, /<span[^>]+class=["'][^"']*\blawyer-card__status\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i));
    const name = nameLinkMatch ? stripHtml(nameLinkMatch[2]) : stripHtml(extractFirst(body, /aria-label=["']([^"']+)["']/i));
    const meta = stripHtml(extractFirst(body, /<p[^>]+class=["'][^"']*\blawyer-card__meta\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i));
    const summary = stripHtml(extractFirst(body, /<p[^>]+class=["'][^"']*\blawyer-card__summary\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i));
    const proofText = stripHtml(extractProofText(body));
    const isBasic = /\blawyer-card--basic-index\b/i.test(attrs);
    const isFactGated = /\blawyer-card--fact-gated\b/i.test(attrs);
    const isPaid = /\blawyer-card--paid\b/i.test(attrs);
    const isSponsored = /\blawyer-card--sponsored\b/i.test(attrs);
    const claimCtaPresent = /\blawyer-card__claim\b/i.test(body);
    const callActionVisible = /href=["']tel:/i.test(body);

    cards.push({
      id: `TA-LAWYER-${String(cards.length + 1).padStart(2, '0')}`,
      display_name: name || `Visible card ${cards.length + 1}`,
      profile_path: hrefToPath(profileHref),
      displayed_meta: meta,
      public_card_type: isBasic ? 'public_basic_index' : 'profile_card',
      status_badge: statusBadge || (isBasic ? 'public_basic' : 'none_visible'),
      public_summary: summary,
      public_proof_text: proofText,
      fact_gated_public_card: isFactGated ? 'yes' : 'no',
      public_basic_card: isBasic ? 'yes' : 'no',
      public_paid_badge: isPaid ? 'yes' : 'no',
      public_sponsored_badge: isSponsored ? 'yes' : 'no',
      claim_cta_present: claimCtaPresent ? 'yes' : 'no',
      phone_action_visible_publicly: callActionVisible ? 'yes_not_exported' : 'no',
    });
  }

  return cards;
}

async function fetchCanonicalDirectory(baseUrl) {
  const url = `${baseUrl}${DIRECTORY_PATH}${DIRECTORY_PATH.includes('?') ? '&' : '?'}jt_readiness=${Date.now()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; JusTiceLawyerReadinessOwnerPacket/1.0; +https://jus-tice.co.il/)',
      },
    });
    const html = await response.text();
    return {
      fetched: true,
      status: response.status,
      finalUrl: response.url.replace(/[?&]jt_readiness=\d+/, ''),
      cards: extractCards(html),
      error: '',
    };
  } catch (error) {
    return {
      fetched: false,
      status: 'FETCH_ERROR',
      finalUrl: `${baseUrl}${DIRECTORY_PATH}`,
      cards: [],
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fallbackCardRows(directoryReport) {
  const count = directoryReport.summary?.canonicalAreaLawyerCardCount || 0;
  return Array.from({ length: count }, (_, index) => ({
    id: `TA-LAWYER-${String(index + 1).padStart(2, '0')}`,
    display_name: `Visible card slot ${index + 1}`,
    profile_path: '',
    displayed_meta: '',
    public_card_type: 'unknown_public_card',
    status_badge: 'not_fetched',
    public_summary: '',
    public_proof_text: '',
    fact_gated_public_card: 'unknown',
    public_basic_card: 'unknown',
    public_paid_badge: 'unknown',
    public_sponsored_badge: 'unknown',
    claim_cta_present: 'unknown',
    phone_action_visible_publicly: 'not_exported',
  }));
}

function readinessStatus(card) {
  if (card.public_basic_card === 'yes' || card.claim_cta_present === 'yes') {
    return 'BLOCKED_PUBLIC_BASIC_OR_CLAIM_VERIFICATION_REQUIRED';
  }
  return 'REVIEW_OWNER_ADMIN_VERIFICATION_REQUIRED';
}

function buildCardReadinessRows(cards) {
  return cards.map((card) => ({
    ...card,
    readiness_status: readinessStatus(card),
    owner_admin_required_checks: [
      'verify license/source identity in private admin evidence',
      'confirm family-law/divorce fit for Tel Aviv local page',
      'confirm profile ownership or display permission where relevant',
      'confirm current availability for inbound local inquiries',
      'confirm no ranking/best/sponsored/paid claim is implied',
      'confirm no unsupported price/outcome/response-time claim is attached',
    ].join(' | '),
    owner_admin_fill: '',
    can_support_public_local_page_if_blank: 'no',
    no_contact_or_payment_action: 'yes',
  }));
}

function buildGateRows({ publication, directoryReport, liveProbe, readinessRows }) {
  const canonicalRow = (directoryReport.routeRows || []).find((row) => row.id === 'DIR-02') || {};
  const blockedReadinessRows = readinessRows.filter((row) => row.readiness_status.startsWith('BLOCKED')).length;
  const paidOrSponsoredRows = readinessRows.filter((row) => row.public_paid_badge === 'yes' || row.public_sponsored_badge === 'yes').length;
  const publicationCoverageGate = (publication.rows || []).find((row) => row.gate === 'canonical_lawyer_directory_coverage');

  return [
    {
      id: 'TA-LR-GATE-01',
      gate: 'canonical_directory_visible_coverage',
      status: canonicalRow.status === 200 && Number(canonicalRow.lawyerCardCount || 0) >= 3 ? 'PASS_VISIBLE_COVERAGE_PRESENT' : 'BLOCKED_CANONICAL_COVERAGE_RECHECK_REQUIRED',
      evidence: `${DIRECTORY_PATH} status ${canonicalRow.status || 'unknown'} with ${canonicalRow.lawyerCardCount || 0} public card(s); publication gate says: ${publicationCoverageGate?.status || 'missing'}.`,
      next_action: 'Use this as visible coverage only; owner/admin still has to verify readiness.',
      forbidden_action: 'Do not publish the local page from card count alone.',
    },
    {
      id: 'TA-LR-GATE-02',
      gate: 'card_level_rows_available',
      status: readinessRows.length ? 'PASS_CARD_ROWS_READY' : 'BLOCKED_NO_CARD_ROWS',
      evidence: liveProbe.fetched
        ? `Read-only public fetch returned ${liveProbe.status} and extracted ${readinessRows.length} card row(s).`
        : `Live fetch failed (${liveProbe.error}); fallback card slots from prior directory report: ${readinessRows.length}.`,
      next_action: 'Owner/admin fills one readiness row per card before any public copy or link plan uses this coverage.',
      forbidden_action: 'Do not scrape logged-in admin, contact lawyers, or export contact data.',
    },
    {
      id: 'TA-LR-GATE-03',
      gate: 'basic_or_claim_cards_need_verification',
      status: blockedReadinessRows ? 'BLOCKED_OWNER_ADMIN_VERIFICATION_REQUIRED' : 'REVIEW_OWNER_ADMIN_VERIFICATION_REQUIRED',
      evidence: `${blockedReadinessRows} card row(s) are public-basic or claim-flow cards that cannot be treated as final local-page coverage without owner/admin review.`,
      next_action: 'Verify profile owner/permission, source-gated details, current fit and display readiness in private admin evidence.',
      forbidden_action: 'Do not present basic/public cards as selected, ranked, paid, sponsored or guaranteed coverage.',
    },
    {
      id: 'TA-LR-GATE-04',
      gate: 'paid_or_sponsored_claims_absent',
      status: paidOrSponsoredRows ? 'BLOCKED_PAID_OR_SPONSORED_CLAIM_REVIEW' : 'PASS_NO_PAID_OR_SPONSORED_PUBLIC_CLAIM',
      evidence: `${paidOrSponsoredRows} visible card row(s) include paid/sponsored class markers in the public directory extract.`,
      next_action: 'Keep local-page language neutral and avoid commercial quality claims.',
      forbidden_action: 'Do not imply paid status, rank, endorsement or performance from this packet.',
    },
    {
      id: 'TA-LR-GATE-05',
      gate: 'publication_still_blocked',
      status: 'PUBLICATION_STILL_BLOCKED',
      evidence: 'Focused GSC evidence, legal/editor approval and owner publication approval remain unfilled.',
      next_action: 'Use the filled owner/admin template as input to a later private go/no-go packet only.',
      forbidden_action: 'No CMS page, title/H1/meta/body/internal link, redirect, canonical/noindex, sitemap, taxonomy, CRM, contact, invoice, payment, email or uPress.',
    },
  ];
}

function buildFillRows(readinessRows) {
  return readinessRows.map((row) => ({
    card_id: row.id,
    display_name: row.display_name,
    profile_path: row.profile_path,
    public_card_type: row.public_card_type,
    owner_admin_verified_identity: '',
    owner_admin_verified_family_divorce_fit: '',
    owner_admin_verified_tel_aviv_fit: '',
    owner_admin_verified_profile_permission: '',
    owner_admin_verified_current_availability: '',
    owner_admin_verified_contact_path_without_exporting_contact_details: '',
    owner_admin_verified_no_ranking_paid_sponsored_claim: '',
    owner_admin_decision: '',
    notes_no_pii: '',
    public_go_if_blank: 'no',
  }));
}

function statusFromGates(gateRows) {
  return gateRows.some((row) => row.status.startsWith('BLOCKED'))
    ? 'TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_BLOCKED_OWNER_ADMIN_FILL_REQUIRED_NO_PUBLIC_CHANGE'
    : 'TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_READY_FOR_PRIVATE_REVIEW_NO_PUBLIC_CHANGE';
}

function statusOf(report) {
  return report.summary?.status || report.status || 'missing_status';
}

function buildMarkdown({ reportDate, sourceDate, status, publication, directoryReport, gateRows, readinessRows, fillRows }) {
  const lines = [
    `# Tel Aviv Family Lawyer Readiness Owner Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Target: ${TARGET_PATH}`,
    `Canonical directory: ${DIRECTORY_PATH}`,
    '',
    'Scope: private owner/admin readiness packet only. It does not edit lawyer profiles, contact lawyers or clients, export contact details, create CRM records, invoice, charge, publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, email, message, or deploy.',
    '',
    '## Source Chain',
    '',
    `- Publication review (${sourceDate}): ${statusOf(publication)}`,
    `- Directory coverage QA (${sourceDate}): ${statusOf(directoryReport)}`,
    `- Visible canonical cards in source QA: ${directoryReport.summary?.canonicalAreaLawyerCardCount || 0}`,
    `- Owner/admin fill rows: ${fillRows.length}`,
    '',
    '## Readiness Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`),
    '',
    '## Visible Card Readiness Rows',
    '',
    '| ID | Display Name | Profile Path | Public Card Type | Readiness Status | Required Owner/Admin Checks |',
    '| --- | --- | --- | --- | --- | --- |',
    ...readinessRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.display_name)} | ${mdCell(row.profile_path)} | ${mdCell(row.public_card_type)} | ${mdCell(row.readiness_status)} | ${mdCell(row.owner_admin_required_checks)} |`),
    '',
    '## Fillable Template',
    '',
    `Use .project-control/tel-aviv-family-lawyer-readiness-fill-template-${reportDate}.csv. Blank owner/admin fields keep publication blocked.`,
    '',
    '## Decision',
    '',
    'The canonical directory has visible Tel Aviv family-law cards, but that is still not final publication coverage. The owner/admin must verify identity, field fit, local fit, permission, availability and no unsupported commercial claim before this coverage can support any public local-page work.',
  ];

  return `${lines.join('\n')}\n`;
}

function assertNoReplacementCharacter(label, text) {
  if (text.includes('\uFFFD')) {
    throw new Error(`${label} contains a replacement character`);
  }
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-tel-aviv-family-lawyer-readiness-owner-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
    return;
  }

  const sources = sourceFiles(args.sourceDate);
  const publication = readJson(sources.publication);
  const directoryReport = readJson(sources.directory);
  const draft = readJson(sources.draft);
  const liveProbe = await fetchCanonicalDirectory(args.baseUrl);
  const cards = liveProbe.cards.length ? liveProbe.cards : fallbackCardRows(directoryReport);
  const readinessRows = buildCardReadinessRows(cards);
  const gateRows = buildGateRows({ publication, directoryReport, liveProbe, readinessRows });
  const fillRows = buildFillRows(readinessRows);
  const status = statusFromGates(gateRows);
  const outputs = outputFiles(args.reportDate);

  const gateColumns = ['id', 'gate', 'status', 'evidence', 'next_action', 'forbidden_action'];
  const readinessColumns = [
    'id',
    'display_name',
    'profile_path',
    'displayed_meta',
    'public_card_type',
    'status_badge',
    'public_summary',
    'public_proof_text',
    'fact_gated_public_card',
    'public_basic_card',
    'public_paid_badge',
    'public_sponsored_badge',
    'claim_cta_present',
    'phone_action_visible_publicly',
    'readiness_status',
    'owner_admin_required_checks',
    'owner_admin_fill',
    'can_support_public_local_page_if_blank',
    'no_contact_or_payment_action',
  ];
  const fillColumns = [
    'card_id',
    'display_name',
    'profile_path',
    'public_card_type',
    'owner_admin_verified_identity',
    'owner_admin_verified_family_divorce_fit',
    'owner_admin_verified_tel_aviv_fit',
    'owner_admin_verified_profile_permission',
    'owner_admin_verified_current_availability',
    'owner_admin_verified_contact_path_without_exporting_contact_details',
    'owner_admin_verified_no_ranking_paid_sponsored_claim',
    'owner_admin_decision',
    'notes_no_pii',
    'public_go_if_blank',
  ];

  const blockedRows = gateRows.filter((row) => row.status.startsWith('BLOCKED')).length;
  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    targetPath: TARGET_PATH,
    canonicalDirectoryPath: DIRECTORY_PATH,
    publicationStatus: statusOf(publication),
    directoryStatus: statusOf(directoryReport),
    draftStatus: statusOf(draft),
    canonicalAreaLawyerCardCount: directoryReport.summary?.canonicalAreaLawyerCardCount || 0,
    liveDirectoryReadOnlyFetches: liveProbe.fetched ? 1 : 0,
    liveDirectoryFetchStatus: liveProbe.status,
    extractedCardRows: readinessRows.length,
    publicBasicOrClaimRows: readinessRows.filter((row) => row.public_basic_card === 'yes' || row.claim_cta_present === 'yes').length,
    gateRows: gateRows.length,
    blockedRows,
    fillTemplateRows: fillRows.length,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    lawyerProfileEdits: 0,
    contactDetailsExported: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    files: {
      projectMd: path.relative(ROOT, outputs.projectMd),
      projectCsv: path.relative(ROOT, outputs.projectCsv),
      fillTemplateCsv: path.relative(ROOT, outputs.fillTemplateCsv),
      reportJson: path.relative(ROOT, outputs.reportJson),
      reportCsv: path.relative(ROOT, outputs.reportCsv),
    },
  };

  const markdown = buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, publication, directoryReport, gateRows, readinessRows, fillRows });
  const projectCsv = toCsv(readinessRows, readinessColumns);
  const fillCsv = toCsv(fillRows, fillColumns);
  const reportCsv = toCsv(gateRows, gateColumns);
  const reportJson = `${JSON.stringify({ summary, gateRows, readinessRows, fillRows, sourceFiles: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, path.relative(ROOT, value)])) }, null, 2)}\n`;

  assertNoReplacementCharacter('markdown', markdown);
  assertNoReplacementCharacter('projectCsv', projectCsv);
  assertNoReplacementCharacter('fillCsv', fillCsv);
  assertNoReplacementCharacter('reportCsv', reportCsv);
  assertNoReplacementCharacter('reportJson', reportJson);

  writeText(outputs.projectMd, markdown);
  writeText(outputs.projectCsv, projectCsv);
  writeText(outputs.fillTemplateCsv, fillCsv);
  writeText(outputs.reportJson, reportJson);
  writeText(outputs.reportCsv, reportCsv);

  console.log(JSON.stringify(summary, null, 2));
}

main();
