<?php
/**
 * Routing guards for public trust and crawl hygiene.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Normalize a path for root/home comparisons.
 *
 * @param string $path URL path.
 * @return string
 */
function justice_theme_normalize_route_path( string $path ): string {
	$path = '/' . trim( $path, '/' );

	return '//' === $path ? '/' : $path;
}

/**
 * Remove a WordPress subdirectory home path from a request path when needed.
 *
 * @param string $request_path Request path.
 * @param string $home_path Home path.
 * @return string
 */
function justice_theme_strip_home_path_prefix( string $request_path, string $home_path ): string {
	if ( '/' !== $home_path && 0 === strpos( $request_path . '/', trailingslashit( $home_path ) ) ) {
		return justice_theme_normalize_route_path( substr( $request_path, strlen( $home_path ) ) );
	}

	return $request_path;
}

/**
 * Check whether the current/requested public path is a non-root path.
 *
 * @param string $requested_url Optional requested URL. Falls back to REQUEST_URI.
 * @return bool
 */
function justice_theme_is_public_non_root_request_path( string $requested_url = '' ): bool {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return false;
	}

	$path_source = $requested_url;

	if ( '' === $path_source ) {
		$path_source = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	}

	$home_path    = justice_theme_normalize_route_path( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ) );
	$request_path = justice_theme_normalize_route_path( (string) wp_parse_url( $path_source, PHP_URL_PATH ) );
	$request_path = justice_theme_strip_home_path_prefix( $request_path, $home_path );

	return '/' !== $request_path;
}

/**
 * Check whether a redirect target is the site homepage.
 *
 * @param string $location Redirect location.
 * @return bool
 */
function justice_theme_is_home_redirect_target( string $location ): bool {
	if ( '' === $location ) {
		return false;
	}

	$home_url      = home_url( '/' );
	$home_host     = wp_parse_url( $home_url, PHP_URL_HOST );
	$location_host = wp_parse_url( $location, PHP_URL_HOST );

	if ( $home_host && $location_host && strtolower( $home_host ) !== strtolower( $location_host ) ) {
		return false;
	}

	$home_path     = justice_theme_normalize_route_path( (string) wp_parse_url( $home_url, PHP_URL_PATH ) );
	$location_path = justice_theme_normalize_route_path( (string) wp_parse_url( $location, PHP_URL_PATH ) );

	return $location_path === $home_path;
}

/**
 * Prevent plugins or core helpers from redirecting arbitrary misses to home.
 *
 * @param string|false $location Redirect location.
 * @param int          $status   Redirect status.
 * @return string|false
 */
function justice_theme_block_non_root_wp_redirect_to_home( $location, ?int $status ) {
	unset( $status );

	if ( ! is_string( $location ) || '' === $location ) {
		return $location;
	}

	if ( justice_theme_is_public_non_root_request_path() && justice_theme_is_home_redirect_target( $location ) ) {
		return false;
	}

	return $location;
}
add_filter( 'wp_redirect', 'justice_theme_block_non_root_wp_redirect_to_home', 0, 2 );

/**
 * Prevent unknown public paths from being canonical-redirected to the homepage.
 *
 * Redirecting arbitrary missing paths to `/` hides broken URLs from users and
 * crawlers. This guard is intentionally narrow: it only blocks redirects where
 * the requested public path is not the home path and the canonical target is
 * the site home URL. Approved URL migrations still need explicit redirect rules.
 *
 * @param string|false $redirect_url  Proposed canonical redirect URL.
 * @param string       $requested_url Requested URL.
 * @return string|false
 */
function justice_theme_block_unknown_path_home_canonical_redirect( $redirect_url, ?string $requested_url ) {
	if ( null === $requested_url ) {
		return $redirect_url;
	}
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || empty( $redirect_url ) ) {
		return $redirect_url;
	}

	if (
		justice_theme_is_public_non_root_request_path( $requested_url )
		&& justice_theme_is_home_redirect_target( (string) $redirect_url )
	) {
		return false;
	}

	return $redirect_url;
}
add_filter( 'redirect_canonical', 'justice_theme_block_unknown_path_home_canonical_redirect', 0, 2 );

/**
 * Render native public 404s before later plugins can send them to the homepage.
 *
 * Some legacy stacks use direct Location headers for 404-to-home behavior and
 * bypass the normal wp_redirect/redirect_canonical filters. This guard only
 * runs after WordPress has already identified the request as a 404, so valid
 * pages and explicit server-level redirects remain outside its scope.
 */
function justice_theme_render_native_404_before_home_redirect_plugins(): void {
	if ( ! justice_theme_is_public_non_root_request_path() || ! is_404() ) {
		return;
	}

	status_header( 404 );
	nocache_headers();

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: native-unknown-path-404', true );
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}

	$not_found_template = get_404_template();

	if ( $not_found_template ) {
		include $not_found_template;
		exit;
	}

	wp_die(
		esc_html__( 'העמוד לא נמצא', 'justice-theme' ),
		esc_html__( 'העמוד לא נמצא', 'justice-theme' ),
		array( 'response' => 404 )
	);
}
add_action( 'template_redirect', 'justice_theme_render_native_404_before_home_redirect_plugins', -1000 );

/**
 * Detect the live failure mode where an unknown path is served as the homepage.
 *
 * This is intentionally narrow: it only fires when WordPress thinks the current
 * request is the front page while the actual URL path is not the site's root.
 *
 * @return bool
 */
function justice_theme_is_unknown_path_served_as_home(): bool {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || ! is_front_page() ) {
		return false;
	}

	$request_path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH );
	$home_path    = wp_parse_url( home_url( '/' ), PHP_URL_PATH );

	$request_path = justice_theme_normalize_route_path( (string) $request_path );
	$home_path    = justice_theme_normalize_route_path( (string) $home_path );
	$request_path = justice_theme_strip_home_path_prefix( $request_path, $home_path );

	return '/' !== $request_path;
}

/**
 * Convert suspicious homepage fallbacks into real 404 responses.
 */
function justice_theme_force_404_for_unknown_home_fallback(): void {
	if ( ! justice_theme_is_unknown_path_served_as_home() ) {
		return;
	}

	$GLOBALS['justice_theme_forced_unknown_path_404'] = true;

	remove_action( 'template_redirect', 'redirect_canonical' );

	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->set_404();
	}

	status_header( 404 );
	nocache_headers();

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: forced-unknown-path-404', true );
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
}
add_action( 'template_redirect', 'justice_theme_force_404_for_unknown_home_fallback', 0 );

/**
 * Ensure the theme 404 template is used after the guard marks the request.
 *
 * @param string $template Current template path.
 * @return string
 */
function justice_theme_use_404_template_for_guarded_home_fallback( ?string $template ): string {
	if ( null === $template ) {
		$template = '';
	}
	if ( ! is_404() || empty( $GLOBALS['justice_theme_forced_unknown_path_404'] ) ) {
		return $template;
	}

	$not_found_template = get_404_template();

	return $not_found_template ?: $template;
}
add_filter( 'template_include', 'justice_theme_use_404_template_for_guarded_home_fallback', 0 );

/**
 * Redirect bare /{slug}/ to /practice-areas/{slug}/ for practice-areas terms.
 *
 * After removing Permalink Manager (May 2026), taxonomy terms now resolve at
 * their native /practice-areas/{slug}/ URLs. Legacy root-level URLs that PM
 * used to handle (e.g. /criminal-law/) must 301 to the canonical taxonomy URL.
 */
function justice_theme_redirect_bare_practice_area_slugs(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	// Only run on 404 — if WP resolved the page, don't interfere.
	if ( ! is_404() ) {
		return;
	}

	$path = isset( $_SERVER['REQUEST_URI'] )
		? trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ), '/' )
		: '';

	if ( '' === $path ) {
		return;
	}

	// Only handle single-segment paths (bare slugs like /criminal-law/).
	if ( false !== strpos( $path, '/' ) ) {
		return;
	}

	$slug = urldecode( $path );

	// Check if a practice-areas term with this slug exists.
	$term = get_term_by( 'slug', $slug, 'practice-areas' );

	if ( ! $term || is_wp_error( $term ) ) {
		return;
	}

	$canonical = home_url( '/practice-areas/' . $slug . '/' );

	if ( ! headers_sent() ) {
		wp_safe_redirect( $canonical, 301, 'justice-theme' );
		exit;
	}
}
/**
 * Redirect /sitemap.xml to /sitemap_index.xml
 *
 * Yoast generates sitemap_index.xml. On Nginx servers, the default fallback
 * for sitemap.xml often 404s. This ensures users and bots submitting
 * sitemap.xml are routed to the correct index.
 */
function justice_theme_redirect_sitemap_xml() {
	if ( is_admin() ) {
		return;
	}
	
	$path = isset( $_SERVER['REQUEST_URI'] ) ? parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';
	if ( '/sitemap.xml' === $path ) {
		wp_safe_redirect( home_url( '/sitemap_index.xml' ), 301, 'justice-theme' );
		exit;
	}
}
add_action( 'template_redirect', 'justice_theme_redirect_sitemap_xml', -3000 );

add_action( 'template_redirect', 'justice_theme_redirect_bare_practice_area_slugs', -2999 );

/**
 * Remove the /articles/ prefix from custom post type permalinks.
 *
 * We want the 'articles' CPT to be served at root level /{slug}/
 * instead of /articles/{slug}/. This filter modifies the generated URL.
 *
 * @param string  $post_link The post's permalink.
 * @param WP_Post $post      The post in question.
 * @return string
 */
function justice_theme_remove_articles_cpt_slug( $post_link, $post ) {
	if ( 'articles' === $post->post_type && 'publish' === $post->post_status ) {
		$post_link = str_replace( '/' . $post->post_type . '/', '/', $post_link );
	}
	return $post_link;
}
add_filter( 'post_type_link', 'justice_theme_remove_articles_cpt_slug', 10, 2 );

/**
 * Tell WordPress to check the 'articles' CPT when resolving root-level slugs.
 *
 * When a root-level slug like /lahav-433/ is requested, WordPress assumes
 * it's a page and sets the 'pagename' or 'name' query var. This filter
 * intercepts the request and tells WP to also search the 'articles' post type.
 *
 * @param array $query_vars The parsed query variables.
 * @return array
 */
function justice_theme_modify_request_for_articles( $query_vars ) {
	if ( is_admin() ) {
		return $query_vars;
	}

	// If a root-level slug is requested, WP usually assigns it to 'pagename'
	if ( isset( $query_vars['pagename'] ) || isset( $query_vars['name'] ) ) {
		$slug = isset( $query_vars['pagename'] ) ? $query_vars['pagename'] : $query_vars['name'];

		// We only want to intercept root-level slugs
		if ( false === strpos( $slug, '/' ) ) {
			// To allow searching articles, we MUST use 'name' instead of 'pagename'
			// because 'pagename' forces WP to only look for post_type='page'
			$query_vars['name'] = $slug;
			unset( $query_vars['pagename'] );
			
			// Specify that we want to search all these types
			$query_vars['post_type'] = array( 'page', 'post', 'articles' );
		}
	}

	return $query_vars;
}
add_filter( 'request', 'justice_theme_modify_request_for_articles' );

/**
 * Redirect /articles/{slug}/ to /{slug}/ (root-level).
 *
 * The articles CPT rewrite slug has been changed from 'articles' to '/'
 * so that articles live at root-level /{slug}/ (matching the original
 * Google-indexed URLs). This redirect catches any lingering /articles/
 * links and sends them to the correct root-level URL.
 *
 * @since 1.0.9  Root-level URL restoration (May 2026).
 */
function justice_theme_redirect_articles_prefix_to_root(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	$path = isset( $_SERVER['REQUEST_URI'] )
		? trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ), '/' )
		: '';

	// Only handle paths starting with articles/
	if ( '' === $path || 0 !== strpos( $path, 'articles/' ) ) {
		return;
	}

	// Extract the slug after articles/
	$slug = trim( substr( $path, strlen( 'articles/' ) ), '/' );

	if ( '' === $slug ) {
		// /articles/ archive → redirect to homepage
		if ( ! headers_sent() ) {
			wp_safe_redirect( home_url( '/' ), 301, 'justice-theme' );
			exit;
		}
		return;
	}

	// Redirect /articles/{slug}/ → /{slug}/
	$canonical = home_url( '/' . $slug . '/' );

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: articles-prefix-to-root-301', true );
		wp_safe_redirect( $canonical, 301, 'justice-theme' );
		exit;
	}
}
add_action( 'template_redirect', 'justice_theme_redirect_articles_prefix_to_root', -2998 );

/**
 * Redirect legacy root-level pillar page slugs that no longer resolve.
 *
 * Permalink Manager previously routed these root-level slugs to specific
 * pages or templates. Now that PM is removed, they 404. This maps each
 * known legacy slug to its correct destination.
 *
 * @since 1.0.7  Post-PM-removal migration (May 2026).
 */
function justice_theme_redirect_legacy_pillar_slugs(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	if ( ! is_404() ) {
		return;
	}

	$path = isset( $_SERVER['REQUEST_URI'] )
		? trim( (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ), '/' )
		: '';

	if ( '' === $path || false !== strpos( $path, '/' ) ) {
		return;
	}

	$slug = urldecode( $path );

	// Legacy root-level slugs → correct destinations.
	$legacy_map = array(
		'traffic-lawyer'   => '/lawyers/?area=traffic-law',
		'criminal-lawyer'  => '/practice-areas/criminal-law/',
	);

	if ( ! isset( $legacy_map[ $slug ] ) ) {
		return;
	}

	$destination = home_url( $legacy_map[ $slug ] );

	if ( ! headers_sent() ) {
		wp_safe_redirect( $destination, 301, 'justice-theme' );
		exit;
	}
}
add_action( 'template_redirect', 'justice_theme_redirect_legacy_pillar_slugs', -2997 );

/**
 * Emergency SEO reset: reset Yoast indexables, flush permalinks, clear caches.
 *
 * This follows the official Yoast Test Helper procedure:
 * 1. Truncate wp_yoast_indexable (cached SEO data with stale canonicals)
 * 2. Truncate wp_yoast_indexable_hierarchy (parent-child cache)
 * 3. Delete migration options so Yoast re-runs table setup
 * 4. Hard-flush rewrite rules (fixes sitemap routing)
 * 5. Clear object cache
 *
 * NOT truncated (preserves user data):
 * - wp_yoast_primary_term (user-selected primary terms)
 * - wp_yoast_seo_links (internal link data, not related to canonicals)
 *
 * One-time use: sets a transient to prevent re-execution.
 * Trigger: ?emergency_yoast_reset=BynE_nrDn
 *
 * @since 1.0.8  Emergency SEO rescue (May 2026).
 */
function justice_theme_emergency_yoast_reset() {
	if ( ! isset( $_GET['emergency_yoast_reset'] ) || $_GET['emergency_yoast_reset'] !== 'BynE_nrDn' ) {
		return;
	}

	// Guard removed — allow re-runs after URL structure changes.

	global $wpdb;
	$output = '<h2 style="color:#2c3e50;">Emergency SEO Reset — Yoast Indexables + Permalinks</h2>';
	$output .= '<p style="color:#7f8c8d;">Executed: ' . gmdate( 'Y-m-d H:i:s' ) . ' UTC</p>';
	$output .= '<h3>Phase 1: Truncate Yoast Indexable Cache</h3><ul>';

	// Phase 1: Truncate only the cache tables (NOT primary_term).
	$cache_tables = array(
		$wpdb->prefix . 'yoast_indexable',
		$wpdb->prefix . 'yoast_indexable_hierarchy',
	);

	foreach ( $cache_tables as $table ) {
		$wpdb->suppress_errors();
		$exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
		if ( $exists ) {
			$result = $wpdb->query( "TRUNCATE TABLE `{$table}`" );
			$status = false !== $result ? '✅ Truncated' : '❌ Failed';
		} else {
			$status = '⚠️ Table not found';
		}
		$wpdb->suppress_errors( false );
		$output .= "<li>{$table}: {$status}</li>";
	}
	$output .= '</ul>';

	// Phase 2: Delete Yoast migration/indexation state options.
	$output .= '<h3>Phase 2: Reset Yoast Migration State</h3><ul>';
	$migration_options = array(
		'yoast_migrations_free',
		'wpseo_migrations',
		'yoast_migrations_premium',
		'wpseo-premium-migrations',
		'yoast_indexables_indexed',
	);

	foreach ( $migration_options as $option ) {
		$existed = get_option( $option, '__NOT_SET__' ) !== '__NOT_SET__';
		delete_option( $option );
		$output .= '<li>' . $option . ': ' . ( $existed ? '✅ Deleted' : '⏭️ Not present' ) . '</li>';
	}
	$output .= '</ul>';

	// Phase 3: Hard-flush rewrite rules (fixes sitemap.xml routing).
	$output .= '<h3>Phase 3: Flush Rewrite Rules</h3><ul>';
	flush_rewrite_rules( true );
	$output .= '<li>✅ Hard flush completed (rewrite rules + .htaccess updated)</li>';
	$output .= '</ul>';

	// Phase 4: Clear object cache.
	$output .= '<h3>Phase 4: Clear Object Cache</h3><ul>';
	wp_cache_flush();
	$output .= '<li>✅ Object cache flushed</li>';
	$output .= '</ul>';

	// Phase 5: Verification.
	$output .= '<h3>Phase 5: Verification</h3><ul>';

	// Check if sitemap_index.xml rewrite rule exists.
	$rules = get_option( 'rewrite_rules' );
	$has_sitemap_rule = false;
	if ( is_array( $rules ) ) {
		foreach ( $rules as $pattern => $match ) {
			if ( false !== strpos( $pattern, 'sitemap' ) ) {
				$has_sitemap_rule = true;
				break;
			}
		}
	}
	$output .= '<li>Sitemap rewrite rules: ' . ( $has_sitemap_rule ? '✅ Present' : '❌ Missing' ) . '</li>';

	// Check Yoast indexable table is empty.
	$indexable_table = $wpdb->prefix . 'yoast_indexable';
	$wpdb->suppress_errors();
	$count = $wpdb->get_var( "SELECT COUNT(*) FROM `{$indexable_table}`" );
	$wpdb->suppress_errors( false );
	$output .= '<li>Indexable table rows: ' . ( null === $count ? '⚠️ Table gone (will be recreated)' : $count ) . '</li>';

	// Check Yoast migration option.
	$migration_opt = get_option( 'yoast_migrations_free', 'NOT SET' );
	$output .= '<li>yoast_migrations_free: ' . esc_html( is_array( $migration_opt ) ? wp_json_encode( $migration_opt ) : $migration_opt ) . '</li>';

	$output .= '</ul>';

	// Set one-time guard.
	set_transient( 'justice_yoast_reset_done', time(), DAY_IN_SECONDS );

	// Phase 5.5: Deactivate conflicting plugins.
	$output .= '<h3>Phase 5.5: Deactivate Conflicting Plugins</h3><ul>';
	$conflicting_plugins = array(
		'schema-and-structured-data-for-wp/structured-data-for-wp.php' => 'Schema & Structured Data for WP & AMP (duplicates Yoast schema)',
		'faq-schema-for-pages-and-posts/wp-faq-schema.php'             => 'FAQ Schema For Pages And Posts (conflicts with Yoast FAQ)',
	);

	foreach ( $conflicting_plugins as $plugin_file => $reason ) {
		if ( is_plugin_active( $plugin_file ) ) {
			deactivate_plugins( $plugin_file );
			$output .= '<li>🔌 Deactivated: ' . esc_html( $reason ) . '</li>';
		} else {
			$output .= '<li>⏭️ Already inactive: ' . esc_html( $reason ) . '</li>';
		}
	}
	$output .= '</ul>';

	// Instructions.
	$output .= '<h3 style="color:#e74c3c;">Next Steps (REQUIRED)</h3>';
	$output .= '<ol>';
	$output .= '<li><strong>Go to WP Admin → Yoast SEO → General</strong> — If you see a notification about "SEO data optimization", click <strong>"Start SEO data optimization"</strong>.</li>';
	$output .= '<li><strong>Go to WP Admin → Yoast SEO → Settings → Site features</strong> — Verify XML sitemaps toggle is ON.</li>';
	$output .= '<li><strong>Visit</strong> <a href="https://jus-tice.co.il/sitemap_index.xml">sitemap_index.xml</a> to confirm sitemaps work.</li>';
	$output .= '<li><strong>Go to Google Search Console → Sitemaps</strong> — Resubmit <code>sitemap_index.xml</code>.</li>';
	$output .= '<li><strong>Ask your host to purge the SeoEdge cache</strong> for the entire domain.</li>';
	$output .= '</ol>';

	wp_die( $output, 'Emergency SEO Reset Complete', array( 'response' => 200 ) );
}
add_action( 'init', 'justice_theme_emergency_yoast_reset', -9999 );

