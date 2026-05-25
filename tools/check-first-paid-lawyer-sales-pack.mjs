import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const TIME_ZONE = 'Asia/Jerusalem';
const STARTED_AT = new Date().toISOString();
const RUN_DATE = datedFilePart();
const reportBase = `first-paid-lawyer-sales-pack-${ RUN_DATE }`;

const requiredFiles = [
	{
		id: 'outreach-sprint',
		path: 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.md',
		reason: 'Sales cadence, pipeline stages and scripts.',
	},
	{
		id: 'outreach-tracker',
		path: 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.csv',
		reason: '30-row CRM-style tracker for the first cohort.',
	},
	{
		id: 'offer-sheet',
		path: 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md',
		reason: 'English/internal first-cohort offer sheet and objections.',
	},
	{
		id: 'hebrew-offer-html',
		path: 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html',
		reason: 'Browser-ready Hebrew one-pager for lawyer conversations.',
	},
];

const tokenChecks = [
	{
		id: 'price-349',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ '349' ],
		reason: 'Professional mini-site plan price is visible.',
	},
	{
		id: 'price-749',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ '749' ],
		reason: 'Featured exposure plan price is visible.',
	},
	{
		id: 'price-1490',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ '1,490' ],
		reason: 'Lead partner plan price is visible.',
	},
	{
		id: 'price-2490',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ '2,490' ],
		reason: 'Full service plan price is visible.',
	},
	{
		id: 'manual-payment-bridge',
		files: [ 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md', 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ 'manual', 'ידני' ],
		reason: 'First-cohort materials disclose the manual payment bridge.',
	},
	{
		id: 'no-guarantee',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md' ],
		tokens: [ 'No fake guarantees' ],
		reason: 'English/internal sheet avoids fake lead guarantees.',
	},
	{
		id: 'hebrew-no-guarantee',
		files: [ 'project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html' ],
		tokens: [ 'לא להבטיח' ],
		reason: 'Hebrew one-pager avoids fake lead guarantees.',
	},
	{
		id: 'cadence',
		files: [ 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.md' ],
		tokens: [ '7-Day Outreach Cadence' ],
		reason: 'Outreach cadence is explicit.',
	},
	{
		id: 'tracker-stage',
		files: [ 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.csv' ],
		tokens: [ 'stage' ],
		reason: 'Tracker contains pipeline stage field.',
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

function markdownTable( rows ) {
	return rows.map( ( row ) => row.map( ( cell ) => String( cell ).replaceAll( '|', '\\|' ) ).join( ' | ' ).replace( /^/, '| ' ).replace( /$/, ' |' ) ).join( '\n' );
}

function toCsv( fileResults, tokenResults, trackerRows ) {
	const rows = [
		[ 'type', 'id', 'status', 'detail', 'reason' ],
		...fileResults.map( ( result ) => [ 'file', result.id, result.status, result.path, result.reason ] ),
		...tokenResults.map( ( result ) => [ 'token', result.id, result.status, result.files.join( '|' ), result.reason ] ),
		[ 'tracker', 'rows', trackerRows >= 30 ? 'PASS' : 'REVIEW', String( trackerRows ), 'Tracker should contain at least 30 prospect rows.' ],
	];

	return rows.map( ( row ) => row.map( csvEscape ).join( ',' ) ).join( '\n' ) + '\n';
}

function toMarkdown( fileResults, tokenResults, trackerRows ) {
	const filePass = fileResults.filter( ( result ) => result.status === 'PASS' ).length;
	const tokenPass = tokenResults.filter( ( result ) => result.status === 'PASS' ).length;
	const trackerStatus = trackerRows >= 30 ? 'PASS' : 'REVIEW';
	const reviewCount = ( fileResults.length - filePass ) + ( tokenResults.length - tokenPass ) + ( trackerStatus === 'PASS' ? 0 : 1 );
	const status = reviewCount ? 'REVIEW' : 'PASS';

	return [
		`# First Paid Lawyer Sales Pack Check - ${ RUN_DATE }`,
		'',
		`- Status: ${ status }`,
		`- Started: ${ STARTED_AT }`,
		`- Required files: ${ filePass }/${ fileResults.length } PASS`,
		`- Sales tokens: ${ tokenPass }/${ tokenResults.length } PASS`,
		`- Tracker rows: ${ trackerRows }`,
		'- Scope: local first-cohort sales materials only.',
		'- Safety: no outreach, emails, WhatsApp messages, payment links, invoices, lawyer records, leads, CMS/database content or provider settings were changed.',
		'',
		'## Required Files',
		'',
		markdownTable( [
			[ 'File', 'Status', 'Why it matters' ],
			[ '---', '---:', '---' ],
			...fileResults.map( ( result ) => [ result.path, result.status, result.reason ] ),
		] ),
		'',
		'## Sales Tokens',
		'',
		markdownTable( [
			[ 'Check', 'Status', 'Files', 'Why it matters' ],
			[ '---', '---:', '---', '---' ],
			...tokenResults.map( ( result ) => [ result.id, result.status, result.files.join( '<br>' ), result.reason ] ),
		] ),
		'',
		'## Completion Assessment',
		'',
		reviewCount
			? 'The first-paid-lawyer sales pack needs review before outreach.'
			: 'The first-paid-lawyer sales pack is ready for owner execution: plan prices, manual payment bridge, no-guarantee language, cadence and tracker are present.',
		'',
		'Actual outreach and payment-link sending still require owner approval/live execution.',
		'',
		'## Rerun',
		'',
		'```powershell',
		'node tools\\check-first-paid-lawyer-sales-pack.mjs',
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

	const cache = new Map();
	const readCached = async ( file ) => {
		if ( ! cache.has( file ) ) {
			cache.set( file, await readFile( file, 'utf8' ) );
		}
		return cache.get( file );
	};

	const tokenResults = [];

	for ( const check of tokenChecks ) {
		const matches = [];

		for ( const file of check.files ) {
			const text = await readCached( file );

			if ( check.tokens.some( ( token ) => text.includes( token ) ) ) {
				matches.push( file );
			}
		}

		tokenResults.push( {
			...check,
			status: matches.length === check.files.length ? 'PASS' : 'REVIEW',
			files: matches,
		} );
	}

	const trackerText = await readCached( 'project-control/first-paid-lawyer-outreach-sprint-2026-05-25.csv' );
	const trackerRows = trackerText.trim().split( /\r?\n/ ).length - 1;
	const payload = {
		status: fileResults.every( ( result ) => result.status === 'PASS' ) && tokenResults.every( ( result ) => result.status === 'PASS' ) && trackerRows >= 30 ? 'PASS' : 'REVIEW',
		startedAt: STARTED_AT,
		runDate: RUN_DATE,
		fileResults,
		tokenResults,
		trackerRows,
	};

	await writeFile( `reports/${ reportBase }.json`, JSON.stringify( payload, null, 2 ) + '\n' );
	await writeFile( `reports/${ reportBase }.csv`, toCsv( fileResults, tokenResults, trackerRows ) );
	await writeFile( `project-control/${ reportBase }.md`, toMarkdown( fileResults, tokenResults, trackerRows ) );
	await writeFile( `project-control/${ reportBase }.csv`, toCsv( fileResults, tokenResults, trackerRows ) );

	console.log( `${ payload.status }: first paid lawyer sales pack ${ fileResults.filter( ( result ) => result.status === 'PASS' ).length }/${ fileResults.length } files, ${ tokenResults.filter( ( result ) => result.status === 'PASS' ).length }/${ tokenResults.length } tokens, ${ trackerRows } tracker rows.` );
}

main().catch( ( error ) => {
	console.error( error );
	process.exitCode = 1;
} );
