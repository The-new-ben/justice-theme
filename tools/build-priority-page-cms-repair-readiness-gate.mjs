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
  'ready_rows',
  'current_decision',
  'next_step',
  'blocked_actions',
  'notes',
];

const BLOCKED_PUBLIC_ACTIONS = [
  'NO_PUBLIC_CMS_EDIT',
  'NO_CLEAN_SLUG_CREATION',
  'NO_URL_MIGRATION',
  'NO_REDIRECT',
  'NO_CANONICAL_OR_NOINDEX_CHANGE',
  'NO_SITEMAP_CHANGE',
  'NO_TAXONOMY_CHANGE',
  'NO_INTERNAL_LINK_WRITE',
  'NO_LAWYER_LEAD_CRM_CHANGE',
].join('; ');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || today() };

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
  console.log(`Priority page CMS repair readiness gate

Usage:
  node tools/build-priority-page-cms-repair-readiness-gate.mjs
  node tools/build-priority-page-cms-repair-readiness-gate.mjs --reportDate=YYYY-MM-DD

Inputs:
  project-control/priority-pages-live-readonly-YYYY-MM-DD.csv
  project-control/priority-pages-cms-repair-packet-YYYY-MM-DD.csv
  project-control/priority-pages-cms-rollback-capture-template-YYYY-MM-DD.csv
  project-control/priority-pages-cms-owner-approval-YYYY-MM-DD.csv
  project-control/wp-rest-publisher-safety-YYYY-MM-DD.csv

Outputs:
  reports/priority-pages-cms-repair-readiness-gate-YYYY-MM-DD.csv
  reports/priority-pages-cms-repair-readiness-gate-YYYY-MM-DD.json
  project-control/priority-pages-cms-repair-readiness-gate-YYYY-MM-DD.csv
  project-control/priority-pages-cms-repair-readiness-gate-YYYY-MM-DD.md
`);
}

function files(reportDate) {
  const inputs = {
    liveQa: path.join(ROOT, 'project-control', `priority-pages-live-readonly-${reportDate}.csv`),
    repairPacket: path.join(ROOT, 'project-control', `priority-pages-cms-repair-packet-${reportDate}.csv`),
    rollback: path.join(ROOT, 'project-control', `priority-pages-cms-rollback-capture-template-${reportDate}.csv`),
    approval: path.join(ROOT, 'project-control', `priority-pages-cms-owner-approval-${reportDate}.csv`),
    publisherSafety: path.join(ROOT, 'project-control', `wp-rest-publisher-safety-${reportDate}.csv`),
  };

  const base = `priority-pages-cms-repair-readiness-gate-${reportDate}`;
  return {
    inputs,
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
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
  return [
    row.status,
    row.safety_status,
    row.gate_status,
    row.review_status,
    row.baseline_status,
    row.live_status,
  ].join(' ').toUpperCase();
}

function countWhere(rows, predicate) {
  return rows.filter(predicate).length;
}

function statusCounts(rows) {
  const blocked = countWhere(rows, (row) => /BLOCKED|HOLD|NOT_APPROVED|REQUIRED/.test(statusText(row)));
  const pending = countWhere(rows, (row) => /PENDING/.test(statusText(row)));
  const verified = countWhere(rows, (row) => /VERIFIED|PASS/.test(statusText(row)));
  const ready = countWhere(rows, (row) => /READY/.test(statusText(row)));
  return { blocked, pending, verified, ready };
}

function gateStatus({ blocked = 0, pending = 0, requiredMissing = 0 }) {
  if (requiredMissing) return 'BLOCKED_MISSING_INPUT';
  if (blocked || pending) return 'BLOCKED';
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
}) {
  const counts = statusCounts(rows);
  const missing = sourceFile && !existsSync(sourceFile) ? 1 : 0;
  const blockedRows = counts.blocked + extraBlocked;
  const pendingRows = counts.pending + extraPending;

  return {
    gate_id: gateId,
    lane,
    priority,
    gate_status: gateStatus({ blocked: blockedRows, pending: pendingRows, requiredMissing: missing }),
    source_file: sourceFile ? rel(sourceFile) : '',
    rows_reviewed: rows.length,
    blocked_rows: blockedRows,
    pending_rows: pendingRows,
    verified_rows: counts.verified,
    ready_rows: counts.ready,
    current_decision: currentDecision,
    next_step: nextStep,
    blocked_actions: blockedActions,
    notes,
  };
}

function buildRows(inputFiles) {
  const liveQa = readCsv(inputFiles.liveQa);
  const repairPacket = readCsv(inputFiles.repairPacket);
  const rollback = readCsv(inputFiles.rollback);
  const approval = readCsv(inputFiles.approval);
  const publisherSafety = readCsv(inputFiles.publisherSafety);

  const liveH1Rows = liveQa.filter((row) => row.issues.includes('h1_count_2'));
  const live404Rows = liveQa.filter((row) => String(row.http_status) === '404');
  const ownerPending = approval.filter((row) => statusText(row).includes('OWNER_DECISION_PENDING'));
  const rollbackBlocked = rollback.filter((row) => /BLOCKED|PENDING/.test(statusText(row)));
  const cleanSlugApproval = approval.filter((row) => (
    /medical-malpractice-diagnosis-errors|joint-custody|medication-errors-malpractice|divorce-pension-split/.test(row.target)
  ));
  const publisherUseHold = approval.filter((row) => row.approval_id === 'PPR-APPROVAL-005');

  return [
    makeRow({
      gateId: 'PPR-GATE-001',
      lane: 'live_readonly_qa',
      priority: 'CRITICAL',
      sourceFile: inputFiles.liveQa,
      rows: liveQa,
      currentDecision: 'BLOCKED_LIVE_QA_OPEN',
      nextStep: 'Repair only approved duplicate article body H1s after rollback; keep four 404 clean slugs blocked.',
      notes: `${liveH1Rows.length} duplicate-H1 rows and ${live404Rows.length} 404 rows remain in read-only QA.`,
    }),
    makeRow({
      gateId: 'PPR-GATE-002',
      lane: 'repair_packet',
      priority: 'CRITICAL',
      sourceFile: inputFiles.repairPacket,
      rows: repairPacket,
      currentDecision: 'READY_FOR_REVIEW_NOT_EXECUTION',
      nextStep: 'Use packet only after owner approval and rollback capture; do not create clean slugs from packet alone.',
      notes: 'Repair packet separates two article H1 repairs from four blocked clean-slug decisions.',
    }),
    makeRow({
      gateId: 'PPR-GATE-003',
      lane: 'owner_approval',
      priority: 'CRITICAL',
      sourceFile: inputFiles.approval,
      rows: approval,
      currentDecision: 'OWNER_DECISION_PENDING',
      nextStep: 'Owner records approve/hold language before any WordPress editor action.',
      notes: `${ownerPending.length} owner-decision rows remain pending.`,
    }),
    makeRow({
      gateId: 'PPR-GATE-004',
      lane: 'rollback_capture',
      priority: 'CRITICAL',
      sourceFile: inputFiles.rollback,
      rows: rollback,
      currentDecision: 'CMS_ROLLBACK_NOT_CAPTURED',
      nextStep: 'Operator captures actual WordPress rollback material before any approved editor save.',
      notes: `${rollbackBlocked.length} rollback rows are blocked or pending.`,
    }),
    makeRow({
      gateId: 'PPR-GATE-005',
      lane: 'publisher_target_safety',
      priority: 'CRITICAL',
      sourceFile: inputFiles.publisherSafety,
      rows: publisherSafety,
      extraBlocked: publisherUseHold.length,
      currentDecision: 'PAGE_PUBLISHER_HELD_FOR_ARTICLE_REPAIR',
      nextStep: 'Do not use the page publisher to repair article CPT records; use only direct approved article editor repair.',
      notes: `${publisherSafety.length} publisher safety checks exist; page publisher use is held for this repair workflow.`,
    }),
    makeRow({
      gateId: 'PPR-GATE-006',
      lane: 'clean_slug_object_decisions',
      priority: 'CRITICAL',
      sourceFile: inputFiles.approval,
      rows: cleanSlugApproval,
      extraBlocked: cleanSlugApproval.length,
      currentDecision: 'CLEAN_SLUGS_HELD',
      nextStep: 'Run focused GSC/source/legal/cannibalization review before any clean-slug object creation or redirect.',
      notes: `${cleanSlugApproval.length} clean-slug object decisions remain held.`,
    }),
    makeRow({
      gateId: 'PPR-GATE-007',
      lane: 'post_repair_qa',
      priority: 'CRITICAL',
      sourceFile: '',
      rows: [],
      extraBlocked: 1,
      currentDecision: 'BLOCKED_UNTIL_PUBLIC_REPAIR',
      nextStep: 'After approved repair, rerun priority live checker and capture screenshots where available.',
      notes: 'No post-repair verification can be marked complete until a public approved repair exists.',
    }),
  ];
}

function buildSummary(rows, reportDate) {
  const blockedRows = rows.filter((row) => row.gate_status !== 'VERIFIED');
  const totalReviewed = rows.reduce((sum, row) => sum + Number(row.rows_reviewed || 0), 0);
  const totalBlocked = rows.reduce((sum, row) => sum + Number(row.blocked_rows || 0), 0);
  const totalPending = rows.reduce((sum, row) => sum + Number(row.pending_rows || 0), 0);

  return {
    reportDate,
    overallStatus: blockedRows.length ? 'BLOCKED_NOT_READY_FOR_PUBLIC_CMS_REPAIR' : 'VERIFIED_READY_FOR_OWNER_REVIEW',
    gateRows: rows.length,
    blockedGateRows: blockedRows.length,
    totalReviewed,
    totalBlocked,
    totalPending,
    readinessEstimate: blockedRows.length
      ? 'Priority-page repair workflow is procedurally mapped but not approved for public execution.'
      : 'Priority-page repair gates passed.',
    nextStep: 'Owner approval, actual CMS rollback capture, two article H1 repairs and post-repair QA remain the required path.',
  };
}

function buildMarkdown(summary, rows) {
  const table = rows.map((row) => (
    `| ${row.gate_id} | ${row.lane} | ${row.priority} | ${row.gate_status} | ${row.rows_reviewed} | ${row.blocked_rows} | ${row.pending_rows} | ${row.next_step.replace(/\|/g, '/')} |`
  )).join('\n');

  return `# Priority Pages CMS Repair Readiness Gate - ${summary.reportDate}

Status: ${summary.overallStatus} / NO PUBLIC CHANGES

## Summary

- VERIFIED LOCAL: consolidated ${summary.gateRows} gate rows from live QA, repair packet, owner approval, rollback capture and publisher safety artifacts.
- BLOCKED: ${summary.blockedGateRows}/${summary.gateRows} gate rows are not verified.
- REVIEWED: ${summary.totalReviewed} source rows across the input CSVs.
- BLOCKED/PENDING COUNTS: ${summary.totalBlocked} blocked markers and ${summary.totalPending} pending markers.
- READINESS: ${summary.readinessEstimate}
- NEXT: ${summary.nextStep}

## Gate Rows

| Gate | Lane | Priority | Status | Rows reviewed | Blocked | Pending | Next step |
|---|---|---|---|---:|---:|---:|---|
${table}

## Output Files

- \`reports/priority-pages-cms-repair-readiness-gate-${summary.reportDate}.csv\`
- \`reports/priority-pages-cms-repair-readiness-gate-${summary.reportDate}.json\`
- \`project-control/priority-pages-cms-repair-readiness-gate-${summary.reportDate}.csv\`
- \`project-control/priority-pages-cms-repair-readiness-gate-${summary.reportDate}.md\`

## Safety

This is a repo-only generated readiness gate. No public CMS page/article body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
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
