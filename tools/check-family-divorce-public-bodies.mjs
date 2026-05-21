import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const REPORT_PATH = process.env.JUSTICE_FAMILY_DIVORCE_REPORT
  || 'reports/family-divorce-public-body-static-qa-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';

const pages = [
  {
    target: '/divorce-lawyer/',
    file: 'content-drafts/divorce-lawyer-public-body-he.md',
    minWords: 1800,
    requiredLinks: [
      '/consensual-divorce/',
      '/divorce-mediation/',
      '/child-custody/',
      '/child-support/',
      '/divorce-property-division/',
      '/family-dispute-resolution/',
    ],
  },
  {
    target: '/consensual-divorce/',
    file: 'content-drafts/consensual-divorce-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/child-custody/', '/child-support/', '/divorce-property-division/', '/divorce-mediation/'],
  },
  {
    target: '/divorce-mediation/',
    file: 'content-drafts/divorce-mediation-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/consensual-divorce/', '/family-dispute-resolution/'],
  },
  {
    target: '/divorce-property-division/',
    file: 'content-drafts/divorce-property-division-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/child-support/', '/child-custody/', '/family-dispute-resolution/'],
  },
  {
    target: '/family-dispute-resolution/',
    file: 'content-drafts/family-dispute-resolution-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/consensual-divorce/', '/divorce-mediation/', '/divorce-property-division/'],
  },
  {
    target: '/child-support/',
    file: 'content-drafts/child-support-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/child-custody/', '/divorce-property-division/', '/family-dispute-resolution/'],
  },
  {
    target: '/child-custody/',
    file: 'content-drafts/child-custody-public-body-he.md',
    minWords: 1200,
    requiredLinks: ['/divorce-lawyer/', '/child-support/', '/divorce-property-division/', '/family-dispute-resolution/'],
  },
];

const internalMarkers = [
  'TODO',
  'TBD',
  'FIXME',
  'INTERNAL',
  'OWNER',
  'LEGAL',
  'SOURCE',
  'BLOCKED',
  'NOT VERIFIED',
  'REVIEW ONLY',
  'project-control',
  'content-drafts/',
];

const fakeTrustTerms = [
  'recommended',
  'trusted',
  'top rated',
  'rating',
  'review score',
  'מומלץ',
  'מומלצת',
  'הטוב ביותר',
  'דירוג',
  'כוכבים',
  'ביקורות',
  'הצלחה מובטחת',
  'תוצאה מובטחת',
  'מבטיח תוצאה',
  'אחוזי הצלחה',
  'מוביל בישראל',
  'ייעוץ חינם',
  'מאיה',
  'רוטנברג',
];

function countWords(markdown) {
  return markdown
    .replace(/`[^`]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function countLines(markdown) {
  return markdown.split(/\r?\n/).length;
}

function includesAny(markdown, terms) {
  const lower = markdown.toLowerCase();
  return terms.filter((term) => lower.includes(String(term).toLowerCase()));
}

function disclaimerState(markdown) {
  const requiredAny = [
    'אינו ייעוץ משפטי',
    'אינה ייעוץ משפטי',
    'מידע כללי',
    'אינו מחליף בדיקה פרטנית',
    'אינה מחליפה בדיקה פרטנית',
  ];

  return includesAny(markdown, requiredAny).length > 0 ? 'PASS' : 'REVIEW';
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function checkPage(page) {
  const markdown = await readFile(page.file, 'utf8');
  const words = countWords(markdown);
  const lines = countLines(markdown);
  const missingLinks = page.requiredLinks.filter((link) => !markdown.includes(link));
  const internalHits = includesAny(markdown, internalMarkers);
  const fakeTrustHits = includesAny(markdown, fakeTrustTerms);
  const disclaimer = disclaimerState(markdown);
  const issues = [];

  if (words < page.minWords) {
    issues.push(`words_${words}_lt_${page.minWords}`);
  }
  if (missingLinks.length > 0) {
    issues.push(`missing_links:${missingLinks.join('|')}`);
  }
  if (internalHits.length > 0) {
    issues.push(`internal_markers:${internalHits.join('|')}`);
  }
  if (fakeTrustHits.length > 0) {
    issues.push(`fake_trust_terms:${fakeTrustHits.join('|')}`);
  }
  if (disclaimer !== 'PASS') {
    issues.push('missing_general_information_disclaimer');
  }

  return {
    target: page.target,
    file: page.file,
    words,
    lines,
    minWords: page.minWords,
    requiredLinks: page.requiredLinks.length,
    missingLinks: missingLinks.join('|') || '-',
    internalHits: internalHits.join('|') || '-',
    fakeTrustHits: fakeTrustHits.join('|') || '-',
    disclaimer,
    status: issues.length === 0 ? 'PASS' : 'REVIEW',
    issues: issues.join(';') || '-',
  };
}

const results = [];

for (const page of pages) {
  try {
    results.push(await checkPage(page));
  } catch (error) {
    results.push({
      target: page.target,
      file: page.file,
      words: 0,
      lines: 0,
      minWords: page.minWords,
      requiredLinks: page.requiredLinks.length,
      missingLinks: page.requiredLinks.join('|'),
      internalHits: '-',
      fakeTrustHits: '-',
      disclaimer: 'REVIEW',
      status: 'REVIEW',
      issues: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results.map((result) => ({
  target: result.target,
  status: result.status,
  words: result.words,
  missingLinks: result.missingLinks,
  internalHits: result.internalHits,
  fakeTrustHits: result.fakeTrustHits,
  disclaimer: result.disclaimer,
})));

if (WRITE_REPORT) {
  const header = [
    'target',
    'file',
    'status',
    'words',
    'lines',
    'minWords',
    'requiredLinks',
    'missingLinks',
    'internalHits',
    'fakeTrustHits',
    'disclaimer',
    'issues',
  ];
  const rows = [
    header.join(','),
    ...results.map((result) => header.map((key) => csvValue(result[key])).join(',')),
  ];

  const path = resolve(REPORT_PATH);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${rows.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${REPORT_PATH}`);
}

if (results.some((result) => result.status !== 'PASS')) {
  process.exitCode = 1;
}
