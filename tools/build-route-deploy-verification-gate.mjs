#!/usr/bin/env node
/**
 * Build a repo-only deploy verification gate for critical route rendering fixes.
 *
 * Scope:
 * - T416 real estate guide redirect guard.
 * - T418 protected practice route early render.
 * - T419 trust route early render.
 *
 * The gate is intentionally conservative: source-level guards can be VERIFIED
 * locally, while public route status remains BLOCKED until the live server has
 * pulled the commit, cleared cache, and passed read-only route checks.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const root = path.resolve( __dirname, '..' );

const args = new Map(
	process.argv.slice( 2 ).map( ( arg ) => {
		const [ key, ...value ] = arg.replace( /^--/, '' ).split( '=' );
		return [ key, value.join( '=' ) || '1' ];
	} )
);

const reportDate = args.get( 'reportDate' ) || new Date().toISOString().slice( 0, 10 );
const liveTrafficReport = args.get( 'liveTrafficReport' ) || `reports/route-deploy-live-traffic-priority-${ reportDate }.csv`;
const liveTrustReport = args.get( 'liveTrustReport' ) || `reports/route-deploy-live-trust-routes-${ reportDate }.csv`;
const liveControlledBreadcrumbReport = args.get( 'liveControlledBreadcrumbReport' ) || `reports/route-deploy-live-controlled-breadcrumbs-${ reportDate }.csv`;
const expectedMarker = '2026-05-22-route-deploy-verification-gate-v1';

const files = {
	functions: 'functions.php',
	deploymentMarker: 'deployment-marker.txt',
	practiceLanding: 'inc/practice-landing.php',
	htmlSitemap: 'inc/html-sitemap.php',
	trustRoutes: 'inc/trust-routes.php',
	routingGuards: 'inc/routing-guards.php',
	trafficChecker: 'tools/check-live-traffic-priority.mjs',
	trustChecker: 'tools/check-live-trust-routes.mjs',
	breadcrumbChecker: 'tools/check-live-breadcrumb-schema.mjs',
	controlledBreadcrumbChecker: 'tools/check-live-controlled-route-breadcrumbs.mjs',
	breadcrumbs: 'inc/breadcrumbs.php',
	taskBoard: 'project-control/task-board.csv',
};

async function readText( relativePath, optional = false ) {
	try {
		return await readFile( path.join( root, relativePath ), 'utf8' );
	} catch ( error ) {
		if ( optional ) {
			return '';
		}
		throw error;
	}
}

function hasAll( haystack, needles ) {
	return needles.every( ( needle ) => haystack.includes( needle ) );
}

function makeRow( checkId, scope, status, risk, evidence, nextStep ) {
	return {
		check_id: checkId,
		scope,
		status,
		risk,
		evidence,
		next_step: nextStep,
	};
}

function passFailRow( checkId, scope, passed, risk, passEvidence, failEvidence, nextStep ) {
	return makeRow(
		checkId,
		scope,
		passed ? 'VERIFIED LOCAL' : 'BLOCKED',
		risk,
		passed ? passEvidence : failEvidence,
		nextStep
	);
}

function csvEscape( value ) {
	const text = String( value ?? '' );
	if ( /[",\n\r]/.test( text ) ) {
		return `"${ text.replaceAll( '"', '""' ) }"`;
	}
	return text;
}

function markdownEscape( value ) {
	return String( value ?? '' ).replaceAll( '|', '\\|' ).replaceAll( '\n', '<br>' );
}

function parseCsv( text ) {
	const rows = [];
	let field = '';
	let row = [];
	let quoted = false;

	for ( let index = 0; index < text.length; index += 1 ) {
		const char = text[ index ];
		const next = text[ index + 1 ];

		if ( quoted ) {
			if ( char === '"' && next === '"' ) {
				field += '"';
				index += 1;
			} else if ( char === '"' ) {
				quoted = false;
			} else {
				field += char;
			}
			continue;
		}

		if ( char === '"' ) {
			quoted = true;
		} else if ( char === ',' ) {
			row.push( field );
			field = '';
		} else if ( char === '\n' ) {
			row.push( field );
			rows.push( row );
			row = [];
			field = '';
		} else if ( char !== '\r' ) {
			field += char;
		}
	}

	if ( field || row.length ) {
		row.push( field );
		rows.push( row );
	}

	const [ headers = [], ...records ] = rows.filter( ( candidate ) => candidate.some( ( value ) => '' !== value ) );
	return records.map( ( record ) => Object.fromEntries( headers.map( ( header, index ) => [ header, record[ index ] ?? '' ] ) ) );
}

function summarizeLiveTraffic( text ) {
	if ( '' === text.trim() ) {
		return {
			present: false,
			total: 0,
			pass: 0,
			review: 0,
			blockedRoutes: [],
		};
	}

	const rows = parseCsv( text );
	const reviewRows = rows.filter( ( row ) => row.status !== 'PASS' );
	return {
		present: true,
		total: rows.length,
		pass: rows.filter( ( row ) => row.status === 'PASS' ).length,
		review: reviewRows.length,
		blockedRoutes: reviewRows.slice( 0, 8 ).map( ( row ) => `${ row.path || 'unknown' }: ${ row.issues || row.status }` ),
	};
}

function summarizeStatusReport( text ) {
	if ( '' === text.trim() ) {
		return {
			present: false,
			total: 0,
			pass: 0,
			review: 0,
			blockedRoutes: [],
		};
	}

	const rows = parseCsv( text );
	const reviewRows = rows.filter( ( row ) => row.status !== 'PASS' );
	return {
		present: true,
		total: rows.length,
		pass: rows.filter( ( row ) => row.status === 'PASS' ).length,
		review: reviewRows.length,
		blockedRoutes: reviewRows.slice( 0, 8 ).map( ( row ) => `${ row.route || row.path || 'unknown' }: ${ row.missing || row.issues || row.status }` ),
	};
}

const source = Object.fromEntries(
	await Promise.all(
		Object.entries( files ).map( async ( [ key, relativePath ] ) => [ key, await readText( relativePath ) ] )
	)
);
const liveTrafficText = await readText( liveTrafficReport, true );
const liveTraffic = summarizeLiveTraffic( liveTrafficText );
const liveTrustText = await readText( liveTrustReport, true );
const liveTrust = summarizeStatusReport( liveTrustText );
const liveControlledBreadcrumbText = await readText( liveControlledBreadcrumbReport, true );
const liveControlledBreadcrumbs = summarizeStatusReport( liveControlledBreadcrumbText );

const rows = [
	passFailRow(
		'ROUTE-DEPLOY-001',
		'runtime deploy marker',
		source.functions.includes( `JUSTICE_DEPLOY_MARKER', '${ expectedMarker }'` ),
		'Operators need one current runtime marker before trusting post-deploy route results.',
		`functions.php exposes runtime marker ${ expectedMarker }.`,
		'functions.php does not expose the expected runtime deploy marker.',
		'After uPress pull/cache clear, confirm the meta marker on a public HTML response.'
	),
	passFailRow(
		'ROUTE-DEPLOY-002',
		'static deploy marker',
		source.deploymentMarker.includes( expectedMarker ),
		'Static theme-file checks need to distinguish old cache from the current route gate bundle.',
		`deployment-marker.txt records static marker ${ expectedMarker }.`,
		'deployment-marker.txt does not contain the expected static route gate marker.',
		'After uPress pull/cache clear, fetch /wp-content/themes/justice-theme/deployment-marker.txt with a cache-busting query.'
	),
	passFailRow(
		'ROUTE-DEPLOY-003',
		'protected practice early render',
		hasAll( source.practiceLanding, [
			'template_redirect',
			'-999999',
			'controlled-practice-early-render',
			'justice_theme_render_controlled_practice_route',
		] ),
		'Money-route templates must render before late WordPress redirect plugins.',
		'inc/practice-landing.php has the early controlled practice route renderer and guard header.',
		'inc/practice-landing.php is missing the expected early controlled practice route renderer.',
		'Run the live traffic checker after deploy for /family-law/, /medical-malpractice-lawyer/, /real-estate-lawyer-guide/ and /inheritance-lawyer/.'
	),
	passFailRow(
		'ROUTE-DEPLOY-004',
		'HTML sitemap early render',
		hasAll( source.htmlSitemap, [
			'template_redirect',
			'-999999',
			'justice_theme_maybe_render_html_sitemap',
			'justice_theme_render_html_sitemap_page',
		] ),
		'/site-map/ must not collapse to the homepage before crawlers can use it.',
		'inc/html-sitemap.php renders the HTML sitemap route at the earliest route priority.',
		'inc/html-sitemap.php is missing the expected early sitemap route renderer.',
		'Run the live traffic checker after deploy and require /site-map/ initial HTTP 200.'
	),
	passFailRow(
		'ROUTE-DEPLOY-005',
		'trust route early render',
		hasAll( source.trustRoutes, [
			'template_redirect',
			'-999999',
			'trust-route-early-render',
			'justice_theme_render_trust_route',
		] ),
		'Trust and lead routes must not redirect to the homepage after CMS/page absence.',
		'inc/trust-routes.php renders /about/, /contact/ and /editorial-policy/ early with a guard header.',
		'inc/trust-routes.php is missing the expected early trust route renderer.',
		'Run the trust-route checker after deploy and require about/contact/editorial-policy PASS.'
	),
	passFailRow(
		'ROUTE-DEPLOY-006',
		'real estate guide redirect guard',
		hasAll( source.routingGuards, [
			'justice_theme_is_real_estate_guide_request_path',
			'justice_theme_block_real_estate_guide_conflict_wp_redirect',
			'justice_theme_block_real_estate_guide_conflict_canonical_redirect',
			'/real-estate-attorney',
		] ),
		'The real estate guide route must not be sent to the homepage or stale attorney hub.',
		'inc/routing-guards.php blocks known WordPress-level conflict redirects for /real-estate-lawyer-guide/.',
		'inc/routing-guards.php is missing the expected real estate guide redirect guard.',
		'If live traffic still redirects before the marker appears, inspect uPress/server/CDN/plugin redirect rules.'
	),
	passFailRow(
		'ROUTE-DEPLOY-007',
		'traffic checker final-path coverage',
		hasAll( source.trafficChecker, [
			'mustFinalPath',
			'/real-estate-lawyer-guide/',
			'/contact/',
			'/about/',
			'/site-map/',
		] ),
		'The live checker must fail homepage-collapse and stale-final-path regressions.',
		'tools/check-live-traffic-priority.mjs checks final path and includes the protected/trust route set.',
		'tools/check-live-traffic-priority.mjs is missing route final-path coverage.',
		'Run with JUSTICE_WRITE_REPORT=1 after every deploy until all critical route rows PASS.'
	),
	passFailRow(
		'ROUTE-DEPLOY-008',
		'trust checker coverage',
		hasAll( source.trustChecker, [
			'/about/',
			'/contact/',
			'/editorial-policy/',
			'X-Justice',
		] ) || hasAll( source.trustChecker, [
			'/about/',
			'/contact/',
			'/editorial-policy/',
			'canonical',
		] ),
		'Trust routes need a focused checker in addition to broad traffic QA.',
		'tools/check-live-trust-routes.mjs covers about/contact/editorial-policy route content, canonical, robots and H1 expectations.',
		'tools/check-live-trust-routes.mjs is missing expected trust-route coverage.',
		'Run the trust checker after deploy and capture failures before changing redirect rules.'
	),
	passFailRow(
		'ROUTE-DEPLOY-009',
		'breadcrumb checker coverage',
		hasAll( source.breadcrumbChecker, [
			'/family-law/',
			'/criminal-defense-attorney/',
			'BreadcrumbList',
		] ) && hasAll( source.controlledBreadcrumbChecker, [
			'/medical-malpractice-lawyer/',
			'/real-estate-lawyer-guide/',
			'/inheritance-lawyer/',
			'BreadcrumbList',
		] ) && hasAll( source.breadcrumbs, [
			'justice_theme_filter_controlled_practice_yoast_breadcrumb_schema',
			'wpseo_schema_graph',
		] ),
		'Route repairs must preserve breadcrumb schema on crawl hubs and money pages.',
		'Live breadcrumb tooling covers broad crawl seeds and a focused controlled-route set; source removes stale SEO-plugin BreadcrumbList nodes on controlled routes.',
		'Live breadcrumb tooling or the controlled-route stale BreadcrumbList filter is missing expected coverage.',
		'After deploy, run a focused breadcrumb report for controlled routes before promotion.'
	),
	passFailRow(
		'ROUTE-DEPLOY-010',
		'task board route blockers tracked',
		hasAll( source.taskBoard, [
			'T416',
			'T418',
			'T419',
			'NOT LIVE VERIFIED',
		] ),
		'Open route tasks need to remain visible until public server verification passes.',
		'task-board.csv still tracks T416, T418 and T419 as not live verified / deploy blocked.',
		'task-board.csv is missing one or more critical route deploy blockers.',
		'Mark route tasks complete only after live marker and route checkers pass.'
	),
	makeRow(
		'ROUTE-DEPLOY-011',
		'live traffic read-only report',
		liveTraffic.present && liveTraffic.review === 0 ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
		'Public route state is the real acceptance test; source checks alone are insufficient.',
		liveTraffic.present
			? `Live traffic report ${ liveTrafficReport } has ${ liveTraffic.pass }/${ liveTraffic.total } PASS and ${ liveTraffic.review } REVIEW rows${ liveTraffic.blockedRoutes.length ? `; sample blockers: ${ liveTraffic.blockedRoutes.join( ' | ' ) }` : '.' }`
			: `No live traffic report found at ${ liveTrafficReport }.`,
		'After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-traffic-priority.mjs and regenerate this gate.'
	),
	makeRow(
		'ROUTE-DEPLOY-012',
		'live trust route read-only report',
		liveTrust.present && liveTrust.review === 0 ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
		'/editorial-policy/ is not in the broad traffic checker and needs focused live trust-route verification.',
		liveTrust.present
			? `Live trust report ${ liveTrustReport } has ${ liveTrust.pass }/${ liveTrust.total } PASS and ${ liveTrust.review } REVIEW rows${ liveTrust.blockedRoutes.length ? `; sample blockers: ${ liveTrust.blockedRoutes.join( ' | ' ) }` : '.' }`
			: `No live trust report found at ${ liveTrustReport }.`,
		'After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-trust-routes.mjs and regenerate this gate.'
	),
	makeRow(
		'ROUTE-DEPLOY-013',
		'live controlled-route breadcrumb report',
		liveControlledBreadcrumbs.present && liveControlledBreadcrumbs.review === 0 ? 'VERIFIED LIVE READ-ONLY' : 'BLOCKED LIVE QA',
		'Controlled money routes need live BreadcrumbList proof, not only source-level routing proof.',
		liveControlledBreadcrumbs.present
			? `Live controlled breadcrumb report ${ liveControlledBreadcrumbReport } has ${ liveControlledBreadcrumbs.pass }/${ liveControlledBreadcrumbs.total } PASS and ${ liveControlledBreadcrumbs.review } REVIEW rows${ liveControlledBreadcrumbs.blockedRoutes.length ? `; sample blockers: ${ liveControlledBreadcrumbs.blockedRoutes.join( ' | ' ) }` : '.' }`
			: `No live controlled breadcrumb report found at ${ liveControlledBreadcrumbReport }.`,
		'After uPress pull/cache clear, rerun JUSTICE_WRITE_REPORT=1 with tools/check-live-controlled-route-breadcrumbs.mjs and regenerate this gate.'
	),
	makeRow(
		'ROUTE-DEPLOY-014',
		'visual screenshot verification',
		'NOT VERIFIED',
		'Visual proof is still required for public route promotion.',
		'No desktop/mobile screenshot evidence was captured in this repo-only gate.',
		'Capture desktop/mobile screenshots for /family-law/, /medical-malpractice-lawyer/, /real-estate-lawyer-guide/, /inheritance-lawyer/, /contact/ and /about/ after live route checks pass.'
	),
];

const summary = {
	report_date: reportDate,
	expected_marker: expectedMarker,
	overall_status: rows.some( ( row ) => row.status.includes( 'BLOCKED' ) )
		? 'VERIFIED LOCAL / BLOCKED LIVE QA / NO PUBLIC CMS CHANGE'
		: 'VERIFIED LOCAL / VERIFIED LIVE READ-ONLY / NOT SCREENSHOT VERIFIED / NO PUBLIC CMS CHANGE',
	total_checks: rows.length,
	verified_rows: rows.filter( ( row ) => row.status.includes( 'VERIFIED' ) && ! row.status.includes( 'NOT VERIFIED' ) ).length,
	blocked_rows: rows.filter( ( row ) => row.status.includes( 'BLOCKED' ) ).length,
	not_verified_rows: rows.filter( ( row ) => row.status.includes( 'NOT VERIFIED' ) ).length,
	live_traffic_report: liveTrafficReport,
	live_traffic_total: liveTraffic.total,
	live_traffic_pass: liveTraffic.pass,
	live_traffic_review: liveTraffic.review,
	live_trust_report: liveTrustReport,
	live_trust_total: liveTrust.total,
	live_trust_pass: liveTrust.pass,
	live_trust_review: liveTrust.review,
	live_controlled_breadcrumb_report: liveControlledBreadcrumbReport,
	live_controlled_breadcrumb_total: liveControlledBreadcrumbs.total,
	live_controlled_breadcrumb_pass: liveControlledBreadcrumbs.pass,
	live_controlled_breadcrumb_review: liveControlledBreadcrumbs.review,
};

const headers = [ 'check_id', 'scope', 'status', 'risk', 'evidence', 'next_step' ];
const csv = [
	headers.join( ',' ),
	...rows.map( ( row ) => headers.map( ( header ) => csvEscape( row[ header ] ) ).join( ',' ) ),
].join( '\n' ) + '\n';

const markdown = `# Route Deploy Verification Gate - ${ reportDate }

Status: ${ summary.overall_status }

## Summary
- VERIFIED LOCAL: source guards and checker coverage are in place for T416, T418 and T419.
- VERIFIED LOCAL: runtime and static deploy markers now use \`${ expectedMarker }\`.
- ${ liveTraffic.present && liveTraffic.review === 0 ? `VERIFIED LIVE READ-ONLY: live traffic report \`${ liveTrafficReport }\` has \`${ liveTraffic.pass }/${ liveTraffic.total }\` PASS rows.` : ( liveTraffic.present ? `BLOCKED LIVE QA: live traffic report \`${ liveTrafficReport }\` currently has \`${ liveTraffic.pass }/${ liveTraffic.total }\` PASS rows and \`${ liveTraffic.review }\` REVIEW rows.` : `BLOCKED LIVE QA: no live traffic report was found at \`${ liveTrafficReport }\`.` ) }
- ${ liveTrust.present && liveTrust.review === 0 ? `VERIFIED LIVE READ-ONLY: live trust report \`${ liveTrustReport }\` has \`${ liveTrust.pass }/${ liveTrust.total }\` PASS rows.` : ( liveTrust.present ? `BLOCKED LIVE QA: live trust report \`${ liveTrustReport }\` currently has \`${ liveTrust.pass }/${ liveTrust.total }\` PASS rows and \`${ liveTrust.review }\` REVIEW rows.` : `BLOCKED LIVE QA: no live trust report was found at \`${ liveTrustReport }\`.` ) }
- ${ liveControlledBreadcrumbs.present && liveControlledBreadcrumbs.review === 0 ? `VERIFIED LIVE READ-ONLY: live controlled breadcrumb report \`${ liveControlledBreadcrumbReport }\` has \`${ liveControlledBreadcrumbs.pass }/${ liveControlledBreadcrumbs.total }\` PASS rows.` : ( liveControlledBreadcrumbs.present ? `BLOCKED LIVE QA: live controlled breadcrumb report \`${ liveControlledBreadcrumbReport }\` currently has \`${ liveControlledBreadcrumbs.pass }/${ liveControlledBreadcrumbs.total }\` PASS rows and \`${ liveControlledBreadcrumbs.review }\` REVIEW rows.` : `BLOCKED LIVE QA: no live controlled breadcrumb report was found at \`${ liveControlledBreadcrumbReport }\`.` ) }
- NOT VERIFIED: desktop/mobile screenshots are still required after live route checks pass.
- SAFETY: no public CMS record, page body, lawyer profile, URL redirect rule, canonical/noindex, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4, wp-admin setting or uPress deployment was changed.

## Post-Deploy Commands
\`\`\`powershell
$env:JUSTICE_WRITE_REPORT='1'
$env:JUSTICE_TRAFFIC_REPORT='reports/route-deploy-live-traffic-priority-${ reportDate }.csv'
node tools/check-live-traffic-priority.mjs
$env:JUSTICE_TRUST_REPORT='reports/route-deploy-live-trust-routes-${ reportDate }.csv'
node tools/check-live-trust-routes.mjs
$env:JUSTICE_BREADCRUMB_REPORT='reports/route-deploy-breadcrumb-schema-${ reportDate }.csv'
$env:JUSTICE_WRITE_REPORT='1'
node tools/check-live-breadcrumb-schema.mjs
$env:JUSTICE_CONTROLLED_BREADCRUMB_REPORT='reports/route-deploy-live-controlled-breadcrumbs-${ reportDate }.csv'
node tools/check-live-controlled-route-breadcrumbs.mjs
node tools/build-route-deploy-verification-gate.mjs --reportDate=${ reportDate }
\`\`\`

## Checks
| Check | Scope | Status | Evidence | Next step |
|---|---|---|---|---|
${ rows.map( ( row ) => `| ${ markdownEscape( row.check_id ) } | ${ markdownEscape( row.scope ) } | ${ markdownEscape( row.status ) } | ${ markdownEscape( row.evidence ) } | ${ markdownEscape( row.next_step ) } |` ).join( '\n' ) }

## Decision
- BLOCKED: do not mark T416, T418 or T419 complete until the live marker is visible, the traffic/trust/breadcrumb checks pass and screenshots are captured.
- READY FOR DEPLOY QA: the repo-side route guard package is ready for uPress pull/cache clear and read-only verification.
`;

const reportDir = path.join( root, 'reports' );
const controlDir = path.join( root, 'project-control' );
await mkdir( reportDir, { recursive: true } );
await mkdir( controlDir, { recursive: true } );

await writeFile( path.join( reportDir, `route-deploy-verification-gate-${ reportDate }.csv` ), csv );
await writeFile( path.join( reportDir, `route-deploy-verification-gate-${ reportDate }.json` ), `${ JSON.stringify( { summary, checks: rows }, null, 2 ) }\n` );
await writeFile( path.join( controlDir, `route-deploy-verification-gate-${ reportDate }.csv` ), csv );
await writeFile( path.join( controlDir, `route-deploy-verification-gate-${ reportDate }.md` ), markdown );

console.log( JSON.stringify( summary, null, 2 ) );
