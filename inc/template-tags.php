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
		_n( '%d min read', '%d min read', $minutes, 'justice-theme' ),
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
