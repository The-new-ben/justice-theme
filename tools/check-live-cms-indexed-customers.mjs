import fs from 'node:fs/promises';

const RUN_DATE = '2026-05-25';
const SITE = 'https://jus-tice.co.il';

async function readUrl(url) {
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'Jus-Tice-CMS-Index-Reporter/1.0',
		},
	});

	const text = await response.text();
	return {
		ok: response.ok,
		status: response.status,
		headers: response.headers,
		text,
		url,
	};
}

function stripHtml(value) {
	return String(value || '')
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function csvEscape(value) {
	return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

const restUrl = `${SITE}/wp-json/wp/v2/justice_lawyer?per_page=100&_fields=id,slug,link,title`;
const lawyersUrl = `${SITE}/lawyers/?justice_readonly=1`;

const [rest, archive] = await Promise.all([readUrl(restUrl), readUrl(lawyersUrl)]);
let restProfiles = [];
try {
	restProfiles = JSON.parse(rest.text);
} catch {
	restProfiles = [];
}

const cardMatches = [...archive.text.matchAll(/<article class="lawyer-card[\s\S]*?<\/article>/g)];
const visibleCards = cardMatches.map((match) => stripHtml(match[0])).filter(Boolean);

const report = {
	runDate: RUN_DATE,
	scope: 'Read-only live public CMS/index inspection',
	rest: {
		status: rest.status,
		totalHeader: rest.headers.get('x-wp-total') || '',
		countReturned: Array.isArray(restProfiles) ? restProfiles.length : 0,
		profiles: Array.isArray(restProfiles)
			? restProfiles.map((profile) => ({
				id: profile.id,
				slug: profile.slug,
				title: stripHtml(profile.title?.rendered || ''),
				link: profile.link,
			}))
			: [],
	},
	archive: {
		status: archive.status,
		visibleCardCount: visibleCards.length,
		visibleCards: visibleCards.slice(0, 20),
	},
	legalServices: {
		publicSupplierMarketplace: 'not_public',
		note: 'The theme has an internal justice_supplier CMS pipeline, but it is intentionally admin-only and not indexed publicly.',
	},
	safety: 'No CMS/database write, public content change, lawyer profile creation, supplier creation, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.',
};

const rows = [
	['type', 'id_or_index', 'title_or_label', 'url_or_status', 'notes'],
	...report.rest.profiles.map((profile) => [
		'cms_rest_profile',
		profile.id,
		profile.title,
		profile.link,
		profile.slug,
	]),
	...report.archive.visibleCards.map((card, index) => [
		'visible_directory_card',
		index + 1,
		card.slice(0, 140),
		lawyersUrl,
		'Rendered from live /lawyers/ page',
	]),
	[
		'legal_supplier_marketplace',
		'public',
		'Legal services / supplier cards',
		'not_public',
		'Internal justice_supplier CMS exists but public index is not enabled.',
	],
];

const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n';

const markdown = `# Live CMS Indexed Customers Report - ${RUN_DATE}

## Honest Status

- Public lawyer REST records returned: ${report.rest.countReturned}.
- Visible lawyer cards on live directory: ${report.archive.visibleCardCount}.
- Public legal-service/supplier cards: not public yet.
- CMS blocker: WordPress admin login is currently behind the uPress/F5 image-code challenge, so new CMS records cannot be created until the owner solves that challenge or provides an application password that works with REST.

## Current Public Lawyer Records

| ID | Name | URL |
| ---: | --- | --- |
${report.rest.profiles.map((profile) => `| ${profile.id} | ${profile.title} | ${profile.link} |`).join('\n') || '| - | None returned | - |'}

## Visible Directory Cards

${report.archive.visibleCards.map((card, index) => `${index + 1}. ${card}`).join('\n') || 'No visible cards extracted.'}

## Legal Services / Professionals

The codebase has a real CMS post type for legal-service suppliers, \`justice_supplier\`, but it is private/admin-only today. That means legal-service professionals are not yet publicly indexed on the website. The safe next step is to create internal supplier records first, then expose public cards only after partnership/compliance approval.

## Safety

${report.safety}
`;

await fs.mkdir('reports', { recursive: true });
await fs.mkdir('project-control', { recursive: true });
await fs.writeFile(`reports/live-cms-indexed-customers-${RUN_DATE}.json`, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(`reports/live-cms-indexed-customers-${RUN_DATE}.csv`, csv);
await fs.writeFile(`project-control/live-cms-indexed-customers-${RUN_DATE}.md`, markdown);
await fs.writeFile(`project-control/live-cms-indexed-customers-${RUN_DATE}.csv`, csv);

console.log(`Live CMS indexed customers: ${report.rest.countReturned} REST records, ${report.archive.visibleCardCount} visible cards.`);
