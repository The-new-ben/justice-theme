import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_GSC_DIR = path.join(ROOT, '.reports', 'gsc');

const TARGET_PATHS = [
  '/criminal-defense-attorney/',
  '/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/',
  '/detention-before-charge-or-trial/',
  '/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/',
  '/drug-offenses-criminal-lawyer/',
];

const TARGET_SET = new Set(TARGET_PATHS.flatMap(pathVariants));

const DEFAULT_ROUTE_REVIEW_FILE = path.join(ROOT, '.project-control', 'criminal-law-primary-redirect-check-2026-05-11.csv');
const DEFAULT_WRONG_PAGE_FILE = path.join(ROOT, '.project-control', 'traffic-criminal-wrong-page-decision-packet-2026-05-11.csv');

function parseArgs() {
  const args = {
    gscDir: process.env.GSC_DECISION_INPUT_DIR || DEFAULT_GSC_DIR,
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
    dashboard: process.env.CRIMINAL_READINESS_DASHBOARD_CSV || '',
    routeReview: process.env.CRIMINAL_ROUTE_REVIEW_CSV || DEFAULT_ROUTE_REVIEW_FILE,
    wrongPagePacket: process.env.CRIMINAL_WRONG_PAGE_PACKET_CSV || DEFAULT_WRONG_PAGE_FILE,
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--gscDir=')) args.gscDir = arg.slice('--gscDir='.length);
    else if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--dashboard=')) args.dashboard = arg.slice('--dashboard='.length);
    else if (arg.startsWith('--routeReview=')) args.routeReview = arg.slice('--routeReview='.length);
    else if (arg.startsWith('--wrongPagePacket=')) args.wrongPagePacket = arg.slice('--wrongPagePacket='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) throw new Error('--reportDate must be YYYY-MM-DD');
  args.gscDir = path.resolve(args.gscDir);
  args.dashboard = args.dashboard
    ? path.resolve(args.dashboard)
    : findLatestProjectControlFile(/^criminal-traffic-readiness-dashboard-\d{4}-\d{2}-\d{2}\.csv$/);
  if (!args.dashboard) throw new Error('No criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv found; pass --dashboard=path');
  args.routeReview = path.resolve(args.routeReview);
  args.wrongPagePacket = path.resolve(args.wrongPagePacket);
  return args;
}

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function findLatestProjectControlFile(pattern) {
  const dir = path.join(ROOT, '.project-control');
  return readdirSync(dir)
    .filter((fileName) => pattern.test(fileName))
    .sort()
    .reverse()
    .map((fileName) => path.join(dir, fileName))[0] || '';
}

function printHelp() {
  console.log(`Criminal GSC decision map

Usage:
  node tools/build-criminal-gsc-decision-map.mjs
  node tools/build-criminal-gsc-decision-map.mjs --gscDir=.reports/gsc/criminal-law-YYYY-MM-DD --reportDate=YYYY-MM-DD

Inputs:
  Focused export: criminal-law-pages.csv, criminal-law-query-page.csv, criminal-law-cannibalization.csv
  Baseline: .project-control/criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv

Outputs:
  .reports/criminal-gsc-decision-map-YYYY-MM-DD.csv
  .reports/criminal-protected-url-decision-map-YYYY-MM-DD.csv
  .reports/criminal-cannibalization-decision-map-YYYY-MM-DD.csv
  .reports/criminal-gsc-decision-map-YYYY-MM-DD.json
`);
}

function buildFiles(reportDate) {
  return {
    outputCsv: path.join(ROOT, '.reports', `criminal-gsc-decision-map-${reportDate}.csv`),
    protectedCsv: path.join(ROOT, '.reports', `criminal-protected-url-decision-map-${reportDate}.csv`),
    cannibalizationCsv: path.join(ROOT, '.reports', `criminal-cannibalization-decision-map-${reportDate}.csv`),
    outputJson: path.join(ROOT, '.reports', `criminal-gsc-decision-map-${reportDate}.json`),
  };
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  if (quoted) throw new Error(`Unclosed CSV quote in line: ${line.slice(0, 80)}`);
  return values;
}

function readCsv(filePath) {
  if (!existsSync(filePath)) return [];
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`${path.relative(ROOT, filePath)}: expected ${headers.length} columns, got ${values.length}`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function csvEscape(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeCsv(filePath, rows, columns) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, toCsv(rows, columns), 'utf8');
}

function normalizePath(value) {
  if (!value) return '';
  let pathname = value;
  try {
    pathname = value.startsWith('http') ? new URL(value).pathname : new URL(value, 'https://jus-tice.co.il').pathname;
  } catch (_err) {
    pathname = value;
  }
  pathname = pathname.split('#')[0].split('?')[0];
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (!/\/[^/]+\.[a-z0-9]{2,8}$/i.test(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function pathVariants(value) {
  const normalized = normalizePath(value);
  const variants = new Set([normalized, normalized.replace(/\/$/, '')]);
  try {
    const decoded = decodeURIComponent(normalized);
    variants.add(decoded);
    variants.add(decoded.replace(/\/$/, ''));
  } catch (_err) {
    // Encoded variants are enough.
  }
  return [...variants].filter(Boolean);
}

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '').replace(/,/g, '')) || 0;
}

function resolveInputFiles(gscDir) {
  const focused = {
    pages: path.join(gscDir, 'criminal-law-pages.csv'),
    queryPage: path.join(gscDir, 'criminal-law-query-page.csv'),
    cannibalization: path.join(gscDir, 'criminal-law-cannibalization.csv'),
  };
  if (existsSync(focused.pages) || existsSync(focused.queryPage) || existsSync(focused.cannibalization)) {
    return { mode: 'FOCUSED_GSC_EXPORT', ...focused };
  }
  return {
    mode: 'BASELINE_DASHBOARD_NOT_FINAL',
    pages: '',
    queryPage: path.join(DEFAULT_GSC_DIR, 'query-page-combined.csv'),
    cannibalization: path.join(DEFAULT_GSC_DIR, 'cannibalization-report.csv'),
  };
}

function buildMetricMap(pageRows, dashboardRows) {
  const map = new Map();
  pageRows.forEach((row) => {
    const page = row.page || row.path || '';
    pathVariants(page).forEach((variant) => map.set(variant, {
      clicks: row.clicks || '0',
      impressions: row.impressions || '0',
      position: row.position || '',
      source: 'FOCUSED_GSC_EXPORT',
    }));
  });
  dashboardRows.forEach((row) => {
    const currentUrl = row.current_url || '';
    if (!currentUrl) return;
    const metric = {
      clicks: row.gsc_clicks || '0',
      impressions: row.gsc_impressions || '0',
      position: '',
      source: row.gsc_clicks || row.gsc_impressions ? 'DASHBOARD_BASELINE_NOT_FINAL' : 'NO_BASELINE_GSC_SIGNAL',
    };
    pathVariants(currentUrl).forEach((variant) => {
      if (!map.has(variant)) map.set(variant, metric);
    });
  });
  return map;
}

function findMetric(metricMap, itemPath) {
  for (const variant of pathVariants(itemPath)) {
    if (metricMap.has(variant)) return metricMap.get(variant);
  }
  return null;
}

function riskFrom(row, metric, fallback = '') {
  const explicitRisk = row.traffic_risk || fallback;
  if (explicitRisk) return explicitRisk;
  const clicks = numberValue(metric?.clicks);
  const impressions = numberValue(metric?.impressions);
  if (clicks > 0 || impressions >= 10000) return 'HIGH';
  if (impressions >= 100) return 'MEDIUM';
  return 'LOW_UNKNOWN';
}

function buildTargetRows(dashboardRows, metricMap, inputMode) {
  return dashboardRows
    .filter((row) => row.lane === 'CRIMINAL_FIRST_UPLOAD_TARGET')
    .map((row) => {
      const pathValue = normalizePath(row.current_url);
      const metric = findMetric(metricMap, pathValue);
      return {
        group: 'criminal_current_target',
        path: pathValue,
        mapped_target: row.target_url_or_hub || '',
        role_or_topic: row.role_or_topic || '',
        live_or_route_status: row.decision_status || '',
        gsc_clicks: metric?.clicks || '0',
        gsc_impressions: metric?.impressions || '0',
        gsc_position: metric?.position || '',
        metric_source: metric?.source || 'NO_GSC_ROW_IN_INPUT',
        risk: riskFrom(row, metric),
        proposed_action: 'UPDATE_EXISTING_CURRENT_URL_ONLY_AFTER_OWNER_APPROVAL_NO_URL_CHANGE',
        required_before_action: 'owner_legal_source_approval; wordpress_editor_database_backup; focused_gsc_export_before_url_migration',
        blocked_actions: 'new_clean_slug; redirect; canonical_change; noindex; sitemap_change; taxonomy_change; public_internal_link_write',
        status: inputMode === 'FOCUSED_GSC_EXPORT' ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION' : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
      };
    });
}

function supportAction(row) {
  const haystack = `${row.notes || ''} ${row.current_url || ''} ${row.role_or_topic || ''}`.toLowerCase();
  if (haystack.includes('traffic-lawyer')) return 'HOLD_FOR_TRAFFIC_CRIMINAL_BOUNDARY_REVIEW';
  if (haystack.includes('trust-claim') || haystack.includes('famous') || haystack.includes('leading')) {
    return 'KEEP_URL_REWRITE_CLAIMS_AFTER_OWNER_REVIEW';
  }
  if (haystack.includes('cost') || haystack.includes('price') || haystack.includes('מחיר')) {
    return 'KEEP_URL_REVIEW_COMMERCIAL_PRICE_INTENT_BEFORE_REWRITE';
  }
  return 'KEEP_LIVE_REWRITE_OR_LINK_ONLY_AFTER_OWNER_REVIEW';
}

function buildSupportRows(dashboardRows, metricMap, inputMode) {
  return dashboardRows
    .filter((row) => row.lane === 'CRIMINAL_SUPPORT_MAP')
    .filter((row) => !TARGET_SET.has(normalizePath(row.current_url)))
    .map((row) => {
      const pathValue = normalizePath(row.current_url);
      const metric = findMetric(metricMap, pathValue);
      return {
        group: 'criminal_protected_support',
        path: pathValue,
        mapped_target: row.target_url_or_hub || '',
        role_or_topic: row.role_or_topic || '',
        live_or_route_status: row.readiness_status || row.decision_status || '',
        gsc_clicks: metric?.clicks || row.gsc_clicks || '0',
        gsc_impressions: metric?.impressions || row.gsc_impressions || '0',
        gsc_position: metric?.position || '',
        metric_source: metric?.source || 'DASHBOARD_BASELINE_NOT_FINAL',
        risk: riskFrom(row, metric),
        proposed_action: supportAction(row),
        required_before_action: 'focused_gsc_export; content_quality_review; owner_approval_before_redirect_retirement_or_rewrite',
        blocked_actions: row.blocked_actions || 'redirect; canonical_change; noindex; sitemap_change; blind_merge',
        status: inputMode === 'FOCUSED_GSC_EXPORT' ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION' : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
      };
    });
}

function routeAction(row) {
  const target = normalizePath(row.url || '');
  if (target === '/criminal-lawyer/') return 'DO_NOT_USE_ROUTE_IN_LINKS_SITEMAP_CANONICALS_UNTIL_REAL_DESTINATION_APPROVED';
  if ((row.status || '').includes('BLOCKED_ROUTE_FALLBACK')) return 'RESTORE_OR_TARGETED_301_REVIEW_AFTER_FOCUSED_GSC_AND_OWNER_APPROVAL';
  return 'KEEP_AS_SUPPORT_OR_REVIEW_AFTER_FOCUSED_GSC';
}

function buildRouteRows(routeRows, metricMap, inputMode) {
  return routeRows
    .filter((row) => !TARGET_SET.has(normalizePath(row.url)))
    .map((row) => {
      const pathValue = normalizePath(row.url);
      const metric = findMetric(metricMap, pathValue);
      return {
        group: 'criminal_route_or_slug_risk',
        path: pathValue,
        mapped_target: pathValue === '/criminal-lawyer/' ? '/criminal-lawyer/' : '/criminal-defense-attorney/',
        role_or_topic: 'route_fallback_or_slug_conflict',
        live_or_route_status: row.status || row.first_status || '',
        gsc_clicks: metric?.clicks || '0',
        gsc_impressions: metric?.impressions || '0',
        gsc_position: metric?.position || '',
        metric_source: metric?.source || 'ROUTE_REVIEW_BASELINE_NOT_FINAL',
        risk: (row.status || '').includes('BLOCKED') ? 'HIGH' : riskFrom({}, metric),
        proposed_action: routeAction(row),
        required_before_action: 'focused_gsc_export; route_header_recheck; owner_approval_before_redirect_or_sitemap_action',
        blocked_actions: 'using_homepage_redirect_as_final_migration; sitemap_addition; internal_link_target; canonical_target',
        status: inputMode === 'FOCUSED_GSC_EXPORT' ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION' : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
      };
    });
}

function rowContainsKnownPath(row) {
  const haystack = [row.page, row.path, row.pages].filter(Boolean).join(' ');
  const knownPaths = [...TARGET_PATHS, ...pathVariants('/criminal-lawyer/')];
  return knownPaths.some((knownPath) => pathVariants(knownPath).some((variant) => variant && haystack.includes(variant)));
}

function buildCannibalizationRows(cannibalizationRows, queryPageRows, wrongPageRows, inputMode) {
  const fromCannibalization = cannibalizationRows
    .filter(rowContainsKnownPath)
    .map((row) => ({
      source: inputMode,
      query: row.query || '',
      page_count: row.page_count || '',
      total_clicks: row.total_clicks || row.clicks || '0',
      total_impressions: row.total_impressions || row.impressions || '0',
      pages: row.pages || row.page || '',
      positions: row.positions || row.position || '',
      risk: numberValue(row.total_clicks || row.clicks) > 0 || numberValue(row.total_impressions || row.impressions) >= 100 ? 'HIGH' : 'MEDIUM_OR_UNKNOWN',
      proposed_action: 'REVIEW_BEFORE_REDIRECT_CANONICAL_NOINDEX_OR_MERGE',
      status: inputMode === 'FOCUSED_GSC_EXPORT' ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION' : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
    }));

  const fromWrongPagePacket = wrongPageRows
    .filter((row) => row.cluster === 'criminal-law')
    .map((row) => ({
      source: 'WRONG_PAGE_DECISION_PACKET_BASELINE',
      query: row.query_or_topic || '',
      page_count: '',
      total_clicks: '',
      total_impressions: '',
      pages: [row.current_url, row.proposed_or_candidate_url].filter(Boolean).join(' | '),
      positions: row.gsc_signal || '',
      risk: row.classification && row.classification.includes('RISK') ? 'HIGH' : 'MEDIUM_OR_UNKNOWN',
      proposed_action: row.decision || 'REVIEW_BEFORE_PUBLIC_ACTION',
      status: 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
    }));

  if (fromCannibalization.length) return [...fromCannibalization, ...fromWrongPagePacket];

  const grouped = new Map();
  queryPageRows.filter(rowContainsKnownPath).forEach((row) => {
    const query = row.query || '';
    if (!query) return;
    if (!grouped.has(query)) grouped.set(query, []);
    grouped.get(query).push(row);
  });
  const fromQueryPage = [...grouped.entries()]
    .map(([query, items]) => {
      const pages = [...new Set(items.map((item) => item.page || item.path).filter(Boolean))];
      if (pages.length < 2) return null;
      const totalClicks = items.reduce((sum, item) => sum + numberValue(item.clicks), 0);
      const totalImpressions = items.reduce((sum, item) => sum + numberValue(item.impressions), 0);
      return {
        source: inputMode,
        query,
        page_count: pages.length,
        total_clicks: totalClicks,
        total_impressions: totalImpressions,
        pages: pages.join(' | '),
        positions: items.map((item) => `${item.page || item.path}=${item.position || ''}`).join(' | '),
        risk: totalClicks > 0 || totalImpressions >= 100 ? 'HIGH' : 'MEDIUM_OR_UNKNOWN',
        proposed_action: 'REVIEW_BEFORE_REDIRECT_CANONICAL_NOINDEX_OR_MERGE',
        status: inputMode === 'FOCUSED_GSC_EXPORT' ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION' : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
      };
    })
    .filter(Boolean);

  return [...fromQueryPage, ...fromWrongPagePacket];
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = buildFiles(args.reportDate);
  const inputs = resolveInputFiles(args.gscDir);
  const dashboardRows = readCsv(args.dashboard);
  const routeRows = readCsv(args.routeReview);
  const wrongPageRows = readCsv(args.wrongPagePacket);
  const pageRows = readCsv(inputs.pages);
  const queryPageRows = readCsv(inputs.queryPage);
  const cannibalizationInputRows = readCsv(inputs.cannibalization);

  const metricMap = buildMetricMap(pageRows, dashboardRows);
  const targetRows = buildTargetRows(dashboardRows, metricMap, inputs.mode);
  const supportRows = buildSupportRows(dashboardRows, metricMap, inputs.mode);
  const routeRowsOut = buildRouteRows(routeRows, metricMap, inputs.mode);
  const protectedRows = [...supportRows, ...routeRowsOut];
  const decisionRows = [...targetRows, ...protectedRows];
  const cannibalizationRows = buildCannibalizationRows(
    cannibalizationInputRows,
    queryPageRows,
    wrongPageRows,
    inputs.mode
  );

  const decisionColumns = [
    'group',
    'path',
    'mapped_target',
    'role_or_topic',
    'live_or_route_status',
    'gsc_clicks',
    'gsc_impressions',
    'gsc_position',
    'metric_source',
    'risk',
    'proposed_action',
    'required_before_action',
    'blocked_actions',
    'status',
  ];
  writeCsv(files.outputCsv, decisionRows, decisionColumns);
  writeCsv(files.protectedCsv, protectedRows, decisionColumns);
  writeCsv(files.cannibalizationCsv, cannibalizationRows, [
    'source',
    'query',
    'page_count',
    'total_clicks',
    'total_impressions',
    'pages',
    'positions',
    'risk',
    'proposed_action',
    'status',
  ]);

  const summary = {
    generatedAt: new Date().toISOString(),
    inputMode: inputs.mode,
    inputDir: args.gscDir,
    reportDate: args.reportDate,
    dashboard: path.relative(ROOT, args.dashboard),
    targetRows: targetRows.length,
    protectedRows: protectedRows.length,
    supportRows: supportRows.length,
    routeRiskRows: routeRowsOut.length,
    highRiskProtectedRows: protectedRows.filter((row) => row.risk === 'HIGH').length,
    cannibalizationRows: cannibalizationRows.length,
    finality: inputs.mode === 'FOCUSED_GSC_EXPORT'
      ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION'
      : 'NOT_FINAL_BASELINE_FROM_DASHBOARD_RUN_FOCUSED_GSC_EXPORT_NEXT',
    blockers: [
      'owner_legal_source_approval_required_before_cms_upload',
      'wordpress_backup_required_before_cms_upload',
      'focused_gsc_export_required_before_url_migration_redirect_canonical_noindex_sitemap_actions',
    ],
    outputs: {
      decisionMap: path.relative(ROOT, files.outputCsv),
      protectedUrlDecisionMap: path.relative(ROOT, files.protectedCsv),
      cannibalizationDecisionMap: path.relative(ROOT, files.cannibalizationCsv),
      summary: path.relative(ROOT, files.outputJson),
    },
  };
  writeFileSync(files.outputJson, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Wrote ${path.relative(ROOT, files.outputCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.protectedCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.cannibalizationCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.outputJson)}`);
  console.log(`Input mode: ${summary.inputMode}`);
  console.log(`Target rows: ${summary.targetRows}`);
  console.log(`Protected rows: ${summary.protectedRows}`);
  console.log(`Cannibalization rows: ${summary.cannibalizationRows}`);
}

main();
