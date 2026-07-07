<?php
/**
 * Verified reviews engine: the moat no competitor can fake.
 *
 * Reviews enter ONLY through tokenized links minted from real leads in the
 * CRM: the owner (or a closed-lead automation) requests a review, the
 * client gets a one-time link bound to that lead and lawyer, the review
 * lands in a moderation queue, and approval creates a native
 * justice_recommendation record so the theme recalculates its aggregates
 * and the gated stars on cards and profiles unlock by themselves. A review
 * without a real lead behind it is structurally impossible.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The recommendation CPT the theme aggregates expect is not registered by
 * the live companion plugin, and an insert-hardening filter rejects posts
 * of unregistered types. Register it here until the theme carries it.
 */
add_action( 'init', function () {
	if ( post_type_exists( 'justice_recommendation' ) ) {
		return;
	}

	register_post_type( 'justice_recommendation', array(
		'label'               => 'חוות דעת',
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => 'edit.php?post_type=justice_lawyer',
		'supports'            => array( 'title', 'editor' ),
		'capability_type'     => 'post',
		'map_meta_cap'        => true,
		'exclude_from_search' => true,
	) );
}, 1 );

function justice_reviews_token( int $lead_id ): string {
	return substr( wp_hash( 'jt-review-' . $lead_id . '-' . (string) get_post_meta( $lead_id, 'visitor_phone', true ) ), 0, 20 );
}

function justice_reviews_link( int $lead_id ): string {
	return add_query_arg( array( 'jt_review' => $lead_id, 'rt' => justice_reviews_token( $lead_id ) ), home_url( '/' ) );
}

// ---------------------------------------------------------------------------
// Minting: owner action on a lead
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/review-request', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$lead = (int) $request->get_param( 'lead' );

			if ( 'justice_lead' !== get_post_type( $lead ) ) {
				return array( 'ok' => false, 'why' => 'not a lead' );
			}

			$lawyer = (int) get_post_meta( $lead, 'assigned_lawyer_id', true );

			if ( ! $lawyer ) {
				return array( 'ok' => false, 'why' => 'lead has no assigned lawyer' );
			}

			update_post_meta( $lead, 'review_requested_at', wp_date( 'Y-m-d H:i' ) );

			$link  = justice_reviews_link( $lead );
			$name  = (string) get_post_meta( $lead, 'visitor_name', true );
			$phone = preg_replace( '/\D+/', '', '972' . ltrim( (string) get_post_meta( $lead, 'visitor_phone', true ), '0' ) );
			$wa    = 'https://wa.me/' . $phone . '?text=' . rawurlencode( 'שלום ' . $name . ', תודה שפנית דרך Jus-Tice. נשמח לחוות דעת קצרה על הטיפול: ' . $link );

			return array( 'ok' => true, 'review_link' => $link, 'send_via_whatsapp' => $wa );
		},
	) );
} );

// ---------------------------------------------------------------------------
// Public review form (tokenized, one per lead)
// ---------------------------------------------------------------------------

add_action( 'template_redirect', function () {
	$lead  = isset( $_GET['jt_review'] ) ? absint( $_GET['jt_review'] ) : 0;
	$token = isset( $_GET['rt'] ) ? sanitize_text_field( wp_unslash( $_GET['rt'] ) ) : '';

	if ( ! $lead ) {
		return;
	}

	$valid  = 'justice_lead' === get_post_type( $lead ) && hash_equals( justice_reviews_token( $lead ), $token );
	$lawyer = $valid ? (int) get_post_meta( $lead, 'assigned_lawyer_id', true ) : 0;
	$done   = $valid && get_post_meta( $lead, 'review_submitted_at', true );

	status_header( 200 );
	nocache_headers();

	echo '<!doctype html><html dir="rtl" lang="he"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>חוות דעת | Jus-Tice</title>';
	echo '<style>body{font-family:system-ui,sans-serif;background:#f3f4f8;margin:0;padding:30px 16px}.box{max-width:560px;margin:0 auto;background:#fff;border:1.5px solid transparent;border-radius:20px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;box-shadow:0 18px 40px -24px rgba(13,23,54,.35);padding:28px}h1{color:#14213d;font-size:22px;margin:0 0 6px}p{color:#4a5468;font-size:15px}label{display:block;font-weight:700;color:#26324e;margin:14px 0 6px}textarea,input{width:100%;box-sizing:border-box;border:1px solid #ccd3e2;border-radius:10px;padding:11px;font-size:15px}button{background:linear-gradient(180deg,#2ade70,#1fb355);border:0;color:#fff;font-weight:800;font-size:16px;border-radius:12px;padding:13px 30px;cursor:pointer;margin-top:16px}.stars{display:flex;gap:6px;flex-direction:row-reverse;justify-content:flex-end}.stars input{display:none}.stars label{font-size:34px;color:#d5d9e4;cursor:pointer;margin:0}.stars input:checked ~ label{color:#e7c765}.stars label:hover,.stars label:hover ~ label{color:#e7c765}</style></head><body><div class="box">';

	if ( ! $valid ) {
		echo '<h1>הקישור אינו תקין</h1><p>נראה שהקישור פג או שגוי. אפשר לפנות אלינו בוואטסאפ ונשלח קישור חדש.</p>';
	} elseif ( $done ) {
		echo '<h1>חוות הדעת התקבלה</h1><p>תודה רבה. חוות הדעת ממתינה לאימות קצר לפני פרסום.</p>';
	} else {
		$lawyer_name = get_the_title( $lawyer );
		echo '<h1>איך היה הטיפול של ' . esc_html( $lawyer_name ) . '?</h1><p>חוות הדעת מתפרסמת רק אחרי אימות, ומקושרת לפנייה אמיתית דרך האתר.</p>';
		echo '<form method="post"><input type="hidden" name="jt_review_submit" value="1">';
		wp_nonce_field( 'jt_review_' . $lead, 'jt_review_nonce' );
		echo '<label>דירוג</label><div class="stars">';
		for ( $i = 5; $i >= 1; $i-- ) {
			echo '<input type="radio" id="star' . $i . '" name="review_rating" value="' . $i . '"' . ( 5 === $i ? ' checked' : '' ) . '><label for="star' . $i . '">★</label>';
		}
		echo '</div>';
		echo '<label for="rv-text">מה היה חשוב לך שאחרים ידעו</label><textarea id="rv-text" name="review_text" rows="4" required minlength="20"></textarea>';
		echo '<label for="rv-name">שם לתצוגה (אפשר שם פרטי בלבד)</label><input id="rv-name" name="review_name" type="text" required>';
		echo '<button type="submit">שליחת חוות דעת</button></form>';
	}

	echo '</div></body></html>';
	exit;
}, -2000000 );

add_action( 'init', function () {
	if ( empty( $_POST['jt_review_submit'] ) || empty( $_GET['jt_review'] ) ) {
		return;
	}

	$lead  = absint( $_GET['jt_review'] );
	$token = isset( $_GET['rt'] ) ? sanitize_text_field( wp_unslash( $_GET['rt'] ) ) : '';

	if ( 'justice_lead' !== get_post_type( $lead ) || ! hash_equals( justice_reviews_token( $lead ), $token ) ) {
		return;
	}

	if ( empty( $_POST['jt_review_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['jt_review_nonce'] ) ), 'jt_review_' . $lead ) ) {
		return;
	}

	if ( get_post_meta( $lead, 'review_submitted_at', true ) ) {
		return;
	}

	$rating = max( 1, min( 5, absint( $_POST['review_rating'] ?? 5 ) ) );
	$text   = sanitize_textarea_field( wp_unslash( $_POST['review_text'] ?? '' ) );
	$name   = sanitize_text_field( wp_unslash( $_POST['review_name'] ?? '' ) );
	$lawyer = (int) get_post_meta( $lead, 'assigned_lawyer_id', true );

	if ( mb_strlen( $text ) < 20 || '' === $name || ! $lawyer ) {
		return;
	}

	$review_id = wp_insert_post( array(
		'post_type'    => 'justice_recommendation',
		'post_status'  => 'pending',
		'post_title'   => 'חוות דעת: ' . $name . ' על ' . get_the_title( $lawyer ),
		'post_content' => $text,
	) );

	if ( ! $review_id || is_wp_error( $review_id ) ) {
		return;
	}

	update_post_meta( $review_id, 'recommended_lawyer_id', $lawyer );
	update_post_meta( $review_id, 'rating', $rating );
	update_post_meta( $review_id, 'reviewer_name', $name );
	update_post_meta( $review_id, 'source_lead_id', $lead );
	update_post_meta( $review_id, 'verified_case_link', '1' );
	update_post_meta( $lead, 'review_submitted_at', wp_date( 'Y-m-d H:i' ) );

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice] חוות דעת חדשה ממתינה לאימות: ' . get_the_title( $lawyer ),
		'דירוג: ' . $rating . " מתוך 5\nשם: " . $name . "\n\n" . $text . "\n\nאימות ופרסום: " . admin_url( 'edit.php?post_type=justice_recommendation&post_status=pending' )
	);
} , 5 );

// ---------------------------------------------------------------------------
// Approval side effects: publishing a case-linked review updates the native
// aggregates and switches the display flag on the first approved review.
// ---------------------------------------------------------------------------

add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' !== $new || 'publish' === $old || ! $post instanceof WP_Post || 'justice_recommendation' !== $post->post_type ) {
		return;
	}

	if ( '1' !== (string) get_post_meta( $post->ID, 'verified_case_link', true ) ) {
		return;
	}

	$lawyer = (int) get_post_meta( $post->ID, 'recommended_lawyer_id', true );

	if ( ! $lawyer ) {
		return;
	}

	if ( function_exists( 'justice_theme_lawyer_recalculate_review_aggregates' ) ) {
		justice_theme_lawyer_recalculate_review_aggregates( $lawyer );
	}

	if ( ! get_post_meta( $lawyer, 'review_display_enabled', true ) ) {
		update_post_meta( $lawyer, 'review_display_enabled', '1' );
	}
}, 10, 3 );
