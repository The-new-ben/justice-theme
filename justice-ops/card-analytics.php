<?php
/**
 * Card analytics: the proof-of-value engine behind placement renewals.
 *
 * Counts VIEWABLE impressions (IntersectionObserver, half the card on
 * screen) and clicks (WhatsApp, profile) per lawyer per surface per day,
 * beaconed from the browser so edge-cached pageviews count too. Data lands
 * in a compact daily-aggregate table; a monthly job mails the owner a
 * per-advertiser performance summary he can forward with a renewal pitch.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JUSTICE_CARDS_DB_VER = '1';

function justice_cards_events_table(): string {
	global $wpdb;
	return $wpdb->prefix . 'jt_card_events_daily';
}

add_action( 'init', function () {
	if ( get_option( 'justice_cards_db_ver' ) === JUSTICE_CARDS_DB_VER ) {
		return;
	}

	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$table   = justice_cards_events_table();
	$charset = $wpdb->get_charset_collate();

	dbDelta( "CREATE TABLE {$table} (
		day date NOT NULL,
		lawyer_id bigint(20) unsigned NOT NULL,
		surface varchar(32) NOT NULL default 'incontent',
		event varchar(16) NOT NULL,
		cnt int(10) unsigned NOT NULL default 0,
		PRIMARY KEY  (day,lawyer_id,surface,event)
	) {$charset};" );

	update_option( 'justice_cards_db_ver', JUSTICE_CARDS_DB_VER );
} );

/**
 * Beacon endpoint. Public by design (visitors send it); hardened by strict
 * validation, a per-IP daily cap and the lawyer-exists check.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/card-event', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $request ) {
			$lawyer  = (int) $request->get_param( 'l' );
			$surface = sanitize_key( (string) $request->get_param( 's' ) );
			$event   = sanitize_key( (string) $request->get_param( 'e' ) );

			if ( ! in_array( $event, array( 'impression', 'click_wa', 'click_profile' ), true ) ) {
				return new WP_REST_Response( array( 'ok' => false ), 400 );
			}

			if ( ! $lawyer || 'justice_lawyer' !== get_post_type( $lawyer ) ) {
				return new WP_REST_Response( array( 'ok' => false ), 400 );
			}

			$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? preg_replace( '/[^0-9a-f.:]/i', '', (string) $_SERVER['REMOTE_ADDR'] ) : 'x';
			$key = 'jtce_' . md5( $ip . wp_date( 'Ymd' ) );
			$hits = (int) get_transient( $key );

			if ( $hits > 200 ) {
				return new WP_REST_Response( array( 'ok' => true ), 202 );
			}

			set_transient( $key, $hits + 1, DAY_IN_SECONDS );

			global $wpdb;
			$table = justice_cards_events_table();

			$wpdb->query( $wpdb->prepare(
				"INSERT INTO {$table} (day, lawyer_id, surface, event, cnt) VALUES (%s, %d, %s, %s, 1)
				ON DUPLICATE KEY UPDATE cnt = cnt + 1",
				wp_date( 'Y-m-d' ),
				$lawyer,
				$surface ?: 'incontent',
				$event
			) );

			return array( 'ok' => true );
		},
	) );

	register_rest_route( 'justice-ops/v1', '/card-stats', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			return justice_cards_stats( max( 1, min( 90, (int) ( $request->get_param( 'days' ) ?: 30 ) ) ) );
		},
	) );
} );

/**
 * Aggregate stats for the last N days, grouped per lawyer.
 */
function justice_cards_stats( int $days ): array {
	global $wpdb;
	$table = justice_cards_events_table();
	$since = wp_date( 'Y-m-d', time() - $days * DAY_IN_SECONDS );

	$rows = $wpdb->get_results( $wpdb->prepare(
		"SELECT lawyer_id, event, SUM(cnt) total FROM {$table} WHERE day >= %s GROUP BY lawyer_id, event",
		$since
	), ARRAY_A );

	$out = array();

	foreach ( (array) $rows as $row ) {
		$id = (int) $row['lawyer_id'];

		if ( ! isset( $out[ $id ] ) ) {
			$out[ $id ] = array(
				'lawyer'        => get_the_title( $id ),
				'impression'    => 0,
				'click_wa'      => 0,
				'click_profile' => 0,
			);
		}

		$out[ $id ][ $row['event'] ] = (int) $row['total'];
	}

	return array( 'days' => $days, 'since' => $since, 'lawyers' => $out );
}

/**
 * The beacon script prints only on requests that rendered a card. The
 * cards filter sets the flag; edge caching keeps the script embedded in
 * exactly the pages that carry cards.
 */
add_action( 'wp_footer', function () {
	if ( empty( $GLOBALS['justice_cards_rendered'] ) ) {
		return;
	}
	?>
	<script id="jt-procard-beacon">(function(){var E=[].slice.call(document.querySelectorAll('.jt-procard[data-l]'));if(!E.length)return;var U='<?php echo esc_js( esc_url_raw( rest_url( 'justice-ops/v1/card-event' ) ) ); ?>';function send(l,s,e){var p=JSON.stringify({l:+l,s:s||'incontent',e:e});try{if(navigator.sendBeacon){navigator.sendBeacon(U,new Blob([p],{type:'application/json'}));return}}catch(x){}try{fetch(U,{method:'POST',headers:{'Content-Type':'application/json'},body:p,keepalive:true})}catch(x){}}
	if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var t=en.target;o.unobserve(t);send(t.getAttribute('data-l'),t.getAttribute('data-card-surface'),'impression')}})},{threshold:.5});E.forEach(function(el){o.observe(el)})}else{E.forEach(function(el){send(el.getAttribute('data-l'),el.getAttribute('data-card-surface'),'impression')})}
	document.addEventListener('click',function(ev){var n=ev.target;while(n&&n!==document&&!(n.classList&&(n.classList.contains('jt-procard__wa')||n.classList.contains('jt-procard__profile'))))n=n.parentNode;if(!n||n===document)return;var c=n;while(c&&c!==document&&!(c.classList&&c.classList.contains('jt-procard')))c=c.parentNode;if(!c||c===document)return;send(c.getAttribute('data-l'),c.getAttribute('data-card-surface'),n.classList.contains('jt-procard__wa')?'click_wa':'click_profile')},true);})();</script>
	<?php
}, 65 );

/**
 * Monthly advertiser performance mail to the owner: first day of the month,
 * covering the previous month, one row per lawyer that had any activity.
 */
add_action( 'justice_monitor_tick', function () {
	if ( '1' !== wp_date( 'j' ) || (int) wp_date( 'H' ) < 8 ) {
		return;
	}

	$month = wp_date( 'Y-m', strtotime( 'first day of last month' ) );

	if ( get_option( 'justice_cards_last_report' ) === $month ) {
		return;
	}

	global $wpdb;
	$table = justice_cards_events_table();
	$rows  = $wpdb->get_results( $wpdb->prepare(
		"SELECT lawyer_id, event, SUM(cnt) total FROM {$table} WHERE day LIKE %s GROUP BY lawyer_id, event",
		$month . '%'
	), ARRAY_A );

	if ( ! $rows ) {
		update_option( 'justice_cards_last_report', $month );
		return;
	}

	$per = array();

	foreach ( $rows as $row ) {
		$per[ (int) $row['lawyer_id'] ][ $row['event'] ] = (int) $row['total'];
	}

	$lines = array();

	foreach ( $per as $id => $events ) {
		$lines[] = sprintf(
			'%s: %d חשיפות, %d לחיצות וואטסאפ, %d כניסות לפרופיל',
			get_the_title( $id ),
			$events['impression'] ?? 0,
			$events['click_wa'] ?? 0,
			$events['click_profile'] ?? 0
		);
	}

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice] דוח ביצועי כרטיסים לחודש ' . $month,
		"ביצועי הכרטיסים הממומנים בחודש שעבר, לפי עורך דין:\n\n" . implode( "\n", $lines ) . "\n\nהנתונים נאספים מחשיפות אמת (חצי כרטיס על המסך) ומלחיצות. אפשר לצרף את המספרים להצעת חידוש."
	);

	update_option( 'justice_cards_last_report', $month );
} );
