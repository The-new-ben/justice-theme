<?php
/**
 * Plugin Name: Justice Ops
 * Description: Agent-operated delivery channel for jus-tice.co.il: healthcheck, self-updates from the Git repo, and ongoing site behavior shipped as reviewed code with zero manual clicks.
 * Version: 2.37.14
 * Author: Jus-Tice
 * Update URI: https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_OPS_VERSION' ) ) {
	define( 'JUSTICE_OPS_VERSION', '2.37.14' );
}

define( 'JUSTICE_OPS_MANIFEST', 'https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json' );

// 2026-09-03 owner order "zero friction": the plugin loads ONLY protection,
// registration, the lead path and the page tools. Every other module stays in
// the repo but is not loaded. Removed from load: ai-brain, ai-desk, ai-engine,
// ai-surfaces, card-analytics, city-practice, cockpit, comparison-content-reset,
// content-first-order, country/criminal/family/real-estate-content-release,
// criminal-map, cyprus-content-bridge, encyclopedia-writer, firm-match-strip,
// hfcm-legacy-card-retirement, homepage-pro, intake-brain, journey-monitor,
// lawyer-index-import, legacy-redirects, map-cinema, map-feed-v3, map-places,
// market-science, maya-profile-release, news-engine, publish-notify, qa-engine,
// reader-ux, reviews-engine, serp-machine, tools-discovery.
// Phase-1 freeze guard (fail-closed for any generator).
require_once __DIR__ . '/content-freeze.php';

// Update safety: native auto-update control plane.
require_once __DIR__ . '/release-update-control.php';

// Neutral stubs for functions of unloaded modules.
require_once __DIR__ . '/compat-stubs.php';

// Owner rule: no content redirects. WordPress old-slug and 404-guess redirects disabled.
require_once __DIR__ . '/redirects-off.php';

// Cleanup 2026-09 status route + cron clearing.
require_once __DIR__ . '/cleanup-2026-09.php';

// Protection: no "legally reviewed by" claims anywhere.
require_once __DIR__ . '/review-claims-off.php';

// Titles: database is the single source of truth (non-per-post behavior only).
require_once __DIR__ . '/title-authority.php';

// Titles: keep the server title stable.
require_once __DIR__ . '/title-stability.php';

// Practice hubs render correctly + sitewide WhatsApp lead button.
require_once __DIR__ . '/practice-polish.php';

// Internal links from pillars to the money pages.
require_once __DIR__ . '/seo-hierarchy.php';

// Sponsored lawyer cards (what advertisers pay for).
require_once __DIR__ . '/professional-cards.php';

// Advertiser registration funnel (/advertise/).
require_once __DIR__ . '/advertise.php';

// Leads reach the paying lawyer with a billing trail.
require_once __DIR__ . '/lead-router.php';

// Appointment booking + criminal emergency strip.
require_once __DIR__ . '/scheduler.php';

// Legal calculators (pages with demand).
require_once __DIR__ . '/calculators.php';

// Document generators (pages with demand).
require_once __DIR__ . '/doc-generators.php';

// Rent agreement builder (/online-rent-agreement/, money page).
require_once __DIR__ . '/rent-gen.php';

// Divorce agreement generator (/free-divorce-agreement-template/, money page).
require_once __DIR__ . '/divorce-gen.php';

// Malpractice claim checker (embedded app on a money page).
require_once __DIR__ . '/malpractice-checker.php';

// HADMAIA courtroom simulation embed at /legal-simulation/.
require_once __DIR__ . '/simulation-embed.php';

// Premium visual bridge while the theme Git pull is repaired.
require_once __DIR__ . '/new-look-bridge.php';

// 301 layer for the deleted 2025 winners + the /posta/ refocus (2026-09-07).
require_once __DIR__ . '/legacy-2025-redirects.php';
require_once __DIR__ . '/posta-refocus.php';

// The legal entity network: wave-seeded reference pages (2026-09-07).
require_once __DIR__ . '/legal-entities.php';

// Hadmaia product handoff: simulation product intent reaches the lead path.
require_once __DIR__ . '/hadmaia-professional-review.php';


/**
 * Public healthcheck: what version of the ops plugin is live.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/healthcheck', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'plugin'                   => 'justice-ops',
				'version'                  => JUSTICE_OPS_VERSION,
				'marker'                   => 'seo-recovery-phase1-freeze-v1',
				'automatic_content_paused' => justice_ops_automatic_content_paused(),
				'time_utc'                 => gmdate( 'c' ),
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

		$lawyer_id = (int) ( $feature['properties']['id'] ?? 0 );

		if ( empty( $feature['properties']['logo'] ) ) {
			$logo_id = (int) get_post_meta( $lawyer_id, 'office_logo_id', true );

			$feature['properties']['logo'] = $logo_id ? (string) wp_get_attachment_image_url( $logo_id, 'medium' ) : '';
		}
	}
	unset( $feature );

	$response->set_data( $data );

	return $response;
}, 10, 3 );


/**
 * Cinematic map enrichment, ALWAYS on (the logo bridge above self-retires
 * with the theme, this must not): premium flag from the same rules as the
 * cards, profile url, portrait, WhatsApp for premium.
 */
add_filter( 'rest_request_after_callbacks', function ( $response, $handler, $request ) {
	if ( ! ( $response instanceof WP_REST_Response ) || '/justice/v1/map/offices' !== $request->get_route() ) {
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

		$lawyer_id = (int) ( $feature['properties']['id'] ?? 0 );
		$score     = (int) get_post_meta( $lawyer_id, 'priority_score', true );
		$approved  = function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			? justice_theme_lawyer_profile_is_public_approved( $lawyer_id )
			: false;

		$feature['properties']['premium'] = ( $score > 0 && $approved );
		$feature['properties']['url']     = get_permalink( $lawyer_id );

		if ( $feature['properties']['premium'] ) {
			$portrait = function_exists( 'justice_cards_avatar_src' ) ? justice_cards_avatar_src( $lawyer_id ) : null;

			if ( $portrait ) {
				$feature['properties']['photo'] = $portrait['src'];
			}

			$feature['properties']['wa'] = 'https://wa.me/972525101555?text=' . rawurlencode( 'שלום, ראיתי את ' . wp_specialchars_decode( get_the_title( $lawyer_id ), ENT_QUOTES ) . ' במפת עורכי הדין ואשמח לשוחח.' );
		}
	}
	unset( $feature );

	$response->set_data( $data );

	return $response;
}, 11, 3 );

add_filter( 'script_loader_src', function ( $src, $handle ) {
	if ( 'justice-legal-map' === $handle && justice_ops_theme_needs_bridge() ) {
		return plugins_url( 'assets/legal-map.js', __FILE__ ) . '?ver=' . JUSTICE_OPS_VERSION;
	}

	return $src;
}, 10, 2 );

add_action( 'wp_enqueue_scripts', function () {
	if ( justice_ops_seo_bridge_active() ) {
		wp_enqueue_style( 'justice-ops-bridge', plugins_url( 'assets/theme-bridge.css', __FILE__ ), array(), JUSTICE_OPS_VERSION );
	}

	// Rendered-relevancy layer (google-god-mode, 2026-07-14): restores the
	// dark hero/CTA backgrounds the redesign's `.section{background:transparent}`
	// killed, fixes the checker heading contrast, gives mobile tables scroll.
	// Loads after every theme sheet; identical rules live at the end of the
	// theme's redesign.css awaiting the owner pull.
	wp_enqueue_style( 'justice-ops-relevance', plugins_url( 'assets/relevance-fixes.css', __FILE__ ), array(), JUSTICE_OPS_VERSION );
}, 60 );

add_action( 'template_redirect', function () {
	if ( is_admin() || ! is_front_page() ) {
		return;
	}

	ob_start( function ( $html ) {
		return str_replace(
			array(
				'כרטיס לא פעיל',
				'פרטים בסיסיים מוצגים בזהירות, בלי עובדות לימודים, ניסיון או תמונה שלא נבדקו.',
				'ביקורות, מדיה ותוכן מקצועי נכנסים רק אחרי מקור ברור ואישור מתאים.',
				'עורכי דין ואנשי מקצוע ✓ פרופילים נבדקים לפני הצגה ✓ ללא הבטחת תוצאה או דירוג ✓ שקיפות מלאה לגבי שיתופי פעולה ומסלולים בתשלום',
				'href="#" id="ai-sim-continue"',
			),
			array(
				'פרופיל בסיסי',
				'פרטים בסיסיים מוצגים בצורה תמציתית, עם דגש על תחום, אזור ודרך יצירת קשר.',
				'פרופיל מורחב יכול לכלול ביקורות, מדיה ותוכן מקצועי שמחזקים אמון.',
				'עורכי דין ואנשי מקצוע ✓ פרטים לפי תחום ואזור ✓ ללא הבטחת תוצאה או דירוג ✓ שקיפות מלאה לגבי שיתופי פעולה ומסלולים בתשלום',
				'href="/legal-simulation/?utm_source=homepage&amp;utm_medium=ai_center&amp;utm_campaign=court_arena_continue" id="ai-sim-continue"',
			),
			$html
		);
	} );
}, 0 );

// CC BY-SA 2.0 attribution for the homepage hero photograph (Ted Eytan,
// "Tel Aviv from the Air", via Wikimedia Commons). License requires
// visible credit; rendered small inside the hero on the homepage only.
// The credit MUST match the image relevance-fixes.css actually displays.
add_action( 'wp_footer', function () {
	if ( ! is_front_page() ) {
		return;
	}

	echo '<style>.jt2-hero{position:relative}</style>';
	echo '<script>(function(){var h=document.querySelector(".jt2-hero");if(!h)return;var c=document.createElement("span");c.className="jt2-hero__credit";c.textContent="צילום: Ted Eytan · CC BY-SA 2.0";h.appendChild(c);})();</script>';
} );

/**
 * SEO bridge: the 2026-07-02 SERP strikes (directory family + divorce
 * head term), live ahead of the theme pull that carries them natively
 * in inc/seo.php. Self-retires at theme 2.21.2. The directory H1 is a
 * template variable and cannot be bridged; title, meta description,
 * singular H1 and intro paragraphs can.
 */
function justice_ops_seo_bridge_active(): bool {
	// Wave 0 (2026-07-13): permanently off. The theme passed 2.22.0 long ago
	// and the DB is now the single source of truth for titles and meta.
	return false;
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
		'criminal-lawyers-rating' => array(
			'title'       => 'דירוג עורכי דין פליליים בישראל: קריטריונים, השוואה ובחירה',
			'seo_title'   => 'דירוג עורכי דין פליליים בישראל: קריטריונים והשוואה | Jus-Tice',
			'description' => 'דירוג עורכי דין פליליים לפי קריטריונים שקופים: אימות רישיון, ביקורות מאומתות, זמינות ושכר טרחה. איך בוחרים ייצוג פלילי נכון ומה בודקים לפני שסוגרים.',
		),
		'types-of-lawyers-small-business' => array(
			'title'       => 'עורך דין עסקי לעסקים קטנים: מתי צריך ומה בודקים',
			'seo_title'   => 'עורך דין עסקי ולעסקים קטנים: מתי צריך ומה בודקים | Jus-Tice',
			'description' => 'עורך דין עסקי לעסק קטן: הקמה, חוזים עסקיים, שותפויות, עובדים וגבייה. מתי חובה ליווי משפטי, מה בודקים לפני בחירה וכמה זה עולה בפועל.',
		),
		'usa-lawyers' => array(
			'title'       => 'עורך דין בארצות הברית לישראלים: איתור וייצוג',
			'seo_title'   => 'עורך דין בארצות הברית לישראלים: איתור וייצוג | Jus-Tice',
			'description' => 'עורך דין בארצות הברית: איתור ייצוג לישראלים לפי מדינה ותחום, נדל"ן, הגירה, עסקים וירושה בארה"ב, ומה בודקים לפני שסוגרים ייצוג מעבר לים.',
		),
		'choose-usa-attorney' => array(
			'title'       => 'איך בוחרים עורך דין בארה"ב: רישוי, שכר טרחה ובדיקות',
			'seo_title'   => 'איך בוחרים עורך דין בארה"ב: רישוי ושכר טרחה | Jus-Tice',
			'description' => 'בחירת עורך דין בארה"ב: בדיקת רישוי לפי מדינה, שכר טרחה מקובל, ניסיון בתחום הנדרש ושאלות חובה לפני חתימה, מדריך מעשי לישראלים.',
		),
		'buy-real-estate-cyprus' => array(
			'title'       => 'קניית דירה בקפריסין: מחירים, מיסים וליווי משפטי',
			'seo_title'   => 'קניית דירה בקפריסין: מחירים, מיסים וליווי משפטי | Jus-Tice',
			'description' => 'קניית דירה בקפריסין לישראלים: מחירים לפי אזור, מס רכישה, בדיקות בעלות, שלבי העסקה ומתי חובה עורך דין מקומי. מדריך מעשי לפני השקעה.',
		),
		'about-cyprus' => array(
			'title'       => 'עורך דין בקפריסין לישראלים: נדל"ן, חברות ומיסוי',
			'seo_title'   => 'עורך דין קפריסין: ליווי ישראלים בנדל"ן ומיסוי | Jus-Tice',
			'description' => 'עורך דין בקפריסין לישראלים: ליווי בקניית נכס, פתיחת חברה, מיסוי והליכים מקומיים. מה ההבדל בין עורך דין ישראלי למקומי ומתי צריך את שניהם.',
		),
		'greece-price-list' => array(
			'title'       => 'מחירי נדל"ן ביוון לפי אזורים: טבלת מחירים מעודכנת',
			'seo_title'   => 'מחירי נדל"ן ביוון לפי אזורים: טבלה מעודכנת | Jus-Tice',
			'description' => 'מחירי נדל"ן ביוון: טבלת מחירים לפי אזור, אתונה, סלוניקי והאיים, עלויות נלוות, מיסים ושכר טרחה משפטי. נתונים מעודכנים לישראלים לפני קנייה.',
		),
		'investing-in-greece-real-estate' => array(
			'title'       => 'השקעות נדל"ן ביוון: תשואות, אזורים וסיכונים',
			'seo_title'   => 'השקעות נדל"ן ביוון: תשואות, אזורים וסיכונים | Jus-Tice',
			'description' => 'השקעות נדל"ן ביוון לישראלים: תשואות לפי אזור, מס רכישה ומס שבח מקומי, מלכודות נפוצות בעסקאות, ומה בודק עורך דין לפני חתימה על נכס ביוון.',
		),
		'drug-trafficking' => array(
			'title'       => 'עורך דין סחר בסמים: עונשים, הגנות וייצוג בהליך',
			'seo_title'   => 'עורך דין סחר בסמים: עונשים, הגנות וייצוג | Jus-Tice',
			'description' => 'עורך דין סחר בסמים: מתח הענישה בחוק, ההבדל בין החזקה לסחר, הגנות אפשריות, שחרור ממעצר ומה קריטי לעשות מיד אחרי חקירה או מעצר.',
		),
		'famous-criminal-defense-lawyer' => array(
			'title'       => 'עורכי דין פליליים מפורסמים בישראל: התיקים הגדולים',
			'seo_title'   => 'עורכי דין פליליים מפורסמים בישראל: התיקים | Jus-Tice',
			'description' => 'עורכי הדין הפליליים המפורסמים בישראל והתיקים שעשו להם שם: פרשות מרכזיות, דרכי הגנה שנכנסו לפסיקה ומה אפשר ללמוד מהם על בחירת ייצוג.',
		),
		'medical-malpractice-lawyer' => array(
			'title'       => 'עורך דין רשלנות רפואית: בדיקת תיק, הוכחות ופיצויים',
			'seo_title'   => 'עורך דין רשלנות רפואית: בדיקת תיק ופיצויים | Jus-Tice',
			'description' => 'עורך דין רשלנות רפואית: מתי יש עילה לתביעה, איך מוכיחים התרשלות וקשר סיבתי, לידה, ניתוח והרדמה, שכר טרחה באחוזים ומה עושים קודם.',
		),
		'anesthesia-medical-malpractice' => array(
			'title'       => 'רשלנות רפואית בהרדמה: מקרים, אחריות ופיצויים',
			'seo_title'   => 'רשלנות רפואית בהרדמה: מקרים, אחריות ופיצויים | Jus-Tice',
			'description' => 'רשלנות רפואית בהרדמה: מקרים מוכרים בפסיקה, חובות הרופא המרדים, איך מוכיחים התרשלות ומה גובה הפיצויים, ומתי כדאי לבדוק תיק עם עורך דין.',
		),
		'low-value-invest-abroad' => array(
			'title'       => 'דירות להשקעה בחו"ל: איפה כדאי לקנות ובאיזה תקציב',
			'seo_title'   => 'דירות להשקעה בחו"ל: איפה כדאי ובאיזה תקציב | Jus-Tice',
			'description' => 'דירות להשקעה בחו"ל בתקציב נמוך: יוון, קפריסין ומזרח אירופה, תשואות, מיסים, סיכונים משפטיים ומה חובה לבדוק עם עורך דין לפני העברת כסף.',
		),
		'real-estate-lawyer-guide' => array(
			'title'       => 'ליווי משפטי בעסקת נדל"ן: שלבים, רישום ומיסוי',
			'seo_title'   => 'ליווי משפטי בעסקת נדל"ן: שלבים, רישום ומיסוי | Jus-Tice',
			'description' => 'ליווי משפטי בעסקת נדל"ן משלב ההצעה עד רישום הזכויות: בדיקות מקדימות, חוזה מכר, מיסוי מקרקעין, טאבו ומה עורך הדין בודק בכל שלב.',
		),
		'about-usa' => array(
			'title'       => 'ארצות הברית: מדינות, אוכלוסייה, אשרות ומשפט לישראלים',
			'seo_title'   => 'ארצות הברית: מדינות, אשרות ומשפט לישראלים | Jus-Tice',
			'description' => 'מדריך ארצות הברית לישראלים: כמה מדינות ותושבים, אשרות כניסה ועבודה, מערכת המשפט האמריקאית ומתי צריך עורך דין מקומי לפי מדינה.',
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
		return 'חיפוש עורך דין לפי שם, תחום ועיר | Jus-Tice';
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
		return 'חיפוש עורך דין לפי שם, תחום ועיר | Jus-Tice';
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
		return 'חיפוש עורך דין בישראל בחינם: לפי שם, תחום התמחות, עיר או מספר רישיון. פרופילים עם ניסיון, תחומי עיסוק ודרכי קשר, ללא עלות וללא הרשמה.';
	}

	return $desc;
}, 99 );

add_filter( 'the_title', function ( $title, $post_id = 0 ) {
	if ( ! justice_ops_seo_bridge_active() || ! is_singular() || get_queried_object_id() !== (int) $post_id ) {
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
}, 99 );

/**
 * Surface bridge: the theme 2.22.0 homepage money-hubs band and the
 * directory H1, injected into the rendered output until the theme pull
 * lands them natively. Pure string operations on two known views only.
 */
function justice_ops_money_hubs_html(): string {
	$hubs = array(
		array( 'עורך דין גירושין', 'הסכמה, סכסוך, משמורת ורכוש', 'divorce-lawyer' ),
		array( 'עורך דין פלילי', 'חקירה, מעצר וכתב אישום', 'criminal-defense-attorney' ),
		array( 'דירוג עורכי דין פליליים', 'קריטריונים שקופים והשוואה', 'criminal-lawyers-rating' ),
		array( 'עורך דין מקרקעין', 'קנייה, מכירה ומיסוי דירה', 'real-estate-attorney' ),
		array( 'עורך דין רשלנות רפואית', 'בדיקת תיק והוכחת התרשלות', 'medical-malpractice-lawyer' ),
		array( 'עורך דין תעבורה', 'שלילה, נקודות ושכרות', 'traffic-lawyer' ),
		array( 'עורך דין דיני עבודה', 'פיטורים, שימוע וזכויות', 'labor-lawyer' ),
		array( 'עורך דין ירושה וצוואות', 'צו ירושה והתנגדויות', 'inheritance-lawyer' ),
		array( 'עורך דין עסקי לעסקים קטנים', 'הקמה, חוזים ושותפויות', 'types-of-lawyers-small-business' ),
		array( 'עורך דין עבירות סמים', 'החזקה, שימוש וסחר', 'drug-related-crime' ),
		array( 'עורך דין בארצות הברית', 'ייצוג ישראלים בארה"ב', 'usa-lawyers' ),
		array( 'קניית דירה בקפריסין', 'מחירים, מיסים וליווי משפטי', 'buy-real-estate-cyprus' ),
		array( 'השקעות נדל"ן ביוון', 'תשואות, אזורים וסיכונים', 'investing-in-greece-real-estate' ),
	);

	$cards = '';

	foreach ( $hubs as $hub ) {
		$post = get_page_by_path( $hub[2], OBJECT, array( 'page', 'post', 'articles' ) );

		if ( ! $post || 'publish' !== $post->post_status ) {
			continue;
		}

		$url = function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $post->ID ) : get_permalink( $post );
		$cards .= '<a class="money-hubs__card" href="' . esc_url( $url ) . '"><strong>' . esc_html( $hub[0] ) . '</strong><span>' . esc_html( $hub[1] ) . '</span></a>';
	}

	if ( '' === $cards ) {
		return '';
	}

	return '<section class="jt2-section money-hubs" aria-label="תחומי המשפט המבוקשים ביותר"><div class="container">'
		. '<div class="section-header"><p class="section-header__eyebrow">המדריכים המבוקשים עכשיו</p>'
		. '<h2>תחומי המשפט שהכי מחפשים בישראל</h2></div>'
		. '<div class="money-hubs__grid">' . $cards . '</div></div></section>';
}

add_action( 'template_redirect', function () {
	if ( ! justice_ops_seo_bridge_active() ) {
		return;
	}

	if ( is_front_page() ) {
		ob_start( function ( $html ) {
			if ( false !== strpos( $html, 'money-hubs__grid' ) ) {
				return $html;
			}

			$marker = '<section class="featured-lawyers section"';
			$pos    = strpos( $html, $marker );

			return false === $pos ? $html : substr_replace( $html, justice_ops_money_hubs_html(), $pos, 0 );
		} );

		return;
	}

	if ( is_post_type_archive( 'justice_lawyer' ) || is_page( 'lawyers' ) ) {
		ob_start( function ( $html ) {
			return str_replace( '>מדריך עורכי דין בישראל</h1>', '>חיפוש עורך דין לפי שם, תחום ועיר</h1>', $html );
		} );
	}
} );

/**
 * Purge every cache layer this site runs, after our own upgrade completes.
 */
add_action( 'upgrader_process_complete', function ( $upgrader, $options ) {
	if ( empty( $options['type'] ) || 'plugin' !== $options['type'] ) {
		return;
	}

	// Deliberately NOT autoptimizeCache::clearall(): wiping aggregates
	// breaks edge-cached HTML that still links the old files. Autoptimize
	// generates a new aggregate on demand; old ones stay valid on disk.
	if ( function_exists( 'sg_cachepress_purge_cache' ) ) { sg_cachepress_purge_cache(); }
	if ( class_exists( 'SiteGround_Optimizer\\Supercacher\\Supercacher' ) ) {
		SiteGround_Optimizer\Supercacher\Supercacher::purge_cache();
	}
	wp_cache_flush();
}, 10, 2 );
