<?php
/**
 * Placement of the in-article simulation card (HAD-284, owner review 24.9.2026):
 * after the answer box or the first section, at least ~250 reading words above it,
 * only between top-level reading blocks, never inside another box.
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt = array( 'slug' => 'divorce-lawyer', 'id' => 1, 'queried' => 1 );

function add_filter( $tag, $callback, $priority = 10 ): void {}
function is_admin(): bool { return false; }
function is_feed(): bool { return false; }
function is_singular( $types = '' ): bool { return true; }
function is_main_query(): bool { return true; }
function get_the_ID(): int { global $jt; return $jt['id']; }
function get_queried_object_id(): int { global $jt; return $jt['queried']; }
function get_post_field( $field, $id ): string { global $jt; return $jt['slug']; }
function get_the_title( $id ): string { return 'כותרת'; }
function get_permalink( $id ): string { global $jt; return 'https://jus-tice.co.il/' . $jt['slug'] . '/'; }
function justice_theme_new_look_active(): bool { return true; }
function justice_theme_cluster_for_slug( $slug ) {
	return array( 'divorce-lawyer' => array( 'key' => 'family-law' ), 'criminal-defense-attorney' => array( 'key' => 'criminal-law' ) )[ $slug ] ?? null;
}
function wp_strip_all_tags( $text ): string { return strip_tags( (string) $text ); }
function esc_attr( $text ): string { return htmlspecialchars( (string) $text, ENT_QUOTES ); }
function esc_url( $url ): string { return htmlspecialchars( (string) $url, ENT_QUOTES ); }

require_once dirname( __DIR__ ) . '/inc/article-simulation-entry.php';

$checks = 0;
function check( bool $ok, string $message ): void {
	global $checks;
	if ( ! $ok ) { throw new RuntimeException( $message ); }
	$checks++;
}
function words( int $n, string $word = 'מילה' ): string { return trim( str_repeat( $word . ' ', $n ) ); }
function p( int $n, string $end = '.' ): string { return '<p>' . words( $n ) . $end . '</p>'; }
/** Reading words above the card, counted the way a reader meets them (asides and navigation excluded). */
function words_before_card( string $out ): int {
	$at = strpos( $out, '<aside class="l3-article-simulation"' );
	$before = preg_replace( '#<(nav|aside|details)\b.*?</\1>#s', '', substr( $out, 0, $at ) );
	$text = trim( preg_replace( '/<[^>]+>/', ' ', $before ) );
	return '' === $text ? 0 : count( preg_split( '/\s+/u', $text ) );
}
function card_parent_is_top_level( string $out ): bool {
	$at = strpos( $out, '<aside class="l3-article-simulation"' );
	$blocks = justice_theme_article_simulation_blocks( substr( $out, 0, $at ) . '<p>x</p>' );
	$last = end( $blocks );
	return $last && 'p' === $last['name'] && $last['end'] === $at + 8; // The probe paragraph closed at top level.
}
function without_card( string $out ): string { return preg_replace( '#<aside class="l3-article-simulation".*?</aside>#s', '', $out, 1 ); }
function place( string $content ): string {
	$out = justice_theme_article_simulation_entry( $content );
	check( 1 === substr_count( $out, 'data-hadmaia-article-entry=' ), 'exactly one card' );
	check( without_card( $out ) === $content, 'article content and links are untouched' );
	check( $out === justice_theme_article_simulation_entry( $out ), 'idempotent' );
	return $out;
}

// 1. Court ruling: one-line header paragraphs no longer count as "three paragraphs".
$ruling = '<p>ב"ה</p><p>תיק 1381290/2</p><p>בבית הדין הרבני האזורי ירושלים</p><p>לפני כבוד הדיינים:</p>'
	. str_repeat( p( 40 ), 12 );
$out = place( $ruling );
check( words_before_card( $out ) >= 250, 'ruling: at least 250 words above the card, got ' . words_before_card( $out ) );
check( words_before_card( $out ) < 330, 'ruling: the card still comes early, got ' . words_before_card( $out ) );
check( card_parent_is_top_level( $out ), 'ruling: card at top level' );

// 2. Short city page: the card goes after the article text, never inside the appended cluster box.
$city = '<p>' . words( 25 ) . '</p><h2>מחירים</h2><figure class="wp-block-table"><table><tr><td>שירות</td><td>4,000 ₪</td></tr></table></figure>'
	. '<p><a href="/family-law/">מדריך דיני משפחה</a></p>'
	. '<aside class="cluster-backlink"><p class="cluster-backlink__parent">חלק מהמדריך: <a href="/divorce-lawyer/">עורך דין גירושין</a></p><p class="cluster-backlink__siblings">ראו גם: <a href="/a/">א</a></p></aside>';
$out = place( $city );
check( false !== strpos( $out, '</p><aside class="l3-article-simulation"' ) && strpos( $out, 'l3-article-simulation' ) < strpos( $out, 'cluster-backlink' ), 'short page: card right before the cluster box' );
check( 1 === substr_count( $out, '<aside class="cluster-backlink"><p class="cluster-backlink__parent">' ), 'short page: cluster box intact and unbroken' );

// 3. Table of contents first: its links are not reading words and the card never enters it.
$toc = '<nav class="jt-nav-toc"><p>בעמוד הזה</p><ul><li><a href="#a">' . words( 30 ) . '</a></li></ul></nav>'
	. '<h2 id="a">פרק</h2>' . p( 120 ) . p( 140 ) . p( 100 ) . '<h2>פרק ב</h2>' . p( 200 );
$out = place( $toc );
check( strpos( $out, 'l3-article-simulation' ) > strpos( $out, '</nav>' ), 'toc: card after the table of contents' );
check( false !== strpos( $out, '</p><aside class="l3-article-simulation"' ) && false !== strpos( $out, '</aside><h2>פרק ב</h2>' ), 'toc: card closes the first section, right before the next h2' );

// 4. Answer box opens the page: the card comes after it, never inside it.
$answer = '<div class="jt-answer"><p class="jt-answer__label">בקצרה</p><p>' . words( 280 ) . '</p></div>' . p( 60 ) . p( 60 ) . '<h2>המשך</h2>' . p( 100 );
$out = place( $answer );
check( strpos( $out, 'l3-article-simulation' ) > strpos( $out, '</div>' ), 'answer: card after the answer box' );
check( card_parent_is_top_level( $out ), 'answer: card at top level' );

// 5. A section end is preferred when it is near; a far one is not worth waiting for.
$near = p( 130 ) . p( 130 ) . p( 100 ) . '<h2>סעיף</h2>' . p( 100 );
$out = place( $near );
check( false !== strpos( $out, '</aside><h2>סעיף</h2>' ), 'near section end preferred' );
$far = p( 260 ) . p( 400 ) . p( 100 ) . '<h2>סעיף</h2>' . p( 100 );
$out = place( $far );
check( 260 === words_before_card( $out ), 'far section end not awaited, got ' . words_before_card( $out ) );

// 6. Never next to the professional card or the mid-article strip.
$cards = p( 300 ) . '<div class="jt-procard jt-procard--house"><p>עו"ד</p></div><h2>סעיף ב</h2>' . p( 50 ) . p( 50 ) . '<h2>סעיף ג</h2>' . p( 50 );
$out = place( $cards );
check( false === strpos( $out, '</div><aside class="l3-article-simulation"' ) && false === strpos( $out, '</aside><div class="jt-procard' ), 'not adjacent to the professional card' );
check( false !== strpos( $out, '</aside><h2>סעיף ג</h2>' ), 'professional card: card closes the next section instead' );
$fold = p( 300 ) . '<div class="single-article__fold"><a href="/#ask-lawyer">פנייה</a></div>' . p( 40 ) . p( 40 );
$out = place( $fold );
check( false === strpos( $out, 'single-article__fold"><a href="/#ask-lawyer">פנייה</a></div><aside' ) && false === strpos( $out, '</aside><div class="single-article__fold' ), 'not adjacent to the mid-article strip' );

// 7. A paragraph that introduces a list stays with its list.
$intro = p( 255, ':' ) . '<ul><li>' . words( 10 ) . '</li><li>' . words( 10 ) . '</li></ul>' . p( 40 ) . p( 40 );
$out = place( $intro );
check( false === strpos( $out, ':</p><aside class="l3-article-simulation"' ), 'not between "the documents:" and its list' );
check( false !== strpos( $out, '</ul><aside class="l3-article-simulation"' ), 'card after the list' );

// 8. Never inside nested lists, tables or quotes; unclosed paragraphs and scripts are handled.
$nested = '<ul><li><p>' . words( 150 ) . '</p></li><li><p>' . words( 150 ) . '</p></li></ul>'
	. '<table><tr><td><p>' . words( 20 ) . '</p></td></tr></table><p>' . words( 30 ) . '<p>' . words( 30 )
	. '<script>var s = "<p>' . words( 500 ) . '</p>";</script>' . p( 20 ) . p( 20 );
$out = place( $nested );
check( card_parent_is_top_level( $out ), 'nested: card at top level' );
check( false === strpos( $out, '<li><p>' . words( 150 ) . '</p><aside' ), 'nested: never inside a list item' );

// 9. The phone card shows the short form of the sentence; the full one stays for larger screens.
check( false !== strpos( $out, 'בבית המשפט<span class="l3-article-simulation__more">: הטענות של הצד השני' ), 'compact phone clause wrapper' );

// 10. Criminal pages keep the investigation pilot; the placement rule is shared.
$jt['slug'] = 'criminal-defense-attorney';
$out = place( $ruling );
check( 1 === substr_count( $out, 'data-investigation-interest="pilot"' ) && false === strpos( $out, 'purpose=mediation' ), 'criminal variant unchanged' );
check( words_before_card( $out ) >= 250, 'criminal: at least 250 words above the card' );

// 11. Empty or text-less content still gets the card at the end (never dropped).
$jt['slug'] = 'divorce-lawyer';
check( str_starts_with( justice_theme_article_simulation_entry( '' ), '<aside class="l3-article-simulation"' ), 'empty body: card appended' );

echo $checks . " article simulation placement checks passed\n";
