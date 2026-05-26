import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const defaultPaths = [
  '/',
  '/find-lawyer-how-to-find-good-attorney/',
  '/most-recommended-family-lawyer/',
  '/experienced-family-law-attorney/',
  '/national-insurance-attorney/',
  '/bituach-leumi-appeal-guide/',
  '/rental-agreement/',
  '/labor-lawyer/',
  '/consumer-rights-israel/',
  '/eviction-notice-israel/',
];

const articlePaths = new Set([
  '/find-lawyer-how-to-find-good-attorney/',
  '/most-recommended-family-lawyer/',
  '/experienced-family-law-attorney/',
]);

const ctaTextMarkers = [
  'פנייה',
  'צרו קשר',
  'צור קשר',
  'השאירו פרטים',
  'שליחת פרטים',
  'שלחו פרטים',
  'בדיקת התאמה',
  'בדיקה ראשונית',
  'מצאו עורך דין',
  'דברו איתנו',
  'וואטסאפ',
  'טלפון',
  'ייעוץ',
  'contact',
  'whatsapp',
  'call',
  'lawyer',
  'attorney',
];

const primaryCtaClassMarkers = [
  'cta',
  'lead',
  'contact',
  'button',
  'btn',
  'whatsapp',
  'phone',
  'submit',
  'hero',
  'card',
];

function parseArgs() {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    paths: [],
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--baseUrl=')) {
      args.baseUrl = arg.slice('--baseUrl='.length);
    } else if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--path=')) {
      args.paths.push(arg.slice('--path='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  if (args.paths.length === 0) {
    args.paths = defaultPaths;
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `live-public-cta-density-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
  };
}

function absoluteUrl(baseUrl, pathOrUrl) {
  return new URL(pathOrUrl, baseUrl).toString();
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripTags(html) {
  return normalizeWhitespace(
    decodeEntities(String(html || ''))
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

function extractTag(html, tagName) {
  const match = String(html || '').match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? stripTags(match[1]) : '';
}

function extractAllTags(html, tagName) {
  return [...String(html || '').matchAll(new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'gi'))]
    .map((match) => ({
      attrs: match[1] || '',
      text: stripTags(match[2]),
    }))
    .filter((item) => item.text);
}

function attrValue(attrs, name) {
  const match = String(attrs || '').match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function markerHits(text, markers) {
  const haystack = String(text || '').toLocaleLowerCase('he-IL');
  return markers.filter((marker) => haystack.includes(marker.toLocaleLowerCase('he-IL')));
}

function normalizedCtaText(text) {
  return normalizeWhitespace(text)
    .toLocaleLowerCase('he-IL')
    .replace(/[|:–—\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPrimaryCtas(html) {
  const anchors = [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    tag: 'a',
    attrs: match[1] || '',
    text: stripTags(match[2]),
    href: attrValue(match[1], 'href'),
  }));
  const buttons = extractAllTags(html, 'button').map((button) => ({
    tag: 'button',
    attrs: button.attrs,
    text: button.text,
    href: '',
  }));

  return [...anchors, ...buttons]
    .map((item) => {
      const className = attrValue(item.attrs, 'class');
      const combined = `${item.tag} ${className} ${item.href} ${item.text}`;
      const hasTextMarker = markerHits(item.text, ctaTextMarkers).length > 0;
      const hasClassMarker = markerHits(combined, primaryCtaClassMarkers).length > 0;
      const hasActionHref = /^tel:|^https?:\/\/wa\.me|whatsapp|lead_area|\/contact|\/lawyers\/|\/lawyer-registration/i.test(item.href);
      const isPrimary = hasTextMarker && (hasClassMarker || hasActionHref);

      return {
        ...item,
        className,
        isPrimary,
        normalizedText: normalizedCtaText(item.text),
      };
    })
    .filter((item) => item.isPrimary && item.normalizedText);
}

function groupCounts(items, keyName) {
  const groups = new Map();
  for (const item of items) {
    const key = item[keyName] || '';
    if (!key || key === '#') {
      continue;
    }
    groups.set(key, (groups.get(key) || 0) + 1);
  }

  return [...groups.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function countOccurrences(text, needle) {
  if (!needle) {
    return 0;
  }
  return (String(text || '').match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Jus-Tice-Public-CTA-Density-Audit/1.0',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function inspectPath(baseUrl, pathOrUrl) {
  const requestedPath = new URL(absoluteUrl(baseUrl, pathOrUrl)).pathname;
  const url = absoluteUrl(baseUrl, `${pathOrUrl}${pathOrUrl.includes('?') ? '&' : '?'}cta_density_audit=${Date.now()}`);

  try {
    const response = await fetchWithTimeout(url);
    const contentType = response.headers.get('content-type') || '';
    const html = contentType.toLowerCase().includes('text/html') ? await response.text() : '';
    const finalPath = new URL(response.url).pathname;
    const title = extractTag(html, 'title');
    const h1 = extractTag(html, 'h1');
    const visibleText = stripTags(html);
    const ctas = extractPrimaryCtas(html);
    const textGroups = groupCounts(ctas, 'normalizedText');
    const hrefGroups = groupCounts(ctas.filter((cta) => !/^tel:|whatsapp|wa\.me/i.test(cta.href)), 'href');
    const duplicateTextGroups = textGroups.filter((group) => group.count > 2);
    const duplicateHrefGroups = hrefGroups.filter((group) => group.count > 2);
    const articleLeadCtaCount = countOccurrences(html, 'single-article__lead-cta');
    const duplicateSidebarClassCount = countOccurrences(html, 'single-article__sidebar--duplicate-cta');
    const issues = [];

    if (response.status !== 200) {
      issues.push(`http_${response.status}`);
    }
    if (finalPath !== requestedPath) {
      issues.push(`final_path_${finalPath}`);
    }
    if (articlePaths.has(requestedPath) && articleLeadCtaCount > 1) {
      issues.push('article_lead_cta_repeated');
    }
    if (duplicateTextGroups.length > 0) {
      issues.push('repeated_primary_cta_text_review');
    }
    if (duplicateHrefGroups.length > 0) {
      issues.push('repeated_primary_cta_href_review');
    }
    if (ctas.length === 0) {
      issues.push('no_detected_primary_cta');
    }

    const hardFailures = issues.filter((issue) => issue === 'article_lead_cta_repeated' || issue === 'no_detected_primary_cta');

    return {
      path: requestedPath,
      url: absoluteUrl(baseUrl, requestedPath),
      status: hardFailures.length ? 'FAIL' : issues.length ? 'REVIEW' : 'PASS',
      http_status: response.status,
      final_url: response.url,
      title,
      h1,
      primary_cta_count: ctas.length,
      unique_primary_cta_texts: textGroups.length,
      article_lead_cta_count: articleLeadCtaCount,
      duplicate_sidebar_class_count: duplicateSidebarClassCount,
      repeated_text_groups: duplicateTextGroups.map((group) => `${group.key} (${group.count})`).join(' | ') || '-',
      repeated_href_groups: duplicateHrefGroups.map((group) => `${group.key} (${group.count})`).join(' | ') || '-',
      sample_ctas: ctas.slice(0, 8).map((cta) => `${cta.text} -> ${cta.href || cta.tag}`).join(' | ') || '-',
      issues: issues.join(';') || '-',
      next_step: hardFailures.length
        ? 'Fix before relying on the page for public conversion.'
        : issues.length
          ? 'Manually review density/repetition before adding more CTAs or public managed-service copy.'
          : 'Keep in normal public QA rotation.',
    };
  } catch (error) {
    return {
      path: requestedPath,
      url: absoluteUrl(baseUrl, requestedPath),
      status: 'FAIL',
      http_status: 0,
      final_url: '',
      title: '',
      h1: '',
      primary_cta_count: 0,
      unique_primary_cta_texts: 0,
      article_lead_cta_count: 0,
      duplicate_sidebar_class_count: 0,
      repeated_text_groups: '-',
      repeated_href_groups: '-',
      sample_ctas: '-',
      issues: error instanceof Error ? error.message : String(error),
      next_step: 'Retry live read-only fetch before publishing related content.',
    };
  }
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function markdownReport(rows, reportDate, baseUrl) {
  const failures = rows.filter((row) => row.status === 'FAIL');
  const reviews = rows.filter((row) => row.status === 'REVIEW');
  const status = failures.length ? 'FAIL_CTA_DENSITY_BLOCKERS' : reviews.length ? 'PASS_WITH_DENSITY_REVIEWS' : 'PASS';

  return [
    `# Live Public CTA Density Audit - ${reportDate}`,
    '',
    `Status: ${status}`,
    '',
    `Base URL: ${baseUrl}`,
    '',
    'Scope: read-only live audit for public visitor-facing CTA density and repetition. It checks whether sampled pages still feel like legal-help pages instead of noisy sales surfaces.',
    '',
    'Safety: no login, CMS edit, title/H1/meta/body change, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, invoice, payment, email, WhatsApp, TalkTo, wp-admin or uPress action was performed.',
    '',
    '## Page Results',
    '',
    '| Path | Status | HTTP | Primary CTAs | Unique CTA Texts | Article CTA Count | Duplicate Sidebar Class | Repeated Text | Repeated Href | Issues |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |',
    ...rows.map(
      (row) => `| ${row.path} | ${row.status} | ${row.http_status} | ${row.primary_cta_count} | ${row.unique_primary_cta_texts} | ${row.article_lead_cta_count} | ${row.duplicate_sidebar_class_count} | ${row.repeated_text_groups.replace(/\|/g, '/')} | ${row.repeated_href_groups.replace(/\|/g, '/')} | ${row.issues.replace(/\|/g, '/')} |`
    ),
    '',
    '## Interpretation',
    '',
    failures.length
      ? '- At least one sampled page has a hard CTA issue that should be fixed before relying on the page for conversion.'
      : '- No hard duplicate article CTA or missing-primary-CTA issue was found in the sampled pages.',
    reviews.length
      ? '- Some sampled pages have repeated CTA text/href patterns. Review manually before adding new public CTAs or managed-service copy.'
      : '- No repeated primary CTA text/href patterns crossed the review threshold.',
    '- Article pages remain specifically guarded because the owner saw repeated mobile help CTAs while scrolling.',
    '- Public managed-service pages/CTAs remain blocked until owner/SEO/legal approval and mobile duplicate-CTA QA are complete.',
    '',
    '## Sample CTA Evidence',
    '',
    '| Path | Sample CTAs |',
    '| --- | --- |',
    ...rows.map((row) => `| ${row.path} | ${row.sample_ctas.replace(/\|/g, '<br>')} |`),
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-live-public-cta-density.mjs [--reportDate=YYYY-MM-DD] [--baseUrl=https://jus-tice.co.il] [--path=/some-page/]');
  process.exit(0);
}

const rows = [];
for (const pathOrUrl of args.paths) {
  rows.push(await inspectPath(args.baseUrl, pathOrUrl));
}

const outputs = outputFiles(args.reportDate);
const columns = [
  'path',
  'url',
  'status',
  'http_status',
  'final_url',
  'title',
  'h1',
  'primary_cta_count',
  'unique_primary_cta_texts',
  'article_lead_cta_count',
  'duplicate_sidebar_class_count',
  'repeated_text_groups',
  'repeated_href_groups',
  'sample_ctas',
  'issues',
  'next_step',
];

writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportJson, JSON.stringify({ rows }, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.reportDate, args.baseUrl));

console.table(rows.map(({ path, status, http_status, primary_cta_count, article_lead_cta_count, issues }) => ({
  path,
  status,
  http_status,
  primary_cta_count,
  article_lead_cta_count,
  issues,
})));
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (rows.some((row) => row.status === 'FAIL')) {
  process.exitCode = 1;
}
