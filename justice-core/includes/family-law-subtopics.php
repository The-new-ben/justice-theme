<?php
/**
 * Family Law Practice Areas — Sub-topic Hierarchy
 *
 * Registers sub-topics under the "family-law" parent practice area.
 * This ensures articles and lawyers can be tagged at specific sub-expertise level,
 * while the bridge system still matches parent-level lawyers to child-topic articles.
 *
 * Runs once via admin_init. Idempotent — safe to re-run.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'justice_core_register_family_law_subtopics', 20 );

function justice_core_register_family_law_subtopics(): void {
	// Only run if taxonomy is registered.
	if ( ! taxonomy_exists( 'practice-areas' ) ) {
		return;
	}

	// Only run once per deployment.
	if ( get_option( 'justice_family_law_subtopics_v1' ) ) {
		return;
	}

	// Ensure parent "family-law" exists.
	$parent = term_exists( 'family-law', 'practice-areas' );
	if ( ! $parent ) {
		$parent = wp_insert_term( 'דיני משפחה', 'practice-areas', array( 'slug' => 'family-law' ) );
	}
	if ( is_wp_error( $parent ) ) {
		return;
	}
	$parent_id = is_array( $parent ) ? $parent['term_id'] : $parent;

	// Sub-topics with Hebrew labels and English slugs.
	$subtopics = array(
		'divorce'            => 'גירושין',
		'custody'            => 'משמורת ילדים',
		'child-support'      => 'מזונות ילדים',
		'property-division'  => 'חלוקת רכוש',
		'rabbinical-court'   => 'בית הדין הרבני',
		'domestic-violence'  => 'אלימות במשפחה',
		'ketubah'            => 'כתובה',
		'infidelity'         => 'בגידה',
		'mediation'          => 'גישור משפחתי',
		'common-law'         => 'ידועים בציבור',
		'prenuptial'         => 'הסכם ממון',
		'reconciliation'     => 'שלום בית',
		'divorce-agreement'  => 'הסכם גירושין',
	);

	foreach ( $subtopics as $slug => $name ) {
		if ( ! term_exists( $slug, 'practice-areas' ) ) {
			wp_insert_term( $name, 'practice-areas', array(
				'slug'   => $slug,
				'parent' => (int) $parent_id,
			) );
		}
	}

	update_option( 'justice_family_law_subtopics_v1', true );
}
