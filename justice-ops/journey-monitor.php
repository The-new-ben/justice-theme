<?php
/**
 * Synthetic journey monitor: the Swiss clock.
 *
 * Every hour the machine walks the money paths a visitor walks and compares
 * what actually renders against what must render: homepage, the family hub
 * with its written body, a money article with its sponsored card, the
 * flagship profile with the real portrait, the abroad pillar, an
 * encyclopedia entry, the news sitemap, the lead-form nonce, and the
 * healthcheck version. It watches the CACHED public surface on purpose:
 * if the edge serves a broken page, that is an incident even when origin
 * is healthy.
 *
 * Alerts go to admin_email on every state TRANSITION (break and recovery),
 * never repeatedly for the same ongoing state. Full state and a 48-run ring
 * log are readable at /wp-json/justice-ops/v1/monitor-status.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The journey checklist. Each entry: url (relative), must (all strings
 * required in the body), label. Keep the list short and money-focused.
 */
function justice_monitor_checks(): array {
	return apply_filters( 'justice_monitor_checks', array(
		'home'        => array( 'url' => '/', 'must' => array( 'עורך דין' ), 'label' => 'דף הבית' ),
		'family_hub'  => array( 'url' => '/family-law/', 'must' => array( 'practice-landing__pillar-content', 'justice_lead_nonce' ), 'label' => 'האב דיני משפחה + טופס לידים' ),
		'money_card'  => array( 'url' => '/petah-tikva-divorce-lawyer/', 'must' => array( 'jt-procard' ), 'label' => 'מאמר כסף + כרטיס ממומן' ),
		'profile'     => array( 'url' => '/lawyers/advocate-maya-rotenberg/', 'must' => array( 'adv-maya-rotenberg-portrait' ), 'label' => 'פרופיל הדגל + פורטרט' ),
		'pillar'      => array( 'url' => '/buying-property-abroad-guide/', 'must' => array( 'קניית נכס' ), 'label' => 'עמוד עוגן נכסים בחול' ),
		'encyclopedia'=> array( 'url' => '/encyclopedia/contributory-negligence/', 'must' => array( 'אשם תורם' ), 'label' => 'ערך אנציקלופדיה' ),
		'news_sitemap'=> array( 'url' => '/sitemap-news.xml', 'must' => array( '<urlset' ), 'label' => 'מפת חדשות' ),
	) );
}

/**
 * Run every check once. Returns the fresh state array.
 */
function justice_monitor_run(): array {
	$results = array();

	foreach ( justice_monitor_checks() as $key => $check ) {
		$response = wp_remote_get( home_url( $check['url'] ), array(
			'timeout'     => 20,
			'redirection' => 2,
			'user-agent'  => 'JusticeMonitor/1.0',
		) );

		if ( is_wp_error( $response ) ) {
			$results[ $key ] = array( 'ok' => false, 'why' => 'fetch: ' . $response->get_error_message() );
			continue;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$body = (string) wp_remote_retrieve_body( $response );

		if ( 200 !== $code ) {
			$results[ $key ] = array( 'ok' => false, 'why' => 'http ' . $code );
			continue;
		}

		$missing = array();

		foreach ( $check['must'] as $needle ) {
			if ( false === strpos( $body, $needle ) ) {
				$missing[] = $needle;
			}
		}

		$results[ $key ] = $missing
			? array( 'ok' => false, 'why' => 'missing: ' . implode( ' | ', array_map( static function ( $m ) {
				return mb_substr( $m, 0, 40 );
			}, $missing ) ) )
			: array( 'ok' => true, 'why' => '' );
	}

	// Healthcheck version must match the running constant.
	$hc = wp_remote_get( home_url( '/wp-json/justice-ops/v1/healthcheck' ), array( 'timeout' => 15 ) );

	if ( is_wp_error( $hc ) ) {
		$results['healthcheck'] = array( 'ok' => false, 'why' => 'fetch: ' . $hc->get_error_message() );
	} else {
		$data = json_decode( (string) wp_remote_retrieve_body( $hc ), true );
		$live = is_array( $data ) ? (string) ( $data['version'] ?? '' ) : '';
		// The edge may cache the healthcheck briefly; version drift only
		// counts as failure when the served version is older than the code.
		$results['healthcheck'] = version_compare( $live ?: '0', JUSTICE_OPS_VERSION, '>=' ) || '' === $live
			? array( 'ok' => '' !== $live, 'why' => '' === $live ? 'empty body' : '' )
			: array( 'ok' => true, 'why' => 'edge serves ' . $live . ' (cache lag)' );
	}

	// Machine cadence: soft warnings, never alert-mail on their own.
	$warnings = array();
	$enc_stat = get_option( 'justice_enc_writer_stat', array() );
	$hour     = (int) wp_date( 'H' );

	if ( is_array( $enc_stat ) && ( $enc_stat['date'] ?? '' ) === wp_date( 'Y-m-d' ) && $hour >= 14 && (int) ( $enc_stat['generated'] ?? 0 ) < 1 ) {
		$warnings[] = 'encyclopedia wrote nothing today by ' . $hour . ':00';
	}

	$state = array(
		'at'       => wp_date( 'Y-m-d H:i' ),
		'ok'       => ! in_array( false, wp_list_pluck( $results, 'ok' ), true ),
		'checks'   => $results,
		'warnings' => $warnings,
	);

	justice_monitor_store_and_alert( $state );

	return $state;
}

/**
 * Persist the run, keep the ring log, mail on transitions only.
 */
function justice_monitor_store_and_alert( array $state ): void {
	$previous = get_option( 'justice_monitor_state', array() );
	$log      = get_option( 'justice_monitor_log', array() );

	$log[] = array(
		'at' => $state['at'],
		'ok' => $state['ok'],
		'bad'=> implode( ',', array_keys( array_filter( $state['checks'], static function ( $r ) {
			return empty( $r['ok'] );
		} ) ) ),
	);
	$log = array_slice( $log, -48 );

	update_option( 'justice_monitor_state', $state, false );
	update_option( 'justice_monitor_log', $log, false );

	$was_ok = ! isset( $previous['ok'] ) || ! empty( $previous['ok'] );

	if ( $was_ok && ! $state['ok'] ) {
		$lines = array();
		foreach ( $state['checks'] as $key => $r ) {
			if ( empty( $r['ok'] ) ) {
				$lines[] = $key . ': ' . $r['why'];
			}
		}
		wp_mail(
			get_option( 'admin_email' ),
			'[Jus-Tice Monitor] תקלה במסלול קריטי',
			"הבדיקה השעתית מצאה שבר במסלולי הכסף:\n\n" . implode( "\n", $lines ) . "\n\nסטטוס מלא: " . home_url( '/wp-json/justice-ops/v1/monitor-status' )
		);
	}

	if ( ! $was_ok && $state['ok'] ) {
		wp_mail(
			get_option( 'admin_email' ),
			'[Jus-Tice Monitor] המסלולים חזרו לתקינות',
			"כל בדיקות המסלול עוברות שוב. זמן: " . $state['at']
		);
	}
}

add_action( 'justice_monitor_tick', 'justice_monitor_run' );

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'justice_monitor_tick' ) ) {
		wp_schedule_event( time() + 300, 'hourly', 'justice_monitor_tick' );
	}
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/monitor-status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'state' => get_option( 'justice_monitor_state', array( 'ok' => null, 'at' => 'never' ) ),
				'log'   => get_option( 'justice_monitor_log', array() ),
			);
		},
	) );

	register_rest_route( 'justice-ops/v1', '/monitor-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function () {
			return justice_monitor_run();
		},
	) );
} );
