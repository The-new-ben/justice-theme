import { mkdir, readFile, writeFile } from 'node:fs/promises';

const BASE_URL = 'https://jus-tice.co.il';
const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();

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
const CACHE_BUST = Date.now();

const liveChecks = [
	{
		id: 'public-lawyer-entrypoints',
		name: 'Public visitor can find lawyer revenue paths',
		url: '/',
		required: [
			'hero__lawyer-access',
			'homepage-lawyer-revenue',
			'homepage-lawyer-revenue__mini-dashboard',
			'/lawyer-plans/',
			'/lawyer-registration/',
			'/lawyer-dashboard/',
			'utm_medium=revenue_strip',
			'utm_campaign=lawyer_acquisition',
		],
		ownerAction: 'Open homepage and point to lawyer plans, registration and private-area links.',
	},
	{
		id: 'paid-plan-routing',
		name: 'Paid lawyer plan routes to checkout/manual invoice path',
		url: `/lawyer-plans/?investor_demo_check=${ CACHE_BUST }`,
		required: [
			'/checkout/',
			'lawyer-plans-next-steps',
			'plan_interest=lead_partner',
			'payment_path=manual_invoice',
			'utm_source=lawyer_plans',
		],
		ownerAction: 'Choose Lead Partner and explain this is the compliant fallback until Grow recurring approval lands.',
	},
	{
		id: 'checkout-compliance',
		name: 'Checkout exposes Grow-required customer and policy signals',
		url: `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&investor_demo_check=${ CACHE_BUST }`,
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
		ownerAction: 'Show required fields, terms approval and policy links for Grow review.',
	},
	{
		id: 'registration-prefill',
		name: 'Registration preserves paid manual-invoice plan state',
		url: `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Investor&billing_last_name=Demo&billing_phone=0501234567&billing_email=investor-demo@example.com&billing_legal_name=Demo+Medical+Law+Ltd&billing_business_id=123456789&billing_invoice_email=billing-demo@example.com&billing_invoice_address=Tel+Aviv&investor_demo_check=${ CACHE_BUST }`,
		required: [
			'lawyer-registration-form',
			'lawyer-registration-billing-fields',
			'name="payment_path" value="manual_invoice"',
			'name="plan_interest"',
			'name="lawyer_full_name" value="Investor Demo"',
			'name="billing_legal_name" value="Demo Medical Law Ltd"',
			'name="billing_invoice_email" value="billing-demo@example.com"',
			'data-selected-plan="lead_partner"',
		],
		ownerAction: 'Use this route to show how a medical-malpractice lawyer arrives with billing context already carried forward.',
	},
	{
		id: 'dashboard-gate',
		name: 'Logged-out dashboard gate sells the paid lawyer path',
		url: `/lawyer-dashboard/?investor_demo_check=${ CACHE_BUST }`,
		required: [
			'lawyer-dashboard--logged-out',
			'/lawyer-plans/',
			'/lawyer-registration/',
			'payment_path=manual_invoice',
		],
		ownerAction: 'If not logged in, show that the private area pushes lawyers back to subscription onboarding.',
	},
	{
		id: 'service-desk-css-live',
		name: 'Private-area service desk UI marker is deployed',
		url: `/wp-content/themes/justice-theme/assets/css/premium-pass-3.css?investor_demo_check=${ CACHE_BUST }`,
		required: [
			'.lawyer-dashboard-service-request',
			'.lawyer-dashboard-service-request__latest',
			'.lawyer-dashboard-service-request__form',
		],
		ownerAction: 'Use a claimed lawyer account to submit one refund/cancel/complaint ticket.',
	},
	{
		id: 'grow-policy-pages',
		name: 'Grow policy pages remain reachable',
		url: `/sample-terms-and-conditions-template/?investor_demo_check=${ CACHE_BUST }`,
		required: [
			'Jus-Tice',
			'0525101555',
			'info@jus-tice.co.il',
			'/cancellation/',
			'/privacy/',
		],
		ownerAction: 'Show business identity, contact details, cancellation and privacy links if the investor asks about payment approval.',
	},
];

const sourceChecks = [
	{
		id: 'service-request-handler-source',
		name: 'Source supports subscription lifecycle service requests',
		file: 'inc/lawyer-dashboard.php',
		required: [
			'justice_theme_handle_lawyer_service_request',
			'upgrade_plan',
			'downgrade_plan',
			'cancel_subscription',
			'refund_request',
			'lead_quality',
			'latest_service_request_status',
		],
		ownerAction: 'Explain that upgrade/downgrade/cancel/refund are captured as owner-actionable tickets until recurring billing is approved.',
	},
	{
		id: 'service-request-dashboard-source',
		name: 'Lawyer dashboard renders the private service desk',
		file: 'page-lawyer-dashboard.php',
		required: [
			'lawyer-dashboard-service-request',
			'justice_lawyer_service_request',
			'desired_plan',
			'service_request_type',
		],
		ownerAction: 'Open the claimed demo lawyer dashboard and show the request form.',
	},
	{
		id: 'owner-service-request-queue-source',
		name: 'Owner command center can find pending service requests',
		file: 'inc/lawyer-onboarding.php',
		required: [
			'service_request_status',
			'pending_service_request',
			'latest_service_request_id',
			'Service requests',
		],
		ownerAction: 'Open Lawyer Onboarding with service_request_status=pending after a controlled request is submitted.',
	},
	{
		id: 'investor-matrix-source',
		name: 'Investor scenario matrix exists',
		file: 'project-control/investor-demo-emergency-test-matrix-2026-05-24.md',
		required: [
			'Full Scenario List To Test Before Investor',
			'Tomorrow Demo Script',
			'Critical Blockers',
			'Grow/Meshulam approval',
		],
		ownerAction: 'Use the matrix as the rehearsal order and keep blockers explicit.',
	},
];

const manualRows = [
	{
		id: 'claimed-demo-lawyer-profile',
		name: 'Claimed lawyer profile with dashboard access',
		status: 'NEEDS_DEMO_DATA',
		evidence: 'Requires one logged-in user linked to a justice_lawyer profile through claimed_by_user_id.',
		ownerAction: 'Prepare one demo lawyer account/profile before the investor call.',
	},
	{
		id: 'assigned-demo-medical-malpractice-lead',
		name: 'Assigned medical-malpractice lead for CRM walkthrough',
		status: 'NEEDS_DEMO_DATA',
		evidence: 'Dashboard lead CRM is ready when a lead exists and is assigned to the demo lawyer.',
		ownerAction: 'Use an existing safe demo lead or create one controlled live lead only with owner approval.',
	},
	{
		id: 'real-recurring-charge',
		name: 'Real recurring subscription charge',
		status: 'EXTERNAL_BLOCKER',
		evidence: 'Grow/Meshulam approval and WooCommerce subscription product/gateway mapping are still required.',
		ownerAction: 'Do not fake this. Present manual payment-link fallback as live and recurring billing as approval-gated.',
	},
	{
		id: 'automatic-branded-invoice',
		name: 'Automatic branded invoice/receipt with logo',
		status: 'EXTERNAL_BLOCKER',
		evidence: 'Needs approved Grow/Morning invoice/payment setup and one controlled transaction.',
		ownerAction: 'Show policy/compliance readiness and explain the next approval step.',
	},
	{
		id: 'real-refund-execution',
		name: 'Real refund execution',
		status: 'EXTERNAL_BLOCKER',
		evidence: 'Refund requests are captured in the service desk; actual refund execution depends on payment provider approval.',
		ownerAction: 'Demo the refund request ticket, not a fake refund.',
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
				'User-Agent': 'Jus-Tice-Investor-Demo-Readiness/1.0',
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

async function runLiveCheck( check ) {
	const started = Date.now();
	const { response, body } = await fetchText( check.url );
	const missing = check.required.filter( ( token ) => ! tokenPresent( body, token ) );
	const passed = response.ok && missing.length === 0;

	return {
		kind: 'live',
		id: check.id,
		name: check.name,
		status: passed ? 'PASS' : 'REVIEW',
		http: response.status,
		bytes: body.length,
		durationMs: Date.now() - started,
		evidence: passed ? response.url : `Missing: ${ missing.join( ' | ' ) }`,
		ownerAction: check.ownerAction,
	};
}

async function runSourceCheck( check ) {
	const started = Date.now();
	const body = await readFile( check.file, 'utf8' );
	const missing = check.required.filter( ( token ) => ! tokenPresent( body, token ) );
	const passed = missing.length === 0;

	return {
		kind: 'source',
		id: check.id,
		name: check.name,
		status: passed ? 'PASS' : 'REVIEW',
		http: '-',
		bytes: body.length,
		durationMs: Date.now() - started,
		evidence: passed ? check.file : `Missing in ${ check.file }: ${ missing.join( ' | ' ) }`,
		ownerAction: check.ownerAction,
	};
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( rows ) {
	const headers = [ 'kind', 'id', 'status', 'http', 'bytes', 'durationMs', 'name', 'evidence', 'ownerAction' ];

	return [
		headers.join( ',' ),
		...rows.map( ( row ) => headers.map( ( header ) => csvEscape( row[ header ] ) ).join( ',' ) ),
	].join( '\n' ) + '\n';
}

function readinessStatus( rows ) {
	const reviewCount = rows.filter( ( row ) => row.status === 'REVIEW' ).length;
	const blockerCount = rows.filter( ( row ) => row.status === 'EXTERNAL_BLOCKER' ).length;
	const dataCount = rows.filter( ( row ) => row.status === 'NEEDS_DEMO_DATA' ).length;

	if ( reviewCount > 0 ) {
		return {
			status: 'REVIEW',
			summary: `${ reviewCount } readiness checks need repair before the investor demo.`,
		};
	}

	return {
		status: 'PASS_WITH_DISCLOSED_BLOCKERS',
		summary: `Live/code checks pass. ${ dataCount } demo-data items and ${ blockerCount } external payment items must be disclosed, not faked.`,
	};
}

function toMarkdown( rows ) {
	const status = readinessStatus( rows );
	const passCount = rows.filter( ( row ) => row.status === 'PASS' ).length;
	const dataCount = rows.filter( ( row ) => row.status === 'NEEDS_DEMO_DATA' ).length;
	const blockerCount = rows.filter( ( row ) => row.status === 'EXTERNAL_BLOCKER' ).length;
	const reviewCount = rows.filter( ( row ) => row.status === 'REVIEW' ).length;

	const lines = [
		`# Investor Demo Readiness Gate - ${ RUN_DATE }`,
		'',
		`- Status: ${ status.status }`,
		`- Started: ${ STARTED_AT }`,
		`- Base URL: ${ BASE_URL }`,
		`- Passed live/source checks: ${ passCount }`,
		`- Demo data items needed: ${ dataCount }`,
		`- External payment blockers: ${ blockerCount }`,
		`- Checks needing repair: ${ reviewCount }`,
		'- Scope: read-only public route checks plus local source/report checks. No live CMS/database write is performed.',
		'- Honesty rule: show manual payment-link readiness and service-ticket capture; do not claim automatic recurring billing, automatic invoices or refunds are live until Grow/Meshulam approval and a controlled transaction pass.',
		'',
		'## Summary',
		'',
		status.summary,
		'',
		'## Demo Rows',
		'',
		'| Area | Status | Evidence | Owner action |',
		'|---|---:|---|---|',
		...rows.map( ( row ) => [
			row.name,
			row.status,
			row.evidence,
			row.ownerAction,
		].map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ),
		'',
		'## Rehearsal Order',
		'',
		'1. Homepage lawyer entrypoints.',
		'2. Lawyer plans to checkout/manual invoice.',
		'3. Registration with medical-malpractice demo lawyer context.',
		'4. Owner onboarding payment queue and payment-link readiness.',
		'5. Claimed lawyer private area.',
		'6. Lead CRM stage update with a safe assigned demo lead.',
		'7. Service desk request: refund, cancel, downgrade, complaint or invoice copy.',
		'8. Owner queue for pending service request.',
		'9. Honest payment explanation: approval-gated automation, live manual payment-link fallback.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools/check-investor-demo-readiness.mjs',
		'```',
		'',
	];

	return lines.join( '\n' );
}

async function main() {
	const rows = [
		...( await Promise.all( liveChecks.map( runLiveCheck ) ) ),
		...( await Promise.all( sourceChecks.map( runSourceCheck ) ) ),
		...manualRows.map( ( row ) => ( {
			kind: 'manual',
			http: '-',
			bytes: '-',
			durationMs: '-',
			...row,
		} ) ),
	];

	const status = readinessStatus( rows );
	const payload = {
		status: status.status,
		startedAt: STARTED_AT,
		baseUrl: BASE_URL,
		rows,
	};

	await mkdir( 'reports', { recursive: true } );
	await mkdir( 'project-control', { recursive: true } );
	await writeFile( `reports/investor-demo-readiness-${ RUN_DATE }.json`, `${ JSON.stringify( payload, null, 2 ) }\n` );
	await writeFile( `reports/investor-demo-readiness-${ RUN_DATE }.csv`, toCsv( rows ) );
	await writeFile( `project-control/investor-demo-readiness-${ RUN_DATE }.md`, toMarkdown( rows ) );
	await writeFile( `project-control/investor-demo-readiness-${ RUN_DATE }.csv`, toCsv( rows ) );

	console.table( rows.map( ( row ) => ( {
		id: row.id,
		status: row.status,
		http: row.http,
		evidence: row.evidence,
	} ) ) );

	if ( status.status === 'REVIEW' ) {
		process.exitCode = 1;
	}
}

main().catch( ( error ) => {
	console.error( error );
	process.exitCode = 1;
} );
