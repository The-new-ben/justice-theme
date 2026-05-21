import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const REPORT_PATH = process.env.JUSTICE_FAMILY_DIVORCE_COMPARE_REPORT
  || 'reports/family-divorce-live-vs-draft-comparison-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';

const pages = [
  {
    target: '/divorce-lawyer/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/divorce-lawyer.txt',
    draftFile: 'content-drafts/divorce-lawyer-public-body-he.md',
  },
  {
    target: '/consensual-divorce/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/consensual-divorce.txt',
    draftFile: 'content-drafts/consensual-divorce-public-body-he.md',
  },
  {
    target: '/divorce-mediation/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/divorce-mediation.txt',
    draftFile: 'content-drafts/divorce-mediation-public-body-he.md',
  },
  {
    target: '/divorce-property-division/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/divorce-property-division.txt',
    draftFile: 'content-drafts/divorce-property-division-public-body-he.md',
  },
  {
    target: '/family-dispute-resolution/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/family-dispute-resolution.txt',
    draftFile: 'content-drafts/family-dispute-resolution-public-body-he.md',
  },
  {
    target: '/child-support/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/child-support.txt',
    draftFile: 'content-drafts/child-support-public-body-he.md',
  },
  {
    target: '/child-custody/',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/child-custody.txt',
    draftFile: 'content-drafts/child-custody-public-body-he.md',
  },
];

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function countLines(text) {
  return String(text || '').split(/\r?\n/).length;
}

function stripMarkdown(value) {
  return String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[[^\]]+]\([^)]+\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#-]+/g, ' ');
}

function normalizeForCompare(value) {
  return normalizeWhitespace(stripMarkdown(value))
    .toLowerCase()
    .replace(/[.,:;!?()[\]{}"'|/\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function headingCandidates(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line.replace(/^#{1,6}\s+/, '')))
    .filter((line) => {
      const words = countWords(line);
      if (words < 2 || words > 14) {
        return false;
      }
      if (line.includes('http') || line.includes('`')) {
        return false;
      }
      return line.length >= 8 && line.length <= 140;
    });
}

function draftHeadings(markdown) {
  return String(markdown || '')
    .split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.+)/))
    .filter(Boolean)
    .map((match) => normalizeWhitespace(match[1]));
}

function unique(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const key = normalizeForCompare(value);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(value);
  }
  return result;
}

function missingCandidates(liveCandidates, draftText) {
  const normalizedDraft = normalizeForCompare(draftText);
  return unique(liveCandidates)
    .filter((candidate) => !normalizedDraft.includes(normalizeForCompare(candidate)));
}

function retentionDecision(liveWords, draftWords) {
  const ratio = liveWords > 0 ? draftWords / liveWords : 0;
  if (ratio < 0.6) {
    return 'MERGE_REVIEW_REQUIRED_HIGH';
  }
  if (ratio < 0.8) {
    return 'MERGE_REVIEW_REQUIRED';
  }
  return 'LOW_RISK_COMPARE';
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

async function comparePage(page) {
  const [liveText, draftMarkdown] = await Promise.all([
    readFile(page.liveFile, 'utf8'),
    readFile(page.draftFile, 'utf8'),
  ]);
  const draftText = stripMarkdown(draftMarkdown);
  const liveWords = countWords(liveText);
  const draftWords = countWords(draftText);
  const liveLines = countLines(liveText);
  const draftLines = countLines(draftMarkdown);
  const liveCandidates = headingCandidates(liveText);
  const draftCandidateHeadings = draftHeadings(draftMarkdown);
  const missing = missingCandidates(liveCandidates, draftMarkdown);
  const wordDelta = draftWords - liveWords;
  const draftToLiveRatio = liveWords > 0 ? draftWords / liveWords : 0;
  const decision = retentionDecision(liveWords, draftWords);

  return {
    target: page.target,
    status: 'REVIEW',
    decision,
    liveWords,
    draftWords,
    wordDelta,
    draftToLiveRatio: draftToLiveRatio.toFixed(2),
    liveLines,
    draftLines,
    liveHeadingCandidates: unique(liveCandidates).length,
    draftHeadings: unique(draftCandidateHeadings).length,
    missingLiveHeadingCandidates: missing.length,
    missingLiveHeadingSamples: missing.slice(0, 8).join(' | ') || '-',
    liveFile: page.liveFile,
    draftFile: page.draftFile,
    recommendation: decision.startsWith('MERGE_REVIEW')
      ? 'Compare live snapshot before overwrite and keep or merge stronger current-live sections.'
      : 'Draft can proceed after normal owner/legal/source approval and CMS backup.',
  };
}

const results = [];

for (const page of pages) {
  try {
    results.push(await comparePage(page));
  } catch (error) {
    results.push({
      target: page.target,
      status: 'BLOCKED',
      decision: 'COMPARE_FAILED',
      liveWords: 0,
      draftWords: 0,
      wordDelta: 0,
      draftToLiveRatio: '0.00',
      liveLines: 0,
      draftLines: 0,
      liveHeadingCandidates: 0,
      draftHeadings: 0,
      missingLiveHeadingCandidates: 0,
      missingLiveHeadingSamples: '-',
      liveFile: page.liveFile,
      draftFile: page.draftFile,
      recommendation: error instanceof Error ? error.message : String(error),
    });
  }
}

console.table(results.map((result) => ({
  target: result.target,
  decision: result.decision,
  liveWords: result.liveWords,
  draftWords: result.draftWords,
  ratio: result.draftToLiveRatio,
  missingLiveCandidates: result.missingLiveHeadingCandidates,
})));

if (WRITE_REPORT) {
  const headers = [
    'target',
    'status',
    'decision',
    'liveWords',
    'draftWords',
    'wordDelta',
    'draftToLiveRatio',
    'liveLines',
    'draftLines',
    'liveHeadingCandidates',
    'draftHeadings',
    'missingLiveHeadingCandidates',
    'missingLiveHeadingSamples',
    'liveFile',
    'draftFile',
    'recommendation',
  ];
  const rows = [
    headers.join(','),
    ...results.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ];

  const target = resolve(REPORT_PATH);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${rows.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${target}`);
}

if (results.some((result) => result.status === 'BLOCKED')) {
  process.exitCode = 1;
}
