import { mkdirSync, writeFileSync } from 'node:fs';
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
  const base = `low-hype-rv-serp-cannibalization-packet-${reportDate}`;
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildRows() {
  return [
    {
      id: 'SERP-01',
      query_cluster: 'rv_caravan_exact_legal',
      source_title: 'Sampled Hebrew searches for caravan/RV dispute lawyer intent',
      source_url: 'SEARCH: "קרוואן תביעה עורך דין", "השכרת קרוואן תביעה", "קרוואן פיקדון תביעה"',
      source_type: 'serp_sample',
      evidence_summary: 'The sampled result set did not confirm a strong dedicated Israeli legal page for RV/caravan disputes. Results leaned toward supplier terms, insurance pages, a court decision and broad accident/insurance lawyers.',
      user_intent: 'Unclear mixed intent: rental dispute, deposit/charges, insurance claim, accident or travel supplier dispute.',
      route_recommendation: 'Do not create a standalone RV public route yet. Treat RV as a private Low Hype research cluster until GSC/internal demand proves route need.',
      associated_pages: '/consumer-rights-israel/, /rental-agreement/, /small-claims-court-israel/, /contract-law-israel/',
      cannibalization_risk: 'High',
      owner_next_action: 'Approve or reject a second pass using GSC query exports and route inventory before any public page/copy.',
      blocked_actions: 'No public route/title/H1/meta/internal-link/canonical/sitemap/CRM/lead/lawyer/supplier/payment action.',
    },
    {
      id: 'SERP-02',
      query_cluster: 'rv_rental_dispute_deposit_charges',
      source_title: 'Psakdin small-claims RV rental case',
      source_url: 'https://www.psakdin.co.il/Court/%D7%9E%D7%95%D7%A8%D7%9C%D7%99-%D7%95%D7%90%D7%97%27-%D7%A0%27-%D7%91%D7%A8%D7%A1%D7%9C%D7%A8-%D7%A2%D7%91%D7%95%D7%93%D7%95%D7%AA-%D7%99%D7%9E%D7%99%D7%95%D7%AA-%D7%91%D7%A2%22%D7%9E',
      source_type: 'court_decision_database',
      evidence_summary: 'A small-claims dispute surfaced around RV rental abroad, extra charges, transport costs and a deposit not returned. This supports real dispute shape, not standalone SEO demand by itself.',
      user_intent: 'I was charged or my deposit was not returned after a caravan/RV rental.',
      route_recommendation: 'Best first public candidate, if approved, is an existing consumer/rental dispute surface with one narrow section or CTA after review.',
      associated_pages: '/consumer-rights-israel/, /rental-agreement/, /small-claims-court-israel/',
      cannibalization_risk: 'Medium',
      owner_next_action: 'Use this as the first RV pilot candidate only after GSC and legal review confirm fit.',
      blocked_actions: 'Do not publish case-based legal advice or imply outcome; do not create a new RV page yet.',
    },
    {
      id: 'SERP-03',
      query_cluster: 'rv_rental_terms_cancellation_refund',
      source_title: 'Campervan rental terms for Australia/New Zealand',
      source_url: 'https://www.2australia.co.il/campervan-tc/',
      source_type: 'supplier_terms_page',
      evidence_summary: 'Supplier terms show user pain around booking validity, deposits, credit-card fees, cancellation fees and refund timing.',
      user_intent: 'I want to cancel, get a refund or understand rental charges for a campervan booking.',
      route_recommendation: 'Private managed-service package candidate: document review or demand-letter triage. Public work should attach to consumer/rental content, not a generic RV route.',
      associated_pages: '/consumer-rights-israel/, /rental-agreement/, demand-letter approval packet',
      cannibalization_risk: 'Medium',
      owner_next_action: 'If the owner likes this pilot, build a no-public private intake checklist first.',
      blocked_actions: 'Do not contact suppliers or publish terms interpretation without legal review.',
    },
    {
      id: 'SERP-04',
      query_cluster: 'rv_rental_contract_liability',
      source_title: 'Caravan rental terms PDF',
      source_url: 'https://www.caravanim.co.il/Media/Uploads/UBF_%D7%AA%D7%A0%D7%90%D7%99_%D7%94%D7%A9%D7%9B%D7%A8%D7%AA_%D7%A7%D7%A8%D7%95%D7%95%D7%90%D7%9F%281%29.pdf',
      source_type: 'supplier_terms_pdf',
      evidence_summary: 'Rental terms include final charge inspection, personal item exclusions, unauthorized-driver consequences, written-change rules and legal-cost clauses.',
      user_intent: 'The rental company charged me after return or says I breached the caravan rental terms.',
      route_recommendation: 'Useful for private intake questions and legal-review checklist; not enough to approve public copy.',
      associated_pages: '/contract-law-israel/, /consumer-rights-israel/, /small-claims-court-israel/',
      cannibalization_risk: 'Medium',
      owner_next_action: 'Convert into owner-review intake questions only if RV rental disputes become the selected pilot.',
      blocked_actions: 'Do not quote or summarize supplier terms publicly as legal advice.',
    },
    {
      id: 'SERP-05',
      query_cluster: 'rv_insurance_claims',
      source_title: 'Hachshara car insurance page - trailer/caravan coverage',
      source_url: 'https://www.hcsra.co.il/insurances/car-insurance/',
      source_type: 'insurer_page',
      evidence_summary: 'An insurer page explicitly lists trailer/caravan coverage, protection requirements, third-party legal defense and add-on extensions such as rental or bodily-injury gaps.',
      user_intent: 'I need help with caravan insurance, coverage, third-party liability or a rejected claim.',
      route_recommendation: 'Do not combine this with rental/deposit disputes. If used, route through insurance/traffic review with legal specialist validation.',
      associated_pages: 'Insurance, traffic accident and vehicle-damage route inventory to verify',
      cannibalization_risk: 'High',
      owner_next_action: 'Park until insurance-law supplier coverage and existing route overlap are checked.',
      blocked_actions: 'Do not publish RV insurance advice, package pricing or match logic without lawyer review.',
    },
    {
      id: 'SERP-06',
      query_cluster: 'rv_rental_excess_coverage',
      source_title: 'RentalCover motorhome/campervan rental insurance page',
      source_url: 'https://rentalcover.com/he/motorhome-campervan-rental-insurance',
      source_type: 'insurance_product_page',
      evidence_summary: 'Rental insurance content emphasizes excess coverage, exclusions, authorized drivers, towing, damage categories and claim settlement speed.',
      user_intent: 'I was charged for damage/excess after renting a caravan and need to understand the insurance path.',
      route_recommendation: 'Possible private checklist row for evidence gathering; public copy should remain general consumer/insurance help until legally approved.',
      associated_pages: '/consumer-rights-israel/, insurance route inventory, traffic route inventory',
      cannibalization_risk: 'High',
      owner_next_action: 'Only continue after legal review defines whether this is consumer, insurance or travel-supplier work.',
      blocked_actions: 'Do not sell or compare insurance products; do not give coverage advice.',
    },
    {
      id: 'SERP-07',
      query_cluster: 'broad_insurance_law_competitor',
      source_title: 'Oshik Eliahu insurance lawyer page',
      source_url: 'https://www.oshiklaw.com/insur',
      source_type: 'competitor_legal_page',
      evidence_summary: 'Broad insurance-law competitor pages cover car insurance claims, rental car companies, denied claims and civil/insurance representation.',
      user_intent: 'My vehicle/insurance claim was rejected or underpaid.',
      route_recommendation: 'This argues against an RV accident/insurance standalone page; existing broad insurance/vehicle pages may already own the intent.',
      associated_pages: 'Insurance and traffic accident route inventory to verify',
      cannibalization_risk: 'High',
      owner_next_action: 'Do competitor SERP comparison only if GSC shows caravan/RV modifiers with impressions.',
      blocked_actions: 'Do not add RV accident/insurance metadata or links before overlap review.',
    },
    {
      id: 'SERP-08',
      query_cluster: 'road_accident_law_competitor',
      source_title: 'Guy Deutsch car accident lawyer page',
      source_url: 'https://dlawyer.co.il/expertise/car-accident-lawyer/',
      source_type: 'competitor_legal_page',
      evidence_summary: 'Car-accident competitor content is mature, specialist and injury-focused. RV accident wording would likely collide with existing accident pages unless there is clear GSC demand.',
      user_intent: 'I was injured in a vehicle accident and need compensation help.',
      route_recommendation: 'Keep RV accident rows split from rental/consumer disputes. Do not use accident angle as the first Low Hype pilot.',
      associated_pages: 'Traffic accident, personal injury and insurance route inventory to verify',
      cannibalization_risk: 'High',
      owner_next_action: 'If accident demand exists, route it to existing accident/legal-help surfaces instead of creating an RV page.',
      blocked_actions: 'No accident/injury public copy from this packet.',
    },
  ];
}

function buildSummary(reportDate, rows) {
  return {
    reportDate,
    status: 'SERP_REVIEW_PACKET_READY_NOT_APPROVED_FOR_PUBLICATION',
    sampledRows: rows.length,
    directStandaloneRvPublicRouteApproved: 0,
    recommendedFirstPilot: 'RV rental/deposit/charge dispute attached to existing consumer/rental surfaces',
    highCannibalizationRows: rows.filter((row) => row.cannibalization_risk === 'High').length,
    mediumCannibalizationRows: rows.filter((row) => row.cannibalization_risk === 'Medium').length,
    publicChangesApproved: 0,
    crmRecordsCreated: 0,
    leadOrSupplierContactActions: 0,
    emailSent: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, rows) {
  return [
    `# Low Hype / RV SERP Cannibalization Packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private research and anti-cannibalization packet only. This does not approve publishing, metadata, links, CRM records, lawyer/supplier outreach, payments, email or deployment.',
    '',
    '## Working Conclusion',
    '',
    `Recommended first pilot, if the owner wants to continue: ${summary.recommendedFirstPilot}.`,
    '',
    'Do not create a standalone RV/caravan public route yet. The sampled research points to mixed intent and high overlap with consumer, rental, insurance, traffic accident and small-claims surfaces.',
    '',
    '## Summary',
    '',
    `- Sampled research rows: ${summary.sampledRows}`,
    `- High cannibalization rows: ${summary.highCannibalizationRows}`,
    `- Medium cannibalization rows: ${summary.mediumCannibalizationRows}`,
    `- Standalone RV route approved: ${summary.directStandaloneRvPublicRouteApproved}`,
    `- Public/CRM/payment/email actions taken: 0`,
    '',
    '## Rows',
    '',
    '| ID | Query Cluster | Source | Evidence Summary | Route Recommendation | Risk | Next Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${mdCell(row.query_cluster)} | [${mdCell(row.source_title)}](${row.source_url}) | ${mdCell(row.evidence_summary)} | ${mdCell(row.route_recommendation)} | ${mdCell(row.cannibalization_risk)} | ${mdCell(row.owner_next_action)} |`),
    '',
    '## Go / No-Go',
    '',
    'GO only for a second private pass if the owner approves RV rental/deposit/charge disputes as a candidate.',
    '',
    'NO-GO for public standalone route, accident/insurance page, public Low Hype label, title/H1/meta, internal links, supplier outreach, CRM import or payment workflow from this packet.',
    '',
    '## Required Next Evidence',
    '',
    '1. GSC query export for Hebrew caravan/RV, campervan, deposit, cancellation, rental charge and insurance modifiers.',
    '2. Internal route inventory for consumer, rental, contract, small-claims, insurance and traffic/accident pages.',
    '3. Legal review to decide whether the pilot is consumer contract, insurance, travel supplier, accident/injury or small-claims support.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-low-hype-rv-serp-cannibalization-packet.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const files = outputFiles(args.reportDate);
const rows = buildRows();
const summary = buildSummary(args.reportDate, rows);
const columns = [
  'id',
  'query_cluster',
  'source_title',
  'source_url',
  'source_type',
  'evidence_summary',
  'user_intent',
  'route_recommendation',
  'associated_pages',
  'cannibalization_risk',
  'owner_next_action',
  'blocked_actions',
];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdownReport(summary, rows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify({ ...summary, files }, null, 2));
