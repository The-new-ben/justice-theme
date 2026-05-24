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

const checks = [
	{
		id: 'home-lawyer-revenue-entrypoints',
		name: 'Homepage exposes lawyer revenue entrypoints',
		url: '/',
		type: 'page',
		required: [
			'/lawyer-plans/',
			'/lawyer-registration/',
			'/lawyer-dashboard/',
			'מסלולים לעורכי דין',
			'אזור אישי',
			'utm_source=site_header',
			'utm_campaign=lawyer_acquisition',
		],
	},
	{
		id: 'plan-page-manual-invoice-routing',
		name: 'Plan page routes paid intent through checkout',
		url: '/lawyer-plans/?codex_check=lawyer_revenue_funnel',
		type: 'page',
		required: [
			'lawyer-plans-hero',
			'lawyer-plan-card',
			'/checkout/',
			'plan_interest=lead_partner',
			'payment_path=manual_invoice',
			'utm_source=lawyer_plans',
			'utm_medium=plan_page',
			'utm_campaign=lawyer_acquisition',
			'outreach_segment=plans_page',
		],
	},
	{
		id: 'checkout-compliance-fallback',
		name: 'Checkout path exposes Grow-required fields and terms approval',
		url: '/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&codex_check=grow_checkout',
		type: 'page',
		required: [
			'woocommerce-checkout',
			'billing_first_name',
			'billing_last_name',
			'billing_phone',
			'billing_country',
			'billing_email',
			'id="terms"',
			'/sample-terms-and-conditions-template/',
			'/cancellation/',
			'/privacy/',
		],
	},
	{
		id: 'registration-success-manual-invoice-handoff',
		name: 'Registration success explains manual activation',
		url: '/lawyer-registration/?registration=sent&plan_interest=pro&payment_path=manual_invoice&utm_source=codex_check&utm_medium=live_funnel&utm_campaign=lawyer_acquisition',
		type: 'page',
		required: [
			'lawyer-registration-success',
			'lawyer-registration-success__actions',
			'/lawyer-plans/',
			'wp-login.php',
		],
		absent: [
			'lawyer-registration-form',
			'justice_lawyer_registration_nonce',
		],
	},
	{
		id: 'registration-paid-manual-form-state',
		name: 'Registration form preserves paid manual-invoice plan state',
		url: '/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&utm_source=codex_check&utm_medium=live_funnel&utm_campaign=lawyer_acquisition',
		type: 'page',
		required: [
			'lawyer-registration-form',
			'lawyer-registration-plan-context',
			'name="payment_path" value="manual_invoice"',
			'name="plan_interest"',
			'data-selected-plan="lead_partner"',
			'value="lead_partner" selected=\'selected\'',
			'לא יתבצע חיוב אוטומטי',
		],
	},
	{
		id: 'dashboard-gate-paid-lawyer-path',
		name: 'Logged-out dashboard gate offers paid-lawyer path',
		url: '/lawyer-dashboard/?codex_check=lawyer_revenue_funnel',
		type: 'page',
		required: [
			'lawyer-dashboard--logged-out',
			'lawyer-dashboard__gate-points',
			'/lawyer-plans/',
			'/lawyer-registration/',
			'utm_source=lawyer_dashboard_gate',
			'payment_path=manual_invoice',
			'outreach_segment=dashboard_logged_out',
		],
	},
	{
		id: 'premium-css-revenue-ui-markers',
		name: 'Revenue UI CSS markers are deployed',
		url: '/wp-content/themes/justice-theme/assets/css/premium-pass-3.css?codex_check=lawyer_revenue_funnel',
		type: 'asset',
		required: [
			'.lawyer-registration-success',
			'.lawyer-dashboard__gate-points',
			'.lawyer-dashboard__empty-steps',
			'.lawyer-dashboard-plan-status',
			'.lawyer-plans-founder',
			'.site-header__lawyer-label-full',
			'.site-header__lawyer-label-short',
		],
	},
	{
		id: 'analytics-lawyer-revenue-events',
		name: 'Lawyer revenue analytics events are deployed',
		url: '/wp-content/themes/justice-theme/assets/js/analytics-events.js?codex_check=lawyer_revenue_funnel',
		type: 'asset',
		required: [
			'lawyer_revenue_click',
			'lawyer_signup_submit',
			'payment_path',
			'plan_interest',
			'outreach_segment',
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
				Accept: '*/*',
				'Cache-Control': 'no-cache',
				'User-Agent': 'Jus-Tice-Lawyer-Revenue-Funnel-Checker/1.0',
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
	const missing = ( check.required || [] ).filter( ( token ) => ! tokenPresent( body, token ) );
	const unexpected = ( check.absent || [] ).filter( ( token ) => tokenPresent( body, token ) );
	const passed = response.ok && missing.length === 0 && unexpected.length === 0;

	return {
		id: check.id,
		name: check.name,
		type: check.type,
		status: passed ? 'PASS' : 'REVIEW',
		http: response.status,
		bytes: body.length,
		durationMs,
		url,
		finalUrl: response.url,
		missing,
		unexpected,
	};
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( results ) {
	const headers = [
		'id',
		'type',
		'status',
		'http',
		'bytes',
		'durationMs',
		'missing',
		'unexpected',
		'url',
		'finalUrl',
	];
	const rows = results.map( ( result ) => ( {
		...result,
		missing: result.missing.length ? result.missing : '-',
		unexpected: result.unexpected.length ? result.unexpected : '-',
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
		`# Lawyer Revenue Funnel Live Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ statusLabel }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Checks passed: ${ passCount }/${ results.length }`,
		`- Checks needing review: ${ reviewCount }`,
		'- Scope: read-only public route and static asset checks only.',
		'- Safety: no CMS record, lawyer profile, payment, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.',
		'',
		'| Check | Status | HTTP | Missing | Unexpected | Final URL |',
		'|---|---:|---:|---|---|---|',
		...results.map( ( result ) => [
			result.name,
			result.status,
			String( result.http ),
			result.missing.join( '<br>' ) || '-',
			result.unexpected.join( '<br>' ) || '-',
			result.finalUrl,
		].map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ),
		'',
		'## Owner Meaning',
		'',
		reviewCount === 0
			? 'The public lawyer revenue path is currently wired: lawyers can find the paid-plan area, paid intent is routed to manual invoice activation, the paid registration form preserves manual-invoice plan state, the post-registration handoff avoids fake automatic-charge language, the dashboard gate exposes the next revenue step, and tracking assets are present.'
			: 'At least one public lawyer revenue path marker was missing or unexpected. Review the table before relying on the live funnel for outreach.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools/check-live-lawyer-revenue-funnel.mjs',
		'```',
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
			type: check.type,
			status: 'REVIEW',
			http: 0,
			bytes: 0,
			durationMs: 0,
			url: absoluteUrl( check.url ),
			finalUrl: '',
			missing: check.required || [],
			unexpected: [],
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

await Promise.all( [
	import( 'node:fs/promises' ).then( async ( fs ) => {
		await fs.mkdir( 'reports', { recursive: true } );
		await fs.mkdir( 'project-control', { recursive: true } );
		await fs.writeFile( `reports/lawyer-revenue-funnel-live-${ RUN_DATE }.json`, JSON.stringify( report, null, 2 ) + '\n' );
		await fs.writeFile( `reports/lawyer-revenue-funnel-live-${ RUN_DATE }.csv`, csv );
		await fs.writeFile( `project-control/lawyer-revenue-funnel-live-${ RUN_DATE }.md`, markdown );
		await fs.writeFile( `project-control/lawyer-revenue-funnel-live-${ RUN_DATE }.csv`, csv );
	} ),
] );

console.table( results.map( ( result ) => ( {
	id: result.id,
	status: result.status,
	http: result.http,
	missing: result.missing.join( '|' ) || '-',
	unexpected: result.unexpected.join( '|' ) || '-',
	finalUrl: result.finalUrl,
} ) ) );

if ( report.reviewCount > 0 ) {
	process.exitCode = 1;
}
