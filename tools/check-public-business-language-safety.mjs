import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `public-business-language-safety-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
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

function readRepoFile(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function functionBody(source, functionName) {
  const start = source.indexOf(`function ${functionName}`);
  if (start === -1) {
    return '';
  }

  const braceStart = source.indexOf('{', start);
  if (braceStart === -1) {
    return '';
  }

  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    if (source[index] === '{') {
      depth += 1;
    } else if (source[index] === '}') {
      depth -= 1;
    }

    if (depth === 0) {
      return source.slice(start, index + 1);
    }
  }

  return '';
}

function statusRow(checkId, scope, ok, evidence, nextStep) {
  return {
    check_id: checkId,
    scope,
    status: ok ? 'VERIFIED' : 'BLOCKED',
    risk: ok ? 'covered' : 'internal_business_language_can_leak',
    evidence,
    next_step: ok ? 'Keep this gate in the publish preflight.' : nextStep,
  };
}

function markerDetected(text, markers) {
  const normalized = text.toLocaleLowerCase('he-IL');
  return markers.filter((marker) => normalized.includes(marker.toLocaleLowerCase('he-IL')));
}

function markdownReport(rows, reportDate, sampleHits) {
  const blocked = rows.filter((row) => row.status !== 'VERIFIED');
  const header = [
    `# Public Business-Language Safety - ${reportDate}`,
    '',
    `Status: ${blocked.length === 0 ? 'VERIFIED' : 'BLOCKED'}`,
    '',
    'Scope: repo-local verification that internal revenue/business-plan language is blocked before public publication.',
    '',
    'The owner caught a real user-facing risk: a legal-help page title can accidentally explain why the page makes money for Jus-Tice. This guard verifies that public titles, excerpts and bodies are scanned before publication.',
    '',
    '## Results',
    '',
    '| Check | Status | Evidence |',
    '| --- | --- | --- |',
  ];

  const table = rows.map(
    (row) => `| ${row.check_id} | ${row.status} | ${row.evidence.replace(/\|/g, '/')} |`
  );

  const footer = [
    '',
    '## Simulated Bad Public Heading',
    '',
    '- Sample: `למה ביטוח לאומי הוא מסלול הכנסה חשוב ל-Jus-Tice`',
    `- Detected markers: ${sampleHits.length ? sampleHits.map((hit) => `\`${hit}\``).join(', ') : 'NONE'}`,
    '',
    '## Operating Rule',
    '',
    '- Visitor-facing legal pages should explain the legal problem and next safe action for the user.',
    '- Internal terms such as revenue path, paid leads, CRM workflow, owner notes, Linear, uPress, Grow/Meshulam or pre-publication gates belong only in private docs/admin screens.',
    '- This check does not publish, edit CMS rows, change URLs, redirects, canonicals, noindex, sitemap or taxonomy settings.',
    '',
  ];

  return [...header, ...table, ...footer].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-public-business-language-safety.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const publicationSafety = readRepoFile('inc/publication-safety.php');
const livePublication = readRepoFile('inc/live-content-publication.php');
const publishGateBody = functionBody(publicationSafety, 'justice_theme_block_internal_notes_publication');
const liveMarkerBody = functionBody(livePublication, 'justice_theme_detect_public_content_internal_markers');
const headingGateBody = functionBody(livePublication, 'justice_theme_is_internal_publication_heading');
const lineGateBody = functionBody(livePublication, 'justice_theme_is_internal_publication_line');

const publicFieldTokens = ['post_title', 'post_excerpt', 'post_content'];
const requiredMarkers = [
  'why this is a good revenue',
  'why this page is revenue',
  'מסלול הכנסה',
  'למה ביטוח לאומי הוא מסלול הכנסה',
  'הכנסה ל-Jus-Tice',
  'מודל הכנסה',
  'לידים בתשלום',
  'עורכי דין משלמים',
  'מבחינה עסקית',
  'בעל האתר',
  'מדדי הצלחה',
  'קניבליזציה',
];

const sampleHeading = 'למה ביטוח לאומי הוא מסלול הכנסה חשוב ל-Jus-Tice';
const sampleHits = markerDetected(sampleHeading, requiredMarkers);

const rows = [
  statusRow(
    'PUBLIC-FIELDS-SCANNED',
    'wp_insert_post_data_publish_gate',
    publicFieldTokens.every((token) => publishGateBody.includes(token)),
    `Publish gate fields: ${publicFieldTokens.filter((token) => publishGateBody.includes(token)).join(', ')}`,
    'Scan post_title, post_excerpt and post_content before allowing publish/future status.'
  ),
  statusRow(
    'PUBLICATION-SAFETY-MARKERS',
    'wp_insert_post_data_publish_gate',
    requiredMarkers.every((marker) => publicationSafety.includes(marker)),
    `${requiredMarkers.filter((marker) => publicationSafety.includes(marker)).length}/${requiredMarkers.length} required markers in inc/publication-safety.php`,
    'Add the full required internal-business marker set to inc/publication-safety.php.'
  ),
  statusRow(
    'LIVE-CONTENT-MARKERS',
    'render_and_publication_helpers',
    requiredMarkers.every((marker) => liveMarkerBody.includes(marker)),
    `${requiredMarkers.filter((marker) => liveMarkerBody.includes(marker)).length}/${requiredMarkers.length} required markers in justice_theme_detect_public_content_internal_markers()`,
    'Add the full required marker set to justice_theme_detect_public_content_internal_markers().'
  ),
  statusRow(
    'HEADING-LINE-GATES',
    'internal_section_cleanup',
    ['מסלול הכנסה', 'מודל הכנסה', 'מבחינה עסקית', 'קניבליזציה'].every(
      (marker) => headingGateBody.includes(marker) && lineGateBody.includes(marker)
    ),
    'Heading and line cleanup gates include business-plan/revenue Hebrew markers.',
    'Add revenue/business-plan Hebrew markers to heading and line cleanup gates.'
  ),
  statusRow(
    'BITUACH-LEUMI-SAMPLE-CATCH',
    'regression_sample',
    sampleHits.length > 0,
    sampleHits.length ? `Sample heading caught by: ${sampleHits.join(' / ')}` : 'Sample heading was not caught.',
    'Ensure a Bituach Leumi revenue-style heading trips at least one marker.'
  ),
];

const blockedRows = rows.filter((row) => row.status !== 'VERIFIED');
const outputs = outputFiles(args.reportDate);
const columns = ['check_id', 'scope', 'status', 'risk', 'evidence', 'next_step'];
const csv = toCsv(rows, columns);

writeText(outputs.reportCsv, csv);
writeText(outputs.reportJson, JSON.stringify({ rows, sampleHeading, sampleHits }, null, 2) + '\n');
writeText(outputs.projectCsv, csv);
writeText(outputs.projectMd, markdownReport(rows, args.reportDate, sampleHits));

console.table(rows.map(({ check_id, status, risk }) => ({ check_id, status, risk })));
console.log(`Public business-language safety: ${rows.length - blockedRows.length}/${rows.length} VERIFIED`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (blockedRows.length > 0) {
  process.exitCode = 1;
}
