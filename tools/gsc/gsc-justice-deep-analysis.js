#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const readline = require('readline');

const SCRIPT_VERSION = '1.0.0';
const PROPERTY = 'https://jus-tice.co.il/';
const PARAMETERS = Object.freeze({
  lowEvidenceImpressions: 3,
  dominantImpressionShare: 0.90,
  meaningfulSecondaryShare: 0.20,
  technicalSecondaryShare: 0.10,
  stronglySplitSecondaryShare: 0.30,
  similarPositionGap: 5,
  similarMetadataJaccard: 0.60,
  strongMetadataJaccard: 0.80,
  meaningfulWeeklySwitches: 2,
  protectedImpressions: 100,
  p0Impressions: 200,
  p1Impressions: 100,
  p2Impressions: 25,
  pagePairCapPerQuery: 50,
});

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const equal = token.indexOf('=');
    const rawKey = token.slice(2, equal === -1 ? undefined : equal);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (equal !== -1) result[key] = token.slice(equal + 1);
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) result[key] = argv[++index];
    else result[key] = true;
  }
  return result;
}

function usage() {
  return [
    'Deep cannibalization analysis for jus-tice.co.il',
    '',
    'Required:',
    '  --run-dir=<absolute GSC run directory>',
  ].join('\n');
}

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let quoted = false;
  const text = String(line || '').replace(/^\uFEFF/, '').replace(/\r$/, '');
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { fields.push(field); field = ''; }
    else field += character;
  }
  fields.push(field);
  return fields;
}

function parseCsv(text) {
  const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(header.map((column, index) => [column, values[index] ?? '']));
  });
}

async function readCsv(file) {
  return parseCsv(await fsp.readFile(file, 'utf8'));
}

async function readJson(file) {
  return JSON.parse(await fsp.readFile(file, 'utf8'));
}

async function ensureDir(directory) {
  await fsp.mkdir(directory, { recursive: true });
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function writeCsv(file, columns, rows) {
  await ensureDir(path.dirname(file));
  const stream = fs.createWriteStream(file, { encoding: 'utf8' });
  stream.write(`\uFEFF${columns.join(',')}\r\n`);
  for (const row of rows) stream.write(`${columns.map((column) => csvEscape(row[column])).join(',')}\r\n`);
  await new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(() => resolve());
  });
}

async function writeJson(file, value) {
  await ensureDir(path.dirname(file));
  await fsp.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function sha256(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(file);
    input.on('error', reject);
    input.on('data', (chunk) => hash.update(chunk));
    input.on('end', () => resolve(hash.digest('hex')));
  });
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : 0;
}

function emptyMetric() {
  return { clicks: 0, impressions: 0, weightedPosition: 0 };
}

function addMetric(target, row) {
  target.clicks += number(row.clicks);
  target.impressions += number(row.impressions);
  target.weightedPosition += number(row.position) * number(row.impressions);
  return target;
}

function metricValue(metric) {
  const value = metric || emptyMetric();
  return {
    clicks: value.clicks,
    impressions: value.impressions,
    ctr: ratio(value.clicks, value.impressions),
    position: ratio(value.weightedPosition, value.impressions),
  };
}

function aggregateMetricsByNormalizedUrl(metricMap) {
  const normalized = new Map();
  for (const [url, metric] of metricMap.entries()) {
    const key = normalizeUrl(url, true);
    if (!normalized.has(key)) normalized.set(key, emptyMetric());
    const target = normalized.get(key);
    target.clicks += number(metric.clicks);
    target.impressions += number(metric.impressions);
    target.weightedPosition += number(metric.weightedPosition);
  }
  return normalized;
}

function aggregateRows(rows) {
  const metric = emptyMetric();
  for (const row of rows) addMetric(metric, row);
  return metricValue(metric);
}

function updateSimple(map, key, row) {
  if (!map.has(key)) map.set(key, emptyMetric());
  addMetric(map.get(key), row);
}

function updateNested(map, query, page, row) {
  if (!map.has(query)) map.set(query, new Map());
  const pages = map.get(query);
  if (!pages.has(page)) pages.set(page, emptyMetric());
  addMetric(pages.get(page), row);
}

function nestedRows(map, query) {
  return [...(map.get(query) || new Map()).entries()].map(([page, metric]) => ({ page, ...metricValue(metric) }));
}

function strongestComparator(left, right) {
  return number(right.clicks) - number(left.clicks)
    || number(right.impressions) - number(left.impressions)
    || number(left.position) - number(right.position)
    || number(right.ctr) - number(left.ctr)
    || String(left.page).localeCompare(String(right.page), 'en');
}

function normalizeUrl(raw, keepQuery = true) {
  try {
    const url = new URL(raw);
    url.hash = '';
    url.protocol = 'https:';
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/%[0-9a-f]{2}/gi, (escape) => escape.toUpperCase());
    if (!url.pathname.endsWith('/') && !/\.[a-z0-9]{2,6}$/i.test(url.pathname)) url.pathname += '/';
    if (!keepQuery) url.search = '';
    return url.href;
  } catch {
    return String(raw || '').trim();
  }
}

function technicalUrl(raw) {
  return normalizeUrl(raw, false);
}

function suffixPattern(rawUrl, slug = '') {
  let candidate = String(slug || '');
  try {
    if (!candidate) candidate = decodeURIComponent(new URL(rawUrl).pathname.split('/').filter(Boolean).pop() || '');
  } catch {
    // Keep supplied slug.
  }
  const match = candidate.match(/-(2|3|4)$/);
  return match ? `NUMERIC_SUFFIX_${match[1]}` : '';
}

const STOP_WORDS = new Set([
  'של', 'על', 'עם', 'את', 'אל', 'או', 'גם', 'כל', 'מה', 'איך', 'זה', 'זו', 'הוא', 'היא',
  'עורך', 'עורכי', 'דין', 'משפטי', 'משפטית', 'מדריך', 'האתר', 'justice',
  'the', 'and', 'for', 'with', 'from', 'in', 'of', 'to', 'a',
]);

function tokens(value) {
  return new Set((String(value || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token)));
}

function jaccard(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return ratio(intersection, new Set([...a, ...b]).size);
}

function metadataSimilarity(left, right) {
  return Math.max(
    jaccard(left.title, right.title),
    jaccard(left.h1, right.h1),
    jaccard(`${left.title} ${left.h1}`, `${right.title} ${right.h1}`),
  );
}

function dateShift(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function weekStart(date) {
  const value = new Date(`${date}T00:00:00Z`);
  const day = value.getUTCDay();
  value.setUTCDate(value.getUTCDate() - ((day + 6) % 7));
  return value.toISOString().slice(0, 10);
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

function updateWinnerSignal(signals, query, pages, periodKey) {
  if (!pages.length) return;
  const winner = [...pages].sort(strongestComparator)[0].page;
  if (!signals.has(query)) signals.set(query, {
    observationCount: 0,
    cooccurrenceCount: 0,
    winnerSwitches: 0,
    winners: new Set(),
    lastWinner: '',
    lastPeriod: '',
  });
  const signal = signals.get(query);
  signal.observationCount += 1;
  if (pages.length > 1) signal.cooccurrenceCount += 1;
  if (signal.lastWinner && signal.lastWinner !== winner) signal.winnerSwitches += 1;
  signal.winners.add(winner);
  signal.lastWinner = winner;
  signal.lastPeriod = periodKey;
}

function signalValue(signal) {
  if (!signal) return { observationCount: 0, cooccurrenceCount: 0, winnerSwitches: 0, winnerCount: 0 };
  return {
    observationCount: signal.observationCount,
    cooccurrenceCount: signal.cooccurrenceCount,
    winnerSwitches: signal.winnerSwitches,
    winnerCount: signal.winners.size,
  };
}

function classifyPracticeArea(query) {
  const value = String(query || '').toLowerCase();
  const rules = [
    ['FAMILY_DIVORCE', /(גירוש|מזונות|משמורת|הסדרי ראייה|כתובה|ידוע.*בציבור|בית דין רבני|שלום בית)/],
    ['CRIMINAL', /(פלילי|מעצר|חקירה|כתב אישום|עבירה|משטרה|רישום פלילי|סמים|אלימות|גניבה|אונס|רצח)/],
    ['MEDICAL_MALPRACTICE', /(רשלנות רפואית|נזק רפואי|אבחון שגוי|לידה רשלנית|טיפול רפואי)/],
    ['TORT_DAMAGES', /(נזיק|פיצוי|תאונה|נזק גוף|לשון הרע|רשלנות)/],
    ['LABOR', /(דיני עבודה|פיטור|התפטר|שכר|עובד|מעביד|מעסיק|פיצויי פיטורים|הרעת תנאים)/],
    ['REAL_ESTATE', /(מקרקעין|נדלן|דירה|שכירות|משכיר|שוכר|טאבו|מס רכישה|התחדשות עירונית)/],
    ['INHERITANCE', /(ירושה|צוואה|עיזבון|יורש|רשם הירושה)/],
    ['TRAFFIC', /(תעבורה|נהיגה|רישיון נהיגה|דוח תנועה|שלילת רישיון|תאונת דרכים)/],
    ['SMALL_CLAIMS', /(תביעות קטנות|תביעה קטנה)/],
    ['INSOLVENCY', /(חדלות פירעון|פשיטת רגל|הוצאה לפועל|חוב|נושה|חייב)/],
    ['CORPORATE_COMMERCIAL', /(חברה|חברות|שותפות|חוזה|הסכם|מסחרי|עסק)/],
    ['SOCIAL_SECURITY', /(ביטוח לאומי|נכות|קצבה|ועדה רפואית)/],
    ['TAX', /(מס הכנסה|מיסוי|מע"מ|מס שבח|מס רכישה)/],
    ['ADMINISTRATIVE', /(עתירה|מינהלי|מנהלתי|רשות מקומית|משרד הפנים|ממשלה)/],
  ];
  return rules.find(([, expression]) => expression.test(value))?.[0] || 'OTHER_LEGAL';
}

function classifyIntent(query) {
  const value = String(query || '').toLowerCase();
  if (/(עורך דין|עורכי דין|משרד עורכי|ייעוץ|ייצוג)/.test(value)) return 'LAWYER_OR_SERVICE';
  if (/(כמה עולה|מחיר|עלות|שכר טרחה|אגרה)/.test(value)) return 'COST_OR_FEES';
  if (/(איך|כיצד|שלבים|הליך|הגשת|בקשה|טופס)/.test(value)) return 'PROCESS_OR_HOW_TO';
  if (/(חוק|תקנות|סעיף|פסיקה|פסק דין|בית משפט)/.test(value)) return 'LAW_OR_CASE';
  if (/(מה זה|מהו|מהי|הגדרה|משמעות)/.test(value)) return 'DEFINITION';
  if (/\?$/.test(value) || /(האם|אפשר|מותר|זכאי|יכולה|יכול)/.test(value)) return 'LEGAL_QUESTION';
  return 'GENERAL_INFORMATION';
}

function businessPotential(query, practiceArea, intent, recentTotals, estimatedCtrOpportunity) {
  const intentPoints = {
    LAWYER_OR_SERVICE: 40,
    COST_OR_FEES: 34,
    LEGAL_QUESTION: 28,
    PROCESS_OR_HOW_TO: 24,
    GENERAL_INFORMATION: 18,
    LAW_OR_CASE: 14,
    DEFINITION: 10,
  }[intent] || 15;
  const practicePoints = {
    MEDICAL_MALPRACTICE: 25,
    CORPORATE_COMMERCIAL: 24,
    TAX: 23,
    REAL_ESTATE: 22,
    CRIMINAL: 22,
    TORT_DAMAGES: 21,
    FAMILY_DIVORCE: 20,
    INSOLVENCY: 19,
    INHERITANCE: 18,
    TRAFFIC: 17,
    LABOR: 16,
    SOCIAL_SECURITY: 15,
    ADMINISTRATIVE: 15,
    SMALL_CLAIMS: 8,
    OTHER_LEGAL: 12,
  }[practiceArea] || 12;
  const demandPoints = Math.min(20, Math.log10(Math.max(1, recentTotals.impressions) + 1) * 7);
  const opportunityPoints = Math.min(10, Math.log10(Math.max(1, estimatedCtrOpportunity) + 1) * 5);
  const evidencePoints = Math.min(5, Math.log10(Math.max(1, recentTotals.clicks) + 1) * 3);
  const score = Math.round(Math.min(100, intentPoints + practicePoints + demandPoints + opportunityPoints + evidencePoints));
  const tier = score >= 80 ? 'VERY_HIGH' : score >= 65 ? 'HIGH' : score >= 50 ? 'MEDIUM' : score >= 35 ? 'LOW' : 'VERY_LOW';
  return {
    score,
    tier,
    intentPoints,
    practicePoints,
    demandPoints: Number(demandPoints.toFixed(2)),
    opportunityPoints: Number(opportunityPoints.toFixed(2)),
    evidencePoints: Number(evidencePoints.toFixed(2)),
    modelType: 'BUSINESS_POTENTIAL_PROXY_NOT_REVENUE',
  };
}

function positionBucket(position) {
  if (position <= 3) return '01-03';
  if (position <= 5) return '04-05';
  if (position <= 10) return '06-10';
  if (position <= 20) return '11-20';
  if (position <= 50) return '21-50';
  return '51+';
}

async function streamDaily(file, context) {
  const input = fs.createReadStream(file, { encoding: 'utf8' });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  let header = null;
  let rowCount = 0;
  let currentDate = '';
  let currentDayGroups = new Map();
  let currentWeek = '';
  let currentWeekGroups = new Map();

  function flushDay() {
    if (!currentDate) return;
    const recent = inRange(currentDate, context.windows.recent90.start, context.windows.recent90.end);
    for (const [query, pagesMap] of currentDayGroups) {
      const pages = [...pagesMap.entries()].map(([page, metric]) => ({ page, ...metricValue(metric) }));
      updateWinnerSignal(context.dailySignals, query, pages, currentDate);
      if (recent) updateWinnerSignal(context.recentDailySignals, query, pages, currentDate);
    }
    currentDayGroups = new Map();
  }

  function flushWeek() {
    if (!currentWeek) return;
    const weekEnd = dateShift(currentWeek, 6);
    const recent = weekEnd >= context.windows.recent90.start && currentWeek <= context.windows.recent90.end;
    for (const [query, pagesMap] of currentWeekGroups) {
      const pages = [...pagesMap.entries()].map(([page, metric]) => ({ page, ...metricValue(metric) }));
      updateWinnerSignal(context.weeklySignals, query, pages, currentWeek);
      if (recent) updateWinnerSignal(context.recentWeeklySignals, query, pages, currentWeek);
    }
    currentWeekGroups = new Map();
  }

  for await (const line of lines) {
    if (!header) {
      header = parseCsvLine(line);
      continue;
    }
    if (!line) continue;
    const values = parseCsvLine(line);
    const row = Object.fromEntries(header.map((column, index) => [column, values[index] ?? '']));
    rowCount += 1;
    const date = row.date;
    const week = weekStart(date);
    if (currentDate && date !== currentDate) flushDay();
    if (currentWeek && week !== currentWeek) flushWeek();
    currentDate = date;
    currentWeek = week;

    const recent90 = inRange(date, context.windows.recent90.start, context.windows.recent90.end);
    const previous90 = inRange(date, context.windows.previous90.start, context.windows.previous90.end);
    const recent28 = inRange(date, context.windows.recent28.start, context.windows.recent28.end);
    const previous28 = inRange(date, context.windows.previous28.start, context.windows.previous28.end);
    const contentPage = technicalUrl(row.page);
    if (recent90) {
      updateSimple(context.recentQueryTotals, row.query, row);
      updateSimple(context.recentPageTotals, row.page, row);
    }
    if (previous90) {
      updateSimple(context.previousQueryTotals, row.query, row);
      updateSimple(context.previousPageTotals, row.page, row);
    }
    if (recent28) {
      updateSimple(context.recent28QueryTotals, row.query, row);
      updateSimple(context.recent28PageTotals, row.page, row);
    }
    if (previous28) {
      updateSimple(context.previous28QueryTotals, row.query, row);
      updateSimple(context.previous28PageTotals, row.page, row);
    }

    if (context.multiQueries.has(row.query)) {
      if (recent90) updateNested(context.recent90ByQuery, row.query, contentPage, row);
      if (previous90) updateNested(context.previous90ByQuery, row.query, contentPage, row);
      if (!currentDayGroups.has(row.query)) currentDayGroups.set(row.query, new Map());
      if (!currentDayGroups.get(row.query).has(contentPage)) currentDayGroups.get(row.query).set(contentPage, emptyMetric());
      addMetric(currentDayGroups.get(row.query).get(contentPage), row);
      if (!currentWeekGroups.has(row.query)) currentWeekGroups.set(row.query, new Map());
      if (!currentWeekGroups.get(row.query).has(contentPage)) currentWeekGroups.get(row.query).set(contentPage, emptyMetric());
      addMetric(currentWeekGroups.get(row.query).get(contentPage), row);
    }
    if (rowCount % 250000 === 0) process.stdout.write(`Processed ${rowCount} daily rows...\n`);
  }
  flushDay();
  flushWeek();
  return rowCount;
}

function inventoryMetadata(inventoryMap, page) {
  return inventoryMap.get(technicalUrl(page)) || {
    url: page, normalized_url: technicalUrl(page), post_id: '', content_type: 'GSC_ONLY', language: '',
    title: '', h1: '', slug: '', canonical: '', indexability: '', sitemap_presence: 'FALSE',
    word_count: '', internal_inlinks: '', internal_outlinks: '', modified_date: '',
  };
}

function buildFullGroups(rows) {
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.query)) grouped.set(row.query, new Map());
    const page = technicalUrl(row.page);
    const pages = grouped.get(row.query);
    if (!pages.has(page)) pages.set(page, {
      page,
      metric: emptyMetric(),
      metricSources: new Set(),
      reconciliationStatuses: new Set(),
      rawVariants: new Set(),
    });
    const item = pages.get(page);
    addMetric(item.metric, row);
    item.metricSources.add(row.metric_source || '');
    item.reconciliationStatuses.add(row.reconciliation_status || '');
    item.rawVariants.add(row.page);
  }
  const groups = [];
  for (const [query, pages] of grouped) {
    if (pages.size <= 1) continue;
    const ordered = [...pages.values()].map((item) => ({
      page: item.page,
      ...metricValue(item.metric),
      metric_source: [...item.metricSources].filter(Boolean).join('|'),
      reconciliation_status: [...item.reconciliationStatuses].filter(Boolean).join('|'),
      raw_variant_count: item.rawVariants.size,
      raw_variants: [...item.rawVariants].join('|'),
    })).sort(strongestComparator);
    groups.push({ query, pages: ordered, totals: aggregateRows(ordered), distinctUrlCount: ordered.length });
  }
  return groups;
}

function computeCtrBenchmarks(queryTotals) {
  const buckets = new Map();
  for (const metric of queryTotals.values()) {
    const value = metricValue(metric);
    const bucket = positionBucket(value.position);
    if (!buckets.has(bucket)) buckets.set(bucket, emptyMetric());
    addMetric(buckets.get(bucket), value);
  }
  return Object.fromEntries([...buckets.entries()].map(([bucket, metric]) => [bucket, metricValue(metric)]));
}

function classifyGroup(group, context) {
  const recentPages = nestedRows(context.recent90ByQuery, group.query).sort(strongestComparator);
  const previousPages = nestedRows(context.previous90ByQuery, group.query).sort(strongestComparator);
  const recentTotals = aggregateRows(recentPages);
  const previousTotals = aggregateRows(previousPages);
  const activePages = recentPages.filter((page) => page.impressions > 0);
  const strongest = activePages[0] || group.pages[0];
  const secondary = activePages[1] || null;
  const strongestMetadata = inventoryMetadata(context.inventoryMap, strongest.page);
  const secondaryMetadata = secondary ? inventoryMetadata(context.inventoryMap, secondary.page) : inventoryMetadata(context.inventoryMap, group.pages[1].page);
  const strongestShare = ratio(strongest.impressions, recentTotals.impressions);
  const secondaryShare = secondary ? ratio(secondary.impressions, recentTotals.impressions) : 0;
  const positionGap = secondary ? Math.abs(strongest.position - secondary.position) : 999;
  const similarity = metadataSimilarity(strongestMetadata, secondaryMetadata);
  const technicalVariants = activePages.length > 1 && new Set(activePages.map((page) => technicalUrl(page.page))).size < activePages.length;
  const suffixSignal = activePages.some((page) => suffixPattern(page.page, inventoryMetadata(context.inventoryMap, page.page).slug));
  const contentTypes = new Set(activePages.map((page) => inventoryMetadata(context.inventoryMap, page.page).content_type).filter(Boolean));
  const distinctContentTypes = contentTypes.size > 1;
  const daily = signalValue(context.recentDailySignals.get(group.query));
  const weekly = signalValue(context.recentWeeklySignals.get(group.query));
  const metadataKnown = Boolean(strongestMetadata.title || strongestMetadata.h1) && Boolean(secondaryMetadata.title || secondaryMetadata.h1);
  const sameContentType = strongestMetadata.content_type && strongestMetadata.content_type === secondaryMetadata.content_type;
  const historicalOnly = activePages.length <= 1 && group.distinctUrlCount > 1;
  const evidence = [];
  if (historicalOnly) evidence.push(['HISTORICAL_ONLY', 'ב-90 הימים האחרונים נשאר לכל היותר URL פעיל אחד.']);
  if (technicalVariants) evidence.push(['TECHNICAL_VARIANT', 'אותו נתיב הופיע ביותר מגרסת URL טכנית אחת.']);
  if (secondaryShare >= PARAMETERS.meaningfulSecondaryShare) evidence.push(['SIGNIFICANT_SECONDARY', `ה-URL השני מחזיק ${(secondaryShare * 100).toFixed(1)}% מהחשיפות האחרונות.`]);
  if (strongestShare >= PARAMETERS.dominantImpressionShare) evidence.push(['DOMINANT_OWNER', `ה-URL החזק מחזיק ${(strongestShare * 100).toFixed(1)}% מהחשיפות האחרונות.`]);
  if (positionGap <= PARAMETERS.similarPositionGap) evidence.push(['SIMILAR_POSITIONS', `פער המיקום בין שני המובילים הוא ${positionGap.toFixed(2)}.`]);
  if (weekly.winnerSwitches >= PARAMETERS.meaningfulWeeklySwitches) evidence.push(['WEEKLY_WINNER_SWITCH', `הבעלות השבועית התחלפה ${weekly.winnerSwitches} פעמים ב-90 הימים האחרונים.`]);
  if (daily.winnerSwitches >= 3) evidence.push(['DAILY_WINNER_SWITCH', `הבעלות היומית התחלפה ${daily.winnerSwitches} פעמים ב-90 הימים האחרונים.`]);
  if (similarity >= PARAMETERS.similarMetadataJaccard) evidence.push(['SIMILAR_TITLE_H1', `דמיון title/H1 בין המובילים הוא ${similarity.toFixed(2)}.`]);
  if (suffixSignal) evidence.push(['NUMERIC_SUFFIX', 'נמצא suffix מספרי אופייני לכפילות import.']);
  if (distinctContentTypes) evidence.push(['DISTINCT_CONTENT_TYPES', `סוגי תוכן שונים: ${[...contentTypes].join(', ')}.`]);
  if (!metadataKnown) evidence.push(['METADATA_GAP', 'חסרים title/H1 לאחד המובילים.']);
  if (recentTotals.impressions < PARAMETERS.lowEvidenceImpressions) evidence.push(['LOW_DATA', `רק ${recentTotals.impressions} חשיפות ב-90 הימים האחרונים.`]);

  let classification;
  let issueType;
  let confidence;
  let action;
  if (historicalOnly) {
    classification = 'BENIGN_MULTI_PAGE_VISIBILITY';
    issueType = 'HISTORICAL_OVERLAP_RESOLVED';
    confidence = 'MEDIUM';
    action = 'MONITOR_RESOLVED';
  } else if (recentTotals.impressions < PARAMETERS.lowEvidenceImpressions) {
    classification = 'INSUFFICIENT_EVIDENCE';
    issueType = 'LOW_RECENT_DATA';
    confidence = 'LOW';
    action = 'INVESTIGATE';
  } else if (technicalVariants && secondaryShare >= PARAMETERS.technicalSecondaryShare) {
    classification = 'LIKELY_CANNIBALIZATION';
    issueType = 'TECHNICAL_DUPLICATE';
    confidence = 'HIGH';
    action = 'TECHNICAL_VERSION_410_REVIEW';
  } else if (
    sameContentType
    && similarity >= PARAMETERS.similarMetadataJaccard
    && secondaryShare >= PARAMETERS.meaningfulSecondaryShare
    && (positionGap <= PARAMETERS.similarPositionGap || weekly.winnerSwitches >= PARAMETERS.meaningfulWeeklySwitches)
  ) {
    classification = 'LIKELY_CANNIBALIZATION';
    issueType = suffixSignal ? 'IMPORT_DUPLICATE' : 'SAME_INTENT_CONTENT';
    confidence = metadataKnown ? 'HIGH' : 'MEDIUM';
    action = similarity >= PARAMETERS.strongMetadataJaccard || suffixSignal ? 'MERGE_CONTENT_THEN_410_REVIEW' : 'DIFFERENTIATE_INTENT';
  } else if (strongestShare >= PARAMETERS.dominantImpressionShare) {
    classification = 'BENIGN_MULTI_PAGE_VISIBILITY';
    issueType = 'DOMINANT_OWNER_WITH_INCIDENTAL_VISIBILITY';
    confidence = 'HIGH';
    action = 'KEEP_BOTH_PROTECT';
  } else if (distinctContentTypes && secondaryShare < PARAMETERS.stronglySplitSecondaryShare) {
    classification = 'BENIGN_MULTI_PAGE_VISIBILITY';
    issueType = 'HUB_DETAIL_OR_COMPLEMENTARY_INTENT';
    confidence = 'MEDIUM';
    action = 'KEEP_BOTH_PROTECT';
  } else if (secondaryShare >= PARAMETERS.technicalSecondaryShare || weekly.winnerSwitches > 0 || positionGap <= 10) {
    classification = 'POSSIBLE_CANNIBALIZATION';
    issueType = distinctContentTypes ? 'POSSIBLE_INTENT_OVERLAP' : 'POSSIBLE_SAME_INTENT_OVERLAP';
    confidence = metadataKnown ? 'MEDIUM' : 'LOW';
    action = distinctContentTypes ? 'DIFFERENTIATE_INTENT' : 'INTERNAL_LINK_REBALANCE';
  } else {
    classification = 'INSUFFICIENT_EVIDENCE';
    issueType = 'WEAK_OR_AMBIGUOUS_SIGNAL';
    confidence = 'LOW';
    action = 'INVESTIGATE';
  }

  const splitComponent = Math.min(30, ratio(secondaryShare, 0.5) * 30);
  const switchComponent = Math.min(20, weekly.winnerSwitches * 5);
  const similarityComponent = Math.min(20, ratio(similarity, PARAMETERS.similarMetadataJaccard) * 20);
  const positionComponent = positionGap <= 3 ? 15 : positionGap <= 5 ? 10 : positionGap <= 10 ? 5 : 0;
  const technicalComponent = technicalVariants ? 15 : suffixSignal ? 10 : 0;
  const riskScore = Math.round(splitComponent + switchComponent + similarityComponent + positionComponent + technicalComponent);
  let urgency;
  if (classification === 'LIKELY_CANNIBALIZATION' && (recentTotals.impressions >= PARAMETERS.p0Impressions || recentTotals.clicks >= 10 || (technicalVariants && recentTotals.impressions >= PARAMETERS.p1Impressions))) urgency = 'P0_7_DAYS';
  else if (classification === 'LIKELY_CANNIBALIZATION' || (classification === 'POSSIBLE_CANNIBALIZATION' && (recentTotals.impressions >= PARAMETERS.p1Impressions || riskScore >= 65))) urgency = 'P1_14_DAYS';
  else if (classification === 'POSSIBLE_CANNIBALIZATION' && (recentTotals.impressions >= PARAMETERS.p2Impressions || riskScore >= 40)) urgency = 'P2_30_DAYS';
  else urgency = 'P3_MONITOR';

  const bucket = positionBucket(recentTotals.position);
  const benchmark = context.ctrBenchmarks[bucket]?.ctr || 0;
  const estimatedCtrOpportunity = recentTotals.impressions >= 30
    ? Math.max(0, Math.round((benchmark * recentTotals.impressions) - recentTotals.clicks))
    : 0;

  return {
    recentPages,
    previousPages,
    recentTotals,
    previousTotals,
    strongest,
    secondary,
    strongestMetadata,
    secondaryMetadata,
    strongestShare,
    secondaryShare,
    positionGap,
    similarity,
    technicalVariants,
    suffixSignal,
    contentTypes: [...contentTypes],
    daily,
    weekly,
    classification,
    issueType,
    confidence,
    action,
    urgency,
    riskScore,
    splitComponent,
    switchComponent,
    similarityComponent,
    positionComponent,
    technicalComponent,
    evidenceCodes: evidence.map(([code]) => code).join('|'),
    evidenceText: evidence.map(([, text]) => text).join(' '),
    riskExposureImpressions: secondary ? secondary.impressions : 0,
    ctrBenchmarkBucket: bucket,
    ctrBenchmark: benchmark,
    estimatedCtrOpportunity,
  };
}

function urgencyRank(value) {
  return { P0_7_DAYS: 0, P1_14_DAYS: 1, P2_30_DAYS: 2, P3_MONITOR: 3 }[value] ?? 9;
}

function buildMonthlyTrends(dateRows) {
  const months = new Map();
  for (const row of dateRows) {
    const month = row.date.slice(0, 7);
    if (!months.has(month)) months.set(month, emptyMetric());
    addMetric(months.get(month), row);
  }
  const values = [...months.entries()].map(([month, metric]) => ({ month, ...metricValue(metric) }));
  return values.map((row, index) => {
    const previous = values[index - 1];
    return {
      ...row,
      clicks_change_pct: previous ? ratio(row.clicks - previous.clicks, previous.clicks) : '',
      impressions_change_pct: previous ? ratio(row.impressions - previous.impressions, previous.impressions) : '',
      position_change: previous ? row.position - previous.position : '',
    };
  });
}

function buildChangePoints(dateRows) {
  const values = dateRows.map((row) => ({ date: row.date, clicks: number(row.clicks), impressions: number(row.impressions), position: number(row.position) }));
  const candidates = [];
  for (let index = 13; index < values.length; index += 1) {
    const previous = values.slice(index - 13, index - 6);
    const current = values.slice(index - 6, index + 1);
    const previousImpressions = previous.reduce((sum, row) => sum + row.impressions, 0) / 7;
    const currentImpressions = current.reduce((sum, row) => sum + row.impressions, 0) / 7;
    const previousClicks = previous.reduce((sum, row) => sum + row.clicks, 0) / 7;
    const currentClicks = current.reduce((sum, row) => sum + row.clicks, 0) / 7;
    const impressionChange = ratio(currentImpressions - previousImpressions, previousImpressions);
    const clickChange = ratio(currentClicks - previousClicks, previousClicks);
    if (Math.abs(impressionChange) >= 0.40 && Math.max(previousImpressions, currentImpressions) >= 100) {
      candidates.push({
        date: values[index].date,
        direction: impressionChange < 0 ? 'DROP' : 'RECOVERY',
        previous_7d_avg_impressions: previousImpressions,
        current_7d_avg_impressions: currentImpressions,
        impressions_change_pct: impressionChange,
        previous_7d_avg_clicks: previousClicks,
        current_7d_avg_clicks: currentClicks,
        clicks_change_pct: clickChange,
      });
    }
  }
  const selected = [];
  for (const candidate of candidates.sort((a, b) => a.date.localeCompare(b.date))) {
    const previous = selected.at(-1);
    if (!previous || dateShift(previous.date, 13) < candidate.date) selected.push(candidate);
    else if (Math.abs(candidate.impressions_change_pct) > Math.abs(previous.impressions_change_pct)) selected[selected.length - 1] = candidate;
  }
  return selected;
}

function buildDeltaRows(recentMap, previousMap, keyName) {
  const keys = new Set([...recentMap.keys(), ...previousMap.keys()]);
  const rows = [];
  for (const key of keys) {
    const recent = metricValue(recentMap.get(key));
    const previous = metricValue(previousMap.get(key));
    rows.push({
      [keyName]: key,
      recent_clicks: recent.clicks,
      previous_clicks: previous.clicks,
      clicks_delta: recent.clicks - previous.clicks,
      clicks_change_pct: previous.clicks ? ratio(recent.clicks - previous.clicks, previous.clicks) : '',
      recent_impressions: recent.impressions,
      previous_impressions: previous.impressions,
      impressions_delta: recent.impressions - previous.impressions,
      impressions_change_pct: previous.impressions ? ratio(recent.impressions - previous.impressions, previous.impressions) : '',
      recent_ctr: recent.ctr,
      previous_ctr: previous.ctr,
      recent_position: recent.position,
      previous_position: previous.position,
      position_delta: recent.position - previous.position,
    });
  }
  return rows.sort((left, right) => Math.abs(right.impressions_delta) - Math.abs(left.impressions_delta));
}

function buildDuplicateMetadata(inventoryRows, field) {
  const groups = new Map();
  for (const row of inventoryRows) {
    const value = String(row[field] || '').trim().toLowerCase();
    if (!value) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(row);
  }
  return [...groups.entries()].filter(([, rows]) => rows.length > 1).map(([value, rows], index) => ({
    duplicate_group_id: `${field.toUpperCase()}-${String(index + 1).padStart(5, '0')}`,
    field,
    duplicate_value: value,
    url_count: rows.length,
    urls: rows.map((row) => row.url).join('|'),
    content_types: [...new Set(rows.map((row) => row.content_type))].join('|'),
    sitemap_urls: rows.filter((row) => row.sitemap_presence === 'TRUE').length,
  })).sort((left, right) => right.url_count - left.url_count || left.duplicate_value.localeCompare(right.duplicate_value, 'he'));
}

function playbookRows() {
  return [
    {
      action: 'KEEP_BOTH_PROTECT', what_it_is: 'משאירים כמה עמודים כאשר כל אחד משרת אינטנט או שלב מסע שונה.', why: 'נראות רב-עמודית יכולה להיות מועילה ואינה עונש בפני עצמה.', when_to_use: 'hub מול detail, מדריך מול כלי, או שאלת מידע מול שירות.', damage_if_ignored: 'איחוד שגוי עלול למחוק כיסוי של תתי-כוונות ולפגוע בעמוד שכבר עובד.', urgency: 'P3_MONITOR',
      good_example_1: 'עמוד מרכז “גירושין” לצד מדריך נפרד לחישוב מזונות, עם titles וקישורים מובחנים.', good_example_2: 'מדריך “תביעה קטנה” לצד כלי אינטראקטיבי להכנת כתב תביעה.',
      bad_example_1: 'לאחד עמוד שירות ומחשבון רק משום ששניהם הופיעו לאותה שאילתה רחבה.', bad_example_2: 'לבצע canonical מעמוד מאמר מפורט לעמוד קטגוריה כללי.',
    },
    {
      action: 'DIFFERENTIATE_INTENT', what_it_is: 'מחדדים תפקיד, title, H1, מבנה וקישורים של עמודים משלימים.', why: 'Google והמשתמש צריכים להבין מי עונה על איזה צורך.', when_to_use: 'עמודים שונים אך חופפים חלקית, במיוחד hub/detail או מידע/שירות.', damage_if_ignored: 'הבעלות על השאילתה עלולה להתחלף וה-CTR להישאר נמוך בגלל מסר לא ברור.', urgency: 'P1_14_DAYS או P2_30_DAYS',
      good_example_1: '“עורך דין גירושין – ייעוץ וייצוג” לעומת “הליך גירושין – שלבים ומסמכים”.', good_example_2: '“רשלנות רפואית בלידה – מדריך זכויות” לעומת “מחשבון/בדיקת זכאות לתביעה”.',
      bad_example_1: 'לשנות רק שתי מילים ב-title ולהשאיר אותו תוכן, H1 וקישורים.', bad_example_2: 'להוסיף מילות מפתח בכוח לשני העמודים במקום לבחור תפקיד לכל אחד.',
    },
    {
      action: 'MERGE_CONTENT_THEN_410_REVIEW', what_it_is: 'מצילים מידע ייחודי מעמוד כפול אל עמוד הבעלים, מסירים ממנו קישורים ו-sitemap, ואז מחזירים 410 לעמוד המיותר.', why: 'כך מפסיקים לתחזק שני עמודים לאותו צורך בלי למחוק ראיות, דוגמאות או מידע משפטי שימושי.', when_to_use: 'אותו אינטנט, חפיפת תוכן גבוהה, עמוד בעלים ברור, והעמוד החלש אינו משרת צורך עצמאי.', damage_if_ignored: 'אותות רלוונטיות וקישורים פנימיים נשארים מפוצלים; משתמשים עלולים להגיע לגרסה פחות טובה.', urgency: 'P0_7_DAYS או P1_14_DAYS',
      good_example_1: 'להעביר פסקה ייחודית ועדכנית מ-`/topic-2/` אל `/topic/`, לעדכן קישורים פנימיים, להסיר את הכפילות מה-sitemap ולהחזיר 410.', good_example_2: 'לאחד שתי גרסאות של מדריך זהה בעמוד העדכני, לשמר מקורות ותאריך עדכון, ואז 410 לגרסה החלשה.',
      bad_example_1: 'להחזיר 410 לפני שהמידע המשפטי הייחודי או הקישורים החשובים נשמרו בעמוד הבעלים.', bad_example_2: 'למחוק עמוד שמשרת אינטנט שונה רק משום ששתי הכתובות הופיעו לאותה שאילתה רחבה.',
    },
    {
      action: 'TECHNICAL_VERSION_410_REVIEW', what_it_is: 'מזהים גרסה טכנית מיותרת; אם היא אינה נתיב נדרש למשתמש ואין לה ערך קישורים, מסירים את כל האותות אליה ומחזירים 410.', why: 'גרסאות טכניות מיותרות מפצלות מדידה, crawl וקישורים גם כאשר התוכן זהה.', when_to_use: 'suffix import, case/slug ניסיוני או URL טכני שאין סיבה עסקית לשמר; לא מחילים אוטומטית על HTTP או פרמטרים בלי בדיקה.', damage_if_ignored: 'Google ממשיך לגלות וריאציות, האתר עצמו מאותת על כמה כתובות, והנתונים מתפצלים.', urgency: 'P0_7_DAYS או P1_14_DAYS',
      good_example_1: 'להסיר URL import כמו `/topic-2/` מה-sitemap ומהקישורים לאחר שנבדק שאין לו ערך עצמאי, ואז להחזיר 410.', good_example_2: 'להחזיר 410 ל-slug ניסוי שמעולם לא שימש משתמשים, לאחר תיקון כל מקור פנימי שמייצר אותו.',
      bad_example_1: 'להחזיר 410 לכל כתובת HTTP בלי לבדוק קישורים חיצוניים, סימניות ותנועה ישירה.', bad_example_2: 'להחזיר 410 לפרמטר תפעולי שהמערכת עדיין מייצרת וכך ליצור שגיאות למשתמשים.',
    },
    {
      action: 'DELETE_410_DIRECT', what_it_is: 'מוחקים עמוד שאין לו צורך משתמש עצמאי, אין בו מידע ייחודי להצלה והוא אינו מחזיק ביצועי חיפוש או קישורים מהותיים.', why: 'עמוד חסר ערך אינו צריך להישאר באינדקס או להמשיך לקבל קישורים פנימיים ותחזוקה.', when_to_use: 'אפס ערך עסקי או משפטי עצמאי, אפס או כמעט אפס ביצועים, אין קישורים חשובים, אין המרות, ואין תחליף נדרש.', damage_if_ignored: 'האינדקס והארכיטקטורה נשארים רועשים; Google ומשתמשים עלולים להגיע לעמוד חלש או מיושן.', urgency: 'P1_14_DAYS או P2_30_DAYS',
      good_example_1: 'עמוד import ריק, לא מקושר, מחוץ למסע המשתמש וללא הופעות או קליקים — להסיר מה-sitemap ומהקישורים ולהחזיר 410.', good_example_2: 'טיוטת ניסוי ישנה עם תוכן מועתק במלואו מעמוד פעיל וללא מידע ייחודי — לתעד, לגבות ולהחזיר 410.',
      bad_example_1: 'למחוק עמוד רק כי לא קיבל קליקים ב-28 ימים, בלי לבדוק את מלוא הטווח, עונתיות והמרות.', bad_example_2: 'למחוק עמוד YMYL עם מקורות וקישורים חיצוניים לפני שהידע הייחודי נשמר במקום הנכון.',
    },
    {
      action: 'INTERNAL_LINK_REBALANCE', what_it_is: 'מרכזים anchors רלוונטיים בעמוד הבעלים ומפחיתים אותות סותרים.', why: 'Google משתמש בקישורים וב-anchor text כדי להבין רלוונטיות והיררכיה.', when_to_use: 'כמה עמודים דומים ללא כפילות מלאה, כשהבעלות אינה יציבה.', damage_if_ignored: 'האתר עצמו ממשיך להצביע על כמה בעלי בית לאותה שאילתה.', urgency: 'P2_30_DAYS',
      good_example_1: 'ממאמרי משנה לקשר ל-pillar עם anchor תיאורי עקבי, ובחזרה לקשר רק לתתי-הנושאים.', good_example_2: 'לעדכן קישורים ישנים כך שיגיעו ישירות ל-canonical ללא redirect.',
      bad_example_1: 'להשתמש באותו exact-match anchor לעשרה עמודים שונים.', bad_example_2: 'להוסיף מאות קישורים אוטומטיים בפוטר בלי הקשר למשתמש.',
    },
    {
      action: 'CANONICAL_REVIEW', what_it_is: 'מצהירים על URL מייצג לעמודים זהים או כמעט זהים שנדרשים להישאר נגישים.', why: 'canonical מסייע לאחד אותות ומעקב כאשר אי אפשר או לא נכון לבצע redirect.', when_to_use: 'גרסאות הדפסה, פרמטרים או שכפול טכני שחייב להישאר.', damage_if_ignored: 'Google עשוי לבחור canonical אחר, והמדידה או הנראות יתפצלו.', urgency: 'P1_14_DAYS',
      good_example_1: 'גרסת הדפסה canonical למאמר הראשי, כאשר התוכן באמת שקול.', good_example_2: 'URL עם פרמטר מיון canonical לקטגוריה הנקייה כאשר רשימת התוכן זהה.',
      bad_example_1: 'canonical ממאמר “מזונות ילדים” למאמר “משמורת” רק כי שניהם בדיני משפחה.', bad_example_2: 'canonical סותר: HTML מצביע ל-A, sitemap כולל B וקישורים פנימיים מצביעים ל-C.',
    },
    {
      action: 'NOINDEX_REVIEW', what_it_is: 'מונעים אינדוקס של עמודי מערכת או חיפוש פנימי שאין להם ערך כתוצאת חיפוש.', why: 'noindex מסיר את העמוד לחלוטין מתוצאות Google לאחר crawl.', when_to_use: 'עמודי תודה, חיפוש פנימי, חשבון או פילטרים חסרי ערך עצמאי.', damage_if_ignored: 'אינדקס מנופח ועמודי thin/utility מתחרים בתוכן ציבורי.', urgency: 'P2_30_DAYS',
      good_example_1: 'עמוד תודה לאחר שליחת טופס עם `noindex,follow`.', good_example_2: 'תוצאות חיפוש פנימיות או מסכי חשבון שאינם landing pages.',
      bad_example_1: 'להוסיף noindex לעמוד חזק רק כדי “לפתור קניבליזציה”.', bad_example_2: 'לחסום את העמוד ב-robots.txt כך ש-Google לא יוכל לראות את ה-noindex.',
    },
  ].map((row) => ({ ...row, manual_approval_required: 'TRUE' }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { process.stdout.write(`${usage()}\n`); return; }
  if (!args.runDir || !path.isAbsolute(args.runDir)) throw new Error('--run-dir must be an absolute path.');
  const runDir = args.runDir;
  const analysisDir = path.join(runDir, 'analysis');
  await ensureDir(analysisDir);
  const files = {
    manifest: path.join(runDir, 'gsc-run-manifest.json'),
    reconciled: path.join(runDir, 'aggregated', 'query-page-reconciled.csv'),
    daily: path.join(runDir, 'raw', 'raw-query-page-daily.csv'),
    pages: path.join(runDir, 'raw', 'control-pages.csv'),
    queries: path.join(runDir, 'raw', 'control-queries.csv'),
    dates: path.join(runDir, 'raw', 'control-dates.csv'),
    totals: path.join(runDir, 'raw', 'control-totals.csv'),
    inventory: path.join(analysisDir, 'page-inventory-source.csv'),
    inventorySummary: path.join(analysisDir, 'page-inventory-source-summary.json'),
  };
  for (const [name, file] of Object.entries(files)) {
    try { await fsp.access(file, fs.constants.R_OK); } catch { throw new Error(`Missing ${name}: ${file}`); }
  }

  const [manifest, reconciledRows, pageControls, queryControls, dateControls, totalControls, inventoryRows, inventorySummary] = await Promise.all([
    readJson(files.manifest), readCsv(files.reconciled), readCsv(files.pages), readCsv(files.queries),
    readCsv(files.dates), readCsv(files.totals), readCsv(files.inventory), readJson(files.inventorySummary),
  ]);
  if (manifest.parameters.site !== PROPERTY || manifest.property.siteUrl !== PROPERTY) throw new Error(`Wrong property: ${manifest.parameters.site}`);
  if (manifest.readonlyScope !== 'https://www.googleapis.com/auth/webmasters.readonly') throw new Error('OAuth scope is not read-only.');
  if (manifest.status !== 'COMPLETE') throw new Error(`Pull is not complete: ${manifest.status}`);
  if (reconciledRows.length !== manifest.rowCounts.reconciledKeys) throw new Error('Reconciled row count mismatch.');

  const fullGroups = buildFullGroups(reconciledRows);
  const multiQueries = new Set(fullGroups.map((group) => group.query));
  const finalDate = manifest.availability.lastFinalDate;
  const windows = {
    recent90: { start: dateShift(finalDate, -89), end: finalDate },
    previous90: { start: dateShift(finalDate, -179), end: dateShift(finalDate, -90) },
    recent28: { start: dateShift(finalDate, -27), end: finalDate },
    previous28: { start: dateShift(finalDate, -55), end: dateShift(finalDate, -28) },
  };
  const inventoryMap = new Map(inventoryRows.map((row) => [technicalUrl(row.url), row]));
  const context = {
    windows,
    multiQueries,
    inventoryMap,
    recent90ByQuery: new Map(), previous90ByQuery: new Map(),
    recentQueryTotals: new Map(), previousQueryTotals: new Map(), recentPageTotals: new Map(), previousPageTotals: new Map(),
    recent28QueryTotals: new Map(), previous28QueryTotals: new Map(), recent28PageTotals: new Map(), previous28PageTotals: new Map(),
    dailySignals: new Map(), recentDailySignals: new Map(), weeklySignals: new Map(), recentWeeklySignals: new Map(),
  };
  process.stdout.write('Streaming daily query-page data...\n');
  const dailyRowsProcessed = await streamDaily(files.daily, context);
  if (dailyRowsProcessed !== manifest.rowCounts.dailyApiRows) throw new Error(`Daily row count mismatch: ${dailyRowsProcessed}`);
  context.ctrBenchmarks = computeCtrBenchmarks(context.recentQueryTotals);

  const classified = fullGroups.map((group) => ({ group, result: classifyGroup(group, context) }));
  classified.sort((left, right) => urgencyRank(left.result.urgency) - urgencyRank(right.result.urgency)
    || right.result.riskScore - left.result.riskScore
    || right.result.recentTotals.impressions - left.result.recentTotals.impressions
    || left.group.query.localeCompare(right.group.query, 'he'));

  const summaryRows = [];
  const detailRows = [];
  const pairMap = new Map();
  const pageGroupStats = new Map();
  const practiceMap = new Map();
  const intentMap = new Map();
  const classificationCounts = { LIKELY_CANNIBALIZATION: 0, POSSIBLE_CANNIBALIZATION: 0, BENIGN_MULTI_PAGE_VISIBILITY: 0, INSUFFICIENT_EVIDENCE: 0 };

  for (let index = 0; index < classified.length; index += 1) {
    const { group, result } = classified[index];
    const groupId = `JQ-${String(index + 1).padStart(5, '0')}`;
    classificationCounts[result.classification] += 1;
    const practiceArea = classifyPracticeArea(group.query);
    const intent = classifyIntent(group.query);
    const business = businessPotential(group.query, practiceArea, intent, result.recentTotals, result.estimatedCtrOpportunity);
    const row = {
      group_id: groupId,
      query: group.query,
      practice_area: practiceArea,
      query_intent: intent,
      business_potential_score: business.score,
      business_potential_tier: business.tier,
      business_model_type: business.modelType,
      business_intent_points: business.intentPoints,
      business_practice_points: business.practicePoints,
      business_demand_points: business.demandPoints,
      business_opportunity_points: business.opportunityPoints,
      business_evidence_points: business.evidencePoints,
      classification: result.classification,
      issue_type: result.issueType,
      confidence: result.confidence,
      urgency: result.urgency,
      risk_score: result.riskScore,
      risk_split_component: result.splitComponent,
      risk_switch_component: result.switchComponent,
      risk_similarity_component: result.similarityComponent,
      risk_position_component: result.positionComponent,
      risk_technical_component: result.technicalComponent,
      full_distinct_url_count: group.distinctUrlCount,
      recent_90d_distinct_url_count: result.recentPages.length,
      full_clicks: group.totals.clicks,
      full_impressions: group.totals.impressions,
      full_ctr: group.totals.ctr,
      full_position: group.totals.position,
      recent_90d_clicks: result.recentTotals.clicks,
      recent_90d_impressions: result.recentTotals.impressions,
      recent_90d_ctr: result.recentTotals.ctr,
      recent_90d_position: result.recentTotals.position,
      previous_90d_clicks: result.previousTotals.clicks,
      previous_90d_impressions: result.previousTotals.impressions,
      clicks_delta: result.recentTotals.clicks - result.previousTotals.clicks,
      impressions_delta: result.recentTotals.impressions - result.previousTotals.impressions,
      strongest_url: result.strongest.page,
      secondary_url: result.secondary?.page || '',
      weaker_urls: result.recentPages.slice(1).map((page) => page.page).join('|'),
      strongest_impression_share: result.strongestShare,
      secondary_impression_share: result.secondaryShare,
      top_two_position_gap: result.positionGap === 999 ? '' : result.positionGap,
      title_h1_similarity: result.similarity,
      technical_variant_signal: result.technicalVariants ? 'TRUE' : 'FALSE',
      suffix_signal: result.suffixSignal ? 'TRUE' : 'FALSE',
      content_types: result.contentTypes.join('|'),
      recent_daily_observations: result.daily.observationCount,
      recent_daily_cooccurrence_days: result.daily.cooccurrenceCount,
      recent_daily_winner_count: result.daily.winnerCount,
      recent_daily_winner_switches: result.daily.winnerSwitches,
      recent_weekly_observations: result.weekly.observationCount,
      recent_weekly_cooccurrence_weeks: result.weekly.cooccurrenceCount,
      recent_weekly_winner_count: result.weekly.winnerCount,
      recent_weekly_winner_switches: result.weekly.winnerSwitches,
      risk_exposure_impressions: result.riskExposureImpressions,
      ctr_benchmark_bucket: result.ctrBenchmarkBucket,
      site_ctr_benchmark: result.ctrBenchmark,
      estimated_ctr_opportunity_clicks: result.estimatedCtrOpportunity,
      recommended_action: result.action,
      why_this_matters: result.evidenceText,
      evidence_codes: result.evidenceCodes,
      damage_statement: result.classification === 'LIKELY_CANNIBALIZATION'
        ? 'סיכון לפיצול אותות, החלפת בעלות והחמצת קליקים; אין לייחס את כל הפער לקניבליזציה ללא ניסוי מבוקר.'
        : result.classification === 'POSSIBLE_CANNIBALIZATION'
          ? 'קיימת חשיפה מפוצלת שדורשת בדיקת אינטנט; הנזק טרם הוכח.'
          : 'לא הוכח נזק מקניבליזציה; פעולה אגרסיבית עלולה להזיק.',
      do_not_execute_automatically: 'TRUE',
      metric_source: [...new Set(group.pages.map((page) => page.metric_source))].join('|'),
      reconciliation_status: [...new Set(group.pages.map((page) => page.reconciliation_status))].join('|'),
    };
    summaryRows.push(row);

    const detailPages = new Map(group.pages.map((page) => [page.page, { full: page }]));
    for (const page of result.recentPages) {
      if (!detailPages.has(page.page)) detailPages.set(page.page, {});
      detailPages.get(page.page).recent = page;
    }
    for (const page of result.previousPages) {
      if (!detailPages.has(page.page)) detailPages.set(page.page, {});
      detailPages.get(page.page).previous = page;
    }
    const orderedDetail = [...detailPages.entries()].map(([page, periods]) => ({ page, periods })).sort((left, right) => strongestComparator(
      left.periods.recent || left.periods.full || { page: left.page },
      right.periods.recent || right.periods.full || { page: right.page },
    ));
    for (const { page, periods } of orderedDetail) {
      const metadata = inventoryMetadata(inventoryMap, page);
      detailRows.push({
        group_id: groupId, query: group.query, classification: result.classification, issue_type: result.issueType,
        urgency: result.urgency, recommended_action: result.action,
        url_role: page === result.strongest.page ? 'RECENT_STRONGEST' : periods.recent ? 'RECENT_COMPETITOR' : 'HISTORICAL_ONLY',
        page, normalized_content_url: technicalUrl(page), post_id: metadata.post_id, content_type: metadata.content_type,
        title: metadata.title, h1: metadata.h1, canonical: metadata.canonical, indexability: metadata.indexability,
        sitemap_presence: metadata.sitemap_presence, modified_date: metadata.modified_date, word_count: metadata.word_count,
        internal_inlinks: metadata.internal_inlinks, internal_outlinks: metadata.internal_outlinks,
        duplicate_suffix_pattern: suffixPattern(page, metadata.slug),
        full_clicks: periods.full?.clicks || 0, full_impressions: periods.full?.impressions || 0,
        full_ctr: periods.full?.ctr || 0, full_position: periods.full?.position || 0,
        recent_90d_clicks: periods.recent?.clicks || 0, recent_90d_impressions: periods.recent?.impressions || 0,
        recent_90d_ctr: periods.recent?.ctr || 0, recent_90d_position: periods.recent?.position || 0,
        previous_90d_clicks: periods.previous?.clicks || 0, previous_90d_impressions: periods.previous?.impressions || 0,
        recent_click_share: ratio(periods.recent?.clicks || 0, result.recentTotals.clicks),
        recent_impression_share: ratio(periods.recent?.impressions || 0, result.recentTotals.impressions),
        manual_approval_required: 'TRUE',
      });
      const key = normalizeUrl(page, true);
      if (!pageGroupStats.has(key)) pageGroupStats.set(key, { ids: [], classes: [], urgencies: [], actions: [], strongest: [], evidence: [], businessScores: [] });
      const stats = pageGroupStats.get(key);
      stats.ids.push(groupId); stats.classes.push(result.classification); stats.urgencies.push(result.urgency); stats.actions.push(result.action); stats.evidence.push(result.evidenceCodes);
      stats.businessScores.push(business.score);
      if (page === result.strongest.page) stats.strongest.push(groupId);
    }

    const pairPages = (result.recentPages.length > 1 ? result.recentPages : group.pages).slice(0, PARAMETERS.pagePairCapPerQuery);
    for (let left = 0; left < pairPages.length; left += 1) {
      for (let right = left + 1; right < pairPages.length; right += 1) {
        const urls = [pairPages[left].page, pairPages[right].page].sort();
        const pairKey = urls.join('\u0000');
        if (!pairMap.has(pairKey)) pairMap.set(pairKey, { page_a: urls[0], page_b: urls[1], shared_query_count: 0, shared_impressions: 0, shared_clicks: 0, likely_count: 0, possible_count: 0, examples: [] });
        const pair = pairMap.get(pairKey);
        pair.shared_query_count += 1; pair.shared_impressions += result.recentTotals.impressions; pair.shared_clicks += result.recentTotals.clicks;
        if (result.classification === 'LIKELY_CANNIBALIZATION') pair.likely_count += 1;
        if (result.classification === 'POSSIBLE_CANNIBALIZATION') pair.possible_count += 1;
        pair.examples.push({ query: group.query, impressions: result.recentTotals.impressions });
      }
    }

    for (const [map, key] of [[practiceMap, practiceArea], [intentMap, intent]]) {
      if (!map.has(key)) map.set(key, { key, query_groups: 0, likely: 0, possible: 0, benign: 0, insufficient: 0, clicks: 0, impressions: 0, risk_exposure: 0, ctr_opportunity: 0, business_score_sum: 0, high_business_groups: 0 });
      const stat = map.get(key);
      stat.query_groups += 1; stat.clicks += result.recentTotals.clicks; stat.impressions += result.recentTotals.impressions;
      stat.risk_exposure += result.riskExposureImpressions; stat.ctr_opportunity += result.estimatedCtrOpportunity;
      stat.business_score_sum += business.score;
      if (business.score >= 65) stat.high_business_groups += 1;
      if (result.classification === 'LIKELY_CANNIBALIZATION') stat.likely += 1;
      else if (result.classification === 'POSSIBLE_CANNIBALIZATION') stat.possible += 1;
      else if (result.classification === 'BENIGN_MULTI_PAGE_VISIBILITY') stat.benign += 1;
      else stat.insufficient += 1;
    }
  }

  const pairRows = [...pairMap.values()].map((pair) => ({
    page_a: pair.page_a,
    page_b: pair.page_b,
    shared_query_count: pair.shared_query_count,
    shared_impressions: pair.shared_impressions,
    shared_clicks: pair.shared_clicks,
    likely_count: pair.likely_count,
    possible_count: pair.possible_count,
    page_a_type: inventoryMetadata(inventoryMap, pair.page_a).content_type,
    page_b_type: inventoryMetadata(inventoryMap, pair.page_b).content_type,
    page_a_title: inventoryMetadata(inventoryMap, pair.page_a).title,
    page_b_title: inventoryMetadata(inventoryMap, pair.page_b).title,
    metadata_similarity: metadataSimilarity(inventoryMetadata(inventoryMap, pair.page_a), inventoryMetadata(inventoryMap, pair.page_b)),
    example_queries: pair.examples.sort((a, b) => b.impressions - a.impressions).slice(0, 10).map((item) => item.query).join('|'),
    manual_review_required: 'TRUE',
  })).sort((left, right) => right.shared_impressions - left.shared_impressions || right.shared_query_count - left.shared_query_count);

  const pageControlMap = new Map(pageControls.map((row) => [normalizeUrl(row.page, true), row]));
  const recentPageTotalsNormalized = aggregateMetricsByNormalizedUrl(context.recentPageTotals);
  const previousPageTotalsNormalized = aggregateMetricsByNormalizedUrl(context.previousPageTotals);
  const recent28PageTotalsNormalized = aggregateMetricsByNormalizedUrl(context.recent28PageTotals);
  const previous28PageTotalsNormalized = aggregateMetricsByNormalizedUrl(context.previous28PageTotals);
  const migrationMap = new Map(inventoryRows.map((row) => [normalizeUrl(row.url, true), { ...row }]));
  for (const row of pageControls) {
    const key = normalizeUrl(row.page, true);
    if (!migrationMap.has(key)) migrationMap.set(key, {
      url: row.page, normalized_url: key, post_id: '', content_type: 'GSC_ONLY', language: '', title: '', h1: '', slug: '', parent: '', taxonomies: '', wp_status: '', http_status: '', http_status_source: '', indexability: '', robots_directives: '', canonical: '', sitemap_presence: 'FALSE', sitemap_source: '', published_date: '', modified_date: '', word_count: '', internal_inlinks: '', internal_outlinks: '', source: 'GSC_CONTROL_PAGE',
    });
  }
  const migrationRows = [];
  for (const [key, metadata] of migrationMap) {
    const full = pageControlMap.get(key) || {};
    const recent = metricValue(recentPageTotalsNormalized.get(key));
    const previous = metricValue(previousPageTotalsNormalized.get(key));
    const recent28 = metricValue(recent28PageTotalsNormalized.get(key));
    const previous28 = metricValue(previous28PageTotalsNormalized.get(key));
    const stats = pageGroupStats.get(key) || { ids: [], classes: [], urgencies: [], actions: [], strongest: [], evidence: [], businessScores: [] };
    const topUrgency = stats.urgencies.sort((a, b) => urgencyRank(a) - urgencyRank(b))[0] || 'P3_MONITOR';
    const likely = stats.classes.includes('LIKELY_CANNIBALIZATION');
    const possible = stats.classes.includes('POSSIBLE_CANNIBALIZATION');
    const protectedFlag = number(full.clicks) > 0 || stats.strongest.length > 0 || recent.impressions >= PARAMETERS.protectedImpressions;
    const strongestOwner = stats.strongest.length > 0;
    const maxBusinessPotential = stats.businessScores.length ? Math.max(...stats.businessScores) : 0;
    const lowValueSignals = number(full.clicks) === 0 && recent.impressions < 3 && number(metadata.internal_inlinks) === 0 && maxBusinessPotential < 50;
    let action = 'INVESTIGATE';
    if (likely && strongestOwner) action = 'KEEP_OWNER_STRENGTHEN';
    else if (likely && !strongestOwner && lowValueSignals) action = 'DELETE_410_DIRECT_CANDIDATE';
    else if (likely && !strongestOwner) action = 'MERGE_CONTENT_THEN_410_CANDIDATE';
    else if (possible) action = stats.actions.includes('DIFFERENTIATE_INTENT') ? 'DIFFERENTIATE_INTENT' : 'INTERNAL_LINK_REBALANCE';
    else if (String(metadata.indexability).toLowerCase() === 'noindex') action = 'NOINDEX_REVIEW';
    else if (protectedFlag) action = 'KEEP_PROTECT';
    else if (recent.impressions > 0) action = 'KEEP_REFRESH';
    else if (lowValueSignals) action = 'DELETE_410_LOW_VALUE_REVIEW';
    migrationRows.push({
      ...metadata,
      full_clicks: number(full.clicks), full_impressions: number(full.impressions), full_ctr: number(full.ctr), full_position: number(full.position),
      recent_90d_clicks: recent.clicks, recent_90d_impressions: recent.impressions, recent_90d_ctr: recent.ctr, recent_90d_position: recent.position,
      previous_90d_clicks: previous.clicks, previous_90d_impressions: previous.impressions,
      recent_28d_clicks: recent28.clicks, recent_28d_impressions: recent28.impressions,
      previous_28d_clicks: previous28.clicks, previous_28d_impressions: previous28.impressions,
      protected_url_flag: protectedFlag ? 'TRUE' : 'FALSE',
      max_business_potential_score: maxBusinessPotential,
      business_protection_flag: maxBusinessPotential >= 65 ? 'TRUE' : 'FALSE',
      cannibalization_group_count: stats.ids.length,
      likely_group_count: stats.classes.filter((value) => value === 'LIKELY_CANNIBALIZATION').length,
      possible_group_count: stats.classes.filter((value) => value === 'POSSIBLE_CANNIBALIZATION').length,
      cannibalization_group_ids: stats.ids.join('|'), strongest_group_ids: stats.strongest.join('|'),
      duplicate_suffix_pattern: suffixPattern(metadata.url, metadata.slug),
      migration_priority: topUrgency,
      proposed_action: action,
      action_basis: action.includes('410')
        ? (action.includes('DIRECT') ? 'אין קליקים מלאים, פחות מ-3 חשיפות ב-90 יום, אין קישורים פנימיים מדווחים, והעמוד אינו בעלים חזק בקבוצת קניבליזציה.' : 'העמוד מתחרה בעמוד בעלים חזק; יש להעביר מידע ייחודי לפני 410.')
        : strongestOwner ? 'העמוד הוא בעלים חזק לפחות בקבוצת שאילתה אחת.' : 'לא התקיימו כל תנאי הסף למחיקה.',
      pre_410_required_checks: action.includes('410') ? 'אימות מלוא התקופה; בדיקת המרות ולידים; קישורים חיצוניים ופנימיים; תוכן ייחודי; אינטנט עצמאי; הסרה מ-sitemap; עדכון כל קישור פנימי; גיבוי ואישור אנושי.' : '',
      expected_410_effect: action.includes('410') ? 'Google יסיר את ה-URL לאחר crawl; 410 ו-404 מטופלים כיום באופן דומה. אין הבטחה לשיפור דירוג, ויש למדוד את עמוד הבעלים אחרי 28, 56 ו-90 יום.' : '',
      evidence: [`GSC full clicks=${number(full.clicks)}, impressions=${number(full.impressions)}`, `recent90 impressions=${recent.impressions}`, stats.ids.length ? `groups=${stats.ids.join('|')}` : '', metadata.sitemap_presence === 'TRUE' ? 'in sitemap' : 'not in sitemap'].filter(Boolean).join('; '),
      confidence: likely ? 'HIGH' : possible ? 'MEDIUM' : protectedFlag ? 'MEDIUM' : 'LOW',
      manual_approval_required: 'TRUE',
    });
  }
  migrationRows.sort((left, right) => urgencyRank(left.migration_priority) - urgencyRank(right.migration_priority) || right.recent_90d_impressions - left.recent_90d_impressions || left.url.localeCompare(right.url, 'en'));

  const practiceRows = [...practiceMap.values()].map((row) => ({
    practice_area: row.key, query_groups: row.query_groups, likely_groups: row.likely, possible_groups: row.possible,
    benign_groups: row.benign, insufficient_groups: row.insufficient, recent_90d_clicks: row.clicks,
    recent_90d_impressions: row.impressions, recent_90d_ctr: ratio(row.clicks, row.impressions),
    risk_exposure_impressions: row.risk_exposure, estimated_ctr_opportunity_clicks: row.ctr_opportunity,
    average_business_potential_score: ratio(row.business_score_sum, row.query_groups), high_business_query_groups: row.high_business_groups,
  })).sort((left, right) => right.recent_90d_impressions - left.recent_90d_impressions);
  const intentRows = [...intentMap.values()].map((row) => ({
    query_intent: row.key, query_groups: row.query_groups, likely_groups: row.likely, possible_groups: row.possible,
    benign_groups: row.benign, insufficient_groups: row.insufficient, recent_90d_clicks: row.clicks,
    recent_90d_impressions: row.impressions, recent_90d_ctr: ratio(row.clicks, row.impressions),
    risk_exposure_impressions: row.risk_exposure, estimated_ctr_opportunity_clicks: row.ctr_opportunity,
    average_business_potential_score: ratio(row.business_score_sum, row.query_groups), high_business_query_groups: row.high_business_groups,
  })).sort((left, right) => right.recent_90d_impressions - left.recent_90d_impressions);

  const monthlyRows = buildMonthlyTrends(dateControls);
  const changePoints = buildChangePoints(dateControls);
  const pageDeltaRows = buildDeltaRows(context.recentPageTotals, context.previousPageTotals, 'page');
  const queryDeltaRows = buildDeltaRows(context.recentQueryTotals, context.previousQueryTotals, 'query');
  const duplicateTitleRows = buildDuplicateMetadata(inventoryRows, 'title');
  const duplicateH1Rows = buildDuplicateMetadata(inventoryRows, 'h1');
  const playbook = playbookRows();

  const outputs = {
    summary: path.join(analysisDir, 'justice-cannibalization-summary.csv'),
    detail: path.join(analysisDir, 'justice-cannibalization-detail.csv'),
    pairs: path.join(analysisDir, 'justice-page-pair-overlap.csv'),
    migration: path.join(analysisDir, 'justice-page-migration-inventory.csv'),
    practice: path.join(analysisDir, 'justice-practice-area-summary.csv'),
    intent: path.join(analysisDir, 'justice-query-intent-summary.csv'),
    monthly: path.join(analysisDir, 'justice-site-trend-monthly.csv'),
    changes: path.join(analysisDir, 'justice-site-change-points.csv'),
    pageDelta: path.join(analysisDir, 'justice-page-change-90d.csv'),
    queryDelta: path.join(analysisDir, 'justice-query-change-90d.csv'),
    duplicateTitles: path.join(analysisDir, 'justice-duplicate-title-groups.csv'),
    duplicateH1: path.join(analysisDir, 'justice-duplicate-h1-groups.csv'),
    playbook: path.join(analysisDir, 'justice-remediation-playbook.csv'),
    summaryJson: path.join(analysisDir, 'justice-analysis-summary.json'),
  };
  await writeCsv(outputs.summary, Object.keys(summaryRows[0] || {}), summaryRows);
  await writeCsv(outputs.detail, Object.keys(detailRows[0] || {}), detailRows);
  await writeCsv(outputs.pairs, Object.keys(pairRows[0] || {}), pairRows);
  await writeCsv(outputs.migration, Object.keys(migrationRows[0] || {}), migrationRows);
  await writeCsv(outputs.practice, Object.keys(practiceRows[0] || {}), practiceRows);
  await writeCsv(outputs.intent, Object.keys(intentRows[0] || {}), intentRows);
  await writeCsv(outputs.monthly, Object.keys(monthlyRows[0] || {}), monthlyRows);
  await writeCsv(outputs.changes, Object.keys(changePoints[0] || { date: '', direction: '' }), changePoints);
  await writeCsv(outputs.pageDelta, Object.keys(pageDeltaRows[0] || {}), pageDeltaRows);
  await writeCsv(outputs.queryDelta, Object.keys(queryDeltaRows[0] || {}), queryDeltaRows);
  await writeCsv(outputs.duplicateTitles, Object.keys(duplicateTitleRows[0] || { duplicate_group_id: '', field: '' }), duplicateTitleRows);
  await writeCsv(outputs.duplicateH1, Object.keys(duplicateH1Rows[0] || { duplicate_group_id: '', field: '' }), duplicateH1Rows);
  await writeCsv(outputs.playbook, Object.keys(playbook[0]), playbook);

  const total = totalControls[0] || {};
  const summary = {
    script: 'gsc-justice-deep-analysis.js', scriptVersion: SCRIPT_VERSION, generatedAt: new Date().toISOString(),
    property: PROPERTY, permissionLevel: manifest.property.permissionLevel, readonlyScope: manifest.readonlyScope,
    requestedRange: manifest.availability.requestedRange, finalRange: manifest.availability.returnedFinalRange,
    partialDates: manifest.availability.partialDates, windows, parameters: PARAMETERS,
    propertyTotals: { clicks: number(total.clicks), impressions: number(total.impressions), ctr: number(total.ctr), position: number(total.position) },
    inputs: { directRows: manifest.rowCounts.directApiRows, dailyRows: dailyRowsProcessed, reconciledRows: reconciledRows.length, controlQueries: queryControls.length, controlPages: pageControls.length, inventoryUrls: inventoryRows.length },
    outputs: { multiUrlQueries: summaryRows.length, detailRows: detailRows.length, pagePairs: pairRows.length, migrationRows: migrationRows.length, practiceAreas: practiceRows.length, intents: intentRows.length, duplicateTitleGroups: duplicateTitleRows.length, duplicateH1Groups: duplicateH1Rows.length },
    classifications: classificationCounts,
    urgencies: Object.fromEntries(['P0_7_DAYS', 'P1_14_DAYS', 'P2_30_DAYS', 'P3_MONITOR'].map((value) => [value, summaryRows.filter((row) => row.urgency === value).length])),
    actions: Object.fromEntries([...new Set(summaryRows.map((row) => row.recommended_action))].map((value) => [value, summaryRows.filter((row) => row.recommended_action === value).length])),
    ctrBenchmarks: context.ctrBenchmarks,
    inventorySummary,
    reconciliation: manifest.reconciliation,
    limitations: [
      'Search Analytics returns top rows and can omit anonymized queries.',
      'Estimated CTR opportunity uses this site’s observed recent CTR by position bucket; it is not proven cannibalization loss.',
      'Classification and risk score are transparent triage aids, not automatic instructions.',
      'HTTP status for sitemap/REST inventory rows can be inferred rather than individually crawled.',
    ],
    noLiveChanges: true,
  };
  await writeJson(outputs.summaryJson, summary);
  const hashes = {};
  for (const file of Object.values(outputs)) hashes[path.relative(runDir, file)] = await sha256(file);
  await writeJson(path.join(analysisDir, 'justice-analysis-sha256.json'), hashes);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.stack || error.message}\n`);
  process.exitCode = 1;
});
