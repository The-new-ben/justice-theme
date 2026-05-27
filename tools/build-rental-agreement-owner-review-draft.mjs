import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const TARGET_ROUTE = 'https://jus-tice.co.il/rental-agreement/';
const APPROVAL_BASE = 'rental-agreement-public-update-approval-packet';
const GSC_PATH = path.join(ROOT, '.reports', 'gsc', 'query-page-combined.csv');

const sourceNotes = [
  {
    id: 'SRC-01',
    type: 'official_reference',
    name: 'National legislation database service',
    url: 'https://www.gov.il/he/service/the_laws_of_the_state_of_israel_in_the_national_legislation_database',
    usable_takeaway: 'Use official legislation text or official records for final legal-source review before publication.',
    draft_instruction: 'Do not claim exact statutory rules until owner/legal reviewer checks the current official wording.',
  },
  {
    id: 'SRC-02',
    type: 'municipal_reference',
    name: 'Tel Aviv municipal recommended lease page',
    url: 'https://www.tel-aviv.gov.il/Residents/Assets/Pages/rent.aspx',
    usable_takeaway: 'Readers benefit from clear language, balanced contract framing and a reminder that templates are not a substitute for legal advice.',
    draft_instruction: 'Keep the page practical and plain-language, with a legal review CTA only after useful guidance.',
  },
  {
    id: 'COMP-01',
    type: 'competitor_pattern',
    name: 'Dina Erlich rental contract guide',
    url: 'https://dinaerlich.co.il/rental-contract/',
    usable_takeaway: 'Strong competitor pattern: clause-by-clause reader checklist with practical risks around parties, property, rent, securities, repairs and early exit.',
    draft_instruction: 'Match the practical checklist usefulness, but keep Jus-Tice shorter, cleaner and conversion-safe.',
  },
  {
    id: 'COMP-02',
    type: 'competitor_pattern',
    name: 'Berman lease agreement article',
    url: 'https://www.bermanlaw.co.il/lease-agreement',
    usable_takeaway: 'Strong competitor pattern: concrete red flags such as insurance/subrogation, replacement tenant, option terms and one-sided termination.',
    draft_instruction: 'Add a red-flags review row for legal/source review; do not copy sample clauses.',
  },
  {
    id: 'COMP-03',
    type: 'competitor_pattern',
    name: 'Asaf Pelleg pre-signature lease checklist',
    url: 'https://pelleg-law.co.il/what-to-check-before-a-lease/',
    usable_takeaway: 'Strong competitor pattern: explains why a generic downloaded contract may be risky and when a lawyer check helps.',
    draft_instruction: 'Use a softer fit-check CTA: no pressure, no guarantee, and no fixed-price public promise.',
  },
];

const forbiddenPublicMarkers = [
  'revenue',
  'ARR',
  'MRR',
  'business plan',
  'Lawhive',
  'Harvey',
  'pilot',
  'monetization',
  'package economics',
  '\u05d4\u05db\u05e0\u05e1\u05d4',
  '\u05e8\u05d5\u05d5\u05d7',
  '\u05de\u05d5\u05d3\u05dc \u05e2\u05e1\u05e7\u05d9',
  '\u05ea\u05db\u05e0\u05d9\u05ea \u05e2\u05e1\u05e7\u05d9\u05ea',
];

const internalLinkPlan = [
  {
    id: 'LINK-01',
    target: '/rental-agreement-guide/',
    role: 'supporting_clause_depth',
    proposed_anchor_note: 'Link only if the live guide provides clause-level detail that does not duplicate the new primary intro.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-02',
    target: '/tenant-rights-israel/',
    role: 'tenant_rights_context',
    proposed_anchor_note: 'Use near tenant-side cautions such as repairs, securities or early exit.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-03',
    target: '/landlord-rights-israel/',
    role: 'landlord_context',
    proposed_anchor_note: 'Use only where landlord-side balance is needed, not as a sales link.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-04',
    target: '/landlord-obligations-israel/',
    role: 'maintenance_and_delivery_context',
    proposed_anchor_note: 'Use near maintenance/repair wording after legal review.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-05',
    target: '/tenant-eviction-defense/',
    role: 'eviction_dispute_boundary',
    proposed_anchor_note: 'Use only as a boundary link if the page mentions breach or eviction; do not blur drafting with eviction defense.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-06',
    target: '/commercial-lease-israel/',
    role: 'commercial_lease_boundary',
    proposed_anchor_note: 'Use to separate residential lease review from commercial lease intent.',
    approval_state: 'owner_seo_review_required',
  },
  {
    id: 'LINK-07',
    target: '/contract-law-israel/',
    role: 'general_contract_context',
    proposed_anchor_note: 'Use low on page only if helpful; do not send primary rental intent away too early.',
    approval_state: 'owner_seo_review_required',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    approvalDate: process.env.APPROVAL_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--approvalDate=')) {
      args.approvalDate = arg.slice('--approvalDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries(args)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `rental-agreement-owner-review-draft-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    linkPlanCsv: path.join(ROOT, '.project-control', `rental-agreement-internal-link-plan-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function approvalPath(approvalDate) {
  return path.join(ROOT, '.reports', `${APPROVAL_BASE}-${approvalDate}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required JSON file: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  if (!existsSync(filePath)) {
    return '';
  }
  return readFileSync(filePath, 'utf8');
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell !== '')) {
        rows.push(row);
      }
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers = [], ...body] = rows;
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function getApprovalRow(approval, section) {
  return (approval.rows || []).find((row) => row.section === section) || {};
}

function splitChecklist(value) {
  return String(value || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildGscRows() {
  const rows = parseCsv(readText(GSC_PATH))
    .filter((row) => row.page === TARGET_ROUTE)
    .map((row) => ({
      query: row.query,
      page: row.page,
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: row.ctr,
      position: Number(row.position || 0),
    }))
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position);

  return rows;
}

function clusterGscRows(rows) {
  const clusters = [
    { cluster: 'primary_contract_terms', match: ['\u05d4\u05e1\u05db\u05dd \u05e9\u05db\u05d9\u05e8\u05d5\u05ea', '\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea'], impressions: 0, rows: 0 },
    { cluster: 'apartment_residential_terms', match: ['\u05d3\u05d9\u05e8\u05d4', '\u05d1\u05d9\u05ea', '\u05d9\u05d7\u05d9\u05d3\u05ea \u05d3\u05d9\u05d5\u05e8'], impressions: 0, rows: 0 },
    { cluster: 'sublease_and_edge_cases', match: ['\u05de\u05e9\u05e0\u05d4', '\u05dc\u05dc\u05d0 \u05ea\u05de\u05d5\u05e8\u05d4', '\u05d7\u05d3\u05e8'], impressions: 0, rows: 0 },
    { cluster: 'commercial_or_vehicle_drift', match: ['\u05de\u05e9\u05e8\u05d3', '\u05e8\u05db\u05d1', '\u05de\u05e1\u05d7\u05e8'], impressions: 0, rows: 0 },
  ];

  for (const row of rows) {
    for (const cluster of clusters) {
      if (cluster.match.some((needle) => row.query.includes(needle))) {
        cluster.impressions += row.impressions;
        cluster.rows += 1;
      }
    }
  }

  return clusters;
}

function findForbiddenMarkerHits(textRows) {
  const hits = [];
  for (const row of textRows) {
    const text = Object.values(row).join(' ').toLowerCase();
    for (const marker of forbiddenPublicMarkers) {
      if (text.includes(marker.toLowerCase())) {
        hits.push({
          id: row.id || row.section_id || row.field || 'unknown',
          marker,
        });
      }
    }
  }
  return hits;
}

function buildDraftRows(approval, gscRows, gscClusters) {
  const title = getApprovalRow(approval, 'title').proposed_public_copy_he;
  const h1 = getApprovalRow(approval, 'h1').proposed_public_copy_he;
  const meta = getApprovalRow(approval, 'meta_description').proposed_public_copy_he;
  const intro = getApprovalRow(approval, 'intro_paragraph').proposed_public_copy_he;
  const checklistHeading = getApprovalRow(approval, 'section_heading').proposed_public_copy_he;
  const checklistItems = splitChecklist(getApprovalRow(approval, 'checklist_items').proposed_public_copy_he);
  const cta = getApprovalRow(approval, 'cta').proposed_public_copy_he;

  return [
    {
      id: 'DRAFT-01',
      section: 'seo_title',
      owner_status: 'OWNER_SEO_LEGAL_REVIEW_REQUIRED',
      draft_content: title,
      evidence_basis: 'Existing route upgrade packet plus GSC primary rental-agreement query cluster.',
      stop_condition: 'Do not update title until owner/SEO confirms length and route intent.',
    },
    {
      id: 'DRAFT-02',
      section: 'h1',
      owner_status: 'OWNER_SEO_LEGAL_REVIEW_REQUIRED',
      draft_content: h1,
      evidence_basis: 'Keeps the route as pre-signature legal-help content.',
      stop_condition: 'Do not replace H1 until owner approves exact page role.',
    },
    {
      id: 'DRAFT-03',
      section: 'meta_description',
      owner_status: 'OWNER_SEO_LEGAL_REVIEW_REQUIRED',
      draft_content: meta,
      evidence_basis: 'Summarizes problem, checklist value and lawyer-fit handoff without service pricing.',
      stop_condition: 'Check SEO plugin length before CMS update.',
    },
    {
      id: 'DRAFT-04',
      section: 'opening_paragraph',
      owner_status: 'OWNER_LEGAL_REVIEW_REQUIRED',
      draft_content: intro,
      evidence_basis: 'Competitor pattern favors practical risk framing before any CTA.',
      stop_condition: 'Legal/source reviewer must approve before public body update.',
    },
    {
      id: 'DRAFT-05',
      section: 'checklist_heading',
      owner_status: 'OWNER_SEO_LEGAL_REVIEW_REQUIRED',
      draft_content: checklistHeading,
      evidence_basis: 'GSC rows show broad contract and apartment lease demand but low rankings; a checklist may better satisfy intent.',
      stop_condition: 'Do not add if it duplicates the associated guide page.',
    },
    {
      id: 'DRAFT-06',
      section: 'checklist_items',
      owner_status: 'OWNER_LEGAL_REVIEW_REQUIRED',
      draft_content: checklistItems.join(' | '),
      evidence_basis: `${checklistItems.length} checklist items from approved owner-review packet; competitor/source notes support clause-level review.`,
      stop_condition: 'Legal reviewer must validate completeness and avoid legal-advice wording.',
    },
    {
      id: 'DRAFT-07',
      section: 'contextual_cta',
      owner_status: 'OWNER_APPROVAL_REQUIRED',
      draft_content: cta,
      evidence_basis: 'Single legal-help CTA after useful content; avoids fixed price, AI drafting or package language.',
      stop_condition: 'Run mobile duplicate-CTA QA before any publication.',
    },
    {
      id: 'DRAFT-08',
      section: 'gsc_priority',
      owner_status: 'EVIDENCE_ONLY',
      draft_content: `Top query rows: ${gscRows.slice(0, 8).map((row) => `${row.query} (${row.impressions})`).join('; ')}`,
      evidence_basis: `${gscRows.length} GSC rows for ${TARGET_ROUTE}; ${gscRows.reduce((sum, row) => sum + row.impressions, 0)} total impressions, ${gscRows.reduce((sum, row) => sum + row.clicks, 0)} clicks.`,
      stop_condition: 'Do not publish solely from impressions; owner/SEO/legal review still required.',
    },
    {
      id: 'DRAFT-09',
      section: 'query_clusters',
      owner_status: 'EVIDENCE_ONLY',
      draft_content: gscClusters.map((row) => `${row.cluster}: ${row.impressions} impressions / ${row.rows} rows`).join('; '),
      evidence_basis: 'Separates primary residential lease intent from sublease, commercial lease and vehicle-rental drift.',
      stop_condition: 'Do not chase drift terms on the primary page if associated routes should own them.',
    },
    {
      id: 'DRAFT-10',
      section: 'publication_stop',
      owner_status: 'BLOCKED',
      draft_content: 'Private draft only. No CMS, SEO, internal-link, CTA, payment, CRM, email or uPress action is approved.',
      evidence_basis: 'Owner approval queue remains OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED.',
      stop_condition: 'Stop until owner explicitly approves route, exact copy, links, legal review and publication workflow.',
    },
  ];
}

function markdownTable(rows, columns) {
  return [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((column) => String(row[column] ?? '').replace(/\|/g, '/').replace(/\r?\n/g, '<br>')).join(' | ')} |`),
  ].join('\n');
}

function buildMarkdown({ reportDate, approvalDate, approval, draftRows, gscRows, gscClusters, markerHits, outputs }) {
  const topGscRows = gscRows.slice(0, 12);
  return [
    `# Rental Agreement Owner Review Draft - ${reportDate}`,
    '',
    `Status: ${markerHits.length ? 'BLOCKED_PUBLIC_COPY_MARKER_HIT' : 'RENTAL_AGREEMENT_OWNER_REVIEW_DRAFT_READY_NOT_APPROVED'}`,
    '',
    `Target route: ${TARGET_ROUTE}`,
    `Source approval packet: .project-control/${APPROVAL_BASE}-${approvalDate}.md`,
    '',
    'Scope: private owner/editor draft brief only. This does not publish, edit CMS content, change SEO settings, add internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, create CRM records, contact clients/lawyers, invoice, charge, send email/WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Source packet status: ${approval.status}`,
    `- Draft rows: ${draftRows.length}`,
    `- GSC target rows: ${gscRows.length}`,
    `- GSC impressions: ${gscRows.reduce((sum, row) => sum + row.impressions, 0)}`,
    `- GSC clicks: ${gscRows.reduce((sum, row) => sum + row.clicks, 0)}`,
    `- Source/competitor notes: ${sourceNotes.length}`,
    `- Internal-link plan rows: ${internalLinkPlan.length}`,
    `- Forbidden public marker hits: ${markerHits.length}`,
    '- Public changes approved: 0',
    '',
    '## Draft Rows',
    '',
    markdownTable(draftRows, ['id', 'section', 'owner_status', 'draft_content', 'evidence_basis', 'stop_condition']),
    '',
    '## GSC Top Rows',
    '',
    markdownTable(topGscRows, ['query', 'impressions', 'clicks', 'ctr', 'position']),
    '',
    '## Query Clusters',
    '',
    markdownTable(gscClusters, ['cluster', 'impressions', 'rows']),
    '',
    '## Source And Competitor Notes',
    '',
    markdownTable(sourceNotes, ['id', 'type', 'name', 'url', 'usable_takeaway', 'draft_instruction']),
    '',
    '## Internal Link Plan',
    '',
    markdownTable(internalLinkPlan, ['id', 'target', 'role', 'proposed_anchor_note', 'approval_state']),
    '',
    '## Owner Decision Needed',
    '',
    'Owner can approve, edit, reject, park or request more evidence. Even after approval, the next step is a CMS draft/review packet, not direct publication.',
    '',
    '## Files',
    '',
    `- Draft MD: ${path.relative(ROOT, outputs.projectMd).replace(/\\/g, '/')}`,
    `- Draft CSV: ${path.relative(ROOT, outputs.projectCsv).replace(/\\/g, '/')}`,
    `- Link plan CSV: ${path.relative(ROOT, outputs.linkPlanCsv).replace(/\\/g, '/')}`,
    '',
    '## Safety Statement',
    '',
    'This draft is user-facing in tone but private in execution. It contains no approval to publish and no internal business-plan language should appear on the live page.',
    '',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-rental-agreement-owner-review-draft.mjs [--reportDate=YYYY-MM-DD] [--approvalDate=YYYY-MM-DD]');
    return;
  }

  const approval = readJson(approvalPath(args.approvalDate));
  const gscRows = buildGscRows();
  const gscClusters = clusterGscRows(gscRows);
  const draftRows = buildDraftRows(approval, gscRows, gscClusters);
  const markerHits = findForbiddenMarkerHits([...draftRows, ...sourceNotes, ...internalLinkPlan]);
  const outputs = outputFiles(args.reportDate);
  const status = markerHits.length ? 'BLOCKED_PUBLIC_COPY_MARKER_HIT' : 'RENTAL_AGREEMENT_OWNER_REVIEW_DRAFT_READY_NOT_APPROVED';

  const draftColumns = ['id', 'section', 'owner_status', 'draft_content', 'evidence_basis', 'stop_condition'];
  const linkColumns = ['id', 'target', 'role', 'proposed_anchor_note', 'approval_state'];
  const report = {
    reportDate: args.reportDate,
    status,
    targetRoute: TARGET_ROUTE,
    sourceApprovalDate: args.approvalDate,
    sourceApprovalStatus: approval.status,
    summary: {
      draftRows: draftRows.length,
      gscRows: gscRows.length,
      gscImpressions: gscRows.reduce((sum, row) => sum + row.impressions, 0),
      gscClicks: gscRows.reduce((sum, row) => sum + row.clicks, 0),
      gscClusterRows: gscClusters.length,
      sourceNotes: sourceNotes.length,
      internalLinkRows: internalLinkPlan.length,
      forbiddenPublicMarkerHits: markerHits.length,
      publicChangesApproved: 0,
      cmsWrites: 0,
      emailsSent: 0,
      upressDeploymentRequired: false,
    },
    draftRows,
    gscTopRows: gscRows.slice(0, 25),
    gscClusters,
    sourceNotes,
    internalLinkPlan,
    forbiddenPublicMarkerHits: markerHits,
    blockedActions: [
      'public_page_publish',
      'cms_content_change',
      'title_h1_meta_change',
      'internal_link_change',
      'redirect_canonical_noindex_sitemap_taxonomy_change',
      'checkout_or_fixed_price_public_offer',
      'crm_record_or_lead_handoff',
      'invoice_or_payment',
      'email_whatsapp_talkto',
      'upress_deployment',
    ],
    outputs,
  };

  writeText(outputs.projectMd, `${buildMarkdown({ reportDate: args.reportDate, approvalDate: args.approvalDate, approval, draftRows, gscRows, gscClusters, markerHits, outputs })}\n`);
  writeText(outputs.projectCsv, toCsv(draftRows, draftColumns));
  writeText(outputs.linkPlanCsv, toCsv(internalLinkPlan, linkColumns));
  writeText(outputs.reportCsv, toCsv(draftRows, draftColumns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        status,
        targetRoute: TARGET_ROUTE,
        draftRows: draftRows.length,
        gscRows: gscRows.length,
        gscImpressions: report.summary.gscImpressions,
        gscClicks: report.summary.gscClicks,
        forbiddenPublicMarkerHits: markerHits.length,
        publicChangesApproved: 0,
        outputs,
      },
      null,
      2,
    ),
  );
}

main();
