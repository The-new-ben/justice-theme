<?php
/**
 * Review-claims kill switch (owner order, 2026-07-14): no page may claim
 * "legally reviewed by" anyone - visible boxes, JSON-LD reviewedBy, or
 * in-body byline paragraphs - until a real per-page attorney review process
 * exists. The generic non-advice disclaimer stays (protective, claim-free).
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_strip_reviewedby_jsonld( string $html ): string {
	return (string) preg_replace_callback(
		'#(<script type="application/ld\+json"[^>]*>)([\s\S]*?)(</script>)#i',
		function ( $m ) {
			$data = json_decode( $m[2], true );
			if ( ! is_array( $data ) ) {
				return $m[0];
			}
			$walk = function ( &$node ) use ( &$walk ) {
				if ( ! is_array( $node ) ) {
					return;
				}
				unset( $node['reviewedBy'] );
				foreach ( $node as &$v ) {
					$walk( $v );
				}
			};
			$walk( $data );
			return $m[1] . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . $m[3];
		},
		$html
	);
}

add_action( 'init', function () {
	remove_filter( 'the_content', 'justice_theme_append_reviewer_box', 24 );

	if ( function_exists( 'justice_theme_article_schema' ) ) {
		remove_action( 'wp_head', 'justice_theme_article_schema', 20 );
		add_action( 'wp_head', function () {
			ob_start();
			justice_theme_article_schema();
			echo justice_strip_reviewedby_jsonld( (string) ob_get_clean() );
		}, 20 );
	}

	if ( function_exists( 'justice_eeat_person_entities_schema' ) ) {
		remove_action( 'wp_head', 'justice_eeat_person_entities_schema', 25 );
		add_action( 'wp_head', function () {
			ob_start();
			justice_eeat_person_entities_schema();
			echo justice_strip_reviewedby_jsonld( (string) ob_get_clean() );
		}, 25 );
	}
}, 2 );

// Inline ld+json inside post content (eeat content signals inject at 15).
add_filter( 'the_content', 'justice_strip_reviewedby_jsonld', 16 );

// Claim-free disclaimer box in the old reviewer-box slot.
add_filter( 'the_content', function ( $content ) {
	if ( is_admin() || ! is_singular( array( 'articles', 'post' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	return $content . '<aside class="reviewer-box" aria-label="הבהרה משפטית"><p class="reviewer-box__note">המידע באתר הוא מידע כללי ואינו מהווה ייעוץ משפטי. לפני פעולה משפטית יש להתייעץ עם עורך דין.</p></aside>';
}, 24 );

// One-shot: remove the "נכתב ונבדק על ידי" byline paragraph from the 19
// legacy bodies that carry it (revision-safe; none contain gate markers).
add_action( 'init', function () {
	if ( get_option( 'justice_review_claims_body_clean_v1' ) ) {
		return;
	}

	$ids = array( 1246, 7199, 19257, 19261, 19263, 19265, 19267, 19271, 19273, 19275, 19277, 19279, 19281, 19283, 19300, 19302, 19304, 20244, 20245 );
	$done = array();

	foreach ( $ids as $id ) {
		$post = get_post( $id );
		if ( ! $post instanceof WP_Post ) {
			continue;
		}
		$new = preg_replace( '#<p><strong>\s*נכתב ונבדק על ידי:?\s*</strong>[\s\S]*?</p>\s*#u', '', (string) $post->post_content );
		if ( null !== $new && $new !== $post->post_content ) {
			wp_update_post( array( 'ID' => $id, 'post_content' => $new ) );
			$done[] = $id;
		}
	}

	update_option( 'justice_review_claims_body_clean_v1', wp_json_encode( $done ), false );
}, 20 );
