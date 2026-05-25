import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const TIME_ZONE = 'Asia/Jerusalem';
const RUN_DATE = datedFilePart();
const STARTED_AT = new Date().toISOString();

const requiredFiles = [
	{
		id: 'real-grow-payment-link-smoke-test',
		path: 'project-control/grow-real-payment-link-smoke-test-2026-05-24.md',
		reason: 'Evidence that a real one-time Grow payment link exists and was emailed to the owner.',
		tokens: [
			'Created a real one-time Grow Payment Link',
			'Full link | Sent by email; intentionally not stored in repo',
			'Link sent to owner by Gmail | PASS',
			'Provider payment page opens | PASS',
			'Branded payment page shows `Jus-Tice Israel` | PASS',
			'Real payment completed | NOT YET',
			'Receipt/invoice visible after payment | NOT YET',
		],
	},
	{
		id: 'grow-recurring-debit-live-attempt',
		path: 'project-control/grow-recurring-debit-live-attempt-2026-05-24.md',
		reason: 'Evidence that recurring setup was tested live and blocked by provider authorization.',
		tokens: [
			'Attempted a real Grow recurring-debit setup',
			'Grow did not create the recurring setup link',
			'Recurring debit / subscription setup is not yet authorized',
			'No recurring agreement was created',
			'must not be presented as working',
		],
	},
	{
		id: 'investor-payment-lifecycle-playbook',
		path: 'project-control/investor-payment-lifecycle-playbook-2026-05-25.md',
		reason: 'Investor-safe payment, invoice, refund, cancellation and plan-change talk track.',
		tokens: [
			'payment',
			'invoice',
			'refund',
			'cancel',
			'upgrade',
			'downgrade',
			'manual',
			'recurring',
		],
	},
];

const sourceBasis = [
	{
		name: 'Grow fixed-amount payment-link guide',
		url: 'https://grow.business/fixed-amount-link/',
		meaning: 'Grow documents creating a one-time fixed-amount payment link and sharing it digitally.',
	},
	{
		name: 'Grow payment-page guide',
		url: 'https://grow.business/payment-page/',
		meaning: 'Grow positions payment pages/links as a practical online sale path with branding and supported payment methods.',
	},
	{
		name: 'Morning / Green Invoice payment API reference',
		url: 'https://jsapi.apiary.io/apis/greeninvoice/reference/expenses/search-expense-drafts.html',
		meaning: 'Morning documents payment form flows where a payment can generate a document after payment, when the account has an eligible clearing plugin.',
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

async function exists( path ) {
	try {
		await access( path, constants.R_OK );
		return true;
	} catch {
		return false;
	}
}

function normalize( value ) {
	return value.replace( /\s+/g, ' ' ).trim();
}

function hasToken( body, token ) {
	return body.includes( token ) || normalize( body ).includes( token );
}

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( results ) {
	const rows = [
		[ 'id', 'status', 'file', 'missing_tokens', 'reason' ],
		...results.map( ( result ) => [
			result.id,
			result.status,
			result.path,
			result.missingTokens.length ? result.missingTokens : '-',
			result.reason,
		] ),
	];

	return rows.map( ( row ) => row.map( csvEscape ).join( ',' ) ).join( '\n' ) + '\n';
}

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toMarkdown( results ) {
	const passCount = results.filter( ( result ) => result.status === 'PASS' ).length;
	const reviewCount = results.length - passCount;
	const status = reviewCount ? 'REVIEW' : 'PASS';

	return [
		`# Payment Proof Drill Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ status }`,
		`- Started: ${ STARTED_AT }`,
		`- Files passed: ${ passCount }/${ results.length }`,
		`- Files needing review: ${ reviewCount }`,
		'- Scope: local evidence reconciliation only.',
		'- Safety: no provider login, payment link creation, charge, invoice, refund, CMS/database content, product, gateway setting, lawyer record, lead, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS/WhatsApp send or wp-admin setting was changed.',
		'',
		'## Current Source Basis',
		'',
		...sourceBasis.map( ( source ) => `- ${ source.name }: ${ source.meaning } Source: ${ source.url }` ),
		'',
		'## Evidence Files',
		'',
		markdownTable( [
			[ 'Evidence', 'Status', 'Missing tokens', 'Why it matters' ],
			[ '---', '---:', '---', '---' ],
			...results.map( ( result ) => [
				result.path,
				result.status,
				result.missingTokens.join( '<br>' ) || '-',
				result.reason,
			] ),
		] ),
		'',
		'## Investor-Safe Payment Line',
		'',
		'Jus-Tice has evidence of a real one-time Grow payment-link smoke test: the link was created in the live Grow account, opened as a branded Jus-Tice Israel payment page, and was emailed to the owner. The remaining proof step is for the owner to pay that link and verify the transaction plus receipt/invoice in Grow/Morning.',
		'',
		'Do not claim automatic recurring billing is live. The live recurring debit attempt was blocked by provider authorization, so recurring payments remain a Grow/Meshulam enablement blocker until approval and a controlled recurring transaction pass.',
		'',
		'## Owner Demo Sequence',
		'',
		'1. Open the owner email titled `REAL Grow payment link ready: Jus-Tice investor demo 1 NIS smoke test`.',
		'2. Open the full Grow payment URL from the email; do not paste the full link into the repo.',
		'3. Pay the one-time 1 NIS link only if the owner wants a real paid smoke test now.',
		'4. In Grow, verify the transaction and payment-link status.',
		'5. In Morning/Grow, verify whether a receipt/invoice was generated.',
		'6. Keep recurring billing positioned as approval-gated until Grow enables recurring debit and a controlled recurring link succeeds.',
		'',
		'## Completion Assessment',
		'',
		'- Material advance: one-time payment proof and recurring-billing blocker are now reconciled into one repeatable drill.',
		'- Completion: payment proof readiness is about 85% if the owner can pay the existing link during the demo; recurring subscription automation remains materially blocked.',
		'- Still blocked: paying the real link, verifying receipt/invoice, real refund execution, recurring authorization and gateway/product mapping require owner/provider-approved live actions.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-payment-proof-drill.mjs',
		'```',
		'',
	].join( '\n' );
}

const results = [];

for ( const file of requiredFiles ) {
	const fileExists = await exists( file.path );
	const body = fileExists ? await readFile( file.path, 'utf8' ) : '';
	const missingTokens = fileExists ? file.tokens.filter( ( token ) => ! hasToken( body, token ) ) : file.tokens;
	results.push( {
		...file,
		status: fileExists && missingTokens.length === 0 ? 'PASS' : 'REVIEW',
		missingTokens,
	} );
}

const payload = {
	status: results.every( ( result ) => result.status === 'PASS' ) ? 'PASS' : 'REVIEW',
	startedAt: STARTED_AT,
	runDate: RUN_DATE,
	sourceBasis,
	results,
};

await mkdir( 'reports', { recursive: true } );
await mkdir( 'project-control', { recursive: true } );
await writeFile( `reports/payment-proof-drill-${ RUN_DATE }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
await writeFile( `reports/payment-proof-drill-${ RUN_DATE }.csv`, toCsv( results ) );
await writeFile( `project-control/payment-proof-drill-${ RUN_DATE }.md`, toMarkdown( results ) );
await writeFile( `project-control/payment-proof-drill-${ RUN_DATE }.csv`, toCsv( results ) );

console.log( `${ payload.status }: payment proof drill ${ results.filter( ( result ) => result.status === 'PASS' ).length }/${ results.length } evidence files passed.` );

if ( payload.status !== 'PASS' ) {
	process.exitCode = 1;
}
