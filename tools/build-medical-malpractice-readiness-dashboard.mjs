import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const INPUTS = {
  ownerReview: path.join(ROOT, '.project-control', 'medical-malpractice-owner-upload-review-package-2026-05-11.csv'),
  currentReadiness: path.join(ROOT, '.project-control', 'medical-malpractice-current-url-upload-readiness-2026-05-11.csv'),
  supportHub: path.join(ROOT, '.project-control', 'medical-malpractice-support-to-hub-map-2026-05-18.csv'),
  routeReview: path.join(ROOT, '.project-control', 'medical-malpractice-clean-slug-route-review-2026-05-18.csv'),
  internalLinks: path.join(ROOT, '.project-control', 'medical-malpractice-no-url-internal-link-map-2026-05-11.csv'),
  sourceLegal: path.join(ROOT, '.project-control', 'medical-malpractice-source-legal-checklist-2026-05-11.csv'),
  contentAudit: path.join(ROOT, '.project-control', 'content-quality-audit.csv'),
  urlMigration: path.join(ROOT, '.project-control', 'url-migration-map.csv'),
  cannibalization: path.join(ROOT, '.project-control', 'cannibalization-map.csv'),
};

const REQUIRED_SOURCES = Object.keys(INPUTS);

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
  'content_quality_score',
  'source_legal_status',
  'internal_link_status',
  'url_action_status',
  'next_step',
  'blocked_actions',
  'notes',
];

const BLOCKED_PUBLIC_ACTIONS = [
  'NO_CMS_EDIT',
  'NO_PUBLIC_UPLOAD',
  'NO_REDIRECT',
  'NO_CANONICAL_NOINDEX',
  'NO_SITEMAP_CHANGE',
  'NO_TAXONOMY_CHANGE',
].join('; ');

const MEDICAL_SIGNAL_PATTERNS = [
  /medical[-\s]?malpractice/i,
  /malpractice/i,
  /birth[-\s]?injury/i,
  /cerebral[-\s]?palsy/i,
  /surgical/i,
  /surgery/i,
  /anesthesia/i,
  /doctor/i,
  /hospital/i,
  /רשלנות/u,
  /רפוא/u,
  /רופא/u,
  /לידה/u,
  /הריון/u,
  /ניתוח/u,
  /הרדמה/u,
  /מומחים רפואיים/u,
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
  const base = `medical-malpractice-readiness-dashboard-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
  };
}

function printHelp() {
  console.log(`Medical Malpractice readiness dashboard

Usage:
  node tools/build-medical-malpractice-readiness-dashboard.mjs
  node tools/build-medical-malpractice-readiness-dashboard.mjs --reportDate=YYYY-MM-DD

Inputs:
  .project-control/medical-malpractice-owner-upload-review-package-2026-05-11.csv
  .project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.csv
  .project-control/medical-malpractice-support-to-hub-map-2026-05-18.csv
  .project-control/medical-malpractice-clean-slug-route-review-2026-05-18.csv
  .project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.csv
  .project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv
  .project-control/content-quality-audit.csv
  .project-control/url-migration-map.csv
  .project-control/cannibalization-map.csv

Outputs:
  .reports/medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv
  .reports/medical-malpractice-readiness-dashboard-YYYY-MM-DD.json
  .project-control/medical-malpractice-readiness-dashboard-YYYY-MM-DD.csv
  .project-control/medical-malpractice-readiness-dashboard-YYYY-MM-DD.md
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

function numberValue(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace('%', '').replace(/,/g, '')) || 0;
}

function decodeLoose(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(String(value));
  } catch (_err) {
    return String(value);
  }
}

function shorten(value, maxLength = 420) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

function shortUrl(value) {
  if (!value) return '';
  try {
    return new URL(value).pathname || value;
  } catch (_err) {
    return value;
  }
}

function splitPipe(value) {
  return String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
}

function summarizePipeList(value, maxItems = 12) {
  const items = splitPipe(value);
  if (items.length <= maxItems) return items.join('|');
  return `${items.slice(0, maxItems).join('|')}|... +${items.length - maxItems} more`;
}

function hasMedicalSignalFromFields(...fields) {
  const haystack = fields.map(decodeLoose).join(' ');
  return MEDICAL_SIGNAL_PATTERNS.some((pattern) => pattern.test(haystack));
}

function clusterSignalStatus(row) {
  const signal = hasMedicalSignalFromFields(
    row.url,
    row.title,
    row.old_url,
    row.new_url,
    row.old_slug,
    row.new_slug,
    row.current_urls_or_refs,
    row.current_url_or_reference,
  );
  return signal ? 'MEDICAL_SIGNAL_CONFIRMED' : 'POSSIBLE_FALSE_POSITIVE_REVIEW';
}

function trafficRisk(clicks, impressions, fallback = '') {
  const clickCount = numberValue(clicks);
  const impressionCount = numberValue(impressions);
  if (clickCount >= 50 || impressionCount >= 10000) return 'HIGH';
  if (clickCount > 0 || impressionCount >= 3000) return 'MEDIUM';
  return fallback || 'LOW_UNKNOWN';
}

function sourceRiskStatus(row) {
  if (row.legal_review_status === 'NOT_VERIFIED') return `BLOCKED_${row.privacy_risk || 'REVIEW'}`;
  return row.legal_review_status || 'UNKNOWN';
}

function readinessFromApproval(status, fallback = 'OWNER_APPROVAL_REQUIRED') {
  if (/READY/i.test(status) && !/NOT_READY/i.test(status)) return status;
  if (/APPROVAL_REQUIRED|LEGAL_APPROVAL|OWNER/i.test(status)) return fallback;
  return status || fallback;
}

function addRow(rows, row) {
  rows.push({
    row_id: `MEDD-${String(rows.length + 1).padStart(3, '0')}`,
    cluster: 'medical-malpractice',
    ...row,
  });
}

function buildRows(inputs) {
  const rows = [];

  inputs.ownerReview.forEach((row, index) => {
    addRow(rows, {
      lane: 'OWNER_DECISION_GATE',
      source_id: row.decision_id || `owner-${index + 1}`,
      priority: 'P0',
      current_url: row.current_urls_or_refs || '',
      secondary_url: '',
      target_url_or_hub: row.target_group || '',
      role_or_topic: row.recommended_posture || '',
      decision_status: row.ready_for_upload === 'YES' ? 'READY_FOR_UPLOAD_APPROVAL_CHECK' : 'NOT_READY_FOR_UPLOAD',
      readiness_status: row.blocked_until || 'OWNER_REVIEW_REQUIRED',
      traffic_risk: /fee|birth|pillar/i.test(row.target_group || '') ? 'PROTECTED_REVIEW' : 'UNKNOWN_NEEDS_GSC',
      gsc_clicks: '',
      gsc_impressions: '',
      content_quality_score: '',
      source_legal_status: row.blocked_until || '',
      internal_link_status: 'PLANNED_ONLY_AFTER_APPROVAL',
      url_action_status: 'NO_URL_CHANGE_APPROVED',
      next_step: row.owner_decision_needed || '',
      blocked_actions: BLOCKED_PUBLIC_ACTIONS,
      notes: row.notes || '',
    });
  });

  inputs.currentReadiness.forEach((row, index) => {
    addRow(rows, {
      lane: 'CURRENT_URL_READINESS',
      source_id: row.item_id || `current-${index + 1}`,
      priority: /OWNER|HOLD|PROTECT/i.test(row.approval_status || row.sitemap_posture || '') ? 'P0' : 'P1',
      current_url: row.current_url_or_reference || '',
      secondary_url: row.merge_or_protect_targets || '',
      target_url_or_hub: row.merge_or_protect_targets || '',
      role_or_topic: row.current_role || '',
      decision_status: row.recommended_action || '',
      readiness_status: readinessFromApproval(row.approval_status, 'OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD'),
      traffic_risk: /PROTECT|DUPLICATE|BIRTH|FEE/i.test(`${row.cluster_lane} ${row.current_role} ${row.notes}`) ? 'PROTECTED_REVIEW' : 'UNKNOWN_NEEDS_GSC',
      gsc_clicks: '',
      gsc_impressions: '',
      content_quality_score: '',
      source_legal_status: row.approval_status || '',
      internal_link_status: row.internal_link_posture || '',
      url_action_status: row.sitemap_posture || '',
      next_step: row.recommended_action || '',
      blocked_actions: BLOCKED_PUBLIC_ACTIONS,
      notes: row.notes || '',
    });
  });

  inputs.supportHub.forEach((row, index) => {
    addRow(rows, {
      lane: 'P0_SUPPORT_TO_HUB_MAP',
      source_id: `support-${String(index + 1).padStart(3, '0')}`,
      priority: row.priority || 'P0',
      current_url: row.source_url || '',
      secondary_url: '',
      target_url_or_hub: row.target_hub || '',
      role_or_topic: row.anchor_direction || '',
      decision_status: row.public_change_status || '',
      readiness_status: 'SUPPORT_ROLE_PLANNED_NOT_EXECUTED',
      traffic_risk: trafficRisk(row.gsc_clicks, row.gsc_impressions),
      gsc_clicks: row.gsc_clicks || '0',
      gsc_impressions: row.gsc_impressions || '0',
      content_quality_score: '',
      source_legal_status: 'NEEDS_SOURCE_LEGAL_REVIEW_BEFORE_REWRITE',
      internal_link_status: 'PLANNED_ONLY_AFTER_OWNER_APPROVAL',
      url_action_status: 'NOT_CHANGED; INTERNAL_LINK_ONLY_AFTER_APPROVAL',
      next_step: 'Protect ranking value; decide support, merge, or rewrite role before upload batch',
      blocked_actions: BLOCKED_PUBLIC_ACTIONS,
      notes: row.notes || '',
    });
  });

  inputs.routeReview.forEach((row, index) => {
    addRow(rows, {
      lane: 'CLEAN_SLUG_ROUTE_REVIEW',
      source_id: `route-${String(index + 1).padStart(3, '0')}`,
      priority: row.live_status === '404' ? 'P0' : 'P1',
      current_url: row.slug_or_url || '',
      secondary_url: '',
      target_url_or_hub: '',
      role_or_topic: row.intent || '',
      decision_status: row.recommended_decision || '',
      readiness_status: row.approval_required === 'YES_BEFORE_REDIRECT_OR_ROUTE' ? 'BLOCKED_BEFORE_ROUTE_OR_REDIRECT' : 'ROLE_REVIEW_REQUIRED',
      traffic_risk: row.live_status === '404' ? 'ROUTE_RISK_404_CLEAN_SLUG' : 'LIVE_URL_PROTECT_OR_REVIEW',
      gsc_clicks: '',
      gsc_impressions: '',
      content_quality_score: '',
      source_legal_status: 'NOT_VERIFIED',
      internal_link_status: 'NOT_EXECUTED',
      url_action_status: row.live_status || '',
      next_step: row.approval_required || '',
      blocked_actions: BLOCKED_PUBLIC_ACTIONS,
      notes: row.evidence || '',
    });
  });

  inputs.internalLinks.forEach((row, index) => {
    addRow(rows, {
      lane: 'INTERNAL_LINK_PLAN',
      source_id: row.link_id || `link-${index + 1}`,
      priority: row.priority || '',
      current_url: row.source || '',
      secondary_url: '',
      target_url_or_hub: row.target || '',
      role_or_topic: row.relationship_type || row.anchor_intent || '',
      decision_status: row.execution_status || '',
      readiness_status: readinessFromApproval(row.approval_status, 'LINK_APPROVAL_REQUIRED'),
      traffic_risk: /REFERENCE:MEDMAL-DUPLICATE|FEE|BIRTH/i.test(`${row.source} ${row.target} ${row.reason}`) ? 'PROTECTED_REVIEW' : 'LOW_UNKNOWN',
      gsc_clicks: '',
      gsc_impressions: '',
      content_quality_score: '',
      source_legal_status: row.approval_status || '',
      internal_link_status: row.execution_status || '',
      url_action_status: 'NO_LINK_CHANGE_EXECUTED',
      next_step: row.placement_guidance || '',
      blocked_actions: BLOCKED_PUBLIC_ACTIONS,
      notes: row.reason || '',
    });
  });

  inputs.sourceLegal.forEach((row, index) => {
    addRow(rows, {
      lane: 'SOURCE_LEGAL_GATE',
      source_id: row.gate_id || `source-${index + 1}`,
      priority: row.privacy_risk === 'VERY_HIGH' ? 'P0' : 'P1',
      current_url: row.current_urls_or_refs || '',
      secondary_url: '',
      target_url_or_hub: row.page_group || '',
      role_or_topic: row.allowed_after_review || '',
      decision_status: row.legal_review_status || '',
      readiness_status: sourceRiskStatus(row),
      traffic_risk: row.privacy_risk || '',
      gsc_clicks: '',
      gsc_impressions: '',
      content_quality_score: '',
      source_legal_status: row.legal_review_status || '',
      internal_link_status: 'BLOCKED_UNTIL_SOURCE_LEGAL_REVIEW',
      url_action_status: 'NO_PUBLIC_ACTION_APPROVED',
      next_step: row.next_action || '',
      blocked_actions: `BLOCKED_CLAIMS=${shorten(row.blocked_claims, 180)}; ${BLOCKED_PUBLIC_ACTIONS}`,
      notes: `sources=${shorten(row.source_anchors, 220)}`,
    });
  });

  inputs.contentAudit
    .filter((row) => /cluster=medical-malpractice/i.test(row.notes || '') || hasMedicalSignalFromFields(row.url, row.title))
    .forEach((row, index) => {
      const signalStatus = clusterSignalStatus(row);
      addRow(rows, {
        lane: 'CONTENT_INVENTORY_AUDIT',
        source_id: row.id || `audit-${index + 1}`,
        priority: signalStatus === 'POSSIBLE_FALSE_POSITIVE_REVIEW' ? 'P0' : 'P2',
        current_url: row.url || '',
        secondary_url: '',
        target_url_or_hub: '',
        role_or_topic: row.title || '',
        decision_status: row.recommended_action || '',
        readiness_status: signalStatus,
        traffic_risk: /traffic_risk=([^;]+)/i.exec(row.notes || '')?.[1] || 'UNKNOWN',
        gsc_clicks: '',
        gsc_impressions: '',
        content_quality_score: row.quality_score_1_10 || '',
        source_legal_status: row.has_legal_sources || '',
        internal_link_status: row.has_internal_links === 'True' ? 'HAS_INTERNAL_LINKS' : 'NEEDS_INTERNAL_LINK_REVIEW',
        url_action_status: 'NO_URL_CHANGE_EXECUTED',
        next_step: signalStatus === 'POSSIBLE_FALSE_POSITIVE_REVIEW'
          ? 'Remove or reclassify from medical-malpractice cluster before upload planning'
          : 'Classify as pillar, support, merge, rewrite, or protect during med-mal upload batch',
        blocked_actions: BLOCKED_PUBLIC_ACTIONS,
        notes: `word_count=${row.word_count || ''}; thin=${row.is_thin || ''}; duplicate=${row.is_duplicate || ''}; rewrite=${row.needs_rewrite || ''}; merge=${row.needs_merge || ''}; ${row.notes || ''}`,
      });
    });

  inputs.urlMigration
    .filter((row) => row.topic_cluster === 'medical-malpractice' || hasMedicalSignalFromFields(row.old_url, row.new_url, row.title, row.old_slug, row.new_slug))
    .forEach((row, index) => {
      const signalStatus = clusterSignalStatus(row);
      addRow(rows, {
        lane: 'URL_MIGRATION_MAP',
        source_id: row.post_id || `migration-${index + 1}`,
        priority: /TARGET_SLUG_CONFLICT|duplicate_target_slug/i.test(`${row.status} ${row.notes}`) ? 'P0' : 'P1',
        current_url: row.old_url || '',
        secondary_url: row.old_slug || '',
        target_url_or_hub: row.new_url || '',
        role_or_topic: row.title || '',
        decision_status: row.status || '',
        readiness_status: signalStatus,
        traffic_risk: row.traffic_risk || 'UNKNOWN',
        gsc_clicks: row.gsc_clicks_3m || '',
        gsc_impressions: row.gsc_impressions_3m || '',
        content_quality_score: '',
        source_legal_status: 'NEEDS_SOURCE_AUDIT_BEFORE_CONTENT_REWRITE',
        internal_link_status: row.internal_links_update_required || '',
        url_action_status: `redirect=${row.redirect_required || ''}; canonical=${row.canonical_update_required || ''}; sitemap=${row.sitemap_update_required || ''}`,
        next_step: signalStatus === 'POSSIBLE_FALSE_POSITIVE_REVIEW'
          ? 'Fix cluster assignment before using in migration decisions'
          : 'Keep as planning row only until GSC, owner approval, and redirect plan are complete',
        blocked_actions: BLOCKED_PUBLIC_ACTIONS,
        notes: row.notes || '',
      });
    });

  inputs.cannibalization
    .filter((row) => row.cannibalization_group === 'medical-malpractice')
    .forEach((row, index) => {
      addRow(rows, {
        lane: 'CANNIBALIZATION_GROUP',
        source_id: row.cannibalization_group || `cannibalization-${index + 1}`,
        priority: 'P0',
        current_url: row.current_best_url || '',
        secondary_url: summarizePipeList(row.competing_urls, 14),
        target_url_or_hub: row.recommended_primary_url || '',
        role_or_topic: row.search_intent || row.primary_keyword || '',
        decision_status: 'ANTI_CANNIBALIZATION_REVIEW_REQUIRED',
        readiness_status: row.owner_approval_required === 'YES' ? 'OWNER_APPROVAL_REQUIRED' : 'NEEDS_OWNER_REVIEW',
        traffic_risk: 'UNKNOWN_NEEDS_GSC',
        gsc_clicks: '',
        gsc_impressions: '',
        content_quality_score: '',
        source_legal_status: row.notes || '',
        internal_link_status: 'MAP_AFTER_PRIMARY_SUPPORT_DECISIONS',
        url_action_status: 'NO_REDIRECT_OR_CANONICAL_CHANGE_APPROVED',
        next_step: 'Choose primary, support, merge, rewrite, keep, and later redirect roles from protected URL evidence',
        blocked_actions: BLOCKED_PUBLIC_ACTIONS,
        notes: `supporting=${summarizePipeList(row.supporting_urls, 10)}; merge=${summarizePipeList(row.pages_to_merge, 10)}; redirect_later=${summarizePipeList(row.pages_to_redirect_later, 10)}; keep=${summarizePipeList(row.pages_to_keep, 10)}; ${row.notes || ''}`,
      });
    });

  return rows;
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'UNKNOWN';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function calculateSummary(rows, inputs) {
  const possibleFalsePositiveRows = rows.filter((row) => row.readiness_status === 'POSSIBLE_FALSE_POSITIVE_REVIEW');
  const blockedRows = rows.filter((row) => /BLOCKED|NOT_READY|APPROVAL_REQUIRED|NOT_VERIFIED|POSSIBLE_FALSE/i.test(`${row.decision_status} ${row.readiness_status} ${row.source_legal_status}`));
  const highRiskRows = rows.filter((row) => /^HIGH|VERY_HIGH|PROTECTED|ROUTE_RISK|UNKNOWN_NEEDS_GSC/i.test(row.traffic_risk || ''));
  const cleanSlugBlockedRows = rows.filter((row) => row.lane === 'CLEAN_SLUG_ROUTE_REVIEW' && /BLOCKED|404/i.test(`${row.readiness_status} ${row.traffic_risk} ${row.url_action_status}`));
  const sourceLegalBlockedRows = rows.filter((row) => row.lane === 'SOURCE_LEGAL_GATE' && /NOT_VERIFIED|BLOCKED/i.test(`${row.decision_status} ${row.readiness_status}`));
  const notExecutedLinks = rows.filter((row) => row.lane === 'INTERNAL_LINK_PLAN' && /NOT_EXECUTED|NO_LINK/i.test(`${row.decision_status} ${row.url_action_status}`));

  return {
    generatedAt: new Date().toISOString(),
    cluster: 'medical-malpractice',
    labels: ['VERIFIED_LOCAL', 'NOT_VERIFIED_PUBLIC', 'BLOCKED_PUBLIC_CHANGES', 'FIXED_DOCUMENTATION_BATCH'],
    totalRows: rows.length,
    laneCounts: countBy(rows, 'lane'),
    inputCounts: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, value.length])),
    blockedRows: blockedRows.length,
    highRiskRows: highRiskRows.length,
    possibleFalsePositiveRows: possibleFalsePositiveRows.length,
    cleanSlugBlockedRows: cleanSlugBlockedRows.length,
    sourceLegalBlockedRows: sourceLegalBlockedRows.length,
    internalLinksNotExecuted: notExecutedLinks.length,
    firstUploadReadiness: 'NOT_READY',
    publicChangeStatus: 'NO_PUBLIC_CHANGES_EXECUTED',
    requiredNextGates: [
      'Resolve duplicate /medical-malpractice-lawyer/ CMS identity before edits',
      'Run focused GSC API export before redirect/canonical decisions',
      'Review possible false-positive cluster assignments',
      'Approve primary pillar/support/merge/rewrite roles',
      'Complete source/legal/privacy review for medical claims and lead forms',
      'Approve redirect, canonical, sitemap, and internal-link plan as one batch',
    ],
  };
}

function markdownTable(rows, columns, maxRows = 12) {
  const selected = rows.slice(0, maxRows);
  const header = `| ${columns.join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = selected.map((row) => `| ${columns.map((column) => csvEscape(shorten(row[column], 120))).join(' | ')} |`);
  const suffix = rows.length > maxRows ? [``, `_Showing ${maxRows} of ${rows.length} rows._`] : [];
  return [header, divider, ...body, ...suffix].join('\n');
}

function buildMarkdown(reportDate, summary, rows, files) {
  const laneRows = Object.entries(summary.laneCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([lane, count]) => ({ lane, count }));
  const p0Rows = rows.filter((row) => row.priority === 'P0');
  const falsePositiveRows = rows.filter((row) => row.readiness_status === 'POSSIBLE_FALSE_POSITIVE_REVIEW');
  const supportRows = rows.filter((row) => row.lane === 'P0_SUPPORT_TO_HUB_MAP')
    .sort((a, b) => numberValue(b.gsc_impressions) - numberValue(a.gsc_impressions));
  const routeRows = rows.filter((row) => row.lane === 'CLEAN_SLUG_ROUTE_REVIEW' && /BLOCKED|404/i.test(`${row.readiness_status} ${row.traffic_risk} ${row.url_action_status}`));

  return `# Medical Malpractice Readiness Dashboard - ${reportDate}

## Status

FIXED documentation batch only. VERIFIED local generation completed. NOT VERIFIED public CMS state, GSC API export, legal/source review, redirects, canonicals, sitemap, taxonomy, and live internal links. BLOCKED for upload until owner approval gates below are cleared.

No public upload, redirect, canonical/noindex, sitemap, taxonomy, CMS, lawyer directory, lead/CRM, or related-content change was executed.

## Batch Completed

- Reviewed ${summary.totalRows} planning rows across ${Object.keys(summary.laneCounts).length} lanes.
- Consolidated owner gates, current URL readiness, P0 support pages, clean slug route risks, internal link plan, source/legal gates, content inventory, URL migration, and cannibalization mapping.
- Flagged ${summary.highRiskRows} high/protected/unknown-GSC risk rows and ${summary.blockedRows} blocked or approval-gated rows.
- Flagged ${summary.possibleFalsePositiveRows} possible false-positive medical-malpractice cluster rows before they can pollute upload planning.
- Confirmed ${summary.cleanSlugBlockedRows} clean-slug/route rows remain blocked before routing or redirects.

## Lane Counts

${markdownTable(laneRows, ['lane', 'count'], 20)}

## Required Gates Before Upload

- BLOCKED: resolve duplicate public URL identity for \`/medical-malpractice-lawyer/\`.
- BLOCKED: run focused GSC API export before any redirect, canonical, or slug migration decision.
- BLOCKED: classify primary/support/merge/rewrite/keep roles for the medical-malpractice cannibalization group.
- BLOCKED: review and remove possible false-positive inventory rows from the medical-malpractice cluster.
- BLOCKED: complete source/legal/privacy review for medical causation, compensation, expert, and lead-intake claims.
- BLOCKED: approve internal links, sitemap inclusion, and redirect/canonical plan as one controlled batch.

## Highest Risk Rows

${markdownTable(p0Rows, ['row_id', 'lane', 'current_url', 'target_url_or_hub', 'readiness_status', 'traffic_risk', 'next_step'], 18)}

## P0 Support Traffic Signals

${markdownTable(supportRows, ['row_id', 'current_url', 'target_url_or_hub', 'gsc_clicks', 'gsc_impressions', 'traffic_risk', 'notes'], 15)}

## Clean Slug Blockers

${markdownTable(routeRows, ['row_id', 'current_url', 'role_or_topic', 'readiness_status', 'traffic_risk', 'notes'], 12)}

## Possible False Positives

${falsePositiveRows.length ? markdownTable(falsePositiveRows, ['row_id', 'lane', 'source_id', 'current_url', 'role_or_topic', 'next_step'], 20) : 'VERIFIED: no possible false-positive rows found.'}

## Output Files

- \`${path.relative(ROOT, files.reportCsv)}\`
- \`${path.relative(ROOT, files.reportJson)}\`
- \`${path.relative(ROOT, files.projectCsv)}\`

## Next Recommended Action

Prepare the focused GSC API export and owner-facing medical-malpractice decision packet from this dashboard. Do not publish or redirect yet.
`;
}

function run() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  assertInputs();
  const inputs = Object.fromEntries(Object.entries(INPUTS).map(([key, filePath]) => [key, readCsv(filePath)]));
  const rows = buildRows(inputs);
  const summary = calculateSummary(rows, inputs);
  const files = outputFiles(args.reportDate);
  const csv = toCsv(rows, COLUMNS);

  writeText(files.reportCsv, csv);
  writeText(files.projectCsv, csv);
  writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  writeText(files.projectMd, buildMarkdown(args.reportDate, summary, rows, files));

  console.log(JSON.stringify({
    reportDate: args.reportDate,
    totalRows: summary.totalRows,
    laneCounts: summary.laneCounts,
    blockedRows: summary.blockedRows,
    highRiskRows: summary.highRiskRows,
    possibleFalsePositiveRows: summary.possibleFalsePositiveRows,
    cleanSlugBlockedRows: summary.cleanSlugBlockedRows,
    sourceLegalBlockedRows: summary.sourceLegalBlockedRows,
    outputs: Object.fromEntries(Object.entries(files).map(([key, filePath]) => [key, path.relative(ROOT, filePath)])),
  }, null, 2));
}

run();
