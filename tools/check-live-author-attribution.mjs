import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const GSC_CSV = process.env.JUSTICE_GSC_CSV || 'content-master/gsc/gsc-url-summary.csv';
const DEFAULT_LIMIT = Number.parseInt(process.argv[2] || '80', 10);
const OUTPUT = process.argv[3] || `reports/live-author-attribution-audit-${new Date().toISOString().slice(0, 10)}.csv`;
const GOOGLEBOT = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
const FETCH_TIMEOUT_MS = Number.parseInt(process.env.JUSTICE_AUDIT_TIMEOUT_MS || '15000', 10);
const BEN_PATTERNS = [
  /בן\s+בטש/i,
  /עו[״"׳']?ד\s+בן\s+בטש/i,
  /ben\s+batash/i,
];

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  cells.push(current);
  return cells;
}

function readGscRows() {
  const csv = fs.readFileSync(GSC_CSV, 'utf8').replace(/^\uFEFF/, '');
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift() || '');

  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function isLikelyCriminalUrl(row) {
  const haystack = [
    row.current_url,
    row.primary_cluster,
    row.top_queries,
    row.cannibalization_group,
  ].join(' ').toLowerCase();

  return row.primary_cluster === 'criminal-law'
    || /criminal|police|indictment|sex-crime|drug|arrest|felony|fraud|lahav|חקירה|פלילי|כתב|מעצר|מין|סמים|משטרה/.test(haystack);
}

function csvEscape(value) {
  const normalized = String(value ?? '').replace(/\r?\n/g, ' ').trim();
  return /[",\n]/.test(normalized) ? `"${normalized.replace(/"/g, '""')}"` : normalized;
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]).slice(0, 180) : '';
}

function extractH1(html) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripTags(match[1]).slice(0, 180) : '';
}

function findBenAttribution(html) {
  const text = stripTags(html);
  return BEN_PATTERNS.some((pattern) => pattern.test(text));
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function flattenSchemas(value) {
  const items = [];
  const queue = asArray(value);

  while (queue.length) {
    const item = queue.shift();
    if (!item || typeof item !== 'object') continue;
    items.push(item);
    if (item['@graph']) queue.push(...asArray(item['@graph']));
  }

  return items;
}

function extractArticleAuthorSignals(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const articleAuthors = [];
  const articleReviewers = [];
  const parseErrors = [];

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1].trim());
      for (const node of flattenSchemas(parsed)) {
        const types = asArray(node['@type']).map((type) => String(type).toLowerCase());
        if (!types.some((type) => ['article', 'newsarticle', 'blogposting'].includes(type))) {
          continue;
        }

        for (const author of asArray(node.author)) {
          if (typeof author === 'string') {
            articleAuthors.push(author);
          } else if (author && typeof author === 'object') {
            articleAuthors.push([author['@type'], author.name, author.url || author.sameAs || author['@id']].filter(Boolean).join(' | '));
          }
        }

        for (const reviewer of asArray(node.reviewedBy)) {
          if (typeof reviewer === 'string') {
            articleReviewers.push(reviewer);
          } else if (reviewer && typeof reviewer === 'object') {
            articleReviewers.push([reviewer['@type'], reviewer.name, reviewer.url || reviewer.sameAs || reviewer['@id']].filter(Boolean).join(' | '));
          }
        }
      }
    } catch (error) {
      parseErrors.push(error.message);
    }
  }

  return {
    articleAuthors: [...new Set(articleAuthors)],
    articleReviewers: [...new Set(articleReviewers)],
    parseErrors,
  };
}

async function fetchPage(url) {
	const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}jt_author_audit=${Date.now()}`, {
		redirect: 'follow',
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		headers: {
			'Cache-Control': 'no-cache',
			'Pragma': 'no-cache',
      'User-Agent': GOOGLEBOT,
    },
  });
  const html = await response.text();
  return { response, html };
}

const rows = readGscRows()
  .filter(isLikelyCriminalUrl)
  .sort((left, right) => Number.parseInt(right.gsc_impressions_export || '0', 10) - Number.parseInt(left.gsc_impressions_export || '0', 10))
  .slice(0, DEFAULT_LIMIT);

const auditRows = [];

for (const row of rows) {
  try {
    const { response, html } = await fetchPage(row.current_url);
    const schema = extractArticleAuthorSignals(html);
    const schemaAuthorText = schema.articleAuthors.join(' || ');
    const visibleBen = findBenAttribution(html);
    const schemaBen = BEN_PATTERNS.some((pattern) => pattern.test(schemaAuthorText));
    const recommendedAction = visibleBen || schemaBen
      ? 'REVIEW_AND_REPLACE_WITH_ORG_OR_VERIFIED_REVIEWER'
      : 'NO_BEN_ATTRIBUTION_DETECTED';

    auditRows.push({
      url: row.current_url,
      status: response.status,
      final_url: response.url,
      impressions: row.gsc_impressions_export,
      clicks: row.gsc_clicks_export,
      primary_cluster: row.primary_cluster,
      recommended_action: row.recommended_action,
      title: extractTitle(html),
      h1: extractH1(html),
      visible_ben_attribution: visibleBen ? 'YES' : 'NO',
      schema_ben_author: schemaBen ? 'YES' : 'NO',
      schema_article_authors: schemaAuthorText,
      schema_article_reviewers: schema.articleReviewers.join(' || '),
      schema_parse_errors: schema.parseErrors.length ? schema.parseErrors.join(' | ') : '',
      audit_action: recommendedAction,
    });
  } catch (error) {
    auditRows.push({
      url: row.current_url,
      status: 'FETCH_ERROR',
      final_url: '',
      impressions: row.gsc_impressions_export,
      clicks: row.gsc_clicks_export,
      primary_cluster: row.primary_cluster,
      recommended_action: row.recommended_action,
      title: '',
      h1: '',
      visible_ben_attribution: 'UNKNOWN',
      schema_ben_author: 'UNKNOWN',
      schema_article_authors: '',
      schema_article_reviewers: '',
      schema_parse_errors: error.message,
      audit_action: 'RETRY_FETCH',
    });
  }
}

const headers = [
  'url',
  'status',
  'final_url',
  'impressions',
  'clicks',
  'primary_cluster',
  'recommended_action',
  'title',
  'h1',
  'visible_ben_attribution',
  'schema_ben_author',
  'schema_article_authors',
  'schema_article_reviewers',
  'schema_parse_errors',
  'audit_action',
];

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(
  OUTPUT,
  `${headers.join(',')}\n${auditRows.map((auditRow) => headers.map((header) => csvEscape(auditRow[header])).join(',')).join('\n')}\n`,
  'utf8',
);

const summary = {
  output: OUTPUT,
  checked: auditRows.length,
  visibleBen: auditRows.filter((row) => row.visible_ben_attribution === 'YES').length,
  schemaBen: auditRows.filter((row) => row.schema_ben_author === 'YES').length,
  fetchErrors: auditRows.filter((row) => row.status === 'FETCH_ERROR').length,
};

console.log(JSON.stringify(summary, null, 2));
if (summary.fetchErrors > 0) {
  process.exitCode = 1;
}
