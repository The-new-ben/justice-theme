<?php
/**
 * Deny unauthenticated REST access to Justice lead records.
 *
 * This guard affects only the core REST routes for the justice_lead post type.
 * Authenticated administrators retain access. Form submission and storage use
 * the existing non-REST workflow and are not changed by this filter.
 */
if ( ! function_exists( 'justice_privacy_deny_public_lead_rest' ) ) {
	function justice_privacy_deny_public_lead_rest( $result, $server, $request ) {
		unset( $server );

		$route = (string) $request->get_route();
		if ( ! preg_match( '#^/wp/v2/justice_lead(?:/|$)#', $route ) ) {
			return $result;
		}

		if ( current_user_can( 'manage_options' ) ) {
			return $result;
		}

		return new WP_Error(
			'rest_no_route',
			'No route was found matching the URL and request method.',
			array( 'status' => 404 )
		);
	}
	add_filter( 'rest_pre_dispatch', 'justice_privacy_deny_public_lead_rest', -9999, 3 );
}
