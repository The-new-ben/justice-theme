#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const DEFAULT_TIMEOUT_MS = 20000;
const FORBIDDEN_PATTERNS = [
  {
    name: 'legacy_page_id_url',
    pattern: /\?page_id=|page_id=\d+/i,
    reason: 'Public/internal links should use canonical slugs, not WordPress page_id URLs.',
  },
];
const LIVE_PATHS = ['/', '/about/', '/contact/', '/lawyers/', '/lawyer-plans/', '/lawyer-registration/'];
const SOURCE_DIRS = ['assets', 'inc', 'patterns', 'parts', 'template-parts'];
const SOURCE_FILE_EXTENSIONS = new Set(['.php', '.js', '.mjs', '.css', '.html', '.json']);
const ROOT_SOURCE_FILES = [
  '404.php',
  'archive.php',
  'footer.php',
  'front-page.php',
  'functions.php',
  'header.php',
  'home.php',
  'index.php',
  'page.php',
  'page-contact.php',
  'page-lawyer-dashboard.php',
  'page-lawyer-plans.php',
  'page-lawyer-registration.php',
  'single.php',
];

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    root: process.cwd(),
    paths: [...LIVE_PATHS],
    skipLive: false,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--base-url' && argv[index + 1]) {
      args.baseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--root' && argv[index + 1]) {
      args.root = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--path' && argv[index + 1]) {
      args.paths.push(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--skip-live') {
      args.skipLive = true;
      continue;
    }

    if (arg === '--timeout-ms' && argv[index + 1]) {
      args.timeoutMs = Number.parseInt(argv[index + 1], 10) || DEFAULT_TIMEOUT_MS;
      index += 1;
    }
  }

  args.baseUrl = args.baseUrl.replace(/\/+$/, '');
  args.paths = [...new Set(args.paths)];
  return args;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Jus-Tice-Link-Hygiene-Checker/1.0',
        Accept: 'text/html,*/*',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function patternHits(text) {
  return FORBIDDEN_PATTERNS
    .map((item) => {
      const flags = item.pattern.flags.includes('g') ? item.pattern.flags : `${item.pattern.flags}g`;
      const matcher = new RegExp(item.pattern.source, flags);
      const snippets = [];
      let count = 0;

      for (const match of text.matchAll(matcher)) {
        count += 1;

        if (snippets.length >= 3) {
          continue;
        }

        const index = match.index || 0;
        const before = Math.max(0, index - 120);
        const after = Math.min(text.length, index + match[0].length + 120);
        snippets.push(
          text
            .slice(before, after)
            .replace(/\s+/g, ' ')
            .trim()
        );
      }

      return {
        name: item.name,
        reason: item.reason,
        count,
        snippets,
      };
    })
    .filter((item) => item.count > 0);
}

async function checkLivePath(baseUrl, path, timeoutMs) {
  const url = new URL(path, `${baseUrl}/`).toString();

  try {
    const response = await fetchWithTimeout(url, timeoutMs);
    const body = await response.text();
    const hits = patternHits(body);
    const hitCount = hits.reduce((total, hit) => total + hit.count, 0);

    return {
      type: 'live',
      path,
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 && hits.length === 0,
      hits,
      hitCount,
      bodyLength: body.length,
    };
  } catch (error) {
    return {
      type: 'live',
      path,
      url,
      status: 0,
      ok: false,
      hits: [],
      hitCount: 0,
      bodyLength: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function hasSourceExtension(filePath) {
  const dot = filePath.lastIndexOf('.');
  return dot >= 0 && SOURCE_FILE_EXTENSIONS.has(filePath.slice(dot).toLowerCase());
}

async function collectFiles(targetPath) {
  const stats = await stat(targetPath);

  if (stats.isFile()) {
    return hasSourceExtension(targetPath) ? [targetPath] : [];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    files.push(...await collectFiles(join(targetPath, entry.name)));
  }

  return files;
}

async function checkSourceFile(root, filePath) {
  const text = await readFile(filePath, 'utf8');
  const hits = patternHits(text);
  const hitCount = hits.reduce((total, hit) => total + hit.count, 0);

  return {
    type: 'source',
    file: relative(root, filePath).replace(/\\/g, '/'),
    ok: hits.length === 0,
    hits,
    hitCount,
  };
}

async function checkSources(root) {
  const files = [];

  for (const fileName of ROOT_SOURCE_FILES) {
    try {
      files.push(...await collectFiles(join(root, fileName)));
    } catch {
      // Optional root files are allowed to be absent.
    }
  }

  for (const dirName of SOURCE_DIRS) {
    try {
      files.push(...await collectFiles(join(root, dirName)));
    } catch {
      // Optional theme directories are allowed to be absent.
    }
  }

  const uniqueFiles = [...new Set(files)];
  return Promise.all(uniqueFiles.map((file) => checkSourceFile(root, file)));
}

const args = parseArgs(process.argv.slice(2));
const liveResults = [];

if (!args.skipLive) {
  for (const path of args.paths) {
    liveResults.push(await checkLivePath(args.baseUrl, path, args.timeoutMs));
  }
}

const sourceResults = await checkSources(args.root);
const failed = [...liveResults, ...sourceResults].filter((result) => !result.ok);
const summary = {
  checkedAt: new Date().toISOString(),
  baseUrl: args.baseUrl,
  pass: failed.length === 0,
  failed,
  liveResults,
  liveSummary: {
    pathsChecked: liveResults.length,
    failedPaths: liveResults.filter((result) => !result.ok).map((result) => result.path),
    hitCount: liveResults.reduce((total, result) => total + result.hitCount, 0),
  },
  sourceSummary: {
    filesChecked: sourceResults.length,
    failedFiles: sourceResults.filter((result) => !result.ok),
    hitCount: sourceResults.reduce((total, result) => total + result.hitCount, 0),
  },
  standard: {
    canonicalInternalLinks: 'Use canonical slugs such as /about/ for trust and revenue pages.',
    legacyPageIds: 'Do not link users to ?page_id= URLs from runtime templates or key live pages.',
    allowedException: 'Old page_id requests can remain live with canonical signals unless the owner approves redirects.',
  },
  note: 'Read-only checker. It does not change redirects, canonicals, noindex, sitemap, CMS content, database rows, forms, leads, or payments.',
};

console.log(JSON.stringify(summary, null, 2));

if (!summary.pass) {
  process.exit(1);
}
