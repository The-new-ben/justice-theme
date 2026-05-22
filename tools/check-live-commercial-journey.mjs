const BASE_URL = 'https://jus-tice.co.il';

const checks = [
  {
    name: 'Public lawyer plans',
    path: '/lawyer-plans/',
    required: [
      '₪349',
      '₪749',
      '₪1,490',
      '₪2,490',
      'payment_path=manual_invoice',
      'בקשת חשבונית והפעלה ידנית',
    ],
  },
  {
    name: 'Manual invoice registration',
    path: '/lawyer-registration/?plan_interest=pro&payment_path=manual_invoice',
    required: [
      'data-selected-plan="pro"',
      'name="payment_path" value="manual_invoice"',
      'בקשת המסלול תטופל ידנית',
      'lawyer_full_name',
      'justice_lawyer_registration',
    ],
  },
  {
    name: 'Default lawyer registration',
    path: '/lawyer-registration/',
    required: [
      'lawyer_full_name',
      'plan_interest',
      'justice_lawyer_registration',
    ],
  },
];

function absoluteUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function normalize(body) {
  return body.replace(/\s+/g, ' ').trim();
}

async function checkPublicPath(check) {
  const url = absoluteUrl(check.path);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Jus-Tice-Commercial-Journey-Checker/1.0',
      Accept: 'text/html,*/*',
      'Cache-Control': 'no-cache',
    },
  });

  const body = await response.text();
  const normalized = normalize(body);
  const missing = check.required.filter((token) => !body.includes(token) && !normalized.includes(token));

  return {
    name: check.name,
    status: response.ok && missing.length === 0 ? 'PASS' : 'REVIEW',
    http: response.status,
    finalUrl: response.url,
    bytes: body.length,
    missing: missing.join('|') || '-',
  };
}

const results = [];

for (const check of checks) {
  try {
    results.push(await checkPublicPath(check));
  } catch (error) {
    results.push({
      name: check.name,
      status: 'REVIEW',
      http: 0,
      finalUrl: absoluteUrl(check.path),
      bytes: 0,
      missing: check.required.join('|'),
      warning: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results);

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
