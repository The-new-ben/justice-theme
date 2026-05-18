<?php
/**
 * Bridge WooCommerce Subscriptions ↔ justice_lawyer profile.
 *
 * When a lawyer's subscription becomes active/cancelled/on-hold/expired we
 * mirror that state onto their `justice_lawyer` post meta (`subscription_status`,
 * `plan_type`, `subscription_id`). This is what powers:
 *
 *   - the "first value" activation flip (active sub == first commercial value),
 *   - lead-routing eligibility (only active subs in their tier receive leads),
 *   - the dashboard payment block ("active" instead of "not active yet").
 *
 * The bridge is a no-op when WooCommerce Subscriptions is not installed, so the
 * theme keeps working in environments without commerce.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve the WooCommerce-product-id → plan_key mapping (reverse of the admin
 * setting). Cached statically per request.
 *
 * @return array<int,string>  product_id => plan_key
 */
function justice_theme_subscription_product_to_plan_map(): array {
	static $cache = null;
	if ( null !== $cache ) {
		return $cache;
	}

	$mapping = (array) get_option( JUSTICE_LAWYER_PLAN_PRODUCT_OPTION, array() );
	$reverse = array();

	foreach ( $mapping as $plan_key => $product_id ) {
		$product_id = (int) $product_id;
		if ( $product_id > 0 ) {
			$reverse[ $product_id ] = (string) $plan_key;
		}
	}

	$cache = $reverse;
	return $cache;
}

/**
 * Given a WC subscription object, return the matching Jus-Tice plan key,
 * or '' if none of its line-items map to a known plan.
 *
 * @param \WC_Subscription $subscription
 */
function justice_theme_resolve_subscription_plan_key( $subscription ): string {
	if ( ! is_object( $subscription ) || ! method_exists( $subscription, 'get_items' ) ) {
		return '';
	}

	$map = justice_theme_subscription_product_to_plan_map();
	if ( empty( $map ) ) {
		return '';
	}

	foreach ( $subscription->get_items() as $item ) {
		if ( ! is_object( $item ) || ! method_exists( $item, 'get_product_id' ) ) {
			continue;
		}
		$product_id = (int) $item->get_product_id();
		if ( isset( $map[ $product_id ] ) ) {
			return $map[ $product_id ];
		}
		// Variation case.
		if ( method_exists( $item, 'get_variation_id' ) ) {
			$variation_id = (int) $item->get_variation_id();
			if ( $variation_id && isset( $map[ $variation_id ] ) ) {
				return $map[ $variation_id ];
			}
		}
	}

	return '';
}

/**
 * Find the justice_lawyer profile claimed by a WP user id.
 * Returns 0 if no profile is linked yet.
 */
function justice_theme_lawyer_profile_for_user( int $user_id ): int {
	if ( $user_id <= 0 || ! post_type_exists( 'justice_lawyer' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			array(
				'key'   => 'claimed_by_user_id',
				'value' => (string) $user_id,
			),
		),
	) );

	return $query->posts ? (int) $query->posts[0] : 0;
}

/**
 * Map a WooCommerce subscription status string to the Jus-Tice
 * `subscription_status` vocabulary stored on the lawyer profile.
 */
function justice_theme_normalize_subscription_status( string $wc_status ): string {
	switch ( $wc_status ) {
		case 'active':
			return 'active';
		case 'on-hold':
			return 'on_hold';
		case 'pending-cancel':
			return 'pending_cancel';
		case 'cancelled':
			return 'cancelled';
		case 'expired':
			return 'expired';
		case 'pending':
			return 'pending';
		default:
			return 'pending';
	}
}

/**
 * Safety net: if a paying user has no linked justice_lawyer profile yet
 * (they reached checkout outside the normal registration flow), create a
 * minimal draft profile from their WooCommerce customer data and link it.
 *
 * The profile is created as DRAFT and tagged source_type=woocommerce_checkout
 * so the owner sees it in the Lawyer Onboarding queue and reviews identity
 * before publishing. Returns the new profile id, or 0 on failure.
 */
function justice_theme_create_lawyer_profile_from_wc_customer( int $user_id, $subscription = null ): int {
	if ( $user_id <= 0 || ! post_type_exists( 'justice_lawyer' ) ) {
		return 0;
	}

	$user = get_user_by( 'id', $user_id );
	if ( ! $user ) {
		return 0;
	}

	$name = trim( (string) $user->display_name );
	if ( '' === $name ) {
		$name = trim( $user->first_name . ' ' . $user->last_name );
	}
	if ( '' === $name && is_object( $subscription ) && method_exists( $subscription, 'get_billing_first_name' ) ) {
		$name = trim( $subscription->get_billing_first_name() . ' ' . $subscription->get_billing_last_name() );
	}
	if ( '' === $name ) {
		$name = (string) $user->user_email;
	}

	$phone = '';
	if ( is_object( $subscription ) && method_exists( $subscription, 'get_billing_phone' ) ) {
		$phone = (string) $subscription->get_billing_phone();
	}

	$plan_key = is_object( $subscription ) ? justice_theme_resolve_subscription_plan_key( $subscription ) : '';
	if ( '' === $plan_key ) {
		$plan_key = 'pro';
	}

	$post_id = wp_insert_post( array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'draft',
		'post_title'  => $name,
	) );

	if ( ! $post_id || is_wp_error( $post_id ) ) {
		return 0;
	}

	$meta = array(
		'lawyer_full_name'      => $name,
		'email'                 => (string) $user->user_email,
		'phone'                 => $phone,
		'plan_type'             => $plan_key,
		'subscription_status'   => 'pending',
		'verification_status'   => 'pending',
		'profile_status'        => 'pending',
		'activation_status'     => 'registered',
		'first_value_at'        => '',
		'activation_owner_note' => '',
		'claimed_by_user_id'    => $user_id,
		'source_type'           => 'woocommerce_checkout',
		'lead_routing_enabled'  => false,
		'internal_notes'        => 'Profile auto-created by WooCommerce checkout safety-net. Owner must verify identity, license, and content before publishing.',
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log(
			'subscription_safety_net',
			sprintf( 'Auto-created draft profile #%d for paying user #%d (plan=%s). REVIEW REQUIRED.', $post_id, $user_id, $plan_key )
		);
	}

	// Notify owner so the new orphan-rescued profile gets immediate attention.
	$admin_email = get_option( 'admin_email' );
	if ( $admin_email && is_email( $admin_email ) ) {
		wp_mail(
			$admin_email,
			'[Jus-Tice] Paying lawyer needs profile review',
			sprintf(
				"A paying lawyer subscribed without going through registration first. A draft profile was auto-created from their WooCommerce data and needs review.\n\nName: %s\nEmail: %s\nPhone: %s\nPlan: %s\n\nReview: %s",
				$name,
				$user->user_email,
				$phone ?: '-',
				$plan_key,
				admin_url( 'post.php?post=' . $post_id . '&action=edit' )
			)
		);
	}

	return (int) $post_id;
}

/**
 * Core sync: copy a subscription's state onto the linked lawyer profile.
 * Safe to call repeatedly (idempotent).
 *
 * @param \WC_Subscription $subscription
 */
function justice_theme_sync_subscription_to_lawyer( $subscription ): void {
	if ( ! is_object( $subscription ) || ! method_exists( $subscription, 'get_user_id' ) ) {
		return;
	}

	$user_id = (int) $subscription->get_user_id();
	if ( $user_id <= 0 ) {
		return;
	}

	$profile_id = justice_theme_lawyer_profile_for_user( $user_id );

	// Safety net: paying user with no linked profile → auto-create a draft so
	// the bridge has something to write to and the owner sees the orphan in
	// the onboarding queue.
	if ( ! $profile_id ) {
		$profile_id = justice_theme_create_lawyer_profile_from_wc_customer( $user_id, $subscription );
	}

	if ( ! $profile_id ) {
		return;
	}

	$wc_status   = method_exists( $subscription, 'get_status' ) ? (string) $subscription->get_status() : 'pending';
	$plan_key    = justice_theme_resolve_subscription_plan_key( $subscription );
	$norm_status = justice_theme_normalize_subscription_status( $wc_status );
	$sub_id      = method_exists( $subscription, 'get_id' ) ? (int) $subscription->get_id() : 0;

	update_post_meta( $profile_id, 'subscription_status', $norm_status );
	update_post_meta( $profile_id, 'subscription_id', $sub_id );

	if ( $plan_key ) {
		update_post_meta( $profile_id, 'plan_type', $plan_key );
	}

	// First-value flip: the first time the sub becomes active, stamp the
	// activation milestone so the owner dashboard can react.
	if ( 'active' === $norm_status ) {
		$existing_first_value = (string) get_post_meta( $profile_id, 'first_value_at', true );
		if ( '' === $existing_first_value ) {
			update_post_meta( $profile_id, 'first_value_at', current_time( 'mysql' ) );
		}
		$activation_status = (string) get_post_meta( $profile_id, 'activation_status', true );
		if ( '' === $activation_status || 'registered' === $activation_status || 'profile_ready' === $activation_status ) {
			update_post_meta( $profile_id, 'activation_status', 'first_value' );
		}
		// Lead routing is enabled by default for paying tiers above pro.
		if ( in_array( $plan_key, array( 'lead_partner', 'full_service' ), true ) ) {
			update_post_meta( $profile_id, 'lead_routing_enabled', '1' );
		}
	}

	if ( in_array( $norm_status, array( 'cancelled', 'expired' ), true ) ) {
		// Stop new leads when the sub ends. The profile itself is NOT
		// unpublished — visibility decisions stay with the owner.
		update_post_meta( $profile_id, 'lead_routing_enabled', '0' );
	}

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note(
			$profile_id,
			sprintf(
				'Subscription #%d state synced: wc_status=%s, plan_key=%s, normalized=%s.',
				$sub_id,
				$wc_status,
				$plan_key ?: '(unmapped)',
				$norm_status
			)
		);
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log(
			'subscription_sync',
			sprintf( 'Subscription %d → lawyer %d: %s (%s)', $sub_id, $profile_id, $norm_status, $plan_key ?: '-' )
		);
	}
}

/**
 * Hook: WC Subscriptions fires this whenever a subscription status changes.
 * Signature varies slightly between versions; we accept the safe shape.
 *
 * @param \WC_Subscription $subscription
 * @param string           $new_status
 * @param string           $old_status
 */
function justice_theme_on_subscription_status_updated( $subscription, $new_status = '', $old_status = '' ): void {
	unset( $new_status, $old_status );
	justice_theme_sync_subscription_to_lawyer( $subscription );
}
add_action( 'woocommerce_subscription_status_updated', 'justice_theme_on_subscription_status_updated', 10, 3 );

/**
 * Hook: a brand-new subscription is created (after checkout). We sync
 * immediately so the lawyer dashboard reflects the pending-active state.
 *
 * @param \WC_Subscription $subscription
 */
function justice_theme_on_subscription_created( $subscription ): void {
	justice_theme_sync_subscription_to_lawyer( $subscription );
}
add_action( 'woocommerce_checkout_subscription_created', 'justice_theme_on_subscription_created', 10, 1 );
