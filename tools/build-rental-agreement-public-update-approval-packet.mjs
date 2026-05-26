import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const TARGET_ROUTE = 'https://jus-tice.co.il/rental-agreement/';
const ROUTE_BRIEF_BASE = 'managed-service-route-upgrade-brief';

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
    id: 'RA-01',
    section: 'route_decision',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Target existing route',
    proposed_public_copy_he: TARGET_ROUTE,
    operator_note: 'Use the existing rental-agreement route as the first review target. Do not create a new lease/rental page.',
    blocker: 'Owner/SEO approval required before CMS edit.',
  },
  {
    id: 'RA-02',
    section: 'title',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'SEO title direction',
    proposed_public_copy_he: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d7\u05ea\u05d9\u05de\u05d4 | \u05de\u05d4 \u05d7\u05e9\u05d5\u05d1 \u05dc\u05d1\u05d3\u05d5\u05e7',
    operator_note: 'Reader-facing title only. It explains the legal problem and inspection intent.',
    blocker: 'Needs source/legal review and exact character-length check in CMS SEO plugin.',
  },
  {
    id: 'RA-03',
    section: 'h1',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'H1 direction',
    proposed_public_copy_he: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea: \u05de\u05d4 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05dc\u05e4\u05e0\u05d9 \u05e9\u05d7\u05d5\u05ea\u05de\u05d9\u05dd',
    operator_note: 'Keeps the page as legal-help content for people before signature.',
    blocker: 'Owner/SEO approval required before replacing current H1.',
  },
  {
    id: 'RA-04',
    section: 'meta_description',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Meta description direction',
    proposed_public_copy_he: '\u05de\u05d3\u05e8\u05d9\u05da \u05dc\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea: \u05e1\u05e2\u05d9\u05e4\u05d9\u05dd \u05e9\u05db\u05d3\u05d0\u05d9 \u05dc\u05e9\u05d9\u05dd \u05dc\u05d1 \u05d0\u05dc\u05d9\u05d4\u05dd, \u05e1\u05d9\u05db\u05d5\u05e0\u05d9\u05dd \u05e0\u05e4\u05d5\u05e6\u05d9\u05dd \u05d5\u05de\u05ea\u05d9 \u05db\u05d3\u05d0\u05d9 \u05dc\u05e4\u05e0\u05d5\u05ea \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05dc\u05e4\u05e0\u05d9 \u05d4\u05d7\u05ea\u05d9\u05de\u05d4.',
    operator_note: 'No paid-service promise. Purely legal-help and lawyer-fit language.',
    blocker: 'Needs final SEO length check and legal-source review.',
  },
  {
    id: 'RA-05',
    section: 'intro_paragraph',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Opening paragraph direction',
    proposed_public_copy_he: '\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05e0\u05e8\u05d0\u05d4 \u05dc\u05e4\u05e2\u05de\u05d9\u05dd \u05db\u05de\u05d5 \u05de\u05e1\u05de\u05da \u05e1\u05d8\u05e0\u05d3\u05e8\u05d8\u05d9, \u05d0\u05d1\u05dc \u05e1\u05e2\u05d9\u05e3 \u05d0\u05d7\u05d3 \u05dc\u05d0 \u05de\u05d3\u05d5\u05d9\u05e7 \u05e2\u05dc\u05d5\u05dc \u05dc\u05d9\u05e6\u05d5\u05e8 \u05de\u05d7\u05dc\u05d5\u05e7\u05ea \u05e2\u05dc \u05ea\u05d9\u05e7\u05d5\u05e0\u05d9\u05dd, \u05d1\u05d8\u05d5\u05d7\u05d5\u05ea, \u05e4\u05d9\u05e0\u05d5\u05d9, \u05d0\u05d5\u05e4\u05e6\u05d9\u05d4 \u05dc\u05d4\u05d0\u05e8\u05db\u05d4 \u05d0\u05d5 \u05e1\u05d9\u05d5\u05dd \u05de\u05d5\u05e7\u05d3\u05dd. \u05dc\u05e4\u05e0\u05d9 \u05e9\u05d7\u05d5\u05ea\u05de\u05d9\u05dd, \u05db\u05d3\u05d0\u05d9 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05de\u05d4 \u05d1\u05d0\u05de\u05ea \u05de\u05ea\u05d7\u05d9\u05d9\u05d1\u05d9\u05dd.',
    operator_note: 'A short user-first intro to replace any generic or thin opening section.',
    blocker: 'Needs source/legal review before CMS copy.',
  },
  {
    id: 'RA-06',
    section: 'section_heading',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'New practical checklist heading',
    proposed_public_copy_he: '\u05de\u05d4 \u05d7\u05e9\u05d5\u05d1 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05d1\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea',
    operator_note: 'Useful section for readers; can also support internal links to tenant/landlord pages.',
    blocker: 'Owner/SEO approval required.',
  },
  {
    id: 'RA-07',
    section: 'checklist_items',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Practical checklist bullets',
    proposed_public_copy_he: '\u05d6\u05d4\u05d5\u05ea \u05d4\u05e6\u05d3\u05d3\u05d9\u05dd \u05d5\u05d4\u05e0\u05db\u05e1; \u05ea\u05e7\u05d5\u05e4\u05ea \u05d4\u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05d5\u05d0\u05d5\u05e4\u05e6\u05d9\u05d9\u05ea \u05d4\u05d0\u05e8\u05db\u05d4; \u05d3\u05de\u05d9 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05d5\u05d4\u05e6\u05de\u05d3\u05d4; \u05d1\u05d8\u05d5\u05d7\u05d5\u05ea \u05d5\u05e2\u05e8\u05d1\u05d9\u05dd; \u05ea\u05d7\u05d6\u05d5\u05e7\u05d4 \u05d5\u05ea\u05d9\u05e7\u05d5\u05e0\u05d9\u05dd; \u05d1\u05d9\u05d8\u05d5\u05d7 \u05d5\u05d0\u05d7\u05e8\u05d9\u05d5\u05ea; \u05d4\u05e4\u05e8\u05d4 \u05d5\u05e4\u05d9\u05e0\u05d5\u05d9; \u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05d9\u05e6\u05d9\u05d0\u05d4 \u05de\u05d5\u05e7\u05d3\u05de\u05ea.',
    operator_note: 'Keep as checklist, not legal advice or promise.',
    blocker: 'Needs legal review for wording and completeness.',
  },
  {
    id: 'RA-08',
    section: 'cta',
    status: 'OWNER_REVIEW_REQUIRED',
    item: 'Single contextual CTA',
    proposed_public_copy_he: '\u05e8\u05d5\u05e6\u05d9\u05dd \u05e9\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d9\u05d1\u05d3\u05d5\u05e7 \u05d0\u05ea \u05d7\u05d5\u05d6\u05d4 \u05d4\u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d4\u05d7\u05ea\u05d9\u05de\u05d4? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05d5\u05e0\u05d7\u05d1\u05e8 \u05d0\u05ea\u05db\u05dd \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05de\u05ea\u05d0\u05d9\u05dd.',
    operator_note: 'One contextual legal-help CTA only; no fixed price and no public packaged-service wording yet.',
    blocker: 'Needs owner approval plus duplicate-CTA mobile QA before publication.',
  },
  {
    id: 'RA-09',
    section: 'associated_pages',
    status: 'REVIEW_BEFORE_PUBLICATION',
    item: 'Pages to inspect for links/cannibalization',
    proposed_public_copy_he: '/rental-agreement-guide/; /landlord-obligations-israel/; /tenant-rights-israel/; /landlord-rights-israel/; /tenant-eviction-defense/; /eviction-notice-israel/; /commercial-lease-israel/; /contract-law-israel/',
    operator_note: 'Use for owner email if the page is eventually published or updated.',
    blocker: 'No internal links until owner/SEO approval.',
  },
  {
    id: 'RA-10',
    section: 'publication_blockers',
    status: 'BLOCKED',
    item: 'Hard blockers',
    proposed_public_copy_he: '\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05dd \u05dc\u05dc\u05d0 \u05d0\u05d9\u05e9\u05d5\u05e8 \u05d1\u05e2\u05dc\u05d9\u05dd, \u05d1\u05d3\u05d9\u05e7\u05ea SEO, \u05d1\u05d3\u05d9\u05e7\u05d4 \u05de\u05e9\u05e4\u05d8\u05d9\u05ea, \u05e0\u05ea\u05d9\u05d1 \u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df, \u05db\u05dc\u05dc\u05d9 \u05d4\u05d0\u05ea\u05d9\u05e7\u05d4, \u05d5\u05d1\u05d3\u05d9\u05e7\u05ea \u05e9\u05d0\u05d9\u05df \u05db\u05e4\u05d9\u05dc\u05d5\u05ea CTA \u05d1\u05de\u05d5\u05d1\u05d9\u05d9\u05dc.',
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
  const base = `rental-agreement-public-update-approval-packet-${reportDate}`;
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

function findTargetDecision(routeBrief) {
  return (routeBrief.routeUpgradeDecisions || []).find((row) => row.target_url_or_route === TARGET_ROUTE);
}

function findForbiddenMarkerHits(rows) {
  const hits = [];
  for (const row of rows) {
    const text = [
      row.item,
      row.proposed_public_copy_he,
      row.operator_note,
    ].join(' ').toLowerCase();

    for (const marker of forbiddenPublicMarkers) {
      if (text.includes(marker.toLowerCase())) {
        hits.push({
          id: row.id,
          section: row.section,
          marker,
        });
      }
    }
  }
  return hits;
}

function buildMarkdown({ reportDate, routeBriefDate, routeBrief, targetDecision, markerHits, status }) {
  const summary = routeBrief.summary || {};
  const approvalRows = packetRows.filter((row) => row.status === 'OWNER_REVIEW_REQUIRED').length;
  const blockerRows = packetRows.filter((row) => row.status === 'BLOCKED').length;

  const lines = [
    `# Rental Agreement Public Update Approval Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Target route: ${TARGET_ROUTE}`,
    `Source route brief date: ${routeBriefDate}`,
    '',
    'Scope: owner/SEO review packet for a possible update to the existing rental-agreement page. This does not publish, edit CMS content, change SEO settings, add internal links, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Source route brief status: ${routeBrief.status || 'unknown'}`,
    `- Source inventory rows behind the brief: ${summary.sourceRows ?? 'unknown'}`,
    `- Route decisions in source brief: ${summary.decisionRows ?? 'unknown'}`,
    `- Target decision: ${targetDecision?.decision || 'MISSING'}`,
    `- Approval packet rows: ${packetRows.length}`,
    `- Owner-review public copy rows: ${approvalRows}`,
    `- Hard blocker rows: ${blockerRows}`,
    `- Forbidden internal/business-plan marker hits: ${markerHits.length}`,
    '- Public changes approved by this packet: 0',
    '',
    '## Proposed Owner-Review Copy',
    '',
    '| ID | Section | Status | Item | Proposed Public Copy | Operator Note | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...packetRows.map(
      (row) =>
        `| ${row.id} | ${row.section} | ${row.status} | ${mdCell(row.item)} | ${mdCell(row.proposed_public_copy_he)} | ${mdCell(row.operator_note)} | ${mdCell(row.blocker)} |`,
    ),
    '',
    '## Associated / Cannibalizing Pages To Review',
    '',
    '- `/rental-agreement-guide/`',
    '- `/landlord-obligations-israel/`',
    '- `/tenant-rights-israel/`',
    '- `/landlord-rights-israel/`',
    '- `/tenant-eviction-defense/`',
    '- `/eviction-notice-israel/`',
    '- `/commercial-lease-israel/`',
    '- `/contract-law-israel/`',
    '',
    '## Pre-Publication QA',
    '',
    '1. Confirm the owner approved this exact route and copy.',
    '2. Confirm legal/source review for the updated checklist and paragraph.',
    '3. Confirm SEO review for title, H1, meta and internal links.',
    '4. Confirm the article/mobile CTA is not duplicated after publication.',
    '5. Confirm no public text mentions revenue, pilots, Lawhive, internal package economics or business-plan reasoning.',
    '6. If eventually published, send the owner a Hebrew email with review URL, content summary, associated/cannibalizing pages and one concise review.',
    '',
    '## Safety Statement',
    '',
    'This packet is ready for owner review only. It does not authorize publication or monetization. A user should see a legal-help page, not an internal revenue page.',
  ];

  if (markerHits.length > 0) {
    lines.push('', '## Forbidden Marker Hits', '');
    for (const hit of markerHits) {
      lines.push(`- ${hit.id} / ${hit.section}: ${hit.marker}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-rental-agreement-public-update-approval-packet.mjs --reportDate=YYYY-MM-DD --routeBriefDate=YYYY-MM-DD');
    return;
  }

  const routeBriefFile = routeBriefPath(args.routeBriefDate);
  const routeBrief = readJson(routeBriefFile);
  const targetDecision = findTargetDecision(routeBrief);
  const markerHits = findForbiddenMarkerHits(packetRows);
  const status = !targetDecision
    ? 'BLOCKED_TARGET_DECISION_MISSING'
    : markerHits.length > 0
      ? 'BLOCKED_PUBLIC_COPY_MARKER_HIT'
      : 'OWNER_REVIEW_PACKET_READY_NOT_APPROVED';

  const outputs = outputFiles(args.reportDate);
  const columns = ['id', 'section', 'status', 'item', 'proposed_public_copy_he', 'operator_note', 'blocker'];
  const report = {
    reportDate: args.reportDate,
    status,
    targetRoute: TARGET_ROUTE,
    sourceRouteBriefDate: args.routeBriefDate,
    sourceRouteBriefPath: routeBriefFile,
    sourceRouteBriefStatus: routeBrief.status || null,
    targetDecision: targetDecision || null,
    summary: {
      sourceInventoryRows: routeBrief.summary?.sourceRows || 0,
      sourceRouteDecisions: routeBrief.summary?.decisionRows || 0,
      packetRows: packetRows.length,
      ownerReviewRows: packetRows.filter((row) => row.status === 'OWNER_REVIEW_REQUIRED').length,
      hardBlockerRows: packetRows.filter((row) => row.status === 'BLOCKED').length,
      forbiddenPublicMarkerHits: markerHits.length,
      publicChangesApproved: 0,
    },
    rows: packetRows,
    forbiddenPublicMarkerHits: markerHits,
    associatedPagesToReview: [
      '/rental-agreement-guide/',
      '/landlord-obligations-israel/',
      '/tenant-rights-israel/',
      '/landlord-rights-israel/',
      '/tenant-eviction-defense/',
      '/eviction-notice-israel/',
      '/commercial-lease-israel/',
      '/contract-law-israel/',
    ],
    blockedActions: [
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

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, routeBriefDate: args.routeBriefDate, routeBrief, targetDecision, markerHits, status }));
  writeText(outputs.projectCsv, toCsv(packetRows, columns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(packetRows, columns));

  console.log(
    JSON.stringify(
      {
        status,
        targetRoute: TARGET_ROUTE,
        packetRows: report.summary.packetRows,
        ownerReviewRows: report.summary.ownerReviewRows,
        forbiddenPublicMarkerHits: markerHits.length,
        publicChangesApproved: 0,
      },
      null,
      2,
    ),
  );
}

main();
