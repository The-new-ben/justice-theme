<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
define( 'JUSTICE_THEME_DIR', dirname( __DIR__ ) );

class WP_Post {
	public int $ID;
	public string $post_type = 'page';
	public function __construct( int $id ) { $this->ID = $id; }
}
$jt_hooks = array();
$jt_state = array( 'path' => '', 'page_id' => 0, 'styles' => array(), 'admin' => false, 'feed' => false, 'front' => false, 'main' => true, 'singular' => true,
	'id' => 12987, 'queried' => 12987, 'look' => true );

function add_filter( $tag, $callback, $priority = 10 ): void {}
function add_action( $tag, $callback, $priority = 10 ): void { global $jt_hooks; $jt_hooks[$tag][] = $callback; }
function apply_filters( $tag, $value ) { return $value; }
function is_admin(): bool { global $jt_state; return $jt_state['admin']; }
function is_feed(): bool { global $jt_state; return $jt_state['feed']; }
function is_front_page(): bool { global $jt_state; return $jt_state['front']; }
function is_main_query(): bool { global $jt_state; return $jt_state['main']; }
function is_singular( $types = '' ): bool { global $jt_state; return $jt_state['singular']; }
function get_the_ID(): int { global $jt_state; return $jt_state['id']; }
function get_queried_object_id(): int { global $jt_state; return $jt_state['queried']; }
function justice_theme_new_look_active(): bool { global $jt_state; return $jt_state['look']; }
function esc_url( $url ) { return $url; }
function justice_theme_practice_landing_request_path(): string { global $jt_state; return $jt_state['path']; }
function get_page_by_path( $path ) { global $jt_state; return $jt_state['page_id'] ? new WP_Post( $jt_state['page_id'] ) : null; }
function wp_enqueue_style( $handle, ...$args ): void { global $jt_state; $jt_state['styles'][] = $handle; }
require_once dirname( __DIR__ ) . '/inc/hadmaya-film-card.php';

$body = '<p>גוף המאמר.</p><div class="jt-answer"><p>תשובה.</p></div>';
$out  = justice_theme_film_card( $body );
if ( 0 !== strpos( $out, $body ) ) {
	throw new RuntimeException( 'The film card must come after the article body, never inside or before it.' );
}
if ( 1 !== substr_count( $out, 'data-hadmaya-film' ) ) {
	throw new RuntimeException( 'Exactly one film card was expected.' );
}
foreach ( array( '<iframe', '<video', 'autoplay', '<script' ) as $heavy ) {
	if ( false !== stripos( $out, $heavy ) ) {
		throw new RuntimeException( 'The film card must stay quiet; found ' . $heavy );
	}
}
if ( false === strpos( $out, 'loading="lazy"' ) || false === strpos( $out, 'https://jus-tice.com/he/how-it-works/' ) ) {
	throw new RuntimeException( 'The card needs a lazy poster and a link to the Hebrew film page.' );
}
if ( justice_theme_film_card( $out ) !== $out ) {
	throw new RuntimeException( 'The film card was added twice.' );
}
foreach ( array( 'front' => true, 'look' => false, 'admin' => true, 'feed' => true, 'singular' => false, 'queried' => 1 ) as $key => $value ) {
	$saved = $jt_state[ $key ];
	$jt_state[ $key ] = $value;
	if ( justice_theme_film_card( $body ) !== $body ) {
		throw new RuntimeException( 'The card must not appear when ' . $key . ' is ' . var_export( $value, true ) );
	}
	$jt_state[ $key ] = $saved;
}
// A 404-backed route has neither a singular flag nor a queried page ID.
$jt_state['path'] = '/medical-malpractice-lawyer/';
$jt_state['page_id'] = 19193;
$jt_state['singular'] = false;
$jt_state['queried'] = 0;
$jt_state['id'] = 0;
if ( ! justice_theme_film_card_wanted( 19193 ) || justice_theme_film_card_wanted( 0 ) || justice_theme_film_card_wanted( 999 ) ) {
	throw new RuntimeException( 'Controlled route must accept only its rendered CMS page.' );
}
if ( justice_theme_film_card( $body ) !== $body ) {
	throw new RuntimeException( 'Outside-loop content filter must leave controlled route to its template.' );
}
$rendered = $body;
if ( justice_theme_film_card_wanted( 19193 ) ) {
	$rendered .= justice_theme_film_card_markup();
}
if ( 1 !== substr_count( $rendered, 'data-hadmaya-film' ) || 0 !== strpos( $rendered, $body ) ) {
	throw new RuntimeException( 'Controlled body must have one card after its content.' );
}
foreach ( $jt_hooks['wp_enqueue_scripts'] as $callback ) { $callback(); }
if ( ! in_array( 'justice-film-card', $jt_state['styles'], true ) ) {
	throw new RuntimeException( 'Controlled page stylesheet was not enqueued.' );
}
foreach ( array( '/family-law/', '/real-estate-lawyer-guide/', '/inheritance-lawyer/' ) as $path ) {
	$jt_state['path'] = $path;
	if ( ! justice_theme_film_card_wanted( 19193 ) ) {
		throw new RuntimeException( 'Controlled route not eligible: ' . $path );
	}
}
$template = file_get_contents( dirname( __DIR__ ) . '/template-parts/content/practice-landing-page.php' );
if ( false === strpos( $template, 'justice_theme_film_card_wanted( $page_id )' )
	|| false === strpos( $template, '$justice_body_html .= justice_theme_film_card_markup();' ) ) {
	throw new RuntimeException( 'Controlled template must append the card using its explicit page ID.' );
}
$jt_state['page_id'] = 0;
if ( justice_theme_film_card_wanted( 19193 ) ) {
	throw new RuntimeException( 'A controlled route without a CMS page must be excluded.' );
}
echo "hadmaya film card: ok\n";
