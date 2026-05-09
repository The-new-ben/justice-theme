<?php
/**
 * Justice Lawyer CPT — paid directory system.
 *
 * CPT slug: justice_lawyer
 * Archive: /lawyers/
 * Single: /lawyers/{slug}/
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register justice_lawyer CPT.
 */
function uje_register_lawyer_cpt() {
	$labels = array(
		'name'               => 'עורכי דין',
		'singular_name'      => 'עורך דין',
		'menu_name'          => 'עורכי דין',
		'add_new'            => 'הוסף עורך דין',
		'add_new_item'       => 'הוסף עורך דין חדש',
		'edit_item'          => 'ערוך פרופיל עורך דין',
		'new_item'           => 'עורך דין חדש',
		'view_item'          => 'צפה בפרופיל',
		'search_items'       => 'חפש עורכי דין',
		'not_found'          => 'לא נמצאו עורכי דין',
		'not_found_in_trash' => 'לא נמצאו עורכי דין בפח',
		'all_items'          => 'כל עורכי הדין',
	);

	register_post_type( 'justice_lawyer', array(
		'labels'              => $labels,
		'public'              => true,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'has_archive'         => true,
		'menu_position'       => 6,
		'menu_icon'           => 'dashicons-businessperson',
		'rewrite'             => array(
			'slug'       => 'lawyers',
			'with_front' => false,
		),
		'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields' ),
		'capability_type'     => 'post',
		'taxonomies'          => array( 'practice-areas', 'city' ),
	) );
}
add_action( 'init', 'uje_register_lawyer_cpt' );

/**
 * Register all lawyer meta fields.
 */
function uje_register_lawyer_meta() {
	$fields = array(
		// Identity
		'lawyer_full_name'       => 'string',
		'firm_name'              => 'string',
		'bar_number'             => 'string',
		'bio_short'              => 'string',

		// Professional
		'languages'              => 'string',
		'years_experience'       => 'integer',
		'courts'                 => 'string',
		'license_status'         => 'string',
		'verification_status'    => 'string',

		// Contact
		'phone'                  => 'string',
		'email'                  => 'string',
		'whatsapp'               => 'string',
		'website'                => 'string',
		'office_address'         => 'string',

		// Commercial
		'plan_type'              => 'string',
		'subscription_status'    => 'string',
		'featured_until'         => 'string',
		'priority_score'         => 'integer',
		'lead_routing_enabled'   => 'boolean',
		'monthly_lead_limit'     => 'integer',

		// Analytics
		'profile_views'          => 'integer',
		'leads_received'         => 'integer',
		'leads_accepted'         => 'integer',

		// Admin
		'source_url'             => 'string',
		'source_type'            => 'string',
		'claimed_by_user_id'     => 'integer',
		'profile_status'         => 'string',
		'internal_notes'         => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lawyer', $key, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $type,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
}
add_action( 'init', 'uje_register_lawyer_meta' );

/**
 * Admin columns for lawyer listing.
 */
function uje_lawyer_admin_columns( $columns ) {
	$new = array();
	foreach ( $columns as $key => $label ) {
		$new[ $key ] = $label;
		if ( 'title' === $key ) {
			$new['lawyer_plan']     = 'חבילה';
			$new['lawyer_city']     = 'עיר';
			$new['lawyer_status']   = 'סטטוס';
			$new['lawyer_views']    = 'צפיות';
			$new['lawyer_leads']    = 'לידים';
			$new['lawyer_verified'] = 'אימות';
		}
	}
	unset( $new['date'] );
	return $new;
}
add_filter( 'manage_justice_lawyer_posts_columns', 'uje_lawyer_admin_columns' );

/**
 * Populate admin columns.
 */
function uje_lawyer_column_content( $column, $post_id ) {
	switch ( $column ) {
		case 'lawyer_plan':
			$plan  = get_post_meta( $post_id, 'plan_type', true );
			$plans = array( 'free' => 'חינם', 'pro' => 'פרו', 'featured' => 'מוצג', 'lead_partner' => 'שותף לידים', 'full_service' => 'שירות מלא' );
			echo esc_html( isset( $plans[ $plan ] ) ? $plans[ $plan ] : '—' );
			break;

		case 'lawyer_city':
			$terms = get_the_terms( $post_id, 'city' );
			echo $terms && ! is_wp_error( $terms ) ? esc_html( implode( ', ', wp_list_pluck( $terms, 'name' ) ) ) : '—';
			break;

		case 'lawyer_status':
			$status = get_post_meta( $post_id, 'profile_status', true );
			$labels = array( 'draft' => 'טיוטה', 'imported' => 'יובא', 'pending' => 'ממתין', 'active' => 'פעיל', 'suspended' => 'מושעה' );
			echo esc_html( isset( $labels[ $status ] ) ? $labels[ $status ] : ( $status ?: '—' ) );
			break;

		case 'lawyer_views':
			echo esc_html( get_post_meta( $post_id, 'profile_views', true ) ?: '0' );
			break;

		case 'lawyer_leads':
			echo esc_html( get_post_meta( $post_id, 'leads_received', true ) ?: '0' );
			break;

		case 'lawyer_verified':
			$v = get_post_meta( $post_id, 'verification_status', true );
			$icons = array( 'verified' => '✓', 'unverified' => '—', 'pending' => '...' );
			echo esc_html( isset( $icons[ $v ] ) ? $icons[ $v ] : '—' );
			break;
	}
}
add_action( 'manage_justice_lawyer_posts_custom_column', 'uje_lawyer_column_content', 10, 2 );

/**
 * Sortable columns.
 */
function uje_lawyer_sortable_columns( $columns ) {
	$columns['lawyer_views'] = 'profile_views';
	$columns['lawyer_leads'] = 'leads_received';
	return $columns;
}
add_filter( 'manage_edit-justice_lawyer_sortable_columns', 'uje_lawyer_sortable_columns' );

/**
 * Meta box for lawyer details.
 */
function uje_lawyer_meta_boxes() {
	add_meta_box( 'justice_lawyer_identity', 'זהות עורך הדין', 'uje_lawyer_identity_box', 'justice_lawyer', 'normal', 'high' );
	add_meta_box( 'justice_lawyer_contact', 'פרטי התקשרות', 'uje_lawyer_contact_box', 'justice_lawyer', 'normal', 'default' );
	add_meta_box( 'justice_lawyer_commercial', 'מסחרי ומנהלי', 'uje_lawyer_commercial_box', 'justice_lawyer', 'side', 'default' );
}
add_action( 'add_meta_boxes', 'uje_lawyer_meta_boxes' );

/**
 * Identity meta box.
 */
function uje_lawyer_identity_box( $post ) {
	wp_nonce_field( 'justice_lawyer_meta', 'justice_lawyer_nonce' );
	$fields = array(
		array( 'key' => 'lawyer_full_name',    'label' => 'שם מלא',              'type' => 'text' ),
		array( 'key' => 'firm_name',           'label' => 'שם המשרד',            'type' => 'text' ),
		array( 'key' => 'bar_number',          'label' => 'מספר רישיון',          'type' => 'text' ),
		array( 'key' => 'bio_short',           'label' => 'תיאור קצר',           'type' => 'textarea' ),
		array( 'key' => 'languages',           'label' => 'שפות',                'type' => 'text' ),
		array( 'key' => 'years_experience',    'label' => 'שנות ניסיון',          'type' => 'number' ),
		array( 'key' => 'courts',              'label' => 'בתי משפט',             'type' => 'text' ),
		array( 'key' => 'license_status',      'label' => 'סטטוס רישיון',         'type' => 'select', 'options' => array( 'active' => 'פעיל', 'inactive' => 'לא פעיל', 'suspended' => 'מושעה' ) ),
		array( 'key' => 'verification_status', 'label' => 'סטטוס אימות',          'type' => 'select', 'options' => array( 'unverified' => 'לא מאומת', 'pending' => 'בבדיקה', 'verified' => 'מאומת' ) ),
	);
	uje_render_meta_fields( $post, $fields );
}

/**
 * Contact meta box.
 */
function uje_lawyer_contact_box( $post ) {
	$fields = array(
		array( 'key' => 'phone',          'label' => 'טלפון',           'type' => 'tel' ),
		array( 'key' => 'email',          'label' => 'אימייל',          'type' => 'email' ),
		array( 'key' => 'whatsapp',       'label' => 'וואטסאפ',         'type' => 'tel' ),
		array( 'key' => 'website',        'label' => 'אתר',             'type' => 'url' ),
		array( 'key' => 'office_address', 'label' => 'כתובת משרד',      'type' => 'text' ),
	);
	uje_render_meta_fields( $post, $fields );
}

/**
 * Commercial meta box.
 */
function uje_lawyer_commercial_box( $post ) {
	$fields = array(
		array( 'key' => 'plan_type',           'label' => 'חבילה',            'type' => 'select', 'options' => array( 'free' => 'חינם', 'pro' => 'פרו', 'featured' => 'מוצג', 'lead_partner' => 'שותף לידים', 'full_service' => 'שירות מלא' ) ),
		array( 'key' => 'subscription_status', 'label' => 'סטטוס מנוי',       'type' => 'select', 'options' => array( 'inactive' => 'לא פעיל', 'active' => 'פעיל', 'expired' => 'פג תוקף', 'cancelled' => 'בוטל' ) ),
		array( 'key' => 'lead_routing_enabled','label' => 'ניתוב לידים',      'type' => 'checkbox' ),
		array( 'key' => 'profile_status',      'label' => 'סטטוס פרופיל',     'type' => 'select', 'options' => array( 'draft' => 'טיוטה', 'imported' => 'יובא', 'pending' => 'ממתין לאישור', 'active' => 'פעיל', 'suspended' => 'מושעה' ) ),
		array( 'key' => 'source_url',          'label' => 'מקור',             'type' => 'url' ),
		array( 'key' => 'source_type',         'label' => 'סוג מקור',          'type' => 'select', 'options' => array( 'manual' => 'ידני', 'import' => 'ייבוא', 'registration' => 'הרשמה', 'seed' => 'זרע לבדיקה' ) ),
		array( 'key' => 'internal_notes',      'label' => 'הערות פנימיות',     'type' => 'textarea' ),
	);
	uje_render_meta_fields( $post, $fields );
}

/**
 * Generic meta field renderer.
 */
function uje_render_meta_fields( $post, $fields ) {
	echo '<table class="form-table" style="margin:0;">';
	foreach ( $fields as $f ) {
		$value = get_post_meta( $post->ID, $f['key'], true );
		echo '<tr><th style="width:130px;padding:8px 10px;"><label for="' . esc_attr( $f['key'] ) . '">' . esc_html( $f['label'] ) . '</label></th><td style="padding:8px 10px;">';

		if ( 'select' === $f['type'] ) {
			echo '<select id="' . esc_attr( $f['key'] ) . '" name="' . esc_attr( $f['key'] ) . '" style="min-width:160px;">';
			echo '<option value="">—</option>';
			foreach ( $f['options'] as $v => $l ) {
				echo '<option value="' . esc_attr( $v ) . '" ' . selected( $value, $v, false ) . '>' . esc_html( $l ) . '</option>';
			}
			echo '</select>';
		} elseif ( 'textarea' === $f['type'] ) {
			echo '<textarea id="' . esc_attr( $f['key'] ) . '" name="' . esc_attr( $f['key'] ) . '" class="large-text" rows="3">' . esc_textarea( $value ) . '</textarea>';
		} elseif ( 'checkbox' === $f['type'] ) {
			echo '<label><input type="checkbox" id="' . esc_attr( $f['key'] ) . '" name="' . esc_attr( $f['key'] ) . '" value="1" ' . checked( $value, '1', false ) . '> ' . esc_html( $f['label'] ) . '</label>';
		} else {
			echo '<input type="' . esc_attr( $f['type'] ) . '" id="' . esc_attr( $f['key'] ) . '" name="' . esc_attr( $f['key'] ) . '" value="' . esc_attr( $value ) . '" class="regular-text">';
		}

		echo '</td></tr>';
	}
	echo '</table>';
}

/**
 * Save lawyer meta.
 */
function uje_save_lawyer_meta( $post_id ) {
	if ( ! isset( $_POST['justice_lawyer_nonce'] ) || ! wp_verify_nonce( $_POST['justice_lawyer_nonce'], 'justice_lawyer_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$text_fields = array(
		'lawyer_full_name', 'firm_name', 'bar_number', 'bio_short',
		'languages', 'courts', 'license_status', 'verification_status',
		'phone', 'email', 'whatsapp', 'website', 'office_address',
		'plan_type', 'subscription_status', 'featured_until',
		'source_url', 'source_type', 'profile_status', 'internal_notes',
	);

	foreach ( $text_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}

	$int_fields = array( 'years_experience', 'priority_score', 'monthly_lead_limit' );
	foreach ( $int_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, absint( $_POST[ $field ] ) );
		}
	}

	update_post_meta( $post_id, 'lead_routing_enabled', isset( $_POST['lead_routing_enabled'] ) ? '1' : '0' );
}
add_action( 'save_post_justice_lawyer', 'uje_save_lawyer_meta' );
