<?php
/**
 * Owner cockpit: one screen with the whole business on it.
 *
 * Monitor state, lead flow and routed value, card performance, advertiser
 * roster with renewals, machine output counters and SERP experiments, as a
 * wp-admin page plus a cockpit-json endpoint for tooling.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_cockpit_data(): array {
	$monitor = get_option( 'justice_monitor_state', array() );

	$advertisers = array();
	foreach ( get_posts( array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'publish',
		'numberposts' => 50,
		'meta_query'  => array( array( 'key' => 'priority_score', 'value' => '0', 'compare' => '>' ) ),
	) ) as $adv ) {
		$advertisers[] = array(
			'id'     => $adv->ID,
			'name'   => get_the_title( $adv->ID ),
			'plan'   => (string) get_post_meta( $adv->ID, 'plan_type', true ),
			'score'  => (int) get_post_meta( $adv->ID, 'priority_score', true ),
			'renews' => (string) get_post_meta( $adv->ID, 'plan_renews_at', true ),
		);
	}

	$enc  = get_option( 'justice_enc_writer_stat', array() );
	$art  = get_option( 'justice_art_writer_stat', array() );
	$news = get_option( 'justice_news_stat', array() );

	$brain = get_option( 'jt_brain_stats', array() );

	$serp_active = 0;
	$serp_won    = 0;
	foreach ( (array) get_option( 'justice_serp_experiments', array() ) as $exp ) {
		if ( 'active' === ( $exp['status'] ?? '' ) ) { $serp_active++; }
		if ( 'won' === ( $exp['status'] ?? '' ) ) { $serp_won++; }
	}

	return array(
		'monitor'     => array( 'ok' => $monitor['ok'] ?? null, 'at' => $monitor['at'] ?? 'never', 'warnings' => $monitor['warnings'] ?? array() ),
		'cards_7d'    => function_exists( 'justice_cards_stats' ) ? justice_cards_stats( 7 ) : array(),
		'advertisers' => $advertisers,
		'machines'    => array( 'encyclopedia_today' => $enc, 'articles_today' => $art, 'news_today' => $news ),
		'serp'        => array( 'active' => $serp_active, 'won' => $serp_won ),
		'brain'       => $brain,
	);
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/cockpit-json', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => 'justice_cockpit_data',
	) );
} );

add_action( 'admin_menu', function () {
	add_menu_page( 'Justice Cockpit', 'Justice Cockpit', 'manage_options', 'justice-cockpit', function () {
		$d = justice_cockpit_data();
		$m = $d['monitor'];
		?>
		<div class="wrap">
			<h1>Justice Cockpit</h1>
			<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:16px 0">
				<div style="background:<?php echo $m['ok'] ? '#e8f7ee' : '#fdecec'; ?>;border-radius:12px;padding:16px">
					<strong>מסלולי הכסף</strong><br>
					<span style="font-size:22px;font-weight:800"><?php echo $m['ok'] ? 'תקינים' : 'שבר פעיל'; ?></span><br>
					<small>בדיקה אחרונה: <?php echo esc_html( (string) $m['at'] ); ?></small>
				</div>
				<div style="background:#f1f4fb;border-radius:12px;padding:16px">
					<strong>מפרסמים פעילים</strong><br>
					<span style="font-size:22px;font-weight:800"><?php echo count( $d['advertisers'] ); ?></span><br>
					<small><a href="<?php echo esc_url( admin_url( 'edit.php?post_type=justice_lawyer&page=justice-advertise' ) ); ?>">ניהול מנויים</a></small>
				</div>
				<div style="background:#f1f4fb;border-radius:12px;padding:16px">
					<strong>ניסויי כותרות</strong><br>
					<span style="font-size:22px;font-weight:800"><?php echo (int) $d['serp']['active']; ?> פעילים</span><br>
					<small><?php echo (int) $d['serp']['won']; ?> ניצחונות עד כה</small>
				</div>
			</div>

			<?php $ai = function_exists( 'justice_ai_health' ) ? justice_ai_health() : array(); ?>
			<h2>מנוע ה-AI: ספקים ומצב חי</h2>
			<p style="padding:10px 14px;border-radius:10px;background:<?php echo ! empty( $ai['ok'] ) ? '#e8f7ee' : '#fdecec'; ?>">
				מצב: <strong><?php echo esc_html( (string) ( $ai['state'] ?? '?' ) ); ?></strong>
				(ספק: <?php echo esc_html( (string) ( $ai['provider'] ?? '?' ) ); ?>)
				<?php if ( ! empty( $ai['reason'] ) ) : ?> | סיבה: <?php echo esc_html( (string) $ai['reason'] ); ?><?php endif; ?>
				| גיבוי מוגדר: <strong><?php echo ! empty( $ai['fallback_configured'] ) ? esc_html( (string) $ai['fallback_provider'] ) : 'לא'; ?></strong>
				| קריאות היום:
				<?php foreach ( (array) ( $ai['today']['providers'] ?? array() ) as $pname => $pc ) : ?>
					<?php echo esc_html( $pname ); ?> <?php echo (int) ( $pc['ok'] ?? 0 ); ?>/<?php echo (int) ( ( $pc['ok'] ?? 0 ) + ( $pc['fail'] ?? 0 ) ); ?>
				<?php endforeach; ?>
				| תקרה יומית: <?php echo (int) ( $ai['daily_cap'] ?? 0 ); ?>
			</p>

			<h2>המוח: בקרת איכות תוצרים (היום)</h2>
			<p>
				עברו את השופט: <strong><?php echo (int) ( $d['brain']['passes'] ?? 0 ); ?></strong> |
				תוקנו ועברו: <strong><?php echo (int) ( $d['brain']['refines'] ?? 0 ); ?></strong> |
				נפסלו: <strong><?php echo (int) ( $d['brain']['fails'] ?? 0 ); ?></strong> |
				דילוגים באחריות: <strong><?php echo (int) ( $d['brain']['skips'] ?? 0 ); ?></strong> |
				כותרות שנבחרו: <strong><?php echo (int) ( $d['brain']['titles'] ?? 0 ); ?></strong>
			</p>

			<h2>שוק הלידים (30 יום)</h2>
			<?php $ms = function_exists( 'justice_market_stats' ) ? justice_market_stats() : array(); ?>
			<p>
				פניות בשבוע האחרון: <strong><?php echo (int) ( $ms['leads_7d'] ?? 0 ); ?></strong> |
				זמן מענה חציוני: <strong><?php echo (int) ( $ms['median_resp_min'] ?? 0 ); ?> דקות</strong>
				(מדגם <?php echo (int) ( $ms['resp_sample'] ?? 0 ); ?>) |
				שאלות שפורסמו: <strong><?php echo (int) ( $ms['questions_pub'] ?? 0 ); ?></strong>
			</p>

			<h2>ביצועי כרטיסים, 7 ימים</h2>
			<table class="widefat striped" style="max-width:760px">
				<thead><tr><th>עורך דין</th><th>חשיפות</th><th>וואטסאפ</th><th>פרופיל</th></tr></thead>
				<tbody>
				<?php
				$rows = $d['cards_7d']['lawyers'] ?? array();
				if ( ! $rows ) {
					echo '<tr><td colspan="4">אין נתונים עדיין. הנתונים נאספים מרגע שהכרטיסים נצפים.</td></tr>';
				}
				foreach ( $rows as $row ) {
					echo '<tr><td>' . esc_html( $row['lawyer'] ) . '</td><td>' . (int) $row['impression'] . '</td><td>' . (int) $row['click_wa'] . '</td><td>' . (int) $row['click_profile'] . '</td></tr>';
				}
				?>
				</tbody>
			</table>

			<h2 style="margin-top:26px">מפרסמים</h2>
			<table class="widefat striped" style="max-width:760px">
				<thead><tr><th>שם</th><th>מסלול</th><th>ציון</th><th>חידוש</th></tr></thead>
				<tbody>
				<?php
				if ( ! $d['advertisers'] ) {
					echo '<tr><td colspan="4">אין מפרסמים משלמים עדיין. עמוד המכירה: ' . esc_url( home_url( '/advertise/' ) ) . '</td></tr>';
				}
				foreach ( $d['advertisers'] as $adv ) {
					echo '<tr><td>' . esc_html( $adv['name'] ) . '</td><td>' . esc_html( $adv['plan'] ) . '</td><td>' . (int) $adv['score'] . '</td><td>' . esc_html( $adv['renews'] ?: 'ידני' ) . '</td></tr>';
				}
				?>
				</tbody>
			</table>

			<h2 style="margin-top:26px">מכונות התוכן היום</h2>
			<p>
				אנציקלופדיה: <?php echo (int) ( $d['machines']['encyclopedia_today']['generated'] ?? 0 ); ?> נכתבו |
				מאמרים: <?php echo (int) ( $d['machines']['articles_today']['generated'] ?? 0 ); ?> |
				חדשות: <?php echo (int) ( $d['machines']['news_today']['generated'] ?? $d['machines']['news_today']['today']['generated'] ?? 0 ); ?>
			</p>
			<p><small>נתוני לידים מלאים: /wp-json/justice-ops/v1/leads-summary | סטטוס מלא: /wp-json/justice-ops/v1/monitor-status</small></p>
		</div>
		<?php
	}, 'dashicons-chart-area', 3.2 );
} );
