const BASE_URL = 'https://jus-tice.co.il';
const TIME_ZONE = 'Asia/Jerusalem';
const EXPECTED_MARKER = '2026-05-24-owner-demo-control-panel-v1';

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
const CACHE_BUST = Date.now();

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
				'User-Agent': 'Jus-Tice-Homepage-Investor-Polish/1.0',
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
	const missing = check.required.filter( ( token ) => ! body.includes( token ) );
	const passed = response.ok && missing.length === 0;

	return {
		id: check.id,
		name: check.name,
		status: passed ? 'PASS' : 'REVIEW',
		http: response.status,
		bytes: body.length,
		durationMs: Date.now() - started,
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
		`# Homepage Investor Polish Live Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ statusLabel }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Expected marker: ${ EXPECTED_MARKER }`,
		`- Checks passed: ${ passCount }/${ results.length }`,
		`- Checks needing review: ${ reviewCount }`,
		'- Scope: read-only homepage and static marker checks only.',
		'- Safety: no CMS record, payment, invoice, refund, lead, lawyer profile, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or wp-admin setting was changed.',
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
			? 'Production has not yet proven the homepage investor polish bundle. Pull Git in uPress for `wp-content/themes/justice-theme`, clear cache if needed, then rerun this checker.'
			: 'Production is serving the homepage investor polish bundle: the lawyer revenue strip, signup/login routes and deployment markers are visible on the live homepage.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-homepage-investor-polish-live.mjs',
		'```',
		'',
	].join( '\n' );
}

const checks = [
	{
		id: 'homepage-runtime-marker',
		name: 'Homepage runtime deployment marker',
		url: `/?homepage_investor_polish_check=${ CACHE_BUST }`,
		required: [
			'justice-deployment-marker',
			EXPECTED_MARKER,
		],
	},
	{
		id: 'homepage-lawyer-revenue-strip',
		name: 'Homepage lawyer revenue strip is visible',
		url: `/?homepage_investor_polish_check=${ CACHE_BUST }`,
		required: [
			'hero__lawyer-access',
			'homepage-lawyer-revenue',
			'homepage-lawyer-revenue__mini-dashboard',
			'/lawyer-registration/',
			'/lawyer-plans/',
			'/lawyer-dashboard/',
			'utm_medium=revenue_strip',
		],
	},
	{
		id: 'static-theme-marker',
		name: 'Static theme deployment marker',
		url: `/wp-content/themes/justice-theme/deployment-marker.txt?homepage_investor_polish_check=${ CACHE_BUST }`,
		required: [
			`justice-theme-deployment-marker=${ EXPECTED_MARKER }`,
			'expected-github-main-commit=owner-demo-control-panel-v1',
		],
	},
	{
		id: 'premium-css-cache-bust',
		name: 'Premium polish CSS version is deployed',
		url: `/wp-content/themes/justice-theme/assets/css/premium-pass-4.css?homepage_investor_polish_check=${ CACHE_BUST }`,
		required: [
			'Version: 4.3.2',
			'.hero__lawyer-access',
			'.homepage-lawyer-revenue',
			'.homepage-lawyer-revenue__mini-dashboard',
			'.homepage-lawyer-revenue__login',
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
	await fs.writeFile( `reports/homepage-investor-polish-live-${ RUN_DATE }.json`, JSON.stringify( report, null, 2 ) + '\n' );
	await fs.writeFile( `reports/homepage-investor-polish-live-${ RUN_DATE }.csv`, csv );
	await fs.writeFile( `project-control/homepage-investor-polish-live-${ RUN_DATE }.md`, markdown );
	await fs.writeFile( `project-control/homepage-investor-polish-live-${ RUN_DATE }.csv`, csv );
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
