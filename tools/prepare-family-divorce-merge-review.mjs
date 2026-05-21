import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const REPORT_PATH = process.env.JUSTICE_FAMILY_DIVORCE_MERGE_REVIEW_REPORT
  || 'reports/family-divorce-high-risk-merge-review-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';

const pages = [
  {
    priority: 'P0',
    target: '/child-support/',
    reason: 'Lowest draft/live ratio in the Family/Divorce comparison',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/child-support.txt',
    draftFile: 'content-drafts/child-support-public-body-he.md',
  },
  {
    priority: 'P0',
    target: '/child-custody/',
    reason: 'High retention risk and sensitive child arrangements intent',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/child-custody.txt',
    draftFile: 'content-drafts/child-custody-public-body-he.md',
  },
  {
    priority: 'P0',
    target: '/divorce-property-division/',
    reason: 'High retention risk and strong asset/debt/property intent',
    liveFile: 'reports/family-divorce-live-target-backup-2026-05-21/divorce-property-division.txt',
    draftFile: 'content-drafts/divorce-property-division-public-body-he.md',
  },
];

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
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

function countWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

function truncate(value, max = 260) {
  const normalized = normalizeWhitespace(value);
  return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function draftSections(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)/);
    if (heading) {
      if (current) {
        sections.push(current);
      }
      current = {
        level: heading[1].length,
        heading: normalizeWhitespace(heading[2]),
        body: [],
      };
      continue;
    }

    if (current) {
      current.body.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections.map((section, index) => ({
    order: index + 1,
    level: section.level,
    heading: section.heading,
    words: countWords(stripMarkdown(section.body.join('\n'))),
    sample: truncate(stripMarkdown(section.body.join(' '))),
  }));
}

function isCandidateHeading(line) {
  const words = countWords(line);
  if (words < 2 || words > 14) {
    return false;
  }
  if (line.includes('http') || line.includes('`')) {
    return false;
  }
  if (line.length < 8 || line.length > 140) {
    return false;
  }
  return true;
}

function liveSections(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  const sections = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!isCandidateHeading(line)) {
      continue;
    }

    const nextLines = [];
    for (let cursor = index + 1; cursor < Math.min(lines.length, index + 6); cursor += 1) {
      if (isCandidateHeading(lines[cursor]) && countWords(nextLines.join(' ')) >= 25) {
        break;
      }
      nextLines.push(lines[cursor]);
    }

    const sample = nextLines.join(' ');
    const sampleWords = countWords(sample);
    if (sampleWords < 25) {
      continue;
    }

    sections.push({
      order: index + 1,
      heading: line,
      words: sampleWords,
      sample: truncate(sample),
    });
  }

  return dedupeByHeading(sections).slice(0, 35);
}

function dedupeByHeading(sections) {
  const seen = new Set();
  const result = [];
  for (const section of sections) {
    const key = normalizeForCompare(section.heading);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(section);
  }
  return result;
}

function liveDecision(liveSection, draftText) {
  const normalizedDraft = normalizeForCompare(draftText);
  const normalizedHeading = normalizeForCompare(liveSection.heading);
  const normalizedSample = normalizeForCompare(liveSection.sample);

  if (normalizedHeading && normalizedDraft.includes(normalizedHeading)) {
    return 'COVERED_BY_DRAFT';
  }

  const sampleWords = normalizedSample.split(/\s+/).filter(Boolean).slice(0, 14);
  const overlap = sampleWords.filter((word) => word.length > 3 && normalizedDraft.includes(word)).length;
  if (overlap >= 8) {
    return 'PARTIAL_OVERLAP_REVIEW';
  }

  return 'REVIEW_FOR_MERGE';
}

async function reviewPage(page) {
  const [liveText, draftMarkdown] = await Promise.all([
    readFile(page.liveFile, 'utf8'),
    readFile(page.draftFile, 'utf8'),
  ]);
  const draftText = stripMarkdown(draftMarkdown);
  const rows = [];
  const draft = draftSections(draftMarkdown);
  const live = liveSections(liveText);

  for (const section of draft) {
    rows.push({
      target: page.target,
      priority: page.priority,
      source: 'draft',
      sectionOrder: section.order,
      decision: 'KEEP_DRAFT_BASE',
      heading: section.heading,
      words: section.words,
      sample: section.sample,
      rationale: 'Clean draft section passed static QA and remains the base content unless owner/legal review changes it.',
      sourceFile: page.draftFile,
    });
  }

  for (const section of live) {
    const decision = liveDecision(section, draftMarkdown);
    rows.push({
      target: page.target,
      priority: decision === 'REVIEW_FOR_MERGE' ? page.priority : 'P1',
      source: 'live',
      sectionOrder: section.order,
      decision,
      heading: section.heading,
      words: section.words,
      sample: section.sample,
      rationale: decision === 'REVIEW_FOR_MERGE'
        ? 'Live section appears missing from the clean draft; review before overwrite and merge if it adds useful user intent coverage.'
        : 'Live section appears covered or partly covered by the draft; spot-check before overwrite.',
      sourceFile: page.liveFile,
    });
  }

  return {
    page,
    draftSections: draft.length,
    liveCandidates: live.length,
    reviewForMerge: rows.filter((row) => row.source === 'live' && row.decision === 'REVIEW_FOR_MERGE').length,
    partialOverlap: rows.filter((row) => row.decision === 'PARTIAL_OVERLAP_REVIEW').length,
    covered: rows.filter((row) => row.decision === 'COVERED_BY_DRAFT').length,
    rows,
  };
}

const pageResults = [];

for (const page of pages) {
  pageResults.push(await reviewPage(page));
}

const rows = pageResults.flatMap((result) => result.rows);

console.table(pageResults.map((result) => ({
  target: result.page.target,
  draftSections: result.draftSections,
  liveCandidates: result.liveCandidates,
  reviewForMerge: result.reviewForMerge,
  partialOverlap: result.partialOverlap,
  covered: result.covered,
})));

if (WRITE_REPORT) {
  const headers = [
    'target',
    'priority',
    'source',
    'sectionOrder',
    'decision',
    'heading',
    'words',
    'sample',
    'rationale',
    'sourceFile',
  ];
  const output = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';

  const target = resolve(REPORT_PATH);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, output, 'utf8');
  console.log(`Wrote ${target}`);
}
