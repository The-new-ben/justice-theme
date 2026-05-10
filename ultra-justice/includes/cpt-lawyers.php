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
function uj_register_lawyer_cpt() {
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
add_action( 'init', 'uj_register_lawyer_cpt' );

/**
 * Register all lawyer meta fields.
 */
function uj_register_lawyer_meta() {
	$fields = array(
		// Identity
		'lawyer_full_name'       => 'string',
		'firm_name'              => 'string',
		'bar_number'             => 'string',
		'bio_short'              => 'string',
		'profile_headline'       => 'string',
		'profile_subheadline'    => 'string',
		'profile_approach_title' => 'string',
		'profile_approach'       => 'string',
		'profile_services'       => 'string',
		'profile_process'        => 'string',
		'profile_credentials'    => 'string',
		'profile_media_urls'     => 'string',
		'profile_faqs'           => 'string',
		'profile_testimonials'   => 'string',
		'profile_cta_title'      => 'string',
		'profile_cta_text'       => 'string',

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
		'profile_video_url'      => 'string',
		'linkedin_url'           => 'string',
		'facebook_url'           => 'string',
		'instagram_url'          => 'string',
		'youtube_url'            => 'string',

		// Commercial
		'plan_type'              => 'string',
		'subscription_status'    => 'string',
		'featured_until'         => 'string',
		'priority_score'         => 'integer',
		'lead_routing_enabled'   => 'boolean',
		'monthly_lead_limit'     => 'integer',
		'featured_on_front'      => 'boolean',

		// Analytics
		'profile_views'          => 'integer',
		'leads_received'         => 'integer',
		'leads_accepted'         => 'integer',
		'review_count'           => 'integer',
		'average_rating'         => 'number',

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
add_action( 'init', 'uj_register_lawyer_meta' );

/**
 * Admin columns for lawyer listing.
 */
function uj_lawyer_admin_columns( $columns ) {
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
add_filter( 'manage_justice_lawyer_posts_columns', 'uj_lawyer_admin_columns' );

/**
 * Populate admin columns.
 */
function uj_lawyer_column_content( $column, $post_id ) {
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
add_action( 'manage_justice_lawyer_posts_custom_column', 'uj_lawyer_column_content', 10, 2 );

/**
 * Sortable columns.
 */
function uj_lawyer_sortable_columns( $columns ) {
	$columns['lawyer_views'] = 'profile_views';
	$columns['lawyer_leads'] = 'leads_received';
	return $columns;
}
add_filter( 'manage_edit-justice_lawyer_sortable_columns', 'uj_lawyer_sortable_columns' );

/**
 * Meta box for lawyer details.
 */
function uj_lawyer_meta_boxes() {
	add_meta_box( 'justice_lawyer_identity', 'זהות עורך הדין', 'uj_lawyer_identity_box', 'justice_lawyer', 'normal', 'high' );
	add_meta_box( 'justice_lawyer_minisite', 'Lawyer mini-site content', 'uj_lawyer_minisite_box', 'justice_lawyer', 'normal', 'high' );
	add_meta_box( 'justice_lawyer_contact', 'פרטי התקשרות', 'uj_lawyer_contact_box', 'justice_lawyer', 'normal', 'default' );
	add_meta_box( 'justice_lawyer_commercial', 'מסחרי ומנהלי', 'uj_lawyer_commercial_box', 'justice_lawyer', 'side', 'default' );
}
add_action( 'add_meta_boxes', 'uj_lawyer_meta_boxes' );

/**
 * Identity meta box.
 */
function uj_lawyer_identity_box( $post ) {
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
	uj_render_meta_fields( $post, $fields );
}

/**
 * Mini-site content meta box.
 */
function uj_lawyer_minisite_box( $post ) {
	$fields = array(
		array( 'key' => 'profile_headline',       'label' => 'Hero headline',              'type' => 'text' ),
		array( 'key' => 'profile_subheadline',    'label' => 'Hero subheadline',           'type' => 'textarea' ),
		array( 'key' => 'profile_approach_title', 'label' => 'Approach section title',     'type' => 'text' ),
		array( 'key' => 'profile_approach',       'label' => 'Approach body',              'type' => 'textarea' ),
		array( 'key' => 'profile_services',       'label' => 'Services: title | text',     'type' => 'textarea' ),
		array( 'key' => 'profile_process',        'label' => 'Process: step | text',       'type' => 'textarea' ),
		array( 'key' => 'profile_credentials',    'label' => 'Credentials: title | text',  'type' => 'textarea' ),
		array( 'key' => 'profile_media_urls',     'label' => 'Media: title | url | note',  'type' => 'textarea' ),
		array( 'key' => 'profile_faqs',           'label' => 'FAQ: question | answer',     'type' => 'textarea' ),
		array( 'key' => 'profile_testimonials',   'label' => 'Testimonials: quote | name', 'type' => 'textarea' ),
		array( 'key' => 'profile_cta_title',      'label' => 'Final CTA title',            'type' => 'text' ),
		array( 'key' => 'profile_cta_text',       'label' => 'Final CTA text',             'type' => 'textarea' ),
	);
	uj_render_meta_fields( $post, $fields );
}

/**
 * Contact meta box.
 */
function uj_lawyer_contact_box( $post ) {
	$fields = array(
		array( 'key' => 'phone',          'label' => 'טלפון',           'type' => 'tel' ),
		array( 'key' => 'email',          'label' => 'אימייל',          'type' => 'email' ),
		array( 'key' => 'whatsapp',       'label' => 'וואטסאפ',         'type' => 'tel' ),
		array( 'key' => 'website',        'label' => 'אתר',             'type' => 'url' ),
		array( 'key' => 'office_address', 'label' => 'כתובת משרד',      'type' => 'text' ),
		array( 'key' => 'profile_video_url', 'label' => 'Profile video URL', 'type' => 'url' ),
		array( 'key' => 'linkedin_url',   'label' => 'LinkedIn URL',       'type' => 'url' ),
		array( 'key' => 'facebook_url',   'label' => 'Facebook URL',       'type' => 'url' ),
		array( 'key' => 'instagram_url',  'label' => 'Instagram URL',      'type' => 'url' ),
		array( 'key' => 'youtube_url',    'label' => 'YouTube URL',        'type' => 'url' ),
	);
	uj_render_meta_fields( $post, $fields );
}

/**
 * Commercial meta box.
 */
function uj_lawyer_commercial_box( $post ) {
	$fields = array(
		array( 'key' => 'plan_type',           'label' => 'חבילה',            'type' => 'select', 'options' => array( 'free' => 'חינם', 'pro' => 'פרו', 'featured' => 'מוצג', 'lead_partner' => 'שותף לידים', 'full_service' => 'שירות מלא' ) ),
		array( 'key' => 'subscription_status', 'label' => 'סטטוס מנוי',       'type' => 'select', 'options' => array( 'inactive' => 'לא פעיל', 'active' => 'פעיל', 'expired' => 'פג תוקף', 'cancelled' => 'בוטל' ) ),
		array( 'key' => 'lead_routing_enabled','label' => 'ניתוב לידים',      'type' => 'checkbox' ),
		array( 'key' => 'featured_on_front',   'label' => 'הצגה בעמוד הבית',       'type' => 'checkbox' ),
		array( 'key' => 'review_count',        'label' => 'מספר ביקורות מאושרות',  'type' => 'number' ),
		array( 'key' => 'average_rating',      'label' => 'דירוג ממוצע מאושר',     'type' => 'number', 'step' => '0.1', 'min' => '0', 'max' => '5' ),
		array( 'key' => 'profile_status',      'label' => 'סטטוס פרופיל',     'type' => 'select', 'options' => array( 'draft' => 'טיוטה', 'imported' => 'יובא', 'pending' => 'ממתין לאישור', 'active' => 'פעיל', 'suspended' => 'מושעה' ) ),
		array( 'key' => 'source_url',          'label' => 'מקור',             'type' => 'url' ),
		array( 'key' => 'source_type',         'label' => 'סוג מקור',          'type' => 'select', 'options' => array( 'manual' => 'ידני', 'import' => 'ייבוא', 'registration' => 'הרשמה', 'seed' => 'זרע לבדיקה' ) ),
		array( 'key' => 'internal_notes',      'label' => 'הערות פנימיות',     'type' => 'textarea' ),
	);
	uj_render_meta_fields( $post, $fields );
}

/**
 * Generic meta field renderer.
 */
function uj_render_meta_fields( $post, $fields ) {
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
			$attrs = '';
			foreach ( array( 'step', 'min', 'max' ) as $attr ) {
				if ( isset( $f[ $attr ] ) ) {
					$attrs .= ' ' . $attr . '="' . esc_attr( $f[ $attr ] ) . '"';
				}
			}
			echo '<input type="' . esc_attr( $f['type'] ) . '" id="' . esc_attr( $f['key'] ) . '" name="' . esc_attr( $f['key'] ) . '" value="' . esc_attr( $value ) . '" class="regular-text"' . $attrs . '>';
		}

		echo '</td></tr>';
	}
	echo '</table>';
}

/**
 * Save lawyer meta.
 */
function uj_save_lawyer_meta( $post_id ) {
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
		'profile_headline', 'profile_approach_title', 'profile_cta_title',
		'languages', 'courts', 'license_status', 'verification_status',
		'phone', 'email', 'whatsapp', 'website', 'office_address',
		'profile_video_url', 'linkedin_url', 'facebook_url', 'instagram_url', 'youtube_url',
		'plan_type', 'subscription_status', 'featured_until',
		'source_url', 'source_type', 'profile_status', 'internal_notes',
	);

	foreach ( $text_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}

	$textarea_fields = array(
		'profile_subheadline', 'profile_approach', 'profile_services',
		'profile_process', 'profile_credentials', 'profile_media_urls',
		'profile_faqs', 'profile_testimonials', 'profile_cta_text',
	);
	foreach ( $textarea_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_textarea_field( $_POST[ $field ] ) );
		}
	}

	$int_fields = array( 'years_experience', 'priority_score', 'monthly_lead_limit', 'review_count' );
	foreach ( $int_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, absint( $_POST[ $field ] ) );
		}
	}

	if ( isset( $_POST['average_rating'] ) ) {
		update_post_meta( $post_id, 'average_rating', min( 5, max( 0, (float) $_POST['average_rating'] ) ) );
	}

	update_post_meta( $post_id, 'lead_routing_enabled', isset( $_POST['lead_routing_enabled'] ) ? '1' : '0' );
	update_post_meta( $post_id, 'featured_on_front', isset( $_POST['featured_on_front'] ) ? '1' : '0' );
}
add_action( 'save_post_justice_lawyer', 'uj_save_lawyer_meta' );

