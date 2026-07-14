<?php
/**
 * Rent agreement builder v2: the six-step wizard app on /online-rent-agreement/.
 *
 * Replaces the legacy static iframe (rent.html, a 6,200px fill-in-the-blanks
 * sheet) with a product-grade builder based on the patterns the market
 * leaders use (LawDepot / Rocket Lawyer style guided interview): 3-5 inputs
 * per step, progress bar, live document preview, localStorage autosave,
 * one-tap outputs (print/PDF, copy, Word download, WhatsApp lawyer review).
 * The legal skeleton is the SAME contract text that already lived on the
 * page (unprotected-tenancy agreement, 12 sections + appendices) - now also
 * server-rendered inside <details> so search engines finally read it
 * (previously locked in an iframe).
 *
 * Monetization scaffolding exists behind JT_RENT_MONETIZE = false: premium
 * actions (attorney review SLA, e-sign, custom clause drafting) render only
 * when the flag flips. Nothing is charged or shown today.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JT_RENT_MONETIZE = false;

function justice_rent_gen_template(): string {
	$file = __DIR__ . '/rent-gen-template.html';

	return file_exists( $file ) ? (string) file_get_contents( $file ) : '';
}

add_shortcode( 'justice_rent_gen', function () {
	$ver = defined( 'JUSTICE_OPS_VERSION' ) ? JUSTICE_OPS_VERSION : '0';
	wp_enqueue_style( 'jt-rent-gen', plugins_url( 'assets/rent-gen.css', __FILE__ ), array(), $ver );
	wp_enqueue_script( 'jt-rent-gen', plugins_url( 'assets/rent-gen.js', __FILE__ ), array(), $ver, true );
	wp_localize_script( 'jt-rent-gen', 'JT_RENT_CFG', array(
		'monetize' => JT_RENT_MONETIZE,
		'wa'       => 'https://wa.me/972525101555',
		'sched'    => home_url( '/schedule-meeting/' ),
	) );

	$doc = justice_rent_gen_template();

	return '<div id="jt-rent-app" dir="rtl" data-jt-rent-v="2">'
		. '<noscript><p>המחולל דורש דפדפן עם JavaScript. נוסח החוזה המלא זמין למטה.</p></noscript>'
		. '</div>'
		. '<details class="jt-rent-src"><summary>נוסח החוזה המלא (לקריאה לפני מילוי)</summary>'
		. '<div id="jt-rent-doc-src">' . $doc . '</div></details>';
} );

// One-shot: swap the legacy iframe stub on the page for the app shortcode.
// Runs once, keyed by option; the old stub stays recoverable in the post
// revision this update creates and in the wave-0 snapshot archive.
add_action( 'init', function () {
	if ( get_option( 'justice_rent_gen_v2_swapped' ) ) {
		return;
	}

	$page = get_page_by_path( 'online-rent-agreement', OBJECT, 'articles' );

	if ( ! $page instanceof WP_Post ) {
		update_option( 'justice_rent_gen_v2_swapped', 'no-page' );
		return;
	}

	if ( false === strpos( (string) $page->post_content, 'rent.html' ) ) {
		update_option( 'justice_rent_gen_v2_swapped', 'already-custom' );
		return;
	}

	$intro = '<p><strong>חוזה שכירות אונליין</strong> בנוסח סטנדרטי מעודכן: עונים על שאלות קצרות, רואים את החוזה נבנה בזמן אמת, ומורידים מסמך מוכן להדפסה ולחתימה, חינם ובלי הרשמה. הנוסח מבוסס על הסכם שכירות בלתי מוגנת מלא, כולל נספח ציוד וכתב ערבות.</p>';

	wp_update_post( array(
		'ID'           => $page->ID,
		'post_content' => $intro . "\n\n" . '[justice_rent_gen]',
	) );

	update_option( 'justice_rent_gen_v2_swapped', gmdate( 'c' ) );
} );
