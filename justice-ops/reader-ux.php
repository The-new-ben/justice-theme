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

/**
 * Build a TOC from editorial H2 elements only.
 *
 * The Cyprus country/map fold contains its own interface heading. That
 * heading describes a provider module, not a section of the legal article,
 * so it keeps its historic anchor but is excluded from TOC items and the
 * editorial-section threshold.
 */
function justice_reader_ux_filter_content( $content ): string {
	$content = (string) $content;

	if (
		! is_singular( array( 'articles', 'justice_term' ) )
		|| ! in_the_loop()
		|| ! is_main_query()
		|| is_feed()
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() )
		|| ( function_exists( 'is_preview' ) && is_preview() )
		|| ( function_exists( 'is_embed' ) && is_embed() )
		|| ( function_exists( 'is_admin' ) && is_admin() )
	) {
		return $content;
	}

	foreach ( array( 'preview', 'feed', 'embed', 'rest_route' ) as $variant ) {
		if ( isset( $_GET[ $variant ] ) ) {
			return $content;
		}
	}

	if ( false !== strpos( $content, 'jt-toc' ) ) {
		return $content;
	}

	if (
		! function_exists( 'justice_ops_content_first_protect_raw_text' )
		|| ! function_exists( 'justice_ops_content_first_scan_tags' )
		|| ! function_exists( 'justice_ops_content_first_find_class_blocks' )
	) {
		return $content;
	}

	$raw_protected = array();
	$masked        = justice_ops_content_first_protect_raw_text( $content, $raw_protected );
	$tags          = justice_ops_content_first_scan_tags( $masked );
	$folds         = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__fold' );

	// Multiple or malformed folds are an unreviewed layout. Do not risk stale
	// overlapping offsets or build a TOC that disagrees with the final DOM.
	if ( null === $folds || count( $folds ) > 1 ) {
		return $content;
	}
	$fold = $folds[0] ?? null;

	if ( ! preg_match_all( '/<h2([^>]*)>(.*?)<\/h2>/isu', $masked, $matches, PREG_OFFSET_CAPTURE ) ) {
		return $content;
	}

	$items        = '';
	$ordinal     = 0;
	$eligible    = 0;
	$replacements = array();

	foreach ( $matches[0] as $i => $match ) {
		$attrs = $matches[1][ $i ][0];
		$label = html_entity_decode(
			trim( wp_strip_all_tags( $matches[2][ $i ][0] ) ),
			ENT_QUOTES | ENT_HTML5,
			'UTF-8'
		);

		if ( '' === $label ) {
			continue;
		}

		// Preserve the historic sec-N ordinal, including a skipped fold H2, so
		// existing fragment links do not shift when the TOC stops listing it.
		$ordinal++;
		$offset      = (int) $match[1];
		$inside_fold = null !== $fold && $offset >= $fold['start'] && ( $offset + strlen( $match[0] ) ) <= $fold['end'];
		$anchor = 'sec-' . $ordinal;

		if ( 1 === preg_match( '/(?:^|\s)id\s*=\s*(?:"([^"]+)"|\'([^\']+)\'|([^\s>]+))/iu', $attrs, $id_match ) ) {
			foreach ( array( 1, 2, 3 ) as $id_index ) {
				if ( '' !== ( $id_match[ $id_index ] ?? '' ) ) {
					$anchor = $id_match[ $id_index ];
					break;
				}
			}
		} else {
			$replacements[] = array(
				'offset' => (int) $match[1],
				'length' => strlen( $match[0] ),
				'html'   => '<h2 id="' . $anchor . '"' . $attrs . '>' . $matches[2][ $i ][0] . '</h2>',
			);
		}
		if ( $inside_fold ) {
			continue;
		}

		$eligible++;
		$items .= '<li><a href="#' . esc_attr( $anchor ) . '">' . esc_html( mb_substr( $label, 0, 70 ) ) . '</a></li>';
	}

	if ( '' === $items || $eligible < 4 ) {
		return $content;
	}

	usort( $replacements, static function ( array $a, array $b ): int {
		return $b['offset'] <=> $a['offset'];
	} );
	foreach ( $replacements as $replacement ) {
		$masked = substr_replace( $masked, $replacement['html'], $replacement['offset'], $replacement['length'] );
	}

	$toc = '<details class="jt-toc"><summary>בעמוד הזה</summary><ol>' . $items . '</ol></details>';

	// Reparse after ID insertion, then choose the first paragraph outside the
	// provider fold. Raw-text elements remain protected.
	$updated_tags  = justice_ops_content_first_scan_tags( $masked );
	$updated_folds = justice_ops_content_first_find_class_blocks( $masked, $updated_tags, 'single-article__fold' );
	if ( null === $updated_folds || count( $updated_folds ) > 1 ) {
		return $content;
	}
	$updated_fold = $updated_folds[0] ?? null;
	$pos          = false;
	if ( preg_match_all( '#</p\s*>#iu', $masked, $paragraphs, PREG_OFFSET_CAPTURE ) ) {
		foreach ( $paragraphs[0] as $paragraph ) {
			$paragraph_at = (int) $paragraph[1];
			if ( null === $updated_fold || $paragraph_at < $updated_fold['start'] || $paragraph_at >= $updated_fold['end'] ) {
				$pos = $paragraph_at + strlen( $paragraph[0] );
				break;
			}
		}
	}
	$masked = false === $pos
		? $toc . $masked
		: substr( $masked, 0, $pos ) . $toc . substr( $masked, $pos );

	if ( ! empty( $raw_protected ) ) {
		$masked = strtr( $masked, $raw_protected );
	}

	return $masked;
}
add_filter( 'the_content', 'justice_reader_ux_filter_content', 14 );

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
