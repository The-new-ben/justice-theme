#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath( import.meta.url );
const root = path.resolve( path.dirname( __filename ), '..' );

const DEFAULT_BASE_URL = process.env.JUSTICE_BASE_URL || 'https://jus-tice.co.il';
const TARGET_PATH = '/lawyers/advocate-maya-rotenberg/';
const TARGET_SLUG = 'advocate-maya-rotenberg';
const TIMEOUT_MS = Number( process.env.JUSTICE_FETCH_TIMEOUT_MS || 20000 );

function parseArgs() {
	const args = {
		reportDate: new Date().toISOString().slice( 0, 10 ),
		baseUrl: DEFAULT_BASE_URL,
	};

	for ( const arg of process.argv.slice( 2 ) ) {
		if ( arg.startsWith( '--reportDate=' ) ) {
			args.reportDate = arg.slice( '--reportDate='.length );
		} else if ( arg.startsWith( '--baseUrl=' ) ) {
			args.baseUrl = arg.slice( '--baseUrl='.length );
		} else if ( arg === '--help' || arg === '-h' ) {
			args.help = true;
		} else {
			throw new Error( `Unknown argument: ${ arg }` );
		}
	}

	if ( ! /^\d{4}-\d{2}-\d{2}$/.test( args.reportDate ) ) {
		throw new Error( '--reportDate must be YYYY-MM-DD' );
	}

	return args;
}

function absoluteUrl( baseUrl, inputPath ) {
	return new URL( inputPath, baseUrl ).toString();
}

function normalizePath( value ) {
	const pathname = String( value || '' ).replace( /^\/+|\/+$/g, '' );
	return pathname ? `/${ pathname }/` : '/';
}

function decodeEntities( value ) {
	return String( value || '' )
		.replace( /&nbsp;/gi, ' ' )
		.replace( /&amp;/gi, '&' )
		.replace( /&quot;/gi, '"' )
		.replace( /&#039;/gi, "'" )
		.replace( /&apos;/gi, "'" )
		.replace( /&lt;/gi, '<' )
		.replace( /&gt;/gi, '>' );
}

function normalizeWhitespace( value ) {
	return decodeEntities( value ).replace( /\s+/g, ' ' ).trim();
}

function stripTags( value ) {
	return normalizeWhitespace(
		String( value || '' )
			.replace( /<script[\s\S]*?<\/script>/gi, ' ' )
			.replace( /<style[\s\S]*?<\/style>/gi, ' ' )
			.replace( /<!--[\s\S]*?-->/g, ' ' )
			.replace( /<[^>]+>/g, ' ' )
	);
}

function extractTag( html, tag ) {
	const match = html.match( new RegExp( `<${ tag }\\b[^>]*>([\\s\\S]*?)<\\/${ tag }>`, 'i' ) );
	return match ? stripTags( match[ 1 ] ) : '';
}

function extractAllTags( html, tag ) {
	return [ ...html.matchAll( new RegExp( `<${ tag }\\b[^>]*>([\\s\\S]*?)<\\/${ tag }>`, 'gi' ) ) ]
		.map( ( match ) => stripTags( match[ 1 ] ) )
		.filter( Boolean );
}

function extractCanonical( html ) {
	const match =
		html.match( /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i ) ||
		html.match( /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i );
	return match ? decodeEntities( match[ 1 ] ) : '';
}

function extractRobots( html ) {
	return [ ...html.matchAll( /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/gi ) ]
		.map( ( match ) => normalizeWhitespace( match[ 1 ].toLowerCase() ) )
		.join( '|' );
}

function jsonLdTypes( html ) {
	const types = [];
	const scripts = [ ...html.matchAll( /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi ) ]
		.map( ( match ) => decodeEntities( match[ 1 ] ).trim() )
		.filter( Boolean );

	function collect( value ) {
		if ( ! value ) return;
		if ( Array.isArray( value ) ) {
			value.forEach( collect );
			return;
		}
		if ( typeof value !== 'object' ) return;

		const type = value[ '@type' ];
		if ( Array.isArray( type ) ) type.forEach( ( item ) => types.push( String( item ) ) );
		else if ( type ) types.push( String( type ) );
		if ( Array.isArray( value[ '@graph' ] ) ) value[ '@graph' ].forEach( collect );
	}

	for ( const script of scripts ) {
		try {
			collect( JSON.parse( script ) );
		} catch {
			types.push( 'UNPARSEABLE_JSON_LD' );
		}
	}

	return [ ...new Set( types ) ];
}

function hebrewCharacterCount( value ) {
	return ( String( value || '' ).match( /[\u0590-\u05FF]/g ) || [] ).length;
}

function csvEscape( value ) {
	const text = String( value ?? '' );
	return /[",\n\r]/.test( text ) ? `"${ text.replaceAll( '"', '""' ) }"` : text;
}

function toCsv( rows, columns ) {
	const body = rows.map( ( row ) => columns.map( ( column ) => csvEscape( row[ column ] ) ).join( ',' ) ).join( '\n' );
	return `${ columns.join( ',' ) }\n${ body }${ body ? '\n' : '' }`;
}

function writeText( filePath, text ) {
	mkdirSync( path.dirname( filePath ), { recursive: true } );
	writeFileSync( filePath, text, 'utf8' );
}

async function fetchText( url, accept ) {
	const controller = new AbortController();
	const timeout = setTimeout( () => controller.abort(), TIMEOUT_MS );
	try {
		const response = await fetch( url, {
			redirect: 'follow',
			signal: controller.signal,
			headers: {
				'User-Agent': 'Jus-Tice-Maya-Lawyer-Live-Readonly-QA/1.0',
				Accept: accept,
				'Cache-Control': 'no-cache',
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

async function fetchJson( url ) {
	const { response, body } = await fetchText( url, 'application/json,*/*;q=0.8' );
	try {
		return {
			status: response.status,
			data: JSON.parse( body ),
			issue: '',
		};
	} catch {
		return {
			status: response.status,
			data: null,
			issue: 'unparseable_json',
		};
	}
}

async function restTypeDiscovery( baseUrl ) {
	try {
		const result = await fetchJson( new URL( '/wp-json/wp/v2/types', baseUrl ).toString() );
		const data = result.data && typeof result.data === 'object' ? result.data : {};
		const type = data.justice_lawyer || {};
		return {
			http: result.status,
			restBase: type.rest_base || '',
			found: Boolean( type.rest_base ),
			issue: result.issue || ( type.rest_base ? '' : 'justice_lawyer_type_not_found' ),
		};
	} catch ( error ) {
		return {
			http: 0,
			restBase: '',
			found: false,
			issue: `fetch_error_${ error.name || 'unknown' }`,
		};
	}
}

async function restSlugLookup( baseUrl, restBase ) {
	if ( ! restBase ) {
		return {
			http: 0,
			count: 0,
			ids: '',
			links: '',
			issue: 'missing_rest_base',
		};
	}

	try {
		const url = new URL( `/wp-json/wp/v2/${ restBase }`, baseUrl );
		url.searchParams.set( 'slug', TARGET_SLUG );
		url.searchParams.set( '_fields', 'id,slug,status,link,title' );
		const result = await fetchJson( url.toString() );
		const items = Array.isArray( result.data ) ? result.data : [];
		return {
			http: result.status,
			count: items.length,
			ids: items.map( ( item ) => item.id ).filter( Boolean ).join( ' | ' ),
			links: items.map( ( item ) => item.link ).filter( Boolean ).join( ' | ' ),
			issue: result.issue || '',
		};
	} catch ( error ) {
		return {
			http: 0,
			count: 0,
			ids: '',
			links: '',
			issue: `fetch_error_${ error.name || 'unknown' }`,
		};
	}
}

function makeRow( checkId, scope, status, evidence, issues, nextStep, extra = {} ) {
	return {
		check_id: checkId,
		scope,
		status,
		evidence,
		issues: issues || '-',
		next_step: nextStep,
		...extra,
	};
}

function buildMarkdown( reportDate, baseUrl, summary, rows, pageEvidence ) {
	const lines = [
		`# Maya Lawyer Live Read-Only QA - ${ reportDate }`,
		'',
		`Status: ${ summary.overall_status }`,
		'',
		'## Summary',
		`- VERIFIED LIVE READ-ONLY: fetched ${ absoluteUrl( baseUrl, TARGET_PATH ) } and anonymous WordPress REST only.`,
		`- ROUTE STATUS: ${ pageEvidence.http_status }; final URL ${ pageEvidence.final_url || '-' }.`,
		`- VERIFIED ROWS: ${ summary.verified_rows }/${ summary.total_rows }.`,
		`- BLOCKED ROWS: ${ summary.blocked_rows }/${ summary.total_rows }.`,
		'- NOT SCREENSHOT VERIFIED: no browser screenshots were captured in this Node fetch check.',
		'- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, sitemap, taxonomy, media, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.',
		'',
		'## Page Evidence',
		`- Title: ${ pageEvidence.title || '-' }`,
		`- H1 count: ${ pageEvidence.h1_count }`,
		`- H1 texts: ${ pageEvidence.h1_texts || '-' }`,
		`- Canonical: ${ pageEvidence.canonical || '-' }`,
		`- Robots: ${ pageEvidence.robots || '-' }`,
		`- Schema types: ${ pageEvidence.schema_types || '-' }`,
		`- Hebrew characters in visible text: ${ pageEvidence.hebrew_character_count }`,
		'',
		'## Checks',
		'| Check | Scope | Status | Evidence | Issues | Next step |',
		'|---|---|---|---|---|---|',
		...rows.map( ( row ) =>
			`| ${ row.check_id } | ${ row.scope } | ${ row.status } | ${ String( row.evidence ).replaceAll( '|', '/' ) } | ${ String( row.issues ).replaceAll( '|', '/' ) } | ${ String( row.next_step ).replaceAll( '|', '/' ) } |`
		),
		'',
		'## Decision',
		'- BLOCKED LIVE QA: do not mark the Maya Rotenberg mini-site live-ready until the route returns HTTP 200, self-canonical, index/follow, expected profile content, approved Attorney/Person schema and desktop/mobile screenshots.',
	];

	return `${ lines.join( '\n' ) }\n`;
}

async function main() {
	const args = parseArgs();
	if ( args.help ) {
		console.log( 'Usage: node tools/check-maya-lawyer-live-readonly.mjs --reportDate=YYYY-MM-DD [--baseUrl=https://jus-tice.co.il]' );
		return;
	}

	const targetUrl = absoluteUrl( args.baseUrl, TARGET_PATH );
	const expectedUrl = absoluteUrl( args.baseUrl, TARGET_PATH );
	const { response, body } = await fetchText( targetUrl, 'text/html,application/xhtml+xml,*/*;q=0.8' );
	const visibleText = stripTags( body );
	const title = extractTag( body, 'title' );
	const h1Texts = extractAllTags( body, 'h1' );
	const canonical = extractCanonical( body );
	const robots = extractRobots( body );
	const schemaTypes = jsonLdTypes( body );
	const finalPath = normalizePath( new URL( response.url ).pathname );
	const expectedPath = normalizePath( TARGET_PATH );
	const contentType = response.headers.get( 'content-type' ) || '';
	const restDiscovery = await restTypeDiscovery( args.baseUrl );
	const restLookup = await restSlugLookup( args.baseUrl, restDiscovery.restBase );

	const pageEvidence = {
		http_status: response.status,
		final_url: response.url,
		content_type: contentType,
		title,
		h1_count: h1Texts.length,
		h1_texts: h1Texts.join( ' | ' ),
		canonical,
		robots,
		schema_types: schemaTypes.join( ' | ' ),
		hebrew_character_count: hebrewCharacterCount( visibleText ),
		body_contains_slug: body.includes( TARGET_SLUG ) ? 'yes' : 'no',
		rest_type_http: restDiscovery.http,
		rest_type_base: restDiscovery.restBase,
		rest_slug_http: restLookup.http,
		rest_slug_count: restLookup.count,
		rest_slug_ids: restLookup.ids,
		rest_slug_links: restLookup.links,
	};

	const rows = [
		makeRow(
			'MAYA-LIVE-001',
			'profile route status and final path',
			response.status === 200 && finalPath === expectedPath ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`HTTP ${ response.status }; final URL ${ response.url }`,
			[
				response.status === 200 ? '' : `http_${ response.status }`,
				finalPath === expectedPath ? '' : `final_path_${ finalPath }`,
			].filter( Boolean ).join( ';' ),
			'After deploy/cache control, require HTTP 200 on the canonical Maya profile path.',
			pageEvidence
		),
		makeRow(
			'MAYA-LIVE-002',
			'canonical and robots',
			canonical === expectedUrl && ! /noindex/i.test( robots ) ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`canonical=${ canonical || '-' }; robots=${ robots || '-' }`,
			[
				canonical === expectedUrl ? '' : 'canonical_missing_or_mismatch',
				/noindex/i.test( robots ) ? 'noindex_detected' : '',
			].filter( Boolean ).join( ';' ),
			'Require self-canonical and index/follow only after profile approval and route repair.'
		),
		makeRow(
			'MAYA-LIVE-003',
			'visible profile identity',
			response.status === 200 && h1Texts.length === 1 && ! /page not found/i.test( title ) ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`title=${ title || '-' }; h1=${ h1Texts.join( ' | ' ) || '-' }`,
			[
				h1Texts.length === 1 ? '' : `h1_count_${ h1Texts.length }`,
				/page not found/i.test( title ) ? 'page_not_found_title' : '',
				response.status === 200 ? '' : 'not_profile_http_200',
			].filter( Boolean ).join( ';' ),
			'Open the rendered profile after route repair and verify Maya profile content, not a 404 or homepage fallback.'
		),
		makeRow(
			'MAYA-LIVE-004',
			'Attorney or Person JSON-LD',
			response.status === 200 && schemaTypes.some( ( type ) => [ 'Attorney', 'Person' ].includes( type ) ) ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`schema_types=${ schemaTypes.join( ' | ' ) || '-' }`,
			response.status === 200 ? 'missing_attorney_or_person_schema' : 'route_not_eligible_for_schema_until_http_200',
			'After profile route repair, inspect JSON-LD and run Rich Results validation.'
		),
		makeRow(
			'MAYA-LIVE-005',
			'anonymous lawyer REST type discovery',
			restDiscovery.found ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`types_http=${ restDiscovery.http }; rest_base=${ restDiscovery.restBase || '-' }`,
			restDiscovery.issue || '-',
			'Keep anonymous REST type discovery available only with public response guards.'
		),
		makeRow(
			'MAYA-LIVE-006',
			'anonymous Maya REST slug lookup',
			restLookup.http === 200 && Number( restLookup.count ) === 1 ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
			`rest_http=${ restLookup.http }; count=${ restLookup.count }; ids=${ restLookup.ids || '-' }; links=${ restLookup.links || '-' }`,
			[
				restLookup.issue,
				restLookup.http === 200 ? '' : `rest_http_${ restLookup.http }`,
				Number( restLookup.count ) === 1 ? '' : `rest_count_${ restLookup.count }`,
			].filter( Boolean ).join( ';' ),
			'After route/profile approval, require exactly one public approved Maya profile record or keep public route blocked.'
		),
		makeRow(
			'MAYA-LIVE-007',
			'desktop and mobile screenshot evidence',
			'NOT VERIFIED',
			'Node fetch check does not capture rendered screenshots.',
			'not_screenshot_verified',
			'Capture desktop and mobile screenshots after live route checks pass.'
		),
	];

	const summary = {
		report_date: args.reportDate,
		overall_status: rows.some( ( row ) => row.status.includes( 'BLOCKED' ) ) ? 'BLOCKED LIVE QA / VERIFIED LIVE READ-ONLY PARTIAL / NO PUBLIC CHANGES' : 'VERIFIED LIVE READ-ONLY / NO PUBLIC CHANGES',
		total_rows: rows.length,
		verified_rows: rows.filter( ( row ) => row.status.startsWith( 'VERIFIED' ) ).length,
		blocked_rows: rows.filter( ( row ) => row.status.includes( 'BLOCKED' ) ).length,
		not_verified_rows: rows.filter( ( row ) => row.status.includes( 'NOT VERIFIED' ) ).length,
	};

	const columns = [
		'check_id',
		'scope',
		'status',
		'evidence',
		'issues',
		'next_step',
		'http_status',
		'final_url',
		'content_type',
		'title',
		'h1_count',
		'h1_texts',
		'canonical',
		'robots',
		'schema_types',
		'hebrew_character_count',
		'body_contains_slug',
		'rest_type_http',
		'rest_type_base',
		'rest_slug_http',
		'rest_slug_count',
		'rest_slug_ids',
		'rest_slug_links',
	];

	const baseName = `maya-lawyer-live-readonly-${ args.reportDate }`;
	const reportCsv = path.join( root, 'reports', `${ baseName }.csv` );
	const reportJson = path.join( root, 'reports', `${ baseName }.json` );
	const projectCsv = path.join( root, 'project-control', `${ baseName }.csv` );
	const projectMd = path.join( root, 'project-control', `${ baseName }.md` );

	writeText( reportCsv, toCsv( rows, columns ) );
	writeText( reportJson, `${ JSON.stringify( { summary, pageEvidence, restDiscovery, restLookup, rows }, null, 2 ) }\n` );
	writeText( projectCsv, toCsv( rows, columns ) );
	writeText( projectMd, buildMarkdown( args.reportDate, args.baseUrl, summary, rows, pageEvidence ) );

	console.table( rows.map( ( row ) => ( { check_id: row.check_id, status: row.status, issues: row.issues } ) ) );
	console.log( `Maya lawyer live read-only QA: ${ summary.verified_rows }/${ summary.total_rows } VERIFIED` );
	console.log( `Wrote ${ path.relative( root, projectMd ) } and ${ path.relative( root, reportCsv ) }` );
}

main().catch( ( error ) => {
	console.error( error );
	process.exit( 1 );
} );
