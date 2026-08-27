#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { after, test } = require('node:test');

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(file, columns, rows) {
  fs.writeFileSync(file, `\uFEFF${columns.join(',')}\r\n${rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\r\n')}\r\n`, 'utf8');
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

function readCsv(file) {
  const lines = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const columns = parseCsvLine(lines.shift() || '');
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? '']));
  });
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'justice-410-gates-'));
const analysisDir = path.join(fixtureRoot, 'analysis');
fs.mkdirSync(analysisDir);

const candidates = [
  {
    url: 'https://jus-tice.co.il/protected-page/', title: 'Protected', content_type: 'page', recommendation: 'MERGE_CONTENT_THEN_410_HIGH', confidence: 'HIGH', owner_url: 'https://jus-tice.co.il/owner/', full_clicks: '2', full_impressions: '216', recent_90d_clicks: '0', recent_90d_impressions: '1', internal_inlinks: '0', word_count: '500',
  },
  {
    url: 'https://jus-tice.co.il/exact-copy/', title: 'Exact copy', content_type: 'post', recommendation: 'DELETE_410_DIRECT_HIGH', confidence: 'HIGH', owner_url: 'https://jus-tice.co.il/owner/', full_clicks: '0', full_impressions: '0', recent_90d_clicks: '0', recent_90d_impressions: '0', internal_inlinks: '0', word_count: '46',
  },
  {
    url: 'https://jus-tice.co.il/recent-topic/', title: 'Recent topic', content_type: 'post', recommendation: 'DELETE_410_LOW_VALUE_MEDIUM', confidence: 'MEDIUM', owner_url: '', full_clicks: '0', full_impressions: '6', recent_90d_clicks: '0', recent_90d_impressions: '6', internal_inlinks: '0', word_count: '118',
  },
];

writeCsv(path.join(analysisDir, 'justice-410-candidates.csv'), Object.keys(candidates[0]), candidates);
writeCsv(path.join(analysisDir, 'justice-live-url-status.csv'), ['original_url', 'original_status', 'final_url', 'final_status', 'redirect_count'], candidates.map((row) => ({ original_url: row.url, original_status: '200', final_url: row.url, final_status: '200', redirect_count: '0' })));
writeCsv(path.join(analysisDir, 'justice-gsc-external-linked-targets.csv'), ['target_url', 'external_links', 'linking_sites'], []);
writeCsv(path.join(analysisDir, 'justice-gsc-internal-linked-targets.csv'), ['target_url', 'internal_links'], []);
writeCsv(path.join(analysisDir, 'justice-page-pair-content-enriched.csv'), ['page_a', 'page_b'], []);
writeCsv(path.join(analysisDir, 'justice-page-migration-inventory.csv'), ['url', 'protected_url_flag', 'business_protection_flag', 'proposed_action'], [
  { url: candidates[0].url, protected_url_flag: 'TRUE', business_protection_flag: 'FALSE', proposed_action: 'KEEP_PROTECT' },
  { url: candidates[1].url, protected_url_flag: 'FALSE', business_protection_flag: 'FALSE', proposed_action: 'DELETE_410_DIRECT_CANDIDATE' },
  { url: candidates[2].url, protected_url_flag: 'FALSE', business_protection_flag: 'FALSE', proposed_action: 'KEEP_REFRESH' },
]);

const stdout = execFileSync(process.execPath, [path.join(__dirname, 'gsc-justice-final-actions.js'), '--run-dir', fixtureRoot], { encoding: 'utf8' });
const summary = JSON.parse(stdout);
const actions = readCsv(path.join(analysisDir, 'justice-final-action-matrix.csv'));
const byUrl = new Map(actions.map((row) => [row.url, row]));

after(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }));

test('blocks protected and keep-signaled URLs from a 410 release recommendation', () => {
  assert.equal(byUrl.get(candidates[0].url).final_action, 'HOLD_PROTECTED_URL_REVIEW');
  assert.equal(byUrl.get(candidates[0].url).gate_not_protected, 'FAIL');
  assert.equal(byUrl.get(candidates[2].url).final_action, 'HOLD_PROTECTED_URL_REVIEW');
  assert.equal(summary.protected_conflicts, 2);
});

test('labels a clean analytical match as a candidate but never as release-ready', () => {
  const action = byUrl.get(candidates[1].url);
  assert.equal(action.final_action, 'CANDIDATE_DELETE_410');
  assert.equal(action.gate_live_200, 'PASS');
  assert.equal(action.gate_no_gsc_external_link_evidence, 'PASS_SAMPLED_ONLY');
  assert.equal(action.execution_readiness, 'NOT_RELEASE_READY');
  assert.match(action.unresolved_external_gates, /CRM_LEADS_UNVERIFIED/);
  assert.match(action.unresolved_external_gates, /EXPLICIT_PRODUCTION_APPROVAL_PENDING/);
});

test('reports zero release-ready URLs until external evidence is supplied', () => {
  assert.equal(summary.candidates, 3);
  assert.equal(summary.release_ready_410, 0);
  assert.equal(summary.not_release_ready, 3);
});
