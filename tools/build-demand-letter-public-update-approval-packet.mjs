import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const ROUTE_BRIEF_BASE = 'managed-service-route-upgrade-brief';

const targetRoutes = [
  'https://jus-tice.co.il/labor-lawyer/',
  'https://jus-tice.co.il/consumer-rights-israel/',
  'https://jus-tice.co.il/eviction-notice-israel/',
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

const packetRows = [
  {
    id: 'DL-01',
    route_group: 'global_blocker',
    target_route: 'NEW_GENERIC_DEMAND_LETTER_ROUTE',
    section: 'route_decision',
    status: 'BLOCKED',
    item: 'Generic demand-letter page',
    proposed_public_copy_he: '\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05dd \u05e2\u05de\u05d5\u05d3 \u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05d2\u05e0\u05e8\u05d9. \u05dc\u05e4\u05e6\u05dc \u05dc\u05e4\u05d9 \u05e1\u05d5\u05d2 \u05e1\u05db\u05e1\u05d5\u05da \u05d1\u05dc\u05d1\u05d3.',
    operator_note: 'Generic intent collides with employment, consumer, rental and small-claims pages.',
    blocker: 'No generic page, no generic title and no one-size-fits-all legal-letter promise.',
  },
  {
    id: 'DL-02',
    route_group: 'employment',
    target_route: 'https://jus-tice.co.il/labor-lawyer/',
    section: 'title',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Employment title direction',
    proposed_public_copy_he: '\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d3\u05d9\u05e0\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4 | \u05d9\u05d9\u05e2\u05d5\u05e5 \u05dc\u05e4\u05e0\u05d9 \u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4',
    operator_note: 'Keep labor-lawyer as the broad employment route; add demand-letter language only as a contextual subsection.',
    blocker: 'Needs owner/SEO/legal approval before CMS edit.',
  },
  {
    id: 'DL-03',
    route_group: 'employment',
    target_route: 'https://jus-tice.co.il/labor-lawyer/',
    section: 'h2',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Employment subsection heading',
    proposed_public_copy_he: '\u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05d1\u05d3\u05d9\u05e0\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4: \u05de\u05ea\u05d9 \u05db\u05d3\u05d0\u05d9 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05e2\u05dd \u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df',
    operator_note: 'Subsection language, not replacement H1.',
    blocker: 'Do not move above the primary labor-lawyer intent without SEO approval.',
  },
  {
    id: 'DL-04',
    route_group: 'employment',
    target_route: 'https://jus-tice.co.il/labor-lawyer/',
    section: 'cta',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Employment contextual CTA',
    proposed_public_copy_he: '\u05e7\u05d9\u05d1\u05dc\u05ea\u05dd \u05de\u05db\u05ea\u05d1 \u05de\u05de\u05e2\u05e1\u05d9\u05e7 \u05d0\u05d5 \u05e9\u05d5\u05e7\u05dc\u05d9\u05dd \u05dc\u05e9\u05dc\u05d5\u05d7 \u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05d1\u05e2\u05e0\u05d9\u05d9\u05df \u05e2\u05d1\u05d5\u05d3\u05d4? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05d5\u05e0\u05e4\u05e0\u05d4 \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05de\u05ea\u05d0\u05d9\u05dd.',
    operator_note: 'Single legal-help CTA. No fixed price and no outcome promise.',
    blocker: 'Needs duplicate-CTA mobile QA before publication.',
  },
  {
    id: 'DL-05',
    route_group: 'consumer',
    target_route: 'https://jus-tice.co.il/consumer-rights-israel/',
    section: 'title',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Consumer title direction',
    proposed_public_copy_he: '\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e6\u05e8\u05db\u05df \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc | \u05d1\u05d9\u05d8\u05d5\u05dc, \u05d4\u05d7\u05d6\u05e8 \u05d5\u05de\u05db\u05ea\u05d1 \u05e4\u05e0\u05d9\u05d9\u05d4',
    operator_note: 'Consumer route can mention a request/warning letter only within refund/cancellation context.',
    blocker: 'Needs owner/SEO/legal approval before CMS edit.',
  },
  {
    id: 'DL-06',
    route_group: 'consumer',
    target_route: 'https://jus-tice.co.il/consumer-rights-israel/',
    section: 'h2',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Consumer subsection heading',
    proposed_public_copy_he: '\u05de\u05db\u05ea\u05d1 \u05dc\u05e2\u05e1\u05e7 \u05dc\u05e4\u05e0\u05d9 \u05ea\u05d1\u05d9\u05e2\u05d4 \u05e6\u05e8\u05db\u05e0\u05d9\u05ea',
    operator_note: 'Use only after explaining rights, evidence and deadlines.',
    blocker: 'No generic legal-letter framing.',
  },
  {
    id: 'DL-07',
    route_group: 'consumer',
    target_route: 'https://jus-tice.co.il/consumer-rights-israel/',
    section: 'cta',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Consumer contextual CTA',
    proposed_public_copy_he: '\u05d4\u05e1\u05e4\u05e7 \u05de\u05e1\u05e8\u05d1 \u05dc\u05d4\u05d7\u05d6\u05e8, \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc \u05d0\u05d5 \u05dc\u05ea\u05d9\u05e7\u05d5\u05df? \u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d9\u05db\u05d5\u05dc \u05dc\u05d1\u05d3\u05d5\u05e7 \u05d0\u05dd \u05e0\u05db\u05d5\u05df \u05dc\u05e9\u05dc\u05d5\u05d7 \u05de\u05db\u05ea\u05d1 \u05e4\u05e0\u05d9\u05d9\u05d4 \u05d0\u05d5 \u05dc\u05d4\u05ea\u05db\u05d5\u05e0\u05df \u05dc\u05ea\u05d1\u05d9\u05e2\u05d4.',
    operator_note: 'Keeps the user intent on consumer remedies.',
    blocker: 'Needs owner approval before any public CTA.',
  },
  {
    id: 'DL-08',
    route_group: 'rental_dispute',
    target_route: 'https://jus-tice.co.il/eviction-notice-israel/',
    section: 'title',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Rental dispute title direction',
    proposed_public_copy_he: '\u05e4\u05d9\u05e0\u05d5\u05d9 \u05e9\u05d5\u05db\u05e8 | \u05d4\u05dc\u05d9\u05da, \u05de\u05db\u05ea\u05d1 \u05d5\u05d6\u05db\u05d5\u05d9\u05d5\u05ea',
    operator_note: 'Keep eviction-notice intent separate from rental-agreement drafting/review.',
    blocker: 'Needs owner/SEO/legal approval before CMS edit.',
  },
  {
    id: 'DL-09',
    route_group: 'rental_dispute',
    target_route: 'https://jus-tice.co.il/eviction-notice-israel/',
    section: 'h2',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Rental dispute subsection heading',
    proposed_public_copy_he: '\u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05d0\u05d5 \u05de\u05db\u05ea\u05d1 \u05e4\u05d9\u05e0\u05d5\u05d9 \u05d1\u05e1\u05db\u05e1\u05d5\u05da \u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
    operator_note: 'Rental-dispute subsection only; do not merge with rental-agreement review.',
    blocker: 'Needs associated page review before internal links.',
  },
  {
    id: 'DL-10',
    route_group: 'rental_dispute',
    target_route: 'https://jus-tice.co.il/eviction-notice-israel/',
    section: 'cta',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Rental dispute contextual CTA',
    proposed_public_copy_he: '\u05de\u05d3\u05d5\u05d1\u05e8 \u05d1\u05e1\u05db\u05e1\u05d5\u05da \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05d0\u05d5 \u05d1\u05de\u05db\u05ea\u05d1 \u05e4\u05d9\u05e0\u05d5\u05d9? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05dc\u05d1\u05d3\u05d9\u05e7\u05ea \u05d4\u05ea\u05d0\u05de\u05d4 \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df.',
    operator_note: 'Narrow CTA for disputes only.',
    blocker: 'Needs owner approval before any public CTA.',
  },
  {
    id: 'DL-11',
    route_group: 'associated_pages',
    target_route: 'MULTI_ROUTE_REVIEW',
    section: 'associated_pages',
    status: 'REVIEW_BEFORE_PUBLICATION',
    item: 'Pages to inspect for links/cannibalization',
    proposed_public_copy_he: '/wrongful-termination-israel/; /employment-contract-termination/; /severance-pay-calculator/; /small-claims-court-israel/; /tenant-eviction-defense/; /landlord-rights-israel/; /rental-agreement-guide/',
    operator_note: 'Use this list for owner publication email if any route is eventually updated.',
    blocker: 'No internal links until owner/SEO approval.',
  },
  {
    id: 'DL-12',
    route_group: 'publication_blockers',
    target_route: 'MULTI_ROUTE_REVIEW',
    section: 'publication_blockers',
    status: 'BLOCKED',
    item: 'Hard blockers',
    proposed_public_copy_he: '\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05dd \u05dc\u05dc\u05d0 \u05d0\u05d9\u05e9\u05d5\u05e8 \u05d1\u05e2\u05dc\u05d9\u05dd, \u05d1\u05d3\u05d9\u05e7\u05ea SEO, \u05d1\u05d3\u05d9\u05e7\u05d4 \u05de\u05e9\u05e4\u05d8\u05d9\u05ea, \u05e0\u05ea\u05d9\u05d1 \u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df, \u05d1\u05d3\u05d9\u05e7\u05ea \u05db\u05e4\u05d9\u05dc\u05d5\u05ea CTA \u05d1\u05de\u05d5\u05d1\u05d9\u05d9\u05dc, \u05d5\u05d4\u05d7\u05dc\u05d8\u05d4 \u05d1\u05d0\u05d9\u05d6\u05d4 \u05e1\u05d5\u05d2 \u05e1\u05db\u05e1\u05d5\u05da \u05de\u05ea\u05d7\u05d9\u05dc\u05d9\u05dd.',
    operator_note: 'This row is the stop sign for remote operators.',
    blocker: 'Public launch blocked.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    routeBriefDate: process.env.ROUTE_BRIEF_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--routeBriefDate=')) {
      args.routeBriefDate = arg.slice('--routeBriefDate='.length);
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
  const base = `demand-letter-public-update-approval-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function routeBriefPath(routeBriefDate) {
  return path.join(ROOT, '.reports', `${ROUTE_BRIEF_BASE}-${routeBriefDate}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required route brief JSON: ${filePath}`);
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

function findTargetDecisions(routeBrief) {
  const rows = routeBrief.routeUpgradeDecisions || [];
  return rows.filter((row) => row.package_key === 'demand_letter_review' && (targetRoutes.includes(row.target_url_or_route) || row.target_url_or_route === 'NEW_GENERIC_DEMAND_LETTER_ROUTE'));
}

function findForbiddenMarkerHits(rows) {
  const hits = [];
  for (const row of rows) {
    const text = [row.item, row.proposed_public_copy_he, row.operator_note].join(' ').toLowerCase();
    for (const marker of forbiddenPublicMarkers) {
      if (markerMatches(text, marker)) {
        hits.push({
          id: row.id,
          route_group: row.route_group,
          marker,
        });
      }
    }
  }
  return hits;
}

function markerMatches(text, marker) {
  const normalizedMarker = marker.toLowerCase();
  if (/^[a-z]+$/.test(normalizedMarker)) {
    return new RegExp(`(^|[^a-z])${normalizedMarker}([^a-z]|$)`).test(text);
  }
  return text.includes(normalizedMarker);
}

function buildMarkdown({ reportDate, routeBriefDate, routeBrief, targetDecisions, markerHits, status }) {
  const summary = routeBrief.summary || {};
  const ownerRows = packetRows.filter((row) => row.status === 'OWNER_REVIEW_REQUIRED').length;
  const blockerRows = packetRows.filter((row) => row.status === 'BLOCKED').length;

  const lines = [
    `# Demand-Letter Public Update Approval Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Source route brief date: ${routeBriefDate}`,
    '',
    'Scope: owner/SEO review packet for possible demand-letter CTAs on existing dispute-specific pages. This explicitly blocks a generic demand-letter page. It does not publish, edit CMS content, change SEO settings, add internal links, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Source route brief status: ${routeBrief.status || 'unknown'}`,
    `- Source inventory rows behind the brief: ${summary.sourceRows ?? 'unknown'}`,
    `- Demand-letter source decisions found: ${targetDecisions.length}`,
    `- Approval packet rows: ${packetRows.length}`,
    `- Owner-review public copy rows: ${ownerRows}`,
    `- Hard blocker rows: ${blockerRows}`,
    `- Forbidden internal/business-plan marker hits: ${markerHits.length}`,
    '- Public changes approved by this packet: 0',
    '',
    '## Demand-Letter Split Rules',
    '',
    '1. Do not create `/demand-letter/` or another generic warning-letter route from this packet.',
    '2. If approved later, start with one dispute type only: employment, consumer, or rental dispute.',
    '3. Keep the existing page intent intact. Demand-letter copy should be a subsection or contextual CTA, not the whole page promise.',
    '4. Do not publish fixed price, checkout, AI drafting promise, outcome promise or law-firm positioning without the managed-service legal/payment gates.',
    '',
    '## Proposed Owner-Review Copy',
    '',
    '| ID | Route Group | Target | Section | Status | Item | Proposed Public Copy | Operator Note | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...packetRows.map(
      (row) =>
        `| ${row.id} | ${row.route_group} | ${row.target_route} | ${row.section} | ${row.status} | ${mdCell(row.item)} | ${mdCell(row.proposed_public_copy_he)} | ${mdCell(row.operator_note)} | ${mdCell(row.blocker)} |`,
    ),
    '',
    '## Associated / Cannibalizing Pages To Review',
    '',
    '- `/wrongful-termination-israel/`',
    '- `/employment-contract-termination/`',
    '- `/severance-pay-calculator/`',
    '- `/small-claims-court-israel/`',
    '- `/tenant-eviction-defense/`',
    '- `/landlord-rights-israel/`',
    '- `/rental-agreement-guide/`',
    '',
    '## Pre-Publication QA',
    '',
    '1. Confirm the owner approved one route and one dispute type.',
    '2. Confirm legal/source review for the dispute-specific wording.',
    '3. Confirm SEO review for title/subheading/meta impact and internal links.',
    '4. Confirm the article/mobile CTA is not duplicated after publication.',
    '5. Confirm no public text mentions revenue, pilots, Lawhive, internal package economics or business-plan reasoning.',
    '6. If eventually published, send the owner a Hebrew email with review URL, content summary, associated/cannibalizing pages and one concise review.',
    '',
    '## Safety Statement',
    '',
    'This packet is ready for owner review only. It does not authorize publication or monetization. A user should see help with a specific legal dispute, not a generic product page.',
  ];

  if (markerHits.length > 0) {
    lines.push('', '## Forbidden Marker Hits', '');
    for (const hit of markerHits) {
      lines.push(`- ${hit.id} / ${hit.route_group}: ${hit.marker}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-demand-letter-public-update-approval-packet.mjs --reportDate=YYYY-MM-DD --routeBriefDate=YYYY-MM-DD');
    return;
  }

  const routeBriefFile = routeBriefPath(args.routeBriefDate);
  const routeBrief = readJson(routeBriefFile);
  const targetDecisions = findTargetDecisions(routeBrief);
  const markerHits = findForbiddenMarkerHits(packetRows);
  const status = targetDecisions.length < 4
    ? 'BLOCKED_TARGET_DECISIONS_MISSING'
    : markerHits.length > 0
      ? 'BLOCKED_PUBLIC_COPY_MARKER_HIT'
      : 'OWNER_REVIEW_PACKET_READY_NOT_APPROVED';
  const outputs = outputFiles(args.reportDate);
  const columns = ['id', 'route_group', 'target_route', 'section', 'status', 'item', 'proposed_public_copy_he', 'operator_note', 'blocker'];

  const report = {
    reportDate: args.reportDate,
    status,
    sourceRouteBriefDate: args.routeBriefDate,
    sourceRouteBriefPath: routeBriefFile,
    sourceRouteBriefStatus: routeBrief.status || null,
    sourceTargetDecisions: targetDecisions,
    summary: {
      sourceInventoryRows: routeBrief.summary?.sourceRows || 0,
      sourceRouteDecisions: routeBrief.summary?.decisionRows || 0,
      demandLetterDecisionsFound: targetDecisions.length,
      packetRows: packetRows.length,
      ownerReviewRows: packetRows.filter((row) => row.status === 'OWNER_REVIEW_REQUIRED').length,
      hardBlockerRows: packetRows.filter((row) => row.status === 'BLOCKED').length,
      forbiddenPublicMarkerHits: markerHits.length,
      publicChangesApproved: 0,
    },
    rows: packetRows,
    forbiddenPublicMarkerHits: markerHits,
    associatedPagesToReview: [
      '/wrongful-termination-israel/',
      '/employment-contract-termination/',
      '/severance-pay-calculator/',
      '/small-claims-court-israel/',
      '/tenant-eviction-defense/',
      '/landlord-rights-israel/',
      '/rental-agreement-guide/',
    ],
    blockedActions: [
      'generic_demand_letter_page',
      'public_page_publish',
      'cms_content_change',
      'title_h1_meta_change',
      'internal_link_change',
      'redirect_canonical_noindex_sitemap_taxonomy_change',
      'checkout_or_fixed_price_public_offer',
      'lead_or_lawyer_handoff',
      'invoice_or_payment',
      'email_whatsapp_talkto',
      'upress_deployment',
    ],
  };

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, routeBriefDate: args.routeBriefDate, routeBrief, targetDecisions, markerHits, status }));
  writeText(outputs.projectCsv, toCsv(packetRows, columns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(packetRows, columns));

  console.log(
    JSON.stringify(
      {
        status,
        demandLetterDecisionsFound: targetDecisions.length,
        packetRows: report.summary.packetRows,
        ownerReviewRows: report.summary.ownerReviewRows,
        genericDemandLetterPageBlocked: true,
        forbiddenPublicMarkerHits: markerHits.length,
        publicChangesApproved: 0,
      },
      null,
      2,
    ),
  );
}

main();
