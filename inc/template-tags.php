<?php
/**
 * Template tags.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Calculate reading time.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function justice_theme_reading_time( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$content = get_post_field( 'post_content', $post_id );
	$words   = str_word_count( wp_strip_all_tags( $content ) );
	$minutes = max( 1, (int) ceil( $words / 220 ) );

	return sprintf(
		/* translators: %d: minutes. */
		_n( '%d דקת קריאה', '%d דקות קריאה', $minutes, 'justice-theme' ),
		$minutes
	);
}

/**
 * Get primary practice area term.
 *
 * @param int $post_id Post ID.
 * @return WP_Term|null
 */
function justice_theme_get_primary_practice_area( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$terms   = get_the_terms( $post_id, 'practice-areas' );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return null;
	}

	return array_shift( $terms );
}

/**
 * Resolve a public lawyer profile connected from article metadata.
 *
 * @param string $slug Canonical lawyer slug.
 * @return WP_Post|null
 */
function justice_theme_get_connected_lawyer_by_slug( string $slug ): ?WP_Post {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return null;
	}

	$slug = sanitize_title( $slug );

	if ( '' === $slug ) {
		return null;
	}

	$lawyer = get_page_by_path( $slug, OBJECT, 'justice_lawyer' );
	if ( $lawyer instanceof WP_Post && 'publish' === get_post_status( $lawyer ) ) {
		return $lawyer;
	}

	if ( 'advocate-maya-rotenberg' !== $slug ) {
		return null;
	}

	$legacy_slugs = array(
		rawurldecode( '%D7%A2%D7%95%D7%93-%D7%9E%D7%90%D7%99%D7%94-%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ),
		rawurldecode( '%D7%A2%D7%95%D7%A8%D7%9B%D7%AA-%D7%93%D7%99%D7%9F-%D7%9E%D7%90%D7%99%D7%94-%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ),
	);

	foreach ( $legacy_slugs as $legacy_slug ) {
		$lawyer = get_page_by_path( $legacy_slug, OBJECT, 'justice_lawyer' );
		if ( $lawyer instanceof WP_Post && 'publish' === get_post_status( $lawyer ) ) {
			return $lawyer;
		}
	}

	$candidates = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			's'              => rawurldecode( '%D7%9E%D7%90%D7%99%D7%94%20%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ),
			'posts_per_page' => 5,
			'no_found_rows'  => true,
		)
	);

	foreach ( $candidates as $candidate ) {
		$title = get_the_title( $candidate );

		if (
			false !== mb_strpos( $title, rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
			&& false !== mb_strpos( $title, rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
		) {
			return $candidate;
		}
	}

	return null;
}

/**
 * Safe excerpt with word limit.
 *
 * @param int $post_id   Post ID.
 * @param int $word_count Word count.
 * @return string
 */
function justice_theme_excerpt( $post_id = 0, $word_count = 24 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$text    = get_the_excerpt( $post_id );

	if ( empty( $text ) ) {
		$text = get_post_field( 'post_content', $post_id );
	}

	return wp_trim_words( wp_strip_all_tags( $text ), $word_count );
}
