const BASE_URL = 'https://jus-tice.co.il';
const TIME_ZONE = 'Asia/Jerusalem';
const EXPECTED_MARKER = '2026-05-24-lawyer-payment-handoff-v1';

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

const RUN_DATE = datedFilePart();
const STARTED_AT = new Date().toISOString();

function absoluteUrl( pathOrUrl ) {
	return new URL( pathOrUrl, BASE_URL ).toString();
}

async function fetchText( pathOrUrl ) {
	const controller = new AbortController();
	const timeout = setTimeout( () => controller.abort(), 25000 );

	try {
		const response = await fetch( absoluteUrl( pathOrUrl ), {
			cache: 'no-store',
			redirect: 'follow',
			signal: controller.signal,
			headers: {
				Accept: '*/*',
				'Cache-Control': 'no-cache',
				'User-Agent': 'Jus-Tice-Payment-Handoff-Deployment-Checker/1.0',
			},
		} );
		const body = await response.text();

		return { response, body };
	} finally {
		clearTimeout( timeout );
	}
}

async function runCheck( check ) {
	const started = Date.now();
	const { response, body } = await fetchText( check.url );
	const durationMs = Date.now() - started;
	const missing = check.required.filter( ( token ) => ! body.includes( token ) );
	const passed = response.ok && missing.length === 0;

	return {
		id: check.id,
		name: check.name,
		status: passed ? 'PASS' : 'REVIEW',
		http: response.status,
		bytes: body.length,
		durationMs,
		url: absoluteUrl( check.url ),
		finalUrl: response.url,
		missing,
	};
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( results ) {
	const headers = [ 'id', 'status', 'http', 'bytes', 'durationMs', 'missing', 'url', 'finalUrl' ];
	return [
		headers.join( ',' ),
		...results.map( ( result ) => headers.map( ( header ) => csvEscape(
			'missing' === header ? ( result.missing.length ? result.missing : '-' ) : result[ header ]
		) ).join( ',' ) ),
	].join( '\n' ) + '\n';
}

function toMarkdown( results ) {
	const passCount = results.filter( ( result ) => 'PASS' === result.status ).length;
	const reviewCount = results.length - passCount;
	const statusLabel = reviewCount ? 'REVIEW' : 'PASS';

	return [
		`# Payment Handoff Live Deployment Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ statusLabel }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Expected marker: ${ EXPECTED_MARKER }`,
		`- Checks passed: ${ passCount }/${ results.length }`,
		`- Checks needing review: ${ reviewCount }`,
		'- Scope: read-only public deployment marker checks only.',
		'- Safety: no CMS record, lawyer profile, payment, invoice, refund, email, WhatsApp, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or wp-admin setting was changed.',
		'',
		'| Check | Status | HTTP | Missing | Final URL |',
		'|---|---:|---:|---|---|',
		...results.map( ( result ) => [
			result.name,
			result.status,
			String( result.http ),
			result.missing.join( '<br>' ) || '-',
			result.finalUrl,
		].map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ),
		'',
		'## Owner Meaning',
		'',
		reviewCount
			? 'The latest lawyer payment-handoff code has not been proven live yet. Run uPress Pull Git for `wp-content/themes/justice-theme`, then rerun this checker before relying on the email/WhatsApp payment handoff in the investor demo.'
			: 'The live site is serving the payment-handoff deployment marker. This proves uPress has pulled the theme revision that contains the owner-side email and WhatsApp payment-link handoff code.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-payment-handoff-live-deployment.mjs',
		'```',
		'',
	].join( '\n' );
}

const checks = [
	{
		id: 'homepage-runtime-marker',
		name: 'Homepage runtime deployment marker',
		url: `/?payment_handoff_marker_check=${ Date.now() }`,
		required: [
			'justice-deployment-marker',
			EXPECTED_MARKER,
		],
	},
	{
		id: 'static-theme-marker',
		name: 'Static theme deployment marker',
		url: `/wp-content/themes/justice-theme/deployment-marker.txt?payment_handoff_marker_check=${ Date.now() }`,
		required: [
			`justice-theme-deployment-marker=${ EXPECTED_MARKER }`,
			'expected-github-main-commit=lawyer-payment-handoff-v1',
		],
	},
];

const results = [];

for ( const check of checks ) {
	try {
		results.push( await runCheck( check ) );
	} catch ( error ) {
		results.push( {
			id: check.id,
			name: check.name,
			status: 'REVIEW',
			http: 0,
			bytes: 0,
			durationMs: 0,
			url: absoluteUrl( check.url ),
			finalUrl: '',
			missing: check.required,
			error: error instanceof Error ? error.message : String( error ),
		} );
	}
}

const report = {
	startedAt: STARTED_AT,
	runDate: RUN_DATE,
	baseUrl: BASE_URL,
	expectedMarker: EXPECTED_MARKER,
	passCount: results.filter( ( result ) => 'PASS' === result.status ).length,
	reviewCount: results.filter( ( result ) => 'PASS' !== result.status ).length,
	results,
};

const csv = toCsv( results );
const markdown = toMarkdown( results );

await import( 'node:fs/promises' ).then( async ( fs ) => {
	await fs.mkdir( 'reports', { recursive: true } );
	await fs.mkdir( 'project-control', { recursive: true } );
	await fs.writeFile( `reports/payment-handoff-live-deployment-${ RUN_DATE }.json`, JSON.stringify( report, null, 2 ) + '\n' );
	await fs.writeFile( `reports/payment-handoff-live-deployment-${ RUN_DATE }.csv`, csv );
	await fs.writeFile( `project-control/payment-handoff-live-deployment-${ RUN_DATE }.md`, markdown );
	await fs.writeFile( `project-control/payment-handoff-live-deployment-${ RUN_DATE }.csv`, csv );
} );

console.table( results.map( ( result ) => ( {
	id: result.id,
	status: result.status,
	http: result.http,
	missing: result.missing.join( '|' ) || '-',
	finalUrl: result.finalUrl,
} ) ) );

if ( report.reviewCount > 0 ) {
	process.exitCode = 1;
}
