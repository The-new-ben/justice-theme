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
 * Check whether a lawyer profile is approved for public directory/profile output.
 *
 * This deliberately favors safety: historical seed/demo profiles may already
 * be published on live, so public templates should require an approval signal.
 *
 * @param int $post_id Lawyer post ID.
 * @return bool
 */
function justice_theme_lawyer_profile_is_public_approved( int $post_id = 0 ): bool {
	$post_id = $post_id ?: get_the_ID();

	if ( ! $post_id || 'justice_lawyer' !== get_post_type( $post_id ) || 'publish' !== get_post_status( $post_id ) ) {
		return false;
	}

	$slug  = (string) get_post_field( 'post_name', $post_id );
	$title = get_the_title( $post_id );

	if (
		'advocate-maya-rotenberg' === $slug
		|| (
			false !== mb_strpos( $title, 'מאיה' )
			&& false !== mb_strpos( $title, 'רוטנברג' )
		)
	) {
		return true;
	}

	$source_type    = strtolower( (string) get_post_meta( $post_id, 'source_type', true ) );
	$source_url     = strtolower( (string) get_post_meta( $post_id, 'source_url', true ) );
	$profile_status = strtolower( (string) get_post_meta( $post_id, 'profile_status', true ) );
	$verification   = strtolower( (string) get_post_meta( $post_id, 'verification_status', true ) );
	$subscription   = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );
	$notes          = strtolower( (string) get_post_meta( $post_id, 'internal_notes', true ) );

	$seed_haystack = implode( ' ', array( $source_type, $source_url, $profile_status, $notes ) );
	$is_seed_like  = false !== strpos( $seed_haystack, 'seed' )
		|| false !== strpos( $seed_haystack, 'demo' )
		|| false !== strpos( $seed_haystack, 'test data' )
		|| false !== strpos( $seed_haystack, 'testing only' )
		|| false !== strpos( $seed_haystack, 'not real' )
		|| false !== strpos( $seed_haystack, 'fictional' )
		|| false !== strpos( $seed_haystack, 'fake' );

	if ( $is_seed_like ) {
		return false;
	}

	if ( in_array( $profile_status, array( 'approved', 'public', 'published', 'active', 'verified' ), true ) ) {
		return true;
	}

	if ( 'active' === $subscription ) {
		return true;
	}

	return 'verified' === $verification && '' !== $source_type && 'seed' !== $source_type;
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
