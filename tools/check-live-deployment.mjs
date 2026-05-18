const BASE_URL = 'https://jus-tice.co.il';

const analyticsTokens = ['lawyer_plan_click', 'generate_lead'];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

async function fetchText(pathOrUrl) {
  const response = await fetch(pathOrUrl.startsWith('http') ? pathOrUrl : absoluteUrl(pathOrUrl), {
    cache: 'no-store',
    redirect: 'follow',
    headers: {
      'Cache-Control': 'no-cache',
      'User-Agent': 'Jus-Tice-Deployment-Checker/1.0',
    },
  });

  return {
    response,
    body: await response.text(),
  };
}

function scriptSources(html) {
  return [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((match) => match[1]);
}

async function runAssetCheck() {
  const { response, body } = await fetchText('/wp-content/themes/justice-theme/assets/js/analytics-events.js');
  const missing = analyticsTokens.filter((token) => !body.includes(token));
  const ok = response.status === 200 && missing.length === 0;

  return {
    status: ok ? 'PASS' : 'BLOCKED',
    http: response.status,
    name: 'Analytics asset from growth batch',
    missing: missing.join('|') || '-',
    finalUrl: response.url,
  };
}

async function runHomepageMarkerCheck(homepage) {
  const missing = ['justice-deployment-marker', 'justice-theme-version'].filter((token) => !homepage.body.includes(token));
  const ok = homepage.response.status === 200 && missing.length === 0;

  return {
    status: ok ? 'PASS' : 'BLOCKED',
    http: homepage.response.status,
    name: 'Homepage deployment marker present',
    missing: missing.join('|') || '-',
    finalUrl: homepage.response.url,
  };
}

async function runHomepageAnalyticsCheck(homepage) {
  const sources = scriptSources(homepage.body);
  const directHit = homepage.body.includes('analytics-events.js');
  const candidateSources = sources.filter((src) => (
    src.includes('/wp-content/cache/autoptimize/js/')
    || src.includes('/wp-content/themes/justice-theme/assets/js/')
  ));

  const checked = [];
  let hitSource = '';

  for (const src of candidateSources) {
    try {
      const { body } = await fetchText(src);
      checked.push(src);
      if (analyticsTokens.every((token) => body.includes(token))) {
        hitSource = src;
        break;
      }
    } catch (error) {
      checked.push(`${src} (${error instanceof Error ? error.message : String(error)})`);
    }
  }

  const ok = homepage.response.status === 200 && (directHit || hitSource);

  return {
    status: ok ? 'PASS' : 'BLOCKED',
    http: homepage.response.status,
    name: directHit ? 'Homepage enqueues analytics asset directly' : 'Homepage serves analytics via optimized script',
    missing: ok ? '-' : 'analytics-events.js|optimized analytics tokens',
    finalUrl: directHit ? homepage.response.url : (hitSource || checked.find((src) => !src.includes('(')) || homepage.response.url),
  };
}

const results = [];

try {
  const homepage = await fetchText('/');
  results.push(await runAssetCheck());
  results.push(await runHomepageAnalyticsCheck(homepage));
  results.push(await runHomepageMarkerCheck(homepage));
} catch (error) {
  results.push({
    status: 'BLOCKED',
    http: 0,
    name: 'Deployment checker failed',
    missing: 'deployment check',
    finalUrl: error instanceof Error ? error.message : String(error),
  });
}

console.table(results);

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
