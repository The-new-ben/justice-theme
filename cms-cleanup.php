<?php
/**
 * CMS Cleanup Script — Phase 1: Plugin Purge
 *
 * Run this via browser on the live site:
 * https://jus-tice.co.il/wp-content/themes/justice-theme/cms-cleanup.php?key=cleanup_2026_05_17
 *
 * This script:
 * 1. Lists ALL active plugins with their purpose classification
 * 2. Deactivates confirmed-junk plugins (only those marked SAFE TO REMOVE)
 * 3. Does NOT delete plugin files — only deactivates
 * 4. Logs every action taken
 *
 * @package JusticeTheme
 */

// Security gate
if ( ! isset( $_GET['key'] ) || 'cleanup_2026_05_17' !== $_GET['key'] ) {
	die( 'Unauthorized. Append ?key=cleanup_2026_05_17 to run.' );
}

define( 'WP_USE_THEMES', false );

// Walk up from theme dir to find wp-load.php
$wp_load = dirname( __DIR__, 2 ) . '/wp-load.php';
if ( ! file_exists( $wp_load ) ) {
	$wp_load = dirname( __DIR__, 3 ) . '/wp-load.php';
}
if ( ! file_exists( $wp_load ) ) {
	die( 'Cannot find wp-load.php' );
}

require_once $wp_load;

if ( ! current_user_can( 'activate_plugins' ) ) {
	die( 'You must be logged in as admin to run this script.' );
}

header( 'Content-Type: text/plain; charset=utf-8' );

// ========================================================================
// CLASSIFICATION: Every plugin gets a verdict
// ========================================================================

$keep_essential = array(
	'ultra-justice-engine/ultra-justice-engine.php' => 'KEEP — Core Justice plugin (CPTs, taxonomies, REST)',
	'wordpress-seo/wp-seo.php'                     => 'KEEP — Yoast SEO (sitemap, meta, canonical)',
	'advanced-custom-fields-pro/acf.php'            => 'KEEP — ACF Pro (lawyer profile fields)',
	'advanced-custom-fields/acf.php'                => 'KEEP — ACF (lawyer profile fields)',
	'updraftplus/updraftplus.php'                   => 'KEEP — Backup solution',
	'wordfence/wordfence.php'                       => 'KEEP — Security',
	'permalink-manager/permalink-manager.php'       => 'REVIEW — May be needed for URL routing',
	'permalink-manager-pro/permalink-manager.php'   => 'REVIEW — May be needed for URL routing',
);

$safe_to_deactivate = array(
	// Social networking — NOT NEEDED for a legal directory
	'buddypress/bp-loader.php'                      => 'JUNK — Social network engine, not used',
	'buddyboss-platform/bp-loader.php'              => 'JUNK — Social network engine, not used',

	// Forums — NOT NEEDED
	'bbpress/bbpress.php'                           => 'JUNK — Forum engine, not used',

	// Wrong cache for this server (Nginx, not LiteSpeed)
	'litespeed-cache/litespeed-cache.php'            => 'JUNK — Wrong server type (you run Nginx)',

	// Duplicate/redundant CPT tools (Ultra Justice Engine handles this)
	'pods/init.php'                                 => 'JUNK — Duplicate of ACF, causes PHP warnings',
	'pods-alternative-cache/pods-alternative-cache.php' => 'JUNK — Companion to Pods, not needed',
	'custom-post-type-ui/custom-post-type-ui.php'   => 'JUNK — CPTs are code-defined in Ultra Justice Engine',

	// Deactivated SEO/schema plugins that conflict with Yoast
	'schema-and-structured-data-for-wp/structured-data-for-wp.php' => 'JUNK — Conflicts with Yoast schema',
	'flavor/flavor.php'                             => 'JUNK — Unknown/unused SEO plugin',
	'flavflavor/flavor.php'                         => 'JUNK — Unknown/unused',

	// FAQ Schema duplicate (Yoast handles FAQ schema)
	'jetopts/jetopts.php'                           => 'JUNK — Conflicting schema plugin',

	// Health Check (dev tool, not needed in production)
	'health-check/health-check.php'                 => 'JUNK — Dev diagnostic, not needed live',

	// Search & Filter Pro — user explicitly hates it, and it throws PHP 8.4 errors
	// UNCOMMENT ONLY if user confirms they want it removed now:
	// 'search-filter-pro/search-filter-pro.php'    => 'JUNK — Deprecated, PHP 8.4 warnings',
);

// ========================================================================
// PHASE 1: AUDIT — Show what's active
// ========================================================================

$active = get_option( 'active_plugins', array() );

echo "=== CMS CLEANUP AUDIT ===\n";
echo "Date: " . date( 'Y-m-d H:i:s' ) . "\n";
echo "Active plugins: " . count( $active ) . "\n\n";

echo "--- ESSENTIAL (keeping) ---\n";
foreach ( $active as $plugin ) {
	if ( isset( $keep_essential[ $plugin ] ) ) {
		echo "  ✅ {$plugin} — {$keep_essential[$plugin]}\n";
	}
}

echo "\n--- JUNK (will deactivate) ---\n";
$to_deactivate = array();
foreach ( $active as $plugin ) {
	if ( isset( $safe_to_deactivate[ $plugin ] ) ) {
		echo "  🗑️  {$plugin} — {$safe_to_deactivate[$plugin]}\n";
		$to_deactivate[] = $plugin;
	}
}

echo "\n--- UNKNOWN (needs manual review) ---\n";
foreach ( $active as $plugin ) {
	if ( ! isset( $keep_essential[ $plugin ] ) && ! isset( $safe_to_deactivate[ $plugin ] ) ) {
		$data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin, false, false );
		$name = $data['Name'] ?? $plugin;
		echo "  ❓ {$plugin} — \"{$name}\" — MANUAL REVIEW NEEDED\n";
	}
}

// ========================================================================
// PHASE 2: EXECUTE — Only if ?execute=yes is passed
// ========================================================================

if ( isset( $_GET['execute'] ) && 'yes' === $_GET['execute'] ) {
	echo "\n\n=== EXECUTING DEACTIVATION ===\n";

	if ( empty( $to_deactivate ) ) {
		echo "Nothing to deactivate. All junk plugins are already inactive.\n";
	} else {
		foreach ( $to_deactivate as $plugin ) {
			$result = deactivate_plugins( $plugin, false, false );
			if ( is_wp_error( $result ) ) {
				echo "  ❌ FAILED to deactivate {$plugin}: {$result->get_error_message()}\n";
			} else {
				echo "  ✅ DEACTIVATED: {$plugin}\n";
			}
		}

		// Flush rewrite rules after deactivation
		flush_rewrite_rules( true );
		echo "\n✅ Rewrite rules flushed.\n";

		// Clear object cache
		wp_cache_flush();
		echo "✅ Object cache flushed.\n";
	}

	echo "\n=== CLEANUP COMPLETE ===\n";
	echo "Remaining active plugins: " . count( get_option( 'active_plugins', array() ) ) . "\n";
} else {
	echo "\n\n=== DRY RUN COMPLETE ===\n";
	echo "To execute the deactivation, run:\n";
	echo "  ?key=cleanup_2026_05_17&execute=yes\n";
	echo "\nThis will ONLY deactivate the plugins listed under 'JUNK' above.\n";
	echo "No data will be deleted. You can reactivate any plugin at any time.\n";
}

// ========================================================================
// PHASE 3: POST-TYPE AUDIT
// ========================================================================

echo "\n\n=== POST TYPE INVENTORY ===\n";
global $wpdb;
$pt_counts = $wpdb->get_results(
	"SELECT post_type, COUNT(*) as cnt FROM {$wpdb->posts} GROUP BY post_type ORDER BY cnt DESC"
);
foreach ( $pt_counts as $row ) {
	$registered = post_type_exists( $row->post_type ) ? '✅' : '⚠️ ORPHANED';
	echo "  {$row->post_type}: {$row->cnt} posts {$registered}\n";
}

echo "\n=== DONE ===\n";
