import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DASHBOARD_PREFIX = 'criminal-traffic-readiness-dashboard';

const COLUMNS = [
  'target_id',
  'priority',
  'current_url',
  'future_slug_candidate',
  'draft_file',
  'draft_word_count',
  'page_role',
  'owner_decision',
  'review_status',
  'required_before_upload',
  'blocked_public_actions',
  'source_legal_review',
  'anti_cannibalization_notes',
  'current_url_strategy',
  'post_approval_cms_action',
  'next_step',
];

const PAGE_NOTES = {
  'CRIM-UPLOAD-PKG-001': {
    required:
      'Owner/legal/source approval; WordPress editor/database rollback backup; final metadata and disclaimers review; no fake lawyer/rating/trust claims',
    blocked:
      'No CMS upload; no /criminal-lawyer/ slug migration; no redirect; no canonical/noindex; no sitemap; no taxonomy/internal-link writes; no lawyer-card/schema changes',
    source:
      'Source anchors exist in prior Criminal planning packet; owner/legal review still required for criminal-process language and service claims',
    cannibalization:
      'Keep as the current criminal-law pillar on /criminal-defense-attorney/; do not create /criminal-lawyer/ yet; protect high-impression criminal support URLs until GSC/owner review',
    urlStrategy:
      'Update current URL only after approval; future /criminal-lawyer/ migration remains blocked by GSC and owner URL review',
    cmsAction:
      'After approval and backup, update the existing /criminal-defense-attorney/ page body only; do not create a duplicate clean-slug page',
  },
  'CRIM-UPLOAD-PKG-002': {
    required:
      'Owner/legal/source approval; WordPress rollback backup; rights/process wording review; final internal-link check to current URLs only',
    blocked:
      'No CMS upload; no /police-investigation/ slug migration; no redirects; no canonical/noindex; no sitemap; no taxonomy/related-card writes',
    source:
      'Partial source verification only; legal review required for interrogation rights, consultation timing, silence/cooperation framing and disclaimer language',
    cannibalization:
      'Keep police-investigation advice separate from police-station directory/list pages and from the general criminal-law pillar',
    urlStrategy:
      'Update current Hebrew URL only after approval; future /police-investigation/ migration remains blocked',
    cmsAction:
      'After approval and backup, update the existing police-investigation Hebrew URL page; preserve current URL until migration package is approved',
  },
  'CRIM-UPLOAD-PKG-003': {
    required:
      'Owner/legal/source approval; WordPress rollback backup; detention time/release wording review; merge/expand decision for secondary detention URL',
    blocked:
      'No CMS upload; no /pretrial-detention/ slug migration; no redirects; no canonical/noindex; no sitemap; no blind merge with detention-days page',
    source:
      'Partial source verification only; legal review required for time limits, detention stages, release alternatives and no-guarantee wording',
    cannibalization:
      'Keep pretrial detention support distinct from general criminal defense and from narrower detention-days/current variants until GSC/owner review',
    urlStrategy:
      'Update /detention-before-charge-or-trial/ only after approval; hold /detention-days/ and future /pretrial-detention/ migration for URL review',
    cmsAction:
      'After approval and backup, update the existing detention page body only; do not merge or redirect secondary detention URL in this upload',
  },
  'CRIM-UPLOAD-PKG-004': {
    required:
      'Owner/legal/source approval; WordPress rollback backup; hearing/deadline/cancellation wording review; protection check for case-specific indictment pages',
    blocked:
      'No CMS upload; no /indictment/ slug migration; no redirect; no canonical/noindex; no sitemap; no treating case-specific pages as general guides',
    source:
      'Uses new source anchors from 2026-05-22 draft closure; legal review still required for conditional arrangement, cancellation and hearing language',
    cannibalization:
      'Keep general indictment guide separate from case-specific public-interest pages, including the Netanyahu indictment signal noted in prior GSC work',
    urlStrategy:
      'Update current articles URL only after approval; future /indictment/ migration remains blocked by GSC/owner review',
    cmsAction:
      'After approval and backup, update existing indictment article only; do not redirect or canonicalize related indictment pages in this upload',
  },
  'CRIM-UPLOAD-PKG-005': {
    required:
      'Owner/legal/source approval; WordPress rollback backup; offense/threshold/penalty wording review; drug-driving and cannabis-only boundary check',
    blocked:
      'No CMS upload; no /drug-offenses/ duplicate page; no redirects; no canonical/noindex; no sitemap; no penalty claims without review',
    source:
      'Uses new source anchors from 2026-05-22 draft closure; legal review still required for drug-offense categories, cannabis fine limits and public-defender references',
    cannibalization:
      'Keep drug-offense support separate from traffic drugged-driving pages, cannabis-fine service pages and existing /drug-related-crime/ support URL until GSC review',
    urlStrategy:
      'Update /drug-offenses-criminal-lawyer/ only after approval; future /drug-offenses/ migration remains blocked',
    cmsAction:
      'After approval and backup, update the existing drug-offenses page only; do not create a duplicate /drug-offenses/ page',
  },
};

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
    input: process.env.CRIMINAL_TRAFFIC_DASHBOARD_CSV || '',
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

  const sameDateInput = path.join(ROOT, 'reports', `${DASHBOARD_PREFIX}-${args.reportDate}.csv`);
  args.input = args.input ? path.resolve(args.input) : sameDateInput;
  if (!existsSync(args.input)) {
    throw new Error(`Missing dashboard input: ${path.relative(ROOT, args.input)}`);
  }

  return args;
}

function buildFiles(reportDate) {
  const base = `criminal-owner-review-packet-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function printHelp() {
  console.log(`Criminal owner review packet

Usage:
  node tools/build-criminal-owner-review-packet.mjs
  node tools/build-criminal-owner-review-packet.mjs --reportDate=YYYY-MM-DD
  node tools/build-criminal-owner-review-packet.mjs --reportDate=YYYY-MM-DD --input=reports/criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv

Inputs:
  reports/criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv

Outputs:
  reports/criminal-owner-review-packet-YYYY-MM-DD.csv
  reports/criminal-owner-review-packet-YYYY-MM-DD.json
  project-control/criminal-owner-review-packet-YYYY-MM-DD.csv
  project-control/criminal-owner-review-packet-YYYY-MM-DD.md
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

function shortUrl(value) {
  if (!value) return '';
  try {
    return new URL(value).pathname || value;
  } catch (_err) {
    return value;
  }
}

function buildRows(dashboardRows) {
  const uploadRows = dashboardRows
    .filter((row) => row.lane === 'CRIMINAL_FIRST_UPLOAD_TARGET')
    .sort((left, right) => left.priority.localeCompare(right.priority));

  if (uploadRows.length !== 5) {
    throw new Error(`Expected 5 Criminal first-upload targets, found ${uploadRows.length}`);
  }

  return uploadRows.map((row) => {
    const notes = PAGE_NOTES[row.source_id];
    if (!notes) throw new Error(`Missing page notes for ${row.source_id}`);

    return {
      target_id: row.source_id,
      priority: row.priority,
      current_url: shortUrl(row.current_url),
      future_slug_candidate: row.target_url_or_hub || '',
      draft_file: draftPath(row.source_id),
      draft_word_count: row.draft_word_count,
      page_role: row.role_or_topic,
      owner_decision: 'PENDING_OWNER_DECISION',
      review_status: 'READY_FOR_OWNER_LEGAL_SOURCE_REVIEW_NOT_UPLOAD',
      required_before_upload: notes.required,
      blocked_public_actions: notes.blocked,
      source_legal_review: notes.source,
      anti_cannibalization_notes: notes.cannibalization,
      current_url_strategy: notes.urlStrategy,
      post_approval_cms_action: notes.cmsAction,
      next_step: 'Owner marks APPROVE_CURRENT_URL_UPDATE, EDIT_REQUIRED, HOLD or LEGAL_REVIEW_REQUIRED before any CMS work',
    };
  });
}

function draftPath(targetId) {
  const byTargetId = {
    'CRIM-UPLOAD-PKG-001': 'content-drafts/criminal-lawyer-pillar-he.md',
    'CRIM-UPLOAD-PKG-002': 'content-drafts/police-investigation-supporting-he.md',
    'CRIM-UPLOAD-PKG-003': 'content-drafts/pretrial-detention-supporting-he.md',
    'CRIM-UPLOAD-PKG-004': 'content-drafts/indictment-supporting-he.md',
    'CRIM-UPLOAD-PKG-005': 'content-drafts/drug-offenses-supporting-he.md',
  };
  return byTargetId[targetId] || '';
}

function summarize(rows) {
  return {
    generatedAt: new Date().toISOString(),
    finality: 'REVIEW_ONLY_NO_PUBLIC_CHANGES',
    cluster: 'criminal-law',
    totalReviewRows: rows.length,
    readyForOwnerReview: rows.filter((row) => row.review_status === 'READY_FOR_OWNER_LEGAL_SOURCE_REVIEW_NOT_UPLOAD').length,
    pendingOwnerDecision: rows.filter((row) => row.owner_decision === 'PENDING_OWNER_DECISION').length,
    firstReviewTarget: '/criminal-defense-attorney/',
    approvedForUpload: 0,
    publicActionsBlocked: [
      'CMS upload',
      'English slug migration',
      'Redirects',
      'Canonical/noindex changes',
      'Sitemap changes',
      'Taxonomy edits',
      'Internal-link and related-card writes',
      'Lawyer-card/schema/CRM changes',
    ],
  };
}

function table(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => csvEscape(column.value(row)).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

function markdownSummary(reportDate, files, inputPath, summary, rows) {
  return `# Criminal Owner Review Packet - ${reportDate}

## Status
- VERIFIED LOCAL: generated from \`${relPath(inputPath)}\`.
- READY FOR OWNER REVIEW / NOT APPROVED FOR CMS UPLOAD.
- REVIEW ONLY: this packet does not approve public CMS edits, URL slug changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy edits, related-card edits, schema changes, lawyer-card changes, CRM changes, wp-admin changes or database writes.

## Batch Completed
- Criminal first-upload current-URL targets reviewed: \`${summary.totalReviewRows}\`.
- Rows ready for owner/legal/source review: \`${summary.readyForOwnerReview}\`.
- Rows still pending owner decision: \`${summary.pendingOwnerDecision}\`.
- First recommended review target: \`${summary.firstReviewTarget}\`.

## Page Review Matrix
${table(rows, [
    { label: 'Target', value: (row) => row.target_id },
    { label: 'Priority', value: (row) => row.priority },
    { label: 'Current URL', value: (row) => row.current_url },
    { label: 'Future slug', value: (row) => row.future_slug_candidate },
    { label: 'Draft', value: (row) => row.draft_file },
    { label: 'Words', value: (row) => row.draft_word_count },
    { label: 'Owner decision', value: (row) => row.owner_decision },
    { label: 'Status', value: (row) => row.review_status },
  ])}

## Allowed Owner Decisions
- \`APPROVE_CURRENT_URL_UPDATE\`: content may move to the CMS operator checklist after WordPress editor/database backup.
- \`EDIT_REQUIRED\`: owner provides concrete edits before CMS work.
- \`HOLD\`: page is excluded from the first Criminal upload wave.
- \`LEGAL_REVIEW_REQUIRED\`: page needs lawyer/source review before upload.

## Minimum Approval Checklist
MUST PASS BEFORE CMS UPDATE:
1. Owner marks each row with one allowed decision.
2. Owner/legal/source review confirms the page is general informational content and does not make legal advice, result, guarantee, rating, recommendation or fake-trust claims.
3. WordPress operator exports actual editor/database rollback material for every approved current URL before editing.
4. Operator updates existing current URLs only; no duplicate clean-slug pages are created.
5. Final title, H1, meta description, canonical, robots, taxonomy and disclaimer posture are checked before save.
6. Internal links inside approved pages point only to intended live current URLs.
7. No redirect, noindex, canonical migration, deletion, taxonomy restructure or sitemap change is bundled with body upload.
8. Post-upload QA checks HTTP status, final path, title, H1, canonical, robots, body text and broken links.
9. Desktop/mobile screenshots are captured only after each page remains on its own final path.

## Recommended Review Order
1. \`/criminal-defense-attorney/\`
2. Police investigation current Hebrew URL
3. \`/detention-before-charge-or-trial/\`
4. Current indictment article URL
5. \`/drug-offenses-criminal-lawyer/\`

## Anti-Cannibalization Controls
- Keep \`/criminal-defense-attorney/\` as the current criminal pillar until GSC/owner review approves any future \`/criminal-lawyer/\` migration.
- Keep police-investigation advice separate from police-station directory/list pages.
- Keep pretrial detention separate from the general criminal pillar and from narrower detention variants until merge/redirect review.
- Keep indictment guidance separate from case-specific indictment pages.
- Keep drug offenses separate from traffic drug-driving and cannabis-only/service intents.

## Can Wait
- Clean English slug migrations for \`/criminal-lawyer/\`, \`/police-investigation/\`, \`/pretrial-detention/\`, \`/indictment/\` and \`/drug-offenses/\`.
- Redirect package, canonical/noindex decisions and sitemap expansion.
- Taxonomy cleanup and related-card/internal-link writes.
- Broad Criminal support-page rewrites outside the five first-upload targets.

## Still Blocked
- BLOCKED: owner/legal/source approval.
- BLOCKED: actual WordPress editor/database rollback backup.
- BLOCKED: focused GSC/API export and final owner URL review before any slug migration or redirect package.
- BLOCKED: sitemap, canonical, noindex, taxonomy and related/internal-link changes.
- BLOCKED: public visual QA because no public upload happened.

## Outputs
- \`${relPath(files.reportCsv)}\`
- \`${relPath(files.reportJson)}\`
- \`${relPath(files.projectCsv)}\`

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = buildFiles(args.reportDate);
  const dashboardRows = readCsv(args.input);
  const rows = buildRows(dashboardRows);
  const summary = summarize(rows);

  writeText(files.reportCsv, toCsv(rows, COLUMNS));
  writeText(files.projectCsv, toCsv(rows, COLUMNS));
  writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(files.projectMd, markdownSummary(args.reportDate, files, args.input, summary, rows));

  console.log(`Wrote ${relPath(files.reportCsv)} (${rows.length} rows)`);
  console.log(`Wrote ${relPath(files.reportJson)}`);
  console.log(`Wrote ${relPath(files.projectCsv)}`);
  console.log(`Wrote ${relPath(files.projectMd)}`);
  console.log(JSON.stringify(summary, null, 2));
}

main();
