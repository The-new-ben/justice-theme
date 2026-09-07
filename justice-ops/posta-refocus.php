<?php
/**
 * Refocus /posta/ (owner order 2026-09-07).
 *
 * Measured Jun-Sep 2026: the page drew 23,242 impressions and 61 clicks,
 * almost entirely on another outlet's crime-news brand queries. That skews
 * the site's topical identity toward crime news and converts nothing. This
 * one-time routine trims the section that profiles that outlet and points
 * the title and description at the page's real value: Israeli crime and
 * criminal-justice data. Runs once, via wp_update_post, so a revision is
 * created and the owner can revert from wp-admin.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	if ( get_option( 'justice_ops_posta_refocus_v1' ) ) {
		return;
	}

	$page = get_page_by_path( 'posta', OBJECT, array( 'page', 'post', 'articles' ) );

	if ( ! $page instanceof WP_Post || 'publish' !== $page->post_status ) {
		update_option( 'justice_ops_posta_refocus_v1', 'skipped:no-page', false );

		return;
	}

	$content = (string) $page->post_content;
	$marker  = 'אתרי חדשות עולם הפלילים בישראל';
	$pos     = mb_strpos( $content, $marker );

	if ( false !== $pos ) {
		// Cut from the start of the heading tag that contains the marker to
		// the next h2/h3 heading (or the end of the content).
		$open = strrpos( substr( $content, 0, $pos ), '<h' );

		if ( false !== $open ) {
			$next2 = strpos( $content, '<h2', $pos );
			$next3 = strpos( $content, '<h3', $pos );
			$ends  = array_filter( array( $next2, $next3 ), 'is_int' );
			$end   = $ends ? min( $ends ) : strlen( $content );

			$content = substr( $content, 0, $open ) . substr( $content, $end );
		}
	}

	$update = array(
		'ID'           => $page->ID,
		'post_title'   => 'נתוני הפשיעה והמשפט הפלילי בישראל: תיקים, כתבי אישום ומגמות',
		'post_content' => $content,
	);

	$result = wp_update_post( wp_slash( $update ), true );

	if ( is_wp_error( $result ) ) {
		update_option( 'justice_ops_posta_refocus_v1', 'error:' . $result->get_error_code(), false );

		return;
	}

	update_post_meta( $page->ID, '_yoast_wpseo_title', 'נתוני פשיעה ומשפט פלילי בישראל: תיקים, כתבי אישום ומגמות | Jus-Tice' );
	update_post_meta( $page->ID, '_yoast_wpseo_metadesc', 'כמה תיקי חקירה נפתחים בישראל, כמה כתבי אישום מוגשים ומה המגמות בפשיעה המדווחת. נתונים רשמיים, חוקים מרכזיים והסבר על ההליך הפלילי.' );

	update_option( 'justice_ops_posta_refocus_v1', 'done:' . wp_date( 'Y-m-d H:i:s' ), false );
}, 40 );
