<?php
/**
 * Practice-area page polish + sitewide WhatsApp lead button.
 *
 * Owner QA 2026-07-07: practice-area hubs rendered giant blank walls
 * because full multi-thousand-word guides live in the TERM DESCRIPTIONS
 * and the theme prints them inside the narrow hero column; the archive
 * query also rendered hundreds of article cards in one ~1MB page.
 *
 * Fixes, all render-layer and instant (no theme pull needed):
 * 1. Taxonomy main query capped at 24 cards per page (pagination already
 *    renders in the template).
 * 2. The hero shows only the intro of the term description; the FULL text
 *    moves into a readable full-width section further down the same page.
 *    Zero content loss, zero URL change.
 * 3. Sitewide floating WhatsApp button (big labeled bar on mobile) whose
 *    prefilled message carries the page title and URL, so the owner knows
 *    exactly which page and intent the visitor came from.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// 1. Archive size cap
// ---------------------------------------------------------------------------

add_action( 'pre_get_posts', function ( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}

	if ( $query->is_tax( 'practice-areas' ) ) {
		$query->set( 'posts_per_page', 24 );
	}
}, 20 );

// ---------------------------------------------------------------------------
// 2. Hero description trim + full-width guide section
// ---------------------------------------------------------------------------

add_action( 'template_redirect', function () {
	if ( ! is_tax( 'practice-areas' ) ) {
		return;
	}

	ob_start( function ( $html ) {
		if ( false === strpos( $html, 'practice-hub-hero__description' ) ) {
			return $html;
		}

		if ( ! preg_match( '/(<div class="practice-hub-hero__description">)(.*?)(<\/div>\s*<div class="practice-hub-hero__actions)/su', $html, $m ) ) {
			return $html;
		}

		$full = $m[2];

		if ( mb_strlen( wp_strip_all_tags( $full ) ) < 900 ) {
			return $html;
		}

		// Intro: the first two paragraphs, the rest becomes its own section.
		$parts = preg_split( '/(<\/p>)/iu', $full, -1, PREG_SPLIT_DELIM_CAPTURE );
		$intro = '';
		$count = 0;

		for ( $i = 0; $i < count( $parts ) - 1; $i += 2 ) {
			$intro .= $parts[ $i ] . ( $parts[ $i + 1 ] ?? '' );
			$count++;
			if ( $count >= 2 || mb_strlen( wp_strip_all_tags( $intro ) ) > 550 ) {
				break;
			}
		}

		if ( '' === trim( wp_strip_all_tags( $intro ) ) ) {
			$intro = '<p>' . mb_substr( trim( wp_strip_all_tags( $full ) ), 0, 480 ) . '</p>';
		}

		$html = str_replace( $m[1] . $m[2], $m[1] . $intro . '<p><a class="practice-hub-more" href="#practice-full-guide">להמשך המדריך המלא בתחום</a></p>', $html );

		$section = '<section class="section practice-hub-fulldesc" id="practice-full-guide" style="background:#fff">'
			. '<div class="container"><div style="max-width:820px;margin:0 auto">'
			. '<p class="section-header__eyebrow">המדריך המלא</p>'
			. '<h2 style="margin-bottom:18px">כל מה שחשוב לדעת בתחום</h2>'
			. '<div style="line-height:1.85;text-align:justify;font-size:1.02em">' . $full . '</div>'
			. '</div></div></section>';

		// Inject the full guide right before the guides grid section.
		$anchor = '<section class="practice-hub-content section"';
		$pos    = strpos( $html, $anchor );

		if ( false !== $pos ) {
			$html = substr_replace( $html, $section, $pos, 0 );
		} else {
			$html = str_replace( '</main>', $section . '</main>', $html );
		}

		return $html;
	} );
} );

// ---------------------------------------------------------------------------
// 3. Sitewide WhatsApp lead button with page context
// ---------------------------------------------------------------------------

function justice_ops_whatsapp_href(): string {
	global $post;

	$title = '';

	if ( is_singular() && $post instanceof WP_Post ) {
		$title = get_the_title( $post );
	} elseif ( is_tax() || is_category() || is_tag() ) {
		$title = single_term_title( '', false );
	} elseif ( is_front_page() ) {
		$title = 'דף הבית';
	} elseif ( is_post_type_archive() ) {
		$title = (string) post_type_archive_title( '', false );
	}

	$url = ( is_ssl() ? 'https://' : 'http://' ) . ( $_SERVER['HTTP_HOST'] ?? 'jus-tice.co.il' ) . strtok( (string) ( $_SERVER['REQUEST_URI'] ?? '/' ), '?' );

	$message = 'שלום, אני פונה מהעמוד: ' . mb_substr( wp_strip_all_tags( (string) $title ), 0, 80 )
		. ' | ' . $url
		. ' | ' . 'אשמח לשוחח עם עורך דין בנושא.';

	if ( function_exists( 'justice_theme_public_whatsapp_url' ) ) {
		return justice_theme_public_whatsapp_url( $message );
	}

	return 'https://wa.me/972525101555?text=' . rawurlencode( $message );
}

add_action( 'wp_footer', function () {
	if ( is_admin() ) {
		return;
	}

	$href = justice_ops_whatsapp_href();

	if ( '' === $href ) {
		return;
	}
	?>
	<a class="justice-wa-float" href="<?php echo esc_url( $href ); ?>" target="_blank" rel="noopener nofollow"
		data-whatsapp-surface="floating_button" aria-label="שליחת הודעת וואטסאפ לעורך דין">
		<svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.5.8 3.1 1.2 4.7 1.2 6.6 0 12-5.3 12-11.9C28 8.3 22.6 3 16 3zm5.9 16.9c-.3.8-1.7 1.6-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.4-1.5-5.6-4.9-5.8-5.1-.2-.2-1.4-1.8-1.4-3.5s.9-2.5 1.2-2.8c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.6.7c-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.2.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.6.4.1.3.1.9-.2 1.7z"/></svg>
		<span class="justice-wa-float__label">שליחת הודעה לעורך דין עכשיו</span>
	</a>
	<style>
	.justice-wa-float{position:fixed;bottom:18px;inset-inline-start:18px;z-index:99990;display:flex;align-items:center;gap:10px;background:#25d366;color:#fff;border-radius:999px;padding:12px 18px;font-weight:700;font-size:15px;box-shadow:0 6px 24px rgba(0,0,0,.22);text-decoration:none;transition:transform .15s ease}
	.justice-wa-float:hover{transform:translateY(-2px);color:#fff}
	.justice-wa-float svg{flex:0 0 auto}
	@media (max-width:768px){.justice-wa-float{inset-inline:12px;bottom:12px;justify-content:center;padding:14px 16px;font-size:16px;border-radius:14px}}
	@media (min-width:769px){.justice-wa-float__label{max-width:0;overflow:hidden;white-space:nowrap;transition:max-width .25s ease}.justice-wa-float:hover .justice-wa-float__label{max-width:280px}}
	</style>
	<?php
}, 60 );
