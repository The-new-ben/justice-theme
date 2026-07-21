<?php
/**
 * FAQPage schema for pillar pages (display-only, extracted from the retired
 * publisher engine 2026-07-21).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * FAQPage JSON-LD for published pillar pages.
 *
 * Parses the rendered body: locates the H2 that contains "שאלות נפוצות", then
 * captures each following <h3> question with its paragraph answers until the
 * next H2. Emits schema only when at least two real Q&A pairs are found, and
 * only on pages whose body came from a reviewed pillar draft.
 */
function justice_theme_pillar_faq_schema(): void {
	if ( ! is_page() ) {
		return;
	}
	$post_id = (int) get_queried_object_id();
	if ( ! $post_id || '' === (string) get_post_meta( $post_id, 'pillar_body_from_draft', true ) ) {
		return;
	}

	$content = (string) get_post_field( 'post_content', $post_id );
	if ( false === mb_strpos( $content, 'שאלות נפוצות' ) ) {
		return;
	}

	// Slice from the FAQ heading to the next H2 (or end of content).
	$start = mb_strpos( $content, 'שאלות נפוצות' );
	$tail  = mb_substr( $content, $start );
	$end   = mb_strpos( $tail, '<h2', 10 );
	$faq   = false !== $end ? mb_substr( $tail, 0, $end ) : $tail;

	if ( ! preg_match_all( '/<h3>(.*?)<\/h3>\s*((?:<p>.*?<\/p>\s*)+)/su', $faq, $m, PREG_SET_ORDER ) ) {
		return;
	}

	$entities = array();
	foreach ( $m as $pair ) {
		$q = trim( wp_strip_all_tags( $pair[1] ) );
		$a = trim( wp_strip_all_tags( $pair[2] ) );
		if ( '' === $q || '' === $a ) {
			continue;
		}
		$entities[] = array(
			'@type'          => 'Question',
			'name'           => $q,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $a,
			),
		);
	}

	if ( count( $entities ) < 2 ) {
		return;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $entities,
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}
add_action( 'wp_head', 'justice_theme_pillar_faq_schema', 30 );
