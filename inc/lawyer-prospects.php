<?php
/**
 * Internal lawyer outreach pipeline.
 *
 * This is an admin-only sales tool. It tracks lawyers the owner may contact
 * for paid coverage in a practice area/city, especially where the CRM shows
 * repeated user demand but no paying coverage partner yet.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_prospect_cpt(): void {
	$labels = array(
		'name'          => __( 'Lawyer Prospects', 'justice-theme' ),
		'singular_name' => __( 'Lawyer Prospect', 'justice-theme' ),
		'add_new_item'  => __( 'Add Lawyer Prospect', 'justice-theme' ),
		'edit_item'     => __( 'Edit Lawyer Prospect', 'justice-theme' ),
		'menu_name'     => __( 'Lawyer Prospects', 'justice-theme' ),
	);

	register_post_type(
		'justice_prospect',
		array(
			'labels'          => $labels,
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => 'justice-lawyer-onboarding',
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'has_archive'     => false,
			'rewrite'         => false,
			'show_in_rest'    => false,
		)
	);
}
add_action( 'init', 'justice_theme_register_lawyer_prospect_cpt' );

function justice_theme_register_lawyer_prospect_meta(): void {
	$fields = array(
		'prospect_firm_name'           => 'string',
		'prospect_practice_area'       => 'string',
		'prospect_city'                => 'string',
		'prospect_target_plan'         => 'string',
		'prospect_priority'            => 'string',
		'prospect_outreach_status'     => 'string',
		'prospect_response_fit'        => 'string',
		'prospect_contact_name'        => 'string',
		'prospect_contact_email'       => 'string',
		'prospect_contact_phone'       => 'string',
		'prospect_source_url'          => 'string',
		'prospect_source_lead_id'      => 'integer',
		'prospect_demand_signal'       => 'string',
		'prospect_next_action_at'      => 'string',
		'prospect_last_contacted_at'   => 'string',
		'prospect_expected_monthly_nis' => 'integer',
		'prospect_agreed_lead_fee_ils' => 'integer',
		'prospect_billing_contact_email' => 'string',
		'prospect_lead_fee_terms_ready' => 'string',
		'prospect_terms_note'          => 'string',
		'prospect_owner_note'          => 'string',
		'prospect_license_verified'    => 'string',
		'prospect_specialty_verified'  => 'string',
		'prospect_payment_path_ready'  => 'string',
		'prospect_verification_note'   => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta(
			'justice_prospect',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => justice_theme_lawyer_prospect_meta_sanitizer( $key ),
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_lawyer_prospect_meta' );

function justice_theme_lawyer_prospect_meta_sanitizer( string $key ): string {
	if ( 'prospect_source_url' === $key ) {
		return 'esc_url_raw';
	}

	if ( in_array( $key, array( 'prospect_contact_email', 'prospect_billing_contact_email' ), true ) ) {
		return 'sanitize_email';
	}

	if ( in_array( $key, array( 'prospect_expected_monthly_nis', 'prospect_agreed_lead_fee_ils' ), true ) ) {
		return 'absint';
	}

	if ( 'prospect_source_lead_id' === $key ) {
		return 'absint';
	}

	if ( in_array( $key, array( 'prospect_demand_signal', 'prospect_terms_note', 'prospect_owner_note', 'prospect_verification_note' ), true ) ) {
		return 'sanitize_textarea_field';
	}

	return 'sanitize_text_field';
}

function justice_theme_lawyer_prospect_statuses(): array {
	return array(
		'research'     => __( 'Research', 'justice-theme' ),
		'ready'        => __( 'Ready to contact', 'justice-theme' ),
		'contacted'    => __( 'Contacted', 'justice-theme' ),
		'follow_up'    => __( 'Follow-up needed', 'justice-theme' ),
		'demo_booked'  => __( 'Demo / call booked', 'justice-theme' ),
		'proposal_sent' => __( 'Proposal sent', 'justice-theme' ),
		'won'          => __( 'Won / onboarding', 'justice-theme' ),
		'lost'         => __( 'Lost / not fit', 'justice-theme' ),
	);
}

function justice_theme_lawyer_prospect_priorities(): array {
	return array(
		'hot'    => __( 'Hot', 'justice-theme' ),
		'warm'   => __( 'Warm', 'justice-theme' ),
		'cold'   => __( 'Cold', 'justice-theme' ),
		'parked' => __( 'Parked', 'justice-theme' ),
	);
}

function justice_theme_lawyer_prospect_plan_options(): array {
	return array(
		'pro'          => __( 'Pro', 'justice-theme' ),
		'featured'     => __( 'Featured', 'justice-theme' ),
		'lead_partner' => __( 'Lead Partner', 'justice-theme' ),
		'full_service' => __( 'Full Service', 'justice-theme' ),
		'unknown'      => __( 'Unknown / to qualify', 'justice-theme' ),
	);
}

function justice_theme_lawyer_prospect_response_fit_options(): array {
	return function_exists( 'justice_theme_lawyer_response_commitment_options' )
		? justice_theme_lawyer_response_commitment_options()
		: array(
			''              => 'Not provided',
			'within_15_min' => 'Can respond within 15 minutes during business hours',
			'same_day'      => 'Can respond same business day',
			'next_day'      => 'Usually next business day',
			'not_sure'      => 'Needs response process setup',
		);
}

function justice_theme_lawyer_prospect_verification_missing( int $post_id ): array {
	$missing = array();

	if ( '1' !== (string) get_post_meta( $post_id, 'prospect_license_verified', true ) ) {
		$missing[] = __( 'license', 'justice-theme' );
	}

	if ( '1' !== (string) get_post_meta( $post_id, 'prospect_specialty_verified', true ) ) {
		$missing[] = __( 'specialty', 'justice-theme' );
	}

	$response_fit = (string) get_post_meta( $post_id, 'prospect_response_fit', true );
	if ( ! in_array( $response_fit, array( 'within_15_min', 'same_day' ), true ) ) {
		$missing[] = __( 'same-day response', 'justice-theme' );
	}

	if ( '1' !== (string) get_post_meta( $post_id, 'prospect_payment_path_ready', true ) ) {
		$missing[] = __( 'manual payment path', 'justice-theme' );
	}

	$agreed_lead_fee = absint( get_post_meta( $post_id, 'prospect_agreed_lead_fee_ils', true ) );
	if ( '1' !== (string) get_post_meta( $post_id, 'prospect_lead_fee_terms_ready', true ) || $agreed_lead_fee <= 0 ) {
		$missing[] = __( 'lead fee terms', 'justice-theme' );
	}

	$billing_contact_email = (string) get_post_meta( $post_id, 'prospect_billing_contact_email', true );
	if ( ! is_email( $billing_contact_email ) ) {
		$missing[] = __( 'billing contact', 'justice-theme' );
	}

	return $missing;
}

function justice_theme_lawyer_prospect_is_verified_for_routing( int $post_id ): bool {
	return empty( justice_theme_lawyer_prospect_verification_missing( $post_id ) );
}

function justice_theme_lawyer_prospect_verification_meta_clause( string $filter ): array {
	$response_ready = array( 'within_15_min', 'same_day' );
	$open_statuses  = array(
		'relation' => 'OR',
		array(
			'key'     => 'prospect_outreach_status',
			'compare' => 'NOT EXISTS',
		),
		array(
			'key'     => 'prospect_outreach_status',
			'value'   => array( 'won', 'lost' ),
			'compare' => 'NOT IN',
		),
	);

	if ( 'ready' === $filter ) {
		return array(
			'relation' => 'AND',
			$open_statuses,
			array(
				'key'   => 'prospect_license_verified',
				'value' => '1',
			),
			array(
				'key'   => 'prospect_specialty_verified',
				'value' => '1',
			),
			array(
				'key'     => 'prospect_response_fit',
				'value'   => $response_ready,
				'compare' => 'IN',
			),
			array(
				'key'   => 'prospect_payment_path_ready',
				'value' => '1',
			),
			array(
				'key'   => 'prospect_lead_fee_terms_ready',
				'value' => '1',
			),
			array(
				'key'     => 'prospect_agreed_lead_fee_ils',
				'value'   => 0,
				'compare' => '>',
				'type'    => 'NUMERIC',
			),
			array(
				'key'     => 'prospect_billing_contact_email',
				'value'   => '',
				'compare' => '!=',
			),
		);
	}

	return array(
		'relation' => 'AND',
		$open_statuses,
		array(
			'relation' => 'OR',
			array(
				'key'     => 'prospect_license_verified',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_license_verified',
				'value'   => '1',
				'compare' => '!=',
			),
			array(
				'key'     => 'prospect_specialty_verified',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_specialty_verified',
				'value'   => '1',
				'compare' => '!=',
			),
			array(
				'key'     => 'prospect_response_fit',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_response_fit',
				'value'   => $response_ready,
				'compare' => 'NOT IN',
			),
			array(
				'key'     => 'prospect_payment_path_ready',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_payment_path_ready',
				'value'   => '1',
				'compare' => '!=',
			),
			array(
				'key'     => 'prospect_lead_fee_terms_ready',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_lead_fee_terms_ready',
				'value'   => '1',
				'compare' => '!=',
			),
			array(
				'key'     => 'prospect_agreed_lead_fee_ils',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_agreed_lead_fee_ils',
				'value'   => 0,
				'compare' => '<=',
				'type'    => 'NUMERIC',
			),
			array(
				'key'     => 'prospect_billing_contact_email',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_billing_contact_email',
				'value'   => '',
				'compare' => '=',
			),
		),
	);
}

function justice_theme_lawyer_prospect_prefill_lead_id(): int {
	$lead_id = isset( $_GET['from_lead'] ) ? absint( wp_unslash( $_GET['from_lead'] ) ) : 0;
	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) || ! current_user_can( 'edit_post', $lead_id ) ) {
		return 0;
	}

	$nonce = isset( $_GET['justice_prospect_from_lead_nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['justice_prospect_from_lead_nonce'] ) ) : '';
	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_create_prospect_from_lead_' . $lead_id ) ) {
		return 0;
	}

	return $lead_id;
}

function justice_theme_lawyer_prospect_lead_meta_first( int $lead_id, array $keys ): string {
	foreach ( $keys as $key ) {
		$value = get_post_meta( $lead_id, $key, true );
		if ( '' !== (string) $value ) {
			return (string) $value;
		}
	}

	return '';
}

function justice_theme_lawyer_prospect_lead_area_label( int $lead_id ): string {
	$area = justice_theme_lawyer_prospect_lead_meta_first( $lead_id, array( 'ai_detected_area', 'legal_area', 'lead_area' ) );
	if ( ! $area ) {
		return '';
	}

	return function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( $area ) : $area;
}

function justice_theme_lawyer_prospect_lead_market_label( int $lead_id ): string {
	return justice_theme_lawyer_prospect_lead_meta_first( $lead_id, array( 'city', 'lead_city', 'jurisdiction', 'country', 'lead_country' ) );
}

function justice_theme_lawyer_prospect_request_prefill( string $key ): string {
	if ( ! isset( $_GET[ $key ] ) ) {
		return '';
	}

	$value = wp_unslash( $_GET[ $key ] );
	if ( is_array( $value ) ) {
		return '';
	}

	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}

	if ( 'prospect_source_url' === $key ) {
		return esc_url_raw( $value );
	}

	if ( 'prospect_expected_monthly_nis' === $key || 'prospect_source_lead_id' === $key ) {
		return (string) absint( $value );
	}

	if ( in_array( $key, array( 'prospect_demand_signal', 'prospect_owner_note', 'prospect_verification_note' ), true ) ) {
		return sanitize_textarea_field( $value );
	}

	$value = sanitize_text_field( $value );

	if ( 'prospect_target_plan' === $key && ! array_key_exists( $value, justice_theme_lawyer_prospect_plan_options() ) ) {
		return '';
	}

	if ( 'prospect_priority' === $key && ! array_key_exists( $value, justice_theme_lawyer_prospect_priorities() ) ) {
		return '';
	}

	if ( 'prospect_outreach_status' === $key && ! array_key_exists( $value, justice_theme_lawyer_prospect_statuses() ) ) {
		return '';
	}

	if ( 'prospect_response_fit' === $key && ! array_key_exists( $value, justice_theme_lawyer_prospect_response_fit_options() ) ) {
		return '';
	}

	return $value;
}

function justice_theme_lawyer_prospect_form_value( WP_Post $post, string $key ): string {
	$saved = (string) get_post_meta( $post->ID, $key, true );
	if ( '' !== $saved || 'auto-draft' !== $post->post_status ) {
		return $saved;
	}

	$request_prefill = justice_theme_lawyer_prospect_request_prefill( $key );
	if ( '' !== $request_prefill ) {
		return $request_prefill;
	}

	$lead_id = justice_theme_lawyer_prospect_prefill_lead_id();
	if ( ! $lead_id ) {
		return '';
	}

	$area            = justice_theme_lawyer_prospect_lead_area_label( $lead_id );
	$market          = justice_theme_lawyer_prospect_lead_market_label( $lead_id );
	$coverage_status = (string) get_post_meta( $lead_id, 'coverage_status', true );
	$urgency         = strtolower( (string) get_post_meta( $lead_id, 'urgency', true ) );
	$message         = justice_theme_lawyer_prospect_lead_meta_first( $lead_id, array( 'message', 'lead_message', 'visitor_message' ) );
	$message_excerpt = $message ? wp_trim_words( wp_strip_all_tags( $message ), 32, '...' ) : '';

	switch ( $key ) {
		case 'prospect_practice_area':
			return $area;
		case 'prospect_city':
			return $market;
		case 'prospect_target_plan':
			return 'lead_partner';
		case 'prospect_priority':
			return ( 'urgent_manual' === $coverage_status || in_array( $urgency, array( 'high', 'urgent' ), true ) ) ? 'hot' : 'warm';
		case 'prospect_outreach_status':
			return 'ready';
		case 'prospect_source_url':
			return justice_theme_lawyer_prospect_lead_meta_first( $lead_id, array( 'source_url', 'landing_page', 'referrer_url' ) );
		case 'prospect_source_lead_id':
			return (string) $lead_id;
		case 'prospect_expected_monthly_nis':
			return '1490';
		case 'prospect_demand_signal':
			return trim(
				sprintf(
					'CRM lead #%d: %s / %s. Coverage status: %s. %s',
					$lead_id,
					$area ?: 'Unknown practice',
					$market ?: 'Unknown market',
					$coverage_status ?: 'not set',
					$message_excerpt ? 'Lead note: ' . $message_excerpt : ''
				)
			);
		case 'prospect_owner_note':
			return 'Created from Justice CRM lead #' . $lead_id . '. Validate license, fit and response speed before any paid placement promise.';
	}

	return '';
}

function justice_theme_lawyer_prospect_default_title( string $title, WP_Post $post ): string {
	if ( 'justice_prospect' !== $post->post_type || '' !== $title ) {
		return $title;
	}

	$prefill_area = justice_theme_lawyer_prospect_request_prefill( 'prospect_practice_area' );
	$prefill_city = justice_theme_lawyer_prospect_request_prefill( 'prospect_city' );
	$prefill_firm = justice_theme_lawyer_prospect_request_prefill( 'prospect_firm_name' );
	if ( $prefill_firm ) {
		return trim( 'BTL prospect: ' . $prefill_firm );
	}

	if ( $prefill_area || $prefill_city ) {
		return trim( 'Recruit coverage: ' . ( $prefill_area ?: 'Manual outreach' ) . ( $prefill_city ? ' / ' . $prefill_city : '' ) );
	}

	$lead_id = justice_theme_lawyer_prospect_prefill_lead_id();
	if ( ! $lead_id ) {
		return $title;
	}

	$area   = justice_theme_lawyer_prospect_lead_area_label( $lead_id ) ?: 'Uncovered demand';
	$market = justice_theme_lawyer_prospect_lead_market_label( $lead_id );

	return trim( 'Recruit coverage: ' . $area . ( $market ? ' / ' . $market : '' ) );
}
add_filter( 'default_title', 'justice_theme_lawyer_prospect_default_title', 10, 2 );

function justice_theme_lawyer_prospect_default_content( string $content, WP_Post $post ): string {
	if ( 'justice_prospect' !== $post->post_type || '' !== $content ) {
		return $content;
	}

	$prefill_source = justice_theme_lawyer_prospect_request_prefill( 'prospect_source_url' );
	$prefill_signal = justice_theme_lawyer_prospect_request_prefill( 'prospect_demand_signal' );
	if ( $prefill_source || $prefill_signal ) {
		return sprintf(
			"Source: Outreach Links batch\nRegistration URL: %s\n\nDemand signal: %s\n\nUse this record to contact one relevant lawyer manually, then mark Contacted, Follow-up, Demo, Proposal, Won or Lost. Do not promise outcomes, exclusivity or lead volume without approved plan language.",
			$prefill_source ?: '-',
			$prefill_signal ?: '-'
		);
	}

	$lead_id = justice_theme_lawyer_prospect_prefill_lead_id();
	if ( ! $lead_id ) {
		return $content;
	}

	return sprintf(
		"Source: Justice CRM lead #%d\nAdmin link: %s\n\nUse this record to research and contact a paid coverage partner. Do not promise outcomes, exclusivity or lead volume without approved plan language.",
		$lead_id,
		get_edit_post_link( $lead_id, '' )
	);
}
add_filter( 'default_content', 'justice_theme_lawyer_prospect_default_content', 10, 2 );

function justice_theme_lawyer_prospect_meta_boxes(): void {
	add_meta_box(
		'justice_theme_lawyer_prospect_details',
		__( 'Prospect Sales Details', 'justice-theme' ),
		'justice_theme_render_lawyer_prospect_details_box',
		'justice_prospect',
		'normal',
		'high'
	);

	add_meta_box(
		'justice_theme_lawyer_prospect_outreach',
		__( 'Manual Outreach Kit', 'justice-theme' ),
		'justice_theme_render_lawyer_prospect_outreach_box',
		'justice_prospect',
		'normal',
		'default'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_lawyer_prospect_meta_boxes' );

function justice_theme_render_lawyer_prospect_details_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_prospect_details', 'justice_theme_lawyer_prospect_details_nonce' );

	$status         = justice_theme_lawyer_prospect_form_value( $post, 'prospect_outreach_status' ) ?: 'research';
	$priority       = justice_theme_lawyer_prospect_form_value( $post, 'prospect_priority' ) ?: 'warm';
	$target_plan    = justice_theme_lawyer_prospect_form_value( $post, 'prospect_target_plan' ) ?: 'lead_partner';
	$response_fit   = justice_theme_lawyer_prospect_form_value( $post, 'prospect_response_fit' );
	$source_lead_id = absint( justice_theme_lawyer_prospect_form_value( $post, 'prospect_source_lead_id' ) );
	?>
	<p>Use this private pipeline to turn repeated user demand into paid lawyer coverage. Do not promise exclusivity, outcomes or lead volume unless the plan and Bar-compliant disclosures are approved.</p>
	<?php if ( $source_lead_id ) : ?>
		<input type="hidden" name="prospect_source_lead_id" value="<?php echo esc_attr( (string) $source_lead_id ); ?>">
		<p><strong>Source lead:</strong> <a href="<?php echo esc_url( get_edit_post_link( $source_lead_id, '' ) ); ?>">#<?php echo esc_html( (string) $source_lead_id ); ?></a></p>
	<?php endif; ?>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-prospect-status">Outreach status</label></th>
			<td>
				<select id="justice-prospect-status" name="prospect_outreach_status">
					<?php foreach ( justice_theme_lawyer_prospect_statuses() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $status, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-prospect-priority">Priority</label></th>
			<td>
				<select id="justice-prospect-priority" name="prospect_priority">
					<?php foreach ( justice_theme_lawyer_prospect_priorities() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $priority, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-prospect-target-plan">Target plan</label></th>
			<td>
				<select id="justice-prospect-target-plan" name="prospect_target_plan">
					<?php foreach ( justice_theme_lawyer_prospect_plan_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $target_plan, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-prospect-response-fit">Lead response fit</label></th>
			<td>
				<select id="justice-prospect-response-fit" name="prospect_response_fit">
					<?php foreach ( justice_theme_lawyer_prospect_response_fit_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $response_fit, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<?php
		$plain_fields = array(
			'prospect_firm_name'           => array( 'label' => 'Firm name', 'type' => 'text' ),
			'prospect_practice_area'       => array( 'label' => 'Practice area / niche', 'type' => 'text' ),
			'prospect_city'                => array( 'label' => 'City / coverage area', 'type' => 'text' ),
			'prospect_contact_name'        => array( 'label' => 'Contact name', 'type' => 'text' ),
			'prospect_contact_email'       => array( 'label' => 'Contact email', 'type' => 'email' ),
			'prospect_contact_phone'       => array( 'label' => 'Contact phone', 'type' => 'text' ),
			'prospect_source_url'          => array( 'label' => 'Source URL', 'type' => 'url' ),
			'prospect_next_action_at'      => array( 'label' => 'Next action date', 'type' => 'date' ),
			'prospect_last_contacted_at'   => array( 'label' => 'Last contacted date', 'type' => 'date' ),
			'prospect_expected_monthly_nis' => array( 'label' => 'Expected monthly NIS', 'type' => 'number' ),
		);
		foreach ( $plain_fields as $key => $field ) :
			?>
			<tr>
				<th scope="row"><label for="justice-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $field['label'] ); ?></label></th>
				<td><input id="justice-<?php echo esc_attr( $key ); ?>" type="<?php echo esc_attr( $field['type'] ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( justice_theme_lawyer_prospect_form_value( $post, $key ) ); ?>" class="regular-text"></td>
			</tr>
		<?php endforeach; ?>
		<tr>
			<th scope="row">Qualified lead terms</th>
			<td>
				<p style="margin-top:0;color:#646970;">Required before routing a paid/qualified lead. This keeps the first billable test honest: price, payer contact and terms must be recorded before the prospect becomes ready.</p>
				<p>
					<label for="justice-prospect-agreed-lead-fee-ils"><strong>Agreed lead fee ILS</strong></label><br>
					<input id="justice-prospect-agreed-lead-fee-ils" type="number" min="0" name="prospect_agreed_lead_fee_ils" value="<?php echo esc_attr( justice_theme_lawyer_prospect_form_value( $post, 'prospect_agreed_lead_fee_ils' ) ); ?>" class="regular-text">
				</p>
				<p>
					<label for="justice-prospect-billing-contact-email"><strong>Billing contact email</strong></label><br>
					<input id="justice-prospect-billing-contact-email" type="email" name="prospect_billing_contact_email" value="<?php echo esc_attr( justice_theme_lawyer_prospect_form_value( $post, 'prospect_billing_contact_email' ) ); ?>" class="regular-text">
				</p>
				<label><input type="checkbox" name="prospect_lead_fee_terms_ready" value="1" <?php checked( justice_theme_lawyer_prospect_form_value( $post, 'prospect_lead_fee_terms_ready' ), '1' ); ?>> Qualified lead price/terms accepted</label>
				<p><label for="justice-prospect-terms-note"><strong>Terms note</strong></label></p>
				<textarea id="justice-prospect-terms-note" name="prospect_terms_note" rows="3" class="large-text" placeholder="Record agreed lead price, cap, billing person, invoice path and any limits before routing leads."><?php echo esc_textarea( justice_theme_lawyer_prospect_form_value( $post, 'prospect_terms_note' ) ); ?></textarea>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-prospect-demand-signal">Demand signal</label></th>
			<td><textarea id="justice-prospect-demand-signal" name="prospect_demand_signal" rows="4" class="large-text" placeholder="Example: 3 Thailand-law calls this week, no paying coverage partner yet."><?php echo esc_textarea( justice_theme_lawyer_prospect_form_value( $post, 'prospect_demand_signal' ) ); ?></textarea></td>
		</tr>
		<tr>
			<th scope="row">Specialist verification</th>
			<td>
				<fieldset>
					<p style="margin-top:0;color:#646970;">Required before routing Bituach Leumi or other high-risk leads to this prospect. This is private owner data only.</p>
					<label><input type="checkbox" name="prospect_license_verified" value="1" <?php checked( justice_theme_lawyer_prospect_form_value( $post, 'prospect_license_verified' ), '1' ); ?>> Israeli Bar/license status checked</label><br>
					<label><input type="checkbox" name="prospect_specialty_verified" value="1" <?php checked( justice_theme_lawyer_prospect_form_value( $post, 'prospect_specialty_verified' ), '1' ); ?>> Relevant niche experience checked</label><br>
					<label><input type="checkbox" name="prospect_payment_path_ready" value="1" <?php checked( justice_theme_lawyer_prospect_form_value( $post, 'prospect_payment_path_ready' ), '1' ); ?>> Manual invoice/payment path accepted</label>
				</fieldset>
				<p><label for="justice-prospect-verification-note"><strong>Verification note</strong></label></p>
				<textarea id="justice-prospect-verification-note" name="prospect_verification_note" rows="3" class="large-text" placeholder="Record license source, niche proof, response commitment, and any limits before routing leads."><?php echo esc_textarea( justice_theme_lawyer_prospect_form_value( $post, 'prospect_verification_note' ) ); ?></textarea>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-prospect-owner-note">Owner note</label></th>
			<td><textarea id="justice-prospect-owner-note" name="prospect_owner_note" rows="4" class="large-text"><?php echo esc_textarea( justice_theme_lawyer_prospect_form_value( $post, 'prospect_owner_note' ) ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

function justice_theme_lawyer_prospect_display_value( int $post_id, string $key ): string {
	$value = (string) get_post_meta( $post_id, $key, true );
	if ( '' !== $value ) {
		return $value;
	}

	return '';
}

function justice_theme_lawyer_prospect_normalized_phone( string $phone ): string {
	$digits = preg_replace( '/[^0-9+]/', '', $phone );
	if ( ! $digits ) {
		return '';
	}

	if ( 0 === strpos( $digits, '0' ) ) {
		return '972' . substr( $digits, 1 );
	}

	if ( 0 === strpos( $digits, '+972' ) ) {
		return '972' . substr( $digits, 4 );
	}

	return ltrim( $digits, '+' );
}

function justice_theme_lawyer_prospect_outreach_message( WP_Post $post ): array {
	$post_id        = (int) $post->ID;
	$contact_name   = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_contact_name' );
	$firm_name      = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_firm_name' );
	$area           = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_practice_area' ) ?: 'your practice area';
	$city           = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_city' ) ?: 'your market';
	$target_plan    = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_target_plan' ) ?: 'lead_partner';
	$demand_signal  = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_demand_signal' );
	$source_url     = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_source_url' );
	$expected_value = (int) get_post_meta( $post_id, 'prospect_expected_monthly_nis', true );
	$lead_fee       = absint( get_post_meta( $post_id, 'prospect_agreed_lead_fee_ils', true ) );
	$billing_email  = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_billing_contact_email' );
	$response_fit   = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_response_fit' );
	$terms_note     = justice_theme_lawyer_prospect_display_value( $post_id, 'prospect_terms_note' );
	$missing        = justice_theme_lawyer_prospect_verification_missing( $post_id );
	$plan_label     = justice_theme_lawyer_prospect_plan_options()[ $target_plan ] ?? 'Lead Partner';
	$response_label = justice_theme_lawyer_prospect_response_fit_options()[ $response_fit ] ?? 'Not provided';
	$recipient      = $contact_name ?: ( $firm_name ?: 'there' );
	$area_slug      = sanitize_title( $area );
	$city_slug      = sanitize_title( $city );
	$tracking_args  = array(
		'plan_interest'     => $target_plan,
		'payment_path'      => 'manual_invoice',
		'utm_source'        => 'prospect_pipeline',
		'utm_medium'        => 'manual_outreach',
		'utm_campaign'      => 'prospect_' . $post_id,
		'utm_content'       => sanitize_key( $target_plan . '_manual_message' ),
		'outreach_segment'  => trim( ( $area_slug ?: 'manual-practice' ) . '_' . ( $city_slug ?: 'manual-city' ), '_' ),
		'outreach_city'     => $city_slug ?: 'manual-city',
		'outreach_practice' => $area_slug ?: 'manual-practice',
	);
	$registration   = add_query_arg( $tracking_args, home_url( '/lawyer-registration/' ) );

	if ( $source_url && false !== strpos( $source_url, '/lawyer-registration/' ) ) {
		$registration = esc_url_raw( $source_url );
	}

	$subject = sprintf( 'Jus-Tice paid coverage fit: %s / %s', $area, $city );
	$body    = sprintf(
		"Hi %s,\n\nI am Ben from Jus-Tice. We are seeing legal-search demand for %s in %s, and I am checking whether your office is a fit for paid coverage on the platform.\n\nSignal we are tracking: %s\n\nThe offer is transparent: a professional profile, dashboard, and lead-handling path under the %s plan. We do not promise results, case volume, or outcomes. We first check license, practice fit, and response speed.\n\nIf this is relevant, please open this short form and we will review fit:\n%s\n\nBest,\nBen / Jus-Tice",
		$recipient,
		$area,
		$city,
		$demand_signal ?: 'users are asking for this practice/market and we need verified paid coverage',
		$plan_label,
		$registration
	);

	$call = sprintf(
		"Call opener:\nHi %s, this is Ben from Jus-Tice. I am calling because we are seeing demand for %s in %s and I want to check if your office wants to be considered for paid coverage.\n\nThree questions:\n1. Is this a practice area you actively want more clients for?\n2. Can someone respond to qualified leads the same day, ideally faster?\n3. If the fit is right, should I send the short partner form?\n\nCompliance line:\nWe do not promise lead volume or outcomes. We are checking transparent paid coverage and fit.",
		$recipient,
		$area,
		$city
	);
	$acceptance = sprintf(
		"Jus-Tice specialist acceptance note\n\nProspect: %s\nPractice/city: %s / %s\nTarget plan: %s\nAgreed qualified-lead fee: %s\nBilling contact: %s\nResponse commitment: %s\n\nTerms to confirm before routing:\n1. Qualified leads are routed only after Jus-Tice records user contact details, practice fit and owner/CRM quality review.\n2. No ranking, exclusivity, case volume, compensation amount or outcome is promised.\n3. The specialist confirms the relevant license/status, niche experience and capacity limits before receiving leads.\n4. Manual invoice/payment is accepted until automated payment setup is fully active.\n5. A lead may be marked Paid only after invoice/reference or payment evidence exists in the CRM.\n\nCurrent missing routing checks: %s\nOwner terms note: %s",
		$recipient,
		$area,
		$city,
		$plan_label,
		$lead_fee > 0 ? number_format_i18n( $lead_fee ) . ' ILS per qualified lead' : 'not recorded yet',
		$billing_email ?: 'not recorded yet',
		$response_label,
		empty( $missing ) ? 'none' : implode( ', ', $missing ),
		$terms_note ?: 'none'
	);

	return array(
		'subject'        => $subject,
		'body'           => $body,
		'call'           => $call,
		'acceptance'     => $acceptance,
		'registration'   => $registration,
		'expected_value' => $expected_value,
		'lead_fee'       => $lead_fee,
	);
}

function justice_theme_render_lawyer_prospect_outreach_box( WP_Post $post ): void {
	$email   = justice_theme_lawyer_prospect_display_value( $post->ID, 'prospect_contact_email' );
	$phone   = justice_theme_lawyer_prospect_display_value( $post->ID, 'prospect_contact_phone' );
	$message = justice_theme_lawyer_prospect_outreach_message( $post );

	$mailto = $email ? add_query_arg(
		array(
			'subject' => $message['subject'],
			'body'    => $message['body'],
		),
		'mailto:' . $email
	) : '';

	$whatsapp_phone = $phone ? justice_theme_lawyer_prospect_normalized_phone( $phone ) : '';
	$whatsapp       = $whatsapp_phone ? add_query_arg(
		'text',
		$message['body'],
		'https://wa.me/' . $whatsapp_phone
	) : '';
	?>
	<p><strong>Manual-send only.</strong> This kit prepares a compliant first touch. It does not send anything automatically.</p>
	<p>Keep the message short, tied to the demand signal, and avoid promises about results, exclusivity or lead volume.</p>
	<p>
		<?php if ( $mailto ) : ?>
			<a class="button button-primary" href="<?php echo esc_url( $mailto ); ?>">Open email draft</a>
		<?php endif; ?>
		<?php if ( $whatsapp ) : ?>
			<a class="button" href="<?php echo esc_url( $whatsapp ); ?>" target="_blank" rel="noopener">Open WhatsApp draft</a>
		<?php endif; ?>
		<a class="button" href="<?php echo esc_url( $message['registration'] ); ?>" target="_blank" rel="noopener">Partner form</a>
	</p>
	<?php if ( ! $mailto && ! $whatsapp ) : ?>
		<div class="notice notice-warning inline"><p>Add a contact email or phone number to enable outreach draft buttons.</p></div>
	<?php endif; ?>
	<p><strong>Expected monthly value:</strong> <?php echo esc_html( number_format_i18n( (int) $message['expected_value'] ) ); ?> NIS</p>
	<p><strong>Agreed lead fee:</strong> <?php echo $message['lead_fee'] ? esc_html( number_format_i18n( (int) $message['lead_fee'] ) . ' NIS' ) : esc_html__( 'Not recorded yet', 'justice-theme' ); ?></p>
	<label for="justice-prospect-email-draft"><strong>Email / WhatsApp draft</strong></label>
	<textarea id="justice-prospect-email-draft" readonly rows="11" class="large-text"><?php echo esc_textarea( $message['body'] ); ?></textarea>
	<label for="justice-prospect-call-script" style="display:block;margin-top:12px;"><strong>Call script</strong></label>
	<textarea id="justice-prospect-call-script" readonly rows="9" class="large-text"><?php echo esc_textarea( $message['call'] ); ?></textarea>
	<label for="justice-prospect-acceptance-note" style="display:block;margin-top:12px;"><strong>Terms acceptance note</strong></label>
	<textarea id="justice-prospect-acceptance-note" readonly rows="12" class="large-text"><?php echo esc_textarea( $message['acceptance'] ); ?></textarea>
	<p style="margin-top:14px;"><strong>Pipeline quick actions</strong></p>
	<p>
		<?php foreach ( justice_theme_lawyer_prospect_quick_actions() as $action_key => $action ) : ?>
			<a class="button" href="<?php echo esc_url( justice_theme_lawyer_prospect_quick_action_url( $post->ID, $action_key ) ); ?>"><?php echo esc_html( $action['label'] ); ?></a>
		<?php endforeach; ?>
	</p>
	<?php
}

function justice_theme_lawyer_prospect_quick_actions(): array {
	return array(
		'contacted'     => array(
			'label'         => 'Mark contacted today',
			'status'        => 'contacted',
			'last_contacted' => true,
			'next_days'     => 2,
		),
		'follow_up'     => array(
			'label'         => 'Set follow-up',
			'status'        => 'follow_up',
			'last_contacted' => true,
			'next_days'     => 3,
		),
		'demo_booked'   => array(
			'label'     => 'Demo booked',
			'status'    => 'demo_booked',
			'next_days' => 1,
		),
		'proposal_sent' => array(
			'label'         => 'Proposal sent',
			'status'        => 'proposal_sent',
			'last_contacted' => true,
			'next_days'     => 5,
		),
		'won'           => array(
			'label'      => 'Won / onboarding',
			'status'     => 'won',
			'clear_next' => true,
		),
		'lost'          => array(
			'label'      => 'Lost / not fit',
			'status'     => 'lost',
			'priority'   => 'parked',
			'clear_next' => true,
		),
	);
}

function justice_theme_lawyer_prospect_quick_action_url( int $post_id, string $action_key ): string {
	if ( ! current_user_can( 'edit_post', $post_id ) || ! array_key_exists( $action_key, justice_theme_lawyer_prospect_quick_actions() ) ) {
		return '';
	}

	$url = add_query_arg(
		array(
			'action'       => 'justice_lawyer_prospect_quick_action',
			'prospect_id'  => $post_id,
			'prospect_step' => $action_key,
		),
		admin_url( 'admin-post.php' )
	);

	return wp_nonce_url( $url, 'justice_lawyer_prospect_quick_action_' . $post_id . '_' . $action_key, 'justice_prospect_action_nonce' );
}

function justice_theme_lawyer_prospect_handle_quick_action(): void {
	$post_id    = isset( $_GET['prospect_id'] ) ? absint( wp_unslash( $_GET['prospect_id'] ) ) : 0;
	$action_key = isset( $_GET['prospect_step'] ) ? sanitize_key( wp_unslash( $_GET['prospect_step'] ) ) : '';
	$actions    = justice_theme_lawyer_prospect_quick_actions();

	if ( ! $post_id || 'justice_prospect' !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) || ! array_key_exists( $action_key, $actions ) ) {
		wp_die( esc_html__( 'You do not have permission to update this prospect.', 'justice-theme' ) );
	}

	$nonce = isset( $_GET['justice_prospect_action_nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['justice_prospect_action_nonce'] ) ) : '';
	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_lawyer_prospect_quick_action_' . $post_id . '_' . $action_key ) ) {
		wp_die( esc_html__( 'Security check failed.', 'justice-theme' ) );
	}

	$action = $actions[ $action_key ];
	$today  = current_time( 'Y-m-d' );
	$blocked_won = false;
	$missing     = array();

	if ( 'won' === $action['status'] ) {
		$missing = justice_theme_lawyer_prospect_verification_missing( $post_id );
		if ( ! empty( $missing ) ) {
			$blocked_won = true;
			$action['status'] = 'proposal_sent';
			$action['next_days'] = 1;
			unset( $action['clear_next'] );
		}
	}

	update_post_meta( $post_id, 'prospect_outreach_status', $action['status'] );

	if ( ! empty( $action['last_contacted'] ) ) {
		update_post_meta( $post_id, 'prospect_last_contacted_at', $today );
	}

	if ( ! empty( $action['priority'] ) ) {
		update_post_meta( $post_id, 'prospect_priority', sanitize_key( $action['priority'] ) );
	}

	if ( ! empty( $action['clear_next'] ) ) {
		delete_post_meta( $post_id, 'prospect_next_action_at' );
	} elseif ( ! empty( $action['next_days'] ) ) {
		$next_timestamp = strtotime( '+' . absint( $action['next_days'] ) . ' days', current_time( 'timestamp' ) );
		update_post_meta( $post_id, 'prospect_next_action_at', $next_timestamp ? wp_date( 'Y-m-d', $next_timestamp ) : $today );
	}

	$note     = (string) get_post_meta( $post_id, 'prospect_owner_note', true );
	$log_line = $blocked_won
		? sprintf( '[%s] Won / onboarding held at Proposal sent. Missing before routing: %s.', $today, implode( ', ', $missing ) )
		: sprintf( '[%s] Quick action: %s.', $today, $action['label'] );
	update_post_meta( $post_id, 'prospect_owner_note', trim( $note . "\n" . $log_line ) );

	$redirect = add_query_arg(
		'justice_prospect_quick_action',
		$blocked_won ? 'won_blocked' : $action_key,
		get_edit_post_link( $post_id, '' )
	);
	wp_safe_redirect( $redirect );
	exit;
}
add_action( 'admin_post_justice_lawyer_prospect_quick_action', 'justice_theme_lawyer_prospect_handle_quick_action' );

function justice_theme_lawyer_prospect_quick_action_notice(): void {
	if ( empty( $_GET['justice_prospect_quick_action'] ) ) {
		return;
	}

	$action_key = sanitize_key( wp_unslash( $_GET['justice_prospect_quick_action'] ) );
	$actions    = justice_theme_lawyer_prospect_quick_actions();
	if ( 'won_blocked' === $action_key ) {
		echo '<div class="notice notice-warning is-dismissible"><p>' . esc_html__( 'Prospect was not marked Won / onboarding because routing checks are still missing. It was held at Proposal sent.', 'justice-theme' ) . '</p></div>';
		return;
	}

	if ( ! array_key_exists( $action_key, $actions ) ) {
		return;
	}

	echo '<div class="notice notice-success is-dismissible"><p>' . esc_html( 'Prospect updated: ' . $actions[ $action_key ]['label'] ) . '</p></div>';
}
add_action( 'admin_notices', 'justice_theme_lawyer_prospect_quick_action_notice' );

function justice_theme_save_lawyer_prospect_details( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_prospect_details_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_prospect_details_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_prospect_details' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$select_fields = array(
		'prospect_outreach_status' => array( 'default' => 'research', 'options' => justice_theme_lawyer_prospect_statuses() ),
		'prospect_priority'        => array( 'default' => 'warm', 'options' => justice_theme_lawyer_prospect_priorities() ),
		'prospect_target_plan'     => array( 'default' => 'lead_partner', 'options' => justice_theme_lawyer_prospect_plan_options() ),
		'prospect_response_fit'    => array( 'default' => '', 'options' => justice_theme_lawyer_prospect_response_fit_options() ),
	);

	foreach ( $select_fields as $key => $field ) {
		$value = isset( $_POST[ $key ] ) ? sanitize_key( wp_unslash( $_POST[ $key ] ) ) : $field['default'];
		if ( ! array_key_exists( $value, $field['options'] ) ) {
			$value = $field['default'];
		}
		update_post_meta( $post_id, $key, $value );
	}

	$text_fields = array(
		'prospect_firm_name',
		'prospect_practice_area',
		'prospect_city',
		'prospect_contact_name',
		'prospect_contact_email',
		'prospect_contact_phone',
		'prospect_next_action_at',
		'prospect_last_contacted_at',
	);
	foreach ( $text_fields as $key ) {
		$value = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
		update_post_meta( $post_id, $key, 'prospect_contact_email' === $key ? sanitize_email( $value ) : sanitize_text_field( $value ) );
	}

	update_post_meta( $post_id, 'prospect_source_url', isset( $_POST['prospect_source_url'] ) ? esc_url_raw( wp_unslash( $_POST['prospect_source_url'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_source_lead_id', isset( $_POST['prospect_source_lead_id'] ) ? absint( wp_unslash( $_POST['prospect_source_lead_id'] ) ) : 0 );
	update_post_meta( $post_id, 'prospect_expected_monthly_nis', isset( $_POST['prospect_expected_monthly_nis'] ) ? absint( wp_unslash( $_POST['prospect_expected_monthly_nis'] ) ) : 0 );
	update_post_meta( $post_id, 'prospect_agreed_lead_fee_ils', isset( $_POST['prospect_agreed_lead_fee_ils'] ) ? absint( wp_unslash( $_POST['prospect_agreed_lead_fee_ils'] ) ) : 0 );
	update_post_meta( $post_id, 'prospect_billing_contact_email', isset( $_POST['prospect_billing_contact_email'] ) ? sanitize_email( wp_unslash( $_POST['prospect_billing_contact_email'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_demand_signal', isset( $_POST['prospect_demand_signal'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_demand_signal'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_terms_note', isset( $_POST['prospect_terms_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_terms_note'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_owner_note', isset( $_POST['prospect_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_owner_note'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_verification_note', isset( $_POST['prospect_verification_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_verification_note'] ) ) : '' );

	foreach ( array( 'prospect_license_verified', 'prospect_specialty_verified', 'prospect_payment_path_ready', 'prospect_lead_fee_terms_ready' ) as $checkbox_key ) {
		update_post_meta( $post_id, $checkbox_key, isset( $_POST[ $checkbox_key ] ) ? '1' : '' );
	}

	if ( 'won' === (string) get_post_meta( $post_id, 'prospect_outreach_status', true ) ) {
		$missing = justice_theme_lawyer_prospect_verification_missing( $post_id );
		if ( ! empty( $missing ) ) {
			update_post_meta( $post_id, 'prospect_outreach_status', 'proposal_sent' );
			if ( ! get_post_meta( $post_id, 'prospect_next_action_at', true ) ) {
				$next_timestamp = strtotime( '+1 day', current_time( 'timestamp' ) );
				update_post_meta( $post_id, 'prospect_next_action_at', $next_timestamp ? wp_date( 'Y-m-d', $next_timestamp ) : current_time( 'Y-m-d' ) );
			}

			$owner_note = (string) get_post_meta( $post_id, 'prospect_owner_note', true );
			$log_line   = sprintf( '[%s] Won / onboarding held at Proposal sent. Missing before routing: %s.', current_time( 'Y-m-d' ), implode( ', ', $missing ) );
			update_post_meta( $post_id, 'prospect_owner_note', trim( $owner_note . "\n" . $log_line ) );
		}
	}
}
add_action( 'save_post_justice_prospect', 'justice_theme_save_lawyer_prospect_details' );

function justice_theme_lawyer_prospect_admin_columns( array $columns ): array {
	$columns['prospect_area']     = __( 'Area / city', 'justice-theme' );
	$columns['prospect_plan']     = __( 'Target plan', 'justice-theme' );
	$columns['prospect_value']    = __( 'Monthly value', 'justice-theme' );
	$columns['prospect_status']   = __( 'Status', 'justice-theme' );
	$columns['prospect_verification'] = __( 'Verification', 'justice-theme' );
	$columns['prospect_priority'] = __( 'Priority', 'justice-theme' );
	$columns['prospect_contact']  = __( 'Contact', 'justice-theme' );
	$columns['prospect_next']     = __( 'Next action', 'justice-theme' );
	$columns['prospect_actions']  = __( 'Quick actions', 'justice-theme' );
	return $columns;
}
add_filter( 'manage_justice_prospect_posts_columns', 'justice_theme_lawyer_prospect_admin_columns' );

function justice_theme_lawyer_prospect_sortable_columns( array $columns ): array {
	$columns['prospect_value'] = 'prospect_expected_monthly_nis';
	$columns['prospect_next']  = 'prospect_next_action_at';
	return $columns;
}
add_filter( 'manage_edit-justice_prospect_sortable_columns', 'justice_theme_lawyer_prospect_sortable_columns' );

function justice_theme_lawyer_prospect_due_meta_clause( string $filter ): array {
	if ( 'unscheduled' === $filter ) {
		return array(
			'relation' => 'AND',
			array(
				'relation' => 'OR',
				array(
					'key'     => 'prospect_outreach_status',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => 'prospect_outreach_status',
					'value'   => array( 'won', 'lost' ),
					'compare' => 'NOT IN',
				),
			),
			array(
				'relation' => 'OR',
				array(
					'key'     => 'prospect_next_action_at',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => 'prospect_next_action_at',
					'value'   => '',
					'compare' => '=',
				),
			),
		);
	}

	$today = current_time( 'Y-m-d' );

	$compare = '<=';
	if ( 'overdue' === $filter ) {
		$compare = '<';
	} elseif ( 'today' === $filter ) {
		$compare = '=';
	} elseif ( 'upcoming' === $filter ) {
		$compare = '>';
	}

	return array(
		'key'     => 'prospect_next_action_at',
		'value'   => $today,
		'compare' => $compare,
		'type'    => 'DATE',
	);
}

function justice_theme_lawyer_prospect_due_count( string $filter ): int {
	$query = new WP_Query( array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => array(
			justice_theme_lawyer_prospect_due_meta_clause( $filter ),
		),
	) );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_prospect_contact_meta_clause(): array {
	return array(
		'relation' => 'AND',
		array(
			'relation' => 'OR',
			array(
				'key'     => 'prospect_outreach_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_outreach_status',
				'value'   => array( 'won', 'lost' ),
				'compare' => 'NOT IN',
			),
		),
		array(
			'relation' => 'OR',
			array(
				'key'     => 'prospect_contact_email',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_contact_email',
				'value'   => '',
				'compare' => '=',
			),
		),
		array(
			'relation' => 'OR',
			array(
				'key'     => 'prospect_contact_phone',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'prospect_contact_phone',
				'value'   => '',
				'compare' => '=',
			),
		),
	);
}

function justice_theme_lawyer_prospect_missing_contact_count(): int {
	$query = new WP_Query( array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => array(
			justice_theme_lawyer_prospect_contact_meta_clause(),
		),
	) );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_prospect_verification_count( string $filter ): int {
	$query = new WP_Query( array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => array(
			justice_theme_lawyer_prospect_verification_meta_clause( $filter ),
		),
	) );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_prospect_due_views( array $views ): array {
	if ( ! current_user_can( 'edit_pages' ) ) {
		return $views;
	}

	$current_due     = isset( $_GET['justice_prospect_due_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_due_filter'] ) ) : '';
	$current_contact = isset( $_GET['justice_prospect_contact_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_contact_filter'] ) ) : '';
	$current_verify  = isset( $_GET['justice_prospect_verification_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_verification_filter'] ) ) : '';
	$base            = admin_url( 'edit.php?post_type=justice_prospect' );
	$items           = array(
		'due'         => __( 'Due now', 'justice-theme' ),
		'overdue'     => __( 'Overdue', 'justice-theme' ),
		'unscheduled' => __( 'Needs scheduling', 'justice-theme' ),
		'today'       => __( 'Today', 'justice-theme' ),
		'upcoming'    => __( 'Upcoming', 'justice-theme' ),
	);

	foreach ( $items as $key => $label ) {
		$count = justice_theme_lawyer_prospect_due_count( $key );
		$url   = add_query_arg( 'justice_prospect_due_filter', $key, $base );

		$views[ 'justice_prospect_' . $key ] = sprintf(
			'<a href="%1$s"%2$s>%3$s <span class="count">(%4$d)</span></a>',
			esc_url( $url ),
			$current_due === $key ? ' class="current" aria-current="page"' : '',
			esc_html( $label ),
			$count
		);
	}

	$views['justice_prospect_missing_contact'] = sprintf(
		'<a href="%1$s"%2$s>%3$s <span class="count">(%4$d)</span></a>',
		esc_url( add_query_arg( 'justice_prospect_contact_filter', 'missing', $base ) ),
		'missing' === $current_contact ? ' class="current" aria-current="page"' : '',
		esc_html__( 'Needs contact details', 'justice-theme' ),
		justice_theme_lawyer_prospect_missing_contact_count()
	);

	$verification_items = array(
		'needs' => __( 'Needs verification', 'justice-theme' ),
		'ready' => __( 'Ready for routing', 'justice-theme' ),
	);

	foreach ( $verification_items as $key => $label ) {
		$views[ 'justice_prospect_verification_' . $key ] = sprintf(
			'<a href="%1$s"%2$s>%3$s <span class="count">(%4$d)</span></a>',
			esc_url( add_query_arg( 'justice_prospect_verification_filter', $key, $base ) ),
			$current_verify === $key ? ' class="current" aria-current="page"' : '',
			esc_html( $label ),
			justice_theme_lawyer_prospect_verification_count( $key )
		);
	}

	return $views;
}
add_filter( 'views_edit-justice_prospect', 'justice_theme_lawyer_prospect_due_views' );

function justice_theme_lawyer_prospect_admin_column( string $column, int $post_id ): void {
	if ( 'prospect_area' === $column ) {
		$area = (string) get_post_meta( $post_id, 'prospect_practice_area', true );
		$city = (string) get_post_meta( $post_id, 'prospect_city', true );
		echo esc_html( trim( $area . ' / ' . $city, ' /' ) ?: '-' );
	}

	if ( 'prospect_plan' === $column ) {
		$plan = (string) get_post_meta( $post_id, 'prospect_target_plan', true );
		echo esc_html( justice_theme_lawyer_prospect_plan_options()[ $plan ] ?? $plan );
	}

	if ( 'prospect_value' === $column ) {
		$value = absint( get_post_meta( $post_id, 'prospect_expected_monthly_nis', true ) );
		$lead_fee = absint( get_post_meta( $post_id, 'prospect_agreed_lead_fee_ils', true ) );
		echo $value ? esc_html( number_format_i18n( $value ) . ' NIS monthly' ) : esc_html__( 'Monthly not set', 'justice-theme' );
		echo '<br>';
		echo $lead_fee ? esc_html( number_format_i18n( $lead_fee ) . ' NIS / lead' ) : esc_html__( 'Lead fee not set', 'justice-theme' );
	}

	if ( 'prospect_status' === $column ) {
		$status = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		echo esc_html( justice_theme_lawyer_prospect_statuses()[ $status ] ?? $status );
	}

	if ( 'prospect_verification' === $column ) {
		$missing = justice_theme_lawyer_prospect_verification_missing( $post_id );
		if ( empty( $missing ) ) {
			echo '<strong style="color:#008a20;">' . esc_html__( 'Ready for routing', 'justice-theme' ) . '</strong>';
			return;
		}

		echo '<strong style="color:#b32d2e;">' . esc_html__( 'Missing:', 'justice-theme' ) . '</strong><br>';
		echo esc_html( implode( ', ', $missing ) );
	}

	if ( 'prospect_priority' === $column ) {
		$priority = (string) get_post_meta( $post_id, 'prospect_priority', true );
		echo esc_html( justice_theme_lawyer_prospect_priorities()[ $priority ] ?? $priority );
	}

	if ( 'prospect_contact' === $column ) {
		$email = (string) get_post_meta( $post_id, 'prospect_contact_email', true );
		$phone = (string) get_post_meta( $post_id, 'prospect_contact_phone', true );

		if ( ! $email && ! $phone ) {
			echo '<strong style="color:#b32d2e;">' . esc_html__( 'Missing email + phone', 'justice-theme' ) . '</strong>';
			return;
		}

		if ( $email ) {
			echo '<a href="' . esc_url( 'mailto:' . $email ) . '">' . esc_html( $email ) . '</a>';
		}

		if ( $email && $phone ) {
			echo '<br>';
		}

		if ( $phone ) {
			echo '<a href="' . esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ) . '">' . esc_html( $phone ) . '</a>';
		}
	}

	if ( 'prospect_next' === $column ) {
		$next = (string) get_post_meta( $post_id, 'prospect_next_action_at', true );
		if ( ! $next ) {
			echo esc_html__( 'No date set', 'justice-theme' );
			return;
		}

		$today = current_time( 'Y-m-d' );
		$label = __( 'Scheduled', 'justice-theme' );
		$color = '#50575e';
		if ( $next < $today ) {
			$label = __( 'Overdue', 'justice-theme' );
			$color = '#b32d2e';
		} elseif ( $next === $today ) {
			$label = __( 'Due today', 'justice-theme' );
			$color = '#996800';
		}

		echo '<strong style="color:' . esc_attr( $color ) . ';">' . esc_html( $label ) . '</strong><br>';
		echo esc_html( $next );
	}

	if ( 'prospect_actions' === $column ) {
		$action_keys = array( 'contacted', 'follow_up', 'proposal_sent', 'won', 'lost' );
		$actions     = justice_theme_lawyer_prospect_quick_actions();
		foreach ( $action_keys as $action_key ) {
			$url = justice_theme_lawyer_prospect_quick_action_url( $post_id, $action_key );
			if ( ! $url || empty( $actions[ $action_key ]['label'] ) ) {
				continue;
			}

			echo '<a class="button button-small" style="margin:0 4px 4px 0;" href="' . esc_url( $url ) . '">' . esc_html( $actions[ $action_key ]['label'] ) . '</a>';
		}
	}
}
add_action( 'manage_justice_prospect_posts_custom_column', 'justice_theme_lawyer_prospect_admin_column', 10, 2 );

function justice_theme_lawyer_prospect_admin_filters( string $post_type ): void {
	if ( 'justice_prospect' !== $post_type ) {
		return;
	}

	$filters = array(
		'justice_prospect_status_filter' => array(
			'label'   => __( 'All outreach statuses', 'justice-theme' ),
			'meta'    => 'prospect_outreach_status',
			'current' => isset( $_GET['justice_prospect_status_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_status_filter'] ) ) : '',
			'options' => justice_theme_lawyer_prospect_statuses(),
		),
		'justice_prospect_plan_filter' => array(
			'label'   => __( 'All target plans', 'justice-theme' ),
			'meta'    => 'prospect_target_plan',
			'current' => isset( $_GET['justice_prospect_plan_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_plan_filter'] ) ) : '',
			'options' => justice_theme_lawyer_prospect_plan_options(),
		),
		'justice_prospect_priority_filter' => array(
			'label'   => __( 'All priorities', 'justice-theme' ),
			'meta'    => 'prospect_priority',
			'current' => isset( $_GET['justice_prospect_priority_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_priority_filter'] ) ) : '',
			'options' => justice_theme_lawyer_prospect_priorities(),
		),
	);

	foreach ( $filters as $name => $filter ) {
		echo '<select name="' . esc_attr( $name ) . '">';
		echo '<option value="">' . esc_html( $filter['label'] ) . '</option>';
		foreach ( $filter['options'] as $value => $label ) {
			echo '<option value="' . esc_attr( $value ) . '" ' . selected( $filter['current'], $value, false ) . '>' . esc_html( $label ) . '</option>';
		}
		echo '</select>';
	}
}
add_action( 'restrict_manage_posts', 'justice_theme_lawyer_prospect_admin_filters' );

function justice_theme_lawyer_prospect_admin_filter_query( WP_Query $query ): void {
	if ( ! is_admin() || ! $query->is_main_query() || 'justice_prospect' !== $query->get( 'post_type' ) ) {
		return;
	}

	$orderby       = (string) $query->get( 'orderby' );
	$value_sort    = 'prospect_expected_monthly_nis' === $orderby;
	$next_date_sort = 'prospect_next_action_at' === $orderby;
	$filter_map = array(
		'justice_prospect_status_filter'   => 'prospect_outreach_status',
		'justice_prospect_plan_filter'     => 'prospect_target_plan',
		'justice_prospect_priority_filter' => 'prospect_priority',
	);
	$meta_query = (array) $query->get( 'meta_query' );

	foreach ( $filter_map as $request_key => $meta_key ) {
		$value = isset( $_GET[ $request_key ] ) ? sanitize_key( wp_unslash( $_GET[ $request_key ] ) ) : '';
		if ( '' === $value ) {
			continue;
		}

		$meta_query[] = array(
			'key'   => $meta_key,
			'value' => $value,
		);
	}

	$contact_filter = isset( $_GET['justice_prospect_contact_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_contact_filter'] ) ) : '';
	if ( 'missing' === $contact_filter ) {
		$meta_query[] = justice_theme_lawyer_prospect_contact_meta_clause();
	}

	$verification_filter = isset( $_GET['justice_prospect_verification_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_verification_filter'] ) ) : '';
	if ( in_array( $verification_filter, array( 'needs', 'ready' ), true ) ) {
		$meta_query[] = justice_theme_lawyer_prospect_verification_meta_clause( $verification_filter );
	}

	$due_filter = isset( $_GET['justice_prospect_due_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_prospect_due_filter'] ) ) : '';
	if ( in_array( $due_filter, array( 'due', 'overdue', 'unscheduled', 'today', 'upcoming' ), true ) ) {
		$meta_query[] = justice_theme_lawyer_prospect_due_meta_clause( $due_filter );
		if ( $value_sort || $next_date_sort ) {
			// Explicit owner sorting below should win over the default due-view order.
		} elseif ( 'unscheduled' === $due_filter ) {
			$query->set( 'orderby', 'modified' );
			$query->set( 'order', 'DESC' );
		} else {
			$query->set( 'meta_key', 'prospect_next_action_at' );
			$query->set( 'orderby', 'meta_value' );
			$query->set( 'order', 'ASC' );
		}
	} elseif ( 'missing' === $contact_filter || in_array( $verification_filter, array( 'needs', 'ready' ), true ) ) {
		$query->set( 'orderby', 'modified' );
		$query->set( 'order', 'DESC' );
	}

	if ( $value_sort ) {
		$query->set( 'meta_key', 'prospect_expected_monthly_nis' );
		$query->set( 'orderby', 'meta_value_num' );
	} elseif ( $next_date_sort ) {
		$query->set( 'meta_key', 'prospect_next_action_at' );
		$query->set( 'orderby', 'meta_value' );
	}

	if ( ! empty( $meta_query ) ) {
		$query->set( 'meta_query', $meta_query );
	}
}
add_action( 'pre_get_posts', 'justice_theme_lawyer_prospect_admin_filter_query' );
