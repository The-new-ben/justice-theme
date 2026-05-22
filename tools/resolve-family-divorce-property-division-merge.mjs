import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SOURCE_REPORT = 'reports/family-divorce-high-risk-merge-review-2026-05-21.csv';
const DETAIL_REPORT = process.env.JUSTICE_PROPERTY_DIVISION_MERGE_DETAIL
  || 'reports/family-divorce-property-division-merge-decisions-2026-05-21.csv';
const SUMMARY_REPORT = process.env.JUSTICE_PROPERTY_DIVISION_MERGE_SUMMARY
  || 'project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const TARGET = '/divorce-property-division/';

const decisions = new Map([
  [1, ['SKIP_UI_OR_NAV', '', 'Do not import live taxonomy/category navigation text into the article body.']],
  [2, ['COVERED_NO_ACTION', 'H1 and introduction', 'The clean draft already covers the page intent, asset/debt scope and preparation framing.']],
  [4, ['SKIP_UI_CTA', '', 'Do not import generic lawyer-matching CTA copy into the informational body.']],
  [5, ['SKIP_UI_CTA', '', 'Do not import generic pre-lawyer CTA copy; the draft already has a safe Jus-Tice help section.']],
  [6, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-pages section instead of importing live related-link UI text.']],
  [7, ['SKIP_UI_CTA', '', 'Do not import generic lead-form CTA copy into the article body.']],
  [8, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-pages section instead of importing live reading-path UI text.']],
  [10, ['COVERED_NO_ACTION', 'Introduction and resource-balancing sections', 'The clean draft already explains that property division is not a simple half-and-half calculation.']],
  [14, ['COVERED_NO_ACTION', 'What is resource balancing?', 'The clean draft already covers resource balancing and value-based division.']],
  [26, ['COVERED_NO_ACTION', 'Business, company, shares and options', 'The clean draft already covers businesses, shares, options, valuation and experts.']],
  [27, ['COVERED_NO_ACTION', 'Business, company, shares and options', 'The clean draft already covers options, vesting and high-tech compensation risk.']],
  [28, ['COVERED_NO_ACTION', 'Debts and loans', 'The clean draft already covers debts, loans, guarantees and obligations.']],
  [29, ['COVERED_NO_ACTION', 'Pension and social rights', 'The clean draft already covers pension, funds and social rights.']],
  [30, ['COVERED_NO_ACTION', 'Preparation checklist', 'The clean draft already includes tangible assets and source-of-funds preparation.']],
  [32, ['COVERED_NO_ACTION', 'Why property division is not only half-and-half', 'The clean draft already has this exact user-intent section and checklist.']],
  [34, ['COVERED_NO_ACTION', 'Why property division is not only half-and-half', 'The clean draft already distinguishes married/common-law status and timing.']],
  [35, ['COVERED_NO_ACTION', 'Why property division is not only half-and-half', 'The clean draft already covers start/end timing and assets before/during the relationship.']],
  [36, ['COVERED_NO_ACTION', 'Prenup and previous agreements', 'The clean draft already covers prenups and previous agreements as controlling factors.']],
  [37, ['COVERED_NO_ACTION', 'Why property division is not only half-and-half', 'The clean draft already covers assets before versus during the relationship.']],
  [38, ['COVERED_NO_ACTION', 'Inheritance, gifts and premarital assets', 'The clean draft already covers excluded assets, separate registration and shared conduct.']],
  [39, ['MERGE_INTO_DRAFT', 'Why property division is not only half-and-half', 'Add one cautious bullet that separate registration is not always decisive if conduct indicates possible shared intent; avoid legal conclusion language.']],
  [40, ['MERGE_INTO_DRAFT', 'Home residence and partition', 'Add one cautious sentence that children and housing needs can affect practical timing or settlement options; avoid promising a legal outcome.']],
  [41, ['COVERED_NO_ACTION', 'Debts and loans', 'The clean draft already covers debts, loans, guarantees and family/business obligations.']],
  [42, ['COVERED_NO_ACTION', 'Asset concealment and lack of transparency', 'The clean draft already covers hidden information, suspicious transfers and missing documents.']],
  [43, ['COVERED_NO_ACTION', 'Business, company, shares and options', 'The clean draft already covers hard-to-value businesses, shares and expert valuation.']],
  [45, ['COVERED_NO_ACTION', 'Separation date and why it matters', 'The clean draft already covers the separation date and its effect on debt, income, business value and assets.']],
  [50, ['MERGE_INTO_DRAFT', 'Separation date and why it matters', 'Add a short practical checklist: actual separation date, leaving home, opening proceedings, separate accounts and assets/debts created after separation.']],
  [51, ['COVERED_NO_ACTION', 'Separation date and why it matters', 'Covered by the planned separation-date checklist merge.']],
  [52, ['COVERED_NO_ACTION', 'Separation date and why it matters', 'Covered by the planned separation-date checklist merge.']],
  [53, ['COVERED_NO_ACTION', 'Prenup and previous agreements', 'The clean draft already asks whether a prenup exists and how it affects the property map.']],
  [54, ['MERGE_INTO_DRAFT', 'Separation date and why it matters', 'Add a sentence that assets or debts created after separation can change the factual review and may require professional valuation.']],
  [56, ['COVERED_NO_ACTION', 'Prenup and previous agreements', 'The clean draft already covers prenups, shared-life agreements and prior agreements.']],
  [59, ['COVERED_NO_ACTION', 'Prenup and previous agreements', 'Covered by the planned agreement-validity checklist merge.']],
  [60, ['MERGE_INTO_DRAFT', 'Prenup and previous agreements', 'Add checklist points for approval if required, included/excluded assets and later conduct that may conflict with the agreement.']],
  [61, ['MERGE_INTO_DRAFT', 'Prenup and previous agreements', 'Add caution that content cannot decide validity or interpretation; owner/legal review should verify pressure, disclosure and understanding language.']],
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.length > 1 || candidate[0]);
}

function csvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function writeCsv(headers, rows) {
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n') + '\n';
}

async function writeReport(path, contents) {
  const target = resolve(path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
  console.log(`Wrote ${target}`);
}

const sourceRows = parseCsv(await readFile(SOURCE_REPORT, 'utf8'));
const headers = sourceRows.shift();
const indexByHeader = Object.fromEntries(headers.map((header, index) => [header, index]));
const liveRows = sourceRows
  .filter((row) => row[indexByHeader.target] === TARGET && row[indexByHeader.source] === 'live')
  .map((row) => ({
    target: row[indexByHeader.target],
    liveSectionOrder: Number(row[indexByHeader.sectionOrder]),
    worksheetDecision: row[indexByHeader.decision],
    liveHeading: row[indexByHeader.heading],
    liveWords: Number(row[indexByHeader.words]),
    liveSample: row[indexByHeader.sample],
    sourceFile: row[indexByHeader.sourceFile],
  }))
  .sort((a, b) => a.liveSectionOrder - b.liveSectionOrder);

const unresolved = liveRows.filter((row) => !decisions.has(row.liveSectionOrder));
if (unresolved.length) {
  console.error(`Unresolved live rows: ${unresolved.map((row) => row.liveSectionOrder).join(', ')}`);
  process.exit(1);
}

const resolvedRows = liveRows.map((row) => {
  const [finalDecision, draftTargetSection, operatorAction] = decisions.get(row.liveSectionOrder);
  return {
    target: row.target,
    liveSectionOrder: row.liveSectionOrder,
    worksheetDecision: row.worksheetDecision,
    finalDecision,
    draftTargetSection,
    liveHeading: row.liveHeading,
    liveWords: row.liveWords,
    operatorAction,
    uploadStatus: finalDecision === 'MERGE_INTO_DRAFT'
      ? 'NEEDS_DRAFT_EDIT_BEFORE_UPLOAD'
      : 'NO_DRAFT_EDIT_REQUIRED',
    sourceFile: row.sourceFile,
  };
});

const countByDecision = resolvedRows.reduce((accumulator, row) => {
  accumulator[row.finalDecision] = (accumulator[row.finalDecision] || 0) + 1;
  return accumulator;
}, {});

const mergeRows = resolvedRows.filter((row) => row.finalDecision === 'MERGE_INTO_DRAFT');
const summaryRows = [
  {
    target: TARGET,
    reviewedLiveRows: resolvedRows.length,
    mergeIntoDraft: countByDecision.MERGE_INTO_DRAFT || 0,
    coveredNoAction: countByDecision.COVERED_NO_ACTION || 0,
    skippedUiOrRelated: resolvedRows.filter((row) => row.finalDecision.startsWith('SKIP_')).length,
    verificationStatus: 'VERIFIED LOCAL',
    nextStep: 'Apply six concise draft merges, rerun static QA and keep page blocked from CMS upload until owner/legal/source approval.',
  },
  ...mergeRows.map((row) => ({
    target: row.target,
    reviewedLiveRows: '',
    mergeIntoDraft: '',
    coveredNoAction: '',
    skippedUiOrRelated: '',
    verificationStatus: 'MERGE_REQUIRED',
    nextStep: `${row.draftTargetSection}: ${row.operatorAction}`,
  })),
];

console.table([
  {
    target: TARGET,
    reviewedLiveRows: resolvedRows.length,
    mergeIntoDraft: countByDecision.MERGE_INTO_DRAFT || 0,
    coveredNoAction: countByDecision.COVERED_NO_ACTION || 0,
    skippedUiOrRelated: resolvedRows.filter((row) => row.finalDecision.startsWith('SKIP_')).length,
  },
]);

if (WRITE_REPORT) {
  await writeReport(DETAIL_REPORT, writeCsv([
    'target',
    'liveSectionOrder',
    'worksheetDecision',
    'finalDecision',
    'draftTargetSection',
    'liveHeading',
    'liveWords',
    'operatorAction',
    'uploadStatus',
    'sourceFile',
  ], resolvedRows));

  await writeReport(SUMMARY_REPORT, writeCsv([
    'target',
    'reviewedLiveRows',
    'mergeIntoDraft',
    'coveredNoAction',
    'skippedUiOrRelated',
    'verificationStatus',
    'nextStep',
  ], summaryRows));
}
