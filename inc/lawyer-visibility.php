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

/**
 * Return owner-facing fact review statuses for lawyer profile facts.
 *
 * @return array<string,string>
 */
function justice_lawyer_fact_review_status_options(): array {
	return array(
		'pending'         => __( 'Pending fact review', 'justice-theme' ),
		'source_checked'  => __( 'Source checked', 'justice-theme' ),
		'owner_approved'  => __( 'Owner approved', 'justice-theme' ),
		'lawyer_approved' => __( 'Lawyer approved', 'justice-theme' ),
		'approved'        => __( 'Approved', 'justice-theme' ),
		'hold'            => __( 'Hold / do not promote', 'justice-theme' ),
		'rejected'        => __( 'Rejected / remove claims', 'justice-theme' ),
	);
}

/**
 * Normalize the lawyer fact review status.
 *
 * @param string $status Raw status value.
 * @return string
 */
function justice_lawyer_normalize_fact_review_status( string $status ): string {
	$status  = sanitize_key( $status );
	$options = justice_lawyer_fact_review_status_options();

	return isset( $options[ $status ] ) ? $status : 'pending';
}

/**
 * Check if a lawyer profile's free-form facts are approved for public display.
 *
 * @param string $status Fact review status.
 * @return bool
 */
function justice_lawyer_fact_review_status_is_approved( string $status ): bool {
	return in_array(
		justice_lawyer_normalize_fact_review_status( $status ),
		array( 'approved', 'source_checked', 'owner_approved', 'lawyer_approved' ),
		true
	);
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
	$fact_status    = justice_lawyer_normalize_fact_review_status( (string) get_post_meta( $post->ID, 'profile_fact_review_status', true ) );
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

		<hr style="margin:12px 0;">

		<label for="profile_fact_review_status" style="font-weight:700;display:block;margin-bottom:6px;">Fact review for premium profile facts:</label>
		<select id="profile_fact_review_status" name="profile_fact_review_status" style="width:100%;max-width:100%;">
			<?php foreach ( justice_lawyer_fact_review_status_options() as $status_value => $status_label ) : ?>
				<option value="<?php echo esc_attr( $status_value ); ?>" <?php selected( $fact_status, $status_value ); ?>>
					<?php echo esc_html( $status_label ); ?>
				</option>
			<?php endforeach; ?>
		</select>

		<p style="margin:8px 0 0;color:#646970;font-size:11px;line-height:1.4;">
			Only source checked, owner approved, lawyer approved, or approved unlock free-form biography facts, credentials, review panels and premium mini-site marketing on fact-gated profiles. Leave pending/hold until sources or lawyer approval are real.
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

	$fact_status = isset( $_POST['profile_fact_review_status'] )
		? justice_lawyer_normalize_fact_review_status( (string) wp_unslash( $_POST['profile_fact_review_status'] ) )
		: 'pending';

	update_post_meta( $post_id, 'profile_fact_review_status', $fact_status );
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
	$actions['justice_lawyer_facts_source_checked'] = __( 'Jus-Tice: facts source checked', 'justice-theme' );
	$actions['justice_lawyer_facts_hold']           = __( 'Jus-Tice: hold facts/promotion', 'justice-theme' );

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
		'justice_lawyer_facts_source_checked',
		'justice_lawyer_facts_hold',
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

			case 'justice_lawyer_facts_source_checked':
				update_post_meta( $post_id, 'profile_fact_review_status', 'source_checked' );
				break;

			case 'justice_lawyer_facts_hold':
				update_post_meta( $post_id, 'profile_fact_review_status', 'hold' );
				update_post_meta( $post_id, 'admin_profile_visibility', 'hide' );
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
// OWNER ADMIN LIST CONTROLS - Fast filtering for indexed/public/sponsored cards
// ============================================================================

/**
 * Render a compact admin badge.
 *
 * @param string $label Badge label.
 * @param string $background Background color.
 * @param string $color Text color.
 */
function justice_lawyer_admin_badge( string $label, string $background = '#f0f0f1', string $color = '#1d2327' ): void {
	printf(
		'<span style="display:inline-block;margin:0 4px 4px 0;padding:2px 7px;border-radius:999px;background:%1$s;color:%2$s;font-size:11px;font-weight:700;line-height:1.7;white-space:nowrap;">%3$s</span>',
		esc_attr( $background ),
		esc_attr( $color ),
		esc_html( $label )
	);
}

/**
 * Detect the sensitive Maya Rotenberg profile identity.
 *
 * @param int $post_id Lawyer profile post ID.
 * @return bool
 */
function justice_lawyer_owner_is_maya_profile( int $post_id ): bool {
	$slug  = (string) get_post_field( 'post_name', $post_id );
	$title = get_the_title( $post_id );

	return 'advocate-maya-rotenberg' === $slug
		|| (
			false !== mb_strpos( $title, rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
			&& false !== mb_strpos( $title, rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
		);
}

/**
 * Build an owner-facing trust checklist for a lawyer profile.
 *
 * @param int $post_id Lawyer profile post ID.
 * @return array{issues:array<string,string>,signals:array<string,string>,level:string}
 */
function justice_lawyer_owner_profile_trust_findings( int $post_id ): array {
	$source_type       = strtolower( (string) get_post_meta( $post_id, 'source_type', true ) );
	$source_url        = (string) get_post_meta( $post_id, 'source_url', true );
	$profile_status    = strtolower( (string) get_post_meta( $post_id, 'profile_status', true ) );
	$verification      = strtolower( (string) get_post_meta( $post_id, 'verification_status', true ) );
	$subscription      = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );
	$plan              = strtolower( (string) get_post_meta( $post_id, 'plan_type', true ) );
	$claimed_user_id   = (int) get_post_meta( $post_id, 'claimed_by_user_id', true );
	$internal_notes    = strtolower( (string) get_post_meta( $post_id, 'internal_notes', true ) );
	$credentials       = trim( (string) get_post_meta( $post_id, 'profile_credentials', true ) );
	$public_sources    = trim( (string) get_post_meta( $post_id, 'profile_public_sources', true ) );
	$source_summary    = trim( (string) get_post_meta( $post_id, 'profile_source_summary', true ) );
	$review_count      = (int) get_post_meta( $post_id, 'review_count', true );
	$average_rating    = (float) get_post_meta( $post_id, 'average_rating', true );
	$reviews_enabled   = in_array( strtolower( (string) get_post_meta( $post_id, 'review_display_enabled', true ) ), array( '1', 'yes', 'true', 'enabled', 'approved' ), true );
	$fact_status       = justice_lawyer_normalize_fact_review_status( (string) get_post_meta( $post_id, 'profile_fact_review_status', true ) );
	$is_maya_profile   = justice_lawyer_owner_is_maya_profile( $post_id );
	$is_verified       = 'verified' === $verification;
	$is_paid           = 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
	$is_public_basic   = 0 === $claimed_user_id
		&& ! $is_verified
		&& in_array( $source_type, array( 'public_index', 'import' ), true )
		&& in_array( $profile_status, array( 'public', 'published' ), true );
	$source_ok         = '' !== $source_url && ! in_array( $source_type, array( '', 'seed' ), true );
	$notes_seed_like   = false !== strpos( $internal_notes, 'seed' )
		|| false !== strpos( $internal_notes, 'demo' )
		|| false !== strpos( $internal_notes, 'test data' )
		|| false !== strpos( $internal_notes, 'fake' )
		|| false !== strpos( $internal_notes, 'fictional' );
	$media_is_safe     = has_post_thumbnail( $post_id )
		&& ! $is_maya_profile
		&& (
			$is_paid
			|| $is_verified
			|| in_array( $source_type, array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true )
		);
	$issues            = array();
	$signals           = array();

	if ( $is_maya_profile ) {
		$issues['maya_review'] = __( 'Maya profile: source-check facts/media before promotion', 'justice-theme' );
	}

	if (
		! justice_lawyer_fact_review_status_is_approved( $fact_status )
		&& (
			$is_maya_profile
			|| in_array( $source_type, array( 'seed', 'public_index', 'import' ), true )
			|| $notes_seed_like
		)
	) {
		$issues['fact_review'] = __( 'Profile facts are not approved', 'justice-theme' );
	}

	if ( 'seed' === $source_type || $notes_seed_like ) {
		$issues['seed_demo'] = __( 'Seed/demo-like notes or source', 'justice-theme' );
	}

	if ( ( $is_public_basic || 'public_index' === $source_type || 'import' === $source_type ) && ! $source_ok ) {
		$issues['missing_source'] = __( 'Missing public source URL', 'justice-theme' );
	}

	if ( has_post_thumbnail( $post_id ) && ! $media_is_safe ) {
		$issues['blocked_media'] = __( 'Photo blocked until verified/owned', 'justice-theme' );
	}

	if ( '' !== $credentials && '' === $public_sources && '' === $source_summary && ! $source_ok ) {
		$issues['unsourced_credentials'] = __( 'Credentials need source note', 'justice-theme' );
	}

	if ( ( $review_count > 0 || $average_rating > 0 ) && ! $reviews_enabled ) {
		$issues['hidden_reviews'] = __( 'Review data is hidden/not approved', 'justice-theme' );
	}

	if ( $source_ok ) {
		$signals['source_ok'] = __( 'Source link exists', 'justice-theme' );
	}

	if ( $is_verified ) {
		$signals['verified'] = __( 'Verified profile', 'justice-theme' );
	}

	if ( $is_paid ) {
		$signals['paid'] = __( 'Paid/active plan', 'justice-theme' );
	}

	if ( justice_lawyer_fact_review_status_is_approved( $fact_status ) ) {
		$signals['facts_approved'] = __( 'Facts approved', 'justice-theme' );
	}

	if ( $media_is_safe ) {
		$signals['media_safe'] = __( 'Photo allowed', 'justice-theme' );
	} elseif ( ! has_post_thumbnail( $post_id ) ) {
		$signals['initials'] = __( 'Uses initials/avatar', 'justice-theme' );
	}

	$level = empty( $issues ) ? 'ready' : 'review';
	if ( isset( $issues['maya_review'] ) || isset( $issues['fact_review'] ) || isset( $issues['seed_demo'] ) || isset( $issues['blocked_media'] ) || isset( $issues['unsourced_credentials'] ) ) {
		$level = 'hold';
	}

	return array(
		'issues'  => $issues,
		'signals' => $signals,
		'level'   => $level,
	);
}

/**
 * Check if a profile matches an owner trust-gate filter.
 *
 * @param int    $post_id Lawyer profile post ID.
 * @param string $gate Requested filter gate.
 * @return bool
 */
function justice_lawyer_owner_profile_matches_trust_gate( int $post_id, string $gate ): bool {
	$findings = justice_lawyer_owner_profile_trust_findings( $post_id );
	$issues   = $findings['issues'];

	switch ( $gate ) {
		case 'needs_review':
			return ! empty( $issues );

		case 'hold':
			return 'hold' === $findings['level'];

		case 'missing_source':
			return isset( $issues['missing_source'] );

		case 'blocked_media':
			return isset( $issues['blocked_media'] );

		case 'maya_review':
			return isset( $issues['maya_review'] );

		case 'ready':
			return empty( $issues );
	}

	return false;
}

/**
 * Fetch all lawyer profile IDs that the owner trust tools should inspect.
 *
 * @return array<int>
 */
function justice_lawyer_owner_all_profile_ids(): array {
	return array_map(
		'intval',
		get_posts(
			array(
				'post_type'        => 'justice_lawyer',
				'post_status'      => array( 'publish', 'draft', 'pending', 'private' ),
				'posts_per_page'   => -1,
				'fields'           => 'ids',
				'no_found_rows'    => true,
				'suppress_filters' => true,
			)
		)
	);
}

/**
 * Count trust states for the owner lawyer list summary.
 *
 * @return array<string,int>
 */
function justice_lawyer_owner_profile_trust_summary_counts(): array {
	$counts = array(
		'total'                  => 0,
		'ready'                  => 0,
		'needs_review'           => 0,
		'hold'                   => 0,
		'missing_source'         => 0,
		'blocked_media'          => 0,
		'maya_review'            => 0,
		'seed_demo'              => 0,
		'unsourced_credentials'  => 0,
		'hidden_reviews'         => 0,
	);

	foreach ( justice_lawyer_owner_all_profile_ids() as $post_id ) {
		$findings = justice_lawyer_owner_profile_trust_findings( $post_id );
		$issues   = $findings['issues'];

		++$counts['total'];

		if ( empty( $issues ) ) {
			++$counts['ready'];
		} else {
			++$counts['needs_review'];
		}

		if ( 'hold' === $findings['level'] ) {
			++$counts['hold'];
		}

		foreach ( array_keys( $issues ) as $issue_key ) {
			if ( isset( $counts[ $issue_key ] ) ) {
				++$counts[ $issue_key ];
			}
		}
	}

	return $counts;
}

/**
 * Render a summary link for the lawyer trust-gate admin dashboard.
 *
 * @param string $label      Link label.
 * @param int    $count      Count to display.
 * @param string $gate       Trust gate filter.
 * @param string $background Background color.
 * @param string $color      Text color.
 */
function justice_lawyer_owner_trust_summary_link( string $label, int $count, string $gate, string $background, string $color ): void {
	$url = add_query_arg(
		array(
			'post_type'                => 'justice_lawyer',
			'justice_owner_trust_gate' => $gate,
		),
		admin_url( 'edit.php' )
	);

	printf(
		'<a href="%1$s" style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:7px 10px;border-radius:6px;background:%2$s;color:%3$s;text-decoration:none;font-weight:700;"><span>%4$s</span><strong style="font-size:15px;">%5$d</strong></a>',
		esc_url( $url ),
		esc_attr( $background ),
		esc_attr( $color ),
		esc_html( $label ),
		$count
	);
}

/**
 * Show owner trust-gate counts above the lawyer CMS table.
 *
 * @param string $which Table navigation position.
 */
function justice_lawyer_owner_trust_gate_summary_bar( string $which ): void {
	if ( 'top' !== $which ) {
		return;
	}

	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( ! $screen || 'edit-justice_lawyer' !== $screen->id ) {
		return;
	}

	$counts = justice_lawyer_owner_profile_trust_summary_counts();

	echo '<div class="justice-owner-trust-summary" style="clear:both;margin:10px 0 12px;padding:12px;border:1px solid #c3c4c7;border-radius:8px;background:#fff;">';
	echo '<div style="margin-bottom:8px;font-weight:700;color:#1d2327;">' . esc_html__( 'Jus-Tice profile trust queue', 'justice-theme' ) . '</div>';
	justice_lawyer_owner_trust_summary_link( __( 'Hold before promotion', 'justice-theme' ), $counts['hold'], 'hold', '#f8d7da', '#842029' );
	justice_lawyer_owner_trust_summary_link( __( 'Needs review', 'justice-theme' ), $counts['needs_review'], 'needs_review', '#fff3cd', '#664d03' );
	justice_lawyer_owner_trust_summary_link( __( 'Missing source', 'justice-theme' ), $counts['missing_source'], 'missing_source', '#fde2c2', '#6c3d00' );
	justice_lawyer_owner_trust_summary_link( __( 'Blocked media', 'justice-theme' ), $counts['blocked_media'], 'blocked_media', '#f8d7da', '#842029' );
	justice_lawyer_owner_trust_summary_link( __( 'Maya review', 'justice-theme' ), $counts['maya_review'], 'maya_review', '#e7d8ff', '#3b245f' );
	justice_lawyer_owner_trust_summary_link( __( 'Trust ready', 'justice-theme' ), $counts['ready'], 'ready', '#d1e7dd', '#0f5132' );
	printf(
		'<div style="margin-top:4px;color:#646970;font-size:12px;">%s</div>',
		esc_html(
			sprintf(
				/* translators: %d: total lawyer profile count. */
				__( 'Total profiles checked: %d. Resolve red/yellow items before homepage, sponsored, outreach or investor-demo promotion.', 'justice-theme' ),
				$counts['total']
			)
		)
	);
	echo '</div>';
}
add_action( 'manage_posts_extra_tablenav', 'justice_lawyer_owner_trust_gate_summary_bar' );

/**
 * Add owner-facing management columns to the lawyer CMS list.
 *
 * @param array<string,string> $columns Existing columns.
 * @return array<string,string>
 */
function justice_lawyer_owner_admin_columns( array $columns ): array {
	$updated = array();

	foreach ( $columns as $key => $label ) {
		$updated[ $key ] = $label;

		if ( 'title' === $key ) {
			$updated['justice_owner_control'] = __( 'Jus-Tice control', 'justice-theme' );
			$updated['justice_owner_source']  = __( 'Source / type', 'justice-theme' );
			$updated['justice_owner_trust']   = __( 'Trust gate', 'justice-theme' );
		}
	}

	return $updated;
}
add_filter( 'manage_justice_lawyer_posts_columns', 'justice_lawyer_owner_admin_columns', 30 );

/**
 * Populate the owner-facing management columns.
 *
 * @param string $column  Column key.
 * @param int    $post_id Lawyer profile post ID.
 */
function justice_lawyer_owner_admin_column_content( string $column, int $post_id ): void {
	if ( 'justice_owner_control' === $column ) {
		$visibility = strtolower( (string) get_post_meta( $post_id, 'admin_profile_visibility', true ) );
		$plan       = strtolower( (string) get_post_meta( $post_id, 'plan_type', true ) );
		$status     = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );
		$priority   = (int) get_post_meta( $post_id, 'priority_score', true );
		$fact_status = justice_lawyer_normalize_fact_review_status( (string) get_post_meta( $post_id, 'profile_fact_review_status', true ) );
		$fact_labels = justice_lawyer_fact_review_status_options();
		$is_public  = function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			? justice_theme_lawyer_profile_is_public_approved( $post_id )
			: ( 'publish' === get_post_status( $post_id ) );

		if ( 'hide' === $visibility ) {
			justice_lawyer_admin_badge( 'Hidden', '#f8d7da', '#842029' );
		} elseif ( 'show' === $visibility ) {
			justice_lawyer_admin_badge( 'Forced show', '#d1e7dd', '#0f5132' );
		} else {
			justice_lawyer_admin_badge( 'Auto', '#e2e3e5', '#41464b' );
		}

		justice_lawyer_admin_badge( $is_public ? 'Public card' : 'Not public', $is_public ? '#cff4fc' : '#fff3cd', $is_public ? '#055160' : '#664d03' );
		justice_lawyer_admin_badge(
			'Facts: ' . ( $fact_labels[ $fact_status ] ?? $fact_status ),
			justice_lawyer_fact_review_status_is_approved( $fact_status ) ? '#d1e7dd' : ( in_array( $fact_status, array( 'hold', 'rejected' ), true ) ? '#f8d7da' : '#fff3cd' ),
			justice_lawyer_fact_review_status_is_approved( $fact_status ) ? '#0f5132' : ( in_array( $fact_status, array( 'hold', 'rejected' ), true ) ? '#842029' : '#664d03' )
		);

		if ( 'featured' === $plan || 'lead_partner' === $plan || $priority >= 90 ) {
			justice_lawyer_admin_badge( 'Sponsored slot', '#f8e7b9', '#5f4300' );
		}

		if ( 'free' === $plan && 'inactive' === $status ) {
			justice_lawyer_admin_badge( 'Basic unclaimed', '#edf2ff', '#19346d' );
		}

		printf(
			'<div style="margin-top:4px;color:#646970;font-size:11px;">plan: %1$s | sub: %2$s | score: %3$d</div>',
			esc_html( $plan ?: '-' ),
			esc_html( $status ?: '-' ),
			$priority
		);

		$public_url = get_permalink( $post_id );
		if ( $public_url ) {
			printf(
				'<div style="margin-top:3px;"><a href="%s" target="_blank" rel="noopener">%s</a></div>',
				esc_url( $public_url ),
				esc_html__( 'Open public card', 'justice-theme' )
			);
		}

		return;
	}

	if ( 'justice_owner_trust' === $column ) {
		$findings = justice_lawyer_owner_profile_trust_findings( $post_id );

		if ( 'ready' === $findings['level'] ) {
			justice_lawyer_admin_badge( 'Trust ready', '#d1e7dd', '#0f5132' );
		} elseif ( 'hold' === $findings['level'] ) {
			justice_lawyer_admin_badge( 'Hold before promo', '#f8d7da', '#842029' );
		} else {
			justice_lawyer_admin_badge( 'Needs review', '#fff3cd', '#664d03' );
		}

		foreach ( array_slice( $findings['issues'], 0, 4 ) as $issue ) {
			justice_lawyer_admin_badge( $issue, '#fff3cd', '#664d03' );
		}

		foreach ( array_slice( $findings['signals'], 0, 3 ) as $signal ) {
			justice_lawyer_admin_badge( $signal, '#eef2f7', '#243b53' );
		}

		if ( empty( $findings['issues'] ) ) {
			echo '<div style="margin-top:4px;color:#0f5132;font-size:11px;">Safe for outreach/promoted review.</div>';
		} else {
			echo '<div style="margin-top:4px;color:#646970;font-size:11px;">Verify source, media and factual claims before premium positioning.</div>';
		}

		return;
	}

	if ( 'justice_owner_source' === $column ) {
		$source_type       = (string) get_post_meta( $post_id, 'source_type', true );
		$source_url        = (string) get_post_meta( $post_id, 'source_url', true );
		$professional_type = (string) get_post_meta( $post_id, 'professional_type', true );
		$host              = $source_url ? (string) wp_parse_url( $source_url, PHP_URL_HOST ) : '';
		$host              = $host ? preg_replace( '/^www\./', '', $host ) : '';

		justice_lawyer_admin_badge( $professional_type ?: 'lawyer', '#eef2f7', '#243b53' );
		justice_lawyer_admin_badge( $source_type ?: 'manual', '#f6f7f7', '#3c434a' );

		if ( $host ) {
			printf(
				'<div style="margin-top:4px;font-size:12px;"><a href="%1$s" target="_blank" rel="noopener">%2$s</a></div>',
				esc_url( $source_url ),
				esc_html( $host )
			);
		} else {
			echo '<div style="margin-top:4px;color:#646970;font-size:12px;">No source URL</div>';
		}
	}
}
add_action( 'manage_justice_lawyer_posts_custom_column', 'justice_lawyer_owner_admin_column_content', 20, 2 );

/**
 * Add owner filters above the lawyer list to support batch selection.
 *
 * @param string $post_type Current list post type.
 */
function justice_lawyer_owner_admin_filters( string $post_type ): void {
	if ( 'justice_lawyer' !== $post_type ) {
		return;
	}

	$filters = array(
		'justice_owner_visibility'        => array(
			'label'   => __( 'All visibility states', 'justice-theme' ),
			'options' => array(
				'manual_show'     => __( 'Forced show', 'justice-theme' ),
				'manual_hide'     => __( 'Hidden', 'justice-theme' ),
				'sponsored'       => __( 'Sponsored / priority', 'justice-theme' ),
				'basic_unclaimed' => __( 'Basic unclaimed', 'justice-theme' ),
				'active_paid'     => __( 'Active subscription', 'justice-theme' ),
			),
		),
		'justice_owner_plan'              => array(
			'label'   => __( 'All plans', 'justice-theme' ),
			'options' => array(
				'free'         => 'free',
				'pro'          => 'pro',
				'featured'     => 'featured',
				'lead_partner' => 'lead_partner',
				'full_service' => 'full_service',
			),
		),
		'justice_owner_source_type'       => array(
			'label'   => __( 'All sources', 'justice-theme' ),
			'options' => array(
				'public_index' => 'public_index',
				'import'       => 'import',
				'manual'       => 'manual',
				'registration' => 'registration',
				'seed'         => 'seed',
			),
		),
		'justice_owner_trust_gate'        => array(
			'label'   => __( 'All trust gates', 'justice-theme' ),
			'options' => array(
				'needs_review'  => __( 'Needs trust review', 'justice-theme' ),
				'hold'          => __( 'Hold before promotion', 'justice-theme' ),
				'missing_source' => __( 'Missing source URL', 'justice-theme' ),
				'blocked_media' => __( 'Blocked/unverified media', 'justice-theme' ),
				'maya_review'   => __( 'Maya source review', 'justice-theme' ),
				'ready'         => __( 'Trust ready', 'justice-theme' ),
			),
		),
		'justice_owner_fact_review'       => array(
			'label'   => __( 'All fact review states', 'justice-theme' ),
			'options' => justice_lawyer_fact_review_status_options(),
		),
		'justice_owner_professional_type' => array(
			'label'   => __( 'All professional types', 'justice-theme' ),
			'options' => array(
				'lawyer'              => 'lawyer',
				'law_firm'            => 'law_firm',
				'rabbinical_advocate' => 'rabbinical_advocate',
				'mediator'            => 'mediator',
				'notary'              => 'notary',
				'legal_supplier'      => 'legal_supplier',
			),
		),
	);

	foreach ( $filters as $name => $config ) {
		$current = isset( $_GET[ $name ] ) ? sanitize_key( wp_unslash( $_GET[ $name ] ) ) : '';

		printf( '<select name="%1$s" id="%1$s">', esc_attr( $name ) );
		printf( '<option value="">%s</option>', esc_html( $config['label'] ) );

		foreach ( $config['options'] as $value => $label ) {
			printf(
				'<option value="%1$s" %2$s>%3$s</option>',
				esc_attr( $value ),
				selected( $current, $value, false ),
				esc_html( $label )
			);
		}

		echo '</select>';
	}
}
add_action( 'restrict_manage_posts', 'justice_lawyer_owner_admin_filters' );

/**
 * Apply the owner filters to the wp-admin lawyer list.
 *
 * @param WP_Query $query Current query.
 */
function justice_lawyer_owner_admin_filter_query( WP_Query $query ): void {
	if (
		! is_admin()
		|| ! $query->is_main_query()
		|| 'justice_lawyer' !== $query->get( 'post_type' )
	) {
		return;
	}

	$meta_query = (array) $query->get( 'meta_query' );

	$visibility = isset( $_GET['justice_owner_visibility'] ) ? sanitize_key( wp_unslash( $_GET['justice_owner_visibility'] ) ) : '';
	switch ( $visibility ) {
		case 'manual_show':
			$meta_query[] = array(
				'key'   => 'admin_profile_visibility',
				'value' => 'show',
			);
			break;

		case 'manual_hide':
			$meta_query[] = array(
				'key'   => 'admin_profile_visibility',
				'value' => 'hide',
			);
			break;

		case 'sponsored':
			$meta_query[] = array(
				'relation' => 'OR',
				array(
					'key'     => 'plan_type',
					'value'   => array( 'featured', 'lead_partner', 'full_service' ),
					'compare' => 'IN',
				),
				array(
					'key'     => 'priority_score',
					'value'   => 90,
					'type'    => 'NUMERIC',
					'compare' => '>=',
				),
			);
			break;

		case 'basic_unclaimed':
			$meta_query[] = array(
				'key'   => 'plan_type',
				'value' => 'free',
			);
			$meta_query[] = array(
				'key'   => 'subscription_status',
				'value' => 'inactive',
			);
			break;

		case 'active_paid':
			$meta_query[] = array(
				'key'   => 'subscription_status',
				'value' => 'active',
			);
			break;
	}

	$fact_review = isset( $_GET['justice_owner_fact_review'] ) ? sanitize_key( wp_unslash( $_GET['justice_owner_fact_review'] ) ) : '';
	if ( '' !== $fact_review ) {
		$fact_review = justice_lawyer_normalize_fact_review_status( $fact_review );

		if ( 'pending' === $fact_review ) {
			$meta_query[] = array(
				'relation' => 'OR',
				array(
					'key'     => 'profile_fact_review_status',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'   => 'profile_fact_review_status',
					'value' => '',
				),
				array(
					'key'   => 'profile_fact_review_status',
					'value' => 'pending',
				),
			);
		} else {
			$meta_query[] = array(
				'key'   => 'profile_fact_review_status',
				'value' => $fact_review,
			);
		}
	}

	$exact_meta_filters = array(
		'justice_owner_plan'              => 'plan_type',
		'justice_owner_source_type'       => 'source_type',
		'justice_owner_professional_type' => 'professional_type',
	);

	foreach ( $exact_meta_filters as $request_key => $meta_key ) {
		$value = isset( $_GET[ $request_key ] ) ? sanitize_key( wp_unslash( $_GET[ $request_key ] ) ) : '';
		if ( '' === $value ) {
			continue;
		}

		$meta_query[] = array(
			'key'   => $meta_key,
			'value' => $value,
		);
	}

	$trust_gate = isset( $_GET['justice_owner_trust_gate'] ) ? sanitize_key( wp_unslash( $_GET['justice_owner_trust_gate'] ) ) : '';
	if ( '' !== $trust_gate ) {
		$matching_ids = array_values(
			array_filter(
				justice_lawyer_owner_all_profile_ids(),
				static function ( int $post_id ) use ( $trust_gate ): bool {
					return justice_lawyer_owner_profile_matches_trust_gate( $post_id, $trust_gate );
				}
			)
		);

		$query->set( 'post__in', ! empty( $matching_ids ) ? $matching_ids : array( 0 ) );
	}

	if ( ! empty( $meta_query ) ) {
		$query->set( 'meta_query', $meta_query );
	}
}
add_action( 'pre_get_posts', 'justice_lawyer_owner_admin_filter_query' );

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
