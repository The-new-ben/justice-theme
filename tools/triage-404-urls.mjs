#!/usr/bin/env node
/**
 * Triage GSC/GA4 404 URL exports into safe redirect decisions.
 *
 * Usage:
 *   node tools/triage-404-urls.mjs path/to/404-export.csv --live --out project-control/404-triage.csv
 *
 * The script is intentionally conservative:
 * - spam/casino URLs should usually stay 404/410, not redirect;
 * - old real URLs with a known matching page become 301 candidates;
 * - unknown URLs are review items, not automatic redirects.
 */

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://jus-tice.co.il/';
const DEFAULT_OUT = path.join('project-control', `404-triage-${new Date().toISOString().slice(0, 10)}.csv`);

const args = process.argv.slice(2);
const inputPath = args.find((arg) => !arg.startsWith('--'));
const liveCheck = args.includes('--live');
const outIndex = args.indexOf('--out');
const outputPath = outIndex >= 0 && args[outIndex + 1] ? args[outIndex + 1] : DEFAULT_OUT;

if (!inputPath || args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node tools/triage-404-urls.mjs <gsc-or-ga4-404-export.csv> [--live] [--out output.csv]

Input CSV can contain any of these URL-ish columns:
  url, page, path, page path, landing page, not found url, normalized_url

Output columns:
  normalized_url, live_status, category, recommended_action, proposed_target, evidence
`);
  process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.trim() !== '')) {
        rows.push(row);
      }
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const out = {};
    headers.forEach((header, index) => {
      out[header] = cells[index] ?? '';
    });
    return out;
  });
}

function toCsv(rows, columns) {
  const escape = (value) => {
    const text = String(value ?? '');
    if (/[",\n\r]/.test(text)) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };

  return [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(',')),
  ].join('\n') + '\n';
}

function readCsvIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return parseCsv(fs.readFileSync(filePath, 'utf8'));
}

function normalizeUrl(rawValue) {
  const raw = String(rawValue || '').trim();
  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw, BASE_URL);
    if (!/(\.|^)jus-tice\.co\.il$/i.test(url.hostname)) {
      return null;
    }
    url.hash = '';
    const decodedPath = decodeURIComponent(url.pathname || '/');
    const normalizedPath = decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
    url.pathname = normalizedPath;
    return {
      raw,
      href: url.href,
      path: normalizedPath,
      slug: normalizedPath.split('/').filter(Boolean).pop() || '',
      query: url.search,
    };
  } catch {
    return null;
  }
}

function detectUrlValue(row) {
  const headers = Object.keys(row);
  const preferred = headers.find((header) => {
    const lower = header.toLowerCase();
    return [
      'url',
      'normalized_url',
      'not found url',
      'page',
      'page path',
      'landing page',
      'path',
    ].some((candidate) => lower === candidate || lower.includes(candidate));
  });

  if (preferred && row[preferred]) {
    return row[preferred];
  }

  return Object.values(row).find((value) => /^https?:\/\//i.test(String(value)) || String(value).startsWith('/')) || '';
}

function loadPhpSlugRedirects() {
  const filePath = path.join('inc', 'url-redirects.php');
  if (!fs.existsSync(filePath)) {
    return new Map();
  }

  const php = fs.readFileSync(filePath, 'utf8');
  const map = new Map();
  const regex = /'([^']+)'\s*=>\s*'([^']+)'/g;
  let match;

  while ((match = regex.exec(php)) !== null) {
    map.set(match[1], `/${match[2]}/`);
  }

  return map;
}

function loadPlannedRedirects() {
  const rows = readCsvIfExists(path.join('project-control', 'redirect-map.csv'));
  const exact = new Map();
  const byPath = new Map();

  for (const row of rows) {
    const oldUrl = normalizeUrl(row.old_url);
    const newUrl = normalizeUrl(row.new_url);
    if (!oldUrl || !newUrl) {
      continue;
    }
    const data = {
      target: newUrl.href,
      status: row.status || '',
      notes: row.notes || '',
    };
    exact.set(oldUrl.href, data);
    byPath.set(oldUrl.path, data);
  }

  return { exact, byPath };
}

function loadPerformanceMaps() {
  const files = [
    path.join('reports', 'gsc', 'performance-pages.csv'),
    path.join('justice_theme_emergency_master_2026_05_13', 'content-master', 'gsc-mirror', 'raw', 'gsc_pages_12m.csv'),
    path.join('justice_theme_emergency_master_2026_05_13', 'content-master', 'gsc-mirror', 'raw', 'gsc_pages_3m.csv'),
  ];

  const map = new Map();

  for (const file of files) {
    for (const row of readCsvIfExists(file)) {
      const page = normalizeUrl(row.page || row.Page || row.url || row.URL);
      if (!page) {
        continue;
      }
      const current = map.get(page.href) || { clicks: 0, impressions: 0 };
      current.clicks += Number(row.clicks || row.Clicks || 0) || 0;
      current.impressions += Number(row.impressions || row.Impressions || 0) || 0;
      map.set(page.href, current);
    }
  }

  return map;
}

function isSpamLike(urlInfo) {
  const text = `${urlInfo.href} ${urlInfo.path} ${urlInfo.query}`.toLowerCase();
  return /casino|bonos|juego|gambling|poker|roulette|slot|apuesta|betting|bonus|online-casino|guide-complet-du-casino/.test(text);
}

function isSystemNoise(urlInfo) {
  return /^\/(wp-json|wp-content|wp-admin|feed|xmlrpc\.php|author\/|tag\/|category\/|comment-page-)/i.test(urlInfo.path);
}

function looksLikeOldCasePath(urlInfo) {
  return /\/\d{4,}\/\d+\/?$/.test(urlInfo.path) || /\/\d{1,7}-\d{1,2}-\d{2,4}\/?$/.test(urlInfo.path);
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    return {
      status: response.status,
      location: response.headers.get('location') || '',
    };
  } catch (error) {
    return {
      status: 0,
      location: '',
      error: error.message,
    };
  }
}

function classify(urlInfo, context) {
  const perf = context.performance.get(urlInfo.href) || { clicks: 0, impressions: 0 };
  const planned = context.planned.exact.get(urlInfo.href) || context.planned.byPath.get(urlInfo.path);

  if (isSpamLike(urlInfo)) {
    return {
      category: 'spam_or_casino_noise',
      recommended_action: 'leave_404_or_use_410_if_confirmed_spam_indexed',
      proposed_target: '',
      evidence: 'Spam/casino pattern. Do not redirect to homepage or legal pages.',
      perf,
    };
  }

  if (isSystemNoise(urlInfo)) {
    return {
      category: 'system_or_archive_noise',
      recommended_action: 'leave_404_or_fix_internal_source_if_linked_internally',
      proposed_target: '',
      evidence: 'System/archive/feed style URL. Usually not a money redirect.',
      perf,
    };
  }

  if (planned) {
    return {
      category: 'planned_redirect_candidate',
      recommended_action: 'review_and_execute_exact_301_if_target_is_relevant',
      proposed_target: planned.target,
      evidence: `Found in project-control/redirect-map.csv (${planned.status}; ${planned.notes})`,
      perf,
    };
  }

  if (context.slugRedirects.has(urlInfo.slug)) {
    return {
      category: 'known_slug_redirect_candidate',
      recommended_action: 'verify_or_add_exact_301_to_canonical_target',
      proposed_target: new URL(context.slugRedirects.get(urlInfo.slug), BASE_URL).href,
      evidence: 'Slug exists in inc/url-redirects.php generated redirect map.',
      perf,
    };
  }

  if (urlInfo.path.startsWith('/articles/')) {
    const target = `/${urlInfo.path.replace(/^\/articles\//, '')}`;
    return {
      category: 'articles_prefix_candidate',
      recommended_action: 'verify_target_then_301_articles_prefix_to_root',
      proposed_target: new URL(target, BASE_URL).href,
      evidence: 'Theme has an /articles/{slug}/ to /{slug}/ migration pattern.',
      perf,
    };
  }

  if (looksLikeOldCasePath(urlInfo)) {
    return {
      category: 'old_case_or_numeric_url',
      recommended_action: 'inspect_old_inventory_before_redirect_or_rebuild',
      proposed_target: '',
      evidence: 'Looks like an old case-law or numeric URL. Do not blind-redirect.',
      perf,
    };
  }

  if (perf.clicks > 0 || perf.impressions > 20) {
    return {
      category: 'search_visible_unknown',
      recommended_action: 'investigate_content_match_or_rebuild_before_redirect',
      proposed_target: '',
      evidence: `Has historical GSC visibility: ${perf.clicks} clicks / ${perf.impressions} impressions.`,
      perf,
    };
  }

  return {
    category: 'unknown_low_evidence',
    recommended_action: 'leave_404_until_gsc_clicks_backlinks_or_internal_links_show_value',
    proposed_target: '',
    evidence: 'No local redirect match and no local GSC value found.',
    perf,
  };
}

async function main() {
  const input = fs.readFileSync(inputPath, 'utf8');
  const inputRows = parseCsv(input);
  const slugRedirects = loadPhpSlugRedirects();
  const planned = loadPlannedRedirects();
  const performance = loadPerformanceMaps();

  const normalizedRows = inputRows
    .map((row) => ({ row, urlInfo: normalizeUrl(detectUrlValue(row)) }))
    .filter((item) => item.urlInfo);

  const outputRows = [];

  for (const item of normalizedRows) {
    const decision = classify(item.urlInfo, { slugRedirects, planned, performance });
    const live = liveCheck ? await checkUrl(item.urlInfo.href) : { status: '', location: '' };
    const targetLive = liveCheck && decision.proposed_target ? await checkUrl(decision.proposed_target) : { status: '', location: '' };

    outputRows.push({
      input_url: item.urlInfo.raw,
      normalized_url: item.urlInfo.href,
      path: item.urlInfo.path,
      slug: item.urlInfo.slug,
      live_status: live.status,
      live_location: live.location,
      clicks: decision.perf.clicks,
      impressions: decision.perf.impressions,
      category: decision.category,
      recommended_action: decision.recommended_action,
      proposed_target: decision.proposed_target,
      target_status: targetLive.status,
      target_location: targetLive.location,
      evidence: decision.evidence,
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const columns = [
    'input_url',
    'normalized_url',
    'path',
    'slug',
    'live_status',
    'live_location',
    'clicks',
    'impressions',
    'category',
    'recommended_action',
    'proposed_target',
    'target_status',
    'target_location',
    'evidence',
  ];
  fs.writeFileSync(outputPath, toCsv(outputRows, columns));

  const counts = outputRows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`Wrote ${outputRows.length} triage rows to ${outputPath}`);
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
