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
  const base = `low-hype-rv-opportunity-brief-${reportDate}`;
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
      id: 'LH-01',
      theme: 'low_hype_operating_rule',
      opportunity: 'Use Low Hype as a private operating label for quiet, high-intent legal-help opportunities rather than a public brand or public page.',
      audience: 'Owner and operators only',
      revenue_path: 'Prioritize narrow user problems where a lawyer/supplier can be matched, scoped and billed without turning the public site into a sales pitch.',
      associated_surfaces: 'Private strategy docs, Linear backlog, managed-service package pilot, legal-request CRM flow',
      cannibalization_surfaces: 'Any future public page must be checked against existing practice/local pages before route/title/H1/meta/link decisions.',
      risk: 'Medium',
      status: 'PRIVATE_STRATEGY_READY_NOT_PUBLIC',
      next_action: 'Owner confirms whether Low Hype is only an internal decision filter or also a future public content category.',
      blocked_action: 'Do not publish a Low Hype page, navigation item, public tagline or service label without owner approval.',
    },
    {
      id: 'LH-02',
      theme: 'anti_cannibalization_gate',
      opportunity: 'Attach every Low Hype idea to an existing route candidate or an explicit new-route blocker before writing public copy.',
      audience: 'SEO/content operator',
      revenue_path: 'Avoid wasted pages by upgrading existing user-intent surfaces first, then measuring demand before building new pages.',
      associated_surfaces: '/consumer-rights-israel/, /rental-agreement/, /labor-lawyer/, /eviction-notice-israel/, managed-service approval queue',
      cannibalization_surfaces: 'Consumer, rental, labor, eviction, small-claims, contract, insurance and traffic/fines pages',
      risk: 'High',
      status: 'GATE_REQUIRED_BEFORE_PUBLIC_COPY',
      next_action: 'Run GSC, internal route inventory and competitor review before selecting any public route.',
      blocked_action: 'Do not create a title, H1, meta description, URL, canonical, sitemap entry or internal link from this brief.',
    },
    {
      id: 'RV-01',
      theme: 'rv_purchase_or_rental_disputes',
      opportunity: 'RV/caravan purchase, rental, damage-deposit or cancellation disputes may fit consumer-contract legal help if demand is proven.',
      audience: 'People with an RV/caravan rental or purchase dispute',
      revenue_path: 'Qualified consultation, document review, demand-letter package or lawyer match after consent and scope confirmation.',
      associated_surfaces: '/consumer-rights-israel/, /rental-agreement/, /contract-law-israel/, /small-claims-court-israel/',
      cannibalization_surfaces: 'Consumer rights, rental agreement, contract law, small claims and demand-letter packets',
      risk: 'Medium',
      status: 'PILOT_CANDIDATE_RESEARCH_ONLY',
      next_action: 'Check GSC/internal demand and competitor SERPs; if promising, upgrade an existing consumer/rental page before considering a new RV route.',
      blocked_action: 'Do not publish RV public copy or contact clients/lawyers/suppliers from this idea alone.',
    },
    {
      id: 'RV-02',
      theme: 'rv_vehicle_import_license_insurance',
      opportunity: 'RV/caravan import, registration, licensing, insurance or road-use problems may be legally valuable but need specialist review.',
      audience: 'Owners/importers with vehicle-status, licensing or insurance questions',
      revenue_path: 'Specialist referral or paid intake only after the legal category and supplier coverage are confirmed.',
      associated_surfaces: 'Insurance, traffic/fines, import/tax and consumer route inventory to verify',
      cannibalization_surfaces: 'Traffic, insurance, vehicle import/tax and general consumer pages',
      risk: 'High',
      status: 'LEGAL_REVIEW_REQUIRED',
      next_action: 'Identify whether this is traffic, insurance, import/tax or consumer-law intent before any route or partner outreach.',
      blocked_action: 'Do not promise outcomes, quote legal rules, publish advice or sell a package before lawyer/legal review.',
    },
    {
      id: 'RV-03',
      theme: 'camping_parking_municipal_fines',
      opportunity: 'Camping, parking, campsite or municipal fine issues may become a narrow support page only if there is search/lead evidence.',
      audience: 'Drivers/travelers dealing with local fines or campsite disputes',
      revenue_path: 'Small paid review, objection help, or lawyer match if the case value supports it.',
      associated_surfaces: 'Municipal, traffic/fines, small-claims and consumer route inventory to verify',
      cannibalization_surfaces: 'Traffic fines, municipal law, consumer disputes and small claims pages',
      risk: 'High',
      status: 'LOW_CONFIDENCE_RESEARCH_ONLY',
      next_action: 'Use only as a research row until demand, competitor pages and legal ownership are checked.',
      blocked_action: 'Do not create a public municipal/RV/fines page without evidence and anti-cannibalization review.',
    },
    {
      id: 'RV-04',
      theme: 'rv_accident_or_damage_claims',
      opportunity: 'RV/caravan accident, property damage or insurance-claim disputes may route into existing injury/insurance/consumer surfaces.',
      audience: 'Owners/renters after an accident, damage charge or rejected insurance claim',
      revenue_path: 'Lawyer match, claim review or document package after consent and scope triage.',
      associated_surfaces: 'Insurance, tort/injury, traffic and consumer route inventory to verify',
      cannibalization_surfaces: 'Personal injury, traffic accident, insurance and consumer pages',
      risk: 'Medium',
      status: 'ROUTE_INTENT_SPLIT_REQUIRED',
      next_action: 'Split accident/injury intent from consumer damage-deposit intent before any public copy is written.',
      blocked_action: 'Do not combine injury, insurance and consumer contract intent into one generic RV page.',
    },
    {
      id: 'PILOT-01',
      theme: 'first_low_hype_pilot_choice',
      opportunity: 'Choose one first pilot only: likely RV purchase/rental disputes if evidence supports it, otherwise keep RV as a parking-lot idea.',
      audience: 'Owner, SEO reviewer, legal reviewer',
      revenue_path: 'One controlled private package or one existing-route update, not a broad public launch.',
      associated_surfaces: 'Public update owner approval queue, managed-service package pilot, legal request CRM',
      cannibalization_surfaces: 'All related public routes chosen by the route inventory',
      risk: 'Medium',
      status: 'OWNER_DECISION_REQUIRED',
      next_action: 'Owner approves or rejects one pilot topic after GSC, competitor and legal review.',
      blocked_action: 'Do not open multiple Low Hype/RV tracks at once.',
    },
    {
      id: 'OPS-01',
      theme: 'execution_boundary',
      opportunity: 'Keep the idea infrastructure private until there is a clear approval chain and one measurable next action.',
      audience: 'Codex and remote operators',
      revenue_path: 'Protect focus: one approved pilot, one matching lawyer/supplier path, one payment-proof path.',
      associated_surfaces: 'Linear issue, task board, current status, next actions',
      cannibalization_surfaces: 'None directly; this is an operating boundary row.',
      risk: 'Low',
      status: 'BOUNDARY_READY',
      next_action: 'Record this brief in Linear and use it as the start point for future Low Hype/RV tasks.',
      blocked_action: 'Do not email, WhatsApp, TalkTo, create CRM records, publish pages, route leads, invoice, mark paid or deploy from this brief.',
    },
  ];
}

function buildSummary(reportDate, rows) {
  const pilotCandidates = rows.filter((row) => row.id.startsWith('RV-')).length;
  const highRiskRows = rows.filter((row) => row.risk === 'High').length;

  return {
    reportDate,
    status: 'PRIVATE_OPPORTUNITY_BRIEF_READY_NOT_APPROVED_FOR_PUBLICATION',
    rowCount: rows.length,
    pilotCandidates,
    highRiskRows,
    publicChangesApproved: 0,
    publicPagesPublished: 0,
    crmRecordsCreated: 0,
    leadsContacted: 0,
    lawyersOrSuppliersContacted: 0,
    invoicesOrPaymentsCreated: 0,
    emailSent: 0,
    whatsappTalktoActions: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, rows) {
  return [
    `# Low Hype / RV Opportunity Brief - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private owner/operator opportunity infrastructure only. This packet does not approve any public page, public label, route, title, H1, meta description, internal link, CRM record, lead handoff, supplier outreach, invoice, payment, email, WhatsApp/TalkTo action or deployment.',
    '',
    '## Why This Exists',
    '',
    'The owner asked to start infrastructuring the Low Hype idea and the RV opportunity without getting blocked on live CRM/payment gates. The safe move is to turn the idea into a decision packet that protects the public site: users should only see a legal-help site, while internal revenue logic stays private.',
    '',
    '## Summary',
    '',
    `- Rows prepared: ${summary.rowCount}`,
    `- RV pilot candidates: ${summary.pilotCandidates}`,
    `- High-risk rows needing review before public work: ${summary.highRiskRows}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    `- CRM/lead/lawyer/payment/email/WhatsApp/TalkTo actions taken: 0`,
    '',
    '## Opportunity Rows',
    '',
    '| ID | Theme | Opportunity | Status | Risk | Next Action | Blocked Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${mdCell(row.theme)} | ${mdCell(row.opportunity)} | ${mdCell(row.status)} | ${mdCell(row.risk)} | ${mdCell(row.next_action)} | ${mdCell(row.blocked_action)} |`),
    '',
    '## Anti-Cannibalization Surfaces To Inspect',
    '',
    ...rows
      .filter((row) => row.cannibalization_surfaces && row.cannibalization_surfaces !== 'None directly; this is an operating boundary row.')
      .map((row) => `- ${row.id}: ${row.cannibalization_surfaces}`),
    '',
    '## Owner Decision Needed Before Any Public Work',
    '',
    '1. Confirm whether Low Hype remains an internal strategy label only.',
    '2. Approve, reject or park RV purchase/rental disputes as the first possible pilot.',
    '3. Require GSC, internal route inventory, competitor SERP review and legal review before any public route/copy/link is drafted.',
    '',
    '## Safety Statement',
    '',
    'This brief is private and repo-local. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-low-hype-rv-opportunity-brief.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const files = outputFiles(args.reportDate);
const rows = buildRows();
const summary = buildSummary(args.reportDate, rows);
const columns = [
  'id',
  'theme',
  'opportunity',
  'audience',
  'revenue_path',
  'associated_surfaces',
  'cannibalization_surfaces',
  'risk',
  'status',
  'next_action',
  'blocked_action',
];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdownReport(summary, rows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify({ ...summary, files }, null, 2));
