/**
 * Submit sitemap to Google Search Console via API
 * Also generates a proper XML sitemap file for reference
 */
const fs = require('fs');
const path = require('path');

// All live article URLs
const urls = [
  { loc: 'https://jus-tice.co.il/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://jus-tice.co.il/criminal-defense-attorney/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://jus-tice.co.il/criminal-record-check/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/criminal-record-deletion/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/criminal-lawyer-cost/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/drug-crimes/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/shoplifting-defense/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/lahav-433-guide/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/police-investigation-rights/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/murder-charges/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/drug-trafficking/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/drug-possession/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/driving-under-influence/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/plea-bargain/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/fraud-types/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/arrest-rights/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/tax-crimes/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/criminal-negligence/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://jus-tice.co.il/criminal-appeal/', priority: '0.8', changefreq: 'monthly' },
];

// Generate XML
const today = new Date().toISOString().split('T')[0];
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const u of urls) {
  xml += `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
}
xml += `</urlset>`;

// Save locally
const outPath = path.join(__dirname, 'sitemap-criminal-law.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Sitemap saved: ${outPath} (${urls.length} URLs)`);
console.log(xml);
