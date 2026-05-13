const fs = require('fs');
const path = require('path');

const REPORTS = path.join(__dirname, '..', '..', 'reports', 'gsc');

function parseCsv(file) {
  const content = fs.readFileSync(path.join(REPORTS, file), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const cols = [];
    let cur = '', inQ = false;
    for (const c of line) {
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
      else { cur += c; }
    }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i] || '');
    return obj;
  });
}

// Load data
const pages = parseCsv('performance-pages.csv');
const queries = parseCsv('performance-queries.csv');
const combined = parseCsv('query-page-combined.csv');
const cannib = parseCsv('cannibalization-report.csv');

console.log('=== SITE HEALTH OVERVIEW ===');
console.log('Total pages with traffic:', pages.length);
console.log('Total queries:', queries.length);
console.log('Total clicks (12mo):', pages.reduce((s, r) => s + (+r.clicks || 0), 0));
console.log('Total impressions (12mo):', pages.reduce((s, r) => s + (+r.impressions || 0), 0));
console.log('Cannibalized queries:', cannib.length);

// Family law analysis
console.log('\n=== FAMILY LAW PAGES ===');
const familyKeywords = ['גירושין', 'משמורת', 'מזונות', 'משפחה', 'ירושה', 'צוואה', 'divorce', 'custody', 'family', 'inheritance', 'wills', 'prenuptial', 'marriage', 'כתובה', 'הסכם ממון', 'אלימות'];
const familyPages = pages.filter(p => {
  const url = decodeURIComponent(p.page || '').toLowerCase();
  return familyKeywords.some(k => url.includes(k));
});
familyPages.sort((a, b) => (+b.clicks || 0) - (+a.clicks || 0));
console.log('Family law pages found:', familyPages.length);
console.log('Family law clicks:', familyPages.reduce((s, r) => s + (+r.clicks || 0), 0));
console.log('Family law impressions:', familyPages.reduce((s, r) => s + (+r.impressions || 0), 0));
familyPages.slice(0, 15).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 80)}`);
});

// Criminal law analysis
console.log('\n=== CRIMINAL LAW PAGES ===');
const crimKeywords = ['פלילי', 'מעצר', 'עבירות', 'סמים', 'רצח', 'גניבה', 'criminal', 'shoplifting', 'lahav', 'police', 'משטרה'];
const crimPages = pages.filter(p => {
  const url = decodeURIComponent(p.page || '').toLowerCase();
  return crimKeywords.some(k => url.includes(k));
});
crimPages.sort((a, b) => (+b.clicks || 0) - (+a.clicks || 0));
console.log('Criminal law pages found:', crimPages.length);
console.log('Criminal law clicks:', crimPages.reduce((s, r) => s + (+r.clicks || 0), 0));
console.log('Criminal law impressions:', crimPages.reduce((s, r) => s + (+r.impressions || 0), 0));
crimPages.slice(0, 15).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 80)}`);
});

// Real estate
console.log('\n=== REAL ESTATE / CONTRACT PAGES ===');
const realKeywords = ['מקרקעין', 'נדלן', 'שכירות', 'דירה', 'בנייה', 'real-estate', 'rent', 'lease', 'property'];
const realPages = pages.filter(p => {
  const url = decodeURIComponent(p.page || '').toLowerCase();
  return realKeywords.some(k => url.includes(k));
});
realPages.sort((a, b) => (+b.clicks || 0) - (+a.clicks || 0));
console.log('Real estate pages found:', realPages.length);
console.log('Real estate clicks:', realPages.reduce((s, r) => s + (+r.clicks || 0), 0));
realPages.slice(0, 10).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.clicks} clicks | ${r.impressions} imp | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 80)}`);
});

// Top cannibalization issues
console.log('\n=== TOP 30 CANNIBALIZATION ISSUES ===');
cannib.sort((a, b) => (+b.total_impressions || 0) - (+a.total_impressions || 0));
cannib.slice(0, 30).forEach((r, i) => {
  console.log(`${i + 1}. [${r.page_count} pages] ${r.query} | ${r.total_clicks} clicks | ${r.total_impressions} imp`);
  if (r.pages) {
    const urls = r.pages.split(' | ').map(u => decodeURIComponent(u).substring(0, 70));
    urls.forEach(u => console.log(`     → ${u}`));
  }
});

// Quick wins: high impressions, low position (5-20)
console.log('\n=== QUICK WINS: Position 5-20, High Impressions ===');
const quickWins = pages.filter(p => {
  const pos = +p.position;
  const imp = +p.impressions;
  return pos >= 5 && pos <= 20 && imp > 1000;
}).sort((a, b) => (+b.impressions || 0) - (+a.impressions || 0));
quickWins.slice(0, 15).forEach((r, i) => {
  console.log(`  ${i + 1}. pos ${r.position} | ${r.impressions} imp | ${r.clicks} clicks | ${decodeURIComponent(r.page).substring(0, 70)}`);
});

// Pages with zero clicks but high impressions
console.log('\n=== WASTED IMPRESSIONS: 0-2 clicks but 1000+ impressions ===');
const wasted = pages.filter(p => +p.clicks <= 2 && +p.impressions > 1000).sort((a, b) => (+b.impressions || 0) - (+a.impressions || 0));
wasted.slice(0, 15).forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.impressions} imp | ${r.clicks} clicks | pos ${r.position} | ${decodeURIComponent(r.page).substring(0, 70)}`);
});
