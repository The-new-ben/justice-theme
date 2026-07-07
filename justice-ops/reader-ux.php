<?php
/**
 * Reader UX for long-form content: an automatic table of contents on any
 * article or encyclopedia entry with four or more sections (collapsible on
 * mobile, open on desktop, anchored h2 ids for deep links), plus a thin
 * reading-progress bar. Both render-layer only, brand palette, RTL.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( array( 'articles', 'justice_term' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( false !== strpos( $content, 'jt-toc' ) ) {
		return $content;
	}

	if ( ! preg_match_all( '/<h2([^>]*)>(.*?)<\/h2>/su', $content, $matches, PREG_OFFSET_CAPTURE ) ) {
		return $content;
	}

	if ( count( $matches[0] ) < 4 ) {
		return $content;
	}

	$items = '';
	$index = 0;

	foreach ( $matches[0] as $i => $match ) {
		$attrs = $matches[1][ $i ][0];
		$label = trim( wp_strip_all_tags( $matches[2][ $i ][0] ) );

		if ( '' === $label ) {
			continue;
		}

		$index++;
		$anchor = 'sec-' . $index;

		if ( false === strpos( $attrs, 'id=' ) ) {
			$content = str_replace( $match[0], '<h2 id="' . $anchor . '"' . $attrs . '>' . $matches[2][ $i ][0] . '</h2>', $content );
		} else {
			preg_match( '/id="([^"]+)"/', $attrs, $id_match );
			$anchor = $id_match[1] ?? $anchor;
		}

		$items .= '<li><a href="#' . esc_attr( $anchor ) . '">' . esc_html( mb_substr( $label, 0, 70 ) ) . '</a></li>';
	}

	if ( '' === $items ) {
		return $content;
	}

	$toc = '<details class="jt-toc"><summary>בעמוד הזה</summary><ol>' . $items . '</ol></details>';

	// After the first paragraph close.
	$pos = strpos( $content, '</p>' );

	return false === $pos
		? $toc . $content
		: substr( $content, 0, $pos + 4 ) . $toc . substr( $content, $pos + 4 );
}, 14 );

add_action( 'wp_head', function () {
	if ( ! is_singular( array( 'articles', 'justice_term', 'justice_question' ) ) ) {
		return;
	}

	echo '<style id="jt-reader-css">'
		. '.jt-toc{border:1.5px solid transparent;border-radius:14px;background:linear-gradient(#f8fafd,#f8fafd) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:6px 16px;margin:20px 0}'
		. '.jt-toc summary{cursor:pointer;font-weight:800;color:#14213d;padding:8px 0;list-style:none;display:flex;align-items:center;gap:8px}'
		. '.jt-toc summary::before{content:"";width:9px;height:9px;border-inline-start:2.5px solid #b98f2e;border-block-end:2.5px solid #b98f2e;transform:rotate(-45deg);transition:transform .18s ease;display:inline-block}'
		. '.jt-toc[open] summary::before{transform:rotate(135deg)}'
		. '.jt-toc ol{margin:4px 0 12px;padding-inline-start:20px}'
		. '.jt-toc li{margin:7px 0;line-height:1.5}'
		. '.jt-toc a{color:#2c3a58;text-decoration:none;font-size:14.5px;font-weight:600}'
		. '.jt-toc a:hover{color:#b98f2e}'
		. 'html{scroll-behavior:smooth}'
		. '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'
		. '#jt-progress{position:fixed;inset-block-start:0;inset-inline-start:0;height:3px;width:0;background:linear-gradient(90deg,#e7c765,#b98f2e);z-index:99999;transition:width .1s linear}'
		. '</style>';
	// Desktop: TOC starts open; mobile stays collapsed for thumb reach.
	echo '<script>document.addEventListener("DOMContentLoaded",function(){var t=document.querySelector(".jt-toc");if(t&&window.innerWidth>760){t.setAttribute("open","")}});</script>';
}, 41 );

add_action( 'wp_footer', function () {
	if ( ! is_singular( array( 'articles', 'justice_term', 'justice_question' ) ) ) {
		return;
	}
	?>
	<div id="jt-progress" aria-hidden="true"></div>
	<script>(function(){var b=document.getElementById('jt-progress');if(!b)return;var t;function u(){var d=document.documentElement,m=d.scrollHeight-d.clientHeight;b.style.width=(m>0?(d.scrollTop/m)*100:0)+'%'}window.addEventListener('scroll',function(){if(t)return;t=setTimeout(function(){t=null;u()},40)},{passive:true});u();})();</script>
	<?php
}, 66 );
