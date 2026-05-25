import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packDir = path.join(root, 'mnt', 'documents', 'justice');
const reportDir = path.join(root, 'reports');
const controlDir = path.join(root, 'project-control');
const date = '2026-05-25';

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(controlDir, { recursive: true });

const requiredFiles = [
  'STEP_0_honest-access-report.md',
  'STEP_1_keywords.json',
  'STEP_2_serp_xray.json',
  'STEP_2_competitors.json',
  'STEP_4_blueprint.md',
  'STEP_5_gaps.md',
  'STEP_5_new_pages.json',
  'homepage.html',
  'homepage_meta.json',
  'homepage_images.json',
  'seo-meta.json',
  'schema-bundle.json',
  'images-to-generate.json',
  'internal-linking-map.csv',
  'research-log.md',
  '90-day-roadmap.md',
  'wordpress-deployment.md',
  'quality-gates.md',
  'quality-gates.json',
];

const requiredCompetitorFiles = [
  'STEP_3_competitors/din-co-il.json',
  'STEP_3_competitors/psakdin-co-il.json',
  'STEP_3_competitors/lawreviews-co-il.json',
  'STEP_3_competitors/justia-com.json',
  'STEP_3_competitors/avvo-com.json',
];

const requiredInternalPages = [
  'internal-pages/divorce-family-lawyer.html',
  'internal-pages/real-estate-lawyer.html',
  'internal-pages/medical-malpractice-lawyer.html',
  'internal-pages/inheritance-wills-lawyer.html',
  'internal-pages/criminal-lawyer.html',
  'internal-pages/employment-lawyer.html',
  'internal-pages/tax-business-lawyer.html',
];

const forbiddenTerms = [
  { label: 'long dash', value: '\u2014' },
  { label: 'generic opener', value: 'במאמר זה' },
  { label: 'generic closer', value: 'לסיכום' },
  { label: 'English AI cliche', value: 'delve' },
];

function read(relativePath) {
  return fs.readFileSync(path.join(packDir, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(packDir, relativePath));
}

function wordCount(text) {
  return (text.match(/[\u0590-\u05FF\w"'״׳]+/g) || []).length;
}

function parseJson(relativePath, errors) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

const missingFiles = [...requiredFiles, ...requiredCompetitorFiles, ...requiredInternalPages]
  .filter((relativePath) => !exists(relativePath));

const jsonErrors = [];
const keywords = parseJson('STEP_1_keywords.json', jsonErrors);
const serp = parseJson('STEP_2_serp_xray.json', jsonErrors);
const competitors = parseJson('STEP_2_competitors.json', jsonErrors);
const pages = parseJson('STEP_5_new_pages.json', jsonErrors);
const seoMeta = parseJson('seo-meta.json', jsonErrors);
const schema = parseJson('schema-bundle.json', jsonErrors);
const images = parseJson('images-to-generate.json', jsonErrors);
const quality = parseJson('quality-gates.json', jsonErrors);

const homepageText = exists('homepage.html') ? read('homepage.html') : '';
const homepageWordCount = wordCount(homepageText);
const internalPageResults = requiredInternalPages.map((relativePath) => {
  const text = exists(relativePath) ? read(relativePath) : '';
  return {
    file: relativePath,
    words: wordCount(text),
    pass: wordCount(text) >= 3000,
  };
});

const scannedContentFiles = [
  'homepage.html',
  ...requiredInternalPages,
  'STEP_4_blueprint.md',
  'STEP_5_gaps.md',
  '90-day-roadmap.md',
  'wordpress-deployment.md',
];

const forbiddenHits = scannedContentFiles.flatMap((relativePath) => {
  if (!exists(relativePath)) return [];
  const text = read(relativePath);
  return forbiddenTerms
    .filter((term) => text.includes(term.value))
    .map((term) => ({ file: relativePath, term: term.label }));
});

const keywordCandidates = keywords?.candidates || [];
const keywordMetricSummary = {
  total: keywordCandidates.length,
  has_volume: keywordCandidates.filter((item) => item.volume !== null && item.volume !== undefined).length,
  has_cpc: keywordCandidates.filter((item) => item.cpc !== null && item.cpc !== undefined).length,
  has_kdi: keywordCandidates.filter((item) => item.kdi !== null && item.kdi !== undefined).length,
  missing_metric_items: keywordCandidates.filter((item) => item.metric_status === 'NEEDS_KEYWORD_PLANNER_OR_SEMRUSH_EXPORT').length,
  baseline_metric_items: keywordCandidates.filter((item) => item.metric_status === 'PARTIAL_NUMERIC_BASELINE').length,
};

const sourceCount = (read('research-log.md').match(/^\| \d+ \|/gm) || []).length;
const competitorCount = competitors?.competitors?.length || 0;
const newPageCount = Array.isArray(pages) ? pages.length : 0;
const metaCount = Array.isArray(seoMeta) ? seoMeta.length : 0;
const imagePromptCount = Array.isArray(images) ? images.length : 0;

const hardFails = [];
const partials = [];

if (missingFiles.length) hardFails.push(`Missing deliverables: ${missingFiles.join(', ')}`);
if (jsonErrors.length) hardFails.push(`JSON parse errors: ${jsonErrors.join('; ')}`);
if (homepageWordCount < 5000) hardFails.push(`Homepage word count is ${homepageWordCount}, below 5000`);
for (const page of internalPageResults) {
  if (!page.pass) hardFails.push(`${page.file} word count is ${page.words}, below 3000`);
}
if (forbiddenHits.length) hardFails.push(`Forbidden phrases found: ${forbiddenHits.map((hit) => `${hit.file}:${hit.term}`).join(', ')}`);
if (keywordMetricSummary.total < 200) hardFails.push(`Keyword candidates below requested lower bound: ${keywordMetricSummary.total}`);
if (sourceCount < 50) hardFails.push(`Research source count below 50: ${sourceCount}`);
if (competitorCount < 8) hardFails.push(`Competitor list below 8: ${competitorCount}`);
if (newPageCount < 5) hardFails.push(`New page plan below 5: ${newPageCount}`);
if (!schema?.homepage || !schema?.pages) hardFails.push('Schema bundle missing homepage/pages sections');

if (keywordMetricSummary.has_cpc === 0 || keywordMetricSummary.has_kdi === 0) {
  partials.push('Keyword CPC/KDI remain unavailable because no premium/export source is connected.');
}
if (serp?.honest_status?.includes('Partial')) {
  partials.push('SERP x-ray remains partial and needs real Google IL/Semrush export to be final.');
}
if (quality?.gates?.rich_results_test?.startsWith('NOT_RUN')) {
  partials.push('Rich Results Test was not externally executed.');
}

const result = {
  generated_at: `${date} Asia/Jerusalem`,
  pack_dir: packDir,
  status: hardFails.length ? 'FAIL' : partials.length ? 'PASS_WITH_DISCLOSED_PARTIALS' : 'PASS',
  hard_fails: hardFails,
  partials,
  counts: {
    keyword_candidates: keywordMetricSummary.total,
    competitor_records: competitorCount,
    new_pages: newPageCount,
    seo_meta_entries: metaCount,
    image_prompts: imagePromptCount,
    research_sources: sourceCount,
    homepage_words: homepageWordCount,
  },
  keyword_metric_summary: keywordMetricSummary,
  internal_page_results: internalPageResults,
  forbidden_hits: forbiddenHits,
  safety_statement: 'Validation only. No CMS/database, payment, invoice, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.',
  next_gate: 'Provide Semrush/Keyword Planner/GSC exports or connected access to turn keyword/SERP partials into final numeric gates.',
};

fs.writeFileSync(
  path.join(reportDir, 'justice-seo-pack-validation-2026-05-25.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);

const md = `# Jus-Tice SEO Pack Validation - ${date}

## Result

${result.status}

## Counts

| Gate | Value |
| --- | ---: |
| Keyword candidates | ${result.counts.keyword_candidates} |
| Competitor records | ${result.counts.competitor_records} |
| New page plans | ${result.counts.new_pages} |
| SEO meta entries | ${result.counts.seo_meta_entries} |
| Image prompts | ${result.counts.image_prompts} |
| Research sources | ${result.counts.research_sources} |
| Homepage words | ${result.counts.homepage_words} |

## Internal Pages

| File | Words | Pass |
| --- | ---: | --- |
${internalPageResults.map((page) => `| ${page.file} | ${page.words} | ${page.pass ? 'PASS' : 'FAIL'} |`).join('\n')}

## Hard Fails

${hardFails.length ? hardFails.map((item) => `- ${item}`).join('\n') : '- None'}

## Disclosed Partials

${partials.length ? partials.map((item) => `- ${item}`).join('\n') : '- None'}

## Keyword Metrics

| Metric | Count |
| --- | ---: |
| Total candidates | ${keywordMetricSummary.total} |
| Has volume | ${keywordMetricSummary.has_volume} |
| Has CPC | ${keywordMetricSummary.has_cpc} |
| Has KDI | ${keywordMetricSummary.has_kdi} |
| Needs export metrics | ${keywordMetricSummary.missing_metric_items} |
| Baseline metric items | ${keywordMetricSummary.baseline_metric_items} |

## Safety

${result.safety_statement}

## Next Gate

${result.next_gate}
`;

fs.writeFileSync(
  path.join(controlDir, 'justice-seo-pack-validation-2026-05-25.md'),
  md,
  'utf8'
);

console.log(JSON.stringify(result, null, 2));
