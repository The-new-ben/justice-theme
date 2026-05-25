<?php
/**
 * Internal supplier marketplace for lawyer-facing revenue.
 *
 * This is intentionally admin-only at launch. It lets the owner build a
 * supplier pipeline for services lawyers already buy: translations,
 * office rooms, marketing, expert witnesses, legal tech, finance, couriers
 * and training. Public exposure should come later, after commercial terms
 * and compliance review.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_supplier_cpt(): void {
	$labels = array(
		'name'          => __( 'Lawyer Suppliers', 'justice-theme' ),
		'singular_name' => __( 'Lawyer Supplier', 'justice-theme' ),
		'add_new_item'  => __( 'Add Lawyer Supplier', 'justice-theme' ),
		'edit_item'     => __( 'Edit Lawyer Supplier', 'justice-theme' ),
		'menu_name'     => __( 'Suppliers', 'justice-theme' ),
	);

	register_post_type(
		'justice_supplier',
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
add_action( 'init', 'justice_theme_register_lawyer_supplier_cpt' );

function justice_theme_register_lawyer_supplier_meta(): void {
	$fields = array(
		'supplier_category'           => 'string',
		'supplier_website'            => 'string',
		'supplier_contact_name'       => 'string',
		'supplier_contact_email'      => 'string',
		'supplier_contact_phone'      => 'string',
		'supplier_service_area'       => 'string',
		'supplier_offer_summary'      => 'string',
		'supplier_partnership_status' => 'string',
		'supplier_revenue_model'      => 'string',
		'supplier_priority'           => 'string',
		'supplier_public_visibility'  => 'string',
		'supplier_public_badge'       => 'string',
		'supplier_source_url'         => 'string',
		'supplier_owner_note'         => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta(
			'justice_supplier',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => justice_theme_lawyer_supplier_meta_sanitizer( $key ),
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_lawyer_supplier_meta' );

function justice_theme_lawyer_supplier_meta_sanitizer( string $key ): string {
	if ( in_array( $key, array( 'supplier_website', 'supplier_source_url' ), true ) ) {
		return 'esc_url_raw';
	}

	if ( in_array( $key, array( 'supplier_offer_summary', 'supplier_owner_note' ), true ) ) {
		return 'sanitize_textarea_field';
	}

	return 'sanitize_text_field';
}

function justice_theme_lawyer_supplier_categories(): array {
	return array(
		'translation_notary' => __( 'Translation / notary / apostille', 'justice-theme' ),
		'office_space'      => __( 'Office rooms / meeting rooms', 'justice-theme' ),
		'legal_marketing'   => __( 'Legal marketing / video / branding', 'justice-theme' ),
		'expert_witness'    => __( 'Expert witnesses / private investigators', 'justice-theme' ),
		'legal_tech'        => __( 'Legal tech / automation / CRM', 'justice-theme' ),
		'finance_tax'       => __( 'Finance / accounting / tax', 'justice-theme' ),
		'courier_filing'    => __( 'Courier / filing / court operations', 'justice-theme' ),
		'training_events'   => __( 'Training / events / professional education', 'justice-theme' ),
		'other'             => __( 'Other', 'justice-theme' ),
	);
}

function justice_theme_lawyer_supplier_statuses(): array {
	return array(
		'research'    => __( 'Research', 'justice-theme' ),
		'outreach'    => __( 'Outreach ready', 'justice-theme' ),
		'contacted'   => __( 'Contacted', 'justice-theme' ),
		'negotiating' => __( 'Negotiating', 'justice-theme' ),
		'approved'    => __( 'Approved partner', 'justice-theme' ),
		'rejected'    => __( 'Rejected / not fit', 'justice-theme' ),
	);
}

function justice_theme_lawyer_supplier_revenue_models(): array {
	return array(
		'monthly_listing' => __( 'Monthly listing fee', 'justice-theme' ),
		'lead_fee'        => __( 'Lead fee', 'justice-theme' ),
		'affiliate'       => __( 'Affiliate / referral commission', 'justice-theme' ),
		'sponsorship'     => __( 'Category sponsorship', 'justice-theme' ),
		'barter'          => __( 'Barter / strategic value', 'justice-theme' ),
		'unknown'         => __( 'Unknown', 'justice-theme' ),
	);
}

function justice_theme_lawyer_supplier_public_visibility_options(): array {
	return array(
		'private' => __( 'Private / internal only', 'justice-theme' ),
		'show'    => __( 'Approved for public display', 'justice-theme' ),
		'hide'    => __( 'Hidden from public display', 'justice-theme' ),
	);
}

function justice_theme_lawyer_supplier_normalize_public_visibility( string $visibility ): string {
	$visibility = sanitize_key( $visibility );

	if ( ! array_key_exists( $visibility, justice_theme_lawyer_supplier_public_visibility_options() ) ) {
		return 'private';
	}

	return $visibility;
}

function justice_theme_lawyer_supplier_is_public_ready( int $post_id ): bool {
	if ( 'justice_supplier' !== get_post_type( $post_id ) || 'publish' !== get_post_status( $post_id ) ) {
		return false;
	}

	$visibility = justice_theme_lawyer_supplier_normalize_public_visibility( (string) get_post_meta( $post_id, 'supplier_public_visibility', true ) );
	$status     = sanitize_key( (string) get_post_meta( $post_id, 'supplier_partnership_status', true ) );
	$summary    = trim( (string) get_post_meta( $post_id, 'supplier_offer_summary', true ) );
	$website    = trim( (string) get_post_meta( $post_id, 'supplier_website', true ) );
	$source_url = trim( (string) get_post_meta( $post_id, 'supplier_source_url', true ) );

	return 'show' === $visibility && 'approved' === $status && '' !== $summary && ( '' !== $website || '' !== $source_url );
}

function justice_theme_lawyer_supplier_meta_boxes(): void {
	add_meta_box(
		'justice_theme_lawyer_supplier_details',
		__( 'Supplier Commercial Details', 'justice-theme' ),
		'justice_theme_render_lawyer_supplier_details_box',
		'justice_supplier',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_lawyer_supplier_meta_boxes' );

function justice_theme_render_lawyer_supplier_details_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_supplier_details', 'justice_theme_lawyer_supplier_details_nonce' );

	$category = (string) get_post_meta( $post->ID, 'supplier_category', true ) ?: 'other';
	$status   = (string) get_post_meta( $post->ID, 'supplier_partnership_status', true ) ?: 'research';
	$revenue  = (string) get_post_meta( $post->ID, 'supplier_revenue_model', true ) ?: 'unknown';
	$priority = (string) get_post_meta( $post->ID, 'supplier_priority', true ) ?: 'medium';
	$public_visibility = justice_theme_lawyer_supplier_normalize_public_visibility( (string) get_post_meta( $post->ID, 'supplier_public_visibility', true ) );
	?>
	<p>Use this as a private pipeline. Do not publish supplier claims or send lawyers to a supplier until terms, disclosure and quality are reviewed.</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-supplier-category">Category</label></th>
			<td>
				<select id="justice-supplier-category" name="supplier_category">
					<?php foreach ( justice_theme_lawyer_supplier_categories() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $category, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-supplier-status">Partnership status</label></th>
			<td>
				<select id="justice-supplier-status" name="supplier_partnership_status">
					<?php foreach ( justice_theme_lawyer_supplier_statuses() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $status, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-supplier-revenue">Revenue model</label></th>
			<td>
				<select id="justice-supplier-revenue" name="supplier_revenue_model">
					<?php foreach ( justice_theme_lawyer_supplier_revenue_models() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $revenue, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-supplier-priority">Priority</label></th>
			<td>
				<select id="justice-supplier-priority" name="supplier_priority">
					<?php foreach ( array( 'high', 'medium', 'low' ) as $value ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $priority, $value ); ?>><?php echo esc_html( ucfirst( $value ) ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-supplier-public-visibility">Public visibility</label></th>
			<td>
				<select id="justice-supplier-public-visibility" name="supplier_public_visibility">
					<?php foreach ( justice_theme_lawyer_supplier_public_visibility_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $public_visibility, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">Public display also requires Partnership status = Approved, an offer summary, and a website or source URL.</p>
			</td>
		</tr>
		<?php
		$plain_fields = array(
			'supplier_website'       => 'Website',
			'supplier_contact_name'  => 'Contact name',
			'supplier_contact_email' => 'Contact email',
			'supplier_contact_phone' => 'Contact phone',
			'supplier_service_area'  => 'Service area',
			'supplier_public_badge'  => 'Public badge',
			'supplier_source_url'    => 'Source URL',
		);
		foreach ( $plain_fields as $key => $label ) :
			$type = false !== strpos( $key, 'email' ) ? 'email' : ( false !== strpos( $key, 'url' ) || false !== strpos( $key, 'website' ) ? 'url' : 'text' );
			?>
			<tr>
				<th scope="row"><label for="justice-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th>
				<td><input id="justice-<?php echo esc_attr( $key ); ?>" type="<?php echo esc_attr( $type ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( (string) get_post_meta( $post->ID, $key, true ) ); ?>" class="regular-text"></td>
			</tr>
		<?php endforeach; ?>
		<tr>
			<th scope="row"><label for="justice-supplier-offer-summary">Offer summary</label></th>
			<td><textarea id="justice-supplier-offer-summary" name="supplier_offer_summary" rows="4" class="large-text"><?php echo esc_textarea( (string) get_post_meta( $post->ID, 'supplier_offer_summary', true ) ); ?></textarea></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-supplier-owner-note">Owner note</label></th>
			<td><textarea id="justice-supplier-owner-note" name="supplier_owner_note" rows="4" class="large-text"><?php echo esc_textarea( (string) get_post_meta( $post->ID, 'supplier_owner_note', true ) ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

function justice_theme_save_lawyer_supplier_details( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_supplier_details_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_supplier_details_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_supplier_details' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$category = isset( $_POST['supplier_category'] ) ? sanitize_key( wp_unslash( $_POST['supplier_category'] ) ) : 'other';
	if ( ! array_key_exists( $category, justice_theme_lawyer_supplier_categories() ) ) {
		$category = 'other';
	}

	$status = isset( $_POST['supplier_partnership_status'] ) ? sanitize_key( wp_unslash( $_POST['supplier_partnership_status'] ) ) : 'research';
	if ( ! array_key_exists( $status, justice_theme_lawyer_supplier_statuses() ) ) {
		$status = 'research';
	}

	$revenue = isset( $_POST['supplier_revenue_model'] ) ? sanitize_key( wp_unslash( $_POST['supplier_revenue_model'] ) ) : 'unknown';
	if ( ! array_key_exists( $revenue, justice_theme_lawyer_supplier_revenue_models() ) ) {
		$revenue = 'unknown';
	}

	$priority = isset( $_POST['supplier_priority'] ) ? sanitize_key( wp_unslash( $_POST['supplier_priority'] ) ) : 'medium';
	if ( ! in_array( $priority, array( 'high', 'medium', 'low' ), true ) ) {
		$priority = 'medium';
	}

	update_post_meta( $post_id, 'supplier_category', $category );
	update_post_meta( $post_id, 'supplier_partnership_status', $status );
	update_post_meta( $post_id, 'supplier_revenue_model', $revenue );
	update_post_meta( $post_id, 'supplier_priority', $priority );
	update_post_meta(
		$post_id,
		'supplier_public_visibility',
		isset( $_POST['supplier_public_visibility'] )
			? justice_theme_lawyer_supplier_normalize_public_visibility( (string) wp_unslash( $_POST['supplier_public_visibility'] ) )
			: 'private'
	);

	$text_fields = array(
		'supplier_contact_name',
		'supplier_contact_email',
		'supplier_contact_phone',
		'supplier_service_area',
		'supplier_public_badge',
	);
	foreach ( $text_fields as $key ) {
		update_post_meta( $post_id, $key, isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '' );
	}

	update_post_meta( $post_id, 'supplier_website', isset( $_POST['supplier_website'] ) ? esc_url_raw( wp_unslash( $_POST['supplier_website'] ) ) : '' );
	update_post_meta( $post_id, 'supplier_source_url', isset( $_POST['supplier_source_url'] ) ? esc_url_raw( wp_unslash( $_POST['supplier_source_url'] ) ) : '' );
	update_post_meta( $post_id, 'supplier_offer_summary', isset( $_POST['supplier_offer_summary'] ) ? sanitize_textarea_field( wp_unslash( $_POST['supplier_offer_summary'] ) ) : '' );
	update_post_meta( $post_id, 'supplier_owner_note', isset( $_POST['supplier_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['supplier_owner_note'] ) ) : '' );
}
add_action( 'save_post_justice_supplier', 'justice_theme_save_lawyer_supplier_details' );

function justice_theme_lawyer_supplier_admin_columns( array $columns ): array {
	$columns['supplier_category'] = __( 'Category', 'justice-theme' );
	$columns['supplier_status']   = __( 'Status', 'justice-theme' );
	$columns['supplier_revenue']  = __( 'Revenue model', 'justice-theme' );
	$columns['supplier_priority'] = __( 'Priority', 'justice-theme' );
	$columns['supplier_public']   = __( 'Public', 'justice-theme' );
	return $columns;
}
add_filter( 'manage_justice_supplier_posts_columns', 'justice_theme_lawyer_supplier_admin_columns' );

function justice_theme_lawyer_supplier_admin_column( string $column, int $post_id ): void {
	if ( 'supplier_category' === $column ) {
		$category = (string) get_post_meta( $post_id, 'supplier_category', true );
		echo esc_html( justice_theme_lawyer_supplier_categories()[ $category ] ?? $category );
	}

	if ( 'supplier_status' === $column ) {
		$status = (string) get_post_meta( $post_id, 'supplier_partnership_status', true );
		echo esc_html( justice_theme_lawyer_supplier_statuses()[ $status ] ?? $status );
	}

	if ( 'supplier_revenue' === $column ) {
		$revenue = (string) get_post_meta( $post_id, 'supplier_revenue_model', true );
		echo esc_html( justice_theme_lawyer_supplier_revenue_models()[ $revenue ] ?? $revenue );
	}

	if ( 'supplier_priority' === $column ) {
		echo esc_html( (string) get_post_meta( $post_id, 'supplier_priority', true ) );
	}

	if ( 'supplier_public' === $column ) {
		$visibility = justice_theme_lawyer_supplier_normalize_public_visibility( (string) get_post_meta( $post_id, 'supplier_public_visibility', true ) );
		echo esc_html( justice_theme_lawyer_supplier_public_visibility_options()[ $visibility ] ?? $visibility );

		if ( justice_theme_lawyer_supplier_is_public_ready( $post_id ) ) {
			echo '<br><strong>' . esc_html__( 'Ready for homepage', 'justice-theme' ) . '</strong>';
		}
	}
}
add_action( 'manage_justice_supplier_posts_custom_column', 'justice_theme_lawyer_supplier_admin_column', 10, 2 );

function justice_theme_lawyer_supplier_admin_filters( string $post_type ): void {
	if ( 'justice_supplier' !== $post_type ) {
		return;
	}

	$filters = array(
		'justice_supplier_category_filter' => array(
			'label'   => __( 'All supplier categories', 'justice-theme' ),
			'meta'    => 'supplier_category',
			'current' => isset( $_GET['justice_supplier_category_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_supplier_category_filter'] ) ) : '',
			'options' => justice_theme_lawyer_supplier_categories(),
		),
		'justice_supplier_status_filter' => array(
			'label'   => __( 'All partnership statuses', 'justice-theme' ),
			'meta'    => 'supplier_partnership_status',
			'current' => isset( $_GET['justice_supplier_status_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_supplier_status_filter'] ) ) : '',
			'options' => justice_theme_lawyer_supplier_statuses(),
		),
		'justice_supplier_priority_filter' => array(
			'label'   => __( 'All priorities', 'justice-theme' ),
			'meta'    => 'supplier_priority',
			'current' => isset( $_GET['justice_supplier_priority_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_supplier_priority_filter'] ) ) : '',
			'options' => array(
				'high'   => __( 'High', 'justice-theme' ),
				'medium' => __( 'Medium', 'justice-theme' ),
				'low'    => __( 'Low', 'justice-theme' ),
			),
		),
		'justice_supplier_public_filter' => array(
			'label'   => __( 'All public visibility states', 'justice-theme' ),
			'meta'    => 'supplier_public_visibility',
			'current' => isset( $_GET['justice_supplier_public_filter'] ) ? sanitize_key( wp_unslash( $_GET['justice_supplier_public_filter'] ) ) : '',
			'options' => justice_theme_lawyer_supplier_public_visibility_options(),
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
add_action( 'restrict_manage_posts', 'justice_theme_lawyer_supplier_admin_filters' );

function justice_theme_lawyer_supplier_admin_filter_query( WP_Query $query ): void {
	if ( ! is_admin() || ! $query->is_main_query() || 'justice_supplier' !== $query->get( 'post_type' ) ) {
		return;
	}

	$filter_map = array(
		'justice_supplier_category_filter' => 'supplier_category',
		'justice_supplier_status_filter'   => 'supplier_partnership_status',
		'justice_supplier_priority_filter' => 'supplier_priority',
		'justice_supplier_public_filter'   => 'supplier_public_visibility',
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
add_action( 'pre_get_posts', 'justice_theme_lawyer_supplier_admin_filter_query' );

function justice_theme_lawyer_supplier_bulk_actions( array $actions ): array {
	$actions['justice_supplier_public_show']    = __( 'Allow public display', 'justice-theme' );
	$actions['justice_supplier_public_hide']    = __( 'Hide from public display', 'justice-theme' );
	$actions['justice_supplier_public_private'] = __( 'Set public display to internal only', 'justice-theme' );

	return $actions;
}
add_filter( 'bulk_actions-edit-justice_supplier', 'justice_theme_lawyer_supplier_bulk_actions' );

function justice_theme_lawyer_supplier_handle_bulk_action( string $redirect_to, string $action, array $post_ids ): string {
	$visibility_by_action = array(
		'justice_supplier_public_show'    => 'show',
		'justice_supplier_public_hide'    => 'hide',
		'justice_supplier_public_private' => 'private',
	);

	if ( ! isset( $visibility_by_action[ $action ] ) ) {
		return $redirect_to;
	}

	$updated = 0;
	foreach ( $post_ids as $post_id ) {
		$post_id = (int) $post_id;
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			continue;
		}

		update_post_meta( $post_id, 'supplier_public_visibility', $visibility_by_action[ $action ] );
		++$updated;
	}

	return add_query_arg(
		array(
			'justice_supplier_public_bulk' => $visibility_by_action[ $action ],
			'justice_supplier_public_count' => $updated,
		),
		$redirect_to
	);
}
add_filter( 'handle_bulk_actions-edit-justice_supplier', 'justice_theme_lawyer_supplier_handle_bulk_action', 10, 3 );

function justice_theme_lawyer_supplier_bulk_notice(): void {
	if ( empty( $_GET['justice_supplier_public_bulk'] ) || empty( $_GET['justice_supplier_public_count'] ) ) {
		return;
	}

	$count      = absint( $_GET['justice_supplier_public_count'] );
	$visibility = justice_theme_lawyer_supplier_normalize_public_visibility( (string) wp_unslash( $_GET['justice_supplier_public_bulk'] ) );

	printf(
		'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
		esc_html(
			sprintf(
				/* translators: 1: number of suppliers, 2: public visibility label. */
				__( 'Updated %1$d supplier visibility records to: %2$s. Public display still requires approved status and source fields.', 'justice-theme' ),
				$count,
				justice_theme_lawyer_supplier_public_visibility_options()[ $visibility ] ?? $visibility
			)
		)
	);
}
add_action( 'admin_notices', 'justice_theme_lawyer_supplier_bulk_notice' );
