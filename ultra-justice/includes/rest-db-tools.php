<?php
/**
 * Justice Core — REST DB Inspection Tools
 *
 * Routes:
 *   GET /wp-json/ultra-justice/v1/reports/spam
 *   GET /wp-json/ultra-justice/v1/reports/duplicates
 *   GET /wp-json/ultra-justice/v1/reports/users
 *   GET /wp-json/ultra-justice/v1/reports/cron
 *   GET /wp-json/ultra-justice/v1/reports/options-suspect
 *
 * All routes: admin-only. SELECT inspection only. No write.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'uj_register_db_routes' );

function uj_register_db_routes(): void {
	$admin_only = function () {
		return current_user_can( 'manage_options' );
	};

	$routes = array(
		'/reports/spam'            => 'uj_report_spam',
		'/reports/duplicates'      => 'uj_report_duplicates',
		'/reports/users'           => 'uj_report_users',
		'/reports/cron'            => 'uj_report_cron',
		'/reports/options-suspect' => 'uj_report_options',
		'/reports/plugins'         => 'uj_report_plugins',
		'/reports/log'             => 'uj_report_log',
	);

	foreach ( $routes as $path => $callback ) {
		register_rest_route( 'ultra-justice/v1', $path, array(
			'methods'             => 'GET',
			'callback'            => $callback,
			'permission_callback' => $admin_only,
		) );
	}
}

/**
 * Find casino/gambling/gaming content in posts and pages.
 */
function uj_report_spam(): WP_REST_Response {
	global $wpdb;

	$terms = array( 'casino', 'gambling', 'gaming', 'slot', 'poker', 'bet ', 'betting', 'wager', 'lottery', 'jackpot', 'blackjack' );

	$like_clauses = array();
	$params       = array();

	foreach ( $terms as $term ) {
		$like_clauses[] = "( post_title LIKE %s OR post_content LIKE %s OR post_excerpt LIKE %s )";
		$like = '%' . $wpdb->esc_like( $term ) . '%';
		$params[] = $like;
		$params[] = $like;
		$params[] = $like;
	}

	$where = implode( ' OR ', $like_clauses );

	// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
	$sql = $wpdb->prepare(
		"SELECT ID, post_author, post_date, post_modified, post_status, post_type, post_title, post_name
		 FROM {$wpdb->posts}
		 WHERE ( {$where} )
		 AND post_status NOT IN ('auto-draft','trash')
		 ORDER BY post_modified DESC
		 LIMIT 200",
		...$params
	);
	// phpcs:enable

	$rows = $wpdb->get_results( $sql, ARRAY_A );

	// Find which terms matched each row
	$results = array_map( function ( $row ) use ( $terms ) {
		$matched = array();
		$text    = strtolower( $row['post_title'] . ' ' . $row['post_name'] );
		foreach ( $terms as $t ) {
			if ( false !== strpos( $text, strtolower( $t ) ) ) {
				$matched[] = $t;
			}
		}
		$row['matched_terms'] = $matched;
		$row['edit_link']     = admin_url( "post.php?post={$row['ID']}&action=edit" );
		return $row;
	}, $rows );

	return new WP_REST_Response( array(
		'ok'      => true,
		'count'   => count( $results ),
		'rows'    => $results,
		'message' => 'INSPECTION ONLY. No content was changed.',
		'terms'   => $terms,
	) );
}

/**
 * Find duplicate post titles.
 */
function uj_report_duplicates(): WP_REST_Response {
	global $wpdb;

	$rows = $wpdb->get_results(
		"SELECT post_title, post_type, COUNT(*) AS count
		 FROM {$wpdb->posts}
		 WHERE post_status IN ('publish','draft','pending')
		 AND post_type IN ('post','articles','justice_lawyer','page')
		 AND post_title <> ''
		 GROUP BY post_title, post_type
		 HAVING count > 1
		 ORDER BY count DESC
		 LIMIT 100",
		ARRAY_A
	);

	return new WP_REST_Response( array(
		'ok'      => true,
		'count'   => count( $rows ),
		'rows'    => $rows,
		'message' => 'INSPECTION ONLY. No content was changed.',
	) );
}

/**
 * List all WordPress users.
 */
function uj_report_users(): WP_REST_Response {
	global $wpdb;

	$rows = $wpdb->get_results(
		"SELECT ID, user_login, user_email, user_registered, display_name
		 FROM {$wpdb->users}
		 ORDER BY user_registered DESC",
		ARRAY_A
	);

	// Get roles
	$results = array_map( function ( $user ) {
		$u              = get_user_by( 'id', $user['ID'] );
		$user['roles']  = $u ? implode( ', ', $u->roles ) : 'unknown';
		return $user;
	}, $rows );

	return new WP_REST_Response( array(
		'ok'    => true,
		'count' => count( $results ),
		'rows'  => $results,
	) );
}

/**
 * Inspect WP cron jobs — look for suspicious scheduled tasks.
 */
function uj_report_cron(): WP_REST_Response {
	$cron  = _get_cron_array();
	$items = array();

	if ( is_array( $cron ) ) {
		foreach ( $cron as $timestamp => $hooks ) {
			foreach ( $hooks as $hook => $events ) {
				foreach ( $events as $key => $event ) {
					$items[] = array(
						'timestamp' => $timestamp,
						'datetime'  => date( 'Y-m-d H:i:s', $timestamp ),
						'hook'      => $hook,
						'schedule'  => $event['schedule'] ?? 'one-time',
						'args'      => $event['args'] ?? array(),
					);
				}
			}
		}
	}

	// Flag suspicious hooks
	$suspicious_patterns = array( 'import', 'feed', 'rss', 'casino', 'spam', 'inject', 'push' );
	foreach ( $items as &$item ) {
		$item['suspicious'] = false;
		foreach ( $suspicious_patterns as $p ) {
			if ( false !== stripos( $item['hook'], $p ) ) {
				$item['suspicious'] = true;
				break;
			}
		}
	}

	// Sort suspicious first
	usort( $items, fn( $a, $b ) => $b['suspicious'] <=> $a['suspicious'] );

	return new WP_REST_Response( array(
		'ok'    => true,
		'count' => count( $items ),
		'rows'  => $items,
	) );
}

/**
 * Inspect suspicious wp_options entries.
 */
function uj_report_options(): WP_REST_Response {
	global $wpdb;

	$rows = $wpdb->get_results(
		"SELECT option_name, LENGTH(option_value) AS value_size
		 FROM {$wpdb->options}
		 WHERE option_name LIKE '%feed%'
		    OR option_name LIKE '%rss%'
		    OR option_name LIKE '%import%'
		    OR option_name LIKE '%casino%'
		    OR option_name LIKE '%spam%'
		    OR option_name LIKE '%widget%'
		    OR option_name LIKE '%inject%'
		 ORDER BY value_size DESC
		 LIMIT 100",
		ARRAY_A
	);

	return new WP_REST_Response( array(
		'ok'      => true,
		'count'   => count( $rows ),
		'rows'    => $rows,
		'message' => 'INSPECTION ONLY. option_value contents not shown for security.',
	) );
}

/**
 * List active and inactive plugins with their status.
 */
function uj_report_plugins(): WP_REST_Response {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	$all_plugins    = get_plugins();
	$active_plugins = get_option( 'active_plugins', array() );
	$results        = array();

	foreach ( $all_plugins as $file => $data ) {
		$is_active = in_array( $file, $active_plugins, true );
		$results[] = array(
			'file'        => $file,
			'name'        => $data['Name'],
			'version'     => $data['Version'],
			'description' => wp_trim_words( $data['Description'], 15 ),
			'active'      => $is_active,
			'risk'        => str_contains( strtolower( $data['Name'] ), 'justice' ) && ! $is_active
				? 'DUPLICATE_INACTIVE'
				: ( str_contains( strtolower( $data['Name'] ), 'justice' ) ? 'ACTIVE_JUSTICE_PLUGIN' : 'ok' ),
		);
	}

	return new WP_REST_Response( array(
		'ok'    => true,
		'count' => count( $results ),
		'rows'  => $results,
	) );
}

/**
 * Read the internal log.
 */
function uj_report_log(): WP_REST_Response {
	$log = get_option( 'uj_log', array() );

	return new WP_REST_Response( array(
		'ok'    => true,
		'count' => count( $log ),
		'rows'  => array_reverse( $log ),
	) );
}

