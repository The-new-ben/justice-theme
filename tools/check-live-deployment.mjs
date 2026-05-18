const BASE_URL = 'https://jus-tice.co.il';

const checks = [
  {
    name: 'Analytics asset from growth batch',
    url: '/wp-content/themes/justice-theme/assets/js/analytics-events.js',
    expectStatus: 200,
    expectBody: ['lawyer_plan_click', 'generate_lead'],
  },
  {
    name: 'Homepage enqueues analytics asset',
    url: '/',
    expectStatus: 200,
    expectBody: ['analytics-events.js'],
  },
  {
    name: 'Homepage deployment marker present',
    url: '/',
    expectStatus: 200,
    expectBody: ['justice-deployment-marker', 'justice-theme-version'],
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

async function runCheck(check) {
  const response = await fetch(absoluteUrl(check.url), {
    cache: 'no-store',
    redirect: 'follow',
    headers: {
      'Cache-Control': 'no-cache',
      'User-Agent': 'Jus-Tice-Deployment-Checker/1.0',
    },
  });

  const body = await response.text();
  const missing = check.expectBody.filter((token) => !body.includes(token));
  const ok = response.status === check.expectStatus && missing.length === 0;

  return {
    status: ok ? 'PASS' : 'BLOCKED',
    http: response.status,
    name: check.name,
    missing: missing.join('|') || '-',
    finalUrl: response.url,
  };
}

const results = [];

for (const check of checks) {
  try {
    results.push(await runCheck(check));
  } catch (error) {
    results.push({
      status: 'BLOCKED',
      http: 0,
      name: check.name,
      missing: check.expectBody.join('|'),
      finalUrl: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results);

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
