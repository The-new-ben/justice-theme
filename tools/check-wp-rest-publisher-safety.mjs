import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || new Date().toISOString().slice(0, 10),
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `wp-rest-publisher-safety-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
  };
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
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

function check(id, scope, risk, ok, evidence, nextStep) {
  return {
    check_id: id,
    scope,
    status: ok ? 'VERIFIED' : 'BLOCKED',
    risk,
    evidence,
    next_step: ok ? 'Keep publisher guarded behind explicit opt-in.' : nextStep,
  };
}

function markdownReport(rows, reportDate) {
  const blocked = rows.filter((row) => row.status !== 'VERIFIED');
  const header = [
    `# WP REST Publisher Safety - ${reportDate}`,
    '',
    `Status: ${blocked.length === 0 ? 'VERIFIED' : 'BLOCKED'}`,
    '',
    'Scope: repo-local static verification for the SEMrush priority-page publisher script.',
    '',
    'This check prevents accidental live WordPress writes from a repo script by requiring explicit `--publish` plus a local credential path outside Git.',
    '',
    '## Results',
    '',
    '| Check | Status | Risk | Evidence |',
    '| --- | --- | --- | --- |',
  ];

  const table = rows.map(
    (row) => `| ${row.check_id} | ${row.status} | ${row.risk} | ${row.evidence.replace(/\|/g, '/') || '-'} |`
  );

  const footer = [
    '',
    '## Upload Notes',
    '',
    '- FIXED: `reports/semrush/build-priority-pages.js` is dry-run by default.',
    '- FIXED: live publishing requires `--publish` and `WP_APP_PASSWORD_PATH` pointing to a local file outside Git.',
    '- VERIFIED: no hardcoded machine-specific credential path remains in the publisher.',
    '- NOT LIVE VERIFIED: no WordPress REST write, wp-admin action, public page update or screenshot was performed by this safety check.',
    '- BLOCKED: any future publication still requires owner approval, rollback material, and post-publish live verification.',
    '',
  ];

  return [...header, ...table, ...footer].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-wp-rest-publisher-safety.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const publisherPath = path.join(ROOT, 'reports', 'semrush', 'build-priority-pages.js');
const publisher = readFileSync(publisherPath, 'utf8');

const dryRunIndex = publisher.indexOf('if (!publish)');
const firstWriteLookupIndex = publisher.indexOf("wpRequest('GET'");

const rows = [
  check(
    'WP-REST-PUBLISH-DRY-RUN-DEFAULT',
    'publisher_execution',
    'CRITICAL',
    publisher.includes("const publish = args.has('--publish');") && dryRunIndex >= 0,
    'Publisher defaults to dry-run unless --publish is present.',
    'Require an explicit --publish flag before any WordPress REST API call.'
  ),
  check(
    'WP-REST-PUBLISH-BLOCKS-BEFORE-REQUEST',
    'publisher_execution',
    'CRITICAL',
    dryRunIndex >= 0 && firstWriteLookupIndex >= 0 && dryRunIndex < firstWriteLookupIndex,
    'Dry-run guard runs before the first WordPress REST lookup or write.',
    'Move the dry-run guard before any wpRequest() call in upsert().'
  ),
  check(
    'WP-REST-PUBLISH-NO-HARDCODED-CREDS',
    'credential_hygiene',
    'CRITICAL',
    !publisher.includes('c:/Users/pro/justice/justice-theme/tools/gsc/wp-app-password.json') &&
      !publisher.includes('tools/gsc/wp-app-password.json') &&
      !publisher.includes('C:\\\\Users\\\\pro'),
    'Publisher no longer contains the previous machine-specific app-password file path.',
    'Remove hardcoded local credential paths from the publisher.'
  ),
  check(
    'WP-REST-PUBLISH-ENV-CREDENTIAL',
    'credential_hygiene',
    'HIGH',
    publisher.includes('process.env.WP_APP_PASSWORD_PATH') && publisher.includes('WP_APP_PASSWORD_PATH is required when --publish is used.'),
    'Publisher requires WP_APP_PASSWORD_PATH only when publishing is explicitly requested.',
    'Read WordPress credentials from WP_APP_PASSWORD_PATH outside Git.'
  ),
  check(
    'WP-REST-PUBLISH-AUTH-DEFERRED',
    'credential_hygiene',
    'HIGH',
    publisher.includes('function getAuthHeader()') &&
      publisher.includes('Authorization: getAuthHeader()') &&
      !publisher.includes('const auth ='),
    'Authorization header is assembled lazily from the explicit credential file, not at module load.',
    'Defer auth construction until publish-time and avoid module-level auth constants.'
  ),
  check(
    'WP-REST-PUBLISH-CREDENTIAL-PREFLIGHT',
    'credential_hygiene',
    'HIGH',
    publisher.includes('if (publish)') &&
      publisher.includes('getAuthHeader();') &&
      publisher.includes('PUBLISH MODE enabled. Writing to jus-tice.co.il through WP REST API.'),
    'Publish mode validates credentials once before any page upsert loop starts.',
    'Preflight WP_APP_PASSWORD_PATH before the first page upsert when --publish is used.'
  ),
  check(
    'WP-REST-PUBLISH-HELP-TEXT',
    'operator_safety',
    'MEDIUM',
    publisher.includes('Default without --publish: dry run, no WordPress REST API writes.') &&
      publisher.includes('Usage: WP_APP_PASSWORD_PATH='),
    'Operator help documents dry-run default and required publish credentials.',
    'Add help text that explains dry-run default and publish requirements.'
  ),
  check(
    'WP-REST-PUBLISH-DRY-RUN-RESULTS',
    'operator_safety',
    'MEDIUM',
    publisher.includes("status: 'DRY_RUN'") &&
      publisher.includes('contentLength: content.length') &&
      publisher.includes('metaKeys: Object.keys(meta || {})'),
    'Dry-run output returns structured per-page results without live writes.',
    'Return structured DRY_RUN rows for every page.'
  ),
  check(
    'WP-REST-PUBLISH-ERROR-EXIT',
    'operator_safety',
    'MEDIUM',
    publisher.includes('process.exitCode = 1;'),
    'Publisher exits non-zero on runtime failure.',
    'Set process.exitCode = 1 in the top-level catch handler.'
  ),
  check(
    'WP-REST-PUBLISH-TARGET-SITE',
    'publisher_scope',
    'MEDIUM',
    publisher.includes("hostname: 'jus-tice.co.il'"),
    'Publisher target host remains explicit and reviewable.',
    'Keep the WordPress REST target host explicit in the publisher.'
  ),
];

const blockedRows = rows.filter((row) => row.status !== 'VERIFIED');
const outputs = outputFiles(args.reportDate);
const columns = ['check_id', 'scope', 'status', 'risk', 'evidence', 'next_step'];
const csv = toCsv(rows, columns);

writeText(outputs.reportCsv, csv);
writeText(outputs.projectCsv, csv);
writeText(outputs.reportJson, JSON.stringify(rows, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.reportDate));

console.table(rows.map(({ check_id, status, risk }) => ({ check_id, status, risk })));
console.log(`WP REST publisher safety: ${rows.length - blockedRows.length}/${rows.length} VERIFIED`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (blockedRows.length > 0) {
  process.exitCode = 1;
}
