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

function usage() {
  return `Check the single article template for duplicate contextual CTA rendering.

Usage:
  node tools/check-article-duplicate-cta-guard.mjs --reportDate=YYYY-MM-DD
`;
}

function outputFiles(reportDate) {
  const base = `article-duplicate-cta-guard-${reportDate}`;
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

function countMatches(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const templatePath = path.join(ROOT, 'single-articles.php');
  const cssPath = path.join(ROOT, 'assets', 'css', 'premium-pass-4.css');
  const markerPath = path.join(ROOT, 'deployment-marker.txt');
  const template = readFileSync(templatePath, 'utf8');
  const css = readFileSync(cssPath, 'utf8');
  const marker = readFileSync(markerPath, 'utf8');

  const rows = [
    {
      check: 'unique_sidebar_guard',
      status: template.includes('$has_unique_sidebar_content') ? 'PASS' : 'FAIL',
      evidence: 'Template defines a unique-content sidebar guard.',
      next_step: 'Keep sidebar rendering behind unique connected lawyer, cluster nav or admin status content.',
    },
    {
      check: 'sidebar_render_guard',
      status: template.includes('<?php if ( $has_unique_sidebar_content ) : ?>') ? 'PASS' : 'FAIL',
      evidence: 'Aside is rendered only when sidebar has unique content.',
      next_step: 'Do not render duplicate-only article CTA sidebars.',
    },
    {
      check: 'duplicate_sidebar_text_removed',
      status: countMatches(template, "$article_contextual_cta['text']") === 1 ? 'PASS' : 'FAIL',
      evidence: `Contextual CTA text render count in single-articles.php: ${countMatches(template, "$article_contextual_cta['text']")}.`,
      next_step: 'Expected count is 1: the main after-article CTA only.',
    },
    {
      check: 'no_sidebar_duplicate_class_in_template',
      status: template.includes('single-article__sidebar-lead-card--duplicate') ? 'FAIL' : 'PASS',
      evidence: 'Duplicate sidebar CTA class should not be emitted by the template.',
      next_step: 'Keep no-lawyer sidebars focused on unique cluster/admin content only.',
    },
    {
      check: 'no_sidebar_layout_class',
      status: css.includes('.single-article__layout--no-sidebar') ? 'PASS' : 'FAIL',
      evidence: 'No-sidebar article layout is centered when duplicate-only sidebar is suppressed.',
      next_step: 'Keep the single-column layout override in the last-loaded public CSS file.',
    },
    {
      check: 'deployment_marker',
      status: marker.includes('article-duplicate-cta-guard-v1') ? 'PASS' : 'FAIL',
      evidence: marker.trim().replace(/\n/g, ' | '),
      next_step: 'After uPress pull, verify live marker matches article-duplicate-cta-guard-v1.',
    },
  ];

  const status = rows.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL';
  const columns = ['check', 'status', 'evidence', 'next_step'];
  const files = outputFiles(args.reportDate);
  const markdownRows = rows
    .map((row) => `| ${row.check} | ${row.status} | ${row.evidence} | ${row.next_step} |`)
    .join('\n');
  const markdown = `# Article Duplicate CTA Guard - ${args.reportDate}

Status: ${status}

Scope: local template/CSS safety check for the owner-reported mobile article issue where the same help/request CTA could appear twice. This does not publish CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, payments or public database rows.

## Results

| Check | Status | Evidence | Next Step |
| --- | --- | --- | --- |
${markdownRows}

## Interpretation

- The article keeps one contextual after-content CTA.
- The sidebar now renders only when it has unique content such as a connected lawyer, family-law cluster navigation, or editor-only status.
- If the sidebar would only repeat the same request/help text, it is suppressed at PHP render time instead of relying on mobile CSS.
`;

  const payload = {
    report_date: args.reportDate,
    status,
    rows,
    safety: {
      public_cms_changed: false,
      urls_changed: false,
      redirects_changed: false,
      canonicals_changed: false,
      noindex_changed: false,
      sitemaps_changed: false,
      taxonomies_changed: false,
      leads_changed: false,
      payments_changed: false,
    },
  };

  writeText(files.projectMd, markdown);
  writeText(files.projectCsv, toCsv(rows, columns));
  writeText(files.reportJson, JSON.stringify(payload, null, 2));
  writeText(files.reportCsv, toCsv(rows, columns));

  process.stdout.write(`Status: ${status}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.projectMd)}\n`);

  if (status !== 'PASS') {
    process.exitCode = 1;
  }
}

main();
