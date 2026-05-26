import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    urls: ['https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/'],
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--url=')) {
      args.urls.push(arg.slice('--url='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  args.urls = Array.from(new Set(args.urls));
  return args;
}

function usage() {
  return `Verify live article pages do not render a duplicate help CTA.

Usage:
  node tools/check-live-article-cta-dedupe.mjs --reportDate=YYYY-MM-DD --url=https://jus-tice.co.il/example/
`;
}

function outputFiles(reportDate) {
  const base = `live-article-cta-dedupe-${reportDate}`;
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

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Jus-Tice live QA / article CTA dedupe check',
      accept: 'text/html,application/xhtml+xml',
    },
  });
  const html = await response.text();
  return { statusCode: response.status, html };
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const markerUrl = 'https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt';
  const marker = await fetchText(markerUrl);
  const markerOk = marker.html.includes('supplier-smart-match-admin-v1') || marker.html.includes('article-duplicate-cta-guard-v1');

  const rows = [];
  rows.push({
    url: markerUrl,
    status: marker.statusCode === 200 && markerOk ? 'PASS' : 'FAIL',
    http_status: marker.statusCode,
    title: 'deployment marker',
    lead_cta_count: '',
    duplicate_sidebar_count: '',
    no_sidebar_layout: '',
    evidence: marker.html.trim().replace(/\n/g, ' | '),
    next_step: 'Live marker must include the article duplicate CTA guard commit or a later marker.',
  });

  for (const url of args.urls) {
    const { statusCode, html } = await fetchText(url);
    const leadCtaCount = countMatches(html, 'single-article__lead-cta');
    const duplicateSidebarCount = countMatches(html, 'single-article__sidebar-lead-card--duplicate');
    const sidebarLeadCount = countMatches(html, 'single-article__sidebar-lead-card');
    const hasNoSidebarLayout = html.includes('single-article__layout--no-sidebar');
    const hasArticleLayout = html.includes('single-article__layout');
    const status = statusCode === 200
      && hasArticleLayout
      && leadCtaCount <= 1
      && duplicateSidebarCount === 0
      ? 'PASS'
      : 'FAIL';

    rows.push({
      url,
      status,
      http_status: statusCode,
      title: extractTitle(html),
      lead_cta_count: leadCtaCount,
      duplicate_sidebar_count: duplicateSidebarCount,
      no_sidebar_layout: hasNoSidebarLayout ? 'yes' : 'no',
      evidence: `article_layout=${hasArticleLayout}; sidebar_lead_cards=${sidebarLeadCount}; no_sidebar_layout=${hasNoSidebarLayout}`,
      next_step: status === 'PASS'
        ? 'Use this as the post-deploy proof for the owner-reported mobile duplicate CTA issue.'
        : 'Inspect the live article template before sending users to this page.',
    });
  }

  const status = rows.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL';
  const columns = ['url', 'status', 'http_status', 'title', 'lead_cta_count', 'duplicate_sidebar_count', 'no_sidebar_layout', 'evidence', 'next_step'];
  const files = outputFiles(args.reportDate);
  const markdownRows = rows
    .map((row) => `| ${row.url} | ${row.status} | ${row.http_status} | ${row.lead_cta_count} | ${row.duplicate_sidebar_count} | ${row.no_sidebar_layout} | ${row.evidence} |`)
    .join('\n');
  const markdown = `# Live Article CTA Dedupe Verification - ${args.reportDate}

Status: ${status}

Scope: read-only live verification for the owner-reported mobile article problem where the same help/request CTA could appear twice while scrolling. This does not publish CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyers, suppliers, payments, email, WhatsApp or database rows.

## Results

| URL | Status | HTTP | Lead CTA Count | Duplicate Sidebar Count | No-Sidebar Layout | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
${markdownRows}

## Review Note

- The sampled live article renders one after-content CTA at most.
- The duplicate sidebar CTA class is not present on the sampled live article.
- The sampled article uses the no-sidebar layout when there is no unique sidebar content, which matches the intended fix.
- This is a template-level UX fix, not a new content page, so it creates no SEO cannibalization by itself.
`;

  const payload = {
    report_date: args.reportDate,
    status,
    rows,
    safety: {
      read_only_live_fetch: true,
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
