import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const COLUMNS = [
  'action_id',
  'sequence',
  'cluster',
  'owner_action',
  'priority',
  'status',
  'source_file',
  'source_rows',
  'blocked_or_pending_rows',
  'ready_or_verified_rows',
  'required_before_progress',
  'unblocks',
  'blocked_public_actions',
  'next_step',
  'notes',
];

const PUBLIC_BLOCKS = [
  'NO_CMS_UPLOAD',
  'NO_PUBLIC_CMS_EDIT',
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
  console.log(`Priority owner action queue

Usage:
  node tools/build-priority-owner-action-queue.mjs
  node tools/build-priority-owner-action-queue.mjs --reportDate=YYYY-MM-DD

Outputs:
  reports/priority-owner-action-queue-YYYY-MM-DD.csv
  reports/priority-owner-action-queue-YYYY-MM-DD.json
  project-control/priority-owner-action-queue-YYYY-MM-DD.csv
  project-control/priority-owner-action-queue-YYYY-MM-DD.md
`);
}

function files(reportDate) {
  const pc = path.join(ROOT, 'project-control');
  const reports = path.join(ROOT, 'reports');
  const base = `priority-owner-action-queue-${reportDate}`;
  return {
    inputs: {
      gscPriority: path.join(pc, `gsc-priority-cluster-export-runner-${reportDate}.csv`),
      familyGate: path.join(pc, `family-law-live-repair-readiness-gate-${reportDate}.csv`),
      familyApproval: path.join(pc, `family-law-live-repair-owner-approval-${reportDate}.csv`),
      familyBackup: path.join(pc, `family-law-live-repair-cms-backup-template-${reportDate}.csv`),
      criminalOwner: path.join(pc, `criminal-owner-review-packet-${reportDate}.csv`),
      criminalMetadata: path.join(pc, `criminal-first-upload-metadata-package-${reportDate}.csv`),
      criminalGsc: path.join(pc, `criminal-gsc-decision-map-${reportDate}.csv`),
      medicalOwner: path.join(pc, `medical-malpractice-owner-decision-packet-${reportDate}.csv`),
      medicalRunbook: path.join(pc, `medical-malpractice-cms-identity-operator-runbook-${reportDate}.csv`),
      medicalSource: path.join(pc, `medical-malpractice-source-legal-review-worksheet-${reportDate}.csv`),
    },
    reportCsv: path.join(reports, `${base}.csv`),
    reportJson: path.join(reports, `${base}.json`),
    projectCsv: path.join(pc, `${base}.csv`),
    projectMd: path.join(pc, `${base}.md`),
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
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((header, index) => (
    index === 0 ? header.replace(/^\uFEFF/, '') : header
  ));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`${rel(filePath)}: expected ${headers.length} columns, got ${values.length}`);
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
    row.review_status,
    row.gate_status,
    row.owner_decision_status,
    row.upload_readiness,
    row.approval_status,
    row.public_changes_allowed,
    row.current_decision,
  ].filter(Boolean).join(' ').toUpperCase();
}

function countStatus(rows, pattern) {
  return rows.filter((row) => pattern.test(statusText(row))).length;
}

function stats(rows) {
  return {
    blockedOrPending: countStatus(rows, /BLOCKED|PENDING|HOLD|NOT_APPROVED|REQUIRED|NOT_FINAL/),
    readyOrVerified: countStatus(rows, /READY|VERIFIED|FIXED|APPROVE/),
  };
}

function makeAction({
  id,
  sequence,
  cluster,
  ownerAction,
  priority = 'P0',
  status,
  sourceFile,
  rows,
  required,
  unblocks,
  nextStep,
  notes,
  blockedActions = PUBLIC_BLOCKS,
}) {
  const sourceStats = stats(rows);
  return {
    action_id: id,
    sequence,
    cluster,
    owner_action: ownerAction,
    priority,
    status,
    source_file: sourceFile ? rel(sourceFile) : '',
    source_rows: rows.length,
    blocked_or_pending_rows: sourceStats.blockedOrPending,
    ready_or_verified_rows: sourceStats.readyOrVerified,
    required_before_progress: required,
    unblocks,
    blocked_public_actions: blockedActions,
    next_step: nextStep,
    notes,
  };
}

function buildRows(inputFiles) {
  const gscPriority = readCsv(inputFiles.gscPriority);
  const familyGate = readCsv(inputFiles.familyGate);
  const familyApproval = readCsv(inputFiles.familyApproval);
  const familyBackup = readCsv(inputFiles.familyBackup);
  const criminalOwner = readCsv(inputFiles.criminalOwner);
  const criminalMetadata = readCsv(inputFiles.criminalMetadata);
  const criminalGsc = readCsv(inputFiles.criminalGsc);
  const medicalOwner = readCsv(inputFiles.medicalOwner);
  const medicalRunbook = readCsv(inputFiles.medicalRunbook);
  const medicalSource = readCsv(inputFiles.medicalSource);

  return [
    makeAction({
      id: 'OWNER-ACTION-001',
      sequence: 1,
      cluster: 'all_priority_clusters',
      ownerAction: 'Complete read-only GSC OAuth setup outside Git',
      status: 'BLOCKED_OWNER_SETUP',
      sourceFile: inputFiles.gscPriority,
      rows: gscPriority,
      required: 'OAuth Desktop JSON saved outside repo; token path outside repo; owner approves read-only Search Console OAuth prompt',
      unblocks: 'Focused GSC exports for Family/Divorce, Criminal Law and Medical Malpractice',
      nextStep: 'Set GSC_OAUTH_CLIENT_PATH and GSC_TOKEN_PATH, then run tools/gsc/run-priority-cluster-gsc-exports.ps1',
      notes: 'This is the highest leverage owner action because it unblocks protected URL, cannibalization, redirect, canonical and sitemap decisions across three clusters.',
    }),
    makeAction({
      id: 'OWNER-ACTION-002',
      sequence: 2,
      cluster: 'family_divorce',
      ownerAction: 'Approve or hold visible current-URL repair only',
      status: 'BLOCKED_OWNER_DECISION',
      sourceFile: inputFiles.familyApproval,
      rows: familyApproval,
      required: 'Owner records APPROVE_VISIBLE_REPAIR_ONLY or HOLD_PUBLIC_REPAIR',
      unblocks: '/divorce-agreement/ shortcode/PDF repair and H1/template repair on current URLs only',
      nextStep: 'Owner fills Family Law visible repair approval worksheet; SEO consolidation remains HOLD_PENDING_GSC.',
      notes: 'This approval is intentionally narrower than content upload, URL migration or canonical consolidation approval.',
    }),
    makeAction({
      id: 'OWNER-ACTION-003',
      sequence: 3,
      cluster: 'family_divorce',
      ownerAction: 'Capture actual WordPress rollback backup before approved visible repair',
      status: 'BLOCKED_CMS_BACKUP',
      sourceFile: inputFiles.familyBackup,
      rows: familyBackup,
      required: 'Post IDs, full bodies, SEO fields, canonical/robots, taxonomy/media fields, revision IDs and screenshots captured',
      unblocks: 'Safe current-URL visible repair execution and rollback path',
      nextStep: 'Operator completes the backup template after owner approval and before any editor save.',
      notes: 'Public HTML snapshots are not enough for rollback. The backup must come from WordPress/editor/database state.',
    }),
    makeAction({
      id: 'OWNER-ACTION-004',
      sequence: 4,
      cluster: 'family_divorce',
      ownerAction: 'Execute approved visible repairs, then rerun live safety and diagnostics',
      status: 'BLOCKED_UNTIL_APPROVAL_BACKUP_REPAIR',
      sourceFile: inputFiles.familyGate,
      rows: familyGate,
      required: 'Owner approval; CMS backup; current-URL repair; rerun safety/diagnostics; desktop/mobile screenshots',
      unblocks: 'Family/Divorce can move from procedural readiness toward upload-safe review',
      nextStep: 'Repair only raw shortcode/PDF/H1 visible defects; preserve current URLs and SEO migration decisions.',
      notes: 'All 8 Family repair gates are blocked until this sequence is completed and verified.',
    }),
    makeAction({
      id: 'OWNER-ACTION-005',
      sequence: 5,
      cluster: 'family_divorce',
      ownerAction: 'Review focused Family/Divorce GSC decision maps after export',
      status: 'BLOCKED_GSC_EXPORT_REVIEW',
      sourceFile: inputFiles.familyGate,
      rows: familyGate,
      required: 'Focused Family/Divorce GSC export and protected URL owner review packet regenerated from live API data',
      unblocks: 'Divorce-lawyer canonical choice, protected URL handling, redirect/noindex/sitemap decisions',
      nextStep: 'After priority GSC export, review family-divorce decision maps before any SEO consolidation.',
      notes: 'Do not use cached baseline maps as final proof for redirects or canonicals.',
    }),
    makeAction({
      id: 'OWNER-ACTION-006',
      sequence: 6,
      cluster: 'criminal_law',
      ownerAction: 'Review Criminal owner/legal/source packet and metadata after focused GSC export',
      priority: 'P1',
      status: 'BLOCKED_GSC_OWNER_LEGAL_SOURCE_REVIEW',
      sourceFile: inputFiles.criminalOwner,
      rows: criminalOwner,
      required: 'Focused Criminal GSC export; owner/legal/source review; rollback backup before CMS update',
      unblocks: 'Current-URL-only Criminal first upload package',
      nextStep: 'Owner marks APPROVE_CURRENT_URL_UPDATE, EDIT_REQUIRED, HOLD or LEGAL_REVIEW_REQUIRED per Criminal row.',
      notes: `${criminalMetadata.length} Criminal metadata rows exist, but all remain blocked from upload until owner/legal/source/GSC gates clear.`,
    }),
    makeAction({
      id: 'OWNER-ACTION-007',
      sequence: 7,
      cluster: 'criminal_law',
      ownerAction: 'Review Criminal protected URL/cannibalization maps',
      priority: 'P1',
      status: 'BLOCKED_FOCUSED_GSC_FINALITY',
      sourceFile: inputFiles.criminalGsc,
      rows: criminalGsc,
      required: 'Owner-authorized focused Criminal GSC export reviewed',
      unblocks: 'Criminal clean-slug migration, protected URL decisions and anti-cannibalization choices',
      nextStep: 'Keep clean slugs, redirects, canonicals/noindex and sitemap changes blocked until maps are final.',
      notes: 'Current Criminal maps are baseline-only until focused GSC export runs.',
    }),
    makeAction({
      id: 'OWNER-ACTION-008',
      sequence: 8,
      cluster: 'medical_malpractice',
      ownerAction: 'Verify authoritative CMS record for /medical-malpractice-lawyer/',
      priority: 'P1',
      status: 'BLOCKED_WP_ADMIN_DB_CHECK',
      sourceFile: inputFiles.medicalRunbook,
      rows: medicalRunbook,
      required: 'Rollback evidence for IDs 11607 and 1130; served-record verification; owner authoritative-record decision',
      unblocks: 'Medical Malpractice current-URL update package and duplicate identity resolution',
      nextStep: 'Operator runs inspection-only runbook and records KEEP_11607, KEEP_1130, MERGE_ASSETS or HOLD.',
      notes: 'Do not edit the public page until the duplicate CMS identity is resolved.',
    }),
    makeAction({
      id: 'OWNER-ACTION-009',
      sequence: 9,
      cluster: 'medical_malpractice',
      ownerAction: 'Review Medical Malpractice owner/source/legal/privacy worksheet',
      priority: 'P1',
      status: 'BLOCKED_OWNER_SOURCE_LEGAL_PRIVACY_REVIEW',
      sourceFile: inputFiles.medicalOwner,
      rows: medicalOwner,
      required: 'Owner decisions; source/legal review; privacy review for sensitive health-data intake; focused GSC export',
      unblocks: 'Medical Malpractice current-URL-only update package',
      nextStep: 'Owner assigns approve/edit/hold/legal/privacy decisions before any CMS work.',
      notes: `${medicalSource.length} source/legal rows exist; upload-approved rows remain zero.`,
    }),
    makeAction({
      id: 'OWNER-ACTION-010',
      sequence: 10,
      cluster: 'all_priority_clusters',
      ownerAction: 'Run final upload go/no-go review after owner gates clear',
      priority: 'P0',
      status: 'BLOCKED_UNTIL_PRIOR_ACTIONS_COMPLETE',
      sourceFile: '',
      rows: [],
      required: 'GSC exports reviewed; owner approvals recorded; rollback backups captured; source/legal gates resolved; post-repair QA passed',
      unblocks: 'Controlled content upload/update stage by cluster',
      nextStep: 'Update readiness dashboards and only then approve current-URL CMS uploads or later URL migration batches.',
      notes: 'The current safe sequence remains Family/Divorce visible repair and GSC review first, then Criminal, then Medical Malpractice.',
    }),
  ];
}

function buildSummary(rows, reportDate) {
  const blocked = rows.filter((row) => row.status.includes('BLOCKED')).length;
  const sourceRows = rows.reduce((sum, row) => sum + Number(row.source_rows || 0), 0);
  return {
    reportDate,
    queueRows: rows.length,
    blockedRows: blocked,
    reviewedSourceRows: sourceRows,
    nextOwnerAction: 'Complete read-only GSC OAuth setup outside Git, then run the priority cluster export runner.',
    uploadReadiness: blocked ? 'BLOCKED_BEFORE_CONTENT_UPLOAD' : 'READY_FOR_UPLOAD_REVIEW',
  };
}

function buildMarkdown(summary, rows) {
  const table = rows.map((row) => (
    `| ${row.sequence} | ${row.cluster} | ${row.priority} | ${row.status} | ${row.owner_action.replace(/\|/g, '/')} | ${row.next_step.replace(/\|/g, '/')} |`
  )).join('\n');

  return `# Priority Owner Action Queue - ${summary.reportDate}

Status: ${summary.uploadReadiness} / NO PUBLIC CHANGES

## Summary

- VERIFIED LOCAL: consolidated ${summary.queueRows} owner/operator action rows from current priority upload gates.
- REVIEWED: ${summary.reviewedSourceRows} source rows across GSC, Family/Divorce, Criminal Law and Medical Malpractice artifacts.
- BLOCKED: ${summary.blockedRows}/${summary.queueRows} action rows are blocked until owner/operator prerequisites are completed.
- NEXT OWNER ACTION: ${summary.nextOwnerAction}
- UPLOAD READINESS: no priority cluster is approved for public content upload from this queue alone.

## Queue

| # | Cluster | Priority | Status | Owner/operator action | Next step |
|---:|---|---|---|---|---|
${table}

## Files

- \`reports/priority-owner-action-queue-${summary.reportDate}.csv\`
- \`reports/priority-owner-action-queue-${summary.reportDate}.json\`
- \`project-control/priority-owner-action-queue-${summary.reportDate}.csv\`
- \`project-control/priority-owner-action-queue-${summary.reportDate}.md\`

## Safety

This is a repo-only planning queue. No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const output = files(args.reportDate);
  const rows = buildRows(output.inputs);
  const summary = buildSummary(rows, args.reportDate);
  const payload = { summary, rows };

  writeText(output.reportCsv, toCsv(rows, COLUMNS));
  writeText(output.projectCsv, toCsv(rows, COLUMNS));
  writeText(output.reportJson, `${JSON.stringify(payload, null, 2)}\n`);
  writeText(output.projectMd, buildMarkdown(summary, rows));

  console.log(JSON.stringify(summary, null, 2));
}

main();
