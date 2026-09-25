<?php
/**
 * uPress Smart Varnish: page lifetime and purge on content change (HAD-284, 25.9.2026).
 *
 * Lifetime. The uPress panel has no lifetime setting for Smart Varnish. Varnish takes the
 * lifetime a response declares (the feed's "max-age=3600" is honored: X-Cacheable "YES", Expires
 * = fetch time + 1 hour) and forces its own short default when a page declares none
 * ("YES:Forced", every HTML page until now). With ~1,800 URLs and modest traffic per URL, 68 of
 * 70 random pages had expired before their next visitor (median first byte 2.2 s cold, 0.07 s
 * cached). Public pages for anonymous visitors now declare 12 hours for the shared cache
 * (s-maxage) while browsers still revalidate on every visit (max-age=0). Logged-in users,
 * search, 404, previews, the WooCommerce cart/checkout/account, and any page that already chose
 * its own Cache-Control are left alone. Public pages carry no form nonces (the lead form posts to
 * admin-post without one), so a long lifetime cannot break a form.
 *
 * Purge. Nothing on the site told Varnish when a page changed: a no-op update of page 24880
 * left its cached copy in place (its
 * Age kept growing), because no uPress cache plugin is installed and the cache plugins that are
 * installed purge only their own stores. The host accepts a per-URL PURGE (verified live), the
 * same request the news engine already sends for a new post. So when a public post is published,
 * updated, unpublished or trashed, its URL (the old one too, when the slug changed) and the home
 * page are purged once, at the end of the request. Our own host only; at most 200 URLs.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_THEME_VARNISH_TTL' ) ) {
	define( 'JUSTICE_THEME_VARNISH_TTL', 43200 );
}

/**
 * The Cache-Control value for this request, or null to leave the response as it is.
 *
 * @param string[]|null $sent Headers already queued (defaults to headers_list()).
 */
function justice_theme_varnish_cache_control( ?array $sent = null ): ?string {
	$method = strtoupper( (string) ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) );
	if ( ! in_array( $method, array( 'GET', 'HEAD' ), true ) || is_admin() || is_user_logged_in()
		|| is_search() || is_404() || is_preview() || is_feed() || is_customize_preview()
		|| ( defined( 'DONOTCACHEPAGE' ) && DONOTCACHEPAGE )
		|| ! ( is_singular() || is_front_page() || is_home() || is_archive() ) ) {
		return null;
	}
	if ( function_exists( 'is_woocommerce' ) && ( is_cart() || is_checkout() || is_account_page() ) ) {
		return null;
	}
	foreach ( null === $sent ? headers_list() : $sent as $header ) {
		if ( 0 === stripos( (string) $header, 'cache-control:' ) ) {
			return null; // WooCommerce, a plugin or the theme already decided (no-cache pages).
		}
	}
	return 'public, max-age=0, s-maxage=' . (int) JUSTICE_THEME_VARNISH_TTL;
}

function justice_theme_varnish_send_cache_control(): void {
	$value = headers_sent() ? null : justice_theme_varnish_cache_control();
	if ( null !== $value ) {
		header( 'Cache-Control: ' . $value );
	}
}
add_action( 'template_redirect', 'justice_theme_varnish_send_cache_control', 99 );

/** Queue one of our own public URLs for a PURGE at shutdown. */
function justice_theme_varnish_queue( string $url ): void {
	$url  = (string) strtok( $url, '#' );
	$home = home_url( '/' );
	if ( '' === $url || 0 !== strpos( $url, $home ) ) {
		return;
	}
	$GLOBALS['justice_theme_varnish_queue'][ $url ] = true;
	if ( ! has_action( 'shutdown', 'justice_theme_varnish_flush' ) ) {
		add_action( 'shutdown', 'justice_theme_varnish_flush', 20 );
	}
}

/** A published, publicly viewable post that is not a revision or an autosave. */
function justice_theme_varnish_is_public( $post ): bool {
	return $post instanceof WP_Post
		&& is_post_type_viewable( $post->post_type )
		&& ! wp_is_post_revision( $post )
		&& ! wp_is_post_autosave( $post );
}

/** Before an update: the URL the post is published at now (a slug change purges it too). */
function justice_theme_varnish_before_update( $post_id ): void {
	$post = get_post( (int) $post_id );
	if ( justice_theme_varnish_is_public( $post ) && 'publish' === $post->post_status ) {
		justice_theme_varnish_queue( (string) get_permalink( $post ) );
	}
}
add_action( 'pre_post_update', 'justice_theme_varnish_before_update', 10, 1 );

/** Publish, update of a published post, unpublish, trash: purge the post URL and the home page. */
function justice_theme_varnish_on_transition( $new_status, $old_status, $post ): void {
	if ( ( 'publish' !== $new_status && 'publish' !== $old_status ) || ! justice_theme_varnish_is_public( $post ) ) {
		return;
	}
	if ( 'publish' === $new_status ) {
		justice_theme_varnish_queue( (string) get_permalink( $post ) );
	}
	justice_theme_varnish_queue( home_url( '/' ) );
}
add_action( 'transition_post_status', 'justice_theme_varnish_on_transition', 10, 3 );

/** Send the queued PURGEs. Short timeout; a failed purge only means the page expires normally. */
function justice_theme_varnish_flush(): void {
	$urls = array_slice( array_keys( (array) ( $GLOBALS['justice_theme_varnish_queue'] ?? array() ) ), 0, 200 );
	$GLOBALS['justice_theme_varnish_queue'] = array();
	foreach ( $urls as $url ) {
		wp_remote_request( $url, array( 'method' => 'PURGE', 'timeout' => 3, 'redirection' => 0 ) );
	}
}
