import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_PACKET_DATE = DEFAULT_REPORT_DATE;

const targetContexts = [
  {
    key: 'employment',
    route: 'https://jus-tice.co.il/labor-lawyer/',
    path: '/labor-lawyer/',
    ownerDecision: 'Choose employment as first demand-letter context, or keep parked.',
    routeRole: 'employment-lawyer-match',
    associatedPages: ['/wrongful-termination-israel/', '/employment-contract-termination/', '/severance-pay-calculator/'],
    publicFit: 'Worker or employer needs lawyer review before a workplace warning, response, hearing, termination or wage dispute.',
    risk: 'HIGH: broad labor-law page must stay broad and not become a demand-letter product page.',
    recommendation: 'REVIEW_FIRST_CONTEXT_CANDIDATE',
  },
  {
    key: 'consumer',
    route: 'https://jus-tice.co.il/consumer-rights-israel/',
    path: '/consumer-rights-israel/',
    ownerDecision: 'Choose consumer refund/cancellation as first demand-letter context, or keep parked.',
    routeRole: 'consumer-rights-guide',
    associatedPages: ['/small-claims-court-israel/', '/consumer-lawyer/'],
    publicFit: 'Consumer has evidence of refund, cancellation, repair, overcharge or supplier refusal before complaint or small claim.',
    risk: 'MEDIUM: consumer page already has guide intent; demand-letter wording must remain a small remedy subsection.',
    recommendation: 'SECOND_CONTEXT_CANDIDATE_AFTER_OWNER_CHOICE',
  },
  {
    key: 'rental_dispute',
    route: 'https://jus-tice.co.il/eviction-notice-israel/',
    path: '/eviction-notice-israel/',
    ownerDecision: 'Choose rental-dispute demand letters only after rental-agreement copy is settled.',
    routeRole: 'rental-dispute-guide',
    associatedPages: ['/tenant-eviction-defense/', '/landlord-rights-israel/', '/rental-agreement-guide/'],
    publicFit: 'Tenant or landlord needs help around a rental dispute, warning letter, eviction letter or response.',
    risk: 'MEDIUM-HIGH: must not blur eviction/dispute intent with rental-agreement review/drafting intent.',
    recommendation: 'PARK_UNTIL_RENTAL_AGREEMENT_REVIEW_SETTLED',
  },
];

const officialAndCompetitorNotes = [
  {
    id: 'SRC-01',
    type: 'official_reference',
    context: 'employment',
    name: 'Labor Court ODR service',
    url: 'https://odr-laborcourt.court.gov.il/odr.laborcourt.app/labor-court-client/Home',
    usable_takeaway: 'Employment disputes can involve a structured pre-court path, including rights checks and a warning letter before labor-court action.',
    draft_instruction: 'Keep employment copy as a dispute-specific subsection and avoid turning the labor page into a generic legal-letter page.',
  },
  {
    id: 'SRC-02',
    type: 'official_reference',
    context: 'employment',
    name: 'Ministry of Labor work-rights complaint service',
    url: 'https://www.gov.il/he/service/work-rights-violation-complaints',
    usable_takeaway: 'A regulatory complaint is different from private civil relief; the page should not imply one letter replaces legal route selection.',
    draft_instruction: 'Mention lawyer review only as fit-check help before escalation, not as a guaranteed remedy.',
  },
  {
    id: 'SRC-03',
    type: 'official_reference',
    context: 'consumer',
    name: 'Consumer Protection Authority complaint service',
    url: 'https://www.gov.il/he/service/filing_a_complaint_to_fair_trade_authority',
    usable_takeaway: 'Consumer complaints need transaction details, business details and supporting documents.',
    draft_instruction: 'Consumer copy should ask for facts/evidence first and place any letter wording after refund/cancellation context.',
  },
  {
    id: 'SRC-04',
    type: 'official_reference',
    context: 'consumer',
    name: 'Small Claims Court filing service',
    url: 'https://www.gov.il/he/service/filing_a_small_claim',
    usable_takeaway: 'Small claims can cover goods, services, cancellation, tenancy and other disputes, and evidence preparation matters.',
    draft_instruction: 'Use this as a boundary: demand-letter help may precede small claims, but the public page should not promise litigation results.',
  },
  {
    id: 'SRC-05',
    type: 'official_reference',
    context: 'rental_dispute',
    name: 'Enforcement Authority eviction-cancellation service',
    url: 'https://www.gov.il/he/service/cancellation_remove_from_an_asset',
    usable_takeaway: 'Eviction wording can sit in later enforcement stages, so public copy must distinguish warning/response from post-judgment eviction steps.',
    draft_instruction: 'Keep rental-dispute demand-letter copy narrow and separated from lease-review copy and post-judgment enforcement content.',
  },
  {
    id: 'COMP-01',
    type: 'competitor_pattern',
    context: 'generic_boundary',
    name: 'Asaf Pelleg warning-letter guide',
    url: 'https://pelleg-law.co.il/warning-letter/',
    usable_takeaway: 'Competitor pattern explains purpose, timing, risks and why lawyer review can prevent damaging wording.',
    draft_instruction: 'Jus-Tice should match practical usefulness but keep the generic page blocked and split by dispute type.',
  },
  {
    id: 'COMP-02',
    type: 'competitor_pattern',
    context: 'generic_boundary',
    name: 'Yitzhak Goldstein warning-letter article',
    url: 'https://ygoldlaw.co.il/litigation-lawyer/articles/warning-letter/',
    usable_takeaway: 'Competitor pattern emphasizes scope and complexity differences across disputes.',
    draft_instruction: 'Avoid fixed pricing or broad promises; ask owner to choose one narrow context first.',
  },
  {
    id: 'COMP-03',
    type: 'competitor_pattern',
    context: 'generic_boundary',
    name: 'Hatraa warning-letter guide',
    url: 'https://hatraa.co.il/warning-letter-the-complete-guide/',
    usable_takeaway: 'Competitor pattern presents a broad guide, but broadness is exactly the cannibalization risk for Jus-Tice.',
    draft_instruction: 'Use broad competitor coverage only as inspiration for checklist completeness, not route structure.',
  },
];

const forbiddenPublicMarkers = [
  'revenue',
  'ARR',
  'MRR',
  'business plan',
  'Lawhive',
  'Harvey',
  'monetization',
  'package economics',
  '\u05d4\u05db\u05e0\u05e1\u05d4',
  '\u05e8\u05d5\u05d5\u05d7',
  '\u05de\u05d5\u05d3\u05dc \u05e2\u05e1\u05e7\u05d9',
  '\u05ea\u05db\u05e0\u05d9\u05ea \u05e2\u05e1\u05e7\u05d9\u05ea',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    packetDate: process.env.PACKET_DATE || DEFAULT_PACKET_DATE,
    legalHelpSurfaceDate: process.env.LEGAL_HELP_SURFACE_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--packetDate=')) {
      args.packetDate = arg.slice('--packetDate='.length);
    } else if (arg.startsWith('--legalHelpSurfaceDate=')) {
      args.legalHelpSurfaceDate = arg.slice('--legalHelpSurfaceDate='.length);
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
  const base = `demand-letter-first-context-owner-decision-draft-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerTemplateCsv: path.join(ROOT, '.project-control', `demand-letter-owner-decision-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function inputFiles(args) {
  return {
    approvalJson: path.join(ROOT, '.reports', `demand-letter-public-update-approval-packet-${args.packetDate}.json`),
    legalHelpJson: path.join(ROOT, '.reports', `live-legal-help-conversion-surface-${args.legalHelpSurfaceDate}.json`),
    queryPageCsv: path.join(ROOT, '.reports', 'gsc', 'query-page-combined.csv'),
    queryCsv: path.join(ROOT, '.reports', 'gsc', 'performance-queries.csv'),
  };
}

function readJson(filePath, fallback = null) {
  if (!existsSync(filePath)) {
    if (fallback !== null) return fallback;
    throw new Error(`Missing required JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows
    .slice(1)
    .filter((cells) => cells.some((cell) => cell.trim() !== ''))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
}

function readCsvRows(filePath) {
  if (!existsSync(filePath)) return [];
  return parseCsv(readFileSync(filePath, 'utf8'));
}

function num(value) {
  const parsed = Number(String(value ?? '').replace('%', ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeCsv(filePath, rows, columns) {
  const csvRows = [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')),
  ];
  writeFileSync(filePath, `${csvRows.join('\n')}\n`, 'utf8');
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${headers.map((header) => String(row[header] ?? '').replace(/\|/g, '/')).join(' | ')} |`),
  ].join('\n');
}

function ensureDirs(files) {
  for (const filePath of Object.values(files)) {
    mkdirSync(path.dirname(filePath), { recursive: true });
  }
}

function findRouteSurface(legalHelpRows, context) {
  return legalHelpRows.find((row) => row.path === context.path) || {};
}

function classifyDemandQuery(query) {
  if (/מעסיק|עובד|עבודה|פיטור|שימוע/i.test(query)) return 'employment';
  if (/שוכר|דייר|משכיר|שכירות|דירה/i.test(query)) return 'rental_dispute';
  if (/צרכן|ספק|עסק|קבלן|ביטול|החזר|תיקון|תביעה קטנה/i.test(query)) return 'consumer';
  if (/לשון הרע|דיבה/i.test(query)) return 'other_defamation';
  return 'generic_or_other';
}

function demandLetterRows(queryRows) {
  const marker = /מכתב התראה|מכתב דרישה|לפני תביעה|מכתב פנייה/i;
  return queryRows
    .filter((row) => marker.test(row.query || ''))
    .map((row) => ({
      query: row.query,
      clicks: num(row.clicks),
      impressions: num(row.impressions),
      ctr: row.ctr,
      position: num(row.position),
      context: classifyDemandQuery(row.query || ''),
    }))
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position);
}

function exactRouteRows(queryPageRows, context) {
  return queryPageRows
    .filter((row) => row.page === context.route)
    .map((row) => ({
      query: row.query,
      clicks: num(row.clicks),
      impressions: num(row.impressions),
      ctr: row.ctr,
      position: num(row.position),
    }))
    .sort((a, b) => b.impressions - a.impressions || a.position - b.position);
}

function summarizeContext(context, sourcePacketRows, legalHelpRows, queryPageRows, demandRows) {
  const packetRows = sourcePacketRows.filter((row) => row.route_group === context.key);
  const surface = findRouteSurface(legalHelpRows, context);
  const routeRows = exactRouteRows(queryPageRows, context);
  const contextDemandRows = demandRows.filter((row) => row.context === context.key);
  const impressions = contextDemandRows.reduce((sum, row) => sum + row.impressions, 0);
  const exactRouteImpressions = routeRows.reduce((sum, row) => sum + row.impressions, 0);
  const topQuery = contextDemandRows[0]?.query || '-';
  const packetCopy = packetRows.map((row) => `${row.section}: ${row.proposed_public_copy_he}`).join(' / ');

  return {
    id: `CTX-${String(targetContexts.indexOf(context) + 1).padStart(2, '0')}`,
    context: context.key,
    target_route: context.route,
    route_role: context.routeRole,
    recommendation: context.recommendation,
    owner_decision_needed: context.ownerDecision,
    public_fit: context.publicFit,
    risk: context.risk,
    source_packet_rows: packetRows.length,
    live_surface_status: surface.status || 'NOT_IN_LIVE_SURFACE_REPORT',
    live_title: surface.title || '-',
    live_h1: surface.h1 || '-',
    live_cta_count: surface.cta_link_count || '-',
    exact_route_gsc_rows: routeRows.length,
    exact_route_gsc_impressions: exactRouteImpressions,
    demand_query_rows: contextDemandRows.length,
    demand_query_impressions: impressions,
    top_demand_query: topQuery,
    associated_pages: context.associatedPages.join('; '),
    copy_basis: packetCopy || '-',
    stop_condition: 'Owner/SEO/legal approval required before CMS, title/H1/meta/body, CTA, link or publication action.',
  };
}

function buildDecisionRows(contextRows, demandRows) {
  const genericRows = demandRows.filter((row) => row.context === 'generic_or_other');
  const otherRows = demandRows.filter((row) => row.context === 'other_defamation');
  return [
    {
      id: 'DECISION-01',
      decision: 'BLOCK_GENERIC_ROUTE',
      status: 'BLOCKED',
      target: 'NEW_GENERIC_DEMAND_LETTER_ROUTE',
      owner_choice: 'Keep blocked unless owner/SEO later creates a separate strategy.',
      evidence: `${genericRows.length} generic/other demand-letter GSC rows; broad competitors cover many disputes, which increases cannibalization risk.`,
      next_step_if_approved: 'No approval recommended in this packet.',
      blocked_action: 'Do not create /demand-letter/, generic H1/meta or one-size-fits-all letter copy.',
    },
    ...contextRows.map((row, index) => ({
      id: `DECISION-0${index + 2}`,
      decision: `CHOOSE_${row.context.toUpperCase()}_FIRST`,
      status: row.recommendation,
      target: row.target_route,
      owner_choice: row.owner_decision_needed,
      evidence: `${row.source_packet_rows} source packet rows; ${row.demand_query_rows} matching demand-query rows; ${row.demand_query_impressions} demand-query impressions; live surface ${row.live_surface_status}.`,
      next_step_if_approved: 'Build one CMS draft/review packet for this route only, then run legal/source review, SEO length review and mobile duplicate-CTA QA.',
      blocked_action: row.stop_condition,
    })),
    {
      id: 'DECISION-05',
      decision: 'PARK_OTHER_DEMAND_LETTER_CONTEXTS',
      status: 'PARKED',
      target: 'MULTI_ROUTE_REVIEW',
      owner_choice: 'Park defamation, contractor, debt and other contexts until their own route packets exist.',
      evidence: `${otherRows.length} defamation-style rows and mixed non-target query rows exist in GSC; they should not be absorbed into employment/consumer/rental pages.`,
      next_step_if_approved: 'Create a separate private packet only if owner requests a specific context.',
      blocked_action: 'Do not broaden the first-context route to chase unrelated demand-letter queries.',
    },
  ];
}

function markerHits(rows) {
  const text = JSON.stringify(rows);
  return forbiddenPublicMarkers.filter((marker) => text.includes(marker));
}

function buildMarkdown(report, files) {
  const contextHeaders = [
    'context',
    'target_route',
    'recommendation',
    'demand_query_rows',
    'demand_query_impressions',
    'top_demand_query',
    'live_surface_status',
    'exact_route_gsc_rows',
    'risk',
  ];
  const decisionHeaders = ['id', 'decision', 'status', 'target', 'owner_choice', 'evidence', 'blocked_action'];
  const queryHeaders = ['query', 'context', 'impressions', 'clicks', 'ctr', 'position'];
  const sourceHeaders = ['id', 'type', 'context', 'name', 'url', 'usable_takeaway', 'draft_instruction'];
  const templateHeaders = ['decision_id', 'owner_decision', 'route_to_approve', 'exact_copy_change', 'legal_reviewer', 'seo_reviewer', 'publication_allowed'];

  return `# Demand-Letter First Context Owner Decision Draft - ${report.reportDate}

Status: ${report.status}

Source approval packet: .project-control/demand-letter-public-update-approval-packet-${report.sourcePacketDate}.md

Scope: private owner/SEO/legal decision draft only. This does not publish, edit CMS content, change title/H1/meta/body, add internal links, create a generic demand-letter route, change redirects/canonicals/noindex/sitemaps/taxonomies, create leads, contact lawyers or clients, invoice, charge, send email/WhatsApp/TalkTo or deploy uPress.

## Summary

- Source packet status: ${report.sourcePacketStatus}
- Context rows: ${report.summary.contextRows}
- Decision rows: ${report.summary.decisionRows}
- Global demand-letter GSC rows: ${report.summary.demandLetterQueryRows}
- Global demand-letter GSC impressions: ${report.summary.demandLetterQueryImpressions}
- Exact route GSC rows across candidate routes: ${report.summary.exactRouteGscRows}
- Source/competitor notes: ${report.summary.sourceNotes}
- Owner decision template rows: ${report.summary.ownerTemplateRows}
- Forbidden public marker hits: ${report.summary.forbiddenPublicMarkerHits}
- Public changes approved: 0

## Recommended Order

1. Keep the generic demand-letter route blocked.
2. Ask the owner to choose one first context only.
3. If choosing from the current evidence, employment is the first review candidate, consumer is the cleaner second candidate, and rental-dispute should wait until rental-agreement review is settled.
4. After owner choice, build one CMS draft/review packet for that route only and run legal/source review, SEO review and mobile duplicate-CTA QA.

## Context Rows

${table(contextHeaders, report.contextRows)}

## Owner Decision Rows

${table(decisionHeaders, report.decisionRows)}

## Top Demand-Letter Queries

${table(queryHeaders, report.topDemandLetterQueries)}

## Source And Competitor Notes

${table(sourceHeaders, report.sourceNotes)}

## Owner Decision Template

${table(templateHeaders, report.ownerDecisionTemplate)}

## Files

- Decision draft MD: ${path.relative(ROOT, files.projectMd)}
- Decision draft CSV: ${path.relative(ROOT, files.projectCsv)}
- Owner decision template CSV: ${path.relative(ROOT, files.ownerTemplateCsv)}

## Safety Statement

This is a private decision draft. A visitor should see help for a specific legal dispute, not a generic legal-letter product page or internal business reasoning.`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-demand-letter-first-context-owner-decision-draft.mjs --reportDate=YYYY-MM-DD --packetDate=YYYY-MM-DD --legalHelpSurfaceDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  ensureDirs(files);
  const inputs = inputFiles(args);

  const sourcePacket = readJson(inputs.approvalJson);
  const sourcePacketRows = sourcePacket.rows || sourcePacket.packetRows || [];
  const legalHelpRows = readJson(inputs.legalHelpJson, { rows: [] }).rows || [];
  const queryRows = readCsvRows(inputs.queryCsv);
  const queryPageRows = readCsvRows(inputs.queryPageCsv);
  const demandRows = demandLetterRows(queryRows);
  const contextRows = targetContexts.map((context) =>
    summarizeContext(context, sourcePacketRows, legalHelpRows, queryPageRows, demandRows),
  );
  const decisionRows = buildDecisionRows(contextRows, demandRows);
  const ownerDecisionTemplate = decisionRows.map((row) => ({
    decision_id: row.id,
    owner_decision: 'approve/edit/reject/park/needs_more_evidence',
    route_to_approve: row.target,
    exact_copy_change: '',
    legal_reviewer: '',
    seo_reviewer: '',
    publication_allowed: 'NO',
  }));

  const markerHitList = markerHits([...contextRows, ...decisionRows, ...officialAndCompetitorNotes]);
  const status = markerHitList.length
    ? 'DEMAND_LETTER_FIRST_CONTEXT_DECISION_DRAFT_REVIEW_MARKER_HITS'
    : 'DEMAND_LETTER_FIRST_CONTEXT_DECISION_DRAFT_READY_NOT_APPROVED';

  const report = {
    reportDate: args.reportDate,
    status,
    sourcePacketDate: args.packetDate,
    sourcePacketStatus: sourcePacket.status || 'UNKNOWN',
    targetContexts: targetContexts.map((context) => context.key),
    summary: {
      contextRows: contextRows.length,
      decisionRows: decisionRows.length,
      demandLetterQueryRows: demandRows.length,
      demandLetterQueryImpressions: demandRows.reduce((sum, row) => sum + row.impressions, 0),
      exactRouteGscRows: contextRows.reduce((sum, row) => sum + row.exact_route_gsc_rows, 0),
      exactRouteGscImpressions: contextRows.reduce((sum, row) => sum + row.exact_route_gsc_impressions, 0),
      sourceNotes: officialAndCompetitorNotes.length,
      ownerTemplateRows: ownerDecisionTemplate.length,
      forbiddenPublicMarkerHits: markerHitList.length,
      publicChangesApproved: 0,
      cmsWrites: 0,
      emailsSent: 0,
      upressDeploymentRequired: false,
    },
    contextRows,
    decisionRows,
    topDemandLetterQueries: demandRows.slice(0, 15),
    queryContextTotals: Object.values(
      demandRows.reduce((acc, row) => {
        acc[row.context] ||= { context: row.context, rows: 0, impressions: 0, clicks: 0 };
        acc[row.context].rows += 1;
        acc[row.context].impressions += row.impressions;
        acc[row.context].clicks += row.clicks;
        return acc;
      }, {}),
    ).sort((a, b) => b.impressions - a.impressions),
    sourceNotes: officialAndCompetitorNotes,
    ownerDecisionTemplate,
    forbiddenPublicMarkerHits: markerHitList,
    blockedActions: [
      'public CMS update',
      'generic demand-letter route',
      'title/H1/meta/body/internal-link change',
      'redirect/canonical/noindex/sitemap/taxonomy change',
      'lead/contact/lawyer/client outreach',
      'invoice/payment',
      'email/WhatsApp/TalkTo',
      'uPress deployment',
    ],
  };

  const projectCsvRows = [
    ...contextRows.map((row) => ({ record_type: 'context', ...row })),
    ...decisionRows.map((row) => ({ record_type: 'decision', ...row })),
  ];
  const projectCsvColumns = [
    'record_type',
    'id',
    'context',
    'target_route',
    'recommendation',
    'decision',
    'status',
    'owner_decision_needed',
    'owner_choice',
    'public_fit',
    'risk',
    'demand_query_rows',
    'demand_query_impressions',
    'top_demand_query',
    'exact_route_gsc_rows',
    'exact_route_gsc_impressions',
    'live_surface_status',
    'associated_pages',
    'evidence',
    'blocked_action',
    'stop_condition',
  ];

  writeFileSync(files.projectMd, buildMarkdown(report, files), 'utf8');
  writeCsv(files.projectCsv, projectCsvRows, projectCsvColumns);
  writeCsv(files.ownerTemplateCsv, ownerDecisionTemplate, [
    'decision_id',
    'owner_decision',
    'route_to_approve',
    'exact_copy_change',
    'legal_reviewer',
    'seo_reviewer',
    'publication_allowed',
  ]);
  writeFileSync(files.reportJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeCsv(files.reportCsv, projectCsvRows, projectCsvColumns);

  console.log(
    JSON.stringify(
      {
        status: report.status,
        contexts: report.targetContexts,
        demandLetterQueryRows: report.summary.demandLetterQueryRows,
        demandLetterQueryImpressions: report.summary.demandLetterQueryImpressions,
        exactRouteGscRows: report.summary.exactRouteGscRows,
        forbiddenPublicMarkerHits: report.summary.forbiddenPublicMarkerHits,
        publicChangesApproved: report.summary.publicChangesApproved,
        outputs: files,
      },
      null,
      2,
    ),
  );
}

main();
