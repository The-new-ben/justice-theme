<?php
/**
 * The article lead CTA links the clean homepage anchor (structure audit batch 14b, 15.10.2026).
 *
 * 1,749 article links used to carry ?lead_area=...&lead_message=... into the homepage URL.
 * The href is now /#ask-lawyer and the context rides in data-lead-* attributes that
 * analytics-events.js already reads (and now stores across the navigation).
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Term {
	public int $term_id;
	public string $slug;
	public string $name;
	public function __construct( int $term_id, string $slug, string $name ) {
		$this->term_id = $term_id;
		$this->slug    = $slug;
		$this->name    = $name;
	}
}

$jt_terms = array( 11 => array( new WP_Term( 68, 'family-law', 'דיני משפחה' ) ), 12 => array() );
$jt_title = array( 11 => 'הסכם גירושין "בהסכמה": מה בודקים', 12 => str_repeat( 'מילה ', 80 ) );
$jt_slug  = array( 11 => 'divorce-agreement-checks', 12 => 'long-title-article' );

function absint( $value ): int {
	return abs( (int) $value );
}
function get_the_ID(): int {
	return 11;
}
function get_the_terms( $id, $taxonomy ) {
	global $jt_terms;
	return $jt_terms[ (int) $id ] ?? array();
}
function is_wp_error( $value ): bool {
	return false;
}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function get_post_meta( $id, $key, $single = false ) {
	return '';
}
function get_post_field( $field, $id ): string {
	global $jt_slug;
	return 'post_name' === $field ? ( $jt_slug[ (int) $id ] ?? '' ) : '';
}
function get_the_title( $id = 0 ): string {
	global $jt_title;
	return $jt_title[ (int) $id ] ?? '';
}
function justice_theme_lead_area_values(): array {
	return array( 'family-law', 'criminal-law', 'real-estate-law', 'general' );
}
function __( $text, $domain = '' ) {
	return $text;
}
function home_url( $path = '' ): string {
	return 'https://jus-tice.co.il' . $path;
}
function esc_attr( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
}

require_once dirname( __DIR__ ) . '/inc/template-tags.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$cta = justice_theme_get_contextual_article_lead_cta( 11 );
jt_assert( 'https://jus-tice.co.il/#ask-lawyer' === $cta['url'], 'The CTA href is the clean homepage anchor, no query string.' );
jt_assert( false === strpos( $cta['url'], '?' ), 'No parameter in the CTA URL.' );
jt_assert( 'family-law' === $cta['lead_area'], 'The lead area still resolves from the primary term.' );
jt_assert( false !== strpos( $cta['context'], ' data-lead-area="family-law"' ), 'The area travels as data-lead-area.' );
jt_assert( false !== strpos( $cta['context'], ' data-lead-source-keyword="divorce-agreement-checks"' ), 'The source keyword travels as data-lead-source-keyword.' );
jt_assert( false !== strpos( $cta['context'], ' data-lead-message="קראתי את המאמר &quot;הסכם גירושין &quot;בהסכמה&quot;: מה בודקים&quot; ואני רוצה לבדוק' ), 'The prefilled message travels as data-lead-message, attribute-escaped.' );
jt_assert( 0 === strpos( $cta['context'], ' ' ) && 3 === substr_count( $cta['context'], ' data-lead-' ), 'Exactly three data attributes, with a leading space.' );
jt_assert( false !== strpos( $cta['title'], 'דיני משפחה' ), 'The CTA title still names the practice area.' );

$long = justice_theme_get_contextual_article_lead_cta( 12 );
preg_match( '/ data-lead-message="([^"]*)"/u', $long['context'], $m );
jt_assert( isset( $m[1] ) && mb_strlen( html_entity_decode( $m[1], ENT_QUOTES, 'UTF-8' ), 'UTF-8' ) <= 260, 'The message attribute is capped at the 260 characters the form accepts.' );
jt_assert( false === strpos( $long['context'], 'data-lead-area' ), 'No area attribute when no area resolves.' );

jt_assert( '' === justice_theme_lead_context_attributes( array() ), 'No context, no attributes.' );
jt_assert( ' data-lead-area="criminal-law"' === justice_theme_lead_context_attributes( array( 'lead_area' => "criminal-law\n" ) ), 'Whitespace is normalised and empty values are dropped.' );
jt_assert( ' data-lead-message="a &lt;b&gt; c"' === justice_theme_lead_context_attributes( array( 'lead_message' => "a <b>\n\n c" ) ), 'Values are attribute-escaped and collapsed to single spaces.' );

// Both single templates print the context on the CTA anchor and no template builds a lead query string.
foreach ( array( 'single-articles.php', 'single.php' ) as $template ) {
	$source = file_get_contents( dirname( __DIR__ ) . '/' . $template );
	jt_assert( false !== strpos( $source, "\$article_contextual_cta['context']" ), "{$template} prints the lead context on the CTA." );
	jt_assert( false === strpos( $source, 'lead_message=' ), "{$template} builds no lead query string." );
}
$tags = file_get_contents( dirname( __DIR__ ) . '/inc/template-tags.php' );
jt_assert( false === strpos( $tags, 'justice_theme_ask_lawyer_fallback_url' ), 'The article CTA no longer uses the query-string URL builder.' );

$script = file_get_contents( dirname( __DIR__ ) . '/assets/js/analytics-events.js' );
jt_assert( false !== strpos( $script, 'storeLeadContext(link, event)' ) && false !== strpos( $script, 'applyStoredLeadContext();' ), 'The theme script stores the context on the click and applies it on the homepage form.' );
jt_assert( false !== strpos( $script, "sessionStorage.setItem(LEAD_CONTEXT_KEY" ) && false !== strpos( $script, 'sessionStorage.removeItem(LEAD_CONTEXT_KEY)' ), 'The context lives for one navigation only.' );
jt_assert( false !== strpos( $script, "if (!linksToLeadForm(link)) {\n\t\t\treturn;\n\t\t}" ) && false !== strpos( $script, "'#ask-lawyer' === url.hash" ) && false !== strpos( $script, "'/' === url.pathname" ), 'Only a same-site link to /#ask-lawyer stores context; WhatsApp and profile links leave nothing behind.' );
jt_assert( false !== strpos( $script, 'event.ctrlKey || event.metaKey || event.shiftKey || event.altKey' ) && false !== strpos( $script, 'storeLeadContext(link, event)' ), 'A modified click (new tab) stores nothing in this tab.' );
jt_assert( false !== strpos( $script, 'savedAt: Date.now()' ) && false !== strpos( $script, 'Date.now() - context.savedAt > LEAD_CONTEXT_MAX_AGE_MS' ), 'A stored context expires instead of attributing a later, unrelated visit.' );
$enqueue = file_get_contents( dirname( __DIR__ ) . '/inc/enqueue.php' );
jt_assert( false !== strpos( $enqueue, "'/assets/js/analytics-events.js',\n\t\tarray(),\n\t\t'1.1.4'" ), 'The script version moved so cached copies refresh.' );

echo "article lead CTA clean URL tests passed\n";
