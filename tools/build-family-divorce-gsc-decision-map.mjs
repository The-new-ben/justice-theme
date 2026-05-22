import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_GSC_DIR = path.join(ROOT, 'reports', 'gsc');

const TARGET_PATHS = [
  '/divorce-lawyer/',
  '/consensual-divorce/',
  '/divorce-mediation/',
  '/divorce-property-division/',
  '/family-dispute-resolution/',
  '/child-support/',
  '/child-custody/',
];

const SOURCE_TARGET_MAP = new Map([
  ['/free-divorce-agreement-template/', '/consensual-divorce/'],
  ['/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D/', '/child-support/'],
  ['/joint-custody-shared-parenting/', '/child-custody/'],
  ['/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%A2%D7%93%D7%9B%D7%A0%D7%99-%D7%9C%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F/', '/divorce-lawyer/'],
  ['/child-custody-modification/', '/child-custody/'],
  ['/divorce-costs-2025/', '/divorce-lawyer/'],
  ['/%D7%A2%D7%95%D7%93-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%9B%D7%99%D7%A6%D7%93-%D7%9C%D7%9E%D7%A6%D7%95%D7%90-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%95%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%94%D7%AA%D7%92%D7%A8%D7%A9/', '/divorce-lawyer/'],
  ['/living-apart-together-legal-rights/', '/divorce-property-division/'],
  ['/%D7%92%D7%99%D7%A9%D7%95%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A-%D7%A2%D7%95%D7%91%D7%93/', '/divorce-mediation/'],
  ['/request-for-family-dispute-settlements/', '/family-dispute-resolution/'],
  ['/divorce-mediation-basics/', '/divorce-mediation/'],
  ['/cohabitation-property-rights-for-unmarried-couples/', '/divorce-property-division/'],
  ['/how-much-does-a-divorce-agreement-cost/', '/consensual-divorce/'],
  ['/divorce-everything-you-need-to-know/', '/divorce-lawyer/'],
  ['/what-is-child-custody/', '/child-custody/'],
  ['/trusted-divorce-attorney-guide/', '/divorce-lawyer/'],
  ['/strategic-divorce-cost-planning/', '/divorce-lawyer/'],
  ['/wp-content/uploads/2021/03/%D7%A0%D7%95%D7%A1%D7%97-%D7%94%D7%A1%D7%9B%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%93%D7%95%D7%92%D7%9E%D7%90-2021.docx', '/consensual-divorce/'],
]);

function parseArgs() {
  const args = {
    gscDir: process.env.GSC_DECISION_INPUT_DIR || DEFAULT_GSC_DIR,
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
    livePreupload: process.env.FAMILY_DIVORCE_LIVE_PREUPLOAD_CSV || '',
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--gscDir=')) args.gscDir = arg.slice('--gscDir='.length);
    else if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--livePreupload=')) args.livePreupload = arg.slice('--livePreupload='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  args.gscDir = path.resolve(args.gscDir);
  args.livePreupload = args.livePreupload
    ? path.resolve(args.livePreupload)
    : findLatestReportFile(/^family-divorce-live-preupload-\d{4}-\d{2}-\d{2}\.csv$/);
  if (!args.livePreupload) {
    throw new Error('No family-divorce-live-preupload-YYYY-MM-DD.csv file found; pass --livePreupload=path');
  }
  return args;
}

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function findLatestReportFile(pattern) {
  const reportsDir = path.join(ROOT, 'reports');
  try {
    return readdirSync(reportsDir)
      .filter((fileName) => pattern.test(fileName))
      .sort()
      .reverse()
      .map((fileName) => path.join(reportsDir, fileName))[0] || '';
  } catch (_err) {
    return '';
  }
}

function buildFiles(reportDate, livePreupload) {
  const outPrefix = `family-divorce-gsc-decision-map-${reportDate}`;
  return {
    livePreupload,
    outputCsv: path.join(ROOT, 'reports', `${outPrefix}.csv`),
    protectedCsv: path.join(ROOT, 'reports', `family-divorce-protected-url-decision-map-${reportDate}.csv`),
    cannibalizationCsv: path.join(ROOT, 'reports', `family-divorce-cannibalization-decision-map-${reportDate}.csv`),
    outputJson: path.join(ROOT, 'reports', `${outPrefix}.json`),
  };
}

function printHelp() {
  console.log(`Family/Divorce GSC decision map

Usage:
  node tools/build-family-divorce-gsc-decision-map.mjs
  node tools/build-family-divorce-gsc-decision-map.mjs --gscDir=reports/gsc/family-divorce-YYYY-MM-DD
  node tools/build-family-divorce-gsc-decision-map.mjs --reportDate=YYYY-MM-DD --livePreupload=reports/family-divorce-live-preupload-YYYY-MM-DD.csv

Inputs:
  Focused export: family-divorce-pages.csv, family-divorce-query-page.csv, family-divorce-cannibalization.csv
  Fallback cache: performance-pages.csv, query-page-combined.csv, cannibalization-report.csv

Outputs:
  reports/family-divorce-gsc-decision-map-YYYY-MM-DD.csv
  reports/family-divorce-protected-url-decision-map-YYYY-MM-DD.csv
  reports/family-divorce-cannibalization-decision-map-YYYY-MM-DD.csv
  reports/family-divorce-gsc-decision-map-YYYY-MM-DD.json
`);
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
  return `${columns.join(',')}\n${rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n')}\n`;
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
    // Keep encoded variants only.
  }
  return variants;
}

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '')) || 0;
}

function buildMetricMap(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const page = row.page || row.path || '';
    pathVariants(page).forEach((variant) => map.set(variant, row));
  });
  return map;
}

function findMetric(metricMap, itemPath) {
  for (const variant of pathVariants(itemPath)) {
    if (metricMap.has(variant)) return metricMap.get(variant);
  }
  return null;
}

function resolveInputFiles(gscDir) {
  const focused = {
    pages: path.join(gscDir, 'family-divorce-pages.csv'),
    queryPage: path.join(gscDir, 'family-divorce-query-page.csv'),
    cannibalization: path.join(gscDir, 'family-divorce-cannibalization.csv'),
  };
  if (existsSync(focused.pages) || existsSync(focused.queryPage) || existsSync(focused.cannibalization)) {
    return {
      mode: 'FOCUSED_GSC_EXPORT',
      pages: focused.pages,
      queryPage: focused.queryPage,
      cannibalization: focused.cannibalization,
    };
  }

  return {
    mode: 'FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL',
    pages: path.join(gscDir, 'performance-pages.csv'),
    queryPage: path.join(gscDir, 'query-page-combined.csv'),
    cannibalization: path.join(gscDir, 'cannibalization-report.csv'),
  };
}

function riskFromMetrics(row, liveStatus) {
  const clicks = numberValue(row?.clicks);
  const impressions = numberValue(row?.impressions);
  if (liveStatus === 'CONFLICT' && (clicks > 0 || impressions >= 50)) return 'HIGH';
  if (liveStatus === 'CONFLICT') return 'MEDIUM';
  if (clicks > 0 || impressions >= 100) return 'HIGH';
  if (impressions > 0) return 'MEDIUM';
  return 'LOW_UNKNOWN';
}

function actionForProtected(row, metric) {
  const group = row.group || '';
  const liveStatus = row.status || '';
  const clicks = numberValue(metric?.clicks);
  const impressions = numberValue(metric?.impressions);

  if (group === 'protected_asset') {
    return 'KEEP_ASSET_LIVE_NO_REDIRECT';
  }
  if (liveStatus === 'CONFLICT') {
    return clicks > 0 || impressions > 0
      ? 'RESTORE_OR_TARGETED_301_REVIEW_AFTER_FOCUSED_GSC'
      : 'REVIEW_HOME_REDIRECT_BEFORE_ANY_RETIREMENT';
  }
  if (clicks > 0 || impressions >= 100) {
    return 'KEEP_LIVE_OR_301_ONLY_AFTER_APPROVAL';
  }
  return 'KEEP_LIVE_NOW_REVIEW_AFTER_FOCUSED_GSC';
}

function buildProtectedRows(liveRows, pageMetricMap) {
  return liveRows
    .filter((row) => row.group === 'protected_source' || row.group === 'protected_asset')
    .map((row) => {
      const normalized = normalizePath(row.path);
      const metric = findMetric(pageMetricMap, normalized);
      const mappedTarget = SOURCE_TARGET_MAP.get(normalized) || SOURCE_TARGET_MAP.get(normalized.replace(/\/$/, '')) || '';
      return {
        group: row.group,
        path: normalized,
        mapped_target: mappedTarget,
        live_status: row.status,
        final_path: normalizePath(row.finalPath || row.finalUrl || ''),
        gsc_clicks: metric ? metric.clicks : '0',
        gsc_impressions: metric ? metric.impressions : '0',
        gsc_position: metric ? metric.position : '',
        risk: riskFromMetrics(metric, row.status),
        proposed_action: actionForProtected(row, metric),
        required_before_action: row.status === 'CONFLICT'
          ? 'focused_gsc_export; restore_or_confirm_redirect_source; owner_approval'
          : 'focused_gsc_export; owner_approval_before_redirect_or_retirement',
        status: metric ? 'GSC_ROW_FOUND' : 'NO_GSC_ROW_IN_INPUT',
      };
    });
}

function buildTargetRows(liveRows, pageMetricMap) {
  return TARGET_PATHS.map((target) => {
    const live = liveRows.find((row) => normalizePath(row.path) === target) || {};
    const metric = findMetric(pageMetricMap, target);
    return {
      group: 'clean_target',
      path: target,
      mapped_target: target,
      live_status: live.status || 'MISSING',
      final_path: normalizePath(live.finalPath || live.finalUrl || ''),
      gsc_clicks: metric ? metric.clicks : '0',
      gsc_impressions: metric ? metric.impressions : '0',
      gsc_position: metric ? metric.position : '',
      risk: riskFromMetrics(metric, live.status || ''),
      proposed_action: 'UPDATE_EXISTING_PAGE_ONLY_AFTER_APPROVAL_NO_URL_CHANGE',
      required_before_action: 'owner_legal_source_approval; wordpress_backup',
      status: metric ? 'GSC_ROW_FOUND' : 'NO_GSC_ROW_IN_INPUT',
    };
  });
}

function rowContainsKnownPath(row) {
  const haystack = [row.page, row.path, row.pages].filter(Boolean).join(' ');
  const knownPaths = [...TARGET_PATHS, ...SOURCE_TARGET_MAP.keys()];
  return knownPaths.some((knownPath) => {
    for (const variant of pathVariants(knownPath)) {
      if (variant && haystack.includes(variant)) return true;
    }
    return false;
  });
}

function buildCannibalizationRows(rows) {
  return rows
    .filter(rowContainsKnownPath)
    .map((row) => ({
      query: row.query || '',
      page_count: row.page_count || '',
      total_clicks: row.total_clicks || row.clicks || '0',
      total_impressions: row.total_impressions || row.impressions || '0',
      pages: row.pages || row.page || '',
      positions: row.positions || row.position || '',
      risk: numberValue(row.total_clicks || row.clicks) > 0 || numberValue(row.total_impressions || row.impressions) >= 100
        ? 'HIGH'
        : 'MEDIUM_OR_UNKNOWN',
      proposed_action: 'REVIEW_BEFORE_REDIRECT_CANONICAL_NOINDEX_OR_MERGE',
      status: 'NOT_FINAL_UNTIL_FOCUSED_GSC_EXPORT_REVIEWED',
    }));
}

function buildCannibalizationRowsFromQueryPage(rows) {
  const grouped = new Map();
  rows.filter(rowContainsKnownPath).forEach((row) => {
    const query = row.query || '';
    if (!query) return;
    if (!grouped.has(query)) grouped.set(query, []);
    grouped.get(query).push(row);
  });

  return [...grouped.entries()]
    .map(([query, items]) => {
      const pages = [...new Set(items.map((item) => item.page || item.path).filter(Boolean))];
      if (pages.length < 2) return null;
      const totalClicks = items.reduce((sum, item) => sum + numberValue(item.clicks), 0);
      const totalImpressions = items.reduce((sum, item) => sum + numberValue(item.impressions), 0);
      return {
        query,
        page_count: pages.length,
        total_clicks: totalClicks,
        total_impressions: totalImpressions,
        pages: pages.join(' | '),
        positions: items.map((item) => `${item.page || item.path}=${item.position || ''}`).join(' | '),
        risk: totalClicks > 0 || totalImpressions >= 100 ? 'HIGH' : 'MEDIUM_OR_UNKNOWN',
        proposed_action: 'REVIEW_BEFORE_REDIRECT_CANONICAL_NOINDEX_OR_MERGE',
        status: 'NOT_FINAL_UNTIL_FOCUSED_GSC_EXPORT_REVIEWED',
      };
    })
    .filter(Boolean);
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = buildFiles(args.reportDate, args.livePreupload);
  const inputs = resolveInputFiles(args.gscDir);
  const liveRows = readCsv(files.livePreupload);
  const pageRows = readCsv(inputs.pages);
  const cannibalizationInputRows = readCsv(inputs.cannibalization);
  const queryPageRows = readCsv(inputs.queryPage);

  const pageMetricMap = buildMetricMap(pageRows);
  const protectedRows = buildProtectedRows(liveRows, pageMetricMap);
  const targetRows = buildTargetRows(liveRows, pageMetricMap);
  const cannibalizationRows = cannibalizationInputRows.length
    ? buildCannibalizationRows(cannibalizationInputRows)
    : buildCannibalizationRowsFromQueryPage(queryPageRows);
  const decisionRows = [...targetRows, ...protectedRows];

  writeCsv(files.outputCsv, decisionRows, [
    'group',
    'path',
    'mapped_target',
    'live_status',
    'final_path',
    'gsc_clicks',
    'gsc_impressions',
    'gsc_position',
    'risk',
    'proposed_action',
    'required_before_action',
    'status',
  ]);
  writeCsv(files.protectedCsv, protectedRows, [
    'group',
    'path',
    'mapped_target',
    'live_status',
    'final_path',
    'gsc_clicks',
    'gsc_impressions',
    'gsc_position',
    'risk',
    'proposed_action',
    'required_before_action',
    'status',
  ]);
  writeCsv(files.cannibalizationCsv, cannibalizationRows, [
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
    livePreupload: path.relative(ROOT, files.livePreupload),
    targetRows: targetRows.length,
    protectedRows: protectedRows.length,
    protectedConflicts: protectedRows.filter((row) => row.live_status === 'CONFLICT').length,
    protectedHighRisk: protectedRows.filter((row) => row.risk === 'HIGH').length,
    cannibalizationRows: cannibalizationRows.length,
    finality: inputs.mode === 'FOCUSED_GSC_EXPORT'
      ? 'READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION'
      : 'NOT_FINAL_BASELINE_FROM_EXISTING_CACHE_RUN_FOCUSED_GSC_EXPORT_NEXT',
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
  console.log(`Protected rows: ${summary.protectedRows}`);
  console.log(`Protected conflicts: ${summary.protectedConflicts}`);
  console.log(`Cannibalization rows: ${summary.cannibalizationRows}`);
}

main();
