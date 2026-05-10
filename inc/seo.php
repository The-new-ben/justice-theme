<?php
/**
 * SEO helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Clean archive titles — remove "Archives:" prefix.
 *
 * @param string $title Archive title.
 * @return string
 */
function justice_theme_archive_title( $title ) {
	if ( is_tax( 'practice-areas' ) ) {
		$title = single_term_title( '', false );
	}

	if ( is_post_type_archive( 'articles' ) ) {
		$title = __( 'מאמרים משפטיים', 'justice-theme' );
	}

	return $title;
}
add_filter( 'get_the_archive_title', 'justice_theme_archive_title' );

/**
 * Add semantic body classes.
 *
 * @param array $classes Body classes.
 * @return array
 */
function justice_theme_body_classes( $classes ) {
	if ( is_rtl() ) {
		$classes[] = 'is-rtl';
	}

	if ( is_singular( array( 'post', 'articles' ) ) ) {
		$classes[] = 'is-single-legal-content';
	}

	if ( is_front_page() ) {
		$classes[] = 'is-front-page';
	}

	return $classes;
}
add_filter( 'body_class', 'justice_theme_body_classes' );

/**
 * Include articles in main search queries.
 *
 * @param WP_Query $query Query object.
 */
function justice_theme_include_articles_in_search( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
		$query->set( 'post_type', array( 'post', 'page', 'articles' ) );
	}
}
add_action( 'pre_get_posts', 'justice_theme_include_articles_in_search' );

/**
 * Override document title for SEO.
 *
 * The homepage title MUST contain "עורכי דין" — this is the #1 money keyword.
 * Every competitor (din.co.il, PsakDin, LawReviews) front-loads this term.
 *
 * @param array $title_parts Title parts.
 * @return array
 */
function justice_theme_document_title( $title_parts ) {
	if ( is_front_page() ) {
		$title_parts['title'] = 'עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ';
		$title_parts['tagline'] = '';
	}

	if ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term ) {
			$title_parts['title'] = 'עורך דין ' . $term->name . ' | מדריך, מאמרים ועורכי דין מומחים';
		}
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$city_slug = isset( $_GET['city'] ) ? sanitize_text_field( $_GET['city'] ) : '';
		$area_slug = isset( $_GET['area'] ) ? sanitize_text_field( $_GET['area'] ) : '';
		if ( $city_slug ) {
			$city_t = get_term_by( 'slug', $city_slug, 'city' );
			if ( $area_slug ) {
				$area_t = get_term_by( 'slug', $area_slug, 'practice-areas' );
				$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
			} else {
				$title_parts['title'] = 'עורכי דין ב' . ( $city_t ? $city_t->name : '' ) . ' | מדריך עורכי דין';
			}
		} elseif ( $area_slug ) {
			$area_t = get_term_by( 'slug', $area_slug, 'practice-areas' );
			$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' | מצאו עורך דין מומחה';
		} else {
			$title_parts['title'] = 'מדריך עורכי דין בישראל | Jus-Tice';
		}
		$title_parts['tagline'] = '';
	}

	if ( is_singular( 'justice_lawyer' ) ) {
		$areas = get_the_terms( get_the_ID(), 'practice-areas' );
		$cities = get_the_terms( get_the_ID(), 'city' );
		$suffix = '';
		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			$suffix .= ' | ' . $areas[0]->name;
		}
		if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) {
			$suffix .= ' ב' . $cities[0]->name;
		}
		$title_parts['title'] = get_the_title() . $suffix;
	}

	return $title_parts;
}
add_filter( 'document_title_parts', 'justice_theme_document_title' );

/**
 * Output meta description and OG tags.
 */
function justice_theme_meta_head() {
	if ( is_front_page() ) {
		$desc = 'מחפשים עורך דין? פורטל Jus-Tice — מדריך עורכי דין מומחים בישראל לפי תחום ומיקום. מאמרים משפטיים, מדריכים מקצועיים, ופנייה חכמה לייצוג המשפטי המתאים.';
		echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
		echo '<meta property="og:title" content="עורכי דין בישראל | Jus-Tice — פורטל משפטי">' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( $desc ) . '">' . "\n";
		echo '<meta property="og:type" content="website">' . "\n";
		echo '<meta property="og:url" content="' . esc_url( home_url( '/' ) ) . '">' . "\n";
		echo '<meta property="og:locale" content="he_IL">' . "\n";
		echo '<meta property="og:site_name" content="Jus-Tice">' . "\n";
	} elseif ( is_singular() ) {
		$post_desc = get_the_excerpt();
		if ( $post_desc ) {
			$post_desc = wp_trim_words( $post_desc, 25, '...' );
			echo '<meta name="description" content="' . esc_attr( $post_desc ) . '">' . "\n";
			echo '<meta property="og:title" content="' . esc_attr( get_the_title() ) . ' | Jus-Tice">' . "\n";
			echo '<meta property="og:description" content="' . esc_attr( $post_desc ) . '">' . "\n";
			echo '<meta property="og:type" content="article">' . "\n";
		}
	} elseif ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term ) {
			$tax_desc = 'מצאו עורך דין ' . $term->name . ' — רשימת עורכי דין מומחים, מאמרים מקצועיים ומדריכים בתחום ' . $term->name . ' בישראל.';
			echo '<meta name="description" content="' . esc_attr( $tax_desc ) . '">' . "\n";
		}
	}
}
add_action( 'wp_head', 'justice_theme_meta_head', 1 );

/**
 * Emit a canonical URL on every public page.
 *
 * Skipped if a SEO plugin (Yoast, RankMath, AIOSEO) is already adding one —
 * detected by checking the active filters they typically register.
 */
function justice_theme_canonical_url() {
	if ( is_admin() || is_404() ) {
		return;
	}

	// Defer to popular SEO plugins if they're active — they output their own canonical.
	if (
		defined( 'WPSEO_VERSION' )                              // Yoast
		|| class_exists( 'RankMath' )                           // RankMath
		|| class_exists( 'AIOSEO\\Plugin\\AIOSEO' )             // AIOSEO
		|| function_exists( 'rel_canonical' ) && has_action( 'wp_head', 'rel_canonical' )
	) {
		return;
	}

	$canonical = '';

	if ( is_front_page() ) {
		$canonical = home_url( '/' );
	} elseif ( is_singular() ) {
		$canonical = get_permalink();
	} elseif ( is_post_type_archive() ) {
		$canonical = get_post_type_archive_link( get_query_var( 'post_type' ) );
	} elseif ( is_tax() || is_category() || is_tag() ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			$canonical = get_term_link( $term );
		}
	} elseif ( is_search() ) {
		// Don't index search result URLs — let robots meta handle this.
		return;
	}

	if ( $canonical && ! is_wp_error( $canonical ) ) {
		echo '<link rel="canonical" href="' . esc_url( $canonical ) . '">' . "\n";
	}
}
// Run BEFORE WP core's rel_canonical (which runs at priority 10) so we win
// when neither plugin nor core would emit a usable URL. WP core's
// rel_canonical only fires on is_singular(); we cover archives + taxonomies too.
remove_action( 'wp_head', 'rel_canonical' );
add_action( 'wp_head', 'justice_theme_canonical_url', 9 );

/**
 * Robots meta — noindex search results and paginated lawyer-directory pages
 * with multiple filter combinations to prevent thin-content indexing.
 */
function justice_theme_robots_meta() {
	if ( is_admin() ) {
		return;
	}

	$noindex = false;

	if ( is_search() ) {
		$noindex = true;
	}

	// Don't index lawyer-directory pages with both filters (city + area) — those
	// can multiply into hundreds of thin URLs. Index single-filter pages only.
	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$has_city = ! empty( $_GET['city'] );
		$has_area = ! empty( $_GET['area'] );
		$has_kw   = ! empty( $_GET['keyword'] );
		if ( ( $has_city && $has_area ) || $has_kw ) {
			$noindex = true;
		}
	}

	if ( $noindex ) {
		echo '<meta name="robots" content="noindex,follow">' . "\n";
	}
}
add_action( 'wp_head', 'justice_theme_robots_meta', 1 );


