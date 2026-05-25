import fs from 'node:fs/promises';

const RUN_DATE = '2026-05-25';
const csvPath = `project-control/legal-service-supplier-cms-index-candidates-${RUN_DATE}.csv`;
const mdPath = `project-control/legal-service-supplier-cms-index-candidates-${RUN_DATE}.md`;

const csv = await fs.readFile(csvPath, 'utf8');
const md = await fs.readFile(mdPath, 'utf8');
const lines = csv.trim().split(/\r?\n/);
const header = lines[0].split(',').map((value) => value.replace(/^"|"$/g, ''));
const rows = lines.slice(1);

const requiredColumns = [
	'source_url',
	'candidate_name',
	'supplier_category',
	'supplier_service_area',
	'supplier_revenue_model',
	'supplier_priority',
	'supplier_partnership_status',
	'safe_public_positioning',
	'why_lawyers_buy_it',
	'do_not_claim',
];

const requiredCategories = [
	'translation_notary',
	'expert_witness',
	'legal_tech',
	'finance_tax',
	'training_events',
];

const missingColumns = requiredColumns.filter((column) => ! header.includes(column));
const categoryHits = Object.fromEntries(requiredCategories.map((category) => [category, csv.includes(`"${category}"`)]));
const requiredMarkdownTokens = [
	'Current public legal-services index on Jus-Tice: `0`',
	'justice_supplier',
	'Do not expose these as public marketplace cards',
	'Revenue Expectation',
	'Completion Assessment',
];
const missingMarkdownTokens = requiredMarkdownTokens.filter((token) => ! md.includes(token));

const checks = [
	{
		id: 'row-count',
		status: rows.length >= 10 ? 'PASS' : 'FAIL',
		detail: `${rows.length} supplier candidates found`,
	},
	{
		id: 'required-columns',
		status: 0 === missingColumns.length ? 'PASS' : 'FAIL',
		detail: missingColumns.length ? `Missing: ${missingColumns.join(', ')}` : 'All required columns present',
	},
	...Object.entries(categoryHits).map(([category, hit]) => ({
		id: `category-${category}`,
		status: hit ? 'PASS' : 'FAIL',
		detail: hit ? `${category} represented` : `${category} missing`,
	})),
	{
		id: 'markdown-governance',
		status: 0 === missingMarkdownTokens.length ? 'PASS' : 'FAIL',
		detail: missingMarkdownTokens.length ? `Missing: ${missingMarkdownTokens.join(', ')}` : 'Governance and revenue tokens present',
	},
];

const status = checks.every((check) => 'PASS' === check.status) ? 'PASS' : 'REVIEW';

const report = {
	runDate: RUN_DATE,
	status,
	candidateCount: rows.length,
	checks,
	safety: 'Repo-only supplier candidate validation. No live CMS record, public supplier page, outreach, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.',
};

const reportMd = `# Legal Service Supplier Candidate Check - ${RUN_DATE}

- Status: ${status}
- Supplier candidates: ${rows.length}
- Safety: ${report.safety}

## Checks

| Check | Status | Detail |
| --- | --- | --- |
${checks.map((check) => `| ${check.id} | ${check.status} | ${check.detail} |`).join('\n')}
`;

const reportCsv = [
	['check', 'status', 'detail'],
	...checks.map((check) => [check.id, check.status, check.detail]),
].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';

await fs.mkdir('reports', { recursive: true });
await fs.writeFile(`reports/legal-service-supplier-index-candidates-${RUN_DATE}.json`, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(`reports/legal-service-supplier-index-candidates-${RUN_DATE}.csv`, reportCsv);
await fs.writeFile(`project-control/legal-service-supplier-index-candidates-check-${RUN_DATE}.md`, reportMd);
await fs.writeFile(`project-control/legal-service-supplier-index-candidates-check-${RUN_DATE}.csv`, reportCsv);

if ('PASS' !== status) {
	console.error(reportMd);
	process.exit(1);
}

console.log(`Legal service supplier candidate check: ${status} (${rows.length} candidates).`);
