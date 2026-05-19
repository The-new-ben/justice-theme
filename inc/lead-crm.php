<?php
/**
 * Owner CRM overview for leads and LegalTech requests.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_crm_admin_menu(): void {
	add_menu_page(
		'Justice CRM',
		'Justice CRM',
		'edit_pages',
		'justice-crm',
		'justice_theme_render_crm_admin_page',
		'dashicons-chart-line',
		25
	);
}
add_action( 'admin_menu', 'justice_theme_crm_admin_menu' );

function justice_theme_crm_register_lead_meta(): void {
	$fields = array(
		'lead_quality_override'     => 'string',
		'coverage_status'           => 'string',
		'follow_up_status'          => 'string',
		'first_contact_at'          => 'string',
		'customer_success_note'     => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lead', $key, array(
			'single'            => true,
			'type'              => $type,
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => false,
		) );
	}
}
add_action( 'init', 'justice_theme_crm_register_lead_meta' );

function justice_theme_render_crm_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	$lead_counts = justice_theme_crm_count_by_status( 'justice_lead', 'lead_status' );
	$coverage_counts = justice_theme_crm_count_by_status( 'justice_lead', 'coverage_status' );
	$tool_counts = post_type_exists( 'justice_legal_request' ) ? justice_theme_crm_count_by_status( 'justice_legal_request', 'status' ) : array();
	$leads       = justice_theme_crm_query_items( 'justice_lead', 15 );
	$uncovered_demand = justice_theme_crm_query_uncovered_demand( 15 );
	$requests    = post_type_exists( 'justice_legal_request' ) ? justice_theme_crm_query_items( 'justice_legal_request', 10 ) : null;
	?>
	<div class="wrap">
		<h1>Justice CRM</h1>
		<p>Operational inbox for legal leads, LegalTech requests and owner follow-up.</p>

		<?php if ( ! post_type_exists( 'justice_lead' ) ) : ?>
			<div class="notice notice-error inline">
				<p><strong>BLOCKED:</strong> `justice_lead` post type is not active. Verify the Justice plugin.</p>
			</div>
		<?php endif; ?>

		<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( justice_theme_crm_status_labels() as $status => $label ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) ( $lead_counts[ $status ] ?? 0 ) ); ?></strong>
					<span><?php echo esc_html( $label ); ?></span>
				</div>
			<?php endforeach; ?>
			<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) array_sum( $tool_counts ) ); ?></strong>
				<span>LegalTech requests</span>
			</div>
		</div>

		<h2>Recent legal leads</h2>
		<?php justice_theme_crm_render_table( $leads, 'justice_lead' ); ?>

		<h2 style="margin-top:28px;">Uncovered demand queue</h2>
		<p>Leads with no clear paid coverage yet. Use this to recruit lawyers for repeated demand before manually giving away calls for free.</p>
		<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( justice_theme_crm_coverage_status_labels() as $status => $label ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) ( $coverage_counts[ $status ] ?? 0 ) ); ?></strong>
					<span><?php echo esc_html( $label ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
		<?php justice_theme_crm_render_table( $uncovered_demand, 'justice_lead' ); ?>

		<h2 style="margin-top:28px;">Recent LegalTech requests</h2>
		<?php if ( $requests ) : ?>
			<?php justice_theme_crm_render_table( $requests, 'justice_legal_request' ); ?>
		<?php else : ?>
			<div class="notice notice-info inline"><p>`justice_legal_request` is not active yet.</p></div>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_query_items( string $post_type, int $limit ): ?WP_Query {
	if ( ! post_type_exists( $post_type ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => $post_type,
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'DESC',
	) );
}

function justice_theme_crm_query_uncovered_demand( int $limit ): ?WP_Query {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'coverage_status',
				'value'   => array( 'coverage_review', 'covered_nonpaying', 'uncovered_recruit', 'urgent_manual' ),
				'compare' => 'IN',
			),
			array(
				'key'     => 'coverage_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'assigned_lawyer_id',
				'compare' => 'NOT EXISTS',
			),
		),
	) );
}

function justice_theme_crm_count_by_status( string $post_type, string $meta_key ): array {
	if ( ! post_type_exists( $post_type ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => $post_type,
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	) );

	$counts = array();
	foreach ( $query->posts as $post_id ) {
		$status = get_post_meta( $post_id, $meta_key, true ) ?: 'new';
		if ( ! isset( $counts[ $status ] ) ) {
			$counts[ $status ] = 0;
		}
		$counts[ $status ]++;
	}

	return $counts;
}

function justice_theme_crm_status_labels(): array {
	return array(
		'new'       => 'New',
		'qualified' => 'Qualified',
		'assigned'  => 'Assigned',
		'contacted' => 'Contacted',
		'converted' => 'Converted',
		'closed'    => 'Closed',
	);
}

function justice_theme_crm_coverage_status_labels(): array {
	return array(
		'coverage_review'  => 'Needs coverage review',
		'covered_routable' => 'Covered: routable',
		'covered_nonpaying' => 'Covered: recruit lawyer',
		'uncovered_recruit' => 'Uncovered: recruit niche',
		'unsupported'      => 'Unsupported/no match',
		'urgent_manual'    => 'Urgent manual review',
	);
}

function justice_theme_crm_coverage_badge( int $post_id ): array {
	$status = get_post_meta( $post_id, 'coverage_status', true );

	if ( ! $status ) {
		$status = (int) get_post_meta( $post_id, 'assigned_lawyer_id', true ) ? 'covered_routable' : 'coverage_review';
	}

	$labels = justice_theme_crm_coverage_status_labels();
	$styles = array(
		'covered_routable'  => 'background:#ecfdf3;color:#166534;',
		'covered_nonpaying' => 'background:#fff7ed;color:#9a3412;',
		'uncovered_recruit' => 'background:#fef3c7;color:#92400e;',
		'unsupported'      => 'background:#f1f5f9;color:#334155;',
		'urgent_manual'    => 'background:#fef2f2;color:#991b1b;',
		'coverage_review'  => 'background:#eef2ff;color:#3730a3;',
	);

	return array(
		'label' => $labels[ $status ] ?? $labels['coverage_review'],
		'style' => $styles[ $status ] ?? $styles['coverage_review'],
	);
}

function justice_theme_crm_lead_quality( int $post_id ): array {
	$manual_quality = get_post_meta( $post_id, 'lead_quality_override', true );

	if ( in_array( $manual_quality, array( 'high', 'medium', 'low' ), true ) ) {
		return justice_theme_crm_quality_badge( $manual_quality );
	}

	$phone              = get_post_meta( $post_id, 'visitor_phone', true ) ?: get_post_meta( $post_id, 'lead_phone', true );
	$email              = get_post_meta( $post_id, 'visitor_email', true ) ?: get_post_meta( $post_id, 'lead_email', true );
	$area               = get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
	$city               = get_post_meta( $post_id, 'city', true ) ?: get_post_meta( $post_id, 'lead_city', true );
	$message            = get_post_meta( $post_id, 'message', true ) ?: get_post_meta( $post_id, 'lead_message', true );
	$urgency            = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );
	$assigned_lawyer_id = (int) get_post_meta( $post_id, 'assigned_lawyer_id', true );
	$score              = 0;

	$score += $phone ? 2 : 0;
	$score += $email ? 1 : 0;
	$score += $area ? 2 : 0;
	$score += $city ? 1 : 0;
	$score += strlen( trim( (string) $message ) ) >= 40 ? 2 : 0;
	$score += $assigned_lawyer_id ? 2 : 0;
	$score += in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true ) ? 2 : 0;

	if ( $score >= 8 ) {
		return justice_theme_crm_quality_badge( 'high' );
	}

	if ( $score >= 5 ) {
		return justice_theme_crm_quality_badge( 'medium' );
	}

	return justice_theme_crm_quality_badge( 'low' );
}

function justice_theme_crm_quality_badge( string $quality ): array {
	if ( 'high' === $quality ) {
		return array( 'label' => 'High', 'style' => 'background:#ecfdf3;color:#166534;' );
	}

	if ( 'medium' === $quality ) {
		return array( 'label' => 'Medium', 'style' => 'background:#fff7ed;color:#9a3412;' );
	}

	return array( 'label' => 'Low', 'style' => 'background:#f1f5f9;color:#334155;' );
}

function justice_theme_crm_follow_up_label( int $post_id, string $status ): array {
	$manual_follow_up = get_post_meta( $post_id, 'follow_up_status', true );

	if ( $manual_follow_up ) {
		return justice_theme_crm_follow_up_badge( $manual_follow_up );
	}

	$urgency = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );

	if ( in_array( $status, array( 'converted', 'closed', 'rejected' ), true ) ) {
		return array(
			'label' => 'Closed loop',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	if ( in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true ) && in_array( $status, array( 'new', 'qualified', 'assigned' ), true ) ) {
		return array(
			'label' => 'Call now',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( in_array( $status, array( 'new', 'qualified', 'assigned' ), true ) ) {
		return array(
			'label' => 'Same day',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	return array(
		'label' => 'Monitor',
		'style' => 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_crm_follow_up_badge( string $status ): array {
	$labels = array(
		'not_started'       => 'Not started',
		'first_attempt'     => 'First attempt',
		'contacted'         => 'Contacted',
		'consult_scheduled' => 'Consult scheduled',
		'not_qualified'     => 'Not qualified',
		'won'               => 'Won',
		'lost'              => 'Lost',
	);

	$closed = in_array( $status, array( 'not_qualified', 'won', 'lost' ), true );

	return array(
		'label' => $labels[ $status ] ?? 'Monitor',
		'style' => $closed ? 'background:#f1f5f9;color:#334155;' : 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_crm_response_sla_badge( int $post_id, string $status ): array {
	$first_contact   = trim( (string) get_post_meta( $post_id, 'first_contact_at', true ) );
	$manual_followup = get_post_meta( $post_id, 'follow_up_status', true );
	$closed_statuses = array( 'converted', 'closed', 'rejected' );
	$contacted_steps = array( 'contacted', 'consult_scheduled', 'not_qualified', 'won', 'lost' );

	if ( $first_contact || in_array( $manual_followup, $contacted_steps, true ) ) {
		return array(
			'label' => 'Contact logged',
			'style' => 'background:#ecfdf3;color:#166534;',
		);
	}

	if ( in_array( $status, $closed_statuses, true ) ) {
		return array(
			'label' => 'Closed',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	$created_at = (int) get_post_time( 'U', true, $post_id );
	if ( ! $created_at ) {
		return array(
			'label' => 'Check',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	$minutes_old = max( 0, (int) floor( ( time() - $created_at ) / MINUTE_IN_SECONDS ) );
	$urgency     = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );
	$is_urgent   = in_array( $urgency, array( 'high', 'urgent', '׳“׳—׳•׳£' ), true );

	if ( $is_urgent && $minutes_old > 15 ) {
		return array(
			'label' => 'Overdue urgent',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( $is_urgent ) {
		return array(
			'label' => 'Call now',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( $minutes_old <= 15 ) {
		return array(
			'label' => 'Fresh',
			'style' => 'background:#ecfdf3;color:#166534;',
		);
	}

	if ( $minutes_old <= 60 ) {
		return array(
			'label' => 'Within hour',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	if ( $minutes_old <= 240 ) {
		return array(
			'label' => 'Due today',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	return array(
		'label' => 'Overdue',
		'style' => 'background:#fef2f2;color:#991b1b;',
	);
}

function justice_theme_crm_lead_disposition_meta_box(): void {
	add_meta_box(
		'justice_theme_lead_disposition',
		'Jus-Tice Lead Disposition',
		'justice_theme_crm_render_lead_disposition_box',
		'justice_lead',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_crm_lead_disposition_meta_box' );

function justice_theme_crm_render_lead_disposition_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lead_disposition', 'justice_theme_lead_disposition_nonce' );

	$quality         = get_post_meta( $post->ID, 'lead_quality_override', true ) ?: 'auto';
	$coverage_status = get_post_meta( $post->ID, 'coverage_status', true ) ?: 'coverage_review';
	$follow_up       = get_post_meta( $post->ID, 'follow_up_status', true ) ?: 'not_started';
	$first_contact   = get_post_meta( $post->ID, 'first_contact_at', true );
	$customer_note   = get_post_meta( $post->ID, 'customer_success_note', true );
	$quality_options = array(
		'auto'   => 'Auto score',
		'high'   => 'High',
		'medium' => 'Medium',
		'low'    => 'Low',
	);
	$coverage_options = justice_theme_crm_coverage_status_labels();
	$follow_up_options = array(
		'not_started'       => 'Not started',
		'first_attempt'     => 'First attempt',
		'contacted'         => 'Contacted',
		'consult_scheduled' => 'Consult scheduled',
		'not_qualified'     => 'Not qualified',
		'won'               => 'Won',
		'lost'              => 'Lost',
	);
	?>
	<p>
		<label for="justice-lead-quality"><strong>Lead quality</strong></label>
		<select id="justice-lead-quality" name="lead_quality_override" style="width:100%;">
			<?php foreach ( $quality_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $quality, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-coverage-status"><strong>Coverage status</strong></label>
		<select id="justice-coverage-status" name="coverage_status" style="width:100%;">
			<?php foreach ( $coverage_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $coverage_status, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-follow-up-status"><strong>Follow-up status</strong></label>
		<select id="justice-follow-up-status" name="follow_up_status" style="width:100%;">
			<?php foreach ( $follow_up_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $follow_up, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-first-contact-at"><strong>First contact time</strong></label>
		<input id="justice-first-contact-at" type="datetime-local" name="first_contact_at" value="<?php echo esc_attr( $first_contact ); ?>" style="width:100%;">
	</p>
	<p>
		<label for="justice-customer-success-note"><strong>Customer-success note</strong></label>
		<textarea id="justice-customer-success-note" name="customer_success_note" rows="5" style="width:100%;"><?php echo esc_textarea( $customer_note ); ?></textarea>
	</p>
	<p style="color:#646970;">Owner-only operational fields for monthly value reporting. No public display.</p>
	<?php
}

function justice_theme_crm_save_lead_disposition( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lead_disposition_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lead_disposition_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lead_disposition' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$quality = isset( $_POST['lead_quality_override'] ) ? sanitize_key( wp_unslash( $_POST['lead_quality_override'] ) ) : 'auto';
	if ( ! in_array( $quality, array( 'auto', 'high', 'medium', 'low' ), true ) ) {
		$quality = 'auto';
	}

	$follow_up = isset( $_POST['follow_up_status'] ) ? sanitize_key( wp_unslash( $_POST['follow_up_status'] ) ) : 'not_started';
	if ( ! in_array( $follow_up, array( 'not_started', 'first_attempt', 'contacted', 'consult_scheduled', 'not_qualified', 'won', 'lost' ), true ) ) {
		$follow_up = 'not_started';
	}

	$coverage_status = isset( $_POST['coverage_status'] ) ? sanitize_key( wp_unslash( $_POST['coverage_status'] ) ) : 'coverage_review';
	if ( ! array_key_exists( $coverage_status, justice_theme_crm_coverage_status_labels() ) ) {
		$coverage_status = 'coverage_review';
	}

	update_post_meta( $post_id, 'lead_quality_override', $quality );
	update_post_meta( $post_id, 'coverage_status', $coverage_status );
	update_post_meta( $post_id, 'follow_up_status', $follow_up );
	update_post_meta( $post_id, 'first_contact_at', isset( $_POST['first_contact_at'] ) ? sanitize_text_field( wp_unslash( $_POST['first_contact_at'] ) ) : '' );
	update_post_meta( $post_id, 'customer_success_note', isset( $_POST['customer_success_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['customer_success_note'] ) ) : '' );
}
add_action( 'save_post_justice_lead', 'justice_theme_crm_save_lead_disposition' );

function justice_theme_crm_render_table( ?WP_Query $items, string $post_type ): void {
	if ( ! $items || ! $items->have_posts() ) {
		echo '<div class="notice notice-info inline"><p>No records found.</p></div>';
		return;
	}

	$status_key = 'justice_legal_request' === $post_type ? 'status' : 'lead_status';
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Name</th>
				<th>Phone</th>
				<th>Email</th>
				<th>Area / Tool</th>
				<th>Status</th>
				<th>Coverage</th>
				<th>Quality</th>
				<th>Follow-up</th>
				<th>Response SLA</th>
				<th>Source</th>
				<th>Date</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<?php while ( $items->have_posts() ) : $items->the_post(); ?>
				<?php
				$post_id = get_the_ID();
				$name    = get_post_meta( $post_id, 'visitor_name', true ) ?: get_post_meta( $post_id, 'lead_name', true ) ?: get_the_title();
				$phone   = get_post_meta( $post_id, 'visitor_phone', true ) ?: get_post_meta( $post_id, 'lead_phone', true );
				$email   = get_post_meta( $post_id, 'visitor_email', true ) ?: get_post_meta( $post_id, 'lead_email', true );
				$area    = get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
				$ai_area = get_post_meta( $post_id, 'ai_detected_area', true );
				$area_display = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( $ai_area ?: $area ) : ( $ai_area ?: $area );
				$tool_id = (int) get_post_meta( $post_id, 'tool_id', true );
				$source  = get_post_meta( $post_id, 'source_url', true );
				$status  = get_post_meta( $post_id, $status_key, true ) ?: 'new';
				$coverage = 'justice_lead' === $post_type ? justice_theme_crm_coverage_badge( $post_id ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$quality = 'justice_lead' === $post_type ? justice_theme_crm_lead_quality( $post_id ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$follow_up = 'justice_lead' === $post_type ? justice_theme_crm_follow_up_label( $post_id, $status ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$response_sla = 'justice_lead' === $post_type ? justice_theme_crm_response_sla_badge( $post_id, $status ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				?>
				<tr>
					<td><strong><?php echo esc_html( $name ); ?></strong></td>
					<td><?php echo $phone ? '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ) . '">' . esc_html( $phone ) . '</a>' : '-'; ?></td>
					<td><?php echo $email ? '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>' : '-'; ?></td>
					<td><?php echo esc_html( $tool_id ? get_the_title( $tool_id ) : ( $area_display ?: '-' ) ); ?></td>
					<td><?php echo esc_html( $status ); ?></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $coverage['style'] ); ?>"><?php echo esc_html( $coverage['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $quality['style'] ); ?>"><?php echo esc_html( $quality['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $follow_up['style'] ); ?>"><?php echo esc_html( $follow_up['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $response_sla['style'] ); ?>"><?php echo esc_html( $response_sla['label'] ); ?></span></td>
					<td><?php echo $source ? '<a href="' . esc_url( $source ) . '" target="_blank" rel="noopener">source</a>' : '-'; ?></td>
					<td><?php echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) ); ?></td>
					<td><a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a></td>
				</tr>
			<?php endwhile; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
}
