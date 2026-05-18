import dns from 'node:dns/promises';

const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const OWNER_PHONE = '0525101555';
const OWNER_WHATSAPP = '972525101555';
const LEGACY_NUMBERS = ['03-6161535', '036161535', '0544705733', '054-470-5733'];

const CHECKS = [
  { label: 'homepage', path: '/', expectHtml: true },
  { label: 'html sitemap', path: '/site-map/', expectHtml: true },
  { label: 'wordpress rest api', path: '/wp-json/' },
  { label: 'robots', path: '/robots.txt' },
  { label: 'xml sitemap', path: '/sitemap_index.xml' },
];

let failures = 0;

function normalizeDigits(value) {
  return value.replace(/[^0-9+]/g, '');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

async function fetchCheck(check) {
  const url = new URL(check.path, BASE_URL);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Jus-Tice-Reachability-Checker/1.0',
        Accept: check.expectHtml ? 'text/html,*/*' : '*/*',
      },
    });
    const body = await response.text();
    const durationMs = Date.now() - started;

    if (response.status >= 200 && response.status < 400) {
      pass(`${check.label} returned ${response.status} in ${durationMs}ms (${response.url})`);
    } else {
      fail(`${check.label} returned ${response.status} in ${durationMs}ms (${response.url})`);
    }

    return { check, response, body, durationMs };
  } catch (error) {
    fail(`${check.label} fetch failed: ${error.message}`);
    return { check, error, body: '' };
  }
}

try {
  const hostname = new URL(BASE_URL).hostname;
  const records = await dns.resolve4(hostname);
  if (records.length > 0) {
    pass(`DNS A records found for ${hostname}: ${records.join(', ')}`);
  } else {
    fail(`DNS returned no A records for ${hostname}`);
  }
} catch (error) {
  fail(`DNS lookup failed: ${error.message}`);
}

const results = [];
for (const check of CHECKS) {
  results.push(await fetchCheck(check));
}

const homepage = results.find((result) => result.check.label === 'homepage');
if (homepage?.body) {
  const normalizedHome = normalizeDigits(homepage.body);

  if (homepage.body.includes(OWNER_PHONE) || normalizedHome.includes(OWNER_PHONE)) {
    pass(`homepage exposes owner phone ${OWNER_PHONE}`);
  } else {
    fail(`homepage does not expose owner phone ${OWNER_PHONE}`);
  }

  if (homepage.body.includes(`wa.me/${OWNER_WHATSAPP}`)) {
    pass(`homepage WhatsApp points to ${OWNER_WHATSAPP}`);
  } else {
    fail(`homepage WhatsApp does not point to ${OWNER_WHATSAPP}`);
  }

  const legacyHits = LEGACY_NUMBERS.filter(
    (legacyNumber) => homepage.body.includes(legacyNumber) || normalizedHome.includes(normalizeDigits(legacyNumber))
  );
  if (legacyHits.length === 0) {
    pass('homepage does not expose legacy/mock phone numbers');
  } else {
    fail(`homepage exposes legacy/mock phone numbers: ${legacyHits.join(', ')}`);
  }

  if (/rel=["']canonical["'][^>]*href=["']https:\/\/jus-tice\.co\.il\//i.test(homepage.body)) {
    pass('homepage canonical points at jus-tice.co.il');
  } else {
    fail('homepage canonical was not found or does not point at jus-tice.co.il');
  }
}

if (failures > 0) {
  console.error(`Reachability check failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Reachability check passed.');
