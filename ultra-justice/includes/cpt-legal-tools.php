<?php
/**
 * LegalTech tools and request intake.
 *
 * @package UltraJustice
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function uj_register_legal_tool_cpt(): void {
	register_post_type( 'justice_legal_tool', array(
		'labels'       => array(
			'name'          => 'כלים משפטיים',
			'singular_name' => 'כלי משפטי',
			'menu_name'     => 'LegalTech Tools',
			'add_new_item'  => 'הוספת כלי משפטי',
			'edit_item'     => 'עריכת כלי משפטי',
		),
		'public'       => true,
		'show_ui'      => true,
		'show_in_rest' => true,
		'has_archive'  => true,
		'menu_icon'    => 'dashicons-media-document',
		'rewrite'      => array(
			'slug'       => 'legal-tools',
			'with_front' => false,
		),
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields', 'page-attributes' ),
	) );
}
add_action( 'init', 'uj_register_legal_tool_cpt' );

function uj_register_legal_request_cpt(): void {
	register_post_type( 'justice_legal_request', array(
		'labels'       => array(
			'name'          => 'בקשות LegalTech',
			'singular_name' => 'בקשת LegalTech',
			'menu_name'     => 'LegalTech Requests',
			'edit_item'     => 'עריכת בקשה',
		),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-clipboard',
		'supports'     => array( 'title', 'editor', 'custom-fields', 'revisions' ),
	) );
}
add_action( 'init', 'uj_register_legal_request_cpt' );

function uj_register_legal_tool_meta(): void {
	$tool_fields = array(
		'tool_type'              => 'string',
		'starting_price'         => 'string',
		'estimated_turnaround'   => 'string',
		'target_practice_area'   => 'string',
		'requires_lawyer_review' => 'boolean',
		'ai_prompt_brief'        => 'string',
		'tool_status'            => 'string',
	);

	foreach ( $tool_fields as $key => $type ) {
		register_post_meta( 'justice_legal_tool', $key, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $type,
			'auth_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}

	$request_fields = array(
		'visitor_name'       => 'string',
		'visitor_phone'      => 'string',
		'visitor_email'      => 'string',
		'legal_area'         => 'string',
		'city'               => 'string',
		'urgency'            => 'string',
		'tool_id'            => 'integer',
		'assigned_lawyer_id' => 'integer',
		'intake_summary'     => 'string',
		'ai_draft'           => 'string',
		'status'             => 'string',
		'payment_status'     => 'string',
		'consent'            => 'boolean',
		'source_url'         => 'string',
	);

	foreach ( $request_fields as $key => $type ) {
		register_post_meta( 'justice_legal_request', $key, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => $type,
			'auth_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
}
add_action( 'init', 'uj_register_legal_tool_meta' );

function uj_seed_legal_tools_if_needed(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'uj_legal_tools_seeded_v1' ) ) {
		return;
	}

	$tools = array(
		'ai-intake' => array( 'צ׳אט אבחון משפטי', 'AI intake', 'חינם / ליד', 'משפחה, נדל״ן, עבודה, נזיקין' ),
		'demand-letter' => array( 'מכתב התראה', 'Document automation', 'בתשלום', 'כללי' ),
		'family-agreement' => array( 'הסכם משפחתי', 'Lawyer review', 'בתשלום', 'משפחה וגירושין' ),
		'real-estate-contract-review' => array( 'בדיקת חוזה נדל״ן', 'Real estate', 'פרימיום', 'מקרקעין והשקעות' ),
	);

	foreach ( $tools as $slug => $tool ) {
		if ( get_page_by_path( $slug, OBJECT, 'justice_legal_tool' ) ) {
			continue;
		}

		$post_id = wp_insert_post( array(
			'post_type'    => 'justice_legal_tool',
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_title'   => $tool[0],
			'post_excerpt' => 'מסלול דיגיטלי שמתחיל באיסוף מידע מסודר, מייצר טיוטה או סיכום, ומעביר לעורך דין כשצריך בדיקה אנושית.',
			'post_content' => 'הכלי נועד להפוך פנייה משפטית לתהליך מסודר: שאלון חכם, סיכום מקרה, איסוף מסמכים, טיוטה ראשונית, ולולאת בדיקה של עורך דין לפני שימוש משפטי מחייב.',
		) );

		if ( $post_id && ! is_wp_error( $post_id ) ) {
			update_post_meta( $post_id, 'tool_type', $tool[1] );
			update_post_meta( $post_id, 'starting_price', $tool[2] );
			update_post_meta( $post_id, 'target_practice_area', $tool[3] );
			update_post_meta( $post_id, 'estimated_turnaround', '24-72 שעות' );
			update_post_meta( $post_id, 'requires_lawyer_review', true );
			update_post_meta( $post_id, 'tool_status', 'mvp' );
		}
	}

	update_option( 'uj_legal_tools_seeded_v1', 1, false );
}
add_action( 'admin_init', 'uj_seed_legal_tools_if_needed' );

function uj_handle_legal_tool_request(): void {
	if ( ! isset( $_POST['justice_legal_tool_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_legal_tool_nonce'] ) ), 'justice_legal_tool_request' ) ) {
		wp_safe_redirect( home_url( '/legal-tools/?request=failed' ) );
		exit;
	}

	$tool_id = isset( $_POST['tool_id'] ) ? absint( $_POST['tool_id'] ) : 0;
	$name    = isset( $_POST['visitor_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visitor_name'] ) ) : '';
	$phone   = isset( $_POST['visitor_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['visitor_phone'] ) ) : '';
	$email   = isset( $_POST['visitor_email'] ) ? sanitize_email( wp_unslash( $_POST['visitor_email'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	$request_id = wp_insert_post( array(
		'post_type'    => 'justice_legal_request',
		'post_status'  => 'private',
		'post_title'   => sprintf( 'LegalTech request - %s - %s', $name ?: 'visitor', current_time( 'mysql' ) ),
		'post_content' => $message,
	) );

	if ( $request_id && ! is_wp_error( $request_id ) ) {
		update_post_meta( $request_id, 'visitor_name', $name );
		update_post_meta( $request_id, 'visitor_phone', $phone );
		update_post_meta( $request_id, 'visitor_email', $email );
		update_post_meta( $request_id, 'tool_id', $tool_id );
		update_post_meta( $request_id, 'status', 'new' );
		update_post_meta( $request_id, 'payment_status', 'not_started' );
		update_post_meta( $request_id, 'consent', ! empty( $_POST['consent'] ) );
		update_post_meta( $request_id, 'source_url', wp_get_referer() ?: home_url( '/' ) );
	}

	wp_safe_redirect( add_query_arg( 'request', $request_id ? 'sent' : 'failed', get_permalink( $tool_id ) ?: home_url( '/legal-tools/' ) ) );
	exit;
}
add_action( 'admin_post_justice_submit_legal_request', 'uj_handle_legal_tool_request' );
add_action( 'admin_post_nopriv_justice_submit_legal_request', 'uj_handle_legal_tool_request' );
