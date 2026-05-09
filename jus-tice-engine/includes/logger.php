<?php
/**
 * Justice Core Logger
 *
 * Logs all write actions to wp_options for audit trail.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Append a log entry to jte_log option.
 */
function jte_log( string $action, string $message, array $context = array() ): void {
	$log = get_option( 'jte_log', array() );

	$log[] = array(
		'time'    => current_time( 'mysql' ),
		'action'  => $action,
		'message' => $message,
		'context' => $context,
		'user'    => get_current_user_id(),
	);

	// Keep last 200 entries
	if ( count( $log ) > 200 ) {
		$log = array_slice( $log, -200 );
	}

	update_option( 'jte_log', $log, false );
}
