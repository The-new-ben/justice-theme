#!/usr/bin/env node

const DEFAULT_TIMEOUT_MS = 20000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function parseArgs(argv) {
  const args = {
    url: '',
    expectedUrl: '',
    required: [],
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if ((arg === '--url' || arg === '-u') && argv[index + 1]) {
      args.url = argv[index + 1];
      index += 1;
      continue;
    }

    if ((arg === '--expected' || arg === '--expected-url') && argv[index + 1]) {
      args.expectedUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if ((arg === '--require' || arg === '--required') && argv[index + 1]) {
      args.required.push(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--timeout-ms' && argv[index + 1]) {
      args.timeoutMs = Number.parseInt(argv[index + 1], 10) || DEFAULT_TIMEOUT_MS;
      index += 1;
    }
  }

  if (!args.url) {
    throw new Error('Usage: node scripts/check-url.mjs --url <url> [--expected <canonical-url>] [--require <text>]');
  }

  return args;
}

function cleanText(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function firstMatch(body, pattern) {
  const match = body.match(pattern);
  return match ? decodeEntities(cleanText(match[1])) : '';
}

function attrMatch(body, pattern) {
  const match = body.match(pattern);
  return match ? decodeEntities(match[1].trim()) : '';
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Jus-Tice-URL-Route-Checker/1.0',
        Accept: 'text/html,*/*',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRaw(url, timeoutMs) {
  const response = await fetchWithTimeout(
    url,
    {
      redirect: 'manual',
    },
    timeoutMs
  );

  return {
    status: response.status,
    location: response.headers.get('location') || '',
  };
}

async function fetchFollowingRedirects(url, timeoutMs) {
  const chain = [];
  let currentUrl = url;
  let response = null;

  for (let hop = 0; hop < 10; hop += 1) {
    response = await fetchWithTimeout(
      currentUrl,
      {
        redirect: 'manual',
      },
      timeoutMs
    );

    if (!REDIRECT_STATUSES.has(response.status)) {
      break;
    }

    const location = response.headers.get('location') || '';
    if (!location) {
      break;
    }

    const nextUrl = new URL(location, currentUrl).toString();
    chain.push({
      from: currentUrl,
      to: nextUrl,
      status: response.status,
    });
    currentUrl = nextUrl;
  }

  const body = response ? await response.text() : '';

  return {
    status: response ? response.status : 0,
    finalUrl: currentUrl,
    redirectChain: chain,
    body,
  };
}

function analyzeHtml(body, required) {
  const canonical = attrMatch(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
  const robots = attrMatch(body, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  const title = firstMatch(body, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = firstMatch(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const missingRequired = required.filter((token) => !body.includes(token));

  return {
    title,
    h1,
    canonical,
    robots: robots || '-',
    bodyLength: body.length,
    missingRequired,
    signals: {
      hasNoindex: /noindex/i.test(robots),
      hasWhatsApp: /wa\.me\/972525101555|api\.whatsapp\.com/i.test(body),
      hasPhone: body.includes('0525101555') || body.includes('052-510-1555'),
      hasLeadForm: body.includes('justice_submit_lead') || body.includes('ask-lawyer'),
      hasHeaderNavigation: body.includes('site-header') || body.includes('primary-navigation'),
      hasFooter: body.includes('site-footer') || body.includes('footer-trust'),
    },
  };
}

function classify({ raw, followed, analysis, expectedUrl }) {
  if (raw.status >= 400 || followed.status >= 400) {
    return 'BROKEN_STATUS';
  }

  if (analysis.signals.hasNoindex) {
    return 'INDEXING_RISK';
  }

  if (expectedUrl && analysis.canonical && analysis.canonical !== expectedUrl) {
    return 'CANONICAL_MISMATCH';
  }

  if (expectedUrl && followed.finalUrl !== expectedUrl && analysis.canonical === expectedUrl) {
    return 'LEGACY_URL_CANONICAL_OK';
  }

  if (followed.redirectChain.length > 1) {
    return 'REDIRECT_CHAIN';
  }

  if (analysis.missingRequired.length > 0 || !analysis.title || !analysis.h1 || followed.body.length < 1000) {
    return 'MISSING_CONTENT';
  }

  if (!analysis.signals.hasWhatsApp && !analysis.signals.hasLeadForm) {
    return 'REVENUE_RISK';
  }

  return 'LIVE_OK';
}

const args = parseArgs(process.argv.slice(2));
const raw = await fetchRaw(args.url, args.timeoutMs);
const followed = await fetchFollowingRedirects(args.url, args.timeoutMs);
const analysis = analyzeHtml(followed.body, args.required);
const result = {
  checkedAt: new Date().toISOString(),
  requestedUrl: args.url,
  expectedUrl: args.expectedUrl || '',
  raw,
  followed: {
    status: followed.status,
    finalUrl: followed.finalUrl,
    redirectChain: followed.redirectChain,
  },
  analysis,
};

result.classification = classify({
  raw,
  followed,
  analysis,
  expectedUrl: args.expectedUrl,
});

result.pass = !['BROKEN_STATUS', 'CANONICAL_MISMATCH', 'MISSING_CONTENT', 'INDEXING_RISK'].includes(result.classification);
result.note = 'Read-only live URL check. It does not change redirects, canonicals, noindex, sitemap, CMS content, database rows, forms, leads, or payments.';

console.log(JSON.stringify(result, null, 2));

if (!result.pass) {
  process.exit(1);
}
