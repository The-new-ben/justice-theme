#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const input = String(text).replace(/^\uFEFF/, '');
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { row.push(field); field = ''; }
    else if (character === '\n') {
      if (field.endsWith('\r')) field = field.slice(0, -1);
      row.push(field); rows.push(row); row = []; field = '';
    } else field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const columns = rows.shift();
  return rows.filter((values) => values.some(Boolean)).map((values) =>
    Object.fromEntries(columns.map((column, index) => [column, values[index] ?? ''])));
}

async function readCsv(file) {
  return parseCsv(await fsp.readFile(file, 'utf8'));
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function close(left, right, tolerance = 1e-9) {
  return Math.abs(number(left) - number(right)) <= tolerance;
}

function strongestComparator(left, right) {
  return number(right.clicks) - number(left.clicks)
    || number(right.impressions) - number(left.impressions)
    || number(left.position) - number(right.position)
    || number(right.ctr) - number(left.ctr)
    || String(left.page).localeCompare(String(right.page), 'en');
}

async function main() {
  const runDirectory = process.argv[2];
  if (!runDirectory || !path.isAbsolute(runDirectory)) throw new Error('Pass the absolute run directory as the first argument.');
  const analysisDirectory = path.join(runDirectory, 'analysis');
  const [manifest, summary, detail, decisions, inventory, reconciled, daily, hashes] = await Promise.all([
    fsp.readFile(path.join(runDirectory, 'gsc-run-manifest.json'), 'utf8').then(JSON.parse),
    readCsv(path.join(analysisDirectory, 'multi-url-query-summary.csv')),
    readCsv(path.join(analysisDirectory, 'multi-url-query-detail.csv')),
    readCsv(path.join(analysisDirectory, 'cannibalization-decisions.csv')),
    readCsv(path.join(analysisDirectory, 'page-migration-inventory.csv')),
    readCsv(path.join(runDirectory, 'aggregated', 'query-page-reconciled.csv')),
    readCsv(path.join(runDirectory, 'raw', 'raw-query-page-daily.csv')),
    fsp.readFile(path.join(analysisDirectory, 'analysis-output-sha256.json'), 'utf8').then(JSON.parse),
  ]);
  const checks = [];
  function check(name, condition, details) {
    checks.push({ name, status: condition ? 'PASS' : 'FAIL', details });
    if (!condition) throw new Error(`${name}: ${details}`);
  }

  check('exact_property', manifest.parameters.site === 'sc-domain:nad-lan.co.il', manifest.parameters.site);
  check('readonly_scope', manifest.readonlyScope === 'https://www.googleapis.com/auth/webmasters.readonly', manifest.readonlyScope);
  check('pull_complete', manifest.status === 'COMPLETE', manifest.status);
  check('reconciled_row_count', reconciled.length === manifest.rowCounts.reconciledKeys, `${reconciled.length}`);
  check('daily_row_count', daily.length === manifest.rowCounts.dailyApiRows, `${daily.length}`);
  check('direct_daily_reconciliation', manifest.reconciliation.metricDifferenceCount === 0 && manifest.reconciliation.onlyDirectCount === 0 && manifest.reconciliation.onlyDailyCount === 0, JSON.stringify(manifest.reconciliation));
  check('multi_url_output_nonempty', summary.length > 0, `${summary.length}`);
  check('summary_decision_row_match', summary.length === decisions.length, `${summary.length}/${decisions.length}`);
  check('inventory_minimum_scope', inventory.length >= 1474, `${inventory.length}`);
  check('manual_approval_all_rows', inventory.every((row) => row.manual_approval_required === 'TRUE'), 'Every migration row requires manual approval.');
  check('no_single_url_queries', summary.every((row) => number(row.distinct_url_count) > 1), 'Every summary row has more than one distinct URL.');

  const byGroup = new Map();
  for (const row of detail) {
    if (!byGroup.has(row.group_id)) byGroup.set(row.group_id, []);
    byGroup.get(row.group_id).push(row);
  }
  for (const row of summary) {
    const group = byGroup.get(row.group_id) || [];
    check(`detail_count_${row.group_id}`, group.length === number(row.distinct_url_count), `${group.length}/${row.distinct_url_count}`);
    const clicks = group.reduce((sum, item) => sum + number(item.clicks), 0);
    const impressions = group.reduce((sum, item) => sum + number(item.impressions), 0);
    const weightedPosition = group.reduce((sum, item) => sum + number(item.position) * number(item.impressions), 0);
    check(`click_total_${row.group_id}`, close(clicks, row.query_total_clicks), `${clicks}/${row.query_total_clicks}`);
    check(`impression_total_${row.group_id}`, close(impressions, row.query_total_impressions), `${impressions}/${row.query_total_impressions}`);
    check(`ctr_${row.group_id}`, close(impressions ? clicks / impressions : 0, row.query_ctr), row.query_ctr);
    check(`position_${row.group_id}`, close(impressions ? weightedPosition / impressions : 0, row.query_weighted_position, 1e-8), row.query_weighted_position);
    const strongest = [...group].sort(strongestComparator)[0];
    check(`strongest_${row.group_id}`, strongest.page === row.strongest_url, `${strongest.page}/${row.strongest_url}`);
    check(`strongest_role_${row.group_id}`, group.filter((item) => item.url_role === 'strongest_url').length === 1, 'Exactly one strongest row.');
  }

  for (let index = 1; index < summary.length; index += 1) {
    const previous = summary[index - 1];
    const current = summary[index];
    const ordered = number(previous.distinct_url_count) > number(current.distinct_url_count)
      || (number(previous.distinct_url_count) === number(current.distinct_url_count)
        && (number(previous.query_total_impressions) > number(current.query_total_impressions)
          || (number(previous.query_total_impressions) === number(current.query_total_impressions)
            && (number(previous.query_total_clicks) > number(current.query_total_clicks)
              || (number(previous.query_total_clicks) === number(current.query_total_clicks)
                && previous.query.localeCompare(current.query, 'he') <= 0)))));
    check(`sort_${index}`, ordered, `${previous.group_id}/${current.group_id}`);
  }

  const allowedClasses = new Set(['LIKELY_CANNIBALIZATION', 'POSSIBLE_CANNIBALIZATION', 'BENIGN_MULTI_PAGE_VISIBILITY', 'INSUFFICIENT_EVIDENCE']);
  check('classification_values', decisions.every((row) => allowedClasses.has(row.classification)), 'Only the four requested classes are used.');
  check('no_automatic_execution', decisions.every((row) => row.do_not_execute_automatically === 'TRUE'), 'All decisions are review-only.');
  check('hash_manifest_present', Object.keys(hashes).length >= 7, `${Object.keys(hashes).length}`);

  const formulaErrors = ['#REF!', '#DIV/0!', '#VALUE!', '#NAME?', '#N/A'];
  const outputText = await Promise.all([
    'multi-url-query-summary.csv', 'multi-url-query-detail.csv', 'cannibalization-decisions.csv',
    'page-migration-inventory.csv', 'source-export-cross-check.csv',
  ].map((name) => fsp.readFile(path.join(analysisDirectory, name), 'utf8')));
  check('no_formula_error_tokens', outputText.every((text) => formulaErrors.every((token) => !text.includes(token))), 'No spreadsheet error tokens in CSV outputs.');

  const result = {
    generatedAt: new Date().toISOString(),
    status: 'PASS',
    checkCount: checks.length,
    counts: { summary: summary.length, detail: detail.length, decisions: decisions.length, inventory: inventory.length },
    checks,
  };
  await fsp.writeFile(path.join(analysisDirectory, 'qa-results.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({ status: result.status, checkCount: result.checkCount, counts: result.counts }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`TEST FAILURE: ${error.message}\n`);
  process.exitCode = 1;
});
