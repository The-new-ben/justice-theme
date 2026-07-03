<?php
/**
 * Plugin Name: Justice Ops
 * Description: Agent-operated delivery channel for jus-tice.co.il: healthcheck, self-updates from the Git repo, and ongoing site behavior shipped as reviewed code with zero manual clicks.
 * Version: 1.0.7
 * Author: Jus-Tice
 * Update URI: https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_OPS_VERSION' ) ) {
	define( 'JUSTICE_OPS_VERSION', '1.0.7' );
}

define( 'JUSTICE_OPS_MANIFEST', 'https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json' );

/**
 * Public healthcheck: what version of the ops plugin is live.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/healthcheck', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'plugin'   => 'justice-ops',
				'version'  => JUSTICE_OPS_VERSION,
				'marker'   => 'self-update-proof-v1',
				'time_utc' => gmdate( 'c' ),
			);
		},
	) );
} );

/**
 * Core-native self-update (WP 5.8+ Update URI protocol): WordPress asks
 * this filter for update info for our host, we read the Git manifest.
 * Cached 15 minutes; the agent's deploy route stays the instant path and
 * this keeps wp-admin updates and auto-updates working with no human.
 */
add_filter( 'update_plugins_raw.githubusercontent.com', function ( $update, $plugin_data, $plugin_file ) {
	if ( 'justice-ops/justice-ops.php' !== $plugin_file ) {
		return $update;
	}

	$manifest = get_transient( 'justice_ops_manifest_v1' );

	if ( ! is_array( $manifest ) ) {
		$response = wp_remote_get( JUSTICE_OPS_MANIFEST . '?nlcb=' . (int) ( time() / 900 ), array( 'timeout' => 8 ) );

		if ( is_wp_error( $response ) ) {
			return $update;
		}

		$manifest = json_decode( (string) wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $manifest ) || empty( $manifest['version'] ) || empty( $manifest['download_url'] ) ) {
			return $update;
		}

		set_transient( 'justice_ops_manifest_v1', $manifest, 15 * MINUTE_IN_SECONDS );
	}

	if ( version_compare( (string) $manifest['version'], JUSTICE_OPS_VERSION, '<=' ) ) {
		return $update;
	}

	return array(
		'id'      => 'justice-ops/justice-ops.php',
		'slug'    => 'justice-ops',
		'version' => (string) $manifest['version'],
		'url'     => isset( $manifest['homepage'] ) ? (string) $manifest['homepage'] : 'https://jus-tice.co.il/',
		'package' => (string) $manifest['download_url'] . '?nlcb=' . time(),
	);
}, 10, 3 );

/**
 * LawyerScout map: serve the public Mapbox token (pk scope, meant for
 * the browser; access control happens via URL restriction in the Mapbox
 * dashboard) from the justice_ops_mapbox_public_token option. The token
 * value lives only in the live database, never in this repo. The
 * theme's justice_theme_mapbox_public_token() consumes this filter; an
 * empty token keeps the whole map feature dark.
 */
add_filter( 'justice_theme_mapbox_public_token', function ( $token ) {
	if ( '' !== (string) $token ) {
		return $token;
	}

	return (string) get_option( 'justice_ops_mapbox_public_token', '' );
} );

/**
 * Theme bridge: instant fixes delivered ahead of the owner's next theme
 * pull, self-retiring once the theme reaches the version that carries the
 * same code natively. Covers the 2026-07-02 owner orders: no stock people
 * photos, fixed homepage lawyer cards, auto-loading RTL-correct light map.
 */
function justice_ops_theme_needs_bridge(): bool {
	return ! defined( 'JUSTICE_THEME_VERSION' ) || version_compare( JUSTICE_THEME_VERSION, '2.21.0', '<' );
}

/**
 * Until the theme carries the office logo natively (2.21.0), enrich the
 * map GeoJSON response with each lawyer's office_logo_id so the premium
 * flag cards can render logos today. The theme's transient stays
 * untouched; enrichment happens per response.
 */
add_filter( 'rest_request_after_callbacks', function ( $response, $handler, $request ) {
	if ( ! justice_ops_theme_needs_bridge() || ! ( $response instanceof WP_REST_Response ) ) {
		return $response;
	}

	if ( '/justice/v1/map/offices' !== $request->get_route() ) {
		return $response;
	}

	$data = $response->get_data();

	if ( ! is_array( $data ) || empty( $data['features'] ) || ! is_array( $data['features'] ) ) {
		return $response;
	}

	foreach ( $data['features'] as &$feature ) {
		if ( ! isset( $feature['properties']['kind'] ) || 'lawyer' !== $feature['properties']['kind'] ) {
			continue;
		}

		if ( ! empty( $feature['properties']['logo'] ) ) {
			continue;
		}

		$logo_id = (int) get_post_meta( (int) ( $feature['properties']['id'] ?? 0 ), 'office_logo_id', true );

		$feature['properties']['logo'] = $logo_id ? (string) wp_get_attachment_image_url( $logo_id, 'medium' ) : '';
	}
	unset( $feature );

	$response->set_data( $data );

	return $response;
}, 10, 3 );

add_filter( 'script_loader_src', function ( $src, $handle ) {
	if ( 'justice-legal-map' === $handle && justice_ops_theme_needs_bridge() ) {
		return plugins_url( 'assets/legal-map.js', __FILE__ ) . '?ver=' . JUSTICE_OPS_VERSION;
	}

	return $src;
}, 10, 2 );

add_action( 'wp_enqueue_scripts', function () {
	if ( justice_ops_theme_needs_bridge() ) {
		wp_enqueue_style( 'justice-ops-bridge', plugins_url( 'assets/theme-bridge.css', __FILE__ ), array(), JUSTICE_OPS_VERSION );
	}
}, 60 );

/**
 * SEO bridge: the 2026-07-02 SERP strikes (directory family + divorce
 * head term), live ahead of the theme pull that carries them natively
 * in inc/seo.php. Self-retires at theme 2.21.2. The directory H1 is a
 * template variable and cannot be bridged; title, meta description,
 * singular H1 and intro paragraphs can.
 */
function justice_ops_seo_bridge_active(): bool {
	return ! defined( 'JUSTICE_THEME_VERSION' ) || version_compare( JUSTICE_THEME_VERSION, '2.21.2', '<' );
}

function justice_ops_seo_overrides(): array {
	return array(
		'divorce-lawyer' => array(
			'seo_title'   => 'עורך דין גירושין: ליווי בהסכמה, בסכסוך ובגישור | Jus-Tice',
			'title'       => 'עורך דין גירושין: ליווי בהסכמה ובסכסוך, משמורת, מזונות ורכוש',
			'description' => 'עורך דין גירושין: מתי צריך ליווי משפטי, איך מתנהל הליך בהסכמה מול סכסוך, משמורת, מזונות ורכוש, ומה בודקים לפני בחירת ייצוג. פנייה מסודרת בלי עלות.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין גירושין</strong> מלווה אתכם ברגע שבו החוק, הרגש והכסף נפגשים: גירושין בהסכמה או בסכסוך, משמורת ילדים, מזונות, חלוקת רכוש והסכם גירושין, בבתי המשפט לענייני משפחה ובבתי הדין הרבניים. בעמוד הזה תמצאו את המסלול המלא צעד אחר צעד: מה בודקים לפני בחירת ייצוג, ממה מורכבת העלות, ואיך פונים לעורך דין דיני משפחה מאומת בלי עלות ובלי התחייבות.</p>',
		),
		'trusted-divorce-attorney-guide' => array(
			'seo_title'   => 'עורך דין גירושין מומלץ: בדיקת מוניטין וניסיון | Jus-Tice',
			'title'       => 'עורך דין גירושין מומלץ: בדיקת מוניטין, ניסיון והמלצות',
			'description' => 'איך מזהים עורך דין גירושין מומלץ באמת: בדיקת ניסיון בתיקי משפחה, מוניטין שאפשר לאמת, המלצות של לקוחות ושאלות שחושפות התאמה לפני שסוגרים ייצוג.',
			'intro'       => '<p style="text-align: justify;"><strong>עורך דין גירושין מומלץ</strong> לא מזהים לפי סיסמאות אלא לפי עובדות: ניסיון אמיתי בתיקי משפחה וגירושין, מוניטין שאפשר לאמת, המלצות של לקוחות אמיתיים ותשובות ברורות בשיחה הראשונה. במדריך שלפניכם עוברים על הבדיקות האלה שלב אחרי שלב, עד לבחירה בטוחה.</p>',
		),
		'lawyer-divorce-guide-proceedings-costs-rights' => array(
			'seo_title'   => 'זכויות בהליך גירושין וייצוג משפטי: המדריך המלא | Jus-Tice',
			'title'       => 'זכויות בהליך גירושין וייצוג משפטי: המדריך המלא',
			'description' => 'המדריך לזכויות בהליך גירושין: מזונות, משמורת, חלוקת רכוש וכתובה, איך מתנהל ההליך בבית המשפט לענייני משפחה ובבית הדין הרבני, ומתי נדרש ייצוג.',
		),
		'how-to-find-qualified-lawyer-israel-guide' => array(
			'seo_title'   => 'איך לבחור עורך דין: בדיקות חובה לפני שסוגרים | Jus-Tice',
			'title'       => 'איך לבחור עורך דין: בדיקות חובה לפני שסוגרים ייצוג',
			'description' => 'מדריך לבחירת עורך דין: בדיקת רישיון בלשכת עורכי הדין, ניסיון בתחום, שכר טרחה והתאמה אישית, ומה לשאול בשיחה הראשונה לפני חתימה על ייצוג, בלי התחייבות.',
		),
	);
}

function justice_ops_current_seo_override(): array {
	if ( ! is_singular() ) {
		return array();
	}

	$post = get_post();

	if ( ! $post ) {
		return array();
	}

	$map = justice_ops_seo_overrides();

	return $map[ $post->post_name ] ?? array();
}

function justice_ops_is_plain_lawyer_directory(): bool {
	return ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) )
		&& empty( $_GET['city'] ) && empty( $_GET['area'] );
}

add_filter( 'pre_get_document_title', function ( $title ) {
	if ( ! justice_ops_seo_bridge_active() ) {
		return $title;
	}

	$override = justice_ops_current_seo_override();

	if ( ! empty( $override['seo_title'] ) ) {
		return $override['seo_title'];
	}

	if ( justice_ops_is_plain_lawyer_directory() ) {
		return 'חיפוש עורך דין לפי שם, תחום ועיר | אינדקס Jus-Tice';
	}

	return $title;
}, 99 );

add_filter( 'wpseo_title', function ( $title ) {
	if ( ! justice_ops_seo_bridge_active() ) {
		return $title;
	}

	$override = justice_ops_current_seo_override();

	if ( ! empty( $override['seo_title'] ) ) {
		return $override['seo_title'];
	}

	if ( justice_ops_is_plain_lawyer_directory() ) {
		return 'חיפוש עורך דין לפי שם, תחום ועיר | אינדקס Jus-Tice';
	}

	return $title;
}, 99 );

add_filter( 'wpseo_metadesc', function ( $desc ) {
	if ( ! justice_ops_seo_bridge_active() ) {
		return $desc;
	}

	$override = justice_ops_current_seo_override();

	if ( ! empty( $override['description'] ) ) {
		return $override['description'];
	}

	if ( justice_ops_is_plain_lawyer_directory() ) {
		return 'מאגר עורכי דין בישראל בחינם: חיפוש לפי שם, תחום התמחות, עיר או מספר רישיון. פרופילים מאומתים עם ניסיון, תחומי עיסוק ודרכי קשר, ללא עלות וללא הרשמה.';
	}

	return $desc;
}, 99 );

add_filter( 'the_title', function ( $title, $post_id = 0 ) {
	if ( ! justice_ops_seo_bridge_active() || ! in_the_loop() || ! is_singular() || get_queried_object_id() !== (int) $post_id ) {
		return $title;
	}

	$override = justice_ops_current_seo_override();

	return ! empty( $override['title'] ) ? $override['title'] : $title;
}, 99, 2 );

add_filter( 'the_content', function ( $content ) {
	if ( ! justice_ops_seo_bridge_active() || ! is_singular() || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$override = justice_ops_current_seo_override();

	if ( empty( $override['intro'] ) || false !== strpos( $content, 'justice-ops-intro' ) ) {
		return $content;
	}

	return '<div class="justice-ops-intro">' . $override['intro'] . '</div>' . $content;
}, 6 );

/**
 * Render hygiene on singular content: body copy must never carry its own
 * H1 (the template owns the single H1), and the strike pages must not
 * render en or em dashes (owner law). DB cleanup follows separately;
 * this keeps the rendered page correct today.
 */
add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular() || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$content = preg_replace( '/<h1(\s[^>]*)?>/i', '<h2$1>', $content );
	$content = str_ireplace( '</h1>', '</h2>', $content );

	if ( justice_ops_seo_bridge_active() && justice_ops_current_seo_override() ) {
		$content = str_replace( array( " \xE2\x80\x93 ", " \xE2\x80\x94 " ), ', ', $content );
		$content = str_replace( array( "\xE2\x80\x93", "\xE2\x80\x94" ), ',', $content );
	}

	return $content;
}, 7 );

/**
 * Purge every cache layer this site runs, after our own upgrade completes.
 */
add_action( 'upgrader_process_complete', function ( $upgrader, $options ) {
	if ( empty( $options['type'] ) || 'plugin' !== $options['type'] ) {
		return;
	}

	if ( class_exists( 'autoptimizeCache' ) ) { autoptimizeCache::clearall(); }
	if ( function_exists( 'sg_cachepress_purge_cache' ) ) { sg_cachepress_purge_cache(); }
	if ( class_exists( 'SiteGround_Optimizer\\Supercacher\\Supercacher' ) ) {
		SiteGround_Optimizer\Supercacher\Supercacher::purge_cache();
	}
	wp_cache_flush();
}, 10, 2 );
