const fs = require('fs');
const path = require('path');
const REPORTS = path.join(__dirname, '..', '..', 'reports', 'gsc');

function parseCsv(file) {
  const content = fs.readFileSync(path.join(REPORTS, file), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const c of line) { if (c === '"') { inQ = !inQ; } else if (c === ',' && !inQ) { cols.push(cur); cur = ''; } else { cur += c; } }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i] || '');
    return obj;
  });
}

const pages = parseCsv('performance-pages.csv');
const cannib = parseCsv('cannibalization-report.csv');

// Family law deep dive
console.log('=== FAMILY LAW CLUSTER DEEP DIVE ===');
const familyKeywords = ['גירושין','משמורת','מזונות','משפחה','ירושה','צוואה','divorce','custody','family','inheritance','wills','prenuptial','marriage','כתובה','הסכם ממון','אלימות','prenup','child-custody','property-division'];
const familyPages = pages.filter(p => {
  const url = decodeURIComponent(p.page || '').toLowerCase();
  return familyKeywords.some(k => url.includes(k));
});
familyPages.sort((a, b) => (+b.clicks || 0) - (+a.clicks || 0));
console.log('Total family pages:', familyPages.length);
console.log('Total clicks:', familyPages.reduce((s, r) => s + (+r.clicks || 0), 0));
console.log('Total impressions:', familyPages.reduce((s, r) => s + (+r.impressions || 0), 0));
familyPages.forEach((r, i) => {
  console.log(`${i+1}. ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 90)}`);
});

// Family cannibalization
console.log('\n=== FAMILY LAW CANNIBALIZATION ===');
const familyCannib = cannib.filter(c => {
  const q = (c.query || '').toLowerCase();
  return ['גירושין','משמורת','מזונות','הסכם ממון','כתובה','צוואה','ירושה','divorce','custody','prenup'].some(k => q.includes(k));
});
familyCannib.sort((a, b) => (+b.total_impressions || 0) - (+a.total_impressions || 0));
console.log('Family cannibalized queries:', familyCannib.length);
familyCannib.forEach((r, i) => {
  console.log(`${i+1}. [${r.page_count} pages] "${r.query}" | ${r.total_clicks} clicks | ${r.total_impressions} imp`);
  if (r.pages) r.pages.split(' | ').forEach(u => console.log(`    → ${decodeURIComponent(u).substring(0, 80)}`));
});

// Criminal law deep dive
console.log('\n=== CRIMINAL LAW CLUSTER DEEP DIVE ===');
const crimKeywords = ['פלילי','מעצר','עבירות','סמים','גניבה','criminal','shoplifting','lahav','police','משטרה','תעבורה','speeding','driving','traffic'];
const crimPages = pages.filter(p => {
  const url = decodeURIComponent(p.page || '').toLowerCase();
  return crimKeywords.some(k => url.includes(k));
});
crimPages.sort((a, b) => (+b.clicks || 0) - (+a.clicks || 0));
console.log('Total criminal pages:', crimPages.length);
console.log('Total clicks:', crimPages.reduce((s, r) => s + (+r.clicks || 0), 0));
console.log('Total impressions:', crimPages.reduce((s, r) => s + (+r.impressions || 0), 0));
crimPages.slice(0, 20).forEach((r, i) => {
  console.log(`${i+1}. ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 90)}`);
});
