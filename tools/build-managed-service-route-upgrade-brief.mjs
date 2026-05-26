import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const PUBLIC_COPY_FORBIDDEN_MARKERS = [
  'revenue',
  'ARR',
  'MRR',
  'business plan',
  'Lawhive',
  'Harvey',
  'pilot',
  'package economics',
  '\u05d4\u05db\u05e0\u05e1\u05d4',
  '\u05e8\u05d5\u05d5\u05d7',
  '\u05de\u05d5\u05d3\u05dc \u05e2\u05e1\u05e7\u05d9',
  '\u05ea\u05db\u05e0\u05d9\u05ea \u05e2\u05e1\u05e7\u05d9\u05ea',
];

const decisionRows = [
  {
    package_key: 'rental_agreement',
    package_label: 'Rental agreement review / draft',
    target_url_or_route: 'https://jus-tice.co.il/rental-agreement/',
    decision: 'PRIMARY_UPGRADE_CANDIDATE',
    cannibalization_risk: 'HIGH_EXISTING_ROUTE',
    public_user_intent: 'Reader wants to understand or safely handle a rental agreement before signing.',
    safe_title_direction_he: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d7\u05ea\u05d9\u05de\u05d4 | \u05de\u05d4 \u05d7\u05e9\u05d5\u05d1 \u05dc\u05d1\u05d3\u05d5\u05e7',
    safe_h1_direction_he: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea: \u05de\u05d4 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05dc\u05e4\u05e0\u05d9 \u05e9\u05d7\u05d5\u05ea\u05de\u05d9\u05dd',
    safe_cta_copy_he: '\u05e8\u05d5\u05e6\u05d9\u05dd \u05e9\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d9\u05d1\u05d3\u05d5\u05e7 \u05d0\u05ea \u05d7\u05d5\u05d6\u05d4 \u05d4\u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d4\u05d7\u05ea\u05d9\u05de\u05d4? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05d5\u05e0\u05d7\u05d1\u05e8 \u05d0\u05ea\u05db\u05dd \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05de\u05ea\u05d0\u05d9\u05dd.',
    associated_pages_to_review: '/rental-agreement-guide/; /landlord-obligations-israel/; /tenant-rights-israel/; /commercial-lease-israel/; /contract-law-israel/',
    public_action_after_owner_approval: 'Upgrade existing route with one lawyer-review CTA and internal links; do not create a competing /lease-agreement/ page first.',
    blocked_public_actions: 'No new public route, checkout, fixed-price claim, AI drafting promise, canonical/redirect/sitemap/taxonomy change, or lawyer handoff until owner/SEO/legal/payment gates approve.',
  },
  {
    package_key: 'rental_agreement',
    package_label: 'Rental agreement review / draft',
    target_url_or_route: 'https://jus-tice.co.il/rental-agreement-guide/',
    decision: 'SUPPORTING_ROUTE_CONTEXTUAL_CTA_ONLY',
    cannibalization_risk: 'MEDIUM_ASSOCIATED_ROUTE',
    public_user_intent: 'Reader wants clause-level guidance and warning signs inside a lease.',
    safe_title_direction_he: '\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea: \u05e1\u05e2\u05d9\u05e4\u05d9\u05dd \u05e9\u05d7\u05e9\u05d5\u05d1 \u05dc\u05d4\u05db\u05d9\u05e8',
    safe_h1_direction_he: '\u05d7\u05d5\u05d6\u05d4 \u05e9\u05db\u05d9\u05e8\u05d5\u05ea: \u05de\u05d4 \u05d7\u05d9\u05d9\u05d1 \u05dc\u05d4\u05d9\u05d5\u05ea \u05d5\u05de\u05ea\u05d9 \u05db\u05d3\u05d0\u05d9 \u05dc\u05d1\u05d3\u05d5\u05e7',
    safe_cta_copy_he: '\u05d9\u05e9 \u05e1\u05e2\u05d9\u05e3 \u05d1\u05d7\u05d5\u05d6\u05d4 \u05e9\u05dc\u05d0 \u05d1\u05e8\u05d5\u05e8 \u05dc\u05db\u05dd? \u05e0\u05d9\u05ea\u05df \u05dc\u05e4\u05e0\u05d5\u05ea \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05dc\u05d1\u05d3\u05d9\u05e7\u05d4 \u05de\u05de\u05d5\u05e7\u05d3\u05ea \u05dc\u05e4\u05e0\u05d9 \u05d4\u05d7\u05ea\u05d9\u05de\u05d4.',
    associated_pages_to_review: '/rental-agreement/; /contract-law-israel/; /landlord-rights-israel/',
    public_action_after_owner_approval: 'Use as supporting educational route; link upward to the primary rental-agreement route if approved.',
    blocked_public_actions: 'Do not turn this route into a separate paid product page or duplicate the primary H1.',
  },
  {
    package_key: 'rental_agreement',
    package_label: 'Rental agreement review / draft',
    target_url_or_route: 'https://jus-tice.co.il/landlord-obligations-israel/',
    decision: 'LANDLORD_SPECIFIC_CTA_CANDIDATE',
    cannibalization_risk: 'MEDIUM_ASSOCIATED_ROUTE',
    public_user_intent: 'Landlord wants to understand duties, maintenance, insurance and risk before or during a lease.',
    safe_title_direction_he: '\u05d7\u05d5\u05d1\u05d5\u05ea \u05de\u05e9\u05db\u05d9\u05e8 \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc | \u05d4\u05e1\u05db\u05dd \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05d5\u05d6\u05db\u05d5\u05d9\u05d5\u05ea',
    safe_h1_direction_he: '\u05d7\u05d5\u05d1\u05d5\u05ea \u05de\u05e9\u05db\u05d9\u05e8 \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc',
    safe_cta_copy_he: '\u05de\u05e9\u05db\u05d9\u05e8\u05d9\u05dd \u05d3\u05d9\u05e8\u05d4 \u05d5\u05e8\u05d5\u05e6\u05d9\u05dd \u05dc\u05e6\u05de\u05e6\u05dd \u05e1\u05d9\u05db\u05d5\u05df \u05d1\u05d7\u05d5\u05d6\u05d4? \u05e4\u05e0\u05d9\u05d9\u05d4 \u05e7\u05e6\u05e8\u05d4 \u05ea\u05e2\u05d6\u05d5\u05e8 \u05dc\u05e0\u05ea\u05d1 \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05de\u05ea\u05d0\u05d9\u05dd.',
    associated_pages_to_review: '/rental-agreement/; /landlord-rights-israel/; /eviction-notice-israel/',
    public_action_after_owner_approval: 'Add landlord-specific helper CTA only if it links back to the primary rental agreement path.',
    blocked_public_actions: 'No standalone landlord package page without GSC and owner approval.',
  },
  {
    package_key: 'demand_letter_review',
    package_label: 'Demand letter with lawyer review',
    target_url_or_route: 'NEW_GENERIC_DEMAND_LETTER_ROUTE',
    decision: 'DO_NOT_CREATE_GENERIC_PAGE',
    cannibalization_risk: 'HIGH_GENERIC_INTENT_COLLISION',
    public_user_intent: 'Generic demand-letter searches split into employment, consumer, rental, small claims and debt contexts.',
    safe_title_direction_he: '\u05dc\u05d0 \u05dc\u05d4\u05e9\u05ea\u05de\u05e9 \u05db\u05d3\u05e3 \u05e6\u05d9\u05d1\u05d5\u05e8\u05d9',
    safe_h1_direction_he: '\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05dd \u05e2\u05de\u05d5\u05d3 \u05d2\u05e0\u05e8\u05d9',
    safe_cta_copy_he: '\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05d5\u05dd. \u05d0\u05dd \u05d4\u05db\u05d9\u05d5\u05d5\u05df \u05d9\u05d0\u05d5\u05e9\u05e8 \u05d1\u05d4\u05de\u05e9\u05da, \u05d9\u05e9 \u05dc\u05e4\u05e6\u05dc \u05dc\u05e4\u05d9 \u05e1\u05d5\u05d2 \u05e1\u05db\u05e1\u05d5\u05da.',
    associated_pages_to_review: '/labor-lawyer/; /consumer-rights-israel/; /small-claims-court-israel/; /eviction-notice-israel/; /wrongful-termination-israel/',
    public_action_after_owner_approval: 'Create no generic route. If approved, place narrow CTAs only on existing dispute-specific pages.',
    blocked_public_actions: 'No /demand-letter/ page, no broad SEO title, no one-size-fits-all legal letter promise.',
  },
  {
    package_key: 'demand_letter_review',
    package_label: 'Demand letter with lawyer review',
    target_url_or_route: 'https://jus-tice.co.il/labor-lawyer/',
    decision: 'EMPLOYMENT_SPECIFIC_UPGRADE_CANDIDATE',
    cannibalization_risk: 'HIGH_EXISTING_ROUTE',
    public_user_intent: 'Worker or employer needs help before an employment warning, hearing, termination or payment dispute.',
    safe_title_direction_he: '\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d3\u05d9\u05e0\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4 | \u05d9\u05d9\u05e2\u05d5\u05e5 \u05d5\u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4',
    safe_h1_direction_he: '\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d3\u05d9\u05e0\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4',
    safe_cta_copy_he: '\u05e6\u05e8\u05d9\u05db\u05d9\u05dd \u05dc\u05d4\u05d2\u05d9\u05d1 \u05dc\u05de\u05db\u05ea\u05d1 \u05d0\u05d5 \u05dc\u05e9\u05e7\u05d5\u05dc \u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05d1\u05e2\u05e0\u05d9\u05d9\u05df \u05e2\u05d1\u05d5\u05d3\u05d4? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05d5\u05e0\u05e4\u05e0\u05d4 \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05de\u05ea\u05d0\u05d9\u05dd.',
    associated_pages_to_review: '/wrongful-termination-israel/; /employment-contract-termination/; /severance-pay-calculator/',
    public_action_after_owner_approval: 'Use only as employment-specific managed review CTA; keep broader labor-law page intent intact.',
    blocked_public_actions: 'No broad demand-letter language above the fold and no fixed outcome promise.',
  },
  {
    package_key: 'demand_letter_review',
    package_label: 'Demand letter with lawyer review',
    target_url_or_route: 'https://jus-tice.co.il/consumer-rights-israel/',
    decision: 'CONSUMER_SPECIFIC_CTA_CANDIDATE',
    cannibalization_risk: 'MEDIUM_ASSOCIATED_ROUTE',
    public_user_intent: 'Consumer wants help with cancellation, refund, defective product or small claim preparation.',
    safe_title_direction_he: '\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e6\u05e8\u05db\u05df \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc | \u05d1\u05d9\u05d8\u05d5\u05dc, \u05d4\u05d7\u05d6\u05e8 \u05d5\u05ea\u05d1\u05d9\u05e2\u05d4',
    safe_h1_direction_he: '\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05e6\u05e8\u05db\u05df \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc',
    safe_cta_copy_he: '\u05d4\u05e1\u05e4\u05e7 \u05de\u05e1\u05e8\u05d1 \u05dc\u05d4\u05d7\u05d6\u05e8 \u05d0\u05d5 \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc? \u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df \u05d9\u05db\u05d5\u05dc \u05dc\u05d1\u05d3\u05d5\u05e7 \u05d0\u05dd \u05db\u05d3\u05d0\u05d9 \u05dc\u05e9\u05dc\u05d5\u05d7 \u05de\u05db\u05ea\u05d1 \u05e4\u05e0\u05d9\u05d9\u05d4 \u05d0\u05d5 \u05de\u05db\u05ea\u05d1 \u05d4\u05ea\u05e8\u05d0\u05d4.',
    associated_pages_to_review: '/small-claims-court-israel/; /consumer-lawyer/; /rent-dispute-letter/',
    public_action_after_owner_approval: 'Add consumer-only helper CTA after legal explanation; avoid generic legal-letter route.',
    blocked_public_actions: 'No fixed-price public checkout until lawyer engagement and payment/refund gates are ready.',
  },
  {
    package_key: 'demand_letter_review',
    package_label: 'Demand letter with lawyer review',
    target_url_or_route: 'https://jus-tice.co.il/eviction-notice-israel/',
    decision: 'RENTAL_DISPUTE_SPECIFIC_CTA_CANDIDATE',
    cannibalization_risk: 'MEDIUM_ASSOCIATED_ROUTE',
    public_user_intent: 'Tenant or landlord is dealing with eviction notice, unpaid rent or rental dispute.',
    safe_title_direction_he: '\u05e4\u05d9\u05e0\u05d5\u05d9 \u05e9\u05d5\u05db\u05e8 | \u05d4\u05dc\u05d9\u05da, \u05de\u05db\u05ea\u05d1 \u05d5\u05d6\u05db\u05d5\u05d9\u05d5\u05ea',
    safe_h1_direction_he: '\u05e4\u05d9\u05e0\u05d5\u05d9 \u05e9\u05d5\u05db\u05e8',
    safe_cta_copy_he: '\u05de\u05d3\u05d5\u05d1\u05e8 \u05d1\u05e1\u05db\u05e1\u05d5\u05da \u05e9\u05db\u05d9\u05e8\u05d5\u05ea \u05d0\u05d5 \u05d1\u05de\u05db\u05ea\u05d1 \u05e4\u05d9\u05e0\u05d5\u05d9? \u05d4\u05e9\u05d0\u05d9\u05e8\u05d5 \u05e4\u05e8\u05d8\u05d9\u05dd \u05dc\u05d1\u05d3\u05d9\u05e7\u05ea \u05d4\u05ea\u05d0\u05de\u05d4 \u05dc\u05e2\u05d5\u05e8\u05da \u05d3\u05d9\u05df.',
    associated_pages_to_review: '/tenant-eviction-defense/; /landlord-rights-israel/; /rental-agreement-guide/',
    public_action_after_owner_approval: 'Use as rental-dispute CTA only; keep rental agreement drafting CTA separate.',
    blocked_public_actions: 'Do not mix eviction demand-letter copy with general lease drafting copy.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    inventoryDate: process.env.INVENTORY_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--inventoryDate=')) {
      args.inventoryDate = arg.slice('--inventoryDate='.length);
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
  const base = `managed-service-route-upgrade-brief-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function inventoryPath(inventoryDate) {
  return path.join(ROOT, '.reports', `managed-service-public-cannibalization-inventory-${inventoryDate}.json`);
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

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required inventory JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function riskRank(row) {
  if (String(row.cannibalization_risk || '').startsWith('HIGH')) {
    return 3;
  }
  if (String(row.cannibalization_risk || '').startsWith('MEDIUM')) {
    return 2;
  }
  return 1;
}

function summarizeInventory(inventory) {
  const packageMap = new Map();
  for (const row of inventory.rows || []) {
    const key = row.package_key || 'unknown';
    if (!packageMap.has(key)) {
      packageMap.set(key, {
        package_key: key,
        package_label: row.package_label || key,
        total_rows: 0,
        exact_live_routes: 0,
        high_review_rows: 0,
        medium_review_rows: 0,
        low_context_rows: 0,
        strongest_risk: 'LOW',
        review_urls: new Set(),
      });
    }
    const item = packageMap.get(key);
    item.total_rows += 1;
    const risk = String(row.cannibalization_risk || '');
    if (risk.startsWith('HIGH')) {
      item.high_review_rows += 1;
      item.strongest_risk = 'HIGH';
    } else if (risk.startsWith('MEDIUM')) {
      item.medium_review_rows += 1;
      if (item.strongest_risk !== 'HIGH') {
        item.strongest_risk = 'MEDIUM';
      }
    } else {
      item.low_context_rows += 1;
    }
    if (row.source === 'exact_path_probe' && Number(row.status_code) === 200) {
      item.exact_live_routes += 1;
    }
    if (riskRank(row) >= 2 && row.url) {
      item.review_urls.add(row.url);
    }
  }

  return Array.from(packageMap.values()).map((item) => ({
    ...item,
    review_urls: Array.from(item.review_urls).slice(0, 18).join('; '),
  }));
}

function findPublicCopyMarkerHits(rows) {
  const hits = [];
  for (const row of rows) {
    const text = [
      row.safe_title_direction_he,
      row.safe_h1_direction_he,
      row.safe_cta_copy_he,
      row.public_user_intent,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    for (const marker of PUBLIC_COPY_FORBIDDEN_MARKERS) {
      if (text.includes(marker.toLowerCase())) {
        hits.push({
          package_key: row.package_key,
          target_url_or_route: row.target_url_or_route,
          marker,
        });
      }
    }
  }
  return hits;
}

function buildMarkdown({ reportDate, inventoryDate, inventory, packageSummaries, markerHits, status }) {
  const summary = inventory.summary || {};
  const copySnippetCount = decisionRows.filter((row) => row.safe_cta_copy_he && !row.safe_cta_copy_he.includes('\u05dc\u05d0 \u05dc\u05e4\u05e8\u05e1\u05d5\u05dd')).length;
  const primaryUpgradeCount = decisionRows.filter((row) => row.decision.includes('UPGRADE') || row.decision.includes('PRIMARY')).length;
  const blockedRouteCount = decisionRows.filter((row) => row.decision.includes('DO_NOT_CREATE')).length;

  const lines = [
    `# Managed-Service Route Upgrade Brief - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Source inventory date: ${inventoryDate}`,
    '',
    'Scope: owner/SEO route-upgrade brief for the first two managed-service pilots. This is not approval to publish a page, change CMS content, add internal links, alter title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Source inventory rows: ${summary.totalRows ?? 'unknown'}`,
    `- Exact/live route probes requiring review: ${summary.exactLive ?? 'unknown'}`,
    `- High-signal REST title/path matches requiring review: ${summary.relatedHits ?? 'unknown'}`,
    `- Low-signal context rows kept in source CSV: ${summary.lowSearchContextRows ?? 'unknown'}`,
    `- Route decisions in this brief: ${decisionRows.length}`,
    `- Public-safe CTA snippets for owner review: ${copySnippetCount}`,
    `- Primary/existing-route upgrade candidates: ${primaryUpgradeCount}`,
    `- Generic new public routes explicitly blocked: ${blockedRouteCount}`,
    `- Forbidden internal/business-plan marker hits inside public copy snippets: ${markerHits.length}`,
    '- Public changes approved by this packet: 0',
    '',
    '## Package Evidence Summary',
    '',
    '| Package | Total Rows | Exact Live Routes | High Rows | Medium Rows | Strongest Risk | Review URLs |',
    '| --- | ---: | ---: | ---: | ---: | --- | --- |',
    ...packageSummaries.map(
      (row) =>
        `| ${row.package_label} | ${row.total_rows} | ${row.exact_live_routes} | ${row.high_review_rows} | ${row.medium_review_rows} | ${row.strongest_risk} | ${row.review_urls || '-'} |`,
    ),
    '',
    '## Route Upgrade Decisions',
    '',
    '| Package | Target | Decision | Risk | User Intent | Safe H1 Direction | Safe CTA Copy | Associated Pages |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...decisionRows.map(
      (row) =>
        `| ${row.package_label} | ${row.target_url_or_route} | ${row.decision} | ${row.cannibalization_risk} | ${row.public_user_intent} | ${row.safe_h1_direction_he} | ${row.safe_cta_copy_he} | ${row.associated_pages_to_review} |`,
    ),
    '',
    '## Public Copy Rules',
    '',
    '1. Titles and H1s must describe the user legal problem, not why the page is profitable or valuable to Jus-Tice.',
    '2. Public CTAs may offer routing to a suitable lawyer, but may not promise a fixed outcome, instant legal result, unattended AI drafting or that Jus-Tice is acting as a law firm.',
    '3. Rental agreement work should first upgrade or support existing rental routes; do not create a competing lease/rental route from this packet.',
    '4. Demand-letter work should stay dispute-specific. Do not create a generic demand-letter page before employment, consumer and rental dispute intent is separately approved.',
    '5. Any fixed price, checkout wording, refund/cancel path or paid service language still requires the lawyer-of-record, engagement, ethics and payment gates from the private managed-service packet.',
    '',
    '## Owner / SEO Review Needed',
    '',
    '1. Choose whether the rental agreement pilot upgrades `/rental-agreement/`, uses only a narrow CTA there, or remains private-only.',
    '2. Choose whether demand-letter review is tested first under employment, consumer or rental dispute intent.',
    '3. Approve exact URL/title/H1/meta/CTA/internal-link text before any CMS action.',
    '4. Confirm legal/Bar engagement structure and payment/refund handling before public checkout or price language.',
    '',
    '## Safety Statement',
    '',
    'This brief is a private planning artifact. It is useful for owner review and remote-team coordination, but it does not authorize publishing, linking, selling, routing, charging, contacting or changing SEO controls.',
  ];

  if (markerHits.length > 0) {
    lines.push('', '## Forbidden Marker Hits', '');
    for (const hit of markerHits) {
      lines.push(`- ${hit.package_key} / ${hit.target_url_or_route}: ${hit.marker}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-managed-service-route-upgrade-brief.mjs --reportDate=YYYY-MM-DD --inventoryDate=YYYY-MM-DD');
    return;
  }

  const inventoryFile = inventoryPath(args.inventoryDate);
  const inventory = readJson(inventoryFile);
  const packageSummaries = summarizeInventory(inventory);
  const markerHits = findPublicCopyMarkerHits(decisionRows);
  const status = markerHits.length > 0 ? 'BLOCKED_PUBLIC_COPY_MARKER_HIT' : 'PUBLIC_UPGRADE_BRIEF_READY_NOT_APPROVED';
  const outputs = outputFiles(args.reportDate);

  const decisionColumns = [
    'package_key',
    'package_label',
    'target_url_or_route',
    'decision',
    'cannibalization_risk',
    'public_user_intent',
    'safe_title_direction_he',
    'safe_h1_direction_he',
    'safe_cta_copy_he',
    'associated_pages_to_review',
    'public_action_after_owner_approval',
    'blocked_public_actions',
  ];

  const report = {
    reportDate: args.reportDate,
    sourceInventoryDate: args.inventoryDate,
    sourceInventoryPath: inventoryFile,
    status,
    summary: {
      sourceInventoryStatus: inventory.summary?.status || null,
      sourceRows: inventory.summary?.totalRows || 0,
      exactLiveRoutes: inventory.summary?.exactLive || 0,
      highSignalMatches: inventory.summary?.relatedHits || 0,
      lowContextRows: inventory.summary?.lowSearchContextRows || 0,
      decisionRows: decisionRows.length,
      primaryUpgradeCandidates: decisionRows.filter((row) => row.decision.includes('UPGRADE') || row.decision.includes('PRIMARY')).length,
      blockedGenericRoutes: decisionRows.filter((row) => row.decision.includes('DO_NOT_CREATE')).length,
      publicCopyForbiddenMarkerHits: markerHits.length,
      publicChangesApproved: 0,
    },
    packageSummaries,
    routeUpgradeDecisions: decisionRows,
    publicCopyForbiddenMarkerHits: markerHits,
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

  writeText(outputs.projectMd, buildMarkdown({ reportDate: args.reportDate, inventoryDate: args.inventoryDate, inventory, packageSummaries, markerHits, status }));
  writeText(outputs.projectCsv, toCsv(decisionRows, decisionColumns));
  writeText(outputs.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(outputs.reportCsv, toCsv(decisionRows, decisionColumns));

  console.log(
    JSON.stringify(
      {
        status,
        sourceRows: report.summary.sourceRows,
        routeDecisions: decisionRows.length,
        primaryUpgradeCandidates: report.summary.primaryUpgradeCandidates,
        blockedGenericRoutes: report.summary.blockedGenericRoutes,
        publicCopyForbiddenMarkerHits: markerHits.length,
        publicChangesApproved: 0,
      },
      null,
      2,
    ),
  );
}

main();
