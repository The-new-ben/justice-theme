import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function findLatestReportFile(pattern) {
  const reportsDir = path.join(ROOT, '.reports');
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

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
    input: process.env.FAMILY_DIVORCE_PROTECTED_DECISION_CSV || '',
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--input=')) args.input = arg.slice('--input='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  const sameDateInput = path.join(ROOT, '.reports', `family-divorce-protected-url-decision-map-${args.reportDate}.csv`);
  args.input = args.input
    ? path.resolve(args.input)
    : existsSync(sameDateInput)
      ? sameDateInput
      : findLatestReportFile(/^family-divorce-protected-url-decision-map-\d{4}-\d{2}-\d{2}\.csv$/);
  if (!args.input || !existsSync(args.input)) {
    throw new Error('No family-divorce-protected-url-decision-map-YYYY-MM-DD.csv input found; pass --input=path');
  }
  return args;
}

function buildFiles(reportDate) {
  return {
    reportCsv: path.join(ROOT, '.reports', `family-divorce-protected-url-owner-review-packet-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `family-divorce-protected-url-owner-review-packet-${reportDate}.json`),
    projectCsv: path.join(ROOT, '.project-control', `family-divorce-protected-url-owner-review-packet-${reportDate}.csv`),
  };
}

function printHelp() {
  console.log(`Family/Divorce protected URL owner review packet

Usage:
  node tools/build-family-divorce-protected-url-review-packet.mjs
  node tools/build-family-divorce-protected-url-review-packet.mjs --reportDate=YYYY-MM-DD --input=.reports/family-divorce-protected-url-decision-map-YYYY-MM-DD.csv

Inputs:
  .reports/family-divorce-protected-url-decision-map-YYYY-MM-DD.csv

Outputs:
  .reports/family-divorce-protected-url-owner-review-packet-YYYY-MM-DD.csv
  .reports/family-divorce-protected-url-owner-review-packet-YYYY-MM-DD.json
  .project-control/family-divorce-protected-url-owner-review-packet-YYYY-MM-DD.csv
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
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
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

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '')) || 0;
}

function priority(row) {
  if (row.live_status === 'CONFLICT') return 'P0_RESTORE_OR_TARGETED_301_REVIEW';
  if (row.group === 'protected_asset') return 'P0_KEEP_ASSET_LIVE';
  if (numberValue(row.gsc_clicks) > 0 || numberValue(row.gsc_impressions) >= 10000) return 'P1_KEEP_LIVE_REVIEW_MERGE_LATER';
  return 'P2_KEEP_LIVE_CONFIRM_AFTER_GSC';
}

function decisionOptions(row) {
  if (row.live_status === 'CONFLICT') {
    return 'RESTORE_CURRENT_URL | TARGETED_301_TO_MAPPED_TARGET | HOLD_FOR_MANUAL_REVIEW';
  }
  if (row.group === 'protected_asset') {
    return 'KEEP_ASSET_LIVE | REPLACE_ASSET_WITH_SAME_URL | HOLD_FOR_MANUAL_REVIEW';
  }
  return 'KEEP_LIVE | MERGE_AND_301_AFTER_APPROVAL | HOLD_FOR_MANUAL_REVIEW';
}

function recommendedDecision(row) {
  if (row.live_status === 'CONFLICT') return 'HOLD_FOR_FOCUSED_GSC_THEN_RESTORE_OR_TARGETED_301';
  if (row.group === 'protected_asset') return 'KEEP_ASSET_LIVE';
  return 'KEEP_LIVE_NOW_REVIEW_MERGE_OR_301_AFTER_FOCUSED_GSC';
}

function operatorBoundary(row) {
  if (row.live_status === 'CONFLICT') {
    return 'Do not create blanket homepage redirect; after focused GSC decide restore source URL or targeted 301 to mapped target';
  }
  if (row.group === 'protected_asset') {
    return 'Do not redirect asset; preserve URL unless owner approves same-URL replacement';
  }
  return 'Do not retire or canonicalize yet; keep live until focused GSC and owner approval';
}

function sortRows(left, right) {
  const priorityRank = {
    P0_RESTORE_OR_TARGETED_301_REVIEW: 0,
    P0_KEEP_ASSET_LIVE: 1,
    P1_KEEP_LIVE_REVIEW_MERGE_LATER: 2,
    P2_KEEP_LIVE_CONFIRM_AFTER_GSC: 3,
  };
  const leftRank = priorityRank[priority(left)] ?? 99;
  const rightRank = priorityRank[priority(right)] ?? 99;
  if (leftRank !== rightRank) return leftRank - rightRank;
  return numberValue(right.gsc_impressions) - numberValue(left.gsc_impressions);
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = buildFiles(args.reportDate);
  const rows = readCsv(args.input).sort(sortRows);
  const packetRows = rows.map((row, index) => ({
    review_id: `FD-PURL-${String(index + 1).padStart(3, '0')}`,
    priority: priority(row),
    group: row.group,
    path: row.path,
    mapped_target: row.mapped_target,
    live_status: row.live_status,
    final_path: row.final_path,
    cached_gsc_clicks: row.gsc_clicks,
    cached_gsc_impressions: row.gsc_impressions,
    cached_gsc_position: row.gsc_position,
    risk: row.risk,
    baseline_action: row.proposed_action,
    recommended_owner_decision: recommendedDecision(row),
    owner_decision_options: decisionOptions(row),
    owner_decision: '',
    owner_notes: '',
    required_before_action: row.required_before_action,
    operator_boundary: operatorBoundary(row),
    review_status: 'BLOCKED_FOCUSED_GSC_EXPORT_REQUIRED',
    baseline_status: 'NOT_FINAL_CACHED_GSC_BASELINE',
  }));

  const columns = [
    'review_id',
    'priority',
    'group',
    'path',
    'mapped_target',
    'live_status',
    'final_path',
    'cached_gsc_clicks',
    'cached_gsc_impressions',
    'cached_gsc_position',
    'risk',
    'baseline_action',
    'recommended_owner_decision',
    'owner_decision_options',
    'owner_decision',
    'owner_notes',
    'required_before_action',
    'operator_boundary',
    'review_status',
    'baseline_status',
  ];

  const csv = toCsv(packetRows, columns);
  mkdirSync(path.dirname(files.reportCsv), { recursive: true });
  mkdirSync(path.dirname(files.projectCsv), { recursive: true });
  writeFileSync(files.reportCsv, csv, 'utf8');
  writeFileSync(files.projectCsv, csv, 'utf8');

  const summary = {
    generatedAt: new Date().toISOString(),
    reportDate: args.reportDate,
    input: path.relative(ROOT, args.input),
    reportCsv: path.relative(ROOT, files.reportCsv),
    projectCsv: path.relative(ROOT, files.projectCsv),
    rowCount: packetRows.length,
    conflictRows: packetRows.filter((row) => row.live_status === 'CONFLICT').length,
    assetRows: packetRows.filter((row) => row.group === 'protected_asset').length,
    highRiskRows: packetRows.filter((row) => row.risk === 'HIGH').length,
    blockedRows: packetRows.filter((row) => row.review_status.includes('BLOCKED')).length,
    priorityCounts: packetRows.reduce((acc, row) => {
      acc[row.priority] = (acc[row.priority] || 0) + 1;
      return acc;
    }, {}),
    finality: 'NOT_FINAL_CACHED_GSC_BASELINE_FOCUSED_EXPORT_REQUIRED',
    safety: 'No public URL, redirect, canonical, noindex, sitemap or CMS change.',
  };
  writeFileSync(files.reportJson, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Wrote ${path.relative(ROOT, files.reportCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.projectCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.reportJson)}`);
  console.log(`Rows: ${summary.rowCount}`);
  console.log(`Conflicts: ${summary.conflictRows}`);
  console.log(`High risk: ${summary.highRiskRows}`);
}

main();
