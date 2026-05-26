<?php
/**
 * Owner-only fulfillment gates for packaged legal requests.
 *
 * This supports the managed-service / Lawhive-style idea without launching a
 * public law-firm product. It records readiness, ethics and lawyer-review
 * status on private LegalTech requests only.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_legal_request_fulfillment_meta_fields(): array {
	return array(
		'fulfillment_mode'          => 'string',
		'fulfillment_status'        => 'string',
		'service_package_key'       => 'string',
		'managing_lawyer_id'        => 'integer',
		'engagement_letter_status'  => 'string',
		'ethics_review_status'      => 'string',
		'managed_service_price_ils' => 'integer',
		'client_payment_status'     => 'string',
		'customer_case_reference'   => 'string',
		'owner_fulfillment_note'    => 'string',
	);
}

function justice_theme_register_legal_request_fulfillment_meta(): void {
	foreach ( justice_theme_legal_request_fulfillment_meta_fields() as $key => $type ) {
		register_post_meta( 'justice_legal_request', $key, array(
			'single'            => true,
			'type'              => $type,
			'sanitize_callback' => 'integer' === $type ? 'absint' : 'sanitize_text_field',
			'show_in_rest'      => false,
		) );
	}
}
add_action( 'init', 'justice_theme_register_legal_request_fulfillment_meta' );

function justice_theme_fulfillment_mode_options(): array {
	return array(
		'referral_only'           => 'Referral only - route to outside lawyer',
		'lawyer_managed_package'  => 'Lawyer-managed packaged service candidate',
		'owner_review_only'       => 'Owner review only - not offered',
		'blocked'                 => 'Blocked - do not sell or route',
	);
}

function justice_theme_fulfillment_status_options(): array {
	return array(
		'intake'              => 'Intake received',
		'needs_scope'         => 'Needs scope / documents',
		'needs_lawyer'        => 'Needs managing lawyer',
		'needs_engagement'    => 'Needs signed engagement letter',
		'lawyer_review'       => 'With lawyer for review',
		'client_signoff'      => 'Waiting for client sign-off',
		'ready_to_fulfill'    => 'Ready for manual fulfillment',
		'fulfilled'           => 'Fulfilled / closed',
		'blocked'             => 'Blocked',
	);
}

function justice_theme_engagement_letter_status_options(): array {
	return array(
		'not_required' => 'Not required for this request',
		'not_sent'     => 'Not sent',
		'sent'         => 'Sent to client',
		'signed'       => 'Signed by client',
		'blocked'      => 'Blocked / not acceptable',
	);
}

function justice_theme_ethics_review_status_options(): array {
	return array(
		'not_reviewed'       => 'Not reviewed',
		'needs_opinion'      => 'Needs Bar/ethics opinion',
		'approved_for_pilot' => 'Approved for controlled pilot',
		'blocked'           => 'Blocked by compliance',
	);
}

function justice_theme_client_payment_status_options(): array {
	return array(
		'not_applicable' => 'Not applicable',
		'not_requested'  => 'Not requested',
		'quote_sent'     => 'Quote sent',
		'invoice_sent'   => 'Invoice/payment request sent',
		'paid'           => 'Paid with proof',
		'refunded'       => 'Refunded',
		'blocked'        => 'Payment blocked',
	);
}

function justice_theme_service_package_options(): array {
	return array(
		''                         => 'Not selected',
		'rental_agreement'         => 'Rental agreement review / draft',
		'simple_will'              => 'Simple will package',
		'prenuptial_agreement'     => 'Prenuptial / financial agreement',
		'nii_appeal_package'       => 'Bituach Leumi appeal package',
		'company_formation'        => 'Company formation documents',
		'demand_letter_review'     => 'Demand letter with lawyer review',
		'cross_border_consult'     => 'Cross-border / immigration consult bundle',
		'other_manual_service'     => 'Other manual service',
	);
}

function justice_theme_add_legal_request_fulfillment_metabox(): void {
	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return;
	}

	add_meta_box(
		'justice-legal-request-fulfillment',
		'Managed service fulfillment gate',
		'justice_theme_render_legal_request_fulfillment_metabox',
		'justice_legal_request',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_add_legal_request_fulfillment_metabox' );

function justice_theme_render_legal_request_fulfillment_metabox( WP_Post $post ): void {
	wp_nonce_field( 'justice_legal_request_fulfillment', 'justice_legal_request_fulfillment_nonce' );

	$mode        = (string) get_post_meta( $post->ID, 'fulfillment_mode', true );
	$status      = (string) get_post_meta( $post->ID, 'fulfillment_status', true );
	$package     = (string) get_post_meta( $post->ID, 'service_package_key', true );
	$lawyer_id   = (int) get_post_meta( $post->ID, 'managing_lawyer_id', true );
	$engagement  = (string) get_post_meta( $post->ID, 'engagement_letter_status', true );
	$ethics      = (string) get_post_meta( $post->ID, 'ethics_review_status', true );
	$price       = (int) get_post_meta( $post->ID, 'managed_service_price_ils', true );
	$payment     = (string) get_post_meta( $post->ID, 'client_payment_status', true );
	$case_ref    = (string) get_post_meta( $post->ID, 'customer_case_reference', true );
	$owner_note  = (string) get_post_meta( $post->ID, 'owner_fulfillment_note', true );
	$lawyer_list = justice_theme_legal_request_fulfillment_lawyer_options();
	$readiness   = justice_theme_legal_request_fulfillment_readiness( $post->ID );
	?>
	<div style="border:1px solid #dcdcde;border-radius:8px;padding:12px;background:#f8fafc;margin-bottom:12px;">
		<strong><?php echo esc_html( $readiness['label'] ); ?></strong>
		<p style="margin:6px 0 0;color:#50575e;"><?php echo esc_html( $readiness['detail'] ); ?></p>
	</div>

	<p style="margin-top:0;color:#50575e;">
		Owner-only gate. Do not sell a managed legal service publicly unless the engagement structure, lawyer of record,
		payment proof and ethics review are all recorded.
	</p>

	<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;">
		<?php justice_theme_legal_request_fulfillment_select( 'fulfillment_mode', 'Fulfillment mode', justice_theme_fulfillment_mode_options(), $mode ?: 'referral_only' ); ?>
		<?php justice_theme_legal_request_fulfillment_select( 'fulfillment_status', 'Fulfillment status', justice_theme_fulfillment_status_options(), $status ?: 'intake' ); ?>
		<?php justice_theme_legal_request_fulfillment_select( 'service_package_key', 'Service package', justice_theme_service_package_options(), $package ); ?>
		<label>
			<strong>Managing lawyer</strong>
			<select name="managing_lawyer_id" class="widefat">
				<option value="0">Not selected</option>
				<?php foreach ( $lawyer_list as $id => $label ) : ?>
					<option value="<?php echo esc_attr( (string) $id ); ?>" <?php selected( $lawyer_id, (int) $id ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
		</label>
		<?php justice_theme_legal_request_fulfillment_select( 'engagement_letter_status', 'Engagement letter', justice_theme_engagement_letter_status_options(), $engagement ?: 'not_sent' ); ?>
		<?php justice_theme_legal_request_fulfillment_select( 'ethics_review_status', 'Ethics review', justice_theme_ethics_review_status_options(), $ethics ?: 'not_reviewed' ); ?>
		<label>
			<strong>Package price (NIS)</strong>
			<input type="number" min="0" step="1" name="managed_service_price_ils" value="<?php echo esc_attr( (string) $price ); ?>" class="widefat">
		</label>
		<?php justice_theme_legal_request_fulfillment_select( 'client_payment_status', 'Client payment', justice_theme_client_payment_status_options(), $payment ?: 'not_requested' ); ?>
		<label>
			<strong>Customer case reference</strong>
			<input type="text" name="customer_case_reference" value="<?php echo esc_attr( $case_ref ); ?>" class="widefat" placeholder="Internal reference only">
		</label>
	</div>

	<p style="margin-top:14px;">
		<label for="justice-owner-fulfillment-note"><strong>Owner fulfillment note</strong></label>
		<textarea id="justice-owner-fulfillment-note" name="owner_fulfillment_note" rows="4" class="widefat"><?php echo esc_textarea( $owner_note ); ?></textarea>
	</p>

	<ul style="list-style:disc;margin-inline-start:20px;color:#50575e;">
		<li>No automatic AI drafting, payment, client message, lawyer handoff or public page is triggered by this box.</li>
		<li>Use `referral only` until a Bar/ethics-reviewed engagement model exists.</li>
		<li>Mark `Paid` only when payment evidence is also stored in the normal billing/payment fields.</li>
	</ul>
	<?php
}

function justice_theme_legal_request_fulfillment_select( string $name, string $label, array $options, string $selected ): void {
	?>
	<label>
		<strong><?php echo esc_html( $label ); ?></strong>
		<select name="<?php echo esc_attr( $name ); ?>" class="widefat">
			<?php foreach ( $options as $value => $option_label ) : ?>
				<option value="<?php echo esc_attr( (string) $value ); ?>" <?php selected( $selected, (string) $value ); ?>><?php echo esc_html( (string) $option_label ); ?></option>
			<?php endforeach; ?>
		</select>
	</label>
	<?php
}

function justice_theme_legal_request_fulfillment_lawyer_options(): array {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 50,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'fields'         => 'ids',
	) );

	$options = array();

	foreach ( $query->posts as $lawyer_id ) {
		$options[ (int) $lawyer_id ] = sprintf( '#%d - %s', (int) $lawyer_id, get_the_title( (int) $lawyer_id ) ?: 'Untitled lawyer' );
	}

	return $options;
}

function justice_theme_legal_request_fulfillment_readiness( int $request_id ): array {
	$mode       = (string) get_post_meta( $request_id, 'fulfillment_mode', true );
	$status     = (string) get_post_meta( $request_id, 'fulfillment_status', true );
	$lawyer_id  = (int) get_post_meta( $request_id, 'managing_lawyer_id', true );
	$engagement = (string) get_post_meta( $request_id, 'engagement_letter_status', true );
	$ethics     = (string) get_post_meta( $request_id, 'ethics_review_status', true );
	$payment    = (string) get_post_meta( $request_id, 'client_payment_status', true );

	if ( 'blocked' === $mode || 'blocked' === $status || 'blocked' === $engagement || 'blocked' === $ethics || 'blocked' === $payment ) {
		return array(
			'label'  => 'Blocked',
			'detail' => 'One or more fulfillment gates is blocked. Do not sell, route or fulfill this package.',
		);
	}

	if ( 'lawyer_managed_package' !== $mode ) {
		return array(
			'label'  => 'Referral / review mode',
			'detail' => 'This request is not approved as a managed packaged service. Treat it as referral-only or owner review.',
		);
	}

	$missing = array();

	if ( $lawyer_id <= 0 ) {
		$missing[] = 'managing lawyer';
	}

	if ( 'signed' !== $engagement ) {
		$missing[] = 'signed engagement letter';
	}

	if ( 'approved_for_pilot' !== $ethics ) {
		$missing[] = 'ethics approval';
	}

	if ( 'paid' !== $payment ) {
		$missing[] = 'payment proof';
	}

	if ( $missing ) {
		return array(
			'label'  => 'Not ready for managed fulfillment',
			'detail' => 'Missing: ' . implode( ', ', $missing ) . '.',
		);
	}

	return array(
		'label'  => 'Ready for controlled manual fulfillment',
		'detail' => 'Lawyer, engagement, ethics and payment gates are recorded. Owner still needs to supervise manually.',
	);
}

function justice_theme_save_legal_request_fulfillment_meta( int $post_id ): void {
	if ( ! isset( $_POST['justice_legal_request_fulfillment_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_legal_request_fulfillment_nonce'] ) ), 'justice_legal_request_fulfillment' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$select_fields = array(
		'fulfillment_mode'         => justice_theme_fulfillment_mode_options(),
		'fulfillment_status'       => justice_theme_fulfillment_status_options(),
		'service_package_key'      => justice_theme_service_package_options(),
		'engagement_letter_status' => justice_theme_engagement_letter_status_options(),
		'ethics_review_status'     => justice_theme_ethics_review_status_options(),
		'client_payment_status'    => justice_theme_client_payment_status_options(),
	);

	foreach ( $select_fields as $field => $options ) {
		$value = isset( $_POST[ $field ] ) ? sanitize_key( wp_unslash( $_POST[ $field ] ) ) : '';
		if ( ! array_key_exists( $value, $options ) ) {
			$option_keys = array_keys( $options );
			$value       = (string) ( $option_keys[0] ?? '' );
		}
		update_post_meta( $post_id, $field, $value );
	}

	update_post_meta( $post_id, 'managing_lawyer_id', isset( $_POST['managing_lawyer_id'] ) ? absint( wp_unslash( $_POST['managing_lawyer_id'] ) ) : 0 );
	update_post_meta( $post_id, 'managed_service_price_ils', isset( $_POST['managed_service_price_ils'] ) ? absint( wp_unslash( $_POST['managed_service_price_ils'] ) ) : 0 );
	update_post_meta( $post_id, 'customer_case_reference', isset( $_POST['customer_case_reference'] ) ? sanitize_text_field( wp_unslash( $_POST['customer_case_reference'] ) ) : '' );
	update_post_meta( $post_id, 'owner_fulfillment_note', isset( $_POST['owner_fulfillment_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['owner_fulfillment_note'] ) ) : '' );
}
add_action( 'save_post_justice_legal_request', 'justice_theme_save_legal_request_fulfillment_meta' );

function justice_theme_legal_request_fulfillment_summary( int $limit = 12 ): ?WP_Query {
	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => 'justice_legal_request',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'fulfillment_mode',
				'compare' => 'EXISTS',
			),
			array(
				'key'     => 'service_package_key',
				'compare' => 'EXISTS',
			),
		),
	) );
}

function justice_theme_render_managed_service_fulfillment_panel(): void {
	$query = justice_theme_legal_request_fulfillment_summary();
	?>
	<div class="postbox" style="padding:0;margin:18px 0;border:1px solid #dcdcde;">
		<div style="padding:16px 18px;border-bottom:1px solid #dcdcde;background:#fff;">
			<h2 style="margin:0;">Managed legal-service fulfillment preflight</h2>
			<p style="margin:8px 0 0;color:#50575e;">Private gate for packaged-service experiments. This is not a public law-firm launch and does not trigger AI, payment, routing or client communication.</p>
		</div>
		<div style="padding:18px;background:#f6f7f7;">
			<div class="notice notice-warning inline" style="margin:0 0 12px;">
				<p><strong>BLOCKED for public launch:</strong> ethics/Bar engagement structure, managing lawyer of record, signed client engagement and payment proof must be recorded before any package is fulfilled.</p>
			</div>
			<?php if ( ! $query ) : ?>
				<p><code>justice_legal_request</code> is not active yet.</p>
			<?php elseif ( ! $query->have_posts() ) : ?>
				<p>No managed-service requests are staged yet.</p>
			<?php else : ?>
				<table class="widefat striped">
					<thead>
						<tr>
							<th>Request</th>
							<th>Package</th>
							<th>Mode / status</th>
							<th>Readiness</th>
							<th>Owner action</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $query->posts as $request ) : ?>
							<?php
							$request_id = (int) $request->ID;
							$readiness  = justice_theme_legal_request_fulfillment_readiness( $request_id );
							$package    = (string) get_post_meta( $request_id, 'service_package_key', true );
							$mode       = (string) get_post_meta( $request_id, 'fulfillment_mode', true );
							$status     = (string) get_post_meta( $request_id, 'fulfillment_status', true );
							?>
							<tr>
								<td><strong><?php echo esc_html( get_the_title( $request_id ) ?: sprintf( 'Request #%d', $request_id ) ); ?></strong><br><small>#<?php echo esc_html( (string) $request_id ); ?></small></td>
								<td><?php echo esc_html( justice_theme_service_package_options()[ $package ] ?? ( $package ?: 'Not selected' ) ); ?></td>
								<td><?php echo esc_html( ( justice_theme_fulfillment_mode_options()[ $mode ] ?? ( $mode ?: 'Not set' ) ) . ' / ' . ( justice_theme_fulfillment_status_options()[ $status ] ?? ( $status ?: 'Not set' ) ) ); ?></td>
								<td><strong><?php echo esc_html( $readiness['label'] ); ?></strong><br><small><?php echo esc_html( $readiness['detail'] ); ?></small></td>
								<td><a class="button" href="<?php echo esc_url( get_edit_post_link( $request_id, '' ) ); ?>">Open fulfillment gate</a></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>
		</div>
	</div>
	<?php
}
