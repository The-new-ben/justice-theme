import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const packetFiles = {
  rental: 'rental-agreement-public-update-approval-packet',
  demand: 'demand-letter-public-update-approval-packet',
};

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    packetDate: process.env.PACKET_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--packetDate=')) {
      args.packetDate = arg.slice('--packetDate='.length);
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
  const base = `public-update-owner-approval-queue-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function packetPath(base, packetDate) {
  return path.join(ROOT, '.reports', `${base}-${packetDate}.json`);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required packet JSON: ${filePath}`);
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

function rowById(report, id) {
  return (report.rows || []).find((row) => row.id === id) || {};
}

function buildQueueRows(rental, demand) {
  const rentalCta = rowById(rental, 'RA-08');
  const demandEmployment = rowById(demand, 'DL-04');
  const demandConsumer = rowById(demand, 'DL-07');
  const demandRental = rowById(demand, 'DL-10');

  return [
    {
      id: 'QUEUE-01',
      rank: 1,
      workstream: 'rental_agreement',
      target_route: 'https://jus-tice.co.il/rental-agreement/',
      owner_decision_needed: 'Approve, edit or reject the existing-route rental-agreement update packet.',
      status: rental.status === 'OWNER_REVIEW_PACKET_READY_NOT_APPROVED' ? 'READY_FOR_OWNER_REVIEW_NOT_APPROVED' : 'BLOCKED_SOURCE_PACKET_NOT_READY',
      why_first: 'It upgrades an existing route and avoids creating a duplicate lease/rental page.',
      source_packet: '.project-control/rental-agreement-public-update-approval-packet-2026-05-27.md',
      associated_pages: (rental.associatedPagesToReview || []).join('; '),
      prepared_public_copy_rows: rental.summary?.ownerReviewRows || 0,
      safe_cta_excerpt: rentalCta.proposed_public_copy_he || '',
      next_after_approval: 'Run source/legal review, SEO length review, CMS draft/update, mobile duplicate-CTA QA, then send Hebrew publication email with associated pages.',
      hard_blocker: 'No CMS edit, link, title/H1/meta change or CTA publication before owner/SEO/legal approval.',
    },
    {
      id: 'QUEUE-02',
      rank: 2,
      workstream: 'demand_letter_employment',
      target_route: 'https://jus-tice.co.il/labor-lawyer/',
      owner_decision_needed: 'Choose whether employment is the first demand-letter context.',
      status: demand.status === 'OWNER_REVIEW_PACKET_READY_NOT_APPROVED' ? 'READY_FOR_OWNER_REVIEW_NOT_APPROVED' : 'BLOCKED_SOURCE_PACKET_NOT_READY',
      why_first: 'It is the highest-risk existing route in the demand-letter packet and should be handled before any generic demand-letter copy.',
      source_packet: '.project-control/demand-letter-public-update-approval-packet-2026-05-27.md',
      associated_pages: '/wrongful-termination-israel/; /employment-contract-termination/; /severance-pay-calculator/',
      prepared_public_copy_rows: 3,
      safe_cta_excerpt: demandEmployment.proposed_public_copy_he || '',
      next_after_approval: 'Keep broad labor-law intent intact; add only a contextual subsection/CTA and run mobile duplicate-CTA QA.',
      hard_blocker: 'No generic demand-letter title, page or above-the-fold rewrite.',
    },
    {
      id: 'QUEUE-03',
      rank: 3,
      workstream: 'demand_letter_consumer',
      target_route: 'https://jus-tice.co.il/consumer-rights-israel/',
      owner_decision_needed: 'Decide if consumer refund/cancellation is a better first demand-letter context than employment.',
      status: 'CANDIDATE_AFTER_OWNER_CHOOSES_CONTEXT',
      why_first: 'Lower route risk than employment, but still needs consumer-law source review.',
      source_packet: '.project-control/demand-letter-public-update-approval-packet-2026-05-27.md',
      associated_pages: '/small-claims-court-israel/; /consumer-lawyer/',
      prepared_public_copy_rows: 3,
      safe_cta_excerpt: demandConsumer.proposed_public_copy_he || '',
      next_after_approval: 'Add only consumer-remedy wording after rights/evidence explanation; avoid generic legal-letter framing.',
      hard_blocker: 'No public checkout or fixed price until legal/payment gates are approved.',
    },
    {
      id: 'QUEUE-04',
      rank: 4,
      workstream: 'demand_letter_rental_dispute',
      target_route: 'https://jus-tice.co.il/eviction-notice-israel/',
      owner_decision_needed: 'Decide if rental-dispute demand letters should wait until rental-agreement copy is settled.',
      status: 'CANDIDATE_AFTER_RENTAL_AND_OWNER_REVIEW',
      why_first: 'Useful route, but it can blur with rental-agreement review unless sequencing is deliberate.',
      source_packet: '.project-control/demand-letter-public-update-approval-packet-2026-05-27.md',
      associated_pages: '/tenant-eviction-defense/; /landlord-rights-israel/; /rental-agreement-guide/',
      prepared_public_copy_rows: 3,
      safe_cta_excerpt: demandRental.proposed_public_copy_he || '',
      next_after_approval: 'Keep eviction/dispute intent separate from lease drafting or review.',
      hard_blocker: 'Do not mix rental-dispute demand-letter copy with the rental agreement managed-service CTA.',
    },
    {
      id: 'QUEUE-05',
      rank: 99,
      workstream: 'generic_demand_letter',
      target_route: 'NEW_GENERIC_DEMAND_LETTER_ROUTE',
      owner_decision_needed: 'No approval recommended.',
      status: 'BLOCKED_DO_NOT_CREATE',
      why_first: 'Generic intent collides with employment, consumer, rental and small-claims pages.',
      source_packet: '.project-control/demand-letter-public-update-approval-packet-2026-05-27.md',
      associated_pages: '/labor-lawyer/; /consumer-rights-israel/; /small-claims-court-israel/; /eviction-notice-israel/; /wrongful-termination-israel/',
      prepared_public_copy_rows: 0,
      safe_cta_excerpt: '',
      next_after_approval: 'Keep blocked unless owner/SEO later provides a separate strategy.',
      hard_blocker: 'No /demand-letter/ page, generic H1/meta or one-size-fits-all letter promise.',
    },
  ];
}

function queueStatus(rows, rental, demand) {
  const publicChanges = (rental.summary?.publicChangesApproved || 0) + (demand.summary?.publicChangesApproved || 0);
  const markerHits = (rental.summary?.forbiddenPublicMarkerHits || 0) + (demand.summary?.forbiddenPublicMarkerHits || 0);

  if (publicChanges > 0 || markerHits > 0) {
    return 'BLOCKED_SOURCE_PACKET_SAFETY_FAILURE';
  }

  if (rows.some((row) => row.status === 'READY_FOR_OWNER_REVIEW_NOT_APPROVED')) {
    return 'OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED';
  }

  return 'NO_READY_PUBLIC_UPDATE';
}

function buildMarkdown({ reportDate, packetDate, status, rows, rental, demand }) {
  const lines = [
    `# Public Update Owner Approval Queue - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Source packet date: ${packetDate}`,
    '',
    'Scope: private owner/SEO queue for the managed-service public-update candidates. This does not publish, edit CMS content, add internal links, alter title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Queue rows: ${rows.length}`,
    `- Ready for owner review: ${rows.filter((row) => row.status === 'READY_FOR_OWNER_REVIEW_NOT_APPROVED').length}`,
    `- Candidate after owner context choice: ${rows.filter((row) => row.status.includes('CANDIDATE')).length}`,
    `- Explicitly blocked routes: ${rows.filter((row) => row.status.includes('BLOCKED')).length}`,
    `- Rental packet status: ${rental.status}`,
    `- Demand-letter packet status: ${demand.status}`,
    `- Public-copy marker hits across source packets: ${(rental.summary?.forbiddenPublicMarkerHits || 0) + (demand.summary?.forbiddenPublicMarkerHits || 0)}`,
    '- Public changes approved by this queue: 0',
    '',
    '## Approval Queue',
    '',
    '| Rank | Workstream | Target | Status | Owner Decision Needed | Why This Order | Source Packet | Associated Pages | Next After Approval | Hard Blocker |',
    '| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.rank} | ${row.workstream} | ${row.target_route} | ${row.status} | ${row.owner_decision_needed} | ${row.why_first} | ${row.source_packet} | ${row.associated_pages || '-'} | ${row.next_after_approval} | ${row.hard_blocker} |`,
    ),
    '',
    '## Recommended Owner Decision',
    '',
    '1. Review rental agreement first because it upgrades an existing route and has a complete owner-review packet.',
    '2. Pick at most one demand-letter context next. Do not approve all three at once.',
    '3. Keep the generic demand-letter page blocked.',
    '4. Before any public update, run legal/source review, SEO review, mobile CTA duplicate QA and publication email workflow.',
    '',
    '## Safety Statement',
    '',
    'This queue exists to avoid abandoned or scattered public-update ideas. It is not approval to publish or monetize anything.',
  ];

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-public-update-owner-approval-queue.mjs --reportDate=YYYY-MM-DD --packetDate=YYYY-MM-DD');
    return;
  }

  const rentalPath = packetPath(packetFiles.rental, args.packetDate);
  const demandPath = packetPath(packetFiles.demand, args.packetDate);
  const rental = readJson(rentalPath);
  const demand = readJson(demandPath);
  const rows = buildQueueRows(rental, demand);
  const status = queueStatus(rows, rental, demand);
  const outputs = outputFiles(args.reportDate);
  const columns = [
    'id',
    'rank',
    'workstream',
    'target_route',
    'owner_decision_needed',
    'status',
    'why_first',
    'source_packet',
    'associated_pages',
    'prepared_public_copy_rows',
    'safe_cta_excerpt',
    'next_after_approval',
    'hard_blocker',
  ];

  const report = {
    reportDate: args.reportDate,
    packetDate: args.packetDate,
    status,
    sourcePackets: {
      rental: rentalPath,
      demand: demandPath,
    },
    summary: {
      rows: rows.length,
      readyForOwnerReview: rows.filter((row) => row.status === 'READY_FOR_OWNER_REVIEW_NOT_APPROVED').length,
      candidatesAfterOwnerChoice: rows.filter((row) => row.status.includes('CANDIDATE')).length,
      explicitlyBlockedRoutes: rows.filter((row) => row.status.includes('BLOCKED')).length,
      sourcePacketMarkerHits: (rental.summary?.forbiddenPublicMarkerHits || 0) + (demand.summary?.forbiddenPublicMarkerHits || 0),
      publicChangesApproved: 0,
    },
    rows,
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

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, packetDate: args.packetDate, status, rows, rental, demand }));
  writeText(outputs.projectCsv, toCsv(rows, columns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(rows, columns));

  console.log(
    JSON.stringify(
      {
        status,
        rows: report.summary.rows,
        readyForOwnerReview: report.summary.readyForOwnerReview,
        candidatesAfterOwnerChoice: report.summary.candidatesAfterOwnerChoice,
        explicitlyBlockedRoutes: report.summary.explicitlyBlockedRoutes,
        sourcePacketMarkerHits: report.summary.sourcePacketMarkerHits,
        publicChangesApproved: 0,
      },
      null,
      2,
    ),
  );
}

main();
