const BASE_URL = 'https://jus-tice.co.il';

const routes = [
  {
    name: 'About trust page',
    path: '/about/',
    h1: 'אודות Jus-Tice',
    required: ['אודות Jus-Tice', '/contact/', '/editorial-policy/'],
  },
  {
    name: 'Contact conversion page',
    path: '/contact/',
    h1: 'יצירת קשר',
    required: ['יצירת קשר', '#ask-lawyer', '0525101555', 'info@jus-tice.co.il'],
  },
  {
    name: 'Editorial policy E-E-A-T page',
    path: '/editorial-policy/',
    h1: 'מדיניות עריכה ובדיקת תוכן',
    required: ['מדיניות עריכה', '/about/', '/contact/'],
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function textFromMatch(body, pattern) {
  const match = body.match(pattern);
  return match ? match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

async function checkRoute(route) {
  const url = absoluteUrl(route.path);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
      Accept: 'text/html,*/*',
      'Cache-Control': 'no-cache',
    },
  });

  const body = await response.text();
  const canonical = textFromMatch(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  const robots = textFromMatch(body, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i);
  const h1 = textFromMatch(body, /<h1[^>]*>(.*?)<\/h1>/i);
  const missing = route.required.filter((token) => !body.includes(token));
  const expectedCanonical = absoluteUrl(route.path);
  const ok = response.status === 200 &&
    response.url === expectedCanonical &&
    canonical === expectedCanonical &&
    !/noindex/i.test(robots) &&
    h1 === route.h1 &&
    missing.length === 0;

  return {
    route: route.path,
    name: route.name,
    status: ok ? 'PASS' : 'REVIEW',
    http: response.status,
    finalUrl: response.url,
    canonical,
    robots: robots || '-',
    h1,
    missing: missing.join('|') || '-',
    bytes: body.length,
  };
}

const results = [];

for (const route of routes) {
  try {
    results.push(await checkRoute(route));
  } catch (error) {
    results.push({
      route: route.path,
      name: route.name,
      status: 'REVIEW',
      http: 0,
      finalUrl: '',
      canonical: '',
      robots: '',
      h1: '',
      missing: route.required.join('|'),
      bytes: 0,
      warning: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results);

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
