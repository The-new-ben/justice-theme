<?php
/**
 * Automatic lead routing — routes new leads to matching lawyers.
 *
 * When a lead is created via the lead form, this module:
 * 1. Detects the practice area (from form data or AI classifier)
 * 2. Finds lawyers who serve that area and have routing enabled
 * 3. Emails the lead details to matching lawyers
 * 4. Records which lawyers were notified
 *
 * This is the MONEY PIPE — the thing that makes lawyers want to pay you.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Route a new lead to matching lawyers after it's saved.
 *
 * Fires on save_post_justice_lead, after the lead classifier has run.
 *
 * @param int     $post_id Lead post ID.
 * @param WP_Post $post    Lead post object.
 * @param bool    $update  Whether this is an update.
 */
function justice_theme_route_lead_to_lawyers( int $post_id, WP_Post $post, bool $update ): void {
	// Only route NEW leads, not updates to existing ones.
	if ( $update && get_post_meta( $post_id, 'routing_completed', true ) ) {
		return;
	}

	if ( wp_is_post_revision( $post_id ) || 'justice_lead' !== $post->post_type ) {
		return;
	}

	// Get the practice area — prefer the AI-classified area, fall back to form data.
	$area = get_post_meta( $post_id, 'ai_detected_area', true )
		?: get_post_meta( $post_id, 'legal_area', true );

	if ( ! $area || 'general' === $area ) {
		// No specific area detected — notify admin only (already done by lead-submissions.php).
		update_post_meta( $post_id, 'routing_notes', 'No specific practice area detected. Lead sent to admin only.' );
		return;
	}

	// Was this lead already assigned to a specific lawyer (e.g., from a lawyer's mini-site form)?
	$assigned_lawyer_id = (int) get_post_meta( $post_id, 'assigned_lawyer_id', true );

	if ( $assigned_lawyer_id ) {
		// Direct assignment — notify that specific lawyer.
		justice_theme_notify_lawyer_of_lead( $assigned_lawyer_id, $post_id );
		update_post_meta( $post_id, 'routing_completed', '1' );
		update_post_meta( $post_id, 'routing_method', 'direct_assignment' );
		update_post_meta( $post_id, 'lead_status', 'assigned' );
		return;
	}

	// Find lawyers who match this practice area and have routing enabled.
	$matching_lawyers = justice_theme_find_routing_lawyers( $area );

	if ( empty( $matching_lawyers ) ) {
		update_post_meta( $post_id, 'routing_notes', sprintf(
			'No lawyers with routing enabled found for area: %s. Lead kept in admin CRM.',
			$area
		) );
		return;
	}

	// Notify all matching lawyers.
	$notified_ids = array();
	foreach ( $matching_lawyers as $lawyer_id ) {
		$sent = justice_theme_notify_lawyer_of_lead( $lawyer_id, $post_id );
		if ( $sent ) {
			$notified_ids[] = $lawyer_id;
		}
	}

	// Record routing results.
	update_post_meta( $post_id, 'routing_completed', '1' );
	update_post_meta( $post_id, 'routing_method', 'area_match' );
	update_post_meta( $post_id, 'routed_to_lawyer_ids', implode( ',', $notified_ids ) );
	update_post_meta( $post_id, 'routed_at', current_time( 'mysql' ) );

	if ( ! empty( $notified_ids ) ) {
		update_post_meta( $post_id, 'lead_status', 'assigned' );
		update_post_meta( $post_id, 'routing_notes', sprintf(
			'Lead routed to %d lawyer(s) in area "%s": %s',
			count( $notified_ids ),
			$area,
			implode( ', ', array_map( 'get_the_title', $notified_ids ) )
		) );
	}
}
// Priority 30 = runs after the lead classifier (priority 20).
add_action( 'save_post_justice_lead', 'justice_theme_route_lead_to_lawyers', 30, 3 );

/**
 * Find published lawyers who serve a given practice area and have routing enabled.
 *
 * @param string $area Practice area slug (e.g., 'criminal-law').
 * @return int[] Array of lawyer post IDs.
 */
function justice_theme_find_routing_lawyers( string $area ): array {
	if ( ! post_type_exists( 'justice_lawyer' ) || ! taxonomy_exists( 'practice-areas' ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $area,
			),
		),
		'meta_query'     => array(
			array(
				'key'   => 'lead_routing_enabled',
				'value' => '1',
			),
		),
	) );

	return $query->posts ?: array();
}

/**
 * Email a lead notification to a specific lawyer.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @param int $lead_id   Lead post ID.
 * @return bool Whether the email was sent.
 */
function justice_theme_notify_lawyer_of_lead( int $lawyer_id, int $lead_id ): bool {
	$lawyer_email = get_post_meta( $lawyer_id, 'email', true );
	$lawyer_name  = get_the_title( $lawyer_id );

	if ( ! $lawyer_email || ! is_email( $lawyer_email ) ) {
		return false;
	}

	$lead_name    = get_post_meta( $lead_id, 'visitor_name', true ) ?: 'לא צוין';
	$lead_phone   = get_post_meta( $lead_id, 'visitor_phone', true ) ?: 'לא צוין';
	$lead_email   = get_post_meta( $lead_id, 'visitor_email', true ) ?: '';
	$lead_area    = get_post_meta( $lead_id, 'legal_area', true ) ?: 'כללי';
	$lead_city    = get_post_meta( $lead_id, 'city', true ) ?: '';
	$lead_urgency = get_post_meta( $lead_id, 'urgency', true ) ?: 'normal';
	$lead_message = get_post_meta( $lead_id, 'message', true ) ?: '';
	$lead_source  = get_post_meta( $lead_id, 'source_url', true ) ?: '';

	// Get Hebrew area label if available.
	$area_label = function_exists( 'justice_theme_lead_area_label' )
		? justice_theme_lead_area_label( $lead_area )
		: $lead_area;

	$urgency_label = 'high' === $lead_urgency ? '⚡ דחוף' : 'רגיל';

	$subject = sprintf( 'פנייה חדשה מ-Jus-Tice: %s — %s', $lead_name, $area_label );

	$body = sprintf(
		"שלום %s,\n\nהתקבלה פנייה חדשה באתר Jus-Tice שתואמת לתחומי ההתמחות שלך.\n\n"
		. "— פרטי הפנייה —\n"
		. "שם: %s\n"
		. "טלפון: %s\n"
		. "%s"
		. "תחום: %s\n"
		. "%s"
		. "דחיפות: %s\n"
		. "%s"
		. "\n— מה לעשות? —\n"
		. "צור קשר עם הפונה בהקדם האפשרי.\n"
		. "לאחר יצירת קשר, עדכן את הסטטוס בדשבורד שלך.\n"
		. "\n---\n"
		. "הודעה זו נשלחה אוטומטית מ-Jus-Tice.co.il\n"
		. "לשאלות: info@jus-tice.co.il",
		$lawyer_name,
		$lead_name,
		$lead_phone,
		$lead_email ? sprintf( "אימייל: %s\n", $lead_email ) : '',
		$area_label,
		$lead_city ? sprintf( "עיר: %s\n", $lead_city ) : '',
		$urgency_label,
		$lead_message ? sprintf( "\nהודעה:\n%s\n", $lead_message ) : ''
	);

	$headers = array(
		'Content-Type: text/plain; charset=UTF-8',
		'From: Jus-Tice.co.il <info@jus-tice.co.il>',
	);

	$sent = wp_mail( $lawyer_email, $subject, $body, $headers );

	// Also notify the admin about the routing.
	$admin_email = get_option( 'admin_email' );
	if ( $admin_email && $admin_email !== $lawyer_email ) {
		wp_mail(
			$admin_email,
			sprintf( 'Lead routed: %s → %s', $lead_name, $lawyer_name ),
			sprintf(
				"Lead #%d (%s) was automatically routed to %s (%s).\n\nArea: %s\nUrgency: %s\nEmail sent: %s",
				$lead_id,
				$lead_name,
				$lawyer_name,
				$lawyer_email,
				$area_label,
				$urgency_label,
				$sent ? 'YES' : 'FAILED'
			),
			$headers
		);
	}

	return $sent;
}
