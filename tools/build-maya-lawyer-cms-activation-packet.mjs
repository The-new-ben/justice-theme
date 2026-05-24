import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const TARGET_SLUG = 'advocate-maya-rotenberg';
const TARGET_PATH = '/lawyers/advocate-maya-rotenberg/';
const TARGET_URL = `https://jus-tice.co.il${TARGET_PATH}`;

const COLUMNS = [
  'packet_id',
  'lane',
  'priority',
  'status',
  'evidence',
  'source',
  'owner_action',
  'operator_action',
  'verification_required',
  'blocked_actions',
  'notes',
];

const BLOCKED_PUBLIC_ACTIONS = [
  'NO_PUBLIC_CMS_WRITE',
  'NO_DUPLICATE_LAWYER_PROFILE',
  'NO_URL_MIGRATION',
  'NO_REDIRECT',
  'NO_CANONICAL_OR_NOINDEX_CHANGE',
  'NO_SITEMAP_CHANGE',
  'NO_TAXONOMY_CHANGE',
  'NO_MEDIA_OR_REVIEW_CLAIM',
  'NO_LEAD_OR_CRM_CHANGE',
  'NO_UPRESS_DEPLOY_OR_CACHE_CHANGE',
].join('; ');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || today(),
    sourceDate: process.env.SOURCE_DATE || '2026-05-22',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--sourceDate=')) args.sourceDate = arg.slice('--sourceDate='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.sourceDate)) {
    throw new Error('--sourceDate must be YYYY-MM-DD');
  }

  return args;
}

function printHelp() {
  console.log(`Maya lawyer CMS activation packet

Usage:
  node tools/build-maya-lawyer-cms-activation-packet.mjs --reportDate=YYYY-MM-DD [--sourceDate=YYYY-MM-DD]

Inputs:
  reports/maya-lawyer-live-readonly-REPORT_DATE.json
  project-control/maya-lawyer-mini-site-readiness-SOURCE_DATE.csv
  project-control/url-migration-map.csv
  inc/live-migrations.php
  inc/template-tags.php

Outputs:
  reports/maya-lawyer-cms-activation-packet-REPORT_DATE.csv
  reports/maya-lawyer-cms-activation-packet-REPORT_DATE.json
  project-control/maya-lawyer-cms-activation-packet-REPORT_DATE.csv
  project-control/maya-lawyer-cms-activation-packet-REPORT_DATE.md
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

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function files(reportDate, sourceDate) {
  const base = `maya-lawyer-cms-activation-packet-${reportDate}`;
  return {
    liveJson: path.join(ROOT, 'reports', `maya-lawyer-live-readonly-${reportDate}.json`),
    liveCsv: path.join(ROOT, 'project-control', `maya-lawyer-live-readonly-${reportDate}.csv`),
    readinessCsv: path.join(ROOT, 'project-control', `maya-lawyer-mini-site-readiness-${sourceDate}.csv`),
    urlMigrationMap: path.join(ROOT, 'project-control', 'url-migration-map.csv'),
    liveMigrations: path.join(ROOT, 'inc', 'live-migrations.php'),
    templateTags: path.join(ROOT, 'inc', 'template-tags.php'),
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function makeRow({
  packetId,
  lane,
  priority = 'CRITICAL',
  status,
  evidence,
  source,
  ownerAction,
  operatorAction,
  verificationRequired,
  blockedActions = BLOCKED_PUBLIC_ACTIONS,
  notes = '',
}) {
  return {
    packet_id: packetId,
    lane,
    priority,
    status,
    evidence,
    source,
    owner_action: ownerAction,
    operator_action: operatorAction,
    verification_required: verificationRequired,
    blocked_actions: blockedActions,
    notes,
  };
}

function hasAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

function findMayaMigrationRows(urlRows) {
  return urlRows.filter((row) => {
    const haystack = Object.values(row).join(' ');
    return haystack.includes(TARGET_SLUG) && haystack.includes('justice_lawyer');
  });
}

function buildRows({ inputFiles, liveReport, readinessRows, migrationRows, sourceChecks }) {
  const page = liveReport?.pageEvidence || {};
  const summary = liveReport?.summary || {};
  const candidateIds = [...new Set(migrationRows.map((row) => row.post_id || row.id).filter(Boolean))].join(' | ') || '-';
  const migrationEvidence = migrationRows.length
    ? `${migrationRows.length} prior migration-map row(s); candidate profile IDs: ${candidateIds}`
    : 'No migration-map row found for the target Maya lawyer slug.';

  const readinessVerified = readinessRows.filter((row) => String(row.status || '').includes('VERIFIED')).length;
  const readinessBlocked = readinessRows.filter((row) => String(row.status || '').includes('BLOCKED')).length;
  const readinessNotVerified = readinessRows.filter((row) => String(row.status || '').includes('NOT VERIFIED')).length;

  return [
    makeRow({
      packetId: 'MAYA-CMS-001',
      lane: 'current_live_blocker',
      status: 'BLOCKED LIVE QA',
      evidence: `HTTP ${page.http_status ?? '-'}; REST slug count ${page.rest_slug_count ?? '-'}; verified rows ${summary.verified_rows ?? '-'}/${summary.total_rows ?? '-'}`,
      source: rel(inputFiles.liveJson),
      ownerAction: 'Decide whether to activate the Maya profile now or keep it held.',
      operatorAction: 'Do not publish, redirect, canonicalize, or create a duplicate while current live QA is blocked.',
      verificationRequired: `Rerun node tools/check-maya-lawyer-live-readonly.mjs --reportDate=${summary.report_date || 'YYYY-MM-DD'}`,
      notes: `Target route: ${TARGET_URL}`,
    }),
    makeRow({
      packetId: 'MAYA-CMS-002',
      lane: 'existing_profile_confirmation',
      status: migrationRows.length ? 'BLOCKED ADMIN CONFIRMATION' : 'BLOCKED MISSING SOURCE MAP',
      evidence: migrationEvidence,
      source: rel(inputFiles.urlMigrationMap),
      ownerAction: 'Confirm the correct existing justice_lawyer record in wp-admin or database before any new record is created.',
      operatorAction: 'If candidate ID 19130 or another Maya record exists, repair that record only; create no duplicate profile.',
      verificationRequired: 'Authenticated wp-admin or WP-CLI confirmation of post type, ID, title, status, slug, and current meta.',
      notes: 'Anonymous REST currently returns zero records for the approved English slug, so admin confirmation is required.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-003',
      lane: 'rollback_capture',
      status: 'BLOCKED ROLLBACK REQUIRED',
      evidence: 'No rollback capture artifact for the live Maya CMS record exists in this repo packet.',
      source: rel(inputFiles.liveCsv),
      ownerAction: 'Approve a rollback storage location and activation window.',
      operatorAction: 'Before any write, export current post fields, meta, taxonomies, permalink-manager/redirect rules, SEO fields, and screenshots where available.',
      verificationRequired: 'Store rollback evidence path in project-control before enabling any migration filter or wp-admin edit.',
      notes: 'Capture profile_status, verification_status, source_type, source_url, subscription_status, website, public sources, social URLs, image fields, and internal_notes.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-004',
      lane: 'public_approval_signals',
      status: sourceChecks.templateApprovalGate ? 'VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION' : 'BLOCKED SOURCE SAFETY GAP',
      evidence: sourceChecks.templateApprovalGate
        ? 'justice_theme_lawyer_profile_is_public_approved requires publish status, non-seed signals, and approval metadata.'
        : 'Expected public-approval gate strings were not found in inc/template-tags.php.',
      source: rel(inputFiles.templateTags),
      ownerAction: 'Approve exact public profile status and verified source fields; do not mark fake, seed, demo, or test records public.',
      operatorAction: 'Set only truthful approval fields after owner review; do not set subscription_status=active unless commercially true.',
      verificationRequired: 'After edit, anonymous public route and REST must show exactly one approved Maya profile and no unapproved profile leakage.',
      notes: 'The template still blocks seed/demo/test/fake signals even for the Maya identity.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-005',
      lane: 'opt_in_slug_migration',
      status: sourceChecks.slugMigrationFilters ? 'VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION' : 'BLOCKED SOURCE SAFETY GAP',
      evidence: sourceChecks.slugMigrationFilters
        ? 'Slug migration and old-slug redirect filters are false by default.'
        : 'Expected Maya slug migration filters were not found.',
      source: rel(inputFiles.liveMigrations),
      ownerAction: 'Approve the English slug migration and old Hebrew URL redirect only after rollback capture.',
      operatorAction: 'Enable one scoped migration window if needed; verify the profile exists before enabling redirect.',
      verificationRequired: `After migration, ${TARGET_PATH} must be HTTP 200 and old Hebrew URL may 301 only to the verified English URL.`,
      notes: 'Use code filters only with an owner-approved deploy plan; this packet does not enable them.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-006',
      lane: 'minisite_bootstrap_fields',
      status: sourceChecks.minisiteBootstrap ? 'VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION' : 'BLOCKED SOURCE SAFETY GAP',
      evidence: sourceChecks.minisiteBootstrap
        ? 'Mini-site bootstrap is false by default, targets Maya only, writes empty fields, and avoids invented ratings/reviews/photos/payments.'
        : 'Expected mini-site bootstrap safeguards were not found.',
      source: rel(inputFiles.liveMigrations),
      ownerAction: 'Approve or edit the profile wording and decide which empty fields may be filled.',
      operatorAction: 'If approved, fill only empty fields on the confirmed Maya record; leave ratings, reviews, photos, bar/license numbers, and payments untouched unless verified.',
      verificationRequired: 'After activation, inspect visible sections, lead form routing fields, related articles, and schema output.',
      notes: `Readiness rows: ${readinessVerified} verified, ${readinessBlocked} blocked, ${readinessNotVerified} not verified.`,
    }),
    makeRow({
      packetId: 'MAYA-CMS-007',
      lane: 'public_source_transparency',
      status: sourceChecks.publicSourcesBootstrap ? 'VERIFIED LOCAL / BLOCKED PUBLIC EXECUTION' : 'BLOCKED SOURCE SAFETY GAP',
      evidence: sourceChecks.publicSourcesBootstrap
        ? 'Public-source bootstrap is false by default and stores editable source references only where empty.'
        : 'Expected public-source bootstrap safeguards were not found.',
      source: rel(inputFiles.liveMigrations),
      ownerAction: 'Confirm which public source URLs may be displayed and used in sameAs/profile context.',
      operatorAction: 'Do not add unreviewed awards, ratings, reviews, case wins, or license claims.',
      verificationRequired: 'After activation, check source links, sameAs extraction, Attorney/Person schema, and no fake review/rating schema.',
      notes: 'Public source references do not replace owner/legal review.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-008',
      lane: 'post_activation_live_qa',
      status: 'NOT VERIFIED',
      evidence: 'The current route is still not eligible for screenshot or Rich Results QA.',
      source: `${rel(inputFiles.liveJson)}; ${rel(inputFiles.readinessCsv)}`,
      ownerAction: 'Approve a live QA window after the record, slug, approval fields, and cache state are controlled.',
      operatorAction: 'Rerun live checker, capture desktop/mobile screenshots, inspect JSON-LD, and validate public REST behavior.',
      verificationRequired: 'Require HTTP 200, self-canonical, index/follow, one REST record, Attorney/Person schema, profile content, and desktop/mobile screenshots.',
      notes: 'Until this row is verified, do not use the Maya mini-site as Family/Divorce upload support evidence.',
    }),
    makeRow({
      packetId: 'MAYA-CMS-009',
      lane: 'repo_safety_closeout',
      priority: 'HIGH',
      status: 'VERIFIED LOCAL / NO PUBLIC CHANGES',
      evidence: 'This packet and the current read-only check only wrote repo reports and project-control documents.',
      source: rel(inputFiles.projectCsv),
      ownerAction: 'None required for repo artifact generation.',
      operatorAction: 'Keep public execution blocked until the owner/operator actions above are complete.',
      verificationRequired: 'CSV parse, node syntax, and generated packet rows must pass locally.',
      notes: 'No public CMS, wp-admin, uPress, redirect, canonical, noindex, taxonomy, sitemap, lead, CRM, payment, GA4, or GSC change was performed.',
    }),
  ];
}

function buildMarkdown(reportDate, sourceDate, summary, rows) {
  const lines = [
    `# Maya Lawyer CMS Activation Packet - ${reportDate}`,
    '',
    `Status: ${summary.overall_status}`,
    '',
    '## Summary',
    `- VERIFIED LIVE READ-ONLY PARTIAL: current public checker still reaches the site and confirms the justice_lawyer REST type.`,
    `- BLOCKED LIVE QA: ${TARGET_PATH} is not live-ready; current public report has ${summary.blocked_rows}/${summary.total_rows} blocked packet rows.`,
    '- FIXED PLANNING: this packet converts the blocked route state into exact owner/operator activation gates.',
    '- VERIFIED LOCAL: source safeguards remain false-by-default and approval-gated before public profile output.',
    '- SAFETY: no public CMS record, lawyer profile, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.',
    '',
    '## Required Order',
    '1. Owner approves or holds Maya profile activation scope.',
    '2. Operator confirms the existing live justice_lawyer record and captures rollback material.',
    '3. Operator applies only the approved record/slug/meta changes; no duplicate profile creation.',
    '4. Operator reruns read-only live QA, captures desktop/mobile screenshots, and verifies schema/REST behavior.',
    '',
    '## Packet Rows',
    '| Packet | Lane | Status | Evidence | Owner action | Operator action | Verification |',
    '|---|---|---|---|---|---|---|',
    ...rows.map((row) => (
      `| ${row.packet_id} | ${row.lane} | ${row.status} | ${String(row.evidence).replaceAll('|', '/')} | ${String(row.owner_action).replaceAll('|', '/')} | ${String(row.operator_action).replaceAll('|', '/')} | ${String(row.verification_required).replaceAll('|', '/')} |`
    )),
    '',
    '## Decision',
    `- BLOCKED PUBLIC EXECUTION: do not mark ${TARGET_PATH} live-ready and do not use it as support evidence for Family/Divorce uploads until post-activation live QA and screenshots pass.`,
    `- Source readiness date used: ${sourceDate}.`,
  ];

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const inputFiles = files(args.reportDate, args.sourceDate);
  const liveReport = readJson(inputFiles.liveJson);
  if (!liveReport) {
    throw new Error(`Missing live report JSON: ${rel(inputFiles.liveJson)}`);
  }

  const readinessRows = readCsv(inputFiles.readinessCsv);
  const migrationRows = findMayaMigrationRows(readCsv(inputFiles.urlMigrationMap));
  const liveMigrations = readText(inputFiles.liveMigrations);
  const templateTags = readText(inputFiles.templateTags);

  const sourceChecks = {
    templateApprovalGate: hasAll(templateTags, [
      'justice_theme_lawyer_profile_is_public_approved',
      'profile_status',
      'verification_status',
      'source_type',
      'seed',
      'justice_theme_allow_maya_name_public_profile_fallback',
    ]),
    slugMigrationFilters: hasAll(liveMigrations, [
      'justice_theme_enable_maya_slug_migration',
      'justice_theme_enable_maya_slug_redirect',
      TARGET_SLUG,
    ]),
    minisiteBootstrap: hasAll(liveMigrations, [
      'justice_theme_enable_maya_minisite_bootstrap',
      'writes only empty fields',
      'does not invent bar/license numbers, ratings, reviews, photos or payments',
    ]),
    publicSourcesBootstrap: hasAll(liveMigrations, [
      'justice_theme_enable_maya_public_sources_bootstrap',
      'profile_public_sources',
      'does not add unreviewed awards, ratings, reviews or case claims',
    ]),
  };

  const rows = buildRows({
    inputFiles,
    liveReport,
    readinessRows,
    migrationRows,
    sourceChecks,
  });

  const summary = {
    report_date: args.reportDate,
    source_date: args.sourceDate,
    overall_status: rows.some((row) => row.status.includes('BLOCKED'))
      ? 'BLOCKED PUBLIC CMS ACTIVATION / VERIFIED LOCAL PACKET / NO PUBLIC CHANGES'
      : 'VERIFIED LOCAL PACKET / NO PUBLIC CHANGES',
    total_rows: rows.length,
    blocked_rows: rows.filter((row) => row.status.includes('BLOCKED')).length,
    not_verified_rows: rows.filter((row) => row.status.includes('NOT VERIFIED')).length,
    verified_rows: rows.filter((row) => row.status.includes('VERIFIED')).length,
    target_path: TARGET_PATH,
    target_slug: TARGET_SLUG,
    sourceChecks,
  };

  const csv = toCsv(rows, COLUMNS);
  writeText(inputFiles.reportCsv, csv);
  writeText(inputFiles.projectCsv, csv);
  writeText(inputFiles.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(inputFiles.projectMd, buildMarkdown(args.reportDate, args.sourceDate, summary, rows));

  console.table(rows.map((row) => ({
    packet_id: row.packet_id,
    status: row.status,
    lane: row.lane,
  })));
  console.log(`Maya CMS activation packet: ${summary.verified_rows}/${summary.total_rows} rows include VERIFIED; ${summary.blocked_rows} blocked.`);
  console.log(`Wrote ${rel(inputFiles.projectMd)} and ${rel(inputFiles.reportCsv)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
