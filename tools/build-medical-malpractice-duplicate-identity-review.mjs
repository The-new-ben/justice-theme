import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DEFAULT_IDS = ['11607', '1130'];
const CURRENT_URL = 'http://jus-tice.co.il/medical-malpractice-lawyer/';

const COLUMNS = [
  'review_id',
  'row_type',
  'post_id',
  'field',
  'value',
  'comparison_value',
  'risk',
  'recommended_owner_action',
  'required_before_action',
  'blocked_public_actions',
  'source_file',
  'notes',
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || todayIso(),
    ids: DEFAULT_IDS,
    inventory: path.join(ROOT, 'project-control', 'content-master-inventory.csv'),
    quality: path.join(ROOT, 'project-control', 'content-quality-audit.csv'),
    slugConflict: path.join(ROOT, 'project-control', 'slug-conflict-review.csv'),
    ownerPacket: '',
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg.startsWith('--ids=')) args.ids = arg.slice('--ids='.length).split(',').map((id) => id.trim()).filter(Boolean);
    else if (arg.startsWith('--inventory=')) args.inventory = path.resolve(arg.slice('--inventory='.length));
    else if (arg.startsWith('--quality=')) args.quality = path.resolve(arg.slice('--quality='.length));
    else if (arg.startsWith('--slugConflict=')) args.slugConflict = path.resolve(arg.slice('--slugConflict='.length));
    else if (arg.startsWith('--ownerPacket=')) args.ownerPacket = path.resolve(arg.slice('--ownerPacket='.length));
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  if (args.ids.length < 2) throw new Error('--ids must include at least two IDs');
  [args.inventory, args.quality, args.slugConflict].forEach((filePath) => {
    if (!existsSync(filePath)) throw new Error(`Missing input: ${path.relative(ROOT, filePath)}`);
  });

  if (!args.ownerPacket) {
    const sameDateOwnerPacket = path.join(
      ROOT,
      'project-control',
      `medical-malpractice-owner-decision-packet-${args.reportDate}.csv`,
    );
    args.ownerPacket = existsSync(sameDateOwnerPacket) ? sameDateOwnerPacket : '';
  }

  return args;
}

function printHelp() {
  console.log(`Medical Malpractice duplicate identity review

Usage:
  node tools/build-medical-malpractice-duplicate-identity-review.mjs --reportDate=YYYY-MM-DD
  node tools/build-medical-malpractice-duplicate-identity-review.mjs --ids=11607,1130

Outputs:
  reports/medical-malpractice-duplicate-identity-review-YYYY-MM-DD.csv
  reports/medical-malpractice-duplicate-identity-review-YYYY-MM-DD.json
  project-control/medical-malpractice-duplicate-identity-review-YYYY-MM-DD.csv
  project-control/medical-malpractice-duplicate-identity-review-YYYY-MM-DD.md
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
  if (!filePath || !existsSync(filePath)) return [];
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

function compact(value, max = 140) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function byId(rows) {
  return new Map(rows.map((row) => [row.id, row]));
}

function normalizeUrl(url) {
  return String(url || '').replace(/^https:/, 'http:').replace(/\/$/, '/');
}

function buildFiles(reportDate) {
  const base = `medical-malpractice-duplicate-identity-review-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function row({ index, rowType, postId = '', field, value, comparisonValue = '', risk, recommended, required, blocked, source, notes = '' }) {
  return {
    review_id: `MEDMAL-DUP-ID-${String(index).padStart(3, '0')}`,
    row_type: rowType,
    post_id: postId,
    field,
    value,
    comparison_value: comparisonValue,
    risk,
    recommended_owner_action: recommended,
    required_before_action: required,
    blocked_public_actions: blocked,
    source_file: source,
    notes,
  };
}

function buildRows({ args, inventoryRows, qualityRows, slugRows, ownerRows }) {
  const inventoryById = byId(inventoryRows);
  const qualityById = byId(qualityRows);
  const selected = args.ids.map((id) => {
    const inventory = inventoryById.get(id);
    const quality = qualityById.get(id) || {};
    if (!inventory) throw new Error(`Missing inventory row for ID ${id}`);
    return { id, inventory, quality };
  });

  const slugConflict = slugRows.find((item) => item.target_slug === 'medical-malpractice-lawyer') || {};
  const ownerDuplicateRows = ownerRows.filter((item) =>
    item.recommended_owner_decision === 'REVIEW_DUPLICATE_CMS_IDENTITY',
  );

  const blocked = 'NO_CMS_EDIT; NO_PUBLIC_UPLOAD; NO_URL_CHANGE; NO_REDIRECT; NO_CANONICAL_NOINDEX; NO_SITEMAP_CHANGE; NO_TAXONOMY_CHANGE';
  const required = 'owner CMS identity decision; WordPress editor/database backup for both IDs; focused GSC export before URL decisions; source/legal review before body upload';
  const rows = [];
  let index = 1;

  rows.push(row({
    index: index++,
    rowType: 'DUPLICATE_SUMMARY',
    field: 'same_public_url',
    value: CURRENT_URL,
    comparisonValue: selected.map((item) => `ID ${item.id}: ${item.inventory.current_slug}`).join(' | '),
    risk: 'P0_DUPLICATE_PUBLIC_URL',
    recommended: 'RESOLVE_AUTHORITATIVE_CMS_RECORD_BEFORE_UPLOAD',
    required,
    blocked,
    source: relPath(args.slugConflict),
    notes: `Slug conflict rows report ${slugConflict.conflict_count || 'UNKNOWN'} conflicts and ${slugConflict.exact_current_slug_count || selected.length} exact current slug records.`,
  }));

  selected.forEach((item) => {
    const { id, inventory, quality } = item;
    rows.push(row({
      index: index++,
      rowType: 'CMS_RECORD',
      postId: id,
      field: 'record_profile',
      value: [
        `title=${inventory.title}`,
        `slug=${inventory.current_slug}`,
        `words=${inventory.word_count}`,
        `quality=${quality.quality_score_1_10 || 'UNKNOWN'}`,
        `published=${inventory.date_published}`,
        `modified=${inventory.date_modified}`,
        `practice_area=${inventory.practice_area || 'EMPTY'}`,
        `media=${inventory.media_count || 0}`,
        `featured_image=${inventory.featured_image || 0}`,
        `internal_links_out=${inventory.internal_links_out ? 'YES' : 'NO'}`,
      ].join('; '),
      comparisonValue: selected
        .filter((other) => other.id !== id)
        .map((other) => `Compare ID ${other.id}: ${other.inventory.title}; words=${other.inventory.word_count}; quality=${other.quality.quality_score_1_10 || 'UNKNOWN'}`)
        .join(' | '),
      risk: normalizeUrl(inventory.current_url) === CURRENT_URL ? 'SAME_PUBLIC_URL' : 'URL_MISMATCH_REVIEW',
      recommended: id === slugConflict.proposed_primary_post_id
        ? 'CANDIDATE_AUTHORITATIVE_RECORD_AFTER_OWNER_REVIEW'
        : 'COMPARE_FOR_MERGE_ASSET_OR_HOLD_DECISION',
      required,
      blocked,
      source: `${relPath(args.inventory)} + ${relPath(args.quality)}`,
      notes: compact(inventory.excerpt, 260),
    }));
  });

  const [first, second] = selected;
  rows.push(row({
    index: index++,
    rowType: 'FIELD_DELTA',
    field: 'word_count_delta',
    value: `${first.id}: ${first.inventory.word_count}`,
    comparisonValue: `${second.id}: ${second.inventory.word_count}`,
    risk: 'CONTENT_MERGE_REVIEW',
    recommended: 'COMPARE_BODY_SECTIONS_BEFORE_OVERWRITE',
    required,
    blocked,
    source: relPath(args.inventory),
    notes: 'Different word counts indicate different body states behind the same public URL.',
  }));

  rows.push(row({
    index: index++,
    rowType: 'FIELD_DELTA',
    field: 'quality_media_links_delta',
    value: `${first.id}: quality=${first.quality.quality_score_1_10 || 'UNKNOWN'}; media=${first.inventory.media_count || 0}; links=${first.inventory.internal_links_out ? 'YES' : 'NO'}`,
    comparisonValue: `${second.id}: quality=${second.quality.quality_score_1_10 || 'UNKNOWN'}; media=${second.inventory.media_count || 0}; links=${second.inventory.internal_links_out ? 'YES' : 'NO'}`,
    risk: 'DO_NOT_DROP_USEFUL_ASSETS',
    recommended: 'IF_FIRST_ID_IS_AUTHORITATIVE_REVIEW_WHETHER_SECOND_ID_MEDIA_LINKS_OR_SECTIONS_SHOULD_BE_MERGED',
    required,
    blocked,
    source: `${relPath(args.inventory)} + ${relPath(args.quality)}`,
    notes: 'The newer record has more words; the older record has higher heuristic quality, a featured image and an outgoing internal link.',
  }));

  rows.push(row({
    index: index++,
    rowType: 'FIELD_DELTA',
    field: 'taxonomy_delta',
    value: `${first.id}: practice_area=${first.inventory.practice_area || 'EMPTY'}`,
    comparisonValue: `${second.id}: practice_area=${second.inventory.practice_area || 'EMPTY'}`,
    risk: 'TAXONOMY_ID_MISMATCH',
    recommended: 'CONFIRM_CANONICAL_MEDICAL_MALPRACTICE_TAXONOMY_BEFORE_CMS_SAVE',
    required: 'taxonomy owner decision; source/legal review; current URL backup',
    blocked,
    source: relPath(args.inventory),
    notes: 'Different practice_area IDs suggest taxonomy drift; do not normalize taxonomy during body upload unless explicitly approved.',
  }));

  rows.push(row({
    index: index++,
    rowType: 'OWNER_PACKET_LINK',
    field: 'duplicate_decision_rows',
    value: `${ownerDuplicateRows.length} duplicate identity decision rows in current owner packet`,
    comparisonValue: ownerDuplicateRows.map((item) => `${item.decision_id}:${item.source_row_id}`).join(' | '),
    risk: 'OWNER_DECISION_REQUIRED',
    recommended: 'OWNER_MARKS_AUTHORITATIVE_RECORD_OR_HOLD',
    required,
    blocked,
    source: args.ownerPacket ? relPath(args.ownerPacket) : 'NOT_AVAILABLE',
    notes: 'Valid decisions: KEEP_11607_AS_AUTHORITATIVE, KEEP_1130_AS_AUTHORITATIVE, MERGE_1130_ASSETS_INTO_11607, HOLD_PENDING_WP_ADMIN_DB_CHECK.',
  }));

  rows.push(row({
    index: index++,
    rowType: 'RECOMMENDED_SAFE_PATH',
    field: 'pre_upload_sequence',
    value: '1 backup both IDs; 2 verify wp-admin/database canonical served record; 3 compare body/media/links; 4 choose authoritative record; 5 merge only approved assets; 6 keep current URL until GSC migration approval',
    comparisonValue: '',
    risk: 'UPLOAD_BLOCKED_UNTIL_RESOLVED',
    recommended: 'HOLD_MEDICAL_MALPRACTICE_UPLOAD_UNTIL_DUPLICATE_IDENTITY_IS_RESOLVED',
    required,
    blocked,
    source: 'DERIVED_FROM_LOCAL_EXPORTS',
    notes: 'This packet is a decision aid only and does not select a final CMS record.',
  }));

  return rows;
}

function buildSummary({ args, rows, inventoryRows, qualityRows, slugRows }) {
  const selectedInventory = args.ids.map((id) => inventoryRows.find((row) => row.id === id)).filter(Boolean);
  const selectedQuality = args.ids.map((id) => qualityRows.find((row) => row.id === id)).filter(Boolean);
  const currentUrls = new Set(selectedInventory.map((row) => normalizeUrl(row.current_url)));
  const contentHashes = new Set(selectedInventory.map((row) => row.content_hash));
  const slugConflict = slugRows.find((row) => row.target_slug === 'medical-malpractice-lawyer') || {};

  return {
    reportDate: args.reportDate,
    reviewedIds: args.ids,
    outputRows: rows.length,
    samePublicUrl: currentUrls.size === 1 && currentUrls.has(CURRENT_URL),
    distinctContentHashes: contentHashes.size,
    slugConflictCount: slugConflict.conflict_count || '',
    exactCurrentSlugCount: slugConflict.exact_current_slug_count || '',
    proposedPrimaryPostId: slugConflict.proposed_primary_post_id || '',
    qualityScores: Object.fromEntries(selectedQuality.map((row) => [row.id, row.quality_score_1_10 || 'UNKNOWN'])),
    wordCounts: Object.fromEntries(selectedInventory.map((row) => [row.id, row.word_count || 'UNKNOWN'])),
    uploadApproved: false,
    publicChanges: false,
  };
}

function markdownTable(rows) {
  return rows.map((item) => (
    `| ${item.post_id || '-'} | ${item.field} | ${compact(item.value, 90)} | ${compact(item.comparison_value, 90)} | ${item.risk} | ${item.recommended_owner_action} |`
  )).join('\n');
}

function buildMarkdown(rows, summary) {
  const recordRows = rows.filter((row) => row.row_type === 'CMS_RECORD');
  const deltaRows = rows.filter((row) => row.row_type === 'FIELD_DELTA');
  const decisionRows = rows.filter((row) => row.row_type !== 'CMS_RECORD' && row.row_type !== 'FIELD_DELTA');

  return `# Medical Malpractice Duplicate Identity Review - ${summary.reportDate}

## Status

FIXED local review packet. VERIFIED local generation completed from repo exports. NOT VERIFIED in wp-admin/database and NOT VERIFIED by focused GSC API export.

REVIEW ONLY: this file does not approve a CMS edit, content overwrite, URL change, redirect, canonical/noindex change, sitemap change, taxonomy edit, internal-link write, media change, schema change, lawyer-card change or CRM change.

## Batch Completed

- Reviewed CMS IDs: \`${summary.reviewedIds.join(', ')}\`.
- Output rows: \`${summary.outputRows}\`.
- Same public URL in local export: \`${summary.samePublicUrl ? 'YES' : 'NO'}\`.
- Distinct content hashes: \`${summary.distinctContentHashes}\`.
- Slug conflict count: \`${summary.slugConflictCount || 'UNKNOWN'}\`.
- Exact current records in slug conflict review: \`${summary.exactCurrentSlugCount || 'UNKNOWN'}\`.
- Slug-conflict proposed primary post ID: \`${summary.proposedPrimaryPostId || 'UNKNOWN'}\`.
- Upload approved now: \`0\`.

## Record Comparison

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
${markdownTable(recordRows)}

## Material Differences

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
${markdownTable(deltaRows)}

## Decision Rows

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
${markdownTable(decisionRows)}

## Practical Interpretation

- ID \`11607\` is the newer commercial-title candidate and is the proposed primary in the slug-conflict review, but it has lower heuristic quality, no featured image and no detected outgoing internal links.
- ID \`1130\` is older and shorter, but it has a higher heuristic quality score, a featured image and at least one outgoing internal link.
- Both records share the same public URL in the local export, so public upload must not proceed until wp-admin/database confirms which record is actually authoritative and how WordPress is resolving the duplicate slug state.

## Allowed Owner Decisions

- \`KEEP_11607_AS_AUTHORITATIVE\`: use ID 11607 as the current URL update target after backup and review.
- \`KEEP_1130_AS_AUTHORITATIVE\`: use ID 1130 as the current URL update target after backup and review.
- \`MERGE_1130_ASSETS_INTO_11607\`: keep 11607 as authoritative but manually review whether 1130 sections, image or links should be preserved.
- \`HOLD_PENDING_WP_ADMIN_DB_CHECK\`: do not upload Medical Malpractice until the actual CMS state is inspected.

## Minimum Checklist Before Medical Malpractice CMS Upload

1. Export WordPress editor values and database rollback material for both IDs.
2. Confirm in wp-admin/database which post ID owns the rendered public URL and canonical permalink.
3. Compare body sections, featured image, internal links, taxonomy, title/H1/meta and modified dates.
4. Decide whether any content/media/link assets from the non-authoritative record should be merged.
5. Keep the current URL; do not create or migrate to another slug in this step.
6. Run focused GSC export before any redirect, canonical/noindex, sitemap or slug migration decision.
7. Complete source/legal review before public body update.

## Still Blocked

- BLOCKED: authoritative CMS record decision.
- BLOCKED: WordPress editor/database rollback backup.
- BLOCKED: focused Medical Malpractice GSC export.
- BLOCKED: source/legal review.
- BLOCKED: public CMS upload, URL migration, redirects, canonicals, noindex, sitemap, taxonomy and internal-link writes.

## Outputs

- \`reports/medical-malpractice-duplicate-identity-review-${summary.reportDate}.csv\`
- \`reports/medical-malpractice-duplicate-identity-review-${summary.reportDate}.json\`
- \`project-control/medical-malpractice-duplicate-identity-review-${summary.reportDate}.csv\`

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const inventoryRows = readCsv(args.inventory);
  const qualityRows = readCsv(args.quality);
  const slugRows = readCsv(args.slugConflict);
  const ownerRows = readCsv(args.ownerPacket);
  const rows = buildRows({ args, inventoryRows, qualityRows, slugRows, ownerRows });
  const summary = buildSummary({ args, rows, inventoryRows, qualityRows, slugRows });
  const files = buildFiles(args.reportDate);

  const csv = toCsv(rows, COLUMNS);
  const json = `${JSON.stringify({ summary, rows }, null, 2)}\n`;
  const md = buildMarkdown(rows, summary);

  writeText(files.reportCsv, csv);
  writeText(files.projectCsv, csv);
  writeText(files.reportJson, json);
  writeText(files.projectMd, md);

  console.log(JSON.stringify({
    reportDate: args.reportDate,
    reviewedIds: summary.reviewedIds,
    outputRows: summary.outputRows,
    samePublicUrl: summary.samePublicUrl,
    distinctContentHashes: summary.distinctContentHashes,
    slugConflictCount: summary.slugConflictCount,
    proposedPrimaryPostId: summary.proposedPrimaryPostId,
    outputs: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, relPath(value)])),
  }, null, 2));
}

main();
