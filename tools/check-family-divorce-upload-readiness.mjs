import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const TODAY = '2026-05-21';
const OUT_CSV = path.join(ROOT, 'reports', `family-divorce-upload-readiness-${TODAY}.csv`);
const OUT_JSON = path.join(ROOT, 'reports', `family-divorce-upload-readiness-${TODAY}.json`);

const FILES = {
  staticQa: 'reports/family-divorce-public-body-static-qa-2026-05-21.csv',
  liveManifest: 'reports/family-divorce-live-target-backup-2026-05-21/manifest.csv',
  livePreupload: 'reports/family-divorce-live-preupload-2026-05-21.csv',
  ownerPacket: 'project-control/family-divorce-owner-review-packet-2026-05-21.csv',
  runbook: 'project-control/family-divorce-cms-operator-runbook-2026-05-21.csv',
  pillarMetadata: 'project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv',
  supportMetadata: 'project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv',
  gscRunner: 'tools/gsc/gsc-family-divorce-export.js',
};

const TARGETS = [
  '/divorce-lawyer/',
  '/consensual-divorce/',
  '/divorce-mediation/',
  '/divorce-property-division/',
  '/family-dispute-resolution/',
  '/child-support/',
  '/child-custody/',
];

function abs(relativePath) {
  return path.join(ROOT, relativePath);
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

function readCsv(relativePath, options = {}) {
  const strict = options.strict !== false;
  const fullPath = abs(relativePath);
  if (!existsSync(fullPath)) return [];
  const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    let values = parseCsvLine(line);
    if (!strict && values.length > headers.length) {
      values = [
        ...values.slice(0, headers.length - 1),
        values.slice(headers.length - 1).join(','),
      ];
    }
    if (values.length !== headers.length) {
      throw new Error(`${relativePath}: expected ${headers.length} columns, got ${values.length}`);
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

function normalizePath(value) {
  if (!value) return '';
  let pathname = value;
  try {
    pathname = value.startsWith('http') ? new URL(value).pathname : new URL(value, 'https://jus-tice.co.il').pathname;
  } catch (_err) {
    pathname = value;
  }
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (!/\.[a-z0-9]{2,8}$/i.test(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function byPath(rows, field) {
  const map = new Map();
  rows.forEach((row) => map.set(normalizePath(row[field]), row));
  return map;
}

function statusRank(status) {
  if (String(status).includes('BLOCKED')) return 3;
  if (String(status).includes('REVIEW')) return 2;
  if (String(status).includes('READY')) return 1;
  return 0;
}

function main() {
  const staticQa = readCsv(FILES.staticQa);
  const liveManifest = readCsv(FILES.liveManifest);
  const livePreupload = readCsv(FILES.livePreupload);
  const ownerPacket = readCsv(FILES.ownerPacket);
  const runbook = readCsv(FILES.runbook);
  const supportMetadata = readCsv(FILES.supportMetadata, { strict: false });

  const staticQaByTarget = byPath(staticQa, 'target');
  const liveByPath = byPath(liveManifest, 'path');
  const ownerByTarget = byPath(ownerPacket, 'target');
  const supportMetaByPath = byPath(supportMetadata, 'path');

  const pageRows = TARGETS.map((target) => {
    const qa = staticQaByTarget.get(target) || {};
    const live = liveByPath.get(target) || {};
    const owner = ownerByTarget.get(target) || {};
    const supportMeta = supportMetaByPath.get(target);
    const metadataPackage = target === '/divorce-lawyer/'
      ? FILES.pillarMetadata
      : FILES.supportMetadata;
    const metadataWords = target === '/divorce-lawyer/' ? '' : (supportMeta?.words || '');
    const currentWords = qa.words || '';
    const metadataWordStatus = target === '/divorce-lawyer/'
      ? 'PILLAR_PACKAGE_SEPARATE'
      : Number(metadataWords) === Number(currentWords)
        ? 'MATCH'
        : 'STALE_WORD_COUNT_REVIEW';

    const blockers = [];
    if (qa.status !== 'PASS') blockers.push('static_qa_not_pass');
    if (live.status !== 'PASS') blockers.push('live_backup_not_pass');
    if (owner.upload_status !== 'BLOCKED') blockers.push('unexpected_owner_packet_state');
    blockers.push('owner_legal_source_approval_required');
    blockers.push('wordpress_editor_database_backup_required');

    return {
      target,
      draft_file: qa.file || owner.draft_file || '',
      current_words: currentWords,
      static_qa: qa.status || 'MISSING',
      live_backup: live.status || 'MISSING',
      owner_packet_status: owner.upload_status || 'MISSING',
      metadata_package: metadataPackage,
      metadata_words: metadataWords,
      metadata_word_status: metadataWordStatus,
      body_upload_readiness: blockers.length === 2 ? 'READY_AFTER_OWNER_APPROVAL_AND_BACKUP' : 'BLOCKED_REVIEW_REQUIRED',
      url_migration_readiness: 'BLOCKED_GSC_EXPORT_AND_REDIRECT_REVIEW',
      blockers: blockers.join(';'),
    };
  });

  const protectedConflicts = livePreupload.filter((row) => row.group === 'protected_source' && row.status === 'CONFLICT');
  const supportMetadataMismatchCount = pageRows.filter((row) => row.metadata_word_status === 'STALE_WORD_COUNT_REVIEW').length;
  const staticPassCount = pageRows.filter((row) => row.static_qa === 'PASS').length;
  const livePassCount = pageRows.filter((row) => row.live_backup === 'PASS').length;

  const gateRows = [
    {
      gate: 'clean_public_body_static_qa',
      status: staticPassCount === TARGETS.length ? 'VERIFIED' : 'BLOCKED',
      evidence: `${staticPassCount}/${TARGETS.length} target drafts PASS`,
      next_step: 'Use current static QA counts, not older metadata-package word counts',
    },
    {
      gate: 'live_target_backup',
      status: livePassCount === TARGETS.length ? 'VERIFIED' : 'BLOCKED',
      evidence: `${livePassCount}/${TARGETS.length} live target snapshots PASS`,
      next_step: 'Still export actual WordPress editor/database rollback material before CMS edits',
    },
    {
      gate: 'owner_review_packet',
      status: ownerPacket.length >= TARGETS.length ? 'READY_FOR_OWNER' : 'BLOCKED',
      evidence: `${ownerPacket.length} owner packet rows found`,
      next_step: 'Owner marks APPROVE, EDIT, HOLD or LEGAL_REVIEW_REQUIRED per page',
    },
    {
      gate: 'cms_operator_runbook',
      status: runbook.length >= TARGETS.length ? 'READY_FOR_OPERATOR_AFTER_APPROVAL' : 'BLOCKED',
      evidence: `${runbook.length} runbook rows found`,
      next_step: 'Operator updates existing pages only after approval and backup',
    },
    {
      gate: 'metadata_package_currentness',
      status: supportMetadataMismatchCount ? 'REVIEW_REQUIRED' : 'VERIFIED',
      evidence: `${supportMetadataMismatchCount} Wave 1B metadata word counts differ from current static QA`,
      next_step: supportMetadataMismatchCount
        ? 'Sync metadata word counts or use current QA counts in upload status docs'
        : 'Use synced metadata package plus current static QA for upload status docs',
    },
    {
      gate: 'protected_source_redirects',
      status: protectedConflicts.length ? 'BLOCKED' : 'VERIFIED',
      evidence: `${protectedConflicts.length} protected source URLs redirect to homepage in latest live pre-upload guard`,
      next_step: 'Resolve after GSC API export before any URL migration, redirect, canonical/noindex or sitemap action',
    },
    {
      gate: 'gsc_family_divorce_export',
      status: existsSync(abs(FILES.gscRunner)) ? 'TOOL_READY_API_BLOCKED' : 'BLOCKED',
      evidence: existsSync(abs(FILES.gscRunner)) ? 'Focused export runner exists' : 'Missing focused export runner',
      next_step: 'Owner supplies rotated local credentials and runs read-only export',
    },
    {
      gate: 'public_upload',
      status: 'BLOCKED',
      evidence: 'No owner/legal/source approval and no WordPress rollback backup in repo',
      next_step: 'Do not edit public CMS until approvals and backups exist',
    },
  ];

  gateRows.sort((left, right) => statusRank(right.status) - statusRank(left.status));

  mkdirSync(path.dirname(OUT_CSV), { recursive: true });
  writeFileSync(OUT_CSV, toCsv(pageRows, [
    'target',
    'draft_file',
    'current_words',
    'static_qa',
    'live_backup',
    'owner_packet_status',
    'metadata_package',
    'metadata_words',
    'metadata_word_status',
    'body_upload_readiness',
    'url_migration_readiness',
    'blockers',
  ]), 'utf8');

  const summary = {
    generatedAt: new Date().toISOString(),
    targetCount: TARGETS.length,
    staticPassCount,
    livePassCount,
    supportMetadataMismatchCount,
    protectedSourceRedirectConflicts: protectedConflicts.length,
    bodyUploadReadiness: staticPassCount === TARGETS.length && livePassCount === TARGETS.length
      ? 'READY_AFTER_OWNER_APPROVAL_AND_WORDPRESS_BACKUP'
      : 'BLOCKED_REVIEW_REQUIRED',
    urlMigrationReadiness: 'BLOCKED_GSC_EXPORT_AND_PROTECTED_REDIRECT_REVIEW',
    estimatedContentUploadReadiness: 'BODY_PACKAGE_HIGH; EXECUTION_BLOCKED_BY_OWNER_APPROVAL_BACKUP_AND_GSC_FOR_URL_ACTIONS',
    gates: gateRows,
  };
  writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`Wrote ${path.relative(ROOT, OUT_CSV)}`);
  console.log(`Wrote ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`Static QA PASS: ${staticPassCount}/${TARGETS.length}`);
  console.log(`Live backup PASS: ${livePassCount}/${TARGETS.length}`);
  console.log(`Wave 1B metadata word-count mismatches: ${supportMetadataMismatchCount}`);
  console.log(`Protected source redirect conflicts: ${protectedConflicts.length}`);
}

main();
