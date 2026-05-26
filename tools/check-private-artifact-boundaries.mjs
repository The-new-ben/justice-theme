import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const PUBLIC_ROOTS = [
  'project-control',
  'reports',
  'content-master',
  'content-drafts',
  'mnt',
  'justice_theme_emergency_master_2026_05_13',
];

const EXCLUDED_TOOL_FILES = new Set(['tools/check-private-artifact-boundaries.mjs']);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || new Date().toISOString().slice(0, 10),
    failOnLegacyWriters: false,
  };

  for (const arg of process.argv.slice(2)) {
    if (arg === '--fail-on-legacy-writers') {
      args.failOnLegacyWriters = true;
    } else if (arg.startsWith('--reportDate=')) {
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

function gitLines(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function scanTrackedPublicArtifacts() {
  const tracked = gitLines(['ls-files']);
  return tracked.filter((file) =>
    PUBLIC_ROOTS.some((root) => file === root || file.startsWith(`${root}/`) || file.startsWith(`${root}\\`))
  );
}

function scanExistingPublicRoots() {
  return PUBLIC_ROOTS.filter((root) => existsSync(path.join(ROOT, root)));
}

function scanGitignore() {
  const gitignore = readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  return PUBLIC_ROOTS.map((root) => ({
    root,
    ignored: gitignore.includes(`/${root}/`) || gitignore.includes(`${root}/`),
  }));
}

function scanLegacyToolReferences() {
  const files = gitLines(['ls-files', 'tools'])
    .filter((file) => /\.(mjs|js|ps1)$/i.test(file))
    .filter((file) => !file.includes('/node_modules/') && !file.includes('\\node_modules\\'))
    .filter((file) => !EXCLUDED_TOOL_FILES.has(file));

  const rootPattern = new RegExp(`(^|[^.\\w-])(${PUBLIC_ROOTS.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(/|\\\\|['"\`]|$)`, 'i');
  const writerPattern = /(writeFileSync|mkdirSync|Export-Csv|OutDir|Output|REPORT|report|csv|json|path\.join|resolve)/i;

  const findings = [];
  for (const file of files) {
    const absolute = path.join(ROOT, file);
    const lines = readFileSync(absolute, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (!rootPattern.test(line)) {
        return;
      }

      findings.push({
        file,
        line: index + 1,
        severity: writerPattern.test(line) ? 'REVIEW_BEFORE_RUNNING' : 'REFERENCE_ONLY',
        text: line.trim().slice(0, 180),
      });
    });
  }

  return findings;
}

function markdownReport(summary, rows) {
  return [
    `# Private Artifact Boundary Guard - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: repo-local guard for internal report/control artifacts after live public exposure was fixed.',
    '',
    '## Release Gates',
    '',
    `- Public artifact root directories present: ${summary.publicRootsPresent.length ? summary.publicRootsPresent.join(', ') : 'None'}`,
    `- Tracked files under public artifact roots: ${summary.trackedPublicArtifacts.length}`,
    `- Public roots covered by .gitignore: ${summary.gitignoreCovered}/${summary.gitignoreTotal}`,
    `- Legacy tool references to public artifact roots: ${summary.legacyReferenceCount}`,
    '',
    '## Interpretation',
    '',
    summary.status === 'PASS'
      ? 'The deployed-theme root is clean: no public artifact folders exist and no files are tracked under those public paths.'
      : 'The deployed-theme root is not clean. Do not deploy until public artifact folders/tracked files are removed or moved to dot-private paths.',
    '',
    'Legacy tool references are reported so future operators do not rerun old scripts blindly. Default mode does not fail on those references because many historical tools still need a planned migration, but `--fail-on-legacy-writers` can enforce that stricter gate later.',
    '',
    '## Legacy Tool References',
    '',
    rows.length ? '| File | Line | Severity | Text |' : '- None detected.',
    rows.length ? '| --- | ---: | --- | --- |' : '',
    ...rows.map((row) => `| ${row.file} | ${row.line} | ${row.severity} | ${row.text.replace(/\|/g, '/')} |`),
    '',
    '## Safety Statement',
    '',
    'This checker writes only dot-private `.project-control` report files. It does not publish CMS content, touch redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, send email/WhatsApp, or change payment/provider settings.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-private-artifact-boundaries.mjs [--reportDate=YYYY-MM-DD] [--fail-on-legacy-writers]');
  process.exit(0);
}

const trackedPublicArtifacts = scanTrackedPublicArtifacts();
const publicRootsPresent = scanExistingPublicRoots();
const gitignoreRows = scanGitignore();
const legacyRows = scanLegacyToolReferences();
const hardFailures = [
  ...publicRootsPresent.map((root) => `Public artifact root exists: ${root}`),
  ...trackedPublicArtifacts.map((file) => `Tracked public artifact file: ${file}`),
  ...gitignoreRows.filter((row) => !row.ignored).map((row) => `Missing .gitignore coverage: ${row.root}`),
];

if (args.failOnLegacyWriters) {
  hardFailures.push(...legacyRows.filter((row) => row.severity === 'REVIEW_BEFORE_RUNNING').map((row) => `Legacy writer reference: ${row.file}:${row.line}`));
}

const summary = {
  reportDate: args.reportDate,
  status: hardFailures.length ? 'FAIL' : 'PASS',
  hardFailures,
  publicRootsPresent,
  trackedPublicArtifacts,
  gitignoreCovered: gitignoreRows.filter((row) => row.ignored).length,
  gitignoreTotal: gitignoreRows.length,
  legacyReferenceCount: legacyRows.length,
  failOnLegacyWriters: args.failOnLegacyWriters,
};

const base = `private-artifact-boundary-guard-${args.reportDate}`;
const mdPath = path.join(ROOT, '.project-control', `${base}.md`);
const csvPath = path.join(ROOT, '.project-control', `${base}.csv`);

const csv = [
  'file,line,severity,text',
  ...legacyRows.map((row) => [row.file, row.line, row.severity, row.text].map(csvEscape).join(',')),
].join('\n');

writeText(mdPath, markdownReport(summary, legacyRows));
writeText(csvPath, `${csv}\n`);

console.log(JSON.stringify({ ...summary, mdPath, csvPath }, null, 2));

if (hardFailures.length) {
  process.exitCode = 1;
}
