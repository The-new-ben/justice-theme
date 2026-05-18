const base = process.argv[2] || 'https://jus-tice.co.il';

const paths = [
  '/',
  '/favicon.ico',
  '/favicon.png',
  '/guide-complet-du-casino-en-ligne/',
  '/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/',
];

const googlebot = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
const stamp = Date.now();

function withCacheBust(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}jt_verify=${stamp}`;
}

async function fetchText(url) {
  const response = await fetch(withCacheBust(url), {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': googlebot,
    },
  });
  const text = await response.text();
  return { response, text };
}

function extractIconTags(html) {
  return [...html.matchAll(/<link\b[^>]*\brel=["'][^"']*(?:icon|apple-touch-icon|mask-icon)[^"']*["'][^>]*>/gi)].map((match) => match[0]);
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

const homepage = await fetchText(`${base}/`);
const markerOk = homepage.text.includes('2026-05-18-brand-favicon-spam-guard-v1');
const iconTags = extractIconTags(homepage.text);
const brandIcons = iconTags.filter((tag) => tag.includes('data-justice-theme="brand-icon"'));
const oldJIconLeak = homepage.text.includes('favicon-gen.png') || homepage.text.includes('cropped-jus-tice-ai-2025');

console.log(`homepage=${homepage.response.status}`);
console.log(`marker=${markerOk ? 'ok' : 'missing'}`);
console.log(`icon_tags=${iconTags.length}`);
console.log(`brand_icon_tags=${brandIcons.length}`);
console.log(`old_j_icon_leak=${oldJIconLeak ? 'yes' : 'no'}`);

if (homepage.response.status !== 200) fail('homepage did not return 200');
if (!markerOk) fail('deployment marker missing');
if (brandIcons.length < 5) fail('canonical Justice brand icon tags missing');
if (oldJIconLeak) fail('old J favicon source still appears in homepage head');

for (const path of paths.slice(1, 3)) {
  const response = await fetch(withCacheBust(`${base}${path}`), {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': googlebot,
    },
  });
  console.log(`${path}=${response.status} ${response.headers.get('content-type') || ''}`);
  if (response.status !== 200) {
    console.log(`WARN: ${path} is not served from the web root; Google can still use the homepage rel=icon tags.`);
  }
}

for (const path of paths.slice(3)) {
  const response = await fetch(withCacheBust(`${base}${path}`), {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': googlebot,
    },
  });
  console.log(`${path}=${response.status} x-robots=${response.headers.get('x-robots-tag') || ''}`);
  if (response.status !== 410) fail(`${path} did not return 410`);
}
