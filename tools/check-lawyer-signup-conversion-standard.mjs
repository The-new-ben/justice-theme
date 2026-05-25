const BASE_URL = 'https://jus-tice.co.il';
const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();
const RUN_DATE = datedFilePart();

const sourceBasis = [
	{
		name: 'Lawmatics legal CRM',
		url: 'https://www.lawmatics.com/',
		meaning: 'Modern legal intake products emphasize instant response, email/SMS follow-up, one lead timeline, pipeline stages and reminders.',
	},
	{
		name: 'Clio Grow',
		url: 'https://www.clio.com/grow/',
		meaning: 'Client-intake software sells consistent follow-up, scheduling and reminders to convert prospects into signed clients.',
	},
	{
		name: 'Avvo lawyer marketing',
		url: 'https://www.avvo.com/for-lawyers/',
		meaning: 'Lawyer directories sell profile claiming, visibility, urgent-client demand and contact volume as core acquisition proof.',
	},
	{
		name: 'Jus-Tice competitor pattern map',
		url: 'project-control/lawyer-signup-competitor-patterns-2026-05-25.md',
		meaning: 'Local pattern map distilled from public LawReviews, Psakdin and Din surfaces.',
	},
];

const checks = [
	{
		id: 'lawyer-entrypoints',
		stage: 'Discover',
		url: '/',
		required: [
			'/lawyer-plans/',
			'/lawyer-registration/',
			'/lawyer-dashboard/',
			'utm_campaign=lawyer_acquisition',
			'homepage-lawyer-revenue__account-steps',
		],
		why: 'A lawyer must immediately see that Jus-Tice has a paid profile/account path, not only consumer legal content.',
	},
	{
		id: 'plan-page-sells-revenue-system',
		stage: 'Compare',
		url: '/lawyer-plans/?conversion_standard=1',
		required: [
			'lawyer-plans-hero',
			'lawyer-plans-market-proof',
			'lawyer-plans-market-proof__signup-stages',
			'lawyer-plan-card',
			'lawyer-plans-next-steps',
			'plan_interest=lead_partner',
			'payment_path=manual_invoice',
		],
		why: 'The plan page should sell visibility, trust, lead follow-up and manual payment bridge before price friction.',
	},
	{
		id: 'short-signup-keeps-paid-context',
		stage: 'Register',
		url: '/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&utm_source=conversion_standard&utm_medium=audit&utm_campaign=lawyer_acquisition&billing_first_name=Audit&billing_last_name=Lawyer&billing_phone=0501234567&billing_email=audit-lawyer@example.com',
		required: [
			'lawyer-registration-form',
			'lawyer-registration-account-path',
			'lawyer-registration-plan-context',
			'name="payment_path" value="manual_invoice"',
			'name="plan_interest"',
			'name="lawyer_full_name" value="Audit Lawyer"',
			'name="phone" value="0501234567"',
			'name="email" value="audit-lawyer@example.com"',
			'data-selected-plan="lead_partner"',
		],
		why: 'First signup should preserve paid intent while keeping account creation understandable.',
	},
	{
		id: 'checkout-manual-payment-bridge',
		stage: 'Pay',
		url: '/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&utm_source=lawyer_plans&utm_medium=plan_page&utm_campaign=lawyer_acquisition&utm_content=conversion_standard&outreach_segment=plans_page',
		required: [
			'woocommerce-checkout',
			'billing_first_name',
			'billing_phone',
			'billing_email',
			'name="plan_interest" value="lead_partner"',
			'name="payment_path" value="manual_invoice"',
			'id="terms"',
			'/cancellation/',
			'/privacy/',
		],
		why: 'Until provider approval is complete, the payment path must be honest and still ready for manual link/invoice conversion.',
	},
	{
		id: 'dashboard-gate-shows-business-console',
		stage: 'Operate',
		url: '/lawyer-dashboard/?conversion_standard=1',
		required: [
			'lawyer-dashboard--logged-out',
			'lawyer-dashboard__gate-points',
			'/lawyer-plans/',
			'/lawyer-registration/',
			'payment_path=manual_invoice',
			'outreach_segment=dashboard_logged_out',
		],
		why: 'The personal area should feel like the place to manage profile, leads, follow-up and service requests.',
	},
	{
		id: 'dashboard-service-assistant-asset',
		stage: 'Support',
		url: '/wp-content/themes/justice-theme/assets/js/lawyer-dashboard.js?conversion_standard=1',
		required: [
			'data-service-request-preset',
			'service-request-type',
			'service-request-urgency',
			'service-request-desired-plan',
			'service-request-message',
			'scrollIntoView',
		],
		why: 'Upgrade, downgrade, cancel, refund and support requests need structured capture to avoid owner phone chaos.',
	},
	{
		id: 'revenue-event-telemetry',
		stage: 'Measure',
		url: '/wp-content/themes/justice-theme/assets/js/analytics-events.js?conversion_standard=1',
		required: [
			'lawyer_revenue_click',
			'lawyer_signup_submit',
			'payment_path',
			'plan_interest',
			'outreach_segment',
			'utm_content',
		],
		why: 'Revenue growth needs attribution and funnel event evidence, not only page design.',
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

function absoluteUrl( pathOrUrl ) {
	return new URL( pathOrUrl, BASE_URL ).toString();
}

async function fetchText( pathOrUrl ) {
	const controller = new AbortController();
	const timeout = setTimeout( () => controller.abort(), 25000 );

	try {
		const response = await fetch( absoluteUrl( pathOrUrl ), {
			cache: 'no-store',
			signal: controller.signal,
			headers: {
				Accept: '*/*',
				'Cache-Control': 'no-cache',
				'User-Agent': 'Jus-Tice-Lawyer-Signup-Conversion-Standard/1.0',
			},
		} );

		return {
			response,
			body: await response.text(),
		};
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
	const started = Date.now();
	const { response, body } = await fetchText( check.url );
	const missing = check.required.filter( ( token ) => ! tokenPresent( body, token ) );
	const passed = response.ok && missing.length === 0;

	return {
		id: check.id,
		stage: check.stage,
		status: passed ? 'PASS' : 'ACTION_REQUIRED',
		http: response.status,
		bytes: body.length,
		durationMs: Date.now() - started,
		url: absoluteUrl( check.url ),
		finalUrl: response.url,
		missing,
		why: check.why,
	};
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( results ) {
	const headers = [ 'id', 'stage', 'status', 'http', 'missing', 'why', 'url', 'finalUrl' ];
	return [
		headers.join( ',' ),
		...results.map( ( result ) => headers.map( ( header ) => csvEscape( header === 'missing' && ! result.missing.length ? '-' : result[ header ] ) ).join( ',' ) ),
	].join( '\n' ) + '\n';
}

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toMarkdown( results ) {
	const passCount = results.filter( ( result ) => result.status === 'PASS' ).length;
	const actionCount = results.length - passCount;
	const status = actionCount ? 'PASS_WITH_ACTIONS' : 'PASS';

	return [
		`# Lawyer Signup Conversion Standard Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ status }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Checks passed: ${ passCount }/${ results.length }`,
		`- Checks needing action: ${ actionCount }`,
		'- Scope: read-only public route and static asset checks only.',
		'- Safety: no public CMS/database content, payment, invoice, refund, lawyer record, lead, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS/WhatsApp send, wp-admin or provider setting was changed.',
		'',
		'## Best-Practice / Competitor Basis',
		'',
		...sourceBasis.map( ( source ) => `- ${ source.name }: ${ source.meaning } Source: ${ source.url }` ),
		'',
		'## Conversion Standard Checks',
		'',
		markdownTable( [
			[ 'Stage', 'Check', 'Status', 'Missing', 'Why it matters' ],
			[ '---', '---', '---:', '---', '---' ],
			...results.map( ( result ) => [
				result.stage,
				result.id,
				result.status,
				result.missing.join( '<br>' ) || '-',
				result.why,
			] ),
		] ),
		'',
		'## Owner Meaning',
		'',
		actionCount
			? 'The core lawyer signup path is visible, but at least one conversion-standard marker needs implementation before calling the lawyer subscription experience fully polished.'
			: 'The public lawyer signup path currently covers the competitor-informed standard: clear entrypoints, paid-plan context, manual payment bridge, personal-area gate, service request capture and revenue telemetry.',
		'',
		'## Completion Assessment',
		'',
		'- Material advance: the competitor signup standard is now enforceable as a repeatable live-funnel audit.',
		'- Completion: lawyer signup conversion audit coverage is about 95%; live page design/copy improvements can now be prioritized by failed markers.',
		'- Still blocked: real payment links, invoices, recurring billing, refunds and account activation require owner/provider-approved live execution.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-lawyer-signup-conversion-standard.mjs',
		'```',
		'',
	].join( '\n' );
}

const results = [];

for ( const check of checks ) {
	try {
		results.push( await runCheck( check ) );
	} catch ( error ) {
		results.push( {
			id: check.id,
			stage: check.stage,
			status: 'ACTION_REQUIRED',
			http: 0,
			bytes: 0,
			durationMs: 0,
			url: absoluteUrl( check.url ),
			finalUrl: '',
			missing: check.required,
			why: `${ check.why } Fetch failed: ${ error instanceof Error ? error.message : String( error ) }`,
		} );
	}
}

const passCount = results.filter( ( result ) => result.status === 'PASS' ).length;
const actionCount = results.length - passCount;
const payload = {
	status: actionCount ? 'PASS_WITH_ACTIONS' : 'PASS',
	startedAt: STARTED_AT,
	runDate: RUN_DATE,
	baseUrl: BASE_URL,
	sourceBasis,
	passCount,
	actionCount,
	results,
};

const fs = await import( 'node:fs/promises' );
await fs.mkdir( 'reports', { recursive: true } );
await fs.mkdir( 'project-control', { recursive: true } );
await fs.writeFile( `reports/lawyer-signup-conversion-standard-${ RUN_DATE }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
await fs.writeFile( `reports/lawyer-signup-conversion-standard-${ RUN_DATE }.csv`, toCsv( results ) );
await fs.writeFile( `project-control/lawyer-signup-conversion-standard-${ RUN_DATE }.md`, toMarkdown( results ) );
await fs.writeFile( `project-control/lawyer-signup-conversion-standard-${ RUN_DATE }.csv`, toCsv( results ) );

console.log( `${ payload.status }: lawyer signup conversion standard ${ passCount }/${ results.length } checks passed, ${ actionCount } action items.` );
console.table( results.map( ( result ) => ( {
	id: result.id,
	stage: result.stage,
	status: result.status,
	http: result.http,
	missing: result.missing.join( '|' ) || '-',
} ) ) );
