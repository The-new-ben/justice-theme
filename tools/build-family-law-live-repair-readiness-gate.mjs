import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const COLUMNS = [
  'gate_id',
  'lane',
  'priority',
  'gate_status',
  'source_file',
  'rows_reviewed',
  'blocked_rows',
  'pending_rows',
  'verified_rows',
  'not_verified_rows',
  'ready_rows',
  'current_decision',
  'next_step',
  'blocked_actions',
  'notes',
];

const BLOCKED_PUBLIC_ACTIONS = [
  'NO_PUBLIC_CMS_EDIT',
  'NO_URL_MIGRATION',
  'NO_REDIRECT',
  'NO_CANONICAL_OR_NOINDEX_CHANGE',
  'NO_SITEMAP_CHANGE',
  'NO_TAXONOMY_CHANGE',
  'NO_RELATED_CARD_WRITE',
  'NO_PROTECTED_ASSET_CHANGE',
  'NO_LAWYER_LEAD_CRM_CHANGE',
].join('; ');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || today(),
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function printHelp() {
  console.log(`Family Law live repair readiness gate

Usage:
  node tools/build-family-law-live-repair-readiness-gate.mjs
  node tools/build-family-law-live-repair-readiness-gate.mjs --reportDate=YYYY-MM-DD

Inputs:
  .project-control/family-law-live-safety-check-YYYY-MM-DD.csv
  .project-control/family-law-live-repair-diagnostics-YYYY-MM-DD.csv
  .project-control/family-law-visible-repair-field-map-YYYY-MM-DD.csv
  .project-control/family-law-live-repair-cms-backup-template-YYYY-MM-DD.csv
  .project-control/family-law-live-repair-owner-approval-YYYY-MM-DD.csv
  .project-control/family-law-live-repair-operator-packet-YYYY-MM-DD.csv
  .project-control/family-divorce-protected-url-owner-review-packet-YYYY-MM-DD.csv

Outputs:
  .reports/family-law-live-repair-readiness-gate-YYYY-MM-DD.csv
  .reports/family-law-live-repair-readiness-gate-YYYY-MM-DD.json
  .project-control/family-law-live-repair-readiness-gate-YYYY-MM-DD.csv
  .project-control/family-law-live-repair-readiness-gate-YYYY-MM-DD.md
`);
}

function files(reportDate) {
  const inputs = {
    safety: path.join(ROOT, '.project-control', `family-law-live-safety-check-${reportDate}.csv`),
    diagnostics: path.join(ROOT, '.project-control', `family-law-live-repair-diagnostics-${reportDate}.csv`),
    fieldMap: path.join(ROOT, '.project-control', `family-law-visible-repair-field-map-${reportDate}.csv`),
    backup: path.join(ROOT, '.project-control', `family-law-live-repair-cms-backup-template-${reportDate}.csv`),
    approval: path.join(ROOT, '.project-control', `family-law-live-repair-owner-approval-${reportDate}.csv`),
    operatorPacket: path.join(ROOT, '.project-control', `family-law-live-repair-operator-packet-${reportDate}.csv`),
    protectedUrls: path.join(ROOT, '.project-control', `family-divorce-protected-url-owner-review-packet-${reportDate}.csv`),
  };

  const base = `family-law-live-repair-readiness-gate-${reportDate}`;
  return {
    inputs,
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
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

function writeText(filePath, contents) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents, 'utf8');
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function statusText(row) {
  return String(row.status || row.review_status || row.baseline_status || '').toUpperCase();
}

function countWhere(rows, predicate) {
  return rows.filter(predicate).length;
}

function statusCounts(rows) {
  const blocked = countWhere(rows, (row) => /BLOCKED|HOLD|NOT_APPROVED|REQUIRED/.test(statusText(row)));
  const pending = countWhere(rows, (row) => /PENDING/.test(statusText(row)));
  const verified = countWhere(rows, (row) => /VERIFIED|PASS|READY_FOR_OPERATOR_PREP|READY_FOR_OWNER/.test(statusText(row)));
  const ready = countWhere(rows, (row) => /READY/.test(statusText(row)));
  const notVerified = countWhere(rows, (row) => /NOT_FINAL|NOT VERIFIED|NOT_VERIFIED/.test(statusText(row)));
  return { blocked, pending, verified, ready, notVerified };
}

function gateStatus({ blocked = 0, pending = 0, notVerified = 0, requiredMissing = 0 }) {
  if (requiredMissing) return 'BLOCKED_MISSING_INPUT';
  if (blocked || pending || notVerified) return 'BLOCKED';
  return 'VERIFIED';
}

function makeRow({
  gateId,
  lane,
  priority,
  sourceFile,
  rows,
  currentDecision,
  nextStep,
  blockedActions = BLOCKED_PUBLIC_ACTIONS,
  notes,
  extraBlocked = 0,
  extraPending = 0,
  extraNotVerified = 0,
}) {
  const counts = statusCounts(rows);
  const missing = sourceFile && !existsSync(sourceFile) ? 1 : 0;
  const blockedRows = counts.blocked + extraBlocked;
  const pendingRows = counts.pending + extraPending;
  const notVerifiedRows = counts.notVerified + extraNotVerified;
  return {
    gate_id: gateId,
    lane,
    priority,
    gate_status: gateStatus({
      blocked: blockedRows,
      pending: pendingRows,
      notVerified: notVerifiedRows,
      requiredMissing: missing,
    }),
    source_file: sourceFile ? rel(sourceFile) : '',
    rows_reviewed: rows.length,
    blocked_rows: blockedRows,
    pending_rows: pendingRows,
    verified_rows: counts.verified,
    not_verified_rows: notVerifiedRows,
    ready_rows: counts.ready,
    current_decision: currentDecision,
    next_step: nextStep,
    blocked_actions: blockedActions,
    notes,
  };
}

function buildRows(inputFiles) {
  const safety = readCsv(inputFiles.safety);
  const diagnostics = readCsv(inputFiles.diagnostics);
  const fieldMap = readCsv(inputFiles.fieldMap);
  const backup = readCsv(inputFiles.backup);
  const approval = readCsv(inputFiles.approval);
  const operatorPacket = readCsv(inputFiles.operatorPacket);
  const protectedUrls = readCsv(inputFiles.protectedUrls);

  const criticalSafety = safety.filter((row) => row.risk === 'CRITICAL' && row.status !== 'VERIFIED');
  const h1Issues = diagnostics.filter((row) => /h1_count_/.test(row.issues || ''));
  const shortcodeIssues = diagnostics.filter((row) => /raw_shortcode/.test(row.issues || ''));
  const pdfIssues = diagnostics.filter((row) => row.row_type === 'pdf_candidate' && String(row.http_status) !== '200');
  const ownerPending = approval.filter((row) => statusText(row).includes('OWNER_DECISION_PENDING'));
  const backupPending = backup.filter((row) => /BLOCKED_PENDING|BLOCKED_GSC/.test(statusText(row)));
  const protectedBlocked = protectedUrls.filter((row) => /BLOCKED|NOT_FINAL|HIGH|CONFLICT/.test([
    row.review_status,
    row.baseline_status,
    row.risk,
    row.live_status,
  ].join(' ').toUpperCase()));

  return [
    makeRow({
      gateId: 'FLR-GATE-001',
      lane: 'live_safety',
      priority: 'CRITICAL',
      sourceFile: inputFiles.safety,
      rows: safety,
      extraBlocked: criticalSafety.length,
      currentDecision: 'BLOCKED_LIVE_DEFECTS_PRESENT',
      nextStep: 'Repair current-URL visible defects only after owner approval and CMS rollback backup; rerun safety checker.',
      notes: `${safety.length} safety rows reviewed; ${criticalSafety.length} critical rows are not verified.`,
    }),
    makeRow({
      gateId: 'FLR-GATE-002',
      lane: 'live_diagnostics',
      priority: 'CRITICAL',
      sourceFile: inputFiles.diagnostics,
      rows: diagnostics,
      extraBlocked: h1Issues.length + shortcodeIssues.length + pdfIssues.length,
      currentDecision: 'BLOCKED_DIAGNOSTIC_ISSUES_PRESENT',
      nextStep: 'Use exact diagnostics for H1 demotion, shortcode repair and PDF decision after approval.',
      notes: `${h1Issues.length} H1 issue rows; ${shortcodeIssues.length} raw-shortcode rows; ${pdfIssues.length} PDF candidate failures.`,
    }),
    makeRow({
      gateId: 'FLR-GATE-003',
      lane: 'field_map',
      priority: 'CRITICAL',
      sourceFile: inputFiles.fieldMap,
      rows: fieldMap,
      currentDecision: 'READY_FOR_REVIEW_NOT_EXECUTION',
      nextStep: 'Use field map only after owner approval and CMS backup; preserve current URLs and SEO fields.',
      notes: 'Exact H1, shortcode and PDF handling instructions exist, but execution remains blocked.',
    }),
    makeRow({
      gateId: 'FLR-GATE-004',
      lane: 'owner_approval',
      priority: 'CRITICAL',
      sourceFile: inputFiles.approval,
      rows: approval,
      extraPending: ownerPending.length,
      currentDecision: 'OWNER_DECISION_PENDING',
      nextStep: 'Owner records APPROVE_VISIBLE_REPAIR_ONLY or HOLD_PUBLIC_REPAIR; SEO consolidation remains HOLD_PENDING_GSC.',
      notes: `${ownerPending.length} owner-decision rows still pending.`,
    }),
    makeRow({
      gateId: 'FLR-GATE-005',
      lane: 'cms_backup',
      priority: 'CRITICAL',
      sourceFile: inputFiles.backup,
      rows: backup,
      extraBlocked: backupPending.length,
      currentDecision: 'CMS_ROLLBACK_NOT_CAPTURED',
      nextStep: 'Operator captures actual WordPress rollback material before any approved editor save.',
      notes: `${backupPending.length} backup or rollback rows remain blocked/pending.`,
    }),
    makeRow({
      gateId: 'FLR-GATE-006',
      lane: 'operator_packet',
      priority: 'CRITICAL',
      sourceFile: inputFiles.operatorPacket,
      rows: operatorPacket,
      currentDecision: 'READY_FOR_OPERATOR_PREP_NOT_EXECUTION',
      nextStep: 'After owner approval and CMS backup, repair only approved visible defects and rerun live QA.',
      notes: 'The operator packet is prepared, but most execution rows are intentionally blocked.',
    }),
    makeRow({
      gateId: 'FLR-GATE-007',
      lane: 'gsc_seo_consolidation',
      priority: 'CRITICAL',
      sourceFile: inputFiles.protectedUrls,
      rows: protectedUrls,
      extraBlocked: protectedBlocked.length,
      currentDecision: 'HOLD_PENDING_FOCUSED_GSC',
      nextStep: 'Run focused Family/Divorce GSC export before protected URL, redirect, canonical, noindex or sitemap decisions.',
      notes: `${protectedBlocked.length} protected URL rows remain blocked/not-final/high-risk in cached baseline.`,
    }),
    makeRow({
      gateId: 'FLR-GATE-008',
      lane: 'post_repair_qa',
      priority: 'CRITICAL',
      sourceFile: '',
      rows: [],
      extraBlocked: 1,
      currentDecision: 'BLOCKED_UNTIL_PUBLIC_REPAIR',
      nextStep: 'After approved repair, rerun safety and diagnostics scripts and capture desktop/mobile screenshots.',
      notes: 'No post-repair verification can be marked complete until a public approved repair exists.',
    }),
  ];
}

function buildSummary(rows, reportDate) {
  const blockedRows = rows.filter((row) => row.gate_status !== 'VERIFIED');
  const totalReviewed = rows.reduce((sum, row) => sum + Number(row.rows_reviewed || 0), 0);
  const totalBlocked = rows.reduce((sum, row) => sum + Number(row.blocked_rows || 0), 0);
  const totalPending = rows.reduce((sum, row) => sum + Number(row.pending_rows || 0), 0);
  const totalNotVerified = rows.reduce((sum, row) => sum + Number(row.not_verified_rows || 0), 0);

  return {
    reportDate,
    overallStatus: blockedRows.length ? 'BLOCKED_NOT_READY_FOR_CONTENT_UPLOAD' : 'VERIFIED_READY_FOR_REVIEW',
    gateRows: rows.length,
    blockedGateRows: blockedRows.length,
    totalReviewed,
    totalBlocked,
    totalPending,
    totalNotVerified,
    readinessEstimate: blockedRows.length ? 'Family/Divorce live repair package is procedurally prepared but not upload-safe.' : 'Family/Divorce repair gates passed.',
    nextStep: 'Owner approval, actual CMS rollback backup, visible current-URL repair, focused GSC export and post-repair QA remain the required path.',
  };
}

function buildMarkdown(summary, rows) {
  const table = rows.map((row) => (
    `| ${row.gate_id} | ${row.lane} | ${row.priority} | ${row.gate_status} | ${row.rows_reviewed} | ${row.blocked_rows} | ${row.pending_rows} | ${row.next_step.replace(/\|/g, '/')} |`
  )).join('\n');

  return `# Family Law Live Repair Readiness Gate - ${summary.reportDate}

Status: ${summary.overallStatus} / NO PUBLIC CHANGES

## Summary

- VERIFIED LOCAL: consolidated ${summary.gateRows} gate rows from live safety, diagnostics, field map, owner approval, CMS backup, operator packet and protected URL review artifacts.
- BLOCKED: ${summary.blockedGateRows}/${summary.gateRows} gate rows are not verified.
- REVIEWED: ${summary.totalReviewed} source rows across the input CSVs.
- BLOCKED/PENDING COUNTS: ${summary.totalBlocked} blocked markers, ${summary.totalPending} pending markers and ${summary.totalNotVerified} not-final/not-verified markers.
- READINESS: ${summary.readinessEstimate}
- NEXT: ${summary.nextStep}

## Gate Rows

| Gate | Lane | Priority | Status | Rows reviewed | Blocked | Pending | Next step |
|---|---|---|---|---:|---:|---:|---|
${table}

## Output Files

- \`.reports/family-law-live-repair-readiness-gate-${summary.reportDate}.csv\`
- \`.reports/family-law-live-repair-readiness-gate-${summary.reportDate}.json\`
- \`.project-control/family-law-live-repair-readiness-gate-${summary.reportDate}.csv\`
- \`.project-control/family-law-live-repair-readiness-gate-${summary.reportDate}.md\`

## Safety

This is a repo-only generated readiness gate. No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const output = files(args.reportDate);
  const missing = Object.values(output.inputs).filter((filePath) => !existsSync(filePath));
  if (missing.length) {
    throw new Error(`Missing required input files:\n${missing.map((filePath) => `- ${rel(filePath)}`).join('\n')}`);
  }

  const rows = buildRows(output.inputs);
  const summary = buildSummary(rows, args.reportDate);
  const json = { summary, rows };

  writeText(output.reportCsv, toCsv(rows, COLUMNS));
  writeText(output.projectCsv, toCsv(rows, COLUMNS));
  writeText(output.reportJson, `${JSON.stringify(json, null, 2)}\n`);
  writeText(output.projectMd, buildMarkdown(summary, rows));

  console.log(JSON.stringify(summary, null, 2));
}

main();
