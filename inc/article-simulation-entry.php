<?php
/** Contextual product entry. Read-only rendering; no content or SEO writes. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function justice_theme_article_simulation_topic( int $post_id ): string {
	$slug = (string) get_post_field( 'post_name', $post_id );
	$cluster = function_exists( 'justice_theme_cluster_for_slug' ) ? justice_theme_cluster_for_slug( $slug ) : null;
	$key = $cluster['key'] ?? '';
	// Published criminal guides predate the entity-wave registry. Classify their
	// simulation context only; do not change keyword ownership or content links.
	if ( ! $key && in_array( $slug, array(
		'police-investigation-rights', 'consultation-before-police-questioning',
		'recording-interrogation-documentation', 'summons-interrogation-warning-rights',
		'detention-days', 'expunge-closed-cases-record', 'criminal-evidence',
		'criminal-record-deletion', 'dangerous-drugs-ordinance', 'drug-possession',
	), true ) ) { $key = 'criminal-law'; }
	if ( ! $key && 'family-law' === $slug ) { $key = 'family-law'; }
	// Read Claude's registry without changing files, seeded pages, or relationships.
	if ( ! $key && function_exists( 'justice_ops_entity_waves' ) ) {
		static $entity_pillars = null;
		if ( null === $entity_pillars ) {
			$entity_pillars = array();
			foreach ( justice_ops_entity_waves() as $file ) {
				$entries = include $file;
				foreach ( (array) $entries as $entry ) {
					if ( ! empty( $entry['slug'] ) && ! empty( $entry['pillar'] ) ) {
						$entity_pillars[ $entry['slug'] ] = $entry['pillar'];
					}
				}
			}
		}
		$pillar = $entity_pillars[ $slug ] ?? '';
		if ( $pillar && function_exists( 'justice_theme_cluster_for_slug' ) ) {
			$cluster = justice_theme_cluster_for_slug( $pillar );
			$key = $cluster['key'] ?? ( 'family-law' === $pillar ? 'family-law' : '' );
		}
	}
	if ( ! $key && function_exists( 'justice_theme_get_primary_practice_area' ) ) {
		$term = justice_theme_get_primary_practice_area( $post_id );
		$aliases = array( 'family-law' => 'family-law', 'criminal-law' => 'criminal-law',
			'real-estate-law' => 'real-estate', 'traffic-law' => 'traffic-law', 'labor-law' => 'employment',
			'inheritance-law' => 'inheritance', 'medical-malpractice' => 'medical-malpractice',
			'medical-malpractice-law' => 'medical-malpractice', 'torts' => 'personal-injury',
			'personal-injury-law' => 'personal-injury', 'tax-law' => 'tax', 'immigration-law' => 'immigration' );
		$key = $term && ! is_wp_error( $term ) ? ( $aliases[ $term->slug ] ?? '' ) : '';
	}
	if ( 'family-law' === $key && false !== strpos( $slug, 'divorce' ) ) { return 'divorce'; }
	return in_array( $key, array( 'family-law', 'criminal-law', 'real-estate', 'medical-malpractice',
		'personal-injury', 'traffic-law', 'employment', 'inheritance', 'immigration', 'international-real-estate', 'tax' ), true ) ? $key : '';
}

function justice_theme_article_simulation_url( string $topic, string $purpose ): string {
	$purpose = in_array( $purpose, array( 'court_rehearsal', 'mediation', 'witness_prep' ), true ) ? $purpose : 'court_rehearsal';
	$params = array( 'entry' => 'role', 'audience' => 'guest', 'lang' => 'he',
		'purpose' => $purpose, 'topic' => $topic );
	return 'https://jus-tice.com/#/simulation?' . http_build_query( $params, '', '&', PHP_QUERY_RFC3986 );
}

function justice_theme_article_simulation_entry( string $content ): string {
	$post_id = (int) get_the_ID();
	// Practice landing templates render their queried page body outside WP's loop.
	// Accept that one page, never a related card or secondary query.
	if ( is_admin() || is_feed() || ! is_singular( array( 'post', 'page', 'articles' ) ) || ! is_main_query()
		|| $post_id !== (int) get_queried_object_id()
		|| ! function_exists( 'justice_theme_new_look_active' ) || ! justice_theme_new_look_active()
		|| false !== strpos( $content, 'data-hadmaia-article-entry' ) ) { return $content; }
	$topic = justice_theme_article_simulation_topic( $post_id );
	if ( ! $topic ) { return $content; }
	$mediation = ! in_array( $topic, array( 'criminal-law', 'traffic-law', 'immigration', 'tax' ), true );
	$block = '<aside class="l3-article-simulation" data-hadmaia-article-entry="' . esc_attr( $topic ) . '" aria-label="תרגול המקרה שלכם">'
		. '<a class="l3-article-simulation__visual" href="' . esc_url( justice_theme_article_simulation_url( $topic, 'court_rehearsal' ) ) . '" aria-label="פתיחת סימולציה של דיון"><img src="https://jus-tice.com/brand/hadmaya-hearing-live-v2.webp" alt="דיון חי בסימולציה: שופטת, שני הצדדים, עורכי הדין והתמליל" width="1600" height="800" loading="lazy" decoding="async"><span>Hadmaya <span aria-hidden="true">↗</span></span></a>'
		// The detail clause is hidden on phones (compact card); the sentence still reads whole.
		. '<div><strong>מה יגידו לכם בדיון על המקרה הזה?</strong><p>ספרו את המקרה שלכם במילים שלכם וראו תוך דקות איך הוא נשמע בבית המשפט<span class="l3-article-simulation__more">: הטענות של הצד השני, השאלות שישאלו אתכם והנקודות שיכריעו</span>. בלי הרשמה, בלי עורך דין בשלב הזה.</p></div>'
		. '<div class="l3-article-simulation__actions"><a href="' . esc_url( justice_theme_article_simulation_url( $topic, 'court_rehearsal' ) ) . '">לבדוק איך המקרה שלי נשמע</a>';
	if ( $mediation ) {
		$block .= '<a class="l3-article-simulation__secondary" href="' . esc_url( justice_theme_article_simulation_url( $topic, 'mediation' ) ) . '">לנסות גישור לפני בית משפט</a>';
	}
	if ( 'criminal-law' === $topic ) {
		$message = "שלום, אני מתעניין/ת בפיילוט של סימולציית חקירה במשטרה.\nהגעתי מהעמוד: "
			. wp_strip_all_tags( get_the_title( $post_id ) ) . "\n" . get_permalink( $post_id );
		$block .= '<p class="l3-investigation-interest">רוצים להתכונן לחקירה במשטרה? דברו איתנו על השתתפות בפיילוט.</p>'
			. '<a class="l3-article-simulation__secondary" data-investigation-interest="pilot" data-whatsapp-surface="investigation_simulation_interest" href="'
			. esc_url( 'https://wa.me/972525101555?text=' . rawurlencode( $message ) )
			. '" target="_blank" rel="noopener noreferrer">פנייה לגבי סימולציית חקירה</a>';
	}
	$block .= '</div><small>סימולציה להכנה, לא ייעוץ משפטי.</small></aside>';
	// Preserve the article and Claude's contextual links exactly: the card is only inserted.
	$at = justice_theme_article_simulation_offset( $content );
	return null === $at ? $content . $block : substr_replace( $content, $block, $at, 0 );
}
add_filter( 'the_content', 'justice_theme_article_simulation_entry', 30 );

/**
 * Byte offset for the simulation card, or null to append it.
 *
 * Owner review 24.9.2026 (HAD-284): the card comes after the answer box or the first section,
 * with at least ~250 words of reading text before it. The old rule (after the third </p>)
 * counted one-line paragraphs such as "ב"ה" or a case number, so 13 of 70 sampled pages had
 * under 150 words above the card, and on short city pages the third </p> belonged to the
 * appended cluster box, which put the card inside it.
 *
 * Only top-level blocks are considered, so the card never lands inside a list, a table, the
 * table of contents or another card. It goes after a reading block and before another reading
 * block (empty paragraphs are skipped; one-line label paragraphs never anchor it), never next to
 * the professional card or the mid-article strip. A slot right before the table of contents that
 * leads into a heading closes the first section; the card never sits between the contents and its
 * heading. A section end (before
 * an <h2>) within ~350 words of the first valid slot is preferred. Short pages get the card
 * right after their last reading block, before the appended boxes.
 */
function justice_theme_article_simulation_offset( string $content, int $min_words = 250 ): ?int {
	$blocks = justice_theme_article_simulation_blocks( $content );
	$answer_end = 0;
	foreach ( $blocks as $block ) {
		if ( preg_match( '/\bjt-answer\b/', $block['class'] ) ) { $answer_end = $block['end']; break; }
	}
	$words = 0; $first = null; $last_reading = null; $count = count( $blocks );
	for ( $i = 0; $i < $count; $i++ ) {
		$block = $blocks[ $i ];
		if ( ! $block['reading'] ) { continue; }
		$words += $block['words'];
		if ( $block['heading'] || $block['empty'] ) { continue; }
		$last_reading = $block['end'];
		// Empty paragraphs are spacing, not neighbours: "<p></p><nav class=jt-nav-toc>" still
		// means the table of contents comes next (seen live on the certificate page, 25.9.2026).
		$j = $i + 1;
		while ( isset( $blocks[ $j ] ) && $blocks[ $j ]['empty'] ) { $j++; }
		$next = $blocks[ $j ] ?? null;
		// The reader-ux table of contents sits between the first section and its heading, so a slot
		// right before it closes the first section. The card never goes between the contents and
		// the heading, nor next to the contents anywhere else.
		$k = $j + 1;
		while ( isset( $blocks[ $k ] ) && $blocks[ $k ]['empty'] ) { $k++; }
		$toc_then_heading = $next && $next['toc'] && isset( $blocks[ $k ] ) && $blocks[ $k ]['heading'];
		$section_end = $next && ( 'h2' === $next['name'] || $toc_then_heading );
		if ( $words < $min_words || $block['end'] < $answer_end || ! $next || ! ( $next['reading'] || $toc_then_heading ) ) { continue; }
		// A one-line label ("REQUEST FOR CONFIRMATION...", "להורדת הטופס") introduces what follows.
		if ( 'p' === $block['name'] && $block['words'] < 12 && ! $section_end ) { continue; }
		// "The documents you need:" introduces the list that follows; keep them together.
		if ( 'p' === $block['name'] && ':' === $block['last_char'] && ! $next['heading'] ) { continue; }
		if ( null === $first ) { $first = array( 'at' => $block['end'], 'words' => $words ); }
		elseif ( $words > $first['words'] + 350 ) { break; }
		if ( $section_end ) { return $block['end']; }
	}
	if ( null !== $first ) { return $first['at']; }
	return $last_reading;
}

/**
 * Top-level blocks of the rendered article: tag, class, byte range, reading words.
 * Reading blocks are the article text (paragraphs, lists, tables, headings, the answer box and
 * its sibling components). Navigation, asides, the table of contents and the theme's own strips
 * are not reading text and are never counted.
 */
function justice_theme_article_simulation_blocks( string $content ): array {
	$void = array( 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr' );
	$raw = array( 'script', 'style', 'textarea', 'template', 'svg' );
	$closes_p = array( 'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'figure', 'footer', 'form',
		'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul' );
	$reading = array( 'p', 'ul', 'ol', 'dl', 'table', 'figure', 'blockquote', 'pre', 'h2', 'h3', 'h4', 'h5', 'h6' );
	$blocks = array(); $stack = array(); $open = null; $pos = 0; $length = strlen( $content );
	while ( $pos < $length && preg_match( '/<!--.*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"\']|"[^"]*"|\'[^\']*\')*)>/s', $content, $tag, PREG_OFFSET_CAPTURE, $pos ) ) {
		$start = $tag[0][1]; $end = $start + strlen( $tag[0][0] ); $pos = $end;
		if ( ! isset( $tag[2] ) || '' === $tag[2][0] ) { continue; } // Comment.
		$name = strtolower( $tag[2][0] ); $closing = '/' === $tag[1][0];
		if ( ! $closing && $stack && 'p' === end( $stack ) && in_array( $name, $closes_p, true ) ) {
			array_pop( $stack ); // A block tag implicitly closes an open paragraph.
			if ( ! $stack && $open ) { $open['end'] = $start; $blocks[] = $open; $open = null; }
		}
		if ( $closing ) {
			$index = array_search( $name, array_reverse( $stack, true ), true );
			if ( false === $index ) { continue; } // Stray closing tag.
			$stack = array_slice( $stack, 0, $index );
			if ( ! $stack && $open ) { $open['end'] = $end; $blocks[] = $open; $open = null; }
			continue;
		}
		if ( in_array( $name, $void, true ) || '/' === substr( rtrim( $tag[3][0] ), -1 ) ) { continue; }
		if ( ! $stack ) {
			$class = preg_match( '/\bclass\s*=\s*(["\'])(.*?)\1/is', $tag[3][0], $c ) ? $c[2] : '';
			$open = array( 'name' => $name, 'class' => $class, 'start' => $start );
		}
		if ( in_array( $name, $raw, true ) ) {
			$close = stripos( $content, '</' . $name, $end );
			$pos = false === $close ? $length : ( strpos( $content, '>', $close ) ?: $length - 1 ) + 1;
			if ( ! $stack && $open ) { $open['end'] = $pos; $blocks[] = $open; $open = null; }
			continue;
		}
		$stack[] = $name;
	}
	if ( $open ) { $open['end'] = $length; $blocks[] = $open; }
	foreach ( $blocks as &$block ) {
		$component = 'div' === $block['name'] && ( '' === trim( $block['class'] )
			|| preg_match( '/\b(?:jt-answer|jt-keyfacts|jt-steps|jt-note|wp-block-group)\b/', $block['class'] ) );
		$block['reading'] = ( in_array( $block['name'], $reading, true ) || $component )
			&& ! preg_match( '/\b(?:jt-procard|jt-toc|jt-nav-toc|cluster-backlink|jt-film-card)\b/', $block['class'] );
		$block['heading'] = (bool) preg_match( '/^h[2-6]$/', $block['name'] );
		// Block tags become word breaks: "<li>א</li><li>ב</li>" is two words, not one.
		$html = $block['reading'] ? preg_replace( '#<(?:/?(?:p|li|td|th|tr|div|h[1-6]|dt|dd|blockquote|figcaption)\b|br\b)[^>]*>#i', ' $0', substr( $content, $block['start'], $block['end'] - $block['start'] ) ) : '';
		// Non-breaking spaces ("<p>&nbsp;</p>") and direction marks are spacing, not words.
		$text = '' === $html ? '' : trim( (string) preg_replace( '/[\s\x{00A0}\x{200B}-\x{200F}]+/u', ' ', html_entity_decode( wp_strip_all_tags( $html ), ENT_QUOTES, 'UTF-8' ) ) );
		$block['words'] = '' === $text ? 0 : count( preg_split( '/\s+/u', $text ) ?: array() );
		$block['last_char'] = '' === $text ? '' : mb_substr( $text, -1 );
		$block['toc'] = in_array( $block['name'], array( 'nav', 'details' ), true ) && (bool) preg_match( '/\bjt-(?:nav-)?toc\b/', $block['class'] );
		$block['empty'] = 'p' === $block['name'] && 0 === $block['words']
			&& ! preg_match( '/<(?:img|picture|video|iframe|svg|table|input|button|a)\b/i', substr( $content, $block['start'], $block['end'] - $block['start'] ) );
	}
	unset( $block );
	return $blocks;
}
