<?php
/**
 * Content-first ordering for the reviewed Cyprus article cohort.
 *
 * The legacy article template can place country navigation, lawyer maps and
 * organic directory inventory before the editorial answer. This module moves
 * those known surfaces behind the article without changing their internal DOM.
 * It is deliberately limited to the eight URLs reviewed on 2026-08-03.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Normalize the current request path.
 */
function justice_ops_content_first_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Exact, evidence-reviewed release cohort. No taxonomy or substring matching.
 *
 * @return string[]
 */
function justice_ops_content_first_target_paths(): array {
	return array(
		'/about-cyprus/',
		'/avoiding-mistakes-when-buying-property-in-cyprus/',
		'/buy-real-estate-cyprus/',
		'/cyprus-corporate-tax/',
		'/cyprus-lawyer/',
		'/cyprus-prices/',
		'/real-estate-market-greece-cyprus/',
		'/real-estate-market-review-cyprus-guide-israelis-2025/',
	);
}

/**
 * Protect raw-text elements and comments during structural scans.
 *
 * @param array<string,string> $protected Token-to-source map.
 */
function justice_ops_content_first_protect_raw_text( string $html, array &$protected ): string {
	$protected = array();
	$prefix    = 'JTCF_' . substr( hash( 'sha256', $html ), 0, 12 );
	$updated   = preg_replace_callback(
		'#<(script|style|title|textarea|template|noscript|xmp)\b[^>]*>[\s\S]*?</\1\s*>|<!--[\s\S]*?-->#iu',
		static function ( array $match ) use ( &$protected, $prefix ): string {
			$token               = '<!--' . $prefix . '_' . count( $protected ) . '-->';
			$protected[ $token ] = $match[0];

			return $token;
		},
		$html
	);

	return is_string( $updated ) ? $updated : $html;
}

/**
 * Read class tokens from one opening tag.
 *
 * @return string[]
 */
function justice_ops_content_first_tag_classes( string $tag_html ): array {
	$matched = preg_match(
		'#(?:^|[\x20\t\r\n\f])class\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))#iu',
		$tag_html,
		$class_match
	);

	if ( 1 !== $matched ) {
		return array();
	}

	$value = '';
	foreach ( array( 1, 2, 3 ) as $index ) {
		if ( isset( $class_match[ $index ] ) && '' !== $class_match[ $index ] ) {
			$value = $class_match[ $index ];
			break;
		}
	}

	return '' === trim( $value ) ? array() : preg_split( '/\s+/u', trim( $value ) );
}

/**
 * Scan HTML tags without treating a greater-than sign inside quotes as a close.
 * Raw-text elements must be protected before calling this function.
 *
 * @return array<int,array{start:int,end:int,html:string,name:string,closing:bool,self_closing:bool,classes:array}>
 */
function justice_ops_content_first_scan_tags( string $html ): array {
	$tags        = array();
	$length      = strlen( $html );
	$cursor      = 0;
	$void_names  = array( 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr' );

	while ( $cursor < $length ) {
		$start = strpos( $html, '<', $cursor );
		if ( false === $start ) {
			break;
		}

		$quote = '';
		$end   = null;
		for ( $i = $start + 1; $i < $length; $i++ ) {
			$char = $html[ $i ];
			if ( '' !== $quote ) {
				if ( $char === $quote ) {
					$quote = '';
				}
				continue;
			}
			if ( '"' === $char || "'" === $char ) {
				$quote = $char;
				continue;
			}
			if ( '>' === $char ) {
				$end = $i + 1;
				break;
			}
		}

		if ( null === $end ) {
			break;
		}

		$tag_html = substr( $html, $start, $end - $start );
		if ( 1 === preg_match( '#^<\s*(/?)\s*([a-z][a-z0-9:-]*)\b#iu', $tag_html, $match ) ) {
			$name         = strtolower( $match[2] );
			$closing      = '/' === $match[1];
			$self_closing = ! $closing && ( 1 === preg_match( '#/\s*>$#u', $tag_html ) || in_array( $name, $void_names, true ) );
			$tags[]       = array(
				'start'        => $start,
				'end'          => $end,
				'html'         => $tag_html,
				'name'         => $name,
				'closing'      => $closing,
				'self_closing' => $self_closing,
				'classes'      => $closing ? array() : justice_ops_content_first_tag_classes( $tag_html ),
			);
		}

		$cursor = $end;
	}

	return $tags;
}

/**
 * Find all balanced elements carrying an exact class token.
 *
 * Null means at least one matching opening element was malformed.
 *
 * @param array $tags Output of justice_ops_content_first_scan_tags().
 * @return array<int,array{start:int,end:int,open_end:int,close_start:int,element:string}>|null
 */
function justice_ops_content_first_find_class_blocks( string $html, array $tags, string $class_name ): ?array {
	$opening_indexes = array();
	foreach ( $tags as $index => $tag ) {
		if ( ! $tag['closing'] && in_array( $class_name, $tag['classes'], true ) ) {
			$opening_indexes[] = $index;
		}
	}

	$blocks = array();
	foreach ( $opening_indexes as $opening_index ) {
		$opening = $tags[ $opening_index ];
		if ( $opening['self_closing'] ) {
			return null;
		}

		$depth = 1;
		$close = null;
		for ( $i = $opening_index + 1, $count = count( $tags ); $i < $count; $i++ ) {
			$tag = $tags[ $i ];
			if ( $tag['name'] !== $opening['name'] ) {
				continue;
			}
			if ( $tag['closing'] ) {
				--$depth;
				if ( 0 === $depth ) {
					$close = $tag;
					break;
				}
			} elseif ( ! $tag['self_closing'] ) {
				++$depth;
			}
		}

		if ( null === $close ) {
			return null;
		}

		$blocks[] = array(
			'start'       => $opening['start'],
			'end'         => $close['end'],
			'open_end'    => $opening['end'],
			'close_start' => $close['start'],
			'element'     => substr( $html, $opening['start'], $close['end'] - $opening['start'] ),
		);
	}

	return $blocks;
}

/**
 * Whether one parsed block is wholly inside another.
 */
function justice_ops_content_first_block_contains( array $outer, array $inner ): bool {
	return $inner['start'] > $outer['start'] && $inner['end'] < $outer['end'];
}

/**
 * Remove only repeated generated sec-N IDs from later H2 elements.
 *
 * The first occurrence remains the stable fragment target. Other IDs are not
 * rewritten because duplicate form, map or widget IDs indicate a structural
 * failure that acceptance tests must catch rather than silently rename.
 */
function justice_ops_content_first_dedupe_heading_ids( string $content ): string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $content, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$seen      = array();
	$changes   = array();

	foreach ( $tags as $tag ) {
		if ( $tag['closing'] || 'h2' !== $tag['name'] ) {
			continue;
		}
		if ( 1 !== preg_match( '/\sid\s*=\s*(?:"(sec-\d+)"|\'(sec-\d+)\'|(sec-\d+)(?:\s|>))/iu', $tag['html'], $id_match ) ) {
			continue;
		}
		$id = '';
		foreach ( array( 1, 2, 3 ) as $index ) {
			if ( '' !== ( $id_match[ $index ] ?? '' ) ) {
				$id = strtolower( $id_match[ $index ] );
				break;
			}
		}
		if ( '' === $id ) {
			continue;
		}
		if ( ! isset( $seen[ $id ] ) ) {
			$seen[ $id ] = true;
			continue;
		}
		$replacement = preg_replace(
			'/\sid\s*=\s*(?:"sec-\d+"|\'sec-\d+\'|sec-\d+(?=\s|>))/iu',
			'',
			$tag['html'],
			1
		);
		if ( is_string( $replacement ) && $replacement !== $tag['html'] ) {
			$changes[] = array(
				'start' => $tag['start'],
				'end'   => $tag['end'],
				'html'  => $replacement,
			);
		}
	}

	usort( $changes, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $changes as $change ) {
		$masked = substr_replace( $masked, $change['html'], $change['start'], $change['end'] - $change['start'] );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Move the reviewed provider-navigation modules behind editorial content.
 */
function justice_ops_content_first_reorder_html( string $content ): string {
	if ( '' === $content ) {
		return $content;
	}

	// A real marker is idempotent. A literal marker collision is unexpected.
	// Both cases fail closed and preserve the exact input bytes.
	if ( false !== strpos( $content, 'data-jt-content-first-order' ) || false !== strpos( $content, 'jt-content-first-order' ) ) {
		return $content;
	}

	$original  = $content;
	$protected = array();
	$content   = justice_ops_content_first_protect_raw_text( $content, $protected );
	$tags      = justice_ops_content_first_scan_tags( $content );
	$classes   = array( 'single-article__fold', 'jt-cmenu', 'jt-firm-strip' );
	$blocks    = array();

	foreach ( $classes as $class_name ) {
		$found = justice_ops_content_first_find_class_blocks( $content, $tags, $class_name );
		if ( null === $found || count( $found ) > 1 ) {
			return $original;
		}
		$blocks[ $class_name ] = $found[0] ?? null;
	}

	$fold = $blocks['single-article__fold'];
	$menu = $blocks['jt-cmenu'];
	$strip = $blocks['jt-firm-strip'];

	// The live Cyprus DOM nests jt-cmenu inside the fold's jtcm-wrap. The fold
	// must move as one byte-identical unit. The reverse nesting is invalid.
	if ( null !== $fold && null !== $menu && justice_ops_content_first_block_contains( $menu, $fold ) ) {
		return $original;
	}
	if ( null !== $fold && null !== $strip && justice_ops_content_first_block_contains( $strip, $fold ) ) {
		return $original;
	}

	$moved = array();
	if ( null !== $menu && ( null === $fold || ! justice_ops_content_first_block_contains( $fold, $menu ) ) ) {
		$moved['jt-cmenu'] = $menu;
	}
	if ( null !== $fold ) {
		$moved['single-article__fold'] = $fold;
	}
	if ( null !== $strip && ( null === $fold || ! justice_ops_content_first_block_contains( $fold, $strip ) ) ) {
		$moved['jt-firm-strip'] = $strip;
	}

	if ( empty( $moved ) ) {
		return $original;
	}

	// Any overlap not explained by a descendant retained inside the fold is an
	// unexpected tree shape. Do not attempt a partial reorder.
	$ranges = array_values( $moved );
	for ( $i = 0, $count = count( $ranges ); $i < $count; $i++ ) {
		for ( $j = $i + 1; $j < $count; $j++ ) {
			if ( $ranges[ $i ]['start'] < $ranges[ $j ]['end'] && $ranges[ $j ]['start'] < $ranges[ $i ]['end'] ) {
				return $original;
			}
		}
	}

	usort( $ranges, static function ( array $a, array $b ): int {
		return $b['start'] <=> $a['start'];
	} );
	foreach ( $ranges as $range ) {
		$content = substr_replace( $content, '', $range['start'], $range['end'] - $range['start'] );
	}

	$tail = '<div class="jt-content-first-order" data-jt-content-first-order="2026-08-03-r2">';
	foreach ( array( 'jt-cmenu', 'single-article__fold', 'jt-firm-strip' ) as $class_name ) {
		if ( isset( $moved[ $class_name ] ) ) {
			$tail .= $moved[ $class_name ]['element'];
		}
	}
	$tail   .= '</div>';
	$content = rtrim( $content ) . $tail;

	return empty( $protected ) ? $content : strtr( $content, $protected );
}

/**
 * Apply the ordering only to the main rendered body of the exact cohort.
 */
function justice_ops_content_first_filter( $content ): string {
	$content = (string) $content;

	if (
		! is_singular( 'articles' )
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

	if ( ! in_array( justice_ops_content_first_request_path(), justice_ops_content_first_target_paths(), true ) ) {
		return $content;
	}

	$ordered = justice_ops_content_first_reorder_html( $content );
	$marked  = 1 === preg_match( '#<div\b[^>]*class=["\'][^"\']*\bjt-content-first-order\b[^"\']*["\'][^>]*>#iu', $ordered );

	return $ordered !== $content || $marked
		? justice_ops_content_first_dedupe_heading_ids( $ordered )
		: $content;
}
add_filter( 'the_content', 'justice_ops_content_first_filter', PHP_INT_MAX );
