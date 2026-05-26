import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const codeFiles = {
  fulfillment: path.join(ROOT, 'inc', 'legal-request-fulfillment.php'),
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  revenueStreams: path.join(ROOT, 'inc', 'revenue-streams.php'),
};

const packageRows = [
  {
    key: 'rental_agreement',
    private_label: 'Rental agreement review / draft',
    pilot_order: 1,
    suggested_price_ils: 299,
    risk_level: 'medium',
    first_scope: 'Residential lease review or custom draft from owner-approved checklist.',
    blockers: 'lawyer of record; signed engagement; ethics review; payment proof; no public checkout',
    cannibalization_review: 'Check existing rental, real-estate and apartment contract articles before any page or CTA.',
  },
  {
    key: 'demand_letter_review',
    private_label: 'Demand letter with lawyer review',
    pilot_order: 2,
    suggested_price_ils: 599,
    risk_level: 'medium-high',
    first_scope: 'Manual lawyer-reviewed warning letter for consumer, employment or rental dispute.',
    blockers: 'claim-specific lawyer review; evidence checklist; engagement letter; payment proof; no AI draft promise',
    cannibalization_review: 'Check employment, consumer and rental dispute pages before any public demand-letter tool.',
  },
  {
    key: 'nii_appeal_package',
    private_label: 'Bituach Leumi appeal package',
    pilot_order: 3,
    suggested_price_ils: 1499,
    risk_level: 'high',
    first_scope: 'Controlled manual appeal-file preparation with specialist lawyer supervision.',
    blockers: 'three verified BTL specialists; client consent; medical-document handling; engagement; payment proof',
    cannibalization_review: 'Use the existing Bituach Leumi route-intent split before any public copy or linking.',
  },
  {
    key: 'simple_will',
    private_label: 'Simple will package',
    pilot_order: 4,
    suggested_price_ils: 599,
    risk_level: 'high',
    first_scope: 'Single-person simple will only after lawyer confirms scope and ceremony requirements.',
    blockers: 'lawyer of record; capacity/conflict checks; witness/notary process; engagement; payment proof',
    cannibalization_review: 'Check inheritance, wills and estate-planning pages before creating or upgrading a package page.',
  },
  {
    key: 'prenuptial_agreement',
    private_label: 'Prenuptial / financial agreement',
    pilot_order: 5,
    suggested_price_ils: 999,
    risk_level: 'high',
    first_scope: 'Financial agreement intake and lawyer-supervised draft, no court filing promise.',
    blockers: 'family-law lawyer; conflict checks; court/notary approval process; engagement; payment proof',
    cannibalization_review: 'Check family-law, divorce and financial-agreement pages before any public route.',
  },
  {
    key: 'company_formation',
    private_label: 'Company formation documents',
    pilot_order: 6,
    suggested_price_ils: 1890,
    risk_level: 'medium-high',
    first_scope: 'Company formation document pack with corporate lawyer and manual filing proof.',
    blockers: 'corporate lawyer; filing path; beneficial-owner/KYC details; engagement; payment proof',
    cannibalization_review: 'Check business, companies and corporate-law pages before public packaging.',
  },
  {
    key: 'cross_border_consult',
    private_label: 'Cross-border / immigration consult bundle',
    pilot_order: 7,
    suggested_price_ils: 2990,
    risk_level: 'high',
    first_scope: 'Consult bundle only, with Israeli lawyer plus external supplier where needed.',
    blockers: 'supplier registration; lawyer/supplier role separation; consent; accepted terms; payment proof',
    cannibalization_review: 'Check Aliyah, immigration, citizenship, tax and diaspora pages before any offer page.',
  },
];

const requiredMarkers = [
  {
    id: 'GATE-01',
    area: 'private_meta',
    marker: 'justice_theme_legal_request_fulfillment_meta_fields',
    evidence: 'Owner-only fulfillment meta fields are registered on justice_legal_request.',
  },
  {
    id: 'GATE-02',
    area: 'package_catalog',
    marker: 'justice_theme_service_package_options',
    evidence: 'Private package selector exists in the LegalTech request fulfillment metabox.',
  },
  {
    id: 'GATE-03',
    area: 'readiness_logic',
    marker: 'justice_theme_legal_request_fulfillment_readiness',
    evidence: 'Readiness logic blocks managed fulfillment unless lawyer, engagement, ethics and payment gates are recorded.',
  },
  {
    id: 'GATE-04',
    area: 'crm_panel',
    marker: 'justice_theme_render_managed_service_fulfillment_panel',
    evidence: 'Justice CRM has a private managed-service fulfillment preflight panel.',
  },
  {
    id: 'GATE-05',
    area: 'public_blocker',
    marker: 'BLOCKED for public launch',
    evidence: 'Admin copy explicitly blocks public launch until ethics/engagement/payment gates are clear.',
  },
  {
    id: 'GATE-06',
    area: 'revenue_stream',
    marker: 'AI-native managed legal services',
    evidence: 'Revenue-stream map records the managed-services idea as started privately, not public.',
  },
];

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
  const base = `managed-service-package-pilot-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
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

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function packageKeyPresent(source, key) {
  return source.includes(`'${key}'`) || source.includes(`"${key}"`);
}

function buildGateRows(sources) {
  return requiredMarkers.map((gate) => {
    const source =
      gate.id === 'GATE-06'
        ? sources.revenueStreams
        : gate.id === 'GATE-04'
          ? sources.crm + sources.fulfillment
          : sources.fulfillment;
    return {
      id: gate.id,
      area: gate.area,
      status: source.includes(gate.marker) ? 'PASS' : 'BLOCKED',
      evidence: gate.evidence,
      next_action: source.includes(gate.marker)
        ? 'Keep as private/admin-only gate.'
        : `Restore marker ${gate.marker} before using managed-service packages.`,
    };
  });
}

function buildPackageRows(sources) {
  return packageRows.map((row) => {
    const existsInCatalog = packageKeyPresent(sources.fulfillment, row.key);
    return {
      ...row,
      catalog_status: existsInCatalog ? 'PASS' : 'BLOCKED',
      public_launch_status: 'BLOCKED_PRIVATE_PILOT_ONLY',
      private_pilot_status: existsInCatalog ? 'READY_FOR_OWNER_CONTROLLED_REQUEST' : 'BLOCKED_NOT_IN_PRIVATE_CATALOG',
      required_admin_gates:
        'fulfillment_mode=lawyer_managed_package; managing_lawyer_id set; engagement_letter_status=signed; ethics_review_status=approved_for_pilot; client_payment_status=paid',
      owner_next_action: existsInCatalog
        ? 'Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.'
        : 'Add to private package catalog before any controlled request.',
    };
  });
}

function markdownReport(reportDate, summary, gateRows, packageRowsForReport) {
  return [
    `# Managed Legal-Service Package Pilot Packet - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private readiness packet for the Lawhive-style managed legal-service path. This does not publish a service page, create a checkout, create a client request, create a lawyer assignment, send email/WhatsApp, draft legal documents, invoice, charge payment, change SEO controls or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Admin/static gates passing: ${summary.passCount}/${summary.gateCount}`,
    `- Private package candidates checked: ${summary.packageCount}`,
    `- Packages present in private catalog: ${summary.catalogPassCount}/${summary.packageCount}`,
    `- Public launch approvals: 0`,
    '',
    '## Admin Gate Results',
    '',
    '| ID | Area | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map((row) => `| ${row.id} | ${row.area} | ${row.status} | ${row.evidence.replace(/\|/g, '/')} | ${row.next_action.replace(/\|/g, '/')} |`),
    '',
    '## Private Package Pilot Queue',
    '',
    '| Order | Package | Suggested Price | Risk | Private Status | Public Status |',
    '| --- | --- | --- | --- | --- | --- |',
    ...packageRowsForReport.map((row) => `| ${row.pilot_order} | ${row.private_label} | ${row.suggested_price_ils} | ${row.risk_level} | ${row.private_pilot_status} | ${row.public_launch_status} |`),
    '',
    '## Package Notes',
    '',
    ...packageRowsForReport.map((row) => [
      `### ${row.pilot_order}. ${row.private_label}`,
      `- First controlled scope: ${row.first_scope}`,
      `- Blockers: ${row.blockers}`,
      `- Cannibalization review before public page: ${row.cannibalization_review}`,
      `- Owner next action: ${row.owner_next_action}`,
      '',
    ].join('\n')),
    '## Controlled Pilot Run Order',
    '',
    '1. Choose one package from this packet; start with rental agreement or demand letter, not a high-risk family/will/immigration package.',
    '2. Create or use one private `justice_legal_request` only after owner approval.',
    '3. Set package, fulfillment mode and managing lawyer of record.',
    '4. Record signed engagement, ethics approval for the pilot structure and payment proof.',
    '5. Fulfill manually under lawyer supervision; do not use unattended AI drafting.',
    '6. Record owner notes, case reference and payment evidence before counting revenue.',
    '',
    '## Public Launch Stop Conditions',
    '',
    '1. No Israeli Bar/ethics-reviewed engagement structure.',
    '2. No managing lawyer of record.',
    '3. No signed client engagement letter.',
    '4. No payment proof and refund/cancel path.',
    '5. No anti-cannibalization review for the target page and associated existing articles/tools.',
    '6. No owner approval for exact public copy, URL, title/H1/meta and checkout wording.',
    '',
    '## Safety Statement',
    '',
    'This packet is private infrastructure only. It is not approval to publish packaged legal-service pages, sell a service, offer fixed legal outcomes, run AI drafting, contact clients/lawyers, process payment, or represent Jus-Tice publicly as a law firm.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-managed-service-package-pilot-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const sources = {
  fulfillment: readText(codeFiles.fulfillment),
  crm: readText(codeFiles.crm),
  revenueStreams: readText(codeFiles.revenueStreams),
};
const gateRows = buildGateRows(sources);
const pilotRows = buildPackageRows(sources);
const passCount = gateRows.filter((row) => row.status === 'PASS').length;
const catalogPassCount = pilotRows.filter((row) => row.catalog_status === 'PASS').length;
const summary = {
  reportDate: args.reportDate,
  status:
    passCount === gateRows.length && catalogPassCount === pilotRows.length
      ? 'PRIVATE_PACKAGE_PILOT_READY_WITH_PUBLIC_BLOCKERS'
      : 'BLOCKED_PRIVATE_PACKAGE_GATES',
  gateCount: gateRows.length,
  passCount,
  packageCount: pilotRows.length,
  catalogPassCount,
  publicLaunchApprovals: 0,
};
const files = outputFiles(args.reportDate);
const packageColumns = [
  'pilot_order',
  'key',
  'private_label',
  'suggested_price_ils',
  'risk_level',
  'first_scope',
  'catalog_status',
  'private_pilot_status',
  'public_launch_status',
  'required_admin_gates',
  'blockers',
  'cannibalization_review',
  'owner_next_action',
];
const csv = toCsv(pilotRows, packageColumns);

writeText(files.projectMd, markdownReport(args.reportDate, summary, gateRows, pilotRows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, gateRows, pilotRows, files }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify(summary, null, 2));
