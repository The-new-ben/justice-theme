<?php
/**
 * Public publication safety gates.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
add_filter( 'wp_insert_post_data', 'justice_theme_block_internal_notes_publication', 20, 4 );
/**
 * Block public publication when internal workflow notes are still in content.
 *
 * This is intentionally a hard gate for public statuses. Drafts and private
 * notes remain editable; only publishing public-facing legal content is blocked.
 *
 * @param array $data                Sanitized post data.
 * @param array $postarr             Raw post array.
 * @param array $unsanitized_postarr Unsanitized post array.
 * @param bool  $update              Whether this is an existing post update.
 * @return array
 */
function justice_theme_block_internal_notes_publication( array $data, array $postarr, array $unsanitized_postarr, ?bool $update ): array {
	unset( $postarr, $unsanitized_postarr, $update );

	$post_type = isset( $data['post_type'] ) ? (string) $data['post_type'] : '';
	if ( ! in_array( $post_type, array( 'articles', 'page', 'post' ), true ) ) {
		return $data;
	}

	$status = isset( $data['post_status'] ) ? (string) $data['post_status'] : '';
	if ( ! in_array( $status, array( 'publish', 'future' ), true ) ) {
		return $data;
	}

	$public_text = implode(
		"\n\n",
		array(
			(string) ( $data['post_title'] ?? '' ),
			(string) ( $data['post_excerpt'] ?? '' ),
			(string) ( $data['post_content'] ?? '' ),
		)
	);

	$markers = justice_theme_detect_publication_safety_markers( $public_text );
	if ( empty( $markers ) ) {
		return $data;
	}

	justice_theme_die_on_unsafe_publication( $markers );

	return $data;
}

/**
 * Detect internal markers that must stay out of public content.
 *
 * @param string $content Candidate public content.
 * @return array<int,string>
 */
function justice_theme_detect_publication_safety_markers( string $content ): array {
	$text    = html_entity_decode( wp_strip_all_tags( $content ), ENT_QUOTES, get_bloginfo( 'charset' ) );
	$markers = function_exists( 'justice_theme_detect_public_content_internal_markers' )
		? justice_theme_detect_public_content_internal_markers( $text )
		: array();

	$extra_patterns = array(
		'NOT VERIFIED',
		'BLOCKED:',
		'READY NEXT',
		'PARTIAL:',
		'project-control/',
		'Source audit:',
		'Slug target:',
		'Target length:',
		'Connected lawyer:',
		'Connected pillar:',
		'Primary keyword:',
		'Secondary keywords:',
		'publication-cannibalization-check',
		'revenue for Jus-Tice',
		'revenue stream',
		'Revenue Streams',
		'internal revenue',
		'why this is revenue',
		'why this page is revenue',
		'why this is a good revenue',
		'qualified lead fee',
		'lawyers pay',
		'lawyer pays',
		'Lead Partner target',
		'manual invoice/payment path',
		'Grow/Meshulam',
		'Meshulam',
		'Morning plugin',
		'uPress',
		'Linear',
		'מסלול הכנסה',
		'הכנסה חשוב',
		'למה זה מסלול הכנסה',
		'למה ערעור ביטוח לאומי הוא מסלול הכנסה',
		'למה ביטוח לאומי הוא מסלול הכנסה',
		'הכנסה ל-Jus-Tice',
		'מודל הכנסה',
		'מודל הכנסות',
		'לידים בתשלום',
		'עורכי דין משלמים',
		'מבחינה עסקית',
		'בעל האתר',
		'מדדי הצלחה',
		'סטטוס לפני פרסום',
		'פעולות המשך לפני פרסום',
		'חסמי פרסום',
		'בדיקת מקורות',
		'בדיקה משפטית',
		'קניבליזציה',
		'המשתמש ביקש',
		'Jus-Tice צריך',
		'מסלול הכנסה',
		'הכנסה חשוב',
		'למה זה מסלול הכנסה',
		'הכנסה ל-Jus-Tice',
		'מודל הכנסה',
		'לידים בתשלום',
		'GSC',
		'CMS',
		'CRM',
		'AI הפנימי',
		'בעל האתר',
		'מודל הכנסות',
		'מבחינה עסקית',
		'מונחי מוצר',
		'עורכי דין משלמים',
		'מערכת לידים',
		'לידים איכותיים',
		'Jus-Tice צריך',
		'המשתמש ביקש',
		'סטטוס לפני פרסום',
		'פעולות המשך לפני פרסום',
		'חסמי פרסום',
		'בדיקת מקורות',
		'בדיקה משפטית',
		'קניבליזציה',
	);

	foreach ( $extra_patterns as $pattern ) {
		if ( false !== stripos( $text, $pattern ) ) {
			$markers[] = $pattern;
		}
	}

	return array_values( array_unique( array_filter( array_map( 'trim', $markers ) ) ) );
}

/**
 * Stop the publish request with a clear editor-facing explanation.
 *
 * @param array<int,string> $markers Detected markers.
 */
function justice_theme_die_on_unsafe_publication( array $markers ): void {
	$marker_list = implode( ', ', array_slice( $markers, 0, 8 ) );

	wp_die(
		wp_kses_post(
			'<h1>Publication blocked</h1>' .
			'<p>This content still contains internal editorial/project markers and was not published.</p>' .
			'<p><strong>Detected markers:</strong> <code>' . esc_html( $marker_list ) . '</code></p>' .
			'<p>Keep the post as draft, move internal notes to the internal editorial note, then publish only the public-facing Hebrew article body.</p>'
		),
		esc_html__( 'Publication blocked by Jus-Tice safety gate', 'justice-theme' ),
		array( 'response' => 409 )
	);
}
