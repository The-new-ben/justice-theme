import { mkdirSync, writeFileSync } from 'node:fs';
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
  const base = `linear-completion-reconciliation-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
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

const rows = [
  {
    issue: 'HAD-95',
    title: 'Review duplicate Bituach Leumi live route title/H1',
    prior_linear_state: 'Backlog',
    target_linear_state: 'Done',
    repo_task: 'T546',
    evidence: '.project-control/bituach-leumi-route-intent-review-2026-05-26.md; .reports/bituach-leumi-route-intent-review-2026-05-26.json',
    completion: 'Route-intent split documented for /national-insurance-attorney/ and /bituach-leumi-appeal-guide/. No public metadata was changed.',
    remaining_blocker: 'Owner/SEO/GSC approval is still required before any public title, H1, internal-link, canonical, redirect, noindex, sitemap, taxonomy or slug change.',
    public_change: 'NO',
    email_needed: 'NO',
  },
  {
    issue: 'HAD-96',
    title: 'Guard mobile article pages from duplicate help CTA',
    prior_linear_state: 'In Review',
    target_linear_state: 'Done',
    repo_task: 'T547; T549',
    evidence: '.project-control/article-duplicate-cta-guard-2026-05-26.md; .project-control/live-article-cta-dedupe-2026-05-26.md; .reports/live-article-cta-dedupe-2026-05-26.json',
    completion: 'Template guard was implemented, deployed earlier, live verified on the sampled article, and the owner email was already recorded in the project log.',
    remaining_blocker: 'Broader visual QA should still sample a connected-lawyer article and a family-law cluster article, but the duplicate CTA issue itself is closed.',
    public_change: 'ALREADY_DEPLOYED_BEFORE_THIS_RECONCILIATION',
    email_needed: 'NO_ALREADY_SENT',
  },
];

function markdownReport(reportDate) {
  const summary = {
    reportDate,
    linearReconciliationIssue: 'HAD-103',
    reconciledIssues: rows.length,
    targetDone: rows.filter((row) => row.target_linear_state === 'Done').length,
    publicChangesThisCycle: 0,
    emailsRequiredThisCycle: 0,
    uPressRequiredThisCycle: 0,
  };

  const lines = [
    `# Linear Completion Reconciliation - ${reportDate}`,
    '',
    'Status: LINEAR_DONE_PRIVATE_RECONCILIATION',
    '',
    'Scope: repo-local reconciliation for work that is already documented as complete locally but still had stale Linear states. This report does not publish or update CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyers, suppliers, payments, email, WhatsApp, uPress or database rows.',
    '',
    '## Summary',
    '',
    `- Linear reconciliation issue: ${summary.linearReconciliationIssue}`,
    `- Issues reconciled: ${summary.reconciledIssues}`,
    `- Linear state result: ${summary.targetDone} issue(s) moved to Done`,
    `- Public changes in this cycle: ${summary.publicChangesThisCycle}`,
    `- Emails required in this cycle: ${summary.emailsRequiredThisCycle}`,
    `- uPress pull required in this cycle: ${summary.uPressRequiredThisCycle}`,
    '',
    '## Issue Reconciliation',
    '',
    '| Linear | Prior state | Target state | Repo task | Evidence | Completion | Remaining blocker |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| ${row.issue} | ${row.prior_linear_state} | ${row.target_linear_state} | ${row.repo_task} | ${row.evidence} | ${row.completion} | ${row.remaining_blocker} |`
    ),
    '',
    '## Operating Decision',
    '',
    '- Close the stale Linear issues instead of reopening already-finished work.',
    '- Keep public Bituach Leumi metadata/body changes blocked until owner/SEO/GSC approval.',
    '- Treat the article duplicate CTA issue as closed because a separate live verification report exists and owner email was already recorded.',
    '- Do not send a new email for this reconciliation because it is private Linear hygiene, not a new public-facing change or new blocker.',
    '',
    '## Safety Statement',
    '',
    'This packet only reconciles task state and evidence paths. It does not modify public content, titles, H1s, metadata, links, technical SEO controls, lead routing, supplier/lawyer handoff, payments, invoices, email, WhatsApp, TalkTo, GSC, GA4 or live deployment state.',
    '',
  ];

  return { summary, markdown: lines.join('\n') };
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-linear-completion-reconciliation.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const files = outputFiles(args.reportDate);
const { summary, markdown } = markdownReport(args.reportDate);
const columns = [
  'issue',
  'title',
  'prior_linear_state',
  'target_linear_state',
  'repo_task',
  'evidence',
  'completion',
  'remaining_blocker',
  'public_change',
  'email_needed',
];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdown);
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows, files }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(`Generated ${path.relative(ROOT, files.projectMd)}`);
console.log(`Generated ${path.relative(ROOT, files.projectCsv)}`);
console.log(`Generated ${path.relative(ROOT, files.reportJson)}`);
console.log(`Generated ${path.relative(ROOT, files.reportCsv)}`);
