import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();
const RUN_DATE = datedFilePart();

const launchpadPath = 'project-control/investor-demo-launchpad-2026-05-25.html';
const reportBase = `investor-launchpad-pack-${ RUN_DATE }`;

const requiredFiles = [
	{
		id: 'launchpad',
		path: launchpadPath,
		reason: 'Single non-technical control screen for the morning investor demo.',
	},
	{
		id: 'scenario-script',
		path: 'project-control/investor-demo-scenario-script-2026-05-25.md',
		reason: 'First-person medical-malpractice lawyer walkthrough.',
	},
	{
		id: 'morning-control-sheet',
		path: 'project-control/investor-demo-morning-control-sheet-2026-05-25.md',
		reason: 'Operator tab order and exact talk tracks.',
	},
	{
		id: 'hebrew-morning-brief',
		path: 'project-control/investor-morning-brief-he-2026-05-25.md',
		reason: 'Hebrew owner-facing script for pressure moments in the investor meeting.',
	},
	{
		id: 'hebrew-morning-brief-html',
		path: 'project-control/investor-morning-brief-he-2026-05-25.html',
		reason: 'Browser-ready RTL Hebrew brief that avoids terminal encoding issues.',
	},
	{
		id: 'payment-lifecycle-playbook',
		path: 'project-control/investor-payment-lifecycle-playbook-2026-05-25.md',
		reason: 'Real-money lifecycle answers for payment, invoice, refund, cancel and plan-change questions.',
	},
	{
		id: 'fallback-answers',
		path: 'project-control/investor-demo-fallback-answers-2026-05-25.md',
		reason: 'Controlled answers if a page is slow, a login is missing, or the investor challenges payment proof.',
	},
	{
		id: 'live-data-provider-checklist',
		path: 'project-control/investor-live-data-provider-action-checklist-2026-05-25.md',
		reason: 'Owner-side steps for the five remaining live-data/provider blockers.',
	},
	{
		id: 'post-demo-follow-up',
		path: 'project-control/investor-post-demo-follow-up-2026-05-25.md',
		reason: 'Investor recap and next-step templates so demo interest can convert into a concrete follow-up.',
	},
	{
		id: 'ascii-demo-data',
		path: 'project-control/investor-demo-data-seed-packet-ascii-2026-05-25.md',
		reason: 'Copy-safe demo lawyer and lead fields if Hebrew rendering is risky.',
	},
	{
		id: 'readiness-report',
		path: 'project-control/investor-demo-readiness-2026-05-25.md',
		reason: 'Readiness status and remaining blockers.',
	},
	{
		id: 'revenue-funnel-report',
		path: 'project-control/lawyer-revenue-funnel-live-2026-05-25.md',
		reason: 'Live public lawyer funnel verification.',
	},
	{
		id: 'morning-refresh-script',
		path: 'tools/run-investor-morning-pack.ps1',
		reason: 'One command to refresh all morning demo gates before the meeting.',
	},
];

const launchpadTokens = [
	'Jus-Tice Investor Demo Launchpad',
	'Homepage</strong><span>PASS</span>',
	'Revenue Funnel</strong><span>10/10 PASS</span>',
	'Investor Gate</strong><span>14 PASS</span>',
	'Payment Lifecycle</strong><span>Playbook ready</span>',
	'2 demo-data + 3 provider blockers',
	'https://jus-tice.co.il/',
	'https://jus-tice.co.il/lawyer-plans/',
	'https://jus-tice.co.il/checkout/?plan_interest=lead_partner',
	'https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner',
	'https://jus-tice.co.il/lawyer-dashboard/',
	'https://jus-tice.co.il/wp-admin/admin.php?page=justice-lawyer-onboarding',
	'./investor-payment-lifecycle-playbook-2026-05-25.md',
	'./investor-morning-brief-he-2026-05-25.md',
	'./investor-morning-brief-he-2026-05-25.html',
	'./investor-demo-fallback-answers-2026-05-25.md',
	'./investor-live-data-provider-action-checklist-2026-05-25.md',
	'./investor-post-demo-follow-up-2026-05-25.md',
	'tools\\run-investor-morning-pack.ps1',
	'Do not claim recurring billing',
];

const sourceBasis = [
	{
		name: 'Stripe Billing Customer Portal',
		url: 'https://docs.stripe.com/billing/subscriptions/customer-portal',
		meaning: 'Customer billing portals should expose billing details, payment methods, invoices and subscription status.',
	},
	{
		name: 'Chargebee Self-Serve Portal',
		url: 'https://www.chargebee.com/docs/2.0/self-serve-portal.html',
		meaning: 'Subscription portals commonly support change, pause/resume, cancel/reactivate, invoice download, payment methods and billing address management.',
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

function csvEscape( value ) {
	const text = Array.isArray( value ) ? value.join( '|' ) : String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( fileResults, tokenResults ) {
	const rows = [
		[ 'type', 'id_or_token', 'status', 'path_or_reason', 'notes' ],
		...fileResults.map( ( result ) => [
			'file',
			result.id,
			result.status,
			result.path,
			result.reason,
		] ),
		...tokenResults.map( ( result ) => [
			'launchpad_token',
			result.token,
			result.status,
			launchpadPath,
			result.status === 'PASS' ? 'present' : 'missing',
		] ),
	];

	return rows.map( ( row ) => row.map( csvEscape ).join( ',' ) ).join( '\n' ) + '\n';
}

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toMarkdown( fileResults, tokenResults ) {
	const filePass = fileResults.filter( ( result ) => result.status === 'PASS' ).length;
	const tokenPass = tokenResults.filter( ( result ) => result.status === 'PASS' ).length;
	const reviewCount = ( fileResults.length - filePass ) + ( tokenResults.length - tokenPass );
	const status = reviewCount ? 'REVIEW' : 'PASS';

	return [
		`# Investor Launchpad Pack Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ status }`,
		`- Started: ${ STARTED_AT }`,
		`- Files present: ${ filePass }/${ fileResults.length }`,
		`- Launchpad tokens present: ${ tokenPass }/${ tokenResults.length }`,
		'- Scope: local investor-demo control artifacts only.',
		'- Safety: no public CMS/database content, payment, invoice, refund, lawyer record, lead, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting was changed.',
		'',
		'## Current Best-Practice Basis',
		'',
		...sourceBasis.map( ( source ) => `- ${ source.name }: ${ source.meaning } Source: ${ source.url }` ),
		'',
		'## Required Files',
		'',
		markdownTable( [
			[ 'File', 'Status', 'Why it matters' ],
			[ '---', '---:', '---' ],
			...fileResults.map( ( result ) => [ result.path, result.status, result.reason ] ),
		] ),
		'',
		'## Launchpad Tokens',
		'',
		markdownTable( [
			[ 'Token', 'Status' ],
			[ '---', '---:' ],
			...tokenResults.map( ( result ) => [ `\`${ result.token }\``, result.status ] ),
		] ),
		'',
		'## Completion Assessment',
		'',
		reviewCount
			? 'The morning pack needs review before the investor demo because at least one required file or launchpad marker is missing.'
			: 'The morning pack is coherent: the launchpad, payment lifecycle drill, scenario script, demo-data packet and readiness reports are present and linked.',
		'',
		'Remaining blockers are unchanged: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-investor-launchpad-pack.mjs',
		'```',
		'',
	].join( '\n' );
}

async function main() {
	await mkdir( 'reports', { recursive: true } );
	await mkdir( 'project-control', { recursive: true } );

	const fileResults = await Promise.all( requiredFiles.map( async ( item ) => ( {
		...item,
		status: await exists( item.path ) ? 'PASS' : 'REVIEW',
	} ) ) );

	const launchpad = await readFile( launchpadPath, 'utf8' );
	const tokenResults = launchpadTokens.map( ( token ) => ( {
		token,
		status: launchpad.includes( token ) ? 'PASS' : 'REVIEW',
	} ) );

	const payload = {
		status: fileResults.every( ( result ) => result.status === 'PASS' ) && tokenResults.every( ( result ) => result.status === 'PASS' ) ? 'PASS' : 'REVIEW',
		startedAt: STARTED_AT,
		runDate: RUN_DATE,
		sourceBasis,
		fileResults,
		tokenResults,
	};

	await writeFile( `reports/${ reportBase }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
	await writeFile( `reports/${ reportBase }.csv`, toCsv( fileResults, tokenResults ) );
	await writeFile( `project-control/${ reportBase }.md`, toMarkdown( fileResults, tokenResults ) );
	await writeFile( `project-control/${ reportBase }.csv`, toCsv( fileResults, tokenResults ) );

	console.log( `${ payload.status }: investor launchpad pack ${ fileResults.filter( ( result ) => result.status === 'PASS' ).length }/${ fileResults.length } files and ${ tokenResults.filter( ( result ) => result.status === 'PASS' ).length }/${ tokenResults.length } launchpad tokens passed.` );
}

main().catch( ( error ) => {
	console.error( error );
	process.exitCode = 1;
} );
