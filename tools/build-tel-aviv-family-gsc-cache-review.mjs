import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;
const TARGET_PATH = '/divorce-lawyer-tel-aviv/';
const PILLAR_PATH = '/divorce-lawyer/';

const QUERY_CLUSTERS = [
  {
    id: 'exact_local_divorce_lawyer',
    queryFilter: 'גירוש* + תל אביב + עורך דין/עו"ד',
    preferredOwner: TARGET_PATH,
    reason: 'Tests whether a dedicated Tel Aviv divorce-lawyer page has visible local demand.',
    decisionIfWeak: 'Keep the Tel Aviv route private and do not publish from cache-only evidence.',
  },
  {
    id: 'broad_divorce_lawyer',
    queryFilter: 'גירוש* + עורך דין/עו"ד without city modifier',
    preferredOwner: PILLAR_PATH,
    reason: 'Protects the broad divorce-lawyer intent from being absorbed by the local page.',
    decisionIfWeak: 'Keep broad choice, price and experience guidance on the pillar.',
  },
  {
    id: 'documents_and_procedure',
    queryFilter: 'גירוש* + תעודה/טופס/בקשה/הליך/תיק/גט/מסמך',
    preferredOwner: 'existing document/procedure pages',
    reason: 'Separates document and procedural intent from local lawyer-fit copy.',
    decisionIfWeak: 'Use only cautious checklist wording after legal/editor review.',
  },
  {
    id: 'settlement_mediation_agreement',
    queryFilter: 'הסכם גירושין / גישור גירושין / גירושין בהסכמה',
    preferredOwner: 'existing settlement, template and mediation pages',
    reason: 'Prevents the Tel Aviv page from becoming an agreement or mediation guide.',
    decisionIfWeak: 'Preserve settlement, template and mediation articles as separate route owners.',
  },
  {
    id: 'cost_consultation_price',
    queryFilter: 'גירוש* + מחיר/עלות/כמה עולה/מחירון',
    preferredOwner: 'existing cost article and divorce pillar',
    reason: 'Blocks unsupported price claims in the local page.',
    decisionIfWeak: 'No price, fee or consultation claim without owner/legal approval.',
  },
  {
    id: 'urgent_local_help',
    queryFilter: 'גירוש* + דחוף/דיון/תביעה/צו/בית דין',
    preferredOwner: 'legal/editor-reviewed help path only',
    reason: 'Checks whether urgent wording is supported before any CTA or response-time claim.',
    decisionIfWeak: 'No emergency, SLA, response-time or outcome claim.',
  },
];

const FOCUSED_EXPORT_PAGES = [
  TARGET_PATH,
  PILLAR_PATH,
  '/family-law/',
  '/lawyers/?city=tel-aviv&area=family-law',
  '/child-custody/',
  '/child-support-calculator-2023/',
  '/divorce-mediation/',
  '/what-is-a-divorce-settlement-agreement/',
  '/free-divorce-agreement-template/',
  '/how-much-does-a-divorce-agreement-cost/',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || DEFAULT_SOURCE_DATE,
    gscDir: path.join(ROOT, '.reports', 'gsc'),
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg.startsWith('--gscDir=')) {
      const value = arg.slice('--gscDir='.length);
      args.gscDir = path.isAbsolute(value) ? value : path.join(ROOT, value);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries({ reportDate: args.reportDate, sourceDate: args.sourceDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `tel-aviv-family-gsc-cache-review-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    focusedExportTemplateCsv: path.join(ROOT, '.project-control', `tel-aviv-family-focused-gsc-export-template-${reportDate}.csv`),
  };
}

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source report: ${relativePath}`);
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

function readOptionalJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    return null;
  }
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

function readCsvFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required GSC cache file: ${filePath}`);
  }
  return parseCsv(readFileSync(filePath, 'utf8'));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length || row.length) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  const [header = [], ...records] = rows;
  return records.map((record) => Object.fromEntries(header.map((name, index) => [name, record[index] || ''])));
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

function numberValue(value) {
  const numeric = Number(String(value || '').replace('%', '').replace(/,/g, '').trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function hasLawyerTerm(text) {
  return hasAny(text, ['עורך דין', 'עורכי דין', 'עו"ד', 'עוד ']);
}

function hasDivorceTerm(text) {
  return hasAny(text, ['גירוש', 'גט']);
}

function hasTelAvivTerm(text) {
  return hasAny(text, ['תל אביב', 'תל-אביב', 'בתל אביב']);
}

function matchesCluster(query, clusterId) {
  const text = String(query || '').replace(/^'|'$/g, '').trim();

  if (clusterId === 'exact_local_divorce_lawyer') {
    return hasDivorceTerm(text) && hasTelAvivTerm(text) && hasLawyerTerm(text);
  }

  if (clusterId === 'broad_divorce_lawyer') {
    return hasDivorceTerm(text) && hasLawyerTerm(text) && !hasTelAvivTerm(text);
  }

  if (clusterId === 'documents_and_procedure') {
    return hasDivorceTerm(text) && hasAny(text, ['תעודה', 'טופס', 'בקשה', 'הליך', 'הליכי', 'תיק', 'מסמך', 'להורדה', 'גט']);
  }

  if (clusterId === 'settlement_mediation_agreement') {
    return hasAny(text, ['הסכם גירוש', 'גישור גירוש', 'גירושין בהסכמה', 'הסדר גירוש']);
  }

  if (clusterId === 'cost_consultation_price') {
    return hasDivorceTerm(text) && hasAny(text, ['מחיר', 'עלות', 'כמה עולה', 'מחירון']);
  }

  if (clusterId === 'urgent_local_help') {
    return hasDivorceTerm(text) && hasAny(text, ['דחוף', 'בהול', 'דיון', 'תביעה', 'צו', 'בית דין', 'בית המשפט']);
  }

  return false;
}

function displayPage(value) {
  const text = String(value || '');
  try {
    const url = new URL(text);
    return decodeURIComponent(`${url.pathname}${url.search || ''}`) || '/';
  } catch {
    try {
      return decodeURIComponent(text);
    } catch {
      return text;
    }
  }
}

function normalizeRoutePath(value) {
  const displayed = displayPage(value).split('?')[0];
  const trimmed = displayed.replace(/^\/+|\/+$/g, '').toLowerCase();
  return trimmed ? `/${trimmed}/` : '/';
}

function buildRouteRoleMap(overlapReview) {
  const map = new Map();
  for (const row of overlapReview.overlapRows || []) {
    map.set(normalizeRoutePath(row.path), row.role);
  }
  return map;
}

function classifyRouteFamily(page, routeRoleMap) {
  const normalized = normalizeRoutePath(page);
  if (routeRoleMap.has(normalized)) {
    return routeRoleMap.get(normalized);
  }
  const displayed = displayPage(page);
  if (displayed.includes('/wp-content/uploads/')) return 'attachment_or_pdf';
  if (displayed.includes('/עורכי-דין/')) return 'lawyer_profile';
  if (displayed.includes('/articles/')) return 'legacy_article';
  if (displayed.includes('/psakdin/')) return 'case_law_page';
  if (displayed.includes('/קטגוריות-מאמרים/')) return 'category_archive';
  return 'other_existing_page';
}

function buildMatchedRows(queryPageRows, routeRoleMap) {
  const matchedRows = [];
  for (const row of queryPageRows) {
    for (const cluster of QUERY_CLUSTERS) {
      if (!matchesCluster(row.query, cluster.id)) continue;
      const clicks = numberValue(row.clicks);
      const impressions = numberValue(row.impressions);
      matchedRows.push({
        cluster_id: cluster.id,
        query: String(row.query || '').replace(/^'|'$/g, ''),
        page: row.page,
        page_display: displayPage(row.page),
        route_family: classifyRouteFamily(row.page, routeRoleMap),
        clicks,
        impressions,
        ctr: row.ctr || '',
        position: numberValue(row.position),
        current_or_cache_signal: classifyCacheSignal(row.page, cluster.id),
        public_action_approved: 'no',
      });
    }
  }
  return matchedRows.sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

function classifyCacheSignal(page, clusterId) {
  const normalized = normalizeRoutePath(page);
  if (normalized === normalizeRoutePath(TARGET_PATH)) return 'target_route_signal';
  if (normalized === normalizeRoutePath(PILLAR_PATH)) return 'current_pillar_signal';
  if (clusterId === 'exact_local_divorce_lawyer') return 'local_query_cache_signal';
  if (normalized.includes('how-much-does-a-divorce-agreement-cost')) return 'protect_cost_route';
  if (normalized.includes('free-divorce-agreement-template')) return 'protect_template_or_attachment_route';
  if (displayPage(page).includes('/wp-content/uploads/')) return 'protect_attachment_or_legacy_asset';
  return 'existing_page_or_legacy_signal';
}

function aggregateClusterRows(matchedRows) {
  return QUERY_CLUSTERS.map((cluster) => {
    const rows = matchedRows.filter((row) => row.cluster_id === cluster.id);
    const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
    const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
    const weightedPosition =
      impressions > 0 ? rows.reduce((sum, row) => sum + row.position * row.impressions, 0) / impressions : 0;
    const pages = aggregatePages(rows);
    const topPages = pages
      .slice(0, 4)
      .map((row) => `${row.page_display} (${row.impressions} imp, ${row.clicks} clicks)`)
      .join(' | ');
    const associatedRouteRows = rows.filter((row) => !['other_existing_page', 'legacy_article', 'attachment_or_pdf', 'lawyer_profile', 'case_law_page', 'category_archive'].includes(row.route_family));
    const decision = clusterDecision(cluster.id, rows, associatedRouteRows);

    return {
      cluster_id: cluster.id,
      query_filter: cluster.queryFilter,
      preferred_owner: cluster.preferredOwner,
      cache_rows: rows.length,
      clicks,
      impressions,
      cache_ctr: impressions > 0 ? `${((clicks / impressions) * 100).toFixed(2)}%` : '0.00%',
      weighted_position: weightedPosition ? weightedPosition.toFixed(1) : '',
      associated_route_rows: associatedRouteRows.length,
      top_pages: topPages || 'none in local cache',
      cache_interpretation: decision.interpretation,
      next_action: decision.nextAction,
      status: decision.status,
      public_action_approved: 'no',
    };
  });
}

function aggregatePages(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.page_display;
    const current = map.get(key) || {
      page_display: key,
      clicks: 0,
      impressions: 0,
      route_family: row.route_family,
    };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    map.set(key, current);
  }
  return [...map.values()].sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

function clusterDecision(clusterId, rows, associatedRouteRows) {
  if (clusterId === 'exact_local_divorce_lawyer' && rows.length === 0) {
    return {
      status: 'FOCUSED_EXPORT_REQUIRED',
      interpretation: 'Local cache has no exact Tel Aviv divorce-lawyer query/page rows.',
      nextAction: 'Run focused GSC export before any publication or internal-link approval.',
    };
  }

  if (clusterId === 'broad_divorce_lawyer') {
    const currentPillarRows = rows.filter((row) => normalizeRoutePath(row.page) === normalizeRoutePath(PILLAR_PATH)).length;
    return {
      status: currentPillarRows ? 'CACHE_SIGNAL_PRESENT' : 'CURRENT_PILLAR_EXPORT_REQUIRED',
      interpretation: currentPillarRows
        ? 'Broad divorce-lawyer cache includes the current pillar.'
        : 'Broad divorce-lawyer cache points to legacy/profile pages, not enough to approve the current pillar/local split.',
      nextAction: 'Focused export must compare current /divorce-lawyer/ against legacy/profile URLs.',
    };
  }

  if (rows.length > 0 && associatedRouteRows.length > 0) {
    return {
      status: 'PROTECT_EXISTING_ROUTE_INTENT',
      interpretation: 'Cache has demand on one or more associated existing routes.',
      nextAction: 'Preserve the existing route owner; local page may only reference after legal/editor approval.',
    };
  }

  if (rows.length > 0) {
    return {
      status: 'CACHE_SIGNAL_LEGACY_OR_OTHER_PAGE',
      interpretation: 'Cache has demand, but mostly on legacy, attachment, profile or other pages.',
      nextAction: 'Use focused export to decide whether to consolidate, preserve or ignore before public copy.',
    };
  }

  return {
    status: 'NO_CACHE_ROWS',
    interpretation: 'No matching rows in the current local cache.',
    nextAction: 'Treat as unproven until focused GSC export or owner evidence is supplied.',
  };
}

function buildGates({ draftReport, overlapReview, clusterRows, queryPageRows, gscDecisionMap }) {
  const exactLocal = clusterRows.find((row) => row.cluster_id === 'exact_local_divorce_lawyer');
  const broad = clusterRows.find((row) => row.cluster_id === 'broad_divorce_lawyer');
  return [
    {
      id: 'TFG-GATE-01',
      gate: 'source_packets_available',
      status:
        draftReport.status === 'TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE' &&
        overlapReview.status === 'TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE'
          ? 'PASS'
          : 'REVIEW',
      evidence: `Draft packet: ${draftReport.status}; overlap review: ${overlapReview.status}.`,
      next_action: 'Use this review as the preliminary GSC cache layer only.',
    },
    {
      id: 'TFG-GATE-02',
      gate: 'local_gsc_cache_available',
      status: queryPageRows.length > 0 ? 'PASS' : 'BLOCKED',
      evidence: `${queryPageRows.length} query-page cache row(s) available under .reports/gsc.`,
      next_action: 'Keep cache as preliminary because focused export timing/finality is not guaranteed.',
    },
    {
      id: 'TFG-GATE-03',
      gate: 'exact_local_query_evidence',
      status: Number(exactLocal?.cache_rows || 0) > 0 ? 'PASS' : 'REVIEW',
      evidence: `${exactLocal?.cache_rows || 0} exact local Tel Aviv divorce-lawyer cache row(s).`,
      next_action: 'Fill focused Search Console export rows before publication approval.',
    },
    {
      id: 'TFG-GATE-04',
      gate: 'broad_divorce_pillar_evidence',
      status: broad?.status === 'CACHE_SIGNAL_PRESENT' ? 'PASS' : 'REVIEW',
      evidence: `${broad?.cache_rows || 0} broad divorce-lawyer row(s); status ${broad?.status || 'missing'}.`,
      next_action: 'Compare current pillar with legacy/profile URLs in focused export.',
    },
    {
      id: 'TFG-GATE-05',
      gate: 'prior_family_gsc_finality',
      status: gscDecisionMap?.finality?.includes('NOT_FINAL') ? 'REVIEW' : 'PASS',
      evidence: gscDecisionMap?.finality || 'No prior family GSC finality report was found.',
      next_action: 'Do not use this cache review as final migration, canonical, noindex, sitemap or publication evidence.',
    },
    {
      id: 'TFG-GATE-06',
      gate: 'gsc_api_not_called',
      status: 'PASS',
      evidence: 'This tool reads local CSV cache files only and does not open OAuth or call the GSC API.',
      next_action: 'Owner/operator can manually export or run an approved GSC workflow later.',
    },
    {
      id: 'TFG-GATE-07',
      gate: 'no_public_or_live_action_authorized',
      status:
        draftReport.publicChangesApproved === 0 &&
        overlapReview.publicChangesApproved === 0 &&
        overlapReview.cmsWritesApproved === 0 &&
        overlapReview.seoSettingsChanged === 0 &&
        overlapReview.redirectsOrCanonicalsChanged === 0 &&
        overlapReview.emailsSent === 0 &&
        overlapReview.upressDeploymentRequired === false
          ? 'PASS'
          : 'BLOCKED',
      evidence: 'Source packets and this review authorize 0 public/CMS/SEO/contact/payment/email/uPress actions.',
      next_action: 'Keep the Tel Aviv local page private until owner/legal/editor/publication gates are filled.',
    },
  ];
}

function buildFocusedExportTemplate() {
  return QUERY_CLUSTERS.flatMap((cluster) =>
    FOCUSED_EXPORT_PAGES.map((page) => ({
      query_cluster: cluster.id,
      query_filter: cluster.queryFilter,
      page_filter: page,
      export_dimensions: 'Query + Page',
      date_range: 'last_16_months_and_last_90_days',
      country: 'Israel if available',
      device: 'all',
      clicks: '',
      impressions: '',
      ctr: '',
      position: '',
      existing_route_owner: cluster.preferredOwner,
      preliminary_cache_status: '',
      reviewer_decision: 'not_filled',
      notes_no_pii: '',
    }))
  );
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildMarkdown({ reportDate, sourceDate, status, summary, gates, clusterRows, matchedRows }) {
  const previewRows = matchedRows.slice(0, 25);
  return [
    `# Tel Aviv Family GSC Cache Review - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Source date: ${sourceDate}`,
    '',
    'Scope: private Search Console cache review for `/divorce-lawyer-tel-aviv/`. This reads local `.reports/gsc` CSV files only. It does not call the GSC API, open OAuth, publish content, edit WordPress, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.',
    '',
    '## Summary',
    '',
    `- Local query-page cache rows read: ${summary.queryPageCacheRows}`,
    `- Matching family/divorce cache rows: ${summary.matchedCacheRows}`,
    `- Exact local Tel Aviv divorce-lawyer rows in cache: ${summary.exactLocalCacheRows}`,
    `- Broad divorce-lawyer rows in cache: ${summary.broadDivorceLawyerRows}`,
    `- Focused export template rows: ${summary.focusedExportTemplateRows}`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gates.map((gate) => `| ${gate.id} | ${mdCell(gate.gate)} | ${gate.status} | ${mdCell(gate.evidence)} | ${mdCell(gate.next_action)} |`),
    '',
    '## Cluster Findings',
    '',
    '| Cluster | Cache Rows | Impressions | Clicks | Status | Top Pages | Next Action |',
    '| --- | ---: | ---: | ---: | --- | --- | --- |',
    ...clusterRows.map(
      (row) =>
        `| ${row.cluster_id} | ${row.cache_rows} | ${row.impressions} | ${row.clicks} | ${row.status} | ${mdCell(row.top_pages)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Cache Row Preview',
    '',
    '| Cluster | Query | Page | Impressions | Clicks | Position | Route Family |',
    '| --- | --- | --- | ---: | ---: | ---: | --- |',
    ...previewRows.map(
      (row) =>
        `| ${row.cluster_id} | ${mdCell(row.query)} | ${mdCell(row.page_display)} | ${row.impressions} | ${row.clicks} | ${row.position} | ${row.route_family} |`,
    ),
    '',
    '## Editor Meaning',
    '',
    'The local cache does not prove enough exact Tel Aviv divorce-lawyer demand to publish `/divorce-lawyer-tel-aviv/`. It does show broad, cost, agreement/template and procedure demand scattered across existing or legacy assets, so the local page must remain a narrow fit-check/preparation page and must not absorb pillar, cost, template, mediation, settlement, custody or calculator intent. The generated focused-export template is the next required GSC input before owner/publication approval.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-tel-aviv-family-gsc-cache-review.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD] [--gscDir=.reports/gsc]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const draftReport = readJson(`.reports/tel-aviv-family-local-draft-packet-${args.sourceDate}.json`);
  const overlapReview = readJson(`.reports/tel-aviv-family-internal-overlap-review-${args.sourceDate}.json`);
  const gscDecisionMap = readOptionalJson(`.reports/family-divorce-gsc-decision-map-${args.sourceDate}.json`) || readOptionalJson('.reports/family-divorce-gsc-decision-map-2026-05-26.json');
  const queryPageRows = readCsvFile(path.join(args.gscDir, 'query-page-combined.csv'));
  const performanceQueryRows = existsSync(path.join(args.gscDir, 'performance-queries.csv')) ? readCsvFile(path.join(args.gscDir, 'performance-queries.csv')) : [];
  const performancePageRows = existsSync(path.join(args.gscDir, 'performance-pages.csv')) ? readCsvFile(path.join(args.gscDir, 'performance-pages.csv')) : [];
  const routeRoleMap = buildRouteRoleMap(overlapReview);
  const matchedRows = buildMatchedRows(queryPageRows, routeRoleMap);
  const clusterRows = aggregateClusterRows(matchedRows);
  const focusedExportTemplateRows = buildFocusedExportTemplate();
  const gates = buildGates({ draftReport, overlapReview, clusterRows, queryPageRows, gscDecisionMap });
  const blockedGateCount = gates.filter((gate) => gate.status === 'BLOCKED').length;
  const reviewGateCount = gates.filter((gate) => gate.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'TEL_AVIV_FAMILY_GSC_CACHE_REVIEW_BLOCKED_NO_PUBLIC_CHANGE'
    : 'TEL_AVIV_FAMILY_GSC_CACHE_REVIEW_READY_FOCUSED_EXPORT_REQUIRED_NO_PUBLIC_CHANGE';

  const summary = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    inputMode: 'LOCAL_GSC_CACHE_PRELIMINARY_NOT_FINAL',
    queryPageCacheRows: queryPageRows.length,
    performanceQueryRows: performanceQueryRows.length,
    performancePageRows: performancePageRows.length,
    matchedCacheRows: matchedRows.length,
    exactLocalCacheRows: clusterRows.find((row) => row.cluster_id === 'exact_local_divorce_lawyer')?.cache_rows || 0,
    broadDivorceLawyerRows: clusterRows.find((row) => row.cluster_id === 'broad_divorce_lawyer')?.cache_rows || 0,
    clusterCount: QUERY_CLUSTERS.length,
    focusedExportPages: FOCUSED_EXPORT_PAGES.length,
    focusedExportTemplateRows: focusedExportTemplateRows.length,
    gateCount: gates.length,
    passGateCount: gates.filter((gate) => gate.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    gscApiCalled: 0,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    redirectsOrCanonicalsChanged: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    upressDeploymentRequired: false,
    priorGscFinality: gscDecisionMap?.finality || '',
  };

  const files = outputFiles(args.reportDate);
  const clusterColumns = [
    'cluster_id',
    'query_filter',
    'preferred_owner',
    'cache_rows',
    'clicks',
    'impressions',
    'cache_ctr',
    'weighted_position',
    'associated_route_rows',
    'top_pages',
    'cache_interpretation',
    'next_action',
    'status',
    'public_action_approved',
  ];
  const matchedColumns = [
    'cluster_id',
    'query',
    'page',
    'page_display',
    'route_family',
    'clicks',
    'impressions',
    'ctr',
    'position',
    'current_or_cache_signal',
    'public_action_approved',
  ];
  const templateColumns = [
    'query_cluster',
    'query_filter',
    'page_filter',
    'export_dimensions',
    'date_range',
    'country',
    'device',
    'clicks',
    'impressions',
    'ctr',
    'position',
    'existing_route_owner',
    'preliminary_cache_status',
    'reviewer_decision',
    'notes_no_pii',
  ];

  const report = {
    summary,
    gates,
    clusterRows,
    matchedRows,
    focusedExportTemplateRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, summary, gates, clusterRows, matchedRows }));
  writeText(files.projectCsv, toCsv(clusterRows, clusterColumns));
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(files.reportCsv, toCsv(matchedRows, matchedColumns));
  writeText(files.focusedExportTemplateCsv, toCsv(focusedExportTemplateRows, templateColumns));

  console.log(
    JSON.stringify(
      {
        reportDate: summary.reportDate,
        sourceDate: summary.sourceDate,
        status: summary.status,
        inputMode: summary.inputMode,
        queryPageCacheRows: summary.queryPageCacheRows,
        matchedCacheRows: summary.matchedCacheRows,
        exactLocalCacheRows: summary.exactLocalCacheRows,
        broadDivorceLawyerRows: summary.broadDivorceLawyerRows,
        passGateCount: summary.passGateCount,
        reviewGateCount: summary.reviewGateCount,
        blockedGateCount: summary.blockedGateCount,
        focusedExportTemplateRows: summary.focusedExportTemplateRows,
        gscApiCalled: summary.gscApiCalled,
        publicChangesApproved: summary.publicChangesApproved,
        emailsSent: summary.emailsSent,
        upressDeploymentRequired: summary.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main();
