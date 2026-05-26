import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const queryFilters = [
  {
    id: 'QF-01',
    cluster: 'rv_caravan_exact',
    include_terms: 'קרוואן | קראוון | קרוואנים | קראוונים | caravan | campervan | motorhome',
    exclude_or_note: 'Treat bare RV as ambiguous unless paired with rental/caravan/campervan/insurance/legal terms.',
    purpose: 'Detect whether there is any real Search Console demand around caravan/RV terms.',
  },
  {
    id: 'QF-02',
    cluster: 'rental_deposit_charge',
    include_terms: 'השכרת קרוואן | פיקדון קרוואן | נזק קרוואן | חיוב קרוואן | ביטול השכרת קרוואן | refund caravan | caravan deposit',
    exclude_or_note: 'This is the preferred first pilot cluster if demand exists.',
    purpose: 'Validate the consumer/rental dispute path.',
  },
  {
    id: 'QF-03',
    cluster: 'consumer_small_claims',
    include_terms: 'תביעה קרוואן | תביעות קטנות קרוואן | החזר קרוואן | ביטול עסקה קרוואן',
    exclude_or_note: 'Do not infer legal advice from one query; use only as demand signal.',
    purpose: 'Check whether RV demand belongs to consumer/small-claims surfaces.',
  },
  {
    id: 'QF-04',
    cluster: 'insurance_claim',
    include_terms: 'ביטוח קרוואן | תביעת ביטוח קרוואן | caravan insurance | campervan insurance',
    exclude_or_note: 'Insurance path is blocked as first pilot until lawyer/legal coverage review.',
    purpose: 'Separate insurance demand from rental/deposit disputes.',
  },
  {
    id: 'QF-05',
    cluster: 'accident_traffic',
    include_terms: 'תאונת קרוואן | קנס קרוואן | תעבורה קרוואן | caravan accident | RV accident',
    exclude_or_note: 'Accident/traffic path is blocked as first pilot unless GSC shows clear separate demand.',
    purpose: 'Prevent accident/traffic cannibalization.',
  },
];

const pageFilters = [
  '/consumer-rights-israel/',
  '/rental-agreement/',
  '/small-claims-court-israel/',
  '/contract-law-israel/',
  '/eviction-notice-israel/',
  '/real-estate-lawyer-guide/',
  '/traffic-lawyer/',
  '/lawyers/',
];

const decisionRows = [
  {
    id: 'DEC-01',
    signal: 'No exact RV/caravan/campervan impressions',
    interpretation: 'Keep RV as a private Low Hype parking-lot idea.',
    allowed_next_step: 'No public work. Recheck only if owner has WhatsApp/TalkTo/CRM lead evidence.',
    blocked_action: 'No standalone RV page, metadata, link, CRM flow or supplier outreach.',
  },
  {
    id: 'DEC-02',
    signal: 'Exact rental/deposit/charge queries show impressions on /consumer-rights-israel/ or /rental-agreement/',
    interpretation: 'Owner may review a narrow consumer/rental pilot, not a new route.',
    allowed_next_step: 'Prepare exact owner-review copy packet only after legal review.',
    blocked_action: 'No publish, no title/H1/meta, no internal link, no uPress.',
  },
  {
    id: 'DEC-03',
    signal: 'Queries split across consumer, rental, small-claims and contract pages',
    interpretation: 'High cannibalization risk. Need one route owner and internal-link plan.',
    allowed_next_step: 'Build a route-decision map; keep public copy blocked.',
    blocked_action: 'No generic RV or demand-letter page.',
  },
  {
    id: 'DEC-04',
    signal: 'Most demand is insurance, accident or traffic',
    interpretation: 'Do not use the consumer/rental pilot. Separate legal coverage is required.',
    allowed_next_step: 'Park until insurance/traffic lawyer supply and legal review exist.',
    blocked_action: 'No accident/insurance/traffic RV page or advice.',
  },
  {
    id: 'DEC-05',
    signal: 'One or more pages already get RV queries but page content has no RV markers',
    interpretation: 'Potential thin-section opportunity, but only after source/legal review.',
    allowed_next_step: 'Owner may approve a tiny legal-help-first section draft packet.',
    blocked_action: 'No public edit without exact text approval and post-publication QA.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    routeOverlap: '',
    sourceSerp: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--routeOverlap=')) {
      args.routeOverlap = arg.slice('--routeOverlap='.length);
    } else if (arg.startsWith('--sourceSerp=')) {
      args.sourceSerp = arg.slice('--sourceSerp='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (!args.routeOverlap) {
    args.routeOverlap = path.join(ROOT, '.reports', `low-hype-rv-internal-route-overlap-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.routeOverlap)) {
    args.routeOverlap = path.join(ROOT, args.routeOverlap);
  }

  if (!args.sourceSerp) {
    args.sourceSerp = path.join(ROOT, '.reports', `low-hype-rv-serp-cannibalization-packet-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceSerp)) {
    args.sourceSerp = path.join(ROOT, args.sourceSerp);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `low-hype-rv-gsc-evidence-request-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    queryTemplateCsv: path.join(ROOT, '.project-control', `low-hype-rv-gsc-query-template-${reportDate}.csv`),
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

function buildRequestRows(routeOverlap, sourceSerp) {
  const sourceSummary = sourceSerp.summary || {};
  const overlapSummary = routeOverlap.summary || {};

  return [
    {
      id: 'GSC-01',
      request_type: 'query_page_export',
      input_or_filter: queryFilters.map((row) => `${row.cluster}: ${row.include_terms}`).join(' || '),
      output_needed: 'Export queries + pages + clicks + impressions + CTR + position for the last 16 months if available.',
      why_it_matters: 'Confirms whether RV/caravan demand exists and which current page already receives it.',
      source_context: sourceSummary.status || 'SERP packet not found',
      owner_or_operator_action: 'In Search Console Performance, filter query by each term cluster and export Query+Page rows.',
      status: 'OWNER_GSC_EXPORT_REQUIRED',
    },
    {
      id: 'GSC-02',
      request_type: 'page_filter_export',
      input_or_filter: pageFilters.join(' | '),
      output_needed: 'Export page-level and query-page rows for all candidate existing routes.',
      why_it_matters: 'Prevents creating a new page when existing consumer/rental pages already own the demand.',
      source_context: overlapSummary.status || 'Route-overlap packet not found',
      owner_or_operator_action: 'Export pages filtered to the listed routes, then paste rows into the template CSV.',
      status: 'OWNER_GSC_EXPORT_REQUIRED',
    },
    {
      id: 'GSC-03',
      request_type: 'cannibalization_scan',
      input_or_filter: 'same query appears on 2+ candidate pages or page intent splits across consumer/rental/insurance/traffic',
      output_needed: 'Rows showing query, page, clicks, impressions, position and route family.',
      why_it_matters: 'Avoids a generic RV route that steals from consumer, rental, small-claims, insurance or traffic pages.',
      source_context: 'Route overlap found 2 primary consumer/rental surfaces and 5 high-risk adjacent rows.',
      owner_or_operator_action: 'Mark every row with route_family and decision_status in the template.',
      status: 'OWNER_GSC_EXPORT_REQUIRED',
    },
    {
      id: 'GSC-04',
      request_type: 'go_no_go_decision',
      input_or_filter: 'filled template plus owner/legal review',
      output_needed: 'One of: park idea, private-only intake, existing-route tiny section, or route-decision map.',
      why_it_matters: 'Creates a clear stop/go before any copy is drafted or published.',
      source_context: 'Standalone RV route remains unapproved.',
      owner_or_operator_action: 'Use decision rows DEC-01 through DEC-05 after the export is filled.',
      status: 'BLOCKED_UNTIL_EXPORT_FILLED',
    },
  ];
}

function buildTemplateRows() {
  return queryFilters.flatMap((filter) =>
    pageFilters.map((routePath) => ({
      query_cluster: filter.cluster,
      query_or_filter_used: filter.include_terms,
      landing_page: routePath,
      clicks: '',
      impressions: '',
      ctr: '',
      position: '',
      date_range: 'last_16_months_or_available',
      country: 'Israel if available',
      device: 'all',
      route_family: classifyRoute(routePath),
      decision_status: 'not_filled',
      operator_note_no_pii: '',
    }))
  );
}

function classifyRoute(routePath) {
  if (routePath.includes('consumer')) return 'consumer';
  if (routePath.includes('rental')) return 'rental_contract';
  if (routePath.includes('small-claims')) return 'small_claims';
  if (routePath.includes('contract')) return 'contract';
  if (routePath.includes('eviction')) return 'rental_dispute';
  if (routePath.includes('insurance')) return 'insurance';
  if (routePath.includes('traffic')) return 'traffic';
  if (routePath.includes('lawyers')) return 'directory_conversion';
  return 'context';
}

function buildSummary(reportDate, requestRows, templateRows, routeOverlap, sourceSerp) {
  return {
    reportDate,
    status: 'GSC_EVIDENCE_REQUEST_READY_EXPORT_NOT_FILLED',
    requestRows: requestRows.length,
    queryFilters: queryFilters.length,
    candidatePages: pageFilters.length,
    templateRows: templateRows.length,
    decisionRules: decisionRows.length,
    sourceSerpStatus: sourceSerp.summary?.status || '',
    sourceRouteOverlapStatus: routeOverlap.summary?.status || '',
    standaloneRvRouteApproved: 0,
    publicChangesApproved: 0,
    gscApiCalled: 0,
    emailSent: 0,
    crmRecordsCreated: 0,
    leadOrSupplierContactActions: 0,
    upressDeploymentRequired: false,
  };
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownReport(summary, requestRows, templateRows) {
  return [
    `# Low Hype / RV GSC Evidence Request - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private Search Console export request and decision template only. This does not call the GSC API, open OAuth, publish public content, change metadata/links, create CRM records, contact anyone, send email or deploy.',
    '',
    '## Why This Exists',
    '',
    'The RV SERP and route-overlap packets both point to the same blocker: before drafting any public copy, the team needs query/page evidence from GSC. This packet defines the exact filters, candidate pages and go/no-go rules.',
    '',
    '## Summary',
    '',
    `- Query filters: ${summary.queryFilters}`,
    `- Candidate pages: ${summary.candidatePages}`,
    `- Blank template rows: ${summary.templateRows}`,
    `- Decision rules: ${summary.decisionRules}`,
    `- GSC API called: ${summary.gscApiCalled}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Export Requests',
    '',
    '| ID | Type | Input / Filter | Output Needed | Owner / Operator Action | Status |',
    '| --- | --- | --- | --- | --- | --- |',
    ...requestRows.map((row) =>
      `| ${row.id} | ${mdCell(row.request_type)} | ${mdCell(row.input_or_filter)} | ${mdCell(row.output_needed)} | ${mdCell(row.owner_or_operator_action)} | ${row.status} |`
    ),
    '',
    '## Query Filters',
    '',
    '| ID | Cluster | Include Terms | Note | Purpose |',
    '| --- | --- | --- | --- | --- |',
    ...queryFilters.map((row) =>
      `| ${row.id} | ${row.cluster} | ${mdCell(row.include_terms)} | ${mdCell(row.exclude_or_note)} | ${mdCell(row.purpose)} |`
    ),
    '',
    '## Decision Rules After Export',
    '',
    '| ID | Signal | Interpretation | Allowed Next Step | Blocked Action |',
    '| --- | --- | --- | --- | --- |',
    ...decisionRows.map((row) =>
      `| ${row.id} | ${mdCell(row.signal)} | ${mdCell(row.interpretation)} | ${mdCell(row.allowed_next_step)} | ${mdCell(row.blocked_action)} |`
    ),
    '',
    '## Template Preview',
    '',
    `Blank rows generated in \`.project-control/low-hype-rv-gsc-query-template-${summary.reportDate}.csv\`: ${templateRows.length}.`,
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-low-hype-rv-gsc-evidence-request.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const routeOverlap = readJson(args.routeOverlap);
const sourceSerp = readJson(args.sourceSerp);
const requestRows = buildRequestRows(routeOverlap, sourceSerp);
const templateRows = buildTemplateRows();
const summary = buildSummary(args.reportDate, requestRows, templateRows, routeOverlap, sourceSerp);
const files = outputFiles(args.reportDate);

const requestColumns = [
  'id',
  'request_type',
  'input_or_filter',
  'output_needed',
  'why_it_matters',
  'source_context',
  'owner_or_operator_action',
  'status',
];
const templateColumns = [
  'query_cluster',
  'query_or_filter_used',
  'landing_page',
  'clicks',
  'impressions',
  'ctr',
  'position',
  'date_range',
  'country',
  'device',
  'route_family',
  'decision_status',
  'operator_note_no_pii',
];

writeText(files.projectMd, markdownReport(summary, requestRows, templateRows));
writeText(files.projectCsv, toCsv(requestRows, requestColumns));
writeText(files.reportJson, `${JSON.stringify({ summary, requestRows, queryFilters, pageFilters, decisionRows, templateRows }, null, 2)}\n`);
writeText(files.reportCsv, toCsv(requestRows, requestColumns));
writeText(files.queryTemplateCsv, toCsv(templateRows, templateColumns));

console.log(JSON.stringify({ ...summary, files }, null, 2));
