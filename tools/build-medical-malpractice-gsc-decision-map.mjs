import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_GSC_DIR = path.join(ROOT, 'reports', 'gsc');
const DEFAULT_BLOCKED_ACTIONS = 'cms_upload; slug_change; redirect; canonical_change; noindex; sitemap_change; taxonomy_change; public_internal_link_write';

const DECISION_COLUMNS = [
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

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function findLatestProjectControlFile(pattern) {
  const dir = path.join(ROOT, 'project-control');
  return readdirSync(dir)
    .filter((fileName) => pattern.test(fileName))
    .sort()
    .reverse()
    .map((fileName) => path.join(dir, fileName))[0] || '';
}

function parseArgs() {
  const args = {
    gscDir: process.env.GSC_DECISION_INPUT_DIR || DEFAULT_GSC_DIR,
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
    dashboard: process.env.MEDICAL_MALPRACTICE_READINESS_DASHBOARD_CSV || '',
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--gscDir=')) args.gscDir = arg.slice('--gscDir='.length);
    else if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--dashboard=')) args.dashboard = arg.slice('--dashboard='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) throw new Error('--reportDate must be YYYY-MM-DD');
  args.gscDir = path.resolve(args.gscDir);
  args.dashboard = args.dashboard
    ? path.resolve(args.dashboard)
    : findLatestProjectControlFile(/^medical-malpractice-readiness-dashboard-\d{4}-\d{2}-\d{2}\.csv$/);
  if (!args.dashboard) throw new Error('No medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv found; pass --dashboard=path');
  return args;
}

function printHelp() {
  console.log(`Medical Malpractice GSC decision map

Usage:
  node tools/build-medical-malpractice-gsc-decision-map.mjs
  node tools/build-medical-malpractice-gsc-decision-map.mjs --gscDir=reports/gsc/medical-malpractice-YYYY-MM-DD --reportDate=YYYY-MM-DD

Inputs:
  Focused export: medical-malpractice-pages.csv, medical-malpractice-query-page.csv, medical-malpractice-cannibalization.csv
  Baseline: project-control/medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv

Outputs:
  reports/medical-malpractice-gsc-decision-map-YYYY-MM-DD.csv
  reports/medical-malpractice-protected-url-decision-map-YYYY-MM-DD.csv
  reports/medical-malpractice-cannibalization-decision-map-YYYY-MM-DD.csv
  reports/medical-malpractice-gsc-decision-map-YYYY-MM-DD.json
  project-control/medical-malpractice-gsc-decision-map-YYYY-MM-DD.csv
  project-control/medical-malpractice-gsc-decision-map-YYYY-MM-DD.md
`);
}

function buildFiles(reportDate) {
  return {
    outputCsv: path.join(ROOT, 'reports', `medical-malpractice-gsc-decision-map-${reportDate}.csv`),
    protectedCsv: path.join(ROOT, 'reports', `medical-malpractice-protected-url-decision-map-${reportDate}.csv`),
    cannibalizationCsv: path.join(ROOT, 'reports', `medical-malpractice-cannibalization-decision-map-${reportDate}.csv`),
    outputJson: path.join(ROOT, 'reports', `medical-malpractice-gsc-decision-map-${reportDate}.json`),
    projectCsv: path.join(ROOT, 'project-control', `medical-malpractice-gsc-decision-map-${reportDate}.csv`),
    projectMd: path.join(ROOT, 'project-control', `medical-malpractice-gsc-decision-map-${reportDate}.md`),
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
  const headers = parseCsvLine(lines[0]).map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '') : header
  ));
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
  let pathname = String(value).trim();
  if (!pathname || /^REFERENCE:|^FUTURE:|^TRAFFIC_|^old row/i.test(pathname)) return '';
  try {
    pathname = pathname.startsWith('http') ? new URL(pathname).pathname : new URL(pathname, 'https://jus-tice.co.il').pathname;
  } catch (_err) {
    pathname = pathname.split(/[;|]/)[0];
  }
  pathname = pathname.split('#')[0].split('?')[0];
  if (!pathname.startsWith('/')) return '';
  if (!/\/[^/]+\.[a-z0-9]{2,8}$/i.test(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function pathVariants(value) {
  const normalized = normalizePath(value);
  if (!normalized) return [];
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

function firstPath(value) {
  for (const item of String(value || '').split(/[;|]/)) {
    const normalized = normalizePath(item);
    if (normalized) return normalized;
  }
  return '';
}

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '').replace(/,/g, '')) || 0;
}

function resolveInputFiles(gscDir) {
  const focused = {
    pages: path.join(gscDir, 'medical-malpractice-pages.csv'),
    queryPage: path.join(gscDir, 'medical-malpractice-query-page.csv'),
    cannibalization: path.join(gscDir, 'medical-malpractice-cannibalization.csv'),
  };
  if (existsSync(focused.pages) || existsSync(focused.queryPage) || existsSync(focused.cannibalization)) {
    return { mode: 'FOCUSED_GSC_EXPORT', ...focused };
  }
  return {
    mode: 'BASELINE_DASHBOARD_NOT_FINAL',
    pages: '',
    queryPage: '',
    cannibalization: '',
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
    const currentUrl = firstPath(row.current_url);
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
  if (clicks >= 50 || impressions >= 10000) return 'HIGH';
  if (clicks > 0 || impressions >= 3000) return 'MEDIUM';
  return 'LOW_UNKNOWN';
}

function finalStatus(inputMode) {
  return inputMode === 'FOCUSED_GSC_EXPORT'
    ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION'
    : 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT';
}

function targetRows(dashboardRows, metricMap, inputMode) {
  return dashboardRows
    .filter((row) => row.lane === 'CURRENT_URL_READINESS')
    .filter((row) => firstPath(row.current_url) === '/medical-malpractice-lawyer/')
    .slice(0, 1)
    .map((row) => {
      const pathValue = firstPath(row.current_url);
      const metric = findMetric(metricMap, pathValue);
      return {
        group: 'medical_primary_target',
        path: pathValue,
        mapped_target: row.target_url_or_hub || pathValue,
        role_or_topic: row.role_or_topic || '',
        live_or_route_status: row.decision_status || row.readiness_status || '',
        gsc_clicks: metric?.clicks || row.gsc_clicks || '0',
        gsc_impressions: metric?.impressions || row.gsc_impressions || '0',
        gsc_position: metric?.position || '',
        metric_source: metric?.source || 'NO_GSC_ROW_IN_INPUT',
        risk: 'PROTECTED_REVIEW',
        proposed_action: 'DUPLICATE_IDENTITY_REVIEW_THEN_CURRENT_URL_UPDATE_ONLY_AFTER_OWNER_APPROVAL',
        required_before_action: 'resolve_duplicate_cms_identity; focused_gsc_export; owner_legal_source_approval; wordpress_editor_database_backup',
        blocked_actions: DEFAULT_BLOCKED_ACTIONS,
        status: finalStatus(inputMode),
      };
    });
}

function proposedAction(row, pathValue) {
  const haystack = `${row.lane || ''} ${row.decision_status || ''} ${row.readiness_status || ''} ${row.url_action_status || ''} ${row.notes || ''}`.toLowerCase();
  if (row.readiness_status === 'POSSIBLE_FALSE_POSITIVE_REVIEW') return 'REMOVE_OR_RECLASSIFY_BEFORE_UPLOAD_PLANNING';
  if (/target_slug_conflict|duplicate_target_slug/i.test(haystack)) return 'DO_NOT_REDIRECT_TARGET_SLUG_CONFLICT_NEEDS_REVIEW';
  if (/404|route_risk_404|blocked_before_route/i.test(haystack)) return 'DO_NOT_CREATE_OR_REDIRECT_UNTIL_SOURCE_PAGE_COMPARISON_AND_GSC_EXPORT';
  if (/recommended|leading|trust-claim|מומלץ/i.test(`${row.current_url || ''} ${row.notes || ''}`)) return 'KEEP_URL_REWRITE_TRUST_CLAIMS_AFTER_OWNER_REVIEW';
  if (/fee|cost|pricing|שכר|הוצאות/i.test(`${row.role_or_topic || ''} ${row.notes || ''}`)) return 'KEEP_URL_REVIEW_COMMERCIAL_PRICE_INTENT_BEFORE_REWRITE';
  if (pathValue === '/medical-malpractice-in-the-united-states/') return 'KEEP_SEPARATE_INTERNATIONAL_CONTEXT_DO_NOT_MERGE_INTO_ISRAELI_SERVICE_HUB';
  return 'KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE';
}

function isBoundary(row) {
  return /EXCLUDE_FROM_MALPRACTICE|VERIFIED_BOUNDARY|EXCLUDE_PENDING_MANUAL_REVIEW/i.test(`${row.decision_status || ''} ${row.readiness_status || ''} ${row.url_action_status || ''}`);
}

function buildProtectedRows(dashboardRows, metricMap, inputMode) {
  const lanes = new Set([
    'P0_SUPPORT_TO_HUB_MAP',
    'CLEAN_SLUG_ROUTE_REVIEW',
    'CURRENT_URL_READINESS',
    'URL_MIGRATION_MAP',
    'CONTENT_INVENTORY_AUDIT',
  ]);

  return dashboardRows
    .filter((row) => lanes.has(row.lane))
    .filter((row) => !isBoundary(row))
    .map((row) => {
      const pathValue = firstPath(row.current_url);
      if (!pathValue || pathValue === '/medical-malpractice-lawyer/') return null;
      const metric = findMetric(metricMap, pathValue);
      return {
        group: row.readiness_status === 'POSSIBLE_FALSE_POSITIVE_REVIEW'
          ? 'medical_false_positive_review'
          : row.lane === 'CLEAN_SLUG_ROUTE_REVIEW'
            ? 'medical_route_or_slug_risk'
            : row.lane === 'URL_MIGRATION_MAP'
              ? 'medical_url_migration_review'
              : 'medical_protected_support',
        path: pathValue,
        mapped_target: row.target_url_or_hub || '',
        role_or_topic: row.role_or_topic || '',
        live_or_route_status: row.decision_status || row.readiness_status || row.url_action_status || '',
        gsc_clicks: metric?.clicks || row.gsc_clicks || '0',
        gsc_impressions: metric?.impressions || row.gsc_impressions || '0',
        gsc_position: metric?.position || '',
        metric_source: metric?.source || 'DASHBOARD_BASELINE_NOT_FINAL',
        risk: riskFrom(row, metric),
        proposed_action: proposedAction(row, pathValue),
        required_before_action: 'focused_gsc_export; owner_approval; source_legal_privacy_review; anti_cannibalization_role_decision',
        blocked_actions: row.blocked_actions || DEFAULT_BLOCKED_ACTIONS,
        status: finalStatus(inputMode),
      };
    })
    .filter(Boolean);
}

function buildSourceGateRows(dashboardRows, inputMode) {
  return dashboardRows
    .filter((row) => row.lane === 'SOURCE_LEGAL_GATE')
    .map((row) => ({
      group: 'medical_source_legal_gate',
      path: firstPath(row.current_url),
      mapped_target: row.target_url_or_hub || '',
      role_or_topic: row.role_or_topic || '',
      live_or_route_status: row.decision_status || row.readiness_status || '',
      gsc_clicks: '0',
      gsc_impressions: '0',
      gsc_position: '',
      metric_source: 'SOURCE_LEGAL_DASHBOARD_GATE',
      risk: row.traffic_risk || 'NOT_VERIFIED',
      proposed_action: 'BLOCK_PUBLIC_CONTENT_CHANGES_UNTIL_SOURCE_LEGAL_PRIVACY_REVIEW',
      required_before_action: 'source_legal_privacy_review; owner_approval',
      blocked_actions: row.blocked_actions || DEFAULT_BLOCKED_ACTIONS,
      status: finalStatus(inputMode),
    }));
}

function rowContainsDecisionPath(row, decisionRows) {
  const haystack = [row.page, row.path, row.pages].filter(Boolean).join(' ');
  return decisionRows.some((decisionRow) => pathVariants(decisionRow.path).some((variant) => variant && haystack.includes(variant)));
}

function buildCannibalizationRows(cannibalizationRows, queryPageRows, dashboardRows, decisionRows, inputMode) {
  const focusedRows = cannibalizationRows
    .filter((row) => rowContainsDecisionPath(row, decisionRows))
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
      status: finalStatus(inputMode),
    }));
  if (focusedRows.length) return focusedRows;

  const grouped = new Map();
  queryPageRows.filter((row) => rowContainsDecisionPath(row, decisionRows)).forEach((row) => {
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
        status: finalStatus(inputMode),
      };
    })
    .filter(Boolean);
  if (fromQueryPage.length) return fromQueryPage;

  return dashboardRows
    .filter((row) => row.lane === 'CANNIBALIZATION_GROUP')
    .map((row) => ({
      source: 'DASHBOARD_BASELINE_NOT_FINAL',
      query: row.role_or_topic || 'medical-malpractice cluster',
      page_count: '',
      total_clicks: '',
      total_impressions: '',
      pages: row.secondary_url || row.current_url || '',
      positions: '',
      risk: 'UNKNOWN_NEEDS_GSC',
      proposed_action: 'CHOOSE_PRIMARY_SUPPORT_MERGE_REWRITE_KEEP_AND_REDIRECT_LATER_ROLES',
      status: 'NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT',
    }));
}

function markdownTable(rows, columns, maxRows = 14) {
  const selected = rows.slice(0, maxRows);
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = selected.map((row) => `| ${columns.map((column) => csvEscape(String(row[column] || '').slice(0, 120))).join(' | ')} |`);
  const suffix = rows.length > maxRows ? [``, `_Showing ${maxRows} of ${rows.length} rows._`] : [];
  return [header, divider, ...body, ...suffix].join('\n');
}

function buildMarkdown(summary, decisionRows, protectedRows, cannibalizationRows, files) {
  const highRiskRows = decisionRows.filter((row) => /HIGH|PROTECTED|UNKNOWN_NEEDS_GSC|ROUTE_RISK/i.test(row.risk || ''));
  return `# Medical Malpractice GSC Decision Map - ${summary.reportDate}

## Status

FIXED local decision workflow. VERIFIED local generation completed. ${summary.inputMode === 'FOCUSED_GSC_EXPORT' ? 'FOCUSED GSC EXPORT rows were detected.' : 'NOT VERIFIED FINAL: this is a baseline dashboard map until the focused GSC export runs.'}

No public CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer-card, schema or CRM change was executed.

## Batch

- Decision rows: ${summary.decisionRows}
- Protected URL rows: ${summary.protectedRows}
- Source/legal gate rows: ${summary.sourceGateRows}
- High/protected/unknown-GSC risk rows: ${summary.highRiskRows}
- Cannibalization rows: ${summary.cannibalizationRows}

## Required Gates

- BLOCKED: resolve duplicate CMS identity for \`/medical-malpractice-lawyer/\`.
- BLOCKED: run focused GSC export before any redirect, canonical, noindex, sitemap or slug action.
- BLOCKED: complete source/legal/privacy review before medical content upload.
- BLOCKED: approve primary/support/merge/rewrite/keep roles before internal-link or related-content writes.

## Highest Risk Rows

${markdownTable(highRiskRows, ['group', 'path', 'mapped_target', 'risk', 'proposed_action', 'status'], 18)}

## Cannibalization Rows

${markdownTable(cannibalizationRows, ['source', 'query', 'page_count', 'total_clicks', 'total_impressions', 'risk', 'proposed_action'], 12)}

## Output Files

- \`${path.relative(ROOT, files.outputCsv)}\`
- \`${path.relative(ROOT, files.protectedCsv)}\`
- \`${path.relative(ROOT, files.cannibalizationCsv)}\`
- \`${path.relative(ROOT, files.outputJson)}\`
`;
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
  const pageRows = readCsv(inputs.pages);
  const queryPageRows = readCsv(inputs.queryPage);
  const cannibalizationInputRows = readCsv(inputs.cannibalization);

  const metricMap = buildMetricMap(pageRows, dashboardRows);
  const targetRowsOut = targetRows(dashboardRows, metricMap, inputs.mode);
  const protectedRows = buildProtectedRows(dashboardRows, metricMap, inputs.mode);
  const sourceGateRows = buildSourceGateRows(dashboardRows, inputs.mode);
  const decisionRows = [...targetRowsOut, ...protectedRows, ...sourceGateRows];
  const cannibalizationRows = buildCannibalizationRows(
    cannibalizationInputRows,
    queryPageRows,
    dashboardRows,
    decisionRows,
    inputs.mode
  );

  writeCsv(files.outputCsv, decisionRows, DECISION_COLUMNS);
  writeCsv(files.projectCsv, decisionRows, DECISION_COLUMNS);
  writeCsv(files.protectedCsv, protectedRows, DECISION_COLUMNS);
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
    decisionRows: decisionRows.length,
    targetRows: targetRowsOut.length,
    protectedRows: protectedRows.length,
    sourceGateRows: sourceGateRows.length,
    highRiskRows: decisionRows.filter((row) => /HIGH|PROTECTED|UNKNOWN_NEEDS_GSC|ROUTE_RISK/i.test(row.risk || '')).length,
    cannibalizationRows: cannibalizationRows.length,
    finality: inputs.mode === 'FOCUSED_GSC_EXPORT'
      ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION'
      : 'NOT_FINAL_BASELINE_FROM_DASHBOARD_RUN_FOCUSED_GSC_EXPORT_NEXT',
    blockers: [
      'duplicate_medical_malpractice_lawyer_cms_identity_review_required',
      'owner_legal_source_privacy_approval_required_before_cms_upload',
      'wordpress_backup_required_before_cms_upload',
      'focused_gsc_export_required_before_url_migration_redirect_canonical_noindex_sitemap_actions',
    ],
    outputs: {
      decisionMap: path.relative(ROOT, files.outputCsv),
      protectedUrlDecisionMap: path.relative(ROOT, files.protectedCsv),
      cannibalizationDecisionMap: path.relative(ROOT, files.cannibalizationCsv),
      projectDecisionMap: path.relative(ROOT, files.projectCsv),
      projectSummary: path.relative(ROOT, files.projectMd),
      summary: path.relative(ROOT, files.outputJson),
    },
  };
  writeFileSync(files.outputJson, `${JSON.stringify({ summary, decisionRows, protectedRows, cannibalizationRows }, null, 2)}\n`, 'utf8');
  writeFileSync(files.projectMd, buildMarkdown(summary, decisionRows, protectedRows, cannibalizationRows, files), 'utf8');

  console.log(JSON.stringify({
    reportDate: summary.reportDate,
    inputMode: summary.inputMode,
    decisionRows: summary.decisionRows,
    targetRows: summary.targetRows,
    protectedRows: summary.protectedRows,
    sourceGateRows: summary.sourceGateRows,
    highRiskRows: summary.highRiskRows,
    cannibalizationRows: summary.cannibalizationRows,
    outputs: summary.outputs,
  }, null, 2));
}

main();
