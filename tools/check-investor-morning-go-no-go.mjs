import { mkdir, readFile, writeFile } from 'node:fs/promises';

const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();
const RUN_DATE = datedFilePart();
const reportBase = `investor-morning-go-no-go-${ RUN_DATE }`;

const inputs = {
	revenueFunnel: `reports/lawyer-revenue-funnel-live-${ RUN_DATE }.json`,
	investorReadiness: `reports/investor-demo-readiness-${ RUN_DATE }.json`,
	launchpadPack: `reports/investor-launchpad-pack-${ RUN_DATE }.json`,
	paymentOverclaim: `reports/investor-payment-overclaim-${ RUN_DATE }.json`,
};

function datedFilePart() {
	const parts = new Intl.DateTimeFormat( 'en-CA', {
		timeZone: TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	} ).formatToParts( new Date() );

	const value = ( type ) => parts.find( ( part ) => part.type === type )?.value || '00';
	return `${ value( 'year' ) }-${ value( 'month' ) }-${ value( 'day' ) }`;
}

async function readJson( path ) {
	return JSON.parse( await readFile( path, 'utf8' ) );
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function countRows( rows, status ) {
	return rows.filter( ( row ) => row.status === status ).length;
}

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toCsv( rows ) {
	const headers = [ 'area', 'status', 'proof', 'blocker_or_next_step' ];
	return [
		headers.join( ',' ),
		...rows.map( ( row ) => headers.map( ( header ) => csvEscape( row[ header ] ) ).join( ',' ) ),
	].join( '\n' ) + '\n';
}

function toMarkdown( rows, totals ) {
	const readyLabel = totals.go ? 'GO_WITH_DISCLOSED_BLOCKERS' : 'NO_GO_REVIEW';

	return [
		`# Investor Morning Go/No-Go - ${ RUN_DATE }`,
		'',
		`- Status: ${ readyLabel }`,
		`- Started: ${ STARTED_AT }`,
		`- Live revenue funnel: ${ totals.revenuePass }/${ totals.revenueTotal } PASS`,
		`- Investor readiness live/source checks: ${ totals.readinessPass } PASS`,
		`- Demo-data blockers: ${ totals.demoDataBlockers }`,
		`- External payment/provider blockers: ${ totals.externalBlockers }`,
		`- Launchpad pack: ${ totals.launchpadFilePass }/${ totals.launchpadFileTotal } files and ${ totals.launchpadTokenPass }/${ totals.launchpadTokenTotal } tokens PASS`,
		`- Payment honesty gate: ${ totals.honestyPass }/${ totals.honestyTotal } honesty markers and ${ totals.overclaimPass }/${ totals.overclaimTotal } overclaim scans PASS`,
		'- Scope: local reports and read-only live checks only.',
		'- Safety: no public CMS/database content, payment, invoice, refund, lawyer record, lead, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting was changed.',
		'',
		'## Decision',
		'',
		totals.go
			? 'GO for an honest investor demo: the public route/product proof and local control pack pass. Disclose the demo-data and payment-provider blockers before any money automation question.'
			: 'NO-GO until the reviewed items below are fixed.',
		'',
		'## Control Rows',
		'',
		markdownTable( [
			[ 'Area', 'Status', 'Proof', 'Blocker / next step' ],
			[ '---', '---:', '---', '---' ],
			...rows.map( ( row ) => [ row.area, row.status, row.proof, row.blocker_or_next_step ] ),
		] ),
		'',
		'## Exact Morning Line',
		'',
		'The acquisition, onboarding, checkout fallback, private dashboard, lead CRM, follow-up notes and service-request flow are live. Payment automation is approval-gated, so the live bridge today is a real manual Morning/Grow payment link or invoice.',
		'',
		'## Do Not Fake',
		'',
		'- Do not claim automatic recurring billing is live.',
		'- Do not claim a branded invoice or refund happened unless the provider proves it.',
		'- Do not call demo lawyer/lead data real unless it is an actual approved customer record.',
		'- Do not create live CMS/payment/lead/customer data without explicit owner approval.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-live-lawyer-revenue-funnel.mjs',
		'node tools\\check-investor-demo-readiness.mjs',
		'node tools\\check-investor-launchpad-pack.mjs',
		'node tools\\check-investor-payment-overclaim.mjs',
		'node tools\\check-investor-morning-go-no-go.mjs',
		'```',
		'',
	].join( '\n' );
}

async function main() {
	await mkdir( 'reports', { recursive: true } );
	await mkdir( 'project-control', { recursive: true } );

	const revenue = await readJson( inputs.revenueFunnel );
	const readiness = await readJson( inputs.investorReadiness );
	const launchpad = await readJson( inputs.launchpadPack );
	const overclaim = await readJson( inputs.paymentOverclaim );

	const readinessRows = readiness.rows || [];
	const launchpadFiles = launchpad.fileResults || [];
	const launchpadTokens = launchpad.tokenResults || [];
	const honesty = overclaim.honestyResults || [];
	const overclaimRows = overclaim.overclaimResults || [];

	const totals = {
		revenuePass: revenue.passCount ?? countRows( revenue.results || [], 'PASS' ),
		revenueTotal: ( revenue.passCount ?? 0 ) + ( revenue.reviewCount ?? 0 ) || ( revenue.results || [] ).length,
		readinessPass: countRows( readinessRows, 'PASS' ),
		readinessReview: readinessRows.filter( ( row ) => ! [ 'PASS', 'NEEDS_DEMO_DATA', 'EXTERNAL_BLOCKER' ].includes( row.status ) ).length,
		demoDataBlockers: countRows( readinessRows, 'NEEDS_DEMO_DATA' ),
		externalBlockers: countRows( readinessRows, 'EXTERNAL_BLOCKER' ),
		launchpadFilePass: countRows( launchpadFiles, 'PASS' ),
		launchpadFileTotal: launchpadFiles.length,
		launchpadTokenPass: countRows( launchpadTokens, 'PASS' ),
		launchpadTokenTotal: launchpadTokens.length,
		honestyPass: countRows( honesty, 'PASS' ),
		honestyTotal: honesty.length,
		overclaimPass: countRows( overclaimRows, 'PASS' ),
		overclaimTotal: overclaimRows.length,
	};

	totals.go = (
		totals.revenuePass === totals.revenueTotal &&
		readiness.status === 'PASS_WITH_DISCLOSED_BLOCKERS' &&
		totals.readinessReview === 0 &&
		totals.launchpadFilePass === totals.launchpadFileTotal &&
		totals.launchpadTokenPass === totals.launchpadTokenTotal &&
		overclaim.status === 'PASS' &&
		totals.honestyPass === totals.honestyTotal &&
		totals.overclaimPass === totals.overclaimTotal
	);

	const rows = [
		{
			area: 'Public revenue funnel',
			status: totals.revenuePass === totals.revenueTotal ? 'GO' : 'REVIEW',
			proof: `${ totals.revenuePass }/${ totals.revenueTotal } live checks PASS`,
			blocker_or_next_step: 'Open homepage, lawyer plans, checkout fallback, registration prefill and dashboard gate from the launchpad.',
		},
		{
			area: 'Investor readiness',
			status: readiness.status,
			proof: `${ totals.readinessPass } source/live checks PASS`,
			blocker_or_next_step: `${ totals.demoDataBlockers } demo-data blockers and ${ totals.externalBlockers } provider/payment blockers must be disclosed.`,
		},
		{
			area: 'Launchpad pack',
			status: launchpad.status,
			proof: `${ totals.launchpadFilePass }/${ totals.launchpadFileTotal } files, ${ totals.launchpadTokenPass }/${ totals.launchpadTokenTotal } tokens PASS`,
			blocker_or_next_step: 'Use the local launchpad as the meeting control screen.',
		},
		{
			area: 'Payment honesty',
			status: overclaim.status,
			proof: `${ totals.honestyPass }/${ totals.honestyTotal } honesty markers, ${ totals.overclaimPass }/${ totals.overclaimTotal } overclaim scans PASS`,
			blocker_or_next_step: 'Use manual Grow/Morning payment-link language until provider proof exists.',
		},
		{
			area: 'Real-money proof',
			status: totals.externalBlockers ? 'DISCLOSE_BLOCKER' : 'GO',
			proof: 'Service/request capture is ready; actual money movement remains provider-approved.',
			blocker_or_next_step: 'Real low-amount payment, branded invoice and refund execution require explicit owner/provider-approved action.',
		},
	];

	const payload = {
		status: totals.go ? 'GO_WITH_DISCLOSED_BLOCKERS' : 'NO_GO_REVIEW',
		startedAt: STARTED_AT,
		runDate: RUN_DATE,
		inputs,
		totals,
		rows,
	};

	await writeFile( `reports/${ reportBase }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
	await writeFile( `reports/${ reportBase }.csv`, toCsv( rows ) );
	await writeFile( `project-control/${ reportBase }.md`, toMarkdown( rows, totals ) );
	await writeFile( `project-control/${ reportBase }.csv`, toCsv( rows ) );

	console.log( `${ payload.status }: investor morning go/no-go generated with revenue ${ totals.revenuePass }/${ totals.revenueTotal }, readiness ${ readiness.status }, launchpad ${ launchpad.status }, payment honesty ${ overclaim.status }.` );
}

main().catch( ( error ) => {
	console.error( error );
	process.exitCode = 1;
} );
