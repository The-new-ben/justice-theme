#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const SITE = 'https://jus-tice.co.il';
const VERSION = '1.0.0';
const USER_AGENT = `Justice-GSC-Content-Architecture-Audit/${VERSION} (read-only)`;
const TYPES = [
  ['post', 'posts'],
  ['page', 'pages'],
  ['articles', 'articles'],
  ['justice_term', 'justice_term'],
];
const FUNCTIONAL_OR_ALWAYS_PROTECTED_SLUGS = new Set([
  '', 'cart', 'checkout', 'my-account', 'shop', 'legal-help', 'legal-tools', 'legal-calculators',
  'legal-documents', 'ask-a-lawyer', 'lawyer-plans', 'lawyer-dashboard', 'contact', 'privacy-policy',
]);

function parseArgs(argv) {
  const output = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const equal = token.indexOf('=');
    const key = token.slice(2, equal === -1 ? undefined : equal).replace(/-([a-z])/g, (_, value) => value.toUpperCase());
    if (equal !== -1) output[key] = token.slice(equal + 1);
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) output[key] = argv[++index];
    else output[key] = true;
  }
  return output;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted && character === '"' && line[index + 1] === '"') { current += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { values.push(current); current = ''; }
    else current += character;
  }
  values.push(current.replace(/\r$/, ''));
  return values;
}

function parseCsv(text) {
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(header.map((column, index) => [column, values[index] ?? '']));
  });
}

function csvEscape(value) {
  if (value === undefined || value === null) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function writeCsv(file, rows, fallbackColumns = []) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const columns = rows.length ? Object.keys(rows[0]) : fallbackColumns;
  const stream = fs.createWriteStream(file, { encoding: 'utf8' });
  stream.write(`\uFEFF${columns.join(',')}\r\n`);
  for (const row of rows) stream.write(`${columns.map((column) => csvEscape(row[column])).join(',')}\r\n`);
  await new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(resolve);
  });
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value, SITE);
    url.hash = '';
    url.search = '';
    url.protocol = 'https:';
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/%[0-9a-f]{2}/gi, (item) => item.toUpperCase());
    if (!url.pathname.endsWith('/') && !/\.[a-z0-9]{2,6}$/i.test(url.pathname)) url.pathname += '/';
    return url.href;
  } catch {
    return String(value || '').trim();
  }
}

function slugFromUrl(value) {
  try {
    return decodeURIComponent(new URL(value).pathname.split('/').filter(Boolean).pop() || '').toLowerCase();
  } catch {
    return '';
  }
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}

function stripHtml(value) {
  return decodeEntities(String(value || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

const STOP_WORDS = new Set([
  'של', 'על', 'עם', 'את', 'אל', 'או', 'גם', 'כל', 'מה', 'איך', 'זה', 'זו', 'הוא', 'היא', 'יש', 'אין',
  'לא', 'כן', 'אם', 'כי', 'אשר', 'יותר', 'בין', 'אחרי', 'לפני', 'לפי', 'כדי', 'יכול', 'יכולה', 'ניתן',
  'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'are', 'was', 'were', 'you', 'your', 'our',
]);

function tokenSet(value) {
  return new Set((String(value || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token)));
}

function similarity(left, right) {
  const a = left instanceof Set ? left : tokenSet(left);
  const b = right instanceof Set ? right : tokenSet(right);
  if (!a.size || !b.size) return { intersection: 0, jaccard: 0, containment: 0, leftUnique: 1, rightUnique: 1 };
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return {
    intersection,
    jaccard: intersection / new Set([...a, ...b]).size,
    containment: intersection / Math.min(a.size, b.size),
    leftUnique: 1 - (intersection / a.size),
    rightUnique: 1 - (intersection / b.size),
  };
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: 'application/json', 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(30000) });
      if (response.ok) return response;
      if (response.status !== 429 && response.status < 500) throw new Error(`HTTP ${response.status}`);
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (2 ** attempt)));
  }
  throw new Error(`${url}: ${lastError?.message || 'request failed'}`);
}

async function fetchType(type, restBase) {
  const rows = [];
  let page = 1;
  for (;;) {
    const url = new URL(`${SITE}/wp-json/wp/v2/${restBase}`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('context', 'view');
    url.searchParams.set('_fields', 'id,type,slug,parent,status,link,date_gmt,modified_gmt,title,content,yoast_head_json');
    const response = await fetchWithRetry(url.href);
    const batch = await response.json();
    for (const item of batch) {
      const html = item.content?.rendered || '';
      const text = stripHtml(html);
      const title = stripHtml(item.title?.rendered || item.yoast_head_json?.title || '');
      const tokens = tokenSet(text);
      rows.push({
        url: normalizeUrl(item.link),
        post_id: item.id,
        content_type: item.type || type,
        slug: item.slug || '',
        parent: item.parent || 0,
        title,
        published_date: item.date_gmt || '',
        modified_date: item.modified_gmt || '',
        body_text: text,
        body_tokens: tokens,
        word_count: (text.match(/[\p{L}\p{N}]+/gu) || []).length,
        unique_token_count: tokens.size,
        content_sha256: sha256(text.toLowerCase().replace(/\s+/g, ' ').trim()),
        h2_count: [...html.matchAll(/<h2\b/gi)].length,
        h3_count: [...html.matchAll(/<h3\b/gi)].length,
        cta_signal: /(justice_submit_lead|lead-form|ask-lawyer|wa\.me|tel:)/i.test(html) ? 'TRUE' : 'FALSE',
      });
    }
    const totalPages = number(response.headers.get('x-wp-totalpages')) || 1;
    if (page >= totalPages || !batch.length) break;
    page += 1;
  }
  return rows;
}

function parseClusters(source) {
  const clusters = [];
  const expression = /'([a-z0-9-]+)'\s*=>\s*array\(\s*(?:\/\/[^\n]*\n\s*)*'pillar'\s*=>\s*'([^']+)'[\s\S]*?'spokes'\s*=>\s*array\(([\s\S]*?)\n\s*\),\s*\n\s*\),/g;
  for (const match of source.matchAll(expression)) {
    const withoutComments = match[3].replace(/\/\/[^\n]*/g, '');
    const spokes = [...withoutComments.matchAll(/'([^']+)'/g)].map((item) => item[1]);
    clusters.push({ key: match[1], pillar: match[2], spokes });
  }
  return clusters;
}

function ownerScore(row, content) {
  return (number(row.full_clicks) * 30)
    + (Math.log10(number(row.full_impressions) + 1) * 12)
    + (Math.log10(number(row.recent_90d_impressions) + 1) * 10)
    + (number(row.internal_inlinks) * 2)
    + (number(row.max_business_potential_score) * 0.4)
    + (Math.log10(number(content?.word_count) + 1) * 3)
    + (row.sitemap_presence === 'TRUE' ? 2 : 0)
    - (/-[2-9]$/.test(String(content?.slug || '')) ? 25 : 0);
}

function actionPriority(value) {
  return {
    DELETE_410_DIRECT_HIGH: 0,
    MERGE_CONTENT_THEN_410_HIGH: 1,
    MERGE_CONTENT_THEN_410_MEDIUM: 2,
    DELETE_410_LOW_VALUE_MEDIUM: 3,
  }[value] ?? 9;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.runDir || !path.isAbsolute(args.runDir)) throw new Error('--run-dir must be absolute');
  const analysisDir = path.join(args.runDir, 'analysis');
  const [pairs, migration, inventory, summary, clusterSource] = await Promise.all([
    fsp.readFile(path.join(analysisDir, 'justice-page-pair-overlap.csv'), 'utf8').then(parseCsv),
    fsp.readFile(path.join(analysisDir, 'justice-page-migration-inventory.csv'), 'utf8').then(parseCsv),
    fsp.readFile(path.join(analysisDir, 'page-inventory-source.csv'), 'utf8').then(parseCsv),
    fsp.readFile(path.join(analysisDir, 'justice-cannibalization-summary.csv'), 'utf8').then(parseCsv),
    fsp.readFile(path.resolve(__dirname, '../../inc/content-clusters.php'), 'utf8'),
  ]);

  process.stdout.write('Fetching the public WordPress content corpus...\n');
  const corpusRows = [];
  for (const [type, restBase] of TYPES) {
    process.stdout.write(`  ${type}...\n`);
    corpusRows.push(...await fetchType(type, restBase));
  }
  const corpus = new Map(corpusRows.map((row) => [normalizeUrl(row.url), row]));
  const migrationMap = new Map(migration.map((row) => [normalizeUrl(row.url), row]));
  const inventoryMap = new Map(inventory.map((row) => [normalizeUrl(row.url), row]));
  const clusters = parseClusters(clusterSource);
  const roleBySlug = new Map();
  for (const cluster of clusters) {
    roleBySlug.set(cluster.pillar, { cluster: cluster.key, role: 'PILLAR' });
    for (const spoke of cluster.spokes) roleBySlug.set(spoke, { cluster: cluster.key, role: 'SPOKE' });
  }

  const contentFingerprintRows = corpusRows.map((row) => {
    const mapped = roleBySlug.get(row.slug) || {};
    return {
      url: row.url,
      post_id: row.post_id,
      content_type: row.content_type,
      slug: row.slug,
      title: row.title,
      cluster_key: mapped.cluster || '',
      cluster_role: mapped.role || 'UNMAPPED',
      word_count: row.word_count,
      unique_token_count: row.unique_token_count,
      content_sha256: row.content_sha256,
      h2_count: row.h2_count,
      h3_count: row.h3_count,
      cta_signal: row.cta_signal,
      published_date: row.published_date,
      modified_date: row.modified_date,
    };
  }).sort((a, b) => a.url.localeCompare(b.url, 'en'));

  process.stdout.write(`Enriching ${pairs.length} GSC-overlap page pairs with content evidence...\n`);
  const enrichedPairs = [];
  const globalDuplicateRows = [];
  const candidates = new Map();
  for (const pair of pairs) {
    const aUrl = normalizeUrl(pair.page_a);
    const bUrl = normalizeUrl(pair.page_b);
    const a = corpus.get(aUrl);
    const b = corpus.get(bUrl);
    const aMetrics = migrationMap.get(aUrl) || {};
    const bMetrics = migrationMap.get(bUrl) || {};
    const aRole = roleBySlug.get(slugFromUrl(aUrl)) || {};
    const bRole = roleBySlug.get(slugFromUrl(bUrl)) || {};
    const content = a && b ? similarity(a.body_tokens, b.body_tokens) : { intersection: 0, jaccard: 0, containment: 0, leftUnique: 1, rightUnique: 1 };
    const titles = similarity(a?.title || pair.page_a_title, b?.title || pair.page_b_title);
    const exactDuplicate = Boolean(a && b && a.content_sha256 === b.content_sha256 && a.word_count > 20);
    const aScore = ownerScore(aMetrics, a);
    const bScore = ownerScore(bMetrics, b);
    const ownerUrl = aScore >= bScore ? aUrl : bUrl;
    const loserUrl = ownerUrl === aUrl ? bUrl : aUrl;
    const loserMetrics = ownerUrl === aUrl ? bMetrics : aMetrics;
    const loserContent = ownerUrl === aUrl ? b : a;
    const loserUnique = ownerUrl === aUrl ? content.rightUnique : content.leftUnique;
    const sameCluster = aRole.cluster && aRole.cluster === bRole.cluster;
    let decision = 'DIFFERENTIATE_OR_REBALANCE';
    let confidence = 'LOW';
    if (exactDuplicate && number(loserMetrics.full_clicks) === 0 && number(loserMetrics.internal_inlinks) === 0) {
      decision = 'DELETE_410_DIRECT_HIGH'; confidence = 'HIGH';
    } else if (content.containment >= 0.88 && content.jaccard >= 0.70) {
      decision = 'MERGE_CONTENT_THEN_410_HIGH'; confidence = 'HIGH';
    } else if ((sameCluster || titles.jaccard >= 0.45) && content.containment >= 0.70 && content.jaccard >= 0.45 && number(pair.shared_impressions) >= 25) {
      decision = 'MERGE_CONTENT_THEN_410_MEDIUM'; confidence = 'MEDIUM';
    }
    enrichedPairs.push({
      ...pair,
      page_a_cluster: aRole.cluster || '',
      page_a_role: aRole.role || 'UNMAPPED',
      page_b_cluster: bRole.cluster || '',
      page_b_role: bRole.role || 'UNMAPPED',
      same_cluster: sameCluster ? 'TRUE' : 'FALSE',
      page_a_words: a?.word_count || '',
      page_b_words: b?.word_count || '',
      title_token_jaccard: titles.jaccard,
      content_token_jaccard: content.jaccard,
      content_token_containment: content.containment,
      page_a_unique_token_share: content.leftUnique,
      page_b_unique_token_share: content.rightUnique,
      exact_content_hash_match: exactDuplicate ? 'TRUE' : 'FALSE',
      recommended_owner_url: ownerUrl,
      recommended_loser_url: loserUrl,
      owner_score: Math.max(aScore, bScore),
      loser_score: Math.min(aScore, bScore),
      pair_action: decision,
      pair_action_confidence: confidence,
    });
    if (decision.includes('410')) {
      if (FUNCTIONAL_OR_ALWAYS_PROTECTED_SLUGS.has(slugFromUrl(loserUrl))) continue;
      const row = {
        url: loserUrl,
        title: loserContent?.title || inventoryMap.get(loserUrl)?.title || '',
        content_type: loserContent?.content_type || inventoryMap.get(loserUrl)?.content_type || loserMetrics.content_type || '',
        recommendation: decision,
        confidence,
        owner_url: ownerUrl,
        reason: exactDuplicate
          ? 'תוכן זהה לפי hash; לעמוד החלש אין קליקים ואין קישורים פנימיים מדווחים.'
          : `חפיפת תוכן גבוהה: containment ${(content.containment * 100).toFixed(1)}%, Jaccard ${(content.jaccard * 100).toFixed(1)}%.`,
        full_clicks: number(loserMetrics.full_clicks),
        full_impressions: number(loserMetrics.full_impressions),
        recent_90d_clicks: number(loserMetrics.recent_90d_clicks),
        recent_90d_impressions: number(loserMetrics.recent_90d_impressions),
        internal_inlinks: number(loserMetrics.internal_inlinks),
        sitemap_presence: loserMetrics.sitemap_presence || '',
        word_count: loserContent?.word_count || '',
        unique_content_share: loserUnique,
        shared_query_count: number(pair.shared_query_count),
        shared_impressions: number(pair.shared_impressions),
        max_business_potential_score: number(loserMetrics.max_business_potential_score),
        mandatory_before_410: 'גיבוי; אימות שאין המרות או קישורים חיצוניים מהותיים; העברת מידע ייחודי; הסרה מ-sitemap; החלפת כל קישור פנימי; אימות 410 אמיתי.',
        expected_effect: 'ה-URL יוסר לאחר crawl; אין הבטחה לעליית דירוג. מודדים את עמוד הבעלים אחרי 28, 56 ו-90 יום.',
        manual_approval_required: 'TRUE',
      };
      const existing = candidates.get(loserUrl);
      if (!existing || actionPriority(row.recommendation) < actionPriority(existing.recommendation) || row.shared_impressions > existing.shared_impressions) candidates.set(loserUrl, row);
    }
  }

  process.stdout.write('Scanning the full corpus for near-duplicate templates beyond GSC query overlap...\n');
  for (let left = 0; left < corpusRows.length; left += 1) {
    const a = corpusRows[left];
    if (a.word_count < 20) continue;
    for (let right = left + 1; right < corpusRows.length; right += 1) {
      const b = corpusRows[right];
      if (b.word_count < 20) continue;
      const lengthRatio = Math.min(a.word_count, b.word_count) / Math.max(a.word_count, b.word_count);
      if (lengthRatio < 0.65) continue;
      const titles = similarity(a.title, b.title);
      const slugPrefixMatch = a.slug.split('-').slice(0, 3).join('-') === b.slug.split('-').slice(0, 3).join('-');
      if (titles.jaccard < 0.15 && !slugPrefixMatch && a.content_sha256 !== b.content_sha256) continue;
      const content = similarity(a.body_tokens, b.body_tokens);
      const exactDuplicate = a.content_sha256 === b.content_sha256;
      if (!exactDuplicate && !(content.jaccard >= 0.72 && content.containment >= 0.86)) continue;
      const aMetrics = migrationMap.get(a.url) || {};
      const bMetrics = migrationMap.get(b.url) || {};
      const aScore = ownerScore(aMetrics, a);
      const bScore = ownerScore(bMetrics, b);
      const owner = aScore >= bScore ? a : b;
      const loser = owner === a ? b : a;
      const loserMetrics = owner === a ? bMetrics : aMetrics;
      const loserUnique = owner === a ? content.rightUnique : content.leftUnique;
      const loserMapped = roleBySlug.get(loser.slug) || {};
      const protectedFunctional = FUNCTIONAL_OR_ALWAYS_PROTECTED_SLUGS.has(loser.slug);
      const action = exactDuplicate && number(loserMetrics.full_clicks) === 0 && number(loserMetrics.internal_inlinks) === 0
        ? 'DELETE_410_DIRECT_HIGH'
        : 'MERGE_CONTENT_THEN_410_HIGH';
      globalDuplicateRows.push({
        owner_url: owner.url,
        loser_url: loser.url,
        owner_title: owner.title,
        loser_title: loser.title,
        exact_content_hash_match: exactDuplicate ? 'TRUE' : 'FALSE',
        title_token_jaccard: titles.jaccard,
        content_token_jaccard: content.jaccard,
        content_token_containment: content.containment,
        loser_unique_token_share: loserUnique,
        owner_words: owner.word_count,
        loser_words: loser.word_count,
        owner_score: Math.max(aScore, bScore),
        loser_score: Math.min(aScore, bScore),
        loser_cluster: loserMapped.cluster || '',
        loser_role: loserMapped.role || 'UNMAPPED',
        recommendation: protectedFunctional ? 'PROTECT_FUNCTIONAL_REVIEW' : action,
      });
      if (protectedFunctional) continue;
      const row = {
        url: loser.url,
        title: loser.title,
        content_type: loser.content_type,
        recommendation: action,
        confidence: 'HIGH',
        owner_url: owner.url,
        reason: exactDuplicate
          ? 'גוף תוכן זהה לפי hash בכל הקורפוס.'
          : `תבנית כמעט זהה בכל הקורפוס: containment ${(content.containment * 100).toFixed(1)}%, Jaccard ${(content.jaccard * 100).toFixed(1)}%.`,
        full_clicks: number(loserMetrics.full_clicks),
        full_impressions: number(loserMetrics.full_impressions),
        recent_90d_clicks: number(loserMetrics.recent_90d_clicks),
        recent_90d_impressions: number(loserMetrics.recent_90d_impressions),
        internal_inlinks: number(loserMetrics.internal_inlinks),
        sitemap_presence: loserMetrics.sitemap_presence || '',
        word_count: loser.word_count,
        unique_content_share: loserUnique,
        shared_query_count: 0,
        shared_impressions: 0,
        max_business_potential_score: number(loserMetrics.max_business_potential_score),
        mandatory_before_410: 'גיבוי; אימות המרות וקישורים חיצוניים; העברת מידע ייחודי; הסרה מ-sitemap; החלפת כל קישור פנימי; אימות 410 אמיתי.',
        expected_effect: 'הסרת כפילות תבניתית; אין הבטחה לעליית דירוג. מודדים את עמוד הבעלים אחרי 28, 56 ו-90 יום.',
        manual_approval_required: 'TRUE',
      };
      const existing = candidates.get(loser.url);
      if (!existing || actionPriority(row.recommendation) < actionPriority(existing.recommendation)) candidates.set(loser.url, row);
    }
  }

  for (const row of migration) {
    const url = normalizeUrl(row.url);
    if (candidates.has(url)) continue;
    const content = corpus.get(url);
    const role = roleBySlug.get(slugFromUrl(url));
    const isLowValue = content
      && !role
      && !FUNCTIONAL_OR_ALWAYS_PROTECTED_SLUGS.has(content.slug)
      && content.word_count > 0
      && number(row.full_clicks) === 0
      && number(row.full_impressions) < 10
      && number(row.internal_inlinks) === 0
      && number(row.max_business_potential_score) < 50
      && content.word_count < 180;
    if (!isLowValue) continue;
    candidates.set(url, {
      url,
      title: content.title,
      content_type: content.content_type,
      recommendation: 'DELETE_410_LOW_VALUE_MEDIUM',
      confidence: 'MEDIUM',
      owner_url: '',
      reason: `עמוד לא ממופה, ${content.word_count} מילים, ללא קליקים, פחות מ-10 חשיפות וללא קישורים פנימיים מדווחים.`,
      full_clicks: number(row.full_clicks),
      full_impressions: number(row.full_impressions),
      recent_90d_clicks: number(row.recent_90d_clicks),
      recent_90d_impressions: number(row.recent_90d_impressions),
      internal_inlinks: number(row.internal_inlinks),
      sitemap_presence: row.sitemap_presence || '',
      word_count: content.word_count,
      unique_content_share: '',
      shared_query_count: 0,
      shared_impressions: 0,
      max_business_potential_score: number(row.max_business_potential_score),
      mandatory_before_410: 'בדיקת המרות ולידים; קישורים חיצוניים; אינטנט עצמאי; גיבוי; הסרה מ-sitemap; החלפת כל קישור פנימי; אימות 410 אמיתי.',
      expected_effect: 'הסרת עמוד דל וחסר תפקיד; אין הבטחה לשיפור דירוג.',
      manual_approval_required: 'TRUE',
    });
  }

  const candidateRows = [...candidates.values()].sort((a, b) => actionPriority(a.recommendation) - actionPriority(b.recommendation)
    || b.shared_impressions - a.shared_impressions || b.full_impressions - a.full_impressions || a.url.localeCompare(b.url, 'en'));

  const architectureRows = migration.map((row) => {
    const url = normalizeUrl(row.url);
    const slug = slugFromUrl(url);
    const mapped = roleBySlug.get(slug) || {};
    const content = corpus.get(url);
    const candidate = candidates.get(url);
    let action = candidate?.recommendation || '';
    if (!action && mapped.role === 'PILLAR') action = 'KEEP_STRENGTHEN_PILLAR';
    else if (!action && mapped.role === 'SPOKE') action = 'KEEP_CLARIFY_SPOKE_INTENT';
    else if (!action && number(row.max_business_potential_score) >= 65) action = 'MAP_OR_STRENGTHEN_HIGH_BUSINESS_PAGE';
    else if (!action && number(row.internal_inlinks) === 0 && row.sitemap_presence === 'TRUE') action = 'ORPHAN_REVIEW';
    else if (!action) action = 'MONITOR_OR_MAP';
    return {
      url,
      slug,
      title: content?.title || row.title || '',
      content_type: content?.content_type || row.content_type || '',
      cluster_key: mapped.cluster || '',
      cluster_role: mapped.role || 'UNMAPPED',
      full_clicks: number(row.full_clicks),
      full_impressions: number(row.full_impressions),
      recent_90d_clicks: number(row.recent_90d_clicks),
      recent_90d_impressions: number(row.recent_90d_impressions),
      internal_inlinks: number(row.internal_inlinks),
      word_count: content?.word_count || row.word_count || '',
      cta_signal: content?.cta_signal || '',
      max_business_potential_score: number(row.max_business_potential_score),
      sitemap_presence: row.sitemap_presence || '',
      architecture_action: action,
    };
  }).sort((a, b) => (a.cluster_key || 'zz').localeCompare(b.cluster_key || 'zz') || (a.cluster_role === 'PILLAR' ? -1 : 1) || b.recent_90d_impressions - a.recent_90d_impressions);

  const clusterRows = clusters.map((cluster) => {
    const slugs = [cluster.pillar, ...cluster.spokes];
    const pages = architectureRows.filter((row) => slugs.includes(row.slug));
    const pillar = pages.find((row) => row.slug === cluster.pillar);
    const groupCount = summary.filter((row) => {
      const urls = [row.strongest_url, row.secondary_url, ...(row.weaker_urls || '').split('|')].filter(Boolean);
      return urls.filter((url) => slugs.includes(slugFromUrl(url))).length >= 2;
    }).length;
    return {
      cluster_key: cluster.key,
      pillar_slug: cluster.pillar,
      pillar_url: pillar?.url || `${SITE}/${cluster.pillar}/`,
      pillar_found: pillar ? 'TRUE' : 'FALSE',
      pillar_recent_90d_impressions: pillar?.recent_90d_impressions || 0,
      pillar_recent_90d_clicks: pillar?.recent_90d_clicks || 0,
      pillar_internal_inlinks: pillar?.internal_inlinks || 0,
      mapped_spokes: cluster.spokes.length,
      present_spokes: pages.filter((row) => row.cluster_role === 'SPOKE').length,
      missing_spokes: cluster.spokes.filter((slug) => !pages.some((row) => row.slug === slug)).join('|'),
      cluster_recent_90d_impressions: pages.reduce((sum, row) => sum + row.recent_90d_impressions, 0),
      cluster_recent_90d_clicks: pages.reduce((sum, row) => sum + row.recent_90d_clicks, 0),
      within_cluster_multi_url_query_groups: groupCount,
      high_business_pages: pages.filter((row) => row.max_business_potential_score >= 65).length,
      orphan_pages: pages.filter((row) => row.internal_inlinks === 0).length,
    };
  }).sort((a, b) => b.cluster_recent_90d_impressions - a.cluster_recent_90d_impressions);

  const outputs = {
    fingerprints: path.join(analysisDir, 'justice-content-fingerprints.csv'),
    pairs: path.join(analysisDir, 'justice-page-pair-content-enriched.csv'),
    globalDuplicates: path.join(analysisDir, 'justice-global-near-duplicate-content.csv'),
    candidates: path.join(analysisDir, 'justice-410-candidates.csv'),
    architecture: path.join(analysisDir, 'justice-architecture-page-decisions.csv'),
    clusters: path.join(analysisDir, 'justice-pillar-spoke-cluster-summary.csv'),
    summary: path.join(analysisDir, 'justice-content-architecture-summary.json'),
  };
  await writeCsv(outputs.fingerprints, contentFingerprintRows);
  await writeCsv(outputs.pairs, enrichedPairs);
  await writeCsv(outputs.globalDuplicates, globalDuplicateRows);
  await writeCsv(outputs.candidates, candidateRows);
  await writeCsv(outputs.architecture, architectureRows);
  await writeCsv(outputs.clusters, clusterRows);
  const result = {
    script: 'gsc-justice-content-architecture-audit.js',
    version: VERSION,
    generated_at: new Date().toISOString(),
    mode: 'READ_ONLY',
    property: `${SITE}/`,
    corpus_pages: corpusRows.length,
    gsc_overlap_pairs_enriched: enrichedPairs.length,
    global_near_duplicate_pairs: globalDuplicateRows.length,
    clusters: clusters.length,
    mapped_pillars: roleBySlug.size - clusters.reduce((sum, cluster) => sum + cluster.spokes.length, 0),
    mapped_spokes: clusters.reduce((sum, cluster) => sum + cluster.spokes.length, 0),
    candidates_410: candidateRows.length,
    candidates_by_action: Object.fromEntries([...new Set(candidateRows.map((row) => row.recommendation))].map((action) => [action, candidateRows.filter((row) => row.recommendation === action).length])),
    caveats: [
      'Content similarity is token-based triage evidence, not a semantic or legal-equivalence proof.',
      'Business potential is a proxy based on search intent and GSC evidence, not revenue or profit.',
      'Every 410 candidate requires conversion, backlink, unique-information and live-status checks before execution.',
      'No WordPress, Search Console, sitemap, canonical, redirect or server setting was changed.',
    ],
    outputs,
  };
  await fsp.writeFile(outputs.summary, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.stack || error.message}\n`);
  process.exitCode = 1;
});
