import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const date = '2026-05-25';
const packPath = path.join(root, 'mnt', 'documents', 'justice', 'STEP_5_new_pages.json');
const exportPath = path.join(root, 'project-control', 'exports', 'all-url-export.csv');
const reportJsonPath = path.join(root, 'reports', 'seo-pack-cannibalization-gate-2026-05-25.json');
const reportCsvPath = path.join(root, 'reports', 'seo-pack-cannibalization-gate-2026-05-25.csv');
const reportMdPath = path.join(root, 'project-control', 'seo-pack-cannibalization-gate-2026-05-25.md');

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(reportMdPath), { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length || row.length) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  const [header, ...records] = rows;
  return records.map((record) => Object.fromEntries(header.map((name, index) => [name, record[index] || ''])));
}

function normalizeSlug(slug) {
  return slug.replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').toLowerCase();
}

function csvEscape(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const proposedPages = JSON.parse(fs.readFileSync(packPath, 'utf8'));
const existingRows = parseCsv(fs.readFileSync(exportPath, 'utf8'));

const guardrails = {
  'divorce-family-lawyer': {
    canonical_candidate: '/divorce-lawyer/',
    related_slugs: ['divorce-lawyer', 'family-dispute-resolution', 'child-support', 'child-custody', 'divorce-mediation', 'divorce-property-division', 'consensual-divorce', 'family-law'],
    recommendation: 'MERGE_INTO_EXISTING_HUB_NO_NEW_URL',
    reason: 'Owner clarified divorce lawyer and family-law lawyer should reinforce one Hebrew commercial signal. Existing /divorce-lawyer/ and family support pages already exist.',
  },
  'real-estate-lawyer': {
    canonical_candidate: '/real-estate-attorney/',
    related_slugs: ['real-estate-attorney', 'real-estate-lawyer-cost', 'land-appreciation-tax', 'registration-of-real-estate', 'lawyer-for-buying-or-selling-a-house'],
    recommendation: 'MAP_TO_EXISTING_REAL_ESTATE_HUB_NO_NEW_URL',
    reason: 'Existing /real-estate-attorney/ is the current real-estate money hub; publishing /real-estate-lawyer/ as a new page would split intent unless a slug migration is approved.',
  },
  'medical-malpractice-lawyer': {
    canonical_candidate: '/medical-malpractice-lawyer/',
    related_slugs: ['medical-malpractice-lawyer', 'malpractice', 'רשלנות'],
    recommendation: 'UPDATE_EXISTING_EXACT_URL_ONLY',
    reason: 'Exact public URL already exists in the export, including duplicate export rows. Use the draft as a repair/merge source, not as a new page.',
  },
  'inheritance-wills-lawyer': {
    canonical_candidate: '/inheritance/',
    related_slugs: ['inheritance', 'international-inheritance-wills-lawyer', 'will-probate-objection', 'what-is-a-probate-order', 'inheritance-order', 'revocation-of-a-will'],
    recommendation: 'DRAFT_ONLY_SELECT_PRIMARY_WITH_GSC',
    reason: 'Inheritance/wills pages already exist but the commercial lawyer hub is not cleanly resolved. Needs GSC/SERP primary selection before publishing a new commercial URL.',
  },
  'criminal-lawyer': {
    canonical_candidate: '/criminal-lawyer/',
    related_slugs: ['criminal-prosecutions', 'drug-offenses-criminal-lawyer', 'top-criminal-lawyer', 'what-to-consider-when-hiring-a-criminal-lawyer', 'tax-offenses-criminal-lawyer'],
    recommendation: 'DRAFT_ONLY_MERGE_REVIEW_REQUIRED',
    reason: 'No clean exact /criminal-lawyer/ primary was found, but multiple criminal pages overlap. Select a primary and plan redirects later with approval.',
  },
  'employment-lawyer': {
    canonical_candidate: '/labor-lawyer/',
    related_slugs: ['labor-lawyer', 'employment-contract', 'coronavirus-employers-guide', 'ייצוג-מעסיקים'],
    recommendation: 'MAP_TO_EXISTING_LABOR_PAGE_REVIEW',
    reason: 'Existing /labor-lawyer/ and employment pages already target the topic. Do not create /employment-lawyer/ before slug strategy review.',
  },
  'tax-business-lawyer': {
    canonical_candidate: '/tax-lawyer/',
    related_slugs: ['tax-lawyer', 'tax-offenses-criminal-lawyer', 'business-license', 'corporate-tax', 'list-of-taxes'],
    recommendation: 'MAP_TO_EXISTING_TAX_PAGE_REVIEW',
    reason: 'Existing /tax-lawyer/ page targets tax-lawyer intent. Business/legal startup topics may be separate support pages, not a new broad duplicate.',
  },
};

const rows = proposedPages.map((page) => {
  const targetSlug = normalizeSlug(page.slug);
  const guardrail = guardrails[targetSlug] || {
    canonical_candidate: page.slug,
    related_slugs: [targetSlug],
    recommendation: 'REVIEW_BEFORE_PUBLICATION',
    reason: 'No specific guardrail configured; still requires GSC/SERP review before publication.',
  };

  const exactMatches = existingRows.filter((row) => normalizeSlug(row.current_url) === targetSlug || normalizeSlug(row.current_slug) === targetSlug);
  const relatedMatches = existingRows.filter((row) => {
    const haystack = `${normalizeSlug(row.current_url)} ${normalizeSlug(row.current_slug)} ${row.title}`.toLowerCase();
    return guardrail.related_slugs.some((slug) => haystack.includes(slug.toLowerCase()));
  });

  const risk = exactMatches.length
    ? 'HIGH_EXACT_OR_DUPLICATE_URL'
    : relatedMatches.length >= 3
      ? 'HIGH_CLUSTER_OVERLAP'
      : relatedMatches.length
        ? 'MEDIUM_RELATED_OVERLAP'
        : 'UNKNOWN_NEEDS_GSC';

  const allowedAction = risk === 'UNKNOWN_NEEDS_GSC'
    ? 'HOLD_DRAFT_UNTIL_GSC_SERP_REVIEW'
    : 'DO_NOT_PUBLISH_AS_NEW_PAGE';

  return {
    proposed_slug: page.slug,
    primary_keyword: page.primary_keyword,
    canonical_candidate: guardrail.canonical_candidate,
    recommendation: guardrail.recommendation,
    allowed_action: allowedAction,
    risk,
    exact_match_count: exactMatches.length,
    related_match_count: relatedMatches.length,
    sample_existing_urls: relatedMatches.slice(0, 5).map((row) => row.current_url),
    owner_approval_required: 'YES',
    gsc_required: 'YES',
    reason: guardrail.reason,
  };
});

const summary = {
  generated_at: `${date} Asia/Jerusalem`,
  status: rows.some((row) => row.risk.startsWith('HIGH')) ? 'PUBLICATION_BLOCKED_FOR_REVIEW' : 'REVIEW_REQUIRED',
  proposed_pages: rows.length,
  do_not_publish_as_new: rows.filter((row) => row.allowed_action === 'DO_NOT_PUBLISH_AS_NEW_PAGE').length,
  hold_draft: rows.filter((row) => row.allowed_action === 'HOLD_DRAFT_UNTIL_GSC_SERP_REVIEW').length,
  high_risk: rows.filter((row) => row.risk.startsWith('HIGH')).length,
  medium_risk: rows.filter((row) => row.risk.startsWith('MEDIUM')).length,
  rows,
  safety_statement: 'Review artifact only. No CMS/database, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, payment, invoice or provider setting changed.',
};

fs.writeFileSync(reportJsonPath, JSON.stringify(summary, null, 2), 'utf8');

const csvHeader = [
  'proposed_slug',
  'primary_keyword',
  'canonical_candidate',
  'recommendation',
  'allowed_action',
  'risk',
  'exact_match_count',
  'related_match_count',
  'sample_existing_urls',
  'owner_approval_required',
  'gsc_required',
  'reason',
];
const csvRows = [csvHeader, ...rows.map((row) => csvHeader.map((key) => Array.isArray(row[key]) ? row[key].join(' | ') : row[key]))];
fs.writeFileSync(reportCsvPath, csvRows.map((row) => row.map(csvEscape).join(',')).join('\n'), 'utf8');

const md = `# SEO Pack Cannibalization Gate - ${date}

## Result

${summary.status}

## Honest Meaning

The SEO pack is useful as draft material, but these page drafts must not be pasted as new public URLs yet. The current site already has overlapping pages for most proposed money topics. The safe action is to merge or repair existing hubs after GSC/SERP review, not create duplicate pages.

## Summary

| Metric | Count |
| --- | ---: |
| Proposed pages checked | ${summary.proposed_pages} |
| Do not publish as new | ${summary.do_not_publish_as_new} |
| Hold as draft | ${summary.hold_draft} |
| High-risk overlaps | ${summary.high_risk} |
| Medium-risk overlaps | ${summary.medium_risk} |

## Page Decisions

| Proposed slug | Canonical candidate | Risk | Action | Why |
| --- | --- | --- | --- | --- |
${rows.map((row) => `| ${row.proposed_slug} | ${row.canonical_candidate} | ${row.risk} | ${row.recommendation} | ${row.reason} |`).join('\n')}

## Safety

${summary.safety_statement}

## Next Operator Rule

Before any WordPress paste or public publish, open this gate and decide whether the draft is a repair to an existing URL, a support-page merge, or a new URL requiring owner approval, GSC evidence and a later redirect/canonical plan.
`;

fs.writeFileSync(reportMdPath, md, 'utf8');

console.log(JSON.stringify(summary, null, 2));
