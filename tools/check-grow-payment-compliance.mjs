const BASE_URL = 'https://jus-tice.co.il';
const TIME_ZONE = 'Asia/Jerusalem';

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

const checks = [
	{
		id: 'checkout-page-exists',
		name: 'Checkout page exists and is reachable',
		url: `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'woocommerce-checkout',
			'פרטי לקוח לפני תשלום',
		],
	},
	{
		id: 'checkout-required-fields',
		name: 'Checkout exposes Grow-required customer fields',
		url: `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'billing_first_name',
			'billing_last_name',
			'billing_phone',
			'billing_country',
			'billing_email',
		],
	},
	{
		id: 'checkout-terms-approval',
		name: 'Checkout exposes terms checkbox and terms link',
		url: `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'id="terms"',
			'/sample-terms-and-conditions-template/',
			'אני מאשר',
		],
	},
	{
		id: 'lawyer-plans-entrypoint',
		name: 'Paid lawyer plan path links to checkout',
		url: `/lawyer-plans/?grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'/checkout/',
			'plan_interest=lead_partner',
			'payment_path=manual_invoice',
			'utm_campaign=lawyer_acquisition',
		],
	},
	{
		id: 'terms-page',
		name: 'Terms page remains available',
		url: `/sample-terms-and-conditions-template/?grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'Jus-Tice',
			'תקנון',
			'ביטול',
			'פרטיות',
		],
	},
	{
		id: 'cancellation-page',
		name: 'Cancellation and supply policy remains available',
		url: `/cancellation/?grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'ביטול',
			'אספקת שירות',
			'אחריות',
		],
	},
	{
		id: 'privacy-page',
		name: 'Privacy policy remains available',
		url: `/privacy/?grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'פרטיות',
			'מידע אישי',
			'Jus-Tice',
		],
	},
	{
		id: 'business-contact-signals',
		name: 'Business contact signals remain visible',
		url: `/sample-terms-and-conditions-template/?grow_compliance_check=${ CACHE_BUST }`,
		required: [
			'Jus-Tice Israel',
			'0525101555',
			'info@jus-tice.co.il',
			'ראול',
			'ולנברג',
			'תל אביב',
		],
	},
];

function absoluteUrl( pathOrUrl ) {
	return new URL( pathOrUrl, BASE_URL ).toString();
}

async function fetchText( pathOrUrl ) {
	const controller = new AbortController();
	const timeout = setTimeout( () => controller.abort(), 25000 );

	try {
		const response = await fetch( absoluteUrl( pathOrUrl ), {
			redirect: 'follow',
			cache: 'no-store',
			signal: controller.signal,
			headers: {
				Accept: 'text/html,*/*',
				'Cache-Control': 'no-cache',
				'User-Agent': 'Jus-Tice-Grow-Compliance-Checker/1.0',
			},
		} );
		const body = await response.text();

		return { response, body };
	} finally {
		clearTimeout( timeout );
	}
}

function normalize( value ) {
	return value.replace( /\s+/g, ' ' ).trim();
}

function tokenPresent( body, token ) {
	const normalized = normalize( body );
	return body.includes( token ) || normalized.includes( token );
}

async function runCheck( check ) {
	const url = absoluteUrl( check.url );
	const started = Date.now();
	const { response, body } = await fetchText( check.url );
	const durationMs = Date.now() - started;
	const missing = check.required.filter( ( token ) => ! tokenPresent( body, token ) );
	const passed = response.ok && missing.length === 0;

	return {
		id: check.id,
		name: check.name,
		status: passed ? 'PASS' : 'REVIEW',
		http: response.status,
		bytes: body.length,
		durationMs,
		url,
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
	const rows = results.map( ( result ) => ( {
		...result,
		missing: result.missing.length ? result.missing : '-',
	} ) );

	return [
		headers.join( ',' ),
		...rows.map( ( row ) => headers.map( ( header ) => csvEscape( row[ header ] ) ).join( ',' ) ),
	].join( '\n' ) + '\n';
}

function toMarkdown( results ) {
	const passCount = results.filter( ( result ) => result.status === 'PASS' ).length;
	const reviewCount = results.length - passCount;
	const statusLabel = reviewCount === 0 ? 'PASS' : 'REVIEW';
	const lines = [
		`# Grow Payment Compliance Live Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ statusLabel }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Checks passed: ${ passCount }/${ results.length }`,
		`- Checks needing review: ${ reviewCount }`,
		'- Scope: read-only public route checks for Grow/Meshulam approval readiness.',
		'- Safety: no CMS record, payment, invoice, product, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.',
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
		reviewCount === 0
			? 'The live public site currently exposes the checkout page, required customer fields, terms checkbox, terms link, legal-policy pages and business contact signals that Grow flagged in the latest rejection.'
			: 'At least one Grow approval marker is missing. Do not rely on the payment approval path until the missing markers are corrected and the check passes.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools/check-grow-payment-compliance.mjs',
		'```',
		'',
		'## Artifact Privacy',
		'',
		'Outputs are written to `.project-control/` and `.reports/` so payment/provider readiness evidence stays in the private repo artifact area instead of public theme paths.',
		'',
	];

	return lines.join( '\n' );
}

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
	passCount: results.filter( ( result ) => result.status === 'PASS' ).length,
	reviewCount: results.filter( ( result ) => result.status !== 'PASS' ).length,
	results,
};

const csv = toCsv( results );
const markdown = toMarkdown( results );
const fs = await import( 'node:fs/promises' );

await fs.mkdir( '.reports', { recursive: true } );
await fs.mkdir( '.project-control', { recursive: true } );
await fs.writeFile( `.reports/grow-payment-compliance-live-${ RUN_DATE }.json`, JSON.stringify( report, null, 2 ) + '\n' );
await fs.writeFile( `.reports/grow-payment-compliance-live-${ RUN_DATE }.csv`, csv );
await fs.writeFile( `.project-control/grow-payment-compliance-live-${ RUN_DATE }.md`, markdown );
await fs.writeFile( `.project-control/grow-payment-compliance-live-${ RUN_DATE }.csv`, csv );

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
