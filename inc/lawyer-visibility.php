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
