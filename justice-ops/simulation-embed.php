<?php
/**
 * The courtroom simulation, embedded for real. The owner's second
 * product (the React platform on jus-tice.com) ships HADMAIA, an
 * agentic conference-style courtroom simulation with AI characters,
 * live debate, Hebrew and English, and a purpose-built embed mode
 * (?embed=1 hides all chrome, no frame-blocking headers, anonymous
 * access, a baked model key verified in the deployed bundle).
 *
 * Until now the WordPress site only LINKED to one recorded channel from
 * the tools strip. This module gives the simulation a real home page,
 * /legal-simulation/, with the arena embedded chrome-less and full
 * height, framed by honest Hebrew copy and routed into the site's money
 * mesh. The iframe is direct (no external embed.js dependency), so
 * Autoptimize and script-defer plugins cannot break it.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JUSTICE_SIM_ARENA_URL = 'https://jus-tice.com/#/hadmaia?embed=1&domain=legal&host=https%3A%2F%2Fjus-tice.co.il';

add_shortcode( 'justice_arena_embed', function () {
	return '<div class="jt-sim__wrap">'
		. '<iframe class="jt-sim__frame" src="' . esc_url( JUSTICE_SIM_ARENA_URL ) . '"'
		. ' title="הדמיה משפטית אינטראקטיבית: זירת סימולציה עם דמויות AI"'
		. ' allow="microphone; camera; autoplay; clipboard-write"'
		. ' loading="eager" referrerpolicy="origin"></iframe>'
		. '<p class="jt-sim__note">ההדמיה נוצרת בעזרת בינה מלאכותית והיא כלי התנסות ולימוד בלבד, לא ייעוץ משפטי ולא שחזור של תיק אמיתי. אפשר לפתוח אותה גם במסך מלא: '
		. '<a href="https://jus-tice.com/#/hadmaia" target="_blank" rel="noopener">jus-tice.com</a></p>'
		. '</div>';
} );

add_action( 'wp_head', function () {
	if ( false === strpos( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 'legal-simulation' ) ) {
		return;
	}

	echo '<style id="jt-sim-css">'
		. '.jt-sim__wrap{margin:26px 0}'
		. '.jt-sim__frame{width:100%;height:min(82vh,900px);border:1px solid #dbe3f0;border-radius:16px;background:#0f1e3d;box-shadow:0 24px 50px -28px rgba(10,18,38,.5)}'
		. '.jt-sim__note{font-size:13px;color:#5b6780;margin-top:10px}'
		. '@media (max-width:768px){.jt-sim__frame{height:78vh;border-radius:12px}}'
		. '</style>';
}, 8 );

/**
 * Ensure the page exists, once. Same pattern the desk page used; the
 * content is plain HTML plus the shortcode so the owner can edit it in
 * wp-admin like any page.
 */
add_action( 'init', function () {
	if ( get_option( 'justice_sim_page_v1' ) ) {
		return;
	}

	$existing = get_posts( array(
		'post_type'      => 'page',
		'name'           => 'legal-simulation',
		'post_status'    => array( 'publish', 'draft', 'pending' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
	) );

	if ( ! empty( $existing ) ) {
		update_option( 'justice_sim_page_v1', 1 );

		return;
	}

	$content = '<p>זו זירת הדמיה משפטית חיה: מתארים מצב במשפט אחד, והמערכת בונה דיון שלם עם דמויות AI, שופט, עורכי דין וצדדים, שמתווכחים בזמן אמת. אפשר לצפות, להתערב, לדבר עם כל דמות בנפרד, ואפילו להזמין אנשים אמיתיים לשיחת וידאו בתוך הזירה. עובד בעברית ובאנגלית, בלי הרשמה.</p>'
		. '<p>למה זה שימושי? כי הרבה פעמים הדרך הכי מהירה להבין סכסוך היא לראות אותו מוצג משני הצדדים. ההדמיה עוזרת להרגיש איך טענה נשמעת באולם, אילו שאלות מגיעות מהצד השני ואיפה הגרסה שלכם חלשה. עורכי דין משתמשים בזה לחזרות לפני דיון, ואנשים פרטיים כדי להבין את המצב שלהם לפני שיחה עם עורך דין.</p>'
		. "\n\n" . '[justice_arena_embed]' . "\n\n"
		. '<h2>ומה הלאה?</h2>'
		. '<p>אם ההדמיה חידדה לכם שאלה אמיתית, יש שתי דרכים קצרות להמשיך: <a href="/legal-ai-desk/">העוזר המשפטי המיידי</a> שמסביר זכויות וצעד הבא לפי המקרה שלכם, או <a href="/lawyers/">חיפוש עורך דין לפי תחום ועיר</a> לשיחה עם בן אדם.</p>';

	$pid = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'הדמיה משפטית: סימולציית בית משפט חיה עם AI',
		'post_name'    => 'legal-simulation',
		'post_content' => $content,
	) );

	if ( $pid && ! is_wp_error( $pid ) ) {
		update_post_meta( $pid, '_yoast_wpseo_title', 'הדמיה משפטית: סימולציית בית משפט חיה עם AI | Jus-Tice' );
		update_post_meta( $pid, '_yoast_wpseo_metadesc', 'הדמיה משפטית אינטראקטיבית: דיון חי עם דמויות AI, עדים וטיעונים, בעברית ובאנגלית. מתארים מקרה במשפט אחד וצופים בזירה נפתחת. בלי הרשמה.' );
		update_option( 'justice_sim_page_v1', 1 );
	}
}, 20 );
