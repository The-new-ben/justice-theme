import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SOURCE_REPORT = 'reports/family-divorce-high-risk-merge-review-2026-05-21.csv';
const DETAIL_REPORT = process.env.JUSTICE_CHILD_CUSTODY_MERGE_DETAIL
  || 'reports/family-divorce-child-custody-merge-decisions-2026-05-21.csv';
const SUMMARY_REPORT = process.env.JUSTICE_CHILD_CUSTODY_MERGE_SUMMARY
  || 'project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv';
const WRITE_REPORT = process.env.JUSTICE_WRITE_REPORT === '1';
const TARGET = '/child-custody/';

const decisions = new Map([
  [1, ['SKIP_UI_OR_NAV', '', 'Do not import live taxonomy/category navigation text into the article body.']],
  [2, ['COVERED_NO_ACTION', 'H1 and introduction', 'The clean draft already covers custody, parental responsibility, parenting time and safety framing.']],
  [4, ['SKIP_UI_CTA', '', 'Do not import generic lawyer-matching CTA copy into the informational body.']],
  [5, ['SKIP_UI_CTA', '', 'Do not import generic pre-lawyer CTA copy; the draft already has a safe Jus-Tice help section.']],
  [6, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-links section instead of importing live related-link UI text.']],
  [7, ['SKIP_UI_CTA', '', 'Do not import generic lead-form CTA copy into the article body.']],
  [8, ['SKIP_RELATED_LINK_BLOCK', 'Related pages', 'Use the controlled related-links section instead of importing live reading-path UI text.']],
  [10, ['COVERED_NO_ACTION', 'Introduction and terminology section', 'The clean draft already explains custody versus parenting time without turning children into a conflict arena.']],
  [11, ['COVERED_NO_ACTION', 'Custody or parenting time?', 'The clean draft already covers the public term custody and the professional shift to parenting time and parental responsibility.']],
  [13, ['COVERED_NO_ACTION', 'Best interests of the child', 'The clean draft already covers the best-interests principle, stability, safety, relationship, needs, distance and parental capacity.']],
  [19, ['COVERED_NO_ACTION', 'Best interests of the child', 'The clean draft already covers availability, communication, risk and factual preparation.']],
  [20, ['MERGE_INTO_DRAFT', 'Best interests of the child', 'Add that parent communication, safety concerns, alienation concerns and professional recommendations if appointed can affect the review; avoid decisive legal conclusions.']],
  [21, ['COVERED_NO_ACTION', 'Risk situations and urgent remedies', 'The clean draft already covers risk, violence and urgent action in a dedicated section.']],
  [22, ['MERGE_INTO_DRAFT', 'Best interests of the child', 'Add a cautious reference to professional recommendations or reports where appointed.']],
  [23, ['COVERED_NO_ACTION', 'How parenting time is determined', 'The clean draft already explains agreement versus legal decision and practical schedule components.']],
  [26, ['MERGE_INTO_DRAFT', 'How parenting time is determined', 'Add a concise checklist for what a parenting-time agreement should specify: days, hours, overnights, pickup/drop-off, holidays, vacations and dispute mechanism.']],
  [37, ['COVERED_NO_ACTION', 'Parental responsibility and decision making', 'The clean draft already covers education, health, documentation, response time and disagreement mechanism.']],
  [38, ['COVERED_NO_ACTION', 'Parental responsibility and decision making', 'The clean draft already covers dispute mechanism and the benefit of clear rules.']],
  [39, ['MERGE_INTO_DRAFT', 'Parenting time and child support', 'Add that child-expense coordination should be kept distinct from the parenting-time question and handled clearly.']],
  [40, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already explains no single model fits every family and lists distance, work, age, health and communication considerations.']],
  [41, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already covers common models and warns against one-size-fits-all planning.']],
  [43, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already covers fixed midweek days, overnights, week-on/week-off and gradual models.']],
  [45, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already covers overnights, young children, distance, prior relationship and emotional needs.']],
  [47, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already covers week-on/week-off suitability limits.']],
  [49, ['COVERED_NO_ACTION', 'Possible parenting-time models', 'The clean draft already covers gradual models for young children and adaptation.']],
  [51, ['COVERED_NO_ACTION', 'Parental responsibility and decision making', 'The clean draft already covers communication and decision-making mechanisms.']],
  [53, ['MERGE_INTO_DRAFT', 'Parental responsibility and decision making', 'Add communication-channel details: WhatsApp, email, parenting app or SMS, and when phone calls are appropriate.']],
  [54, ['MERGE_INTO_DRAFT', 'Parental responsibility and decision making', 'Add response-time, school notification, medical information and lateness documentation details.']],
  [56, ['MERGE_INTO_DRAFT', 'Parental responsibility and decision making', 'Add that clear rules reduce repeated friction and keep children from serving as messengers.']],
  [57, ['COVERED_NO_ACTION', 'Parental responsibility and decision making', 'Covered by the planned communication-channel merge.']],
  [58, ['COVERED_NO_ACTION', 'Parental responsibility and decision making', 'Covered by the planned communication-channel and medical-information merge.']],
  [59, ['MERGE_INTO_DRAFT', 'How parenting time is determined', 'Add practical guidance for repeated lateness or cancellations: document facts and define a response mechanism without unilateral escalation.']],
  [60, ['COVERED_NO_ACTION', 'How parenting time is determined', 'Covered by the planned repeated-lateness/documentation merge.']],
  [62, ['COVERED_NO_ACTION', 'Parenting time and child support', 'The clean draft already separates parenting-time planning from child-support analysis.']],
  [64, ['MERGE_INTO_DRAFT', 'How parenting time is determined', 'Add that agreements need extra detail when parents live far apart, one parent works shifts, communication is difficult or the schedule has repeated execution problems.']],
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
    nextStep: 'Apply nine concise draft merges, rerun static QA and keep page blocked from CMS upload until owner/legal/source approval.',
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
