import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DASHBOARD_PREFIX = 'medical-malpractice-readiness-dashboard';
const GSC_PREFIX = 'medical-malpractice-gsc-decision-map';

const INCLUDED_LANES = new Set([
  'OWNER_DECISION_GATE',
  'CURRENT_URL_READINESS',
  'P0_SUPPORT_TO_HUB_MAP',
  'CLEAN_SLUG_ROUTE_REVIEW',
  'SOURCE_LEGAL_GATE',
  'CANNIBALIZATION_GROUP',
]);

const COLUMNS = [
  'decision_id',
  'source_row_id',
  'decision_type',
  'priority',
  'current_url_or_reference',
  'target_or_hub',
  'role_or_topic',
  'recommended_owner_decision',
  'owner_decision_status',
  'upload_readiness',
  'gsc_risk',
  'gsc_clicks',
  'gsc_impressions',
  'minimum_before_action',
  'blocked_public_actions',
  'next_step',
  'notes',
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || todayIso(),
    dashboard: process.env.MEDICAL_MALPRACTICE_DASHBOARD_CSV || '',
    gsc: process.env.MEDICAL_MALPRACTICE_GSC_DECISION_CSV || '',
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--dashboard=')) args.dashboard = arg.slice('--dashboard='.length);
    else if (arg.startsWith('--gsc=')) args.gsc = arg.slice('--gsc='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  args.dashboard = args.dashboard
    ? path.resolve(args.dashboard)
    : path.join(ROOT, 'project-control', `${DASHBOARD_PREFIX}-${args.reportDate}.csv`);

  args.gsc = args.gsc
    ? path.resolve(args.gsc)
    : path.join(ROOT, 'project-control', `${GSC_PREFIX}-${args.reportDate}.csv`);

  if (!existsSync(args.dashboard)) {
    throw new Error(`Missing dashboard input: ${path.relative(ROOT, args.dashboard)}`);
  }
  if (!existsSync(args.gsc)) {
    throw new Error(`Missing GSC decision input: ${path.relative(ROOT, args.gsc)}`);
  }

  return args;
}

function printHelp() {
  console.log(`Medical Malpractice owner decision packet

Usage:
  node tools/build-medical-malpractice-owner-decision-packet.mjs --reportDate=YYYY-MM-DD

Inputs:
  project-control/medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv
  project-control/medical-malpractice-gsc-decision-map-YYYY-MM-DD.csv

Outputs:
  reports/medical-malpractice-owner-decision-packet-YYYY-MM-DD.csv
  reports/medical-malpractice-owner-decision-packet-YYYY-MM-DD.json
  project-control/medical-malpractice-owner-decision-packet-YYYY-MM-DD.csv
  project-control/medical-malpractice-owner-decision-packet-YYYY-MM-DD.md
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
  const text = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
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

function writeText(filePath, contents) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents, 'utf8');
}

function relPath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function compact(value, max = 150) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function pathOrReference(row) {
  return row.current_url || row.path || row.current_url_or_reference || row.source || '';
}

function inferDecision(row) {
  const haystack = [
    row.lane,
    row.current_url,
    row.target_url_or_hub,
    row.role_or_topic,
    row.readiness_status,
    row.traffic_risk,
    row.next_step,
    row.notes,
  ]
    .join(' ')
    .toLowerCase();

  if (
    haystack.includes('false-positive') ||
    haystack.includes('remove or reclassify') ||
    haystack.includes('fix cluster assignment')
  ) {
    return 'REMOVE_OR_RECLASSIFY_BEFORE_UPLOAD_PLANNING';
  }
  if (row.lane === 'CLEAN_SLUG_ROUTE_REVIEW') {
    return 'HOLD_CLEAN_SLUG_NO_ROUTE_OR_REDIRECT';
  }
  if (row.lane === 'SOURCE_LEGAL_GATE') {
    return 'SOURCE_LEGAL_PRIVACY_REVIEW_REQUIRED';
  }
  if (row.lane === 'CANNIBALIZATION_GROUP') {
    return 'CHOOSE_PRIMARY_SUPPORT_MERGE_REWRITE_KEEP_ROLES';
  }
  if (
    haystack.includes('duplicate_identity') ||
    haystack.includes('duplicate identity') ||
    haystack.includes('same-public-url') ||
    haystack.includes('same public url') ||
    haystack.includes('same_public_url')
  ) {
    return 'REVIEW_DUPLICATE_CMS_IDENTITY';
  }
  if (
    haystack.includes('boundary') ||
    haystack.includes('traffic_marvad') ||
    haystack.includes('criminal-negligence') ||
    haystack.includes('future_slug') ||
    haystack.includes('future slugs') ||
    haystack.includes('international') ||
    haystack.includes('united states')
  ) {
    return 'CONFIRM_BOUNDARY_EXCLUSION_FROM_ISRAELI_SERVICE_CLUSTER';
  }
  if (haystack.includes('fee') || haystack.includes('cost') || haystack.includes('שכר')) {
    return 'PROTECT_COST_SUPPORT_THEN_COMPARE';
  }
  if (haystack.includes('birth') || haystack.includes('pregnancy') || haystack.includes('cerebral')) {
    return 'PROTECT_BIRTH_PREGNANCY_ROLE_THEN_SPLIT_OR_MERGE';
  }
  if (haystack.includes('surgery') || haystack.includes('anesthesia')) {
    return 'KEEP_AS_SUPPORT_AFTER_SOURCE_AND_URL_REVIEW';
  }
  if (haystack.includes('definition') || haystack.includes('common errors') || haystack.includes('negligence')) {
    return 'KEEP_INFORMATIONAL_SUPPORT_IF_UNIQUE';
  }
  if ((row.traffic_risk || '').includes('HIGH') || (row.traffic_risk || '').includes('PROTECTED')) {
    return 'PROTECT_AND_REVIEW_BEFORE_REWRITE_LINK_OR_REDIRECT';
  }
  return 'OWNER_ROLE_REVIEW_REQUIRED';
}

function inferMinimum(row) {
  const basics = ['owner approval', 'focused GSC export', 'source/legal review'];
  if ((row.role_or_topic || '').toLowerCase().includes('duplicate') || (row.readiness_status || '').includes('DUPLICATE')) {
    basics.unshift('duplicate CMS identity resolved');
  }
  if (row.lane === 'CLEAN_SLUG_ROUTE_REVIEW') {
    return 'focused GSC export; owner migration approval; redirect/canonical/sitemap plan; current URL backup';
  }
  if (row.lane === 'SOURCE_LEGAL_GATE') {
    return 'source citation review; legal/privacy review; disclaimer posture; owner approval';
  }
  if (row.lane === 'CANNIBALIZATION_GROUP') {
    return 'primary/support/merge/rewrite/keep role decision; focused GSC export; redirect plan later';
  }
  return `${basics.join('; ')}; WordPress editor/database backup before CMS execution`;
}

function includeDashboardRow(row) {
  if (INCLUDED_LANES.has(row.lane)) return true;
  const haystack = `${row.next_step || ''} ${row.notes || ''} ${row.role_or_topic || ''}`.toLowerCase();
  return (
    haystack.includes('remove or reclassify') ||
    haystack.includes('false-positive') ||
    haystack.includes('fix cluster assignment')
  );
}

function buildRows(dashboardRows, gscRows) {
  const gscByPath = new Map();
  gscRows.forEach((row) => {
    if (row.path) gscByPath.set(row.path, row);
  });

  return dashboardRows.filter(includeDashboardRow).map((row, index) => {
    const urlOrRef = pathOrReference(row);
    const urlPath = urlOrRef.startsWith('https://jus-tice.co.il')
      ? new URL(urlOrRef).pathname
      : urlOrRef.startsWith('/')
        ? urlOrRef
        : '';
    const gscMatch = urlPath ? gscByPath.get(urlPath) : null;

    return {
      decision_id: `MEDMAL-OWNER-DECISION-${String(index + 1).padStart(3, '0')}`,
      source_row_id: row.row_id || '',
      decision_type: row.lane || 'REVIEW_ROW',
      priority: row.priority || '',
      current_url_or_reference: urlOrRef,
      target_or_hub: row.target_url_or_hub || row.mapped_target || '',
      role_or_topic: row.role_or_topic || '',
      recommended_owner_decision: inferDecision(row),
      owner_decision_status: 'PENDING_OWNER_DECISION',
      upload_readiness: 'NOT_APPROVED_FOR_UPLOAD',
      gsc_risk: row.traffic_risk || gscMatch?.risk || '',
      gsc_clicks: row.gsc_clicks || gscMatch?.gsc_clicks || '',
      gsc_impressions: row.gsc_impressions || gscMatch?.gsc_impressions || '',
      minimum_before_action: inferMinimum(row),
      blocked_public_actions:
        row.blocked_actions ||
        'NO_CMS_EDIT; NO_PUBLIC_UPLOAD; NO_URL_CHANGE; NO_REDIRECT; NO_CANONICAL_NOINDEX; NO_SITEMAP_CHANGE; NO_TAXONOMY_CHANGE',
      next_step: row.next_step || '',
      notes: row.notes || '',
    };
  });
}

function buildSummary(rows, args) {
  const count = (predicate) => rows.filter(predicate).length;
  const byType = rows.reduce((acc, row) => {
    acc[row.decision_type] = (acc[row.decision_type] || 0) + 1;
    return acc;
  }, {});

  return {
    reportDate: args.reportDate,
    inputDashboard: relPath(args.dashboard),
    inputGscDecisionMap: relPath(args.gsc),
    totalDecisionRows: rows.length,
    ownerGateRows: byType.OWNER_DECISION_GATE || 0,
    currentUrlRows: byType.CURRENT_URL_READINESS || 0,
    p0SupportRows: byType.P0_SUPPORT_TO_HUB_MAP || 0,
    cleanSlugRouteRows: byType.CLEAN_SLUG_ROUTE_REVIEW || 0,
    sourceLegalRows: byType.SOURCE_LEGAL_GATE || 0,
    cannibalizationRows: byType.CANNIBALIZATION_GROUP || 0,
    falsePositiveRows: count((row) => row.recommended_owner_decision === 'REMOVE_OR_RECLASSIFY_BEFORE_UPLOAD_PLANNING'),
    highOrProtectedRiskRows: count((row) => /(HIGH|PROTECTED)/.test(row.gsc_risk || '')),
    approvedForUploadRows: count((row) => row.upload_readiness !== 'NOT_APPROVED_FOR_UPLOAD'),
    pendingOwnerDecisionRows: count((row) => row.owner_decision_status === 'PENDING_OWNER_DECISION'),
  };
}

function tableRows(rows, limit = 16) {
  return rows.slice(0, limit).map((row) => (
    `| ${compact(row.decision_id, 28)} | ${compact(row.decision_type, 26)} | ${compact(row.current_url_or_reference, 62)} | ${compact(row.recommended_owner_decision, 48)} | ${compact(row.gsc_risk, 20)} |`
  )).join('\n');
}

function buildMarkdown(rows, summary) {
  const highRiskRows = rows.filter((row) => /(HIGH|PROTECTED)/.test(row.gsc_risk || ''));
  const cleanSlugRows = rows.filter((row) => row.decision_type === 'CLEAN_SLUG_ROUTE_REVIEW');
  const falsePositiveRows = rows.filter((row) => row.recommended_owner_decision === 'REMOVE_OR_RECLASSIFY_BEFORE_UPLOAD_PLANNING');

  return `# Medical Malpractice Owner Decision Packet - ${summary.reportDate}

## Status

FIXED local planning packet. VERIFIED local generation completed. NOT VERIFIED FINAL because focused GSC API export, owner decisions, source/legal review and WordPress rollback material are still missing.

REVIEW ONLY: this packet does not approve public CMS edits, URL slug changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy edits, related-card edits, schema changes, lawyer-card changes, CRM changes, wp-admin changes or database writes.

## Batch Completed

- Decision rows prepared: \`${summary.totalDecisionRows}\`.
- Owner gate rows: \`${summary.ownerGateRows}\`.
- Current URL review rows: \`${summary.currentUrlRows}\`.
- P0 support/protected rows: \`${summary.p0SupportRows}\`.
- Clean-slug route blocker rows: \`${summary.cleanSlugRouteRows}\`.
- Source/legal rows: \`${summary.sourceLegalRows}\`.
- Cannibalization rows: \`${summary.cannibalizationRows}\`.
- Possible false-positive rows: \`${summary.falsePositiveRows}\`.
- High/protected risk rows: \`${summary.highOrProtectedRiskRows}\`.
- Approved for upload now: \`${summary.approvedForUploadRows}\`.

## Owner Decision Matrix

| Decision | Type | Current URL or reference | Recommended owner decision | Risk |
| --- | --- | --- | --- | --- |
${tableRows(rows)}

_Showing ${Math.min(rows.length, 16)} of ${rows.length} rows._

## First Review Order

1. Resolve duplicate CMS identity for \`/medical-malpractice-lawyer/\` before any body, title, H1, meta, internal-link or schema work.
2. Protect and compare the high-traffic fee/cost and birth/pregnancy assets before creating new slugs or redirects.
3. Confirm whether birth injury, cerebral palsy, pregnancy and birth malpractice are parent/support pages or later merge candidates.
4. Review surgery/anesthesia and nested personal-injury surgery URLs for support role, source/legal safety and URL strategy.
5. Remove or reclassify possible false-positive rows before using the cluster for upload planning.
6. Hold clean English slugs until focused GSC export, redirect plan, canonical plan and sitemap plan are approved together.

## High / Protected Rows

| Decision | Type | Current URL or reference | Recommended owner decision | Risk |
| --- | --- | --- | --- | --- |
${tableRows(highRiskRows, 12)}

_Showing ${Math.min(highRiskRows.length, 12)} of ${highRiskRows.length} high/protected rows._

## Clean Slug Blockers

| Decision | Type | Current URL or reference | Recommended owner decision | Risk |
| --- | --- | --- | --- | --- |
${cleanSlugRows.length ? tableRows(cleanSlugRows, 12) : '| - | - | - | - | - |'}

## Possible False Positives

| Decision | Type | Current URL or reference | Recommended owner decision | Risk |
| --- | --- | --- | --- | --- |
${falsePositiveRows.length ? tableRows(falsePositiveRows, 12) : '| - | - | - | - | - |'}

## Minimum Checklist Before Any Medical Malpractice Upload

MUST PASS:
1. Owner marks each relevant row with an allowed decision: \`APPROVE_CURRENT_URL_UPDATE\`, \`EDIT_REQUIRED\`, \`HOLD\`, \`LEGAL_REVIEW_REQUIRED\`, \`PROTECT_ONLY\` or \`REMOVE_FROM_CLUSTER\`.
2. Focused GSC export is run and the baseline GSC decision map is regenerated from API data.
3. Duplicate CMS identity for \`/medical-malpractice-lawyer/\` is resolved.
4. Medical/legal/source review checks causation, standard of care, limitation/deadline, compensation, expert-opinion and privacy/records language.
5. WordPress editor/database rollback material is captured for every approved current URL before editing.
6. Internal links use approved current URLs only; future English slugs remain blocked.
7. Redirects, canonicals, noindex, sitemap and taxonomy changes remain a later approved migration batch.

## Can Wait

- Clean English slug migration.
- Redirect package and canonical/noindex changes.
- Sitemap expansion or pruning.
- Taxonomy/category restructuring.
- Related-content cards.
- Lawyer-card and lead-routing blocks.
- Full rewrite of every long-tail medical malpractice support page.

## Still Blocked

- BLOCKED: focused GSC API export and owner OAuth.
- BLOCKED: owner/legal/source approval.
- BLOCKED: duplicate CMS identity resolution for the current pillar.
- BLOCKED: public CMS upload and public visual QA.
- BLOCKED: URL migration, redirects, canonicals, noindex, sitemap and taxonomy changes.

## Outputs

- \`reports/medical-malpractice-owner-decision-packet-${summary.reportDate}.csv\`
- \`reports/medical-malpractice-owner-decision-packet-${summary.reportDate}.json\`
- \`project-control/medical-malpractice-owner-decision-packet-${summary.reportDate}.csv\`

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
`;
}

function buildFiles(reportDate) {
  const base = `medical-malpractice-owner-decision-packet-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const dashboardRows = readCsv(args.dashboard);
  const gscRows = readCsv(args.gsc);
  const rows = buildRows(dashboardRows, gscRows);
  const summary = buildSummary(rows, args);
  const files = buildFiles(args.reportDate);

  const csv = toCsv(rows, COLUMNS);
  const json = `${JSON.stringify({ summary, rows }, null, 2)}\n`;
  const markdown = buildMarkdown(rows, summary);

  writeText(files.reportCsv, csv);
  writeText(files.projectCsv, csv);
  writeText(files.reportJson, json);
  writeText(files.projectMd, markdown);

  console.log(JSON.stringify({
    reportDate: args.reportDate,
    totalDecisionRows: summary.totalDecisionRows,
    ownerGateRows: summary.ownerGateRows,
    currentUrlRows: summary.currentUrlRows,
    p0SupportRows: summary.p0SupportRows,
    cleanSlugRouteRows: summary.cleanSlugRouteRows,
    sourceLegalRows: summary.sourceLegalRows,
    falsePositiveRows: summary.falsePositiveRows,
    approvedForUploadRows: summary.approvedForUploadRows,
    outputs: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, relPath(value)])),
  }, null, 2));
}

main();
