<?php
/**
 * Restore the heading spine on legacy long-form pages.
 *
 * Measured 2026-07-25 across the 26 highest-impression pages: 10 of them
 * carry between 9,000 and 53,000 words with fewer than three content <h2>
 * elements. Their section titles exist, but they were marked up as a bold
 * run-in at the head of a paragraph (83 such paragraphs on /usa-lawyers/
 * alone) instead of as headings. Google reads the heading spine; it does not
 * read bold. The pages that do have a spine (/germany-lawyers/ with 53,
 * /lahav-433/ with 22) rank and earn clicks. The ones without it collect
 * impressions and no clicks.
 *
 * This promotes an existing bold run-in to a real heading. It changes markup
 * only: not one word of copy is added, removed or reordered, and nothing is
 * written to the database, so it is reversible by unhooking the filter.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Headings the theme itself prints around the body (map, editorial note,
 * CTA, related guides). They must not count toward the spine, or a page with
 * only widget headings looks structured when it is not.
 */
function justice_theme_widget_heading_pattern(): string {
	return '/מפת עורכי|הערת מערכת|צריכים בדיקה|מדריכים משפטיים|שאלות נפוצות|נבדק על ידי|כרטיסי|לקריאה נוספת/u';
}

/**
 * Count the content (non widget) H2/H3 elements in a content string.
 *
 * @param string $content HTML.
 * @return int
 */
function justice_theme_count_content_headings( string $content ): int {
	// H2 only. The related-guides widget prints article titles as H3, and
	// counting those made a completely structureless page look structured
	// (measured on /usa-lawyers/: 3 widget H3s, 0 real sections).
	if ( ! preg_match_all( '/<h2[^>]*>(.*?)<\/h2>/isu', $content, $m ) ) {
		return 0;
	}
	$count = 0;
	foreach ( $m[1] as $heading ) {
		$text = trim( wp_strip_all_tags( $heading ) );
		if ( '' === $text ) {
			continue;
		}
		if ( preg_match( justice_theme_widget_heading_pattern(), $text ) ) {
			continue;
		}
		$count++;
	}
	return $count;
}

/**
 * Decide whether a bold run-in is really a section title.
 *
 * Conservative on purpose: a false promotion puts a sentence fragment into
 * the heading outline, which is worse than leaving the paragraph alone.
 *
 * @param string $label Plain-text label.
 * @param string $rest  Plain-text remainder of the paragraph.
 * @return bool
 */
function justice_theme_looks_like_section_title( string $label, string $rest ): bool {
	$len = function_exists( 'mb_strlen' ) ? mb_strlen( $label ) : strlen( $label );
	if ( $len < 8 || $len > 90 ) {
		return false;
	}
	// A title is not a sentence: no punctuation in the middle of it, and it
	// does not end in a full stop. A trailing question mark is allowed and
	// wanted: "מהן דרישות התפקיד?" is exactly the heading Google matches to a
	// People-Also-Ask query, and rejecting it left /court-judge/ (1,488
	// impressions) with no spine at all.
	if ( preg_match( '/[.!?]\s*\S/u', $label ) || preg_match( '/[.!]$/u', $label ) ) {
		return false;
	}
	// It must actually introduce something. A question needs less of a run-up
	// to prove itself: "מהן דרישות התפקיד?" is a heading no matter how short
	// the answer that follows.
	$min_rest = ( '?' === substr( $label, -1 ) ) ? 40 : 80;
	if ( ( function_exists( 'mb_strlen' ) ? mb_strlen( $rest ) : strlen( $rest ) ) < $min_rest ) {
		return false;
	}
	// Skip labels that are just a figure or a date.
	if ( preg_match( '/^[\d\s\-\.,%₪$€]+$/u', $label ) ) {
		return false;
	}
	return true;
}

/**
 * Promote bold run-ins to headings on structureless long-form content.
 *
 * @param string $content Post content, already through the earlier filters.
 * @return string
 */
function justice_theme_restore_heading_spine( $content ) {
	if ( ! is_string( $content ) || is_admin() || is_feed() || ! is_singular() || ! in_the_loop() ) {
		return $content;
	}
	// Short pages do not have a structure problem.
	if ( strlen( $content ) < 6000 ) {
		return $content;
	}
	// Pages that already have a spine are left completely alone.
	if ( justice_theme_count_content_headings( $content ) >= 3 ) {
		return $content;
	}
	$original = $content;

	$promoted = 0;

	// A bold line between two <br> tags was tried as a second pattern and
	// rejected on evidence: on /about-usa/ it fired 60 times and promoted
	// encyclopedia section titles (רכישת לואיזיאנה, לוס אנג'לס), which pushes
	// a lawyer page further toward Wikipedia rather than toward intent. The
	// two pages it would have helped are handled individually instead.
	$result = preg_replace_callback(
		'/<p([^>]*)>\s*<strong>(.*?)<\/strong>\s*(.*?)<\/p>/isu',
		static function ( array $m ) use ( &$promoted ) {
			// Hard cap: a 53,000 word page must not become 200 headings.
			if ( $promoted >= 40 ) {
				return $m[0];
			}
			// Decode before measuring and before re-escaping: the source
			// carries entities (נדל&quot;ן), and escaping an already-encoded
			// entity ships a literal &amp;quot; into the heading.
			// wp_strip_all_tags drops <br> without leaving a space, which glues
			// the words on either side together ("ארצות הברית" + "ילידים"
			// became "הבריתילידים"). Turn breaks into spaces first.
			$label = preg_replace( '/<br\s*\/?>/i', ' ', $m[2] );
			$label = trim( html_entity_decode( wp_strip_all_tags( $label ), ENT_QUOTES, 'UTF-8' ) );
			$label = trim( preg_replace( '/\s+/u', ' ', $label ) );
			$rest  = trim( $m[3] );
			$plain = trim( html_entity_decode( wp_strip_all_tags( $rest ), ENT_QUOTES, 'UTF-8' ) );

			if ( ! justice_theme_looks_like_section_title( $label, $plain ) ) {
				return $m[0];
			}
			// The run-in often left its colon behind on the body text.
			$rest = preg_replace( '/^\s*[:：]\s*/u', '', $rest );

			$promoted++;
			return '<h2 class="jt-restored-heading">' . esc_html( $label ) . '</h2>'
				. '<p' . $m[1] . '>' . $rest . '</p>';
		},
		$content
	);

	// preg_replace_callback returns null on backtrack/recursion limits. On a
	// 53,000 word page that is a real possibility, and silently shipping null
	// would blank the article.
	if ( null === $result || '' === $result ) {
		return $content;
	}
	return $result;
}
add_filter( 'the_content', 'justice_theme_restore_heading_spine', 11 );
