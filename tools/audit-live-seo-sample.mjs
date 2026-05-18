const BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';

const PATHS = [
  '/',
  '/robots.txt',
  '/sitemap_index.xml',
  '/wp-json/justice/v1/sitemap',
  '/articles/',
  '/lawyers/',
  '/family-law/',
  '/criminal-defense-attorney/',
  '/divorce-lawyer/',
  '/traffic-lawyer/',
  '/find-lawyer-how-to-find-good-attorney/',
  '/drug-possession/',
  '/drug-trafficking/',
  '/criminal-negligence/',
  '/court-judge',
  '/contact/',
  '/about/',
  '/definitely-not-a-real-url-audit/',
];

function extract(pattern, html) {
  const match = html.match(pattern);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

for (const path of PATHS) {
  const response = await fetch(new URL(path, BASE_URL), {
    redirect: 'follow',
    headers: {
      'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    },
  });
  const body = await response.text();
  const title = extract(/<title[^>]*>([\s\S]*?)<\/title>/i, body).slice(0, 140);
  const robots = extract(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i, body)
    || response.headers.get('x-robots-tag')
    || '';
  const canonical = extract(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i, body);
  const h1 = extract(/<h1[^>]*>([\s\S]*?)<\/h1>/i, body).replace(/<[^>]+>/g, '').slice(0, 140);
  const links = (body.match(/<a\s+[^>]*href=["'][^"']+["']/gi) || []).length;

  console.log(JSON.stringify({
    path,
    status: response.status,
    finalUrl: response.url,
    bytes: body.length,
    title,
    robots,
    canonical,
    h1,
    links,
  }));
}
