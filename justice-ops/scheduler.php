<?php
/**
 * Real appointment scheduling + the criminal emergency strip. The owner
 * order (2026-07-12): visitors must be able to actually book a meeting,
 * with a real calendar artifact, and criminal urgency needs a one-tap
 * human path, placed FIRST on the criminal money page.
 *
 * Design follows the patterns that work in the field (Calendly-style
 * slot grid, FindLaw-style pre-meeting intake, ACLU-style act-now
 * framing): a 7-day Israel-week slot grid fetched live from REST (page
 * caches can never show stale availability), a three-field booking, a
 * downloadable ICS file (works with Google/Apple/Outlook calendars with
 * no OAuth and no third-party SaaS), and the booking lands as a routed
 * lead on the exact same rail as every other surface, so the SLA
 * escalation engine and the CRM see it like any lead.
 *
 * Guards: honeypot + minimum form age, phone sanity, server-side slot
 * validation, double-book prevention, 3 bookings per IP per day.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Availability model
// ---------------------------------------------------------------------------

/**
 * Weekly hours, Israel week. Keyed by PHP 'w' (0=Sunday). Values are
 * [start_hour, end_hour); empty = closed. Owner-tunable via option.
 *
 * @return array<int,array{0:int,1:int}>
 */
function justice_sched_hours(): array {
	$saved = get_option( 'jt_sched_hours', '' );

	if ( is_string( $saved ) && '' !== $saved ) {
		$decoded = json_decode( $saved, true );

		if ( is_array( $decoded ) ) {
			return $decoded;
		}
	}

	return array( 0 => array( 9, 19 ), 1 => array( 9, 19 ), 2 => array( 9, 19 ), 3 => array( 9, 19 ), 4 => array( 9, 19 ), 5 => array( 9, 13 ) );
}

const JUSTICE_SCHED_SLOT_MIN = 30;
const JUSTICE_SCHED_HORIZON_DAYS = 7;
const JUSTICE_SCHED_MIN_LEAD_HOURS = 3;

/**
 * The private appointment record type (visible in wp-admin only).
 */
add_action( 'init', function () {
	register_post_type( 'justice_appt', array(
		'label'        => 'פגישות',
		'labels'       => array( 'name' => 'פגישות', 'singular_name' => 'פגישה' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-calendar-alt',
		'supports'     => array( 'title' ),
	) );
} );

/**
 * Booked (non-cancelled) appointment datetimes inside the horizon,
 * as 'Y-m-d H:i' strings.
 *
 * @return array<int,string>
 */
function justice_sched_taken(): array {
	$ids = get_posts( array(
		'post_type'      => 'justice_appt',
		'post_status'    => array( 'publish', 'draft', 'private' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			array( 'key' => 'appt_datetime', 'value' => wp_date( 'Y-m-d 00:00' ), 'compare' => '>=' ),
		),
	) );

	$taken = array();

	foreach ( $ids as $id ) {
		if ( 'cancelled' === get_post_meta( $id, 'appt_status', true ) ) {
			continue;
		}

		$taken[] = (string) get_post_meta( $id, 'appt_datetime', true );
	}

	return $taken;
}

/**
 * The available slot map for the next horizon days.
 *
 * @return array<int,array{date:string,label:string,slots:array<int,string>}>
 */
function justice_sched_slots(): array {
	$tz     = wp_timezone();
	$now    = new DateTimeImmutable( 'now', $tz );
	$min    = $now->add( new DateInterval( 'PT' . JUSTICE_SCHED_MIN_LEAD_HOURS . 'H' ) );
	$hours  = justice_sched_hours();
	$taken  = justice_sched_taken();
	$days   = array();
	$dnames = array( 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת' );

	for ( $d = 0; $d < JUSTICE_SCHED_HORIZON_DAYS; $d++ ) {
		$day = $now->add( new DateInterval( 'P' . $d . 'D' ) );
		$w   = (int) $day->format( 'w' );

		if ( empty( $hours[ $w ] ) ) {
			continue;
		}

		list( $from, $to ) = $hours[ $w ];
		$slots = array();

		for ( $h = $from; $h < $to; $h++ ) {
			foreach ( array( 0, JUSTICE_SCHED_SLOT_MIN ) as $m ) {
				$slot = $day->setTime( $h, $m );

				if ( $slot < $min ) {
					continue;
				}

				if ( in_array( $slot->format( 'Y-m-d H:i' ), $taken, true ) ) {
					continue;
				}

				$slots[] = $slot->format( 'H:i' );
			}
		}

		if ( empty( $slots ) ) {
			continue;
		}

		$days[] = array(
			'date'  => $day->format( 'Y-m-d' ),
			'label' => ( 0 === $d ? 'היום' : ( 1 === $d ? 'מחר' : 'יום ' . $dnames[ $w ] ) ) . ' ' . $day->format( 'd.m' ),
			'slots' => $slots,
		);
	}

	return $days;
}

// ---------------------------------------------------------------------------
// REST: slots, booking, ICS
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/appt-slots', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$response = rest_ensure_response( array( 'days' => justice_sched_slots() ) );
			$response->header( 'Cache-Control', 'no-store' );

			return $response;
		},
	) );

	register_rest_route( 'justice-ops/v1', '/appt-book', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'justice_sched_book',
	) );

	register_rest_route( 'justice-ops/v1', '/appt-ics', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'justice_sched_ics',
	) );
} );

/**
 * Book a slot: guards, slot validation, double-book check, appointment
 * record, routed lead on the canonical rail, owner mail, ICS link.
 */
function justice_sched_book( WP_REST_Request $req ) {
	if ( '' !== (string) $req->get_param( 'hp' ) ) {
		return new WP_Error( 'bad', 'invalid', array( 'status' => 400 ) );
	}

	$t0 = (int) $req->get_param( 't0' );

	if ( $t0 <= 0 || ( time() - $t0 ) < 3 ) {
		return new WP_Error( 'fast', 'הטופס נשלח מהר מדי. נסו שוב.', array( 'status' => 400 ) );
	}

	$ip    = sanitize_text_field( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	$key   = 'jt_sched_ip_' . md5( $ip . wp_date( 'Y-m-d' ) );
	$count = (int) get_transient( $key );

	if ( $count >= 3 ) {
		return new WP_Error( 'limit', 'הגעתם למכסת הקביעות היומית. אפשר להתקשר או לכתוב בוואטסאפ.', array( 'status' => 429 ) );
	}

	$date  = sanitize_text_field( (string) $req->get_param( 'date' ) );
	$time  = sanitize_text_field( (string) $req->get_param( 'time' ) );
	$name  = sanitize_text_field( (string) $req->get_param( 'name' ) );
	$phone = preg_replace( '/[^0-9+]/', '', (string) $req->get_param( 'phone' ) );
	$area  = sanitize_key( (string) $req->get_param( 'area' ) ) ?: 'criminal-law';
	$note  = mb_substr( sanitize_textarea_field( (string) $req->get_param( 'note' ) ), 0, 500 );

	if ( '' === $name || strlen( $phone ) < 9 ) {
		return new WP_Error( 'fields', 'צריך שם וטלפון תקין.', array( 'status' => 400 ) );
	}

	// The requested slot must exist in the live availability right now.
	$valid = false;

	foreach ( justice_sched_slots() as $day ) {
		if ( $day['date'] === $date && in_array( $time, $day['slots'], true ) ) {
			$valid = true;

			break;
		}
	}

	if ( ! $valid ) {
		return new WP_Error( 'slot', 'המועד הזה כבר נתפס. בחרו מועד אחר.', array( 'status' => 409 ) );
	}

	$when = $date . ' ' . $time;

	$appt_id = wp_insert_post( array(
		'post_type'   => 'justice_appt',
		'post_status' => 'private',
		'post_title'  => $name . ' | ' . $when,
	) );

	if ( ! $appt_id || is_wp_error( $appt_id ) ) {
		return new WP_Error( 'save', 'לא הצלחנו לשמור. נסו שוב.', array( 'status' => 500 ) );
	}

	update_post_meta( $appt_id, 'appt_datetime', $when );
	update_post_meta( $appt_id, 'appt_status', 'booked' );
	update_post_meta( $appt_id, 'appt_phone', $phone );
	update_post_meta( $appt_id, 'appt_area', $area );
	update_post_meta( $appt_id, 'appt_note', $note );

	// The booking is a lead on the canonical rail: same fields the theme
	// handler writes, then the router, so CRM + SLA see it like any lead.
	$lead_id = wp_insert_post( array(
		'post_type'   => 'justice_lead',
		'post_title'  => $name . ' | פגישה ' . $when,
		'post_status' => 'publish',
	) );

	if ( $lead_id && ! is_wp_error( $lead_id ) ) {
		foreach ( array(
			'visitor_name'        => $name,
			'visitor_phone'       => $phone,
			'legal_area'          => $area,
			'message'             => 'נקבעה פגישה דרך היומן ל-' . $when . ( $note ? '. תיאור: ' . $note : '' ),
			'urgency'             => 'high',
			'lead_status'         => 'new',
			'follow_up_status'    => 'not_started',
			'coverage_status'     => 'coverage_review',
			'consent'             => '1',
			'consent_status'      => 'explicit_site_form_consent',
			'source_channel'      => 'public_site_form',
			'source_system'       => 'justice_public_site',
			'lead_source_surface' => 'scheduler',
			'appt_id'             => (string) $appt_id,
		) as $k => $v ) {
			update_post_meta( $lead_id, $k, $v );
		}

		update_post_meta( $appt_id, 'appt_lead_id', $lead_id );

		if ( function_exists( 'justice_router_route_lead' ) ) {
			justice_router_route_lead( $lead_id );
		}
	}

	set_transient( $key, $count + 1, DAY_IN_SECONDS );

	$token = substr( wp_hash( 'jt-appt-' . $appt_id ), 0, 16 );

	wp_mail(
		get_option( 'admin_email' ),
		'פגישה חדשה נקבעה: ' . $when,
		"נקבעה פגישה חדשה דרך היומן באתר.\n\nשם: {$name}\nטלפון: {$phone}\nתחום: {$area}\nמועד: {$when}\n" . ( $note ? "תיאור: {$note}\n" : '' ) . "\nהפגישה נרשמה גם כליד מנותב במערכת."
	);

	return array(
		'ok'      => true,
		'when'    => $when,
		'ics'     => rest_url( 'justice-ops/v1/appt-ics' ) . '?id=' . $appt_id . '&t=' . $token,
		'message' => 'הפגישה נקבעה. נחזור אליכם לאישור טלפוני, ואפשר להוריד את הפגישה ליומן.',
	);
}

/**
 * The ICS calendar artifact: standard VCALENDAR, opens in Google, Apple
 * and Outlook calendars. Token-guarded so only the booker's link works.
 */
function justice_sched_ics( WP_REST_Request $req ) {
	$id    = (int) $req->get_param( 'id' );
	$token = (string) $req->get_param( 't' );

	if ( ! $id || $token !== substr( wp_hash( 'jt-appt-' . $id ), 0, 16 ) || 'justice_appt' !== get_post_type( $id ) ) {
		return new WP_Error( 'nf', 'not found', array( 'status' => 404 ) );
	}

	$when = (string) get_post_meta( $id, 'appt_datetime', true );
	$tz   = wp_timezone();
	$dt   = DateTimeImmutable::createFromFormat( 'Y-m-d H:i', $when, $tz );

	if ( ! $dt ) {
		return new WP_Error( 'bad', 'bad time', array( 'status' => 500 ) );
	}

	$end = $dt->add( new DateInterval( 'PT' . JUSTICE_SCHED_SLOT_MIN . 'M' ) );

	$ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Jus-Tice//Scheduler//HE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n"
		. "BEGIN:VEVENT\r\n"
		. 'UID:jt-appt-' . $id . "@jus-tice.co.il\r\n"
		. 'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ) . "\r\n"
		. 'DTSTART;TZID=' . $tz->getName() . ':' . $dt->format( 'Ymd\THis' ) . "\r\n"
		. 'DTEND;TZID=' . $tz->getName() . ':' . $end->format( 'Ymd\THis' ) . "\r\n"
		. "SUMMARY:שיחת ייעוץ עם עורך דין, Jus-Tice\r\n"
		. "DESCRIPTION:נחזור אליכם טלפונית במועד שנקבע. Jus-Tice, 052-5101555\r\n"
		. "LOCATION:שיחה טלפונית\r\n"
		. "END:VEVENT\r\nEND:VCALENDAR\r\n";

	header( 'Content-Type: text/calendar; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="jus-tice-meeting.ics"' );
	echo $ics; // phpcs:ignore WordPress.Security.EscapeOutput

	exit;
}

// ---------------------------------------------------------------------------
// The visible widgets
// ---------------------------------------------------------------------------

/**
 * The criminal emergency strip: one tap to a human, right now. Placed
 * FIRST on the criminal money surfaces per the owner order.
 */
add_shortcode( 'justice_emergency_criminal', function () {
	$phone = function_exists( 'justice_theme_option' ) ? (string) justice_theme_option( 'justice_phone', '0525101555' ) : '0525101555';
	$tel   = 'tel:' . preg_replace( '/[^0-9+]/', '', $phone );
	$wa    = 'https://wa.me/972525101555?text=' . rawurlencode( 'חירום פלילי: זקוק לעורך דין עכשיו. ' );

	return '<div class="jt-em" role="region" aria-label="חירום פלילי">'
		. '<div class="jt-em__pulse" aria-hidden="true"></div>'
		. '<div class="jt-em__txt"><strong>חקירה, מעצר או שימוע עכשיו?</strong><span>בענייני חירום פלילי כל שעה קובעת. מדברים עם עורך דין, לא עם מזכירה.</span></div>'
		. '<div class="jt-em__btns">'
		. '<a class="jt-em__call" href="' . esc_url( $tel ) . '">חיוג מיידי ' . esc_html( $phone ) . '</a>'
		. '<a class="jt-em__wa" href="' . esc_url( $wa ) . '" target="_blank" rel="noopener nofollow">וואטסאפ חירום</a>'
		. '<a class="jt-em__book" href="#jt-sched">לא דחוף? קביעת שיחה ביומן</a>'
		. '</div></div>';
} );

/**
 * The money-page placement map: which pages carry the scheduler and
 * which routing area their bookings belong to. Keys are slugs, values
 * are router-vocabulary areas. The injector appends the widget to
 * these pages; a page whose content already carries the shortcode is
 * skipped, so hand-placed instances always win.
 *
 * @return array<string,string>
 */
function justice_sched_money_map(): array {
	return apply_filters( 'justice_sched_money_map', array(
		'free-divorce-agreement-template'  => 'family-law',
		'child-support'                    => 'family-law',
		'divorce-lawyer'                   => 'family-law',
		'family-law'                       => 'family-law',
		'the-recommended-family-lawyers'   => 'family-law',
		'divorce-mediation'                => 'family-law',
		'child-custody'                    => 'family-law',
		'family-lawyer-tel-aviv'           => 'family-law',
		'criminal-defense-attorney'        => 'criminal-law',
		'criminal-process-map'             => 'criminal-law',
		'apply-for-police-criminal-information-certificates' => 'criminal-law',
		'lahav-433'                        => 'criminal-law',
		'police-records-data-deletion'     => 'criminal-law',
		'criminal-law-lawyer-criminal-israel' => 'criminal-law',
		'criminal-law-price-list-lawyer-recommended-review-costs' => 'criminal-law',
		'real-estate-attorney'             => 'real-estate-law',
		'guide-israeli-apartment-2025'     => 'real-estate-law',
		'israel-real-estate-price-forecast' => 'real-estate-law',
		'buying-apartment-from-contractor' => 'real-estate-law',
		'online-rent-agreement'            => 'real-estate-law',
		'lawyer-for-buying-or-selling-a-house' => 'real-estate-law',
		'labor-lawyer'                     => 'labor-law',
		'tort-lawyer'                      => 'personal-injury-law',
		'medical-malpractice-lawyer'       => 'personal-injury-law',
		'medical-malpractice-lawsuits-law-account' => 'personal-injury-law',
		'what-is-medical-malpractice-definition-examples' => 'personal-injury-law',
		'traffic-lawyer'                   => 'traffic-law',
		'inheritance-lawyer'               => 'inheritance-law',
		'lawyer-fees-guide'                => 'general',
		'how-to-find-qualified-lawyer-israel-guide' => 'general',
	) );
}

/**
 * Per-area heading flavor, so the widget speaks the page's language.
 *
 * @return array{h:string,sub:string}
 */
function justice_sched_copy( string $area ): array {
	$map = array(
		'family-law'          => array( 'h' => 'קביעת שיחת ייעוץ בדיני משפחה', 'sub' => 'שיחה דיסקרטית עם עורך דין לענייני משפחה. בוחרים מועד, משאירים שם וטלפון, והפגישה נשמרת גם ביומן שלכם.' ),
		'criminal-law'        => array( 'h' => 'קביעת שיחת ייעוץ פלילי', 'sub' => 'לא דחוף עד כדי חירום? קובעים מועד, והשיחה מתואמת טלפונית. דחוף עכשיו? השתמשו בכפתורי החירום למעלה.' ),
		'real-estate-law'     => array( 'h' => 'קביעת שיחת ייעוץ במקרקעין', 'sub' => 'לפני חתימה, לפני עסקה או כשמשהו נתקע. בוחרים מועד, והפגישה נשמרת גם ביומן שלכם.' ),
		'labor-law'           => array( 'h' => 'קביעת שיחת ייעוץ בדיני עבודה', 'sub' => 'פיטורים, שימוע, שכר או הסכם עבודה. בוחרים מועד, משאירים פרטים, וחוזרים אליכם לאישור.' ),
		'personal-injury-law' => array( 'h' => 'קביעת שיחת ייעוץ בנזיקין ורשלנות', 'sub' => 'שיחת בדיקה ראשונית על המקרה שלכם. בוחרים מועד, והפגישה נשמרת גם ביומן שלכם.' ),
		'traffic-law'         => array( 'h' => 'קביעת שיחת ייעוץ בתעבורה', 'sub' => 'דוח, פסילה או זימון לבית משפט. בוחרים מועד, משאירים פרטים, וחוזרים אליכם לאישור.' ),
		'inheritance-law'     => array( 'h' => 'קביעת שיחת ייעוץ בירושה וצוואות', 'sub' => 'שיחה שקטה ומסודרת על צוואה, ירושה או התנגדות. הפגישה נשמרת גם ביומן שלכם.' ),
	);

	return $map[ $area ] ?? array( 'h' => 'קביעת שיחת ייעוץ ביומן', 'sub' => 'בוחרים מועד, משאירים שם וטלפון, ומקבלים את הפגישה גם כקובץ יומן. נחזור אליכם לאישור טלפוני.' );
}

/**
 * The booking widget. Availability is fetched live from REST so cached
 * pages can never show stale slots. Design: a booking card in the site
 * system (navy header, gold action), two honest steps (מועד, פרטים),
 * date rail with scroll snap, tabular-numeral time grid.
 */
add_shortcode( 'justice_scheduler', function ( $atts ) {
	$atts = shortcode_atts( array( 'area' => 'criminal-law' ), $atts );
	$copy = justice_sched_copy( (string) $atts['area'] );

	return '<div class="jt-sc" id="jt-sched" data-area="' . esc_attr( $atts['area'] ) . '">'
		. '<div class="jt-sc__head">'
		. '<svg class="jt-sc__glyph" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 13.5l2.6 2.6L16.5 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
		. '<div class="jt-sc__head-t"><h3 class="jt-sc__h">' . esc_html( $copy['h'] ) . '</h3>'
		. '<p class="jt-sc__sub">' . esc_html( $copy['sub'] ) . '</p></div>'
		. '</div>'
		. '<div class="jt-sc__body">'
		. '<p class="jt-sc__step"><span>1</span>בחירת מועד</p>'
		. '<div class="jt-sc__days" id="jt-sc-days" aria-label="בחירת יום"></div>'
		. '<div class="jt-sc__slots" id="jt-sc-slots" aria-label="בחירת שעה"></div>'
		. '<form class="jt-sc__form" id="jt-sc-form" hidden>'
		. '<p class="jt-sc__step"><span>2</span>הפרטים שלכם</p>'
		. '<p class="jt-sc__chosen" id="jt-sc-chosen" aria-live="polite"></p>'
		. '<input type="text" id="jt-sc-hp" autocomplete="off" tabindex="-1" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px">'
		. '<div class="jt-sc__grid">'
		. '<label class="screen-reader-text" for="jt-sc-name">שם מלא</label>'
		. '<input type="text" id="jt-sc-name" placeholder="שם מלא" maxlength="60" required>'
		. '<label class="screen-reader-text" for="jt-sc-phone">טלפון</label>'
		. '<input type="tel" id="jt-sc-phone" placeholder="טלפון" maxlength="20" required>'
		. '</div>'
		. '<label class="screen-reader-text" for="jt-sc-note">על מה השיחה</label>'
		. '<input type="text" id="jt-sc-note" placeholder="על מה השיחה? משפט אחד (לא חובה)" maxlength="200">'
		. '<button type="submit" id="jt-sc-go">אישור הפגישה</button>'
		. '</form>'
		. '<div class="jt-sc__done" id="jt-sc-done" hidden></div>'
		. '<p class="jt-sc__disc">הקביעה היא לשיחת היכרות וייעוץ ראשוני. הפרטים משמשים לתיאום השיחה בלבד.</p>'
		. '</div></div>';
} );

/**
 * The injector: every mapped money page gets the scheduler appended to
 * its content with the right routing area. Hand-placed shortcodes win
 * (a page already carrying the widget is left alone), feeds and REST
 * stay clean.
 */
add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular() || ! in_the_loop() || ! is_main_query() || is_feed() ) {
		return $content;
	}

	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $content;
	}

	$post = get_post();

	if ( ! $post instanceof WP_Post ) {
		return $content;
	}

	$map = justice_sched_money_map();

	if ( ! isset( $map[ $post->post_name ] ) ) {
		return $content;
	}

	$content = (string) $content;

	if ( false !== strpos( $content, 'jt-sched' ) || false !== strpos( $content, 'justice_scheduler' ) ) {
		return $content;
	}

	return $content . do_shortcode( '[justice_scheduler area="' . esc_attr( $map[ $post->post_name ] ) . '"]' );
}, 34 );

/**
 * Whether the current request is a scheduler-carrying page (for asset
 * loading). URI-based so controlled routes are covered too.
 */
function justice_sched_on_page(): bool {
	$uri = (string) ( $_SERVER['REQUEST_URI'] ?? '' );

	if ( false !== strpos( $uri, 'criminal' ) || false !== strpos( $uri, 'legal-tools' ) ) {
		return true;
	}

	$path = trim( rawurldecode( strtok( $uri, '?' ) ), '/' );
	$bits = explode( '/', $path );
	$slug = (string) end( $bits );

	return isset( justice_sched_money_map()[ $slug ] );
}

add_action( 'wp_head', function () {
	if ( ! justice_sched_on_page() ) {
		return;
	}

	echo '<style id="jt-sched-css">'
		. '.jt-em{display:flex;flex-wrap:wrap;align-items:center;gap:14px;background:linear-gradient(120deg,#3b0d0d,#5c1a1a);border:1px solid #a33;border-radius:16px;padding:18px 20px;margin:20px 0;position:relative;overflow:hidden}'
		. '.jt-em__pulse{width:12px;height:12px;border-radius:50%;background:#ff5a4e;flex:none;animation:jtpulse 1.6s ease-in-out infinite}'
		. '@keyframes jtpulse{0%,100%{box-shadow:0 0 0 0 rgba(255,90,78,.55)}50%{box-shadow:0 0 0 10px rgba(255,90,78,0)}}'
		. '.jt-em__txt{flex:1;min-width:220px;color:#ffe9e6;display:flex;flex-direction:column;gap:2px}'
		. '.jt-em__txt strong{font-size:17px}'
		. '.jt-em__txt span{font-size:13.5px;opacity:.9}'
		. '.jt-em__btns{display:flex;flex-wrap:wrap;gap:8px}'
		. '.jt-em__call{background:#ff5a4e;color:#fff;border-radius:12px;padding:12px 20px;font-weight:800;font-size:15px;text-decoration:none;white-space:nowrap}'
		. '.jt-em__wa{background:#25d366;color:#fff;border-radius:12px;padding:12px 18px;font-weight:800;font-size:15px;text-decoration:none;white-space:nowrap}'
		. '.jt-em__book{background:rgba(255,255,255,.12);color:#ffe9e6;border:1px solid rgba(255,255,255,.3);border-radius:12px;padding:12px 16px;font-weight:700;font-size:13.5px;text-decoration:none;white-space:nowrap}'
		. '.jt-sc{--sc-navy:#14213d;--sc-band:#1b2f55;--sc-gold:#e7c765;--sc-gold2:#d9b654;--sc-ink:#1d2740;--sc-mut:#5b6780;--sc-line:#dbe3f0;--sc-paper:#fff;--sc-ground:#f7f9fd;'
		. 'background:var(--sc-paper);border:1px solid var(--sc-line);border-radius:18px;margin:30px 0;overflow:hidden;box-shadow:0 18px 44px -30px rgba(10,18,38,.45)}'
		. '.jt-sc__head{display:flex;align-items:center;gap:14px;background:linear-gradient(120deg,var(--sc-navy),var(--sc-band) 70%);padding:20px 24px}'
		. '.jt-sc__glyph{color:var(--sc-gold);flex:none}'
		. '.jt-sc__h{font-size:20px;color:#fff;margin:0;letter-spacing:-.01em}'
		. '.jt-sc__sub{font-size:13.5px;color:#c6d0e4;margin:4px 0 0;line-height:1.5;max-width:64ch}'
		. '.jt-sc__body{padding:20px 24px 22px;background:var(--sc-ground)}'
		. '.jt-sc__step{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:800;letter-spacing:.06em;color:var(--sc-mut);text-transform:uppercase;margin:0 0 10px}'
		. '.jt-sc__step span{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:var(--sc-navy);color:var(--sc-gold);font-size:11.5px;flex:none}'
		. '.jt-sc__days{display:flex;gap:8px;margin:0 0 12px;overflow-x:auto;padding-bottom:4px;scroll-snap-type:x proximity;scrollbar-width:thin}'
		. '.jt-sc__day{scroll-snap-align:start;flex:none;display:flex;flex-direction:column;align-items:center;gap:1px;background:var(--sc-paper);border:1.5px solid #cbd6e8;border-radius:12px;padding:8px 16px;font:inherit;cursor:pointer;transition:border-color .12s ease,transform .12s ease}'
		. '.jt-sc__day b{font-size:13.5px;font-weight:800;color:var(--sc-ink)}'
		. '.jt-sc__day i{font-style:normal;font-size:12px;color:var(--sc-mut);font-variant-numeric:tabular-nums}'
		. '.jt-sc__day:hover{border-color:#8fa3c8;transform:translateY(-1px)}'
		. '.jt-sc__day.is-on{background:var(--sc-navy);border-color:var(--sc-navy)}'
		. '.jt-sc__day.is-on b{color:var(--sc-gold)}.jt-sc__day.is-on i{color:#c6d0e4}'
		. '.jt-sc__day:focus-visible,.jt-sc__slot:focus-visible,#jt-sc-go:focus-visible{outline:3px solid var(--sc-gold);outline-offset:2px}'
		. '.jt-sc__slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:7px;margin:0 0 16px;min-height:20px}'
		. '.jt-sc__slot{background:var(--sc-paper);border:1px solid #cbd6e8;border-radius:10px;padding:9px 4px;font:inherit;font-size:14.5px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--sc-ink);cursor:pointer;text-align:center;transition:border-color .12s ease,transform .12s ease}'
		. '.jt-sc__slot:hover{border-color:#8fa3c8;transform:translateY(-1px)}'
		. '.jt-sc__slot.is-on{background:linear-gradient(90deg,var(--sc-gold),var(--sc-gold2));border-color:var(--sc-gold2);font-weight:800;color:var(--sc-navy)}'
		. '.jt-sc__form{background:var(--sc-paper);border:1px solid var(--sc-line);border-inline-start:4px solid var(--sc-gold);border-radius:14px;padding:16px 18px;margin:0 0 4px}'
		. '.jt-sc__chosen{font-weight:800;color:var(--sc-ink);margin:0 0 12px;font-size:15px}'
		. '.jt-sc__grid{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px}'
		. '.jt-sc__grid input{flex:1;min-width:150px}'
		. '.jt-sc__form input{border:1px solid #cbd6e8;border-radius:10px;padding:11px 12px;font:inherit;font-size:14.5px;width:100%;background:#fff}'
		. '.jt-sc__form input:focus{outline:none;border-color:var(--sc-gold2);box-shadow:0 0 0 3px rgba(231,199,101,.35)}'
		. '.jt-sc__form input#jt-sc-note{margin:0 0 12px}'
		. '#jt-sc-go{background:linear-gradient(90deg,var(--sc-gold),var(--sc-gold2));color:var(--sc-navy);border:0;border-radius:12px;padding:13px 28px;font-weight:800;font-size:15.5px;cursor:pointer;width:100%;transition:transform .12s ease}'
		. '#jt-sc-go:hover{transform:translateY(-1px)}'
		. '#jt-sc-go:disabled{opacity:.6;cursor:wait;transform:none}'
		. '.jt-sc__done{background:#eefbf2;border:1px solid #9ad3ab;border-radius:12px;padding:16px 18px;font-size:15px;color:#14532d;line-height:1.6}'
		. '.jt-sc__done a{font-weight:800;color:#14532d}'
		. '.jt-sc__disc{font-size:12.5px;color:var(--sc-mut);margin:12px 0 0}'
		. '@media(max-width:560px){.jt-em{padding:14px}.jt-sc__head{padding:16px}.jt-sc__body{padding:14px 16px 18px}}'
		. '@media(prefers-reduced-motion:reduce){.jt-sc__day,.jt-sc__slot,#jt-sc-go{transition:none}.jt-sc__day:hover,.jt-sc__slot:hover,#jt-sc-go:hover{transform:none}.jt-em__pulse{animation:none}}'
		. '</style>';
}, 8 );

add_action( 'wp_footer', function () {
	if ( ! justice_sched_on_page() ) {
		return;
	}
	?>
	<script id="jt-sched-js">
	(function () {
		var root = document.getElementById('jt-sched');
		if (!root) { return; }
		var base = '<?php echo esc_js( rest_url( 'justice-ops/v1' ) ); ?>';
		var t0 = Math.floor(Date.now() / 1000);
		var chosen = { date: '', time: '' };
		var daysBox = document.getElementById('jt-sc-days');
		var slotsBox = document.getElementById('jt-sc-slots');
		var form = document.getElementById('jt-sc-form');
		var days = [];

		function renderSlots(day) {
			slotsBox.innerHTML = '';
			day.slots.forEach(function (t) {
				var b = document.createElement('button');
				b.type = 'button';
				b.className = 'jt-sc__slot';
				b.textContent = t;
				b.addEventListener('click', function () {
					slotsBox.querySelectorAll('.jt-sc__slot').forEach(function (x) { x.classList.remove('is-on'); });
					b.classList.add('is-on');
					chosen.time = t;
					form.hidden = false;
					document.getElementById('jt-sc-chosen').textContent = 'המועד שנבחר: ' + day.label + ' בשעה ' + t;
					document.getElementById('jt-sc-name').focus();
				});
				slotsBox.appendChild(b);
			});
		}

		fetch(base + '/appt-slots?b=' + Date.now()).then(function (r) { return r.json(); }).then(function (d) {
			days = (d && d.days) || [];
			if (!days.length) { daysBox.innerHTML = '<p>אין מועדים פנויים כרגע. אפשר להתקשר או לכתוב בוואטסאפ.</p>'; return; }
			days.forEach(function (day, i) {
				var b = document.createElement('button');
				b.type = 'button';
				b.className = 'jt-sc__day' + (i === 0 ? ' is-on' : '');
				var cut = day.label.lastIndexOf(' ');
				b.innerHTML = '<b></b><i></i>';
				b.firstChild.textContent = cut > 0 ? day.label.slice(0, cut) : day.label;
				b.lastChild.textContent = cut > 0 ? day.label.slice(cut + 1) : '';
				b.addEventListener('click', function () {
					daysBox.querySelectorAll('.jt-sc__day').forEach(function (x) { x.classList.remove('is-on'); });
					b.classList.add('is-on');
					chosen.date = day.date;
					form.hidden = true;
					renderSlots(day);
				});
				daysBox.appendChild(b);
			});
			chosen.date = days[0].date;
			renderSlots(days[0]);
		}).catch(function () {
			daysBox.innerHTML = '<p>לא הצלחנו לטעון את היומן. אפשר להתקשר או לכתוב בוואטסאפ.</p>';
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var go = document.getElementById('jt-sc-go');
			go.disabled = true;
			fetch(base + '/appt-book', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					date: chosen.date,
					time: chosen.time,
					name: document.getElementById('jt-sc-name').value.trim(),
					phone: document.getElementById('jt-sc-phone').value.trim(),
					note: document.getElementById('jt-sc-note').value.trim(),
					area: root.dataset.area || 'criminal-law',
					hp: document.getElementById('jt-sc-hp').value,
					t0: t0
				})
			}).then(function (r) { return r.json(); }).then(function (d) {
				go.disabled = false;
				var done = document.getElementById('jt-sc-done');
				if (d && d.ok) {
					form.hidden = true;
					done.hidden = false;
					done.innerHTML = d.message + ' <a href="' + d.ics + '">הורדת הפגישה ליומן (Google, Apple, Outlook)</a>';
					done.scrollIntoView({ behavior: 'smooth', block: 'center' });
				} else {
					done.hidden = false;
					done.style.background = '#fdf0ee';
					done.style.borderColor = '#e3b1a8';
					done.style.color = '#7a2e21';
					done.textContent = (d && d.message) ? d.message : 'לא הצלחנו לקבוע. נסו שוב או התקשרו.';
				}
			}).catch(function () {
				go.disabled = false;
				var done = document.getElementById('jt-sc-done');
				done.hidden = false;
				done.textContent = 'שגיאת חיבור. נסו שוב בעוד רגע.';
			});
		});
	})();
	</script>
	<?php
}, 24 );
