#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const VERSION = '2.0.0';

function parseArgs(argv) {
  const output = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const equal = token.indexOf('=');
    const key = token.slice(2, equal === -1 ? undefined : equal).replace(/-([a-z])/g, (_, value) => value.toUpperCase());
    if (equal !== -1) output[key] = token.slice(equal + 1);
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) output[key] = argv[++index];
    else output[key] = true;
  }
  return output;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted && character === '"' && line[index + 1] === '"') { current += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { values.push(current); current = ''; }
    else current += character;
  }
  values.push(current.replace(/\r$/, ''));
  return values;
}

function parseCsv(text) {
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines.shift() || '');
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(header.map((column, index) => [column, values[index] ?? '']));
  });
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function writeCsv(file, rows) {
  const columns = Object.keys(rows[0] || {});
  const stream = fs.createWriteStream(file, { encoding: 'utf8' });
  stream.write(`\uFEFF${columns.join(',')}\r\n`);
  for (const row of rows) stream.write(`${columns.map((column) => csvEscape(row[column])).join(',')}\r\n`);
  await new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(resolve);
  });
}

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function isThinLocal(url) {
  return /\/(real-estate-lawyer|criminal-lawyer|family-law|labor-law)-[^/]+\/$/i.test(url);
}

function urlKey(value) {
  try {
    const parsed = new URL(value);
    const normalizedPath = parsed.pathname.replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
    return `${parsed.protocol.toLowerCase()}//${parsed.host.toLowerCase()}${normalizedPath}${parsed.search}`;
  } catch {
    return String(value || '').replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
  }
}

function trueFlag(value) {
  return String(value || '').trim().toUpperCase() === 'TRUE';
}

function protectedSignal(migration = {}) {
  return trueFlag(migration.protected_url_flag)
    || trueFlag(migration.business_protection_flag)
    || /^KEEP_/i.test(String(migration.proposed_action || ''));
}

function decide(row, migration = {}) {
  const fullImpressions = number(row.full_impressions);
  const recentImpressions = number(row.recent_90d_impressions);
  if (protectedSignal(migration)) return {
    final_action: 'HOLD_PROTECTED_URL_REVIEW',
    execution_wave: 'WAVE_0_PROTECTION_CONFLICT',
    priority: 'P0_BLOCK_RELEASE',
    decision_confidence: 'BLOCKED_BY_PROTECTION_SIGNAL',
    decision_reason: `A protected/keep signal in the migration inventory conflicts with the 410 candidate. Resolve the ownership and revenue evidence before any removal. Previous action: ${migration.proposed_action || 'protected flag'}.`,
  };
  if (row.recommendation === 'MERGE_CONTENT_THEN_410_HIGH') return {
    final_action: 'CANDIDATE_MERGE_UNIQUE_CONTENT_THEN_410',
    execution_wave: 'WAVE_1_CONTENT_CAPTURE',
    priority: number(row.full_clicks) > 0 ? 'P1_14_DAYS' : 'P0_7_DAYS',
    decision_confidence: 'HIGH',
    decision_reason: 'Near-duplicate active page; retain any unique legal evidence in the owner page before removal.',
  };
  if (row.recommendation === 'DELETE_410_DIRECT_HIGH') return {
    final_action: 'CANDIDATE_DELETE_410',
    execution_wave: 'WAVE_1_24H_SAFETY_GATE',
    priority: 'P0_7_DAYS',
    decision_confidence: 'HIGH',
    decision_reason: 'Exact-content duplicate with no GSC traffic and no GSC Links target evidence.',
  };
  if (isThinLocal(row.url)) return {
    final_action: 'CANDIDATE_DELETE_410',
    execution_wave: 'WAVE_1_24H_SAFETY_GATE',
    priority: 'P1_14_DAYS',
    decision_confidence: 'HIGH_MEDIUM',
    decision_reason: 'Thin local-service doorway candidate: 0 clicks, <=7 full-range impressions, no GSC Links target evidence, and no unique local proof in the public body.',
  };
  if (fullImpressions === 0) return {
    final_action: 'CANDIDATE_DELETE_410',
    execution_wave: 'WAVE_1_24H_SAFETY_GATE',
    priority: 'P1_14_DAYS',
    decision_confidence: 'HIGH_MEDIUM',
    decision_reason: 'Active thin page with zero full-range GSC visibility and no GSC Links target evidence.',
  };
  if (recentImpressions === 0) return {
    final_action: 'CANDIDATE_DELETE_410',
    execution_wave: 'WAVE_2_CRM_AND_LOG_GATE',
    priority: 'P2_30_DAYS',
    decision_confidence: 'MEDIUM',
    decision_reason: 'Historical-only negligible visibility; require CRM and server-log exclusion before deletion.',
  };
  return {
    final_action: 'HOLD_REBUILD_OR_RETIRE_AFTER_30D_TEST',
    execution_wave: 'WAVE_3_STRATEGIC_DECISION',
    priority: 'P2_30_DAYS',
    decision_confidence: 'MEDIUM',
    decision_reason: 'Distinct topic with a small recent demand signal; rebuild into the correct cluster or retire after a defined test.',
  };
}

async function readCsv(file) {
  return parseCsv(await fsp.readFile(file, 'utf8'));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir || !path.isAbsolute(args.runDir)) throw new Error('--run-dir must be absolute');
  const analysisDir = path.join(args.runDir, 'analysis');
  const [candidates, liveRows, externalRows, internalRows, pairRows, migrationRows] = await Promise.all([
    readCsv(path.join(analysisDir, 'justice-410-candidates.csv')),
    readCsv(path.join(analysisDir, 'justice-live-url-status.csv')),
    readCsv(path.join(analysisDir, 'justice-gsc-external-linked-targets.csv')),
    readCsv(path.join(analysisDir, 'justice-gsc-internal-linked-targets.csv')),
    readCsv(path.join(analysisDir, 'justice-page-pair-content-enriched.csv')),
    readCsv(path.join(analysisDir, 'justice-page-migration-inventory.csv')),
  ]);
  const live = new Map(liveRows.map((row) => [urlKey(row.original_url), row]));
  const external = new Map(externalRows.map((row) => [urlKey(row.target_url), row]));
  const internal = new Map(internalRows.map((row) => [urlKey(row.target_url), row]));
  const migration = new Map(migrationRows.map((row) => [urlKey(row.url), row]));

  const actions = candidates.map((row) => {
    const status = live.get(urlKey(row.url)) || {};
    const externalEvidence = external.get(urlKey(row.url)) || {};
    const internalEvidence = internal.get(urlKey(row.url)) || {};
    const migrationEvidence = migration.get(urlKey(row.url)) || {};
    const decision = decide(row, migrationEvidence);
    const dataGates = {
      gate_live_200: status.original_status === '200' && status.final_status === '200' ? 'PASS' : 'FAIL',
      gate_zero_full_clicks: number(row.full_clicks) === 0 ? 'PASS' : 'FAIL',
      gate_zero_recent_clicks: number(row.recent_90d_clicks) === 0 ? 'PASS' : 'FAIL',
      gate_no_gsc_external_link_evidence: number(externalEvidence.external_links) === 0 ? 'PASS_SAMPLED_ONLY' : 'FAIL',
      gate_no_gsc_internal_link_evidence: number(internalEvidence.internal_links) === 0 ? 'PASS_SAMPLED_ONLY' : 'FAIL',
      gate_no_public_rest_inlinks: number(row.internal_inlinks) === 0 ? 'PASS' : 'FAIL',
      gate_not_protected: protectedSignal(migrationEvidence) ? 'FAIL' : 'PASS',
    };
    const failedDataGates = Object.entries(dataGates).filter(([, value]) => value === 'FAIL').map(([key]) => key);
    const unresolvedExternalGates = [
      'CRM_LEADS_UNVERIFIED',
      'SERVER_LOGS_UNVERIFIED',
      'COMPLETE_BACKLINK_AUDIT_UNVERIFIED',
      decision.final_action.includes('MERGE') ? 'UNIQUE_CONTENT_CAPTURE_REQUIRED' : 'UNIQUE_INFORMATION_REVIEW_UNVERIFIED',
      'BACKUP_UNVERIFIED',
      'SITEMAP_AND_INTERNAL_LINK_RELEASE_PLAN_PENDING',
      'EXPLICIT_PRODUCTION_APPROVAL_PENDING',
    ];
    return {
      priority: decision.priority,
      execution_wave: decision.execution_wave,
      final_action: decision.final_action,
      decision_confidence: decision.decision_confidence,
      url: row.url,
      title: row.title,
      content_type: row.content_type,
      owner_url: row.owner_url,
      source_recommendation: row.recommendation,
      migration_proposed_action: migrationEvidence.proposed_action || '',
      protected_url_flag: migrationEvidence.protected_url_flag || '',
      business_protection_flag: migrationEvidence.business_protection_flag || '',
      live_original_status: status.original_status || '',
      live_final_status: status.final_status || '',
      live_final_url: status.final_url || '',
      redirect_count: number(status.redirect_count),
      full_clicks: number(row.full_clicks),
      full_impressions: number(row.full_impressions),
      recent_90d_clicks: number(row.recent_90d_clicks),
      recent_90d_impressions: number(row.recent_90d_impressions),
      gsc_external_links: number(externalEvidence.external_links),
      gsc_linking_sites: number(externalEvidence.linking_sites),
      gsc_internal_links: number(internalEvidence.internal_links),
      public_rest_internal_inlinks: number(row.internal_inlinks),
      word_count: number(row.word_count),
      thin_local_pattern: isThinLocal(row.url),
      ...dataGates,
      failed_data_gates: failedDataGates.join('|'),
      unresolved_external_gates: unresolvedExternalGates.join('|'),
      execution_readiness: 'NOT_RELEASE_READY',
      decision_reason: decision.decision_reason,
      mandatory_24h_gate: 'Verify CRM/leads, server logs, unique legal information, and a backup; remove from sitemap and all internal links; then verify an exact 410 response.',
      revenue_data_status: 'UNAVAILABLE_NOT_IN_GSC',
      manual_approval_required: true,
    };
  }).sort((a, b) => a.priority.localeCompare(b.priority) || b.full_impressions - a.full_impressions || a.url.localeCompare(b.url));

  const activePairs = pairRows.filter((row) => {
    const a = live.get(urlKey(row.page_a));
    const b = live.get(urlKey(row.page_b));
    return a?.original_status === '200' && b?.original_status === '200' &&
      (number(row.possible_count) > 0 || row.exact_content_hash_match === 'TRUE' || number(row.content_token_jaccard) >= 0.8);
  }).map((row) => ({
    page_a: row.page_a,
    page_b: row.page_b,
    page_a_title: row.page_a_title,
    page_b_title: row.page_b_title,
    shared_query_count: number(row.shared_query_count),
    shared_impressions: number(row.shared_impressions),
    shared_clicks: number(row.shared_clicks),
    possible_query_groups: number(row.possible_count),
    content_token_jaccard: number(row.content_token_jaccard),
    exact_content_hash_match: row.exact_content_hash_match,
    same_cluster: row.same_cluster,
    example_queries: row.example_queries,
    pair_action: row.pair_action,
    pair_action_confidence: row.pair_action_confidence,
    manual_review_required: true,
  })).sort((a, b) => b.shared_impressions - a.shared_impressions || b.shared_query_count - a.shared_query_count);

  const redirectDebt = liveRows.filter((row) => number(row.redirect_count) > 1 || row.final_status === 'LOOP' ||
    row.final_status === 'TOO_MANY_REDIRECTS').map((row) => ({
    priority: row.final_status === 'LOOP' || row.final_status === 'TOO_MANY_REDIRECTS' ? 'P0_7_DAYS' : 'P1_14_DAYS',
    original_url: row.original_url,
    original_status: row.original_status,
    final_url: row.final_url,
    final_status: row.final_status,
    redirect_count: number(row.redirect_count),
    redirect_chain: row.redirect_chain,
    proposed_action: row.final_status === 'LOOP' || row.final_status === 'TOO_MANY_REDIRECTS'
      ? 'REMOVE_LOOP_THEN_RETURN_410_IF_NO_EQUIVALENT'
      : 'REVIEW_EQUIVALENCE_THEN_410_OR_ONE_DIRECT_HOP',
    rule: 'Use 410 when the old URL has no equivalent; retain one direct hop only when user intent and content are genuinely equivalent and retention is justified.',
    manual_review_required: true,
  })).sort((a, b) => a.priority.localeCompare(b.priority) || b.redirect_count - a.redirect_count || a.original_url.localeCompare(b.original_url));

  const actionFile = path.join(analysisDir, 'justice-final-action-matrix.csv');
  const pairsFile = path.join(analysisDir, 'justice-active-overlap-pairs.csv');
  const redirectDebtFile = path.join(analysisDir, 'justice-redirect-debt.csv');
  await Promise.all([writeCsv(actionFile, actions), writeCsv(pairsFile, activePairs), writeCsv(redirectDebtFile, redirectDebt)]);
  const by = (field) => Object.fromEntries([...new Set(actions.map((row) => row[field]))].sort().map((value) => [value, actions.filter((row) => row[field] === value).length]));
  const summary = {
    script: 'gsc-justice-final-actions.js',
    version: VERSION,
    generated_at: new Date().toISOString(),
    mode: 'READ_ONLY',
    candidates: actions.length,
    by_final_action: by('final_action'),
    by_execution_wave: by('execution_wave'),
    by_priority: by('priority'),
    all_candidates_live_200: actions.every((row) => row.live_original_status === '200'),
    release_ready_410: actions.filter((row) => row.execution_readiness === 'READY_FOR_EXPLICIT_RELEASE_APPROVAL').length,
    not_release_ready: actions.filter((row) => row.execution_readiness !== 'READY_FOR_EXPLICIT_RELEASE_APPROVAL').length,
    protected_conflicts: actions.filter((row) => row.final_action === 'HOLD_PROTECTED_URL_REVIEW').length,
    candidates_with_failed_data_gates: actions.filter((row) => row.failed_data_gates).length,
    candidates_with_gsc_external_link_evidence: actions.filter((row) => row.gsc_external_links > 0).length,
    candidates_with_gsc_internal_link_evidence: actions.filter((row) => row.gsc_internal_links > 0).length,
    active_overlap_pairs: activePairs.length,
    redirect_debt_rows: redirectDebt.length,
    caveats: [
      'GSC Links is sampled/reporting-limited evidence, not a complete backlink index.',
      'GSC does not contain lead quality, accepted cases, collected fees, margin, or profit.',
      'The 24-hour gate is mandatory even for high-confidence candidates.',
      'CANDIDATE actions are recommendations, not executable release instructions.',
      'A 410 may be released only after all external gates are evidenced and explicit production approval is recorded; this run marks zero URLs release-ready.',
      'No live page, redirect, sitemap, canonical, WordPress setting, or Search Console setting was changed.',
    ],
    outputs: { action_matrix: actionFile, active_overlap_pairs: pairsFile, redirect_debt: redirectDebtFile },
  };
  await fsp.writeFile(path.join(analysisDir, 'justice-final-action-summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.stack || error.message}\n`);
  process.exitCode = 1;
});
