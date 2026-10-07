<?php
/**
 * Practice-area hub content (HAD-461, stage 4, 2026-10-07).
 *
 * The practice-area hubs keep their full guide in the term description
 * (taxonomy-practice-areas.php prints it through wp_kses_post( wpautop() ),
 * and justice-ops/practice-polish.php moves it into the readable
 * "המדריך המלא" section). WordPress core runs every term description through
 * wp_filter_kses on save, which keeps only inline tags, so headings, lists
 * and tables were stripped and a guide could not carry structure.
 *
 * 1. Practice-area term descriptions saved by a user who can manage terms
 *    are filtered with the post-content rules (wp_filter_post_kses) instead,
 *    the same rules every article body already passes. Other taxonomies are
 *    untouched.
 * 2. FAQPage JSON-LD for a practice-area hub, built from the "שאלות נפוצות"
 *    heading of its description (h3 question + following paragraph), the
 *    same pattern the article schema uses. Hubs without that section emit
 *    nothing.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Priority 9: keep a post-kses copy of a practice-area description.
 *
 * @param string $value    Slashed description.
 * @param string $taxonomy Taxonomy slug.
 * @return string
 */
function justice_theme_practice_term_description_kses_before( $value, $taxonomy = '' ) {
	unset( $GLOBALS['justice_theme_practice_term_description'] );

	if ( 'practice-areas' === $taxonomy && function_exists( 'current_user_can' ) && current_user_can( 'manage_categories' ) ) {
		$GLOBALS['justice_theme_practice_term_description'] = wp_filter_post_kses( $value );
	}

	return $value;
}
add_filter( 'pre_term_description', 'justice_theme_practice_term_description_kses_before', 9, 2 );

/**
 * Priority 11: after core's wp_filter_kses (priority 10), restore the
 * post-kses copy for practice-area descriptions.
 *
 * @param string $value    Filtered description.
 * @param string $taxonomy Taxonomy slug.
 * @return string
 */
function justice_theme_practice_term_description_kses_after( $value, $taxonomy = '' ) {
	if ( 'practice-areas' === $taxonomy && isset( $GLOBALS['justice_theme_practice_term_description'] ) ) {
		$value = $GLOBALS['justice_theme_practice_term_description'];
	}

	unset( $GLOBALS['justice_theme_practice_term_description'] );

	return $value;
}
add_filter( 'pre_term_description', 'justice_theme_practice_term_description_kses_after', 11, 2 );

/**
 * Extract FAQ pairs from a description: everything after the first heading
 * that contains "שאלות נפוצות", then each h3 question with the paragraph
 * that follows it.
 *
 * @param string $html Description HTML.
 * @return array<int,array{q:string,a:string}>
 */
function justice_theme_practice_term_faq_pairs( string $html ): array {
	if ( ! preg_match( '/<h[2-4][^>]*>[^<]{0,160}?שאלות נפוצות/u', $html, $anchor, PREG_OFFSET_CAPTURE ) ) {
		return array();
	}

	$faq = substr( $html, (int) $anchor[0][1] );

	if ( ! preg_match_all( '/<h3[^>]*>(.+?)<\/h3>\s*<p[^>]*>(.+?)<\/p>/us', $faq, $matches, PREG_SET_ORDER ) ) {
		return array();
	}

	$pairs = array();

	foreach ( $matches as $m ) {
		$q = trim( wp_strip_all_tags( $m[1] ) );
		$a = trim( wp_strip_all_tags( $m[2] ) );

		if ( mb_strlen( $q ) > 5 && mb_strlen( $a ) > 15 ) {
			$pairs[] = array( 'q' => $q, 'a' => $a );
		}
	}

	return array_slice( $pairs, 0, 15 );
}

/**
 * FAQPage JSON-LD on a practice-area hub whose description has an FAQ.
 */
function justice_theme_practice_term_faq_schema() {
	if ( ! is_tax( 'practice-areas' ) ) {
		return;
	}

	$term = get_queried_object();

	if ( ! ( $term instanceof WP_Term ) || '' === trim( (string) $term->description ) ) {
		return;
	}

	$pairs = justice_theme_practice_term_faq_pairs( (string) $term->description );

	if ( count( $pairs ) < 2 ) {
		return;
	}

	$entities = array();

	foreach ( $pairs as $pair ) {
		$entities[] = array(
			'@type'          => 'Question',
			'name'           => $pair['q'],
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $pair['a'],
			),
		);
	}

	echo '<script type="application/ld+json">' . wp_json_encode(
		array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => $entities,
		),
		JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
	) . '</script>' . "\n";
}
add_action( 'wp_head', 'justice_theme_practice_term_faq_schema', 23 );
