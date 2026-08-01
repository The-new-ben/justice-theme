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
 * Confirm that an admin-only CMS seed/write action has been explicitly enabled.
 *
 * These seeders create WordPress terms, pages, or draft articles. During the
 * audit-first restructure project, opening wp-admin should not create content
 * unless a deployment owner deliberately opts in with the relevant filter.
 *
 * @param string $filter_name Boolean feature filter name.
 * @return bool
 */
function justice_theme_admin_cms_write_enabled( string $filter_name ): bool {
	return is_admin() && current_user_can( 'manage_options' ) && (bool) apply_filters( $filter_name, false );
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
 * Map article taxonomy and cluster signals to the public lead-area vocabulary.
 *
 * @param int          $post_id      Post ID.
 * @param WP_Term|null $primary_term Primary practice-area term.
 * @return string
 */
function justice_theme_get_article_lead_area( $post_id = 0, $primary_term = null ): string {
	$post_id      = $post_id ? absint( $post_id ) : get_the_ID();
	$primary_term = $primary_term instanceof WP_Term ? $primary_term : justice_theme_get_primary_practice_area( $post_id );
	$area_slug    = $primary_term instanceof WP_Term ? sanitize_key( $primary_term->slug ) : '';
	$cluster_slug = sanitize_key( trim( (string) get_post_meta( $post_id, 'content_cluster', true ), '`' ) );
	$post_slug    = sanitize_key( get_post_field( 'post_name', $post_id ) );
	$keyword      = trim( (string) get_post_meta( $post_id, 'primary_keyword', true ), '` ' );

	$accepted = function_exists( 'justice_theme_lead_area_values' ) ? justice_theme_lead_area_values() : array();
	foreach ( array( $area_slug, $cluster_slug ) as $candidate ) {
		if ( $candidate && in_array( $candidate, $accepted, true ) ) {
			return $candidate;
		}
	}

	$aliases = array(
		'family-law' => array(
			'family-law',
			'family-lawyer',
			'divorce',
			'divorce-law',
			'divorce-lawyer',
			'consensual-divorce',
			'divorce-mediation',
			'child-support',
			'child-custody',
			'divorce-property-division',
			'domestic-violence',
			'alimony',
			'custody',
		),
		'criminal-law' => array(
			'criminal',
			'criminal-law',
			'criminal-defense',
			'arrest',
			'indictment',
		),
		'real-estate-law' => array(
			'real-estate',
			'real-estate-law',
			'real-estate-lawyer',
			'apartment',
			'property',
		),
		'medical-malpractice-law' => array(
			'medical-malpractice',
			'medical-malpractice-law',
		),
		'personal-injury-law' => array(
			'personal-injury',
			'personal-injury-law',
			'tort',
			'accident',
		),
		'traffic-law' => array(
			'traffic',
			'traffic-law',
		),
		'labor-law' => array(
			'labor',
			'labor-law',
			'employment',
		),
		'inheritance-law' => array(
			'inheritance',
			'inheritance-law',
			'wills',
			'probate',
		),
		'thailand-law' => array(
			'thailand',
			'thailand-law',
		),
	);

	foreach ( array_filter( array( $area_slug, $cluster_slug, $post_slug ) ) as $source_slug ) {
		foreach ( $aliases as $lead_area => $source_aliases ) {
			if ( in_array( $source_slug, $source_aliases, true ) && in_array( $lead_area, $accepted, true ) ) {
				return $lead_area;
			}
		}
	}

	$keyword_checks = array(
		'family-law'              => array( 'גירוש', 'משפחה', 'מזונות', 'משמורת', 'הסדרי שהות' ),
		'criminal-law'            => array( 'פלילי', 'מעצר', 'כתב אישום', 'חקירה' ),
		'real-estate-law'         => array( 'מקרקעין', 'נדל', 'דירה', 'טאבו' ),
		'medical-malpractice-law' => array( 'רשלנות רפואית' ),
		'personal-injury-law'     => array( 'נזיקין', 'תאונה', 'פיצויים' ),
		'traffic-law'             => array( 'תעבורה', 'נהיגה' ),
		'labor-law'               => array( 'דיני עבודה', 'פיטורים', 'שכר' ),
		'inheritance-law'         => array( 'ירושה', 'צוואה', 'צוואות' ),
		'thailand-law'            => array( 'תאילנד' ),
	);

	foreach ( $keyword_checks as $lead_area => $needles ) {
		if ( ! in_array( $lead_area, $accepted, true ) ) {
			continue;
		}
		foreach ( $needles as $needle ) {
			$keyword_position = function_exists( 'mb_strpos' ) ? mb_strpos( $keyword, $needle ) : strpos( $keyword, $needle );
			if ( '' !== $keyword && false !== $keyword_position ) {
				return $lead_area;
			}
		}
	}

	return '';
}

/**
 * Build a contextual, post-content lead CTA for article templates.
 *
 * @param int          $post_id      Post ID.
 * @param WP_Term|null $primary_term Primary practice-area term.
 * @return array{url:string,title:string,text:string,button:string,lead_area:string,area_label:string}
 */
function justice_theme_get_contextual_article_lead_cta( $post_id = 0, $primary_term = null ): array {
	$post_id      = $post_id ? absint( $post_id ) : get_the_ID();
	$primary_term = $primary_term instanceof WP_Term ? $primary_term : justice_theme_get_primary_practice_area( $post_id );
	$area_label   = $primary_term instanceof WP_Term ? $primary_term->name : '';
	$area_slug    = $primary_term instanceof WP_Term ? sanitize_key( $primary_term->slug ) : '';
	$lead_area    = justice_theme_get_article_lead_area( $post_id, $primary_term );
	$lead_message = sprintf(
		/* translators: %s: article title. */
		__( 'קראתי את המאמר "%s" ואני רוצה לבדוק האם המקרה שלי מתאים לפנייה לעורך דין.', 'justice-theme' ),
		get_the_title( $post_id )
	);
	$url          = function_exists( 'justice_theme_ask_lawyer_fallback_url' )
		? justice_theme_ask_lawyer_fallback_url(
			array(
				'lead_area'      => $lead_area,
				'lead_message'   => $lead_message,
				'utm_source'     => 'article_contextual_cta',
				'utm_medium'     => is_singular( 'articles' ) ? 'single_articles' : 'single_post',
				'utm_campaign'   => 'content_to_lead',
				'utm_term'       => $area_slug,
				'source_keyword' => get_post_field( 'post_name', $post_id ),
			)
		)
		: home_url( '/#ask-lawyer' );

	return array(
		'url'        => $url,
		'title'      => $area_label
			? sprintf(
				/* translators: %s: legal practice area. */
				__( 'צריכים בדיקה אישית בתחום %s?', 'justice-theme' ),
				$area_label
			)
			: __( 'צריכים בדיקה אישית אחרי הקריאה?', 'justice-theme' ),
		'text'       => $area_label
			? sprintf(
				/* translators: %s: legal practice area. */
				__( 'אם אחרי הקריאה נשארה שאלה בתחום %s, אפשר להשאיר פנייה קצרה עם התחום, העיר והדחיפות. אין בכך ייעוץ משפטי, אלא פתיחה מסודרת של בדיקת התאמה.', 'justice-theme' ),
				$area_label
			)
			: __( 'אם אחרי הקריאה נשארה שאלה, אפשר להשאיר פנייה קצרה עם התחום, העיר והדחיפות. אין בכך ייעוץ משפטי, אלא פתיחה מסודרת של בדיקת התאמה.', 'justice-theme' ),
		'button'     => __( 'שליחת פנייה עם הקשר מהמאמר', 'justice-theme' ),
		'lead_area'  => $lead_area,
		'area_label' => $area_label,
	);
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

	$post_types = array_values( array_filter( array( 'page', 'articles', 'post', 'justice_legal_tool' ), 'post_type_exists' ) );
	if ( empty( $post_types ) ) {
		$post_types = array( 'page', 'post' );
	}

	$post = get_page_by_path( $slug, OBJECT, $post_types );

	if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
		return true;
	}

	if ( post_type_exists( 'justice_legal_tool' ) ) {
		if ( 0 === strpos( $slug, 'legal-tools/' ) ) {
			$tool_slug = trim( substr( $slug, strlen( 'legal-tools/' ) ), '/' );
			$tool      = $tool_slug ? get_page_by_path( $tool_slug, OBJECT, 'justice_legal_tool' ) : null;

			return $tool instanceof WP_Post && 'publish' === get_post_status( $tool );
		}
	}

	return false;
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
 * Normalize a URL before rendering it in public templates.
 *
 * This is display-only; it does not change stored URLs, redirects or slugs.
 *
 * @param string $url Raw public URL.
 * @return string
 */
function justice_theme_public_url( ?string $url ): string {
	if ( null === $url ) {
		return '';
	}
	if ( function_exists( 'justice_theme_normalize_public_url' ) ) {
		return justice_theme_normalize_public_url( $url );
	}

	return $url;
}

/**
 * Return a public permalink with first-party HTTPS normalization applied.
 *
 * @param int $post_id Optional post ID. Defaults to the current loop post.
 * @return string
 */
function justice_theme_public_permalink( int $post_id = 0 ): string {
	$post_id = $post_id ?: (int) get_the_ID();

	if ( $post_id <= 0 ) {
		return '';
	}

	return justice_theme_public_url( (string) get_permalink( $post_id ) );
}

/**
 * Return a preferred public URL for older duplicate practice terms.
 *
 * This is display-only link hygiene. It does not edit terms, redirects,
 * canonicals, or stored CMS content.
 *
 * @param WP_Term $term Term object.
 * @return string
 */
function justice_theme_preferred_practice_term_url( WP_Term $term ): string {
	if ( 'practice-areas' !== $term->taxonomy ) {
		return '';
	}

	$preferred_paths = array(
		'real-estate'       => '/practice-areas/real-estate-law/',
		'personal-injury'   => '/tort-lawyer/',
		'tort-law'          => '/tort-lawyer/',
		'israeli-labor-law' => '/practice-areas/labor-law/',
	);

	if ( ! isset( $preferred_paths[ $term->slug ] ) ) {
		return '';
	}

	return home_url( $preferred_paths[ $term->slug ] );
}

/**
 * Return the current public request URL without query parameters.
 *
 * Useful for virtual theme routes that do not have a WordPress post ID.
 *
 * @return string
 */
function justice_theme_current_public_url(): string {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
	$path        = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
	$path        = '/' . ltrim( $path ?: '/', '/' );

	return justice_theme_public_url( home_url( $path ) );
}

/**
 * Return a public taxonomy term link with first-party HTTPS normalization.
 *
 * @param WP_Term|int|string $term Term object, ID, or slug accepted by get_term_link().
 * @return string
 */
function justice_theme_public_term_link( $term ): string {
	if ( $term instanceof WP_Term ) {
		$preferred_url = justice_theme_preferred_practice_term_url( $term );
		if ( '' !== $preferred_url ) {
			return justice_theme_public_url( $preferred_url );
		}
	}

	$term_link = get_term_link( $term );

	if ( is_wp_error( $term_link ) ) {
		return '';
	}

	return justice_theme_public_url( (string) $term_link );
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
	if (
		$lawyer instanceof WP_Post
		&& 'publish' === get_post_status( $lawyer )
		&& function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		&& justice_theme_lawyer_profile_is_public_approved( (int) $lawyer->ID )
	) {
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
		if (
			$lawyer instanceof WP_Post
			&& 'publish' === get_post_status( $lawyer )
			&& function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& justice_theme_lawyer_profile_is_public_approved( (int) $lawyer->ID )
		) {
			return $lawyer;
		}
	}

	$candidates = get_posts(
		array(
			'post_type'                     => 'justice_lawyer',
			'post_status'                   => 'publish',
			's'                             => rawurldecode( '%D7%9E%D7%90%D7%99%D7%94%20%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ),
			'posts_per_page'                => 5,
			'no_found_rows'                 => true,
			'suppress_filters'              => false,
			'justice_public_lawyer_listing' => true,
		)
	);

	foreach ( $candidates as $candidate ) {
		if (
			! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			|| ! justice_theme_lawyer_profile_is_public_approved( (int) $candidate->ID )
		) {
			continue;
		}

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

	$admin_visibility = strtolower( (string) get_post_meta( $post_id, 'admin_profile_visibility', true ) );
	if ( in_array( $admin_visibility, array( 'hide', 'hidden' ), true ) ) {
		return false;
	}
	if ( in_array( $admin_visibility, array( 'show', 'visible' ), true ) ) {
		return true;
	}

	$slug  = (string) get_post_field( 'post_name', $post_id );
	$title = get_the_title( $post_id );
	$is_maya_identity = 'advocate-maya-rotenberg' === $slug
		|| (
			false !== mb_strpos( $title, rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
			&& false !== mb_strpos( $title, rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
		);

	if ( $is_maya_identity ) {
		$maya_source_type    = strtolower( (string) get_post_meta( $post_id, 'source_type', true ) );
		$maya_source_url     = strtolower( (string) get_post_meta( $post_id, 'source_url', true ) );
		$maya_profile_status = strtolower( (string) get_post_meta( $post_id, 'profile_status', true ) );
		$maya_verification   = strtolower( (string) get_post_meta( $post_id, 'verification_status', true ) );
		$maya_subscription   = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );
		$maya_notes          = strtolower( (string) get_post_meta( $post_id, 'internal_notes', true ) );
		$maya_seed_haystack  = implode( ' ', array( $maya_source_type, $maya_source_url, $maya_profile_status, $maya_notes ) );
		$maya_is_seed_like   = false !== strpos( $maya_seed_haystack, 'seed' )
			|| false !== strpos( $maya_seed_haystack, 'demo' )
			|| false !== strpos( $maya_seed_haystack, 'test data' )
			|| false !== strpos( $maya_seed_haystack, 'testing only' )
			|| false !== strpos( $maya_seed_haystack, 'not real' )
			|| false !== strpos( $maya_seed_haystack, 'fictional' )
			|| false !== strpos( $maya_seed_haystack, 'fake' );
		$maya_has_approval_signal = in_array( $maya_profile_status, array( 'approved', 'active', 'verified' ), true )
			|| 'active' === $maya_subscription
			|| ( 'verified' === $maya_verification && '' !== $maya_source_type && 'seed' !== $maya_source_type );

		if (
			$maya_is_seed_like
			|| (
				! $maya_has_approval_signal
				&& ! (bool) apply_filters( 'justice_theme_allow_maya_name_public_profile_fallback', false, $post_id )
			)
		) {
			return false;
		}

		return true;
	}

	if (
		'advocate-maya-rotenberg' === $slug
		|| (
			false !== mb_strpos( $title, 'מאיה' )
			&& false !== mb_strpos( $title, 'רוטנברג' )
		)
	) {
		return false;
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
 * Check if a lawyer has a real active paid plan.
 *
 * @param int $post_id Lawyer post ID.
 * @return bool
 */
function justice_theme_lawyer_paid_plan_is_active( int $post_id ): bool {
	$plan         = strtolower( (string) get_post_meta( $post_id, 'plan_type', true ) );
	$subscription = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );

	return 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
}

/**
 * Return the controlled sponsored-placement status without implying payment.
 *
 * @param int $post_id Lawyer post ID.
 * @return string
 */
function justice_theme_lawyer_sponsored_placement_status( int $post_id ): string {
	$status = sanitize_key( (string) get_post_meta( $post_id, 'sponsored_placement_status', true ) );

	return in_array( $status, array( 'reserved', 'active', 'paused', 'hold' ), true ) ? $status : 'none';
}

/**
 * Check if the public profile should carry a sponsored badge.
 *
 * @param int $post_id Lawyer post ID.
 * @return bool
 */
function justice_theme_lawyer_has_public_sponsored_placement( int $post_id ): bool {
	return justice_theme_lawyer_paid_plan_is_active( $post_id )
		|| 'active' === justice_theme_lawyer_sponsored_placement_status( $post_id );
}

/**
 * Score a public lawyer card for sponsored/featured directory ordering.
 *
 * Reserved placement changes ordering only; it does not imply payment.
 *
 * @param int $post_id Lawyer post ID.
 * @return int
 */
function justice_theme_lawyer_profile_sort_score( int $post_id ): int {
	$verified       = strtolower( (string) get_post_meta( $post_id, 'verification_status', true ) );
	$priority       = (int) get_post_meta( $post_id, 'priority_score', true );
	$sponsor_status = justice_theme_lawyer_sponsored_placement_status( $post_id );

	if ( justice_theme_lawyer_paid_plan_is_active( $post_id ) ) {
		$priority += 1000;
	} elseif ( 'active' === $sponsor_status ) {
		$priority += 800;
	} elseif ( 'reserved' === $sponsor_status ) {
		$priority += 250;
	}

	if ( 'verified' === $verified ) {
		$priority += 100;
	}

	return $priority;
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
 * Return the site WhatsApp intake URL with an optional public prefilled message.
 *
 * @param string $message Optional Hebrew intake message.
 * @return string
 */
function justice_theme_public_whatsapp_url( string $message = '' ): string {
	$whatsapp = function_exists( 'justice_theme_option' ) ? justice_theme_option( 'justice_whatsapp', '0525101555' ) : '0525101555';
	$digits   = preg_replace( '/\D+/', '', (string) $whatsapp );

	if ( '' === $digits ) {
		return '';
	}

	if ( 0 === strpos( $digits, '0' ) ) {
		$digits = '972' . substr( $digits, 1 );
	}

	$url = 'https://wa.me/' . $digits;

	if ( '' !== trim( $message ) ) {
		$url = add_query_arg( 'text', $message, $url );
	}

	return $url;
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
