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
		// Police pages with the most search impressions (GSC 27.8-24.9): the interrogation world fits them.
		'lahav-433', 'police-stations-israel-directory', 'posta', 'drug-offenses-criminal-lawyer',
		'apply-for-police-criminal-information-certificates', 'pre-indictment-hearing', 'testimony-investigation-law',
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
	// Pages no registry maps (28.9.2026: 947 of 1,840 addresses had no card) are classified by their
	// address. Divorce comes before real estate ("apartment-divorce-price-appraisal") and injury before
	// employment ("work-injury"). Legal articles that match nothing still get the general court card.
	if ( ! $key ) { $key = justice_theme_article_simulation_topic_from_slug( $slug ); }
	if ( ! $key && function_exists( 'get_post_type' ) && in_array( get_post_type( $post_id ), array( 'post', 'articles' ), true )
		&& ! preg_match( '/-(?:lawyers|attorneys)$/', $slug ) ) { return 'general'; }
	if ( 'family-law' === $key && false !== strpos( $slug, 'divorce' ) ) { return 'divorce'; }
	return in_array( $key, array( 'family-law', 'criminal-law', 'real-estate', 'medical-malpractice', 'divorce',
		'personal-injury', 'traffic-law', 'employment', 'inheritance', 'immigration', 'international-real-estate', 'tax' ), true ) ? $key : '';
}

/** A topic from the page address alone, or '' when the words say nothing specific. */
function justice_theme_article_simulation_topic_from_slug( string $slug ): string {
	$rules = array(
		'divorce'                   => '/divorce|alimony|custody|parental|prenup|child-support|spousal|agunah|get-refus/',
		'criminal-law'              => '/criminal|arrest|acquittal|indictment|police|interrogat|detention|(?:^|-)drugs?(?:-|$)|assault|fraud|theft|sexual-offen|juvenile/',
		'medical-malpractice'       => '/medical|malpractice|misdiagnos|surgery|hospital|birth-injur/',
		'personal-injury'           => '/injur|accident|damages|punitive|(?:^|-)torts?(?:-|$)|compensation|disabilit/',
		'employment'                => '/employ|labou?r|dismiss|severance|pension|salary|(?:^|-)wages?(?:-|$)|(?:^|-)work(?:ers?)?(?:-|$)/',
		'inheritance'               => '/inherit|probate|(?:^|-)wills?(?:-|$)|succession|estate-plan/',
		'traffic-law'               => '/traffic|driving|speeding|drunk-driv|licen[cs]e-(?:suspen|revok)/',
		'tax'                       => '/(?:^|-)tax(?:es|ation)?(?:-|$)/',
		'immigration'               => '/immigra|(?:^|-)visas?(?:-|$)|citizenship|aliyah|residency|green-card/',
		'international-real-estate' => '/real-estate-(?:italy|greece|cyprus|portugal|spain|france|germany|united-kingdom|uk|usa|united-states|dubai|thailand|georgia|romania|hungary|bulgaria|montenegro|turkey|canada|australia)|property-abroad/',
		'real-estate'               => '/apartment|real-estate|(?:^|-)land(?:-|$)|(?:^|-)rent(?:al)?(?:-|$)|lease|tenant|landlord|urban-renewal|(?:^|-)tama(?:-|$)|construction|condominium|mortgage/',
	);
	foreach ( $rules as $topic => $pattern ) {
		if ( preg_match( $pattern, $slug ) ) { return $topic; }
	}
	return '';
}

/**
 * The simulation world a topic opens, in the white card family (Claude Design canvas NmFS2DfEvmBhp1jTYNfmWg,
 * picked by Ben 28.9.2026). One question the reader could really be asked, the person who asks it, the lead
 * action and one alternative. Every figure is an AI character and is labelled so.
 */
function justice_theme_article_simulation_world( string $topic ): array {
	$court = array( 'world' => 'court', 'face' => 'judge', 'who' => 'השופטת · דמות AI', 'kicker' => 'שאלה מאולם בית המשפט · הדמיה',
		'text' => 'ספרו את המקרה במילים שלכם ושמעו תוך דקות את טענות הצד השני ואת השאלות שישאלו אתכם.',
		'cta' => 'לעלות לדיון עכשיו', 'lead' => 'court_rehearsal', 'alt' => 'לנסות קודם גישור', 'alt_purpose' => 'mediation' );
	$witness = array( 'world' => 'witness', 'face' => 'crossexam', 'who' => 'עו״ד הצד השני · דמות AI', 'kicker' => 'חקירה נגדית · הכנה לעדות',
		'text' => 'סימולציה של חקירה נגדית על העדות שלכם, עם עצירה, תיקון ומשוב על כל תשובה.',
		'cta' => 'להתכונן לעדות', 'lead' => 'witness_prep', 'alt' => 'איך התיק נשמע בדיון', 'alt_purpose' => 'court_rehearsal' );
	$worlds = array(
		'criminal-law' => array( 'world' => 'interrogation', 'face' => 'investigator', 'who' => 'החוקר · דמות AI', 'kicker' => 'שאלה מחדר החקירות · הדמיה',
			'quote' => 'אמרת שלא היית שם. אז איך ידעת שהחלון היה פתוח?',
			'text' => 'תענו בקול או בכתב. החוקר לוחץ כשאתם שותקים, ובסוף מקבלים תחקיר: איפה עזרתם לעצמכם ואיפה פגעתם.',
			'cta' => 'לענות לחוקר עכשיו', 'lead' => 'police_interrogation', 'alt' => 'איך זה נשמע בבית משפט', 'alt_purpose' => 'court_rehearsal' ),
		'immigration' => array( 'world' => 'authority', 'face' => 'authority', 'who' => 'נציגת הרשות · דמות AI', 'kicker' => 'ראיון מול רשות · הכנה',
			'quote' => 'איפה ומתי הכרתם, ומי עוד היה שם?',
			'text' => 'סימולציה של ראיון מול רשות האוכלוסין או גוף ממשלתי אחר, עם שאלות המשך ומשוב בסוף.',
			'cta' => 'להתכונן לראיון', 'lead' => 'witness_prep', 'alt' => 'איך זה נשמע בבית משפט', 'alt_purpose' => 'court_rehearsal' ),
		'divorce' => array( 'world' => 'mediation', 'face' => 'mediator', 'who' => 'המגשרת · דמות AI', 'kicker' => 'חדר הגישור · הדמיה',
			'quote' => 'מה הכי חשוב לכם שיישאר אחרי שתחתמו על ההסכם?',
			'text' => 'נסו גישור לפני בית משפט: מגשרת, הצד השני ואתם, בלי הרשמה.',
			'cta' => 'להתחיל גישור', 'lead' => 'mediation', 'alt' => 'ומה אם זה יגיע לבית משפט', 'alt_purpose' => 'court_rehearsal' ),
		'personal-injury' => array( 'quote' => 'בתצהיר כתבת שהכאב התחיל מיד. למה פנית לרופא רק אחרי שבוע?' ) + $witness,
		'medical-malpractice' => array( 'quote' => 'מה בדיוק הרופא אמר לך לפני הטיפול, ומי עוד שמע את זה?' ) + $witness,
		'employment' => array( 'quote' => 'מתי בדיוק הודיעו לך על הפיטורים, ומי עוד היה בחדר?' ) + $witness,
		'family-law' => array( 'quote' => 'מה אתם מבקשים מבית המשפט, ומה הצד השני יגיד על זה?' ) + $court,
		'inheritance' => array( 'quote' => 'מתי דיברתם עם המנוח בפעם האחרונה על הצוואה, ומה הוא אמר?' ) + $court,
		'real-estate' => array( 'quote' => 'איפה בחוזה כתוב מה שאתם טוענים עכשיו?' ) + $court,
		'international-real-estate' => array( 'quote' => 'מי בדק את הזכויות בנכס לפני שחתמתם, ומה הוא מצא?' ) + $court,
		'traffic-law' => array( 'quote' => 'באיזו מהירות נסעתם, ואיך אתם יודעים את זה?', 'alt' => 'להתכונן לעדות', 'alt_purpose' => 'witness_prep' ) + $court,
		'tax' => array( 'quote' => 'מאיפה הגיע הכסף שהופקד בחשבון באותו חודש?', 'alt' => 'להתכונן לעדות', 'alt_purpose' => 'witness_prep' ) + $court,
		'general' => array( 'quote' => 'מה אתם מבקשים מבית המשפט, ועל סמך אילו מסמכים?' ) + $court,
	);
	return $worlds[ $topic ] ?? $worlds['general'];
}

function justice_theme_article_simulation_url( string $topic, string $purpose ): string {
	$purpose = in_array( $purpose, array( 'court_rehearsal', 'mediation', 'witness_prep', 'police_interrogation' ), true ) ? $purpose : 'court_rehearsal';
	$params = array( 'entry' => 'role', 'audience' => 'guest', 'lang' => 'he', 'purpose' => $purpose );
	if ( '' !== $topic && 'general' !== $topic ) { $params['topic'] = $topic; }
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
	$w = justice_theme_article_simulation_world( $topic );
	$face = ( defined( 'JUSTICE_THEME_URI' ) ? JUSTICE_THEME_URI : '' ) . '/assets/images/hadmaya/' . $w['face'] . '.webp';
	$lead = justice_theme_article_simulation_url( $topic, $w['lead'] );
	$live = 'police_interrogation' === $w['lead'] ? ' data-investigation-entry="live"' : '';
	// The white card family (Ben 28.9.2026): the question a reader could be asked, the person who asks it,
	// one lead action and one alternative. The face link and the actions row keep their classes, because
	// the 28-second tour button (new-look.js) joins that row and opens the same lead link.
	$block = '<aside class="l3-article-simulation l3-simcard" data-hadmaia-article-entry="' . esc_attr( $topic ) . '" data-world="' . esc_attr( $w['world'] ) . '" aria-label="סימולציה של המקרה שלכם">'
		. '<a class="l3-article-simulation__visual l3-simcard__face" href="' . esc_url( $lead ) . '" aria-label="' . esc_attr( $w['cta'] ) . '">'
		. '<img src="' . esc_url( $face ) . '" alt="' . esc_attr( $w['who'] ) . '" width="360" height="360" loading="lazy" decoding="async">'
		. '<span class="l3-simcard__live"><i aria-hidden="true"></i>מדבר עכשיו</span><span class="l3-simcard__who">' . esc_html( $w['who'] ) . '</span></a>'
		. '<div class="l3-simcard__body"><p class="l3-simcard__kicker">' . esc_html( $w['kicker'] ) . '</p>'
		. '<p class="l3-simcard__quote">״' . esc_html( $w['quote'] ) . '״<span class="l3-simcard__caret" aria-hidden="true"></span></p>'
		. '<p class="l3-simcard__text">' . esc_html( $w['text'] ) . '</p>'
		. '<div class="l3-article-simulation__actions l3-simcard__actions"><a class="l3-simcard__cta"' . $live . ' href="' . esc_url( $lead ) . '">' . esc_html( $w['cta'] ) . '</a>'
		. '<a class="l3-article-simulation__secondary l3-simcard__alt" href="' . esc_url( justice_theme_article_simulation_url( $topic, $w['alt_purpose'] ) ) . '">' . esc_html( $w['alt'] ) . '</a></div>'
		. '<small class="l3-simcard__note">סימולציה להכנה, לא ייעוץ משפטי · דמויות AI</small></div></aside>';
	// Preserve the article and Claude's contextual links exactly: the card is only inserted.
	$at = justice_theme_article_simulation_offset( $content );
	return null === $at ? $content . $block : substr_replace( $content, $block, $at, 0 );
}
add_filter( 'the_content', 'justice_theme_article_simulation_entry', 30 );

/**
 * Byte offset for the simulation card, or null to append it.
 *
 * Ben, 28.9.2026: after the first or second paragraph, where a reader bumps into it, with the opening text
 * still above it for search. At least ~80 reading words come first, and a section end within ~120 more
 * words is preferred. (24.9.2026, HAD-284, it came after ~250 words: a median of 328 words sat above it,
 * too far down.) The old rule (after the third </p>)
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
function justice_theme_article_simulation_offset( string $content, int $min_words = 80 ): ?int {
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
		elseif ( $words > $first['words'] + 120 ) { break; }
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
