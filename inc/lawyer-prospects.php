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
		'prospect_owner_note'          => 'string',
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

	if ( 'prospect_contact_email' === $key ) {
		return 'sanitize_email';
	}

	if ( 'prospect_expected_monthly_nis' === $key ) {
		return 'absint';
	}

	if ( 'prospect_source_lead_id' === $key ) {
		return 'absint';
	}

	if ( in_array( $key, array( 'prospect_demand_signal', 'prospect_owner_note' ), true ) ) {
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

function justice_theme_lawyer_prospect_form_value( WP_Post $post, string $key ): string {
	$saved = (string) get_post_meta( $post->ID, $key, true );
	if ( '' !== $saved || 'auto-draft' !== $post->post_status ) {
		return $saved;
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
			<th scope="row"><label for="justice-prospect-demand-signal">Demand signal</label></th>
			<td><textarea id="justice-prospect-demand-signal" name="prospect_demand_signal" rows="4" class="large-text" placeholder="Example: 3 Thailand-law calls this week, no paying coverage partner yet."><?php echo esc_textarea( justice_theme_lawyer_prospect_form_value( $post, 'prospect_demand_signal' ) ); ?></textarea></td>
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
	$expected_value = (int) get_post_meta( $post_id, 'prospect_expected_monthly_nis', true );
	$plan_label     = justice_theme_lawyer_prospect_plan_options()[ $target_plan ] ?? 'Lead Partner';
	$recipient      = $contact_name ?: ( $firm_name ?: 'there' );
	$registration   = add_query_arg(
		array(
			'plan_interest' => $target_plan,
			'payment_path'  => 'manual_invoice',
		),
		home_url( '/lawyer-registration/' )
	);

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

	return array(
		'subject'        => $subject,
		'body'           => $body,
		'call'           => $call,
		'registration'   => $registration,
		'expected_value' => $expected_value,
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
	<label for="justice-prospect-email-draft"><strong>Email / WhatsApp draft</strong></label>
	<textarea id="justice-prospect-email-draft" readonly rows="11" class="large-text"><?php echo esc_textarea( $message['body'] ); ?></textarea>
	<label for="justice-prospect-call-script" style="display:block;margin-top:12px;"><strong>Call script</strong></label>
	<textarea id="justice-prospect-call-script" readonly rows="9" class="large-text"><?php echo esc_textarea( $message['call'] ); ?></textarea>
	<?php
}

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
	update_post_meta( $post_id, 'prospect_demand_signal', isset( $_POST['prospect_demand_signal'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_demand_signal'] ) ) : '' );
	update_post_meta( $post_id, 'prospect_owner_note', isset( $_POST['prospect_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['prospect_owner_note'] ) ) : '' );
}
add_action( 'save_post_justice_prospect', 'justice_theme_save_lawyer_prospect_details' );

function justice_theme_lawyer_prospect_admin_columns( array $columns ): array {
	$columns['prospect_area']     = __( 'Area / city', 'justice-theme' );
	$columns['prospect_plan']     = __( 'Target plan', 'justice-theme' );
	$columns['prospect_status']   = __( 'Status', 'justice-theme' );
	$columns['prospect_priority'] = __( 'Priority', 'justice-theme' );
	$columns['prospect_next']     = __( 'Next action', 'justice-theme' );
	return $columns;
}
add_filter( 'manage_justice_prospect_posts_columns', 'justice_theme_lawyer_prospect_admin_columns' );

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

	if ( 'prospect_status' === $column ) {
		$status = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		echo esc_html( justice_theme_lawyer_prospect_statuses()[ $status ] ?? $status );
	}

	if ( 'prospect_priority' === $column ) {
		$priority = (string) get_post_meta( $post_id, 'prospect_priority', true );
		echo esc_html( justice_theme_lawyer_prospect_priorities()[ $priority ] ?? $priority );
	}

	if ( 'prospect_next' === $column ) {
		echo esc_html( (string) get_post_meta( $post_id, 'prospect_next_action_at', true ) ?: '-' );
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

	if ( ! empty( $meta_query ) ) {
		$query->set( 'meta_query', $meta_query );
	}
}
add_action( 'pre_get_posts', 'justice_theme_lawyer_prospect_admin_filter_query' );
