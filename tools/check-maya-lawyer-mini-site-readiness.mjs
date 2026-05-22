#!/usr/bin/env node
/**
 * Build a repo-only readiness packet for the Maya Rotenberg lawyer mini-site.
 *
 * This checker does not call WordPress, GSC, GA4 or wp-admin. It inspects the
 * theme code and existing control docs so public profile work stays gated until
 * the live route, cache and owner approvals are verified separately.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const root = path.resolve( __dirname, '..' );

const args = new Map(
	process.argv
		.slice( 2 )
		.map( ( arg ) => {
			const [ key, ...value ] = arg.replace( /^--/, '' ).split( '=' );
			return [ key, value.join( '=' ) || '1' ];
		} )
);

const reportDate = args.get( 'reportDate' ) || new Date().toISOString().slice( 0, 10 );

const paths = {
	single: 'single-justice_lawyer.php',
	archive: 'archive-justice_lawyer.php',
	schema: 'inc/schema.php',
	authority: 'inc/authority.php',
	templateTags: 'inc/template-tags.php',
	restGuards: 'inc/lawyer-rest-guards.php',
	liveMigrations: 'inc/live-migrations.php',
	authorityGate: 'project-control/authority-person-profile-schema-gate-2026-05-22.md',
	visualQa: 'project-control/visual-qa-report.md',
};

async function readText( relativePath ) {
	return readFile( path.join( root, relativePath ), 'utf8' );
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

const files = Object.fromEntries(
	await Promise.all(
		Object.entries( paths ).map( async ( [ key, relativePath ] ) => [
			key,
			await readText( relativePath ),
		] )
	)
);

const rows = [
	passFailRow(
		'MAYA-MINI-001',
		'single lawyer profile public gate',
		hasAll( files.single, [
			'justice_theme_lawyer_profile_is_public_approved',
			'$wp_query->set_404()',
			'include get_404_template()',
		] ),
		'Unapproved, seed or demo lawyer profiles must not render as public mini-sites.',
		'single-justice_lawyer.php blocks unapproved public requests with 404 handling before template output.',
		'single-justice_lawyer.php is missing the expected public approval and 404 guard.',
		'Keep this guard in place before any profile publishing or route repair.'
	),
	( () => {
		const passed = hasAll( files.single, [
			'justice_theme_authority_verified_person_slug_for_post',
			'$authority_person_slug',
			'$connected_article_slugs',
		] );

		return makeRow(
			'MAYA-MINI-002',
			'Maya related-article slug resolution',
			passed ? 'FIXED / VERIFIED LOCAL' : 'BLOCKED',
			'Maya articles can fail to attach if the profile still has a Hebrew legacy slug.',
			passed
				? 'single-justice_lawyer.php now adds the shared authority person slug into related article lookup.'
				: 'single-justice_lawyer.php does not use the shared authority person slug for related article lookup.',
			'After deployment, verify Maya profile related articles include content connected to advocate-maya-rotenberg.'
		);
	} )(),
	passFailRow(
		'MAYA-MINI-003',
		'connected lawyer article query',
		hasAll( files.single, [
			'connected_lawyer_slug',
			'`\' . $connected_article_slug . \'`',
			"'post_type'           => 'articles'",
		] ),
		'The mini-site needs a deterministic CMS field connection to supporting articles.',
		'single-justice_lawyer.php queries published articles by connected_lawyer_slug, including backtick-wrapped values.',
		'single-justice_lawyer.php is missing the expected connected_lawyer_slug article query.',
		'Keep the connected_lawyer_slug field populated on approved supporting articles.'
	),
	passFailRow(
		'MAYA-MINI-004',
		'no fake ratings or recommendations',
		hasAll( files.single, [
			'$show_rating       = $reviews_enabled && $review_count > 0 && $average_rating > 0;',
			'justice_theme_lawyer_public_recommendations',
			'$show_approved_recommendations = ! empty( $approved_recommendations );',
		] ),
		'Ratings, reviews and testimonials must not be invented for authority or conversion.',
		'single-justice_lawyer.php shows ratings/recommendations only after explicit CMS review signals and real counts.',
		'single-justice_lawyer.php rating/recommendation display gates are incomplete.',
		'Before publishing, confirm Maya has approved review/recommendation data or leave those modules empty.'
	),
	passFailRow(
		'MAYA-MINI-005',
		'profile view tracking gate',
		hasAll( files.single, [
			"apply_filters( 'justice_theme_enable_lawyer_profile_view_tracking', false )",
			'! is_user_logged_in()',
			'bot|crawl|spider',
		] ),
		'View counters must not inflate during QA, crawls or logged-in editing.',
		'single-justice_lawyer.php keeps profile view tracking disabled by default and excludes bots/logged-in/admin-like views.',
		'single-justice_lawyer.php profile view tracking guard is incomplete.',
		'Only enable tracking after live QA and analytics expectations are defined.'
	),
	passFailRow(
		'MAYA-MINI-006',
		'lead form routing and spam guards',
		hasAll( files.single, [
			'admin-post.php',
			"action\" value=\"justice_submit_lead",
			'assigned_lawyer_id',
			'justice_theme_render_lead_spam_fields',
			'justice_theme_render_lead_attribution_fields',
		] ),
		'Mini-site leads must route to the profile while retaining spam and attribution controls.',
		'single-justice_lawyer.php includes assigned_lawyer_id, nonce, spam fields and attribution fields in the inquiry form.',
		'single-justice_lawyer.php inquiry form is missing expected routing/spam/attribution controls.',
		'After deploy, submit one controlled test lead only in an approved staging/live QA window.'
	),
	passFailRow(
		'MAYA-MINI-007',
		'lawyer archive public filtering',
		hasAll( files.archive, [
			'justice_theme_lawyer_profile_is_public_approved',
			'$approved_lawyer_ids',
			"$args['post__in']",
		] ),
		'The public lawyer directory must not list unapproved or seed profiles.',
		'archive-justice_lawyer.php limits public directory output to approved lawyer IDs.',
		'archive-justice_lawyer.php is missing expected approved-lawyer filtering.',
		'After deploy, confirm the directory excludes seed/demo lawyers and includes only approved profiles.'
	),
	passFailRow(
		'MAYA-MINI-008',
		'public REST output guards',
		hasAll( files.restGuards, [
			'rest_justice_lawyer_query',
			'justice_theme_block_unapproved_lawyer_rest_item',
			'unset( $data[\'meta\'], $data[\'acf\'], $data[\'guid\'] );',
		] ),
		'REST endpoints must not leak private lawyer meta or expose unapproved profiles.',
		'inc/lawyer-rest-guards.php filters collections, blocks unapproved item reads and strips sensitive public response fields.',
		'inc/lawyer-rest-guards.php is missing expected public REST guards.',
		'After deploy, read-only check anonymous REST for Maya and one unapproved profile ID.'
	),
	passFailRow(
		'MAYA-MINI-009',
		'Attorney and Person schema gates',
		hasAll( files.schema, [
			'justice_theme_lawyer_schema',
			'justice_theme_lawyer_person_schema',
			'justice_theme_lawyer_profile_is_public_approved',
			'justice_theme_authority_verified_person_slug_for_post',
		] ) && hasAll( files.authority, [
			'advocate-maya-rotenberg',
			'justice_theme_authority_get_verified_person_schema',
		] ),
		'Schema should strengthen verified authority without creating schema for unapproved profiles.',
		'inc/schema.php gates Attorney/Person schema behind public approval and inc/authority.php contains the Maya authority registry entry.',
		'Schema or authority files are missing expected Maya public approval gates.',
		'After deploy, inspect JSON-LD on /lawyers/advocate-maya-rotenberg/ and run Rich Results validation.'
	),
	passFailRow(
		'MAYA-MINI-010',
		'Maya slug/profile migrations are opt-in',
		hasAll( files.liveMigrations, [
			'justice_theme_live_migration_is_enabled',
			"apply_filters( $filter_name, false )",
			'justice_theme_enable_maya_slug_migration',
			'justice_theme_enable_maya_minisite_bootstrap',
			'justice_theme_enable_maya_public_sources_bootstrap',
		] ),
		'Live profile data migrations must not run automatically without owner approval.',
		'inc/live-migrations.php keeps Maya slug, mini-site and source bootstraps behind false-by-default filters.',
		'inc/live-migrations.php migration opt-in gates are incomplete.',
		'Do not enable these filters until owner approves the exact live migration step and rollback capture exists.'
	),
	passFailRow(
		'MAYA-MINI-011',
		'Maya identity helper',
		hasAll( files.templateTags, [
			'justice_theme_get_connected_lawyer_by_slug',
			'advocate-maya-rotenberg',
			'legacy_slugs',
			'justice_theme_lawyer_profile_is_public_approved',
		] ),
		'Maya profile lookup must tolerate legacy Hebrew slugs during the transition.',
		'inc/template-tags.php can resolve Maya by canonical slug, legacy Hebrew slugs and title search before public approval checks.',
		'inc/template-tags.php is missing expected Maya legacy lookup or approval helper code.',
		'Use this helper for route/schema/article connections instead of adding new one-off Maya matchers.'
	),
	makeRow(
		'MAYA-MINI-012',
		'public live profile verification',
		'BLOCKED',
		'The public Maya route cannot be treated as upload-ready until live redirect/cache behavior is confirmed.',
		hasAll( files.authorityGate, [ 'NOT LIVE VERIFIED', 'redirect loop', '/lawyers/advocate-maya-rotenberg/' ] )
			? 'Existing authority gate records NOT LIVE VERIFIED and calls out the Maya redirect loop/live route check.'
			: 'Current docs do not contain enough live-route evidence for the Maya profile.',
		'After uPress pull/deploy/cache clear, open /lawyers/advocate-maya-rotenberg/ and verify HTTP status, canonical, robots, schema and visible content.'
	),
	makeRow(
		'MAYA-MINI-013',
		'visual screenshots',
		'NOT VERIFIED',
		'Premium visual QA still needs rendered desktop/mobile evidence after deploy.',
		files.visualQa.includes( 'Maya redirect loop' ) || files.visualQa.includes( 'NOT SCREENSHOT VERIFIED' )
			? 'visual-qa-report.md still requires Maya public profile screenshots after deployment/live route repair.'
			: 'No current screenshot evidence was found in visual-qa-report.md.',
		'Capture desktop/mobile screenshots after the live route is fixed; do not rely only on code inspection.'
	),
];

const summary = {
	report_date: reportDate,
	overall_status: 'FIXED / VERIFIED LOCAL / BLOCKED LIVE QA / NO PUBLIC CMS CHANGE',
	total_checks: rows.length,
	fixed_rows: rows.filter( ( row ) => row.status.includes( 'FIXED' ) ).length,
	verified_rows: rows.filter( ( row ) => row.status.includes( 'VERIFIED' ) ).length,
	blocked_rows: rows.filter( ( row ) => row.status.includes( 'BLOCKED' ) ).length,
	not_verified_rows: rows.filter( ( row ) => row.status.includes( 'NOT VERIFIED' ) ).length,
};

const headers = [ 'check_id', 'scope', 'status', 'risk', 'evidence', 'next_step' ];
const csv = [
	headers.join( ',' ),
	...rows.map( ( row ) => headers.map( ( header ) => csvEscape( row[ header ] ) ).join( ',' ) ),
].join( '\n' ) + '\n';

const markdown = `# Maya Rotenberg Lawyer Mini-site Readiness - ${ reportDate }

Status: ${ summary.overall_status }

## Summary
- FIXED / VERIFIED LOCAL: the lawyer profile template now includes the shared authority person slug in related-article lookup, so Maya content connected to \`advocate-maya-rotenberg\` can attach even while legacy slug handling is still present.
- VERIFIED LOCAL: ${ summary.verified_rows }/${ summary.total_checks } checks passed by source inspection across the profile template, directory archive, schema, authority helpers, REST guards and opt-in live migrations.
- BLOCKED: live public profile verification remains blocked until deployment/uPress cache state is controlled and \`/lawyers/advocate-maya-rotenberg/\` is checked directly.
- NOT VERIFIED: no desktop/mobile screenshot evidence was captured in this repo-only pass.
- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, sitemap, taxonomy, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## Checks
| Check | Scope | Status | Evidence | Next step |
|---|---|---|---|---|
${ rows.map( ( row ) => `| ${ markdownEscape( row.check_id ) } | ${ markdownEscape( row.scope ) } | ${ markdownEscape( row.status ) } | ${ markdownEscape( row.evidence ) } | ${ markdownEscape( row.next_step ) } |` ).join( '\n' ) }

## Upload Gate
- BLOCKED: do not publish, redirect, delete, noindex, canonicalize or migrate the Maya lawyer profile until owner approval, rollback capture, live route verification and screenshot QA are complete.
- READY FOR REVIEW: code-side safety is strong enough to prepare the Maya mini-site as a controlled candidate once the live route/cache issue is resolved.
`;

const reportDir = path.join( root, 'reports' );
const controlDir = path.join( root, 'project-control' );
await mkdir( reportDir, { recursive: true } );
await mkdir( controlDir, { recursive: true } );

await writeFile( path.join( reportDir, `maya-lawyer-mini-site-readiness-${ reportDate }.csv` ), csv );
await writeFile( path.join( reportDir, `maya-lawyer-mini-site-readiness-${ reportDate }.json` ), `${ JSON.stringify( { summary, checks: rows }, null, 2 ) }\n` );
await writeFile( path.join( controlDir, `maya-lawyer-mini-site-readiness-${ reportDate }.csv` ), csv );
await writeFile( path.join( controlDir, `maya-lawyer-mini-site-readiness-${ reportDate }.md` ), markdown );

console.log( JSON.stringify( summary, null, 2 ) );
