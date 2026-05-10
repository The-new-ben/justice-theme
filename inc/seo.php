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

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$title = __( 'מדריך עורכי דין בישראל', 'justice-theme' );
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
	if ( is_singular() ) {
		$custom_title = get_post_meta( get_the_ID(), 'seo_title', true );
		if ( $custom_title ) {
			$title_parts['title']   = wp_strip_all_tags( $custom_title );
			$title_parts['tagline'] = '';
		}
	}

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
 * Keep common SEO plugins aligned with repo-published page meta.
 *
 * @param string $title Existing title.
 * @return string
 */
function justice_theme_filter_plugin_seo_title( $title ) {
	if ( is_singular() ) {
		$custom_title = get_post_meta( get_the_ID(), 'seo_title', true );
		if ( $custom_title ) {
			return wp_strip_all_tags( $custom_title );
		}
	}

	return $title;
}
add_filter( 'wpseo_title', 'justice_theme_filter_plugin_seo_title' );
add_filter( 'rank_math/frontend/title', 'justice_theme_filter_plugin_seo_title' );
add_filter( 'aioseo_title', 'justice_theme_filter_plugin_seo_title' );

/**
 * Keep common SEO plugins aligned with repo-published meta descriptions.
 *
 * @param string $description Existing description.
 * @return string
 */
function justice_theme_filter_plugin_seo_description( $description ) {
	if ( is_singular() ) {
		$custom_description = get_post_meta( get_the_ID(), 'seo_description', true );
		if ( $custom_description ) {
			return wp_strip_all_tags( $custom_description );
		}
	}

	return $description;
}
add_filter( 'wpseo_metadesc', 'justice_theme_filter_plugin_seo_description' );
add_filter( 'rank_math/frontend/description', 'justice_theme_filter_plugin_seo_description' );
add_filter( 'aioseo_description', 'justice_theme_filter_plugin_seo_description' );

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
	} elseif ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) ) {
		$directory_desc = 'מדריך עורכי הדין של Jus-Tice מציג פרופילים מאושרים בלבד, לפי תחום משפטי, עיר, ניסיון, שפות ודרכי פנייה. אין דירוג או המלצה ללא בסיס מאומת.';
		echo '<meta name="description" content="' . esc_attr( $directory_desc ) . '">' . "\n";
		echo '<meta property="og:title" content="מדריך עורכי דין בישראל | Jus-Tice">' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( $directory_desc ) . '">' . "\n";
		echo '<meta property="og:type" content="website">' . "\n";
		echo '<meta property="og:url" content="' . esc_url( justice_theme_lawyer_archive_canonical_url() ) . '">' . "\n";
		echo '<meta property="og:locale" content="he_IL">' . "\n";
	} elseif ( is_singular() ) {
		$post_desc = get_post_meta( get_the_ID(), 'seo_description', true );
		if ( ! $post_desc ) {
			$post_desc = get_the_excerpt();
		}
		if ( $post_desc ) {
			$post_desc = wp_trim_words( $post_desc, 25, '...' );
			echo '<meta name="description" content="' . esc_attr( $post_desc ) . '">' . "\n";
			echo '<meta property="og:title" content="' . esc_attr( get_the_title() ) . ' | Jus-Tice">' . "\n";
			echo '<meta property="og:description" content="' . esc_attr( $post_desc ) . '">' . "\n";
			echo '<meta property="og:type" content="article">' . "\n";
			echo '<meta property="og:url" content="' . esc_url( get_permalink() ) . '">' . "\n";
			echo '<meta property="og:locale" content="he_IL">' . "\n";
		}

		$aeo_summary = get_post_meta( get_the_ID(), 'aeo_summary', true );
		$geo_summary = get_post_meta( get_the_ID(), 'geo_summary', true );
		if ( $aeo_summary ) {
			echo '<meta name="justice:aeo-summary" content="' . esc_attr( $aeo_summary ) . '">' . "\n";
		}
		if ( $geo_summary ) {
			echo '<meta name="justice:geo-summary" content="' . esc_attr( $geo_summary ) . '">' . "\n";
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
 * Get the canonical lawyer-directory URL.
 *
 * @return string
 */
function justice_theme_lawyer_archive_canonical_url(): string {
	$archive = get_post_type_archive_link( 'justice_lawyer' );

	return $archive ? $archive : home_url( '/lawyers/' );
}

/**
 * Detect filtered lawyer-directory states even when the live site serves the
 * directory through a page route instead of a pure post-type archive query.
 *
 * @return bool
 */
function justice_theme_is_lawyer_directory_filter_state(): bool {
	$filter_keys = array( 'area', 'city', 'keyword' );
	$has_filter  = (bool) array_intersect( $filter_keys, array_keys( $_GET ) );

	if ( ! $has_filter ) {
		return false;
	}

	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

	return is_post_type_archive( 'justice_lawyer' )
		|| is_page( 'lawyers' )
		|| false !== strpos( $request_uri, '/lawyers/' );
}

/**
 * Output one canonical URL for public templates that WordPress core does not cover well.
 */
function justice_theme_canonical_url() {
	if ( is_admin() || is_404() ) {
		return;
	}

	$canonical = '';

	if ( is_singular() ) {
		return;
	} elseif ( is_front_page() ) {
		$canonical = home_url( '/' );
	} elseif ( justice_theme_is_lawyer_directory_filter_state() ) {
		$canonical = justice_theme_lawyer_archive_canonical_url();
	} elseif ( is_post_type_archive( 'justice_lawyer' ) ) {
		$canonical = justice_theme_lawyer_archive_canonical_url();
	} elseif ( is_post_type_archive( 'articles' ) ) {
		$canonical = get_post_type_archive_link( 'articles' );
	} elseif ( is_tax() || is_category() || is_tag() ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			$canonical = get_term_link( $term );
		}
	} elseif ( is_search() ) {
		$canonical = home_url( '/' );
	}

	if ( $canonical && ! is_wp_error( $canonical ) ) {
		echo '<link rel="canonical" href="' . esc_url( $canonical ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'justice_theme_canonical_url', 5 );

/**
 * Noindex thin search/filter states while preserving link discovery.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function justice_theme_filter_robots( $robots ) {
	if ( is_search() || justice_theme_is_lawyer_directory_filter_state() ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}

	return $robots;
}
add_filter( 'wp_robots', 'justice_theme_filter_robots' );

/**
 * Keep common SEO plugins aligned with the filtered-directory rule.
 *
 * @param string $robots Robots directive string.
 * @return string
 */
function justice_theme_filter_yoast_robots( $robots ) {
	if ( justice_theme_is_lawyer_directory_filter_state() ) {
		return 'noindex, follow';
	}

	return $robots;
}
add_filter( 'wpseo_robots', 'justice_theme_filter_yoast_robots' );

/**
 * Keep Rank Math robots output aligned with the filtered-directory rule.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function justice_theme_filter_rank_math_robots( $robots ) {
	if ( justice_theme_is_lawyer_directory_filter_state() ) {
		unset( $robots['index'] );
		$robots['noindex'] = 'noindex';
		$robots['follow']  = 'follow';
	}

	return $robots;
}
add_filter( 'rank_math/frontend/robots', 'justice_theme_filter_rank_math_robots' );

/**
 * Override SEO-plugin canonical output for filtered lawyer-directory states.
 *
 * @param string $canonical Canonical URL.
 * @return string
 */
function justice_theme_filter_directory_canonical( $canonical ) {
	if ( justice_theme_is_lawyer_directory_filter_state() ) {
		return justice_theme_lawyer_archive_canonical_url();
	}

	return $canonical;
}
add_filter( 'wpseo_canonical', 'justice_theme_filter_directory_canonical' );
add_filter( 'rank_math/frontend/canonical', 'justice_theme_filter_directory_canonical' );
add_filter( 'aioseo_canonical_url', 'justice_theme_filter_directory_canonical' );

/**
 * Fallback robots tag for unknown SEO stacks. This makes filtered directory
 * states visibly noindex even when another plugin does not use WordPress robots.
 */
function justice_theme_filter_directory_robots_meta(): void {
	if ( ! justice_theme_is_lawyer_directory_filter_state() ) {
		return;
	}

	echo '<meta name="robots" content="noindex,follow" data-justice-theme="filtered-directory">' . "\n";
}
add_action( 'wp_head', 'justice_theme_filter_directory_robots_meta', 0 );

/**
 * Provide a temporary branded site icon until a final media-library favicon is set.
 *
 * WordPress outputs the real Site Icon automatically when it exists, so this
 * fallback only covers the current missing-brand state.
 */
function justice_theme_fallback_site_icon(): void {
	if ( has_site_icon() ) {
		return;
	}

	echo '<link rel="icon" href="' . esc_url( JUSTICE_THEME_URI . '/assets/images/favicon.svg' ) . '" type="image/svg+xml">' . "\n";
}
add_action( 'wp_head', 'justice_theme_fallback_site_icon', 2 );
