<?php
/**
 * SEO helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Rank Math has been replaced by Yoast SEO as of May 2026.
 * The Rank Math noindex-header filter has been removed.
 * Yoast sitemaps are active at /sitemap_index.xml.
 * A custom REST API sitemap also exists at /wp-json/justice/v1/sitemap
 * (backup, not referenced by robots.txt).
 */

/**
 * Homepage safety guard: NEVER let the front page serve noindex.
 *
 * The expert SEO audit (May 2026) discovered that the SeoEdge CDN was
 * intermittently caching a "Page not found" + noindex variant of the homepage.
 * This guard intercepts the final robots meta and forces index,follow on the
 * front page, preventing any accidental noindex from Yoast, routing guards,
 * or stale cache payloads.
 *
 * @since 1.0.8  Emergency SEO rescue.
 */
function justice_theme_homepage_force_index( $robots ) {
	if ( is_front_page() || is_home() ) {
		$robots['index']  = 'index';
		$robots['follow'] = 'follow';
		// Remove any noindex that may have been set.
		unset( $robots['noindex'] );
	}
	return $robots;
}
add_filter( 'wp_robots', 'justice_theme_homepage_force_index', 99999 );

/**
 * Yoast-specific: force index on the front page via Yoast's robots filter.
 *
 * @param array $robots Yoast robots array.
 * @return array
 */
function justice_theme_yoast_homepage_force_index( $robots ) {
	if ( is_front_page() || is_home() ) {
		$robots['index']  = 'index';
		$robots['follow'] = 'follow';
		unset( $robots['noindex'] );
	}
	return $robots;
}
add_filter( 'wpseo_robots_array', 'justice_theme_yoast_homepage_force_index', 99999 );


/**
 * Fix category_base collision with practice-areas taxonomy.
 *
 * Someone set the WordPress category_base to "practice-areas" in
 * Settings → Permalinks, which makes /practice-areas/criminal-law/
 * resolve to the WP "category" taxonomy instead of our custom
 * "practice-areas" taxonomy. This resets the base to "category".
 */
function justice_theme_fix_category_base_collision(): void {
	$current = get_option( 'category_base', '' );

	if ( 'practice-areas' === $current ) {
		update_option( 'category_base', 'category' );
		flush_rewrite_rules( false );
	}
}
add_action( 'init', 'justice_theme_fix_category_base_collision', 5 );

/**
 * REST endpoint to trigger the category_base fix manually.
 *
 * Usage: POST /wp-json/justice/v1/fix-category-base (with admin auth)
 */
function justice_theme_register_fix_category_base_endpoint(): void {
	register_rest_route( 'justice/v1', '/fix-category-base', array(
		'methods'             => 'POST',
		'callback'            => function () {
			$old = get_option( 'category_base', '' );
			update_option( 'category_base', 'category' );
			flush_rewrite_rules( false );
			$new = get_option( 'category_base', '' );

			return new WP_REST_Response( array(
				'old_value' => $old,
				'new_value' => $new,
				'flushed'   => true,
			), 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
}
add_action( 'rest_api_init', 'justice_theme_register_fix_category_base_endpoint' );

/**
 * One-time Yoast SEO configuration seeder.
 *
 * Seeds `wpseo_titles` and `wpseo` options with best-practice defaults for
 * a Hebrew legal portal:
 *   - Meta description templates for articles, practice-areas, category, city
 *   - Title templates following "Term - Brand" pattern
 *   - Noindex for thin/tag archives
 *   - Disable author/date archives (single-brand portal)
 *   - Enable media redirect to parent post
 *
 * Runs once on admin_init (idempotent — checks a flag before writing).
 * Re-run by deleting the `justice_yoast_seeded` option.
 *
 * Research basis:
 *   - Yoast SEO docs: snippet variables, taxonomy archive settings
 *   - SEO expert consensus: unique descriptions > templates, but templates
 *     are better than nothing for 1200+ articles
 *   - Hebrew/RTL legal site: E-E-A-T, local SEO, practice-area hub structure
 *   - wpseo_titles option structure: metadesc-{cpt}, title-tax-{taxonomy}, etc.
 */
function justice_theme_seed_yoast_configuration(): void {
	if ( ! is_admin() || get_option( 'justice_yoast_seeded' ) === 'v4-2026-05-15' ) {
		return;
	}

	// --- wpseo_titles: templates for titles, meta descriptions, indexation ---
	$titles = get_option( 'wpseo_titles', array() );
	if ( ! is_array( $titles ) ) {
		$titles = array();
	}

	$updates = array(
		// Articles CPT: title and meta description templates.
		'title-articles'                => '%%title%% %%page%% %%sep%% %%sitename%%',
		'metadesc-articles'             => '%%title%% - %%excerpt%%',
		'title-ptarchive-articles'      => 'מאמרים משפטיים %%page%% %%sep%% %%sitename%%',
		'metadesc-ptarchive-articles'   => 'מאמרים ומדריכים משפטיים בכל תחומי המשפט. מידע כללי על זכויות, הליכים משפטיים ותחומי ייצוג בישראל.',

		// Justice Lawyer CPT.
		'title-justice_lawyer'          => '%%title%% %%sep%% %%sitename%%',
		'metadesc-justice_lawyer'       => '%%title%% - פרופיל עורך דין. תחומי התמחות, אזורי פעילות ופרטי קשר.',
		'title-ptarchive-justice_lawyer' => 'מאגר עורכי דין %%page%% %%sep%% %%sitename%%',
		'metadesc-ptarchive-justice_lawyer' => 'חפשו עורכי דין לפי תחום התמחות ואזור. מאגר עורכי דין מקצועי בישראל.',

		// Practice-areas taxonomy (main hub pages).
		'title-tax-practice-areas'      => '%%term_title%% %%page%% %%sep%% %%sitename%%',
		'metadesc-tax-practice-areas'   => '%%term_title%% - מדריכים, מאמרים ועורכי דין מומחים. מידע כללי על זכויות והליכים משפטיים בישראל.',
		'noindex-tax-practice-areas'    => false,

		// City taxonomy.
		'title-tax-city'                => 'עורכי דין ב%%term_title%% %%page%% %%sep%% %%sitename%%',
		'metadesc-tax-city'             => 'מצאו עורכי דין ב%%term_title%%. רשימת עורכי דין לפי תחומי התמחות באזור %%term_title%%.',
		'noindex-tax-city'              => false,

		// WordPress category (legacy, keep indexed for now).
		'title-tax-category'            => '%%term_title%% %%page%% %%sep%% %%sitename%%',
		'metadesc-tax-category'         => '%%term_title%% - מאמרים ומדריכים משפטיים. מידע כללי ועדכני בתחום.',

		// Tags: noindex (thin content risk).
		'noindex-tax-post_tag'          => true,

		// Posts (standard WP posts, if any).
		'title-post'                    => '%%title%% %%page%% %%sep%% %%sitename%%',
		'metadesc-post'                 => '%%title%% - %%excerpt%%',

		// Pages.
		'title-page'                    => '%%title%% %%page%% %%sep%% %%sitename%%',

		// Author archives: disabled (portal brand, not individual authors).
		'disable-author'                => true,
		'noindex-author-wpseo'          => true,

		// Date archives: noindex (thin, duplicate content).
		'noindex-archive-wpseo'         => true,

		// Media/attachment pages: redirect to parent.
		'disable-attachment'            => true,

		// Homepage (front page) — matching din.co.il keyword pattern + keyword stuffing.
		'title-home-wpseo'              => 'אינדקס עורכי דין בישראל | מאמרים משפטיים, מדריכים וייעוץ משפטי - Jus-Tice',
		'metadesc-home-wpseo'           => 'פורטל המשפט המוביל בישראל. אינדקס עורכי דין מקיף לפי תחום ומיקום, מאמרים משפטיים, מדריכים מקצועיים. עורך דין גירושין, עורך דין פלילי, עורך דין נדל\"ן, נזיקין, עבודה, ירושה ועוד — חיפוש חינם.',
	);

	foreach ( $updates as $key => $value ) {
		$titles[ $key ] = $value;
	}

	update_option( 'wpseo_titles', $titles );

	// --- wpseo: general settings ---
	$wpseo = get_option( 'wpseo', array() );
	if ( ! is_array( $wpseo ) ) {
		$wpseo = array();
	}

	// Separator: vertical pipe for clean Hebrew titles.
	$wpseo['separator'] = 'sc-pipe';

	// Enable breadcrumbs (Yoast breadcrumbs, theme may override display).
	$wpseo['breadcrumbs-enable'] = true;
	$wpseo['breadcrumbs-home']   = 'עמוד הבית';

	update_option( 'wpseo', $wpseo );

	// Mark as seeded to prevent re-running.
	update_option( 'justice_yoast_seeded', 'v4-2026-05-15', true );
}
add_action( 'admin_init', 'justice_theme_seed_yoast_configuration' );

/**
 * REST endpoint to trigger Yoast configuration seeding.
 *
 * POST /wp-json/justice/v1/seed-yoast-config
 * Allows remote trigger without visiting wp-admin.
 */
function justice_theme_register_seed_yoast_endpoint(): void {
	register_rest_route( 'justice/v1', '/seed-yoast-config', array(
		'methods'             => 'POST',
		'callback'            => function () {
			delete_option( 'justice_yoast_seeded' );
			justice_theme_seed_yoast_configuration();
			$titles = get_option( 'wpseo_titles', array() );
			return new WP_REST_Response( array(
				'seeded'               => true,
				'metadesc-articles'    => $titles['metadesc-articles'] ?? '(not set)',
				'metadesc-tax-practice-areas' => $titles['metadesc-tax-practice-areas'] ?? '(not set)',
				'metadesc-justice_lawyer' => $titles['metadesc-justice_lawyer'] ?? '(not set)',
			), 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
}
add_action( 'rest_api_init', 'justice_theme_register_seed_yoast_endpoint' );

/**
 * Clean up wp_head output: remove duplicate theme-color, generator, emoji, etc.
 *
 * BUG-01 from homepage audit: 3 separate theme-color meta tags from theme,
 * WP core, and PWA plugin. This removes the WP core and PWA versions,
 * keeping only the theme's #07152f from header.php.
 *
 * @since 1.0.5
 */
function justice_theme_cleanup_head(): void {
	// Remove WP generator tag (security + cleaner HTML).
	remove_action( 'wp_head', 'wp_generator' );

	// Remove emoji detection scripts and styles (saves ~10KB).
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );

	// Remove WP's theme-color output (we output our own in header.php).
	remove_action( 'wp_head', 'wp_theme_color_meta', 1 );

	// Remove oEmbed discovery links (not needed for legal portal).
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

	// Remove REST API discovery link (available but no need to advertise).
	remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );

	// Remove Windows Live Writer manifest.
	remove_action( 'wp_head', 'wlwmanifest_link' );

	// Remove RSD (Really Simple Discovery) link.
	remove_action( 'wp_head', 'rsd_link' );

	// Remove shortlink.
	remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );
}
add_action( 'after_setup_theme', 'justice_theme_cleanup_head' );


/**
 * Normalize first-party public URLs for SEO tags.
 *
 * The live site has historical HTTP URL leakage in taxonomy/canonical/sitemap
 * surfaces. This does not perform redirects or migrations; it only keeps
 * theme-emitted canonical, hreflang and OG URLs on the public HTTPS origin.
 *
 * @param string $url Raw URL.
 * @return string
 */
function justice_theme_normalize_public_url( string $url ): string {
	$url = trim( $url );

	if ( '' === $url ) {
		return '';
	}

	$site_host = wp_parse_url( (string) get_option( 'home' ), PHP_URL_HOST );
	if ( ! $site_host ) {
		$site_host = wp_parse_url( (string) get_option( 'siteurl' ), PHP_URL_HOST );
	}

	$url_host  = wp_parse_url( $url, PHP_URL_HOST );

	if ( $site_host && $url_host && strtolower( $site_host ) === strtolower( $url_host ) ) {
		return set_url_scheme( $url, 'https' );
	}

	return $url;
}

/**
 * Global root-cause fix: force HTTPS on all home_url() output.
 *
 * The `home` option in wp_options is `http://jus-tice.co.il` and cannot be
 * changed via REST API (locked by hosting/wp-config). This filter catches
 * ALL WordPress core functions that use home_url() — get_term_link(),
 * get_permalink(), get_post_type_archive_link(), etc. — and forces HTTPS.
 *
 * Without this, every term link, archive link, and permalink that WordPress
 * generates will be HTTP, requiring individual wrappers in every template.
 *
 * @since 1.0.5
 */
function justice_theme_force_https_home_url( ?string $url, ?string $path, $scheme, ?int $blog_id ): string {
	if ( null === $url ) {
		return '';
	}
	if ( null === $scheme && 0 === strpos( $url, 'http://' ) ) {
		return set_url_scheme( $url, 'https' );
	}
	return $url;
}
add_filter( 'home_url', 'justice_theme_force_https_home_url', 1, 4 );

/**
 * Normalize first-party URL values generated for public-facing frontend output.
 *
 * Admin screens are left alone so wp-admin/plugin configuration remains visible
 * exactly as stored. Public pages, REST responses and sitemap requests get the
 * HTTPS form of first-party URLs without changing database values or redirects.
 *
 * @param string $url Existing URL.
 * @return string
 */
function justice_theme_filter_frontend_public_url( $url ): string {
	if ( is_admin() && ! wp_doing_ajax() ) {
		return (string) $url;
	}

	return justice_theme_normalize_public_url( (string) $url );
}
add_filter( 'home_url', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'page_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'post_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'post_type_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'term_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'attachment_link', 'justice_theme_filter_frontend_public_url', 20 );
add_filter( 'wp_get_attachment_url', 'justice_theme_filter_frontend_public_url', 20 );

/**
 * Normalize first-party attachment image arrays without changing media records.
 *
 * @param array|false $image Image tuple from wp_get_attachment_image_src().
 * @return array|false
 */
function justice_theme_filter_attachment_image_src( $image ) {
	if ( is_array( $image ) && ! empty( $image[0] ) ) {
		$image[0] = justice_theme_normalize_public_url( (string) $image[0] );
	}

	return $image;
}
add_filter( 'wp_get_attachment_image_src', 'justice_theme_filter_attachment_image_src', 20 );

/**
 * Normalize first-party srcset URLs in rendered media markup.
 *
 * @param array $sources Image source candidates.
 * @return array
 */
function justice_theme_filter_image_srcset_sources( ?array $sources ): array {
	if ( null === $sources ) {
		return [];
	}
	foreach ( $sources as $width => $source ) {
		if ( is_array( $source ) && ! empty( $source['url'] ) ) {
			$sources[ $width ]['url'] = justice_theme_normalize_public_url( (string) $source['url'] );
		}
	}

	return $sources;
}
add_filter( 'wp_calculate_image_srcset', 'justice_theme_filter_image_srcset_sources', 20 );

/**
 * Normalize first-party HTTP URLs in public post content at render time.
 *
 * This intentionally leaves the database untouched. It only prevents old
 * embedded media/content URLs from being emitted as HTTP in public HTML.
 *
 * @param string $content Rendered post content.
 * @return string
 */
function justice_theme_normalize_public_content_urls( ?string $content ): string {
	if ( null === $content ) {
		return '';
	}
	if ( is_admin() && ! wp_doing_ajax() ) {
		return $content;
	}

	$site_host = wp_parse_url( (string) get_option( 'home' ), PHP_URL_HOST );
	if ( ! $site_host ) {
		$site_host = wp_parse_url( (string) get_option( 'siteurl' ), PHP_URL_HOST );
	}

	if ( '' === $content || ! $site_host ) {
		return $content;
	}

	$http_origin = 'http://' . $site_host;

	if ( false === strpos( $content, $http_origin ) ) {
		return $content;
	}

	return str_replace( $http_origin, 'https://' . $site_host, $content );
}
add_filter( 'the_content', 'justice_theme_normalize_public_content_urls', 999 );

/**
 * Map public lawyer-directory area aliases to the taxonomy slugs that exist now.
 *
 * The public URL strategy uses clean English aliases such as
 * /lawyers/?area=personal-injury-law, while the legacy taxonomy still contains
 * terms such as "torts". Keep titles aligned with the rendered directory H1
 * without changing URLs, terms, redirects or stored content.
 *
 * @param string $area_slug Raw public area filter.
 * @return string
 */
function justice_theme_lawyer_directory_area_taxonomy_slug( string $area_slug ): string {
	$area_slug = sanitize_title( str_replace( '_', '-', trim( strtolower( $area_slug ) ) ) );

	if ( '' === $area_slug ) {
		return '';
	}

	$alias_map = array(
		'family'                  => 'family-law',
		'criminal'                => 'criminal-law',
		'real-estate'             => 'real-estate-law',
		'labor'                   => 'labor-law',
		'employment'              => 'labor-law',
		'employment-law'          => 'labor-law',
		'traffic'                 => 'traffic-law',
		'tort'                    => 'torts',
		'torts'                   => 'torts',
		'personal-injury'         => 'torts',
		'personal-injury-law'     => 'torts',
		'medical'                 => 'medical-malpractice',
		'medical-malpractice'     => 'medical-malpractice',
		'medical-malpractice-law' => 'medical-malpractice',
		'inheritance'             => 'inheritance-law',
		'cyber'                   => 'cyber-law',
		'privacy'                 => 'cyber-law',
		'cyber-law'               => 'cyber-law',
		'cyber-privacy'           => 'cyber-law',
		'privacy-cyber'           => 'cyber-law',
		'privacy-cyber-law'       => 'cyber-law',
		'tax'                     => 'tax-law',
	);

	return $alias_map[ $area_slug ] ?? $area_slug;
}

/**
 * Resolve a lawyer-directory area filter to a practice-area term.
 *
 * @param string $area_slug Raw public area filter.
 * @return WP_Term|false
 */
function justice_theme_lawyer_directory_area_term( string $area_slug ) {
	$taxonomy_slug = justice_theme_lawyer_directory_area_taxonomy_slug( $area_slug );

	if ( '' === $taxonomy_slug ) {
		return false;
	}

	return get_term_by( 'slug', $taxonomy_slug, 'practice-areas' );
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
		$title = __( 'חיפוש עורך דין לפי שם, תחום ועיר', 'justice-theme' );
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
 * Include articles CPT in practice-areas taxonomy archives.
 *
 * WordPress default taxonomy archives only query 'post' type. Our legal
 * content lives in the 'articles' CPT, so we must add it here or the
 * taxonomy-practice-areas.php template shows "no results".
 *
 * @param WP_Query $query Query object.
 */
function justice_theme_include_articles_in_practice_area_archive( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( $query->is_tax( 'practice-areas' ) ) {
		$query->set( 'post_type', array( 'post', 'articles' ) );
	}
}
add_action( 'pre_get_posts', 'justice_theme_include_articles_in_practice_area_archive' );

/**
 * Money-query SEO rescue overrides for pages that already earn impressions.
 *
 * These five URLs are commercial entry points. The CMS still contains older
 * title patterns such as "recommended" and price-first phrasing, so the theme
 * keeps public titles/descriptions aligned with the current rescue strategy
 * while the content team continues deeper rewrites in WordPress.
 *
 * @return array<string,array<string,string>>
 */
function justice_theme_money_query_seo_map(): array {
	$map = array(
		'real-estate-attorney'     => array(
			'title'       => 'עורך דין מקרקעין: קנייה, מכירה, חוזים ומיסוי',
			'seo_title'   => 'עורך דין מקרקעין בישראל: קנייה, מכירה, חוזים ומיסוי | Jus-Tice',
			'description' => 'מדריך מעשי לבחירת עורך דין מקרקעין בישראל: קניית דירה, מכירת נכס, חוזה, מיסוי, בדיקות לפני חתימה ומתי צריך ליווי משפטי דחוף.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין מקרקעין</strong> יכול למנוע טעויות יקרות בעסקאות דירה, מכירת נכס, חוזה מכר, מיסוי מקרקעין ורישום זכויות. במדריך הזה תמצאו סדר פעולות ברור: מה לבדוק לפני חתימה, אילו מסמכים לבקש, מתי לעצור עסקה, ואיך לבחור עורך דין שמתאים לסוג הנכס והסיכון.</p>',
		),
		'criminal-defense-attorney' => array(
			'title'       => 'עורך דין פלילי: חקירה, מעצר, כתב אישום וייצוג',
			'seo_title'   => 'עורך דין פלילי: חקירה, מעצר, כתב אישום וייצוג | Jus-Tice',
			'description' => 'מדריך לבחירת עורך דין פלילי בישראל: חקירה במשטרה, מעצר, כתב אישום, שימוע וזכויות חשוד או נאשם לפני החלטה על ייצוג.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין פלילי</strong> נדרש מהרגע שבו יש זימון לחקירה, חשש למעצר, שימוע לפני כתב אישום או הליך פלילי פעיל. כאן תמצאו מדריך מעשי שמסביר מה לעשות לפני שמדברים עם המשטרה, אילו זכויות אסור לוותר עליהן, ואיך לבחור ייצוג מתאים לפי סוג העבירה והדחיפות.</p>',
		),
		'sex-crime-lawyer'         => array(
			'title'       => 'עורך דין עבירות מין: חקירה, כתב אישום וזכויות בהליך',
			'seo_title'   => 'עורך דין עבירות מין: חקירה, כתב אישום וזכויות בהליך | Jus-Tice',
			'description' => 'מידע משפטי זהיר על עבירות מין: חקירה, תלונה, כתב אישום, זכויות חשוד או נפגע, ומה לבדוק לפני בחירת עורך דין פלילי בתחום רגיש.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין עבירות מין</strong> מטפל באחד התחומים הרגישים ביותר במשפט הפלילי: חקירה, תלונה, עימות, כתב אישום, ראיות דיגיטליות וזכויות הצדדים. המדריך נועד לעשות סדר ראשוני, בזהירות וללא הבטחות תוצאה, כדי להבין מה חשוב לבדוק לפני קבלת החלטות.</p>',
		),
		'prenup-attorney'          => array(
			'title'       => 'עורך דין הסכם ממון: לפני נישואין, ידועים בציבור ודירה',
			'seo_title'   => 'עורך דין הסכם ממון: לפני נישואין, ידועים בציבור ודירה | Jus-Tice',
			'description' => 'מדריך להסכם ממון בישראל: לפני נישואין, ידועים בציבור, דירה, עסק משפחתי, אישור הסכם ומה לשאול עורך דין לפני חתימה.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין הסכם ממון</strong> עוזר לבני זוג להסדיר רכוש, דירה, עסק, חובות וזכויות לפני נישואין, במהלך הקשר או אצל ידועים בציבור. מדריך זה מסביר מה כדאי לכלול בהסכם, מתי נדרש אישור רשמי, ואילו שאלות לשאול לפני חתימה.</p>',
		),
		'traffic-lawyer'           => array(
			'title'       => 'עורך דין תעבורה: שלילה, נקודות, נהיגה בשכרות וקנסות',
			'seo_title'   => 'עורך דין תעבורה: שלילה, נקודות, נהיגה בשכרות וקנסות | Jus-Tice',
			'description' => 'מדריך לבחירת עורך דין תעבורה בישראל: שלילת רישיון, נקודות, נהיגה בשכרות, תאונת דרכים, דוח תנועה וזימון לבית משפט.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין תעבורה</strong> יכול להשפיע על התוצאה כאשר יש שלילת רישיון, נקודות, נהיגה בשכרות, תאונת דרכים, דוח תנועה או זימון לבית משפט. במדריך הזה תמצאו סדר פעולות ברור: מה לבדוק מיד, מתי לפנות לייעוץ, ואיך להתכונן לפני דיון או חקירה.</p>',
		),

		// Strike-zone additions (GSC live pull 2026-06-09): pages that already
		// earn impressions at positions 6-40 for exact query families the current
		// titles do not use. Title and description only; the page body stays as
		// published (no intro override).
		// HEAD-TERM STRIKE (2026-07-02): עורך דין גירושין, 8.5k impr at pos 84,
		// family total 81k impr. One page owns the bare head term: the family
		// cluster pillar /divorce-lawyer/. SERP evidence (serp-anatomy doc):
		// winners lead with the exact phrase, mirror it in the first
		// paragraph, and name the two court systems. No superlatives.
		'divorce-lawyer' => array(
			'title'       => 'עורך דין גירושין: ליווי בהסכמה ובסכסוך, משמורת, מזונות ורכוש',
			'seo_title'   => 'עורך דין גירושין: ליווי בהסכמה, בסכסוך ובגישור | Jus-Tice',
			'description' => 'עורך דין גירושין: מתי צריך ליווי משפטי, איך מתנהל הליך בהסכמה מול סכסוך, משמורת, מזונות ורכוש, ומה בודקים לפני בחירת ייצוג. פנייה מסודרת בלי עלות.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין גירושין</strong> מלווה אתכם ברגע שבו החוק, הרגש והכסף נפגשים: גירושין בהסכמה או בסכסוך, משמורת ילדים, מזונות, חלוקת רכוש והסכם גירושין, בבתי המשפט לענייני משפחה ובבתי הדין הרבניים. בעמוד הזה תמצאו את המסלול המלא צעד אחר צעד: מה בודקים לפני בחירת ייצוג, ממה מורכבת העלות, ואיך פונים לעורך דין דיני משפחה מאומת בלי עלות ובלי התחייבות.</p>',
		),
		// De-cannibalization for the head term: the 23.7k impr guide owns the
		// reputation sub-family (מומלץ, המלצות, מוניטין) and loses its
		// keyword-stuffed title; the rights guide owns זכויות וייצוג and
		// stops opening with the bare head phrase.
		'trusted-divorce-attorney-guide' => array(
			'title'       => 'עורך דין גירושין מומלץ: בדיקת מוניטין, ניסיון והמלצות',
			'seo_title'   => 'עורך דין גירושין מומלץ: בדיקת מוניטין וניסיון | Jus-Tice',
			'description' => 'איך מזהים עורך דין גירושין מומלץ באמת: בדיקת ניסיון בתיקי משפחה, מוניטין שאפשר לאמת, המלצות של לקוחות ושאלות שחושפות התאמה לפני שסוגרים ייצוג.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין גירושין מומלץ</strong> לא מזהים לפי סיסמאות אלא לפי עובדות: ניסיון אמיתי בתיקי משפחה וגירושין, מוניטין שאפשר לאמת, המלצות של לקוחות אמיתיים ותשובות ברורות בשיחה הראשונה. במדריך שלפניכם עוברים על הבדיקות האלה שלב אחרי שלב, עד לבחירה בטוחה.</p>',
		),
		'lawyer-divorce-guide-proceedings-costs-rights' => array(
			'title'       => 'זכויות בהליך גירושין וייצוג משפטי: המדריך המלא',
			'seo_title'   => 'זכויות בהליך גירושין וייצוג משפטי: המדריך המלא | Jus-Tice',
			'description' => 'המדריך לזכויות בהליך גירושין: מזונות, משמורת, חלוקת רכוש וכתובה, איך מתנהל ההליך בבית המשפט לענייני משפחה ובבית הדין הרבני, ומתי נדרש ייצוג.',
		),
		// De-cannibalization (2026-07-02): this guide led with "איתור עורך דין",
		// the directory family head term, splitting the query with /lawyers/.
		// The guide owns the how-to sub-intent; the directory owns the tool.
		'how-to-find-qualified-lawyer-israel-guide' => array(
			'title'       => 'איך לבחור עורך דין: בדיקות חובה לפני שסוגרים ייצוג',
			'seo_title'   => 'איך לבחור עורך דין: בדיקות חובה לפני שסוגרים | Jus-Tice',
			'description' => 'מדריך לבחירת עורך דין: בדיקת רישיון בלשכת עורכי הדין, ניסיון בתחום, שכר טרחה והתאמה אישית, ומה לשאול בשיחה הראשונה לפני חתימה על ייצוג, בלי התחייבות.',
		),
		'free-divorce-agreement-template' => array(
			'title'       => 'הסכם גירושין בהסכמה: דוגמא מלאה ומה חייב להופיע בהסכם',
			'seo_title'   => 'הסכם גירושין בהסכמה: דוגמא להורדה ומה חייב להופיע | Jus-Tice',
			'description' => 'דוגמא מלאה להסכם גירושין בהסכמה: רכוש, משמורת, מזונות ואישור בית המשפט. טיוטה בסיסית חינם, מיועדת לבדיקה והשלמה על ידי עורך דין.',
		),
		'police-records-data-deletion' => array(
			'title'       => 'ביטול רישום פלילי ומשטרתי: מי זכאי ואיך מגישים בקשה',
			'seo_title'   => 'ביטול רישום פלילי ומשטרתי: זכאות, מחיקה וזמנים | Jus-Tice',
			'description' => 'מדריך לביטול רישום פלילי ורישום משטרתי: תקופות התיישנות ומחיקה, מי זכאי, איך מגישים בקשה ומתי כדאי ליווי של עורך דין פלילי.',
		),
		'apply-for-police-criminal-information-certificates' => array(
			'title'       => 'תעודת יושר (מידע פלילי): הגשת בקשה אונליין, זכאות וזמנים',
			'seo_title'   => 'תעודת יושר: בקשה לתעודת מידע פלילי אונליין | Jus-Tice',
			'description' => 'איך מגישים בקשה לתעודת מידע פלילי (תעודת יושר): הגשה אונליין למשטרה, מי רשאי לבקש, כמה זמן לוקח ומה עושים כשקיים רישום.',
		),
		'drug-related-crime' => array(
			'title'       => 'עורך דין סמים: החזקה, שימוש עצמי וסחר בסמים',
			'seo_title'   => 'עורך דין סמים: החזקה, שימוש עצמי וסחר בסמים | Jus-Tice',
			'description' => 'עבירות סמים בישראל: החזקה, שימוש עצמי, גידול וסחר בסמים. הענישה בחוק, השלכות הרישום הפלילי ומתי חשוב עורך דין פלילי מהחקירה הראשונה.',
		),
		'how-much-will-a-criminal-defense-lawyer-cost' => array(
			'title'       => 'כמה עולה עורך דין פלילי: שכר טרחה לפי שלב ההליך',
			'seo_title'   => 'כמה עולה עורך דין פלילי: שכר טרחה לפי שלב ההליך | Jus-Tice',
			'description' => 'כמה עולה עורך דין פלילי בישראל: טווחי שכר טרחה לחקירה, מעצר, שימוע וכתב אישום, מה משפיע על המחיר ואילו שאלות לשאול לפני שסוגרים.',
		),
		'lawyer-for-buying-or-selling-a-house' => array(
			'title'       => 'עורך דין לקניית דירה ומכירת דירה: ליווי, בדיקות ומחיר',
			'seo_title'   => 'עורך דין קניית דירה ומכירת דירה: ליווי ומחיר | Jus-Tice',
			'description' => 'עורך דין לקניית דירה או מכירת דירה: אילו בדיקות חובה לפני חתימה, שלבי העסקה, רישום בטאבו וכמה עולה ליווי משפטי לעסקת מגורים.',
		),
		'buying-property-in-greece' => array(
			'title'       => 'קניית דירה ביוון: מחירים, מיסים והליך הרכישה לישראלים',
			'seo_title'   => 'קניית דירה ביוון: מחירים, מיסים והליך רכישה | Jus-Tice',
			'description' => 'קניית דירה או בית ביוון: כמה עולה דירה ביוון, מס רכישה והוצאות נלוות, שלבי העסקה, בדיקות משפטיות וליווי עורך דין מקומי לישראלים.',
		),
		'avoiding-mistakes-when-buying-property-in-cyprus' => array(
			'title'       => 'קניית דירה בקפריסין: טעויות נפוצות ובדיקות חובה',
			'seo_title'   => 'קניית דירה בקפריסין: טעויות נפוצות ובדיקות חובה | Jus-Tice',
			'description' => 'קניית דירה או נכס בקפריסין: הטעויות הנפוצות של רוכשים ישראלים, בדיקות חובה לפני חתימה, מיסוי מקומי ומתי נדרש עורך דין בקפריסין.',
		),
		'cyprus-lawyer' => array(
			'title'       => 'עורך דין קפריסין: ליווי ישראלים ברכישת נכס ובעסקאות',
			'seo_title'   => 'עורך דין קפריסין: ליווי ישראלים בנדל"ן ובעסקאות | Jus-Tice',
			'description' => 'עורך דין בקפריסין לישראלים: רכישת דירה או נכס, בדיקות בעלות ורישום, מיסוי מקומי, פתיחת חברה ומה לבדוק לפני בחירת משרד מקומי.',
		),

		// Batch 2 (GSC strike zone + live page mapping 2026-07-03): existing
		// pages whose stuffed or bare titles lose the exact query families
		// they already rank for.
		'criminal-indictment-cancellation-withdrawal-israel' => array(
			'title'       => 'חזרה מכתב אישום וביטולו: עילות והגשת בקשה',
			'seo_title'   => 'חזרה מכתב אישום וביטולו: עילות והגשת בקשה | Jus-Tice',
			'description' => 'חזרה מכתב אישום, ביטול כתב אישום ומחיקתו: העילות בחוק, איך מגישים בקשה לפרקליטות, מה קורה לרישום ומתי נדרש עורך דין פלילי.',
		),
		'dui-refusal-blood-breath-urine-test' => array(
			'title'       => 'סירוב לבדיקת שכרות: העונש, השלילה ומה עושים',
			'seo_title'   => 'סירוב לבדיקת שכרות: העונש, השלילה ומה עושים | Jus-Tice',
			'description' => 'סירוב לבדיקת שכרות או בדיקת אלכוהול נחשב כהודאה בנהיגה בשכרות: העונש בחוק, שלילת רישיון, ומה חשוב לעשות מיד אחרי אירוע כזה.',
		),
		'what-is-money-laundering' => array(
			'title'       => 'הלבנת הון: העבירה בחוק, העונש ושלב החקירה',
			'seo_title'   => 'הלבנת הון: העבירה בחוק, העונש ושלב החקירה | Jus-Tice',
			'description' => 'מה זו הלבנת הון והלבנת כספים: העבירות בחוק איסור הלבנת הון, הענישה, חילוט כספים ומתי חשוב עורך דין פלילי כבר בשלב החקירה.',
		),
		'will-probate-objection' => array(
			'title'       => 'התנגדות לצוואה וביטול צו קיום צוואה: ההליך המלא',
			'seo_title'   => 'התנגדות לצוואה וביטול צו קיום צוואה: ההליך | Jus-Tice',
			'description' => 'התנגדות לצוואה וביטול צו קיום צוואה: עילות מוכרות, מועדים להגשה, ראיות נדרשות ואיך מתנהל ההליך ברשם לענייני ירושה ובבית המשפט.',
		),
		'punishment-criminal-offenses' => array(
			'title'       => 'תקיפת בת זוג: העונש בחוק, מעצר וצו הרחקה',
			'seo_title'   => 'תקיפת בת זוג: העונש בחוק, מעצר וצו הרחקה | Jus-Tice',
			'description' => 'עבירת תקיפת בת זוג ואיומים: הענישה בחוק העונשין, מעצר ימים, צו הרחקה, סגירת תיק ומתי נדרש עורך דין פלילי משלב החקירה.',
		),
		'military-lawyer-israel-court-martial-defense' => array(
			'title'       => 'עורך דין צבאי: מחיר, בית דין צבאי ומתי פונים',
			'seo_title'   => 'עורך דין צבאי: מחיר, בית דין צבאי ומתי פונים | Jus-Tice',
			'description' => 'עורך דין צבאי: ייצוג בבית דין צבאי, נפקדות ועריקות, חקירת מצ"ח, טווחי מחיר ושכר טרחה, ומתי חובה ייצוג משלב הזימון הראשון.',
		),
		'registration-of-real-estate-israel' => array(
			'title'       => 'לשכת רישום המקרקעין (טאבו): רישום מכר מקוון',
			'seo_title'   => 'לשכת רישום המקרקעין (טאבו): רישום מכר מקוון | Jus-Tice',
			'description' => 'לשכת רישום המקרקעין (טאבו): איך מגישים בקשה לרישום מכר מקוון, אילו מסמכים נדרשים, אגרות, זמני טיפול ומתי כדאי עורך דין מקרקעין.',
		),
		'israel-notary-public' => array(
			'title'       => 'נוטריון: מה זה, מה הוא מאשר וכמה זה עולה',
			'seo_title'   => 'נוטריון: מה זה, מה הוא מאשר וכמה זה עולה | Jus-Tice',
			'description' => 'נוטריון בישראל: מה ההבדל בין נוטריון לעורך דין, אילו אישורים נוטריוניים קיימים, תעריף קבוע בחוק ומתי צריך אישור נוטריוני לחו"ל.',
		),
		'criminal-law-price-list-lawyer-recommended-review-costs' => array(
			'title'       => 'מחירון עורך דין פלילי: טבלת שכר טרחה והשוואה',
			'seo_title'   => 'מחירון עורך דין פלילי: טבלת שכר טרחה והשוואה | Jus-Tice',
			'description' => 'מחירון עורך דין פלילי: טבלת שכר טרחה לפי סוג ההליך, ייעוץ לפני חקירה, מעצר, שימוע וניהול תיק, והשוואת עלויות לפני בחירת ייצוג.',
		),
		'criminal-law-tel-aviv-lawyer-criminal-recommended' => array(
			'title'       => 'עורך דין פלילי בתל אביב: ייצוג בבתי המשפט ומחירים',
			'seo_title'   => 'עורך דין פלילי בתל אביב: ייצוג ומחירים | Jus-Tice',
			'description' => 'עורך דין פלילי בתל אביב: ייצוג בבית משפט השלום והמחוזי בתל אביב, ליווי בחקירות ומעצרים, טווחי מחיר ואיך בוחרים ייצוג מתאים.',
		),

		// Batch 3 (serp-strike skill run 2026-07-03): SERP-checked overrides.
		'criminal-offenses-lawyer-criminal-sentencing-process-arrest' => array(
			'title'       => 'סוגי עבירות פליליות: סיווג, ענישה והליך המעצר',
			'seo_title'   => 'סוגי עבירות פליליות: סיווג, ענישה והליך המעצר | Jus-Tice',
			'description' => 'סוגי עבירות פליליות בישראל: חטא, עוון ופשע, טבלת ענישה לפי סוג העבירה, הליך המעצר ומתי חשוב עורך דין פלילי מהשלב הראשון.',
		),
		'medical-malpractice-attorney' => array(
			'title'       => 'שכר טרחה עורך דין רשלנות רפואית: אחוזים ומדרגות',
			'seo_title'   => 'שכר טרחה עורך דין רשלנות רפואית: אחוזים ומדרגות | Jus-Tice',
			'description' => 'שכר טרחה של עורך דין רשלנות רפואית: אחוזים מקובלים מהפיצוי, מדרגות לפי שלב ההליך, מי מממן חוות דעת רפואית ומה לבדוק לפני חתימה.',
		),
	);

	return array_merge( $map, justice_theme_year_fresh_seo_map() );
}

/**
 * Year-freshness title overrides for money pages whose slugs carry a stale
 * year. The slug never changes (owner URL rule); only the rendered title and
 * description show the current year, computed at render time so it never
 * goes stale again.
 *
 * @return array<string,array<string,string>>
 */
function justice_theme_year_fresh_seo_map(): array {
	$year = wp_date( 'Y' );

	return array(
		'divorce-costs-2025' => array(
			'title'       => 'כמה עולה גירושין: עלויות ושכר טרחה מעודכן ' . $year,
			'seo_title'   => 'כמה עולה גירושין: עלויות ושכר טרחה מעודכן ' . $year . ' | Jus-Tice',
			'description' => 'כמה עולים גירושין בישראל נכון ל-' . $year . ': שכר טרחת עורך דין גירושין, אגרות, גישור והוצאות נלוות, ומה משפיע על העלות הכוללת.',
		),
		'mutual-divorce-agreement-2025' => array(
			'title'       => 'גירושין בהסכמה: ההליך, ההסכם והעלויות ' . $year,
			'seo_title'   => 'גירושין בהסכמה: ההליך, ההסכם והעלויות ' . $year . ' | Jus-Tice',
			'description' => 'גירושין בהסכמה נכון ל-' . $year . ': איך נראה ההליך, מה כולל הסכם הגירושין, אישור בבית המשפט או בבית הדין, עלויות וזמנים.',
		),
		'real-estate-lawyer-cost-2025' => array(
			'title'       => 'כמה עולה עורך דין מקרקעין: שכר טרחה ' . $year,
			'seo_title'   => 'כמה עולה עורך דין מקרקעין: שכר טרחה ' . $year . ' | Jus-Tice',
			'description' => 'שכר טרחת עורך דין מקרקעין נכון ל-' . $year . ': אחוזים מקובלים בעסקת דירה, מינימום מקובל, מה כלול בליווי ומתי המחיר משתנה.',
		),
		'online-rent-agreement' => array(
			'title'       => 'חוזה שכירות סטנדרטי להורדה: נוסח מעודכן ' . $year,
			'seo_title'   => 'חוזה שכירות סטנדרטי להורדה: נוסח מעודכן ' . $year . ' | Jus-Tice',
			'description' => 'חוזה שכירות סטנדרטי לדירה בנוסח מעודכן ' . $year . ': הסעיפים החשובים, ערבויות ובטחונות, טיוטה אונליין לבדיקה והשלמה של עורך דין.',
		),
		'lawyer-fees-guide' => array(
			'title'       => 'שכר טרחה עורך דין: מדריך מחירים ' . $year . ' לפי תחום',
			'seo_title'   => 'שכר טרחה עורך דין: מדריך מחירים ' . $year . ' לפי תחום | Jus-Tice',
			'description' => 'כמה עולה עורך דין בישראל נכון ל-' . $year . ': טווחי שכר טרחה לפי תחום, שעתי מול קבוע מול אחוזים, ומה חייב להופיע בהסכם שכר טרחה.',
		),
	);
}

/**
 * Return the active money-query override for the current singular article.
 *
 * @return array<string,string>|null
 */
function justice_theme_current_money_query_seo(): ?array {
	if ( ! is_singular( 'articles' ) ) {
		return null;
	}

	$post = get_post();
	if ( ! $post instanceof WP_Post ) {
		return null;
	}

	$map = justice_theme_money_query_seo_map();

	return $map[ $post->post_name ] ?? null;
}

/**
 * Public title override for selected money-query articles.
 *
 * @param string $title   Current title.
 * @param int    $post_id Post ID.
 * @return string
 */
function justice_theme_money_query_public_title( $title, $post_id = 0 ) {
	if ( is_admin() || ! in_the_loop() ) {
		return $title;
	}

	$post = get_post( $post_id );
	if ( ! $post instanceof WP_Post || 'articles' !== $post->post_type ) {
		return $title;
	}

	$map = justice_theme_money_query_seo_map();

	return $map[ $post->post_name ]['title'] ?? $title;
}
add_filter( 'the_title', 'justice_theme_money_query_public_title', 20, 2 );

/**
 * Replace the first paragraph on selected money pages with a search-intent intro.
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_money_query_intro( $content ) {
	$override = justice_theme_current_money_query_seo();
	if ( ! $override || empty( $override['intro'] ) || ! is_main_query() || ! in_the_loop() ) {
		return $content;
	}

	$intro = $override['intro'];
	if ( str_contains( $content, wp_strip_all_tags( $intro ) ) ) {
		return $content;
	}

	if ( preg_match( '/<p[\s\S]*?<\/p>/i', $content ) ) {
		return preg_replace( '/<p[\s\S]*?<\/p>/i', $intro, $content, 1 );
	}

	return $intro . "\n" . $content;
}
add_filter( 'the_content', 'justice_theme_money_query_intro', 6 );

/**
 * Return focused SEO copy for high-value practice taxonomy pages.
 *
 * @param string $term_slug Practice-area term slug.
 * @return array
 */
function justice_theme_practice_area_seo_override( string $term_slug ): array {
	$overrides = array(
		'real-estate-law' => array(
			'title'       => 'עורך דין מקרקעין ונדל״ן | מדריכים, מאמרים ועורכי דין',
			'description' => 'מידע על קניית דירה, מכירת נכס, חוזה מכר, טאבו, מס שבח והתחדשות עירונית, עם מדריכים ופנייה מסודרת לעורך דין מקרקעין.',
		),
		'labor-law'       => array(
			'title'       => 'עורך דין דיני עבודה | זכויות עובדים, פיטורים ושימוע',
			'description' => 'מידע לעובדים ולמעסיקים בנושא פיטורים, שימוע, זכויות עובדים, שכר, חוזה עבודה ופנסיה, עם מדריכים ופנייה לעורך דין דיני עבודה.',
		),
		// Strike-zone taxonomy hubs (GSC 2026-06-09): titles carry the exact
		// query vocabulary of the area's highest-impression questions.
		'criminal-law'    => array(
			'title'       => 'עורך דין פלילי | חקירה, מעצר, רישום פלילי ומדריכים',
			'description' => 'מידע על חקירה במשטרה, מעצר, כתב אישום, ביטול רישום פלילי ותעודת יושר, עם מדריכים מקצועיים ופנייה מסודרת לעורך דין פלילי.',
		),
		'family-law'      => array(
			'title'       => 'עורך דין גירושין ומשפחה | הסכם גירושין, מזונות ומשמורת',
			'description' => 'מידע על הסכם גירושין בהסכמה, מזונות, משמורת ילדים והסכמי ממון, עם מדריכים מקצועיים ופנייה מסודרת לעורך דין גירושין ומשפחה.',
		),
		'medical-malpractice' => array(
			'title'       => 'עורך דין רשלנות רפואית | מתי תובעים, הוכחה ופיצויים',
			'description' => 'מידע על תביעות רשלנות רפואית: אבחון מאוחר, רשלנות בלידה ובניתוחים, חוות דעת רפואית ופיצויים, עם מדריכים ופנייה לעורך דין.',
		),
		'traffic-law'     => array(
			'title'       => 'עורך דין תעבורה | שלילת רישיון, נקודות ונהיגה בשכרות',
			'description' => 'מידע על שלילת רישיון, נקודות, נהיגה בשכרות וסירוב לבדיקה, דוחות תנועה וזימון לבית משפט, עם מדריכים ופנייה לעורך דין תעבורה.',
		),
		'inheritance-law' => array(
			'title'       => 'עורך דין ירושה וצוואות | צו ירושה, צוואה והתנגדות',
			'description' => 'מידע על צו ירושה, צו קיום צוואה, עריכת צוואה והתנגדות לצוואה, חלוקת עיזבון וסכסוכי ירושה, עם מדריכים ופנייה לעורך דין ירושה.',
		),
		'torts'           => array(
			'title'       => 'עורך דין נזיקין ותאונות | פיצויים על נזקי גוף',
			'description' => 'מידע על תביעות נזיקין: תאונות דרכים, תאונות עבודה ונזקי גוף, אחוזי נכות ופיצויים, עם מדריכים ופנייה מסודרת לעורך דין נזיקין.',
		),
	);

	return $overrides[ $term_slug ] ?? array();
}

/**
 * Default title for the unfiltered lawyer directory.
 *
 * When enough real approved client reviews exist sitewide, the title carries
 * a computed review-count trust token, the pattern the page-1 legal
 * directories use for the "מומלץ" query family. The number comes straight
 * from the moderated reviews system; below the threshold the plain
 * head-term title renders instead. Never a mock number.
 *
 * @return string
 */
function justice_theme_lawyer_directory_default_title(): string {
	if ( function_exists( 'justice_theme_total_approved_review_stats' ) ) {
		$stats     = justice_theme_total_approved_review_stats();
		$threshold = (int) apply_filters( 'justice_theme_directory_review_token_threshold', 10 );

		if ( $stats['count'] >= max( 1, $threshold ) ) {
			return sprintf(
				'חיפוש עורך דין לפי שם, תחום ועיר | %s ביקורות מאומתות',
				number_format_i18n( $stats['count'] )
			);
		}
	}

	// GSC 2026-06-09: the family is a search-tool intent (22k impr across
	// "חיפוש לפי שם", "איתור", "אינדקס", "מאגר", "לפי מספר רישיון") stuck at
	// pos 7-12 with sub-1% CTR. Head query first, registry vocabulary next.
	return 'חיפוש עורך דין לפי שם, תחום ועיר | אינדקס Jus-Tice';
}

/**
 * Build the public-facing SEO title for the current request.
 *
 * Shared by WordPress core title parts and common SEO plugin filters so archive
 * and search pages do not leak English defaults such as "Archive" or
 * "You searched for".
 *
 * @return string
 */
function justice_theme_contextual_seo_title(): string {
	$money_query_override = justice_theme_current_money_query_seo();
	if ( $money_query_override ) {
		return $money_query_override['seo_title'];
	}

	if ( is_front_page() ) {
		return 'עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ';
	}

	if ( is_post_type_archive( 'articles' ) || is_page( 'articles' ) ) {
		return 'מאמרים משפטיים לפי הבעיה שלכם | Jus-Tice';
	}

	if ( is_search() ) {
		$query = trim( get_search_query() );

		return $query
			? sprintf( 'תוצאות חיפוש עבור: %s | Jus-Tice', $query )
			: 'חיפוש באתר | Jus-Tice';
	}

	if ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) ) {
		$city_slug = isset( $_GET['city'] ) ? sanitize_text_field( wp_unslash( $_GET['city'] ) ) : '';
		$area_slug = isset( $_GET['area'] ) ? sanitize_text_field( wp_unslash( $_GET['area'] ) ) : '';

		if ( $city_slug ) {
			$city_t = get_term_by( 'slug', $city_slug, 'city' );
			if ( $area_slug ) {
				$area_t = justice_theme_lawyer_directory_area_term( $area_slug );

				return 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
			}

			return 'עורכי דין ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
		}

		if ( $area_slug ) {
			$area_t = justice_theme_lawyer_directory_area_term( $area_slug );

			return 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' | מצאו עורך דין מתאים';
		}

		// GSC 2026-06-09: the directory head terms are "חיפוש עורך דין לפי שם"
		// and "עורכי דין מומלצים"; the title carries both instead of the
		// generic "מדריך" phrasing.
		return justice_theme_lawyer_directory_default_title();
	}

	if ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term instanceof WP_Term ) {
			$practice_area_seo = justice_theme_practice_area_seo_override( $term->slug );
			if ( ! empty( $practice_area_seo['title'] ) ) {
				return $practice_area_seo['title'];
			}

			return 'עורך דין ' . $term->name . ' | מדריך, מאמרים ועורכי דין';
		}
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

		$suffix .= justice_theme_lawyer_profile_title_review_token( (int) get_the_ID() );

		return get_the_title() . $suffix;
	}

	return '';
}

/**
 * Computed rating token for a lawyer profile title, only when the same
 * public gates that control on-page rating display pass.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return string Empty string or a " | דירוג ..." suffix.
 */
function justice_theme_lawyer_profile_title_review_token( int $lawyer_id ): string {
	if ( ! function_exists( 'justice_theme_lawyer_reviews_public_state' ) ) {
		return '';
	}

	$state = justice_theme_lawyer_reviews_public_state( $lawyer_id );

	if ( ! $state['show'] ) {
		return '';
	}

	return sprintf(
		' | דירוג %s מתוך 5 (%s ביקורות)',
		number_format_i18n( $state['average'], 1 ),
		number_format_i18n( $state['count'] )
	);
}

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
			$title_parts['site']    = '';

			return $title_parts;
		}
	}

	$contextual_title = justice_theme_contextual_seo_title();
	if ( $contextual_title ) {
		$title_parts['title']   = $contextual_title;
		$title_parts['tagline'] = '';
		$title_parts['site']    = '';

		return $title_parts;
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
				$area_t = justice_theme_lawyer_directory_area_term( $area_slug );
				$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' ב' . ( $city_t ? $city_t->name : '' ) . ' | Jus-Tice';
			} else {
				$title_parts['title'] = 'עורכי דין ב' . ( $city_t ? $city_t->name : '' ) . ' | מדריך עורכי דין';
			}
		} elseif ( $area_slug ) {
			$area_t = justice_theme_lawyer_directory_area_term( $area_slug );
			$title_parts['title'] = 'עורך דין ' . ( $area_t ? $area_t->name : '' ) . ' | מצאו עורך דין מומחה';
		} else {
			$title_parts['title'] = justice_theme_lawyer_directory_default_title();
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
		$suffix .= justice_theme_lawyer_profile_title_review_token( (int) get_the_ID() );
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

	$contextual_title = justice_theme_contextual_seo_title();
	if ( $contextual_title ) {
		return wp_strip_all_tags( $contextual_title );
	}

	return $title;
}
add_filter( 'wpseo_title', 'justice_theme_filter_plugin_seo_title' );
add_filter( 'aioseo_title', 'justice_theme_filter_plugin_seo_title' );

/**
 * Keep common SEO plugins aligned with repo-published meta descriptions.
 *
 * @param string $description Existing description.
 * @return string
 */
function justice_theme_filter_plugin_seo_description( $description ) {
	$money_query_override = justice_theme_current_money_query_seo();
	if ( $money_query_override ) {
		return wp_strip_all_tags( $money_query_override['description'] );
	}

	if ( is_singular() ) {
		$custom_description = get_post_meta( get_the_ID(), 'seo_description', true );
		if ( $custom_description ) {
			return wp_strip_all_tags( $custom_description );
		}
	}

	if ( is_tax( 'practice-areas' ) ) {
		$term = get_queried_object();
		if ( $term instanceof WP_Term ) {
			$practice_area_seo = justice_theme_practice_area_seo_override( $term->slug );
			if ( ! empty( $practice_area_seo['description'] ) ) {
				return wp_strip_all_tags( $practice_area_seo['description'] );
			}
		}
	}

	if ( ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) ) && ! justice_theme_is_lawyer_directory_filter_state() ) {
		return 'מאגר עורכי דין בישראל בחינם: חיפוש לפי שם, תחום התמחות, עיר או מספר רישיון. פרופילים מאומתים עם ניסיון, תחומי עיסוק ודרכי קשר, ללא עלות וללא הרשמה.';
	}

	return $description;
}
add_filter( 'wpseo_metadesc', 'justice_theme_filter_plugin_seo_description' );
add_filter( 'aioseo_description', 'justice_theme_filter_plugin_seo_description' );

/**
 * Output custom Justice meta tags that Yoast SEO does not handle.
 *
 * Standard SEO meta tags (description, OG, canonical) are now handled
 * exclusively by Yoast SEO. This function only outputs:
 *   - justice:aeo-summary  — AI Engine Optimization summary
 *   - justice:geo-summary  — Geographic relevance summary
 *
 * @since 1.0.6  Stripped duplicate meta/OG/canonical output (Yoast migration).
 */
function justice_theme_meta_head() {
	if ( ! is_singular() ) {
		return;
	}

	$post_id = get_the_ID();
	if ( ! $post_id ) {
		return;
	}

	$aeo_summary = get_post_meta( $post_id, 'aeo_summary', true );
	$geo_summary = get_post_meta( $post_id, 'geo_summary', true );

	if ( $aeo_summary ) {
		echo '<meta name="justice:aeo-summary" content="' . esc_attr( $aeo_summary ) . '">' . "\n";
	}
	if ( $geo_summary ) {
		echo '<meta name="justice:geo-summary" content="' . esc_attr( $geo_summary ) . '">' . "\n";
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

	return justice_theme_normalize_public_url( $archive ? (string) $archive : home_url( '/lawyers/' ) );
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
 * Custom canonical URL output — DISABLED since Yoast migration.
 *
 * Yoast SEO now handles canonical URLs for all page types.
 * This function is kept as a no-op to avoid breaking any code
 * that may call it directly or unhook/rehook it.
 *
 * @since 1.0.6  Disabled to prevent duplicate canonicals with Yoast.
 */
function justice_theme_canonical_url() {
	// Yoast SEO handles all canonical output. No-op.
	return;
}
add_action( 'wp_head', 'justice_theme_canonical_url', 5 );

/**
 * Resolve the canonical public URL for language alternate tags.
 *
 * @return string
 */
function justice_theme_hreflang_url(): string {
	if ( is_admin() || is_404() || is_search() || justice_theme_is_lawyer_directory_filter_state() ) {
		return '';
	}

	if ( is_singular() ) {
		return justice_theme_normalize_public_url( (string) get_permalink() );
	}

	if ( is_front_page() ) {
		return justice_theme_normalize_public_url( home_url( '/' ) );
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return justice_theme_lawyer_archive_canonical_url();
	}

	if ( is_post_type_archive( 'articles' ) ) {
		$archive = get_post_type_archive_link( 'articles' );

		return $archive ? justice_theme_normalize_public_url( (string) $archive ) : '';
	}

	if ( is_tax() || is_category() || is_tag() ) {
		$term = get_queried_object();
		if ( $term && ! is_wp_error( $term ) ) {
			$link = get_term_link( $term );

			return is_wp_error( $link ) ? '' : justice_theme_normalize_public_url( (string) $link );
		}
	}

	return '';
}

/**
 * Declare the Hebrew-first language target for public canonical URLs.
 */
function justice_theme_hreflang_alternates(): void {
	$url = justice_theme_hreflang_url();

	if ( ! $url ) {
		return;
	}

	echo '<link rel="alternate" hreflang="he" href="' . esc_url( $url ) . '">' . "\n";
	echo '<link rel="alternate" hreflang="x-default" href="' . esc_url( $url ) . '">' . "\n";
}
add_action( 'wp_head', 'justice_theme_hreflang_alternates', 6 );

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

/* Rank Math robots filter removed — Yoast SEO is now active. */

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

	return justice_theme_normalize_public_url( (string) $canonical );
}
add_filter( 'wpseo_canonical', 'justice_theme_filter_directory_canonical' );
add_filter( 'aioseo_canonical_url', 'justice_theme_filter_directory_canonical' );

/**
 * Ensure robots.txt references our REST API sitemap.
 *
 * On uPress, nginx 301-redirects all .xml files to the homepage.
 * Yoast's sitemap_index.xml and WordPress core's wp-sitemap.xml
 * are both unreachable. Our REST API endpoint is the only working
 * sitemap delivery method.
 *
 * GSC fully supports REST API endpoints as sitemap URLs.
 *
 * @param string $output Robots.txt output.
 * @param bool   $public Whether search engines are allowed.
 * @return string
 */
function justice_theme_robots_sitemap_directive( ?string $output, ?bool $public ): string {
	if ( null === $output ) {
		return '';
	}
	if ( ! $public ) {
		return $output;
	}

	// Our REST API sitemap is the only one that works on uPress.
	$correct_sitemap = justice_theme_normalize_public_url(
		home_url( '/wp-json/justice/v1/sitemap' )
	);

	// Remove any stale sitemap references (old .xml paths).
	$stale_patterns = array(
		'sitemap_index.xml',
		'sitemap.xml',
		'justice-sitemap.xml',
		'wp-sitemap.xml',
	);
	foreach ( $stale_patterns as $stale ) {
		$output = preg_replace( '/Sitemap:\s*[^\n]*' . preg_quote( $stale, '/' ) . '[^\n]*\n?/i', '', $output );
	}

	// Don't duplicate if already present.
	if ( false !== stripos( $output, 'justice/v1/sitemap' ) ) {
		return $output;
	}

	$output = rtrim( $output );
	$output .= ( '' === $output ? '' : "\n" ) . 'Sitemap: ' . $correct_sitemap . "\n";

	return $output;
}
add_filter( 'robots_txt', 'justice_theme_robots_sitemap_directive', PHP_INT_MAX, 2 );

/**
 * Normalize a sitemap entry array without changing non-URL metadata.
 *
 * @param mixed $entry Sitemap entry.
 * @return mixed
 */
function justice_theme_normalize_sitemap_entry_loc( $entry ) {
	if ( is_array( $entry ) && ! empty( $entry['loc'] ) ) {
		$entry['loc'] = justice_theme_normalize_public_url( (string) $entry['loc'] );
	}

	return $entry;
}

/**
 * Normalize first-party URL strings in plugin sitemap callbacks.
 *
 * @param mixed $url Sitemap URL.
 * @return string
 */
function justice_theme_normalize_sitemap_url_string( $url ): string {
	return justice_theme_normalize_public_url( (string) $url );
}

/**
 * Normalize image items emitted in Rank Math XML sitemaps.
 *
 * Rank Math exposes image sitemap callbacks separately from the page loc
 * callbacks, so media URLs need their own render-only normalization.
 *
 * @param mixed $images Image item list.
 * @return mixed
 */
function justice_theme_normalize_sitemap_image_items( $images ) {
	if ( is_string( $images ) ) {
		return justice_theme_normalize_public_url( $images );
	}

	if ( ! is_array( $images ) ) {
		return $images;
	}

	foreach ( $images as $key => $image ) {
		if ( is_string( $image ) ) {
			$images[ $key ] = justice_theme_normalize_public_url( $image );
			continue;
		}

		if ( ! is_array( $image ) ) {
			continue;
		}

		foreach ( array( 'src', 'loc', 'url' ) as $url_key ) {
			if ( ! empty( $image[ $url_key ] ) ) {
				$image[ $url_key ] = justice_theme_normalize_public_url( (string) $image[ $url_key ] );
			}
		}

		$images[ $key ] = $image;
	}

	return $images;
}

/**
 * Normalize WordPress core sitemap entries if core sitemaps are active.
 *
 * The live sitemap currently appears plugin-controlled, so this is a safe
 * fallback only. Plugin sitemap settings still require wp-admin/uPress review.
 *
 * @param array $entry Sitemap entry.
 * @return array
 */
function justice_theme_normalize_core_sitemap_entry( array $entry ): array {
	return justice_theme_normalize_sitemap_entry_loc( $entry );
}
add_filter( 'wp_sitemaps_posts_entry', 'justice_theme_normalize_core_sitemap_entry' );
add_filter( 'wp_sitemaps_taxonomies_entry', 'justice_theme_normalize_core_sitemap_entry' );
add_filter( 'wp_sitemaps_users_entry', 'justice_theme_normalize_core_sitemap_entry' );

/**
 * Normalize SEO-plugin sitemap URL entries to the public HTTPS origin.
 *
 * Yoast sitemap is disabled on this site (uPress nginx blocks .xml),
 * but these hooks remain as safety nets. Rank Math hooks removed.
 */
add_filter( 'wpseo_xml_sitemap_post_url', 'justice_theme_normalize_sitemap_url_string', 20 );
add_filter( 'wpseo_xml_sitemap_term_url', 'justice_theme_normalize_sitemap_url_string', 20 );
add_filter( 'wpseo_sitemap_entry', 'justice_theme_normalize_sitemap_entry_loc', 20 );
add_filter( 'aioseo_sitemap_indexes', 'justice_theme_normalize_aioseo_sitemap_indexes', 20 );

/**
 * Normalize AIOSEO sitemap index locations.
 *
 * @param mixed $indexes Sitemap indexes.
 * @return mixed
 */
function justice_theme_normalize_aioseo_sitemap_indexes( $indexes ) {
	if ( ! is_array( $indexes ) ) {
		return $indexes;
	}

	foreach ( $indexes as $key => $index ) {
		$indexes[ $key ] = justice_theme_normalize_sitemap_entry_loc( $index );
	}

	return $indexes;
}

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
 * Suppress conflicting favicon stacks so Google sees one stable brand icon.
 *
 * The site has previously exposed theme, plugin and WordPress Site Icon links
 * at the same time. Google may choose any eligible icon, so keep one canonical
 * scales mark in public head output.
 */
function justice_theme_start_brand_icon_buffer(): void {
	ob_start( 'justice_theme_filter_brand_icon_output' );
}
add_action( 'wp_head', 'justice_theme_start_brand_icon_buffer', 0 );

/**
 * Flush the public head favicon cleanup buffer after plugin output finishes.
 */
function justice_theme_flush_brand_icon_buffer(): void {
	if ( ob_get_level() > 0 ) {
		ob_end_flush();
	}
}
add_action( 'wp_head', 'justice_theme_flush_brand_icon_buffer', 1000 );

/**
 * Remove plugin/admin icon tags while preserving the Justice brand icon set.
 *
 * @param string $html Buffered wp_head output.
 * @return string
 */
function justice_theme_filter_brand_icon_output( string $html ): string {
	$html = preg_replace_callback(
		'#<link\b[^>]*>\s*#i',
		static function ( array $matches ): string {
			$tag = $matches[0];

			if ( false !== stripos( $tag, 'data-justice-theme="brand-icon"' ) ) {
				return $tag;
			}

			if (
				preg_match( '#\brel=["\'][^"\']*(?:icon|apple-touch-icon|mask-icon)[^"\']*["\']#i', $tag )
				|| false !== stripos( $tag, 'favicon' )
			) {
				return '';
			}

			return $tag;
		},
		$html
	);

	$html = is_string( $html ) ? $html : '';

	$html = preg_replace(
		'#<meta\b[^>]*name=["\']msapplication-(?:TileImage|config)["\'][^>]*>\s*#i',
		'',
		$html
	);

	return is_string( $html ) ? $html : '';
}

/**
 * Print the canonical scales favicon set for browser tabs and Google results.
 */
function justice_theme_print_brand_icons(): void {
	$theme_uri = JUSTICE_THEME_URI . '/assets/images';

	echo '<link rel="icon" type="image/png" sizes="48x48" href="' . esc_url( $theme_uri . '/favicon-48.png' ) . '" data-justice-theme="brand-icon">' . "\n";
	echo '<link rel="icon" type="image/png" sizes="192x192" href="' . esc_url( $theme_uri . '/favicon-192.png' ) . '" data-justice-theme="brand-icon">' . "\n";
	echo '<link rel="icon" type="image/png" sizes="512x512" href="' . esc_url( $theme_uri . '/favicon-512.png' ) . '" data-justice-theme="brand-icon">' . "\n";
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( $theme_uri . '/favicon.svg' ) . '" data-justice-theme="brand-icon">' . "\n";
	echo '<link rel="shortcut icon" href="' . esc_url( $theme_uri . '/favicon.ico' ) . '" sizes="any" data-justice-theme="brand-icon">' . "\n";
	echo '<link rel="apple-touch-icon" sizes="180x180" href="' . esc_url( $theme_uri . '/apple-touch-icon.png' ) . '" data-justice-theme="brand-icon">' . "\n";
}
add_action( 'wp_head', 'justice_theme_print_brand_icons', 2 );

/**
 * Expose a stable mobile app manifest for the canonical brand icon set.
 */
function justice_theme_brand_manifest_link(): void {
	echo '<link rel="manifest" href="' . esc_url( JUSTICE_THEME_URI . '/assets/images/site.webmanifest' ) . '" data-justice-theme="brand-icon">' . "\n";
}
add_action( 'wp_head', 'justice_theme_brand_manifest_link', 3 );
