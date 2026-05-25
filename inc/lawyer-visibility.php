<?php
/**
 * Lawyer Profile Visibility System
 *
 * Business logic for lawyer profile visibility:
 * - admin_profile_visibility: show|hide toggle per profile (admin-only)
 * - profile_status: 'active'|'hidden'|'experimental'|'pending'
 * - Controls: listing archive, single profile, REST API, sitemap
 *
 * Usage:
 *   justice_theme_set_lawyer_visibility( $post_id, 'hidden' );
 *   justice_theme_set_lawyer_visibility( $post_id, 'active' );
 *   justice_theme_lawyer_is_visible( $post_id );
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ============================================================================
// VISIBILITY API
// ============================================================================

/**
 * Check if a lawyer profile is publicly visible.
 * Reads admin_profile_visibility meta (overrides profile_status if set).
 *
 * @param int $post_id Lawyer post ID.
 * @return bool True = show publicly, false = admin only.
 */
function justice_theme_lawyer_is_visible( int $post_id ): bool {
	// Admin and editors always see everything
	if ( current_user_can( 'edit_posts' ) ) {
		return true;
	}

	$post_id = $post_id ?: (int) get_the_ID();
	if ( ! $post_id || 'justice_lawyer' !== get_post_type( $post_id ) ) {
		return false;
	}

	// Check the quick admin toggle first
	$admin_toggle = get_post_meta( $post_id, 'admin_profile_visibility', true );
	if ( 'hide' === $admin_toggle || 'hidden' === $admin_toggle ) {
		return false;
	}
	if ( 'show' === $admin_toggle || 'visible' === $admin_toggle ) {
		// Explicit show — bypass other checks
		return 'publish' === get_post_status( $post_id );
	}

	// Fall through to existing approval gate
	return function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		? justice_theme_lawyer_profile_is_public_approved( $post_id )
		: ( 'publish' === get_post_status( $post_id ) );
}

/**
 * Set the admin visibility toggle for a lawyer profile.
 *
 * @param int    $post_id    Lawyer post ID.
 * @param string $visibility 'show'|'hide'.
 * @return bool
 */
function justice_theme_set_lawyer_visibility( int $post_id, string $visibility ): bool {
	if ( ! in_array( $visibility, array( 'show', 'hide' ), true ) ) {
		return false;
	}
	return (bool) update_post_meta( $post_id, 'admin_profile_visibility', $visibility );
}

// ============================================================================
// ADMIN META BOX — Visibility Toggle
// ============================================================================

/**
 * Register the visibility meta box on justice_lawyer CPT.
 */
function justice_lawyer_visibility_meta_box_register(): void {
	add_meta_box(
		'justice-lawyer-visibility',
		'👁️ הצגת פרופיל (ניראות)',
		'justice_lawyer_visibility_meta_box_render',
		'justice_lawyer',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_lawyer_visibility_meta_box_register' );

/**
 * Render the visibility meta box.
 *
 * @param WP_Post $post Current post object.
 */
function justice_lawyer_visibility_meta_box_render( WP_Post $post ): void {
	$visibility     = get_post_meta( $post->ID, 'admin_profile_visibility', true ) ?: 'auto';
	$profile_status = get_post_meta( $post->ID, 'profile_status', true );
	$subscription   = get_post_meta( $post->ID, 'subscription_status', true );
	$plan           = get_post_meta( $post->ID, 'plan_type', true );
	$is_approved    = function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		? justice_theme_lawyer_profile_is_public_approved( $post->ID )
		: false;

	wp_nonce_field( 'justice_lawyer_visibility_nonce', 'justice_lawyer_visibility_nonce' );
	?>
	<div class="justice-visibility-box" style="font-family:system-ui;font-size:13px;">

		<p style="margin:0 0 10px;">
			<strong>מצב נוכחי:</strong>
			<span style="display:inline-block;padding:2px 8px;border-radius:3px;font-weight:700;background:<?php echo $is_approved ? '#d4edda' : '#f8d7da'; ?>;color:<?php echo $is_approved ? '#155724' : '#721c24'; ?>;">
				<?php echo $is_approved ? '✅ גלוי לציבור' : '🔒 חסום / נסתר'; ?>
			</span>
		</p>

		<p style="margin:0 0 5px;color:#666;font-size:12px;">
			plan: <strong><?php echo esc_html( $plan ?: '—' ); ?></strong> |
			subscription: <strong><?php echo esc_html( $subscription ?: '—' ); ?></strong> |
			status: <strong><?php echo esc_html( $profile_status ?: '—' ); ?></strong>
		</p>

		<hr style="margin:10px 0;">

		<label style="font-weight:700;display:block;margin-bottom:8px;">בקרת ניראות ידנית:</label>

		<label style="display:block;margin-bottom:5px;cursor:pointer;">
			<input type="radio" name="admin_profile_visibility" value="auto" <?php checked( $visibility, 'auto' ); ?>>
			<span>🤖 <strong>אוטומטי</strong> — לפי subscription_status + profile_status</span>
		</label>

		<label style="display:block;margin-bottom:5px;cursor:pointer;background:#d4edda;padding:4px 8px;border-radius:4px;">
			<input type="radio" name="admin_profile_visibility" value="show" <?php checked( $visibility, 'show' ); ?>>
			<span>✅ <strong>הצג תמיד</strong> — גלוי לציבור (גם ללא מנוי)</span>
		</label>

		<label style="display:block;margin-bottom:5px;cursor:pointer;background:#f8d7da;padding:4px 8px;border-radius:4px;">
			<input type="radio" name="admin_profile_visibility" value="hide" <?php checked( $visibility, 'hide' ); ?>>
			<span>🔒 <strong>הסתר</strong> — נסתר מהציבור (נראה לאדמין בלבד)</span>
		</label>

		<p style="margin:10px 0 0;color:#666;font-size:11px;line-height:1.4;">
			<strong>שימוש:</strong><br>
			• <em>אוטומטי</em> = פרופיל גלוי אם subscription_status=active<br>
			• <em>הסתר</em> = מושלם לפרופילים ניסיוניים (ניסיוני = ניהולי בלבד)<br>
			• <em>הצג</em> = לעורכי דין שסוכם איתם בעל-פה, טרם שולמה מנוי
		</p>

	</div>
	<?php
}

/**
 * Save the visibility meta on post save.
 *
 * @param int $post_id Post ID.
 */
function justice_lawyer_visibility_meta_box_save( int $post_id ): void {
	if (
		! isset( $_POST['justice_lawyer_visibility_nonce'] )
		|| ! wp_verify_nonce( sanitize_key( $_POST['justice_lawyer_visibility_nonce'] ), 'justice_lawyer_visibility_nonce' )
		|| defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE
		|| ! current_user_can( 'edit_post', $post_id )
		|| 'justice_lawyer' !== get_post_type( $post_id )
	) {
		return;
	}

	$raw = isset( $_POST['admin_profile_visibility'] )
		? sanitize_text_field( wp_unslash( $_POST['admin_profile_visibility'] ) )
		: 'auto';

	if ( in_array( $raw, array( 'auto', 'show', 'hide' ), true ) ) {
		update_post_meta( $post_id, 'admin_profile_visibility', $raw );
	}
}
add_action( 'save_post', 'justice_lawyer_visibility_meta_box_save' );

// ============================================================================
// ADMIN BULK ACTIONS - Directory Visibility + Sponsored Placement
// ============================================================================

/**
 * Add bulk actions for managing lawyer directory visibility at investor-demo speed.
 *
 * @param array<string,string> $actions Existing actions.
 * @return array<string,string>
 */
function justice_lawyer_bulk_visibility_actions( array $actions ): array {
	$actions['justice_lawyer_visibility_show']      = __( 'Jus-Tice: show in public index', 'justice-theme' );
	$actions['justice_lawyer_visibility_hide']      = __( 'Jus-Tice: hide from public index', 'justice-theme' );
	$actions['justice_lawyer_visibility_auto']      = __( 'Jus-Tice: automatic visibility', 'justice-theme' );
	$actions['justice_lawyer_mark_sponsored']       = __( 'Jus-Tice: mark sponsored/top', 'justice-theme' );
	$actions['justice_lawyer_mark_basic_unclaimed'] = __( 'Jus-Tice: mark basic/unclaimed', 'justice-theme' );

	return $actions;
}
add_filter( 'bulk_actions-edit-justice_lawyer', 'justice_lawyer_bulk_visibility_actions' );

/**
 * Handle the lawyer bulk actions.
 *
 * @param string $redirect_to Redirect URL.
 * @param string $doaction    Bulk action.
 * @param array  $post_ids    Selected post IDs.
 * @return string
 */
function justice_lawyer_handle_bulk_visibility_action( string $redirect_to, string $doaction, array $post_ids ): string {
	$handled_actions = array(
		'justice_lawyer_visibility_show',
		'justice_lawyer_visibility_hide',
		'justice_lawyer_visibility_auto',
		'justice_lawyer_mark_sponsored',
		'justice_lawyer_mark_basic_unclaimed',
	);

	if ( ! in_array( $doaction, $handled_actions, true ) ) {
		return $redirect_to;
	}

	$updated = 0;

	foreach ( $post_ids as $post_id ) {
		$post_id = (int) $post_id;

		if ( ! $post_id || 'justice_lawyer' !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			continue;
		}

		switch ( $doaction ) {
			case 'justice_lawyer_visibility_show':
				update_post_meta( $post_id, 'admin_profile_visibility', 'show' );
				update_post_meta( $post_id, 'profile_status', 'public' );
				break;

			case 'justice_lawyer_visibility_hide':
				update_post_meta( $post_id, 'admin_profile_visibility', 'hide' );
				break;

			case 'justice_lawyer_visibility_auto':
				delete_post_meta( $post_id, 'admin_profile_visibility' );
				break;

			case 'justice_lawyer_mark_sponsored':
				update_post_meta( $post_id, 'admin_profile_visibility', 'show' );
				update_post_meta( $post_id, 'profile_status', 'public' );
				update_post_meta( $post_id, 'plan_type', 'featured' );
				update_post_meta( $post_id, 'subscription_status', 'active' );
				update_post_meta( $post_id, 'priority_score', max( 90, (int) get_post_meta( $post_id, 'priority_score', true ) ) );
				break;

			case 'justice_lawyer_mark_basic_unclaimed':
				update_post_meta( $post_id, 'admin_profile_visibility', 'show' );
				update_post_meta( $post_id, 'profile_status', 'public' );
				update_post_meta( $post_id, 'plan_type', 'free' );
				update_post_meta( $post_id, 'subscription_status', 'inactive' );
				update_post_meta( $post_id, 'priority_score', 0 );
				delete_post_meta( $post_id, 'claimed_by_user_id' );
				break;
		}

		++$updated;
	}

	return add_query_arg(
		array(
			'justice_lawyer_bulk_action'  => sanitize_key( $doaction ),
			'justice_lawyer_bulk_updated' => $updated,
		),
		remove_query_arg(
			array(
				'justice_lawyer_bulk_action',
				'justice_lawyer_bulk_updated',
			),
			$redirect_to
		)
	);
}
add_filter( 'handle_bulk_actions-edit-justice_lawyer', 'justice_lawyer_handle_bulk_visibility_action', 10, 3 );

/**
 * Confirm bulk action results inside wp-admin.
 */
function justice_lawyer_bulk_visibility_admin_notice(): void {
	if ( ! is_admin() || ! isset( $_GET['justice_lawyer_bulk_updated'] ) ) {
		return;
	}

	$updated = (int) $_GET['justice_lawyer_bulk_updated'];
	if ( $updated <= 0 ) {
		return;
	}

	printf(
		'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
		esc_html(
			sprintf(
				/* translators: %d: number of updated lawyer profiles. */
				_n( 'Jus-Tice updated %d lawyer profile.', 'Jus-Tice updated %d lawyer profiles.', $updated, 'justice-theme' ),
				$updated
			)
		)
	);
}
add_action( 'admin_notices', 'justice_lawyer_bulk_visibility_admin_notice' );

// ============================================================================
// ARCHIVE FILTER — Exclude hidden profiles from public listing
// ============================================================================

/**
 * Filter justice_lawyer archive query to exclude hidden profiles.
 * Does not affect wp-admin.
 *
 * @param WP_Query $query The WP Query.
 */
function justice_lawyer_filter_hidden_from_archive( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if (
		! $query->is_post_type_archive( 'justice_lawyer' )
		&& ! $query->is_tax( 'practice-areas' )
		&& ! $query->is_tax( 'city' )
	) {
		return;
	}

	// Exclude profiles with admin_profile_visibility = 'hide'
	$meta_query = (array) ( $query->get( 'meta_query' ) ?: array() );
	$meta_query[] = array(
		'relation' => 'OR',
		array(
			'key'     => 'admin_profile_visibility',
			'value'   => 'hide',
			'compare' => '!=',
		),
		array(
			'key'     => 'admin_profile_visibility',
			'compare' => 'NOT EXISTS',
		),
	);
	$query->set( 'meta_query', $meta_query );
}
add_action( 'pre_get_posts', 'justice_lawyer_filter_hidden_from_archive' );

// ============================================================================
// INITIAL VISIBILITY SETUP — Run once on activation
// ============================================================================

/**
 * Set initial visibility for known experimental profiles.
 * Called on 'init' once, then self-disables.
 */
function justice_lawyer_initial_visibility_setup(): void {
	if ( get_option( 'justice_lawyer_visibility_init_done' ) ) {
		return;
	}

	// Sharon Nahari (ID 19309) = experimental, hide from public
	if ( get_post( 19309 ) ) {
		update_post_meta( 19309, 'admin_profile_visibility', 'hide' );
	}

	// Maya Rotenberg (ID 19130) = active E-E-A-T author, always show
	if ( get_post( 19130 ) ) {
		update_post_meta( 19130, 'admin_profile_visibility', 'show' );
	}

	update_option( 'justice_lawyer_visibility_init_done', '1' );
}
add_action( 'init', 'justice_lawyer_initial_visibility_setup', 99 );
