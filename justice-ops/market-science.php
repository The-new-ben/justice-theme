<?php
/**
 * Marketplace science layer: the research, operationalized.
 *
 * 1. SLA ESCALATION ENGINE (MIT/InsideSales Lead Response Management,
 *    Oldroyd: contact odds drop two orders of magnitude between 5 and 30
 *    minutes). Routed leads that stay unacknowledged escalate on a timer:
 *    tier one re-notifies the lawyer and nudges the owner; tier two
 *    reassigns to the next eligible lawyer and records the event. Every
 *    escalation is stamped on the lead as evidence.
 *
 * 2. PERFORMANCE-WEIGHTED MATCHING (market design, Gale-Shapley/Roth:
 *    stability plus market speed). Within the same paid tier the router
 *    now prefers lawyers who actually answer: median first-response and
 *    acknowledge rate earn a bonus, recent escalations cost one. Paid
 *    tier still dominates: performance reorders equals, never overrides
 *    what was sold.
 *
 * 3. TRUTHFUL SOCIAL PROOF (Goldstein, Cialdini and Griskevicius 2008,
 *    descriptive norms, +9 points with REAL numbers). A trust strip
 *    renders live marketplace numbers, and any figure below a floor is
 *    hidden rather than inflated. Nothing is ever invented.
 *
 * 4. POST-SUBMIT EXPECTATION PANEL (uncertainty reduction): after a lead
 *    submits, a confirmation panel sets the timeline of what happens next
 *    and offers the WhatsApp accelerator.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Parse a site-timezone "Y-m-d H:i" stamp to a unix ts. strtotime alone
 * reads it as UTC and shifts every age calculation by the site offset
 * (caught live by the SLA harness).
 */
function justice_market_ts( string $stamp ): int {
	if ( '' === $stamp ) {
		return 0;
	}

	$dt = date_create_immutable( $stamp, wp_timezone() );

	return $dt ? $dt->getTimestamp() : 0;
}

// ---------------------------------------------------------------------------
// Performance metrics per lawyer (cached)
// ---------------------------------------------------------------------------

function justice_market_lawyer_metrics( int $lawyer_id ): array {
	$cached = get_transient( 'jt_perf_' . $lawyer_id );

	if ( is_array( $cached ) ) {
		return $cached;
	}

	$leads = get_posts( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => 30,
		'fields'         => 'ids',
		'date_query'     => array( array( 'after' => '60 days ago' ) ),
		'meta_query'     => array( array( 'key' => 'assigned_lawyer_id', 'value' => (string) $lawyer_id ) ),
	) );

	$mins        = array();
	$acked       = 0;
	$escalations = 0;

	foreach ( $leads as $lead_id ) {
		$routed = strtotime( (string) get_post_meta( $lead_id, 'lead_routed_at', true ) );
		$ack    = strtotime( (string) get_post_meta( $lead_id, 'lead_ack_at', true ) );

		if ( $ack ) {
			$acked++;
			if ( $routed && $ack >= $routed ) {
				$mins[] = ( $ack - $routed ) / 60;
			}
		}

		if ( get_post_meta( $lead_id, 'lead_escalated_from', true ) === (string) $lawyer_id ) {
			$escalations++;
		}
	}

	sort( $mins );

	$metrics = array(
		'sample'       => count( $leads ),
		'ack_rate'     => $leads ? round( $acked / count( $leads ), 2 ) : 0,
		'median_mins'  => $mins ? (int) $mins[ (int) floor( count( $mins ) / 2 ) ] : 0,
		'escalations'  => $escalations,
	);

	set_transient( 'jt_perf_' . $lawyer_id, $metrics, HOUR_IN_SECONDS );

	return $metrics;
}

/**
 * Reorder candidates of EQUAL paid tier by performance. Paid tier always
 * dominates: the sort key is (priority_score, performance bonus).
 */
function justice_market_rank( array $candidates ): array {
	$scored = array();

	foreach ( $candidates as $candidate ) {
		$paid  = (int) get_post_meta( $candidate->ID, 'priority_score', true );
		$bonus = 0;

		$m = justice_market_lawyer_metrics( $candidate->ID );

		if ( $m['sample'] >= 3 ) {
			if ( $m['median_mins'] > 0 && $m['median_mins'] <= 60 ) {
				$bonus += 8;
			}
			if ( $m['ack_rate'] >= 0.8 ) {
				$bonus += 7;
			}
			if ( $m['escalations'] >= 2 ) {
				$bonus -= 10;
			}
		}

		$scored[] = array( 'post' => $candidate, 'paid' => $paid, 'bonus' => $bonus );
	}

	usort( $scored, static function ( $a, $b ) {
		if ( $a['paid'] !== $b['paid'] ) {
			return $b['paid'] <=> $a['paid'];
		}

		return $b['bonus'] <=> $a['bonus'];
	} );

	return wp_list_pluck( $scored, 'post' );
}

// ---------------------------------------------------------------------------
// SLA escalation engine
// ---------------------------------------------------------------------------

add_filter( 'cron_schedules', function ( $schedules ) {
	$schedules['jt_quarter_hour'] = array( 'interval' => 15 * MINUTE_IN_SECONDS, 'display' => 'Every 15 minutes' );
	return $schedules;
} );

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'justice_sla_tick' ) ) {
		wp_schedule_event( time() + 120, 'jt_quarter_hour', 'justice_sla_tick' );
	}
} );

function justice_sla_run(): array {
	$tier1_min = (int) get_option( 'justice_sla_tier1_minutes', 30 );
	$tier2_min = (int) get_option( 'justice_sla_tier2_minutes', 90 );

	$open = get_posts( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => 30,
		'fields'         => 'ids',
		'date_query'     => array( array( 'after' => '3 days ago' ) ),
		'meta_query'     => array(
			array( 'key' => 'lead_routing_status', 'value' => 'routed' ),
			array( 'key' => 'lead_ack_at', 'compare' => 'NOT EXISTS' ),
		),
	) );

	$acted = array();

	foreach ( $open as $lead_id ) {
		$routed_at = justice_market_ts( (string) get_post_meta( $lead_id, 'lead_routed_at', true ) );

		if ( ! $routed_at ) {
			continue;
		}

		$age_min = ( time() - $routed_at ) / 60;
		$stage   = (string) get_post_meta( $lead_id, 'sla_stage', true );

		if ( $age_min >= $tier2_min && 'tier2' !== $stage ) {
			$acted[] = justice_sla_tier2( $lead_id );
		} elseif ( $age_min >= $tier1_min && '' === $stage ) {
			$acted[] = justice_sla_tier1( $lead_id );
		}
	}

	return array( 'checked' => count( $open ), 'acted' => array_filter( $acted ) );
}
add_action( 'justice_sla_tick', 'justice_sla_run' );

function justice_sla_stamp( int $lead_id, string $event ): void {
	$trail   = (string) get_post_meta( $lead_id, 'sla_events', true );
	$trail  .= ( $trail ? "\n" : '' ) . wp_date( 'Y-m-d H:i' ) . ' ' . $event;
	update_post_meta( $lead_id, 'sla_events', $trail );
}

function justice_sla_tier1( int $lead_id ): string {
	update_post_meta( $lead_id, 'sla_stage', 'tier1' );
	justice_sla_stamp( $lead_id, 'TIER1: reminder sent, lead unacknowledged' );

	$lawyer = (int) get_post_meta( $lead_id, 'assigned_lawyer_id', true );
	$email  = sanitize_email( (string) get_post_meta( $lawyer, 'email', true ) );
	$token  = substr( wp_hash( 'jt-lead-ack-' . $lead_id ), 0, 16 );

	if ( $email ) {
		wp_mail(
			$email,
			'[Jus-Tice] תזכורת: פנייה ממתינה לך',
			'פנייה שהופנתה אליך עדיין ממתינה לאישור קבלה. פניות שנענות מהר נסגרות בשיעור גבוה פי כמה.' . "\n\nאישור קבלה: " . rest_url( 'justice-ops/v1/lead-ack' ) . '?lead=' . $lead_id . '&t=' . $token
		);
	}

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice SLA] ליד ללא מענה ' . get_option( 'justice_sla_tier1_minutes', 30 ) . ' דקות',
		'הליד ' . $lead_id . ' (' . get_post_meta( $lead_id, 'visitor_name', true ) . ') טרם אושר על ידי ' . get_the_title( $lawyer ) . '. נשלחה תזכורת. טלפון הפונה: ' . get_post_meta( $lead_id, 'visitor_phone', true )
	);

	return 'tier1:' . $lead_id;
}

function justice_sla_tier2( int $lead_id ): string {
	$current = (int) get_post_meta( $lead_id, 'assigned_lawyer_id', true );
	$area    = (string) get_post_meta( $lead_id, 'legal_area', true );
	$family  = function_exists( 'justice_router_area_to_family' ) ? justice_router_area_to_family( $area ) : '';
	$map     = function_exists( 'justice_cards_family_map' ) ? justice_cards_family_map() : array();

	update_post_meta( $lead_id, 'sla_stage', 'tier2' );

	$next = null;

	if ( $family && ! empty( $map[ $family ] ) && function_exists( 'justice_cards_lawyers' ) ) {
		foreach ( justice_market_rank( justice_cards_lawyers( $map[ $family ], 6 ) ) as $candidate ) {
			if ( $candidate->ID !== $current ) {
				$next = $candidate;
				break;
			}
		}
	}

	if ( ! $next ) {
		justice_sla_stamp( $lead_id, 'TIER2: no alternative lawyer available, owner takes over' );
		wp_mail(
			get_option( 'admin_email' ),
			'[Jus-Tice SLA] ליד דורש טיפול ידני',
			'הליד ' . $lead_id . ' לא אושר גם אחרי תזכורת ואין עורך דין חלופי בתחום. טלפון הפונה: ' . get_post_meta( $lead_id, 'visitor_phone', true )
		);

		return 'tier2-manual:' . $lead_id;
	}

	update_post_meta( $lead_id, 'lead_escalated_from', (string) $current );
	update_post_meta( $lead_id, 'assigned_lawyer_id', (string) $next->ID );
	update_post_meta( $lead_id, 'lead_routed_at', wp_date( 'Y-m-d H:i' ) );
	delete_post_meta( $lead_id, 'sla_stage' );
	justice_sla_stamp( $lead_id, 'TIER2: reassigned from ' . $current . ' to ' . $next->ID );
	delete_transient( 'jt_perf_' . $current );

	$email = sanitize_email( (string) get_post_meta( $next->ID, 'email', true ) );
	$token = substr( wp_hash( 'jt-lead-ack-' . $lead_id ), 0, 16 );

	if ( $email ) {
		wp_mail(
			$email,
			'[Jus-Tice] פנייה חדשה הועברה אליך',
			'פנייה בתחומך הועברה אליך לאחר שלא נענתה. פרטים: ' . get_post_meta( $lead_id, 'visitor_name', true ) . ', ' . get_post_meta( $lead_id, 'visitor_phone', true )
			. "\n\nאישור קבלה: " . rest_url( 'justice-ops/v1/lead-ack' ) . '?lead=' . $lead_id . '&t=' . $token
		);
	}

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice SLA] ליד הועבר לעורך דין חלופי',
		'הליד ' . $lead_id . ' הועבר מ' . get_the_title( $current ) . ' אל ' . get_the_title( $next->ID ) . ' לאחר אי מענה.'
	);

	return 'tier2:' . $lead_id;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/sla-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => 'justice_sla_run',
	) );

	register_rest_route( 'justice-ops/v1', '/market-stats', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function () {
			return justice_market_stats();
		},
	) );
} );

// ---------------------------------------------------------------------------
// Truthful social proof
// ---------------------------------------------------------------------------

function justice_market_stats(): array {
	$cached = get_transient( 'jt_market_stats' );

	if ( is_array( $cached ) ) {
		return $cached;
	}

	$leads7 = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'date_query'     => array( array( 'after' => '7 days ago' ) ),
	) );

	$acks = get_posts( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => 40,
		'fields'         => 'ids',
		'date_query'     => array( array( 'after' => '30 days ago' ) ),
		'meta_query'     => array( array( 'key' => 'lead_ack_at', 'compare' => 'EXISTS' ) ),
	) );

	$mins = array();

	foreach ( $acks as $lead_id ) {
		$routed = strtotime( (string) get_post_meta( $lead_id, 'lead_routed_at', true ) );
		$ack    = strtotime( (string) get_post_meta( $lead_id, 'lead_ack_at', true ) );

		if ( $routed && $ack && $ack >= $routed ) {
			$mins[] = ( $ack - $routed ) / 60;
		}
	}

	sort( $mins );

	$questions = wp_count_posts( 'justice_question' );
	$articles  = wp_count_posts( 'articles' );
	$terms     = wp_count_posts( 'justice_term' );

	$stats = array(
		'leads_7d'        => (int) $leads7->found_posts,
		'median_resp_min' => $mins ? (int) $mins[ (int) floor( count( $mins ) / 2 ) ] : 0,
		'resp_sample'     => count( $mins ),
		'questions_pub'   => (int) ( $questions->publish ?? 0 ),
		'guides_pub'      => (int) ( $articles->publish ?? 0 ) + (int) ( $terms->publish ?? 0 ),
	);

	set_transient( 'jt_market_stats', $stats, HOUR_IN_SECONDS );

	return $stats;
}

/**
 * The trust strip: renders only figures that clear the floor. Real numbers
 * or nothing (descriptive norms only work when true, and lying is not on
 * the table anyway).
 */
function justice_market_trust_strip(): string {
	$stats = justice_market_stats();
	$floor = (int) get_option( 'justice_trust_floor', 3 );
	$items = array();

	if ( $stats['guides_pub'] >= 50 ) {
		$items[] = number_format_i18n( $stats['guides_pub'] ) . ' מדריכים וערכים משפטיים באתר';
	}

	if ( $stats['leads_7d'] >= $floor ) {
		$items[] = number_format_i18n( $stats['leads_7d'] ) . ' פניות נותבו לעורכי דין בשבוע האחרון';
	}

	if ( $stats['median_resp_min'] > 0 && $stats['median_resp_min'] <= 120 && $stats['resp_sample'] >= $floor ) {
		$items[] = 'זמן מענה חציוני: ' . $stats['median_resp_min'] . ' דקות';
	}

	if ( $stats['questions_pub'] >= $floor ) {
		$items[] = number_format_i18n( $stats['questions_pub'] ) . ' שאלות נענו ופורסמו';
	}

	if ( ! $items ) {
		return '';
	}

	$out = '<div class="jt-trust">';

	foreach ( $items as $item ) {
		$out .= '<span class="jt-trust__item">' . esc_html( $item ) . '</span>';
	}

	return $out . '</div><style>.jt-trust{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.jt-trust__item{background:#f7f2e7;color:#7c6519;border-radius:999px;padding:8px 16px;font-size:13.5px;font-weight:700}</style>';
}

// ---------------------------------------------------------------------------
// Post-submit expectation panel
// ---------------------------------------------------------------------------

add_action( 'wp_footer', function () {
	if ( ! isset( $_GET['lead'] ) || 'success' !== sanitize_key( wp_unslash( $_GET['lead'] ) ) ) {
		return;
	}
	?>
	<div class="jt-expect" role="status">
		<strong>הפנייה התקבלה</strong>
		<ol>
			<li>הפנייה מנותבת עכשיו לעורך דין מתאים בתחום</li>
			<li>עורך הדין חוזר אליכם, לרוב בתוך שעות ספורות</li>
			<li>רוצים לזרז? אפשר לשלוח וואטסאפ מהכפתור הצף</li>
		</ol>
		<button type="button" onclick="this.parentNode.remove()" aria-label="סגירה">הבנתי</button>
	</div>
	<style>
	.jt-expect{position:fixed;inset-block-end:84px;inset-inline-start:14px;z-index:99991;max-width:330px;background:#fff;border:1.5px solid transparent;border-radius:16px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;box-shadow:0 20px 44px -20px rgba(13,23,54,.45);padding:16px 18px}
	.jt-expect strong{color:#14213d;font-size:16px}
	.jt-expect ol{margin:10px 0 12px;padding-inline-start:18px;color:#3d4660;font-size:13.5px;line-height:1.65}
	.jt-expect button{background:#14213d;color:#fff;border:0;border-radius:9px;padding:8px 18px;font-weight:700;cursor:pointer}
	</style>
	<?php
}, 62 );
