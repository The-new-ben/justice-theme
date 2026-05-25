import { mkdir, readFile, writeFile } from 'node:fs/promises';

const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();
const RUN_DATE = datedFilePart();
const reportBase = `investor-payment-overclaim-${ RUN_DATE }`;

const filesToCheck = [
	'project-control/investor-demo-launchpad-2026-05-25.html',
	'project-control/investor-demo-morning-control-sheet-2026-05-25.md',
	'project-control/investor-demo-scenario-script-2026-05-25.md',
	'project-control/investor-payment-lifecycle-playbook-2026-05-25.md',
	'project-control/investor-demo-readiness-2026-05-25.md',
	'project-control/investor-launchpad-pack-2026-05-25.md',
];

const requiredHonestyTokens = [
	{
		id: 'provider-gated',
		token: 'provider-gated',
		reason: 'The demo must disclose that recurring billing, branded invoices and refunds depend on provider approval/setup.',
	},
	{
		id: 'manual-payment-link',
		token: 'manual',
		reason: 'The current revenue bridge is manual payment-link/invoice handling, not full automation.',
	},
	{
		id: 'do-not-claim-recurring',
		token: 'Do not claim recurring billing',
		reason: 'The operator needs a visible guardrail against overclaiming recurring billing.',
	},
];

const overclaimPatterns = [
	{
		id: 'fully-automated-payments',
		pattern: /\bfully automated\b.{0,80}\b(payment|billing|invoice|refund|subscription|recurring)/i,
		allowedIfNearby: /not claim|must not|do not|cannot|provider-gated|approval-gated|until/i,
		reason: 'Do not claim fully automated money movement before provider proof.',
	},
	{
		id: 'automatic-recurring-live',
		pattern: /\b(automatic|automated)\b.{0,80}\b(recurring|subscription|billing)\b.{0,80}\b(live|ready|working|approved|active)/i,
		allowedIfNearby: /not claim|must not|do not|cannot|provider-gated|approval-gated|until|remaining/i,
		reason: 'Recurring billing remains approval/provider gated.',
	},
	{
		id: 'automatic-invoice-live',
		pattern: /\b(automatic|automated|branded)\b.{0,80}\binvoice\b.{0,80}\b(live|ready|working|approved|generated)/i,
		allowedIfNearby: /not claim|must not|do not|cannot|provider-gated|depends|until|remaining|blocker|blocked|requires|require|approval-gated|external_blocker/i,
		reason: 'Branded invoice proof must come from the provider.',
	},
	{
		id: 'refund-executed',
		pattern: /\brefund\b.{0,80}\b(executed|completed|automatic|automated|live|working)/i,
		allowedIfNearby: /not claim|must not|do not|cannot|provider-gated|owner approves|if owner approves|until|remaining|blocker|blocked|requires|require|approval-gated|external_blocker/i,
		reason: 'Refund execution must not be claimed without a real provider refund.',
	},
	{
		id: 'fake-data-real',
		pattern: /\b(demo lead|demo lawyer|demo data)\b.{0,80}\b(real|actual|live customer|paying customer)/i,
		allowedIfNearby: /do not|unless true|if approved|safe demo|controlled demo|blocker|blocked|requires|require|approval-gated/i,
		reason: 'Demo data must not be described as a real customer unless it truly is.',
	},
];

const sourceBasis = [
	{
		name: 'Stripe Customer Portal',
		url: 'https://docs.stripe.com/billing/subscriptions/customer-portal',
		meaning: 'Mature customer portals expose billing details, payment methods, invoices, subscription status and cancellation where configured.',
	},
	{
		name: 'Chargebee Self-Serve Portal',
		url: 'https://www.chargebee.com/docs/1.0/self-serve-portal.html',
		meaning: 'Self-serve billing portals commonly cover subscription changes, cancellation/reactivation, invoices, payment methods and billing addresses.',
	},
];

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

function normalize( value ) {
	return value.replaceAll( /\s+/g, ' ' );
}

function excerptAround( text, index, length ) {
	const start = Math.max( 0, index - 90 );
	const end = Math.min( text.length, index + length + 90 );
	return normalize( text.slice( start, end ) ).trim();
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( honestyResults, overclaimResults ) {
	const rows = [
		[ 'type', 'id', 'status', 'file', 'detail', 'reason' ],
		...honestyResults.map( ( result ) => [
			'honesty_token',
			result.id,
			result.status,
			result.files.join( '|' ) || '-',
			result.token,
			result.reason,
		] ),
		...overclaimResults.map( ( result ) => [
			'overclaim_scan',
			result.id,
			result.status,
			result.file,
			result.excerpt || '-',
			result.reason,
		] ),
	];

	return rows.map( ( row ) => row.map( csvEscape ).join( ',' ) ).join( '\n' ) + '\n';
}

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toMarkdown( honestyResults, overclaimResults ) {
	const honestyPass = honestyResults.filter( ( result ) => result.status === 'PASS' ).length;
	const overclaimPass = overclaimResults.filter( ( result ) => result.status === 'PASS' ).length;
	const reviewCount = ( honestyResults.length - honestyPass ) + ( overclaimResults.length - overclaimPass );
	const status = reviewCount ? 'REVIEW' : 'PASS';

	return [
		`# Investor Payment Overclaim Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ status }`,
		`- Started: ${ STARTED_AT }`,
		`- Honesty markers passed: ${ honestyPass }/${ honestyResults.length }`,
		`- Overclaim scans passed: ${ overclaimPass }/${ overclaimResults.length }`,
		'- Scope: local investor demo materials only.',
		'- Safety: no public CMS/database content, payment, invoice, refund, lawyer record, lead, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting was changed.',
		'',
		'## Current Best-Practice Basis',
		'',
		...sourceBasis.map( ( source ) => `- ${ source.name }: ${ source.meaning } Source: ${ source.url }` ),
		'',
		'## Required Honesty Markers',
		'',
		markdownTable( [
			[ 'Marker', 'Status', 'Found in', 'Why it matters' ],
			[ '---', '---:', '---', '---' ],
			...honestyResults.map( ( result ) => [ `\`${ result.token }\``, result.status, result.files.join( '<br>' ) || '-', result.reason ] ),
		] ),
		'',
		'## Overclaim Scans',
		'',
		markdownTable( [
			[ 'Risk', 'Status', 'File', 'Evidence' ],
			[ '---', '---:', '---', '---' ],
			...overclaimResults.map( ( result ) => [ result.id, result.status, result.file, result.excerpt || 'No unsafe overclaim found' ] ),
		] ),
		'',
		'## Completion Assessment',
		'',
		reviewCount
			? 'The investor materials need review before the payment conversation because at least one honesty marker is missing or an unsafe overclaim appears.'
			: 'The investor materials keep the payment story honest: manual payment links are the current bridge, and recurring billing, branded invoices and refunds are disclosed as provider-gated.',
		'',
		'Remaining blockers are unchanged: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-investor-payment-overclaim.mjs',
		'```',
		'',
	].join( '\n' );
}

async function main() {
	await mkdir( 'reports', { recursive: true } );
	await mkdir( 'project-control', { recursive: true } );

	const docs = await Promise.all( filesToCheck.map( async ( file ) => ( {
		file,
		text: await readFile( file, 'utf8' ),
	} ) ) );

	const honestyResults = requiredHonestyTokens.map( ( marker ) => {
		const files = docs.filter( ( doc ) => doc.text.includes( marker.token ) ).map( ( doc ) => doc.file );
		return {
			...marker,
			files,
			status: files.length ? 'PASS' : 'REVIEW',
		};
	} );

	const overclaimResults = overclaimPatterns.flatMap( ( check ) => {
		const hits = [];

		for ( const doc of docs ) {
			const match = doc.text.match( check.pattern );

			if ( ! match || match.index === undefined ) {
				continue;
			}

			const excerpt = excerptAround( doc.text, match.index, match[ 0 ].length );
			hits.push( {
				...check,
				status: check.allowedIfNearby.test( excerpt ) ? 'PASS' : 'REVIEW',
				file: doc.file,
				excerpt,
			} );
		}

		return hits.length ? hits : [ {
			...check,
			status: 'PASS',
			file: '-',
			excerpt: '',
		} ];
	} );

	const payload = {
		status: honestyResults.every( ( result ) => result.status === 'PASS' ) && overclaimResults.every( ( result ) => result.status === 'PASS' ) ? 'PASS' : 'REVIEW',
		startedAt: STARTED_AT,
		runDate: RUN_DATE,
		sourceBasis,
		filesToCheck,
		honestyResults,
		overclaimResults,
	};

	await writeFile( `reports/${ reportBase }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
	await writeFile( `reports/${ reportBase }.csv`, toCsv( honestyResults, overclaimResults ) );
	await writeFile( `project-control/${ reportBase }.md`, toMarkdown( honestyResults, overclaimResults ) );
	await writeFile( `project-control/${ reportBase }.csv`, toCsv( honestyResults, overclaimResults ) );

	console.log( `${ payload.status }: investor payment overclaim check ${ honestyResults.filter( ( result ) => result.status === 'PASS' ).length }/${ honestyResults.length } honesty markers and ${ overclaimResults.filter( ( result ) => result.status === 'PASS' ).length }/${ overclaimResults.length } overclaim scans passed.` );
}

main().catch( ( error ) => {
	console.error( error );
	process.exitCode = 1;
} );
