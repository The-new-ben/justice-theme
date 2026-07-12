<?php
/**
 * AI tools discoverability: the desk is the site's differentiator, yet
 * before 2.10.0 it was reachable only from the homepage band, the tools
 * hub and the mesh. Three site-wide surfaces fix that without clutter:
 *
 * 1. A primary-menu entry (prepended, so it survives the mobile fold).
 * 2. A floating assistant button on the inline-end side, mirroring the
 *    WhatsApp float that lives on the inline-start side. Hidden on the
 *    desk page itself and on the front page, which already carries the
 *    one-box band.
 * 3. A compact one-box teaser inside long guides, inserted before a
 *    mid-article h2, handing off to /legal-ai-desk/?q= like the homepage.
 *
 * Microcopy follows the house content rules: no promises, no
 * superlatives, only claims the desk actually keeps (no signup, the
 * query is not stored, general information rather than legal advice).
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether the current request is the desk page itself. Conditional tags
 * lie on the theme's controlled routes, so the path is checked directly.
 */
function justice_tools_is_desk_request(): bool {
	$path = strtok( (string) ( $_SERVER['REQUEST_URI'] ?? '/' ), '?' );

	return false !== strpos( (string) $path, '/legal-ai-desk' );
}

/**
 * 1. Primary menu: the desk rides first so it stays visible when the
 * menu folds. Needle-checked, so a future CMS menu entry wins.
 */
add_filter( 'wp_nav_menu_items', function ( $items, $args ) {
	if ( empty( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	$items = (string) $items;

	if ( false !== strpos( $items, '/legal-ai-desk/' ) ) {
		return $items;
	}

	return '<li class="menu-item jt-nav-ai"><a href="' . esc_url( home_url( '/legal-ai-desk/' ) ) . '">עוזר AI מיידי</a></li>' . $items;
}, 30, 2 );

/**
 * 2. Floating assistant button. Inline-end corner (the WhatsApp float
 * owns inline-start), collapsed to an icon that grows a label on hover,
 * lifted above the WhatsApp bar on small screens.
 */
add_action( 'wp_footer', function () {
	if ( is_admin() || justice_tools_is_desk_request() || is_front_page() ) {
		return;
	}
	?>
	<a class="jt-ai-fab" href="<?php echo esc_url( home_url( '/legal-ai-desk/' ) ); ?>" aria-label="עוזר משפטי AI: תיאור מצב או העלאת מסמך וקבלת כיוון מיידי">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3c4.97 0 9 3.34 9 7.46 0 4.13-4.03 7.46-9 7.46-.98 0-1.93-.13-2.81-.37L5 19.5l.7-3.02C4.03 15.13 3 12.9 3 10.46 3 6.34 7.03 3 12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 7.2l.82 2.06 2.06.82-2.06.82L12 13l-.82-2.1-2.06-.82 2.06-.82L12 7.2Z" fill="currentColor"/></svg>
		<span class="jt-ai-fab__label">עוזר AI מיידי</span>
	</a>
	<?php
}, 22 );

/**
 * 3. The in-guide teaser: one box, one action, straight into the desk
 * with the visitor's own words.
 */
function justice_tools_inline_teaser(): string {
	return '<aside class="jt-ai-inline" role="note" aria-label="עוזר משפטי AI">'
		. '<p class="jt-ai-inline__t">רוצים לדעת מה המצב שלכם אומר משפטית?</p>'
		. '<p class="jt-ai-inline__s">תיאור קצר של מה שקרה, ועוזר ה-AI יסביר במה מדובר, מה הזכויות ומה הצעד הבא. בלי הרשמה, והפנייה לא נשמרת.</p>'
		. '<form class="jt-ai-inline__box" method="get" action="' . esc_url( home_url( '/legal-ai-desk/' ) ) . '">'
		. '<label class="screen-reader-text" for="jt-ai-inline-q">מה קרה?</label>'
		. '<input type="text" id="jt-ai-inline-q" name="q" placeholder="לדוגמה: קיבלתי מכתב התראה ואני לא יודע איך להגיב" maxlength="300">'
		. '<button type="submit">קבלת כיוון</button>'
		. '</form>'
		. '<a class="jt-ai-inline__doc" href="' . esc_url( home_url( '/legal-ai-desk/#doc' ) ) . '">יש לכם מסמך? העלו תמונה שלו לבדיקה</a>'
		. '</aside>';
}

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( array( 'post', 'articles' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return $content;
	}

	$content = (string) $content;

	// Short pieces and pages already carrying the desk stay untouched.
	if ( false !== strpos( $content, 'jt-ai-desk' ) || false !== strpos( $content, 'jt-ai-inline' ) ) {
		return $content;
	}

	if ( mb_strlen( wp_strip_all_tags( $content ) ) < 2200 ) {
		return $content;
	}

	if ( ! preg_match_all( '/<h2[\s>]/i', $content, $m, PREG_OFFSET_CAPTURE ) ) {
		return $content . justice_tools_inline_teaser();
	}

	$positions = $m[0];
	// Mid-article: before the third h2 when the guide is deep enough,
	// otherwise before the last one (usually the FAQ or the summary).
	$anchor = isset( $positions[2] ) ? $positions[2][1] : $positions[ count( $positions ) - 1 ][1];

	return substr_replace( $content, justice_tools_inline_teaser(), $anchor, 0 );
}, 32 );

add_action( 'wp_head', function () {
	echo '<style id="jt-tools-css">'
		. '.jt-nav-ai a{color:#e7c765 !important;font-weight:800}'
		. '.jt-nav-ai a:before{content:"✦";margin-inline-end:6px;font-size:.85em}'
		. '.jt-ai-fab{position:fixed;bottom:18px;inset-inline-end:18px;z-index:99989;display:flex;align-items:center;gap:9px;background:linear-gradient(135deg,#14213d,#24406e);color:#e7c765;border:1px solid rgba(231,199,101,.55);border-radius:999px;padding:13px;box-shadow:0 8px 26px rgba(10,18,38,.35);text-decoration:none;transition:transform .15s ease}'
		. '.jt-ai-fab:hover{transform:translateY(-2px);color:#e7c765}'
		. '.jt-ai-fab svg{flex:0 0 auto}'
		. '.jt-ai-fab__label{font-weight:800;font-size:14.5px;white-space:nowrap;max-width:0;overflow:hidden;transition:max-width .25s ease}'
		. '.jt-ai-fab:hover .jt-ai-fab__label,.jt-ai-fab:focus-visible .jt-ai-fab__label{max-width:160px}'
		. '.jt-ai-fab:focus-visible{outline:3px solid #e7c765;outline-offset:2px}'
		. '@media (max-width:768px){.jt-ai-fab{bottom:76px;inset-inline-end:12px}}'
		. '.jt-ai-inline{background:#f7f9fd;border:1px solid #dbe3f0;border-inline-start:4px solid #e7c765;border-radius:14px;padding:20px 22px;margin:28px 0}'
		. '.jt-ai-inline__t{font-size:18px;font-weight:800;color:#14213d;margin:0 0 6px}'
		. '.jt-ai-inline__s{font-size:14.5px;color:#44506b;line-height:1.55;margin:0 0 14px}'
		. '.jt-ai-inline__box{display:flex;gap:8px;background:#fff;border:1px solid #cbd6e8;border-radius:12px;padding:6px}'
		. '.jt-ai-inline__box input{flex:1;border:0;padding:10px 12px;font:inherit;font-size:15px;color:#14213d;background:transparent;min-width:0}'
		. '.jt-ai-inline__box input:focus{outline:none}'
		. '.jt-ai-inline__box:focus-within{box-shadow:0 0 0 3px rgba(231,199,101,.45)}'
		. '.jt-ai-inline__box button{background:linear-gradient(90deg,#e7c765,#d9b654);color:#14213d;border:0;border-radius:9px;padding:10px 20px;font-weight:800;font-size:14.5px;cursor:pointer;white-space:nowrap}'
		. '.jt-ai-inline__doc{display:inline-block;margin-top:10px;color:#1b2f55;font-weight:700;font-size:13.5px}'
		. '@media (max-width:560px){.jt-ai-inline{padding:16px}.jt-ai-inline__box{flex-direction:column}.jt-ai-inline__box button{width:100%}}'
		. '</style>';
}, 8 );
