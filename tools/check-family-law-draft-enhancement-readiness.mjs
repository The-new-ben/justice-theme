import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const PUBLIC_BODY_DRAFTS = [
  'content-drafts/divorce-lawyer-public-body-he.md',
  'content-drafts/consensual-divorce-public-body-he.md',
  'content-drafts/divorce-mediation-public-body-he.md',
  'content-drafts/divorce-property-division-public-body-he.md',
  'content-drafts/family-dispute-resolution-public-body-he.md',
  'content-drafts/child-support-public-body-he.md',
  'content-drafts/child-custody-public-body-he.md',
];

const COLUMNS = [
  'queue_id',
  'priority',
  'action_type',
  'readiness_status',
  'queue_status',
  'target_url',
  'target_draft_file',
  'draft_files_checked',
  'missing_draft_files',
  'source_artifacts_checked',
  'missing_source_artifacts',
  'required_approval',
  'blocked_public_actions',
  'next_step',
];

const BLOCKED_PUBLIC_ACTIONS = [
  'NO_PUBLIC_CMS_EDIT',
  'NO_URL_CHANGE',
  'NO_REDIRECT',
  'NO_CANONICAL_OR_NOINDEX_CHANGE',
  'NO_SITEMAP_CHANGE',
  'NO_TAXONOMY_CHANGE',
  'NO_MEDIA_OR_PDF_CHANGE',
  'NO_LAWYER_CARD_CHANGE',
  'NO_LEAD_OR_CRM_CHANGE',
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
  console.log(`Family Law draft enhancement readiness checker

Usage:
  node tools/check-family-law-draft-enhancement-readiness.mjs --reportDate=YYYY-MM-DD

Input:
  project-control/family-law-draft-enhancement-queue-YYYY-MM-DD.csv

Outputs:
  reports/family-law-draft-enhancement-readiness-YYYY-MM-DD.csv
  reports/family-law-draft-enhancement-readiness-YYYY-MM-DD.json
  project-control/family-law-draft-enhancement-readiness-YYYY-MM-DD.csv
  project-control/family-law-draft-enhancement-readiness-YYYY-MM-DD.md
`);
}

function files(reportDate) {
  const base = `family-law-draft-enhancement-readiness-${reportDate}`;
  return {
    queueCsv: path.join(ROOT, 'project-control', `family-law-draft-enhancement-queue-${reportDate}.csv`),
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

function splitList(value) {
  return String(value || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);
}

function resolveDraftTargets(row) {
  const raw = String(row.target_draft_file || '').trim();
  if (raw === 'all seven public-body drafts') return PUBLIC_BODY_DRAFTS;
  if (raw === 'cluster structure and upload dashboard') return [];
  if (raw === 'future tools roadmap') return [];
  if (raw.includes('Maya mini-site readiness packet')) return [];

  return splitList(raw)
    .filter((entry) => entry.startsWith('content-drafts/'));
}

function artifactCandidates(token) {
  const normalized = token.trim();
  if (!normalized) return [];
  if (normalized.includes('/') || normalized.includes('\\')) return [normalized];

  const candidates = [];
  for (const directory of ['project-control', 'reports']) {
    const fullDirectory = path.join(ROOT, directory);
    if (!existsSync(fullDirectory)) continue;
    for (const entry of readdirSync(fullDirectory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.includes(normalized)) {
        candidates.push(`${directory}/${entry.name}`);
      }
    }
  }
  return candidates;
}

function resolveSourceArtifacts(row) {
  return splitList(row.source_artifacts)
    .map((token) => ({ token, candidates: artifactCandidates(token) }))
    .map(({ token, candidates }) => {
      const existing = candidates.find((candidate) => existsSync(path.join(ROOT, candidate)));
      return {
        token,
        path: existing || candidates[0] || token,
        exists: Boolean(existing),
      };
    });
}

function approvalFor(row) {
  const status = `${row.status} ${row.blocker}`.toUpperCase();
  const approvals = [];
  if (/OWNER/.test(status)) approvals.push('OWNER_WORDING');
  if (/LIVE QA|CMS ROLLBACK|PDF ASSET/.test(status)) approvals.push('LIVE_QA_OR_CMS_ROLLBACK');
  if (/LEAD QA|LAWYER ROUTE/.test(status)) approvals.push('LEAD_AND_LAWYER_ROUTE_QA');
  if (/MAYA/.test(status)) approvals.push('MAYA_ROUTE_SCHEMA_FACTS');
  if (/GSC/.test(status)) approvals.push('FOCUSED_GSC_EXPORT');
  if (/POST UPLOAD/.test(status)) approvals.push('POST_UPLOAD_SCHEMA_QA');
  if (/NOT FIRST UPLOAD BLOCKER/.test(status)) approvals.push('POST_UPLOAD_PRODUCT_DECISION');
  return approvals.length ? [...new Set(approvals)].join('; ') : 'OWNER_REVIEW';
}

function readinessFor(row, missingDraftFiles, missingArtifacts) {
  const status = String(row.status || '').toUpperCase();
  if (missingDraftFiles.length || missingArtifacts.length) return 'BLOCKED_MISSING_REPO_ARTIFACT';
  if (status.includes('NOT FIRST_UPLOAD BLOCKER') || status.includes('NOT FIRST UPLOAD BLOCKER')) {
    return 'BACKLOG_NOT_FIRST_UPLOAD_BLOCKER';
  }
  if (
    status.includes('BLOCKED LIVE QA')
    || status.includes('BLOCKED LEAD QA')
    || status.includes('BLOCKED MAYA LIVE QA')
    || status.includes('BLOCKED GSC')
    || status.includes('BLOCKED OWNER APPROVAL')
    || status.includes('BLOCKED CMS ROLLBACK')
    || status.includes('BLOCKED PDF ASSET')
  ) {
    return 'BLOCKED_EXTERNAL_DEPENDENCY';
  }
  if (status.includes('BLOCKED POST UPLOAD LIVE QA')) return 'BLOCKED_POST_UPLOAD_QA';
  if (status.includes('READY FOR DRAFT EDIT AFTER OWNER WORDING') || status.includes('BLOCKED OWNER WORDING') || status.includes('FIXED PLANNING')) {
    return 'READY_FOR_OWNER_WORDING_NOT_EDITED';
  }
  return 'REVIEW_REQUIRED';
}

function checkRows(queueRows) {
  return queueRows.map((row) => {
    const draftTargets = resolveDraftTargets(row);
    const missingDraftFiles = draftTargets.filter((relativePath) => !existsSync(path.join(ROOT, relativePath)));
    const artifacts = resolveSourceArtifacts(row);
    const missingArtifacts = artifacts.filter((artifact) => !artifact.exists).map((artifact) => artifact.token);

    return {
      queue_id: row.queue_id,
      priority: row.priority,
      action_type: row.action_type,
      readiness_status: readinessFor(row, missingDraftFiles, missingArtifacts),
      queue_status: row.status,
      target_url: row.target_url,
      target_draft_file: row.target_draft_file,
      draft_files_checked: draftTargets.length ? draftTargets.join('; ') : '-',
      missing_draft_files: missingDraftFiles.length ? missingDraftFiles.join('; ') : '-',
      source_artifacts_checked: artifacts.length ? artifacts.map((artifact) => artifact.path).join('; ') : '-',
      missing_source_artifacts: missingArtifacts.length ? missingArtifacts.join('; ') : '-',
      required_approval: approvalFor(row),
      blocked_public_actions: BLOCKED_PUBLIC_ACTIONS,
      next_step: row.next_step,
    };
  });
}

function buildSummary(reportDate, rows) {
  const statusCounts = rows.reduce((counts, row) => {
    counts[row.readiness_status] = (counts[row.readiness_status] || 0) + 1;
    return counts;
  }, {});

  const missingRows = rows.filter((row) => row.readiness_status === 'BLOCKED_MISSING_REPO_ARTIFACT').length;
  const ownerWordingRows = rows.filter((row) => row.readiness_status === 'READY_FOR_OWNER_WORDING_NOT_EDITED').length;
  const externalRows = rows.filter((row) => row.readiness_status.startsWith('BLOCKED_') && row.readiness_status !== 'BLOCKED_MISSING_REPO_ARTIFACT').length;

  return {
    reportDate,
    overallStatus: missingRows ? 'BLOCKED_MISSING_REPO_ARTIFACT' : 'VERIFIED_QUEUE_READY_FOR_OWNER_WORDING_REVIEW',
    rowsReviewed: rows.length,
    missingRepoArtifactRows: missingRows,
    readyForOwnerWordingRows: ownerWordingRows,
    blockedExternalDependencyRows: externalRows,
    statusCounts,
    nextStep: 'Owner approves cost/process/document/agreement/CTA wording; then edit seven public-body drafts only and rerun static QA.',
  };
}

function buildMarkdown(summary, rows, output) {
  const table = rows.map((row) => (
    `| ${row.queue_id} | ${row.priority} | ${row.readiness_status} | ${row.required_approval.replace(/\|/g, '/')} | ${row.next_step.replace(/\|/g, '/')} |`
  )).join('\n');

  return `# Family Law Draft Enhancement Readiness - ${summary.reportDate}

Status: ${summary.overallStatus} / NO PUBLIC CHANGES

## Summary

- VERIFIED LOCAL: reviewed ${summary.rowsReviewed} draft enhancement queue rows.
- VERIFIED LOCAL: ${summary.readyForOwnerWordingRows} rows are ready for owner wording review before draft editing.
- BLOCKED: ${summary.blockedExternalDependencyRows} rows still depend on live QA, GSC, Maya route/schema, lead routing, post-upload schema QA or product decisions.
- BLOCKED: ${summary.missingRepoArtifactRows} rows are missing repo artifacts.
- NEXT: ${summary.nextStep}

## Queue Readiness

| Queue ID | Priority | Status | Required approval | Next step |
|---|---|---|---|---|
${table}

## Output Files

- \`${rel(output.reportCsv)}\`
- \`${rel(output.reportJson)}\`
- \`${rel(output.projectCsv)}\`
- \`${rel(output.projectMd)}\`

## Safety

This is a repo-only generated readiness gate. No public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const output = files(args.reportDate);
  if (!existsSync(output.queueCsv)) {
    throw new Error(`Missing queue CSV: ${rel(output.queueCsv)}`);
  }

  const queueRows = readCsv(output.queueCsv);
  const rows = checkRows(queueRows);
  const summary = buildSummary(args.reportDate, rows);

  writeText(output.reportCsv, toCsv(rows, COLUMNS));
  writeText(output.projectCsv, toCsv(rows, COLUMNS));
  writeText(output.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(output.projectMd, buildMarkdown(summary, rows, output));

  console.log(JSON.stringify(summary, null, 2));

  if (summary.missingRepoArtifactRows > 0) {
    process.exitCode = 1;
  }
}

main();
