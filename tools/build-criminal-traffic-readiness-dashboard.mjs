import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const INPUTS = {
  criminalUpload: path.join(ROOT, '.project-control', 'criminal-law-owner-upload-review-package-2026-05-11.csv'),
  criminalHubMap: path.join(ROOT, '.project-control', 'criminal-law-support-to-hub-map-2026-05-18.csv'),
  trafficHubMap: path.join(ROOT, '.project-control', 'traffic-law-support-to-hub-map-2026-05-18.csv'),
  targetedGsc: path.join(ROOT, '.project-control', 'gsc-targeted-query-pass-3-2026-05-11.csv'),
  wrongPagePacket: path.join(ROOT, '.project-control', 'traffic-criminal-wrong-page-decision-packet-2026-05-11.csv'),
};

const DRAFTS = [
  {
    key: 'criminal_pillar',
    targetId: 'CRIM-UPLOAD-PKG-001',
    file: path.join(ROOT, '.content-drafts', 'criminal-lawyer-pillar-he.md'),
  },
  {
    key: 'police_investigation',
    targetId: 'CRIM-UPLOAD-PKG-002',
    file: path.join(ROOT, '.content-drafts', 'police-investigation-supporting-he.md'),
  },
  {
    key: 'pretrial_detention',
    targetId: 'CRIM-UPLOAD-PKG-003',
    file: path.join(ROOT, '.content-drafts', 'pretrial-detention-supporting-he.md'),
  },
  {
    key: 'indictment',
    targetId: 'CRIM-UPLOAD-PKG-004',
    file: path.join(ROOT, '.content-drafts', 'indictment-supporting-he.md'),
  },
  {
    key: 'drug_offenses',
    targetId: 'CRIM-UPLOAD-PKG-005',
    file: path.join(ROOT, '.content-drafts', 'drug-offenses-supporting-he.md'),
  },
];

const REQUIRED_SOURCES = [
  'criminalUpload',
  'criminalHubMap',
  'trafficHubMap',
  'targetedGsc',
  'wrongPagePacket',
];

const COLUMNS = [
  'row_id',
  'lane',
  'source_id',
  'cluster',
  'priority',
  'current_url',
  'secondary_url',
  'target_url_or_hub',
  'role_or_topic',
  'decision_status',
  'readiness_status',
  'traffic_risk',
  'gsc_clicks',
  'gsc_impressions',
  'content_draft_status',
  'draft_word_count',
  'source_legal_status',
  'internal_link_status',
  'url_action_status',
  'next_step',
  'blocked_actions',
  'notes',
];

function dateDaysAgo(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || dateDaysAgo(0),
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

function outputFiles(reportDate) {
  const base = `criminal-traffic-readiness-dashboard-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
  };
}

function printHelp() {
  console.log(`Criminal/Traffic readiness dashboard

Usage:
  node tools/build-criminal-traffic-readiness-dashboard.mjs
  node tools/build-criminal-traffic-readiness-dashboard.mjs --reportDate=YYYY-MM-DD

Inputs:
  .project-control/criminal-law-owner-upload-review-package-2026-05-11.csv
  .project-control/criminal-law-support-to-hub-map-2026-05-18.csv
  .project-control/traffic-law-support-to-hub-map-2026-05-18.csv
  .project-control/gsc-targeted-query-pass-3-2026-05-11.csv
  .project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv

Outputs:
  .reports/criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv
  .reports/criminal-traffic-readiness-dashboard-YYYY-MM-DD.json
  .project-control/criminal-traffic-readiness-dashboard-YYYY-MM-DD.csv
  .project-control/criminal-traffic-readiness-dashboard-YYYY-MM-DD.md
`);
}

function assertInputs() {
  const missing = REQUIRED_SOURCES
    .map((key) => INPUTS[key])
    .filter((filePath) => !existsSync(filePath));

  if (missing.length) {
    throw new Error(`Missing required input files:\n${missing.map((filePath) => `- ${path.relative(ROOT, filePath)}`).join('\n')}`);
  }
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

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '').replace(/,/g, '')) || 0;
}

function shortUrl(value) {
  if (!value) return '';
  try {
    return new URL(value).pathname || value;
  } catch (_err) {
    return value;
  }
}

function draftInventory() {
  const byTargetId = new Map();
  const list = DRAFTS.map((draft) => {
    if (!existsSync(draft.file)) {
      const missing = {
        key: draft.key,
        targetId: draft.targetId,
        file: path.relative(ROOT, draft.file),
        status: 'MISSING_DRAFT',
        wordCount: 0,
      };
      byTargetId.set(draft.targetId, missing);
      return missing;
    }

    const body = readFileSync(draft.file, 'utf8')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`[\]()!-]/g, ' ');
    const words = body.trim() ? body.trim().split(/\s+/).filter(Boolean) : [];
    const item = {
      key: draft.key,
      targetId: draft.targetId,
      file: path.relative(ROOT, draft.file),
      status: words.length >= 1200 ? 'DRAFT_PRESENT_LONG_FORM' : 'DRAFT_PRESENT_REVIEW_LENGTH',
      wordCount: words.length,
    };
    byTargetId.set(draft.targetId, item);
    return item;
  });

  return { byTargetId, list };
}

function targetDraftStatus(targetId, drafts) {
  const draft = drafts.byTargetId.get(targetId);
  if (!draft) return { status: 'MISSING_DRAFT', wordCount: 0 };
  return { status: draft.status, wordCount: draft.wordCount };
}

function trafficRiskFromMetrics(clicks, impressions, fallback = '') {
  const clickCount = numberValue(clicks);
  const impressionCount = numberValue(impressions);
  if (clickCount >= 50 || impressionCount >= 25000) return 'HIGH';
  if (clickCount > 0 || impressionCount >= 5000) return 'MEDIUM';
  return fallback || 'LOW';
}

function hubMapReadiness(row, lane) {
  const target = row.target_hub || '';
  if (/BOUNDARY|HOLD/i.test(target)) return 'BOUNDARY_HOLD_REVIEW';
  if (lane === 'TRAFFIC_SUPPORT_MAP' && /traffic-lawyer/i.test(target)) return 'SUPPORT_TO_TRAFFIC_HUB_REVIEW';
  if (lane === 'CRIMINAL_SUPPORT_MAP' && /criminal-defense-attorney/i.test(target)) return 'SUPPORT_TO_CRIMINAL_HUB_REVIEW';
  return 'SUPPORT_LINK_REVIEW';
}

function hubUrlAction(row) {
  const target = row.target_hub || '';
  if (/BOUNDARY|HOLD/i.test(target)) return 'NOT_CHANGED; DO_NOT_MERGE_BOUNDARY_PAGE';
  return 'NOT_CHANGED; INTERNAL_LINK_ONLY_AFTER_OWNER_APPROVAL';
}

function buildRows(inputs, drafts) {
  const rows = [];

  inputs.criminalUpload.forEach((row, index) => {
    const draft = targetDraftStatus(row.target_id, drafts);
    rows.push({
      row_id: `CTD-${String(rows.length + 1).padStart(3, '0')}`,
      lane: 'CRIMINAL_FIRST_UPLOAD_TARGET',
      source_id: row.target_id || `criminal-upload-${index + 1}`,
      cluster: 'criminal-law',
      priority: row.drafting_priority || '',
      current_url: row.current_url || '',
      secondary_url: row.secondary_current_url || '',
      target_url_or_hub: row.future_slug_blocked || row.current_url || '',
      role_or_topic: row.page_role || '',
      decision_status: row.status || '',
      readiness_status: row.status === 'READY_FOR_OWNER_REVIEW' ? 'READY_FOR_OWNER_REVIEW_NOT_UPLOAD' : row.status,
      traffic_risk: row.current_url_status === 'VERIFIED_200_SELF_CANONICAL' ? 'PROTECTED_CURRENT_URL' : 'UNKNOWN_NEEDS_GSC',
      gsc_clicks: '',
      gsc_impressions: '',
      content_draft_status: draft.status,
      draft_word_count: draft.wordCount,
      source_legal_status: row.source_gate_status || '',
      internal_link_status: row.internal_link_status || '',
      url_action_status: 'NO_URL_CHANGE_APPROVED; FUTURE_SLUG_BLOCKED',
      next_step: row.next_step || '',
      blocked_actions: row.blocked_actions || '',
      notes: row.pre_upload_requirements || '',
    });
  });

  inputs.criminalHubMap.forEach((row, index) => {
    rows.push({
      row_id: `CTD-${String(rows.length + 1).padStart(3, '0')}`,
      lane: 'CRIMINAL_SUPPORT_MAP',
      source_id: `criminal-support-${String(index + 1).padStart(3, '0')}`,
      cluster: 'criminal-law',
      priority: row.priority || '',
      current_url: row.source_url || '',
      secondary_url: '',
      target_url_or_hub: row.target_hub || '',
      role_or_topic: row.anchor_direction || '',
      decision_status: row.public_change_status || '',
      readiness_status: hubMapReadiness(row, 'CRIMINAL_SUPPORT_MAP'),
      traffic_risk: trafficRiskFromMetrics(row.gsc_clicks, row.gsc_impressions),
      gsc_clicks: row.gsc_clicks || '',
      gsc_impressions: row.gsc_impressions || '',
      content_draft_status: 'NOT_A_FIRST_UPLOAD_DRAFT',
      draft_word_count: '',
      source_legal_status: 'NEEDS_CONTENT_REVIEW_BEFORE_REWRITE',
      internal_link_status: 'PLANNED_ONLY_AFTER_OWNER_APPROVAL',
      url_action_status: hubUrlAction(row),
      next_step: 'Protect existing ranking value; decide rewrite/link role before upload batch',
      blocked_actions: 'No redirect, no canonical/noindex, no slug migration, no blind merge',
      notes: row.notes || '',
    });
  });

  inputs.trafficHubMap.forEach((row, index) => {
    rows.push({
      row_id: `CTD-${String(rows.length + 1).padStart(3, '0')}`,
      lane: 'TRAFFIC_SUPPORT_MAP',
      source_id: `traffic-support-${String(index + 1).padStart(3, '0')}`,
      cluster: 'traffic-law',
      priority: row.priority || '',
      current_url: row.source_url || '',
      secondary_url: '',
      target_url_or_hub: row.target_hub || '',
      role_or_topic: row.anchor_direction || '',
      decision_status: row.public_change_status || '',
      readiness_status: hubMapReadiness(row, 'TRAFFIC_SUPPORT_MAP'),
      traffic_risk: trafficRiskFromMetrics(row.gsc_clicks, row.gsc_impressions),
      gsc_clicks: row.gsc_clicks || '',
      gsc_impressions: row.gsc_impressions || '',
      content_draft_status: 'NOT_A_FIRST_UPLOAD_DRAFT',
      draft_word_count: '',
      source_legal_status: 'NEEDS_CONTENT_REVIEW_BEFORE_REWRITE',
      internal_link_status: 'PLANNED_ONLY_AFTER_OWNER_APPROVAL',
      url_action_status: hubUrlAction(row),
      next_step: 'Separate traffic, criminal and personal-injury intent before any upload or link expansion',
      blocked_actions: 'No redirect, no canonical/noindex, no slug migration, no blind merge',
      notes: row.notes || '',
    });
  });

  inputs.targetedGsc.forEach((row, index) => {
    rows.push({
      row_id: `CTD-${String(rows.length + 1).padStart(3, '0')}`,
      lane: 'TARGETED_GSC_SIGNAL',
      source_id: `gsc-pass3-${String(index + 1).padStart(3, '0')}`,
      cluster: /TRAFFIC|driver|license|drunk/i.test(`${row.recommended_action} ${row.notes}`) ? 'traffic-law' : 'criminal-law',
      priority: row.classification === 'WRONG_PAGE_MATCH' ? 'P0' : 'P2',
      current_url: row.page_url || '',
      secondary_url: '',
      target_url_or_hub: '',
      role_or_topic: row.query || '',
      decision_status: row.classification || '',
      readiness_status: row.classification === 'WRONG_PAGE_MATCH' ? 'WRONG_PAGE_PROTECTION_NEEDED' : 'LOW_EVIDENCE_RECHECK_LATER',
      traffic_risk: row.traffic_risk || '',
      gsc_clicks: row.page_clicks || row.total_clicks || '',
      gsc_impressions: row.page_impressions || row.total_impressions || '',
      content_draft_status: 'SIGNAL_ONLY',
      draft_word_count: '',
      source_legal_status: 'N/A',
      internal_link_status: 'N/A',
      url_action_status: row.classification === 'WRONG_PAGE_MATCH'
        ? 'PROTECT_CURRENT_PAGE; DO_NOT_OPTIMIZE_FOR_WRONG_INTENT'
        : 'NO_ACTION_FROM_LOW_SAMPLE_SIGNAL',
      next_step: row.recommended_action || '',
      blocked_actions: 'No public change from this row alone',
      notes: row.notes || '',
    });
  });

  inputs.wrongPagePacket.forEach((row) => {
    rows.push({
      row_id: `CTD-${String(rows.length + 1).padStart(3, '0')}`,
      lane: 'WRONG_PAGE_DECISION_PACKET',
      source_id: row.decision_id || '',
      cluster: row.cluster || '',
      priority: row.classification === 'WRONG_PAGE_MATCH' ? 'P0' : 'P1',
      current_url: row.current_url || '',
      secondary_url: '',
      target_url_or_hub: row.proposed_or_candidate_url || '',
      role_or_topic: row.query_or_topic || '',
      decision_status: row.decision || '',
      readiness_status: row.approval_status || '',
      traffic_risk: row.classification === 'PILLAR_MIGRATION_RISK' ? 'HIGH' : 'MEDIUM',
      gsc_clicks: '',
      gsc_impressions: '',
      content_draft_status: 'DECISION_PACKET_ONLY',
      draft_word_count: '',
      source_legal_status: 'NEEDS_SOURCE_AND_OWNER_REVIEW',
      internal_link_status: 'PLANNED_ONLY_AFTER_OWNER_APPROVAL',
      url_action_status: 'NOT_CHANGED; DECISION_ONLY',
      next_step: row.recommended_next_action || '',
      blocked_actions: row.blocked_actions || '',
      notes: row.notes || '',
    });
  });

  return rows;
}

function summarize(rows, drafts) {
  const count = (predicate) => rows.filter(predicate).length;
  const criminalUploadRows = rows.filter((row) => row.lane === 'CRIMINAL_FIRST_UPLOAD_TARGET');
  const trafficRows = rows.filter((row) => row.cluster === 'traffic-law');
  const criminalSupportRows = rows.filter((row) => row.lane === 'CRIMINAL_SUPPORT_MAP');
  const trafficSupportRows = rows.filter((row) => row.lane === 'TRAFFIC_SUPPORT_MAP');
  const wrongPageRows = rows.filter((row) => row.readiness_status === 'WRONG_PAGE_PROTECTION_NEEDED' || row.decision_status === 'PROTECT_CURRENT_WILL_PAGE_AND_REVIEW_TRAFFIC_SUPPORT');

  return {
    generatedAt: new Date().toISOString(),
    finality: 'REVIEW_ONLY_NO_PUBLIC_CHANGES',
    totalRows: rows.length,
    criminalUploadTargets: criminalUploadRows.length,
    criminalUploadTargetsWithDraft: criminalUploadRows.filter((row) => row.content_draft_status.startsWith('DRAFT_PRESENT')).length,
    criminalUploadTargetsMissingDraft: criminalUploadRows.filter((row) => row.content_draft_status === 'MISSING_DRAFT').length,
    criminalSupportRows: criminalSupportRows.length,
    criminalP0SupportRows: criminalSupportRows.filter((row) => row.priority === 'P0').length,
    trafficSupportRows: trafficSupportRows.length,
    trafficP0SupportRows: trafficSupportRows.filter((row) => row.priority === 'P0').length,
    trafficBoundaryRows: trafficRows.filter((row) => /BOUNDARY|HOLD/i.test(`${row.target_url_or_hub} ${row.readiness_status}`)).length,
    targetedGscRows: count((row) => row.lane === 'TARGETED_GSC_SIGNAL'),
    wrongPageSignals: wrongPageRows.length,
    highRiskRows: count((row) => row.traffic_risk === 'HIGH'),
    mediumRiskRows: count((row) => row.traffic_risk === 'MEDIUM'),
    draftInventory: drafts.list,
    firstPublishCandidate: '/criminal-defense-attorney/',
    firstPublishStatus: 'READY_FOR_OWNER_REVIEW_NOT_UPLOAD',
    blockedActions: [
      'No criminal-lawyer slug migration without final owner/GSC review',
      'No drunk-driving slug migration without wrong-page and support-page review',
      'No redirects/canonicals/noindex/sitemap changes from this dashboard',
      'No CMS upload without owner/legal/source approval and WordPress backup',
      'Do not optimize the will-revocation page for traffic-law intent',
    ],
  };
}

function markdownSummary(reportDate, files, summary, rows) {
  const criminalUploadRows = rows.filter((row) => row.lane === 'CRIMINAL_FIRST_UPLOAD_TARGET');
  const missingDrafts = criminalUploadRows.filter((row) => row.content_draft_status === 'MISSING_DRAFT');
  const topCriminalSupport = rows
    .filter((row) => row.lane === 'CRIMINAL_SUPPORT_MAP')
    .sort((left, right) => numberValue(right.gsc_impressions) - numberValue(left.gsc_impressions))
    .slice(0, 8);
  const topTrafficSupport = rows
    .filter((row) => row.lane === 'TRAFFIC_SUPPORT_MAP')
    .sort((left, right) => numberValue(right.gsc_impressions) - numberValue(left.gsc_impressions))
    .slice(0, 8);

  const table = (tableRows, columns) => {
    const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
    const divider = `| ${columns.map(() => '---').join(' | ')} |`;
    const body = tableRows.map((row) => `| ${columns.map((column) => csvEscape(column.value(row)).replace(/\|/g, '/')).join(' | ')} |`);
    return [header, divider, ...body].join('\n');
  };

  return `# Criminal + Traffic Readiness Dashboard - ${reportDate}

## Status
- VERIFIED LOCAL: generated from existing dot-private control CSV evidence and current dot-private content-draft files.
- REVIEW ONLY: no public CMS content, URL slug, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, CRM or payment change is approved by this packet.
- BLOCKED: public upload still requires owner/legal/source approval and WordPress backup.

## Batch Completed
- Total rows consolidated: ${summary.totalRows}
- Criminal first-upload targets reviewed: ${summary.criminalUploadTargets}
- Criminal first-upload targets with drafts present: ${summary.criminalUploadTargetsWithDraft}
- Criminal first-upload targets still missing drafts: ${summary.criminalUploadTargetsMissingDraft}
- Criminal support/protected rows reviewed: ${summary.criminalSupportRows} (${summary.criminalP0SupportRows} P0)
- Traffic support/boundary rows reviewed: ${summary.trafficSupportRows} (${summary.trafficP0SupportRows} P0)
- Targeted GSC signal rows included: ${summary.targetedGscRows}
- Wrong-page/protection signals included: ${summary.wrongPageSignals}

## First Publish Candidate
- READY FOR OWNER REVIEW: ${summary.firstPublishCandidate} as the current no-URL-change criminal planning pillar.
- NOT READY FOR UPLOAD: owner/legal/source approval, CMS backup and final body/metadata review are still required.
- URL STRATEGY: keep current URL now; future \`/criminal-lawyer/\` migration remains blocked.

## Criminal First-Upload Targets
${table(criminalUploadRows, [
    { label: 'Target', value: (row) => row.source_id },
    { label: 'Priority', value: (row) => row.priority },
    { label: 'Current URL', value: (row) => shortUrl(row.current_url) },
    { label: 'Role', value: (row) => row.role_or_topic },
    { label: 'Draft', value: (row) => `${row.content_draft_status}${row.draft_word_count ? ` (${row.draft_word_count})` : ''}` },
    { label: 'Status', value: (row) => row.readiness_status },
  ])}

## Missing First-Upload Drafts
${missingDrafts.length ? table(missingDrafts, [
    { label: 'Target', value: (row) => row.source_id },
    { label: 'Current URL', value: (row) => shortUrl(row.current_url) },
    { label: 'Role', value: (row) => row.role_or_topic },
    { label: 'Next step', value: (row) => row.next_step },
  ]) : '- VERIFIED: no missing first-upload drafts.'}

## Top Criminal Support / Protection Rows
${table(topCriminalSupport, [
    { label: 'Priority', value: (row) => row.priority },
    { label: 'Source', value: (row) => shortUrl(row.current_url) },
    { label: 'Clicks', value: (row) => row.gsc_clicks },
    { label: 'Impr.', value: (row) => row.gsc_impressions },
    { label: 'Role', value: (row) => row.role_or_topic },
    { label: 'Risk', value: (row) => row.traffic_risk },
  ])}

## Top Traffic Support / Boundary Rows
${table(topTrafficSupport, [
    { label: 'Priority', value: (row) => row.priority },
    { label: 'Source', value: (row) => shortUrl(row.current_url) },
    { label: 'Clicks', value: (row) => row.gsc_clicks },
    { label: 'Impr.', value: (row) => row.gsc_impressions },
    { label: 'Role', value: (row) => row.role_or_topic },
    { label: 'Readiness', value: (row) => row.readiness_status },
  ])}

## Must Not Skip
- Anti-cannibalization: keep criminal, traffic and personal-injury boundaries separated before linking or merging.
- Redirect planning: no redirect package from this dashboard; every URL action is still NOT_CHANGED.
- Wrong-page protection: do not optimize the will-revocation page for drunk-driving queries.
- Strong-page protection: high-impression support pages stay live until owner/GSC review.
- Current URL upload first: publish only to approved current URLs before considering clean English slug migration.

## Can Wait
- Future \`/criminal-lawyer/\`, \`/police-investigation/\`, \`/pretrial-detention/\`, \`/indictment/\` and \`/drunk-driving/\` migrations.
- Sitemap expansion, taxonomy cleanup and related-card writes.
- Broad criminal/traffic CMS batch upload after the first reviewed pillar/support set.

## Outputs
- ${path.relative(ROOT, files.reportCsv)}
- ${path.relative(ROOT, files.reportJson)}
- ${path.relative(ROOT, files.projectCsv)}
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  assertInputs();
  const files = outputFiles(args.reportDate);
  const inputs = Object.fromEntries(Object.entries(INPUTS).map(([key, filePath]) => [key, readCsv(filePath)]));
  const drafts = draftInventory();
  const rows = buildRows(inputs, drafts);
  const summary = summarize(rows, drafts);

  writeText(files.reportCsv, toCsv(rows, COLUMNS));
  writeText(files.projectCsv, toCsv(rows, COLUMNS));
  writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(files.projectMd, markdownSummary(args.reportDate, files, summary, rows));

  console.log(`Wrote ${path.relative(ROOT, files.reportCsv)} (${rows.length} rows)`);
  console.log(`Wrote ${path.relative(ROOT, files.reportJson)}`);
  console.log(`Wrote ${path.relative(ROOT, files.projectCsv)}`);
  console.log(`Wrote ${path.relative(ROOT, files.projectMd)}`);
  console.log(JSON.stringify(summary, null, 2));
}

main();
