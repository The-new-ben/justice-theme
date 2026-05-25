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

	justice_theme_apply_lead_revenue_hint( $post_id, $area );

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
			'No paid routable lawyers with available monthly lead cap found for area: %s. Lead kept in admin CRM.',
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
			update_post_meta( $lawyer_id, 'leads_received', absint( get_post_meta( $lawyer_id, 'leads_received', true ) ) + 1 );
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
 * Add owner-facing revenue hints for lead products that have a clear price model.
 *
 * @param int    $post_id Lead post ID.
 * @param string $area    Normalized legal area.
 */
function justice_theme_apply_lead_revenue_hint( int $post_id, string $area ): void {
	$normalized_area = function_exists( 'justice_theme_normalize_lead_area' )
		? justice_theme_normalize_lead_area( $area )
		: sanitize_key( $area );

	if ( 'national-insurance' !== $normalized_area ) {
		return;
	}

	update_post_meta( $post_id, 'lead_revenue_model', 'qualified_appeal_lead' );
	update_post_meta( $post_id, 'suggested_lead_price_ils', '249' );
	update_post_meta(
		$post_id,
		'lead_revenue_notes',
		'Bituach Leumi appeal lead: verify decision date, committee protocol, medical documents, and consent before lawyer handoff.'
	);
}

/**
 * Subscription statuses that are allowed to receive automatically routed leads.
 *
 * @return string[]
 */
function justice_theme_paid_routing_subscription_statuses(): array {
	return array( 'active', 'paid', 'trialing' );
}

/**
 * Default monthly lead caps by commercial plan.
 *
 * @return array<string,int>
 */
function justice_theme_default_monthly_lead_caps_by_plan(): array {
	return array(
		'free'         => 0,
		'pro'          => 0,
		'featured'     => 3,
		'lead_partner' => 10,
		'full_service' => 25,
	);
}

/**
 * Resolve the effective monthly lead cap for a lawyer and area.
 *
 * @param int    $lawyer_id Lawyer post ID.
 * @param string $area      Legal area slug.
 * @return int Monthly cap. Zero means no automatic lead routing.
 */
function justice_theme_lawyer_monthly_lead_cap( int $lawyer_id, string $area ): int {
	$normalized_area = function_exists( 'justice_theme_normalize_lead_area' )
		? justice_theme_normalize_lead_area( $area )
		: sanitize_key( $area );

	if ( 'national-insurance' === $normalized_area ) {
		$area_cap = get_post_meta( $lawyer_id, 'national_insurance_lead_cap', true );
		if ( '' !== (string) $area_cap ) {
			return max( 0, absint( $area_cap ) );
		}
	}

	$manual_cap = get_post_meta( $lawyer_id, 'monthly_lead_limit', true );
	if ( '' !== (string) $manual_cap ) {
		return max( 0, absint( $manual_cap ) );
	}

	$plan = strtolower( (string) get_post_meta( $lawyer_id, 'plan_type', true ) );
	$caps = justice_theme_default_monthly_lead_caps_by_plan();

	return $caps[ $plan ] ?? 0;
}

/**
 * Count routed leads for a lawyer in the current calendar month.
 *
 * @param int    $lawyer_id Lawyer post ID.
 * @param string $area      Legal area slug.
 * @return int Routed lead count.
 */
function justice_theme_lawyer_monthly_routed_lead_count( int $lawyer_id, string $area ): int {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return 0;
	}

	$normalized_area = function_exists( 'justice_theme_normalize_lead_area' )
		? justice_theme_normalize_lead_area( $area )
		: sanitize_key( $area );

	$month_start = wp_date( 'Y-m-01 00:00:00', current_time( 'timestamp' ) );

	$query = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'publish',
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'date_query'     => array(
			array(
				'after'     => $month_start,
				'inclusive' => true,
			),
		),
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'     => 'routed_to_lawyer_ids',
				'value'   => (string) $lawyer_id,
				'compare' => 'LIKE',
			),
			array(
				'relation' => 'OR',
				array(
					'key'   => 'legal_area',
					'value' => $normalized_area,
				),
				array(
					'key'   => 'ai_detected_area',
					'value' => $normalized_area,
				),
			),
		),
	) );

	$count = 0;
	foreach ( $query->posts ?: array() as $lead_id ) {
		$routed_ids = array_filter( array_map( 'absint', explode( ',', (string) get_post_meta( (int) $lead_id, 'routed_to_lawyer_ids', true ) ) ) );
		if ( in_array( $lawyer_id, $routed_ids, true ) ) {
			$count++;
		}
	}

	return $count;
}

/**
 * Determine whether a lawyer can receive an automatic routed lead now.
 *
 * @param int    $lawyer_id Lawyer post ID.
 * @param string $area      Legal area slug.
 * @return bool
 */
function justice_theme_lawyer_can_receive_routed_lead( int $lawyer_id, string $area ): bool {
	$cap = justice_theme_lawyer_monthly_lead_cap( $lawyer_id, $area );

	if ( $cap <= 0 ) {
		return false;
	}

	return justice_theme_lawyer_monthly_routed_lead_count( $lawyer_id, $area ) < $cap;
}

function justice_theme_route_lead_after_meta_write( $meta_id, int $post_id, string $meta_key, $meta_value ): void {
	if ( ! in_array( $meta_key, array( 'message', 'legal_area', 'ai_detected_area', 'assigned_lawyer_id' ), true ) ) {
		return;
	}

	$post = get_post( $post_id );
	if ( ! $post || 'justice_lead' !== $post->post_type || wp_is_post_revision( $post_id ) ) {
		return;
	}

	if ( get_post_meta( $post_id, 'routing_completed', true ) ) {
		return;
	}

	if ( 'assigned_lawyer_id' !== $meta_key && ! empty( $_POST['assigned_lawyer_id'] ) ) {
		return;
	}

	justice_theme_route_lead_to_lawyers( $post_id, $post, true );
}
add_action( 'added_post_meta', 'justice_theme_route_lead_after_meta_write', 30, 4 );
add_action( 'updated_post_meta', 'justice_theme_route_lead_after_meta_write', 30, 4 );

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
		'posts_per_page' => 25,
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
			'relation' => 'AND',
			array(
				'key'   => 'lead_routing_enabled',
				'value' => '1',
			),
			array(
				'key'     => 'subscription_status',
				'value'   => justice_theme_paid_routing_subscription_statuses(),
				'compare' => 'IN',
			),
		),
	) );

	$lawyer_ids = array();
	foreach ( $query->posts ?: array() as $lawyer_id ) {
		$lawyer_id = (int) $lawyer_id;
		if ( justice_theme_lawyer_can_receive_routed_lead( $lawyer_id, $area ) ) {
			$lawyer_ids[] = $lawyer_id;
		}
	}

	return array_slice( $lawyer_ids, 0, 10 );
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
