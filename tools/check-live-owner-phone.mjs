const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const OWNER_PHONE = '0525101555';
const OWNER_WHATSAPP = '972525101555';
const LEGACY_NUMBERS = ['03-6161535', '036161535', '0544705733', '054-470-5733'];

async function fetchText(path) {
  const response = await fetch(new URL(path, BASE_URL), {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Jus-Tice-Owner-Phone-Checker/1.0',
      Accept: 'text/html,*/*',
    },
  });
  return {
    path,
    status: response.status,
    finalUrl: response.url,
    body: await response.text(),
  };
}

function normalizeDigits(value) {
  return value.replace(/[^0-9+]/g, '');
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
const normalizedHome = normalizeDigits(homepage.body);

expect(homepage.status === 200, `Homepage returned 200 (got ${homepage.status})`);
expect(homepage.body.includes(OWNER_PHONE), `Homepage displays owner phone ${OWNER_PHONE}`);
expect(homepage.body.includes(`tel:${OWNER_PHONE}`), `Homepage has tel:${OWNER_PHONE} link`);
expect(homepage.body.includes(`wa.me/${OWNER_WHATSAPP}`), `Homepage WhatsApp points to ${OWNER_WHATSAPP}`);
expect(
  LEGACY_NUMBERS.every((legacyNumber) => !homepage.body.includes(legacyNumber) && !normalizedHome.includes(normalizeDigits(legacyNumber))),
  'Homepage no longer exposes legacy/mock phone numbers'
);
expect(
  /justice-deployment-marker["'][^>]*2026-05-18-real-estate-guide-route-v1/i.test(homepage.body),
  'Owner phone deployment marker is present'
);
