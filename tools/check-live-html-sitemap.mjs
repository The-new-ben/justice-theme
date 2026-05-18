const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

async function fetchText(path, options = {}) {
  const response = await fetch(new URL(path, BASE_URL), {
    redirect: 'follow',
    headers: options.headers || {},
  });
  const body = await response.text();
  return {
    path,
    status: response.status,
    finalUrl: response.url,
    body,
  };
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function expect(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

const homepage = await fetchText('/');
const sitemap = await fetchText('/site-map/');
const googlebotSitemap = await fetchText('/site-map/', {
  headers: {
    'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
  },
});

expect(homepage.status === 200, `Homepage returned 200 (got ${homepage.status})`);
expect(
  /href=["'][^"']*\/site-map\/["']/i.test(homepage.body),
  'Homepage/footer links to /site-map/'
);

expect(sitemap.status === 200, `HTML sitemap returned 200 (got ${sitemap.status})`);
expect(
  sitemap.finalUrl.replace(/\/$/, '') === new URL('/site-map/', BASE_URL).href.replace(/\/$/, ''),
  `HTML sitemap canonical URL reached (${sitemap.finalUrl})`
);
expect(/<h1[^>]*>[\s\S]*?(מפת אתר|Site Map)/i.test(sitemap.body), 'HTML sitemap has a visible H1');
expect(/<a\s+[^>]*href=["'][^"']+["']/i.test(sitemap.body), 'HTML sitemap contains crawlable anchor links');
expect(/\/articles\//i.test(sitemap.body), 'HTML sitemap links to the article hub');
expect(/\/lawyers\//i.test(sitemap.body), 'HTML sitemap links to the lawyer directory');
expect(
  /justice-deployment-marker["'][^>]*2026-05-18-medical-malpractice-route-v1/i.test(sitemap.body),
  'Deployment marker is present on sitemap page'
);

expect(
  googlebotSitemap.status === 200 && /<a\s+[^>]*href=["'][^"']+["']/i.test(googlebotSitemap.body),
  `Googlebot fetch sees crawlable links (status ${googlebotSitemap.status})`
);
