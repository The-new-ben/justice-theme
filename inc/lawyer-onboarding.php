<?php
/**
 * Lawyer self-registration funnel.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_activation_meta(): void {
	$fields = array(
		'activation_status'     => 'string',
		'first_value_at'        => 'string',
		'activation_owner_note' => 'string',
		'payment_path'            => 'string',
		'payment_followup_status' => 'string',
		'lead_response_commitment' => 'string',
		'google_business_profile_url' => 'string',
		'google_place_id'             => 'string',
		'google_review_request_url'   => 'string',
		'google_review_count'         => 'integer',
		'latest_review_date'          => 'string',
		'review_display_enabled'      => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lawyer', $key, array(
			'single'            => true,
			'type'              => $type,
			'sanitize_callback' => justice_theme_lawyer_activation_meta_sanitizer( $key ),
			'show_in_rest'      => false,
		) );
	}
}
add_action( 'init', 'justice_theme_register_lawyer_activation_meta' );

function justice_theme_lawyer_response_commitment_options(): array {
	return array(
		''              => 'Not provided',
		'within_15_min' => 'Can respond within 15 minutes during business hours',
		'same_day'      => 'Can respond same business day',
		'next_day'      => 'Usually next business day',
		'not_sure'      => 'Needs response process setup',
	);
}

function justice_theme_lawyer_activation_meta_sanitizer( string $key ): string {
	if ( 'activation_owner_note' === $key ) {
		return 'sanitize_textarea_field';
	}

	if ( in_array( $key, array( 'google_business_profile_url', 'google_review_request_url' ), true ) ) {
		return 'esc_url_raw';
	}

	if ( 'google_review_count' === $key ) {
		return 'absint';
	}

	return 'sanitize_text_field';
}

function justice_theme_handle_lawyer_registration(): void {
	if ( ! isset( $_POST['justice_lawyer_registration_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_registration_nonce'] ) ), 'justice_lawyer_registration' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! empty( $_POST['website_url_confirm'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'sent', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'blocked', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$name       = isset( $_POST['lawyer_full_name'] ) ? sanitize_text_field( wp_unslash( $_POST['lawyer_full_name'] ) ) : '';
	$firm       = isset( $_POST['firm_name'] ) ? sanitize_text_field( wp_unslash( $_POST['firm_name'] ) ) : '';
	$bar_number = isset( $_POST['bar_number'] ) ? sanitize_text_field( wp_unslash( $_POST['bar_number'] ) ) : '';
	$phone      = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$email      = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$whatsapp   = isset( $_POST['whatsapp'] ) ? sanitize_text_field( wp_unslash( $_POST['whatsapp'] ) ) : '';
	$website    = isset( $_POST['website'] ) ? esc_url_raw( wp_unslash( $_POST['website'] ) ) : '';
	$languages  = isset( $_POST['languages'] ) ? sanitize_text_field( wp_unslash( $_POST['languages'] ) ) : '';
	$cities     = isset( $_POST['cities_served'] ) ? sanitize_text_field( wp_unslash( $_POST['cities_served'] ) ) : '';
	$bio        = isset( $_POST['bio_short'] ) ? sanitize_textarea_field( wp_unslash( $_POST['bio_short'] ) ) : '';
	$headline   = isset( $_POST['profile_headline'] ) ? sanitize_text_field( wp_unslash( $_POST['profile_headline'] ) ) : '';
	$services   = isset( $_POST['profile_services'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_services'] ) ) : '';
	$process    = isset( $_POST['profile_process'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_process'] ) ) : '';
	$video_url  = isset( $_POST['profile_video_url'] ) ? esc_url_raw( wp_unslash( $_POST['profile_video_url'] ) ) : '';
	$faqs       = isset( $_POST['profile_faqs'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_faqs'] ) ) : '';
	$area       = isset( $_POST['practice_area'] ) ? sanitize_key( wp_unslash( $_POST['practice_area'] ) ) : '';
	$plan         = isset( $_POST['plan_interest'] ) ? sanitize_key( wp_unslash( $_POST['plan_interest'] ) ) : 'free';
	$payment_path = isset( $_POST['payment_path'] ) ? sanitize_key( wp_unslash( $_POST['payment_path'] ) ) : '';
	$response_commitment = isset( $_POST['lead_response_commitment'] ) ? sanitize_key( wp_unslash( $_POST['lead_response_commitment'] ) ) : '';

	if ( ! array_key_exists( $response_commitment, justice_theme_lawyer_response_commitment_options() ) ) {
		$response_commitment = '';
	}

	if ( 'manual_invoice' !== $payment_path ) {
		$payment_path = '';
	}

	if ( ! $name || ! $phone || ! $email || empty( $_POST['consent'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'missing', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$post_id = wp_insert_post( array(
		'post_type'    => 'justice_lawyer',
		'post_status'  => 'draft',
		'post_title'   => $name,
		'post_excerpt' => $bio,
		'post_content' => $bio,
	) );

	if ( ! $post_id || is_wp_error( $post_id ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$plan_type      = in_array( $plan, array( 'free', 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ? $plan : 'free';
	$manual_payment = 'manual_invoice' === $payment_path && 'free' !== $plan_type;
	$internal_notes = 'Self-registration submission. Review license, identity, content, ethics and commercial plan before publishing.';

	if ( $manual_payment ) {
		$internal_notes .= "\nManual invoice path requested. Create Morning invoice/payment instructions after review, then activate only after payment confirmation.";
	}

	if ( $response_commitment ) {
		$internal_notes .= "\nLead response commitment: " . justice_theme_lawyer_response_commitment_options()[ $response_commitment ];
	}

	$meta = array(
		'lawyer_full_name'     => $name,
		'firm_name'            => $firm,
		'bar_number'           => $bar_number,
		'phone'                => $phone,
		'email'                => $email,
		'whatsapp'             => $whatsapp,
		'website'              => $website,
		'languages'            => $languages,
		'cities_served'        => $cities,
		'bio_short'            => $bio,
		'profile_headline'     => $headline,
		'profile_subheadline'  => $bio,
		'profile_services'     => $services,
		'profile_process'      => $process,
		'profile_video_url'    => $video_url,
		'profile_faqs'         => $faqs,
		'plan_type'            => $plan_type,
		'subscription_status'  => 'pending',
		'payment_path'            => $manual_payment ? 'manual_invoice' : '',
		'payment_followup_status' => $manual_payment ? 'invoice_requested' : '',
		'lead_response_commitment' => $response_commitment,
		'verification_status'  => 'pending',
		'profile_status'       => 'pending',
		'activation_status'    => 'registered',
		'first_value_at'       => '',
		'activation_owner_note' => '',
		'claimed_by_user_id'   => is_user_logged_in() ? get_current_user_id() : 0,
		'source_type'          => 'registration',
		'lead_routing_enabled' => false,
		'internal_notes'       => $internal_notes,
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	if ( $area && taxonomy_exists( 'practice-areas' ) ) {
		wp_set_object_terms( $post_id, $area, 'practice-areas', false );
	}

	justice_theme_assign_registration_city_terms( $post_id, $cities );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_registration', 'New lawyer registration draft: ' . $name );
	}

	justice_theme_notify_lawyer_registration( $post_id, $meta );

	wp_safe_redirect(
		add_query_arg(
			array(
				'registration'  => 'sent',
				'plan_interest' => $meta['plan_type'],
				'payment_path'  => $meta['payment_path'],
			),
			home_url( '/lawyer-registration/' )
		)
	);
	exit;
}
add_action( 'admin_post_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );
add_action( 'admin_post_nopriv_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );

function justice_theme_assign_registration_city_terms( int $post_id, string $cities ): void {
	if ( ! taxonomy_exists( 'city' ) || '' === trim( $cities ) ) {
		return;
	}

	$city_map = array(
		'תל אביב'     => 'tel-aviv',
		'ת"א'         => 'tel-aviv',
		'תל-אביב'     => 'tel-aviv',
		'ירושלים'     => 'jerusalem',
		'חיפה'         => 'haifa',
		'ראשון לציון' => 'rishon-lezion',
		'פתח תקווה'   => 'petah-tikva',
		'אשדוד'       => 'ashdod',
		'נתניה'       => 'netanya',
		'באר שבע'     => 'beer-sheva',
		'חולון'       => 'holon',
		'בני ברק'     => 'bnei-brak',
		'רמת גן'      => 'ramat-gan',
		'אשקלון'      => 'ashkelon',
		'רחובות'      => 'rehovot',
		'בת ים'       => 'bat-yam',
		'הרצליה'      => 'herzliya',
		'כפר סבא'     => 'kfar-saba',
		'מודיעין'     => 'modiin',
		'נצרת'        => 'nazareth',
		'לוד'          => 'lod',
		'רמלה'        => 'ramla',
	);

	$parts = preg_split( '/[,،;|]+/u', $cities ) ?: array();
	$slugs = array();

	foreach ( $parts as $part ) {
		$city = trim( $part );
		if ( '' === $city ) {
			continue;
		}

		$slug = $city_map[ $city ] ?? sanitize_title( $city );
		$term = get_term_by( 'slug', $slug, 'city' );

		if ( ! $term && isset( $city_map[ $city ] ) ) {
			$inserted = wp_insert_term( $city, 'city', array( 'slug' => $slug ) );
			if ( ! is_wp_error( $inserted ) ) {
				$term = get_term_by( 'id', (int) $inserted['term_id'], 'city' );
			}
		}

		if ( $term && ! is_wp_error( $term ) ) {
			$slugs[] = $term->slug;
		}
	}

	if ( ! empty( $slugs ) ) {
		wp_set_object_terms( $post_id, array_values( array_unique( $slugs ) ), 'city', false );
	}
}

function justice_theme_notify_lawyer_registration( int $post_id, array $meta ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$subject = 'New lawyer registration pending review';
	$message = sprintf(
		"New lawyer registration draft is waiting for review.\n\nName: %s\nFirm: %s\nPhone: %s\nEmail: %s\nPlan interest: %s\nPayment path: %s\nPayment follow-up: %s\nLead response: %s\nHeadline: %s\nVideo: %s\n\nReview: %s",
		$meta['lawyer_full_name'] ?: '-',
		$meta['firm_name'] ?: '-',
		$meta['phone'] ?: '-',
		$meta['email'] ?: '-',
		$meta['plan_type'] ?: '-',
		$meta['payment_path'] ?: '-',
		$meta['payment_followup_status'] ?: '-',
		justice_theme_lawyer_response_commitment_options()[ $meta['lead_response_commitment'] ?? '' ] ?? '-',
		$meta['profile_headline'] ?: '-',
		$meta['profile_video_url'] ?: '-',
		admin_url( 'post.php?post=' . $post_id . '&action=edit' )
	);

	wp_mail( $admin_email, $subject, $message );
}

function justice_theme_seed_lawyer_registration_page(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_lawyer_registration_page_seed' ) || get_option( 'justice_lawyer_registration_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-registration', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-registration',
		'post_title'   => 'הצטרפות עורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-registration.php',
		),
	) );

	update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_registration_page' );

function justice_theme_lawyer_onboarding_admin_menu(): void {
	add_menu_page(
		'Lawyer Onboarding',
		'Lawyer Onboarding',
		'edit_pages',
		'justice-lawyer-onboarding',
		'justice_theme_render_lawyer_onboarding_admin_page',
		'dashicons-businessperson',
		26
	);
}
add_action( 'admin_menu', 'justice_theme_lawyer_onboarding_admin_menu' );

function justice_theme_append_lawyer_internal_note( int $post_id, string $note ): void {
	$existing = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
	$entry    = sprintf( '[%s] %s', current_time( 'mysql' ), $note );

	update_post_meta( $post_id, 'internal_notes', trim( $existing . "\n" . $entry ) );
}

function justice_theme_lawyer_activation_options(): array {
	return array(
		'registered'       => 'Registered',
		'profile_ready'    => 'Profile ready',
		'first_value'      => 'First value reached',
		'retention_review' => 'Retention review',
		'at_risk'          => 'At risk',
	);
}

function justice_theme_lawyer_activation_badge( string $status ): array {
	$labels = justice_theme_lawyer_activation_options();
	$label  = $labels[ $status ] ?? 'Registered';

	if ( 'first_value' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#ecfdf3;color:#166534;' );
	}

	if ( 'profile_ready' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#e7f0ff;color:#16427a;' );
	}

	if ( 'retention_review' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#eef2ff;color:#3730a3;' );
	}

	if ( 'at_risk' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#fef2f2;color:#991b1b;' );
	}

	return array( 'label' => $label, 'style' => 'background:#f1f5f9;color:#334155;' );
}

function justice_theme_lawyer_payment_followup_badge( string $payment_path, string $followup_status ): array {
	if ( 'manual_invoice' !== $payment_path ) {
		return array(
			'label' => 'No manual payment',
			'note'  => 'Use normal checkout or free review path.',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	if ( 'invoice_requested' === $followup_status ) {
		return array(
			'label' => 'Invoice requested',
			'note'  => 'Create/send Morning invoice, then activate after payment confirmation.',
			'style' => 'background:#fef3c7;color:#92400e;',
		);
	}

	return array(
		'label' => 'Manual payment',
		'note'  => 'Review payment state before activation.',
		'style' => 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_lawyer_activation_meta_box(): void {
	add_meta_box(
		'justice_theme_lawyer_activation',
		'Jus-Tice Lawyer Activation',
		'justice_theme_render_lawyer_activation_box',
		'justice_lawyer',
		'side',
		'high'
	);

	add_meta_box(
		'justice_theme_lawyer_reputation',
		'Jus-Tice Reputation Sources',
		'justice_theme_render_lawyer_reputation_box',
		'justice_lawyer',
		'normal',
		'default'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_lawyer_activation_meta_box' );

function justice_theme_render_lawyer_activation_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_activation', 'justice_theme_lawyer_activation_nonce' );

	$status         = get_post_meta( $post->ID, 'activation_status', true ) ?: 'registered';
	$first_value_at = get_post_meta( $post->ID, 'first_value_at', true );
	$owner_note     = get_post_meta( $post->ID, 'activation_owner_note', true );
	$payment_path   = (string) get_post_meta( $post->ID, 'payment_path', true );
	$payment_status = (string) get_post_meta( $post->ID, 'payment_followup_status', true );
	$payment_badge  = justice_theme_lawyer_payment_followup_badge( $payment_path, $payment_status );
	$response_commitment = (string) get_post_meta( $post->ID, 'lead_response_commitment', true );
	$response_options    = justice_theme_lawyer_response_commitment_options();
	?>
	<p>
		<strong>Payment follow-up</strong><br>
		<span style="display:inline-block;margin:4px 0;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_badge['style'] ); ?>">
			<?php echo esc_html( $payment_badge['label'] ); ?>
		</span><br>
		<small><?php echo esc_html( $payment_badge['note'] ); ?></small>
	</p>
	<p>
		<strong>Lead response fit</strong><br>
		<small><?php echo esc_html( $response_options[ $response_commitment ] ?? $response_options[''] ); ?></small>
	</p>
	<p>
		<label for="justice-lawyer-activation-status"><strong>Activation status</strong></label>
		<select id="justice-lawyer-activation-status" name="activation_status" style="width:100%;">
			<?php foreach ( justice_theme_lawyer_activation_options() as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $status, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-first-value-at"><strong>First value time</strong></label>
		<input id="justice-first-value-at" type="datetime-local" name="first_value_at" value="<?php echo esc_attr( $first_value_at ); ?>" style="width:100%;">
	</p>
	<p>
		<label for="justice-activation-owner-note"><strong>Owner/customer-success note</strong></label>
		<textarea id="justice-activation-owner-note" name="activation_owner_note" rows="5" style="width:100%;"><?php echo esc_textarea( $owner_note ); ?></textarea>
	</p>
	<p style="color:#646970;">Owner-only tracking for time-to-first-value and retention review. No public display.</p>
	<?php
}

function justice_theme_render_lawyer_reputation_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_reputation', 'justice_theme_lawyer_reputation_nonce' );

	$business_url       = (string) get_post_meta( $post->ID, 'google_business_profile_url', true );
	$place_id           = (string) get_post_meta( $post->ID, 'google_place_id', true );
	$review_request_url = (string) get_post_meta( $post->ID, 'google_review_request_url', true );
	$review_count       = (string) get_post_meta( $post->ID, 'google_review_count', true );
	$latest_review_date = (string) get_post_meta( $post->ID, 'latest_review_date', true );
	$display_enabled    = (string) get_post_meta( $post->ID, 'review_display_enabled', true );
	?>
	<p>Owner-only source fields for reputation/review workflows. Do not copy Google review text into public pages from here. Use these fields to connect review links, freshness and future Google Business Profile API/OAuth work.</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-google-business-profile-url">Google Business profile URL</label></th>
			<td><input id="justice-google-business-profile-url" type="url" name="google_business_profile_url" value="<?php echo esc_attr( $business_url ); ?>" class="regular-text" placeholder="https://maps.google.com/..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-place-id">Google Place ID</label></th>
			<td><input id="justice-google-place-id" type="text" name="google_place_id" value="<?php echo esc_attr( $place_id ); ?>" class="regular-text" placeholder="ChIJ..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-review-request-url">Google review request URL</label></th>
			<td><input id="justice-google-review-request-url" type="url" name="google_review_request_url" value="<?php echo esc_attr( $review_request_url ); ?>" class="regular-text" placeholder="https://search.google.com/local/writereview?placeid=..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-review-count">Google review count</label></th>
			<td><input id="justice-google-review-count" type="number" min="0" step="1" name="google_review_count" value="<?php echo esc_attr( $review_count ); ?>" class="small-text"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-latest-review-date">Latest review date</label></th>
			<td><input id="justice-latest-review-date" type="date" name="latest_review_date" value="<?php echo esc_attr( $latest_review_date ); ?>"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-review-display-enabled">Display approved recommendations</label></th>
			<td>
				<select id="justice-review-display-enabled" name="review_display_enabled">
					<option value="" <?php selected( $display_enabled, '' ); ?>>No / not reviewed</option>
					<option value="approved" <?php selected( $display_enabled, 'approved' ); ?>>Approved after owner review</option>
					<option value="disabled" <?php selected( $display_enabled, 'disabled' ); ?>>Disabled</option>
				</select>
				<p class="description">This flag is for first-party/display-approved recommendations. Google review text still needs a separate policy/API path.</p>
			</td>
		</tr>
	</table>
	<?php
}

function justice_theme_save_lawyer_activation( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_activation_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_activation_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_activation' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$status = isset( $_POST['activation_status'] ) ? sanitize_key( wp_unslash( $_POST['activation_status'] ) ) : 'registered';
	if ( ! array_key_exists( $status, justice_theme_lawyer_activation_options() ) ) {
		$status = 'registered';
	}

	update_post_meta( $post_id, 'activation_status', $status );
	update_post_meta( $post_id, 'first_value_at', isset( $_POST['first_value_at'] ) ? sanitize_text_field( wp_unslash( $_POST['first_value_at'] ) ) : '' );
	update_post_meta( $post_id, 'activation_owner_note', isset( $_POST['activation_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['activation_owner_note'] ) ) : '' );
}
add_action( 'save_post_justice_lawyer', 'justice_theme_save_lawyer_activation' );

function justice_theme_save_lawyer_reputation_sources( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_reputation_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_reputation_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_reputation' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	update_post_meta( $post_id, 'google_business_profile_url', isset( $_POST['google_business_profile_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_business_profile_url'] ) ) : '' );
	update_post_meta( $post_id, 'google_place_id', isset( $_POST['google_place_id'] ) ? sanitize_text_field( wp_unslash( $_POST['google_place_id'] ) ) : '' );
	update_post_meta( $post_id, 'google_review_request_url', isset( $_POST['google_review_request_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_review_request_url'] ) ) : '' );
	update_post_meta( $post_id, 'google_review_count', isset( $_POST['google_review_count'] ) ? absint( wp_unslash( $_POST['google_review_count'] ) ) : 0 );
	update_post_meta( $post_id, 'latest_review_date', isset( $_POST['latest_review_date'] ) ? sanitize_text_field( wp_unslash( $_POST['latest_review_date'] ) ) : '' );

	$display_enabled = isset( $_POST['review_display_enabled'] ) ? sanitize_key( wp_unslash( $_POST['review_display_enabled'] ) ) : '';
	if ( ! in_array( $display_enabled, array( '', 'approved', 'disabled' ), true ) ) {
		$display_enabled = '';
	}
	update_post_meta( $post_id, 'review_display_enabled', $display_enabled );
}
add_action( 'save_post_justice_lawyer', 'justice_theme_save_lawyer_reputation_sources' );

function justice_theme_apply_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to apply this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_apply_lawyer_profile_update_' . $post_id );

	$field_map = array(
		'pending_profile_headline'  => 'profile_headline',
		'pending_profile_services'  => 'profile_services',
		'pending_profile_process'   => 'profile_process',
		'pending_profile_video_url' => 'profile_video_url',
		'pending_profile_faqs'      => 'profile_faqs',
	);

	foreach ( $field_map as $pending_key => $public_key ) {
		$value = get_post_meta( $post_id, $pending_key, true );
		if ( '' !== trim( (string) $value ) ) {
			update_post_meta( $post_id, $public_key, $value );
		}
		delete_post_meta( $post_id, $pending_key );
	}

	delete_post_meta( $post_id, 'pending_profile_review' );
	delete_post_meta( $post_id, 'pending_profile_submitted_at' );
	update_post_meta( $post_id, 'profile_status', 'update_applied_pending_final_review' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner applied staged mini-site update; final public review still required.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_applied', 'Applied pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'applied', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_apply_lawyer_profile_update', 'justice_theme_apply_lawyer_profile_update' );

function justice_theme_discard_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to discard this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_discard_lawyer_profile_update_' . $post_id );

	$pending_keys = array(
		'pending_profile_headline',
		'pending_profile_services',
		'pending_profile_process',
		'pending_profile_video_url',
		'pending_profile_faqs',
		'pending_profile_review',
		'pending_profile_submitted_at',
	);

	foreach ( $pending_keys as $key ) {
		delete_post_meta( $post_id, $key );
	}

	update_post_meta( $post_id, 'profile_status', 'update_rejected_no_public_change' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner discarded staged mini-site update; public profile fields were not changed.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_discarded', 'Discarded pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'discarded', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_discard_lawyer_profile_update', 'justice_theme_discard_lawyer_profile_update' );

function justice_theme_mark_lawyer_content_reviewed(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to mark this content request reviewed.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_mark_lawyer_content_reviewed_' . $post_id );

	delete_post_meta( $post_id, 'pending_content_review' );
	update_post_meta( $post_id, 'latest_content_request_reviewed_at', current_time( 'mysql' ) );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner marked latest signed-content request as reviewed in Lawyer Onboarding.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_content_request_reviewed', 'Marked lawyer content request reviewed: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'content_review', 'marked', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_mark_lawyer_content_reviewed', 'justice_theme_mark_lawyer_content_reviewed' );

function justice_theme_lawyer_onboarding_plan_label( string $plan ): string {
	if ( function_exists( 'justice_theme_lawyer_plans' ) ) {
		$plans = justice_theme_lawyer_plans();

		if ( isset( $plans[ $plan ]['label'] ) ) {
			return (string) $plans[ $plan ]['label'];
		}
	}

	return $plan ?: '-';
}

function justice_theme_lawyer_onboarding_sales_priority( string $plan ): array {
	if ( in_array( $plan, array( 'lead_partner', 'full_service' ), true ) ) {
		return array(
			'label' => 'HIGH',
			'style' => 'background:#fef2f2;color:#991b1b;',
			'note'  => 'Call first: high-value commercial intent.',
		);
	}

	if ( in_array( $plan, array( 'pro', 'featured' ), true ) ) {
		return array(
			'label' => 'MEDIUM',
			'style' => 'background:#fff7ed;color:#9a3412;',
			'note'  => 'Follow up with mini-site and visibility offer.',
		);
	}

	return array(
		'label' => 'LOW',
		'style' => 'background:#f1f5f9;color:#334155;',
		'note'  => 'Nurture until paid intent appears.',
	);
}

function justice_theme_render_lawyer_onboarding_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		?>
		<div class="wrap">
			<h1>Lawyer Onboarding</h1>
			<p><strong>BLOCKED:</strong> `justice_lawyer` post type is not active. Verify the Justice plugin.</p>
		</div>
		<?php
		return;
	}

	$pending = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 50,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'   => 'source_type',
				'value' => 'registration',
			),
			array(
				'key'   => 'pending_profile_review',
				'value' => '1',
			),
			array(
				'key'   => 'pending_content_review',
				'value' => '1',
			),
			array(
				'key'   => 'pending_review_campaign_request',
				'value' => '1',
			),
		),
	) );
	?>
	<div class="wrap">
		<h1>Lawyer Onboarding</h1>
		<p>Pending lawyer self-registration submissions and staged profile update requests. Review identity, license, claims, practice areas, public content and commercial plan before publishing or applying updates.</p>
		<?php if ( isset( $_GET['profile_update'] ) && 'applied' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Pending mini-site update applied. Review the full profile before final public approval.</p></div>
		<?php elseif ( isset( $_GET['profile_update'] ) && 'discarded' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-warning is-dismissible"><p>Pending mini-site update discarded. Public profile fields were not changed.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['content_review'] ) && 'marked' === $_GET['content_review'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Content request review flag cleared for the lawyer profile.</p></div>
		<?php endif; ?>

		<?php if ( $pending->have_posts() ) : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Name</th>
						<th>Firm</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Plan</th>
						<th>Sales Priority</th>
						<th>Payment Follow-up</th>
						<th>Mini-site Content</th>
						<th>Pending Update</th>
						<th>Content Request</th>
						<th>Reputation</th>
						<th>Recent Notes</th>
						<th>Status</th>
						<th>Submitted</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php while ( $pending->have_posts() ) : $pending->the_post(); ?>
						<?php
						$post_id = get_the_ID();
						$status  = get_post_meta( $post_id, 'profile_status', true ) ?: get_post_status( $post_id );
						$plan    = (string) get_post_meta( $post_id, 'plan_type', true );
						$sales_priority = justice_theme_lawyer_onboarding_sales_priority( $plan );
						$activation_status = (string) get_post_meta( $post_id, 'activation_status', true ) ?: 'registered';
						$activation_badge  = justice_theme_lawyer_activation_badge( $activation_status );
						$payment_path      = (string) get_post_meta( $post_id, 'payment_path', true );
						$payment_followup  = (string) get_post_meta( $post_id, 'payment_followup_status', true );
						$payment_badge     = justice_theme_lawyer_payment_followup_badge( $payment_path, $payment_followup );
						$first_value_at     = get_post_meta( $post_id, 'first_value_at', true );
						$has_pending_update = '1' === (string) get_post_meta( $post_id, 'pending_profile_review', true );
						$has_pending_content = '1' === (string) get_post_meta( $post_id, 'pending_content_review', true );
						$has_pending_review_campaign = '1' === (string) get_post_meta( $post_id, 'pending_review_campaign_request', true );
						$content_article_id = (int) get_post_meta( $post_id, 'latest_content_request_article_id', true );
						$content_topic      = (string) get_post_meta( $post_id, 'latest_content_request_topic', true );
						$review_client_group = (string) get_post_meta( $post_id, 'latest_review_campaign_client_group', true );
						$review_campaign_at  = (string) get_post_meta( $post_id, 'latest_review_campaign_requested_at', true );
						$review_business_url = (string) get_post_meta( $post_id, 'latest_review_campaign_google_business_url', true );
						if ( ! $review_business_url ) {
							$review_business_url = (string) get_post_meta( $post_id, 'google_business_profile_url', true );
						}
						$review_request_url = (string) get_post_meta( $post_id, 'latest_review_campaign_google_review_url', true );
						if ( ! $review_request_url ) {
							$review_request_url = (string) get_post_meta( $post_id, 'google_review_request_url', true );
						}
						$review_place_id = (string) get_post_meta( $post_id, 'latest_review_campaign_google_place_id', true );
						if ( ! $review_place_id ) {
							$review_place_id = (string) get_post_meta( $post_id, 'google_place_id', true );
						}
						$mini_fields = array(
							'Headline' => get_post_meta( $post_id, 'profile_headline', true ),
							'Services' => get_post_meta( $post_id, 'profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'profile_faqs', true ),
						);
						$pending_fields = array(
							'Headline' => get_post_meta( $post_id, 'pending_profile_headline', true ),
							'Services' => get_post_meta( $post_id, 'pending_profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'pending_profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'pending_profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'pending_profile_faqs', true ),
						);
						$internal_notes = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
						$recent_notes   = array_slice( array_filter( array_map( 'trim', explode( "\n", $internal_notes ) ) ), -3 );
						?>
						<tr>
							<td><strong><?php echo esc_html( get_the_title() ); ?></strong></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'phone', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'email', true ) ?: '-' ); ?></td>
							<td>
								<strong><?php echo esc_html( justice_theme_lawyer_onboarding_plan_label( $plan ) ); ?></strong>
								<?php if ( $plan ) : ?>
									<br><small><?php echo esc_html( $plan ); ?></small>
								<?php endif; ?>
							</td>
							<td>
								<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $sales_priority['style'] ); ?>">
									<?php echo esc_html( $sales_priority['label'] ); ?>
								</span>
								<p style="margin:0;"><?php echo esc_html( $sales_priority['note'] ); ?></p>
								<p style="margin:8px 0 0;">
									<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $activation_badge['style'] ); ?>">
										<?php echo esc_html( $activation_badge['label'] ); ?>
									</span>
									<?php if ( $first_value_at ) : ?>
										<br><small>First value: <?php echo esc_html( $first_value_at ); ?></small>
									<?php endif; ?>
								</p>
							</td>
							<td>
								<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_badge['style'] ); ?>">
									<?php echo esc_html( $payment_badge['label'] ); ?>
								</span>
								<p style="margin:0;"><?php echo esc_html( $payment_badge['note'] ); ?></p>
								<?php if ( $payment_path || $payment_followup ) : ?>
									<small><?php echo esc_html( trim( $payment_path . ' / ' . $payment_followup, ' /' ) ); ?></small>
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#fff3cd;color:#7a4b00;font-size:12px;">Pending update review</span>
								<?php endif; ?>
								<?php foreach ( $mini_fields as $label => $value ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:<?php echo $value ? '#e7f7ed' : '#f1f1f1'; ?>;color:<?php echo $value ? '#17643a' : '#666'; ?>;font-size:12px;">
										<?php echo esc_html( $label . ': ' . ( $value ? 'YES' : 'NO' ) ); ?>
									</span>
								<?php endforeach; ?>
							</td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<?php foreach ( $pending_fields as $label => $value ) : ?>
										<?php if ( $value ) : ?>
											<p style="margin:0 0 6px;"><strong><?php echo esc_html( $label ); ?>:</strong> <?php echo esc_html( wp_html_excerpt( (string) $value, 120, '...' ) ); ?></p>
										<?php endif; ?>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_content ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#e7f0ff;color:#16427a;font-size:12px;">Pending content review</span>
									<p style="margin:0 0 6px;"><?php echo esc_html( $content_topic ?: '-' ); ?></p>
									<?php if ( $content_article_id ) : ?>
										<a href="<?php echo esc_url( get_edit_post_link( $content_article_id, '' ) ); ?>">Review draft</a>
									<?php endif; ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_mark_lawyer_content_reviewed&lawyer_id=' . $post_id ), 'justice_mark_lawyer_content_reviewed_' . $post_id ) ); ?>">Mark reviewed</a>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_review_campaign ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;">Review campaign requested</span>
									<p style="margin:0 0 6px;"><strong>Client group:</strong> <?php echo esc_html( $review_client_group ?: '-' ); ?></p>
									<?php if ( $review_business_url ) : ?>
										<p style="margin:0 0 6px;"><strong>Google profile:</strong> <a href="<?php echo esc_url( $review_business_url ); ?>" target="_blank" rel="noopener noreferrer">Open</a></p>
									<?php else : ?>
										<p style="margin:0 0 6px;color:#8a6d3b;"><strong>Google profile:</strong> missing</p>
									<?php endif; ?>
									<?php if ( $review_request_url ) : ?>
										<p style="margin:0 0 6px;"><strong>Review request link:</strong> <a href="<?php echo esc_url( $review_request_url ); ?>" target="_blank" rel="noopener noreferrer">Open</a></p>
									<?php else : ?>
										<p style="margin:0 0 6px;color:#8a6d3b;"><strong>Review request link:</strong> missing</p>
									<?php endif; ?>
									<?php if ( $review_place_id ) : ?>
										<p style="margin:0 0 6px;"><strong>Place ID:</strong> <code><?php echo esc_html( $review_place_id ); ?></code></p>
									<?php endif; ?>
									<?php if ( $review_campaign_at ) : ?>
										<small><?php echo esc_html( $review_campaign_at ); ?></small>
									<?php endif; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $recent_notes ) : ?>
									<?php foreach ( $recent_notes as $note ) : ?>
										<p style="margin:0 0 6px;"><?php echo esc_html( wp_html_excerpt( $note, 140, '...' ) ); ?></p>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $status ); ?></td>
							<td><?php echo esc_html( get_the_date() ); ?></td>
							<td>
								<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Review</a>
								<?php if ( $has_pending_update ) : ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_apply_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_apply_lawyer_profile_update_' . $post_id ) ); ?>">Apply pending update</a>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_discard_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_discard_lawyer_profile_update_' . $post_id ) ); ?>">Discard pending update</a>
								<?php endif; ?>
							</td>
						</tr>
					<?php endwhile; ?>
				</tbody>
			</table>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<div class="notice notice-info inline">
				<p>No pending lawyer self-registration drafts found.</p>
			</div>
		<?php endif; ?>
	</div>
	<?php
}
