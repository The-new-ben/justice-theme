import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const INPUTS = {
  migration: 'project-control/url-migration-map.csv',
  siteHealth: 'reports/site-health-audit-2026-05-18.csv',
  gsc: 'content-master/gsc/gsc-url-summary.csv',
  gaps: 'content-master/content-gap-map.csv',
};
const OUT_CSV = 'project-control/content-triage-2026-05-18.csv';
const OUT_MD = 'project-control/content-triage-2026-05-18.md';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (char !== '\r') {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [rawHeader = [], ...data] = rows.filter((candidate) => candidate.some((value) => value !== ''));
  const header = rawHeader.map((key) => key.replace(/^\uFEFF/, ''));
  return data.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ''])));
}

async function readCsv(path) {
  return parseCsv(await readFile(resolve(ROOT, path), 'utf8'));
}

function numberValue(value) {
  const normalized = String(value ?? '').replace(/[%",]/g, '').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeUrl(value) {
  if (!value) return '';

  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    return url.pathname === '/' ? url.origin : url.href.replace(/\/$/, '');
  } catch {
    return String(value).trim();
  }
}

function actionFor(row, gscRow) {
  const title = row.title || '';
  const cluster = row.topic_cluster || '';
  const status = row.status || '';
  const directGscMatch = Boolean(gscRow?.current_url);
  const clicks = directGscMatch ? numberValue(gscRow.gsc_clicks_export) : 0;
  const impressions = directGscMatch ? numberValue(gscRow.gsc_impressions_export) : 0;
  const liveStatus = row.live_status || '';
  const lower = `${title} ${cluster} ${status} ${row.old_slug || ''} ${row.new_slug || ''}`.toLowerCase();
  const reasons = [];

  if (/corona|covid|קורונה|נגיף הקורונה|שעת חירום|2020/.test(lower)) {
    reasons.push('outdated_corona_or_2020_context');
  }
  if (/outdated-corona-legacy/.test(cluster)) {
    reasons.push('explicit_outdated_corona_cluster');
  }
  if (/recommended|top|best|מומלץ|מומלצ|תותח|ייעוץ חינם|מובילים|מעל 20/.test(lower)) {
    reasons.push('trust_claim_review');
  }
  if (/TARGET_SLUG_CONFLICT|duplicate_target_slug/i.test(`${status} ${row.notes || ''}`)) {
    reasons.push('duplicate_or_target_slug_conflict');
  }
  if (/NEEDS_ENGLISH_SLUG_REVIEW|NEEDS_EDITORIAL_SLUG_MAPPING/i.test(`${status} ${row.notes || ''}`)) {
    reasons.push('slug_or_editorial_mapping_needed');
  }
  if (liveStatus && liveStatus !== '200') {
    reasons.push(`live_http_${liveStatus}`);
  }
  if (directGscMatch && gscRow?.recommended_action && gscRow.recommended_action !== 'UNKNOWN') {
    reasons.push(`gsc_${gscRow.recommended_action.toLowerCase()}`);
  }

  const protectedByGsc = directGscMatch && (clicks >= 3 || impressions >= 100);
  const highTraffic = directGscMatch && (clicks >= 10 || impressions >= 1000 || /HIGH|DO_NOT_TOUCH/i.test(gscRow?.traffic_risk || ''));
  let recommendation = 'HOLD';

  if (reasons.some((reason) => reason.startsWith('live_http_'))) {
    recommendation = 'FIX_TECHNICAL_FIRST';
  } else if (highTraffic) {
    recommendation = 'PROTECT_AND_REWRITE_OR_MERGE';
  } else if (protectedByGsc) {
    recommendation = 'REVIEW_BEFORE_NOINDEX_OR_MERGE';
  } else if (reasons.includes('explicit_outdated_corona_cluster') || reasons.includes('outdated_corona_or_2020_context')) {
    recommendation = 'NOINDEX_OR_MERGE_CANDIDATE_AFTER_OWNER_APPROVAL';
  } else if (reasons.includes('trust_claim_review')) {
    recommendation = 'REWRITE_TRUST_CLAIMS';
  } else if (reasons.includes('duplicate_or_target_slug_conflict')) {
    recommendation = 'MERGE_MAPPING_REVIEW';
  }

  return {
    reasons,
    recommendation,
    protectedByGsc,
    directGscMatch,
    clicks,
    impressions,
  };
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function firstN(rows, n) {
  return rows.slice(0, n);
}

const [migrationRows, siteRows, gscRows, gapRows] = await Promise.all([
  readCsv(INPUTS.migration),
  readCsv(INPUTS.siteHealth),
  readCsv(INPUTS.gsc),
  readCsv(INPUTS.gaps),
]);

const liveByUrl = new Map(siteRows.map((row) => [normalizeUrl(row.url), row]));
const gscByUrl = new Map(gscRows.map((row) => [normalizeUrl(row.current_url), row]));
const candidates = [];
const candidateUrls = new Set();

for (const row of migrationRows) {
  if (!['articles', 'post', 'page'].includes(row.post_type)) continue;

  const candidateUrl = normalizeUrl(row.new_url || row.old_url);
  const live = liveByUrl.get(candidateUrl) || liveByUrl.get(normalizeUrl(row.old_url)) || {};
  const gsc = gscByUrl.get(candidateUrl) || gscByUrl.get(normalizeUrl(row.old_url)) || {};
  const enriched = {
    ...row,
    candidate_url: candidateUrl,
    live_status: live.httpStatus || '',
    live_final_url: normalizeUrl(live.finalUrl || ''),
    gsc_top_queries: gsc.top_queries || '',
    gsc_risk: gsc.traffic_risk || row.traffic_risk || '',
  };
  const action = actionFor(enriched, gsc);

  if (action.reasons.length === 0) continue;

  candidates.push({
    recommendation: action.recommendation,
    priority: action.recommendation.includes('PROTECT') ? 'P0' : action.protectedByGsc ? 'P1' : 'P2',
    cluster: row.topic_cluster || gsc.primary_cluster || 'UNKNOWN',
    title: row.title || '',
    candidate_url: candidateUrl,
    old_url: row.old_url || '',
    new_url: row.new_url || '',
    post_id: row.post_id || '',
    post_type: row.post_type || '',
    live_status: enriched.live_status || '',
    clicks: action.clicks,
    impressions: action.impressions,
    reasons: action.reasons.join('|'),
    gsc_risk: enriched.gsc_risk,
    gsc_matched: action.directGscMatch ? 'YES' : 'NO',
    gsc_top_queries: enriched.gsc_top_queries,
    status: row.status || '',
    safety_gate: action.protectedByGsc
      ? 'OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT'
      : 'OWNER_APPROVAL_REQUIRED_BEFORE_PUBLIC_CHANGE',
  });
  candidateUrls.add(candidateUrl);
}

for (const row of gscRows) {
  const candidateUrl = normalizeUrl(row.current_url);
  if (!candidateUrl || candidateUrls.has(candidateUrl)) continue;

  const clicks = numberValue(row.gsc_clicks_export);
  const impressions = numberValue(row.gsc_impressions_export);
  const protectedByGsc = clicks >= 3 || impressions >= 100;
  const highTraffic = clicks >= 10 || impressions >= 1000 || /HIGH|DO_NOT_TOUCH/i.test(row.traffic_risk || '');
  const hasAction = row.recommended_action && row.recommended_action !== 'UNKNOWN';
  if (!protectedByGsc && !hasAction) continue;

  const live = liveByUrl.get(candidateUrl) || {};
  const recommendation = highTraffic ? 'PROTECT_AND_REWRITE_OR_MERGE' : 'REVIEW_BEFORE_NOINDEX_OR_MERGE';
  const reasons = [
    highTraffic ? 'direct_gsc_high_value_url' : 'direct_gsc_visible_url',
    hasAction ? `gsc_${row.recommended_action.toLowerCase()}` : '',
  ].filter(Boolean);

  candidates.push({
    recommendation,
    priority: highTraffic ? 'P0' : 'P1',
    cluster: row.primary_cluster || 'GSC_DIRECT',
    title: live.title || row.top_queries || candidateUrl,
    candidate_url: candidateUrl,
    old_url: '',
    new_url: candidateUrl,
    post_id: live.id || '',
    post_type: live.type || 'gsc-url',
    live_status: live.httpStatus || '',
    clicks,
    impressions,
    reasons: reasons.join('|'),
    gsc_risk: row.traffic_risk || '',
    gsc_matched: 'YES',
    gsc_top_queries: row.top_queries || '',
    status: row.recommended_action || '',
    safety_gate: 'OWNER_GSC_REVIEW_REQUIRED_BEFORE_NOINDEX_DELETE_REDIRECT',
  });
  candidateUrls.add(candidateUrl);
}

candidates.sort((a, b) => {
  const priorityOrder = { P0: 0, P1: 1, P2: 2 };
  return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
    || b.impressions - a.impressions
    || b.clicks - a.clicks
    || a.cluster.localeCompare(b.cluster);
});

const headers = [
  'priority',
  'recommendation',
  'cluster',
  'title',
  'candidate_url',
  'post_id',
  'post_type',
  'live_status',
  'clicks',
  'impressions',
  'reasons',
  'gsc_risk',
  'gsc_matched',
  'gsc_top_queries',
  'status',
  'safety_gate',
];
const csv = [
  headers.join(','),
  ...candidates.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
].join('\n') + '\n';

const counts = candidates.reduce((acc, row) => {
  acc.total += 1;
  acc.byRecommendation[row.recommendation] = (acc.byRecommendation[row.recommendation] || 0) + 1;
  acc.byCluster[row.cluster] = (acc.byCluster[row.cluster] || 0) + 1;
  return acc;
}, { total: 0, byRecommendation: {}, byCluster: {} });

const highValueGaps = gapRows
  .filter((row) => row.priority === 'HIGH' && row.business_value === 'HIGH' && row.seo_value === 'HIGH')
  .slice(0, 12);

const md = `# Content Triage - 2026-05-18

## Research Basis

- Google's core-update guidance says to assess dropped pages and improve or remove unhelpful content; deleting unhelpful content can help stronger content perform better.
- Google's helpful-content guidance emphasizes people-first content, clear purpose, and content that leaves users satisfied.
- Because this is legal/YMYL-style content, no noindex, deletion, redirect, canonical, title/H1, taxonomy or body change should happen without owner/legal/GSC review.

Sources:
- https://developers.google.com/search/docs/appearance/core-updates
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget

## Inputs Used

- \`${INPUTS.migration}\`
- \`${INPUTS.siteHealth}\`
- \`${INPUTS.gsc}\`
- \`${INPUTS.gaps}\`

## Output

- CSV: \`${OUT_CSV}\`

## Summary

- Total triage candidates: ${counts.total}
- P0 protect/rewrite/merge candidates: ${candidates.filter((row) => row.priority === 'P0').length}
- P1 review-before-noindex/merge candidates: ${candidates.filter((row) => row.priority === 'P1').length}
- P2 owner-approval candidates: ${candidates.filter((row) => row.priority === 'P2').length}

## Recommendation Counts

${Object.entries(counts.byRecommendation).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

## Cluster Counts

${Object.entries(counts.byCluster).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

## Highest-Priority Candidates

${firstN(candidates, 20).map((row, index) => `${index + 1}. ${row.priority} ${row.recommendation}: ${row.title}
   - URL: ${row.candidate_url || row.old_url}
   - Cluster: ${row.cluster}
   - Evidence: ${row.clicks} clicks, ${row.impressions} impressions, reasons: ${row.reasons}
   - Gate: ${row.safety_gate}`).join('\n')}

## High-Value Content Gaps To Connect After Cleanup

${highValueGaps.map((row, index) => `${index + 1}. ${row.cluster}: ${row.recommended_article_title_he} (\`${row.recommended_english_slug}\`)
   - Why: ${row.why_needed}`).join('\n')}

## Safe Next Actions

1. Review P0 and P1 rows first; do not noindex, delete, redirect, canonicalize or merge any URL with GSC evidence until owner/legal approval.
2. For outdated corona rows with no visible GSC protection, prepare a batch proposal: keep as historical archive, merge into a current practical guide, or noindex after approval.
3. For trust-claim rows such as "מומלץ", "מובילים", "ייעוץ חינם", rewrite claims into factual, source-safe language before public upload.
4. For medical-malpractice and family-law conflicts, map support pages to the recovered commercial hubs before adding new content.

## Safety

This cycle created analysis artifacts only. No public CMS/database row, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.
`;

await mkdir(dirname(resolve(ROOT, OUT_CSV)), { recursive: true });
await writeFile(resolve(ROOT, OUT_CSV), csv, 'utf8');
await writeFile(resolve(ROOT, OUT_MD), md, 'utf8');
console.log(`Wrote ${OUT_CSV}`);
console.log(`Wrote ${OUT_MD}`);
console.log(JSON.stringify({
  total: counts.total,
  p0: candidates.filter((row) => row.priority === 'P0').length,
  p1: candidates.filter((row) => row.priority === 'P1').length,
  p2: candidates.filter((row) => row.priority === 'P2').length,
}, null, 2));
