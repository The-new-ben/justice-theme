const BASE_URL = 'https://jus-tice.co.il';

const checks = [
  {
    journey: 'user',
    name: 'Homepage lead path',
    url: '/',
    expect: ['#ask-lawyer', '/lawyers/', 'canonical'],
  },
  {
    journey: 'user',
    name: 'Lawyer directory',
    url: '/lawyers/',
    expect: ['canonical', 'lawyer'],
  },
  {
    journey: 'user',
    name: 'Sample article content path',
    url: '/find-lawyer-how-to-find-good-attorney/',
    expect: ['canonical', 'article'],
  },
  {
    journey: 'lawyer',
    name: 'Lawyer registration',
    url: '/lawyer-registration/',
    expect: ['lawyer', 'form'],
  },
  {
    journey: 'lawyer',
    name: 'Lawyer registration with plan intent',
    url: '/lawyer-registration/?plan_interest=pro',
    expect: ['plan_interest', 'form'],
  },
  {
    journey: 'googlebot',
    name: 'Sitemap index',
    url: '/sitemap_index.xml',
    expect: ['<loc>', 'https://jus-tice.co.il'],
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
  },
  {
    journey: 'googlebot',
    name: 'Robots',
    url: '/robots.txt',
    expect: ['Sitemap'],
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    allowEmptyWarning: true,
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalizeBody(body) {
  return body.replace(/\s+/g, ' ').trim();
}

async function runCheck(check) {
  const url = absoluteUrl(check.url);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': check.userAgent || 'Jus-Tice-Journey-Checker/1.0',
      Accept: '*/*',
    },
  });

  const body = await response.text();
  const normalized = normalizeBody(body);
  const missing = check.expect.filter((token) => !body.includes(token) && !normalized.toLowerCase().includes(token.toLowerCase()));
  const emptyWarning = check.allowEmptyWarning && normalized.length === 0;
  const ok = response.ok && missing.length === 0 && !emptyWarning;

  return {
    journey: check.journey,
    name: check.name,
    url,
    finalUrl: response.url,
    status: response.status,
    bytes: body.length,
    ok,
    missing,
    warning: emptyWarning ? 'empty_body' : '',
  };
}

const results = [];

for (const check of checks) {
  try {
    results.push(await runCheck(check));
  } catch (error) {
    results.push({
      journey: check.journey,
      name: check.name,
      url: absoluteUrl(check.url),
      finalUrl: '',
      status: 0,
      bytes: 0,
      ok: false,
      missing: check.expect,
      warning: error instanceof Error ? error.message : String(error),
    });
  }
}

const rows = results.map((result) => ({
  journey: result.journey,
  status: result.ok ? 'PASS' : 'REVIEW',
  http: result.status,
  bytes: result.bytes,
  name: result.name,
  missing: result.missing.join('|') || '-',
  warning: result.warning || '-',
  finalUrl: result.finalUrl,
}));

console.table(rows);

const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  process.exitCode = 1;
}
