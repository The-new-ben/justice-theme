<?php
/**
 * Shared content utilities extracted from the retired publication engines
 * (2026-07-21, owner order: engines removed for good). Pure functions only,
 * no hooks, no writes.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_count_content_draft_words( string $raw ): int {
	$raw = preg_replace( '/^#.*$/m', '', $raw );
	$raw = preg_replace( '/^[-*]\s+/m', '', $raw );
	$raw = preg_replace( '/`([^`]+)`/', '$1', $raw );
	$raw = wp_strip_all_tags( $raw );
	$raw = preg_replace( '/\s+/u', ' ', trim( $raw ) );

	if ( '' === $raw ) {
		return 0;
	}

	return count( preg_split( '/\s+/u', $raw ) ?: array() );
}

function justice_theme_markdown_draft_to_html( string $raw ): string {
	$raw   = preg_replace( '/^Slug target:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Status:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Target length:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Connected .*$/mi', '', $raw );
	$raw   = preg_replace( '/^Cluster:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Primary keyword:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Secondary keywords:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Preferred editorial terminology:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Source audit:.*$/mi', '', $raw );
	$lines = preg_split( '/\r\n|\r|\n/', trim( $raw ) );
	$html  = '';
	$list  = false;

	foreach ( $lines as $line ) {
		$line = trim( $line );
		if ( '' === $line ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			continue;
		}

		if ( preg_match( '/^###\s+(.+)$/', $line, $matches ) ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			$html .= '<h3>' . esc_html( $matches[1] ) . "</h3>\n";
			continue;
		}

		if ( preg_match( '/^##\s+(.+)$/', $line, $matches ) ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			$html .= '<h2>' . esc_html( $matches[1] ) . "</h2>\n";
			continue;
		}

		if ( preg_match( '/^#\s+(.+)$/', $line, $matches ) ) {
			// The "# " line is the post title (extracted separately); skip it in the
			// body so rendered articles do not carry a duplicate in-content <h1>.
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			continue;
		}

		if ( 0 === strpos( $line, '- ' ) ) {
			if ( ! $list ) {
				$html .= "<ul>\n";
				$list  = true;
			}
			$html .= '<li>' . justice_theme_markdown_inline_to_html( substr( $line, 2 ) ) . "</li>\n";
			continue;
		}

		if ( $list ) {
			$html .= "</ul>\n";
			$list  = false;
		}

		$html .= '<p>' . justice_theme_markdown_inline_to_html( $line ) . "</p>\n";
	}

	if ( $list ) {
		$html .= "</ul>\n";
	}

	return wp_kses_post( $html );
}

/**
 * Strip internal editor-only "before publication" blocks from public content.
 *
 * @param string $raw Raw Markdown.
 * @return string
 */
function justice_theme_strip_internal_publication_note( string $raw ): string {
	$lines    = preg_split( '/\r\n|\r|\n/', $raw );
	$sections = justice_theme_split_markdown_publication_sections( $lines );
	$kept     = array();

	foreach ( $sections as $section ) {
		if ( justice_theme_is_internal_publication_section( $section ) ) {
			continue;
		}

		foreach ( $section as $line ) {
			if ( justice_theme_is_internal_publication_line( $line ) || justice_theme_is_internal_publication_metadata_line( $line ) ) {
				continue;
			}

			$kept[] = $line;
		}
	}

	return implode( "\n", $kept );
}

/**
 * Find internal markers that must never reach public article content.
 *
 * @param string $content Content.
 * @return array
 */
function justice_theme_detect_public_content_internal_markers( string $content ): array {
	$markers = array();
	$patterns = array(
		'NOT VERIFIED',
		'BLOCKED:',
		'READY NEXT',
		'project-control/',
		'Source audit:',
		'Slug target:',
		'Status:',
		'Target length:',
		'Connected lawyer:',
		'Connected pillar:',
		'Primary keyword:',
		'Secondary keywords:',
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
		'סטטוס לפני פרסום',
		'פעולות המשך לפני פרסום',
		'חסמי פרסום',
		'מבנה CMS',
		'גרסת CMS',
		'CRM',
		'GSC',
		'LegalTech',
		'AI הפנימי',
		'בעל האתר',
		'מודל הכנסות',
		'מבחינה עסקית',
		'מונחי מוצר',
		'עורכי דין משלמים',
		'מערכת לידים',
		'לידים איכותיים',
		'מיני-סייט',
		'מיני-אתר',
		'פרופיל בסיסי',
		'Jus-Tice צריך',
		'המשתמש ביקש',
		'קניבליזציה',
		'מדדי הצלחה לעמוד',
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $content, $pattern ) ) {
			$markers[] = $pattern;
		}
	}

	return array_values( array_unique( $markers ) );
}

/**
 * Determine whether one line is internal-only.
 *
 * @param string $line Line.
 * @return bool
 */
function justice_theme_is_internal_publication_line( string $line ): bool {
	$patterns = array(
		'NOT VERIFIED',
		'VERIFIED:',
		'BLOCKED:',
		'READY NEXT',
		'PARTIAL:',
		'Next action',
		'project-control/',
		'Source audit:',
		'Legal review',
		'source review',
		'PARTIAL:',
		'קניבליזציה',
		'לפני פרסום',
		'חסמי פרסום',
		'פעולות המשך',
		'בדיקת מקורות',
		'בדיקה משפטית',
		'CMS',
		'CRM',
		'GSC',
		'LegalTech',
		'AI הפנימי',
		'בעל האתר',
		'מודל הכנסות',
		'מבחינה עסקית',
		'מונחי מוצר',
		'עורכי דין משלמים',
		'מערכת לידים',
		'לידים איכותיים',
		'מיני-סייט',
		'מיני-אתר',
		'פרופיל בסיסי',
		'Jus-Tice צריך',
		'המשתמש ביקש',
		'מיני-סייט',
		'טופס ליד',
		'מקור ליד',
		'מערכת ה-CRM',
		'צריך לקשר',
		'צריך להפנות',
		'צריך להיות עמוד',
		'עמוד זה צריך',
		'מאמר זה צריך',
		'המאמר צריך',
		'מבחינת Jus-Tice',
		'Jus-Tice צריך',
		'ב-Jus-Tice',
		'קישורים פנימיים',
		'מדדי הצלחה',
		'Tools > Jus-Tice',
		'מסלול הכנסה',
		'למה זה מסלול הכנסה',
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
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $line, $pattern ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether one Markdown metadata line belongs only in editor notes.
 *
 * @param string $line Line.
 * @return bool
 */
function justice_theme_is_internal_publication_metadata_line( string $line ): bool {
	return (bool) preg_match(
		'/^(Slug target|Status|Target length|Connected pillar|Connected lawyer|Cluster|Primary keyword|Secondary keywords|Preferred editorial terminology|Source audit):/i',
		trim( $line )
	);
}

/**
 * Determine whether a Markdown section is internal-only.
 *
 * @param array<int,string> $section Section lines.
 * @return bool
 */
function justice_theme_is_internal_publication_section( array $section ): bool {
	if ( empty( $section ) ) {
		return false;
	}

	$heading = '';
	if ( preg_match( '/^#{2,3}\s+(.+)$/u', (string) $section[0], $matches ) ) {
		$heading = trim( wp_strip_all_tags( $matches[1] ) );
	}

	if ( '' !== $heading && justice_theme_is_internal_publication_heading( $heading ) ) {
		return true;
	}

	if ( preg_match( '/^#\s+(.+)$/u', (string) $section[0] ) ) {
		return false;
	}

	$block = implode( "\n", $section );
	$strong_markers = array(
		'NOT VERIFIED',
		'BLOCKED:',
		'READY NEXT',
		'PARTIAL:',
		'CMS',
		'CRM',
		'GSC',
		'GSC data',
		'LegalTech',
		'AI הפנימי',
		'בעל האתר',
		'מודל הכנסות',
		'מבחינה עסקית',
		'מונחי מוצר',
		'עורכי דין משלמים',
		'מערכת לידים',
		'לידים איכותיים',
		'מיני-סייט',
		'מיני-אתר',
		'פרופיל בסיסי',
		'Jus-Tice צריך',
		'המשתמש ביקש',
		'Tools > Jus-Tice',
		'FAQ schema',
		'source audit',
		'project-control/publication',
		'project-control/source-audits',
		'סטטוס לפני פרסום',
		'פעולות המשך לפני פרסום',
		'חסמי פרסום',
	);

	foreach ( $strong_markers as $marker ) {
		if ( false !== stripos( $block, $marker ) ) {
			return true;
		}
	}

	return false;
}

function justice_theme_markdown_inline_to_html( string $text ): string {
	$parts = preg_split( '/(\[[^\]\r\n]+\]\((?:\/[^)\s]*|https?:\/\/(?:www\.)?jus-tice\.co\.il\/[^)\s]*)\)|`\/[^`]+`)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE );
	if ( false === $parts ) {
		return esc_html( $text );
	}

	$html = '';
	foreach ( $parts as $part ) {
		if ( preg_match( '/^\[([^\]\r\n]+)\]\((\/[^)\s]*|https?:\/\/(?:www\.)?jus-tice\.co\.il\/[^)\s]*)\)$/u', $part, $matches ) ) {
			$label = trim( wp_strip_all_tags( $matches[1] ) );
			$url   = trim( $matches[2] );

			if ( 0 === strpos( $url, '/' ) ) {
				$url = home_url( '/' . trim( $url, '/' ) . '/' );
			}

			$html .= '<a href="' . esc_url( justice_theme_public_url( $url ) ) . '">' . esc_html( $label ) . '</a>';
			continue;
		}

		if ( preg_match( '/^`(\/[^`]+)`$/u', $part, $matches ) ) {
			$path  = '/' . trim( $matches[1], '/' ) . '/';
			$html .= '<a href="' . esc_url( home_url( $path ) ) . '">' . esc_html( $path ) . '</a>';
			continue;
		}

		// Allow a safe inline subset of HTML written directly in drafts
		// (<strong>, <em>, <a href> including external authority links).
		// Everything else is stripped; the final pass below is wp_kses_post.
		$html .= wp_kses(
			$part,
			array(
				'a'      => array( 'href' => true, 'title' => true, 'rel' => true, 'target' => true ),
				'strong' => array(),
				'em'     => array(),
				'b'      => array(),
				'i'      => array(),
			)
		);
	}

	return wp_kses_post( $html );
}

/**
 * Split Markdown into H2/H3-led sections so unsafe internal blocks can be
 * removed even when only the section body contains the obvious markers.
 *
 * @param array<int,string>|false $lines Lines.
 * @return array<int,array<int,string>>
 */
function justice_theme_split_markdown_publication_sections( $lines ): array {
	if ( ! is_array( $lines ) ) {
		return array();
	}

	$sections = array();
	$current  = array();

	foreach ( $lines as $line ) {
		if ( preg_match( '/^#{2,3}\s+(.+)$/u', $line ) && ! empty( $current ) ) {
			$sections[] = $current;
			$current    = array();
		}

		$current[] = $line;
	}

	if ( ! empty( $current ) ) {
		$sections[] = $current;
	}

	return $sections;
}

/**
 * Determine whether a Markdown section is internal-only.
 *
 * @param string $heading Heading.
 * @return bool
 */
function justice_theme_is_internal_publication_heading( string $heading ): bool {
	$patterns = array(
		'לפני פרסום',
		'לפני פירסום',
		'סטטוס',
		'פעולות המשך',
		'קניבליזציה',
		'קניבל',
		'מבנה CMS',
		'גרסת CMS',
		'מערכת Jus-Tice',
		'תפקיד Jus-Tice',
		'איך Jus-Tice',
		'איך המאמר מתחבר',
		'איך המאמר צריך',
		'קלוט ליד',
		'לקלוט ליד',
		'CRM',
		'LegalTech',
		'מודל LegalTech',
		'כלי LegalTech',
		'מודל הכנסות',
		'מוניטיזציה',
		'בעל האתר',
		'מיני-סייט',
		'מיני-אתר',
		'לידים',
		'מדדי הצלחה',
		'שערי בדיקה',
		'חסמי פרסום',
		'קישורים פנימיים נדרשים',
		'קישורים פנימיים מתוכננים',
		'חיבור לעו',
		'חיבור למודל',
		'מודל תוכן',
		'מדיניות תוכן',
		'ביקורות',
		'הרחבות תוכן',
		'מקורות ראשוניים',
		'מקורות ותחרות',
		'מיני-סייט',
		'mini-site',
		'publication',
		'pre-publication',
		'source audit',
		'מסלול הכנסה',
		'מודל הכנסה',
		'לידים בתשלום',
		'מבחינה עסקית',
		'מדדי הצלחה',
		'קניבליזציה',
		'חסמי פרסום',
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $heading, $pattern ) ) {
			return true;
		}
	}

	return false;
}

