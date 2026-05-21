import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const TODAY = '2026-05-21';

const INPUT = path.join(ROOT, 'reports', 'family-divorce-protected-url-decision-map-2026-05-21.csv');
const REPORT_CSV = path.join(ROOT, 'reports', `family-divorce-protected-url-owner-review-packet-${TODAY}.csv`);
const REPORT_JSON = path.join(ROOT, 'reports', `family-divorce-protected-url-owner-review-packet-${TODAY}.json`);
const PROJECT_CSV = path.join(ROOT, 'project-control', `family-divorce-protected-url-owner-review-packet-${TODAY}.csv`);

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
  const rows = readCsv(INPUT).sort(sortRows);
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
  mkdirSync(path.dirname(REPORT_CSV), { recursive: true });
  mkdirSync(path.dirname(PROJECT_CSV), { recursive: true });
  writeFileSync(REPORT_CSV, csv, 'utf8');
  writeFileSync(PROJECT_CSV, csv, 'utf8');

  const summary = {
    generatedAt: new Date().toISOString(),
    input: path.relative(ROOT, INPUT),
    reportCsv: path.relative(ROOT, REPORT_CSV),
    projectCsv: path.relative(ROOT, PROJECT_CSV),
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
  writeFileSync(REPORT_JSON, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Wrote ${path.relative(ROOT, REPORT_CSV)}`);
  console.log(`Wrote ${path.relative(ROOT, PROJECT_CSV)}`);
  console.log(`Wrote ${path.relative(ROOT, REPORT_JSON)}`);
  console.log(`Rows: ${summary.rowCount}`);
  console.log(`Conflicts: ${summary.conflictRows}`);
  console.log(`High risk: ${summary.highRiskRows}`);
}

main();
