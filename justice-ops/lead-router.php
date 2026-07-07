<?php
/**
 * Lead routing engine: every public lead reaches the right paying lawyer
 * within seconds, with a billing evidence trail.
 *
 * When the public form stores a lead, the router maps its legal area to a
 * practice family, picks the top eligible advertiser (same eligibility as
 * the cards: public-approval gate plus positive priority_score, daily
 * rotation among ties, monthly_lead_limit honored), stamps the assignment,
 * the routed price and the trail, mails the lawyer the lead with a one-tap
 * acknowledge link and mails the owner the routing summary with a prefilled
 * WhatsApp forward. Unrouteable leads stay with the owner, clearly marked.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Lead-form area vocabulary → card family keys.
 */
function justice_router_area_to_family( string $area ): string {
	$map = array(
		'family-law'          => 'family',
		'criminal-law'        => 'criminal-law',
		'real-estate-law'     => 'real-estate',
		'personal-injury-law' => 'nezikin',
		'medical-malpractice-law' => 'nezikin',
		'traffic-law'         => 'traffic',
		'labor-law'           => 'labor',
		'inheritance-law'     => 'inheritance',
	);

	return $map[ $area ] ?? '';
}

/**
 * Routed-lead price per family, editable via options; recorded on the lead
 * at routing time as billing evidence.
 */
function justice_router_lead_price( string $family ): int {
	$defaults = array(
		'family'       => 180,
		'criminal-law' => 220,
		'real-estate'  => 200,
		'nezikin'      => 250,
		'labor'        => 150,
		'traffic'      => 120,
		'inheritance'  => 180,
		'tax-business' => 200,
	);

	return (int) get_option( 'justice_lead_price_' . $family, $defaults[ $family ] ?? 150 );
}

/**
 * Count leads already assigned to a lawyer this calendar month.
 */
function justice_router_month_count( int $lawyer_id ): int {
	$q = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'date_query'     => array( array( 'after' => wp_date( 'Y-m-01 00:00:00' ), 'inclusive' => true ) ),
		'meta_query'     => array( array( 'key' => 'assigned_lawyer_id', 'value' => (string) $lawyer_id ) ),
	) );

	return (int) $q->found_posts;
}

/**
 * Route one lead. Idempotent: a routed lead never routes twice.
 */
function justice_router_route_lead( int $lead_id ): array {
	if ( 'justice_lead' !== get_post_type( $lead_id ) || get_post_meta( $lead_id, 'lead_routed_at', true ) ) {
		return array( 'ok' => false, 'why' => 'not a lead or already routed' );
	}

	$area   = (string) get_post_meta( $lead_id, 'legal_area', true );
	$family = justice_router_area_to_family( $area );
	$map    = justice_cards_family_map();

	if ( '' === $family || empty( $map[ $family ] ) ) {
		update_post_meta( $lead_id, 'lead_routing_status', 'unrouted_no_family' );
		return array( 'ok' => false, 'why' => 'no family for area ' . $area );
	}

	// Same eligibility engine as the sponsored cards, widened pool.
	$candidates = justice_cards_lawyers( $map[ $family ], 6 );
	$chosen     = null;

	foreach ( $candidates as $candidate ) {
		$cap = (int) get_post_meta( $candidate->ID, 'monthly_lead_limit', true );

		if ( $cap > 0 && justice_router_month_count( $candidate->ID ) >= $cap ) {
			continue;
		}

		$chosen = $candidate;
		break;
	}

	if ( ! $chosen ) {
		update_post_meta( $lead_id, 'lead_routing_status', 'unrouted_no_capacity' );
		return array( 'ok' => false, 'why' => 'no eligible lawyer in ' . $family );
	}

	$price = justice_router_lead_price( $family );
	$stamp = wp_date( 'Y-m-d H:i' );

	update_post_meta( $lead_id, 'assigned_lawyer_id', (string) $chosen->ID );
	update_post_meta( $lead_id, 'lead_routed_at', $stamp );
	update_post_meta( $lead_id, 'lead_routing_status', 'routed' );
	update_post_meta( $lead_id, 'lead_price_ils', (string) $price );
	update_post_meta( $lead_id, 'qualified_lead_billing_status', 'routed_pending_qualification' );

	$name    = (string) get_post_meta( $lead_id, 'visitor_name', true );
	$phone   = (string) get_post_meta( $lead_id, 'visitor_phone', true );
	$city    = (string) get_post_meta( $lead_id, 'city', true );
	$message = (string) get_post_meta( $lead_id, 'message', true );
	$urgency = (string) get_post_meta( $lead_id, 'urgency', true );

	$token   = substr( wp_hash( 'jt-lead-ack-' . $lead_id ), 0, 16 );
	$ack_url = rest_url( 'justice-ops/v1/lead-ack' ) . '?lead=' . $lead_id . '&t=' . $token;

	$lawyer_email = sanitize_email( (string) get_post_meta( $chosen->ID, 'email', true ) );

	if ( $lawyer_email ) {
		wp_mail(
			$lawyer_email,
			'[Jus-Tice] פנייה חדשה בתחום שלך: ' . $name,
			"פנייה חדשה הופנתה אליך מאתר Jus-Tice:\n\n"
			. 'שם: ' . $name . "\n"
			. 'טלפון: ' . $phone . "\n"
			. 'עיר: ' . $city . "\n"
			. 'דחיפות: ' . $urgency . "\n"
			. ( $message ? "הודעה:\n" . $message . "\n" : '' )
			. "\nאישור קבלת הפנייה (לחיצה אחת):\n" . $ack_url
			. "\n\nמומלץ לחזור לפונה בתוך שעה. פניות שנענות מהר נסגרות פי כמה."
		);
	}

	$wa_forward = 'https://wa.me/?text=' . rawurlencode( 'ליד חדש (' . $family . '): ' . $name . ' | ' . $phone . ' | ' . $city . ' | ' . $urgency . ( $message ? ' | ' . mb_substr( $message, 0, 120 ) : '' ) );

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice Router] ליד נותב: ' . $name . ' אל ' . get_the_title( $chosen->ID ),
		'הליד נותב אוטומטית.' . "\n\n"
		. 'עורך דין: ' . get_the_title( $chosen->ID ) . ( $lawyer_email ? ' (נשלח אליו מייל)' : ' (אין מייל בפרופיל, נדרש עדכון)' ) . "\n"
		. 'מחיר ליד רשום: ' . $price . " ש\"ח\n"
		. 'סטטוס חיוב: ממתין להסמכה' . "\n\n"
		. 'העברה מהירה בוואטסאפ: ' . $wa_forward
	);

	return array( 'ok' => true, 'lawyer' => $chosen->ID, 'price' => $price );
}

/**
 * Fire when the public handler finishes stamping the new lead: lead_status
 * is the last meta in its write sequence apart from tracking, and the hook
 * is idempotent anyway.
 */
add_action( 'added_post_meta', function ( $meta_id, $post_id, $meta_key, $meta_value ) {
	if ( 'lead_status' !== $meta_key || 'new' !== $meta_value ) {
		return;
	}

	if ( 'justice_lead' !== get_post_type( (int) $post_id ) ) {
		return;
	}

	justice_router_route_lead( (int) $post_id );
}, 10, 4 );

// ---------------------------------------------------------------------------
// Lawyer acknowledge + admin summary
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	// GET shows a confirm button; only the button's POST marks the lead.
	// Mail security scanners prefetch GET links, so a bare GET side effect
	// would false-acknowledge every routed lead (caught live in QA).
	register_rest_route( 'justice-ops/v1', '/lead-ack', array(
		'methods'             => array( 'GET', 'POST' ),
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$lead  = (int) $request->get_param( 'lead' );
			$token = (string) $request->get_param( 't' );

			if ( ! $lead || $token !== substr( wp_hash( 'jt-lead-ack-' . $lead ), 0, 16 ) || 'justice_lead' !== get_post_type( $lead ) ) {
				return new WP_REST_Response( array( 'ok' => false ), 403 );
			}

			$style = 'font-family:sans-serif;direction:rtl;text-align:center;padding:60px 20px';

			if ( 'POST' === $request->get_method() ) {
				if ( ! get_post_meta( $lead, 'lead_ack_at', true ) ) {
					update_post_meta( $lead, 'lead_ack_at', wp_date( 'Y-m-d H:i' ) );
					update_post_meta( $lead, 'follow_up_status', 'accepted_by_lawyer' );
				}

				return new WP_REST_Response( '<!doctype html><meta charset="utf-8"><body style="' . $style . '"><h1 style="color:#14213d">הפנייה אושרה</h1><p>תודה. סימנו שקיבלת את הפנייה. מומלץ לחזור לפונה בהקדם.</p></body>', 200, array( 'Content-Type' => 'text/html; charset=utf-8' ) );
			}

			$action = esc_url( rest_url( 'justice-ops/v1/lead-ack' ) . '?lead=' . $lead . '&t=' . rawurlencode( $token ) );

			return new WP_REST_Response( '<!doctype html><meta charset="utf-8"><body style="' . $style . '"><h1 style="color:#14213d">אישור קבלת פנייה</h1><p>לחיצה על הכפתור מאשרת שקיבלת את פרטי הפונה.</p><form method="post" action="' . $action . '"><button type="submit" style="background:#1fb355;color:#fff;border:0;border-radius:12px;padding:14px 34px;font-size:17px;font-weight:700;cursor:pointer">אישור קבלה</button></form></body>', 200, array( 'Content-Type' => 'text/html; charset=utf-8' ) );
		},
	) );

	register_rest_route( 'justice-ops/v1', '/leads-summary', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$days  = max( 1, min( 90, (int) ( $request->get_param( 'days' ) ?: 14 ) ) );
			$leads = get_posts( array(
				'post_type'      => 'justice_lead',
				'post_status'    => 'any',
				'posts_per_page' => 500,
				'date_query'     => array( array( 'after' => $days . ' days ago' ) ),
			) );

			$by_day = array();
			$by_area = array();
			$routed = 0;
			$revenue = 0;

			foreach ( $leads as $lead ) {
				$day  = substr( $lead->post_date, 0, 10 );
				$area = (string) get_post_meta( $lead->ID, 'legal_area', true );

				$by_day[ $day ]   = ( $by_day[ $day ] ?? 0 ) + 1;
				$by_area[ $area ] = ( $by_area[ $area ] ?? 0 ) + 1;

				if ( 'routed' === get_post_meta( $lead->ID, 'lead_routing_status', true ) ) {
					$routed++;
					$revenue += (int) get_post_meta( $lead->ID, 'lead_price_ils', true );
				}
			}

			ksort( $by_day );

			return array(
				'days'            => $days,
				'total'           => count( $leads ),
				'routed'          => $routed,
				'routed_value_ils'=> $revenue,
				'by_day'          => $by_day,
				'by_area'         => $by_area,
			);
		},
	) );
} );
