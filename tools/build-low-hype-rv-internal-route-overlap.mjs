import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const candidateRoutes = [
  {
    id: 'ROUTE-01',
    path: '/consumer-rights-israel/',
    role: 'consumer_rights_guide',
    rv_intent_fit: 'Primary existing surface for refund, cancellation, extra charge, deposit and supplier dispute angles.',
    route_decision: 'PRIMARY_EXISTING_SURFACE_FOR_OWNER_REVIEW',
    cannibalization_risk: 'MEDIUM',
    blocked_public_action: 'Do not add RV copy or CTA before GSC query evidence, legal review and owner approval.',
  },
  {
    id: 'ROUTE-02',
    path: '/rental-agreement/',
    role: 'rental_contract_guide',
    rv_intent_fit: 'Primary adjacent surface for rental terms, written agreement, inspection, liability and breach language.',
    route_decision: 'PRIMARY_ADJACENT_SURFACE_FOR_OWNER_REVIEW',
    cannibalization_risk: 'MEDIUM',
    blocked_public_action: 'Do not turn contract-document intent into a broad dispute page without SEO/legal review.',
  },
  {
    id: 'ROUTE-03',
    path: '/small-claims-court-israel/',
    role: 'small_claims_guide',
    rv_intent_fit: 'Secondary support surface for low-value deposit/charge disputes if the route is live.',
    route_decision: 'SECONDARY_SUPPORT_ONLY',
    cannibalization_risk: 'MEDIUM',
    blocked_public_action: 'Do not publish case/outcome advice or link until route status and legal framing are reviewed.',
  },
  {
    id: 'ROUTE-04',
    path: '/contract-law-israel/',
    role: 'contract_law_guide',
    rv_intent_fit: 'Secondary support surface for agreement interpretation and contract breach, not first public pilot.',
    route_decision: 'SECONDARY_SUPPORT_ONLY',
    cannibalization_risk: 'MEDIUM',
    blocked_public_action: 'Do not dilute contract-law page with travel/rental supplier copy without route review.',
  },
  {
    id: 'ROUTE-05',
    path: '/eviction-notice-israel/',
    role: 'rental_dispute_guide',
    rv_intent_fit: 'Adjacent rental-dispute surface, but eviction-specific and likely not a clean RV fit.',
    route_decision: 'ADJACENT_NOT_FIRST_PILOT',
    cannibalization_risk: 'HIGH',
    blocked_public_action: 'Do not attach RV rental copy to eviction intent.',
  },
  {
    id: 'ROUTE-06',
    path: '/real-estate-lawyer-guide/',
    role: 'real_estate_guide',
    rv_intent_fit: 'Broad legal context only. It should not own RV rental/deposit disputes.',
    route_decision: 'CONTEXT_ONLY',
    cannibalization_risk: 'HIGH',
    blocked_public_action: 'Do not use real-estate page as the RV landing surface.',
  },
  {
    id: 'ROUTE-07',
    path: '/insurance-national-insurance-lawyer/',
    role: 'insurance_national_insurance',
    rv_intent_fit: 'Possible insurance overlap if live, but RV insurance claims need separate legal/supplier coverage review.',
    route_decision: 'INSURANCE_PATH_BLOCKED_FOR_NOW',
    cannibalization_risk: 'HIGH',
    blocked_public_action: 'Do not combine insurance claim intent with rental/deposit disputes.',
  },
  {
    id: 'ROUTE-08',
    path: '/car-accident-lawyer/',
    role: 'car_accident_lawyer',
    rv_intent_fit: 'Accident/injury intent is mature and separate. It should not be the first Low Hype/RV pilot.',
    route_decision: 'ACCIDENT_PATH_BLOCKED_FOR_NOW',
    cannibalization_risk: 'HIGH',
    blocked_public_action: 'Do not publish RV accident copy without GSC evidence and injury/traffic legal review.',
  },
  {
    id: 'ROUTE-09',
    path: '/traffic-lawyer/',
    role: 'traffic_lawyer',
    rv_intent_fit: 'Traffic/fines intent is separate and should not absorb consumer rental disputes.',
    route_decision: 'TRAFFIC_PATH_BLOCKED_FOR_NOW',
    cannibalization_risk: 'HIGH',
    blocked_public_action: 'Do not publish RV fines/traffic copy from this packet.',
  },
  {
    id: 'ROUTE-10',
    path: '/lawyers/',
    role: 'lawyer_directory',
    rv_intent_fit: 'Conversion/matching surface only after an approved content or private intake path exists.',
    route_decision: 'CONVERSION_SURFACE_ONLY',
    cannibalization_risk: 'LOW',
    blocked_public_action: 'Do not add RV lawyer filtering or matching claims before supply/legal coverage is verified.',
  },
];

const rvMarkers = [
  'rv',
  'caravan',
  'camper',
  'campervan',
  '\u05e7\u05e8\u05d5\u05d5\u05d0\u05df',
  '\u05e7\u05e8\u05d0\u05d5\u05d5\u05df',
  '\u05e7\u05e8\u05d0\u05d5\u05d5\u05e0\u05d9\u05dd',
  '\u05e7\u05e8\u05d5\u05d5\u05d0\u05e0\u05d9\u05dd',
  '\u05e7\u05de\u05e4\u05e8',
];

function parseArgs() {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceSerp: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length);
    } else if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
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

  if (!args.sourceSerp) {
    args.sourceSerp = path.join(ROOT, '.reports', `low-hype-rv-serp-cannibalization-packet-${args.reportDate}.json`);
  } else if (!path.isAbsolute(args.sourceSerp)) {
    args.sourceSerp = path.join(ROOT, args.sourceSerp);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `low-hype-rv-internal-route-overlap-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
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

function absoluteUrl(baseUrl, routePath) {
  return new URL(routePath, baseUrl).toString();
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
  return normalizeWhitespace(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
  );
}

function extractTag(html, tagName) {
  const match = String(html || '').match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? stripTags(match[1]) : '';
}

function extractAllTags(html, tagName) {
  return [...String(html || '').matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi'))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function detectMarkers(text, markers) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  return markers
    .filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')))
    .filter((marker, index, list) => list.indexOf(marker) === index);
}

function snippet(text, length = 220) {
  const clean = normalizeWhitespace(text);
  return clean.length > length ? `${clean.slice(0, length - 1)}...` : clean;
}

async function fetchRoute(baseUrl, route) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const url = absoluteUrl(baseUrl, `${route.path}${route.path.includes('?') ? '&' : '?'}rv_route_overlap=${Date.now()}`);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'JusticeRouteOverlapAudit/1.0 (+private owner QA)',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    const html = await response.text();
    const text = stripTags(html);
    const h1s = extractAllTags(html, 'h1');
    const markerHits = detectMarkers(text, rvMarkers);

    return {
      ...route,
      status: response.ok ? 'VERIFIED_LIVE' : 'NOT_PUBLIC_OR_FETCH_BLOCKED',
      http_status: response.status,
      final_url: response.url,
      title: extractTag(html, 'title'),
      h1: h1s[0] || '',
      h1_count: h1s.length,
      h2_sample: extractAllTags(html, 'h2').slice(0, 4).join(' | '),
      exact_rv_marker_count: markerHits.length,
      exact_rv_marker_hits: markerHits.join(' | ') || '-',
      text_sample: snippet(text),
      approved_public_change: 0,
      next_action:
        response.ok
          ? 'Use this live evidence for owner/GSC/legal route decision only.'
          : 'Treat as absent/not-public until verified by route inventory before using it in any plan.',
    };
  } catch (error) {
    return {
      ...route,
      status: 'FETCH_ERROR',
      http_status: 0,
      final_url: absoluteUrl(baseUrl, route.path),
      title: '',
      h1: '',
      h1_count: 0,
      h2_sample: '',
      exact_rv_marker_count: 0,
      exact_rv_marker_hits: '-',
      text_sample: '',
      approved_public_change: 0,
      next_action: `Fetch failed: ${error.message}. Verify manually before any public planning.`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function summarize(reportDate, sourceSerp, rows) {
  const verifiedRows = rows.filter((row) => row.status === 'VERIFIED_LIVE');
  const primaryRows = rows.filter((row) => row.route_decision.startsWith('PRIMARY') && row.status === 'VERIFIED_LIVE');
  const exactRvRows = rows.filter((row) => Number(row.exact_rv_marker_count) > 0);
  const highRiskRows = rows.filter((row) => row.cannibalization_risk === 'HIGH');

  return {
    reportDate,
    status: primaryRows.length >= 2 ? 'INTERNAL_ROUTE_OVERLAP_READY_NO_PUBLIC_ACTION' : 'INTERNAL_ROUTE_OVERLAP_BLOCKED_MISSING_PRIMARY_SURFACE',
    sourceSerpStatus: sourceSerp.summary?.status || '',
    sourceSerpRecommendation: sourceSerp.summary?.recommendedFirstPilot || '',
    routesSampled: rows.length,
    verifiedLiveRoutes: verifiedRows.length,
    primaryVerifiedRoutes: primaryRows.length,
    exactRvMarkerRoutes: exactRvRows.length,
    highCannibalizationRows: highRiskRows.length,
    standaloneRvRouteApproved: 0,
    publicChangesApproved: 0,
    crmRecordsCreated: 0,
    leadOrSupplierContactActions: 0,
    emailSent: 0,
    upressDeploymentRequired: false,
    recommendedDecision:
      'No standalone RV route. If owner approves the pilot, start as a narrow owner-review path on consumer/rental surfaces only after GSC, internal route and legal review.',
  };
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownReport(summary, rows) {
  return [
    `# Low Hype / RV Internal Route Overlap - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private internal route inventory and anti-cannibalization gate only. This does not approve public copy, metadata, links, CRM records, outreach, payments, email or deployment.',
    '',
    '## Decision',
    '',
    summary.recommendedDecision,
    '',
    'The live route inventory supports the earlier SERP packet: RV should remain a private research cluster unless the owner approves a narrow rental/deposit/charge pilot. Accident, insurance and traffic paths stay blocked for now because they overlap stronger existing legal intents.',
    '',
    '## Summary',
    '',
    `- Source SERP packet: ${summary.sourceSerpStatus}`,
    `- Source recommendation: ${summary.sourceSerpRecommendation}`,
    `- Routes sampled: ${summary.routesSampled}`,
    `- Live verified routes: ${summary.verifiedLiveRoutes}`,
    `- Primary verified consumer/rental surfaces: ${summary.primaryVerifiedRoutes}`,
    `- Existing pages already mentioning RV/caravan/camper terms: ${summary.exactRvMarkerRoutes}`,
    `- High cannibalization rows: ${summary.highCannibalizationRows}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Route Rows',
    '',
    '| ID | Route | Status | Role | RV Intent Fit | Decision | Risk | Existing RV Markers | Blocked Public Action |',
    '| --- | --- | --- | --- | --- | --- | --- | ---: | --- |',
    ...rows.map((row) =>
      `| ${row.id} | [${row.path}](${row.final_url || row.path}) | ${row.status} (${row.http_status}) | ${mdCell(row.role)} | ${mdCell(row.rv_intent_fit)} | ${mdCell(row.route_decision)} | ${row.cannibalization_risk} | ${row.exact_rv_marker_count} | ${mdCell(row.blocked_public_action)} |`
    ),
    '',
    '## Next Evidence Required',
    '',
    '1. GSC query export for caravan/RV/campervan, rental, deposit, charge, cancellation and insurance modifiers.',
    '2. Owner/legal decision whether the first pilot is consumer contract, rental document review, insurance claim, traffic/accident or private-only intake.',
    '3. Exact public copy approval only if the chosen route remains legal-help-first and does not expose revenue logic.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-low-hype-rv-internal-route-overlap.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il]');
  process.exit(0);
}

const sourceSerp = readJson(args.sourceSerp);
const rows = await Promise.all(candidateRoutes.map((route) => fetchRoute(args.baseUrl, route)));
const summary = summarize(args.reportDate, sourceSerp, rows);
const files = outputFiles(args.reportDate);
const columns = [
  'id',
  'path',
  'role',
  'status',
  'http_status',
  'final_url',
  'title',
  'h1',
  'h1_count',
  'h2_sample',
  'rv_intent_fit',
  'route_decision',
  'cannibalization_risk',
  'exact_rv_marker_count',
  'exact_rv_marker_hits',
  'approved_public_change',
  'blocked_public_action',
  'next_action',
];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdownReport(summary, rows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify({ ...summary, files }, null, 2));
