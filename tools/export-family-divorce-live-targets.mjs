import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const OUTPUT_DIR = process.env.JUSTICE_FAMILY_DIVORCE_BACKUP_DIR
  || 'reports/family-divorce-live-target-backup-2026-05-21';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const WRITE_RAW_HTML = process.env.JUSTICE_WRITE_RAW_HTML === '1';
const TIMEOUT_MS = Number(process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000);

const targets = [
  ['/divorce-lawyer/', 'Family/Divorce pillar target'],
  ['/consensual-divorce/', 'Consensual divorce support target'],
  ['/divorce-mediation/', 'Divorce mediation support target'],
  ['/divorce-property-division/', 'Property division support target'],
  ['/family-dispute-resolution/', 'Family dispute resolution support target'],
  ['/child-support/', 'Child support support target'],
  ['/child-custody/', 'Child custody support target'],
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizePathname(pathname) {
  const value = String(pathname || '/');
  if (value === '/') {
    return '/';
  }

  const trimmed = value.replace(/^\/+|\/+$/g, '');
  if (!trimmed) {
    return '/';
  }

  const lastSegment = trimmed.split('/').at(-1) || '';
  const suffix = lastSegment.includes('.') ? '' : '/';
  return `/${trimmed}${suffix}`;
}

function extractTag(body, tagName) {
  const match = body.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? normalizeWhitespace(stripTags(match[1])) : '';
}

function extractAttribute(body, pattern) {
  const match = body.match(pattern);
  return match ? normalizeWhitespace(decodeHtmlEntities(match[1])) : '';
}

function extractCanonical(body) {
  return extractAttribute(
    body,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  ) || extractAttribute(
    body,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  );
}

function extractMeta(body, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return extractAttribute(
    body,
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'),
  ) || extractAttribute(
    body,
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["']`, 'i'),
  );
}

function decodeHtmlEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    hellip: '...',
    nbsp: ' ',
    quot: '"',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    ndash: '-',
    mdash: '-',
  };

  return String(value || '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
      const lower = entity.toLowerCase();
      if (lower.startsWith('#x')) {
        const code = Number.parseInt(lower.slice(2), 16);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      if (lower.startsWith('#')) {
        const code = Number.parseInt(lower.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return named[lower] || match;
    });
}

function stripTags(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|li|h[1-6]|section|article|div|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  );
}

function extractPrimaryHtml(body) {
  const selectors = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]+class=["'][^"']*(entry-content|post-content|article-content|page-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of selectors) {
    const match = body.match(pattern);
    if (match) {
      return match[2] || match[1] || '';
    }
  }

  return body;
}

function extractText(body) {
  const primary = extractPrimaryHtml(body);
  return stripTags(primary)
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .join('\n');
}

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function slugFromPath(path) {
  const normalized = normalizePathname(path);
  const trimmed = normalized.replace(/^\/+|\/+$/g, '');
  return trimmed || 'home';
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function exportTarget(target) {
  const [path, role] = target;
  const url = absoluteUrl(path);
  const response = await fetchWithTimeout(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Jus-Tice-Family-Divorce-Live-Target-Exporter/1.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
    },
  });
  const body = await response.text();
  const finalUrl = response.url;
  const expectedPath = normalizePathname(new URL(url).pathname);
  const finalPath = normalizePathname(new URL(finalUrl).pathname);
  const text = extractText(body);
  const title = extractTag(body, 'title');
  const h1 = extractTag(body, 'h1');
  const canonical = extractCanonical(body);
  const metaDescription = extractMeta(body, 'description');
  const robots = extractMeta(body, 'robots');
  const slug = slugFromPath(path);
  const issues = [];

  if (response.status !== 200) {
    issues.push(`http_${response.status}`);
  }
  if (finalPath !== expectedPath) {
    issues.push(`final_path_${finalPath}_expected_${expectedPath}`);
  }
  if (!canonical) {
    issues.push('missing_canonical');
  }
  if (robots.toLowerCase().includes('noindex')) {
    issues.push('noindex_present');
  }
  if (!h1) {
    issues.push('missing_h1');
  }
  if (countWords(text) < 300) {
    issues.push(`extracted_text_short_${countWords(text)}_words`);
  }

  return {
    role,
    path,
    slug,
    status: issues.length === 0 ? 'PASS' : 'REVIEW',
    http: response.status,
    expectedPath,
    finalPath,
    finalUrl,
    canonical,
    robots,
    title,
    h1,
    metaDescription,
    htmlBytes: Buffer.byteLength(body, 'utf8'),
    textWords: countWords(text),
    textChars: text.length,
    textFile: `${slug}.txt`,
    rawHtmlFile: WRITE_RAW_HTML ? `${slug}.html` : '',
    issues: issues.join(';') || '-',
    text,
    body,
  };
}

const results = [];

for (const target of targets) {
  try {
    results.push(await exportTarget(target));
  } catch (error) {
    const [path, role] = target;
    const slug = slugFromPath(path);
    results.push({
      role,
      path,
      slug,
      status: 'REVIEW',
      http: 0,
      expectedPath: normalizePathname(new URL(absoluteUrl(path)).pathname),
      finalPath: '',
      finalUrl: '',
      canonical: '',
      robots: '',
      title: '',
      h1: '',
      metaDescription: '',
      htmlBytes: 0,
      textWords: 0,
      textChars: 0,
      textFile: `${slug}.txt`,
      rawHtmlFile: WRITE_RAW_HTML ? `${slug}.html` : '',
      issues: error instanceof Error ? error.message : String(error),
      text: '',
      body: '',
    });
  }
}

console.table(results.map((result) => ({
  status: result.status,
  path: result.path,
  http: result.http,
  finalPath: result.finalPath,
  textWords: result.textWords,
  issues: result.issues,
})));

if (WRITE_REPORT) {
  const targetDir = resolve(OUTPUT_DIR);
  await mkdir(targetDir, { recursive: true });

  const headers = [
    'path',
    'role',
    'status',
    'http',
    'expectedPath',
    'finalPath',
    'finalUrl',
    'canonical',
    'robots',
    'title',
    'h1',
    'metaDescription',
    'htmlBytes',
    'textWords',
    'textChars',
    'textFile',
    'rawHtmlFile',
    'issues',
  ];
  const csv = [
    headers.join(','),
    ...results.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';

  const manifestPath = resolve(targetDir, 'manifest.csv');
  await writeFile(manifestPath, csv, 'utf8');

  for (const result of results) {
    const textPath = resolve(targetDir, result.textFile);
    await writeFile(textPath, `${result.text}\n`, 'utf8');
    if (WRITE_RAW_HTML) {
      const htmlPath = resolve(targetDir, result.rawHtmlFile || `${result.slug}.html`);
      await writeFile(htmlPath, result.body, 'utf8');
    }
  }

  const readmePath = resolve(targetDir, 'README.md');
  await writeFile(readmePath, [
    '# Family/Divorce Live Target Backup - 2026-05-21',
    '',
    'Status: VERIFIED LIVE / READ ONLY / PUBLIC HTML-TEXT SNAPSHOT.',
    '',
    'This folder contains public live-page text snapshots and a metadata manifest for the seven Family/Divorce target URLs before any CMS overwrite/update.',
    '',
    'Important: this is not a WordPress database backup and not a substitute for exporting the current CMS editor fields before making changes.',
    '',
    `Base URL: ${BASE_URL}`,
    `Raw HTML saved: ${WRITE_RAW_HTML ? 'yes' : 'no'}`,
    '',
    `Manifest: ${basename(manifestPath)}`,
    '',
  ].join('\n'), 'utf8');

  console.log(`Wrote ${targetDir}`);
}

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
