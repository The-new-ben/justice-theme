<?php
/**
 * TEMPORARY deploy route for the agent-driven pipeline. Lives only for the
 * seconds of one deploy: create as a Code Snippets snippet (scope global,
 * active), POST to it once, verify, DELETE the snippet. Never leave it live.
 *
 * Replace __ZIP_VERSION__ before creating the snippet. The route requires
 * the update_plugins capability: only an authenticated admin (application
 * password) can trigger it.
 *
 * Full runbook: project-control/agent-deploy-pipeline-handbook.md
 */

add_action( 'rest_api_init', function () {
	register_rest_route( 'justicedeploy/v1', '/run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function () {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/misc.php';
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

			$plugin_file = 'justice-core/justice-core.php';
			// Cache-buster dodges GitHub raw's ~5 minute CDN cache.
			$zip = 'https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-core-__ZIP_VERSION__.zip?nlcb=' . time();

			$skin     = new WP_Ajax_Upgrader_Skin();
			$upgrader = new Plugin_Upgrader( $skin );
			$ok       = $upgrader->install( $zip, array( 'overwrite_package' => true ) );

			if ( ! is_plugin_active( $plugin_file ) ) {
				activate_plugin( $plugin_file );
			}

			do_action( 'litespeed_purge_all' );
			if ( function_exists( 'wp_cache_flush' ) ) {
				wp_cache_flush();
			}

			return array(
				'result'   => is_wp_error( $ok ) ? ( 'ERR:' . $ok->get_error_message() ) : var_export( $ok, true ),
				'messages' => $skin->get_upgrade_messages(),
				'active'   => is_plugin_active( $plugin_file ),
			);
		},
	) );
} );
