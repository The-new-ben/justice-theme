<?php
/**
 * HAD-461: practice-area hub descriptions keep block HTML and expose FAQPage.
 *
 * Run: php tests/test-practice-term-content.php
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_can_manage = true;

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function wp_strip_all_tags( $value ): string {
	return trim( strip_tags( (string) $value ) );
}
function current_user_can( $cap ): bool {
	global $jt_can_manage;
	return $jt_can_manage && 'manage_categories' === $cap;
}
function wp_filter_post_kses( $value ) {
	return 'POST:' . $value;
}

require dirname( __DIR__ ) . '/inc/practice-term-content.php';

function jt_assert( bool $ok, string $message ): void {
	if ( ! $ok ) {
		throw new RuntimeException( $message );
	}
}

// 1. Practice-area description: the post-kses copy replaces core's inline-only result.
$raw    = '<h2>x</h2><table><tr><td>1</td></tr></table>';
$before = justice_theme_practice_term_description_kses_before( $raw, 'practice-areas' );
jt_assert( $before === $raw, 'priority 9 must not change the value' );
$after = justice_theme_practice_term_description_kses_after( 'x1', 'practice-areas' );
jt_assert( 'POST:' . $raw === $after, 'practice-areas description must come back with post rules' );

// 2. Other taxonomies keep core behaviour.
justice_theme_practice_term_description_kses_before( $raw, 'category' );
jt_assert( 'x1' === justice_theme_practice_term_description_kses_after( 'x1', 'category' ), 'category must keep core kses' );

// 3. Users who cannot manage terms keep core behaviour.
$jt_can_manage = false;
justice_theme_practice_term_description_kses_before( $raw, 'practice-areas' );
jt_assert( 'x1' === justice_theme_practice_term_description_kses_after( 'x1', 'practice-areas' ), 'no capability, no bypass' );

// 4. FAQ pairs from the real rabbinical-court guide.
$guide = (string) file_get_contents( __DIR__ . '/fixtures/rabbinical-court-description.html' );
$pairs = justice_theme_practice_term_faq_pairs( $guide );
jt_assert( 9 === count( $pairs ), 'expected 9 FAQ pairs, got ' . count( $pairs ) );
jt_assert( false !== strpos( $pairs[0]['q'], 'בית המשפט לענייני משפחה' ), 'first question text' );
jt_assert( array() === justice_theme_practice_term_faq_pairs( '<h2>אחר</h2><h3>שאלה ארוכה</h3><p>תשובה ארוכה מספיק כאן</p>' ), 'no FAQ heading, no pairs' );

echo "practice term content: ok\n";
