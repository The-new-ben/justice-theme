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
 * Check whether a clean public path already has published WordPress content.
 *
 * Used by homepage/header hub links so planned English pillar URLs do not send
 * visitors to server-level homepage redirects before the page is actually live.
 *
 * @param string $path Public URL path, with or without leading slash.
 * @return bool
 */
function justice_theme_public_path_is_published( string $path ): bool {
	$url_path = (string) wp_parse_url( $path, PHP_URL_PATH );
	$slug     = trim( $url_path, '/' );

	if ( '' === $slug ) {
		return true;
	}

	$post_types = array_values( array_filter( array( 'page', 'articles', 'post' ), 'post_type_exists' ) );
	if ( empty( $post_types ) ) {
		$post_types = array( 'page', 'post' );
	}

	$post = get_page_by_path( $slug, OBJECT, $post_types );

	return $post instanceof WP_Post && 'publish' === get_post_status( $post );
}

/**
 * Return a safe homepage/header URL for a planned pillar.
 *
 * Primary path is used only when a published page/article exists. Otherwise we
 * fall back to an existing hub or filtered directory without changing slugs or
 * creating redirects.
 *
 * @param string $primary_path  Preferred clean pillar path.
 * @param string $fallback_path Working fallback path if the pillar is not live.
 * @return string
 */
function justice_theme_safe_public_link( string $primary_path, string $fallback_path = '' ): string {
	$target_path = justice_theme_public_path_is_published( $primary_path )
		? $primary_path
		: ( $fallback_path ?: $primary_path );

	if ( preg_match( '#^https?://#i', $target_path ) ) {
		return $target_path;
	}

	return home_url( $target_path );
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
 * Keep only digits from a lawyer contact field.
 *
 * @param string $value Raw contact field value.
 * @return string
 */
function justice_theme_lawyer_public_contact_digits( string $value ): string {
	return (string) preg_replace( '/[^0-9]/', '', $value );
}

/**
 * Detect obvious placeholder/demo phone values before they reach public CTAs.
 *
 * @param string $digits Digits-only contact value.
 * @return bool
 */
function justice_theme_lawyer_contact_is_placeholder( string $digits ): bool {
	$digits = justice_theme_lawyer_public_contact_digits( $digits );

	if ( strlen( $digits ) < 9 || strlen( $digits ) > 15 ) {
		return true;
	}

	$national = $digits;
	if ( 0 === strpos( $national, '972' ) ) {
		$national = '0' . substr( $national, 3 );
	}

	$testable = ltrim( $national, '0' );

	if ( preg_match( '/^([0-9])\1{6,}$/', $testable ) ) {
		return true;
	}

	$placeholder_fragments = array(
		'012345',
		'123456',
		'1234567',
		'234567',
		'345678',
		'876543',
		'987654',
		'555123',
		'5551234',
		'545551234',
		'0545551234',
		'0521234567',
		'0500000000',
	);

	foreach ( $placeholder_fragments as $fragment ) {
		if ( false !== strpos( $digits, $fragment ) || false !== strpos( $national, $fragment ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Return a normalized public phone value, or an empty string for unsafe values.
 *
 * @param string $phone Raw phone field value.
 * @return string
 */
function justice_theme_lawyer_public_phone_value( string $phone ): string {
	$digits = justice_theme_lawyer_public_contact_digits( $phone );

	if ( '' === $digits || justice_theme_lawyer_contact_is_placeholder( $digits ) ) {
		return '';
	}

	if ( 0 === strpos( $digits, '972' ) ) {
		return '+' . $digits;
	}

	if ( 0 === strpos( $digits, '0' ) ) {
		return '+972' . substr( $digits, 1 );
	}

	return $digits;
}

/**
 * Return a safe tel: link for a lawyer phone value.
 *
 * @param string $phone Raw phone field value.
 * @return string
 */
function justice_theme_lawyer_public_phone_link( string $phone ): string {
	$value = justice_theme_lawyer_public_phone_value( $phone );

	return $value ? 'tel:' . $value : '';
}

/**
 * Return a safe WhatsApp link for a lawyer contact value.
 *
 * @param string $whatsapp Raw WhatsApp field value.
 * @return string
 */
function justice_theme_lawyer_public_whatsapp_link( string $whatsapp ): string {
	$value = justice_theme_lawyer_public_phone_value( $whatsapp );

	return $value ? 'https://wa.me/' . ltrim( $value, '+' ) : '';
}

/**
 * Return a Hebrew public label for post types shown on visitor-facing cards.
 *
 * This avoids leaking raw plugin labels such as "Article" into Hebrew search
 * results if a legacy plugin copy or cached registration is active.
 *
 * @param string $post_type Post type slug.
 * @return string
 */
function justice_theme_public_post_type_label( string $post_type ): string {
	$labels = array(
		'articles'       => __( 'מאמר משפטי', 'justice-theme' ),
		'post'           => __( 'מאמר', 'justice-theme' ),
		'page'           => __( 'עמוד מידע', 'justice-theme' ),
		'justice_lawyer' => __( 'פרופיל עורך דין', 'justice-theme' ),
		'legal_tool'     => __( 'כלי משפטי', 'justice-theme' ),
	);

	if ( isset( $labels[ $post_type ] ) ) {
		return $labels[ $post_type ];
	}

	$post_type_obj = get_post_type_object( $post_type );
	$label         = $post_type_obj ? (string) $post_type_obj->labels->singular_name : '';

	if ( '' === $label || preg_match( '/^[A-Za-z0-9 _-]+$/', $label ) ) {
		return __( 'תוכן משפטי', 'justice-theme' );
	}

	return $label;
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
