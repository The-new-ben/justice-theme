import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SOURCE_REPORT = 'reports/family-divorce-high-risk-merge-review-2026-05-21.csv';
const DETAIL_REPORT = process.env.JUSTICE_CHILD_SUPPORT_MERGE_DETAIL
  || 'reports/family-divorce-child-support-merge-decisions-2026-05-21.csv';
const SUMMARY_REPORT = process.env.JUSTICE_CHILD_SUPPORT_MERGE_SUMMARY
  || 'project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const TARGET = '/child-support/';

const decisions = new Map([
  [1, ['SKIP_UI_OR_NAV', '', 'Do not import live taxonomy/category navigation text into the article body.']],
  [2, ['COVERED_NO_ACTION', 'H1 and introduction', 'The clean draft already covers the page intent, child-support factors, agreement/claim/change framing and safety disclaimer.']],
  [4, ['SKIP_UI_CTA', '', 'Do not import generic lawyer-matching CTA copy into the informational body.']],
  [5, ['SKIP_UI_CTA', '', 'Do not import generic pre-lawyer CTA copy; the draft already has a controlled Jus-Tice help section.']],
  [6, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-pages section instead of importing live related-link UI text.']],
  [7, ['SKIP_UI_CTA', '', 'Do not import generic lead-form CTA copy into the article body.']],
  [8, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-pages section instead of importing live reading-path UI text.']],
  [10, ['COVERED_NO_ACTION', 'Introduction', 'The clean draft already explains that child support depends on needs, income, parenting time, housing, prior agreements and family circumstances.']],
  [13, ['COVERED_NO_ACTION', 'What child support includes', 'The clean draft already lists recurring and variable child expenses.']],
  [16, ['COVERED_NO_ACTION', 'Housing and living costs', 'The clean draft already covers housing/living costs and the need to separate support from property division.']],
  [17, ['COVERED_NO_ACTION', 'What child support includes', 'Covered by the draft and the planned included-vs-separate expense clarification.']],
  [18, ['COVERED_NO_ACTION', 'What child support includes', 'Covered by the draft and the planned included-vs-separate expense clarification.']],
  [19, ['COVERED_NO_ACTION', 'Extraordinary expenses', 'The clean draft already covers extraordinary expenses and disputes after agreement.']],
  [20, ['MERGE_INTO_DRAFT', 'What child support includes', 'Add concise wording that a good agreement should distinguish the monthly amount, separately split expenses, documentation, pre-approval and later changes.']],
  [22, ['COVERED_NO_ACTION', 'What affects child support amount?', 'The clean draft already covers child age, needs, income, parenting time, housing, extraordinary expenses and existing decisions.']],
  [23, ['COVERED_NO_ACTION', 'What affects child support amount?', 'The clean draft already covers age and references the post-919/15 complexity without overclaiming.']],
  [25, ['COVERED_NO_ACTION', 'What affects child support amount?', 'The clean draft already covers parent income, self-employment, business income and variable income.']],
  [27, ['COVERED_NO_ACTION', 'Parenting time and child support', 'The clean draft already covers parenting time, direct expenses, double housing/equipment and the custody page link.']],
  [29, ['COVERED_NO_ACTION', 'What affects child support amount?', 'The clean draft already covers special medical, therapeutic, educational and emotional needs.']],
  [35, ['COVERED_NO_ACTION', 'Documents to prepare', 'The clean draft already asks for bank statements and core financial documents.']],
  [36, ['COVERED_NO_ACTION', 'Documents to prepare', 'The clean draft already asks for child-expense details and education/health expenses.']],
  [37, ['COVERED_NO_ACTION', 'Documents to prepare', 'The clean draft already asks for education and health expenses, with the planned evidence merge covering messages/refusals.']],
  [38, ['COVERED_NO_ACTION', 'Documents to prepare', 'The clean draft already asks for rent/mortgage data and parenting-time details.']],
  [39, ['COVERED_NO_ACTION', 'Documents to prepare and divorce agreement', 'The clean draft already covers parenting time, prior agreements, existing judgments and agreement questions.']],
  [40, ['COVERED_NO_ACTION', 'Documents to prepare and divorce agreement', 'The clean draft already asks for prior agreements/judgments and the agreement section covers open questions.']],
  [41, ['COVERED_NO_ACTION', 'Documents to prepare', 'The clean draft already asks for special needs; the planned evidence merge adds relevant communications.']],
  [42, ['MERGE_INTO_DRAFT', 'Documents to prepare', 'Add relevant messages/requests about expenses, refusals to pay and missing-document tracking to the preparation list.']],
  [43, ['COVERED_NO_ACTION', 'Child support in divorce agreement', 'The clean draft already covers why a short monthly-sum clause leaves too many questions open.']],
  [50, ['MERGE_INTO_DRAFT', 'Extraordinary expenses', 'Add practical mechanics for receipts, response time, dispute mechanism and urgent medical expense handling.']],
  [51, ['COVERED_NO_ACTION', 'Extraordinary expenses', 'Covered by the planned extraordinary-expense mechanism merge.']],
  [52, ['COVERED_NO_ACTION', 'Child support in divorce agreement', 'The clean draft already covers future changes; the planned mechanism merge covers review/dispute procedure.']],
  [53, ['COVERED_NO_ACTION', 'Child support claim', 'The clean draft already links family-dispute resolution before/around a support claim without adding unsourced procedural detail.']],
  [54, ['COVERED_NO_ACTION', 'Child support claim', 'The clean draft already covers claim preparation, documents, economics and dispute-resolution sequence.']],
  [57, ['COVERED_NO_ACTION', 'Changing child support', 'The clean draft already covers significant change in income, parenting time, child needs and other circumstances.']],
  [62, ['MERGE_INTO_DRAFT', 'Changing child support', 'Add a short pre-change checklist: parenting time, needs, earning capacity, update mechanism and housing/living costs.']],
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
    nextStep: 'Apply four concise draft merges, rerun static QA and keep page blocked from CMS upload until owner/legal/source approval.',
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
