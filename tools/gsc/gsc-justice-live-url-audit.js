#!/usr/bin/env node
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const VERSION = '1.0.0';
const USER_AGENT = `Justice-GSC-Live-URL-Audit/${VERSION} (read-only)`;
const CONCURRENCY = 8;
const MAX_REDIRECTS = 6;

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

async function request(url, method = 'HEAD') {
  try {
    const response = await fetch(url, {
      method,
      redirect: 'manual',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,application/pdf,*/*;q=0.8' },
      signal: AbortSignal.timeout(20000),
    });
    if (response.status === 405 && method === 'HEAD') return request(url, 'GET');
    if (method === 'GET' && response.body) await response.body.cancel();
    return { response, method };
  } catch (error) {
    return { error, method };
  }
}

async function auditUrl(originalUrl) {
  const chain = [];
  const seen = new Set();
  let current = originalUrl;
  let method = 'HEAD';
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (seen.has(current)) return {
      original_url: originalUrl, original_status: chain[0]?.status || '', final_url: current, final_status: 'LOOP',
      redirect_count: chain.length, redirect_chain: chain.map((item) => `${item.status} ${item.url}`).join(' -> '),
      request_method: method, content_type: '', cache_control: '', last_modified: '', error: 'redirect loop',
    };
    seen.add(current);
    const result = await request(current, method);
    method = result.method;
    if (result.error) return {
      original_url: originalUrl, original_status: chain[0]?.status || '', final_url: current, final_status: 'ERROR',
      redirect_count: chain.length, redirect_chain: chain.map((item) => `${item.status} ${item.url}`).join(' -> '),
      request_method: method, content_type: '', cache_control: '', last_modified: '', error: result.error.message,
    };
    const response = result.response;
    chain.push({ url: current, status: response.status });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, current).href;
      continue;
    }
    return {
      original_url: originalUrl,
      original_status: chain[0].status,
      final_url: current,
      final_status: response.status,
      redirect_count: chain.length - 1,
      redirect_chain: chain.map((item) => `${item.status} ${item.url}`).join(' -> '),
      request_method: method,
      content_type: response.headers.get('content-type') || '',
      cache_control: response.headers.get('cache-control') || '',
      last_modified: response.headers.get('last-modified') || '',
      error: '',
    };
  }
  return {
    original_url: originalUrl, original_status: chain[0]?.status || '', final_url: current, final_status: 'TOO_MANY_REDIRECTS',
    redirect_count: chain.length, redirect_chain: chain.map((item) => `${item.status} ${item.url}`).join(' -> '),
    request_method: method, content_type: '', cache_control: '', last_modified: '', error: 'too many redirects',
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir || !path.isAbsolute(args.runDir)) throw new Error('--run-dir must be absolute');
  const analysisDir = path.join(args.runDir, 'analysis');
  const migration = parseCsv(await fsp.readFile(path.join(analysisDir, 'justice-page-migration-inventory.csv'), 'utf8'));
  const urls = [...new Set(migration.map((row) => row.url).filter((url) => /^https?:\/\//i.test(url)))];
  const rows = [];
  for (let index = 0; index < urls.length; index += CONCURRENCY) {
    rows.push(...await Promise.all(urls.slice(index, index + CONCURRENCY).map(auditUrl)));
    const completed = Math.min(index + CONCURRENCY, urls.length);
    if (completed % 104 === 0 || completed === urls.length) process.stdout.write(`Checked ${completed}/${urls.length} URLs...\n`);
  }
  rows.sort((a, b) => a.original_url.localeCompare(b.original_url, 'en'));
  const csvFile = path.join(analysisDir, 'justice-live-url-status.csv');
  const summaryFile = path.join(analysisDir, 'justice-live-url-status-summary.json');
  await writeCsv(csvFile, rows);
  const summary = {
    script: 'gsc-justice-live-url-audit.js',
    version: VERSION,
    generated_at: new Date().toISOString(),
    mode: 'READ_ONLY',
    urls_checked: rows.length,
    original_status_counts: Object.fromEntries([...new Set(rows.map((row) => String(row.original_status)))].map((status) => [status, rows.filter((row) => String(row.original_status) === status).length])),
    final_status_counts: Object.fromEntries([...new Set(rows.map((row) => String(row.final_status)))].map((status) => [status, rows.filter((row) => String(row.final_status) === status).length])),
    redirects: rows.filter((row) => Number(row.redirect_count) > 0).length,
    multi_hop_redirects: rows.filter((row) => Number(row.redirect_count) > 1).length,
    errors: rows.filter((row) => row.error).length,
    output: csvFile,
    no_live_changes: true,
  };
  await fsp.writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.stack || error.message}\n`);
  process.exitCode = 1;
});
